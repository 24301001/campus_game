/* =========================================================
   4.5 水域
   ---------------------------------------------------------
   静态底烘焙进地面（paintWaterBase），动态层每帧现画（drawWater）：
   正弦波纹 + 鱼影 + 鸭子划水。动态层插在地面之后、道具之前 ——
   这样人物/树/建筑仍然压在水的上方，遮挡关系不掉。

   水位不参与深度排序（是贴地层），所以这里必须严格限制在池内绘制。
   ========================================================= */
const WATER = CAMPUS.filter(e => e[1] === "water").map(e => ({
  x: IX(e[2]), y: IX(e[3]), w: IX(e[4]), h: IX(e[5])
}));
let waterT = 0;
const ducks = [];
const fishes = [];
/* 水里的障碍（湖心岛 / 石塔）的落地范围，由 56_minghu.js 在 addSolid 时同步登记
   （见 §4.5.3d）。放这里而不是 45 自己算：岛屿的足迹表达式已经在 56 里了，
   抄一份过来迟早会和那边漂开。 */
const WATER_AVOID = [];

/* --- 鸭子的活动域（第七轮：从"湖面"扩到"湖面 ∪ 南岸石板路"） ---
   用户：「鸭子可以上岸走动或者下水，只能在湖里和下方的小广场活动」。
   ⚠️ 关键在于**湖与广场的 x 范围是同一个表达式**（都是 IX(7.0104)/IX(0.6972)，
      湖底 1328.01 与广场顶 1328.01 严丝合缝）⇒ 两者并集在几何上**就是一个矩形**，
      所以这里能直接读 WATER[0] 的 x/w，不需要写"两块区域的合并"那种判据。
   南界 = 89 * CELL = 1424，是石板路**画出来的**南缘，不是 ARTERY 声明的 1431.62 ——
      cy89（y1424..1440）那一格被后声明的「东西主路」抢走了（坑：同格重叠谁后盖）。
      再往南是沥青主路，鸭子不该上马路。
   ⚠️ 只改这里不改轨道是没用的：鸭子会一辈子在湖北半部绕圈（见 spawnDucks）。 */
const DUCK_AREA = { x: WATER[0].x, y: WATER[0].y, w: WATER[0].w,
                    h: 89 * CELL - WATER[0].y };
/* 湖的南岸线（= 石板路北缘）。鸭子越过它就算"上岸"，换陆地版精灵（见 animateWater）。 */
const WATER_S = WATER[0].y + WATER[0].h;

/* 惊走参数（世界像素 / 每秒）。⚠️ 上升快（RISE）回落慢（FALL）—— 这是用户要的
   "看到人会跑走，游远了再慢慢游回来"的全部实现：外扩用 RISE、归位用 FALL。
   safe 是警戒半径（人进这个圈就开始慌），run 是满恐慌时额外游出的距离。 */
const DUCK_SAFE = 64, DUCK_RUN = 46, DUCK_RISE = 3.2, DUCK_FALL = 0.45;
const FISH_SAFE = 40, FISH_RUN = 60, FISH_RISE = 4.0, FISH_FALL = 0.35;

