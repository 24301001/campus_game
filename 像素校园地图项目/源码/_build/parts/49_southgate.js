/* =========================================================
   4.9 南门拱门 —— 按 建筑物照片/南门.jpg 还原的红色高拱
   ---------------------------------------------------------
   南门（GATES G2）原先是与其余四个门共用的"两根门柱 + 一块横匾"模板，
   跟照片里那座**高拱红门**完全不是一个东西，所以这一座单独画：
   半圆红拱带（竖棱）＋ 内缘亮银包边 ＋ 拱顶蓝色校徽 ＋ 沿弧排的四个金字。
   `46_walls.js` 的 `buildGates()` 里 G2 直接 `continue` 掉 ——
   其余四个门、四十几栋楼、思源楼逐像素不变。

   几何全部由「外宽」推出来。外宽就是墙缺口（GATES G2 的 w = 195）——
   动它等于动墙，所以是硬不变量；照片只用来看**比例**：

     外宽 621px（照片，柱脚处左右外缘）         → 195 世界px，比例 0.314
     拱带厚 60px（同一行量，两缘都是竖线⇒真厚） → 19  ⇒ 带厚/净宽 = 0.123
     净开口 489px                              → 157
     外半径为半圆：照片拱顶 669、外圆心 976、R=306.5 ⇒ 拱顶 = 圆心 − R
                    ⇒ 我们这边同样取 RO = 97 的半圆
     校徽 124px 直径                            → 38，心在拱顶下 81px ⇒ y=26
     柱长 950px（起拱线 976 → 柱脚 1926）        → 302（★见下）
     总高 1257px                                → 400

   ⚠️ 柱高是**唯一**做了取舍的量：照实取 302（总高 400）会高出 1× 视野
   （480×270）一倍多，也比全校任何一栋楼都高。这里取 SG_PH = 190
   （总高 287，≈ 1.5×外宽），既有"很高"的量感，又和楼群同量级。
   想更接近实拍只改 SG_PH 一个常量（302 就是实拍值）。

   拱腹暗面（SG_SOF）：照片里红拱带内侧还有一道很宽的深色内弧（仰视看到
   的拱腹内表面），宽度与红带同量级。它不只是好看 —— **它是四个金字的落脚
   处**：字高 28 > 拱带厚 19，而字还要随切线旋转，端部的「交」「学」沿径向
   的跨度有 ±17px，必然有一截溢出到红带内侧。没有这层暗面，那几粒金点就
   飘在门洞外的空气里（第一版就是这样，3× 下一眼可见）。

   深度：画布中央是**真透明**的（中空 billboard），玩家在门洞里能透过拱
   看到人；baseY 取墙线 y ⇒ 走到门外（y 更大）自然压在拱前面，在门内则被
   拱挡在后面 —— 正是 3/4 视角该有的遮挡关系。

   字形与校徽不是手画的：是 `建筑物照片/字体.png` 里那笔校名毛笔字与校徽
   描出来的点阵（生成块见下）；拱红 / 金字 / 徽蓝取 `南门.jpg` 的中位色。
   ========================================================= */

