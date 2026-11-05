/* ============================================================================
 * §5.6 明湖三景 —— 明湖石碑 / 湖心岛 + 小亭子 / 水中央的石塔
 *      —— 源：_build/_photo/ 的 minghu1.jpg（石碑 + 亭子）、minghutingzi1.jpg
 *            （亭子与湖心岛的近正俯视）、minghu2.jpg（石塔）
 *      位置：_build/_photo/minghudetail.txt（用户手写的三个坐标）
 * ----------------------------------------------------------------------------
 * 一、坐标来源，以及**唯一那个必须动的 y**
 *   用户给的：  湖心亭 2804 1073 / 明湖石碑 2727 1187 / 明湖石塔 2938 1356
 *   ⚠️ 那份 detail 写于 2026-09-13 16:50，**早于同一轮的「明湖缩小」**（16:55）——
 *      三个 y 都是按**旧湖**量的（旧湖面 y1016.9..1431.6，湖底 = IX(3.6653)）。
 *      缩小后湖底北移到 1328.01，掉了 103.6px。于是：
 *        · 湖心亭 1073   —— **不动**。旧湖新湖里都在水面内（离北岸 56px）。
 *        · 明湖石碑 1187 —— **不动**。它站在西岸那条环湖砖路上，本来就不在水里。
 *        · 明湖石塔 1356 —— **必须北移 103**，取 1253。1356 在新湖里已经落到
 *          南岸石板路**上**了，塔会长在路面上；而用户要的是「**水中央**的石塔」。
 *          北移之后它仍在水中，且"离南岸 75px"这个**关系**与旧湖里一模一样
 *          （1356 距旧湖底 75.6px）。动的量 = 湖缩掉的量，不是审美。
 *    ⇒ 三件里只有塔的 y 动了，理由写在 §5.6.5 头注里，随时可以核。
 *
 * 二、为什么三件都是**画在地面之上的道具**（而不是画进地面烘焙层）
 *   渲染顺序（产物主循环）：地面烘焙 → **drawWater（每帧的动态水层）** → 道具
 *   （按 baseY 排序）。水层在道具**之前** —— 所以岛 / 亭 / 塔做成道具，天然盖住
 *   每帧画上来的波纹；若画进 groundCanvas，每帧的波纹会**画到岛和塔的上面**去，
 *   一眼假。代价是紧贴岛身的那圈波纹被压掉 —— 这正是实拍的样子（物体挡水）。
 *
 * 三、"一张精灵只有一个 baseY"这条老规矩在这里怎么用
 *   §5.5 台阶那轮的判据是「画布竖直跨度里若存在**玩家能站的地面**就拆道具」。
 *   湖心岛**有**能站的台面，但**玩家永远上不去**（四周是水，见 §5.6.6）——
 *   所以岛 + 亭 + 假山 + 石桥**并成一张精灵**是对的，拆开反而必错：
 *   岛在画面里**横跨**亭子的基座（岛的前半在亭前、后半在亭后），分成两张之后
 *   无论谁先谁后，总有一半边是错的（后画的那张会把自己那一半压到对方身上）。
 *   并成一张，内部画序自己说了算（清单见 §5.6.4e 头注）。
 *
 * 四、字（用户点名要「包括字体」）
 *   点阵由 _build/_mhfont.py 从 **用户提炼的 `_photo/minghufont.png`**（白底黑字）
 *   二值化降采样而来，点阵在下面的生成块里。
 *   ⚠️ 走的不是 FZYTK 渲染那条路 —— 那是第一版，用户 2026-09-13 当天退回：
 *     「明湖两字过于粗糙，我希望你能够还原这个字体」。原物本来就是毛笔写的（不是姚体），
 *     姚体 20px 下笔画只剩 2-3px，又细又板；提炼件是干净的二值图，抠字这条路重新成立。
 *   照片（minghu1.jpg）仍然只用来**量版面** —— 两字的大小、
 *   「明在右上、湖在左下」的斜向排布、左侧那列落款的位置。
 * ==========================================================================*/

/*__MH_GEN_BEGIN__*/
/* ==== 由 _build/_mhfont.py 生成，勿手改 ==== */
/* 明湖石碑「明湖」二字点阵 —— 源是用户从照片里提炼的 _photo/minghufont.png
   （白底黑字，阈值 <110 一刀切），**不是**系统字体渲染。
   ⚠️ 第一版走的是 FZYTK 渲染，20px 下笔画只有 2-3px，太细太板 —— 用户退回重做。
   逐字高 20/20。两字在石面上是**斜向排布**（明在右上、湖在左下，中间留一行空），
   排布不在这里 —— 在 §5.6.4 makeMinghuStone() 末尾那两行 mhGlyph 调用，
   是照照片量的。⚠️ 这里**故意不写坐标数字**：字宽随长宽比走，换一次源就要重算，
      写死一份到生成块里必然和调用点对不上（上一版就是这么留了组错坐标）。 */
const MH_MASK_MING = "AADAA54AP/Djz/8Y/zuO47/uO+7/uO/7vuO/7juG7/Bv9wf4YHYOBwDG8Bw/AwHwQA4=";
const MH_MASK_HU = "AMABg8DHhwePHD88eDwD9Og/37v4fnLhucPn4l/fgf/mDz+Yfuxjv7He/Mdxg13AAfYAA8AABg==";
/* [点阵, 宽, 高] —— 顺序：明 湖 */
const MH_CHARS = [
  [MH_MASK_MING, 20, 20],
  [MH_MASK_HU, 22, 20]
];
/* ==== 生成块结束 ==== */
/*__MH_GEN_END__*/

/* --- 5.6.1 三件东西的落点（世界像素；与 minghudetail.txt 的对应见文件头一） --- */
const MH_ST_X = 2727, MH_ST_BY = 1187;        // 石碑：碑心 x / 落地线 y（**照抄用户值**）
const MH_ISLE_X = 2804, MH_ISLE_BY = 1108;    // 湖心岛：亭子中轴 x / 精灵落地线
                                              // ⚠️ BY = 1073 + (AY − CY) = 1073 + 35
const MH_TW_X = 2938, MH_TW_BY = 1253;        // 石塔：塔心 x / 塔底 y（= 1356 − 103.6）

/* 石碑精灵：40 × 74（+4 行投影）。**比例照照片**：实拍石头 235×515 → 1:2.19，
   这里 40:74 = 1:1.85，比实拍略矮胖 —— 照片是斜侧光仰拍（近大远小把石头拉长了），
   而 74 已经比校名石（63）还高一截，再高就压过路灯了。 */
const MH_ST_W = 40, MH_ST_H = 74, MH_ST_AX = 20, MH_ST_AY = 74;

