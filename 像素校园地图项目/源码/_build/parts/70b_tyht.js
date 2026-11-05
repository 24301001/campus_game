/* =========================================================
   §5.20 天佑会堂（parts/70b_tyht.js）—— 第四十二轮
   ---------------------------------------------------------
   用户逐字（2026-10-02）：
     「我给了你天佑会堂的正面图，找到天佑会堂的位置并复刻出来」
   + 两个当场拍板的口径：
     ① 楼名 —— 选「**照图：竖排金字贴右墙，撤屋顶大牌子**」
     ② 台阶 —— 选「**都画：大台阶 + 彩色涂装**」

   素材：`预览\tianyouhuitang.png`（2048×1152，**AI 生成的正射立面插画**，
        右下角有"豆包 AI 生成"水印）。⚠️ 与 61/65/67/68/69 段的实拍/PPT 不同：
        这一张**没有 PPT 形状表**、也**不是实拍** ⇒ 本段的照片实测值全部由
        `_build/_tym.py`（一次性探针）逐行/逐列扫描读出，不是照抄哪份权威件。

   目标：`20_ground.js` 第 99 行那栋
        `["天佑会堂", "bld", 3.1125, 4.7465, 1.1792, 0.4854]`
        —— 校园西侧那一列（x 全等 3.1125），北边是积秀园/校史馆，南边是宿舍列。

   ============================ 一、这栋楼长什么样 ============================
   照片上从上到下清点（照片 px，主楼 x 95..1955 = 宽 1860）：
     ① 最顶一条**米黄女儿墙**（y 110..175）—— 墙自己露出的顶边；
     ② 一条**白色出檐板**（y 175..215，带若干支点）—— 幕墙顶上的挑檐；
     ③ 中央一大片**蓝色玻璃幕墙**（x 590..1450，y 220..500）：竖直长条窗格，
        蓝玻璃 + 米白竖梃交替，上部映天偏白、下部偏深蓝；
     ④ 一条**白色平台 + 栏杆**（y 500..545）—— 幕墙脚下的二层平台；
     ⑤ 一块**灰色悬挑雨棚**（y 545..610），檐底一排小筒灯；
     ⑥ **首层三组大门**（y 610..870）：深蓝玻璃门 + 灰竖框，落在平台上；
     ⑦ 左右各一条**通高窄窗带**（左 x 155..230 / 右 x 1818..1890，y 130..870）：
        蓝玻璃、被横线分段 —— 这是照片上最扎眼的两条竖边，缺了整栋就散；
     ⑧ 右侧墙面**竖排四个金色大字「天佑会堂」**（x 1700..1810，y 380..700）；
     ⑨ 底部**大台阶**（y 870..960）横跨整个楼宽 + 台阶下一条**彩色地面涂装**
        （红/黄/绿/蓝分块，y 950..1010，图上最抢眼的元素之一）。

   ============================ 二、实测换算 ============================
   横向：照片主楼宽 1860 px ↔ 精灵立面宽 w（= footprint 宽 460.6，取整 461）
         sc = w / 1860 = 0.2479          X(v) = PADX + round((v − 95)·sc)
   纵向：照片「墙顶(110) → 地面线(870)」760 px ↔ 墙高 wallH（= 2×34 = 68）
         sv = wallH / 760 = 0.0895

   ⚠️ **纵向这两个比例差 2.77 倍**（0.2479 vs 0.0895）—— 因为本栋只有 **2 层**
      （wallH 68 行），而照片是一栋又扁又宽的会堂（1860 : 760 ≈ 2.45 : 1）。
      照 70_jianyi 的纪律：**横向逐元素对得上，纵向一律走自设计的分带**
      （照片那条"白檐带只占 3.6 行"是画不出来的，硬照抄只会糊成一片灰）。
      本段的纵向分配（行，自 eaveY 起）：

        带          行区间     照片对应      说明
        ----------  --------  ------------  --------------------------
        幕墙顶檐带   132..140  y 175..215   白出檐板（照片 40px → 给 8 行）
        玻璃幕墙     140..170  y 220..500   蓝幕墙（照片 280px → 给 30 行）
        白平台       170..176  y 500..545   平台 + 栏杆
        灰雨棚       176..183  y 545..610   悬挑 + 筒灯
        首层门区     183..200  y 610..870   三组大门
      右墙金字竖跨 **140..200**（4 字 × 15 行）—— 照片上只占 29 行（每字 7 行，
      那个高度二值化出来是一团墨），按 70_jianyi「哪一层对得上」的规矩放大到可读。

   ============================ 三、为什么不换画布 ============================
   同 70_jianyi：**不换画布、不动 b.ay**，只覆盖行 [PADT, baseY)（屋面 + 立面）。
   台阶与投影本来就在 baseY 以下 —— 但本轮用户点名要「大台阶 + 彩色涂装」，
   所以本段**往下多画到 baseY + 22**（那是 30 段原本画小台阶的位置，本段把它整块
   重画成宽台阶 + 彩绘，不改任何世界坐标）。
   ⇒ `b.canvas` / `b.ay` / `b.w` / `b.y` 四样都不动，世界落地线、碰撞盒、footprint
      一个字节不变 ⇒ 全校园散射随机流一个数不动（§6.6 那颗地雷，探针 `_propdiff.py`）。
   ⚠️ 本段不碰共享 RNG（唯一随机量是屋面斑点的局部 `makeRng(7020)`）。
   ========================================================= */

