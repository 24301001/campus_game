# -*- coding: utf-8 -*-
u"""_auntprobe.py —— 「食堂阿姨接进地图」的端到端探针（第四十八轮 · 2026-10-11）

它回答的是一句人话：**走到学生一食堂门口按 C，抽屉里是不是阿姨的界面、而且不用再登一次。**

照 `_guardprobe.py` 那套骨架（注入脚本 + headless Chrome + CDP 读 title 当输出管道），
但有三处**故意不一样**：

  ① **真登录**。老丁那条探针不碰登录门（他站在路上巡逻，和登没登没关系）。
     阿姨这条**必须**从登录门走一遍 —— 「免登录」正是待验的东西本身。
     所以 A1 会真的填 `admin / admin123` 点「进入像素校园」，等的就是
     `doLogin` 那条链把 `cmrSync` 跑完（`CENTER.cmr === "ok"`）。
  ② **走 3000 端口**（同 `_guardprobe.py`，理由一样但更硬）：抽屉里 iframe 是 `/cmr/`，
     file:// 下会变成 `file:///cmr/`，那条同源代理链一个字都验不到。
  ③ **A0 断言可达，不只断言站得住**（用户方案里点名的风险点）：学生一食堂南缘到南边
     宿舍楼只剩约 68px 夹缝。她要是 snap 进一个死口袋，「按 C」在玩法上就是不可达的。
     所以 A0 除了 `canWalk && !blocked`，还要拿 `guidePath` 从玩家那儿真走一遍。

判读：最后一行 `ATP|...`（每个 A 项一格）。全程约 25~70 秒。
"""
import io
import json
import os
import shutil
import subprocess
import sys
import time
import urllib.parse
import urllib.request

# ⚠️ 本机控制台默认 GBK：产物里一个 `−`(U+2212) 就能让 print 当场抛 UnicodeEncodeError，
#    把已经跑完的结论全埋掉（真栽过）。这里强制 UTF-8，编不出的字退化成 `?` 也认。
try:
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
except Exception:
    pass

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(HERE)                       # …\像素校园地图项目\源码
# ⚠️ `campus_game` 挂在**总目录**下（`像素校园地图项目` 的父目录），不是 PROJ 里面。
ROOT = os.path.dirname(os.path.dirname(PROJ))
PUB = os.path.join(ROOT, 'campus_game', 'frontend', 'public', '_atprobe_gen.html')
PROF = os.path.join(HERE, '_atprobe_prof')
PORT = 9346
URL = 'http://localhost:3000/_atprobe_gen.html'
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
MAXTICKS = 320                                     # 320 × 0.5s = 160s 上限

