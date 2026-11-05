/* =========================================================
   5.2 升旗台 —— 思源楼正门正对的草坪凹口
   ---------------------------------------------------------
   用户口述："位置在思源楼那个门正对的草坪，属于草坪靠近路的一侧，
   相当于草坪凹进去一小块；浅灰色底座 + 高高的银色旗杆 + 五星红旗"。

   分四段，调用点全在 60_assemble.js，**顺序缺一不可**：
     ① stampFlagNotch()   —— buildGround() **之前**：把凹口那 5×4 格从草地改成
        K.BLD。这样草地不再长到那里；scatter() 不会往里塞东西（它只认
        GRASS / PLAZA / ROAD / FREE，没有 K.BLD 分支）；treeSpotOK() 也拒绝
        （同样只认 GRASS / PLAZA）。
     ② paintFlagGround()  —— buildGround() **之后**：把凹口铺成浅灰石板。
        必须用覆盖重绘 —— K.BLD 的既有画法是"楼前硬地"（混凝土 + 棕罩），
        那是给 39 栋楼的基座用的，旗台要的是平整的石板地。
     ③ flagStand()        —— 底座 + 旗杆 + 旗面，挂在 §6.5 之后、scatter() 之前
        （addSolid 进了 solids，ptBlocked 才会让散射点与行道树避开台子）。
     ④ animateFlag(dt)    —— 每帧换旗面帧（主循环补丁 4，紧跟 animateWater）。
        **旗面是动的**：见 §5.2.4 的风动模型。

   几何（世界像素）：
     凹口 80×64 = 5×4 个 16px 格，x1984..2063，中轴 2024 = 思源楼门中心 2023.9。
     ⚠️ 凹口北沿取 y1584 而不是草坪的数学起点 1568.5 —— 草坪第一行草格是
        y1584（y1568 那一行被东西主路的路缘石占着，_gt.py 探针实测 '2' 即沥青），
        从 1584 起才是"贴着路边的草"，凹口正好啃在草的第一行上。
   ========================================================= */
const FLAG_CX   = 2024;                                       // 门轴
const FLAG_Z    = { x: 1984, y: 1584, w: 80, h: 64 };         // 草坪凹口
const FLAG_PZ   = { x: 2000, y: 1598, w: 48, t: 28, f: 8 };   // 底座：顶面 48×28 + 南立面 8
const FLAG_FOOT = FLAG_PZ.y + FLAG_PZ.t + FLAG_PZ.f;          // 1634 落地线
const FLAG_BY   = FLAG_PZ.y + FLAG_PZ.t / 2;                  // 1612 杆脚（顶面正中）
const FLAG_PTOP = 1462;                                       // 杆顶（杆净高 150px，是路灯 62px 的两倍半）
const FLAG_FT   = 1464;                                       // 旗面顶
const FLAG_FW = 60, FLAG_FH = 40;                             // 旗面 60×40 = 官方 30×20 单位的 2 倍（星位全整数）
/* 调色：凹口铺装取**偏暖的中灰**，不能取冷浅灰 —— 路对面就是人行道的混凝土
   （#b6b0a3 系）与沥青，凹口若也是冷浅灰，隔着路缘石看过去会连成一片，
   "草坪被挖掉一块"这个形状就没了。底座再用亮一档的浅灰压在暖灰铺装上。 */
const FLAG_PAVE  = "#a39e90", FLAG_PAVE_J = "#8c877a";
const FLAG_BASE_T = "#d2d5d4", FLAG_BASE_F = "#9aa0a1";
const FLAG_POLE_L = "#dee3e5", FLAG_POLE_M = "#b9c0c4";
const FLAG_POLE_D = "#868d92", FLAG_RED = "#cf2b23", FLAG_YEL = "#ffd93b";

