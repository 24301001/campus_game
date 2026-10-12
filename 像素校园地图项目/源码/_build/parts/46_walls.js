/* =========================================================
   4.6 围墙 + 五个校门
   ---------------------------------------------------------
   围墙沿 BOUND 闭合折线，遇校门留缺。墙体**烘焙进地面**：
   玩家永远在校内（南侧），墙画在人物之下才是对的，同时省掉
   一长串长条精灵的深度排序麻烦。门柱/门楣做成道具，压在人物之上。

   碰撞：沿墙逐段切 90px 一块，取 AABB 进 solids；门口那块跳过。
   ========================================================= */
const WALL_H = 22;                       // 墙高（世界像素，≈2.4 m）

function nearestGateDist(x, y) {
  let best = 1e9;
  for (const G of GATES) {
    const d = Math.hypot(x - G.x, y - G.y) - G.w / 2;
    if (d < best) best = d;
  }
  return best;
}
const inGate = (x, y) => nearestGateDist(x, y) < 0;

/* --- 4.6.1 墙体（烘焙） --- */
function paintWalls(g, rng) {
  const P = BOUND;
  let arc = 0, nextPillar = 76;
  for (let i = 0; i < P.length; i++) {
    const a = P[i], b = P[(i + 1) % P.length];
    const dx = b[0] - a[0], dy = b[1] - a[1];
    const L = Math.hypot(dx, dy);
    const n = Math.max(1, Math.round(L / 2));
    for (let k = 0; k <= n; k++) {
      const x = a[0] + (dx * k) / n, y = a[1] + (dy * k) / n;
      if (k > 0) arc += L / n;
      if (inGate(x, y)) continue;                              // 门口留缺
      wallColumn(g, x, y, rng);
      if (arc >= nextPillar) {                                 // 每隔 76px 一根墙垛
        nextPillar += 76;
        px(g, Math.round(x) - 5, y - WALL_H - 5, 10, WALL_H + 5, "#b3ad9f");
        px(g, Math.round(x) - 5, y - WALL_H - 5, 10, 3, "#d6d0c2");
        px(g, Math.round(x) + 3, y - WALL_H - 5, 2, WALL_H + 5, "#807a6d");
        px(g, Math.round(x) - 5, y + 2, 10, 2, "rgba(14,18,28,0.34)");
      }
    }
  }
  /* --- 4.6.2 碰撞盒：逐段切块（任一端点/中点落进门洞就整块跳过） --- */
  for (let i = 0; i < P.length; i++) {
    const a = P[i], b = P[(i + 1) % P.length];
    const dx = b[0] - a[0], dy = b[1] - a[1];
    const L = Math.hypot(dx, dy);
    const n = Math.max(1, Math.round(L / 90));
    for (let k = 0; k < n; k++) {
      const x0 = a[0] + (dx * k) / n, y0 = a[1] + (dy * k) / n;
      const x1 = a[0] + (dx * (k + 1)) / n, y1 = a[1] + (dy * (k + 1)) / n;
      const mx = (x0 + x1) / 2, my = (y0 + y1) / 2;
      if (inGate(x0, y0) || inGate(x1, y1) || inGate(mx, my)) continue;
      solids.push({
        x: Math.min(x0, x1) - 5, y: Math.min(y0, y1) - 4,
        w: Math.abs(x1 - x0) + 10, h: Math.abs(y1 - y0) + 8
      });
    }
  }
}

function wallColumn(g, x, y, rng) {
  const X = Math.round(x) - 3;
  const Y = Math.round(y);
  px(g, X, Y - WALL_H, 6, WALL_H + 2, "#b0a999");               // 墙身
  px(g, X, Y - WALL_H + 3, 1, WALL_H - 4, "#c4bdac");           // 左棱受光
  px(g, X + 4, Y - WALL_H + 3, 2, WALL_H - 4, "#8d8677");       // 右棱背光
  for (let yy = Y - WALL_H + 5; yy < Y; yy += 6)                // 横向砖缝（读作砌体）
    px(g, X, yy, 6, 1, "rgba(0,0,0,0.11)");
  if (((x | 0) % 20) < 2) px(g, X + 1, Y - WALL_H + 3, 1, WALL_H - 5, "rgba(0,0,0,0.08)");
  px(g, X - 1, Y - WALL_H - 2, 8, 4, "#cec7b6");                // 压顶（挑出 1px）
  px(g, X - 1, Y - WALL_H + 2, 8, 1, "#7e7869");
  px(g, X - 1, Y + 2, 8, 2, "rgba(14,18,28,0.34)");             // 接地影
}

