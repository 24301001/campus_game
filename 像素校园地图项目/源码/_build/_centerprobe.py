# -*- coding: utf-8 -*-
"""计算机中心 · 算法哥 · 刷题平台 · **逸夫楼 · 学霸姐** 的端到端探针
（第四十轮 2026-10-01 建，第四十一轮扩到两间房）。

为什么必须单独有一个：accept / verify / zoomtest 三套全几何、全静态；`_edge.py` 只管
"页面活着不抛错 + 玩家能走"。这几件事**一件都不在它们的射程里**：
  ① 一层**登录门**（真的读 / 写 localStorage，且字段名必须与刷题平台对齐）；
  ② **独立的室内场景**（自己的 rAF、自己的按键表、自己的碰撞）—— 第四十一轮起是**两间**；
  ③ **同源 iframe**，且它的 Esc 要被父页接住；
  ④ **一次登录进两边**（平台 + 学霸姐，各自开号各自发 token）。
按 README 的老话，"七套全绿而功能是坏的"在这里同样是**必然**，不是可能。

⚠️⚠️ 本探针**不依赖** campus_game / xueba-ge 真的跑着 —— 它自己起一个**本地静态服务**：
      · `/campus.html` = 新产物（注入了探针）
      · `/base.html`   = 本轮**开工前**那份交付件（`_look/_delivered_r40.html`）
      · `/`            = 一个假的「刷题平台」页面，只用来当 iframe 的落点
      · `/xbg/`        = 一个假的「学霸姐」页面，同上
   为什么非得走 http 而不是像 `_edge.py` 那样 file://：**同源**。
   `file://` 下每个文件是独立源，`iframe.contentDocument` 一碰就抛 SecurityError，
   而"同源能否穿透 iframe"恰恰是本轮 Esc 退出方案的**全部立论**——
   用 file:// 跑等于把要验的东西绕过去了。后端接口则用打桩的 `fetch` 顶替
   （打桩只替掉网络那一层，登录门的**全部逻辑**照跑）。

   ⭐ 这个本地服务还顺手把 C16 变成了**真判据**：页面在 `127.0.0.1:9342` 上，房间 iframe
      写的是相对路径 `/xbg/` ⇒ 落在同一个源，`contentDocument` 拿得到；谁要是把它写成
      `http://127.0.0.1:8010/xbg/`，**端口不同就是跨源**，这里当场抛 SecurityError。
      换句话说：C16 绿 = "在这台探针服务上真的同源"，不是"字符串看着像相对路径"。

它验十八件事（编号与计划书 §6.2 一一对应）：

  C10pre ⭐ 冷启动（无 token）⇒ 登录框**可见**
  C11    ⭐ 填错密码 ⇒ 登录框**不消失**、有错误提示
  C10    ⭐ 填对 ⇒ 登录框消失、`localStorage.token` 非空、`user` 的**四个字段名**
             与 `campus_game/frontend/src/stores/user.js` 的 setUser 完全一致
             （字段名错一个，免登录会"看起来成了"但 admin 进不了管理后台）
  C1     ⭐ 站在南门（离计算机中心 1400+ px）按 F ⇒ `CENTER.active` 仍为 false
  C2     ⭐ 走进外扩圈 ⇒ `#hudctr` 有「按 F」提示；按 F ⇒ 进教室、覆盖层显形
  C3     ⭐⭐ 教室里按住 W 0.7 秒 ⇒ **玩家在地图上的坐标一点没变**（地图被冻结的硬证据）
  C4     ⭐⭐ 同一段时间里 ⇒ **室内自己的人物动了**（而且**不是**因为别的原因）
  C5     ⭐ 按 B ⇒ 退出、覆盖层收起、**玩家回到进门前的坐标**（不许瞬移）
  C6     ⭐⭐ 教室里按 E ⇒ `GUIDE.mode` **不变**、对话框**不开**（按键优先级做对了）
  C7     ⭐⭐ 教室里按 Esc ⇒ 不触发向导那张四档梯子，人也还在教室里
  C8     ⭐ 走到算法哥身边 ⇒ 提示「按 C」；按 C ⇒ 平台 iframe 打开
  C9     ⭐⭐ Esc 打在 **iframe 内部的 document** 上 ⇒ 平台关闭、**人还在教室里**

  ---- 以下 C12~C18 是第四十一轮（逸夫楼 / 学霸姐）新增 ----

  C12    ⭐ 走到逸夫楼圈内 ⇒ `#hudctr` ==「按 F 进入逸夫楼」（**不是**计算机中心那句）；
             按 F ⇒ `CENTER.room.key === "yifu"`、覆盖层显形
  C13    ⭐⭐ 逸夫楼里按住 W 0.7 秒 ⇒ **地图玩家坐标一点没变**（C3 换房间的同款 ——
             引擎泛化后这条最可能悄悄坏：碰撞表还读着计算机中心那张）
  C14    ⭐ 按 B ⇒ 退出、**回到进门前的坐标**
  C15    ⭐ 走到学霸姐身边 ⇒ 提示「按 C」；按 C ⇒ `ctrF` 的 src **正好是 `/xbg/`**
  C16    ⭐⭐⭐ 那个 iframe 的 `contentDocument` **拿得到**（真同源）+ Esc 打在它内部
             ⇒ 关闭、人还在逸夫楼。写成绝对地址（带 `:8010`）这条必红
  C17    ⭐⭐ 打桩的 `fetch` 收到过 `/xbg/api/login`，且 `localStorage.xbg_token` 非空
             —— "一次登录进两边"的端到端证据
  C18    ⭐⭐ **两间房的碰撞表自检**（4px 网格 + BFS）：出生点可站、可站格子全连通
             （无孤岛）、且能从出生点走到 NPC 的 `talkR` 内。`accept.py` 的穿墙压力
             与卡死点**只扫地图**，室内是全新的碰撞表，那边一条都盖不到

  ---- 以下是第四十一轮**补丁**新增（用户实测撞出来的），第 3 / 4 遍跑 ----

  C19    ⭐⭐⭐ **已登录的老用户开机**：先按 `doLogin` 的写法往 localStorage 种一遍
             （token + user + xbg_cred，**没有** xbg_token），**真刷新**，再看
             刷新后 `xbg_token` 有没有被补上。第 3 遍跑本轮产物（应绿），
             第 4 遍跑**上一版已交付的那份**（应红 —— 负对照，证明判据是活的）。
         ⚠️ 为什么非要单独一遍：这一轮那个 bug（「为啥给学霸姐对话需要我自己再登录」）
            的形状是"**从第二次打开起的所有人**"都走这条路 —— 地图的 token 是长期
            的，早就躺在 localStorage 里了。而上面 C0~C18 那一遍的 localStorage 是
            **干净的**、走的是首次登录 ⇒ 那个 bug 在那条路上**根本不存在**。
            五套自动验收全绿、人一坐下去就撞上，就是这么来的。

外加一条**跨产物**的硬判据（在 Python 侧比，不在页面里）：

  HASH  ⭐⭐⭐ 拿新产物与 r40 那份**逐字节比** `charSprite` / `guideSprite` 的
        全部四向 × 三相位渲染结果。这是"改动了**三个人共用**的函数（`buildChar`）"的
        风险敞口 —— 静态断言只能证明"`if (C.glasses)` 在文件里"，证明不了
        "玩家和小北的像素真的一格没动"。**这条是唯一能证明后者的。**
        ⭐ 第四十一轮起再加 `HASH.xbj`：基线里**没有**（`absent`）、产物里**有**。

⚠️ 判读口径：
    · C3/C4 与 C13 必须**真跑够 0.7 秒**再断言。室内是**独立 rAF**，只推一帧就判"没动"
      是**假绿**（三十七轮 ㊵㊶ 那条教训的同族）。C4 是 C3 的**对照**：
      两条必须一起看 —— 只有"地图没动 + 室内也没动"才是真失败，
      只有"室内动了"才能证明 C3 的"没动"不是因为按键根本没送到。
      ⚠️ C13 **没有**同款对照（逸夫楼自己动不动这条不判），因为"进没进去"由 C12 兜着，
         而"按键送到了没有"由**前一间房**的 C4 证明过了（同一个 CKEYS、同一个 rAF）。
    · C6/C7 的判据是 `GUIDE.mode` **不变**，不是"面板没开"。向导在**加载期**就可能
      因为别的原因改 mode；用"不变"当判据才不会被无关状态污染。
    · C9/C16 必须先报 `err=`：如果 `contentDocument` 抛了 SecurityError，那
      "平台没关"就不是逻辑错，而是**根本没能同源** —— 两码事，不能混。
"""
import functools, http.server, io, json, os, shutil, socketserver, subprocess, threading, time, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
SRC = os.path.join(ROOT, '像素校园_全校地图.html')
BASE = os.path.join(HERE, '_look', '_delivered_r40.html')
SERVE = os.path.join(HERE, '_ctrprobe_www')        # 名字要独特：收尾按它筛进程
PROF_A = os.path.join(HERE, '_ctrprobe_pa')
PROF_B = os.path.join(HERE, '_ctrprobe_pb')
# C19 两遍各用**独立 profile**：它们要往 localStorage 里种东西。
# ⚠️ 共用 profile 的话第一遍种下的 `_cp_seeded` 会让第二遍直接跳到"已是老用户"，
#    于是**负对照那一遍也会"通过"** —— 判据当场失效，而且看不出任何异常。
PROF_C = os.path.join(HERE, '_ctrprobe_pc')
PROF_D = os.path.join(HERE, '_ctrprobe_pd')
# 上一版（第四十一轮已交付、只把 xbgSync 挂在 doLogin 上的那份）—— C19 的**负对照**。
# ⚠️ 必须留着：一条判据只有在"已知有 bug 的那份产物上真变红"才叫判据，
#    否则它可能只是一条永远绿的装饰。
BROKEN = os.path.join(HERE, '_look', '_delivered_r41_broken.html')
PORT = 9342
CDP = 9343
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
MAXTICKS = 320                                     # 320 × 0.5s = 160s 上限

