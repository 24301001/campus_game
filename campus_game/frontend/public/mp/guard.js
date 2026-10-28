/* =========================================================
   二期模块 7 改版 —— 老丁（保卫处）的对话搬进地图
   ---------------------------------------------------------
   以前按 C 是开 `#ctrP` 那个 iframe 抽屉，把 laoding/index.html 整套界面塞进去；
   现在**不另开窗、不另开抽屉**：失物登记、找失物、认领、报修、工单进度、门禁、
   我的记录，全部在地图底部那块对话面板里说完（与小北同一位置、同一套按键规矩）。

   ⚠️ 业务口径逐条对齐 `laoding/index.html`（意图分类、四维相似度匹配、证件精确路、
      认领三步闭环、localStorage 键名 `guard_v1_*`）。搬进地图**改的是壳，不是规则**：
      同一句「尾号 1035」在这边和在那边必须得到同一个回答。

   ⚠️ 三处地图依赖，全部**运行时**取（本文件在 chunks 之后加载，加载期取会拿到 undefined）：
        guideResolve(text)  地名 → {spot:{name,ax,ay}}，地图自己的 57 个目的地
        player              位置与速度（呼叫时当寻路终点）
        guideToast(t)       复用地图那一条提示，不另做一块
      任何一个不在 ⇒ 走本文件的兜底，不抛。

   ⚠️ 唯一还要出网的一步是**照片识别**：`/ld/api/vision/recognize`（同源网关 → 8000）。
      服务没起来 / 没配 key ⇒ 当场降级成"你口头补两句特征"，流程照走（§8.3 那条链的写法）。
   ========================================================= */

/* --- 1. 人设与常量 --------------------------------------------------- */
const GD_AGENT = {
  name: "保卫处 · 老丁",
  greeting: "保卫处值班。丢东西、报修，讲。",
  callGreeting: "来了来了，嘛事儿？",
  unknownLine: "这事儿不归保卫处管，你找对应的人问去。",
  claimLine: "来保卫处值班点领——08:00 到 22:00 有人。卡类的得学号姓名都对上才给。",
  refuse: {
    "选课": "选课的事儿找学长，我这块儿管不了。",
    "绩点": "绩点的事儿找学长或者教务处，保卫处管不着这块儿。",
    "食堂评分": "食堂好不好吃找食堂阿姨，我这儿只管丢东西、报修。",
    "考研": "考研的事儿找学长打听去，我帮不上忙。",
    "社团": "社团的事儿找学长，别找我。",
    "校园信息": "这个找向导小北问去，不归值班窗口管。"
  }
};
/* 四维权重与阈值 —— 与独立版 CFG 同一组数（保安.md §五 待定项 1 的结论）。 */
const GD_W = { category: 0.40, place: 0.25, time: 0.15, text: 0.20 };
const GD_TH_MATCH = 0.55, GD_TH_HEDGE = 0.42, GD_TOP = 3;
/* 地点维的衰减常数。独立版是 `exp(-d/150)`，那 150 是**它自己那张虚拟图**的尺度；
   地图这边 1 世界像素 ≈ 0.11 m，同一栋楼两侧的门点就差 200+ px，
   照抄 150 会把「图书馆捡的水杯」和「你说在图书馆丢的」判成不相关。 */
const GD_PLACE_LAMBDA = 900;
const GD_VER = 1;                                   // localStorage 键里的版本号，与独立版同键
const gdKey = k => "guard_v" + GD_VER + "_" + k;
const GD_SEED_VER = "map-3";
const GD_VISION_HINT = "图像识别这会儿用不上（老丁的服务没起来或没配密钥）。" +
                       "不影响登记——你口头补两句特征就行。";

/* --- 2. 数据层：种子 + 本地分片 --------------------------------------
   公共层（失物库 / 工单库）与独立版**同键同结构**，谁先跑谁先落盘；
   种子按地图的 57 个目的地重写过一遍（`place` 必须是图上真有的名字），
   坐标在 `gdSeed()` 里现查 `GDEST` —— 楼挪了位置，失物库跟着挪。 */
const GD_SEED_LOST = [
  { id: "L-1001", category: "校园卡", place: "图书馆",     desc: "蓝色卡套，挂着小熊挂绳", name: "李某某", studentId: "20231234", hoursAgo: 26 },
  { id: "L-1002", category: "校园卡", place: "图书馆",     desc: "黑色卡套，卡面磨损",     name: "王某某", studentId: "20221506", hoursAgo: 70 },
  { id: "L-1003", category: "水杯",   place: "图书馆",     desc: "银色保温杯，杯身有贴纸", hoursAgo: 9 },
  { id: "L-1004", category: "雨伞",   place: "第五教学楼", desc: "黑色长柄伞，弯钩手柄",   hoursAgo: 15 },
  { id: "L-1005", category: "耳机",   place: "第五教学楼", desc: "白色入耳式，单只，带充电盒", hoursAgo: 34 },
  { id: "L-1006", category: "钥匙",   place: "学生1食堂",  desc: "三把一串，挂了个红色钥匙扣", hoursAgo: 20 },
  { id: "L-1007", category: "学生证", place: "学生1食堂",  desc: "深蓝色外壳", name: "张某某", studentId: "20233388", hoursAgo: 44 },
  { id: "L-1008", category: "水杯",   place: "操场",       desc: "透明运动水壶，带蓝色背带", hoursAgo: 6 },
  { id: "L-1009", category: "书包",   place: "逸夫楼",     desc: "灰色双肩包，侧面有网袋", hoursAgo: 52 },
  { id: "L-1010", category: "充电宝", place: "计算机中心", desc: "白色，磨砂外壳，线丢了", hoursAgo: 12 },
  { id: "L-1011", category: "校园卡", place: "九教",       desc: "粉色卡套", name: "陈某某", studentId: "20241035", hoursAgo: 8 },
  { id: "L-1012", category: "眼镜",   place: "天佑会堂",   desc: "黑色半框，带眼镜盒", hoursAgo: 60 },
  { id: "L-1013", category: "身份证", place: "南门",       desc: "", name: "赵某某", studentId: "20230721", hoursAgo: 30 },
  { id: "L-1014", category: "雨伞",   place: "16宿舍楼",   desc: "折叠伞，格子图案", hoursAgo: 18 },
  { id: "L-1015", category: "书",     place: "图书馆",     desc: "高等数学课本，扉页有名字", hoursAgo: 40, status: "returned", returnedTo: "周某某" }
];
const GD_SEED_ORDERS = [
  { id: "W-2301", place: "第二教学楼", problem: "二楼东侧洗手间水龙头漏水", status: "已完成", reporter: "同学甲", hoursAgo: 50 },
  { id: "W-2302", place: "图书馆",     problem: "四层自习区靠窗座位灯管闪烁", status: "处理中", reporter: "同学乙", hoursAgo: 30 },
  { id: "W-2303", place: "学生1食堂",  problem: "三层东侧窗户插销坏了，关不严", status: "已受理", reporter: "同学丙", hoursAgo: 12 },
  { id: "W-2304", place: "16宿舍楼",   problem: "一楼门禁刷卡没反应，门禁坏了", status: "处理中", reporter: "宿舍值班", hoursAgo: 6 }
];

const GD = {
  lost: null, orders: null, ready: false,
  open: false, flow: null, hits: [], busy: false,
  els: null, chip: null, photo: null, seq: 0
};

function gdNow() { return Date.now(); }
function gdPad(n) { return (n < 10 ? "0" : "") + n; }
function gdTime(ts) {
  const d = new Date(ts);
  return gdPad(d.getMonth() + 1) + "-" + gdPad(d.getDate()) + " " + gdPad(d.getHours()) + ":" + gdPad(d.getMinutes());
}
/* 玩家昵称：地图的登录态有就有，没登录（单机回落）就当"同学"。 */
function gdMe() {
  try {
    if (typeof MP_PROF !== "undefined" && MP_PROF.draft && MP_PROF.draft.nickname) return MP_PROF.draft.nickname;
    if (typeof mpMyNickname === "function" && mpMyNickname()) return mpMyNickname();
  } catch (e) { }
  return (typeof player !== "undefined" && player && player.name) ? player.name : "同学";
}
function gdSpotOf(name) {
  if (typeof GDEST === "undefined" || !GDEST) return null;
  for (const d of GDEST) if (d.name === name) return d;
  return null;
}
/* 地名解析：先让地图那份 57 个目的地的表来认（含「五教」「老图」这些俗称），
   表里没有再退回原话登记 —— 老丁不该因为图上没标就不让人报地点。 */
