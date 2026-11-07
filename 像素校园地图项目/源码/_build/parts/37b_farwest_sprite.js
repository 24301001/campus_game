/* =========================================================================
   §6.2d 楼体资源：远端西侧（学生活动中心 + 22号宿舍楼 + 空地铺成活动中心地坪）
   -------------------------------------------------------------------------
   用户 2026-11-07：「12号楼下方替换为19号宿舍楼；根据图片作出22号宿舍楼的
   像素校园地图风格楼体；从上到下替换为学生活动中心、22号宿舍楼，两栋楼之间
   有一小条道路，空白地块处也全是学生活动中心占地，请灵活做出适应性修改」。

   这一片是 CAMPUS 最西边的两行（20_ground.js）：
     x 0.4535 / y 2.5132 / 0.9493 × 1.6799 in  学生服务中心
         → 楼体资源/buildings/04_xsh.js（图上写「学生活动服务中心」）
         ⚠️ 占地 371×656 px。第四轮把精灵加高到 520 行（占 79%），北边
            剩 176 行的内院，再由本段在楼**背后**铺一层地坪：
            两片草坪 + 中央下沉广场 + 中轴步道 + 树/长椅/路灯/名牌。
            画布底边压进楼精灵顶边 40 行，接缝藏在楼后面。
     x 0.6542 / y 4.3507 / 0.6972 × 0.7514 in  宿舍
         → 楼体资源/buildings/13_d22.js（22号宿舍楼）
         两行之间 1637.6..1699.1 那条 61px 的路**不动**：22号精灵的屋面板
         只给 28 行，画布顶边 1708.6，落在路南侧。

   ⚠️ 与 35/36 同一条纪律：**只换 b.canvas / b.ax / b.ay**，b.w、CAMPUS 坐标、
      addSolid 的碰撞盒、footprint 一个字节不动 ⇒ 全校园散射随机流不重掷
      （§6.6 那颗地雷，探针 _propdiff.py）。
   ⚠️ 地坪是**地面画**，绝不能进 BLD_IMGS（73_occl 会把它当楼淡成 0.34，
      人站进去整块广场变半透明 —— 积秀园那一轮的坑）。
   ⚠️ 地坪只走 addProp；baseY 排序让它天然压在楼精灵下面。它宽 432 > 110，
      所有「宽 > 110 当楼保留」的净空函数（§5.2.8 / §5.3.10 / §6.6c 等）
      都不会把它误删。
   ⚠️ 地坪画布宽 = 04-xsh 精灵画布宽 432，左右各 31px 留在占地外（透明），
      不把广场铺到邻居的草地上。
   ========================================================================= */

const FW_SAC_X = 0.4535;
const FW_SAC_Y = 2.5132;
const FW_DORM_X = 0.6542;
const FW_DORM_Y = 4.3507;
const FW_EPS = 1e-6;
/* 用户 2026-11-07 第四轮：04-xsh 加了 roofT=332，精灵顶边抬到 1117.9，
   北边只剩 176 行（原先 380 行）。地坪按这 176 行重画：两片草坪 + 中央
   下沉广场 + 中轴步道。TUCK 26 → 40：精灵最上面的体量从画布第 20 行起，
   地坪压 40 行进去，接缝才一定藏在楼后面。 */
const FW_TUCK = 40;      // 地坪底边压进楼精灵顶边的行数（那截藏在楼后面）
const FW_PADX = 31;      // 画布左右透明留白（与 04-xsh 精灵的留白同量级）

function fwItem(id) {
  const lib = window.PC_BUILDINGS || [];
  for (let i = 0; i < lib.length; i++) if (lib[i].id === id) return lib[i];
  return null;
}

function farwestSpriteApply(e, b) {
  if (e[1] !== "bld") return false;
  if (Math.abs(e[2] - FW_SAC_X) < FW_EPS && Math.abs(e[3] - FW_SAC_Y) < FW_EPS) {
    const item = fwItem("04-xsh");
    if (!item) {
      console.warn("37b_farwest_sprite: 楼体资源里没有 04-xsh（少了一个文件？）");
      return false;
    }
    const s = PC.make(item.spec);
    fwGroundsPush(e, s);                 // 先推地坪：stable sort 保证它画在楼下面
    b.canvas = s.canvas;
    b.ax = s.ax;
    b.ay = s.ay;
    return true;
  }
  if (Math.abs(e[2] - FW_DORM_X) < FW_EPS && Math.abs(e[3] - FW_DORM_Y) < FW_EPS) {
    const item = fwItem("13-d22");
    if (!item) {
      console.warn("37b_farwest_sprite: 楼体资源里没有 13-d22（少了一个文件？）");
      return false;
    }
    const s = PC.make(item.spec);
    b.canvas = s.canvas;
    b.ax = s.ax;
    b.ay = s.ay;
    return true;
  }
  return false;
}

