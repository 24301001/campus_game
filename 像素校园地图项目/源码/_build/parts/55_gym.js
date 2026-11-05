/* ============================================================================
 * §5.5 老体育馆（西门）门面按实拍重绘 + 门前长台阶
 *      —— 源：_build/_photo/tiyuguan1.jpg（用户提供的实拍）
 * ----------------------------------------------------------------------------
 * 一、为什么是"覆盖重绘"而不是改模板
 *   30_building.js 是全校**所有**楼的通用生成器，体育馆只是它的一行调用。
 *   屋顶细节 / 楼模板差异化之前用户明确说过"先不要改建筑物，碰之前先问"，
 *   而 51_siyuan_top.js 已经立了先例：**不动模板，事后把精灵擦掉重画**。
 *   这里照抄那个先例 —— 檐下沿（精灵 y = GY_EAVE = PADT + roofT）以下整段 clearRect，
 *   再按照片重绘。擦除是安全的：那一段像素**只**是本精灵自己画的墙/窗/雨棚/台阶，
 *   底图（地面烘焙层）不在这个 canvas 里，擦掉后面就是透明。
 *   ⚠️ GY_EAVE 这个数不是拍的：30_building.js 里 eaveY = PADT(18) + roofT，
 *      本例 w=330 / depth=450 ⇒ 走 `o.roofFull`（2026-09-17 起，见 §5.5.1 与
 *      30_building.js 那段注释）→ roofT = ceil(450) − 102 = 349，
 *      18 + 349 = 367；baseY = eaveY + wallH(3*34=102) = 469。
 *      这两条算式若在 30 段被改，gymRestyle 里的几何闸会在浏览器控制台炸出来。
 *
 * 二、用户的两条硬要求
 *   ① 门头「交大体育馆」五个金字照照片复刻 —— 点阵由 _build/_gymfont.py 从**用户
 *      提炼的 `_photo/jiaodatiyuguanfont.png`** 二值化降采样而来（旧路 FZYTK 渲染
 *      已废，原因见那个文件头：实拍图金字抠不干净、姚体又太板正）。
 *      ⚠️ 字高锚 26（不是最初的 21）—— 21 锚下笔画只有 1~2px，在精灵里读不出来。
 *   ② 门口有**很长的台阶**，「我们可以登上楼梯但是不能进去」。
 *      这一条在本工程里是**自动成立**的，不需要新加碰撞体：
 *        - 已有的 addSolid(ax, ay, b.w-14, 34) 把楼体挡在 y 861..895；
 *        - ptBlocked 默认 hh=5 → 人物脚底最北只能走到 y = 895 + 5 = 900；
 *        - 台阶画在 895..947（楼**南**侧、楼前的砖石路面上，见下）。
 *      于是"从南往北走上台阶"正好停在门前一级；再往北就是楼体碰撞盒。
 *      ⚠️ 台阶之所以画在**精灵的画布内、baseY 之下**，是因为渲染时
 *         (p.y - p.ay) 是精灵左上角的屏幕 y：画布往下长 = 往南长 = 长在楼前。
 *         若改成"另起一个道具，baseY = 947"，人物站在台阶上（y≈920）时
 *         道具 baseY 更大 → 人会被台阶**盖住**。钉在建筑精灵里才对。
 *
 * 三、台阶净空
 *   台阶在精灵里，但精灵的 baseY 仍是 895 —— 于是 baseY > 895 的路灯/小树会
 *   排到台阶**前面**画上去（深度排序只看 baseY）。所以要有 clearGymStairs()，
 *   与 §5.3.10 的雕塑净空同款。
 *   ⚠️ 实测（2026-09-13，gymCleared = 0）：楼前这一片是「西门内广场」的石板地，
 *      scatter() 不在广场上撒东西，所以现在是**空跑**。留着当闸门 ——
 *      广场分类、scatter 的落点规则、或台阶尺寸任何一处变了，它立刻见效。
 *   ⚠️ 必须排在 §6.6c clearPropTreeClash() 之后（同前面几处净空的理由）。
 * ==========================================================================*/

/*__GY_GEN_BEGIN__*/
/* ==== 由 _build/_gymfont.py 生成，勿手改 ==== */
/* 老体育馆门头「交大体育馆」五字点阵 —— 源是用户从照片里提炼的
   _photo/jiaodatiyuguanfont.png（白底金字，判据 (r-b) > 45 一刀切），
   **不是**系统字体渲染。
   ⚠️ 第一版走的是 FZYTK 渲染，笔画板正得像电脑字 —— 用户退回重做。
   ⚠️ 逐字高 [24, 15, 25, 26, 22] 是**按提炼件的实测 bbox 高折算的**（以「育」= 26
      世界像素为锚，下夹 TH_MIN=14）：「大」只有「育」的 0.58 倍，
      这是**原设计** —— 实拍照片里「大」就明显矮一截（回量得 0.52），
      基线齐平、顶更低。别"修"成统一值。
   落笔仍是统一的 GY_BASE_Y 基线（见 _gymfont.py 文件头「版面」那段）。 */
