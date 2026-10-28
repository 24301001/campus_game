/* =====================================================================
 * 像素校园 · 二期模块 4：点击玩家发起私聊（mp/chat.js）
 * ---------------------------------------------------------------
 * 这一份管**私聊窗口 + 公告栏 UI + 在线快照**，与 `mp/client.js` 共用一条
 * WebSocket：本文件**不另开连接**，只把 `chat.* / announce.* / presence` 接进
 * client.js 的消息口（`mpNetMessage`），发送一律走它的 `mpSend`。
 *
 * 三条最容易翻车的规矩（任务书 §7.2.3 / §7.2.4）：
 *   ① **按下即锁定**：`pointerdown` 那一刻就认定是谁，之后他跑多远都还是他；
 *      `pointerup` 位移 > 5 px ⇒ 判为拖地图，本次点击作废（验收 23）。
 *   ② **弹出即能打字**：窗口滑出后输入框自动聚焦，不需要再点一下。
 *   ③ **窗开着键盘归输入框**：本文件在面板上做 `stopPropagation`，让一期挂在
 *      `window` 上的 WASD / `C` / 缩放监听收不到键 —— 同时把 `keys` 清零，
 *      角色原地停下（验收 21、22）。关窗（Esc / ✕ / 点空白）自然归还。
 *
 * 真相源是 MySQL：本地 `mp_chat_<id>` 只存最近 30 条用来"秒开"，
 * 服务端回来之后**整个覆盖**（§7.4）。单机模式（§7.7）不写任何一个 `mp_` 键。
 * =============================================================== */

/* --- 0. 状态 --------------------------------------------------------- */
const MP_CHAT = {
  open: false,
  with: 0,                 // 正在跟谁聊（账号 id）
  hover: -1,               // 悬停在谁的精灵上（client.js 画那圈淡光）
  lock: null,              // pointerdown 锁定结果：{id, x, y, npc}
  sessions: new Map(),     // id -> 会话
  els: null,
  lastSend: 0,             // 客户端软限流：与服务端同口径（1 s / 30 条每分钟）
  winStart: 0, winN: 0,
  scrollLock: 0
};
const MP_CHAT_MAX = 500;
const MP_CHAT_PAGE = 30;
/* 在线快照（§6.1 `presence`）：userId -> {nickname, scene, look}。
   不在表里 ⇒ 离线。公告栏头像的绿点/灰点也读它。 */
const MP_ONLINE = new Map();

function mpChatSession(id) {
  let s = MP_CHAT.sessions.get(id);
  if (!s) {
    s = { id, msgs: [], seen: new Set(), hasMore: false, oldestId: 0, loading: false, paged: false, loaded: false, name: "", look: null };
    MP_CHAT.sessions.set(id, s);
  }
  return s;
}
function mpMyId() { return MP.me && MP.me.id ? Number(MP.me.id) : 0; }

/* --- 1. 本地缓存（只为秒开，不是真相源） ------------------------------ */
function mpChatCacheKey(id) { return "mp_chat_" + id; }
function mpChatCacheLoad(s) {
  if (MP.state !== "online") return;                    // §7.7：单机模式一个 mp_ 键都不读
  try {
    const raw = localStorage.getItem(mpChatCacheKey(s.id));
    if (!raw) return;
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return;
    for (const e of arr) {
      if (!e || !(e.m > 0) || typeof e.c !== "string") continue;
      if (s.seen.has(e.m)) continue;
      s.seen.add(e.m);
      s.msgs.push({ msgId: e.m, from: e.f, to: e.t, content: e.c, at: e.k, state: "ok" });
    }
    mpChatSort(s);
  } catch (e) {}
}
function mpChatCacheSave(s) {
  if (MP.state !== "online") return;
  try {
    const keep = s.msgs.filter(e => e.msgId > 0).slice(-MP_CHAT_PAGE)
      .map(e => ({ m: e.msgId, f: e.from, t: e.to, c: e.content, k: e.at }));
    localStorage.setItem(mpChatCacheKey(s.id), JSON.stringify(keep));
  } catch (e) {}
}
function mpChatSort(s) {
  s.msgs.sort((a, b) => (a.at - b.at) || (a.msgId - b.msgId));
}

/* --- 2. 名字 / 形象 / 头像 -------------------------------------------- */
function mpChatPeerName(id) {
  const p = MP.peers.get(id); if (p && p.nickname) return p.nickname;
  const on = MP_ONLINE.get(id); if (on && on.nickname) return on.nickname;
  const s = MP_CHAT.sessions.get(id); if (s && s.name) return s.name;
  return "玩家" + id;
}
function mpChatPeerLook(id) {
  const p = MP.peers.get(id); if (p && p.look) return p.look;
  const on = MP_ONLINE.get(id); if (on && on.look) return on.look;
  const s = MP_CHAT.sessions.get(id); if (s && s.look) return s.look;
  return null;
}
/* 头像一律由形象配方现画（§8.6），**绝不截别人的图**。look.js 没加载 ⇒ 首字兜底。 */
function mpChatAvatar(host, look, name, px) {
  host.textContent = "";
  const size = px || 24;
  if (typeof avatarOf === "function") {
    const src = avatarOf(look || (typeof mpDefaultLook === "function" ? mpDefaultLook() : null), 24);
    const c = document.createElement("canvas");
    c.width = size; c.height = size;
    c.className = "mcAva";
    const g = c.getContext("2d");
    g.imageSmoothingEnabled = false;                 // §10.5：放大不糊 = 最近邻
    g.drawImage(src, 0, 0, size, size);
    host.appendChild(c);
    return;
  }
  const d = document.createElement("span");
  d.className = "mcAvaTxt";
  d.textContent = (name || "?").slice(0, 1);
  host.appendChild(d);
}

/* --- 3. 时间 --------------------------------------------------------- */
function mpChatTime(at) {
  const d = new Date(at);
  const now = new Date();
  const hm = String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
  if (d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate()) return hm;
  return (d.getMonth() + 1) + "月" + d.getDate() + "日 " + hm;
}

/* --- 4. DOM ----------------------------------------------------------
   全部由本文件自己造（§10.1：联机 UI 不往一期的 HTML 里塞东西）。 */