/* --- 5.2.1 凹口：把 5×4 格从草地划掉（buildGround 之前调） ---
   ⚠️ stampRectAbs 的 c1 = floor((x+w)/CELL)、r1 = floor((y+h)/CELL) 是**闭区间**，
      传精确宽高会多盖一格：这里会多啃掉东边一列（x2064）与南边一行（y1648）的草。
      所以必须传 w-1 / h-1。 */
function stampFlagNotch() {
  stampRectAbs(FLAG_Z.x, FLAG_Z.y, FLAG_Z.w - 1, FLAG_Z.h - 1, K.BLD);
}

/* --- 5.2.2 凹口铺装（buildGround 之后调，传 groundCanvas 的 2d context） --- */
function paintFlagGround(g) {
  /* 独立种子：buildGround 已经跑完了，这里的 rng 不会扰动它那条序列 */
  const rng = makeRng(20260913);
  const Z = FLAG_Z, x1 = Z.x + Z.w, y1 = Z.y + Z.h;

  /* ① 石板 16px 见方：缝色打底 + 逐块色差（与 paintPlazas 同一手法，尺寸改小） */
  px(g, Z.x, Z.y, Z.w, Z.h, FLAG_PAVE_J);
  for (let y = Z.y; y < y1; y += 16) {
    for (let x = Z.x; x < x1; x += 16) {
      const k = (rng() - 0.5) * 0.07;
      px(g, x, y, 15, 15, shade(FLAG_PAVE, k));
      px(g, x, y, 15, 1, shade(FLAG_PAVE, k + 0.10));               // 上棱受光
      px(g, x, y + 14, 15, 1, "rgba(14,18,28,0.10)");               // 下棱背光
      if (rng() < 0.16) px(g, x + 3 + rng() * 9, y + 3 + rng() * 9, 2, 2, "rgba(14,18,28,0.09)");
    }
  }
  /* ② 三面石缘：把凹口与草坪的硬边收成"修过的边"。北面不砌 ——
        东西主路的路缘石（paintKerbs 画的，y1581..1583）已经在那一侧了。 */
  const R = 3;
  px(g, Z.x, Z.y, R, Z.h, KERB_TOP);                                // 西缘（受光侧）
  px(g, Z.x + R, Z.y, 1, Z.h, KERB_DARK);
  px(g, x1 - R, Z.y, R, Z.h, KERB_LIT);                             // 东缘（背光侧）
  px(g, x1 - R - 1, Z.y, 1, Z.h, KERB_DARK);
  px(g, Z.x, y1 - R, Z.w, R, KERB_LIT);                             // 南缘
  px(g, Z.x, y1 - R - 1, Z.w, 1, KERB_DARK);
  /* ③ 版缘外的过渡带：西缘（迎光侧）走 paintDirt 的土色，与草地的其它硬地边界一致；
        东、南两缘（背光侧）改压一道暗绿的"切口"—— 草面比挖下去的地坪高，
        这两条边正是光被挡住的地方。这一笔是"凹"能读出来的关键。 */
  const band = mix(DIRT, GRASS_RAMP[1], 0.55);
  const cut  = mix(shade(GRASS_RAMP[0], -0.26), DIRT, 0.32);
  px(g, Z.x - 2, Z.y, 2, Z.h + 2, band);
  px(g, x1, Z.y, 2, Z.h + 2, cut);
  px(g, Z.x - 2, y1, Z.w + 4, 2, cut);
}

/* --- 5.2.3 五角星：逐列扫描线（内半径 = R·0.382 是正五角星的经典比例） ---
   `rot` 是整颗星的旋转角：大星 0（一个角朝天），四颗小星各自转向大星中心
   （国旗的官方画法），所以参数不能省。 */
