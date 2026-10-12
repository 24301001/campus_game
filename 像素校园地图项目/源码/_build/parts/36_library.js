/* =========================================================
   3.6 图书馆 —— 按**用户亲手画的示意图**重设计（2026-09-17 第二轮）
   ---------------------------------------------------------
   ⚠️⚠️ 设计源换了，别再按照片改。
     上一版是"按照片复刻"（`_build/_photo/tushuguan1/2.jpg`）—— 交付后被用户退回，
     原话：「图书馆交付效果很差，仔细看校园示意图ppt第二张，我直接给你花了一个图书馆，
     这个图书馆蓝色矩形分别表示横着的窗户带和竖着的玻璃带，四个周围的柱形都是浅红色屋顶，
     注意图书馆外墙是那种x细小的白色长方形瓷砖铺的，梯形代表阶梯，重新设计」
     ⇒ **权威设计源 = `D:\desktop\校园示意图.pptx` 第 2 张**（用户手绘，41 个矢量形状）。
        照片降级为"氛围参考"：只用来定"这是一栋什么楼"，不再定形状。

   ------------------------------------------------------------------
   示意图怎么读（`_build/_pptlib.py 2 2 _look/ppt_s2.png` 就是它的渲染图）
   ------------------------------------------------------------------
   形状全走 `<p:style>` 的 fillRef 取**主题色**（theme1.xml）：
     accent1 `#4874CB` 蓝  = 横窗带 / 竖玻璃带 / 阶梯
     accent6 `#E54C5E` 浅红 = 四个屋顶带 + 三个锥顶
     bg1 白 = 外墙      ⇒ 下面所有形状都是**正立面**，一张平视图，无进深。
   构图（单位 px@96dpi，地面线 y=540.4）：
     · 中央高体量 x330..887.7，顶边 y148.2，顶上**三个浅红三角**：
       左小 330..491.2 / 中big 491.2..726.5 / 右小 726.5..887.7
       —— **三个的底边全在 y=148.2 这同一条基线上**（用户口径，已写进断言）。
     · 中央开间 522..695.7 里一条**竖着的蓝玻璃带** 565.1..652.6、y201.7..416.9；
       其下一条**蓝横带** 522.1..697、y416.1..467.6，上面写「图书馆」。
     · 中央高体量两侧各 2 列 × 4 行**竖向窄窗**（13.7×38.5，虚线状）。
     · 四个矮体量 = 左右**外柱**（x138..330 / 887.7..1079.7，顶边 y245.5）
       + 中央体量下部的左右**两翼**（x330..522 / 695.7..887.7，顶边 y366.3）。
       每个顶上一条**浅红屋顶带**（190×32.6），下面**横着的蓝窗带**
       —— 外柱 3 道（y302.1/356.9/411.8）、两翼 2 道（y418.3/473.1）。
     · 最下方居中一个**蓝梯形** 509..708.7、y507.8..540.4 = **阶梯**。
     · 外墙 = **细小的白色长方形瓷砖**（用户口径）。

   ------------------------------------------------------------------
   换算到精灵（只写这一处，两个方向各自一个比例）
   ------------------------------------------------------------------
   横向：示意图总宽 1079.7−138 = 941.7 → 精灵可画宽 LIB_W = 349
         HS = 349/941.7 = 0.370607
   纵向：示意图总高 540.4−11 = 529.4 → 精灵楼高 LIB_BASE−LIB_TOP = 245
         VS = 245/529.4 = 0.462787
   ⚠️ **楼高 245 < 楼宽 349**（比值 0.70）—— 这是用户口径，逐字：
      「整体高度降下来，因为图书馆应该是低矮的，目前有些瘦高了，高度不要超过宽度」。
      第二版按 VS = 0.616 画到 326 高（楼层间距正好 = FLOOR_H = 34）被他判"瘦高"退回
      ⇒ **"层高对齐全校"这条让位给"低矮"**，build.py 改成钉 `LIB_BASE − LIB_TOP ≤ 349`。
      两个方向的比例仍不相等（0.371 / 0.463，1.25 倍），换算一律照公式
      纵坐标 = LIB_BASE − (540.4 − 示意图y) × VS，不另存中间量。

   ------------------------------------------------------------------
   第七轮（2026-09-17）：**屋名牌撤掉**
   ------------------------------------------------------------------
   用户口径（逐字）：「图书馆几个简体字可以去掉了，留着那几个复刻的烫金字就行」。
   ⇒ 精灵上那块深色「图书馆」名牌（旧 ⑨ 段的 `g.drawImage(sgn.c, …)`）已删，
     楼名只由 ⑧ 那三个復刻烫金字「圖書館」承担。
   ⚠️ `makeSign(LIB_NAME)` **仍在调用**（现在是裸语句）—— 见 ⑨ 段的说明与 build.py ⑥。

   =========================================================
   ⚠️⚠️ 两条几何硬约束（改本节前必须先读）——本轮一字未动，仍然成立
   =========================================================
   ① **楼南侧零空隙，前庭只能从自己 footprint 里抠。**
        LIB.y + LIB.h = IX(2.6035 + 1.0618) = IX(3.6653) = 1431.6335
        东西主路（ARTERY cls2）北缘  = IX(3.6653) = 1431.6335
      一位小数都不差 —— 楼南墙就是主路北路边线。西 69.7px 外是明湖水面、东 45.8px
      外是东侧环路+篮球场、北 122.3px 外是 18 宿舍楼，四向都没有可用空地。
      ⇒ 前庭（LIB_FORE = 110）是从图书馆自己的 414.7px 进深里抠出来的，
        楼体南墙因此从 1431.63 退到 LIB_FY = 1321.63。

   ② **必须整栋后退，不能只退中央开间。** 精灵只有**一条**落地线 `baseY`；
      渲染时 `(p.y - p.ay)` 是精灵左上角的屏幕 y，玩家世界 y **大于** baseY
      才被画在精灵**之后**（＝压在精灵之上）。
      台阶画在精灵内、baseY 之南 ⇒ 站在台阶上的玩家 y > baseY ⇒ 正确地压在台阶上
      （这正是 55_gym.js:28-30 那条"台阶必须并进建筑精灵"规则的由来）。
      若只退中央开间、两翼仍顶到 1431.63，baseY 只能取两翼的落地线，前庭就落在
      baseY 之**北** ⇒ 站在台阶上的玩家会被台阶盖住。**不可行。**
   ========================================================= */

