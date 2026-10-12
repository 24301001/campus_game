/* =========================================================
   5.1 思源楼顶部改写：按照片重画（题字搬进楼上的白带 + 方锥攒尖顶）
   ---------------------------------------------------------
   ⚠️ demo 的 §3.5 思源楼段是**逐字节冻结**的（build.py 末尾有 assert），
      一个字都不能改。所以这里走"覆盖重绘"：拿到 makeSiyuan() 返回的 canvas，
      把 native y<100 那一整块先擦掉，再按照片重画。
      唯一调用点是 60_assemble.js §6.3 里那行 siyuanRestyle(s.canvas, 1.5)
      —— 它插在 makeSiyuan 之后、addProp 之前，挪位置就会前功尽弃。

   擦掉是安全的：这一块在精灵图里不是天空（透明）就是楼顶那几件自己画的东西，
   clearRect 之后是干净的透明，草地/天空由地面层提供，不会擦出黑洞。
   擦除范围 y<100（= 窗顶 WIN_TOP），下面的墙、窗、瓷砖缝、幕墙主体一律不动。

   ---- 原版哪里不对（对照 建筑物照片/siyuanlou2.jpg 逐项量出来的）----
   ① 题字飘在天上：原版把六个字画在 native y 52..76，而楼体顶边 ROOF_Y=84
      —— 字其实在屋面以上 32px 的**天空**里，只有中央那根白塔柱从字缝穿过。
      照片里字是画在**楼体顶部那条白色题字带**上的，是楼的一部分。
   ② 题字带太薄：照片里这条带占楼高约 16%，原版只有 9%（84..100，16px），
      而且蓝玻璃幕墙从 native 94 就起头，比窗顶高 6px 戳进带里，
      干净的白带只剩 10px。照片里幕墙顶与窗顶齐平 → 屋面抬到 ROOF_Y=72。
   ③ 中央塔不是塔：原版是一根**直上直下的白筒**（宽 26，占楼宽 8.7%）顶个平盖，
      照片里是**方锥攒尖顶**（底宽 70 = 楼宽 23%，比高还宽），顶上一个圆灯笼，
      灯笼上再挑几根细天线针。两侧角亭照片里也有小攒尖顶，原版是平顶方块。

   ---- 照片实测（整楼宽 1255px ↔ 我们 300 native，约 4.2px/native）----
       题字带       y 680..810     → 带高约 28 native（占楼高 16%）
       题字         320×60 px      → 70.7×14 native（占整楼宽 25.5%）
       中央攒尖顶   295×100 px     → 70×23 native，檐口比锥体再外挑 2
       灯笼         75×85 px       → 12×9 native（+ 深色圈 + 小穹顶）
       天线针       105 px         → 照片 24 native，这里压到 15（见下）
       两侧角亭     墩宽 145px、高出屋面 90px → 墩 34×18 native，攒尖顶再 10
       锥面小窗     120×75px      → 20×8 native（照片里锥面下缘正中那扇）
   唯一没照搬的是**天线针**：照片里灯笼+针共 44 native，屋面抬到 72 之后到画布
   上缘只剩 58；攒尖顶是主角、保持原比例，针是几根 1px 线、压短观感不变。

   ---- 第十五轮（2026-09-17）：主楼加高 5 层 ----
   用户：「思源主楼的高度提高 5 层，加五层窗户」。加高**只能**在精灵上做：
   画布加高 SY_GROW 行 → 旧内容的下半段整体下移 → 新区画 5 层 → 把 s.ay 一起挪。
   落地线世界 y 1431.6 一动不动，楼只往屏幕上方长高，碰撞盒与深度排序都不用碰。
   ⚠️ 层高必须用思源楼**自己的** 17 native（×1.5 = 25.5 行），不能用全校
      FLOOR_H = 34：同一面墙上两套层高，加出来的窗排与下面十层会错槽（每层差 8.5 行）。
   ⚠️ SY_GROW 必须是整数：drawImage 的下移量落半像素会把整条边缘糊掉。
   ========================================================= */

