/* =========================================================
   2. 地面（全校 5208 × 2929）
   ---------------------------------------------------------
   PPT 只画了"有什么"（色块），**道路 = 剩余留白**。
   流程：占用位图 → 距离变换 → 路网分级 → 烘焙。

   烘焙顺序 = 校外底 → 草地 / 建筑基座 / 道路（逐格）
            → 广场 → 水域底 → 运动场地表 → 路缘石 → 标线 → 泥土过渡带
   整张地面预渲染成一张世界大图，运行时只贴可见区域。
   ========================================================= */

/* --- 2.0 地面配色（沿用 Demo 的色阶，保证与前作同一套色语） --- */
const GRASS_RAMP   = ["#437a33", "#4c883a", "#559241", "#5d9d49", "#68ab52"];
const ASPHALT_RAMP = ["#4b4b53", "#52525a", "#595961", "#606068"];
const PAVE_BASE = "#b3ada0", PAVE_A = "#a8a295", PAVE_B = "#bdb7a9";
const KERB_TOP = "#cbc7b8", KERB_LIT = "#b3af9f", KERB_DARK = "#8a8779";
const KERB_JOINT = "rgba(14,18,28,0.17)";
const DIRT      = "#8a7a5c";                  // 硬地与草地之间的泥土过渡
const DIRT_DARK = "#6f6247";
const OUT_BASE  = "#4a5340";                  // 校外：比草地暗、低饱和
const OUT_BLOCK = "#5f6672";                  // 校外示意城市楼
const FOUND     = "#9e9382";                  // 建筑基座（大半被精灵遮住）
const PLAZA_BASE = "#b5ab99";                 // 石头广场
const PLAZA_DARK = "#8d8374";

/* --- 2.1 校园总平面数据（PPT §5.1 全表，52 个，单位英寸） ---
   [名称, kind, x, y, w, h]；kind 决定地面分类与后续生成器。
   ※ 思源楼（#5）本身是冻结精灵，这里只用来占位与标定落位。 */
