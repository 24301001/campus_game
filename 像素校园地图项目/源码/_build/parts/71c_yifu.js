/* =========================================================
   7.6 逸夫楼 · 一楼大厅 + 咨询台 —— 学霸姐（第四十一轮）
   ---------------------------------------------------------
   这是**第三个**并入地图的项目（前两个：地图本身、刷题平台 campus_game）。
   学霸姐＝`xueba-ge`（Python FastAPI + SQLite 的教材问答），跑在 127.0.0.1:8010，
   走 Vite 的 `/xbg` 代理 ⇒ 与地图**同源** ⇒ iframe 一加载就是登录态。

   ⚠️ 本段**只放数据**：一个调色板、一个精灵工厂调用、一张房间描述符。
      引擎（进出 / 走动 / 碰撞 / 绘制 / 按键 / 提示 / 冷启动）全在 `71b_center.js`。
      **一行逻辑都不许写在这里** —— 一旦这里也 `window.addEventListener`，
      就会有两个 keydown 监听，而 `CENTER` 是共用的 ⇒ 先注册的那份
      `stopImmediatePropagation()` 会把本段整个挡掉，症状是"逸夫楼里按 B 出不了门"。

   ⚠️ 加载期只许取 `buildChar` / `npcSprites` / `defRoom` / `IDLE_BASE` / `CTR_*`
      这些常量 —— 全是 `71b` 段的东西（本段排它后面）。`player` / `keys` 依旧碰不得。
   ========================================================= */

/* --- 7.6.1 学霸姐的精灵：长发、藕荷紫外套 ---------------------------------
   与算法哥**同一套骨架、同一套步态**（都走 `npcSprites` → `buildChar(6, PAL)`），
   只有配色表和 `longHair` 钩子不同。

   ⚠️ 四个角色的识别色必须两两拉开 —— 玩家蓝 `#3f6ea8`、小北红 `#c0392b`、
      算法哥冷黑 `#2b3038`。这里选**藕荷紫**：全图没有第二个紫（楼群是红/米黄/灰、
      草木是绿，机房那点冷光 `#7fd6c8` 只在计算机中心那一间屋里），而暖色已经被
      小北的红与玩家书包的橙占掉了。
   ⚠️ 头发要**冷调紫黑**：逸夫楼是暖木/暖石场景，暖色长发会糊进墙里，
      冷黑是画面里最暗的一档，剪影最清楚。
   ⚠️ `pack` 三色取外套同色 = 她**不背包**（理由同算法哥，见 `71b` 的 ALG_PAL）。
   ⚠️⚠️ 这张表里**不许出现眼镜那个键** —— `build.py` 有一条 `count(...) == 1` 的断言，
      多一处就直接炸（连注释里都不许写那个字面量）。她长发的钩子是 `longHair`。 */
const XBJ_PAL = {
  skin:  "#f0c9a6", skinD: "#c9996f", skinL: "#ffe1c0",
  hair:  "#2a2430", hairL: "#453c52", hairD: "#171320",   // 冷调紫黑长直发
  coat:  "#8b6cc0", coatD: "#63468f", coatL: "#a98fd8",   // ⭐ 藕荷紫：全图唯一紫
  pant:  "#3b3f4d", pantD: "#272b36", pantL: "#555b6b",
  shoe:  "#4a3050", shoeL: "#6b4a72",
  pack:  "#8b6cc0", packD: "#63468f", packL: "#a98fd8",
  longHair: true                                           // ← 开 50_char.js 的长发钩子
};
const xuebajieSprite = npcSprites(XBJ_PAL);

/* --- 7.6.2 一楼大厅的房内布局 -------------------------------------------
   与计算机中心**一眼分得开**：那边是冷灰地砖 + 一排排**发光的显示器**；
   这边是**暖色石材地面 + 两根石柱 + 靠上墙的楼层导引牌 + 竖向长窗 + 咨询台**。
   逻辑画布沿用共用的 720×450（`CTR_W/CTR_H/CTR_WALL/CTR_R/CTR_H2`）。

   y=0   ┌─────────── 上墙 14px ───────────┐
   y=16  │ [楼层导引牌]            [窗][窗] │
   y=150 │      ┌─── 咨询台 ───┐            │   ← 实心 [250,150,220,56]
   y=190 │  ███柱            ███柱   学霸姐  │   ← 实心 [110,190,56,56] / [554,190,56,56]
   y=436 ├─────────[ 门 300..420 ]──────────┤

   ⚠️ **走道核算**（玩家半宽 `CTR_R = 7` ⇒ 任一维至少要 14 px 才过得去）：
        中央 x[470,554] = 84 ✅ · 左 x[166,250] = 84 ✅ · 右 x[610,706] = 96 ✅
        y[246,436] 整片全开 ✅
      改任何一个柱子的位置/尺寸都要把这三个数重算一遍，`_centerprobe.py` 的 C18
      会做网格采样 + BFS 兜底，但那是事后才发现，不如写的时候就算清楚。
   ⚠️ 学霸姐的 AABB `x[513,527] y[188,210]` 与右柱（x≥554）、咨询台（x≤470）都不重叠；
      玩家能站到 (520,240)，距她 30 px < talkR 74 ✅。 */