function mpChatEnsureDom() {
  if (MP_CHAT.els) return MP_CHAT.els;
  const box = document.createElement("div");
  box.id = "mpChat";
  box.className = "mcOff";
  box.innerHTML =
    '<div class="mcHead">' +
      '<span class="mcAvaHost" id="mcAva"></span>' +
      '<div class="mcWho"><div class="mcNick" id="mcNick">…</div><div class="mcStat" id="mcStat"></div></div>' +
      '<button type="button" class="mcClose" id="mcClose" title="关闭（Esc）">✕</button>' +
    '</div>' +
    '<div class="mcList" id="mcList"></div>' +
    '<div class="mcFoot">' +
      '<input class="mcInput" id="mcInput" type="text" maxlength="' + MP_CHAT_MAX + '" placeholder="说点什么…（Enter 发送）" autocomplete="off">' +
      '<button type="button" class="mcSend" id="mcSend">发送</button>' +
    '</div>' +
    '<div class="mcCnt" id="mcCnt"></div>';
  document.body.appendChild(box);

  const els = { box, ava: box.querySelector("#mcAva"), nick: box.querySelector("#mcNick"),
                stat: box.querySelector("#mcStat"), list: box.querySelector("#mcList"),
                input: box.querySelector("#mcInput"), send: box.querySelector("#mcSend"),
                close: box.querySelector("#mcClose"), cnt: box.querySelector("#mcCnt") };

  /* 键盘交给输入框（§7.2.4）：面板内所有按键**一律不冒泡到 window**，
     一期的移动 / 蹲下 / 缩放 / NPC 对话监听因此全部让路。 */
  const hand = e => { e.stopPropagation(); };
  box.addEventListener("keydown", e => {
    e.stopPropagation();
    if (e.key === "Escape") { e.preventDefault(); mpChatClose(); return; }
    mpChatStopKeys();                                   // 兜住"按住不放"留下的粘键
  });
  box.addEventListener("keyup", hand);
  box.addEventListener("keypress", hand);

  els.close.addEventListener("click", () => mpChatClose());
  els.ava.addEventListener("click", () => {
    if (MP_CHAT.with > 0 && typeof showAvatarMenu === "function") showAvatarMenu(MP_CHAT.with, els.ava);
  });
  els.send.addEventListener("click", () => { mpChatSubmit(); });
  els.input.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); mpChatSubmit(); } });
  els.input.addEventListener("input", () => mpChatCount());
  els.list.addEventListener("scroll", () => mpChatOnScroll());
  box.addEventListener("pointerdown", e => e.stopPropagation());

  MP_CHAT.els = els;
  return els;
}
/* 角色原地停下：把一期那份按键表整个清零（只清 `keys`，不碰别的）。 */
function mpChatStopKeys() {
  if (typeof keys === "undefined" || !keys) return;
  for (const k in keys) keys[k] = 0;
}

/* --- 5. 开窗 / 关窗 / 切换 ------------------------------------------- */
function mpChatOpen(id) {
  if (MP.state !== "online") { mpNotice("当前是单机模式，暂时找不到同学", "warn", 2500); return; }
  id = Math.trunc(Number(id) || 0);
  if (!(id > 0) || id === mpMyId()) return;              // §7.2.3：点自己不弹窗
  const els = mpChatEnsureDom();
  /* 已经开着同一个人的窗 ⇒ 只把光标放回输入框，不重复开（§7.2.5）。 */
  if (MP_CHAT.open && MP_CHAT.with === id) { mpChatFocus(); return; }

  MP_CHAT.open = true; MP_CHAT.with = id;
  const s = mpChatSession(id);
  if (!s.name) s.name = mpChatPeerName(id);
  if (!s.look) s.look = mpChatPeerLook(id);
  if (!s.loaded) mpChatCacheLoad(s);

  els.box.classList.remove("mcOff");                     // 滑出 ~300 ms（CSS transition）
  mpAnnDock();
  els.nick.textContent = s.name || mpChatPeerName(id);
  mpChatStopKeys();                                      // 键盘交接 + 停下角色
  mpChatStatus();
  mpChatRender();
  mpChatFocus();
  mpChatCount();

  if (!s.loaded) {
    s.loaded = true; s.paged = false; s.loading = true;
    mpSend({ type: "chat.history", withUser: id, limit: MP_CHAT_PAGE });   // 打开拉最近 30 条
  }
  /* §7.4「打开即写 `read_at`」：离线期间压着的那几条一摊开就算读过。
     ⚠️ 每次打开都要报一次（不只首次）—— 窗关了又来新消息，第二次打开才清得掉，
        不然服务端每次重连都把这些老消息当未读再补推一遍（`mp_message.read_at` 是唯一凭据）。 */
  mpSend({ type: "chat.read", withUser: id });
}
function mpChatClose() {
  if (!MP_CHAT.els) return;
  MP_CHAT.open = false; MP_CHAT.with = 0;
  MP_CHAT.els.box.classList.add("mcOff");
  mpAnnDock();
  if (document.activeElement === MP_CHAT.els.input) { try { MP_CHAT.els.input.blur(); } catch (e) {} }
  mpChatStopKeys();                                      // 免得关窗瞬间还粘着一个键
}
function mpChatFocus() {
  const els = MP_CHAT.els; if (!els) return;
  try { els.input.focus({ preventScroll: true }); } catch (e) { try { els.input.focus(); } catch (e2) {} }
  els.box.classList.remove("mcShake");                   // 强制一次重绘，重复点击时给个反馈
  void els.box.offsetWidth;
  els.box.classList.add("mcShake");
  setTimeout(() => { if (MP_CHAT.els) MP_CHAT.els.box.classList.remove("mcShake"); }, 260);
}
/* 焦点是不是在**别的**输入控件里（抽屉里的搜索框、登录门…）。是的话不抢焦点。 */
function mpChatTypingElsewhere() {
  const a = document.activeElement;
  if (!a || a === document.body || a === document.documentElement) return false;
  if (MP_CHAT.els && a === MP_CHAT.els.input) return false;
  const tag = String(a.tagName || "").toLowerCase();
  if (tag === "input" || tag === "textarea" || tag === "select") return true;
  return !!(a.isContentEditable);
}
/* 顶部状态行（§7.2.5 / §7.4）：正在走动 / 已离开当前场景 / 离线 */
function mpChatStatus() {
  const els = MP_CHAT.els;
  if (!els || !MP_CHAT.open) return;
  const id = MP_CHAT.with;
  const on = MP_ONLINE.get(id);
  let txt, cls;
  if (!on) { txt = "离线 · 消息将在他上线后送达"; cls = "off"; }
  else if (on.scene && on.scene !== MP.scene) { txt = "已离开当前场景"; cls = "away"; }
  else { txt = "正在走动"; cls = "here"; }
  els.stat.textContent = txt;
  els.stat.className = "mcStat " + cls;
}

