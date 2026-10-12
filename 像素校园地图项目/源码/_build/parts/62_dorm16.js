/* ============================================================================
 * §5.12 16 号宿舍楼：两个灰蓝门楼 + 红砖墙 + 白色空调外机
 * ----------------------------------------------------------------------------
 * 源（两份，用户 2026-09-19 指定）：
 *   ① `预览/18haosushelou.jpg`（正拍，1545×1280）—— **楼体**的权威：
 *      砖红墙、成排的窗、密布的白色空调外机、通高的灰蓝门楼、雨篷下四柱
 *      + 两片白色格栅 + 暗红双开门。
 *      ⚠️ 文件名是 18 号，但用户当天明确「额之前说错了，我说的是 16 号宿舍楼」，
 *         照片里门上那块"16"门牌也印证了 —— **照片就是 16 号楼**。
 *   ② `校园示意图.pptx` 第 5 页 —— **门楼**的权威（用户自己画的门楼立面）：
 *      门楼正墙 + 4 条窗户带 + 雨篷 + 4 根柱 + 中间的门 + 门下梯形阶梯。
 *      ⚠️ **那一页的蓝色是 PPT 主题色 accent1（渲染约 #2E54A1），是"窗户带"的
 *         标识色，不是门楼的实际颜色** —— 用户原话「蓝色代表窗户带，梯形是阶梯」。
 *         门楼的实际颜色只有一个来源：照片实测的 grayblue #afb3bf。
 *         （§10.3 的坑：ppt 里 scheme:bg1 读出来是白、渲染出来是灰，一切以渲染图为准。）
 *
 * 一、为什么是"覆盖重绘"
 *   同 §5.5 老体育馆 / §5.8 思源东西楼 / §5.9 新体育馆 / §5.11 科学会堂：
 *   30_building.js 是全校**所有**楼的通用生成器，16 号楼只是它的两行数据
 *   （一行占位、一行 styleOf）。这里不动模板，事后在**同一张 canvas** 上重绘。
 *   楼体、屋面、屋名标牌一概不碰。
 *
 * 二、用户点名的五件事（照做）
 *   ① **楼体是红色的** —— 新增 PALETTE 第 6 档（红砖 p:5），见 60_assemble.js §6.1；
 *   ② **窗户** —— 不重画，**保留 30 段已经画好的**（见 §三.3）；
 *   ③ **白色空调外机** —— 30 段对全校都不画，本段按实拍补（§五）；
 *   ④ **两个门楼，一左一右，都距边 2 个窗户** —— §四；
 *   ⑤ **大门前四根柱子，正对门之外的两个空挡是白色小柱子组成的网格** —— §四.4。
 *
 * 三、几何：**从精灵高度反推 + 从 30 段的窗列公式现算，不硬编码任何一栋楼的数**
 *   1. 纵向：30 段的 canvas 高 H = PADT(18) + roofT + wallH + SHY + 14，
 *            eaveY = PADT + roofT、baseY = eaveY + wallH
 *            ⇒ 消去 roofT 得 **eaveY = baseY − wallH**（与 58 段同一把尺子）。
 *            makeBuilding 的返回值里没有 eaveY，但有 `ay = baseY` ⇒ eaveY 现推。
 *      ⚠️ 这也是为什么层数是"数据"：D16_FLOORS 一变，wallH 跟着变，本段跟着对。
 *   2. 横向：canvas 宽 = w + PADX·2 = w + 52，**墙**在 [26, 26 + w]。
 *   3. 窗列：30 段 §3.5 的公式（`margin` = 22）——
 *              cols  = max(1, floor((w − 44 + WIN_GAP) / (WIN_W + WIN_GAP)))
 *              stepX = (w − 44 − cols·WIN_W) / (cols − 1)
 *              wx(cn) = round(margin + cn · (WIN_W + stepX))
 *      ⚠️ 这里**必须把同一个公式再算一遍**，不能另立一套 —— 门楼一旦与窗列错开，
 *         门楼边缘就会切在半扇窗户上，而这个错位在四套自动验收里**一个都查不出来**
 *         （它们不量像素），只有出图看得见。
 *      ⚠️ 为什么不是把窗"擦掉重排"：窗是 30 段画的，**保留它**就自动与全校园同一套
 *         窗距、同一套窗型、同一套楼层线；重排等于在门楼里造第二套窗，还会和上下层
 *         的窗台、雨水管打架。所以门楼区只**换墙色**、不碰窗（见 §四.1）。
 *
 * 四、两个门楼
 *   0. 尺寸：**宽 = 2 个窗周期**（照片里门楼宽 ≈ 2 个窗位，实测吻合）。
 *      位置：外边缘距墙边**对称相等**，取值 = "第 3 列窗左缘再左移半个窗距 − 墙左"，
 *      即门楼外恰好**完整留下 2 列窗** —— 这就是用户说的"都距离边 2 个窗户"。
 *      ⚠️ 加长后 cols = 13 是**奇数** ⇒ 逐列对齐的话左右必差一列。所以取"左门楼
 *         外边缘落在空隙中线"这个值、**右侧镜像同一个值**；实测右门楼与窗列的
 *         错位 < 1px，肉眼不可见。这是"用户要的对称"与"窗户要对齐"两条约束下
 *         唯一可行的交点。
 *   1. 换色：门楼区（eaveY..baseY）内**逐个像素**判定，凡"红通道显著高于绿蓝"
 *      （即 30 段画的砖红墙、砖纹、楼层线、窗台、窗框外缘）一律换成灰蓝，
 *      按**原亮度比例**缩放 ⇒ 明暗层次（砖纹、楼层线、窗台受光）全部保留；
 *      不是红的（窗洞 #2c3746、玻璃、白框、阴影）**原样留下** ⇒ 窗户自动进门楼。
 *   2. 门楼立面（自上而下，比例全部取自 ppt 第 5 页，以门楼宽 W 为 1）：
 *         灰蓝墙面      通高 eaveY..baseY（含已画好的窗）
 *         雨篷          宽 1.000W，高 13，顶面在 baseY − 57
 *         柱 ×4         宽 0.049W，左缘在 0 / 0.1908 / 0.7586 / 0.951（末根贴右棱）
 *         白色网格 ×2   在 0.049~0.1908 与 0.8076~0.951 两档 = 用户说的"另外两个空挡"
 *         门            0.2954W ~ 0.6988W（宽 0.403W），高 44
 *         梯形阶梯      宽 1.11W（ppt 实测比门楼各出 5.6%），上窄下宽
 *       ⚠️ 四根柱形成**三个**空挡：中间那个正对门，左右两个才是白网格 —— 与照片逐点吻合。
 *
 * 五、白色空调外机
 *   ⚠️ 30 段**不画空调**（全校都没有）⇒ 这是本段独有，只写在**红墙上**，
 *      门楼区里一台不挂（照片里灰蓝门楼上确实没有）。
 *   位置 = 每层每列窗的**右侧外挂**（照片里绝大多数挂在窗右，少数挂窗左），
 *      三成不装。用**局部 `makeRng(1607)`** 定每台的位置与有无
 *      —— ⚠️ 绝不能碰共享 RNG：那会把全校园的散射重掷一遍（§6.6 那颗地雷）。
 *
 * 六、⚠️ 本段遵守的三条纪律（都是别的段栽过的）
 *   ① **必须由 60_assemble.js 在 `addProp()` 之前调** —— addProp 取的就是
 *      `s.canvas`，晚一步挂进 props 的还是旧精灵（55/58/59/61 都栽过）；
 *   ② **不动 `b.ay`**（与 61 段的 KX_DY 不同）：楼高、世界落地线、碰撞盒一字不动，
 *      这栋楼在画面上的位置与改前完全一致；
 *   ③ **不动 `bSeed`、不碰共享 RNG**；本段只用局部 `makeRng(1607)`。
 *   ⚠️ 以及那条最贵的：**改完必须出图**。曾有一版门区被 clearRect 擦空后早退，
 *      交付件里的门是一片透明，而 accept 34/34、verify、zoomtest 28/28、
 *      _propdiff 306/306 四套自动验收全部绿灯 —— 它们都不看画面。
 * ========================================================================= */

