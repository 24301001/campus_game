/* =========================================================
   3. 建筑生成器（统一外形）
   ---------------------------------------------------------
   锚点 = 底部中心（落地线）。可见结构自上而下：
   屋顶板 → 檐口 → 墙体（窗阵）→ 门 + 台阶 → 接地阴影带。
   明暗一律服从 SUN：左上受光偏暖，右下背光偏冷。

   层高 34 px（≈3.8 m，与思源楼精灵的窗排间距一致，见交接文档 §7.1）。
   ========================================================= */
const FLOOR_H = 34;
const WIN_W = 16, WIN_H = 22, WIN_GAP = 12;

/* --- 3.0 屋名标牌 ---------------------------------------------------
   每栋楼在屋顶前沿挂一块深色牌子 + 奶油色字，与校门门楣（§4.6.4）同一套色语。

   字形走思源楼题字（§3.5.6）那套：**系统字体渲染 → alpha 二值化 → 逐像素填色**。
   好处是笔画永远 1px 硬边，放大 3 倍也不会有抗锯齿灰边；直接把 fillText 画进精灵
   则会在放大后糊成一团。代价是字面尺寸只能量出来（不同字体左右留白差很多）。

   字号**全楼统一**（SIGN_FS），不像素化才像招牌。最窄的楼 R.w ≈ 214 世界像素，
   最长的名字 6 字 → 字面 ≈102 px + 20 px 边距 = 122 px 牌面，不到一半宽度，
   所以不需要按楼缩字号（这条是数据不变量：CAMPUS 里最长的名字就是 6 字）。 */
const SIGN_FS = 18;
const _signCache = Object.create(null);        // name → {c, w, h}；重名楼共用一块牌
function makeSign(name) {
  if (name in _signCache) return _signCache[name];
  const FONT = "bold " + SIGN_FS + "px 'Microsoft YaHei','SimHei','PingFang SC',sans-serif";
  const t = mkCanvas(8, 8);
  let tc = t.getContext("2d");
  tc.font = FONT;
  const tw = Math.ceil(tc.measureText(name).width) + 8, th = SIGN_FS + 10;
  t.width = tw; t.height = th;                 // ⚠️ 改尺寸会重置上下文，必须重取
  tc = t.getContext("2d");
  tc.font = FONT;
  tc.textBaseline = "top";
  tc.fillStyle = "#000";
  tc.fillText(name, 4, 4);
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
  if (maxX < 0) return (_signCache[name] = null);   // 拿不到字形就不挂牌
  const gw = maxX - minX + 1, gh = maxY - minY + 1; // 字面实际尺寸
  const pw = gw + 20, ph = SIGN_FS + 9;             // 牌面：字面左右各留 10 px
  const c = mkCanvas(pw, ph), g = c.getContext("2d");
  px(g, 0, 1, pw, ph - 1, "#5d564a");               // 牌面
  px(g, 0, 1, pw, 1, "#7d7669");                    // 上棱受光
  px(g, 0, ph - 1, pw, 1, "#3a352c");               // 下棱背光
  px(g, 0, 1, 1, ph - 1, "#6d6557");                // 左棱
  px(g, pw - 1, 1, 1, ph - 1, "#443f35");           // 右棱
  const ox = Math.round((pw - gw) / 2) - minX, oy = Math.round((ph - gh) / 2) - minY;
  g.fillStyle = "#e8d9a8";
  for (let i = 0; i < pts.length; i += 2) g.fillRect(ox + pts[i], oy + pts[i + 1], 1, 1);
  return (_signCache[name] = { c: c, w: pw, h: ph });
}
/* 标牌矩形：屋顶前沿，牌底离檐口 8 px（留出檐口投影线，牌子才"站在屋面上"） */
function signRect(sgn, x0, w, eaveY) {
  if (!sgn) return null;
  return { x: Math.round(x0 + (w - sgn.w) / 2), y: eaveY - 8 - sgn.h, w: sgn.w, h: sgn.h };
}

