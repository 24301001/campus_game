/* 验收：加载进度条 + 进场门。
   1) 进度条要涨；2) 没 ready 时点 #overlay 不能进（overlay 不隐藏）；3) ready 后文案切换。 */
const { spawn, execSync } = require('child_process');
const fs = require('fs');
process.env.NO_PROXY = '127.0.0.1,localhost';
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const URL = 'http://120.48.99.240/duo1/?room=LB' + String(Date.now()).slice(-4);
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
    const ws = new WebSocket(u); let id = 0; const pen = new Map();
    ws.onopen = () => res({
      send(m, p = {}) { return new Promise((r2, j) => { const n = ++id; pen.set(n, { r: r2, j }); ws.send(JSON.stringify({ id: n, method: m, params: p })); }); },
      close: () => ws.close() });
    ws.onerror = () => rej(new Error('ws error'));
    ws.onmessage = ev => { const m = JSON.parse(ev.data);
      if (m.id && pen.has(m.id)) { const { r, j } = pen.get(m.id); pen.delete(m.id); m.error ? j(new Error(JSON.stringify(m.error))) : r(m.result); } };
  });
}
const val = async (c, e) => (await c.send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true })).result.value;

(async () => {
  const port = 9861, dir = `E:/tmp/cdp-lb${port}${RUN}`;
  fs.rmSync(dir, { recursive: true, force: true });
  const p = spawn(EDGE, ['--headless=new', '--no-first-run', '--guest', '--disable-sync',
    `--remote-debugging-port=${port}`, `--user-data-dir=${dir}`,
    '--enable-unsafe-swiftshader', '--use-angle=swiftshader', '--window-size=1000,700', 'about:blank'],
    { stdio: 'ignore' });
  const c = await connect(await wsUrl(port));
  await c.send('Page.enable'); await c.send('Runtime.enable');
  const t0 = Date.now();
  await c.send('Page.navigate', { url: URL });

  const snap = async () => JSON.parse(await val(c, `JSON.stringify({
    ready: !!(window.__load && window.__load.ready),
    pct: (document.getElementById('ovSub') || {}).textContent,
    bar: (document.getElementById('ovBar') || {}).style ? document.getElementById('ovBar').style.width : null,
    barHidden: document.getElementById('ovBarWrap') ? document.getElementById('ovBarWrap').classList.contains('hidden') : null,
    overlayHidden: document.getElementById('overlay').classList.contains('hidden'),
    maskHidden: document.getElementById('loadMask') ? document.getElementById('loadMask').classList.contains('hidden') : null,
    maskText: (document.getElementById('maskSub') || {}).textContent,
    maskBar: (document.getElementById('maskBar') || {}).style ? document.getElementById('maskBar').style.width : null,
    hasLoadEl: !!document.getElementById('ovSub')
  })`));

  let gate = '未测', last = null;
  for (let i = 0; i < 90; i++) {
    await sleep(3000);
    const s = await snap();
    last = s;
    const t = Math.round((Date.now() - t0) / 1000);
    if (i % 3 === 0 || s.ready) console.log(`  ${t}s  ready=${s.ready}  遮罩=${s.maskHidden ? '已撤' : '显示'}  ${s.maskText}  条宽=${s.maskBar}`);
    if (!s.ready && gate === '未测' && t >= 12) {
      // 未 ready 时点一下屏幕中央：遮罩应该还在、鼠标不该被锁
      const r = await val(c, `(() => {
        const el = document.elementFromPoint(innerWidth/2, innerHeight/2);
        const id = el ? (el.id || el.tagName) : '(null)';
        if (el) el.click();
        return id;
      })()`);
      await sleep(1200);
      const s2 = await snap();
      gate = (s2.maskHidden === false && s2.ready === false) ? '挡住（正确）' : ('没挡住！maskHidden=' + s2.maskHidden);
      console.log(`  点击测试(未就绪): 点到=${r}  → ${gate}`);
    }
    if (s.ready) break;
  }
  console.log('  最终:', JSON.stringify(last));
  console.log('  就绪后文案是否正确:', /点击进入/.test(last.pct) ? '是' : '否');
  try { c.close(); } catch (e) {}
  try { execSync('taskkill /PID ' + p.pid + ' /T /F', { stdio: 'ignore' }); } catch (e) {}
  process.exit(0);
})();