const D16_FLOORS = 6;             // ⚠️ 必须与 60_assemble.js styleOf 的 `/^16宿舍楼$/` 那行一致；build.py 有断言
const D16_GRAY   = "#afb3bf";     // 门楼灰蓝（照片实测 grayblue n=35320 中位色，直接可用）
const D16_GRAY_D = "#8e96a6";     // 灰蓝暗部（门洞内、网格底、柱侧）
const D16_MESH   = "#e9ecf2";     // 白色小柱网格（照片里白得很亮）
const D16_DOOR   = "#8c3a34";     // 暗红双开门（照片实测门上比墙更深更沉）
const D16_APRON  = "#c6c7c2";     // 门前地坪（浅灰石板）
const D16_AC     = "#e2e5ea";     // 空调外机白壳
const D16_AC_D   = "#9aa0aa";     // 外机暗部 / 格栅

const D16_DH     = 44;            // 门洞高（与 30 段 §3.4 的 dh 同一个数）
const D16_CY_OF  = 57;            // 雨篷顶面在 baseY 上方多少（= 门洞 44 + 雨篷 13，与 30 段 §3.7 同）

function dorm16Restyle(b, pal) {
  const g = b.canvas.getContext("2d");
  const baseY = b.ay, bw = b.w;                 // ⚠️ b.ay 就是 30 段的 baseY（返回结构里只有它）
  const x0 = 26, x1 = x0 + bw;                  // 墙的左 / 右边缘（canvas 坐标）
  const eaveY = baseY - D16_FLOORS * FLOOR_H;   // 消去 roofT：eaveY = baseY − wallH

  /* --- 3. 复算 30 段 §3.5 的窗列（逐字同一套公式，保证门楼与窗严格对齐） --- */
  const margin = 22;
  const cols = Math.max(1, Math.floor((bw - margin * 2 + WIN_GAP) / (WIN_W + WIN_GAP)));
  const stepX = (bw - margin * 2 - cols * WIN_W) / (cols - 1 || 1);
  /* ⚠️ 30 段 §3.5 那行是 `Math.round(margin + cn * (WIN_W + stepX))`，**没加 x0**。
     于是窗带起点落在 22，而墙左缘 x0 = 26 ⇒ 整条窗带比墙偏左 26px
     （左 margin = −4、右 margin = 48）。照抄就会把门楼一起带歪：
     左门楼左边留 2 列窗、右边一列都不留。
     这里补上 x0，窗带在墙内左右各留 22 ⇒ 两个门楼严格对称（inset 本来就是
     按"相对 x0"写的，补上之后自动回到 72，别的数一个都不用改）。 */
  const colX = cn => x0 + Math.round(margin + cn * (WIN_W + stepX));
  const P = WIN_W + stepX;                      // 窗周期

  /* --- 0. 两个门楼：宽 = 2 个窗周期，外边缘距墙边对称 --- */
  const mw = Math.round(P * 2);
  const inset = Math.round(colX(2) - stepX / 2 - x0);
  const mAns = [
    { a: x0 + inset,     b: x0 + inset + mw },  // 左门楼
    { a: x1 - inset - mw, b: x1 - inset }       // 右门楼（镜像同一个 inset）
  ];

  /* === 6.2 窗阵重排：修掉 30 段那个"最下两排窗叠在一起"的缺陷（只修 16 号楼） ===
     ⚠️ 病根（2026-09-19 出图比对 16 号楼与 18 号楼，两栋一模一样地叠）：
        30 段 §3.5 的行公式对**任何层数**都把首层窗放在 `baseY − 30 − WIN_H`，
        而它自己那套"最上一层"公式算出来的位置是 `eaveY + floors·34 − 48`
        —— 两者**只差 4px**，而窗本身高 22 ⇒ **最下面两排窗叠掉 18px**。
        3 / 4 / 6 层全部如此 ⇒ **全校每一栋楼都这样**（红砖对比度高于米色墙，
        所以这个缺陷在 16 号楼上最扎眼）。
     ⚠️ 本轮**只修 16 号楼**，30 段模板一个字不动（其余楼维持原样，等用户拍板要不要
        全校统一下手）。做法是**把整面墙按 30 段 §3.3 / §3.6 的笔法重画一遍**，
        再画新窗 —— 擦与补合成一件事，墙是连续的，擦除区边缘不会留下接缝。
        同理补回：檐下阴影带、楼层腰线、左右棱、雨水管、接地带（都在重画区里）。
     正确的排布：每层 34px、窗高 22、上下各留 6 ⇒ 第 f 层（0 = 顶层）窗顶
        `eaveY + 6 + f·34`。6 排正好**各自落在 6 条楼层腰线内**（30 段那套本来就与
        腰线错位），首层窗底距地 6px。
     ⚠️ 顺序：必须在 §1 门楼区换色**之前** —— 换色只认"红的"，新窗不是红的，
        所以先重画墙和窗、再换色，门楼里的窗才会自动跟着进门楼。 */
  /* ⚠️ 先擦掉 30 段旧窗带**伸出墙外**的那一窄条：colX(0) = 22（30 段的老公式），
     墙左缘却是 x0 = 26，而 `winAt` 又从 `wx − 1` 起画 ⇒ 残留 [21, 26) 一条 5px 窗渣。
     重铺墙是从 x0 起的，**擦不到它** —— 出图看就是楼左缘外挂着半截窗框。
     只擦**左侧**：右侧旧窗（最右 377）全在墙内 424 之内；而右侧 padding 里有
     30 段的落地投影（`shadowQuad` 右移 SHX = 16px），跟着一起擦会削掉楼角影子。
     擦完补回 30 段那根 1px 左缘描边（§3.x 尾巴上那两行，它正落在被擦的列上）。 */
  g.clearRect(0, eaveY + 1, x0, baseY - eaveY - 1);
  px(g, x0 - 1, eaveY + 1, 1, baseY - eaveY + 2, shade(pal.wall, -0.44));
  px(g, x0, eaveY + 2, bw, baseY - eaveY - 2, shade(pal.wall, -0.10));          // 墙底
  for (let yy = eaveY + 7; yy < baseY; yy += 5) {                               // 砖纹（照 §3.3）
    px(g, x0, yy, bw, 1, "rgba(0,0,0,0.09)");
    const off = ((((yy - eaveY) / 5) | 0) & 1) ? 4 : 0;
    for (let xx = x0 + off; xx < x1; xx += 8) px(g, xx, yy - 5, 1, 5, "rgba(0,0,0,0.06)");
  }
  for (let i = 0; i < 10; i++)                                                  // 檐下阴影带
    px(g, x0, eaveY + 2 + i, bw, 1, "rgba(14,18,28," + (0.34 * (1 - i / 10)).toFixed(3) + ")");
  for (let f = 0; f < D16_FLOORS; f++)                                          // 楼层腰线
    px(g, x0, eaveY + f * FLOOR_H, bw, 2, shade(pal.wall, -0.20));
  px(g, x0, eaveY + 2, 3, baseY - eaveY - 2, shade(pal.wall, 0.18));            // 左棱受光
  px(g, x1 - 4, eaveY + 2, 4, baseY - eaveY - 2, shade(pal.wall, -0.30));       // 右棱背光
  const pipeX = x1 - 7;                                                         // 雨水管（照 §3.6）
  px(g, pipeX, eaveY + 3, 3, baseY - eaveY - 3, shade(pal.wall, -0.24));
  px(g, pipeX, eaveY + 3, 1, baseY - eaveY - 3, shade(pal.wall, 0.04));
  px(g, pipeX - 1, Math.round((eaveY + baseY) / 2) - 5, 5, 2, shade("#8b8f96", -0.10));
  px(g, pipeX - 1, baseY - 12, 5, 2, shade("#8b8f96", -0.22));
  contactBand(g, x0 + 1, x1 - 1, baseY - 1, 2, 0.34);                           // 接地带
  /* 6 排窗 × cols 列（窗型逐字照抄 §3.5 的 winAt，只换色源 pal.glass / pal.wall） */
  const winAt = (wx, wy) => {
    px(g, wx - 1, wy - 1, WIN_W + 2, WIN_H + 2, shade(pal.wall, 0.12));
    px(g, wx + WIN_W, wy - 1, 1, WIN_H + 2, shade(pal.wall, -0.34));
    px(g, wx, wy, WIN_W, WIN_H, "#2c3746");
    px(g, wx, wy, WIN_W, 2, "rgba(10,13,20,0.58)");
    px(g, wx, wy, 2, WIN_H, "rgba(10,13,20,0.44)");
    px(g, wx + 2, wy + 2, WIN_W - 6, 3, shade(pal.glass, 0.28));
    px(g, wx + 3, wy + 6, WIN_W - 9, 2, shade(pal.glass, 0.12));
    px(g, wx + 6, wy + 4, 1, WIN_H - 8, shade(pal.wall, -0.52));
    px(g, wx + 2, wy + Math.round(WIN_H * 0.62), WIN_W - 4, Math.round(WIN_H * 0.34), shade(pal.glass, -0.24));
    px(g, wx - 2, wy + WIN_H, WIN_W + 4, 3, shade(pal.wall, 0.24));
    px(g, wx - 2, wy + WIN_H + 3, WIN_W + 4, 1, "rgba(14,18,28,0.28)");
  };
  for (let f = 0; f < D16_FLOORS; f++) {
    const wy = eaveY + 6 + f * FLOOR_H;
    for (let cn = 0; cn < cols; cn++) winAt(colX(cn), wy);
  }

  /* --- 1. 门楼区换色：砖红 → 灰蓝；窗洞 / 玻璃 / 白框原样留下 --- */
  const GY = rgb(D16_GRAY);
  const wl = rgb(pal.wall);
  const baseLum = wl[0] * 0.299 + wl[1] * 0.587 + wl[2] * 0.114;
  const gh = baseY - eaveY;
  for (const m of mAns) {
    const gw = m.b - m.a;
    const img = g.getImageData(m.a, eaveY, gw, gh), d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      if (d[i + 3] === 0) continue;                       // canvas 透明处不动
      const r = d[i], gg = d[i + 1], bb = d[i + 2];
      if (!(r > gg + 18 && r > bb + 18)) continue;        // 不是红 ⇒ 是窗/玻璃/白框，留下
      const k = (r * 0.299 + gg * 0.587 + bb * 0.114) / baseLum;
      d[i]     = Math.min(255, GY[0] * k) | 0;
      d[i + 1] = Math.min(255, GY[1] * k) | 0;
      d[i + 2] = Math.min(255, GY[2] * k) | 0;
    }
    g.putImageData(img, m.a, eaveY);
    /* 两侧各压一道棱（照 30 段 §3.3 的左受光 / 右背光） */
    px(g, m.a, eaveY, 2, gh, shade(D16_GRAY, 0.20));
    px(g, m.b - 3, eaveY, 3, gh, "rgba(20,24,32,0.20)");
  }

  /* --- 2. 门楼细部：地坪 / 梯 / 柱 / 网格 / 门 / 雨篷 --- */
  const CY = baseY - D16_CY_OF;                 // 雨篷顶面
  for (const m of mAns) {
    const gw = m.b - m.a;
    const X = t => Math.round(m.a + gw * t);    // 比例 → canvas 坐标

    /* 2.1 门前地坪：最先铺 —— 顺手压掉 30 段留在 baseY 附近的原雨棚台阶 */
    px(g, m.a - 8, baseY - 1, gw + 16, 13, D16_APRON);
    px(g, m.a - 8, baseY - 1, gw + 16, 2, shade(D16_APRON, 0.24));
    px(g, m.a - 8, baseY + 11, gw + 16, 1, "rgba(14,18,28,0.26)");

    /* 2.2 梯形阶梯（ppt 第 5 页那个梯形：上窄下宽，比门楼各出 5.6%） */
    const out = Math.round(gw * 0.055);
    poly(g, [[X(0.05), baseY - 1], [X(0.95), baseY - 1],
             [m.b + out, baseY + 9], [m.a - out, baseY + 9]],
         shade(D16_APRON, -0.12));
    px(g, Math.round(m.a - out * 0.5), baseY + 4, gw + out, 1, "rgba(14,18,28,0.20)");
    px(g, Math.round(m.a - out), baseY + 9, gw + out * 2, 1, "rgba(14,18,28,0.30)");

    /* 2.3 四根柱（先画，雨篷压在上面）。左缘比例取自 ppt：#6/#7/#9/#10 */
    const CW = Math.max(3, Math.round(gw * 0.049));
    for (const t of [0, 0.1908, 0.7586, 0.951]) {
      const cxp = X(t), cw = Math.min(CW, m.b - cxp);
      px(g, cxp, CY, cw, baseY - CY, shade(D16_GRAY, 0.06));
      px(g, cxp, CY, 2, baseY - CY, shade(D16_GRAY, 0.24));          // 左棱受光
      px(g, cxp + cw - 2, CY, 2, baseY - CY, "rgba(20,24,32,0.24)"); // 右棱背光
    }

    /* 2.4 两片白色小柱网格 —— 用户：「除了正对门之外另外两个空挡是白色小柱子组成的网格」
           照片里是**交叉斜格**（菱形花格），所以用 clip + lineWidth 2 的斜线交织。 */
    for (const band of [[0.049, 0.1908], [0.8076, 0.951]]) {
      const mx0 = X(band[0]), mx1 = X(band[1]);
      const my0 = CY + 13, my1 = baseY;
      px(g, mx0, my0, mx1 - mx0, my1 - my0, D16_GRAY_D);
      g.save();
      g.beginPath(); g.rect(mx0, my0, mx1 - mx0, my1 - my0); g.clip();
      g.strokeStyle = D16_MESH; g.lineWidth = 2;
      const hh = my1 - my0;
      for (let dd = -hh; dd < (mx1 - mx0) + hh; dd += 7) {
        g.beginPath(); g.moveTo(mx0 + dd, my0); g.lineTo(mx0 + dd - hh, my1); g.stroke();
        g.beginPath(); g.moveTo(mx0 + dd, my0); g.lineTo(mx0 + dd + hh, my1); g.stroke();
      }
      g.restore();
      px(g, mx0, my0, mx1 - mx0, 1, "rgba(20,24,32,0.30)");          // 网格上沿
    }

    /* 2.5 门：0.2954W ~ 0.6988W（ppt 实测，居中于中间那个空挡） */
    const dA = X(0.2954), dB = X(0.6988);
    px(g, dA - 2, CY + 13, dB - dA + 4, baseY - CY - 13, shade(D16_GRAY_D, -0.34));  // 门洞
    px(g, dA, baseY - D16_DH, dB - dA, D16_DH - 2, D16_DOOR);                        // 门扇
    px(g, Math.round((dA + dB) / 2) - 1, baseY - D16_DH, 2, D16_DH - 2, "rgba(20,10,8,0.45)"); // 双扇中缝
    /* 门上方的横格栅（照片里雨篷正下方那排浅色格栅） */
    for (let i = 0; i < 4; i++)
      px(g, dA, CY + 16 + i * 6, dB - dA, 3, i % 2 ? "rgba(20,24,32,0.30)" : shade(D16_GRAY, 0.16));
    px(g, dA, baseY - 3, dB - dA, 3, shade(D16_APRON, -0.06));                       // 门槛石

    /* 2.6 雨篷：最后画 —— 压住柱顶与门洞上沿（宽 1.000W，与 ppt 的 0.9996 同） */
    px(g, m.a, CY, gw, 3, shade(D16_GRAY, 0.32));                     // 顶面受光
    px(g, m.a, CY + 3, gw, 1, "rgba(20,24,32,0.36)");                 // 沿口线
    px(g, m.a, CY + 4, gw, 9, shade(D16_GRAY_D, 0.06));               // 篷身
    for (let i = 0; i < 5; i++)                                       // 篷下渐隐影
      px(g, m.a, CY + 13 + i, gw, 1, "rgba(20,24,32," + (0.26 * (1 - i / 5)).toFixed(3) + ")");
  }

  /* --- 5. 白色空调外机：只挂在红墙上（门楼区一台不挂） --- */
  const rng = makeRng(1607);                    // ⚠️ 局部种子，绝不碰共享 RNG
  const AC_W = 14, AC_H = 10;
  for (let f = 0; f < D16_FLOORS; f++) {
    /* ⚠️ 必须用 §6.2 重排后的行公式 —— 30 段那套（首层 baseY−52 / 其余 eaveY+16+…）
       在这里已经不存在了，跟着它会全部挂到墙上没窗的位置去。 */
    const wy = eaveY + 6 + f * FLOOR_H;
    if (wy + WIN_H > baseY) continue;
    for (let cn = 0; cn < cols; cn++) {
      const wx = colX(cn);
      const inGate = mAns.some(m => wx + WIN_W > m.a - 6 && wx < m.b + 6);
      const skip = rng();
      const side = rng();
      const off = rng();
      if (inGate) continue;                     // 门楼区：跳过（但要照常推进 rng，保持确定性）
      if (skip < 0.30) continue;                // 三成没装
      let ax = side < 0.82 ? wx + WIN_W + 2 : wx - AC_W - 2;           // 绝大多数挂窗右
      /* ⚠️ 不许挂到墙外：最左一列窗的 `wx − 16` 会越过墙左缘（x0），
         第一版就在楼的左边悬了一台空调（出图才看见）。越界就改挂另一侧。 */
      if (ax < x0 + 1) ax = wx + WIN_W + 2;
      else if (ax + AC_W > x1 - 1) ax = wx - AC_W - 2;
      const ay = wy + Math.round((WIN_H - AC_H) * (0.20 + off * 0.55));
      px(g, ax, ay, AC_W, AC_H, D16_AC);                               // 外壳
      px(g, ax, ay, AC_W, 1, "#ffffff");                               // 顶面受光
      px(g, ax, ay + AC_H - 1, AC_W, 1, D16_AC_D);                     // 底面
      px(g, ax, ay + 2, AC_W - 3, 1, "rgba(20,24,32,0.20)");           // 格栅暗线
      px(g, ax + AC_W - 3, ay + 2, 3, AC_H - 4, D16_AC_D);             // 右侧
      px(g, ax - 1, ay + AC_H, AC_W + 2, 1, "rgba(14,18,28,0.22)");    // 投影
    }
  }

  return b;
}
