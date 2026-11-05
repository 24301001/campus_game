/* =========================================================
   §5.17 第七教学楼：正面按用户给的照片**覆盖重绘**
   ---------------------------------------------------------
   用户口径（第二十九轮，逐字）：

     「回到校园地图项目，我新加了一个关于第七教学楼的图片，依据图片精准还原出
       第七教学楼。首先找到第七教学楼的位置」

   位置已找到并汇报过：`20_ground.js` 的 CAMPUS 第 10 行
      ["第七教学楼", "bld", 5.8833, 4.0208, 0.6618, 0.4437]
   ⇒ 世界像素 2298.1 / 1570.5 / 258.5 × 173.3；`styleOf` 走
      `/教学楼/ → { p: 0, floors: 4 }`（米白档、4 层）。

   ## 楼高：用户拍板「保持地图现有高度」
   追问楼高时用户在三个候选里选了**保持地图现有高度**，选项原文：
     「楼高、占地、碰撞盒一个字节不动，跟旁边第五教学楼齐平，对全校园零影响。」

   ⇒ 本段与 61/65/67 那三轮有一条**根本不同**：**画布同高**。
     立面高 = styleOf 的 4 层 = 136 行 = `roofT` 反解出来的那 136 行
     ⇒ 几何简化，`b.ay` 也完全不动（仍是 258）。

   ## 唯一的几何权威 = 那张照片
   `..\预览\第七教学楼.png`，1792 × 1344，**正射正立面**（无透视）⇒ 照片上的像素
   比例即真实比例。量图工具 = `_build/_qjmeasure.py`（只读）。

   | 构件 | 照片 y（px） | 说明 |
   |---|---|---|
   | 门楼顶 | 305 | 比两翼檐口高 53 px |
   | 檐口带 | 374 ~ 420 | 灰；上面 368 有一条暗线 |
   | 砖红立面 | 422 ~ 926 | 被 **3 条细灰带**切开 |
   | 细灰横带 | 540~552 / 680~688 / 830~836 | **薄**（只 8~13 px，不是"厚腰带"） |
   | 墙裙 | 930 ~ 950 | 灰 |
   | 地面线（散水） | 950 | 台阶 960~990 在它外面 |

   窗：**宽 72 px × 高 60~77 px**，且**贴在该层砖带的顶端** ——
   砖带 422~536、窗 424~500 ⇒ 窗上方只剩 2 px 砖（这一条改过一版：
   最初按"窗居中于楼层"画，逐列色带一量就推翻了）。
   分格 = **左大扇 + 右窄扇 + 顶部亮子**（`_look/_r29_photocrop.png` 放大看）：
   一条竖挺在 70% 处、一条横挺在 26% 高处，横挺通到两边、竖挺只走横挺以下。
   开间（照片）左翼 145、右翼 152；窗与窗之间的竖带上**灰竖柱居中**
   （实测灰柱 18 px、两侧砖各 ~30 px）。

   ## 两个"换算"（在 `qjGeo` 里现算，**不存第二份**）
        sc = 立面宽 / 照片宽     = 258 / 1792 = 0.14397   （照片 x → 精灵 x）
        sv = 立面高 / 檐口到地面 = 136 / 592  = 0.22973   （照片 y → 精灵行）
   两个比例**不相等**（差 1.596 倍），这**不是**笔误 —— 见「偏离①」。

   ## 与 30 段的关系：几乎全在 eaveY 以下
   砖墙、灰横带、灰竖柱、窗、门楼、卷帘门、匾额、台阶 —— 全部落在
   `[eaveY, baseY] = [122, 258]`；**唯一**越过 eaveY 的是门楼顶（升到第 110 行）。
   ⇒ 屋面（第 20~121 行）除了 §5.17.7 那一小块补板面之外**不动**。

   ## 为什么仍然要换一张新画布（与 67 段同法）
   67 段换画布是因为立面高 153 ≠ 136。本段画布同高，但仍然换 —— 理由换了：
   **旧画布在 `[baseY, H)` 那一段留着 30 段的旧台阶**（`baseY + i*3 - 2`，
   i = 0..2 ⇒ 第 256~265 行），而旧的方向性投影已经在第 234~279 行上。
   在同一条画布上重画 ⇒ 投影叠第二遍（深一倍）、旧台阶留在底下。
   ⇒ 照 67 段：**新画布，只 `drawImage` 旧画布的 `[0, eaveY)` 行**，
     然后在新画布上从零画投影 + 立面 + 台阶 + 接地带。
     尺寸一样、`b.ay` 一样 ⇒ 画面上这栋楼的位置与改前逐像素一致。

   ## 已知代价 / 必须报备的偏离（交付说明里要写）
   ① **横向被压缩 1.6 倍** —— 照片左右被裁断，而地图给它的 footprint 只有
      258.5 世界像素（≈28.7 m）。要"左 4 + 右 4 个开间 + 中央门楼"全部进来，
      只能把照片整幅压到 258：开间 20~22 行、窗宽 11 行。
      **代价**：这栋楼在画面上比真实比例"矮胖"一档。
      改法只有一条 —— 动 CAMPUS 的 footprint 宽，那会连带 `addSolid` 的世界坐标，
      **重掷全校园散射**（§6.6 那颗地雷）⇒ 不做。
   ② **匾额被放大 2 倍多** —— 照片上那块匾只有 170 × 40 px（每个字折算到精灵上
      只有 **4.9 行**，物理上画不出来）。照九教那条先例（「10 字挤 82 px，
      糊是物理上限」）把板放宽到"五个字各约 9 行、缝 1 行"。**刻意的**，不是量错。
   ③ **窗高取 15 行** —— 照片折算 13.8~17.7 行，取区间中值，与 `FLOOR_H = 34`
      的楼层配得上（窗 15 + 砖 12~16 + 灰带 3）。
   ④ **窗户统一成"左大扇 + 右窄扇 + 顶部亮子"** —— 照片里各层窗的格数并不
      完全统一（个别窗多一条竖挺），取出现最多的那一款当全楼通例。
   ⑤ **⑨号屋名牌必须撤** —— 门楼顶（第 110 行）正好压住 30 段那块牌子
      （挂在第 87~113 行）。名字已经在门楼的匾额上（与 59/61/63/65/67 段同一处理）。
      撤完照 67 段的先例**按同一支笔补回板面**（§5.17.7 逐个色号抄 30 段 §3.2）。
      ⚠️ 67 段在这里栽过：拿 `pal.roof` **本色**补 ⇒ 屋面上一块 117×34 的**亮斑**。
        本段补的是 `shade(pal.roof, -0.04)` —— 与 30 段 §3.2 那一笔逐字相同。
   ========================================================= */

