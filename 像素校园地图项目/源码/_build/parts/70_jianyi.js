/* =========================================================
   §5.19 建筑艺术学院（parts/70_jianyi.js）—— 第三十四轮
   ---------------------------------------------------------
   用户逐字（2026-09-29）：
     「然后建筑艺术楼正面照也给你了，在老体育馆旁边的田径场下面那个是第一个宿舍楼，
       这个宿舍楼应该是建筑艺术楼标错了，给我复刻好，不用关会不会被遮挡，直接画」

   素材：`预览\建艺楼照片.png`（2048×1152，手绘风格的正射立面图）。
   目标：`20_ground.js` 第 108 行那栋（改名后的 `"建筑艺术学院"`）——
        也就是 `操场` 南边的第一栋、西邻 `老体育馆`，正是用户指的那一栋。

   ============================ 一、这栋楼长什么样 ============================
   照片上从上到下、从右到左清点（照片坐标 px，主楼 x 152..1984 = 宽 1832）：
     ① 浅黄墙的**五层楼**，每层一排蓝玻璃窗（白窗框 + 白竖棂；中层那三排窗
        下半部还有一条白色百叶 —— 照片里是空调/遮阳的白色横栅）；
     ② 右侧偏中一道**深蓝灰的玻璃竖塔**（x 1217..1723，塔顶 y≈110 高出主楼
        女儿墙约 140 px），塔的右缘竖排六个白色拉丁字母 `BJTUSA`（x 1640..1700，
        y 120..580）—— 这是照片上最扎眼的识别标记，所以必须画；
     ③ 贯通全宽的**木质棚架**：一条木色顶板 + 顶板上方的浅蓝玻璃栏板 + 板前一条
        深木前缘，下面撑着成排的「树状柱」（柱越往上越张开，像树枝托住顶板）；
     ④ 棚架后面是**落地大玻璃门厅**（底层那排蓝玻璃一直落到地面）；
     ⑤ 右下角一块**深棕招牌**：金色中文「建筑艺术学院」+ 下面一行小字英文。

   ============================ 二、实测换算 ============================
   横向：照片主楼宽 1832 px ↔ 精灵立面宽 w（= footprint 宽 460.5，取整 461）
         sc = w / 1832
   纵向：照片「地面线(1000) → 檐口顶(250)」750 px ↔ 墙高 wallH（= 5×34 = 170）
         sv = wallH / 750
   两个比例**不相等**（0.2516 vs 0.2267，差 11%）—— 因为地图给这栋楼的 footprint
   是硬约束、而每层 34 行是全校统一的层高。这 11% 的差就是本段的全部失真，出图
   核对时按"哪一层对得上"看，不要按像素对。

   五排窗的实测 y（照片）与换算后的行（`Y(v) = baseY − round((1000 − v)·sv)`）：

     排  照片 y      精灵行    性质
     ─────────────────────────────────────────────
     R1  320..389    130..146  顶层窗
     R2  439..525    157..176  四层窗
     R3  590..666    191..208  三层窗
     R4  717..777    220..233  二层窗（被棚架顶板压掉一条）
     R5  888..999    259..284  首层落地门厅大玻璃

   ⚠️ 本段**不照抄这五行**，而是走全校统一的 34 行层网格、每层居中（顶层因此比
      照片高约 9 行，二层比照片低约 5 行）。理由：窗在精灵上只有 20 行高，行与行
      之间差 5~9 行在屏幕上就是 2~3 px，照片那点不规则根本读不出来；而**规整到
      34 网格**能让这栋楼与旁边七教 / 九教 / 五教的窗排在同一水平线上 ——
      出图时"窗户跟邻居对不齐"比"跟照片差 3 行"扎眼得多。R2/R3/R5 三排本来就与
      规整网格几乎重合（差 0~2 行），只有顶层是真偏的（这一条在交付说明里报备）。

   ============================ 三、为什么不换画布 ============================
   本段与 61/67/68 段那条「换一张新画布 + 挪 b.ay」的路**不同**：不换画布、不动 b.ay。
   为什么：那两段非换不可，是因为旧画布 `[baseY, H)` 里留着 30 段的旧台阶与旧投影，
   就地重画会让投影叠第二遍。本段要覆盖的是**屋面 + 立面**（行 `[PADT, baseY)`），
   台阶与投影全在 `baseY` 以下 —— 一个像素都不碰，所以旧画布原样够用。
   ⇒ `b.canvas` / `b.ay` / `b.w` 三样都不动，**世界落地线、碰撞盒、footprint
      一个字节不动** ⇒ 全校园散射随机流一个数不动（§6.6 那颗地雷，唯一探针
      `_propdiff.py`）。本段也**不碰共享 RNG**（唯一的随机量是屋面斑点的局部
      `makeRng(7019)`）。

   ============================ 四、已知代价 / 偏离（如实报备） ============================
   ① **照片的窗是不均匀的**（左半两扇间距大、右半三扇挤在一起），本段画成
      **8 扇均匀窗阵**（窗宽 24、步长 58、两边各留 15）。理由同上：缩到 1/4 之后
      那种疏密差读作"画歪了"，不读作"房间大小不同"。
   ② **屋名标牌撤了**：30 段 §3.2.9 那两块（牌面 + 投影）落在屋面行 79..106，
      被本段的屋面重绘整块盖掉 —— 楼名在照片上是挂在**右下角招牌**上的，
      屋面上再挂一块就重复了。`makeSign("建筑艺术学院")` 仍会被 30 段调用
      （填 `_signCache`，verify.py 数它，signs 28 → 29）。
   ③ **棚架的横向范围超出楼体**：照片里棚架左端比楼左缘还探出约 97 px
      （换算 24 行），本段照画（列 8 起）—— 落在 30 段的 PADX(26) 留白里，
      读作"从楼左伸出的一段雨棚"。
   ④ **首层门**：30 段那扇门（宽 70 的雨棚 + 门扇 + 台阶）被本段的落地门厅玻璃
      整块盖掉；台阶留在原地（照片里楼前确有台阶，颜色也接近）。
   ⑤ 屋面在照片上**看不到**（正射视角看不到顶面）。本段的屋面色是**自设计**的：
      按楼顶边缘那条浅黄白推成浅米色平顶 + 女儿墙 + 两个屋面设备箱。
   ⑥ **⚠️ 南邻把它下半段盖掉了（出图才看得见，五套自动验收全绿）**：
      南边紧邻的是同一列宿舍的下一栋（CAMPUS 里 `"宿舍"` y=3.0542 那一行，
      footprint 北缘在世界 y≈1193，而本楼南缘 y≈1164 —— 中间只隔 29px）。
      30 段的建筑精灵是**朝北生长**的：精灵高 = roofT + wallH，底行钉在 footprint
      南缘 ⇒ 那栋宿舍的精灵顶行落在世界 y≈1035，**比它自己的北缘还往北伸了 158px**，
      而 z 序按 y 排、南边的后画（盖在北邻之上）。
      ⇒ 实测结果：本楼精灵的**行 173~284 全被盖住**（= 木棚架 / 树状柱 / 首层落地
        门厅 / 金字招牌 —— 也就是照片上最有特色的那一段），露出来的只有
        **屋面 + 顶部约 4 层半的窗 + 玻璃塔与 BJTUSA**。
      这一条**不是 bug**，是用户明确接受的前提：他逐字说「**不用关会不会被遮挡，
      直接画**」—— 他在地图上早看过这块地。所以本段**不挪 footprint**（挪了会动
      `addSolid` ⇒ 重掷全校园散射，那颗地雷见 §6.6）。
      若哪天要让棚架露出来，唯一的改法是**把本楼的 y 往北挪约 60px**
      （`2.5688 → 2.4151`，北缘 943.6 仍留 46px 不压操场），代价同上（重掷散射）。
   ========================================================= */

