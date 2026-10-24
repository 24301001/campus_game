/* =====================================================================
 * 像素校园 · 二期模块 6 —— 个人中心（任务书 §10）
 * ---------------------------------------------------------------
 * 三件事，一个入口：
 *   ① `showAvatarMenu(userId, anchorEl)` —— 微信式头像双选菜单（§10.4）。
 *      mp/chat.js 在公告栏和聊天窗顶部都留了这个钩子，本文件一加载就把它接上。
 *   ② 自己的个人中心（全屏面板，能改）—— §10.3。
 *   ③ 别人的缩略主页（竖版卡片，只读）—— §10.5。
 *
 * ⚠️ 三条口径（都写在任务书里，这里逐条对号）：
 *   · **点地图上的精灵 ≠ 点头像**：精灵直接开聊（那是 mp/chat.js 的事），
 *     头像才弹双选；**点自己的头像不弹菜单**，直接进个人中心（§10.4 那张表）。
 *   · **昵称锁死**：面板里根本没有昵称输入框，`PUT /api/profile/me` 也不读这个键
 *     （§10.3 / §10.7 验收 2）。
 *   · **别人的卡片上没有任何输入控件、没有数据统计、没有四向预览**（§10.2 的"缩略"），
 *     隐私字段更是服务端就没返回（§10.6 红线 2）—— 本文件想显示也显示不出来。
 *
 * 数据全走 8081 的 HTTP（§6.2「个人中心」：低频，点开才拉一次，不占 WebSocket 通道）。
 * 在线状态那份由网关的 `presence` 快照兜（本文件读 mp/chat.js 的 `MP_ONLINE`），
 * 服务端那份 `mp_presence.last_seen` 只用来算"N 分钟前活跃"。
 * =============================================================== */

const MP_PROF = {
  chip: null,          // 地图左上角那颗头像按钮（与右上角公告栏对称）
  menu: null,          // 双选菜单
  panel: null,         // 自己的面板
  card: null,          // 别人的卡片
  me: null,            // GET /api/profile/me 的原文
  draft: null,         // 面板里正在编辑的那份（取消就丢掉）
  openAt: 0,
  chipKey: "",
  saving: false
};

const PF_BIO_MAX = 40, PF_TAG_MAX = 5, PF_TAG_LEN = 6;

/* --- 0. 与 8081 说话 -------------------------------------------------
   ⚠️ 走同源相对路径 `/api/...`：浏览器直开 HTML（file://）时 fetch 必然失败，
      面板就如实说"连不上服务器"，绝不假装保存成功。 */
function pfToken() {
  try { return typeof mpTicket === "function" ? (mpTicket() || "") : (localStorage.getItem("token") || ""); }
  catch (e) { return ""; }
}
function pfLogged() { return !!pfToken(); }
function pfApi(method, path, body) {
  const tok = pfToken();
  if (!tok) return Promise.reject(new Error("先登录"));
  const opt = {
    method: method,
    credentials: "same-origin",
    headers: { "Content-Type": "application/json", "Authorization": "Bearer " + tok }
  };
  if (body !== undefined) opt.body = JSON.stringify(body);
  return fetch(path, opt).then(r => r.json().catch(() => null)).then(j => {
    if (!j) throw new Error("连不上服务器（8081）");
    if (j.code !== 200) throw new Error(j.message || "请求失败");
    return j.data;
  });
}
function pfMyId() {
  if (typeof mpMyId === "function") { const n = mpMyId(); if (n > 0) return n; }
  try { const u = JSON.parse(localStorage.getItem("user") || "null"); return u && u.id ? Number(u.id) : 0; }
  catch (e) { return 0; }
}
function pfEsc(s) {
  return String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[c]));
}
/* 键盘归面板（§7.2.4 同一条规矩）：面板里按键一律不冒泡到 window。 */
function pfGrabKeys(box) {
  const hand = e => e.stopPropagation();
  box.addEventListener("keydown", hand);
  box.addEventListener("keyup", hand);
  box.addEventListener("keypress", hand);
  box.addEventListener("pointerdown", e => e.stopPropagation());
}
function pfReleaseKeys() {
  if (typeof mpChatStopKeys === "function") return mpChatStopKeys();
}
/* 弹窗必须**拿到焦点**，否则那两句「关闭（Esc）」是假的 —— 焦点还留在 body 上时，
   `keydown` 根本走不到容器里。`tabIndex = -1` 只给脚本用，不进 Tab 序列。 */
