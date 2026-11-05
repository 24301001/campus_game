/* ============================================================================
 * §5.10 伟人雕像 —— 思源楼前东侧草坪南缘（用户指定世界坐标 2439, 1880）
 *      —— 源：预览/weirendiaosu.jpg
 * ----------------------------------------------------------------------------
 * 一、用户口径（逐字，第一轮）
 *   「接下来我们复刻伟人的雕像，细节见图片，位置在2439，1880坐标，这个雕像不是
 *     很大，下边有个石头灰色底座，然后i四周是石头栏杆。」
 *   照片（weirendiaosu.jpg）读出来的四条：
 *     ① **站立挥手像**：右臂（观众看来的**左侧**）向外上方高举、手掌张开五指；
 *     ② 中山装（翻领 + 门襟一排扣 + 下摆两个口袋），长裤；
 *     ③ 左手垂在身侧、**手里拿着一顶帽子**（照片里胯边那块深色就是它）；
 *     ④ 底座是**深灰花岗岩方柱**，正面嵌一块**浅色方形铭牌**，下段一圈外挑台座。
 *   雕像本身"不是很大"（用户强调）—— 第一版取 64px 高，与底座（52px）之比 1.23。
 *
 * 一之二、第二轮（2026-09-17，用户看过成图之后）的五条口径（逐字）
 *   「伟人雕像的问题是，手太长了，手掌太大，这部分不需要突出这个手掌，而且围栏
 *     应该大幅度收缩，整个雕像也需要大幅收缩到原来的一半左右，伟人裤子是连起来
 *     的两腿之间没有缝隙，现在腿也太细了，下身裤子和上身宽度要求一致」
 *   ⇒ ① **手**：臂长 12 步 → 6 步，指尖由"高过头顶 18px"收到 **6px**；并且
 *        **不再单独画手掌 + 四指 + 拇指** —— 原来那块 8×7 的浅色手掌加四根
 *        1px 手指，在 1× 下就是一团白斑，正是用户说的"手掌太大"。现在臂端直接
 *        收一个 3×3 的小方块当拳头，**与臂同宽、不外挑**（"不需要突出这个手掌"）。
 *   ⇒ ② **围栏**：132×84×20 → **66×42×10**（与雕像同折一半）；望柱 4→2 宽、
 *        单元 30→15、三层板 3/9/2 → 2/4/1（合计 14→7 ⇒ 透空 6→3）。
 *   ⇒ ③ **整尊**：底座 44×34×52 → **22×16×26**，雕像 64 → **32**，一律 ×0.5。
 *        ⚠️ 进深取 **16** 而不是 17：34/2 = 17 是奇数，会让
 *           `WR_PED_BY = WR_CY + D/2`（以及 YF/YT）落在**半像素**上 —— 本项目
 *           全程硬边，px() 走的是 fillRect，小数坐标立刻糊出抗锯齿边。
 *           22 = 44/2、26 = 52/2、16 = 34/2 − 1，唯独进深那一维取整到偶数。
 *   ⇒ ④ **裤子连成一块**（第一版是 cx−5..cx−1 与 cx+1..cx+5 两块、中间 2px
 *        **透明缝**，背景草地会从裆里透出来）；现在整块 8 宽，中间只留一道 1px
 *        的**同色系裤缝明暗线** —— 那是明暗不是缝隙，不露背景，但仍读得出两条腿。
 *   ⇒ ⑤ **裤宽 = 躯干宽 = 8**（第一版腿各 4px 合计 10，其中还夹 2px 缝，比 14 宽的
 *        下摆还窄 —— 正是"腿太细了"）。躯干本身也去掉了"肩 16 → 下摆 14"的收分，
 *        改成上下同宽 8 的直筒：8px 尺度下那点收分只会读成"上宽下窄的倒三角"，
 *        而用户要的是"下身裤子和上身宽度要求一致"。
 *
 * 二、为什么底座 + 栏杆**必须是一个精灵**（不能拆）
 *   §5.3.9b 那条教训（"后围石必须单独一个道具"）在这里**不适用**，方向正好相反：
 *   后围石要拆，是因为它整个在雕塑**背后**（北侧），共用一个 baseY 会串深度；
 *   而本件的栏杆是**四周一圈**，南侧那道（y1901）比底座南沿（y1888）更靠南，
 *   北侧那道（y1859）比底座更靠北 —— 拆成两个精灵时，后画的那一个就整体压在
 *   前一个之上，"北栏杆盖住底座"这种错遮挡一定会出现。
 *   ⇒ 一个画布、内部按"北栏杆 → 东西栏杆 → 底座+雕像 → 南栏杆"的次序画
 *     （次序即遮挡关系，与 §5.3.9 同一套口径），baseY 取**最南的**那道栏杆。
 *
 * 三、格子：**不抠草坪凹口**
 *   §5.2/§5.3 那两处都先把草坪啃掉一块改成 K.BLD 硬地，本件**不做** —— 用户口径里
 *   只有"底座 + 石头栏杆"两样东西，没提铺装。⇒ 石头直接坐在草地上，"坐得稳"靠
 *   ①底座的接地深带 ②栏杆逐柱的接地影 ③底座往右下的方向性投影（SUN 在西北）。
 *
 * 四、⚠️ 本轮必须**单独声明**的一件事：addSolid 变了 ⇒ 又一次重掷全校园散射
 *   碰撞盒 `addSolid(WR_CX, WR_RAIL_Y1, WR_RAIL_W, WR_RAIL_D)` 随围栏从
 *   132×84 缩到 66×42 ⇒ `ptBlocked` 的判定变了 ⇒ 散射循环里既当"已接受点数"
 *   又当"物种种子"的那个 `n` 平移 ⇒ 全校园的树 / 灌木 / 花坛 / 垃圾桶重掷一遍
 *   （60 段 §6.6 头部那条地雷，[[pixel-campus-scatter-seed-landmine]]）。
 *   accept / verify / zoomtest 三套**一个数都不会变**；唯一探针是
 *   `_build/_propdiff.py`（必须跳过 `tag==='duck'`）。
 *   这不是"顺手多做的一件事"：用户要求围栏"大幅度收缩"，碰撞盒不跟着缩就是
 *   "玩家被一堵看不见的墙挡在栏杆外一圈"，交付说明里单独写了。
 *
 * 五、几何一律从**用户坐标**派生，不存第二份
 *   `WR_CX/WR_CY` 是用户给的那两个数，其余（底座四边、栏杆圈四边、精灵画布框、
 *   锚点、碰撞盒、净空框）全部由它们现算 —— 铁律「派生量不许再存一份常量」
 *   （56_minghu.js 踩过：湖一缩小，贴着湖的旧坐标全废）。
 * ==========================================================================*/

