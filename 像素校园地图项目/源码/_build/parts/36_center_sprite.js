/* =========================================================================
   §6.2c 楼体资源：中部一列四栋换精灵 + 积秀园画成公园
   -------------------------------------------------------------------------
   用户 2026-11-07（截图圈的是 x = 3.1125 那一列，从上到下）：
     「将计算机中心替换为信息中心，校史馆用新图替换，积秀园自行作图为公园
       区域样式，中心是喷泉和亭子，积秀园下方天佑会堂替换，最下面那栋宿舍楼
       也替换为2号宿舍楼」。

   这一列在 CAMPUS 里的五行（20_ground.js，按世界 y 从北到南）：
       y 2.5688  计算机中心     → 楼体资源/buildings/02_xinxi.js   （图上写「信息中心」）
       y 4.0139  校史馆         → 08_xiaoshi.js
       y 4.3507  积秀园         → **不换精灵**，本段自画公园（喷泉 + 亭子）
       y 4.7465  天佑会堂       → 03_tyht.js
       y 5.3708  宿舍（最南）   → 06_d2.js（2号宿舍楼）
   中间那栋 `思源西楼`（y 3.2076）不在用户点名之列，本段不碰。

   ⚠️ 与 35_west_sprite.js 同一条纪律：**只换 b.canvas / b.ax / b.ay**，
      b.w、CAMPUS 坐标、addSolid 的碰撞盒、footprint 一个字节不动 ⇒ 全校园
      散射随机流不重掷（§6.6 那颗地雷，探针 _propdiff.py）。
   ⚠️ **楼名仍是 CAMPUS 里的名字，不改数据**：71b_center.js 的机房入口按
      `CAMPUS.find(e => e[0] === "计算机中心")` 认楼，72_guide.js / 74_llm.js
      的词典也按名字找；改名会让"按 F 进机房"静默失效。信息中心四个字由
      02_xinxi 精灵自己用金字画在墙上，玩家看到的就是新名字。
   ⚠️ 必须排在整条 restyle 链（天佑会堂会先跑 70b 的 tyRestyle）之后、
      addProp 之前 —— addProp 取的就是 b.canvas / b.ax / b.ay。

   ============================ 积秀园公园 =================================
   占地 1.1792 × 0.2653 in ≈ 461 × 104 px（世界 y 1699.4..1803.0），又长又浅。
   画法**从地面俯视**（与明湖 / 草坪同一视角），不按楼立面画：
     草坪 + 石缘 → 十字步道 → 圆形广场 → 北侧六角亭 + 南侧喷泉
     → 树 / 花坛 / 长椅 / 「积秀园」木牌。
   画布 = 占地宽 461 + 左右各 26 留白（与 30 段/楼体资源同口径），
   高 = 104（占地进深）+ 26（亭顶越过北缘的那截，正好落在校史馆接地影子里）。
   b.ax = 画布中线、b.ay = 画布底边 ⇒ 草坪南缘仍压在世界落地线上。
   ⚠️ 本地唯一随机量是 makeRng(3617) 的草点/花点 —— 不许碰共享随机流。
   ========================================================================= */

const CENTER_SPRITE_X = 3.1125;
const CENTER_SPRITE_ROWS = [
  { y: 2.5688, id: "02-xinxi" },     // 计算机中心 → 信息中心
  { y: 4.0139, id: "08-xiaoshi" },   // 校史馆
  { y: 4.7465, id: "03-tyht" },      // 天佑会堂
  { y: 5.3708, id: "06-d2" }         // 最南那栋宿舍 → 2号宿舍楼
];
const CENTER_PARK_Y = 4.3507;
const CENTER_EPS = 1e-4;

function centerSpriteItem(id) {
  const lib = window.PC_BUILDINGS || [];
  for (let i = 0; i < lib.length; i++) if (lib[i].id === id) return lib[i];
  return null;
}