/* 湖心岛精灵：120 × 132，锚点 (66, 125)。
   坐标系是"世界 x = 2738 + 精灵 x"（2738.06 = 湖面西缘 = IX(7.0104)）——
   于是精灵 x0 正好落在**水面与西岸的接缝**上：西端那截石桥（x0..26）从岸沿
   搭到岛的西平边，一寸不多一寸不少，而且**不伸进环湖小路那格**（x2720..2736），
   否则玩家沿西岸走过时会被桥面盖住脚（见 §5.6.6 末注）。
   ⚠️ 岛心 = 亭子中轴 = 精灵 x66 = 世界 2804 = 用户给的湖心亭 x。
   ⚠️ 竖向：精灵比第一版高了 24px（108 → 132），抬高的是**亭子上方**那截 ——
      攒尖举高改陡之后亭子从 73px 长到 86px（见下面的预算），岛本身没动。
      AY − CY = 125 − 90 = 35 = 岛心到落地线（= 岛南尖角 27 + 石壁 8），
      所以 MH_ISLE_BY = 1073 + 35 = 1108，而**铺装中心仍然落在用户给的 1073**。 */
const MH_ISLE_W = 120, MH_ISLE_H = 132, MH_ISLE_AX = 66, MH_ISLE_AY = 125;
const MH_ISLE_CY = 90;                        // 岛心（六边形台面中心）在精灵里的 y
const MH_ISLE_R = 46, MH_ISLE_RY = 27;        // 台面六边形：x 半径 46 / y 半径 27

/* ⚠️ 5.6.1b 两个"比例常数"，岛和屋顶都从这里取 —— 别再散落成字面量 */
/* 水平面在屏上的 y 压扁 = 1/1.71。这不是我编的：§5.3 雕塑的花坛（76×44）用的就是
   `ry = rx / 1.71`，Demo 里的树冠用 0.8 —— 1.71 是本项目**地面正圆**的既定约定。
   湖心岛的铺装是**正六边形**（南北尖角），所以屏上 = R×0.585。 */
const MH_HEX_K = 0.585;
/* 攒尖举高 / 檐半宽。照片（minghu1.jpg / minghutingzi1.jpg）里的六角攒尖很陡 ——
   第一版按 0.62 画，结果檐角比攒尖还高，整座亭子的顶读成一张平饼。
   0.95 保证攒尖明确压过北檐角（余量 = (0.95−0.585)·rx − 翼角起翘）。 */
const MH_PITCH = 0.95;

/* 亭子（全部按"台面中心"往上量）。竖向预算 90 → 0，一共 90px：
     石台基 6 + 柱 26 + 下檐举高 25 + 上层柱可见 14 + 上檐举高 16 + 宝顶 5 = 92 … 顶到精灵边
   举高 = rx × MH_PITCH，**由 mhRoof 自己算并返回攒尖 y**（下一层从返回值往上接），
   所以这里没有"攒尖 y"常量 —— 第一版把它写成常量 (MH_P_APEX / MH_P_U_APEX)，
   画的时候却由 rx 现算，两者一漂移，宝顶就悬在屋顶上面 11px 飘着。
   柱区 : 檐宽 = 26:52 ≈ 0.5，实拍 170:275 = 0.62 —— 略矮，但再高就顶出精灵了。 */
const MH_P_TIER = 84;                         // 亭子石台基的顶面 = 柱脚线（= CY − 6）
const MH_P_PIL = 17;                          // 柱环半宽
const MH_P_EAVE = 26;                         // 下檐半宽（檐口在精灵里横跨 52）
const MH_P_U_EAVE = 17;                       // 上檐半宽

/* ⚠️ 5.6.1c 上层柱（童柱）—— 2026-09-13 第二轮补的，用户原话：
     「亭子上边那一小层没有柱子支撑」。第一版把上层柱画在**下檐攒尖之上** 8px 的空中，
     而上檐的南坡正好向下垂 8px、严丝合缝盖住 —— 一根柱脚都看不见，那一层就是
     两块屋顶对顶着悬浮。根因不是柱高不够，是**画的次序反了**：
     上层柱必须画在**下檐之前**，让下檐的戗脊（屋脊线）自己去切柱脚。
     屋脊在屏上是个 V（攒尖 33 → 檐角 62.5），每根柱子各自被自己那条戗脊切掉，
     露出来的长度就自动是对的 —— 不需要给每根柱子单独量一个柱脚 y。
   MH_P_U_Y  上层柱顶（= 上檐的檐口线）。这个值同时决定上檐多高、宝顶多高：
             上檐攒尖 = MH_P_U_Y − rx×0.95 = MH_P_U_Y − 16，宝顶再往上 5，
             所以 MH_P_U_Y ≥ 21 才能让宝顶不顶出精灵（21 → 宝顶占满第 0 行）。
   MH_P_U_R  上层柱环半宽（六角上层的前三个柱脚在 0 / ±0.866R ⇒ ±10）
   MH_P_U_FOOT  柱脚画到这儿为止。**故意画得比屋脊低** —— 多出来的那截会被
             下檐盖掉，这样柱脚永远严丝合缝地坐在脊上（画浅了就会露出一条缝）。 */
const MH_P_U_Y = 21, MH_P_U_R = 12, MH_P_U_FOOT = 56;

/* 石塔精灵：26 × 54，锚点 (13, 52)。水面线在精灵 y44（下面 8px 是没入水中的台座）。 */
const MH_TW_W = 26, MH_TW_H = 54, MH_TW_AX = 13, MH_TW_AY = 52;
const MH_TW_WL = 44;                          // 吃水线（精灵 y）

/* --- 5.6.2 用色（全部取三张照片的中位色） --- */
/* 花岗岩：户外风化过的**暖浅灰** —— 不是冷灰也不是白（照片里它比水面的绿灰亮一档） */
const MH_GK_L = "#c0bcb0", MH_GK = "#a49f94", MH_GK_D = "#827d72", MH_GK_S = "#5e5952";
const MH_GK_W = "#b6b2a6";                    // 刻字崩口那圈**浅色石茬**（照片里每笔都有）
const MH_INK = "#22242a";                     // 刻痕（近黑，不是纯黑）
/* 琉璃瓦：橙黄瓦面 + 绿剪边（近正俯视图里最清楚：坡面橙、檐口与戗脊绿） */
const MH_RF_L = "#dd9a52", MH_RF = "#c07436", MH_RF_D = "#8e5222";
const MH_GL_L = "#4a8a63", MH_GL = "#2e6b4a", MH_GL_D = "#1d4a33";
/* 亭子的木作 */
const MH_PL_L = "#9c5442", MH_PL = "#7a3a2c", MH_PL_D = "#52241c";
const MH_IN_D = "#2c3d34", MH_IN_L = "#43584b";      // 亭内暗部 / 美人靠
/* 台面石板（近正俯视图里的六边形铺装）、岛缘、假山石 */
const MH_PV_L = "#b4b0a2", MH_PV = "#9c988c", MH_PV_D = "#7e7a6e", MH_PV_J = "#6a665c";
const MH_RK_L = "#c6c2b4", MH_RK = "#a8a496", MH_RK_D = "#78746a";
/* 石塔：乳白偏黄的石灯，被水汽蚀出灰绿竖纹 */
const MH_TL_L = "#e4ddc4", MH_TL = "#cdc5a8", MH_TL_D = "#a49c82", MH_TL_S = "#7c7563";
const MH_TL_G = "#a8ab8e";
/* 塔所在环带的湖水色（见 paintWaterBase 的 mix 算式）—— 水下那截石台座要混它 */
const MH_TW_WATER = "#629bc3";

