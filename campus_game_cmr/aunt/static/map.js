(function () {
  "use strict";
  const W = 960, H = 600, CELL = 30;
  const baked = new WeakMap();
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const gridRect = a => ({ x: a[0] * CELL, y: a[1] * CELL, w: a[2] * CELL, h: a[3] * CELL });
  const fill = (g, x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };
  const tint = s => s == null ? "#adb9b6" : s >= 4.5 ? "#e97467" : s >= 4 ? "#89c89d" : s >= 3 ? "#e8c675" : "#bb917d";
  function stallSign(name, width) {
    const clean = name.replace(/打饭窗口示意\s*(\d+)/, "窗口 $1")
      .replace(/清真区示意窗口\s*([A-Z])/, "示意 $1")
      .replace(/其他档口 · 左侧上/, "左侧待核①")
      .replace(/其他档口 · 左侧下/, "左侧待核②")
      .replace(/（位置示意）|（待核）|档口/g, "");
    const size = width < 100 ? 13 : 15;
    const maxChars = Math.max(3, Math.floor((width - 14) / size));
    const chars = Array.from(clean);
    if (chars.length <= maxChars) return { lines: [clean], size };
    const first = chars.slice(0, maxChars).join("");
    let second = chars.slice(maxChars, maxChars * 2).join("");
    if (chars.length > maxChars * 2) second = second.slice(0, -1) + "…";
    return { lines: [first, second], size };
  }

  function fixturesFor(floor) {
    const items = floor.plan && floor.plan.fixtures;
    if (items && items.length) return items.map(item => ({ ...item, bounds: gridRect(item.rect) }));
    return [];
  }
  function background(floor, layout) {
    if (baked.has(floor)) return baked.get(floor);
    const cv = document.createElement("canvas"); cv.width = W; cv.height = H;
    const g = cv.getContext("2d"); g.imageSmoothingEnabled = false;
    fill(g, 0, 0, W, H, "#203b4c");
    fill(g, 14, 14, W - 28, H - 28, "#59727a");
    fill(g, 23, 23, W - 46, H - 46, "#d7d4c3");
    for (let y = 24; y < H - 24; y += CELL) for (let x = 24; x < W - 24; x += CELL) {
      const tx = Math.floor(x / CELL), ty = Math.floor(y / CELL);
      fill(g, x, y, CELL - 1, CELL - 1, (tx + ty) % 2 ? "#e1dfce" : "#d9d8c8");
      fill(g, x + 2, y + 2, CELL - 6, 2, "rgba(255,255,255,.13)");
      if ((tx * 11 + ty * 7) % 6 === 0) {
        fill(g, x + 19, y + 18, 3, 2, "#c9c9b9");
        fill(g, x + 5, y + 22, 2, 2, "#ebead9");
      }
    }
    fill(g, 11, 11, W - 22, 12, "#223d4e");
    fill(g, 11, H - 23, W - 22, 12, "#223d4e");
    fill(g, 11, 11, 12, H - 22, "#223d4e");
    fill(g, W - 23, 11, 12, H - 22, "#223d4e");
    fill(g, 23, 23, W - 46, 4, "#80949a");
    fill(g, 23, H - 27, W - 46, 4, "#80949a");
    for (let x = 60; x < W - 40; x += 120) {
      fill(g, x, 13, 9, 9, "#466472");
      fill(g, x + 2, 15, 5, 4, "#e0c47e");
    }
    const entry = layout.entrance;
    if (layout.hasPlan) {
      fill(g, entry.x - 48, H - 23, 96, 12, "#e3bd70");
      fill(g, entry.x - 44, H - 34, 88, 11, "#f6e4a8");
      for (let i = -33; i <= 33; i += 11) fill(g, entry.x + i, H - 31, 5, 4, "#d3ae64");
      g.textAlign = "center"; g.fillStyle = "#35546a";
      g.font = "bold 16px 'Microsoft YaHei',sans-serif";
      g.fillText("入口", entry.x, H - 40);
    }
    baked.set(floor, cv);
    return cv;
  }

  function fixtureLabel(g, text, x, y, width) {
    if (!text || width < 30) return;
    g.textAlign = "center";
    g.fillStyle = "#f7f0d9";
    g.font = "bold 12px 'Microsoft YaHei',sans-serif";
    g.fillText(text, x, y, width - 7);
  }
  function drawChair(g, x, y, vertical = false, warm = true) {
    const base = warm ? "#805c44" : "#4a6266";
    const seat = warm ? "#bb9268" : "#799189";
    fill(g, x + 2, y + 3, vertical ? 10 : 13, vertical ? 13 : 10, "rgba(45,55,50,.2)");
    fill(g, x, y, vertical ? 10 : 13, vertical ? 13 : 10, base);
    fill(g, x + 2, y + 2, vertical ? 6 : 9, vertical ? 9 : 6, seat);
    fill(g, x + 2, y + 2, vertical ? 2 : 9, vertical ? 9 : 2, "#e1bc89");
  }
  function drawTable(g, item) {
    const { x, y, w, h } = item.bounds;
    if (item.kind === "round_table" || item.shape === "round") {
      const cx = x + w / 2, cy = y + h / 2;
      for (let a = 0; a < 4; a++) {
        const px = cx + [-10, w / 2 - 12, -10, -w / 2 + 2][a];
        const py = cy + [-h / 2 + 2, -6, h / 2 - 13, -6][a];
        drawChair(g, px, py, a % 2 === 1);
      }
      fill(g, cx - 18, cy - 13, 36, 29, "#785a41");
      fill(g, cx - 22, cy - 8, 44, 19, "#785a41");
      fill(g, cx - 18, cy - 10, 36, 23, "#e3b77b");
      fill(g, cx - 21, cy - 5, 42, 13, "#e3b77b");
      fill(g, cx - 6, cy - 4, 12, 10, "#f8efd5");
      fill(g, cx - 3, cy - 1, 6, 4, "#b27751");
      return;
    }
    const horizontal = w >= h;
    const chairXs = horizontal && w >= 75 ? [x + 13, x + w - 27] : [x + w / 2 - 6];
    chairXs.forEach(px => {
      drawChair(g, px, y + 1);
      drawChair(g, px, y + h - 14);
    });
    if (w >= 54) {
      drawChair(g, x + 1, y + h / 2 - 6, true);
      drawChair(g, x + w - 11, y + h / 2 - 6, true);
    }
    const tx = x + 11, ty = y + 13, tw = Math.max(22, w - 22), th = Math.max(19, h - 26);
    fill(g, tx + 3, ty + 5, tw, th, "rgba(48,52,49,.26)");
    fill(g, tx, ty, tw, th, "#6e5542");
    fill(g, tx + 3, ty + 3, tw - 6, th - 6, "#d5a776");
    fill(g, tx + 5, ty + 5, tw - 10, 3, "#efc89b");
    if (item.shape === "hotpot" || item.kind === "hotpot_table") {
      const cx = x + w / 2, cy = y + h / 2;
      fill(g, cx - 9, cy - 8, 18, 16, "#3c5260");
      fill(g, cx - 6, cy - 5, 12, 10, "#ddbfa3");
      fill(g, cx - 3, cy - 3, 6, 6, "#ae6855");
    } else {
      fill(g, x + w / 2 - 5, y + h / 2 - 5, 10, 9, "#faf1d8");
      fill(g, x + w / 2 - 2, y + h / 2 - 2, 4, 3, "#ad805d");
    }
  }
  function drawPlant(g, item) {
    const { x, y, w, h } = item.bounds;
    const compact = Math.min(w, h) < 43;
    fill(g, x + 3, y + h - 11, w - 6, 10, "#705844");
    fill(g, x + 6, y + h - 9, w - 12, 4, "#b28859");
    for (let px = x + 8; px < x + w - 4; px += compact ? 13 : 16) {
      const py = y + 5 + (Math.round(px) % 3) * 3;
      fill(g, px - 5, py + 7, 15, Math.max(8, h - 17), "#356d50");
      fill(g, px - 8, py + 10, 21, 10, "#4e8a5b");
      fill(g, px - 2, py, 11, 16, "#6eaa67");
      fill(g, px + 3, py + 4, 5, 5, "#b7d78a");
    }
  }
  function drawCounter(g, item, selfServe = false) {
    const { x, y, w, h } = item.bounds;
    fill(g, x + 4, y + 6, w - 4, h - 2, "rgba(42,53,54,.25)");
    fill(g, x + 1, y + 2, w - 2, h - 5, "#4d5d5c");
    fill(g, x + 5, y + 5, w - 10, h - 11, selfServe ? "#b57b4f" : "#7e9494");
    fill(g, x + 8, y + 9, w - 16, Math.max(9, h - 26), "#f4e6ca");
    const trayWidth = Math.max(13, Math.min(29, (w - 25) / Math.max(1, Math.floor(w / 28))));
    for (let px = x + 12; px + trayWidth < x + w - 6; px += trayWidth + 4) {
      fill(g, px, y + 13, trayWidth, 13, "#536b6a");
      fill(g, px + 2, y + 15, trayWidth - 4, 9, selfServe ? ["#c78356", "#66885a", "#dfad5a"][Math.floor(px / 19) % 3] : "#f9f8e7");
      if (!selfServe) fill(g, px + 5, y + 17, 4, 4, "#d7ddd1");
    }
    fill(g, x + 6, y + h - 12, w - 12, 6, "#af7756");
    fixtureLabel(g, item.label || (selfServe ? "自选菜" : "取餐具"), x + w / 2, y + h - 18, w);
  }
  function drawFixture(g, item) {
    const { x, y, w, h } = item.bounds;
    const kind = item.kind;
    if (["table", "round_table", "hotpot_table"].includes(kind)) {
      drawTable(g, item);
    } else if (["plant", "round_planter", "divider", "green_divider"].includes(kind)) {
      if (kind === "round_planter") {
        fill(g, x + 4, y + h - 14, w - 8, 12, "#52636a");
        fill(g, x + 1, y + h - 18, w - 2, 11, "#889899");
      }
      drawPlant(g, item);
    } else if (kind === "column") {
      fill(g, x + 5, y + 7, w - 1, h - 4, "rgba(48,61,64,.24)");
      fill(g, x + 1, y + 2, w - 2, h - 6, "#52656a");
      fill(g, x + 4, y + 5, w - 8, h - 11, "#9caeac");
      fill(g, x + 7, y + 8, Math.max(4, w - 15), h - 17, "#d7d9c9");
      fill(g, x, y, w, 9, "#38525e");
      fill(g, x + 3, y + 2, w - 6, 5, "#e4e3d4");
      fill(g, x + 2, y + h - 8, w - 4, 8, "#40565b");
    } else if (kind === "cutlery_station" || kind === "bowl_station") {
      drawCounter(g, item, false);
    } else if (["self_service_counter", "self_select_counter", "buffet_counter", "self_serve_counter"].includes(kind)) {
      drawCounter(g, item, true);
    } else if (kind === "bar_table") {
      fill(g, x + 3, y + 4, w - 6, h - 8, "#765642");
      fill(g, x + 6, y + 6, w - 12, h - 13, "#e0b176");
      const vertical = h > w;
      for (let n = vertical ? y + 13 : x + 13; n < (vertical ? y + h - 12 : x + w - 12); n += 26) {
        if (vertical) drawChair(g, item.facing === "west" ? x - 2 : x + w - 10, n, true);
        else drawChair(g, n, item.facing === "north" ? y - 3 : y + h - 11);
      }
    } else if (kind === "opinion_desk") {
      fill(g, x + 3, y + 6, w - 6, h - 9, "#6f5848");
      fill(g, x + 6, y + 8, w - 12, h - 19, "#dbb184");
      fill(g, x + 13, y + 15, 19, 14, "#fff7df");
      fill(g, x + 17, y + 19, 11, 2, "#7a9aa5");
      fill(g, x + 17, y + 24, 8, 2, "#7a9aa5");
      fixtureLabel(g, item.label || "意见台", x + w / 2, y + h - 9, w);
    } else if (kind === "queue" || kind === "queue_area") {
      fill(g, x, y + 5, w, Math.max(4, h - 10), "rgba(233,172,123,.19)");
      for (let px = x + 7; px < x + w - 4; px += 44) {
        fill(g, px + 2, y + h - 8, 10, 4, "#596469");
        fill(g, px + 5, y + 3, 4, h - 9, "#77766d");
        fill(g, px + 4, y + 1, 6, 5, "#c4a574");
      }
      fill(g, x + 12, y + 9, Math.max(0, w - 20), 3, "#c87061");
    } else if (kind === "booth_area") {
      fill(g, x + 1, y + 1, w - 2, h - 2, "#836e58");
      fill(g, x + 5, y + 5, w - 10, h - 10, "#d6b38a");
      for (let py = y + 10; py < y + h - 34; py += 65) {
        fill(g, x + 7, py, w - 14, 13, "#44665d");
        fill(g, x + 12, py + 2, w - 24, 8, "#759580");
        fill(g, x + 15, py + 18, w - 30, 25, "#785b42");
        fill(g, x + 18, py + 21, w - 36, 18, "#e8bf88");
        fill(g, x + 7, py + 47, w - 14, 13, "#44665d");
        fill(g, x + 12, py + 49, w - 24, 8, "#759580");
      }
    } else if (kind === "screen") {
      fill(g, x + 4, y + 5, w - 1, h - 1, "rgba(32,53,59,.26)");
      fill(g, x, y, w, h - 7, "#243a45");
      fill(g, x + 3, y + 3, w - 6, h - 13, "#7ca4a7");
      fill(g, x + 6, y + 6, w - 12, 4, "#c5e0d9");
      fill(g, x + w / 2 - 2, y + h - 7, 4, 7, "#485e62");
    } else if (kind === "window_wall") {
      fill(g, x, y, w, h, "#4b6675");
      fill(g, x + 3, y + 3, w - 6, h - 6, "#8db6bf");
      for (let px = x + 4; px < x + w - 2; px += 51) {
        fill(g, px, y + 2, 4, h - 4, "#d8ddcf");
        fill(g, px + 7, y + 8, Math.min(29, x + w - px - 10), 3, "#b8d4ca");
      }
    } else if (kind === "side_door") {
      fill(g, x, y, w, h, "#405762");
      fill(g, x + 3, y + 3, w - 6, h - 6, "#9ab6b5");
      fill(g, x + w / 2 - 2, y + 2, 4, h - 4, "#3d5864");
      fill(g, x + 6, y + 8, Math.max(2, w / 2 - 11), Math.max(2, h - 17), "#c4d8cf");
      fill(g, x + w / 2 + 5, y + 8, Math.max(2, w / 2 - 11), Math.max(2, h - 17), "#c4d8cf");
    } else if (kind === "elevator") {
      fill(g, x + 2, y + 3, w - 4, h - 2, "#263e4c");
      fill(g, x + 9, y + 13, w - 18, h - 23, "#6e8b95");
      fill(g, x + 14, y + 18, w - 28, h - 34, "#9eacaa");
      fill(g, x + Math.floor(w / 2) - 2, y + 19, 4, h - 37, "#4d6b78");
      fill(g, x + 12, y + 7, w - 24, 13, "#d2a568");
      fixtureLabel(g, "电梯", x + w / 2, y + 18, w);
    } else {
      fill(g, x, y, w, h, "#5d7274");
      fill(g, x + 3, y + 3, Math.max(1, w - 6), Math.max(1, h - 6), "#82978f");
      fixtureLabel(g, item.label, x + w / 2, y + h / 2 + 4, w);
    }
  }

  class CanteenMap {
    constructor(canvas, onSelect) {
      this.canvas = canvas; this.g = canvas.getContext("2d"); this.onSelect = onSelect;
      this.floor = null; this.layout = null; this.ratings = {}; this.selectedId = null; this.nearId = null;
      this.emotion = "neutral"; this.keys = new Set(); this.zoom = 1; this.cam = { x: 0, y: 0 };
      this.spriteCache = new Map(); this.speech = null; this.illustration = null;
      this.player = { x: W / 2, y: H - 70, dir: "up", walk: 0, moving: false };
      this.lastTime = 0;
      this.pixelRatio = Math.min(3, Math.max(2, window.devicePixelRatio || 1));
      canvas.width = Math.round(W * this.pixelRatio);
      canvas.height = Math.round(H * this.pixelRatio);
      canvas.addEventListener("click", event => {
        canvas.focus();
        const p = this.worldPoint(event);
        const hit = this.layout && this.layout.stalls.find(item => this.inside(p.x, p.y, item.bounds));
        if (hit) this.onSelect(hit.zone.id);
      });
    }
    inside(x, y, b) { return x >= b.x && x < b.x + b.w && y >= b.y && y < b.y + b.h; }
    worldPoint(event) {
      const b = this.canvas.getBoundingClientRect();
      return { x: (event.clientX - b.left) * W / b.width / this.zoom + this.cam.x,
        y: (event.clientY - b.top) * H / b.height / this.zoom + this.cam.y };
    }
    setFloor(floor) {
      this.floor = floor;
      this.illustration = null;
      this.canvas.classList.toggle("illustrated-map", Boolean(floor.plan && floor.plan.illustration));
      if (floor.plan && floor.plan.illustration) {
        const image = new Image();
        image.onload = () => { if (this.floor === floor) this.draw(0); };
        image.src = floor.plan.illustration;
        this.illustration = image;
      }
      const hasPlan = Boolean(floor.plan && ["approximate", "verified"].includes(floor.plan.status));
      const stalls = (hasPlan ? floor.stalls : []).filter(z => Array.isArray(z.rect)).map(zone => ({
        zone, bounds: gridRect(zone.rect), front: zone.front || "south"
      }));
      const entrance = floor.plan && floor.plan.entrance || [16, 18];
      this.layout = { stalls, fixtures: hasPlan ? fixturesFor(floor) : [], hasPlan,
        entrance: { x: entrance[0] * CELL + 15, y: entrance[1] * CELL + 15 } };
      this.player.x = clamp(this.layout.entrance.x, 38, W - 38);
      this.player.y = clamp(this.layout.entrance.y - 25, 38, H - 38);
      this.layout.stalls.forEach(item => { item.service = this.findServicePoint(item); });
      this.player.dir = "up"; this.player.walk = 0; this.player.moving = false;
      this.selectedId = null; this.nearId = null; this.speech = null; this.keys.clear(); this.lastTime = 0;
      this.updateCamera(); this.draw(0);
    }
    setControl(dir, active) { if (active) this.keys.add(dir); else this.keys.delete(dir); }
    clearControls() { this.keys.clear(); this.player.moving = false; }
    nudge(dir) {
      const d = { left: [-23,0], right: [23,0], up: [0,-23], down: [0,23] }[dir];
      if (!d || !this.floor) return;
      this.player.dir = dir; this.applyMovement(...d); this.updateCamera();
      this.nearId = this.nearestWindow(); this.draw(0);
    }
    setZoom(value) {
      this.zoom = clamp(Math.round(value * 4) / 4, 1, 2.5);
      this.updateCamera(); this.draw(0);
      return this.zoom;
    }
    updateCamera() {
      const vw = W / this.zoom, vh = H / this.zoom;
      this.cam.x = clamp(this.player.x - vw / 2, 0, Math.max(0, W - vw));
      this.cam.y = clamp(this.player.y - vh * 0.62, 0, Math.max(0, H - vh));
    }
    blocked(x, y) {
      const b = { x: x - 8, y: y - 4, w: 16, h: 8 };
      if (b.x < 27 || b.y < 27 || b.x + b.w > W - 27 || b.y + b.h > H - 25) return true;
      const passable = new Set(["queue", "queue_area", "window_wall", "side_door", "entrance", "walkway", "floor_marking"]);
      const solids = [...this.layout.stalls.map(s => s.bounds),
        ...this.layout.fixtures.filter(s => s.solid === true || (s.solid !== false && !passable.has(s.kind))).map(s => s.bounds)];
      return solids.some(s => b.x < s.x + s.w && b.x + b.w > s.x && b.y < s.y + s.h && b.y + b.h > s.y);
    }
    applyMovement(dx, dy) {
      const p = this.player, oldX = p.x, oldY = p.y;
      const nx = clamp(p.x + dx, 27, W - 27), ny = clamp(p.y + dy, 27, H - 25);
      if (!this.blocked(nx, p.y)) p.x = nx;
      if (!this.blocked(p.x, ny)) p.y = ny;
      const distance = Math.hypot(p.x - oldX, p.y - oldY);
      p.walk += distance; p.moving = distance > .05;
      return distance > .05;
    }
    tick(now, reducedMotion = false) {
      if (!this.floor) return false;
      const dt = this.lastTime ? Math.min(.05, Math.max(0, (now - this.lastTime) / 1000)) : 0;
      this.lastTime = now;
      let dx = Number(this.keys.has("right")) - Number(this.keys.has("left"));
      let dy = Number(this.keys.has("down")) - Number(this.keys.has("up"));
      if (!dx && !dy) {
        const changed = this.player.moving; this.player.moving = false; this.player.walk = 0; return changed;
      }
      const len = Math.hypot(dx, dy); dx /= len; dy /= len;
      const oldDir = this.player.dir;
      this.player.dir = Math.abs(dx) >= Math.abs(dy) ? dx < 0 ? "left" : "right" : dy < 0 ? "up" : "down";
      const moved = this.applyMovement(dx * 125 * dt, dy * 125 * dt);
      this.updateCamera();
      const near = this.nearestWindow(), changed = near !== this.nearId;
      this.nearId = near;
      if (reducedMotion) this.player.walk = 0;
      return moved || changed || this.player.dir !== oldDir;
    }
    rawServicePoint(item) {
      const { x, y, w, h } = item.bounds;
      if (item.front === "east") return { x: x + w + 23, y: y + h / 2 };
      if (item.front === "west") return { x: x - 23, y: y + h / 2 };
      if (item.front === "north") return { x: x + w / 2, y: y - 23 };
      return { x: x + w / 2, y: y + h + 23 };
    }
    findServicePoint(item) {
      const wanted = this.rawServicePoint(item);
      if (!this.blocked(wanted.x, wanted.y)) return wanted;
      let best = null, bestCost = Infinity;
      for (let radius = 12; radius <= 120; radius += 12) {
        for (let step = 0; step < 24; step++) {
          const angle = step * Math.PI / 12;
          const x = Math.round(wanted.x + Math.cos(angle) * radius);
          const y = Math.round(wanted.y + Math.sin(angle) * radius);
          if (this.blocked(x, y)) continue;
          const b = item.bounds;
          const closestX = clamp(x, b.x, b.x + b.w);
          const closestY = clamp(y, b.y, b.y + b.h);
          const edgeDistance = Math.hypot(x - closestX, y - closestY);
          if (edgeDistance > 82) continue;
          const cost = Math.hypot(x - wanted.x, y - wanted.y) + edgeDistance * .1;
          if (cost < bestCost) { bestCost = cost; best = { x, y }; }
        }
        if (best) break;
      }
      return best || wanted;
    }
    servicePoint(item) { return item.service || this.rawServicePoint(item); }
    nearestWindow() {
      if (!this.layout) return null;
      let id = null, best = 74;
      for (const item of this.layout.stalls) {
        const p = this.servicePoint(item), d = Math.hypot(p.x - this.player.x, p.y - this.player.y);
        if (d < best) { id = item.zone.id; best = d; }
      }
      return id;
    }
    interact() { const id = this.nearId || this.nearestWindow(); if (id) this.onSelect(id); return !!id; }
    statusText() {
      if (!this.floor) return "";
      if (!this.layout.stalls.length) return "这一层暂无可定位窗口；资料线索在下方。";
      const near = this.layout.stalls.find(s => s.zone.id === this.nearId);
      return near ? "已走近「" + near.zone.name + "」· 按 E 查看详情" :
        "方向键 / WASD 控制阿姨 · 走近档口按 E 查看";
    }
    setRatings(v) { this.ratings = v || {}; this.draw(0); }
    setSelected(id) { this.selectedId = id; this.draw(0); }
    setEmotion(v) { this.emotion = v; this.draw(0); }
    sayAtStall(id, message) {
      if (!this.layout || !this.layout.stalls.some(item => item.zone.id === id)) return;
      this.speech = { id, text: String(message || "孩子，想问什么？"), until: performance.now() + 4800 };
      this.draw(0);
    }
    sprite(dir, mode, phase, emotion) {
      const frame = phase % (mode === "walk" ? 4 : 2);
      const key = [dir, mode, frame, emotion].join("|");
      if (!this.spriteCache.has(key)) this.spriteCache.set(key, window.AuntSprite.buildSprite(dir, mode, frame, emotion));
      return this.spriteCache.get(key);
    }
    drawStall(g, item, phase) {
      const { zone, bounds: b, front } = item, { x, y, w, h } = b;
      const r = this.ratings[zone.id], score = r && r.score;
      const activeSpeech = this.speech && this.speech.id === zone.id && performance.now() < this.speech.until;
      const engaged = this.nearId === zone.id || activeSpeech;
      const narrow = w < 90, side = front === "east" || front === "west";
      const selfServe = /自选|自由选/.test(zone.name);
      const sign = stallSign(zone.name, w);
      const signHeight = sign.lines.length > 1 ? 39 : 28;
      fill(g, x + 4, y + 7, w - 2, h - 3, "rgba(32,52,60,.27)");
      fill(g, x + 1, y + 1, w - 2, h - 2, "#254657");
      fill(g, x + 5, y + 5, w - 10, h - 10, tint(score));
      fill(g, x + 9, y + signHeight + 5, w - 18, Math.max(9, h - signHeight - 20), "rgba(255,248,223,.22)");
      if (side) {
        const shelfX = front === "east" ? x + w - 22 : x + 5;
        fill(g, shelfX, y + signHeight + 2, 17, Math.max(8, h - signHeight - 8), "#6d4d3b");
        fill(g, shelfX + 2, y + signHeight + 3, 13, Math.max(6, h - signHeight - 13), "#d2a46d");
        for (let py = y + signHeight + 7; py < y + h - 11; py += 16) {
          fill(g, shelfX + 2, py, 13, 11, "#405b60");
          fill(g, shelfX + 4, py + 2, 9, 7, selfServe ? ["#cf724f", "#83a469", "#e8ba5d"][Math.floor(py / 16) % 3] : "#ebcb86");
        }
      } else {
        fill(g, x + 8, y + signHeight + 9, w - 16, 3, "#7d8c84");
        for (let sx = x + 9; sx < x + w - 9; sx += 19) {
          fill(g, sx, y + signHeight + 15, Math.min(8, x + w - 9 - sx), 5,
            selfServe ? ["#d66e4d", "#80a16c", "#e2b356"][Math.floor(sx / 19) % 3] : "#dcbd84");
          if (sx + 4 < x + w - 10) fill(g, sx + 3, y + signHeight + 19, 4, 2, "#8e765e");
        }
      }
      const sideFeet = y + (h >= 130 ? h / 2 + 24 : h - 6);
      const npc = front === "east" ? { x: x + w - 31, y: sideFeet, dir: "right" } :
        front === "west" ? { x: x + 31, y: sideFeet, dir: "left" } :
        { x: narrow ? x + w / 2 : x + w - 23, y: y + h - 6, dir: front === "north" ? "up" : "down" };
      if (engaged) {
        const deltaX = this.player.x - npc.x, deltaY = this.player.y - npc.y;
        npc.dir = Math.abs(deltaX) > Math.abs(deltaY) ? deltaX < 0 ? "left" : "right" :
          deltaY < 0 ? "up" : "down";
      }
      item.npc = npc;
      if (window.AuntSprite) {
        const sprite = this.sprite(npc.dir, activeSpeech ? "talk" : "idle", phase, engaged ? "happy" : "neutral");
        g.drawImage(sprite, npc.x - 17, npc.y - 56, 34, 56);
      }
      if (!side) {
        fill(g, x + 5, y + h - 15, w - 10, 13, "#6d4d3b");
        fill(g, x + 7, y + h - 15, w - 14, 4, "#d2a46d");
        for (let sx = x + 13; sx < x + w - 11; sx += 27) fill(g, sx, y + h - 9, 11, 3, "#a37450");
      }
      fill(g, x + 4, y + 4, w - 8, signHeight, "#28495d");
      fill(g, x + 7, y + signHeight + 2, w - 14, 3, "#ddbd7a");
      for (let sx = x + 7; sx < x + w - 8; sx += 15) fill(g, sx, y + signHeight + 3, 7, 5, "#f0dfb6");
      fill(g, x + 6, y + 6, 3, 3, "#eacb8f"); fill(g, x + w - 9, y + 6, 3, 3, "#eacb8f");
      g.textAlign = "center"; g.fillStyle = "#fff5dc";
      g.font = "bold " + sign.size + "px 'Microsoft YaHei',sans-serif";
      sign.lines.forEach((line, index) => g.fillText(line, x + w / 2,
        y + (sign.lines.length > 1 ? 19 + index * 16 : 24), w - 12));
      if (score == null) { g.setLineDash([4,3]); g.strokeStyle = "#edf1e7"; g.lineWidth = 2;
        g.strokeRect(x + 2, y + 2, w - 4, h - 4); g.setLineDash([]); }
      if (this.selectedId === zone.id || this.nearId === zone.id) {
        g.strokeStyle = this.selectedId === zone.id ? "#e7a55f" : "#f2d984";
        g.lineWidth = 4; g.strokeRect(x - 2, y - 2, w + 4, h + 4);
      }
    }
    drawIllustratedStall(g, item, phase) {
      const { zone, bounds: b, front } = item;
      const selected = this.selectedId === zone.id;
      const near = this.nearId === zone.id;
      const activeSpeech = this.speech && this.speech.id === zone.id && performance.now() < this.speech.until;
      const showLabels = this.floor.plan.sourceId === "P5";
      if (showLabels && b.y < 100) {
        g.textAlign = "center";
        g.lineWidth = 3;
        g.strokeStyle = "rgba(38,30,27,.75)";
        g.fillStyle = "#fffaf0";
        g.font = "bold 14px 'Microsoft YaHei',sans-serif";
        g.strokeText(zone.name, b.x + b.w / 2, 29, b.w - 7);
        g.fillText(zone.name, b.x + b.w / 2, 29, b.w - 7);
      } else if (showLabels && zone.id === "xh-1-dessert") {
        g.textAlign = "center"; g.font = "bold 15px 'Microsoft YaHei',sans-serif";
        g.lineWidth = 3; g.strokeStyle = "#713850"; g.fillStyle = "#fff9ee";
        g.strokeText(zone.name, b.x + b.w / 2, b.y + 27, b.w - 12);
        g.fillText(zone.name, b.x + b.w / 2, b.y + 27, b.w - 12);
      }
      let npc;
      if (front === "east") npc = { x: b.x + b.w - 12, y: b.y + b.h - 4, dir: "right" };
      else if (front === "west") npc = { x: b.x + 12, y: b.y + b.h - 4, dir: "left" };
      else if (front === "north") npc = { x: b.x + b.w / 2, y: b.y + 8, dir: "up" };
      else npc = { x: b.x + b.w / 2, y: b.y + b.h - 4, dir: "down" };
      if (near || activeSpeech) {
        const dx = this.player.x - npc.x, dy = this.player.y - npc.y;
        npc.dir = Math.abs(dx) > Math.abs(dy) ? dx < 0 ? "left" : "right" : dy < 0 ? "up" : "down";
      }
      item.npc = npc;
      if (window.AuntSprite) {
        const sprite = this.sprite(npc.dir, activeSpeech ? "talk" : "idle", phase, near ? "happy" : "neutral");
        g.drawImage(sprite, npc.x - 13, npc.y - 41, 26, 43);
      }
      if (selected || near) {
        g.strokeStyle = selected ? "#ef873e" : "#f7d071";
        g.lineWidth = selected ? 4 : 2;
        g.strokeRect(b.x + 2, b.y + 2, b.w - 4, b.h - 4);
      }
    }
    draw(phase = 0, mode = "idle") {
      if (!this.floor) return;
      const g = this.g;
      g.setTransform(this.pixelRatio, 0, 0, this.pixelRatio, 0, 0);
      g.clearRect(0, 0, W, H);
      g.imageSmoothingEnabled = Boolean(this.illustration);
      g.save(); g.scale(this.zoom, this.zoom); g.translate(-this.cam.x, -this.cam.y);
      if (this.illustration && !this.illustration.naturalWidth) {
        fill(g, 0, 0, W, H, "#f6f0e5");
        g.fillStyle = "#456273";
        g.font = "bold 23px 'Microsoft YaHei',sans-serif";
        g.textAlign = "center";
        g.fillText("正在加载高清平面图…", W / 2, H / 2);
        g.restore();
        return;
      }
      if (this.illustration && this.illustration.complete && this.illustration.naturalWidth) {
        g.drawImage(this.illustration, 0, 70, this.illustration.naturalWidth, 970, 0, 0, W, H);
      } else g.drawImage(background(this.floor, this.layout), 0, 0);
      const renderables = [
        ...this.layout.fixtures.map(item => ({ y: item.bounds.y + item.bounds.h, order: 1, draw: () => { if (!this.illustration) drawFixture(g, item); } })),
        ...this.layout.stalls.map(item => ({ y: item.bounds.y + item.bounds.h, order: 2,
          draw: () => this.illustration ? this.drawIllustratedStall(g, item, phase) : this.drawStall(g, item, phase) }))
      ];
      const p = this.player;
      renderables.push({ y: p.y, order: 3, draw: () => {
        fill(g, p.x - 17, p.y + 1, 34, 6, "rgba(30,50,58,.26)");
        if (window.AuntSprite) {
          const step = Math.floor(p.walk / 13) % 4;
          const sprite = this.sprite(p.dir, p.moving ? "walk" : mode === "talk" ? "talk" : "idle",
            p.moving ? step : phase, this.emotion);
          g.drawImage(sprite, Math.round(p.x - 17), Math.round(p.y - 56), 34, 56);
        }
        g.font = "bold 14px 'Microsoft YaHei',sans-serif"; g.textAlign = "center"; g.lineWidth = 3;
        g.strokeStyle = "#264957"; g.fillStyle = "#fff2c3";
        g.strokeText("可操控阿姨", p.x, p.y - 62); g.fillText("可操控阿姨", p.x, p.y - 62);
      } });
      renderables.sort((a, b) => a.y - b.y || a.order - b.order);
      renderables.forEach(item => item.draw());
      if (!this.layout.stalls.length) {
        fill(g, 236, 206, 488, 116, "#29485b");
        fill(g, 242, 212, 476, 104, "#fff4d8");
        g.textAlign = "center"; g.fillStyle = "#284b62"; g.font = "bold 23px 'Microsoft YaHei',sans-serif";
        g.fillText("这一层还没有可定位的窗口", W / 2, 256);
        g.font = "14px 'Microsoft YaHei',sans-serif";
        g.fillText("不绘制未经核实的档口和桌椅；可展开下方资料线索", W / 2, 287);
      }
      if (this.speech && performance.now() < this.speech.until) {
        const item = this.layout.stalls.find(entry => entry.zone.id === this.speech.id);
        if (item && item.npc) {
          const line = this.speech.text.replace(/\s+/g, " ").slice(0, 14);
          const bubbleX = clamp(item.npc.x - 73, 28, W - 174);
          const bubbleY = clamp(item.npc.y - 92, 31, H - 76);
          fill(g, bubbleX + 3, bubbleY + 4, 146, 36, "rgba(38,63,77,.35)");
          fill(g, bubbleX, bubbleY, 146, 36, "#fff5d7");
          fill(g, bubbleX + 70, bubbleY + 35, 11, 7, "#fff5d7");
          g.strokeStyle = "#9a7654"; g.lineWidth = 2; g.strokeRect(bubbleX + 1, bubbleY + 1, 144, 34);
          g.textAlign = "center"; g.fillStyle = "#28485b"; g.font = "bold 14px 'Microsoft YaHei',sans-serif";
          g.fillText(line + (this.speech.text.length > 14 ? "…" : ""), bubbleX + 73, bubbleY + 24, 134);
        }
      }
      g.restore();
    }
  }
  window.CanteenMap = CanteenMap;
})();