/* --- 6. 渲染 --------------------------------------------------------- */
function mpChatRender() {
  const els = MP_CHAT.els;
  if (!els) return;
  const s = MP_CHAT.sessions.get(MP_CHAT.with);
  const list = els.list;
  const stick = list.scrollHeight - list.scrollTop - list.clientHeight < 60;
  const atBottom = !MP_CHAT.scrollLock && stick;
  const my = mpMyId();
  const frag = document.createDocumentFragment();
  if (s && s.hasMore && s.msgs.length) {
    const more = document.createElement("div");
    more.className = "mcMore";
    more.textContent = s.loading ? "正在翻更早的记录…" : "上滑看更早的消息";
    frag.appendChild(more);
  }
  const rows = s ? s.msgs : [];
  let lastDay = "";
  for (const e of rows) {
    const d = new Date(e.at);
    const day = d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate();
    if (day !== lastDay) {
      lastDay = day;
      const sep = document.createElement("div");
      sep.className = "mcDay";
      sep.textContent = mpChatTime(e.at).replace(/\s?\d\d:\d\d$/, "") || "——";
      frag.appendChild(sep);
    }
    const mine = e.from === my;
    const row = document.createElement("div");
    row.className = "mcRow" + (mine ? " me" : "") + (e.state === "fail" ? " fail" : "");
    const av = document.createElement("span");
    av.className = "mcRowAva";
    /* 头像与地图小人同源（§8.6）：自己的用本地配方，别人的用同步过来的配方。 */
    mpChatAvatar(av, mine ? mpMyLook() : mpChatPeerLook(e.from), mine ? mpMyNickname() : mpChatPeerName(e.from), 24);
    if (!mine) av.addEventListener("click", () => { if (typeof showAvatarMenu === "function") showAvatarMenu(e.from, av); });
    const bub = document.createElement("div");
    bub.className = "mcBubble";
    bub.textContent = e.content;
    const meta = document.createElement("div");
    meta.className = "mcMeta";
    meta.textContent = (mine ? (e.state === "fail" ? "没发出去 · 点击重发" : e.state === "pending" ? "发送中…" : "") : mpChatPeerName(e.from)) +
      " · " + mpChatTime(e.at);
    if (e.state === "fail") meta.className = "mcMeta fail", meta.addEventListener("click", () => mpChatRetry(e));
    const wrap = document.createElement("div");
    wrap.className = "mcBody";
    wrap.appendChild(meta); wrap.appendChild(bub);
    row.appendChild(av); row.appendChild(wrap);
    frag.appendChild(row);
  }
  list.textContent = "";
  list.appendChild(frag);
  if (atBottom) mpChatToBottom();
}
function mpChatToBottom() {
  const els = MP_CHAT.els; if (!els) return;
  els.list.scrollTop = els.list.scrollHeight;
}
function mpChatCount() {
  const els = MP_CHAT.els;
  if (!els) return;
  const n = [...els.input.value].length;
  els.cnt.textContent = n > 0 ? n + "/" + MP_CHAT_MAX : (MP_CHAT.with ? "" : "");
  els.cnt.className = "mcCnt" + (n > MP_CHAT_MAX ? " over" : "");
}

/* --- 7. 发送 --------------------------------------------------------- */
function mpChatSubmit() {
  const els = MP_CHAT.els;
  if (!els || !MP_CHAT.open) return;
  const text = els.input.value;
  if (!mpChatSendText(text)) return;
  els.input.value = "";
  mpChatCount();
  els.input.focus();
}
/* 返回真值 ⇒ 这条已经进会话（输入框可以清空）。限流在服务端也有一道，这里是前置。 */
function mpChatSendText(raw) {
  const id = MP_CHAT.with;
  if (!(id > 0)) return false;
  const content = String(raw == null ? "" : raw).replace(/\r\n?/g, "\n").trim();
  const len = [...content].length;
  if (!len) return false;
  if (len > MP_CHAT_MAX) { mpNotice("私聊最多 " + MP_CHAT_MAX + " 字，现在 " + len + " 字", "warn", 2600); return false; }
  const now = Date.now();
  if (now - MP_CHAT.lastSend < 1000) { mpNotice("慢一点，一秒只能发一条", "warn", 2000); return false; }
  if (!MP_CHAT.winStart || now - MP_CHAT.winStart > 60000) { MP_CHAT.winStart = now; MP_CHAT.winN = 0; }
  if (MP_CHAT.winN >= 30) { mpNotice("这一分钟发得太多了，歇一会儿", "warn", 2400); return false; }
  MP_CHAT.lastSend = now; MP_CHAT.winN++;

  const s = mpChatSession(id);
  const cmid = "c" + now.toString(36) + Math.random().toString(36).slice(2, 8);
  s.msgs.push({ msgId: 0, from: mpMyId(), to: id, content, at: now, cmid, state: "pending" });
  mpSend({ type: "chat.send", to: id, content, clientMsgId: cmid });
  mpChatRender();
  mpChatToBottom();
  return true;
}
function mpChatRetry(e) {
  /* 失败的那条从会话里摘掉，内容回灌到发送流程（保留原文，不让人重打）。 */
  const s = MP_CHAT.sessions.get(MP_CHAT.with);
  if (!s) return;
  const i = s.msgs.indexOf(e);
  if (i >= 0) s.msgs.splice(i, 1);
  MP_CHAT.lastSend = 0;                       // 重发算"人点的"，不该被 1 秒闸门卡住
  mpChatSendText(e.content);
  mpChatRender();
}

/* --- 8. 收（由 client.js 的消息口转进来） ----------------------------
   返回真值 ⇒ 这条我接了，别的地方别再当未知类型处理。 */