const GY_MASK_JIAO = "AMAAAeAAAeAAA94AB/wAH+AH/gAP48APB8AAB4AOHwA8OADwcAHxwAB7gAB+AAB8AAD8AAP8AA88APw+H+A/PwAfgAAe";
const GY_MASK_DA = "GAHgHwD8H+H+/8/4fwH4H8HeOPeHYDA=";
const GY_MASK_TI = "AAMAADgAAeAcDwHg+B4/gfH4HweA+HwDh/8Of/5z+POZ8B4PwPP+A5/AHBwAQOAABwAAOAABwAAOAAAwAAEAAAgA";
const GY_MASK_YU = "AOAAHgAD4AA88Af+B//H/wf/8H/PAP/gP/gP5AD7wAP4AGMAD2AB7AB9wA+4AfcAMOAGHADDgBnwAB4AAYA=";
const GY_MASK_GUAN = "AAA4AAAPAAYBwAOAfAHwP4D+//A9/9wcf4cOA58DsH8B3B/A4wZgMMH4GHJ8DB04AAZP8AHz/gB4x4AcM8AHD/AAg/wAAHYA";
/* [点阵, 宽, 高] —— 顺序：交 大 体 育 馆 */
const GY_CHARS = [
  [GY_MASK_JIAO, 23, 24],
  [GY_MASK_DA, 12, 15],
  [GY_MASK_TI, 21, 25],
  [GY_MASK_YU, 19, 26],
  [GY_MASK_GUAN, 26, 22]
];
/* ==== 生成块结束 ==== */
/*__GY_GEN_END__*/

/* --- 5.5.1 立面几何（精灵局部坐标；精灵画布 382 × 556，锚点 (191, 469)）---
   ⚠️ 2026-09-17：屋面板改成"铺满进深"（30_building.js 的 `o.roofFull`，见 §6.2
      styleOf）之后，檐下沿由 208 下移到 367、落地线由 310 下移到 469 ——
      **立面本身一笔没改**，整段只是跟着屋面板往下平移了 158（= 新 roofT 349 − 旧 190）。
      所以下面每一个分带常量都写成 **GY_EAVE 的偏移式**，不再各自记一个绝对行号：
      进深再变时只动 GY_ROOF 一个数，其余自己跟上（"派生量不许再存一份常量"）。
      ⚠️ 世界坐标一个都没动 —— 檐下沿在世界里仍是 y 793.07、落地线仍是 895.07，
         平移的只是它在精灵局部坐标里的行号（因为屋面板往北长长了）。 */
const GY_ROOF = 349;                     // roofT = ceil(IX(1.1528)) − 3*FLOOR_H = 451 − 102（30 段 o.roofFull）
const GY_EAVE = 18 + GY_ROOF;            // 檐下沿 = 墙顶 = PADT(18) + roofT = 367
const GY_BASE = GY_EAVE + 102;           // 落地线 = 檐下沿 + 3*34 = 469（世界 y 895.07）
const GY_X0 = 26, GY_X1 = 356;           // 墙左右缘（= 30 段的 PADX / PADX+w）
const GY_CX = 191;                       // 建筑中轴（精灵 x）
const GY_CAP = GY_EAVE + 6;              // 白瓷砖压顶下沿
const GY_BAND = GY_EAVE + 44;            // 青绿竖肋带下沿
const GY_WIN = GY_EAVE + 66;             // 玻璃窗带下沿
const GY_BAY = 52;                       // 入口开间半宽
const GY_STAIR = 52;                     // 台阶进深（世界像素 = 画布向下加长量）
const GY_GAP = 20;                       // 门头五字字距
const GY_BASE_Y = GY_EAVE + 39;          // 门头金字基线（精灵 y）

/* 台阶净空（世界坐标）：精灵 x 87..295 → 世界 49.7+(87-26) .. 49.7+(295-26)；
   世界 x 左缘 = CAMPUS「老体育馆」的 IX(0.1271) = 49.7 —— 与建筑同一个源。 */
const GYM_CLR = { x: 110, y: 895, w: 209, h: 52 };   // x110..319 / y895..947