function gdResolvePlace(text) {
  if (typeof guideResolve !== "function") return null;
  try {
    const r = guideResolve(String(text || ""));
    return r && r.spot ? r.spot : null;
  } catch (e) { return null; }
}
function gdSeed() {
  const now = gdNow();
  GD.lost = GD_SEED_LOST.map(e => {
    const o = Object.assign({}, e);
    const s = gdSpotOf(o.place) || gdSpotOf((guideResolve && gdResolvePlace(o.place) || {}).name);
    o.x = s ? s.ax : null; o.y = s ? s.ay : null;
    o.foundTime = now - o.hoursAgo * 3600e3;
    if (o.storageTime == null) o.storageTime = o.foundTime;
    if (!o.status) o.status = "in_storage";
    if (!o.reporter) o.reporter = "巡逻登记";
    o.visibility = "public";
    delete o.hoursAgo;
    return o;
  });
  GD.orders = GD_SEED_ORDERS.map(o => {
    const r = Object.assign({}, o);
    r.time = now - o.hoursAgo * 3600e3;
    r.visibility = "public";
    delete r.hoursAgo;
    return r;
  });
  gdSave();
  try { localStorage.setItem(gdKey("seedver"), GD_SEED_VER); } catch (e) { }
}
function gdLoad() {
  if (GD.ready) return;
  GD.ready = true;
  let lost = null, orders = null, ver = null;
  try {
    ver = localStorage.getItem(gdKey("seedver"));
    lost = JSON.parse(localStorage.getItem(gdKey("lost")) || "null");
    orders = JSON.parse(localStorage.getItem(gdKey("orders")) || "null");
  } catch (e) { lost = null; }
  if (ver !== GD_SEED_VER || !Array.isArray(lost) || !Array.isArray(orders)) { gdSeed(); return; }
  GD.lost = lost; GD.orders = orders;
}
function gdSave() {
  try {
    localStorage.setItem(gdKey("lost"), JSON.stringify(GD.lost));
    localStorage.setItem(gdKey("orders"), JSON.stringify(GD.orders));
  } catch (e) { }
}
function gdItemById(id) { for (const it of GD.lost || []) if (it.id === id) return it; return null; }
function gdAddItem(e) { GD.lost.unshift(e); gdSave(); return e; }
function gdAddOrder(o) { GD.orders.unshift(o); gdSave(); return o; }
function gdMarkReturned(id, to) {
  const it = gdItemById(id); if (!it) return null;
  it.status = "returned"; it.returnedTime = gdNow(); it.returnedTo = to || null;
  gdSave(); return it;
}
/* 私密记忆：只记本人这一份，键按玩家 id 分（§8.6 一对一归属那条规矩）。 */
function gdMemKey() {
  let uid = "anon";
  try { if (typeof mpMyId === "function") uid = String(mpMyId() || "anon"); } catch (e) { }
  return gdKey("player_" + uid);
}
function gdMemPush(desc, importance) {
  let list = [];
  try { list = JSON.parse(localStorage.getItem(gdMemKey()) || "[]"); } catch (e) { }
  list.unshift({ desc: desc, time: gdTime(gdNow()), importance: importance || 3 });
  try { localStorage.setItem(gdMemKey(), JSON.stringify(list.slice(0, 50))); } catch (e) { }
}
function gdMemList() { try { return JSON.parse(localStorage.getItem(gdMemKey()) || "[]"); } catch (e) { return []; } }

/* --- 3. NLU：意图分类 + 槽位抽取（纯规则，零大模型，断网可用）--------- */
const GD_CATS = [
  ["校园卡", ["校园卡", "饭卡", "一卡通", "餐卡", "校牌", "卡片"]],
  ["学生证", ["学生证", "学生卡"]],
  ["身份证", ["身份证"]],
  ["水杯", ["水杯", "保温杯", "杯子", "茶杯", "咖啡杯", "水壶", "保温壶", "杯"]],
  ["钥匙", ["钥匙", "钥匙扣", "钥匙串"]],
  ["耳机", ["耳机", "耳麦", "airpods", "蓝牙耳机"]],
  ["手机", ["手机", "电话"]],
  ["雨伞", ["雨伞", "遮阳伞", "伞"]],
  ["书", ["课本", "教材", "书", "笔记"]],
  ["充电宝", ["充电宝", "移动电源"]],
  ["眼镜", ["眼镜", "近视镜"]],
  ["钱包", ["钱包", "皮夹"]],
  ["书包", ["书包", "双肩包", "背包", "挎包", "手提包", "帆布包"]]
];
const GD_CARD_CATS = ["校园卡", "学生证", "身份证"];
const GD_IS_CARD = c => GD_CARD_CATS.indexOf(c) >= 0;
function gdNormCategory(text) {
  const t = String(text || "").toLowerCase();
  let best = null;
  for (const pair of GD_CATS) for (const a of pair[1])
    if (t.indexOf(a) >= 0 && (!best || a.length > best.len)) best = { cat: pair[0], alias: a, len: a.length };
  return best;
}
const GD_FEATURES = ["红", "橙", "黄", "绿", "蓝", "紫", "黑", "白", "灰", "粉", "金", "银", "透明",
  "贴纸", "卡通", "图案", "带盖", "保温", "不锈钢", "磨砂", "长柄", "折叠", "有线", "无线", "蓝牙",
  "头戴", "入耳", "挂绳", "卡套", "条纹", "格子", "小熊", "磨损", "掉漆", "裂纹", "壳", "套", "绳",
  "链", "单把", "一串", "旧", "新", "弯钩", "胶皮", "粉色", "蓝色", "黑色", "白色", "充电"];
function gdFeatureHits(t) {
  const s = String(t || "").toLowerCase(), out = [];
  for (const w of GD_FEATURES) if (s.indexOf(w) >= 0) out.push(w);
  const en = s.match(/[a-z0-9]+/g) || [];
  for (const w of en) if (w.length >= 2) out.push(w);
  return out;
}
function gdBigrams(t) {
  const s = String(t || "").replace(/[\s，。,.!？?、]/g, ""), out = [];
  for (let i = 0; i + 1 < s.length; i++) { const b = s.slice(i, i + 2); if (out.indexOf(b) < 0) out.push(b); }
  return out;
}
function gdTextScore(qDesc, item) {
  const qf = gdFeatureHits(qDesc);
  const itf = gdFeatureHits((item.desc || "") + " " + (item.category || ""));
  let lex = 0;
  if (qf.length) { let n = 0; for (const w of qf) if (itf.indexOf(w) >= 0) n++; lex = n / qf.length; }
  const qb = gdBigrams(qDesc), ib = gdBigrams((item.desc || "") + (item.category || ""));
  let bg = 0;
  if (qb.length) { let n = 0; for (const b of qb) if (ib.indexOf(b) >= 0) n++; bg = n / qb.length; }
  if (!qf.length && !qb.length) return 0.5;
  return 0.7 * lex + 0.3 * bg;
}
function gdParseWhen(t) {
  const now = gdNow(), s = String(t || "");
  const cn = c => ({ "一": 1, "两": 2, "二": 2, "三": 3, "四": 4, "五": 5, "六": 6, "七": 7, "八": 8, "九": 9, "十": 10 }[c] || parseInt(c, 10));
  const mH = s.match(/(\d+)\s*(个)?小时前/); if (mH) return new Date(now - (+mH[1]) * 3600e3);
  const mN = s.match(/(\d+)\s*天前/);
  const mW = s.match(/([一二三四五六七八九十\d]+)\s*(个)?周前|([一二三四五六七八九十\d]+)\s*星期前/);
  let days = null;
  if (mN) days = +mN[1];
  else if (mW) days = cn(mW[1] || mW[3]) * 7;
  else if (/大前天/.test(s)) days = 3;
  else if (/前天/.test(s)) days = 2;
  else if (/昨天/.test(s)) days = 1;
  else if (/今天/.test(s)) days = 0;
  else if (/刚才|刚刚|现在|立马/.test(s)) return new Date(now - 2 * 3600e3);
  if (days == null) return null;
  const d = new Date(now - days * 86400e3);
  let hh = 12, mm = 0;
  if (/早上|清晨/.test(s)) hh = 8; else if (/上午/.test(s)) hh = 10; else if (/中午/.test(s)) hh = 12;
  else if (/下午/.test(s)) hh = 15; else if (/晚上/.test(s)) hh = 20;
  const mT = s.match(/(\d{1,2})[点:：]\s*(\d{1,2})?分?/);
  if (mT) { hh = +mT[1]; mm = +(mT[2] || 0); if ((/下午|晚上/.test(s)) && hh < 12) hh += 12; }
  d.setHours(hh, mm, 0, 0);
  return d;
}
function gdParseSid(t) { const m = String(t || "").replace(/\s/g, "").match(/\d{8,12}/); return m ? m[0] : null; }
function gdParseName(t) {
  const s = String(t || "");
  const m = s.match(/(?:我叫|我是|姓名[：:]?|名字[：:]?)\s*([\u4e00-\u9fa5]{2,4})/);
  if (m) return m[1];
  const bare = s.replace(/[0-9a-zA-Z是我叫的，,。.\s：:]/g, "");
  return /^[\u4e00-\u9fa5]{2,4}$/.test(bare) ? bare : null;
}
function gdParseTail(t) {
  const m = String(t || "").replace(/\s/g, "").match(/(?:尾号是?|尾数是?|后\d位是?|末\d位是?)(\d{3,6})/);
  return m ? m[1] : null;
}
function gdCardsByTail(tail) {
  return (GD.lost || []).filter(it => it.status === "in_storage" && GD_IS_CARD(it.category) &&
    it.studentId && it.studentId.slice(-tail.length) === tail);
}
/* 意图短路顺序与独立版逐字相同 —— 换序会改判：「我丢的卡被人捡走了吗」
   先撞上「我的…记录」还是先撞上「丢」，答案完全不同。 */
