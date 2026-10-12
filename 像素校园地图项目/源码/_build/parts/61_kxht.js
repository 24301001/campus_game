/* =========================================================
   §5.11 科学会堂：正面按用户给的 ppt 正面图覆盖重绘
   ---------------------------------------------------------
   用户口径（2026-09-17）：
     「然后进行科学会堂的复刻，也就是思源东楼北边的科学会堂。字体和照片以及 ppt
       制作的正面图都有，注意阶梯，ppt 左右的三角形和门下边的矩形都是阶梯，
       字体 1 比 1 复刻，阶梯旁边有两个柱子上边两个用来放花的半圆形盆。有可能
       会因为思源东楼遮挡一些，你适当将科学会堂向上移动一些」

   三件输入件各管一段，**不重叠**：
     ① `D:\desktop\校园示意图.pptx` **第 4 页** = **唯一的几何权威**
        （红线 3：PPT 是地图数据的唯一来源，正面图的逐形状几何同样从它读）。
        `_build/_kxslide.py 4` 把这一页 13 个形状打成英寸表 —— 本文件的 KX_EL
        就是那张表，**任何尺寸不许在别处再写一份**（坑 18：派生量不许存第二份）。
        ⚠️ `_kxslide.py` 的 union 行**没算旋转**（rtTriangle 21 的 rot=270 会把
           外框撑到 3.9431），真外框是 11.5299 × 3.6354 —— 见该工具头注释。
     ② `预览/kexuehuitang.jpg`（实拍）= **配色与材质**权威：浅灰石板檐口带 + 金字、
        白瓷砖墙、近黑玻璃幕墙（映着门前的树）、浅灰石台阶、柱顶半圆盆里两颗
        蓝绿半球植株。**比例不照照片** —— 那是地面机位的透视片，量出来是错的
        （照片里檐口带只占立面 27%，正面图是 37%）；按用户拍板，比例一律以正面图为准。
     ③ `预览/kexuehuitangfont.png`（金笔四字）= 檐口带上的「科學會堂」，
        由 `_build/_kxfont.py` 逐点降采样成 1bit 点阵（1:1 复刻字形）。

   ⚠️ 与 ppt 的三处**有意偏离**（交付说明里已声明）：
     ① ppt 把檐口带涂成默认蓝（`scheme:accent1` = #4874CB，见 `_kxslide.py`
        的 fill 列）—— 实拍是浅灰石板，按实拍画；
     ② 白底带字那一条（矩形3，x 3.4375..10.1625）实拍里与两侧同色 ⇒ 不做白/蓝
        分色，整条一色（金字因此按**檐口板**居中，比按矩形3 居中右偏 1.3px）；
     ③ 右侧的柱 / 三角 / 盆在 ppt 里比左侧低 0.03~0.1 英寸（手绘误差）⇒
        一律按**左侧的底线**归一，左右对称。

   ⚠️ 两个已知代价（用户拍板时已知，交付说明里也要写）：
     · 为让整栋从思源东楼屋脊后露出来，**精灵锚点北移 KX_DY = 85 行**。
       只动 `b.ay`：PPT 轮廓 / 灰硬地 / 碰撞盒 / 全校园散射随机流一个数都不动
       （见 60_assemble.js §6.6 那颗地雷）。
     · 北边第一教学楼最底 **8 行**（含门的下半截 ~6 行，门把手仍露）会被本栋的
       屋面板压住 —— 3/4 视角里"近楼挡远楼"的常态遮挡，不是画错。
       实测：第一教学楼精灵 = `-,2460,897,377,303`（世界行 594..897），
       本栋最上一行不透明像素 = (1206.5 − 334) + KX_PADT(18) = 890.5 ⇒ 压 890..897。

   ⚠️ 本段**只盖不擦**：立面整段是在**新画布**上重画的，不是 clearRect ——
      见 kxRestyle() 的三段说明。全零件只有一处 clearRect（撤屋名标牌，
      它挂在檐口**之上**，不擦掉会有个牌子浮在平屋面上）。
   ========================================================= */

const KX_NAME   = "科学会堂";
const KX_PADX   = 26, KX_PADT = 18;          // 与 30 段同值
const KX_PADB   = 21 + 14;                   // SHY + 14 —— 30 段画布高公式的尾巴
const KX_FLOORS = 2;                         // ⚠️ 必须等于 styleOf("科学会堂").floors
const KX_DY     = 85;                        // 整栋北移量（只落在锚点上，见文件头）

/* 正面图外框（英寸）与几支比例锚 —— 全部**现算**，函数体里不许再出现具体像素数 */
const KX_EW = 11.5299, KX_EH = 3.6354;       // 外框 = KX_EL 里所有形状的并集
const KX_SLAB_H = 1.3576;                    // 檐口带高（矩形5/3/6 同高）
const KX_SOFF_R = 0.045;                     // 檐下投影带高 / 立面高（实拍量出 < 5%）
const KX_GLYPH_R = 0.64;                     // 金字字高 / 檐口带高（probe 定稿）
const KX_GAP    = 4;                         // 金字间隔
const KX_TILE   = 4;                         // 白瓷砖格（3 砖 + 1 缝，与 58 段 DX_TILE 同规）
const KX_STEPS  = 6;                         // 台阶级数：中央 6 级，两侧三角阶梯同规
const KX_SHADOW_H = 24;                      // 方向性投影高 —— 照 30 段 §3.1 的 min(24, depth*0.3)

/* 正面图逐形状（英寸；原点 = 外框左上角 = ppt 的 (1.0757, 2.0479)）。
   矩形取自 `_kxslide.py 4`，三角形取自**旋转后**的视觉外框。 */
