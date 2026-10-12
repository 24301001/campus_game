/* =========================================================
   6.4 南门西侧保安厅 + 东侧校名碑墙 —— 按 预览/nanmen.jpg 还原
   ---------------------------------------------------------
   用户 2026-09-27：「我放置了一个南门的照片……重点复刻一下保安厅，按照照片的
   比例，石狮子不用动，那块红色北交石碑好像被嵌到了一个灰色贴瓷墙面，总之你
   需要复刻保安室和新石碑墙，不需要动石狮子和南门（拱形高门）」。

   照片（1401×848）是**南门正立面效果图**，从左到右三块：
     ① **保安厅** 左围墙（横砖高墙）＋带窗门卫室＋右矮墙（半高）＋折线出挑雨篷
     ② **红拱南门**（§4.9，本文档一个像素都不动）
     ③ **校名碑墙** 一整面横砖墙，中央**嵌着**一块红石碑（六个金字）
   本文档做 ① 与 ③。③ 取代 §5.4 的「独立校名石 + 花岗岩框」——
   用户拍板「去掉框，照照片嵌进墙」。石狮（§5.4.8）原样不动。

   【一、比例尺】照片里唯一能动用的标尺是拱门（它是既有的、动不得）：
     水平：拱门外宽 341px（照片 x562..902）↔ 世界 195（SG_W）  ⇒ KH = 0.5718
     垂直：拱门总高 595px（照片 y126..720）  ↔ 世界 287（SG_H）  ⇒ KV = 0.4824
   ⚠️ 两个比例尺**不相等**，根因是 §4.9 把拱门柱高从实拍的 302 压到了 190。
      若垂直也用 KH，保安厅顶会落到「照片里拱顶下方 170px」处，而照片给的是
      195px —— 「保安厅相对拱门有多高」这条**视觉关系**会走样。所以垂直一律走 KV，
      代价是小构件（门 / 窗）纵向被压扁约 16%，在 20~40px 的尺寸上看不出来。
   ⚠️ 这就是 §4.9 头注那句「照片只用来看比例」在本文档的具体落地：**不照抄像素，
      只照抄比例**。

   【二、坐标锚点】落地线取与 §4.9 / §5.4 完全相同的表达式 `IX(6.3750)`（=2490.02）。
   G2 的 y 一动，拱门 / 石狮 / 本文两件跟着一起走。
   画布一律取「左缘 x ／ 落地线 y」的锚点，即 ax:0、ay:画布高（见 §6.4.5）。

   【三、正视图的简化】照片是 3/4 透视（门卫室是个凸出的盒子、右侧面也可见，
   雨篷有进深折角）。游戏里建筑一律是**正视图 billboard**（§4.9 的拱门就是），
   所以门卫室的右侧面被"掰正"到正面、雨篷的进深折角压成一条水平折线。
   判据是**所见即所得**：玩家看到的轮廓与照片一致，而不是几何一致。

   【四、两处刻意的取舍】
     · **英文行不做**。照片碑面上「BEIJING JIAOTONG UNIVERSITY」26 字符占 73 世界px
       ⇒ 2.8px/字符，字母会全贴死（§5.4.3 头注已经为此把英文去过一次，
       手写 5×7 字形与 `smText()` 仍留在 §5.4.3 备用，没有被删）。
     · **石碑直接复用 §5.4.7 的成品**：`makeSchoolStone()` 出的是 102×63、花岗岩框厚
       `HF = 13>>1 = 6` 的成品，裁掉 (6,6)-(96,57) 就是**石板本身**（90×51，金字已在
       板面上）—— 不重画一遍点阵，也就不会出现"两处金字不一样"。
   ========================================================= */

/* --- 6.4.1 尺寸（照片实测 → 世界，换算见头注【一】） ---
   照片 x562 ↔ 世界 1907.5（拱左外缘 = G2.x − SG_RO）；照片 y720 ↔ 落地线。
   wx(px) = 1907.5 + (px−562)·0.5718      wy(py) = 落地线 − (720−py)·0.4824 */
