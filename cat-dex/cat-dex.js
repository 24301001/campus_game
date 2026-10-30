/* =========================================================================
   cat-dex.js — 猫咪图鉴模块（本模块的代码全在 cat-dex/ 这一个文件夹里）
   -------------------------------------------------------------------------
   对外只有一个出口：`window.MPCatDex`。地图 / 大厅要用本模块**只调接口**：

     MPCatDex.openPanel(catId?) / closePanel() / togglePanel() / isOpen()   图鉴面板
     MPCatDex.cats() / cat(catId) / wears()                                 查询
     MPCatDex.level(catId) / can(catId, kind)                               等级与解锁判定
     MPCatDex.addXp(catId, 点数, 原因)                                      给某只猫涨好感，返回升了哪几级
     MPCatDex.setFollow(catId|null) / setWear(catId, 饰)                     跟随 / 头饰
     MPCatDex.on('level'|'wear'|'follow'|'met', fn)                         事件回调（宿主拿去做角标）
     MPCatDex.account()                                                    当前身份字符串

   (1) 进度是**账号级**的：认识过哪几只、好感、头饰、跟随，全部按 `mp:昵称` /
       `local:玩家id` 分账（§2.0）。地图自带的 `pixelcampus.cat_codex` 和
       `pixelcampus.pid` 是浏览器级的，换号会继承上一人的进度，所以本模块
       把 catCodexLoad / catCodexSee 整个换成账号级实现，不共用那两把钥匙。

   (2) 为什么要"钩"地图的猫宠引擎，而不是再养一套猫
       猫只有一份，就在 `像素校园_全校地图.html` 的 76/77/78 段（CATS / catTick / 轮盘）。
       本文件排在**主脚本之后**加载，而那些引擎函数都是**顶层 function 声明**
       （= window 上的属性），可以在不改动地图一个字节逻辑的前提下换成带等级的版本；
       `CATS / CAT_SPOTS / catSprite / guideToast` 这些顶层 const 读得到、改不了，
       正好只当数据源用。⇒ 地图那边只多两行引用：<head> 里一行 <link>、</body> 前一行
       <script>（外加两行注释），接口与改动清单见同目录 README.md。

   (3) 等级（0/1/5/7/10/15）和地图原有的"好感分数 0–100 / 六档"是两件事
       · 分数与档位是**耐受度**：决定猫肯让你靠到多近、会不会退开。
       · 本模块的等级是**解锁表**（需求原文）：1 级喂食 / 5 级猫主动靠近 /
         7 级爱心特效 / 10 级可选跟随 / 15 级头饰换装。
       两者用 `catMemo` 的分数下限缝合（见 install()）：低等级也**摸得到**猫，
       否则"0 级时接近并抚摸开启记录"这条根本做不到（陌生档的猫 120px 就跑）。

   (4) ⚠️ 加载期不碰 CATS / player / cam
       那些是主脚本里的顶层 const，本文件排在它之后取值是安全的；但所有取值都写在
       函数体里、运行期才求值，这样即使被单独加载到没有猫宠引擎的页面上也只是不干活。
   ========================================================================= */
