/* =========================================================
   §5.16 第九教学楼：正面按用户给的 ppt 正面图**逐形状**覆盖重绘
   ---------------------------------------------------------
   用户口径（2026-09-27 第二十七轮，逐字）：

     「接下来我们画第九教学楼，我首先把第九d教学楼的轮廓画出来到ppt中了，
       你只需要一比一复刻。其中中间的黑色区域代表黑色玻璃，你需要画上玻璃
       并进行网格划分，梯形是阶梯，蓝色是普通的玻璃，整个楼，除了中间的大门
       区域，外边都贴上了白色小方格瓷砖。请注意有些图形的覆盖关系和各个图形
       的轮廓。此外插入的字体我给你图片了，位置也在ppt中。注意九教高度是七层楼。」

   用户口径（2026-09-28 第二十八轮，逐字）：

     「不错，不过实际上九教是一个口字形大院，中间是有天井的，目前楼顶是完整
       覆盖，我们需要把楼顶改成口字形，显示九教是一个大院，注意露出一部分教学楼
       （在口字形中间）」
     「对了中间的口字缺口不能很小，实际上九教中间的院落是相当大的」

   ⇒ 屋面从"一整块板"改成**口字环**（§5.16.7a），环心是**天井**；
     天井里露出里院北楼的**内立面** + 院子地面（§5.16.7b）—— 用户那句
     「露出一部分教学楼」就是那面内墙。院子的尺寸见 §5.16.7b 的头注。

   拆成八件事，全部落在这一页（`校园示意图.pptx` **第 9 页**，53 个形状 + 1 个标注框）：

   | # | 用户的话 | 做法 | 落点 |
   |---|---|---|---|
   | (a) | 一比一复刻轮廓 | 逐形状直搬 `J9_EL` / `J9_PATH`（同 65 段机械楼） | 5.16.5 |
   | (b) | 黑色区域＝黑色玻璃，要画玻璃 + 网格划分 | `k` 类 → `j9BlackGlass`（幕墙分格） | 5.16.4 |
   | (c) | 梯形是阶梯 | `t` 类 → `j9Stairs`（按 prst=trapezoid 的收分画出踏步） | 5.16.3 |
   | (d) | 蓝色是普通的玻璃 | `g` 类 → `j9GlassBlue`（凹口开洞边 + 宽窗加一条竖挺） | 5.16.3 |
   | (e) | 除中间大门区域外全贴白色小方格瓷砖 | `w` 类 → `j9Tiles`（全局砖缝网格，9 块共用一套） | 5.16.4 |
   | (f) | 注意覆盖关系与轮廓 | **按 `J9_EL` 的 idx 顺序落笔**（= ppt 的 z 序） | 5.16.6 |
   | (g) | 插入字体（位置在 ppt 中）、七层楼 | 楼名走 `_j9font.py` 点阵，压在金门廊横梁上 | 5.16.7 |
   | (h) | 楼顶改口字形、中间是天井、院子里露出一部分教学楼（第二十八轮） | 屋面整块重画成**环**，洞里画内院：内墙 + 院子地面 | 5.16.7a / 5.16.7b |

   ## 唯一的几何权威 = ppт 第 9 页
   `_build/_j9slide.py` 把这一页打成**英寸表**（本文件的 `J9_EW/EH/PAL/TXT/PATH/EL`），
   **任何尺寸不许在别处再写一份**（坑 18：派生量不许存第二份）。

   ## 与 65 段（机械楼）同一条路，但有**四件本页独有**的事

   ① **页里有 3 个 `custGeom` 任意多边形** —— 65 段那一页 54 个形状全是轴对齐矩形。
      本页多出一张 `J9_PATH`：金门廊（id4）+ 两翼（id26 / id29）。
      `J9_EL` 的最后一列 `pi >= 0` 就是它的行号。多边形一律走**行扫描**（`j9Spans`）
      而不是 `clip()`：本项目是像素画，`clip()` 的路径边是抗锯齿的，
      而扫描出来的每一行都是整数区间 ⇒ 轮廓是硬的（`poly()` 的软边只在 30 段
      那类"画完就描边"的地方用）。

   ② **页里有 1 个 `TEXT_BOX`，内容是「字体插入位置」** —— 那是用户给的**落位标注**，
      不是立面构件。`_j9slide.py` 把它排除在 `J9_EL` 之外、单独输出成 `J9_TXT`。
      ⚠️ 断言它的文字仍是那四个字：哪天用户把真图贴进来（改成 PICTURE），
         那一条会先响。**楼名的字号是从它的宽度反推的**（见 5.16.7 与 `_j9font.py`）。

   ③ **本页没有任何"例子"要外推** —— 与机械楼那轮不同（那轮用户说玻璃只是例子、
      柱子要严格等距），本轮用户只说「一比一复刻」+「注意覆盖关系」。
      ⇒ **一个坐标都不另算**：53 个形状逐条照 `J9_EL` 落地，
         翼楼窗行的 0.384 / 0.4278 **交替行距**、左右两翼那 0.0389 in 的错位、
         金门廊右沿与左沿那 0.0035 in 的差 —— 全部原样保留（那是用户画的）。

   ④ **"七层楼"与 ppt 的线数** —— 用户点名「九教高度是七层楼」。
      ppt 的立面画的是 **6 排窗 + 底部一条基座带**（翼楼 `g` 的 y 分 6 排：
      0.2007/0.5847/1.0125/1.3965/1.8243/2.2083，再加基座那一排 3.1764）
      = **7 层**；而本楼在 `styleOf` 里是 `/教学楼/ → {p:0, floors:4}`
      ⇒ 那 4 层只用来**反解 30 段的画布几何**（`roofT`），画面上显示的七层
      完全由 ppt 这张立面决定。`J9_FLOORS = 4` **必须**等于 `styleOf` 的值，
      build.py 有闸钉住（改风格档 ⇒ 反解出的 roofT 出界 ⇒ 那扇闸先响）。

   ## 尺度：宽锚现算，与 61 / 65 段同法
   `sc`（世界像素/英寸）只从**外框宽**来：精灵宽由 `CAMPUS` 的 footprint 定
   （`["第九教学楼","bld",5.7583,5.0021,1.1514,0.7792]` ⇒ 1.1514 × U = 449.7 ⇒ 450），
   立面高按同一比例现算：
        第九教学楼 footprint 宽 450 ⇒ sc = 450 / 10.7972 = 41.6774 px/in
        立面高 = 3.6771 × 41.6774 = **153 行**
   ⚠️ 153 行 ≠ `styleOf` 的 4 层（136 行）⇒ 要换一张高的画布，做法与 61/65 段逐条同构：
      **只拷旧画布顶部 y0+1 行**（y0 = 檐口行 = 201）。檐口以下整段不进新画布
      ⇒ 既不用逐块 clearRect，也不怕旧立面/旧门/旧投影残留。
      多出来的 17 行**全部朝北长**：`b.ay = G.baseY`（落地线锚在原来的世界位置），
      `b.y` / `addSolid` 的世界坐标一个字节不动 ⇒ 全校园散射随机流一个数不动。

   ## 口字形（第二十八轮）：屋面 → 环 + 天井 + 里院
   屋面**整块重画**成口字环（§5.16.7a），环心挖出天井，洞里画里院（§5.16.7b）：
       环宽 55（平面像素）⇒ 院子 340 × 194 = footprint 的 76% × 64%、面积 48%
   重画的理由、洞里那面墙的比例、以及**一处必须报备的投影偏离**都写在 5.16.7b 头注。

   ## 已知代价 / 必须报备的偏离（交付说明里要写）
   · **天井里的院子，按真实投影是看不到地面的** —— 详见 5.16.7b 头注（那是一条
     刻意的、为了"读得出来"的偏离；改比例只动 `J9_CWALL`）。
   · **屋面设备箱从 2~4 个变成 ≤3 个（`J9_BOX_N`）** —— 洞口吃掉 48% 的屋面，
     压在洞沿上的箱子整块不要（切一半的箱子既不像箱子也补不回来）。30 段那些楼的
     箱子仍按它们的种子撒，本楼**只影响自己这一张精灵**。
   · **楼名牌（30 段挂在屋面的那块）撤掉** —— 名字已经在金门廊上了
     （与 59/61/63/65 段同一处理）。调 `makeSign` 只为填 `_signCache`。
     ⚠️ 第 27 轮为了补牌子那块疤而"补板面"的补丁，这轮随屋面重画**整段删掉**。
   · **"七层楼"是 ppt 的读数，不是数据** —— 若用户要的是"36 层高的墙"，
     得改 `J9_FLOORS`（那会连带改 roofT 与画布高），成本一次构建。
   · **瓷砖边长 6 px 是**风格化**的** —— 按本楼的比例（1 in ≈ 41.68 px）折算，
     真实瓷砖只有亚像素，画不出来。取 6 px 与 §5.15 图书馆南侧那一列**同值**
     （那一列的 6 px 用户已经看过并接受），两处读起来是同一族白瓷砖。
   · **幕墙分格 17 px 是从"翼楼窗行距的均值"现算的**（0.4015 in × sc = 16.73 ⇒ 17），
     不与翼楼那 0.384/0.4278 的**交替**行距逐行对齐 —— 对齐的话玻璃上会出现
     一宽一窄的格子，正是 65 段第三轮用户点名的「不能看起来很不均匀」。
   ========================================================= */

