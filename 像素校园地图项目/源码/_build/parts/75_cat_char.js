/* =========================================================
   猫宠 · CatSprite —— 四足精灵（四向 × 十动作）
   ---------------------------------------------------------
   ⚠️ 猫是四足，`50_char.js` 的 `buildChar`（双足、SHOE_TOP=25 写死）
      **一行不能用** ⇒ 新写 `buildCat`。但**工艺必须与人物同一套**：
        build → (left) flipH + setTransform 复位 → outlineSprite(k=0.45) → shadowBlob
      否则猫和人同框会像两个引擎做的（理由见 `71_guide_char.js` 头注开头那段）。

   ⚠️ 锚点 `(CAT_AX, CAT_AY)` = 画布内**脚点**像素；绘制方式仍是
      `drawImage(img, x - ax, y - ay)`，所以 baseY 排序、"脚踩世界 y" 与人物完全同规。
      最低一行画在 y=14，脚点取 CAT_AY=15（与人物 CH_AY=27 比鞋底 26 低 1 行同规）。

   ⚠️ **纵向预算**（改之前先看这张表，别再把耳朵画到负行去）：
        CAT_H=18 / CAT_AY=15，画布有效行 0..15。
        耳顶 1  耳底 2 │ 头 2..8 │ 身 9..12 │ 腿 12..14（脚掌 14）
      `hy` 基准 2；**任何 hy 偏移不得让 `hy-1` 掉到 0 以下**（耳会整行被裁，
      2026-10-09 栽过：hy=1 ⇒ 耳画在 -1 行，图上"耳朵"其实是描边补的假象）。

   十动作（猫宠.md §七·五）：
      walk 4 / idle 2 / sleep 2 / flee 4 / retreat 2 / rub 2 / wait 2 / eat 3
      look 2 / play 4      ← 第四十四轮（轮盘）加的：叫它 → 抬头；逗它 → 扑
   四向：down / up / right；**left 由 right 镜像**。
   毛色走 `PAL` 参数（同 `GUIDE_PAL` 套路）——一套代码换四只猫。
   ========================================================= */
const CAT_W = 18, CAT_H = 18, CAT_AX = 9, CAT_AY = 15;
const CAT_GROUND = 14;                  // 脚掌所在行（= CAT_AY - 1）

const CAT_PAL = {
  /* 大橘：橘猫，食堂后门，亲人（最快能摸到） */
  DAJU: {
    fur: "#d98a3c", furL: "#f2ad5e", furD: "#a2601f",
    belly: "#f6e7d0", ear: "#e8a8a0", nose: "#c96f6a", eye: "#2b2a24", paw: "#f6e7d0"
  },
  /* 馆长：三花，图书馆台阶，怕生（最难） */
  GUANZHANG: {
    fur: "#efe9dc", furL: "#fbf8f0", furD: "#bdb2a0",
    belly: "#fbf8f0", ear: "#e8a8a0", nose: "#c96f6a", eye: "#4a6a48", paw: "#fbf8f0",
    patch: "#4a4038", patch2: "#d98a3c"
  },
  /* 芝麻：黑猫，明湖南岸影壁，谨慎 */
  ZHIMA: {
    fur: "#3b3730", furL: "#585249", furD: "#221f1b",
    belly: "#4c4740", ear: "#7c5c58", nose: "#90706a", eye: "#d8c060", paw: "#4c4740"
  },
  /* 狸花：思源楼草坪，中间档 */
  LIHUA: {
    fur: "#8d826e", furL: "#ab9e86", furD: "#5f5646",
    belly: "#efe8da", ear: "#c09088", nose: "#b07a74", eye: "#4a6a48", paw: "#efe8da",
    stripe: "#463f34"
  }
};

/* 动作 → 帧数（"跟"不在此表：它复用 walk）
   ⚠️ 加动作要**同时**改三处：这张表、`front()`/`side()` 里的分支、
   `_catsprite.py` 的 `ACTS` 数组（不加就不进可视化校验页，等于没验）。
   `look` / `play` 是第四十四轮（轮盘交互）加的：叫它 → 抬头；逗它 → 扑。 */
const CAT_ACTS = { walk: 4, idle: 2, sleep: 2, flee: 4, retreat: 2, rub: 2, wait: 2, eat: 3, look: 2, play: 4 };