const KX_EL = {
  slab:  { x: 0.0000, y: 0.0000, w: 11.5299, h: 1.3576 },   // 矩形5 ∪ 3 ∪ 6：檐口板（整条）
  wing:  { x: 0.3882, y: 1.3667, w: 10.6632, h: 2.2687 },   // 矩形18/19 外包：白瓷砖墙
  glass: { x: 3.2993, y: 1.6347, w:  5.1618, h: 1.2326 },   // 矩形23：幕墙（含三组门）
  step:  { x: 3.1569, y: 2.8583, w:  5.4472, h: 0.7500 },   // 矩形17：中央台阶
  stairY: 2.8580,                                           // 两侧阶梯的顶行（三角的视觉顶点）
  triL:  { x: 0.7628, w: 1.3932 },                          // 直角三角形21（rot=270 的视觉外框）
  triR:  { x: 9.6049, w: 1.2368 },                          // 直角三角形22
  colL:  { x: 2.1562, w: 1.0007 },                          // 矩形7：左花盆柱
  colR:  { x: 8.6000, w: 1.0007 },                          // 矩形15：右花盆柱
  colH:  1.0986,                                            // 两柱同高（右侧手绘低 0.1 ⇒ 归一）
  pot:   { r: 0.4518, t: 0.0842 }                           // 空心弧10/16：外半径 / 环厚
};
/* 只为说明留的原始值（画的时候不用）：矩形7 的 y = 2.5097、矩形15 的 y = 2.6070，
   底边差 0.03 英寸、高差 0.1 英寸（手绘误差）⇒ 一律按**左柱的底边**（= 外框底）归一。
   ⚠️ 「盆底 = 柱顶」是 ppt 给的硬关系（空心弧的 bbox 底 = 4.5576 = 矩形7 的 y），
      所以"盆坐在柱子上"是读出来的，不是凑的。 */

/*__KX_GEN_BEGIN__*/
/* ==== 由 _build/_kxfont.py 生成，勿手改 ==== */
/* 科学会堂檐口带「科學會堂」四字点阵 —— 源是用户给的 预览/kexuehuitangfont.png
   （金笔 + **烘焙进去的浅灰棋盘底**；按**饱和度** max-min >= 45 切，不是灰阶，
   棋盘格与斜向纹理都是中性的，一并被切掉）。逐字高 28/28/28/28。
   ⚠️ 这里**故意不写坐标**：字宽随各字长宽比走，换一次源就要重算，
      写死一份必然和调用点对不上。排布在调用点现算（见 61 段的 kxPlaque()）。 */
const KX_MASK_KE = "AMGADgwA+HAP44D+PA/BwO4GAHgwA/GAHtwB7+Af/8P9P//N//7/AePwH3mA+4wPwGB+AwHwGAOAwAwOAGBwAAOAABwAAEAAAgA=";
const KX_MASK_XUE = "ADAABgADgAzwEzgG3AG3AG/gH/wH/gH/+H//DfPB8eLzgfPA8/A4/AQGAAHwAH4AP4AfgAzgAzgA/gAfAAOA";
const KX_MASK_HUI = "ABgAAHAAAOAAA8AABwAAHAAAMAAAzgADhgAGB4AYh4Bzx+DPh+MOA44/wDj/gGP+AYf4AB/gABeAAA9AAA/gAD7AAHvAAH+AAOYAAfwAAzgA";
const KX_MASK_TANG = "AGAAA8AADwAAPAAA4AADuAAP4AH/AAf4AA+PwB//gZ4fC+D4/gAHw8AePwDx3APD4A4PAAAMAAA4AAHwAA/AAB4AADgAAf+AP/4AYBA=";
/* [点阵, 宽, 高] —— 顺序：科 學 會 堂 */
const KX_CHARS = [
  [KX_MASK_KE, 21, 28],
  [KX_MASK_XUE, 18, 28],
  [KX_MASK_HUI, 23, 28],
  [KX_MASK_TANG, 22, 28]
];
/* ==== 生成块结束 ==== */
/*__KX_GEN_END__*/

/* --- 5.11.1 配色 ------------------------------------------------------------
   能由调用点给的 `pal`（= PALETTE[2] 会堂/食堂那一档）推的，一律现推；
   只有实拍里量出来、推不出来的那几笔写成字面色（照 58/59 段的规矩）。
   ⚠️ PALETTE 只能在函数体里读（TDZ：本段在 60 段之前拼接）⇒ 整张色板由 `pal` 现推。
   ⚠️ `shade()` 只吃**十六进制**串，所以每个档位都是**一次** shade —— 不许嵌套
      （`shade(shade(...))` 会拿到 "rgb(...)" 直接算错色，而且不报错）。 */
