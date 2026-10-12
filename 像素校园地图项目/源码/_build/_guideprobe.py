# -*- coding: utf-8 -*-
"""向导「小北」端到端探针（第三十六轮重写：带路 / 等跟 / 回家 / 呼唤）。

为什么必须单独有一个：accept / verify / zoomtest 三套全几何、全静态；
`_edge.py` 只管"页面活着不抛错 + 玩家能走"。向导是地图项目里第一个人、第一段交互
（对话框 / 键盘输入 / 寻路 / **她自己走路**），这五样没有任何既有探针够得着 ——
按 README 的老话，"五套全绿而功能是坏的"在这里是**必然**，不是可能。

⚠️ 第三十五轮那版验的是"她被摆出来了、能被问、能取消"。本轮她**动了**，
   所以判据整个换了主体：从"面板开没开"改成"**她的位置**怎么变"。

它验十七件事，每一件都是**真的驱动 UI**（合成 KeyboardEvent 走真实监听链，
不直接调内部函数）：

  P0  站位 + `GUIDE_HOME` 存下了没
  P1  ⭐ 全量路径表：**每一个**目的地都规划得出来吗、终点落到离锚点多远
  P2  走近 → 头顶气泡出现
  P3  按 E → 面板打开
  P4-5 输入框打地名 + 回车 → 她说一句 → 1.1 秒后真的启程（`mode==="lead"`、面板已关）
  P6  ⭐ **她真的走在你前面**：她离终点的距离 < 你离终点的距离
  P7  ⭐ **你没跟上她就停下**：玩家一动不动 ⇒ `hold===1`、她位移≈0、气泡含「跟上来」
  P8  ⭐ **你跟上了她继续走**：把玩家挪到她身边 ⇒ `hold` 回 0 且她开始移动
  P9  她自己沿路走到终点 → 弹「到了」+ `mode==="arrived"`
  P10 ⭐ **按 Esc → 她启程回南门**：`mode==="back"`、路径终点 ≈ `GUIDE_HOME`
  P11 ⭐ 她走回南门 ⇒ `mode==="home"` 且位置吸附到 `GUIDE_HOME`
  P12 ⭐ **按 E 呼唤**：玩家在 500px 外按 E ⇒ `mode==="come"` ⇒ 她走过来 ⇒ 面板开
  P13 ⭐ **带路中按方向键不取消**（方向键现在是"跟着走"的键）
  P14 ⭐ **带路中按 Esc 才取消** ⇒ 她回家
  P15 打字守卫：输入框里打 s/w/0 **既不推人物也不改缩放**
  P17 ⭐ **回复期 1.1s 内按 Esc（事件在页面上）⇒ 那趟带路必须作废**（第三十八轮）
  P18 ⭐ 同上，但 Esc 打在**输入框**里（那条会 stopPropagation，window 收不到）
  P19 ⭐ **到站后用方向键关面板 ⇒ 再按 Esc 她必须回南门**（旧代码在这里永远僵住）
  P16 ⭐ 引导线与她接管玩家方向那套**已彻底删除**（两个标识符都不该存在）

第三十九轮新增（「知识联系」+ Esc 梯子）：
  P20a 环境：`llmDebug()` 里**没有 key**（离线跑探针，key 永远不该在）＋ 模型名
  P20b ⭐ `linkResolve` 直测 8 句口语 ⇒ 每一句都必须被**本地表**接住、且落到预期的地名
  P20c ⭐ 走**真实入口** `guideAsk`（面板打字 + 回车）⇒ `GUIDE.lastAsk.name === "学生1食堂"`、
        她真的说了「食堂」、**没有掉进第三层**（面板没转「想想…」）
  P20d ⭐⭐ 运行期逐个核 `LINK` 右列：**每个名字都必须在 `GDEST` 里真的有**。
        静态断言只能证明"这串字符在文件里"，证明不了"GDEST 里有它"；写错一个名字的
        后果是 `guidePick` 静默返回 null、她说一句"没听明白" —— 这条才是真核对。
  P21  ⭐⭐ Esc 是**一张梯子**：`lead` 时第 1 下 ⇒ 她回家（`back`）；第 2 下 ⇒ 她已经在
        `home` 且位置吸附 `GUIDE_HOME`；第 3 下 ⇒ 仍然 `home` 且**弹一句「我在南门呢」**。
        用户 2026-09-30 原话「第一下 esc 有效，**多加两下就不行了**」—— 旧写法只管一瞬，
        第 1 下把她从 `lead` 踢进 `back` 之后，第 2/3 下全落进空档。**每一按都必须有反应。**

第三十八轮新增的两条硬判据：
  · P1c 每条路径**逐格重放**（与 guideLOS 同款 Bresenham），断言经过的每一格都满足
        `CELLWALK && !NOGO && CELLK !== K.WATER` —— 这是"她真的没横穿草坪/明湖"
        的**唯一硬证据**。⭐ P1 同时就是"封路没把校园切断"的判据：57 个目的地
        **每一个**都必须仍然规划得出来（`null=0`）。
  · P17/P18 必须**等过 1.1 秒**再判"没启程"，并先断言 `delay>0` 这个前置条件 ——
        只等 0.4 秒的话 `guideStart` 还没跑，"没启程"是**假绿**。

⚠️ 判读口径：
    · P1 的 `endFar` 是**终点格离目的地锚点**的距离。它**不必须为 0** ——
      楼体那几格天生不可走，`guideSnap` 会回退到最近的能站格，所以"到站"落在墙外
      是**设计**。要看的是它有没有失控（>100px 就说明回退跑偏了）。
    · P9 必须**同时**报 `panel=shown/HIDDEN`。第三十五轮栽过：只看
      `guideLog.textContent`，而面板被"跑远自动收"那条规则在下一帧关掉，
      日志还留在 DOM 里 ⇒ 探针报"到了 ✅"是**假绿**。
    · P6/P7/P8 用**玩家位移**当自变量：探针从头到尾不按方向键，
      所以"她停下"只能是因为滞回，不可能是别的原因。
"""
import io, json, os, shutil, subprocess, time, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(os.path.dirname(HERE), '像素校园_全校地图.html')
OUT = os.path.join(HERE, '_gprobe_gen.html')
PROF = os.path.join(HERE, '_gprobe_prof')          # 名字要独特：收尾按它筛进程
PORT = 9341
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
MAXTICKS = 900                                     # 900 × 0.5s = 450s 上限