function mpNetMessage(m) {
  if (!m || typeof m.type !== "string") return false;
  switch (m.type) {
    case "presence": {
      const list = Array.isArray(m.list) ? m.list : null;
      if (list) {
        MP_ONLINE.clear();
        for (const it of list) if (it && it.userId) MP_ONLINE.set(Number(it.userId), { nickname: it.nickname || "", scene: it.scene || "", look: it.look || null });
      } else if (m.userId) {
        if (m.online) MP_ONLINE.set(Number(m.userId), { nickname: m.nickname || "", scene: m.scene || "", look: m.look || null });
        else MP_ONLINE.delete(Number(m.userId));
      }
      mpChatStatus();
      if (typeof mpAnnounceRepaint === "function") mpAnnounceRepaint();
      return true;
    }
    case "chat.msg": {
      const id = Number(m.from);
      if (!(id > 0)) return true;
      const s = mpChatSession(id);
      if (!s.name && m.fromNickname) s.name = m.fromNickname;
      if (m.msgId > 0 && s.seen.has(m.msgId)) return true;         // 补推去重：一条不丢，也不重复
      if (m.msgId > 0) s.seen.add(m.msgId);
      s.msgs.push({ msgId: Number(m.msgId) || 0, from: id, to: Number(m.to), content: String(m.content || ""), at: Number(m.at) || Date.now(), state: "ok" });
      mpChatSort(s);
      mpChatCacheSave(s);
      if (MP_CHAT.open && MP_CHAT.with === id) {
        /* 正在看窗 ⇒ 只有本来就在底部附近才跟着滚（翻历史时来新消息不该被拽走）。 */
        const stick = els => (els.list.scrollHeight - els.list.scrollTop - els.list.clientHeight) < 90;
        const wasStick = MP_CHAT.els ? stick(MP_CHAT.els) : true;
        mpChatRender();
        if (wasStick) mpChatToBottom();
        mpSend({ type: "chat.read", withUser: id });              // 窗开着收到 ⇒ 当场已读
        if (!mpChatTypingElsewhere()) mpChatFocus();
      }
      return true;
    }
    case "chat.ack": {
      const s = MP_CHAT.sessions.get(Number(m.to));
      if (!s) return true;
      const e = s.msgs.find(x => x.cmid && x.cmid === m.clientMsgId);
      if (e) {
        e.msgId = Number(m.msgId) || 0; e.at = Number(m.at) || e.at; e.state = "ok";
        if (e.msgId) s.seen.add(e.msgId);
        mpChatSort(s); mpChatCacheSave(s);
      }
      if (MP_CHAT.open && MP_CHAT.with === s.id) mpChatRender();
      return true;
    }
    case "chat.history": {
      const s = MP_CHAT.sessions.get(Number(m.withUser));
      if (!s) return true;
      const list = (Array.isArray(m.list) ? m.list : []).map(e => ({
        msgId: Number(e.msgId), from: Number(e.from), to: Number(e.to),
        content: String(e.content || ""), at: Number(e.at) || 0, state: "ok"
      })).filter(e => e.msgId > 0);
      s.loading = false;
      if (s.paged) {
        /* 翻页：更早的一页**插到前面**，已有的按 msgId 跳过。 */
        const earlier = list.filter(e => !s.seen.has(e.msgId));
        for (const e of earlier) s.seen.add(e.msgId);
        s.msgs = earlier.concat(s.msgs);
        s.paged = false;
      } else {
        /* 首屏：服务端那份是真相，整个覆盖；只保留还没回执的本地待发条目。 */
        for (const e of list) s.seen.add(e.msgId);
        const pend = s.msgs.filter(e => e.msgId === 0);
        s.msgs = list.concat(pend);
        mpChatSort(s);
      }
      s.hasMore = !!m.hasMore;
      s.oldestId = list.length ? list[0].msgId : Number(m.oldestId) || s.oldestId;
      mpChatCacheSave(s);
      if (MP_CHAT.open && MP_CHAT.with === s.id) {
        const keep = MP_CHAT.els ? MP_CHAT.els.list.scrollTop : 0;
        mpChatRender();
        if (!s.paged && keep > 0) MP_CHAT.els.list.scrollTop = keep;
      }
      return true;
    }
    case "error": {
      if (typeof mpAnnMessage === "function" && String(m.code || "").indexOf("ann_") === 0) {
        if (mpAnnMessage(m)) return true;
      }
      const cmid = m.clientMsgId;
      if (!cmid) return false;
      const kind = String(m.code || "");
      if (kind.indexOf("chat") !== 0 && ["too_long", "too_fast", "flood", "empty", "bad_target", "save_failed"].indexOf(kind) < 0) return false;
      for (const s of MP_CHAT.sessions.values()) {
        const e = s.msgs.find(x => x.cmid === cmid);
        if (e) {
          e.state = "fail";
          if (MP_CHAT.open && MP_CHAT.with === s.id) mpChatRender();
          if (m.msg) mpNotice(m.msg, "warn", 2600);
          return true;
        }
      }
      return false;
    }
    case "announce.new":
    case "announce.list":
      return mpAnnMessage(m);                       // 公告栏（模块 5，§7.3）
    default:
      return false;
  }
}

/* --- 8.5 已读的两条路（§7.4「打开即写 read_at」）---------------------
   ① 开窗拉历史：服务端在处理 `chat.history` 时顺手把这一会话的未读全部写 `read_at`；
   ② 窗**开着期间**新到的消息：没有再拉历史，所以补一条 `chat.read`。
   协议冻结表（§6.1）里没有单独的已读类型，这一条是为「打开即已读」补的最小扩展：
   只写 `read_at`，不带正文、不新增表字段，客户端离线/单机时永远不会发它。 */

/* --- 9. 上滑翻页 ----------------------------------------------------- */
function mpChatOnScroll() {
  const els = MP_CHAT.els;
  if (!els || !MP_CHAT.open) return;
  const s = MP_CHAT.sessions.get(MP_CHAT.with);
  if (!s || !s.hasMore || s.loading) return;
  if (els.list.scrollTop > 40) return;
  if (!s.oldestId) return;
  s.loading = true; s.paged = true;
  mpSend({ type: "chat.history", withUser: s.id, beforeId: s.oldestId, limit: MP_CHAT_PAGE });
  mpChatRender();
}

/* --- 10. 命中判定（§7.2.3，写死别调） --------------------------------
   返回 {id} / {npc:true} / null。坐标换算成**画布像素**再比包围盒。 */