/* --- 4.5.1 静态底 --- */
function paintWaterBase(g, rng) {
  for (const R of WATER) {
    const x = Math.round(R.x), y = Math.round(R.y), w = Math.round(R.w), h = Math.round(R.h);

    /* 岸边湿土带（比水面外扩一圈） */
    px(g, x - 7, y - 7, w + 14, h + 14, "#6d6151");
    px(g, x - 4, y - 4, w + 8, h + 8, "#5d5344");

    /* 水面：由外向内 4 圈浅化 */
    px(g, x, y, w, h, "#2E6E9E");
    const steps = 4, sx = [0.030, 0.058, 0.088, 0.116], sy = [0.045, 0.086, 0.130, 0.170];
    for (let i = 0; i < steps; i++) {
      const ix = Math.round(w * sx[i]), iy = Math.round(h * sy[i]);
      px(g, x + ix, y + iy, w - ix * 2, h - iy * 2, mix("#2E6E9E", "#7FB4D8", 0.16 * (i + 1)));
    }
    /* 岸线：外侧亮、内侧暗 */
    px(g, x, y, w, 2, "rgba(255,255,255,0.16)");
    px(g, x, y, 2, h, "rgba(255,255,255,0.10)");
    px(g, x, y + h - 3, w, 3, "rgba(8,22,36,0.40)");
    px(g, x + w - 3, y, 3, h, "rgba(8,22,36,0.32)");

    /* 静态鳞光（动态波浪之上还会叠亮线） */
    for (let i = 0; i < (w * h) / 5200; i++) {
      const px0 = x + 8 + rng() * (w - 16), py0 = y + 8 + rng() * (h - 16);
      px(g, px0, py0, 3 + rng() * 7, 1, "rgba(200,230,245,0.30)");
    }
    /* ⚠️ 这里原本还有一句"池心最深处压暗，做出有深度" —— 在湖心盖一个**正圆**：
       `circlePx(g, 湖心x, 湖心y, Math.min(w, h) * 0.30, 半透明深蓝)`，半径取湖短边的三成。
       明湖缩小之后（第三轮）这个半径 ≈82，占到湖宽的一大半，而湖是长方形 ⇒ 画面上
       就是一个**贴上去的暗色圆盘**。用户 2026-09-13：「把湖中间那个暗色的圆形图标
       去掉，有碍观瞻」。
       **直接删掉、不再用别的东西替代**：深度/层次交给上面那 4 圈"由岸向心浅化"负责 ——
       那套设计的意图本来就是"湖心更亮"，再叠一层方向相反的压暗圆，两者在打架。
       （删这一句不消耗 rng，所以鳞光与全校园地面噪声逐字节不变。注释里的颜色值故意
       拆成"半透明深蓝"四个字 —— build.py 有一条否定断言直接 grep 那个 rgba 字面量，
       抄进来会把注释本身当成目标。） */
  }
}

/* --- 4.5.1b 离岸深度 → 淹没比例 ---
   水面本身**没有任何深度数据**。⚠️ 别去打 CELLK 的主意：水格是 floor 盖的
   （x2736..3024 / y1008..1344），比这里画出来的水面（2738.2..3010.5 / 1016.9..1328.0）
   整整大一圈，拿它当深度边界会得到"站在岸上就已经在池心"的荒唐结果。

   判据与 paintWaterBase 那 4 圈由岸向心的浅化**同源**：都是"沿两个轴的对称内缩"。
   于是画面越深的地方，水也淹得越深 —— 观感与物理不会打架（这是刻意的：
   单独拍一个深度公式很容易做出"看着浅其实淹到腰"的错位）。

   ⚠️ 贴岸与岸上**自动收敛到 0**，所以"裁掉的部分露出的是岸不是水"这个边界情况
      不需要额外夹取：裁掉的比例与离岸距离同源，贴岸时几乎不裁。 */
function lakeDepth(x, y) {
  const R = WATER[0];
  if (x < R.x || x > R.x + R.w || y < R.y || y > R.y + R.h) return 0;   // 岸上 → 不淹
  const u = Math.min(x - R.x, R.x + R.w - x) / (R.w * 0.5);
  const v = Math.min(y - R.y, R.y + R.h - y) / (R.h * 0.5);
  return Math.min(1, Math.min(u, v));                 // 0 = 贴岸，1 = 池心
}
/* 湖心最深 = 半个身子（用户指定）。返回值是**占精灵全高的比例**，
   落笔时 `cut = Math.round(CH_H * lakeSubmerge(x, y))` 就是这么用的。

   行预算（`buildChar(6)` 的实际行位，改裁切量之前先回 50_char.js 核一遍）：
     0 顶空 / 1-6 头 / 7 颈 / 8-16 躯干（**16 = 衣摆**）/ 17-24 腿 / 25-26 鞋
     / 27-29 接地影（锚点 CH_AY=27 以下那三行）
   湖心 subm=0.5 → cut=15 → 可见 0..14 行，水线落在**第 15 行**（衣摆稍上、腰的位置）。
   贴岸 subm→0 → cut→0，连接地影都不裁 —— 岸上那一套（含影子）原样保留。

   ⚠️ 别把上界写成"裁掉 CH_AY 行"之类：那三行影子在**锚点以下**，是"落地接触影"，
      人一进水它就该消失（影子画在水面上才假）。这里的比例式会让它在前 0.2 的深度里
      自然淡出（cut 0→3），比"一进水就整块没"更顺眼。 */
const SUBMERGE_MAX = 0.5;
function lakeSubmerge(x, y) { return SUBMERGE_MAX * lakeDepth(x, y); }

