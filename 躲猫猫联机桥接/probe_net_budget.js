/* 抓首屏真实网络账：按 encodedDataLength（压缩后）排名，并标出 Content-Encoding。
   用途：找出"下一个值得压的东西"，而不是凭文件大小猜。 */
const { spawn, execSync } = require('child_process');
const fs = require('fs');
process.env.NO_PROXY = '127.0.0.1,localhost';
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const URL = 'http://120.48.99.240/duo1/?room=NT' + String(Date.now()).slice(-4);
const RUN = Date.now().toString(36);
const sleep = m => new Promise(r => setTimeout(r, m));

async function wsUrl(port) {
  for (let i = 0; i < 40; i++) {
    try { const r = await fetch(`http://127.0.0.1:${port}/json/list`);
      const a = await r.json(); const p = a.find(t => t.type === 'page' && t.webSocketDebuggerUrl);
      if (p) return p.webSocketDebuggerUrl; } catch (e) {}
    await sleep(500);
  } throw new Error('no cdp');
}
function connect(u) {
  return new Promise((res, rej) => {
    const ws = new WebSocket(u); let id = 0; const pen = new Map(); const items = new Map();
    ws.onopen = () => res({ items,
      send(m, p = {}) { return new Promise((r2, j) => { const n = ++id; pen.set(n, { r: r2, j }); ws.send(JSON.stringify({ id: n, method: m, params: p })); }); },
      close: () => ws.close() });
    ws.onerror = () => rej(new Error('ws error'));
    ws.onmessage = ev => { const m = JSON.parse(ev.data);
      if (m.method === 'Network.responseReceived') {
        const r = m.params.response;
        items.set(m.params.requestId, { url: r.url, type: m.params.type, enc: r.headers['content-encoding'] || r.headers['Content-Encoding'] || '', ct: r.headers['content-type'] || r.headers['Content-Type'] || '', status: r.status, bytes: 0, size: 0 });
      }
      if (m.method === 'Network.loadingFinished') {
        const it = items.get(m.params.requestId);
        if (it) it.bytes = m.params.encodedDataLength || 0;
      }
      if (m.id && pen.has(m.id)) { const { r, j } = pen.get(m.id); pen.delete(m.id); m.error ? j(new Error(JSON.stringify(m.error))) : r(m.result); } };
  });
}
const val = async (c, e) => (await c.send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true })).result.value;

(async () => {
  const port = 9871, dir = `E:/tmp/cdp-nt${port}${RUN}`;
  fs.rmSync(dir, { recursive: true, force: true });
  const p = spawn(EDGE, ['--headless=new', '--no-first-run', '--guest', '--disable-sync',
    `--remote-debugging-port=${port}`, `--user-data-dir=${dir}`,
    '--enable-unsafe-swiftshader', '--use-angle=swiftshader', '--window-size=1000,700', 'about:blank'],
    { stdio: 'ignore' });
  const c = await connect(await wsUrl(port));
  await c.send('Page.enable'); await c.send('Runtime.enable'); await c.send('Network.enable');
  await c.send('Page.navigate', { url: URL });
  // 等到模型就绪（或 150 秒）
  for (let i = 0; i < 150; i++) {
    await sleep(1000);
    const r = await val(c, `!!(window.__load && window.__load.ready)`);
    if (r) break;
  }
  await sleep(3000);
  const rows = [...c.items.values()].filter(x => x.bytes > 0).sort((a, b) => b.bytes - a.bytes);
  const total = rows.reduce((s, x) => s + x.bytes, 0);
  console.log(`首屏共 ${rows.length} 个请求，压缩后合计 ${(total / 1048576).toFixed(2)} MB\n`);
  console.log('  字节(压缩后)  编码    类型        文件');
  for (const x of rows.slice(0, 18)) {
    const name = decodeURIComponent(x.url.split('/').slice(-2).join('/')).slice(0, 46);
    console.log(`  ${String((x.bytes / 1024).toFixed(0)).padStart(7)} KB  ${(x.enc || '-').padEnd(6)} ${String(x.type).padEnd(10)} ${name}`);
  }
  // 按目录/类型汇总
  const by = {};
  for (const x of rows) {
    const k = x.url.includes('/assets/') ? 'assets/*' : x.url.includes('/vendor/') ? 'vendor/*' : x.url.includes('.js') ? '*.js(其余)' : x.type;
    by[k] = (by[k] || 0) + x.bytes;
  }
  console.log('\n  按类汇总：');
  for (const [k, v] of Object.entries(by).sort((a, b) => b[1] - a[1])) {
    console.log(`    ${k.padEnd(16)} ${(v / 1024).toFixed(0)} KB  (${(100 * v / total).toFixed(0)}%)`);
  }
  try { c.close(); } catch (e) {}
  try { execSync('taskkill /PID ' + p.pid + ' /T /F', { stdio: 'ignore' }); } catch (e) {}
  process.exit(0);
})();