function mpChatBoard(ev) {
  const t = mpChatTargetCanvas();
  if (!t) return null;
  const r = t.cv.getBoundingClientRect();
  if (!r.width || !r.height) return null;
  const k = t.cv.width / r.width;                     // CSS 放大倍数（室外整数倍 / 室内 ≈1）
  t.k = k;
  return { x: (ev.clientX - r.left) * k, y: (ev.clientY - r.top) * k, t };
}
function mpChatTargetCanvas() {
  const indoor = (typeof CENTER !== "undefined") && CENTER && CENTER.active && CENTER.room;
  if (indoor && typeof ctrCv !== "undefined" && ctrCv && !ctrCv.hidden) return { cv: ctrCv, indoor: true };
  if (typeof cv !== "undefined" && cv) return { cv, indoor: false };
  return null;
}
/* 把"世界坐标 + 精灵锚点"换算成画布包围盒。室外/室内两套映射，公式同构。 */
function mpChatRect(t, wx, wy, ax, ay, w, h) {
  if (t.indoor) {
    const Z = ctrZoom();
    const ox = ((ctrCv.width - CTR_W * Z) / 2) | 0, oy = ((ctrCv.height - CTR_H * Z) / 2) | 0;
    return { x: ox + (wx - ax) * Z, y: oy + (wy - ay) * Z, w: w * Z, h: h * Z };
  }
  const ox = Math.round(cam.x), oy = Math.round(cam.y);
  return { x: (wx - ax - ox) * zoom, y: (wy - ay - oy) * zoom, w: w * zoom, h: h * zoom };
}
/* 命中框：包围盒 + 移动中外扩 5 屏幕像素；太小的一档保证至少 16×16 可点。 */
function mpChatHitBox(t, bx, by, wx, wy, moving) {
  const r = mpChatRect(t, wx, wy, CH_AX, CH_AY, CH_W, CH_H);
  const padBoard = 5 / (t.k || 1);
  const p = moving ? padBoard : Math.max(1, padBoard / 3);
  let x = r.x - p, y = r.y - p, w = r.w + 2 * p, h = r.h + 2 * p;
  const min = 16 / (t.k || 1);
  if (w < min) { x -= (min - w) / 2; w = min; }
  if (h < min) { y -= (min - h) / 2; h = min; }
  return bx >= x && bx <= x + w && by >= y && by <= y + h;
}
function mpChatNpcHit(t, bx, by) {
  if (t.indoor) {
    const n = CENTER.room.npc;
    return n && mpChatHitBox(t, bx, by, n.x, n.y, false);
  }
  if (typeof GUIDE !== "undefined" && GUIDE && mpChatHitBox(t, bx, by, GUIDE.x, GUIDE.y, false)) return true;
  if (typeof GUARD !== "undefined" && GUARD && mpChatHitBox(t, bx, by, GUARD.x, GUARD.y, false)) return true;
  if (typeof AUNT !== "undefined" && AUNT && mpChatHitBox(t, bx, by, AUNT.x, AUNT.y, false)) return true;
  if (typeof CATS !== "undefined" && CATS) {
    for (const c of CATS) {
      if (!c.active) continue;
      /* 猫比人小一号：用自己的锚点算包围盒，别让 16 px 的保底把它撑成大饼。 */
      const r = mpChatRect(t, c.x, c.y, CAT_AX, CAT_AY, CAT_W, CAT_H);
      if (bx >= r.x && bx <= r.x + r.w && by >= r.y && by <= r.y + r.h) return true;
    }
  }
  return false;
}
function mpChatPick(ev) {
  const b = mpChatBoard(ev);
  if (!b) return null;
  const t = b.t;
  /* NPC 优先（§7.2.3 / §13 风险 17）：压在一起时点人**不开窗**，让一期的规则赢。 */
  if (mpChatNpcHit(t, b.x, b.y)) return { npc: true };
  let best = null;
  for (const p of MP.peers.values()) {
    if (p.scene !== MP.scene) continue;
    if (!mpChatHitBox(t, b.x, b.y, p.x, p.y, Math.abs(p.tx - p.x) > 0.8 || Math.abs(p.ty - p.y) > 0.8)) continue;
    /* 重叠取 baseY 最大（站得更靠前）——与一期遮挡排序同口径。 */
    if (!best || p.y > best.y) best = p;
  }
  return best ? { id: best.id } : null;
}

/* --- 11. 挂到画布上：悬停 / 按下锁定 / 抬起作废 -----------------------
   两块画布（室外 `#cv`、室内 `#ctrCv`）各挂一组，`_mpChatBound` 防重复。
   ⚠️ 只挂 `pointer*`，一期的鼠标/按键语义一概不改（§11.2 第 11 条）。 */
function mpChatBind() {
  for (const el of [typeof cv !== "undefined" ? cv : null, typeof ctrCv !== "undefined" ? ctrCv : null]) {
    if (!el || el._mpChatBound) continue;
    el._mpChatBound = true;
    el.addEventListener("pointermove", mpChatOnMove);
    el.addEventListener("pointerdown", mpChatOnDown);
    el.addEventListener("pointerup", mpChatOnUp);
    el.addEventListener("pointerleave", () => { MP_CHAT.hover = -1; el.style.cursor = ""; });
    el.addEventListener("pointercancel", () => { MP_CHAT.lock = null; });
  }
}
function mpChatOnMove(ev) {
  if (MP.state !== "online" || MP_CHAT.lock) return;
  if (ev.pointerType === "mouse" && ev.buttons) return;          // 拖拽途中不做悬停判定
  const hit = mpChatPick(ev);
  const id = hit && hit.id ? hit.id : -1;
  MP_CHAT.hover = id;
  ev.currentTarget.style.cursor = id > 0 ? "pointer" : "";
}
function mpChatOnDown(ev) {
  if (ev.button !== undefined && ev.button !== 0) { return; }
  if (MP.state !== "online") return;
  const hit = mpChatPick(ev);
  MP_CHAT.lock = hit ? { id: hit.id || 0, npc: !!hit.npc, x: ev.clientX, y: ev.clientY } : { id: 0, npc: false, x: ev.clientX, y: ev.clientY };
}
function mpChatOnUp(ev) {
  const lock = MP_CHAT.lock;
  MP_CHAT.lock = null;
  if (!lock) return;
  /* 位移 > 5 px ⇒ 判为拖地图，本次点击作废（验收 23）。 */
  if (Math.hypot(ev.clientX - lock.x, ev.clientY - lock.y) > 5) return;
  if (lock.npc) return;                                          // NPC 赢了这一手
  if (lock.id > 0) { mpChatOpen(lock.id); return; }
  /* 点在空白：窗收回去（§7.2.4「点空白」），键盘交还角色。 */
  if (MP_CHAT.open) mpChatClose();
}

/* --- 13. 公告栏（模块 5，§7.3）---------------------------------------
   画布**右上角**：收起态只有图标 + 未读数，展开态一份列表 + 输入框。
   可见范围 L2 全服在线（人在机房里也收得到）；列表与红点都从网关的
   `announce.list` / `announce.new` 来，本地只存「读到第几条」这**一个数字** ——
   它不是真相源（§11.3），删掉最多让红点重新亮一次。
   ⚠️ 单机模式整块隐藏（§7.7「公告栏隐藏」），并且一条公告都不发。 */
