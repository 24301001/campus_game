/* =========================================================
   4.7 植物多样化 —— 针叶 / 垂柳 / 开花树 + 行道树成行 / 广场树阵
   ---------------------------------------------------------
   为什么另开一个文件：树 / 灌木 / 灯的**原始生成器**躺在 demo 的
   nature 段（805-1049），那是逐字节切片，一行不能改。所以新物种只能
   另起一个 parts 文件，装配时插在 nature 之后。`anyTree()` 只做**分发**，
   既有生成器一个字都没动。

   ⚠️ 分发**不消耗随机数**：物种由 seed 的数值直接决定（`seed % 100`），
   不是再摇一次随机 —— 所以把 scatter() 里的 `makeTree((n*131+11)|0)` 换成
   `anyTree((n*131+11)|0, x, y)` 之后，**rngS 的序列一字不动**，全校园既有的
   灯 / 灌木 / 长椅 / 花坛分布逐像素不变（和删自行车是同一手法）。
   ⚠️ 行道树走**独立的 `makeRng(70707)`**，与 scatter() 的 rngS 完全隔离：
   整段行道树逻辑以后被删掉，scatter() 的结果也不受任何影响。

   三条既有铁律照旧：左上受光偏暖 / 右下背光偏冷；底部有方向性投影 +
   接地接触阴影；新物种的锚点约定与 makeTree 一致（ax = cx, ay = 地面线），
   调用点才能零改动。
   ========================================================= */
const PINE_D = "#1e3d1b", PINE_M = "#2f6129", PINE_L = "#4a8639";   // 针叶：比阔叶更冷更深
const WIL_D  = "#3a5820", WIL_M  = "#557c2b", WIL_L  = "#8fb84a";   // 垂柳：偏黄绿
const BL_D   = "#c58fa3", BL_M   = "#f0ccd8", BL_L   = "#fdf3f6";   // 开花树：粉白（不是桃红）

/* --- 4.7.1 针叶树：窄而高的塔形，中心线随高度摇摆，每层底缘外扩成锯齿 --- */
function makeConifer(seed) {
  const rng = makeRng(seed);
  const W = 54, H = 104;
  const c = mkCanvas(W, H), g = c.getContext("2d");
  const cx = W >> 1, gy = H - 5;                       // 27, 99
  const bark = "#5b4229";
  const trunkH = 8 + ((rng() * 4) | 0);                // 露出裙摆下面的一小段
  const top = gy - trunkH - 72, bot = gy - trunkH + 4;
  const R = 21, hT = (bot - top) / 7;                  // 七层
  const lean = rng() * 6.28;                           // 摇摆相位（每棵不同）

  shadowBlob(g, cx + 7, gy - 1, 15, 6, 0.30, 4);

  /* 树干：**从 top+12 起画**，别从 top 起 ——
     冠顶那几行半宽只有 2~3，盖不住 6px 宽的树干，会从尖上冒出一截棕色
     （5× 下非常显眼，像树尖上顶了个果子）。反正下面那截才是要露的。 */
  const tw = 6, tx = cx - (tw >> 1), ttop = top + 12;
  px(g, tx - 2, gy - 3, tw + 4, 3, shade(bark, -0.14));      // 根外扩
  px(g, tx, ttop, tw, gy - ttop, bark);
  for (let i = 0; i < gy - ttop; i++) {
    px(g, tx, ttop + i, 2, 1, shade(bark, 0.16));
    px(g, tx + tw - 2, ttop + i, 2, 1, shade(bark, -0.34));
  }

  /* 塔冠：逐行扫。三件事让它不像一个几何三角 ——
     ① 中心线按 `sin(t*3.4 + lean)` 缓慢摇摆（针叶树没有笔直的中轴）
     ② 半宽 ≈ 直线锥（pow 1.02）+ 层底外扩（锯齿缘）
     ③ 逐行 1.8px 的随机抖动 */
  for (let y = top; y <= bot; y++) {
    const t = (y - top) / (bot - top);
    const ring = ((y - top) % hT) / hT;                // 0 = 层顶，→1 = 层底
    const cxo = cx + Math.round(Math.sin(t * 3.4 + lean) * 1.7);
    const hw = Math.max(1, R * Math.pow(t, 1.02) + (1 - ring) * 2.8 + (rng() - 0.5) * 1.8);
    const x0 = Math.round(cxo - hw), w = Math.max(2, Math.round(hw * 2));
    let k = 0.24 - t * 0.38;                           // 上亮下暗
    if (ring < 0.15) k -= 0.22;                        // 层底一条暗线 → 层叠可读
    px(g, x0, y, w, 1, shade(PINE_M, k));
    px(g, x0, y, 1, 1, shade(PINE_M, k + 0.28));       // 左缘受光
    px(g, x0 + w - 1, y, 1, 1, shade(PINE_M, k - 0.32)); // 右缘背光
  }
  /* 冠内镂空：让轮廓不是一整块实心 */
  for (let i = 0; i < 18; i++) {
    const t = rng();
    px(g, cx + (rng() * 2 - 1) * R * Math.pow(t, 1.02) * 0.7, top + t * (bot - top),
       1 + ((rng() * 2) | 0), 1, "rgba(16,30,14,0.38)");
  }
  speckle(g, cx - R - 2, top, R * 2 + 4, bot - top, "rgba(0,0,0,0.16)", 80, rng);
  speckle(g, cx - R - 2, top, R * 2 + 4, bot - top, "rgba(200,240,160,0.12)", 55, rng);

  /* 顶芽：一根比冠顶高 3~6px 的尖，跟着中心线的相位摆 */
  const tipx = cx + Math.round(Math.sin(lean) * 1.7);
  px(g, tipx - 1, top - 3, 3, 4, shade(PINE_L, -0.12));
  px(g, tipx, top - 6, 1, 4, shade(PINE_L, 0.10));
  return { canvas: c, ax: cx, ay: gy };
}

/* --- 4.7.2 垂柳：高干 + 扁冠 + 前后两层垂条 ---
   垂条**分前后两层**画：后层（暗）在树干之前、前层（亮）在冠之后 ——
   这样树干会被夹在中间若隐若现，而不是"一根光杆顶个球"。 */
