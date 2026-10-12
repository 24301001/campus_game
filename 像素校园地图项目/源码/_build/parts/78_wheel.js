/* =========================================================================
   78_wheel.js — §22.7 校园猫谱 · 就地动作轮盘（第四十四轮 2026-10-09）
   -------------------------------------------------------------------------
   用户原话：「我建议我们点击一下 g 显示一个轮盘，上面有我们可以对猫的几个动作，
             点击对应扇区执行对应动作」。
   四格 = 摸 / 喂 / 叫它 / 逗它（用户 2026-10-09 拍板，不要拍照）。

   (1) 为什么是 DOM/SVG 而不是画在 canvas 上
       全项目**没有任何 canvas 鼠标监听**，也没有「屏幕坐标 → 世界坐标」的换算函数
       （那套换算是内联在 render() 里的）。画在 canvas 上就得自己重写一份，
       还要处理 resize() 的整数倍缩放。
       改成固定屏幕中央的 SVG，**点击交给浏览器** —— 零换算、零新坐标系统。

   (2) 为什么按键监听排在这里能收到 G
       72_guide.js 段那个全局 keydown 是全项目最早的，但它**只在对话框开着时吞键**；
       71b_center.js 在室内吞所有键（stopImmediatePropagation），本段排它之后 ⇒
       **蹲在教室里按 G 不响应**，回地图就正常。这是可接受的取舍（房间里有别的事做）。

   (3) ⚠️⚠️ 全屏只许出现**动作**，一个字的好感数字都不许有
       `交互.md §六`：反馈「只有动作，没有数字 —— 不做好感度进度条」。
       所以下面所有 guideToast 文案都是"它蹭了蹭你的腿"这种，**没有分数、没有档位名**。

   (4) ⚠️ 加载期一个字节都不许碰 player / ctx / cam
       那三个的 `const` 在**主循环切片**里（排在**本段之后**），加载期取一下就是
       整页 JS 静默死（TDZ）。本段只在**函数体**里用 player，运行期才求值，合法。
   ========================================================================= */