const TY_NAME   = "天佑会堂";                 // ⚠️ 必须与 CAMPUS 里的名字逐字相同
const TY_PADX   = 26, TY_PADT = 18;           // 与 30 段同值
const TY_PADB   = 21 + 14;                    // SHY + 14 —— 30 段画布高公式的尾巴
const TY_FLOORS = 2;                          // ⚠️ 必须等于 styleOf("天佑会堂").floors

/* 照片实测（px）—— 改这一组就得重跑 `_tym.py`，别凭印象调 */
const TY_PX0    = 95;                         // 照片里主楼左缘
const TY_PW     = 1860;                       // 主楼宽（x 95..1955）
const TY_GY     = 870;                        // 照片"地面线"（台阶顶那一行）
const TY_RISE   = 760;                        // 墙顶(110) → 地面(870) 的行数 = 立面高
const TY_CURT   = [590, 1450];                // 中央幕墙 / 门区的 x 范围（照片 px）
const TY_WNL    = [155, 230];                 // 左通高窄窗带 x
const TY_WNR    = [1818, 1890];               // 右通高窄窗带 x
const TY_GOLDS  = [1700, 1810];               // 右墙金字列的 x 范围
const TY_STEP   = [95, 1955, 870, 960];       // 大台阶 x0,x1,顶,底（照片 px）
const TY_PAINT  = [600, 1500, 950, 1010];     // 彩色地面涂装 x0,x1,y0,y1

/* 自设计的纵向分带（行数；五段之和必须 = wallH = 68） */
const TY_B_EAVE = 8;                          // 幕墙顶白檐带
const TY_B_CURT = 30;                         // 玻璃幕墙
const TY_B_PLAT = 6;                          // 白平台 + 栏杆
const TY_B_CAN  = 7;                          // 灰悬挑雨棚
/* 余下 = 68 − 8 − 30 − 6 − 7 = 17 行 = 首层门区 */

/* --- 5.20.1 调色：**照片的实测色** -----------------------------------------
   ⚠️ 同 65/67/68/69/70 段的规矩：本段不拿 `pal` 推任何一个色，照片给什么色
      就是什么色。`pal` 这个实参留着只为与那一串 `xxxRestyle(b, pal)` 的签名对齐。
   ⚠️ 不许再存一份 PALETTE（TDZ，58 段栽过：整页 JS 死）。 */