/* =========================================================
   3.6.0 常量（精灵与广场**同源**，只写这一处）
   ========================================================= */
const LIB = (() => {
  const e = CAMPUS.find(c => c[1] === "library");
  return { x: IX(e[2]), y: IX(e[3]), w: IX(e[4]), h: IX(e[5]) };
})();
const LIB_NAME = CAMPUS.find(c => c[1] === "library")[0];      // "图书馆"

const LIB_CX   = LIB.x + LIB.w / 2;          // 3254.6588  门轴 = 台阶轴 = 坐像轴
const LIB_BY   = LIB.y + LIB.h;              // 1431.6335  南边线 = 东西主路北缘
const LIB_FORE = 110;                        // 前庭进深（从自己 footprint 里抠）
const LIB_FY   = LIB_BY - LIB_FORE;          // 1321.6335  楼体南墙线 = **精灵落地线**
const LIB_STAIR = 45;                        // 台阶进深（世界像素 = 精灵向下加长的行数）

/* 精灵几何（局部坐标）。PADT/PADX 与 30 段同值，便于和其余楼对眼睛。 */
const LIB_W    = Math.round(LIB.w);          // 349
const LIB_PADX = 26, LIB_PADT = 18;
const LIB_X0   = LIB_PADX, LIB_X1 = LIB_PADX + LIB_W;      // 26 / 375
const LIB_SX   = LIB_X0 + LIB_W / 2;                       // 200.5  中轴（局部）
const LIB_BASE = 344;                        // 落地线行号（楼高 245 = LIB_BASE − LIB_TOP）
const LIB_H    = LIB_BASE + LIB_STAIR + 10;  // 399  画布高（344 以下 45 行给台阶 + 10 余量）

/* --- 横向分带：五个体量（示意图 x138..1079.7 / 330..887.7 换算，HS = 0.370607）---
   C1/C5 = 左右外柱（矮），C2/C3/C4 合起来 = 中央高体量（97..304 = 207），
   其中 C2/C4 是它下部的**两翼**、C3 是中央开间（玻璃带 + 门）。
   ⚠️ 五个数必须凑成 LIB_W：71+71+65+71+71 = 349（build.py 钉住）。 */
const LIB_C1 = [26, 97], LIB_C2 = [97, 168], LIB_C3 = [168, 233],
      LIB_C4 = [233, 304], LIB_C5 = [304, 375];
const LIB_UA = LIB_C2[0], LIB_UB = LIB_C4[1];              // 中央高体量 97..304

/* --- 竖向分带（自上而下）。VS = 0.462787（楼高 245，比楼宽 349 矮），
       每个数 = LIB_BASE − (540.4 − 示意图y) × VS，四舍五入取整 --- */
const LIB_TOP   = 99;                        // 大锥尖（= 楼顶，比 PADT 低 81 行留给透明留白）
const LIB_CBASE = 162;                       // **三个锥顶共用的底边线** = 中央高体量顶边
const LIB_SROOF = 207;                       // 外柱顶边（浅红屋顶带上沿）
const LIB_WROOF = 263;                       // 两翼顶边（浅红屋顶带上沿）
const LIB_GT    = 194;                       // 中央竖向玻璃带上端
                                             // ⚠️ 历史：194 是"楼名牌下沿 192 + 2"算出来的。**屋名牌已撤**
                                             //    （第七轮，用户："图书馆几个简体字可以去掉了"），
                                             //    现在没有东西压这一带了，理论上可以放回示意图换算的 187。
                                             //    **但故意不动**：这 7px 不产生任何可见差别，而 LIB_GT 一动
                                             //    中央玻璃带整条跟着走、得重出图核对，不值当。谁要动，
                                             //    先确认 ⑧ 的烫金字（LIB_GB=281 附近）不受影响。
const LIB_GB    = 281;                       // 中央竖向玻璃带下端（= 门头字区上沿）
const LIB_SG_B  = 313;                       // 门区上沿（门头字区下沿）
                                             // ⚠️ 字区 281..313 = 32 高、字高 20 ⇒ 上下各余 6。
                                             //    收到 26 高时只剩 3px，1× 下金字像贴在门楣上
const LIB_RBH   = 15;                        // 浅红屋顶带高（示意图 32.6 × VS = 15.1）
const LIB_WBH   = 15;                        // 横向蓝窗带高（示意图 31.7 × VS = 14.7）
const LIB_SWB   = 234;                       // 外柱最上一道横窗带的上沿
const LIB_WWB   = 287;                       // 两翼最上一道横窗带的上沿
const LIB_BSTEP = 25;                        // 相邻两道横窗带的间距（示意图 54.8 × VS）
/* 三个锥顶：[左边界, 宽, 高]。⚠️ 高度按 VS 换算（137.2/56.6 × VS = 63.5/26.2），
   三者**共用 LIB_CBASE 一条底边线** —— 这是用户口径，不许各自带 y。
   宽度加和 = LIB_UB − LIB_UA = 207（三角形之间不留缝，正好盖满中央体量的顶边）。 */
const LIB_CONES = [
  [97.0, 59.7, 26],                          // 左小锥  （示意图 330..491.2）
  [156.9, 87.3, 63],                         // 中央大锥（示意图 491.2..726.5）
  [244.2, 59.6, 26]                          // 右小锥  （示意图 726.5..887.7）
];
/* 两翼上的竖向窄窗：4 列 × 4 行（示意图 13.7×38.5，虚线状）。
   ⚠️ 四列关于中轴对称（由示意图 ±233.35 / ±130.35 换算后取整），别手改成等距。 */
const LIB_VWX  = [112, 150, 246, 284], LIB_VWW = 5;
const LIB_VWY  = [173, 195, 217, 239], LIB_VWH = 18;
/* 横窗带的横向留边：示意图里窗带占体量宽的 92%，几乎是通宽的带状窗。 */
const LIB_WM = 3;