(function () {
  "use strict";

  const el = document.getElementById("wheel");
  const nameEl = document.getElementById("wheelName");
  if (!el) return;                       // 没有轮盘 DOM 就整段哑火，不抛

  /* 蹲下时长（秒）。与 build.py 补丁 23 的 0.35s 分界对齐：前 0.35s 手收着
     （还在往下蹲），之后手伸出去 —— 玩家看到的是"我蹲下来，再伸手"。
     ⚠️ 时长必须 ≥ 猫走过来的时间，否则"猫刚蹭上来、人已经站起来"：
        最远 `CAT_REACH_R` = 120px ÷ 57.6px/s（follow 2.4 倍）≈ 2.1 秒 ⇒ 摸取 2.6 秒。
        喂多留 0.4 秒：粮落点比玩家还靠前 16px，且要先等 REACH_MS 才落地。 */
  const CROUCH_SEC = { pet: 2.6, feed: 3.0 };
  const REACH_MS = 320;                  // "蹲下"到"手伸出去/放下粮"的毫秒数
  let opened = false;

  function gateUp() {                    // 登录门盖着时不响应（层序在它下面，看不见）
    const lg = document.getElementById("login");
    return !!(lg && !lg.hidden);
  }

  function open() {
    const c = catTarget();
    if (!c) { guideToast("这附近没有猫"); return; }
    opened = true;
    el.hidden = false;
    if (nameEl) nameEl.textContent = (c.cfg && c.cfg.name) || "猫";
  }
  function close() { opened = false; el.hidden = true; }
  function toggle() { if (opened) { close(); } else { open(); } }

  /* 蹲下：三个字段**一起写** —— 补丁 23（换蹲姿精灵）认 act/actT/actD，
     补丁 24（锁步）认 act/actT。少写一个就是"人蹲下了但还能走"这种半截状态。 */
  function crouch(pose) {
    player.act = pose;
    player.actD = CROUCH_SEC[pose] || 2.6;
    player.actT = player.actD;
  }

  /* --- 四格的动作本体 ---------------------------------------------------
     ⚠️ 文案一律**不带数字**（§3 那条铁律）。 */

  function doPet(c) {
    crouch("pet");
    if (catPet(c)) guideToast("它蹭了蹭你的腿");
    else guideToast("它退开了两步");            // 熟及以下：不让摸（§7.5.4 收口表）
  }

  function doFeed(c) {
    /* 冷却**先判**：不然玩家会先蹲下、再被告知"今天吃过了"，白蹲一次。
       ⚠️ 判据与 `catFeed()` 里那条是同一个（`memo.lastDay === now.day`，按真实日期）。 */
    if (catFedToday(c)) { guideToast("它今天已经吃过了"); return; }
    crouch("feed");
    /* 粮要**在手指伸出去之后**才落地（REACH_MS 后），否则画面是"人还没伸手，
       地上先冒出一堆粮"。⚠️ 这里用 setTimeout 而不是每帧钩子 —— 轮盘不需要
       逐帧状态，多挂一条心跳只是给主循环加负担。 */
    window.setTimeout(function () {
      const r = catFeed(c);
      if (r === "ok") guideToast("它低头吃了起来");
      else if (r === "cold") guideToast("它今天已经吃过了");
      else guideToast("它没过来");            // c 已不活跃（作息切了时段）才会到这
    }, REACH_MS);
  }

  function doCall(c) {
    catCall(c);
    guideToast("它抬起头看你");                 // 六档都抬头，走近与否是档位的事
  }

  function doTease(c) {
    catTease(c);
    guideToast(c.tier >= 2 ? "它扑了一下" : "它抬头看了你一眼");
  }

  const ACTS = { pet: doPet, feed: doFeed, call: doCall, tease: doTease };

  /* 转身面向猫。判据照 build.py 补丁 14：`>=` 取侧视（斜向时至少露侧脸，别给后脑勺）。
     ⚠️ 只在**动作开始的这一刻**转一次，之后不追 —— 蹲姿期间补丁 24 把移动键清零，
        所以这个朝向不会被 update() 顶掉；猫自己会转身朝你（`catStep` 按移动方向定朝向）。 */
  function faceTo(c) {
    const dx = c.x - player.x, dy = c.y - player.y;
    player.dir = (Math.abs(dx) >= Math.abs(dy)) ? (dx < 0 ? "left" : "right")
                                               : (dy < 0 ? "up" : "down");
  }

  function run(act) {
    close();                                   // 先收起再执行 —— 让玩家看清猫的反应
    const c = catTarget();
    if (!c) { guideToast("这附近没有猫"); return; }
    faceTo(c);
    const fn = ACTS[act];
    if (fn) fn(c);
  }

  /* --- 点击（轮盘本体 + 点空白处收起）--- */
  el.addEventListener("click", function (e) {
    if (e.target === el) { close(); return; }  // 点的是遮罩本身（扇区之外）
    const sec = e.target.closest ? e.target.closest("[data-act]") : null;
    if (sec) run(sec.getAttribute("data-act"));
  });

  /* --- 键盘：G 开合 / Esc 收起 ---
     ⚠️ 三道早退照 71b_center.js 的写法：输入法组字中、keyCode 229、以及**焦点在
        输入框里**（向导的对话框有个文本框，在里面打 "g" 不该弹轮盘）。 */
  window.addEventListener("keydown", function (e) {
    if (e.isComposing || e.keyCode === 229) return;
    const t = e.target;
    if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
    if (gateUp()) return;
    if (document.body && document.body.classList.contains("ctr-on")) return;   // 室内不响应
    const k = (e.key || "").toLowerCase();
    if (k === "g") { toggle(); }
    else if (k === "escape" && opened) { close(); }
  });

  /* 探针出口（`_catwheel.py` 用）：只读，不改状态。
     ⚠️ 名字带 `_` 前缀，和项目里其它自证钩子（`_propdiff` / `_sprhash`）一致。 */
  window._wheelOpen = function () { return opened; };
  window._wheelRun = function (act) { run(act); };        // 探针直接执行某一格
})();