/* --- 5.17.1 常量 ----------------------------------------------------------- */
const QJ_NAME   = "第七教学楼";              // ⚠️ 必须与 CAMPUS 里的名字逐字相同
const QJ_PADX   = 26, QJ_PADT = 18;          // 与 30 段同值
const QJ_PADB   = 21 + 14;                   // SHY + 14 —— 30 段画布高公式的尾巴
const QJ_FLOORS = 4;                         // ⚠️ 必须等于 styleOf("第七教学楼").floors
const QJ_SHADOW_H = 24;                      // 照 30 段 §3.1 的 min(24, depth·0.3)（进深 173.3 ⇒ 24）
/* 照片标定（唯一权威，见文件头） */
const QJ_PW     = 1792;                      // 照片宽（px）
const QJ_GY     = 950;                       // 照片上"地面线"（散水）那一行
const QJ_RISE   = 592;                       // 檐口带顶(358) → 地面(950) 的行数 = 立面高
const QJ_PORCH  = [596, 1190];               // 门楼 x 范围（照片 px）
const QJ_DOOR   = [815, 970];                // 卷帘门 x 范围（照片 px）
const QJ_STEPX  = [765, 1060];               // 台阶 x 范围（照片 px）
const QJ_PTOP   = 305;                       // 门楼顶（照片 y）
const QJ_EAVE_Y = 374;                       // 檐口带顶（照片 y）
const QJ_COPEY  = 420;                       // 檐口带底（照片 y）—— 下面就是砖
/* ⚠️ **本段的竖向标定只有下面这四行** —— 砖带不是"表"，是它们之间的缝（qjGeo 现算）。
   不另存"每层砖带顶/底"那种表 ⇒ 结构上不可能出现"砖带底跑到砖带顶上面"。
   ⚠️ 照片 y 是**向下**增大的，所以这几张表一律**自下而上**写；第一版把"每层砖带的底"
      按照片从上往下抄成 `[540,680,830,926]`，而"砖带顶"却是自下而上 `[840,692,556,424]`
      —— 两张表方向相反，第 1、2 层的砖带底（163/195）落到砖带顶（233/199）**上面**，
      `fillRect` 拿到负高度画了个空，墙裙却从第 164 行一路吃到第 257 行
      ⇒ 整面砖墙糊成一片灰。三套自动验收全绿（它们不看画面），只有出图看得见。 */
/* 三条细灰横带（照片 y，自下而上）：[上沿, 下沿] */
const QJ_GBAND_PY = [[830, 836], [680, 688], [542, 552]];
const QJ_PLIN_PY  = 930;                     // 墙裙顶（照片 y）
/* 开间中心（照片 x）：左翼 4 个、右翼 4 个 */
const QJ_BAY_L  = [139, 278, 417, 556];
const QJ_BAY_R  = [1240, 1400, 1560, 1715];
/* 雨水管（照片 x，实测三根） */
const QJ_PIPE_X = [480, 1470, 1630];
const QJ_WIN_H  = 15;                        // 窗高（行）—— 见文件头"偏离③"
const QJ_WIN_W  = 11;                        // 窗宽（行）—— 实测 72 px × sc = 10.4
const QJ_PIL_W  = 3;                         // 灰竖柱宽（行）—— 照片实测 18 px × sc = 2.6
                                             // ⚠️ 第一版取 4：同色灰度下一根柱子显得比照片粗一圈，
                                             //    与旁边细灰横带并排像"两层皮"。3 行才对得上。
/* 空调外机（照片上散在各层窗下）：[开间中心(照片 x), 层号 0=底] */
const QJ_AIR    = [[139, 3], [417, 3], [278, 2], [139, 2], [556, 0],
                   [1400, 3], [1715, 3], [1240, 2], [1560, 2], [1400, 0]];
const QJ_AIR_W  = 9, QJ_AIR_H = 8;

/* --- 5.17.2 调色：**照片的实测色** -----------------------------------------
   ⚠️ 本段**不拿 `pal` 推颜色**（与 65/67 段同规矩）：色号全部来自照片实测
      （`_qjmeasure.py` 的逐块均值 + 逐行/逐列色带），只有 §5.17.7 补屋面时用
      `pal.roof`。本段不许再存一份 PALETTE（它只能在函数体里读 —— TDZ，
      58 段栽过：整页 JS 死）。 */