function pfFocusTop(box) {
  if (!box) return;
  try { if (box.tabIndex < 0) box.tabIndex = -1; box.focus({ preventScroll: true }); } catch (e) {}
}
function pfTyping() {
  if (typeof mpChatTypingElsewhere === "function") return mpChatTypingElsewhere();
  const a = document.activeElement;
  return !!a && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName);
}
/* 头像 → <img> 的 src。look.js 没拷过来时画不出来，退回一个占位色块。 */
function pfAvaSrc(look, size) {
  if (typeof avatarSrcOf !== "function") return "";
  try { return avatarSrcOf(look, size || 24); } catch (e) { return ""; }
}

/* --- 1. 左上角那颗头像按钮（§10.3「与右上角公告栏对称」） -------------- */
function pfEnsureChip() {
  if (MP_PROF.chip) return MP_PROF.chip;
  const btn = document.createElement("button");
  btn.id = "mpMe";
  btn.type = "button";
  btn.title = "个人中心（P）";
  btn.innerHTML = '<img class="meAva" alt=""><i class="meTip">个人中心</i>';
  btn.addEventListener("click", () => {
    /* 点自己的头像**不弹菜单**，直接进个人中心（§10.4）。 */
    pfOpenPanel();
  });
  document.body.appendChild(btn);
  MP_PROF.chip = btn;
  return btn;
}
function pfPaintChip() {
  if (!pfEnsureChip()) return;
  const hidden = !pfLogged();
  MP_PROF.chip.hidden = hidden;
  if (hidden) return;
  const look = (typeof mpMyLook === "function") ? mpMyLook() : null;
  const key = (typeof mpLookKey === "function" && look) ? mpLookKey(look) : String(look);
  if (key === MP_PROF.chipKey) return;
  MP_PROF.chipKey = key;
  const img = MP_PROF.chip.querySelector(".meAva");
  const src = pfAvaSrc(look, 48);
  if (src) img.src = src;
}

/* --- 2. 双选菜单（§10.4） --------------------------------------------
   对外只有这一个名字：mp/chat.js 公告栏头像和聊天窗顶部头像都调它。 */
function pfEnsureMenu() {
  if (MP_PROF.menu) return MP_PROF.menu;
  const box = document.createElement("div");
  box.id = "mpAM";
  box.hidden = true;
  /* ⭐ 恰好两个选项（§10.7 验收 3）：多一个就点不过这条。 */
  box.innerHTML = '<button type="button" class="amIt" data-a="chat">💬 发起对话</button>'
    + '<button type="button" class="amIt" data-a="card">👤 个人主页</button>';
  document.body.appendChild(box);
  box.addEventListener("pointerdown", e => e.stopPropagation());
  box.addEventListener("keydown", e => {
    e.stopPropagation();
    if (e.key === "Escape") { e.preventDefault(); pfCloseMenu(); }
  });
  box.addEventListener("click", e => {
    const it = e.target.closest && e.target.closest(".amIt");
    if (!it) return;
    const id = MP_PROF.menuUserId;
    pfCloseMenu();
    if (!id) return;
    if (it.dataset.a === "chat") { if (typeof mpChatOpen === "function") mpChatOpen(id); }
    else pfOpenCard(id);
  });
  /* 点空白处关（用捕获阶段：地图那一层的监听先收不到，菜单先收得到）。 */
  document.addEventListener("pointerdown", e => {
    const m = MP_PROF.menu;
    if (m && !m.hidden && !m.contains(e.target)) pfCloseMenu();
  }, true);
  window.addEventListener("resize", pfCloseMenu);
  MP_PROF.menu = box;
  return box;
}
function showAvatarMenu(userId, anchorEl) {
  const id = Math.trunc(Number(userId) || 0);
  if (!(id > 0)) return;
  if (id === pfMyId()) { pfOpenPanel(); return; }     // 自己的头像：不弹菜单
  const box = pfEnsureMenu();
  MP_PROF.menuUserId = id;
  box.hidden = false;
  pfPlaceMenu(box, anchorEl);
  const first = box.querySelector(".amIt");
  if (first) { try { first.focus(); } catch (e) {} }
}
/* 弹在头像**正下方**，下面放不下就翻到正上方，左右再夹一次（§10.4 那张表）。 */
function pfPlaceMenu(box, anchorEl) {
  box.style.left = "0px"; box.style.top = "0px";
  const r = anchorEl && anchorEl.getBoundingClientRect ? anchorEl.getBoundingClientRect() : null;
  const mw = box.offsetWidth, mh = box.offsetHeight;
  const W = window.innerWidth, H = window.innerHeight;
  let left, top;
  if (!r || !r.width) { left = (W - mw) / 2; top = (H - mh) / 2; }
  else {
    left = r.left + r.width / 2 - mw / 2;
    top = r.bottom + 6;
    if (top + mh > H - 8) top = r.top - mh - 6;
  }
  left = Math.max(8, Math.min(left, W - mw - 8));
  top = Math.max(8, Math.min(top, H - mh - 8));
  box.style.left = Math.round(left) + "px";
  box.style.top = Math.round(top) + "px";
}
function pfCloseMenu() {
  if (MP_PROF.menu) MP_PROF.menu.hidden = true;
  MP_PROF.menuUserId = 0;
}

