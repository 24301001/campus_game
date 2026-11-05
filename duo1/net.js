/* =========================================================================
   net.js —— 双人联机的客户端同步层
   第一步：只同步"人"（位置/朝向/动画/武器/开枪）。
   第二步：丧尸、波次、门、伤害**全部归主机**，对端只演主机发来的影子。

   刻意做成**加法式**的：本文件不直接读 main.js 的内部变量，main.js 只需要
   在四处挂钩：①import、②fire() 里一句 netFire()、③文件末尾 initNet(...)、
   ④上面那一小块 netHostFrame / netApplyFrame / netRemoteHit 之类的函数。
   这样组长以后改 main.js，冲突面最小。

   同步的是什么：每 50 毫秒发一次自己 {x, z, yaw, 离地高度, 下蹲程度, 是否快跑,
   武器号}，外加"我开了一枪"；主机再每 66 毫秒发一帧 {场上丧尸, 波次, 门, 你的血量}。

   ⚠️ 带宽账（决定了很多设计）：一条状态文本约 70~90 字节，20Hz ≈ 1.7KB/s。
      丧尸那一帧实测约 500~900 字节（一只 ≈ 30 字符），15Hz ≈ 8~13KB/s ≈ 60~100kbps。
      双向加起来仍然远在百度云那台 1Mbps（≈128KB/s）出口以内。
      ——**勘误**：上一版这里写"第四波 500 只 = 160KB/s ≈ 1.28Mbps，超过出口带宽，
      必须只发离人最近的约 40 只"。那是把 WAVE_SIZES[3]=500 当成了"场上 500 只"，
      实际 main.js 里的闸是 MAX_ALIVE = 8（尸体另计，上限 16），
      场上同时最多约 9 只 ⇒ 全量广播装得下，**不需要做剔除**。
      结论变了，设计也就简化了：第二步按全量实现。

   ⚠️ 为什么对端人形是**再加载一份 Soldier.glb** 而不是 cloneSkinned(avatar)：
      蒙皮网格共享骨架在 three.js 里有一堆坑（Skeleton 绑定、姿势互相污染），
      而这份模型只有 2.1MB、本地加载几乎不花时间。独立骨架 + 独立 mixer 最稳。
   ⚠️ 主相机看不见 `LAYER_PLAYER`（那是镜子的专用层），所以远端人形必须显式
      `layers.enable(0)`，否则会"连上了却谁都看不见谁"。
   ========================================================================= */
/* ⭐ 第二步之后，这里连 GLTFLoader / MeshoptDecoder 都不再需要了：
   对端那个人（骨架 + 三把枪的克隆 + 握持 IK）改由 main.js 建 ——
   它本来就持有这些模型，而且只有它知道骨头名和握点。 */

const SEND_HZ_MS = 33;          // 30Hz：双人同机测试，把延迟压到一帧半以内
const ZOMBIE_HZ_MS = 66;        // 15Hz ⭐ 第二步：丧尸那一帧。
                                // 比人慢一档是有意的 —— 丧尸最快速度 3.7 米/秒，
                                // 66 毫秒才走 24 厘米，插值完全看不出来；
                                // 而带宽直接省掉 1/4，留给后面要加的爆血/音效事件。
const ROOM_PORT = 8124;

let api = {};                   // initNet 时传进来的全部挂钩（getFrame/applyFrame/peer/…）
let getState = null;
let ws = null, open = false;
let room = '';
let sendTimer = 0;
let lastSentPos = { x: 0, z: 0 };
let lastSentT = 0;
let sentAnim = 'Idle';

/* ⚠ 这里以前还有一堆 peer.avatar / peer.mixer / peer.guns / peer.flash：
   对端那个人长得对不对，全靠 main.js 的 peerDrive 摆，net.js 不认识它们。
   留一份在 net.js 就等於"两个人各自记一份怎么持枪"，早晚分叉。 */
const peer = {
  root: null,                       // 由 main.js 建，这里只负责显隐
  target: null, have: false,
};