function kxCol(pal) {
  return {
    SLAB:    shade(pal.wall,  0.10),      // 檐口板（实拍比白瓷砖亮一档的浅石）
    SLAB_L:  shade(pal.wall,  0.30),
    SLAB_D:  shade(pal.wall, -0.18),
    TILE:    pal.wall,                    // 白瓷砖墙
    TILE_T:  shade(pal.wall, -0.16),      // 墙顶（板下）压暗
    TILE_L:  shade(pal.wall,  0.18),      // 左棱受光
    TILE_R:  shade(pal.wall, -0.28),      // 右棱背光
    COL_T:   shade(pal.wall,  0.14),      // 柱顶面
    COL_L:   shade(pal.wall,  0.16),
    COL_R:   shade(pal.wall, -0.26),
    COL_F:   shade(pal.wall, -0.24),      // 柱脚
    POT:     shade(pal.wall,  0.10),      // 盆体（实拍：比白瓷砖亮一档的浅石盆）
    POT_L:   shade(pal.wall,  0.26),      // 盆口平顶受光 / 盆沿受光侧
    POT_D:   shade(pal.wall,  0.02),      // 盆体下缘
    POT_R:   shade(pal.wall, -0.08),      // 盆沿背光侧（光源左上）
    POT_E:   shade(pal.wall, -0.26),      // 盆体外棱一圈 —— 把盆从**同色**墙面上分出来
    POT_IN:  shade(pal.wall, -0.34),      // 盆内（土 + 阴影）
    ST_A:    shade(pal.wall, -0.14),      // 台阶石（奇级）
    ST_B:    shade(pal.wall, -0.24),      // 台阶石（偶级）
    ST_T:    shade(pal.wall,  0.14),      // 踏步鼻受光
    ST_S:    shade(pal.wall, -0.46),      // 石帮 / 踢面棱
    GLASS:   shade(pal.glass, -0.66),     // 幕墙近黑玻璃
    GLASS_F: shade(pal.glass, -0.82),     // 幕墙外框 / 竖梃 / 横档
    DOOR:    shade(pal.door,  -0.55),     // 门扇（比玻璃还沉一点）
    /* 平屋顶（用户口径「改平屋顶」，实拍：浅灰石平台 + 一圈女儿墙，**没有坡**）——
       30 段的屋面矩形照搬（x0−3 起、宽 w+6），只把色系从 `pal.roof` 换到石色，
       并把「分坡脊线」换成两道正交的**分仓伸缩缝**：平屋面没有脊，但有分仓缝。 */
    ROOF:    shade(pal.wall, -0.12),      // 平台面（30 段板面那一块）
    ROOF_L:  shade(pal.wall,  0.14),      // 北缘亮线 / 左内侧受光
    ROOF_R:  shade(pal.wall, -0.26),      // 右内侧背光
    ROOF_D:  shade(pal.wall, -0.38),      // 女儿墙外沿（30 段檐口外沿那一圈）
    ROOF_J:  shade(pal.wall, -0.30),      // 分仓伸缩缝
    ROOF_P:  shade(pal.wall, -0.52),      // 檐口投影线（30 段那 2 行）
    EQ:      shade(pal.wall, -0.05),      // 屋面设备（30 段那几台的石色版）
    EQ_L:    shade(pal.wall,  0.16),
    EQ_D:    shade(pal.wall, -0.26),
    OUT:     shade(pal.wall,  -0.44)      // 外轮廓（照 30 段 §3.8）
  };
}
/* 实拍量出来、推不出来的那几笔 —— 字面色（照 55/58/59 段） */
const KX_PAL = {
  JOINT:  "rgba(96,102,112,0.16)",      // 瓷砖缝（照 58 段 DX_WTILEG）
  MIRROR: "rgba(96,124,92,0.20)",       // 玻璃里的树影（实拍：幕墙映着门前的树）
  SKY:    "rgba(226,236,244,0.07)",     // 玻璃里的天光
  LIT:    "rgba(232,217,166,0.15)",     // 门内一点暖光
  LAMP:   "rgba(14,18,28,0.38)",        // 板底筒灯暗点
  SEAM:   "rgba(14,18,28,0.34)",        // 级间投影
  HANDLE: "#e8d9a6",                    // 门把手
  LEAF_L: "#8ec3c2", LEAF: "#63a0a4", LEAF_D: "#3d6f76",   // 实拍里那两颗蓝绿半球
  GOLD_D: "#6d4f1a", GOLD: "#c49a3c", GOLD_L: "#f2e3a8"    // 金字三色（与 _kxfont.py 的 brush 同值）
};

/* --- 5.11.2 几何：宽锚现算，一处写死 -----------------------------------------
   `sc`（世界像素/英寸）只从**外框宽**来 —— 正面图是宽锚：精灵宽由 CAMPUS 的
   footprint 定（371），立面高按同一比例现算，**不按 styleOf 的 2 层**（那样只有
   68 行，立面会被压成一条）。反解 roofT 用的仍是 30 段的画布高公式，与 59 段同法。 */