/* --- 3. 自己的个人中心（全屏面板，§10.3） ---------------------------- */
const PF_HTML = `
<div class="pfMask"></div>
<div class="pfCard">
  <div class="pfHead"><b>个人中心</b><span class="pfSub">改完点保存才落到服务器</span><button type="button" class="pfX" title="关闭（Esc）">✕</button></div>
  <div class="pfBody">
    <div class="pfLeft">
      <div class="pfPrev"></div>
      <button type="button" class="pfLook">换形象 · 传照片</button>
      <div class="pfStudio" hidden></div>
    </div>
    <div class="pfRight">
      <div class="pfRow"><label>昵称</label><div class="pfFix"><span class="pfNick">…</span><i>🔒 注册名，不可更改</i></div></div>
      <div class="pfRow"><label>签名</label><div class="pfWrap"><textarea class="pfBio" rows="2" placeholder="一句话说给自己听"></textarea><i class="pfCnt">0/40</i></div></div>
      <div class="pfRow"><label>学院</label><select class="pfCollege"></select></div>
      <div class="pfRow"><label>年级</label><select class="pfGrade"></select></div>
      <div class="pfRow"><label>兴趣</label><div class="pfWrap"><div class="pfTags"></div><input class="pfTagIn" placeholder="+ 添加"><i class="pfTagCnt">0/5</i></div></div>
      <div class="pfRow"><label>我的数据</label><div class="pfStats">…</div></div>
    </div>
  </div>
  <div class="pfFoot"><span class="pfMsg"></span><button type="button" class="pfCancel">取消</button><button type="button" class="pfSave">保存</button></div>
</div>`;

function pfEnsurePanel() {
  if (MP_PROF.panel) return MP_PROF.panel;
  const box = document.createElement("div");
  box.id = "mpProf";
  box.hidden = true;
  box.innerHTML = PF_HTML;
  document.body.appendChild(box);
  const els = {
    card: box.querySelector(".pfCard"), nick: box.querySelector(".pfNick"),
    bio: box.querySelector(".pfBio"), cnt: box.querySelector(".pfCnt"),
    college: box.querySelector(".pfCollege"), grade: box.querySelector(".pfGrade"),
    tags: box.querySelector(".pfTags"), tagIn: box.querySelector(".pfTagIn"),
    tagCnt: box.querySelector(".pfTagCnt"), stats: box.querySelector(".pfStats"),
    prev: box.querySelector(".pfPrev"), studio: box.querySelector(".pfStudio"),
    look: box.querySelector(".pfLook"), msg: box.querySelector(".pfMsg"),
    save: box.querySelector(".pfSave")
  };
  MP_PROF.panel = box;
  MP_PROF.pfEls = els;

  box.querySelector(".pfX").addEventListener("click", pfClosePanel);
  box.querySelector(".pfCancel").addEventListener("click", pfClosePanel);
  box.querySelector(".pfMask").addEventListener("click", pfClosePanel);
  els.save.addEventListener("click", pfSave);
  els.look.addEventListener("click", () => pfToggleStudio());

  /* 键盘交接（§7.2.4）：面板开着的时候地图不许接走任何按键。 */
  box.tabIndex = -1;
  pfGrabKeys(box);
  box.addEventListener("keydown", e => { if (e.key === "Escape") { e.preventDefault(); pfClosePanel(); } });

  els.bio.addEventListener("input", () => pfBioCount());
  els.tagIn.addEventListener("keydown", e => {
    if (e.key === "Enter") { e.preventDefault(); pfAddTag(els.tagIn.value); els.tagIn.value = ""; }
  });
  return box;
}

