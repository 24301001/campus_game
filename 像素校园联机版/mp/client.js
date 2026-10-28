/* =====================================================================
 * 像素校园 · 二期联机客户端（mp/client.js）
 * ---------------------------------------------------------------
 * 本文件是**独立文件**，由多人版 HTML 在主脚本之后加载。它能直接读到主脚本
 * 顶层的那些 `const`（`player` / `CENTER` / `ROOMS` / `CH_AX` / `charSprite` …）——
 * 同一个 document 里的普通 script 共享一份全局词法环境，这是本文件成立的前提。
 *
 * 分工（任务书 §7.1）：
 *   · 网络逻辑**不进 rAF**：100 ms 一个定时器采样自己的位置往外报（≤10 Hz）；
 *   · rAF 里只做两件小事：把收到的别人位置按 120 ms 线性插值，和塞进 drawList；
 *   · 别人**不参与碰撞**（撞上去直接穿过），也不改动一期任何走位代码。
 *
 * 回落（§7.7）：没票 / 网关连不上（3 次重传失败）/ 票被判定无效（4003）
 *   ⇒ 单机模式：不画别人、不出昵称、顶部一条细条 3 秒自己收走。
 *   ⚠️ 单机模式**一个 `mp_*` 键都不写**，也不拦任何一期的玩法。
 *
 * 与 8090 网关的约定（§6.1）：`ws://<host>:8090/mp?token=<8081 主 JWT>`。
 *   ⚠️ 这里**故意不走同源代理**：WebSocket 没有跨域限制，票就带在查询串里，
 *      代理反而会把静态目录 `mp/` 那个前缀抢走。
 * =============================================================== */

/* --- 0. 状态 --------------------------------------------------------- */
const MP = {
  state: "off",          // off（没票，静默单机）| connecting | online | retrying（退避中）| solo（回落）| kicked（被踢，不重连）
  ws: null,
  me: null,              // {id, nickname, look}
  scene: "out",          // 服务端认为我在的那个场景
  peers: new Map(),      // id -> 插值状态
  rx: 960, ry: 540,      // 「2 屏」粗筛半径，随缩放档更新
  viewStale: false,
  sentX: NaN, sentY: NaN, sentDir: "",
  attempts: 0,           // 连续失败次数（≥3 ⇒ 单机）
  openAt: 0,             // ws 打开的时刻：10 秒等不到 welcome 就当这次报到废了
  ticks: 0,              // 100 ms 计数：150 拍 = 15 s 心跳
  silence: 0,            // 距上次收到任何消息的拍数
  lastNotice: 0,
  kickToken: ""          // 被 4001 顶掉时手里那张票：票换了才允许重新连
};
const MP_LERP_MS = 120;          // §7.1 客户端插值窗口
const MP_SEND_MS = 100;          // §7.1 上报频率 10 Hz
const MP_HB_TICKS = 150;         // 15 s 心跳
const MP_SILENT_TICKS = 480;     // 48 s 毫无动静 ⇒ 自己判死，主动重连（服务端 45 s 就踢人了）
const MP_BACKOFF = [1000, 2000, 4000, 8000, 16000, 30000];   // §6.1 关闭码 4008 那一档的重连节奏
const MP_SOLO_AFTER = 3;         // §7.7 触发条件②：3 次连不上 ⇒ 落单机

/* 房间 key → 场景 ID（§3.3 沿用 `交互.md` 的点位前缀）。
   食堂/计算机中心这几间房以后加多少间都只动这张表。 */
const MP_SCENES = { center: "cs", yifu: "yifu1", canteen: "canteen" };
function mpSceneOf(key) { return MP_SCENES[key] || String(key || "out"); }

/* --- 1. 我的形象配方 -------------------------------------------------
   配方的结构与白名单归模块 3 的 `mp/look.js`（`mpDefaultLook` / `mpNormLook`），
   这里只管"读本地缓存"。look.js 没加载（文件没拷过来）时退回一张中性脸，
   协议里那七个字段一个字都不改。 */
function mpMyLookFallback() {
  return { skin: "#e9bb92", hairStyle: "short", hairColor: "#241d1a", eye: "round",
           eyeColor: "#3a2a20", cloth: "#3f6ea8", pants: "#454c5a", acc: "none",
           accColor: "#5a6270" };
}
function mpMyLook() {
  try {
    const raw = localStorage.getItem("mp_look");
    if (raw) {
      const o = JSON.parse(raw);
      if (o && typeof o === "object") {
        if (typeof mpNormLook === "function") { const L = mpNormLook(o); if (L) return L; }
        return Object.assign(mpMyLookFallback(), o);
      }
    }
  } catch (e) {}
  /* 服务端那份为准（换设备登录时本地没有缓存）：`welcome.me.look` 会把它填回来。 */
  if (typeof mpDefaultLook === "function") return mpDefaultLook();
  return mpMyLookFallback();
}
function mpMyNickname() {
  try {
    const u = JSON.parse(localStorage.getItem("user") || "null");
    if (u && (u.nickname || u.username)) return String(u.nickname || u.username);
  } catch (e) {}
  return "";
}