const CAMPUS = [
  /* ⚠️ 第三十三轮：第九教学楼整体南移 0.4500（5.0021 → 5.4521）。
     为什么要动它：第五教学楼进深 0.9000 → 1.3500（世界 352 → 528）之后，
     它的南缘从 4.9208 走到 5.3708，与九教北缘 5.0021 重叠 0.3687 in = 144 px。
     九教的 baseY 更大 ⇒ 绘制在五教之后 ⇒ **九教的屋面会盖掉五教整面南墙**。
     南移后两楼间距仍保持第三十二轮的 0.0813 in（31.8 px），九教南缘 6.2313
     距南界折线 6.3681 还有 53 px 余量（只是压到「南门入口广场」的铺装，可接受）。 */
  ["第九教学楼", "bld",     5.7583, 5.4521, 1.1514, 0.7792],
  ["草坪",       "grass",   4.6063, 5.0021, 0.4007, 0.7785],
  ["篮球场",     "bball",   8.8965, 2.6035, 0.6604, 1.0618],
  /* ⚠️ 水域（明湖）是**唯一一行与 PPT 不同**的：用户 2026-09-13 要求「把明湖进行缩小，
     将底部占整个明湖1/4的地方变成灰色石板路」。原 h = 1.0618 → 湖底 3.6653 in
     （正好是东西主路北缘）；现改为 0.7965 → 湖底 3.4000 in = 1328.01 px。
     3.4000 不是随手取的数，是**解出来的**：湖底必须落在 CELL(16) 边界 1328 上，
     否则最南那排水格会被下面那条 ARTERY 抢走，路缘石就会画进湖心。
     让出来的那一条（ARTERY「明湖南岸石板路」）与这一行**必须成对改**。 */
  ["水域",       "water",   7.0104, 2.6035, 0.6972, 0.7965],
  ["草坪",       "grass",   4.6056, 4.0208, 1.1528, 0.7799],
  ["思源楼",     "siyuan",  4.6056, 3.0889, 1.1521, 0.5764],
  ["思源东楼",   "bld",     5.8833, 3.2215, 0.9486, 0.4437],
  ["科学会堂",   "bld",     5.8833, 2.6035, 0.9486, 0.4854],
  ["草坪",       "grass",   4.6056, 2.5688, 1.1528, 0.4431],
  ["图书馆",     "library", 7.8861, 2.6035, 0.8931, 1.0618],
  ["第七教学楼", "bld",     5.8833, 4.0208, 0.6618, 0.4437],
  /* ⚠️ 第五教学楼的进深 = **0.9000**（第三十二轮，原 0.7806）。
     `y` 一个字不动 ⇒ **北缘仍在东西主路南缘上**（路 3.6653..4.0186，楼从 4.0208 起，
     只有 0.8px 缝）—— 往北一寸都动不了，所以"进深加大"只能**往南长**：
     南缘 4.8014 → **4.9208**（世界 1875.4 → 1922.0，+46.6px），
     南边最近的邻居是第九教学楼（北缘 5.0021 = 世界 1953.8，它的屋顶顶边实测 ≈1941），
     留出 ~19px 才不打架，这就是 0.9 的来历（再多就把影子糊到九教屋顶上了）。
     ⚠️ 改这一行 = 改 `addSolid` 的盒子与 §2 的 K.BLD 铺装范围 ⇒ **会重掷全校园散射**
        （§6.6 那颗地雷），唯一探针 `_propdiff.py`。
     为什么不是加宽：用户口径逐字 ——「楼长意味着是楼的竖直方向长度，不是楼高」，
        并在「加楼层 / **进深加大** / 两个都要」里选了进深加大。 */
  /* ⚠️ 第三十三轮：进深 0.9000 → 1.3500（世界 352 → 528，正好 ×1.5）。
     用户逐字 ——「楼不够长，给我长度扩大到现在的1.5倍，不管往哪扩给我解决了傻逼玩意」。
     北面离东西主路只剩 0.8 px（贴死），所以只能往南长 ⇒ 连带九教南移（见上一行注释）。 */
  ["第五教学楼", "bld",     6.6097, 4.0208, 0.5486, 1.3500],
  ["草坪",       "grass",   5.8833, 4.4993, 0.6618, 0.3014],
  ["草坪",       "grass",   7.4597, 4.0208, 1.3188, 0.4437],
  ["宿舍",       "bld",     7.4590, 4.5486, 1.3403, 0.2903],
  /* ⚠️ 中间这一行 ppt 上写的是「红果园餐厅」（`_pptshapes.py 1` 的 idx19），
     2026-09-27 第二十五轮按用户口径（「图书馆下边理论上是有三个宿舍的」）**改名**为
     「宿舍」—— **一处需向用户报备的偏离**：坐标一个字不动，只换楼名。
     撤回 = 把名字改回 `"红果园餐厅"`，见 parts/66_dormlib.js 文件头 §一。 */
  ["宿舍",       "bld",     7.4597, 4.9229, 1.3403, 0.2604],
  ["宿舍",       "bld",     7.4597, 5.2674, 1.3403, 0.2653],
  ["宿舍",       "bld",     7.4590, 5.7222, 0.6611, 0.4257],
  ["逸夫楼",     "bld",     9.0250, 4.0208, 1.6951, 0.6118],
  ["电气工程楼", "bld",     9.0250, 4.8007, 0.9708, 0.3007],
  ["机械实验馆", "bld",     9.0250, 5.2319, 0.9708, 0.3007],
  ["机械楼",     "bld",    10.0347, 4.8014, 0.6854, 0.7312],
  ["工程训练楼", "bld",    10.9667, 4.0208, 1.0764, 0.6118],
  ["光波楼",     "bld",    10.9667, 4.8007, 1.1514, 0.7319],
  ["18宿舍楼",   "bld",     7.8861, 1.7146, 0.8931, 0.5757],
  ["学生1食堂",  "bld",     7.8854, 0.9646, 0.8931, 0.5757],
  ["16宿舍楼",   "bld",     7.7958, 0.3319, 1.0190, 0.4583],
  ["运输实验馆", "bld",     6.3681, 0.3326, 1.3181, 1.2076],
  ["第八教学楼", "bld",     6.8139, 1.8049, 0.8938, 0.4854],
  ["第一教学楼", "bld",     5.8833, 1.8118, 0.8319, 0.4854],
  ["第二教学楼", "bld",     4.6056, 1.8049, 1.1792, 0.4854],
  ["新体育馆",   "bld",     2.8910, 0.3326, 1.4007, 1.2354],
  ["网球场",     "tennis",  2.8910, 1.7146, 1.4014, 0.5764],
  ["篮球场",     "bball",   2.2306, 0.3889, 0.5479, 1.9090],
  ["操场",       "track",   9.6743, 2.6035, 1.5056, 0.9993],
  ["操场",       "track",   1.0840, 0.3889, 1.0340, 1.9090],
  ["老体育馆",   "bld",     0.1271, 1.1389, 0.8444, 1.1528],
  ["计算机中心", "bld",     3.1125, 2.5688, 1.1792, 0.4854],
  ["思源西楼",   "bld",     3.1125, 3.2076, 1.1792, 0.4854],
  ["校史馆",     "bld",     3.1125, 4.0139, 1.1792, 0.2653],
  ["天佑会堂",   "bld",     3.1125, 4.7465, 1.1792, 0.4854],
  ["积秀园",     "bld",     3.1125, 4.3507, 1.1792, 0.2653],
  ["宿舍",       "bld",     3.1125, 5.3708, 1.1792, 0.4104],
  ["宿舍",       "bld",     1.5986, 5.9000, 1.1792, 0.4104],
  ["宿舍",       "bld",     1.5986, 5.3118, 1.1792, 0.4104],
  ["宿舍",       "bld",     1.5986, 4.7465, 1.1792, 0.4104],
  ["宿舍",       "bld",     1.5986, 4.1382, 1.1792, 0.4104],
  ["宿舍",       "bld",     1.5986, 3.6028, 1.1792, 0.4104],
  ["宿舍",       "bld",     1.5986, 3.0542, 1.1792, 0.4104],
  /* ⚠️ 第三十四轮：**改名**，`"宿舍"` → `"建筑艺术学院"`（坐标一个字不动）。
     用户逐字 ——「在老体育馆旁边的田径场下面那个是第一个宿舍楼，这个宿舍楼应该是
     建筑艺术楼标错了，给我复刻好，不用关会不会被遮挡，直接画」。
     这一行正是他指的那栋：`操场`（`["操场","track",1.0840,0.3889,…]`）的南边第一栋，
     西邻 `老体育馆`。改名会连带三处（都在本轮一并改了，见 build.py 的闸）：
       ① `60_assemble.js` 的 `styleOf` —— 名字不再命中 `/宿舍/`，会掉进最后的
          `{p:4, floors:3}` 兜底 ⇒ **必须**加一条专档（本轮加 5 层 / p:1）；
       ② `styleOf` 若不加档，楼会静默换成棕色 3 层（30 段模板跟着变），
          四套自动验收一个都看不出来；
       ③ 屋名标牌的文字跟着变（`_signCache` 多一条「建筑艺术学院」，
          verify.py 的 signs 由 28 变 29）。
     ⚠️ 撤回 = 名字改回 `"宿舍"` 并删掉 60 段那条专档 —— 立面由 parts/70_jianyi.js
        重绘，与楼名无关，所以撤名之后那栋楼仍是建艺楼的样子。 */
  ["建筑艺术学院", "bld",   1.5986, 2.5688, 1.1792, 0.4104],
  ["学生服务中心", "bld",   0.4535, 2.5132, 0.9493, 1.6799],
  ["宿舍",       "bld",     0.6542, 4.3507, 0.6972, 0.7514]
];

