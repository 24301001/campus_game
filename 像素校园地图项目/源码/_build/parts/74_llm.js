/* =========================================================
   7.4 「知识联系」+ 大模型兜底（第三十九轮）
   ---------------------------------------------------------
   用户 2026-09-30：
     「引路人不会直接说去哪里，可能会说『领我去打羽毛球的地方』，
       或者说『我想去吃饭』。这个时候可能需要大模型介入判断了，
       试着接入大模型来进行决断。……建立一些知识联系之类的。」

   一句话：**先查一张本地写死的「活动 → 地点」关联表，查不到再问大模型。**

   为什么是这个顺序（而不是一上来就调模型）——
     ① **离线是第一约束**（整个项目是单文件零依赖、双击就玩）：断网时那张表
        照常干活，只有长尾才需要网；
     ② 表里命中的结果是**确定性的**：同样的输入永远同样的答案，探针钉得死；
        大模型有 1~3 秒延迟、还带不确定性，不该花在「我想吃饭」这种一句话说清的事上；
     ③ 调模型要花钱、要**把用户的原话发到校外**。能本地判的就不发出去。

   ⚠️ 三层判读顺序写在 `72_guide.js` 的 `guideAsk()` 里：
        **① 字面地名  >  ② 本地关联表  >  ③ 大模型**
      字面地名**永远最优先** —— 用户打了「五教」，任何联想都不许把它抢走。

   ⚠️ 本段必须排在 `72_guide.js` **之后**（要读它的 `GDEST` / `GKEY` / `guideStrip` /
      `guidePick` / `guideSay` / `guideDlg`），排在主循环**之前**（只定义函数，
      运行期才碰 DOM/player）。段内**加载期**只碰 `GDEST` / `GKEY`（都是 72 段的
      const，此刻已初始化完）—— **不碰 `ctx` / `player` / `cam`**，那三个在主循环
      切片里、排在本段之后，加载期取会撞 TDZ。
   ========================================================= */

/* --- 7.4.1 本地「知识联系」表 ---
   用户说的往往是**活动/目的**，不是地名。这张表把前者翻成后者。

   ⚠️ 铁律：右列每一个名字都必须在 `GDEST` 里**真的有**。写错一个名字的后果
      不是报错，是 `guidePick` 静默返回 null、她说一句"没听明白" —— 极难查。
      `build.py` §7.5 里有一条断言逐个核这张表的右列。
   ⚠️ 左列是**触发词**（子串匹配，与 `guideResolve` 同款"最长优先"）。
      刻意写短、写口语 —— 长的规范说法反而匹配不到。
   ⚠️ 右列给**多个**名字就是交给 `guidePick` 消歧（取离玩家最近的，并把判据说出来）。
      本校园实测：食堂只有 `学生1食堂` 一个；`篮球场`×2 / `操场`×3 / `体育馆`×2 /
      `宿舍`×12 ⇒ 这几个天然是多候选。 */
const LINK = [
  [["吃饭", "饿了", "干饭", "午饭", "晚饭", "早饭", "早餐", "午餐", "晚餐", "吃点", "吃个饭"],
   ["学生1食堂"], "吃饭"],
  [["羽毛球", "打球"], ["新体育馆", "老体育馆"], "找个地方打球"],
  [["篮球"], ["篮球场"], "打篮球"],
  [["网球"], ["网球场"], "打网球"],
  [["跑步", "晨跑", "夜跑", "跑操", "踢球", "足球", "锻炼", "运动", "健身", "散步"],
   ["操场"], "去操场上动一动"],
  [["自习", "看书", "借书", "还书", "学习", "写作业", "泡馆", "复习", "刷题"],
   ["图书馆"], "找个安静地方学习"],
  [["宿舍", "寝室", "睡觉", "回屋", "洗澡", "洗个澡", "躺一会", "休息"],
   ["宿舍"], "回宿舍"],
  [["晚会", "演出", "讲座", "报告会", "看电影", "大会堂"],
   ["天佑会堂", "科学会堂"], "听讲座看演出"],
  [["办卡", "补办", "咨询", "办事", "服务", "买东西", "买水", "超市", "打印", "复印", "缴费"],
   ["学生服务中心"], "去办事"],
  [["上机", "机房", "编程", "写代码", "电脑"],
   ["计算机中心"], "用电脑"],
  [["校史", "参观", "展览", "博物馆"],
   ["校史馆"], "看校史"],
  [["做实验", "实验课", "实训"],
   ["机械实验馆", "运输实验馆", "工程训练楼"], "做实验"]
];