function makeWillow(seed) {
  const rng = makeRng(seed);
  const W = 86, H = 88;
  const c = mkCanvas(W, H), g = c.getContext("2d");
  const cx = W >> 1, gy = H - 5;                       // 43, 83
  const bark = "#5f4730";
  const trunkH = 40 + ((rng() * 6) | 0);
  const tw = 7, tx = cx - (tw >> 1);
  const ty = gy - trunkH, cyC = ty - 3, R = 27, RY = 17;

  shadowBlob(g, cx + 10, gy - 1, 22, 7, 0.30, 4);

  /* 垂条只有 26 根，且横向位置用 pow(0.55) **往两端挤**：
     垂柳是外圈披下来，中间不会挂一帘子 —— 中间留白是这棵树读不读得出来的关键
     （第一版 46 根均匀铺满，整棵糊成一丛草）。
     ⚠️ 长度必须夹住 gy-1，否则垂条会穿过地面线、读成插进土里。 */
  const st = [];
  for (let i = 0; i < 26; i++) {
    const u = (rng() < 0.5 ? -1 : 1) * Math.pow(rng(), 0.55);
    const y0 = cyC + Math.sqrt(Math.max(0, 1 - u * u)) * RY * 0.95 + (rng() - 0.5) * 2;
    st.push({ u: u, x: cx + u * R * 0.98, y0: y0,
              len: Math.max(5, Math.min(gy - 1 - y0, 12 + rng() * 18 + (1 - Math.abs(u)) * 4) | 0),
              th: Math.abs(u) > 0.62 ? 2 : 1,          // 外侧（离眼睛近）的条更粗
              ph: rng() * 6.28, k: rng() });
  }
  const drawStrands = (dark) => {
    for (const s of st) {
      if ((s.k >= 0.46) !== dark) continue;            // 两层按 k 对半分
      const col = dark ? shade(WIL_D, -0.06) : shade(WIL_M, 0.14);
      const dir = s.u >= 0 ? 1 : -1;
      for (let i = 0; i < s.len; i++) {
        /* 摆幅随下垂长度增大 + 整体向外飘 → 是一条弧，不是一根直线 */
        const wob = Math.sin(s.ph + i * 0.09) * (1.0 + i * 0.075) + dir * i * 0.05;
        /* ⚠️ 是 s.y0 —— 这个对象上的字段叫 y0。写成 s.y 会得到 NaN，
           px() 里的 fillRect 对 NaN 静默无效：**26 根垂条一根都画不出来**，
           整棵读成"高干圆冠的阔叶"（浏览器不报错、探针也看不出来，
           只有 12× 局部放大才发现那一格是空的）。 */
        px(g, s.x + wob, s.y0 + i, i < s.len - 5 ? s.th : 1, 1,
           i > s.len - 5 ? shade(WIL_L, 0.18) : (i < 3 ? shade(col, 0.12) : col));
        if (!dark && i > 3 && i < s.len - 5 && i % 5 === 2)
          px(g, s.x + wob + dir, s.y0 + i, 1, 1, shade(WIL_L, 0.22));
      }
    }
  };
  drawStrands(true);                                   // 后层（会被树干和冠压住大半）

  /* 树干：带一点弯（垂柳少直干） */
  px(g, tx - 2, gy - 4, tw + 4, 4, shade(bark, -0.14));
  for (let i = 0; i < trunkH; i++) {
    const xo = Math.round(Math.sin(i / trunkH * 2.1) * 1.6);
    px(g, tx + xo, ty + i, tw, 1, bark);
    px(g, tx + xo, ty + i, 1, 1, shade(bark, 0.18));
    px(g, tx + xo + tw - 1, ty + i, 1, 1, shade(bark, -0.34));
  }
  /* 主枝：从干顶散开托住冠；大半会被冠压住，露出的梢在外面 */
  for (let i = 0; i < 5; i++) {
    const a = -Math.PI / 2 + (i / 4 - 0.5) * 2.2 + (rng() - 0.5) * 0.26;
    const L = 13 + rng() * 9;
    seg(g, cx, ty + 2, cx + Math.cos(a) * L, ty + 2 + Math.sin(a) * L * 0.92, shade(bark, -0.08), 2);
  }

  /* 冠：扁球（柳冠比阔叶扁、比针叶散）。**要够大够实** ——
     垂条只是外圈的披挂，树体量得由冠撑起来。 */
  const cl = [];
  for (let i = 0; i < 17; i++) {
    const a = rng() * Math.PI * 2, rr = 0.28 + rng() * 0.72;
    cl.push({ x: cx + Math.cos(a) * R * rr, y: cyC + Math.sin(a) * RY * rr, r: 7 + rng() * 5 });
  }
  cl.sort((p, q) => p.y - q.y);
  for (const o of cl) {
    const k = clamp(0.20 - ((o.x - cx) / R * 0.5 + (o.y - cyC) / RY * 0.8) * 0.30, -0.30, 0.30);
    circlePx(g, o.x, o.y, o.r, shade(WIL_M, k));
  }
  /* 冠的左上迎光叶簇 */
  for (let i = 0; i < 9; i++)
    circlePx(g, cx - R * 0.1 - rng() * R * 0.55, cyC - RY * 0.25 - rng() * RY * 0.6,
      3 + rng() * 3.4, shade(WIL_L, 0.10 + rng() * 0.18));
  /* 冠内镂空：几处深缝，别让冠成一整块实心 */
  for (let i = 0; i < 7; i++) {
    const a = rng() * Math.PI * 2, rr = R * (0.25 + rng() * 0.6);
    px(g, cx + Math.cos(a) * rr, cyC + Math.sin(a) * rr * 0.8,
       2 + ((rng() * 3) | 0), 2, "rgba(20,34,18,0.34)");
  }

  drawStrands(false);                                  // 前层（压在冠上，读作垂到前面）
  speckle(g, cx - R - 2, cyC - RY, R * 2 + 4, gy - cyC + RY, "rgba(0,0,0,0.14)", 70, rng);
  return { canvas: c, ax: cx, ay: gy };
}