const SW_BY = IX(6.3750);                 // 与 §4.9 / §5.4 同源的落地线 2490.02
const GH_X = 1607, GH_W = 301;            // 保安厅画布横跨 1607..1908（照片 37..562）
const GH_H = 100;                         // 画布高 = 最高构件（左围墙）到落地线
/* 左围墙：宽 129。高取 92 —— 照片里它从 y530 立到落地线 y720（190px ⇒ 世界 91.7），
   比雨篷左段顶（y553）高 23px(照片) ⇒ 世界 11。首轮取满画布高 100，渲染出来左墙
   "高出雨篷一大截"，比照片显眼太多。 */
const GH_LWW = 129, GH_LWH = 92;
const GH_LWY = GH_H - GH_LWH;             // = 8，左墙顶在画布内的 y
const GH_BWX = 127, GH_BWW = 99;          // 门卫室正面：照片 261..432，宽 99
const GH_BWH = 59;                        // 门卫室可见高（顶被雨篷压住，照片 600..722）
const GH_RWW = 75, GH_RWH = 43;           // 右矮墙：照片 432..562，宽 75 / 高 43
const GH_EX = 98, GH_EW = 189;            // 雨篷：照片 205..538，宽 189
const GH_ET_L = 20, GH_ET_R = 28, GH_EB = 41;  // 雨篷左段顶 / 右段顶 / 底（画布 y）

/* --- 6.4.2 石狮必须不被碰到 ---
   石狮横跨 x2111..2145（§5.4.1 SL_X=2128、SL_DW=34），落地线同为 SW_BY。
   碑墙左缘 2150 与它差 5px ⇒ **并排、不重叠**，这正是用户说"石狮不用动"的
   可行性来源：照片里拱门右柱（x902）到碑墙左缘（x987）那道 85px 的空档
   （世界 49px）刚好装得下这头狮子。 */

/* --- 6.4.3 碑墙尺寸 --- */
const ST_X = 2150, ST_W = 234;            // 横跨 2150..2384（照片 987..1395）
const ST_H = 90;                          // 高 90（照片 534..725 共 191px）
const ST_SW = 6;                          // 左端面（照片里墙有厚度，左侧露出一条深色）
const SLB_W = 90, SLB_H = 51;             // 石碑成品 = §5.4.7 裁掉框之后（照片 90×48）
const SLB_CX = 2211;                      // 碑心 x（照片 1015..1173 的中列）
/* ⚠️ SLB_TOP 的 y 方向是**画布向下为正**（画布顶 = 世界 2400 = SW_BY − ST_H）。
   2026-09-27 首轮渲染逮到一个符号错：原本写 58，那是**碑底**的世界 y（2458）减画布顶，
   被当成"碑顶"用了 ⇒ 整块碑往下沉 51px，下半截落到落地线以下，金字被地基横切。
   照片实测：碑顶 y555 → 世界 2410.4（画布 10.4）；碑底 y653 → 世界 2457.7（画布 57.7）。
   成品石板高 51 ⇒ 取顶 7，**碑底**落在 58（世界 2458，与照片差 0.3px）、碑顶 2407（差 3px）。 */
const SLB_TOP = 7;                        // 碑顶在画布内的 y

/* --- 6.4.4 用色（全部取 nanmen.jpg 的中位色） ---
   砖缝是**淡一档的同色**（实测 188,171,155 vs 砖 224,207,192），不是黑线 ——
   照片上这堵墙有 13 行砖，画成黑线会在 90px 高的墙上糊成二维码。 */
const SW_BRICK_L = "#e1cfc0", SW_BRICK_D = "#bcab9b";
const SW_BOOTH_L = "#cfc0a4", SW_BOOTH_D = "#a8977a";
/* 雨篷：照片里它比两侧的砖墙**明显灰一档**（砖 224,207,192 vs 篷 213,198,189），
   压得太浅就糊进墙里 —— 首轮渲染就是这个问题，所以底色调低到 #cfc0b8。 */
