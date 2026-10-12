/* =========================================================
   5.3 齿轮铁砧雕塑 —— 思源楼正门前、草坪南缘的凹口
   ---------------------------------------------------------
   用户口述："思源楼下边的草坪，升旗台是在草坪上边那个边，雕塑则是在草坪下边
   那个边，紧挨着从南门延伸过来的水泥路，也是靠近路挖一块地方，类似于草坪凹陷
   进去。"

   造型依据两张现场照片（_photo/diaosu.jpg 手机相册截图 / siyuanlou2.jpg 正面美图），
   自下而上六层。**一层都不是校徽** —— 用户口中的"校徽"实为齿轮（校徽的核心元素
   正是齿轮），实物是"大齿轮环 + 环心一个铁砧"的机械主题雕塑：
     ① 环形红花坛（红花草），外缘一圈深红陶盆向日葵
     ② 双层圆形石台基（黄绿锈石，顶面是**水盆**，柱间有喷泉 —— 第一版省略了，
        2026-09-13 第六轮按用户要求补上，见 §5.3.4b diaJet）
     ③ 四根浅灰圆柱（2×2 四角排列）
     ④ 方形台座：顶面板 + 南立面，立面上**一排圆孔**
     ⑤ 铁砧：喇叭形砧座 → 横置砧体（右端出"喙"）→ 砧体上两块方柱 + 两块斜方料
        + 砧座前沿斜插一根细杆
     ⑥ 大齿轮环：外圈 24 个三角齿，环体较细，右侧垂一小段起重链

   分四段，调用点全在 60_assemble.js，**顺序缺一不可**（与 §5.2 升旗台同构）：
     ① stampDiaNotch()     —— buildGround() **之前**：凹口那 7×6 格从草地改成
        K.BLD。草地不再长过去；scatter() 不会往里塞东西（它只认 GRASS / PLAZA /
        ROAD / FREE，没有 K.BLD 分支）；treeSpotOK() 同样拒绝。
     ② paintDiaGround()    —— buildGround() **之后**：覆盖重绘凹口铺装。
        K.BLD 的既有画法是"楼前硬地"，那是给 39 栋楼基座用的，这里要平整石板。
     ③ diaStand()          —— 雕塑精灵，挂在 §6.5b 之后、scatter() 之前
        （addSolid 进了 solids，ptBlocked 才会让散射点与行道树避开它）。
     ④ clearDiaClearance() —— 净空清树，**必须**排在 §6.6c 冲突清理之后。

   几何（世界像素）：
     凹口 112×96 = 7×6 个 16px 格，x1968..2079，中轴 2023.5 ≈ 2024 = 思源楼门中心，
     与升旗台 FLAG_CX 同轴。北沿 y1776、南沿 y1871 = 大草坪**最后一行草格**
     （草坪南缘的数学线是 y1875，草格到 1871 为止，凹口正好啃在草的最后一行上，
     下缘直接贴住草坪南横路）。
     ⚠️ x 取 1968 而不是 1976：stampRectAbs 的 c0 = floor(x/CELL) 是**闭区间起点**，
        1976/16 = 123.5 会从第 123 格（x1968）起算，白啃西边半格；起点取 16 的
        整倍数才严丝合缝（升旗台的 1984 同理）。
     ⚠️ 凹口与旗台凹口（y1584..1647）之间还留着 y1648..1775 共 128px 连续的草，
        草坪不会被两个凹口拦腰截断。
   ========================================================= */
const DIA_CX    = 2024;                                   // 门轴，与 FLAG_CX 同轴
const DIA_Z     = { x: 1968, y: 1776, w: 112, h: 96 };    // 草坪凹口 7×6 格
const DIA_FOOT  = 1854;                                   // 花坛外缘南端 = 落地线

/* --- 自下而上的高度表（世界 y；2.5D 俯角约 30°，圆的投影比 1.71:1） ---
   每个圆都是椭圆：水平直径 d → 屏幕上 rx = d/2、ry = d/(2·1.71)。*/
const DIA_FLW_CY = 1832;                                  // 花坛环心
const DIA_FLW_RX = 38, DIA_FLW_RY = 22;                   // 花坛外缘 76×44
/* 花坛内缘 = 石台基外径：红环直接顶到石台上，中间不留缝。
   环宽 20×11（水平×垂直）—— 照片里红花是一大片而不是一圈细边，内径不能给大。 */
const DIA_FLW_IX = 18, DIA_FLW_IY = 11;                   // 花坛内缘 —— 即石台基顶面椭圆
/* ⚠️ 石台基的高度直接吃掉花坛**北侧**那一圈红：顶面中心 = 花坛环心 − h，
   顶面北缘 = 花坛环心 − h − ry，而红环北侧的可见宽度 = 22 − h − ry。
   h=8 时只剩 3px，花坛看过去就是"下半圈红、上半圈全被石台盖住"。
   h=5 留出 6px，北侧那圈红才读得出来。 */
const DIA_PL_H   = 5;                                     // 石台基侧壁高
/* 柱是**一排 4 根**、不是 2×2 四角 —— 照片（diaosu.jpg 放大图）里能同时看到
   四根柱子横排，而 2×2 在正前方视角下后排会被前排完全遮死，只剩两根。
   一排 4 根则任何视角都数得出四根，且与"四根柱顶一块方板"的结构吻合。 */
const DIA_COL_H  = 26, DIA_COL_W = 5;                     // 圆柱：高 26、径 5（照片里柱子是细高的）
const DIA_COL_GAP = 10;                                   // 柱间距：4 根跨 30px，落在 34px 的台座里
const DIA_COL_FOOT = 1833;                                // 柱脚 y：踩在石台基顶面椭圆上（1816..1838）
const DIA_PED_W  = 34, DIA_PED_T = 13, DIA_PED_F = 6;     // 台座：宽 34 / 顶面投影 13 / 立面 6（薄板）
const DIA_PED_FOOT = DIA_COL_FOOT - DIA_COL_H;            // 1807 = 台座底面南沿 = 柱顶
const DIA_PED_TY   = DIA_PED_FOOT - DIA_PED_F - DIA_PED_T;// 1788 = 台座顶面北沿
const DIA_ANV_BY = 1793, DIA_ANV_H = 9;                   // 砧座底面中心 y / 高
/* 齿轮环心抬到 1771：环心 1775 时环的下半（1785..1797）正好压进台座顶面
   （1785..1798），屏幕上就只剩"两段弧挂在台座上方"。抬 4px 后只被台座咬掉
   6px，露出 86% —— 与照片里"齿轮基本整个露出、只有下缘被砧座挡住"一致。 */