/* --- 4.7.3 开花树：花团 + **压在上面的枝条**，冠内露枝 → 才不像一个粉球 --- */
function makeBlossom(seed) {
  const rng = makeRng(seed);
  const W = 66, H = 78;
  const c = mkCanvas(W, H), g = c.getContext("2d");
  const cx = W >> 1, gy = H - 5;                       // 33, 73
  const bark = "#6b4a2f";
  const trunkH = 18 + ((rng() * 5) | 0);
  const tw = 7, tx = cx - (tw >> 1);
  const ty = gy - trunkH, cyB = ty - 4, R = 24, RY = 15;   // 冠偏扁：樱花树不是正球

  shadowBlob(g, cx + 10, gy - 1, 21, 7, 0.32, 4);
  px(g, tx - 2, gy - 4, tw + 4, 4, shade(bark, -0.14));
  px(g, tx, ty, tw, trunkH, bark);
  for (let i = 0; i < trunkH; i++) {
    px(g, tx, ty + i, 2, 1, shade(bark, 0.16));
    px(g, tx + tw - 2, ty + i, 2, 1, shade(bark, -0.34));
  }
  speckle(g, tx, ty, tw, trunkH, "rgba(0,0,0,0.22)", 12, rng);

  /* 主枝：先画一层（会被花团压住大半，枝梢留在花外面） */
  const twig = [];
  for (let i = 0; i < 6; i++) {
    const a = -Math.PI / 2 + (i / 5 - 0.5) * 2.0 + (rng() - 0.5) * 0.24;
    twig.push({ a: a, L: 15 + rng() * 11 });
  }
  for (const b of twig)
    seg(g, cx, ty + 1, cx + Math.cos(b.a) * b.L, ty + 1 + Math.sin(b.a) * b.L * 0.9,
        shade(bark, -0.10), 2);

  /* 花团：**团要小**（r 4.5~8）—— 团一大就并成一颗球，看得出一个个花团
     才有"开花"的样子。三遍：背光底（右下）/ 主体 / 迎光顶（左上）。 */
  const cl = [];
  for (let i = 0; i < 15; i++) {
    const a = (i / 15) * Math.PI * 2 + rng() * 0.4;
    const rr = 0.32 + rng() * 0.68;
    cl.push({ x: cx + Math.cos(a) * R * rr, y: cyB + Math.sin(a) * RY * rr, r: 4.5 + rng() * 3.5 });
  }
  cl.sort((p, q) => p.y - q.y);
  for (const o of cl) {
    const k = clamp(0.14 - ((o.x - cx) / R * 0.5 + (o.y - cyB) / RY * 0.85) * 0.24, -0.26, 0.26);
    circlePx(g, o.x, o.y, o.r, shade(BL_M, k));
  }
  for (let i = 0; i < 6; i++)                          // 右下背光（压深，略微溢出轮廓）
    circlePx(g, cx + R * 0.26 + rng() * R * 0.62, cyB + RY * 0.20 + rng() * RY * 0.66,
      3 + rng() * 3.6, shade(BL_D, -rng() * 0.12));
  for (let i = 0; i < 10; i++)                         // 左上迎光（提亮）
    circlePx(g, cx - R * 0.12 - rng() * R * 0.58, cyB - RY * 0.20 - rng() * RY * 0.66,
      3 + rng() * 3.6, shade(BL_L, 0.04 + rng() * 0.14));

  /* 压在花团**上面**的小枝：5 根 1px 深线，起点从 0.35R 起（不再挤在圆心）。
     这是"粉球"与"花树"的分水岭 —— 花团没有枝在前面切一下，颜色再准也读成一坨。 */
  for (let i = 0; i < 5; i++) {
    const a = -Math.PI / 2 + (i / 4 - 0.5) * 2.3 + (rng() - 0.5) * 0.3;
    const L = R * (0.62 + rng() * 0.48);
    seg(g, cx + Math.cos(a) * R * 0.35, cyB + Math.sin(a) * RY * 0.35,
        cx + Math.cos(a) * L, cyB + Math.sin(a) * L * 0.82,
        "rgba(74,46,40,0.42)", 1);
  }
  /* 单朵花：1~2px 的亮点，把大色块打散成一簇簇花。
     rr 刻意放到 1.12R —— 让一部分花**长到轮廓外面**，剪影才不是一条光滑的弧。 */
  for (let i = 0; i < 30; i++) {
    const a = rng() * Math.PI * 2, rr = R * (0.22 + rng() * 0.90);
    const fx = cx + Math.cos(a) * rr, fy = cyB + Math.sin(a) * rr * 0.80;
    const lit = (fx - cx) / R * -0.5 + (fy - cyB) / RY * -0.8 + 0.2;   // >0 = 偏迎光面
    const r2 = rng();
    /* ⚠️ 迎光侧的花点**不要**再提亮：BL_L 已经是近白 (#fdf3f6)，
       再加 0.10 就是纯白，落在粉团上是一粒扎眼的雪点（12× 局部一眼就看见）。
       迎光只给 2px（比背光少），否则白点比花团还跳。 */
    circlePx(g, fx, fy, r2 < (lit > 0 ? 0.24 : 0.48) ? 2 : 1,
      lit > 0 ? BL_L : shade(r2 < 0.5 ? BL_M : BL_D, r2 < 0.5 ? 0.10 : -0.08));
  }
  /* 落花：树下稀疏的粉点（避开树干正下方） */
  for (let i = 0; i < 16; i++) {
    const fx = (rng() - 0.5) * 42, fy = rng() * 9, cp = rng();
    if (Math.abs(fx) < 6) continue;
    px(g, cx + fx, gy - 2 - fy, 1, 1, cp < 0.5 ? rgba(BL_L, 0.85) : rgba(BL_M, 0.78));
  }
  return { canvas: c, ax: cx, ay: gy };
}

