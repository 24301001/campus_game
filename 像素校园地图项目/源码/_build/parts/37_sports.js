/* =========================================================
   3.7 运动区（全部烘焙进地面：球场/跑道是贴地的）
   ---------------------------------------------------------
   用户原话："中间是绿色足球场，周围是红色的好几圈跑道"；
   "网球场、篮球场区域你可以自由，紧凑安排多个单元"。
   ⚠️ PPT 的操场矩形放不下标准 400m 田径场（作图不按比例），
      用户已默许运动区自由安排 —— **不要为此改标尺**。
   ========================================================= */
const LANE_RAMP = ["#a8453a", "#9a3e34", "#b04c40"];
const TRACK_EDGE = "#7f3229";
/* ⚠️ 第四十七轮（2026-10-10）用户令（逐字）：
     「仅仅老体育馆这边操场跑道是蓝色的，其他不变」
   ⇒ 只有**西半那个操场**（老体育馆旁边、也就是带看台的那个）铺蓝跑道；
     逸夫楼北边那个（带围网、在校园东半）保持红 —— 判据复用 §3.7.8 的 `stdTarget`，
     与 `opFenceTarget` 互为补集，两边不会打架。
   蓝的取值**实测自参考图** `预览\老体育馆旁边操场俯视图.png`：主色 RGB(62,139,207)。
   明暗三级与红支同法（在底色上 ±6% 亮度）⇒ 逐圈分道的明暗节奏在两支上读起来一致。 */
const LANE_RAMP_BLUE = ["#3e8bcf", "#3580c2", "#4a97d8"];
const TRACK_EDGE_BLUE = "#2f6a9d";
/* ⚠️ 第七轮（2026-09-17）用户口径（逐字）：
     「值得注意的是下方的网球场是被围栏围起来的，围栏比较高，是绿色的，
       并且球场也是纵向排布的，球场颜色是蓝色」
   三条一起改：① 球场底色绿→**蓝** ② 球场长轴钉成**南北**（纵向）
              ③ 整个场区加一圈**较高**的**绿色**围栏。
   ⇒ 单元缓冲铺装（TCOURT_BASE）铺满单元宽的 174/182，所以"球场之间那几十像素"
     读起来是**同一片蓝色场地的缓冲区**，不是空地 —— 这正是硬地的样子，
     白色场地线直接画在这片蓝上。 */
/* ⚠️ 第四十六轮（2026-10-10）：用户口径「篮球场地胶是蓝色的」+ 参考图
   `预览\篮球场.png`（主色实测 RGB(35,105,191) = #2369bf）⇒ 底色由**红棕改蓝**。
   取值比参考图略沉一档，让它与网球场那支蓝（TCOURT_BASE #3f6ea8）落在同一族里、
   并排看不跳。底部另配一支更深的 BCOURT_APRON 当地胶垫层 / 两块场地之间的接缝。 */
const BCOURT_BASE = "#2a64b4", BCOURT_LINE = "rgba(250,250,247,0.90)";
const BCOURT_APRON = "#1d4a8c";
const TCOURT_BASE = "#3f6ea8", TCOURT_LINE = "rgba(245,245,240,0.80)";
const TCOURT_APRON = "#2e4f74";                 // 场区底色（只在单元之间的 4px 缝里露出来）
/* 网球场围栏。校内围墙 §4.6 是 WALL_H = 22 —— "比较高"取 32（高一档半）。
   ⚠️ **结构 = 立柱 + 柱间的绿色铁丝网**，以一个"网片单元"为单位连续排满整圈；
      不是一堵实心绿墙。第一版把 §4.6 围墙的 wallColumn 照搬过来（每 6px 一根连续
      竖带）＝一片实心绿，用户当天退回，原话（逐字）：
        「围栏是那种绿色编织网围栏，就是比如说四个栏杆围一个区域，区域中间是绿色
          铁丝网编织成的围栏这种，然后以这四个栏杆和中间的网为单位连续放上这种
          单位组成的围栏，而且加上围栏之后小人不能移动到围栏内了」
      ⇒ 一个"区域"＝ 一个网片单元（四角各一根望柱，中间一张网）；
         TFEN_UW = 一个单元的宽 = 柱间距，单元首尾相接就是整圈。
   ⚠️ 碰撞盒**不在本段加**：`addSolid` / `solids` 定义在 60_assemble.js，而本段排在
      它**之前**加载（加载期读顶层 const 撞暂时性死区 ⇒ 整页 JS 死，58 段的 PALETTE
      已栽过一次）。盒子在 §6.5g 里按 zoneRect 现算，与这里画的这圈**同源同式**。
      旧版是**有意**不做（加 addSolid 会挪动 solids、重掷全校园散射，见 60 段 §6.6
      的地雷）；用户这轮明确要求加，那一轮就是本轮 —— 见交付说明里的单独声明。 */
const TFEN_H = 32;
const TFEN_COL = "#3a6b42", TFEN_COL_L = "#568c5e", TFEN_COL_D = "#26492d";
const TFEN_RAIL = "#7fae83";
/* 网丝取**比柱亮一档**的绿：柱是"实"的、网是"虚"的，靠亮度差把两者分开。 */
const TFEN_MESH_C = "#5f9c66";
const TFEN_UW = 30, TFEN_MESH = 5;              // 一个网片单元的宽（= 柱间距）/ 网眼边长
const TFEN_RLT = 3, TFEN_RIN = 2, TFEN_PW = 4;  // 上横杆厚 / 横杆离柱顶 / 望柱宽

function zoneRect(e) { return { x: IX(e[2]), y: IX(e[3]), w: IX(e[4]), h: IX(e[5]) }; }

function paintTracks(g, rng) {
  for (const e of CAMPUS) if (e[1] === "track") {
    const R = zoneRect(e);
    paintTrack(g, rng, R, stdTarget(e));          // 第四十七轮：西半那个（老体育馆旁）铺蓝道
    if (opFenceTarget(e)) opFenceRect(g, R);      // §3.7.5 逸夫楼北边那个操场：四周围网
  }
}

/* --- 3.7.4 圆角矩形填充（第四十五轮 2026-10-10）--------------------------
   跑道从**椭圆**改成**圆角矩形**：用户这一轮给的参考图
   （`预览\逸夫楼北边操场.png`）里，红色跑道是围着绿色球场的**圆角矩形环**、
   球场本身也是（圆角小得多的）矩形，不是椭圆。两个操场共用本函数，一并改。
   ⚠️ 必须**逐像素硬边**（照 demo 的 `circlePx` / `ellipsePx` 那样按扫描线 fillRect），
      不许改用 canvas 的 path / `roundRect()` —— 那会带抗锯齿，1× 下边缘发毛、
      与全图"硬边像素"的观感不一致，缩小时走 mip 降采样更糊。
   参数：中心 (cx, cy)、半宽 rx、半高 ry、圆角半径 rad。 */