function pfOpenPanel() {
  const box = pfEnsurePanel();
  if (!pfLogged()) {
    pfPanelMsg("单机模式没有个人中心：先登录才能改档案", "warn");
    box.hidden = false;
    pfFocusTop(box);
    return;
  }
  box.hidden = false;
  pfFocusTop(box);
  MP_PROF.openAt = Date.now();
  pfReleaseKeys();
  pfPanelMsg("正在读你的档案…", "");
  pfApi("GET", "/api/profile/me").then(data => {
    if (!data) throw new Error("没读到档案");
    MP_PROF.me = data;
    MP_PROF.draft = {
      bio: String(data.bio || ""),
      college: String(data.college || ""),
      grade: String(data.grade || ""),
      tags: (Array.isArray(data.tags) ? data.tags : []).slice(),
      look: data.look || null
    };
    pfFillPanel(data);
  }).catch(e => pfPanelMsg(e.message, "crit"));
}
function pfClosePanel() {
  if (!MP_PROF.panel) return;
  if (document.activeElement === MP_PROF.panel) MP_PROF.panel.blur();
  MP_PROF.panel.hidden = true;
  MP_PROF.draft = null;
  pfReleaseKeys();
  if (typeof mpChatFocus === "function" && typeof MP_CHAT !== "undefined" && MP_CHAT && MP_CHAT.open) mpChatFocus();
}
function pfFillPanel(d) {
  const els = MP_PROF.pfEls;
  els.nick.textContent = d.nickname || "—";
  els.bio.value = MP_PROF.draft.bio;
  if (d.limits && d.limits.bio) els.bio.maxLength = Number(d.limits.bio) || PF_BIO_MAX;
  pfBioCount();
  pfFillSelect(els.college, d.colleges || [], MP_PROF.draft.college, "（还没选学院）");
  pfFillSelect(els.grade, d.grades || [], MP_PROF.draft.grade, "（还没选年级）");
  const st = d.stats || {};
  /* 数据统计**只有自己看得到**（§10.2 / §10.6 红线 3）：这里只显示数量，不显示任何一条内容。 */
  els.stats.textContent = "公告 " + (st.announcements || 0) + " 条 · 聊过 " + (st.chatPeers || 0) + " 人";
  pfRenderTags();
  pfDrawPrev(MP_PROF.draft.look);
  pfPanelMsg("", "");
}
function pfFillSelect(sel, list, value, placeholder) {
  sel.textContent = "";
  const none = document.createElement("option");
  none.value = ""; none.textContent = placeholder;
  sel.appendChild(none);
  for (const item of list) { const o = document.createElement("option"); o.value = item; o.textContent = item; sel.appendChild(o); }
  sel.value = value || "";
  if (sel.value !== (value || "")) sel.value = "";      // 库里存了个不在名单上的老值 ⇒ 回落"没选"
  sel.onchange = () => {
    if (MP_PROF.draft) MP_PROF.draft[sel === MP_PROF.pfEls.college ? "college" : "grade"] = sel.value;
  };
}
function pfBioCount() {
  const els = MP_PROF.pfEls;
  const n = pfCodePoints(els.bio.value);
  els.cnt.textContent = n + "/" + (els.bio.maxLength > 0 ? els.bio.maxLength : PF_BIO_MAX);
  els.cnt.className = "pfCnt" + (n > PF_BIO_MAX ? " over" : "");
  if (MP_PROF.draft) MP_PROF.draft.bio = els.bio.value.trim();
}
function pfCodePoints(s) {
  let n = 0;
  for (let i = 0; i < s.length; i++) { const c = s.charCodeAt(i); n++; if (c >= 0xd800 && c <= 0xdbff) i++; }
  return n;
}

