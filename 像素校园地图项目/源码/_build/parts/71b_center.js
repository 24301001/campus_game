/* =========================================================
   7.5 室内场景引擎 + 计算机中心（第四十轮建，第四十一轮拆成引擎）
   ---------------------------------------------------------
   第四十轮这里写的是"计算机中心一间房"的整段代码。第四十一轮要加逸夫楼
   （学霸姐 · 一楼大厅）时，把它拆成 **引擎 + 房间表**：

     · 本段  = 引擎（进出 / 走动 / 碰撞 / 绘制 / 按键 / 提示 / 冷启动 / 登录门）
               + `ROOMS.center` 这一间房的数据
     · `71c_yifu.js` = `ROOMS.yifu`，**只放数据**，一行逻辑都不写

   ⚠️ 为什么不是"复制一份骨架"：复制 = **两个 window keydown 监听**。两份都得判
      "我在不在当前房间"，而状态对象 `CENTER` 必须共用（否则 C3/C5 那两条判据全废）
      ⇒ 先注册的那份永远先跑并 `stopImmediatePropagation()`，后一份**永远触发不到**，
      症状是"逸夫楼里按 B 出不了门"。而且会撞 `build.py` 那条"室内按键表只能有一张"
      的计数断言（⚠️ 这里**故意不把那行代码抄过来** —— 抄了就等于往产物里多塞一份
      那个字面量，那条计数断言当场变 2，报的错还指向完全无关的地方）。

   ⚠️⚠️ **本段在 chunks 里必须排在 `72_guide.js` 之前** —— 第四十轮的命门，本轮不变。
       72 段那个全局 keydown 是全项目最早注册的，靠注册顺序 + `stopImmediatePropagation()`
       压住后面所有人（主循环的 WATCHED、补丁 7 的缩放）。本段若排在它之后，
       室内按 Esc 会触发向导那张四档梯子、按 E 会把小北叫过来。
       编号 `71b` 表的是**位置**不是序号（同 `59b_weiren.js`）。
       `71c_yifu.js` 也要排在同一侧（它调本段的 `defRoom`，且必须在 72 段之前）。

   ⚠️ **加载期禁忌**（同 73 / 74 段的教训）：本段加载期**只许取** `IX` / `CAMPUS` /
       `zoneRect` / `buildChar` / `charSprite` / `CH_AX` / `CH_AY` / `WALK_FRAMES` /
       `IDLE_BASE` / `IDLE_FRAMES` / `IDLE_HZ` / 几个 DOM 元素 —— 全是本段**之前**的段。
       **不许取** `player` / `cam` / `ctx` / `keys` / `zoom` / `cv`：那六个的 `const`
       都在主循环切片里（Demo L1247 / L1257），排在本段**之后**，加载期取会撞 TDZ
       （整页 JS 静默死掉，58 段的 PALETTE 栽过一次）。
       本段只在**函数体内**读它们，函数都是被 rAF / 事件调用的，那时早已初始化。

   ⚠️ 本段**不动主循环**：室内是独立的覆盖画布 + 自己的 rAF，主循环 `update`/`render`
       一行不改，所以**不需要新补丁、不碰 loop 切片、不加 addSolid**
       ⇒ 散射种子那颗地雷（60 段 §6.6）根本不会响。
   ========================================================= */

/* --- 7.5.1 精灵工厂：两个 NPC 共用同一套骨架 ---------------------------
   与 `71_guide_char.js` 完全同构：同一套骨架、同一套步态，只换配色表。
   ⚠️ `HH` 必须写 **6** —— 与玩家（`buildChar(6)`）和小北同档。写别的会让 NPC
      比玩家高/矮一截，3× 档下肉眼看得见。
   ⚠️ 工厂返回的是**带缓存**的取图函数（key = `dir + step`）。缓存只负责复用，
      不改画法；`buildChar(HH, PAL)` 传什么就画什么。 */
function npcSprites(pal) {
  const make = buildChar(6, pal), cache = Object.create(null);
  return function (dir, step) {
    const k = dir + step;
    if (!cache[k]) cache[k] = make(dir, step);
    return cache[k];
  };
}

/* 算法哥的配色：戴眼镜、穿黑衣。
   ⚠️ 四个角色的识别色必须两两拉开（3× 档下实测距离约 6 格）：
        玩家   = 蓝外套 #3f6ea8
        小北   = 红马甲 #c0392b（全图唯一的高饱和红）
        算法哥 = **冷黑** #2b3038 + 眼镜
        学霸姐 = **藕荷紫** #8b6cc0（见 71c，全图唯一紫）
      刻意避开大面积的暖黑：草地/沥青/米黄楼群上，冷调黑比纯黑更能立住剪影。
   ⚠️ `pack` 三色取衣服同色 = 他**不背包**（背向时 `torso(true)` 照旧画那块，
      取同色就等于什么都没加 —— 比给 buildChar 再加一个「不背包」钩子省一次改动）。 */
const ALG_PAL = {
  skin:  "#e9bb92", skinD: "#c4906a", skinL: "#f7d3ae",
  hair:  "#1b1a1c", hairL: "#33323a", hairD: "#0e0d10",   // 近黑短发（玩家是 #241d1a，比这暖）
  coat:  "#2b3038", coatD: "#171b21", coatL: "#454c58",   // 冷黑外套
  pant:  "#2a2e36", pantD: "#1a1d23", pantL: "#3d434e",
  shoe:  "#1a1c21", shoeL: "#33373f",
  pack:  "#2b3038", packD: "#171b21", packL: "#454c58",
  glasses: "#0f1114"                                        // ← 开 50_char.js 的眼镜钩子
};
const alguySprite = npcSprites(ALG_PAL);

/* --- 7.5.2 房间表 ------------------------------------------------------
   `defRoom(r)` 把 `bld`（楼名）翻成 `rect`（`zoneRect` 换算的判定矩形）。
   ⚠️ 一律**用 `zoneRect` 换算，别手打像素数** —— 那个式子与全项目其他落位同源，
      楼的位置一挪，这里跟着走。
   ⚠️ 每间房的 `solid` 都是**本段私有的碰撞表**，一条都不许进全局 `solids`
      —— 那是全校园散射种子的地雷（60 段 §6.6），动了全校园重掷。 */
const ROOMS = Object.create(null);
function defRoom(r) {
  const e = CAMPUS.find(x => x[0] === r.bld) || null;
  r.rect = e ? zoneRect(e) : null;
  ROOMS[r.key] = r;
  return r;
}

/* --- 7.5.3 计算机中心的位置与门口判定 --------------------------------- */
/* 坐标来自 `20_ground.js:96` 的 `["计算机中心","bld",3.1125,2.5688,1.1792,0.4854]`（英寸）。 */
const CTR_ENTRY = CAMPUS.find(e => e[0] === "计算机中心") || null;
const CTR_RECT  = CTR_ENTRY ? zoneRect(CTR_ENTRY) : null;

/* --- 7.5.4 DOM（都在 00_head.html 里，摆在脚本标签之前）--------------- */
const ctrCv       = document.getElementById("ctrCv");
const ctrHud      = document.getElementById("ctrHud");
const ctrHudName  = document.getElementById("ctrHudName");
const ctrHudSub   = document.getElementById("ctrHudSub");
const ctrHudHint  = document.getElementById("ctrHudHint");
const ctrTipEl    = document.getElementById("ctrTip");
const ctrP        = document.getElementById("ctrP");
const ctrF        = document.getElementById("ctrF");
const hudCtr      = document.getElementById("hudctr");
const hudUser     = document.getElementById("huduser");
const loginEl     = document.getElementById("login");
const lgU         = document.getElementById("lgU");
const lgP         = document.getElementById("lgP");
const lgMsg       = document.getElementById("lgMsg");
const lgGo        = document.getElementById("lgGo");
const lgOut       = document.getElementById("lgOut");
const ctrCtx      = ctrCv ? ctrCv.getContext("2d") : null;

/* --- 7.5.5 室内几何：一张 720×450 的逻辑画布 ---------------------------
   全部坐标都是**逻辑像素**，绘制时整体乘一个**整数**倍率居中铺开
   （整数倍 + image-rendering:pixelated ⇒ 像素不糊）。
   ⚠️ 这几个常量是**两间房共用**的：画布尺寸 / 墙厚 / 玩家碰撞半宽 / 身体高。
      房间之间只有"家具摆在哪"不同，画布本身一样大 —— 换房不用重量尺寸。 */
const CTR_W = 720, CTR_H = 450;
const CTR_WALL = 14;
const CTR_R = 7, CTR_H2 = 22;              // 玩家碰撞半宽 / 身体高（脚点往上算）
const CTR_SPEED = 155;                     // 逻辑像素/秒
const CTR_STRIDE = 40;                     // 走多少逻辑像素换一个步态相位

/* --- 7.5.6 计算机中心 · 房内布局 --------------------------------------
   碰撞盒 [x, y, w, h]。⚠️ 一条都不许进 `solids`。 */
const CTR_SOLID = [
  [0, 0, CTR_W, CTR_WALL],                                   // 上墙
  [0, CTR_WALL, CTR_WALL, CTR_H],                            // 左墙
  [CTR_W - CTR_WALL, CTR_WALL, CTR_WALL, CTR_H],             // 右墙
  [0, CTR_H - CTR_WALL, CTR_W, CTR_WALL],                    // 下墙
  [170, CTR_WALL, 380, 46],                                  // 黑板
  [250, 60, 220, 30],                                        // 讲台
];
/* 三排电脑桌 × 四列。⚠️ 排/列的间隙就是仅有的通路，改一个数要顺手核算走道宽度：
   半宽 7 ⇒ 走道至少要 14px 才过得去，现在最窄一条 35px。 */
const CTR_DESK_C = [50, 195, 340, 485];    // 桌左沿
const CTR_DESK_R = [180, 260, 340];        // 桌上沿
const CTR_DESK_W = 110, CTR_DESK_H = 52;
for (const ry of CTR_DESK_R) for (const cx of CTR_DESK_C) CTR_SOLID.push([cx, ry, CTR_DESK_W, CTR_DESK_H]);

