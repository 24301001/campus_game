/* =========================================================
   7.9 保安 · 老丁 —— 校园里巡楼的那个人（2026-10-09 接入地图）
   ---------------------------------------------------------
   他在 MVP 里的定位是「**全图唯一叫得动的人**」（`交互.md §二`）：
   不站岗，**在路上巡逻**，你在校园里碰见他、走近按 C 说话。

   · 精灵：走 71b 的 `npcSprites(GUARD_PAL)` —— 与玩家 / 小北 / 算法哥
     **共用 `50_char.js` 的骨架与步态**，只换配色。配色照用户给的三张立绘
     （`laoding/assets/guard-normal|think|smile.png`）取：银灰短发 + 深藏青制服。
     不新开骨架：像素风最容易露馅的就是比例与描边（见 `71_guide_char.js` 开头）。

   · 巡逻：路点由 `ARTERY`（20_ground.js 的显式主干道表）**现算** ——
     不写死坐标，楼/路一挪路点跟着走（同 `76_cat_data.js` 从 CAMPUS 现算的规矩）。
     走的是**向导那套栅格寻路**（`guidePath`：CELL 栅格 + Dijkstra + 视线拉直），
     不是直线 —— 直线会从两栋楼的斜缝里穿过去（`72_guide.js` 文件头 (2) 记着）。

   · 交互：走近 → 头顶冒「按 C 说话」→ 按 C 打开**同源 iframe 抽屉**。
     抽屉**复用 71b 的 `#ctrP` / `#ctrF`** 与 `ctrProbe` / `ctrOpenPlatform` /
     `ctrClosePlatform`（`ctrOpenPlatform` 只认 `R.app`，所以给一个假房间对象即可），
     观感与算法哥 / 学霸姐**同一套**。地址 `/ld/`：Vite 代理到 127.0.0.1:8000，
     服务端 `PrefixStrip` 剥前缀（见 `campus_game/frontend/vite.config.js`）。

   ⚠️ 四条不许踩：
     ① **不进 props、不加 addSolid** —— 他是每帧换 img 的活人（同向导 / 猫），
        进 props 会让 `_propdiff.py` 每轮报假差异，还会落进 60 段白名单式 clear* 的射程。
     ② **移动谓词与 `ensureWalkGrid()` 逐字同一对**（`canWalk && !blocked`）——
        换 `ptBlocked` 就宽 1px，他会沿墙磨到永远到不了（§7.2.6 记着）。
     ③ 加载期**不碰** player / cam / keys / cv / zoom（那五个的声明在 `loop` 切片里，
        排在本段**之后**，加载期取会撞 TDZ ⇒ 整页 JS 静默死）。只在**函数体**里用。
     ④ 本文件注释里**不许出现带尖括号的 script 字面量** —— `build.py` 的语法闸正则
        会错位报 SYNTAX_FAIL（栽过两次）。
   ========================================================= */

/* 配色。⚠️ 五个 NPC 的识别色必须两两拉开（3× 档下实测距离约 6 格）：
       玩家   = 蓝外套 #3f6ea8
       小北   = 红马甲 #c0392b（全图唯一的高饱和红）
       算法哥 = 冷黑   #2b3038 + 眼镜
       学霸姐 = 藕荷紫 #8b6cc0（全图唯一紫）
       老丁   = **深藏青** #2b3a5e + **银灰发** #a8afb8
   银灰发是他最强的识别特征 —— 上面三个分别是近黑 / 黑 / 深棕，剪影上就分得开。
   ⚠️ `pack` 三色取衣服同色 = **他不背包**（同算法哥的处置：`torso(true)` 照旧画
      那一块，取同色等于什么都没加）。 */
const GUARD_PAL = {
  skin:  "#e8bd98", skinD: "#c29271", skinL: "#f7d5b4",
  hair:  "#a8afb8", hairL: "#ccd2d9", hairD: "#6f767f",   // 银灰短发（三张立绘的主色）
  coat:  "#2b3a5e", coatD: "#1a2440", coatL: "#415a86",   // 深藏青制服
  pant:  "#26314d", pantD: "#161e33", pantL: "#3a4a70",
  shoe:  "#171a20", shoeL: "#2e333d",
  pack:  "#2b3a5e", packD: "#1a2440", packL: "#415a86"
};
const guardSprite = npcSprites(GUARD_PAL);

/* --- 7.9.1 巡逻路点（**加载期**从主干道现算）--------------------------
   `ARTERY` 每行是 `{name, x, y, w, h, cls}`。顺序就是巡逻顺序（一个环）：
     南北主路南段 → 北段 → 东西主路西 → 中 → 东 → 回南段
   ⚠️ 全是**路中心线**上的点 —— ARTERY 是无条件盖章的可走路面，除开偶尔立在
      路边的灯柱/行道树，基本都走得通；真被挡了有 `guardSnap` 兜底。 */