function gdClassify(t) {
  const s = String(t || "");
  if (/(呼叫|叫一(下|声)|老丁|保安).*(过来|来一趟|来一|赶)/.test(s) || /^(呼叫|过来一下)$/.test(s) || s === "呼叫老丁") return "call";
  if (/^(你好|您好|嗨|hi|hello|在吗|在不在)[!！。~\s]*$/i.test(s)) return "greet";
  if (/(我(以前|之前)?(报过|丢过|登记过))|我的(报修|失物|工单|记录)/.test(s)) return "my_records";
  if (/(修好(了)?(吗|没)|维修进度|工单|报的修|处理(了吗|了没|没有)|进度)/.test(s)) return "repair_query";
  if (/(已经修好|修好了|还没修|还在修|修着|不用修)/.test(s)) return "repair_status";
  if (/(报修|坏了|坏掉|漏水|漏电|不亮|失灵|故障|堵了|下水|灯管|水龙头)/.test(s)) return "repair_report";
  if (/(捡到|拾到|拾获|上交|交到保卫处)/.test(s)) return "lost_intake";
  if (/(认领|来拿|来取|是我的|取东西|领东西)/.test(s)) return "claim";
  if (/(丢|不见|找不到|落下|忘在|失物|找东西|帮.*找|有没有人捡)/.test(s)) return "lost_search";
  if (/(门禁|刷卡|门卡|进不去楼|门坏了)/.test(s)) return "door";
  if (/(选课|绩点|挂科|考研|转专业|社团|食堂|好吃|评分|窗口|课程表|老师|上课|教务)/.test(s)) return "refuse";
  if (/(在哪|怎么走|怎么去|地图|位置|路线)/.test(s)) return "ask_way";
  return "unknown";
}

/* --- 4. 四维相似度匹配（保安.md §3.2 的核心算法，原样搬） ------------- */
function gdScoreItem(q, item) {
  const dims = {};
  dims.category = q.category ? (item.category === q.category ? 1 : 0.12) : 0.5;
  if (q.spot && item.x != null) dims.place = Math.exp(-Math.hypot(item.x - q.spot.ax, item.y - q.spot.ay) / GD_PLACE_LAMBDA);
  else if (q.spot) dims.place = (item.place === q.spot.name) ? 1 : 0.35;   // 老数据没坐标，退化成同名判断
  else dims.place = 0.5;
  if (q.when && item.foundTime) dims.time = Math.exp(-Math.abs(item.foundTime - q.when.getTime()) / 30 / 3600e3);
  else dims.time = 0.5;
  dims.text = q.desc ? gdTextScore(q.desc, item) : 0.5;
  return { total: GD_W.category * dims.category + GD_W.place * dims.place +
                  GD_W.time * dims.time + GD_W.text * dims.text, dims: dims };
}
function gdMatch(q) {
  let pool = (GD.lost || []).filter(it => it.status === "in_storage");
  if (q.category) pool = pool.filter(it => it.category === q.category);
  return pool.map(it => ({ it: it, s: gdScoreItem(q, it) }))
             .sort((a, b) => b.s.total - a.s.total).slice(0, GD_TOP);
}
function gdMissing(d) {
  const m = [];
  if (!d.category) m.push({ key: "category", label: "什么东西（水杯、雨伞、钥匙这类）" });
  if (!d.spot) m.push({ key: "place", label: "在哪儿丢的" });
  if (!d.when) m.push({ key: "when", label: "大概什么时候丢的" });
  if ((d.desc || "").trim().length < 4) m.push({ key: "desc", label: "长什么样——颜色、贴纸、牌子说两句" });
  return m;
}

/* --- 5. 照片识别（唯一出网的一步，失败即降级）------------------------ */
function gdShrink(file) {
  return new Promise((res, rej) => {
    const fr = new FileReader();
    fr.onerror = () => rej(new Error("read"));
    fr.onload = () => {
      const img = new Image();
      img.onerror = () => rej(new Error("decode"));
      img.onload = () => {
        const k = Math.min(1, 512 / Math.max(img.width, img.height));
        const c = document.createElement("canvas");
        c.width = Math.max(1, Math.round(img.width * k));
        c.height = Math.max(1, Math.round(img.height * k));
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        res(c.toDataURL("image/jpeg", 0.85));
      };
      img.src = fr.result;
    };
    fr.readAsDataURL(file);
  });
}
function gdVision(dataUrl, kind) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 30000);
  return fetch("/ld/api/vision/recognize", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kind: kind, image: dataUrl }), signal: ctrl.signal
  }).then(r => {
    clearTimeout(timer);
    return r.json().then(j => ({ ok: r.ok, status: r.status, j: j })).catch(() => ({ ok: false, status: r.status, j: {} }));
  }).catch(e => { clearTimeout(timer); throw new Error(String(e && e.message || e)); });
}
function gdVisionItem(d) {
  return [d.category, [d.color, d.brand, d.desc].filter(Boolean).join("，")].filter(Boolean).join("：");
}

/* --- 6. 对话面板 DOM -------------------------------------------------
   ⚠️ 与小北那块**同一个位置、同一套按键规矩**（输入框掐断冒泡、Esc 退出、
      组字期间的回车放行给输入法）。两块不同时开：`gdOpen` 见 `GUIDE.open` 让路。 */