/* --- 5.6.3 刻字点阵 → 逐像素落笔 ---
   与 §5.5.3 的金字（`gyGlyph`）正好**反过来**：金字是凸出来的（上亮下暗），
   碑字是**凹进去**的（刻痕近黑 + 四周一圈崩口的浅色石茬）。
   那圈石茬是这块碑一眼能认出"这是刻的不是印的"的全部依据，不能省。
   ⚠️ 刻痕本身**不加**上下压暗：凹进去的东西加压暗边只会糊成一团疙瘩。 */
function mhBits(b64, cnt) {
  const s = atob(b64), out = new Uint8Array(cnt);
  for (let i = 0; i < cnt; i++) out[i] = (s.charCodeAt(i >> 3) >> (7 - (i & 7))) & 1;
  return out;
}
function mhGlyph(g, b64, nw, nh, x, y) {
  const b = mhBits(b64, nw * nh);
  const at = (i, j) => (i >= 0 && j >= 0 && i < nw && j < nh && b[j * nw + i]) ? 1 : 0;
  for (let j = -1; j <= nh; j++)                     // ① 崩口石茬（字外一圈 1px）
    for (let i = -1; i <= nw; i++) {
      if (at(i, j)) continue;
      if (at(i - 1, j) || at(i + 1, j) || at(i, j - 1) || at(i, j + 1) ||
          at(i - 1, j - 1) || at(i + 1, j - 1) || at(i - 1, j + 1) || at(i + 1, j + 1))
        px(g, x + i, y + j, 1, 1, MH_GK_W);
    }
  for (let j = 0; j < nh; j++)                       // ② 刻痕
    for (let i = 0; i < nw; i++)
      if (b[j * nw + i]) px(g, x + i, y + j, 1, 1, MH_INK);
}
/* 落款：照片里「湖」左下方竖着一列小字（「刘xx题」）。1bit 尺度下 3px 宽画不出字形，
   按 §5.5.3 的老办法点成一小列 —— 有它才像实拍。位置照照片量（见调用点）。 */
function mhSign(g, x, y) {
  for (let i = 0; i < 6; i++) {                      // 六个"字"
    const yy = y + i * 3;
    px(g, x, yy, 3, 2, MH_INK);
    px(g, x + (i % 2 ? 0 : 1), yy + 1, 2, 1, MH_INK);
  }
  for (let i = 0; i < 6; i++) px(g, x - 1, y + i * 3, 1, 3, MH_GK_W);   // 石茬也照给
  px(g, x, y + 18, 3, 1, MH_GK_W);
}

/* --- 5.6.4 明湖石碑（毛面花岗岩孤石 + 阴刻「明湖」+ 左侧落款）---
   石形照 minghu1.jpg 描：**下窄上宽**的一整块孤石（不是方碑）—— 顶圆缓、
   左缘近直带一道斜裂、右缘中段鼓出来再往回收、底部坐进一圈灰浆台座。
   ⚠️ 左缘在 y33..50 那段必须退到 x ≤ 3：**落款就贴在那道边上**（照片如此），
      左缘画得太靠右，落款就跑到石头外面去了。 */
function makeMinghuStone() {
  const W = MH_ST_W, H = MH_ST_H + 4;
  const c = mkCanvas(W, H), g = c.getContext("2d");
  const rng = makeRng(56001);
  const OUT = [                                      // 轮廓（顺时针自顶部）
    [16, 2], [24, 3], [31, 8], [36, 16], [39, 27], [38, 40], [35, 51],
    [33, 61], [31, 68], [28, 74],
    [13, 74], [10, 69], [8, 60], [5, 50], [2, 38], [2, 26], [6, 13], [11, 5]
  ];
  poly(g, OUT, MH_GK);
  /* 体积：左上受光的**位移实心块**（像素风里形状本身就是光），②的描边只负责抠形 */
  poly(g, [[16, 2], [24, 3], [31, 8], [27, 12], [19, 12], [13, 8]], MH_GK_L);
  ellipsePx(g, 14, 30, 9, 20, rgba(MH_GK_L, 0.55));
  ellipsePx(g, 12, 56, 7, 12, rgba(MH_GK_L, 0.34));
  poly(g, [[36, 16], [39, 27], [38, 40], [35, 51], [31, 44], [30, 30], [32, 18]], MH_GK_D);
  poly(g, [[13, 74], [28, 74], [30, 66], [14, 66]], MH_GK_D);
  /* 裂缝与风化斑（照片里石面有两道明显斜裂和几片深色斑） */
  poly(g, [[6, 40], [9, 39], [10, 60], [7, 61]], rgba(MH_GK_S, 0.45));
  poly(g, [[30, 20], [33, 21], [34, 34], [31, 33]], rgba(MH_GK_S, 0.32));
  poly(g, [[20, 60], [27, 62], [26, 66], [19, 65]], rgba(MH_GK_S, 0.22));
  ellipsePx(g, 30, 44, 5, 7, rgba(MH_GK_S, 0.26));
  ellipsePx(g, 9, 22, 4, 6, rgba(MH_GK_L, 0.30));
  speckle(g, 4, 8, 32, 60, rgba(MH_GK_L, 0.45), 46, rng);
  speckle(g, 4, 8, 32, 60, rgba(MH_GK_D, 0.45), 40, rng);
  slEdge(g, W, H, -1, -1, MH_GK_L);                  // 左上受光边
  slEdge(g, W, H, 1, 1, MH_GK_D);                    // 右下背光边
  /* 灰浆台座（照片里石头是坐进一圈水泥里的，不是直接杵在地上） */
  px(g, 12, 70, 17, 4, "#8e8a80");
  px(g, 12, 70, 17, 1, "#a8a49a");
  for (const jx of [16, 21, 26]) px(g, jx, 71, 1, 3, "#767268");
  px(g, 11, 73, 19, 1, "rgba(20,24,32,0.34)");       // 接地暗带
  shadowBlob(g, 21, 76, 15, 3, 0.30, 3);             // 向南两行软影
  /* 阴刻「明湖」+ 落款（斜向排布：明在右上、湖在左下，**两字之间留一行空**）
     ⚠️ 下面这两个坐标**换字体时必须跟着重算**，不是"排版偏好"：
        旧点阵（FZYTK）明只有 13px 宽，字窄，所以当时写成 (12,14)/(6,30)。
        换成提炼件的毛笔字后按长宽比出格，明 20 宽、湖 22 宽 —— 宽度涨了 1.5 倍，
        原坐标下两字**竖直叠掉 4 行**，而且「明」的月和「湖」的月正好上下压在一起，
        中间连成一片黑（y30..33 逐行查过：x22..31 整段没有白）。
        现在 明 y12..31 / 湖 y33..52，y32 是一整行空的；湖 右移 2 是为了
        给左侧落款（x1..4，见下行 mhSign）和石缘留出间距。
     ⚠️ 两字的**字框不同大**：明 20×20、湖 22×20（长宽比照提炼件，不强行拉方），
        所以这里的 x 是各自量出来的 —— 湖 比 明 宽 2px，若按同一个 x 摆会左右不齐。
     ⚠️ 总跨度 y12..52 只占石高（y2..74）的 0.56，与实拍 0.54 同档 —— 上下都还有余量，
        但**别再往下压**：湖 的底 y52 再往下就贴到 y70 的灰浆台座了。 */
  mhGlyph(g, MH_CHARS[0][0], MH_CHARS[0][1], MH_CHARS[0][2], 12, 12);   // 明：右上
  mhGlyph(g, MH_CHARS[1][0], MH_CHARS[1][1], MH_CHARS[1][2], 8, 33);    // 湖：左下
  mhSign(g, 1, 34);
  return { canvas: c, ax: MH_ST_AX, ay: MH_ST_AY };
}

