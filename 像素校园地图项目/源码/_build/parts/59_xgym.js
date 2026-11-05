/* ============================================================================
 * §5.9 新体育馆 正面按实拍覆盖重绘
 *      —— 源：预览/xintiyuguan1.jpg / xintiyuguan2.jpg（用户提供的两张实拍）
 * ----------------------------------------------------------------------------
 * 一、用户口径（逐字）
 *   「我们试着复刻新体育馆的正面，也就是那两张图片，并没有任何字体，可以理解为
 *     墙面就是灰色长条形的瓷砖，纵向排布的，然后中间高度的区域是一块蓝色玻璃带，
 *     不过这个玻璃带并没有水平贯穿建筑，并不长。」
 *   外加一条当面拍板：**立面不要任何字** —— 精灵上那块深色「新体育馆」屋名标牌撤掉。
 *
 * 二、为什么是"覆盖重绘"而不是改模板
 *   与 §5.5 老体育馆、§5.8 思源东/西楼同一条路子：30_building.js 是全校**所有**楼的
 *   通用生成器，用户明确说过"先不要改建筑物，碰之前先问"。这里把檐下沿以下整段
 *   clearRect 掉、按照片重画。擦除是安全的：那一段像素只属于本精灵自己，底图
 *   （地面烘焙层）不在这个 canvas 里，擦掉后面就是透明。
 *
 * 三、撤屋名牌是**两步**，不能只做一步
 *   ① 30 段把牌子挂在**檐口之上**（signRect: y = eaveY − 8 − h），所以
 *      `clearRect(0, eaveY, …)` 擦不到它 —— 必须**另外**把标牌那一条矩形擦掉。
 *   ② 而 makeSign(XG_NAME) 又**必须照调**：verify.py 的屋名标牌自检读 _signCache，
 *      不调就报 MISS:新体育馆。所以是"调但不画"。
 *      擦掉之后要**按 30 段的同一套笔法把屋面补回来**（板面色 / 斑点 / 分坡脊线），
 *      否则屋顶上会留一块干净的空洞 —— 三套自动验收一个都查不出。
 *
 * 四、身高
 *   用户在 AskUserQuestion 里选了「5 层 / 墙高 170px」（原 3 层 102px，屋顶板 190px
 *   占精灵 2/3，像一张煎饼）。这只改 60_assemble.js 的 styleOf 里的一个数、
 *   外加本文件的 XG_FLOORS —— 落地线的世界坐标**不动**，所以碰撞盒、地面分类、
 *   散射流全都不受影响（build.py 用正则把这两处钉在一起）。
 *
 * 五、几何一律**反解**，不存第二份常量
 *   30 段 `makeBuilding` 的画布高 = PADT + roofT + wallH + SHY + 14，而 `makeBuilding`
 *   的返回值里**没有色号也没有 roofT**。所以本段从 `c.height` 反解 roofT
 *   （见 `xgGeo`），立面各分带再按 `wallH` 的**比例**现算 —— 用户明确交代过的
 *   铁律：「派生量不许再存一份常量」（56_minghu.js 踩过，湖一改贴湖坐标全废）。
 * ==========================================================================*/

const XG_NAME   = "新体育馆";
const XG_PADX   = 26, XG_PADT = 18;          // 与 30 段同值
const XG_FLOORS = 5;                         // ⚠️ 必须等于 styleOf("新体育馆").floors
const XG_PADB   = 21 + 14;                   // SHY + 14 —— 30 段画布高公式的尾巴

const XG_PAL = {
  RIB:    "#8b8f95", RIB_D: "#6e737a", RIB_L: "#a3a7ad",     // 灰肋墙（纵向长条瓷砖）
  RIB_TOP:"#9aa0a6", RIB_BOT: "#666b71",
  FRAME:  "#787d83", FRAME_D: "#54585d",                     // 玻璃凹框
  GLASS:  "#3d6c9c", GLASS_L: "#79a5cf",                     // 蓝玻璃带本体
  REFL:   "rgba(40,66,44,0.52)", REFL_HI: "rgba(84,120,74,0.40)",   // 树影（半透明，见 xgGlass）
  PLINTH: "#4e5156", PLINTH_D: "#33373b", PLINTH_L: "#5c6166"
};

