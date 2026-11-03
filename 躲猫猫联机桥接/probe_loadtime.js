/* 单个无头 Edge 测"打开页面 → 对方模型就绪"的耗时。
   模型加载与有没有对端无关（buildPeer 在启动时就跑），所以单人即可测。 */
const { spawn, execSync } = require('child_process');
const fs = require('fs');
process.env.NO_PROXY = '127.0.0.1,localhost';
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const TAG = process.argv[2] || 'run';
const URL = 'http://120.48.99.240/duo1/?room=T' + String(Date.now()).slice(-4);
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
    const ws = new WebSocket(u); let id = 0; const pen = new Map(); const net = [];
    ws.onopen = () => res({ net,
      send(m, p = {}) { return new Promise((r2, j) => { const n = ++id; pen.set(n, { r: r2, j }); ws.send(JSON.stringify({ id: n, method: m, params: p })); }); },
      close: () => ws.close() });
    ws.onerror = () => rej(new Error('ws error'));
    ws.onmessage = ev => { const m = JSON.parse(ev.data);
      if (m.method === 'Network.responseReceived') { const r = m.params.response;
        if (/\.(glb|js|png|webp|jpg)$/i.test(r.url)) net.push({ u: r.url.split('/').pop(), t: m.params.timestamp, s: r.status, len: 0 }); }
      if (m.method === 'Network.loadingFinished') { /* 长度另取 */ }
      if (m.id && pen.has(m.id)) { const { r, j } = pen.get(m.id); pen.delete(m.id); m.error ? j(new Error(JSON.stringify(m.error))) : r(m.result); } };
  });
}
const val = async (c, e) => (await c.send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true })).result.value;

(async () => {
  const port = 9851;
  const dir = `E:/tmp/cdp-lt${port}${RUN}`;
  fs.rmSync(dir, { recursive: true, force: true });
  const p = spawn(EDGE, ['--headless=new', '--no-first-run', '--guest', '--disable-sync',
    `--remote-debugging-port=${port}`, `--user-data-dir=${dir}`,
    '--enable-unsafe-swiftshader', '--use-angle=swiftshader', '--window-size=1000,700', 'about:blank'],
    { stdio: 'ignore' });
  const c = await connect(await wsUrl(port));
  await c.send('Page.enable'); await c.send('Runtime.enable'); await c.send('Network.enable');
  const t0 = Date.now();
  await c.send('Page.navigate', { url: URL });
  let ready = -1, conn = -1;
  for (let i = 0; i < 240; i++) {
    await sleep(1000);
    const s = await val(c, `(window.__net ? (window.__net.connected?"1":"0")+","+(window.__net.peer&&window.__net.peer.ready?"1":"0") : "0,0")`);
    const [cd, rd] = String(s).split(',');
    if (cd === '1' && conn < 0) conn = Math.round((Date.now() - t0) / 1000);
    if (rd === '1') { ready = Math.round((Date.now() - t0) / 1000); break; }
  }
  const kbps = await val(c, `window.__net ? window.__net.kbps : null`);
  const dbg = await val(c, `window.__net && window.__net.peer ? JSON.stringify(window.__net.peer) : null`);
  console.log(`[${TAG}] 连接=${conn}s  模型就绪=${ready}s  实时速率=${kbps} KB/s  URL=${URL}`);
  console.log(`  模型细节: ${dbg}`);
  const glb = c.net.filter(x => /\.glb$/i.test(x.u));
  console.log(`  首次请求到的 glb: ${glb.map(x => x.u + "(" + x.s + ")").join(", ") || "无记录"}`);
  try { c.close(); } catch (e) {}
  try { execSync('taskkill /PID ' + p.pid + ' /T /F', { stdio: 'ignore' }); } catch (e) {}
  process.exit(0);
})();