/* --- 5.6.4b 六角台面 / 岛缘 / 石桥 --- */
/* 六边形顶点：a0 默认 30° ⇒ 得到的是**南北两个尖角、东西两条平边**的那个朝向 ——
   与照片一致（岛的最南端是一个**尖**，石桥搭在西边那条平边上）。
   ⚠️ 亭子檐口（§5.6.4d）用的是同一个朝向，两者必须同朝向，否则檐角会戳出台面。 */
function mhHexPts(cx, cy, rx, ry, a0) {
  const p = [];
  for (let i = 0; i < 6; i++) {
    const a = (a0 + i * 60) * Math.PI / 180;
    p.push([cx + rx * Math.cos(a), cy + ry * Math.sin(a)]);
  }
  return p;   // [0]ESE [1]S [2]WSW [3]WNW [4]N [5]ENE
}
/* 台面铺装：照片里是六边形石板、缝是斜的。1bit 尺度画不出六边形砖，
   就压两层**同心六边形缝** + 六条对角斜缝 —— 够读了。 */
function mhPave(g, cx, cy, rx, ry, rng) {
  poly(g, mhHexPts(cx, cy, rx, ry, 30), MH_PV);
  for (const rr of [0.62, 0.30]) {
    const p = mhHexPts(cx, cy, rx * rr, ry * rr, 30);
    for (let i = 0; i < 6; i++)
      for (let t = 0; t <= 1; t += 0.22)
        px(g, Math.round(p[i][0] + (p[(i + 1) % 6][0] - p[i][0]) * t),
              Math.round(p[i][1] + (p[(i + 1) % 6][1] - p[i][1]) * t), 1, 1, rgba(MH_PV_J, 0.55));
  }
  for (let i = 0; i < 6; i++) {
    const a = (30 + i * 60) * Math.PI / 180;
    for (let t = 0.20; t <= 0.94; t += 0.055)
      px(g, Math.round(cx + rx * t * Math.cos(a)), Math.round(cy + ry * t * Math.sin(a)),
         1, 1, rgba(MH_PV_J, 0.32));
  }
  ellipsePx(g, cx - rx * 0.38, cy - ry * 0.20, rx * 0.45, ry * 0.5, rgba(MH_PV_L, 0.30));
  speckle(g, cx - rx, cy - ry, rx * 2, ry * 2, rgba(MH_GK_L, 0.30), 30, rng);
  speckle(g, cx - rx, cy - ry, rx * 2, ry * 2, rgba(MH_PV_D, 0.34), 34, rng);
}
/* 岛缘：台面外那圈浅色条石 + 南侧四条边下面 6px 的**石壁立面** + 壁脚的水影。
   ⚠️ 没有这段壁，六边形台面会像一张纸贴在水上（"浮"不起来的根因就在这）。
   北面那两条边（p3-p4 / p4-p5）不画壁 —— 那是背光侧，本来就看不见。 */
function mhIsleRim(g, cx, cy, rx, ry) {
  const p = mhHexPts(cx, cy, rx, ry, 30);
  for (let i = 0; i < 6; i++) {                      // 六条边的台面外缘（远边也要）
    const a = p[i], b = p[(i + 1) % 6];
    for (let t = 0; t <= 1; t += 0.02)
      px(g, Math.round(a[0] + (b[0] - a[0]) * t), Math.round(a[1] + (b[1] - a[1]) * t),
         1, 1, MH_PV_L);
  }
  for (const i of [5, 0, 1, 2]) {                    // 朝南/朝东/朝西的四条边 → 壁
    const a = p[i], b = p[(i + 1) % 6];
    for (let t = 0; t <= 1; t += 0.018) {
      const x = Math.round(a[0] + (b[0] - a[0]) * t), y = Math.round(a[1] + (b[1] - a[1]) * t);
      if (t === 0 || t + 0.018 > 1) continue;        // 尖角交给下一条边（免得画重）
      px(g, x, y + 1, 1, 6, MH_PV_D);                // 壁
      px(g, x, y + 1, 1, 1, MH_PV);                  // 壁顶那道浅棱
      px(g, x, y + 7, 1, 2, "rgba(10,26,42,0.30)");  // 壁脚水影（跟着轮廓走）
      px(g, x, y + 9, 1, 2, "rgba(10,26,42,0.14)");
    }
  }
  for (const i of [5, 0, 1, 2]) {                    // 壁上每 5px 一道竖缝
    const a = p[i], b = p[(i + 1) % 6];
    for (let t = 0.06; t < 1; t += 0.10) {
      const x = Math.round(a[0] + (b[0] - a[0]) * t), y = Math.round(a[1] + (b[1] - a[1]) * t);
      px(g, x, y + 2, 1, 5, rgba(MH_PV_J, 0.70));
    }
  }
}
/* 石板桥（岛西 → 西岸；照 minghu1 / minghutingzi1 的踏步石板）。
   桥面在**水面上**，所以下面只留一道浅影 —— 不能有接地暗带（那会读成"桥在地上"）。 */