const DIA_GEAR_CY = 1771, DIA_GEAR_R = 22, DIA_GEAR_T = 4;// 齿轮环心 / 外半径 / 环体厚

/* 调色。铁件取**深锈褐**（比纯黑暖，照片里是铸铁生锈的暗褐灰）；
   石件取米白偏灰；花坛取三档红 —— 全比升旗台的浅灰底座暗一档，
   两处凹口隔着 128px 的草相望，深浅拉开才不会看成同一处。 */
const DIA_FLW_D = "#7e2b25", DIA_FLW_M = "#b0433a", DIA_FLW_L = "#d4685a";
const DIA_POT   = "#8f4630";                              // 红陶盆（向日葵盆）
const DIA_PL_L  = "#9fab7c", DIA_PL_M = "#828e5f", DIA_PL_D = "#5f6a44";  // 石台基：黄绿锈石
/* 石台基顶面是**水盆**（2026-09-13 第六轮加喷泉时改）。⚠️ 直接用湖水的
   #2E6E9E / #7FB4D8（见 45_water.js paintWaterBase）而不是另调一套蓝 ——
   同一个校园里的水必须是同一个色，这里读得出是水，靠的就是"和明湖一样"。 */
const DIA_WAT_D = "#1c4a70", DIA_WAT_M = "#2E6E9E", DIA_WAT_L = "#7FB4D8";
const DIA_COL_L = "#e4e1d8", DIA_COL_M = "#cac7bc", DIA_COL_D = "#9c998e";// 圆柱
/* ⚠️ 颜色名避开 DIA_PED_T / DIA_PED_F —— 那两个已经是"台座顶面投影高 / 立面高"
   的几何常量（上面高度表里），同名会直接 SyntaxError: already been declared，
   而且是**加载期**抛，整页 JS 全灭。 */
const DIA_PED_TOP = "#d1cec4", DIA_PED_SIDE = "#b4b1a6";                   // 台座：顶面 / 南立面
const DIA_IR_L  = "#5f544a", DIA_IR_M = "#463d36", DIA_IR_D = "#2b2520";   // 铸铁
/* 围栏石：**浅棕**。⚠️ 石头必须比铺装（FLAG_PAVE 暖中灰 #a39e90）明显偏黄 ——
   只暗一点点会读成"地砖脏了一块"，偏黄才读得出是另一种材质。 */
const DIA_ST_L  = "#d8b88c", DIA_ST_M = "#bd9865", DIA_ST_D = "#8d6f49";

/* ⚠️ 铺装**故意复用升旗台的调色常量**（FLAG_PAVE / FLAG_PAVE_J）而不是另起一套：
   两处都是"草坪被挖掉一块"，用同一材质是最省事也最一致的读法。52_flag.js 排在
   本文件之前，顶层 const 同处一个全局词法环境，直接引即可。 */

/* --- 椭圆工具：逐行扫描线。rx/ry 是**半轴**，与 canvas 的 arc 无关 ---
   ⚠️ 每行都过 Math.max(1, ...)：rx 衰减到 0 的那一两行若不兜底，
      会画出零宽 fillRect（静默无事）或负宽（Chrome 直接忽略），都不报错但缺像素。 */
function ellipPx(g, cx, cy, rx, ry, col) {
  if (!(rx > 0) || !(ry > 0)) return;
  for (let y = Math.ceil(cy - ry); y <= Math.floor(cy + ry); y++) {
    const s = 1 - ((y - cy) / ry) ** 2;
    if (s <= 0) continue;
    const hw = rx * Math.sqrt(s), x0 = Math.round(cx - hw);
    px(g, x0, y, Math.max(1, Math.round(cx + hw) - x0), 1, col);
  }
}
/* 椭圆环：逐行只落左右两段 */
function ellipRing(g, cx, cy, rx, ry, irx, iry, col) {
  if (!(rx > 0) || !(ry > 0)) return;
  for (let y = Math.ceil(cy - ry); y <= Math.floor(cy + ry); y++) {
    const s = 1 - ((y - cy) / ry) ** 2;
    if (s <= 0) continue;
    const hw = rx * Math.sqrt(s), xl = Math.round(cx - hw), xr = Math.round(cx + hw);
    const u = 1 - ((y - cy) / iry) ** 2;
    if (!(u > 0)) { px(g, xl, y, Math.max(1, xr - xl), 1, col); continue; }
    const ihw = irx * Math.sqrt(u), il = Math.round(cx - ihw), ir = Math.round(cx + ihw);
    if (il > xl) px(g, xl, y, il - xl, 1, col);
    if (xr > ir) px(g, ir, y, xr - ir, 1, col);
  }
}

/* --- 凸四边形工具：逐行求与四边的交点，取左右两端。硬边、无抗锯齿 ---
   ⚠️ 不用 canvas 的 translate/rotate 画旋转矩形：那条路会出抗锯齿的半透明边界像素，
      与全场"就近邻硬边"画风不一致（整只精灵 1:1 贴上去时那几颗半透明格子看得见）。
   参数 P 是**屏幕空间**的四个顶点，顺时针或逆时针都行。 */
function quadScan(P, cb) {
  let y0 = Infinity, y1 = -Infinity;
  for (const p of P) { if (p[1] < y0) y0 = p[1]; if (p[1] > y1) y1 = p[1]; }
  for (let y = Math.floor(y0); y <= Math.ceil(y1); y++) {
    const xs = [];
    for (let i = 0; i < 4; i++) {
      const A = P[i], B = P[(i + 1) % 4];
      if ((A[1] <= y && B[1] > y) || (B[1] <= y && A[1] > y))
        xs.push(A[0] + (y - A[1]) * (B[0] - A[0]) / (B[1] - A[1]));
    }
    if (xs.length < 2) continue;
    xs.sort((p, q) => p - q);
    const xa = Math.round(xs[0]), xb = Math.round(xs[xs.length - 1]);
    if (xb > xa) cb(y, xa, xb);
  }
}
function quadPx(g, P, col) {
  quadScan(P, (y, xa, xb) => px(g, xa, y, xb - xa, 1, col));
}
/* 只把四边形**每列最上面那一颗**换成亮色 = 一道 1px 的受光顶棱（SUN 在西北） */
function quadLit(g, P, col) {
  const top = new Map();
  quadScan(P, (y, xa, xb) => {
    for (let x = xa; x < xb; x++) if (!top.has(x) || y < top.get(x)) top.set(x, y);
  });
  for (const [x, y] of top) px(g, x, y, 1, 1, col);
}