function rrectPx(g, cx, cy, rx, ry, rad, col) {
  rad = Math.max(0, Math.min(rad, Math.min(rx, ry)));
  g.fillStyle = col;
  for (let y = -ry; y <= ry; y++) {
    const ay = Math.abs(y);
    let dx = rx;
    if (ay > ry - rad) {                      // 进入圆角区：横向半宽按圆弧收
      const q = ay - (ry - rad);
      const t = rad * rad - q * q;
      dx = (rx - rad) + (t > 0 ? Math.sqrt(t) : 0);
    }
    g.fillRect(Math.round(cx - dx), Math.round(cy + y), Math.round(dx * 2) + 1, 1);
  }
}

function paintTrack(g, rng, R, blue) {
  const LANE = blue ? LANE_RAMP_BLUE : LANE_RAMP;
  const EDGE = blue ? TRACK_EDGE_BLUE : TRACK_EDGE;
  const cx = Math.round(R.x + R.w / 2), cy = Math.round(R.y + R.h / 2);
  const rx = Math.round(R.w / 2) - 6, ry = Math.round(R.h / 2) - 6;
  const lanes = 6;
  const m = Math.min(rx, ry);                          // 短半轴：圆角与跑道宽都按它定
  const inset = Math.max(26, Math.round(m * 0.44));    // 跑道总宽（外沿 → 球场边）
  const radO = Math.round(m * 0.62);                   // 外沿圆角（大）
  const radI = Math.round(m * 0.14);                   // 球场圆角（小得多）
  const horiz = rx >= ry;

  /* 1) 外圈深红跑道底 + 逐圈分道（交替明暗，做出"好几圈"的观感） */
  rrectPx(g, cx, cy, rx + 4, ry + 4, radO + 4, EDGE);
  for (let i = 0; i <= lanes; i++) {
    const t = i / lanes;
    const sx = rx - Math.round(inset * t), sy = ry - Math.round(inset * t);
    const rad = Math.round(radO + (radI - radO) * t);
    rrectPx(g, cx, cy, sx, sy, rad, LANE[i % 3]);
    if (i > 0 && i < lanes) {                          // 分道白线（细）
      rrectPx(g, cx, cy, sx, sy, rad, "rgba(255,255,255,0.10)");
      rrectPx(g, cx, cy, sx - 1, sy - 1, rad, LANE[i % 3]);
    }
  }
  /* 2) 内圈绿色足球场：深色内沿 → 球场本体 → 白色边线（圆角环）→ 草地 */
  const fx = rx - inset, fy = ry - inset;
  rrectPx(g, cx, cy, fx + 3, fy + 3, radI + 3, "rgba(20,30,16,0.45)");
  rrectPx(g, cx, cy, fx, fy, radI, "#4d8a3e");
  rrectPx(g, cx, cy, fx - 4, fy - 4, radI - 4, TCOURT_LINE);
  rrectPx(g, cx, cy, fx - 6, fy - 6, Math.max(0, radI - 6), "#57974a");
  const lx = fx - 6, ly = fy - 6;                      // 白色场地线一律画在边线**之内**
  const fieldR = Math.min(lx, ly) * 0.86;
  if (fieldR > 20) {
    if (horiz) {
      px(g, cx, cy - Math.round(ly * 0.80), 2, Math.round(ly * 1.60), TCOURT_LINE);   // 中线
      ellipseRing(g, cx, cy, Math.round(fieldR * 0.26), TCOURT_LINE);
      rectLine(g, cx - Math.round(lx * 0.72), cy - Math.round(ly * 0.52), Math.round(lx * 0.22), Math.round(ly * 1.04), TCOURT_LINE);
      rectLine(g, cx + Math.round(lx * 0.50), cy - Math.round(ly * 0.52), Math.round(lx * 0.22), Math.round(ly * 1.04), TCOURT_LINE);
    } else {
      px(g, cx - Math.round(lx * 0.80), cy, Math.round(lx * 1.60), 2, TCOURT_LINE);
      ellipseRing(g, cx, cy, Math.round(fieldR * 0.26), TCOURT_LINE);
      rectLine(g, cx - Math.round(lx * 0.52), cy - Math.round(ly * 0.72), Math.round(lx * 1.04), Math.round(ly * 0.22), TCOURT_LINE);
      rectLine(g, cx - Math.round(lx * 0.52), cy + Math.round(ly * 0.50), Math.round(lx * 1.04), Math.round(ly * 0.22), TCOURT_LINE);
    }
  }
}

function rectLine(g, x, y, w, h, col) {
  px(g, x, y, w, 2, col); px(g, x, y + h - 2, w, 2, col);
  px(g, x, y, 2, h, col); px(g, x + w - 2, y, 2, h, col);
}
/* --- 网球场围栏：绿色**编织网**围栏（第七轮，同日按用户口径重做）---------
   结构：立柱（望柱）+ 柱间的铁丝网，一个"单元"＝四角立柱 + 中间一张网，首尾相接。
   口径沿用 §4.6 校内围墙：沿一条线立柱子，每根是 (x, y−H) → (x, y) 的竖带 ——
   无论线朝哪边，"高"都读成屏幕竖直（这套轴测的既定读法，墙也没做透视）。
   ⚠️ **网面必须透气**：不铺底色，只落 1px 的网丝，让底下的球场 / 草地透出来 ——
      "网"与"墙"在像素尺度上的唯一区别就在这里（第一版铺了实色底 ＝ 一堵绿墙）。 */

/* 网眼：在屏幕矩形 (x, y, w, h) 里画一格格绿丝。**不铺底色。** */
function tfMesh(g, x, y, w, h) {
  if (w <= 0 || h <= 0) return;
  for (let i = 0; i < h; i += TFEN_MESH) px(g, x, y + i, w, 1, TFEN_MESH_C);   // 横丝
  for (let i = 0; i < w; i += TFEN_MESH) px(g, x + i, y, 1, h, TFEN_MESH_C);   // 竖丝
  /* 收边：单元宽 / 高不是 TFEN_MESH 的整数倍时，最后一格不补就是一条豁口 */
  if ((h - 1) % TFEN_MESH) px(g, x, y + h - 1, w, 1, TFEN_MESH_C);
  if ((w - 1) % TFEN_MESH) px(g, x + w - 1, y, 1, h, TFEN_MESH_C);
}