function centerSpriteApply(e, b) {
  if (e[1] !== "bld" || Math.abs(e[2] - CENTER_SPRITE_X) > 1e-6) return false;
  if (Math.abs(e[3] - CENTER_PARK_Y) < CENTER_EPS) {
    centerParkApply(e, b);
    return true;
  }
  for (let i = 0; i < CENTER_SPRITE_ROWS.length; i++) {
    const row = CENTER_SPRITE_ROWS[i];
    if (Math.abs(e[3] - row.y) > CENTER_EPS) continue;
    const item = centerSpriteItem(row.id);
    if (!item) {
      console.warn("36_center_sprite: 楼体资源里没有 " + row.id +
                   "（楼体资源/buildings 少了一个文件？）");
      return false;
    }
    const s = PC.make(item.spec);
    /* 2号宿舍楼这一行顺带把屋前那条 54 行的空档铺成排球场（见下方 §6.2d）。
       放在换精灵前调用：addProp 按 baseY 排序，先后顺序不影响画面。 */
    if (row.id === "06-d2") vcStripPush(e);
    b.canvas = s.canvas;
    b.ax = s.ax;
    b.ay = s.ay;
    return true;
  }
  return false;
}

/* ============================ §6.2d 排球场条带 ============================
   用户 2026-11-07 第三轮：「天佑会堂和2号宿舍楼之间有一排排球场。」
   这条带子就是天佑占地南缘（5.2319 in → 2043）到 2号占地北缘（5.3708 in →
   2098）之间那 55 行、461 宽的空档 —— 以前被 2号默认的 114 行屋瓦整个盖住，
   06_d2.js 把屋面压到 20 之后才露出来。
   五块场地**横放、一字排开**（18×9 m ⇒ 2:1）；画布顶 = 天佑落地线、底 = 2号
   占地北缘，b.ay = 画布高 ⇒ 条带上下缘各对齐一栋楼的落地线，接缝不露。
   ⚠️ 用户 2026-11-07 第四轮：「排球场和天佑会堂中间有一条小道，不是完全接壤」
      ⇒ 条带最北 14 行铺成浅灰混凝土小道（VC_PATH），球场整体从第 17 行起画，
      不再顶到天佑的落水线；小道两端各压一道深色路缘，避免和天佑的米色基座连成一片。
   ⚠️ 用户 2026-11-07 第五轮给了实景照片：「排球场是这个样子的」——
      蓝色塑胶场地 + 白色标线 + 四周绿色围网和草坪，球场与人行道之间有绿化带隔开。
      所以球场底色从墨绿改成蓝，南北两条绿化带里立绿色围网（立柱 + 网面），
      东西两端封口；北侧小道之外再没有裸露的"楼贴楼"接缝。
   ⚠️ baseY 取 2号占地北缘（addProp 的 y）：比天佑（2043）晚、比 2号（2258）
      早 ⇒ 压住天佑的接地影、被 2号立面和行人的脚盖住，层次与地面画一致。
   ⚠️ 本地随机量只有 makeRng(3623) 的地坪噪点 —— 不碰共享随机流（§6.6）。 */
const VC_TOP_IN = 4.7465 + 0.4854;     // 天佑会堂占地南缘（in）
const VC_N = 5;                        // 一排几块
const VC_GAP = 5;                      // 场地间距（px）
const VC_MG = 6;                       // 条带东西两端留白（px）
const VC_PATH = 14;                    // 北侧小道宽（px）：排球场不与天佑接壤
const VC_BELT = 3;                     // 球场四周绿化带 + 围网宽（px）
const VC_SWALK = 3;                    // 南侧小路宽（px）