/* --- 5.5.2 点阵字：1bit 掩膜 → 金字（上亮下暗的浮雕感） --- */
function gyBits(b64, cnt) {
  const s = atob(b64), out = new Uint8Array(cnt);
  for (let i = 0; i < cnt; i++) out[i] = (s.charCodeAt(i >> 3) >> (7 - (i & 7))) & 1;
  return out;
}
/* 逐列取"竖run"整段铺金，再给 run 的两端点高光/暗金。
   ⚠️ 门槛是 **run 长 ≥ 3**，不是 ≥2。毛笔字的笔画在 26px 字高下大多正好落在
      2px 的 run 上；对 2px 的 run 点上高光+暗金，就等于把这一列**整列**替换成
      "上浅下深"、一点实金 (#c8963c) 都不剩 —— 整排字看上去又虚又断，第一版
      就是这么"发毛"的。≥3 时中间至少留一行实金，浮雕才成立。 */
function gyGlyph(g, b64, nw, nh, x, y) {
  const b = gyBits(b64, nw * nh);
  const HI = "#ecc97c", GO = "#c8963c", DK = "#7c5a24";
  for (let i = 0; i < nw; i++) {
    let j = 0;
    while (j < nh) {
      if (!b[j * nw + i]) { j++; continue; }
      let k = j;
      while (k + 1 < nh && b[(k + 1) * nw + i]) k++;
      px(g, x + i, y + j, 1, k - j + 1, GO);
      if (k - j + 1 >= 3) { px(g, x + i, y + j, 1, 1, HI); px(g, x + i, y + k, 1, 1, DK); }
      j = k + 1;
    }
  }
}

/* --- 5.5.3 青绿竖肋带上的门头字 --- */
function gymSign(g) {
  let tw = 0;
  for (const e of GY_CHARS) tw += e[1];
  tw += GY_GAP * (GY_CHARS.length - 1);
  let x = GY_CX - tw / 2;
  for (const e of GY_CHARS) {
    const nw = e[1], nh = e[2];
    gyGlyph(g, e[0], nw, nh, Math.round(x), GY_BASE_Y - nh);
    x += nw + GY_GAP;
  }
  /* 落款：照片里「馆」右下方还有一行小字与一方印（金色的，很小）。
     1bit 尺度下画不出字形，按照片的位置与大小直接点两块 —— 有它才像实拍。
     ⚠️ 起点必须取**馆的右缘**，不能拿循环跑完的 x 去减（x 已经在字距之外了，
        减 34/22 会正好落回「馆」身上，第一版就是这么把印盖在字上的）。 */
  const sx = Math.round(GY_CX + tw / 2) + 2;
  px(g, sx, GY_BASE_Y - 4, 8, 3, "#b98d38");            // 小字一行
  px(g, sx, GY_BASE_Y - 4, 8, 1, "#d8ae56");
  px(g, sx + 11, GY_BASE_Y - 6, 4, 4, "#a87f30");       // 印：外框
  px(g, sx + 12, GY_BASE_Y - 5, 2, 2, "#e0c07a");       // 印：中空提亮（实心会读成一块金疙瘩）
}

