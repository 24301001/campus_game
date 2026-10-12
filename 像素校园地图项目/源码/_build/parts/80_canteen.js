/* =========================================================
   7.10 食堂阿姨 —— 站在学生一食堂门口的那个人（2026-10-11 接入地图）
   ---------------------------------------------------------
   她在 MVP 里的定位是「**走到食堂门口就能进去问吃的**」：
   不巡逻（与老丁不同，老丁是全图游荡的那个人），就站在**学生一食堂南门**，
   你走近 → 头顶冒「按 C 进食堂」→ 按 C 打开**同源 iframe 抽屉**，
   抽屉里就是食堂阿姨那个独立应用（`campus_game_cmr/aunt/`，8020）。

   · 精灵：走 71b 的 `npcSprites(AUNT_PAL)` —— 与玩家 / 小北 / 算法哥 / 学霸姐 /
     老丁**共用 `50_char.js` 的骨架与步态**，只换配色。不新开骨架：
     像素风最容易露馅的就是比例与描边（见 `71_guide_char.js` 开头）。

   · 站位：**加载期**从 `CAMPUS` 现算，不写死坐标（同 `76_cat_data.js` / `79_guard.js`
     的规矩）—— 楼一挪，她跟着走。锚点用**向导那套门前点**（`72_guide.js` 的 `GDEST`：
     `x = R.x + R.w/2, y = R.y + R.h + 14`），再螺旋吸附到真正站得住的地方。

   · 交互：走近 → 头顶冒「按 C 进食堂」→ 按 C 开抽屉。抽屉**复用 71b 的
     `#ctrP` / `#ctrF`** 与 `ctrProbe` / `ctrOpenPlatform` / `ctrColdStart`，
     观感与算法哥 / 学霸姐 / 老丁**同一套**。地址 `/cmr/`：Vite 代理到
     127.0.0.1:8020，服务端 `PrefixStrip` 剥前缀（见 `campus_game/frontend/vite.config.js`）。

   · 免登录：**白拿的**。她走的是 HttpOnly 会话 cookie，地图与她同源 ⇒ iframe 里的
     请求天然带得上。地图那边 `doLogin` / `cmrBootSync` 只是顺手替她登一次
     （见 `71b_center.js` 的 `cmrSync` / `cmrEnsure`），**这里不必做任何认领动作**。

   ⚠️ 四条不许踩（与老丁同款，理由见 `79_guard.js` 文件头）：
     ① **不进 props、不加 addSolid** —— 她是每帧换 img 的活人（同向导 / 猫 / 老丁），
        进 props 会让 `_propdiff.py` 每轮报假差异，还会落进 60 段白名单式 clear* 的射程。
     ② **移动判定与 `ensureWalkGrid()` 逐字同一对**（`canWalk && !blocked`）——
        换 `ptBlocked` 就宽 1px，会挑出「格子上通、实际挤不过去」的点。
     ③ 加载期**不碰** player / cam / keys / cv / zoom（那五个的声明在 `loop` 切片里，
        排在本段**之后**，加载期取会撞 TDZ ⇒ 整页 JS 静默死）。只在**函数体**里用。
     ④ 本文件注释里**不许出现带尖括号的 script 字面量** —— `build.py` 的语法闸正则
        会错位报 SYNTAX_FAIL（栽过两次）。
   ========================================================= */

/* 配色。⚠️ 六个 NPC 的识别色必须两两拉开（3× 档下实测距离约 6 格）：
       玩家   = 蓝外套 #3f6ea8
       小北   = 红马甲 #c0392b（全图唯一的高饱和红）
       算法哥 = 冷黑   #2b3038 + 眼镜
       学霸姐 = 藕荷紫 #8b6cc0（全图唯一紫）
       老丁   = 深藏青 #2b3a5e + 银灰发
       阿姨   = **米白围裙** #efe7d6 + **暖橘头巾** #d9822b
   ⚠️ 阿姨在原应用里是砖红 `#b75e43` —— 那个色与小北的 `#c0392b` 在 3× 档下会糊在
      一起，所以这里**只保留米白+暖橘**这对最扎眼的组合，红一点都不要。
      暖橘也明显亮于老丁的深藏青、暖于算法哥的冷黑，剪影上一眼分得开。
   ⚠️ `pack` 三色取围裙同色 = **她背着的就是围裙那块**（同算法哥 / 老丁的处置：
      `torso(true)` 照旧画那一块，取同色等于什么都没加）。 */