const WR_CX = 2439, WR_CY = 1880;      // ← 用户指定的世界坐标（整组件的中心落地点）

/* --- 5.10.1 底座：22 宽 × 16 进深 × 26 高（世界像素）---
   ⚠️ 屏幕上"顶面"占的是**进深**那一段（高 16）、"南立面"占的是**高度**那一段（高 26）
      —— 这套 2.5D 的映射是 (x, y, z) → 屏幕 (x, y − z)，所以：
        顶面屏幕 y ∈ [yB − D − H, yB − H]、立面屏幕 y ∈ [yB − H, yB]。
      第一版把这两段写反了（顶面放在立面**下面**），画出来是一个倒扣的盒子。 */
const WR_PED_W = 22, WR_PED_D = 16, WR_PED_H = 26;
const WR_PED_BS = 8, WR_PED_O = 1;     // 下段台座高 / 每边外挑（原 16 / 2）
const WR_PED_X0 = WR_CX - WR_PED_W / 2;              // 2428
const WR_PED_BY = WR_CY + WR_PED_D / 2;              // 1888 = 底座南沿（落地线）
const WR_PED_YF = WR_PED_BY - WR_PED_H;              // 1862 = 顶面南沿 = 立面上沿
const WR_PED_YT = WR_PED_YF - WR_PED_D;              // 1846 = 顶面北沿