const TY_C = {
  WALL:  "#f6e8c6",   // 米黄石材墙（照片实测 #ffefd4，略降亮免得糊成白）
  WALLT: "#fdf4dc",   // 墙左棱受光
  WALLD: "#ddc99c",   // 墙右棱背光
  STONE: "#ecdcb4",   // 石材横缝（照片里是水刷石，一条条细横线）
  SHAD:  "rgba(14,18,28,0.30)",  // 檐下阴影
  EAVE:  "#f2f0ea",   // 幕墙顶白檐板
  EAVL:  "#ffffff",
  EAVD:  "#cbc8c0",
  CURT:  "#4a9bd3",   // 幕墙玻璃
  CURTL: "#86c0ea",   // 玻璃上段映天
  CURTD: "#2b7cb8",   // 玻璃下段深蓝
  MULL:  "#efe9d9",   // 幕墙米白竖梃
  MULLD: "#c9c2ae",
  PLAT:  "#f7f6f3",   // 白平台板
  PLATD: "#cfcdc7",
  RAIL:  "#e4e2dd",   // 栏杆
  CAN:   "#5a5d64",   // 灰悬挑雨棚（板面）
  CANL:  "#8b8e95",   // 雨棚上棱受光
  CAND:  "#3f4248",   // 雨棚下沿背光
  LAMP:  "#fff6dd",   // 雨棚底筒灯
  DOOR:  "#2f7db4",   // 门玻璃
  DOORL: "#5aa3d6",   // 门玻璃高光
  DOORD: "#1f5f90",   // 门玻璃深部
  DFRA:  "#b4b8bf",   // 门框灰
  DFRL:  "#d6dade",
  GOLD:  "#e8d9a8",   // 金字（与 30 段屋名牌同一支金）
  GOLDD: "#b99f5e",   // 金字描边暗面
  R_EDGE:"#d3c5a2",   // 屋面檐口外沿
  R_DECK:"#eee2c0",   // 屋面板面
  R_TOP: "#f8f0d6",   // 女儿墙顶受光
  R_LIT: "#f1e6c6",   // 屋面左内侧受光
  R_DIM: "#ddd0aa",   // 屋面右内侧背光
  R_EAVE:"#bcae8c",   // 檐口投影线
  DEV:   "#dad3bd",   // 屋面设备
  DEVD:  "#b8b09a",
  STEP:  "#efe4c4",   // 台阶踏面
  STEPL: "#fbf3da",   // 踏面受光边
  STEPD: "#c9ba94",   // 踏步竖面
  PAINT: ["#e8615c", "#f2c53d", "#79cf5b", "#4ecbf9"]  // 彩绘四色（红黄绿蓝）
};

/* --- 5.20.2 几何：一律现算，一处写死 ----------------------------------------
   ⚠️ `roofT` 是**反解**的（c.height 减去 30 段那四段固定高），不存第二份。 */