const SW_EAVE_L = "#cfc0b8", SW_EAVE_D = "#a89a91";
const SW_CAP = "#5d564f";                 // 压顶 / 勒脚那道深线（照片实测 93,86,79）
const SW_CAP_HI = "#f4ece0";              // 深线下沿的亮线（照片 722 那行 246,234,218）
const SW_SIDE = "#9a8878";                // 墙左端面
const SW_GLASS_L = "#93a3c9", SW_GLASS = "#7182ad", SW_GLASS_D = "#4a5980";
const SW_WFRAME = "#e9e5dd";              // 窗框（照片里是白框，不是灰框）
const SW_DOOR_L = "#5b6690", SW_DOOR = "#48516f", SW_DOOR_D = "#2e3550";

/* --- 6.4.5 画砖墙 ---
   照片里的砖是**横长条**：碑墙上每行高约 14px、长约 40px（世界 6.8 / 23），
   左围墙上略大（世界 7 / 28）。行高取 7 是"一眼能看出是砖、又不至于发花"的下限。 */
function swBrick(g, x0, y0, w, h, bw, bh, cl, cd) {
  px(g, x0, y0, w, h, cl);
  for (let y = bh; y < h; y += bh) px(g, x0, y0 + y, w, 1, cd);   // 横缝
  let row = 1;                                                     // 竖缝错缝
  for (let y = bh; y < h; y += bh, row++) {
    const off = (row & 1) ? Math.round(bw / 2) : 0;
    for (let x = off; x < w; x += bw) {
      if (x <= 0) continue;
      px(g, x0 + x, y0 + y - bh, 1, bh, cd);
    }
  }
}
/* 竖纹（门卫室墙面 / 雨篷正面）：照片里这两处是**竖向密条**，与围墙的横砖不同，
   这是"门卫室"读起来跟围墙不是一回事的关键一笔。 */
function swVgrain(g, x0, y0, w, h, step, c) {
  for (let x = step; x < w; x += step) px(g, x0 + x, y0, 1, h, c);
}

/* --- 6.4.6 保安厅 ---
   自下而上、由远及近：左围墙 → 门卫室 → 门 / 窗 → 右矮墙 → 雨篷（最前，压住上面三者的顶）。 */