function kxGeo(c) {
  const wallH0 = KX_FLOORS * FLOOR_H;
  const roofT  = c.height - KX_PADT - wallH0 - KX_PADB;   // 反解，不存第二份
  const eaveY  = KX_PADT + roofT;                         // 檐下沿 = 墙顶
  const w      = c.width - KX_PADX * 2;                   // 立面外框宽 = 371
  const sc     = w / KX_EW;                               // 每英寸多少世界像素
  const U      = (v) => Math.round(v * sc);
  const FH     = U(KX_EH);                                // 立面高 = 117
  const y0     = eaveY;                                   // 立面第 0 行（檐口板顶）
  const G = {
    roofT: roofT, wallH: wallH0, eaveY: eaveY, y0: y0,
    x0: KX_PADX, x1: KX_PADX + w, w: w, sc: sc, U: U,
    FH: FH, slabH: U(KX_SLAB_H), soff: Math.max(3, Math.round(FH * KX_SOFF_R)),
    baseY: y0 + FH, H: y0 + FH + KX_PADB,
    wallTop: y0 + U(KX_EL.wing.y),                        // 白瓷砖墙顶行（= 檐口板底）
    colTop: y0 + FH - U(KX_EL.colH),                      // 柱顶行（两柱同底线，归一）
    /* 英寸 → 画布；矩形一律**两端各取整再相减**（不许把宽单独取整 —— 相邻两块
       会因此差 1px 露缝，见 30 段的教训）。 */
    px: (ix) => KX_PADX + Math.round(ix * sc),
    py: (iy) => y0 + Math.round(iy * sc),
    rect: (o) => [KX_PADX + Math.round(o.x * sc), y0 + Math.round(o.y * sc),
                  Math.round((o.x + o.w) * sc) - Math.round(o.x * sc),
                  Math.round((o.y + o.h) * sc) - Math.round(o.y * sc)]
  };
  /* 几何闸：30 段的 PADT/画布高公式一动，反解出来的 roofT 立刻出界 ——
     出图时是一栋比例崩掉的楼，而三套自动验收都不看画面。 */
  if (roofT < 20 || roofT > 190)
    console.warn("61_kxht: 反解出的 roofT=%d 出了 30 段的 clamp 区间[20,190]，" +
                 "画布高 %d 与 PADT/wallH/SHY 公式对不上了", roofT, c.height);
  /* 字体闸：金字点阵的字高必须 ≈ 檐口板高的 KX_GLYPH_R —— 换源图、改檐口板高，
     这一条会先响，而不是等出图才发现字太大太小。 */
  const gh = KX_CHARS[0][2];
  let tw = KX_GAP * (KX_CHARS.length - 1);
  for (const e of KX_CHARS) tw += e[1];
  if (Math.abs(gh - G.slabH * KX_GLYPH_R) > 1 || tw > w * 0.5)
    console.warn("61_kxht: 金字点阵 %d 行 / 总宽 %d 与檐口板 %d 行对不上" +
                 "（应 ≈%d 行）—— 重跑 _build/_kxfont.py？",
                 gh, tw, G.slabH, Math.round(G.slabH * KX_GLYPH_R));
  return G;
}

/* --- 5.11.3 金字：逐点 1bit 掩膜 + 三色浮雕笔 ---------------------------------
   与 `_kxfont.py` 的 brush() **逐条同构**（probe 图就是按这支笔出的，观感判据才有效）：
   上缘（该点上方为空）用亮金、其余用主金、下缘再压一列暗金。 */
function kxGlyph(g, b64, nw, nh, x, y) {
  const s = atob(b64), bit = (i) => (s.charCodeAt(i >> 3) >> (7 - (i & 7))) & 1;
  for (let j = 0; j < nh; j++) {
    for (let i = 0; i < nw; i++) {
      if (!bit(j * nw + i)) continue;
      const top = j === 0 || !bit((j - 1) * nw + i);
      px(g, x + i, y + j, 1, 1, top ? KX_PAL.GOLD_L : KX_PAL.GOLD);
      if (j + 1 < nh && !bit((j + 1) * nw + i)) px(g, x + i, y + j + 1, 1, 1, KX_PAL.GOLD_D);
    }
  }
}
/* 檐口带上的「科學會堂」：总宽按 KX_CHARS 的逐字宽**现算**居中（照 36 段 libPlaque），
   **不写死坐标** —— 换源图/改字高只重跑 _kxfont.py，这里跟着走。 */
function kxPlaque(g, G) {
  let tw = KX_GAP * (KX_CHARS.length - 1);
  for (const e of KX_CHARS) tw += e[1];
  const nh = KX_CHARS[0][2];
  let x = G.x0 + Math.round((G.w - tw) / 2);
  const y = G.y0 + Math.round((G.slabH - nh) / 2);
  for (const e of KX_CHARS) {
    kxGlyph(g, e[0], e[1], e[2], x, y);
    x += e[1] + KX_GAP;
  }
}

/* --- 5.11.4 平屋顶：把 30 段那层屋面**整片盖成平的石平台** --------------------
   用户口径「改平屋顶」。30 段的屋面本来就是"板面 + 一圈外沿 + 檐口投影线"的画法，
   只是它画的是一栋**坡瓦顶**（`pal.roof` 的褐色 + 3 道分坡脊线 + 屋面设备）。
   这里把同一批矩形的**颜色**换成石色系、把那 3 道脊线换成**正交分仓缝**，
   设备照画（自带的灰色版）。⇒ 一栋平屋顶的楼，而不是"顶着坡顶的会堂"。
   ⚠️ 矩形与 30 段**逐字同值**（x0−3 / w+6 / PADT / roofT / PADT+2 高 roofT−5），
      所以女儿墙外沿那 3px 出挑、檐口投影线那 2 行都与其它楼同规，不另立一套。 */
function kxRoof(g, G, C) {
  const x = G.x0 - 3, wd = G.w + 6;
  px(g, x, KX_PADT, wd, G.roofT, C.ROOF_D);                   // 女儿墙外沿
  px(g, G.x0, KX_PADT + 2, G.w, G.roofT - 5, C.ROOF);         // 平台面
  px(g, G.x0, KX_PADT + 2, G.w, 1, C.ROOF_L);                  // 北缘一条亮线
  px(g, G.x0, KX_PADT + 2, 2, G.roofT - 5, C.ROOF_L);          // 左内侧受光
  px(g, G.x0 + G.w - 2, KX_PADT + 2, 2, G.roofT - 5, C.ROOF_R);// 右内侧背光
  px(g, G.x0 + 3, KX_PADT + 2 + Math.round((G.roofT - 5) * 0.46), G.w - 6, 1, C.ROOF_J);
  for (let u = 1; u <= 2; u++)                                 // 两道纵向分仓缝
    px(g, G.x0 + Math.round(G.w * u / 3), KX_PADT + 4, 1, G.roofT - 9, C.ROOF_J);
  const rq = makeRng(6151);                                    // 屋面设备：三台（局部 rng）
  for (let i = 0; i < 3; i++) {
    const bw = 26 + Math.round(rq() * 16), bh = 16 + Math.round(rq() * 10);
    const bx = G.x0 + 14 + Math.round(rq() * Math.max(1, G.w - 28 - bw));
    const by = KX_PADT + 12 + Math.round(rq() * Math.max(1, G.roofT - 26 - bh));
    px(g, bx, by, bw, bh, C.EQ);
    px(g, bx, by, bw, 2, C.EQ_L);
    px(g, bx + bw - 3, by, 3, bh, C.EQ_D);
    px(g, bx, by + bh - 2, bw, 2, C.EQ_D);
  }
  speckle(g, G.x0 + 4, KX_PADT + 7, G.w - 8, G.roofT - 12, "rgba(255,255,255,0.05)", (G.w / 3) | 0, makeRng(6152));
  speckle(g, G.x0 + 4, KX_PADT + 7, G.w - 8, G.roofT - 12, "rgba(0,0,0,0.07)", (G.w / 4) | 0, makeRng(6153));
  px(g, x, KX_PADT + G.roofT - 1, wd, 2, C.ROOF_P);            // 檐口投影线（同 30 段）
}