/* --- 5.16.1 常量 ----------------------------------------------------------- */
const J9_NAME   = "第九教学楼";              // ⚠️ 必须与 CAMPUS 里的名字逐字相同
const J9_PADX   = 26, J9_PADT = 18;          // 与 30 段同值
const J9_PADB   = 21 + 14;                   // SHY + 14 —— 30 段画布高公式的尾巴
const J9_FLOORS = 4;                         // ⚠️ 必须等于 styleOf("第九教学楼").floors
const J9_SHADOW_H = 24;                      // 照 30 段 §3.1 的 min(24, depth·0.3)（进深 304 ⇒ 24）
const J9_TILE_P = 6;                         // 白瓷砖边长（px）—— 与 66 段同值，见文件头"已知代价"
const J9_STAIR_N = 3;                        // 台阶的踏步数（梯形只有 7 行高，3 级刚好读得出来）
const J9_BAR_TOL = 6;                        // 楼名块中心与 J9_TXT 中心的容许偏差（px）
const J9_WIN_H  = 0.2451;                    // 立面上"一排窗"那一族的高度（in）——
                                             // 翼楼那 6 排；端柱/竖条上那 12 块窄窗是
                                             // 0.5278，**不算这一族**（5.16.4 与 5.16.7b 共用）
/* --- 口字形（第二十八轮，§5.16.7a/7b） --- */
const J9_RING  = 55;                         // 口字**环宽**（平面世界像素）= 一圈楼的进深
const J9_KZ    = 0.60;                       // 屋面"进深 → 画布行"的比例（= 30 段 `depth * 0.60`）
const J9_CWALL = 0.667;                      // 天井里露出的那面内墙占洞高的比例（见 5.16.7b 头注）
const J9_BOX_N = 3;                          // 环上放的屋面设备箱**上限**（放不下就少放）

/* 正面图外框（英寸）与逐形状表 —— 全部由 `_build/_j9slide.py` 生成 */
const J9_EW = 10.7972, J9_EH = 3.6771;       // 外框并集（**实测**）
/* 类 → **渲染实测色**（`_j9slide.py` 的 J9_PAL；build.py 有断言逐条相等） */
const J9_PAL = { d: "#595959", g: "#4874cb", k: "#404040", m: "#b58b02", t: "#d9d9d9", w: "#d9d9d9" };
/* 用户那个标注框「字体插入位置」—— 楼名的落位依据之一（见 5.16.7） */
const J9_TXT = { x: 4.5882, y: 1.3965, w: 1.8069, h: 0.4028 };
/* 多边形：逐条点表（英寸，相对外框左上角）；`J9_EL` 的 `pi` 列就是这里的下标 */
const J9_PATH = [
  /* m 金门廊（П 形：横梁 + 两条腿） */ [[4.4368, 1.1097], [6.3951, 1.1097], [6.3951, 1.8833], [6.3951, 1.9311], [6.3951, 3.6292], [6.0236, 3.6292], [6.0236, 1.9311], [4.8083, 1.9311], [4.8083, 3.6299], [4.4375, 3.6299], [4.4375, 1.9311], [4.4368, 1.9311]],
  /* w 左翼（主体 + 基部凹口） */     [[0.5174, 0.0236], [3.6507, 0.0236], [3.6507, 2.9354], [3.6542, 2.9354], [3.6542, 3.6535], [3.3715, 3.6535], [3.3715, 2.9451], [0.8000, 2.9451], [0.8000, 3.6632], [0.5174, 3.6632], [0.5174, 2.9451]],
  /* w 右翼（同构，右移到 7.1431） */ [[7.1431, 0.0236], [10.2764, 0.0236], [10.2764, 2.9354], [10.2799, 2.9354], [10.2799, 3.6535], [9.9972, 3.6535], [9.9972, 2.9451], [7.4257, 2.9451], [7.4257, 3.6632], [7.1431, 3.6632], [7.1431, 2.9451]]
];
/* 53 个立面构件（英寸；原点 = 外框左上角 = ppt 第 9 页的 (1.1306, 1.2597)）。
   `_j9slide.py` 生成，**逐块对得上 ppt**：k 是形状类，末尾两列是 ppt 的 idx
   与稳定 id（改图时按 id 找，idx 会随插删漂移），`pi >= 0` 的是多边形。
   ⚠️ idx2 不在表里 —— 那正是那个 TEXT_BOX（被排除，单独成 J9_TXT）。 */
