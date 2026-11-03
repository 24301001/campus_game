/* 在真浏览器里复现：开一间 → 离开 → 再点进别人的房。
   只在 headless Edge 里点按钮，捕获控制台异常与每一步的 DOM 状态。 */
const { spawn } = require('child_process');
const fs = require('fs');
process.env.NO_PROXY = '127.0.0.1,localhost';
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const RUN = Date.now().toString(36);
const ORIGIN = 'http://120.48.99.240';
const LOBBY = ORIGIN, BRIDGE = ORIGIN;
const sleep = m => new Promise(r => setTimeout(r, m));

async function api(method, path, body, token) {
  const h = { 'Content-Type': 'application/json' };
  if (token) h.Authorization = 'Bearer ' + token;
  const r = await fetch((path.startsWith('/game') ? BRIDGE : LOBBY) + path, {
    method, headers: h, body: body ? JSON.stringify(body) : undefined });
  let d = {}; try { d = await r.json(); } catch (e) {}
  return { st: r.status, d };
}

async function account(nick) {
  const tag = String(Date.now()).slice(-6);
  const name = nick + tag, pw = 'pw' + tag + 'xx';
  await api('POST', '/api/mp/register', { nickname: name, password: pw });
  const r = await api('POST', '/api/mp/login', { nickname: name, password: pw });
  return { token: r.d.token, id: (r.d.user || {}).id, name };
}

async function wsUrl(port) {
  for (let i = 0; i < 50; i++) {
    try { const r = await fetch(`http://127.0.0.1:${port}/json/list`);
      const a = await r.json(); const p = a.find(t => t.type === 'page' && t.webSocketDebuggerUrl);
      if (p) return p.webSocketDebuggerUrl; } catch (e) {}
    await sleep(700);
  } throw new Error('no cdp');
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
const val = async (c, e, t = 30000) => (await c.send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true }, )).result.value;

(async () => {
  const A = await account('探A'), B = await account('探B');
  console.log('账号 A id=' + A.id + '  B id=' + B.id);
  const mk = await api('POST', '/game/duo1/create', { name: 'B的房' }, B.token);
  const rid = (mk.d.room || {}).id;
  console.log('B 建房 →', mk.st, rid);

  const port = 9831;
  fs.rmSync('E:/tmp/cdp-leave' + port + RUN, { recursive: true, force: true });
  const edge = spawn(EDGE, ['--headless=new', '--no-first-run', '--guest', '--disable-sync',
    `--remote-debugging-port=${port}`, `--user-data-dir=E:/tmp/cdp-leave${port}${RUN}`,
    '--window-size=1280,860', 'about:blank'], { stdio: 'ignore' });
  const c = await connect(await wsUrl(port));
  await c.send('Page.enable'); await c.send('Runtime.enable');
  try {
    await c.send('Page.navigate', { url: ORIGIN + '/game/duo1' });
    await sleep(1500);
    await val(c, `localStorage.setItem("mpToken", ${JSON.stringify(A.token)}); "ok"`);
    await c.send('Page.navigate', { url: ORIGIN + '/game/duo1' });
    await sleep(3000);

    const st = async (tag) => {
      const s = JSON.parse(await val(c, `JSON.stringify({
        me: document.getElementById('me').textContent,
        listHint: document.getElementById('listHint').textContent,
        roomHint: document.getElementById('roomHint').textContent,
        roomColHidden: document.getElementById('roomCol').hidden,
        rooms: document.querySelectorAll('#rooms li.room').length,
        buttons: Array.from(document.querySelectorAll('#rooms [data-join],#rooms button')).map(b => (b.textContent||'').trim() + (b.disabled ? '(禁用)' : '')),
        createDisabled: document.getElementById('createBtn').disabled,
        createTitle: document.getElementById('createBtn').title
      })`));
      console.log('  [' + tag + ']', JSON.stringify(s));
      return s;
    };

    await st('打开大厅');
    await val(c, `document.getElementById('createBtn').click(); 1`);
    await sleep(2500);
    await st('A 开了房');
    await val(c, `document.getElementById('leaveBtn').click(); 1`);
    await sleep(2500);
    const after = await st('A 离开后');

    // 再点进 B 的房
    const clicked = await val(c, `(() => {
      const b = Array.from(document.querySelectorAll('#rooms [data-join]')).find(x => x.textContent.includes('进入'))
             || document.querySelector('#rooms [data-join]');
      if (!b) return '没有可点的进房按钮';
      b.click(); return '已点: ' + b.textContent.trim();
    })()`);
    console.log('  点击 →', clicked);
    await sleep(3000);
    await st('点了 B 的房之后');

    console.log('  控制台异常:', c.excs.length); [...new Set(c.excs)].slice(0, 5).forEach(x => console.log('    !', x));
    const err = c.logs.filter(x => /error|Error|失败|undefined/i.test(x));
    console.log('  可疑控制台:', err.length); [...new Set(err)].slice(0, 5).forEach(x => console.log('    ·', x));
  } catch (e) { console.log('出错:', e.message); }
  finally {
    try { c.close(); } catch (x) {}
    try { require('child_process').execSync('taskkill /PID ' + edge.pid + ' /T /F', { stdio: 'ignore' }); } catch (x) {}
    await api('POST', '/game/duo1/leave', { id: rid }, B.token);
  }
  process.exit(0);
})();