(function () {
  "use strict";

  /* ---------------- 1. 等级曲线与解锁点 ---------------- */

  /* 涨分：抚摸 +2 / 喂食 +5；等级 L 升 L+1 要 L+1 点 ⇒ 累计是三角数
     （1 级=1、5 级=15、7 级=28、10 级=55、15 级=120）。
     为什么是 +2 起步：需求里"0 级只能靠抚摸开启"这一步**必须一次到位**——
     第一次抚摸就得把等级顶到 1，否则玩家摸完还是 0 级、照样喂不动，看着像没生效。 */
  const XP_PET = 2;
  const XP_FEED = 5;
  const PET_CD_MS = 2000;      // 同一只猫两次抚摸的最小间隔（防连点把等级刷穿）
  const FEED_CD_MS = 6000;     // 两次喂食的最小间隔：蹲下本身 3 秒，这条只压"开轮盘连点"
  const APPROACH_R = 160;      // 5 级"主动靠近"的触发半径
  const APPROACH_HOLD_MS = 6000;   // 走过来蹭一阵的时间预算
  const APPROACH_CD_MS = 24000;    // 两次"主动靠近"的间隔，否则它会一路贴着脚背走
  const UNLOCK = { feed: 1, approach: 5, heart: 7, follow: 10, wear: 15 };

  /* --- 饱腹（喂食自己的那条资源）-------------------------------------
     好感度是"熟不熟"，饱腹是"这阵子还吃得下吗"——两件事必须分开，否则
     "喂得越多越熟"会退化成"蹲在那儿连点就行"。
     吃满 4 次 = 100，之后每喂一次只会被拒；消化到低于上限才重新喂得进去。
     ⚠️ 消化按**真实时间**算（不是游戏作息钟）：`catNow().t` 就是 Date.now()，
        跟抚摸/喂食那两条冷却同一个时基，别一半用真时钟一半用拨钟。 */
  const FULL_MAX = 100;            // 饱腹上限
  const FULL_FEED = 25;            // 喂一次涨多少 ⇒ 连喂 4 次吃满
  const FULL_DECAY_PER_MIN = 10;   // 每分钟消化 10 点 ⇒ 吃满约 10 分钟见底
  /* --- 每日上限（每只猫各记各的，跨天自动刷新）-------------------------
     需求：「新增每日刷新好感度值上限、抚摸次数上限（每只猫咪单独计算）」。
     两个数是配套的：10 次抚摸 = 20 点 + 4 次喂食 = 20 点，正好把当天 40 点用满，
     所以"次数上限"是手感闸门（别把猫摸麻），"好感上限"才是真闸门（今天到顶了）。
     刷新的日子跟着主脚本 `catNow().day` 走，和地图自己那份"今天喂过没"同一天。 */
  const DAY_XP_CAP = 40;
  const DAY_PET_CAP = 10;
  const MILESTONE = {
    1: "可以喂它了",
    5: "你走近时，它会主动过来蹭一会儿",
    7: "摸它、喂它会冒爱心",
    10: "图鉴里可以选「让它跟着我」",
    15: "解锁头饰换装"
  };
  const MILESTONES = [1, 5, 7, 10, 15];
  const VERSION = "1.3.0";

  /* 品种与性格：与 mvp范围功能/猫宠.md §4.3 那张表同口径。
     引擎那份 cfg 只存了 warmup（喂食增益倍率），没有可读的性格文案，所以这里补齐。 */
  const CAT_BRIEF = {
    cat_daju: { breed: "橘猫", personality: "亲人", trait: "谁都能摸两下，最先把好感攒起来的那只。" },
    cat_guanzhang: { breed: "三花", personality: "怕生", trait: "认生，先让它习惯你在台阶边晃悠。" },
    cat_zhima: { breed: "黑猫", personality: "谨慎", trait: "躲在影壁后头观察你，动作别太猛。" },
    cat_lihua: { breed: "狸花猫", personality: "随和", trait: "在草坪上自己玩自己的，喂几回就熟了。" }
  };
  /* 领地名的口径来自需求与猫宠.md（食堂后门 / 图书馆台阶 / 明湖南岸影壁 / 思源楼草坪），
     key 用地图 CAT_SPOT_DEF 的那四个，实际方位再拼上 CAMPUS 的真实分区名。 */
  const SPOT_LABEL = {
    canteen_back: "食堂后门", library_steps: "图书馆台阶",
    minghu_yingbi: "明湖南岸影壁", grass_sys: "思源楼草坪"
  };

  /* ---------------- 2. 存档 ---------------- */

  const LS_KEY = "pixelcampus.cat_dex.v1";
  const data = { v: 1, day: "", rec: {}, codex: {} };
  let loaded = false;

  /* --- 2.0 账号身份 ----------------------------------------------------
     ⚠️ 这一节是"新账号一进来就 4/4 全认识"的根：地图那两把钥匙都挂在浏览器上 ——
        `catPid()` 存 localStorage["pixelcampus.pid"]，同一台机器只生成一次；
        "认识过哪几只"存 localStorage["pixelcampus.cat_codex"]，也没分账号。
        ⇒ 换一个登录号进来，拿到的还是上一个人在同一台浏览器里的图鉴和好感。
        所以身份在本模块里自己算，不再照抄 catPid()。

     优先序：
       1) 有登录态 → `"mp:" + mpNickname`。判据是 mpToken 有值：退出登录会走
          lobby.js 的 clearAccountState() → saveToken('') 把它清掉，而 mpNickname
          不会跟着清，所以只看昵称会把上一个人的名字带到注销后的空档里。
       2) 没登录态 → `"local:" + catPid()`，还是地图那个本地玩家 id；两种身份用
          前缀隔开，谁也不会顶掉谁的账。
     ⚠️ 用昵称而不是 token：token 每次登录都现发一张新的（服务端按 sha256 落一行），
        拿它当 key 会变成"每重登一次好感清零"。
     前缀留着冒号当标记：`load()` 靠它认出并清掉旧版那种没有账号段的行。 */
  function acct() {
    try {
      const tk = localStorage.getItem("mpToken"), nk = localStorage.getItem("mpNickname");
      if (tk && nk) return "mp:" + nk;
    } catch (e) {}
    try { return "local:" + (typeof catPid === "function" ? catPid() : "anon"); } catch (e) { return "local:anon"; }
  }
  /* pid() 每帧会被叫几十次（rec() → key() → pid()），而 localStorage 是同步读，
     所以夹一层 300ms 的缓存。换账号最慢 300ms 后被 acctWatch 发现，这期间不会有
     玩家动作落进账（摸有 2 秒冷却、喂有 6 秒），不会把点记到上一人的行上。 */
  let acctAt = 0, acctCache = "";
  function pid() {
    const now = Date.now();
    if (now - acctAt >= 300) { acctAt = now; acctCache = acct(); }
    return acctCache;
  }
  function key(catId) { return pid() + "|" + catId; }

  /* "认识过哪几只"也搬进本模块的存档，按账号分一格：`codex["mp:pvtest01"].cat_daju = 1`。
     地图的 catCodexLoad / catCodexSee 在 install() 里被换成读这套实现的版本，
     所以全校园只有一份真值，不会图鉴说没认识、地图说认识了。 */
  function codexOf(who) {
    load();
    if (!data.codex[who]) data.codex[who] = {};
    return data.codex[who];
  }
  function seen(catId) { const C = codexOf(pid()); return !!(C && C[catId]); }
  function see(catId) {
    const C = codexOf(pid());
    if (C[catId]) return false;                        // 这个账号早就见过
    C[catId] = 1; save();
    return true;
  }

  function load() {
    if (loaded) return;
    loaded = true;
    try {
      const raw = JSON.parse(localStorage.getItem(LS_KEY) || "null");
      if (raw && raw.rec) data.rec = raw.rec;
      if (raw && raw.day) data.day = raw.day;
      if (raw && raw.codex) data.codex = raw.codex;
      prune();
    } catch (e) { data.rec = {}; data.codex = {}; }
  }
  /* 清账上的两类死行：
       · 幽灵行 —— `pid|wear` 这类条目是早先 rec() 不校验猫 id 时写进去的，没人读也清不掉；
       · 无账号段的旧行（`pxxxx|cat_daju`）—— 身份改成账号级以后这些键再不会被读到。
     ⚠️ 只删**当前账号**的幽灵行：别人的行要留着，那正是"各账号各一份进度"的意义。
     ⚠️ 旧行不做迁移：把浏览器级的共享进度认给某一个人，等于换个姿势复现这个 bug。 */
  function prune() {
    try {
      const pfx = pid() + "|";
      let purged = 0;
      for (const k in data.rec) {
        const bar = k.indexOf("|"), who = bar < 0 ? k : k.slice(0, bar);
        if (who.indexOf(":") < 0) { delete data.rec[k]; purged++; continue; }
        const cid = k.slice(pfx.length);
        if (k.indexOf(pfx) === 0 && !(cid in CAT_BY_ID)) { delete data.rec[k]; purged++; }
      }
      for (const who in data.codex) if (String(who).indexOf(":") < 0) { delete data.codex[who]; purged++; }
      if (purged) save();                                   // 不写回的话下次读还是那一堆
    } catch (e) {}
  }
  function save() { try { localStorage.setItem(LS_KEY, JSON.stringify(data)); } catch (e) {} }
  function rec(catId) {
    load();
    /* ⚠️ 只给真猫建档：`can(id, "wear")` 这类参数写反的调用（把档位名当成了猫 id）
       以前会悄悄在账上留一条 `pid|wear` 的幽灵记录 —— 清都清不掉。 */
    try { if (!(catId in CAT_BY_ID)) return null; } catch (e) { return null; }
    const k = key(catId);
    if (!data.rec[k]) data.rec[k] = { xp: 0, wear: "none", follow: false, petAt: 0, feedAt: 0, full: 0, fullAt: 0, dayXp: 0, dayPets: 0 };
    return data.rec[k];
  }

  /* --- 2.1 每日额度与饱腹 --------------------------------------------
     两者都**不单独起定时器**：饱腹按时间差现算（读的时候才算，不写盘），
     每日额度靠一个全局的日期戳在跨天那一刻整本清一次。 */

  /* 主脚本的"今天"是 `年-月-日`（月/日不补零），照抄它的口径 ——
     两套存储各判各的"今天"，早晚会出现"地图说喂过、图鉴说没喂过"这种对不上的账。 */
  function today() {
    try { return catNow().day; } catch (e) {}
    const d = new Date();
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  }
  /* 跨天：把每只猫的当日额度、抚摸计数、饱腹一起归零。
     ⚠️ 整本一起清，不逐条比日期：账上可能留着别人/别的猫的行，那些不该占内存。 */
  function ensureDay() {
    load();
    const d = today();
    if (data.day === d) return false;
    data.day = d;
    const now = Date.now();
    for (const k in data.rec) {
      const r = data.rec[k];
      r.dayXp = 0; r.dayPets = 0; r.full = 0; r.fullAt = now;
    }
    save();
    return true;
  }
  /* 读到此刻的饱腹（0…FULL_MAX，可为小数）。纯函数：不改 r、不写盘。 */
  function fullness(r, now) {
    if (!r) return 0;
    const f = r.full || 0, t = r.fullAt || 0;
    if (!t) return Math.max(0, Math.min(FULL_MAX, f));
    return Math.max(0, Math.min(FULL_MAX, f - (now - t) / 60000 * FULL_DECAY_PER_MIN));
  }
  /* 只有"吃下去"这一件事需要落账：先把已经消化掉的扣掉，再加新的，时间戳重置。 */
  function eatFull(r, now) {
    r.full = Math.min(FULL_MAX, fullness(r, now) + FULL_FEED);
    r.fullAt = now;
  }
  /* 饱没饱 = **"下一口放不下了"**，不是"读数等于上限"。
     ⚠️ 这条判据本轮踩过：写成 `fullness >= FULL_MAX` 的话，因为消化是连续的，
        吃满那一刻的 100 过一秒就变成 99.8 —— 阈值再也够不着，玩家会看见
        "数值条画满了、喂下去却照样吃"。按"再加一份要不要溢出来"判，
        消化掉多少就得等多久，两头都对得上。 */
  function isStuffed(r, now) { return fullness(r, now) + FULL_FEED > FULL_MAX; }
  function dayXpLeft(r) { return Math.max(0, DAY_XP_CAP - (r.dayXp || 0)); }

  /* 等级 = 累计三角数的反解：满足 xp ≥ L(L+1)/2 的最大 L。 */
  function levelOf(xp) { let lv = 0; while (xp >= (lv + 1) * (lv + 2) / 2) lv++; return lv; }
  function xpToNext(lv) { return (lv + 1) * (lv + 2) / 2; }   // 升到 lv+1 所需的累计 xp

  /* ---------------- 3. 事件总线 ---------------- */

  const hooks = { level: [], wear: [], follow: [], met: [] };
  function on(name, fn) {
    if (!hooks[name] || typeof fn !== "function") return function () {};
    hooks[name].push(fn);
    return function () { const i = hooks[name].indexOf(fn); if (i >= 0) hooks[name].splice(i, 1); };
  }
  function emit(name, payload) {
    for (const fn of (hooks[name] || []).slice()) {
      try { fn(payload); } catch (e) { console.warn("[cat-dex] " + name + " 回调出错", e); }
    }
  }

  /* ---------------- 4. 查询与涨分 ---------------- */

  function level(catId) { load(); const r = rec(catId); return r ? levelOf(r.xp) : 0; }
  function nextMilestone(lv) { for (const n of MILESTONES) if (n > lv) return n; return null; }
  function can(catId, kind) {
    const lv = level(catId), need = UNLOCK[kind];
    if (need === undefined) return { ok: true, level: lv, need: null };
    return { ok: lv >= need, level: lv, need: need };
  }
  /* 只动数字：特效与文案由调用它的那两处交互（摸 / 喂）负责。
     ⚠️ 这里是**当日好感上限**唯一的落点：不管谁调（轮盘、快捷键、将来的活动），
        当天涨到 DAY_XP_CAP 就再也涨不动，不用每个入口各判一遍。
     返回值多两项：`got` = 实际到账的点数（可能被上限截短），
                  `capped` = 一下都没到账（今天的额度用完了）。 */
  function addXp(catId, amount, reason) {
    load();
    const r = rec(catId);
    if (!r) return { level: 0, up: [], got: 0, capped: false };
    let n = amount | 0;
    let capped = false;
    if (n > 0) {
      const left = dayXpLeft(r);
      if (n > left) { n = left; capped = left === 0; }
      r.dayXp = (r.dayXp || 0) + n;
    } else if (n < 0) {
      r.dayXp = Math.max(0, (r.dayXp || 0) + n);
    }
    const before = levelOf(r.xp);
    r.xp = Math.max(0, r.xp + n);
    save();
    const after = levelOf(r.xp), up = [];
    for (let lv = before + 1; lv <= after; lv++) up.push(lv);
    if (up.length) emit("level", { catId: catId, from: before, to: after, up: up, reason: reason || "" });
    return { level: after, up: up, got: n, capped: capped };
  }
  function setWear(catId, wearId) {
    load();
    if (level(catId) < UNLOCK.wear && wearId !== "none") return false;
    const r = rec(catId);
    if (!r) return false;
    r.wear = wearId; save();
    emit("wear", { catId: catId, wear: wearId });
    say(catName(catId) + "戴上了" + wearName(wearId));
    if (current && current === catId) renderDetail();
    return true;
  }

  /* ---------------- 5. 与地图引擎的缝合 ---------------- */

  /* 地图那份分数是耐受度。需求要求 0 级就能摸，所以按等级给它压一个**下限**：
       0~4 级 → 40（"熟"档：肯让你站到 30px 内，不跑也不倒退）
       5~9 级 → 60（"亲近"档：它自己绕到你脚边）  ← 需求"五级主动靠近"
       10 级以上 → 80（"很亲"档：跟着你走一段）    ← 需求"十级跟随"
     ⚠️ 只改读到的**副本**，不回写账本：地图每天一次的喂食奖励和惰性衰减照旧。 */
  const SCORE_FLOOR = [[10, 80], [5, 60], [0, 40]];
  function scoreFloor(catId) {
    const lv = level(catId);
    for (const [need, score] of SCORE_FLOOR) if (lv >= need) return score;
    return 0;
  }

  /* 提示统一借地图那颗气泡（同屏只有一条，不必新增 DOM）。
     ⚠️ setTimeout(…,0) 不是洁癖：轮盘在 `catFedToday()` 之后紧跟着一句自己的
        "它今天已经吃过了"，而 guideToast 是覆盖式的 —— 不排到后面就被它盖掉。 */
  function say(text) {
    setTimeout(function () { try { if (typeof guideToast === "function") guideToast(text); } catch (e) {} }, 0);
  }
  function milestoneNote(catId, up) {
    /* ⚠️ 这条气泡是**世界内**反馈，主脚本 §（交互.md 六）给它立的规矩是"只有动作、
       没有数字"，连档位名都不许出现。所以解锁提示只说它新做的事，等级和进度条留给
       图鉴面板 —— 需求要的"查看好感度"在面板里看，不在脚下报数。 */
    if (!up || !up.length) return;
    for (let i = up.length - 1; i >= 0; i--) {
      if (MILESTONE[up[i]] !== undefined) { say(catName(catId) + "：" + MILESTONE[up[i]]); return; }
    }
  }

  const patch = {};
  function wrapFn(name, make) {
    if (typeof window[name] !== "function") return false;
    patch[name] = window[name];
    window[name] = make(patch[name]);
    return true;
  }

  /* --- 5.1 摸：任何等级都能摸（0 级就是靠这一下开启记录） --- */
  function doPet(c) {
    if (!c) return false;
    const id = c.cfg.id, r = rec(id), now = Date.now();
    /* 当日次数闸门排在冷却之前：摸麻了的猫不该先弹一句"还没缓过来"。 */
    if ((r.dayPets || 0) >= DAY_PET_CAP) { say("它今天被你摸得够多了，让它歇一会儿"); return false; }
    if (now - (r.petAt || 0) < PET_CD_MS) { say("它抖了抖耳朵，还没缓过来"); return false; }
    r.petAt = now; r.dayPets = (r.dayPets || 0) + 1; save();
    const res = addXp(id, XP_PET, "pet");
    /* 猫**走过来蹭**：用主脚本那套 comeTo，不走 catPlay —— catPlay 会立一把锁，
       锁期间猫被钉在原地，"蹭"就退化成"原地抽一下"（第四十四轮踩过的坑）。 */
    try { c.comeTo = { x: player.x, y: player.y, act: "rub", stop: 20, until: now + 8000 }; } catch (e) {}
    if (res.level >= UNLOCK.heart) burst(c);
    /* 好感当天到顶：动作照做（它还是愿意被你摸），只是不再涨 —— 报一句实话，
       免得玩家以为摸没生效。 */
    if (res.capped) say("它今天玩累了，好感得明天再攒");
    else milestoneNote(id, res.up);
    return true;
  }

  /* --- 5.2 喂：1 级起 --- */
  function feedBlockReason(c) {
    if (!c) return "";
    const r = rec(c.cfg.id), now = Date.now();
    if (levelOf(r.xp) < UNLOCK.feed) return "先蹲下来摸摸它，熟一点才喂得动";
    /* 饱腹排在冷却之前：吃满了的猫，"刚吃过"那句是废话，"已经饱啦"才是原因。 */
    if (isStuffed(r, now)) return "猫咪已经饱啦，稍后再喂食吧";
    if (now - (r.feedAt || 0) < FEED_CD_MS) return "它刚吃过，等一会儿再喂";
    return "";
  }
  function doFeed(c) {
    if (!c) return "none";
    const id = c.cfg.id, r = rec(id);
    if (feedBlockReason(c)) return "cold";              // 轮盘已经先拦过，这里只是兜底
    const now = Date.now();
    r.feedAt = now; eatFull(r, now); save();            // 这一口记进饱腹
    const score = patch.catFeed.call(null, c);           // 地图那份：涨它的分数 + 放粮 + 叫猫过来吃
    /* 地图按"现实里每天一次"记冷却，当天第二句只回 'cold' 且**不放粮** ⇒ 画面里没有
       猫过来吃。模块的等级要能连着喂，所以把那一下表现补上（catDropFood 自己挂 comeTo）。 */
    if (score !== "ok") { try { catDropFood(c); } catch (e) {} }
    const res = addXp(id, XP_FEED, "feed");
    if (res.level >= UNLOCK.heart) burst(c);
    /* ⚠️ 到顶的时候粮照放、猫照吃（它不知道什么上限），只是好感不涨 ——
       所以这句要排在 milestoneNote 之前：两者不会同时出现（没涨就不会升级）。 */
    if (res.capped) say("它吃得挺高兴，不过今天的好感到这儿啦");
    else milestoneNote(id, res.up);
    return "ok";                                        // 轮盘那句"它低头吃了起来"
  }

  /* --- 5.3 头饰烘进精灵 --- */
  /* 主脚本 75 段 buildCat 的头位是**按姿态算**的（呼吸 / 低头吃 / 扑跳都会挪 1~4 行），
     照它那两个式子重算一遍，帽子才不会在"吃食低头"那几帧甩在半空。 */
  function headAnchor(dir, act, frame) {
    let acts = null;
    try { acts = CAT_ACTS; } catch (e) {}
    if (acts) {
      if (!(act in acts)) act = "idle";
      const n = acts[act] || 2;
      frame = ((frame | 0) % n + n) % n;
    }
    const moving = act === "walk" || act === "flee";
    /* `left` 是把 `right` 整张镜像出来的（buildCat 出口那条 flipH）⇒ 头中心 14 → 17-14 = 3。
       ⚠️ 这条对**所有**走 side() 的姿态都成立，包括蹲坐和睡 —— 漏一处就是帽子半边悬空。 */
    const sideCx = dir === "left" ? 3 : 14;
    /* 睡（curled）与朝向无关：front() 和 side() 两条路都直接 return curled()。
       ⚠️ 所以这条必须排在下面那个 dir 分支之前 —— 放后面等于给一颗趴着的头套上
       "站着时的头顶行"，皇冠会飘在半空。 */
    if (act === "sleep") return { cx: sideCx, top: 9 - (frame & 1) };
    if (dir === "down" || dir === "up") {                          // front()：头 8 宽，中线 9
      const breathe = ((act === "idle" || act === "wait") && (frame & 1)) ? 1 : 0;
      const bob = moving ? (frame & 1) : breathe;
      const hd = act === "eat" ? [3, 4, 2][frame] : 0;
      const sh = (act === "retreat" && (frame & 1)) ? 1 : 0;
      const sw = moving ? [0, 1, 0, -1][frame] : 0;
      const rb = act === "rub" ? (frame & 1) : 0;
      const pv = (act === "play" && frame === 0) ? 1 : 0;
      const ph = (act === "play" && frame === 2) ? 2 : 0;
      return { cx: 9 + rb + sw + ph, top: 2 - bob + hd + sh + pv };
    }
    if (act === "wait" || act === "retreat") return { cx: sideCx, top: 2 + (frame & 1) };
    let bob = 0;
    if (moving) {
      try { bob = (act === "flee" ? CAT_FLEE : CAT_WALK)[frame & 3].bob; } catch (e) { bob = frame & 1; }
    } else if (act === "idle" && (frame & 1)) bob = 1;
    const phd = act === "play" ? [2, 1, 3, 0][frame] : 0;
    const eh = act === "eat" ? [3, 4, 2][frame] : phd;
    return { cx: sideCx, top: 2 - bob + eh };
  }

  /* 每个部件是若干段"[相对头中心的 x, 相对头顶的 y, 宽, 高, 颜色]"矩形。
     同一套相对坐标在正脸（头 8 宽）和侧脸（头 6 宽）里都放得下，所以四个朝向共用一份数据。 */
  const WEARS = [
    { id: "none", name: "不戴", art: [] },
    { id: "bow", name: "蝴蝶结", art: [
      [-3, -3, 2, 2, "#e8607f"], [1, -3, 2, 2, "#e8607f"],
      [-1, -3, 2, 2, "#b8405f"], [-3, -3, 1, 1, "#ffb3c4"], [1, -3, 1, 1, "#ffb3c4"]
    ] },
    { id: "hat", name: "小礼帽", art: [
      [-2, -4, 4, 3, "#4f9c8f"], [-2, -4, 4, 1, "#7fd6c8"], [-3, -1, 6, 1, "#37655d"]
    ] },
    { id: "flower", name: "小红花", art: [
      [-1, -3, 2, 2, "#e0524f"], [-2, -2, 1, 1, "#f0846f"], [1, -2, 1, 1, "#f0846f"], [0, -2, 1, 1, "#ffe28a"]
    ] },
    { id: "crown", name: "小皇冠", art: [
      [-2, -1, 4, 1, "#c8931f"], [-2, -2, 1, 1, "#ffd76e"], [0, -2, 1, 1, "#ffd76e"], [1, -3, 1, 2, "#ffd76e"]
    ] }
  ];
  function wearName(id) { for (const w of WEARS) if (w.id === id) return w.name; return "不戴"; }
  function wearArt(id) { for (const w of WEARS) if (w.id === id) return w.art; return []; }

  const _wearCache = Object.create(null);

  /* --- 头顶留白（本轮修"待机一上一下时头饰一点点被吃掉"）----------------
     引擎的猫画布是 18×18，有效行只到 0，而 §75 段自己写着 `hy 不得 < 2，否则耳朵掉到
     负行被裁`。头饰是**戴在头顶之上**的（礼帽本体在头顶上面 2~4 行），于是：
         静止 frame0：头顶 hy=2 → 帽子落在 -2..0 → 只剩一行
         呼吸 frame1：hy 抬到 1 → 帽子落在 -3..-1 → 全裁光
     这就是"上升的时候头饰一点点进入隐藏"的全部机理 —— 不是透明度，是画布顶边裁切。
     ⇒ 给戴饰的那张图在**头顶多垫 WEAR_PAD 行透明**，帽子画进垫出来的空间里。
     ⚠️ 垫在顶上而不是底下：落笔点是 `dy = y - ay`（行号从图**顶**往下数），
        所以顶部多几行必须把 `ay` 一起抬高同样行数，脚点才不漂 —— 见 tick() 里那条。 */
  const WEAR_PAD = 4;
  function padTop(src, n) {
    if (!n) return src;
    const out = mkCanvas(src.width, src.height + n);
    out.getContext("2d").drawImage(src, 0, n);
    out.__cdxPad = n;                                   // 给 tick() 认路用：这张图垫了几行
    return out;
  }

  function dressSprite(base, catId, dir, act, frame, wearId) {
    const art = wearArt(wearId);
    if (!art.length) return base;                       // 不戴 ⇒ 直接返回引擎那张缓存图，零开销
    const ck = catId + "|" + dir + "|" + act + "|" + frame + "|" + wearId;
    if (_wearCache[ck]) return _wearCache[ck];
    const out = padTop(base, WEAR_PAD);
    const g = out.getContext("2d");
    const a = headAnchor(dir, act, frame);
    const hy = a.top + WEAR_PAD;                        // 头顶行换算到垫高之后的坐标系
    /* 先铺一层深色垫，再叠本色：主脚本的工艺是"描边在着色之前"，
       部件是后加上去的，不带这圈边就会在橘毛上糊成一坨读不出形状。 */
    for (const q of art) px(g, a.cx + q[0] - 1, hy + q[1] - 1, q[2] + 2, q[3] + 2, "rgba(24,20,18,0.55)");
    for (const q of art) px(g, a.cx + q[0], hy + q[1], q[2], q[3], q[4]);
    _wearCache[ck] = out;
    return out;
  }
  /* 试戴预览：绕开存档，直接拿引擎原图 + 指定部件现烘一张。
     ⚠️ "不戴"也要垫同样的留白 —— 否则同一格试戴图里戴饰的猫会比不戴的矮一截。 */
  function wearPreview(catId, wearId, act, dir, frame, scale) {
    const src = patch.catSprite ? patch.catSprite.call(null, catId, act, dir, frame) : catSprite(catId, act, dir, frame);
    const dressed = dressSprite(src, catId, dir, act || "idle", frame || 0, wearId);
    return scaleUp(dressed === src ? padTop(src, WEAR_PAD) : dressed, scale);
  }
  /* 图鉴格 / 姿态条用的图：走**已挂钩**的 catSprite（戴了饰就带饰），
     再统一补到同样的行高，保证一排水印大小一致。 */
  function panelSprite(catId, act, dir, frame) {
    const img = catSprite(catId, act, dir, frame);
    return img && !img.__cdxPad ? padTop(img, WEAR_PAD) : img;
  }
  function scaleUp(src, scale) {
    const c = mkCanvas(src.width * scale, src.height * scale);
    const g = c.getContext("2d");
    g.imageSmoothingEnabled = false;
    g.drawImage(src, 0, 0, c.width, c.height);
    return c;
  }

  /* ---------------- 6. 爱心特效（进世界层，跟着镜头走） ---------------- */

  /* 三档尺寸 = 同一条生命周期的三段：大→中→小，本色渐暗。
     ⚠️ 用"换图"而不是"改 alpha"：主脚本的绘制循环里 globalAlpha 是**遮挡淡入淡出**
     占用的（occlAlpha 按 img 查），条目上没有透明度字段可用。 */
  const HEART_FRAMES = [
    { w: 7, h: 6, tint: "#ff6b8a", hi: "#ffd0dd" },
    { w: 5, h: 5, tint: "#f2879c", hi: "#ffd9e2" },
    { w: 3, h: 3, tint: "#d9788c", hi: "#f7c3cf" }
  ];
  const _heartSpr = Object.create(null);
  const _hearts = [];
  const MAX_HEARTS = 24;
  function heartCanvas(f) {
    if (_heartSpr[f.w]) return _heartSpr[f.w];
    const c = mkCanvas(f.w, f.h), g = c.getContext("2d");
    if (f.w === 7) {
      px(g, 1, 0, 2, 1, f.tint); px(g, 4, 0, 2, 1, f.tint);
      px(g, 0, 1, 7, 2, f.tint); px(g, 1, 3, 5, 1, f.tint);
      px(g, 2, 4, 3, 1, f.tint); px(g, 3, 5, 1, 1, f.tint);
    } else if (f.w === 5) {
      px(g, 1, 0, 1, 1, f.tint); px(g, 3, 0, 1, 1, f.tint);
      px(g, 0, 1, 5, 2, f.tint); px(g, 1, 3, 3, 1, f.tint); px(g, 2, 4, 1, 1, f.tint);
    } else {
      px(g, 0, 0, 3, 2, f.tint); px(g, 1, 2, 1, 1, f.tint);
    }
    px(g, 1, 1, 1, 1, f.hi);                            // 左上高光（光自左上，同全项目）
    _heartSpr[f.w] = c;
    return c;
  }
  function burst(c) {
    if (!c) return;
    let hx = c.x, hy = c.y - 12;
    try {
      const a = headAnchor(c.dir, c.act, c.frame);
      let AX = 9, AY = 15;
      try { AX = CAT_AX; AY = CAT_AY; } catch (e) {}
      hx = c.x + (a.cx - AX);                            // 侧视时头在锚点前 5px，爱心跟着头走
      hy = c.y - (AY - a.top);
    } catch (e) {}
    for (let i = 0; i < 4; i++) {
      if (_hearts.length >= MAX_HEARTS) _hearts.shift();
      /* 上浮总高度压在 14 行以内（vy × ttl）：跟随状态的猫就趴在脚边，
         再高的话爱心会飘到玩家胸口，读起来像玩家在冒爱心而不是猫。 */
      _hearts.push({
        x: hx + (Math.random() * 10 - 5), y: hy,
        vy: 8 + Math.random() * 5, sway: Math.random() * Math.PI * 2,
        life: 0, ttl: 0.8 + Math.random() * 0.4
      });
    }
  }

  /* ---------------- 7. 跟随（10 级） ---------------- */

  function agent(catId) { try { return CAT_BY_ID[catId] || null; } catch (e) { return null; } }
  function isFollowed(c) { try { return !!(c && c.cfg && rec(c.cfg.id).follow); } catch (e) { return false; } }

  /* 一次只让一只猫跟 —— 四只全贴上来的话，画面变成遛猫大队，而且需求说的是"让猫咪跟随自己"。 */
  function setFollow(catId) {
    load();
    /* ⚠️ 先验目标再清场：反过来的话 `setFollow(一只不够格的猫)` 会把**当前**那只跟丢，
       自己却没接上（验收时踩到过一次）。 */
    const target = catId ? agent(catId) : null;
    if (!target || level(catId) < UNLOCK.follow) return false;
    try {
      for (const id in CAT_BY_ID) {
        const r = rec(id);
        if (!r.follow || id === catId) continue;
        r.follow = false; releaseHome(agent(id));
      }
    } catch (e) {}
    const r = rec(catId);
    r.follow = true;
    save();
    emit("follow", { catId: catId, on: true });
    say(catName(catId) + "跟上了你");
    return true;
  }
  function stopFollow(catId) {
    load();
    const r = rec(catId);
    if (!r || !r.follow) return false;
    r.follow = false; save();
    releaseHome(agent(catId));
    emit("follow", { catId: catId, on: false });
    say(catName(catId) + "回了老地方");
    return true;
  }
  function followOf() {
    load();
    try { for (const id in CAT_BY_ID) if (rec(id).follow) return id; } catch (e) {}
    return null;
  }
  /* 关掉跟随就把它挪回自己的领地：领地绳圈还挂在原地，不挪的话它出圈之后每一步都被
     catKeepIn 顶回来 = 永久钉死在墙边动不了。 */
  function releaseHome(c) {
    if (!c) return;
    c.comeTo = null;
    try {
      c.x = c.spot.x; c.y = c.spot.y; c.lastX = c.x; c.lastY = c.y; c.wpi = 0; c.stuck = 0;
    } catch (e) {}
  }
  function followTick() {
    let ids;
    try { ids = Object.keys(CAT_BY_ID); } catch (e) { return; }
    const now = Date.now();
    let indoors = false;
    try { indoors = document.body.classList.contains("ctr-on"); } catch (e) {}
    for (const id of ids) {
      if (!data.rec[key(id)]) continue;
      const r = data.rec[key(id)];
      if (!r.follow) continue;
      const c = agent(id);
      if (!c || !c.active) continue;
      if (indoors) { c.comeTo = null; continue; }        // 玩家进楼：猫在原地等，别往墙上顶
      /* ⚠️ 它手上还有"走过来做事"的活计没到期，这一帧就别去抢（需求：跟随中喂食也要
         先吃完再跟上）。抢的后果不是报错而是画面错：下面那句 `c.comeTo = …` 每帧都写，
         于是猫刚低头啃两口就被拽回来找你，粮剩在那儿没人吃。
         只管 eat / rub 这两种"到点自己会完"的活计 —— `wait` 本来就是本函数写的。 */
      const ct = c.comeTo;
      if (ct && (ct.act === "eat" || ct.act === "rub") && ct.until > now) continue;
      const d = Math.hypot(player.x - c.x, player.y - c.y);
      if (d > 400) {
        /* 换作息时主脚本会把猫瞬移回新领地（那是它的既有口径），跟丢到这张校园的另一头
           就不是"走回来"能解决的了 ⇒ 直接捞回玩家脚边，和它自己的瞬移同一套说法。 */
        c.x = player.x; c.y = player.y + 30; c.lastX = c.x; c.lastY = c.y; c.wpi = 0; c.stuck = 0;
      }
      /* stop=34：到位后它就坐下等（act 'wait' 是蹲坐那两帧），玩家停下也不再挪。 */
      c.comeTo = { x: player.x, y: player.y, act: "wait", stop: 34, until: now + 2200 };
    }
  }

  /* --- 7.1 主动靠近（5 级）--- */
  /* ⚠️ 这条**不能**只靠档位下限实现：60 分解禁的是"亲近"档的 rub 分支，而那个分支
     入口是 `d < 30`（CAT_TIERS 里亲近的 dist）—— 玩家非得贴到猫脸上，猫才挪最后
     8 个像素，读不出"走过来"。所以走主脚本自己那套 comeTo：它按领地绳圈夹目标点，
     猫会走到领地边缘停下，绝不因为追玩家而出圈（验收「猫始终在 radius 内」照旧成立）。
     跟随中、午睡中、玩家进楼时都不触发 —— 前两者各有自己的表现，后者猫在原地等。 */
  function approachTick() {
    let ids;
    try { ids = Object.keys(CAT_BY_ID); } catch (e) { return; }
    let indoors = false;
    try { indoors = document.body.classList.contains("ctr-on"); } catch (e) {}
    if (indoors) return;
    const now = Date.now();
    for (const id of ids) {
      if (!data.rec[key(id)]) continue;
      const r = data.rec[key(id)];
      if (levelOf(r.xp) < UNLOCK.approach || r.follow) continue;
      if (now - (r.approachAt || 0) < APPROACH_CD_MS) continue;
      const c = agent(id);
      if (!c || !c.active || c.nap || c.comeTo || c.holdT > 0) continue;
      if (Math.hypot(player.x - c.x, player.y - c.y) > APPROACH_R) continue;
      r.approachAt = now; save();
      c.comeTo = { x: player.x, y: player.y, act: "rub", stop: 22, until: now + APPROACH_HOLD_MS };
    }
  }

  /* ---------------- 7.5 靠近猫咪时的键位提示（Q 抚摸 / R 喂食） ---------------- */
  /* 需求：「靠近猫咪出现抚摸/喂食的快捷键键位提醒引导」。
     画法照地图自己门口那颗 #dtip（§7.5.16）：同一套 DOM 气泡、同一套世界→屏幕换算，
     挂进 #catDexRoot ⇒ 联机那三张弹窗一开它就跟着让位（那条规则已在本模块 CSS 里）。
     ⚠️ 键位**只在气泡亮着的时候**生效：远处按 Q 不该把"这附近没有猫"顶到玩家脸上。 */
  const HOTKEY = { q: "pet", r: "feed" };
  let tip = null, _tipTxt = undefined, _tipX = -1e9, _tipY = -1e9;

  function reachCat() { try { return typeof catTarget === "function" ? catTarget() : null; } catch (e) { return null; } }
  function wheelOpen() { try { return !!(window._wheelOpen && window._wheelOpen()); } catch (e) { return false; } }
  function gateUp() {
    const lg = document.getElementById("login");
    if (lg && !lg.hidden) return true;
    const au = document.getElementById("mpAuthShade");
    return !!(au && !au.hidden);
  }
  function inRoom() { try { return document.body.classList.contains("ctr-on"); } catch (e) { return false; } }

  function tipEl() {
    if (tip) return tip;
    if (!root) return null;
    tip = el("div", "cdx-keytip"); tip.hidden = true;
    /* 插成第一个孩子：气泡永远压在按钮和图鉴弹窗之下，不用跟层序较劲。 */
    root.insertBefore(tip, root.firstChild);
    return tip;
  }

  /* 世界 → 屏幕。全项目没有现成的换算函数（那套内联在 render() 里），
     照 §7.5.16 门口那颗的式子抄一份，含"画布居中后剩下的边距"那一项。 */
  function worldToScreen(wx, wy) {
    let VW, VH, z, cm;
    try { VW = VIEW_W; VH = VIEW_H; z = zoom; cm = cam; } catch (e) { return null; }
    const cvEl = document.getElementById("cv");
    const cssW = cvEl && parseFloat(cvEl.style.width);
    if (!cssW) return null;
    const cs = cssW / VW;
    return {
      x: (window.innerWidth - VW * cs) / 2 + (wx - cm.x) * z * cs,
      y: (window.innerHeight - VH * cs) / 2 + (wy - cm.y) * z * cs
    };
  }

  /* 只报此刻真按得动的键：0 级喂不动（需求那道门槛），就不写 R。
     ⚠️ 一个数字都不许出现 —— 交互.md §六"只有动作、没有数字"对这颗气泡同样成立。 */
  function tipText(c) {
    let s = "<b>Q</b> 抚摸";
    if (level(c.cfg.id) >= UNLOCK.feed) s += " · <b>R</b> 喂食";
    return s + " · <b>G</b> 更多";
  }

  function tipTick() {
    const t = tipEl();
    if (!t) return;
    const c = (gateUp() || inRoom() || wheelOpen() || isOpen()) ? null : reachCat();
    let p = null;
    if (c && c.active !== false) {
      let hy = c.y - 22;
      try { const a = headAnchor(c.dir, c.act, c.frame); hy = c.y - (CAT_AY - a.top) - 6; } catch (e) {}
      p = worldToScreen(c.x, hy);
      /* 猫在屏幕外（或头顶那颗会飘出上边界）就别画 —— 门口那颗是夹进视口，
         它钉在楼上不会跑；这颗跟着猫走，夹到边上会变成"贴着屏幕的一张假脸"。 */
      if (p && (p.x < 8 || p.x > window.innerWidth - 8 || p.y < 30 || p.y > window.innerHeight)) p = null;
    }
    const txt = p ? tipText(c) : "";
    if (txt !== _tipTxt) {
      _tipTxt = txt;
      if (txt) { t.innerHTML = txt; t.hidden = false; } else t.hidden = true;
    }
    if (p && (Math.abs(p.x - _tipX) > 1 || Math.abs(p.y - _tipY) > 1)) {
      _tipX = p.x; _tipY = p.y;
      t.style.left = p.x + "px"; t.style.top = p.y + "px";
    }
  }

  /* 轮盘里那两格也补上键位：气泡说"Q 摸 R 喂"，点开轮盘却看不到，等于自相矛盾。 */
  function badgeWheel() {
    const svg = document.querySelector("#wheel svg");
    if (!svg || svg.querySelector(".cdx-wk")) return;
    const put = function (x, y, ch) {
      const n = document.createElementNS("http://www.w3.org/2000/svg", "text");
      n.setAttribute("class", "cdx-wk");
      n.setAttribute("x", x); n.setAttribute("y", y);
      n.setAttribute("text-anchor", "middle");
      n.textContent = ch;
      svg.appendChild(n);
    };
    put(100, 56, "Q");    // 上扇区「摸」
    put(163, 123, "R");   // 右扇区「喂」
  }

  function bindHotkeys() {
    window.addEventListener("keydown", function (e) {
      /* 三道早退照轮盘自己那段：输入法组字中、keyCode 229、焦点在输入框里
         （联机聊天框打着 "q" 不该把猫摸一把）。 */
      if (e.isComposing || e.keyCode === 229) return;
      const t = e.target;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (gateUp() || inRoom() || isOpen()) return;
      const act = HOTKEY[(e.key || "").toLowerCase()];
      if (!act) return;
      if (!reachCat()) return;
      e.preventDefault();
      window._wheelRun(act);                       // 走轮盘那条路：转身、蹲下、文案、冷却全是它的
    }, false);
  }

  /* ---------------- 8. 每帧心跳：搭在 occlTick 上 ---------------- */

  /* 主脚本在 render() 里把精灵塞进 drawList、**排完序之后**调 occlTick ——
     这是唯一一个顶层可替换、又正好落在"列表清空之后 / 落笔之前"的钩子。
     爱心在这里进列：排在末尾 ⇒ 永远压在最上层（特效本来就该盖住楼和人）。 */
  /* 身份会在页面不刷新的情况下变：大厅登录 / 退出登录 / 断网转单机都只改
     localStorage 里那两把钥匙。不盯住它的话，刚注销的人下一秒还在看上一人的图鉴，
     上一人领的那只猫也还贴在脚边。 */
  let lastAcct = "", lastFollowId = null;
  function acctWatch() {
    const a = pid();
    if (a === lastAcct) return;
    const switched = !!lastAcct, oldFollow = lastFollowId;
    lastAcct = a;
    lastFollowId = followOf();
    if (!switched) return;                              // 加载后第一次只登记，不动画面
    if (oldFollow && oldFollow !== lastFollowId) {
      try { releaseHome(agent(oldFollow)); } catch (e) {}
    }
    if (grid && !shade.hidden) renderGrid();
    if (detail && !detail.hidden) renderDetail();
  }

  let lastNow = 0;
  function tick(list) {
    const now = performance.now();
    let dt = (now - lastNow) / 1000;
    lastNow = now;
    if (!(dt > 0) || dt > 0.1) dt = 0.016;              // 首帧 / 切后台回来：别按大跳算
    try { ensureDay(); } catch (e) {}                   // 跨零点：当日额度整本归零
    try { acctWatch(); } catch (e) {}                   // 换账号：面板和跟随都要跟着换
    try { followTick(); } catch (e) {}
    try { approachTick(); } catch (e) {}
    try { tipTick(); } catch (e) {}
    for (let i = _hearts.length - 1; i >= 0; i--) {
      const h = _hearts[i];
      h.life += dt;
      if (h.life >= h.ttl) { _hearts.splice(i, 1); continue; }
      h.y -= h.vy * dt;
      const t = h.life / h.ttl;
      const f = HEART_FRAMES[t < 0.35 ? 0 : (t < 0.7 ? 1 : 2)];
      list.push({
        img: heartCanvas(f), ax: f.w >> 1, ay: f.h,
        x: h.x + Math.sin(h.sway + h.life * 5) * 3, y: h.y, baseY: h.y, ch: 1
      });
    }
    /* 戴饰的猫：精灵在头顶多垫了几行透明（§5.3），落笔点得跟着抬高同样行数，
       不然脚会往下掉 4 像素、和接地影错开。
       ⚠️ 判据用图上的 `__cdxPad`（只有本模块烘出来的那几张有），不能按 `ch` 判；
          ⚠️⚠️ 而且必须防重入：主脚本把 props 的条目**按引用**推进 drawList
          （render() 里那句 `drawList.push(p)`），`ay += ` 写两遍猫就飘上半空。 */
    for (const it of list) {
      const p = it.img && it.img.__cdxPad;
      if (p && it.__cdxPadDone !== p) { it.ay += p; it.__cdxPadDone = p; }
    }
  }

  /* ---------------- 9. 图鉴面板 ---------------- */

  let root = null, btn = null, shade = null, grid = null, detail = null, countEl = null, current = null;
  const el = function (tag, cls, html) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html !== undefined) n.innerHTML = html;
    return n;
  };

  function catName(catId) {
    try { return CAT_BY_ID[catId].cfg.name; } catch (e) { return catId; }
  }
  function spotLabel(k) { return SPOT_LABEL[k] || k; }
  function homeOf(catId) {
    try {
      const cfg = CAT_AGENTS.filter(function (a) { return a.id === catId; })[0];
      const zone = CAT_SPOTS[cfg.home] ? CAT_SPOTS[cfg.home].zone : "";
      return spotLabel(cfg.home) + (zone ? "（" + zone + "一带）" : "");
    } catch (e) { return "校园里的某处"; }
  }
  function nowWhere(catId) {
    try {
      const c = agent(catId);
      const slot = catSlot(c.cfg, catNow().mins);
      return slot ? spotLabel(slot.at) + (slot.nap ? " · 午睡中" : "") : "——";
    } catch (e) { return "——"; }
  }
  function scheduleOf(catId) {
    try {
      return CAT_SCHED[catId].map(function (s) {
        return { from: s.from, to: s.to, at: spotLabel(s.at), nap: !!s.nap };
      });
    } catch (e) { return []; }
  }
  /* 认不认识 = **这个账号**见没见过它（身份口径见 §2.0）。
     以前这行直接读地图的 catCodexLoad()，那本账挂在浏览器级 localStorage 上，
     换个登录号进来四只全是亮的 —— 图鉴就没悬念可言了。 */
  function met(catId) { try { return seen(catId); } catch (e) { return false; } }

  function cats() {
    load();
    try { ensureDay(); } catch (e) {}
    const out = [];
    const now = Date.now();
    try {
      for (const cfg of CAT_AGENTS) {
        const r = rec(cfg.id), lv = levelOf(r.xp), b = CAT_BRIEF[cfg.id] || {};
        const lo = lv ? xpToNext(lv - 1) : 0, hi = xpToNext(lv);
        out.push({
          id: cfg.id, name: cfg.name, breed: b.breed || "", personality: b.personality || "",
          trait: b.trait || "", home: homeOf(cfg.id), now: nowWhere(cfg.id),
          schedule: scheduleOf(cfg.id), met: met(cfg.id),
          xp: r.xp, level: lv, xpIn: r.xp - lo, xpNeed: hi - lo, xpToNext: hi,
          wear: r.wear, wearName: wearName(r.wear), follow: !!r.follow,
          nextMilestone: nextMilestone(lv),
          full: fullness(r, now), fullMax: FULL_MAX, fullFeed: FULL_FEED, stuffed: isStuffed(r, now),
          dayXp: r.dayXp || 0, dayXpCap: DAY_XP_CAP,
          dayPets: r.dayPets || 0, dayPetCap: DAY_PET_CAP
        });
      }
    } catch (e) { console.warn("[cat-dex] 猫清单读不到（地图的猫宠引擎没加载？）", e); }
    return out;
  }
  function cat(catId) { for (const c of cats()) if (c.id === catId) return c; return null; }

  function updateBadge() {
    if (!countEl) return;
    const list = cats(), lit = list.filter(function (c) { return c.met; }).length;
    countEl.textContent = "已认识 " + lit + "/" + list.length;
  }

  function renderGrid() {
    grid.textContent = "";
    for (const c of cats()) {
      const card = el("button", "cdx-card" + (c.met ? "" : " cdx-dim") + (current === c.id ? " cdx-on" : ""));
      card.type = "button";
      const thumb = el("span", "cdx-thumb");
      thumb.appendChild(scaleUp(panelSprite(c.id, c.met ? "idle" : "sleep", "down", 0), 3));
      card.appendChild(thumb);
      const line = el("span", "cdx-line");
      /* 没遇见过的猫：名字先不给（图鉴的悬念就压在这三个字上）。品种照给 ——
         那是蹲下去看一眼就看得见的东西，藏了反而像漏写。 */
      line.appendChild(el("b", "", c.met ? c.name : "？？？"));
      line.appendChild(el("i", "", "好感 " + c.level + " 级" + (c.breed ? " · " + c.breed : "")));
      card.appendChild(line);
      if (c.follow) card.appendChild(el("em", "cdx-flag", "跟随中"));
      card.addEventListener("click", function () { openDetail(c.id); });
      grid.appendChild(card);
    }
    updateBadge();
  }

  function openDetail(catId) { current = catId; detail.hidden = false; renderGrid(); renderDetail(); }
  function closeDetail() { current = null; detail.hidden = true; renderGrid(); }

  /* 一条数值条。`frac` 取 0…1，超出自动夹住。 */
  function barOf(frac, cls) {
    const bar = el("div", "cdx-bar" + (cls ? " " + cls : "")), fill = el("i");
    fill.style.width = Math.max(0, Math.min(100, Math.round((frac || 0) * 100))) + "%";
    bar.appendChild(fill);
    return bar;
  }

  function renderDetail() {
    if (!current) return;
    const c = cat(current);
    if (!c) return;
    detail.textContent = "";

    const hero = el("div", "cdx-hero");
    [["idle", "站"], ["walk", "走"], ["rub", "蹭"], ["sleep", "睡"]].forEach(function (p) {
      const cell = el("div", "cdx-hero-cell");
      cell.appendChild(scaleUp(panelSprite(c.id, p[0], p[0] === "walk" ? "right" : "down", p[0] === "walk" ? 1 : 0), 4));
      cell.appendChild(el("span", "", p[1]));
      hero.appendChild(cell);
    });
    detail.appendChild(hero);

    const head = el("div", "cdx-h1");
    head.appendChild(el("b", "", c.met ? c.name : "？？？"));
    head.appendChild(el("span", "cdx-tag", c.breed + " · " + c.personality));
    if (!c.met) head.appendChild(el("span", "cdx-tag cdx-warn", "还没遇见过"));
    detail.appendChild(head);
    detail.appendChild(el("p", "cdx-trait", c.met ? c.trait : "走近看看是谁。"));

    const rows = el("dl", "cdx-rows");
    const row = function (k, v) { rows.appendChild(el("dt", "", k)); rows.appendChild(el("dd", "", v)); };
    /* ⚠️ 未遇见时连"在哪儿"一起藏：作息那几行本来就带着地名，只挡「常出没地」
       这一格等于没挡 —— 同一张面板里自己漏自己。时段照给（几点该来蹲是玩法的一部分），
       地点不给。 */
    row("常出没地", c.met ? c.home : "？？？");
    row("这个钟点", c.met ? c.now : "？？？");
    rows.appendChild(el("dt", "", "作息"));
    const dd = el("dd", "");
    for (const s of c.schedule) {
      dd.appendChild(el("div", "cdx-slot", s.from + "–" + s.to + (c.met ? " · " + s.at : "") + (s.nap ? "（午睡）" : "")));
    }
    rows.appendChild(dd);
    detail.appendChild(rows);

    /* 好感度：等级 + 这一级的进度条 + 五个解锁点各自的状态 */
    const aff = el("div", "cdx-aff");
    const title = el("div", "cdx-aff-h");
    title.appendChild(el("b", "", "好感 " + c.level + " 级"));
    title.appendChild(el("span", "", "再 " + Math.max(0, c.xpNeed - c.xpIn) + " 点到下一级（摸一下 +2 / 喂一次 +5）"));
    aff.appendChild(title);
    aff.appendChild(barOf(c.xpIn / c.xpNeed));
    const steps = el("ul", "cdx-steps");
    for (const lv of MILESTONES) {
      steps.appendChild(el("li", c.level >= lv ? "cdx-done" : "",
        "<b>" + lv + " 级</b>" + MILESTONE[lv]));
    }
    aff.appendChild(steps);
    detail.appendChild(aff);

    /* 饱腹 + 当日额度：这两条是"今天还能对它做什么"的账。
       ⚠️ 数字**只许出现在面板里** —— 世界内那几处反馈（气泡 / 轮盘提示）照旧
       "只有动作、没有数字"（交互.md §六），所以玩家在游戏里看到的是
       "猫咪已经饱啦，稍后再喂食吧"，不是 "87/100"。 */
    const stat = el("div", "cdx-aff");
    const fh = el("div", "cdx-aff-h");
    fh.appendChild(el("b", "", "饱腹 " + Math.round(c.full) + " / " + c.fullMax));
    fh.appendChild(el("span", "", c.stuffed ? "已经饱啦，等它消化一会儿再喂" : "喂一次 +" + c.fullFeed + "，装不下下一口时它会拒收"));
    stat.appendChild(fh);
    stat.appendChild(barOf(c.full / c.fullMax, c.stuffed ? "cdx-full cdx-max" : "cdx-full"));
    const dh = el("div", "cdx-aff-h");
    dh.appendChild(el("b", "", "今日好感 +" + c.dayXp + " / " + c.dayXpCap));
    dh.appendChild(el("span", "", "今天摸了 " + c.dayPets + " / " + c.dayPetCap + " 次 · 过了零点重新算"));
    stat.appendChild(dh);
    stat.appendChild(barOf(c.dayXp / c.dayXpCap, c.dayXp >= c.dayXpCap ? "cdx-max" : ""));
    detail.appendChild(stat);

    /* 操作：跟随（10 级）/ 头饰（15 级） */
    const ops = el("div", "cdx-ops");
    const fBtn = el("button", "cdx-btn" + (c.follow ? " cdx-act" : ""), c.follow ? "让它停下" : "让它跟着我");
    fBtn.type = "button";
    if (c.level < UNLOCK.follow) { fBtn.disabled = true; fBtn.title = "好感 " + UNLOCK.follow + " 级解锁"; }
    fBtn.addEventListener("click", function () {
      if (c.follow) stopFollow(current); else setFollow(current);
      renderGrid(); renderDetail();
    });
    ops.appendChild(fBtn);
    if (c.level < UNLOCK.follow) ops.appendChild(el("span", "cdx-hint", "好感 " + UNLOCK.follow + " 级解锁"));
    detail.appendChild(ops);

    if (c.level >= UNLOCK.wear) {
      const box = el("div", "cdx-wear");
      box.appendChild(el("div", "cdx-wear-h", "头饰"));
      for (const w of WEARS) {
        const b = el("button", "cdx-wear-item" + (c.wear === w.id ? " cdx-on" : ""));
        b.type = "button";
        b.appendChild(wearPreview(c.id, w.id, "idle", "down", 0, 3));
        b.appendChild(el("span", "", w.name));
        b.addEventListener("click", function () { setWear(c.id, w.id); });
        box.appendChild(b);
      }
      detail.appendChild(box);
    } else {
      detail.appendChild(el("p", "cdx-lock", "好感 " + UNLOCK.wear + " 级解锁头饰换装（现在 " + c.level + " 级）"));
    }
  }

  function buildUI() {
    const host = document.getElementById("mpRoot") || document.body;
    root = el("div"); root.id = "catDexRoot";
    host.appendChild(root);

    btn = el("button", "cdx-open", "🐱 猫咪图鉴");
    btn.type = "button"; btn.id = "catDexBtn";
    btn.addEventListener("click", togglePanel);
    root.appendChild(btn);

    shade = el("div", "cdx-shade"); shade.hidden = true;
    const panel = el("section", "cdx-panel");
    panel.setAttribute("aria-label", "猫咪图鉴");
    const hd = el("div", "cdx-head");
    hd.appendChild(el("span", "cdx-title", "猫咪图鉴"));
    countEl = el("span", "cdx-count");
    hd.appendChild(countEl);
    const x = el("button", "cdx-x", "×");
    x.type = "button"; x.setAttribute("aria-label", "关闭图鉴");
    x.addEventListener("click", closePanel);
    hd.appendChild(x);
    panel.appendChild(hd);
    grid = el("div", "cdx-grid"); panel.appendChild(grid);
    detail = el("div", "cdx-detail"); detail.hidden = true; panel.appendChild(detail);
    panel.appendChild(el("div", "cdx-foot", "走近猫按 Q 抚摸 / R 喂食，按 G 开轮盘还有叫它、逗它 —— 好感就是这么攒的"));
    shade.appendChild(panel);
    shade.addEventListener("click", function (e) { if (e.target === shade) closePanel(); });
    root.appendChild(shade);

    window.addEventListener("keydown", function (e) {
      if (shade.hidden) return;
      if ((e.key || "") !== "Escape") return;
      if (current) closeDetail(); else closePanel();
    });
  }

  function isOpen() { return !!shade && !shade.hidden; }
  function openPanel(catId) { renderGrid(); shade.hidden = false; if (catId) openDetail(catId); }
  function closePanel() { shade.hidden = true; if (current) closeDetail(); }
  function togglePanel() { isOpen() ? closePanel() : openPanel(); }

  /* ---------------- 10. 装钩子 + 导出 ---------------- */

  function install() {
    buildUI();
    badgeWheel();
    bindHotkeys();

    wrapFn("catMemo", function (orig) {
      return function (catId) {
        const m = orig.call(null, catId);
        const floor = scoreFloor(catId);
        if (!m || (m.importance || 0) >= floor) return m;
        const copy = {};
        for (const k in m) copy[k] = m[k];
        copy.importance = floor;
        return copy;
      };
    });
    wrapFn("catPet", function () { return doPet; });
    wrapFn("catFeed", function () { return doFeed; });
    wrapFn("catFedToday", function () {
      return function (c) {
        const why = feedBlockReason(c);
        if (why) say(why);
        return !!why;                                  // true = 轮盘跳过喂食；那句旧文案会被 say 盖掉
      };
    });
    /* 跟随要把绳子松开：猫跟着玩家跨过半张校园时，领地圆和"出圈就撤回那一步"
       会把它钉在边界上，看着就像"它不肯跟我走"。 */
    wrapFn("catLeash", function (orig) {
      return function (c, tx, ty) { return isFollowed(c) ? { x: tx, y: ty } : orig.call(null, c, tx, ty); };
    });
    wrapFn("catKeepIn", function (orig) {
      return function (c) {
        if (isFollowed(c)) { c.lastX = c.x; c.lastY = c.y; return true; }
        return orig.call(null, c);
      };
    });
    wrapFn("catSprite", function (orig) {
      return function (catId, act, dir, frame) {
        const base = orig.call(null, catId, act, dir, frame);
        let wearId = "none";
        try { wearId = rec(catId).wear; } catch (e) {}
        if (!wearId || wearId === "none") return base;
        return dressSprite(base, catId, dir, act, frame, wearId);
      };
    });
    /* 图鉴"认识"那本账整个换成账号级的实现（§2.0）。
       地图里读它的只有一条链：走近 160px 时 `catCodexSee(id)` 返回 true 就弹
       「图鉴点亮：xxx」。这两个函数都是顶层 function 声明 ⇒ 换得掉，也不用改地图一行。
       返回 false 就不弹，所以第二次贴近同一只猫不会刷屏，这个语义照旧留着。 */
    wrapFn("catCodexLoad", function () {
      return function () {
        const C = codexOf(pid()), out = {};
        for (const id in C) out[id] = C[id];
        return out;
      };
    });
    wrapFn("catCodexSee", function () {
      return function (catId) {
        const first = see(catId);
        /* 当场去灰：列表要重画；要是玩家正翻着这只的详情，名字和地点也得立刻补回来，
           不能等他重新点一次卡片。 */
        if (first) {
          emit("met", { catId: catId });
          if (grid && !shade.hidden) renderGrid();
          if (detail && !detail.hidden && current === catId) renderDetail();
        }
        return first;
      };
    });
    wrapFn("occlTick", function (orig) {
      return function (list, ox, oy, zoom) {
        tick(list);
        return orig.call(null, list, ox, oy, zoom);
      };
    });

    window.MPCatDex = {
      VERSION: VERSION,
      openPanel: openPanel, closePanel: closePanel, togglePanel: togglePanel, isOpen: isOpen,
      cats: cats, cat: cat, wears: function () { return WEARS.map(function (w) { return { id: w.id, name: w.name }; }); },
      level: level, can: can, addXp: addXp, setWear: setWear,
      setFollow: setFollow, stopFollow: stopFollow, followOf: followOf,
      /* 饱腹与当日额度（0…FULL_MAX / 已用点数）：面板和验收脚本都读这两个。 */
      full: function (catId) { load(); const r = rec(catId); return r ? Math.round(fullness(r, Date.now())) : 0; },
      daily: function (catId) {
        load(); const r = rec(catId);
        return r ? { xp: r.dayXp || 0, xpCap: DAY_XP_CAP, pets: r.dayPets || 0, petCap: DAY_PET_CAP,
                     full: Math.round(fullness(r, Date.now())), fullMax: FULL_MAX, fullFeed: FULL_FEED,
                     stuffed: isStuffed(r, Date.now()), day: data.day } : null;
      },
      on: on,
      /* 当前账号身份（`mp:昵称` / `local:玩家id`）：排查"进度怎么串到别人号上"用的。
         顺手把 §2.0 那层 300ms 缓存作废，验收脚本改完 localStorage 再读要拿到新值。 */
      account: function () { acctAt = 0; return pid(); },
      /* 验收脚本用的只读快照（和项目里 _wheelOpen / _catwheel 那类自证出口同一口径）。 */
      _state: function () { load(); return JSON.parse(JSON.stringify(data.rec)); }
    };
  }

  try { install(); }
  catch (e) { console.warn("[cat-dex] 挂钩子失败，图鉴按钮不可用", e); }
})();