/* ── ⭐ 第二步：谁是主机 ─────────────────────────────────────────────
   ⚠ 第一版这里写的是 `slot === 0` 当主机，结果**两个人都当自己对端**、
   丧尸仿真被 netIsHost() 一挡 ⇒ 场上永久 0 只，整套第二步当场瘫住。
   根因：room_server.py 发的座位号是 `len(rooms)+1`，**从 1 开始**，
   而且 welcome 里的 `peer` 是"房间里已经有几个人"（0/1），不是布尔值。
   所以正确的判据不是"几号座位"，而是**我进这个房间的时候里面有没有人**：
     我是先进的那个 = 主机；后面挤进来的 = 对端。
   另外还有一条兜底：**场上只剩我一个人时永远是主机** ——
   房间码写死在网址里，一个人打开也必须能正常单人玩。
   主机退了剩下那个 promoted=true 接上，不停在一个没有丧尸的世界里。 */
let slot = 0;
let iAmFirst = true;           // welcome.peer === 0 ⇒ 我是这间房里第一个
let peerOnline = false;
let promoted = false;
let guestHP = 100;             // 主机替对端记的血量（对端的血只有主机算）
/* ⚠ 这个初值必须问 main.js 要 MAX_HP，不能自己写死 100：
   写死就是"两处真相"，哪天改了血量上限，对端一进场就会被判成残血。 */
function resetGuestHP() { guestHP = api && api.maxHP ? api.maxHP() : 100; }
let remoteFrame = null;        // 对端最近收到的那一帧
let frameTimer = 0;
let sentBytes = 0, recvBytes = 0, frameSent = 0, hitsSent = 0, hitsApplied = 0;
/* 收侧的两个计数器，专门用来抓"发了但对面不认"这一类 bug：
     frameRecv = 吃进来的主机状态帧(t==='z')有几条 —— 对端这边一切同步都靠它
     badTag    = 收到的消息里 t 不属于任何已知类型的有几条
   为什么 badTag 值得单列：状态帧的字段一旦和类型标记重名（见 main.js netHostFrame
   的注释），t 会被改成一个数字，这条消息就掉进"谁也不认识"的分支里静消失。
   只有计个数，屏幕上才看得见它消失了。 */
let frameRecv = 0, badTag = 0;
export function netIsHost() { return !peerOnline || promoted || iAmFirst; }

/* ---------------------------------------------------------------- 小角标 */
function badge() {
  let el = document.getElementById('netbadge');
  if (el) return el;
  el = document.createElement('div');
  el.id = 'netbadge';
  el.style.cssText = 'position:fixed;left:10px;top:10px;z-index:40;padding:5px 9px;'
    + 'background:rgba(10,12,16,.72);border:1px solid rgba(255,255,255,.16);border-radius:5px;'
    + 'color:#d9d2c4;font:12px/1.5 ui-monospace,Consolas,monospace;letter-spacing:.5px;'
    + 'pointer-events:none;user-select:none;';
  document.body.appendChild(el);
  return el;
}
function setBadge(txt) { badge().textContent = txt; }

/* ---------------------------------------------------------------- 房间码 */
function readRoom() {
  const q = new URLSearchParams(location.search).get('room');
  if (q) return q.trim().toUpperCase().slice(0, 8);
  // 没给就自己生成一个并写回地址栏，这样把地址发给同学就是同一间房
  const s = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let c = '';
  for (let i = 0; i < 4; i++) c += s[Math.floor(Math.random() * s.length)];
  const u = new URL(location.href);
  u.searchParams.set('room', c);
  history.replaceState(null, '', u);
  return c;
}