/* --- 2.2 围墙边界折线（PPT §5.3 顺时针闭合顺序，单位英寸） ---
   五个校门是这条折线上的**缺口**，但折线本身连续跨过缺口：
   玩家因此可以走到门口、却走不出校园。 */
const BOUND_IN = [
  [1.1319, 0.2500], [4.3534, 0.2500],                       // #65 北界西段
  [4.3132, 1.5403],                                         // #64 南下
  [4.5556, 1.6042],                                         // ~缺口 G5 北门~
  [6.3195, 1.6389],                                         // #63 北界中段
  [6.2847, 0.2569],                                         // #62 北上
  [8.8966, 0.2854],                                         // #61 北界东段
  [8.8486, 2.3118],                                         // #60 南下
  [8.8000, 2.5347],                                         // ~缺口 G4 东门~
  [11.3681, 2.5548],                                        // #59
  [11.8861, 3.6104],                                        // #58 斜向东南
  [12.1458, 3.9097],                                        // ~缺口 G3 东南门~
  [12.1527, 5.6319],                                        // #57 南下
  [8.2639, 5.6319],                                         // #56 西向
  [8.2646, 6.3959],                                         // #55 南下
  [5.3826, 6.3681],                                         // #54 西向
  [4.8820, 6.3750],                                         // ~缺口 G2 南门（主门）~
  [0.8681, 6.3750],                                         // #53 西向
  [0.0903, 2.5000],                                         // #52 斜向西北
  [0.0902, 2.2431],                                         // ~缺口 G1 西门~
  [0.0694, 1.1250],                                         // #67 北上
  [1.1459, 0.2361]                                          // #66 斜向东北 → 回到起点
];
const BOUND = BOUND_IN.map(p => [IX(p[0]), IX(p[1])]);

/* --- 2.3 五个校门（世界像素；门洞朝向见 dir） --- */
const GATES = [
  { id: "G1", name: "西门",     x: IX(0.0902), y: (IX(2.2431) + IX(2.5)) / 2, dir: "h", w: 100 },
  { id: "G2", name: "南门",     x: (IX(4.8820) + IX(5.3826)) / 2, y: IX(6.3750), dir: "v", w: 195 },
  { id: "G3", name: "东南门",   x: (IX(11.8861) + IX(12.1458)) / 2, y: (IX(3.6104) + IX(3.9097)) / 2, dir: "d", w: 168 },
  { id: "G4", name: "东门",     x: IX(8.8486), y: (IX(2.3118) + IX(2.5347)) / 2, dir: "h", w: 87 },
  { id: "G5", name: "北门",     x: (IX(4.3132) + IX(4.5556)) / 2, y: IX(1.6042), dir: "v", w: 94 }
];

/* --- 2.4 显式广场（石头铺装；接门 + 建筑前区） --- */
const PLAZA = [
  /* ⚠️ 曾经有过一条「思源楼前广场」，2026-09-13 按用户要求取缔（"思源楼门口的砖石路"）：
     它与东西主路在 PPT 数据里是同一块面积（y 3.6653..4.0208，比主路还多出 2px），
     铺装石板会平白把东西主路截断一截；而 PPT 渲染图上思源楼与草坪之间只有路、没有广场。
     删掉它 → 门口恢复成东西主路的沥青/水泥路面，也与主路标线贯通一致。 */
  { name: "南门入口广场",   x: IX(4.35), y: IX(6.02), w: IX(1.54), h: IX(0.36) },
  { name: "西门内广场",     x: IX(0.09), y: IX(2.2431), w: IX(1.09), h: IX(0.2569) },
  { name: "东门内广场",     x: IX(7.60), y: IX(2.3118), w: IX(1.25), h: IX(0.2229) },
  { name: "北门内广场",     x: IX(4.15), y: IX(1.60), w: IX(0.56), h: IX(0.41) },
  { name: "东南门内广场",   x: IX(11.40), y: IX(3.53), w: IX(0.75), h: IX(0.46) }
];

/* --- 2.5 显式主干道 ARTERY（保证 5 个门都能走到主路网，且主干道成环） ---
   cls: 2 = MAJOR（沥青 + 双黄中线 + 路缘石）；1 = MINOR（砖石铺装，无中线） */