/* --- 5.3.1 凹口：把 7×6 格从草地划掉（buildGround 之前调） ---
   ⚠️ stampRectAbs 的 c1 = floor((x+w)/CELL) 是**闭区间**，传精确宽高会多盖一格
      （东边多一列、南边多一行）。必须传 w-1 / h-1 —— 与 §5.2.1 同款坑。 */
function stampDiaNotch() {
  stampRectAbs(DIA_Z.x, DIA_Z.y, DIA_Z.w - 1, DIA_Z.h - 1, K.BLD);
}

/* --- 5.3.2 凹口铺装（buildGround 之后调，传 groundCanvas 的 2d context） ---
   与升旗台同一套石板，但**西、北两面不砌石缘** —— 凹口北面朝草坪、西面朝草坪，
   升旗台那边北面已经压着东西主路的路缘石，这里两侧都是草地，砌了反而像围栏。
   石缘只做南、东两面（背光侧），"凹"的读法交给南缘外面那道切口。 */
function paintDiaGround(g) {
  const rng = makeRng(20260917);                     // 独立种子：buildGround 已跑完，扰不到它
  const Z = DIA_Z, x1 = Z.x + Z.w, y1 = Z.y + Z.h;

  /* ① 石板 16px 见方：缝色打底 + 逐块色差（与 paintFlagGround 同一手法） */
  px(g, Z.x, Z.y, Z.w, Z.h, FLAG_PAVE_J);
  for (let y = Z.y; y < y1; y += 16) {
    for (let x = Z.x; x < x1; x += 16) {
      const k = (rng() - 0.5) * 0.07;
      px(g, x, y, 15, 15, shade(FLAG_PAVE, k));
      px(g, x, y, 15, 1, shade(FLAG_PAVE, k + 0.10));
      px(g, x, y + 14, 15, 1, "rgba(14,18,28,0.10)");
      if (rng() < 0.16) px(g, x + 3 + rng() * 9, y + 3 + rng() * 9, 2, 2, "rgba(14,18,28,0.09)");
    }
  }
  /* ② 南、东两面石缘 */
  const R = 3;
  px(g, x1 - R, Z.y, R, Z.h, KERB_LIT);                             // 东缘（背光侧）
  px(g, x1 - R - 1, Z.y, 1, Z.h, KERB_DARK);
  px(g, Z.x, y1 - R, Z.w, R, KERB_LIT);                             // 南缘（贴南横路）
  px(g, Z.x, y1 - R - 1, Z.w, 1, KERB_DARK);
  /* ③ 版缘外的过渡带。西、北两面迎光 → 走 paintDirt 的土色；东、南两面背光 →
     压一道暗绿"切口"（草面比挖下去的地坪高，这几条边正是光被挡住的地方）。
     这一笔是"凹"能读出来的关键，与 §5.2.2 同款。 */
  const band = mix(DIRT, GRASS_RAMP[1], 0.55);
  const cut  = mix(shade(GRASS_RAMP[0], -0.26), DIRT, 0.32);
  px(g, Z.x - 2, Z.y - 2, 2, Z.h + 4, band);                        // 西缘
  px(g, Z.x, Z.y - 2, Z.w + 2, 2, band);                            // 北缘
  px(g, x1, Z.y, 2, Z.h + 2, cut);                                  // 东缘
  px(g, Z.x - 2, y1, Z.w + 4, 2, cut);                              // 南缘
}

/* --- 5.3.3 花坛：环形红花 + 外缘一圈红陶盆向日葵 --- */
function diaFlowerBed(g, rng) {
  /* 先铺一圈"土"打底，再往上撒花 —— 只撒花点会露出底下的铺装，像撒了一地纸屑 */
  ellipRing(g, diaX(DIA_CX), diaY(DIA_FLW_CY), DIA_FLW_RX, DIA_FLW_RY,
            DIA_FLW_IX, DIA_FLW_IY, "#4a3f2c");
  /* 逐行填红：同一行内按"距环心的水平距离"分档上色，外圈亮、内圈暗
     （环是斜的，靠外的一侧正对光，与全局 SUN(-0.60,-0.80) 一致） */
  for (let y = Math.ceil(DIA_FLW_CY - DIA_FLW_RY); y <= Math.floor(DIA_FLW_CY + DIA_FLW_RY); y++) {
    const s = 1 - ((y - DIA_FLW_CY) / DIA_FLW_RY) ** 2;
    if (s <= 0) continue;
    const hw = DIA_FLW_RX * Math.sqrt(s);
    const u = 1 - ((y - DIA_FLW_CY) / DIA_FLW_IY) ** 2;
    const ihw = u > 0 ? DIA_FLW_IX * Math.sqrt(u) : 0;
    const xl = Math.round(DIA_CX - hw), xr = Math.round(DIA_CX + hw);
    const il = Math.round(DIA_CX - ihw), ir = Math.round(DIA_CX + ihw);
    const ny = y - DIA_FLW_CY;                       // <0 = 北半边（迎光）
    for (const [a, b] of [[xl, il], [ir, xr]]) {
      const wpx = b - a;
      if (wpx <= 0) continue;
      px(g, diaX(a), diaY(y), wpx, 1, ny < 0 ? DIA_FLW_M : DIA_FLW_D);
      /* 北半边靠外的一列提亮 —— 一圈花里总要有一圈亮的才不塌成一个色块 */
      if (ny < 0 && rng() < 0.55) px(g, diaX(a), diaY(y), 1, 1, DIA_FLW_L);
      if (ny >= 0 && rng() < 0.30) px(g, diaX(b) - 1, diaY(y), 1, 1, DIA_FLW_M);
    }
  }
  /* 外缘一圈深红陶盆（对应照片里环绕的向日葵盆）。像素尺度下向日葵本身
     （花盘 + 花瓣）在 3px 里画不出形状，只留盆 —— 一列等距的暗红点，
     远看正好是"一圈陶盆"的节奏。 */
  const NP = 22;
  for (let i = 0; i < NP; i++) {
    const a = i / NP * Math.PI * 2 + 0.14;
    const ex = DIA_CX + Math.cos(a) * (DIA_FLW_RX + 2.5);
    const ey = DIA_FLW_CY + Math.sin(a) * (DIA_FLW_RY + 1.6);
    px(g, diaX(Math.round(ex)), diaY(Math.round(ey)), 3, 2, DIA_POT);
    px(g, diaX(Math.round(ex)), diaY(Math.round(ey)), 3, 1, shade(DIA_POT, 0.22));
  }
}