function starPts(cx, cy, R, rot) {
  const p = [], r = R * 0.382;
  for (let i = 0; i < 10; i++) {
    const a = rot - Math.PI / 2 + i * Math.PI / 5, rad = (i % 2) ? r : R;
    p.push([cx + Math.cos(a) * rad, cy + Math.sin(a) * rad]);
  }
  return p;
}
/* 星心落在画布 (cx, cy)；x0c = 旗面左沿的画布 x，用来找这颗星各列在布上的位置 */
function starFill(g, x0c, cx, cy, R, rot, col, t) {
  const p = starPts(cx, cy, R, rot);
  for (let x = Math.floor(cx - R); x <= Math.ceil(cx + R); x++) {
    const xs = x + 0.5, hit = [];
    for (let i = 0, j = 9; i < 10; j = i++) {
      const a = p[i], b = p[j];
      if ((a[0] > xs) !== (b[0] > xs))
        hit.push(a[1] + (b[1] - a[1]) * (xs - a[0]) / (b[0] - a[0]));
    }
    if (hit.length < 2) continue;
    hit.sort((u, v) => u - v);
    /* ⚠️ 必须与布面同一列、调**同一个 clothDY**、且列号**不带 +0.5** ——
       差半列就会在 round 的边界上与布面差 1px，旗一动星星就像浮在旗子前面。 */
    const dy = clothDY(x - x0c, t);
    for (let i = 0; i + 1 < hit.length; i += 2) {                    // 逐对取区间（凹角列会有两段）
      const ya = Math.round(hit[i]), yb = Math.round(hit[i + 1]) - 1;
      if (yb >= ya) px(g, x, ya + dy, 1, yb - ya + 1, col);
    }
  }
}

/* --- 5.2.4 风动：旗面波动 ---
   旗面**不烘焙进台身精灵**，而是按一个完整周期切成 FLAG_FRAMES 张，运行时逐帧换
   `prop.img` —— 换帧是零成本、且同尺寸换图不影响深度排序/缩放（渲染循环直接取
   `p.img.width`）。比放"地面之后、道具之前"那个动态层好：那样旗面会永远压在
   所有道具下面，人从杆前走过时杆身上半截在旗后、下半截在旗前，穿帮。 */
const FLAG_FRAMES = 16;     // 一个波动周期 16 帧
const FLAG_CYCLE  = 0.72;   // 一个周期 0.72s ≈ 22 帧/秒：抖得起来又不闪
const FLAG_GUST   = 0.45;   // 阵风幅度（±45% 速度）。周期 2π/0.55 ≈ 11s
const FLAG_TAU = Math.PI * 2;

/* 布面第 r 列在相位 t∈[0,1) 的上下位移。两股叠加，**各自都以 1 为周期** ——
   只要有一股不是整周期，第 15 帧转回第 0 帧就会跳一下：
     · 行波：沿旗面向东传播；摆幅按 u² 涨，贴着杆那几列几乎钉死（真旗子就是这样）
     · 驻波：整幅轻晃、与行波不同相 → 各列振幅不均，出现个别"抽得凶"的点
   ⚠️ 星星也必须调这个函数取 dy，否则布一抖星星就从旗面上浮起来。 */
function clothDY(r, t) {
  const u = r / FLAG_FW;
  return Math.round((0.7 + 2.5 * u * u) * Math.sin((u - t) * FLAG_TAU)
                    + 1.6 * u * Math.sin((t + 0.15) * FLAG_TAU));
}
/* 褶皱明暗：与行波同相才像布（不同相 = 光比皱纹跑得快，读起来像贴纸）。
   振幅同样随 u 涨 —— 自由端的褶子更深。 */
function clothTone(r, t) {
  const u = r / FLAG_FW;
  return (0.05 + 0.07 * u) * Math.cos((u - t) * FLAG_TAU + 0.9);
}