function gdEnsureDom() {
  if (GD.els) return GD.els;
  const box = document.createElement("div");
  box.id = "gdlg";
  box.innerHTML =
    /* 标题栏右侧那颗「退出」是**给玩家看的出口**：抽屉那几家都有「← 返回校园」，
       这块面板要是只靠 Esc 或点空白关，鼠标玩家根本找不到地方按（用户实测提的）。
       ⚠️ 按钮必须 `stopPropagation`：面板本体那条"点空白处关闭"的监听会先收到冒泡。 */
    '<div id="gdlgT"><span>' + GD_AGENT.name + '</span>' +
      '<button id="gdlgX" type="button" title="结束对话（Esc）">退出</button></div>' +
    '<div id="gdlgLog"></div>' +
    '<div id="gdlgQuick"></div>' +
    '<div id="gdlgRow">' +
      '<input id="gdlgIn" type="text" maxlength="48" autocomplete="off" spellcheck="false" ' +
             'placeholder="说什么？例：丢了一张校园卡 / 五教捡到伞 / 报修">' +
      '<button id="gdlgCam" type="button" title="拍照或选一张照片">照片</button>' +
      '<button id="gdlgGo" type="button">说</button>' +
    '</div>' +
    '<input id="gdlgFile" type="file" accept="image/*" style="display:none">';
  document.body.appendChild(box);
  const E = {
    box: box, log: box.querySelector("#gdlgLog"), quick: box.querySelector("#gdlgQuick"),
    in: box.querySelector("#gdlgIn"), go: box.querySelector("#gdlgGo"),
    cam: box.querySelector("#gdlgCam"), file: box.querySelector("#gdlgFile"),
    x: box.querySelector("#gdlgX")
  };
  E.x.addEventListener("click", e => { e.stopPropagation(); gdClose(); });
  E.in.addEventListener("keydown", e => {
    if (e.isComposing || e.keyCode === 229) return;
    if (e.key === "Enter") { e.preventDefault(); e.stopPropagation(); const v = E.in.value; E.in.value = ""; gdSubmit(v); return; }
    if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); gdClose(); return; }
    e.stopPropagation();
  });
  E.go.addEventListener("click", () => { const v = E.in.value; E.in.value = ""; gdSubmit(v); });
  E.cam.addEventListener("click", () => E.file.click());
  E.file.addEventListener("change", () => {
    const f = E.file.files && E.file.files[0];
    E.file.value = "";
    if (!f) return;
    gdShrink(f).then(d => { GD.photo = d; gdSubmit("[照片]"); })
      .catch(() => { gdSay("这张照片打不开——换个角度再拍一张，或者直接用文字说。"); });
  });
  box.addEventListener("click", e => { if (e.target === box) gdClose(); });
  GD.els = E;
  return E;
}
function gdPush(who, text) {
  const E = gdEnsureDom();
  const d = document.createElement("div");
  d.className = "gdLine gd-" + who;
  const b = document.createElement("b");
  b.textContent = who === "me" ? "你：" : "老丁：";
  d.appendChild(b);
  const body = document.createElement("span");
  body.textContent = text;
  d.appendChild(body);
  E.log.appendChild(d);
  while (E.log.childNodes.length > 80) E.log.removeChild(E.log.firstChild);
  E.log.scrollTop = E.log.scrollHeight;
}
function gdSay(t) { gdPush("guard", t); }
function gdNote(t) {
  const E = gdEnsureDom();
  const d = document.createElement("div");
  d.className = "gdNote";
  d.textContent = t;
  E.log.appendChild(d);
  E.log.scrollTop = E.log.scrollHeight;
}
/* 命中卡片：一条一行，带相似度与「认领这条」。这是"在地图里就能把事办完"的关键一步
   —— 光回一句"找到了"没有用，得让人点得到认领。 */
function gdCards(hits, note) {
  const E = gdEnsureDom();
  GD.hits = hits;
  const wrap = document.createElement("div");
  wrap.className = "gdCards";
  if (note) { const n = document.createElement("div"); n.className = "gdNote"; n.textContent = note; wrap.appendChild(n); }
  for (const h of hits) {
    const it = h.it;
    const row = document.createElement("div");
    row.className = "gdCard";
    const txt = document.createElement("span");
    txt.textContent = "【" + it.id + "】" + it.category + " · " + it.place + " · " + gdTime(it.foundTime) +
      (it.desc ? " —— " + it.desc : "") + (it.studentId ? "（登记学号 " + it.studentId + "）" : "") +
      "　匹配 " + Math.round(h.s.total * 100) + "%";
    row.appendChild(txt);
    const b = document.createElement("button");
    b.type = "button"; b.textContent = "认领这条";
    b.addEventListener("click", () => gdStartClaim(it.id));
    row.appendChild(b);
    wrap.appendChild(row);
  }
  E.log.appendChild(wrap);
  E.log.scrollTop = E.log.scrollHeight;
}
function gdQuick(list) {
  const E = gdEnsureDom();
  E.quick.textContent = "";
  for (const it of list) {
    const b = document.createElement("button");
    b.type = "button"; b.textContent = it.label || it;
    b.addEventListener("click", () => gdSubmit(it.value || it.label || it));
    E.quick.appendChild(b);
  }
}
const GD_QUICK_HOME = ["丢东西了", "捡到东西要上交", "来认领东西", "报修", "我的记录"];

/* --- 7. 流程 ----------------------------------------------------------
   `GD.flow = { type, stage, data }`；`gdStep(text)` 是唯一的推进入口。
   与独立版一致：**先喂流程，流程没接住再分类**（「取消」逃生口在流程里）。 */
function gdEndFlow() { GD.flow = null; gdQuick(GD_QUICK_HOME); }
function gdStart(type, data) { GD.flow = { type: type, stage: "enter", data: data || {} }; }

