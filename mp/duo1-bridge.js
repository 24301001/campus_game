/* =============================================================================
   duo1-bridge.js —— 像素校园 · 逸夫楼 躲猫猫公告栏
   -----------------------------------------------------------------------------
   部署位置：/opt/campus_portal/mp/duo1-bridge.js
   地图里只需要加一行（在 mp/lobby.js 之后）：
     <script src="mp/duo1-bridge.js?v=duobridge01"></script>
   大厅白名单（mp/server.py:470）要加上 "mp/duo1-bridge.js"。

   为什么这些代码能待在自己一个文件里、不塞进地图主体：
   · 公告栏的画法是**包一层** ROOMS.yifu.decor —— 它的签名就是 decor(g)，
     只收画布上下文（调用点在地图 5426 行：R.floor(g); R.walls(g); R.decor(g); R.door(g)）
   · 邻近判定和提示**自带一条常驻 rAF**，不改地图主循环 —— 这个写法是抄地图作者
     自己在「7.5.16 起搏：地图上的『按 F』提示」那段里用的路子
   · F 键用 **capture 阶段**监听：地图那个 keydown 处理里对房间内的按键调了
     stopImmediatePropagation，但它只在 bubble 阶段拦，capture 在它之前跑。
     而且地图室内只认移动键 / b / c，F 在室内本来就是空的。

   ⚠️ 本文件全部包在 try/catch 里，装不上就在控制台留一条 warn 并把
      window.pxGame.status 写成 "no-mounted" —— 宁可明着红，不出假绿。
   ========================================================================== */