/* --- 5.5.4 立面 --- */
function gymFacade(g) {
  /* 1) 白瓷砖压顶（照片最上面那条细密的白色小方砖） */
  px(g, GY_X0, GY_EAVE, GY_X1 - GY_X0, GY_CAP - GY_EAVE, "#e4dfd3");
  for (let x = GY_X0; x < GY_X1; x += 9) px(g, x, GY_EAVE, 1, GY_CAP - GY_EAVE, "#d3cdbe");
  px(g, GY_X0, GY_CAP - 1, GY_X1 - GY_X0, 1, "#b3ac9c");

  /* 2) 青绿竖肋带 + 门头金字（照片里这一带占立面近四成高） */
  px(g, GY_X0, GY_CAP, GY_X1 - GY_X0, GY_BAND - GY_CAP, "#63897f");
  for (let x = GY_X0 + 1; x < GY_X1; x += 4) px(g, x, GY_CAP, 1, GY_BAND - GY_CAP, "#587c73");
  px(g, GY_X0, GY_CAP, GY_X1 - GY_X0, 1, "#4a6b63");
  px(g, GY_X0, GY_BAND - 2, GY_X1 - GY_X0, 2, "#4a6b63");
  gymSign(g);

  /* 3) 白瓷砖 + 一排蓝绿玻璃窗 */
  px(g, GY_X0, GY_BAND, GY_X1 - GY_X0, GY_WIN - GY_BAND, "#e4dfd3");
  for (let x = GY_X0; x < GY_X1; x += 9) px(g, x, GY_BAND, 1, GY_WIN - GY_BAND, "#d3cdbe");
  px(g, GY_X0 + 6, GY_BAND + 5, GY_X1 - GY_X0 - 12, 13, "#3f6169");
  px(g, GY_X0 + 6, GY_BAND + 5, GY_X1 - GY_X0 - 12, 2, "#6f949c");
  px(g, GY_X0 + 6, GY_BAND + 16, GY_X1 - GY_X0 - 12, 2, "#2b3d42");
  for (let x = GY_X0 + 6; x < GY_X1 - 8; x += 26)
    px(g, x, GY_BAND + 5, 2, 13, "#e4dfd3");          // 窗间瓷砖柱

  /* 4) 入口区：白瓷砖墙 + 白色弧面雨棚 + 青铜柱深色玻璃门 */
  px(g, GY_X0, GY_WIN, GY_X1 - GY_X0, GY_BASE - GY_WIN, "#e4dfd3");
  for (let x = GY_X0; x < GY_X1; x += 9) px(g, x, GY_WIN, 1, GY_BASE - GY_WIN, "#d3cdbe");

  /* 雨棚：照片里是一整片**白色弧面**，前缘微微下垂 —— 不是尖角。
     所以用等宽横带堆出厚度，收分只给 2px（第一版按 i*7 收，画出来是个白楔子）。 */
  const CW = GY_BAY + 16;                                   // 半宽 68
  for (let i = 0; i < 8; i++) {
    const w = CW * 2 - i * 2;
    px(g, Math.round(GY_CX - w / 2), GY_WIN + 1 + i, Math.round(w), 1,
       i < 5 ? "#eeeadf" : "#d6cfbf");
  }
  px(g, GY_CX - CW + 1, GY_WIN + 9, CW * 2 - 2, 2, "#b8b1a0");        // 前缘暗面
  px(g, GY_CX - CW + 1, GY_WIN + 11, CW * 2 - 2, 1, "rgba(40,44,50,0.20)");

  /* 入口两翼的深色玻璃窗（照片里门左右各有一段，不是一片白瓷砖） */
  for (const [w0, w1] of [[GY_X0 + 12, GY_CX - GY_BAY - 22], [GY_CX + GY_BAY + 22, GY_X1 - 12]]) {
    px(g, w0, GY_WIN + 12, w1 - w0, 18, "#3f6169");
    px(g, w0, GY_WIN + 12, w1 - w0, 2, "#6f949c");
    px(g, w0, GY_WIN + 28, w1 - w0, 2, "#2b3d42");
    for (let x = w0 + 11; x < w1 - 3; x += 13) px(g, x, GY_WIN + 14, 1, 14, "#8d9aa0");
  }

  /* 门：青铜柱 + 深色玻璃 + 竖梃 + 门扇上的三角斜撑（照片里每扇门一片） */
  px(g, GY_CX - GY_BAY, GY_WIN + 11, GY_BAY * 2, GY_BASE - GY_WIN - 11, "#7d5c42");
  px(g, GY_CX - GY_BAY + 6, GY_WIN + 13, GY_BAY * 2 - 12, GY_BASE - GY_WIN - 15, "#2e3c40");
  px(g, GY_CX - GY_BAY + 6, GY_WIN + 13, GY_BAY * 2 - 12, 2, "#59767c");
  for (let x = GY_CX - GY_BAY + 12; x < GY_CX + GY_BAY - 8; x += 13)
    px(g, x, GY_WIN + 15, 1, GY_BASE - GY_WIN - 18, "#8d9aa0");
  for (let i = -1; i <= 1; i++) {
    const x = GY_CX + i * 26;
    for (let j = 0; j < 6; j++) {
      const w = 11 - j * 2, half = w >> 1;
      /* 只描 1px 的边：实心三角在门玻璃上太抢戏（照片里那圈金属框很细） */
      px(g, x - half, GY_WIN + 22 + j, j === 5 ? w : 1, 1, "#9aa7ac");
      if (j < 5) px(g, x + half, GY_WIN + 22 + j, 1, 1, "#9aa7ac");
    }
  }
}