/* =========================================================
   3.6.1 配色
   ---------------------------------------------------------
   两个主色**直接取自用户示意图的主题色**（这是他画这张图时用的色板，是权威）：
     蓝 accent1 `#4874CB` → 窗 / 玻璃带 / 门头横带
     浅红 accent6 `#E54C5E` → 三个锥顶 + 四条屋顶带
   两处降饱和是为了像素画：主题色是 PPT 的屏幕色，直接铺 1×1 会刺眼，
   压到 ≈82% 饱和后仍是明确的"浅红 / 宝蓝"，且能和 37 段篮球场 #a85a4a 的红并置不打架。
   ⚠️⚠️ 蓝玻璃的**暗色端**锚 SY_COL.GLASS（#2e5a7e = 思源楼幕墙的深色端），
      这样图书馆的蓝与它西边的思源楼共享阴影色。而 SY_COL 定义在 frozen demo 段里，
      **只能在函数内读**：58_dxdoor.js 的 PALETTE 已经栽过一次（顶层读撞 const
      暂时性死区，加载期整个 <script> 死、页面全白，而**三套自动验收一个都查不出**）。
      所以本表里**故意不含 SY_COL**（build.py 有断言钉住这一条）。
   ========================================================= */
const LIB_PAL = {
  WALL:   "#eae8e2", WALL_L: "#faf9f6", WALL_D: "#b9b6ad",
  TILE:   "#dbd8cf",                       // 瓷砖缝（外墙 = 细小白色长方形瓷砖）
  ROOF:   "#cf5a61", ROOF_L: "#e88a8f", ROOF_D: "#8f343b",
  GLASS:  "#4874cb", GLASS_HI: "#8cade8",
  FRAME:  "#8d8768", FRAME_D: "#5a5643",   // 门框青铜
  BRONZE: "#6f6a52", BRONZE_L: "#8d8768", BRONZE_D: "#3f3c2e",   // 坐像（本轮一字未动）
  STONE:  "#332c24",                       // 坐像黑石基座
  GOLD:   "#d8b24a", GOLD_D: "#9a7a2e",
  /* 门头「圖書館」刻字色。⚠️ **不能直接用 GOLD 系** —— 用户口径「放图书馆字体的地方
     是白色背景不是蓝色背景」把字从蓝底挪到了白瓷砖墙上，而 #ecc97c 高光在白底上
     对比度不到 1.3:1，三个字会糊成一片浅黄。这里换成"旧金 / 青铜"一档：
     亮端 #b8923c、底色 #8f6c24、暗端 #5b4218，在白底上对比 ≈4.0:1，仍是金的色相。
     坐像那组 GOLD 是给黑石基座用的，**原样保留不动**（动它会让 mao 精灵变像素）。 */
  CARVE:  "#8f6c24", CARVE_L: "#b8923c", CARVE_D: "#5b4218"
};
/* 台阶踢面 = **彩绘**。用户口径，逐字：
   「这个阶梯记得是彩绘的，多放几个颜色」—— 上一轮我以"新立面只有白/蓝/浅红"为理由
   把它改成三档蓝，被这一句推翻。八个基色 + 四个点缀色 = 12 色，**每 2 级一色**
   （15 级 = 8 条色带，八色各用一次），再在每级踢面上点一块点缀色方砖、逐级右移
   ⇒ 既有可读的色块宽度，又有一条斜向笔触。
   逐级换色太碎（实测放大图里是彩虹条形码），整级铺满同色块又是彩虹糖（第一版栽过）。 */
const LIB_PAINT   = ["#c9694f", "#d89a4a", "#c9b34e", "#7fa86a",
                     "#5aa0a8", "#5a7fb0", "#8f78b4", "#b06a92"];
const LIB_PAINT_A = ["#f0e0b8", "#2e4a6b", "#e8a8b0", "#3f6b4a"];

/* =========================================================
   3.6.2 门头「圖書館」点阵（由 _build/_libfont.py 生成，勿手改）
   ========================================================= */
/*__LIB_GEN_BEGIN__*/
/* ==== 由 _build/_libfont.py 生成，勿手改 ==== */
/* 图书馆门头「圖書館」三字点阵 —— 源是用户从照片里提炼的 _photo/tushuguanfont.png
   （白底金字，按**饱和度** max-min >= 45 切，不是灰阶；
   灰色水印与斜向水印纹理都是中性的，一并被切掉）。逐字高 20/20/20。
   ⚠️ 这里**故意不写坐标**：字宽随长宽比走，换一次源就要重算，
      写死一份到生成块里必然和调用点对不上（_mhfont.py 上一版就是这么留了组错坐标）。
      排布在调用点现算（见 §3.6 libPlaque()）。 */
const LIB_MASK_TU = "AfAGCBhkM+Zr4+/zz/PP48/j2bPf+9/739/Hz9/G3AbkBmYMcxgA8A==";
const LIB_MASK_SHU = "AEABgAMAB4ANgH/A/4DwB+Afg88HHwA+AHwAvgPsB/AP4A/AD4A=";
const LIB_MASK_GUAN = "AwAAMGAHhwD4dww38eP+H3eDfhA3z4b4+O8PjHDwh4+AfPgHz4Bw2AYPwADwAAwAAMA=";
/* [点阵, 宽, 高] —— 顺序：圖 書 館 */
const LIB_CHARS = [
  [LIB_MASK_TU, 16, 20],
  [LIB_MASK_SHU, 15, 20],
  [LIB_MASK_GUAN, 20, 20]
];
/* ==== 生成块结束 ==== */
/*__LIB_GEN_END__*/

/* --- 3.6.3 点阵字：1bit 掩膜 → 金字（上亮下暗的浮雕感，同 55 段 gyGlyph） --- */
function libBits(b64, cnt) {
  const s = atob(b64), out = new Uint8Array(cnt);
  for (let i = 0; i < cnt; i++) out[i] = (s.charCodeAt(i >> 3) >> (7 - (i & 7))) & 1;
  return out;
}
/* 逐列取"竖run"整段铺金，再给 run 的两端点高光/暗金。
   ⚠️ 判据是**竖 run ≥ 3** 才点端点 —— 短笔画（点是 1~2 px 的横）点了端点就糊成一块。
   ⚠️ 取色走 CARVE 系（白底可读），不是 GOLD 系 —— 理由见 LIB_PAL 里那段注释。 */