/* --- 5.11.5 檐口板：整条满宽，金字落在板上（板底那排筒灯**移到了檐下投影带**：
   实拍里筒灯是装在**出挑板的底面**上的，从上方看不见板底，能看见的是它投在墙顶的
   那条暗带 —— 画在板面上会读成一排灰脏点，正是第一轮出图里那一处。 */
function kxSlab(g, G, C) {
  const r = G.rect(KX_EL.slab);
  px(g, r[0], r[1], r[2], r[3], C.SLAB);
  px(g, r[0], r[1], r[2], 1, C.SLAB_L);                       // 板顶受光（光源左上）
  px(g, r[0], r[1], 2, r[3], C.SLAB_L);                       // 左端受光
  px(g, r[0] + r[2] - 2, r[1], 2, r[3], C.SLAB_D);            // 右端背光
  px(g, r[0], r[1] + r[3] - 2, r[2], 2, C.SLAB_D);            // 板下沿压暗
  for (let k = 1; k <= 2; k++)                                 // 石材横缝（两道，位置现算）
    px(g, r[0] + 2, r[1] + Math.round(r[3] * k / 3), r[2] - 4, 1, KX_PAL.JOINT);
  speckle(g, r[0] + 3, r[1] + 4, r[2] - 6, r[3] - 8, "rgba(255,255,255,0.05)", (r[2] / 3) | 0, makeRng(6111));
  speckle(g, r[0] + 3, r[1] + 4, r[2] - 6, r[3] - 8, "rgba(0,0,0,0.07)", (r[2] / 4) | 0, makeRng(6112));
  kxPlaque(g, G);
}

/* --- 5.11.6 檐下投影带：出挑的板在墙顶上压出来的一条深色带（渐隐）+ 筒灯暗点 ----
   ⚠️ 必须画在**墙之后** —— 正面图里两翼顶是抵着檐口板底的（1.3667 vs 1.3576，
      差 0.009 英寸 = 0.3px），中间没有缝；这条带只能在墙顶那几行上。 */
function kxSoffit(g, G, C) {
  const r = G.rect(KX_EL.slab);
  for (let i = 0; i < G.soff; i++)
    px(g, r[0], G.wallTop + i, r[2], 1,
       "rgba(14,18,28," + (0.46 * (1 - i / G.soff)).toFixed(3) + ")");
  const n = Math.max(3, Math.round(r[2] / 46));                // 板底筒灯（点数现算）
  for (let i = 0; i < n; i++)
    px(g, r[0] + Math.round(r[2] * (i + 0.5) / n) - 1, G.wallTop, 3, 2, KX_PAL.LAMP);
}

/* --- 5.11.7 白瓷砖墙：**一整片**（两翼之间不留缝） ---------------------------
   正面图里两翼是两块（12..75 / 292..355），中间那条 75..106 是作者漏画的墙 ——
   实拍里玻璃就是嵌在整片白瓷砖墙里的，所以这里整片铺，幕墙再压上去；
   幕墙左右**不等内缩**（左 31 / 右 20）照 ppt 原样保留（用户口径：忠于正面图，
   不做居中对称）。 */
function kxWall(g, G, C) {
  const r = G.rect(KX_EL.wing);
  px(g, r[0], r[1], r[2], G.baseY - r[1], C.TILE);
  for (let y = r[1] + KX_TILE; y < G.baseY; y += KX_TILE)      // 缝相位由 x0/y0 定死
    px(g, r[0], y, r[2], 1, KX_PAL.JOINT);
  for (let x = r[0] + KX_TILE; x < r[0] + r[2]; x += KX_TILE)
    px(g, x, r[1], 1, G.baseY - r[1], KX_PAL.JOINT);
  speckle(g, r[0], r[1], r[2], G.baseY - r[1], "rgba(255,255,255,0.05)", (r[2] / 3) | 0, makeRng(6121));
  speckle(g, r[0], r[1], r[2], G.baseY - r[1], "rgba(0,0,0,0.06)", (r[2] / 2) | 0, makeRng(6122));
  px(g, r[0], r[1], r[2], 1, C.TILE_T);
  px(g, r[0], r[1], 2, G.baseY - r[1], C.TILE_L);              // 左棱受光
  px(g, r[0] + r[2] - 3, r[1], 3, G.baseY - r[1], C.TILE_R);   // 右棱背光
}

/* --- 5.11.8 玻璃幕墙 + 三组双扇门 -------------------------------------------
   实拍：近黑玻璃，映着门前的树，下面三组双扇门（各有把手），门内一点暖光。 */
