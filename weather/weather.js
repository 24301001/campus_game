/* =========================================================
   weather/weather.js —— 像素校园 · 天气与季节模块
   ---------------------------------------------------------
   零依赖、零构建、单文件；地图只通过 window.CampusWeather 这一层接口调用本模块，
   本模块不引用地图里的任何全局变量（要用的数据一律由 CampusWeather.attach(ctx) 传进来）。
   完整接口说明见同目录 README.md。

   模块分两层：
     · 烘焙层（只在地图启动时生效一次）：草地色阶、树下落叶色阶 —— 换季要重开页面。
     · 运行层（每帧生效，可即时切换）：树冠换色、粒子、地面积雪/落叶/湿路、
       雾、整体调色、路灯光晕 —— 点面板上的季节按钮就能看到渐变。
   ========================================================= */
(function (global) {
  "use strict";

  /* --- 0. 小工具 --------------------------------------------------- */
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function hex2rgb(h) {
    const n = parseInt(h.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function rgb2hex(r, g, b) {
    return "#" + ((1 << 24) + (Math.round(clamp(r, 0, 255)) << 16) +
      (Math.round(clamp(g, 0, 255)) << 8) + Math.round(clamp(b, 0, 255))).toString(16).slice(1);
  }
  /* 世界坐标哈希：地面积雪 / 落叶的"哪一格有东西"必须每帧稳定，
     否则相机一动整片地面就闪烁。同一个 (x,y) 永远得同一个 0..1。 */
  function wh2(x, y) {
    let h = (x | 0) * 374761393 + (y | 0) * 668265263;
    h = (h ^ (h >> 13)) * 1274126177;
    return ((h ^ (h >> 16)) >>> 0) / 4294967295;
  }
  function rgb2hsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
    let h = 0;
    if (d) {
      if (mx === r) h = ((g - b) / d + (g < b ? 6 : 0));
      else if (mx === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h *= 60;
    }
    const l = (mx + mn) / 2;
    const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
    return [h, s, l];
  }
  function hsl2rgb(h, s, l) {
    h = ((h % 360) + 360) % 360;
    const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = l - c / 2;
    let r = 0, g = 0, b = 0;
    if (h < 60) { r = c; g = x; } else if (h < 120) { r = x; g = c; }
    else if (h < 180) { g = c; b = x; } else if (h < 240) { g = x; b = c; }
    else if (h < 300) { r = x; b = c; } else { r = c; b = x; }
    return [(r + m) * 255, (g + m) * 255, (b + m) * 255];
  }

  /* --- 1. 季节配置 ---------------------------------------------------
   grass   : 草地五档色阶（烘焙层，换季需重载页面才生效）
   litter  : 树下落叶 / 落花色阶（同上）
   canopy  : 树冠换色参数（运行层）
             hue  = 绿色往哪个色相拉（0 表示不拉）
             sat/val = 饱和度、明度倍率
             thin = 掉叶比例（0 全留，1 掉光）
             snow = 枝头积雪强度
   cover   : 地面覆盖层类型
   tint    : 全屏调色（乘色 + 叠加），秋冬偏暖金、冬偏冷白、春偏嫩
   --------------------------------------------------------------------- */
  const SEASONS = {
    spring: {
      label: "春", grass: ["#4b8a3a", "#569643", "#61a34c", "#6cae56", "#78ba61"],
      litter: { leaf: ["#7fb055", "#9cc36a", "#c8d76a", "#8fae55", "#6f9a44"], blossom: ["#f6dbe4", "#eec6d4", "#e0aebb", "#cf93ab"] },
      canopy: { hue: -6, sat: 1.06, val: 1.06, thin: 0.05, snow: 0, gold: 86 },
      cover: { kind: "blossom", density: 0.30 },
      tint: { mul: [252, 250, 244], add: [18, 26, 10, 0.10] }, lamps: 0.10
    },
    summer: {
      label: "夏", grass: ["#3f7630", "#488237", "#518d3e", "#599846", "#64a54f"],
      litter: { leaf: ["#7f9a44", "#93a855", "#a8b86a", "#6f8a3c"], blossom: ["#e9d3da", "#dcc0cc"] },
      canopy: { hue: 4, sat: 1.12, val: 1.00, thin: 0, snow: 0, gold: 96 },
      cover: { kind: "none", density: 0 },
      tint: { mul: [246, 250, 236], add: [26, 30, 6, 0.08] }, lamps: 0.05
    },
    autumn: {
      label: "秋", grass: ["#5a7a34", "#67853b", "#748f43", "#81984b", "#8ea254"],
      litter: { leaf: ["#c8a03c", "#d8b24a", "#b8792c", "#96602a", "#e0c25e"], blossom: ["#d8b24a", "#c8a03c"] },
      canopy: { hue: -46, sat: 1.18, val: 1.06, thin: 0.30, snow: 0, gold: 46 },
      cover: { kind: "leaf", density: 0.62 },
      tint: { mul: [255, 244, 214], add: [40, 22, -14, 0.14] }, lamps: 0.35
    },
    winter: {
      label: "冬", grass: ["#5c6b52", "#66755c", "#707f66", "#7a8970", "#85947b"],
      litter: { leaf: ["#8a8f86", "#9aa096", "#7a7f76", "#6a6f66"], blossom: ["#c9d2d6", "#b6c0c6"] },
      canopy: { hue: -18, sat: 0.34, val: 0.82, thin: 0.72, snow: 0, gold: 40 },
      /* 冬天地面本来不铺雪：雪是天气，只有真下雪（w.part === "snow"）才画。 */
      cover: { kind: "none", density: 0 },
      tint: { mul: [232, 240, 250], add: [8, 14, 30, 0.16] }, lamps: 0.75
    }
  };
  const SEASON_ORDER = ["spring", "summer", "autumn", "winter"];
  /* 物种修正：针叶不落叶、色相基本不动；银杏掉得最狠；白杨/柳比阔叶秃得快一点。 */
  const SP_THIN_MUL = { conifer: 0, ginkgo: 1.25, blossom: 0.9, poplar: 1.1, willow: 1.1 };
  const SP_HUE_MUL = { conifer: 0.25, blossom: 0.35, poplar: 0.9, willow: 0.9 };

  /* --- 2. 天气配置 ---------------------------------------------------
   part  : 粒子种类  rain|snow|leaf|petal|none
   count : 每 100 万屏幕像素的粒子预算（按视口面积自适应）
   expo  : 亮度倍率；amb  : 环境色叠加（不透明度由 intensity 缩放）
   wet   : 路面湿滑反光；fog : 雾；gust : 水平风（世界像素/秒）
   --------------------------------------------------------------------- */
  const WEATHERS = {
    clear: { label: "晴", part: "none", count: 0, expo: 1.00, amb: [0, 0, 0, 0], wet: 0, fog: 0, gust: 6, cloud: 0 },
    cloudy: { label: "多云", part: "none", count: 0, expo: 0.92, amb: [40, 46, 58, 0.16], wet: 0.05, fog: 0.06, gust: 14, cloud: 0.55 },
    overcast: { label: "阴", part: "none", count: 0, expo: 0.82, amb: [58, 66, 80, 0.26], wet: 0.22, fog: 0.14, gust: 18, cloud: 0.9 },
    rain: { label: "雨", part: "rain", count: 420, expo: 0.74, amb: [52, 66, 84, 0.34], wet: 0.9, fog: 0.22, gust: 26, cloud: 1 },
    storm: { label: "雷雨", part: "rain", count: 640, expo: 0.62, amb: [38, 48, 66, 0.46], wet: 1, fog: 0.30, gust: 62, cloud: 1, bolt: 1 },
    snow: { label: "雪", part: "snow", count: 260, expo: 0.95, amb: [120, 138, 160, 0.20], wet: 0.15, fog: 0.24, gust: 12, cloud: 0.8 },
    fog: { label: "雾", part: "none", count: 0, expo: 0.88, amb: [150, 158, 162, 0.30], wet: 0.25, fog: 0.85, gust: 4, cloud: 0.7 },
    wind: { label: "大风", part: "leaf", count: 120, expo: 0.97, amb: [30, 26, 14, 0.08], wet: 0, fog: 0.04, gust: 120, cloud: 0.4 }
  };
  const WEATHER_ORDER = ["clear", "cloudy", "overcast", "rain", "storm", "snow", "fog", "wind"];

  /* --- 3. 状态 ------------------------------------------------------- */
  const S = {
    season: "autumn", weather: "clear", intensity: 1,
    fromSeason: null, fromWeather: null, mix: 1,      // 过渡：mix 0→1
    autoSeason: true, autoWeather: false,
    t: 0, lastStepSeason: null, particles: [], flash: 0, nextBolt: 3
  };
  const listeners = [];
  const STORE_KEY = "campus.weather.v1";

  function seasonCfg(name) { return SEASONS[name] || SEASONS.autumn; }
  function weatherCfg(name) { return WEATHERS[name] || WEATHERS.clear; }
  /* 过渡期间把两套配置线性混合，界面看到的是"渐变"而不是"啪一下换天"。 */
  function mixCfg(a, b, t, keys) {
    const o = {};
    for (const k of keys) {
      const va = a[k], vb = b[k];
      o[k] = typeof va === "number" ? lerp(va, vb, t)
        : Array.isArray(va) ? va.map((v, i) => lerp(v, vb[i], t)) : (t < 0.5 ? va : vb);
    }
    return o;
  }
  function curSeason() {
    if (S.mix >= 1 || !S.fromSeason) return seasonCfg(S.season);
    const a = seasonCfg(S.fromSeason), b = seasonCfg(S.season), t = S.mix;
    return {
      label: (t < 0.5 ? a.label : b.label),
      canopy: mixCfg(a.canopy, b.canopy, t, ["hue", "sat", "val", "thin", "snow", "gold"]),
      cover: { kind: t < 0.5 ? a.cover.kind : b.cover.kind, density: lerp(a.cover.density, b.cover.density, t) },
      tint: { mul: mixCfg({ m: a.tint.mul }, { m: b.tint.mul }, t, ["m"]).m, add: mixCfg({ a: a.tint.add }, { a: b.tint.add }, t, ["a"]).a },
      lamps: lerp(a.lamps, b.lamps, t)
    };
  }
  function curWeather() {
    if (S.mix >= 1 || !S.fromWeather) return weatherCfg(S.weather);
    const a = weatherCfg(S.fromWeather), b = weatherCfg(S.weather), t = S.mix;
    const o = {};
    for (const k of ["expo", "wet", "fog", "gust", "cloud", "bolt"]) o[k] = lerp(a[k] || 0, b[k] || 0, t);
    o.amb = mixCfg({ a: a.amb }, { a: b.amb }, t, ["a"]).a;
    o.part = t < 0.5 ? a.part : b.part;
    o.count = lerp(a.count, b.count, t);
    return o;
  }

  /* --- 4. 与地图之间的数据缝 ----------------------------------------- */
  const MAP = { props: [], cellAt: null, K: null, WORLD_W: 0, WORLD_H: 0, CELL: 16, view: null };
  let treeList = [];                     // props 里 tag==='tree' 的那批（换季重着色用）
  let lampList = [];                     // 32×84 的路灯（雨夜光晕用）

  function attach(ctx) {
    if (!ctx) return;
    MAP.props = ctx.props || [];
    MAP.cellAt = ctx.cellAt || null;
    MAP.K = ctx.K || null;
    MAP.WORLD_W = ctx.WORLD_W || 0;
    MAP.WORLD_H = ctx.WORLD_H || 0;
    MAP.CELL = ctx.CELL || 16;
    MAP.view = ctx.view || null;
    treeList = []; lampList = [];
    for (const p of MAP.props) {
      /* 认树靠 sp（物种记号），不能只认 tag === "tree"：地图里除了散点树还有
         tag === "lawnTree" 的草坪树，只认一个 tag 的话这批树整年不換色，
         银杏大道里被换成银杏的草坪树就永远停在烘焙出来的金色上。
         没有 sp 的老道具仍按 tag === "tree" 收（默认当阔叶处理）。 */
      if (p.sp || p.tag === "tree") treeList.push(p);
      else if (p.img && p.img.width === 32 && p.img.height === 84) lampList.push(p);
    }
    applyCanopies(1);                     // 立刻按当前季节上一遍色（启动时就是秋天）
    emit();
  }

  /* --- 5. 树冠换色（运行层） -----------------------------------------
     只动"树冠绿"那一档色相：从**原始画布**（base）重新算，所以反复切换季节
     不会越切越花。树干（棕色）与树坑石框（低饱和灰）靠色相/饱和度筛掉。 */
  /* 冬天的光秃树：叶子去掉以后补几根分叉的枝，只画在树冠区域。
     树枝用树干同色系，按每棵树自己的坐标错开，不至于一排树长得一样。 */
  function drawBareBranches(ctx, W, H, seed) {
    const cx = W * 0.5;
    const trunkTop = H * 0.66;
    const top = H * 0.10;
    let r = ((seed || 1) % 97) + 7;
    const rnd = () => ((r = (r * 9301 + 49297) % 233280) / 233280);
    ctx.strokeStyle = "#5b4632";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx, trunkTop - 1);
    ctx.lineTo(cx + (rnd() - 0.5) * 3, top);
    const n = 6;
    for (let i = 0; i < n; i++) {
      const y = trunkTop - (i + 1) * (trunkTop - top) / (n + 1);
      const dir = i % 2 ? 1 : -1;
      const len = W * (0.12 + rnd() * 0.18);
      const ex = cx + dir * len, ey = y - H * (0.04 + rnd() * 0.08);
      ctx.moveTo(cx, y);
      ctx.lineTo(ex, ey);
      ctx.moveTo(cx + dir * len * 0.55, y - (y - ey) * 0.55);
      ctx.lineTo(cx + dir * len * 0.95, ey - H * 0.06);
    }
    ctx.stroke();
  }

  function applyCanopies(progress) {
    const cfg = curSeason(), op = cfg.canopy;
    /* 冬天把叶子去掉，只留树干和枝。过渡到一半以上才开始掉。 */
    const bare = (S.season === "winter" && S.mix > 0.5);
    for (const p of treeList) {
      if (!p.img || !p.img.getContext) continue;
      if (!p.base) {                                       // 第一次：留一份原始像素
        const b = document.createElement("canvas");
        b.width = p.img.width; b.height = p.img.height;
        b.getContext("2d").drawImage(p.img, 0, 0);
        p.base = b;
      }
      const src = p.base.getContext("2d").getImageData(0, 0, p.base.width, p.base.height);
      const dst = p.img.getContext("2d").createImageData(src.width, src.height);
      const sd = src.data, dd = dst.data;
      const W = p.base.width, H = p.base.height;
      const wx = Math.round(p.x || 0), wy = Math.round(p.y || 0);
      /* 树冠积雪也只看天气；冬季配置里的 snow 已经归零。 */
      const wxSnow = (curWeather().part === "snow") ? 0.7 : 0;
      const snow = wxSnow || op.snow || 0;
      const sp = p.sp || "broadleaf";
      const thin = (op.thin || 0) * (sp in SP_THIN_MUL ? SP_THIN_MUL[sp] : 1);
      for (let py = 0; py < H; py++) {
        for (let px = 0; px < W; px++) {
          const i = (py * W + px) * 4;
          const a = sd[i + 3];
          if (a < 8) { dd[i + 3] = 0; continue; }
          dd[i] = sd[i]; dd[i + 1] = sd[i + 1]; dd[i + 2] = sd[i + 2]; dd[i + 3] = a;
          const hsl = rgb2hsl(sd[i], sd[i + 1], sd[i + 2]);
          const canopy = hsl[1] > 0.16 && hsl[0] > 40 && hsl[0] < 175;
          if (!canopy) continue;
          /* 冬天：叶子整片拿掉，留空给树枝。 */
          if (bare) { dd[i + 3] = 0; continue; }
          if (thin > 0 && wh2(wx + px, wy + py) < thin * 0.85) { dd[i + 3] = 0; continue; }
          /* 银杏走「绝对色相目标」：烘焙是秋天的金黄，春夏要拉回绿，
             其余树种烘焙本来就是绿，用相对偏移就够。 */
          const dh = sp === "ginkgo" ? (op.gold - hsl[0]) : op.hue * (sp in SP_HUE_MUL ? SP_HUE_MUL[sp] : 1);
          const rgb = hsl2rgb(hsl[0] + dh, clamp(hsl[1] * (sp === "conifer" ? 1 : op.sat), 0, 1),
                              clamp(hsl[2] * op.val, 0, 1));
          dd[i] = lerp(sd[i], rgb[0], progress);
          dd[i + 1] = lerp(sd[i + 1], rgb[1], progress);
          dd[i + 2] = lerp(sd[i + 2], rgb[2], progress);
          if (snow > 0 && py < H * 0.55 && wh2(wx + px * 3, wy + py * 7) < snow * 0.55) {
            dd[i] = lerp(dd[i], 238, 0.8); dd[i + 1] = lerp(dd[i + 1], 244, 0.8); dd[i + 2] = lerp(dd[i + 2], 250, 0.8);
          }
        }
      }
      p.img.getContext("2d").putImageData(dst, 0, 0);
      if (bare) drawBareBranches(p.img.getContext("2d"), W, H, (p.x | 0) + (p.y | 0));
    }
  }

  /* --- 5b. 操场高杆灯 --------------------------------------------------
     新操场在 x 3779~4367、y 1017~1432，篮球场紧挨西边（x 3475~3733）。
     灯立在西/东边界上，西边两盏正好把球场也带上。灯只在夜里亮。 */
  const FLOODLIGHTS = [
    { x: 3775, y: 1046 },
    { x: 3775, y: 1400 },
    { x: 4370, y: 1220 },
  ];
  const FLOOD_POLE = 74;        // 灯杆高度（世界像素）
  const FLOOD_R = 205;          // 地面光斑半径

  function nightAmount() {
    return clamp((0.36 - dayFactor()) / 0.36, 0, 1);
  }

  /* 地面光斑：椭圆径向渐变，暖白到透明。画在地面层。 */
  function drawFloodPools(g, ox, oy, zoom) {
    const a = nightAmount();
    if (a < 0.02) return;
    for (const L of FLOODLIGHTS) {
      const cx = (L.x + 40 - ox) * zoom, cy = (L.y + 6 - oy) * zoom;
      const r = FLOOD_R * zoom;
      if (cx + r < 0 || cx - r > g.canvas.width || cy + r * 0.6 < 0 || cy - r * 0.6 > g.canvas.height) continue;
      g.save();
      g.translate(cx, cy);
      g.scale(1, 0.52);
      /* 光斑是一块有形状的地面：中间实、边缘一刀切下去，不做大范围雾化。
         边缘留 6% 的过渡带，否则像素风下会像一坨糊。 */
      const grad = g.createRadialGradient(0, 0, 0, 0, 0, r);
      grad.addColorStop(0, "rgba(255,232,176," + (0.46 * a).toFixed(3) + ")");
      grad.addColorStop(0.72, "rgba(255,226,160," + (0.38 * a).toFixed(3) + ")");
      grad.addColorStop(0.94, "rgba(255,222,150," + (0.22 * a).toFixed(3) + ")");
      grad.addColorStop(1, "rgba(255,222,150,0)");
      g.fillStyle = grad;
      g.beginPath();
      g.arc(0, 0, r, 0, 6.2832);
      g.fill();
      /* 光斑外沿再补一圈很淡的亮边，让边界看得出来 */
      g.strokeStyle = "rgba(255,236,190," + (0.22 * a).toFixed(3) + ")";
      g.lineWidth = Math.max(1, 1.6 * zoom);
      g.beginPath();
      g.arc(0, 0, r * 0.97, 0, 6.2832);
      g.stroke();
      g.restore();
    }
  }

  /* 灯杆 + 灯头 + 光锥。画在天空层，和雨/雾一起吃夜间亮度。 */
  function drawFloodlights(g, ox, oy, zoom) {
    const a = nightAmount();
    if (a < 0.02) return;
    const poleH = FLOOD_POLE * zoom;
    for (const L of FLOODLIGHTS) {
      const sx = (L.x - ox) * zoom, sy = (L.y - oy) * zoom;
      if (sx < -200 || sx > g.canvas.width + 200) continue;
      /* 光锥：从灯头往两侧张开，落到地面光斑的边缘 */
      const halfTop = 4 * zoom, halfBot = FLOOD_R * 0.85 * zoom;
      const cone = g.createLinearGradient(0, sy - poleH, 0, sy);
      cone.addColorStop(0, "rgba(255,238,190," + (0.16 * a).toFixed(3) + ")");
      cone.addColorStop(1, "rgba(255,238,190,0)");
      g.fillStyle = cone;
      g.beginPath();
      g.moveTo(sx - halfTop, sy - poleH);
      g.lineTo(sx + halfTop, sy - poleH);
      g.lineTo(sx + halfBot, sy);
      g.lineTo(sx - halfBot, sy);
      g.closePath();
      g.fill();
      /* 灯杆 */
      g.fillStyle = "rgba(74,80,88," + (0.85).toFixed(3) + ")";
      g.fillRect(sx - Math.max(1, zoom * 1.6), sy - poleH, Math.max(2, zoom * 3.2), poleH);
      /* 灯头：一个小方块，带暖白发光 */
      const hw = Math.max(3, 7 * zoom), hh = Math.max(2, 4 * zoom);
      g.fillStyle = "rgba(255,244,214," + (0.95 * a).toFixed(3) + ")";
      g.fillRect(sx - hw, sy - poleH - hh, hw * 2, hh);
      g.fillStyle = "rgba(255,236,180," + (0.28 * a).toFixed(3) + ")";
      g.beginPath();
      g.arc(sx, sy - poleH, 16 * zoom, 0, 6.2832);
      g.fill();
    }
  }

  /* --- 6. 粒子 --------------------------------------------------------
     粒子存**世界坐标**，窗外就回收到上风向，相机移动时不会被"拖着走"。 */
  function viewport(ox, oy, zoom) {
    const v = MAP.view || { w: 480, h: 270 };
    return { x: ox, y: oy, w: v.w / zoom, h: v.h / zoom };
  }
  function seedParticles(vp, kind, budget) {
    const arr = [];
    for (let i = 0; i < budget; i++) {
      arr.push({
        x: vp.x + Math.random() * vp.w, y: vp.y + Math.random() * vp.h,
        z: 0.3 + Math.random() * 0.7, ph: Math.random() * 6.2832,
        vx: 0, vy: 0, k: kind
      });
    }
    return arr;
  }
  function particleBudget(screenPx, w) {
    /* 预算按**屏幕**面积算，不是按可见世界面积：粒子是视觉层的东西，
       放大缩小后雨丝该一样密。可见世界是 VIEW_W/zoom × VIEW_H/zoom，
       拿它当"100 万像素"来除，zoom=3 时只剩个位数粒子。 */
    return Math.round(clamp(screenPx / 1e6 * w.count, 0, 900));
  }
  function pickKind(w, season) {
    if (w.part !== "none") return w.part;
    /* 晴好天气也留一点"活气"：秋天偶有落叶飘、春天偶有花瓣飘。 */
    if (w.gust > 20 && season.cover.kind === "leaf") return "leaf";
    if (season.cover.kind === "blossom") return "petal";
    return "none";
  }
  function stepParticles(vp, w, season, screenPx) {
    const kind = pickKind(w, season);
    const want = kind === "none" ? 0 : particleBudget(screenPx, w) || Math.round(clamp(screenPx / 1e6 * 60, 20, 160));
    if (want !== S.particles.length || kind !== S.pKind) {
      S.pKind = kind;
      S.particles = want > 0 ? seedParticles(vp, kind, want) : [];
    }
    if (!S.particles.length) return;
    const dt = _fdt, gust = w.gust, fall = kind === "rain" ? 900 : kind === "snow" ? 34 : kind === "leaf" ? 46 : 26;
    for (const p of S.particles) {
      const sway = kind === "rain" ? 0 : Math.sin(S.t * 1.6 + p.ph) * (kind === "leaf" ? 26 : kind === "snow" ? 14 : 8);
      p.x += (gust * p.z + sway) * dt;
      p.y += fall * p.z * dt;
      if (p.x > vp.x + vp.w + 40) p.x -= vp.w + 80;
      if (p.x < vp.x - 40) p.x += vp.w + 80;
      if (p.y > vp.y + vp.h + 30) { p.y -= vp.h + 60; p.x = vp.x + Math.random() * vp.w; }
      if (p.y < vp.y - 30) p.y += vp.h + 60;
    }
  }
  function drawParticles(g, vp, ox, oy, zoom, w) {
    if (!S.particles.length) return;
    const kind = S.particles[0].k;
    if (kind === "rain") return;   // 雨单独在整体调色之后画，见 drawRain（否则会被压暗层吃掉）
    const cols = kind === "snow" ? ["#ffffff", "#eef4fa", "#dfe8f2"]
      : kind === "petal" ? ["#f6dbe4", "#eec6d4", "#e0aebb"]
      : (seasonCols() || ["#d8b24a", "#c8a03c", "#b8792c"]);
    for (const p of S.particles) {
      const sx = (p.x - ox) * zoom, sy = (p.y - oy) * zoom;
      const sz = Math.max(1, Math.round(2 * p.z * zoom));
      g.fillStyle = cols[(p.ph * 10 | 0) % cols.length];
      g.globalAlpha = kind === "snow" ? 0.9 : 0.85;
      if (kind === "leaf") {
        const rot = Math.sin(S.t * 2 + p.ph);
        g.fillRect(sx, sy, Math.max(1, Math.round(sz * (0.6 + Math.abs(rot)))), sz);
      } else g.fillRect(sx, sy, sz, sz);
    }
    g.globalAlpha = 1;
  }
  /* 雨单独一层：画在整体调色之后，否则会被压暗层吃掉。
     按深度分三层，越近越长越亮，远处那层当背景。 */
  function drawRain(g, vp, ox, oy, zoom, w) {
    if (S.pKind !== "rain" || !S.particles.length) return;
    const gust = w.gust || 0;
    const bands = [
      { lo: 0.0, hi: 0.45, alpha: 0.20, lw: 0.55, len: 4.5 },
      { lo: 0.45, hi: 0.75, alpha: 0.36, lw: 0.9, len: 7.5 },
      { lo: 0.75, hi: 1.01, alpha: 0.56, lw: 1.35, len: 11.5 },
    ];
    for (const b of bands) {
      g.strokeStyle = "rgba(198,216,236," + b.alpha + ")";
      g.lineWidth = Math.max(1, zoom * b.lw);
      g.beginPath();
      for (const p of S.particles) {
        if (p.z < b.lo || p.z >= b.hi) continue;
        const sx = (p.x - ox) * zoom, sy = (p.y - oy) * zoom;
        g.moveTo(sx, sy);
        g.lineTo(sx + gust * 0.018 * zoom, sy + b.len * zoom * p.z);
      }
      g.stroke();
    }
  }

  /* 雨幕：整屏一层蓝灰，雨越大越糊，雨丝才有"在空气里"的感觉。 */
  function drawRainVeil(g, viewW, viewH, w) {
    if (!w.wet || w.wet < 0.05) return;
    g.fillStyle = "rgba(148,168,196," + (0.05 + 0.10 * w.wet).toFixed(3) + ")";
    g.fillRect(0, 0, viewW, viewH);
  }

  function seasonCols() {
    const c = curSeason().cover;
    if (c.kind === "leaf") return seasonCfg(S.season).litter.leaf;
    if (c.kind === "blossom") return seasonCfg(S.season).litter.blossom;
    return null;
  }

  /* --- 7. 地面覆盖层（积雪 / 落叶 / 湿路） ----------------------------
     按可见的 16px 格逐格画，"哪一格有东西"由世界坐标哈希决定 ⇒ 相机移动不闪烁。
     水域格跳过（雪落在湖里、叶子漂在水上都脏）。 */
  function drawGroundCover(g, vp, ox, oy, zoom, w, season) {
    const C = MAP.CELL, K = MAP.K, cellAt = MAP.cellAt;
    if (!cellAt || !K) return;
    const cx0 = Math.max(0, Math.floor(vp.x / C)), cx1 = Math.min(Math.ceil(MAP.WORLD_W / C), Math.ceil((vp.x + vp.w) / C));
    const cy0 = Math.max(0, Math.floor(vp.y / C)), cy1 = Math.min(Math.ceil(MAP.WORLD_H / C), Math.ceil((vp.y + vp.h) / C));
    const s = zoom, step = Math.max(1, Math.round(C * s));
    const cov = season.cover, wet = w.wet;
    /* 雪是天气不是季节：冬天本身不铺雪，真下雪（part=snow）才画。 */
    const wxSnow = (w.part === "snow") ? 0.88 : 0;
    const snowAmt = Math.max(cov.kind === "snow" ? cov.density : 0, wxSnow);
    if (cov.density <= 0.001 && wet <= 0.001 && snowAmt <= 0.001) return;
    for (let cy = cy0; cy < cy1; cy++) {
      for (let cx = cx0; cx < cx1; cx++) {
        const wx = cx * C, wy = cy * C;
        const k = cellAt(wx + 8, wy + 8);
        if (k === K.WATER || k === K.OUT) continue;
        const sx = (wx - ox) * s, sy = (wy - oy) * s;
        if (wet > 0.02 && k === K.ROAD) {                       // 湿路：压暗 + 一道反光
          g.fillStyle = "rgba(18,24,34," + (0.20 * wet).toFixed(3) + ")";
          g.fillRect(sx, sy, step, step);
          if (wh2(cx, cy) < 0.22 * wet) {
            g.fillStyle = "rgba(150,176,206," + (0.16 * wet).toFixed(3) + ")";
            g.fillRect(sx, sy + step * 0.3, step, Math.max(1, step * 0.18));
          }
          /* 水洼：比反光条更稀少、更成片，水面亮一档并往外扩散涟漪。 */
          const pud = wh2(cx * 5 + 3, cy * 9 + 5);
          if (pud < 0.12 * wet) {
            g.fillStyle = "rgba(126,156,190," + (0.22 * wet).toFixed(3) + ")";
            g.fillRect(sx, sy, step, step);
            const ph = (S.t * 0.9 + pud * 37) % 1;
            const r = step * (0.16 + 0.7 * ph);
            g.strokeStyle = "rgba(190,212,236," + (0.38 * (1 - ph) * wet).toFixed(3) + ")";
            g.lineWidth = Math.max(1, Math.round(s * 0.55));
            g.beginPath();
            g.arc(sx + step * 0.5, sy + step * 0.5, r, 0, 6.2832);
            g.stroke();
          }
        }
        /* 天气雪：盖在路面之外的地面上，跟季节覆盖各画各的。 */
        if (snowAmt > 0.001) {
          const hs = wh2(cx * 7 + 13, cy * 11 + 7);
          if (hs <= snowAmt) {
            g.fillStyle = hs % 0.1 < 0.03 ? "rgba(226,236,246,0.92)" : "rgba(238,244,250,0.78)";
            g.fillRect(sx, sy, step, step);
          }
        }
        if (cov.density <= 0.001) continue;
        const h = wh2(cx * 7 + 13, cy * 11 + 7);
        if (cov.kind === "leaf" || cov.kind === "blossom") {
          const n = h < cov.density ? 3 : h < cov.density * 0.6 ? 1 : 0;
          const cols = cov.kind === "leaf" ? seasonCfg(S.season).litter.leaf : seasonCfg(S.season).litter.blossom;
          for (let i = 0; i < n; i++) {
            const px = sx + Math.floor(wh2(cx * 31 + i, cy * 17 + i * 5) * step);
            const py = sy + Math.floor(wh2(cy * 23 + i, cx * 13 + i * 3) * step);
            g.fillStyle = cols[(i + cx + cy) % cols.length];
            g.globalAlpha = 0.85;
            g.fillRect(px, py, Math.max(1, Math.round(s)), Math.max(1, Math.round(s * 0.7)));
          }
          g.globalAlpha = 1;
        }
      }
    }
  }

  /* --- 8. 天空层（云影 / 雾 / 调色 / 闪电 / 灯光晕） ------------------- */
  function drawAtmosphere(g, vp, ox, oy, zoom, w, season, viewW, viewH) {
    /* 云影：两块缓慢漂移的软暗斑，用低透明度的椭圆叠出来（像素风不追求真实投影）。 */
    if (w.cloud > 0.05) {
      const n = w.cloud > 0.7 ? 3 : 2;
      for (let i = 0; i < n; i++) {
        const cx = ((S.t * (6 + i * 3) + i * 900) % (vp.w + 900)) + vp.x - 450;
        const cy = vp.y + ((i * 337) % Math.max(1, vp.h));
        const rx = 420, ry = 240;
        const sx = (cx - ox) * zoom, sy = (cy - oy) * zoom;
        g.fillStyle = "rgba(26,32,44," + (0.055 * w.cloud).toFixed(3) + ")";
        g.beginPath(); g.ellipse(sx, sy, rx * zoom, ry * zoom, 0, 0, 6.2832); g.fill();
      }
    }
    /* 整体调色：先乘后加，秋冬那层暖金就是这一步给的。 */
    const tint = season.tint, mul = tint.mul, add = tint.add;
    const df = dayFactor();
    const expo = w.expo * (0.20 + 0.80 * df) * (1 - 0.25 * w.fog * 0.5);
    g.save();
    g.globalCompositeOperation = "multiply";
    g.fillStyle = "rgb(" + Math.round(mul[0] * expo) + "," + Math.round(mul[1] * expo) + "," + Math.round(mul[2] * expo) + ")";
    g.fillRect(0, 0, viewW, viewH);
    g.globalCompositeOperation = "source-over";
    g.fillStyle = "rgba(" + Math.round(add[0]) + "," + Math.round(add[1]) + "," + Math.round(add[2]) + "," + (add[3] * 0.9).toFixed(3) + ")";
    g.fillRect(0, 0, viewW, viewH);
    const amb = w.amb;
    if (amb[3] > 0.01) {
      g.fillStyle = "rgba(" + Math.round(amb[0]) + "," + Math.round(amb[1]) + "," + Math.round(amb[2]) + "," + (amb[3] * S.intensity).toFixed(3) + ")";
      g.fillRect(0, 0, viewW, viewH);
    }
    g.restore();
    /* 雾：近地面一层 + 整体薄纱，越靠屏幕下方越浓（读作贴地雾）。 */
    if (w.fog > 0.02) {
      const f = w.fog * S.intensity;
      const grd = g.createLinearGradient(0, viewH * 0.25, 0, viewH);
      grd.addColorStop(0, "rgba(214,222,228," + (0.06 * f).toFixed(3) + ")");
      grd.addColorStop(1, "rgba(224,230,236," + (0.42 * f).toFixed(3) + ")");
      g.fillStyle = grd; g.fillRect(0, 0, viewW, viewH);
      for (let i = 0; i < 4; i++) {
        const bx = ((S.t * (10 + i * 6) + i * 700) % (vp.w + 1200)) + vp.x - 600;
        const by = vp.y + vp.h * (0.55 + 0.1 * i);
        g.fillStyle = "rgba(230,236,242," + (0.10 * f).toFixed(3) + ")";
        g.beginPath();
        g.ellipse((bx - ox) * zoom, (by - oy) * zoom, 520 * zoom, 90 * zoom, 0, 0, 6.2832);
        g.fill();
      }
    }
    /* 雷雨闪电：随机白闪 2 帧 + 短暂过曝。 */
    if (w.bolt > 0 && S.flash > 0) {
      g.fillStyle = "rgba(240,246,255," + (0.55 * S.flash).toFixed(3) + ")";
      g.fillRect(0, 0, viewW, viewH);
    }
    /* 路灯光晕：阴雨天 / 冬季自动亮，雨夜最明显。 */
    const lampA = Math.max(season.lamps * (0.35 + 0.65 * (1 - w.expo)), 1 - df) + (w.fog > 0.4 ? 0.2 : 0);
    if (lampA > 0.12 && lampList.length && zoom > 0.24) {
      g.save();
      g.globalCompositeOperation = "lighter";
      for (const p of lampList) {
        const sx = (p.x - 14 - ox) * zoom, sy = (p.y - 74 - oy) * zoom;
        if (sx < -60 || sy < -60 || sx > viewW + 60 || sy > viewH + 60) continue;
        const r = 26 * zoom;
        const grd = g.createRadialGradient(sx, sy, 0, sx, sy, r);
        grd.addColorStop(0, "rgba(255,226,150," + (0.34 * Math.min(1, lampA)).toFixed(3) + ")");
        grd.addColorStop(1, "rgba(255,210,120,0)");
        g.fillStyle = grd;
        g.beginPath(); g.arc(sx, sy, r, 0, 6.2832); g.fill();
      }
      g.restore();
    }
  }

  /* --- 9. 每帧入口 ----------------------------------------------------
     地图只需要在 render() 里挂两个钩子：onGround（画在楼和道具之间之前，
     即贴地）与 onSky（画在所有东西之上）。时间推进放在 onSky 里，
     所以即使某帧只调了 onSky 也不会漏帧；onGround 只读状态不推进。 */
  let lastTs = 0, _fdt = 0.016;
  function tick(ts) {
    const now = ts == null ? (global.performance ? performance.now() : Date.now()) : ts;
    const dt = lastTs ? clamp((now - lastTs) / 1000, 0, 0.05) : 0.016;
    lastTs = now; _fdt = dt || 0.016;
    S.t += _fdt;
    if (S.mix < 1) {
      S.mix = clamp(S.mix + _fdt / 1.8, 0, 1);                 // 1.8 秒过渡
      canopyStep();
      if (S.mix >= 1) { S.fromSeason = null; S.fromWeather = null; emit(); }
    }
    if (S.flash > 0) S.flash = Math.max(0, S.flash - _fdt * 4);
    if (curWeather().bolt > 0) {
      S.nextBolt -= _fdt;
      if (S.nextBolt <= 0) { S.flash = 1; S.nextBolt = 2.5 + Math.random() * 6; }
    }
    if (S.autoWeather) {
      S.awTimer = (S.awTimer || 0) + _fdt;
      if (S.awTimer > 75) { S.awTimer = 0; evolveWeather(); }
    }
    if (S.autoSeason) {
      S.asTimer = (S.asTimer || 0) + _fdt;
      if (S.asTimer > 30) {
        S.asTimer = 0;
        const s = seasonOfDate();
        if (s !== S.season && S.mix >= 1) setSeason(s, { auto: true });
      }
    }
  }
  /* 树冠重着色一次要遍历十几万像素，不能每帧都算：过渡期每 0.3 秒上一遍，
     观感上是"颜色慢慢变"，代价是每次切换只多花十几毫秒 × 6 次。 */
  let canopyClock = 0;
  function canopyStep() {
    canopyClock -= _fdt;
    if (canopyClock > 0) return;
    canopyClock = 0.3;
    applyCanopies(1);
  }
  /* 每帧钩子的保险丝：模块自己出错只丢天气效果，不能把地图的 render() 一起拖死。
     两层各断各的（地面覆盖出错不该顺带关掉下雪），且只报第一次
     —— 每帧刷 console 会把真正有用的日志盖掉。 */
  const FUSE = { ground: false, sky: false };
  function guarded(key, fn, g, ox, oy, zoom, ts) {
    if (FUSE[key]) return;
    try { fn(g, ox, oy, zoom, ts); }
    catch (e) {
      FUSE[key] = true;
      if (global.console) console.warn("weather." + key + " 已停用（本帧起不再绘制）:", e);
    }
  }
  function onGround(g, ox, oy, zoom) {
    guarded("ground", function (g, ox, oy, zoom) {
      const w = curWeather(), season = curSeason(), vp = viewport(ox, oy, zoom);
      drawGroundCover(g, vp, ox, oy, zoom, w, season);
      drawFloodPools(g, ox, oy, zoom);     // 操场高杆灯的地面光斑
    }, g, ox, oy, zoom);
  }
  function onSky(g, ox, oy, zoom, ts) {
    guarded("sky", function (g, ox, oy, zoom, ts) {
      tick(ts);
      const w = curWeather(), season = curSeason(), vp = viewport(ox, oy, zoom);
      const viewW = g.canvas.width, viewH = g.canvas.height;
      /* 粒子预算要的是**屏幕上真实像素**的面积。地图画在 480×270 的背板上再整数倍
         放大到屏幕，所以 g.canvas.width/height 只有真实面积的约 1/10 —— 直接拿它算，
         大雨只剩几十滴、雪基本看不见。clientWidth/Height 才是 CSS 尺寸。 */
      const scrW = g.canvas.clientWidth || viewW, scrH = g.canvas.clientHeight || viewH;
      stepParticles(vp, w, season, scrW * scrH);
      drawParticles(g, vp, ox, oy, zoom, w);
      drawAtmosphere(g, vp, ox, oy, zoom, w, season, viewW, viewH);
      /* 雨画在调色之后：雨幕垫底、雨丝压在最上面，闪电再亮也盖不住它。 */
      drawRainVeil(g, viewW, viewH, w);
      drawRain(g, vp, ox, oy, zoom, w);
      drawFloodlights(g, ox, oy, zoom);    // 灯杆、灯头、光锥压在最上面
    }, g, ox, oy, zoom, ts);
  }

  /* --- 10. 状态切换与事件 --------------------------------------------- */
  /* --- 天文：太阳黄经 → 节气 → 季节 -------------------------------
     立春 315°、立夏 45°、立秋 135°、立冬 225°。按黄经分季，
     立冬一过就算冬天，不再看月份。 */
  function solarLon(ts) {
    const jd = ts / 86400000 + 2440587.5;
    const n = jd - 2451545.0;
    const L = (280.460 + 0.9856474 * n) % 360;
    const g = ((357.528 + 0.9856003 * n) % 360) * Math.PI / 180;
    const lam = L + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g);
    return ((lam % 360) + 360) % 360;
  }
  function seasonOfDate(d) {
    const lon = solarLon((d || new Date()).getTime());
    if (lon >= 315 || lon < 45) return "spring";
    if (lon < 135) return "summer";
    if (lon < 225) return "autumn";
    return "winter";
  }

  /* --- 白昼系数：0 = 深夜，1 = 白天 -------------------------------
     日出前 45 分钟开始亮，日落后 45 分钟天全黑，日出日落由服务器给。 */
  function sunToday() {
    const arr = (typeof window !== "undefined") ? window.__wxSun : null;
    if (!arr || !arr.length) return null;
    const d = new Date();
    const pad = n => String(n).padStart(2, "0");
    const key = d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
    for (const x of arr) if (x.date === key && x.sunrise && x.sunset) return x;
    return arr[0] && arr[0].sunrise ? arr[0] : null;
  }
  function dayFactor() {
    /* ?night=1 强制当夜里，方便白天调灯光。 */
    try {
      if (/(?:\?|&)night=1(?:&|$)/.test((global.location && global.location.search) || "")) return 0.1;
    } catch (e) { }
    const st = sunToday();
    if (!st) return 1;
    const sr = new Date(st.sunrise).getTime();
    const ss = new Date(st.sunset).getTime();
    if (!(sr > 0) || !(ss > sr)) return 1;
    const now = Date.now();
    const dawn = sr - 45 * 60000, dusk = ss + 45 * 60000;
    if (now < dawn || now > dusk) return 0.12;
    if (now < sr) return 0.12 + 0.88 * (now - dawn) / (sr - dawn);
    if (now > ss) return 1 - 0.88 * (now - ss) / (dusk - ss);
    return 1;
  }
  function emit() {
    const st = API.state();
    for (const cb of listeners) { try { cb(st, API); } catch (e) { if (global.console) console.warn("weather listener:", e); } }
    if (API.panel) API.panel.refresh();
  }
  function setSeason(name, opts) {
    if (!SEASONS[name] || name === S.season) return;
    opts = opts || {};
    if (!opts.silent) { S.fromSeason = S.season; S.mix = 0; S.canopyLeft = 0; }
    S.season = name;
    if (!opts.auto) S.autoSeason = false;
    persist(); emit();
  }
  function setWeather(name, intensity) {
    if (!WEATHERS[name]) return;
    if (name === S.weather && intensity == null) return;
    S.fromWeather = S.weather; S.mix = 0;
    S.weather = name;
    /* 第二个参数是"强度覆盖"，不传（null/undefined）表示**保留当前强度**：
       面板点天气按钮传的正是 null，原来这里一律落成 1，等于每点一次按钮
       就把用户拖过的强度滑杆悄悄推回 100。 */
    if (intensity != null) S.intensity = clamp(intensity, 0, 1);
    S.autoWeather = false;
    persist(); emit();
  }
  function evolveWeather() {
    const pool = S.season === "winter" ? ["clear", "cloudy", "snow", "fog", "overcast"]
      : S.season === "autumn" ? ["clear", "cloudy", "wind", "rain", "fog", "overcast"]
        : S.season === "spring" ? ["clear", "cloudy", "rain", "wind", "fog"]
          : ["clear", "clear", "cloudy", "rain", "storm", "wind"];
    let nxt = pool[Math.floor(Math.random() * pool.length)];
    if (nxt === S.weather) nxt = pool[(pool.indexOf(nxt) + 1) % pool.length];
    S.fromWeather = S.weather; S.mix = 0; S.weather = nxt;
    S.intensity = 0.7 + Math.random() * 0.3;
    persist(); emit();
  }
  function persist() {
    try {
      global.localStorage.setItem(STORE_KEY, JSON.stringify({
        season: S.season, weather: S.weather, intensity: S.intensity,
        autoSeason: S.autoSeason, autoWeather: S.autoWeather
      }));
    } catch (e) { /* 隐私模式 / file:// 受限：本次会话内仍然可用 */ }
  }
  function restore() {
    let saved = null;
    try { saved = JSON.parse(global.localStorage.getItem(STORE_KEY) || "null"); } catch (e) { }
    const q = (global.location && global.location.search) || "";
    const m = /[?&](?:wx|weather)=([a-z]+)/i.exec(q), ms = /[?&]season=([a-z]+)/i.exec(q);
    /* 季节一律按节气算：localStorage 里存的旧季节不再优先，否则过了立冬
       还停在秋天。URL 上的 ?season= 仍然可以覆盖，方便调试。 */
    S.season = (ms && SEASONS[ms[1].toLowerCase()]) ? ms[1].toLowerCase() : seasonOfDate();
    S.weather = (m && WEATHERS[m[1].toLowerCase()]) ? m[1].toLowerCase() : "clear";
    S.intensity = 1;
    S.autoSeason = !(ms && ms[1]);
    /* 天气由页面拉真实数据后 setWeather 驱动，这里不要打开 75 秒随机换天气。 */
    S.autoWeather = false;
  }

  /* --- 11. 控制面板（样式在 weather.css，类名 .wx-*） ------------------ */
  function makePanel() {
    return {
      el: null,
      mount(host) {
        if (this.el) return this.el;
        const box = global.document.createElement("div");
        box.className = "wx-panel";
        box.innerHTML =
          '<div class="wx-row"><span class="wx-cap">季节</span>' +
          SEASON_ORDER.map(k => '<button class="wx-season" data-k="' + k + '">' + SEASONS[k].label + '</button>').join("") +
          '<button class="wx-auto" data-k="season">自动</button></div>' +
          '<div class="wx-row"><span class="wx-cap">天气</span>' +
          WEATHER_ORDER.map(k => '<button class="wx-weather" data-k="' + k + '" title="' + WEATHERS[k].label + '">' + WEATHERS[k].label + '</button>').join("") +
          '<button class="wx-auto" data-k="weather">自动</button></div>' +
          '<div class="wx-now"><b class="wx-now-season"></b> · <span class="wx-now-weather"></span>' +
          '<label class="wx-int"><span>强度</span><input type="range" min="0" max="100" value="100"></label></div>';
        (host || global.document.body).appendChild(box);
        this.el = box;
        box.addEventListener("click", e => {
          const b = e.target.closest("button"); if (!b) return;
          if (b.classList.contains("wx-season")) setSeason(b.dataset.k, {});
          else if (b.classList.contains("wx-weather")) setWeather(b.dataset.k, null);
          else if (b.dataset.k === "season") { S.autoSeason = !S.autoSeason; persist(); emit(); }
          else { S.autoWeather = !S.autoWeather; S.awTimer = 60; persist(); emit(); }
        });
        box.querySelector("input").addEventListener("input", e => {
          S.intensity = clamp(Number(e.target.value) / 100, 0, 1); persist();
        });
        this.refresh();
        return box;
      },
      refresh() {
        const box = this.el; if (!box) return;
        box.querySelectorAll(".wx-season").forEach(b => b.classList.toggle("on", b.dataset.k === S.season && !S.autoSeason));
        box.querySelectorAll(".wx-weather").forEach(b => b.classList.toggle("on", b.dataset.k === S.weather && !S.autoWeather));
        box.querySelectorAll(".wx-auto").forEach(b => {
          b.classList.toggle("on", b.dataset.k === "season" ? S.autoSeason : S.autoWeather);
        });
        /* "当前"报的是**目标**季节/天气，不是过渡中的混合值 —— 否则点一下"冬"，
           前两秒会显示"秋（winter）"，名字和键位来自两个季节，看着像没生效。
           过渡本身由后面那个"· 转换中"说明。 */
        box.querySelector(".wx-now-season").textContent = seasonCfg(S.season).label + "（" + S.season + "）";
        box.querySelector(".wx-now-weather").textContent = weatherCfg(S.weather).label +
          (S.mix < 1 ? " · 转换中" : "");
        box.querySelector("input").value = Math.round(S.intensity * 100);
      }
    };
  }

  /* --- 12. 对外接口（详见 README.md） --------------------------------- */
  const API = {
    available: true,
    version: "20261119-w1",
    SEASONS: SEASON_ORDER.slice(), WEATHERS: WEATHER_ORDER.slice(),
    attach, onGround, onSky, tick,
    panel: null,
    mountPanel(host) { return API.panel.mount(host || global.document.body); },
    setSeason, setWeather,
    setAutoSeason(v) { S.autoSeason = !!v; if (v) { const m = new Date().getMonth() + 1; setSeason(m >= 3 && m <= 5 ? "spring" : m >= 6 && m <= 8 ? "summer" : m >= 9 && m <= 11 ? "autumn" : "winter", { auto: true }); } persist(); emit(); },
    setAutoWeather(v) { S.autoWeather = !!v; S.awTimer = 60; persist(); emit(); },
    cycle() { setSeason(SEASON_ORDER[(SEASON_ORDER.indexOf(S.season) + 1) % 4], {}); },
    season() { return S.season; },
    weather() { return S.weather; },
    label() { return seasonCfg(S.season).label + " · " + (weatherCfg(S.weather).label || ""); },
    lightsOn() { return curSeason().lamps * (0.35 + 0.65 * (1 - curWeather().expo)) > 0.12; },
    /* 白昼系数 0~1 和今天的日出日落，给页面上的浮层显示用。 */
    dayFactor() { return dayFactor(); },
    sunToday() { return sunToday(); },
    /* 某个世界坐标是不是站在操场灯的灯光里（人物要据此提亮）。 */
    inFloodlight(x, y) {
      if (nightAmount() < 0.05) return false;
      for (const L of FLOODLIGHTS) {
        const dx = x - (L.x + 40);
        const dy = (y - (L.y + 6)) / 0.52;
        if (dx * dx + dy * dy < FLOOD_R * FLOOD_R) return true;
      }
      return false;
    },
    /* 风力 0~1：优先用页面上写入的真实风速（km/h），没有就退回当前天气的 gust。
       旗子、水面波纹、树摆都读这一个值，三处一起变，才不会各飘各的。 */
    windFactor() {
      const kmh = (typeof window !== "undefined") ? window.__wxWindKmh : null;
      const byReal = typeof kmh === "number" ? clamp(kmh / 60, 0, 1) : 0;
      const byWx = clamp((curWeather().gust - 6) / 100, 0, 1);
      return Math.max(byReal, byWx);
    },
    grassRamp() { return seasonCfg(S.season).grass.slice(); },
    litterRamp(kind) { const l = seasonCfg(S.season).litter; return (kind === "blossom" ? l.blossom : l.leaf).slice(); },
    canopyRamp() { return null; },             // 树冠走运行层换色，烘焙期不需要
    state() { return { season: S.season, weather: S.weather, intensity: S.intensity, autoSeason: S.autoSeason, autoWeather: S.autoWeather, transitioning: S.mix < 1 }; },
    on(cb) { if (typeof cb === "function") listeners.push(cb); },
    off(cb) { const i = listeners.indexOf(cb); if (i >= 0) listeners.splice(i, 1); }
  };
  API.panel = makePanel();
  restore();
  global.CampusWeather = API;
})(window);