const J9_EL = [
  /* k    x       y       w       h      pi     实测色      来源 */
  ['k',  4.0889,  0.5437,  2.6194,  3.0861, -1],  /* #404040  idx0  id9  */
  ['m',  4.4368,  1.1097,  1.9583,  2.5201,  0],  /* #b58b02  idx1  id4  */
  ['d',  4.8125,  1.9201,  1.2076,  0.8993, -1],  /* #595959  idx3  id8  */
  ['w',  0.5174,  0.0236,  3.1368,  3.6396,  1],  /* #d9d9d9  idx4  id26 */
  ['w',  7.1431,  0.0236,  3.1368,  3.6396,  2],  /* #d9d9d9  idx5  id29 */
  ['w',  3.6368,  0.5354,  0.4444,  3.1042, -1],  /* #d9d9d9  idx6  id30 */
  ['w',  6.6986,  0.5590,  0.4444,  3.1042, -1],  /* #d9d9d9  idx7  id31 */
  ['w', 10.2799,  0.0236,  0.5174,  3.6396, -1],  /* #d9d9d9  idx8  id32 */
  ['w',  0.0000,  0.0236,  0.5174,  3.6396, -1],  /* #d9d9d9  idx9  id33 */
  ['t',  4.7181,  3.4528,  1.4167,  0.1771, -1],  /* #d9d9d9  idx10 id34 */
  ['w',  3.6285,  0.0000,  3.5042,  0.5465, -1],  /* #d9d9d9  idx11 id35 */
  ['g',  0.7611,  0.2007,  0.7285,  0.2451, -1],  /* #4874cb  idx12 id36 */
  ['g',  2.5528,  0.2007,  0.7285,  0.2451, -1],  /* #4874cb  idx13 id37 */
  ['g',  0.7611,  0.5847,  0.7285,  0.2451, -1],  /* #4874cb  idx14 id38 */
  ['g',  2.5528,  0.5847,  0.7285,  0.2451, -1],  /* #4874cb  idx15 id39 */
  ['g',  0.7611,  1.0125,  0.7285,  0.2451, -1],  /* #4874cb  idx16 id40 */
  ['g',  2.5528,  1.0125,  0.7285,  0.2451, -1],  /* #4874cb  idx17 id41 */
  ['g',  0.7611,  1.3965,  0.7285,  0.2451, -1],  /* #4874cb  idx18 id42 */
  ['g',  2.5528,  1.3965,  0.7285,  0.2451, -1],  /* #4874cb  idx19 id43 */
  ['g',  0.7611,  1.8243,  0.7285,  0.2451, -1],  /* #4874cb  idx20 id44 */
  ['g',  2.5528,  1.8243,  0.7285,  0.2451, -1],  /* #4874cb  idx21 id45 */
  ['g',  0.7611,  2.2083,  0.7285,  0.2451, -1],  /* #4874cb  idx22 id46 */
  ['g',  2.5528,  2.2083,  0.7285,  0.2451, -1],  /* #4874cb  idx23 id47 */
  ['g',  7.4125,  0.2396,  0.7285,  0.2451, -1],  /* #4874cb  idx24 id63 */
  ['g',  9.2042,  0.2396,  0.7285,  0.2451, -1],  /* #4874cb  idx25 id64 */
  ['g',  7.4125,  0.6236,  0.7285,  0.2451, -1],  /* #4874cb  idx26 id65 */
  ['g',  9.2042,  0.6236,  0.7285,  0.2451, -1],  /* #4874cb  idx27 id66 */
  ['g',  7.4125,  1.0514,  0.7285,  0.2451, -1],  /* #4874cb  idx28 id67 */
  ['g',  9.2042,  1.0514,  0.7285,  0.2451, -1],  /* #4874cb  idx29 id68 */
  ['g',  7.4125,  1.4354,  0.7285,  0.2451, -1],  /* #4874cb  idx30 id69 */
  ['g',  9.2042,  1.4354,  0.7285,  0.2451, -1],  /* #4874cb  idx31 id70 */
  ['g',  7.4125,  1.8632,  0.7285,  0.2451, -1],  /* #4874cb  idx32 id71 */
  ['g',  9.2042,  1.8632,  0.7285,  0.2451, -1],  /* #4874cb  idx33 id72 */
  ['g',  7.4125,  2.2472,  0.7285,  0.2451, -1],  /* #4874cb  idx34 id73 */
  ['g',  9.2042,  2.2472,  0.7285,  0.2451, -1],  /* #4874cb  idx35 id74 */
  ['w',  0.7799,  2.9215,  2.6035,  0.7556, -1],  /* #d9d9d9  idx36 id77 */
  ['g',  1.0972,  3.1764,  0.7285,  0.2451, -1],  /* #4874cb  idx37 id75 */
  ['g',  2.4014,  3.1764,  0.7285,  0.2451, -1],  /* #4874cb  idx38 id76 */
  ['w',  7.4125,  2.9215,  2.6035,  0.7556, -1],  /* #d9d9d9  idx39 id78 */
  ['g',  7.7299,  3.1764,  0.7285,  0.2451, -1],  /* #4874cb  idx40 id79 */
  ['g',  9.0340,  3.1764,  0.7285,  0.2451, -1],  /* #4874cb  idx41 id80 */
  ['g',  0.0062,  2.6576,  0.2458,  0.5278, -1],  /* #4874cb  idx42 id81 */
  ['g',  0.0000,  1.6417,  0.2458,  0.5278, -1],  /* #4874cb  idx43 id82 */
  ['g',  0.0000,  0.7299,  0.2458,  0.5278, -1],  /* #4874cb  idx44 id83 */
  ['g',  3.6542,  2.6486,  0.2458,  0.5278, -1],  /* #4874cb  idx45 id84 */
  ['g',  3.6479,  1.6326,  0.2458,  0.5278, -1],  /* #4874cb  idx46 id85 */
  ['g',  3.6479,  0.7208,  0.2458,  0.5278, -1],  /* #4874cb  idx47 id86 */
  ['g',  6.8972,  2.6486,  0.2458,  0.5278, -1],  /* #4874cb  idx48 id87 */
  ['g',  6.8910,  1.6326,  0.2458,  0.5278, -1],  /* #4874cb  idx49 id88 */
  ['g',  6.8910,  0.7208,  0.2458,  0.5278, -1],  /* #4874cb  idx50 id89 */
  ['g', 10.2799,  2.6576,  0.2458,  0.5278, -1],  /* #4874cb  idx51 id90 */
  ['g', 10.2736,  1.6417,  0.2458,  0.5278, -1],  /* #4874cb  idx52 id91 */
  ['g', 10.2736,  0.7299,  0.2458,  0.5278, -1],  /* #4874cb  idx53 id92 */
];
/* 类计数（`_j9slide.py` 逐块对过）：d=1 g=40 k=1 m=1 t=1 w=9（矩形 50 + 多边形 3） */

/* 楼名点阵 —— 由 `_build/_j9font.py` 生成，勿手改。
   ⚠️ 生成块的**内容**由那个脚本重写；下面这两行是空壳，先跑 `_j9font.py` 再构建。 */
/*__J9_GEN_BEGIN__*/
/* ==== 由 _build/_j9font.py 生成，勿手改 ==== */
/* 楼名点阵。源（用户给）：预览/jiujiaofont.png —— 「计算机科学与技术学院」横排 10 字，
   金色 3D 立体字，底子是**烤进像素的浅灰棋盘**（无 alpha）=> 按**饱和度**
   sat>=40 切（分位 50/90/99 = 3/10/157，40 落在正中空档）；右下角那枚
   「豆包AI生成」水印整块 sat<40，自带过滤。整条流水线见 _j9font.py 文件头。
   ⚠️ 各字**同用一个缩放率** s = 9 / 285 = 0.03158、**底边对齐**
      （源图墨高 261..197 差 1.32 倍；逐字各自拉满会把「与」抻成「算」那么高）。
   ⚠️ 字高 9 与字缝都是**被匾额宽度反推**的：金匾内宽 82 px，这里总宽 71 px。
      改字号先看 _j9font.py 文件头③④。
   ⚠️ 这里**故意不写坐标**：落位在调用点现算（67 段 §5.16 的 j9Plaque）。 */
const J9_CHARS = [   /* 逐字 9 行（上补空行，底边对齐）、宽随各字墨宽 */
  ["AAiR996JBgQ=",  7, 9],   /*  1  计  墨高 8 行 */
  ["AOeeOPe+GA==",  6, 9],   /*  2  算  墨高 8 行 */
  ["AAABT98e/2A=",  7, 9],   /*  3  机  墨高 7 行 */
  ["AAed/+aCCA==",  6, 9],   /*  4  科  墨高 8 行 */
  ["AA33+s4w",  5, 9],   /*  5  学  墨高 7 行 */
  ["AAADGf84",  5, 9],   /*  6  与  墨高 6 行 */
  ["AAAgY5+XfnY=",  7, 9],   /*  7  技  墨高 7 行 */
  ["AAIOM4e/IA==",  6, 9],   /*  8  术  墨高 7 行 */
  ["AB/v+uYw",  5, 9],   /*  9  学  墨高 7 行 */
  ["AAAn748+bW4=",  7, 9],   /* 10  院  墨高 7 行 */
];
const J9_GAPS = [1, 1, 1, 1, 1, 2, 1, 1, 1];   /* 字缝（列），源图字距按同一 s 缩来 */
/*__J9_GEN_END__*/

/* --- 5.16.2 调色 + 受光/背光边 ----------------------------------------------
   ⚠️ 这里存的是**字面色**，不是 PALETTE —— 正面图的颜色由 ppt 给定，
      `styleOf` 的档位（p:0 教学米色）与本楼无关。
      `J9_K_BASE` 六个主色**必须与 `J9_PAL` 逐条相等**（build.py 有断言）。
   ⚠️ `*_L` / `*_D` 是 30 段 SUN（左上受光）规则的**派生档**，
      正面图里不存在（正面图平涂）—— 那是本图全局的光照口径。 */
const J9_C = {
  TILE:  "#d9d9d9", TILE_L: "#e4e2df", TILE_D: "#c8c6c3",   // 白瓷砖（bg1 lum85000）
  JOINT: "rgba(0,0,0,0.085)",                                // 砖缝（压在两块之间）
  GLASS: "#4874cb", GLASS_L: "#7fa2dd", GLASS_D: "#2b4a86",  // 蓝玻璃（accent1）
  BLACK: "#404040", BLACK_L: "#4e4e4e", BLACK_D: "#333333",  // 黑玻璃（tx1 lum75 lumOff25）
  MULL:  "#6d6d6d", MULL_D: "#585858",                       // 幕墙竖挺/横挺
  BAND:  "#b58b02", BAND_L: "#d8ab2a", BAND_D: "#7f5f02",    // 金门廊（accent3 lum75）
  DOOR:  "#595959", DOOR_L: "#7b7b7b", DOOR_D: "#3b3b3b",    // 门（tx1 lum65 lumOff35）
  INK_L: "#eccd70", INK_D: "#604008"                         // 楼名（金字：亮面 + 暗底边）
};
/* 类 → ppt **实测色**（build.py 逐条对 `J9_PAL`） */
const J9_K_BASE = { w: J9_C.TILE, t: J9_C.TILE, g: J9_C.GLASS,
                    k: J9_C.BLACK, d: J9_C.DOOR, m: J9_C.BAND };