const AUNT_PAL = {
  skin:  "#f0c8a8", skinD: "#cf9f7e", skinL: "#fbdcc0",
  hair:  "#d9822b", hairL: "#f0a250", hairD: "#a85d18",   // 暖橘头巾
  coat:  "#efe7d6", coatD: "#cfc4ad", coatL: "#fbf6ea",   // 米白围裙
  pant:  "#5a6570", pantD: "#3c454e", pantL: "#7b8792",
  shoe:  "#2a2e34", shoeL: "#454b53",
  pack:  "#efe7d6", packD: "#cfc4ad", packL: "#fbf6ea"
};
const auntSprite = npcSprites(AUNT_PAL);

/* --- 7.10.1 门口点（**加载期**从 CAMPUS 现算）--------------------------
   ⚠️ 大橘（`76_cat_data.js` 的 `CAT_SPOT_DEF.canteen_back`）领的是同一栋楼的
      **N 侧（后门）**，阿姨站 **S 侧（前门）**，中间隔整栋楼 ⇒ 两边不会挤在一起。
   ⚠️ 锚点与向导 `GDEST` 同一口径（门前 14px），不是自造的 `R.y + R.h`。 */
const AUNT_SPOT = (function () {
  const e = (typeof CAMPUS !== "undefined" && CAMPUS)
    ? CAMPUS.find(x => x[0] === "学生1食堂") : null;
  if (!e) { console.warn("80_canteen: 没找到「学生1食堂」，阿姨退回出生点"); return null; }
  const R = zoneRect(e);
  return { x: R.x + R.w / 2, y: R.y + R.h + 14 };
})();

const AUNT_TALK_R = 68;    // 「按 C 进食堂」的半径（与老丁同一档）
const AUNT_SEE_R  = 150;   // 这个距离内她转头看你（`交互.md §4.1`「靠近 → 转向玩家」）

/* 移动判定 —— ⚠️ 与 `ensureWalkGrid()` 烘格子那一行**逐字同一对**（见文件头 ②）。 */
function auntWalkable(x, y) { return canWalk(x, y) && !blocked(x, y); }

/* 把一个锚点吸附到最近的可走点（螺旋外扩，确定性；16 个方向 × 半径 4..96）。
   ⚠️ 这一段的算法与 `79_guard.js` 的 `guardSnap` 逐字同款 —— 也是本项目
      「建筑锚点 → 真正站得住的地方」的既有唯一做法（源头是 `76_cat_data.js`
      的 `catPlace` 那 11 个候选偏移）。别再发明第三套。
   ⚠️ 学生一食堂南缘到南边宿舍楼只剩约 68px 的夹缝，锚点**必须**吸附：
      原地站不住的话玩法直接不可达（探针 A0 会断言这一点）。 */
function auntSnap(x, y) {
  if (auntWalkable(x, y)) return { x: x, y: y };
  for (let r = 4; r <= 96; r += 4) {
    for (let a = 0; a < 16; a++) {
      const t = a * Math.PI / 8, nx = x + Math.cos(t) * r, ny = y + Math.sin(t) * r;
      if (auntWalkable(nx, ny)) return { x: nx, y: ny };
    }
  }
  console.warn("80_canteen: 学生一食堂门口 96px 内没找到可走点，阿姨原地站着");
  return { x: x, y: y };
}

/* --- 7.10.2 她是活的：位置 / 朝向 / 相位 + 两个状态位 ------------------- */
const AUNT = (function () {
  const s = AUNT_SPOT ? auntSnap(AUNT_SPOT.x, AUNT_SPOT.y)
                      : { x: SPAWN.x, y: SPAWN.y };
  return {
    name: "食堂阿姨",
    x: s.x, y: s.y, dir: "down", step: IDLE_BASE, idle: 0,
    near: false, open: false,
    talking: false      // 开抽屉这件事正在路上（防连按 C 并发两条）
  };
})();

/* 站着不动：待机呼吸两帧，与玩家同一个 IDLE_HZ / IDLE_FRAMES。 */
function auntStand(dt) {
  AUNT.idle += dt;
  AUNT.step = IDLE_BASE + (((AUNT.idle * IDLE_HZ) | 0) & (IDLE_FRAMES - 1));
}