/* --- 5.19.1 常量 ----------------------------------------------------------- */
const JY_NAME   = "建筑艺术学院";             // ⚠️ 必须与 CAMPUS 里的名字逐字相同
const JY_PADX   = 26, JY_PADT = 18;           // 与 30 段同值
const JY_PADB   = 21 + 14;                    // SHY + 14 —— 30 段画布高公式的尾巴
const JY_FLOORS = 5;                          // ⚠️ 必须等于 styleOf("建筑艺术学院").floors
/* 照片实测（px）—— 改这两组数就得重跑一次照片量测，别凭印象调 */
const JY_PW     = 1832;                       // 照片里主楼宽（x 152..1984）
const JY_GY     = 1000;                       // 照片"地面线"（散水）那一行
const JY_RISE   = 750;                        // 檐口顶(250) → 地面(1000) 的行数 = 立面高
const JY_TOWER  = [1217, 1723];               // 玻璃塔 x 范围（照片 px）
const JY_TTOP   = 110;                        // 塔顶（照片 y）—— 高出女儿墙约 140 px
const JY_TLET   = [1640, 1700, 120, 580];     // 塔上竖排字母 x0,x1,y0,y1（照片 px）
const JY_CANOP  = [55, 1810];                 // 棚架横向范围（照片 px）
const JY_CANOPY = [700, 730, 790, 815];       // 栏板顶 / 顶板顶 / 顶板底 / 前缘底（照片 y）
const JY_SIGN   = [1500, 1830, 870, 990];     // 招牌 x0,x1,y0,y1（照片 px）
const JY_STAIR  = [1180, 1400, 850];          // 塔前台阶 x0,x1,顶（照片）
const JY_PIPE   = 615;                        // 墙面那根竖的雨水管（照片 x）
/* 立面排版（精灵行/列）—— 全校统一层网格下的自设计值 */
const JY_COLS   = 8;                          // 均匀窗阵的窗数
const JY_WIN_W  = 24;                         // 窗宽（列）
const JY_WIN_H  = 20;                         // 上层窗高（行）
const JY_WIN_PAD= 7;                          // 窗顶离本层楼板线的行数

/* --- 5.19.2 调色：**照片的实测色** -----------------------------------------
   ⚠️ 本段**不拿 `pal` 推任何一个色**（同 65/67/68/69 段的规矩）：立面是照着照片
      重画的，照片给什么色就是什么色。`pal` 这个实参留着只为与那一串
      `xxxRestyle(b, pal)` 的调用签名对齐。
   ⚠️ 本段也不许再存一份 PALETTE —— 那只能在函数体里读（TDZ，58 段栽过：整页 JS 死）。 */