/* --- 4.5.1c 水线涟漪 ---
   入水时贴在**淹没线**上的一圈亮弧。只做裁切的话，"淹没"唯一的线索就是身体被一条
   直线切断，缩到 1× 以下根本读不出来；一圈亮环一眼就懂。
   它同时还有第二个作用：压住裁切边的硬直边（环的上半圈落在身体最下面一两行上）。

   ⚠️ 这个函数**在 render() 的落笔循环里、紧跟角色那一笔之后调用**，不是独立道具：
      做成 drawList 项就要跟角色抢 baseY 排序（同 baseY 是"靠 sort 稳定性"的隐性契约，
      不同 baseY 又会插到别的道具前后，两种都是雷）。
      紧跟角色落笔的另一个好处是遮挡天然正确 —— 排在角色之后（更靠南）的道具照样盖住它。
   ⚠️ cy 必须算在**裁切边**上（`dy + (img.height - cut) * z`），不是锚点行。
      写成锚点行 `(player.y - oy) * z` 会让亮环浮到身体上方 CH_AY=27 像素的胸口位置 ——
      这是本功能里最典型的"三套验收全绿、画面上明显错"。 */
function drawSwimRing(g, it, dx, dy, cut, z) {
  const cx = dx + Math.round(it.ax * z);
  const cy = dy + (it.img.height - cut) * z;              // ← 裁切边，不是锚点行
  /* 半径呼吸：水线是一圈在扩的波，不是一根固定的箍 */
  const rx = Math.max(2, Math.round((it.img.width / 2 + 1.5 + 0.5 * Math.sin(waterT * 2.6)) * z));
  const ry = Math.max(1, Math.round(rx * 0.585));         // 水平面在屏上的压扁比（同 MH_HEX_K）
  for (let i = -ry; i <= ry; i++) {
    const t = 1 - (i / ry) ** 2;
    if (t <= 0) continue;
    const hw = Math.round(rx * Math.sqrt(t));
    if (hw < 1) continue;
    /* 北半圈亮、南半圈偏青（光自左上）—— 一圈同色会读成"箍"而不是"波" */
    const col = i < 0 ? "rgba(226,244,255,0.52)" : "rgba(150,196,226,0.42)";
    px(g, cx - hw, cy + i, 1, 1, col);
    px(g, cx + hw, cy + i, 1, 1, col);
    if (hw > 2) { px(g, cx - hw + 1, cy + i, 1, 1, col); px(g, cx + hw - 1, cy + i, 1, 1, col); }
  }
}

/* --- 4.5.2 动态层（每帧） ---
   ox/oy = 相机世界原点（主循环已取整），z = 缩放倍率。
   本函数内部**一律用背板量纲**：世界值减 ox 之后乘 z。 */
function drawWater(ox, oy, z) {
  for (let k = 0; k < WATER.length; k++) {
    const R = WATER[k];
    const sx0 = Math.round((R.x - ox) * z), sy0 = Math.round((R.y - oy) * z);
    const w = R.w * z, h = R.h * z;
    if (sx0 > VIEW_W || sx0 + w < 0 || sy0 > VIEW_H || sy0 + h < 0) continue;

    ctx.save();
    ctx.beginPath();
    ctx.rect(sx0, sy0, w, h);
    ctx.clip();

    /* 正弦亮线。缩得很小时（<0.2×）行距会掉到 1.2px，几十条半透明亮线叠起来
       只会把整池糊成一片灰白 —— 静态烘焙早就把湖色画好了，这一层直接省掉，只留鱼影。 */
    if (z >= 0.2) {
      const RP  = Math.max(3, 13 * z);              // 行距：缩小时不小于 3px，否则同样糊
      const lw  = Math.max(1, Math.round(z));       // 线厚：原先恒 1px，放大后成了发丝
      const step = 26 * z;
      const rows = Math.ceil(h / RP) + 2;
      const drift = (waterT * 5 * z) % RP;          // 相位周期必须跟行距同步，否则上浮会跳
      for (let r = 0; r < rows; r++) {
        const yy = Math.round(sy0 + r * RP + drift);
        const a = 0.07 + 0.07 * Math.sin(waterT * 1.1 + r * 0.9);
        if (a <= 0.02) continue;
        ctx.fillStyle = "rgba(198,232,248," + a.toFixed(3) + ")";
        for (let x = 0; x < w; x += step) {
          const seg = (10 + 8 * Math.sin(waterT * 0.8 + r * 1.7 + x * 0.05)) * z;
          const off = Math.round(6 * Math.sin(waterT * 0.45 + r * 0.6 + x * 0.02) * z);
          ctx.fillRect(sx0 + x + off, yy, Math.max(1, seg), lw);
        }
      }
    }

    /* 鱼影：只露一团深色，位置由 animateWater 推进（世界坐标 → 背板量纲）。
       ⚠️ 鱼**必须留在这个函数里画**，不能升级成道具：鱼在水下、人站在水面上，
          鱼影就该在人的脚底下。做成 props 会参与 baseY 排序，站到鱼南边时鱼会浮到人身上。 */
    const fw = Math.max(1, Math.round(7 * z)), fh = Math.max(1, Math.round(3 * z));
    const tw = Math.max(1, Math.round(3 * z)), th = Math.max(1, Math.round(z));
    ctx.fillStyle = "rgba(10,30,52,0.30)";
    for (const f of fishes) {
      const fx = Math.round((f.x - ox) * z), fy = Math.round((f.y - oy) * z);
      ctx.fillRect(fx, fy, fw, fh);
      ctx.fillRect(fx + Math.round((f.dir > 0 ? 7 : -3) * z), fy + th, tw, th);
    }
    ctx.restore();
  }
}