/* --- 内院地坪：一块 432 × 176 的地面画 --------------------------------
   世界位置：顶边 = 占地北缘 981.7，底边 = 楼精灵顶边 1117.9 + 40 = 1157.9。
   楼精灵最上面的体量从画布第 20 行起 ⇒ 底下那 40 行被楼挡住，接缝不露。
   ⚠️ 本地唯一随机量是 makeRng(3741) 的草点 —— 绝不碰共享随机流。 */
function fwGroundsPush(e, s) {
  const R = zoneRect(e);
  const W = 432, fw = W - FW_PADX * 2;              // 370（占地 370.8）
  const top = Math.round(R.y);
  const bottom = Math.round(R.y + R.h - s.ay + FW_TUCK);
  const H = bottom - top;
  const c = mkCanvas(W, H), g = c.getContext("2d");
  fwGroundsDraw(g, W, H, fw);
  addProp({ canvas: c, ax: W / 2, ay: H, x: R.x + R.w / 2, y: bottom });
  /* ⚠️ baseY 单独压到**占地北缘**：排序只看 baseY，不改的话它是 1158（画布底边），
     站在内院（982..1158）的玩家、树、长椅都会被它盖掉 —— 第一版实测：
     玩家站到广场中间整个人消失。地面画必须排在所有站在它上面的东西之前。
     绘制位置用的是 x/y - ax/ay，与 baseY 无关，改这一个数不动画面位置。 */
  props[props.length - 1].baseY = top;
  /* 这块地原来散着树 / 灯 / 长椅，铺装是实心的，留着就是"长在广场石板上"。
     等整轮装配跑完再摘（微任务早于首帧 RAF），不影响任何先跑的净空函数与
     它们的计数。只摘根扎在占地里的小道具，楼（宽 > 110）一件不碰。 */
  Promise.resolve().then(() => fwClearPlot(R));
  return true;
}

function fwClearPlot(R) {
  const x1 = R.x + R.w, y1 = R.y + R.h;
  for (let i = props.length - 1; i >= 0; i--) {
    const p = props[i];
    if (p.img.width > 110) continue;                 // 楼 / 地坪 / 大构件
    if (p.x > R.x && p.x < x1 && p.y > R.y && p.y < y1) props.splice(i, 1);
  }
}

/* --- 地坪的几支小笔（只在本段用，全部自带 fw 前缀） ------------------- */
function fwBlob(g, cx, cy, rx, ry, col) {
  g.fillStyle = col;
  for (let dy = -ry; dy <= ry; dy++) {
    const t = 1 - (dy * dy) / (ry * ry);
    if (t < 0) continue;
    const dx = Math.round(rx * Math.sqrt(t));
    g.fillRect(Math.round(cx - dx), Math.round(cy + dy), dx * 2 + 1, 1);
  }
}

function fwTree(g, cx, cy, r) {
  /* 与 47_plants 的阔叶树同一套色：亮两档，压在草坪上才看得出是树不是灌木 */
  fwBlob(g, cx + 5, cy + 3, r + 1, Math.round(r * 0.6), "rgba(14,18,28,0.22)");
  px(g, cx - 1, cy - 2, 3, 6, "#5e4433");                       // 树干
  px(g, cx, cy - 2, 1, 6, "#7a5a3d");
  fwBlob(g, cx, cy - 5, r, Math.round(r * 0.62), "#2f6b3c");
  fwBlob(g, cx - 1, cy - 6, r - 3, Math.round((r - 3) * 0.62), "#3f8a4d");
  fwBlob(g, cx - Math.round(r * 0.36), cy - Math.round(r * 0.42),
         Math.round(r * 0.5), Math.round(r * 0.32), "#68ae6f");
  px(g, cx - Math.round(r * 0.2), cy - Math.round(r * 0.6), 3, 2, "#8cc48d");
}

function fwBench(g, cx, cy) {
  const w = 24, h = 7;
  px(g, cx - w / 2 + 2, cy + 2, w, h, "rgba(14,18,28,0.20)");
  px(g, cx - w / 2, cy, w, h, "#9c5442");
  px(g, cx - w / 2, cy, w, 2, "#b96a52");
  for (let x = cx - w / 2 + 3; x < cx + w / 2 - 1; x += 4) px(g, x, cy + 2, 1, h - 2, "#52241c");
  px(g, cx - w / 2, cy + h - 1, w, 1, "#52241c");
}