/* --- 4.7.3b 白杨：南门 → 校徽雕塑 那条大道的行道树（用户 2026-09-13 追加）---
   口述：「南门到校徽雕塑这条路两边的树是比较高的白杨树，参考白杨的树干特点和高度，
   清理现在这条路旁边的树重新种上白杨」。
   白杨有三个识别点，少任何一个都会退化成一棵"胖针叶"：
     ① **又高又窄**。全校园最高（132 vs 针叶 104），同时是**圆柱形**树冠 ——
        宽:高 ≈ 1:2.9（针叶是 1:1.9）。高是靠"比谁都高"读出来的，窄是靠比例。
     ② **树干又长又白**。毛白杨树皮灰白，而且**露出很长一截**（约全高的 40%）。
        "树冠挂得高"是这棵树第一眼的东西 —— 树干只露一小截就成了一把伞。
     ③ **树皮上的菱形皮孔**。毛白杨灰白树皮上那一颗颗深色小斑，是它区别于
        其他白干树的关键（桦树是横纹，法国梧桐是片状剥落）。
   冠用**灰绿**（比阔叶更灰、比针叶更亮），收尾撒一层银白高光 ——
   对应"风一吹满树叶子翻白"的白杨标志性观感。 */
const POP_D = "#4d6c3c", POP_M = "#71965a", POP_L = "#a6c47f";   // 白杨冠：灰绿
const POP_BARK = "#adad9e", POP_BARK_L = "#cbcbbc", POP_BARK_D = "#7e8072";
const POP_MARK = "#6d6f62";                                       // 树皮菱形皮孔
function makePoplar(seed) {
  const rng = makeRng(seed);
  const W = 46, H = 132;
  const c = mkCanvas(W, H), g = c.getContext("2d");
  const cx = W >> 1, gy = H - 5;                       // 23, 127
  const tw = 9, tx = cx - (tw >> 1);                   // 树干 19..27
  const crownTop = 8, crownBot = gy - 53;              // 冠 8..74（占 52%）
  const ty = crownBot - 14;                            // 树干从冠内 14px 处起画
  const R = 13, lean = rng() * 6.28;

  /* 投影：白杨是**窄**树，影子不能照抄针叶的 15px 宽，否则比树还胖 */
  shadowBlob(g, cx + 5, gy - 1, 11, 5, 0.28, 4);

  /* 树干：白干 + 左缘提亮 + 右缘压暗 + 根外扩 */
  px(g, tx - 3, gy - 3, tw + 6, 3, shade(POP_BARK, -0.20));         // 根外扩
  px(g, tx, ty, tw, gy - ty, POP_BARK);
  for (let i = 0; i < gy - ty; i++) {
    px(g, tx, ty + i, 2, 1, POP_BARK_L);
    px(g, tx + tw - 2, ty + i, 2, 1, POP_BARK_D);
  }
  /* ② 菱形皮孔：稀疏、错开落点，太密会读成"花树干" */
  for (let i = 0; i < 9; i++) {
    const yy = ty + 10 + i * 7 + ((rng() * 4) | 0);
    if (yy > gy - 6) break;
    px(g, tx + 1 + ((rng() * (tw - 3)) | 0), yy, 1, 1, POP_MARK);
    px(g, tx + 1 + ((rng() * (tw - 3)) | 0), yy + 1, 1, 1, rgba(POP_MARK, 0.55));
  }
  /* 冠底那几根短枝：白杨的枝向上收，画成斜向上的 1px 短线即可 */
  for (const s of [-1, 1]) {
    const bx = cx + s * 3;
    for (let i = 0; i < 3; i++) px(g, bx + s * i, crownBot - 4 + i * 3, 1, 3, POP_D);
  }

  /* 冠：逐行扫。**纺锤形**（上下都收、最宽在 45% 处），不是针叶那种直线锥。
     ① 中心线随高度轻摆（白杨很直，摆幅只给针叶的 0.6 倍）
     ② 半宽 = 纺锤基线 + 逐行抖动 ⇒ 轮廓不规则，不是几何橄榄球 */
  for (let y = crownTop; y <= crownBot; y++) {
    const t = (y - crownTop) / (crownBot - crownTop);
    const cxo = cx + Math.round(Math.sin(t * 2.2 + lean) * 1.0);
    const hw = Math.max(2, R * (0.30 + 0.70 * Math.pow(Math.sin(Math.PI * (0.10 + 0.80 * t)), 0.85))
                           + (rng() - 0.5) * 1.6);
    const x0 = Math.round(cxo - hw), w = Math.max(2, Math.round(hw * 2));
    const k = 0.16 - t * 0.32;                         // 上亮下暗（比针叶浅：白杨冠是透光的）
    px(g, x0, y, w, 1, shade(POP_M, k));
    px(g, x0, y, 1, 1, shade(POP_M, k + 0.26));        // 左缘受光
    px(g, x0 + w - 1, y, 1, 1, shade(POP_M, k - 0.30)); // 右缘背光
  }
  /* 冠内镂空（透光），别做成一整块实心的橄榄球 */
  for (let i = 0; i < 22; i++) {
    const t = rng();
    px(g, cx + (rng() * 2 - 1) * R * 0.62, crownTop + t * (crownBot - crownTop),
       1 + ((rng() * 2) | 0), 1, "rgba(26,44,22,0.32)");
  }
  /* ① 银白叶背：这是白杨的招牌（风一吹满树翻白）。
     ⚠️ 暗斑要**比针叶少**（针叶靠暗斑读层叠，白杨靠亮斑读翻白）——
        第一版暗斑 70 颗压在同色冠上，整棵读成了柏树。 */
  speckle(g, cx - R - 2, crownTop, R * 2 + 4, crownBot - crownTop,
          "rgba(0,0,0,0.10)", 34, rng);
  speckle(g, cx - R - 2, crownTop, R * 2 + 4, crownBot - crownTop,
          "rgba(226,240,200,0.22)", 78, rng);
  /* 顶芽：白杨的顶芽是一根收得很细的尖 */
  px(g, cx, crownTop - 4, 2, 5, shade(POP_L, -0.10));
  px(g, cx, crownTop - 7, 1, 4, shade(POP_L, 0.08));
  return { canvas: c, ax: cx, ay: gy };
}