/* ---------------------------------------------------------------- 连接 */
function connect() {
  const url = `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/duo1/ws/r/${room}`;
  setBadge(`房间 ${room} · 连接中…`);
  try { ws = new WebSocket(url); } catch (e) { scheduleReconnect(); return; }

  ws.onopen = () => { open = true; setBadge(`房间 ${room} · 等待同学加入`); };
  ws.onmessage = (m) => {
    recvBytes += (m.data && m.data.length) || 0;
    let d; try { d = JSON.parse(m.data); } catch (e) { return; }
    if (d.t === 'welcome') {
      slot = d.slot;
      promoted = false;
      iAmFirst = !d.peer;                  // ⚠ peer 是"屋里已有几个人"（0/1），不是布尔
      peerOnline = !!d.peer;
      if (peerOnline) resetGuestHP();
      applyRole();
      if (peerOnline) sendLook();      // 重新连回来/后进来的人：先把我的形象给他
    } else if (d.t === 'full') {
      setBadge(`房间 ${room} 已满（只支持 ${d.cap} 人）`);
    } else if (d.t === 'hello') {
      // 新人刚进：立刻把自己当前状态补发一次，别让他对着空气等 50ms
      peerOnline = true; resetGuestHP();     // 新对端的血从满开始（主机这边记账）
      applyRole();
      sendState();
      sendLook();                      // 我的形象也补一份，不然他先给我贴默认皮
    } else if (d.t === 'peerleft') {
      const wasGuest = !netIsHost();         // ⚠ 必须在清 peerOnline **之前**问
      peerOnline = false; peer.have = false; peer.target = null; remoteFrame = null;
      if (api.peer) api.peer.visible(false);
      // 主机退了：剩下这个接棒，把场上的"替身"变成真身继续仿真。
      // promoted 还得多记一笔：以后那位老主机重新挤回来时，两边都会以为对方是主机，
      // 不加这个锁就会再一次双双当对端、场上回到 0 只丧尸。
      if (wasGuest) { promoted = true; if (api.promote) api.promote(); }
      setBadge(roleText());
    } else if (d.t === 's') {
      peer.target = d; peer.have = true;
      if (api.peer) api.peer.visible(true);
    } else if (d.t === 'f') {
      if (api.peer) api.peer.fire();            // 对端开了一枪：枪口亮一下、往后顶一下
      // 顺手把他的弹道画出来、枪声放出来。d.k 是他用的哪把枪（老版本包没这个字段，
      // 接收侧会退回"他现在手上那把"）。
      if (d.o && d.u && api.remoteShot) api.remoteShot(d.o, d.u, d.k);
    } else if (d.t === 'z') {
      frameRecv++;
      remoteFrame = d;                          // 主机那一帧：交给 api.applyFrame 每帧演
    } else if (d.t === 'h') {
      if (api.remoteHit && netIsHost()) { hitsApplied++; api.remoteHit(d.i, d.d, d.hd); }
    } else if (d.t === 'e') {
      if (api.remoteDoor && netIsHost()) api.remoteDoor(d.d, d.i);   // 对端按了 E 要开哪一扇（序号在 d.i）
    } else if (d.t === 'p') {
      // 躲藏者选了哪个形象。躲藏者可能是对端，所以这条不是"对端→主机"专属，
      // 但落点仍然只有主机那份 hs 是权威 —— 对端发过来，主机记下，再随 z 帧广播。
      if (api.pickForm && netIsHost()) api.pickForm(d.f);
    } else if (d.t === 'r') {
      // 对端点了"准备"。只有主机那份 hs.ready 是权威，凑齐两位才开局。
      if (api.peerReady && netIsHost()) api.peerReady();
    } else if (d.t === 't') {
      // 躲藏者掏空了某一格抽屉。同样只有主机那份 hs.stolen 是权威。
      if (api.stealSpot && netIsHost()) api.stealSpot(d.i);
    } else if (d.t === 'x') {
      // 对方按了 T：这边跟着一起重开。血也算回满 —— 不管这台机器是主机还是对端，
      // 重开之后"对端血量"这份账都该从零开始，否则主机这边会拿旧值压住新血条。
      resetGuestHP();
      if (api.restart) api.restart();
    } else if (d.t === 'g') {
      // 抓捕者选了哪把枪。他可能是主机也可能是对端，所以两边都要能发；
      // 落点仍然只有主机那份 hs.gun 是权威。
      if (api.gunPick && netIsHost()) api.gunPick(d.k);
    } else if (d.t === 'n') {
      // 躲藏者点了「换一批」：这一局的三个形象重抽。抽必须是主机一个人抽 ——
      // 两边各抽各的就会出现"他看到卡片是这三张、抓捕者那台是另外三张"。
      if (api.rerollForms && netIsHost()) api.rerollForms();
    } else if (d.t === 'k') {
      // 对端的形象配方（发型/肤色/衣服颜色…）。纯展示用，谁发都行，
      // 落地只做一件事：把方块人拆了重贴。
      if (api.setPeerLook && d.l) api.setPeerLook(d.l);
    } else if (d.t === 'notready') {
      // 中继发的：我这条消息在屋里没递到任何人（对面没连进同一个房间码）。
      // 必须单独认掉，不然它会掉进下面的 badTag，把"对面没连上"
      // 误报成"连上了但消息解析不了"——这两件事的查法完全不同。
    } else {
      badTag++;                                 // 没有任何分支认识这条 t
    }
  };
  ws.onclose = () => { open = false; scheduleReconnect(); };
  ws.onerror = () => { try { ws.close(); } catch (e) {} };
}