/* --- 侧视步态：前腿与后腿**反相**（一条向前时另一条向后），否则看着是"整只在平移"。
   远侧两条腿取近侧的相反相位，才读得出"四条腿"而不是"两条"。
   ⚠️ 四相必须是**四个不同姿态**——写成 {±2, 0, ∓2, 0} 那种"两帧循环摊成四帧"，
   第 1、3 帧逐像素相同，`_catsprite.py` 的 DIAG 会直接报 ZERO（这是本项目的判据：
   帧数写 4 就得画 4 张，不能偷懒复用）。 --- */
const CAT_WALK = [
  { f: 2, b: -2, bob: 0 }, { f: 1, b: -1, bob: 1 },
  { f: -2, b: 2, bob: 0 }, { f: -1, b: 1, bob: 1 }
];
/* 跑：步幅更大、身体压低（bob 只往上 1，避免整体"腾空"读成跳） */
const CAT_FLEE = [
  { f: 3, b: -3, bob: 0 }, { f: 1, b: -1, bob: 1 },
  { f: -3, b: 3, bob: 0 }, { f: -1, b: 1, bob: 1 }
];

function buildCat(PAL) {
  const C = PAL || CAT_PAL.DAJU;
  const P = (g, x, y, w, h, col) => { if (w > 0 && h > 0) px(g, x, y, w, h, col); };

  /* 一条腿：列 x、宽 w、从 top 到脚底（脚掌行 = CAT_AY-1）。
     亮边在左（光自左上），脚掌浅色 —— 猫的辨识特征就在这四个白点 */
  function leg(g, x, w, top, col, edge) {
    const h = CAT_AY - top;
    P(g, x, top, w, h, col);
    if (edge) P(g, x, top, 1, h, edge);
    P(g, x, CAT_AY - 1, w, 1, C.paw);
  }

  /* 耳：2×2 三角（左上受光、右下压暗），**立在 (x, y) 且 y 必须 ≥ 1** */
  function ear(g, x, y, col, colIn) {
    P(g, x, y, 2, 2, col);
    P(g, x, y, 1, 1, colIn || shade(col, 0.18));
    P(g, x + 1, y + 1, 1, 1, shade(col, -0.28));
  }

  /* 尾巴（侧视）：从 (bx, by) 向左上翘；seg 0 自然 / 1 摆一下 / 2 跑时拉直 */
  function tailSide(g, bx, by, seg) {
    P(g, bx, by, 2, 1, C.fur);
    P(g, bx - 1, by - 1, 2, 1, C.fur);
    P(g, bx - 2, by - 2, 2, 1, C.furL);
    P(g, bx - 3, by - 3 + (seg === 1 ? 1 : 0), 1, 1, C.furL);
    if (seg === 2) { P(g, bx - 4, by - 3, 1, 1, C.fur); P(g, bx - 5, by - 2, 1, 1, C.furL); }
  }
  /* 尾巴（背视）：从身后立起，可甩向一侧 */
  function tailUp(g, x, topY, botY, seg) {
    for (let y = botY; y >= topY; y--) P(g, x, y, 2, 1, C.fur);
    P(g, x, topY, 2, 1, C.furL);
    if (seg === 1) P(g, x - 1, topY + 1, 1, 2, C.furL);
    if (seg === 2) P(g, x + 2, topY, 1, 2, C.furL);
  }

  /* ---------------- 头 ----------------
     ⚠️ 头一律画 **7 行**（hy..hy+6），底行正好贴住身子顶行（hy+7）。
     画 6 行会留 1 行空隙，正视图里"头"和"身"同色又断成两截，糊成一坨读不出形状。
     下巴那条暗线负责把头和身子分开，别删。 */
  function headSide(g, hx, hy) {                  // 侧脸，朝右
    P(g, hx, hy, 6, 7, C.fur);
    P(g, hx, hy, 6, 1, C.furL);                   // 顶光
    P(g, hx + 5, hy, 1, 7, C.furD);               // 后脑背光
    P(g, hx, hy + 1, 2, 1, C.furL);               // 额头受光
    P(g, hx + 2, hy + 2, 1, 1, C.eye);            // 眼
    P(g, hx + 5, hy + 3, 1, 3, shade(C.fur, 0.10)); // 吻部
    P(g, hx + 3, hy + 5, 2, 1, C.nose);           // 鼻
    P(g, hx, hy + 6, 6, 1, shade(C.fur, -0.20));  // 下巴投影
    ear(g, hx + 1, hy - 1, C.fur, C.ear);
    ear(g, hx + 4, hy - 1, C.fur, C.ear);
  }
  function headFront(g, hx, hy) {                 // 正脸（8 宽）
    P(g, hx, hy, 8, 7, C.fur);
    P(g, hx, hy, 8, 1, C.furL);
    P(g, hx, hy, 1, 7, C.furL);
    P(g, hx + 7, hy, 1, 7, C.furD);
    P(g, hx + 1, hy + 2, 2, 2, C.eye);            // 左眼
    P(g, hx + 5, hy + 2, 2, 2, C.eye);            // 右眼
    P(g, hx + 1, hy + 2, 1, 1, C.furL);           // 眼里高光
    P(g, hx + 5, hy + 2, 1, 1, C.furL);
    P(g, hx + 3, hy + 4, 2, 1, C.nose);           // 鼻
    P(g, hx + 3, hy + 5, 2, 1, shade(C.nose, -0.30));  // 嘴
    P(g, hx, hy + 6, 8, 1, shade(C.fur, -0.20));  // 下巴投影
    ear(g, hx, hy - 1, C.fur, C.ear);
    ear(g, hx + 6, hy - 1, C.fur, C.ear);
    if (C.patch) P(g, hx, hy, 2, 2, C.patch);     // 三花：半边脸压深
  }
  function headBack(g, hx, hy) {
    P(g, hx, hy, 8, 7, C.fur);
    P(g, hx, hy, 8, 1, C.furL);
    P(g, hx, hy, 1, 7, C.furL);
    P(g, hx + 7, hy, 1, 7, C.furD);
    P(g, hx, hy + 6, 8, 1, shade(C.fur, -0.20));
    ear(g, hx, hy - 1, C.fur, C.furD);
    ear(g, hx + 6, hy - 1, C.fur, C.furD);
  }

  /* ---------------- 团成一团（睡） ---------------- */
  function curled(g, frame) {
    const b = frame & 1;
    tailSide(g, 4, 14 - b, 0);
    P(g, 3, 10 - b, 12, 5 + b, C.fur);             // 身体（最低到 14 行）
    P(g, 3, 10 - b, 12, 1, C.furL);
    P(g, 3, 14, 12, 1, C.furD);
    P(g, 4, 13, 8, 2, C.belly);                    // 白肚
    P(g, 12, 9 - b, 5, 5, C.fur);                  // 头埋在前爪上
    P(g, 12, 9 - b, 5, 1, C.furL);
    P(g, 13, 11 - b, 1, 1, C.furD);                // 闭眼：两点
    P(g, 15, 11 - b, 1, 1, C.furD);
    P(g, 12, 13 - b, 4, 1, C.paw);                 // 前爪垫
    ear(g, 13, 7 - b, C.fur, C.ear);
    ear(g, 16, 7 - b, C.fur, C.ear);
  }

  /* ---------------- 正视 / 背视 ---------------- */
  function front(g, act, frame, back) {
    if (act === "sleep") return curled(g, frame);
    const moving = (act === "walk" || act === "flee");
    /* 待机 / 蹲等：呼吸（帧数 2，两帧差在身高压 1 行） */
    const breathe = ((act === "idle" || act === "wait") && (frame & 1)) ? 1 : 0;
    const bob = moving ? (frame & 1) : breathe;
    const lw = ((moving && frame === 0) || (act === "play" && frame === 1)) ? 1 : 0;   // 左前腿抬起
    const rw = ((moving && frame === 2) || (act === "play" && frame === 2)) ? 1 : 0;   // 右前腿抬起
    const hd = (act === "eat") ? [3, 4, 2][frame] : 0;   // 低头吃食（三帧：俯 / 更低嚼 / 抬）
    const sh = (act === "retreat" && (frame & 1)) ? 1 : 0;   // 后退：整体后缩
    /* 正面四足步态只有"左右腿各抬一次"，4 帧里必有两帧撞车 ⇒ 补**肩膀左右摇摆**（同人物走路的 sway） */
    const sw = moving ? [0, 1, 0, -1][frame] : 0;
    /* 蹭：头整颗左右偏移 1px（不能只补一个像素——会被后画的身子盖掉，DIAG 直接报 ZERO） */
    const rb = (act === "rub") ? (frame & 1) : 0;
    /* 逗（play）：四帧 —— 低伏 / 左爪扑 / 右爪扑 + 头偏 / 起身。
       ⚠️ 只**往下压不往上抬**：`hy` 一旦 < 2，耳朵就掉到负行被裁（本文件头注记过这个地雷）。 */
    const pv = (act === "play" && frame === 0) ? 1 : 0;              // 低伏
    const ph = (act === "play" && frame === 2) ? 2 : 0;              // 头偏向一侧
    const hoff = rb + sw + ph;
    const hy = 2 - bob + hd + sh + pv;             // ⚠️ 不得 < 2，否则耳朵掉到负行被裁

    P(g, 4, hy + 7, 10, 4 - breathe, C.fur);       // 身（在头后面）
    P(g, 4, hy + 7, 1, 4 - breathe, C.furL);
    P(g, 13, hy + 7, 1, 4 - breathe, C.furD);
    P(g, 6, hy + 10, 6, 1, C.belly);               // 前胸白
    /* 尾巴：正视被身子挡住 ⇒ 只在侧后方露一小截；**不竖在头边**
       （原来 tailUp 摆在 x=13 一路竖到头顶，读成"头旁边一根杆"）。背视才竖起来。
       抬头（look）那帧把尾尖翘 1px —— 猫警觉时尾巴是往上抬的。 */
    const tl = (act === "look" && (frame & 1)) ? 1 : 0;
    if (back) tailUp(g, 14 + hoff, hy + 3 - tl, hy + 11, moving ? (frame & 1) : (rb + tl));
    else { P(g, 14, hy + 9 - tl, 2, 3 + tl, C.fur); P(g, 14, hy + 9 - tl, 2, 1, C.furL); }
    leg(g, 4 + lw, 2, hy + 10, C.fur, C.furL);     // 两条前腿
    leg(g, 12 - rw, 2, hy + 10, C.fur, C.furL);
    if (back) headBack(g, 5 + hoff, hy); else headFront(g, 5 + hoff, hy);
    if (act === "eat" && frame === 1) P(g, 7 + hoff, hy + 6, 2, 1, C.nose);   // 嚼：舌头探出一点
    /* 抬头看你（look）：**抹掉下巴投影** —— 下巴离开了身体，脖子那截就露出来。
       ⚠️ 必须画在 head* **之后**：它是一次覆盖，不是新部件（下巴投影是 head* 画的最后一行）。 */
    if (act === "look" && (frame & 1)) P(g, 5 + hoff, hy + 6, 8, 1, C.fur);
  }

  /* ---------------- 侧视 ---------------- */
  function side(g, act, frame) {
    if (act === "sleep") return curled(g, frame);
    const moving = (act === "walk" || act === "flee");
    const G = (act === "flee" ? CAT_FLEE : CAT_WALK)[frame & 3];
    const bob = moving ? G.bob : ((act === "idle" && (frame & 1)) ? 1 : 0);
    /* 逗（play）：四帧 —— 低伏 / 前爪前伸扑 / 收爪翻滚 / 起身。
       ⚠️ `pby` 只 **≥ 0**（往下压），理由同 `front()`：`hy` 不能 < 2，否则耳被裁。 */
    const pby = (act === "play") ? [1, 0, 1, 0][frame] : 0;
    const pf  = (act === "play") ? [0, 3, -2, 1][frame] : 0;
    const phd = (act === "play") ? [2, 1, 3, 0][frame] : 0;
    const f = moving ? G.f : pf, bk = moving ? G.b : 0;

    /* 蹲坐（wait / retreat：后半下沉、前腿直立）。
       两帧靠 **头 + 尾 + 后半高度** 的 1px 位移区分（wait ＝ 呼吸；retreat ＝ 后退缩一下）。 */
    if (act === "wait" || act === "retreat") {
      const t = (frame & 1) ? 1 : 0;
      tailSide(g, 4, 13 - t, t);
      P(g, 4, 9 + t, 7, 4 - t, C.fur);             // 后半堆叠（呼吸时压 1 行）
      P(g, 4, 9 + t, 7, 1, C.furL);
      P(g, 4, 12, 7, 1, C.furD);
      leg(g, 3, 2, 12, C.fur, C.furL);             // 前腿直立
      leg(g, 8, 2, 12, C.fur, C.furL);
      headSide(g, 11, 2 + t);
      return;
    }

    const by = 7 - bob + pby;                      // 身体顶行
    const lt = by + 4;                             // 腿顶行（= 身体底行，1 行重叠）
    /* 远侧两条腿（先画，压暗；取近侧相反相位） */
    leg(g, 4 - bk, 2, lt, C.furD);
    leg(g, 10 - f, 2, lt, C.furD);
    tailSide(g, 3, by + 2, moving ? (act === "flee" ? 2 : (frame & 1)) : (frame & 1));
    /* 身体 */
    P(g, 3, by, 10, 5, C.fur);
    P(g, 3, by, 10, 1, C.furL);                    // 背顶受光
    P(g, 3, by + 4, 10, 1, C.furD);                // 腹底背光
    P(g, 6, by + 5, 6, 1, C.belly);                // 白肚
    if (C.stripe) { P(g, 5, by, 1, 2, C.stripe); P(g, 8, by, 1, 2, C.stripe); P(g, 11, by, 1, 2, C.stripe); }
    if (C.patch)  { P(g, 6, by, 3, 3, C.patch); P(g, 10, by, 2, 2, C.patch2); }
    /* 近侧两条腿 */
    leg(g, 4 + bk, 2, lt, C.fur, C.furL);
    leg(g, 10 + f, 2, lt, C.fur, C.furL);
    /* 头：吃食三帧 ── 俯 / 更低+嚼 / 抬（比"恒定低头"多一档，才过帧差判据）。
       逗（play）复用同一个 `eh`：低伏 2 / 稍抬 1 / 埋更低 3 / 起身 0。 */
    const eh = (act === "eat") ? [3, 4, 2][frame] : phd;
    headSide(g, 11, 2 - bob + eh);
    if (act === "eat" && frame === 1) P(g, 14, 2 - bob + eh + 5, 2, 1, C.nose);   // 嚼：舌
    /* 抬头看你（look）：抹掉下巴投影（同 `front()` 那一手）+ 眼上添一格读作"抬眼"。
       ⚠️ 下巴投影是 `headSide` 画的最后一行（y = hy+6），必须**画在它之后**才盖得住。 */
    if (act === "look" && (frame & 1)) {
      P(g, 11, 2 - bob + 6, 6, 1, C.fur);
      P(g, 13, 3 - bob, 1, 1, C.eye);
    }
    if (act === "rub") { P(g, 16, 6 - bob, 1, 2, C.fur); P(g, 17, 7 - bob, 1, 1, C.furL); }
    if (act === "flee") P(g, 13, 3 - bob, 4, 1, C.furD);   // 跑：耳朵后压
  }

  /* ---------------- 出口 ---------------- */
  return function (dir, act, frame) {
    if (!(act in CAT_ACTS)) act = "idle";
    frame = ((frame | 0) % CAT_ACTS[act] + CAT_ACTS[act]) % CAT_ACTS[act];
    const c = mkCanvas(CAT_W, CAT_H), g = c.getContext("2d");
    if (dir === "down")      front(g, act, frame, false);
    else if (dir === "up")   front(g, act, frame, true);
    else                     side(g, act, frame);   // right；left 先按 right 画，末尾镜像

    let out = c;
    if (dir === "left") {
      out = flipH(c);
      /* ⚠️ flipH 用 translate+scale 画完后**不 restore**，变换永久留在返回画布的 ctx 上。
         不复位的话，接下来的描边和接地影会被**再镜像一次** —— 影子跑到左下，
         描边落到对侧（`50_char.js:78-82` 记过这个坑）。 */
      out.getContext("2d").setTransform(1, 0, 0, 1, 0, 0);
    }
    outlineSprite(out, 0.45);                        // 彩色描边（必须画在影子之前）
    shadowBlob(out.getContext("2d"), CAT_AX + 1, CAT_AY + 1, 6, 2, 0.42, 3);   // 接地影（朝右下，同人物）
    return out;
  };
}

/* --- 四只猫各一份构建器 + 懒烘焙缓存 --- */
const CAT_MAKE = {
  cat_daju:      buildCat(CAT_PAL.DAJU),
  cat_guanzhang: buildCat(CAT_PAL.GUANZHANG),
  cat_zhima:     buildCat(CAT_PAL.ZHIMA),
  cat_lihua:     buildCat(CAT_PAL.LIHUA)
};
const _cats = Object.create(null);
function catSprite(catId, act, dir, frame) {
  const mk = CAT_MAKE[catId] || CAT_MAKE.cat_daju;
  const k = catId + act + dir + frame;
  if (!_cats[k]) _cats[k] = mk(dir, act, frame);
  return _cats[k];
}