/* 点阵解码（与本 part 的生成块配套，刻意不借 49_southgate.js 的 sgBits：
   那份数据是南门专用，两边各自独立，谁改动都不会牵连对方）。
   位序 MSB-first，与 _build/_syfont.py 的 b64() 严格对应。 */
function syBits(b64, cnt) {
  const raw = atob(b64), out = new Uint8Array(cnt);
  for (let i = 0; i < cnt; i++) out[i] = (raw.charCodeAt(i >> 3) >> (7 - (i & 7))) & 1;
  return out;
}

/*__SY_GEN_BEGIN__*/
/* ==== 由 _build/_syfont.py 生成，勿手改（源：建筑物照片/字体.png）==== */
/* 思源楼题字「北京交通大学」六字毛笔点阵：六字共用一把比例尺（k = SY_CH / 照片六字并集高），
   逐字保留照片里的 bbox 尺寸与相对位置 dx/dy —— 字距与高低错落是书写本身的一部分。 */
const SY_TW = 106;                       // 整块宽（世界像素）
const SY_MASK_BEI = "A8A8A4BwDgHAOAcAwBgDAEAIgR+h9A7B2GcJ4HwYtwfA8A4A";
const SY_MASK_JING = "MAEAwAeDgA8OABw8AMj8AvPwDw+B8D4HefADz4B+DAH8MAfxgB/kAD2HgfcfH834cwGAhAQAADAAAA==";
const SY_MASK_JIAO = "BwAHAA/gH8B8AAAAEALwD3B8AMAAzADYAPABwAOADYAzwMfHB8AH4A==";
const SY_MASK_TONG = "AAwA8AeAfgOwPuDnAA4A+ANgOZnkd9HfQ/kNrDXzx8fAA8AD/AfwBwA=";
const SY_MASK_DA = "AAIAAcAAcAAYAA4AAwAR/Af+APwAHAAHAAOAAeAA/gB5gDw4Hg/OAcYAAAAAAAAA";
const SY_MASK_XUE = "ADAADgADgADjAHfCLHDfGDNMBdoB5wB7wA8gBtvBH+A/8BjwAAAA+ABsgAP4AfgD4AHMAAMAAMAIMAPMAB8AA8AA";
/* [点阵, 宽, 高, dx, dy] —— dx 相对整块左缘，dy 相对整块顶 */
const SY_CHARS = [
  [SY_MASK_BEI, 11, 26, 0, 2],
  [SY_MASK_JING, 22, 21, 13, 4],
  [SY_MASK_JIAO, 15, 21, 38, 2],
  [SY_MASK_TONG, 14, 23, 56, 3],
  [SY_MASK_DA, 18, 21, 69, 3],
  [SY_MASK_XUE, 18, 29, 88, 0]
];
/* ==== 生成块结束 ==== */
/*__SY_GEN_END__*/

/* 第十五轮：加高 5 层。SY_GROW 由 5 × 25.5 = 127.5 取整而来（必须整数，见文件头）；
   SY_ADD_F 是层数，只用来算层界与"画几排窗"，改层数必须同步重算 SY_GROW。 */
const SY_GROW = 128;
const SY_ADD_F = 5;

/* --- 5.1.1 覆盖重绘（由 60_assemble.js §6.3 调用一次） ---
   ⚠️ 第十五轮起签名是 **(s, S)**、不再是 (c, S)：这一版要**换一整块更高的画布**，
      并把新画布与新的 ay 写回精灵对象 —— addProp 取的就是 s.canvas / s.ay
      （60_assemble.js §6.3 那行 `addProp(Object.assign({}, s, { x: ax, y: ay }))`），
      只传 canvas 的话加高的那张图在函数返回时就被丢掉，ay 也不会跟着动。 --- */