/* 一根望柱：立在地脚线 (x, y) 上的深绿方柱 + 外挑柱头 + 接地影 */
function tfPost(g, x, y) {
  const X = Math.round(x) - TFEN_PW / 2, Y = Math.round(y);
  px(g, X, Y - TFEN_H + 2, TFEN_PW, TFEN_H - 2, TFEN_COL);            // 柱身
  px(g, X, Y - TFEN_H + 2, 1, TFEN_H - 2, TFEN_COL_L);                // 西棱受光
  px(g, X + TFEN_PW - 1, Y - TFEN_H + 2, 1, TFEN_H - 2, TFEN_COL_D);  // 东棱背光
  px(g, X - 1, Y - TFEN_H - 1, TFEN_PW + 2, 3, TFEN_COL_D);           // 柱头
  px(g, X - 1, Y - TFEN_H - 1, TFEN_PW + 2, 1, TFEN_COL_L);           //   …受光顶棱
  px(g, X - 1, Y + 1, TFEN_PW + 2, 1, "rgba(14,18,28,0.28)");         // 接地影
}

/* 东西走向的一段：地脚线 y、从 xa 到 xb。网面 + 上横杆 + **均匀立柱**。
   屏幕上这段围栏占 x[xa..xb] × y[y−H..y]，网面挂在横杆之下。 */
function tfRailEW(g, xa, xb, y) {
  const x0 = Math.round(xa), x1 = Math.round(xb), Y = Math.round(y);
  const ty = Y - TFEN_H + TFEN_RIN;                       // 上横杆顶
  tfMesh(g, x0, ty + TFEN_RLT, x1 - x0, Math.max(1, Y - ty - TFEN_RLT));
  px(g, x0, ty, x1 - x0, TFEN_RLT, TFEN_RAIL);            // 上横杆
  px(g, x0, ty, x1 - x0, 1, shade(TFEN_RAIL, 0.26));
  px(g, x0, ty + TFEN_RLT - 1, x1 - x0, 1, shade(TFEN_RAIL, -0.30));
  const n = Math.max(1, Math.round((x1 - x0) / TFEN_UW)); // ← 单元数（可执行定义）
  for (let k = 0; k <= n; k++) tfPost(g, x0 + ((x1 - x0) * k) / n, Y);
}

/* 南北走向的一段：地脚线 x、从 ya 到 yb。
   ⚠️ 屏幕上是**竖长条**：每一点都向上立 H ⇒ 占 x[X−PW/2..X+PW/2] × y[ya−H..yb]。
      上横杆因此是一条**竖线**（沿围栏走向、贴在最高处），不是横线。 */
function tfRailNS(g, x, ya, yb) {
  const X = Math.round(x) - TFEN_PW / 2, y0 = Math.round(ya), y1 = Math.round(yb);
  const ty = y0 - TFEN_H + TFEN_RIN;
  tfMesh(g, X, ty + TFEN_RLT, TFEN_PW, Math.max(1, y1 - ty - TFEN_RLT));
  px(g, X, ty, TFEN_PW, y1 - y0, TFEN_RAIL);              // 上横杆（竖线）
  px(g, X, ty, 1, y1 - y0, shade(TFEN_RAIL, 0.26));
  px(g, X + TFEN_PW - 1, ty, 1, y1 - y0, shade(TFEN_RAIL, -0.30));
  const n = Math.max(1, Math.round((y1 - y0) / TFEN_UW));
  for (let k = 0; k <= n; k++) tfPost(g, x, y0 + ((y1 - y0) * k) / n);
}

function tfFenceRect(g, R) {
  const x0 = R.x, x1 = R.x + R.w, y0 = R.y, y1 = R.y + R.h;
  tfRailEW(g, x0, x1, y0);            // 北（远）
  tfRailNS(g, x0, y0, y1);            // 西
  tfRailNS(g, x1, y0, y1);            // 东
  tfRailEW(g, x0, x1, y1);            // 南（近）—— 最后画，压住球场近端
}

function ellipseRing(g, cx, cy, r, col) {
  for (let a = 0; a < 360; a += 3) {
    const t = (a * Math.PI) / 180;
    px(g, cx + Math.cos(t) * r, cy + Math.sin(t) * r, 2, 2, col);
  }
}