function tyGeo(c) {
  const wallH0 = TY_FLOORS * FLOOR_H;
  const roofT  = c.height - TY_PADT - wallH0 - TY_PADB;   // 反解（本楼 = 114）
  const eaveY  = TY_PADT + roofT;
  const w      = c.width - TY_PADX * 2;
  const sc     = w / TY_PW;
  const sv     = wallH0 / TY_RISE;
  const baseY  = eaveY + wallH0;
  const x0     = TY_PADX, x1 = TY_PADX + w;
  /* 照片 x → 画布 x（两端各取整再相减：相邻两块才不会差 1px 露缝） */
  const X = (v) => TY_PADX + Math.round((v - TY_PX0) * sc);
  const G = {
    roofT: roofT, wallH: wallH0, eaveY: eaveY, baseY: baseY,
    x0: x0, x1: x1, w: w, sc: sc, sv: sv, X: X, H: c.height
  };
  /* 纵向分带端点（自设计，见文件头 §二） */
  G.yE0  = eaveY;                          // 幕墙顶檐带 顶
  G.yE1  = eaveY + TY_B_EAVE;              // 幕墙 顶
  G.yC1  = G.yE1 + TY_B_CURT;              // 幕墙 底 / 平台 顶
  G.yP1  = G.yC1 + TY_B_PLAT;              // 平台 底 / 雨棚 顶
  G.yN1  = G.yP1 + TY_B_CAN;               // 雨棚 底 / 门区 顶
  /* 横向四条 */
  G.curt = { x0: X(TY_CURT[0]),  x1: X(TY_CURT[1])  };
  G.wnl  = { x0: X(TY_WNL[0]),   x1: X(TY_WNL[1])   };
  G.wnr  = { x0: X(TY_WNR[0]),   x1: X(TY_WNR[1])   };
  G.gold = { x0: X(TY_GOLDS[0]), x1: X(TY_GOLDS[1]) };
  /* 台阶（画在 baseY 以下的 22 行里） */
  G.stair = { x0: x0, x1: x1, y0: baseY, y1: baseY + 22, n: 7 };
  /* 彩绘（台阶下 8 行） */
  G.paint = { x0: X(TY_PAINT[0]), x1: X(TY_PAINT[1]),
              y0: baseY + 22, y1: baseY + 30 };

  /* --- 闸们：这一组数一错，出图是一栋比例崩掉的楼，而五套自动验收全不看画面 --- */
  if (roofT < 20 || roofT > 190)
    console.warn("70b_tyht: 反解出的 roofT=%d 出了 30 段的 clamp 区间[20,190] —— " +
                 "画布高 %d 与 PADT/wallH/SHY 公式对不上了", roofT, c.height);
  if (G.yE1 >= G.yC1 || G.yC1 >= G.yP1 || G.yP1 >= G.yN1 || G.yN1 >= baseY)
    console.warn("70b_tyht: 立面五段的行序乱了 [%d,%d,%d,%d,%d] —— " +
                 "TY_B_* 四个分带数配不上 wallH(%d)", G.yE0, G.yE1, G.yC1, G.yP1, G.yN1, wallH0);
  if (TY_B_EAVE + TY_B_CURT + TY_B_PLAT + TY_B_CAN >= wallH0)
    console.warn("70b_tyht: 四个分带(%d)已经吃光墙高(%d)，首层门区没地方了",
                 TY_B_EAVE + TY_B_CURT + TY_B_PLAT + TY_B_CAN, wallH0);
  if (G.curt.x0 <= x0 || G.curt.x1 >= x1)
    console.warn("70b_tyht: 幕墙 x[%d,%d] 越出立面 [%d,%d]", G.curt.x0, G.curt.x1, x0, x1);
  if (G.wnl.x1 >= G.curt.x0 || G.wnr.x0 <= G.curt.x1)
    console.warn("70b_tyht: 左右窄窗带与中央幕墙重叠了 [%d,%d] / [%d,%d] / [%d,%d]",
                 G.wnl.x0, G.wnl.x1, G.curt.x0, G.curt.x1, G.wnr.x0, G.wnr.x1);
  if (G.gold.x0 <= G.curt.x1 || G.gold.x1 >= G.wnr.x0)
    console.warn("70b_tyht: 金字列 x[%d,%d] 没夹在幕墙(%d)与右窄窗带(%d)之间 —— " +
                 "要么压幕墙、要么压窗带", G.gold.x0, G.gold.x1, G.curt.x1, G.wnr.x0);
  return G;
}

/* --- 5.20.3 右墙竖排金字：系统字体 → 二值化（照 30 段 §3.0 makeSign 那一套）---
   与 30 段那份的区别：**单字**、字号可传。竖排由调用方按字逐个贴。 */
function tyGlyph(ch, fs) {
  const t = mkCanvas(8, 8);
  let tc = t.getContext("2d");
  const FONT = "bold " + fs + "px 'Microsoft YaHei','SimHei','PingFang SC',sans-serif";
  tc.font = FONT;
  const tw = Math.ceil(tc.measureText(ch).width) + 6, th = fs + 10;
  t.width = tw; t.height = th;                 // ⚠️ 改尺寸会重置上下文，必须重取
  tc = t.getContext("2d");
  tc.font = FONT;
  tc.textBaseline = "top";
  tc.fillStyle = "#000";
  tc.fillText(ch, 3, 4);
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
  if (maxX < 0) return null;                   // 拿不到字形
  return { pts: pts, w: maxX - minX + 1, h: maxY - minY + 1, minX: minX, minY: minY };
}
function tyStamp(g, pl, x, y, col) {
  g.fillStyle = col;
  for (let i = 0; i < pl.pts.length; i += 2)
    g.fillRect(x + pl.pts[i] - pl.minX, y + pl.pts[i + 1] - pl.minY, 1, 1);
}

/* --- 5.20.4 屋面（行 [PADT, eaveY)）------------------------------------------
   照片是正射图、看不到顶面 ⇒ 这一块是**自设计**的：浅米色平顶 + 女儿墙 + 两个
   设备箱（笔法照 30 段 §3.2，只是换成这栋楼的米色系）。
   ⚠️ 覆盖范围含 30 段的檐口外沿那两笔（x0−3 .. x1+3）：不盖的话左右各会留下
      两条棕色竖边（出图像"屋顶镶了棕框"）。 */