/* --- 4.7.3c 白杨大道：两排、**树根 x 写死**（用户 2026-09-13 追加）---
   用户原话：「白杨排布一定要整体，树根的 x 轴坐标要一致」。
   §4.7.3b 的做法是**换分发**（把走廊里原有的树改成白杨），位置还是 scatter() /
   plantRows() 撒出来的那一堆乱点 —— 树根 x 从 1931 到 2183 都有，其中三棵
   （x2085 / 2094 / 2097）干脆**长在沥青上**（scatter 的 K.ROAD 分支本来就会种树）。
   所以这一节改成"**清场 + 补种**"：先把走廊里已有的树删掉，再按固定 x 补两排。
   ⚠️ 四个非显然点：
     ① **x 是两个写死的常量，不是按路算的**。路面栅格化之后是 x1952..2111
        （`_gt.py` 量的，`ROADCLS=2` 那 10 格），两侧草地各 64 / 112 px 宽。
        两排取"路面边线各外扩 AVE_ROW_DX"⇒**关于路轴 2032 对称**：
        西 1952−32=**1920**、东 2112+32=**2144**。两棵树冠（各 46 宽）因此
        离沥青都还有 9px 净空，不会盖到路面上。
        ⚠️ 别改成从 `ARTERY` 那条矩形（x1955.6..2102.3）反算 —— 它的中轴 2028.95
           与**栅格化后**的中轴 2032 差 3px，两排会歪。
     ② **y 只取草地那一段**（实测两排都是 y1968..2310 是草，2310 以南是砖石、
        2336 起是南门入口广场）⇒ 大道止于广场北沿，广场里不种树（对的）。
        ⚠️ 北端还有一个硬约束：**树冠顶必须留在雕塑净空框 DIA_CLR 下沿（y1863）之外**，
           否则 `clearDiaClearance()` 按**美术盒**判、会把整棵无声无息地删掉。
           白杨 `ay = 127` ⇒ 树根必须 > 1990。取 **1994**（冠顶 1867，留 4px 余量）。
           本节的 keepOut 检查就是把这个约束**显式**写出来，不靠"我算过"。
     ③ **清场只删 `tag === "tree"`**：路灯 / 桶 / 椅本来就没有 tag，校名石 / 石狮 /
        雕塑 / 后围石 / 旗帜各有自己的 tag —— 一个都不会误伤。
        ⚠️ 清场框（x1888..2224）比 `SOUTH_AVE` 窄：`SOUTH_AVE` 西界 1836 那一带有
           另一条纵向主路（x≈1792），那里的树是**那条路**的行道树，不能一起清掉。
     ④ **两排 y 对齐**（同一 y 上左右各一棵，成"门"），不是交错 —— 用户要的"整体"
        就是这个观感；y 按等分取点（同 §4.7.6b），首尾恰好压在两端，间距均匀。 */
const AVE_ROW_DX = 32;                                  // 树根离沥青边线
const AVE_X_W = 1920, AVE_X_E = 2144;                   // 西 / 东两排的固定树根 x
const AVE_Y0 = 1994, AVE_Y1 = 2310, AVE_SP = 80;        // 草地段（>1990 是为了避开 DIA_CLR）
const AVE_CLR = { x: 1888, y: 1950, w: 336, h: 540 };   // 清场框 x1888..2224 / y1950..2490
function plantPoplarAve() {
  /* ① 清场：删掉走廊里已有的树（scatter 撒的 + plantRows 种的行道树） */
  const CX1 = AVE_CLR.x + AVE_CLR.w, CY1 = AVE_CLR.y + AVE_CLR.h;
  const keep = [];
  let cleared = 0;
  for (const p of props) {
    if (p.tag === "tree" &&
        p.x > AVE_CLR.x && p.x < CX1 && p.y > AVE_CLR.y && p.y < CY1) { cleared++; continue; }
    keep.push(p);
  }
  props.length = 0;
  for (const p of keep) props.push(p);

  /* ② 补种：两排固定 x，y 等分；每棵都过 terrain + 净空 + 边界三道检查 */
  const keepOut = [DIA_CLR, FLAG_CLR];                  // 见 ①/② 的注释（美术盒判删）
  const nx = Math.max(1, Math.round((AVE_Y1 - AVE_Y0) / AVE_SP));
  let placed = 0;
  for (let i = 0; i <= nx; i++) {
    const y = AVE_Y0 + (AVE_Y1 - AVE_Y0) * i / nx;
    for (const side of [0, 1]) {
      const x = side ? AVE_X_E : AVE_X_W;
      if (!insideBoundary(x, y) || distToBound(x, y) < 30) continue;
      if (cellAtSafe(x, y) !== K.GRASS) continue;       // 树根必须落在草地上
      if (ptBlocked(x, y, 16, 11)) continue;            // 压到碰撞盒（楼 / 围墙）
      let bad = false;
      for (const C of keepOut)                          // 探进净空框 = 待会儿被整棵删掉
        if (x - 23 < C.x + C.w && x + 23 > C.x &&
            y - 127 < C.y + C.h && y > C.y) { bad = true; break; }
      if (bad) continue;
      addProp(Object.assign({},
        makeStreetTree((i * 613 + side * 41 + 7) | 0, x, y), { x: x, y: y }));
      placed++;
    }
  }
  return { planted: placed, cleared: cleared };
}

/* --- 4.7.4 物种分发（**不摇随机**：全靠 seed 的数值） --- */
/* 白杨大道：南门 → 校徽雕塑 那条路的**两侧**（用户 2026-09-13）。
   做成一条**显式**走廊而不是"沿路判断"，因为判据必须与树的实际分布对得上：
   路由 `ARTERY` 的「南门纵向」给出（x IX(5.0070)..IX(5.3826) = 1956..2102），
   两侧各外扩 ~120px 正好兜住真正站在路缘的那批树（实测离中轴 55~153px）。
   ⚠️ y 从 1916 起、**不是**从路面北端的 1875 起：思源楼前大草坪的整治区
      （`LAWN_ZONE` = 草坪矩形外扩 40）下沿是 1915.1，草坪那圈边界树就长在
      1916 上面一点点 —— 走廊探进整治区会把**草坪的南边那排**也变成白杨，
      而那是草坪的边、不是这条路的边（两者差 90°，方向都不对）。
   ⚠️ 走廊一律**不摇随机**（只看坐标），所以树的条数 / 位置一个都不变，
      只是物种换了 —— 这正是用户要的"清理现在这条路旁边的树重新种上白杨"。 */