function kxGlass(g, G, C) {
  const r = G.rect(KX_EL.glass), gx0 = r[0], gy0 = r[1], gw = r[2], gh = r[3];
  const gy1 = gy0 + gh;
  px(g, gx0 - 2, gy0 - 2, gw + 4, gh + 4, C.GLASS_F);          // 外框（凹进去一块）
  px(g, gx0, gy0, gw, gh, C.GLASS);
  px(g, gx0, gy0, gw, 2, "rgba(8,10,16,0.55)");                // 顶内侧阴影
  px(g, gx0, gy0, 2, gh, "rgba(8,10,16,0.40)");                // 左内侧阴影（光源左上）
  /* 映进来的树影 / 天光：斜向的浅色块（贴在玻璃内，不越界） */
  px(g, gx0 + Math.round(gw * 0.08), gy0 + Math.round(gh * 0.30), Math.round(gw * 0.20), gh - Math.round(gh * 0.30), KX_PAL.MIRROR);
  px(g, gx0 + Math.round(gw * 0.40), gy0 + Math.round(gh * 0.18), Math.round(gw * 0.16), gh - Math.round(gh * 0.18), KX_PAL.MIRROR);
  px(g, gx0 + Math.round(gw * 0.74), gy0 + Math.round(gh * 0.36), Math.round(gw * 0.18), gh - Math.round(gh * 0.36), KX_PAL.MIRROR);
  px(g, gx0 + 2, gy0 + 2, gw - 4, Math.round(gh * 0.16), KX_PAL.SKY);
  for (let i = 1; i <= 4; i++)                                 // 竖梃（位置现算）
    px(g, gx0 + Math.round(gw * i / 5), gy0, 1, gh, C.GLASS_F);
  px(g, gx0, gy0 + Math.round(gh * 0.30), gw, 1, C.GLASS_F);   // 一道横档
  /* 三组双扇门：门组中线按玻璃宽现算，不写死 */
  const dh = Math.round(gh * 0.54), dy = gy1 - dh;
  const dwg = Math.round(gw * 0.155);
  for (let k = 0; k < 3; k++) {
    const cx = gx0 + Math.round(gw * (0.22 + 0.28 * k));
    const x0 = cx - Math.round(dwg / 2);
    px(g, x0, dy, dwg, dh, C.DOOR);
    px(g, x0, dy, dwg, 1, "rgba(8,10,16,0.55)");
    px(g, cx - 1, dy, 2, dh, C.GLASS_F);                                 // 中缝
    px(g, x0 + 2, dy + 2, Math.round(dwg / 2) - 3, dh - 4, KX_PAL.LIT);  // 左扇暖光
    px(g, cx + 1, dy + 2, Math.round(dwg / 2) - 3, dh - 4, KX_PAL.LIT);  // 右扇暖光
    px(g, cx - 3, dy + Math.round(dh * 0.42), 2, 4, KX_PAL.HANDLE);      // 把手
    px(g, cx + 2, dy + Math.round(dh * 0.42), 2, 4, KX_PAL.HANDLE);
    px(g, x0 + 2, dy + 2, dwg - 4, 1, "rgba(226,236,244,0.10)");         // 门楣一道反光
  }
}

/* --- 5.11.9 台阶：中央 6 级 + 两侧三角阶梯（**逐级台阶剖面**，不是光滑斜边） ----
   笔法照 55 段 gymStair / 36 段 libStair：每级 **踏步鼻受光 1 行 / 级面 1 行 /
   级间投影 1 行**，逐级微色差，免得整跑读成一块板。
   用户口径：「ppt 左右的三角形和门下边的矩形都是阶梯」—— 中央矩形 6 级、
   两侧三角各 6 级，级数以 KX_STEPS 为准（同一支）。 */
function kxStairs(g, G, C) {
  const r = G.rect(KX_EL.step);
  const yTop = G.py(KX_EL.stairY), yBot = G.baseY;
  for (let i = 0; i < KX_STEPS; i++) {
    const ya = yTop + Math.round((yBot - yTop) * i / KX_STEPS);
    const yb = yTop + Math.round((yBot - yTop) * (i + 1) / KX_STEPS);
    px(g, r[0], ya, r[2], yb - ya, i % 2 ? C.ST_A : C.ST_B);
    px(g, r[0], ya, r[2], 1, C.ST_T);
    px(g, r[0], yb - 1, r[2], 1, KX_PAL.SEAM);
  }
  px(g, r[0] - 1, yTop, 1, yBot - yTop, C.ST_S);               // 两侧石帮
  px(g, r[0] + r[2], yTop, 1, yBot - yTop, C.ST_S);
  /* 两侧三角阶梯：外缘沿斜边逐级收、内缘贴柱 —— 每级是一块**水平错台** */
  for (const left of [true, false]) {
    const E = left ? KX_EL.triL : KX_EL.triR;
    const xIn  = left ? G.px(E.x + E.w) : G.px(E.x);          // 贴柱那一端（高）
    const xOut = left ? G.px(E.x)       : G.px(E.x + E.w);    // 落地那一端（低）
    for (let i = 0; i < KX_STEPS; i++) {
      const ya = yTop + Math.round((yBot - yTop) * i / KX_STEPS);
      const yb = yTop + Math.round((yBot - yTop) * (i + 1) / KX_STEPS);
      const xe = Math.round(xIn + (xOut - xIn) * (i + 1) / KX_STEPS);
      const a = Math.min(xIn, xe), b = Math.max(xIn, xe);
      px(g, a, ya, b - a, yb - ya, i % 2 ? C.ST_A : C.ST_B);
      px(g, a, ya, b - a, 1, C.ST_T);                          // 踏步鼻
      px(g, a, yb - 1, b - a, 1, KX_PAL.SEAM);                 // 级间投影
      px(g, left ? a : b - 1, ya, 1, yb - ya, C.ST_S);         // 外端那道踢面棱
    }
  }
}