/* --- 4.5.3 鸭子（道具，参与深度排序） --- */
/* land=false → **水面版**：泡在水里，身子压到水线下、拖一道水痕。
   land=true  → **走路版**：站在地上，身子抬高 3 行，下面长出两条橙色的腿与脚蹼。
   ⚠️ 只把水痕换成接地影是不够的 —— 用户 2026-09-13：「鸭子上岸是用腿走路，不是游动」。
      没有腿的鸭子站在砖面上依然是"漂"着的，一眼假。所以两版的**身体整套差 3 行**：
      水面版 dy=3（下沉），走路版 dy=0，走路版空出的 y11..13 正好画腿。
   ⚠️ 两版必须共用 16×16 画布与同一个锚点 ay = 14（= 落地线那一行）—— spawnDucks 只存
      一份 w/h/ax/ay，两版尺寸不一致另一版就会画歪。水面版的绝对落点**逐像素与旧版相同**
      （旧 16×13 / ay 11 / 身顶画布 y5 ⇒ 世界 y−6；新 16×16 / ay 14 / 身顶画布 y8 ⇒ 同式）。
   ⚠️ 原形参 `seed` 是个**死参数**（函数体从头到尾没引用过它，三只鸭子本来就是同一张
      图）—— 第七轮顺手换成有意义的 land，调用点只有 spawnDucks 一处。 */
function makeDuck(land) {
  const c = mkCanvas(16, 16), g = c.getContext("2d");
  const dy = land ? 0 : 3;                       // 身体整套的纵向偏移（见上）
  if (land) {
    px(g, 2, 13, 11, 1, "rgba(24,20,16,0.22)");        // 接地影
    /* 两条腿**一长一短**：后腿撑地（落到落地线 y14）、前腿抬起 1px —— 两腿等长就是
       "立正站着"，有腿也读不出"走路"。长短差 1px 在 1× 下是 1 像素，3× 下看得清。 */
    px(g, 4, 11, 2, 3, "#c8862e");                     // 后腿（支撑脚，背光偏暗）
    px(g, 9, 11, 2, 2, "#e0a03a");                     // 前腿（抬起）
    px(g, 3, 14, 4, 1, "#b87c28");                     // 后脚蹼（踩在落地线上）
    px(g, 8, 13, 4, 1, "#d0902f");                     // 前脚蹼（离地 1px）
  } else {
    px(g, 1, 13, 13, 2, "rgba(8,22,36,0.34)");         // 水面版：水痕
  }
  px(g, 2, 5 + dy, 9, 6, "#e8e4d8");                   // 身
  px(g, 3, 5 + dy, 7, 3, "#f4f1e8");
  px(g, 2, 10 + dy, 9, 1, "#bfb9a8");
  px(g, 9, 2 + dy, 5, 4, "#e8e4d8");                   // 头
  px(g, 10, 3 + dy, 3, 2, "#f4f1e8");
  px(g, 13, 3 + dy, 3, 2, "#d99a3c");                  // 喙
  px(g, 13, 3 + dy, 3, 1, "#eab24f");
  px(g, 11, 3 + dy, 1, 1, "#2c2b28");                  // 眼
  px(g, 3, 7 + dy, 6, 1, "#cfc9b8");                   // 翅
  return { canvas: c, ax: 8, ay: 14, w: 16, h: 16 };
}

