/* =========================================================
   猫宠 · CatAgent 行为 —— 作息 / 领地游走 / 好感记忆 / 档位判定
   ---------------------------------------------------------
   模块名照 `概要说明书\配图说明\绘图人一\图1-10_猫宠好感与互动类图.txt`：
     TerritoryRoam · ScheduleReader · TierMapper · AffinityMemory ·
     ReactionTable · Codex · CatAgent（本段）+ CatSprite（75 段）

   ⚠️⚠️ **判定段一行网络/LLM/随机数都没有**（图 1-11 的硬约束，§5.1 末句）。
      六档是一张确定的映射表，每帧现查现算；`makeRng` 只在**加载期**跑一次
      生成巡游路点（确定性，同一 seed 每次刷新同一条路），运行期一次不跑。

   ⚠️ 记忆不是新系统（§6.1「好感度就是记忆系统里的一条记录」）——
      这里就是把那条记录用 localStorage 兜住：复合键 `(playerId, catId, source)`
      **upsert 一条**，不 append。查询永远 O(1)，不随历史增长。
   ========================================================= */

/* --- 7.7.1 时钟（ScheduleReader）--------------------------------------
   ⚠️ 地图本体此前**没有任何时间层**（全项目搜 `new Date|getHours` 零命中）。
      §八 第 3 步说「复用 §11 已有的 20 行」—— 那 20 行在另一条线（`laoding`）里，
      这里按同款口径补一份最小的：读真实时钟 + 一个可拨的调试覆盖。
   ⚠️ `day` 永远取**真实日期**，不受覆盖影响 —— 验收第 6 条「站原地连点 20 次
      只算一次」靠的就是它，拨时间不能把冷却也一起拨掉。 */
let catTimeOverride = null;                 // "HH:MM"；null = 走真实时钟
function catNow() {
  const d = new Date();
  let h = d.getHours(), m = d.getMinutes();
  if (catTimeOverride) {
    const p = String(catTimeOverride).split(":");
    h = (parseInt(p[0], 10) || 0) % 24;
    m = (parseInt(p[1], 10) || 0) % 60;
  }
  return {
    h: h, m: m, mins: h * 60 + m, t: d.getTime(),
    day: d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()
  };
}
function catHM(s) {                          // "08:30" → 510
  const p = String(s).split(":");
  return ((parseInt(p[0], 10) || 0) % 24) * 60 + ((parseInt(p[1], 10) || 0) % 60);
}
/* 当前落在作息表的哪一段。跨零点的段（from > to）走 `||` 那一支。 */
function catSlot(cfg, mins) {
  for (const s of cfg.schedule) {
    const a = catHM(s.from), b = catHM(s.to);
    const inRange = (a <= b) ? (mins >= a && mins < b) : (mins >= a || mins < b);
    if (inRange) return s;
  }
  return null;
}

/* --- 7.7.2 好感记忆（AffinityMemory）----------------------------------
   §6.2 一条记录 = {desc, time, importance, visibility, playerId, source}
     importance = 当前好感 0–100 ／ time = 最后一次喂的时间
   §6.3 惰性衰减：读的时候才算，不回写。
   §6.4 铁律：喂食**先结清衰减，再累加**，最后推时间戳。顺序写反 = 隔月回来分数虚高。 */
const CAT_LS_MEM   = "pixelcampus.cat_affinity";
const CAT_LS_PID   = "pixelcampus.pid";
const CAT_LS_CODEX = "pixelcampus.cat_codex";
const CAT_WEEK_MS  = 7 * 24 * 3600 * 1000;

/* 喂一次 +多少 / 一周掉多少。⚠️ 这两个数**一起**决定节奏，改一个必须想另一个：
     熟→亲近 要在 60 分，`CAT_GAIN=12` ⇒ 大橘每天喂，第 5 天到「亲近」，
     途中逐档经过 陌生/眼熟/眼熟/熟（**验收第 2 条要求不跳档**）；
     `CAT_DECAY_WEEK=8` ⇒ 停两周 −16，从亲近(60~79)掉回「熟」，**但不归零**
     （**验收第 3 条**）。每周喂 1 次 = +12−8 = 净 +4，符合 §7.4「每周 1~2 次维持」。 */
const CAT_GAIN = 12;
const CAT_DECAY_WEEK = 8;
const CAT_GAIN_MUL = { fast: 1.25, mid: 1.0, slow: 0.7 };   // §4.3 的脾气