function tyRoof(g, G) {
  const ex0 = G.x0 - 3, ex1 = G.x1 + 3;
  px(g, ex0, TY_PADT, ex1 - ex0, G.roofT, TY_C.R_EDGE);          // 檐口外沿
  px(g, G.x0, TY_PADT + 2, G.w, G.roofT - 5, TY_C.R_DECK);       // 板面
  px(g, G.x0, TY_PADT + 2, G.w, 4, TY_C.R_TOP);                  // 女儿墙顶受光
  px(g, G.x0, TY_PADT + 6, G.w, 3, TY_C.SHAD);                   // 女儿墙内阴影
  px(g, G.x0, TY_PADT + 6, 4, G.roofT - 9, TY_C.R_LIT);          // 左内侧受光
  px(g, G.x1 - 4, TY_PADT + 6, 4, G.roofT - 9, TY_C.R_DIM);      // 右内侧背光
  px(g, ex0, TY_PADT + G.roofT - 1, ex1 - ex0, 2, TY_C.R_EAVE);  // 檐口投影线
  /* 设备箱：两个固定位置（不掷 RNG —— 本段不许碰共享流） */
  const dev = [[G.x0 + 92, TY_PADT + 28, 46, 18], [G.x0 + 300, TY_PADT + 44, 56, 22]];
  for (let i = 0; i < dev.length; i++) {
    const dx = dev[i][0], dy = dev[i][1], dw = dev[i][2], dh = dev[i][3];
    px(g, dx + 4, dy + 4, dw, dh, TY_C.SHAD);                    // 投影
    px(g, dx, dy + dh - 4, dw, 4, TY_C.DEVD);                    // 侧墙
    px(g, dx, dy, dw, dh, TY_C.DEV);
    px(g, dx, dy, dw, 3, TY_C.R_TOP);
    px(g, dx, dy + dh - 1, dw, 1, TY_C.SHAD);
  }
  /* 斑点（30 段同款），局部 RNG ⇒ 不碰建筑序列 */
  const rng = makeRng(7020);
  speckle(g, G.x0 + 4, TY_PADT + 7, G.w - 8, G.roofT - 12, "rgba(255,255,255,0.06)", (G.w / 3) | 0, rng);
  speckle(g, G.x0 + 4, TY_PADT + 7, G.w - 8, G.roofT - 12, "rgba(0,0,0,0.06)", (G.w / 4) | 0, rng);
}

/* --- 5.20.5 一条通高窄窗带（左右各一条）------------------------------------- */
function tyStrip(g, sx0, sx1, y0, y1) {
  const w = sx1 - sx0 + 1;
  px(g, sx0 - 1, y0, w + 2, y1 - y0, TY_C.MULLD);              // 外框（米白宽边）
  px(g, sx0, y0 + 1, w, y1 - y0 - 2, TY_C.CURT);
  px(g, sx0, y0 + 1, 2, y1 - y0 - 2, TY_C.CURTL);              // 左棱受光
  px(g, sx1 - 1, y0 + 1, 2, y1 - y0 - 2, TY_C.CURTD);          // 右棱背光
  px(g, sx0, y0 + 1, w, 5, TY_C.CURTL);                        // 顶部映天
  /* 横分格：每 12 行一道（读作"这几扇窗上下叠着"） */
  for (let y = y0 + 12; y < y1 - 3; y += 12)
    px(g, sx0, y, w, 1, TY_C.MULLD);
  px(g, sx0 - 1, y0, 1, y1 - y0, "#dcd6c4");                   // 左轮廓
  px(g, sx1 + 1, y0, 1, y1 - y0, "#b9b3a0");                   // 右轮廓
}