function roleText() {
  const who = netIsHost() ? '房主' : '队友';
  if (!peerOnline) return `房间 ${room} · ${who} · 等待队友加入`;
  return `房间 ${room} · ${who}`;
}
/* 角色变了就得清一次本地丧尸表：
   变成对端 —— 手上那批是"我本地自己刷的"，主机根本不认识它们的 netId，
   留着就是两批丧尸叠在一起，而且打死了也不会同步。resetZombies 在不是主机时
   只清不刷，正好。 */
function applyRole() {
  if (!netIsHost() && api.resetZombies) api.resetZombies();
  setBadge(roleText());
}

let reconnectAt = 0;
function scheduleReconnect() { reconnectAt = performance.now() + 1200; }

/* ---------------------------------------------------------------- 发送 */
function sendState() {
  if (!open || !ws || ws.readyState !== 1) return;
  const s = getState();
  if (!s) return;
  const now = performance.now();
  const dt = Math.max(0.001, (now - lastSentT) / 1000);
  const sp = Math.hypot(s.x - lastSentPos.x, s.z - lastSentPos.z) / dt;   // 米/秒
  sentAnim = s.air ? 'Idle' : (sp > 3.2 ? 'Run' : (sp > 0.25 ? 'Walk' : 'Idle'));
  lastSentPos = { x: s.x, z: s.z }; lastSentT = now;
  send({
    t: 's', x: +s.x.toFixed(3), z: +s.z.toFixed(3), y: +s.yaw.toFixed(3),
    j: +s.jy.toFixed(2), c: +s.ck.toFixed(2), w: s.w, a: sentAnim,
    /* ⭐ 手上那几件事：换弹进度 u(-1=没换)、枪的歪斜 tl、左手权重 rw、左手位移 o、
       泵动 k、是否腾空 ai。都是**发送方算好的结果**，对面只管照着摆。 */
    u: s.u === undefined ? -1 : s.u,
    tl: +((s.tl || 0)).toFixed(3),
    rw: +((s.rw || 0)).toFixed(3),
    o: s.ro || [0, 0, 0],
    k: +((s.k || 0)).toFixed(2), ai: s.air ? 1 : 0,
    fl: +((s.flip || 0)).toFixed(2),        // 躲藏者的空中翻滚进度
    m: s.mnt | 0,                          // 贴在哪个面：0 地面 / 1 墙 / 2 天花板
    /* 伪装体"长什么样"的两件事一律由变的人算好发过来，对面只照抄：
       oy 形象实际朝向（按 Enter 定住后和脸的方向就不一样了）、
       ma 贴的是哪面墙（对面自己重新量墙会量到另一面上去 → 看着就是歪的）。
       ma 不是贴墙时发 null，收到端还原成 NaN。
       抽屉和门板的开度**不在这里** —— 那是"谁都能拉"的部件，走主机的快照。 */
    oy: +((s.oy || 0)).toFixed(3),
    ma: Number.isFinite(s.ma) ? +s.ma.toFixed(3) : null,
    sp: +((s.sp || 0)).toFixed(3),               // 滚轮转角（绕他所贴那面的法线）
    am: +((s.aim || 0)).toFixed(2),              // 举枪瞄准举到几成（0 腰射 ~ 1 贴脸）
  });
}
/* o/u 是"从哪儿、朝哪儿打"，k 是"哪把枪"（决定他那边放哪一声枪响）。
   不带的旧客户端发 {t:'f'}，接收侧判一下有没有 o 就行 —— 两边版本不一致也不会崩。 */