/*__SG_GEN_BEGIN__*/
/* ==== 由 _build/_glyphs.py 生成，勿手改（源：建筑物照片/字体.png + 南门.jpg）==== */
const SG_EMN = 38;
const SG_GOLD = "#c4b57e", SG_EMBLUE = "#273a72", SG_RED = "#5c302d";
const SG_MASK_BEI = "AeAAAeAAAeAAA8MAB48ADx4AHDwAOHgAYPwAwfwBg/gDB+AED4AIfhAQPD8gcD9A4B7BgD2GAHcB4Z4D4Hw/wdgPBwAY3ABh8ACD4AADgAAA";
const SG_MASK_JING = "AwAB+AB/AA+AB8ADwAOMAx8APwB+B/gD8eAD8AfgH/Af8A/8B/4D3wHugOzwP3gfnh/PH+P+8D54DhwA";
const SG_MASK_JIAO = "AeAAB4AAHCAA/8AH/gD/4AZAAAAAAAwACPAA/cAP3gH8AA8AAFiAAOYAA3gAD8AAPAADwAAeAAHcABxgAcPAHB8DwPwwA/wAD/A=";
const SG_MASK_TONG = "AAGAAcAH4AfgD+APYA+4D5wAGAAHgA/ABkAOYB8wD9gH6AP0A/IA2wNtiYfHQmH4AB+AA+AAf8APwAOA";
const SG_MASK_DA = "AAAwAAA4AAA4AAA4AABwAADwAADwAADgAEHeAHP+AD/4AB/gAA8AAA8AAB4AAB4AAD4AAH8AAPOAAeHAA8DwB4D/DwB/PAA4cAAAAAAAAAAAAAAA";
const SG_MASK_XUE = "ADAADgADgADjEH/GPHDfGDNMDdoB94B7wA+gBtvBH/Ae+Jz4LEAuOA58AwP4AP4B7gPsAGMAAMAAMAMMAH8A";
const SG_MASK_EM = "AAf/gAAAfh+AAAeYN4AAeCDHgAPAwwcAHIHoBgDjP/DcAwvA9jgYHADgYPjB+ODD9j/hzxlx/8N2Z4f/B5mOD/wYPDA/uDDwx//Aw8M///sPCP//5Dwh/+GQ8IH/hkPDB/wZD2wT8G29sE/BtPdDf4K7fYn+Dum6b/wz5uz/8N2N2AAG7B+wADOwbnADvYDQ/P3sA4B/z3AHPAA7gAZ/+FwADn/xwAAeDp4AAB//4AAAD/wAAA==";
/* 四个金字：[点阵, φ(度), 宽, 高] —— 宽高逐字不同是**故意的**（见文件头 3），
   压成方字会把毛笔字横向压扁到认不出。φ 以拱心为原点、y 朝上，拱顶 90°。 */
const SG_CHARS = [
  [SG_MASK_JIAO, 137.0, 21, 28],
  [SG_MASK_TONG, 117.0, 17, 28],
  [SG_MASK_DA, 63.0, 24, 28],
  [SG_MASK_XUE, 43.0, 18, 28]
];
/* 南门校名石（§5.4）的六字一行：[点阵, 宽, 高]，**不旋转**。
   与上面四个金字同源同高（28px），所以「交 通 大 学」四点阵与拱上是同一串字节。 */
const SG_ROW6 = [
  [SG_MASK_BEI, 23, 28],
  [SG_MASK_JING, 17, 28],
  [SG_MASK_JIAO, 21, 28],
  [SG_MASK_TONG, 17, 28],
  [SG_MASK_DA, 24, 28],
  [SG_MASK_XUE, 18, 28]
];
/* ==== 生成块结束 ==== */
/*__SG_GEN_END__*/

/* --- 4.9.1 几何常量 --- */
const SG_W = 195;                     // 画布宽 = 墙缺口宽（奇数 ⇒ 左右严格对称）
const SG_CX = 97;                     // 中列
const SG_T = 19;                      // 拱带厚（照片 60/489 = 0.123 ⇒ 19，见头注）
const SG_RO = 97;                     // 外半径（半圆，= 外宽/2）
const SG_RI = SG_RO - SG_T;           // 红拱带内缘 78
const SG_SOF = 17;                    // 拱腹暗面厚（见头注）；红带内缘再往里 17 ⇒ 洞内缘 61
const SG_SOF_Y0 = 70;                 // 暗面从这一行往下才开始收窄，到起拱线收成 0
const SG_LW = SG_T + 2;               // 立柱可见宽 = 拱带 + 门洞侧那 2px 拱腹暗面
const SG_PH = 190;                    // 立柱高（起拱线 → 地面）。★想更高改这里
const SG_H = SG_RO + SG_PH;           // 总高 287
const SG_EM_R = SG_EMN >> 1;          // 校徽半径 19（照片：直径 ≈ 2×拱带厚）
const SG_EM_CY = 26;                  // 校徽心高（照片实测：拱顶下 81px ⇒ 26）
/* 金字字心到拱心的半径。字高 28、宽 21，随切线旋转后**沿径向**的半跨度是
   (28·cosT + 21·sinT)/2 —— 拱顶 T=0 ⇒ 14，端部 T=47° ⇒ 17.2。
   取 79 ⇒ 径向落 [61.8, 96.2]：外缘不碰外轮廓（97，不会被 clip 削平一条直边），
   内缘落在拱腹暗面里（暗面到 r=61）。*/