/* --- 5.3.4 石台基：圆形石台（俯视圆柱的三步画法） ---
   ⚠️ 三步的顺序不能换：**底椭圆 → 柱身矩形 → 顶椭圆**。
      第一版把"下层台阶"写成了一个外扩 (rx+3, ry+1.5) 的独立椭圆，
      它的下缘直接溢到 y1865（花坛下缘才 1854），在画面里变成一枚压在花坛
      南侧的巨型绿橄榄，把整个雕塑的下半身吃掉了。台阶要外扩也必须在
      **花坛内圈以内**，而花坛内圈半径就是这里的 rx/ry —— 所以干脆不外扩。 */
function diaPlinth(g) {
  const cx = diaX(DIA_CX);
  /* ⚠️ 圆心的 y 是"高度"直接减去，不是加上：物体越高，屏幕上越靠上。
        底面圆心在地面高度 → 与花坛环心 DIA_FLW_CY **同一个 y**；
        顶面比底面高 DIA_PL_H → y 减 DIA_PL_H。
        第一版把这两者写反了（顶面放 1832、底面放 1840），底椭圆于是比花坛内圈
        低 8px、南缘一路探出到 1853，看起来就是花坛南侧被一枚巨椭圆吃掉了。 */
  const cyB = diaY(DIA_FLW_CY);                              // 底面圆心
  const cyT = cyB - DIA_PL_H;                                // 顶面圆心
  const rx = DIA_FLW_IX, ry = DIA_FLW_IY, h = DIA_PL_H;
  ellipPx(g, cx, cyB, rx, ry, DIA_PL_D);                     // ① 底椭圆：只露出南侧一条弧
  px(g, Math.round(cx - rx), cyT, Math.round(rx * 2), h, DIA_PL_M);   // ② 柱身
  px(g, Math.round(cx - rx), cyT, 2, h, DIA_PL_L);                    //    西侧受光
  px(g, Math.round(cx + rx) - 2, cyT, 2, h, DIA_PL_D);                //    东侧背光
  px(g, Math.round(cx - rx), cyB - 2, Math.round(rx * 2), 2, DIA_PL_D);//    柱身底部压暗
  /* ③ 顶面椭圆 = **水盆**。原先这里是"北半边亮、南半边暗"的石面（光来自
        SUN(-0.60,-0.80)）；2026-09-13 加喷泉时改成看得见水的水盆 ——
        照片（_photo/diaosu.jpg）里柱脚周围本来就是一圈湿的深色水。
        ⚠️ 水面**不按 SUN 分南北明暗**（水是反光的，不是漫反射的石头）：
           改用与 paintWaterBase 同一套"由岸向心浅化"的 3 圈，池心最亮。
           这是本项目里"画水"的统一读法，换成别的会立刻显得像块蓝地砖。 */
  const topY = DIA_FLW_CY - h;
  ellipPx(g, cx, cyT, rx, ry, DIA_WAT_M);
  for (let i = 0; i < 3; i++) {
    const t = (i + 1) / 3;
    ellipPx(g, cx, cyT, rx - rx * 0.34 * t, ry - ry * 0.34 * t, mix(DIA_WAT_M, DIA_WAT_L, 0.22 * (i + 1)));
  }
  /* 盆底外缘一圈暗：盆壁的投影。缺了它水会"浮"在石面上、读不出是个凹下去的盆。
     ⚠️ 那圈亮边（石台基与花坛的分界线）**必须留在最外圈**，水画在它里面 ——
        盆沿没了，石台基与花坛会糊成一个色块。 */
  ellipRing(g, cx, cyT, rx, ry, rx - 1.4, ry - 1.4, DIA_WAT_D);
  ellipRing(g, cx, cyT, rx + 0.6, ry + 0.6, rx - 0.6, ry - 0.6, DIA_PL_L);
}

/* --- 5.3.4b 喷泉：水柱 + 上飞的水珠 + 盆面溅水环（2026-09-13 第六轮新增） ---
   作者最初就写了"柱间原本有喷泉 —— 像素尺度下省略"（见文件头 ②），这次补上。
   照片里：四柱之间、靠南一侧有一道白色细水柱，宽约 4~5、高约 20~24 世界像素。

   ⚠️ 位置是被三处既有几何**夹**出来的，改任一处都要回这里重算：
      ① 中间两根圆柱的内沿在 x2021.5 / x2026.5（柱心 2019/2029、直径 5，即 DIA_COL_GAP=10）
         → 水柱只能取 x2022..2025，宽 4；
      ② 台座底面南沿在 y1807（DIA_PED_FOOT）
         → 水柱顶只能到 y1808；
      ③ 水盆面 = 台基顶面椭圆中心 1827 再南移 3（照片里水柱偏南）→ y1830。
      于是 H = 22，正好落在照片量的 20~24 里。

   ⚠️ 相位 i 只让**水珠与溅水环**动，柱体本身一帧不动 ——
      柱体高度随帧脉动会被读成频闪（24px 高的东西每帧伸缩 1~2px，像素画里非常刺眼）。 */
function diaJet(g, i) {
  const bx = DIA_CX, by = 1830, H = 22;
  /* ① 柱体：2px 白芯，上下两端各收细 1px（水柱不是一根等宽的棍） */
  for (let y = by - H; y <= by; y++) {
    const t = (by - y) / H;
    const w = (t < 0.10 || t > 0.92) ? 1 : 2;
    px(g, diaX(bx - 1), diaY(y), w, 1,
       t > 0.80 ? "rgba(255,255,255,0.60)" : "rgba(255,255,255,0.92)");
  }
  /* ② 三颗上飞的水珠：相位错开 1/3 圈，越往上越淡；左右各飘 1px 免得太像一根柱 */
  for (let k = 0; k < 3; k++) {
    const p = ((i / DIA_FRAMES) + k / 3) % 1;
    const yy = by - Math.round(p * H), off = Math.round(Math.sin(p * 6.2832) * 1.6);
    px(g, diaX(bx - 1 + off), diaY(yy), 1, 1, "rgba(255,255,255," + (0.70 - 0.45 * p).toFixed(2) + ")");
  }
  /* ③ 盆面溅水环：水柱脚一圈，半径按相位呼吸。
        ⚠️ 取 (i+1)%N 而不是 i%N —— 第 0 帧若取 0 会退化成"没有环"，
           8 帧里少一帧、飞轮转起来会看见一次跳变。
        竖直半径按 1/1.71 压扁：这是**贴在水盆面上的**水平圆。 */
  const rr = 2.5 + ((i + 1) % DIA_FRAMES) / DIA_FRAMES * 2.5, ry = rr * 0.585;
  for (let y = Math.ceil(by - ry); y <= Math.floor(by + ry); y++) {
    const s = 1 - ((y - by) / ry) ** 2;
    if (s <= 0) continue;
    const hw = rr * Math.sqrt(s);
    const xl = Math.round(diaX(bx - hw)), xr = Math.round(diaX(bx + hw)) - 1;
    px(g, xl, diaY(y), 1, 1, "rgba(230,246,255,0.40)");
    if (xr > xl) px(g, xr, diaY(y), 1, 1, "rgba(230,246,255,0.40)");
  }
}