function makeGuardHouse() {
  const c = mkCanvas(GH_W, GH_H + 4), g = c.getContext("2d");

  /* ① 左围墙：横砖 + 顶部一道深压顶 + 下沿亮线 */
  swBrick(g, 0, GH_LWY, GH_LWW, GH_LWH, 28, 7, SW_BRICK_L, SW_BRICK_D);
  px(g, 0, GH_LWY, GH_LWW, 2, SW_CAP);               // 压顶
  px(g, 0, GH_LWY + 2, GH_LWW, 1, SW_CAP_HI);        // 压顶下沿的高光
  px(g, GH_LWW - 1, GH_LWY, 1, GH_LWH, SW_BRICK_D);  // 右缘分界线（与门卫室相接）

  /* ② 门卫室正面：**先铺实底、再压竖纹** —— 比围墙暖一档（照片 199,184,154 vs 224,207,192）。
     ⚠️ `swVgrain()` 只画线、**不铺底**（见 §6.4.5）。少了下面第一句 px，整面墙就是透明的，
     竖纹会直接叠在广场铺装上 —— 2026-09-27 首轮渲染实测：门卫室和广场大砖混成一条"竹帘"，
     连门和窗都像是悬在广场上。竖纹步长也从 3 放到 4、并降到半透明：步长 3 时密到发花。 */
  const bx = GH_BWX, by = GH_H - GH_BWH;
  px(g, bx, by, GH_BWW, GH_BWH, SW_BOOTH_L);
  /* 步长 5 / 半透明 0.34：照片里这面墙是**近素色**、只有很淡的竖理。
     首轮用 3px 不透明，整面墙读成了瓦楞铁皮。 */
  swVgrain(g, bx, by, GH_BWW, GH_BWH, 5, rgba(SW_BOOTH_D, 0.34));
  /* 檐下由近及远的两档暗部（照片里雨篷底下那条深带，越贴近檐口越暗） */
  px(g, bx, by, GH_BWW, 6, rgba(SW_BOOTH_D, 0.26));
  px(g, bx, by + 6, GH_BWW, 5, rgba(SW_BOOTH_D, 0.12));
  px(g, bx, by, GH_BWW, 1, SW_BOOTH_D);
  px(g, bx, by, 1, GH_BWH, SW_BOOTH_D);
  px(g, bx + GH_BWW - 1, by, 1, GH_BWH, SW_BOOTH_D);

  /* ③ 深蓝门（照片 x264..294 / y655..722 ⇒ 画布 x130..147, y68..100）
     ⚠️ 门比门卫室左缘只缩进 3px —— 照片里门就贴在门卫室左端，不是居中。 */
  const dx = 130, dy = GH_H - 32;
  px(g, dx, dy, 18, 32, SW_DOOR_D);
  px(g, dx + 1, dy, 16, 30, SW_DOOR);
  px(g, dx + 1, dy, 1, 30, SW_DOOR_L);               // 门边提亮（光从左上）
  px(g, dx + 15, dy + 1, 1, 29, SW_DOOR_D);
  px(g, dx + 14, dy + 8, 2, 2, SW_WFRAME);           // 门把手

  /* ④ 两扇窗：大窗 2×2（正面）＋ 窄窗（照片里在右侧面上、掰正后落在正面右端）
     照片窗 A x310..380 y632..685 ⇒ 画布 x156..196, y58..84（40×26）
     照片窗 B x399..432 y640..688 ⇒ 画布 x205..222, y61..84（17×23） */
  const win = function (wx, wy, ww, wh, cols, rows) {
    px(g, wx, wy, ww, wh, SW_WFRAME);                // 白框
    const ix = wx + 2, iy = wy + 2, iw = ww - 4, ih = wh - 4;
    px(g, ix, iy, iw, ih, SW_GLASS);
    px(g, ix, iy, iw, Math.max(1, ih >> 1), SW_GLASS_L);   // 上半提亮（玻璃反光）
    px(g, ix, iy + ih - 1, iw, 1, SW_GLASS_D);
    for (let i = 1; i < cols; i++) px(g, ix + Math.round(iw * i / cols), iy, 1, ih, SW_WFRAME);
    for (let j = 1; j < rows; j++) px(g, ix, iy + Math.round(ih * j / rows), iw, 1, SW_WFRAME);
    px(g, wx, wy + wh, ww, 1, rgba(SW_BOOTH_D, 0.5));       // 窗台投影
  };
  win(156, 58, 40, 26, 2, 2);
  win(205, 61, 17, 23, 2, 3);

  /* ⑤ 右矮墙：横砖 + 压顶。照片里它比左围墙矮一半（43 vs 100） */
  const rx = GH_BWX + GH_BWW, ry = GH_H - GH_RWH;
  swBrick(g, rx, ry, GH_RWW, GH_RWH, 24, 7, SW_BRICK_L, SW_BRICK_D);
  px(g, rx, ry, GH_RWW, 2, SW_CAP);
  px(g, rx, ry + 2, GH_RWW, 1, SW_CAP_HI);

  /* ⑥ 雨篷（最前层）：左段高、右段低，中间一个 8px 的台阶 —— 照片里那是个进深折角，
     掰正后就是这道台阶。它压住左围墙顶、门卫室顶、矮墙顶。 */
  const eave = function (ex, ew, et, pleat) {
    const eh = GH_EB - et;
    px(g, ex, et, ew, eh, SW_EAVE_L);                    // 板面：正面看就是一条横板
    /* ⚠️ 折扇密棱**只给左段**：照片里收起来的那一半（x205..305 ⇒ 画布 98..181）
       才有一根根竖棱，展开的右半是平板。首轮两段都压了竖纹 ⇒ 整条雨篷像拉了一排百叶。 */
    /* 左段密棱、右段疏淡棱：照片里展开的那一半也还有痕，只是浅得多。
       两段都压同样重的棱时整条雨篷像一排百叶（首轮渲染）。 */
    if (pleat) swVgrain(g, ex, et, ew, eh, 3, SW_EAVE_D);
    else swVgrain(g, ex, et, ew, eh, 8, rgba(SW_EAVE_D, 0.38));
    px(g, ex, et, ew, 1, SW_EAVE_D);                     // 上沿
    px(g, ex, GH_EB - 2, ew, 2, SW_CAP);                 // 檐口：下沿压深（照片里最重的一笔）
    px(g, ex, GH_EB, ew, 2, rgba(SW_CAP, 0.32));         // 檐下投影，落在底下的墙面上
  };
  eave(GH_EX, 78, GH_ET_L, true);                        // 左段 98..176（折扇收起段）
  eave(GH_EX + 78, GH_EW - 78, GH_ET_R, false);          // 右段 176..287（展开的平板）
  px(g, GH_EX, GH_ET_L, 1, GH_EB - GH_ET_L, SW_CAP);     // 左封头
  px(g, GH_EX + GH_EW - 1, GH_ET_R, 1, GH_EB - GH_ET_R, SW_EAVE_D);

  /* ⑦ 接地影：整条落在落地线上（画布最后两行） */
  px(g, 0, GH_H, GH_W, 1, "rgba(14,18,28,0.26)");
  px(g, 0, GH_H + 1, GH_W, 1, "rgba(14,18,28,0.12)");
  return { canvas: c, ax: 0, ay: GH_H };                 // ax:0 ⇒ x 就是画布左缘
}