const SOUTH_AVE = { x0: 1836, x1: 2222, y0: 1916, y1: 2500 };
function onSouthAve(x, y) {
  return x > SOUTH_AVE.x0 && x < SOUTH_AVE.x1 && y > SOUTH_AVE.y0 && y < SOUTH_AVE.y1;
}

/* 水岸判定：查 ±3 格（≈±48 世界 px ≈ 5.3 m）而不是 ±1 格。
   ⚠️ 一开始写的是 ±1 格，结果**全校园 0 棵柳**（柳成了死代码）：
   `classifyFree` 把离水 25px 内的一圈格子全划成了 K.ROAD（贴水留白的走廊），
   真正的 K.WATER 格被这圈走廊推远了 —— 最近的树离水格还有 2 格。 */
function waterNear(x, y) {
  const cx = (x / CELL) | 0, cy = (y / CELL) | 0;
  for (let j = -3; j <= 3; j++)
    for (let i = -3; i <= 3; i++) {
      const a = cx + i, b = cy + j;
      if (a < 0 || b < 0 || a >= NW || b >= NH) continue;
      if (CELLK[b * NW + a] === K.WATER) return true;
    }
  return false;
}
function anyTree(seed, x, y) {
  /* ⚠️ tag 是给**离线探针**用的（props_probe.py 靠它区分"树"与"路灯"）——
     路灯也是 32×84 的细高精灵，只按尺寸判会把路灯当成树，
     于是探针报出一堆假重叠。判定一律走 tag，不靠尺寸猜。 */
  const t = onSouthAve(x, y) ? makePoplar(seed)        // 白杨大道（最高优先级）
          : waterNear(x, y) ? makeWillow(seed)         // 水边一律柳
          : ((seed >>> 0) % 100) < 50 ? makeTree(seed) // 阔叶（原物种，占多数）
          : ((seed >>> 0) % 100) < 78 ? makeConifer(seed)  // 针叶
          :                             makeBlossom(seed); // 开花（≤22%：
  t.tag = "tree";                                      //   开花的粉在 1× 下最跳）
  return t;
}

/* --- 4.7.5 树坑：石框 + 土面。只画左右两片和两段前缘 ——
   树干在正中，后缘（远侧）本来就该被树干挡住，画了反而压在树干上。 --- */
function treePit(g, ax, ay) {
  const KERB = "#a9a496", SOIL = "#4a3a28", SOILL = "#5d4a34";
  for (const d of [-1, 1]) {
    const x0 = ax + d * 5;
    px(g, x0, ay - 5, 9, 5, SOIL);
    px(g, x0, ay - 5, 9, 1, SOILL);                    // 土面受光的那一条
    px(g, x0 + (d > 0 ? 8 : 0), ay - 6, 1, 7, KERB);   // 外侧石框
    px(g, x0 + (d > 0 ? 8 : 0), ay - 6, 1, 2, shade(KERB, 0.20));
    px(g, x0 + (d > 0 ? 8 : 0), ay - 1, 1, 2, shade(KERB, -0.26));
  }
  /* 前缘（近侧）石框：留出中间 10px 的缺口给树干落地 */
  px(g, ax - 14, ay - 1, 10, 2, "#8a8779");
  px(g, ax + 5,  ay - 1, 10, 2, "#8a8779");
  px(g, ax - 14, ay - 1, 10, 1, KERB);
  px(g, ax + 5,  ay - 1, 10, 1, KERB);
}
function makeStreetTree(seed, x, y) {
  const t = anyTree(seed, x, y);                       // 每次都是新画布，可安全就地改
  treePit(t.canvas.getContext("2d"), t.ax, t.ay);
  return t;
}

/* --- 4.7.6 行道树 / 广场树阵 ---
   做法：撒一张 ROW_SP 的**规则点阵**，每个点先试 (0,0)、再试一圈小偏移，
   取第一个合法位置。因为绝大多数点都落在 (0,0) 上，树的间距就天然是
   等距的 —— 这才有"沿路成行"的观感，而不是 scatter() 那种网格乱撒。 */
const ROW_SP = 118;                                    // 行道树间距（世界像素）≈ 13 m
function roadAt(cx, cy) {
  if (cx < 0 || cy < 0 || cx >= NW || cy >= NH) return false;
  return CELLK[cy * NW + cx] === K.ROAD;
}
function plazaClear(cx, cy) {
  for (let j = -1; j <= 1; j++)
    for (let i = -1; i <= 1; i++) {
      const a = cx + i, b = cy + j;
      if (a < 0 || b < 0 || a >= NW || b >= NH) return false;
      if (CELLK[b * NW + a] !== K.PLAZA) return false;   // 离广场边 ≥16px 才种
    }
  return true;
}
function treeSpotOK(x, y) {
  if (!insideBoundary(x, y) || distToBound(x, y) < 30) return false;
  if (ptBlocked(x, y, 16, 11)) return false;
  const cx = (x / CELL) | 0, cy = (y / CELL) | 0, k = cellAtSafe(x, y);
  let ok = false;
  if (k === K.GRASS) {
    if (roadAt(cx - 1, cy) || roadAt(cx + 1, cy) ||
        roadAt(cx, cy - 1) || roadAt(cx, cy + 1)) ok = true;      // 贴路缘 → 行道树
    /* 湖岸那一圈也是"路"（classifyFree 会把贴水的留白划成走廊），
       所以岸边自然长出成排的垂柳，不用单独写一套湖岸逻辑。 */
  } else if (k === K.PLAZA) {
    ok = plazaClear(cx, cy);                                      // 广场中央 → 树阵
  }
  if (!ok) return false;
  return treeFreeOfProps(x, y);
}
/* 树基位与既有道具是否相撞。⚠️ 三条判据缺一不可：
   ① **拿美术盒判相交，不能拿"距离小于 N"** —— 树比垃圾桶高得多，一个落在树基
      北侧 67px 的垃圾桶按距离算早就"够远"，实际上正好糊在树冠尖上，
      实地看就是"树上挂了个箱子"。
   ② **楼（宽 > 90）整个跳过** —— 楼在树基北侧时深度排序本来就把它画在树后面，
      露在墙前的那排树是对的（实测过：不跳过的话行道树会被楼的美术盒全判掉，
      79 棵只剩 10 棵）。
   ③ **只查在树北侧（p.y ≤ y，即画在树之前）的道具** —— 南侧的道具遮住树干是
      正确的遮挡关系，不算冲突。
   树的盒取保守值（x±34、y-96 起）：树画布差异大（垂柳 86 宽、针叶 104 高），
   为每个候选点现算一遍不划算。
      ⚠️ 抽成函数是给 §4.7.6b 的草坪边界树圈共用 —— 两处判据必须**逐字相同**，不是为了好看。
   ④（2026-09-13 追加）`skip` 参数：§4.7.6b 的树圈间距 62px **小于**上面这个保守盒
      （x±34 ⇒ 两棵相邻树必然互相判成"撞上"），不排除自己人的话整圈只剩零星几棵。
      plantRows 传 undefined（行道树间距 118 够宽，历史上没触发过，传了会改变既有 88 棵
      的分布 —— 那是回归，不能碰）。
       ⚠️ `skip` 必须判 `skip &&`：不判的话 skip === undefined 会把**所有没 tag 的
          道具**（桶/椅/花坛/灯）整批跳过，行道树会从 88 棵涨到 97 棵 —— 这是个
          肉眼看不出来、只改一个计数的回归。
   ⑤ `skipInside` 矩形：跳过落在框内的道具。§4.7.6b 传**草坪矩形** —— 草坪里那些
      散落的桶/椅/花坛反正马上会被 §4.7.6c 清掉，但树圈是在清理**之前**种的，
      不跳的话南边一整排会被它们顶掉（实测：南边 7 个位全灭）。 */
