/* =========================================================
   猫宠 · CatAgent 数据 —— 四只猫的配置 / 档位表 / 领地站位
   ---------------------------------------------------------
   口径全部来自 `mvp范围功能\猫宠.md`：
     · §4.2 猫的配置 JSON（id / name / home / roam / schedule /
            temperament / reactions）
     · §4.3 四只猫（大橘 食堂后门 · 馆长 图书馆台阶 ·
            芝麻 明湖南岸影壁 · 狸花 思源楼草坪）
     · §5.2 档位 → 分数区间 + 触发距离
     · §7.5.4 档位 → 动作（收口表）

   ⚠️ 这里**只有数据**，行为在 77_cat_ai.js。分两片是照 §4.1「差别只在 JSON」——
      换一只猫 = 加一条配置，引擎一行不改。

   ⚠️ 站位**不写死坐标**，从 `CAMPUS` 的 zoneRect 现算（同 `72_guide.js:98` 的
      `guideBuildDict`）。写死就会在有人挪楼的时候静默错位，而且看不出来。
   ========================================================= */

/* --- 档位表（§5.2 / §7.5.4）---------------------------------------------
   `lo` 含、`hi` 不含。最亲段写到 101 而非 100：`Math.min(100, …)` 之后
   正好落在最亲里，写 100 会把满分的人漏到"没有档"。
   `dist` = 触发距离（世界像素）；`act` = 该档下猫播的动作。
   ⚠️ 很亲那一档的 `act` 是 `"walk"` —— §7.5.1 明说「跟」**不新画**，
      复用 walk 的帧，只是速度与时间预算不同（见 77 段的 FOLLOW）。 */
const CAT_TIERS = [
  { name: "陌生", lo: 0,  hi: 20,  dist: 120,  act: "flee"    },
  { name: "眼熟", lo: 20, hi: 40,  dist: 60,   act: "retreat" },
  { name: "熟",   lo: 40, hi: 60,  dist: 30,   act: "idle"    },
  { name: "亲近", lo: 60, hi: 80,  dist: 30,   act: "rub"     },
  { name: "很亲", lo: 80, hi: 95,  dist: 200,  act: "walk"    },
  { name: "最亲", lo: 95, hi: 101, dist: 9999, act: "wait"    }
];
/* §4.2 的 `reactions` 就是这个表的按名索引（配到猫身上，保持文档那个 JSON 形状） */
const CAT_REACTIONS = (function () {
  const o = {};
  for (const t of CAT_TIERS) o[t.name] = { dist: t.dist, act: t.act };
  return o;
})();

/* --- 领地锚点：从 CAMPUS 现算 ------------------------------------------
   `side` 取建筑的哪一侧：
     N = 北侧（后门/背街）  S = 南侧（临街/台阶/草坪 —— 与
     `60_assemble.js` 的 `_landmarks` 惯例一致：这个校园 3/4 视角、**入口一律朝南**）
   `off` = 往外推多少像素（南缘那几行常压在 BLD 格上，不推就要靠落位回退兜）。 */
const CAT_SPOT_DEF = {
  canteen_back:  { zone: "学生1食堂", side: "N", off: 16 },   // 食堂后门
  library_steps: { zone: "图书馆",    side: "S", off: 16 },   // 图书馆台阶
  minghu_yingbi: { zone: "水域",      side: "S", off: 16 },   // 明湖南岸影壁
  grass_sys:     { zone: "思源楼",    side: "S", off: 40 }    // 思源楼南草坪
};
const CAT_SPOTS = (function () {
  const out = {};
  for (const k in CAT_SPOT_DEF) {
    const d = CAT_SPOT_DEF[k];
    let R = null;
    for (const e of CAMPUS) if (e[0] === d.zone) { R = zoneRect(e); break; }
    if (!R) { console.warn("[猫宠] CAMPUS 里找不到领地锚点 " + d.zone); continue; }
    out[k] = {
      x: R.x + R.w / 2,
      y: d.side === "S" ? R.y + R.h + d.off : R.y - d.off,
      zone: d.zone
    };
  }
  return out;
})();

/* 锚点 → 真正的落脚点：锚点常压在楼/影壁/水面上，沿一圈候选偏移试到第一个能站的。
   ⚠️ 谓词与 `guidePlace`（`72_guide.js:83`）**逐字相同** —— 用 `blocked`
      （hw=6/hh=4，玩家那把尺子）而不是 `ptBlocked`（hw=7/hh=5，宽 1px，
      会挑出"格子上通、实际挤不过去"的点）。
   ⚠️ 找不到可走点就**退化成锚点本身**并 warn —— 宁可站得难看，也不要整个玩法不出现。 */