function fwLamp(g, cx, cy) {
  fwBlob(g, cx + 2, cy + 1, 6, 3, "rgba(14,18,28,0.18)");
  px(g, cx - 1, cy - 24, 3, 25, "#4a4f52");
  px(g, cx, cy - 24, 1, 25, "#6d7376");
  px(g, cx - 3, cy - 30, 7, 6, "#5a6063");
  px(g, cx - 2, cy - 29, 5, 4, "#f2e3b0");
  px(g, cx - 4, cy - 31, 9, 2, "#3d4245");
}

/* --- 下沉广场 ---------------------------------------------------------
   用户 2026-11-07 第四轮：「可以增加绘制一个下沉广场」。
   俯视画法：外圈与铺装齐平，往里三级台阶（每级 7px），池底比地面低三级；
   太阳在西北 ⇒ 每级上沿（北墙）压影、下沿（南沿）受光；南侧开一道四级
   台阶接中轴步道；池心一个圆形花池。 */
function fwSunken(g, cx, y0, y1, half) {
  const L = cx - half, R = cx + half, W = R - L, H = y1 - y0;
  /* 外圈石台（四角斜切，免得读成一张贴纸） */
  px(g, L + 6, y0, W - 12, H, "#c9c3b2");
  px(g, L, y0 + 6, 6, H - 12, "#c9c3b2");
  px(g, R - 6, y0 + 6, 6, H - 12, "#c9c3b2");
  px(g, L + 6, y0, W - 12, 2, "#ded8c8");
  px(g, L, y0 + 6, 2, H - 12, "#d8d2c2");
  px(g, R - 2, y0 + 6, 2, H - 12, "#a49e8e");
  px(g, L + 6, y1 - 2, W - 12, 2, "#a49e8e");
  /* 三级台阶 + 池底：逐级内收 7px、逐级压暗。
     光从西北来 ⇒ 每级北壁投 4 行深影、东壁再压 3px，南缘 2 行受光，
     三组明暗叠起来才读得出「往下走」而不是一张同心条纹贴纸。 */
  const steps = ["#c6c0af", "#b3ad9c", "#a19b8a", "#8f8979"];
  for (let i = 0; i < steps.length; i++) {
    const ins = 6 + i * 7;
    const x = L + ins, y = y0 + ins, ww = W - ins * 2, hh = H - ins * 2;
    px(g, x, y, ww, hh, steps[i]);
    px(g, x, y, ww, 4, "rgba(14,18,28,0.30)");
    px(g, x + ww - 3, y + 4, 3, hh - 6, "rgba(14,18,28,0.16)");
    px(g, x, y + hh - 2, ww, 2, "rgba(255,255,255,0.30)");
  }
  /* 池底方砖缝 */
  const fx = L + 27, fy = y0 + 27, fw2 = W - 54, fh2 = H - 54;
  for (let yy = fy + 13; yy < fy + fh2; yy += 14) px(g, fx, yy, fw2, 1, "rgba(90,84,72,0.15)");
  for (let xx = fx + 14; xx < fx + fw2; xx += 14) px(g, xx, fy, 1, fh2, "rgba(90,84,72,0.11)");
  /* 南侧台阶：从步道走进池底 */
  const sW = 24;
  px(g, cx - sW, y1 - 12, sW * 2, 24, "#c6c0b0");
  px(g, cx - sW, y1 - 12, 2, 24, "#a49e8e");
  px(g, cx + sW - 2, y1 - 12, 2, 24, "#a49e8e");
  for (let i = 0; i < 4; i++) {
    const yy = y1 - 12 + i * 6;
    px(g, cx - sW + 2, yy, sW * 2 - 4, 6, i % 2 ? "#cfc9b9" : "#c8c2b2");
    px(g, cx - sW + 2, yy, sW * 2 - 4, 1, "#ded8c8");
    px(g, cx - sW + 2, yy + 5, sW * 2 - 4, 1, "rgba(60,54,44,0.22)");
  }
  /* 池心花池：石圈 + 土 + 一棵小树 + 两丛灌木 */
  const cy = y0 + Math.round(H / 2);
  fwBlob(g, cx, cy, 24, 17, "#a8a292");
  fwBlob(g, cx, cy - 1, 20, 14, "#8f8a7c");
  fwBlob(g, cx, cy - 2, 18, 12, "#7a5a3d");
  fwTree(g, cx, cy - 6, 10);
  fwBlob(g, cx - 9, cy + 6, 5, 3, "#4f8f54");
  fwBlob(g, cx + 8, cy + 7, 4, 3, "#3f7a46");
  px(g, cx + 2, cy + 6, 3, 2, "#e8c04a");
  px(g, cx - 5, cy + 2, 2, 2, "#cf4a45");
}