/* --- 5.10.2 栏杆圈：50 × 38、高 10（原 132 × 84、高 20）---
   一个"栏板单元"＝两根望柱 + 中间一块石栏板，单元宽 WR_RAIL_UW，首尾相接成整圈。
   透空 3px 是"栏杆"与"矮墙"在像素尺度上的唯一区别（同 37 段网球场围栏的 tbMesh）——
   折半后只剩 3px，不能再少，否则整圈读成一条实心矮墙。

   ⚠️ 为什么**不是**跟着雕像一起折半（66 × 42）——那是第一版折半后的值，出图一看
      还是个"围场"：底座外轮廓 24 × 18（含台座外挑），圈在 66 × 42 里两侧各空
      21px、南北各空 12px，空得比底座本身还宽。用户原话是**两句**：
      「围栏应该大幅度收缩」＋「整个雕像也需要大幅收缩到原来的一半左右」——
      「也」字说明这是两件事，前一句要的是**相对**收缩（缩小圈/底座之比），
      只按同一比例折半的话这个比值 2.75 一点没动，等于没修。
      ⇒ 取 50 × 38：圈/底座 = 2.08（原 2.75），四周各余 13 / 11px。
   ⚠️ 进深不能压到 34 以下：南道栏杆立在 world y = WR_RAIL_Y1，**屏幕底边就等于
      Y1**，而底座台座的屏幕底边是 WR_PED_BY = 1888 —— Y1 必须比它大一点，
      否则最后画的南道会盖掉底座台座的最下一行（D = 38 ⇒ Y1 = 1899 ⇒ 留 11px）。
   ⚠️ 宽/进深都取**偶数**：奇数会让 WR_RAIL_X0/X1/Y0/Y1 落半像素（硬边项目）。 */
const WR_RAIL_W = 50, WR_RAIL_D = 38, WR_RAIL_H = 10;
const WR_RAIL_UW = 15, WR_RAIL_PW = 2;               // 单元宽 / 望柱宽
const WR_RAIL_T = 2, WR_RAIL_M = 4, WR_RAIL_B = 1;   // 上枋厚 / 板身高 / 下枋厚（合计 7，下面 3 透空）
const WR_RAIL_X0 = WR_CX - WR_RAIL_W / 2;            // 2406
const WR_RAIL_X1 = WR_CX + WR_RAIL_W / 2;            // 2472
const WR_RAIL_Y0 = WR_CY - WR_RAIL_D / 2;            // 1859
const WR_RAIL_Y1 = WR_CY + WR_RAIL_D / 2;            // 1901 ← **精灵落地线**（最南）

/* --- 5.10.3 雕像本体：32 高，站在底座**顶面**上 ---
   ⚠️ 脚取顶面中部偏南（`WR_PED_YF − 7`）而不是正中：轴测里"站在台面正中"会读成
      "悬在台口上方"，往南压半个进深才像踩实了（与 53 段台座上的砧座同一个经验，
      第一版取 14/34 ≈ 41%，现在 7/16 ≈ 44%，同一比例）。 */
const WR_FIG_H = 32;
const WR_FIG_FOOT = WR_PED_YF - 7;                   // 1855

/* --- 5.10.4 调色 ---
   雕像取**青灰石**（照片是被风雨洗出来的青绿灰，不是纯黑铜）；底座与栏杆按用户口径
   取"石头灰色"，比雕像**暖**一档 —— 两者同色会糊成一坨（53 段齿轮环与铁砧分开一档
   亮度的同一条经验）。折半后**一个色号都没动**，只动了尺寸。 */
const WR_FIG_L = "#aeb8b4", WR_FIG_M = "#8e9a96", WR_FIG_D = "#6b7672";
const WR_FIG_PANT = "#7d8783", WR_FIG_SHOE = "#4e5754";
const WR_FIG_HAIR = "#5a6461", WR_FIG_FACE = "#b7c0bb", WR_HAT = "#49524f";
const WR_ST_L = "#c9c6be", WR_ST_TOP = "#b5b2aa", WR_ST_M = "#9c998f";
const WR_ST_D = "#7c7972", WR_ST_FACE = "#a8a59d", WR_ST_BASE = "#918e86";
const WR_ST_PLAQ = "#cdc9c0";

/* ============================================================================
 * 5.10.5 栏杆构件
 * ⚠️ 画法与 37 段网球场围栏**同源**（"沿一条线立柱子、高一律读成屏幕竖直"），
 *    但石栏杆有三层板（上枋/板身/下枋）要分层，而网是网格 —— 所以没共用函数。
 *    真正共用的是那条**投影口径**：世界点 (x, y, z) → 屏幕 (x, y − z)。
 * ==========================================================================*/