const JY_C = {
  WALL:  "#fdf8d2",   // 墙（照片实测 #fff8d0 ~ #fef9d3）
  WALLT: "#fffbd6",   // 墙顶女儿墙（比墙面亮一档）
  WALLD: "#efe8b8",   // 层间腰线
  WIN:   "#5f9ee1",   // 窗玻璃（实测 #5a99dc ~ #64a1e2）
  WINL:  "#7ab2e8",   // 玻璃上高光
  WIND:  "#4682c8",   // 玻璃下暗部
  FRAME: "#f4f2de",   // 白窗框 / 竖窗棂
  LOUVER:"#e8e6d4",   // 窗下那条白百叶（照片中层三排窗的下半部）
  TOWER: "#363e49",   // 玻璃塔（实测 #363e49 / #38404b）
  TOWL:  "#49535f",   // 塔的幕墙竖分格（浅）
  TOWD:  "#2b323b",   // 塔的层间横线（深）
  LT:    "#ffffff",   // BJTUSA 字母
  R_EDGE:"#cfc9a4",   // 屋面檐口外沿
  R_DECK:"#e9e4bc",   // 屋面板面
  R_TOP: "#f7f2d0",   // 女儿墙顶受光面
  R_LIT: "#f0ebc4",   // 屋面左内侧受光
  R_DIM: "#dcd6ae",   // 屋面右内侧背光
  R_EAVE:"#bdb894",   // 檐口投影线
  DEV:   "#d5d2c0",   // 屋面设备
  DEVD:  "#b5b2a2",
  GLA:   "#9dbdd4",   // 棚架玻璃栏板
  GLAL:  "#c2dbe8",
  GLAD:  "#7fa3bd",
  WD:    "#c49a78",   // 木顶板
  WDL:   "#e3b896",   // 木顶板受光面
  WDD:   "#a67f5f",   // 木顶板暗面
  WEDGE: "#865d3f",   // 棚架前缘（深木）
  COL:   "#8a6145",   // 木柱
  COLL:  "#b18362",   // 木柱受光
  COLD:  "#6b4a33",   // 木柱背光
  SIGN:  "#5c3e36",   // 招牌底（实测 #5c3e36）
  SIGNL: "#6d4a40",   // 招牌上棱
  SIGND: "#472e28",   // 招牌下棱
  GOLD:  "#e8d9a8",   // 招牌金字（与 30 段屋名牌同一支金）
  PIPE:  "#b8bcc2"    // 墙面雨水管
};

/* --- 5.19.3 几何：一律现算，一处写死 ----------------------------------------
   ⚠️ `roofT` 是**反解**的（`c.height` 减去 30 段那四段固定高），不存第二份 ——
      30 段的画布高公式一改，这里立刻跟着走，而不是留一个对不上的死数。 */