/* --- 5.3.5 大齿轮环：外圈三角齿 + 环体 + 垂链 --- */
function diaGear(g) {
  const cx = diaX(DIA_CX), cy = diaY(DIA_GEAR_CY), R = DIA_GEAR_R, T = DIA_GEAR_T;
  /* ① 齿：24 个三角齿，径向朝外。**先画齿再画环体** —— 反过来的话齿根那道
        接缝会压在环上，读起来像环外面粘了 24 个小方块。
     ⚠️ 齿轮是**竖直的圆盘**，正面看就是正圆 —— 这里不能套 2.5D 的椭圆压缩
        （花坛、石台基那些是水平面，才要压）。 */
  const NT = 24;
  for (let i = 0; i < NT; i++) {
    const a = i / NT * Math.PI * 2;
    const nx = Math.cos(a), ny = Math.sin(a);
    /* 齿基在 R-1、齿尖在 R+3，宽 2 收窄到 1（等腰三角形）。
       R=20 时周长 125px、24 个齿即间隔 5.2px —— 齿宽最多只能给 2px，
       再宽就并成一圈实边，"齿"的节奏全丢。 */
    for (let d = R - 1; d <= R + 3; d++) {
      const w = Math.max(1, Math.round((R + 3 - d) / 4 * 2));
      px(g, Math.round(cx + nx * d - w / 2), Math.round(cy + ny * d - w / 2), w, w, DIA_IR_L);
    }
  }
  /* ② 环体：外椭圆 - 内椭圆，北半边（左上）受光。
        ⚠️ 环体整体提亮到 DIA_IR_L（而不是和铁砧同用 DIA_IR_M）——
           齿轮在后、铁砧在前，两者同色会糊成一整块黑，齿轮环就"消失"了；
           拉开一档亮度，环的轮廓才能从铁砧上读出来。 */
  ellipRing(g, cx, cy, R, R, R - T, R - T, DIA_IR_L);
  for (let y = cy - R; y <= cy + R; y++) {
    const s = 1 - ((y - cy) / R) ** 2;
    if (s <= 0) continue;
    const hw = R * Math.sqrt(s), xl = Math.round(cx - hw), xr = Math.round(cx + hw);
    const u = 1 - ((y - cy) / (R - T)) ** 2;
    const ihw = u > 0 ? (R - T) * Math.sqrt(u) : 0;
    const il = Math.round(cx - ihw), ir = Math.round(cx + ihw);
    const lit = y < cy;                                    // 北半边
    if (il > xl) { px(g, xl, y, il - xl, 1, lit ? DIA_IR_L : DIA_IR_M); px(g, xl, y, 1, 1, lit ? DIA_IR_L : DIA_IR_D); }
    if (xr > ir) { px(g, ir, y, xr - ir, 1, lit ? DIA_IR_M : DIA_IR_D); px(g, xr - 1, y, 1, 1, DIA_IR_D); }
  }
  /* ③ 垂链：齿轮右侧挂下来的一小段起重链（照片里很显眼，三节方环） */
  const chX = DIA_CX + R - 1, chY = DIA_GEAR_CY + 8;
  for (let i = 0; i < 3; i++) {
    px(g, diaX(chX), diaY(chY + i * 4), 3, 1, DIA_IR_L);
    px(g, diaX(chX), diaY(chY + i * 4 + 1), 1, 2, DIA_IR_M);
    px(g, diaX(chX) + 2, diaY(chY + i * 4 + 1), 1, 2, DIA_IR_M);
    px(g, diaX(chX), diaY(chY + i * 4 + 3), 3, 1, DIA_IR_M);
  }
}

/* --- 5.3.6 铁砧：喇叭砧座 + 横置砧体 + 方柱/斜料 + 前沿斜杆 --- */
function diaAnvil(g) {
  const cx = DIA_CX;
  /* ① 砧座：下窄上宽的喇叭形柱体（下宽 12、上宽 20、高 9） */
  const by = DIA_ANV_BY, ty = by - DIA_ANV_H;
  for (let y = ty; y <= by; y++) {
    const t = (by - y) / DIA_ANV_H;                        // 0 = 底、1 = 顶
    const hw = 5 + t * 3;                                  // 下宽 10 → 上宽 16
    px(g, diaX(Math.round(cx - hw)), diaY(y), Math.round(hw * 2), 1,
       y <= ty + 1 ? DIA_IR_L : (y >= by - 1 ? DIA_IR_D : DIA_IR_M));
  }
  px(g, diaX(cx - 5), diaY(by), 10, 2, DIA_IR_D);          // 底座加厚一圈
  px(g, diaX(cx - 6), diaY(by), 12, 1, DIA_IR_M);
  /* ② 砧体：横置，右端出"喙"（照片里砧的右端是尖的） */
  const aY = ty - 6;
  px(g, diaX(cx - 12), diaY(aY), 24, 6, DIA_IR_M);
  px(g, diaX(cx - 12), diaY(aY), 24, 2, DIA_IR_L);         // 顶面受光
  px(g, diaX(cx - 12), diaY(aY + 5), 24, 1, DIA_IR_D);     // 底面背光
  px(g, diaX(cx - 12), diaY(aY), 2, 6, DIA_IR_L);          // 左端面
  for (let i = 0; i < 6; i++)                              // 右端"喙"：逐行收窄的三角
    px(g, diaX(cx + 12), diaY(aY + i), Math.max(1, 6 - i), 1, i < 2 ? DIA_IR_L : DIA_IR_D);
  /* ③ 砧体上的工件：两块方柱（一高一矮）+ 两块斜方料 */
  px(g, diaX(cx - 7), diaY(aY - 15), 5, 15, DIA_IR_M);     // 高柱
  px(g, diaX(cx - 7), diaY(aY - 15), 5, 2, DIA_IR_L);
  px(g, diaX(cx - 7), diaY(aY - 15), 1, 15, DIA_IR_L);
  px(g, diaX(cx - 2), diaY(aY - 15), 1, 15, DIA_IR_D);
  px(g, diaX(cx), diaY(aY - 9), 5, 9, DIA_IR_M);           // 矮柱
  px(g, diaX(cx), diaY(aY - 9), 5, 2, DIA_IR_L);
  px(g, diaX(cx + 4), diaY(aY - 9), 1, 9, DIA_IR_D);
  /* 右边那本"书"：**向左倾** —— 长轴从右下延伸到左上，上端在左、下端在右。
     ⚠️ 第一版写反了（`cx + 6 + i*0.5` 是上端朝右），用户照着照片一眼看出方向不对：
       照片里这块板是**上端偏左**的。判据只有"上端在哪一侧"，别再写反。 */
  for (let i = 0; i < 12; i++) {
    px(g, diaX(cx + 12 - i), diaY(aY - 4 - i), 4, 1, i % 4 === 0 ? DIA_IR_L : DIA_IR_M);
  }
  for (let i = 0; i < 8; i++) {                            // 左上斜方块
    px(g, diaX(cx - 13 + i * 0.4), diaY(aY - 12 + i), 4, 1, DIA_IR_M);
    px(g, diaX(cx - 13 + i * 0.4), diaY(aY - 12 + i), 1, 1, DIA_IR_L);
  }
  /* ④ 砧座前沿斜插的细杆（照片里垂在砧座前面那根，像凿子） */
  for (let i = 0; i < 12; i++) {
    px(g, diaX(cx - 2 - i * 0.5), diaY(aY + 6 + i), 1, 1, i < 3 ? DIA_IR_L : DIA_IR_M);
    px(g, diaX(cx - 3 - i * 0.5), diaY(aY + 6 + i), 1, 1, DIA_IR_D);
  }
}