/* --- 5.5.5 门前长台阶（照片里 13 级、米黄石材、钢管扶手） --- */
function gymStair(g) {
  const SX0 = GY_CX - 100, SW = 200, NT = 13, TH = GY_STAIR / NT;
  /* 两翼侧帮 */
  px(g, SX0 - 4, GY_BASE, 4, GY_STAIR, "#a8967a");
  px(g, SX0 + SW, GY_BASE, 4, GY_STAIR, "#a8967a");
  px(g, SX0 - 4, GY_BASE, 4, 1, "#c6b491");
  px(g, SX0 + SW, GY_BASE, 4, 1, "#c6b491");
  /* 13 级：踏步鼻迎光 + 踢面阴影，逐级微色差免得像一整块板 */
  for (let i = 0; i < NT; i++) {
    const y = GY_BASE + i * TH;
    px(g, SX0, y, SW, TH, i % 2 ? "#c9b795" : "#d2c0a0");
    px(g, SX0, y, SW, 1, "#e0cfa8");
    px(g, SX0, y + TH - 1, SW, 1, "#a08e6e");
  }
  /* 楼体落地线与台阶顶的接缝 */
  px(g, SX0, GY_BASE - 1, SW, 1, "rgba(30,34,40,0.35)");
  /* 钢管扶手：照片里是斜着往上收的（近宽远窄），像素上就是一条微斜的暗线 */
  for (const rx of [GY_CX - 46, GY_CX, GY_CX + 46]) {
    const botX = rx + Math.round((rx - GY_CX) * 0.10);
    const n = GY_STAIR - 14;
    for (let j = 0; j <= n; j++) {
      const rb = Math.round(rx + (botX - rx) * (j / n));
      /* 2px 实心杆 + 左缘高光（按行交替明暗会画成一条虚线，像绳子不像钢管） */
      px(g, rb, GY_BASE + 12 + j, 2, 1, "#4b5155");
      px(g, rb, GY_BASE + 12 + j, 1, 1, "#7d858a");
    }
    px(g, Math.round(botX) - 1, GY_BASE + 12 + n, 3, 2, "#3f4549");
  }
  /* 梯脚两盏立灯（照片左下那根） */
  for (const lx of [SX0 - 12, SX0 + SW + 6]) {
    px(g, lx, GY_BASE + 24, 4, GY_STAIR - 24, "#3a4145");
    px(g, lx, GY_BASE + 24, 1, GY_STAIR - 24, "#5c6569");
    px(g, lx - 1, GY_BASE + 20, 6, 4, "#c8963c");
    px(g, lx - 1, GY_BASE + 20, 6, 1, "#ecc97c");
  }
  /* 台阶外沿的接地影，让它"坐"在砖石路上 */
  px(g, SX0 - 4, GY_BASE + GY_STAIR, SW + 8, 1, "rgba(30,34,40,0.20)");
}

/* --- 5.5.6 覆盖重绘入口 --- */
function gymRestyle(b) {
  const old = b.canvas;
  /* 几何闸：30_building.js 的算式一旦改动，这里立刻在控制台报出来（好过默默画歪）。
     判据取**落地线以下的那截尾巴**（SHY 21 + 画布尾 14 = 35）而不是画布总高 ——
     总高跟着 roofT 走（本轮 345 → 504，因为屋面板改成铺满进深），尾巴才是
     "30 段的 PADT / SHY / 画布高公式没动"的那个不变量（PADT 一改它就变 37）。 */
  if (old.height - GY_BASE !== 35)
    console.warn("55_gym: 精灵高 %d − 落地线 %d ≠ 35，30 段的 PADT/roofT/SHY 公式可能改了",
                 old.height, GY_BASE);
  const c = mkCanvas(old.width, old.height + GY_STAIR);
  const g = c.getContext("2d");
  g.drawImage(old, 0, 0);
  /* 檐下沿以下整段擦掉重画（见文件头"为什么是覆盖重绘"） */
  g.clearRect(0, GY_EAVE, c.width, c.height - GY_EAVE);
  gymFacade(g);
  gymStair(g);
  b.canvas = c;
  return b;
}

/* --- 5.5.7 台阶净空（世界坐标，见文件头第三段） --- */
function clearGymStairs() {
  const C = GYM_CLR, cx1 = C.x + C.w, cy1 = C.y + C.h;
  const keep = [];
  let dropped = 0;
  for (const p of props) {
    /* 楼自己保留；宽 > 110 的当楼处理（体育馆本体宽 382） */
    if (p.img.width > 110) { keep.push(p); continue; }
    const x0 = p.x - p.ax, y0 = p.y - p.ay;
    if (x0 < cx1 && x0 + p.img.width > C.x && y0 < cy1 && y0 + p.img.height > C.y) {
      dropped++;
      continue;
    }
    keep.push(p);
  }
  props.length = 0;
  for (const p of keep) props.push(p);
  return dropped;
}