(function () {
  "use strict";

  var BOARD = {
    x: 200, y: 206,          // 学霸姐(520,210) 关于大厅中轴 360 的对称点
    w: 36, h: 26,            // 牌面 x[182,218] y[193,219]
    // 碰撞只算底座（立牌的脚），牌面是"竖起来"的，俯视不该占那么深
    sx: 184, sy: 208, sw: 32, sh: 10,
    near: 46,                // 提示半径（比学霸姐的 talkR 74 小，两者又隔 320px，不会抢气泡）
    tip: "按 F 进入躲猫猫 · 房间大厅",
    room: "yifu"
  };
  var LOBBY_URL = "/game/duo1/";
  var GAME_BASE = "/duo1/";
  var ENTER_MODE = "iframe";   // "iframe" = 还在抽屉里（要先验指针锁）；"tab" = 新标签顶层窗口

  var out = {
    status: "init", board: BOARD, enterMode: ENTER_MODE,
    near: false, opened: false, notes: []
  };
  window.pxGame = out;

  function note(t) { out.notes.push(t); if (window.console) console.warn("[duo1-bridge] " + t); }

  try {
    if (typeof CENTER === "undefined" || typeof ROOMS === "undefined") {
      throw new Error("地图的 CENTER/ROOMS 取不到（引擎若改成 module 作用域，本文件要换接法）");
    }
    var R = ROOMS[BOARD.room];
    if (!R) throw new Error("没有房间 " + BOARD.room);

    /* ── 1. 画公告栏：包一层 decor ───────────────────────────────────── */
    var origDecor = R.decor;
    R.decor = function (g) {
      if (origDecor) origDecor(g);
      drawBoard(g);
    };

    function drawBoard(g) {
      var x = BOARD.x - BOARD.w / 2, y = BOARD.y - BOARD.h / 2;
      g.save();                       // 我改了 font/textAlign，必须还原，否则后面 R.door(g) 跟着偏
      g.fillStyle = "#5a4d3e";                       // 木外框
      g.fillRect(x - 2, y - 2, BOARD.w + 4, BOARD.h + 4);
      g.fillStyle = "#b98a56";                       // 软木底板
      g.fillRect(x, y, BOARD.w, BOARD.h);
      g.fillStyle = "#a8794a";                       // 底板上的横纹，远看就是软木板
      for (var ry = y + 3; ry < y + BOARD.h; ry += 4) g.fillRect(x + 1, ry, BOARD.w - 2, 1);

      /* 标题「躲猫猫」：先压一层深色再写亮色，像素风就是靠这个硬边 */
      g.textAlign = "center"; g.textBaseline = "middle";
      g.font = "bold 11px SimSun, NSimSun, 'Microsoft YaHei', monospace";
      g.fillStyle = "#2b2118";
      g.fillText("躲猫猫", x + BOARD.w / 2 + 1, y + 7 + 1);
      g.fillStyle = "#ffd76e";
      g.fillText("躲猫猫", x + BOARD.w / 2, y + 7);

      /* 猫头剪影：两只三角耳 + 一张脸 + 两个眼，一眼知道是猫 */
      var cx = x + BOARD.w / 2, cy = y + 18;
      g.fillStyle = "#f1f0ea";
      g.fillRect(cx - 5, cy - 5, 2, 2); g.fillRect(cx + 3, cy - 5, 2, 2);   // 耳
      g.fillRect(cx - 4, cy - 4, 8, 7);                                     // 脸
      g.fillStyle = "#2b2118";
      g.fillRect(cx - 2, cy - 2, 1, 2); g.fillRect(cx + 1, cy - 2, 1, 2);   // 眼
      g.fillRect(cx - 1, cy + 1, 2, 1);                                     // 鼻

      g.fillStyle = "#4a453f";                       // 两条腿
      g.fillRect(x + 3, y + BOARD.h, 3, 5);
      g.fillRect(x + BOARD.w - 6, y + BOARD.h, 3, 5);
      g.fillStyle = "#ffd76e";                       // 四角图钉
      g.fillRect(x, y, 2, 2); g.fillRect(x + BOARD.w - 2, y, 2, 2);
      g.fillRect(x, y + BOARD.h - 2, 2, 2); g.fillRect(x + BOARD.w - 2, y + BOARD.h - 2, 2, 2);

      if (out.near) {
        g.fillStyle = "rgba(255,215,110,0.85)";      // 靠近描一圈，和学霸姐的光圈同一路
        g.fillRect(x - 4, y - 4, BOARD.w + 8, 2);
        g.fillRect(x - 4, y + BOARD.h + 6, BOARD.w + 8, 2);
        g.fillRect(x - 4, y - 4, 2, BOARD.h + 12);
        g.fillRect(x + BOARD.w + 2, y - 4, 2, BOARD.h + 12);
      }
      g.restore();
    }

    /* ── 2. 立牌挡人：只把底座加进这间的 solid ───────────────────────
       走道核算（CTR_R=7 ⇒ 每维至少 14px）：这一段自由宽度 x[166,250]=84，
       底座吃 x[184,216] ⇒ 左 18、右 34，两个缺口都 >14 才敢加。            */
    if (R.solid && R.solid.push) {
      R.solid.push([BOARD.sx, BOARD.sy, BOARD.sw, BOARD.sh]);
    } else {
      note("ROOMS." + BOARD.room + ".solid 不可写，公告栏不挡人（人会穿过去）");
    }

    /* ── 3. 邻近 + 提示：自带一条常驻 rAF ───────────────────────────── */
    var lastTip = null, mpRoot = null;
    function pulse() {
      var near = false;
      try {
        near = !!(CENTER.active && CENTER.room && CENTER.room.key === BOARD.room &&
                  !CENTER.plat && Math.hypot(CENTER.x - BOARD.x, CENTER.y - BOARD.y) < BOARD.near);
      } catch (e) { near = false; }
      if (near !== out.near) {
        out.near = near;
        if (typeof ctrTipMsg === "function") {
          if (near) ctrTipMsg(BOARD.tip, 0.35);
          else if (CENTER.nearNpc && typeof ROOMS.yifu.npc !== "undefined") { /* 让位给学霸姐的气泡 */ }
        }
      }
      /* 站着不动时也刷一下气泡：地图自己的气泡有 CENTER.tipT 计时，会盖掉我这句 */
      if (near && typeof ctrTipMsg === "function" && (Date.now() - (lastTip || 0)) > 900) {
        lastTip = Date.now();
        ctrTipMsg(BOARD.tip, 0.35);
      }
      /* 地图的联机面板根节点 `#mpRoot` 是 `position:fixed;inset:0;z-index:50`，比抽屉
         `#ctrP`(20) 高 ⇒ 猫图鉴、个人精灵、"附近的人"会画在大厅上面（他实测被挡住）。
         故意放在这条每帧跑的 rAF 里，而不是写在"关闭时还原"那一路 —— 漏一条关闭路径
         也不会把面板永久藏掉。抽屉开着时压到 15（低于 20 就整块被不透明背景盖住）。 */
      if (!mpRoot) mpRoot = document.getElementById("mpRoot");
      if (mpRoot) {
        var wantZ = CENTER.plat ? "15" : "50";
        if (mpRoot.style.zIndex !== wantZ) mpRoot.style.zIndex = wantZ;
        out.mpRootZ = wantZ;
      }
      requestAnimationFrame(pulse);
    }
    requestAnimationFrame(pulse);

    /* ── 4. 打开 / 关闭抽屉 ─────────────────────────────────────────── */
    function drawer() { return document.getElementById("ctrP"); }
    function frame() { return document.getElementById("ctrF"); }

    function open(url, title) {
      var p = drawer(), f = frame();
      if (!p || !f) { note("找不到 #ctrP / #ctrF，开不了抽屉"); return false; }
      f.setAttribute("allow", "pointer-lock; fullscreen; autoplay");
      f.setAttribute("title", title || "躲猫猫");
      f.setAttribute("src", url);
      p.hidden = false;
      CENTER.plat = true;        // 与 ctrOpenPlatform 同一条语义：锁住 2D 移动、按键交给 iframe
      out.opened = url;
      bindEsc(f);
      return true;
    }

    function close() {
      if (typeof ctrClosePlatform === "function") ctrClosePlatform();
      else { var p = drawer(); if (p) p.hidden = true; CENTER.plat = false; }
      out.opened = false;
    }

    /* Esc 从抽屉里退回地图：同源才拿得到 iframe 的 document，拿不到就用父页的 Esc。 */
    function bindEsc(f) {
      var bind = function () {
        try {
          var d = f.contentDocument;
          if (!d || d.__duoBridgeEsc) return;
          d.__duoBridgeEsc = 1;
          d.addEventListener("keydown", function (e) {
            if (e.key === "Escape") { close(); e.preventDefault(); e.stopPropagation(); }
          }, true);
        } catch (err) { /* 跨源就算了，父页那条 Esc 兜底还在 */ }
      };
      f.addEventListener("load", bind);
      bind();
    }
    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && CENTER.plat && out.opened && out.enterMode === "iframe") close();
    }, true);

    /* ── 5. 按 F 开大厅；再收到大厅的 postMessage 才进 3D ──────────── */
    window.addEventListener("keydown", function (e) {
      if (e.isComposing || e.keyCode === 229 || e.repeat) return;
      if ((e.key || "").toLowerCase() !== "f") return;
      if (!out.near || CENTER.plat) return;
      e.preventDefault(); e.stopImmediatePropagation();
      if (!open(LOBBY_URL + "?v=" + Date.now(), "躲猫猫 · 房间大厅")) return;
      out.lastLobby = Date.now();
    }, true);

    window.addEventListener("message", function (e) {
      if (e.origin !== location.origin) return;
      var d = e.data;
      if (!d || d.px !== "duo1-enter" || !d.url) return;
      out.lastCode = d.room;
      out.codeSeenAt = Date.now();
      if (ENTER_MODE === "tab") {
        out.windowOpen = window.open(d.url, "duo1_" + d.room);
        if (!out.windowOpen) note("新标签被浏览器拦了 —— 需要用户手势，或改用 ENTER_MODE=iframe");
        return;
      }
      open(d.url, "躲猫猫 · 3D 逸夫楼");     // iframe 模式：同一个抽屉里换成游戏
    }, false);

    /* 房主点了"结束本局"或玩家自己退回：iframe 里游戏页关掉时回到大厅页。 */
    out.backToLobby = function () {
      out.lastCode = null;
      open(LOBBY_URL + "?v=" + Date.now(), "躲猫猫 · 房间大厅");
    };

    out.status = "mounted";
    if (window.console) console.log("[duo1-bridge] 公告栏已挂上：", BOARD.room, BOARD.x + "," + BOARD.y,
                                    "提示：" + BOARD.tip);
  } catch (err) {
    out.status = "no-mounted";
    out.error = String(err && err.message || err);
    note(out.error);
  }
})();