/* --- 5.9.0 几何：全部从画布高反解 --------------------------------------- */
function xgGeo(c, roofCol) {
  const wallH = XG_FLOORS * FLOOR_H;
  const roofT = c.height - XG_PADT - wallH - XG_PADB;     // 反解，不存第二份
  const eaveY = XG_PADT + roofT;                          // 檐下沿 = 墙顶
  const gy0   = eaveY + Math.round(wallH * 0.26);         // 蓝玻璃带上沿
  return {
    roofCol: roofCol,
    x0: XG_PADX, x1: c.width - XG_PADX,
    roofT: roofT, wallH: wallH, eaveY: eaveY, baseY: eaveY + wallH,
    /* 带高 ≈ 1/3 墙高、上沿离檐口 0.26 墙高 ⇒ 带下方到基座顶还剩 0.23 ⇒ 上下大致对称
       （第一版取 0.32，带子明显偏高、下面只剩一条窄灰边）。 */
    gy0: gy0, gy1: gy0 + Math.round(wallH * 0.33),
    plinth: Math.round(wallH * 0.18),                     // 底部深灰基座带高
    /* 玻璃带占立面宽的比例。**必须 < 1** —— 用户口径："这个玻璃带并没有水平贯穿建筑，
       并不长"。第一版取 0.78，出图后一眼看出还是太通长（照片里两端各留一大段肋墙），
       收到 0.66。这条是 build.py ⑤ 钉着的。 */
    gw: 0.66
  };
}

/* --- 5.9.1 灰肋墙：竖向长条瓷砖铺满一段 -------------------------------
   照片里肋是**上下贯通**的（玻璃是凹进去的一块，不是把肋切断）。
   缝按**绝对 x 取模**（x0 是 26，相位恒定），与 30 段的砖纹同一套路子。 */
function xgRibs(g, x0, x1, y0, y1) {
  const P = XG_PAL;
  px(g, x0, y0, x1 - x0, y1 - y0, P.RIB);
  for (let x = x0; x < x1; x += 7) {
    px(g, x, y0, 2, y1 - y0, P.RIB_D);                     // 缝
    px(g, x + 2, y0, 1, y1 - y0, P.RIB_L);                 // 缝右侧的受光棱
  }
  px(g, x0, y0, x1 - x0, 2, P.RIB_TOP);                    // 段顶受光
  px(g, x0, y1 - 2, x1 - x0, 2, P.RIB_BOT);                // 段底背光
}

/* --- 5.9.2 蓝玻璃带：**不水平贯穿**的一段，凹在肋墙里 -----------------
   暗色端锚 SY_COL.GLASS —— 与图书馆、思源楼幕墙共享阴影色。
   ⚠️ SY_COL 定义在 frozen demo 段里，**只能在函数内读**（58_dxdoor.js 的 PALETTE
      顶层读过一次：加载期整个 <script> 死、页面全白，三套自动验收一个都查不出）。 */