/* --- 4.5.3b 鱼（有状态的水下实体，但**不是道具** —— 见 drawWater 里的注释） --- */
function spawnFish() {
  /* ⚠️ 自带种子，**不许蹭 §6.7 传进来的 rng**：§6.7 之后 §6.6d 落叶还要吃同一股
     随机流，这里多抽几次就会把落叶整个重掷（历史上"改水域重掷全校园地面噪声"同因）。 */
  const rng = makeRng(20260914);
  for (const R of WATER) {
    for (let i = 0; i < 3; i++) {
      const f = {
        area: R, safe: FISH_SAFE, run: FISH_RUN, rise: FISH_RISE, fall: FISH_FALL,
        cx: R.x + R.w * (0.30 + 0.20 * i), cy: R.y + R.h * (0.28 + 0.22 * i),
        rx: R.w * 0.24, ry: R.h * 0.26, ph: rng() * 6.28, sp: 0.20 + i * 0.05,
        sc: 0, dir: 1, x0: 0, y0: 0, x: 0, y: 0
      };
      f.x0 = f.x = f.cx; f.y0 = f.y = f.cy;
      fishes.push(f);
    }
  }
}

/* --- 4.5.3b2 水里的障碍：把落点推出岛与塔 ---
   **这是一处既存缺陷，不是本轮改出来的**：鸭子与鱼的轨道本来就穿过湖心岛和石塔 ——
   鸭 1 的轨道心 (2819.9, 1104.0) 正落在岛的落地范围 2758..2850 / 1046..1108 之内；
   鸭 3 的轨道心 (2928.8, 1240.9) 紧贴石塔 2928..2948 / 1245..1253。本轮给岛和塔补了
   碰撞盒（§5.6.6）之后，人绕得过去、鸭子却照样穿石而过，会变得格外刺眼，一并收掉。

   做法是**推出**而不是改轨道：轨道公式一个数都不动，只在落点落进障碍里时，沿
   "穿得最浅"的那条轴推出去 —— 永远推最短的路，鸭子才会贴着石头滑过去而不是弹开。
   人在远处时 o.sc=0 ⇒ 落点与旧版逐像素相同，这处修复对远景零影响。 */
function avoidPush(x, y) {
  const M = 6;                                          // 离石头的余量（世界像素）
  for (const b of WATER_AVOID) {
    const x0 = b.x0 - M, x1 = b.x1 + M, y0 = b.y0 - M, y1 = b.y1 + M;
    if (x <= x0 || x >= x1 || y <= y0 || y >= y1) continue;
    const dl = x - x0, dr = x1 - x, du = y - y0, dd = y1 - y;
    const k = Math.min(dl, dr, du, dd);
    if (k === dl) x = x0; else if (k === dr) x = x1;
    else if (k === du) y = y0; else y = y1;
  }
  return [x, y];
}

/* --- 4.5.3c 恐慌包络（鸭与鱼共用） ---
   人靠近 → 迅速外扩；人走开 → 缓慢漂回原轨道。**上升快、回落慢正是用户要的
   "游远了再慢慢游回来"** —— 不需要额外的状态机与目标点，包络本身就是那件事。

   ⚠️ 方向必须取**轨道点**（x0/y0，不含惊慌位移）指向玩家的反方向，不能取当前位置 ——
      当前位置已经含了外扩量，再拿它算方向就是正反馈，人会眼睁睁看着鸭子一路顶到湖岸。
   ⚠️ 出口一律按湖面矩形内缩 M 夹一次：鸭子不会游上岸。 */
function panicStep(o, dt, px_, py_) {
  const dxo = o.x0 - px_, dyo = o.y0 - py_;
  const dist = Math.hypot(dxo, dyo) || 1;
  const want = dist < o.safe ? 1 - dist / o.safe : 0;
  o.sc += (want - o.sc) * (want > o.sc ? o.rise : o.fall) * dt;
  if (o.sc < 0) o.sc = 0; else if (o.sc > 1) o.sc = 1;
  /* ⚠️ 字段叫 `area` 而不是 `lake`：对鱼它是湖面，对鸭子它是"湖面 ∪ 南岸石板路"。
     继续叫 lake 的话，下一个人会以为鸭子还泡在水里 —— 而第七轮之后它会上岸。 */
  const R = o.area, k = o.sc * o.run / dist, M = 10;
  let x = o.x0 + dxo * k, y = o.y0 + dyo * k;
  if (x < R.x + M) x = R.x + M; else if (x > R.x + R.w - M) x = R.x + R.w - M;
  if (y < R.y + M) y = R.y + M; else if (y > R.y + R.h - M) y = R.y + R.h - M;
  /* 最后再躲一次水里的障碍（第六轮是岛与塔，第七轮加上了影壁 / 月亮门门垛 / 假山）。
     这一步必须在活动域夹取**之后**：否则被夹回边界的落点会重新落进障碍里。 */
  return avoidPush(x, y);
}

