/* =========================================================
   2.8 地面 / 路面细节（第 3 项）
   ---------------------------------------------------------
   地面管线（§2.7）原本已经有：草地噪声、沥青、人行道砖缝、广场石板、
   路缘石、标线、泥土过渡带。这一节只补**原本没有的四样**：

     · brickTone + paintRoadCell(cls=1)  逐砖色差（原来只有整体噪声，
       1× 下人行道是一片平色，读不出"砖"）
     · paintManholes                      井盖
     · paintWear                          斑马线磨损 + 车辙压痕
     · paintLeafFall                      树下落花 / 落叶

   ⚠️ 前三个走 buildGround 流水线（在 §2.7.6 标线之后、泥土带之前）。
   ⚠️ paintLeafFall **不在流水线里** —— 要等 props 排好才知道树在哪，
      由 60_assemble §6.6d 在 buildMips() **之前**调用（mip 是从地面画布降采样
      出来的，晚于 mip 就再也进不去 mip 了）。
   ⚠️ 一律不碰 solids / props 的坐标，只往地面画布上加像素。
   ========================================================= */

/* --- 2.8.0 "这里真的是沥青吗" -----------------------------------------
   ⚠️ 别用 CELLK 判：`classifyFree` 把 ARTERY 矩形**整块**标成 K.ROAD，
   连压着广场的那一段也标了；而广场是第 3 步画的、比路面亮得多。
   直接读**已烘焙好的画布**取样最可靠：沥青 = 暗且近中性灰
   （ramp #4b4b53…#606068；广场石板 #b3ada0 的 R≈168 会被挡住）。
   取 5×5 均值，避开 speckle 的 1px 白点。 */
function asphaltAt(g, x, y) {
  const px0 = Math.min(Math.max(0, (x | 0) - 2), WORLD_W - 5);
  const py0 = Math.min(Math.max(0, (y | 0) - 2), WORLD_H - 5);
  const d = g.getImageData(px0, py0, 5, 5).data;
  let r = 0, gg = 0, b = 0, n = 0;
  for (let k = 0; k < d.length; k += 4) { r += d[k]; gg += d[k + 1]; b += d[k + 2]; n++; }
  r /= n; gg /= n; b /= n;
  const mx = Math.max(r, gg, b), mn = Math.min(r, gg, b);
  return mx <= 130 && mx - mn <= 30;
}
/* 沿一条横/纵带按 12px 分段，只画"落在真沥青上"的那几段。
   跨广场时带子自然断开 —— 这正是铺装广场该有的样子。 */
function bandOnAsphalt(g, x, y, w, h, col) {
  if (w >= h) { for (let t = 0; t < w; t += 12) { const sw = Math.min(12, w - t); if (asphaltAt(g, x + t + 6, y + (h >> 1))) px(g, x + t, y, sw, h, col); } }
  else        { for (let t = 0; t < h; t += 12) { const sh = Math.min(12, h - t); if (asphaltAt(g, x + (w >> 1), y + t + 6)) px(g, x, y + t, w, sh, col); } }
}

/* --- 2.8.1 逐砖色差 --------------------------------------------------
   ⚠️ 色调用**世界砖号的哈希**而不是 rng：一块 16×8 的砖常横跨两个 CELL，
   而每个 CELL 是各画各的 —— 用 rng 的话同一块砖的两半会拿到不同色调，
   在格子边界上留一条 16px 接缝（= 把 CELL 网格暴露出来）。
   哈希与"谁在画"无关，跨格天然一致。 */
function brickTone(bx, by) {
  let h = Math.imul(bx, 73856093) ^ Math.imul(by, 19349663);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h >>> 8) & 255) / 255;
}

/* --- 2.8.2 井盖 ------------------------------------------------------
   3/4 俯视：圆盖压成椭圆（rx6 / ry4）。只落主干道、且不落广场。 */
const MH_RIM = "#4d4d54", MH_FACE = "#6b6b73";
function manholeAt(g, cx, cy) {
  const rx = 6, ry = 4;
  ellipsePx(g, cx, cy + 2, rx + 1, ry, "rgba(14,18,28,0.16)");      // 接地影
  ellipsePx(g, cx, cy, rx, ry, MH_RIM);                             // 铸铁框
  ellipsePx(g, cx, cy - 1, rx, ry, shade(MH_FACE, -0.10));          // 盖面
  ellipsePx(g, cx, cy - 1, rx - 3, ry - 2, shade(MH_FACE, 0.12));   // 内圈
  for (let i = -1; i <= 1; i++)                                     // 盖面方格纹
    px(g, cx - 3, cy - 2 + i, 7, 1, "rgba(14,18,28,0.26)");
  px(g, cx - rx, cy - 1, rx * 2 + 1, 1, "rgba(255,255,255,0.15)");  // 上缘受光
  px(g, cx - rx, cy + ry - 2, rx * 2 + 1, 1, "rgba(14,18,28,0.20)"); // 下缘背光
}
function paintManholes(g, rng) {
  let n = 0;
  for (const a of ARTERY) {
    if (a.cls !== 2) continue;                     // 只落主干道
    const horiz = a.w >= a.h, len = horiz ? a.w : a.h;
    const half = (horiz ? a.h : a.w) / 2;
    for (let t = 130; t < len - 90; t += 170 + ((rng() * 90) | 0)) {
      /* ⚠️ 偏移量**必须避开正中**（±14px 起）：主干道正中是双黄中线，
         偏移取 ±(0.42*half) 的旧写法会让井盖骑在黄线上。 */
      const off = (rng() < 0.5 ? -1 : 1) * (14 + rng() * Math.min(16, half - 18));
      const x = Math.round(horiz ? a.x + t : a.x + a.w / 2 + off);
      const y = Math.round(horiz ? a.y + a.h / 2 + off : a.y + t);
      if (x < 8 || y < 8 || x > WORLD_W - 8 || y > WORLD_H - 8) continue;
      if (!asphaltAt(g, x, y)) continue;           // 只落在真沥青上
      manholeAt(g, x, y);
      n++;
    }
  }
  return n;
}