export function netFire(o, u, k) {
  send(o && u ? { t: 'f', o, u, k } : { t: 'f' });
}
function send(o) {
  if (!open || !ws || ws.readyState !== 1) return;
  const s = JSON.stringify(o);
  sentBytes += s.length;
  ws.send(s);
}
/* ⭐ 第二步的三个"事件"。都是**对端 → 主机**方向的一锤子消息：
   打中了一枪、按了开门、按了重开。丧尸的持续状态（位置/血量/波次）不在这走，
   走 sendFrame 的周期广播 —— 因为丢一帧无所谓，下一帧就纠正过来了，
   而事件丢了就是丢了。 */
export function netSendHit(id, dmg, head) {
  hitsSent++;
  send({ t: 'h', i: id, d: Math.round(dmg * 100) / 100, hd: head ? 1 : 0 });
}
export function netSendDoor(which, i) { send({ t: 'e', d: which | 0, i: i | 0 }); }
//   d: 0 教休室那道双开木门 / 1 伪装门板 / 2 伪装抽屉 / 3 地图推拉门(第 i 樘) / 4 储物柜(第 i 个)
export function netSendPick(kind) { send({ t: 'p', f: String(kind || '') }); }
export function netSendSteal(i) { send({ t: 't', i: Number(i) | 0 }); }
export function netSendReady() { send({ t: 'r' }); }
export function netSendGun(key) { send({ t: 'g', k: String(key || '') }); }   // 抓捕者选了哪把枪
export function netSendReroll() { send({ t: 'n' }); }
/* 我的形象。配方就十来个字段、两百来字节，进房时发一次就够；
   之后改形象不重进房也不会变，这一版先不管（改形象要回大厅面板）。
   没连上时 sendLook 直接空跑 —— 连上以后 welcome/hello 两条路都会再发。 */
function sendLook() {
  if (!api.myLook) return;
  const l = api.myLook();
  if (l) send({ t: 'k', l });
}
export function netSendLook(look) {
  if (look) send({ t: 'k', l: look });
}   // 躲藏者要重抽这一局的三个形象
/* 本机按了 T（重开一局）。两件事都要做：
   ① 我是主机时，我这边记的那份"对端血量"必须一起归 100 —— 不归的话对端本地
      重开成满血，下一帧我又把旧的半血推回去，他刚重生就被判成快死了；
   ② 通知对方：联机里"再来一局"是两个人一起重开，不是各玩各的。
      收消息那侧只会 api.restart()、不会再回一条 x，所以不会打成乒乓。 */
export function netRestarted() {
  if (netIsHost()) resetGuestHP();
  send({ t: 'x' });
}
// 主机记账：丧尸咬到对端了。对端的血条**只有**这一条路径能变（见 main.js 的 zDamage）
export function netGuestDamage(n) { guestHP = Math.max(0, Math.round((guestHP - n) * 100) / 100); }
// 主机眼里"对端那个人站在哪"，用来让丧尸分头追两个人。
// ⚠ 不是主机时一律返回 null：在主机自己这边，peer.target 才是"别人"；
//   对端那边 peer.target 装的是主机自己，误用会变成"我追我自己"。
// ⚠ 返回的是**同一个对象**（每帧给场上每只丧尸都调一次，25 次/帧新建对象
//   就是在给垃圾回收加码）。调用方只许当场读数，不许把它存下来。
const _peerP = { x: 0, z: 0, yaw: 0, hp: 0 };
export function netPeerAsPlayer() {
  if (!netIsHost() || !peerOnline || !peer.target) return null;
  const t = peer.target;
  _peerP.x = t.x; _peerP.z = t.z; _peerP.yaw = t.y || 0; _peerP.hp = guestHP;
  return _peerP;
}