function catPid() {
  try {
    let p = localStorage.getItem(CAT_LS_PID);
    if (!p) { p = "p" + Date.now().toString(36); localStorage.setItem(CAT_LS_PID, p); }
    return p;
  } catch (e) { return "anon"; }
}
function catLedger() {
  try { return JSON.parse(localStorage.getItem(CAT_LS_MEM) || "{}") || {}; }
  catch (e) { return {}; }
}
function catLedgerSave(L) {
  try { localStorage.setItem(CAT_LS_MEM, JSON.stringify(L)); } catch (e) {}
}
/* upsert：有则取回，无则建一条。**永远只有一条**（§6.2 的关键区别）。
   ⚠️ 返回的是**账本里的那个对象**，改完必须 `catLedgerSave` 写回 —— 因为
      `catLedger()` 每次都是**重新 JSON.parse**，拿到的是新对象，改它不会自动落盘。 */
function catRec(L, catId) {
  const k = catPid() + "|" + catId;
  if (!L[k]) L[k] = {
    desc: "对 " + catId + " 的好感", time: catNow().t,
    importance: 0, visibility: "private", playerId: catPid(),
    source: "cat_affinity", catId: catId, lastDay: ""
  };
  return L[k];
}
function catMemo(catId) { return catRec(catLedger(), catId); }
/* 惰性衰减（§6.3）：`weeks` 按整周向下取整，读时算、不回写。 */
function catEffective(memo, nowMs) {
  const weeks = Math.floor(Math.max(0, nowMs - memo.time) / CAT_WEEK_MS);
  return Math.max((memo.importance || 0) - weeks * CAT_DECAY_WEEK, 0);
}

/* --- 7.7.3 档位（TierMapper / ReactionTable）-------------------------- */
/* 0–100 → 档位下标。纯函数，无副作用。 */
function catTierOf(score) {
  const s = Math.max(0, Math.min(100, score));
  for (let i = CAT_TIERS.length - 1; i >= 0; i--) if (s >= CAT_TIERS[i].lo) return i;
  return 0;
}

/* --- 7.7.4 图鉴（Codex）-----------------------------------------------
   §2.3：认识一只点亮一格，**四格互不覆盖**（一人一个键）。
   §6.5：只记"认识了"，不记"多熟" —— 所以这里只存布尔。 */
function catCodexLoad() {
  try { return JSON.parse(localStorage.getItem(CAT_LS_CODEX) || "{}") || {}; }
  catch (e) { return {}; }
}
function catCodexSee(catId) {
  const C = catCodexLoad();
  if (C[catId]) return false;
  C[catId] = 1;
  try { localStorage.setItem(CAT_LS_CODEX, JSON.stringify(C)); } catch (e) {}
  return true;
}

/* --- 7.7.5 队伍状态（CatAgent）--------------------------------------- */
const CAT_TOUCH_R = 30;      // §5.2「亲近档 30px 内可摸」—— **摸**的半径
/* 喂的半径：§7.2 第 1 步「玩家走到猫旁边（**档位允许的距离内**）」的直译 ——
   取该档自己的触发距离，**上界压到 120**。
   ⚠️⚠️ 这一条是"六档能爬上去"的**唯一通路**，别当调参随手改：
      陌生档的猫 120px 内就跑，若"喂"也要 30px，玩家**永远靠不近它** ⇒
      好感永远停在 0 ⇒ 验收第 2 条（连续喂，从陌生到亲近）**直接不成立**。
      ⇒ 陌生档用 120px：把食物扔过去，它停下吃一口再跑。
   上界为什么是 120：比这更远的"伸手"不像喂猫。很亲(200)/最亲(9999) 那两个数
   是**猫自己走过来**的距离，不是人的臂长，照抄会让按钮满屏都能点。
   ⚠️ 读的是 `c.tier`（catTick 每帧刷），不是现算记忆 —— 这个函数 UI 每帧都要问。 */
/* ⚠️【第四十四轮改动】上界 120 → **160**。原来压到 120 是因为"喂"只能做到
   "隔空扔一口"（超出手臂长度就不像喂猫了）。现在有了 `comeTo`（猫**自己走过来**吃），
   喂的语义变成了**真喂流浪猫**：你蹲下把粮放在脚前、退开，猫自己过来 —— 半径自然可以放宽。
   放宽只会让"六档能爬上去"这条通路**更好走**，不会破坏它。 */
const CAT_FEED_R_MAX = 160;
function catFeedR(c) {
  if (!c || !CAT_TIERS[c.tier]) return CAT_FEED_R_MAX;
  return Math.min(CAT_TIERS[c.tier].dist, CAT_FEED_R_MAX);
}

const CAT_ROAM_SCALE = 3;    // §4.2 的 speed:8 是**真实猫速**（0.89 m/s）。
                             // 玩家在这是 94px/s，照实数走猫几乎不动 ⇒ 乘 3 取游戏手感。