function libGlyph(g, b64, nw, nh, x, y) {
  const b = libBits(b64, nw * nh);
  for (let i = 0; i < nw; i++) {
    let j = 0;
    while (j < nh) {
      if (!b[j * nw + i]) { j++; continue; }
      let k = j;
      while (k + 1 < nh && b[(k + 1) * nw + i]) k++;
      px(g, x + i, y + j, 1, k - j + 1, LIB_PAL.CARVE);
      if (k - j + 1 >= 3) {
        px(g, x + i, y + j, 1, 1, LIB_PAL.CARVE_L);
        px(g, x + i, y + k, 1, 1, LIB_PAL.CARVE_D);
      }
      j = k + 1;
    }
  }
}
/* 门头刻字：宽度按 LIB_CHARS 的逐字宽**现算**（字宽随长宽比走，绝不写死坐标）。
   三个字加两个 5px 间隔 = 61 宽，居中在 LIB_SX 上、**直接落在白瓷砖墙面上**
   （用户口径：白底不是蓝底）——所以这里不再有那条蓝横带，调用点也只剩这一个。 */
const LIB_GAP = 5;
function libPlaque(g, cx, yBot) {
  let tw = LIB_GAP * (LIB_CHARS.length - 1);
  for (const e of LIB_CHARS) tw += e[1];
  const nh = LIB_CHARS[0][2];
  let x = Math.round(cx - tw / 2);
  for (const e of LIB_CHARS) {
    libGlyph(g, e[0], e[1], e[2], x, yBot - nh);
    x += e[1] + LIB_GAP;
  }
}

/* =========================================================
   3.6.4 前庭：方形石头铺装（**取代**旧三角广场）
   ========================================================= */
/* 前庭 = 楼体南墙线以南的整条带（全宽）。用**格中心**判定，与 stampRect 同规。 */
function inLibFore(x, y) {
  return x > LIB.x && x < LIB.x + LIB.w && y > LIB_FY && y < LIB_BY;
}
/* 把前庭从"建筑占用"里抠出来标成广场 —— 路网与碰撞都要认它。
   ⚠️ 调用点必须卡在 `classifyFree` 之后、`buildGround` 之前（60_assemble.js）：
      先建占用图做距离变换（否则前庭不参与路网推演），又必须在烘焙前落定
      （否则地面不认它是广场）。与升旗台凹口、雕塑凹口同一套手法。 */
function stampLibraryPlaza() {
  for (let cy = 0; cy < NH; cy++) {
    for (let cx = 0; cx < NW; cx++) {
      const x = cx * CELL + CELL / 2, y = cy * CELL + CELL / 2;
      if (!inLibFore(x, y)) continue;
      CELLK[cy * NW + cx] = K.PLAZA;
    }
  }
}
/* 前庭石铺（烘焙进地面）。
   ⚠️ 本段**吃共享 rng**（与 paintPlazas 同规，不另起局部流）：改这里的石板数
      会重掷 buildGround 下游（水/操场/球场/校门/路缘/标线/井盖/磨损/泥土/围墙）
      的地面噪声 —— 视觉等价，且**props 不受影响**（scatter 用的是独立流
      rngS = makeRng(31415926)），所以 _propdiff / _sprhash 这两个像素级判据照常有效。
      三套自动验收（accept/verify/zoomtest）**都查不出**地面噪声变了，这是已知的。 */
function paintLibraryPlaza(g, rng) {
  const x0 = Math.round(LIB.x), x1 = Math.round(LIB.x + LIB.w);
  const y0 = Math.round(LIB_FY) - 6;          // 往北多铺 6px，被楼体精灵压住，防缝隙
  const y1 = Math.round(LIB_BY) + 4;          // 往南压过主路北缘 4px，铺装"接"到路
  px(g, x0, y0, x1 - x0, y1 - y0, PLAZA_BASE);
  for (let y = Math.ceil(y0 / 32) * 32; y < y1; y += 32)
    for (let x = Math.ceil(x0 / 32) * 32; x < x1; x += 32)
      px(g, x + 1, y + 1, 30, 30, shade(PLAZA_BASE, (rng() - 0.5) * 0.22));
  /* 四周一圈深色石缘：把"图书馆自己的地"和外面的路划开 */
  px(g, x0, y0, x1 - x0, 3, shade(PLAZA_DARK, -0.20));
  px(g, x0, y0, 3, y1 - y0, shade(PLAZA_DARK, -0.20));
  px(g, x1 - 3, y0, 3, y1 - y0, shade(PLAZA_DARK, -0.20));
}

/* =========================================================
   3.6.4b 前庭净空：把落进前庭的树清掉
   ---------------------------------------------------------
   为什么必须有这一条：`stampLibraryPlaza()` 把前庭标成 `K.PLAZA`，而散射（`scatter`）
   与规则点阵（`plantRows`）**都会往广场上种树**。楼体没后退时这些树的接地点(≈1357)
   小于旧落地线 1431.63 ⇒ 一直被楼挡着看不见；楼体一退到 LIB_FY = 1321.63，
   它们就翻到楼**前面**来 —— 而且正好**站在彩绘台阶上**（台阶占 LIB_FY..LIB_FY+45）。
   ⚠️ 判据用**接地点**（p.x, p.y），与 clearLawnZone 同规；不用美术盒（树冠探到前庭
      上空正是边界树该有的样子，按盒判会把前庭外那一圈也误删）。
   ⚠️ 只删 `tree` / `lawnTree` 两个 tag：坐像(tag "mao")、路灯、桶、椅要么有别的 tag
      要么没有 tag，天然放行 —— 这一条**不会**碰到坐像。
   ⚠️ 调用点必须在 `plantRows()` **之后**（规则树阵也往这里种），
      见 60_assemble.js §6.6c 之后那一行。
   ========================================================= */
function clearLibFore() {
  const keep = [];
  let dropped = 0;
  for (const p of props) {
    if ((p.tag === "tree" || p.tag === "lawnTree") && inLibFore(p.x, p.y)) { dropped++; continue; }
    keep.push(p);
  }
  props.length = 0;
  for (const p of keep) props.push(p);
  return dropped;
}

/* =========================================================
   3.6.5 立面零件（全部照示意图的四种"带"来写）
   ========================================================= */