function vcCourt(g, x, y, w, h) {
  /* ① 蓝色塑胶面层（实景照片里的场地）：北缘受光、南缘背光 */
  px(g, x, y, w, h, "#3a6ea6");
  px(g, x, y, w, 1, "#4a80ba");
  px(g, x, y + h - 1, w, 1, "#2c5788");
  /* ② 白线：边线 + 中线 + 两条进攻线（离中线 3 m = 全场 18 m 的 1/6） */
  const L = "#eef3ee";
  px(g, x, y, w, 1, L);
  px(g, x, y + h - 1, w, 1, L);
  px(g, x, y, 1, h, L);
  px(g, x + w - 1, y, 1, h, L);
  const cx = x + Math.round(w / 2);
  px(g, cx, y, 1, h, L);
  const a1 = x + Math.round(w / 2 - w / 6), a2 = x + Math.round(w / 2 + w / 6);
  px(g, a1, y + 1, 1, h - 2, "rgba(238,243,238,0.75)");
  px(g, a2, y + 1, 1, h - 2, "rgba(238,243,238,0.75)");
  /* ③ 网：两根柱子立在边线外，网面压在中线上（隔行点一下，俯视才像网眼） */
  px(g, cx - 1, y - 3, 3, 2, "#c6cbc3");
  px(g, cx - 1, y + h + 1, 3, 2, "#c6cbc3");
  for (let yy = y + 2; yy < y + h - 1; yy += 2) px(g, cx, yy, 1, 1, "rgba(228,238,228,0.62)");
  /* ④ 南侧落地影：两行，别压到下一块 */
  px(g, x + 2, y + h, w - 2, 2, "rgba(14,18,28,0.14)");
}

/* 绿色围网：两道横杆夹一条半透明网面，立柱按实景的间距立 */
function vcFence(g, x0, y, w) {
  px(g, x0, y - 1, w, 1, "#2b5f38");
  px(g, x0, y, w, 1, "rgba(214,232,214,0.34)");
  px(g, x0, y + 1, w, 1, "#275c34");
  for (let x = x0 + 3; x < x0 + w - 2; x += 24) px(g, x, y - 2, 2, 5, "#275c34");
}

function vcDraw(g, W, H) {
  /* ① 周边地坪：操场旁那种灰绿沥青，四周一圈跑动区 */
  px(g, 0, 0, W, H, "#a4ad9f");
  px(g, 0, H - 1, W, 1, "rgba(14,18,28,0.26)");
  /* ② 北侧小道：浅灰混凝土 + 板缝，两端路缘压暗 —— 和天佑的暖米色基座分开 */
  px(g, 0, 0, W, VC_PATH, "#c9cbc3");
  px(g, 0, 0, W, 2, "rgba(14,18,28,0.18)");           // 天佑落在小道上的影
  px(g, 0, 2, W, 1, "#e0e2da");
  for (let x = 0; x < W; x += 27) px(g, x, 3, 1, VC_PATH - 6, "rgba(92,96,88,0.22)");
  px(g, 0, Math.round(VC_PATH * 0.6), W, 1, "rgba(92,96,88,0.14)");
  px(g, 0, VC_PATH - 2, W, 2, "rgba(44,48,40,0.42)"); // 南缘路缘
  /* ③ 球场区：绿化带打底，南北立围网，东西两端封口 */
  const top = VC_PATH, bot = H - VC_SWALK;
  const ct = top + VC_BELT, cb = bot - VC_BELT;
  px(g, 0, top, W, bot - top, "#3f7a4b");
  const rng = makeRng(3623);                          // ⚠️ 局部随机流
  speckle(g, 0, top, W, bot - top, "rgba(0,0,0,0.10)", (W / 3) | 0, rng);
  speckle(g, 0, top, W, bot - top, "rgba(255,255,255,0.12)", (W / 3) | 0, rng);
  vcFence(g, 0, ct - 2, W);
  vcFence(g, 0, cb + 1, W);
  px(g, 4, ct - 2, 1, cb - ct + 5, "#2b5f38");
  px(g, W - 5, ct - 2, 1, cb - ct + 5, "#2b5f38");
  /* ④ 五块蓝场一字排开 */
  const cw = Math.floor((W - VC_MG * 2 - VC_GAP * (VC_N - 1)) / VC_N);
  const x0 = Math.round((W - (cw * VC_N + VC_GAP * (VC_N - 1))) / 2);
  for (let i = 0; i < VC_N; i++) vcCourt(g, x0 + i * (cw + VC_GAP), ct, cw, cb - ct);
  /* ⑤ 南侧小路：和 2号之间留一条走道，别让围网贴着宿舍楼 */
  px(g, 0, bot, W, H - bot, "#b9b6a9");
  px(g, 0, bot, W, 1, "rgba(44,48,40,0.36)");
  px(g, 0, bot + 1, W, 1, "#cdcabf");
}