/* ---------------------------------------------------------------- 对端人形 */
function buildPeer() {
  /* 人（骨架 + 三把枪的克隆 + 握持 IK + 换弹/泵动）全归 main.js 里那套
     "镜子装置"管，net.js 只往它身上钉一块名字牌。
     为什么这么切：骨头叫什么名、握点在枪模型哪一处、换弹时左手往哪走，
     这些是 main.js 的知识；
     抄到 net.js 就是第二份真相 —— 第一步"对端手里空着"那个坑就是这么来的。 */
  if (api.peer) api.peer.build();
  peer.root = api.peer && api.peer.root ? api.peer.root() : null;
  if (!peer.root) { setBadge(`房间 ${room} · 对方的模型加载失败`); return; }
}

// 把线上那套短字段名翻译成 main.js 要的长名字，再交出去摆人
function drivePeer(dt) {
  if (!peer.have || !peer.target || !api.peer) return;
  const t = peer.target;
  api.peer.drive({ x: t.x, z: t.z, yaw: t.y, jy: t.j, c: t.c, air: !!t.ai,
                   a: t.a, w: t.w, u: t.u, tl: t.tl, rw: t.rw, k: t.k, o: t.o,
                   flip: t.fl || 0, mnt: t.m | 0,
                   oy: t.oy || 0, ma: t.ma === undefined ? null : t.ma, spin: t.sp || 0,
                   am: t.am || 0 }, dt);
}