/* --- 5.16.3 几何：宽锚现算，一处写死 ---------------------------------------- */
function j9Geo(c) {
  const wallH0 = J9_FLOORS * FLOOR_H;
  const roofT  = c.height - J9_PADT - wallH0 - J9_PADB;   // 反解，不存第二份
  const eaveY  = J9_PADT + roofT;                         // 檐下沿 = 立面顶
  const w      = c.width - J9_PADX * 2;                   // 立面外框宽 = footprint 宽
  const sc     = w / J9_EW;                               // 每英寸多少世界像素
  const U      = (v) => Math.round(v * sc);
  const FH     = U(J9_EH);                                // 立面高 = 153
  const y0     = eaveY;                                   // 立面第 0 行
  const G = {
    roofT: roofT, wallH: wallH0, eaveY: eaveY, y0: y0,
    x0: J9_PADX, x1: J9_PADX + w, w: w, sc: sc, U: U,
    FH: FH, baseY: y0 + FH, H: y0 + FH + J9_PADB,
    tx0: J9_PADX, ty0: eaveY,          // 砖缝网格的锚点 = 立面左上角（全楼共用一套）
    /* 英寸 → 画布；矩形一律**两端各取整再相减**（不许把宽单独取整 ——
       相邻两块会因此差 1px 露缝，见 30 段的教训）。 */
    rect: (e) => [J9_PADX + U(e[1]), y0 + U(e[2]),
                  U(e[1] + e[3]) - U(e[1]), U(e[2] + e[4]) - U(e[2])],
    /* 多边形 → 画布（**不取整**：轮廓的取整交给行扫描，见 5.16.4） */
    pts: (pi) => J9_PATH[pi].map((p) => [J9_PADX + p[0] * sc, y0 + p[1] * sc])
  };
  G.mull  = j9MullPitch(G);
  G.bar   = j9GoldBar(G);
  /* 天井（口字缺口）：环宽 J9_RING 是**平面**像素 —— 横向 1:1，行方向乘进深比例
     J9_KZ（30 段 `depth * 0.60` 那一笔；立面上 1 in 与平面上 1 in 是同一个世界像素，
     所以这里不需要知道 footprint 进深）。 */
  const riy = Math.round(J9_RING * J9_KZ);                // 上下各让出的行数 = 33
  G.riy   = riy;
  G.hole  = { x: J9_PADX + J9_RING, y: J9_PADT + riy,
              w: w - 2 * J9_RING, h: roofT - 2 * riy };
  /* 几何闸：30 段的 PADT/画布高公式一动，反解出的 roofT 立刻出界 ——
     出图时是一栋比例崩掉的楼，而几套自动验收都不看画面。 */
  if (roofT < 20 || roofT > 190)
    console.warn("67_j9: 反解出的 roofT=%d 出了 30 段的 clamp 区间[20,190]，" +
                 "画布高 %d 与 PADT/wallH/SHY 公式对不上了", roofT, c.height);
  /* 天井闸：洞口必须在屋面里，四边的环都要留得下东西 —— 上下两条环要放得下
     30 段那套女儿墙（受光 4 + 内阴影 3 + 板面）与檐口投影线；洞本身要放得下里院
     那面墙的 4 排窗（见 5.16.7b 的 j9CourtRows）。改 J9_RING / J9_KZ，或者
     30 段那两条比例一改，这一条会先响，而不是等出图看见一个畸形院子。 */
  if (riy < 18 || G.hole.w < 120 || G.hole.h < 90)
    console.warn("67_j9: 天井 洞 %d×%d、上下各留 %d 行 —— 环太窄或洞太小，" +
                 "里院那面墙（4 排窗 ≈ 68 行 + 墙脚）放不下。J9_RING=%d、J9_KZ=%s " +
                 "与 w=%d / roofT=%d 配不上", G.hole.w, G.hole.h, riy, J9_RING, J9_KZ, w, roofT);
  /* 楼名闸：点阵块必须落在金门廊横梁里、且中心与用户那个标注框对得上 ——
     换字体、改字号、动 ppt 上那个框，这一条会先响，
     而不是等出图才发现字顶穿门廊或者跑到旁边去了。 */
  let tw = 0, gh = 0;
  for (let i = 0; i < J9_CHARS.length; i++) {
    tw += J9_CHARS[i][1] + (i ? J9_GAPS[i - 1] : 0);
    if (J9_CHARS[i][2] > gh) gh = J9_CHARS[i][2];
  }
  const tx = G.rect([0, J9_TXT.x, J9_TXT.y, J9_TXT.w, J9_TXT.h, -1]);
  const dx = Math.abs((G.bar[0] + (G.bar[2] >> 1)) - (tx[0] + (tx[2] >> 1)));
  if (tw > G.bar[2] - 2 || gh > G.bar[3] - 2 || dx > J9_BAR_TOL)
    console.warn("67_j9: 楼名点阵 %d×%d 与金门廊横梁 %d×%d 对不上，" +
                 "或与标注框中心差 %d px（上限 %d）—— 重跑 _build/_j9font.py？",
                 tw, gh, G.bar[2], G.bar[3], dx, J9_BAR_TOL);
  return G;
}

/* 幕墙分格模数（px）：**现算** —— 取"同一竖列上窗最多的那一列"，
   用 (末行 y − 首行 y) ÷ (行数 − 1) 当节拍（实测左翼 x=0.7611 那列：
   6 行、跨度 2.0076 in ⇒ 0.4015 in ⇒ ×41.6774 = 16.73 ⇒ **17 px**）。
   ⚠️ 只当"节拍"，不逐行对齐 —— 见文件头"已知代价"最后一条。 */
function j9MullPitch(G) {
  const col = {};
  for (const e of J9_EL) {
    if (e[0] !== "g" || Math.abs(e[4] - J9_WIN_H) > 1e-9) continue;   // 只要"一排窗"那一族
    const k = e[1].toFixed(4);
    (col[k] = col[k] || []).push(e[2]);
  }
  let best = null;
  for (const k in col) {
    const a = col[k].sort(function (p, q) { return p - q; });
    if (a.length >= 4 && (!best || a.length > best.length)) best = a;
  }
  if (!best) return G.U(0.4015);                       // 表被改坏时兜底（右翼实测同值）
  return G.U((best[best.length - 1] - best[0]) / (best.length - 1));
}

/* 金门廊的**横梁**矩形（楼名压在这上面）—— 从多边形现算，不写死：
   上沿 = 多边形最高行；下沿 = 顶点里"出现次数最多"的那个 y（П 的缺口上沿
   1.9311 在 12 个顶点里出现 4 次，腿底 3.6292/3.6299 各 1 次，顶边 1.1097
   与最高行同值被排除）⇒ 得到 82×34 px 的横梁。 */
function j9GoldBar(G) {
  let pi = -1;
  for (const e of J9_EL) if (e[0] === "m" && e[5] >= 0) { pi = e[5]; break; }
  if (pi < 0) return [0, G.y0, 1, 1];
  const p = G.pts(pi);
  let ymin = Infinity, xmin = Infinity, xmax = -Infinity;
  for (const q of p) {
    if (q[1] < ymin) ymin = q[1];
    if (q[0] < xmin) xmin = q[0];
    if (q[0] > xmax) xmax = q[0];
  }
  const ys = Math.round(ymin), cnt = new Map();
  for (const q of p) {
    const v = Math.round(q[1]);
    if (v <= ys) continue;
    cnt.set(v, (cnt.get(v) || 0) + 1);
  }
  let bt = ys + 1, bc = 0;
  cnt.forEach(function (n, v) { if (n > bc) { bc = n; bt = v; } });
  const x0 = Math.round(xmin), x1 = Math.round(xmax);
  return [x0, ys, x1 - x0, bt - ys];
}

/* --- 5.16.4 白瓷砖 / 黑玻璃幕墙 --------------------------------------------- */

/* 行扫描：把多边形与水平线 y=yc 的交点按 x 排好、两两配对成整数区间（半开 [xa, xb)）。
   ⚠️ 判交用"一端 <=yc、另一端 >yc"（半开），水平边（ya==yb）恒不满足 ⇒ 顶点处不会
      重复计数。本页三个多边形都是**轴对齐直角**多边形，这样扫出来的每一行都是精确的。 */
function j9Spans(pts, yc) {
  const xs = [];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length];
    if ((a[1] <= yc && b[1] > yc) || (b[1] <= yc && a[1] > yc))
      xs.push(a[0] + (b[0] - a[0]) * (yc - a[1]) / (b[1] - a[1]));
  }
  xs.sort(function (p, q) { return p - q; });
  const out = [];
  for (let i = 0; i + 1 < xs.length; i += 2)
    out.push([Math.round(xs[i]), Math.round(xs[i + 1])]);
  return out;
}