/* --- 5.3.7 方形台座：顶面板 + 南立面 + 立面上的一排圆孔 --- */
function diaPedestal(g) {
  const x0 = DIA_CX - DIA_PED_W / 2, x1 = DIA_CX + DIA_PED_W / 2;
  const tY = DIA_PED_TY, fY = tY + DIA_PED_T;              // 1790 / 1810
  /* 顶面：磨光浅灰，北缘受光、东缘背光 */
  px(g, diaX(x0), diaY(tY), DIA_PED_W, DIA_PED_T, DIA_PED_TOP);
  px(g, diaX(x0), diaY(tY), DIA_PED_W, 1, shade(DIA_PED_TOP, 0.26));
  px(g, diaX(x0), diaY(tY), 1, DIA_PED_T, shade(DIA_PED_TOP, 0.14));
  px(g, diaX(x1) - 2, diaY(tY), 2, DIA_PED_T, shade(DIA_PED_TOP, -0.22));
  for (let x = x0 + 8; x < x1 - 2; x += 8)
    px(g, diaX(x), diaY(tY) + 1, 1, DIA_PED_T - 2, "rgba(14,18,28,0.05)");
  /* 南立面：顶棱提亮、底部压暗 */
  px(g, diaX(x0), diaY(fY), DIA_PED_W, DIA_PED_F, DIA_PED_SIDE);
  px(g, diaX(x0), diaY(fY), DIA_PED_W, 1, shade(DIA_PED_SIDE, 0.44));
  px(g, diaX(x0), diaY(fY + DIA_PED_F - 2), DIA_PED_W, 2, shade(DIA_PED_SIDE, -0.30));
  /* 一排圆孔：照片里立面上等距 5 个，是这块石头唯一的细节 */
  for (let i = 0; i < 5; i++) {
    const hx = Math.round(x0 + 5 + i * (DIA_PED_W - 10) / 4);
    px(g, diaX(hx), diaY(fY + 2), 2, 2, "#3a362f");
    px(g, diaX(hx), diaY(fY + 1), 2, 1, "rgba(14,18,28,0.18)");
  }
  contactBand(g, diaX(x0) + 1, diaX(x1) - 1, diaY(DIA_PED_FOOT), 1, 0.20);
}

/* --- 5.3.8 圆柱：四根，2×2。先北排后南排，统一"左亮右暗" --- */
function diaColumn(g, ccx, footY) {
  const x0 = Math.round(ccx - DIA_COL_W / 2), topY = footY - DIA_COL_H;
  px(g, diaX(x0), diaY(topY), DIA_COL_W, DIA_COL_H, DIA_COL_M);
  px(g, diaX(x0), diaY(topY), 2, DIA_COL_H, DIA_COL_L);
  px(g, diaX(x0 + DIA_COL_W - 2), diaY(topY), 2, DIA_COL_H, DIA_COL_D);
  px(g, diaX(x0), diaY(footY - 2), DIA_COL_W, 2, DIA_COL_D);      // 柱脚接地压暗
  px(g, diaX(x0 - 1), diaY(footY - 1), DIA_COL_W + 2, 1, "rgba(14,18,28,0.22)");
}

/* --- 5.3.8b 后围石：四块浅棕长方石，沿花坛外圈**朝北**排成 120° 的弧
   （用户 2026-09-13 追加；同日再改两处：块尺寸 ×2、弧从"前半个圆"翻到"后半个圆"）。
   口述：「在这个校徽周围放四个浅棕色的长方形石块围起来，石块差不多围成一个半圆
   （120度），每个石块之间是有间隔的」→「这四个石头比较大，差不多是现在的两倍，
   而且围起来的方向不太对，我们目前是围着前半个圆，其实应该是围着后半个圆形」。
   ⚠️ 角度约定：0° = 东、90° = **正南**（世界 y 向下）、270° = 正北。
      第一版取 [42,74,106,138]（弧心 90° = 正南），围的是"前半个圆"；用户要的是围在
      **雕塑背后**（草坪那一侧）= 正北，所以弧心改 270°，四块取 [225,255,285,315]。
   ⚠️ 半径 R 不是随便挑的，被两条约束钉死 —— 改 LEN / THICK / 角度之前先回这里重算：
      ① **北侧两块必须整体落在草坪上**。草坪南缘 = 凹口北沿 y1776，θ=255° 那块的最南角
         y = 1832 − 0.5848·R·0.9659 + 0.5848·(0.2588·LEN/2 + 0.9659·THICK/2) ≤ 1776
         → R ≥ 112.5，取 113。
      ② **东西两块不许压到凹口西北/东北角**（凹口 x1968..2079）：θ=225° 那块的最东角
         x = 2024 − 0.7071·R + 0.7071·(LEN+THICK)/2 ≤ 1968 → R ≥ 107.2，113 满足。
      相邻块心距 2R·sin15° = 58.5 > LEN 40 → 块间留 18.5px，就是用户说的"有间隔"。
   ⚠️ R=113 让整条弧横跨 200px，比 112px 宽的凹口还宽 —— 这正是用户拍板的方案
      （选「铺装不动，石头坐在草坪上」）：凹口一格没动，弧坐在凹口两侧与北侧的草地上。
      ⚠️ ① 解出的是"北侧两块恰好压在草坪边线上（余量 0.3px）"这个临界值；用户随后要求
      「石头整体往下一点」，于是加 DIA_ST_DY=10 整体南移 —— 北侧两块现在**压在凹口北沿上**
      10px。凹口仍是一格没动，只是石阵不再完全落在草里了。
   ⚠️ 石头画在**地面上**，所以短轴要按 1/1.71 压扁（与花坛、石台基同一套投影）；
      它不是立着的板。 */