/* --- 兴趣标签：≤5 个、每个 ≤6 字，重复的并入（§10.3） ----------------- */
function pfTags() { return (MP_PROF.draft && MP_PROF.draft.tags) || []; }
function pfAddTag(raw) {
  const tag = String(raw || "").replace(/[\r\n\t]+/g, " ").trim();
  if (!tag) return;
  if (pfCodePoints(tag) > PF_TAG_LEN) return pfPanelMsg("每个兴趣标签最多 " + PF_TAG_LEN + " 字", "warn");
  const list = pfTags();
  if (list.indexOf(tag) >= 0) return pfPanelMsg("「" + tag + "」已经贴上了", "warn");
  if (list.length >= PF_TAG_MAX) return pfPanelMsg("兴趣标签最多 " + PF_TAG_MAX + " 个，先摘一个再贴", "warn");
  list.push(tag);
  pfRenderTags();
  pfPanelMsg("", "");
}
function pfRenderTags() {
  const host = MP_PROF.pfEls.tags;
  host.textContent = "";
  const list = pfTags();
  list.forEach((tag, i) => {
    const chip = document.createElement("span");
    chip.className = "pfTag";
    const label = document.createElement("b");
    label.textContent = tag;
    const x = document.createElement("i");
    x.textContent = "×";
    x.title = "摘掉";
    x.addEventListener("click", () => { pfTags().splice(i, 1); pfRenderTags(); });
    chip.appendChild(label); chip.appendChild(x);
    host.appendChild(chip);
  });
  MP_PROF.pfEls.tagCnt.textContent = list.length + "/" + PF_TAG_MAX;
  MP_PROF.pfEls.tagCnt.className = "pfTagCnt" + (list.length >= PF_TAG_MAX ? " over" : "");
  MP_PROF.pfEls.tagIn.disabled = list.length >= PF_TAG_MAX;
}

/* --- 形象：默认只露四向预览，点开才上是模块 3 那间试衣间 --------------- */
function pfDrawPrev(look) {
  const host = MP_PROF.pfEls.prev;
  host.textContent = "";
  if (typeof charSpriteOf !== "function" || typeof mkCanvas !== "function") {
    const tip = document.createElement("i");
    tip.textContent = "形象文件没加载（mp/look.js）";
    host.appendChild(tip);
    return;
  }
  const W = (typeof CH_W === "number" ? CH_W : 18), H = (typeof CH_H === "number" ? CH_H : 30);
  for (const dir of ["down", "up", "left", "right"]) {
    const c = mkCanvas(W * 3, H * 3), g = c.getContext("2d");
    g.imageSmoothingEnabled = false;
    g.drawImage(charSpriteOf(look, dir, 0), 0, 0, W * 3, H * 3);
    c.title = dir;
    host.appendChild(c);
  }
  const a = avatarOf(look, 24), ac = mkCanvas(72, 72), ag = ac.getContext("2d");
  ag.imageSmoothingEnabled = false;
  ag.drawImage(a, 0, 0, 72, 72);
  ac.className = "pfAva";
  ac.title = "头像";
  host.appendChild(ac);
}
function pfToggleStudio(force) {
  const host = MP_PROF.pfEls.studio;
  const show = force === true || host.hidden;
  if (show && !host.dataset.built) {
    if (typeof mpLookStudio !== "function") {
      const tip = document.createElement("i");
      tip.textContent = "形象文件没加载（mp/look.js）";
      host.appendChild(tip);
    } else {
      /* 试衣间自己就画四向预览 + 72px 头像，所以打开它的时候把上面那块收起来，
         免得同一张脸出现两遍还各画各的。 */
      host.appendChild(mpLookStudio(MP_PROF.draft && MP_PROF.draft.look, next => {
        if (MP_PROF.draft) { MP_PROF.draft.look = next; pfDrawPrev(next); pfPaintChip(); }
      }));
      host.dataset.built = "1";
    }
  }
  host.hidden = !show;
  MP_PROF.pfEls.prev.hidden = show;
  MP_PROF.pfEls.look.textContent = show ? "收起试衣间" : "换形象 · 传照片";
}

function pfPanelMsg(text, kind) {
  const els = MP_PROF.pfEls;
  if (!els) return;
  els.msg.textContent = text || "";
  els.msg.className = "pfMsg" + (kind ? " " + kind : "");
}