/* 最长优先（与 `guideResolve` 同一条规矩）：长词更能说明意图。
   ⚠️ 平局再看**出现位置**更靠前的那个 —— 用户先说的往往才是主目的。 */
function linkResolve(t) {
  let best = null, bestLen = 0, bestPos = Infinity;
  for (const row of LINK) {
    for (const k of row[0]) {
      const i = t.indexOf(k);
      if (i < 0) continue;
      if (k.length > bestLen || (k.length === bestLen && i < bestPos)) {
        bestLen = k.length; bestPos = i; best = row;
      }
    }
  }
  return best ? { names: best[1], why: best[2] } : null;
}

/* --- 7.4.2 给大模型的那份地点清单 ---
   从 `GDEST` 现算（不手抄），**按名字去重** —— `GDEST` 里 `宿舍` 有 12 条、
   `操场` 3 条、`篮球场` 2 条，直接把 57 行喂过去会让模型以为有 12 个不同的宿舍。 */
const KINDCN = { bld: "楼", siyuan: "楼", library: "图书馆", grass: "草坪",
                 water: "水域", track: "操场", bball: "篮球场", tennis: "网球场",
                 gate: "校门", plaza: "广场" };
let _DEST_TXT = "";
(function buildDestTxt() {
  const seen = Object.create(null), out = [];
  for (const d of GDEST) {
    if (seen[d.name]) continue;
    seen[d.name] = 1;
    out.push(d.name + "（" + (KINDCN[d.kind] || d.kind) + "）");
  }
  _DEST_TXT = out.join("、");
})();

/* --- 7.4.3 大模型兜底 ---
   ⚠️⚠️ **key 不在这个文件里，也不在产物 HTML 里。**
      单文件 HTML 是**要发给别人、要贴进 PPT、要传上网的**东西 —— key 一旦写进去
      就是明文外泄，而且删不干净（缓存、历史版本、别人手里那份）。
      ⇒ key 只存在**这台机器的浏览器**里（`localStorage`），第一次用到时弹一次输入框，
      之后一直记住。这个页面本身永远是一份可以随便给的干净文件。
      换 key：在页面里按 K，或者在控制台跑
        `localStorage.setItem('pixelcampus_llm_key','sk-...')`
   ⚠️ `localStorage` 在 `file://` 下有的浏览器会拒（源是不透明的），所以
      `llmKeyGet/Set` 全程 try-catch：存不住就退化成"这一次会话有效"，
      页面照样能用，只是下次打开要再贴一次。
   ⚠️ 端点用 DeepSeek 官方 `api.deepseek.com`：它在 `file://` 场景下会回
      `access-control-allow-origin: null`，所以**双击打开的本地页也能直接调**。
      换别的厂商前先确认它肯给 null 源放行，否则会被浏览器的同源策略挡在门外。 */
const LLM_URL = "https://api.deepseek.com/v1/chat/completions";
const LLM_MODEL = "deepseek-flash";
const LLM_TIMEOUT = 9000;                 // 9s：够模型想完，也不至于让人干等
const LLM_STORE = "pixelcampus_llm_key";
let   _llmKeyMem = "";                    // localStorage 存不住时的退路（仅本次会话）

function llmKeyGet() {
  if (_llmKeyMem) return _llmKeyMem;
  try { return (localStorage.getItem(LLM_STORE) || "").trim(); } catch (e) { return ""; }
}
function llmKeySet(k) {
  const v = (k || "").trim();
  _llmKeyMem = v;                          // 先记内存：localStorage 就算失败也已经生效
  try { localStorage.setItem(LLM_STORE, v); return true; } catch (e) { return false; }
}
const LLM_SYS = [
  "你是校园向导「小北」的语义解析器。用户说一句话表示他想去哪儿，你判断他指的是下面清单里的哪个地方。",
  "校园地点清单（只能从这里面选，一个字都不许改，也不许编）：",
  _DEST_TXT,
  "规则：",
  "1. 用户说的是**活动或目的**（吃饭、打羽毛球、自习、办卡…），你要挑最匹配的地点。",
  "2. 清单里没有合适的地方，或者你拿不准，place 就填 null ——**宁可说不知道，也不许瞎猜**。",
  "3. 同一个名字在校园里有多处（比如「宿舍」「操场」）时照常填那个名字，不要自己加方位。",
  "4. why 用不超过 12 个字的中文说清理由。",
  '5. 只输出一行 JSON，不要代码块、不要解释：{"place":"地点名或null","why":"理由"}'
].join("\n");

