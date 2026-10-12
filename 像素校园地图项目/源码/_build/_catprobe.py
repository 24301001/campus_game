# -*- coding: utf-8 -*-
"""猫宠（校园猫谱）端到端探针 —— 第四十三轮 2026-10-09。

为什么必须单独有一个：accept / verify / zoomtest 三套全几何、全静态；`_edge.py` 只管
"页面活着不抛错 + 玩家能走"；`_guideprobe.py` 只管小北。**猫这一整套（作息 / 领地游走 /
好感记忆 / 档位判定 / 距离触发）没有任何既有探针够得着** —— 按 README 的老话，
"五套全绿而功能是坏的"在这里是**必然**，不是可能。

⚠️ 与 `_guideprobe.py` 的口径差一处，说清楚：小北那边有真 UI（对话框），所以那边
   **一律合成 KeyboardEvent 走真实监听链、绝不直调内部函数**。猫这一轮**还没有 UI**
   （动作按钮是下一步），所以这里只能直接驱动那两个"游戏每帧自己也会调"的入口：
     · `catTick(dt)` —— 主循环的心跳（build.py 补丁 22 挂的）
     · `catFeed(c)`  —— 动作按钮要调的那一个函数
   两者都是**产品代码的入口**，不是探针专用的后门。UI 接上之后（下一步）必须
   再加一条"点按钮"的用例，那时才算真的端到端。

它验的每一条都对着 `mvp范围功能\\猫宠.md §九` 那张验收表：

  C0  环境：4 只猫都建出来了、每只的落脚点都站得住、精灵画得出来
  C1  时钟：09:00 四只全在且大橘在食堂后门；12:30 大橘在睡；20:00 四只全不在（**验收 5**）
  C2  档位表：0/19/20/…/100 十三个边界值 → 六档连续、每一档都查得到 reactions
  C3-8 ⭐ 六档行为逐档实测（**验收 1**）：把分数拨到该档，量**猫相对玩家的位移方向**
       · 陌生 → 跑远（背向）   · 眼熟 → 退远（**面向**你）  · 熟 → 不动、且 `catCanPet` 为假
       · 亲近 → 凑到 22px 内    · 很亲 → 主动靠近        · 最亲 → 回常驻点等你
  C9  ⭐ 攒得上去 + **不跳档**（**验收 2**）：模拟逐天喂，档位序列必须是 0,1,2,3,4…（跳档即错），
      且途中**必须停过「熟」**那一档（"不让摸"是这一档唯一看得见的东西）
  C10 ⭐ 掉得下去（**验收 3**）：`time` 往前拨两周 → 分数 −16、档位降一档、**不为 0**
  C11 ⭐ 边界安全（**验收 6**）：连点喂食 20 次，只有第 1 次算（冷却按**真实日期**）
  C12 ⭐ 各自独立（**验收 4**）：喂大橘 5 天，馆长必须仍是陌生档
  C13 ⭐ 不出圈（**验收 7**）：300 帧（15 秒）里每只猫离领地中心始终 ≤ radius
  C14 图鉴：四只各点亮一格、**四格互不覆盖**（**验收 8**）
  C15 ⭐ 零调用（**验收 9**）：拦掉 fetch / XHR / sendBeacon 之后跑 200 帧，
      三个计数器必须全是 0；同时 localStorage 里不许有 key
  C16 精灵全覆盖：4 猫 × 8 动作 × 4 向 × 各自的帧数 —— 全部非空、尺寸对

⚠️ 判读口径：
  · C3-8 的位移是**同步爆发**量的（一次 run() 里连跑 20 帧），因为探针的 run() 之间
    主循环也会自己跑几帧。同一套档位规则 ⇒ 真实帧只会**加强**同一个方向，不会反号。
  · 位移阈值只取 ±3px（很小）—— 它要区分的是"远 / 近 / 不动"三态，不是速度。
"""
import io, json, os, shutil, subprocess, time, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(os.path.dirname(HERE), '像素校园_全校地图.html')
OUT = os.path.join(HERE, '_catprobe_gen.html')
PROF = os.path.join(HERE, '_catprobe_prof')          # 名字要独特：收尾按它筛进程
PORT = 9361
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
MAXTICKS = 600