function treeFreeOfProps(x, y, skip, skipInside) {
  for (const p of props) {
    if (skip && p.tag === skip) continue;
    if (p.img.width > 90 || p.y > y + 4) continue;
    if (skipInside &&
        p.x > skipInside.x && p.x < skipInside.x + skipInside.w &&
        p.y > skipInside.y && p.y < skipInside.y + skipInside.h) continue;
    const px0 = p.x - p.ax, py0 = p.y - p.ay;
    if (px0 < x + 34 && px0 + p.img.width  > x - 34 &&
        py0 < y - 10 && py0 + p.img.height > y - 96) return false;
  }
  return true;
}
const _rowUsed = [];
function plantRows() {
  const OFF = [[0, 0], [0, -7], [0, 7], [-7, 0], [7, 0], [-7, -7], [7, 7],
               [-7, 7], [7, -7], [0, -14], [0, 14], [-14, 0], [14, 0]];
  let n = 0;
  for (let py = ROW_SP >> 1; py < WORLD_H; py += ROW_SP) {
    for (let px = ROW_SP >> 1; px < WORLD_W; px += ROW_SP) {
      for (const o of OFF) {
        const x = px + o[0], y = py + o[1];
        if (!treeSpotOK(x, y)) continue;
        let near = false;
        for (const u of _rowUsed)
          if (Math.abs(u[0] - x) < 70 && Math.abs(u[1] - y) < 70) { near = true; break; }
        if (near) continue;
        addProp(Object.assign({}, makeStreetTree((n * 761 + 97) | 0, x, y), { x: x, y: y }));
        _rowUsed.push([x, y]);
        n++;
        break;
      }
    }
  }
  return n;
}

/* --- 4.7.6b 思源楼前大草坪：边界一圈树，中间只留草（用户 2026-09-13 追加）---
   口述：「对于思源楼门口的草坪，我需要草坪外围都围上树，也就是草坪的边界都是树，
   中间只有草地」。
   做法：沿草坪矩形的四条边按 LAWN_SP 排一圈行道树（带树坑），再由 §4.7.6c 把草坪里
   其余道具清掉。
   ⚠️ 四个非显然点：
     ① **调用点在 §6.6 里的位置**：必须排在 plantRows() **之后**、四个 clear* **之后**、
        鸭子下水**之前**（三条理由写在 60_assemble.js 的挂点上，实测数据也在那里）。
     ② **判据要求 K.GRASS** —— 这一条顺带把两个凹口（升旗台 §5.2 / 雕塑 §5.3，格子都是
        K.BLD）自动跳过了，不用另写"避开凹口"。
     ③ 树基取**草坪边线往里 LAWN_INSET**：树冠（最宽 86）因此有约 35px 探到草坪外的
        路上 —— 真实校园里草坪边那圈树就是这样半悬在路缘上的。
     ④ 间距 LAWN_SP 取得比行道树（118）密得多 —— 用户要的是"边界**都是**树"，
        不是"边界有树"。62 那版实测只有 13 棵 / 周长约 1422px（平均 110px 一棵），
        画面上是一圈稀稀拉拉的树；50 才连成一道树墙。
        ⚠️ 间距必须 > 46（`_lawnUsed` 的去重半径），否则相邻两棵互判"太近"，
           一圈又只剩下零星几棵 —— 这是把 62 调小之前唯一要看的数。
   ⚠️ 草坪矩形取 CAMPUS 里**与思源楼同 x** 的那条 grass（4.6056 / 4.0208 / 1.1528 /
      0.7799）：全校园 5 块草坪只有它和思源楼共用 x，也就是"楼正前方那一整块"。
      实测这条矩形（x1798.9..2249.2 / y1570.5..1875.1）与栅格化后的草地差 ≤13px，
      四条边都正好落在草格里，靠 ② 的 K.GRASS 判据兜底。 */