/* --- 5.20.6 中央玻璃幕墙（含顶檐板）------------------------------------------- */
function tyCurtain(g, G) {
  const c = G.curt, x0 = c.x0, x1 = c.x1, w = x1 - x0 + 1;
  /* ① 顶檐白板（照片里幕墙顶上那条出檐，两端各有一个支点块） */
  px(g, x0 - 4, G.yE0, w + 8, TY_B_EAVE - 1, TY_C.EAVE);
  px(g, x0 - 4, G.yE0, w + 8, 2, TY_C.EAVL);                   // 板顶受光
  px(g, x0 - 4, G.yE0 + TY_B_EAVE - 1, w + 8, 1, TY_C.EAVD);   // 板下背光
  px(g, x0 - 4, G.yE0, 1, TY_B_EAVE - 1, TY_C.EAVL);
  px(g, x1 + 3, G.yE0, 1, TY_B_EAVE - 1, TY_C.EAVD);
  /* ② 幕墙玻璃（上段映天浅、下段深蓝） */
  const y0 = G.yE1, y1 = G.yC1;
  px(g, x0, y0, w, y1 - y0, TY_C.CURT);
  px(g, x0, y0, w, Math.round((y1 - y0) * 0.34), TY_C.CURTL);  // 上部映天
  px(g, x0, y1 - 5, w, 5, TY_C.CURTD);                         // 底部压深
  /* ③ 竖梃：每 12 列一道米白竖条（照片里蓝玻璃与米白框交替） */
  for (let x = x0 + 11; x < x1 - 2; x += 12) {
    px(g, x, y0, 3, y1 - y0, TY_C.MULL);
    px(g, x + 3, y0, 1, y1 - y0, TY_C.MULLD);
  }
  px(g, x0, y0, 3, y1 - y0, TY_C.MULL);                        // 左端框
  px(g, x1 - 2, y0, 3, y1 - y0, TY_C.MULLD);                   // 右端框
  /* ④ 中段一道横梁（照片幕墙腰间那条浅线） */
  const ymid = y0 + Math.round((y1 - y0) * 0.52);
  px(g, x0, ymid, w, 1, TY_C.MULL);
  px(g, x0 - 3, y0, 1, y1 - y0, "#c9c2ae");                    // 左轮廓
  px(g, x1 + 2, y0, 1, y1 - y0, "#a9a292");                    // 右轮廓
}

/* --- 5.20.7 白平台 + 栏杆 ----------------------------------------------------- */
function tyPlatform(g, G) {
  const c = G.curt, x0 = c.x0 - 6, x1 = c.x1 + 6, w = x1 - x0 + 1;
  const y0 = G.yC1, y1 = G.yP1;
  px(g, x0, y0, w, y1 - y0, TY_C.PLAT);                        // 平台板
  px(g, x0, y0, w, 2, TY_C.EAVL);                              // 板顶受光
  px(g, x0, y1 - 1, w, 1, TY_C.PLATD);                         // 板底背光
  px(g, x0 + 2, y0 - 2, w - 4, 2, TY_C.RAIL);                  // 栏杆（在平台之上一条）
  for (let x = x0 + 4; x < x1 - 2; x += 8) px(g, x, y0 - 2, 1, 3, TY_C.PLATD);
}

/* --- 5.20.8 灰色悬挑雨棚 + 筒灯 ----------------------------------------------- */
function tyCanopy(g, G) {
  const c = G.curt, x0 = c.x0 - 10, x1 = c.x1 + 10, w = x1 - x0 + 1;
  const y0 = G.yP1, y1 = G.yN1;
  px(g, x0, y0, w, 3, TY_C.CANL);                              // 棚顶受光
  px(g, x0, y0 + 3, w, y1 - y0 - 4, TY_C.CAN);                 // 板面
  px(g, x0, y1 - 1, w, 1, TY_C.CAND);                          // 板下沿背光
  px(g, x0, y0 + 3, 2, y1 - y0 - 4, TY_C.CANL);                // 左端受光
  px(g, x1 - 2, y0 + 3, 2, y1 - y0 - 4, TY_C.CAND);            // 右端背光
  /* 檐底一排筒灯（照片里那排小白点） */
  for (let x = x0 + 10; x < x1 - 6; x += 22)
    px(g, x, y1 - 2, 3, 2, TY_C.LAMP);
}