/* --- 内院（占地北边剩的 176 行） -------------------------------------
   用户 2026-11-07 第四轮：「绿化填充的部分可以保留但是要结合实际建筑占比
   重新规划，可以增加绘制一个下沉广场」。楼占了南边 79%，这一块就只做
   北入口的院子：中轴步道 → 下沉广场 → 楼门厅，两侧各一片草坪。 */
function fwGroundsDraw(g, W, H, fw) {
  const x0 = FW_PADX, x1 = x0 + fw;
  const CX = W / 2;
  const rng = makeRng(3741);

  /* ① 铺装底：浅灰石板 + 板缝 */
  px(g, x0, 0, fw, H, "#b9b3a4");
  for (let y = 16; y < H; y += 22) px(g, x0, y, fw, 1, "rgba(92,86,72,0.11)");
  for (let x = x0 + 37; x < x1; x += 37) px(g, x, 0, 1, H, "rgba(92,86,72,0.11)");
  speckle(g, x0 + 2, 2, fw - 4, H - 4, "rgba(255,255,255,0.10)", 190, rng);
  speckle(g, x0 + 2, 2, fw - 4, H - 4, "rgba(70,64,52,0.10)", 150, rng);

  /* ② 中轴步道（宽 52）：北入口 → 广场南台阶 → 楼门厅 */
  const wX0 = Math.round(CX - 26), wX1 = Math.round(CX + 26);
  px(g, wX0, 0, wX1 - wX0, H, "#d2ccbb");
  px(g, wX0, 0, 2, H, "#bcb6a5");
  px(g, wX1 - 2, 0, 2, H, "#bcb6a5");
  px(g, wX0 + 2, 0, 1, H, "#e0dac9");
  for (let y = 12; y < H; y += 26) px(g, wX0 + 3, y, wX1 - wX0 - 6, 1, "rgba(120,112,96,0.16)");

  /* ③ 两片草坪（石缘 + 草点），夹着步道 */
  const lawns = [[x0 + 8, 34, 76, 110], [x1 - 84, 34, 76, 110]];
  for (let i = 0; i < lawns.length; i++) {
    const lx = lawns[i][0], ly = lawns[i][1], lw = lawns[i][2], lh = lawns[i][3];
    px(g, lx - 3, ly - 3, lw + 6, lh + 6, "#a8a292");
    px(g, lx - 3, ly - 3, lw + 6, 1, "#c9c4b6");
    px(g, lx, ly, lw, lh, "#6f9e57");
    px(g, lx, ly, lw, 3, "#5a8746");
    px(g, lx, ly + lh - 3, lw, 3, "#5a8746");
    speckle(g, lx + 2, ly + 4, lw - 4, lh - 8, "rgba(134,181,108,0.55)", (lw / 3) | 0, rng);
    speckle(g, lx + 2, ly + 4, lw - 4, lh - 8, "rgba(66,104,52,0.45)", (lw / 5) | 0, rng);
  }

  /* ④ 东西两道绿篱收边 */
  const hedge = function (hx, hy, hw, hh) {
    px(g, hx, hy, hw, hh, "#3f6b3f");
    px(g, hx, hy, hw, 2, "#4f7f4a");
    px(g, hx, hy + hh - 1, hw, 1, "#2f5232");
    for (let x = hx + 2; x < hx + hw; x += 4) px(g, x, hy + 2, 1, hh - 3, "rgba(30,60,34,0.28)");
  };
  hedge(x0 + 2, 34, 5, 110);
  hedge(x1 - 7, 34, 5, 110);

  /* ⑤ 下沉广场：176×122，压在步道中段 */
  fwSunken(g, CX, 30, 152, 88);

  /* ⑥ 草坪上的树 */
  fwTree(g, 63, 66, 14);
  fwTree(g, 98, 118, 12);
  fwTree(g, 369, 68, 14);
  fwTree(g, 341, 120, 12);

  /* ⑦ 广场北角的灯、台阶两侧的椅子 */
  fwLamp(g, 122, 60);
  fwLamp(g, 310, 60);
  fwBench(g, 166, 166);
  fwBench(g, 266, 166);

  /* ⑧ 「学生活动中心」木牌：立在院子西北角 */
  const sgn = makeSign("学生活动中心");
  if (sgn) {
    const sx = x0 + 4, sy = 0;
    px(g, sx + 26, sy + sgn.h, 4, 10, "#6d6557");
    px(g, sx + sgn.w - 30, sy + sgn.h, 4, 10, "#6d6557");
    px(g, sx + 3, sy + 3, sgn.w, sgn.h, "rgba(14,18,28,0.28)");
    g.drawImage(sgn.c, sx, sy);
  }
}