const CTR_SPAWN = { x: 360, y: 430 };
/* ⚠️ 算法哥这个对象**是活的**：`dir` 每帧被 `ctrUpdate` 改写（他会转头看你）。
   下面 `ROOMS.center.npc` 直接引用它，所以名字 `CTR_ALG` 仍然是唯一的真相源
   （`_centerprobe.py` 的 C8 也认这个名字）。 */
const CTR_ALG = {
  name: "算法哥", x: 180, y: 150, dir: "down", step: IDLE_BASE,
  talkR: 74, spr: alguySprite,
  ringCol: "rgba(127,214,200,0.75)",
  talkTip: "按 C 和算法哥说话"
};

/* --- 7.5.7 画法：每间房给四段（floor / walls / decor / door）---------- */
/* 一次性铺的地板砖缝：不进 solids，纯装饰 */
function ctrFloor(g) {
  g.fillStyle = "#40464d"; g.fillRect(0, 0, CTR_W, CTR_H);
  g.fillStyle = "#373c42";
  for (let x = 0; x < CTR_W; x += 32) g.fillRect(x, 0, 1, CTR_H);
  for (let y = 0; y < CTR_H; y += 32) g.fillRect(0, y, CTR_W, 1);
}
function ctrWalls(g) {
  /* 天花板那圈灯先铺一层光晕（让房间"亮着"，不然黑衣算法哥会糊进暗墙里） */
  g.fillStyle = "rgba(232,228,210,0.055)";
  g.fillRect(CTR_WALL, CTR_WALL, CTR_W - CTR_WALL * 2, 210);
  g.fillStyle = "#2b3038";
  g.fillRect(0, 0, CTR_W, CTR_WALL); g.fillRect(0, CTR_H - CTR_WALL, CTR_W, CTR_WALL);
  g.fillRect(0, 0, CTR_WALL, CTR_H); g.fillRect(CTR_W - CTR_WALL, 0, CTR_WALL, CTR_H);
  g.fillStyle = "#4a515a";
  g.fillRect(0, CTR_WALL - 2, CTR_W, 2); g.fillRect(0, CTR_H - CTR_WALL, CTR_W, 2);
  g.fillRect(CTR_WALL - 2, 0, 2, CTR_H); g.fillRect(CTR_W - CTR_WALL, 0, 2, CTR_H);
  /* 日光灯：两根，挂在光晕里 */
  g.fillStyle = "#e8e4d2";
  g.fillRect(110, 26, 190, 7); g.fillRect(420, 26, 190, 7);
  g.fillStyle = "rgba(232,228,210,0.30)";
  g.fillRect(104, 20, 202, 19); g.fillRect(414, 20, 202, 19);
}
function ctrBoard(g) {
  g.fillStyle = "#6b5a3e"; g.fillRect(170, CTR_WALL, 380, 46);      // 木框
  g.fillStyle = "#1e2a24"; g.fillRect(174, CTR_WALL + 4, 372, 38);  // 黑板面
  g.fillStyle = "#8f9a90";                                          // 粉笔字（三条横杠，别写字）
  g.fillRect(196, CTR_WALL + 13, 120, 2);
  g.fillRect(196, CTR_WALL + 22, 200, 2);
  g.fillRect(196, CTR_WALL + 31,  86, 2);
  g.fillStyle = "#4a4034"; g.fillRect(250, 60, 220, 30);            // 讲台
  g.fillStyle = "#5a4d3e"; g.fillRect(250, 60, 220, 4);
}
function ctrDesk(g, x, y) {
  g.fillStyle = "#5a4a3c"; g.fillRect(x, y, CTR_DESK_W, CTR_DESK_H);           // 木桌面
  g.fillStyle = "#6b5847"; g.fillRect(x, y, CTR_DESK_W, 4);
  g.fillStyle = "#3a4048"; g.fillRect(x, y + CTR_DESK_H - 6, CTR_DESK_W, 6);   // 桌下暗部
  /* 显示器：黑框 + **发光的屏幕** —— 地图 §5 那份美术口径里，"暗房间里一排发光方块"
     就是这间房最重要的识别特征，所以屏幕是这间房唯一的高饱和冷光。 */
  for (let i = 0; i < 2; i++) {
    const sx = x + 10 + i * 52;
    g.fillStyle = "#1a1d22"; g.fillRect(sx, y - 30, 44, 32);
    g.fillStyle = i ? "#5fa8a0" : "#7fd6c8"; g.fillRect(sx + 3, y - 27, 38, 24);
    g.fillStyle = "rgba(255,255,255,0.22)"; g.fillRect(sx + 3, y - 27, 38, 3);
  }
  g.fillStyle = "#33383f"; g.fillRect(x + 6, y + CTR_DESK_H - 2, 26, 14);       // 椅子
  g.fillStyle = "#3e444c"; g.fillRect(x + 6, y + CTR_DESK_H - 2, 26, 3);
}
function ctrDecor(g) {
  ctrBoard(g);
  for (const ry of CTR_DESK_R) for (const cx of CTR_DESK_C) ctrDesk(g, cx, ry);
}
function ctrDoor(g) {
  g.fillStyle = "#5a4632"; g.fillRect(300, CTR_H - CTR_WALL - 34, 120, 34);     // 门扇（在墙内侧）
  g.fillStyle = "#6d563d"; g.fillRect(300, CTR_H - CTR_WALL - 34, 120, 3);
  g.fillStyle = "#c9a54e"; g.fillRect(408, CTR_H - CTR_WALL - 18, 5, 5);        // 把手
}

/* ⭐ 计算机中心登记进房间表。之后引擎只认 `ROOMS`，本段对它没有特殊照顾。 */
defRoom({
  key: "center",
  bld: "计算机中心",
  /* 判定圈＝建筑矩形外扩 90px。⚠️ 用「外扩一圈」而不是「门下一小块」：
     玩家不一定找得到门在哪，绕着楼走总会撞见提示。嫌太灵敏就改这一个数。 */
  pad: 90,
  name: "计算机中心", sub: "算法哥的机房",
  hint: "← → / A D 左右移动　↑ ↓ / W S 前后移动<br>走到算法哥身边按 <b>C</b> 找他说话　·　按 <b>B</b> 出门回地图",
  enterTip: "按 F 进入计算机中心",
  floor: ctrFloor, walls: ctrWalls, decor: ctrDecor, door: ctrDoor,
  solid: CTR_SOLID,
  spawn: CTR_SPAWN,
  npc: CTR_ALG,
  /* ⚠️ **必须是 `/agent`，不能是 `/`** —— 这里栽过一次，记下来：
     `App.vue` 全站只有两个东西 —— `<router-view/>` 和 `<AgentWatch/>`；而
     `AgentWatch.visible` 里有一条 `window.self === window.top`，意思是**被人用
     iframe 嵌进来时，算法哥那个悬浮头像自动隐身**（平台的作者是故意的：被嵌走时
     让宿主页面自己给入口）。于是打开 `/` ⇒ 抽屉里是一个**没有任何算法哥入口**的
     平台首页 —— 用户按 C 是奔着"和算法哥对话"来的，结果对不上，还以为自己没登录。
     `/agent` 是平台自己写的**算法哥整页**（`router/index.js` 注释：「算法哥：登录后
     的入口，题目、题单、排名都从这里进」），页内自带「题库」和「返回地图」两个口子，
     进去之后整个平台照样逛得到。
     ⚠️ 相对路径 = 同源 = `http://localhost:3000/agent`。**绝不许写成绝对地址**。 */
  app: "/agent",
  probe: "/api/agent/status",
  /* ⭐⭐ 第四十五轮：**开门前先验票**（见 `ctrOpenPlatform` 与 `campusEnsure`）。
     ⚠️ 写成**函数**而不是直接引用 `campusEnsure`：就为了探针能**按名字**替换它
        造负对照（`_auntprobe.py` 对阿姨那一家就是这么干的）。 */
  ensure: function () { return campusEnsure(); },
  coldTip: "刷题平台没在跑 —— 正在叫启动器（浏览器会问一次「是否打开」，点「打开」）…"
});

/* --- 7.5.8 状态 ------------------------------------------------------- */
const CENTER = {
  active: false,        // 在某个房间里
  plat:   false,        // 平台的 iframe 铺在上面
  room:   null,         // 当前房间（`ROOMS` 里那个对象）
  x: CTR_SPAWN.x, y: CTR_SPAWN.y, dir: "up", step: IDLE_BASE,
  walk: 0, t: 0,
  nearNpc: false,
  tipT: 0,
  waiting: false,       // 正在等协议把服务拉起来
  xbg: "",              // 学霸姐那边的登录结果："" / "ok" / "skip" / "down"
  ld:  "",              // 老丁（保卫处）那边的登录结果：同上
  cmr: "",              // 食堂阿姨那边的登录结果：同上
  campus: ""            // 算法哥（刷题平台 8081）那边的登录结果：同上
};
const CKEYS = Object.create(null);
const CTR_MOVE = { a: 1, d: 1, w: 1, s: 1,
                   arrowleft: 1, arrowright: 1, arrowup: 1, arrowdown: 1 };
const PCTR_START = "pixelcampus://start";              // 启动器注册的自定义协议

/* --- 7.5.9 判定：靠不靠近某间房 / 走进去了没有 ------------------------ */
function roomNear(R) {
  if (!R || !R.rect) return false;
  /* ⚠️ `player` 是主循环段（本段之后）的 `const` —— 运行时读没问题，加载期读会撞 TDZ。
       本函数只被 rAF / 事件调用，那时早已初始化。 */
  const p = player;
  if (!p) return false;
  const r = R.rect;
  return p.x > r.x - R.pad && p.x < r.x + r.w + R.pad
      && p.y > r.y - R.pad && p.y < r.y + r.h + R.pad;
}
/* 返回玩家当前靠近的房间；一圈都不沾则 null。
   ⚠️ 两间房的判定圈实测相隔 1700+ px（x 方向），不会同时命中。 */
function roomAt() {
  for (const k in ROOMS) if (roomNear(ROOMS[k])) return ROOMS[k];
  return null;
}
function roomFree(R, x, y) {
  const L = x - CTR_R, Rr = x + CTR_R, T = y - CTR_H2, B = y;
  if (L < CTR_WALL || Rr > CTR_W - CTR_WALL || T < CTR_WALL || B > CTR_H - CTR_WALL) return false;
  for (const s of R.solid)
    if (Rr > s[0] && L < s[0] + s[2] && B > s[1] && T < s[1] + s[3]) return false;
  return true;
}