const QJ_C = {
  /* ⚠️ 下表每个色号都是**照片实测**（多点取样取均值，见本轮量图记录）；
     第一版有几处拿"看着像"的色去填，与照片并排一比就差得出来 —— 尤其是
     砖面（照片是**灰扑扑的赭色**，不是饱和砖红）与窗框（照片是浅灰
     #c3ced8，不是亮白 #dfe3ea）。
     ⭐ 第二轮修订（把照片缩到精灵尺度、与新图**上下叠着看**才发现的两个硬差距）：
       ① 砖面**整体偏暗**。上一轮取的是"9 点均值 #957471"，量到了阴影里的点；
          改按**整条砖带直方图**取（照 x=320..370 / y=560..670 净砖区，
          最常见的八色全落在 #a2~#a8 / #79~#80 / #73~#7a）⇒ 砖面 = **#a67d77**。
       ② 砖缝**对比过强**。照片直方图上**根本没有暗色簇**（最常见色与砖面差 ≤4）
          ⇒ 照片在这个尺度上砖缝是"看不见的"。第一版 BRD 压暗 15%，整面墙读成
          "深色大网格"，比照片闷一档。改成只压 6%，留纹不留脏。
       ③ 灰件偏蓝、偏暗：照片的灰是**中性灰**（#b0b0b2 的 b−r 只有 2），
          第一版 #a9adb4 的 b−r 是 11，并排看发青。 */
  BRI:  "#a67d77",   // 砖面（实测：砖带直方图最常见八色的中心）
  BRD:  "#9b736d",   // 砖缝 / 竖缝（砖面压暗 6% —— 照片上砖缝几乎看不见）
  PIL:  "#bebfc4",   // 灰竖柱（实测 #bebfc4）—— **比灰横带亮一档**，两个灰！
  GRY:  "#b0b0b3",   // 檐口带 / 细灰横带（实测 #b0b0b2，中性灰）
  GRD:  "#8b8f97",   // 灰件暗侧
  PLIN: "#969ba3",   // 墙裙（实测 #9499a1 ~ #989fa9）
  GLA:  "#8e9dab",   // 窗玻璃（实测：下部窗芯 #838c98 / 最常见 #676f7c，
                     //        顶部亮子反天光才到 #a8b5be —— 取中偏低）
  FRM:  "#c3ced8",   // 窗框（实测 #bac7cf ~ #d6dfe8）
  SILL: "#c6d2de",   // 窗台（实测 #c6d2de）
  PORS: "#b2b7c0",   // 门楼灰（实测 #b2b7c0）
  PORL: "#a8acb3",   // 门楼顶盖（实测 #a8acb3）⚠️ 比门楼墙**暗**，不是受光面
  PORD: "#787c85",   // 门楼暗线
  SHTR: "#7a7b7f",   // 卷帘门（实测 #7a7b7f）
  /* 匾额：板取照片的暗栗红（实测最暗处 #5d4749 ~ #624d4a），
     ⛔ **金字不抄照片** —— 那张照片整体被天气洗淡（砖、玻璃、金全低饱和），
        逐像素抄下来会是一块"灰扑扑的牌子"，与全图另外五块楼名牌（59/61/63/65/67 段）
        的同一支金打架。这一处**刻意**用全图那支金，交付说明里报备。 */
  BOARD:"#6d3a31",   // 匾额底（照片实测的暗栗红）
  GOLD: "#e2b855",   // 匾额金字（全图那支金，非照片）
  GOLDD:"#8c6410",   // 金字下沿
  STEP: "#8b8a8e",   // 台阶（实测 #8b8a8e）
  BAR:  "#5a5d63",   // 首层防盗栏
  AC:   "#d9dbe0",   // 空调外机
  ACD:  "#9ca0a7"
};