function vcStripPush(e) {
  const R = zoneRect(e);
  const top = Math.round(VC_TOP_IN * U);
  const W = Math.round(R.w);
  const H = Math.round(R.y) - top;
  if (H < 20 || W < 120) return false;
  const c = mkCanvas(W, H), g = c.getContext("2d");
  vcDraw(g, W, H);
  addProp({ canvas: c, ax: W / 2, ay: H, x: R.x + R.w / 2, y: R.y });
  /* ⚠️ baseY 单独压到条带**北缘 + 1 行**。按 addProp 默认取 y = 2号占地北缘（2098）
     的话，站进球场的人（feet y 在 2043..2098 之间）全部排在它前面 ⇒ 整块地面画
     后画、把人盖没（37b 的地坪第一版实测过同一个坑）。北缘 +1 只为了让天佑
     （baseY 2043，画布还带 35 行接地影）先画；比它再北的人本来也踩不到这条带子。
     绘制位置仍是 x/y − ax/ay，与 baseY 无关，改这一个数不动画面。 */
  props[props.length - 1].baseY = top + 1;
  /* 条带里原本散着的树 / 灯 / 垃圾桶留着就是"长在球场上"：等整轮装配跑完
     再摘（微任务早于首帧 RAF，也不影响先跑的净空函数计数）。只摘小道具，
     楼（宽 > 110）与这块地坪自己一件不碰。 */
  Promise.resolve().then(() => vcClearStrip({ x: R.x, y: top, w: R.w, h: H }));
  return true;
}

function vcClearStrip(R) {
  const x1 = R.x + R.w, y1 = R.y + R.h;
  for (let i = props.length - 1; i >= 0; i--) {
    const p = props[i];
    if (p.img.width > 110) continue;
    if (p.x > R.x && p.x < x1 && p.y > R.y && p.y < y1) props.splice(i, 1);
  }
}

/* --- 公园绘制的几个小笔法（只在本段用） --------------------------------- */
function cpEllipse(g, cx, cy, rx, ry, col) {
  g.fillStyle = col;
  for (let dy = -ry; dy <= ry; dy++) {
    const t = 1 - (dy * dy) / (ry * ry);
    if (t < 0) continue;
    const dx = Math.round(rx * Math.sqrt(t));
    g.fillRect(Math.round(cx - dx), Math.round(cy + dy), dx * 2 + 1, 1);
  }
}
function cpRing(g, cx, cy, rx, ry, th, col) {
  g.fillStyle = col;
  const irx = rx - th, iry = ry - th;
  for (let dy = -ry; dy <= ry; dy++) {
    const t = 1 - (dy * dy) / (ry * ry);
    if (t < 0) continue;
    const dx = Math.round(rx * Math.sqrt(t));
    let ix = 0;
    if (iry > 0 && Math.abs(dy) <= iry) {
      const t2 = 1 - (dy * dy) / (iry * iry);
      ix = Math.round(irx * Math.sqrt(Math.max(0, t2)));
    }
    if (dx > ix) {
      g.fillRect(Math.round(cx - dx), Math.round(cy + dy), dx - ix, 1);
      g.fillRect(Math.round(cx + ix + 1), Math.round(cy + dy), dx - ix, 1);
    }
  }
}
function cpLine(g, x0, y0, x1, y1, col) {
  const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
  for (let i = 0; i <= n; i++) {
    const t = n ? i / n : 0;
    px(g, Math.round(x0 + (x1 - x0) * t), Math.round(y0 + (y1 - y0) * t), 1, 1, col);
  }
}

function cpTree(g, cx, cy, r) {
  cpEllipse(g, cx + 4, cy + 3, r, Math.round(r * 0.6), "rgba(14,18,28,0.20)");
  cpEllipse(g, cx, cy, r, Math.round(r * 0.6), "#2f5c39");
  cpEllipse(g, cx - 1, cy - 1, r - 3, Math.round((r - 3) * 0.6), "#3f7a4a");
  cpEllipse(g, cx - Math.round(r * 0.35), cy - Math.round(r * 0.28),
            Math.round(r * 0.5), Math.round(r * 0.3), "#5b9a63");
  px(g, cx - 1, cy, 1, 2, "#5e4433");
}