/* --- 5.20.9 首层三组大门 ------------------------------------------------------ */
function tyDoors(g, G) {
  const c = G.curt, y0 = G.yN1, y1 = G.baseY - 1;
  const gw = c.x1 - c.x0 + 1;
  px(g, c.x0, y0, gw, y1 - y0 + 1, TY_C.DFRA);                 // 门厅底色（灰框）
  /* 三组门：等宽三分，每组内部再分 4 扇 */
  const ng = 3, gap = 6;
  const seg = Math.floor((gw - gap * (ng + 1)) / ng);
  for (let gi = 0; gi < ng; gi++) {
    const gx0 = c.x0 + gap + gi * (seg + gap), gx1 = gx0 + seg - 1;
    /* 每组门扇 */
    px(g, gx0, y0 + 2, seg, y1 - y0 - 1, TY_C.DOOR);
    px(g, gx0, y0 + 2, seg, Math.round((y1 - y0) * 0.30), TY_C.DOORL);  // 上方映天
    px(g, gx0, y1 - 4, seg, 5, TY_C.DOORD);                             // 下部深
    /* 组内竖框：4 扇 */
    const ns = 4, sw = Math.floor(seg / ns);
    for (let si = 1; si < ns; si++)
      px(g, gx0 + si * sw, y0 + 2, 1, y1 - y0 - 1, TY_C.DFRL);
    px(g, gx0 - 1, y0 + 2, 1, y1 - y0 - 1, TY_C.DFRL);                  // 组左框
    px(g, gx1 + 1, y0 + 2, 1, y1 - y0 - 1, "#9aa0a8");                  // 组右框
    px(g, gx0 + Math.round(seg / 2) - 1, y0 + Math.round((y1 - y0) * 0.55), 3, 5, "#dfe3e7"); // 门把手
  }
  px(g, c.x0, y0, gw, 2, TY_C.DFRL);                           // 门厅上沿
  px(g, c.x0 - 1, y0, 1, y1 - y0 + 1, "#9aa0a8");              // 左轮廓
  px(g, c.x1 + 1, y0, 1, y1 - y0 + 1, "#8f959d");              // 右轮廓
}

/* --- 5.20.10 立面总装 -------------------------------------------------------- */
function tyFront(g, G) {
  const x0 = G.x0, x1 = G.x1, w = G.w, eaveY = G.eaveY, baseY = G.baseY;
  /* ① 整面米黄石材墙 */
  px(g, x0, eaveY, w, G.wallH, TY_C.WALL);
  px(g, x0, eaveY, 3, G.wallH, TY_C.WALLT);                    // 左棱受光
  px(g, x1 - 4, eaveY, 4, G.wallH, TY_C.WALLD);                // 右棱背光
  px(g, x0, eaveY, w, 1, TY_C.STONE);                          // 墙顶线
  for (let i = 0; i < 10; i++)                                 // 檐下阴影带
    px(g, x0, eaveY + 1 + i, w, 1, "rgba(14,18,28," + (0.26 * (1 - i / 10)).toFixed(3) + ")");
  /* 石材横缝（每 9 行一条浅线，照片里是水刷石的细横纹） */
  for (let y = eaveY + 9; y < baseY - 2; y += 9) px(g, x0, y, w, 1, TY_C.STONE);
  /* ② 左右通高窄窗带 */
  tyStrip(g, G.wnl.x0, G.wnl.x1, eaveY + 2, baseY - 1);
  tyStrip(g, G.wnr.x0, G.wnr.x1, eaveY + 2, baseY - 1);
  /* ③ 中央：幕墙 → 平台 → 雨棚 → 门 */
  tyCurtain(g, G);
  tyPlatform(g, G);
  tyCanopy(g, G);
  tyDoors(g, G);
  /* ④ 外轮廓（照 30 段 §3.8 的位置，换成米黄系） */
  px(g, x0 - 1, eaveY, 1, G.wallH + 1, "#cbbd98");
  px(g, x1, eaveY, 1, G.wallH + 1, "#a89b78");
}

/* --- 5.20.11 右墙竖排金字「天佑会堂」-----------------------------------------
   竖跨 [yE1, baseY)：4 字 × 15 行。⚠️ 这是**自设计的字号**（照片上每字只 7 行，
   二值化出来是一团墨）—— 见文件头 §二 最后一段。 */
function tyGold(g, G) {
  const fs = 14, step = 15;
  const gw = G.gold.x1 - G.gold.x0 + 1;
  let y = G.yE1 + 2;
  for (let i = 0; i < TY_NAME.length; i++) {
    const pl = tyGlyph(TY_NAME.charAt(i), fs);
    if (pl) {
      const gx = G.gold.x0 + Math.round((gw - pl.w) / 2);
      /* 先扫一圈暗描边（让金字在米黄墙上立得住），再补金 */
      for (let d = 0; d < pl.pts.length; d += 2)
        px(g, gx + pl.pts[d] - pl.minX - 1, y + pl.pts[d + 1] - pl.minY + 1, 1, 1, TY_C.GOLDD);
      tyStamp(g, pl, gx, y, TY_C.GOLD);
    }
    y += step;
  }
  if (y - step > G.baseY) console.warn("70b_tyht: 竖排金字溢出立面底（末字底 %d > %d）", y - step, G.baseY);
}