function paintCourts(g, rng) {
  for (const e of CAMPUS) {
    if (e[1] !== "bball" && e[1] !== "tennis") continue;
    const R = zoneRect(e);
    /* 两块篮球场**各有专用画法**，一东一西：
         东半（逸夫楼北边操场左侧）→ §3.7.6 `paintBballCluster`：四块 + 操场同款围网；
         西半（老体育馆旁操场右侧）→ §3.7.7 `paintBballStack`：七块。
       东半那条判据与 60 段的碰撞盒共用 `opFenceTarget(e)` ⇒ 画到哪、挡到哪。
       ⚠️ 第四十七轮起，**走到下面通用支路的只剩网球场一条**：
          原先 `isB` 那一套（篮球场单元数 2 / 中线 / 罚球区 / 老式场地线）已随两轮
          全部搬空，通用支路里不再允许出现"篮球场"字样 —— build.py 钉着这条。 */
    if (opFenceTarget(e)) { paintBballCluster(g, R); continue; }
    if (e[1] === "bball") { paintBballStack(g, R); continue; }
    /* ⚠️ 第七轮把两个"竖向"拆开了，别再合成一个：
       · uvert —— **单元怎么排**（区域细长就竖着码），自动判据，保持不动；
       · 球场长轴的朝向 —— 原来跟着 uvert 走。网球场是 547×225 的横长区域，
         uvert = false ⇒ 自动判成"球场长轴东西向"，与照片（长轴南北、球网左右横贯）
         正好差 90°。用户口径要"纵向排布"，所以网球场**钉成纵向**（见下面 cw/ch 那段）。 */
    const uvert = R.h > R.w * 2;
    const n = 3;
    px(g, R.x, R.y, R.w, R.h, TCOURT_APRON);                       // 场地底色（压住校外纹理）

    for (let i = 0; i < n; i++) {
      let ux, uy, uw, uh;
      if (uvert) { ux = R.x; uy = R.y + (R.h * i) / n; uw = R.w; uh = R.h / n; }
      else       { ux = R.x + (R.w * i) / n; uy = R.y; uw = R.w / n; uh = R.h; }
      /* 单元缓冲铺装 */
      px(g, ux + 4, uy + 4, uw - 8, uh - 8, TCOURT_BASE);
      px(g, ux + 4, uy + 4, uw - 8, 3, "rgba(255,255,255,0.10)");
      px(g, ux + 4, uy + uh - 7, uw - 8, 3, "rgba(0,0,0,0.16)");

      /* 场地线：按标准比例居中放进单元 */
      const ratio = 23.77 / 10.97;
      let cw, ch;
      /* 网球场：长轴**南北**（cvert=true）⇒ cw 是短边（东西）、ch 是长边。
         ⚠️ clamp 不能照抄"cw 是长边"那种写法（方向反了）。
         实测本例：ch = 225.1−28 = 197.1、cw = 197.1/2.167 = 90.96，
         两个 clamp 都不会触发（uw−16 = 166、uh−16 = 209），但留着才对。 */
      ch = uh - 28; cw = ch / ratio;
      if (cw > uw - 16) { cw = uw - 16; ch = cw * ratio; }
      if (ch > uh - 16) { ch = uh - 16; cw = ch / ratio; }
      const cx = Math.round(ux + uw / 2), cy = Math.round(uy + uh / 2);
      const x0 = Math.round(cx - cw / 2), y0 = Math.round(cy - ch / 2);
      rectLine(g, x0, y0, Math.round(cw), Math.round(ch), TCOURT_LINE);
      /* 网球场地线 = 旧版**整体转 90°**（不是重新设计）：长轴南北 ⇒
         球网成了**横线**（东西向，左右横贯）、中央发球线成了竖线、
         发球区从左右两端挪到南北两端。照搬旧式的四个量，只换轴。 */
      px(g, x0, cy - 1, Math.round(cw), 2, TCOURT_LINE);              // 球网（横贯）
      px(g, cx - 1, y0, 2, Math.round(ch), TCOURT_LINE);              // 中央发球线
      rectLine(g, x0 + Math.round(cw * 0.22), y0,
               Math.round(cw * 0.56), Math.round(ch * 0.18), TCOURT_LINE);
      rectLine(g, x0 + Math.round(cw * 0.22),
               y0 + Math.round(ch) - Math.round(ch * 0.18),
               Math.round(cw * 0.56), Math.round(ch * 0.18), TCOURT_LINE);
      /* 场地投影（左上光源 → 右下） */
      px(g, ux + 4, uy + uh - 4, uw - 8, 4, "rgba(14,18,28,0.14)");
    }
    /* --- 围栏：整个网球场区一圈（用户口径："被围栏围起来的，围栏比较高，是绿色的"）---
       ⚠️ 必须排在单元循环**之后** —— 南边那道（离镜头最近）要压住球场近端，
          画在球场之前就会被自己的场地盖掉。（北边那道落在 R.y 之北 32px，
          本来就在场区之外，不会被球场碰到。） */
    tfFenceRect(g, R);
  }
}

/* --- 3.7.5 操场围网（第四十五轮 2026-10-10）-----------------------------
   用户原话（逐字）：
     「记得给操场周边围上网子。网子形状应该是矩形单位连接而成的，
       底座是白色砖头。两个矩形框之间通过一个杆子连接」
   逐条对着做：
     ① 网子 ＝ **矩形网框**一个接一个连着排：一个"单位"＝一块网 + 上下框边，
        首尾相接绕操场一圈（单元数沿用网球场那圈的口径：**可执行定义**现算，不写死）。
     ② 底座 ＝ **白色砖头**：每个单位的脚下一条白砖矮台（OPF_BH 高，带砖缝）。
     ③ 两框之间 ＝ **一根杆子**：单位接缝处立一根灰钢柱，把相邻两框连起来。
   ⚠️ 与网球场那圈（tfFenceRect）**故意不同、互不干扰**：那圈是"绿色编织网"
      （用户第七轮的口径，已验收），这圈是**白砖底座 + 灰钢框**。常量各起一套，
      **别去动 TFEN_\***（build.py 有一整串断言钉着它）。
   ⚠️ 网面**必须透气**：不铺底色，只落 1px 网丝 —— 这是"网"与"墙"在像素尺度上的分界。
      网球场围栏第一版铺了实色底 ⇒ 一堵绿墙 ⇒ 当天被用户退回，教训在这里。
   ⚠️ 本段**一次 rng() 都不许调**：buildGround() 全流程共用同一个 rng（种子 20260912），
      多抽一次就平移后面所有烘焙步骤（门口斑马线／路缘石接缝／路面标线／砖墙柱位）——
      而四套自动验收**一个数都不会变**（见 20_ground.js 顶部的种地雷说明）。
   ⚠️ 碰撞盒**不在本段加**（本段排在 60_assemble.js 之前，加载期碰 solids 会撞 TDZ，
      58 段的 PALETTE 已栽过一次）。盒子在 60 段**文件最末**按同一个 opFenceTarget 现算
      —— 为什么排最末（而不是像网球场那样排 scatter 之前），见那里的长注释。 */
const OPF_H = 34;                                // 网高（比校内围墙 WALL_H=22 高一档半）
const OPF_UW = 34;                               // 一个矩形网框的宽（＝杆距）
const OPF_BH = 7;                                // 白砖底座高
const OPF_FW = 2;                                // 上下框边厚
const OPF_PW = 5;                                // 杆子（柱）宽
const OPF_MESH = 4;                              // 网眼边长
const OPF_BRICK = "#e4e2d9", OPF_BRICK_L = "#f6f4ed", OPF_BRICK_D = "#b6b2a6";
const OPF_MORTAR = "rgba(96,94,86,0.42)";        // 砖缝
const OPF_FRAME = "#8d97a3", OPF_FRAME_L = "#c4ccd5", OPF_FRAME_D = "#5a636e";
const OPF_MESH_C = "#a9b3be";                    // 网丝：比框亮一档（框是"实"的、网是"虚"的）
const OPF_POLE = "#59636e", OPF_POLE_L = "#8b95a0", OPF_POLE_D = "#39424c";

/* 哪些运动场地块要围这圈网。
   第四十五轮只有**逸夫楼北边那个操场**；第四十六轮用户口径
   「篮球场四周也是和操场一样的围栏围着」⇒ 把**它左侧那块篮球场**一并纳入。
   两块地共用这一条判据，域 = **校园东半的运动场地块**：
     东半：操场（track，中心 x 9.6743）+ 它左侧的篮球场（bball，8.8965）—— 围；
     西半：老体育馆旁那个操场（1.0840）与那块篮球场（2.2306）—— 不围。
   ⚠️ 判据**现算**，不另存一份 rect（铁律：派生量不许再存常量）。
      东半 / 西半的中心 x 差着 3000 多像素，按"中心落在校园东半"认最稳。
      60 段加碰撞盒时**调的是同一个函数** ⇒ 画到哪、挡到哪，永远同源。 */