/* 旗面 + 五星。t = 相位；`fx/fy` 是旗面左上角（杆侧、静止位）。 */
function flagCloth(g, t) {
  const fx = FLAG_CX + 1, fy = FLAG_FT, x0c = flagX(fx);
  for (let r = 0; r < FLAG_FW; r++) {
    const dy = clothDY(r, t), k = clothTone(r, t);
    px(g, flagX(fx + r), flagY(fy + dy), 1, FLAG_FH, shade(FLAG_RED, k));
    px(g, flagX(fx + r), flagY(fy + dy), 1, 1, shade(FLAG_RED, k + 0.22));               // 上沿卷边受光
    px(g, flagX(fx + r), flagY(fy + dy + FLAG_FH - 2), 1, 2, shade(FLAG_RED, k - 0.24)); // 下沿背光
  }
  /* 星按官方 30×20 单位排版 ×2：大星心 (10,10) R6；四小星心 (20,4) (24,8) (24,14) (20,18)
     R2，各自的角都指向大星中心。星心给的是**静止位**，逐列的 dy 由 starFill 内部补，
     图案于是跟着布一起被揉动。 */
  const bx = flagX(fx + 10), by = flagY(fy + 10);
  starFill(g, x0c, bx, by, 6, 0, FLAG_YEL, t);
  for (const s of [[20, 4], [24, 8], [24, 14], [20, 18]]) {
    const sc = flagX(fx + s[0]), sr = flagY(fy + s[1]);
    starFill(g, x0c, sc, sr, 2, Math.atan2(by - sr, bx - sc) + Math.PI / 2, FLAG_YEL, t);
  }
}

/* --- 5.2.5 升旗台精灵：浅灰底座 + 银色旗杆 + 五星红旗 ---
   锚点约定与其它道具一致（ax/ay = 精灵内到"底部中心"的偏移），baseY 由调用点给。
   拆成两级：**台身**（投影 + 底座 + 杆 + 顶球，刚性、与风无关）只画一次，
   逐帧 `drawImage` 复制过去，再叠当帧的旗面。 */
const FLAG_CV_X0 = 1992, FLAG_CV_Y0 = 1450, FLAG_CV_W = 108, FLAG_CV_H = 214;  // 内容 x1996..2093 / y1454..1659
const flagX = v => v - FLAG_CV_X0, flagY = v => v - FLAG_CV_Y0;                // 世界 → 画布