function mhBridge(g, x0, y0, n) {
  for (let i = 0; i < n; i++) {
    const x = x0 + i * 5, y = Math.round(y0 + i * 0.8);
    px(g, x, y, 5, 4, MH_PV);
    px(g, x, y, 5, 1, MH_PV_L);                      // 上棱受光
    px(g, x, y + 3, 5, 1, MH_PV_J);                  // 下棱（板缝）
    px(g, x + 4, y, 1, 4, MH_PV_D);                  // 板与板之间那道竖缝
    px(g, x, y + 4, 5, 1, "rgba(16,34,54,0.30)");    // 水里的倒影
  }
}

/* --- 5.6.4d 攒尖顶（六角）---
   2.5D 里这是最容易画成一张饼的地方。做法：把六条戗脊的投影端点算出来
   （x 半径 rx、y 半径 rx×MH_HEX_K，就是那个 1.71 压扁），**每个檐角抬起 lift**，
   再按面填色 —— 光源在左上，用面法向 (-cos - sin) 定六个面各自的明暗。
   ⚠️ 檐角一定要抬（翼角上扬）：不抬的话檐口是一条水平线，六角亭立刻变方盒。
   ⚠️ **举高必须压过"北檐角"**：北檐角在屏上比檐心高 (ry + lift)，而攒尖比檐心高
      rise。rise < ry + lift 时屋顶就翻过来长成一个碗 —— 第一版 ry/rx = 0.42 时
      0.62 的举高勉强够，改成 0.585（项目既定的 1.71）之后 0.62 就不够了，
      所以 MH_PITCH 提到 0.95。
   ⚠️ **返回攒尖 y**：上层的柱 / 檐 / 宝顶都从返回值往上接。第一版把攒尖 y 存成
      常量、这里却由 rx 现算，两者一漂移宝顶就悬空（2026-09-13 就是这么错的）。 */
/* 六个檐角的屏上坐标（翼角上扬后的）。**抽出来是为了"只有一个来源"**：
   mhRoof 用它画屋面，§5.6.4e 的挂落也要贴同一条檐口线 —— 各算一遍迟早漂。
   （这就是 5.6.1b 那条老坑：派生量存两份，改一处另一处静默错位。） */
function mhEave(cx, y0, rx) {
  const lift = Math.round(rx * 0.115);                 // 26→3，17→2
  return mhHexPts(cx, y0, rx, Math.round(rx * MH_HEX_K), 30).map(p => [p[0], p[1] - lift]);
}
function mhRoof(g, cx, y0, rx) {
  const C = mhEave(cx, y0, rx);
  const apex = [cx, y0 - Math.round(rx * MH_PITCH)];
  const RIB = [];
  for (let i = 0; i < 6; i++) {                      // ① 六个坡面（按朝向定明暗）
    const a = (60 + i * 60) * Math.PI / 180;
    const l = -(Math.cos(a) + Math.sin(a)) * 0.5;    // -1 = 背光 .. +1 = 迎光
    const f = (l + 1) * 0.42 + 0.16;                 // 该面的明暗档（0..1，越大越亮）
    /* ⚠️⚠️ 瓦垄的颜色必须**从 MH_RF_D / MH_RF_L 现算**，不许写成
       `mix(mix(MH_RF_D, MH_RF_L, f), MH_RF_D, 0.38)` —— `mix()` 只吃 **hex 串**，
       喂它 `mix()` 自己的输出（"rgb(181,118,58)"）会解析成垃圾，
       结果是纯蓝 `rgb(0,0,89)`：4× 下一片蓝色虚线网（2026-09-13 第二轮踩过）。
       同一个色相、压低一档 ⇒ 换个档位系数再 mix 一次。 */
    RIB.push(mix(MH_RF_D, MH_RF_L, f * 0.60));
    poly(g, [apex, C[i], C[(i + 1) % 6]], mix(MH_RF_D, MH_RF_L, f));
  }
  /* ①b 瓦垄：每条坡面上 3~4 道**从攒尖射向檐口**的暗线 —— 有它才读得出"这是一片
     瓦屋顶"；没有它就是一块橙色梯形（第一版如此，4× 下一眼是座金字塔）。
     ⚠️ 次序：坡面 → **瓦垄** → 戗脊。瓦垄画在戗脊之后的话，屋脊被瓦线打断成虚线。
     ⚠️ 从攒尖 22% 处起笔 —— 从攒尖本身起笔，六条会挤成一坨黑点。
     ⚠️ 每道线的**收头压在檐口绿剪边上**（t 到 0.98），短一截就成飘在半空的毛刺。 */
  const NR = rx > 20 ? 4 : 3;
  for (let i = 0; i < 6; i++) {
    const a0 = C[i], b0 = C[(i + 1) % 6];
    for (let k = 1; k <= NR; k++) {
      const s = k / (NR + 1);
      const ex = a0[0] + (b0[0] - a0[0]) * s, ey = a0[1] + (b0[1] - a0[1]) * s;
      for (let t = 0.22; t <= 0.98; t += 0.05)
        px(g, Math.round(apex[0] + (ex - apex[0]) * t),
              Math.round(apex[1] + (ey - apex[1]) * t), 1, 1, RIB[i]);
    }
  }
  for (let i = 0; i < 6; i++) {                      // ② 戗脊（绿）：攒尖 → 六个檐角
    const a = C[i];
    for (let t = 0; t <= 26; t++)
      px(g, Math.round(apex[0] + (a[0] - apex[0]) * t / 26),
            Math.round(apex[1] + (a[1] - apex[1]) * t / 26), 1, 1, MH_GL_D);
  }
  for (let i = 0; i < 6; i++) {                      // ③ 檐口绿剪边 + 檐下暗线 + 瓦当
    const a = C[i], b = C[(i + 1) % 6];
    for (let t = 0; t <= 30; t++) {
      const x = Math.round(a[0] + (b[0] - a[0]) * t / 30), y = Math.round(a[1] + (b[1] - a[1]) * t / 30);
      px(g, x, y - 1, 1, 3, MH_GL);
      px(g, x, y + 2, 1, 1, MH_GL_D);
      if (t % 7 === 3) px(g, x, y - 2, 1, 1, MH_GL_D);   // 瓦当/脊兽：檐口上那排小凸点
    }
  }
  for (const p of C) {                               // ④ 翼角梢：抬起来那两头点一颗亮绿
    px(g, Math.round(p[0]) - 1, Math.round(p[1]) - 1, 2, 2, MH_GL_L);
    px(g, Math.round(p[0]) - 1, Math.round(p[1]) - 1, 1, 1, MH_GL);
  }
  px(g, Math.round(apex[0]) - 1, Math.round(apex[1]) - 1, 3, 2, MH_GL);   // 攒尖顶那颗绿珠
  return Math.round(apex[1]);
}