const GUARD_SPOTS = (function () {
  const A = (typeof ARTERY !== "undefined" && ARTERY) || [];
  const pick = n => A.find(r => r.name === n) || null;
  const ew = pick("东西主路"), ns = pick("南北主路"), out = [];
  if (ns) {
    out.push({ x: (ns.x + ns.w / 2) | 0, y: (ns.y + ns.h * 0.86) | 0 });   // 南段（近南门）
    out.push({ x: (ns.x + ns.w / 2) | 0, y: (ns.y + ns.h * 0.20) | 0 });   // 北段
  }
  if (ew) {
    const cyE = (ew.y + ew.h / 2) | 0;
    out.push({ x: (ew.x + ew.w * 0.10) | 0, y: cyE });                     // 西
    out.push({ x: (ew.x + ew.w * 0.50) | 0, y: cyE });                     // 中（思源楼前）
    out.push({ x: (ew.x + ew.w * 0.90) | 0, y: cyE });                     // 东（逸夫楼前）
  }
  return out;
})();

const GUARD_TALK_R   = 68;    // 「按 C 说话」的半径（同角色那档 74 的量级）
const GUARD_SEE_R    = 150;   // 这个距离内他转头看你（`交互.md §4.1`「靠近 → 转向玩家」）
/* ⭐ 「注意到有人就停下」（2026-10-09 第一轮探针实测后补的，见 §7.9.3）。
   没有这一条时他是**匀速 100+ px/s 一路往前**的 —— 探针把他瞬移到身边 20px，
   0.6 秒后他已经走出 107px、`near` 翻假 ⇒ 按 C 什么都不发生。玩家手速再快也追不上
   **一个 68px 的搭话半径**，「走近按 C」直接退化成碰运气。
   停下是**暂停**（不清 `GUARD.path`），玩家一走出这个圈他就接着巡逻。 */
const GUARD_NOTICE_R = 96;

/* 移动谓词 —— ⚠️ 与 `ensureWalkGrid()` 烘格子那一行**逐字同一对**（见文件头 ②）。 */
function guardWalkable(x, y) { return canWalk(x, y) && !blocked(x, y); }

/* 把一个路点吸附到最近的可走点（螺旋外扩，确定性；16 个方向 × 半径 4..96）。
   找不到就原样返回 —— 顶多是他走到那儿贴着墙停住，由卡死判据跳下一站。 */
function guardSnap(x, y) {
  if (guardWalkable(x, y)) return { x: x, y: y };
  for (let r = 4; r <= 96; r += 4) {
    for (let a = 0; a < 16; a++) {
      const t = a * Math.PI / 8, nx = x + Math.cos(t) * r, ny = y + Math.sin(t) * r;
      if (guardWalkable(nx, ny)) return { x: nx, y: ny };
    }
  }
  return { x: x, y: y };
}

/* --- 7.9.2 他是活的：位置 / 朝向 / 相位 / 走到哪一站 ------------------- */
const GUARD = (function () {
  const s0 = GUARD_SPOTS.length ? guardSnap(GUARD_SPOTS[0].x, GUARD_SPOTS[0].y)
                                : { x: SPAWN.x, y: SPAWN.y };
  return {
    name: "保安 · 老丁",
    x: s0.x, y: s0.y, dir: "down", step: IDLE_BASE, walk: 0, idle: 0,
    spot: 0, path: null, wi: 0, pauseT: 1.2, stuck: 0,
    near: false, open: false
  };
})();

/* 站着不动：待机呼吸两帧，与玩家同一个 IDLE_HZ / IDLE_FRAMES。 */
function guardStand(dt) {
  GUARD.idle += dt;
  GUARD.step = IDLE_BASE + (((GUARD.idle * IDLE_HZ) | 0) & (IDLE_FRAMES - 1));
}

/* 转向玩家（只在**站着**时调 —— 走起来朝向是移动方向）。 */
function guardFace() {
  const dx = player.x - GUARD.x, dy = player.y - GUARD.y;
  if (Math.abs(dx) >= Math.abs(dy)) GUARD.dir = dx < 0 ? "left" : "right";
  else GUARD.dir = dy < 0 ? "up" : "down";
}

/* 朝目标走一步。⚠️ 步态照抄 `guideWalkToward`（也是抄玩家主循环那两行）：
   走按**实际位移**推进（顶墙位移 0 ⇒ 脚立刻停，不空踏）。
   速度取 `player.speed` 的 **0.5 倍** —— 巡逻该明显慢于赶路的人（实测玩家约 230 px/s，
   别问我为什么不是 Demo 里写的 94，探针量的是这个数）。 */