function makeBuilding(o) {
  const rng    = makeRng(o.seed);
  const w      = Math.round(o.w);
  const depth  = o.depth || Math.round(w * 0.50);
  const floors = o.floors || 3;
  const wallH  = floors * FLOOR_H;
  /* 屋顶板要"吃掉"平面进深：PPT 给的是建筑俯视轮廓，板画得够厚，
     楼才压得住自己的 footprint —— 否则矩形北半边会露出一块空白基座。

     ⚠️ 但 0.60 的比例 + 190 的上限对"进深特别大"的楼是不够的：进深 483 的新体育馆
        只画得出 190 的屋面板，北侧 122px 的 K.BLD footprint 会整条露在外面 ——
        而 `paintCells` 给 K.BLD 铺的正是"楼前硬地"（那里明写着"露出来的北半边
        读作前庭/消防通道"），于是那一片读成一块**灰色石板**。
        用户 2026-09-17：「老体育馆和新体育馆都向北延长直到分配给其的 k 灰色石板
        区域被覆盖」⇒ `o.roofFull` 让屋面板**铺满整个进深**：

            roofT = ceil(depth) − wallH

        恰好使屋面顶边（精灵局部第 PADT + roofT 行）落到 footprint 的北缘。
        取 **ceil** 而不是 round：宁可多盖半像素，也不留一条 1px 的灰缝
        （round 在半整数进深上会向下取整，反倒露出来）。
        **只有那两栋体育馆传这个标志**，其余 47 栋一字不变 —— 通用的 0.60/190
        是全校的既定比例，改了会顺手把运输实验馆（进深 472）、学生服务中心
        （进深 656）那几栋一起变形。 */
  const roofT  = o.roofFull ? (Math.ceil(depth) - wallH)
                            : clamp(Math.round(depth * 0.60), 20, 190);

  const PADX = 26, PADT = 18;
  const SHX = Math.round(-SUN.x * 26), SHY = Math.round(-SUN.y * 26);
  const c = mkCanvas(w + PADX * 2, PADT + roofT + wallH + SHY + 14);
  const g = c.getContext("2d");

  const x0 = PADX, x1 = PADX + w;
  const eaveY = PADT + roofT;              // 屋檐下沿 = 墙顶
  const baseY = eaveY + wallH;             // 落地线
  const wall = o.wall, roof = o.roof, glass = o.glass || "#8FB6D9";
  const sgn = o.name ? makeSign(o.name) : null;      // 屋名标牌（可空）
  const sg  = signRect(sgn, x0, w, eaveY);

  /* --- 3.1 方向性投影：footprint 朝右下拉伸 --- */
  shadowQuad(g, x0 + 2, baseY - Math.min(24, depth * 0.3), x1 - 2, baseY, SHX, SHY, 0.28, 4);

  /* --- 3.2 屋面（俯视）：女儿墙 + 分坡脊 + 屋面设备 --- */
  px(g, x0 - 3, PADT, w + 6, roofT, shade(roof, -0.34));            // 檐口外沿
  px(g, x0, PADT + 2, w, roofT - 5, shade(roof, -0.04));            // 板面
  px(g, x0, PADT + 2, w, 4, shade(roof, 0.26));                     // 女儿墙顶受光
  px(g, x0, PADT + 6, w, 3, "rgba(14,18,28,0.34)");                 // 女儿墙内阴影
  px(g, x0, PADT + 6, 4, roofT - 9, shade(roof, 0.14));             // 左内侧受光
  px(g, x1 - 4, PADT + 6, 4, roofT - 9, "rgba(14,18,28,0.22)");     // 右内侧背光
  for (let j = 1; j <= 3; j++)                                      // 分坡脊线
    px(g, x0 + 5, PADT + Math.round((roofT - 12) * j / 4) + 6, w - 10, 1, "rgba(255,255,255,0.08)");
  px(g, x0 - 3, PADT + roofT - 1, w + 6, 2, shade(roof, -0.60));    // 檐口投影线
  if (roofT > 46) {                                                 // 屋面设备
    const nb = 2 + ((rng() * 3) | 0);
    for (let i = 0; i < nb; i++) {
      const bw = 18 + rng() * 34, bh = 12 + rng() * 20;
      const bx = Math.round(x0 + 14 + rng() * Math.max(1, w - 28 - bw));
      const by = Math.round(PADT + 14 + rng() * Math.max(1, roofT - 28 - bh - bh * 0.5));
      /* 让开屋名标牌：牌子压在设备之后画，重叠就是互相打架（设备的投影还会糊上牌面）。
         ⚠️ 三个 rng() 都已取过再判，跳过也不改动随机序列 —— 否则全校园的屋面纹样会整体错位。 */
      if (sg && bx < sg.x + sg.w + 6 && bx + bw + 6 > sg.x
            && by < sg.y + sg.h + 3 && by + bh + 6 > sg.y) continue;
      px(g, bx + 4, by + 4, bw, bh, "rgba(14,18,28,0.30)");         // 设备投影
      px(g, bx, by + bh - 4, bw, 4, shade(roof, -0.38));            // 设备侧墙
      px(g, bx, by, bw, bh, shade(roof, 0.16));
      px(g, bx, by, bw, 3, shade(roof, 0.34));
      px(g, bx, by + bh - 1, bw, 1, "rgba(14,18,28,0.30)");
    }
  }
  speckle(g, x0 + 4, PADT + 7, w - 8, roofT - 12, "rgba(255,255,255,0.05)", (w / 3) | 0, rng);
  speckle(g, x0 + 4, PADT + 7, w - 8, roofT - 12, "rgba(0,0,0,0.07)", (w / 4) | 0, rng);

  /* --- 3.2.9 屋名标牌（画在斑点之后，压在屋面上；服从 SUN，投影朝右下） --- */
  if (sg) {
    px(g, sg.x + 3, sg.y + 3, sg.w, sg.h, "rgba(14,18,28,0.30)");
    g.drawImage(sgn.c, sg.x, sg.y);
  }

  /* --- 3.3 墙体：砖纹 --- */
  px(g, x0, eaveY + 2, w, wallH, shade(wall, -0.10));
  for (let yy = eaveY + 7; yy < baseY; yy += 5) {
    px(g, x0, yy, w, 1, "rgba(0,0,0,0.09)");
    const off = ((((yy - eaveY) / 5) | 0) & 1) ? 4 : 0;
    for (let xx = x0 + off; xx < x1; xx += 8) px(g, xx, yy - 5, 1, 5, "rgba(0,0,0,0.06)");
  }
  speckle(g, x0, eaveY + 3, w, wallH - 3, "rgba(255,255,255,0.05)", (w / 3) | 0, rng);
  speckle(g, x0, eaveY + 3, w, wallH - 3, "rgba(0,0,0,0.09)", (w / 2) | 0, rng);
  px(g, x0, eaveY + 2, 3, wallH, shade(wall, 0.18));                // 左棱受光
  px(g, x1 - 4, eaveY + 2, 4, wallH, shade(wall, -0.30));           // 右棱背光
  for (let i = 0; i < 10; i++)                                      // 檐下阴影带
    px(g, x0, eaveY + 2 + i, w, 1, "rgba(14,18,28," + (0.34 * (1 - i / 10)).toFixed(3) + ")");
  /* 楼层分隔线：每层一道浅浅的腰线 */
  for (let f = 1; f < floors; f++)
    px(g, x0, eaveY + f * FLOOR_H, w, 2, shade(wall, -0.20));

  /* --- 3.4 门（先占位，供窗户避让） --- */
  /* ⚠️ `o.noDoor` —— 只给 §5.12 的 **16 号楼**用：本栋**不画门**（门由
     parts/62_dorm16.js 的两个门楼自己画），**并且门的那条占位也一并撤掉**。
     占位不撤的话首层照样会被挡掉一列窗，而那列窗所在的墙上已经没有任何门了
     —— 红墙中间会空出一格，比原门还显眼（2026-09-19 出图时实测）。
     ⚠️ 默认路径**逐字节不变**：`dw` 仍是原来的数，`occ` 的内容与**顺序**也一样
        （仍是 [门占位, 雨水管占位]，只是门那条改成条件插入）。
        3.7 那段整块用 `if (dw)` 围住 —— 它内部没有任何 rng() 调用，
        所以跳过它对随机流零影响（rng 用在 3.2 屋面 / 3.3 墙面 speckle）。 */
  const dw = o.noDoor ? 0 : Math.min(70, Math.round(w * 0.18)), dh = 44;
  const dcenter = x0 + w / 2 + (o.doorSide || 0) * Math.round(w * 0.22);
  const dx = Math.round(dcenter - dw / 2), dy = baseY - dh;
  const occ = [[x1 - 10, eaveY + 2, x1, baseY]];                  // 雨水管占位
  if (dw) occ.unshift([dx - 10, dy - 16, dx + dw + 10, baseY + 10]);  // 门占位

  /* --- 3.5 窗阵：行 = floors，列按宽度排 --- */
  const margin = 22;
  const cols = Math.max(1, Math.floor((w - margin * 2 + WIN_GAP) / (WIN_W + WIN_GAP)));
  const stepX = (w - margin * 2 - cols * WIN_W) / (cols - 1 || 1);
  const winAt = (wx, wy) => {
    px(g, wx - 1, wy - 1, WIN_W + 2, WIN_H + 2, shade(wall, 0.12));       // 框外缘受光
    px(g, wx + WIN_W, wy - 1, 1, WIN_H + 2, shade(wall, -0.34));          // 框右背光
    px(g, wx, wy, WIN_W, WIN_H, "#2c3746");                               // 洞口
    px(g, wx, wy, WIN_W, 2, "rgba(10,13,20,0.58)");                       // 洞口上内侧
    px(g, wx, wy, 2, WIN_H, "rgba(10,13,20,0.44)");                       // 洞口左内侧
    px(g, wx + 2, wy + 2, WIN_W - 6, 3, shade(glass, 0.28));              // 玻璃上高光
    px(g, wx + 3, wy + 6, WIN_W - 9, 2, shade(glass, 0.12));
    px(g, wx + 6, wy + 4, 1, WIN_H - 8, shade(wall, -0.52));              // 竖窗棂
    px(g, wx + 2, wy + Math.round(WIN_H * 0.62), WIN_W - 4, Math.round(WIN_H * 0.34), shade(glass, -0.24));
    px(g, wx - 2, wy + WIN_H, WIN_W + 4, 3, shade(wall, 0.24));           // 窗台顶面受光
    px(g, wx - 2, wy + WIN_H + 3, WIN_W + 4, 1, "rgba(14,18,28,0.28)");   // 窗台投影
  };
  for (let f = 0; f < floors; f++) {
    /* 首层窗整体上移 30px 给门让位；顶层贴檐口留 16px */
    const wy = f === 0 ? baseY - 30 - WIN_H
                       : eaveY + 16 + (f - 1) * FLOOR_H + Math.round((FLOOR_H - WIN_H) * 0.35);
    if (wy + WIN_H > baseY - 8) continue;
    for (let cn = 0; cn < cols; cn++) {
      const wx = Math.round(margin + cn * (WIN_W + stepX));
      const box = [wx - 3, wy - 2, wx + WIN_W + 3, wy + WIN_H + 5];
      if (occ.some(b => !(box[2] < b[0] || box[0] > b[2] || box[3] < b[1] || box[1] > b[3]))) continue;
      winAt(wx, wy);
    }
  }

  /* --- 3.6 雨水管 --- */
  const pipeX = x1 - 7;
  px(g, pipeX, eaveY + 3, 3, baseY - eaveY - 3, shade(wall, -0.24));
  px(g, pipeX, eaveY + 3, 1, baseY - eaveY - 3, shade(wall, 0.04));
  px(g, pipeX - 1, Math.round((eaveY + baseY) / 2) - 5, 5, 2, shade("#8b8f96", -0.10));
  px(g, pipeX - 1, baseY - 12, 5, 2, shade("#8b8f96", -0.22));

  /* --- 3.7 雨棚 + 门 + 台阶（`noDoor` 时 dw=0，整块跳过 —— 见 3.4 那注） --- */
  if (dw) {
  const cx0 = dx - 10, cx1 = dx + dw + 10, cy = dy - 13;
  px(g, cx0, cy, cx1 - cx0, 3, shade(roof, 0.10));                  // 雨棚顶面
  px(g, cx0, cy + 3, cx1 - cx0, 1, shade(roof, -0.50));
  px(g, cx0, cy + 4, 2, 5, shade(roof, -0.28));
  px(g, cx1 - 2, cy + 4, 2, 5, shade(roof, -0.56));
  for (let i = 0; i < 5; i++)
    px(g, dx - 6, cy + 6 + i, dw + 12, 1, "rgba(14,18,28," + (0.30 * (1 - i / 5)).toFixed(3) + ")");
  px(g, dx - 1, dy - 1, dw + 2, dh + 1, shade(wall, -0.38));        // 门框
  px(g, dx, dy, dw, dh, shade(o.door || "#6b4a2f", -0.16));
  for (let i = 3; i < dw; i += 6) px(g, dx + i, dy + 2, 1, dh - 2, "rgba(0,0,0,0.22)");
  px(g, dx, dy, dw, 1, "rgba(0,0,0,0.30)");
  px(g, dx + Math.round(dw * 0.5) - 1, dy + Math.round(dh * 0.45), 2, 6, shade("#d8c07a", 0.12));  // 门把手
  px(g, dx + 2, dy + 2, Math.round(dw * 0.42), dh - 4, "rgba(255,235,190,0.10)");                  // 门内暖光
  for (let i = 0; i < 3; i++) {                                     // 台阶：自上而下逐级变宽
    const sw = dw + 9 + i * 5, sx = Math.round(dcenter - sw / 2), sy = baseY + i * 3 - 2;
    px(g, sx, sy, sw, 3, shade("#b9b3a6", 0.10 - i * 0.11));
    px(g, sx, sy + 3, sw, 1, "rgba(14,18,28,0.26)");
  }
  }                                     // ← 3.7 结束（`noDoor` 时 dw=0，整块没画）

  /* --- 3.8 整栋外轮廓 + 接地最深窄带 --- */
  px(g, x0 - 1, eaveY + 1, w + 2, 1, shade(wall, -0.44));
  px(g, x0 - 1, eaveY + 1, 1, wallH + 2, shade(wall, -0.44));
  px(g, x1, eaveY + 1, 1, wallH + 2, shade(wall, -0.44));
  contactBand(g, x0 + 1, x1 - 1, baseY - 1, 2, 0.34);

  return { canvas: c, ax: x0 + w / 2, ay: baseY, w: w, h: wallH + roofT };
}
