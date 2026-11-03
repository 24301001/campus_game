/* 两个无头 Edge 进同一间 3D 房，读各自的 window.__net：
   看"对端有没有被收到(peerSeen)"和"模型建没建好/可不可见(peer.ready / gunVisible / at)"。 */
const { spawn, execSync } = require('child_process');
const fs = require('fs');
process.env.NO_PROXY = '127.0.0.1,localhost';
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const URL = 'http://120.48.99.240/duo1/?room=DBG' + String(Date.now()).slice(-4);
const RUN = Date.now().toString(36);
const sleep = m => new Promise(r => setTimeout(r, m));

async function wsUrl(port) {
  for (let i = 0; i < 40; i++) {
    try { const r = await fetch(`http://127.0.0.1:${port}/json/list`);
      const a = await r.json(); const p = a.find(t => t.type === 'page' && t.webSocketDebuggerUrl);
      if (p) return p.webSocketDebuggerUrl; } catch (e) {}
    await sleep(500);
  } throw new Error('no cdp ' + port);
}
function connect(u) {
  return new Promise((res, rej) => {
    const ws = new WebSocket(u); let id = 0; const pen = new Map(); const excs = []; const logs = [];
    ws.onopen = () => res({ excs, logs,
      send(m, p = {}) { return new Promise((r2, j) => { const n = ++id; pen.set(n, { r: r2, j }); ws.send(JSON.stringify({ id: n, method: m, params: p })); }); },
      close: () => ws.close() });
    ws.onerror = () => rej(new Error('ws error'));
    ws.onmessage = ev => { const m = JSON.parse(ev.data);
      if (m.method === 'Runtime.exceptionThrown') excs.push((((m.params.exceptionDetails.exception || {}).description) || m.params.exceptionDetails.text || '').split('\n')[0].slice(0, 200));
      if (m.method === 'Runtime.consoleAPICalled') logs.push((m.params.args || []).map(a => a.value || a.description || '').join(' ').slice(0, 200));
      if (m.id && pen.has(m.id)) { const { r, j } = pen.get(m.id); pen.delete(m.id); m.error ? j(new Error(JSON.stringify(m.error))) : r(m.result); } };
  });
}
const val = async (c, e) => (await c.send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true })).result.value;

async function launch(tag, port) {
  const dir = `E:/tmp/cdp-dual${port}${RUN}`;
  fs.rmSync(dir, { recursive: true, force: true });
  const p = spawn(EDGE, ['--headless=new', '--no-first-run', '--guest', '--disable-sync',
    `--remote-debugging-port=${port}`, `--user-data-dir=${dir}`,
    '--enable-unsafe-swiftshader', '--use-angle=swiftshader', '--window-size=1000,700', 'about:blank'],
    { stdio: 'ignore' });
  const c = await connect(await wsUrl(port));
  await c.send('Page.enable'); await c.send('Runtime.enable');
  await c.send('Page.navigate', { url: URL });
  return { tag, p, c };
}

(async () => {
  console.log('房间:', URL);
  const A = await launch('A', 9841);
  await sleep(2000);
  const B = await launch('B', 9842);
  // 老机 1 Mbps：8.7 MB 资源大概要 70 秒，连接代码在资源加载完之后才跑。
  // 所以这里按 connected 轮询，而不是死等固定秒数。
  const waitConnected = async (x, budget = 210000) => {
    const t0 = Date.now();
    while (Date.now() - t0 < budget) {
      const n = await val(x.c, `(window.__net && window.__net.connected) ? "1" : "0"`);
      if (n === '1') return Math.round((Date.now() - t0) / 1000);
      await sleep(4000);
    }
    return -1;
  };
  const ta = await waitConnected(A);
  console.log('A 连上用时:', ta, '秒');
  const tb = await waitConnected(B);
  console.log('B 连上用时:', tb, '秒');
  await sleep(6000);
  const waitReady = async (x, name, budget = 240000) => {
    const t0 = Date.now();
    while (Date.now() - t0 < budget) {
      const n = await val(x.c, `(window.__net && window.__net.peer && window.__net.peer.ready) ? "1" : "0"`);
      if (n === '1') { console.log(name + ' 模型就绪（本阶段等了 ' + Math.round((Date.now() - t0) / 1000) + ' 秒）'); return true; }
      await sleep(5000);
    }
    console.log(name + ' 等了 ' + budget / 1000 + ' 秒模型仍未就绪');
    return false;
  };
  await waitReady(A, 'A');
  await waitReady(B, 'B');
  await sleep(4000);
  for (const x of [A, B]) {
    const n = await val(x.c, `JSON.stringify(window.__net || null)`);
    console.log('\n[' + x.tag + '] __net =', n);
    console.log('  异常:', x.c.excs.length, x.c.excs.slice(0, 3).join(' | '));
    const warn = x.c.logs.filter(s => /error|Error|失败|null|undefined/i.test(s));
    console.log('  可疑日志:', warn.length, [...new Set(warn)].slice(0, 3).join(' | '));
    try {
      const s = await x.c.send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(`E:/tmp/duo1-${x.tag}.png`, Buffer.from(s.data, 'base64'));
      console.log('  截图 → E:/tmp/duo1-' + x.tag + '.png');
    } catch (e) {}
  }
  for (const x of [A, B]) { try { x.c.close(); } catch (e) {} try { execSync('taskkill /PID ' + x.p.pid + ' /T /F', { stdio: 'ignore' }); } catch (e) {} }
  process.exit(0);
})();