/* --- 7.5.10 量尺寸 / 画 ------------------------------------------------ */
function ctrResize() {
  if (!ctrCv) return;
  ctrCv.width  = Math.max(320, window.innerWidth  || 320);
  ctrCv.height = Math.max(240, window.innerHeight || 240);
}
function ctrZoom() {
  if (!ctrCv) return 1;
  return Math.max(1, Math.min(Math.floor(ctrCv.width / CTR_W), Math.floor(ctrCv.height / CTR_H)));
}
function ctrDrawChar(g, spr, x, y) {
  g.drawImage(spr, Math.round(x) - CH_AX, Math.round(y) - CH_AY);
}
function ctrDraw() {
  if (!ctrCtx || !ctrCv) return;
  const R = CENTER.room;
  if (!R) return;
  const Z = ctrZoom();
  const ox = ((ctrCv.width - CTR_W * Z) / 2) | 0, oy = ((ctrCv.height - CTR_H * Z) / 2) | 0;
  const g = ctrCtx;
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.fillStyle = "#0b0d11"; g.fillRect(0, 0, ctrCv.width, ctrCv.height);
  g.setTransform(Z, 0, 0, Z, ox, oy);
  g.imageSmoothingEnabled = false;

  R.floor(g); R.walls(g); R.decor(g); R.door(g);

  /* ⚠️ 两个人按脚点 y 排序后画 —— 与主循环 `drawList` 同一条规矩，
       擦身而过时的前后遮挡才正确。 */
  const n = R.npc;
  const who = [
    { y: n.y,      f: () => ctrDrawChar(g, n.spr(n.dir, n.step), n.x, n.y) },
    { y: CENTER.y, f: () => ctrDrawChar(g, charSprite(CENTER.dir, CENTER.step), CENTER.x, CENTER.y) }
  ].sort((a, b) => a.y - b.y);
  for (const o of who) o.f();

  /* NPC 身边的交互光圈：走近了才亮，是"可以按 C 了"的第二重提示（第一重是底部那行字） */
  if (CENTER.nearNpc) {
    g.strokeStyle = n.ringCol; g.lineWidth = 2;
    g.beginPath(); g.ellipse(n.x, n.y - 1, 24, 10, 0, 0, Math.PI * 2); g.stroke();
  }
}

/* --- 7.5.11 每帧：走动 + 朝向 + 提示 ---------------------------------- */
function ctrUpdate(dt) {
  const R = CENTER.room;
  if (!R) return;
  if (CENTER.plat) return;                       // 平台铺着的时候房间冻住
  CENTER.t += dt;
  /* ⚠️ 等启动器的这段时间，提示条归 `ctrColdStart` 自己管 —— 不让这里的倒计时
     把它收走。不收的话"正在叫启动器…"会在 2 秒后消失，而用户还什么都没看见。 */
  if (!CENTER.waiting && CENTER.tipT > 0) {
    CENTER.tipT -= dt;
    if (CENTER.tipT <= 0 && ctrTipEl) ctrTipEl.hidden = true;
  }

  let dx = 0, dy = 0;
  if (CKEYS["a"] || CKEYS["arrowleft"])  dx -= 1;
  if (CKEYS["d"] || CKEYS["arrowright"]) dx += 1;
  if (CKEYS["w"] || CKEYS["arrowup"])    dy -= 1;
  if (CKEYS["s"] || CKEYS["arrowdown"])  dy += 1;
  const moving = !!(dx || dy);
  if (moving) {
    const L = Math.hypot(dx, dy) || 1;
    dx /= L; dy /= L;
    const nx = CENTER.x + dx * CTR_SPEED * dt, ny = CENTER.y + dy * CTR_SPEED * dt;
    /* ⚠️ 两轴分开判：斜着撞墙时会顺着墙滑，而不是整个卡死（地图主循环同款做法）。
       ⚠️ 碰撞表是**当前房间**的 —— 引擎泛化后这里最容易出的错就是还读着计算机中心那张。 */
    if (roomFree(R, nx, CENTER.y)) CENTER.x = nx;
    if (roomFree(R, CENTER.x, ny)) CENTER.y = ny;
    if (Math.abs(dx) > Math.abs(dy)) CENTER.dir = dx < 0 ? "left" : "right";
    else                             CENTER.dir = dy < 0 ? "up" : "down";
    CENTER.walk += CTR_SPEED * dt;
    CENTER.step = Math.floor(CENTER.walk / CTR_STRIDE) % WALK_FRAMES;
  } else {
    /* 待机呼吸：与地图上的角色同一张相位表、同一个 IDLE_HZ，站姿节拍一致 */
    CENTER.step = IDLE_BASE + (Math.floor(CENTER.t * IDLE_HZ * 2) % IDLE_FRAMES);
  }

  /* NPC：站着不动，但**会转头看你** —— 走近时他面向你，是"他注意到你了"的无声提示 */
  const n = R.npc;
  const ax = CENTER.x - n.x, ay = CENTER.y - n.y;
  if (Math.abs(ax) > Math.abs(ay)) n.dir = ax < 0 ? "left" : "right";
  else                             n.dir = ay < 0 ? "up" : "down";
  CENTER.nearNpc = Math.hypot(ax, ay) < n.talkR;

  if (!ctrTipEl) return;
  if (CENTER.waiting) return;                    // 等协议那段时间的提示由它自己管
  if (CENTER.nearNpc) ctrTipMsg(n.talkTip, 0.35);
  else if (CENTER.tipT <= 0) ctrTipEl.hidden = true;
}
function ctrTipMsg(t, sec) {
  if (!ctrTipEl) return;
  ctrTipEl.textContent = t;
  ctrTipEl.hidden = false;
  CENTER.tipT = sec || 2;
}

let _ctrRaf = 0, _ctrLast = 0;
function ctrLoop(now) {
  _ctrRaf = 0;
  if (!CENTER.active) return;
  const dt = Math.max(0, Math.min(0.05, (now - _ctrLast) / 1000));
  _ctrLast = now;
  ctrUpdate(dt);
  if (!CENTER.plat) ctrDraw();
  _ctrRaf = requestAnimationFrame(ctrLoop);
}

/* --- 7.5.12 进出 ------------------------------------------------------ */
function roomEnter(R) {
  if (CENTER.active || !R) return;
  CENTER.room = R;
  CENTER.active = true;
  CENTER.x = R.spawn.x; CENTER.y = R.spawn.y;
  CENTER.dir = "up"; CENTER.step = IDLE_BASE;
  CENTER.walk = 0; CENTER.t = 0; CENTER.tipT = 0; CENTER.nearNpc = false;
  for (const k in CKEYS) CKEYS[k] = 0;
  /* ⚠️ 必须清主循环那张 `keys` 表：玩家可能是**边走边按 F** 进来的，
       不清的话那一下的移动惯性会留在表里，你在房间里逛的时候地图上的人还在走。
       （进了房间以后所有移动键都被本段吞掉，所以清这一次就够。） */
  for (const k in keys) keys[k] = 0;
  if (hudCtr) { hudCtr.textContent = ""; _hudctrLast = ""; }
  if (ctrCv) ctrCv.hidden = false;
  if (ctrHud) {
    ctrHud.hidden = false;
    /* ⚠️ 三个格子由**房间对象**填，不再硬编码在 HTML 里 —— 两间房共用一块 HUD，
       最容易出的错就是"人在逸夫楼、提示却说计算机中心"。 */
    if (ctrHudName) ctrHudName.textContent = R.name;
    if (ctrHudSub)  ctrHudSub.textContent  = R.sub;
    /* ⚠️ `hint` 是我们自己写死的常量（含 `<b>C</b>` 这类标记），不是用户输入。
       比一下再写：同一个字符串赋值也会产生一次 DOM 变更 + 样式重算。 */
    if (ctrHudHint && ctrHudHint.innerHTML !== R.hint) ctrHudHint.innerHTML = R.hint;
  }
  if (ctrTipEl) ctrTipEl.hidden = true;
  document.body.classList.add("ctr-on");
  ctrResize();
  _ctrLast = performance.now();
  if (!_ctrRaf) _ctrRaf = requestAnimationFrame(ctrLoop);
}
function roomLeave() {
  CENTER.active = false;
  if (CENTER.plat) ctrClosePlatform();
  if (_ctrRaf) { cancelAnimationFrame(_ctrRaf); _ctrRaf = 0; }
  for (const k in CKEYS) CKEYS[k] = 0;
  for (const k in keys) keys[k] = 0;
  if (ctrCv) ctrCv.hidden = true;
  if (ctrHud) ctrHud.hidden = true;
  if (ctrTipEl) ctrTipEl.hidden = true;
  document.body.classList.remove("ctr-on");
  /* ⚠️ 玩家在地图上的坐标**一个字不动** —— 他本来就站在进门前那个位置，
       出门就该回到原地，不许瞬移（用户第三十八轮在向导那边为同类问题报过 bug）。 */
}