/* 找失物：描述 → 四维匹配；证件类转精确路；尾号直通车 */
function gdFlowSearch(text, photo) {
  const f = GD.flow, d = f.data;
  if (photo) { gdImageSearch(photo, d); return; }
  text = String(text || "").trim();
  if (f.stage === "refine") {
    if (/^(都不是|不是我的|没有我的|算了|不对|没有|没了|没有了|记不清|想不起来|不知道)$/.test(text)) {
      gdSay((d.showedHedge ? "行，这几条都不是的话，那就是还没人捡到。" : "行，先这样。") +
            "我把你说的记下了，有人交到保卫处，一查就能对上你。");
      gdMemPush("寻找" + (d.category || "失物") + "：" + (d.desc || "").slice(0, 30), 3);
      gdEndFlow(); return;
    }
    if (d.showedHedge && /^(是这条|就是这条|对上了|对|是|第一条|第1条|第二|第二条|第2条)$/.test(text)) {
      const pick = GD.hits[0] && GD.hits[0].it;
      gdEndFlow();
      if (pick) gdStartClaim(pick.id);
      else gdSay(GD_AGENT.claimLine);
      return;
    }
    d.showedHedge = false;
  }
  const cat = gdNormCategory(text); if (cat) d.category = cat.cat;
  const sp = gdResolvePlace(text); if (sp) d.spot = sp;
  const wh = gdParseWhen(text); if (wh) d.when = wh;
  if (text && text !== "[照片]") d.desc = (d.desc ? d.desc + " " : "") + text;
  const tail = gdParseTail(text);
  if (tail) {
    d.category = d.category || "校园卡";
    const hits = gdCardsByTail(tail);
    if (hits.length === 1) {
      d.entryId = hits[0].id;
      gdSay("尾号 " + tail + " 对上了——" + hits[0].place + "捡到的" + hits[0].category +
            "，登记学号 " + hits[0].studentId + "。你把卡面上的姓名念一下，学号姓名都对上才能给。");
      f.type = "claim"; f.stage = "verify_name";
      gdQuick(["是我的，姓名见输入框", "都不是"]); return;
    }
    if (hits.length > 1) { gdSay("尾号 " + tail + " 有 " + hits.length + " 张卡对上，你把完整学号报一下。"); return; }
    gdSay("库里没找着尾号 " + tail + " 的卡。有人交来了我第一时间按学号对上你。");
    gdMemPush("丢了" + d.category + "，尾号 " + tail, 6);
    gdEndFlow(); return;
  }
  if (d.category && GD_IS_CARD(d.category)) {
    gdSay("校园卡、学生证这类，不靠「像不像」，只认「是不是你的」。报一下学号——" +
          "或者点「照片」传一张卡面，我认学号精确对。");
    f.type = "card_query"; f.stage = "card_query";
    gdQuick(["不知道学号"]); return;
  }
  if (!d.category && !String(d.desc || "").trim()) { gdSay("好歹说个东西吧——什么东西、在哪儿丢的、啥时候的事，随便先说一样。"); return; }
  gdEvaluate(d);
}
function gdEvaluate(d) {
  const f = GD.flow;
  d.rounds = (d.rounds || 0) + 1;
  const hits = gdMatch({ category: d.category || null, spot: d.spot || null, when: d.when || null, desc: d.desc || "" });
  const best = hits.length ? hits[0].s.total : 0;
  const enriched = !!(d.spot || d.when || gdFeatureHits(d.desc || "").length);
  if (best >= GD_TH_MATCH && enriched) {
    gdCards(hits, "比对下来，最像的是这一条——");
    gdSay(GD_AGENT.claimLine);
    gdMemPush("寻找" + (d.category || "失物") + "：" + (d.desc || "").slice(0, 30), 3);
    gdEndFlow(); return;
  }
  if (d.category && !hits.length) {
    gdSay("库里现在没登记着「" + d.category + "」这类的东西。别急——我把你说的记下来，有人交到保卫处，一查就能对上你。");
    gdMemPush("寻找" + d.category + "：" + (d.desc || "").slice(0, 30), 3);
    gdEndFlow(); return;
  }
  if (hits.length && best >= GD_TH_HEDGE) {
    gdCards(hits, "这几条有点像，但我不敢打包票——");
    d.showedHedge = true; f.stage = "refine";
    const miss = gdMissing(d).map(x => x.label).join("、");
    gdSay("有没有对上的？点「认领这条」我走核对；都不是就回「都不是」，或者再补点" + (miss ? "——" + miss : "特征") + "，我再帮你查。");
    gdQuick(["都不是", "就是第一条"]); return;
  }
  const miss = gdMissing(d).filter(x => !(d.asked && d.asked[x.key]));
  if (miss.length && d.rounds < 4) {
    d.asked = d.asked || {};
    for (const x of miss) d.asked[x.key] = 1;
    f.stage = "refine";
    gdSay((d.rounds > 1 ? "还是不太像。" : (hits.length ? "按你说的查了一轮，不太像。" : "库里暂时没查到像的。")) +
          "先补充一下：" + miss.map(x => x.label).join("、") + "。");
    return;
  }
  gdSay("按你说的查了一遍又一遍——库里没有对得上的。我把你说的记下来，有人交到保卫处，一查就能对上你。");
  gdMemPush("寻找" + (d.category || "失物") + "：" + (d.desc || "").slice(0, 30), 3);
  gdEndFlow();
}
/* 以图搜物：Qwen 看图 → 类别 + 外观描述 → 同一套四维匹配 */
function gdImageSearch(photo, d) {
  gdNote("老丁盯着照片看了看……");
  gdVision(photo, "item").then(r => {
    if (!r.ok) { gdVisionDown(r); return; }
    const dd = (r.j && r.j.data) || {};
    const sum = gdVisionItem(dd);
    if (!sum) { gdSay("照片里没认出具体物品——换个角度再拍一张，或者用文字说说。"); return; }
    gdNote("识别：" + sum);
    if (!d.category) { const nc = gdNormCategory(dd.category || ""); if (nc) d.category = nc.cat; }
    d.desc = (d.desc ? d.desc + "；" : "") + sum;
    gdEvaluate(d);
  }).catch(() => gdVisionDown({ ok: false }));
}
function gdVisionDown(r) {
  gdNote(GD_VISION_HINT);
  if (GD.flow && GD.flow.type === "lost_search") gdEvaluate(GD.flow.data);
  else gdSay("那就用文字说——什么东西、在哪儿丢的、啥时候的事。");
}
/* 证件精确路 */
function gdFlowCardQuery(text, photo) {
  const f = GD.flow, d = f.data;
  if (/^(不知道学号|没有|不知道|忘了|记不清)$/.test(String(text || "").trim())) {
    gdSay("行，没学号就按特征来。再说两句——卡套什么颜色、有没有挂绳之类的。");
    d.category = d.category || "校园卡";
    gdStart("lost_search", { category: d.category, desc: d.desc || "" });
    GD.flow.stage = "refine";
    return;
  }
  let sid = text ? gdParseSid(text) : null;
  if (!sid && text) {
    const tail = gdParseTail(text);
    if (tail) {
      const hits = gdCardsByTail(tail);
      if (hits.length === 1) {
        d.entryId = hits[0].id;
        gdSay("尾号 " + tail + " 对上了——" + hits[0].place + "捡到的" + hits[0].category +
              "，登记学号 " + hits[0].studentId + "。你把卡面上的姓名念一下。");
        f.type = "claim"; f.stage = "verify_name"; return;
      }
      gdSay(hits.length > 1 ? ("尾号 " + tail + " 有 " + hits.length + " 张卡对上，你把完整学号报一下。")
                            : ("库里没找着尾号 " + tail + " 的卡——你报完整学号试试。"));
      return;
    }
  }
  if (!sid && photo) {
    gdNote("正在识别卡面信息……");
    gdVision(photo, "card").then(r => {
      if (!r.ok) { gdNote(GD_VISION_HINT); gdSay("识别用不上，你直接把学号打出来吧。"); return; }
      const o = (r.j && r.j.data) || {};
      if (o.isCard === false) { gdSay("这张看着不是证件——直接把学号打出来吧。"); return; }
      if (!o.studentId) { gdSay("没认准学号，你直接把学号打出来吧。"); return; }
      gdFlowCardQuery(String(o.studentId) + (o.name ? " " + o.name : ""), null);
    }).catch(() => { gdNote(GD_VISION_HINT); gdSay("识别系统这会儿连不上，你直接把学号打出来吧。"); });
    return;
  }
  if (!sid) { gdSay("报一下学号吧——卡面上那一串数字。或者点「照片」传一张卡面。"); return; }
  let e = null;
  for (const it of GD.lost) if (it.status === "in_storage" && it.studentId === sid) { e = it; break; }
  if (!e) {
    gdSay("库里没登记到 " + sid + " 这张卡。建议你先去挂失；有人交到保卫处了，我按学号一查就能对上你。");
    gdMemPush("丢了" + (d.category || "证件") + "，学号 " + sid, 6);
    gdEndFlow(); return;
  }
  d.entryId = e.id;
  gdSay("有了——" + e.place + "那边捡到一张" + e.category + "，登记学号 " + e.studentId +
        "。你把卡面上的姓名念一下，学号姓名都对上了才能领。");
  f.type = "claim"; f.stage = "verify_name";
  gdQuick(["是我的，姓名见输入框"]);
}
/* 捡到东西上交 */
function gdFlowIntake(text, photo) {
  const f = GD.flow, d = f.data;
  if (f.stage === "enter") { f.stage = "desc"; }
  if (f.stage === "desc") {
    if (photo) {
      d.photo = photo;
      gdNote("老丁盯着照片看了看……");
      gdVision(photo, "item").then(r => {
        if (!r.ok) { gdNote(GD_VISION_HINT); gdSay("这张没认准——口头补两句特征也行。什么东西？"); return; }
        const dd = (r.j && r.j.data) || {};
        const nc = dd.category ? gdNormCategory(dd.category) : null;
        if (nc) d.category = nc.cat; else if (dd.category) d.category = dd.category;
        const sum = gdVisionItem(dd);
        if (!d.desc && (dd.desc || sum)) d.desc = dd.desc || sum;
        if (sum) gdNote("识别：" + sum);
        gdAskPlace(d);
      }).catch(() => { gdNote(GD_VISION_HINT); gdSay("这张没认准——口头补两句特征也行。"); });
      return;
    }
    const cat = gdNormCategory(text);
    if (cat) d.category = cat.cat;
    if (GD_IS_CARD(d.category)) {
      gdSay("是证件啊。点「照片」传一张卡面，我给你认学号和姓名入库；不方便传就直接报学号和姓名，比如：20231234，李某某。");
      f.type = "card_intake"; f.stage = "card_manual";
      gdQuick(["不报了，按普通物品登记"]); return;
    }
    d.desc = String(text || "").trim();
    if (d.desc.length < 2) { gdSay("再说两句特征呗——什么颜色、有没有贴纸、啥牌子，随便说两样。"); return; }
    gdAskPlace(d); return;
  }
  if (f.stage === "place") {
    const sp = gdResolvePlace(text);
    d.place = sp ? sp.name : String(text || "").trim();
    if (!d.place) { gdSay("说个地名——教学楼、食堂、图书馆、操场这些就行。"); return; }
    gdSay("什么时候捡到的？回「现在」或具体时间，比如：昨天下午、前天 18:30。");
    f.stage = "when"; return;
  }
  if (f.stage === "when") {
    const wh = gdParseWhen(text) || new Date();
    d.foundTime = wh.getTime();
    if (d.photo) { gdFinishIntake(d); return; }
    gdSay("有照片就点「照片」发一张，没有就回「跳过」。");
    f.stage = "photo"; return;
  }
  if (f.stage === "photo") {
    if (photo) d.photo = photo;
    gdFinishIntake(d);
  }
}
function gdAskPlace(d) { gdSay("在哪儿捡到的？"); GD.flow.stage = "place"; gdQuick(["图书馆", "学生1食堂", "操场", "五教"]); }
function gdFinishIntake(d) {
  const n = 1000 + (GD.lost.length ? (parseInt(String(GD.lost[0].id).replace(/\D/g, ""), 10) || 1000) : 1000) + 1;
  const sp = gdSpotOf(d.place);
  const e = {
    id: "L-" + n, category: d.category || "其他", place: d.place || "保卫处",
    x: sp ? sp.ax : null, y: sp ? sp.ay : null, desc: d.desc || "",
    foundTime: d.foundTime || gdNow(), storageTime: gdNow(),
    status: "in_storage", reporter: gdMe(), visibility: "public"
  };
  gdAddItem(e);
  gdSay("入库了。编号 " + e.id + "——" + e.category + "，在 " + e.place + " 捡到的，捡到时间 " +
        gdTime(e.foundTime) + "。失主来对，对得上才给。");
  gdMemPush("登记捡到" + e.category + "（" + e.place + "）", 4);
  gdEndFlow();
}
/* 证件入库：识别 → 念回确认 → 只落学号姓名，原图即弃 */
function gdFlowCardIntake(text, photo) {
  const f = GD.flow, d = f.data;
  if (/^不报了/.test(String(text || ""))) {
    gdStart("lost_intake"); GD.flow.stage = "desc";
    gdSay("行，那就按普通物品登记。长什么样说两句。"); return;
  }
  if (f.stage === "card_confirm") {
    if (/^(对|对得上|没错|是|好的|嗯)/.test(String(text || "").trim())) {
      const n = 1000 + (GD.lost.length ? (parseInt(String(GD.lost[0].id).replace(/\D/g, ""), 10) || 1000) : 1000) + 1;
      const e = {
        id: "L-" + n, category: d.cat || "校园卡", place: "保卫处", x: null, y: null, desc: "",
        name: d.name, studentId: d.sid, foundTime: gdNow(), storageTime: gdNow(),
        status: "in_storage", reporter: gdMe(), visibility: "public"
      };
      gdAddItem(e);
      gdSay("入库了。编号 " + e.id + "——" + e.category + "，学号 " + e.studentId + "，姓名 " + e.name +
            "。照片不留底，只存了学号和姓名。失主来核对对了就给。");
      gdMemPush("登记捡到" + e.category + "（" + e.studentId + "）", 5);
      gdEndFlow(); return;
    }
    gdSay("行，重来——重新传一张卡面，或者直接报学号和姓名。");
    f.stage = "card_manual"; return;
  }
  let sid = null, nm = null;
  if (photo) {
    gdNote("正在识别卡面信息……");
    gdVision(photo, "card").then(r => {
      if (!r.ok) { gdNote(GD_VISION_HINT); gdSay("识别用不上，直接报学号和姓名吧。"); return; }
      const o = (r.j && r.j.data) || {};
      if (o.isCard === false) { gdSay("这张看着不是证件——重新传一张，或直接报学号和姓名。"); return; }
      if (!o.studentId || !o.name) { gdSay("有几个字没认准——认不出的我们不瞎判。你直接报一下学号和姓名。"); return; }
      d.sid = o.studentId; d.name = o.name; if (o.category) d.cat = o.category;
      gdSay("认出来了——学号 " + d.sid + "，姓名 " + d.name + "。对不对？对的话回「对」我入库。");
      GD.flow.stage = "card_confirm";
      gdQuick(["对", "不对，重来"]);
    }).catch(() => { gdNote(GD_VISION_HINT); gdSay("直接报学号和姓名吧。"); });
    return;
  }
  sid = gdParseSid(text || ""); nm = gdParseName(text || "");
  if (!sid || !nm) { gdSay("学号（一串数字）和姓名（两到四个字）都得有。比如：20231234，李某某。"); return; }
  d.sid = sid; d.name = nm;
  const cat = gdNormCategory(text || ""); if (cat) d.cat = cat.cat;
  gdSay("登记为学号 " + sid + "，姓名 " + nm + "。对的话回「对」入库，不对重来。");
  f.stage = "card_confirm";
  gdQuick(["对", "不对，重来"]);
}
/* 报修 */
function gdFlowRepair(text) {
  const f = GD.flow, d = f.data;
  text = String(text || "").trim();
  /* ⚠️ 触发句直接当第一句答案吃（与独立版 `startFlow('repair'); FLOWS.repair.handle(text)`
       同一条链）：`gdStart` 落的是 "enter"，不认这一档的话「第二教学楼三楼灯管坏了」
       会卡在开场白里，之后说什么都没人接 —— 实测撞到的。 */
  if (f.stage === "enter") f.stage = "collect";
  if (f.stage === "collect") {
    const sp = gdResolvePlace(text);
    if (sp) d.place = sp.name;
    d.problem = text;
    if (!d.place) { gdSay("具体在哪儿？说个地名——教学楼、食堂、图书馆、操场这些就行。"); f.stage = "place"; gdQuick(["图书馆", "五教", "学生1食堂", "操场"]); return; }
    if (d.problem.length < 3) { gdSay("什么问题？灯不亮、水漏了、门坏了，说清楚。"); f.stage = "problem"; return; }
    gdCreateRepair(d); return;
  }
  if (f.stage === "place") { const sp = gdResolvePlace(text); d.place = sp ? sp.name : text; if (!d.problem) { gdSay("什么问题？"); f.stage = "problem"; return; } gdCreateRepair(d); return; }
  if (f.stage === "problem") { d.problem = text; gdCreateRepair(d); }
}
function gdCreateRepair(d) {
  const n = 2300 + GD.orders.length + 1;
  const o = { id: "W-" + n, place: d.place, problem: d.problem, status: "已受理", reporter: gdMe(), time: gdNow(), visibility: "public" };
  gdAddOrder(o);
  gdSay("受理了。工单号 " + o.id + "——" + o.place + "，" + o.problem + "，" + gdTime(o.time) + "，报修人 " + o.reporter +
        "。进度随时来问，说一句「" + o.place + "修好了吗」我就查。");
  gdMemPush("报修：" + o.place + " " + o.problem + "（" + o.id + "）", 5);
  gdEndFlow();
}
/* 认领闭环：核对 → 当面确认 → 交还 → 销账 */
function gdStartClaim(id) {
  const e = gdItemById(id);
  if (!e) { gdSay("这一档记录现在查不到了。"); return; }
  if (e.status !== "in_storage") { gdSay("这一件已经归还办结，不用再领了。"); return; }
  gdPush("me", "认领这条（" + e.id + "）");
  gdStart("claim", { entryId: id });
  if (GD_IS_CARD(e.category)) {
    GD.flow.stage = "verify_name";
    gdSay("校园卡得核对——学号库里有了，你把卡面上的姓名念一下。");
    gdQuick([]); return;
  }
  gdOwnerConfirm(id);
}
function gdBrief(e) {
  return "【" + e.id + "】" + e.category + "，" + e.place + "捡到的，捡到时间 " + gdTime(e.foundTime) +
    (e.desc ? "。" + e.desc : "") + (e.studentId ? "。登记学号 " + e.studentId + " · " + (e.name || "") : "");
}
function gdOwnerConfirm(id) {
  const e = gdItemById(id);
  if (!e || e.status !== "in_storage") { gdSay("这一件刚被领走，库里已经销了，你来晚一步。"); gdEndFlow(); return; }
  GD.flow = { type: "claim", stage: "confirm_owner", data: { entryId: id } };
  gdSay("东西取出来了，你当面认一眼——" + gdBrief(e) + " 是不是你这一件？看清楚再点头，给错人我得担责。");
  gdQuick(["是，这就是我的", "不是，我再想想"]);
}
function gdFlowClaim(text, photo) {
  const f = GD.flow, d = f.data;
  text = String(text || "").trim();
  if (f.stage === "enter" || f.stage === "ask") {
    const sid = gdParseSid(text);
    if (sid) {
      let e = null;
      for (const it of GD.lost) if (it.status === "in_storage" && it.studentId === sid) { e = it; break; }
      if (!e) { gdSay("库里没这张卡（学号 " + sid + "）。有人交来了我第一时间按学号对上你。"); gdEndFlow(); return; }
      d.entryId = e.id;
      gdSay("有这张卡——" + e.place + "捡到的，登记学号 " + e.studentId + "。把卡面上的姓名念一下。");
      f.stage = "verify_name"; return;
    }
    const tail = gdParseTail(text);
    if (tail) {
      const hits = gdCardsByTail(tail);
      if (hits.length === 1) {
        d.entryId = hits[0].id;
        gdSay("尾号 " + tail + " 对上了——" + hits[0].place + "捡到的" + hits[0].category +
              "，登记学号 " + hits[0].studentId + "。把卡面上的姓名念一下。");
        f.stage = "verify_name"; return;
      }
      gdSay(hits.length > 1 ? ("尾号 " + tail + " 有 " + hits.length + " 张卡对上，你把完整学号报一下。")
                            : "库里没找着尾号 " + tail + " 的卡——你报完整学号试试，或者说说什么东西。");
      return;
    }
    if (photo) { gdNote("正在识别卡面信息……"); gdVision(photo, "card").then(r => {
      if (r.ok && r.j && r.j.data && r.j.data.studentId) gdFlowClaim(String(r.j.data.studentId), null);
      else { gdNote(GD_VISION_HINT); gdSay("没认准学号，你直接打出来吧。"); }
    }).catch(() => { gdNote(GD_VISION_HINT); }); return; }
    const cat = gdNormCategory(text), sp = gdResolvePlace(text);
    if (!cat && !sp) { gdSay("报个学号（卡类），或者说说什么东西、在哪儿丢的。"); return; }
    let cands = (GD.lost || []).filter(i => i.status === "in_storage");
    if (cat) cands = cands.filter(i => i.category === cat.cat);
    if (sp) cands = cands.filter(i => i.place === sp.name);
    if (!cands.length) { gdSay("库里没有对得上的。先去「丢东西了」里查查，或者报学号。"); gdEndFlow(); return; }
    gdCards(cands.slice(0, GD_TOP).map(it => ({ it: it, s: { total: 1 } })), "库里对得上的有这些——");
    f.stage = "ask";
    gdSay("点下面卡片上的「认领这条」，我走核对。");
    return;
  }
  if (f.stage === "verify_name") {
    const name = gdParseName(text);
    if (!name) { gdSay("念一下卡面上的姓名，两到四个字。"); return; }
    const e = gdItemById(d.entryId);
    if (!e) { gdSay("这一档查不到了。"); gdEndFlow(); return; }
    if (e.name && e.name === name) { gdSay("学号、姓名都对上了——没跑了。"); gdOwnerConfirm(e.id); }
    else {
      gdSay("姓名对不上（库里记的是「" + (e.name || "未登记") + "」）。这张卡不能给你——宁可让你再核一次，也不能把卡给错人。");
      gdEndFlow();
    }
    return;
  }
  if (f.stage === "confirm_owner") {
    if (/不是|不对|再看|再想|没有|算了/.test(text)) {
      gdSay("行，东西先留我这儿，不勉强领。再想起什么特征，或者确认是你的了，随时来保卫处。");
      gdEndFlow(); return;
    }
    if (/^(是|对|我的|没错)|是，这就是我的/.test(text)) {
      GD.flow.stage = "handover";
      gdMemPush("认领确认：" + (gdItemById(d.entryId) || {}).category + "（" + d.entryId + "）待当面交还", 5);
      gdSay("好，物归原主。东西给你——拿好，当面点清，别回头少了东西说不清。");
      gdQuick(["拿到了，谢谢", "东西好像少了"]); return;
    }
    gdSay("认清楚再说话——是你的就点「是，这就是我的」，拿不准就点「不是，我再想想」。");
    return;
  }
  if (f.stage === "handover") {
    if (/少了|不对|有问题|错了|不是这/.test(text)) {
      gdMemPush("认领异议：" + (gdItemById(d.entryId) || {}).category + "（" + d.entryId + "）物品暂留保卫处待查", 5);
      gdSay("那东西还归我保管，先别急着拿。你说说是哪儿不对、少了什么，我记下来接着查——不能让你把别人的东西错拿回去。");
      gdEndFlow(); return;
    }
    if (/拿到|谢谢|没问题|没事|可以了|好了|^好$|^是/.test(text)) {
      const e = gdMarkReturned(d.entryId, gdMe());
      if (e) gdMemPush("认领交还：" + e.category + "（" + e.id + "）→ " + gdMe(), 6);
      gdSay("不客气。收好了，下回留心。");
      gdEndFlow();
      gdSay("下一位——丢东西、找东西、报修，讲。");
      return;
    }
    gdSay("当面点一下——拿到了、没问题就点「拿到了」；要是少了什么、东西不对，直接说。");
  }
}