/* --- 5.11.10 花盆柱 + 半圆盆 + 盆里那颗蓝绿半球 -------------------------------
   ⚠️ 盆底 = 柱顶、盆口 = 圆心行（见 KX_EL 下面那段注释）。 */
function kxPot(g, G, C) {
  const R  = G.U(KX_EL.pot.r);                                 // 外半径
  const RI = Math.max(2, G.U(KX_EL.pot.r - KX_EL.pot.t));      // 内半径（盆壁那一圈）
  for (const E of [KX_EL.colL, KX_EL.colR]) {
    const cx0 = G.px(E.x), cx1 = G.px(E.x + E.w), cw = cx1 - cx0;
    const cx = cx0 + Math.round(cw / 2);
    /* 柱身：白瓷砖同规 + 左棱受光 / 右棱背光 + 柱脚压暗 */
    px(g, cx0, G.colTop, cw, G.baseY - G.colTop, C.TILE);
    for (let x = cx0 + KX_TILE; x < cx1; x += KX_TILE)
      px(g, x, G.colTop, 1, G.baseY - G.colTop, KX_PAL.JOINT);
    px(g, cx0, G.colTop, cw, 2, C.COL_T);                      // 柱顶面
    px(g, cx0, G.colTop, 2, G.baseY - G.colTop, C.COL_L);
    px(g, cx1 - 3, G.colTop, 3, G.baseY - G.colTop, C.COL_R);
    px(g, cx0, G.baseY - 3, cw, 3, C.COL_F);                   // 柱脚
    /* 盆：下半圆实心（盆口行 = 圆心行）。实拍是一只**浅白石盆**，从上方看几乎见不到
       土 —— 第一轮把整个内径都涂成暗色，出图里读成"一只空的黑盆"，所以盆内只留
       紧贴盆口的两行暗缝，其余全是盆体。 */
    const rimY = G.colTop - R;
    for (let dy = 0; dy <= R; dy++) {
      const w = Math.round(Math.sqrt(R * R - dy * dy));
      px(g, cx - w, rimY + dy, w * 2 + 1, 1, dy < 2 ? C.POT : C.POT_D);
    }
    const RS = RI + 1;                                         // 土面比盆口内径略宽（压在盆沿下）
    for (let dy = 1; dy <= 2; dy++) {
      const w = Math.round(Math.sqrt(RS * RS - dy * dy));
      px(g, cx - w, rimY + dy, w * 2 + 1, 1, C.POT_IN);
    }
    /* 植株：上半圆（半径 RI+1 ⇒ 盆沿上探出一点）。光照从上 ⇒ **上面亮、根部暗**：
       第一轮把两档弄反了（顶上一圈暗绿、根部一圈亮青），出图里那颗半球是"倒扣"的。
       半径的竖直半轴取 RI+0.7（略大于横向）⇒ 顶部不会收成一根 1px 的尖刺。 */
    const RH = RI + 1, RV = RI + 0.7;
    for (let dy = 0; dy <= RI; dy++) {
      const w = Math.round(RH * Math.sqrt(Math.max(0, 1 - (dy / RV) * (dy / RV))));
      px(g, cx - w, rimY - dy, w * 2 + 1, 1,
         dy > RI * 0.72 ? KX_PAL.LEAF_L : (dy < 3 ? KX_PAL.LEAF_D : KX_PAL.LEAF));
    }
    px(g, cx - RH + 2, rimY - RI + 1, 4, 3, KX_PAL.LEAF_L);    // 左上一点高光
    for (let dy = Math.round(RI * 0.28); dy <= Math.round(RI * 0.86); dy++) {
      const w = Math.round(RH * Math.sqrt(Math.max(0, 1 - (dy / RV) * (dy / RV))));
      px(g, cx - w, rimY - dy, 2, 1, KX_PAL.LEAF_L);           // 受光侧沿轮廓提一档
    }
    speckle(g, cx - RH, rimY - RI, RH * 2, RI, "rgba(255,255,255,0.07)", 5, makeRng(6131));
    /* 盆沿（下半圆环，照 ppt 的空心弧：R 与 R−t 之间那一圈）—— **最后画**，
       压在植株根部上 ⇒ 读起来才是"花长在盆里"，而不是"盆上飘着个球"。
       环的左半受光、右半背光（光源左上），最外一圈再压一档暗棱 ——
       盆与脚下的白瓷砖墙**同色系**，没有这圈棱就分不出来（第一轮出图那只盆
       之所以"看不见"，就是盆体只比墙亮 0.1 档、又没有外棱）。 */
    for (let dy = 0; dy <= R; dy++) {
      const wo = Math.round(Math.sqrt(R * R - dy * dy));
      const wi = dy <= RI ? Math.round(Math.sqrt(RI * RI - dy * dy)) : -1;
      if (wi < 0) { px(g, cx - wo, rimY + dy, wo * 2 + 1, 1, C.POT); continue; }
      px(g, cx - wo, rimY + dy, wo - wi, 1, C.POT_L);
      px(g, cx + wi, rimY + dy, wo - wi, 1, C.POT_R);
    }
    for (let dy = 0; dy <= R; dy++) {                          // 外棱一圈
      const wo = Math.round(Math.sqrt(R * R - dy * dy));
      px(g, cx - wo, rimY + dy, 1, 1, C.POT_E);
      px(g, cx + wo, rimY + dy, 1, 1, C.POT_E);
    }
    px(g, cx - R, rimY, R * 2 + 1, 1, C.POT_L);                // 盆口平顶受光
  }
}