/* --- 5.6.4e 湖心岛 + 小亭子（一整张精灵，理由见文件头三）---
   画序（改哪一步、插哪儿，都拿这张表核）：
     台面 → 岛缘石壁 → 石桥 → 亭子台基 → 亭内暗部 → 美人靠 → 柱
     → **上层柱 + 额枋** → 下檐 → 上檐 → 宝顶 → 假山石
   ⚠️ 上层柱排在**下檐之前**是这个画序里唯一有讲究的一步（理由见 5.6.1c）：
      下檐要靠自己的戗脊去切上层柱的柱脚。插到下檐后面 = 那一层又变回悬浮屋顶。
   （水影是由 mhIsleRim 跟着岛缘轮廓一起画的，不在最后；假山石压在水影上，
     这正是照片的样子 —— 石头是搭在岛缘上、探到水面上方的。） */
function makeIslandPavilion() {
  const c = mkCanvas(MH_ISLE_W, MH_ISLE_H), g = c.getContext("2d");
  const rng = makeRng(56002);
  const CX = MH_ISLE_AX, CY = MH_ISLE_CY, R = MH_ISLE_R, RY = MH_ISLE_RY;
  const P = MH_P_TIER;

  /* ① 六边形台面 + ② 岛缘（含南侧石壁与水影） */
  mhPave(g, CX, CY, R, RY, rng);
  mhIsleRim(g, CX, CY, R, RY);
  /* ③ 石桥：从精灵左端（= 湖面西缘 2738）搭到岛的西平边（x = CX − 39.8 ≈ 26） */
  mhBridge(g, 0, CY - 7, 5);

  /* ④ 亭子的石台基：六边形鼓座（比柱环宽一圈），南边那面看得见 6px 立面 */
  const T = mhHexPts(CX, CY - 3, MH_P_PIL + 4, (MH_P_PIL + 4) * MH_HEX_K, 30);
  poly(g, T, MH_PV);
  for (const i of [5, 0, 1, 2]) {
    const a = T[i], b = T[(i + 1) % 6];
    for (let t = 0.02; t < 0.98; t += 0.03)
      px(g, Math.round(a[0] + (b[0] - a[0]) * t), Math.round(a[1] + (b[1] - a[1]) * t), 1, 4, MH_PV_D);
  }
  px(g, CX - MH_P_PIL - 4, P - 6, (MH_P_PIL + 4) * 2, 1, MH_PV_L);      // 台基顶那道亮棱
  px(g, CX - MH_P_PIL - 4, P + 1, (MH_P_PIL + 4) * 2, 3, MH_PV_J);      // 台基脚

  /* ⑤ 亭内：暗部（照片里柱间是深的）+ 上缘那道梁枋的暗影 */
  px(g, CX - MH_P_PIL, P - 22, MH_P_PIL * 2, 22, MH_IN_D);
  px(g, CX - MH_P_PIL, P - 22, MH_P_PIL * 2, 4, "#1e2a23");
  /* ⑥ 美人靠（绿色坐凳栏杆）：柱间那道横带 + 竖棂，正面留出进人的口子 */
  for (let x = CX - MH_P_PIL + 2; x < CX + MH_P_PIL - 2; x += 4) {
    if (Math.abs(x + 1 - CX) < 9) continue;
    px(g, x, P - 9, 3, 5, MH_IN_L);
    px(g, x, P - 9, 3, 1, "#5d7565");
    px(g, x, P - 5, 3, 1, MH_IN_D);
  }
  /* ⑦ 柱：四根（六角环在 2.5D 里看得见的就是这四根，照片数出来也是四根） */
  for (const dx of [-17, -6, 6, 17]) {
    const x = CX + dx;
    px(g, x, P - 26, 3, 26, MH_PL);
    px(g, x, P - 26, 1, 26, MH_PL_L);                 // 左缘受光
    px(g, x + 2, P - 26, 1, 26, MH_PL_D);             // 右缘背光
    px(g, x - 1, P, 5, 2, MH_PV_D);                   // 柱础
  }
  /* ⑦b 上层柱（童柱）+ 额枋 —— **必须画在下檐之前**（理由见 5.6.1c）：
     先立柱、后铺下檐，下檐的戗脊自然把每根柱脚切在自己那条屋脊线上。
     柱脚故意画到 MH_P_U_FOOT（比脊低十几像素），多出来的那截交给下檐盖掉 ——
     这样柱脚永远严丝合缝坐在脊上，不会露出一条缝。 */
  for (const dx of [-MH_P_U_R + 2, 0, MH_P_U_R - 2]) {
    const x = CX + dx;
    px(g, x, MH_P_U_Y, 3, MH_P_U_FOOT - MH_P_U_Y, MH_PL);
    px(g, x, MH_P_U_Y, 1, MH_P_U_FOOT - MH_P_U_Y, MH_PL_L);
    px(g, x + 2, MH_P_U_Y, 1, MH_P_U_FOOT - MH_P_U_Y, MH_PL_D);
  }
  /* ⑧ 两重檐 + 宝顶：**每一层都从上一层的返回值往上接**（攒尖 y 不存常量）
     ⚠️ 上檐的 y0 是 MH_P_U_Y（独立常量），**不是** a1 的函数 —— 上层柱的可见高度
        由"上檐檐口 − 下层屋脊"决定，写成 a1−8 就又回到第一版那个悬浮屋顶了。 */
  const a1 = mhRoof(g, CX, P - 26, MH_P_EAVE);                          // 下檐（会盖住 ⑦b 的柱脚）
  const a2 = mhRoof(g, CX, MH_P_U_Y, MH_P_U_EAVE);                      // 上檐
  /* ⑧b 挂落：贴在**上檐檐口**下面那条绿装饰带（照片里上层柱头之间那排）。
     ⚠️ 必须画在上檐**之后** —— 挂落是吊在檐口**外面**的，画在前面会被
        上檐的南坡整个吃掉（第一版把它当"额枋"画在下檐之前，一行都看不见）。
     檐口线取自 mhEave（和上檐同一条来源），别自己再算一遍。 */
  const EU = mhEave(CX, MH_P_U_Y, MH_P_U_EAVE);
  for (const i of [5, 0, 1, 2]) {
    const a = EU[i], b = EU[(i + 1) % 6];
    for (let t = 0.04; t < 0.96; t += 0.05) {
      const x = Math.round(a[0] + (b[0] - a[0]) * t), y = Math.round(a[1] + (b[1] - a[1]) * t) + 2;
      px(g, x, y, 1, 3, MH_GL_D);
      px(g, x, y, 1, 1, MH_GL);
    }
  }
  for (let x = CX - 8; x <= CX + 8; x += 4) {                            // 垂花：檐下那几颗吊珠
    const dy = 2 + Math.round((1 - Math.abs(x - CX) / 9) * 2);
    px(g, x, MH_P_U_Y + 2 + dy, 1, 2, MH_GL);
  }
  /* ⑨ 宝顶：照片里是**绿琉璃**的洋葱形宝顶、底下压一圈金 —— 第一版画成橙珠是错的。
     整块横跨 a2−5 .. a2+3，所以 MH_P_U_Y ≥ 21（见 5.6.1c）。 */
  px(g, CX - 3, a2 + 2, 7, 2, MH_RF_L);                                 // 金座
  circlePx(g, CX, a2 - 1, 3, MH_GL_L);                                  // 绿珠
  circlePx(g, CX, a2 - 1, 2, MH_GL);
  px(g, CX - 1, a2 - 2, 2, 1, "#7fbf9a");                               // 左上高光
  px(g, CX, a2 - 5, 2, 4, MH_GL);                                       // 细尖
  px(g, CX, a2 - 5, 1, 4, MH_GL_L);

  /* ⑨ 假山石：近正俯视图里 —— 东平边一块最高的、东南与南缘一排列到西南。
     石头压在岛缘水影**之上**（照片如此：石头是搭在岛缘、探到水面上的）。 */
  mhRock(g, CX + R - 20, CY - 12, 10, 18, rng);       // 东平边那块最高的
  mhRock(g, CX + R - 30, CY + 2, 11, 9, rng);
  mhRock(g, CX + R - 42, CY + 12, 10, 8, rng);        // 东南
  mhRock(g, CX - 6, CY + RY + 1, 12, 9, rng);         // 南尖角两侧
  mhRock(g, CX + 14, CY + RY - 1, 10, 8, rng);
  mhRock(g, CX - 26, CY + RY - 3, 10, 8, rng);
  mhRock(g, CX - 44, CY + 10, 9, 7, rng);             // 西南
  return { canvas: c, ax: MH_ISLE_AX, ay: MH_ISLE_AY };
}
/* 一块假山石：不等边多边形 + 左上受光 + 右下背光。
   照片里的石头是**浅灰偏暖**的、比台面亮，所以在台面上是"跳"出来的 ——
   别画成深色，那会读成一个洞。 */
