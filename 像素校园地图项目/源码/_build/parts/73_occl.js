/* =========================================================
   7.3 建筑遮挡虚化（第三十七轮）
   ---------------------------------------------------------
   用户 2026-09-30：
     「我发现我们走到楼后边会被遮挡，我们可以做一个虚化，走到某栋楼后边
       楼虚化我们可以看清楚自己在楼后边的行动」

   做法一句话：**哪栋楼挡住了人，哪栋楼就整栋降不透明度**；没挡人的楼一点不动。

   ⚠️ 三条不能动的前提（都是只读核实过的）：
     ① `ctx.globalAlpha` 全项目**从未被写过**（`ctx.save/restore` 全项目只有一处，
        在 drawWater 内部、成对闭合、且发生在绘制循环**之前**）⇒ 这个全局状态
        是干净的，可以当"这栋楼画多淡"的载体。
     ② 复位必须放在 `render()` 的**帧首**：地面 mip 与 drawWater 都排在绘制循环
        **之前**，上一帧最后一笔留下的 0.34 会整片糊到这一帧的地面上
        （`clearRect` 不重置 alpha，它只清像素）。
     ③ 角色画布**永远不许**进 `BLD_IMGS`：绘制循环里 `drawSwimRing` 紧跟角色那一笔，
        角色项一旦 alpha < 1，水线涟漪会被一起调暗。

   认楼靠的是 parts/60_assemble.js 顶部那张 `BLD_IMGS`（按 canvas 认，
   不按 tag 也不按宽高 —— 图书馆精灵宽 401，与 18 宿舍楼同宽）。

   ⚠️ 本段必须排在 `60_assemble.js` **之后**（`BLD_IMGS` 得先被填上）、
      排在主循环**之前**（补丁 20 要在 render() 里调这三个函数）。
      ⚠️ 段内**加载期**不许碰 `ctx` / `player` / `GUIDE` —— 这三个的 `const` 声明
         在主循环切片里（Demo.html L1247 / L1257），排在**本段之后**；
         加载期取它们会撞 TDZ。只在被调用的函数体里取，那时早已初始化。
   ========================================================= */

const OCCL_A   = 0.34;      // 挡住人时这栋楼降到的不透明度（用户看实物后再调）
const OCCL_TAU = 0.11;      // 淡入淡出时间常数（秒）（同上）

const _occlCur  = new Map();     // canvas -> 当前不透明度（跨帧平滑用）
const _occlWant = new Set();     // 本帧该淡的 canvas
let   _occlStep = 1;             // 本帧插值系数，由 occlFrame() 算
let   _occlPrev = 0;             // 上一帧的时刻；首帧由 occlFrame 自己补上

/* 帧首：算插值系数 + **无条件复位 globalAlpha**。补丁 20(a) 挂在 clearRect 之前。 */
function occlFrame() {
  const t = performance.now();
  if (_occlPrev) _occlStep = Math.min(1, (t - _occlPrev) / 1000 / OCCL_TAU);
  _occlPrev = t;
  ctx.globalAlpha = 1;
}

/* 每帧先定"谁该淡"。补丁 20(b) 挂在绘制循环**之前**（要用排序后的 drawList）。 */
function occlTick(list, ox, oy, zoom) {
  _occlWant.clear();
  /* 两个"人"：玩家、向导。向导与补丁 18 同口径 —— FIT 档下 18px 精灵只剩 1.6 背板
     像素、根本不画，那就没必要为她把楼化开。 */
  const watchers = [{ x: player.x, y: player.y, baseY: player.y }];
  if (Math.max(CH_W, CH_H) * zoom >= 1.5)
    watchers.push({ x: GUIDE.x, y: GUIDE.y, baseY: GUIDE.y });

  for (const it of list) {
    if (!BLD_IMGS.has(it.img)) continue;
    for (const w of watchers) {
      /* ① 楼必须**画在人之后**：drawList 按 baseY 升序排，排在后 = 画在上 = 会盖住人。
            相等时**不淡** —— 人那两个条目是 push 在 props 之后的，Array#sort 是
            稳定排序 ⇒ 同 baseY 时人排在后、人画在上，楼盖不住 ⇒ 判据用严格大于。 */
      if (it.baseY <= w.baseY) continue;
      /* ② 人的**精灵矩形中心**要落进楼的精灵矩形。
            用中心而不是矩形相交：贴着墙角擦着一条边走过去时人明明看得见，
            不该为这一点边就把整栋楼化开。 */
      const cx = w.x - CH_AX + CH_W / 2, cy = w.y - CH_AY + CH_H / 2;
      if (cx >= it.x - it.ax && cx <= it.x - it.ax + it.img.width &&
          cy >= it.y - it.ay && cy <= it.y - it.ay + it.img.height) {
        _occlWant.add(it.img);
        break;
      }
    }
  }

  /* 跨帧插值：整栋楼"啪"地透明、"啪"地恢复会疯狂闪，插值才像雾化开。
     收尾吸附到目标值，免得无限逼近（也免得 P6 的单调性被浮点尾巴破坏）。 */
  for (const c of BLD_IMGS) {
    const want = _occlWant.has(c) ? OCCL_A : 1;
    const cur  = _occlCur.has(c) ? _occlCur.get(c) : 1;
    const nxt  = cur + (want - cur) * _occlStep;
    _occlCur.set(c, Math.abs(nxt - want) < 0.004 ? want : nxt);
  }
}

/* 每个绘制条目取一次。1 = 原样画（绝大多数条目走这条，热路径上只多一次 Map.get）。 */
function occlAlpha(it) {
  const a = _occlCur.get(it.img);
  return (a === undefined || a === 1) ? 1 : a;
}