/* --- 5.20.12 大台阶 + 彩色地面涂装 -------------------------------------------
   ⚠️ 这一段画在 **baseY 以下**（30 段原本画小台阶的那 35 行）—— 是本段与
      70_jianyi「只覆盖 [PADT, baseY)」的唯一分歧点，起因是用户点名要台阶与彩绘。
      不改任何世界坐标：台阶底就是精灵底，仍在 footprint 之内。 */
function tyStair(g, G) {
  const s = G.stair, w = s.x1 - s.x0 + 1;
  const bn = s.y1 - s.y0;                                      // 22 行
  const n = s.n, sh = Math.floor(bn / n);                      // 每级台阶行数
  px(g, s.x0, s.y0, w, bn, TY_C.STEPD);                        // 台阶侧壁底色
  for (let i = 0; i < n; i++) {
    const y = s.y0 + i * sh;
    px(g, s.x0, y, w, sh - 1, i % 2 ? TY_C.STEP : TY_C.STEPL); // 踏面
    px(g, s.x0, y, w, 1, TY_C.STEPL);                          // 踏面前缘受光
    px(g, s.x0, y + sh - 1, w, 1, "rgba(14,18,28,0.22)");      // 踏步投影
  }
  /* 台阶两端各一段扶手（照片里那对不锈钢斜杆）—— 画成两条浅灰斜线 */
  for (let i = 0; i < n; i++) {
    const y = s.y0 + i * sh;
    px(g, G.wnl.x0, y, 1, sh, "#c6cacf");                      // 左扶手（窄窗带正下方）
    px(g, G.wnr.x1, y, 1, sh, "#c6cacf");                      // 右扶手
  }
  /* 彩色地面涂装（台阶下 8 行，红黄绿蓝分块） */
  const p = G.paint, pw = p.x1 - p.x0 + 1, np = TY_C.PAINT.length;
  const segw = Math.floor(pw / np);
  for (let i = 0; i < np; i++) {
    const xa = p.x0 + i * segw, xb = (i === np - 1) ? p.x1 : xa + segw - 1;
    px(g, xa, p.y0, xb - xa + 1, p.y1 - p.y0, TY_C.PAINT[i]);
  }
  px(g, p.x0, p.y1 - 1, pw, 1, "rgba(14,18,28,0.26)");         // 彩绘下缘压深
}

/* --- 5.20.13 覆盖重绘入口 ----------------------------------------------------
   ⚠️ 必须在 60_assemble.js 分发链里、addProp **之前**调（否则 props 里挂的还是旧精灵）。
   ⚠️ 本函数不碰共享 RNG（唯一随机量是 §5.20.4 屋面的局部 makeRng(7020)）。
   ⚠️ 不换画布、不动 b.ay / b.w / b.y；覆盖区 = 行 [PADT, baseY+30)，世界落地线、
      addSolid 碰撞盒、footprint 一个字节不动。 */
function tyRestyle(b, pal) {
  const c = b.canvas, g = c.getContext("2d");
  const G = tyGeo(c);
  /* ① 覆盖整面（含 30 段两条外轮廓，左右各多盖 1px） */
  px(g, G.x0 - 1, G.eaveY, G.x1 - G.x0 + 2, G.baseY - G.eaveY, TY_C.WALL);
  tyRoof(g, G);
  /* ② 立面：墙 → 窄窗带 → 幕墙 → 平台 → 雨棚 → 门 → 轮廓 */
  tyFront(g, G);
  tyGold(g, G);
  /* ③ 大台阶 + 彩绘（30 段的小台阶与投影就在这片区域，整块重画） */
  tyStair(g, G);
  /* ④ 接地阴影带（30 段 §3.8 那一笔，被 ② 的立面覆盖吃掉了，按同一支笔补回） */
  contactBand(g, G.x0 + 1, G.x1 - 1, G.baseY - 1, 2, 0.34);
  return b;
}