const YF_SOLID = [
  [0, 0, CTR_W, CTR_WALL],                        // 上墙
  [0, CTR_WALL, CTR_WALL, CTR_H],                 // 左墙
  [CTR_W - CTR_WALL, CTR_WALL, CTR_WALL, CTR_H],  // 右墙
  [0, CTR_H - CTR_WALL, CTR_W, CTR_WALL],         // 下墙
  [250, 150, 220, 56],                            // 咨询台
  [110, 190,  56, 56],                            // 左柱
  [554, 190,  56, 56],                            // 右柱
];
const YF_SPAWN = { x: 360, y: 430 };              // 门内侧，与计算机中心同一个落点习惯
const YF_NPC_X = 520, YF_NPC_Y = 210;             // 咨询台右侧，面朝门口

/* --- 7.6.3 画法四段：floor / walls / decor / door ------------------------ */
function yfFloor(g) {
  /* 暖色石材：大块拼接（48 网格），比机房的 32 网格粗一档，
     远看就是"公共大厅"而不是"机房"。 */
  g.fillStyle = "#c9b8a0"; g.fillRect(0, 0, CTR_W, CTR_H);
  g.fillStyle = "#bda98f";
  for (let x = 0; x < CTR_W; x += 48) g.fillRect(x, 0, 1, CTR_H);
  for (let y = 0; y < CTR_H; y += 48) g.fillRect(0, y, CTR_W, 1);
  /* 从门口直通咨询台的深色石带 —— 大厅的"动线"，也是进门第一眼的方向暗示 */
  g.fillStyle = "#a8927a"; g.fillRect(300, 206, 120, 230);
  g.fillStyle = "#bda98f"; g.fillRect(300, 206, 120, 3);
}
function yfWalls(g) {
  /* 一层**暖**光：大厅是白天开着灯的，不是机房那种冷白 */
  g.fillStyle = "rgba(255,238,205,0.075)";
  g.fillRect(CTR_WALL, CTR_WALL, CTR_W - CTR_WALL * 2, 180);
  g.fillStyle = "#6b5a48";
  g.fillRect(0, 0, CTR_W, CTR_WALL); g.fillRect(0, CTR_H - CTR_WALL, CTR_W, CTR_WALL);
  g.fillRect(0, 0, CTR_WALL, CTR_H); g.fillRect(CTR_W - CTR_WALL, 0, CTR_WALL, CTR_H);
  g.fillStyle = "#8d7962";
  g.fillRect(0, CTR_WALL - 2, CTR_W, 2); g.fillRect(0, CTR_H - CTR_WALL, CTR_W, 2);
  g.fillRect(CTR_WALL - 2, 0, 2, CTR_H); g.fillRect(CTR_W - CTR_WALL, 0, 2, CTR_H);
  /* 竖向长窗两扇（上墙右侧）：冷天光从暖墙里切进来，是这间房唯一的高对比处 */
  for (const wx of [556, 620]) {
    g.fillStyle = "#7d6a54"; g.fillRect(wx - 3, CTR_WALL, 46, 118);        // 窗框
    g.fillStyle = "#9fc4d8"; g.fillRect(wx, CTR_WALL + 3, 40, 112);        // 玻璃
    g.fillStyle = "#7d6a54";
    g.fillRect(wx + 19, CTR_WALL + 3, 2, 112);                             // 竖棂
    g.fillRect(wx, CTR_WALL + 57, 40, 2);                                  // 横棂
    g.fillStyle = "rgba(255,255,255,0.20)";
    g.fillRect(wx + 2, CTR_WALL + 5, 14, 108);                             // 玻璃反光
  }
}
function yfDecor(g) {
  /* 咨询台：台面 + 前挡板 + 台上的铜牌和一摞纸。
     ⚠️ 四边都不许越出 `[250,150,220,56]` —— 碰撞盒画小、装饰画大，
        玩家会"贴着空气走"，3× 档下看得一清二楚。 */
  g.fillStyle = "#8a6b4a"; g.fillRect(250, 150, 220, 56);
  g.fillStyle = "#a9835c"; g.fillRect(250, 150, 220, 6);        // 台面受光
  g.fillStyle = "#6f5439"; g.fillRect(250, 194, 220, 12);       // 前挡板暗部
  g.fillStyle = "#c9a54e"; g.fillRect(258, 156, 34, 22);        // 铜牌
  g.fillStyle = "#4a3d2e"; g.fillRect(258, 156, 34, 3);
  g.fillStyle = "#e8e2d4"; g.fillRect(430, 154, 24, 14);        // 一摞纸
  g.fillStyle = "#c9c2b2"; g.fillRect(430, 168, 24, 2);

  /* 两根石柱：柱础 / 柱身 / 柱头**全在 56×56 的碰撞盒内**（越界就是上面那条坑） */
  for (const cx of [110, 554]) {
    g.fillStyle = "#cfc0a8"; g.fillRect(cx, 190, 56, 56);       // 柱身
    g.fillStyle = "#e6dac4"; g.fillRect(cx, 190, 10, 56);       // 受光面
    g.fillStyle = "#a8987e"; g.fillRect(cx + 44, 190, 12, 56);  // 背光面
    g.fillStyle = "#8d7962"; g.fillRect(cx, 190, 56, 6);        // 柱头
    g.fillStyle = "#5f5142"; g.fillRect(cx, 240, 56, 6);        // 柱础
  }

  /* 楼层导引牌：靠上墙左边，深底 + 三行楼层横杠（一楼那行高亮成机房同款冷绿） */
  g.fillStyle = "#3c4652"; g.fillRect(60, CTR_WALL, 150, 62);
  g.fillStyle = "#55616f"; g.fillRect(60, CTR_WALL, 150, 3);
  g.fillStyle = "#e9e5d8";
  for (let i = 0; i < 3; i++) g.fillRect(72, CTR_WALL + 14 + i * 16, 126, 3);
  g.fillStyle = "#7fd6c8"; g.fillRect(72, CTR_WALL + 14, 20, 3);
  g.fillStyle = "#2c343d"; g.fillRect(120, CTR_WALL + 62, 30, 4);        // 支脚
}
function yfDoor(g) {
  /* 一扇双开玻璃门，位置与 `YF_SPAWN`（x=360）对齐 —— 进门第一眼正对咨询台 */
  const y = CTR_H - CTR_WALL;
  g.fillStyle = "#7a6248"; g.fillRect(300, y - 34, 120, 34);             // 门框
  g.fillStyle = "#a9c8d6"; g.fillRect(306, y - 30, 50, 28);              // 左扇玻璃
  g.fillStyle = "#a9c8d6"; g.fillRect(364, y - 30, 50, 28);              // 右扇玻璃
  g.fillStyle = "#eef6fa"; g.fillRect(306, y - 30, 50, 4);
  g.fillStyle = "#eef6fa"; g.fillRect(364, y - 30, 50, 4);
  g.fillStyle = "#c9c2b2"; g.fillRect(356, y - 22, 4, 16);               // 门把手（左右各一）
  g.fillStyle = "#c9c2b2"; g.fillRect(360, y - 22, 4, 16);
  g.fillStyle = "#5a4d3e"; g.fillRect(310, y - 4, 100, 4);               // 门口地垫
}