/* --- 8. 自由文本入口（与独立版 handleText 同一张短路表）--------------- */
function gdRoute(text, photo) {
  const raw = String(text || "").trim();
  if (GD.flow) {
    if (/^(取消|算了|不弄了|退出)$/.test(raw)) { gdEndFlow(); gdSay("行，不弄了。有事再找我。"); return; }
    const t = GD.flow.type;
    if (t === "lost_search") gdFlowSearch(raw, photo);
    else if (t === "card_query") gdFlowCardQuery(raw, photo);
    else if (t === "lost_intake") gdFlowIntake(raw, photo);
    else if (t === "card_intake") gdFlowCardIntake(raw, photo);
    else if (t === "repair") gdFlowRepair(raw);
    else if (t === "claim") gdFlowClaim(raw, photo);
    else gdEndFlow();
    return;
  }
  const intent = gdClassify(raw);
  switch (intent) {
    case "call": gdCall(); return;
    case "greet": gdSay(GD_AGENT.greeting); return;
    case "my_records": {
      const mem = gdMemList();
      if (!mem.length) { gdSay("之前没打过交道。丢东西、报修，说吧。"); return; }
      gdSay("你之前的记录：\n" + mem.slice(0, 6).map(m => "· " + m.desc + "（" + m.time + "）").join("\n"));
      return;
    }
    case "repair_query": {
      const sp = gdResolvePlace(raw);
      let list = (GD.orders || []).slice();
      const mine = list.filter(o => o.reporter === gdMe());
      const shown = mine.length ? mine : (sp ? list.filter(o => o.place === sp.name) : list);
      if (!shown.length) { gdSay("没查到工单" + (sp ? "——" + sp.name + "这边没登记过" : "") + "。"); return; }
      gdNote((mine.length ? "你报过的工单：" : (sp ? sp.name + "这边的公开工单：" : "最近的公开工单：")) +
        shown.slice(0, 5).map(o => o.id + " " + o.place + "·" + o.problem + "【" + o.status + "】").join("　"));
      gdSay("要更新进度，说一句「" + shown[0].place + "已经修好了」我就销单。");
      return;
    }
    case "repair_status": {
      const done = /已经修好|修好了|不用修/.test(raw);
      const sp = gdResolvePlace(raw);
      let o = null;
      for (const x of GD.orders) if (x.status !== "已完成" && (!sp || x.place === sp.name)) { o = x; break; }
      if (!o) { gdSay("手头没有没结的工单。说个地名我查查。"); return; }
      o.status = done ? "已完成" : "处理中";
      gdSave();
      gdSay("改了。" + o.id + "（" + o.place + "）→ " + o.status + "。进度随时来问。");
      return;
    }
    case "lost_intake": gdStart("lost_intake"); gdSay("登记捡到的东西。什么东西？长什么样说两句。"); gdFlowIntake(raw, photo); return;
    case "claim": gdStart("claim", {}); gdSay("认领东西？卡类报学号，或者说说什么东西、在哪儿丢的，我帮你查。"); gdFlowClaim(raw, photo); return;
    case "lost_search": {
      gdStart("lost_search", {});
      gdSay("丢什么了？说说什么东西、在哪儿丢的、大概几点钟、长什么样。说不清楚也行，点「照片」发一张过来。");
      const meaningful = gdNormCategory(raw) || gdResolvePlace(raw) || gdParseWhen(raw) || raw.length >= 6;
      if (meaningful) gdFlowSearch(raw, photo);
      else gdQuick(["水杯", "雨伞", "钥匙", "校园卡", "耳机"]);
      return;
    }
    case "repair_report": gdStart("repair"); gdSay("报修是吧。在哪儿、什么问题？一句话说清，比如：五教二楼水龙头坏了。"); gdFlowRepair(raw); return;
    case "door": gdSay("门禁坏了按报修登记；补卡、开卡去一卡通中心。这俩都归值班窗口管。"); return;
    case "refuse": {
      let line = null;
      for (const k in GD_AGENT.refuse) if (raw.indexOf(k) >= 0) { line = GD_AGENT.refuse[k]; break; }
      if (!line) {
        if (/食堂|好吃|窗口|饭/.test(raw)) line = GD_AGENT.refuse["食堂评分"];
        else if (/选课|教务|课程|上课|老师/.test(raw)) line = GD_AGENT.refuse["选课"];
      }
      gdSay(line || GD_AGENT.unknownLine); return;
    }
    case "ask_way": gdSay("问路、导航找向导小北——按 E 找她。不归我这儿管。丢东西、报修，说吧。"); return;
    default:
      if (photo) { gdStart("lost_search", {}); gdFlowSearch("", photo); return; }
      if (gdNormCategory(raw) || gdResolvePlace(raw)) { gdStart("lost_search", {}); gdFlowSearch(raw, null); return; }
      gdSay("没听明白。丢东西、找东西、报修——就这三样，说吧。");
  }
}
function gdSubmit(text) {
  const t = String(text || "").trim();
  if (!t && !GD.photo) return;
  if (t && t !== "[照片]") gdPush("me", t);
  const photo = GD.photo;
  GD.photo = null;
  if (photo) gdNote("（已发一张照片）");
  gdRoute(t, photo);
}

