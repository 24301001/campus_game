# -*- coding: utf-8 -*-
"""单点登录（SSO）端到端探针（2026-10-12 · 第四十五轮）。

为什么必须有这一个：本轮改的是**用户看得见的那一件事** ——
「在地图登录门登过一次，走到四家按 C，抽屉里**不该再出现那家自己的登录界面**」。
`_guardprobe` / `_auntprobe` / `_centerprobe` / `_ldloginprobe` 四套**都验不到它**：
它们各自只盯着自己那一家，而且都是**先登录再开抽屉**的顺路场景，
从来没有一次"从**第一帧**起就不许闪出登录界面"的断言。

⚠️ 与四套既有探针一样跑在 http://localhost:3000 上（同源才能读 `ctrF.contentDocument`，
   抽屉里的 `/ld` `/cmr` `/xbg` `/agent` 也只有在 Vite 网关上才活得起来）。

它验七件事（每一件都**真的驱动 UI**，合成 KeyboardEvent 走真实监听链）：

  ⭐ 总判据（贯穿全部场景）：**每次开门前先把 `ctrF.src` 踹成 `about:blank`**，
     于是每一次都是"这个应用第一次被打开" ⇒ 采到的就是**第一帧**。
     采样器 40ms 一次，判据是"**从第 0 个样本起就没有一次**看到登录界面"。

  P1  算法哥（`/agent`）：抽屉里**从未**出现 `pathname === '/login'`，落点是 `/agent`
  P2  学霸姐（逸夫楼）：`#gate` **从未**露过（它是 `hidden` 类控的，开机本来就藏）
  P3  老丁（保卫处）：`#login-view` **从未**露过，落点是 `#chat-view` 亮着
  P4  阿姨（食堂）：`#auth-screen` **从未**露过，落点是 `#app-screen` 亮着
  N1  负对照·**过期票**：把 `localStorage.token` 改成假串 ⇒ 门不弹，`campus_cred` 把票救回来
  N2  负对照·**卡在登录页**：把算法哥踹到 `/login` 停住 ⇒ 再按 C 能踹回 `/agent`
  N3  负对照·**user 账号**：用 `user/user123` 登地图 ⇒ 进食堂**仍不弹框**（`admin` 兜底）

⚠️ 判读口径（三条都很容易被误读，先写在这里）：
   · **"纱幕"不算登录界面**：模块侧开机会亮一层「正在进入…」（`html.ld-embed`/`html.aunt-embed`），
     那是接入地图的过渡态，不是要人填表。采样器认 `getComputedStyle` 的实际显示，
     并且**纱幕亮着时不计登录**。为了防止"纱幕一直亮着"把失败掩盖成通过，
     **每个 P 场景都额外要求终态是那家的主界面**（P2 `#gate` 收走、P3 `#chat-view` 亮、
     P4 `#app-screen` 亮）—— 两条一起成立才算过。
   · **N2 的 `sawLogin` 必然是 true**（开局就停在 `/login` 上），这不是失败；
     N2 的判据是**终态回到 `/agent`**（"踹得回来"）。
   · 判据用 `getComputedStyle(...).display !== 'none'`，**不读**引擎那句
     `ctrFrameOnLogin` 的实现（那是被测物，拿它当尺子就是自己量自己）。
"""
import io, json, os, shutil, subprocess, time, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(HERE)
OUT = os.path.join(HERE, '_ssoprobe_gen.html')
ROOT = os.path.dirname(os.path.dirname(PROJ))
PUB = os.path.join(ROOT, 'campus_game', 'frontend', 'public', '_ssoprobe_gen.html')
PROF = os.path.join(HERE, '_ssoprobe_prof')
PORT = 9346
URL = 'http://localhost:3000/_ssoprobe_gen.html'
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
MAXTICKS = 400                                     # 400 × 0.4s = 160s 上限