function cpBench(g, cx, cy) {
  const w = 24, h = 7;
  px(g, cx - w / 2 + 2, cy + 2, w, h, "rgba(14,18,28,0.20)");
  px(g, cx - w / 2, cy, w, h, "#9c5442");
  px(g, cx - w / 2, cy, w, 2, "#b96a52");
  for (let x = cx - w / 2 + 3; x < cx + w / 2 - 1; x += 4) px(g, x, cy + 2, 1, h - 2, "#52241c");
  px(g, cx - w / 2, cy + h - 1, w, 1, "#52241c");
}

function cpFountain(g, cx, cy) {
  /* 池壁 → 池沿 → 水面 → 水柱（从下往上画，水柱最后压在水面上） */
  cpEllipse(g, cx + 5, cy + 5, 36, 19, "rgba(14,18,28,0.18)");   // 落地影
  cpEllipse(g, cx, cy, 34, 18, "#a8a294");                      // 池壁（下半圈可见）
  cpEllipse(g, cx, cy - 4, 34, 17, "#d8d3c6");                  // 池沿
  cpEllipse(g, cx, cy - 4, 30, 14, "#efeadd");                  // 池沿受光
  cpEllipse(g, cx, cy - 5, 27, 13, "#2e6e9e");                  // 水面
  cpEllipse(g, cx, cy - 8, 27, 9, "#3c82b4");                   // 上段映天
  cpRing(g, cx, cy - 5, 19, 9, 1, "rgba(255,255,255,0.30)");    // 涟漪
  cpRing(g, cx, cy - 5, 11, 5, 1, "rgba(255,255,255,0.24)");
  cpEllipse(g, cx, cy - 6, 5, 3, "#e4dfd2");                    // 中央喷嘴基座
  /* 水柱：下粗上细，顶部散成水雾 */
  for (let i = 0; i < 20; i++) {
    const y = cy - 8 - i;
    const w = i < 4 ? 3 : (i < 13 ? 2 : 1);
    px(g, cx - Math.floor(w / 2), y, w, 1, i % 3 ? "#dff2ff" : "#bfe3f7");
  }
  cpEllipse(g, cx, cy - 28, 9, 3, "rgba(200,235,255,0.34)");    // 水雾
  const drops = [[-13, -15], [-8, -21], [-4, -25], [3, -26], [8, -21], [13, -15], [-11, -11], [11, -11]];
  for (let i = 0; i < drops.length; i++) {
    px(g, cx + drops[i][0], cy + drops[i][1], 2, 2, i % 2 ? "#eaf8ff" : "#c9e8f8");
    px(g, cx + drops[i][0], cy + drops[i][1] + 2, 1, 1, "rgba(180,220,240,0.55)");
  }
}