/* 白瓷砖墙皮：**细小的白色长方形瓷砖**（用户口径），8×4 走砖、错缝。
   ⚠️ 瓷砖缝用**绝对坐标取模**，不按传入的 x0/y0 起算 —— 相邻体量的墙会叠着画
      （两翼压在中央高体量上），相位不一致就会在接缝处挂出半块砖。
   受光/背光棱由调用点补（libPost）。 */
function libTiles(g, x0, x1, y0, y1) {
  const P = LIB_PAL;
  px(g, x0, y0, x1 - x0, y1 - y0, P.WALL);
  for (let yi = Math.floor(y0 / 4); yi * 4 < y1; yi++) {
    const y = yi * 4, o = (yi & 1) ? 4 : 0;
    px(g, x0, y, x1 - x0, 1, P.TILE);                        // 横缝
    for (let xi = Math.ceil((x0 - o) / 8); xi * 8 + o < x1; xi++) {
      const x = xi * 8 + o;
      if (x > x0 && x < x1 - 1) px(g, x, y + 1, 1, 3, P.TILE);   // 竖缝（错缝半块）
    }
  }
}
/* 体量的左右棱：左受光、右背光（照 SUN 在左上）。 */
function libPost(g, x0, x1, yTop) {
  const P = LIB_PAL;
  px(g, x0, yTop, 2, LIB_BASE - yTop, P.WALL_L);
  px(g, x1 - 2, yTop, 2, LIB_BASE - yTop, shade(P.WALL, -0.34));
  px(g, x0, yTop, x1 - x0, 1, P.WALL_L);                     // 顶边
}
/* 四棱锥顶：正南正交视角下只能看见**正面那一坡**，所以就是一个等腰三角形。
   受光按 SUN（左上）—— 左半亮、右半暗；每 5 行一道瓦缝。
   ⚠️ 三个锥**共用一条底边线**（LIB_CBASE）：这是用户口径"三个三角形的底边全在同一条
      基线上"的可执行形式，调用点由 build.py 钉住，不许各自带 y。 */
function libCone(g, cx, yBase, hw, h, col) {
  for (let i = 0; i < h; i++) {
    /* ⚠️ 半宽必须**随 i 增大**：i=0 是锥尖（宽 ≈0）、i=h-1 是锥底（满宽 hw）。
       写成 `hw*(h-i)/h` 就是上下颠倒 —— 一个上宽下窄的漏斗，而四套自动验收
       一个都判不出来（它们不看画面），只有 _propview.py 的放大图看得见。 */
    const w = hw * (i + 1) / h;
    const xa = Math.round(cx - w), ww = Math.max(1, Math.round(2 * w));
    px(g, xa, yBase - h + i, ww, 1, col);
    if (ww > 4) {                                   // 两侧坡面的受光/背光
      px(g, xa, yBase - h + i, 1, 1, shade(col, 0.22));
      px(g, xa + ww - 1, yBase - h + i, 1, 1, shade(col, -0.30));
    }
    if (i % 5 === 4) px(g, xa + 1, yBase - h + i, Math.max(1, ww - 2), 1, shade(col, -0.16));
  }
  /* 檐口线：锥底一道深色，把锥和墙分开 */
  px(g, Math.round(cx - hw) - 1, yBase - 1, Math.round(2 * hw) + 2, 1, shade(col, -0.46));
}
/* 浅红屋顶带：四个矮体量各一条（示意图里是贴在体量顶边的一块 190×32.6 的浅红矩形）。
   ⚠️ 它是**竖直面**（正立面上看到的是屋顶带的正面），不是朝天的屋面 ——
      所以只给上棱受光、下棱背光，不画进深。 */
function libRoofBand(g, x0, x1, y0) {
  const P = LIB_PAL, h = LIB_RBH;
  px(g, x0, y0, x1 - x0, h, P.ROOF);
  px(g, x0, y0, x1 - x0, 2, P.ROOF_L);
  px(g, x0, y0 + h - 2, x1 - x0, 2, P.ROOF_D);
  px(g, x0, y0 + (h >> 1), x1 - x0, 1, shade(P.ROOF, -0.14));   // 一道瓦垄，别读成纯色板
  px(g, x0 - 1, y0, 1, h, shade(P.ROOF, -0.22));
  px(g, x1, y0, 1, h, shade(P.ROOF, -0.36));
}
/* 横向蓝窗带（外柱 3 道 / 两翼 2 道）：通宽带状窗 + 细竖梃。
   ⚠️ 竖梃只是给 1× 下的可读性加一点质地，别加密到"窗格"——示意图里它是**整片蓝**。 */
function libWinBand(g, x0, x1, y0, h) {
  const P = LIB_PAL;
  px(g, x0, y0, x1 - x0, h, P.GLASS);
  px(g, x0, y0, x1 - x0, 1, P.GLASS_HI);
  px(g, x0, y0 + h - 1, x1 - x0, 1, shade(P.GLASS, -0.38));
  px(g, x0, y0, 1, h, shade(P.GLASS, 0.22));
  px(g, x1 - 1, y0, 1, h, shade(P.GLASS, -0.26));
  for (let x = x0 + 11; x < x1 - 3; x += 11)
    px(g, x, y0 + 1, 1, h - 2, shade(P.GLASS, -0.24));
}
/* 竖向窄窗（中央体量的两翼上，示意图 13.7×38.5 的虚线状竖条）：
   4 列 × 4 行，**列 x 由 LIB_VWX 给死**（关于中轴对称），行距 22。 */
function libVWin(g, x0) {
  for (const y of LIB_VWY) libWinBand(g, x0, x0 + LIB_VWW, y, LIB_VWH);
}
/* 中央竖向玻璃带：**竖着的玻璃带**（用户口径），从檐下贯到门头刻字区。
   暗色端在函数内读 SY_COL.GLASS（见 3.6.1 注；顶层读＝整页 JS 死）。 */