PROBE = r"""
<script>
(function(){
  var R = [];
  function note(k, v){ R.push(k + '=' + v); }
  function flush(){ document.title = 'SSO|' + R.join(' | '); }
  window.onerror = function(m, u, l, c){ note('ERR@' + l + ':' + c, m); flush(); return false; };

  function key(k){
    document.dispatchEvent(new KeyboardEvent('keydown',
      { key: k, code: k, bubbles: true, cancelable: true }));
  }
  /* ⚠️ 按键是**同步派发**：监听器里一旦卡住，本 tick 之后的 flush 就永远跑不到，
     标题会停在"按键前"的样子 —— 看着像"没执行"，其实是死在里面。所以按之前先刷一次。 */
  function fire(k){ flush(); key(k); }
  function fdoc(){ try { return ctrF ? ctrF.contentDocument : null; } catch (e) { return null; } }
  function fwin(){ try { return ctrF ? ctrF.contentWindow : null; } catch (e) { return null; } }
  function platOn(){ return !!(ctrP && !ctrP.hidden); }
  function blankFrame(){ try { if (ctrF) ctrF.setAttribute('src', 'about:blank'); } catch (e) {} }
  function fpath(){
    try { var w = fwin(); return String((w && w.location && w.location.pathname) || '-'); }
    catch (e) { return 'ERR'; }
  }
  function escInFrame(){
    var d = fdoc(); if (!d) return false;
    try {
      d.dispatchEvent(new KeyboardEvent('keydown',
        { key: 'Escape', code: 'Escape', bubbles: true, cancelable: true }));
      return true;
    } catch (e) { return false; }
  }
  /* ⭐⭐ **唯一**的"登录界面露着吗"判据。
     ⚠️ 用 `getComputedStyle` 而不是 `el.hidden`/`classList` ——
        老丁和学霸姐用 `hidden` **类**、阿姨用 `hidden` **属性**，
        只有算出来的 `display` 对这一家一视同仁（也不会跟着被测物的实现一起错）。 */
  function disp(el){
    if (!el) return 'MISSING';
    try {
      var s = getComputedStyle(el);
      if (s.display === 'none' || s.visibility === 'hidden') return 'none';
      return 'block';
    } catch (e) { return 'ERR'; }
  }
  function veilOn(){
    var d = fdoc();
    if (!d || !d.documentElement) return false;
    var he = d.documentElement;
    try {
      return he.classList.contains('ld-embed') || he.classList.contains('aunt-embed');
    } catch (e) { return false; }
  }
  function loginSig(kind){
    var d = fdoc();
    if (!d || !d.documentElement) return '';
    if (veilOn()) return '';                    // 「正在进入…」不是登录界面
    if (kind === 'campus') return (fpath() === '/login') ? 'SPA_/login' : '';
    if (kind === 'xbg'){
      var g = d.getElementById('gate');
      return (disp(g) === 'block') ? 'XBG_GATE' : '';
    }
    if (kind === 'ld'){
      var lv = d.getElementById('login-view');
      return (disp(lv) === 'block') ? 'LD_LOGINVIEW' : '';
    }
    if (kind === 'cmr'){
      var a = d.getElementById('auth-screen');
      return (disp(a) === 'block') ? 'CMR_AUTHSCREEN' : '';
    }
    return '';
  }

  /* ---------- 40ms 采样器：开门那一瞬起，每一帧都记 ---------- */
  var S = { ph: 0, mark: 0, poll: null, kind: '', n: 0, login: 0, first: '', veil: 0, t0: 0, dur: 0 };
  function startPoll(kind, ms){
    stopPoll();
    S.kind = kind; S.n = 0; S.login = 0; S.first = ''; S.veil = 0;
    S.t0 = Date.now(); S.dur = ms;
    S.poll = setInterval(function(){
      S.n++;
      if (veilOn()) S.veil++;
      var sig = loginSig(kind);
      if (sig){ S.login++; if (!S.first) S.first = sig + '@' + (Date.now() - S.t0) + 'ms'; }
      if (Date.now() - S.t0 >= S.dur) stopPoll();
    }, 40);
  }
  function stopPoll(){ if (S.poll){ clearInterval(S.poll); S.poll = null; } }
  function pollNote(k){
    note(k, 'sawLogin=' + S.login + ' first=' + (S.first || 'none')
      + ' samples=' + S.n + ' veil=' + S.veil);
  }
  function wait(ms){ return Date.now() - S.mark >= ms; }
  function tokLen(){ try { return (localStorage.getItem('token') || '').length; } catch (e) { return -1; } }
  function has(k){ try { return !!localStorage.getItem(k); } catch (e) { return false; } }

  /* ---------- 站到某人身边（与她/他脚下一圈里第一个可走点）---------- */
  var OFF = [[22,0],[-22,0],[0,22],[0,-22],[34,10],[-34,10],[16,26],[-16,26],[40,0],[-40,0]];
  function tpNear(o){
    if (!o) return false;
    for (var i = 0; i < OFF.length; i++){
      var x = o.x + OFF[i][0], y = o.y + OFF[i][1];
      if (canWalk(x, y) && !blocked(x, y)){ player.x = x; player.y = y; return true; }
    }
    return false;
  }

  var lg = function(id){ return document.getElementById(id); };
  function atGate(u, p){
    var U = lg('lgU'), P = lg('lgP'), G = lg('lgGo');
    if (!U || !P || !G) return false;
    U.value = u; P.value = p; G.click(); return true;
  }

  function run(){
    switch (S.ph) {

    /* ---------- S0 在登录门真登录一次（admin）---------- */
    case 0: {
      try { localStorage.clear(); } catch (e) {}
      if (!atGate('admin', 'admin123')) { note('S0', 'NO_LOGIN_FORM'); S.ph = 90; break; }
      note('S0a', 'clicked');
      S.ph = 1; S.mark = Date.now(); break;
    }
    case 1:
      if (!wait(3200)) break;
      note('S0', 'tok=' + tokLen()
        + ' cred=' + (has('campus_cred') ? 'Y' : 'N')
        + (has('ld_cred') ? '/Y' : '/N') + (has('cmr_cred') ? '/Y' : '/N')
        + ' gate=' + (function(){ var e = lg('login'); return (e && e.hidden) ? 'HIDDEN' : 'SHOWN'; })()
        + ' cmr=' + CENTER.cmr + ' ld=' + CENTER.ld + ' xbg=' + CENTER.xbg + ' campus=' + CENTER.campus);
      S.ph = 2; break;

    /* ---------- P1 算法哥（计算机中心，要先进屋）---------- */
    case 2: {
      var rc = ROOMS.center.rect;
      player.x = rc.x + rc.w / 2; player.y = rc.y + rc.h + 40;
      S.ph = 3; S.mark = Date.now(); break;
    }
    case 3:
      if (!wait(500)) break;
      fire('f');
      S.ph = 4; S.mark = Date.now(); break;
    case 4:
      if (!wait(600)) break;
      note('P1enter', 'in=' + CENTER.active + ' room=' + (CENTER.room ? CENTER.room.key : '-'));
      CENTER.x = CTR_ALG.x; CENTER.y = CTR_ALG.y + 44;
      blankFrame();
      S.ph = 5; S.mark = Date.now(); break;
    case 5:
      if (!wait(500)) break;
      note('P1pre', 'near=' + CENTER.nearNpc + ' src=' + (ctrF ? ctrF.getAttribute('src') : '-'));
      startPoll('campus', 3400);
      fire('c');
      S.ph = 6; S.mark = Date.now(); break;
    case 6:
      if (!wait(3600)) break;
      pollNote('P1');
      note('P1fin', 'path=' + fpath() + ' plat=' + platOn()
        + ' src=' + (ctrF ? ctrF.getAttribute('src') : '-') + ' near=' + CENTER.nearNpc);
      S.ph = 7; break;

    /* ---------- N1 负对照·过期票（票换成假串，靠 campus_cred 救）---------- */
    case 7:
      escInFrame();
      S.ph = 8; S.mark = Date.now(); break;
    case 8:
      if (!wait(600)) break;
      note('N1esc', 'plat=' + platOn());
      try { localStorage.setItem('token', 'probe-garbage-token'); } catch (e) {}
      note('N1bad', 'tok=' + tokLen() + ' cred=' + (has('campus_cred') ? 'Y' : 'N'));
      blankFrame();
      S.ph = 9; S.mark = Date.now(); break;
    case 9:
      if (!wait(400)) break;
      startPoll('campus', 3400);
      fire('c');
      S.ph = 10; S.mark = Date.now(); break;
    case 10:
      if (!wait(3600)) break;
      pollNote('N1');
      note('N1fin', 'path=' + fpath() + ' tok=' + tokLen()
        + ' rescued=' + (function(){ try { return localStorage.getItem('token') !== 'probe-garbage-token'; } catch (e) { return false; } })());
      S.ph = 11; break;

    /* ---------- N2 负对照·卡在 /login（踹得回来吗）---------- */
    case 11: {
      var w0 = fwin();
      try { if (w0) w0.location.replace('/login'); } catch (e) { note('N2err', String(e && e.message)); }
      S.ph = 12; S.mark = Date.now(); break;
    }
    case 12:
      if (!wait(2000)) break;
      note('N2parked', 'path=' + fpath());
      escInFrame();
      S.ph = 13; S.mark = Date.now(); break;
    case 13:
      if (!wait(700)) break;
      note('N2closed', 'plat=' + platOn() + ' srcAttr=' + (ctrF ? ctrF.getAttribute('src') : '-'));
      CENTER.x = CTR_ALG.x; CENTER.y = CTR_ALG.y + 44;
      S.ph = 14; S.mark = Date.now(); break;
    case 14:
      if (!wait(500)) break;
      startPoll('campus', 4000);
      fire('c');
      S.ph = 15; S.mark = Date.now(); break;
    case 15:
      if (!wait(4200)) break;
      pollNote('N2');
      note('N2fin', 'path=' + fpath() + ' plat=' + platOn());
      S.ph = 16; break;

    /* ---------- 出屋 → P2 学霸姐（逸夫楼）---------- */
    case 16:
      escInFrame();
      S.ph = 17; S.mark = Date.now(); break;
    case 17:
      if (!wait(600)) break;
      note('P1esc', 'plat=' + platOn());
      fire('b');
      S.ph = 18; S.mark = Date.now(); break;
    case 18: {
      if (!wait(800)) break;
      note('left1', 'in=' + CENTER.active);
      var ry = ROOMS.yifu.rect;
      player.x = ry.x + ry.w / 2; player.y = ry.y + ry.h + 40;
      S.ph = 19; S.mark = Date.now(); break;
    }
    case 19:
      if (!wait(500)) break;
      fire('f');
      S.ph = 20; S.mark = Date.now(); break;
    case 20: {
      if (!wait(600)) break;
      note('P2enter', 'in=' + CENTER.active + ' room=' + (CENTER.room ? CENTER.room.key : '-'));
      var ny = ROOMS.yifu.npc;
      CENTER.x = ny.x; CENTER.y = ny.y + 44;
      blankFrame();
      S.ph = 21; S.mark = Date.now(); break;
    }
    case 21:
      if (!wait(500)) break;
      note('P2pre', 'near=' + CENTER.nearNpc);
      startPoll('xbg', 3400);
      fire('c');
      S.ph = 22; S.mark = Date.now(); break;
    case 22: {
      if (!wait(3600)) break;
      pollNote('P2');
      var d2 = fdoc();
      note('P2fin', 'path=' + fpath() + ' plat=' + platOn()
        + ' gate=' + (d2 ? disp(d2.getElementById('gate')) : 'noframe'));
      S.ph = 23; break;
    }
    case 23:
      escInFrame();
      S.ph = 24; S.mark = Date.now(); break;
    case 24:
      if (!wait(600)) break;
      note('P2esc', 'plat=' + platOn());
      fire('b');
      S.ph = 25; S.mark = Date.now(); break;

    /* ---------- P3 老丁（地图上，不在屋里）---------- */
    case 25:
      if (!wait(800)) break;
      note('left2', 'in=' + CENTER.active);
      note('P3tp', 'tp=' + tpNear(GUARD));
      blankFrame();
      S.ph = 26; S.mark = Date.now(); break;
    case 26:
      if (!wait(600)) break;
      note('P3near', 'near=' + GUARD.near
        + ' d=' + Math.hypot(player.x - GUARD.x, player.y - GUARD.y).toFixed(0));
      startPoll('ld', 4000);
      fire('c');
      S.ph = 27; S.mark = Date.now(); break;
    case 27: {
      if (!wait(4200)) break;
      pollNote('P3');
      var d3 = fdoc();
      note('P3fin', 'plat=' + platOn() + ' src=' + (ctrF ? ctrF.getAttribute('src') : '-')
        + ' loginView=' + (d3 ? disp(d3.getElementById('login-view')) : 'noframe')
        + ' chatView=' + (d3 ? disp(d3.getElementById('chat-view')) : 'noframe')
        + ' title=' + JSON.stringify(d3 ? String(d3.title).slice(0, 12) : ''));
      S.ph = 28; break;
    }
    case 28:
      escInFrame();
      S.ph = 29; S.mark = Date.now(); break;

    /* ---------- P4 阿姨（地图上）---------- */
    case 29:
      if (!wait(600)) break;
      note('P3esc', 'plat=' + platOn());
      player.x = S.px; player.y = S.py;              // 先站回出生点，离阿姨远点
      S.ph = 30; S.mark = Date.now(); break;
    case 30:
      if (!wait(300)) break;
      note('P4tp', 'tp=' + tpNear(AUNT) + ' d=' + Math.hypot(player.x - AUNT.x, player.y - AUNT.y).toFixed(0));
      blankFrame();
      S.ph = 31; S.mark = Date.now(); break;
    case 31:
      if (!wait(600)) break;
      note('P4near', 'near=' + AUNT.near
        + ' d=' + Math.hypot(player.x - AUNT.x, player.y - AUNT.y).toFixed(0));
      startPoll('cmr', 4000);
      fire('c');
      S.ph = 32; S.mark = Date.now(); break;
    case 32: {
      if (!wait(4200)) break;
      pollNote('P4');
      var d4 = fdoc();
      note('P4fin', 'plat=' + platOn() + ' src=' + (ctrF ? ctrF.getAttribute('src') : '-')
        + ' authScreen=' + (d4 ? disp(d4.getElementById('auth-screen')) : 'noframe')
        + ' appScreen=' + (d4 ? disp(d4.getElementById('app-screen')) : 'noframe')
        + ' heading=' + JSON.stringify(d4 ? String((d4.getElementById('auth-heading') || {}).textContent || '') : ''));
      S.ph = 33; break;
    }
    case 33:
      escInFrame();
      S.ph = 34; S.mark = Date.now(); break;

    /* ---------- N3 负对照·user 账号（食堂要走 admin 兜底）---------- */
    case 34:
      if (!wait(600)) break;
      note('P4esc', 'plat=' + platOn());
      note('N3cand0', 'cands=' + (function(){
        try { return cmrCandidates().map(function(c){ return c.u; }).join('>'); }
        catch (e) { return 'ERR'; }
      })());
      /* 先问一句"食堂那边现在是谁的会话"（父页自己问，不经 iframe） */
      fetch('/cmr/api/me').then(function(r){
        return r.json().then(function(j){ note('N3who0', 'status=' + r.status + ' u=' + (j && j.username ? j.username : '-')); });
      }).catch(function(e){ note('N3who0', 'ERR'); });
      /* 掐掉阿姨的 cookie（她自己的 /api/logout；同源代理下 Origin 会对上 ⇒ 200） */
      fetch('/cmr/api/logout', { method: 'POST' }).then(function(r){
        note('N3logout', 'status=' + r.status);
      }).catch(function(e){ note('N3logout', 'ERR ' + e.message); });
      S.ph = 35; S.mark = Date.now(); break;
    case 35:
      if (!wait(1200)) break;
      if (!atGate('user', 'user123')) { note('N3', 'NO_LOGIN_FORM'); S.ph = 90; break; }
      S.ph = 36; S.mark = Date.now(); break;
    case 36:
      if (!wait(3000)) break;
      note('N3login', 'tok=' + tokLen() + ' gate=' + (function(){ var e = lg('login'); return (e && e.hidden) ? 'HIDDEN' : 'SHOWN'; })()
        + ' cmr=' + JSON.stringify(CENTER.cmr) + ' campus=' + JSON.stringify(CENTER.campus));
      fetch('/cmr/api/me').then(function(r){ note('N3who1', 'status=' + r.status); })
        .catch(function(e){ note('N3who1', 'ERR'); });
      note('P5tp', 'tp=' + tpNear(AUNT));
      blankFrame();
      S.ph = 37; S.mark = Date.now(); break;
    case 37:
      if (!wait(600)) break;
      note('P5near', 'near=' + AUNT.near);
      startPoll('cmr', 4400);
      fire('c');
      S.ph = 38; S.mark = Date.now(); break;
    case 38: {
      if (!wait(4600)) break;
      pollNote('P5');
      var d5 = fdoc();
      note('P5fin', 'plat=' + platOn()
        + ' authScreen=' + (d5 ? disp(d5.getElementById('auth-screen')) : 'noframe')
        + ' appScreen=' + (d5 ? disp(d5.getElementById('app-screen')) : 'noframe')
        + ' user=' + JSON.stringify(d5 ? String((d5.getElementById('current-user') || {}).textContent || '') : ''));
      /* 直问一次闸门本身：她那边"最后结论"是什么、候选顺序是什么 */
      try {
        note('P5cand', 'cands=' + cmrCandidates().map(function(c){ return c.u; }).join('>'));
      } catch (e) { note('P5cand', 'ERR'); }
      S.ph = 90; break;
    }

    case 90:
      flush();
      note('DONE', '1');
      flush();
      S.ph = 91;
      break;
    }
  }

  var ready = 0;
  function boot(){
    if (typeof CENTER === 'undefined' || typeof ROOMS === 'undefined' || !ctrF || !ctrP) {
      ready++;
      if (ready > 120) { note('BOOT', 'TIMEOUT'); flush(); S.ph = 99; }
      return;
    }
    S.px = player.x; S.py = player.y;
    setInterval(run, 150);
  }
  var bt = setInterval(function(){ if (S.ph) return; boot(); }, 150);
  window.__ssoRun = run;
})();
</script>
"""


