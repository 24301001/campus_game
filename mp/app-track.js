/* =============================================================================
   app-track.js —— 小应用日活埋点（2026-11-04，配合管理后台）
   -----------------------------------------------------------------------------
   地图里所有"内嵌小应用"都走同一个抽屉：#ctrP 里那张 #ctrF iframe。
   谁开哪个应用，看的就是 iframe 的 src：
       /agent      → 算法哥（计算机中心）
       /xbg/       → 学霸姐（逸夫楼刷题平台）
       /cmr/       → 食堂阿姨（学生一食堂）
       /ld/        → 保安老丁（保卫处）
       /game/duo1/ → 躲猫猫（逸夫楼公告栏）
   所以这里**完全不改地图主体**：挂一个 MutationObserver 盯着 src 的变化，
   变了就往 /api/mp/app/open 打一枪。后台按"当天 + 用户"去重算日活，
   同一天开十次也只算一个人。

   ⚠️ 三条纪律：
     1. 任何异常都自己吞掉 —— 埋点绝不能影响玩家开应用；
     2. 同一个应用 30 秒内只报一次（抽屉关了又开、来回切不灌水）；
     3. 没登录（没有 mpToken）就不报，服务端也会再挡一次。
   ========================================================================== */
(function () {
  "use strict";

  // 顺序有讲究：先长后短，否则 "/xbg" 会把 "/xbg/xxx" 抢走（这里两者同一个键，无所谓，
  // 但躲猫猫的两种入口必须都列全）。
  var RULES = [
    ["/game/duo1/", "duo1"],
    ["/duo1/", "duo1"],
    ["/xbg/", "xbg"],
    ["/cmr/", "cmr"],
    ["/ld/", "ld"],
    ["/agent", "algogo"],
    ["/algo", "algogo"]
  ];
  var lastSent = { at: 0, app: "" };

  function appOf(src) {
    if (!src || src === "about:blank") return "";
    var path = src;
    try { path = new URL(src, location.href).pathname; } catch (e) { path = String(src).split("?")[0].split("#")[0]; }
    for (var i = 0; i < RULES.length; i++) {
      if (path === RULES[i][0] || path.indexOf(RULES[i][0]) === 0) return RULES[i][1];
    }
    return "";
  }

  function send(app) {
    if (!app) return;
    var now = Date.now();
    if (app === lastSent.app && now - lastSent.at < 30000) return;
    var token = "";
    try { token = localStorage.getItem("mpToken") || ""; } catch (e) { return; }
    if (!token) return;
    lastSent.app = app; lastSent.at = now;
    try {
      fetch("/api/mp/app/open", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
        body: JSON.stringify({ app: app }),
        keepalive: true
      }).catch(function () {});
    } catch (e) {}
  }

  function start() {
    var frame = document.getElementById("ctrF");
    if (!frame) return false;
    var last = frame.getAttribute("src") || "";
    try {
      send(appOf(last));
    } catch (e) {}
    new MutationObserver(function () {
      var src = frame.getAttribute("src") || "";
      if (src === last) return;
      last = src;
      try { send(appOf(src)); } catch (e) {}
    }).observe(frame, { attributes: true, attributeFilter: ["src"] });
    return true;
  }

  // 地图主脚本先跑、抽屉 iframe 后出现，所以等到 DOM 就绪再挂；实在没有就等着。
  function boot() {
    if (start()) return;
    var tries = 0;
    var timer = setInterval(function () {
      if (start() || ++tries > 40) clearInterval(timer);
    }, 500);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  window.MPAppTrack = { appOf: appOf };
})();