function flagStandBody() {
  const PZ = FLAG_PZ, x1 = PZ.x + PZ.w;
  const c = mkCanvas(FLAG_CV_W, FLAG_CV_H), g = c.getContext("2d");

  /* ① 方向性投影：服从全局 SUN(-0.60,-0.80) → 影子朝右下。
        ⚠️ 拉伸量取 (8,10) 而不是楼用的 (16,21)：楼是几十米高，这是抬起来一层
           台阶（≈1m），影子拉长一倍会在石板地上切出一道很硬的斜边，
           读起来像贴图错误而不是投影 —— 这里要的是"平台周围一圈暗"，不是投影。 */
  shadowQuad(g, flagX(PZ.x), flagY(PZ.y), flagX(x1), flagY(FLAG_FOOT), 8, 10, 0.26, 4);

  /* ② 顶面 48×28 浅灰石板：8px 板缝（磨光花岗岩的分块），四缘按 SUN 分明暗 */
  const tY = PZ.y;
  px(g, flagX(PZ.x), flagY(tY), PZ.w, PZ.t, FLAG_BASE_T);
  for (let y = tY + 8; y < tY + PZ.t; y += 8)
    px(g, flagX(PZ.x) + 1, flagY(y), PZ.w - 2, 1, "rgba(14,18,28,0.07)");
  for (let x = PZ.x + 8; x < x1; x += 8)
    px(g, flagX(x), flagY(tY) + 1, 1, PZ.t - 2, "rgba(14,18,28,0.05)");
  px(g, flagX(PZ.x), flagY(tY), PZ.w, 1, shade(FLAG_BASE_T, 0.26));              // 北缘受光
  px(g, flagX(PZ.x), flagY(tY), 1, PZ.t, shade(FLAG_BASE_T, 0.14));              // 西缘受光
  px(g, flagX(x1) - 2, flagY(tY), 2, PZ.t, shade(FLAG_BASE_T, -0.22));           // 东缘背光
  px(g, flagX(PZ.x), flagY(tY + PZ.t) - 1, PZ.w, 1, shade(FLAG_BASE_T, -0.16));

  /* ③ 南立面 8px：顶棱提亮、底部压暗，竖缝与顶面同格 */
  const fY = tY + PZ.t;
  px(g, flagX(PZ.x), flagY(fY), PZ.w, PZ.f, FLAG_BASE_F);
  px(g, flagX(PZ.x), flagY(fY), PZ.w, 1, shade(FLAG_BASE_F, 0.44));
  px(g, flagX(PZ.x), flagY(fY + PZ.f - 2), PZ.w, 2, shade(FLAG_BASE_F, -0.28));
  for (let x = PZ.x + 8; x < x1; x += 8)
    px(g, flagX(x), flagY(fY + 1), 1, PZ.f - 3, "rgba(14,18,28,0.09)");
  contactBand(g, flagX(PZ.x) + 1, flagX(x1) - 1, flagY(FLAG_FOOT) - 1, 1, 0.24);     // 接地最深窄带

  /* ④ 杆脚套环：杆是插在台面上的，没有这一圈就只是"一根线贴在石头上" */
  px(g, flagX(FLAG_CX) - 3, flagY(FLAG_BY) - 2, 7, 3, FLAG_POLE_D);
  px(g, flagX(FLAG_CX) - 3, flagY(FLAG_BY) - 2, 7, 1, FLAG_POLE_L);

  /* ⑤ 杆身：3px 宽，左列高光、右列背光；两道箍把它从"塑料棍"救回来 */
  const pH = FLAG_BY - FLAG_PTOP;
  px(g, flagX(FLAG_CX) - 1, flagY(FLAG_PTOP), 3, pH, FLAG_POLE_M);
  px(g, flagX(FLAG_CX) - 1, flagY(FLAG_PTOP), 1, pH, FLAG_POLE_L);
  px(g, flagX(FLAG_CX) + 1, flagY(FLAG_PTOP), 1, pH, FLAG_POLE_D);
  for (const yy of [FLAG_PTOP + 44, FLAG_PTOP + 96]) {
    px(g, flagX(FLAG_CX) - 1, flagY(yy), 3, 2, FLAG_POLE_D);
    px(g, flagX(FLAG_CX) - 1, flagY(yy), 3, 1, FLAG_POLE_L);
  }

  /* ⑥ 顶球：三层同心，高光偏左上（球是这一整根杆唯一的"体积"） */
  const ballY = FLAG_PTOP - 4;
  circlePx(g, flagX(FLAG_CX), flagY(ballY), 3, FLAG_POLE_D);
  circlePx(g, flagX(FLAG_CX) - 1, flagY(ballY) - 1, 2, FLAG_POLE_M);
  px(g, flagX(FLAG_CX) - 2, flagY(ballY) - 2, 1, 1, FLAG_POLE_L);

  return c;                       // 旗面不在这里画 —— 见 §5.2.4 flagCloth
}

/* --- 5.2.6 全帧烘焙 + 换帧 ---
   台身画一次，逐帧复制过去再叠当帧旗面：16 张 108×214 的离屏画布共约 1.5 MB，
   烘焙多花几毫秒，逐帧开销却与静态版**完全一样**（一次 drawImage）。 */
const flagFrames = [];
function flagStand() {
  const body = flagStandBody();
  for (let i = 0; i < FLAG_FRAMES; i++) {
    const c = mkCanvas(FLAG_CV_W, FLAG_CV_H), g = c.getContext("2d");
    g.drawImage(body, 0, 0);
    flagCloth(g, i / FLAG_FRAMES);
    flagFrames.push(c);
  }
  return { canvas: flagFrames[0], ax: FLAG_CX - FLAG_CV_X0, ay: FLAG_FOOT - FLAG_CV_Y0 };
}