let _llmSeq = 0;                          // 作废计数器：又问了一次 ⇒ 上一次的回答丢掉

/* 把模型回的话解析成 `{name, why}`。
   ⚠️ 三层兜底，缺一层都会出洋相：① 先抓 JSON；② 抓不到就在原文里**找清单里的名字**；
      ③ **最后一定要拿 `GKEY` 验一遍** —— 模型是有可能编出一个听着很像但图上没有的
      地名的，不验的话她会说"我想到的是 X，可图上找不着"，把锅甩给自己。 */
function llmParse(s) {
  if (!s) return { name: null, why: "" };
  const raw = String(s);
  let name = null, why = "";
  const m = raw.match(/\{[\s\S]*\}/);
  if (m) {
    try {
      const o = JSON.parse(m[0]);
      if (o) { name = o.place || o.name || null; why = o.why || o.reason || ""; }
    } catch (e) { /* 不是合法 JSON ⇒ 落到下面那层 */ }
  }
  if (name) name = String(name).trim().replace(/[（(].*$/, "");
  if (name === "null" || name === "None") name = null;
  if (!name) {                                   // ② 原文里直接找规范名（长的优先）
    let bestLen = 0;
    for (const d of GDEST) {
      if (d.name.length > bestLen && raw.indexOf(d.name) >= 0) { bestLen = d.name.length; name = d.name; }
    }
  }
  if (name && !GKEY[name]) name = null;          // ③ 编出来的名字一律不认
  return { name: name, why: String(why).slice(0, 24) };
}

/* 问一次模型。⚠️ 全程不抛、不阻塞：回调里再判 `seq` 有没有过期。
   ⚠️ 用 `AbortController` 而不是"等它自己超时"：`fetch` 默认不超时，
      网断了会挂到天荒地老，面板上的"想想…"就一直转。 */
function llmAsk(text, cb) {
  const seq = ++_llmSeq;
  const fin = (name, why) => { if (seq === _llmSeq) cb(name, why); };
  const key = llmKeyGet();
  if (!key) { fin(null, "no-key"); return; }
  let ctl = null, to = 0;
  try {
    if (typeof AbortController === "function") {
      ctl = new AbortController();
      to = setTimeout(() => { try { ctl.abort(); } catch (e) {} }, LLM_TIMEOUT);
    }
  } catch (e) { ctl = null; }
  const opt = {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": "Bearer " + key },
    body: JSON.stringify({
      model: LLM_MODEL,
      messages: [{ role: "system", content: LLM_SYS }, { role: "user", content: text }],
      temperature: 0,                    // 选地点这件事没有"发挥"的余地
      max_tokens: 120
    })
  };
  if (ctl) opt.signal = ctl.signal;
  fetch(LLM_URL, opt)
    .then(r => r.json())
    .then(j => {
      clearTimeout(to);
      const c = j && j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content;
      const p = llmParse(c);
      fin(p.name, p.why);
    })
    .catch(() => { clearTimeout(to); fin(null, "net"); });
}

/* 让玩家把 key 贴进来（第一次用到模型时弹一次，之后就记住了）。
   ⚠️ 用 `window.prompt` 而不是自造一个输入框：**只有一次交互、没有新 DOM、没有新的
      CSS 状态**，而它的目的就是"贴一串字符"。为一个一年用一次的动作去加一套面板
      不划算。 ⚠️ `prompt` 在部分浏览器里会被拦（比如 iframe、或用户禁用），
      所以返回 null 要当成"算了"处理，不能当异常。 */
function llmKeyAsk() {
  let v = null;
  try { v = window.prompt("把大模型 API key 贴进来（只存在你这台机器的浏览器里，不会写进页面文件）\n\n现在没有也能玩：说地名、说「我想吃饭」都照常，只有长尾才需要它。"); }
  catch (e) { return false; }
  if (v === null) return false;
  v = v.trim();
  if (!v) return false;
  llmKeySet(v);
  return true;
}

/* 探针用：把清单直接吐出来，验"发出去的那份和产物一致"；不吐 key 本身。 */
function llmDebug() {
  return { dest: _DEST_TXT, n: _DEST_TXT.split("、").length,
           hasKey: !!llmKeyGet(), model: LLM_MODEL };
}