/* --- 7.5.13 房间里的 App：同源 iframe --------------------------------- */
function ctrProbe(R) {
  /* 1.5 秒探一下那个服务在不在。⚠️ 不用 AbortSignal.timeout（老浏览器没有），
     自己搭 AbortController —— 这个页面要在各种机器上双击打开，不能赌版本。 */
  return new Promise(resolve => {
    let done = false;
    const fin = v => { if (!done) { done = true; resolve(v); } };
    try {
      const ac = new AbortController();
      const t = setTimeout(() => { try { ac.abort(); } catch (e) {} fin(false); }, 1500);
      fetch(R.probe, { signal: ac.signal })
        .then(r => { clearTimeout(t); fin(!!r && r.ok); })
        .catch(() => { clearTimeout(t); fin(false); });
    } catch (e) { fin(false); }
  });
}
function ctrOpenPlatform(R) {
  if (!ctrP) return;
  CENTER.plat = true;   // ⚠️ 仍然**同步**置位：移动键锁 / 连按两次 C 的并发保护都靠它
  if (ctrTipEl) ctrTipEl.hidden = true;
  ctrP.hidden = false;
  /* ⚠️⚠️ 必须**比较过再 set**：第四十轮这里写的是 `!ctrF.getAttribute("src")`
     （只在第一次打开时设），于是"从计算机中心出来、进逸夫楼按 C"打开的**仍是刷题平台**。
     比较的是 `R.app` —— 引擎泛化后这是唯一知道该开哪扇门的地方。
     ⚠️ `reuse` 必须在 set **之前**算出来（set 完就恒为 true 了），A5 那条踹醒判据要用它。 */
  const reuse = !!(ctrF && ctrF.getAttribute("src") === R.app);
  /* ⭐⭐ 第四十五轮：**开门前先验票**。四家的 `ensure`（见各自 `*Ensure`）回答"我登着吗"，
     没登着就拿凭据补登。闸门挂在**这唯一一个开门出口**上 ⇒ 四个调用点（含 `ctrColdStart`
     那条"服务刚起来"的路）自动都有闸门，谁也漏不掉。
     ⚠️ 第一次打开时 src 要**等闸门回来**才设 ⇒ 模块的首次 `/api/me` 必然已经带上会话
        （这正是 `cmrEnsure` 注释里那个"当面弹登录框"的闪的来源）。
     ⚠️ 闸门没成（`skip` / `down`）**照样设 src**，如实露出那家自己的登录框 —— 不装。 */
  let gate;
  try { gate = R.ensure ? R.ensure() : "ok"; } catch (e) { gate = "skip"; }
  Promise.resolve(gate).catch(() => "skip").then(st => {
    if (ctrF && ctrF.getAttribute("src") !== R.app) ctrF.setAttribute("src", R.app);
    ctrBindFrameEsc();
    if (reuse && st === "ok") ctrUnstickFrame(R);      // 见 A5
  });
}
function ctrClosePlatform() {
  if (ctrP) ctrP.hidden = true;
  CENTER.plat = false;
  CENTER.waiting = false;
  _ctrLast = performance.now();                        // 免得回来第一帧 dt 巨大
}
/* ⭐ 免登录与 Esc 退出**都靠这一条**：同源 ⇒ 父页拿得到 iframe 内部的 document。
   跨源时这里会抛 SecurityError（被 catch 吞掉），那才是真的做不到。 */
function ctrFrameBindEsc() {
  if (!ctrF) return;
  try {
    const d = ctrF.contentDocument;
    if (!d || d.__pxEscBound) return;
    d.__pxEscBound = 1;
    d.addEventListener("keydown", e => {
      if (e.key === "Escape") { ctrClosePlatform(); e.preventDefault(); e.stopPropagation(); }
    }, true);
  } catch (err) { /* 跨源：拿不到就算了，用户还能用鼠标点平台自己的返回 */ }
}
/* ⚠️⚠️ 第四十轮的写法是**每次打开抽屉都 `ctrF.addEventListener("load", bind)`**，
   而 `bind` 是当场新建的函数对象 ⇒ 打开 N 次就叠 N 条 load 监听（永不回收）。
   现在改成：`load` 监听在**装配区绑一次**（本段末尾），这里只负责"已经加载完了"的
   那种情况 —— 抽屉第二次打开时 src 没变、不会触发 load，得当场补一次。 */
function ctrBindFrameEsc() {
  if (!ctrF) return;
  try {
    if (ctrF.contentDocument && ctrF.contentDocument.readyState === "complete") ctrFrameBindEsc();
  } catch (e) {}
}
/* ⭐⭐ 第四十五轮：**踹醒停在登录页的抽屉**。
   动机：抽屉是"认门不重开"的 —— `ctrOpenPlatform` 只在 `src` 变了才重载
   （见上面那段注释，是**刻意**的：保住模块的内存态）。于是一旦那家**停在自己的登录页上**
   （算法哥 SPA 被 401 推到 `/login`、老丁/阿姨的登录卡露着），**再按 C 也纹丝不动**。
   ⚠️ 只在"闸门验票成功、且这一扇门本来就是开着的"时踹（判据见 `ctrOpenPlatform`），
      而且问的是**那家自己**（读它的 DOM / 地址），不猜。 */
function ctrFrameOnLogin(w) {
  try {
    if (!w || !w.document) return false;
    const d = w.document;
    /* ⚠️ 先看"纱幕"（模块侧那段 `html.*-embed`）：纱幕亮着 = 还在"正在进入…"，
       **不算**登录页。漏了这一条，会在模块启动的那一瞬把它误判成"停在登录页"
       又踹一脚 —— 自己把自己踹成死循环。 */
    const he = d.documentElement;
    if (he && he.classList &&
        (he.classList.contains("ld-embed") || he.classList.contains("aunt-embed"))) return false;
    /* 算法哥：SPA，停在 `/login` 路由上（`src` 属性还是 `/agent`，但**地址**已经变了） */
    if (String((w.location && w.location.pathname) || "") === "/login") return true;
    /* 老丁：`#login-view` 没被 `hidden` 收走就是露着 */
    const lv = d.getElementById && d.getElementById("login-view");
    if (lv && !lv.classList.contains("hidden")) return true;
    /* 阿姨：`#auth-screen` 的 `hidden` 属性 */
    const as = d.getElementById && d.getElementById("auth-screen");
    if (as && !as.hidden) return true;
    /* 学霸姐：`#gate` 的 `hidden` 类（她开机本来就是 `hidden`，正常看不到这颗） */
    const g = d.getElementById && d.getElementById("gate");
    if (g && !g.classList.contains("hidden")) return true;
    return false;
  } catch (e) { return false; }   // 跨源 / 文档还没就绪 ⇒ 一律当"不是"，静默跳过
}
function ctrUnstickFrame(R) {
  if (!ctrF) return;
  /* 3 秒内只踹一次：`replace` 之后文档要重新加载，而加载完的那一瞬可能又被判成登录页
     （模块自己那次 `/api/me` 还没回来）—— 没这道闸就会踹成循环。 */
  const now = (typeof performance !== "undefined" && performance.now) ? performance.now() : Date.now();
  if (ctrF.__pxUnstuckAt && now - ctrF.__pxUnstuckAt < 3000) return;
  let w = null;
  try { w = ctrF.contentWindow; } catch (e) {}
  if (!w || !ctrFrameOnLogin(w)) return;
  ctrF.__pxUnstuckAt = now;
  /* ⚠️⚠️ **绝不能用 `w.location.reload()`**：算法哥被 401 推到 `/login` 之后，
     iframe 的**地址**就是 `/login`（`src` 属性却还是 `/agent`）⇒ reload 只会把登录页
     再刷一遍，看着像"按了没反应"。必须**换地址回正门**。 */
  try { w.location.replace(R.app); } catch (e) {}
}
function ctrTalk() {
  const R = CENTER.room;
  if (!R) return;
  if (!CENTER.nearNpc) { ctrTipMsg("先走到" + R.npc.name + "身边再按 C。", 2); return; }
  ctrProbe(R).then(ok => {
    if (ok) ctrOpenPlatform(R);
    else ctrColdStart(R);
  });
}
/* 服务没跑 ⇒ 请浏览器把启动器叫起来。⚠️ 网页**无法**自己执行本地程序（浏览器铁律），
   自定义协议是唯一合法的"网页拉起本地程序"通道；浏览器会弹一次「是否打开」。
   ⚠️ 正常路径下**根本走不到这里** —— 地图既然是从启动器打开的，服务必然在跑。 */
function ctrColdStart(R) {
  CENTER.waiting = true;
  ctrTipMsg(R.coldTip, 0);
  try { window.location.href = PCTR_START; } catch (e) {}
  let n = 0;
  const timer = setInterval(() => {
    n++;
    /* ⚠️ `waiting` 也一起判：用户可能在这段时间按 B 出屋、或者 App 已经被别的路径打开，
       不判的话这个定时器会在几十秒后**凭空把 App 再弹一次**。 */
    if (!CENTER.active || !CENTER.waiting) { clearInterval(timer); CENTER.waiting = false; return; }
    ctrProbe(R).then(ok => {
      if (ok) {
        clearInterval(timer);
        CENTER.waiting = false;
        if (ctrTipEl) ctrTipEl.hidden = true;
        ctrOpenPlatform(R);
      } else if (n >= 60) {
        clearInterval(timer);
        CENTER.waiting = false;
        ctrTipMsg("还没起来。手动双击一下「启动像素校园.bat」吧。", 8);
      }
    });
  }, 1500);
}

/* --- 7.5.14 登录门 -----------------------------------------------------
   作用只有一个：**把 token 种进 localStorage**。刷题平台跑在同一个源上，
   iframe 一加载，它的 Pinia store 从 localStorage 读到 token ⇒ 直接就是登录态。
   ⚠️ 这不是安全机制 —— 两个预设账号就明写在按钮上，它只是一道"仪式"。
   ⭐ 第四十一轮起这里还要**顺手把学霸姐那边也登一次**（同一套账号密码，
      登录一次进两边）—— 见 `xbgSync`。 */
const CTR_USERS = [
  { u: "admin", p: "admin123", n: "管理员" },
  { u: "user",  p: "user123",  n: "刷题者" }
];

/* ⭐⭐ 第四十一轮：一次登录进两边。
   学霸姐（xueba-ge，8010）走 Vite 的 `/xbg` 代理，与地图**同源**，
   所以她那边也认这一对账号密码。三步：

     ① `POST /xbg/api/login`     有号就登
     ② `POST /xbg/api/register`  401（还没这个号）⇒ 用**同一个密码**开一个

   ⚠️⚠️ **这个顺序本身就是安全设计**：`xbgSync` 只在"平台那一步
      （刷题平台自己的登录接口）已经返回 200 之后"才被调用 ⇒ 绝不会为没验证过的凭据开号。
      这也是**不预置账号**的理由 —— 再写一份 seed 就是第二处真相，密码一漂移没人知道。
   ⚠️ 三步**全都不阻塞进地图**：8010 没起来、register 冲突、凭据不满足她那边
      （nick≥2 或 pw≥4）……任何一样失败都只是 HUD 尾巴上多一句提示，
      地图照常玩；进逸夫楼时 iframe 会显示学霸姐**自己的**登录框（她内建了）。

   ⚠️⚠️⚠️ **`xbgSync` 有两个入口，缺一不可**。第一版只留了 ①，用户当场撞上：
     ① `doLogin` —— 刚在登录门上敲完账号密码，凭据就在手里。
     ② `xbgBootSync` —— 见它自己的注释（登录门**会自己藏起来**）。 */