/* 转向玩家。⚠️ 只在**函数体**里用 player（加载期它在 TDZ 里，见文件头 ③）。 */
function auntFace() {
  const dx = player.x - AUNT.x, dy = player.y - AUNT.y;
  if (Math.abs(dx) >= Math.abs(dy)) AUNT.dir = dx < 0 ? "left" : "right";
  else AUNT.dir = dy < 0 ? "up" : "down";
}

/* --- 7.10.3 每帧心跳（由 build.py 补丁 30 挂在 `guardTick` 之后）------- */
function auntTick(dt) {
  /* 抽屉开着 = `CENTER.plat`（与老丁同一条判据，见 `79_guard.js` 的 `guardTick`）。 */
  AUNT.open = (typeof CENTER !== "undefined") && !!CENTER.plat;
  const dP = Math.hypot(player.x - AUNT.x, player.y - AUNT.y);
  AUNT.near = !AUNT.open && dP <= AUNT_TALK_R;
  /* 她**不巡逻** ⇒ 没有老丁那套「有人靠近就停下」的状态机（`GUARD_NOTICE_R`），
     `near` 天然稳定 —— 玩家手速再慢也追得上一个不动的目标。 */
  if (dP <= AUNT_SEE_R) auntFace();
  auntStand(dt);
  auntTipPaint();
}

/* --- 7.10.4 头顶气泡（复用 `#tip` 的样式，独立一个元素 `#atip`）--------
   ⚠️ 定位**不用 `getBoundingClientRect()`**（每帧读布局 = 强制重排）：
      `#wrap` 是 fixed + flex 居中 ⇒ 画布左上角纯算术可得（同 `79_guard.js`）。
   ⚠️ 不复用老丁那颗 `#ctip`：两颗气泡并存时会互相抢 `transform` 且互相覆写
      `innerHTML`（`79_guard.js` / `00_head.html` 都记着这条）。 */
const auntTip = document.getElementById("atip");
let _aTipX = -1e9, _aTipY = -1e9, _aTipTxt = null;
function auntTipPaint() {
  if (!auntTip) return;
  const txt = AUNT.near ? "<b>C</b> 进食堂" : "";
  if (txt !== _aTipTxt) {
    _aTipTxt = txt;
    if (txt) { auntTip.innerHTML = txt; auntTip.hidden = false; }
    else auntTip.hidden = true;
  }
  if (!txt || auntTip.hidden) return;
  const cssW = parseFloat(cv.style.width);
  if (!cssW) return;
  const cs = cssW / VIEW_W;
  const x = (window.innerWidth  - VIEW_W * cs) / 2 + (AUNT.x - cam.x) * zoom * cs;
  const y = (window.innerHeight - VIEW_H * cs) / 2 + (AUNT.y - CH_AY - cam.y) * zoom * cs;
  if (Math.abs(x - _aTipX) < 1 && Math.abs(y - _aTipY) < 1) return;   // 没动 ⇒ 零开销
  _aTipX = x; _aTipY = y;
  auntTip.style.left = x + "px";
  auntTip.style.top  = y + "px";
}

/* --- 7.10.5 抽屉：走近按 C 进食堂（与算法哥 / 学霸姐 / 老丁同一套）-----
   `ctrProbe` 只看 `R.probe`、`ctrOpenPlatform` 只看 `R.app`、`ctrColdStart` 只看
   `R.coldTip` ⇒ 给一个**假房间对象**就能整条复用，不必另写一套开关。
   ⚠️ `app` **必须带尾斜杠**（`/cmr/`）：她页面里的资源走相对路径，
      写成 `/cmr` 的话浏览器会把文档目录当成 `/`，CSS / JS 全落到地图根上 404。 */