const DIA_ST_R = 113, DIA_ST_LEN = 40, DIA_ST_THICK = 16, DIA_ST_H = 6;
const DIA_ST_ANG = [225, 255, 285, 315];                   // 块心方位角（度），270 = 正北
const DIA_ST_SH = "rgba(30,44,22,0.26)";                   // 草地上的软影：让石头与草地脱开
/* ⚠️ 整圈**南移**的偏移（用户 2026-09-13：「石头整体往下一点」）。
   只加在块心的 y 上 → 四块**整体平移**，环的形状与朝向一个字不动。
   代价：北侧两块会探进凹口铺装 10px（原本只剩 0.3px 余量），即石南沿压在铺装北沿上 ——
   这是"往下"必然的代价，凹口本身仍然一格没动。想改这个数，三处联动照旧要重算
   （见下面 DIA_RING_* / DIA_ST_BY 的注释）。 */
const DIA_ST_DY = 10;

/* 石阵**单独一个精灵**（tag "diaRing"），不并进雕塑那张画布 —— 见 §5.3.9b。
   画布框按四块石的实测算：落地足迹 x1924.3..2123.7 / y1771.2..1806.8（已含 DIA_ST_DY），
   顶面再上抬 6（→ y1765.2），软影再往右下铺 (2,3) → 需要 x1924..2126 / y1765..1810，
   四边各留 ~4px → 1920..2130 / 1762..1814。⚠️ canvas 越界是静默的，改 R / LEN / THICK /
   DY 之后必须回头重算这个框，否则石头会被裁掉一条边还不报错。 */
const DIA_RING_X0 = 1920, DIA_RING_Y0 = 1762, DIA_RING_W = 210, DIA_RING_H = 52;
const ringX = v => v - DIA_RING_X0, ringY = v => v - DIA_RING_Y0;
const DIA_ST_BY = 1807;                                    // 精灵落地基准 = 四块石南沿的最南值

/* 单块石的**落地足迹**（四个世界坐标角点，顺序无所谓 —— quadScan 自己求外轮廓）。
   长轴半向量取切向、短轴半向量取径向，两者都按 1/1.71 压扁。 */
function diaStoneFoot(deg) {
  const K = 1 / 1.71;
  const a = deg * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a);
  const mx = DIA_CX + DIA_ST_R * ca;
  const my = DIA_FLW_CY + K * DIA_ST_R * sa + DIA_ST_DY;                   // 块心（地面）
  const ux = -sa * DIA_ST_LEN / 2, uy = K * ca * DIA_ST_LEN / 2;           // 长轴半向量
  const vx = ca * DIA_ST_THICK / 2, vy = K * sa * DIA_ST_THICK / 2;        // 短轴半向量
  return [
    [mx - ux - vx, my - uy - vy], [mx + ux - vx, my + uy - vy],
    [mx + ux + vx, my + uy + vy], [mx - ux + vx, my - uy + vy],
  ];
}

function diaStones(g) {
  for (const deg of DIA_ST_ANG) {
    const base = diaStoneFoot(deg).map(p => [ringX(p[0]), ringY(p[1])]);
    const top = base.map(p => [p[0], p[1] - DIA_ST_H]);       // 顶面 = 落地足迹整体上抬
    quadPx(g, base.map(p => [p[0] + 2, p[1] + 3]), DIA_ST_SH); // ① 草地软影（偏右下＝服从 SUN）
    quadPx(g, base, DIA_ST_D);                                // ② 侧壁（顶面盖上去后南侧剩的那条）
    quadPx(g, top, DIA_ST_M);                                 // ③ 顶面
    quadLit(g, top, DIA_ST_L);                                // ④ 顶面北棱受光
    const bot = new Map();                                    // ⑤ 接地线再压一档
    quadScan(base, (y, xa, xb) => {
      for (let x = xa; x < xb; x++) if (!bot.has(x) || y > bot.get(x)) bot.set(x, y);
    });
    for (const [x, y] of bot) px(g, x, y, 1, 1, shade(DIA_ST_D, -0.28));
  }
}

/* --- 5.3.9 雕塑精灵：一层层叠上去（次序即遮挡关系） ---
   锚点约定与其它道具一致（ax/ay = 精灵内到"底部中心"的偏移）。
   画布尺寸按内容实测定：齿轮顶 1749 → 投影南沿 1862，宽 x1984..2070，
   四边各留 4px 余量就是下面这个框。后围石**不在**这张画布里（见 §5.3.9b）。 */
const DIA_CV_X0 = 1972, DIA_CV_Y0 = 1740, DIA_CV_W = 108, DIA_CV_H = 130;
const diaX = v => v - DIA_CV_X0, diaY = v => v - DIA_CV_Y0;

/* phase = 喷泉相位（0..DIA_FRAMES-1），只影响水柱；其余部分逐帧像素完全一致
   （rng 自带固定种子 20260917，重跑必得同一份结果 —— 这是"预烘焙 N 帧换 img"
   能成立的前提，换了种子就会每帧看到花坛的红花在闪）。 */
function diaStand(phase) {
  const c = mkCanvas(DIA_CV_W, DIA_CV_H), g = c.getContext("2d");
  const rng = makeRng(20260917);
  /* ① 方向性投影：花坛外围一圈，量取 (6,8) 而不取石台基的 (8,10) ——
        花坛是贴地的低矮物，影子拉长会盖住整圈铺装，读起来像地砖脏了一块。 */
  shadowQuad(g, diaX(1988), diaY(1812), diaX(2060), diaY(DIA_FOOT), 6, 8, 0.22, 5);
  /* ② 花坛 → 石台基 → **喷泉** → 齿轮（最远）→ 柱 → 台座 → 铁砧（次序即遮挡关系）。
        水柱排在石台基之后（它坐在水盆面上）、柱之前 ——
        与柱子横向不重叠（水柱在中间两柱的缝里），顺序其实不敏感，但按"从低到高、
        从远到近"摆着读起来才对。⚠️ 后围石**不在这里** —— 见 §5.3.9b，它单独一个道具。 */
  diaFlowerBed(g, rng);
  diaPlinth(g);
  diaJet(g, phase);
  diaGear(g);
  for (let i = 0; i < 4; i++) diaColumn(g, DIA_CX + (i - 1.5) * DIA_COL_GAP, DIA_COL_FOOT);
  diaPedestal(g);
  diaAnvil(g);
  return { canvas: c, ax: DIA_CX - DIA_CV_X0, ay: DIA_FOOT - DIA_CV_Y0 };
}