def read_title():
    try:
        data = json.load(urllib.request.urlopen('http://127.0.0.1:%d/json' % PORT, timeout=5))
    except Exception as e:
        return '<CDP 连不上: %s>' % e
    for t in reversed(data):
        if t.get('type') == 'page' and t.get('url', '').startswith('http'):
            return t.get('title', '')
    return '<没有页面>'


def kill_profile():
    ps = ("Get-CimInstance Win32_Process -Filter \"Name='chrome.exe'\" | "
          "Where-Object { $_.CommandLine -like '*_ssoprobe_prof*' } | "
          "ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }")
    subprocess.run(['powershell', '-NoProfile', '-Command', ps], capture_output=True)


def parse(title):
    body = title[4:] if title.startswith('SSO|') else title
    kv, order = {}, []
    for part in body.split(' | '):
        if '=' not in part:
            continue
        k, v = part.split('=', 1)
        kv[k] = v
        order.append(part)
    return kv, order


def main():
    if not os.path.exists(CHROME):
        raise SystemExit('找不到 Chrome：' + CHROME)
    html = io.open(os.path.join(PROJ, u'像素校园_全校地图.html'), encoding='utf-8').read()
    assert '</body>' in html, '源产物里没有 </body>'
    gen = html.replace('</body>', PROBE + '</body>')
    assert os.path.isdir(os.path.dirname(PUB)), \
        'frontend/public 不存在（%s）—— 先跑一次启动器把前端铺起来' % os.path.dirname(PUB)
    io.open(PUB, 'w', encoding='utf-8', newline='\n').write(gen)
    io.open(OUT, 'w', encoding='utf-8', newline='\n').write(gen)

    kill_profile()
    shutil.rmtree(PROF, ignore_errors=True)
    args = [CHROME, '--no-sandbox', '--no-first-run', '--no-default-browser-check',
            '--headless=new', '--disable-gpu',
            '--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-renderer-backgrounding',
            '--remote-debugging-port=%d' % PORT,
            '--user-data-dir=' + PROF,
            '--window-size=1280,720',
            URL]
    p = subprocess.Popen(args, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    last, done = '', False
    print('SSO PROBE  (登录一次 → 四家抽屉都不许再出现登录界面；全程约 40~70s)')
    try:
        for i in range(MAXTICKS):
            time.sleep(0.4)
            t = read_title()
            if t != last:
                last = t
                if 'DONE=1' in t or 'BOOT=TIMEOUT' in t:
                    done = True
                    break
                if t.startswith('SSO|'):
                    print('  t=%5.1fs  %s' % (i * 0.4, t[4:][:150]))
        kv, order = parse(last)
        print('\n==== 全部读数 ====')
        for part in order:
            print('  ' + part)

        def num(k, sub):
            v = kv.get(k, '')
            for seg in v.split():
                if seg.startswith(sub):
                    return seg[len(sub):]
            return '?'

        print('\n==== 判读 ====')
        fails = []

        def check(name, cond, detail):
            print(('  ✅ ' if cond else '  ❌ ') + name + '  ' + detail)
            if not cond:
                fails.append(name)

        # P1 算法哥
        check('P1 算法哥·抽屉里从没出现过登录页',
              num('P1', 'sawLogin=') == '0' and kv.get('P1fin', '').find('path=/agent') >= 0,
              'sawLogin=%s  %s' % (num('P1', 'sawLogin='), kv.get('P1fin', '-')))
        # N1 过期票
        check('N1 负对照·过期票被 campus_cred 救回',
              num('N1', 'sawLogin=') == '0' and kv.get('N1fin', '').find('path=/agent') >= 0
              and 'rescued=true' in kv.get('N1fin', ''),
              '%s  %s' % (kv.get('N1', '-'), kv.get('N1fin', '-')))
        # N2 卡在 /login
        check('N2 负对照·卡在 /login 能被踹回 /agent',
              kv.get('N2parked', '').find('path=/login') >= 0 and kv.get('N2fin', '').find('path=/agent') >= 0,
              'parked=%s  fin=%s  %s' % (kv.get('N2parked', '-'), kv.get('N2fin', '-'), kv.get('N2', '-')))
        # P2 学霸姐
        check('P2 学霸姐·#gate 从未露过',
              num('P2', 'sawLogin=') == '0' and 'gate=none' in kv.get('P2fin', ''),
              '%s  %s' % (kv.get('P2', '-'), kv.get('P2fin', '-')))
        # P3 老丁
        check('P3 老丁·#login-view 从未露过',
              num('P3', 'sawLogin=') == '0' and 'loginView=none' in kv.get('P3fin', '')
              and 'chatView=block' in kv.get('P3fin', ''),
              '%s  %s' % (kv.get('P3', '-'), kv.get('P3fin', '-')))
        # P4 阿姨
        check('P4 阿姨·#auth-screen 从未露过',
              num('P4', 'sawLogin=') == '0' and 'authScreen=none' in kv.get('P4fin', '')
              and 'appScreen=block' in kv.get('P4fin', ''),
              '%s  %s' % (kv.get('P4', '-'), kv.get('P4fin', '-')))
        # N3 user 账号 + P5 阿姨 admin 兜底
        check('N3 负对照·user 账号进食堂仍不弹框（admin 兜底）',
              num('P5', 'sawLogin=') == '0' and 'authScreen=none' in kv.get('P5fin', '')
              and 'appScreen=block' in kv.get('P5fin', '')
              and kv.get('P5cand', '').endswith('admin') and kv.get('N3logout', '').endswith('200'),
              '%s  %s  cand=%s  logout=%s' % (kv.get('P5', '-'), kv.get('P5fin', '-'),
                                              kv.get('P5cand', '-'), kv.get('N3logout', '-')))

        if fails:
            print('\n!! %d 条没过：%s' % (len(fails), ' / '.join(fails)))
        else:
            print('\n全部通过 ✅')
        if not done:
            print('\n!! 探针没跑完（%d 个 tick 用光）' % MAXTICKS)
    finally:
        p.terminate()
        kill_profile()
        shutil.rmtree(PROF, ignore_errors=True)     # 临时浏览器档案，别留在 _build 里
        # ⚠️ 收尾必须**逐个精确路径**删（绝不扫描式清理）。PUB 尤其重要：
        #    它落在 frontend/public/ 里，是要被 Vite 发布出去的目录。
        for _f in (OUT, PUB):
            try:
                if os.path.exists(_f):
                    os.remove(_f)
            except OSError:
                pass


if __name__ == '__main__':
    main()