function siyuanRestyle(s, S) {
  const C = SY_COL;
  /* 几何常量与 §3.5 逐字同源，否则重画的东西会与楼体错位。
     只有 ROOF_Y 是**故意改的**：84 → 72（题字带 9% → 15%）。 */
  const BL = 60, BR = 360, ROOF_Y = 72, WIN_TOP = 100;
  const TX = (BL + BR) / 2;                                 // 建筑水平中心 = 210
  const GC = 209;                                           // 瓷砖缝对称轴（同 §3.5）
  const GLASS_L = 196, GW = 26;                             // 玻璃幕墙
  const SX0 = 56, SY0 = 14;
  const X = x => (x - SX0) * S, Y = y => (y - SY0) * S;
  const cut = Math.round(Y(WIN_TOP));                       // 129：题字带底 = 老墙顶

  const src = s.canvas;
  const c = mkCanvas(src.width, src.height + SY_GROW);
  const g = c.getContext("2d");
  g.imageSmoothingEnabled = false;
  const P = (x, y, w, h, col) => px(g, X(x), Y(y), w * S, h * S, col);
  /* Q 与 P 只差一处：y 直接是**画布行**、不再过 Y() —— 新区是"插进去的行"，
     没有对应的 native y。x / w / h 仍走 native，与下面十层同源。 */
  const Q = (x, y, w, h, col) => px(g, X(x), y, w * S, h * S, col);

  /* --- 5.1.1b 只搬下半段：上半段（题字带以上）下面会整块重画，搬了也是白搬 ---
     旧 rows ≥ 129（墙 / 10 层窗 / 幕墙 / 入口 / 接地）整体下移 SY_GROW 行。
     新区画布是全新的透明图，drawImage 等大整数矩形搬运是逐像素 1:1、不糊边 ——
     已实测（改前/改后两张 4× 原精灵：下半段逐字节相同、上半段零差异）。 --- */
  g.drawImage(src, 0, cut, src.width, src.height - cut,
                    0, cut + SY_GROW, src.width, src.height - cut);

  /* --- 5.1.2 题字带（照片里就是楼体最顶上这一层）---
     白墙 + 压顶 + 竖向瓷砖缝。缝从 ROOF_Y+6 起，与 §3.5 下半段（90..232）接得上。 --- */
  P(BL, ROOF_Y, BR - BL, WIN_TOP - ROOF_Y, C.WALL);
  P(BL, ROOF_Y, BR - BL, 3, shade(C.WALL, -0.12));          // 压顶阴影线
  P(BL, ROOF_Y + 3, BR - BL, 1, C.WALL_L);                  // 压顶受光
  for (let d = 15; d < (BR - BL) / 2; d += 30) {
    P(GC - d, ROOF_Y + 6, 1, WIN_TOP - ROOF_Y - 6, shade(C.WALL, -0.08));
    P(GC + d, ROOF_Y + 6, 1, WIN_TOP - ROOF_Y - 6, shade(C.WALL, -0.08));
  }
  /* 幕墙顶部收口：原版幕墙从 WIN_TOP-6 起头，比窗顶高 6px 戳进题字带；
     照片里幕墙顶与窗顶齐平。擦除后幕墙自然停在 WIN_TOP，这里补一道顶框。 */
  P(GLASS_L, WIN_TOP, GW, 1, C.GLASS_D);

  /* --- 5.1.3 两侧角亭：墩子 + 竖玻璃槽 + 小攒尖顶 + 尖顶针 ---
     照片里这两座比屋面高约 19% 楼高（≈31 native）、宽占整楼 12.7%（≈34），
     塔身是一条**窄竖玻璃槽**，顶上扣一个比墩略宽的方锥。
     光从左上（与中央攒尖顶一致），两座都取"左缘受光"，不做镜像。 --- */
  function pavilion(x0) {
    const pw = 34, cx = x0 + pw / 2;
    P(x0, 54, pw, 18, C.WALL);                              // 墩身（54..72，压在新屋面上）
    P(x0, 54, pw, 1, "#fff");                               // 压顶
    P(x0, 54, 1, 18, C.WALL_L);                             // 左缘受光
    P(x0 + pw - 1, 54, 1, 18, C.WALL_D);                    // 右缘背光
    /* ⚠️ 玻璃槽是**竖**的。画成横窗带就成了"停车库百叶" —— 那是上一版观感走样的主因。 */
    P(cx - 4, 57, 8, 13, C.WIN_D);                          // 竖玻璃槽
    P(cx - 4, 57, 8, 1, C.WIN_L);                           //   上沿反光
    P(cx - 4, 57, 1, 13, "#2d4a5e");                        //   左槽壁受光
    P(cx + 3, 57, 1, 13, "#0e1a24");                        //   右槽壁背光
    P(cx - 4, 63, 8, 1, "#16242e");                         //   中横档
    P(cx - 17, 53, 34, 1, shade(C.WALL, -0.20));            // 外挑檐口
    for (let i = 0; i < 10; i++) {                          // 小攒尖顶：32px 收到 4px
      const hw = Math.max(2, Math.round(16 - 14 * i / 9));
      P(cx - hw, 52 - i, hw * 2, 1, shade(C.TOWER, 0.12 - i * 0.03));
      P(cx - hw, 52 - i, 1, 1, "#fff");                     //   左坡受光
      P(cx + hw - 1, 52 - i, 1, 1, shade(C.TOWER, -0.16));  //   右坡背光
    }
    P(cx, 40, 1, 3, "#8a8f95");                             // 尖顶针
  }
  pavilion(BL);                                             // 左：60..94
  pavilion(BR - 34);                                        // 右：326..360

  /* --- 5.1.4 中央方锥攒尖顶（底宽 66 + 外挑檐 70）---
     照片量出来底 295px : 高 100px ≈ 2.95:1，是个**扁**的攒尖顶，不是尖塔。
     原版那根直筒宽 26（占楼宽 8.7%），这个 70（23%）—— 差 2.7 倍。
     顶面收成 12 宽的小平顶，给灯笼当基座。 --- */
  P(TX - 35, 70, 70, 2, shade(C.WALL, -0.18));              // 檐口（70 宽，外挑 2）
  P(TX - 35, 70, 70, 1, shade(C.WALL, 0.10));               //   檐上受光
  /* ⚠️ 收分必须**一路收到底**（33 → 9），不能写成 `33*(18-i)/18` 那种——
     那种写法在 i=15 就归到下限，顶上会留出一段"平脖子"，看着像土台不像攒尖顶。
     直线收分才是攒尖顶的样子。 */
  for (let i = 0; i < 21; i++) {
    const hw = Math.round(33 - 24 * i / 20);                // 底 66 宽 → 顶 18 宽
    const y = 69 - i;
    P(TX - hw, y, hw * 2, 1, shade(C.TOWER, 0.10 - i * 0.006));
    P(TX - hw, y, 1, 1, "#fff");                            // 左坡受光
    P(TX + hw - 1, y, 1, 1, shade(C.TOWER, -0.16));         // 右坡背光
    if (hw > 8) {                                           // 两条戗脊
      P(TX - Math.round(hw / 3), y, 1, 1, shade(C.TOWER, 0.05));
      P(TX + Math.round(hw / 3), y, 1, 1, shade(C.TOWER, -0.08));
    }
  }

  /* --- 5.1.4b 锥面正中那扇小窗（照片里锥面下缘正中，带小披檐）---
     底宽 20 native（照片 120px / 1255 = 9.6% → 29 native，这里按 2/3 取，免得锥面被糊满）。
     锥面在 y=62 处半宽还有 25、y=61 处 23，20 宽（±10）加披檐（±12）都装得下。 --- */
  P(TX - 11, 62, 22, 8, "#33424e");                         // 凹龛
  P(TX - 9, 63, 18, 6, "#7c9cb4");                          //   窗面
  P(TX - 9, 63, 18, 1, "#a8c6d8");                          //   上沿反光
  P(TX - 1, 63, 1, 6, "#42586a");                           //   中竖棂
  P(TX - 12, 61, 24, 1, shade(C.TOWER, -0.24));             //   小披檐

  /* --- 5.1.5 灯笼 + 天线针（坐在攒尖顶的小平顶上）---
     照片：圆灯笼（白铁皮 + 一段玻璃）→ 深色圈 → 小穹顶 → 几根细针。
     针被压短了（照片 24 native → 这里 15），理由见文件头。 --- */
  P(TX - 10, 48, 20, 1, shade(C.TOWER, -0.22));             // 灯笼底盘
  P(TX - 8, 39, 16, 10, "#efece6");                         // 灯笼身
  P(TX - 8, 39, 1, 10, "#fff");                             //   左缘受光
  P(TX + 7, 39, 1, 10, shade("#efece6", -0.14));            //   右缘背光
  P(TX - 6, 42, 12, 3, "#8fb2ca");                          //   玻璃段
  P(TX - 6, 42, 12, 1, "#c2dcea");                          //     上沿高光
  P(TX - 9, 38, 18, 1, "#5a6068");                          // 深色圈
  P(TX - 6, 36, 12, 2, "#e6e3dc");                          // 小穹顶
  P(TX - 4, 35, 8, 1, "#e6e3dc");
  const MAST = [[0, 15], [-5, 9], [5, 9], [-9, 5], [9, 5]]; // [横向偏移, 高]
  for (const m of MAST) P(TX + m[0], 35 - m[1], 1, m[1], "#464c53");
  P(TX - 2, 26, 5, 1, "#4a5058");                           // 主针上一道横担

  /* --- 5.1.6 红色毛笔题字「北京交通大学」---
     字形来自 建筑物照片/字体.png（_build/_syfont.py 描成 1bit 点阵，六字共用一把
     比例尺、逐字带 dx/dy，字距与高低错落按原迹）。颜色仍是原题字那支红。
     ⚠️ 位置从"屋面上方 32px 的天空"搬进了题字带里 —— 这是本轮的主因。 --- */
  const ox = Math.round(X(TX) - SY_TW / 2);                 // 以楼体中轴居中
  const oy = Math.round(Y(76));                             // 带内：上留 4、下留 5（native）
  g.fillStyle = C.RED;
  for (const ch of SY_CHARS) {
    const m = syBits(ch[0], ch[1] * ch[2]), nw = ch[1];
    for (let i = 0; i < m.length; i++)
      if (m[i]) g.fillRect(ox + ch[3] + (i % nw), oy + ch[4] + ((i / nw) | 0), 1, 1);
  }

  /* --- 5.1.7 新增的五层（第十五轮：思源主楼加高 SY_ADD_F 层）---
     层高用思源楼自己的 17 native（×1.5 = 25.5 行，同 §3.5.8 的 wH 11 + gY 6），
     5 × 25.5 = 127.5 ⇒ SY_GROW = 128。层界**锚在下接缝**（row 257 = 老墙顶）往上推，
     与下半段严丝合缝；每层往上多摊 0.1 行、五层共 0.5 行，肉眼不可见。
     画法与次序照 §3.5.2 → §3.5.7 → §3.5.8 → §3.5.10，少一步就是"墙上缺根缝"。 --- */
  {
    const R0 = cut + SY_GROW;                               // 257：新老接缝
    const GH = SY_GROW / S;                                 // 新区高（native 单位，×S 恰好回到 128 行）
    const fy = k => Math.round(R0 - k * SY_GROW / SY_ADD_F); // 层界，k = 0..SY_ADD_F（k=0 是下接缝）
    const W1 = 14, H1 = 11, GX = 12;                        // 窗宽 / 窗高 / 列距（native，同 §3.5.8）
    const WSTEP = W1 + GX, WCOLS = 4;
    const RSTART = GLASS_L + GW + 10;                       // 232 = GLASS_R + 10，右半第一列的左缘
    /* §3.5.8 drawWin 的逐笔复刻（只把纵向坐标换成画布行）*/
    const drawWinQ = (x, y) => {
      Q(x, y, W1, H1, C.WIN_D);
      Q(x + 1, y + 1, Math.floor(W1 / 2), 2, C.WIN_L);
      Q(x + 1, y + 1, 2, Math.floor(H1 / 2), shade(C.WIN_L, -0.1));
      Q(x + Math.floor(W1 / 2), y, 1, H1, "#0e141c");
    };
    Q(BL, cut, BR - BL, GH, C.WALL);                        // 墙
    for (let d = 15; d < (BR - BL) / 2; d += 30) {          // 竖缝：与下半段同一条 GC±30 相位
      Q(GC - d, cut, 1, GH, shade(C.WALL, -0.08));
      Q(GC + d, cut, 1, GH, shade(C.WALL, -0.08));
    }
    for (let k = 1; k <= SY_ADD_F; k++)                     // 每层顶一道横缝（同 §3.5.2 的 17 native 节拍）
      Q(BL, fy(k), BR - BL, 1, shade(C.WALL, -0.10));
    Q(GLASS_L, cut, GW, GH, C.GLASS);                       // 幕墙续接
    for (let i = 0; i < GW; i++)                            //   斜向反光（相位照 §3.5.7 的 i % 3）
      Q(GLASS_L + i, cut + i % 3, 1, GH,
        i < GW / 2 ? C.GLASS_HI : shade(C.GLASS_HI, -0.1));
    Q(GLASS_L, cut, GW, 1, C.GLASS_D);                      //   新区顶框（紧贴题字带下沿）
    Q(GLASS_L + GW / 2, cut, 1, GH, C.GLASS_D);             //   中竖梃（同为 §3.5.7 那一笔）
    const MS = Math.round(14 * S);                          // 21：横分格节拍（14 native）
    for (let y = Math.round(Y(WIN_TOP - 6)) + SY_GROW; y >= cut; y -= MS)
      Q(GLASS_L, y, GW, 1, C.GLASS_D);                      //   往上续，与下半段同一条节拍
    for (let k = 1; k <= SY_ADD_F; k++) {                   // 五排窗：右半起头，左半取镜像
      const wy = fy(k);
      for (let cc = 0; cc < WCOLS; cc++) {
        const wx = RSTART + cc * WSTEP;
        if (wx + W1 > BR - 10) continue;
        drawWinQ(wx, wy);
      }
      for (let cc = 0; cc < WCOLS; cc++) {
        const wx = 2 * GC - (RSTART + cc * WSTEP + W1);     // 右列左缘的镜像（同 §3.5.8）
        if (wx < BL + 10) continue;
        drawWinQ(wx, wy);
      }
    }
    Q(BL, cut, 1, GH, C.WALL_D);                            // 左右边缘（§3.5.10 那一笔，画在最后）
    Q(BR - 1, cut, 1, GH, C.WALL_D);
    Q(BL + 1, cut, 1, GH, shade(C.WALL, -0.06));
    Q(BR - 2, cut, 1, GH, shade(C.WALL, -0.06));
  }

  /* --- 5.1.8 收尾：加高后的画布与落地行必须写回精灵对象 ---
     ⚠️ addProp 只认 s.canvas / s.ay；ax / w / h 一概不参与绘制，
        落地线世界 y = 1431.6 因此一动不动，楼只往屏幕上方长高。 --- */
  s.canvas = c;
  s.ay += SY_GROW;
}