const SG_CH_R = 79;

/* 拱带横截面用色（由内缘往外：亮银包边 / 灰压条 / 暗缝 / 红底竖棱） */
const SG_SILVER = "#cfcac0", SG_TRIM = "#8e8880", SG_SEAM = "#33201d";
const SG_SOFFIT = "#4a2a27";          // 门洞那侧的拱腹暗面
const SG_SHADOW = "rgba(14,18,28,0.34)";

/* 四个金字（[点阵, φ, 宽, 高]）由生成块给出：φ = 与 x 轴的夹角（度，y 朝上），
   拱顶是 90°；照片实测 132.4 / 108.1 / 71.9 / 47.6 —— 左右对称，顺序 交 通 大 学。 */

/* --- 4.9.2 点阵解码 / 旋转落笔 --- */
function sgBits(b64, cnt) {
  const raw = atob(b64), out = new Uint8Array(cnt);
  for (let i = 0; i < cnt; i++) out[i] = (raw.charCodeAt(i >> 3) >> (7 - (i & 7))) & 1;
  return out;
}
/* ⚠️ 必须**反算**（由目标像素反查源像素）：顺算在 42° 这种角度下会在字上留下
   一格一格的空洞。边缘就近取整 ⇒ 硬边像素，与全图风格一致。
   clip=true 时把笔画裁进**拱的外轮廓**（r ≤ RO−1）：金字随切线旋转后，最外缘
   够到 r≈96.2，稍有偏差就会冒到拱外面的天空/草地上。 */
function sgGlyph(g, m, nw, nh, cx, cy, rot, col, clip, shadow) {
  const a = rot * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a);
  const R = Math.ceil(Math.hypot(nw, nh) / 2) + 1, RC = SG_RO - 1;
  const hx = (nw - 1) / 2, hy = (nh - 1) / 2;
  const at = function (wx, wy) {                       // 这个屏幕像素在不在点阵里
    const dx = wx - cx, dy = wy - cy;
    const mx = Math.round(dx * ca + dy * sa + hx), my = Math.round(-dx * sa + dy * ca + hy);
    return (mx >= 0 && my >= 0 && mx < nw && my < nh && m[my * nw + mx]) ? 1 : 0;
  };
  for (let dy = -R; dy <= R; dy++) {
    for (let dx = -R; dx <= R; dx++) {
      const wx = cx + dx, wy = cy + dy;
      if (clip) {
        const ex = wx - SG_CX, ey = wy - SG_RO;
        if (ex * ex + ey * ey > RC * RC) continue;
      }
      if (shadow) { if (!(at(wx, wy - 1) && !at(wx, wy))) continue; }
      else if (!at(wx, wy)) continue;
      px(g, wx, wy, 1, 1, col);
    }
  }
}
/* 金字：只在**下缘**补一列暗金（真正的 1px 投影：上一格有墨、这一格没有），
   再压中色 —— 出金属凸起感。
   ⚠️ 不能图省事"把整块字往上/下各印一遍"：那等于把笔画整体胀粗 1px，26px 的
   字里笔画间那道缝会被填死，四个字立刻糊成一团。所以投影只落在外轮廓下缘。
   不用"描一圈黑边"是因为字有一半悬在门洞的空里，黑边会飘在没有东西的地方。 */
function sgGold(g, m, nw, nh, cx, cy, rot) {
  sgGlyph(g, m, nw, nh, cx, cy, rot, shade(SG_GOLD, -0.42), true, true);
  sgGlyph(g, m, nw, nh, cx, cy, rot, SG_GOLD, true, false);
}