/* 一根望柱：立在地脚线 (x, y) 上的石方柱 + 外挑柱头 + 接地影
   ⚠️ 柱身只画 8 高（WR_RAIL_H − 2）而不是 −4：折半前柱头占 4、柱身占 16，
      折半后柱头 2、柱身 8 —— 那三个 `top + 4` 必须跟着变 `top + 2`，
      否则柱头顶到 4px 而柱身从 4 开始画、总高变成 12 ≠ WR_RAIL_H。
      这是本函数唯一的硬编码偏移，改 WR_RAIL_H 时必须回头看它。 */
function wrPost(g, x, y) {
  const X = Math.round(x) - WR_RAIL_PW / 2, Y = Math.round(y);
  const top = Y - WR_RAIL_H;
  px(g, X, top + 2, WR_RAIL_PW, WR_RAIL_H - 2, WR_ST_M);          // 柱身
  px(g, X, top + 2, 1, WR_RAIL_H - 2, WR_ST_L);                   // 西棱受光
  px(g, X + WR_RAIL_PW - 1, top + 2, 1, WR_RAIL_H - 2, WR_ST_D);  // 东棱背光
  px(g, X - 1, top, WR_RAIL_PW + 2, 2, WR_ST_L);                  // 柱头（外挑 1px）
  px(g, X - 1, top, WR_RAIL_PW + 2, 1, shade(WR_ST_L, 0.24));
  px(g, X - 1, Y + 1, WR_RAIL_PW + 2, 1, "rgba(14,18,28,0.30)");  // 接地影
}

/* 东西走向的一段：地脚线 y、从 xa 到 xb。
   屏幕矩形 x[xa..xb] × y[Y−H .. Y]，三层是**横条**。 */
function wrRailEW(g, xa, xb, y) {
  const x0 = Math.round(xa), x1 = Math.round(xb), Y = Math.round(y), w = x1 - x0;
  if (w <= 0) return;
  const L = [[WR_RAIL_H - WR_RAIL_T, WR_RAIL_T, WR_ST_L],                        // 上枋
             [WR_RAIL_H - WR_RAIL_T - WR_RAIL_M, WR_RAIL_M, WR_ST_M],            // 板身
             [WR_RAIL_H - WR_RAIL_T - WR_RAIL_M - WR_RAIL_B, WR_RAIL_B, WR_ST_D]]; // 下枋
  for (const [z, t, c] of L) px(g, x0, Y - z - t, w, Math.max(1, t), c);
  px(g, x0, Y - WR_RAIL_H, w, 1, shade(WR_ST_L, 0.24));            // 上枋顶棱
  px(g, x0, Y - WR_RAIL_H + WR_RAIL_T, w, 1, shade(WR_ST_M, -0.16));// 板身上棱
  /* 石板拼缝：**每单元正中一道**。原来写死 `x0 + 11; x += 11`（与 30px 的单元宽
     并不对齐）；折半后单元只有 15px，拼缝必须落在两柱之间才读得出"一块块石板"，
     所以改成从单元宽现算（半步起、整步走）。 */
  for (let x = x0 + (WR_RAIL_UW >> 1); x < x1 - 2; x += WR_RAIL_UW)
    px(g, x, Y - WR_RAIL_H + WR_RAIL_T, 1, WR_RAIL_M, shade(WR_ST_M, -0.16));
  const n = Math.max(1, Math.round(w / WR_RAIL_UW));
  for (let k = 0; k <= n; k++) wrPost(g, x0 + (w * k) / n, Y);
}

/* 南北走向的一段：地脚线 x、从 ya 到 yb。
   ⚠️ 屏幕上是**竖长条**，三层也是**竖条**（沿栏杆走向 = 屏幕竖直）——
      每层的屏幕高是 (yb−ya)+本层厚，起点 y0−z−t。写成"一个矩形往下切三层"是错的：
      那样北端 3px 之后就没有上枋了（第一次就写错了，出图才看见栏板缺半截）。 */
