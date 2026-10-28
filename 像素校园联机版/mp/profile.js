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
      面板就如实说"无法连接服务器"，绝不假装保存成功。 */
function pfToken() {
  try { return typeof mpTicket === "function" ? (mpTicket() || "") : (localStorage.getItem("token") || ""); }
  catch (e) { return ""; }
}
function pfLogged() { return !!pfToken(); }
function pfApi(method, path, body) {
  const tok = pfToken();
  if (!tok) return Promise.reject(new Error("请先登录"));
  const opt = {
    method: method,
    credentials: "same-origin",
    headers: { "Content-Type": "application/json", "Authorization": "Bearer " + tok }
  };
  if (body !== undefined) opt.body = JSON.stringify(body);
  return fetch(path, opt).then(r => r.json().catch(() => null)).then(j => {
    if (!j) throw new Error("无法连接服务器");
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
  <div class="pfHead"><b>个人中心</b><span class="pfSub">修改后需点击保存生效</span><button type="button" class="pfX" title="关闭（Esc）">✕</button></div>
  <div class="pfBody">
    <div class="pfLeft">
      <div class="pfPrev"></div>
      <button type="button" class="pfLook">更换形象 · 上传照片</button>
      <div class="pfStudio" hidden></div>
    </div>
    <div class="pfRight">
      <div class="pfRow"><label>昵称</label><div class="pfFix"><span class="pfNick">…</span><i>注册后不可修改</i></div></div>
      <div class="pfRow"><label>签名</label><div class="pfWrap"><textarea class="pfBio" rows="2" placeholder="请输入个人简介"></textarea><i class="pfCnt">0/40</i></div></div>
      <div class="pfRow"><label>学院</label><select class="pfCollege"></select></div>
      <div class="pfRow"><label>年级</label><select class="pfGrade"></select></div>
      <div class="pfRow"><label>兴趣</label><div class="pfWrap"><div class="pfTags"></div><input class="pfTagIn" placeholder="输入兴趣后回车添加"><i class="pfTagCnt">0/5</i></div></div>
      <div class="pfRow"><label>主页可见</label><div class="pfWrap"><div class="pfPv"></div><i class="pfPvTip">「隐藏」只影响别人点开你主页时看到的内容；地图上的小人、公告与聊天的署名照常可见，那两样藏不住。</i></div></div>
      <div class="pfRow"><label>我的数据</label><div class="pfFix"><span class="pfStats">…</span><button type="button" class="pfHB">点开查询发言记录</button></div></div>
      <div class="pfHist" hidden>
        <div class="pfHTop">
          <button type="button" class="pfHTab" data-tab="ann">我的公告</button>
          <button type="button" class="pfHTab" data-tab="chat">我的私聊</button>
          <span class="pfHHint"></span>
          <button type="button" class="pfHMin">收起</button>
        </div>
        <div class="pfHList"></div>
      </div>
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
    pv: box.querySelector(".pfPv"),
    prev: box.querySelector(".pfPrev"), studio: box.querySelector(".pfStudio"),
    look: box.querySelector(".pfLook"), msg: box.querySelector(".pfMsg"),
    save: box.querySelector(".pfSave"),
    hb: box.querySelector(".pfHB"), hist: box.querySelector(".pfHist"),
    hList: box.querySelector(".pfHList"), hMin: box.querySelector(".pfHMin"),
    hHint: box.querySelector(".pfHHint"), hTabs: box.querySelectorAll(".pfHTab")
  };
  MP_PROF.panel = box;
  MP_PROF.pfEls = els;

  box.querySelector(".pfX").addEventListener("click", pfClosePanel);
  box.querySelector(".pfCancel").addEventListener("click", pfClosePanel);
  box.querySelector(".pfMask").addEventListener("click", pfClosePanel);
  els.save.addEventListener("click", pfSave);
  els.look.addEventListener("click", () => pfToggleStudio());

  /* 发言记录（§10.3「我的数据」）：点开才查，公告与私聊分两个页签。 */
  els.hb.addEventListener("click", () => pfHistToggle());
  els.hMin.addEventListener("click", () => pfHistToggle(false));
  for (const tb of els.hTabs) tb.addEventListener("click", () => pfHistTab(tb.getAttribute("data-tab")));
  els.hList.addEventListener("click", pfHistClick);

  /* 键盘交接（§7.2.4）：面板开着的时候地图不许接走任何按键。 */
  box.tabIndex = -1;
  pfGrabKeys(box);
  box.addEventListener("keydown", e => {
    if (e.key !== "Escape") return;
    e.preventDefault();
    if (pfHistShown()) { pfHistToggle(false); return; }   // Esc 两段：先收记录，再关面板
    pfClosePanel();
  });

  els.bio.addEventListener("input", () => pfBioCount());
  els.tagIn.addEventListener("keydown", e => {
    if (e.key === "Enter") { e.preventDefault(); pfAddTag(els.tagIn.value); els.tagIn.value = ""; }
  });
  return box;
}

function pfOpenPanel() {
  const box = pfEnsurePanel();
  if (!pfLogged()) {
    pfPanelMsg("当前为单机模式，个人中心需登录后使用", "warn");
    box.hidden = false;
    pfFocusTop(box);
    return;
  }
  box.hidden = false;
  pfFocusTop(box);
  MP_PROF.openAt = Date.now();
  pfReleaseKeys();
  pfPanelMsg("正在读取…", "");
  pfApi("GET", "/api/profile/me").then(data => {
    if (!data) throw new Error("读取失败，请刷新页面后重试");
    MP_PROF.me = data;
    MP_PROF.draft = {
      bio: String(data.bio || ""),
      college: String(data.college || ""),
      grade: String(data.grade || ""),
      tags: (Array.isArray(data.tags) ? data.tags : []).slice(),
      privacy: pfPrivacyOf(data.privacy),
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
  pfHistReset();
  pfReleaseKeys();
  if (typeof mpChatFocus === "function" && typeof MP_CHAT !== "undefined" && MP_CHAT && MP_CHAT.open) mpChatFocus();
}
function pfFillPanel(d) {
  const els = MP_PROF.pfEls;
  els.nick.textContent = d.nickname || "—";
  els.bio.value = MP_PROF.draft.bio;
  if (d.limits && d.limits.bio) els.bio.maxLength = Number(d.limits.bio) || PF_BIO_MAX;
  pfBioCount();
  pfFillSelect(els.college, d.colleges || [], MP_PROF.draft.college, "（学院待选择）");
  pfFillSelect(els.grade, d.grades || [], MP_PROF.draft.grade, "（年级待选择）");
  const st = d.stats || {};
  /* 数据统计**只有自己看得到**（§10.2 / §10.6 红线 3）：这里只有数量，
     旁边那颗「点开查询」查的也是自己名下的那一份（§3.5），他人卡片上没有这一行。 */
  els.stats.textContent = "公告 " + (st.announcements || 0) + " 条 · 私聊 " + (st.chatPeers || 0) + " 人";
  pfRenderTags();
  pfRenderPrivacy();
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
  if (list.indexOf(tag) >= 0) return pfPanelMsg("「" + tag + "」已添加", "warn");
  if (list.length >= PF_TAG_MAX) return pfPanelMsg("兴趣标签最多 " + PF_TAG_MAX + " 个，请先移除一个再添加", "warn");
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
    x.title = "移除";
    x.addEventListener("click", () => { pfTags().splice(i, 1); pfRenderTags(); });
    chip.appendChild(label); chip.appendChild(x);
    host.appendChild(chip);
  });
  MP_PROF.pfEls.tagCnt.textContent = list.length + "/" + PF_TAG_MAX;
  MP_PROF.pfEls.tagCnt.className = "pfTagCnt" + (list.length >= PF_TAG_MAX ? " over" : "");
  MP_PROF.pfEls.tagIn.disabled = list.length >= PF_TAG_MAX;
}

/* --- 主页可见性（用户："新增公开和隐藏，自定义调节别人能看到什么"） -----
   ⚠️ 真正的裁剪在 8081 的 `card()` 里：隐藏项**连键都不返回**，这里只是把开关画出来、
      把人设的意图存回去。前端不画不等于看不见，所以这份设置不能只留在浏览器里。
   ⚠️ 键名单由服务端 `profile.privacyKeys` 下发（后端只认那几个键）——
      名单之外多出来的键会被 `pfPrivacyOf` 丢掉，避免把任意字段写进库里那列。 */
const PF_PV_LABEL = { bio: "签名", college: "学院", grade: "年级", tags: "兴趣", online: "在线状态" };
function pfPrivacyKeys(d) {
  const fromServer = d && Array.isArray(d.privacyKeys) ? d.privacyKeys : null;
  const list = fromServer || Object.keys(PF_PV_LABEL);
  const out = [];
  for (const key of list) if (PF_PV_LABEL[key] && out.indexOf(key) < 0) out.push(key);
  return out;
}
/** 归一化成 `{bio:true, college:true, …}`：缺省一律按「公开」，与后端 `parsePrivacy` 同一口径。 */
function pfPrivacyOf(raw, keys) {
  const src = (raw && typeof raw === "object") ? raw : {};
  const out = {};
  for (const key of (keys || Object.keys(PF_PV_LABEL))) out[key] = src[key] !== false && src[key] !== 0 && src[key] !== "false";
  return out;
}
function pfRenderPrivacy() {
  const host = MP_PROF.pfEls && MP_PROF.pfEls.pv;
  if (!host || !MP_PROF.draft) return;
  const keys = pfPrivacyKeys(MP_PROF.me);
  MP_PROF.draft.privacy = pfPrivacyOf(MP_PROF.draft.privacy, keys);
  host.textContent = "";
  for (const key of keys) {
    const on = MP_PROF.draft.privacy[key];
    const it = document.createElement("button");
    it.type = "button";
    it.className = "pfPvIt " + (on ? "on" : "off");
    it.dataset.k = key;
    it.setAttribute("aria-pressed", on ? "true" : "false");
    it.innerHTML = "<b>" + PF_PV_LABEL[key] + "</b><i>" + (on ? "公开" : "隐藏") + "</i>";
    it.title = on ? "别人点开你的主页能看到这一项，点击改为隐藏" : "别人点开你的主页看不到这一项，点击改为公开";
    it.addEventListener("click", () => {
      MP_PROF.draft.privacy[key] = !MP_PROF.draft.privacy[key];
      pfRenderPrivacy();
    });
    host.appendChild(it);
  }
}

/* --- 形象：默认只露四向预览，点开才上是模块 3 那间试衣间 --------------- */
function pfDrawPrev(look) {
  const host = MP_PROF.pfEls.prev;
  host.textContent = "";
  if (typeof charSpriteOf !== "function" || typeof mkCanvas !== "function") {
    const tip = document.createElement("i");
    tip.textContent = "形象组件未加载，请刷新页面后重试";
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
      tip.textContent = "形象组件未加载，请刷新页面后重试";
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
  MP_PROF.pfEls.look.textContent = show ? "收起形象编辑" : "更换形象 · 上传照片";
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
    privacy: MP_PROF.draft.privacy || undefined,
    look: MP_PROF.draft.look || undefined
  };
  if (pfCodePoints(body.bio) > PF_BIO_MAX) return pfPanelMsg("签名最多 " + PF_BIO_MAX + " 字", "warn");
  MP_PROF.saving = true;
  MP_PROF.pfEls.save.disabled = true;
  pfPanelMsg("正在保存…", "");
  pfApi("PUT", "/api/profile/me", body).then(data => {
    MP_PROF.me = data;
    pfFillPanel(data);
    pfPanelMsg("保存成功", "ok");
    if (typeof mpNotice === "function") mpNotice("个人主页已保存", "ok", 2200);
  }).catch(e => pfPanelMsg(e.message, "crit")).then(() => {
    MP_PROF.saving = false;
    MP_PROF.pfEls.save.disabled = false;
  });
}

/* --- 3.5 自己的发言记录（§10.3「我的数据」点开查询）--------------------
   两个页签：**公告**与**私聊**分开列；私聊先列"我和谁聊过"，点开某个人才展开
   和他那一段 —— 就是"分私聊对象查看"。
   ⚠️ 数据走 8090 网关的 `mine.history`（§6.1 冻结表没有这一类，和 `chat.read` 一样
      是最小扩展）：8081 的 `/api/profile/card/{id}` 根本不返回消息内容，所以
      「其他人查看主页不可看到聊天记录」（§10.6 红线 3）在服务端就成立，
      不是靠这里不渲染。三条 SQL 的用户条件全部绑死连接自己的 `userId`，
      `withUser` 只决定"我和他"那一段，换谁的号都查不出第三个人的话。
   ⚠️ 公告全服只留最新 50 条（`announce.post` 里那条修剪），"所有历史"的上限
      就是库里还留着的那些 —— 页签上如实写一句，不假装能翻到无穷远。 */
const PF_H_PAGE = 30;
function pfHistState() {
  if (!MP_PROF.hist) MP_PROF.hist = {
    open: false, tab: "ann",
    ann: { list: [], hasMore: false, oldest: 0, loading: false, loaded: false },
    peers: { list: [], loading: false, loaded: false },
    thread: Object.create(null)                 // withUser -> {list, hasMore, oldest, loading, open}
  };
  return MP_PROF.hist;
}
function pfHistShown() { return !!(MP_PROF.hist && MP_PROF.hist.open && MP_PROF.panel && !MP_PROF.panel.hidden); }
function pfHistReset() { MP_PROF.hist = null; const els = MP_PROF.pfEls; if (els) { els.hist.hidden = true; els.hb.textContent = "点开查询发言记录"; } }
function pfWsReady() { return typeof MP !== "undefined" && !!MP && MP.state === "online" && typeof mpSend === "function"; }
function pfHistReq(q) {
  if (!pfWsReady()) return false;
  try { mpSend(Object.assign({ type: "mine.history" }, q)); return true; } catch (e) { return false; }
}
function pfHistToggle(force) {
  const els = MP_PROF.pfEls; if (!els) return;
  const st = pfHistState();
  st.open = (typeof force === "boolean") ? force : !st.open;
  els.hist.hidden = !st.open;
  els.hb.textContent = st.open ? "收起发言记录" : "点开查询发言记录";
  if (st.open) pfHistTab(st.tab, true); else els.hList.innerHTML = "";
}
function pfHistTab(tab, force) {
  const st = pfHistState(), els = MP_PROF.pfEls;
  if (!els) return;
  st.tab = tab;
  for (const tb of els.hTabs) tb.classList.toggle("on", tb.getAttribute("data-tab") === tab);
  if (tab === "ann") { if (force || !st.ann.loaded) pfHistLoadAnn(); else pfHistPaintAnn(); return; }
  pfHistPaintPeers();
  if (force || !st.peers.loaded) pfHistLoadPeers();
}
function pfHistLoadPeers() {
  const st = pfHistState();
  if (st.peers.loading) return;
  st.peers.loading = true;
  pfHistPaintPeers();
  if (!pfHistReq({ part: "peers" })) { st.peers.loading = false; pfHistPaintPeers(); }
}
function pfHistLoadAnn() {
  const st = pfHistState();
  if (st.ann.loading) return;
  st.ann.loading = true;
  pfHistPaintAnn();
  if (!pfHistReq({ part: "ann", limit: PF_H_PAGE })) { st.ann.loading = false; pfHistPaintAnn(); }
}
function pfHistMoreAnn() {
  const st = pfHistState();
  if (st.ann.loading || !st.ann.hasMore || !st.ann.oldest) return;
  st.ann.loading = true;
  pfHistPaintAnn();
  if (!pfHistReq({ part: "ann", limit: PF_H_PAGE, beforeId: st.ann.oldest })) { st.ann.loading = false; pfHistPaintAnn(); }
}
function pfHistThread(id) {
  const st = pfHistState();
  /* 新建的这一段默认是**收起**的：只有点了那行名字才展开并去查。 */
  return st.thread[id] || (st.thread[id] = { list: [], hasMore: false, oldest: 0, loading: false, loaded: false, open: false });
}
function pfHistOpenThread(id) {
  const t = pfHistThread(id);
  if (t.loaded || t.loading) return;
  t.loading = true;
  pfHistReq({ part: "thread", withUser: id, limit: PF_H_PAGE });
}
function pfHistMoreThread(id) {
  const t = pfHistThread(id);
  if (t.loading || !t.hasMore || !t.oldest) return;
  t.loading = true;
  pfHistPaintPeers();
  if (!pfHistReq({ part: "thread", withUser: id, limit: PF_H_PAGE, beforeId: t.oldest })) {
    t.loading = false; pfHistPaintPeers();
  }
}
function pfTime(ms) {
  const d = new Date(Number(ms) || 0);
  const p = n => (n < 10 ? "0" + n : String(n));
  return p(d.getMonth() + 1) + "-" + p(d.getDate()) + " " + p(d.getHours()) + ":" + p(d.getMinutes());
}
function pfHistHint(text) { MP_PROF.pfEls.hHint.textContent = text || ""; }
function pfHistList(html) { MP_PROF.pfEls.hList.innerHTML = html; }
function pfHistPaintAnn() {
  const st = pfHistState(), els = MP_PROF.pfEls;
  if (!pfWsReady()) { pfHistHint(""); pfHistList('<div class="pfHNone">联机没连上（' + ((typeof MP !== "undefined" && MP && MP.state) || "off") + '），发言记录要联机时才查得到。</div>'); return; }
  if (st.ann.loading && !st.ann.list.length) { pfHistHint("正在查…"); pfHistList('<div class="pfHNone">正在查…</div>'); return; }
  const rows = st.ann.list.map(it =>
    '<div class="pfHItem"><span class="pfHTx">' + pfEsc(it.content) + '</span><i class="pfHTime">' + pfTime(it.at) + '</i></div>');
  if (st.ann.hasMore) rows.push('<button type="button" class="pfHMore" data-act="more-ann"' +
    (st.ann.loading ? " disabled" : "") + '>' + (st.ann.loading ? "正在查…" : "查看更早的记录") + "</button>");
  pfHistHint(st.ann.list.length ? "共 " + st.ann.list.length + " 条" : "");
  pfHistList(rows.length ? rows.join("") : '<div class="pfHNone">还没有查到属于你的公告。</div>');
}
function pfHistPaintPeers() {
  const st = pfHistState();
  if (!pfWsReady()) { pfHistHint(""); pfHistList('<div class="pfHNone">联机没连上（' + ((typeof MP !== "undefined" && MP && MP.state) || "off") + '），发言记录要联机时才查得到。</div>'); return; }
  if (st.peers.loading && !st.peers.list.length) { pfHistHint("正在查…"); pfHistList('<div class="pfHNone">正在查…</div>'); return; }
  const rows = st.peers.list.map(p => {
    const t = st.thread[p.withUser];
    const head = '<button type="button" class="pfHPeer" data-act="peer" data-id="' + p.withUser + '">' +
      '<b>' + pfEsc(p.nickname || ("玩家" + p.withUser)) + '</b>' +
      '<i>' + (p.count || 0) + " 条" + (p.lastAt ? " · " + pfTime(p.lastAt) : "") + '</i>' +
      '<em>' + (t && t.open ? "收起" : "展开") + '</em></button>';
    return '<div class="pfHOne">' + head + '<div class="pfHBody"' + (t && t.open ? "" : " hidden") + '>' + pfHistThreadHtml(p, t) + '</div></div>';
  });
  pfHistHint(st.peers.list.length ? "聊过 " + st.peers.list.length + " 个人" : "");
  pfHistList(rows.length ? rows.join("") : '<div class="pfHNone">还没有私聊过任何人。</div>');
}
function pfHistThreadHtml(peer, t) {
  const me = pfMyId();
  if (!t) return '<div class="pfHNone">点上面的名字看这一段。</div>';
  if (t.loading && !t.list.length) return '<div class="pfHNone">正在查…</div>';
  const rows = t.list.map(m =>
    '<div class="pfHMsg ' + (Number(m.from) === Number(me) ? "mine" : "peer") + '">' +
    '<span class="pfHWho">' + (Number(m.from) === Number(me) ? "我说" : pfEsc(peer.nickname || ("玩家" + peer.withUser)) + "说") + '</span>' +
    '<span class="pfHTx">' + pfEsc(m.content) + '</span><i class="pfHTime">' + pfTime(m.at) + '</i></div>');
  if (t.hasMore) rows.push('<button type="button" class="pfHMore" data-act="more-thread" data-id="' +
    peer.withUser + '"' + (t.loading ? " disabled" : "") + ">" +
    (t.loading ? "正在查…" : "查看更早的记录") + "</button>");
  return rows.length ? rows.join("") : '<div class="pfHNone">这一位没有查到记录。</div>';
}
function pfHistClick(e) {
  const btn = e.target && e.target.closest ? e.target.closest("[data-act]") : null;
  if (!btn) return;
  const act = btn.getAttribute("data-act");
  if (act === "more-ann") { e.preventDefault(); pfHistMoreAnn(); return; }
  if (act === "peer") {
    e.preventDefault();
    const id = Number(btn.getAttribute("data-id"));
    const t = pfHistThread(id);
    t.open = !t.open;
    if (t.open) pfHistOpenThread(id);
    pfHistPaintPeers();
    return;
  }
  if (act === "more-thread") { e.preventDefault(); pfHistMoreThread(Number(btn.getAttribute("data-id"))); }
}
/* 网关回执（mp/client.js 的路由兜到这里）。`beforeId` 为 0 ⇒ 这一页是最新的一屏，
   直接整块替换；不为 0 ⇒ 是"更早"，往尾部接。 */
function mpProfMessage(m) {
  if (!m || m.type !== "mine.history") return false;
  const st = MP_PROF.hist;
  if (!st || !st.open) return true;
  const list = Array.isArray(m.list) ? m.list : [];
  if (m.part === "ann") {
    const fresh = !Number(m.beforeId);
    st.ann.loading = false; st.ann.loaded = true;
    st.ann.list = fresh ? list : st.ann.list.concat(list);
    st.ann.hasMore = !!m.hasMore;
    st.ann.oldest = Number(m.oldestId) || (fresh ? 0 : st.ann.oldest);
    pfHistPaintAnn();
    return true;
  }
  if (m.part === "peers") {
    st.peers.loading = false; st.peers.loaded = true;
    st.peers.list = list.map(it => ({
      withUser: Number(it.withUser), nickname: String(it.nickname || ""),
      count: Number(it.count) || 0, lastAt: Number(it.lastAt) || 0, preview: String(it.preview || "")
    }));
    pfHistPaintPeers();
    return true;
  }
  if (m.part === "thread") {
    const id = Number(m.withUser);
    const t = pfHistThread(id);
    const fresh = !Number(m.beforeId);
    t.loading = false; t.loaded = true;
    t.list = fresh ? list : t.list.concat(list);
    t.hasMore = !!m.hasMore;
    t.oldest = Number(m.oldestId) || (fresh ? 0 : t.oldest);
    pfHistPaintPeers();
    return true;
  }
  if (m.part) { pfHistHint("这一类记录没查到"); if (m.part === "ann") { st.ann.loading = false; pfHistPaintAnn(); } }
  return true;
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
  els.meta.className = "cdMeta"; els.bio.className = "cdBio";   // 上一张卡的「未公开」灰字不能留给下一个人
  els.tags.textContent = "";
  els.msg.disabled = false;
  pfCloseMenu();
  pfApi("GET", "/api/profile/card/" + id).then(d => {
    if (!d || d.userId !== id) throw new Error("该玩家不存在或已注销");
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
    els.meta.className = "cdMeta"; els.bio.className = "cdBio";
    els.tags.textContent = "";
    els.msg.disabled = true;
    els.ava.removeAttribute("src");
  });
}
function pfPaintCard(d) {
  const els = MP_PROF.cdEls;
  const hid = pfHiddenSet(d);
  const src = pfAvaSrc(d.look, 48);                 // §10.5：24×24 放大到 48×48，最近邻不糊
  if (src) els.ava.src = src; else els.ava.removeAttribute("src");
  els.nick.textContent = d.nickname || ("玩家" + d.userId);
  els.on.innerHTML = pfOnLine(d);
  const meta = [];
  if (!hid.college && d.college) meta.push(d.college);
  if (!hid.grade && d.grade) meta.push(d.grade);
  if (hid.college || hid.grade) meta.push("（未公开）");
  els.meta.textContent = meta.join(" · ");
  els.meta.hidden = !els.meta.textContent;
  els.meta.className = "cdMeta" + ((hid.college || hid.grade) ? " hide" : "");
  els.bio.textContent = hid.bio ? "（签名未公开）" : (d.bio ? ("「" + d.bio + "」") : "");
  els.bio.className = "cdBio" + (hid.bio ? " hide" : "");
  els.tags.textContent = "";
  if (hid.tags) {
    const none = document.createElement("span");
    none.className = "cdTag hide";
    none.textContent = "兴趣未公开";
    els.tags.appendChild(none);
  }
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
  if (pfHiddenSet(d).online) return '<b class="off">○</b> 在线状态未公开';
  const live = pfOnlineNow(d.userId);
  if (live) return '<b class="on">●</b> 在线';
  const ago = d.lastSeen ? pfAgo(d.lastSeen) : "";
  return '<b class="off">○</b> ' + (ago ? ago + "活跃" : "离线");
}
/* 本人设了「隐藏」的那几项：服务端 `card()` 直接把键删掉，同时给一份 `hidden` 键名清单，
   这儿只负责如实写一句"未公开" —— 原值压根没到浏览器，想显示也显示不出来。 */
function pfHiddenSet(d) {
  const out = {};
  const list = (d && Array.isArray(d.hidden)) ? d.hidden : [];
  for (const key of list) out[String(key)] = true;
  return out;
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