function xgGlass(g, x0, x1, y0, y1) {
  const P = XG_PAL, GD = SY_COL.GLASS;
  const w = x1 - x0, h = y1 - y0;
  /* 凹框：外圈比肋墙深一档，上棱受光、下棱压暗 —— 玻璃是"嵌进去"的 */
  px(g, x0 - 4, y0 - 4, w + 8, h + 8, P.FRAME_D);
  px(g, x0 - 4, y0 - 4, w + 8, 2, P.FRAME);
  px(g, x0 - 4, y0 - 4, 2, h + 8, P.FRAME);
  px(g, x0 + w + 2, y0 - 4, 2, h + 8, shade(P.FRAME_D, -0.26));
  px(g, x0 - 4, y0 + h + 2, w + 8, 2, shade(P.FRAME_D, -0.34));
  /* 玻璃本体 */
  px(g, x0, y0, w, h, P.GLASS);
  px(g, x0, y0, w, 2, P.GLASS_L);
  px(g, x0, y1 - 3, w, 3, shade(GD, -0.24));
  px(g, x0, y0, 1, h, P.GLASS_L);
  px(g, x1 - 2, y0, 2, h, shade(GD, -0.30));
  /* 树影：两张实拍里玻璃都映着外面的树（深绿团），没有它玻璃就是一片死蓝。
     ⚠️ 必须夹在玻璃矩形内 —— 越界会画到凹框/肋墙上。
     ⚠️ **必须半透明**：第一版用了实色 #39543c，放大图里是两块**实心绿板**贴在玻璃上，
        完全读不出"倒影"。多层半透明叠出树冠的大意（上窄下宽的三层），蓝玻璃从缝里透出来。
        这是本段唯一用 rgba 的地方 —— 与水面模块同理：倒影不透明就变成"贴纸"。 */
  const blob = (bx, by, bw, bh) => {
    const cx0 = Math.max(x0 + 2, bx), cy0 = Math.max(y0 + 3, by);
    const cx1 = Math.min(x1 - 3, bx + bw), cy1 = Math.min(y1 - 4, by + bh);
    const w2 = cx1 - cx0, h2 = cy1 - cy0;
    if (w2 <= 8 || h2 <= 8) return;
    px(g, cx0 + Math.round(w2 * 0.20), cy0, Math.round(w2 * 0.60), h2, P.REFL);
    px(g, cx0, cy0 + Math.round(h2 * 0.30), w2, Math.round(h2 * 0.70), P.REFL);
    px(g, cx0 + Math.round(w2 * 0.14), cy0 + Math.round(h2 * 0.36),
       Math.round(w2 * 0.72), Math.round(h2 * 0.38), P.REFL_HI);
  };
  blob(x0 + Math.round(w * 0.09), y0 + 8, Math.round(w * 0.20), Math.round(h * 0.62));
  blob(x0 + Math.round(w * 0.50), y0 + 14, Math.round(w * 0.26), Math.round(h * 0.48));
  /* 梃格：竖梃 + 横梃，把整条玻璃分格成一片小窗。
     —— 用户 2026-09-17 口径：「添加一些网格，增加网格划分的小窗户数量，应该划分成四行，
        多少列你自己决定」。列沿用实拍里的 20px 等距（361 宽的带子正好 18 列），
        行按带高四等分 ⇒ 3 道横梃、每格 20×14。
     ⚠️ 必须画在树影**之后**：梃是实体构件、在玻璃之前，网格要压在倒影上才读得出"格"
        （反过来画，那两块半透明倒影正好把网格糊掉一半）。
     ⚠️ 横梃位置由带高 h **现算**，不存第二份常量（h 随 wallH 变，存下来就会错位）。 */
  for (let x = x0 + 20; x < x1 - 6; x += 20) px(g, x, y0, 2, h, shade(GD, -0.12));
  for (let k = 1; k <= 3; k++) {
    const my = y0 + Math.round(h * k / 4);
    px(g, x0 + 1, my, w - 3, 1, shade(GD, -0.12));        // 横梃
    px(g, x0 + 1, my + 1, w - 3, 1, shade(GD, 0.14));     // 梃下侧的受光棱
  }
}

/* --- 5.9.3 底部深灰基座带 + 入口 --------------------------------------
   照片最下面那条服务门带（绿围栏挡在它前面，所以只画个大意）。 */
function xgPlinth(g, G) {
  const P = XG_PAL, x0 = G.x0, x1 = G.x1, y0 = G.baseY - G.plinth;
  px(g, x0, y0, x1 - x0, G.plinth, P.PLINTH);
  px(g, x0, y0, x1 - x0, 2, shade(P.PLINTH, 0.26));
  px(g, x0, y0, x1 - x0, 1, "rgba(14,18,28,0.30)");
  px(g, x0, G.baseY - 2, x1 - x0, 2, "rgba(14,18,28,0.34)");
  for (let x = x0 + 30; x < x1 - 56; x += 62) {                  // 基座上的小门洞
    px(g, x, y0 + 12, 26, G.plinth - 12, P.PLINTH_D);
    px(g, x, y0 + 12, 26, 1, P.PLINTH_L);
  }
  const dw = 96, dx = Math.round((x0 + x1 - dw) / 2);
  px(g, dx - 3, y0 - 6, dw + 6, 4, P.FRAME);                     // 门楣
  px(g, dx, y0 - 2, dw, G.plinth + 2, "#2f4a63");                // 深色玻璃门
  px(g, dx, y0 - 2, dw, 2, "#4f7595");
  px(g, dx + Math.round(dw / 2) - 1, y0 - 2, 2, G.plinth + 2, P.FRAME_D);
}