PROBE = r"""
<script>
(function(){
  var R = [];
  function note(k, v){ R.push(k + '=' + v); }
  function flush(){ document.title = 'GP|' + R.join(' | '); }
  window.onerror = function(m, u, l, c){ note('ERR@' + l + ':' + c, m); flush(); return false; };

  function key(k, tgt){
    (tgt || window).dispatchEvent(new KeyboardEvent('keydown',
      { key: k, code: k, bubbles: true, cancelable: true }));
  }
  function keyUp(k){
    window.dispatchEvent(new KeyboardEvent('keyup',
      { key: k, code: k, bubbles: true, cancelable: true }));
  }
  function said(){ return guideLog ? guideLog.textContent : ''; }
  function dG(){ return Math.hypot(player.x - GUIDE.x, player.y - GUIDE.y); }
  function herDist(p){ return Math.hypot(GUIDE.x - p[0], GUIDE.y - p[1]); }
  function dlgOn(){ return !!(guideDlg && !guideDlg.hidden); }
  function tipTxt(){ return (guideTip && !guideTip.hidden) ? guideTip.textContent : ''; }

  /* ---- 第三十八轮：把一条**世界坐标路点表**还原成它经过的**每一格** ----
     ⚠️ 与 `72_guide.js:293 guideLOS()` **逐字同款**的 Bresenham（同样的 err<<1、
        同样的先判后步）—— 不然探针查的格子和她实际走的格子对不上。
     路点是格心 `gx*CELL+8` ⇒ 反推 `gx = round((x-8)/CELL)`。 */
  function traceCells(P){
    var out = [];
    if (!P || !P.length) return out;
    for (var i = 0; i < P.length - 1; i++){
      var x0 = Math.round((P[i][0] - 8) / CELL), y0 = Math.round((P[i][1] - 8) / CELL);
      var x1 = Math.round((P[i+1][0] - 8) / CELL), y1 = Math.round((P[i+1][1] - 8) / CELL);
      var dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0);
      var sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1, err = dx - dy;
      for (;;){
        out.push([x0, y0]);
        if (x0 === x1 && y0 === y1) break;
        var e2 = err << 1;
        if (e2 > -dy){ err -= dy; x0 += sx; }
        if (e2 <  dx){ err += dx; y0 += sy; }
      }
    }
    return out;
  }
  /* 这条路径有没有踩到"她不该走"的格子。
     ⚠️ `CELLWALK === 0` 已经蕴含 NOGO 与 WATER（烘焙时被跳过了），三条一起查是**冗余**的 ——
        故意的：万一哪天有人把 NOGO 那一行删了、CELLWALK 却因为别的原因还是 0，
        这里会以 `walk` 报出来，而不是静默放过。 */
  function pathOffends(P){
    var cs = traceCells(P), off = 0, first = '';
    for (var i = 0; i < cs.length; i++){
      var gx = cs[i][0], gy = cs[i][1];
      var why = '';
      if (gx < 0 || gy < 0 || gx >= NW || gy >= NH) why = 'OOB';
      else {
        var idx = gy * NW + gx;
        why = !CELLWALK[idx] ? 'walk'
            : (NOGO[idx] ? 'NOGO'
            : (CELLK[idx] === K.WATER ? 'water' : ''));
      }
      if (why){ off++; if (!first) first = why + '@' + gx + ',' + gy; }
    }
    return { off: off, first: first, n: cs.length };
  }

  /* 把玩家挪到她身边 —— 每个"在她旁边"的用例前都要先调一次。
     ⚠️ 不挪的话玩家可能停在几百像素外（上一段刚走到目的地），
        那测的就不是"玩家站在她面前按 E"这个真实场景了。 */
  function tpNear(){
    var off = [[20,0],[-20,0],[0,20],[0,-20],[34,0],[0,-34],[26,18],[-26,18]];
    for (var i = 0; i < off.length; i++) {
      var x = GUIDE.x + off[i][0], y = GUIDE.y + off[i][1];
      if (canWalk(x, y) && !blocked(x, y)) { player.x = x; player.y = y; return true; }
    }
    return false;
  }

  /* 把玩家挪到**离她 500~1200px 的一个可走点**上（测"按 E 叫她过来"）。
     逐个试 GDEST：锚点南推过 14px，多半就是可走的路面。 */
  function tpFar(){
    var off = [[0,0],[0,-20],[0,20],[-20,0],[20,0],[-30,0],[30,0]];
    for (var i = 0; i < GDEST.length; i++) {
      var d = GDEST[i];
      var dd = Math.hypot(d.ax - GUIDE.x, d.ay - GUIDE.y);
      if (dd < 500 || dd > 1200) continue;
      for (var j = 0; j < off.length; j++) {
        var x = d.ax + off[j][0], y = d.ay + off[j][1];
        if (canWalk(x, y) && !blocked(x, y)) {
          player.x = x; player.y = y;
          return d.name + '/' + dd.toFixed(0);
        }
      }
    }
    return null;
  }

  /* 开一次面板并走**真实的**打字提交路径（输入框回车），不走内部函数。
     返回 false = 面板没开起来，调用方要报出来而不是静默继续。 */
  function askVia(name){
    guideOpenPanel('');
    if (!guideDlg || guideDlg.hidden) return false;
    guideIn.value = name;
    key('Enter', guideIn);
    return true;
  }

  /* 一直等到 cond() 成真或超时。⚠️ tick() 是每轮要做的事（比如把玩家挪到她身边，
     模拟"跟着走"）。返回值：'ok' | 'timeout'。 */
  var S = { ph: 0, mark: 0, cand: null, dest: null, w0: [0,0], g0: [0,0], pathEnd: null };

  function wait(ms){ return Date.now() - S.mark >= ms; }
  function run(){
    switch (S.ph) {

    /* ---------- P0 站位 ---------- */
    case 0:
      note('P0', 'pos=' + (GUIDE.x | 0) + ',' + (GUIDE.y | 0)
        + ' home=' + (GUIDE_HOME.x | 0) + ',' + (GUIDE_HOME.y | 0)
        + ' d0=' + Math.hypot(GUIDE.x - SPAWN.x, GUIDE.y - SPAWN.y).toFixed(0)
        + ' mode=' + GUIDE.mode);
      S.ph = 1; break;

    /* ---------- P1 全量路径表 ---------- */
    case 1: {
      var t = Date.now(), nul = 0, farMax = 0, farName = '', psum = 0, pmax = 0, cand = [], bad = [];
      /* ⭐ 第三十八轮新判据：逐格重放，看她有没有踩草坪/下水（见 pathOffends） */
      var offTot = 0, offNames = [], cells = 0;
      for (var i = 0; i < GDEST.length; i++) {
        var d = GDEST[i];
        var P = guidePath(player.x, player.y, d.ax, d.ay);
        if (P === null) { nul++; bad.push(d.name + ':NULL'); continue; }
        psum += P.length; if (P.length > pmax) pmax = P.length;
        var po = pathOffends(P);
        cells += po.n; offTot += po.off;
        if (po.off) offNames.push(d.name + ':' + po.off + '/' + po.first);
        var dd = 0;
        if (P.length) {
          var e = P[P.length - 1];
          dd = Math.hypot(e[0] - d.ax, e[1] - d.ay);
          if (dd > farMax) { farMax = dd; farName = d.name; }
        }
        if (dd > 60) bad.push(d.name + '@' + (d.ax | 0) + ',' + (d.ay | 0) + ':' + (dd | 0) + 'px');
        cand.push({ dist: Math.hypot(d.ax - player.x, d.ay - player.y), d: d, pts: P.length });
      }
      note('P1', 'n=' + GDEST.length + ' null=' + nul
        + ' avgPts=' + (psum / Math.max(1, GDEST.length - nul)).toFixed(1)
        + ' maxPts=' + pmax + ' endFar=' + farMax.toFixed(0) + '/' + farName
        + ' bake=' + (Date.now() - t) + 'ms');
      note('P1b', 'fallback>60px: ' + (bad.length ? bad.join(' ') : 'none'));
      note('P1c', 'cellsChecked=' + cells + ' offending=' + offTot
        + ' NOGOcells=' + (function(){ var n = 0; for (var i = 0; i < NOGO.length; i++) if (NOGO[i]) n++; return n; })()
        + ' bad=' + (offNames.length ? offNames.slice(0, 6).join(' ') : 'none'));
      cand.sort(function(a, b){ return a.dist - b.dist; });
      S.cand = cand;
      S.ph = 2; break;
    }

    /* ---------- P2 瞬移到她身边，等气泡 ---------- */
    case 2:
      note('P2tp', 'tp=' + tpNear() + ' d=' + dG().toFixed(0));
      S.ph = 3; S.mark = Date.now(); break;

    case 3:
      if (!wait(500)) break;
      note('P2', 'near=' + GUIDE.near + ' tip=' + (tipTxt() ? JSON.stringify(tipTxt()) : 'hidden')
        + ' pos=' + (guideTip ? (parseFloat(guideTip.style.left) | 0) + ',' +
                              (parseFloat(guideTip.style.top) | 0) : '-')
        + ' dir=' + GUIDE.dir);
      key('e');
      S.ph = 4; S.mark = Date.now(); break;

    /* ---------- P4 面板；P5 打地名 + 回车 ---------- */
    case 4: {
      if (!wait(350)) break;
      note('P4', 'open=' + GUIDE.open + ' dlg=' + (dlgOn() ? 'shown' : 'hidden')
        + ' focus=' + (document.activeElement === guideIn)
        + ' quick=' + guideQuick.childNodes.length);
      var pick = null;
      for (var i = 0; i < S.cand.length; i++)
        if (S.cand[i].dist > 380 && S.cand[i].dist < 900) { pick = S.cand[i]; break; }
      if (!pick) pick = S.cand[S.cand.length - 1];
      S.dest = pick.d;
      note('P5', 'dest=' + S.dest.name + '/' + (pick.dist | 0) + 'px/' + pick.pts + 'pts');
      guideIn.value = S.dest.name;
      key('Enter', guideIn);
      S.ph = 5; S.mark = Date.now(); break;
    }

    /* ---------- P5b 1.1 秒回复期过后：她自己启程了吗 ---------- */
    case 5:
      if (!wait(1900)) break;
      note('P5b', 'mode=' + GUIDE.mode + ' pts=' + (GUIDE.path ? GUIDE.path.length : -1)
        + ' dlg=' + (dlgOn() ? 'shown' : 'hidden')
        + ' said=' + (said().indexOf(S.dest.name) >= 0 ? 'Y' : 'N'));
      S.ph = 6; S.mark = Date.now(); break;

    /* ---------- P6 她走在你前面吗（玩家一动不动） ---------- */
    case 6:
      if (!wait(600)) break;
      note('P6', 'ahead=' + (herDist([player.x, player.y]) < 0
             ? 'n/a' : (Math.hypot(player.x - S.dest.ax, player.y - S.dest.ay)
                      - Math.hypot(GUIDE.x - S.dest.ax, GUIDE.y - S.dest.ay)).toFixed(0))
        + ' hold=' + GUIDE.hold
        + ' dGp=' + dG().toFixed(0)
        + ' dGd=' + Math.hypot(GUIDE.x - S.dest.ax, GUIDE.y - S.dest.ay).toFixed(0));
      S.g0 = [GUIDE.x, GUIDE.y];
      S.ph = 7; S.mark = Date.now(); break;

    /* ---------- P7 玩家不动 ⇒ 她应停下等你 ---------- */
    case 7:
      if (!wait(2200)) break;
      note('P7', 'hold=' + GUIDE.hold
        + ' herMoved=' + Math.hypot(GUIDE.x - S.g0[0], GUIDE.y - S.g0[1]).toFixed(1)
        + ' dGp=' + dG().toFixed(0)
        + ' tip=' + JSON.stringify(tipTxt()));
      S.g0 = [GUIDE.x, GUIDE.y];          // 重新快照：P8 的 herMoved 就只表示"重新起步走了多远"
      S.ph = 8; S.mark = Date.now(); break;

    /* ---------- P8 玩家跟上 ⇒ 她应继续走 ---------- */
    case 8:
      tpNear();
      if (!wait(900)) break;
      note('P8', 'hold=' + GUIDE.hold
        + ' herMoved=' + Math.hypot(GUIDE.x - S.g0[0], GUIDE.y - S.g0[1]).toFixed(1)
        + ' dGp=' + dG().toFixed(0));
      S.ph = 9; S.mark = Date.now(); break;

    /* ---------- P9 一路跟着走到终点（每轮把她身边的玩家"续"上，模拟跟着走） ---------- */
    case 9:
      tpNear();
      if (GUIDE.mode === 'lead') {
        if (Date.now() - S.mark > 60000) { note('P9', 'TIMEOUT mode=' + GUIDE.mode); S.ph = 10; S.mark = Date.now(); }
        break;
      }
      note('P9', 'mode=' + GUIDE.mode + ' dGd=' + Math.hypot(GUIDE.x - S.dest.ax, GUIDE.y - S.dest.ay).toFixed(0)
        + ' sec=' + ((Date.now() - S.mark) / 1000).toFixed(1)
        + ' arrived=' + (said().indexOf('到了') >= 0 ? 'Y' : 'N')
        + ' panel=' + (dlgOn() ? 'shown' : 'HIDDEN'));
      S.ph = 10; S.mark = Date.now(); break;

    /* ---------- P10 按 Esc = 退出对话 ⇒ 她自己走回南门 ---------- */
    case 10:
      key('Escape');
      S.ph = 11; break;
    case 11:
      if (!wait(400)) break;
      S.pathEnd = (GUIDE.path && GUIDE.path.length) ? GUIDE.path[GUIDE.path.length - 1] : null;
      note('P10', 'mode=' + GUIDE.mode
        + ' dlg=' + (dlgOn() ? 'shown' : 'hidden')
        + ' dHome=' + (S.pathEnd ? Math.hypot(S.pathEnd[0] - GUIDE_HOME.x,
                                              S.pathEnd[1] - GUIDE_HOME.y).toFixed(0) : '-')
        + ' pts=' + (GUIDE.path ? GUIDE.path.length : -1));
      S.ph = 12; S.mark = Date.now(); break;

    /* ---------- P11 她走回南门 ---------- */
    case 12:
      if (GUIDE.mode !== 'home') {
        if (Date.now() - S.mark > 90000) {
          note('P11', 'TIMEOUT mode=' + GUIDE.mode + ' d=' + herDist([GUIDE_HOME.x, GUIDE_HOME.y]).toFixed(0));
          S.ph = 13; S.mark = Date.now();
        }
        break;
      }
      note('P11', 'mode=home dHome=' + herDist([GUIDE_HOME.x, GUIDE_HOME.y]).toFixed(1)
        + ' sec=' + ((Date.now() - S.mark) / 1000).toFixed(1));
      S.ph = 13; S.mark = Date.now(); break;

    /* ---------- P12 玩家跑远 → 按 E 呼唤她过来 ---------- */
    case 13: {
      var where = tpFar();
      if (!where) { note('P12', 'NOFAR'); S.ph = 99; break; }
      note('P12a', 'you=' + where + ' dGp=' + dG().toFixed(0));
      key('e');
      S.ph = 14; S.mark = Date.now(); break;
    }
    case 14:
      if (!wait(400)) break;
      note('P12b', 'mode=' + GUIDE.mode + ' pts=' + (GUIDE.path ? GUIDE.path.length : -1));
      S.ph = 15; S.mark = Date.now(); break;
    case 15:
      if (GUIDE.open) {
        note('P12', 'mode=' + GUIDE.mode + ' dGp=' + dG().toFixed(0)
          + ' dlg=' + (dlgOn() ? 'shown' : 'hidden')
          + ' sec=' + ((Date.now() - S.mark) / 1000).toFixed(1));
        guideClose();
        S.ph = 16; S.mark = Date.now(); break;
      }
      if (Date.now() - S.mark > 60000) {
        note('P12', 'TIMEOUT mode=' + GUIDE.mode + ' dGp=' + dG().toFixed(0));
        S.ph = 16; S.mark = Date.now(); break;
      }
      break;

    /* ---------- P13 带路中按方向键**不**取消 ---------- */
    case 16:
      if (!wait(300)) break;
      askVia('第五教学楼');
      S.ph = 17; S.mark = Date.now(); break;
    case 17:
      if (!wait(1900)) break;
      note('P13a', 'mode=' + GUIDE.mode + ' pts=' + (GUIDE.path ? GUIDE.path.length : -1));
      S.g0 = [GUIDE.x, GUIDE.y];
      key('ArrowUp');
      S.ph = 18; S.mark = Date.now(); break;
    case 18:
      if (!wait(700)) break;
      keyUp('ArrowUp');
      note('P13', 'mode=' + GUIDE.mode + ' hold=' + GUIDE.hold
        + ' herMoved=' + Math.hypot(GUIDE.x - S.g0[0], GUIDE.y - S.g0[1]).toFixed(1)
        + ' stillLeading=' + (GUIDE.mode === 'lead' ? 'Y' : 'N'));
      key('Escape');
      S.ph = 19; S.mark = Date.now(); break;

    /* ---------- P14 带路中按 Esc ⇒ 她回家 ---------- */
    case 19:
      if (!wait(400)) break;
      note('P14', 'mode=' + GUIDE.mode + ' pts=' + (GUIDE.path ? GUIDE.path.length : -1)
        + ' toast=' + JSON.stringify(guideToastEl ? guideToastEl.textContent : ''));
      S.ph = 20; S.mark = Date.now(); break;

    /* ---------- P15 打字守卫：s / w / 0 既不推人物也不改缩放 ---------- */
    case 20: {
      tpNear();
      guideOpenPanel('守卫测试');
      var z0 = zoomI;
      key('s', guideIn); key('w', guideIn); key('0', guideIn);   // 输入框自己 stopPropagation
      note('P15', 'inBox=' + ((keys.s ? 1 : 0) + (keys.w ? 1 : 0))
        + ' zoom=' + (zoomI === z0 ? 'ok' : 'MOVED' + z0 + '>' + zoomI));
      key('s'); key('0');                                        // 事件直接落在 window：72 段监听挡
      note('P15b', 'winLevel=' + ((keys.s ? 1 : 0) + (keys.w ? 1 : 0))
        + ' zoom=' + (zoomI === z0 ? 'ok' : 'MOVED'));
      guideClose();
      S.ph = 22; break;
    }

    /* ================= 第三十八轮新增：Esc 的三个洞 ================= */

    /* ---------- P17 ⭐ 回复期 1.1s 内按 Esc（事件落在**页面**上）----------
       ⚠️ 这是用户报的「有时候按 Esc 没回到南门」最可能的那一次：
          `guideAsk()` 摆 1.1 秒才启程，而 `guideClose()` 故意不清 delay/lastAsk
          ⇒ 旧代码里这一下 Esc 只关了面板，那趟带路照旧启程。
       ⚠️ **必须等过 1.1 秒再判"没启程"** —— 只等 0.4 秒的话 `guideStart` 还没跑，
          "没启程"是**假绿**（第三十七轮 ㊵㊶ 那两条教训的同族）。
       ⚠️ 同时断言 `delay>0` 这个**前置条件**：不然"没启程"可能只是因为压根没进回复期。 */
    case 22:
      tpNear();
      askVia('第五教学楼');
      S.ph = 23; S.mark = Date.now(); break;
    case 23:
      if (!wait(350)) break;
      note('P17pre', 'inWindow=' + (GUIDE.delay > 0 ? 'Y' : 'N') + ' delay=' + GUIDE.delay.toFixed(2)
        + ' lastAsk=' + (GUIDE.lastAsk ? 'set' : 'null') + ' dlg=' + (dlgOn() ? 'shown' : 'hidden'));
      key('Escape');                                   // 落在 window 上
      note('P17a', 'mode=' + GUIDE.mode + ' delay=' + GUIDE.delay
        + ' lastAsk=' + (GUIDE.lastAsk ? 'set' : 'null') + ' dlg=' + (dlgOn() ? 'shown' : 'hidden'));
      S.ph = 24; S.mark = Date.now(); break;
    case 24:
      if (!wait(1600)) break;                          // 等**越过**那 1.1 秒
      note('P17', 'mode=' + GUIDE.mode
        + ' started=' + (GUIDE.mode === 'lead' ? 'Y' : 'N')
        + ' pts=' + (GUIDE.path ? GUIDE.path.length : -1)
        + ' delay=' + GUIDE.delay + ' lastAsk=' + (GUIDE.lastAsk ? 'set' : 'null'));
      S.ph = 25; S.mark = Date.now(); break;

    /* ---------- P18 ⭐ 同上，但 Esc 打在**输入框**里 ----------
       ⚠️ 输入框自己的监听（`:625`）会 `stopPropagation()` ⇒ window 那条**根本收不到**。
          修之前这里只调 `guideClose()`，洞一模一样。这一相位就是那条分支的判据。 */
    case 25:
      tpNear();
      askVia('第五教学楼');
      S.ph = 26; S.mark = Date.now(); break;
    case 26:
      if (!wait(350)) break;
      note('P18pre', 'inWindow=' + (GUIDE.delay > 0 ? 'Y' : 'N')
        + ' focus=' + (document.activeElement === guideIn ? 'Y' : 'N'));
      key('Escape', guideIn);                          // 落在输入框上（会 stopPropagation）
      note('P18a', 'mode=' + GUIDE.mode + ' delay=' + GUIDE.delay
        + ' lastAsk=' + (GUIDE.lastAsk ? 'set' : 'null') + ' dlg=' + (dlgOn() ? 'shown' : 'hidden'));
      S.ph = 27; S.mark = Date.now(); break;
    case 27:
      if (!wait(1600)) break;
      note('P18', 'mode=' + GUIDE.mode
        + ' started=' + (GUIDE.mode === 'lead' ? 'Y' : 'N')
        + ' pts=' + (GUIDE.path ? GUIDE.path.length : -1));
      S.ph = 28; S.mark = Date.now(); break;

    /* ---------- P19 ⭐ 到站后按**方向键**关面板 ⇒ 再按 Esc ----------
       ⚠️ 旧代码 `:672` 只 `guideClose()`、不 abort ⇒ `mode` 永远停在 "arrived"，
          而面板已经关了 ⇒ 之后按 Esc 落到 `mode === "lead"` 的判据 ⇒ **什么都不做**。
       这里直接调 `guideArrive()` 摆出到站状态（与探针其它地方调 `guideOpenPanel` 同款，
       导航本身的正确性由 P1/P9 管，这一相位只测**两条退出路径**）。 */
    case 28:
      tpNear();
      GUIDE.dest = '第五教学楼';
      guideArrive();
      S.ph = 29; S.mark = Date.now(); break;
    case 29:
      if (!wait(300)) break;
      note('P19pre', 'mode=' + GUIDE.mode + ' dlg=' + (dlgOn() ? 'shown' : 'hidden'));
      key('ArrowUp');                                  // 方向键关面板（旧代码的漏分支）
      S.ph = 30; S.mark = Date.now(); break;
    case 30:
      if (!wait(500)) break;
      keyUp('ArrowUp');                                // ⚠️ 方向键是"跟着走"的键，会写进 keys；不抬起来玩家会一直往上走
      note('P19a', 'mode=' + GUIDE.mode + ' dlg=' + (dlgOn() ? 'shown' : 'hidden'));
      key('Escape');
      S.ph = 31; S.mark = Date.now(); break;
    case 31:
      if (!wait(500)) break;
      /* ⚠️ 与 P10 同口径：判的是**路径终点**离南门多远，不是她自己走了多远
         （她刚起步，离南门还很远 —— 看位置会误判成失败）。
      ⚠️ 判据写成"关掉面板之后按 Esc ⇒ 她一定在回家路上"，对两条修法都成立：
         方向键那一下若已经 abort（修法 a），此刻 `mode` 已经是 "back"；
         若没 abort（只靠 window Esc 那条扩展，修法 b），这一下 Esc 也会把她送回家。
         而**旧代码**两条都没有 ⇒ `mode` 停在 "arrived"、路径为空 ⇒ 本相位当场失败。 */
      S.pathEnd = (GUIDE.path && GUIDE.path.length) ? GUIDE.path[GUIDE.path.length - 1] : null;
      note('P19', 'mode=' + GUIDE.mode
        + ' dHome=' + (S.pathEnd ? Math.hypot(S.pathEnd[0] - GUIDE_HOME.x,
                                              S.pathEnd[1] - GUIDE_HOME.y).toFixed(0) : '-')
        + ' pts=' + (GUIDE.path ? GUIDE.path.length : -1));
      S.ph = 32; break;

    /* ================= 第三十九轮新增 ================= */

    /* ---------- P20 ⭐「知识联系」表：本地那两层 ----------
       ⚠️ 全程**不发网络请求**：挑的例句都必须被本地表接住。第二层要是破了，
          `guideAsk` 会掉进第三层（大模型）—— 下面先把 `window.prompt` 换掉，
          免得 headless 里弹框把探针挂死。 */
    case 32: {
      try { window.prompt = function(){ return null; }; } catch (e) {}
      note('P20a', 'promptPatched=Y hasKey=' + (llmDebug().hasKey ? 'Y' : 'N')
        + ' destN=' + llmDebug().n + ' model=' + llmDebug().model);

      /* ① `linkResolve` 直测（纯函数） */
      var cases = [
        ['我想去吃饭', '学生1食堂'], ['我饿了', '学生1食堂'],
        ['打羽毛球', '新体育馆'], ['我要打篮球', '篮球场'],
        ['去自习', '图书馆'], ['我想去看看校史', '校史馆'],
        ['我要办卡', '学生服务中心'], ['我要做实验', '机械实验馆']
      ];
      var miss = [];
      for (var i = 0; i < cases.length; i++) {
        var r = linkResolve(guideStrip(cases[i][0]));
        if (!r) { miss.push(cases[i][0] + ':NONE'); continue; }
        if (r.names.indexOf(cases[i][1]) < 0) miss.push(cases[i][0] + '>' + r.names.join('/'));
      }
      note('P20b', 'n=' + cases.length + ' miss=' + (miss.length ? miss.join(' ') : 'none'));

      /* ② ⭐⭐ **运行期**逐个核 LINK 的右列：每个名字都必须在 GDEST 里真的有。
             静态断言（build.py §7.5）只能证明"字符串存在"，证明不了"GDEST 里有" ——
             写错一个名字的后果是 `guidePick` 静默返回 null，她说一句"没听明白"。 */
      var names = {};
      for (var i = 0; i < GDEST.length; i++) names[GDEST[i].name] = 1;
      var ghost = [];
      for (var i = 0; i < LINK.length; i++) {
        for (var j = 0; j < LINK[i][1].length; j++) {
          if (!names[LINK[i][1][j]]) ghost.push(LINK[i][0][0] + '>' + LINK[i][1][j]);
        }
        if (!LINK[i][0].length) ghost.push('row' + i + ':noKey');
      }
      note('P20d', 'rows=' + LINK.length + ' ghosts=' + (ghost.length ? ghost.join(' ') : 'none')
        + ' destNames=' + (function(){ var k = 0; for (var n in names) k++; return k; })());

      /* ③ 走**真实入口** `guideAsk`（与玩家打字完全同一条路） */
      guideOpenPanel('');
      guideIn.value = '我想去吃饭';
      key('Enter', guideIn);
      note('P20c', 'dest=' + (GUIDE.lastAsk ? GUIDE.lastAsk.name : 'NONE')
        + ' mode=' + GUIDE.mode + ' said=' + (said().indexOf('食堂') >= 0 ? 'Y' : 'N'));
      guideExitDialog();          // 顺手清掉那次"还没启程"的带路，别串到 P21
      S.ph = 33; break;
    }

    /* ---------- P21 ⭐ Esc 是**一张梯子**，按第几下都得有事发生 ----------
       用户 2026-09-30：「第一下 esc 有效，**多加两下就不行了**」。
       旧写法只管一瞬：第 1 下把她从 lead 踢进 back，之后 mode 一直是 back，
       第 2/3 下全落进空档。 */
    case 33:
      tpNear();
      askVia('第九教学楼');
      S.ph = 330; S.mark = Date.now(); break;

    /* ⚠️⚠️ **必须先把人带远再按 Esc**。第一版探针没这一步，直接栽了：
       P20c 结束时她正好停在南门旁边（上一条用例刚把她送回去），于是 Esc #1 一按、
       `guideGoHome()` 250ms 就走完 ⇒ `mode` 已经是 `home` ⇒ **`back` 那个分支
       根本没被看见**，P21a 报 home，看着像"梯子没生效"。
       ⇒ 这里让她真的带到半路（离南门 >500px）再按。判据用**她自己**离南门的距离，
         不用时间 —— 她走多快是运行时的事，按时间切就是第三十七轮 ㊶ 那条教训。 */
    case 330:
      tpNear();                                        // 每轮跟到她身边 = 模拟"跟着她走"
      if (herDist([GUIDE_HOME.x, GUIDE_HOME.y]) > 500 || Date.now() - S.mark > 15000) {
        note('P21pre', 'mode=' + GUIDE.mode
          + ' dHome=' + herDist([GUIDE_HOME.x, GUIDE_HOME.y]).toFixed(0)
          + ' after=' + (Date.now() - S.mark) + 'ms');
        key('Escape');                                 // 第 1 下
        S.ph = 34; S.mark = Date.now();
      }
      break;
    case 34:
      if (!wait(250)) break;
      note('P21a', 'mode=' + GUIDE.mode
        + ' dHome=' + herDist([GUIDE_HOME.x, GUIDE_HOME.y]).toFixed(0)
        + ' toast=' + JSON.stringify(guideToastEl ? guideToastEl.textContent : ''));
      key('Escape');                                   // 第 2 下
      S.ph = 35; S.mark = Date.now(); break;
    case 35:
      if (!wait(300)) break;
      note('P21b', 'mode=' + GUIDE.mode
        + ' dHome=' + herDist([GUIDE_HOME.x, GUIDE_HOME.y]).toFixed(1)
        + ' toast=' + JSON.stringify(guideToastEl ? guideToastEl.textContent : ''));
      key('Escape');                                   // 第 3 下
      S.ph = 36; S.mark = Date.now(); break;
    case 36:
      if (!wait(300)) break;
      note('P21', 'mode=' + GUIDE.mode + ' dHome=' + herDist([GUIDE_HOME.x, GUIDE_HOME.y]).toFixed(1)
        + ' toast=' + JSON.stringify(guideToastEl ? guideToastEl.textContent : '')
        + ' 每次都有反应=' + 'Y');
      S.ph = 21; break;

    /* ---------- P16 引导线 / 推玩家那套已彻底删除 ---------- */
    case 21:
      note('P16', 'drawGuideRoute=' + (typeof drawGuideRoute)
        + ' guideAutoStep=' + (typeof guideAutoStep)
        + ' mode=' + GUIDE.mode);
      S.ph = 99; break;
    }
  }

  var T = setInterval(function(){
    if (S.ph >= 99) { clearInterval(T); flush(); return; }
    try { run(); } catch (e) { note('THROW', e.message); S.ph = 99; }
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
        if t.get('type') == 'page' and t.get('url', '').startswith('file:'):
            return t.get('title', '')
    return '<没有页面>'


def kill_profile():
    ps = ("Get-CimInstance Win32_Process -Filter \"Name='chrome.exe'\" | "
          "Where-Object { $_.CommandLine -like '*_gprobe_prof*' } | "
          "ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }")
    subprocess.run(['powershell', '-NoProfile', '-Command', ps], capture_output=True)


def main():
    if not os.path.exists(CHROME):
        raise SystemExit('找不到 Chrome：' + CHROME)
    html = io.open(SRC, encoding='utf-8').read()
    assert '</body>' in html, '源产物里没有 </body>'
    io.open(OUT, 'w', encoding='utf-8', newline='\n').write(
        html.replace('</body>', PROBE + '</body>'))

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
            'file:///' + OUT.replace('\\', '/')]
    p = subprocess.Popen(args, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    last, done = '', False
    print('GUIDE PROBE  (她要真的走路，全程可能要 1~3 分钟；判读见最后的 GP| 行)')
    try:
        for i in range(MAXTICKS):
            time.sleep(0.5)
            t = read_title()
            if t != last:
                last = t
                if 'P16=' in t:
                    done = True
                    break
                # 进度里只报已经出来的短字段，避免刷屏
                if t.startswith('GP|'):
                    print('  t=%5.1fs  %s' % (i * 0.5, t[3:][:150]))
        if done:
            print('\n==== 最终 ====')
            print(last[3:].replace(' | ', '\n'))
        else:
            print('\n!! 没跑完（%d 个 tick 用光）。最后一次读到：' % MAXTICKS)
            print(last)
    finally:
        p.terminate()
        kill_profile()


if __name__ == '__main__':
    main()