const MP_ANN = {
  els: null,
  open: false,
  items: [],            // 最新在前
  got: false,           // 拉过一趟 list
  loading: false,
  pending: null,        // {cmid, content, at, state:"send"|"fail"}
  cool: 0               // 下一次可发布的时刻（毫秒）；服务端还会再算一遍
};
const MP_ANN_MAX = 200;
const MP_ANN_GAP_MS = 30000;      // §7.3 单人 ≥30 秒一条
const MP_ANN_KEEP = 50;           // §7.3 列表最多 50 条

function mpAnnSeenKey() { return "mp_ann_seen_" + mpMyId(); }
function mpAnnSeenMax() {
  try { return Math.max(0, Math.trunc(Number(localStorage.getItem(mpAnnSeenKey()) || 0)) || 0); }
  catch (e) { return 0; }
}
function mpAnnMarkSeen() {
  const top = MP_ANN.items.length ? Number(MP_ANN.items[0].id) || 0 : 0;
  if (top <= mpAnnSeenMax()) return;
  try { localStorage.setItem(mpAnnSeenKey(), String(top)); } catch (e) {}
}
/* 未读数：列表里比「读到过的最大 id」更新的那几条。收起态的红点就是它。 */
function mpAnnUnread() {
  const seen = MP_ANN.open ? (MP_ANN.items.length ? Number(MP_ANN.items[0].id) : mpAnnSeenMax()) : mpAnnSeenMax();
  let n = 0;
  for (const it of MP_ANN.items) if (Number(it.id) > seen) n++;
  return n;
}
function mpAnnAgo(at) {
  const s = Math.max(0, Math.floor((Date.now() - (Number(at) || 0)) / 1000));
  if (s < 60) return "刚刚";
  if (s < 3600) return Math.floor(s / 60) + " 分钟前";
  if (s < 86400) return Math.floor(s / 3600) + " 小时前";
  return Math.floor(s / 86400) + " 天前";
}

function mpAnnEnsureDom() {
  if (MP_ANN.els) return MP_ANN.els;
  const box = document.createElement("div");
  box.id = "mpAnn";
  box.innerHTML =
    '<button type="button" class="anTab" id="anTab">' +
      '<span class="anIco">📌</span><span class="anTxt">公告</span>' +
      '<span class="anBadge" id="anBadge"></span>' +
    '</button>' +
    '<div class="anPanel">' +
      '<div class="anHead">公告栏<button type="button" class="anClose" id="anClose" title="收起（Esc）">✕</button></div>' +
      '<div class="anList" id="anList"></div>' +
      '<div class="anFoot">' +
        '<input class="anInput" id="anInput" type="text" maxlength="' + MP_ANN_MAX + '" placeholder="说点什么…（Enter 发送）" autocomplete="off">' +
        '<button type="button" class="anSend" id="anSend">发送</button>' +
      '</div>' +
      '<div class="anCnt" id="anCnt"></div>' +
    '</div>';
  document.body.appendChild(box);

  const els = { box, tab: box.querySelector("#anTab"), badge: box.querySelector("#anBadge"),
                panel: box.querySelector(".anPanel"), list: box.querySelector("#anList"),
                input: box.querySelector("#anInput"), send: box.querySelector("#anSend"),
                close: box.querySelector("#anClose"), cnt: box.querySelector("#anCnt") };

  /* 与私聊窗同一条键盘规矩（§7.2.4）：面板内的按键一律不冒泡到 window，
     一期那套移动 / 蹲下 / 缩放监听因此让路；Esc 收起并把键盘交还角色。 */
  const hand = e => { e.stopPropagation(); };
  box.addEventListener("keydown", e => {
    e.stopPropagation();
    if (e.key === "Escape") { e.preventDefault(); mpAnnClose(); return; }
    mpChatStopKeys();
  });
  box.addEventListener("keyup", hand);
  box.addEventListener("keypress", hand);
  box.addEventListener("pointerdown", e => e.stopPropagation());

  els.tab.addEventListener("click", () => { MP_ANN.open ? mpAnnClose() : mpAnnOpen(); });
  els.close.addEventListener("click", () => mpAnnClose());
  els.send.addEventListener("click", () => mpAnnSubmit());
  els.input.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); mpAnnSubmit(); } });
  els.input.addEventListener("input", () => mpAnnCount());

  MP_ANN.els = els;
  return els;
}
/* 公告栏钉在**画布**右上角（§7.3："画布右上角，距顶 16 px、距右 16 px"），
   不是浏览器窗口角 —— 页面右上角那枚用户胶囊（退出登录）会和它叠在一起。
   私聊窗（右栏 320 px）开着时再往左让一个身位，两条右栏不叠。
   1 秒一次 + 窗口尺寸变化时算一遍；`position:fixed`，所以直接用视口坐标。 */
function mpAnnPlace() {
  const els = MP_ANN.els;
  if (!els) return;
  const t = mpChatTargetCanvas();
  const r = t ? t.cv.getBoundingClientRect() : null;
  const dock = MP_CHAT.open ? 336 : 0;
  const right = (r && r.width ? window.innerWidth - r.right + 16 : 16) + dock;
  let top = r && r.height ? r.top + 16 : 16;
  /* 「退出登录」(#lgOut：fixed / top 12 / right 14 / 高约 27) 钉的是**浏览器窗口**的右上角，
     公告栏钉的是**画布**的右上角。画布铺满窗口时 `r.top` 接近 0 ⇒ 两颗正好叠在同一个角。
     所以只要那颗按钮真的显示着，公告栏就往下让到它的下沿以外（室内 `body.ctr-on` 时它
     `display:none`，rect 高 0 ⇒ 不用让）。 */
  const lg = document.getElementById("lgOut");
  if (lg && !lg.hidden) {
    const lr = lg.getBoundingClientRect();
    if (lr.height > 0) top = Math.max(top, lr.bottom + 10);
  }
  els.box.style.top = Math.round(Math.max(8, top)) + "px";
  els.box.style.right = Math.round(Math.max(8, right)) + "px";
  /* 展开态别从画布底下漏出去：能用的竖直空间就是画布底边减去收起按钮那一格。 */
  const avail = r && r.height ? Math.round(r.bottom - (top + 62)) : 0;
  els.panel.style.maxHeight = Math.max(160, avail) + "px";
}
function mpAnnDock() { mpAnnPlace(); }