/* --- 5.17.3 几何：宽锚现算，一处写死 ---------------------------------------- */
function qjGeo(c) {
  const wallH0 = QJ_FLOORS * FLOOR_H;
  const roofT  = c.height - QJ_PADT - wallH0 - QJ_PADB;   // 反解，不存第二份
  const eaveY  = QJ_PADT + roofT;                         // 檐下沿 = 立面顶
  const w      = c.width - QJ_PADX * 2;                   // 立面外框宽 = footprint 宽
  const sc     = w / QJ_PW;                               // 照片 px → 精灵 px（横向）
  const sv     = wallH0 / QJ_RISE;                        // 照片 px → 精灵行（纵向）
  const baseY  = eaveY + wallH0;
  /* 照片 x → 画布 x（**两端各取整再相减**：相邻两块才不会差 1px 露缝，30 段的教训） */
  const X = (v) => QJ_PADX + Math.round(v * sc);
  /* 照片 y → 画布行（锚在"地面线"上；照片 y 越小越靠上 ⇒ 行越小） */
  const Y = (v) => baseY - Math.round((QJ_GY - v) * sv);
  const cx = QJ_PADX + w / 2;                             // 立面中轴
  const G = {
    roofT: roofT, wallH: wallH0, eaveY: eaveY, baseY: baseY,
    x0: QJ_PADX, x1: QJ_PADX + w, w: w, sc: sc, sv: sv, X: X, Y: Y, cx: cx,
    H: c.height
  };
  /* 门楼：**居中**于立面（照片上它的中心比图心偏左 0.6 px，四舍五入后就是居中） */
  const pw = X(QJ_PORCH[1]) - X(QJ_PORCH[0]);
  G.porch = { x: Math.round(cx - pw / 2), w: pw, top: Y(QJ_PTOP) };
  const pcx = G.porch.x + G.porch.w / 2;
  const dw  = X(QJ_DOOR[1]) - X(QJ_DOOR[0]);
  G.door  = { x: Math.round(pcx - dw / 2), w: dw, y: Y(835) };
  const sw  = X(QJ_STEPX[1]) - X(QJ_STEPX[0]);
  G.step  = { x: Math.round(pcx - sw / 2), w: sw, y: baseY + 1 };
  /* 竖向分带：檐口带 → 4 条砖带（窗贴砖带顶端） + 3 条细灰横带 → 墙裙。
     **砖带 = 灰件之间的缝**：自下而上数，"下面那条灰件的下沿 + 1" 到 "上面那条灰件的
     上沿 - 1"。四条灰件（自下而上）= 墙裙 / gband[0] / gband[1] / gband[2] / 檐口带。 */
  G.cope = { top: eaveY, bot: Y(QJ_COPEY) };              // 檐口带（灰）
  G.plin = { top: Y(QJ_PLIN_PY), bot: baseY - 1 };        // 墙裙（灰）
  G.gband = QJ_GBAND_PY.map(function (p) { return { top: Y(p[0]), bot: Y(p[1]) }; });
  G.floor = [];                                           // 自下而上 1~4 层
  for (let f = 0; f < 4; f++) {
    const top = (f < 3) ? G.gband[f].bot + 1 : G.cope.bot + 1;
    const bot = (f > 0) ? G.gband[f - 1].top - 1 : G.plin.top - 1;
    G.floor.push({ top: top, bot: bot, win: top, wbot: top + QJ_WIN_H - 1 });
  }
  /* 开间：照片 x → 画布 x 的中心 */
  G.bayL = QJ_BAY_L.map(X);
  G.bayR = QJ_BAY_R.map(X);
  G.pipes = QJ_PIPE_X.map(X);
  /* 层间闸：窗必须落在自己的砖带里、且砖带上边不能比窗顶高 —— 照片那三条
     "砖带顶/砖带底"实测数一改错位，这一条先响，而不是等出图看见窗压灰带。 */
  for (let f = 0; f < 4; f++) {
    const F = G.floor[f];
    if (F.bot - F.top < QJ_WIN_H + 2)
      console.warn("68_qijiao: 第 %d 层砖带只有 %d 行、放不下 %d 行的窗 —— " +
                   "QJ_FTOP_PY/QJ_FBOT_PY 与 QJ_WIN_H 配不上", f + 1, F.bot - F.top + 1, QJ_WIN_H);
  }
  if (G.cope.bot - G.cope.top < 6 || G.plin.bot - G.plin.top < 2)
    console.warn("68_qijiao: 檐口带 %d 行 / 墙裙 %d 行太窄 —— 照片标定对不上了",
                 G.cope.bot - G.cope.top + 1, G.plin.bot - G.plin.top + 1);
  /* 门楼闸：必须在立面里、且顶盖要高出檐口（照片上高 53 px ≈ 12 行） */
  if (G.porch.x <= G.x0 || G.porch.x + G.porch.w >= G.x1 ||
      G.eaveY - G.porch.top < 4 || G.eaveY - G.porch.top > 20)
    console.warn("68_qijiao: 门楼 x[%d,%d] 或顶盖第 %d 行（檐口第 %d 行）出界",
                 G.porch.x, G.porch.x + G.porch.w, G.porch.top, G.eaveY);
  /* 几何闸：30 段的 PADT/画布高公式一动，反解出的 roofT 立刻出界 ——
     出图时是一栋比例崩掉的楼，而几套自动验收都不看画面。 */
  if (roofT < 20 || roofT > 190)
    console.warn("68_qijiao: 反解出的 roofT=%d 出了 30 段的 clamp 区间[20,190]，" +
                 "画布高 %d 与 PADT/wallH/SHY 公式对不上了", roofT, c.height);
  return G;
}

/* --- 5.17.4 匾额点阵 --------------------------------------------------------
   由 `_build/_qjfont.py` 生成（**没有源图** —— 照片上那块匾每个字只 4.9 行，抠不出来；
   改走 30 段 §3.0 那条"系统字体 → 二值化"，理由写在 `_qjfont.py` 的文件头）。
   1bit、行优先、MSB 在前 —— 与 63/67 段那三块牌**同一套位序**。 */
/*__QJ_GEN_BEGIN__*/
const QJ_CHARS = [   /* 逐字 8 行、宽随各字墨宽（行优先 MSB 在前的 1bit） */
  ["iavQqR/UwA==", 7, 8],   /*  1  第  墨高 8 行 */
  ["EAgEZ4kAgEIf", 9, 8],   /*  2  七  墨高 8 行 */
  ["JHR+KvI0Jik=", 8, 8],   /*  3  教  墨高 8 行 */
  ["BIP5wJ/ECA==", 7, 8],   /*  4  学  墨高 8 行 */
  ["QI07HIlTLA==", 7, 8],   /*  5  楼  墨高 8 行 */
];
const QJ_GAPS = [1, 1, 1, 1];   /* 字缝（列） */
/*__QJ_GEN_END__*/

function qjNameW() {                          // 点阵总宽（列）
  let t = 0;
  for (let i = 0; i < QJ_CHARS.length; i++) t += QJ_CHARS[i][1] + (i ? QJ_GAPS[i - 1] : 0);
  return t;
}
/* 与 67 段 j9Glyph 同法：笔画上沿亮金、下沿压暗金（像素画里的"一像素立体"） */
function qjGlyph(g, b64, nw, nh, x, y) {
  const s = atob(b64), bit = (i) => (s.charCodeAt(i >> 3) >> (7 - (i & 7))) & 1;
  for (let j = 0; j < nh; j++) {
    for (let i = 0; i < nw; i++) {
      if (!bit(j * nw + i)) continue;
      const dn = (j + 1 >= nh) || !bit((j + 1) * nw + i);
      px(g, x + i, y + j, 1, 1, dn ? QJ_C.GOLDD : QJ_C.GOLD);
    }
  }
}

