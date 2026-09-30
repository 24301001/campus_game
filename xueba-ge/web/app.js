/* 学霸哥 · 前端。
 *
 * 刻意做小：没有框架、没有构建步骤，一个 html + 一个 js。组长要的"简单聊天框"，
 * 但**体验上有四件事是认真的**，因为这个产品的可信度全押在它们身上：
 *   1) 流式打字 —— 0.5 秒开始出字，而不是转圈等 8 秒；
 *   2) 角标可点开 —— "基于教材、有出处"必须看得见摸得着；
 *   3) 分步卡片 —— "卡在第几步就讲第几步"的产品化，本角色独有的交互；
 *   4) 检索轨迹透明 —— 走了哪条路、几毫秒、有没有低置信，全部摊给用户看。
 *
 * 低置信时后端直接返回兜底话术，前端不做任何"美化" —— 宁可少答，不能编。
 */
"use strict";

const $ = (id) => document.getElementById(id);
const S = { token: "", user: null, session: "", course: "", refs: [], streaming: false,
            name: "学霸姐", stick: true, mem: null, lastRef: null,
            shot: null, fromPhoto: false, vision: null };
// NL：SSE 分帧的空行、正文换行都用它拼。写转义符迟早被工具链吃掉一次（本项目已经踩过四次）。
const NL = String.fromCharCode(10), NL2 = NL + NL;

/* ---------------- 网络 ---------------- */
async function api(path, opts = {}) {
  const headers = Object.assign({"Content-Type": "application/json"}, opts.headers || {});
  if (S.token) headers["Authorization"] = "Bearer " + S.token;
  const r = await fetch(path, Object.assign({}, opts, {headers}));
  if (r.status === 401) { logout(); throw new Error("登录已过期，请重新登录"); }
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.detail || ("HTTP " + r.status));
  return data;
}
const post = (p, body) => api(p, {method: "POST", body: JSON.stringify(body || {})});

/* ---------------- 登录 ---------------- */
function showGate(msg) {
  $("gate").classList.remove("hidden");
  $("app").classList.add("hidden");
  if (msg !== undefined) $("gateMsg").textContent = msg;
  const last = localStorage.getItem("xbg_nick") || "";
  if (last && !$("nick").value) $("nick").value = last;   // 组长要的"记住用户名"
  $("nick").focus();
}
async function doLogin(mode) {
  const nick = $("nick").value.trim(), pw = $("pw").value;
  if (!nick || !pw) return showGate("昵称和密码都要填");
  $("btnLogin").disabled = true;
  try {
    const r = await post(mode === "reg" ? "/api/register" : "/api/login", {nick, password: pw});
    S.token = r.token; S.user = r.user; S.session = r.session || "";
    localStorage.setItem("xbg_nick", nick);
    localStorage.setItem("xbg_token", S.token);
    await enter();
  } catch (e) {
    showGate(e.message);
  } finally { $("btnLogin").disabled = false; }
}
function logout() {
  S.token = ""; S.user = null; S.session = ""; S.mem = null;
  localStorage.removeItem("xbg_token");
  document.cookie = "xbg_token=; path=/; max-age=0";   // 原生下载认的是 cookie，登出必须一起清
  clearLog();
  showGate();
}

/* ---------------- 进入主界面 ---------------- */
async function enter() {
  $("gate").classList.add("hidden");
  $("app").classList.remove("hidden");
  $("who").textContent = S.user ? S.user.nick : "";
  const b = await api("/api/bootstrap");
  if (b.name) { S.name = b.name; $("dlgName").textContent = b.name; $("face").alt = b.name + " 立绘"; }
  const chips = [["", "全部课程"]].concat((b.courses || []).map(c => [c, c]));
  $("courses").innerHTML = "";
  for (const [val, label] of chips) {
    const el = document.createElement("span");
    el.className = "chip" + (S.course === val ? " on" : "");
    el.textContent = label;
    el.onclick = () => { S.course = val; [...$("courses").children].forEach(x => x.classList.remove("on")); el.classList.add("on"); };
    $("courses").appendChild(el);
  }
  const dot = $("dot");
  dot.className = "dot " + (b.llm.provider === "api" ? "on" : "stub");
  dot.title = "生成层 provider=" + b.llm.provider + (b.llm.model ? " / " + b.llm.model : "");
  /* 拍照按钮的显隐认后端一个字段：provider=stub 时没有眼睛，不该给用户一个点了没反应的相机。 */
  S.vision = b.vision || null;
  const canShot = !!(S.vision && S.vision.available);
  $("btnShot").classList.toggle("hidden", !canShot);
  $("btnShot").title = canShot
    ? "拍照/截图提问：点一下选图，或直接把截图 Ctrl+V 粘进来（识别用 " + S.vision.model + "）"
    : "生成层没接模型，拍照识别用不了";
  $("mode").textContent = (b.llm.provider === "api" ? "" : "生成层=stub（还没有 Key，答案是从检索到的原文里抽的，只用来验链路）");
  $("stat").textContent = `索引 ${b.n_docs} 片 · 分词 ${b.tokenizer} · 向量 ${b.embedding}` +
    (b.vector_docs ? `(${b.vector_docs} 片)` : "(未加载)");
  say("idle"); opts(EXAMPLES);
  await loadSessions();
  await loadMemory();
  // 进来先接上上次那段，而不是永远从白页开始 —— "记忆"要看得见才算有。
  // 后端在 login 时会给一条全新的空会话，所以判据用"最近一条有内容的会话"，不用它。
  const last = $("sessions").querySelector("li[data-id]");
  if (last && last.dataset.id !== S.session) await openSession(last.dataset.id);
  $("q").focus();
}
/* 推荐问题：必须**点了真能引到资料**。原来这六条全是计网/OS/数据结构/数据库的假语料题，
   那四门 2026-09-20 下架后就变成"点一下只会承认没教材"的死按钮。2026-09-21 五本真教材
   入库后换成逐条实测都能命中的（三条课本原文、一条真题、一条复习规划）。
   胶囊上显示的是短标签，点下去发出去的还是原来那句实测能命中的完整问题 ——
   舞台收矮之后只剩下一行的高度，6 条长句子会折到第二行被裁掉。 */
const EXAMPLES = [["洛必达法则的使用条件", "洛必达法则的使用条件是什么"],
  ["矩阵特征值怎么求", "矩阵的特征值和特征向量怎么求"],
  ["E-R 图怎么转关系模式", "E-R 图怎么转成关系模式"],
  ["复习按什么顺序看", "这门课复习应该按什么顺序看？"]]
  .map(([label, q]) => ({label, title: q, run: () => ask(q)}));