/* 白瓷砖逐块色差表 —— 只走**局部** makeRng（碰共享流会重掷全校园散射，60 段 §6.6 那颗地雷）。
   查表用 (tx, ty) 的散列下标，**不用 rng 流**：同一块砖在任何调用顺序下都是同一个色。 */
const J9_JIT = (function () { const r = makeRng(6701), a = []; for (let i = 0; i < 64; i++) a.push(r()); return a; })();
function j9TileCol(tx, ty) {
  const k = J9_JIT[(((tx * 7 + ty * 13) % 64) + 64) % 64];
  return k < 0.10 ? J9_C.TILE_D : (k > 0.90 ? J9_C.TILE_L : J9_C.TILE);
}

/* 贴砖：把一块白件（矩形或多边形）按**全楼共用**的砖缝网格铺上小方格。
   · 网格锚在立面左上角（G.tx0, G.ty0）⇒ 9 块白件拼在一起时砖缝是连续的，
     不会在接缝处出现半块砖（两翼右沿与内侧竖条、竖条与端柱都是紧紧相接的）。
   · 每块砖先铺底色、再给 10% / 10% 的砖换浅一档 / 深一档，最后压砖缝
     （砖缝落在每块砖的**最后一行/最后一列**，与 66 段同法）。 */
function j9Tiles(g, pts, G) {
  const P = J9_TILE_P;
  let by0 = Infinity, by1 = -Infinity;
  for (const q of pts) { if (q[1] < by0) by0 = q[1]; if (q[1] > by1) by1 = q[1]; }
  by0 = Math.max(0, Math.floor(by0));
  by1 = Math.min(G.H, Math.ceil(by1));
  for (let y = by0; y < by1; y++) {
    const sp = j9Spans(pts, y + 0.5);
    if (!sp.length) continue;
    const jr = (((y - G.ty0) % P) + P) % P === P - 1;      // 这一行是横向砖缝
    const ty = Math.floor((y - G.ty0) / P);
    for (let s = 0; s < sp.length; s++) {
      const xa = sp[s][0], xb = sp[s][1];
      if (xb <= xa) continue;
      if (jr) { px(g, xa, y, xb - xa, 1, J9_C.JOINT); continue; }
      px(g, xa, y, xb - xa, 1, J9_C.TILE);
      for (let tx = Math.floor((xa - G.tx0) / P); ; tx++) {
        const t0 = G.tx0 + tx * P;
        if (t0 >= xb) break;
        if (t0 + P <= xa) continue;
        const cx0 = Math.max(xa, t0), cx1 = Math.min(xb, t0 + P);
        const col = j9TileCol(tx, ty);
        if (col !== J9_C.TILE && cx1 > cx0) px(g, cx0, y, cx1 - cx0, 1, col);
        if (t0 >= xa && t0 < xb) px(g, t0, y, 1, 1, J9_C.JOINT);   // 竖向砖缝
      }
    }
  }
}

/* 黑玻璃幕墙（`k` 类）：**画玻璃 + 网格划分**（用户点名）。
   分格按"窗模数"（G.mull = 17 px）等分：竖挺 nC 格、横挺 nR 格，
   每格玻璃给一点明度抖动（幕墙的反射），挺线压一档亮灰。 */
function j9BlackGlass(g, r, G) {
  const x = r[0], y = r[1], w = r[2], h = r[3];
  if (w < 4 || h < 4) return;
  px(g, x, y, w, h, J9_C.BLACK);
  const nC = Math.max(2, Math.round(w / G.mull));
  const nR = Math.max(2, Math.round(h / G.mull));
  for (let i = 0; i < nC; i++) {
    const cxa = x + Math.round(i * w / nC), cxb = x + Math.round((i + 1) * w / nC);
    for (let j = 0; j < nR; j++) {
      const cya = y + Math.round(j * h / nR), cyb = y + Math.round((j + 1) * h / nR);
      const k = J9_JIT[(((i * 11 + j * 5) % 64) + 64) % 64];
      if (k < 0.28) px(g, cxa, cya, cxb - cxa, cyb - cya, J9_C.BLACK_D);
      else if (k > 0.74) px(g, cxa, cya, cxb - cxa, cyb - cya, J9_C.BLACK_L);
    }
  }
  for (let i = 1; i < nC; i++) {                       // 竖挺
    const cx = x + Math.round(i * w / nC);
    px(g, cx, y, 1, h, J9_C.MULL);
  }
  for (let j = 1; j < nR; j++) {                       // 横挺
    const cy = y + Math.round(j * h / nR);
    px(g, x, cy, w, 1, J9_C.MULL);
    px(g, x, cy + 1, w, 1, J9_C.MULL_D);
  }
  px(g, x, y, 1, h, J9_C.MULL_D);                      // 左 1px 收口
  px(g, x + w - 1, y, 1, h, J9_C.MULL_D);
}

/* --- 5.16.5 逐形状的四种件 ------------------------------------------------- */

/* 普通玻璃（`g` 类，40 块）：**凹进去的窗洞** —— 上沿压暗、下沿提亮（凹口反相，
   与 30 段那套"凸出实体上+左提亮"正好相反）。宽窗（≥18px）中间加一条竖挺，
   读作两扇；窄窗（10px，端柱/竖条上那 12 块）不加。 */
function j9GlassBlue(g, r) {
  const x = r[0], y = r[1], w = r[2], h = r[3];
  if (w < 3 || h < 3) return;
  px(g, x, y, w, h, J9_C.GLASS);
  px(g, x, y, w, 1, J9_C.GLASS_D);
  px(g, x, y + h - 1, w, 1, J9_C.GLASS_L);
  px(g, x, y, 1, h, J9_C.GLASS_D);
  px(g, x + w - 1, y, 1, h, J9_C.GLASS_D);
  if (w >= 18) px(g, x + (w >> 1), y + 1, 1, h - 2, J9_C.GLASS_D);
}

/* 门（`d` 类）：同样是凹口，再压一条中缝（双开门）。 */
function j9Door(g, r) {
  const x = r[0], y = r[1], w = r[2], h = r[3];
  if (w < 3 || h < 3) return;
  px(g, x, y, w, h, J9_C.DOOR);
  px(g, x, y, w, 1, J9_C.DOOR_D);
  px(g, x, y + h - 1, w, 1, J9_C.DOOR_L);
  px(g, x, y, 1, h, J9_C.DOOR_D);
  px(g, x + w - 1, y, 1, h, J9_C.DOOR_D);
  if (w >= 12) px(g, x + (w >> 1), y + 1, 1, h - 2, J9_C.DOOR_D);
}

/* 台阶（`t` 类）：ppt 里是个 `prst=trapezoid`（avLst 空 ⇒ 默认 adj=25000
   ⇒ 顶边两侧各收 min(w,h)×0.25 = 7×0.25 ≈ 2px）。用户说「梯形是阶梯」
   ⇒ 按这个收分画出 3 级踏步：每级**踏面提亮、踢面压暗**，越往上越往里收。 */
function j9Stairs(g, r) {
  const x = r[0], y = r[1], w = r[2], h = r[3];
  if (w < 6 || h < 3) return;
  const n = Math.min(J9_STAIR_N, h);
  const ins = Math.round(0.25 * Math.min(w, h));       // 顶边单侧收分（adj=25000）
  for (let i = 0; i < n; i++) {                        // i = 0 是最下面一级
    const ya = y + h - Math.round((i + 1) * h / n), yb = y + h - Math.round(i * h / n);
    const sh = Math.max(0, Math.round(ins * (n - 1 - i) / Math.max(1, n - 1)));
    const xa = x + sh, xb = x + w - sh;
    if (xb - xa < 2 || yb - ya < 1) continue;
    px(g, xa, ya, xb - xa, yb - ya, J9_C.TILE);
    px(g, xa, ya, xb - xa, 1, shade(J9_C.TILE, 0.12));            // 踏面
    px(g, xa, yb - 1, xb - xa, 1, shade(J9_C.TILE, -0.26));       // 踢面
  }
}

/* 金门廊（`m` 类，П 形多边形）：凸出的实体 —— 上 + 左提亮、下 + 右压暗，逐行按
   行扫描的结果描边（这样两条腿的内外沿都能描到）。 */