const CAT_STRIDE = 26;       // 走一格相位所需的世界像素（人 160，猫小一半多）
/* ⚠️ `follow` 第四十四轮由 1.6 提到 2.4（文档没钉这个倍率，只说很亲档的
   `approach_follow`「复用 walk 帧、速度与时间预算不同」）。为什么非提不可：
   `comeTo` 让猫从最远 `CAT_REACH_R` = 120px 处朝玩家走，1.6 倍时是 38.4px/s
   ⇒ 要 3.1 秒才到，比玩家蹲下的 2.6 秒还长 —— 猫刚蹭上来，人已经站起来了。
   2.4 倍是 57.6px/s ⇒ 120px 走 2.1 秒，落在蹲姿里。 */
const CAT_SPEED = { roam: 1, flee: 4, follow: 2.4, rub: 1.6 };   // 倍率
const CAT_HOLD_HZ = 3;       // 摸/喂/退这类**被锁住的**动作的帧速。
                             // ⚠️ 不能用待机的 IDLE_HZ=0.4：那样 `eat` 的 2.4 秒里
                             //    3 帧只翻到第 0 帧（第 0.4Hz 是 2.5 秒一帧），
                             //    画了 3 帧的咀嚼看起来是一张静止图 —— 等于白画。

const CATS = CAT_AGENTS.map(function (cfg) {
  const S = CAT_SPOTS[cfg.home] || { x: WORLD_W / 2, y: WORLD_H / 2 };
  return {
    cfg: cfg, homeKey: cfg.home, spot: S,
    x: S.x, y: S.y, dir: "down",
    act: "idle", frame: 0, walk: 0, idle: 0,
    active: false, nap: false,
    wp: null, wpi: 0, stuck: 0, moved: 0, lastX: S.x, lastY: S.y,
    tier: 0, score: 0, seen: false, holdAct: "", holdT: 0,
    comeTo: null            // 【第四十四轮】"走到某点去做某事"的请求（见 catTick）
  };
});
const CAT_BY_ID = Object.create(null);
for (const c of CATS) CAT_BY_ID[c.cfg.id] = c;

/* 巡游路点：**加载期**用确定性 RNG 生成一串（同 `makeRng` 的口径）。
   ⚠️ 运行期不再掷 —— §5.1 末句「没有随机数」管的是判定段，这里一次生成完就固定。 */
(function catRoute() {
  for (const c of CATS) {
    const rng = makeRng(c.cfg.seed), R = c.cfg.roam.radius, out = [];
    for (let i = 0; i < 12; i++) {
      const a = rng() * Math.PI * 2, r = Math.sqrt(rng()) * R * 0.8;
      /* y 压 0.7：3/4 视角下纵向本来就被压扁，不压的话巡游范围看着比横向大一圈 */
      out.push({ x: c.spot.x + Math.cos(a) * r, y: c.spot.y + Math.sin(a) * r * 0.7 });
    }
    c.wp = out;
  }
})();

/* --- 7.7.6 移动（TerritoryRoam）---------------------------------------
   ⚠️ 谓词与 `ensureWalkGrid()` / `guideWalkToward` **逐字同一对**
      （`canWalk && !blocked`）：换成 `ptBlocked` 会宽 1px，猫会沿墙磨到永远出不去。
   ⚠️ 目标点先过 `catLeash` 夹到领地圆内；走完再硬夹一次 —— 验收第 7 条
      「长时间观察，猫始终在 radius 内」靠的就是这两道。 */
function catLeash(c, tx, ty) {
  const h = c.spot, R = c.cfg.roam.radius;
  const dx = tx - h.x, dy = ty - h.y, d = Math.hypot(dx, dy);
  if (d <= R) return { x: tx, y: ty };
  return { x: h.x + dx / d * R, y: h.y + dy / d * R };
}
function catStep(c, tx, ty, dt, speed) {
  const dx = tx - c.x, dy = ty - c.y, d = Math.hypot(dx, dy);
  if (d < 0.6) return 0;
  const ux = dx / d, uy = dy / d, s = speed * dt;
  const nx = c.x + ux * s, ny = c.y + uy * s;
  let moved = 0;
  if (canWalk(nx, c.y) && !blocked(nx, c.y)) { moved += Math.abs(nx - c.x); c.x = nx; }
  if (canWalk(c.x, ny) && !blocked(c.x, ny)) { moved += Math.abs(ny - c.y); c.y = ny; }
  /* 朝向取**移动方向**（同补丁 14 的判据：斜向取侧视）。
     用 ux/uy 而不是实际位移 —— 贴墙滑的时候实际位移会缩成单轴，用它猫会扭头盯墙。 */
  if (moved > 0.01) c.dir = (Math.abs(ux) >= Math.abs(uy)) ? (ux < 0 ? "left" : "right")
                                                          : (uy < 0 ? "up" : "down");
  return moved;
}
/* 顶出领地就把这一步撤回来（硬夹）。撤回而不是瞬移，视觉上只是"停下不走"。 */
function catKeepIn(c) {
  const h = c.spot, R = c.cfg.roam.radius;
  if (Math.hypot(c.x - h.x, c.y - h.y) > R) {
    c.x = c.lastX; c.y = c.lastY;
    return false;
  }
  return true;
}