function libGlassRibbon(g, x0, x1, y0, y1) {
  const P = LIB_PAL;
  const GD = SY_COL.GLASS;
  const w = x1 - x0, h = y1 - y0;
  px(g, x0, y0, w, h, P.GLASS);
  for (let y = y0; y < y1; y += FLOOR_H)                    // 横分格：往上接着数楼层
    px(g, x0, y, w, 2, shade(GD, -0.10));
  /* 斜向反光：只在上段留一道，长了会读成"理发店转筒" */
  for (let i = 0; i < Math.min(h, 28); i++) {
    const x = x0 + 3 + i;
    if (x < x1 - 2) px(g, x, y0 + i, Math.min(4, x1 - 2 - x), 1, P.GLASS_HI);
  }
  px(g, x0, y0, 1, h, P.GLASS_HI);                          // 左棱受光
  px(g, x0 + 1, y0, 2, h, shade(GD, 0.26));
  px(g, x1 - 3, y0, 3, h, shade(GD, -0.20));                // 右棱背光
  px(g, x0, y0, w, 1, shade(GD, 0.34));
  px(g, x0, y1 - 2, w, 2, shade(GD, -0.36));
}
/* 入口：青铜门框 + 深色玻璃门（两扇 + 中梃）。门区上沿 = LIB_SG_B。 */
function libDoor(g, x0, x1, yTop) {
  const P = LIB_PAL;
  const GD = SY_COL.GLASS;
  const h = LIB_BASE - yTop;
  px(g, x0 - 3, yTop, x1 - x0 + 6, 4, shade(P.FRAME, 0.14));      // 门楣
  px(g, x0 - 3, yTop + 4, x1 - x0 + 6, 1, P.FRAME_D);
  px(g, x0, yTop + 5, x1 - x0, h - 5, shade(GD, -0.32));          // 深色玻璃
  px(g, x0, yTop + 5, x1 - x0, 2, shade(GD, 0.06));
  const mid = Math.round((x0 + x1) / 2);
  px(g, mid - 1, yTop + 5, 2, h - 5, shade(P.FRAME, -0.06));      // 中梃
  px(g, x0, yTop + 5, 2, h - 5, shade(P.FRAME, 0.08));
  px(g, x1 - 2, yTop + 5, 2, h - 5, shade(P.FRAME, -0.26));
  px(g, x0, LIB_BASE - 2, x1 - x0, 2, shade(GD, -0.52));          // 门槛
}
/* 阶梯：画在落地线**之下**（＝楼前＝南侧），11 级、每级 4 行。
   ⚠️ 必须画在精灵画布内：画布往下长 = 往南长 = 长在楼前（55_gym.js:28-30）。
      画成独立道具就会被深度排序判反，站在台阶上的玩家会被台阶盖住。
   宽度照示意图的**梯形**：上窄下宽（40 → 74），
   即"梯形代表阶梯"这条口径的可执行形式。
   ⚠️ 级数 15→11、行数 3→4 是**为彩绘服务的**：踢面只有 1 行时，彩绘在放大图里读成
      "彩虹条形码"（15 条 1px 色线夹在近白踏面之间），2 行才看得出色块。
      11 × 4 = 44 ≤ LIB_STAIR(45)，画布与台阶进深都不用动。 */
function libStair(g) {
  const P = LIB_PAL, N = 11, WA = 40, WB = 74;
  for (let i = 0; i < N; i++) {
    const w = Math.round(WA + (WB - WA) * i / (N - 1));
    const x = Math.round(LIB_SX - w / 2), y = LIB_BASE + i * 4;
    /* 每级占 4 行：**踏面 1 / 踢面 2 / 级间投影 1**。
       ⚠️ 投影必须画在 y+3 —— 下一步的踏面在 y+4，写在那儿会被整行盖掉，
          "级间投影"一行都不会显示（旧版就是这么死的，放大图里台阶是一整片色块）。 */
    px(g, x, y, w, 1, shade(P.WALL_L, 0.04 - i * 0.014));       // 踏面（受光）
    /* 踢面（彩绘）：**每 2 级一色**（11 级 = 6 条色带）。
       ⚠️ 不能逐级换色：踏面是近白的、逐级换色在放大图里是"彩虹条形码"，
          读不出"壁画"；2 级一组才有可读的色块宽度。 */
    px(g, x, y + 1, w, 2, LIB_PAINT[((i / 2) | 0) % LIB_PAINT.length]);
    /* 踢面上再压一块点缀色方砖，位置逐级右移 9px ⇒ 连起来是一条斜向笔触带。
       ⚠️ 右端必须夹到 x+w：不夹的话末级（w=74）方砖会写到相邻级的老位置上。 */
    const bx = x + 3 + ((i * 9) % Math.max(1, w - 16));
    px(g, bx, y + 1, Math.min(14, x + w - bx), 2,
       LIB_PAINT_A[i % LIB_PAINT_A.length]);
    px(g, x, y + 3, w, 1, "rgba(14,18,28,0.26)");               // 级间投影
  }
  /* 两侧斜坡护墙：照片里台阶两边有石帮 */
  for (let i = 0; i < N; i++) {
    const w = Math.round(WA + (WB - WA) * i / (N - 1));
    const x = Math.round(LIB_SX - w / 2), y = LIB_BASE + i * 4;
    px(g, x - 3, y, 3, 4, shade(P.WALL_D, -0.24));
    px(g, x + w, y, 3, 4, shade(P.WALL_D, -0.36));
  }
}

/* =========================================================
   3.6.6 图书馆本体精灵
   ---------------------------------------------------------
   绘制顺序 = 从后到前：中央高体量 → 左右外柱 → 两翼 → 三条锥顶 →
                      玻璃带 / 窄窗 / 门头刻字 / 门 → 彩绘台阶。
   ========================================================= */