PROBE = r"""
<script>
(function(){
  var R = [];
  function note(k, v){ R.push(k + '=' + v); }
  function flush(){ document.title = 'CP|' + R.join(' | '); }
  window.onerror = function(m, u, l, c){ note('ERR@' + l + ':' + c, m); flush(); return false; };

  var LS_MEM = 'pixelcampus.cat_affinity', LS_CODEX = 'pixelcampus.cat_codex';
  var LS_KEY = 'pixelcampus_llm_key';
  function resetAll(){
    try { localStorage.removeItem(LS_MEM); localStorage.removeItem(LS_CODEX); } catch (e) {}
  }
  /* 直接写账本 —— 模拟"玩家喂过 / 停过"。ageMs = memo.time 相对现在往前多少毫秒。 */
  function setScore(id, imp, ageMs, lastDay){
    var L = catLedger(), m = catRec(L, id);
    m.importance = imp; m.time = Date.now() - (ageMs || 0); m.lastDay = lastDay || '';
    catLedgerSave(L);
  }
  function ticks(n, dt){ for (var i = 0; i < n; i++) catTick(dt || 0.05); }
  function d2p(c){ return Math.hypot(player.x - c.x, player.y - c.y); }
  /* 把玩家放到猫的正南 d 像素；那里不可走就绕一圈试。返回是否找到。 */
  function putPlayer(c, d){
    var off = [[0, d], [0, -d], [d, 0], [-d, 0],
               [d*0.7, d*0.7], [-d*0.7, d*0.7], [d*0.7, -d*0.7], [-d*0.7, -d*0.7],
               [0, d*0.55], [d*1.3, 0], [-d*1.3, 0], [0, -d*0.55]];
    for (var i = 0; i < off.length; i++){
      var x = c.x + off[i][0], y = c.y + off[i][1];
      if (canWalk(x, y) && !blocked(x, y)) { player.x = x; player.y = y; return true; }
    }
    return false;
  }
  /* 从**猫**指向**玩家**的方向名（用来判"退"是不是面向玩家）。 */
  function dirToPlayer(c){
    var dx = player.x - c.x, dy = player.y - c.y;
    return (Math.abs(dx) >= Math.abs(dy)) ? (dx < 0 ? 'left' : 'right') : (dy < 0 ? 'up' : 'down');
  }
  function parkPlayerFar(){ player.x = SPAWN.x; player.y = SPAWN.y; }

  /* ---------- 六档用例表（阈值只区分"远/近/不动"三态） ---------- */
  var TIERCASE = [
    { i: 0, d: 60,  want: 'far',  act: 'flee'    },
    { i: 1, d: 40,  want: 'far',  act: 'retreat' },
    { i: 2, d: 20,  want: 'same', act: 'idle'    },
    { i: 3, d: 28,  want: 'near', act: 'rub'     },
    { i: 4, d: 150, want: 'near', act: 'walk'    },
    { i: 5, d: 120, want: 'spot', act: 'wait'    }
  ];

  var S = { ph: 0, n: 0 };

  function run(){
    /* ---------- C0 环境 ---------- */
    if (S.ph === 0){
      note('C0cats', CATS.length);
      var bad = 0, who = '';
      for (var i = 0; i < CATS.length; i++){
        var c = CATS[i];
        if (!(canWalk(c.x, c.y) && !blocked(c.x, c.y))) { bad++; if (!who) who = c.cfg.id; }
      }
      note('C0spots', bad === 0 ? 'walkable4' : (bad + '!walkable:' + who));
      note('C0fn', 'tick=' + (typeof catTick) + ' feed=' + (typeof catFeed)
        + ' near=' + (typeof catNear));
      /* 一只都没烘出来时 getImageData 会全透明 —— 这里先证明"精灵画得出来" */
      var cv = catSprite('cat_daju', 'walk', 'down', 0);
      var g2 = mkCanvas(CAT_W, CAT_H).getContext('2d');
      g2.imageSmoothingEnabled = false; g2.drawImage(cv, 0, 0);
      var dd = g2.getImageData(0, 0, CAT_W, CAT_H).data, n = 0;
      for (var k = 3; k < dd.length; k += 4) if (dd[k] > 0) n++;
      note('C0spr', 'px=' + n + ' size=' + cv.width + 'x' + cv.height);
      /* 喂的半径逐档（§7.2 第 1 步"档位允许的距离内"）：陌生必须够得着，
         否则玩家永远靠不近陌生的猫 ⇒ 好感停在 0 ⇒ 验收 2 不成立 */
      var fr = [];
      for (var t = 0; t < CAT_TIERS.length; t++)
        fr.push(CAT_TIERS[t].name + ':' + Math.min(CAT_TIERS[t].dist, CAT_FEED_R_MAX));
      note('C0feedR', fr.join(' '));
      resetAll();
      S.ph = 1; return;
    }

    /* ---------- C1 时钟（验收 5） ---------- */
    if (S.ph === 1){
      var probe = function(hhmm){
        catTimeOverride = hhmm;
        var on = [], off = [];
        var now = catNow(), mn = now.mins;
        for (var i = 0; i < CATS.length; i++){
          var s = catSlot(CATS[i].cfg, mn);
          (s && s.at ? on : off).push(CATS[i].cfg.id.replace('cat_', ''));
        }
        return { on: on.join(','), off: off.join(','), mins: mn };
      };
      var a = probe('09:00'), b = probe('12:30'), c = probe('20:00');
      note('C1a09', a.on + ' off=[' + a.off + '] mins=' + a.mins);
      note('C1b1230', 'daju_nap=' + (function(){
        var s = catSlot(CAT_BY_ID['cat_daju'].cfg, 12 * 60 + 30);
        return s ? (!!s.nap) : 'NOSLOT';
      })());
      note('C1c2000', 'on=[' + c.on + '] off=' + c.off);
      /* 大橘 09:00 必须正好落在「食堂后门」那一段 */
      var ds = catSlot(CAT_BY_ID['cat_daju'].cfg, 9 * 60);
      note('C1d', 'daju@09=' + (ds ? ds.at : 'NONE'));
      catTimeOverride = '10:00';       // 后面几条用例统一在这个时刻（四只全活跃）
      S.ph = 2; return;
    }

    /* ---------- C2 档位表：十三个边界值 ---------- */
    if (S.ph === 2){
      var bnd = [0, 19, 20, 39, 40, 59, 60, 79, 80, 94, 95, 100, -5, 500];
      var seq = [], noR = '';
      for (var i = 0; i < bnd.length; i++){
        var t = catTierOf(bnd[i]);
        seq.push(bnd[i] + ':' + t);
        var nm = CAT_TIERS[t] ? CAT_TIERS[t].name : '?';
        if (!CAT_REACTIONS[nm]) noR += bnd[i] + ',';
      }
      note('C2tier', seq.join(' '));
      note('C2react', noR ? ('MISSING:' + noR) : 'all6');
      /* 单调不减：分数涨档位不许倒退 */
      var bad = 0, prev = -1;
      for (var v = 0; v <= 100; v++){
        var tt = catTierOf(v);
        if (tt < prev) bad++;
        prev = tt;
      }
      note('C2mono', bad === 0 ? 'OK' : ('BACKSTEP' + bad));
      S.ph = 3; S.n = 0; return;
    }

    /* ---------- C3..C8 六档行为逐档实测（验收 1）---------- */
    /* ⚠️ 每一档都从**同一个初始状态**起：猫先站回领地中心。
       不重置的话上一条用例会把它推到领地边上（陌生档一跑就是 90px 撞边界），
       下一条"退"只挪得动 2px —— 那是**探针串台**，不是行为错。 */
    if (S.ph >= 3 && S.ph <= 8){
      var TC = TIERCASE[S.ph - 3];
      var cat = CAT_BY_ID['cat_daju'];
      catTimeOverride = '10:00';
      cat.holdT = 0; cat.holdAct = '';
      cat.x = cat.spot.x; cat.y = cat.spot.y; cat.lastX = cat.x; cat.lastY = cat.y;
      /* 分数拨到该档：取区间中值（0-19 取 10；最亲取 97） */
      var mid = [10, 30, 50, 70, 88, 97][TC.i];
      setScore('cat_daju', mid, 0, '');
      ticks(1, 0.05);                            // 先让 catTick 把档位算进去
      if (TC.want === 'spot'){
        /* 最亲是"回常驻点等你"：猫必须**先被挪开**，否则它已经在点上（距离 6px），
           原地不动反而是对的 —— 那条用例就成了空转。 */
        var away = [[70, 0], [-70, 0], [0, 70], [0, -70], [49, 49], [-49, -49]];
        for (var i = 0; i < away.length; i++){
          var ax = cat.spot.x + away[i][0], ay = cat.spot.y + away[i][1];
          if (canWalk(ax, ay) && !blocked(ax, ay)) { cat.x = ax; cat.y = ay; break; }
        }
        cat.lastX = cat.x; cat.lastY = cat.y;
      }
      var placed = putPlayer(cat, TC.d);
      var d0 = d2p(cat), s0 = Math.hypot(cat.x - cat.spot.x, cat.y - cat.spot.y);
      var dirFacing = '';
      ticks(TC.want === 'far' || TC.want === 'same' ? 12 : 20, 0.05);
      var d1 = d2p(cat), s1 = Math.hypot(cat.x - cat.spot.x, cat.y - cat.spot.y);
      var got;
      if (TC.want === 'far')       got = (d1 > d0 + 3);
      else if (TC.want === 'near') got = (d1 < d0 - 3);
      else if (TC.want === 'same') got = (Math.abs(d1 - d0) <= 3);
      else                         got = (s1 < s0 - 3);       // 最亲：回常驻点
      if (TC.i === 1) dirFacing = (cat.dir === dirToPlayer(cat)) ? 'facing' : ('WRONG:' + cat.dir);
      note('C3t' + TC.i, CAT_TIERS[TC.i].name + ' score=' + mid + ' tier=' + cat.tier
        + ' act=' + cat.act + '(want ' + TC.act + ')'
        + ' d2p ' + d0.toFixed(0) + '->' + d1.toFixed(0)
        + (TC.want === 'spot' ? (' d2spot ' + s0.toFixed(0) + '->' + s1.toFixed(0)) : '')
        + (dirFacing ? (' ' + dirFacing) : '')
        + ' placed=' + placed
        + ' => ' + (got ? 'PASS' : 'FAIL'));
      /* 「熟」档不给摸 / 「亲近」档给摸 —— 这一档唯一看得见的差异 */
      if (TC.i === 2) note('C3t2pet', 'catCanPet=' + catCanPet(cat) + '(want false)');
      if (TC.i === 3) note('C3t3pet', 'catCanPet=' + catCanPet(cat) + '(want true)');
      S.ph++; S.n = 0; return;
    }

    /* ---------- C9 攒得上去 + 不跳档（验收 2） ---------- */
    if (S.ph === 9){
      resetAll();
      catTimeOverride = '10:00';
      parkPlayerFar();
      var cat = CAT_BY_ID['cat_daju'];
      var seq = [catTierOf(0)], scores = [];
      for (var d = 0; d < 7; d++){
        /* 模拟"第 d 天喂一次"：把 lastDay 改成当天、time 往前挪 d 天（不足一周 ⇒ 不衰减） */
        var L = catLedger(), m = catRec(L, 'cat_daju');
        m.lastDay = 'simday-' + d;
        m.time = Date.now() - d * 86400000;
        catLedgerSave(L);
        var r = catFeed(cat);
        scores.push(catMemo('cat_daju').importance);      // 喂完**重新读**账本，不是读喂前那个对象
        seq.push(cat.tier);
        if (r !== 'ok') note('C9warn', 'day' + d + ' feed=' + r);
      }
      var jump = 0;
      for (var i = 1; i < seq.length; i++) if (seq[i] - seq[i-1] > 1) jump++;
      note('C9score', scores.join(','));
      note('C9seq', seq.join(',') + ' jump=' + jump
        + ' passedTier2=' + (seq.indexOf(2) >= 0 ? 'Y' : 'N')
        + ' => ' + (jump === 0 && seq.indexOf(2) >= 0 ? 'PASS' : 'FAIL'));
      S.ph = 10; return;
    }

    /* ---------- C10 掉得下去（验收 3） ---------- */
    if (S.ph === 10){
      resetAll();
      catTimeOverride = '10:00';
      var cat = CAT_BY_ID['cat_zhima'];
      /* 亲近档 75 分，停喂两周 */
      setScore('cat_zhima', 75, 14 * 86400000, '');
      var m = catMemo('cat_zhima');
      var eff = catEffective(m, Date.now());
      var t0 = catTierOf(75), t1 = catTierOf(eff);
      catTick(0.05); catTick(0.05);
      note('C10', 'imp=75 eff=' + eff.toFixed(0) + ' tier ' + t0 + '(' + CAT_TIERS[t0].name
        + ')->' + t1 + '(' + CAT_TIERS[t1].name + ')'
        + ' cat.tier=' + cat.tier + ' cat.act=' + cat.act
        + ' => ' + ((t1 < t0 && eff > 0 && cat.tier === t1) ? 'PASS' : 'FAIL'));
      S.ph = 11; return;
    }

    /* ---------- C11 连点 20 次只算一次（验收 6） ---------- */
    if (S.ph === 11){
      resetAll();
      catTimeOverride = '10:00';
      var cat = CAT_BY_ID['cat_guanzhang'];
      setScore('cat_guanzhang', 70, 0, '');       // 亲近档，喂得动
      var ok = 0, cold = 0, other = '';
      for (var i = 0; i < 20; i++){
        var r = catFeed(cat);
        if (r === 'ok') ok++;
        else if (r === 'cold') cold++;
        else other += r + ',';
      }
      var imp = catMemo('cat_guanzhang').importance;
      note('C11', 'ok=' + ok + ' cold=' + cold + (other ? (' other=' + other) : '')
        + ' imp=' + imp + '(want ok1 cold19, imp=' + (70 + 12 * 0.7).toFixed(1) + ')'
        + ' => ' + (ok === 1 && cold === 19 ? 'PASS' : 'FAIL'));
      S.ph = 12; return;
    }

    /* ---------- C12 各自独立（验收 4） ---------- */
    if (S.ph === 12){
      resetAll();
      catTimeOverride = '10:00';
      var dj = CAT_BY_ID['cat_daju'], gz = CAT_BY_ID['cat_guanzhang'];
      for (var d = 0; d < 5; d++){
        var L = catLedger(), m = catRec(L, 'cat_daju');
        m.lastDay = 'simday-' + d; m.time = Date.now() - d * 86400000;
        catLedgerSave(L);
        catFeed(dj);
      }
      catTick(0.05);
      note('C12', 'daju=' + dj.tier + '(' + CAT_TIERS[dj.tier].name + ')'
        + ' guanzhang=' + gz.tier + '(' + CAT_TIERS[gz.tier].name + ')'
        + ' => ' + ((dj.tier >= 3 && gz.tier === 0) ? 'PASS' : 'FAIL'));
      S.ph = 13; return;
    }

    /* ---------- C13 不出圈（验收 7） ---------- */
    if (S.ph === 13){
      resetAll();
      catTimeOverride = '10:00';
      parkPlayerFar();
      ticks(300, 0.05);                            // 15 秒
      var bad = '';
      for (var i = 0; i < CATS.length; i++){
        var c = CATS[i];
        var dd = Math.hypot(c.x - c.spot.x, c.y - c.spot.y), RR = c.cfg.roam.radius;
        if (dd > RR + 0.5) bad += c.cfg.id + ':' + dd.toFixed(0) + '>' + RR + ',';
        if (!(canWalk(c.x, c.y) && !blocked(c.x, c.y))) bad += c.cfg.id + ':offgrid,';
      }
      note('C13', 'active=' + CATS.filter(function(c){ return c.active; }).length
        + ' bad=[' + bad + '] => ' + (bad === '' ? 'PASS' : 'FAIL'));
      S.ph = 14; return;
    }

    /* ---------- C14 图鉴：四格互不覆盖（验收 8） ---------- */
    if (S.ph === 14){
      try { localStorage.removeItem(LS_CODEX); } catch (e) {}
      var first = 0, ids = ['cat_daju', 'cat_guanzhang', 'cat_zhima', 'cat_lihua'];
      for (var i = 0; i < ids.length; i++) if (catCodexSee(ids[i])) first++;
      var C = catCodexLoad(), keys = Object.keys(C);
      var again = 0;
      for (var i = 0; i < ids.length; i++) if (catCodexSee(ids[i])) again++;
      note('C14', 'first=' + first + ' keys=' + keys.length + ' second=' + again
        + ' => ' + ((first === 4 && keys.length === 4 && again === 0) ? 'PASS' : 'FAIL'));
      S.ph = 15; return;
    }

    /* ---------- C15 零调用（验收 9） ---------- */
    if (S.ph === 15){
      try { localStorage.removeItem(LS_KEY); } catch (e) {}
      var nF = 0, nX = 0, nB = 0;
      var of = window.fetch, oO = XMLHttpRequest.prototype.open,
          oB = navigator.sendBeacon && navigator.sendBeacon.bind(navigator);
      window.fetch = function(){ nF++; return Promise.reject(new Error('probe-blocked')); };
      XMLHttpRequest.prototype.open = function(){ nX++; return oO.apply(this, arguments); };
      if (oB) navigator.sendBeacon = function(){ nB++; return false; };
      resetAll();
      catTimeOverride = '10:00';
      parkPlayerFar();
      ticks(200, 0.05);
      /* 顺手再驱一次交互路径（喂 / 摸 / 图鉴）—— "零调用"要覆盖的正是这几条 */
      setScore('cat_daju', 70, 0, '');
      catTick(0.05);
      catFeed(CAT_BY_ID['cat_daju']);
      catPet(CAT_BY_ID['cat_daju']);
      catCodexSee('cat_daju');
      ticks(60, 0.05);
      window.fetch = of; XMLHttpRequest.prototype.open = oO;
      if (oB) navigator.sendBeacon = oB;
      var hasKey = null;
      try { hasKey = localStorage.getItem(LS_KEY); } catch (e) {}
      note('C15', 'fetch=' + nF + ' xhr=' + nX + ' beacon=' + nB
        + ' keyInLS=' + (hasKey === null ? 'null' : ('LEAK:' + String(hasKey).slice(0, 8)))
        + ' => ' + ((nF === 0 && nX === 0 && nB === 0 && hasKey === null) ? 'PASS' : 'FAIL'));
      S.ph = 16; return;
    }

    /* ---------- C16 精灵全覆盖 ---------- */
    if (S.ph === 16){
      var ACTS = Object.keys(CAT_ACTS), DIRS = ['down', 'left', 'right', 'up'];
      var total = 0, empty = '', wrong = '', threw = '';
      for (var ci = 0; ci < CATS.length; ci++){
        var id = CATS[ci].cfg.id;
        for (var ai = 0; ai < ACTS.length; ai++){
          var act = ACTS[ai], fn = CAT_ACTS[act];
          for (var di = 0; di < DIRS.length; di++){
            for (var f = 0; f < fn; f++){
              total++;
              var cv;
              try { cv = catSprite(id, act, DIRS[di], f); }
              catch (e) { threw += id + '.' + act + '.' + DIRS[di] + '.' + f + ','; continue; }
              if (cv.width !== CAT_W || cv.height !== CAT_H) wrong += id + ',' ;
              var g3 = mkCanvas(CAT_W, CAT_H).getContext('2d');
              g3.imageSmoothingEnabled = false; g3.drawImage(cv, 0, 0);
              var d3 = g3.getImageData(0, 0, CAT_W, CAT_H).data, nz = 0;
              for (var k = 3; k < d3.length; k += 4) if (d3[k] > 0) nz++;
              if (nz === 0) empty += id + '.' + act + '.' + DIRS[di] + '.' + f + ',';
            }
          }
        }
      }
      note('C16', 'n=' + total + ' empty=[' + empty + '] wrongsize=[' + wrong + ']'
        + ' threw=[' + threw + ']'
        + ' => ' + ((empty === '' && wrong === '' && threw === '') ? 'PASS' : 'FAIL'));
      S.ph = 99; return;
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
          "Where-Object { $_.CommandLine -like '*_catprobe_prof*' } | "
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
    print('CAT PROBE  (判读看最后的 CP| 行)')
    try:
        for i in range(MAXTICKS):
            time.sleep(0.5)
            t = read_title()
            if t != last:
                last = t
                if 'C16=' in t:
                    done = True
                    break
                if t.startswith('CP|'):
                    print('  t=%5.1fs  %s' % (i * 0.5, t[3:][:160]))
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