/* --- 5.2.7 风动节拍（每帧，由主循环补丁 4 在 animateWater 之后调用） ---
   `flagProp` 惰性取一次（props 里带 tag "flag" 的那件），之后换 p.img 即可：
   帧尺寸全等，深度排序只看 baseY、落笔只看 img.width/height，两者都不受影响。 */
let flagT = 0, flagPhase = 0, flagFrameI = -1, flagProp = null;
function animateFlag(dt) {
  if (!flagProp) { flagProp = props.find(p => p.tag === "flag"); if (!flagProp) return; }
  /* ⚠️ dt 可以是负的：主循环的 `last = performance.now()` 在**整页烘焙之后**才求值，
     而 rAF 首帧的 now 有可能比它小（时基倒挂）—— `Math.min(0.05, 负数)` 只夹上界，夹不住。
     NaN（now 缺失）也一并挡掉。负 dt 本身只倒退一帧就走出来了，但下面的相位是**累积**的，
     一旦变负要爬几十帧才回正，而取模会**立刻**越界（见下面那道闸）。 */
  if (!(dt > 0)) dt = 0;
  flagT += dt;
  /* 阵风：速度按 ~11s 周期在 55%~145% 之间起伏。累积的是**相位**而不是帧号 ——
     直接拿帧号乘阵风系数会在阵风转向时倒退、旗子一顿一顿的。 */
  flagPhase += dt / FLAG_CYCLE * (1 + FLAG_GUST * Math.sin(flagT * 0.55)) * FLAG_FRAMES;
  /* ⚠️⚠️ JS 的 % 对负数返回负数：flagPhase < 0 时 Math.floor(-22.02) % 16 = -7（不是 9），
     flagFrames[-7] 是 undefined；写进 flagProp.img 之后**下一帧** render 就死在
     `p.img.width` 上，而异常抛在 requestAnimationFrame(loop) **之前** → rAF 断链 →
     整个页面永久定格（2026-09-13 在 Edge 127 上实测复现，Chrome 因首帧时基不同而没露头）。
     所以索引自己夹正，不指望上游把 dt 喂干净。 */
  const i = ((Math.floor(flagPhase) % FLAG_FRAMES) + FLAG_FRAMES) % FLAG_FRAMES;
  /* 最后一道闸：img 一旦被写成 undefined 就是**整页死**，代价和"这一帧不换旗面"
     完全不对称，所以取不到就宁可跳过也不写。 */
  if (i !== flagFrameI) { flagFrameI = i; if (flagFrames[i]) flagProp.img = flagFrames[i]; }
}

/* --- 5.2.8 旗杆净空 ---
   散射与行道树都是"各摆各的"：台子东南侧、路北侧都可能长出树，树冠（最宽 86、
   最高 104）一盖就把杆身或旗面糊掉。台子自己只挡住了凹口那一小块，管不到外围。
   ⚠️ 必须排在 §6.6c 的 clearPropTreeClash() **之后** —— 先跑会改变它保留/丢弃的
      集合，clashDropped 的计数跟着变，验收数字就对不上了。 */
const FLAG_CLR = { x: 1996, y: 1443, w: 98, h: 197 };        // 底座 + 杆身 + 旗面
function clearFlagClearance() {
  const C = FLAG_CLR, cx1 = C.x + C.w, cy1 = C.y + C.h;
  const keep = [];
  let dropped = 0;
  for (const p of props) {
    /* 旗杆自己保留；宽 > 110 的当楼处理（楼的美术盒整个在落地线以北，
       且这一片的楼是思源楼，落地线 1431.6 在净空区之外） */
    if (p.tag === "flag" || p.img.width > 110) { keep.push(p); continue; }
    const x0 = p.x - p.ax, y0 = p.y - p.ay;
    if (x0 < cx1 && x0 + p.img.width > C.x && y0 < cy1 && y0 + p.img.height > C.y) {
      dropped++;
      continue;
    }
    keep.push(p);
  }
  props.length = 0;
  for (const p of keep) props.push(p);
  return dropped;
}