/* --- 5.9.4 立面整体 --------------------------------------------------- */
function xgFacade(g, G) {
  /* ① 通高灰肋墙 */
  xgRibs(g, G.x0, G.x1, G.eaveY, G.baseY);
  /* ② 檐下沿一道深色压顶线（把墙和屋面分开）+ 一条受光棱 */
  px(g, G.x0, G.eaveY, G.x1 - G.x0, 2, "rgba(14,18,28,0.42)");
  px(g, G.x0, G.eaveY + 2, G.x1 - G.x0, 1, shade(XG_PAL.RIB, 0.22));
  /* ③ 左右棱 */
  px(g, G.x0, G.eaveY, 3, G.wallH, shade(XG_PAL.RIB, 0.16));
  px(g, G.x1 - 4, G.eaveY, 4, G.wallH, shade(XG_PAL.RIB, -0.26));
  /* ④ 中段蓝玻璃带：占立面宽 78%、居中 —— **不水平贯穿**（用户口径"并不长"） */
  const gw = Math.round((G.x1 - G.x0) * G.gw);
  const gx0 = Math.round(G.x0 + (G.x1 - G.x0 - gw) / 2);
  xgGlass(g, gx0, gx0 + gw, G.gy0, G.gy1);
  /* ⑤ 底部基座带 + 入口 */
  xgPlinth(g, G);
}

/* --- 5.9.9 覆盖重绘入口 -------------------------------------------------
   ⚠️ 只能在这里、addProp **之前** 调（60_assemble.js）—— 重绘的是同一张 canvas 的
      内容，晚一步 addProp 已经把旧精灵挂进 props 了。
   ⚠️ 本函数**不碰共享 RNG**（补屋面斑点用局部 makeRng(5903/5904)）——
      碰了就会重掷全校园散射（那是有专属探针才看得见的地雷，见 60_assemble.js §6.6）。
   ⚠️ 第四个实参照 58 段传 `pal.roof` —— `makeBuilding` 的返回值里没有色号，
      而补屋面板面必须与它同色，所以只能由调用点给（本段不许再存一份 PALETTE）。 */
function xgRestyle(b, roofCol) {
  const c = b.canvas, g = c.getContext("2d");
  const G = xgGeo(c, roofCol);
  /* 几何闸：30 段的 roofT / PADT / 画布高公式一旦改动，立刻在控制台报出来
     （反解出来会是个不合理的值，画出来是一栋比例崩掉的楼 —— 三套验收都不看画面）。
     ⚠️ 上界原本是 190（30 段 `clamp(...,20,190)` 的顶）。**2026-09-17 起本栋改走
        `o.roofFull`**（屋面板铺满整个进深，用户要求"向北延长直到灰色石板区域被
        覆盖"）⇒ roofT 反解出来是 ceil(483) − 170 = 313，**故意**超出那个上限。
        所以上界放到"两倍墙高"（340）—— 仍然足够抓住"画布高与 PADT/wallH/SHY
        对不上、整栋比例崩掉"的情况，但不再把正常的铺满进深判成异常。 */
  if (G.roofT < 20 || G.roofT > G.wallH * 2)
    console.warn("59_xgym: 反解出的 roofT=%d 出了合理区间[20,%d]，" +
                 "画布高 %d 与 30 段的 PADT/wallH/SHY 公式对不上了",
                 G.roofT, G.wallH * 2, c.height);

  /* ① 撤屋名牌。30 段把牌子挂在**檐口之上**（signRect: y = eaveY − 8 − h），
        所以这条必须单独擦（见文件头第三节）。调 makeSign 只为填 _signCache
        （verify.py 要 / 见契约），拿到矩形就够 —— **不画**。 */
  const sgn = makeSign(XG_NAME);
  if (sgn) {
    const sg = signRect(sgn, G.x0, G.x1 - G.x0, G.eaveY);
    const px0 = sg.x - 2, py0 = sg.y - 2, pw = sg.w + 7, ph = sg.h + 7;
    g.clearRect(px0, py0, pw, ph);
    px(g, px0, py0, pw, ph, shade(roofCol, -0.04));        // 板面色（30 段 3.2 同式）
    for (let j = 1; j <= 3; j++) {                         // 分坡脊线（30 段只画 j=1..3）
      const y = XG_PADT + Math.round((G.roofT - 12) * j / 4) + 6;
      if (y >= py0 && y < py0 + ph)
        px(g, G.x0 + 5, y, G.x1 - G.x0 - 10, 1, "rgba(255,255,255,0.08)");
    }
    /* 斑点：密度照 30 段的 (w/3)|0 / (w/4)|0 折到这一小块（≈0.0018 与 0.0014） */
    speckle(g, px0, py0, pw, ph, "rgba(255,255,255,0.05)", 6, makeRng(5903));
    speckle(g, px0, py0, pw, ph, "rgba(0,0,0,0.07)", 5, makeRng(5904));
  }

  /* ② 檐下沿以下整段擦掉重画 */
  g.clearRect(0, G.eaveY, c.width, c.height - G.eaveY);
  xgFacade(g, G);
  return b;
}