/* --- 5.11.11 立面总装（只在**新画布**上画，不 clearRect） --------------------
   次序即遮挡：平屋顶（含檐口投影线）→ 檐口板 → 白瓷砖墙 → 檐下投影带 → 幕墙 →
   台阶 → 柱盆 → 轮廓与接地带。 */
function kxFront(g, G, C) {
  kxRoof(g, G, C);
  kxSlab(g, G, C);
  kxWall(g, G, C);
  kxSoffit(g, G, C);
  kxGlass(g, G, C);
  kxStairs(g, G, C);
  kxPot(g, G, C);
  /* 外轮廓分两段：檐口板那一层**满宽**（它两侧各出挑 12px），墙那一层只有墙宽 ——
     合成一条会在出挑的空档里拉出一条悬空的暗线。 */
  px(g, G.x0 - 1, G.y0, 1, G.slabH, C.OUT);
  px(g, G.x1, G.y0, 1, G.slabH, C.OUT);
  const rw = G.rect(KX_EL.wing);
  px(g, rw[0] - 1, G.wallTop, 1, G.baseY - G.wallTop, C.OUT);
  px(g, rw[0] + rw[2], G.wallTop, 1, G.baseY - G.wallTop, C.OUT);
  contactBand(g, rw[0] + 1, rw[0] + rw[2] - 1, G.baseY - 1, 2, 0.34);
}

/* --- 5.11.12 覆盖重绘入口 ----------------------------------------------------
   ⚠️ 必须在这里、addProp **之前**调（60_assemble.js）—— 重绘的是同一张 canvas
      的内容，晚一步 addProp 已经把旧精灵挂进 props 了（gymRestyle/dxRestyle/
      xgRestyle 同一规矩）。
   ⚠️ 本函数**不碰共享 RNG**（斑点/盆里颗粒一律局部 makeRng）—— 碰了就会重掷
      全校园散射（那是有专属探针才看得见的地雷，见 60_assemble.js §6.6）。
   ⚠️ 第三个实参照 58/59 段传 `pal` —— `makeBuilding` 的返回值里没有色号，
      而补屋面板面必须与它同色，所以只能由调用点给（本段不许再存一份 PALETTE）。
   ⚠️ **立面高 117 行 ≠ styleOf 的 2 层（68 行）** ⇒ 画布要换一张高的（30 段的 H
      公式里 wallH 那一项被 FH 顶掉）。为此**只拷旧画布顶部 y0+1 行**（y0 = 檐口行，
      +1 是为了把檐口投影线那 2 行的下半行也带上）：檐口以下整段根本不进新画布
      ⇒ 既不用 clearRect，也不怕旧立面 / 旧投影 / 旧接地带残留。
      换画布**不改** `b.w` —— addSolid 用的是世界坐标，与精灵高矮无关。 */
function kxRestyle(b, pal) {
  const c = b.canvas, g = c.getContext("2d");
  const G = kxGeo(c), C = kxCol(pal);
  /* ① 撤屋名牌。30 段把牌子挂在**檐口之上**（signRect: y = eaveY − 8 − h），
        所以必须单独擦（这是全零件唯一的一次 clearRect）。调 makeSign 只为填
        _signCache（verify.py 要 / 见契约），拿到矩形就够 —— **不画**。
        补的板面色只求"擦过的地方不是透明洞"，它随后会被 5.11.4 的平屋面整片盖掉
        ⇒ 这里**不补分坡脊线**（平屋面没有脊；第一版照 30 段补了 3 道，出图里
        那 3 道脊线还留在褐色坡顶上）。 */
  const sgn = makeSign(KX_NAME);
  if (sgn) {
    const sg = signRect(sgn, G.x0, G.w, G.eaveY);
    const px0 = sg.x - 2, py0 = sg.y - 2, pw = sg.w + 7, ph = sg.h + 7;
    g.clearRect(px0, py0, pw, ph);
    px(g, px0, py0, pw, ph, C.ROOF);                       // 平台面（与 5.11.4 同色）
    speckle(g, px0, py0, pw, ph, "rgba(255,255,255,0.05)", 6, makeRng(6103));
    speckle(g, px0, py0, pw, ph, "rgba(0,0,0,0.07)", 5, makeRng(6104));
  }
  /* ② 新画布：旧画布的檐口以上搬过来（同一行；屋面随后由 5.11.4 整片改平） */
  const nc = mkCanvas(c.width, G.H), ng = nc.getContext("2d");
  ng.drawImage(c, 0, 0, c.width, G.y0 + 1, 0, 0, c.width, G.y0 + 1);
  /* ③ 方向性投影（照 30 段 §3.1：footprint 朝右下拉伸，画在楼体**之前**，
        所以只有落地线以下那一截留在画面里）+ 立面总装 */
  const SHX = Math.round(-SUN.x * 26), SHY = Math.round(-SUN.y * 26);
  shadowQuad(ng, G.x0 + 2, G.baseY - KX_SHADOW_H, G.x1 - 2, G.baseY, SHX, SHY, 0.28, 4);
  kxFront(ng, G, C);
  b.canvas = nc;
  /* ④ **只挪锚点**：`b.y`（世界落地线）与 addSolid 用的世界坐标一个字节都不动。
        `ay` 里多出来的 KX_DY 就是"整栋北移"在精灵上的全部痕迹。 */
  b.ay = G.baseY + KX_DY;
  return b;
}