/* --- 4.9.3 拱带 --- */
/* 光照：光源在左上。横向线性为主 + 拱顶略亮（接到天光）—— 照片里左半边
   明显比右半边亮，这是全图唯一能体现"这是一圈曲面"的手段。 */
function sgLit(x, y) {
  return (SG_CX - x) / SG_RO * 0.30 + (1 - y / SG_H) * 0.06;
}
/* 红底竖棱：照片上是一层极密的竖向条纹（原片间隔 ≈1.7px，缩到世界像素已不足
   1px），只能用 1px 交替列当"质感"。幅度必须小，大了 1× 下整条拱带会花成噪点。 */
function sgRib(x, y) {
  return shade(SG_RED, sgLit(x, y) + ((x & 1) ? 0.075 : -0.065));
}
/* 画一行里的一段拱带。xIn = 红拱带内缘列（null = 这一段没有内缘，即拱顶实心段）：
   dIn 0/1/2 = 亮银包边/灰压条/暗缝，dIn < 0 = 内缘再往里那层拱腹暗面。
   暗面按深度递暗（−1 最亮、−6 之后到底）—— 照片里它是从红带内缘往洞里
   渐渐沉下去的一段，平涂一层会像贴了张黑纸。 */
function sgRow(g, y, xL, xR, xIn, left) {
  if (xR < xL) return;
  for (let x = xL; x <= xR; x++) {
    const dIn = xIn === null ? 99 : (left ? xIn - x : x - xIn);
    const dOut = left ? x - xL : xR - x;
    let col;
    if (dIn < 0) col = shade(SG_SOFFIT, -0.10 - Math.min(6, -dIn) * 0.055);
    else if (dIn === 0) col = SG_SILVER;
    else if (dIn === 1) col = SG_TRIM;
    else if (dIn === 2) col = SG_SEAM;
    else if (dOut === 0) col = shade(SG_RED, sgLit(x, y) - 0.34);
    else if (dOut === 1) col = shade(SG_RED, sgLit(x, y) + 0.14);
    else col = sgRib(x, y);
    px(g, x, y, 1, 1, col);
  }
}

/* 拱腹暗面在这一行的厚度。拱顶侧是满的，到起拱线（y = RO）收成 0 ——
   不收的话两根立柱内侧会各拖出一条 17px 宽的灰条直到地面，像门背后贴了
   两张黑纸。用 t² 收，收得比线性更快，最后 20 来行几乎是立刻没了。 */
function sgSoffitAt(y) {
  if (y >= SG_RO) return 0;
  const t = (SG_RO - y) / (SG_RO - SG_SOF_Y0);
  return t >= 1 ? SG_SOF : Math.round(SG_SOF * t * t);
}