function opFenceTarget(e) {
  if (e[1] !== "track" && e[1] !== "bball") return false;
  return IX(e[2] + e[4] / 2) > WORLD_W * 0.5;
}

/* 网眼：在屏幕矩形 (x, y, w, h) 里落一格格钢灰网丝。**不铺底色。** */
function opMesh(g, x, y, w, h) {
  if (w <= 0 || h <= 0) return;
  for (let i = 0; i < h; i += OPF_MESH) px(g, x, y + i, w, 1, OPF_MESH_C);   // 横丝
  for (let i = 0; i < w; i += OPF_MESH) px(g, x + i, y, 1, h, OPF_MESH_C);   // 竖丝
  /* 收边：宽/高不是 OPF_MESH 的整数倍时，最后一格不补就是一条豁口 */
  if ((h - 1) % OPF_MESH) px(g, x, y + h - 1, w, 1, OPF_MESH_C);
  if ((w - 1) % OPF_MESH) px(g, x + w - 1, y, 1, h, OPF_MESH_C);
}

/* 一根杆子：立在地脚线 (x, y) 上，把左右两个网框连起来。 */
function opPost(g, x, y) {
  const X = Math.round(x) - (OPF_PW >> 1), Y = Math.round(y);
  const top = Y - OPF_H;
  px(g, X, top, OPF_PW, Y - top, OPF_POLE);              // 柱身
  px(g, X, top, 1, Y - top, OPF_POLE_L);                 // 西棱受光
  px(g, X + OPF_PW - 1, top, 1, Y - top, OPF_POLE_D);    // 东棱背光
  px(g, X - 1, top - 2, OPF_PW + 2, 3, OPF_POLE_D);      // 柱头（外挑）
  px(g, X - 1, top - 2, OPF_PW + 2, 1, OPF_POLE_L);      //   …受光顶棱
  px(g, X - 1, Y, OPF_PW + 2, 1, "rgba(14,18,28,0.26)"); // 接地影
}

/* 东西走向的一段（北 / 南两边）：地脚线 y、从 xa 到 xb。
   屏幕占 x[xa..xb] × y[y−H..y]：白砖底座压在最下一条，网挂在其上，杆子立在接缝处。 */
function opRailEW(g, xa, xb, y) {
  const x0 = Math.round(xa), x1 = Math.round(xb), Y = Math.round(y);
  if (x1 <= x0) return;
  const n = Math.max(1, Math.round((x1 - x0) / OPF_UW));   // 单元数（可执行定义，同 tfRailEW）
  const bTop = Y - OPF_BH, mTop = Y - OPF_H + OPF_FW;
  /* ① 白砖底座：每单元一格砖，首尾相接就是一道矮白砖台 */
  for (let k = 0; k < n; k++) {
    const ux = Math.round(x0 + ((x1 - x0) * k) / n);
    const uw = Math.round(x0 + ((x1 - x0) * (k + 1)) / n) - ux;
    px(g, ux, bTop, uw, OPF_BH, OPF_BRICK);
    px(g, ux, bTop, uw, 1, OPF_BRICK_L);                    // 顶棱受光
    px(g, ux, Y - 2, uw, 2, OPF_BRICK_D);                   // 底棱背光
    if (uw > 6) px(g, ux + 2, bTop + 3, uw - 4, 1, OPF_MORTAR);   // 砖缝
  }
  /* ② 网面（透气，不铺底） */
  opMesh(g, x0, mTop, x1 - x0, Math.max(1, bTop - mTop));
  /* ③ 上框边：一根通长的横杆，压住网的上沿 */
  px(g, x0, Y - OPF_H, x1 - x0, OPF_FW, OPF_FRAME);
  px(g, x0, Y - OPF_H, x1 - x0, 1, OPF_FRAME_L);
  px(g, x0, Y - OPF_H + OPF_FW - 1, x1 - x0, 1, OPF_FRAME_D);
  /* ④ 杆子：每个接缝一根（含两端，共 n+1 根），把相邻两框连起来 */
  for (let k = 0; k <= n; k++) opPost(g, x0 + ((x1 - x0) * k) / n, Y);
}

/* 南北走向的一段（西 / 东两边）：地脚线 x、从 ya 到 yb。
   ⚠️ 屏幕上是**竖长条**（这套轴测的既定读法：无论线朝哪边，"高"都读成屏幕竖直，
      校内围墙就是这么画的）：单元沿 y 一个接一个往上叠 ⇒ 竖条里反复出现
      「框边 → 网 → 白砖底座」。
   ⚠️ **这一段不立杆子**：围栏正对着看是"端面"，每根柱子都投影在同一竖线上，
      逐单元画杆子会叠成**一根深色实条**＝一堵墙（正是网球场围栏第一版栽的坑）。
      杆子由南北两段的**端点**在四个角上补齐。 */
function opRailNS(g, x, ya, yb) {
  const X = Math.round(x) - (OPF_PW >> 1), y0 = Math.round(ya), y1 = Math.round(yb);
  if (y1 <= y0) return;
  const n = Math.max(1, Math.round((y1 - y0) / OPF_UW));
  for (let k = 0; k < n; k++) {
    const uy = Math.round(y0 + ((y1 - y0) * k) / n);
    const bTop = uy - OPF_BH, mTop = uy - OPF_H + OPF_FW;
    px(g, X, bTop, OPF_PW, OPF_BH, OPF_BRICK);              // ② 白砖底座
    px(g, X, bTop, OPF_PW, 1, OPF_BRICK_L);
    px(g, X, uy - 2, OPF_PW, 2, OPF_BRICK_D);
    opMesh(g, X, mTop, OPF_PW, Math.max(1, bTop - mTop));    // ① 网（竖条，透气）
    px(g, X, uy - OPF_H, OPF_PW, OPF_FW, OPF_FRAME);         // ③ 上框边
    px(g, X, uy - OPF_H, 1, OPF_FW, OPF_FRAME_L);
    px(g, X + OPF_PW - 1, uy - OPF_H, 1, OPF_FW, OPF_FRAME_D);
  }
}

function opFenceRect(g, R) {
  const x0 = R.x, x1 = R.x + R.w, y0 = R.y, y1 = R.y + R.h;
  opRailNS(g, x0, y0, y1);            // 西（先画：把四个角让给南北两道）
  opRailNS(g, x1, y0, y1);            // 东
  opRailEW(g, x0, x1, y0);            // 北（远）
  opRailEW(g, x0, x1, y1);            // 南（近）—— 最后画，压住场地近端
}