/* 相位推进：走 → 按**实际位移**推进（顶墙那几帧位移 0 ⇒ 脚立刻停，不空踏）；
   站 → 按 hz 呼吸/摆动。与主循环里玩家那两行同款。
   ⚠️ `hz` 不传 = 待机的 IDLE_HZ（呼吸）。被锁住的交互动作传 CAT_HOLD_HZ ——
      见那条常量的注释（0.4Hz 会把 3 帧的吃食压成一帧静止图）。 */
function catPhase(c, dt, moved, hz) {
  if (moved > 0.01) {
    c.walk += moved; c.idle = 0;
    c.frame = Math.floor(c.walk / CAT_STRIDE) & 3;
  } else {
    c.idle += dt;
    const n = CAT_ACTS[c.act] || 2;
    c.frame = ((c.idle * (hz || IDLE_HZ)) | 0) % n;
  }
}

/* --- 7.7.7 交互（阶段 4 的轮盘 / DOM 按钮调这几个）------------------- */
/* 站在哪只猫旁边（**摸**得着）。返回 null = 附近没猫。
   ⚠️ 半径是 30（§5.2「亲近档 30px 内可摸」），**不是** `catFeedR` —— 两个半径
      不一样的：摸要贴脸，喂可以隔一段扔过去（见 CAT_FEED_R_MAX 的注释）。
   ⚠️ 「熟」档也在内 —— §5.2 熟「可走到 30px，按摸 → 退」，
      正是"不让摸"那个档的可见差异（验收第 2 条要它出现）。 */
function catNear() {
  let best = null, bd = CAT_TOUCH_R * CAT_TOUCH_R;
  for (const c of CATS) {
    if (!c.active) continue;
    const d2 = (player.x - c.x) ** 2 + (player.y - c.y) ** 2;
    if (d2 <= bd) { bd = d2; best = c; }
  }
  return best;
}
/* ⚠️⚠️ 轮盘的**交互半径**，与 `CAT_TOUCH_R`（=30，§5.2「亲近档 30px 内可摸」）是
   **两件事**，别合并：
     · `CAT_TOUCH_R` 是**猫的忍受带** —— 猫允许你靠到多近还不跑（由档位决定，`CAT_TIERS[].dist`）。
     · `CAT_REACH_R` 是**你能开口的距离** —— 走到这个圈里就能按 G 对猫说话。
   为什么非要分开：原地用的 30px 是老 play 页的「站在猫旁边按 F」。
   轮盘要的是用户 2026-10-09 逐字提的效果 ——「猫应该**自己靠过来**蹭我腿」。
   若沿用 30px，玩家非得贴到猫脸上才能触发，猫最多挪半步（30→20），
   等于把"猫走过来"又做回"猫原地动一下" —— 那正是这次要修的病。
   有了 `comeTo`（猫真的位移），半径必须给够，效果才读得出来。 */
const CAT_REACH_R = 120;
/* 交互的**统一入口**：轮盘四格都问它 —— 就近挑一只。
   ⚠️ 取 `max(CAT_REACH_R, catFeedR(c))`：喂的半径按猫自己档位算（很亲/最亲到 160），
      不能被 120 压回去。 */
function catTarget() {
  let best = null, bd = 1e9;
  for (const c of CATS) {
    if (!c.active) continue;
    const d = Math.hypot(player.x - c.x, player.y - c.y);
    if (d <= Math.max(CAT_REACH_R, catFeedR(c)) && d < bd) { bd = d; best = c; }
  }
  return best;
}
/* 喂得着的猫（各按**自己档位**的半径）。UI 弹「喂」按钮用它。 */
function catFeedTarget() {
  let best = null, bd = 1e9;
  for (const c of CATS) {
    if (!c.active) continue;
    const d = Math.hypot(player.x - c.x, player.y - c.y);
    if (d <= catFeedR(c) && d < bd) { bd = d; best = c; }
  }
  return best;
}
/* 能不能"摸"（猫不会当场退开）：亲近及以上。 */
function catCanPet(c) { return !!c && c.tier >= 3; }
/* 今天喂过没（按**真实日期**）。 */
function catFedToday(c) {
  if (!c) return false;
  return catMemo(c.cfg.id).lastDay === catNow().day;
}
/* 播一段**锁住的**动作：锁没走完之前，档位逻辑不许把它顶掉。
   ⚠️ 没有这把锁，摸/喂的反应只活一帧 —— 下一帧就被 `rule.act` 覆盖成 idle/walk，
      玩家看到的是"猫抖了一下"，不是"猫蹭你"。
   ⚠️⚠️ **锁期间猫是钉在原地的**（`catTick` 那条 `catPhase(c, dt, 0, …)`）——
      所以"让猫走过来"这类动作**绝不能走这里**，必须用 `c.comeTo`。 */