const XBG_LOGIN = "/xbg/api/login", XBG_REG = "/xbg/api/register";
function xbgSave(t) { try { localStorage.setItem("xbg_token", t); } catch (e) {} }
function xbgPost(url, u, p) {
  return fetch(url, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nick: u, password: p })
  }).then(r => r.json().then(j => ({ status: r.status, j: j })));
}
function xbgSync(u, p, left) {
  return xbgPost(XBG_LOGIN, u, p).then(res => {
    if (res.j && res.j.token) { xbgSave(res.j.token); return "ok"; }
    if (res.status === 401) {                       // 还没这个号 ⇒ 用同一个密码开一个
      return xbgPost(XBG_REG, u, p).then(r2 => {
        if (r2.j && r2.j.token) { xbgSave(r2.j.token); return "ok"; }
        return "skip";                              // 409（同昵称不同密码）/ 被拒
      }).catch(() => "skip");
    }
    return "skip";
  }).catch(() => {
    /* 8010 还在起来 —— 她要读 85 MB 向量，bind 完还要十几秒。
       退避重试 4 次（每次 3 秒，共约 12 秒），盖住启动器那条 40 秒等待的后半段。 */
    if (left > 0) return new Promise(r => setTimeout(r, 3000)).then(() => xbgSync(u, p, left - 1));
    return "down";
  });
}

/* ⚠️⚠️ 第四十一轮补丁（用户实测反馈）：**登录门会自己藏起来**。
     `loginGate()` 见到 `localStorage.token` 就直接 `loginEl.hidden = true; return;`
     （原话「24 小时内再来，直接进」）⇒ **`doLogin` 根本不会被调用**，
     `xbgSync` 也就永远不跑。而地图这个 token 是长期的，用户上一次登录可能是几天前 ——
     那时候还没有学霸姐。于是：人一路走进逸夫楼按 C，iframe 里的学霸姐读不到 `xbg_token`，
     弹出**她自己的**登录框。用户的原话就是「为啥给学霸姐对话需要我自己再登录」。

     ⇒ 登录门被跳过时**补一次同步**。补同步要密码，所以把凭据记在 `xbg_cred` 里。

     ⚠️ 是明文。之所以能接受：这道门**本来就不是安全机制** —— 两个预设账号
        （`admin/admin123`、`user/user123`）明写在 `#lgQuick` 按钮上，它只解决
        「进地图前得按一下」，不解决「防谁」。真正该当密钥看的两样
        （平台 JWT、学霸姐的 token）都不是这个。
     ⚠️ 用 `encodeURIComponent` 而**不是 `btoa`**：`btoa` 碰中文昵称直接抛异常；
        更要紧的是它**看起来像加密其实不是**，比明文更容易让后来人误判成"已保护"。 */
const XBG_CRED = "xbg_cred";
function xbgCredSave(u, p) {
  try { localStorage.setItem(XBG_CRED, encodeURIComponent(u) + "\n" + encodeURIComponent(p)); } catch (e) {}
}
function xbgCredLoad() {
  try {
    const s = localStorage.getItem(XBG_CRED) || "", i = s.indexOf("\n");
    if (i < 0) return null;
    const u = decodeURIComponent(s.slice(0, i)), p = decodeURIComponent(s.slice(i + 1));
    return (u && p) ? { u: u, p: p } : null;
  } catch (e) { return null; }
}
function xbgBootSync() {
  let tok = "", xt = "";
  try { tok = localStorage.getItem("token") || ""; xt = localStorage.getItem("xbg_token") || ""; } catch (e) {}
  /* ① 没登平台 ⇒ 页面还停在登录门上，`doLogin` 自己会同步，这里不用管。
     ② 学霸姐那边已经有票 ⇒ 没什么可补的（这是"已登录过"的常态，走这条最省事）。 */
  if (!tok || xt) return;
  const c = xbgCredLoad();
  if (!c) return;         // 第四十一轮之前登的会话，没留凭据 ⇒ 无解，等下回走登录门
  /* ⚠️ **不预先置 `CENTER.xbg`**：置成任何值都会被 `hudUserTick` 当成"结果回来了"，
     补同步那十几秒里会在 HUD 上闪一句「学霸姐没同步上」—— 可它还没失败呢。空串不显示尾巴。 */
  xbgSync(c.u, c.p, 6).then(st => { CENTER.xbg = st; hudUserTick(); });
}
/* ⭐ 学霸姐的闸门（第四十五轮）。同一个坑：`xbgBootSync` 见 `xbg_token` 在就早退，
   票死了也不管。`/xbg/api/me` 就是她 `web/app.js` 开机用来恢复会话的那个接口，
   带 `Authorization: Bearer`（见那边 `api()` 的写法）；401 就拿 `xbgCredLoad()` 重登。
   ⚠️ 同样**不预先置** `CENTER.xbg`。 */
let XBG_READY = null;
function xbgEnsure() {
  if (XBG_READY) return XBG_READY;
  XBG_READY = (function () {
    let t = "";
    try { t = localStorage.getItem("xbg_token") || ""; } catch (e) {}
    if (!t) { const c = xbgCredLoad(); return Promise.resolve(c ? xbgSync(c.u, c.p, 1) : "skip"); }
    return fetch("/xbg/api/me", { headers: { "Authorization": "Bearer " + t } })
      .then(r => {
        if (r.ok) return "ok";
        const c = xbgCredLoad();
        return c ? xbgSync(c.u, c.p, 1) : "skip";
      })
      .catch(() => "down");
  })().then(st => { CENTER.xbg = st; hudUserTick(); XBG_READY = null; return st; });
  return XBG_READY;
}

/* ⭐⭐ 第四十三轮：老丁（laoding，8000）也进同一套「一次登录进三家」。
   他走 Vite 的 `/ld` 代理，与地图**同源**，账号口径也同一套
   （`admin/admin123`、`user/user123` 早已种进他的 `server/users.db`）⇒ 整套结构
   与上面 `xbgSync` **逐字同构**，只有两处不同：

     ① 请求体字段叫 `nickname`（不是学霸姐的 `nick`）—— 见 `laoding/server/app.py`
        的 `AuthBody`。发错字段服务端直接 422，登录永远不成，且**报错在浏览器控制台
        里看不出来**（`r.json()` 拿到的是 `{detail:[...]}`，没有 `token`，静默走 skip）。
     ② 票**不写进本模块的存储**，而是种一个裸 token `ld_token` —— 理由见下。

   ⚠️⚠️ `laoding/index.html` 恢复会话读的是**它自己命名空间下的一坨 JSON**
      （`guard_v?dataVersion_auth`），跟学霸姐读裸 `xbg_token` 不一样。地图**不去伪造**
      别人家的存储键：`Store.key()` 里那个 `dataVersion` 是 laoding 的内部版本号，
      哪天它一升，地图拼出来的键就静默失效，而且这种坏法**没有任何报错**。
      ⇒ 改成双方各让一步：地图只种一个**中立的** `ld_token`，由老丁自己在前端认领
      （见 `laoding/index.html` 启动段那条 fallback）。服务端一个字都不用改 ——
      `/api/me` 本来就是校验 Bearer token 的接口。 */
const LD_LOGIN = "/ld/api/login", LD_REG = "/ld/api/register";
function ldSave(t) { try { localStorage.setItem("ld_token", t); } catch (e) {} }
function ldPost(url, u, p) {
  return fetch(url, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nickname: u, password: p })
  }).then(r => r.json().then(j => ({ status: r.status, j: j })));
}
function ldSync(u, p, left) {
  return ldPost(LD_LOGIN, u, p).then(res => {
    if (res.j && res.j.token) { ldSave(res.j.token); return "ok"; }
    if (res.status === 401) {                       // 没这个号 ⇒ 用同一个密码开一个
      return ldPost(LD_REG, u, p).then(r2 => {
        if (r2.j && r2.j.token) { ldSave(r2.j.token); return "ok"; }
        return "skip";                              // 409（同昵称不同密码）/ 400（密码 <6 位）
      }).catch(() => "skip");
    }
    return "skip";
  }).catch(() => {
    /* 8000 还没起来。他启动比学霸姐快得多（不读索引），但启动器那一步也可能整段跳过
       （laoding 目录缺了 / 20 秒没起来）⇒ 同样退避重试，别把一次抢跑当永久失败。 */
    if (left > 0) return new Promise(r => setTimeout(r, 3000)).then(() => ldSync(u, p, left - 1));
    return "down";
  });
}
/* 凭据：与 `XBG_CRED` **分开存**。两家服务互相独立，一方登不上不该污染另一方的凭据；
   而且分开之后，只用过老丁、没用过学霸姐的会话也能各自补同步。 */
const LD_CRED = "ld_cred";
function ldCredSave(u, p) {
  try { localStorage.setItem(LD_CRED, encodeURIComponent(u) + "\n" + encodeURIComponent(p)); } catch (e) {}
}
function ldCredLoad() {
  try {
    const s = localStorage.getItem(LD_CRED) || "", i = s.indexOf("\n");
    if (i < 0) return null;
    const u = decodeURIComponent(s.slice(0, i)), p = decodeURIComponent(s.slice(i + 1));
    return (u && p) ? { u: u, p: p } : null;
  } catch (e) { return null; }
}
/* ⭐ 第四十三轮补丁（**实测才暴露的洞**）：`ld_cred` 是**从本轮起**才开始记的。
   在本轮之前登录过的人，localStorage 里只有 `token`，`ld_cred` 是空的 ⇒
   `ldCredLoad()` 返回 null、补同步直接放弃 —— 他刷新页面按 C，**照样**看到老丁自己的登录框。
   而"已经登过的人"恰恰是绝大多数（登录门 24 小时内不再出现）。

   ⇒ 用登录门上**本来就明写着的**那对预设账号兜一次：`localStorage.user.username`
      命中 `CTR_USERS` 就用它那对密码。
   ⚠️ 这不是新增秘密 —— 那两对账号就印在 `#lgQuick` 的按钮上（见 `CTR_USERS` 上面那段
      "这不是安全机制"的注释）。命中不了就**原样放弃**、落回登录框，**绝不瞎猜密码**。 */