function spawnDucks(rng) {
  const A = DUCK_AREA;                                  // 活动域 = 湖面 ∪ 南岸石板路
  const sW = makeDuck(false), sL = makeDuck(true);      // 水面版 / 陆地版（见 makeDuck 头注）
  for (const R of WATER) {
    for (let i = 0; i < 3; i++) {
      const d = {
        img: sW.canvas, imgR: sW.canvas, imgL: flipH(sW.canvas),
        landR: sL.canvas, landL: flipH(sL.canvas), dir: 1,
        ax: sW.ax, ay: sW.ay, w: sW.w, h: sW.h,
        area: A, safe: DUCK_SAFE, run: DUCK_RUN, rise: DUCK_RISE, fall: DUCK_FALL,
        /* 圆心与半轴照**活动域**算，不能照湖面（R）：照 R 的话三只鸭子永远只在湖北半部
           绕圈，南边那 96px 宽的砖面一辈子等不来一只鸭子 —— 而用户这轮要的正是
           「上岸走动」。rx 仍取 A.w*0.24，因为 A.w === R.w 本来就同源（§4.5.3d）。 */
        cx: A.x + A.w * (0.30 + 0.20 * i), cy: A.y + A.h * (0.28 + 0.22 * i),
        rx: A.w * 0.24, ry: A.h * 0.22, ph: rng() * 6.28, sp: 0.16 + rng() * 0.12,
        sc: 0, x0: 0, y0: 0, x: 0, y: 0, baseY: 0
      };
      d.x0 = d.x = d.cx; d.y0 = d.y = d.cy; d.baseY = d.cy;
      ducks.push(d);
    }
  }
}

/* 每帧由主循环调用（补丁 4） */
function animateWater(dt) {
  /* ⚠️ 闸①：dt 非正一律当 0（负 dt 会一路污染累积相位，见 build.py 补丁 12 的注释） */
  if (!(dt > 0)) dt = 0;
  waterT += dt;
  for (const d of ducks) {
    const t = waterT * d.sp + d.ph;
    d.x0 = d.cx + Math.cos(t) * d.rx;                             // 轨道点：不含惊慌位移
    d.y0 = d.cy + Math.sin(t * 1.25) * d.ry;
    const p = panicStep(d, dt, player.x, player.y);
    const nx = p[0], ny = p[1] + Math.round(Math.sin(waterT * 2.2 + d.ph) * 1.2);
    /* 朝向按**合成位移**翻（绕圈 + 逃跑两种运动都涵盖）。0.05 的死区是防微抖闪烁：
       鸭子悬在轨道两端时 vx 每帧都在 0 附近跳，不设死区会左右抽搐。
       ⚠️ 但**赋 d.img 必须每帧无条件做**（第七轮改）：鸭子现在有两套图（水面版 /
          陆地版），若沿用"只在死区外赋值"，那么"匀速直行"的每一帧都不会换图 ——
          而鸭子跨过岸线的那一刻往往正是直行（轨道切线方向），于是它会上了岸
          还拖着水痕。死区只该管**朝向**，不该管**换装**。 */
    const vx = nx - d.x;
    if (Math.abs(vx) > 0.05) d.dir = vx < 0 ? -1 : 1;
    const land = ny > WATER_S;
    d.img = d.dir < 0 ? (land ? d.landL : d.imgL) : (land ? d.landR : d.imgR);
    d.x = nx;
    d.y = ny;
    d.baseY = ny;
  }
  for (const f of fishes) {
    const t = waterT * f.sp + f.ph;
    f.x0 = f.cx + Math.cos(t) * f.rx;
    f.y0 = f.cy + Math.sin(t * 1.3) * f.ry;
    const p = panicStep(f, dt, player.x, player.y);
    if (Math.abs(p[0] - f.x) > 0.05) f.dir = p[0] < f.x ? -1 : 1;  // 尾巴挂在游动的反侧
    f.x = p[0];
    f.y = p[1];
  }
}