/* --- 5.17.5 砖墙 / 窗 / 灰件 ------------------------------------------------- */
/* 砖纹：本楼是**小砖**（照片上砖缝密），与 30 段那套 8×5 的大砖不同比例 ——
   这里用 6×4、隔行错缝 3。竖缝只画到砖带的顶部与底部之间，不越进灰带。
   ⚠️ 砖缝色（BRD）只比砖面暗 6% —— 照片直方图上根本没有暗色簇，砖缝在这个
      尺度上看不见。第一版压暗 15%，整面墙读成"深色大网格"，比照片闷一档。 */
function qjBrick(g, x, y, w, h) {
  px(g, x, y, w, h, QJ_C.BRI);
  for (let yy = y + 3; yy < y + h; yy += 4) px(g, x, yy, w, 1, QJ_C.BRD);
  for (let yy = y, k = 0; yy < y + h; yy += 4, k++)
    for (let xx = x + (k & 1 ? 3 : 0); xx < x + w; xx += 6) px(g, xx, yy, 1, 3, QJ_C.BRD);
}
/* 一扇窗（**左大扇 + 右窄扇 + 顶部亮子** + 亮框 + 窗台；`bars` = 首层防盗栏）
   ⚠️ 分格样式第二轮改的。第一版做成**三扇等宽**（两条竖挺各在 1/3、2/3），
      与照片并排一看就不对 —— 照片上那扇窗是一大一小（见 _look/_r29_photocrop.png）：
      外框内先一条**竖挺在 ~70%** 处，左边一大扇、右边一条窄扇；两扇**都被一条
      横挺在 ~26% 高处切开**（顶部那条是亮子/气窗）。所以是"横一条通到底、
      竖一条只在下 74% 分扇"，不是三格。 */
function qjWin(g, x, y, w, h, bars) {
  px(g, x - 1, y - 1, w + 2, h + 2, QJ_C.FRM);            // 外框（亮）
  px(g, x + w, y - 1, 1, h + 2, QJ_C.GRD);                // 框右背光
  px(g, x - 1, y + h + 1, w + 2, 1, QJ_C.GRD);            // 框下背光
  px(g, x, y, w, h, QJ_C.GLA);                            // 玻璃
  px(g, x, y, w, 1, "rgba(15,20,28,0.42)");               // 洞口上内侧
  px(g, x, y, 1, h, "rgba(15,20,28,0.30)");               // 洞口左内侧
  px(g, x, y + h - 4, w, 3, "rgba(20,30,44,0.20)");       // 下沿压暗
  const ty = y + Math.round(h * 0.28);                    // 横挺：顶部亮子
  px(g, x, y + 1, w, Math.max(1, ty - y - 1), "rgba(255,255,255,0.22)");  // 亮子反天光
  px(g, x, ty, w, 1, QJ_C.FRM);                           // 横挺通到两边
  px(g, x + Math.round(w * 0.25), ty, 1, h - (ty - y), QJ_C.FRM);   // 下部：窄
  px(g, x + Math.round(w * 0.72), ty, 1, h - (ty - y), QJ_C.FRM);   // 下部：宽 | 窄
  px(g, x + Math.round(w * 0.50), y, 1, ty - y, QJ_C.FRM);          // 亮子中间一挺
  px(g, x - 1, y - 1, w + 2, 1, "rgba(255,255,255,0.55)");// 框上沿提亮
  px(g, x - 2, y + h + 2, w + 4, 2, QJ_C.SILL);           // 窗台
  px(g, x - 2, y + h + 4, w + 4, 1, "rgba(14,18,28,0.26)");
  if (!bars) return;
  px(g, x, y + 2, w, 1, QJ_C.BAR);                        // 防盗栏：横三竖三
  px(g, x, y + Math.round(h / 2), w, 1, QJ_C.BAR);
  px(g, x, y + h - 3, w, 1, QJ_C.BAR);
  px(g, x + Math.round(w / 4), y, 1, h, "rgba(90,93,99,0.75)");
  px(g, x + Math.round(w / 2), y, 1, h, "rgba(90,93,99,0.75)");
  px(g, x + Math.round(w * 0.75), y, 1, h, "rgba(90,93,99,0.75)");
}
/* 灰件（竖柱 / 檐口带 / 灰横带）：左上受光、右下背光，服从 SUN */
function qjGray(g, x, y, w, h, col) {
  px(g, x, y, w, h, col || QJ_C.GRY);
  px(g, x, y, w, 1, "rgba(255,255,255,0.20)");
  px(g, x, y, 1, h, "rgba(255,255,255,0.14)");
  px(g, x + w - 1, y, 1, h, "rgba(14,18,28,0.20)");
  px(g, x, y + h - 1, w, 1, "rgba(14,18,28,0.26)");
}