function wrRailNS(g, x, ya, yb) {
  const X = Math.round(x) - WR_RAIL_PW / 2, y0 = Math.round(ya), y1 = Math.round(yb);
  const len = y1 - y0;
  if (len <= 0) return;
  const L = [[WR_RAIL_H - WR_RAIL_T, WR_RAIL_T, WR_ST_L],
             [WR_RAIL_H - WR_RAIL_T - WR_RAIL_M, WR_RAIL_M, WR_ST_M],
             [WR_RAIL_H - WR_RAIL_T - WR_RAIL_M - WR_RAIL_B, WR_RAIL_B, WR_ST_D]];
  for (const [z, t, c] of L) px(g, X, y0 - z - t, WR_RAIL_PW, len + t, c);
  px(g, X, y0 - WR_RAIL_H, WR_RAIL_PW, 1, shade(WR_ST_L, 0.24));
  px(g, X, y0 - WR_RAIL_H + WR_RAIL_T, WR_RAIL_PW, 1, shade(WR_ST_M, -0.16));
  const n = Math.max(1, Math.round(len / WR_RAIL_UW));
  for (let k = 0; k <= n; k++) wrPost(g, x, y0 + (len * k) / n);
}

/* ============================================================================
 * 5.10.6 底座（灰石方柱 + 下段外挑台座 + 正面铭牌）
 * ==========================================================================*/
function wrPedestal(g) {
  const x0 = WR_PED_X0, x1 = x0 + WR_PED_W, yT = WR_PED_YT, yF = WR_PED_YF, yB = WR_PED_BY;
  /* ① 顶面（22 × 16）：北棱受光、东棱背光（全局 SUN = (-0.60, -0.80) 在西北）。
        ⚠️ 折半后受光/背光棱由 2px 收成 1px —— 22 宽的面上再压 2px 棱就占掉 1/5。 */
  px(g, x0, yT, WR_PED_W, WR_PED_D, WR_ST_TOP);
  px(g, x0, yT, WR_PED_W, 1, shade(WR_ST_TOP, 0.28));
  px(g, x0, yT, 1, WR_PED_D, shade(WR_ST_TOP, 0.14));
  px(g, x1 - 1, yT, 1, WR_PED_D, shade(WR_ST_TOP, -0.20));
  px(g, x0, yF - 1, WR_PED_W, 1, shade(WR_ST_TOP, -0.26));        // 顶面南棱（与立面交界）
  /* ② 立面：上段整宽 22，高 H−BS = 18 */
  px(g, x0, yF, WR_PED_W, WR_PED_H - WR_PED_BS, WR_ST_FACE);
  px(g, x0, yF, 1, WR_PED_H - WR_PED_BS, shade(WR_ST_FACE, 0.16));
  px(g, x1 - 1, yF, 1, WR_PED_H - WR_PED_BS, shade(WR_ST_FACE, -0.20));
  /* ③ 下段台座：每边外挑 WR_PED_O，一整圈"更宽的底座"（照片里最下面那一圈） */
  px(g, x0 - WR_PED_O, yB - WR_PED_BS, WR_PED_W + WR_PED_O * 2, WR_PED_BS, WR_ST_BASE);
  px(g, x0 - WR_PED_O, yB - WR_PED_BS, WR_PED_W + WR_PED_O * 2, 1, shade(WR_ST_BASE, 0.26));
  px(g, x0 - WR_PED_O, yB - 1, WR_PED_W + WR_PED_O * 2, 1, shade(WR_ST_BASE, -0.26));
  /* ④ 正面铭牌：浅色方板（照片里立面上唯一的高光细节）。22 宽的立面上放 12 × 7，
        底边离台座沿还有 6px —— 折半前是 22×15 放 44 宽立面上、底边余 12，比例一致。 */
  const pw = 12, ph = 7, qx = WR_CX - pw / 2, qy = yF + 5;
  px(g, qx - 1, qy - 1, pw + 2, ph + 2, shade(WR_ST_FACE, -0.32));
  px(g, qx, qy, pw, ph, WR_ST_PLAQ);
  px(g, qx, qy, pw, 1, shade(WR_ST_PLAQ, 0.22));
  px(g, qx, qy + ph - 1, pw, 1, shade(WR_ST_PLAQ, -0.24));
  px(g, qx, qy, 1, ph, shade(WR_ST_PLAQ, 0.10));
  px(g, qx + pw - 1, qy, 1, ph, shade(WR_ST_PLAQ, -0.14));
  /* ⑤ 接地：底座那一圈最深 */
  contactBand(g, x0 - WR_PED_O + 1, x1 + WR_PED_O - 1, yB - 1, 2, 0.32);
}