function ldPresetCred() {
  let uname = "";
  try {
    const u = JSON.parse(localStorage.getItem("user") || "null");
    uname = (u && (u.username || u.nickname)) || "";
  } catch (e) {}
  if (!uname) return null;
  for (const p of CTR_USERS) if (p.u === uname) return { u: p.u, p: p.p };
  return null;
}
/* ⭐ 第四十五轮抽出来：`ldBootSync` 与 `ldEnsure` 用的是**同一条**候选链。 */
function ldBestCred() { return ldCredLoad() || ldPresetCred(); }
/* ⭐ 老丁的闸门（第四十五轮）。⚠️ `ldBootSync` 见 `ld_token` 在就早退，**票死了也不管**
   —— 这条补的正是那个洞：问服务端"我这票还认吗"（`/ld/api/me` 就是老丁页面自己
   `init()` 用来恢复会话的那个接口）；不认就拿 `ldBestCred()` 重登一次。
   ⚠️ **不预先置** `CENTER.ld`（同 `ldBootSync` 的注释：置了会在结果回来前闪一句提示）。 */
let LD_READY = null;
function ldEnsure() {
  if (LD_READY) return LD_READY;
  LD_READY = (function () {
    let t = "";
    try { t = localStorage.getItem("ld_token") || ""; } catch (e) {}
    if (!t) { const c = ldBestCred(); return Promise.resolve(c ? ldSync(c.u, c.p, 1) : "skip"); }
    return fetch("/ld/api/me", { headers: { "Authorization": "Bearer " + t } })
      .then(r => {
        if (r.ok) return "ok";
        const c = ldBestCred();
        return c ? ldSync(c.u, c.p, 1) : "skip";
      })
      .catch(() => "down");
  })().then(st => { CENTER.ld = st; hudUserTick(); LD_READY = null; return st; });
  return LD_READY;
}
/* ⚠️ 与 `xbgBootSync` 同一个理由、同一个坑：登录门见 `localStorage.token` 就自己藏起来
   （"24 小时内再来，直接进"）⇒ `doLogin` 根本不会被调用。老用户（第四十三轮之前登的）
   手里有 `token` 却没有 `ld_token`，`ld_cred` 也没有 —— 他按 C 时抽屉里会弹老丁自己的登录框。
   这正是上一轮学霸姐栽过的那个跟头（用户原话「为啥给学霸姐对话需要我自己再登录」）。 */
function ldBootSync() {
  let tok = "", lt = "";
  try { tok = localStorage.getItem("token") || ""; lt = localStorage.getItem("ld_token") || ""; } catch (e) {}
  if (!tok || lt) return;   // 没登平台 ⇒ 登录门那条路会同步；他那边已经有票 ⇒ 无可补
  const c = ldBestCred();   // ⭐ 老会话没凭据时用预设账号兜底（见上）
  if (!c) return;           // 连预设都没有（自建账号）⇒ 无解，等下回走登录门
  /* ⚠️ 同样**不预先置 `CENTER.ld`**（见 `xbgBootSync` 里那段"闪一句没同步上"的解释）。 */
  ldSync(c.u, c.p, 6).then(st => { CENTER.ld = st; hudUserTick(); });
}

/* ⭐⭐ 第四十四轮：食堂阿姨（cmr，8020）也进「一次登录进四家」。
   她走 Vite 的 `/cmr` 代理，与地图**同源**，于是她签发的 HttpOnly 会话 cookie
   在 iframe 里天然被带上 —— **这就是「进食堂不用重复登录」的全部秘密**，
   不需要老丁那种「把票种进 localStorage 再由对方认领」的迂回（她也没有票可种）。

   与上面两家**三处**不同，每一处发错都是静默失败：

     ① 请求体字段叫 **`username`**（学霸姐是 `nick`、老丁是 `nickname`）——
        见 `aunt/server.py` 的 `Credentials`。发错服务端回 422，前端**一个字都不报**。
     ② 她**不回 token**：登录成功只有 `{id, username}` 加一个 `Set-Cookie`
        （`aunt/server.py` 的 `login` / `set_session`）⇒ **成功判据只能是
        `res.status === 200`**。照抄前两家的 `res.j.token` 会永远走 skip，
        而且坏得毫无痕迹（HUD 上挂一句「没同步上」，抽屉里弹她自己的登录框）。
     ③ **只登、绝不开号**：她的注册接口要密码 **≥8 位**（Pydantic `min_length=8`，
        连直接写库都绕不过），而本机库里**只有 `admin` 一个账号** —— 这是用户明确定下
        的口径。所以非 200 一律 skip，**不像老丁那样遇 401 就去 register**。
        （地图登录门上的 `user/user123` 只有 7 位 ⇒ 阿姨这一家必然 skip，
         按 C 时如实弹她自己的登录框。这是既定行为，不是 bug。） */
const CMR_LOGIN = "/cmr/api/login";
function cmrPost(url, u, p) {
  return fetch(url, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: u, password: p })
  }).then(r => r.json().then(j => ({ status: r.status, j: j })).catch(() => ({ status: r.status, j: {} })));
}
function cmrSync(u, p, left) {
  return cmrPost(CMR_LOGIN, u, p).then(res => {
    return res.status === 200 ? "ok" : "skip";      // ⚠️ 没有 token，只能看状态码（见上 ②）
  }).catch(() => {
    if (left > 0) return new Promise(r => setTimeout(r, 3000)).then(() => cmrSync(u, p, left - 1));
    return "down";
  });
}
/* 凭据：与 `XBG_CRED` / `LD_CRED` **分开存**（理由同老丁那段：一方登不上不该污染另一方）。 */
const CMR_CRED = "cmr_cred";
function cmrCredSave(u, p) {
  try { localStorage.setItem(CMR_CRED, encodeURIComponent(u) + "\n" + encodeURIComponent(p)); } catch (e) {}
}
function cmrCredLoad() {
  try {
    const s = localStorage.getItem(CMR_CRED) || "", i = s.indexOf("\n");
    if (i < 0) return null;
    const u = decodeURIComponent(s.slice(0, i)), p = decodeURIComponent(s.slice(i + 1));
    return (u && p) ? { u: u, p: p } : null;
  } catch (e) { return null; }
}
/* ⭐⭐ 第四十五轮改了口径（**用户拍板**）：**不再看当前是谁登录的，一律给 admin**。
   ⚠️ 第四十四轮那个写法（"只有当前用户就叫 admin 时才兜底"）是**够不着**的：
      用 `user` 登录地图时 `cmrCredLoad()` 非空（存的是 `user/user123`），
      `cmrEnsure` 拿它去撞一次 422 就收手，**永远轮不到 admin** —— 按 C 照样弹她自己的登录框。
   ⚠️ 本机库里她**只有 `admin` 一个账号**（注册要密码 ≥8 位，`user123` 只有 7 位进不来）
      ⇒ 想"进食堂不弹框"，唯一的路就是**静默用 admin**。这不是新增秘密：
      那对账号本来就明写在 `#lgQuick` 的按钮上。 */
function cmrPresetCred() {
  for (const p of CTR_USERS) if (p.u === "admin") return { u: p.u, p: p.p };
  return null;
}
/* ⭐ 「进抽屉前 cookie 已就绪」的闸门（给 80 段 `auntTalk` 用）。
   为什么需要它：`doLogin` 里那条 `cmrSync` 是**不 await** 的（谁都不许卡住进地图），
   于是刚在登录门敲完回车、立刻走到食堂按 C —— iframe 可能赶在 `Set-Cookie` 落盘之前
   加载，她的 `app.js` 开局 `GET /api/me` 拿 401 ⇒ **当面弹一个登录框**，
   而 cookie 随后才到齐，iframe 自己不会重试。等这几十毫秒就能整掉这个闪。
   ⚠️ 判据**不能**是"本地有没有票"：她根本没有票（HttpOnly cookie，JS 读不到），
      所以这里请服务端自己回答 —— `GET /api/me` 200 就是"已经免登录了"。 */
/* ⭐⭐ 第四十五轮：候选**逐个试**，第一个 200 收工。
   ⚠️ 不能写成 `cmrCredLoad() || cmrPresetCred()`（第四十四轮的写法）：用 `user` 登录时
      `cmrCredLoad()` 非空 ⇒ 只会拿 `user/user123` 撞一次 422 然后 skip，
      **永远轮不到 admin**。顺序＝"先照本人凭据试，再退到 admin"。 */
function cmrCandidates() {
  const out = [];
  for (const c of [campusBestCred(), cmrPresetCred()]) {
    if (c && c.u && c.p && !out.some(o => o.u === c.u && o.p === c.p)) out.push(c);
  }
  return out;
}
function cmrTryAll(list, i) {
  if (i >= list.length) return Promise.resolve("skip");
  /* ⚠️ 只有**第一家**带网络重试（`left: 2`）：真连不上时两家各等 6 秒，开抽屉要干等十几秒。 */
  return cmrSync(list[i].u, list[i].p, i === 0 ? 2 : 0).then(st => {
    if (st === "ok") return "ok";
    if (st === "down") return "down";           // 网都不通 ⇒ 再换账号也是白搭
    return cmrTryAll(list, i + 1);
  });
}
let CMR_READY = null;
function cmrEnsure() {
  if (CMR_READY) return CMR_READY;
  CMR_READY = fetch("/cmr/api/me").then(r => {
    if (r.ok) return "ok";                      // 已经登录（刷新后的常态走这条）
    if (r.status === 401) return cmrTryAll(cmrCandidates(), 0);
    return "skip";
  }).catch(() => cmrTryAll(cmrCandidates(), 0))
    .then(st => { CENTER.cmr = st; hudUserTick(); CMR_READY = null; return st; });
  return CMR_READY;
}
/* ⚠️ 与上面两家同一个理由、同一个坑：登录门见 `localStorage.token` 就自己藏起来
   （"24 小时内再来，直接进"）⇒ `doLogin` 根本不会被调用，`cmrCredSave` 也就没跑。 */