/* --- 3.7.6 逸夫楼北边操场**左侧**的篮球场（第四十六轮 2026-10-10）---------
   用户原话（逐字）：
     「接下来我们还原一下逸夫楼北操场左侧的篮球场，需要注意的是篮球场四周也是和
       操场一样的围栏围着。并且篮球场地胶是蓝色的，从上到下竖直排布，是四个。
       有示例图你看看，试着进行还原。」        参考图：预览\篮球场.png
   逐条对着做：
     ① 地胶 = **蓝色**（BCOURT_BASE，取自参考图主色 #2369bf 那一族）。
     ② **四块**场地、**从上到下**码成一列，每块**横放**（长轴东西）—— 参考图里
        四块就是横的、一列排下来（每块两端各一套限制区 / 罚球圈 / 三分弧）。
     ③ 四周 = **和操场一样**的围网（就是上面那圈：白砖底座 + 灰钢框 + 接缝杆）。
        判据共用同一个 `opFenceTarget(e)` ⇒ 与 60 段的碰撞盒**同源**（画到哪、挡到哪）。
   ⚠️⚠️ **为什么场地不铺满区域的整个宽**：这块区域是 258×415（宽:高 ≈ 0.62），
      而"四块 28:15 的横场上下码一列"天然是 ≈0.44 ⇒ 按高度取满时，场地只占宽度的
      约 2/3。这里**不拉伸场地去填满宽度** —— 一拉伸中圈就成了椭圆，而参考图里那个
      是**正圆**，一对不上就露馅。余下的宽度铺**同一片蓝地胶**：真实室外场地就是
      这样 —— 地胶铺满一整块、场地线画在中间、四周留跑动区。
   ⚠️ 本段与 §3.7.5 一样：**一次 rng() 都不许调**（见 §3.7.5 头部那条地雷），
      也不许出现第二处 `ellipsePx(`（build.py 钉着"跑道不许退回椭圆"那条）。 */
const BBC_N = 4;        // 场地块数（用户口径："从上到下竖直排布，是四个"）
const BBC_MG = 5;       // 每块场地线距单元边的余量

/* 环形描线：以 (cx, cy) 为心、半轴 (rx, ry)，从 a0 扫到 a1（角度，度）。
   ⚠️ 沿弧打 2×2 px 方块（同 ellipseRing 的做法），**不用 canvas 路径** ——
      路径带抗锯齿，1× 下就看得见、缩小时走 mip 更糊。 */
function arcRing(g, cx, cy, rx, ry, a0, a1, col) {
  const n = Math.max(4, Math.round(Math.abs(a1 - a0) / 3));
  for (let k = 0; k <= n; k++) {
    const t = ((a0 + ((a1 - a0) * k) / n) * Math.PI) / 180;
    px(g, cx + Math.cos(t) * rx, cy + Math.sin(t) * ry, 2, 2, col);
  }
}
function ovalRing(g, cx, cy, rx, ry, col) { arcRing(g, cx, cy, rx, ry, 0, 360, col); }

/* 篮球场的**一端**：底线一侧的全套场地线。
   dir = +1 ⇒ 西端（底线在 x0）；dir = −1 ⇒ 东端（底线在 x0+cw）。
   尺寸一律用**米**（FIBA 2010：场地 28×15、限制区 5.80×4.90、罚球圈 R1.80、
   三分 R6.75、篮筐圆心离底线 1.575、篮板面离底线 1.20 宽 1.80），
   按 cw/28 与 ch/15 各自换算 —— 与"取框用 28:15"是同一套映射。 */
function bbEnd(g, x0, y0, cw, ch, dir, L) {
  const sx = cw / 28, sy = ch / 15;
  const X = m => Math.round(x0 + m * sx), Y = m => Math.round(y0 + m * sy);
  const bx = dir > 0 ? 0 : 28;              // 底线（米）
  const fx = bx + dir * 5.80;               // 罚球线
  const hx = bx + dir * 1.575;              // 篮筐圆心（离底线 1.575 m）
  /* ① 限制区（油漆区）：5.80 × 4.90，居中于场地中轴线两侧 */
  rectLine(g, X(Math.min(bx, fx)), Y(5.05),
           Math.max(1, Math.round(5.80 * sx)), Math.max(1, Math.round(4.90 * sy)), L);
  /* ② 罚球圈 R1.80：只画朝中场那半个（另一半在限制区里，实线画出来会与边线糊成一团） */
  arcRing(g, X(fx), Y(7.5), 1.8 * sx, 1.8 * sy,
          dir > 0 ? -90 : 90, dir > 0 ? 90 : 270, L);
  /* ③ 三分线 = 距边线 0.90 m 的两段直线（底线 → 与弧相接处）+ 以篮筐为心 R6.75 的弧。
        相接处的 dx = √(6.75² − 6.60²) = 1.4150 m —— 写死，免得每帧开方。 */
  const DX = 1.4150;
  for (const m of [0.90, 14.10]) {
    px(g, X(Math.min(bx, bx + dir * DX)), Y(m),
       Math.max(1, Math.round(DX * sx)), 2, L);
  }
  const A = (Math.atan2(6.60, DX) * 180) / Math.PI;      // ≈ 77.90°
  arcRing(g, X(hx), Y(7.5), 6.75 * sx, 6.75 * sy,
          dir > 0 ? -A : 180 - A, dir > 0 ? A : 180 + A, L);
  /* ④ 篮板（面离底线 1.20 m、宽 1.80 m）与篮圈（2×2 拉成 3×3，1× 下才看得见） */
  px(g, X(bx + dir * 1.20), Y(6.60), 2, Math.max(2, Math.round(1.80 * sy)), L);
  px(g, X(hx) - 1, Y(7.5) - 1, 3, 3, L);
}

/* 一块篮球场的全套场地线：边线 + 中线 + 中圈 R1.80 + 两端各一套。 */
function bbCourtLines(g, x0, y0, cw, ch) {
  const L = BCOURT_LINE;
  rectLine(g, x0, y0, cw, ch, L);                                // 场地边线
  px(g, Math.round(x0 + (cw / 2)), y0, 2, ch, L);                // 中线
  ovalRing(g, x0 + cw / 2, y0 + ch / 2, 1.8 * (cw / 28), 1.8 * (ch / 15), L);
  bbEnd(g, x0, y0, cw, ch, 1, L);
  bbEnd(g, x0, y0, cw, ch, -1, L);
}