function j9Gold(g, pts, G) {
  let ymin = Infinity, ymax = -Infinity;
  for (const q of pts) { if (q[1] < ymin) ymin = q[1]; if (q[1] > ymax) ymax = q[1]; }
  const ya = Math.max(0, Math.floor(ymin)), yb = Math.min(G.H, Math.ceil(ymax));
  for (let y = ya; y < yb; y++) {
    const sp = j9Spans(pts, y + 0.5);
    for (let s = 0; s < sp.length; s++) {
      const xa = sp[s][0], xb = sp[s][1];
      if (xb <= xa) continue;
      px(g, xa, y, xb - xa, 1, J9_C.BAND);
      px(g, xa, y, 1, 1, J9_C.BAND_L);
      px(g, xb - 1, y, 1, 1, J9_C.BAND_D);
    }
  }
  for (const sp of j9Spans(pts, ya + 0.5)) px(g, sp[0], ya, sp[1] - sp[0], 1, J9_C.BAND_L);
  for (const sp of j9Spans(pts, yb - 0.5)) px(g, sp[0], yb - 1, sp[1] - sp[0], 1, J9_C.BAND_D);
}

/* --- 5.16.6 楼名：点阵压在金门廊的横梁上 -----------------------------------
   与 `_build/_j9font.py` 的 draw_preview() **逐条同构**（预览图就是按这支笔出的，
   观感判据才有效）：笔画的上缘用亮金、下缘那一行压暗金 —— 源图是**金色 3D 立体字**，
   自带厚度，这两档正好把它读出来。 */
function j9Glyph(g, b64, nw, nh, x, y) {
  const s = atob(b64), bit = (i) => (s.charCodeAt(i >> 3) >> (7 - (i & 7))) & 1;
  for (let j = 0; j < nh; j++) {
    for (let i = 0; i < nw; i++) {
      if (!bit(j * nw + i)) continue;
      const dn = (j + 1 >= nh) || !bit((j + 1) * nw + i);
      px(g, x + i, y + j, 1, 1, dn ? J9_C.INK_D : J9_C.INK_L);
    }
  }
}
/* 排布：**居中在金门廊的横梁上**（横梁是这栋楼放名字的构件）。
   用户那个标注框（`J9_TXT`）是落位依据，它的中心比横梁中心偏右 3 px
   （框右沿与横梁右沿重合、左沿内缩 6px —— 用户是**描着金匾**画的框，描斜了）。
   ⇒ 取横梁中心。代价（诚实记一笔）：字块左沿会越出那个框 **1 px**
   （同以图左沿为 0：字块左 190、框左 191；而框右 267 与横梁右沿**逐字相等**、
   末字右沿 261 ⇒ 右边还剩 6 px）。改成"严格居中于框"只需把
   `G.bar[0]` 换成框左沿、`G.bar[2]` 换成框宽 —— 但那样名字在金匾上会左偏 6 px。
   `j9Geo` 的楼名闸盯着这个差值（上限 J9_BAR_TOL=6 px）。 */
function j9Plaque(g, G) {
  let tw = 0, gh = 0;
  for (let i = 0; i < J9_CHARS.length; i++) {
    tw += J9_CHARS[i][1] + (i ? J9_GAPS[i - 1] : 0);
    if (J9_CHARS[i][2] > gh) gh = J9_CHARS[i][2];
  }
  let x = G.bar[0] + ((G.bar[2] - tw) >> 1);
  const y = G.bar[1] + Math.max(0, (G.bar[3] - gh) >> 1);
  for (let i = 0; i < J9_CHARS.length; i++) {
    j9Glyph(g, J9_CHARS[i][0], J9_CHARS[i][1], J9_CHARS[i][2], x, y);
    x += J9_CHARS[i][1] + (i < J9_GAPS.length ? J9_GAPS[i] : 0);
  }
}

/* --- 5.16.7 立面总装（只在**新画布**上画，不 clearRect） ---------------------
   次序 = `J9_EL` 的顺序 = **ppt 的 z 序** ⇒ 用户点名的「覆盖关系」照搬，
   没有第二张 z 序表：黑玻璃在最底 ⇒ 金门廊压上去 ⇒ 门压在金门廊的洞里
   ⇒ 两翼/竖条/端柱依次压边 ⇒ 台阶 ⇒ 顶部横带盖住黑玻璃与竖条的上沿。 */
function j9Front(g, G) {
  /* ① 墙底：整幅立面先铺一层砖底。理由有两条 ——
     (a) ppt 里两翼/端柱从 y=0.0236 起、中间那条横带从 y=0 起，差 1 行；
         不铺底的话立面最上一行会是一条**透明缝**（透出地面）；
     (b) 形状之间因取整留下的 1px 缝（如 4.0812..4.0889）也会透出地面。 */
  px(g, G.x0, G.y0, G.w, G.FH, J9_C.TILE);
  for (let i = 0; i < J9_EL.length; i++) {
    const e = J9_EL[i], k = e[0];
    if (k === "w") {
      j9Tiles(g, e[5] >= 0 ? G.pts(e[5]) : [[G.rect(e)[0], G.rect(e)[1]],
                                             [G.rect(e)[0] + G.rect(e)[2], G.rect(e)[1]],
                                             [G.rect(e)[0] + G.rect(e)[2], G.rect(e)[1] + G.rect(e)[3]],
                                             [G.rect(e)[0], G.rect(e)[1] + G.rect(e)[3]]], G);
    } else if (k === "k") {
      j9BlackGlass(g, G.rect(e), G);
    } else if (k === "g") {
      j9GlassBlue(g, G.rect(e));
    } else if (k === "d") {
      j9Door(g, G.rect(e));
    } else if (k === "t") {
      j9Stairs(g, G.rect(e));
    } else if (k === "m") {
      j9Gold(g, G.pts(e[5]), G);
      j9Plaque(g, G);                          // 门廊刚落地，就地压楼名
    }
  }
  /* ② 左右两条侧边（SUN 左上受光）：本楼两翼一直铺到外框边，没有单独的"山墙"可描 ——
     这一条是给整栋立面的轮廓定界的，1px，压在贴好的瓷砖之上。 */
  px(g, G.x0, G.y0, 1, G.FH, shade(J9_C.TILE, 0.10));
  px(g, G.x1 - 1, G.y0, 1, G.FH, shade(J9_C.TILE, -0.14));
  /* ③ 接地带：收住脚线，与 65 段同参。 */
  contactBand(g, G.x0, G.x1, G.baseY - 2, 3, 0.34);
}

/* --- 5.16.7a 屋面：口字形（环 + 天井） ---------------------------------------
   ⚠️ 这里的整块屋面是**照 30 段 §2 逐笔重画**的，不是"在 30 段的屋面上挖个洞"。
      两条理由：
      (a) 旧屋面上有 30 段按种子 7001 随机撒的 2~4 个设备箱（`_j9roof.py` 能逐块
          算出来），挖洞会**切开**正好压在洞沿上的箱子 —— 切一半的箱子既不像箱子，
          也补不回来；
      (b) 屋名牌（30 段 §3.2.9）连同它朝右下 3px 的投影就画在屋面上，整块重画一次
          正好把它连根盖掉（第 27 轮那块"补板面"的补丁唯一用途就是补它的疤）。
   ⚠️ 重画的每一笔都**逐字照抄** 30 段 §2 的那九行（色号是抄来的 —— 第 27 轮抄错
      一个 `-0.04` 就在屋面上留下一块 117×34 的亮斑）；build.py ⑩c-3 把两边的
      字面量一条一条钉在一起，改一边不改另一边会直接构建失败。
   ⚠️ **不碰共享随机流**：斑点走局部 makeRng(6720)/(6721)，设备箱走 (6722)。
      碰了共享 rng 会重掷全校园散射（三套自动验收都查不出，见 60 段 §6.6）。 */