/* ============================================================================
 * 5.10.7 雕像本体（站立挥手像）
 *   自上而下：脸 5（含发 2）/ 颈 1 / 躯干 12 / 裤 12 / 鞋 2 = 32。
 *   ⚠️ 挥手的是**右臂**（照片里在观众看来在**左边**）—— 本项目所有建筑精灵都画朝南
 *      立面、人物也一律面朝南，所以雕像的右手 = 屏幕左侧。**别画反**。
 * ==========================================================================*/
function wrFigure(g) {
  const cx = WR_CX, foot = WR_FIG_FOOT;
  const T = foot - WR_FIG_H;                 // 1823 头顶
  const faceB = T + 5;                       // 1828 下颌
  const neckB = T + 6;                       // 1829 肩线
  const torsoB = T + 18;                     // 1841 下摆
  /* ① 头：发 2 + 脸 3；两侧各 1px 侧发把脑袋从背景里"切"出来 */
  px(g, cx - 2, T, 4, 5, WR_FIG_FACE);
  px(g, cx - 2, T, 4, 2, WR_FIG_HAIR);
  px(g, cx - 3, T + 1, 1, 3, WR_FIG_HAIR);
  px(g, cx + 2, T + 1, 1, 3, WR_FIG_HAIR);
  px(g, cx - 1, faceB - 1, 2, 1, shade(WR_FIG_FACE, -0.22));       // 下颌影
  /* ② 颈（折半后只剩 1px —— 再薄就没了，再厚就顶掉一格躯干） */
  px(g, cx - 1, faceB, 2, 1, shade(WR_FIG_FACE, -0.16));
  /* ③ 躯干：**上下同宽 8**（用户口径 ⑤）—— 没有收分，直筒。 */
  px(g, cx - 4, neckB, 8, torsoB - neckB, WR_FIG_M);
  px(g, cx - 4, neckB, 1, torsoB - neckB, WR_FIG_L);               // 西侧受光
  px(g, cx + 3, neckB, 1, torsoB - neckB, WR_FIG_D);               // 东侧背光
  /* 翻领（两块浅色小方）+ 领口开缝 */
  px(g, cx - 3, neckB, 2, 3, WR_FIG_L);
  px(g, cx + 1, neckB, 2, 3, WR_FIG_L);
  px(g, cx - 1, neckB, 1, 4, shade(WR_FIG_M, -0.26));
  /* 门襟扣：中线一列 */
  for (let y = neckB + 5; y < torsoB - 2; y += 4) px(g, cx - 1, y, 1, 1, WR_FIG_D);
  /* 下摆两个口袋：折半后每个只剩 2 宽（原来 5 宽，8 宽的躯干上放不下两个 5） */
  px(g, cx - 4, torsoB - 6, 2, 3, shade(WR_FIG_M, -0.16));
  px(g, cx + 1, torsoB - 6, 2, 3, shade(WR_FIG_M, -0.16));
  px(g, cx - 4, torsoB - 6, 2, 1, WR_FIG_L);
  px(g, cx + 1, torsoB - 6, 2, 1, WR_FIG_L);
  px(g, cx - 4, torsoB - 1, 8, 1, shade(WR_FIG_M, -0.14));         // 下摆压暗
  /* ④ 裤 + 鞋（用户口径 ④⑤）：一整块 8 宽，**与躯干同宽**，中间只一道同色系
        明暗线当裤缝 —— 是明暗不是缝隙，背景不会从裆里透出来。 */
  const paw = foot - torsoB - 2;             // 裤长 12（留 2 给鞋）
  px(g, cx - 4, torsoB, 8, paw, WR_FIG_PANT);
  px(g, cx - 4, torsoB, 1, paw, shade(WR_FIG_PANT, 0.14));         // 西侧受光
  px(g, cx + 3, torsoB, 1, paw, shade(WR_FIG_PANT, -0.18));        // 东侧背光
  px(g, cx, torsoB, 1, paw, shade(WR_FIG_PANT, -0.10));            // 裤缝（明暗线）
  /* 鞋：同样一整块 8 宽 2 高，中间 1px 暗线分出左右脚 */
  px(g, cx - 4, foot - 2, 8, 2, WR_FIG_SHOE);
  px(g, cx - 4, foot - 2, 8, 1, shade(WR_FIG_SHOE, 0.24));
  px(g, cx, foot - 2, 1, 2, shade(WR_FIG_SHOE, -0.30));
  /* ⑤ 右臂（**屏幕左侧**）向外上举。用户口径 ①：
        臂长 5 步（原来 12）、指尖只高过头顶 4px（原来 18）；
        **手不单独画** —— 臂端直接收一个 3×3 的方块（与臂同宽），不向外突出。
        斜带用"每步 1px 横 / 2px 竖"的阶梯逼近，3px 宽的方带在像素尺度下
        比逐点 1px 更结实（后者会画成一条毛毛的虚线）。
        ⚠️ 起笔 x 取 `cx − 5` 而不是 `cx − 4`：块是 (X−1) 起、3 宽，取 cx−4 时
           最右一列正好落在 cx−3，与**左侧鬓发同一列** ⇒ 斜带读成"从脑袋上长出来"。
           往左挪 1px 后，块右缘 cx−4 = 躯干左缘，仍与肩相连但离开了头。 */
  for (let i = 0; i <= 4; i++) {
    const X = cx - 5 - i, Y = neckB + 1 - i * 2;
    px(g, X - 1, Y - 1, 3, 3, WR_FIG_M);
    px(g, X - 1, Y - 1, 1, 3, WR_FIG_L);
    px(g, X + 1, Y - 1, 1, 3, WR_FIG_D);
  }
  px(g, cx - 11, T - 4, 3, 3, WR_FIG_FACE);                        // 手（3×3，与臂同宽）
  /* ⑥ 左臂（屏幕右侧）垂在身侧，手里一顶帽子（照片里胯边那块深色） */
  px(g, cx + 4, neckB + 1, 2, 9, WR_FIG_M);
  px(g, cx + 4, neckB + 1, 1, 9, WR_FIG_L);
  px(g, cx + 5, neckB + 2, 1, 8, WR_FIG_D);
  px(g, cx + 3, neckB + 9, 4, 2, WR_HAT);                          // 帽子（比臂宽 1px/侧）
  px(g, cx + 3, neckB + 9, 4, 1, shade(WR_HAT, 0.26));
  /* ⑦ 站在台面上的接地：脚下一道深带（不是投影 —— 投影落在台面上会读成"影子悬空"） */
  contactBand(g, cx - 4, cx + 4, foot - 1, 2, 0.22);
}