function catPlay(c, act, holdSec) {
  c.holdAct = act; c.holdT = holdSec || 1.5;
  c.act = act; c.frame = 0; c.idle = 0;
  return c;
}

/* --- 猫粮（第四十四轮）-------------------------------------------------
   ⚠️ **不是道具 / 不进背包 / 不计数**（§7.3 的三条排除一条不动）：它是一次性的
      **世界表现** —— 蹲下 → 地上一小堆 → 猫走过来吃掉 → 到点消失。
   ⚠️ 绝不进 `props`、绝不调 `addSolid`：前者会被 60 段白名单式的 `clear*` 删掉、
      还会让 `_propdiff.py` 报假差异；后者**会重掷全校园的 scatter**（物种种子地雷）。
      所以它只活在 `CAT_FOOD` 这个变量里，由 drawList 每帧现画。 */
const CAT_FOOD_TTL = 12000;      // 兜底：放下之后最多躺多久（毫秒）——猫没来也得收走
/* 猫走到粮跟前、**低头开吃**之后，粮再留多久（毫秒）—— 第四十四轮补。
   ⚠️ 粮的消失**跟"吃完"走，不跟"放下多久"走**：猫到达那一刻把 `until` 改写成
      `now + CAT_EAT_MS`，所以画面永远是"猫埋头吃 → 粮没了"，
      不会是"猫还在啃，粮先没了"或"粮躺在那儿，猫早走了"。 */
const CAT_EAT_MS = 4500;
/* 猫**停在离粮多远**开吃（像素）。⚠️ 这个数不是随手取的，它要补偿**头相对于锚点的偏移**：
     侧视（left/right）头在锚点**前方 ~5px**、俯视/背视（down/up）头在锚点**正上方**。
     取 5 ⇒ 侧视时嘴正好落在粮堆中心，正视时嘴压在粮堆靠自己那一半。
     原来写 14 ⇒ 猫停在**半个身子之外**低头，画面是"对着空气啃"（用户 2026-10-09 报的就是这个）。 */
const CAT_EAT_STOP = 5;
let CAT_FOOD = null;             // {x, y, until} —— `until` 是**绝对毫秒**，不是倒计时
let _foodSpr = null;
function catFoodSprite() {
  if (_foodSpr) return _foodSpr;
  const W = 9, H = 6, c = mkCanvas(W, H), g = c.getContext("2d");
  /* 一小堆干粮：底下两粒、顶上一粒（读作"堆"而不是"砖"） */
  px(g, 1, 3, 3, 2, "#8a5a2c");
  px(g, 5, 3, 3, 2, "#8a5a2c");
  px(g, 3, 2, 3, 2, "#a9743c");
  px(g, 2, 3, 1, 1, "#c08a4c");                 // 受光面（光自左上）
  px(g, 6, 3, 1, 1, "#c08a4c");
  px(g, 4, 2, 1, 1, "#c08a4c");
  outlineSprite(c, 0.5);                        // 与猫/人同一条工艺：先描边
  _foodSpr = c;
  return c;
}
/* 放粮 + 叫猫过来。粮落在**玩家脚前**一格（"我放下的"），不是猫跟前。
   ⚠️ 脚前那一格要是**墙里**（面朝墙蹲下），就退回落点 = 玩家脚下 —— 玩家站的地方
      一定可走，猫就一定够得着。否则粮落在墙里、猫永远走不到，只能干等到 ttl 过期，
      玩家看到的是"猫对着一堵墙发呆"。 */