/* --- 9. 开关与呼叫 --------------------------------------------------- */
function gdIsOpen() { return GD.open; }
function gdOpen(via) {
  gdLoad();
  if (typeof GUIDE !== "undefined" && GUIDE.open) { gdToast("先把小北的话说完（Esc 退出）。"); return; }
  const E = gdEnsureDom();
  GD.open = true;
  E.box.hidden = false;
  /* 对话一开口，「赶来」这件事就当场结掉（他要么已经站到你面前，要么就是你按 C 叫停的）。
     不清这一条，`GUARD.call` 会一直挂着：对话开着时地图那边根本不看它（`guardTick` 早退），
     面板一关它立刻恢复 ⇒ 老丁又开始朝你走，就是用户说的"退出对话还在跟踪"。 */
  gdCallOff();
  if (typeof keys !== "undefined") for (const k in keys) keys[k] = 0;
  if (via === "call") gdSay(GD_AGENT.callGreeting);
  else if (!E.log.childNodes.length) gdSay(GD_AGENT.greeting);
  gdQuick(GD.flow ? [] : GD_QUICK_HOME);
  E.in.focus();
}
/* `keepKeys` —— 用方向键退出面板那一条走 true。
   ⚠️ 本文件排在地图主脚本**之后**加载 ⇒ 地图那条按键监听先跑、已经把 `keys[k]` 置 1，
      这里再清一遍等于把玩家这一下按键吞掉（要按第二下才动）。其它关法（Esc、点空白）
      照旧清键，防"卡住的按键"把人推着走。 */