/* ============================================================================
 * 5.10.8 雕像精灵
 *   ⚠️ canvas 越界是**静默**的 —— 手指尖或柱头会被裁掉一条边还不报错
 *      （53 段的 DIA_RING_* 同理）。所以这个框**一律从上面那些尺寸派生**，
 *      不再各写一个绝对数字（第一版是一排手量的整数 2366/1744/146/186）：
 *        西 / 东 = 栏杆圈外 4px（柱头外挑 1 + 余量）
 *        北      = 头顶再往上 8（举起的右手要 6）
 *        南      = 底座落地线 + 26（方向性投影 SHY=21 + 余量）
 *   ⚠️ 绘制次序 = 遮挡关系：北栏杆（最远）→ 东西栏杆 → 底座+雕像 → 南栏杆（最近）。
 *      北栏杆的中间段会被后画的底座盖住，**这正是对的**（底座在圈内、离镜头更近）。
 * ==========================================================================*/
const WR_CV_X0 = WR_RAIL_X0 - 4;                       // 2402
const WR_CV_X1 = WR_RAIL_X1 + 20;                      // 2492（东侧容下投影 SHX=16）
const WR_CV_Y0 = WR_FIG_FOOT - WR_FIG_H - 8;           // 1815（头顶 1823 − 8）
const WR_CV_Y1 = WR_PED_BY + 26;                       // 1914（南侧容下投影 SHY=21）
const WR_CV_W = WR_CV_X1 - WR_CV_X0;                   // 90
const WR_CV_H = WR_CV_Y1 - WR_CV_Y0;                   // 99