/* --- 5.17.6 立面总装（只在**新画布**上画） ---------------------------------- */
function qjFront(g, G) {
  const x0 = G.x0, x1 = G.x1, w = G.w;
  /* ① 檐口线（压住 30 段投影线被切掉的那一行）+ 檐口带 */
  px(g, x0 - 3, G.eaveY, w + 6, 2, "#666a72");
  qjGray(g, x0 - 3, G.eaveY + 2, w + 6, G.cope.bot - G.eaveY - 1);
  /* ② 四条砖带（自下而上 1~4 层），窗贴砖带顶端 */
  for (let f = 0; f < 4; f++) {
    const F = G.floor[f];
    qjBrick(g, x0, F.top, w, F.bot - F.top + 1);
  }
  /* ③ 三条细灰横带 + 墙裙 */
  for (const b of G.gband) qjGray(g, x0, b.top, w, b.bot - b.top + 1);
  qjGray(g, x0, G.plin.top, w, G.plin.bot - G.plin.top + 1, QJ_C.PLIN);
  /* ④ 灰竖柱（窗与窗之间的中点），从檐口带下沿通到墙裙上沿。
        ⚠️ 用 `QJ_C.PIL` —— 照片上竖柱（#c5c6ca）**比细灰横带（#a5a8ae）亮一档**，
           两个灰。第一版共用一个 `GRY`，并排一看竖柱整片发闷。 */
  const pil = (a) => {
    for (let i = 0; i + 1 < a.length; i++)
      qjGray(g, Math.round((a[i] + a[i + 1]) / 2 - QJ_PIL_W / 2),
             G.cope.bot + 1, QJ_PIL_W, G.plin.top - G.cope.bot - 1, QJ_C.PIL);
  };
  pil(G.bayL); pil(G.bayR);
  /* ⑤ 窗阵：两翼各 4 个开间 × 4 层；首层带防盗栏 */
  for (const a of [G.bayL, G.bayR]) {
    for (let f = 0; f < 4; f++) {
      for (const cx of a) {
        const x = cx - (QJ_WIN_W >> 1);
        qjWin(g, x, G.floor[f].win, QJ_WIN_W, QJ_WIN_H, f === 0);
      }
    }
  }
  /* ⑥ 空调外机（画在窗之后，压在窗台下方那块砖上） */
  for (const [px0, f] of QJ_AIR) {
    const ax = G.X(px0) - (QJ_AIR_W >> 1), ay = G.floor[f].wbot + 2;
    px(g, ax + 1, ay + 1, QJ_AIR_W, QJ_AIR_H, "rgba(14,18,28,0.26)");         // 投影
    px(g, ax, ay, QJ_AIR_W, QJ_AIR_H, QJ_C.AC);                              // 外壳
    px(g, ax, ay, QJ_AIR_W, 1, "rgba(255,255,255,0.60)");
    px(g, ax, ay + QJ_AIR_H - 1, QJ_AIR_W, 1, QJ_C.ACD);
    px(g, ax + 1, ay + 2, QJ_AIR_W - 2, QJ_AIR_H - 4, QJ_C.ACD);             // 出风格栅
    px(g, ax + 1, ay + 3, QJ_AIR_W - 2, 1, "#7d8189");
    px(g, ax + 1, ay + 5, QJ_AIR_W - 2, 1, "#7d8189");
  }
  /* ⑦ 雨水管（实测三根；画在窗之后，压在砖上） */
  for (const qx of G.pipes) {
    px(g, qx, G.cope.bot + 1, 3, G.plin.top - G.cope.bot - 1, "rgba(14,18,28,0.20)");
    px(g, qx, G.cope.bot + 1, 2, G.plin.top - G.cope.bot - 1, QJ_C.SILL);
    px(g, qx, G.cope.bot + 1, 1, G.plin.top - G.cope.bot - 1, "#eef1f5");
    px(g, qx - 1, Math.round((G.cope.bot + G.plin.top) / 2), 4, 2, QJ_C.GRD);
  }
  /* ⑧ 门楼（**最后画**，压在中间那两跨上 —— 照片上它本来就凸在立面外） */
  qjPorch(g, G);
  /* ⑨ 台阶（落在落地线**以外**，与 30 段同一处理） */
  qjSteps(g, G);
  /* ⑩ 整栋外轮廓 + 接地最深窄带（照 30 段 §3.8） */
  px(g, x0 - 1, G.eaveY + 1, 1, G.baseY - G.eaveY, "#6c6f76");
  px(g, x1, G.eaveY + 1, 1, G.baseY - G.eaveY, "#5c5f66");
  contactBand(g, x0 + 1, x1 - 1, G.baseY - 1, 2, 0.34);
}