/* cols 是 2026-09-13**第七轮**加的可选参数（57_yingbi.js 的假山要另一套配色：
   米白为主 + 深灰，那才是实例图的样子）。四档 = [受光面, 主面, 背光棱, 高光]。
   ⚠️ **不传就完全走原来的 MH_RK_* 与 #d6d2c4** ⇒ §5.6 那 7 个调用点（:480-486）
      的输出逐字节不变。这是纯加法，不是改判据。 */
function mhRock(g, x, y, w, h, rng, cols) {
  const j = () => (rng() - 0.5) * 2.2;
  const C = cols || [MH_RK_L, MH_RK, MH_RK_D];
  const HL = (cols && cols[3]) || "#d6d2c4";
  const P = [
    [x + 1, y + h - 1], [x, y + h * 0.42], [x + w * 0.30, y + 1],
    [x + w * 0.78, y], [x + w - 1, y + h * 0.44], [x + w * 0.72, y + h - 1]
  ];
  poly(g, P, C[1]);
  poly(g, [P[1], P[2], P[3], [x + w * 0.55, y + h * 0.52]], C[0]);   // 左上受光面
  for (let t = 0.1; t <= 1; t += 0.10) {                                // 右下背光棱
    const a = P[4], b = P[5];
    px(g, Math.round(a[0] + (b[0] - a[0]) * t), Math.round(a[1] + (b[1] - a[1]) * t), 1, 2, C[2]);
  }
  px(g, Math.round(x + w * 0.24), Math.round(y + 2), 2, 1, HL);
}

/* --- 5.6.5 水中央的石塔（minghu2.jpg）---
   ⚠️ y 是三个坐标里**唯一动过的**：用户写 1356（旧湖里的位置，离旧湖底 75.6px）。
      湖底北移 103.6 之后，1356 已经落在南岸**石板路**上了 —— 那就成了"路中央的石塔"，
      而用户要的是水中央。取 1356 − 103.6 ≈ **1253**：仍在水中，且离新湖底 75px，
      与旧湖里的关系一模一样。
   造型（自下而上，照照片量）：没入水中的台座 → 鼓形塔身（**两处椭圆形透光孔**，
   这是全塔最认得出的特征）→ 小伞盖 → 大伞盖 → 宝珠（压扁的圆球）→ 小葫芦顶 → 尖。 */