function mpAnnOpen() {
  if (MP.state !== "online") return;
  MP_ANN.open = true;
  const els = mpAnnEnsureDom();
  els.box.classList.add("anOn");
  if (!MP_ANN.got && !MP_ANN.loading) { MP_ANN.loading = true; mpSend({ type: "announce.list", limit: MP_ANN_KEEP }); }
  mpAnnRender();
  mpAnnMarkSeen();
  mpAnnFocus();
}
function mpAnnClose() {
  MP_ANN.open = false;
  if (!MP_ANN.els) return;
  mpAnnMarkSeen();
  MP_ANN.els.box.classList.remove("anOn");
  if (MP_ANN.els.input === document.activeElement) MP_ANN.els.input.blur();
  mpAnnBadge();
}
/* 展开即输入（与私聊窗同一个手感）：角色原地停下，光标落在输入框。 */
function mpAnnFocus() {
  const els = MP_ANN.els;
  if (!els || !MP_ANN.open) return;
  mpChatStopKeys();
  clearTimeout(mpAnnFocus._t);
  mpAnnFocus._t = setTimeout(() => { try { els.input.focus({ preventScroll: true }); } catch (e) { els.input.focus(); } }, 320);
}
function mpAnnCount() {
  const els = MP_ANN.els;
  if (!els) return;
  const n = [...els.input.value].length;
  els.cnt.textContent = n ? n + " / " + MP_ANN_MAX : "";
  els.cnt.className = "anCnt" + (n > MP_ANN_MAX ? " over" : "");
}
/* 30 秒冷却写在按钮上，点错了也不发（服务端仍会再拒一次）。 */
function mpAnnSendState() {
  const els = MP_ANN.els;
  if (!els) return;
  const left = MP_ANN.cool - Date.now();
  if (left > 0) {
    els.send.disabled = true;
    els.send.textContent = Math.ceil(left / 1000) + " 秒";
  } else {
    els.send.disabled = MP_ANN.pending !== null;
    els.send.textContent = "发送";
  }
}
function mpAnnSubmit() {
  const els = MP_ANN.els;
  if (!els || MP.state !== "online") return;
  const text = els.input.value.replace(/\r\n?/g, "\n").trim();
  const len = [...text].length;
  if (!len) { mpNotice("空公告不发出去", "warn", 1600); mpAnnFocus(); return; }
  if (len > MP_ANN_MAX) { mpNotice("公告最多 " + MP_ANN_MAX + " 字", "crit", 2000); return; }
  if (MP_ANN.pending) { mpNotice("上一条还在发…", "warn", 1600); return; }
  const left = MP_ANN.cool - Date.now();
  if (left > 0) { mpNotice("慢一点，公告 " + (MP_ANN_GAP_MS / 1000) + " 秒只能发一条", "warn", 2000); return; }
  const cmid = "a" + Date.now().toString(36) + Math.floor(Math.random() * 1e4).toString(36);
  MP_ANN.pending = { cmid, content: text, at: Date.now(), state: "send" };
  MP_ANN.cool = Date.now() + MP_ANN_GAP_MS;
  els.input.value = "";
  mpAnnCount();
  mpSend({ type: "announce.post", content: text, clientMsgId: cmid });
  mpAnnRender();
  mpAnnFocus();
}
function mpAnnRetry() {
  const p = MP_ANN.pending;
  if (!p || p.state !== "fail" || MP.state !== "online") return;
  p.state = "send"; p.at = Date.now();
  mpSend({ type: "announce.post", content: p.content, clientMsgId: p.cmid });
  mpAnnRender();
}
function mpAnnBadge() {
  const els = MP_ANN.els;
  if (!els) return;
  const n = MP_ANN.open ? 0 : mpAnnUnread();
  els.badge.textContent = n > 0 ? (n > 99 ? "99+" : String(n)) : "";
  els.box.classList.toggle("hasNew", n > 0);
}
/* 头像：有形象配方就现画（§8.6），look.js 没加载 ⇒ 首字兜底。
   右下角绿点/灰点是「在线 / 离线」，离线悬停写"3 小时前在线"（§7.3）。 */
function mpAnnAvatar(host, it) {
  host.textContent = "";
  const c = document.createElement("canvas");
  c.width = 28; c.height = 28;
  c.className = "anAva";
  const g = c.getContext("2d");
  g.imageSmoothingEnabled = false;
  if (typeof avatarOf === "function") {
    g.drawImage(avatarOf(it.look || (typeof mpDefaultLook === "function" ? mpDefaultLook() : null), 24), 0, 0, 28, 28);
  } else {
    g.fillStyle = "#1d2129"; g.fillRect(0, 0, 28, 28);
    g.fillStyle = "#e9e5d8"; g.font = "14px ui-monospace, Consolas, monospace";
    g.textAlign = "center"; g.textBaseline = "middle";
    g.fillText(String(it.nickname || "?").slice(0, 1), 14, 15);
  }
  host.appendChild(c);
  const dot = document.createElement("i");
  const live = it.online || MP_ONLINE.has(Number(it.userId));
  dot.className = "anDot" + (live ? " on" : "");
  host.appendChild(dot);
  host.title = live ? "在线" : (it.lastSeen ? mpAnnAgo(it.lastSeen) + "在线" : "离线");
}
function mpAnnRender() {
  const els = MP_ANN.els;
  if (!els) return;
  const list = els.list;
  list.textContent = "";
  if (MP_ANN.loading && !MP_ANN.items.length) {
    const p = document.createElement("div"); p.className = "anEmpty"; p.textContent = "正在拉公告…";
    list.appendChild(p);
  } else if (!MP_ANN.items.length && !MP_ANN.pending) {
    const p = document.createElement("div"); p.className = "anEmpty";
    p.textContent = "还没有人发公告，说点什么吧";
    list.appendChild(p);
  }
  /* 自己那条先落地（等 ack 时它是"发送中"，失败时给一个重试）。 */
  if (MP_ANN.pending) {
    const r = document.createElement("div");
    r.className = "anRow me" + (MP_ANN.pending.state === "fail" ? " fail" : "");
    const head = document.createElement("div"); head.className = "anWho";
    const ava = document.createElement("span"); ava.className = "anAvaHost";
    mpChatAvatar(ava, typeof mpMyLook === "function" ? mpMyLook() : null, mpMyNickname(), 28);
    const nick = document.createElement("b"); nick.textContent = mpMyNickname() || "我";
    const ago = document.createElement("span"); ago.className = "anAgo";
    ago.textContent = MP_ANN.pending.state === "fail" ? "没发出去" : "发送中…";
    head.appendChild(ava); head.appendChild(nick); head.appendChild(ago);
    const body = document.createElement("div"); body.className = "anTxt2";
    body.textContent = MP_ANN.pending.content;
    r.appendChild(head); r.appendChild(body);
    if (MP_ANN.pending.state === "fail") {
      const retry = document.createElement("button");
      retry.type = "button"; retry.className = "anRetry"; retry.textContent = "重试";
      retry.addEventListener("click", mpAnnRetry);
      ago.appendChild(retry);
    }
    list.appendChild(r);
  }
  for (const it of MP_ANN.items) {
    const r = document.createElement("div");
    r.className = "anRow" + (Number(it.userId) === mpMyId() ? " me" : "");
    const head = document.createElement("div"); head.className = "anWho";
    const ava = document.createElement("span"); ava.className = "anAvaHost";
    mpAnnAvatar(ava, it);
    ava.addEventListener("click", () => mpAnnContact(it, ava));
    const nick = document.createElement("b");
    nick.textContent = it.nickname || ("玩家" + it.userId);
    nick.addEventListener("click", () => mpAnnContact(it, nick));
    const ago = document.createElement("span"); ago.className = "anAgo";
    ago._at = it.at;                                  // mpAnnTimes 每秒只改这几个字
    ago.textContent = mpAnnAgo(it.at);
    head.appendChild(ava); head.appendChild(nick); head.appendChild(ago);
    const body = document.createElement("div"); body.className = "anTxt2";
    body.textContent = it.content;                  // 纯文本，不解析（§7.3）
    r.appendChild(head); r.appendChild(body);
    list.appendChild(r);
  }
  mpAnnBadge();
  mpAnnSendState();
  if (MP_ANN.open) mpAnnMarkSeen();      // 只有摊在人面前才算读过
}
/* 公告栏上的头像/昵称是**联系人入口**（§7.3）：模块 6 的 `showAvatarMenu` 没加载时
   直接开私聊窗，走的就是同一份会话，不各写一套。 */