function pfSave() {
  if (!MP_PROF.draft || MP_PROF.saving) return;
  const body = {
    bio: String(MP_PROF.draft.bio || "").trim(),
    college: MP_PROF.pfEls.college.value || "",
    grade: MP_PROF.pfEls.grade.value || "",
    tags: pfTags(),
    look: MP_PROF.draft.look || undefined
  };
  if (pfCodePoints(body.bio) > PF_BIO_MAX) return pfPanelMsg("签名最多 " + PF_BIO_MAX + " 字", "warn");
  MP_PROF.saving = true;
  MP_PROF.pfEls.save.disabled = true;
  pfPanelMsg("保存中…", "");
  pfApi("PUT", "/api/profile/me", body).then(data => {
    MP_PROF.me = data;
    pfFillPanel(data);
    pfPanelMsg("已经存好了", "ok");
    if (typeof mpNotice === "function") mpNotice("个人中心已保存", "ok", 2200);
  }).catch(e => pfPanelMsg(e.message, "crit")).then(() => {
    MP_PROF.saving = false;
    MP_PROF.pfEls.save.disabled = false;
  });
}

/* --- 4. 别人的缩略主页（竖版卡片，只读，§10.5） ----------------------
   ⭐ "缩略"缩的正是那三样：数据统计、四向预览、可编辑入口 —— 一个都没有。 */
const CD_HTML = `
<div class="cdMask"></div>
<div class="cdCard">
  <button type="button" class="cdX" title="关闭（Esc）">✕</button>
  <img class="cdAva" alt="">
  <div class="cdNick"></div>
  <div class="cdOn"></div>
  <div class="cdMeta"></div>
  <div class="cdBio"></div>
  <div class="cdTags"></div>
  <button type="button" class="cdMsg">💬 发消息</button>
</div>`;