/* 东半那块篮球场：蓝色地胶 + 四块场地一列 + 操场同款围网。R = 那一行的 zoneRect。 */
function paintBballCluster(g, R) {
  /* ① 蓝色地胶：整块铺满（含围网内侧一圈跑动区） */
  px(g, R.x, R.y, R.w, R.h, BCOURT_BASE);
  px(g, R.x, R.y, R.w, 3, "rgba(255,255,255,0.12)");            // 北缘受光
  px(g, R.x, R.y + R.h - 3, R.w, 3, "rgba(0,0,0,0.18)");        // 南缘背光
  /* ② 四块场地从上到下码一列。
        ⚠️ 南边要让出 OPF_H：那道围网排在最后画、会压住场地近端；东西各让出一根
           围网竖条（OPF_PW 宽）。 */
  const Lx = R.x + OPF_PW, Lw = R.w - OPF_PW * 2;
  const Ly = R.y, Lh = R.h - OPF_H;
  for (let i = 0; i < BBC_N; i++) {
    const uy = Ly + (Lh * i) / BBC_N, uh = Lh / BBC_N;
    if (i) px(g, Lx, Math.round(uy) - 2, Lw, 4, BCOURT_APRON);   // 两块地胶之间的接缝
    /* 场地线：比例钉死 28:15（**不拉伸**），按单元高度取满、横向居中 */
    let ch = Math.round(uh - BBC_MG * 2), cw = Math.round(ch * (28 / 15));
    if (cw > Lw - BBC_MG * 2) {
      cw = Math.round(Lw - BBC_MG * 2);
      ch = Math.round(cw * (15 / 28));
    }
    bbCourtLines(g, Math.round(Lx + (Lw - cw) / 2),
                 Math.round(uy + (uh - ch) / 2), cw, ch);
  }
  /* ③ 四周那圈：**同一个** opFenceRect，与操场那圈逐像素同款（同源同式） */
  opFenceRect(g, R);
}

/* --- 3.7.7 老体育馆旁操场**右侧**的篮球场：七块（第四十七轮 2026-10-10）-----
   用户原话（逐字）：
     「我给你放到对应目录下了，进行还原，注意到操场左侧是观众席和扇形检阅台。
       操场右侧是七个竖直排列的篮球场（蓝色地胶）。这七个篮球场的位置也就是
       新体育馆左侧原来的三个篮球场那里」
   参考图：`预览\老体育馆旁边操场俯视图.png`
   逐条对着做：
     ① 地胶 = **蓝色**（沿用 §3.7.6 的 BCOURT_BASE，全校两块篮球场同一支蓝）。
     ② **七块**场地、**从上到下**码成一列，每块**横放**（长轴东西）—— 参考图里
        七块就是横的、一列排下来。
     ③ 位置 = CAMPUS 里**西边那块篮球场**（2.2306, 0.3889, 0.5479, 1.9090）——
        用户说的"新体育馆左侧原来的三个篮球场那里"就是它（原先是三块，这轮改七块）。
   ⚠️ 与 §3.7.6 同规矩：比例**钉死 28:15、不许拉伸**（拉伸中圈就成了椭圆），
      按单元高度取满、横向居中；余下的宽度铺**同一片蓝地胶**（真实室外场地就是
      地胶铺满一整块、场地线画在中间、四周留跑动区）。
   ⚠️ 这块**不围网**：第四十六轮用户只说东边那块"四周也是和操场一样的围栏围着"，
      这一轮一个字没提围栏 ⇒ `opFenceTarget` 的"只围校园东半"口径保持不动
      （画到哪、挡到哪，那一侧照旧给它加碰撞盒）。 */
const WBC_N = 7;        // 场地块数（用户口径："七个竖直排列的篮球场"）
const WBC_MG = 4;       // 每块场地线距单元边的余量

function paintBballStack(g, R) {
  /* ① 蓝色地胶：整块铺满（含场地四周的跑动区） */
  px(g, R.x, R.y, R.w, R.h, BCOURT_BASE);
  px(g, R.x, R.y, R.w, 3, "rgba(255,255,255,0.12)");            // 北缘受光
  px(g, R.x, R.y + R.h - 3, R.w, 3, "rgba(0,0,0,0.18)");        // 南缘背光
  /* ② 七块场地从上到下码一列（接缝 = 两块地胶之间那条深色垫层） */
  for (let i = 0; i < WBC_N; i++) {
    const uy = R.y + (R.h * i) / WBC_N, uh = R.h / WBC_N;
    if (i) px(g, R.x, Math.round(uy) - 2, R.w, 4, BCOURT_APRON);
    let ch = Math.round(uh - WBC_MG * 2), cw = Math.round(ch * (28 / 15));
    if (cw > R.w - WBC_MG * 2) {
      cw = Math.round(R.w - WBC_MG * 2);
      ch = Math.round(cw * (15 / 28));
    }
    bbCourtLines(g, Math.round(R.x + (R.w - cw) / 2),
                 Math.round(uy + (uh - ch) / 2), cw, ch);
  }
}

/* --- 3.7.8 老体育馆旁操场**左侧**的观众席 + 扇形检阅台（第四十七轮 2026-10-10）--
   用户原话（逐字）：「注意到操场左侧是观众席和扇形检阅台」  参考图同 §3.7.7。
   参考图里的样子：一条**通长的浅灰看台**贴着跑道西侧，台面上一道道横排台阶线；
   看台**正中间**再往东挑出一个**扇形检阅台**（半个扇面：辐射分格 + 同心弧）。
   ⚠️ 能铺多宽是**量出来的**，不是拍的（量法见下面那三段实测量）：
      操场西界在 world x 423.4；西边被老体育馆的**实体**（东缘 ≈ 383）和它楼前
      那条人行道占着 —— 那条道在格子里是 `K.ROAD` / cls=1 的砖石铺装，占 386..417，
      东缘 417..420 还压着一道路缘石，再往东 420..426 是草地，**跑道最外那道深色
      缓冲带从 425 起**。⇒ 整条缝只有 ≈41px；而参考图里"看台 + 扇形"加起来约
      跑道宽的 30%，这里只有 41/404 ≈ 10% —— 折中的取法是把这 41px **铺满**：
        席身   385..404（19px 宽，压在人行道上；西侧让出原来那道路缘石）
        扇形   404..424（平边**贴席身东缘**，弧沿往东挑 20px —— 挑出量 ≈ 席身宽，
                           与参考图里"檐口比看台探出一个身位"的比例一致）
      ⚠️ 扇形东端**不许再往东**：跑道最外那道缓冲带从 425 起，压上去就是
         "跑道被啃了一口"（第四十五轮刚验过的跑道，别去碰）。
   ⚠️ 本函数排在 `buildGround()` 的**最后一步**（在 paintWalls 之后）——
      跑道路面 / 路缘石 / 泥土带都已经画完 ⇒ 看台直接压在上面，
      **不需要**给路缘石加豁免（§2.7.5 的 `_courtHit` 那套只在"后画的会盖掉先画的
      才要豁免"时才有必要，这里顺序反过来就够了）。若哪天把它挪回 paintTracks 那一步，
      就必须补一条豁免，否则那道路缘石会竖着从看台中间穿过去。
   ⚠️ 只有**西半那个操场**带看台：判据 `stdTarget(e)` 与 §3.7.5 的 opFenceTarget
      互为补集（东半那个操场第四十五轮已经围了网，这一轮不加看台）。
   ⚠️ 本段一次 rng() 都不许调（见 §3.7.5 头部的地雷）。 */