function cpPavilion(g, cx, cy) {
  const RX = 26, RY = 13, COL = 20;
  const baseY = cy - 3, eaveY = baseY - COL, apexY = eaveY - Math.round(RX * 0.95);
  cpEllipse(g, cx + 5, cy + 5, 30, 16, "rgba(14,18,28,0.20)");  // 台基影
  cpEllipse(g, cx, cy + 3, 29, 15, "#a8a294");                  // 台基侧壁
  cpEllipse(g, cx, cy, 29, 15, "#d8d3c6");                      // 台基顶面
  cpEllipse(g, cx, cy, 22, 11, "#c9c4b6");                      // 台面内圈
  /* 美人靠（柱间绿坐凳）：正面留出进人的口子 */
  for (let x = cx - 20; x <= cx + 20; x += 5) {
    if (Math.abs(x - cx) < 8) continue;
    px(g, x, baseY - 9, 3, 7, "#43584b");
    px(g, x, baseY - 9, 3, 1, "#5d7565");
  }
  /* 四根红柱（六角环在 2.5D 里看得见的就是这四根） */
  const cols = [cx - 17, cx - 6, cx + 6, cx + 17];
  for (let i = 0; i < cols.length; i++) {
    px(g, cols[i], eaveY, 3, COL, "#7a3a2c");
    px(g, cols[i], eaveY, 1, COL, "#9c5442");
    px(g, cols[i] + 2, eaveY, 1, COL, "#52241c");
    px(g, cols[i] - 1, baseY, 5, 2, "#a8a294");
  }
  /* 六角攒尖：六个坡面分别上色，再压戗脊 + 绿剪边 + 宝顶 */
  const P = [
    [cx, eaveY - RY],
    [cx + Math.round(RX * 0.866), eaveY - Math.round(RY / 2)],
    [cx + Math.round(RX * 0.866), eaveY + Math.round(RY / 2)],
    [cx, eaveY + RY],
    [cx - Math.round(RX * 0.866), eaveY + Math.round(RY / 2)],
    [cx - Math.round(RX * 0.866), eaveY - Math.round(RY / 2)]
  ];
  const A = [cx, apexY];
  const faces = [
    [5, 0, "#dd9a52"], [0, 1, "#dd9a52"],
    [4, 5, "#c07436"], [1, 2, "#c07436"],
    [3, 4, "#a35f2a"], [2, 3, "#a35f2a"]
  ];
  for (let i = 0; i < faces.length; i++) {
    poly(g, [A, P[faces[i][0]], P[faces[i][1]]], faces[i][2]);
  }
  for (let i = 0; i < 6; i++) cpLine(g, A[0], A[1], P[i][0], P[i][1], "#8e5222");
  for (let i = 0; i < 6; i++) {
    const n = (i + 1) % 6;
    cpLine(g, P[i][0], P[i][1], P[n][0], P[n][1], "#2e6b4a");
  }
  px(g, P[2][0] - 1, P[2][1] - 2, 3, 3, "#4a8a63");             // 东翼角起翘
  px(g, P[3][0] - 2, P[3][1] - 1, 4, 2, "#4a8a63");
  px(g, P[4][0] - 1, P[4][1] - 2, 3, 3, "#4a8a63");             // 西翼角起翘
  px(g, cx - 2, apexY - 4, 4, 4, "#2e6b4a");                    // 宝顶
  px(g, cx - 1, apexY - 4, 2, 1, "#4a8a63");
  px(g, cx - 2, apexY, 4, 1, "#d8b13e");                        // 宝顶下金圈
}