FAKE = u"""<!doctype html><html lang="zh-CN"><head><meta charset="utf-8">
<title>刷题平台（探针替身）</title></head><body>
<h1>FAKE JUDGE</h1><p>探针用的替身页面，只为了让 iframe 有个同源落点。</p>
</body></html>
"""

# ⭐ 学霸姐的替身也要有，而且**必须放在 `xbg/` 子目录下**（服务出去就是 `/xbg/`）。
#    理由：C16 判的是 `ctrF.contentDocument` **拿不拿得到**。页面在 127.0.0.1:9342 上，
#    房间 iframe 写相对路径 `/xbg/` ⇒ 落在同一个源，拿得到；谁把它写成绝对地址
#    （带 `:8010`），**端口不同就是跨源**，这里当场抛 SecurityError。所以这个替身页
#    一旦缺失（404），C16 就退化成"没测出东西"而不是"测出同源"——必须有。
FAKE_XBG = u"""<!doctype html><html lang="zh-CN"><head><meta charset="utf-8">
<title>学霸姐（探针替身）</title></head><body>
<h1>FAKE XBG</h1><p>探针用的替身页面，只为了让逸夫楼那个 iframe 有个同源落点。</p>
</body></html>
"""

# ⚠️⚠️ **抢先段**：只装 fetch 桩，紧跟 `<body>` 插进去 —— 比第一个 app 脚本还早。
#    为什么非要抢：室内段那条 `setTimeout(…, 0)` 实测**在解析期就跑掉了**
#    （服务端日志有 `POST /xbg/api/login 501`，而挂在末尾的探针 `FETCHED` 是空的）。
#    C19 判的正是那条路，桩晚一步 ⇒ 判据恒红，而且红得看不出是桩的锅。
#    ⭐ 桩的路由逻辑**只此一份**（就是这里），`PROBE` 那边只从 `window.__PF` 取，
#      不再抄第二份 —— 两份会漂。
EARLY = r"""
<script>
(function(){
  var F = [];
  function ok(j){ return Promise.resolve({ ok: true, status: 200,
    json: function(){ return Promise.resolve(j); } }); }
  function probeFetch(url, opt){
    var u = String(url);
    F.push(u);
    if (u.indexOf('/api/agent/status') >= 0)
      return ok({ code: 200, data: { up: true } });
    if (u.indexOf('/api/auth/login') >= 0){
      var b = {};
      try { b = JSON.parse((opt && opt.body) || '{}'); } catch (e) {}
      if (b.username === 'admin' && b.password === 'admin123')
        return ok({ code: 200, message: 'ok',
          data: { token: 'probe-token-0123456789', userId: 7, username: 'admin',
                  nickname: '管理员', role: 'ADMIN' } });
      return ok({ code: 401, message: '用户名或密码错误' });
    }
    /* ---- 学霸姐那三条。⚠️ 登录与注册**都发 token**：这样 `xbgSync` 走的是
            "ok" 那条路（第 ① 次 login 就成），HUD 尾巴不会冒出来 —— C10 的
            `huduser` 才能与 r40 逐字相同。注册那条留着是为了**万一** login 先
            收到 401 时链路仍能走通，不至于让 C17/C19 变成假红。 */
    if (u.indexOf('/xbg/api/health') >= 0)
      return ok({ code: 200, data: { up: true } });
    if (u.indexOf('/xbg/api/login') >= 0 || u.indexOf('/xbg/api/register') >= 0)
      return ok({ code: 200, message: 'ok', token: 'probe-xbg-token-abcdef',
        nick: 'admin' });
    if (u.indexOf('/xbg/api/logout') >= 0)
      return ok({ code: 200 });
    return Promise.resolve({ ok: false, status: 404,
      json: function(){ return Promise.resolve({}); } });
  }
  window.__PF = { fetched: F, fetch: probeFetch };
  window.fetch = probeFetch;
})();
</script>
"""