function makeLibrary(o) {
  const rng = makeRng(o.seed);
  const P = LIB_PAL;
  const c = mkCanvas(LIB_W + LIB_PADX * 2, LIB_H);
  const g = c.getContext("2d");
  const SHX = Math.round(-SUN.x * 26), SHY = Math.round(-SUN.y * 26);

  /* --- 地面投影：先画，落在自己前庭的铺装上（前庭是烘焙的地面，本精灵压在上面）--- */
  shadowQuad(g, LIB_X0 + 2, LIB_BASE - 20, LIB_X1 - 2, LIB_BASE + 6, SHX, SHY, 0.26, 4);

  /* --- ① 由后到前三层墙（全是白瓷砖）---
     中央高体量先铺满全高；外柱与两翼叠在它上面（同色同砖缝，相位一致 ⇒ 看不出接缝）。 */
  libTiles(g, LIB_UA, LIB_UB, LIB_CBASE, LIB_BASE);
  libTiles(g, LIB_C1[0], LIB_C1[1], LIB_SROOF, LIB_BASE);
  libTiles(g, LIB_C5[0], LIB_C5[1], LIB_SROOF, LIB_BASE);

  /* --- ② 三层顶边 / 侧棱 --- */
  libPost(g, LIB_X0, LIB_C1[1], LIB_SROOF);                    // 外左
  libPost(g, LIB_C5[0], LIB_X1, LIB_SROOF);                    // 外右
  px(g, LIB_UA, LIB_CBASE, LIB_UB - LIB_UA, 2, P.WALL_L);      // 中央高体量顶边（锥基座线）
  px(g, LIB_UA, LIB_CBASE, 2, LIB_BASE - LIB_CBASE, P.WALL_L);
  px(g, LIB_UB - 2, LIB_CBASE, 2, LIB_BASE - LIB_CBASE, shade(P.WALL, -0.34));
  /* 两翼的顶边（浅红屋顶带的上沿，稍后由 libRoofBand 的受光棱给出）与
     外柱／中央体量之间的两条竖缝 */
  px(g, LIB_C1[1] - 2, LIB_SROOF, 1, LIB_BASE - LIB_SROOF, shade(P.WALL, -0.30));
  px(g, LIB_C5[0], LIB_SROOF, 1, LIB_BASE - LIB_SROOF, P.WALL_L);

  /* --- ③ 四条浅红屋顶带（用户口径：四个周围的柱形都是浅红色屋顶）--- */
  for (const V of [LIB_C1, LIB_C5]) libRoofBand(g, V[0], V[1], LIB_SROOF);
  for (const V of [LIB_C2, LIB_C4]) libRoofBand(g, V[0], V[1], LIB_WROOF);

  /* --- ④ 三个锥顶：**共用 LIB_CBASE 一条底边线**（用户口径，build.py 钉住）---
     ⚠️ 三个三角形首尾相接、正好盖满中央体量的顶边（97..304），中间不留女儿墙。 */
  for (const T of LIB_CONES) libCone(g, T[0] + T[1] / 2, LIB_CBASE, T[1] / 2, T[2], P.ROOF);

  /* --- ⑤ 中央竖向玻璃带（从檐下贯到门头刻字区）--- */
  libGlassRibbon(g, LIB_C3[0] + 16, LIB_C3[1] - 16, LIB_GT, LIB_GB);

  /* --- ⑥ 两翼上的 4 列 × 4 行竖向窄窗 --- */
  for (const x of LIB_VWX) libVWin(g, x);

  /* --- ⑦ 四条横窗带：外柱 3 道、两翼 2 道（每条都是通宽带状窗）---
     ⚠️ 不再用 `LIB_SROOF + 35 + k * FLOOR_H` 那种"借全校层高推"的写法：楼降矮后
        窗带间距（25）已不等于 FLOOR_H（34），借 FLOOR_H 会把第二三道窗推到墙外。 */
  for (const V of [LIB_C1, LIB_C5]) {
    const a = V[0] + LIB_WM, b = V[1] - LIB_WM;
    for (let k = 0; k < 3; k++) libWinBand(g, a, b, LIB_SWB + k * LIB_BSTEP, LIB_WBH);
  }
  for (const V of [LIB_C2, LIB_C4]) {
    const a = V[0] + LIB_WM, b = V[1] - LIB_WM;
    for (let k = 0; k < 2; k++) libWinBand(g, a, b, LIB_WWB + k * LIB_BSTEP, LIB_WBH);
  }

  /* --- ⑧ 门头「圖書館」刻字（**白底**）+ 入口 ---
     ⚠️ 用户口径：「放图书馆字体的地方是白色背景不是蓝色背景」⇒ 这里不再有那条蓝横带，
        三个字直接刻在中央开间的白瓷砖墙面上（字色换 CARVE 系才在白底上读得出，
        见 LIB_PAL 的注）。yBot 仍按"居中于 LIB_GB..LIB_SG_B 这条带"现算。 */
  libPlaque(g, LIB_SX, LIB_GB + Math.round((LIB_SG_B - LIB_GB + LIB_CHARS[0][2]) / 2));
  libDoor(g, Math.round(LIB_SX - 20), Math.round(LIB_SX + 20), LIB_SG_B);

  /* --- ⑨ 屋名牌（**已撤**，只剩调用） ----
     ⚠️ 用户口径（逐字）：「图书馆几个简体字可以去掉了，留着那几个复刻的烫金字就行」。
        上面 ⑧ 那三个復刻烫金字「圖書館」已经是楼名，这里再挂一块简体牌是重复。
     ⚠️ 但 makeSign(LIB_NAME) **必须照旧调用**：verify.py 的屋名标牌自检读 _signCache，
        不调用就报 MISS:图书馆 —— 它只查缓存里有没有这一项，**不查牌面画没画**
        （已核实 verify.py:57-66 的 wantNames/got/missing 三条判据）。
        ⇒ 合法写法就是"调而不画"，所以这里是**裸语句**，不是漏了 if。 */
  makeSign(LIB_NAME);

  /* --- ⑩ 彩绘台阶（画在 baseY 之下） --- */
  libStair(g);
  contactBand(g, LIB_X0 + 1, LIB_X1 - 1, LIB_BASE - 1, 2, 0.34);

  /* ⚠️ h 是**楼高**（LIB_BASE − LIB_TOP = 245），不是"落地线 − PADT" —— 楼降矮后
     楼顶落在行 99，比 PADT(18) 低 81 行，写 PADT 会把透明留白算进楼高。 */
  return { canvas: c, ax: LIB_SX, ay: LIB_BASE, w: LIB_W, h: LIB_BASE - LIB_TOP };
}