function makeStoneTower() {
  const c = mkCanvas(MH_TW_W, MH_TW_H), g = c.getContext("2d");
  const rng = makeRng(56003);
  const CX = MH_TW_AX, WL = MH_TW_WL;

  /* ① 没入水中的台座（吃水线以下 8px）：**必须是"隔着水看"的颜色**。
     第一版直接铺了块偏绿的石头色 (#8e9478)，4× 下一眼看过去是一块立在湖里的
     灰板 —— 它比周围的水亮一大截，读不出"没入水下"。
     做法：石色按 0.55 混进**湖水中层色**（= paintWaterBase 里
     mix("#2E6E9E","#7FB4D8",0.16×4)，塔所在的环带上就是这个色）。 */
  px(g, CX - 8, WL, 17, MH_TW_AY - WL, mix(MH_TL_D, MH_TW_WATER, 0.55));
  px(g, CX - 8, WL, 17, 1, mix(MH_TL, MH_TW_WATER, 0.40));   // 刚入水那道被水折掉的亮边
  px(g, CX - 5, MH_TW_AY - 3, 11, 3, mix(MH_TL_S, MH_TW_WATER, 0.40));
  /* ② 塔身：鼓形（下宽、中鼓、颈收）—— 逐行半宽表，比椭圆更像"石头"。
     ⚠️ BODY 是**关键帧表**（[行号, 半宽]），要逐行**插值**再画。
        第一版直接 for-of 遍历这张表当行用 —— 表里 dy 是 0,2,5,9,13,15,16，
        中间那些行（1,3,4,6,7,8,10,11,12,14）根本没画，塔身成了只**鸟笼**：
        一排排横条中间全是洞，两个"透光孔"浮在洞外。4× 截图上一眼就是错的。 */
  const BODY = [[0, 4], [3, 6.5], [7, 8], [11, 7.6], [14, 6], [16, 4.5]];
  const BH = 17;                                      // 塔身总高（精灵 y WL−17 .. WL−1）
  for (let i = 0; i < BH; i++) {
    let hw = BODY[BODY.length - 1][1];
    for (let k = 0; k < BODY.length - 1; k++) {
      const d0 = BODY[k][0], w0 = BODY[k][1], d1 = BODY[k + 1][0], w1 = BODY[k + 1][1];
      if (i >= d0 && i <= d1) { hw = w0 + (w1 - w0) * (i - d0) / (d1 - d0); break; }
    }
    const y = WL - BH + i, h = Math.max(2, Math.round(hw));
    px(g, CX - h, y, h * 2, 1, MH_TL);
    px(g, CX - h, y, 2, 1, MH_TL_L);                  // 左缘受光
    px(g, CX + h - 2, y, 2, 1, MH_TL_D);              // 右缘背光
  }
  /* 两处透光孔：左边大（斜椭圆）、右边小 —— 照片里两孔不对称，别做成一对 */
  ellipsePx(g, CX - 5, WL - 8, 3, 4, "#33352c");
  ellipsePx(g, CX - 5, WL - 8, 2, 3, "#4a4c40");
  ellipsePx(g, CX + 6, WL - 9, 2, 3, "#33352c");
  /* ③ 小伞盖（颈上那圈） */
  px(g, CX - 5, WL - 21, 11, 4, MH_TL);
  px(g, CX - 5, WL - 21, 11, 1, MH_TL_L);
  px(g, CX - 5, WL - 18, 11, 1, MH_TL_D);
  /* ④ 大伞盖（更大一圈，边缘起棱）：照片里它明显比塔身外扩一圈 —— 21 宽 vs 塔身 16 */
  px(g, CX - 10, WL - 26, 21, 5, MH_TL);
  px(g, CX - 10, WL - 26, 21, 1, MH_TL_L);
  px(g, CX - 10, WL - 22, 21, 1, MH_TL_D);
  for (let x = CX - 8; x <= CX + 8; x += 4) px(g, x, WL - 25, 1, 4, rgba(MH_TL_S, 0.55));
  /* ⑤ 宝珠（压扁的球） */
  ellipsePx(g, CX, WL - 32, 5, 6, MH_TL);
  ellipsePx(g, CX - 1, WL - 34, 3, 3, MH_TL_L);
  ellipsePx(g, CX + 3, WL - 30, 2, 3, MH_TL_D);
  /* ⑥ 小葫芦顶 + 尖 */
  ellipsePx(g, CX, WL - 39, 3, 3, MH_TL);
  ellipsePx(g, CX - 1, WL - 40, 2, 2, MH_TL_L);
  px(g, CX - 1, WL - 44, 2, 3, MH_TL_D);
  px(g, CX - 1, WL - 45, 1, 2, MH_TL);
  /* ⑦ 水汽蚀痕（照片里石灯上有一道道竖向的灰绿蚀纹） */
  for (const dx of [-7, -2, 3, 7]) px(g, CX + dx, WL - 16, 1, 15, rgba(MH_TL_G, 0.40));
  speckle(g, CX - 9, WL - 45, 19, 45, rgba(MH_TL_G, 0.30), 26, rng);
  speckle(g, CX - 9, WL - 45, 19, 45, rgba(MH_TL_L, 0.34), 20, rng);
  /* ⑧ 吃水线：一圈比水面略亮的环 + 塔底那圈暗影 —— 有它才"站在水里" */
  px(g, CX - 9, WL, 19, 1, "rgba(190,214,232,0.42)");
  ellipsePx(g, CX, WL + 4, 11, 3, "rgba(10,26,42,0.26)");
  ellipsePx(g, CX, WL + 6, 14, 3, "rgba(10,26,42,0.13)");
  return { canvas: c, ax: MH_TW_AX, ay: MH_TW_AY };
}

/* --- 5.6.6 摆进世界 ---
   ⚠️ 必须在 scatter() **之前**（同 §6.5b/§6.5c/§6.5d）：石碑的 addSolid 一进
      solids，散射点就不会落到碑身上（否则碑里会长出一棵树或一个垃圾桶）。
   ⚠️ 岛与塔的碰撞盒是 **2026-09-13 第六轮补的**。旧注释写的是「它们在水里，
      而水面本来就不可通行（K.WATER）」—— 那句话是**错的**，已实测证伪：
      canWalk() 只查边界多边形，addSolid 的 12 个调用点里没有一处是水面，
      **水面一直可以走上去**（人踩着水在湖上走）。前提没了，这两个盒子就必须补，
      否则人能踩着水直接穿岛穿塔。
      盒子的取法同 §5.3.8 的花坛：取**落地足迹**的 AABB，不是整张精灵框
      （岛精灵 120×132 里大半是亭子、屋顶和水面反光）。
   ⚠️ 石桥只搭到**湖面西缘**（精灵 x0 = 2738.06），不伸进环湖小路那一格
      （x2720..2736）—— 否则玩家沿西岸走过时，桥面会盖住他的脚。 */
/* 水里的石头（岛 / 塔）：除了挡住玩家，还要登记进 45_water.js 的 WATER_AVOID，
   让鸭子和鱼也绕开 —— 否则只有人绕得过去、鸭子照样穿石而过，比不加盒子还刺眼。
   两个盒子共用一条 `addSolid + push` 路径而不是各写两遍，免得将来只改了一边。 */
function mhSolid(cx, by, w, d) {
  addSolid(cx, by, w, d);
  WATER_AVOID.push({ x0: cx - w * 0.5, x1: cx + w * 0.5, y0: by - d, y1: by });
}

function buildMinghu() {
  addProp(Object.assign({}, makeMinghuStone(), { x: MH_ST_X, y: MH_ST_BY, tag: "mhStone" }));
  addSolid(MH_ST_X, MH_ST_BY, MH_ST_W - 14, 10);      // 碑是一堵墙：给"足迹"，绕得过去穿不过去
  addProp(Object.assign({}, makeIslandPavilion(), { x: MH_ISLE_X, y: MH_ISLE_BY, tag: "mhIsle" }));
  /* 岛：台面六边形横跨 x 2758..2850、纵跨 y 1046..1108（岛心 1073 ± RY，南尖 1108）。
     深度写成 `AY − CY + RY` 而不是直接拍 62 —— 它是"岛心到落地线(35) + 岛心到北缘(27)"，
     三个常量任一挪动，盒子自己会跟着走。 */
  mhSolid(MH_ISLE_X, MH_ISLE_BY, MH_ISLE_R * 2, MH_ISLE_AY - MH_ISLE_CY + MH_ISLE_RY);  // 92 × 62
  addProp(Object.assign({}, makeStoneTower(), { x: MH_TW_X, y: MH_TW_BY, tag: "mhTower" }));
  /* 塔：水里一根细柱，落地足迹只有吃水线以下那一小截（精灵 y44..52 → 世界 y1245..1253），
     塔身最宽处 19px（§5.6.5 的 `px(g, CX-9, WL, 19, 1, …)`）—— 取 20 宽、8 深。 */
  mhSolid(MH_TW_X, MH_TW_BY, 20, MH_TW_AY - MH_TW_WL);  // 20 × 8
}