function guardWalkToward(tx, ty, dt) {
  const dx = tx - GUARD.x, dy = ty - GUARD.y, d = Math.hypot(dx, dy);
  if (d < 0.6) return false;
  const ux = dx / d, uy = dy / d, s = (player.speed || 150) * 0.5 * dt;
  const nx = GUARD.x + ux * s, ny = GUARD.y + uy * s;
  let moved = 0;
  if (guardWalkable(nx, GUARD.y)) { moved += Math.abs(nx - GUARD.x); GUARD.x = nx; }
  if (guardWalkable(GUARD.x, ny)) { moved += Math.abs(ny - GUARD.y); GUARD.y = ny; }
  /* 朝向取**移动方向**（同补丁 14 的判据：斜向取侧视）。用 ux/uy 而不是实际位移 ——
     贴墙滑时实际位移会缩成单轴，用它他会一路扭头盯墙。 */
  if (Math.abs(ux) >= Math.abs(uy)) GUARD.dir = ux < 0 ? "left" : "right";
  else GUARD.dir = uy < 0 ? "up" : "down";
  if (moved > 0.01) {
    GUARD.walk += moved; GUARD.idle = 0;
    GUARD.step = Math.floor(GUARD.walk / WALK_STRIDE * WALK_FRAMES) & (WALK_FRAMES - 1);
    return true;
  }
  return false;
}

/* 开始下一段：从当前站走到 `GUARD.spot` 那一站。
   ⚠️ `guidePath` 用的是向导那张**共享**栅格与临时数组 —— 但它是**同步一次算完**的
      （返回一份新的路点数组），不跨帧持有状态 ⇒ 和 `guideTick` 同帧调用也不会串台。 */
function guardNextLeg() {
  if (!GUARD_SPOTS.length) return;
  GUARD.spot = (GUARD.spot + 1) % GUARD_SPOTS.length;
  const t = GUARD_SPOTS[GUARD.spot];
  let p = null;
  try { p = guidePath(GUARD.x, GUARD.y, t.x, t.y); } catch (e) { p = null; }
  GUARD.stuck = 0;
  if (!p || !p.length) { GUARD.path = null; GUARD.pauseT = 0.8; return; }   // 无解 = 直接歇一站
  GUARD.path = p; GUARD.wi = 0;
}

/* 沿 `GUARD.path` 推进。返回 "run" | "done" | "stuck"。 */
function guardFollow(dt) {
  const P = GUARD.path;
  if (!P || !P.length) return "done";
  while (GUARD.wi < P.length) {
    const w = P[GUARD.wi];
    if (Math.hypot(w[0] - GUARD.x, w[1] - GUARD.y) <= 14) { GUARD.wi++; continue; }
    break;
  }
  if (GUARD.wi >= P.length) return "done";
  const w = P[GUARD.wi];
  return guardWalkToward(w[0], w[1], dt) ? "run" : "stuck";
}

/* --- 7.9.3 每帧心跳（由 build.py 补丁 27 挂在 `catTick` 之后）--------- */
function guardTick(dt) {
  /* 抽屉开着 = `CENTER.plat`。在地图上这是**唯一**会把它置真的地方（房间那条路
     还会同时置 `CENTER.active`，那时玩家本来就冻着）⇒ 拿它当"抽屉开着"的判据最省事。 */
  GUARD.open = (typeof CENTER !== "undefined") && !!CENTER.plat;
  const dP = Math.hypot(player.x - GUARD.x, player.y - GUARD.y);
  GUARD.near = !GUARD.open && dP <= GUARD_TALK_R;

  if (GUARD.open) { guardStand(dt); guardTipPaint(); return; }

  if (GUARD.pauseT > 0) {                       // 到站歇脚
    GUARD.pauseT -= dt;
    guardStand(dt);
    if (dP <= GUARD_SEE_R) guardFace();
  } else if (GUARD.path && dP <= GUARD_NOTICE_R) {
    /* ⭐ 有人靠近 ⇒ 停下看着（不清 `GUARD.path`，是暂停不是重排）。
       这一条是「走近按 C」能不能用出来的**前提**，见 GUARD_NOTICE_R 的注释。 */
    guardStand(dt);
    guardFace();
  } else if (!GUARD.path) {                     // 该启程了
    guardNextLeg();
    guardStand(dt);
  } else {
    const r = guardFollow(dt);
    if (r === "done") { GUARD.path = null; GUARD.pauseT = (GUARD.spot & 1) ? 2.0 : 1.3; }
    else if (r === "stuck") {
      GUARD.stuck += dt;
      /* 卡死 1.5 秒就认栽换一站（路点被临时障碍挡住的兜底，见 `guardSnap` 的注释）。 */
      if (GUARD.stuck > 1.5) { GUARD.path = null; GUARD.stuck = 0; GUARD.pauseT = 0.6; }
    } else GUARD.stuck = 0;
  }
  guardTipPaint();
}