const AUNT_APP = {
  app: "/cmr/", probe: "/cmr/api/health",
  /* ⭐⭐ 第四十五轮：「进抽屉前 cookie 已就绪」的闸门搬到了**唯一的开门出口**
     （`ctrOpenPlatform`）上，这里只负责把 `cmrEnsure` 报上去 ⇒ `ctrColdStart`
     那条"服务刚起来"的路也自动有闸门。
     ⚠️ 写成**函数**而不是直接引用 `cmrEnsure`：一是探针要**按名字**替换它造负对照，
        二是别让"引用"把函数名绑死在加载期。 */
  ensure: function () { return cmrEnsure(); },
  name: "学生一食堂", coldTip: "阿姨的值班室还没起来，正在拉起来，稍等一会儿……"
};
function auntOpen() {
  ctrOpenPlatform(AUNT_APP);
  /* 抽屉那个 iframe 的 title 是写死的「刷题平台」，切到食堂这边顺手改一下
     （只影响无障碍读屏与浏览器标签提示，画面无关）。 */
  if (ctrF) ctrF.setAttribute("title", "学生一食堂 · 阿姨");
}
function auntTalk() {
  if (typeof CENTER !== "undefined" && (CENTER.plat || CENTER.waiting)) return;
  /* ⚠️ 连按两次 C 的并发保护：`CENTER.plat` 要等 `ctrProbe` / 闸门回来才置真，
     这中间几百毫秒里第二下 C 会再走一遍整条链（探两次、开两次抽屉）。 */
  if (AUNT.talking) return;
  if (!AUNT.near) { auntToast("走近阿姨再按 C。"); return; }
  AUNT.talking = true;
  ctrProbe(AUNT_APP).then(function (ok) {
    AUNT.talking = false;
    if (!ok) {                        // 服务没起来 → 走 71b 那套"请启动器拉起来"
      ctrColdStart(AUNT_APP);
      return;
    }
    /* ⭐⭐ 第四十五轮：「等她那边登录就绪」那一步**搬进 `ctrOpenPlatform` 的闸门**了
       （`AUNT_APP.ensure` → `cmrEnsure`）—— 在这里再等一次是**重复**的，删掉。
       闸门挂在开门的唯一出口上，`ctrColdStart` 那条路也自动有，比原来那一处更严。 */
    auntOpen();
  });
}
/* 反馈复用向导那张 `guideToast`（2.6 秒自动隐藏）—— 地图上已经有这一块，不另做。 */
function auntToast(t) { if (typeof guideToast === "function") guideToast(t); }

/* --- 7.10.6 退出：接她页面里那颗「← 返回校园」按钮 ---------------------
   ⚠️ 她那边是 `window.parent.postMessage({type:"aunt-exit"}, location.origin)`
      （见 `campus_game_cmr/aunt/static/app.js`）。同源 iframe 的 `message` 事件
      父页收得到 —— 这正是「同源」换来的东西之一。
   ⚠️ 两道校验缺一不可：`origin` 对得上**且** `source` 就是本抽屉那个 frame。
      少一道的话，页面上任何别的 iframe / 弹窗都能凭一条消息关掉地图的抽屉。
   ⚠️ Esc 那条路仍然有效（71b 的 `ctrFrameBindEsc`），两者不冲突。 */
window.addEventListener("message", function (e) {
  if (!e || !e.data || e.data.type !== "aunt-exit") return;   // 只认她自己发的那一条
  if (e.origin !== location.origin) return;
  if (!ctrF || e.source !== ctrF.contentWindow) return;
  if (typeof CENTER === "undefined" || !CENTER.plat) return;
  ctrClosePlatform();
}, false);

/* --- 7.10.7 按键 ------------------------------------------------------
   ⚠️ 只在**真的站得够近**时才消费 C：别处的 C 一律放行，绝不改变既有按键语义。
   ⚠️ 三道早退照 71b 的写法：输入法组字中、keyCode 229、抽屉/房间/冷启动期间让路。
   ⚠️ 与老丁那颗 C 的先后：window 上同 target 的监听按**注册顺序**触发，本段排在
      `79_guard.js` 后面 ⇒ 两人若同时 `near`，**老丁赢**（他俩一东一西，实际撞不上）。 */
window.addEventListener("keydown", function (e) {
  if (e.isComposing || e.keyCode === 229) return;
  if (typeof CENTER === "undefined") return;
  if (CENTER.plat || CENTER.active || CENTER.waiting) return;
  if ((e.key || "").toLowerCase() === "c" && !e.repeat && AUNT.near) {
    auntTalk();
    e.preventDefault(); e.stopImmediatePropagation();
  }
}, false);