const ARTERY = [
  /* 明湖南岸石板路 = 明湖缩小后让出来的那条（2026-09-13 用户要求，见 CAMPUS「水域」上方的注释）。
     与「水域」两行必须成对改：2.6035 + 0.7965 = 3.4000（新湖底），
     3.4000 + 0.2653 = 3.6653（原湖底 = 东西主路北缘）—— 一寸不多一寸不少。
     为什么用 ARTERY 而不是 PLAZA：ARTERY 是在 classifyFree 里**无条件盖章**的，
     与距离变换无关；这条带子 272×103 px，离最近的非留白格最远有 130 多 px，
     交给距离变换会被判成草坪（那就不是「灰色石板路」了）。
     cls 1 = 砖石铺装（与环湖那一圈同一种灰），不画中线、只砌路缘石。
     ⚠️ 必须排在东西主路**之前**：3.6653 那一行两段共用一格，要后盖的沥青赢，
        否则东西主路最北一排会变成砖石、还把白色外缘线压到砖上。 */
  { name: "明湖南岸石板路", x: IX(7.0104), y: IX(3.4000), w: IX(0.6972), h: IX(0.2653), cls: 1 },
  { name: "东西主路",   x: IX(3.1125), y: IX(3.6653), w: IX(8.25), h: IX(0.3533), cls: 2 },
  /* 草坪南横路 = PPT 里两块草坪之间那条空档（y 4.8007..5.0021，79px）。
     它把南门纵向接回南北主路，南门因此仍能上主干道网，而思源楼前的大草坪得以完整。
     ⚠️ 必须排在南门纵向、南北主路**之前**：西端与南北主路共占一格，
        后面的主干道后盖，交界格才会是沥青而不是砖石。 */
  { name: "草坪南横路", x: IX(4.6057), y: IX(4.8007), w: IX(1.2776), h: IX(0.2008), cls: 1 },
  { name: "南北主路",   x: IX(4.2933), y: IX(1.5872), w: IX(0.3124), h: IX(4.7864), cls: 2 },
  /* 南门纵向：西缘贴草坪#1 东缘（5.0070）、东缘对齐门洞东缘（5.3826），
     北端止于大草坪南缘（4.8007）—— 原位 4.8820/宽 0.5 会从南门笔直劈开
     思源楼正前方那块大草坪，看起来像个十字路口。 */
  { name: "南门纵向",   x: IX(5.0070), y: IX(4.8007), w: IX(0.3756), h: IX(1.5742), cls: 2 },
  { name: "西门横向",   x: IX(0.0902), y: IX(2.2431), w: IX(4.20), h: IX(0.2569), cls: 1 },
  { name: "东门横向",   x: IX(8.60), y: IX(2.3118), w: IX(0.46), h: IX(0.2229), cls: 1 },
  { name: "北门纵向",   x: IX(4.3315), y: IX(1.5410), w: IX(0.2229), h: IX(0.27), cls: 1 },
  { name: "东侧环路",   x: IX(8.8403), y: IX(2.5347), w: IX(0.1850), h: IX(3.10), cls: 1 },
  { name: "南侧环路",   x: IX(5.3826), y: IX(6.1450), w: IX(2.8813), h: IX(0.23), cls: 1 }
];

/* =========================================================
   2.6 占用位图 + 距离变换 → 自动推路网（核心算法）
   ---------------------------------------------------------
   PPT 只标了"有什么"，建筑之间的留白就是路。
   对留白格做「到最近非留白格」的距离变换 d：
       d <= 2.5 格  → 走廊（路）
       否则          → 开阔地（草坪）
   走廊宽度按 d 原样保留（**连续变化，不吸附到固定档**），
   只由宽度决定铺装与标线画法。
   ========================================================= */
const CELL = 16;
const NW = Math.ceil(WORLD_W / CELL);          // 326
const NH = Math.ceil(WORLD_H / CELL);          // 184  → 59,984 格

const K = { FREE: 0, BLD: 1, GRASS: 2, WATER: 3, TRACK: 4, BBALL: 5, TENNIS: 6, OUT: 7, PLAZA: 8, ROAD: 9 };
const CELLK   = new Uint8Array(NW * NH);
const ROADCLS = new Uint8Array(NW * NH);       // 0=小径 1=MINOR 2=MAJOR

