/* =========================================================================
   像素校园 · 楼体资源 —— 公共绘制层
   -------------------------------------------------------------------------
   这一层不是新画法：所有笔法都抄自地图的 30_building.js / 70_jianyi.js，
   只把「一栋楼」拆成两步：
       ① PC.make(spec)  —— 与地图同款屋面板、檐口、墙体、接地阴影、屋名牌；
       ② spec.draw(B)   —— 每栋楼自己的正面（窗阵 / 门厅 / 柱廊 / 招牌）。
   层高 FLOOR_H=34、窗 16×22、SUN=(-0.6,-0.8)、接地阴影带、明暗方向全部沿用
   地图的既有口径，所以这些楼体可以直接贴回像素校园的画面里。
   ========================================================================= */
(function (global) {
  "use strict";

  /* --- 与地图完全同值的常量 -------------------------------------------- */
  const SUN = { x: -0.60, y: -0.80 };
  const FLOOR_H = 34;
  const WIN_W = 16, WIN_H = 22, WIN_GAP = 12;
  const PADX = 26, PADT = 18;
  const SIGN_FS = 18;

  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

  /* --- 1. 基础笔法（逐字取自地图） ------------------------------------- */
  function mkCanvas(w, h) {
    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    return c;
  }
  function px(g, x, y, w, h, col) {
    g.fillStyle = col;
    g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  }
  function makeRng(seed) {
    let s = seed >>> 0;
    return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  }
  function poly(g, pts, col) {
    g.fillStyle = col;
    g.beginPath();
    g.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]);
    g.closePath();
    g.fill();
  }
  function speckle(g, x, y, w, h, col, count, rng) {
    g.fillStyle = col;
    for (let i = 0; i < count; i++) g.fillRect(x + ((rng() * w) | 0), y + ((rng() * h) | 0), 1, 1);
  }

  const _hc = Object.create(null);
  function rgb(hex) {
    let v = _hc[hex];
    if (v === undefined) {
      v = [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];
      _hc[hex] = v;
    }
    return v;
  }
  /* k > 0 提亮（偏暖）；k < 0 压暗（偏冷）—— 与地图同一套光源 */
  function shade(hex, k) {
    const c = rgb(hex);
    let r, g, b;
    if (k >= 0) {
      r = c[0] + (255 - c[0]) * k;
      g = c[1] + (255 - c[1]) * (k * 0.93);
      b = c[2] + (255 - c[2]) * (k * 0.80);
    } else {
      const t = -k;
      r = c[0] * (1 - t * 1.08);
      g = c[1] * (1 - t * 1.00);
      b = c[2] * (1 - t * 0.86);
    }
    return "rgb(" + (r | 0) + "," + (g | 0) + "," + (b | 0) + ")";
  }
  function mix(a, b, t) {
    const A = rgb(a), B = rgb(b);
    return "rgb(" + ((A[0] + (B[0] - A[0]) * t) | 0) + ","
                   + ((A[1] + (B[1] - A[1]) * t) | 0) + ","
                   + ((A[2] + (B[2] - A[2]) * t) | 0) + ")";
  }
  function shadowQuad(g, x0, y0, x1, y1, dx, dy, alpha, layers) {
    const L = layers || 4, step = alpha / L;
    for (let i = L; i >= 1; i--) {
      const t = i / L, ox = dx * t, oy = dy * t;
      poly(g, [[x0, y0], [x1, y0], [x1 + ox, y0 + oy], [x1 + ox, y1 + oy], [x0 + ox, y1 + oy], [x0, y1]],
        "rgba(14,18,28," + step.toFixed(3) + ")");
    }
  }
  function contactBand(g, x0, x1, y, h, alpha) {
    const w = x1 - x0, e = w * 0.16;
    px(g, x0, y, w, h, "rgba(14,18,28," + alpha + ")");
    px(g, x0, y, e, h, "rgba(14,18,28," + (alpha * 0.45) + ")");
    px(g, x1 - e, y, e, h, "rgba(14,18,28," + (alpha * 0.45) + ")");
  }

  /* --- 2. 屋名牌（逐字照 30_building.js §3.0） -------------------------- */
  const _signCache = Object.create(null);
  function makeSign(name) {
    if (name in _signCache) return _signCache[name];
    const FONT = "bold " + SIGN_FS + "px 'Microsoft YaHei','SimHei','PingFang SC',sans-serif";
    const t = mkCanvas(8, 8);
    let tc = t.getContext("2d");
    tc.font = FONT;
    const tw = Math.ceil(tc.measureText(name).width) + 8, th = SIGN_FS + 10;
    t.width = tw; t.height = th;
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
    if (maxX < 0) return (_signCache[name] = null);
    const gw = maxX - minX + 1, gh = maxY - minY + 1;
    const pw = gw + 20, ph = SIGN_FS + 9;
    const c = mkCanvas(pw, ph), g = c.getContext("2d");
    px(g, 0, 1, pw, ph - 1, "#5d564a");
    px(g, 0, 1, pw, 1, "#7d7669");
    px(g, 0, ph - 1, pw, 1, "#3a352c");
    px(g, 0, 1, 1, ph - 1, "#6d6557");
    px(g, pw - 1, 1, 1, ph - 1, "#443f35");
    const ox = Math.round((pw - gw) / 2) - minX, oy = Math.round((ph - gh) / 2) - minY;
    g.fillStyle = "#e8d9a8";
    for (let i = 0; i < pts.length; i += 2) g.fillRect(ox + pts[i], oy + pts[i + 1], 1, 1);
    return (_signCache[name] = { c: c, w: pw, h: ph });
  }
  function signRect(sgn, x0, w, eaveY) {
    if (!sgn) return null;
    return { x: Math.round(x0 + (w - sgn.w) / 2), y: eaveY - 8 - sgn.h, w: sgn.w, h: sgn.h };
  }

  /* --- 3. 系统字体 → 二值化（30 段 / 70 段同一套，字形永远 1px 硬边） --- */
  const _txtCache = Object.create(null);
  function textPixels(text, fs) {
    const key = fs + "|" + text;
    if (key in _txtCache) return _txtCache[key];
    const FONT = "bold " + fs + "px 'Microsoft YaHei','SimHei','PingFang SC',sans-serif";
    const t = mkCanvas(8, 8);
    let tc = t.getContext("2d");
    tc.font = FONT;
    const tw = Math.ceil(tc.measureText(text).width) + 4, th = fs + 8;
    t.width = tw; t.height = th;
    tc = t.getContext("2d");
    tc.font = FONT;
    tc.textBaseline = "top";
    tc.fillStyle = "#000";
    tc.fillText(text, 2, 3);
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
    const out = maxX < 0 ? null : { pts: pts, w: maxX - minX + 1, h: maxY - minY + 1, minX: minX, minY: minY };
    _txtCache[key] = out;
    return out;
  }
  function stampText(g, tp, x, y, color) {
    if (!tp) return;
    g.fillStyle = color;
    for (let i = 0; i < tp.pts.length; i += 2)
      g.fillRect(x + tp.pts[i] - tp.minX, y + tp.pts[i + 1] - tp.minY, 1, 1);
  }
  function drawText(g, text, x, y, fs, color) {
    const tp = textPixels(text, fs);
    stampText(g, tp, x, y, color);
    return tp;
  }

  /* --- 4. 一栋楼的标准骨架 ------------------------------------------------
     spec:
       name    楼名（默认挂屋名牌；sign:false 可撤）
       w       立面宽（世界像素，≈ 地图 footprint 宽）
       depth   进深（默认 0.5w）
       floors  层数（每层 34 行）
       wall / roof / glass / door   与地图 PALETTE 同义的四个色
       texture "brick"（默认）| "tile" | "none"
       roofStyle "flat"（默认）| "tile"（红瓦坡顶，只给 8 号公寓楼）
       sign     默认 true；false = 不挂屋名牌
       draw(B)  正面绘制
       after(B) 接地带之后的绘制（台阶、地坪等） */
  function make(spec) {
    const w = Math.round(spec.w);
    const depth = spec.depth || Math.round(w * 0.50);
    const floors = spec.floors || 3;
    const wallH = floors * FLOOR_H;
    const roofT = spec.roofT != null ? Math.round(spec.roofT)
                                     : clamp(Math.round(depth * 0.60), 20, 190);
    const SHX = Math.round(-SUN.x * 26), SHY = Math.round(-SUN.y * 26);
    const c = mkCanvas(w + PADX * 2, PADT + roofT + wallH + SHY + 14);
    const g = c.getContext("2d");
    const x0 = PADX, x1 = PADX + w;
    const eaveY = PADT + roofT;
    const baseY = eaveY + wallH;
    const wall = spec.wall, roof = spec.roof, glass = spec.glass || "#8FB6D9";
    const sgn = spec.name && spec.sign !== false ? makeSign(spec.name) : null;
    const sg = signRect(sgn, x0, w, eaveY);
    const rng = makeRng(spec.seed || ((w * 131 + floors * 17 + 7) | 0));

    /* 4.1 方向性投影（footprint 朝右下） */
    shadowQuad(g, x0 + 2, baseY - Math.min(24, depth * 0.3), x1 - 2, baseY, SHX, SHY, 0.28, 4);

    /* 4.2 屋面：平顶（地图同款）或红瓦坡顶 */
    if (spec.roofStyle === "tile") {
      drawTileRoof(g, x0, x1, w, PADT, roofT, roof, rng);
    } else {
      px(g, x0 - 3, PADT, w + 6, roofT, shade(roof, -0.34));
      px(g, x0, PADT + 2, w, roofT - 5, shade(roof, -0.04));
      px(g, x0, PADT + 2, w, 4, shade(roof, 0.26));
      px(g, x0, PADT + 6, w, 3, "rgba(14,18,28,0.34)");
      px(g, x0, PADT + 6, 4, roofT - 9, shade(roof, 0.14));
      px(g, x1 - 4, PADT + 6, 4, roofT - 9, "rgba(14,18,28,0.22)");
      for (let j = 1; j <= 3; j++)
        px(g, x0 + 5, PADT + Math.round((roofT - 12) * j / 4) + 6, w - 10, 1, "rgba(255,255,255,0.08)");
      px(g, x0 - 3, PADT + roofT - 1, w + 6, 2, shade(roof, -0.60));
      if (roofT > 46) {
        const nb = 2 + ((rng() * 3) | 0);
        for (let i = 0; i < nb; i++) {
          const bw = 18 + rng() * 34, bh = 12 + rng() * 20;
          const bx = Math.round(x0 + 14 + rng() * Math.max(1, w - 28 - bw));
          const by = Math.round(PADT + 14 + rng() * Math.max(1, roofT - 28 - bh - bh * 0.5));
          if (sg && bx < sg.x + sg.w + 6 && bx + bw + 6 > sg.x
                && by < sg.y + sg.h + 3 && by + bh + 6 > sg.y) continue;
          px(g, bx + 4, by + 4, bw, bh, "rgba(14,18,28,0.30)");
          px(g, bx, by + bh - 4, bw, 4, shade(roof, -0.38));
          px(g, bx, by, bw, bh, shade(roof, 0.16));
          px(g, bx, by, bw, 3, shade(roof, 0.34));
          px(g, bx, by + bh - 1, bw, 1, "rgba(14,18,28,0.30)");
        }
      }
      speckle(g, x0 + 4, PADT + 7, w - 8, roofT - 12, "rgba(255,255,255,0.05)", (w / 3) | 0, rng);
      speckle(g, x0 + 4, PADT + 7, w - 8, roofT - 12, "rgba(0,0,0,0.07)", (w / 4) | 0, rng);
    }

    /* 4.3 屋名牌 */
    if (sg) {
      px(g, sg.x + 3, sg.y + 3, sg.w, sg.h, "rgba(14,18,28,0.30)");
      g.drawImage(sgn.c, sg.x, sg.y);
    }

    /* 4.4 墙体 */
    px(g, x0, eaveY + 2, w, wallH, shade(wall, -0.10));
    const texture = spec.texture || "brick";
    if (texture === "brick") {
      for (let yy = eaveY + 7; yy < baseY; yy += 5) {
        px(g, x0, yy, w, 1, "rgba(0,0,0,0.09)");
        const off = ((((yy - eaveY) / 5) | 0) & 1) ? 4 : 0;
        for (let xx = x0 + off; xx < x1; xx += 8) px(g, xx, yy - 5, 1, 5, "rgba(0,0,0,0.06)");
      }
    } else if (texture === "tile") {
      for (let yy = eaveY + 5; yy < baseY; yy += 3)
        px(g, x0, yy, w, 1, "rgba(0,0,0,0.07)");
      for (let xx = x0 + 3; xx < x1; xx += 6)
        for (let yy = eaveY + 3; yy < baseY; yy += 3)
          px(g, xx, yy, 1, 3, "rgba(0,0,0,0.045)");
    }
    speckle(g, x0, eaveY + 3, w, wallH - 3, "rgba(255,255,255,0.05)", (w / 3) | 0, rng);
    speckle(g, x0, eaveY + 3, w, wallH - 3, "rgba(0,0,0,0.09)", (w / 2) | 0, rng);
    px(g, x0, eaveY + 2, 3, wallH, shade(wall, 0.18));
    px(g, x1 - 4, eaveY + 2, 4, wallH, shade(wall, -0.30));
    for (let i = 0; i < 10; i++)
      px(g, x0, eaveY + 2 + i, w, 1, "rgba(14,18,28," + (0.34 * (1 - i / 10)).toFixed(3) + ")");
    for (let f = 1; f < floors; f++)
      px(g, x0, eaveY + f * FLOOR_H, w, 2, shade(wall, -0.20));

    /* 4.5 外轮廓 */
    px(g, x0 - 1, eaveY + 1, w + 2, 1, shade(wall, -0.44));
    px(g, x0 - 1, eaveY + 1, 1, wallH + 2, shade(wall, -0.44));
    px(g, x1, eaveY + 1, 1, wallH + 2, shade(wall, -0.44));

    /* --- B：交给各栋楼的绘制上下文 ------------------------------------- */
    const B = {
      canvas: c, g: g, w: w, depth: depth, floors: floors,
      x0: x0, x1: x1, eaveY: eaveY, baseY: baseY, wallH: wallH, roofT: roofT,
      wall: wall, roof: roof, glass: glass, door: spec.door || "#5a3f2a",
      sign: sg, signImg: sgn, PADX: PADX, PADT: PADT,
      px: function (x, y, ww, hh, col) { px(g, x, y, ww, hh, col); },
      shade: shade, mix: mix, rgba: function (hex, a) { const q = rgb(hex); return "rgba(" + q[0] + "," + q[1] + "," + q[2] + "," + a + ")"; },
      win: function (x, y, ww, hh, o) { winAt(g, B, x, y, ww, hh, o); },
      band: function (x, y, ww, hh, o) { winBand(g, B, x, y, ww, hh, o); },
      ac: function (x, y, o) { acUnit(g, B, x, y, o); },
      door: function (x, y, ww, hh, col, o) { doorLeaf(g, B, x, y, ww, hh, col, o); },
      steps: function (cx, y, ww, n, col) { stairSteps(g, cx, y, ww, n, col); },
      text: function (txt, x, y, fs, col) { return drawText(g, txt, x, y, fs, col); },
      vtext: function (txt, x, y, fs, col, step) {
        for (let i = 0; i < txt.length; i++) drawText(g, txt.charAt(i), x, y + i * step, fs, col);
      },
      plate: function (txt, x, y, fs, col) {
        /* 返回字面尺寸，供居中摆放；不画。 */
        return textPixels(txt, fs);
      },
      stamp: function (tp, x, y, col) { stampText(g, tp, x, y, col); },
      mullions: function (x, y, ww, hh, step, col) {
        for (let xx = x + step; xx < x + ww; xx += step) px(g, xx, y, 1, hh, col);
      },
      column: function (x, y, ww, hh, col) {
        px(g, x, y, ww, hh, col);
        px(g, x, y, 2, hh, shade(col, 0.20));
        px(g, x + ww - 2, y, 2, hh, "rgba(20,24,32,0.22)");
      },
      /* 砖纹补丁：给首层/基座单独铺红砖用（与 30 段 §3.3 同一支笔） */
      brickPatch: function (x, y, ww, hh, col) {
        px(g, x, y, ww, hh, col);
        for (let yy = y + 5; yy < y + hh; yy += 5) {
          px(g, x, yy, ww, 1, "rgba(0,0,0,0.10)");
          const off = ((((yy - y) / 5) | 0) & 1) ? 4 : 0;
          for (let xx = x + off; xx < x + ww; xx += 8) px(g, xx, yy - 5, 1, 5, "rgba(0,0,0,0.07)");
        }
        px(g, x, y, ww, 1, shade(col, 0.18));
        px(g, x, y, 2, hh, shade(col, 0.12));
        px(g, x + ww - 3, y, 3, hh, shade(col, -0.24));
      },
      /* 挂在墙上的楼名牌：奶油色板 + 深色字（照片里宿舍楼门口那块） */
      signPlate: function (text, cx, top, fs, o) {
        o = o || {};
        const tp = textPixels(text, fs);
        if (!tp) return null;
        const padX = o.padX != null ? o.padX : 6, padY = o.padY != null ? o.padY : 4;
        const pw = tp.w + padX * 2, ph = tp.h + padY * 2;
        const x = Math.round(cx - pw / 2), y = Math.round(top);
        px(g, x + 2, y + 2, pw, ph, "rgba(14,18,28,0.30)");
        px(g, x, y, pw, ph, o.bg || "#e8e0cc");
        px(g, x, y, pw, 1, o.bgL || "#f5efe0");
        px(g, x, y + ph - 1, pw, 1, o.bgD || "#a79d87");
        stampText(g, tp, x + padX, y + padY, o.col || "#3a3226");
        return { x: x, y: y, w: pw, h: ph };
      },
      /* 半圆拱：从 base 往上填（研究中心 / 校史馆的门洞、连拱） */
      arch: function (cx, base, rx, ry, col) { archFill(g, cx, base, rx, ry, col); },
      /* 拱券带：一道有厚度的拱形边（外弧与内弧之间 + 两条腿），用于奶白石门套 */
      archBand: function (cx, base, rx, ry, thick, col) { archBand(g, cx, base, rx, ry, thick, col); },
      /* 圆窗：外圈石框 + 深玻璃 + 十字棂 */
      roundWin: function (cx, cy, rx, ry, frame, glass) { roundWin(g, cx, cy, rx, ry, frame, glass); },
      /* 帘影：窗里竖向的浅色帘子（照片里宿舍窗几乎全拉着帘） */
      curtain: function (x, y, ww, hh, col) {
        px(g, x, y, ww, hh, col);
        for (let xx = x + 2; xx < x + ww - 1; xx += 5)
          px(g, xx, y, 1, hh, "rgba(255,255,255,0.26)");
      },
      /* 蓝色飘带（天佑会堂首层玻璃下那条水波） */
      wave: function (x0, x1, yBase, amp, period, col) {
        for (let x = x0; x < x1; x++) {
          const t = (x - x0) / period;
          const y = yBase - Math.round(amp * (0.5 + 0.5 * Math.sin(t * Math.PI * 2)));
          px(g, x, y, 1, 3, col);
        }
      },
      /* 左右外轮廓：draw() 覆盖过底色之后补回来 */
      edges: function (lit, dark) {
        px(g, x0 - 1, eaveY, 1, wallH + 2, lit);
        px(g, x1, eaveY, 1, wallH + 2, dark);
      },
      /* 墙上金字（信息中心、学生活动服务中心那种），带 1px 深色投影 */
      goldText: function (text, cx, top, fs, col) {
        const tp = textPixels(text, fs);
        if (!tp) return null;
        const x = Math.round(cx - tp.w / 2);
        stampText(g, tp, x + 1, top + 1, "rgba(30,24,16,0.55)");
        stampText(g, tp, x, top, col || "#d9b45f");
        return { x: x, y: top, w: tp.w, h: tp.h };
      }
    };

    if (spec.draw) spec.draw(B);

    /* 4.6 接地阴影带（最后补，防止被立面覆盖） */
    contactBand(g, x0 + 1, x1 - 1, baseY - 1, 2, 0.34);
    if (spec.after) spec.after(B);

    return { spec: spec, canvas: c, ax: x0 + w / 2, ay: baseY, w: w, h: wallH + roofT, B: B };
  }

  /* --- 5. 屋面：红瓦坡顶（8 号公寓楼那张图唯一的不同屋面） --------------- */
  function drawTileRoof(g, x0, x1, w, top, roofT, roof, rng) {
    px(g, x0 - 3, top, w + 6, roofT, shade(roof, -0.34));
    px(g, x0 - 1, top + 2, w + 2, roofT - 3, roof);
    /* 瓦垄：一行行半圆瓦，越靠下越窄（读者会读成坡屋面） */
    for (let y = top + 4; y < top + roofT - 3; y += 5) {
      const k = (y - top) / roofT;
      px(g, x0, y, w, 1, shade(roof, -0.18));
      for (let x = x0 + ((y / 5) | 0) % 2 * 5; x < x1; x += 10)
        px(g, x, y - 3, 4, 3, shade(roof, 0.10 - k * 0.16));
    }
    px(g, x0, top, w, 4, shade(roof, 0.22));                 // 屋脊受光
    px(g, x0 - 3, top + roofT - 1, w + 6, 2, shade(roof, -0.55));
    speckle(g, x0 + 3, top + 4, w - 6, roofT - 8, "rgba(255,255,255,0.06)", (w / 3) | 0, rng);
  }

  /* --- 6. 窗 / 窗带 / 空调 / 门 / 台阶 ---------------------------------- */
  function archFill(g, cx, base, rx, ry, col) {
    for (let dx = -rx; dx <= rx; dx++) {
      const t = 1 - (dx * dx) / (rx * rx);
      if (t <= 0) continue;
      const dy = Math.round(ry * Math.sqrt(t));
      px(g, cx + dx, base - dy, 1, dy, col);
    }
  }
  function archBand(g, cx, base, rx, ry, thick, col) {
    for (let dx = -rx; dx <= rx; dx++) {
      const ox = Math.abs(dx);
      const oy = Math.round(ry * Math.sqrt(Math.max(0, 1 - (dx * dx) / (rx * rx))));
      const ir = rx - thick;
      const iy = ox <= ir
        ? Math.round((ry - thick) * Math.sqrt(Math.max(0, 1 - (dx * dx) / (ir * ir))))
        : 0;
      const y0 = base - oy, y1 = base - iy;
      if (y1 > y0) px(g, cx + dx, y0, 1, y1 - y0, col);
    }
  }
  function roundWin(g, cx, cy, rx, ry, frame, glass) {
    for (let dy = -ry; dy <= ry; dy++) {
      const t = 1 - (dy * dy) / (ry * ry);
      if (t < 0) continue;
      const dx = Math.round(rx * Math.sqrt(t));
      px(g, cx - dx, cy + dy, dx * 2 + 1, 1, frame);
    }
    for (let dy = -ry + 2; dy <= ry - 2; dy++) {
      const t = 1 - (dy * dy) / ((ry - 2) * (ry - 2));
      if (t < 0) continue;
      const dx = Math.round((rx - 2) * Math.sqrt(t));
      px(g, cx - dx, cy + dy, dx * 2 + 1, 1, glass);
    }
    px(g, cx, cy - ry + 2, 1, ry * 2 - 4, frame);
    px(g, cx - rx + 2, cy, rx * 2 - 4, 1, frame);
    px(g, cx - Math.max(1, rx - 5), cy - Math.max(1, ry - 6), 3, 2, "rgba(255,255,255,0.34)");
  }
  function winAt(g, B, x, y, w, h, o) {
    o = o || {};
    const wall = o.wall || B.wall;
    const glass = o.glass || B.glass;
    const frame = o.frame || shade(wall, 0.12);
    px(g, x - 1, y - 1, w + 2, h + 2, frame);
    px(g, x + w, y - 1, 1, h + 2, shade(wall, -0.34));
    px(g, x, y, w, h, "#2c3746");
    px(g, x, y, w, 2, "rgba(10,13,20,0.58)");
    px(g, x, y, 2, h, "rgba(10,13,20,0.44)");
    px(g, x + 2, y + 2, w - 6, 3, shade(glass, 0.28));
    px(g, x + 3, y + 6, w - 9, 2, shade(glass, 0.12));
    if (o.mullion !== false) {
      const n = o.mullions || 1;
      for (let i = 1; i <= n; i++)
        px(g, x + Math.round(w * i / (n + 1)), y + 2, 1, h - 4, o.frame || shade(wall, -0.52));
    }
    px(g, x + 2, y + Math.round(h * 0.62), w - 4, Math.round(h * 0.34), shade(glass, -0.24));
    if (o.sill !== false) {
      px(g, x - 2, y + h, w + 4, 3, o.sillCol || shade(wall, 0.24));
      px(g, x - 2, y + h + 3, w + 4, 1, "rgba(14,18,28,0.28)");
    }
  }

  /* 横向窗带：信息中心、天佑会堂、宿舍楼梯间都用它（一格里 4~20 扇） */
  function winBand(g, B, x, y, w, h, o) {
    o = o || {};
    const frame = o.frame || "#d7d2c6";
    const glass = o.glass || B.glass;
    px(g, x - 2, y - 2, w + 4, h + 4, frame);
    px(g, x, y, w, h, "#3a4652");
    px(g, x, y, w, 2, "rgba(10,13,20,0.55)");
    px(g, x, y, 2, h, "rgba(10,13,20,0.40)");
    px(g, x + 2, y + 2, w - 4, Math.max(3, Math.round(h * 0.28)), shade(glass, 0.24));
    px(g, x + 2, y + 2, w - 4, 2, shade(glass, 0.38));
    /* 竖梃 */
    const step = o.step || 16;
    for (let xx = x + step; xx < x + w; xx += step)
      px(g, xx, y + 1, 1, h - 2, o.mullionCol || frame);
    /* 中横档 */
    if (o.transom !== false) {
      const ty = y + Math.round(h * (o.transomAt || 0.55));
      px(g, x + 1, ty, w - 2, 1, o.mullionCol || frame);
      px(g, x + 1, ty + 1, w - 2, 2, shade(glass, -0.26));
    }
    if (o.sill !== false) {
      px(g, x - 3, y + h, w + 6, 3, o.sillCol || "#c9c4b8");
      px(g, x - 3, y + h + 3, w + 6, 1, "rgba(14,18,28,0.26)");
    }
  }

  /* 白色空调外机（62_dorm16.js 同款） */
  function acUnit(g, B, x, y, o) {
    o = o || {};
    const w = o.w || 14, h = o.h || 10;
    const shell = o.col || "#e2e5ea";
    px(g, x, y, w, h, shell);
    px(g, x, y, w, 1, "#ffffff");
    px(g, x, y + h - 1, w, 1, "#9aa0aa");
    px(g, x, y + 2, w - 3, 1, "rgba(20,24,32,0.20)");
    px(g, x + w - 3, y + 2, 3, h - 4, "#9aa0aa");
    px(g, x - 1, y + h, w + 2, 1, "rgba(14,18,28,0.22)");
  }

  function doorLeaf(g, B, x, y, w, h, col, o) {
    o = o || {};
    px(g, x - 1, y - 1, w + 2, h + 1, o.frame || shade(col, -0.34));
    px(g, x, y, w, h, col);
    for (let i = 3; i < w; i += (o.panel || 6))
      px(g, x + i, y + 2, 1, h - 2, "rgba(0,0,0,0.22)");
    px(g, x, y, w, 1, "rgba(0,0,0,0.30)");
    if (o.handle !== false)
      px(g, x + Math.round(w * 0.5) - 1, y + Math.round(h * 0.45), 2, 6, "#d8c07a");
    if (o.glass !== false) {
      px(g, x + 2, y + 3, w - 4, Math.max(3, Math.round(h * 0.30)), "rgba(150,190,210,0.55)");
      px(g, x + 2, y + 3, w - 4, 1, "rgba(255,255,255,0.30)");
    }
  }

  function stairSteps(g, cx, y, w, n, col) {
    n = n || 3;
    col = col || "#b9b3a6";
    for (let i = 0; i < n; i++) {
      const sw = w + i * 5, sx = Math.round(cx - sw / 2), sy = y + i * 3 - 2;
      px(g, sx, sy, sw, 3, shade(col, 0.10 - i * 0.11));
      px(g, sx, sy + 3, sw, 1, "rgba(14,18,28,0.26)");
    }
  }

  global.PC = {
    SUN: SUN, FLOOR_H: FLOOR_H, WIN_W: WIN_W, WIN_H: WIN_H, WIN_GAP: WIN_GAP,
    PADX: PADX, PADT: PADT,
    mkCanvas: mkCanvas, px: px, makeRng: makeRng, poly: poly, speckle: speckle,
    rgb: rgb, shade: shade, mix: mix, shadowQuad: shadowQuad, contactBand: contactBand,
    makeSign: makeSign, signRect: signRect,
    textPixels: textPixels, stampText: stampText, drawText: drawText,
    make: make
  };
})(window);