PROBE = r"""
<script>
(function(){
  var R = [];
  function note(k, v){ R.push(k + '=' + v); }
  function flush(){ document.title = 'CP|' + R.join(' | '); }
  window.onerror = function(m, u, l, c){ note('ERR@' + l + ':' + c, m); flush(); return false; };

  var MODE = (location.pathname.indexOf('base.html') >= 0) ? 'base'
           : (location.pathname.indexOf('xbgret') >= 0) ? 'ret' : 'full';

  /* 真事件，走真实监听链 —— 不直接调内部函数 */
  function key(k, tgt){
    (tgt || window).dispatchEvent(new KeyboardEvent('keydown',
      { key: k, code: k, bubbles: true, cancelable: true }));
  }
  function keyUp(k){
    window.dispatchEvent(new KeyboardEvent('keyup',
      { key: k, code: k, bubbles: true, cancelable: true }));
  }
  function hid(el){ return !!(el && el.hidden); }
  function d2(x, y, a, b){ return Math.hypot(x - a, y - b); }

  /* ---- 把 EARLY 抢先装好的 fetch 桩接过来 ----
     ⚠️⚠️ **桩不能装在这个位置**。它原本在这儿，C17 一直是绿的；但它同时是 C19 的
        命根子，而 C19 要照的那条路（`xbgBootSync` 老用户开机）实测**在解析期就跑掉了**：
        服务端日志里清清楚楚 `POST /xbg/api/login 501`，而这里的 `FETCHED` 是空的 ——
        探针挂在 `</body>`，桩到那一刻才装，**来不及**。
        于是桩整体挪到了文档最前面（`EARLY`，紧跟 `<body>`，比第一个 app 脚本还早）。
        ⭐ 路由逻辑与 `ok()` **只此一份**，就在 EARLY 里；这里**不许再抄一份**
           —— 两份会漂，而漂了只有 C17/C19 变红才看得出来，别给自己埋雷。 */
  if (!window.__PF) throw new Error('EARLY 段没插进页面 —— fetch 桩不在，C17/C19 无意义');
  var FETCHED = window.__PF.fetched;      /* 打桩收到过的 URL，C17 / C19 靠它 */

  /* ---- 精灵指纹：把一张 18×30 画布的**每个字节**折成一个数 ----
     这是"眼镜钩子有没有动到玩家/小北"的唯一硬证据。 */
  function hashOf(c){
    if (!c || !c.width) return '-';
    var g = c.getContext('2d');
    var d = g.getImageData(0, 0, c.width, c.height).data;
    var h = 2166136261 >>> 0;
    for (var i = 0; i < d.length; i++){ h ^= d[i]; h = ((h * 16777619) >>> 0); }
    return (h >>> 0).toString(16) + ':' + c.width + 'x' + c.height;
  }
  var DIRS = ['down', 'left', 'up', 'right'], STS = [0, 3, 4];
  function sigOf(fn){
    var out = [];
    for (var i = 0; i < DIRS.length; i++)
      for (var j = 0; j < STS.length; j++){
        try { out.push(DIRS[i] + STS[j] + '=' + hashOf(fn(DIRS[i], STS[j]))); }
        catch (e) { out.push(DIRS[i] + STS[j] + '=ERR'); }
      }
    return out.join(',');
  }
  function hashSprites(){
    note('HASH.char',  sigOf(charSprite));
    note('HASH.guide', sigOf(guideSprite));
    if (typeof alguySprite === 'function') note('HASH.alg', sigOf(alguySprite));
    else note('HASH.alg', 'absent');
    /* 学霸姐：r40 基线里**没有**（`xuebajieSprite` 未定义 ⇒ 走 ReferenceError），
       产物里**有**。⚠️ 用 `typeof` 探，别直接引用 —— 基线里直接写 `xuebajieSprite`
       会抛 ReferenceError，而这里没包 try ⇒ 整个 hashSprites 挂掉、
       HASH.char / HASH.guide 也跟着变成 '<缺>'，三条判据一起假红。 */
    if (typeof xuebajieSprite === 'function') note('HASH.xbj', sigOf(xuebajieSprite));
    else note('HASH.xbj', 'absent');
  }

  /* ================= 只验精灵的主模式（跑在 r40 基线产物上）================= */
  if (MODE === 'base'){
    try { hashSprites(); } catch (e) { note('BASETHROW', e.message); }
    note('DONE', '1'); flush();
    return;
  }

  /* ========== C19：只验「已登录的老用户开机」这一条路 ==========
     ⚠️⚠️ 这页跟 campus.html 是**同一份产物**，差的只有一件事：
        第一次进来先按 `doLogin` 的写法往 localStorage 里种一遍，然后**真刷新**。
        刷新后跑的才是老用户的启动路径 —— `loginGate()` 见到 token 就把登录门
        `hidden = true` 直接返回，**`doLogin` 根本不会被调用**。

     ⭐ 用户的实测 bug 就在这条路上：原话「为啥给学霸姐对话需要我自己再登录」。
        形状是"**从第二次打开起的所有人**"都走这里 —— 地图那个 token 是长期的，
        客户端的 localStorage 里早就有了（而且是**学霸姐存在之前**登的）。
        而 campus.html 那一遍 localStorage 是干净的、走的是首次登录 ⇒ 永远照不到。
        ⚠️ 补这一遍不是"多测一点"，是**这一轮唯一能照到那个 bug 的灯**：
           静态断言只能钉住"`xbgBootSync` 被定义了、也接进了 setTimeout"，
           钉不住"它真会写 xbg_token"。 */
  if (MODE === 'ret'){
    var seeded = '';
    try { seeded = localStorage.getItem('_cp_seeded') || ''; } catch (e) {}
    if (!seeded){
      try {
        localStorage.setItem('token', 'probe-old-session-token');
        localStorage.setItem('user', JSON.stringify(
          { id: 7, username: 'admin', nickname: '管理员', role: 'ADMIN' }));
        /* 凭据**照 `xbgCredSave` 的写法**种（encodeURIComponent + \n）。
           这里图省事写成别的形状 ⇒ 补同步读不出来，C19 会假红。 */
        localStorage.setItem('xbg_cred',
          encodeURIComponent('admin') + '\n' + encodeURIComponent('admin123'));
        localStorage.removeItem('xbg_token');
        localStorage.setItem('_cp_seeded', '1');
      } catch (e) {}
      location.reload();          /* ← 真刷新。种完不刷新，等于自己把这页测成首访 */
      return;
    }
    setTimeout(function(){
      note('C19gateHidden', hid(loginEl));     /* 登录门该被跳过 —— 老用户的常态 */
      /* 反面证据：这一遍**不该**发生平台登录（登录门没弹，`doLogin` 没跑） */
      note('C19loginCalled', FETCHED.some(function(u){ return u.indexOf('/api/auth/login') >= 0; }));
      /* 正面证据两条：补同步真打出去了、票真落进 localStorage 了 */
      note('C19sawXbgLogin', FETCHED.some(function(u){ return u.indexOf('/xbg/api/login') >= 0; }));
      var xt = '';
      try { xt = localStorage.getItem('xbg_token') || ''; } catch (e) {}
      note('C19xbgTokenLen', xt.length);
      note('C19centerXbg', JSON.stringify(CENTER ? CENTER.xbg : '?'));
      note('C19hud', JSON.stringify(hudUser ? hudUser.textContent : ''));
      note('DONE', '1'); flush();
    }, 2500);
    return;
  }

  /* ================= 全量模式 ================= */
  var S = { ph: 0, mark: 0, px: 0, py: 0, ix: 0, iy: 0, gmode: '' };
  var STUCK_MSG = '', STUCK_N = 0;
  function wait(ms){ return Date.now() - S.mark >= ms; }

  function run(){
    switch (S.ph) {

    /* ---------- C0 环境 + 精灵指纹 ---------- */
    case 0:
      hashSprites();
      note('C0', 'rect=' + (CTR_RECT ? ((CTR_RECT.x | 0) + ',' + (CTR_RECT.y | 0)
            + ',' + (CTR_RECT.w | 0) + ',' + (CTR_RECT.h | 0)) : 'NULL')
        + ' algOK=' + (typeof alguySprite === 'function'));
      S.ph = 1; S.mark = Date.now(); break;

    /* ---------- C10pre 冷启动：登录框该是可见的 ---------- */
    case 1:
      if (!wait(500)) break;
      note('C10pre', 'boxVisible=' + (loginEl.hidden === false)
        + ' token=' + JSON.stringify(localStorage.getItem('token')));
      /* ---------- C11 错密码 ---------- */
      lgU.value = 'admin'; lgP.value = 'wrong-one'; lgGo.click();
      S.ph = 2; S.mark = Date.now(); break;

    case 2:
      if (!wait(600)) break;
      note('C11', 'boxStillVisible=' + (loginEl.hidden === false)
        + ' msg=' + JSON.stringify(lgMsg ? lgMsg.textContent : ''));
      /* ---------- C10 对密码 ---------- */
      lgU.value = 'admin'; lgP.value = 'admin123'; lgGo.click();
      S.ph = 3; S.mark = Date.now(); break;

    case 3: {
      if (!wait(700)) break;
      var u = null;
      try { u = JSON.parse(localStorage.getItem('user') || 'null'); } catch (e) {}
      note('C10', 'boxHidden=' + (loginEl.hidden === true)
        + ' token=' + JSON.stringify((localStorage.getItem('token') || '').slice(0, 11))
        + ' user=' + JSON.stringify(u)
        + ' huduser=' + JSON.stringify(hudUser ? hudUser.textContent : ''));
      /* ---------- C1 远处按 F ---------- */
      player.x = SPAWN.x; player.y = SPAWN.y;
      S.ph = 4; S.mark = Date.now(); break;
    }

    case 4:
      if (!wait(300)) break;
      key('f');
      S.ph = 5; S.mark = Date.now(); break;

    case 5:
      if (!wait(400)) break;
      note('C1', 'farFromBuilding=' + d2(player.x, player.y, CTR_RECT.x, CTR_RECT.y).toFixed(0)
        + ' active=' + CENTER.active
        + ' hudctr=' + JSON.stringify(hudCtr ? hudCtr.textContent : ''));
      /* ---------- C2 走进外扩圈 ---------- */
      player.x = CTR_RECT.x + CTR_RECT.w / 2;
      player.y = CTR_RECT.y + CTR_RECT.h + 40;
      S.ph = 6; S.mark = Date.now(); break;

    case 6:
      if (!wait(400)) break;
      note('C2pre', 'hudctr=' + JSON.stringify(hudCtr ? hudCtr.textContent : ''));
      key('f');
      S.ph = 7; S.mark = Date.now(); break;

    case 7:
      if (!wait(450)) break;
      note('C2', 'active=' + CENTER.active
        + ' overlayShown=' + (ctrCv.hidden === false)
        + ' bodyCls=' + document.body.classList.contains('ctr-on')
        + ' mapPos=' + (player.x | 0) + ',' + (player.y | 0));
      S.px = player.x; S.py = player.y;
      S.ix = CENTER.x; S.iy = CENTER.y;
      /* ---------- C3/C4 按住 W 0.7s ---------- */
      key('w');
      S.ph = 8; S.mark = Date.now(); break;

    case 8:
      if (!wait(700)) break;
      keyUp('w');
      note('C3', 'mapMoved=' + d2(player.x, player.y, S.px, S.py).toFixed(4) + '(应=0)'
        + ' mapkeys_empty=' + (function(){ var n = 0;
            try { for (var k in keys) if (keys[k]) n++; } catch (e) { return 'ERR'; }
            return n; })());
      note('C4', 'roomMoved=' + d2(CENTER.x, CENTER.y, S.ix, S.iy).toFixed(1)
        + ' dir=' + CENTER.dir + ' step=' + CENTER.step);
      /* ---------- C5 按 B 出门 ---------- */
      key('b');
      S.ph = 9; S.mark = Date.now(); break;

    case 9:
      if (!wait(450)) break;
      note('C5', 'active=' + CENTER.active
        + ' overlayHidden=' + (ctrCv.hidden === true)
        + ' backToEntry=' + (d2(player.x, player.y, S.px, S.py) < 1e-6)
        + ' mapPos=' + (player.x | 0) + ',' + (player.y | 0));
      /* ---------- C6 再进去 + 按 E ---------- */
      key('f');
      S.ph = 10; S.mark = Date.now(); break;

    case 10:
      if (!wait(450)) break;
      S.gmode = GUIDE.mode;
      note('C6pre', 'in=' + CENTER.active + ' gmode=' + GUIDE.mode
        + ' dlg=' + (hid(guideDlg) ? 'HIDDEN' : 'SHOWN'));
      key('e');
      S.ph = 11; S.mark = Date.now(); break;

    case 11:
      if (!wait(600)) break;
      note('C6', 'gmode=' + GUIDE.mode + ' unchanged=' + (GUIDE.mode === S.gmode)
        + ' dlg=' + (hid(guideDlg) ? 'HIDDEN' : 'SHOWN')
        + ' tip=' + JSON.stringify(guideTip ? guideTip.textContent : ''));
      /* ---------- C7 室内按 Esc ---------- */
      key('Escape');
      S.ph = 12; S.mark = Date.now(); break;

    case 12:
      if (!wait(600)) break;
      note('C7', 'gmode=' + GUIDE.mode + ' unchanged=' + (GUIDE.mode === S.gmode)
        + ' dlg=' + (hid(guideDlg) ? 'HIDDEN' : 'SHOWN')
        + ' stillInRoom=' + CENTER.active
        + ' toast=' + JSON.stringify(guideToastEl ? guideToastEl.textContent : ''));
      /* ---------- C8 走到算法哥身边 ---------- */
      CENTER.x = CTR_ALG.x; CENTER.y = CTR_ALG.y + 44;
      S.ph = 13; S.mark = Date.now(); break;

    case 13:
      if (!wait(450)) break;
      note('C8pre', 'near=' + CENTER.nearNpc
        + ' tip=' + JSON.stringify(ctrTipEl ? ctrTipEl.textContent : ''));
      key('c');
      S.ph = 14; S.mark = Date.now(); break;

    case 14:
      if (!wait(900)) break;
      note('C8', 'platShown=' + (ctrP.hidden === false)
        + ' CENTER.plat=' + CENTER.plat
        + ' src=' + JSON.stringify(ctrF ? (ctrF.getAttribute('src') || '') : ''));
      S.ph = 15; S.mark = Date.now(); break;

    /* ---------- C9 Esc 打在 iframe 内部 ---------- */
    case 15: {
      if (!wait(1000)) break;
      var ok = false, err = '';
      try {
        var d = ctrF.contentDocument;
        if (!d) { err = 'no-document'; }
        else {
          ok = true;
          d.dispatchEvent(new KeyboardEvent('keydown',
            { key: 'Escape', code: 'Escape', bubbles: true, cancelable: true }));
        }
      } catch (e) { err = e.name + ': ' + e.message; }
      note('C9pre', 'sameOriginReached=' + ok + ' err=' + (err || 'none')
        + ' innerTitle=' + (function(){ try { return ctrF.contentDocument.title; }
                                        catch (e) { return '?'; } })());
      S.ph = 16; S.mark = Date.now(); break;
    }

    case 16:
      if (!wait(450)) break;
      note('C9', 'platClosed=' + (ctrP.hidden === true) + ' plat=' + CENTER.plat
        + ' stillInRoom=' + CENTER.active);
      /* ⚠️⚠️ 必须先**出门**再去逸夫楼。此刻 `CENTER.active` 还是 true（Esc 只关平台，
         **人还在屋里**），而地图上那句「按 F」提示的起搏器是这么写的：
             if (!CENTER.active && hudCtr) { …写 hudCtr.textContent… }
         人在屋里时它**根本不动**，`roomEnter()` 又早把 hudCtr 清成了空串 ——
         于是不先按 B 就直接瞬移到逸夫楼，读到的永远是空串，C12 当场假红。
         栽过一次（报的 `C12pre=hudctr="" roomAt=yifu` 就是这么来的）。 */
      key('b');
      S.ph = 17; S.mark = Date.now(); break;

    case 17:
      if (!wait(450)) break;
      var YFR = ROOMS.yifu.rect;
      note('C12set', 'outOfRoom=' + (CENTER.active === false)
        + ' yfRect=' + (YFR ? ((YFR.x | 0) + ',' + (YFR.y | 0) + ','
                              + (YFR.w | 0) + ',' + (YFR.h | 0)) : 'NULL'));
      /* ---------- C12 走到逸夫楼外圈 ---------- */
      player.x = YFR.x + YFR.w / 2;
      player.y = YFR.y + YFR.h + 40;
      S.ph = 18; S.mark = Date.now(); break;

    case 18:
      if (!wait(400)) break;
      note('C12pre', 'hudctr=' + JSON.stringify(hudCtr ? hudCtr.textContent : '')
        /* ⚠️ 两栋楼的判定圈**会重叠**（都是外扩 90 px，两楼中心只差两百来 px）。
           `roomAt()` 按 ROOMS 的插入顺序取第一个命中的 ⇒ 站错地方会拿到"计算机中心"。
           所以这里把 `roomAt()` 的答案一并报出来：C12pre 若显示 center，
           那是**落点选错了**，不是房间表坏了 —— 两码事，别混。 */
        + ' roomAt=' + (function(){ try { var r = roomAt(); return r ? r.key : 'null'; }
                                    catch (e) { return 'ERR:' + e.message; } })());
      key('f');
      S.ph = 19; S.mark = Date.now(); break;

    case 19:
      if (!wait(450)) break;
      note('C12', 'active=' + CENTER.active
        + ' roomKey=' + (CENTER.room ? CENTER.room.key : 'null')
        + ' overlayShown=' + (ctrCv.hidden === false)
        + ' hudName=' + JSON.stringify(ctrHudName ? ctrHudName.textContent : '')
        + ' mapPos=' + (player.x | 0) + ',' + (player.y | 0));
      S.px = player.x; S.py = player.y;
      S.ix = CENTER.x; S.iy = CENTER.y;
      /* ---------- C13 逸夫楼里按住 W 0.7s ---------- */
      key('w');
      S.ph = 20; S.mark = Date.now(); break;

    case 20:
      if (!wait(700)) break;
      keyUp('w');
      note('C13', 'mapMoved=' + d2(player.x, player.y, S.px, S.py).toFixed(4) + '(应=0)'
        + ' roomMoved=' + d2(CENTER.x, CENTER.y, S.ix, S.iy).toFixed(1)
        + ' dir=' + CENTER.dir + ' step=' + CENTER.step);
      /* ---------- C14 按 B 出门 ---------- */
      key('b');
      S.ph = 21; S.mark = Date.now(); break;

    case 21:
      if (!wait(450)) break;
      note('C14', 'active=' + CENTER.active
        + ' overlayHidden=' + (ctrCv.hidden === true)
        + ' backToEntry=' + (d2(player.x, player.y, S.px, S.py) < 1e-6)
        + ' mapPos=' + (player.x | 0) + ',' + (player.y | 0));
      /* ---------- C15 再进去 + 走到学霸姐身边 ---------- */
      key('f');
      S.ph = 22; S.mark = Date.now(); break;

    case 22:
      if (!wait(450)) break;
      var YN = ROOMS.yifu.npc;
      note('C15set', 'in=' + CENTER.active + ' yfNpc=' + YN.x + ',' + YN.y);
      CENTER.x = YN.x; CENTER.y = YN.y + 44;
      S.ph = 23; S.mark = Date.now(); break;

    case 23:
      if (!wait(450)) break;
      note('C15pre', 'near=' + CENTER.nearNpc
        + ' tip=' + JSON.stringify(ctrTipEl ? ctrTipEl.textContent : ''));
      key('c');
      S.ph = 24; S.mark = Date.now(); break;

    /* ---------- C15/C16 逸夫楼的 iframe ---------- */
    case 24: {
      if (!wait(1200)) break;
      note('C15', 'platShown=' + (ctrP.hidden === false)
        + ' srcAttr=' + JSON.stringify(ctrF ? (ctrF.getAttribute('src') || '') : '')
        + ' srcProp=' + (function(){ try { return String(ctrF.src).replace(location.origin, ''); }
                                     catch (e) { return 'ERR'; } })());
      /* ⭐ C16 不是字符串判据 —— 是**真的去拿 contentDocument**。
         页面在 127.0.0.1:9342 上；相对路径 `/xbg/` 落在同一个源 ⇒ 拿得到。
         谁写成 `http://127.0.0.1:8010/xbg/`（端口不同 = 跨源）⇒ 这里当场抛
         SecurityError，`relativeToSlash` 与 `sameOrigin` 一起变红。 */
      var so = false, err = '', ttl = '?';
      try {
        var dd = ctrF.contentDocument;
        if (!dd) { err = 'no-document'; }
        else { so = true; ttl = dd.title;
               dd.dispatchEvent(new KeyboardEvent('keydown',
                 { key: 'Escape', code: 'Escape', bubbles: true, cancelable: true })); }
      } catch (e) { err = e.name + ': ' + e.message; }
      note('C16pre', 'relativeToSlash=' + (String(ctrF.getAttribute('src') || '')
              .charAt(0) === '/')
        + ' sameOrigin=' + so + ' err=' + (err || 'none') + ' innerTitle=' + ttl);
      S.ph = 25; S.mark = Date.now(); break;
    }

    case 25:
      if (!wait(450)) break;
      note('C16', 'platClosed=' + (ctrP.hidden === true) + ' plat=' + CENTER.plat
        + ' stillInRoom=' + CENTER.active
        + ' roomKey=' + (CENTER.room ? CENTER.room.key : 'null'));
      /* ---------- C17 一次登录进两边 ---------- */
      var hit = false;
      for (var i = 0; i < FETCHED.length; i++)
        if (FETCHED[i].indexOf('/xbg/api/login') >= 0) hit = true;
      var xt = '';
      try { xt = localStorage.getItem('xbg_token') || ''; } catch (e) {}
      note('C17', 'sawXbgLogin=' + hit
        + ' xbgToken=' + JSON.stringify(xt.slice(0, 12))
        + ' xbgTokenLen=' + xt.length
        + ' CENTER.xbg=' + JSON.stringify(CENTER.xbg));
      /* ---------- C18 两间房的碰撞表自检 ---------- */
      note('C18.center', gridScan(ROOMS.center));
      note('C18.yifu',   gridScan(ROOMS.yifu));
      S.ph = 99; break;
    }
  }

  /* ---- 碰撞表自检：4px 网格采样 + BFS ----
     `accept.py` 的穿墙压力与卡死点**只扫地图**（`solids`），室内是**各自一张全新的
     碰撞表**（`ROOMS.*.solid`，而且**故意不并进 `solids`** —— 并进去会重掷全校园散射，
     见 `_propdiff.py`），那边一条都盖不到。这里补上。
       ① 出生点自身可站（否则一进门就被卡住）
       ② 可站格子**全连通**（有孤岛 ⇒ 走不到的角落，视觉上像"这里有路其实是墙"）
       ③ BFS 到的最近点能进 NPC 的 `talkR`（否则"按 C 说话"永远触发不了）
     ⚠️ 用 4 邻域不用 8 邻域：8 邻域能从格子**对角缝**里钻过去，会把真孤岛报成连通。 */
  function gridScan(R){
    var G = 4, keys = {}, tot = 0, x, y;
    for (x = 0; x <= CTR_W; x += G) for (y = 0; y <= CTR_H; y += G)
      if (roomFree(R, x, y)) { keys[x + ',' + y] = 1; tot++; }
    var sx = Math.round(R.spawn.x / G) * G, sy = Math.round(R.spawn.y / G) * G;
    var k0 = sx + ',' + sy;
    if (!keys[k0]) return 'spawnNotStandable(' + sx + ',' + sy + ') standable=' + tot;
    var seen = {}, q = [k0], n = 0, best = 1e9;
    seen[k0] = 1;
    while (q.length){
      var c = q.pop(); n++;
      var p = c.split(','), cx = +p[0], cy = +p[1];
      var dd2 = Math.hypot(cx - R.npc.x, cy - R.npc.y);
      if (dd2 < best) best = dd2;
      var NB = [[G, 0], [-G, 0], [0, G], [0, -G]];
      for (var i = 0; i < 4; i++){
        var nx2 = cx + NB[i][0], ny2 = cy + NB[i][1], kk = nx2 + ',' + ny2;
        if (keys[kk] && !seen[kk]) { seen[kk] = 1; q.push(kk); }
      }
    }
    return 'standable=' + tot + ' reach=' + n
      + ' connected=' + (n === tot) + ' islands=' + (tot - n)
      + ' minDistToNpc=' + (best === 1e9 ? 'unreachable' : best.toFixed(1))
      + ' talkR=' + R.npc.talkR + ' canTalk=' + (best < R.npc.talkR);
  }

  /* ⚠️ 卡住自毁：某一相里抛异常时，相位号**不会推进** ⇒ 每 150ms 追加一条一模一样的
     THROW，标题无限膨胀、永远到不了 DONE，整个探针挂到 MAXTICKS（160 秒）才收场，
     而输出里那几百条重复行会把真正的错埋掉。同一个相位连抛 3 次就直接收工。 */
  var T = setInterval(function(){
    if (S.ph >= 99) { clearInterval(T); note('DONE', '1'); flush(); return; }
    try { run(); }
    catch (e) {
      note('THROW', 'ph' + S.ph + ' ' + e.message);
      if (e.message.indexOf(STUCK_MSG) < 0) STUCK_MSG = e.message;
      if (e.message === STUCK_MSG) STUCK_N++;
      else { STUCK_MSG = e.message; STUCK_N = 1; }
      if (STUCK_N >= 3) { clearInterval(T); note('STUCK', 'ph' + S.ph); note('DONE', '1');
                          flush(); return; }
    }
    flush();
  }, 150);
})();
</script>
"""