/* --- 5.17.6a 门楼（灰色混凝土门厅 + 匾额 + 卷帘门） -------------------------- */
function qjPorch(g, G) {
  const P = G.porch, x0 = P.x, x1 = P.x + P.w, w = P.w, top = P.top;
  const pcx = x0 + w / 2;
  /* ① 顶盖：比两翼檐口高出来那一截 */
  px(g, x0, top, w, G.eaveY - top + 1, QJ_C.PORS);
  px(g, x0, top, w, 2, QJ_C.PORL);                        // 顶面受光
  px(g, x0, top + 2, w, 1, "rgba(255,255,255,0.22)");
  px(g, x0, G.eaveY - 1, w, 2, QJ_C.PORD);                // 顶盖与立面的分界线
  px(g, x0, top, 3, G.eaveY - top + 1, "rgba(255,255,255,0.14)");
  px(g, x1 - 3, top, 3, G.eaveY - top + 1, "rgba(14,18,28,0.16)");
  /* ② 门楼立面：左受光右背光 */
  px(g, x0, G.eaveY + 1, w, G.baseY - G.eaveY - 1, QJ_C.PORS);
  px(g, x0, G.eaveY + 1, 3, G.baseY - G.eaveY - 1, "rgba(255,255,255,0.16)");
  px(g, x1 - 4, G.eaveY + 1, 4, G.baseY - G.eaveY - 1, "rgba(14,18,28,0.18)");
  speckle(g, x0 + 3, G.eaveY + 2, w - 6, G.baseY - G.eaveY - 3,
          "rgba(255,255,255,0.05)", (w / 3) | 0, makeRng(6817));
  /* ③ 每层的横梁线：与两翼的灰横带同高（照片上门楼的横线正对着两翼的灰带） */
  for (const b of G.gband) {
    px(g, x0, b.top, w, 1, "rgba(255,255,255,0.42)");
    px(g, x0, b.bot, w, 1, QJ_C.PORD);
  }
  /* ④ 窗阵：每层"一宽 + 两窄"（实测中央窗 108 px、两侧 60~72 px） */
  const cw = G.X(956) - G.X(848);                         // 中央窗宽（行）
  const sw = 10;                                          // 侧窗宽（行）
  for (let f = 0; f < 4; f++) {
    const y = G.floor[f].win;
    if (f > 0) {
      qjWin(g, Math.round(pcx - cw / 2), y, cw, QJ_WIN_H, false);
      qjWin(g, Math.round(pcx - 25 - sw / 2), y, sw, QJ_WIN_H, false);
      qjWin(g, Math.round(pcx + 25 - sw / 2), y, sw, QJ_WIN_H, false);
    } else {
      /* 首层：门的两侧只留窄窗 */
      qjWin(g, Math.round(pcx - 25 - sw / 2), y + 2, sw, QJ_WIN_H, false);
      qjWin(g, Math.round(pcx + 25 - sw / 2), y + 2, sw, QJ_WIN_H, false);
    }
  }
  /* ⑤ 匾额（板由点阵现算宽，居中） */
  qjPlaque(g, G);
  /* ⑥ 卷帘门（凹进去：先画一圈暗框，再画帘片） */
  const d = G.door;
  px(g, d.x - 3, d.y - 2, d.w + 6, G.baseY - d.y + 2, "#5c6068");            // 门洞暗框
  px(g, d.x - 2, d.y - 1, d.w + 4, G.baseY - d.y + 1, "#3f434a");
  px(g, d.x, d.y, d.w, G.baseY - d.y, QJ_C.SHTR);
  for (let yy = d.y + 2; yy < G.baseY; yy += 4)                              // 帘片横纹
    px(g, d.x, yy, d.w, 1, "rgba(14,18,28,0.26)");
  px(g, d.x, d.y, d.w, 1, "rgba(255,255,255,0.30)");
  px(g, d.x, d.y, 1, G.baseY - d.y, "rgba(255,255,255,0.16)");
  px(g, d.x + d.w - 1, d.y, 1, G.baseY - d.y, "rgba(14,18,28,0.24)");
  px(g, d.x, G.baseY - 3, d.w, 3, "rgba(14,18,28,0.34)");                    // 落地最暗
}
/* 匾额：板宽 = 点阵总宽 + 4，居中；板高 = 点阵高 + 2（上下各留 1 行边）。
   照片上那块匾实测 **x 768..1027 / y 796..829**（260 × 34 照片 px）
   ⇒ 精灵 **37 列 × 8 行**，中轴 X(897.5) = 155 = 门楼中轴 ✓。
   为什么做成 46 × 10：**8 行放不下五个能认出来的汉字**（本轮实测：字高 7 行时
   「第七教学楼」已经糊成一团色块，8 行才认得出）⇒ 板被迫加宽到 46、加高到 10。
   这是"看得清"与"量得准"打架，取看得清（与 67 段「10 字挤 82 px 金匾，糊是物理上限」
   同一条先例），交付说明里报备。 */
function qjPlaque(g, G) {
  const tw = qjNameW();
  const gh = QJ_CHARS[0][2];                               // 点阵高（行），从生成块现读
  const bw = tw + 4, bh = gh + 2;
  const x = Math.round(G.porch.x + G.porch.w / 2 - bw / 2);
  const y = G.baseY - 37;                                  // 照片：板在第 223~230 行
  if (bw > G.porch.w - 10)
    console.warn("68_qijiao: 匾额板 %d 行宽，门楼只有 %d 行 —— 两侧留边不够，" +
                 "重跑 _build/_qjfont.py 或改 QJ_C 的字高", bw, G.porch.w);
  px(g, x + 2, y + 2, bw, bh, "rgba(14,18,28,0.34)");      // 投影（朝右下，服从 SUN）
  px(g, x, y, bw, bh, QJ_C.BOARD);
  px(g, x, y, bw, 1, "#8a4b41");                           // 上沿受光
  px(g, x, y, 1, bh, "#7a4238");
  px(g, x + bw - 1, y, 1, bh, "#4f2a24");
  px(g, x, y + bh - 1, bw, 1, "#43231e");
  px(g, x + 1, y + 1, bw - 2, 1, "rgba(226,184,85,0.45)"); // 内描金线
  px(g, x + 1, y + bh - 2, bw - 2, 1, "rgba(226,184,85,0.30)");
  let gx = Math.round(x + (bw - tw) / 2);
  const gy = y + Math.round((bh - gh) / 2);                // 点阵在板里居中
  for (let i = 0; i < QJ_CHARS.length; i++) {
    qjGlyph(g, QJ_CHARS[i][0], QJ_CHARS[i][1], QJ_CHARS[i][2], gx, gy);
    gx += QJ_CHARS[i][1] + (i < QJ_GAPS.length ? QJ_GAPS[i] : 0);
  }
}
/* 台阶：3 级，自上而下逐级变宽（照 30 段 §3.7 的手感，但宽度取照片的 43 行） */
function qjSteps(g, G) {
  for (let i = 0; i < 3; i++) {
    const sw = G.step.w - i * 3, sx = Math.round(G.step.x + i * 1.5);
    const sy = G.step.y + i * 3;
    px(g, sx, sy, sw, 3, shade(QJ_C.STEP, 0.16 - i * 0.12));
    px(g, sx, sy + 3, sw, 1, "rgba(14,18,28,0.26)");
  }
}