/* =========================================================
   3.6.7 茅以升坐像（独立道具）
   ---------------------------------------------------------
   ⚠️ 必须是**独立道具**，不能并进建筑精灵：
      并进去就会跟着建筑的 baseY 一起排序 —— 走到坐像**背后**（坐像与台阶之间）的
      玩家 y 仍大于建筑的 baseY，会被画在坐像**前面**，看起来像穿过了铜像。
      做成独立道具后它有自己的 baseY，前后遮挡由 y 自然决定。
      （这与台阶**必须**并进精灵的理由正好相反，见 3.6.5 libStair 的注。）
   基座上的「茅以升」三字：56px 宽的基座上放不出可读的 1bit 字形，
   照 55 段"落款"的先例只点三小块暗示有字，不描字形。
   ========================================================= */
/* 尺寸锚：人物精灵是 CH_W 18 × CH_H 30、落地线 CH_AY 27（50_char.js）。
   坐像连基座总高取 **52 ≈ 1.9 倍人身** —— 第一版画到 76（2.8 倍）是"巨型雕像"，
   放大图里比例完全不对；而且那版把腿画在基座**之后**，两条腿直接穿进黑石里。
   ⚠️ 这里**不许**在顶层读 CH_H —— 50 段在本段之前加载不假，但顶层读常量是
      58_dxdoor.js 栽过的坑，一律函数内读/本地写死。 */
const MAO_W = 48, MAO_H = 56, MAO_BY = 52;      // 落地线在精灵第 52 行，其下留 4 行余量
function makeMaoyisheng() {
  const P = LIB_PAL;
  const c = mkCanvas(MAO_W, MAO_H), g = c.getContext("2d");
  const cx = MAO_W / 2, BY = MAO_BY;
  /* 竖向分层（相对落地线 BY=52，自下而上）。⚠️ 第一版把椅背画到 BY-38 = 高出肩线
     8 行、又宽出躯干两侧 3px ⇒ 放大图里成了"戴兜帽的人"；书压在躯干最下面 ⇒
     成了白围兜。**椅背顶只许齐肩线**、**书必须落在膝上（胯与膝之间）**，两条都是硬口径。 */
  const bx = 4, bw = 40;
  /* ---- 黑石基座（先画：人体一律在它**之前**，绝不能反过来把腿压进石头里）---- */
  px(g, bx, BY - 8, bw, 8, P.STONE);
  px(g, bx, BY - 8, bw, 2, shade(P.STONE, 0.40));                   // 台面上棱受光
  px(g, bx, BY - 2, bw, 2, shade(P.STONE, -0.40));                  // 下棱背光
  px(g, bx - 2, BY - 9, bw + 4, 2, shade(P.STONE, 0.16));           // 台沿外挑
  for (let i = 0; i < 3; i++)                                        // 金字「茅以升」暗示
    px(g, cx - 8 + i * 6, BY - 7, 4, 2, P.GOLD);
  px(g, cx - 8, BY - 4, 16, 1, shade(P.GOLD, -0.26));                // 生卒年那一行
  /* ---- 扶手椅：椅背顶 = 肩线（BY-32），扶手只到胯两侧 ---- */
  px(g, cx - 10, BY - 34, 20, 26, shade(P.BRONZE, -0.30));           // 椅背
  px(g, cx - 10, BY - 34, 20, 1, shade(P.BRONZE, -0.16));            // 椅背顶受光
  px(g, cx - 13, BY - 24, 3, 13, shade(P.BRONZE, -0.40));            // 左扶手
  px(g, cx + 10, BY - 24, 3, 13, shade(P.BRONZE, -0.40));            // 右扶手
  /* ---- 人体：腿 → 胯 → 躯干 → 头，自下而上，后画的压前面的 ---- */
  px(g, cx - 8, BY - 13, 5, 5, shade(P.BRONZE, -0.24));              // 左小腿
  px(g, cx + 3, BY - 13, 5, 5, shade(P.BRONZE, -0.24));              // 右小腿
  px(g, cx - 9, BY - 20, 18, 7, shade(P.BRONZE, -0.14));             // 大腿（水平朝前探）
  px(g, cx - 9, BY - 20, 18, 1, shade(P.BRONZE, 0.06));              // 膝上受光
  px(g, cx - 7, BY - 19, 14, 7, "#ddd8c6");                          // 摊开的书（落在膝上）
  px(g, cx - 7, BY - 19, 14, 1, "#f4f0e2");
  px(g, cx - 1, BY - 19, 2, 7, shade("#ddd8c6", -0.34));             // 书脊
  px(g, cx - 7, BY - 32, 14, 13, P.BRONZE);                          // 躯干
  px(g, cx - 8, BY - 32, 16, 2, P.BRONZE_L);                         // 肩（比躯干宽 1px）
  px(g, cx - 7, BY - 32, 2, 13, P.BRONZE_L);                         // 左臂受光
  px(g, cx + 5, BY - 32, 2, 13, P.BRONZE_D);                         // 右臂背光
  px(g, cx - 2, BY - 35, 4, 4, shade(P.BRONZE, -0.10));              // 颈
  /* 头：8 宽放不下五官，就把"圆"和"眼线"两件事做到位 ——
     顶行两侧各收 1px 出圆颅，眼镜压在全高 1/3 处（第一版画在 2/3 处，读成了嘴）。 */
  px(g, cx - 4, BY - 43, 8, 8, P.BRONZE);                            // 头（颅底）
  px(g, cx - 3, BY - 44, 6, 1, P.BRONZE);                            // 圆颅顶
  px(g, cx - 3, BY - 44, 6, 2, shade(P.BRONZE_D, 0.06));             // 头发
  px(g, cx - 4, BY - 41, 1, 2, shade(P.BRONZE_D, 0.06));             // 鬓角
  px(g, cx + 3, BY - 41, 1, 2, shade(P.BRONZE_D, 0.06));
  px(g, cx - 4, BY - 41, 1, 6, P.BRONZE_L);                          // 左脸受光
  px(g, cx - 3, BY - 40, 6, 1, shade(P.BRONZE_D, -0.22));            // 眼镜
  px(g, cx - 3, BY - 40, 2, 1, P.BRONZE_L);
  px(g, cx + 1, BY - 40, 2, 1, P.BRONZE_L);
  px(g, cx - 3, BY - 37, 6, 1, shade(P.BRONZE_D, 0.04));             // 下颌投影
  contactBand(g, bx + 1, bx + bw - 1, BY - 1, 2, 0.34);
  return { canvas: c, ax: cx, ay: BY, w: MAO_W, h: BY };
}