function cpParkDraw(g, W, H, depth, up) {
  const x0 = 26, x1 = W - 26, fw = x1 - x0;
  const y0 = up, y1 = H - 1;
  const CX = W / 2;
  const fCy = y1 - 34;                       // 喷泉中心
  const pCy = y0 + 30;                       // 亭子台基中心
  const rng = makeRng(3617);                 // ⚠️ 局部随机流

  /* ① 石缘 + 草坪 */
  px(g, x0, y0, fw, depth, "#8f8a7c");
  px(g, x0, y0, fw, depth - 2, "#c9c4b8");
  px(g, x0, y0, fw, 2, "#e2ddcd");
  px(g, x0 + 3, y0 + 3, fw - 6, depth - 6, "#6f9e57");
  px(g, x0 + 3, y0 + 3, fw - 6, 2, "#5a8746");
  px(g, x0 + 3, y0 + depth - 6, fw - 6, 3, "#5a8746");
  speckle(g, x0 + 4, y0 + 6, fw - 8, depth - 12, "rgba(134,181,108,0.55)", (fw / 3) | 0, rng);
  speckle(g, x0 + 4, y0 + 6, fw - 8, depth - 12, "rgba(66,104,52,0.45)", (fw / 5) | 0, rng);

  /* ② 十字步道（先铺道，再压广场） */
  const pathY = fCy - 7;
  const pw = Math.round(CX - 50);
  px(g, x0 + 3, pathY, pw - (x0 + 3), 14, "#cfc9b8");
  px(g, x0 + 3, pathY, pw - (x0 + 3), 1, "#e2ddcd");
  px(g, x0 + 3, pathY + 13, pw - (x0 + 3), 1, "#a9a390");
  px(g, Math.round(CX + 50), pathY, x1 - 3 - Math.round(CX + 50), 14, "#cfc9b8");
  px(g, Math.round(CX + 50), pathY, x1 - 3 - Math.round(CX + 50), 1, "#e2ddcd");
  px(g, Math.round(CX + 50), pathY + 13, x1 - 3 - Math.round(CX + 50), 1, "#a9a390");
  const vTop = fCy + 22;
  px(g, CX - 11, vTop, 22, y1 - vTop + 1, "#cfc9b8");
  px(g, CX - 11, vTop, 22, 1, "#e2ddcd");
  px(g, CX - 12, vTop, 1, y1 - vTop + 1, "#a9a390");
  px(g, CX + 12, vTop, 1, y1 - vTop + 1, "#a9a390");

  /* ③ 圆形广场 */
  cpEllipse(g, CX, fCy, 50, 27, "#a9a390");
  cpEllipse(g, CX, fCy - 1, 50, 27, "#c6c0af");
  cpEllipse(g, CX, fCy - 1, 46, 24, "#d5cfbe");
  cpRing(g, CX, fCy - 1, 40, 20, 1, "rgba(90,84,70,0.30)");

  /* ④ 树 / 花坛 / 长椅 */
  cpTree(g, x0 + 34, y0 + 30, 15);
  cpTree(g, x1 - 34, y0 + 30, 15);
  cpTree(g, x0 + 30, y1 - 18, 12);
  const beds = [[CX - 70, y1 - 8], [CX + 70, y1 - 8]];
  for (let i = 0; i < beds.length; i++) {
    const bx = beds[i][0], by = beds[i][1];
    cpEllipse(g, bx, by + 2, 20, 9, "rgba(14,18,28,0.16)");
    cpEllipse(g, bx, by, 20, 9, "#7a5a3d");
    cpEllipse(g, bx, by - 1, 18, 8, "#8a6a49");
    for (let k = 0; k < 14; k++) {
      const fx = bx - 15 + ((rng() * 31) | 0);
      const fy = by - 7 + ((rng() * 16) | 0);
      const c = k % 3 === 0 ? "#e8c04a" : (k % 3 === 1 ? "#cf4a45" : "#f2ede0");
      px(g, fx, fy, 2, 2, c);
    }
  }
  cpBench(g, CX - 84, fCy - 11);
  cpBench(g, CX + 84, fCy - 11);

  /* ⑤ 亭子 → 喷泉（南边的喷泉后画，水柱压住亭子台基下缘） */
  cpPavilion(g, CX, pCy);
  cpFountain(g, CX, fCy);

  /* ⑥ 「积秀园」木牌：立在东南角 */
  const sgn = makeSign("积秀园");
  if (sgn) {
    const sx = Math.round(x1 - 12 - sgn.w), sy = Math.round(y1 - 4 - sgn.h);
    px(g, sx + 20, sy + sgn.h, 5, 5, "#52241c");
    px(g, sx + 24, sy + sgn.h, 5, 5, "#52241c");
    px(g, sx + 3, sy + 3, sgn.w, sgn.h, "rgba(14,18,28,0.30)");
    g.drawImage(sgn.c, sx, sy);
  }

  /* ⑦ 南缘接地影：与楼体同一条笔（30 段 §3.8） */
  contactBand(g, x0 + 1, x1 - 1, y1 - 1, 2, 0.34);
}

function centerParkApply(e, b) {
  const depth = Math.round(IX(e[5]));      // 占地进深 104
  const up = 26;                            // 亭顶越过北缘的那截
  const W = b.canvas.width;                 // 461 + 26×2 = 513
  const H = depth + up;
  const c = mkCanvas(W, H), g = c.getContext("2d");
  cpParkDraw(g, W, H, depth, up);
  b.canvas = c;
  b.ax = W / 2;
  b.ay = H;
  /* 公园是能走进去的地面画，不能像楼那样"人在里面就整块淡成 0.34"（73_occl）。
     认楼那张表是 60 段在**本函数返回之后**才 `add(b.canvas)` 的，所以只能等
     本轮装配循环跑完再摘 —— 微任务早于首帧 RAF，来得及。 */
  Promise.resolve().then(() => BLD_IMGS.delete(c));
}