/* --- 6.4.7 校名碑墙 --- */
function makeSteleWall() {
  const c = mkCanvas(ST_W, ST_H + 4), g = c.getContext("2d");
  /* 砖墙：照片里砖更长（世界 23）、行高 7，与左围墙同族但更规整 */
  swBrick(g, ST_SW, 0, ST_W - ST_SW, ST_H, 23, 7, SW_BRICK_L, SW_BRICK_D);
  /* 顶：深压顶 + 上沿亮线；底：勒脚亮线 + 深线（照片实测 y534 与 y724 两处） */
  px(g, ST_SW, 0, ST_W - ST_SW, 2, SW_CAP);
  px(g, ST_SW, 2, ST_W - ST_SW, 1, SW_CAP_HI);
  px(g, ST_SW, ST_H - 2, ST_W - ST_SW, 1, SW_CAP_HI);
  px(g, ST_SW, ST_H - 1, ST_W - ST_SW, 1, SW_CAP);
  /* 左端面：照片里墙有厚度，左侧露出一条深色竖带 */
  px(g, 0, 0, ST_SW, ST_H, SW_SIDE);
  px(g, 0, 0, 1, ST_H, SW_CAP);
  px(g, ST_W - 1, 0, 1, ST_H, SW_CAP);       // 右缘收头（照片里墙到 x1395 就断了）

  /* 石碑：直接搬到 §5.4.7 的成品上裁掉花岗岩框（见头注【四】）——
     `makeSchoolStone()` 出 102×63、框厚 HF=6，所以 (6,6) 起 90×51 就是石板本身。 */
  const HF = SM_FRAME >> 1;
  const full = makeSchoolStone();
  const sx = SLB_CX - ST_X - (SLB_W >> 1);              // 画布内碑左缘
  const sy = SLB_TOP;
  /* 碑比墙高，先在外圈压一道深缝（嵌进去的碑比砖面低，接缝必须看得见） */
  px(g, sx - 1, sy - 1, SLB_W + 2, SLB_H + 2, rgba(SW_CAP, 0.55));
  px(g, sx, sy + SLB_H, SLB_W, 2, rgba(SW_CAP, 0.30));  // 碑下沿的落影
  g.drawImage(full.canvas, HF, HF, SLB_W, SLB_H, sx, sy, SLB_W, SLB_H);
  return { canvas: c, ax: 0, ay: ST_H };
}