function j9RoofRect(G) {                      // 擦除框：连檐口外沿（x0−3 / w+6）一起清
  return [G.x0 - 4, J9_PADT - 2, G.w + 8, G.roofT + 4];
}
function j9Roof(g, G, pal) {
  const r = pal.roof, w = G.w, x0 = G.x0, x1 = G.x1;
  const PADT = J9_PADT, roofT = G.roofT, rc = j9RoofRect(G);
  g.clearRect(rc[0], rc[1], rc[2], rc[3]);
  px(g, x0 - 3, PADT, w + 6, roofT, shade(r, -0.34));            // 檐口外沿
  px(g, x0, PADT + 2, w, roofT - 5, shade(r, -0.04));            // 板面
  px(g, x0, PADT + 2, w, 4, shade(r, 0.26));                     // 女儿墙顶受光
  px(g, x0, PADT + 6, w, 3, "rgba(14,18,28,0.34)");              // 女儿墙内阴影
  px(g, x0, PADT + 6, 4, roofT - 9, shade(r, 0.14));             // 左内侧受光
  px(g, x1 - 4, PADT + 6, 4, roofT - 9, "rgba(14,18,28,0.22)");  // 右内侧背光
  for (let j = 1; j <= 3; j++)                                   // 分坡脊线
    px(g, x0 + 5, PADT + Math.round((roofT - 12) * j / 4) + 6, w - 10, 1, "rgba(255,255,255,0.08)");
  px(g, x0 - 3, PADT + roofT - 1, w + 6, 2, shade(r, -0.60));    // 檐口投影线
  j9RoofBoxes(g, G, pal);
  speckle(g, x0 + 4, PADT + 7, w - 8, roofT - 12, "rgba(255,255,255,0.05)", (w / 3) | 0, makeRng(6720));
  speckle(g, x0 + 4, PADT + 7, w - 8, roofT - 12, "rgba(0,0,0,0.07)", (w / 4) | 0, makeRng(6721));
  j9Court(g, G, pal);                        // 天井压在最后：顺带盖掉落进洞里的斑点
}
/* 洞口让位：一块矩形**连同它朝右下 4px 的设备投影**都要离洞沿至少 g 像素。
   投影不一起让开的话，箱子本体在环上、影子却挂在院子上空。 */
function j9RingFree(bx, by, bw, bh, H, g) {
  const x0 = bx - g - 4, y0 = by - g - 4, x1 = bx + bw + g + 4, y1 = by + bh + g + 4;
  return x1 <= H.x || x0 >= H.x + H.w || y1 <= H.y || y0 >= H.y + H.h;
}
/* 屋面设备箱：尺寸与落点公式照 30 段 §2 那段搬，但**必须整块落在环上**。
   洞口吃掉屋面 48%（本楼），随机落点有一小半会压在洞沿上 ⇒ 命中的候选**整块不要**，
   重掷下一个（不挪位、不缩尺寸 —— 挪过的箱子会全挤在环边，比少放难看）。
   `J9_BOX_N` 是上限：环窄，放不下就少放。 */
function j9RoofBoxes(g, G, pal) {
  const r = pal.roof, w = G.w, PADT = J9_PADT, roofT = G.roofT, H = G.hole;
  if (roofT <= 46) return;
  const rng = makeRng(6722);
  let n = 0;
  for (let t = 0; t < 80 && n < J9_BOX_N; t++) {
    const bw = 18 + rng() * 34, bh = 12 + rng() * 20;
    const bx = Math.round(G.x0 + 14 + rng() * Math.max(1, w - 28 - bw));
    const by = Math.round(PADT + 14 + rng() * Math.max(1, roofT - 28 - bh - bh * 0.5));
    if (!j9RingFree(bx, by, bw, bh, H, 6)) continue;
    px(g, bx + 4, by + 4, bw, bh, "rgba(14,18,28,0.30)");         // 设备投影
    px(g, bx, by + bh - 4, bw, 4, shade(r, -0.38));               // 设备侧墙
    px(g, bx, by, bw, bh, shade(r, 0.16));
    px(g, bx, by, bw, 3, shade(r, 0.34));
    px(g, bx, by + bh - 1, bw, 1, "rgba(14,18,28,0.30)");
    n++;
  }
}
/* 四条矩形拼一个"环"（不用 strokeRect —— 本项目一律 px()：strokeRect 的边是
   抗锯齿的，像素画上会描出一条软边，同 5.16.4 头注那条）。 */
function j9Frame(g, x, y, w, h, t, col) {
  px(g, x, y, w, t, col);
  px(g, x, y + h - t, w, t, col);
  px(g, x, y, t, h, col);
  px(g, x + w - t, y, t, h, col);
}

/* --- 5.16.7b 天井（口字缺口）+ 里院 -----------------------------------------
   尺寸（平面世界像素；footprint 450 × 304，见文件头"尺度"）：
       环宽 55 ⇒ 院子 340 × 194 = footprint 的 76% × 64%、面积 48%
       画布：洞 x = x0+55 .. x1−55（宽 340）；上下各让 round(55 × 0.6) = 33 行 ⇒ 高 117
   （用户第二十八轮：「口字缺口不能很小，实际上九教中间的院落是相当大的」——
     所以环宽取的是"一圈楼的进深"，而不是更宽的一圈楼板。）

   洞里从上到下画两样：
     ① 里院北楼的**内立面** —— 就是用户说的「露出一部分教学楼」：白瓷砖 + 蓝窗 4 排；
     ② 院子地面 —— 校园石头广场同款石板（PLAZA_BASE / PLAZA_DARK），墙脚压一条落影。
   ⚠️ **这是一处刻意的偏离，必须报备**：按这张图的投影（俯角 37°、竖直 1:1、进深
      ×0.6）从外面看一个 7 层高的院子，**地面一行都看不到** —— 要看到地面，院子进深
      得超过 153 / 0.6 = 255 px，而本楼只有 194。真按投影画，洞里会**整块被那面墙**
      填满（墙 153 行 > 洞 117 行）。像素画的惯例是"读得出来优先"：把墙压到洞高的
      J9_CWALL = 2/3、下面 1/3 留给院子地面，一眼才读得出"这是个院子"。
      改这个比例只动 J9_CWALL 一个数。 */
function j9Court(g, G, pal) {
  const H = G.hole, r = pal.roof;
  j9Frame(g, H.x - 5, H.y - 5, H.w + 10, H.h + 10, 3, shade(r, -0.34));  // 内圈外沿
  j9Frame(g, H.x - 2, H.y - 2, H.w + 4, H.h + 4, 2, shade(r, -0.60));    // 贴边投影线
  j9CourtYard(g, G, pal);
}
function j9CourtYard(g, G, pal) {
  const H = G.hole;
  const wh = Math.round(H.h * J9_CWALL);            // 里院北楼露出来的那截墙高
  j9CourtPave(g, H.x, H.y + wh, H.w, H.h - wh);     // ① 院子地面（先铺，墙压上去）
  j9CourtWall(g, H.x, H.y, H.w, wh, G);             // ② 内立面
  j9Frame(g, H.x, H.y, H.w, H.h, 2, "rgba(14,18,28,0.22)");   // ③ 洞内一圈环境光遮蔽
}
/* 院子地面：校园石头广场同款（PLAZA_BASE + PLAZA_DARK 缝），方砖 16px。
   ⚠️ 逐块色差走 J9_JIT 查表（与 5.16.4 的贴砖同一条纪律）—— 这里一掷 rng，
      全校园的散射会重排（60 段 §6.6 那颗地雷）。 */
function j9CourtPave(g, x, y, w, h) {
  const P = 16;
  px(g, x, y, w, h, PLAZA_DARK);
  for (let by = y; by < y + h - 1; by += P) {
    const hh = Math.min(P - 2, y + h - by - 2);
    for (let bx = x; bx < x + w - 1; bx += P) {
      const ww = Math.min(P - 2, x + w - bx - 2);
      if (ww < 1 || hh < 1) continue;
      const k = (J9_JIT[(((bx * 3 + by * 5) % 64) + 64) % 64] - 0.5) * 0.22;
      px(g, bx + 1, by + 1, ww, hh, shade(PLAZA_BASE, k));
      px(g, bx + 1, by + 1, ww, 1, shade(PLAZA_BASE, k + 0.10));   // 板面上棱微受光
    }
  }
}
/* 里院北楼的内立面（从院子里看这栋楼的背面）。
   构件**全部复用外面那支笔**：白瓷砖走 j9Tiles（同一套砖缝网格，缝能接上）、
   蓝窗走 j9GlassBlue。一个数都不新造：
     · 窗的**行**位置 = 外面立面自己那六排（`J9_EL` 的 0.2007/0.5847/…）里落得进
       可见墙高的那些 —— ⚠️ 那串 0.384/0.4278 的**交替行距是用户画的**，不许改成
       等距（第 27 轮的口径）；右翼那六排整体错开 0.0389 in，所以只取左翼（x < 4）；
     · 窗宽 / 窗高 / 排距从立面表现算（j9CourtWin）。 */