function mpAnnContact(it, anchor) {
  const id = Number(it.userId);
  if (!(id > 0)) return;
  /* 自己那一条也走这里（§10.7 验收 8：点自己的头像直接进个人中心，不弹菜单）。
     `showAvatarMenu` 里第一句就是 `id === pfMyId() ⇒ pfOpenPanel()`。 */
  if (typeof showAvatarMenu === "function") { showAvatarMenu(id, anchor); return; }
  if (id === mpMyId()) return;          // 模块 6 没加载：自己的头像没有入口，也不给自己开私聊窗
  mpChatOpen(id);
}
/* presence 变了只要刷新那几个绿点，不用重拉列表。 */
function mpAnnounceRepaint() {
  if (MP_ANN.els && (MP_ANN.open || MP_ANN.items.length)) mpAnnRender();
}
/* "2 分钟前" 每秒自己走一格：只改那几行字，不重排整个列表（重排会把人滚走）。 */
function mpAnnTimes() {
  const els = MP_ANN.els;
  if (!els || !MP_ANN.open) return;
  for (const sp of els.box.querySelectorAll(".anAgo"))
    if (sp._at) sp.textContent = mpAnnAgo(sp._at);
}
/* 由 mpNetMessage 转进来：返回 true 表示这条我处理过了。 */
function mpAnnMessage(m) {
  switch (m.type) {
    case "announce.list": {
      MP_ANN.loading = false;
      MP_ANN.got = true;
      const list = (Array.isArray(m.items) ? m.items : []).map(mpAnnNorm).filter(Boolean);
      MP_ANN.items = list.slice(0, MP_ANN_KEEP);
      if (MP_ANN.els) mpAnnRender();
      else mpAnnBadge();
      return true;
    }
    case "announce.new": {
      const it = mpAnnNorm(m);
      if (!it) return true;
      if (MP_ANN.pending && m.clientMsgId && m.clientMsgId === MP_ANN.pending.cmid) MP_ANN.pending = null;
      if (MP_ANN.items.some(x => x.id === it.id)) { if (MP_ANN.els) mpAnnRender(); return true; }
      MP_ANN.items.unshift(it);
      MP_ANN.items = MP_ANN.items.slice(0, MP_ANN_KEEP);
      if (MP_ANN.els) mpAnnRender(); else mpAnnBadge();
      if (MP.state === "online") mpNotice("公告 · " + (it.nickname || "") + "：" + [...String(it.content || "")].slice(0, 20).join(""), "", 2600);
      return true;
    }
    case "error": {
      const kind = String(m.code || "");
      if (kind.indexOf("ann_") !== 0) return false;
      if (MP_ANN.pending && m.clientMsgId === MP_ANN.pending.cmid) {
        MP_ANN.pending.state = "fail";
        MP_ANN.cool = 0;                      // 服务端根本没收 ⇒ 冷却不算数
        if (MP_ANN.els) mpAnnRender();
      }
      if (m.msg) mpNotice(m.msg, "warn", 2600);
      return true;
    }
    default: return false;
  }
}
function mpAnnNorm(x) {
  if (!x || typeof x !== "object") return null;
  const id = Number(x.id);
  if (!(id > 0)) return null;
  return { id, userId: Number(x.userId), nickname: String(x.nickname || ""),
           look: x.look && typeof x.look === "object" ? x.look : null,
           content: String(x.content || ""), at: Number(x.at) || 0,
           online: !!x.online, lastSeen: Number(x.lastSeen) || 0 };
}

/* --- 12. 联网事件与生命周期 ------------------------------------------ */
function mpChatBoot() {
  mpChatBind();
  mpAnnEnsureDom();
  mpAnnPlace();
  window.addEventListener("resize", mpAnnPlace);
  /* 断线 / 落单机：窗口和公告栏立刻收走 —— 没有连接就没有收发，留着只会误导。 */
  const tick = () => {
    if (MP.state !== "online") {
      if (MP_CHAT.open) mpChatClose();
      MP_CHAT.hover = -1;
      MP_ONLINE.clear();
      if (MP_ANN.open) mpAnnClose();
      MP_ANN.items = []; MP_ANN.got = false; MP_ANN.loading = false; MP_ANN.pending = null;
    }
    if (MP_ANN.els) {
      /* §7.7：单机模式公告栏整块隐藏；回到在线才露出来，并补拉最新 50 条（§7.6）。 */
      MP_ANN.els.box.classList.toggle("anHide", MP.state !== "online");
      if (MP.state === "online" && !MP_ANN.got && !MP_ANN.loading) {
        MP_ANN.loading = true;
        mpSend({ type: "announce.list", limit: MP_ANN_KEEP });
      }
    }
    mpAnnSendState();
    mpAnnTimes();                                        // "2 分钟前" 要跟着走
    mpAnnPlace();                                        // 画布位置随缩放/室内室外变
  };
  setInterval(tick, 1000);
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mpChatBoot);
else mpChatBoot();