(function catPlace() {
  const CAND = [[0, 0], [0, 24], [0, -24], [30, 0], [-30, 0],
                [30, 24], [-30, 24], [30, -24], [-30, -24], [0, 48], [0, -48]];
  for (const k in CAT_SPOTS) {
    const S = CAT_SPOTS[k];
    let ok = null;
    for (const c of CAND) {
      const x = clamp(S.x + c[0], 20, WORLD_W - 20);
      const y = clamp(S.y + c[1], 70, WORLD_H - 24);
      if (canWalk(x, y) && !blocked(x, y)) { ok = { x: x, y: y }; break; }
    }
    if (ok) { S.x = ok.x; S.y = ok.y; }
    else console.warn("[猫宠] 领地 " + k + "（" + S.zone + "）附近没有可走点，用锚点兜底");
  }
})();

/* --- 作息 --------------------------------------------------------------
   `nap: true` 的时段猫**留在原地睡**（§7.5.1 的 `sleep`；§2.4「中午在台阶上睡」）。
   ⚠️⚠️ **没有 `at: null`**（第四十四轮 2026-10-09 按用户口径去掉）：
      用户原话「猫应该一整天都在哈，这不需要设计晚上消失的逻辑」。
      原来每张表最后一段都是 `at: null` ⇒ 一天里有 12~13 小时**校园里一只猫都没有**，
      晚上打开地图会以为猫没做出来。现在**每只猫全天 24 小时都待在某个点上**，
      夜里只是**回自己的 `home`**，作息表仍然让它在一天里换地方。
   ⚠️ 这与冻结的 `概要设计说明书` 不冲突 —— 那边只说「每只猫有独立领地与作息」、
      「校园在不同时刻呈现不同状态」，从来没写过"晚上不出现"。
      "不出现"是 `猫宠.md` 自己加的，已在同一轮改掉（§4.2 / §八 第 3 步 / §九 第 5 条）。
   ⚠️ `catTick` 里 `c.active = !!(slot && slot.at)` 一个字没动：
      现在全天都能命中一个非 null 的 `at`，这个判据自然恒为真。
      **保留它**是为了以后真要加"某天不出现"时有地方落笔。 */
const CAT_SCHED = {
  cat_daju: [
    { at: "canteen_back",  from: "06:00", to: "11:00" },
    { at: "canteen_back",  from: "11:00", to: "14:00", nap: true },
    { at: "grass_sys",     from: "14:00", to: "18:00" },
    { at: "canteen_back",  from: "18:00", to: "06:00" }        // 夜里回食堂后门
  ],
  cat_guanzhang: [
    { at: "library_steps", from: "08:00", to: "12:00" },
    { at: "library_steps", from: "12:00", to: "15:00", nap: true },
    { at: "library_steps", from: "15:00", to: "19:00" },
    { at: "library_steps", from: "19:00", to: "08:00" }         // 馆长本来就不挪窝
  ],
  cat_zhima: [
    { at: "minghu_yingbi", from: "07:00", to: "11:00" },
    { at: "minghu_yingbi", from: "11:00", to: "15:00", nap: true },  // 谨慎：白天躲在影壁后睡
    { at: "minghu_yingbi", from: "15:00", to: "19:00" },
    { at: "minghu_yingbi", from: "19:00", to: "07:00" }
  ],
  cat_lihua: [
    { at: "grass_sys",     from: "06:00", to: "11:00" },
    { at: "grass_sys",     from: "11:00", to: "13:00", nap: true },
    { at: "grass_sys",     from: "13:00", to: "19:00" },
    { at: "grass_sys",     from: "19:00", to: "06:00" }
  ]
};

/* --- 四只猫（§4.3）-----------------------------------------------------
   `temperament.warmup` 是**喂食增益倍率**的键（见 77 段 CAT_GAIN_MUL）：
     fast = 大橘「最快能摸到」／slow = 馆长「最难」／mid = 另两只中间档。
   `seed` 只用来生成领地里那串巡游路点（确定性，同 `makeRng` 的口径）。 */
const CAT_AGENTS = [
  { id: "cat_daju",      name: "大橘",  home: "canteen_back",
    roam: { type: "territory", speed: 8, radius: 90 },
    temperament: { warmup: "fast" }, seed: 20261009 },
  { id: "cat_guanzhang", name: "馆长",  home: "library_steps",
    roam: { type: "territory", speed: 8, radius: 90 },
    temperament: { warmup: "slow" }, seed: 20261010 },
  { id: "cat_zhima",     name: "芝麻",  home: "minghu_yingbi",
    roam: { type: "territory", speed: 8, radius: 80 },
    temperament: { warmup: "mid" },  seed: 20261011 },
  { id: "cat_lihua",     name: "狸花",  home: "grass_sys",
    roam: { type: "territory", speed: 8, radius: 110 },
    temperament: { warmup: "mid" },  seed: 20261012 }
].map(function (c) {
  c.type = "cat";
  c.schedule = CAT_SCHED[c.id] || [];
  c.reactions = CAT_REACTIONS;                 // §4.2 那个 JSON 形状
  return c;
});