/* ---------------- 历史会话 ---------------- */
/* 后端给的是 unix 秒。列表里只显示"今天几点 / 昨天 / MM-DD"，够认得出哪段就行。 */
function relTime(sec) {
  const n = Number(sec || 0);
  if (!n) return "";
  const d = new Date(n * 1000), now = new Date(), p = (x) => String(x).padStart(2, "0");
  if (d.toDateString() === now.toDateString()) return p(d.getHours()) + ":" + p(d.getMinutes());
  if (d.toDateString() === new Date(now.getTime() - 86400000).toDateString()) return "昨天";
  return p(d.getMonth() + 1) + "-" + p(d.getDate());
}
async function loadSessions() {
  const r = await api("/api/sessions");
  const list = r.sessions || [];
  $("sessions").innerHTML = "";
  for (const s of list) {
    const li = document.createElement("li");
    li.className = s.id === S.session ? "on" : "";
    li.dataset.id = s.id;
    li.title = s.title || "（未命名）";
    const t = document.createElement("span");
    t.className = "t"; t.textContent = s.title || "（未命名）";
    const ago = document.createElement("span");
    ago.className = "ago"; ago.textContent = relTime(s.last_at || s.created_at);
    const more = document.createElement("button");
    more.type = "button"; more.className = "more"; more.textContent = "⋯";
    more.title = "这条历史的操作";
    more.onclick = (e) => { e.stopPropagation(); openItemMenu(more, s.id, t.textContent); };
    li.onclick = () => openSession(s.id);
    li.append(t, ago, more);
    $("sessions").appendChild(li);
  }
  if (!list.length) {                                 // 空列表也给句话，别是一片空白
    const li = document.createElement("li");
    li.className = "none"; li.textContent = "还没有历史，问过之后会列在这里";
    $("sessions").appendChild(li);
  }
  $("sessN").textContent = list.length ? "(" + list.length + ")" : "";
}
/* ---------------- 删除这条历史（DeepSeek 那套两步走） ----------------
   ⋯ → 小菜单「删除会话」→ 居中确认框 → 才真删。没有回收站，删了就真没了，
   所以宁可多点一下，也别让人一滑就把自己半小时的问答抹掉。 */
function openItemMenu(btn, sid, title) {
  const menu = $("itemMenu");
  const wasOpen = !menu.classList.contains("hidden") && menu.dataset.sid === sid;
  closeItemMenu();
  if (wasOpen) return;                     // 再点一次 ⋯ 就是收起
  menu.classList.remove("hidden");
  menu.dataset.sid = sid;
  menu.dataset.title = title || "这段对话";
  const r = btn.getBoundingClientRect(), mw = menu.offsetWidth, mh = menu.offsetHeight;
  let x = r.left - mw - 6;                 // 侧栏右边只有 250px，菜单贴到条目左侧
  if (x < 8) x = r.right + 6;
  let y = Math.min(r.top - 4, innerHeight - mh - 10);
  menu.style.left = Math.max(8, x) + "px";
  menu.style.top = Math.max(8, y) + "px";
  btn.parentElement.classList.add("menu-open");
}
function closeItemMenu() {
  $("itemMenu").classList.add("hidden");
  [...document.querySelectorAll("#sessions li.menu-open")].forEach(x => x.classList.remove("menu-open"));
}
function askDelete(sid, title) {
  $("mdBody").textContent = "「" + title + "」连同里面的消息一起清掉，找不回来了。";
  $("mask").classList.remove("hidden");
  $("mdYes").focus();
}
async function delSession(sid) {
  if (S.streaming) { say("wait"); return; }
  closeItemMenu();
  try {
    await api("/api/session/" + encodeURIComponent(sid), {method: "DELETE"});
    if (sid === S.session) await newChat();
  } catch (e) {
    $("mode").textContent = "删除失败：" + e.message;
  }
  loadSessions();
}
/* 白页只在本地开：会话 id 留空，等第一个问题发出去时后端再建，
   通过 SSE 的 session 事件回填（send 里那条）。原来在这里调
   /api/session/new，等于每点一次"＋新对话"、每删一次当前会话，
   库里就多一条 0 消息的"（未命名）"空壳 —— 列表越点越长，
   删掉一条又立刻补一条，看着就像删除没生效。 */
async function newChat() {
  if (S.streaming) { say("wait"); return; }
  S.session = ""; S.refs = [];
  clearLog(); $("empty").classList.remove("hidden");
  $("dlgTag").textContent = ""; setStat("", "");
  clearShot(); S.fromPhoto = false;      // 图片条跟着会话走；输入框里的草稿字不动（原有行为）
  say("idle"); opts(EXAMPLES);
  await loadSessions();
}
/* ---------------- 记忆卡片 ---------------- */
/* 这块是"跨会话画像"的可见面：用户能读到自己被记下了什么，也能一键停掉。
   看不见摸不着的记忆等于没做同意 —— 尤其这东西最后是要进 prompt 的。 */
async function loadMemory() {
  try { S.mem = await api("/api/memory"); }
  catch (e) { S.mem = null; }              // 拉不到也要把卡片画出来，别留一块空白
  renderMemory();
}
function renderMemory() {
  const m = S.mem || {}, el = $("memory");
  if (!el) return;
  $("memN").textContent = "(" + (m.questions || 0) + " 问)";
  el.classList.toggle("off", !m.memory);
  el.textContent = m.memory || (m.paused
    ? "已按你的要求停止记忆。历史还在，点「重新归纳」随时恢复。"
    : "问过两轮之后自动记下你在学什么、哪儿反复问，开新对话也带着。");
  const btn = $("btnMemClear");
  if (btn) btn.disabled = !m.memory && !m.paused;
}
async function openSession(sid) {
  if (S.streaming) { say("wait"); return; }
  S.session = sid;
  [...$("sessions").children].forEach(x => x.classList.toggle("on", x.dataset.id === sid));
  const r = await api("/api/history?session=" + encodeURIComponent(sid));
  clearLog();
  S.refs = [];
  let tool = "", lastRefs = [], lastNoSrc = false;
  for (const m of r.messages) {
    // 拍照那条：有缩略图就显示图（那段字折在图下面），没存上图的（老会话、或压图失败）退回显示文字
    if (m.role === "user") {
      const body = esc(m.content).split(NL).join("<br>");
      if (m.image && okImg(m.image)) addPhotoMsg(m.image, body);
      else addMsg("me", "你", shotFlag(m.src === "photo") + body);
      continue;
    }
    const node = addMsg("bot", S.name, "");
    const rs = m.refs || [];
    setRefs(rs);
    paint(node, m.content, false);
    /* 历史里的回答和刚写完的回答长一个样：正文 → 出处 → 无出处牌 → 检索轨迹。
       轨迹这次不重放（只有 done 才知道耗时），留个空壳是为了和新消息同一套结构。 */
    const parent = node.parentElement, trace = document.createElement("div");
    trace.className = "trace";
    parent.appendChild(trace);
    const sb = renderSources(rs); if (sb) parent.insertBefore(sb, trace);
    lastNoSrc = !!m.no_source;                     // 牌子和刚答完时同一套判据，不靠"引用为空"反推
    if (lastNoSrc) parent.insertBefore(noSourceBox(), trace);
        if (!trace.childNodes.length) trace.remove();          // 空壳不占行
    if (m.tool) tool = m.tool;
    if (rs.length) lastRefs = rs;
  }
  $("empty").classList.toggle("hidden", !!r.messages.length);
  stickScroll(true);
  if (!r.messages.length) { say("idle"); opts(EXAMPLES); }
  // 刷新之前这里写的是 !lastRefs.length：findPastPapers 那条 refs 结构上就是空（卡片不是引用），
  // 会被当成"凭记忆答"换成 nosrc 那套舞台短句和选项，跟刚答完时两个样。
  else { const noSrc = lastNoSrc; say(noSrc ? "nosrc" : "done"); opts(suggestFor(tool, lastRefs, noSrc)); }
  $("side").classList.remove("open");
}