function wrStand() {
  const c = mkCanvas(WR_CV_W, WR_CV_H), g = c.getContext("2d");
  /* ⚠️ 用 canvas 变换把画布原点挪到世界 (WR_CV_X0, WR_CV_Y0)，于是下面每个绘图函数
     都直接吃**世界坐标**（等价于 53 段到处包一层的 diaX/diaY，只是少写几百个括号）。
     能这么干的前提：px / poly / shadowQuad / contactBand 全都只走 fillRect 路径 ——
     已核实（_syn.js:180-195）。哪天有工具改成 getImageData / 或读 g.canvas 的像素，
     这条就失效，那时必须退回逐个坐标转换。 */
  g.translate(-WR_CV_X0, -WR_CV_Y0);
  /* ⚠️ SHX / SHY 是**函数内现算**的两个局部量，**不是**全局常量 —— 30_building.js:83 与
     36_library.js:472 都是这个写法，全校没有第二份。第一版本段直接写了 `SHX, SHY`
     ⇒ 加载期 `ReferenceError: SHX is not defined`（那时 props 已装到 67 件）
     ⇒ 整页 JS 死、雕像根本没进 props，而 `_propview.py` 只会报一句
     `no prop tag weiren`，看不出是页面死了（三套自动验收同样全绿）。
     SUN 定义在 10_const.js（最前），本段顶层读它是安全的。 */
  const SHX = Math.round(-SUN.x * 26), SHY = Math.round(-SUN.y * 26);
  /* 方向性投影（SUN 在西北 ⇒ 影子朝右下）：只给底座投，栏杆投了会把草地糊脏 */
  shadowQuad(g, WR_PED_X0 + 2, WR_PED_BY - 9, WR_PED_X0 + WR_PED_W - 2, WR_PED_BY,
             SHX, SHY, 0.26, 4);
  wrRailEW(g, WR_RAIL_X0, WR_RAIL_X1, WR_RAIL_Y0);       // 北（远）
  wrRailNS(g, WR_RAIL_X0, WR_RAIL_Y0, WR_RAIL_Y1);       // 西
  wrRailNS(g, WR_RAIL_X1, WR_RAIL_Y0, WR_RAIL_Y1);       // 东
  wrPedestal(g);
  wrFigure(g);
  wrRailEW(g, WR_RAIL_X0, WR_RAIL_X1, WR_RAIL_Y1);       // 南（近）
  /* ⚠️ 锚点是**画布坐标**（不受 translate 影响，addProp 认的就是这个）*/
  return { canvas: c, ax: WR_CX - WR_CV_X0, ay: WR_RAIL_Y1 - WR_CV_Y0 };
}

/* --- 5.10.9 净空：把雕像圈周围的草树清掉 ---
   散射与规则树阵各摆各的，这块草坪上本来就有柏树 / 樱花 / 灌木（实测散点落在
   圈内与圈边），不清理就是"栏杆从树里长出来"。
   净空框 = **精灵画布框（WR_CV_*）四边各外扩 8** —— 折半前是一排手量的
   `栏杆圈 ± 32/16`（196×132）；改成从画布框派生有两条好处：
     ① 整个组件再缩再长，净空自己跟上（第一版的绝对数字正是"上一轮改尺寸忘了改它"
        那一类地雷）；
     ② 判据对的是**画出来的东西**（画布框），不是"圈多大"这个间接量 ——
        树只要可能压到任何一笔（包括举起来的那只手）就得清掉。
   框本身比第一版小得多（106×115 vs 196×132 = 少 54%），落在框外的树自然就多了。
   ⚠️ 必须排在 §6.6c 的 clearPropTreeClash() **之后**（先跑会改它的保留集，
      clashDropped 的计数跟着变，验收数字就对不上了 —— 与 §5.2.8/§5.3.10 同款约束）。 */
const WR_CLR = { x: WR_CV_X0 - 8, y: WR_CV_Y0 - 8,
                 w: WR_CV_W + 16, h: WR_CV_H + 16 };
function clearWrClearance() {
  const C = WR_CLR, cx1 = C.x + C.w, cy1 = C.y + C.h;
  const keep = [];
  let dropped = 0;
  for (const p of props) {
    /* 雕像自己保留；宽 > 110 的当楼处理（这一片没有楼，保险起见 —— 同 §5.3.10） */
    if (p.tag === "weiren" || p.img.width > 110) { keep.push(p); continue; }
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