function cmrBootSync() {
  let tok = "";
  try { tok = localStorage.getItem("token") || ""; } catch (e) {}
  if (!tok) return;              // 没登平台 ⇒ 页面还停在登录门上，`doLogin` 那条路自己会同步
  if (CENTER.cmr === "ok") return;
  /* ⚠️ **不预先置 `CENTER.cmr`**（理由同 `xbgBootSync`：会让 HUD 在结果回来之前
     先闪一句「没同步上」）。走同一条 `cmrEnsure`：cookie 还在就什么都不做。 */
  cmrEnsure();
}

/* ⭐⭐ 第四十五轮：**算法哥（刷题平台 8081）也进同一套闸门**。
   为什么它比另外三家更急 —— 这三条连起来才是用户说的「明明我们事先登录过了」的真身：

    ① 登录门 `loginGate`（见下）**只看票在不在、不看票活不活**；
    ② 平台 JWT 寿命恰好 24 小时（`application.yml` 的 `expiration: 86400000`）；
    ③ ⚠️⚠️ 票一过期，平台后端回的是 **HTTP 200 + `{code:401}`**（见 `GlobalExceptionHandler`）
       ⇒ axios 走**成功**分支 ⇒ `utils/request.js` 调 `userStore.logout()` ⇒
       **把 `localStorage.token` 和 `localStorage.user` 从整个源上删掉**。
       ⇒ 一次过期访问 = 静默地把地图和所有模块**一起登出**，而登录门**不会再弹**
          （它只在页面加载时跑一次）。

   ⇒ 所以"按用户名去 `CTR_USERS` 里找回预设密码"这条兜底，到那一步已经没用了
      （`localStorage.user` 已经不在）⇒ 必须有一把**模块碰不到的**凭据。 */
const CAMPUS_CRED = "campus_cred";
function campusCredSave(u, p) {
  try { localStorage.setItem(CAMPUS_CRED, encodeURIComponent(u) + "\n" + encodeURIComponent(p)); } catch (e) {}
}
function campusCredLoad() {
  try {
    const s = localStorage.getItem(CAMPUS_CRED) || "", i = s.indexOf("\n");
    if (i < 0) return null;
    const u = decodeURIComponent(s.slice(0, i)), p = decodeURIComponent(s.slice(i + 1));
    return (u && p) ? { u: u, p: p } : null;
  } catch (e) { return null; }
}
/* 与 `ldPresetCred` **同语义**：只有当前用户命中 `CTR_USERS` 才兜底。
   ⚠️ 命中不了就**原样放弃** —— 绝不把自建账号悄悄换成 admin（那是食堂那一家的特例，
      用户单独拍过板，见 `cmrPresetCred`）。 */
function campusPresetCred() {
  let uname = "";
  try {
    const u = JSON.parse(localStorage.getItem("user") || "null");
    uname = (u && (u.username || u.nickname)) || "";
  } catch (e) {}
  if (!uname) return null;
  for (const p of CTR_USERS) if (p.u === uname) return { u: p.u, p: p.p };
  return null;
}
/* ⭐ 候选链，**顺序**：本人凭据 → 别人家的凭据 → 预设兜底。
   ⚠️ 为什么能白拿别人家的 `*_cred`：四家账号密码**本来就是同一对**（登录门一次输入、
      四处同步，见 `doLogin`）⇒ 老会话只要在任一模块留过凭据就能救回来。
      这一条正好补上「没留 `campus_cred`、而 `localStorage.user` 已被平台自己抹掉」的洞。 */
function campusBestCred() {
  return campusCredLoad() || ldCredLoad() || cmrCredLoad() || campusPresetCred();
}
/* 登录门那段"发登录请求"抽出来，与 `campusRelogin` 共用。
   ⚠️ 抽出来还有个结构性理由：`build.py` 钉死了这个接口字面量全页只许出现**一次**。 */
function campusLoginPost(u, p) {
  return fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: u, password: p })
  }).then(r => r.json());
}
/* 把服务端回的登录结果写进 localStorage。
   ⚠️ 字段名必须与 campus_game 的 `stores/user.js:31-36` 一模一样
      （`{id, username, nickname, role}`）—— 那边 `setUser` 就是这么存的，路由守卫读
      `user.role`，名字错了管理后台会被踢出来。抽出来同样是为了那条"只许出现一次"的断言。 */
function campusWriteSession(d) {
  try {
    localStorage.setItem("token", d.token);
    localStorage.setItem("user", JSON.stringify({
      id: d.userId, username: d.username, nickname: d.nickname, role: d.role
    }));
  } catch (e) {}
}
/* 票过期 / 被平台自己抹掉时重登一次，把 `token` 与 `user` 都写回去。 */
function campusRelogin() {
  const c = campusBestCred();
  if (!c) return Promise.resolve("skip");
  return campusLoginPost(c.u, c.p).then(res => {
    if (res && res.code === 200 && res.data && res.data.token) {
      campusWriteSession(res.data);
      return "ok";
    }
    return "skip";
  }).catch(() => "down");
}
/* ⭐ 算法哥的闸门。
   ⚠️ 探活接口**不能**用 `/api/agent/status`：它在 `SecurityConfig` 的 permitAll 名单里，
      永远 200，票死了也看不出来。`/api/user/info` 走 `/user/**`、**不在**名单里
      ⇒ 401/403 就是票死了；而且它**自己不会**触发"登出 + 跳 /login"那条链
      （那是 axios 拦截器干的，我们这里是裸 fetch）。
   ⚠️ 票为空时**别发 `Bearer undefined`**，直接短路去补登。
   ⚠️ 判据是"HTTP 2xx **且** body 的 `code === 200`"：平台的 401 有**两种**回法 ——
      ① 过滤器链直接拦下（HTTP 401/403，body 不是 JSON）；
      ② 控制器自己 `throw new BusinessException(401, ...)` ⇒ **HTTP 200** + `{code:401}`。
      只看 `r.ok` 会把 ② 误判成"活着"。 */
let CAMPUS_READY = null;
function campusEnsure() {
  if (CAMPUS_READY) return CAMPUS_READY;
  CAMPUS_READY = (function () {
    let tok = "";
    try { tok = localStorage.getItem("token") || ""; } catch (e) {}
    if (!tok) return campusRelogin();            // 没票 ⇒ 直接补登（见上）
    return fetch("/api/user/info", { headers: { "Authorization": "Bearer " + tok } })
      .then(r => r.json()
        .then(j => (r.ok && j && j.code === 200) ? "ok" : campusRelogin())
        .catch(() => campusRelogin()))
      .catch(() => "down");
  })().then(st => { CENTER.campus = st; hudUserTick(); CAMPUS_READY = null; return st; });
  return CAMPUS_READY;
}

function hudUserTick() {
  if (!hudUser) return;
  let u = null;
  try { u = JSON.parse(localStorage.getItem("user") || "null"); } catch (e) {}
  let t = (u && (u.nickname || u.username)) ? ("已登录 · " + (u.nickname || u.username)) : "";
  /* ⭐ 学霸姐那边的结果用一行尾巴说清楚。⚠️ 只在"平台登上了、她那边的结果也回来了"
     时才追加 —— 平台都没登就没有尾巴（否则会在地图上挂一句莫名其妙的话）。 */
  if (t && CENTER.xbg && CENTER.xbg !== "ok") {
    t += "　·　学霸姐" + (CENTER.xbg === "down" ? "没连上" : "没同步上");
  }
  if (t && CENTER.ld && CENTER.ld !== "ok") {
    t += "　·　保卫处" + (CENTER.ld === "down" ? "没连上" : "没同步上");
  }
  if (t && CENTER.cmr && CENTER.cmr !== "ok") {
    t += "　·　食堂阿姨" + (CENTER.cmr === "down" ? "没连上" : "没同步上");
  }
  if (t && CENTER.campus && CENTER.campus !== "ok") {
    t += "　·　刷题平台" + (CENTER.campus === "down" ? "没连上" : "没同步上");
  }
  hudUser.textContent = t;
  if (lgOut) lgOut.hidden = !t;
}
/* 两个预设账号按钮：**只绑一次**（加载期）。
   ⚠️ 绝不能放进 `loginGate()` 里 —— 那个函数**每登出一次就会被再调一次**，
      于是每轮往同一批按钮上再叠一条监听。叠到第三条时的症状是：
      点一下「管理员」，用户名被填上 → 被下一条清掉 → 再被最后一条填上，
      看起来像闪了一下；而"清空 → 重填"中间态在某些时序下会**留下空用户名**。
      这类"看起来能用、只是偶尔怪一下"的 bug 最难查，索性从结构上让它不可能发生。 */
(function bindQuick(){
  if (!loginEl) return;
  const btns = loginEl.querySelectorAll("#lgQuick button");
  for (const b of btns) {
    const on = () => {
      for (const o of btns) o.classList.remove("on");
      b.classList.add("on");
      if (lgU) lgU.value = b.getAttribute("data-u") || "";
      if (lgP) lgP.value = b.getAttribute("data-p") || "";
      if (lgMsg) lgMsg.textContent = "";
    };
    b.addEventListener("click", on);
  }
})();