def read_title(chrome_port):
    try:
        data = json.load(urllib.request.urlopen('http://127.0.0.1:%d/json' % chrome_port, timeout=5))
    except Exception as e:
        return '<CDP 连不上: %s>' % e
    for t in reversed(data):
        u = t.get('url', '')
        if t.get('type') == 'page' and ('campus.html' in u or 'base.html' in u
                                        or 'xbgret' in u):
            return t.get('title', '')
    return '<没有页面>'


def kill_profile(tag):
    ps = ("Get-CimInstance Win32_Process -Filter \"Name='chrome.exe'\" | "
          "Where-Object { $_.CommandLine -like '*%s*' } | "
          "ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }" % tag)
    subprocess.run(['powershell', '-NoProfile', '-Command', ps], capture_output=True)


def run_page(url, prof, tag, port):
    kill_profile(tag)
    shutil.rmtree(prof, ignore_errors=True)
    args = [CHROME, '--no-sandbox', '--no-first-run', '--no-default-browser-check',
            '--headless=new', '--disable-gpu',
            '--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-renderer-backgrounding',
            '--remote-debugging-port=%d' % port,
            '--user-data-dir=' + prof,
            '--window-size=1280,720', url]
    p = subprocess.Popen(args, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    last, done = '', False
    try:
        for i in range(MAXTICKS):
            time.sleep(0.5)
            t = read_title(port)
            if t != last:
                last = t
                if 'DONE=' in t:
                    done = True
                    break
                if t.startswith('CP|'):
                    # ⚠️ 打**尾部**不打头部：头部永远是 HASH.char（它第一条入队），
                    #    相位推进全在尾巴上。三十九轮那条「读错了一端 ⇒ 判读全反」的账。
                    print('  t=%5.1fs  len=%4d  …%s' % (i * 0.5, len(t), t[-118:]))
        return last, done
    finally:
        p.terminate()
        kill_profile(tag)


def fields(title):
    out = {}
    if not title.startswith('CP|'):
        return out
    for seg in title[3:].split(' | '):
        if '=' in seg:
            k, v = seg.split('=', 1)
            out[k.strip()] = v
    return out


def main():
    if not os.path.exists(CHROME):
        raise SystemExit('找不到 Chrome：' + CHROME)
    if not os.path.exists(BASE):
        raise SystemExit('找不到本轮开工前的交付件：' + BASE)

    html = io.open(SRC, encoding='utf-8').read()
    base = io.open(BASE, encoding='utf-8').read()
    assert '</body>' in html and '</body>' in base, '产物里没有 </body>'

    shutil.rmtree(SERVE, ignore_errors=True)
    os.makedirs(SERVE)
    # ⚠️ 四页一律：`EARLY`（fetch 桩）紧跟 `<body>`，`PROBE` 照旧挂在 `</body>`。
    #    两段一前一后是**有讲究的**，见 `EARLY` 上面那段注释。
    def wire(page):
        # ⚠️ `<body>` 出现**两次**（第二次在某个 JS 字符串里），所以只能按**第一处**
        #    插，并且用"第一处必须排在第一个 <script> 之前"来担保 EARLY 真的抢在前面
        #    —— 光数个数是担保不了的（数出来是 2，不等于插对了地方）。
        assert page.count('</body>') == 1 and page.find('<body>') >= 0 \
            and page.find('<body>') < page.find('<script>'), \
            'EARLY 的落点不对 —— 它必须排在第一个 <script> 之前，否则 fetch 桩又晚了'
        return page.replace('<body>', '<body>' + EARLY, 1).replace('</body>', PROBE + '</body>')

    io.open(os.path.join(SERVE, 'campus.html'), 'w', encoding='utf-8', newline='\n').write(wire(html))
    io.open(os.path.join(SERVE, 'base.html'), 'w', encoding='utf-8', newline='\n').write(wire(base))
    # C19 的两页：同一份探针，**同一份产物**（负对照那页换成上一版的产物）
    io.open(os.path.join(SERVE, 'xbgret.html'), 'w', encoding='utf-8', newline='\n').write(wire(html))
    if os.path.exists(BROKEN):
        bro = io.open(BROKEN, encoding='utf-8').read()
        io.open(os.path.join(SERVE, 'xbgretbad.html'), 'w', encoding='utf-8', newline='\n').write(wire(bro))
    io.open(os.path.join(SERVE, 'index.html'), 'w', encoding='utf-8', newline='\n').write(FAKE)
    # ⭐ 服务出去就是 `/xbg/` —— C16 的落点
    os.makedirs(os.path.join(SERVE, 'xbg'))
    io.open(os.path.join(SERVE, 'xbg', 'index.html'), 'w', encoding='utf-8',
            newline='\n').write(FAKE_XBG)

    handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=SERVE)
    srv = socketserver.ThreadingTCPServer(('127.0.0.1', PORT), handler)
    srv.daemon_threads = True
    threading.Thread(target=srv.serve_forever, daemon=True).start()

    print('CENTER PROBE  (两间房 + 登录门 + 同源 iframe，全程约 32 秒)')
    try:
        print('\n---- 第 1 遍：r40 基线（只取精灵指纹，用来证明玩家/小北的像素没动）----')
        tb, okb = run_page('http://127.0.0.1:%d/base.html' % PORT, PROF_A, '_ctrprobe_pa', CDP)
        fb = fields(tb)

        print('\n---- 第 2 遍：本轮产物（全量 18 条判据）----')
        tn, okn = run_page('http://127.0.0.1:%d/campus.html' % PORT, PROF_B, '_ctrprobe_pb', CDP + 1)
        fn = fields(tn)

        print('\n---- 第 3 遍：C19 老用户开机（本轮产物）----')
        tr, okr = run_page('http://127.0.0.1:%d/xbgret.html' % PORT, PROF_C, '_ctrprobe_pc', CDP + 2)
        fr = fields(tr)

        print('\n---- 第 4 遍：C19 负对照（上一版产物，判据应当在这里变红）----')
        tq, okq = run_page('http://127.0.0.1:%d/xbgretbad.html' % PORT, PROF_D, '_ctrprobe_pd', CDP + 3)
        fq = fields(tq)

        # C19 是**一组** note（每个键一条），而下面那条硬判据要的是**一条**字符串。
        # 在这里拼出来。⚠️ 判据循环读的是 `fn`，而 C19 的值来自第 3 遍（`fr`）——
        # 挂过去；忘了这一步的症状是"C19 明明全绿但判据说没过"，很难往回找。
        # 负对照（`fq`）拼的是**同一条**规则，喂给同一个 `cond`，这样才叫对照。
        def _c19v(f):
            return ' '.join('%s=%s' % (k, f.get(k, '<缺>'))
                            for k in ('C19gateHidden', 'C19loginCalled',
                                      'C19sawXbgLogin', 'C19xbgTokenLen'))
        fr['C19'] = _c19v(fr)
        fq['C19'] = _c19v(fq)
        fn['C19'] = fr['C19']
    finally:
        srv.shutdown()

    print('\n==== 结果 ====')
    if not okb or not okn or ('STUCK=' in tn):
        print('!! 有一遍没跑完。基线 ok=%s / 产物 ok=%s / STUCK=%s'
              % (okb, okn, 'STUCK=' in tn))
        print('   基线最后：' + tb[-400:])
        print('   产物最后：' + tn[-400:])
        return 2

    for k in ('C10pre', 'C11', 'C10', 'C1', 'C2pre', 'C2', 'C3', 'C4',
              'C5', 'C6pre', 'C6', 'C7', 'C8pre', 'C8', 'C9pre', 'C9'):
        print('  %-7s %s' % (k, fn.get(k, '<缺>')))

    print('\n---- 第四十一轮新增（逸夫楼 / 学霸姐）----')
    for k in ('C12set', 'C12pre', 'C12', 'C13', 'C14', 'C15set', 'C15pre', 'C15',
              'C16pre', 'C16', 'C17'):
        print('  %-7s %s' % (k, fn.get(k, '<缺>')))
    print('  %-7s %s' % ('C18.center', fn.get('C18.center', '<缺>')))
    print('  %-7s %s' % ('C18.yifu',   fn.get('C18.yifu',   '<缺>')))

    print('\n---- C19 已登录的老用户开机（用户实测撞到的那条路）----')
    for k in ('C19gateHidden', 'C19loginCalled', 'C19sawXbgLogin',
              'C19xbgTokenLen', 'C19centerXbg', 'C19hud'):
        print('  %-13s 产物=%-24s 上一版=%s'
              % (k, fr.get(k, '<缺>'), fq.get(k, '<缺>')))

    print('\n---- 精灵指纹对照 ----')
    good = True
    # 玩家 / 小北 / 算法哥：r40 基线里**三个都有**，必须**逐字节相同**。
    # ⚠️ 算法哥**不是** r41 新加的（r40 就有了），别把它当成"基线里没有"去判 ——
    #    那样它的基线永远是非空串，判据恒红。r41 真正新加的只有学霸姐。
    for k, who in (('HASH.char', '玩家'), ('HASH.guide', '小北'), ('HASH.alg', '算法哥')):
        a, b = fb.get(k, '<缺>'), fn.get(k, '<缺>')
        same = (a == b and a != '<缺>')
        good = good and same
        print('  %-11s %s  %s' % (k, who, '一致 ✅' if same else '⭐ 变了 ❌'))
        if not same:
            print('      基线: ' + a[:200])
            print('      产物: ' + b[:200])
    a, b = fb.get('HASH.xbj', 'absent'), fn.get('HASH.xbj', 'absent')
    okk = (a == 'absent' and b != 'absent')
    good = good and okk
    print('  %-11s %s  %s' % ('HASH.xbj', '学霸姐',
          '基线里没有、产物里有（本轮新加的）✅' if okk
          else ('⭐ 异常：基线=' + a[:40] + ' 产物=' + b[:40])))

    print('\n---- 硬判据（这几条不是"打印出来看看"，是**算出来的**）----')
    print('  C3  mapMoved 必须 = 0.0000 且 C4 roomMoved > 0  （地图冻结 + 按键确实送到了）')
    print('  C13 mapMoved 必须 = 0.0000                        （换个房间再验一次）')
    print('  C16 sameOrigin 必须 true 且 relativeToSlash true  （同源不是靠字符串猜的）')
    print('  C18 connected 必须 true 且 canTalk 必须 true      （两间房都算）')
    # ⚠️ 子串要照**页面真写出来的**样子抄，一个字都别凭印象写：
    #    页面里是 `mapMoved=0.0000(应=0)`，`(应=0)` 在后面。
    #    我先前写成 `'(应=0) mapMoved=0.0000'`（条件在前）⇒ 恒不匹配、恒红。
    for k, cond, why in (
            ('C3',    lambda v: 'mapMoved=0.0000' in v, '地图在教室里被冻住了'),
            # C4 是 C3 的**对照**：只有"地图没动 + 室内也没动"才是真失败。
            # 室内 rAF 是独立的，按键链路要是有问题，C3 的"没动"就成了假绿。
            ('C4',    lambda v: not v.startswith('roomMoved=0.'), '教室里的按键真送到了'),
            ('C13',   lambda v: 'mapMoved=0.0000' in v, '地图在逸夫楼里被冻住了'),
            ('C13',   lambda v: 'roomMoved=0.' not in v, '逸夫楼里的按键真送到了'),
            ('C16pre', lambda v: 'relativeToSlash=true' in v and 'sameOrigin=true' in v
                                 and 'err=none' in v, 'iframe 真同源'),
            ('C17',   lambda v: 'sawXbgLogin=true' in v and 'xbgTokenLen=0' not in v,
                                 '一次登录进两边'),
            ('C18.center', lambda v: 'connected=true' in v and 'canTalk=true' in v,
                                 '计算机中心碰撞表'),
            ('C18.yifu',   lambda v: 'connected=true' in v and 'canTalk=true' in v,
                                 '逸夫楼碰撞表'),
            ('C19',   lambda v: 'gateHidden=true' in v and 'loginCalled=false' in v
                                and 'sawXbgLogin=true' in v and 'xbgTokenLen=0' not in v,
                                 '老用户开机也自动同步学霸姐')):
        v = fn.get(k, '<缺>')
        okk = cond(v)
        good = good and okk
        print('  %-11s %-22s %s' % (k, why, '✅' if okk else '⭐ 没过'))

    # ⭐⭐ C19 的**负对照**：同一条判据，喂给"已知有 bug"的上一版产物，**必须变红**。
    #    不验这一下的话，C19 有可能只是一条永远绿的装饰 —— 那种判据比没有更坏，
    #    因为它会让人以为"这条路测过了"。
    print('\n---- C19 负对照（上一版产物，**期望它红**）----')
    qv = fq.get('C19', '<缺>')
    negok = (qv != '<缺>') and (not ('gateHidden=true' in qv and 'loginCalled=false' in qv
                                     and 'sawXbgLogin=true' in qv and 'xbgTokenLen=0' not in qv))
    if not os.path.exists(BROKEN):
        print('  ⚠️ 负对照产物不在（%s）⇒ **这一条没验**，C19 的可信度打折' % BROKEN)
    else:
        good = good and negok
        print('  ' + ('✅ 上一版如预期变红（判据是活的）' if negok
                      else '⭐ 上一版居然也"过"了 ⇒ C19 是假判据，等于没测'))
        print('     上一版原始值：' + qv[:200])

    print('\n  ' + ('全部通过 ✅' if good else '⭐ 有判据没过 —— 见上面'))
    return 0 if good else 1


if __name__ == '__main__':
    raise SystemExit(main())