function gdClose(keepKeys) {
  GD.open = false;
  GD.photo = null;
  gdEndFlow();
  gdCallOff();
  const E = GD.els;
  if (E) { E.box.hidden = true; E.in.value = ""; E.in.blur(); }
  if (keepKeys) return;
  if (typeof keys !== "undefined") for (const k in keys) keys[k] = 0;
}
function gdToast(t) { if (typeof guideToast === "function") guideToast(t); }
/* 把地图那边「老丁正在赶来」的状态清掉，他会回到巡逻；本文件没加载（单文件那份缺 chunks）
   时至少把按钮上的灯掐了，不留一颗永远亮着的「赶来中」。 */
function gdCallOff() {
  if (typeof guardCallStop === "function") guardCallStop();
  else if (GD.chip) gdChipComing(false);
}
/* 呼叫老丁：**寻路与"跟着你走"全在地图那段（§7.9.7 `guardCall`）**，这儿只转过去。
   地图没加载（单文件那份缺 chunks）时才自己兜一句，不抛。 */
function gdCall() {
  if (GD.open) { gdEnsureDom().in.focus(); return; }
  if (typeof guardCall === "function") { guardCall(); return; }
  if (typeof GUARD === "undefined") { gdToast("老丁这会儿不在图上。"); return; }
  gdOpen("call");
}
function gdArrive() { gdOpen("call"); }
/* 地图那颗「呼叫老丁」的按钮（与左上角头像同一列，摆在它下面）。 */
function gdEnsureChip() {
  if (GD.chip) return GD.chip;
  const b = document.createElement("button");
  b.id = "mpCall"; b.type = "button"; b.title = "让老丁走过来（R）";
  b.innerHTML = '<i class="clDot"></i><i class="clTxt">呼叫老丁</i>';
  b.addEventListener("click", gdCall);
  document.body.appendChild(b);
  GD.chip = b;
  return b;
}
/* 赶来途中把按钮点亮、字改成「老丁赶来中」（地图那边调进来）。 */
function gdChipComing(v) {
  const b = gdEnsureChip();
  b.classList.toggle("gdComing", !!v);
  b.querySelector(".clTxt").textContent = v ? "老丁赶来中" : "呼叫老丁";
}
window.addEventListener("keydown", e => {
  if (e.isComposing || e.keyCode === 229) return;
  const k = (e.key || "").toLowerCase();
  if (k === "r" && !e.repeat && !GD.open && !GD.isTyping()) { gdCall(); e.preventDefault(); return; }
  if (k === "escape" && GD.open && !GD.isTyping()) { gdClose(); e.preventDefault(); return; }
  /* 面板开着但焦点已经不在输入框（点了画布、点了别处）⇒ 按方向键就该走人。
     与小北那块同一规矩（`72_guide.js` 文件头记着"面板一开玩家当场走不动"那次）。
     ⚠️ 不做 `preventDefault`：这条监听注册得比地图主循环那条**晚**，同 target 上
        地图那条先跑 ⇒ 人物照样动起来，这儿只是把面板收起。 */
  if (GD.open && !GD.isTyping() && /^(w|a|s|d|arrowup|arrowdown|arrowleft|arrowright)$/.test(k)) gdClose(true);
});
/* 焦点在输入框里时，Esc/Enter 由输入框自己处理，这条只判断"是不是在打字"。 */
GD.isTyping = function () {
  const a = document.activeElement;
  return !!a && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName);
};
gdEnsureChip();

/* --- 11. 左上角那一列按钮的摆位 --------------------------------------
   #mpMe（个人中心，模块 6）与 #mpCall（呼叫老丁）都 fixed 在左上角，而 #hud 那几行
   会随登录态与窗口宽度换行 ⇒ CSS 里写死的 top 迟早撞字（浏览器实测：#mpCall 正好压在
   「联机 · out · 同场景 1 人」那一行上，#mpMe 压在「已登录 · 普通用户」那一行上）。
   改成**量出 #hud 的下沿再往下叠**，两处变化值得监听：#hud 的内容（行数/文案）和
   #mpMe 的 `hidden`（没登录时那一格不占位）。
   ⚠️ `attributeFilter` 里**不许写 "style"**：我们自己就在写 `me.style.top`，
      观察自己写的属性 = 回调无限套娃。 */
function gdLayoutRail() {
  const hud = document.getElementById("hud");
  if (!hud) return;
  let y = Math.round(hud.getBoundingClientRect().bottom) + 8;
  const me = document.getElementById("mpMe");
  if (me) {
    me.style.top = y + "px";
    if (!me.hidden) y += me.offsetHeight + 6;
  }
  if (GD.chip) GD.chip.style.top = y + "px";
}
(function gdWatchRail() {
  gdLayoutRail();
  window.addEventListener("resize", gdLayoutRail);
  /* 再兜一层 400 ms 定时量位：登录态、头像图片加载、室内外切换都是异步的，
     漏掉一次回调就是头像压住引导字；量一次 rect 的代价可以忽略。 */
  if (typeof setInterval !== "undefined") setInterval(gdLayoutRail, 400);
  if (typeof MutationObserver === "undefined") return;
  const hud = document.getElementById("hud");
  /* `attributeFilter` 里要盯 `hidden`/`class`：HUD 那几行是 `<span>` + `:empty{display:none}`，
     「按 F 进入计算机中心」这类行**出现或消失**时整块高度会变，而清空 textContent
     不一定产生 childList 变化 ⇒ 只盯内容会漏，漏一次就撞字。 */
  if (hud) new MutationObserver(gdLayoutRail).observe(hud,
    { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ["hidden", "class"] });
  const me = document.getElementById("mpMe");
  /* 头像格子的**内容**（昵称长短、图片到位）也决定它自己多高，进而决定下一格 #mpCall 的位置。 */
  if (me) new MutationObserver(gdLayoutRail).observe(me,
    { attributes: true, attributeFilter: ["hidden"], childList: true, subtree: true });
})();