const LAWN_INSET = 16;                                 // 树基距草坪边线（世界像素）
const LAWN_SP    = 50;                                 // 沿线间距 ≈ 5.6 m（> _lawnUsed 的 46）
const LAWN = (() => {
  const sy = CAMPUS.find(c => c[1] === "siyuan");
  const e  = CAMPUS.find(c => c[1] === "grass" && Math.abs(c[2] - sy[2]) < 1e-6);
  return { x: IX(e[2]), y: IX(e[3]), w: IX(e[4]), h: IX(e[5]) };
})();
/* 草坪"整治区" = 草坪矩形 + 四周 LAWN_BAND 的一条带（§4.7.6c 用它清场）。
   ⚠️ 为什么是**外扩的带**而不只是草坪本身：贴草坪边线外侧 4~30px 站着的散射树 /
   路灯，根**不在**草坪上，可它们的树冠盒正好压住边界树的坑 —— 实测北边两棵、东边
   两棵就是这么把树圈顶出缺口的。这些"冒充边界树"的东西必须一起清掉（用户原话：
   「树的根部要求在草坪上，不能跑其他地方去」），否则树圈永远围不满。 */
const LAWN_BAND = 40;
const LAWN_ZONE = { x: LAWN.x - LAWN_BAND, y: LAWN.y - LAWN_BAND,
                    w: LAWN.w + LAWN_BAND * 2, h: LAWN.h + LAWN_BAND * 2 };
const _lawnUsed = [];
function lawnSpotOK(x, y) {
  if (!insideBoundary(x, y) || distToBound(x, y) < 30) return false;
  if (ptBlocked(x, y, 16, 11)) return false;
  if (cellAtSafe(x, y) !== K.GRASS) return false;
  for (const u of _lawnUsed)
    if (Math.abs(u[0] - x) < 46 && Math.abs(u[1] - y) < 46) return false;
  return treeFreeOfProps(x, y, "lawnTree", LAWN_ZONE);
}
function lawnTree(n, x, y) {
  /* tag 用 "lawnTree"：§4.7.6c 的清理**只放行**这个 tag，用它把"边界树"与草坪里
     散落的树区分开（两者都是 tag "tree" 的话，边界树会被自己的清理删掉）。 */
  addProp(Object.assign({}, makeStreetTree((n * 419 + 23) | 0, x, y),
                        { x: x, y: y, tag: "lawnTree" }));
  _lawnUsed.push([x, y]);
}
function plantLawnRing() {
  const L = LAWN, i = LAWN_INSET, s = LAWN_SP;
  const x0 = L.x + i, x1 = L.x + L.w - i, y0 = L.y + i, y1 = L.y + L.h - i;
  const OFF = [[0, 0], [0, -6], [0, 6], [-6, 0], [6, 0], [0, -12], [0, 12], [-12, 0],
               [12, 0], [-12, -12], [12, 12], [-12, 12], [12, -12]];
  let n = 0;
  /* 每个位置试一圈小偏移取第一个合法点 —— 与 plantRows 同一套做法：绝大多数落在
     (0,0) 上，于是线是直的；个别被占的点也能就近挪开，而不是整棵消失（留个洞）。 */
  const put = (bx, by) => {
    for (const o of OFF)
      if (lawnSpotOK(bx + o[0], by + o[1])) { lawnTree(n, bx + o[0], by + o[1]); n++; return; }
  };
  /* ⚠️ 两个轴向都按**等分**取点，不是 `for (x = x0; x <= x1; x += s)`：
     后者步长固定，最后一格落在哪里看运气 —— 实测草坪东西向 418.3px / 步长 50
     走到 2214.9 就没了，**东侧两个角（x1 = 2233.2）永远轮不到**，东北 / 东南角
     于是秃着（`_lawnUsed` 的去重半径 46 也不允许在末尾硬补一棵）。
     等分之后首尾都恰好压在 x0 / x1 上，间距 52.3 / 54.5 也都 > 46。 */
  const nx = Math.max(1, Math.round((x1 - x0) / s));
  const ny = Math.max(1, Math.round((y1 - y0) / s));
  for (let i = 0; i <= nx; i++) {                       // 北 / 南两边（含四个角）
    const x = x0 + (x1 - x0) * i / nx;
    put(x, y0); put(x, y1);
  }
  for (let j = 1; j < ny; j++) {                        // 西 / 东两边（角已由上一行负责）
    const y = y0 + (y1 - y0) * j / ny;
    put(x0, y); put(x1, y);
  }
  return n;
}

/* --- 4.7.6c 草坪整治区清场（用户 2026-09-13）---
   清两件事：① 草坪**内部**散落的小道具（灯 / 桶 / 椅 / 花坛 / 蒲公英……）——
   用户要「中间只有草地」；② 草坪**边线外 LAWN_BAND 以内**、根不在草坪上的东西
   —— 用户要「树的根部要求在草坪上，不能跑其他地方去」，且它们会把树圈的坑顶掉
   （见 LAWN_ZONE 的注释）。
   ⚠️ 四条：
     ① 与 §5.2.8 / §5.3.10 同款：必须排在 §6.6c 的 clearPropTreeClash() **之后**，
        先跑会改变它保留 / 丢弃的集合，clashDropped 的计数跟着变。
     ② 判据用**接地点**（p.x, p.y），**不用美术盒**：树冠探到草坪上空正是"边界树"该有的
        样子，按盒判会把草坪外那一圈树也一起删掉（与 §5.2.8 的净空框是两种相反的需求
        —— 那里要防树冠盖住主体，这里只看"根扎在哪"）。
     ③ 必须在 plantLawnRing() **之前**：清完场树圈才围得满（`60_assemble.js` 有断言）。
     ④ 白名单放行边界树 + 草坪上本来就该有的主体（升旗台 §5.2 / 雕塑 §5.3 与后围石）
        + 楼（宽 > 90）。树的最宽是 86，所以树一律进不了白名单 —— 正是要清的对象。 */
function clearLawnZone() {
  const Z = LAWN_ZONE, x1 = Z.x + Z.w, y1 = Z.y + Z.h;
  const keep = [];
  let dropped = 0;
  for (const p of props) {
    if (p.tag === "lawnTree" || p.tag === "flag" || p.tag === "diaosu" ||
        p.tag === "diaRing" || p.img.width > 90) { keep.push(p); continue; }
    if (p.x > Z.x && p.x < x1 && p.y > Z.y && p.y < y1) { dropped++; continue; }
    keep.push(p);
  }
  props.length = 0;
  for (const p of keep) props.push(p);
  return dropped;
}