/* ---------------------------------------------------------------- 每帧 */
function tick(dt) {
  /* ⭐ 第二步：丧尸/波次/门/血量的收发。⚠ 这段必须排在"摆人"之前，
     而且要保证**任何一侧的模型没加载出来都不影响它** ——
     上一版把这段写在 `if (!peer.mixer) return;` 后面，
     于是 Soldier.glb 一旦加载失败，丧尸同步会跟着一起静默停摆，
     而那恰好是最需要它还在动的时候。 */
  if (peerOnline && open) {
    if (netIsHost() && api.getFrame) {
      frameTimer += dt * 1000;
      if (frameTimer >= ZOMBIE_HZ_MS) {
        frameTimer = 0;
        frameSent++;
        send(Object.assign({ t: 'z' }, api.getFrame(), { h: guestHP }));
      }
    } else if (!netIsHost() && remoteFrame && api.applyFrame) {
      api.applyFrame(remoteFrame, dt);
    }
  }

  /* ⭐ 对端那个人整个交给 main.js 的 peerDrive（和镜子里同一套装置）。
     所以这里不再有"位置插值 / 动画切换 / 挂枪 / 枪口火光衰减"——
     那些代码全在 peerDrive 里，用的是 main.js 的骨头名和握点。 */
  drivePeer(dt);

  /* ⭐ 观测口。为什么要有它：net.js 里这些变量都是模块私有的，控制台和自动化脚本
     都读不到；没有这个口的话，"到底同步没同步"就只能靠肉眼盯着屏幕看，
     而肉眼看不出 20Hz 的丢包和对不对得上线程。调试时敲 window.__net 即可。 */
  const pd = api.peer && api.peer.dbg ? api.peer.dbg() : null;
  window.__net = {
    room, connected: open, peerSeen: peer.have,
    /* 对端那个人摆得对不对，全部问 main.js 要 —— 它才是那套镜子装置的主人。
       这里**不再自己按 gunKey 猜**"枪挂上没有"：第一步就是靠"变量有值"报了个
       假绿灯，而真正该看的是"克隆出来的那把枪确实挂在角色根节点上、且可见、
       而且握点和手指骨都齐"（peer.dbg 里那几项）。 */
    peer: pd,
    peerAt: pd ? pd.at : null,
    peerAnim: (peer.target && peer.target.a) || null,
    peerState: peer.target ? { u: peer.target.u, k: peer.target.k, w: peer.target.w } : null,
    meAt: (() => { const s = getState(); return s ? [+s.x.toFixed(2), +s.z.toFixed(2)] : null; })(),

    /* ⭐ 第二步的判据。为什么要单列：这些全是"主机算得对不对"的侧面，
       光看画面看不出来 —— 对端屏幕上"有丧尸在走"既可能是真的在同步，
       也可能是它自己本地还在仿真（那就是两套真相）。
         role           = 现在谁说了算
         frames         = 主机已经发出几帧（**必须是会涨的数**，停在 0 就说明
                          同步链路根本没通，而不是"通了但场上没丧尸"）
         zSeen          = 最近一帧里主机报了几只丧尸
         zOnStage       = 我这边场上有几个丧尸模型（拿它和 zSeen 对账）
         waveSeen/doorSeen = 主机报的波次和门位
         hitsSent/Applied  = 对端报了几枪 / 主机认了几枪
         kbps           = 实测双向字节速率 —— 别再拿估算值当结论 */
    role: netIsHost() ? 'host' : 'guest',
    slot, promoted, peerOnline,
    frames: frameSent,
    framesIn: frameRecv,
    badTag,
    zSeen: remoteFrame ? (remoteFrame.z ? remoteFrame.z.length : 0) : null,
    zOnStage: api.zCount ? api.zCount() : null,   // 拿它和 zSeen 对账，差得多就是没同步上
    waveSeen: remoteFrame ? remoteFrame.w : null,
    doorSeen: remoteFrame ? remoteFrame.d : null,
    guestHP,
    hitsSent, hitsApplied,
    /* ⚠ kbps 就是"这一秒里收发合共多少字节 ÷1024"。
       上一版又乘了 2 当作"双向"，可 byteRate() 里已经把 sent 和 recv 加过了 ——
       报出去的就是个凭空的翻倍数。带宽这种话不能这么算。 */
    kbps: +(byteRate() / 1024).toFixed(1),
  };
}
let __t0 = 0;
function byteRate() {                    // 字节/秒（单向前）
  const t = performance.now();
  if (!__t0) { __t0 = t; __b0 = 0; }
  const dt = (t - __t0) / 1000;
  if (dt < 1) return __lastRate;         // 每秒才结算一次，免得前几帧报出天文数字
  const r = (sentBytes + recvBytes - __b0) / dt;
  __b0 = sentBytes + recvBytes; __t0 = t; __lastRate = r;
  return r;
}
let __b0 = 0, __lastRate = 0;

/* ---------------------------------------------------------------- 入口 */
export function initNet(opts) {
  api = opts;
  getState = opts.getState;
  room = readRoom();
  buildPeer();          // main.js 建人 + 这里钉名字牌（没有 loadPeerAvatar 了）
  connect();

  let prev = performance.now();
  const loop = (now) => {
    /* ⚠ 必须**先排下一帧再干活**。上一版把 requestAnimationFrame 写在最后，
       于是 tick 里任何一次抛错（这次就是 main.js 的 {x,z} 简写踩了未定义名）
       会让整个同步循环永久停摆 —— 表现是"连上了但对面一动不动"，
       而且控制台只在第一帧报一次，越查越像网络问题。 */
    requestAnimationFrame(loop);
    const dt = Math.min(0.1, (now - prev) / 1000); prev = now;
    if (reconnectAt && now > reconnectAt) { reconnectAt = 0; connect(); }
    sendTimer += dt * 1000;
    if (sendTimer >= SEND_HZ_MS) { sendTimer = 0; sendState(); }
    tick(dt);
  };
  requestAnimationFrame(loop);
  console.log(`[联机] 房间 ${room} 已启动，20Hz 同步`);
}