/* --- 4.6.3 可行走判定：多边形内 + 离墙 11px --- */
function distToBound(x, y) {
  let best = 1e9;
  const P = BOUND;
  for (let i = 0, j = P.length - 1; i < P.length; j = i++) {
    const ax = P[j][0], ay = P[j][1], bx = P[i][0], by = P[i][1];
    const vx = bx - ax, vy = by - ay;
    const t = clamp(((x - ax) * vx + (y - ay) * vy) / (vx * vx + vy * vy || 1), 0, 1);
    const d = Math.hypot(x - (ax + vx * t), y - (ay + vy * t));
    if (d < best) best = d;
  }
  return best;
}
/* ⚠️ 门洞必须**内外都放行**：门洞落在边界线上，若一律要求"离边界 > 11px"，
   会在每个校门上横出一道看不见的墙 —— 碰撞盒跳过了也没用，人停在门前 11px 处。
   只放宽界外也不行，界内那一侧照样过不去。
   d < 150 是防止从门洞一路逛到校外纹理区（门洞半径最大 G2 的 97.5px）。 */
function canWalk(x, y) {
  const d = distToBound(x, y);
  if (inGate(x, y) && d < 150) return true;
  return insideBoundary(x, y) && d > 11;
}

/* --- 4.6.4 门柱 / 门楣 / 门牌（道具） --- */
function makeGatePillar(side) {
  const c = mkCanvas(30, 74), g = c.getContext("2d");
  px(g, 1, 68, 28, 5, "rgba(14,18,28,0.34)");                  // 接地影
  px(g, 2, 6, 26, 64, "#bdb6a6");                              // 柱身
  px(g, 2, 6, 4, 64, "#d8d2c4");                               // 左棱受光
  px(g, 24, 6, 4, 64, "#8b8578");                              // 右棱背光
  for (let y = 12; y < 68; y += 11) px(g, 2, y, 26, 1, "rgba(0,0,0,0.14)");
  px(g, 0, 2, 30, 6, "#8b8578");                               // 柱头压顶
  px(g, 0, 0, 30, 3, "#d8d2c4");
  px(g, 4, 8, 22, 8, "#6f6a5e");                               // 嵌板
  px(g, 5, 9, 20, 6, side ? "#a3452f" : "#2f4a6b");
  px(g, 3, 70, 24, 2, "#6f6a5e");                              // 柱础
  return { canvas: c, ax: 15, ay: 71, w: 30, h: 74 };
}

function makeGateBeam(len, name) {
  const c = mkCanvas(len + 24, 30), g = c.getContext("2d");
  px(g, 0, 4, len + 24, 13, "#bdb6a6");
  px(g, 0, 4, len + 24, 3, "#d8d2c4");
  px(g, 0, 15, len + 24, 2, "#8b8578");
  const pw = Math.min(len, 150), px0 = Math.round((len + 24 - pw) / 2);
  px(g, px0, 6, pw, 10, "#5d564a");
  px(g, px0, 6, pw, 1, "#7d7669");
  g.fillStyle = "#e8d9a8";
  g.font = "8px monospace";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText(name, px0 + pw / 2, 12);
  return { canvas: c, ax: (len + 24) / 2, ay: 20, w: len + 24, h: 30 };
}

/* 门楣一律横画 —— 3/4 视角里"沿 y 的门洞"没有可读的横梁，
   竖排门洞改用「门牌挂在近端门柱上」的画法。 */
function buildGates() {
  for (const G of GATES) {
    /* 南门（G2）不套这个模板 —— 它是照片里那座红色高拱门，
       由 49_southgate.js 的 buildSouthArch() 单独画（见该文件头的几何推导）。 */
    if (G.id === "G2") continue;
    const vDir = G.dir === "v";                                // 墙沿 y → 门洞在 y 向
    const a = vDir ? { x: G.x, y: G.y - G.w / 2 } : { x: G.x - G.w / 2, y: G.y };
    const b = vDir ? { x: G.x, y: G.y + G.w / 2 } : { x: G.x + G.w / 2, y: G.y };
    for (const p of [a, b]) {
      const s = makeGatePillar(G.id === "G2");
      props.push({ img: s.canvas, ax: s.ax, ay: s.ay, x: p.x, y: p.y, baseY: p.y });
    }
    if (vDir) {
      /* 近端门柱（y 大的那根）顶上一块横匾 */
      const bm = makeGateBeam(Math.min(150, G.w), G.name);
      props.push({ img: bm.canvas, ax: bm.ax, ay: bm.ay, x: G.x, y: b.y - 66, baseY: b.y - 54 });
    } else {
      const bm = makeGateBeam(Math.abs(b.x - a.x), G.name);
      props.push({ img: bm.canvas, ax: bm.ax, ay: bm.ay, x: G.x, y: a.y - 66, baseY: a.y - 54 });
    }
  }
  buildSouthArch();                    // 南门：红色高拱（49_southgate.js）
}