/* --- 2. 票与地址 ----------------------------------------------------- */
function mpTicket() {
  try { return typeof mpToken === "function" ? (mpToken() || "") : (localStorage.getItem("token") || ""); }
  catch (e) { return ""; }
}
function mpWsUrl() {
  /* 想在别的机器上看联机效果：localStorage.setItem("mp_gateway","ws://192.168.x.x:8090/mp") */
  try {
    const o = localStorage.getItem("mp_gateway");
    if (o && /^wss?:\/\//.test(o)) return o;
  } catch (e) {}
  let host = "127.0.0.1";
  try {
    if (location.protocol !== "file:" && location.hostname) host = location.hostname;
  } catch (e) {}
  /* https 页面里只能开 wss；机房是 http://localhost:3000，走 ws。
     万一哪天站上 https 而 8090 没配证书 ⇒ 连不上 → 自动落单机，不会白屏。 */
  const proto = (typeof location !== "undefined" && location.protocol === "https:") ? "wss:" : "ws:";
  return proto + "//" + host + ":8090/mp";
}

/* --- 3. 顶部细条与 HUD ----------------------------------------------
   DOM 由本文件自己造（任务书 §10.1：联机 UI 不往一期的 HTML 里塞东西）。 */
let MP_BAR = null, MP_STAT = null;
function mpEnsureDom() {
  if (!MP_BAR) {
    MP_BAR = document.createElement("div");
    MP_BAR.id = "mpBar";
    MP_BAR.hidden = true;
    document.body.appendChild(MP_BAR);
  }
  if (!MP_STAT) {
    MP_STAT = document.createElement("span");
    MP_STAT.id = "mpStat";
    const hud = document.getElementById("hud");
    if (hud) { hud.appendChild(document.createElement("br")); hud.appendChild(MP_STAT); }
  }
}
function mpNotice(text, kind, ms) {
  mpEnsureDom();
  if (!MP_BAR) return;
  MP_BAR.className = kind || "";
  MP_BAR.textContent = text;
  MP_BAR.hidden = false;
  clearTimeout(MP_BAR._t);
  MP_BAR._t = setTimeout(() => { MP_BAR.hidden = true; }, ms || 3000);   // §7.7：3 秒自动消失，不弹窗
}
function mpHud() {
  mpEnsureDom();
  if (!MP_STAT) return;
  if (MP.state === "online") {
    const n = mpPeersHere().length;
    MP_STAT.textContent = "联机 · " + MP.scene + " · 同场景 " + (n + 1) + " 人";
    MP_STAT.className = "";
  } else if (MP.state === "connecting") {
    MP_STAT.textContent = "正在连校园…";
    MP_STAT.className = "off";
  } else if (MP.state === "retrying") {
    MP_STAT.textContent = "联机重连中（第 " + MP.attempts + " 次）";
    MP_STAT.className = "off";
  } else if (MP.state === "kicked") {
    MP_STAT.textContent = "已在别处登录";
    MP_STAT.className = "off";
  } else {
    MP_STAT.textContent = MP.state === "solo" ? "单机模式（每 30 秒再试一次）" : "";
    MP_STAT.className = "off";
  }
}
/* 当前场景里的其他人（服务端已经按场景 + 2 屏筛过，这里只是渲染前的最后一道）。 */
function mpPeersHere() {
  const out = [];
  for (const p of MP.peers.values()) if (p.scene === MP.scene) out.push(p);
  return out;
}

/* --- 4. 连接 --------------------------------------------------------- */
/* `MP_TIMER` 是退避重连的那一下，`MP_SAMPLE_TIMER` 是 10 Hz 采样那个循环。
   ⚠️ 两个句柄都必须在这里**声明**。漏声明时"赋值"只会造出一个隐式全局，
      而四条拆连接的路径（`onopen` / `mpClose` / `mpOnClose` / `mpAbort`）
      第一件事都是 `clearInterval(MP_SAMPLE_TIMER)` —— 读一个还不存在的名字是
      ReferenceError。踩中的表现很难看：`onopen` 发完 hello 就断在半路，采样循环
      一次都没起来（别人只见我站在进图那一点不动），而 `mpOnClose` 第一行就抛，
      于是掉线之后**根本不会重连**，HUD 却还写着"联机中"。 */
let MP_TIMER = 0, MP_SAMPLE_TIMER = 0;
function mpScheduleRetry() {
  if (MP.state === "kicked") return;
  const d = MP_BACKOFF[Math.min(MP.attempts, MP_BACKOFF.length - 1)];
  clearTimeout(MP_TIMER);
  MP_TIMER = setTimeout(() => { mpConnect("retry"); }, d);
}
function mpSolo(why) {
  /* 三种落单机的原因（§7.7）：① 没票 ② 网关连不上 ③ 票无效。
     ①是常态（双击 HTML、或停在登录门上），不必打扰人；后两种要说一句。 */
  MP.state = why === "no-ticket" ? "off" : "solo";
  mpClearPeers();
  /* ⚠️ 去重：后台每 30 秒重试一次都失败的话，同一条提示不能每半小时刷屏又每回 3 秒，
     所以一句话一分钟内只说一遍。 */
  const say = Date.now() - MP.lastNotice > 60000;
  if (say) MP.lastNotice = Date.now();
  if (why === "gateway" && say) mpNotice("当前为单机模式：联机网关（8090）连不上", "warn", 3000);
  else if (why === "bad-ticket" && say) mpNotice("当前为单机模式：通行证已失效，重新登录即可恢复联机", "crit", 4000);
  else if (why === "logout") mpNotice("已退出登录，现在是单机模式", "warn", 3000);
  mpHud();
}
function mpConnect(reason) {
  if (MP.state === "connecting" || MP.state === "online" || MP.state === "kicked") return;
  /* `retrying` / `solo` 这两个状态**只有退避定时器**能继续往下连（见 mpScheduleRetry）。
     3 秒一次的票轮询不许插一脚 —— 它要是把 `attempts` 清零，"3 次连不上就落单机"就永远到不了。 */
  if (reason !== "retry" && (MP.state === "retrying" || MP.state === "solo")) return;
  const tok = mpTicket();
  if (!tok) { mpSolo("no-ticket"); return; }
  let ws = null;
  try { ws = new WebSocket(mpWsUrl() + "?token=" + encodeURIComponent(tok)); }
  catch (e) { MP.attempts++; if (MP.attempts >= MP_SOLO_AFTER) mpSolo("gateway"); else mpScheduleRetry(); return; }
  MP.state = "connecting"; mpHud();
  MP.ws = ws;
  ws.onopen = () => {
    const p = mpCurPose();
    MP.scene = p.scene;
    MP.rx = p.rx; MP.ry = p.ry; MP.viewStale = false;
    MP.sentX = p.x; MP.sentY = p.y; MP.sentDir = p.dir;
    mpSend({ type: "hello", scene: p.scene, x: p.x, y: p.y, dir: p.dir, look: mpMyLook(), view: [p.rx, p.ry] });
    MP.ticks = 0; MP.silence = 0; MP.openAt = performance.now();
    clearInterval(MP_SAMPLE_TIMER); MP_SAMPLE_TIMER = setInterval(mpSample, MP_SEND_MS);
  };
  ws.onmessage = ev => {
    MP.silence = 0;
    let m = null;
    try { m = JSON.parse(ev.data); } catch (e) { return; }
    if (m && typeof m === "object") mpOnMessage(m);
  };
  ws.onclose = ev => mpOnClose(ev);
  ws.onerror = () => { /* 紧跟一个 onclose，那里统一处理，不在这里重复判定 */ };
}
function mpClose(reason) {
  clearInterval(MP_SAMPLE_TIMER);
  clearTimeout(MP_TIMER);
  const ws = MP.ws; MP.ws = null;
  if (ws) { try { ws.onclose = null; ws.close(); } catch (e) {} }
  if (reason !== "kicked") MP.state = "off";
  mpClearPeers();
}
function mpOnClose(ev) {
  clearInterval(MP_SAMPLE_TIMER);
  MP.ws = null;
  mpClearPeers();
  if (ev && ev.code === 4001) {              // 同一账号在别处登录 ⇒ **不自动重连**（§6.1）
    MP.kickToken = mpTicket();               // 记住被踢时那张票，换票后才允许翻身
    MP.state = "kicked";
    mpNotice("这个账号在别处登录，本页已断开联机", "crit", 4000);
    mpHud();
    return;
  }
  if (ev && ev.code === 4003) {              // 票无效 ⇒ 清票、落回登录门、落单机
    try { localStorage.removeItem("token"); localStorage.removeItem("user"); } catch (e) {}
    if (typeof loginGate === "function") loginGate();
    if (typeof hudUserTick === "function") hudUserTick();
    MP.state = "off";
    mpSolo("bad-ticket");
    return;
  }
  MP.attempts++;
  if (MP.attempts >= MP_SOLO_AFTER) mpSolo("gateway");
  else { MP.state = "retrying"; mpNotice("联机断开，正在重连（第 " + MP.attempts + " 次）…", "warn", 2200); mpHud(); }
  mpScheduleRetry();
}
/* 自己判死并重开一趟：`onclose` 里那套退避复用不了（对面的连接还挂着），
   所以这里先把 `onclose` 摘掉再关，避免两个入口同时递增 `attempts`。 */
function mpAbort(why) {
  MP.attempts++;
  mpNotice(why + "，正在重连（第 " + MP.attempts + " 次）…", "warn", 2500);
  const ws = MP.ws; MP.ws = null;
  if (ws) { try { ws.onclose = null; ws.onmessage = null; ws.close(); } catch (e) {} }
  clearInterval(MP_SAMPLE_TIMER);
  mpClearPeers();
  if (MP.attempts >= MP_SOLO_AFTER) mpSolo("gateway");
  else { MP.state = "retrying"; mpHud(); }
  mpScheduleRetry();
}
function mpSend(obj) {  const ws = MP.ws;
  if (!ws || ws.readyState !== 1) return;
  try { ws.send(JSON.stringify(obj)); } catch (e) {}
}

/* --- 5. 收 ----------------------------------------------------------- */
function mpClearPeers() { MP.peers.clear(); }
function mpPeerSeed(id, nickname, look, x, y, dir, scene) {
  const now = performance.now();
  const p = MP.peers.get(id);
  if (p) {
    p.nickname = nickname || p.nickname; p.look = look || p.look;
    p.scene = scene || p.scene;
    mpRetarget(p, x, y, dir, now);
    return p;
  }
  const q = {
    id, nickname: nickname || "玩家", look: look || null, scene: scene || MP.scene,
    x, y, dir: dir || "down", step: (typeof IDLE_BASE === "number" ? IDLE_BASE : 4), walk: 0,
    fx: x, fy: y, tx: x, ty: y, t0: now, dur: MP_LERP_MS, stride: mpStrideFor(scene || MP.scene)
  };
  MP.peers.set(id, q);
  return q;
}
function mpOnMessage(m) {
  switch (m.type) {
    case "welcome": {
      MP.attempts = 0;
      MP.state = "online";
      MP.openAt = 0;
      MP.silence = 0;
      if (m.me) { MP.me = m.me; mpAdoptServerLook(m.me.look); }
      MP.scene = m.scene || MP.scene;
      /* 换场景/重连回来 ⇒ **本地他人缓存整个丢掉**（§13 风险 10），再按服务端给的名单重建。 */
      const seen = new Set();
      const list = Array.isArray(m.peers) ? m.peers : [];
      for (const it of list) {
        if (!it || it.id === (MP.me && MP.me.id)) continue;
        seen.add(it.id);
        mpPeerSeed(it.id, it.nickname, it.look, num(it.x, 0), num(it.y, 0), it.dir, MP.scene);
      }
      for (const id of Array.from(MP.peers.keys())) if (!seen.has(id)) MP.peers.delete(id);
      mpHud();
      return;
    }
    case "peer.join": {
      const p = m.peer; if (!p || p.id === (MP.me && MP.me.id)) return;
      mpPeerSeed(p.id, p.nickname, p.look, num(p.x, 0), num(p.y, 0), p.dir, MP.scene);
      mpHud();
      return;
    }
    case "peer.move": {
      const p = MP.peers.get(m.id);
      if (!p) return;                                   // 不认识的人 ⇒ 等他自己的 peer.join
      mpRetarget(p, num(m.x, p.tx), num(m.y, p.ty), m.dir, performance.now());
      return;
    }
    case "peer.leave": {
      if (MP.peers.delete(m.id)) mpHud();
      return;
    }
    case "peer.look": {
      const p = MP.peers.get(m.id);
      if (p) p.look = m.look || p.look;
      return;
    }
    case "error": {
      if (m.code === "kicked") return;                  // 后面紧跟着 4001 的 close
      /* 带 clientMsgId 的是私聊/公告被拒，归模块 4 / 5 自己处理（要在气泡上标失败）。 */
      if (typeof mpNetMessage === "function" && m.code && mpNetMessage(m)) return;
      if (m.msg) mpNotice(m.msg, "warn", 3000);
      return;
    }
    case "pong": MP.ticks = 0; return;
    default:
      /* `chat.*` / `announce.*` / `presence` 交给 mp/chat.js；它没加载（单机回落、
         文件没拷）就当没收到，绝不报错。返回真值表示"这条有人接了"。
         接不住再给 mp/profile.js 一次（`mine.history` = 自己的发言记录，模块 6）。 */
      if (typeof mpNetMessage === "function" && mpNetMessage(m)) return;
      if (typeof mpProfMessage === "function") mpProfMessage(m);
      return;
  }
}
function num(v, d) { const n = Number(v); return Number.isFinite(n) ? n : d; }

/* --- 6. 采样与上报（10 Hz，**不在 rAF 里**） -------------------------- */
function mpStrideFor(scene) { return scene === "out" ? (typeof WALK_STRIDE === "number" ? WALK_STRIDE : 160)
                                                     : (typeof CTR_STRIDE === "number" ? CTR_STRIDE : 40); }
function mpCurPose() {
  const inRoom = (typeof CENTER !== "undefined") && CENTER && CENTER.active && CENTER.room;
  if (inRoom) {
    const scene = mpSceneOf(CENTER.room.key);
    return { scene, x: Math.round(CENTER.x), y: Math.round(CENTER.y), dir: CENTER.dir,
             rx: Math.round(2 * (typeof CTR_W === "number" ? CTR_W : 720)),
             ry: Math.round(2 * (typeof CTR_H === "number" ? CTR_H : 450)) };
  }
  /* 室外：视口尺寸是 `viewW/viewH`（背板 480×270 ÷ 缩放），2 屏就是它的两倍。 */
  const vw = (typeof viewW === "number" && viewW > 0) ? viewW : 480;
  const vh = (typeof viewH === "number" && viewH > 0) ? viewH : 270;
  return { scene: "out", x: Math.round(player.x), y: Math.round(player.y), dir: player.dir,
           rx: Math.round(2 * vw), ry: Math.round(2 * vh) };
}
function mpSample() {
  if (MP.state === "connecting") {
    /* 握手成功但 10 秒等不到 `welcome` ⇒ 这一趟算废了（网关半死、票被卡在验票路上……）。
       不兜这一道的话，客户端会一直挂着"正在连校园…"，因为 `onopen` 之后就没有别的超时器了。 */
    if (MP.openAt && performance.now() - MP.openAt > 10000) mpAbort("报到没回执");
    return;
  }
  if (MP.state !== "online") return;
  /* 心跳 + 静默判死：都按 100 ms 拍子数出来，省掉一堆独立定时器。 */
  if (++MP.ticks >= MP_HB_TICKS) { MP.ticks = 0; mpSend({ type: "ping" }); }
  if (++MP.silence >= MP_SILENT_TICKS) { mpAbort("联机场静"); return; }
  const p = mpCurPose();
  if (p.scene !== MP.scene) {
    const from = MP.scene;
    MP.scene = p.scene;
    MP.sentX = p.x; MP.sentY = p.y; MP.sentDir = p.dir;
    MP.rx = p.rx; MP.ry = p.ry; MP.viewStale = false;
    /* 服务端搬房间后会回一份 `welcome{switched:true}` 给我；这里先把本地缓存清了，
       免得在名单回来之前拿着上一场景的人继续画（§13 风险 10）。 */
    mpClearPeers();
    mpSend({ type: "scene.change", from, to: p.scene, x: p.x, y: p.y, dir: p.dir, view: [p.rx, p.ry] });
    mpHud();
    return;
  }
  const moved = Math.abs(p.x - MP.sentX) >= 0.6 || Math.abs(p.y - MP.sentY) >= 0.6;
  const turned = p.dir !== MP.sentDir;
  if (!moved && !turned && !MP.viewStale) return;       // §6.1：位置没变不发
  if (p.rx !== MP.rx || p.ry !== MP.ry) { MP.rx = p.rx; MP.ry = p.ry; MP.viewStale = true; }
  const msg = { type: "move", x: p.x, y: p.y, dir: p.dir };
  if (MP.viewStale) { msg.view = [p.rx, p.ry]; MP.viewStale = false; }
  MP.sentX = p.x; MP.sentY = p.y; MP.sentDir = p.dir;
  mpSend(msg);
}

/* --- 7. 别人的位置：120 ms 线性插值 ---------------------------------- */
function mpRetarget(p, x, y, dir, now) {
  mpPose(p, now);                        // 先把"现在画在哪"定下来，当作新的起点
  p.fx = p.x; p.fy = p.y;
  p.tx = x; p.ty = y; p.t0 = now; p.dur = MP_LERP_MS;
  p.scene = MP.scene;
  if (dir && dir !== p.dir) { p.dir = dir; }
  p.stride = mpStrideFor(p.scene);
}
function mpPose(p, now) {
  const prevX = p.x, prevY = p.y;
  const t = (now - p.t0) / (p.dur || MP_LERP_MS);
  const k = t <= 0 ? 0 : t >= 1 ? 1 : t;
  p.x = p.fx + (p.tx - p.fx) * k;
  p.y = p.fy + (p.ty - p.fy) * k;
  /* 步态按**实际位移**推进（与一期玩家同一条规矩）：顶墙滑行时不动脚。 */
  const d = Math.hypot(p.x - prevX, p.y - prevY);
  if (d > 0.02) {
    p.walk += d;
    p.idle = 0;
    p.step = Math.floor(p.walk / p.stride * 4) & 3;
  } else {
    p.idle = (p.idle || 0) + 1 / 60;
    p.step = mpIdleBase() + (Math.floor(p.idle * mpIdleHz() * 2) % mpIdleFrames());
  }
  return p;
}
function mpIdleBase() { return typeof IDLE_BASE === "number" ? IDLE_BASE : 4; }
function mpIdleFrames() { return typeof IDLE_FRAMES === "number" ? IDLE_FRAMES : 2; }
function mpIdleHz() { return typeof IDLE_HZ === "number" ? IDLE_HZ : 0.4; }

/* --- 8. 精灵与昵称 ---------------------------------------------------
   模块 3 之后：有配方走 `charSpriteOf`（照片→配方→小人），没配方（老数据 /
   look.js 没加载）走一期那张脸。
   ⚠️ 两条出口的画布都是 18×30、锚点 (9,27) —— 这是 §3.4 的对外契约，
      `charSpriteOf` 内部复用一期的 `buildChar`，规格不可能漂。 */
function mpPeerSprite(p) {
  if (p.look && typeof charSpriteOf === "function") return charSpriteOf(p.look, p.dir, p.step);
  return charSprite(p.dir, p.step);
}
function mpNickText(p, mode) {
  /* `mode==="id"`：全局视角只留 `#ID` —— 昵称最长七八个字，那个档位下一个人只有
     4~6 背板像素宽，整条牌比半条路还长（用户："缩小至全局后 id 好大"）。 */
  if (mode === "id") return "#" + p.id;
  return (p.nickname || "玩家") + "#" + p.id;
}
/* 名牌分三档（用户：地图缩到全局时满屏都是 12 px 的灰底牌，比人还大）：
   · zoom ≥ 1 ⇒ 原样 12 px + 昵称#ID（§7.1「字号是屏幕像素，不随缩放变大」本来讲的是正常视角）
   · 1/4 ≤ zoom < 1 ⇒ 9 px + 只有 #ID
   · zoom < 1/4（1/6、1/8、FIT 这三档全局）⇒ **不画**：这时候两个人落地线只差一两个像素，
     任何字号都只是糊成一片灰底，"谁在哪"交给脚下那圈光环，不靠牌 */
function mpNickMode(zoom) {
  const z = Number(zoom);
  const k = z > 0 ? z : 1;
  return k >= 1 ? "full" : k >= 0.25 ? "id" : "off";
}
function mpNickLabel(g, text, cx, cyTop, fs) {
  /* §7.1：深色描边白字 + 深色底衬；12 px 是正常视角的规格，缩小视角由 `mpNickMode` 递减。 */
  if (!text) return;
  const size = fs > 0 ? fs : 12;
  g.save();
  g.font = size + 'px ui-monospace, Consolas, "Courier New", monospace';
  g.textAlign = "center";
  g.textBaseline = "middle";
  const w = g.measureText(text).width;
  const pad = size >= 10 ? 3 : 2;
  const h = size + 4;
  g.fillStyle = "rgba(13,15,19,.72)";
  g.fillRect(Math.round(cx - w / 2) - pad, Math.round(cyTop) - h / 2, Math.round(w) + pad * 2, h);
  g.lineWidth = Math.max(1, Math.round(size / 4));
  g.strokeStyle = "rgba(10,12,16,.92)";
  g.lineJoin = "round";
  g.strokeText(text, cx, cyTop);
  g.fillStyle = "#fff";
  g.fillText(text, cx, cyTop);
  g.restore();
}
/* 自己脚下那一圈青色淡光环 —— 与一期 NPC 的交互光圈同色（`ringCol`）。 */
function mpSelfRing(g, fx, fy, zoom) {
  g.save();
  g.strokeStyle = "rgba(127,214,200,.75)";
  g.lineWidth = Math.max(1.5, 2 * zoom);
  g.beginPath();
  g.ellipse(fx, fy, Math.max(9, 20 * zoom), Math.max(3.2, 8 * zoom), 0, 0, Math.PI * 2);
  g.stroke();
  g.restore();
}

/* --- 9. 室外：塞进一期那条 drawList ----------------------------------
   ⚠️ 必须**在 sort 之前**塞，才拿得到一期 `baseY` 深度排序 —— 人走进楼后面自然被挡住，
      这就是"不穿模"的全部实现（§13 风险 1/17）。 */
function mpCollectPeers(drawList, ox, oy, vw, vh) {
  if (MP.state !== "online" || MP.scene !== "out") return;
  if (typeof charSprite !== "function") return;
  const now = performance.now();
  let n = 0;
  for (const p of MP.peers.values()) {
    if (p.scene !== "out") continue;
    mpPose(p, now);
    if (p.x < ox - 40 || p.x > ox + vw + 40 || p.y < oy - 60 || p.y > oy + vh + 40) continue;  // 视口裁剪
    if (++n > 30) break;                                     // §7.1 同场景 ≤30 人，超出不画，也不报错
    drawList.push({
      img: mpPeerSprite(p), ax: CH_AX, ay: CH_AY,
      x: p.x, y: p.y, baseY: p.y, mp: "peer", mpId: p.id, nick: mpNickText(p)
    });
  }
}
/* 悬停高亮（§7.2.2 第①步）：鼠标移到对方精灵上 ⇒ 脚下冒一圈淡光。
   与自己那圈青色区分开：这圈更淡、偏米色，避免"到底哪个是我"。 */
function mpPeerHoverRing(g, fx, fy, zoom) {
  g.save();
  g.strokeStyle = "rgba(233,229,216,.62)";
  g.lineWidth = Math.max(1.2, 1.6 * zoom);
  g.beginPath();
  g.ellipse(fx, fy, Math.max(8, 17 * zoom), Math.max(3, 6.6 * zoom), 0, 0, Math.PI * 2);
  g.stroke();
  g.restore();
}
/* 主循环画完一个条目之后叫我一眼：self ⇒ 光环，peer ⇒ 头顶昵称（+ 悬停光圈）。
   字号与内容按 `mpNickMode(zoom)` 分档，全局视角下牌面会明显变小、只剩 `#ID`，
   再小就不画了（脚下水波纹、光圈这些都不受影响，照常画）。 */
function mpDrawDecor(g, it, dx, dy, zoom) {
  const mode = mpNickMode(zoom);
  if (it.mp === "self") {
    if (MP.state !== "online") return;
    mpSelfRing(g, dx + CH_AX * zoom, dy + CH_AY * zoom, zoom);
    /* 自己头顶也挂一块牌：一张图上十几个人走动，光靠"哪个是青色圈"不够，
       要的是"每个人头顶都能读出是谁"（用户：联机时人物在地图上走动 id 可视）。 */
    if (mode !== "off")
      mpNickLabel(g, mpNickText({ nickname: mpMyNickname(), id: mpMyId() }, mode),
                  dx + CH_AX * zoom, dy - 9, mode === "id" ? 9 : 12);
    return;
  }
  if (it.mp !== "peer") return;
  if (typeof MP_CHAT !== "undefined" && MP_CHAT && MP_CHAT.hover === it.mpId)
    mpPeerHoverRing(g, dx + CH_AX * zoom, dy + CH_AY * zoom, zoom);
  if (mode === "off") return;
  mpNickLabel(g, mode === "id" ? ("#" + it.mpId) : it.nick,
              dx + CH_AX * zoom, dy - 9, mode === "id" ? 9 : 12);
}

/* --- 10. 室内：房间画布上那几个同类 ----------------------------------
   `ctrDraw()` 那一段本来就按脚点 y 排序（玩家 + NPC 两个），我把同事塞进同一个数组，
   遮挡关系与室外同一条规矩。 */
/* 室内那块画布的 `Z = ctrZoom()` 恒 ≥1（`Math.max(1, …)`），所以这里三档里只会走到
   `full` 或 `off`；写成同一个 `mpNickMode` 是为了将来房间也支持缩小时不用再改一遍。 */
function mpIndoorLabel(g, p, Z, x, yTop) {
  const mode = mpNickMode(Z);
  if (mode === "off") return;
  mpNickLabel(g, mpNickText(p, mode), x, yTop, mode === "id" ? 9 : 12);
}
function mpIndoorPeers(g, Z, ox, oy) {
  const out = [];
  if (MP.state !== "online" || MP.scene === "out") return out;
  const now = performance.now();
  let n = 0;
  for (const p of MP.peers.values()) {
    if (p.scene !== MP.scene) continue;
    mpPose(p, now);
    if (++n > 30) break;
    out.push({
      y: p.y, mpId: p.id,
      f: () => {
        g.drawImage(mpPeerSprite(p), Math.round(p.x) - CH_AX, Math.round(p.y) - CH_AY);
        g.save();
        g.setTransform(1, 0, 0, 1, 0, 0);
        if (typeof MP_CHAT !== "undefined" && MP_CHAT && MP_CHAT.hover === p.id)
          mpPeerHoverRing(g, ox + p.x * Z, oy + p.y * Z, Z);
        mpIndoorLabel(g, p, Z, ox + p.x * Z, oy + (p.y - CH_AY) * Z - 9);
        g.restore();
      }
    });
  }
  return out;
}
function mpIndoorSelfRing(g, Z, ox, oy) {
  if (MP.state !== "online" || MP.scene === "out") return;
  g.save();
  g.setTransform(1, 0, 0, 1, 0, 0);
  mpSelfRing(g, ox + CENTER.x * Z, oy + CENTER.y * Z, Z);
  mpIndoorLabel(g, { nickname: mpMyNickname(), id: mpMyId() }, Z,
                ox + CENTER.x * Z, oy + (CENTER.y - CH_AY) * Z - 9);
  g.restore();
}

/* --- 11. 形象换了要通知全场（模块 3 上传完照片调它） ------------------ */
function mpPushLook(look) {
  const L = look || mpMyLook();
  if (MP.state !== "online") return;                     // 单机模式：只改本地，不发（§7.7）
  mpSend({ type: "look.update", look: L });
}
/* 换设备登录：本地没缓存，服务端 `mp_player.look_json` 那份才是我上次的脸。
   只在**首份 welcome** 上做，且只在两边不一致时覆盖 —— 我自己刚发出去的那份
   服务端已经存下了，回来必然一致，不会把我的改动冲掉。 */
function mpAdoptServerLook(l) {
  if (!l || typeof mpNormLook !== "function") return;
  const L = mpNormLook(l); if (!L) return;
  if (mpLookKey(mpMyLook()) === mpLookKey(L)) return;
  try { localStorage.setItem("mp_look", JSON.stringify(L)); } catch (e) {}
  if (typeof player !== "undefined" && player) player.look = L;
}

/* --- 12. 开机与票的变化 ----------------------------------------------
   地图的统一登录层（7.5.14）不归本文件管，它只在 8081 那边换票；
   这边**只观察票的有无**：登录上了就自己连，登出就自己断。
   ⚠️ 3 s 一次的轮询足够 —— 登出之后连接多活 3 秒不会产生任何数据（服务端按票鉴权）。 */
let MP_TICKER = 0;
function mpWatchTicket() {
  const tok = mpTicket();
  if (!tok) {
    if (MP.state === "online" || MP.state === "connecting") { mpClose("logout"); mpSolo("logout"); }
    else if (MP.state === "kicked") { MP.state = "off"; MP.kickToken = ""; mpHud(); }
    else if (MP.state === "solo") { MP.state = "off"; MP.attempts = 0; mpHud(); }
    return;
  }
  /* 被踢：只有**票换了**（重新登录）才允许再连，同一张票不自己翻身上去。 */
  if (MP.state === "kicked") {
    if (tok === MP.kickToken) return;
    MP.state = "off"; MP.kickToken = ""; MP.attempts = 0;
  }
  if (MP.state === "solo" || MP.state === "retrying") return;   // 退避定时器在路上，别抢它的节奏
  if (MP.state !== "online" && MP.state !== "connecting") {
    MP.attempts = 0;                    // 全新一次登录 ⇒ 从零数起
    mpConnect("watch");
  }
}
function mpBoot() {
  mpEnsureDom();
  /* 先把"我长什么样"立起来：地图画我时读 `player.look`（§10.2 第 1 条只加字段，
     一期的 x/y/dir/step/idle/walk/speed 一个都不动）。 */
  if (typeof player !== "undefined" && player) player.look = mpMyLook();
  mpHud();
  clearInterval(MP_TICKER);
  MP_TICKER = setInterval(mpWatchTicket, 3000);
  mpWatchTicket();
  window.addEventListener("beforeunload", () => { try { if (MP.ws) MP.ws.close(); } catch (e) {} });
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mpBoot);
else mpBoot();