/* 点在多边形内（射线法）。边界折线跨过 5 个门洞 → 走到门口也出不去。 */
function insideBoundary(x, y) {
  let hit = false;
  for (let i = 0, j = BOUND.length - 1; i < BOUND.length; j = i++) {
    const xi = BOUND[i][0], yi = BOUND[i][1], xj = BOUND[j][0], yj = BOUND[j][1];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
}

const KIND_TO_K = { bld: K.BLD, grass: K.GRASS, water: K.WATER, track: K.TRACK,
                    bball: K.BBALL, tennis: K.TENNIS, library: K.BLD, siyuan: K.BLD };

function buildOcc() {
  CELLK.fill(K.OUT);
  for (let cy = 0; cy < NH; cy++) {
    for (let cx = 0; cx < NW; cx++) {
      if (insideBoundary(cx * CELL + CELL / 2, cy * CELL + CELL / 2)) CELLK[cy * NW + cx] = K.FREE;
    }
  }
  for (const [, kind, x, y, w, h] of CAMPUS) {
    const k = KIND_TO_K[kind];
    stampRect(x, y, w, h, k);
  }
  for (const p of PLAZA) stampRectAbs(p.x, p.y, p.w, p.h, K.PLAZA);
}

function stampRect(x, y, w, h, k) {            // 英寸输入
  stampRectAbs(IX(x), IX(y), IX(w), IX(h), k);
}
function stampRectAbs(x, y, w, h, k) {
  const c0 = Math.max(0, Math.floor(x / CELL)), c1 = Math.min(NW - 1, Math.floor((x + w) / CELL));
  const r0 = Math.max(0, Math.floor(y / CELL)), r1 = Math.min(NH - 1, Math.floor((y + h) / CELL));
  for (let cy = r0; cy <= r1; cy++)
    for (let cx = c0; cx <= c1; cx++) CELLK[cy * NW + cx] = k;
}

/* 两遍 chamfer 距离变换（3-4 权重）= 到最近非留白格的距离 */
function distanceTransform() {
  const INF = 1e9;
  const d = new Float32Array(NW * NH);
  for (let i = 0; i < d.length; i++) d[i] = CELLK[i] === K.FREE ? INF : 0;
  for (let y = 0; y < NH; y++) {
    for (let x = 0; x < NW; x++) {
      const i = y * NW + x;
      if (d[i] === 0) continue;
      let m = d[i];
      if (x > 0)              m = Math.min(m, d[i - 1] + 3);
      if (y > 0)              m = Math.min(m, d[i - NW] + 3);
      if (x > 0 && y > 0)     m = Math.min(m, d[i - NW - 1] + 4);
      if (x < NW - 1 && y > 0) m = Math.min(m, d[i - NW + 1] + 4);
      d[i] = m;
    }
  }
  for (let y = NH - 1; y >= 0; y--) {
    for (let x = NW - 1; x >= 0; x--) {
      const i = y * NW + x;
      if (d[i] === 0) continue;
      let m = d[i];
      if (x < NW - 1)                 m = Math.min(m, d[i + 1] + 3);
      if (y < NH - 1)                 m = Math.min(m, d[i + NW] + 3);
      if (x < NW - 1 && y < NH - 1)   m = Math.min(m, d[i + NW + 1] + 4);
      if (x > 0 && y < NH - 1)        m = Math.min(m, d[i + NW - 1] + 4);
      d[i] = m;
    }
  }
  return d;
}

/* 留白 → 走廊 / 开阔地；再叠加显式主干道
   ROADBAND 越小，楼间留白越容易长出草地（校园才不至于一片水泥）。 */
const ROADBAND = 1.55 * CELL;                  // ≈25 px ≈ 2.8 m（人行道尺度）
function classifyFree(d) {
  for (let i = 0; i < CELLK.length; i++) {
    if (CELLK[i] !== K.FREE) continue;
    const dpx = d[i] * CELL / 3;               // chamfer 权重 → 像素
    if (dpx <= ROADBAND) {
      CELLK[i] = K.ROAD;
      ROADCLS[i] = dpx * 2 >= ROADBAND ? 1 : 0; // 靠中间铺砖石，贴墙铺混凝土
    } else {
      CELLK[i] = K.GRASS;
    }
  }
  for (const a of ARTERY) {
    const c0 = Math.max(0, Math.floor(a.x / CELL)), c1 = Math.min(NW - 1, Math.floor((a.x + a.w) / CELL));
    const r0 = Math.max(0, Math.floor(a.y / CELL)), r1 = Math.min(NH - 1, Math.floor((a.y + a.h) / CELL));
    for (let cy = r0; cy <= r1; cy++)
      for (let cx = c0; cx <= c1; cx++) {
        CELLK[cy * NW + cx] = K.ROAD;
        ROADCLS[cy * NW + cx] = a.cls;
      }
  }
}

/* =========================================================
   2.7 烘焙
   ========================================================= */
function buildGround() {
  const c = mkCanvas(WORLD_W, WORLD_H);
  const g = c.getContext("2d");
  const rng = makeRng(20260912);
  const nA = makeNoise(9137, Math.ceil(WORLD_W / 96) + 2, Math.ceil(WORLD_H / 96) + 2);
  const nB = makeNoise(4471, Math.ceil(WORLD_W / 40) + 2, Math.ceil(WORLD_H / 40) + 2);
  const nR = makeNoise(3391, Math.ceil(WORLD_W / 42) + 2, Math.ceil(WORLD_H / 42) + 2);

  paintOutside(g, rng);                        // 1) 校外底（先铺满，校内会被覆盖）
  paintCells(g, rng, nA, nB, nR);              // 2) 草地 / 基座 / 道路
  paintPlazas(g, rng);                         // 3) 广场
  paintLibraryPlaza(g, rng);                   // 3b) 图书馆三角广场            [36_library]
  paintWaterBase(g, rng);                      // 4) 水域静态底                [45_water]
  paintTracks(g, rng);                         // 5) 操场                      [37_sports]
  paintCourts(g, rng);                         // 6) 篮球场 / 网球场            [37_sports]
  paintGateAprons(g, rng);                     // 7) 校门车行道 + 斑马线
  paintKerbs(g, rng);                          // 8) 路缘石
  paintMarkings(g, rng);                       // 9) 标线
  paintManholes(g, rng);                       // 9b) 井盖                  [48_ground_detail]
  paintWear(g, rng);                           // 9c) 斑马线磨损 + 车辙      [48_ground_detail]
  paintDirt(g, rng);                           // 10) 泥土过渡带
  paintWalls(g, rng);                          // 11) 围墙（最后画，压在土带之上）[46_walls]
  /* 12) 观众席 + 扇形检阅台 [37_sports §3.7.8，第四十七轮 2026-10-10]
     ⚠️ **故意排在最后一步**（而操场本身排在第 5 步）：看台压在老体育馆楼前那条
        人行道的路缘石上（那条路缘石是第 8 步 paintKerbs 画的），排在它后面就
        不用像 §2.7.5 那样给路缘石加豁免 —— 顺序本身解决了覆盖问题。
     本步不消耗 rng（37 段的函数一次 rng() 都不调），所以后面没有步骤会被它平移。 */
  paintGrandstand(g);
  return c;
}

/* --- 2.7.1 校外：低饱和底色 + 45° 街区纹理 + 零散灰色小方块 --- */
function paintOutside(g, rng) {
  const S = 128, tile = mkCanvas(S, S), tg = tile.getContext("2d");
  px(tg, 0, 0, S, S, OUT_BASE);
  for (let off = -S; off <= S; off += 32) {    // 45° 斜线（128 = 4×32 → 可无缝平铺）
    for (let i = 0; i < S; i += 4) {
      const x0 = off + i;
      if (x0 >= 0 && x0 < S) px(tg, x0, i, 2, 4, shade(OUT_BASE, -0.16));
    }
  }
  for (let i = 0; i < 5; i++)                  // 零散灰块：示意城市楼
    px(tg, ((rng() * S) | 0), ((rng() * S) | 0), 8 + ((rng() * 14) | 0), 6 + ((rng() * 12) | 0), OUT_BLOCK);
  const pat = g.createPattern(tile, "repeat");
  g.fillStyle = pat;
  g.fillRect(0, 0, WORLD_W, WORLD_H);
}

/* --- 2.7.2 逐格：草地 / 建筑基座 / 道路 --- */
function paintCells(g, rng, nA, nB, nR) {
  const B = CELL;
  for (let cy = 0; cy < NH; cy++) {
    for (let cx = 0; cx < NW; cx++) {
      const i = cy * NW + cx, k = CELLK[i];
      if (k === K.OUT) continue;               // 校外已铺好
      const x = cx * B, y = cy * B;
      const w = Math.min(B, WORLD_W - x), h = Math.min(B, WORLD_H - y);

      if (k === K.GRASS || k === K.TRACK || k === K.BBALL || k === K.TENNIS || k === K.WATER) {
        /* ⚠️ 运动场地/水域也要先铺草底：paintOutside 是整幅铺满的，
           这些格子若不铺底，跑道椭圆四角会漏出"校外纹理"。 */
        paintGrassCell(g, rng, nA, nB, x, y, w, h, B);
      } else if (k === K.ROAD) {
        paintRoadCell(g, rng, nR, x, y, w, h, ROADCLS[i]);
      } else if (k === K.BLD) {
        /* 建筑轮廓内：铺"楼前硬地"。楼体精灵会压住南半边，
           露出来的北半边读作前庭/消防通道，而不是一块空白基座。 */
        paintRoadCell(g, rng, nR, x, y, w, h, 0);
        px(g, x, y, w, h, "rgba(80,72,58,0.10)");
      } else if (k === K.PLAZA) {
        continue;                              // 广场由 paintPlazas 统一画
      }
    }
  }
}

/* 草地：世界坐标 8px 子格采样 fbm → 连续渐变（逐格单色会留下 16px 方块感） */
function paintGrassCell(g, rng, nA, nB, x, y, w, h, B) {
  let vmid = 0;
  for (let sy = 0; sy < h; sy += 8)
    for (let sx = 0; sx < w; sx += 8) {
      const sw = Math.min(8, w - sx), sh = Math.min(8, h - sy);
      let v = fbm2(nA, nB, (x + sx) / 96, (y + sy) / 96);
      v = clamp((v - 0.5) * 2.0 + 0.5, 0, 1);
      vmid += v;
      px(g, x + sx, y + sy, sw, sh, GRASS_RAMP[Math.min(4, Math.floor(v * 5))]);
    }
  const base = GRASS_RAMP[Math.min(4, Math.floor((vmid / 4) * 5))];
  const dark = shade(base, -0.22), lit = shade(base, 0.22);
  const nGrass = Math.max(2, ((w * h) / 85) | 0);
  for (let n = 0; n < nGrass; n++) {                 // 草叶成簇：下段暗、顶端亮
    const gx = (x + 2 + rng() * (B - 6)) | 0, gy = (y + 4 + rng() * (B - 8)) | 0;
    px(g, gx, gy, 1, 4, dark);
    px(g, gx, gy - 1, 1, 2, lit);
    if (rng() < 0.14) px(g, gx, gy + 1, 1, 1, "#e8d76a");    // 小黄花
  }
}

/* 道路：cls 2 = 沥青（主干道），1 = 砖石铺装，0 = 混凝土小径
   ※ 颜色一律按世界坐标 8px 子格采样噪声 —— 逐格单色会留下 16px 方块感。 */
function paintNoiseCell(g, x, y, w, h, nR, scale, ramp, mixers) {
  for (let sy = 0; sy < h; sy += 8)
    for (let sx = 0; sx < w; sx += 8) {
      const sw = Math.min(8, w - sx), sh = Math.min(8, h - sy);
      const v = noiseAt(nR, (x + sx) / scale, (y + sy) / scale);
      px(g, x + sx, y + sy, sw, sh, mixers ? mix(mixers[0], mixers[1], v) : ramp[Math.min(ramp.length - 1, Math.floor(v * ramp.length))]);
    }
}
function paintRoadCell(g, rng, nR, x, y, w, h, cls) {
  if (cls === 2) {
    paintNoiseCell(g, x, y, w, h, nR, 46, ASPHALT_RAMP);
    speckle(g, x, y, w, h, "rgba(255,255,255,0.045)", 3, rng);
    speckle(g, x, y, w, h, "rgba(0,0,0,0.07)", 3, rng);
  } else if (cls === 1) {
    paintNoiseCell(g, x, y, w, h, nR, 42, null, [PAVE_A, PAVE_B]);
    /* 逐砖色差（16×8 一块）[48_ground_detail]：原来只有 42px 尺度的整体色斑，
       1× 下人行道是一片平色，"砖"读不出来。色调走**世界砖号的哈希**（brickTone）
       而不是 rng —— 一块砖常横跨两个 CELL，各格各画，rng 会在格边界留接缝。
       55% 半透明叠加，底下的噪声仍然透得出来。 */
    for (let by = (y / 8) | 0; by <= ((y + h - 1) / 8) | 0; by++) {
      const cy2 = Math.max(y, by * 8), bh2 = Math.min(y + h, by * 8 + 8) - cy2;
      if (bh2 <= 0) continue;
      for (let bx = (x / 16) | 0; bx <= ((x + w - 1) / 16) | 0; bx++) {
        const cx2 = Math.max(x, bx * 16), bw2 = Math.min(x + w, bx * 16 + 16) - cx2;
        if (bw2 <= 0) continue;
        px(g, cx2, cy2, bw2, bh2, rgba(shade(PAVE_B, (brickTone(bx, by) - 0.5) * 0.30), 0.55));
      }
    }
    for (let yy = y; yy < y + h; yy += 8)        // 砖缝（世界坐标对齐，跨格不断缝）
      px(g, x, ((yy / 8) | 0) * 8, w, 1, "rgba(14,18,28,0.10)");
    for (let xx = x; xx < x + w; xx += 16)
      px(g, ((xx / 16) | 0) * 16, y, 1, h, "rgba(14,18,28,0.07)");
  } else {
    /* 小径：整块现浇混凝土 + 16px 分格缝（与广场的 32px 石板明显区分） */
    paintNoiseCell(g, x, y, w, h, nR, 60, null, ["#b6b0a3", "#c3bdaf"]);
    for (let yy = y; yy < y + h; yy += 16)
      px(g, x, ((yy / 16) | 0) * 16, w, 1, "rgba(14,18,28,0.15)");
    for (let xx = x; xx < x + w; xx += 16)
      px(g, ((xx / 16) | 0) * 16, y, 1, h, "rgba(14,18,28,0.11)");
    speckle(g, x, y, w, h, "rgba(0,0,0,0.07)", 3, rng);
    speckle(g, x, y, w, h, "rgba(255,255,255,0.05)", 2, rng);
  }
}

/* --- 2.7.3 广场：石头铺装（32px 方板 + 明暗交错 + 灰缝） --- */
function paintPlazas(g, rng) {
  for (const p of PLAZA) {
    px(g, p.x, p.y, p.w, p.h, PLAZA_DARK);                       // 缝色打底
    for (let y = p.y; y < p.y + p.h; y += 32)
      for (let x = p.x; x < p.x + p.w; x += 32) {
        const k = (rng() - 0.5) * 0.34;
        const cw = Math.max(1, Math.min(30, p.x + p.w - x - 1));
        const ch = Math.max(1, Math.min(30, p.y + p.h - y - 1));
        px(g, x + 1, y + 1, cw, ch, shade(PLAZA_BASE, k));
        px(g, x + 1, y + 1, cw, 1, shade(PLAZA_BASE, k + 0.10));  // 板面上棱微受光
        px(g, x + 1, y + ch, cw, 1, "rgba(14,18,28,0.14)");
        if (rng() < 0.22) px(g, x + 4 + rng() * 22, y + 4 + rng() * 22, 2, 2, "rgba(14,18,28,0.13)");
      }
    px(g, p.x, p.y, p.w, 2, shade(PLAZA_BASE, 0.26));            // 上缘受光
    px(g, p.x, p.y + p.h - 3, p.w, 3, shade(PLAZA_BASE, -0.34)); // 下缘背光
    px(g, p.x, p.y, 2, p.h, shade(PLAZA_BASE, 0.12));
    px(g, p.x + p.w - 2, p.y, 2, p.h, shade(PLAZA_BASE, -0.24));
  }
}

/* --- 2.7.4 校门：内外各铺 60px 车行道 + 白色斑马线 ---
   ⚠️ G2（南门）**整块跳过** —— 用户 2026-09-13 先要求「南门的人行横道去掉」，
      紧接着要求「把南门的灰色长方形路段去掉」：那块 60×240 的沥青垫层从南门入口广场
      一直铺到南墙外 ≈113px 的草地上，像一条凭空穿过围墙的灰走廊（_gview 截图里
      一眼就能看到它悬在草地上），已经不是"路"了。跳过它 → 南门门洞里外只剩
      南门纵向的沥青路面与南门入口广场的石板，干净。
      本函数不消耗任何 rng()，跳过哪个门都不会挪动后面 paintWear / paintDirt /
      paintWalls 的随机流（这三段共用同一条流，挪一格整片地面就换了张脸）。 */
function paintGateAprons(g, rng) {
  for (const gt of GATES) {
    if (gt.id === "G3") continue;              // 东南门是斜的，由围墙模块单独处理
    if (gt.id === "G2") continue;              // 南门：车行道垫层与斑马线都不要
    const L = 120;
    if (gt.dir === "h") {
      px(g, gt.x - L, gt.y - 30, L * 2, 60, ASPHALT_RAMP[1]);
      for (let i = -4; i <= 4; i++)
        px(g, gt.x + i * 22 - 4, gt.y - 26, 8, 52, "rgba(240,240,235,0.55)");
    } else {
      px(g, gt.x - 30, gt.y - L, 60, L * 2, ASPHALT_RAMP[1]);
      for (let i = -4; i <= 4; i++)
        px(g, gt.x - 26, gt.y + i * 22 - 4, 52, 8, "rgba(240,240,235,0.55)");
    }
  }
}

/* --- 2.7.5 路缘石：路与非路的交界处 ---
   ⚠️ 第四十六轮（2026-10-10）：**运动场地（跑道 / 球场）范围内一律不砌路缘石**。
      起因：生成器给自由空间分出的那条南北向马路（x 3456..3536），与校园东侧
      **篮球场**那块地（x 3475 起）有 61px 重叠 ⇒ 路缘石会从四块场地的正中间
      竖着穿过去（蓝地胶上一条米色竖线，非常扎眼）。
      场地是"地胶"不是路，本来就不该有路缘石 ⇒ 格子与场地块**只要有交叠**就跳过。
      （用"格子中心落在场地里"判，会在场地上下缘各留 7~8px 的路缘石小尾巴。）
      三类场地一律豁免：另两处（跑道 / 网球场）本来就不与马路重叠，跳不跳画面
      完全一样 —— 这一条是零风险的。
      ⚠️ 本函数不消耗 rng：跳到哪个格子都不会挪动后面 paintWear / paintDirt /
         paintWalls 的随机流。 */
const _courtHit = (x, y) => CAMPUS.some(c =>
  (c[1] === "track" || c[1] === "bball" || c[1] === "tennis") &&
  x + CELL > IX(c[2]) && x < IX(c[2] + c[4]) &&
  y + CELL > IX(c[3]) && y < IX(c[3] + c[5]));

function paintKerbs(g, rng) {
  const isRoad = i => i >= 0 && i < CELLK.length && CELLK[i] === K.ROAD;
  for (let cy = 0; cy < NH; cy++) {
    for (let cx = 0; cx < NW; cx++) {
      const i = cy * NW + cx;
      if (CELLK[i] !== K.ROAD) continue;
      if (ROADCLS[i] === 0) continue;                        // 小径不砌路缘石
      const x = cx * CELL, y = cy * CELL;
      if (_courtHit(x, y)) continue;              // ★ 第四十六轮：场地里不砌路缘石
      const north = cy > 0 && !isRoad(i - NW), south = cy < NH - 1 && !isRoad(i + NW);
      const west  = cx > 0 && !isRoad(i - 1),  east  = cx < NW - 1 && !isRoad(i + 1);
      if (north) { px(g, x, y, CELL, 3, KERB_TOP); px(g, x, y + 3, CELL, 1, KERB_DARK); }
      if (south) { px(g, x, y + CELL - 3, CELL, 3, KERB_LIT); px(g, x, y + CELL - 4, CELL, 1, KERB_DARK); }
      if (west)  { px(g, x, y, 3, CELL, KERB_TOP); px(g, x + 3, y, 1, CELL, KERB_DARK); }
      if (east)  { px(g, x + CELL - 3, y, 3, CELL, KERB_LIT); px(g, x + CELL - 4, y, 1, CELL, KERB_DARK); }
    }
  }
}

/* --- 2.7.6 标线：主干道双黄中线 + 车行道外缘白实线 ---
   ⚠️ 广场与主干道在 PPT 数据里是同一块面积，广场是后画的，所以标线必须绕开广场
      —— 否则一条双黄线会横穿石板地。（"思源楼前广场"已取缔，此坑只剩南门入口广场。） */
const _plazaHit = (x, y) => PLAZA.some(p => x >= p.x - 2 && x <= p.x + p.w + 2 && y >= p.y - 2 && y <= p.y + p.h + 2);
function paintMarkings(g, rng) {
  const YEL = "#d8c34a";
  for (const a of ARTERY) {
    if (a.cls !== 2) continue;
    const horiz = a.w >= a.h;
    if (horiz) {
      const y = Math.round(a.y + a.h / 2);
      dashLine(g, a.x + 12, a.x + a.w - 12, y - 4, 1, YEL, rng);
      dashLine(g, a.x + 12, a.x + a.w - 12, y + 3, 1, YEL, rng);
      dashLine(g, a.x, a.x + a.w, a.y + 7, 2, "rgba(240,240,235,0.50)", rng);        // 外缘白线
      dashLine(g, a.x, a.x + a.w, a.y + a.h - 9, 2, "rgba(240,240,235,0.50)", rng);
    } else {
      const x = Math.round(a.x + a.w / 2);
      dashLineV(g, a.y + 12, a.y + a.h - 12, x - 4, 1, YEL, rng);
      dashLineV(g, a.y + 12, a.y + a.h - 12, x + 3, 1, YEL, rng);
      dashLineV(g, a.y, a.y + a.h, a.x + 7, 2, "rgba(240,240,235,0.50)", rng);
      dashLineV(g, a.y, a.y + a.h, a.x + a.w - 9, 2, "rgba(240,240,235,0.50)", rng);
    }
  }
}
/* 实线：整段画 + 广场处断开（用短段拼，避免长线穿过石板地） */
function solidH(g, x0, x1, y, th, col) {
  for (let x = x0; x < x1; x += 8)
    if (!_plazaHit(x + 4, y + th / 2)) px(g, x, y, Math.min(8, x1 - x), th, col);
}
function solidV(g, y0, y1, x, th, col) {
  for (let y = y0; y < y1; y += 8)
    if (!_plazaHit(x + th / 2, y + 4)) px(g, x, y, th, Math.min(8, y1 - y), col);
}
function dashLine(g, x0, x1, y, th, col, rng) {
  for (let x = x0; x < x1; x += 26) {
    if (rng() < 0.14) continue;                                 // 磨损缺口
    if (_plazaHit(x + 8, y + th / 2)) continue;                 // 广场上不画
    px(g, x, y, Math.min(16, x1 - x), th, col);
  }
}
function dashLineV(g, y0, y1, x, th, col, rng) {
  for (let y = y0; y < y1; y += 26) {
    if (rng() < 0.14) continue;
    if (_plazaHit(x + th / 2, y + 8)) continue;
    px(g, x, y, th, Math.min(16, y1 - y), col);
  }
}

/* --- 2.7.7 泥土过渡带：硬地与草地之间不做硬切 --- */
function paintDirt(g, rng) {
  const isRoad = i => i >= 0 && i < CELLK.length && CELLK[i] === K.ROAD;
  const grit = "rgba(90,78,54,0.55)";
  for (let cy = 0; cy < NH; cy++) {
    for (let cx = 0; cx < NW; cx++) {
      const i = cy * NW + cx;
      if (CELLK[i] === K.ROAD || CELLK[i] === K.OUT) continue;
      if (CELLK[i] !== K.GRASS) continue;
      const x = cx * CELL, y = cy * CELL;
      const band = mix(DIRT, GRASS_RAMP[0], 0.45);
      if (cy > 0 && isRoad(i - NW)) { px(g, x, y, CELL, 3, band); speckle(g, x, y, CELL, 6, grit, 14, rng); }
      if (cy < NH - 1 && isRoad(i + NW)) { px(g, x, y + CELL - 3, CELL, 3, band); speckle(g, x, y + CELL - 6, CELL, 6, grit, 14, rng); }
      if (cx > 0 && isRoad(i - 1)) { px(g, x, y, 3, CELL, band); speckle(g, x, y, 6, CELL, grit, 14, rng); }
      if (cx < NW - 1 && isRoad(i + 1)) { px(g, x + CELL - 3, y, 3, CELL, band); speckle(g, x + CELL - 6, y, 6, CELL, grit, 14, rng); }
    }
  }
}

/* 供场景装配使用 */
buildOcc();
classifyFree(distanceTransform());