function j9CourtWall(g, x, y, w, wh, G) {
  /* ⚠️ 先铺一层**不透明**底（白瓷砖本色），再走 j9Tiles。
     理由是实测归因出来的：`J9_C.JOINT` 是 `rgba(0,0,0,0.085)` —— **半透明**，
     底下是什么就透出什么。不铺底的话砖缝压在**屋面板面**(103,121,135) 上，
     出一张 (94,110,123) 的深蓝灰网格（6 倍放大下一眼可见）；而外面立面的砖缝压在
     白底上，是 (198,198,198) 的浅灰网格。同一支笔要出同一个结果，**底也得一样**。
     顺带盖掉一件更隐蔽的：屋面那三条分坡脊线（y=67/110/152）里，
     y=110 正好落在砖缝那一行 ⇒ 不铺底就会有一条 +10 的亮痕从缝里透出来。 */
  px(g, x, y, w, wh, J9_C.TILE);
  j9Tiles(g, [[x, y], [x + w, y], [x + w, y + wh], [x, y + wh]], G);
  const win = j9CourtWin(G), m = G.U(0.5174);   // 窗离外框留的边 = 立面上端柱那一格宽
  const rows = j9CourtRows(G, wh);
  let n = Math.floor((w - 2 * m - win.w) / win.pitch) + 1;
  n = Math.max(2, Math.min(6, n));
  const lx = x + Math.round((w - ((n - 1) * win.pitch + win.w)) / 2);
  for (let r = 0; r < rows.length; r++)
    for (let i = 0; i < n; i++)
      j9GlassBlue(g, [lx + i * win.pitch, y + rows[r], win.w, win.h]);
  for (let i = 0; i < 4; i++)            // 檐下阴影：顶上 4 行逐行渐淡（30 段 §3.3 同法）
    px(g, x, y + i, w, 1, "rgba(14,18,28," + (0.34 * (1 - i / 4)).toFixed(3) + ")");
  px(g, x, y + wh - 5, w, 4, shade(J9_C.TILE, -0.16));       // 墙脚台明
  px(g, x, y + wh - 1, w, 1, shade(J9_C.TILE, -0.34));
}
/* 内墙那排窗的尺寸与排距：**从外面立面现算**（同一栋楼同一排窗，不许写第二份）。
   左翼最上面那一排（y 最小）里最靠左的两块 —— 它们的 x 差就是排距
   （2.5528 − 0.7611 = 1.7917 in ⇒ 75 px），宽高取其中一块（0.7285 × 0.2451 in
   ⇒ 30 × 10 px）。⚠️ `G.U()` 会**取整**：一排窗的排距带小数时，几排下来会一宽一窄，
   正是第 24 轮用户点名的「不能看起来很不均匀」。
   表被改坏时兜底用同一组实测值（与 j9MullPitch 同一写法）。 */
function j9CourtWin(G) {
  let y0 = Infinity;
  for (const e of J9_EL)
    if (e[0] === "g" && e[1] < 4 && Math.abs(e[4] - J9_WIN_H) < 1e-9 && e[2] < y0) y0 = e[2];
  const row = J9_EL.filter((e) => e[0] === "g" && e[1] < 4 &&
                                   Math.abs(e[4] - J9_WIN_H) < 1e-9 &&
                                   Math.abs(e[2] - y0) < 1e-9)
                   .sort(function (p, q) { return p[1] - q[1]; });
  if (row.length < 2) return { w: G.U(0.7285), h: G.U(0.2451), pitch: G.U(1.7917) };
  return { w: G.U(row[0][3]), h: G.U(row[0][4]), pitch: G.U(row[1][1] - row[0][1]) };
}
/* 可见墙高 wh 里落得下的那几排窗（行 = 外面立面自己的 y，逐排照搬）；底部留 5 行
   给墙脚台明 —— 一排窗压着墙脚就不是窗户了。 */
function j9CourtRows(G, wh) {
  const out = [];
  for (const e of J9_EL) {
    if (e[0] !== "g" || e[1] > 4 || Math.abs(e[4] - J9_WIN_H) > 1e-9) continue;
    const ry = G.U(e[2]);
    if (ry + G.U(e[4]) <= wh - 5 && out.indexOf(ry) < 0) out.push(ry);
  }
  return out.sort(function (p, q) { return p - q; });
}

/* --- 5.16.8 覆盖重绘入口 ----------------------------------------------------
   ⚠️ 必须在这里、addProp **之前**调（60_assemble.js）—— 重绘的是同一张 canvas
      的内容，晚一步 addProp 已经把旧精灵挂进 props 了（gymRestyle/…/dormLibRestyle
      同一规矩）。
   ⚠️ 本函数**不碰共享 RNG**（逐块色差走查表 J9_JIT，那张表在模块初始化时用
      局部 makeRng(6701) 造好后就不再掷了）。
   ⚠️ 第三个实参照 65 段传 `pal` —— 画立面用不上它（正面图的色是 ppt 给的，
      见 5.16.2），但**屋面（5.16.7a）整块重画时要用 `pal.roof`**，而
      `makeBuilding` 的返回值里没有色号。本段不许再存一份 PALETTE（TDZ，58 段栽过）。
      ⚠️ 屋面那九笔**不是**拿 `pal.roof` 本色画的：30 段 §2 是
      `shade(roof, −0.34 / −0.04 / 0.26 / …)` 一层层叠出来的。第 27 轮实测过
      拿本色去补板面 ⇒ 屋面上一块 **117×34 的亮斑**（板面 (103,121,135) 占屋面
      82%，本色 (108,127,140) 只占 11%），外加擦除边绕出的一圈亮边，合计 1847 px。
      **这些色号全是抄来的** ⇒ build.py ⑩c-3 按字面量把两边的九笔一条条钉住。
   ⚠️ **立面高 153 行 ≠ styleOf 的 4 层（136 行）** ⇒ 换一张高的画布；只拷旧画布
      顶部 y0+1 行（y0 = 檐口行）。⚠️ 那 `+1` 只保住屋面两侧各 3 px 的外沿 ——
      y0 那一整行（30 段檐口投影线的下半行）**随即被 ppt 的 idx11 檐口砖带盖掉**
      （它从 y0 起铺，实测 414 px），这是用户正面图本来就有的取舍，不是丢行。
      换画布**不改** `b.w` —— addSolid 用的是世界坐标，与精灵高矮无关。 */
function j9Restyle(b, pal) {
  const c = b.canvas, g = c.getContext("2d");
  const G = j9Geo(c);
  /* ① 屋面改口字形（5.16.7a）：**整块重画**，屋名标牌（30 段挂在檐口之上的那块）
        连同它朝右下 3px 的投影一起被 j9RoofRect 的擦除框盖掉
        ⇒ 第 27 轮那块"补板面"的补丁（与它的两个局部 makeRng）**整段删掉**：
        它唯一的用途就是补牌子那块 117×34 的疤。
        牌子仍然要"调"出来：makeSign 填 `_signCache`（verify.py 数的是这个名字），
        本楼的名字在金门廊上 —— 与 59/61/63/65 段同一处理。 */
  const sgn = makeSign(J9_NAME);
  const sg  = signRect(sgn, G.x0, G.w, G.eaveY);
  const rc  = j9RoofRect(G);
  if (sg && (rc[0] > sg.x || rc[1] > sg.y ||
             rc[0] + rc[2] < sg.x + sg.w + 3 || rc[1] + rc[3] < sg.y + sg.h + 3))
    console.warn("67_j9: 屋面重绘的擦除框 %d,%d %d×%d 没盖住屋名牌 %d,%d %d×%d —— " +
                 "牌子挂在檐口之上，会留在新屋面上", rc[0], rc[1], rc[2], rc[3],
                 sg.x, sg.y, sg.w, sg.h);
  j9Roof(g, G, pal);
  /* ② 新画布：旧画布的檐口以上搬过来（同一行） */
  const nc = mkCanvas(c.width, G.H), ng = nc.getContext("2d");
  ng.drawImage(c, 0, 0, c.width, G.y0 + 1, 0, 0, c.width, G.y0 + 1);
  /* ③ 方向性投影（照 30 段 §3.1：footprint 朝右下拉伸，画在立面**之前**，
        所以只有落地线以下那一截留在画面里）+ 立面总装 */
  const SHX = Math.round(-SUN.x * 26), SHY = Math.round(-SUN.y * 26);
  shadowQuad(ng, G.x0 + 2, G.baseY - J9_SHADOW_H, G.x1 - 2, G.baseY, SHX, SHY, 0.28, 4);
  j9Front(ng, G);
  b.canvas = nc;
  /* ④ 锚点：`b.y`（世界落地线）与 addSolid 用的世界坐标一个字节都不动 ——
        多出来的 17 行全部朝北长（见文件头"尺度"）。 */
  b.ay = G.baseY;
  return b;
}