function loginGate() {
  if (!loginEl) return;
  let tok = "";
  try { tok = localStorage.getItem("token") || ""; } catch (e) {}
  hudUserTick();
  if (tok) { loginEl.hidden = true; return; }        // 24 小时内再来，直接进
  loginEl.hidden = false;
  if (lgMsg) lgMsg.textContent = "";
  if (lgU) lgU.value = ""; if (lgP) lgP.value = "";
  /* 只清高亮，不重新绑监听（绑在加载期那一次就够） */
  for (const b of loginEl.querySelectorAll("#lgQuick button")) b.classList.remove("on");
  if (lgU) lgU.focus();
}
function doLogin() {
  if (!lgU || !lgP) return;
  const u = (lgU.value || "").trim(), p = lgP.value || "";
  if (!u || !p) { if (lgMsg) lgMsg.textContent = "用户名和密码都要填。"; return; }
  if (lgGo) { lgGo.disabled = true; lgGo.textContent = "登录中…"; }
  if (lgMsg) lgMsg.textContent = "";
  /* ⚠️ 第四十五轮：请求与"写会话"两段抽成了 `campusLoginPost` / `campusWriteSession`
     （定义见下面"算法哥的闸门"那一节）—— 一是 `campusRelogin` 要用同一份逻辑，
     二是 `build.py` 钉死了这两处的字面量全页各只许出现**一次**。 */
  campusLoginPost(u, p).then(res => {
    if (res && res.code === 200 && res.data && res.data.token) {
      campusWriteSession(res.data);
      loginEl.hidden = true;
      hudUserTick();
      /* ⭐ 把凭据记下来：登录门**下次会自己藏起来**，那时候没有密码可问，
         只能靠这一份补同步（见 `xbgBootSync`）。
         ⚠️ `campusCredSave` 这一把比另外三把更要命：平台的 401 会把 `token` 与 `user`
            从**整个源**上抹掉（见 `CAMPUS_CRED` 那段），到那时候只有它还认得你。 */
      campusCredSave(u, p);
      xbgCredSave(u, p);
      ldCredSave(u, p);       // 同上：登录门下次会自己藏起来，那时候没有密码可问
      cmrCredSave(u, p);      // 同上
      /* ⭐ 平台这一步已经过了 —— **现在**才去动学霸姐（顺序反不得，见 xbgSync 的注释）。
         不 await：她那边要读 85 MB 索引，十几秒，绝不能拿它卡住进地图。 */
      xbgSync(u, p, 4).then(st => { CENTER.xbg = st; hudUserTick(); });
      /* 老丁那边快得多（毫秒级），同样不 await —— 三条路谁都不许卡住进地图。 */
      ldSync(u, p, 4).then(st => { CENTER.ld = st; hudUserTick(); });
      /* 食堂阿姨（毫秒级）。⚠️ 这里把那条 promise 挂进 `CMR_READY`：
         人可能敲完回车就走过去按 C，`cmrEnsure` 要能等到它（见 cmrEnsure 的注释）。 */
      CMR_READY = cmrSync(u, p, 4).then(st => { CENTER.cmr = st; hudUserTick(); CMR_READY = null; return st; });
    } else {
      if (lgMsg) lgMsg.textContent = (res && res.message) || "登录失败，换个账号试试。";
    }
  }).catch(() => {
    if (lgMsg) lgMsg.textContent = "连不上后端（8081）。先双击「启动像素校园.bat」。";
  }).then(() => {
    if (lgGo) { lgGo.disabled = false; lgGo.textContent = "进入像素校园"; }
  });
}
function doLogout() {
  try {
    localStorage.removeItem("token"); localStorage.removeItem("user");
    /* ⚠️⚠️ 第四十一轮：**必须一并清 `xbg_token`**。只清平台那两个的话，换账号后
       进逸夫楼会**以上一个账号的身份**自动进去（iframe 直接从 localStorage 读到旧 token）。
       这条第四十轮没有 —— 因为那时候还没有第二个系统。 */
    localStorage.removeItem("xbg_token");
    /* ⚠️ `xbg_cred` 同样要清，而且**比 `xbg_token` 更不能漏**：它是明文账号密码，
       留着的话下一个在这台机器登录的人，会被 `xbgBootSync` 拿去
       **以旧账号的身份**去登学霸姐（顺带把她那边的 token 也写回来）。 */
    localStorage.removeItem(XBG_CRED);
    /* ⚠️⚠️ 老丁那两把**同样一把都不能漏**，而且 `ld_token` 比 `xbg_token` 更要命：
       `laoding/index.html` 是**直接认领**这个裸 token 的（那条 fallback 就是本轮加的），
       留着它的话，下一个在这台机器登录的人按 C，抽屉里会**以上一个账号的身份**直接进去。 */
    localStorage.removeItem("ld_token");
    localStorage.removeItem(LD_CRED);
    /* ⚠️ 食堂阿姨这一把**只有凭据、没有票**（她的会话是 HttpOnly cookie，
       localStorage 里一个 aunt_* 的钥匙都没有）⇒ 没有 `cmr_token` 要清，
       **但 `cmr_cred` 必须清** —— 它是明文账号密码，留着的话下一个在这台机器登录的人
       会被 `cmrEnsure` 拿去**以旧账号的身份**登食堂（与老丁 `ld_cred` 同性质）。 */
    localStorage.removeItem(CMR_CRED);
    /* ⚠️ 第四十五轮新增的 `campus_cred` **更要清**：它是平台那一家的明文账号密码，
       而且是"票被平台自己抹掉"时的**唯一救兵** ⇒ 留着它，下一个在这台机器登录的人
       会被 `campusRelogin` **以旧账号的身份**把票种回来。 */
    localStorage.removeItem(CAMPUS_CRED);
  } catch (e) {}
  /* cookie 那份 JS 删不掉（HttpOnly，读不到也改不了）⇒ 叫服务自己删。
     fire-and-forget：删不掉也不该拦着人退登。
     ⚠️ 阿姨的 `POST /api/logout` 挂了 `check_origin`（`aunt/server.py`）⇒ 这条
        依赖 Vite 那边 `changeOrigin:false`；配错时它会静默 403，被 catch 吞掉。 */
  try { fetch("/xbg/api/logout", { method: "POST" }).catch(() => {}); } catch (e) {}
  try { fetch("/cmr/api/logout", { method: "POST" }).catch(() => {}); } catch (e) {}
  CENTER.xbg = "";
  CENTER.ld = "";
  CENTER.cmr = "";
  CENTER.campus = "";
  hudUserTick();
  loginGate();
}

/* --- 7.5.15 按键 -------------------------------------------------------
   ⚠️⚠️ **注册时机是本轮最要紧的一件事**：本段排在 `72_guide.js` **之前** ⇒ 这个监听
       比向导那条、比主循环的 WATCHED、比补丁 7 的缩放**都早注册**。
       window 上同 target 的监听按注册顺序触发，所以这里的 `stopImmediatePropagation()`
       能把它们一起挡在门外 —— 室内按 Esc 才不会去触发向导那张四档梯子。

   策略分三层（顺序不能反）：
     ① App iframe 铺着   → 网页这边一概不管（焦点在 iframe 里，Esc 由 7.5.13 那条接）
     ② 在房间里          → **所有键都吞**，移动键自己收进 CKEYS、B/C/Esc 自己办。
                            ⭐ 全吞是必须的：既让地图玩家**完全冻结**（探针 C3），
                               又顺手把向导整套（E 叫人 / Esc 梯子 / 方向键关面板）关掉。
     ③ 在地图上          → **只认 F，而且必须站在某间房的门口**，其余一律放行。
                            ⚠️ 放行是新旧玩法共存的前提：向导、缩放、移动一个字都不能受影响。 */
window.addEventListener("keydown", e => {
  if (e.isComposing || e.keyCode === 229) return;
  const k = (e.key || "").toLowerCase();

  if (CENTER.plat) return;                       // ① 交给 iframe

  if (CENTER.active) {                           // ② 房间
    if (CTR_MOVE[k]) { CKEYS[k] = 1; e.preventDefault(); e.stopImmediatePropagation(); return; }
    if (k === "b") { roomLeave(); }
    else if (k === "c") { ctrTalk(); }
    e.preventDefault(); e.stopImmediatePropagation();
    return;
  }

  if (k === "f" && !e.repeat) {                  // ③ 地图：进门
    const R = roomAt();
    if (R) {
      roomEnter(R);
      e.preventDefault(); e.stopImmediatePropagation();
    }
  }
}, false);

window.addEventListener("keyup", e => {
  if (!CENTER.active) return;
  const k = (e.key || "").toLowerCase();
  if (CTR_MOVE[k]) { CKEYS[k] = 0; e.preventDefault(); e.stopImmediatePropagation(); }
}, false);
window.addEventListener("blur", () => { for (const k in CKEYS) CKEYS[k] = 0; });

/* --- 7.5.16 起搏：地图上的「按 F」提示 --------------------------------
   本段不改主循环，所以自带一个极轻的常驻 rAF：只判一次坐标、只写一个 textContent。 */
let _hudctrLast = null;
function ctrHudPulse() {
  if (!CENTER.active && hudCtr) {
    const R = roomAt();
    const t = R ? R.enterTip : "";
    /* ⚠️ 比一下再写：textContent 赋同一个值也会产生一次 DOM 变更 + 样式重算，
       这个循环是 60Hz 常驻的，不缓存就等于让浏览器每秒白算 60 次。 */
    if (t !== _hudctrLast) { hudCtr.textContent = t; _hudctrLast = t; }
  }
  requestAnimationFrame(ctrHudPulse);
}

/* --- 7.5.17 装配 ------------------------------------------------------- */
if (lgGo) lgGo.addEventListener("click", doLogin);
if (lgP) lgP.addEventListener("keydown", e => {
  if (e.key === "Enter") { doLogin(); e.preventDefault(); e.stopPropagation(); }
});
if (lgU) lgU.addEventListener("keydown", e => {
  if (e.key === "Enter") { doLogin(); e.preventDefault(); e.stopPropagation(); }
});
if (lgOut) lgOut.addEventListener("click", doLogout);
/* ⚠️ iframe 的 `load` 只在**这里**绑一次（见 `ctrBindFrameEsc` 上面那段：
   放进打开抽屉的函数里会随打开次数叠加监听）。 */
if (ctrF) ctrF.addEventListener("load", ctrFrameBindEsc);
window.addEventListener("resize", () => { if (CENTER.active) { ctrResize(); ctrDraw(); } });

/* ⚠️ 登录门与起搏都**推迟到下一次事件循环**再启动：本段加载期 `player` / `keys`
   还在 TDZ 里（它们在主循环切片里），任何一条路径碰上去都是整页 JS 静默死。 */
setTimeout(() => { loginGate(); xbgBootSync(); ldBootSync(); cmrBootSync(); ctrHudPulse(); }, 0);

console.log("[像素校园] 室内场景段就绪"
  + " · 房间 " + Object.keys(ROOMS).join(" / ")
  + (CTR_RECT ? " · 计算机中心 (" + (CTR_RECT.x | 0) + ", " + (CTR_RECT.y | 0)
             + ") " + (CTR_RECT.w | 0) + "×" + (CTR_RECT.h | 0) : " · ⚠️ 没找到「计算机中心」"));