/* --- 5.17.7 撤屋名牌 + 按同一支笔补回板面 ------------------------------------
   30 段 §3.2.9 把屋名牌画在 `eaveY - 8 - sgn.h`（本楼 = 第 87~113 行）+ 一块
   3px 偏移的投影。本段门楼顶升到第 110 行 ⇒ 牌子必须撤（名字在匾额上）。
   撤完**必须补**，否则屋面剩一块疤。

   ⚠️ **补的是 `shade(pal.roof, -0.04)`** —— 30 段 §3.2 板面那一笔（`px(g, x0,
      PADT + 2, w, roofT - 5, shade(roof, -0.04))`）。67 段那一轮拿**本色**去补，
      出图时是一块 117×34 的亮斑（板面 (103,121,135)，本色 (108,127,140)）。
   补完要**把划过这里的三笔重新点一遍**（30 段的板面不是纯色，上面还有分坡脊线
      与两种斑点）：脊线第 3 条在本楼落在第 93 行、x 从 x0+5 到 x0+w-5；
      斑点密度按面积折算（白色 (w/3)|0 与黑色 (w/4)|0 覆盖 30 段那个 250×92 的框）。 */
function qjRoofPatch(g, G, pal) {
  const sgn = makeSign(QJ_NAME);                           // 也为填 `_signCache`（verify.py 数它）
  const sg  = signRect(sgn, G.x0, G.w, G.eaveY);
  if (!sg) { console.warn("68_qijiao: makeSign 没拿到字形 —— 屋名牌那块疤补不出来"); return; }
  const x = sg.x - 2, y = sg.y - 2, w = sg.w + 6, h = sg.h + 6;
  /* 闸：补的框必须整个落在 30 段的板面上（板面 = [PADT+2, PADT+2+roofT-5)） */
  const bTop = QJ_PADT + 2, bBot = QJ_PADT + 2 + G.roofT - 5;
  if (y < bTop || y + h > bBot || x < G.x0 || x + w > G.x1)
    console.warn("68_qijiao: 补板面的框 %d,%d %d×%d 越出了 30 段的板面 [%d,%d)×[%d,%d] —— " +
                 "补出来会是一块异色方块", x, y, w, h, bTop, bBot, G.x0, G.x1);
  px(g, x, y, w, h, shade(pal.roof, -0.04));
  /* 分坡脊线：30 段是 `PADT + round((roofT-12)*j/4) + 6`，j = 1..3 —— 只补压在框里的 */
  for (let j = 1; j <= 3; j++) {
    const ry = QJ_PADT + Math.round((G.roofT - 12) * j / 4) + 6;
    if (ry < y || ry >= y + h) continue;
    px(g, x, ry, w, 1, "rgba(255,255,255,0.08)");
  }
  /* 斑点：按面积折算条数（30 段的框是 250×92），用**局部** RNG ⇒ 不碰建筑序列 */
  const rng = makeRng(6829);
  const k = (w * h) / (250 * 92);
  speckle(g, x, y, w, h, "rgba(255,255,255,0.05)", Math.round((G.w / 3) * k), rng);
  speckle(g, x, y, w, h, "rgba(0,0,0,0.07)", Math.round((G.w / 4) * k), rng);
}

/* --- 5.17.8 覆盖重绘入口 ----------------------------------------------------
   ⚠️ 必须在这里、addProp **之前**调（60_assemble.js）—— 重绘的是精灵，
      晚一步 addProp 已经把旧精灵挂进 props 了（gymRestyle/…/j9Restyle 同一规矩）。
   ⚠️ 本函数**不碰共享 RNG**：两处随机量各用**局部** makeRng（§5.17.6a 的门楼斑点
      6817、§5.17.7 的补板面斑点 6829）。建筑序列与全校园散射流一个数不动。
   ⚠️ 第三个实参照 65/67 段传 `pal` —— 画立面用不上它（照片给的色，见 §5.17.2），
      但**补屋面板面**那一笔要用 `pal.roof`，而 `makeBuilding` 的返回值里没有色号。
   ⚠️ **画布同高**（与 67 段的 153 ≠ 136 不同），但仍换一张新的：旧画布在
      `[baseY, H)` 留着 30 段的旧台阶（第 256~265 行），旧投影也已在第 234~279 行上，
      就地重画会让投影叠第二遍。只搬 `[0, eaveY)` 行 ⇒ 旧立面/旧门/旧台阶/旧投影
      整段不进新画布。`b.ay` 仍是 258（同高 ⇒ 落地线位置一字不变）。 */
function qjRestyle(b, pal) {
  const c = b.canvas, g = c.getContext("2d");
  const G = qjGeo(c);
  /* ① 撤屋名牌 + 补板面（改的是**旧画布**的屋面，在搬行之前） */
  qjRoofPatch(g, G, pal);
  /* ② 新画布：只搬旧画布的第 [0, eaveY) 行 */
  const nc = mkCanvas(c.width, G.H), ng = nc.getContext("2d");
  ng.drawImage(c, 0, 0, c.width, G.eaveY, 0, 0, c.width, G.eaveY);
  /* ③ 方向性投影（照 30 段 §3.1，画在立面**之前**，所以只有落地线以下留在画面里）
        + 立面总装 */
  const SHX = Math.round(-SUN.x * 26), SHY = Math.round(-SUN.y * 26);
  shadowQuad(ng, G.x0 + 2, G.baseY - QJ_SHADOW_H, G.x1 - 2, G.baseY, SHX, SHY, 0.28, 4);
  qjFront(ng, G);
  b.canvas = nc;
  /* ④ 锚点：同高 ⇒ 这一行与改前**逐字节相同**（写出来只为把契约写明） */
  b.ay = G.baseY;
  return b;
}