const STD_TIP = 1;      // 扇形东端：越过操场西界 1px（425 起是跑道缓冲带，不碰）
const STD_FR  = 20;     // 扇形往东挑出的半径（东西向）—— 全缝 41px 减去席身 19px
const STD_W   = 19;     // 席身宽（扇形平边就在席身东缘上，压进去一圈会盖掉阶梯线）
const STD_FY  = 56;     // 扇形南北向半高 ⇒ 全长 112px，约占席身长的 16%
                        //   （参考图里扇面高 ≈ 看台长的 15%、其"挑出 : 半高" ≈ 1 : 2.8，
                        //    20 × 2.8 = 56 —— 两个比例同时对上，不是随便挑的数）
const STD_IA  = 28;     // 席身南北端各让出 28px
const STD_STEP_P = 7;   // 一级踏面的高（台阶线间距）
/* ⚠️ 这几个色是**故意比老体育馆前那条人行道（`K.ROAD`/cls=1 的浅灰砖）深一档**的：
   第四十七轮第一版用了跟砖石几乎同色的 `#cfcec8`，结果看台那排 7px 踏面线跟
   人行道的砖缝"撞纹理"，整条缝糊成一片灰，看不出是看台。坐席底压到暖灰、
   受光前缘提到近白，踏面节奏才跳得出来。 */
const STD_TOP = "#c3c0b4", STD_STEP = "#a5a296";
const STD_LIT = "#e9e7dd", STD_EDGE = "#7c7a71";
const FAN_BASE = "#d3d1c6", FAN_LINE = "#8e8c83", FAN_RIM = "#605f58";

function stdTarget(e) {
  if (e[1] !== "track") return false;                  // 只认操场
  return IX(e[2] + e[4] / 2) < WORLD_W * 0.5;          // 西半：老体育馆旁那个
}

/* 观众席 + 检阅台的**占地矩形**（含扇形外挑）。
   37 段拿它画、60 段拿它加碰撞盒 —— 两边调**同一个**函数 ⇒ 画到哪、挡到哪
   （与 §3.7.5/§3.7.6 的 opFenceTarget 同一条规矩）。 */
function grandstandRect(e) {
  const R = zoneRect(e);
  const sx0 = (R.x + STD_TIP - STD_FR) - STD_W;        // 席身西缘（= 扇形平边再往西一个身位）
  return { x: sx0, y: R.y + STD_IA, w: (R.x + STD_TIP) - sx0, h: R.h - STD_IA * 2 };
}

/* 扇形里的一根辐条：从平边往弧沿打 2×2 px 方块（同 arcRing 的硬边做法，不走路径）。 */
function fanSpoke(g, cx, cy, rx, ry, deg, col) {
  const t = (deg * Math.PI) / 180;
  for (let k = 0.20; k <= 1.0; k += 0.07)
    px(g, cx + Math.cos(t) * rx * k, cy + Math.sin(t) * ry * k, 2, 2, col);
}

function paintGrandstand(g) {
  for (const e of CAMPUS) {
    if (!stdTarget(e)) continue;
    const R = zoneRect(e);
    const fx = R.x + STD_TIP - STD_FR;                 // 扇形平边（西）的 x
    const sx0 = fx - STD_W, sx1 = fx;                  // 席身西缘 / 东缘（平边＝东缘）
    const sy0 = R.y + STD_IA, sy1 = R.y + R.h - STD_IA;
    /* ① 席身：浅灰坐席 + 一级级踏面线（参考图里那排"梯格"） */
    px(g, sx0, sy0, STD_W, sy1 - sy0, STD_TOP);
    for (let y = sy0; y < sy1 - 2; y += STD_STEP_P) {
      px(g, sx0, y, STD_W, 2, STD_LIT);                // 这一级踏面的受光前缘
      if (y + STD_STEP_P - 1 < sy1) px(g, sx0, y + STD_STEP_P - 1, STD_W, 1, STD_STEP);
    }
    px(g, sx0, sy0, STD_W, 3, STD_EDGE);               // 北端封头
    px(g, sx0, sy1 - 3, STD_W, 3, STD_EDGE);           // 南端封头
    px(g, sx0, sy0, 1, sy1 - sy0, STD_EDGE);           // 西缘
    /* ② 席身东侧的投影（左上光源 → 右下，全图同口径） */
    px(g, sx1, sy0 + 3, 3, sy1 - sy0 - 6, "rgba(14,18,28,0.16)");
    /* ③ 扇形检阅台：平边**贴席身东缘**、弧沿往东挑一个身位；同心弧 + 辐射分格
       ⇒ 席身那一整排阶梯线全都露着（第四十七轮第一版把平边压进席身 4px、
          再加上扇形半径 35px 太大，整条看台被扇面盖成一个大色块 —— 已改） */
    const fy = R.y + R.h / 2;
    for (let y = Math.round(fy - STD_FY); y <= Math.round(fy + STD_FY); y++) {
      const t = (y - fy) / STD_FY;
      const k = Math.sqrt(Math.max(0, 1 - t * t));
      px(g, fx, y, STD_FR * k, 1, FAN_BASE);           // 扇面（只铺平边以东那半）
      if (STD_FR * k > 2) px(g, fx + STD_FR * k - 2, y, 2, 1, FAN_RIM);   // 弧沿描边
    }
    px(g, fx - 1, fy - STD_FY, 2, STD_FY * 2, FAN_RIM);                  // 平边（贴席身）
    for (const k of [0.45, 0.72])
      arcRing(g, fx, fy, STD_FR * k, STD_FY * k, -90, 90, FAN_LINE);
    for (let d = -75; d <= 75; d += 25) fanSpoke(g, fx, fy, STD_FR, STD_FY, d, FAN_LINE);
  }
}