function jyGeo(c) {
  const wallH0 = JY_FLOORS * FLOOR_H;
  const roofT  = c.height - JY_PADT - wallH0 - JY_PADB;   // 反解（本楼 = 96）
  const eaveY  = JY_PADT + roofT;                         // 檐下沿 = 立面顶
  const w      = c.width - JY_PADX * 2;                   // 立面宽 = footprint 宽
  const sc     = w / JY_PW;                               // 照片 px → 精灵 px（横向）
  const sv     = wallH0 / JY_RISE;                        // 照片 px → 精灵行（纵向）
  const baseY  = eaveY + wallH0;
  const x0     = JY_PADX, x1 = JY_PADX + w;
  /* 照片 x → 画布 x（**两端各取整再相减**：相邻两块才不会差 1px 露缝，30 段的教训） */
  const X = (v) => JY_PADX + Math.round((v - 152) * sc);
  /* 照片 y → 画布行（锚在"地面线"上；照片 y 越小越靠上 ⇒ 行越小） */
  const Y = (v) => baseY - Math.round((JY_GY - v) * sv);
  const G = {
    roofT: roofT, wallH: wallH0, eaveY: eaveY, baseY: baseY,
    x0: x0, x1: x1, w: w, sc: sc, sv: sv, X: X, Y: Y,
    cx: JY_PADX + w / 2, H: c.height
  };
  /* 均匀窗阵：8 扇窗，窗左沿 = x0 + 15 + k·58 */
  const step = Math.round((w - 2 * 15 - JY_WIN_W) / (JY_COLS - 1));
  G.winX = [];
  for (let k = 0; k < JY_COLS; k++) G.winX.push(x0 + 15 + k * step);
  G.winStep = step;
  /* 每层窗顶：自下而上第 f 层（f=0 是首层）。首层是落地大玻璃，不排窗 */
  G.winTop = [];
  for (let f = 0; f < JY_FLOORS; f++)
    G.winTop.push(eaveY + (JY_FLOORS - 1 - f) * FLOOR_H + JY_WIN_PAD);
  /* 玻璃塔 */
  G.tower = { x0: X(JY_TOWER[0]), x1: X(JY_TOWER[1]), top: Y(JY_TTOP) };
  /* 塔上的竖排字母：x 居中在字母列区，6 个字母自上而下 */
  const lw = 10, lh = 14, lstep = 17;                     // 5×7 点阵放大 2 倍 → 10×14
  G.letter = {
    x: Math.round((X(JY_TLET[0]) + X(JY_TLET[1])) / 2 - lw / 2),
    y0: Y(JY_TLET[2]), step: lstep, s: 2, w: lw, h: lh
  };
  /* 棚架 */
  G.canopy = {
    x0: Math.max(4, X(JY_CANOP[0])), x1: Math.min(x1 + 3, X(JY_CANOP[1])),
    glaTop: Y(JY_CANOPY[0]), deckTop: Y(JY_CANOPY[1]),
    deckBot: Y(JY_CANOPY[2]), edgeBot: Y(JY_CANOPY[3])
  };
  /* 树状柱：与窗列同一组中轴，柱身 8 行宽 */
  G.colX = G.winX.map((wx) => wx + Math.round(JY_WIN_W / 2));
  G.colW = 8;
  /* 招牌 */
  G.sign = { x0: X(JY_SIGN[0]), x1: X(JY_SIGN[1]), top: Y(JY_SIGN[2]), bot: Y(JY_SIGN[3]) };
  /* 塔前台阶 + 墙面雨水管 */
  G.stair = { x0: X(JY_STAIR[0]), x1: X(JY_STAIR[1]), top: Y(JY_STAIR[2]) };
  G.pipe  = X(JY_PIPE);

  /* --- 闸们：这一组数一错，出图是一栋比例崩掉的楼，而五套自动验收全不看画面 --- */
  if (roofT < 20 || roofT > 190)
    console.warn("70_jianyi: 反解出的 roofT=%d 出了 30 段的 clamp 区间[20,190] —— " +
                 "画布高 %d 与 PADT/wallH/SHY 公式对不上了", roofT, c.height);
  /* 屋面盖满 footprint 的判据（30 段那条 `wallH >= 0.4·进深`）：
     本楼墙高 170 ≥ 0.4×160.2 = 64.1 ⇒ 默认 roofT 就够，**不需要 roofFull**。
     这一条要是哪天不成立（比如有人把层数改成 3），北缘会露出灰石板。 */
  if (wallH0 < 0.4 * 160)
    console.warn("70_jianyi: 墙高 %d 已薄于 0.4×进深(64)——北缘会露出 K.BLD 的灰石板，" +
                 "要么加层、要么给 60 段传 roofFull", wallH0);
  /* 塔闸：塔必须比女儿墙高、且顶端要落在画布内（照片高 140 px ≈ 32 行） */
  if (G.tower.top >= eaveY || G.tower.top < JY_PADT)
    console.warn("70_jianyi: 塔顶第 %d 行（檐口第 %d 行）—— 要么没冒出屋面、要么冲出画布",
                 G.tower.top, eaveY);
  if (G.tower.x0 <= x0 || G.tower.x1 >= x1)
    console.warn("70_jianyi: 塔 x[%d,%d] 越出立面 [%d,%d]", G.tower.x0, G.tower.x1, x0, x1);
  /* 字母闸：6 个字母要全部落在塔面上 */
  const lBot = G.letter.y0 + 6 * G.letter.step - (G.letter.step - G.letter.h);
  if (G.letter.x < G.tower.x0 || G.letter.x + G.letter.w > G.tower.x1 ||
      G.letter.y0 < G.tower.top || lBot > baseY)
    console.warn("70_jianyi: BJTUSA 字母块 x[%d,%d] 行[%d,%d] 越出塔面 [%d,%d]×[%d,%d]",
                 G.letter.x, G.letter.x + G.letter.w, G.letter.y0, lBot,
                 G.tower.x0, G.tower.x1, G.tower.top, baseY);
  /* 棚架闸：栏板在顶板之上、前缘在顶板之下，三段不能叠 */
  const cp = G.canopy;
  if (!(cp.glaTop < cp.deckTop && cp.deckTop < cp.deckBot && cp.deckBot <= cp.edgeBot))
    console.warn("70_jianyi: 棚架三段行序乱了 [%d,%d,%d,%d] —— JY_CANOPY 四个 y 配不上",
                 cp.glaTop, cp.deckTop, cp.deckBot, cp.edgeBot);
  if (cp.edgeBot >= baseY)
    console.warn("70_jianyi: 棚架前缘第 %d 行已落到落地线(%d)以下 —— 把底层玻璃整条吃掉了",
                 cp.edgeBot, baseY);
  /* 招牌闸：板面要整个落在立面里、且不与棚架柱区重叠到看不见 */
  const s = G.sign;
  if (s.x0 <= x0 || s.x1 >= x1 || s.top <= cp.edgeBot || s.bot > baseY - 2)
    console.warn("70_jianyi: 招牌 x[%d,%d] 行[%d,%d] 位置不对（棚架前缘第 %d 行 / 落地线 %d）",
                 s.x0, s.x1, s.top, s.bot, cp.edgeBot, baseY);
  return G;
}

/* --- 5.19.4 BJTUSA 五个点的字模 ---------------------------------------------
   5 宽 × 7 高、行优先 MSB 在左（只用到低 5 位）。手写而不是走系统字体二值化：
   这六个字母是要**放大 2 倍**贴到塔上的，二值化出来的 11px 抗锯齿字放大后会带
   灰边（30 段 §3.0 讲的同一件事），而 5×7 点阵放大 2 倍是干净的 10×14 硬边。 */
const JY_LET = {
  B: [0x1E, 0x11, 0x11, 0x1E, 0x11, 0x11, 0x1E],
  J: [0x07, 0x02, 0x02, 0x02, 0x02, 0x12, 0x0C],
  T: [0x1F, 0x04, 0x04, 0x04, 0x04, 0x04, 0x04],
  U: [0x11, 0x11, 0x11, 0x11, 0x11, 0x11, 0x0E],
  S: [0x0F, 0x10, 0x10, 0x0E, 0x01, 0x01, 0x1E],
  A: [0x0E, 0x11, 0x11, 0x1F, 0x11, 0x11, 0x11]
};
const JY_TLET_TXT = "BJTUSA";