/* --- 7.9.4 头顶气泡（复用 `#tip` 的样式，独立一个元素 `#ctip`）--------
   ⚠️ 定位**不用 `getBoundingClientRect()`**（每帧读布局 = 强制重排）：
      `#wrap` 是 fixed + flex 居中 ⇒ 画布左上角纯算术可得（同 `guideTipFollow`）。 */
const guardTip = document.getElementById("ctip");
let _gTipX = -1e9, _gTipY = -1e9, _gTipTxt = null;
function guardTipPaint() {
  if (!guardTip) return;
  const txt = GUARD.near ? "<b>C</b> 和老丁说话" : "";
  if (txt !== _gTipTxt) {
    _gTipTxt = txt;
    if (txt) { guardTip.innerHTML = txt; guardTip.hidden = false; }
    else guardTip.hidden = true;
  }
  if (!txt || guardTip.hidden) return;
  const cssW = parseFloat(cv.style.width);
  if (!cssW) return;
  const cs = cssW / VIEW_W;
  const x = (window.innerWidth  - VIEW_W * cs) / 2 + (GUARD.x - cam.x) * zoom * cs;
  const y = (window.innerHeight - VIEW_H * cs) / 2 + (GUARD.y - CH_AY - cam.y) * zoom * cs;
  if (Math.abs(x - _gTipX) < 1 && Math.abs(y - _gTipY) < 1) return;   // 没动 ⇒ 零开销
  _gTipX = x; _gTipY = y;
  guardTip.style.left = x + "px";
  guardTip.style.top  = y + "px";
}

/* --- 7.9.5 抽屉：走近按 C 开失物招领（与算法哥 / 学霸姐同一套）---------
   `ctrProbe` 只看 `R.probe`、`ctrOpenPlatform` 只看 `R.app`、`ctrColdStart` 只看
   `R.coldTip` ⇒ 给一个**假房间对象**就能整条复用，不必另写一套开关。 */
const GUARD_APP = {
  app: "/ld/", probe: "/ld/api/health",
  /* ⭐⭐ 第四十五轮：**开门前先验票**（见 `ctrOpenPlatform` 与 `ldEnsure`）。
     ⚠️ 写成**函数**而不是直接引用 `ldEnsure`：就为了探针能**按名字**替换它造负对照。 */
  ensure: function () { return ldEnsure(); },
  name: "保卫处", coldTip: "老丁的失物招领服务还没起来，正在拉起来，稍等一会儿……"
};
function guardOpen() {
  ctrOpenPlatform(GUARD_APP);
  /* 抽屉那个 iframe 的 title 是写死的「刷题平台」，切到老丁这边顺手改一下
     （只影响无障碍读屏与浏览器标签提示，画面无关）。 */
  if (ctrF) ctrF.setAttribute("title", "保卫处 · 老丁");
}
function guardTalk() {
  if (typeof CENTER !== "undefined" && (CENTER.plat || CENTER.waiting)) return;
  /* ⚠️ 第四十五轮补的连按两次 C 并发保护（与 `auntTalk` 的 `AUNT.talking` 同款）：
     闸门进了 `ctrOpenPlatform` 之后，`CENTER.plat` 要等 `ctrProbe` / `ldEnsure` 回来
     才置真 —— 这中间几百毫秒里第二下 C 会再走一遍整条链（探两次、开两次抽屉）。 */
  if (GUARD.talking) return;
  if (!GUARD.near) { guardToast("走近老丁再按 C。"); return; }
  GUARD.talking = true;
  ctrProbe(GUARD_APP).then(function (ok) {
    GUARD.talking = false;
    if (ok) guardOpen();                // 闸门（`GUARD_APP.ensure`）在 `ctrOpenPlatform` 里
    else ctrColdStart(GUARD_APP);       // 服务没起来 → 走 71b 那套"请启动器拉起来"
  });
}
/* 反馈复用向导那张 `guideToast`（2.6 秒自动隐藏）—— 地图上已经有这一块，不另做。 */
function guardToast(t) { if (typeof guideToast === "function") guideToast(t); }

/* --- 7.9.6 按键 ------------------------------------------------------
   ⚠️ 只在**真的站得够近**时才消费 C：别处的 C 一律放行，绝不改变既有按键语义。
   ⚠️ 三道早退照 71b 的写法：输入法组字中、keyCode 229、抽屉/房间/冷启动期间让路
      （那三种状态下 71b 那条监听已经有它的处置）。 */
window.addEventListener("keydown", function (e) {
  if (e.isComposing || e.keyCode === 229) return;
  if (typeof CENTER === "undefined") return;
  if (CENTER.plat || CENTER.active || CENTER.waiting) return;
  if ((e.key || "").toLowerCase() === "c" && !e.repeat && GUARD.near) {
    guardTalk();
    e.preventDefault(); e.stopImmediatePropagation();
  }
}, false);