/* --- 5.3.9a 喷泉逐帧（预烘焙 + 每帧换 prop.img，与 §5.2 国旗同构） ---
   ⚠️ 为什么不是"每帧重画一遍 diaStand"：整个精灵每帧重画要跑花坛的逐行扫描 + 齿轮
      24 个齿 + 4 根柱，一次 ~600 次 px()，而帧间**只有水柱那几个像素不同**。
      也没做成独立道具 —— 道具按 baseY 排序，雕塑 baseY=1854（花坛落地线），
      水柱的落地点只有 1830，单独立项会被排到雕塑**背后**、被前排柱子吃干净。
   代价：8 张 108×130 ≈ 450 KB 显存 + 烘焙 8 次（实测 +5~20 ms，见 verify.py）。 */
const DIA_FRAMES = 8, DIA_FPS = 9;
const diaFrames = [];
let diaT = 0, diaFrameI = -1, diaProp = null;

function bakeDiaFountain(first) {
  diaFrames.length = 0;
  diaFrames.push(first || diaStand(0).canvas);          // 第 0 帧可直接复用已烘好的那张
  for (let i = 1; i < DIA_FRAMES; i++) diaFrames.push(diaStand(i).canvas);
}

/* 每帧由主循环调用（build.py 补丁 13）。⚠️ 三道闸一条都不能省 ——
   2026-09-13 那次"整页永久定格"（Edge 上 rAF 断链）就是漏了闸③：
   dt 转负 → `%` 返回负 → 数组负下标 → img 变 undefined →
   下一帧 render 死在 p.img.width → 整页再也不动，而外部完全看不出。
   闸② 用的是 utils 里的 `wrapi(i,m) = ((i%m)+m)%m`（Demo 切片 :51，本文件可见），
   不自己再写一遍取模 —— 项目里已经有一份，两份迟早会漂开。 */
function animateDiaosu(dt) {
  if (!(dt > 0)) dt = 0;                                       // 闸①：dt 非正当 0
  diaT += dt;
  if (!diaProp || !diaFrames.length) return;
  const i = wrapi(Math.floor(diaT * DIA_FPS), DIA_FRAMES);     // 闸②：夹正
  if (i !== diaFrameI) {                                       // 闸③：判存在再写
    diaFrameI = i;
    if (diaFrames[i]) diaProp.img = diaFrames[i];
  }
}

/* --- 5.3.9b 后围石精灵（tag "diaRing"）---
   ⚠️ **必须单独一个道具，不能并进 diaStand 那张画布**。道具按 baseY 排序，一张画布只有一个
      baseY：雕塑的 baseY 是 DIA_FOOT=1854（花坛落地线），而石阵最南沿只有 1797。
      并在一起的话，人走在石阵西侧/东侧那片草坪上（x1924..1968 / x2080..2124，y1799..1854，
      完全可以走）会被 baseY=1854 判定为"在雕塑之前"，于是**石头画到人身上** —— 石头明明
      在人的北侧（背后）。拆开后石阵 baseY=1797：人 y>1797 画在人前、y<1797 画在人后，全对。
      两侧草地恰好没有第三人（雕塑自己在 1854 那侧），所以一个 baseY 就够，不用逐块拆。 */
function diaRing() {
  const c = mkCanvas(DIA_RING_W, DIA_RING_H), g = c.getContext("2d");
  diaStones(g);
  return { canvas: c, ax: DIA_CX - DIA_RING_X0, ay: DIA_ST_BY - DIA_RING_Y0 };
}

/* 四块石的**落地 AABB**，给 §6.5c 逐块 addSolid 用（旋转矩形只能用外接轴对齐盒近似，
   四角最多外扩 5px，对 6px 高的矮石无所谓）。 */
function diaStoneBoxes() {
  const out = [];
  for (const deg of DIA_ST_ANG) {
    const P = diaStoneFoot(deg);
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    for (const p of P) {
      if (p[0] < x0) x0 = p[0]; if (p[0] > x1) x1 = p[0];
      if (p[1] < y0) y0 = p[1]; if (p[1] > y1) y1 = p[1];
    }
    out.push({ cx: (x0 + x1) / 2, by: y1, w: x1 - x0, d: y1 - y0 });
  }
  return out;
}

/* --- 5.3.10 雕塑净空 ---
   散射与行道树各摆各的：凹口本身挡住了台子那一小块，但**外围**（凹口南北两侧的
   草坪上）照样可能长出树，树冠（最宽 86、最高 104）一盖就把齿轮环或柱身糊掉。
   净空区覆盖"雕塑精灵的整个包围盒 + 树冠那半个身位"。
   ⚠️ 后围石（§5.3.8b）把包围盒往西/往东各撑出 ~36px：弧 x1924..2124 / y1752..1800，
      跟雕塑本体（x1972..2080 / y1749..1862）并起来就是 x1922..2128 / y1745..1863。
      少了这一段，两块北侧石之间那 18px 缝里会被 scatter() 塞进一棵树（ptBlocked 的探针
      只有 14×10，正好塞得下），树冠一盖石头就看不见了。
   ⚠️ 必须排在 §6.6c 的 clearPropTreeClash() **之后** —— 先跑会改变它保留/丢弃的
      集合，clashDropped 的计数跟着变，验收数字就对不上了（与 §5.2.8 同款约束）。 */
const DIA_CLR = { x: 1922, y: 1745, w: 206, h: 118 };     // x1922..2128 / y1745..1863
function clearDiaClearance() {
  const C = DIA_CLR, cx1 = C.x + C.w, cy1 = C.y + C.h;
  const keep = [];
  let dropped = 0;
  for (const p of props) {
    /* 雕塑与后围石自己保留；宽 > 110 的当楼处理（这一片没有楼，保险起见） */
    if (p.tag === "diaosu" || p.tag === "diaRing" || p.img.width > 110) { keep.push(p); continue; }
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