function catDropFood(c) {
  const dx = player.dir === "left" ? -1 : (player.dir === "right" ? 1 : 0);
  const dy = player.dir === "up" ? -1 : (player.dir === "down" ? 1 : 0);
  let fx = player.x + dx * 16, fy = player.y + dy * 16;
  if (!canWalk(fx, fy) || blocked(fx, fy)) { fx = player.x; fy = player.y; }
  CAT_FOOD = { x: fx, y: fy, until: catNow().t + CAT_FOOD_TTL };
  /* 猫**自己走过来**吃（`CAT_EAT_STOP`：一直走到**嘴够得着粮**才停）。
     ⛔ 不走 `catPlay` —— 那条路会立 holdT 锁，锁期间猫原地不动（本轮要修的正是这个）。
     ⚠️ `until` 这里给的是**兜底**（12 秒）；猫真到了跟前，`catTick` 会把它改写成
        `now + CAT_EAT_MS`，于是"吃完"和"粮消失"是同一个时刻。 */
  if (c) c.comeTo = { x: fx, y: fy, act: "eat", stop: CAT_EAT_STOP,
                      until: catNow().t + CAT_FOOD_TTL, arrived: false };
}

/* 摸：熟及以下 → 退（**不涨分**）；亲近及以上 → **走过来蹭你**。
   §10 明说「喂食以外的涨分途径」是第二阶段的活 ⇒ 这里一分不加。
   ⚠️ 档位**现算**（从账本），不信 `c.tier`：那是个每帧被 catTick 刷新的缓存，
      探针 / 未来别的调用方不一定刚跑过 catTick。喂食同理 —— 这两个是对外的
      入口函数，各自站得住。
   ⚠️⚠️【第四十四轮】原先这一支是 `catPlay(c, "rub", 1.6)` —— **那是错的**：
      它立了 holdT 锁，而锁期间 `catTick` 让猫一动不动，于是猫只在原地播 `rub`
      的那两帧，而那两帧**只差头整体 1px**（75 段 `hoff = rb + sw`）。
      玩家看到的就是"猫自己动了一下头"。现在改成 `comeTo`：**猫真的走过来**。 */
function catPet(c) {
  if (!c) return false;
  const t = catTierOf(catEffective(catMemo(c.cfg.id), catNow().t));
  c.tier = t;
  if (t <= 2) { catPlay(c, "retreat", 1.2); return false; }   // 熟及以下：不理你，退开
  c.comeTo = { x: player.x, y: player.y, act: "rub", stop: 20, until: catNow().t + 8000 };
  return true;
}
/* 叫它：**六档都抬头**（§2.4「喊一声，猫抬头看你」）—— 最轻的一档互动，谁都应一声。
   亲近及以上**走近两步**（stop=90：走到你附近就停，不贴脸）。 */
function catCall(c) {
  if (!c) return false;
  const t = catTierOf(catEffective(catMemo(c.cfg.id), catNow().t));
  c.tier = t;
  if (t >= 3) c.comeTo = { x: player.x, y: player.y, act: "look", stop: 90, until: catNow().t + 8000 };
  else catPlay(c, "look", 1.6);
  return true;
}
/* 逗它：**熟及以上才会扑**（§7.5.4 的收口口径），生档只抬眼看你一眼 —— 不扑，也不跑。
   这是原地动作，用 `catPlay` 的锁正合适（猫本来就不该边被逗边乱走）。 */
function catTease(c) {
  if (!c) return false;
  const t = catTierOf(catEffective(catMemo(c.cfg.id), catNow().t));
  c.tier = t;
  catPlay(c, t >= 2 ? "play" : "look", 2.4);
  return true;
}
/* 喂：§7.2 的整套 —— **先结清再累加** → 推时间戳 → 冷却（每天一次）→ 放粮 → 猫过来吃。
   返回 "ok" | "cold" | "none"。
   ⚠️⚠️ **喂不分档位**。§7.5.4 的收口表里"不让摸"只挂在**熟**档的**摸**上
      （`idle`（按摸则 `retreat`））；喂是 §10 里唯一的涨分途径，六档全靠它爬。
      在这儿加一条 `tier <= N ⇒ 喂不动`，等于把阶梯从底下锯断 ——
      验收第 2 条（连续喂，从陌生到亲近）会**永远失败**，而页面看着完全正常。
      距离门槛在 UI 那边（`catFeedTarget()` 用 `catFeedR(c)`），不在这里。 */
function catFeed(c) {
  if (!c) return "none";
  const L = catLedger(), memo = catRec(L, c.cfg.id), now = catNow();
  const cur = catEffective(memo, now.t);                       // ① 先结清衰减
  if (memo.lastDay === now.day) return "cold";                 // 冷却按**真实日期**
  const gain = CAT_GAIN * (CAT_GAIN_MUL[c.cfg.temperament.warmup] || 1);
  memo.importance = Math.min(100, cur + gain);                 // ② 再累加这一次
  memo.time = now.t;                                           // ③ 时间戳推到当前
  memo.lastDay = now.day;
  catLedgerSave(L);                                            // 一次读、一次写
  c.score = memo.importance;
  c.tier = catTierOf(c.score);
  catDropFood(c);                                              // ④ 放粮 + 叫它过来（不再 catPlay 锁原地）
  return "ok";
}