/* --- 4.9.4 整座门 --- */
function makeSouthArch() {
  const c = mkCanvas(SG_W, SG_H + 3), g = c.getContext("2d");
  for (let y = 0; y < SG_H; y++) {
    let ow, iw;
    if (y < SG_RO) {
      const dy = SG_RO - y;
      ow = Math.round(Math.sqrt(SG_RO * SG_RO - dy * dy));
      iw = dy < SG_RI ? Math.round(Math.sqrt(SG_RI * SG_RI - dy * dy)) : 0;
    } else { ow = SG_RO; iw = SG_RI; }               // 起拱线以下：直柱
    if (iw <= 2) { sgRow(g, y, SG_CX - ow, SG_CX + ow, null, false); continue; }
    const xInL = SG_CX - iw - 1, xInR = SG_CX + iw + 1;
    /* 暗面内缘：夹一下，拱顶附近洞本来就只有几像素宽，不加夹会让左右两段
       越过中线互相盖住 */
    const sof = sgSoffitAt(y);
    const eL = Math.min(xInL + sof, SG_CX), eR = Math.max(xInR - sof, SG_CX);
    sgRow(g, y, SG_CX - ow, eL, xInL, true);
    sgRow(g, y, eR, SG_CX + ow, xInR, false);
  }
  /* 起拱线的施工缝（照片里能看见一道横缝） */
  px(g, SG_CX - SG_RO, SG_RO, SG_LW, 1, "rgba(0,0,0,0.22)");
  px(g, SG_CX + SG_RI - 1, SG_RO, SG_LW, 1, "rgba(0,0,0,0.22)");

  /* 徽下的拱腹石：照片里校徽正下方垂着一块灰石（拱腹的可见面），**往下收窄**、
     到末端收成一个尖。宽 17→9、垂 20px。画成方盒子会很愣，收尖才像石头。 */
  const sy0 = SG_EM_CY + SG_EM_R - 2, sh = 20;
  for (let i = 0; i < sh; i++) {
    const hw = Math.round(8 - 4 * i / (sh - 1));          // 半宽 8 → 4
    px(g, SG_CX - hw, sy0 + i, hw * 2 + 1, 1,
       shade("#57514a", -0.30 + (i / sh) * 0.30));
    px(g, SG_CX - hw, sy0 + i, 1, 1, "#4a443e");          // 左缘
    px(g, SG_CX + hw, sy0 + i, 1, 1, "#3c3733");          // 右缘
  }
  px(g, SG_CX - 8, sy0, 17, 1, "#6a635a");                // 顶面接徽

  /* 拱顶校徽：深色托边 + 蓝底 + 金色点阵（点阵取自用户给的校徽图） */
  circlePx(g, SG_CX, SG_EM_CY, SG_EM_R + 1, "#2b1a17");
  circlePx(g, SG_CX, SG_EM_CY, SG_EM_R, SG_EMBLUE);
  /* 徽的金色点阵：不裁（徽心在 r=71、R=19，本来就整块在拱内）、不投影
     （底是深蓝，反差已经够；再压暗金边会糊掉徽里那些细线） */
  sgGlyph(g, sgBits(SG_MASK_EM, SG_EMN * SG_EMN), SG_EMN, SG_EMN,
          SG_CX, SG_EM_CY, 0, SG_GOLD, false, false);

  /* 四个金字（沿弧、随切线倾斜） */
  for (const cs of SG_CHARS) {
    const a = cs[1] * Math.PI / 180, nw = cs[2], nh = cs[3];
    sgGold(g, sgBits(cs[0], nw * nh), nw, nh,
           Math.round(SG_CX + SG_CH_R * Math.cos(a)),
           Math.round(SG_RO - SG_CH_R * Math.sin(a)), 90 - cs[1]);
  }

  /* 柱础 + 接地影：只落在两根立柱下 —— 门洞里也画一道就会像地面多了道坎 */
  px(g, SG_CX - SG_RO, SG_H - 3, SG_LW, 3, shade(SG_RED, -0.38));
  px(g, SG_CX + SG_RI - 1, SG_H - 3, SG_LW, 3, shade(SG_RED, -0.38));
  px(g, SG_CX - SG_RO, SG_H, SG_LW, 3, SG_SHADOW);
  px(g, SG_CX + SG_RI - 1, SG_H, SG_LW, 3, SG_SHADOW);
  px(g, SG_CX - SG_RI, SG_H, SG_RI * 2 + 1, 2, "rgba(14,18,28,0.16)");
  return { canvas: c, ax: SG_CX, ay: SG_H, w: SG_W, h: SG_H };
}

/* tag:"gate" 是为了让 60_assemble 的 clearPropTreeClash 跳过它 ——
   那段会按"树盖住小道具接地线"删道具，而这门宽 195 > 90 本来会走楼的分支，
   带上 tag 直接免检，省得将来改判据时误伤。 */
function buildSouthArch() {
  const G = GATES.find(o => o.id === "G2");
  const s = makeSouthArch();
  props.push({ img: s.canvas, ax: s.ax, ay: s.ay, x: G.x, y: G.y, baseY: G.y, tag: "gate" });
}