/* --- 7.6.4 登记进房间表 -------------------------------------------------- */
defRoom({
  key: "yifu",
  bld: "逸夫楼",
  pad: 90,                                    // 与计算机中心同款判定圈（外扩 90px）
  name: "逸夫楼 · 一楼大厅", sub: "咨询台",
  hint: "← → / A D 左右移动　↑ ↓ / W S 前后移动<br>走到学霸姐身边按 <b>C</b> 找她说话　·　按 <b>B</b> 出门回地图",
  enterTip: "按 F 进入逸夫楼",
  floor: yfFloor, walls: yfWalls, decor: yfDecor, door: yfDoor,
  solid: YF_SOLID,
  spawn: YF_SPAWN,
  npc: {
    name: "学霸姐", x: YF_NPC_X, y: YF_NPC_Y, dir: "down", step: IDLE_BASE,
    talkR: 74, spr: xuebajieSprite,
    ringCol: "rgba(184,150,224,0.80)",        // 光圈用她自己的藕荷紫，一眼知道"按 C 找的是谁"
    talkTip: "按 C 和学霸姐说话"
  },
  /* ⚠️ 相对路径（**不是** `http://127.0.0.1:8010/xbg/`）：
     同源 ⇒ 免登录 / Esc 穿透 iframe / 教材原件用浏览器原生下载（cookie 跟得上）。
     写成绝对地址就三件事**同时静默坏**，而地图这边一条验收都照不到。
     `build.py` 里有一条反向断言，产物里出现 `8010` 或 `127.0.0.1` 直接炸。 */
  app: "/xbg/",
  probe: "/xbg/api/health",                   // 学霸姐的健康检查（不要登录，见 backend/app.py）
  /* ⭐⭐ 第四十五轮：**开门前先验票**（见 `ctrOpenPlatform` 与 `xbgEnsure`）。
     ⚠️ 写成**函数**而不是直接引用 `xbgEnsure`：就为了探针能**按名字**替换它造负对照。 */
  ensure: function () { return xbgEnsure(); },
  coldTip: "学霸姐没在跑 —— 正在叫启动器（浏览器会问一次「是否打开」，点「打开」）…"
});