PROBE = r"""
<script>
(function(){
  var R = [];
  function note(k, v){ R.push(k + '=' + v); }
  /* 标题里带一个相位心跳 —— 卡住时一眼看出"死在哪个 case"，不用猜。 */
  function ph0(){ try { return (typeof S === 'undefined' || !S) ? '?' : S.ph; } catch (e) { return '?'; } }
  function flush(){ document.title = 'ATP|ph=' + ph0() + '|tick=' + TICK + '|' + R.join(' | '); }
  window.onerror = function(m, u, l, c){ note('ERR@' + l + ':' + c, m); flush(); return false; };

  function key(k, tgt){
    (tgt || window).dispatchEvent(new KeyboardEvent('keydown',
      { key: k, code: k, bubbles: true, cancelable: true }));
  }
  /* ⚠️ 按键是**同步派发**：监听器里一旦卡住，本 tick 之后的 flush 就永远跑不到，
     标题会停在"按键前"的样子 —— 看着像"没执行"，其实是死在里面。所以按之前先刷一次。 */
  function fire(k){ flush(); key(k); }
  function keyUp(k){
    window.dispatchEvent(new KeyboardEvent('keyup',
      { key: k, code: k, bubbles: true, cancelable: true }));
  }
  function atipEl(){ return document.getElementById('atip'); }
  function atipOn(){ var e = atipEl(); return !!(e && !e.hidden); }
  function atipTxt(){ var e = atipEl(); return e ? e.textContent : ''; }
  function platOn(){ return !!(ctrP && !ctrP.hidden); }
  function frameDoc(){ try { return ctrF ? ctrF.contentDocument : null; } catch (e) { return null; } }
  function hid(el){ return !el || el.hidden; }
  function dAunt(){ return Math.hypot(player.x - AUNT.x, player.y - AUNT.y); }

  /* 瞬移到阿姨身边一个**可走**的落点（与老丁那条同款）。 */
  function tpNearAunt(){
    var off = [[22,0],[-22,0],[0,22],[0,-22],[34,10],[-34,10],[16,26],[-16,26],[40,0],[-40,0]];
    for (var i = 0; i < off.length; i++){
      var x = AUNT.x + off[i][0], y = AUNT.y + off[i][1];
      if (canWalk(x, y) && !blocked(x, y)) { player.x = x; player.y = y; return true; }
    }
    return false;
  }

  var S = { ph: 0, mark: 0, start: null, loginTried: false };

  function wait(ms){ return Date.now() - S.mark >= ms; }
  function run(){
    switch (S.ph) {

    /* ---------- A0 她站得住吗？玩家走得到吗？（**本探针的题眼**）---------- */
    case 0: {
      if (typeof AUNT === 'undefined') { note('A0', 'AUNT_UNDEFINED'); S.ph = 99; break; }
      var stand = canWalk(AUNT.x, AUNT.y) && !blocked(AUNT.x, AUNT.y);
      var spotStand = AUNT_SPOT ? (canWalk(AUNT_SPOT.x, AUNT_SPOT.y) && !blocked(AUNT_SPOT.x, AUNT_SPOT.y)) : null;
      var dSnap = AUNT_SPOT ? Math.hypot(AUNT.x - AUNT_SPOT.x, AUNT.y - AUNT_SPOT.y) : -1;
      /* 门口点在哪儿？（验收员肉眼对得上：学生一食堂**南**门前 14px） */
      note('A0a', 'aunt=' + (AUNT.x | 0) + ',' + (AUNT.y | 0)
        + ' spot=' + (AUNT_SPOT ? ((AUNT_SPOT.x | 0) + ',' + (AUNT_SPOT.y | 0)) : 'none')
        + ' snapPx=' + dSnap.toFixed(1)
        + ' stand=' + (stand ? 'Y' : 'N')
        + ' spotStand=' + (spotStand === null ? '-' : (spotStand ? 'Y' : 'N')));
      /* 她身边一圈里有没有可走点？没有的话 TALK_R 形同虚设。 */
      var ringOK = 0;
      for (var a = 0; a < 36; a++){
        var t = a * Math.PI / 18;
        for (var r = 24; r <= AUNT_TALK_R - 8; r += 8){
          if (canWalk(AUNT.x + Math.cos(t) * r, AUNT.y + Math.sin(t) * r)
              && !blocked(AUNT.x + Math.cos(t) * r, AUNT.y + Math.sin(t) * r)) { ringOK++; break; }
        }
      }
      /* ⭐ 可达性：从**出生点**用地图自己那套寻路走一遍，看能不能走到她跟前。 */
      var P = (typeof guidePath === 'function') ? guidePath(SPAWN.x, SPAWN.y, AUNT.x, AUNT.y) : undefined;
      var reach = P === null ? 'NO' : (P ? 'YES' : 'NOFUNC');
      /* 再从"她身边第一个可走点"验证一次（她的格子本身可能是墙边，寻路到不了格子心）。 */
      var nearPt = null;
      for (var a2 = 0; a2 < 36 && !nearPt; a2++){
        var t2 = a2 * Math.PI / 18;
        for (var r2 = 24; r2 <= AUNT_TALK_R - 8; r2 += 8){
          var px = AUNT.x + Math.cos(t2) * r2, py = AUNT.y + Math.sin(t2) * r2;
          if (canWalk(px, py) && !blocked(px, py)){ nearPt = [px, py]; break; }
        }
      }
      var P2 = nearPt && (typeof guidePath === 'function') ? guidePath(SPAWN.x, SPAWN.y, nearPt[0], nearPt[1]) : undefined;
      note('A0b', 'talkRingOK=' + ringOK + '/36'
        + ' pathToAunt=' + reach + '(' + (P && P.length ? P.length : 0) + ')'
        + ' pathToNear=' + (P2 === null ? 'NO' : (P2 ? 'YES' : '-'))
        + ' nearPt=' + (nearPt ? ((nearPt[0] | 0) + ',' + (nearPt[1] | 0)) : 'none'));
      S.ph = 1; break;
    }

    /* ---------- A1 真登录：填表 → 点「进入像素校园」→ 等 cmrSync 落盘 ---------- */
    case 1:
      if (!S.loginTried) {
        var u = document.getElementById('lgU'), p = document.getElementById('lgP'), g = document.getElementById('lgGo');
        if (!u || !p || !g) { note('A1', 'NO_LOGIN_FORM'); S.ph = 99; break; }
        u.value = 'admin'; p.value = 'admin123';
        g.click();
        S.loginTried = true;
        S.mark = Date.now();
        note('A1a', 'clicked at t0');
      }
      var lg = document.getElementById('login');
      var done = lg && lg.hidden;
      var cmr = (typeof CENTER !== 'undefined') ? CENTER.cmr : '<noCENTER>';
      if (!done && Date.now() - S.mark > 20000) { note('A1', 'LOGIN_STUCK hidden=' + (lg ? lg.hidden : '-') + ' cmr=' + cmr); S.ph = 99; break; }
      /* 登录门关了 + cmrSync 有结论（ok/skip/down 三者之一），或者干脆超时 —— 都要往下走，
         绝不因为"她那边没同步上"就把整条探针卡死（那恰恰是要看清楚的一种结果）。 */
      if (done && (cmr === 'ok' || cmr === 'skip' || cmr === 'down' || Date.now() - S.mark > 25000)) {
        note('A1', 'gateHidden=' + (done ? 'Y' : 'N') + ' CENTER.cmr=' + JSON.stringify(cmr)
          + ' xbg=' + JSON.stringify(CENTER.xbg) + ' ld=' + JSON.stringify(CENTER.ld)
          + ' hud=' + JSON.stringify((document.getElementById('hud') || {}).textContent || ''));
        S.ph = 3; break;
      }
      break;

    /* ---------- A3 走近 → 头顶冒「C 进食堂」 ---------- */
    case 3:
      note('A3tp', 'tp=' + tpNearAunt() + ' d=' + dAunt().toFixed(0));
      S.ph = 4; S.mark = Date.now(); break;
    case 4:
      if (!wait(700)) break;
      note('A3', 'near=' + AUNT.near + ' atip=' + (atipOn() ? 'shown' : 'HIDDEN')
        + ' txt=' + JSON.stringify(atipTxt()) + ' d=' + dAunt().toFixed(0)
        + ' pos=' + (function(){ var e = atipEl();
            return e ? ((parseFloat(e.style.left) | 0) + ',' + (parseFloat(e.style.top) | 0)) : '-'; })());
      S.ph = 5; break;

    /* ---------- A4 按 C → 抽屉开，src 是 /cmr/ ----------
       ⚠️ 同理分两拍：A3 那拍已经站好并等过 700ms，`near` 是新鲜的；这里只补一个兜底。 */
    case 5:
      if (!AUNT.near) { tpNearAunt(); S.ph = 50; S.mark = Date.now(); break; }
      fire('c');
      S.ph = 6; S.mark = Date.now(); break;
    case 50:
      if (!wait(500)) break;
      fire('c');
      S.ph = 6; S.mark = Date.now(); break;
    case 6:
      if (!wait(2500)) break;
      note('A4', 'plat=' + CENTER.plat + ' waiting=' + CENTER.waiting
        + ' ctrP=' + (platOn() ? 'shown' : 'HIDDEN')
        + ' src=' + (ctrF ? ctrF.getAttribute('src') : '-')
        + ' title=' + (ctrF ? JSON.stringify(ctrF.getAttribute('title')) : '-')
        + ' tip=' + (function(){ var e = document.getElementById('ctrTip');
            return e && !e.hidden ? JSON.stringify(e.textContent).slice(0, 60) : 'hidden'; })());
      S.ph = 7; S.mark = Date.now(); break;

    /* ---------- A5 ⭐ 免登录：抽屉里直接就是登录态 ---------- */
    case 7: {
      var d = frameDoc();
      if (!d || d.readyState !== 'complete') {
        if (Date.now() - S.mark > 15000) { note('A5', 'TIMEOUT readyState=' + (d ? d.readyState : 'noframe')); S.ph = 8; S.mark = Date.now(); }
        break;
      }
      var app = d.getElementById('app-screen'), auth = d.getElementById('auth-screen');
      var cu = d.getElementById('current-user'), bc = d.getElementById('back-campus');
      S.mark = Date.now();
      note('A5', 'doc=' + JSON.stringify((d.title || '').slice(0, 20))
        + ' appScreen=' + (hid(app) ? 'hidden' : 'shown')
        + ' authScreen=' + (hid(auth) ? 'hidden' : 'SHOWN')
        + ' user=' + JSON.stringify(cu ? cu.textContent.trim() : '-')
        + ' backBtn=' + (bc ? (bc.hidden ? 'hidden' : 'shown') : 'MISSING')
        + ' logoutBtn=' + (d.getElementById('logout-button') ? 'Y' : 'N')
        + ' bodyLen=' + (d.body ? d.body.innerHTML.length : -1));
      S.ph = 8; break;
    }

    /* ---------- A6 抽屉锁步：按方向键玩家不动 ---------- */
    case 8: {
      /* 挑一个开阔可走的起跑点（两次测试同一起点，唯一变量 = 抽屉开没开）。 */
      var found = null;
      for (var i = 0; i < 400 && !found; i++){
        var x = AUNT.x + (i % 20) * 24 - 240, y = AUNT.y + ((i / 20) | 0) * 24 - 240;
        if (!(canWalk(x, y) && !blocked(x, y))) continue;
        var k = 0;
        for (k = 1; k <= 8; k++) if (!(canWalk(x + k * 18, y) && !blocked(x + k * 18, y))) break;
        if (k > 6) found = { x: x, y: y };
      }
      if (!found) { note('A6', 'NOSTART'); S.ph = 99; break; }
      S.start = found;
      player.x = found.x; player.y = found.y;
      S.p0 = [player.x, player.y];
      key('ArrowRight');
      S.ph = 9; S.mark = Date.now(); break;
    }
    case 9:
      if (!wait(600)) break;
      keyUp('ArrowRight');
      note('A6', 'drawerOpen=' + CENTER.plat + ' playerMoved=' + Math.hypot(player.x - S.p0[0], player.y - S.p0[1]).toFixed(2));
      /* 在 **iframe** 里按 Esc（71b 把监听绑在 iframe 的 document 上） */
      var d2 = frameDoc();
      if (d2) d2.dispatchEvent(new KeyboardEvent('keydown',
        { key: 'Escape', code: 'Escape', bubbles: true, cancelable: true }));
      else key('Escape');
      S.ph = 10; S.mark = Date.now(); break;

    /* ---------- A7 iframe 里按 Esc → 关抽屉 ---------- */
    case 10:
      if (!wait(600)) break;
      note('A7', 'plat=' + CENTER.plat + ' ctrP=' + (platOn() ? 'shown' : 'HIDDEN'));
      S.ph = 11; break;
    case 11:
      player.x = S.start.x; player.y = S.start.y;
      S.p0 = [player.x, player.y];
      key('ArrowRight');
      S.ph = 12; S.mark = Date.now(); break;
    case 12:
      if (!wait(600)) break;
      keyUp('ArrowRight');
      note('A7b', 'playerMoved=' + Math.hypot(player.x - S.p0[0], player.y - S.p0[1]).toFixed(2)
        + ' plat=' + CENTER.plat);
      S.ph = 13; break;

    /* ---------- A8 再按 C 进去 → 点「← 返回校园」→ 关抽屉 ----------
       ⚠️ 瞬移与按键**必须分成两拍**：`AUNT.near` 是 `auntTick` 每帧算的，
          在同一个 JS 时钟里先改 `player.x/y` 再 `key('c')`，键盘回调读到的还是**旧位置**的
          `near=false` ⇒ 白按一下（第一版就是这么栽的，A8a 那次 plat 一直是 false）。 */
    case 13:
      note('A8tp', 'tp=' + tpNearAunt() + ' d=' + dAunt().toFixed(0));
      S.ph = 23; S.mark = Date.now(); break;
    case 23:
      if (!S.nearLogged) {
        note('A8near', 'near=' + AUNT.near + ' d=' + dAunt().toFixed(0));
        S.nearLogged = true;
      }
      if (!wait(500)) break;
      fire('c');
      S.ph = 14; S.mark = Date.now(); break;
    case 14:
      if (!wait(2500)) break;
      var d3 = frameDoc();
      var bc2 = d3 ? d3.getElementById('back-campus') : null;
      note('A8a', 'plat=' + CENTER.plat + ' src=' + (ctrF ? ctrF.getAttribute('src') : '-')
        + ' backBtn=' + (bc2 ? (bc2.hidden ? 'hidden' : 'shown') : 'missing'));
      if (bc2 && !bc2.hidden) bc2.click();
      else note('A8b', 'NO_BUTTON');
      S.ph = 15; S.mark = Date.now(); break;
    case 15:
      if (!wait(900)) break;
      note('A8b', 'plat=' + CENTER.plat + ' ctrP=' + (platOn() ? 'shown' : 'HIDDEN'));
      S.ph = 16; break;

    /* ---------- A9 两个负对照 ----------
       ⚠️ 先说明**为什么不是「把 cookie 掐掉再看」**：那个对照根本做不出来。
          实测（阿姨服务端访问日志）掐掉之后按 C，地图那条 `cmrEnsure` 会拿
          `cmr_cred` 里的凭据**当场补登一次**（`GET /api/me` 401 → `POST /api/login` 200），
          抽屉里照样是登录态 —— **这正是设计要的结果**，不是故障。
          所以真正该验的是下面这两条：
            ① 密码错时必须**如实**返回 skip，绝不能谎报 ok（假绿灯）；
            ② 把「补登」这条路掐断之后，她必须**如实**弹自己的登录框，而不是白屏。
       ⚠️ 踹 iframe 回 about:blank：`ctrOpenPlatform` 只在 `ctrF.src !== R.app` 时重设 src
          —— 同一个应用再开一次是不重载的（刻意的，与老丁/学霸哥同款）。 */
    case 16:
      /* ① 假绿灯对照：错的密码只能拿到 skip。 */
      cmrSync('admin', 'definitely-not-the-password', 0).then(function(st){
        note('A9wrong', 'wrongPw=' + st);
      });
      fetch('/cmr/api/logout', { method: 'POST' }).then(function(r){
        note('A9a', 'logoutStatus=' + r.status);      // 403 = 被 check_origin 挡了（cookie 不会清）
      }).catch(function(e){ note('A9a', 'ERR ' + e.message); });
      /* ② 把「补登」这条路暂时掐断（顶层函数声明就是 window 上的属性，可以直接换）。 */
      window.__atOrigEnsure = cmrEnsure;
      window.cmrEnsure = function(){ return Promise.resolve('skip'); };
      if (ctrF) ctrF.setAttribute('src', 'about:blank');
      S.ph = 17; S.mark = Date.now(); break;
    case 17: {
      if (!wait(500)) break;
      var d4 = frameDoc();
      note('A9b', 'blankDoc=' + (d4 ? (d4.location.href || '').slice(0, 24) : 'noframe')
        + ' src=' + (ctrF ? ctrF.getAttribute('src') : '-'));
      /* ⭐ 父页自己再问一次 —— 这一句才分得清「cookie 还在」和「cookie 没了但 iframe 是旧的」。 */
      fetch('/cmr/api/me').then(function(r){ note('A9me', 'parentMe=' + r.status); })
        .catch(function(e){ note('A9me', 'ERR ' + e.message); });
      note('A9tp', 'tp=' + tpNearAunt() + ' d=' + dAunt().toFixed(0));
      S.ph = 24; S.mark = Date.now(); break;
    }
    case 24:
      if (!wait(500)) break;
      note('A9near', 'near=' + AUNT.near + ' d=' + dAunt().toFixed(0));
      fire('c');
      S.ph = 18; S.mark = Date.now(); break;
    case 18: {
      if (!wait(3000)) break;
      var d5 = frameDoc();
      if (!d5 || d5.readyState !== 'complete') break;
      var auth5 = d5.getElementById('auth-screen'), app5 = d5.getElementById('app-screen');
      note('A9', 'plat=' + CENTER.plat
        + ' src=' + (ctrF ? ctrF.getAttribute('src') : '-')
        + ' authScreen=' + (hid(auth5) ? 'hidden' : 'SHOWN')
        + ' appScreen=' + (hid(app5) ? 'hidden' : 'shown')
        + ' heading=' + JSON.stringify((d5.getElementById('auth-heading') || {}).textContent || '')
        + ' hasForm=' + (d5.getElementById('auth-form') ? 'Y' : 'N'));
      S.ph = 19; break;
    }
    case 19: {
      var d6 = frameDoc();
      if (d6) d6.dispatchEvent(new KeyboardEvent('keydown',
        { key: 'Escape', code: 'Escape', bubbles: true, cancelable: true }));
      S.ph = 20; S.mark = Date.now(); break;
    }
    case 20:
      if (!wait(600)) break;
      note('A9c', 'plat=' + CENTER.plat);
      /* 收尾：把「补登」还原成真的，用它把 admin 重新种回去
         （验证"掉了能自己回来"—— 这才是地图的默认行为）。 */
      if (window.__atOrigEnsure) window.cmrEnsure = window.__atOrigEnsure;
      cmrEnsure().then(function(st){ note('A10', 'reEnsure=' + st + ' CENTER.cmr=' + CENTER.cmr); S.ph = 99; });
      S.mark = Date.now();
      S.ph = 22; break;
    case 22:
      if (!wait(8000)) break;
      note('A10', 'TIMEOUT CENTER.cmr=' + CENTER.cmr);
      S.ph = 99; break;
    }
  }

  var TICK = 0;
  var T = setInterval(function(){
    TICK++;
    if (S.ph >= 99) { clearInterval(T); flush(); return; }
    try { run(); } catch (e) { note('THROW', e.message + '@ph' + S.ph); S.ph = 99; }
    flush();
  }, 150);
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


# ============================================================================
# 极简 CDP 客户端 —— 只为「卡住时抓一张栈」这一个用途。
# 本机 node_modules 里没有 ws、pip 也未必能装，所以手搓一个 RFC6455 客户端
# （握手 + 客户端掩码文本帧）。只认 CDP 那些小 JSON，够用。
# ============================================================================
import base64
import socket
import struct


class _WS(object):
    def __init__(self, url):
        u = urllib.parse.urlparse(url)
        host, port = u.hostname, u.port or 80
        path = u.path + (('?' + u.query) if u.query else '')
        self.s = socket.create_connection((host, port), timeout=15)
        k = base64.b64encode(os.urandom(16)).decode()
        req = ("GET %s HTTP/1.1\r\nHost: %s:%d\r\nUpgrade: websocket\r\n"
               "Connection: Upgrade\r\nSec-WebSocket-Key: %s\r\n"
               "Sec-WebSocket-Version: 13\r\n\r\n" % (path, host, port, k))
        self.s.sendall(req.encode())
        buf = b""
        while b"\r\n\r\n" not in buf:
            c = self.s.recv(4096)
            if not c:
                raise IOError("WS 握手无响应")
            buf += c
        if b"101" not in buf.split(b"\r\n")[0]:
            raise IOError("WS 握手失败：%r" % buf.split(b"\r\n")[0])
        self._buf = buf.split(b"\r\n\r\n", 1)[1]

    def _rd(self, n):
        while len(self._buf) < n:
            c = self.s.recv(65536)
            if not c:
                raise IOError("WS 断了")
            self._buf += c
        out, self._buf = self._buf[:n], self._buf[n:]
        return out

    def send(self, obj):
        data = json.dumps(obj).encode()
        h = bytearray([0x81])
        n = len(data)
        if n < 126:
            h.append(0x80 | n)
        elif n < 65536:
            h.append(0x80 | 126); h += struct.pack(">H", n)
        else:
            h.append(0x80 | 127); h += struct.pack(">Q", n)
        m = os.urandom(4)
        h += m
        self.s.sendall(bytes(h) + bytes(b ^ m[i % 4] for i, b in enumerate(data)))

    def recv(self):
        while True:
            b0, b1 = self._rd(2)
            op, n = b0 & 0x0f, b1 & 0x7f
            if n == 126:
                n = struct.unpack(">H", self._rd(2))[0]
            elif n == 127:
                n = struct.unpack(">Q", self._rd(8))[0]
            masked = b1 & 0x80
            mk = self._rd(4) if masked else None
            pl = self._rd(n) if n else b""
            if masked:
                pl = bytes(b ^ mk[i % 4] for i, b in enumerate(pl))
            if op == 0x9:                                   # ping → pong
                self.s.sendall(bytes([0x8a, 0x80 | len(pl)]) + os.urandom(4))
                continue
            if op == 0x8:
                raise IOError("WS 关闭帧")
            if op in (0x1, 0x2):
                try:
                    return json.loads(pl.decode('utf-8'))
                except ValueError:
                    continue


def _page_ws_url():
    try:
        data = json.load(urllib.request.urlopen('http://127.0.0.1:%d/json' % PORT, timeout=5))
    except Exception:
        return None
    for t in data:
        if t.get('type') == 'page' and t.get('url', '').startswith('http'):
            return t.get('webSocketDebuggerUrl')
    return None


def dump_stuck_stack(label='主线程卡住'):
    u"""卡住时贴上去看一眼：**页面到底还活着吗？活在那儿？**
    顺序很讲究 ——

      ① **先不暂停**问一句 `performance.now()`。回得来 ⇒ 主线程还能跑，
         那"标题不动"就是探针自己（interval 死/抛）的问题，不是地图卡了。
         回不来 ⇒ 主线程真占住了。
      ② 真占住了再 `Debugger.pause` 抓栈 —— 只有这时栈才有意义。
    """
    url = _page_ws_url()
    if not url:
        print('  !! %s：拿不到 CDP 页面地址' % label)
        return
    ws = None
    try:
        ws = _WS(url)
        ws.s.settimeout(6.0)
        ws.send({"id": 1, "method": "Runtime.evaluate",
                 "params": {"expression": "String(performance.now())", "returnByValue": True}})
        alive = None
        try:
            r = ws.recv()
            alive = (r.get('result', {}).get('result', {}) or {}).get('value')
        except Exception:
            pass
        print('\n==== %s ====' % label)
        print('   alive? performance.now() -> %r  %s'
              % (alive, '（主线程还能跑）' if alive is not None else '（**问不答 = 主线程被占住**）'))

        ws.send({"id": 2, "method": "Debugger.enable"})
        ws.send({"id": 3, "method": "Debugger.pause"})
        ws.s.settimeout(8.0)
        for _ in range(200):
            m = ws.recv()
            if m.get('method') == 'Debugger.paused':
                print('   栈：')
                for fr in m['params']['callFrames'][:18]:
                    loc = fr.get('location', {})
                    print('     %-28s %s' % (fr.get('functionName') or '(anon)',
                                             loc.get('lineNumber')))
                ws.send({"id": 4, "method": "Runtime.evaluate",
                         "params": {"expression":
                                    "JSON.stringify({pl:typeof player!=='undefined'?[player.x|0,player.y|0]:'-',"
                                    "aunt:typeof AUNT!=='undefined'?[AUNT.x|0,AUNT.y|0,AUNT.near,AUNT.open]:'-',"
                                    "plat:CENTER.plat,waiting:CENTER.waiting,talk:typeof AUNT!=='undefined'?AUNT.talking:'-',"
                                    "ctrP:document.getElementById('ctrP').hidden,"
                                    "ctrSrc:document.getElementById('ctrF').getAttribute('src'),"
                                    "atip:document.getElementById('atip').hidden})",
                                    "returnByValue": True}})
                _deadline = time.time() + 6
                got = None
                while time.time() < _deadline and got is None:
                    try:
                        r = ws.recv()
                    except Exception:
                        break
                    if r.get('id') == 4:
                        got = (r.get('result', {}).get('result', {}) or {}).get('value')
                print('   现场：%s' % (got,))
                ws.send({"id": 5, "method": "Debugger.resume"})
                return
    except Exception as e:
        print('\n  !! %s：CDP 抓栈失败（%s）—— 多半不是 JS 死循环，而是渲染进程整个没了' % (label, e))
    finally:
        try:
            if ws:
                ws.s.close()
        except Exception:
            pass

def kill_profile():
    ps = ("Get-CimInstance Win32_Process -Filter \"Name='chrome.exe'\" | "
          "Where-Object { $_.CommandLine -like '*_atprobe_prof*' } | "
          "ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }")
    subprocess.run(['powershell', '-NoProfile', '-Command', ps], capture_output=True)


def main():
    if not os.path.exists(CHROME):
        raise SystemExit('找不到 Chrome：' + CHROME)
    html = io.open(os.path.join(PROJ, u'像素校园_全校地图.html'), encoding='utf-8').read()
    assert '</body>' in html, '源产物里没有 </body>'
    gen = html.replace('</body>', PROBE + '</body>')
    # ⚠️ 必须落在 frontend/public/ 里，`/cmr` 代理才跟得上（同一个 Vite 服务在发它）。
    assert os.path.isdir(os.path.dirname(PUB)), \
        'frontend/public 不存在（%s）—— 先跑一次启动器把前端铺起来' % os.path.dirname(PUB)
    io.open(PUB, 'w', encoding='utf-8', newline='\n').write(gen)

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
    print(u'阿姨探针  (真登录 → 走到食堂门口 → 按 C → 抽屉里应直接是登录态；全程约 30~80s)')
    try:
        t_quiet = time.time()
        for i in range(MAXTICKS):
            time.sleep(0.5)
            t = read_title()
            if t != last:
                last = t
                t_quiet = time.time()
                if 'A10=' in t:
                    done = True
                    break
                if t.startswith('ATP|'):
                    print('  t=%5.1fs  %s' % (i * 0.5, t[4:][:180]))
            elif not done and time.time() - t_quiet > 8.0:
                # 标题 8 秒没动 ⇒ 主线程不是"慢"，是**卡死**。抓栈，别干等。
                print('  t=%5.1fs  ...标题 8 秒没动，抓栈：' % (i * 0.5))
                dump_stuck_stack()
                break
        if done:
            print('\n==== 最终 ====')
            print(last[4:].replace(' | ', '\n'))
        else:
            print('\n!! 没跑完（%d 个 tick 用光）。最后一次读到：' % MAXTICKS)
            print(last)
    finally:
        p.terminate()
        kill_profile()
        # ⚠️ 收尾必须**逐个精确路径**删（交付目录里绝不扫描式清理）。
        for _f in (PUB,):
            try:
                if os.path.exists(_f):
                    os.remove(_f)
            except OSError:
                pass


if __name__ == '__main__':
    main()