/* ---------------- 消息渲染 ---------------- */
function esc(s) { return String(s).replace(/[&<>]/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;"}[c])); }

/* ---------------- galgame 舞台 ----------------
   三张立绘就是三种状态：在呢 / 讲题中（眨眼那个）/ 就是这一页（指过去）。
   换脸不是装饰 —— 学生在等首字的那两三秒里，得知道"她在翻书"而不是"页面卡了"。 */
const FACES = {calm: "/static/assets/xbj-calm.jpg", speak: "/static/assets/xbj-wink.jpg",
               point: "/static/assets/xbj-point.jpg"};
const FACE_MAP = {idle: ["calm", "在呢，问吧"], think: ["calm", "翻书…"],
                  speak: ["speak", ""], point: ["point", "就是这一页"], calm: ["calm", ""]};
Object.keys(FACES).forEach(k => { const im = new Image(); im.src = FACES[k]; });   // 预加载，换脸不闪白
let faceNow = "", faceBack = null;

function setFace(kind, holdMs) {
  const map = FACE_MAP[kind] || FACE_MAP.calm;
  const img = FACES[map[0]], el = $("face"), port = el.parentElement, bub = $("fbub");
  faceNow = kind;
  if (el.getAttribute("src") !== img) {
    el.classList.add("fade");
    setTimeout(() => { el.src = img; el.classList.remove("fade"); }, 110);
  }
  port.classList.toggle("talk", kind === "speak");
  bub.textContent = map[1];
  bub.classList.toggle("hidden", !map[1]);
  if (faceBack) { clearTimeout(faceBack); faceBack = null; }
  if (holdMs) faceBack = setTimeout(() => setFace(S.streaming ? "speak" : "calm"), holdMs);
}
function setStat(cls, text) {                  // 状态灯：绿=引了书上的话，红=纯凭模型记忆
  const el = $("dlgStat");
  el.className = "dlg-stat tiny" + (cls ? " " + cls : "");
  el.textContent = text;
}
/* ---------------- 她说的话（短） ----------------
   舞台上只有两种东西：她此刻的状态、下一步可以点什么。答案正文一律在上面 #log 里。
   台词写死成常量，不拼长文本 —— 一拼长就撑破这个固定高度的框，就又变回两个聊天窗口。 */
const LINES = {
  idle: "有什么问题尽管问，我翻书给你找。",
  think: "正在查资料中，稍等我一下…",
  speak: "答案在上面，我一句一句写给你看。",
  nosrc: "这段我手上没有对应的资料，是我凭一般知识说的，别当课本原话。",
  done: "有不理解的点上面的出处，或者继续问我。",
  wait: "等我把这句说完再换，不然这一答就丢掉了。"};
const SAY_FACE = {idle: "idle", think: "think", speak: "speak", nosrc: "calm", done: "calm",
                 wait: "speak"};
function say(kind, text) {
  $("dlgSay").textContent = text || LINES[kind] || LINES.idle;
  setFace(SAY_FACE[kind] || "calm");
}
/** 她递过来的下一步。传空数组就收起这一排。 */
function opts(list) {
  const box = $("dlgOpts");
  box.innerHTML = "";
  for (const o of (list || [])) {
    const btn = document.createElement("button");
    btn.type = "button"; btn.className = "opt";
    btn.textContent = o.label;
    if (o.title) btn.title = o.title;
    btn.onclick = o.run || (() => ask(o.label));   // 没给动作就默认"问这句"
    box.appendChild(btn);
  }
}
/* 递什么选项要看这次真有没有依据：没有资料的时候还写"出两道题考我"就是骗人。 */
function suggestFor(tool, refs, noSource) {
  const out = [];
  if (!noSource && (refs || []).length) {
    const r0 = refs[0];
    out.push({label: "看" + (r0.page ? "第" + r0.page + "页" : "这处") + "原文",
              run: () => openPanel(r0)});
  }
  if (noSource) {
    out.push({label: "你手上有哪些课的资料？"}, {label: "先讲通用思路就好"});
  } else if (tool === "askTextbook") {
    out.push({label: "这节有例题吗"}, {label: "出两道类似的题考我"}, {label: "换个说法再讲一遍"});
  } else if (tool === "explainProblem") {
    out.push({label: "这一步没懂，换个说法"}, {label: "再给一种做法"}, {label: "出道同类题我练练"});
  } else if (tool === "makeStudyPlan") {
    out.push({label: "按周拆一下"}, {label: "时间不够，先补哪一章"}, {label: "每章大概要多久"});
  } else if (tool === "findPastPapers") {
    /* 卡片是"题面 + 哪一页"，不是讲解，所以这里没放"第 1 道不会讲一讲"那种选项——
       题目在 message 正文里只留了 60 字摘要，模型拿它当题面会讲歪。
       每个标签都对着 agent.wants_past_papers() 验过不会被这条规则再截一遍：
       练习/模拟题那几个词命中 _NOT_PAST_PAPER，句子短且不含题卷关键词的走不到 _WANTS_PAPERS。 */
    out.push({label: "这类题的通用解法讲讲"}, {label: "凭记忆出两道练习题"},
             {label: "这题有往年卷吗"});
  } else {
    out.push({label: "再举一个例子"}, {label: "这块考试常怎么出？"});
  }
  for (const o of out) if (!o.run) o.run = () => ask(o.label);
  return out;
}
/* 自动跟随滚动：学生往上翻着看时别再把条拽回底部。 */
function stickScroll(force) {
  const el = $("log");
  if (force || S.stick) el.scrollTop = el.scrollHeight;
}
/** 出处卡片挂在**这条回答**底下（不是舞台上）。SSE 会分几次推，所以整块替换而不是叠加。 */
function drawSources(wrap, refs) {
  const trace = wrap.querySelector(".trace"), old = wrap.querySelector(".srcs");
  if (old) old.remove();
  const box = renderSources(refs);
  if (box) wrap.insertBefore(box, trace);
  return wrap.querySelectorAll(".src").length;
}

/* #empty 现在住在 #log 里面（它属于"消息列表"的一部分，跟着列表一起滚），
   所以清历史不能 innerHTML="" 一把梭，那样会把空状态本身删掉。 */
function clearLog() {
  const log = $("log");
  for (const n of Array.from(log.children)) if (n.id !== "empty") n.remove();
}

function addMsg(cls, who, html) {
  const wrap = document.createElement("div");
  wrap.className = "m " + cls;
  wrap.innerHTML = `<div class="who2">${who}</div><div class="bub">${html}</div>`;
  $("log").appendChild(wrap);
  $("empty").classList.add("hidden");
  stickScroll(true);
  return wrap.querySelector(".bub");
}
function setRefs(refs) { S.refs = refs || []; }

/* 公式：本地 KaTeX（web/vendor/katex，随仓库走，0 公网依赖）。
   认不出的公式**原样显示源码**，不标红也不猜 —— 数学课上把符号显示错，比显示成源码恶劣得多。 */
const MATH = /(\$\$[^$]+\$\$|\$[^$\n]+\$)/;
function unesc(s) {
  return String(s).replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}
function katexRender(src, blk) {
  if (!window.katex) return null;
  let html = null;
  try {
    html = katex.renderToString(unesc(src), {displayMode: !!blk, throwOnError: false,
                                             strict: "ignore", output: "html"});
  } catch (e) { return null; }
  return (html && html.indexOf("katex-error") < 0) ? html : null;
}
function texSpan(seg) {
  const blk = seg.startsWith("$$") && seg.endsWith("$$");
  const src = (blk ? seg.slice(2, -2) : seg.slice(1, -1)).trim();
  const ok = katexRender(src, blk);
  if (ok) return blk ? `<span class="texblk">${ok}</span>` : ok;
  return `<span class="tex${blk ? " blk" : ""}" title="KaTeX 没认出来，原样给你">` + src + "</span>";
}
/** 兜底：把配不了对的孤立 `$` 换成全角 ＄。
 *  KaTeX 一遇到不闭合的 `$` 就整段放弃，后面 `egin{pmatrix}...` 全变成源码
 *  吐在界面上（用户报的「乱码」就是这个）。按 MATH 切完，偶数段是"非数学段"，
 *  里面还留着 `$` 就说明它落单了 —— 换成 ＄ 占位：既不带动后文，也看得出这里本来有定界符。 */
function destray(escaped) {
  return String(escaped).split(MATH)
    .map((seg, i) => (i % 2 ? seg : seg.replace(/\$/g, "＄"))).join("");
}
/** 输入必须是已经 esc() 过的文本。 */
function mathize(escaped) {
  return destray(escaped).split(MATH)
    .map(s => (s.startsWith("$") ? texSpan(s) : s)).join("");
}
function inline(s) {
  return destray(esc(s)).split(MATH).map(seg => {
    if (!seg) return "";
    if (seg.startsWith("$")) return texSpan(seg);
    return seg.replace(/`([^`]+)`/g, "<code>$1</code>")
              .replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>")
              .replace(/\[(\d{1,2})\]/g, (m, n) => citeChip(n));
  }).join("");
}
function citeChip(n) {
  return `<sup class="cit" data-n="${n}" title="点开看原文">[${esc(n)}]</sup>`;
}

/* 出处块：以前只在正文写了 [n] 时才查得到表，模型一旦不写编号，后端推的 5 条出处
   就一个字都看不见（截图里"课本里没有"配 5 条真出处，就是这么来的）。
   现在正文下面固定列一行"这次引了哪几页"，点任意一条开原文。 */
/* 无出处牌：这条回答没有任何可点开的原文。
   它必须**显眼地比有出处的那条差一档**，否则组长会得出"那教材不用喂了"的结论。 */
function noSourceBox() {
  const box = document.createElement("div");
  box.className = "nosrcbox";
  box.innerHTML = `<span class="nosrc">无出处 · AI 记忆</span>` +
    `<span class="nosrc-t">这一段没有引任何教材或真题，是模型凭一般知识讲的；` +
    `不同教材的写法和记号可能不一样，以你们课本为准</span>`;
  return box;
}
function renderSources(refs) {
  const seen = new Set(), rows = [];
  for (const r of refs || []) {
    const key = r.chunk_id || (r.n + "|" + r.book + "|" + r.page);
    if (seen.has(key)) continue;
    seen.add(key); rows.push(r);
  }
  if (!rows.length) return null;
  const box = document.createElement("div");
  box.className = "srcs";
  box.innerHTML = `<span class="srcs-h">引用原文 ${rows.length} 条</span>` + rows.map(r => `
    <button class="src" data-i="${rows.indexOf(r)}">
      <b>${r.n ? "[" + esc(r.n) + "]" : "·"}</b> ${esc(shortBook(r.book))}${r.page ? " 第" + esc(r.page) + "页" : ""}
      <i>${esc(cut(r.section || r.chapter || "", 18))}</i></button>`).join("");
  box.querySelectorAll(".src").forEach(b => b.onclick = () => openPanel(rows[+b.dataset.i]));
  return box;
}
function shortBook(b) {
  return String(b || "").replace(/（非教材原文[^）]*）/, "").replace(/\(第(\d)版\)/, "第$1版").slice(0, 22);
}
function cut(s, n) { s = String(s || ""); return s.length > n ? s.slice(0, n) + "…" : s; }
function paint(node, text, live) {
  const blocks = [];
  const lines = String(text).split("\n");
  let i = 0;
  while (i < lines.length) {
    const L = lines[i];
    const st = lines.slice(i).filter(x => /^###(?!#)\s*/.test(x)).length;
    if (/^###(?!#)\s*/.test(L) && (st >= 2 || blocks.length === 0)) {          // 成串的步骤才升卡片
      const cards = [];
      while (i < lines.length) {
        if (/^###(?!#)\s*/.test(lines[i])) {
          const title = lines[i].replace(/^###(?!#)\s*/, "").trim();
          const body = [];
          i++;
          while (i < lines.length && !/^###(?!#)\s*/.test(lines[i])) { body.push(lines[i]); i++; }
          cards.push({title, body: body.join("\n").trim()});
        } else { i++; }
      }
      blocks.push(`<div class="steps">${cards.map(c => `
        <div class="step"><h5>${inline(c.title)}</h5><div>${md(c.body)}</div>
        <div class="acts"><button class="ghost act-stuck">这一步没懂</button>
        <button class="ghost act-next">继续</button></div></div>`).join("")}</div>`);
      continue;
    }
    const i0 = i;
    const chunk = [];
    while (i < lines.length && !/^###(?!#)\s*/.test(lines[i])) { chunk.push(lines[i]); i++; }
    blocks.push(md(chunk.join("\n")));
    /* 兜底：流式文本会先出现一个落单的 ###（第二条还没吐出来），这时升卡片会卡住 i 不前进，
       整个 while 就变成无限 push。宁可把这一行当普通文字先渲染，下一帧再重排成卡片。 */
    if (i === i0) { blocks.push(md(lines[i])); i++; }
  }
  node.innerHTML = blocks.join("\n") + (live ? "" : "");
  node.classList.toggle("caret", !!live);
  bindStepActs(node);
  stickScroll();
}
function md(text) {
  const out = [];
  let list = null;
  // 模型爱把公式的引用编号单独写一行（"[3]" 吊在下一行），并回上一句末尾再渲染
  const rows = [];
  for (const raw of String(text).split("\n")) {
    if (/^\s*(\[\d{1,2}\]\s*)+$/.test(raw) && rows.some(x => x.trim())) {
      for (let k = rows.length - 1; k >= 0; k--) {
        if (rows[k].trim()) { rows[k] = rows[k].replace(/\s+$/, "") + " " + raw.trim(); break; }
      }
      continue;
    }
    rows.push(raw);
  }
  for (const raw of rows) {
    const L = raw.trim();
    if (!L) { if (list) { out.push(list === "u" ? "</ul>" : "</ol>"); list = null; } continue; }
    if (/^>\s?/.test(L)) { out.push(`<blockquote>${inline(L.replace(/^>\s?/, ""))}</blockquote>`); continue; }
    if (/^[-·]\s+/.test(L)) { if (list !== "u") { if (list) out.push("</ol>"); out.push("<ul>"); list = "u"; }
      out.push(`<li>${inline(L.replace(/^[-·]\s+/, ""))}</li>`); continue; }
    if (/^\d+[.、)]\s*/.test(L)) { if (list !== "o") { if (list) out.push("</ul>"); out.push("<ol>"); list = "o"; }
      out.push(`<li>${inline(L.replace(/^\d+[.、)]\s*/, ""))}</li>`); continue; }
    if (list) { out.push(list === "u" ? "</ul>" : "</ol>"); list = null; }
    out.push(`<p>${inline(L)}</p>`);
  }
  if (list) out.push(list === "u" ? "</ul>" : "</ol>");
  return out.join("");
}
function bindStepActs(node) {
  node.querySelectorAll(".act-stuck").forEach(b => b.onclick = () => ask("我没懂上面「" +
    (b.closest(".step").querySelector("h5").textContent || "这一步") + "」，请只讲这一步，换个说法再来一遍。"));
  node.querySelectorAll(".act-next").forEach(b => b.onclick = () => ask("这一步我懂了，继续下一步。"));
}

/* 出处面板 */
function citClick(e) {
  const el = e.target.closest(".cit");
  if (!el) return;
  const ref = S.refs.find(r => String(r.n) === el.dataset.n);
  if (!ref) return;
  openPanel(ref);
}
$("log").addEventListener("click", citClick);
/* 「上文 / 下文」两行：只在内容能干净渲染时才显示。
   后端（store._repair_context）已经保证上下文是原文的逐字子串、`$` 成对；
   裁不出干净的一段时字段就是空串 —— 这里整行不显示，不留半行源码。
   嫌啰嗦把 SHOW_CTX 改成 false 就行，别的地方一行不用动。 */
const SHOW_CTX = true;
function ctxHtml(c) {
  if (!SHOW_CTX) return "";
  const bits = [];
  if (c.n_prev) bits.push("上文 …" + mathize(esc(c.n_prev)));
  if (c.n_next) bits.push("下文 …" + mathize(esc(c.n_next)));
  return bits.length ? `<div class="ctx">${bits.join("<br>")}</div>` : "";
}

function closePanel() { $("panel").classList.add("hidden"); }
async function openPanel(ref) {
  if (!ref) return;
  S.lastRef = ref;                     // 头部那颗「出处」按钮 reopen 的就是这条
  setFace("point", 2600);            // 她把你领到那一页上去
  $("panel").classList.remove("hidden");
  $("panelTitle").textContent = ref.n ? "引用原文 [" + ref.n + "]" : "引用原文";
  const body = $("panelBody");
  body.innerHTML = `<div class="ref"><div class="loc">载入中…</div></div>`;
  try {
    const c = await api("/api/chunk?i=" + encodeURIComponent(ref.chunk_id));
    body.innerHTML = `<div class="ref">
      <div class="loc">${ref.n ? "[" + esc(ref.n) + "] " : ""}${esc(ref.course || "")} · ${esc(ref.book || "")}<br>
        ${esc(ref.chapter || "")} ${esc(ref.section || "")} ${ref.page ? "第" + ref.page + "页" : ""}</div>
      <div class="txt">${mathize(esc(c.text || ""))}</div>
      ${ctxHtml(c)}
      <div class="mid">切片 id：${esc(ref.chunk_id)}</div></div>`;
  } catch (err) {
    body.innerHTML = `<div class="ref"><div class="loc">取不到了</div><div class="txt">${esc(err.message)}</div></div>`;
  }
}

/* 同类往年题卡片：答完顺带给一两道同课程、同类问法的真题。
   刻意不写"相似题"：第二条腿还是 hash，能说的是"同一门课考过的同类题"。 */
function renderRelated(items) {
  const box = document.createElement("div");
  box.className = "related";
  box.innerHTML = `<div class="rel-h">同类往年题 · 点开看原卷</div>` + items.map((r, k) => `
    <button class="rel" data-k="${k}">
      <span class="rel-t">${esc(r.section || r.chapter || r.course || "历年真题")}</span>
      <span class="rel-src">${esc(r.book || "")}${r.page ? " 第" + r.page + "页" : ""}</span>
      <span class="rel-q">${esc(r.quote || "")}</span>
    </button>`).join("");
  box.querySelectorAll(".rel").forEach(b => b.onclick = () => openPanel(items[+b.dataset.k]));
  return box;
}/* ---------------- 发送与流式 ---------------- */
function ask(text) { $("q").value = text; send(); }

/* ---------------- 拍照提问 ----------------
   图 → POST /api/vision → 识别出的题目文字 →（默认）**自动发出去**：拍完就是答案，少一次点击。
   图片条上那个「拍完直接问」的勾取消掉，就退回"先落进输入框、我改完数字再发"。四个刻意的选择：
   · **认字的口子没删，只是挪了位置**：这一问带着 📷 标显示在气泡里，题面原样摊在屏幕上，
     数字认错了一眼看得出来，改一句重发就行；要每次都先过一眼，就取消那个勾。
   · **答的是"转写出来的那段字"**，不是把图直接丢给答题那次调用 —— 出处靠这段字去检索（README §2C）。
   · **入库的是缩略图，不是原图**：原图最大 6 MB，一个会话几十条就把历史接口撑死了；前端压到
     最长边 900px／≤160 KB 再发（`thumbOf`），后端 `vision.clean_thumb` 再核一道，不合格就悄悄丢
     —— 丢了那条就退回显示文字，问题照答。正文里存的仍然是识别出来的那段字（重放照样能追问），
     外加一个 message.src="photo" 标记，📷 那个牌子靠它在重开后还挂着；
   · **上限挡两处**：这里挡一道是给"点了才发现太大"的人看的，真判据在服务端 vision.check_size。 */
const SHOT_MAX_MB = 6;
const shotFlag = (on) => (on ? '<span class="shotflag" title="这条是拍照识别出来的，出处靠识别出的那段文字去检索；点「看识别出的文字」核对">📷 拍照识别</span> ' : "");

function shotMeta(msg, bad) {
  $("shotMeta").textContent = msg;
  $("shot").classList.toggle("bad", !!bad);
}

function clearShot() {                   // 只收掉图片条，输入框里的字一个字不动
  S.shot = null;
  $("shot").classList.add("hidden");
  $("shot").classList.remove("bad");
  $("shotImg").removeAttribute("src");
}

function loadShot(file) {
  if (!file) return;
  if (S.streaming) { say("wait"); return; }
  if (!/^image\//.test(file.type || "")) { $("mode").textContent = "这不是图片文件"; return; }
  if (file.size > SHOT_MAX_MB * 1048576) {
    $("mode").textContent = "图片 " + (file.size / 1048576).toFixed(1) + " MB，超过 "
      + SHOT_MAX_MB + " MB —— 只截题目那一块就行";
    return;
  }
  const rd = new FileReader();
  rd.onload = () => {
    $("mode").textContent = "";
    S.shot = {data: String(rd.result), bytes: file.size, text: ""};
    $("shotImg").src = S.shot.data;
    $("shotTitle").textContent = (file.name && file.name !== "blob") ? file.name : "题目图片";
    $("shot").classList.remove("hidden");
    recognize();
  };
  rd.onerror = () => { $("mode").textContent = "这张图本地就没读出来，重截一张试试"; };
  rd.readAsDataURL(file);
}

async function recognize(again) {
  if (!S.shot || S.streaming) return;
  const prev = S.shot.text || "";
  const wasEmpty = !String($("q").value).trim();      // 自动发只认"输入框本来是空的"
  shotMeta("识别中…（约 3 秒）");
  setFace("think");
  try {
    const r = await post("/api/vision", {image: S.shot.data});
    if (!S.shot) return;                 // 中途点了"去掉"就别再往输入框里写字了
    S.shot.text = r.text;
    S.fromPhoto = true;                  // 后端据此在问题尾巴上注一句"可能有识别错字"
    const info = "识别 " + r.text.length + " 字 · " + r.ms + " ms · " + r.model
      + (r.truncated ? " · 太长已截断" : "") + "｜认错了就直接改上面";
    const box = $("q");
    /* 「重认」是把上一次那段**换掉**，不是再叠一遍 —— 题面在输入框里出现两遍，
       发出去就等于把同一道题问两次，还会白白多一倍字数。只对"那段还一模一样"的时候动手：
       用户已经改过字就老老实实追加，绝不覆盖他的修改。 */
    if (again && prev && box.value.endsWith(prev)) {
      box.value = box.value.slice(0, box.value.length - prev.length).replace(/\s+$/, "");
    }
    if (box.value.trim()) { box.value = box.value.replace(/\s+$/, "") + NL2 + r.text; shotMeta("已追加到你写的内容后面 · " + info); }
    else { box.value = r.text; shotMeta(info); }
    autofit();
    if (!S.streaming) setFace("calm");
    box.focus();
    /* 两种情况**不**自动发：① 点「重认」是"我要再看看认成了什么"，不该顺手发出去；
       ② 输入框原本有草稿 —— 那是用户自己写的字，拼上去再替他发是冒犯。 */
    if (!again && wasEmpty && $("shotAuto").checked) send();
  } catch (e) {
    if (S.shot) shotMeta("识别失败：" + e.message, true);
    if (!S.streaming) setFace("idle");
  }
}

/* ---------------- 拍照那条气泡：显示图，不显示识别出来的字 ----------------
   字并没有消失 —— 它折在图下面那行「看识别出的文字」里，因为**出处是靠这段字检索来的**，
   认错了一眼得能核对；但气泡的主体是那张图，学生回头看历史时能认出自己问的是哪道题。
   存进库的是压过的缩略图（不是原图）：原图最大 6 MB，一个会话几十条就把历史接口撑死了。 */
const THUMB_EDGE = 900, THUMB_CAP = 160000;      // THUMB_CAP 要和后端 vision.THUMB_MAX_CHARS 一个数
/* mime 白名单和后端 clean_thumb 一模一样：历史里那串是从数据库读回来的，它要变成 <img src>，
   在这儿再拦一道比事后消毒靠谱。 */
const okImg = (s) => typeof s === "string" && s.length <= THUMB_CAP
  && /^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(s);

function thumbOf(src) {
  return new Promise((resolve) => {
    const im = new Image();
    im.onerror = () => resolve("");
    im.onload = () => {
      const w = im.naturalWidth || 0, h = im.naturalHeight || 0;
      if (!w || !h) { resolve(""); return; }
      const scale = Math.min(1, THUMB_EDGE / Math.max(w, h));
      const cv = document.createElement("canvas");
      cv.width = Math.max(1, Math.round(w * scale));
      cv.height = Math.max(1, Math.round(h * scale));
      const g = cv.getContext("2d");
      if (!g) { resolve(""); return; }
      g.fillStyle = "#fff"; g.fillRect(0, 0, cv.width, cv.height);   // JPEG 没有透明通道
      g.drawImage(im, 0, 0, cv.width, cv.height);
      for (const q of [0.72, 0.6]) {              // 压完还超账就再降一档，再不行干脆不存图
        const out = cv.toDataURL("image/jpeg", q);
        if (out.length <= THUMB_CAP) { resolve(out); return; }
      }
      resolve("");
    };
    im.src = src;
  });
}

function addPhotoMsg(thumb, textHtml) {
  const bub = addMsg("me", "你", shotFlag(true));
  const img = document.createElement("img");
  img.className = "bub-img"; img.alt = "题目图片"; img.title = "点开看大图"; img.src = thumb;
  img.onclick = () => openPic(thumb);
  const tog = document.createElement("button");
  tog.type = "button"; tog.className = "bub-toggle"; tog.textContent = "看识别出的文字 ▸";
  const txt = document.createElement("div");
  txt.className = "bub-txt tiny hidden"; txt.innerHTML = textHtml;
  tog.onclick = () => {
    const shut = txt.classList.toggle("hidden");
    tog.textContent = shut ? "看识别出的文字 ▸" : "收起 ▴";
  };
  bub.appendChild(img); bub.appendChild(tog); bub.appendChild(txt);
  return bub;
}

function openPic(src) { $("picImg").src = src; $("pic").classList.remove("hidden"); }
function closePic() { $("pic").classList.add("hidden"); $("picImg").removeAttribute("src"); }

/* 一条新回答的骨架。顺序固定：谁说的 → 正文 → 引用原文 → 无出处牌 → 同类往年题 → 检索轨迹。
   后四样都是插到 .trace 之前，所以谁先到谁在上面，不用管 SSE 事件的来序。 */
function newAnswer() {
  $("empty").classList.add("hidden");
  const wrap = document.createElement("div");
  wrap.className = "m bot";
  wrap.innerHTML = `<div class="who2"></div><div class="bub caret"></div>`;
  wrap.querySelector(".who2").textContent = S.name;
  $("log").appendChild(wrap);
  stickScroll(true);
  return wrap;
}

async function send() {
  const q = $("q").value.trim();
  if (!q || S.streaming) return;
  const fromImage = S.fromPhoto;         // 这段字是认出来的（用户改过几个字也仍然是认出来的）
  S.fromPhoto = false;
  S.streaming = true;
  /* 缩略图必须在 clearShot() 之前压。压不出来（图太大、浏览器不给画布）就退回老样子
     —— 气泡显示识别文字，问题照样发得出去：图是显示件，不是答案的一部分。 */
  const thumb = fromImage && S.shot ? await thumbOf(S.shot.data) : "";
  $("btnSend").disabled = true;
  $("q").value = ""; autofit();
  clearShot();
  if (thumb) addPhotoMsg(thumb, esc(q).split(NL).join("<br>"));
  else addMsg("me", "你", shotFlag(fromImage) + esc(q).split(NL).join("<br>"));
  S.stick = true;
  setStat("", "");
  say("think"); opts([]);
  const wrap = newAnswer();
  const node = wrap.querySelector(".bub");
  const trace = document.createElement("div");
  trace.className = "trace";
  wrap.appendChild(trace);

  let buf = "", refs = [], related = [], tool = "", dirty = false, noSource = false,
      t0 = performance.now();
  const tick = setInterval(() => {                       // 按帧节流：每来一个字就重排会掉帧
    if (dirty) { dirty = false; paint(node, buf, true); stickScroll(); }
  }, 60);

  try {
    const r = await fetch("/api/chat", {
      method: "POST",
      headers: {"Content-Type": "application/json", "Authorization": "Bearer " + S.token},
      body: JSON.stringify({question: q, session: S.session, course: S.course,
                            from_image: fromImage, image: thumb})
    });
    if (!r.ok) throw new Error("HTTP " + r.status + " " + (await r.text()).slice(0, 120));
    const rd = r.body.getReader(), dec = new TextDecoder("utf-8");
    let acc = "";
    while (true) {
      const {value, done} = await rd.read();
      if (done) break;
      acc += dec.decode(value, {stream: true});
      const parts = acc.split(NL2);
      acc = parts.pop();
      for (const blk of parts) {
        const name = (blk.match(/^event:\s*(.+)$/m) || [])[1];
        const raw = (blk.match(/^data:\s*(.+)$/m) || [])[1];
        if (!name || !raw) continue;
        let d = {}; try { d = JSON.parse(raw); } catch (e) { continue; }
        if (name === "session") { S.session = d.session; }
        else if (name === "citation") { refs.push(d); setRefs(refs); drawSources(wrap, refs); }
        else if (name === "meta") {
          tool = d.tool || "";
          const label = toolCN(tool) + (d.routed_by === "llm" ? "（模型选的工具）" : "");
          wrap.querySelector(".who2").textContent = S.name + (label ? " · " + label : "");
          $("dlgTag").textContent = d.course || "";
        }
        else if (name === "retrieval") {
          // 归一术语：模型把学生的说法换成教材里的规范说法，只有这一步发生才露出来
          const terms = (d.terms || []).length
            ? ` <span class="termpill" title="大模型把你说的说法换成教材里的规范说法再检索了一遍；你的原话一个字没改地一起检索">规范说法 ${esc((d.terms || []).join("、"))}</span>` : "";
          const dropped = (d.dropped_terms || []).length
            ? ` <span class="droppill" title="模型补的说法在这批资料里一次都没出现过，按规矩丢掉——不许拿模型记忆冒充教材">丢 ${esc((d.dropped_terms || []).join("、"))}</span>` : "";
          trace.innerHTML = `<b>检索 ${Number(d.elapsed_ms || 0).toFixed(1)}ms</b> 路径 ${esc((d.paths || []).join("+") || "无")} · ` +
            `词面命中 ${Math.round((d.coverage || 0) * 100)}%<i class="help" title="只算你原话里的词在语料中出现过的比例，补的规范说法不计入，不等于答案就在这几条资料里">?</i> · 候选 ${d.n_candidates}` +
            terms + dropped +
            (d.low_confidence ? ` <span class="warnpill">低置信：${esc((d.reasons || []).join("；"))}</span>` : "");
        }
        else if (name === "token") { if (!buf) say("speak"); buf += d.t; dirty = true; }
        else if (name === "related") { related = d.items || []; }
        else if (name === "done") {
          setRefs(refs);
          noSource = !!d.no_source;
          if (noSource) trace.innerHTML = `<span class="nosrc">无出处 · AI 记忆</span>`;
          else if (d.fallback) trace.innerHTML = `<span class="warnpill">没找到合适资料（${esc(d.fallback)}）</span>`;
        }
        else if (name === "error") { trace.innerHTML += ` <span class="warnpill">${esc(d.message || "出错")}</span>`; }
      }
    }
  } catch (e) {
    buf += (buf ? NL2 : "") + "（出错了：" + e.message + "）";
    dirty = true;
  } finally {
    clearInterval(tick);
    setRefs(refs);
    paint(node, buf, false);
    trace.insertAdjacentHTML("beforeend",
      ` <b>·</b> 回答 ${((performance.now() - t0) / 1000).toFixed(1)}s`);
    const cnt = noSource ? 0 : drawSources(wrap, refs);
    if (noSource) wrap.insertBefore(noSourceBox(), trace);
    setStat(noSource ? "bad" : (cnt ? "ok" : ""), noSource ? "无出处 · 凭记忆" : (cnt ? "有出处" : ""));
    if (related.length) wrap.insertBefore(renderRelated(related), trace);
    stickScroll();
    say(noSource ? "nosrc" : "done");
    opts(suggestFor(tool, refs, noSource));
    S.streaming = false; $("btnSend").disabled = false; $("q").focus();
    loadSessions();
    loadMemory();       // 后台那条归纳线程多半还没跑完，这里先刷一次；下一次刷新就能看到
  }
}
function toolCN(t) { return {askTextbook: "课本问答", explainProblem: "解题辅导", makeStudyPlan: "复习规划", findPastPapers: "找同类真题"}[t] || t; }

function autofit() {
  const el = $("q");
  el.style.height = "auto";
  el.style.height = Math.min(150, el.scrollHeight) + "px";
}

/* ---------------- 绑定 ---------------- */
$("gateForm").onsubmit = (e) => { e.preventDefault(); doLogin("login"); };
$("btnReg").onclick = () => { if (!$("nick").value.trim() || !$("pw").value) return showGate("先填昵称和密码再注册"); doLogin("reg"); };
$("btnOut").onclick = logout;
$("composer").onsubmit = (e) => { e.preventDefault(); send(); };
$("q").addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
});
$("q").addEventListener("input", autofit);
/* 拍照的四个入口：按钮选图 / 粘图 / 拖图 / 两个动作键。粘和拖收在整页上 ——
   学生截完图通常不会先去点输入框。 */
$("btnShot").onclick = () => $("shotFile").click();
$("shotFile").onchange = (e) => { const f = e.target.files && e.target.files[0]; if (f) loadShot(f); e.target.value = ""; };
$("btnShotRetry").onclick = () => recognize(true);
$("btnShotDrop").onclick = () => clearShot();
$("shotAuto").checked = localStorage.getItem("xbg_shot_auto") !== "0";   // 默认拍完直接问
$("shotAuto").onchange = () => localStorage.setItem("xbg_shot_auto", $("shotAuto").checked ? "1" : "0");
document.addEventListener("paste", (e) => {
  const f = [...((((e.clipboardData) || {}).files) || [])].find((x) => /^image\//.test(x.type));
  if (f) { e.preventDefault(); loadShot(f); }
});
["dragover", "drop"].forEach((t) => document.addEventListener(t, (e) => {
  const dt = e.dataTransfer;
  if (!dt || !([...(dt.types || [])].indexOf("Files") >= 0)) return;
  e.preventDefault();
  if (t !== "drop") return;
  const f = [...((dt.files || []))].find((x) => /^image\//.test(x.type));
  if (f) loadShot(f);
}));
$("btnNew").onclick = () => newChat();
$("btnReload").onclick = () => loadSessions();
$("btnMem").onclick = async () => {
  $("btnMem").disabled = true; $("mode").textContent = "正在重新归纳记忆…";
  try { S.mem = await api("/api/memory/refresh", {method: "POST"}); renderMemory(); $("mode").textContent = ""; }
  catch (e) { $("mode").textContent = "归纳失败：" + e.message; }
  finally { $("btnMem").disabled = false; }
};
$("btnMemClear").onclick = async () => {
  try { S.mem = await api("/api/memory", {method: "DELETE"}); renderMemory(); }
  catch (e) { $("mode").textContent = "清空失败：" + e.message; }
};
/* 头部那颗「出处」按钮 2026-09-30 删了（组长：没用到）—— 出处卡入口本来就是正文角标 [n]
   和答案下面那排金色胶囊，点哪个开哪个；顶栏再挂一颗"重开最近一条"是多余的。 */
$("btnClose").onclick = closePanel;
$("panel").addEventListener("click", (e) => { if (e.target === $("panel")) closePanel(); });
$("btnPicClose").onclick = closePic;
$("pic").addEventListener("click", (e) => { if (e.target === $("pic")) closePic(); });
$("btnSide").onclick = () => $("side").classList.toggle("open");
$("miDel").onclick = () => {
  const m = $("itemMenu"), sid = m.dataset.sid;
  closeItemMenu(); askDelete(sid, m.dataset.title);
};
$("mdNo").onclick = () => $("mask").classList.add("hidden");
$("mdYes").onclick = async () => {
  const sid = $("itemMenu").dataset.sid;      // 确认框沿用菜单那条，中途点别处也不会删错
  $("mask").classList.add("hidden");
  await delSession(sid);
};
$("mask").addEventListener("click", (e) => { if (e.target === $("mask")) $("mask").classList.add("hidden"); });
document.addEventListener("click", (e) => {
  if (!e.target.closest("#itemMenu") && !e.target.closest(".more")) closeItemMenu();
});
$("sessions").addEventListener("scroll", closeItemMenu);
window.addEventListener("resize", () => { closeItemMenu(); $("mask").classList.add("hidden"); });
window.addEventListener("resize", closePic);
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (!$("pic").classList.contains("hidden")) { closePic(); return; }        // 看大图优先关
  if (!$("panel").classList.contains("hidden")) { closePanel(); return; }   // 引用卡优先关
  if (!$("mask").classList.contains("hidden")) { $("mask").classList.add("hidden"); return; }
  closeItemMenu();
});

/* 学生在框里往上翻着看前面两句时，流式文本不许再把滚动条拽回底部 ——
   自动跟随只对"本来就贴着底部"的人有意义。 */
$("log").addEventListener("scroll", () => {
  const el = $("log");
  S.stick = el.scrollHeight - el.scrollTop - el.clientHeight < 28;
});
say("idle"); opts(EXAMPLES);

/* ---------------- 启动 ---------------- */
(async function boot() {
  const tok = localStorage.getItem("xbg_token");
  if (tok) {
    S.token = tok;
    try { S.user = await api("/api/me"); return enter(); }
    catch (e) { S.token = ""; }
  }
  showGate();
})();