function pfEnsureCard() {
  if (MP_PROF.card) return MP_PROF.card;
  const box = document.createElement("div");
  box.id = "mpCard";
  box.hidden = true;
  box.innerHTML = CD_HTML;
  document.body.appendChild(box);
  MP_PROF.card = box;
  MP_PROF.cdEls = {
    card: box.querySelector(".cdCard"), ava: box.querySelector(".cdAva"),
    nick: box.querySelector(".cdNick"), on: box.querySelector(".cdOn"),
    meta: box.querySelector(".cdMeta"), bio: box.querySelector(".cdBio"),
    tags: box.querySelector(".cdTags"), msg: box.querySelector(".cdMsg")
  };
  box.querySelector(".cdX").addEventListener("click", pfCloseCard);
  box.querySelector(".cdMask").addEventListener("click", pfCloseCard);
  box.querySelector(".cdMsg").addEventListener("click", () => {
    const id = MP_PROF.cardUserId;
    pfCloseCard();
    /* 聊天窗已经开着同一个人 ⇒ 只聚焦，不重复开（§10.5 那张表）。 */
    if (id && typeof mpChatOpen === "function") mpChatOpen(id);
  });
  pfGrabKeys(box);
  box.tabIndex = -1;
  box.addEventListener("keydown", e => { if (e.key === "Escape") { e.preventDefault(); pfCloseCard(); } });
  return box;
}
function pfOpenCard(id) {
  id = Math.trunc(Number(id) || 0);
  if (!(id > 0)) return;
  const box = pfEnsureCard();
  MP_PROF.cardUserId = id;
  box.hidden = false;
  pfFocusTop(box);
  const els = MP_PROF.cdEls;
  els.nick.textContent = "…";
  els.on.textContent = ""; els.meta.textContent = ""; els.bio.textContent = "";
  els.tags.textContent = "";
  els.msg.disabled = false;
  pfCloseMenu();
  pfApi("GET", "/api/profile/card/" + id).then(d => {
    if (!d || d.userId !== id) throw new Error("这位玩家不存在或已注销");
    MP_PROF.cardData = d;
    pfPaintCard(d);
    /* 顺手把聊天窗顶部那个名字补上：离线的人不在 `presence` 快照里，网关的会话名单
       只能回"玩家<id>"，而这张卡片是从账号表读的**真昵称**（§7.4 顶部要显示昵称）。
       ⚠️ 只改**已经存在**的会话，不调 `mpChatSession()` 新建 —— 新建会在会话列表里
          冒出一条没说过话的空行。 */
    const s = (typeof MP_CHAT !== "undefined" && MP_CHAT.sessions) ? MP_CHAT.sessions.get(id) : null;
    if (s && d.nickname && (!s.name || /^玩家\d+$/.test(s.name))) {
      s.name = d.nickname;
      if (d.look) s.look = d.look;
      if (MP_CHAT.open && MP_CHAT.with === id && typeof mpChatRender === "function") mpChatRender();
    }
  }).catch(e => {
    els.nick.textContent = e.message;
    els.on.textContent = ""; els.meta.textContent = ""; els.bio.textContent = "";
    els.tags.textContent = "";
    els.msg.disabled = true;
    els.ava.removeAttribute("src");
  });
}
function pfPaintCard(d) {
  const els = MP_PROF.cdEls;
  const src = pfAvaSrc(d.look, 48);                 // §10.5：24×24 放大到 48×48，最近邻不糊
  if (src) els.ava.src = src; else els.ava.removeAttribute("src");
  els.nick.textContent = d.nickname || ("玩家" + d.userId);
  els.on.innerHTML = pfOnLine(d);
  els.meta.textContent = [d.college, d.grade].filter(Boolean).join(" · ");
  els.meta.hidden = !els.meta.textContent;
  els.bio.textContent = d.bio ? ("「" + d.bio + "」") : "";
  els.tags.textContent = "";
  for (const tag of (Array.isArray(d.tags) ? d.tags : [])) {
    const chip = document.createElement("span");
    chip.className = "cdTag";
    chip.textContent = tag;
    els.tags.appendChild(chip);
  }
  /* 注销了 / 还没建档案的人不该被"发消息"送进一个死会话——能不能发交给聊天窗判。 */
  els.msg.disabled = false;
}
/* 在线那颗点：网关的 presence 快照说了才算（它比 8081 那 90 秒窗口新鲜）。 */
function pfOnLine(d) {
  const live = pfOnlineNow(d.userId);
  if (live) return '<b class="on">●</b> 在线';
  const ago = d.lastSeen ? pfAgo(d.lastSeen) : "";
  return '<b class="off">○</b> ' + (ago ? ago + "活跃" : "离线");
}
function pfOnlineNow(id) {
  if (typeof MP_ONLINE !== "undefined" && MP_ONLINE && MP_ONLINE.has(Number(id))) return true;
  return false;
}
function pfAgo(ms) {
  const s = Math.max(0, Math.floor((Date.now() - Number(ms)) / 1000));
  if (s < 60) return "刚刚";
  if (s < 3600) return Math.floor(s / 60) + " 分钟前";
  if (s < 86400) return Math.floor(s / 3600) + " 小时前";
  return Math.floor(s / 86400) + " 天前";
}
function pfCloseCard() {
  if (MP_PROF.card) { if (document.activeElement === MP_PROF.card) MP_PROF.card.blur(); MP_PROF.card.hidden = true; }
  MP_PROF.cardUserId = 0;
  pfReleaseKeys();
}

/* --- 5. 开关与心跳 ---------------------------------------------------
   · `P` 开/关自己的面板（打字的时候让路，§7.2.4）；
   · 1 Hz 一下：没登录就把左上角那颗收起来，形象换了就重画，卡片开着就刷新"N 分钟前"。 */
function pfOnKey(e) {
  if (!e || e.ctrlKey || e.metaKey || e.altKey) return;
  if (e.type !== "keydown") return;
  if (String(e.key).toLowerCase() !== "p") return;
  if (pfTyping()) return;
  if (typeof keys !== "undefined" && keys && (keys.shift || e.shiftKey)) return;
  if (!pfLogged()) return;                            // 单机 / 没登录：一个字节都不碰（§7.7）
  e.preventDefault();
  if (MP_PROF.panel && !MP_PROF.panel.hidden) pfClosePanel();
  else pfOpenPanel();
}
function pfTick() {
  pfPaintChip();
  const d = MP_PROF.cardData;
  if (MP_PROF.card && !MP_PROF.card.hidden && d) {
    const on = MP_PROF.cdEls.on;
    on.innerHTML = pfOnLine(d);
  }
}

function pfBoot() {
  pfEnsureChip();
  pfPaintChip();
  window.addEventListener("keydown", pfOnKey);
  setInterval(pfTick, 1000);
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", pfBoot);
else pfBoot();