/* --- 5.19.5 招牌金字：系统字体 → 二值化（照 30 段 §3.0 makeSign 那一套） -------
   与 30 段那份的区别只有一处：**字号可传**。30 段的 SIGN_FS=18 是"屋名牌"的规格
   （楼名最宽 6 字、牌面 128），而本段的招牌板只有 84 行宽、要塞 6 个中文字，
   只能走 12px。所以这里另起一个（**不复用 `_signCache`**：那份缓存按"名字"存，
   存的却是 18px 的牌面，混用会让本段的招牌静默变成 128 行宽的大牌子）。 */
function jyPlate(txt, fs) {
  const t = mkCanvas(8, 8);
  let tc = t.getContext("2d");
  const FONT = "bold " + fs + "px 'Microsoft YaHei','SimHei','PingFang SC',sans-serif";
  tc.font = FONT;
  const tw = Math.ceil(tc.measureText(txt).width) + 4, th = fs + 8;
  t.width = tw; t.height = th;                 // ⚠️ 改尺寸会重置上下文，必须重取
  tc = t.getContext("2d");
  tc.font = FONT;
  tc.textBaseline = "top";
  tc.fillStyle = "#000";
  tc.fillText(txt, 2, 3);
  const d = tc.getImageData(0, 0, tw, th).data;
  const pts = [];
  let minX = tw, maxX = -1, minY = th, maxY = -1;
  for (let y = 0; y < th; y++) {
    for (let x = 0; x < tw; x++) {
      if (d[(y * tw + x) * 4 + 3] > 100) {
        pts.push(x, y);
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) return null;                   // 拿不到字形
  return { pts: pts, w: maxX - minX + 1, h: maxY - minY + 1, minX: minX, minY: minY };
}
function jyStamp(g, pl, x, y, col) {
  g.fillStyle = col;
  for (let i = 0; i < pl.pts.length; i += 2)
    g.fillRect(x + pl.pts[i] - pl.minX, y + pl.pts[i + 1] - pl.minY, 1, 1);
}

/* --- 5.19.6 屋面（行 [PADT, eaveY)）------------------------------------------
   照片是正射图、看不到顶面，所以这一块是**自设计**的：浅米色平顶 + 女儿墙 +
   两个设备箱。笔法照 30 段 §3.2（同一套明暗层次），只是换了色 —— 楼的女儿墙
   在照片里是浅黄白（与墙同色系），不是 30 段 `pal.roof` 的棕色。
   ⚠️ 覆盖范围含 30 段的**檐口外沿**那两笔（`x0-3 .. x1+3`）：不盖的话，浅色
      屋面的左右各会留下两条棕色竖边（出图像"屋顶镶了棕框"）。 */
function jyRoof(g, G) {
  const ex0 = G.x0 - 3, ex1 = G.x1 + 3;
  px(g, ex0, JY_PADT, ex1 - ex0, G.roofT, JY_C.R_EDGE);          // 檐口外沿
  px(g, G.x0, JY_PADT + 2, G.w, G.roofT - 5, JY_C.R_DECK);       // 板面
  px(g, G.x0, JY_PADT + 2, G.w, 4, JY_C.R_TOP);                  // 女儿墙顶受光
  px(g, G.x0, JY_PADT + 6, G.w, 3, "rgba(14,18,28,0.30)");       // 女儿墙内阴影
  px(g, G.x0, JY_PADT + 6, 4, G.roofT - 9, JY_C.R_LIT);          // 左内侧受光
  px(g, G.x1 - 4, JY_PADT + 6, 4, G.roofT - 9, JY_C.R_DIM);      // 右内侧背光
  px(g, ex0, JY_PADT + G.roofT - 1, ex1 - ex0, 2, JY_C.R_EAVE);  // 檐口投影线
  /* 设备箱：两个固定位置（**不掷 RNG** —— 本段不许碰共享流）。
     左边一个、中间偏左一个；右边那片留给玻璃塔（塔会自己盖上来的）。 */
  const dev = [[G.x0 + 56, JY_PADT + 30, 48, 20], [G.x0 + 236, JY_PADT + 46, 62, 24]];
  for (let i = 0; i < dev.length; i++) {
    const dx = dev[i][0], dy = dev[i][1], dw = dev[i][2], dh = dev[i][3];
    px(g, dx + 4, dy + 4, dw, dh, "rgba(14,18,28,0.30)");        // 投影
    px(g, dx, dy + dh - 4, dw, 4, JY_C.DEVD);                    // 侧墙
    px(g, dx, dy, dw, dh, JY_C.DEV);
    px(g, dx, dy, dw, 3, JY_C.R_TOP);
    px(g, dx, dy + dh - 1, dw, 1, "rgba(14,18,28,0.30)");
  }
  /* 斑点（30 段同款），局部 RNG ⇒ 不碰建筑序列 */
  const rng = makeRng(7019);
  speckle(g, G.x0 + 4, JY_PADT + 7, G.w - 8, G.roofT - 12, "rgba(255,255,255,0.06)", (G.w / 3) | 0, rng);
  speckle(g, G.x0 + 4, JY_PADT + 7, G.w - 8, G.roofT - 12, "rgba(0,0,0,0.06)", (G.w / 4) | 0, rng);
}

/* --- 5.19.7 墙面 + 五排窗 ----------------------------------------------------
   排窗自下而上 f = 0（首层落地大玻璃）… f = 4（顶层）。
   窗的绘制元素照照片：白框（外缘一圈受光）+ 洞口 + 上高光 + 中横棂 + 下部白百叶
   （照片里中层那三排窗的下半部有一条白色横栅，顶层没有）。 */
function jyFront(g, G) {
  const x0 = G.x0, x1 = G.x1, w = G.w, eaveY = G.eaveY, baseY = G.baseY;
  /* 墙底：整面浅黄（左棱受光、右棱背光，同 30 段同一套 SUN 方向） */
  px(g, x0, eaveY, w, G.wallH, JY_C.WALL);
  px(g, x0, eaveY, 3, G.wallH, JY_C.WALLT);                      // 左棱受光
  px(g, x1 - 4, eaveY, 4, G.wallH, JY_C.WALLD);                  // 右棱背光
  for (let i = 0; i < 10; i++)                                   // 檐下阴影带
    px(g, x0, eaveY + i, w, 1, "rgba(14,18,28," + (0.30 * (1 - i / 10)).toFixed(3) + ")");
  px(g, x0, eaveY + 1, w, 1, "#efe8bc");                         // 檐口线
  /* 层间腰线：每层分界一道（全校统一的 34 行网格） */
  for (let f = 1; f < JY_FLOORS; f++) {
    const y = eaveY + f * FLOOR_H;
    px(g, x0, y, w, 1, JY_C.WALLD);
    px(g, x0, y + 1, w, 1, "rgba(255,255,255,0.42)");
  }
  /* 窗阵：f = 1..4 是标准层；f = 0 是首层落地大玻璃（另画） */
  for (let f = 1; f < JY_FLOORS; f++) {
    const wy = G.winTop[f];
    for (let k = 0; k < JY_COLS; k++) jyWin(g, G.winX[k], wy, JY_WIN_W, JY_WIN_H, f);
  }
  /* 首层：贯通全宽的落地玻璃门厅（照片里底层是被柱子分段的一整条大玻璃） */
  jyLobby(g, G);
  /* 墙面雨水管（照片里那根从檐口直落到底的灰色竖管） */
  px(g, G.pipe, eaveY + 3, 3, baseY - eaveY - 3, JY_C.PIPE);
  px(g, G.pipe, eaveY + 3, 1, baseY - eaveY - 3, "#d2d6da");
  px(g, G.pipe + 2, eaveY + 3, 1, baseY - eaveY - 3, "#9aa0a8");
  px(g, G.pipe - 1, eaveY + Math.round(G.wallH * 0.5), 5, 2, "#9aa0a8");
  px(g, G.pipe - 1, baseY - 14, 5, 2, "#9aa0a8");
  /* 外轮廓（照 30 段 §3.8 的位置，换成这栋楼的浅黄色系） */
  px(g, x0 - 1, eaveY, 1, G.wallH + 1, "#d9d0a4");
  px(g, x1, eaveY, 1, G.wallH + 1, "#b8b08a");
}

/* --- 5.19.7a 一扇窗（白框 + 洞 + 高光 + 横棂 + 下百叶）---------------------- */
function jyWin(g, x, y, w, h, f) {
  const lv = (f === 2 || f === 3 || f === 4);      // 照片：上面三排有白百叶，顶层没有
  px(g, x - 1, y - 1, w + 2, h + 2, JY_C.FRAME);   // 白框外缘
  px(g, x, y, w, h, "#2c3746");                    // 洞口（深底，四边留一圈）
  px(g, x + 1, y + 1, w - 2, h - 2, JY_C.WIND);    // 玻璃
  px(g, x + 1, y + 1, w - 2, 5, JY_C.WIN);         // 玻璃上段
  px(g, x + 2, y + 2, w - 4, 3, JY_C.WINL);        // 上高光
  px(g, x + w - 3, y + 2, 2, h - 8, "rgba(10,13,20,0.30)");
  px(g, x + Math.round(w / 2), y + 1, 1, h - 2, JY_C.FRAME);   // 竖窗棂（照片里每扇一分为二）
  if (lv) {                                        // 窗下白百叶
    const by = y + h - Math.round(h * 0.34);
    px(g, x + 1, by, w - 2, y + h - by - 1, JY_C.LOUVER);
    for (let yy = by + 1; yy < y + h - 1; yy += 2) px(g, x + 1, yy, w - 2, 1, "#c9c7b4");
  }
  px(g, x - 2, y + h, w + 4, 2, JY_C.WALLT);       // 窗台受光
  px(g, x - 2, y + h + 2, w + 4, 1, "rgba(14,18,28,0.24)");    // 窗台投影
}

/* --- 5.19.7b 首层落地大玻璃门厅 ---------------------------------------------- */
function jyLobby(g, G) {
  const y0 = G.winTop[0], y1 = G.baseY - 1;
  const x0 = G.x0 + 6, x1 = G.x1 - 6;
  px(g, x0 - 2, y0 - 2, x1 - x0 + 4, y1 - y0 + 3, JY_C.FRAME);
  px(g, x0, y0, x1 - x0, y1 - y0 + 1, JY_C.WIND);
  px(g, x0, y0, x1 - x0, 6, JY_C.WIN);
  px(g, x0 + 2, y0 + 2, x1 - x0 - 4, 4, JY_C.WINL);
  /* 竖框：与窗阵同一组中轴，读作"门厅被柱后的一排竖框分格" */
  for (let k = 0; k < JY_COLS; k++) {
    const vx = G.winX[k] + Math.round(JY_WIN_W / 2);
    px(g, vx - 1, y0, 2, y1 - y0 + 1, JY_C.FRAME);
    px(g, vx + 1, y0, 1, y1 - y0 + 1, "rgba(10,13,20,0.22)");
  }
  px(g, x0, y1 - 5, x1 - x0, 6, JY_C.WALLD);       // 底部墙裙
  px(g, x0, y1 - 5, x1 - x0, 1, "rgba(255,255,255,0.30)");
}

/* --- 5.19.8 玻璃塔 + BJTUSA --------------------------------------------------
   塔画在**墙与窗之后、棚架之前**：照片里塔是凸出立面的体块（前景），而棚架又在
   塔前面。塔的左缘紧贴第 5 扇窗的右沿，这是照片上的实际关系（不刻意对齐）。 */
function jyTower(g, G) {
  const t = G.tower, x0 = t.x0, x1 = t.x1, y0 = t.top, y1 = G.baseY - 1;
  const w = x1 - x0 + 1;
  /* 塔体：深蓝灰幕墙 + 左受光 / 右背光 */
  px(g, x0, y0, w, y1 - y0 + 1, JY_C.TOWER);
  px(g, x0, y0, 3, y1 - y0 + 1, JY_C.TOWL);
  px(g, x1 - 2, y0, 3, y1 - y0 + 1, JY_C.TOWD);
  /* 竖向分格：每 16 行一道浅线（幕墙的竖梃） */
  for (let x = x0 + 16; x < x1 - 3; x += 16) px(g, x, y0 + 2, 1, y1 - y0 - 3, JY_C.TOWL);
  /* 层间横线：与全校 34 行层网格同线（读作"塔的楼板与主楼对齐"） */
  for (let f = 1; f < JY_FLOORS; f++) {
    const y = G.eaveY + f * FLOOR_H;
    if (y <= y0 || y >= y1) continue;
    px(g, x0, y, w, 2, JY_C.TOWD);
  }
  px(g, x0, y0, w, 2, "#5a646f");                  // 塔顶受光棱
  px(g, x0, y0, 2, y1 - y0 + 1, "#5a646f");
  px(g, x0 - 1, y0, 1, y1 - y0 + 1, "#232a32");    // 左轮廓
  px(g, x1 + 1, y0, 1, y1 - y0 + 1, "#232a32");    // 右轮廓
  /* BJTUSA：6 个字母竖排（照片上就贴在塔的右缘） */
  for (let i = 0; i < JY_TLET_TXT.length; i++) {
    const ch = JY_TLET_TXT.charAt(i);
    const rows = JY_LET[ch];
    if (!rows) continue;
    const ly = G.letter.y0 + i * G.letter.step;
    for (let r = 0; r < 7; r++) {
      const bits = rows[r];
      for (let c = 0; c < 5; c++)
        if (bits & (16 >> c))
          px(g, G.letter.x + c * G.letter.s, ly + r * G.letter.s, G.letter.s, G.letter.s, JY_C.LT);
    }
  }
}

/* --- 5.19.9 木棚架 + 树状柱 --------------------------------------------------
   自上而下三段：玻璃栏板（浅蓝）→ 木顶板（亮木色高面 + 暗面）→ 深木前缘。
   柱在棚架**之后**画（柱顶接板底、不重叠），每根柱自下而上由一条柱身张开成两撇
   —— 这就是照片上那套"树枝托顶板"的读法。 */
function jyCanopy(g, G) {
  const c = G.canopy, x0 = c.x0, x1 = c.x1, w = x1 - x0;
  /* ① 玻璃栏板（在顶板**北侧**，屏幕上更靠上） */
  px(g, x0, c.glaTop, w, c.deckTop - c.glaTop, JY_C.GLA);
  px(g, x0, c.glaTop, w, 2, JY_C.GLAL);
  px(g, x0, c.deckTop - 2, w, 2, JY_C.GLAD);
  for (let x = x0 + 8; x < x1 - 4; x += 26) px(g, x, c.glaTop + 2, 1, c.deckTop - c.glaTop - 3, JY_C.GLAL);
  /* ② 木顶板 */
  px(g, x0, c.deckTop, w, c.deckBot - c.deckTop, JY_C.WD);
  px(g, x0, c.deckTop + 1, w, 4, JY_C.WDL);                    // 顶板受光面
  px(g, x0, c.deckBot - 4, w, 4, JY_C.WDD);                    // 板下暗面
  px(g, x0, c.deckTop, 3, c.deckBot - c.deckTop, JY_C.WDL);    // 左端受光
  px(g, x1 - 3, c.deckTop, 3, c.deckBot - c.deckTop, JY_C.WDD);// 右端背光
  /* ③ 深木前缘（照片里板前那一条深色的收边） */
  px(g, x0, c.deckBot, w, c.edgeBot - c.deckBot + 1, JY_C.WEDGE);
  px(g, x0, c.deckBot, w, 1, "#a4764f");
  px(g, x0, c.edgeBot, w, 1, "#5d3c28");
  /* ④ 树状柱 */
  const yTop = c.edgeBot + 1, yBot = G.baseY, ySplay = yTop + Math.round((yBot - yTop) * 0.42);
  const hw = Math.round(G.colW / 2);
  for (let k = 0; k < G.colX.length; k++) {
    const cx = G.colX[k];
    if (cx - 10 < x0 || cx + 10 > x1) continue;                // 棚架之外不长柱
    /* 柱身（下段直的） */
    px(g, cx - hw, ySplay, G.colW, yBot - ySplay, JY_C.COL);
    px(g, cx - hw, ySplay, 2, yBot - ySplay, JY_C.COLL);
    px(g, cx + hw - 2, ySplay, 2, yBot - ySplay, JY_C.COLD);
    /* 张开的两撇（上段，越往上越开） */
    const n = ySplay - yTop;
    for (let i = 0; i < n; i++) {
      const y = ySplay - 1 - i;
      const t = i / (n || 1);
      const spread = hw + Math.round(t * (hw + 3));            // hw → 2hw+3
      px(g, cx - spread, y, 3, 1, JY_C.COLL);
      px(g, cx + spread - 2, y, 3, 1, JY_C.COLD);
      px(g, cx - spread + 3, y, spread - hw, 1, JY_C.COL);
      px(g, cx + hw, y, spread - hw, 1, JY_C.COL);
    }
    px(g, cx - 2, yTop, 5, 2, JY_C.WEDGE);                     // 柱顶与板底的接头
  }
}

/* --- 5.19.10 塔前台阶 + 招牌 -------------------------------------------------- */
function jyStair(g, G) {
  const s = G.stair, y1 = G.baseY;
  /* 照片里这是塔前一段斜向上的踏步。画成四级、逐级变窄的浅灰台阶 */
  const steps = 4, h = Math.round((y1 - s.top) / steps);
  for (let i = 0; i < steps; i++) {
    const y = y1 - (i + 1) * h;
    const inset = i * 3;
    px(g, s.x0 + inset, y, (s.x1 - s.x0) - inset * 2, h, i % 2 ? "#c9c6ba" : "#d6d3c6");
    px(g, s.x0 + inset, y, (s.x1 - s.x0) - inset * 2, 1, "#e6e3d6");
    px(g, s.x0 + inset, y + h - 1, (s.x1 - s.x0) - inset * 2, 1, "rgba(14,18,28,0.26)");
  }
}
function jySign(g, G) {
  const s = G.sign;
  const w = s.x1 - s.x0 + 1, h = s.bot - s.top + 1;
  px(g, s.x0 + 3, s.top + 3, w, h, "rgba(14,18,28,0.34)");       // 投影
  px(g, s.x0, s.top, w, h, JY_C.SIGN);
  px(g, s.x0, s.top, w, 1, JY_C.SIGNL);                          // 上棱受光
  px(g, s.x0, s.bot, w, 1, JY_C.SIGND);                          // 下棱背光
  px(g, s.x0, s.top, 1, h, JY_C.SIGNL);
  px(g, s.x1, s.top, 1, h, JY_C.SIGND);
  /* 金色中文（12px 二值化）+ 下面一行小字英文（那个尺度画成一条浅色虚线） */
  const pl = jyPlate(JY_NAME, 12);
  if (pl) {
    jyStamp(g, pl, s.x0 + Math.round((w - pl.w) / 2), s.top + 3, JY_C.GOLD);
  } else {
    console.warn("70_jianyi: 招牌的金字没拿到字形（jyPlate 返回 null）—— 只剩一块空板");
  }
  const eY = s.bot - 7;
  for (let x = s.x0 + 6; x < s.x1 - 4; x += 3) px(g, x, eY, 2, 1, "#bfae86");
  px(g, s.x0 + 4, s.bot - 9, w - 8, 1, "rgba(0,0,0,0.22)");
}

/* --- 5.19.11 覆盖重绘入口 ----------------------------------------------------
   ⚠️ 必须在这里、addProp **之前**调（60_assemble.js）—— 重绘的是精灵，
      晚一步 addProp 已经把旧精灵挂进 props 了（gymRestyle/…/qjRestyle 同一规矩）。
   ⚠️ 本函数**不碰共享 RNG**（唯一的随机量是 §5.19.6 屋面斑点的局部 makeRng(7019)）。
   ⚠️ 它**不换画布、不动 b.ay**：覆盖的只有行 [PADT, baseY)（屋面 + 立面），
      台阶与投影全在 baseY 以下 —— 与 61/67/68 段那条"换画布 + 挪 b.ay"的路
      不是一回事，不要照抄那几段。世界落地线、碰撞盒、footprint 一个字节不动。
   ⚠️ 第三个实参照 65/67/68/69 段传 `pal`：本段用不上它（色全是照片实测的），
      实参留着只为与那一串调用签名对齐。本段不许再存一份 PALETTE（TDZ，58 段栽过）。 */
function jyRestyle(b, pal) {
  const c = b.canvas, g = c.getContext("2d");
  const G = jyGeo(c);
  /* ① 覆盖整个立面（含 30 段那两条外轮廓，左右各多盖 1px）+ 整个屋面 */
  px(g, G.x0 - 1, G.eaveY, G.x1 - G.x0 + 2, G.baseY - G.eaveY, JY_C.WALL);
  jyRoof(g, G);
  /* ② 立面：墙 → 窗 → 首层门厅 → 雨水管，然后塔 → 棚架 → 柱 → 台阶 → 招牌 */
  jyFront(g, G);
  jyTower(g, G);
  jyCanopy(g, G);
  jyStair(g, G);
  jySign(g, G);
  /* ③ 接地阴影带（30 段 §3.8 那一笔，被 ② 的立面覆盖吃掉了，按同一支笔补回） */
  contactBand(g, G.x0 + 1, G.x1 - 1, G.baseY - 1, 2, 0.34);
  return b;
}