/* --- 2.8.3 磨损：斑马线缺口 + 车辙压痕 -------------------------------
   ⚠️ 补洞要用**路面底色**（ASPHALT_RAMP[1] = 校门车行道的整块填色），
   不能用透明 —— 底下是烘焙好的地面，透明洞会露出上一层。 */
function paintWear(g, rng) {
  for (const gt of GATES) {
    if (gt.id === "G3") continue;                  // 东南门是斜的，没铺车行道
    if (gt.dir === "h") {
      for (let i = -4; i <= 4; i++)
        for (let k = 0; k < 3; k++)
          px(g, Math.round(gt.x + i * 22 - 4 + rng() * 8), Math.round(gt.y - 26 + rng() * 50),
             1 + ((rng() * 3) | 0), 1 + ((rng() * 5) | 0), ASPHALT_RAMP[1]);
    } else {
      for (let i = -4; i <= 4; i++)
        for (let k = 0; k < 3; k++)
          px(g, Math.round(gt.x - 26 + rng() * 50), Math.round(gt.y + i * 22 - 4 + rng() * 8),
             1 + ((rng() * 5) | 0), 1 + ((rng() * 3) | 0), ASPHALT_RAMP[1]);
    }
  }
  /* 车辙：主干道两条轮迹带（5.5% 黑，很淡，只是"这条路天天有人走"的暗示） */
  for (const a of ARTERY) {
    if (a.cls !== 2) continue;
    const horiz = a.w >= a.h;
    for (const f of [0.30, 0.70])
      if (horiz) bandOnAsphalt(g, a.x, Math.round(a.y + a.h * f) - 1, a.w, 3, "rgba(14,18,28,0.055)");
      else       bandOnAsphalt(g, Math.round(a.x + a.w * f) - 1, a.y, 3, a.h, "rgba(14,18,28,0.055)");
  }
}

/* --- 2.8.4 树下落花 / 落叶 -------------------------------------------
   ⚠️ 由 60_assemble §6.6d 在**所有 props 排好之后**调用；画在地面画布上。
   开花树（66×78，四物种里唯一的 66 宽）落粉花瓣，其余树种掉黄绿落叶。
   ⚠️ 第一版是"均匀撒 6 粒"—— 结果**根本看不出来**：草地本身就有满屏的黄绿
   小点（nature 段的草纹），再撒几粒同色小点等于没画。改成**成簇**：
   先取 3~4 个簇心（离树干 8~19px），每簇再挤 4~5 粒 —— 眼睛读到的是
   "树下落了一小堆"，而不是又一层草地噪点。
   落到水面 / 界外就跳过（落水里就脏了）。 */
const FALL_BLOSSOM = ["#f2d3dd", "#e9bccb", "#dda8bb", "#c98ba4"];
const FALL_LEAF    = ["#8fae55", "#a8bf68", "#c8b455", "#b07a33", "#8a6b2c"];
function paintLeafFall(g, list, rng) {
  let n = 0;
  const put = (x, y, cols) => {
    if (x < 2 || y < 2 || x > WORLD_W - 3 || y > WORLD_H - 3) return;
    const cx = (x / CELL) | 0, cy = (y / CELL) | 0;
    if (CELLK[cy * NW + cx] === K.WATER) return;      // 落水里就脏了
    if (rng() < 0.22) px(g, x, y + 1, 2, 1, "rgba(14,18,28,0.13)");   // 先垫一点接地影
    px(g, x, y, rng() < 0.34 ? 2 : 1, 1, cols[(rng() * cols.length) | 0]);
  };
  for (const p of list) {
    if (p.tag !== "tree") continue;
    const blossom = p.img.width === 66;
    const cols = blossom ? FALL_BLOSSOM : FALL_LEAF;
    const cl = blossom ? 4 : 3;                       // 簇数
    for (let c = 0; c < cl; c++) {
      const a = rng() * 6.2832, r = 8 + rng() * 11;   // 簇心：压在树冠投影内、避开树干
      const bx = p.x + Math.cos(a) * r * 1.5, by = p.y + Math.sin(a) * r * 0.75;
      const m = 3 + ((rng() * 3) | 0);                // 每簇 3~5 粒
      for (let i = 0; i < m; i++)
        put(Math.round(bx + (rng() - 0.5) * 7), Math.round(by + (rng() - 0.5) * 4), cols);
    }
    n++;
  }
  return n;
}