/* --- 6.4.8 摆进世界 ---
   ⚠️ 与 §6.5b/§6.5c/§6.5d 同款约束：必须在 scatter() / plantRows() **之前**
      addProp + addSolid，否则这两块地会长出散射树、垃圾桶与行道树。 */
function buildSouthWest() {
  addProp(Object.assign({}, makeGuardHouse(), { x: GH_X, y: SW_BY, tag: "ghouse" }));
  /* 碰撞盒：给左围墙 / 门卫室 / 右矮墙三段各一块（雨篷悬空、不落盒）。
     南沿就是落地线 ⇒ 玩家沿南墙走时贴着正面擦过去，绕得过去、穿不过去。 */
  addSolid(GH_X + GH_LWW / 2, SW_BY, GH_LWW, 10);
  addSolid(GH_X + GH_BWX + GH_BWW / 2, SW_BY, GH_BWW, 10);
  addSolid(GH_X + GH_BWX + GH_BWW + GH_RWW / 2, SW_BY, GH_RWW, 10);

  addProp(Object.assign({}, makeSteleWall(), { x: ST_X, y: SW_BY, tag: "stwall" }));
  addSolid(ST_X + ST_W / 2, SW_BY, ST_W, 10);
}

/* --- 6.4.9 净空 ---
   两件都落在"围墙内侧贴着墙根"的那一条带上，那一带原本有散射树、路灯与
   行道树（现状：拱门西侧有一棵桧柏 + 一棵粉色花树；碑墙东端压在既有路灯
   （2272,2457，32×84，横跨 x2256..2288）上）。
   ⚠️ 必须排在 §6.6c 的 clearPropTreeClash() **之后** —— 先跑会改变它保留/丢弃的
      集合，clashDropped 的计数跟着变（与 §5.2.8 / §5.3.9b 同款约束）。
   ⚠️ 石狮（tag `smLion`，x2111..2145）落在两个框**之间**的空档里，本函数碰不到它；
      保险起见仍把两块地的**所有**已放道具都纳入判据，只放行自己与楼（宽>110）。 */
const GHC_CLR = { x: 1600, y: 2385, w: 315, h: 112 };   // 保安厅 1607..1908 往外各留 7px
/* ⚠️ 左缘必须是 **2146**，不是 2143。
   `_propdiff.py` 2026-09-27 实测：写 2143 时石狮（tag `smLion`，锚点 SL_X=2128、
   `ax=17`、宽 34 ⇒ 足迹 **2111..2145**）右沿 2145 顶进框里 2px ⇒ **石狮被本函数删掉**，
   而用户的原话是「石狮子不用动」。2146 让判据 `x1 > C.x` 恰好不成立，狮子整只放行。
   （碑墙足迹 2150..2384 与狮子右沿仍差 5px，本来就不重叠 —— 见 §6.4.2。） */
const STW_CLR = { x: 2146, y: 2390, w: 247, h: 107 };   // 碑墙 2150..2384，西端留 4px
function clearSouthWest() {
  const boxes = [GHC_CLR, STW_CLR];
  const keep = [];
  let dropped = 0;
  for (const p of props) {
    /* ⚠️ `smLion` **显式放行**，不靠"盒子算准了没碰到"。用户的原话是「石狮子不用动」，
       这颗 5px 的余量一旦哪天被谁挪一下锚点就会静默吞掉狮子 —— 而 `_propdiff` 只在自己
       想得起来跑的时候才报。宽 >110 那条留的是楼与围墙（大件一律不动）。 */
    if (p.tag === "ghouse" || p.tag === "stwall" || p.tag === "smLion" || p.img.width > 110) {
      keep.push(p); continue;
    }
    const x0 = p.x - p.ax, y0 = p.y - p.ay;
    const x1 = x0 + p.img.width, y1 = y0 + p.img.height;
    let hit = false;
    for (const C of boxes) {
      if (x0 < C.x + C.w && x1 > C.x && y0 < C.y + C.h && y1 > C.y) { hit = true; break; }
    }
    if (hit) { dropped++; continue; }
    keep.push(p);
  }
  props.length = 0;
  for (const p of keep) props.push(p);
  return dropped;
}