/* --- 7.7.8 每帧心跳：由 build.py 补丁 22 挂在 `guideTick(dt)` 之后 ------
   ⚠️ 任何分支都不许抛（抛一次主循环就死）。
   ⚠️ 猫不活跃（作息槽位是 `at:null`）时**立刻早退**，连精灵都不取。
      **第四十四轮之后四张作息表里已经没有 `null` 了**（猫全天都在，见 76 段的注释），
      所以这条早退现在永远不触发 —— 留着是给以后真要加"某天不出现"留的口子。 */
function catTick(dt) {
  const now = catNow();
  /* 粮到点自己消失（一次性表现，不是道具 —— 见 catDropFood 的注释）。
     ⚠️ 放在循环**外**：全局只有一个，不是每只猫一份。 */
  if (CAT_FOOD && now.t > CAT_FOOD.until) CAT_FOOD = null;
  for (const c of CATS) {
    const slot = catSlot(c.cfg, now.mins);
    c.active = !!(slot && slot.at);
    if (!c.active) { c.nap = false; continue; }

    /* 换领地：直接**落位**，不跨校园走过去。
       ⚠️ 这是有意的：照 `at` 换点意味着横穿半个校园，中途要过路口/绕楼，
          走错一次就永远卡在某个角上（而猫不在画面里，没人看得出来）。
          猫本来就是"不知道什么时候就挪窝了"，瞬移比卡住好。 */
    if (c.homeKey !== slot.at) {
      const S = CAT_SPOTS[slot.at];
      if (S) { c.spot = S; c.homeKey = slot.at; c.x = S.x; c.y = S.y; c.wpi = 0; c.stuck = 0; }
    }
    c.nap = !!slot.nap;

    /* 有效分 → 档位（惰性衰减后的，读一次算一次） */
    const memo = catMemo(c.cfg.id);
    c.score = catEffective(memo, now.t);
    c.tier = catTierOf(c.score);
    const rule = c.cfg.reactions[CAT_TIERS[c.tier].name];

    /* 图鉴：第一次靠到 160px 就算"认识"（§2.3 只记认识了，不记多熟） */
    const d = Math.hypot(player.x - c.x, player.y - c.y);
    if (!c.seen && d < 160) {
      c.seen = true;
      if (catCodexSee(c.cfg.id) && typeof guideToast === "function")
        guideToast("图鉴点亮：" + c.cfg.name + "（" + CAT_TIERS[c.tier].name + "）");
    }

    c.lastX = c.x; c.lastY = c.y;
    let moved = 0;
    const spd = c.cfg.roam.speed * CAT_ROAM_SCALE;

    /* 交互动作有锁（摸/喂/退）：锁没走完，档位逻辑不许顶掉它，猫也站着不动。
       ⚠️ 这条必须在下面那个 `d < rule.dist` 之前 —— 放后面等于没锁。 */
    if (c.holdT > 0) { c.holdT -= dt; c.act = c.holdAct; catPhase(c, dt, 0, CAT_HOLD_HZ); continue; }

    /* 【第四十四轮】"走过来做事"的请求：轮盘按下去之后，**猫自己走过来**。
       ⚠️ 必须在档位逻辑**之前** —— 否则陌生档的 `flee` 会把它顶掉，猫永远走不到你跟前。
       ⚠️ 目标点**仍然过 `catLeash`**：猫最多走到领地边缘 ⇒ 验收第 7 条「不出圈」
          **自动保住**，不需要任何"出圈旁路"。玩家站在领地外看到的是
          "猫朝你走过来、停在边界" —— 这正是猫该有的样子。
       ⚠️ 到位后直接赋 `c.act`（**不经过 `catPlay`**）：catPlay 会立 holdT 锁，
          而锁期间猫是钉住的，那样"走到位再蹭/吃"会退化成"原地抽搐"——本轮修的就是这个。 */
    if (c.comeTo) {
      const ct = c.comeTo;
      const t = catLeash(c, ct.x, ct.y);
      if (Math.hypot(t.x - c.x, t.y - c.y) > (ct.stop || 20)) {
        moved = catStep(c, t.x, t.y, dt, spd * CAT_SPEED.follow);
        c.act = "walk";
      } else {
        c.act = ct.act || "idle";                  // 到位 → 蹭 / 吃 / 抬头
        /* ★ 第四十四轮：**刚到**的那一刻，把"粮还能躺多久"改写成"够它吃完"。
           ⚠️ 必须在下面那条 `now.t > ct.until` **之前** —— 它改的就是 `ct.until`。
           这样画面严格是「猫埋头吃 → 粮没了」，而不是两个时钟各跑各的：
           粮的 ttl 只当"猫一直没来"的兜底。 */
        if (!ct.arrived) {
          ct.arrived = true;
          /* ★ 到位立刻**转头面对目标**。
             ⚠️ 少了这一步，就有一种现场：**粮正好落在猫脚边**（玩家贴着猫蹲下放粮），
                猫一步没走 ⇒ 朝向还停在原地 ⇒ 低头成了"头朝着别处啃空气"。
                猫的朝向**只在 `catStep` 里按移动方向刷新**，站着不动时没人会去改它。
             ⚠️ 对 `rub` / `look` 同样成立：目标点就是玩家，转头＝"面向你蹭 / 抬头看你"。 */
          const adx = ct.x - c.x, ady = ct.y - c.y;
          if (Math.hypot(adx, ady) > 0.5)
            c.dir = (Math.abs(adx) >= Math.abs(ady)) ? (adx < 0 ? "left" : "right")
                                                     : (ady < 0 ? "up" : "down");
          if (ct.act === "eat") {
            ct.until = now.t + CAT_EAT_MS;
            if (CAT_FOOD) CAT_FOOD.until = ct.until;
          }
        }
      }
      if (now.t > ct.until) c.comeTo = null;       // 超时放弃（玩家早走了）
      if (moved > 0.01) catKeepIn(c);
      catPhase(c, dt, moved, CAT_HOLD_HZ);
      continue;
    }

    if (c.nap) {                                   // 作息里的午睡段：原地团着
      c.act = "sleep"; catPhase(c, dt, 0); continue;
    }

    if (d < rule.dist) {
      /* --- 六档行为（§5.2 那张表）--- */
      const ang = Math.atan2(c.y - player.y, c.x - player.x);
      if (rule.act === "flee") {                   // 陌生：**背向你**跑
        const t = catLeash(c, c.x + Math.cos(ang) * 60, c.y + Math.sin(ang) * 60);
        moved = catStep(c, t.x, t.y, dt, spd * CAT_SPEED.flee);
        c.act = "flee";
      } else if (rule.act === "retreat") {         // 眼熟：**面向你**倒退
        const t = catLeash(c, c.x + Math.cos(ang) * 40, c.y + Math.sin(ang) * 40);
        const bx = c.x, by = c.y, bd = c.dir;
        moved = catStep(c, t.x, t.y, dt, spd * CAT_SPEED.roam * 1.4);
        c.dir = bd;                                // 动作是"退"，朝向必须留在玩家那边
        if (moved > 0.01) c.dir = (Math.abs(player.x - bx) >= Math.abs(player.y - by))
          ? (player.x < bx ? "left" : "right") : (player.y < by ? "up" : "down");
        c.act = "retreat";
      } else if (rule.act === "rub") {             // 亲近：绕到你脚边
        const t = catLeash(c, player.x, player.y);
        if (Math.hypot(t.x - c.x, t.y - c.y) > 22) moved = catStep(c, t.x, t.y, dt, spd * CAT_SPEED.rub);
        c.act = "rub";
      } else if (rule.act === "walk") {            // 很亲：跟着你走一段
        const t = catLeash(c, player.x, player.y);
        if (Math.hypot(t.x - c.x, t.y - c.y) > 30) moved = catStep(c, t.x, t.y, dt, spd * CAT_SPEED.follow);
        c.act = "walk";
      } else if (rule.act === "wait") {            // 最亲：在你常出现的地方等你
        const h = c.spot;
        if (Math.hypot(h.x - c.x, h.y - c.y) > 8) moved = catStep(c, h.x, h.y, dt, spd * CAT_SPEED.follow);
        c.act = "wait";
      } else {                                     // 熟：停下，但不让摸
        c.act = "idle";
      }
    } else {
      /* --- 距离之外：回到自己的日子（领地内游走）--- */
      const w = c.wp[c.wpi];
      const t = catLeash(c, w.x, w.y);
      moved = catStep(c, t.x, t.y, dt, spd);
      c.stuck = (moved > 0.01) ? 0 : c.stuck + dt;
      if (Math.hypot(t.x - c.x, t.y - c.y) < 8 || c.stuck > 1.2) {
        c.wpi = (c.wpi + 1) % c.wp.length; c.stuck = 0;
      }
      c.act = "walk";
    }

    if (moved > 0.01) catKeepIn(c);                // 硬夹：绝不越出领地
    catPhase(c, dt, moved);
  }
}
