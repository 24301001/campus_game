# -*- coding: utf-8 -*-
"""像素校园 —— 交接文档 §12 验收清单 · 可自动化部分

用法: python _build/accept.py

覆盖:
  A 思源楼与 PPT 矩形像素级重合 + scale 冻结
  B 世界尺寸 / 52 个色块落位
  C 穿墙压力测试（网格采样 × 8 方向 × 180 帧，逐帧断言）
  D 卡死点扫描（有没有站在那儿哪儿也去不了的位置）
  E 5 个校门可通行 / 非门处边界不可穿
结果写进 <title>，--dump-dom 取回。
"""
import io, os, re, subprocess

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(HERE)
SRC  = os.path.join(PROJ, '像素校园_全校地图.html')
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

HARNESS = """<script>
window.__diag=[];window.onerror=function(m,s,l,c){window.__diag.push(m+'@'+l);};
</script>
"""

TAIL = """
<script>
(function(){
  var out = [], ok = [], bad = [];
  function chk(name, cond, info){ (cond ? ok : bad).push(name + (info ? '(' + info + ')' : '')); }

  /* ---------- A 思源楼 ---------- */
  var e = CAMPUS.find(function(c){return c[1]==='siyuan';});
  var R = { x: IX(e[2]), y: IX(e[3]), w: IX(e[4]), h: IX(e[5]) };
  var sp = null;
  for (var i = 0; i < props.length; i++) {
    var p = props[i];
    if (Math.abs(p.y - (R.y + R.h)) < 1 && Math.abs(p.x - (R.x + R.w/2)) < 1) sp = p;
  }
  if (!sp) { bad.push('思源楼道具未找到'); }
  else {
    /* 楼身在精灵画布里的范围: X(BL)..X(BR), X = (v-56)*S, S=1.5 */
    var S = 1.5, X0 = (60-56)*S, X1 = (360-56)*S;
    var lx = sp.x - sp.ax + X0, rx = sp.x - sp.ax + X1;
    chk('A1 思源楼楼宽=450', Math.abs((rx-lx) - 450) < 1.5, 'w=' + (rx-lx).toFixed(1));
    chk('A2 左沿对齐 PPT 1798.9', Math.abs(lx - R.x) < 1.5, lx.toFixed(1) + ' vs ' + R.x.toFixed(1));
    chk('A3 右沿对齐 PPT 2248.9', Math.abs(rx - (R.x+R.w)) < 1.5, rx.toFixed(1) + ' vs ' + (R.x+R.w).toFixed(1));
    /* 落地线 = 楼底 y。
       ⚠️ 第十五轮加高 5 层后 ay 由 372 挪到 500（51 段 `s.ay += SY_GROW`），
       所以 (262-14)*S 之后还要 + SY_GROW；不加就会报 1431.6-128 = 1303.6。
       这一条测的仍是"楼往北长高、落地线一动不动"这件事本身。 */
    var gy = sp.y - sp.ay + (262-14)*S + SY_GROW;
    chk('A4 落地线=1431.6', Math.abs(gy - 1431.6) < 1.5, gy.toFixed(1));
    /* A5/A6 = 「加高 5 层」与「控制好大小」的可执行定义（第十五轮新增）：
       精灵高 411 → 539；塔顶世界 y = 1431.6 − 500 = 931.6，必须仍在第二教学楼
       南墙（894.6）之南 —— 楼不能长到压住北边那一栋。 */
    chk('A5 精灵高=411+SY_GROW', sp.img.height === 411 + SY_GROW, sp.img.height);
    chk('A6 塔顶世界 y=931.6 > 第二教学楼 894.6',
        Math.abs((sp.y - sp.ay) - 931.6) < 1.5 && (sp.y - sp.ay) > 894.6,
        (sp.y - sp.ay).toFixed(1));
  }

  /* ---------- B 世界 / 色块 ---------- */
  chk('B1 CAMPUS=52', CAMPUS.length === 52, CAMPUS.length);
  chk('B2 WORLD_W=5208', WORLD_W === 5208, WORLD_W);
  chk('B3 WORLD_H=2929', WORLD_H === 2929, WORLD_H);
  var kinds = {};
  for (var k = 0; k < CAMPUS.length; k++) kinds[CAMPUS[k][1]] = (kinds[CAMPUS[k][1]]||0)+1;
  chk('B4 每类都落了位', Object.keys(kinds).length >= 6, JSON.stringify(kinds));

  /* ---------- C/D 穿墙 + 卡死 ---------- */
  var DIRS = [[1,0],[-1,0],[0,1],[0,-1],[0.7,0.7],[-0.7,0.7],[0.7,-0.7],[-0.7,-0.7]];
  var STEP = 128, N = 180, escapes = [], traps = [], checked = 0;
  var sx = player.x, sy = player.y;
  for (var gx = 20; gx < WORLD_W - 20; gx += STEP) {
    for (var gy2 = 20; gy2 < WORLD_H - 20; gy2 += STEP) {
      if (!canWalk(gx, gy2) || blocked(gx, gy2)) continue;
      checked++;
      var moved = 0;
      for (var d = 0; d < 8; d++) {
        player.x = gx; player.y = gy2;
        var bx = gx, by = gy2;
        for (var f = 0; f < N; f++) {
          keys.a = keys.d = keys.w = keys.s = false;
          keys.arrowleft = keys.arrowright = keys.arrowup = keys.arrowdown = false;
          if (DIRS[d][0] > 0) keys.d = true; else if (DIRS[d][0] < 0) keys.a = true;
          if (DIRS[d][1] > 0) keys.s = true; else if (DIRS[d][1] < 0) keys.w = true;
          update(1/60);
          /* 逐帧断言：不许停在实体里；出界只许发生在门洞上 */
          if (blocked(player.x, player.y)) {
            bad.push('C1 卡进实体 @' + Math.round(player.x) + ',' + Math.round(player.y));
            f = N; break;
          }
          if (!insideBoundary(player.x, player.y) && !inGate(player.x, player.y)) {
            escapes.push(Math.round(player.x) + ',' + Math.round(player.y));
            f = N; break;
          }
        }
        if (Math.hypot(player.x - bx, player.y - by) > 2) moved++;
      }
      if (moved === 0) traps.push(gx + ',' + gy2);
    }
  }
  player.x = sx; player.y = sy;
  keys.a = keys.d = keys.w = keys.s = false;
  keys.arrowleft = keys.arrowright = keys.arrowup = keys.arrowdown = false;

  chk('C1 无穿墙/无卡进实体', escapes.length === 0, escapes.slice(0,4).join(' '));
  chk('C2 采样点', true, checked + ' 点 × 8 向 × ' + N + ' 帧');
  chk('D1 无卡死点', traps.length === 0, traps.slice(0,6).join(' '));

  /* ---------- E 校门可通行 ---------- */
  var pass = [];
  for (var gi = 0; gi < GATES.length; gi++) {
    var G = GATES[gi], vD = G.dir === 'v';
    /* 从门内 200px 处朝门走，看能否越过边界线（走到界外即算通行） */
    var inx = vD ? G.x : (G.y < WORLD_H/2 ? G.x : G.x);
    var startY = vD ? (G.y < WORLD_H/2 ? G.y + 200 : G.y - 200) : 0;
    var startX = vD ? G.x : (G.x + (G.x < WORLD_W/2 ? 200 : -200));
    var sy2 = vD ? startY : G.y;
    if (!canWalk(startX, sy2)) {
      /* 起点不可走就沿法线找最近可走点 */
      for (var t = 0; t < 300; t += 4) {
        var cx = vD ? G.x : G.x + (G.x < WORLD_W/2 ? t : -t);
        var cy = vD ? G.y + (G.y < WORLD_H/2 ? t : -t) : G.y;
        if (canWalk(cx, cy) && !blocked(cx, cy)) { startX = cx; sy2 = cy; break; }
      }
    }
    player.x = startX; player.y = sy2;
    var got = false;
    for (var f2 = 0; f2 < 420; f2++) {
      keys.a = keys.d = keys.w = keys.s = false;
      /* 朝门外走：v 门向 y 外，h 门向 x 外 */
      if (vD) { if (G.y < WORLD_H/2) keys.w = true; else keys.s = true; }
      else    { if (G.x < WORLD_W/2) keys.a = true; else keys.d = true; }
      update(1/60);
      if (!insideBoundary(player.x, player.y)) { got = true; break; }
    }
    pass.push(G.id + ':' + (got ? 'PASS' : 'BLOCKED'));
  }
  keys.a = keys.d = keys.w = keys.s = false;
  chk('E1 5 个校门全部可通行', pass.every(function(s){return /PASS$/.test(s);}), pass.join(' '));

  /* ---------- F 非门处边界不可穿 ---------- */
  var wallEscape = 0;
  for (var wi = 0; wi < 360; wi++) {
    var ang = wi / 360 * Math.PI * 2;
    /* 从边界外 60px 朝内走，必须被挡（门洞除外） */
    var px2 = WORLD_W/2 + Math.cos(ang) * 2600, py2 = WORLD_H/2 + Math.sin(ang) * 1500;
    if (inGate(px2, py2)) continue;
    if (!insideBoundary(px2, py2)) continue;
    /* 取界内一点朝外走 */
    player.x = px2; player.y = py2;
    for (var f3 = 0; f3 < 400; f3++) {
      keys.a = keys.d = keys.w = keys.s = false;
      keys.arrowleft = keys.arrowright = keys.arrowup = keys.arrowdown = false;
      if (Math.cos(ang) > 0.3) keys.d = true; else if (Math.cos(ang) < -0.3) keys.a = true;
      if (Math.sin(ang) > 0.3) keys.s = true; else if (Math.sin(ang) < -0.3) keys.w = true;
      update(1/60);
      if (!insideBoundary(player.x, player.y) && !inGate(player.x, player.y)) { wallEscape++; break; }
    }
  }
  keys.a = keys.d = keys.w = keys.s = false;
  keys.arrowleft = keys.arrowright = keys.arrowup = keys.arrowdown = false;
  chk('F1 非门处边界不可穿', wallEscape === 0, 'escape=' + wallEscape);

  /* ---------- G 下水淹没（2026-09-13 第六轮） ---------- */
  var RL = WATER[0];
  var midV = lakeSubmerge(RL.x + RL.w/2, RL.y + RL.h/2);
  var edV  = lakeSubmerge(RL.x + 0.5, RL.y + RL.h/2);           // 贴西岸
  var outV = lakeSubmerge(RL.x - 40, RL.y + RL.h/2);            // 岸上
  chk('G1 深度模型: 湖心=半个身子 / 贴岸≈0 / 岸上=0',
      Math.abs(midV - 0.5) < 0.01 && edV < 0.02 && outV === 0,
      'mid=' + midV.toFixed(3) + ' edge=' + edV.toFixed(3) + ' out=' + outV);

  /* 裁切量必须是整数源像素行，且湖心恰好裁到腰（精灵 30 行，锚点 27） */
  var cutMid = Math.round(CH_H * midV);
  chk('G2 湖心裁切量 = 15 行（水线在腰）',
      cutMid === 15 && cutMid < CH_AY && cutMid > 8,
      'cut=' + cutMid + ' CH_H=' + CH_H + ' CH_AY=' + CH_AY);

  /* ---------- H 鸭 / 鱼见人惊走 ---------- */
  /* ⚠️ 先临时摘掉岛/塔的障碍盒（H4 单独测它们）。不摘的话这个断言测不准：
     鸭子 0 的轨道**穿过**湖心岛，avoidPush 的侧推会盖过惊慌位移，
     "推开 44px" 全是轨道自己摆过去的，"方向背离"更是随机 —— 第一版就这么写，
     H1 报了两次假失败。两件事必须分开测。 */
  var savedAvoid = WATER_AVOID.splice(0, WATER_AVOID.length);
  var D0 = ducks[0], ORBX = D0.cx, ORBY = D0.cy;
  /* ⚠️⚠️ 2026-09-17 修一处**假判据**（与上面"先摘障碍盒"同一个病根，只是源头不同）。
     本段原来直接拿"C/D 扫描跑完之后鸭子恰好处的位置"当起点，于是 offX/offD 的正负与
     大小取决于**整个世界有多少个可走采样点**：C/D 对每个可走点跑 8 向 × 180 帧
     `update(1/60)`（几十万次主循环调用），每次都在推进全局 `waterT`，而
     `animateWater` 里 `d.x0 = d.cx + cos(waterT*d.sp + d.ph)*d.rx` ⇒ 鸭子轨道点被
     `waterT` 唯一决定。任何改动 `solids` 或可走分类的改动都会挪动这个相位。实测：
        · 从零相位冷启动跑这 90 帧，**基线自己**给出 offX = **+19.8**（`offX < -5` 直接不过）；
        · 基线跑 accept 时 off=23.7、我的构建 off=18.0 —— 差的全是相位，不是鸭子。
     这正是下面 H2b 注释里点名的那个坑：「取决于取数时撞上第几帧，是个随机通过/随机
     失败的假判据（本项目栽过这类）」。H1 当时写成了同一类。
     修法同"先摘障碍盒"：把**非惊慌的位移源**（这里就是轨道本身）从这 90 帧里排除掉 ——
     把轨道冻在活动域内一个定点上，测的就只剩惊慌响应本身，且对任何构建都同一答案。
     跑完原样还原，后续 H2 / H2b / H3 / H4 要的是正常轨道上的鸭子。
     定点取活动域内 +120：惊慌推挤量 ≈31px，距西/南夹取边界各留 ~110px，碰不到夹取。 */
  var saveD0 = { cx: D0.cx, cy: D0.cy, rx: D0.rx, ry: D0.ry,
                 x: D0.x, y: D0.y, x0: D0.x0, y0: D0.y0, sc: D0.sc };
  D0.cx = DUCK_AREA.x + 120; D0.cy = DUCK_AREA.y + 120;
  D0.rx = 0; D0.ry = 0;
  D0.x0 = D0.x = D0.cx; D0.y0 = D0.y = D0.cy; D0.sc = 0;
  /* ⚠️ 站位有讲究：**不能站到轨道圆心**。圆心到轨道点的距离是 sqrt(rx²+ry²) ≈ 68 > SAFE=64，
     鸭子在那里根本不惊（第二版这么写，H1 报 sc=0）。冻住轨道后圆心就是落点，
     站到东侧 20px 才落进 SAFE 内（且必须是**东**侧 —— 判据要的是向西推）。 */
  var PX = D0.x + 20, PY = D0.y;
  player.x = PX; player.y = PY;
  for (var f4 = 0; f4 < 90; f4++) animateWater(1/60);
  /* 惊慌位移 = 当前位置 − 轨道点（轨道点由 animateWater 每帧重算，不含惊慌量）。 */
  var offX = D0.x - D0.x0, offY = D0.y - D0.y0, offD = Math.hypot(offX, offY);
  /* ⚠️ 判据不能写 `sc > 0.9`：sc 的上限是 want = 1 − dist/SAFE，而 dist 量的是
     **轨道点**到人的距离（20px 起步）⇒ 这里最多只能爬到 0.69。这是设计使然
     （外扩量本来就是"人越近推得越远"的渐变量），不是缺陷。
     冻结轨道后的期望值（闭式，供日后核对）：want = 1 − 20/64 = 0.6875；
     sc = want·(1 − (1 − rise·dt)^90) = 0.6875·(1 − 0.9467^90) = **0.683**；
     offX = (x0 − PX)·sc·run/dist = (−20)·0.683·46/20 = **−31.4**；
     offY = 0（另加 ±1.2 的随波起伏）；dA = 20 + 31.4 = 51.4。四项判据余量都很大。 */
  var dA = Math.hypot(D0.x - PX, D0.y - PY);
  var scM = D0.sc;                    /* 量到的 sc 必须先存下来 —— 下面立刻还原 D0 */
  D0.cx = saveD0.cx; D0.cy = saveD0.cy; D0.rx = saveD0.rx; D0.ry = saveD0.ry;
  D0.x = saveD0.x; D0.y = saveD0.y; D0.x0 = saveD0.x0; D0.y0 = saveD0.y0;
  D0.sc = saveD0.sc;
  chk('H1 人靠近 → 鸭子惊走（sc 抬起 · 离轨道点 ≥20px · 方向背离人）',
      scM > 0.3 && offD > 20 && offX < -5 && dA > 20,
      'sc=' + scM.toFixed(2) + ' off=' + offD.toFixed(1) + ' offX=' + offX.toFixed(1)
      + ' d=' + dA.toFixed(1));
  /* ⚠️ 2026-09-13 第七轮**行为变更**（不是放松约束）：
     本条原来钉的是「鸭子始终在湖面内缩 10px 内」，即**不许上岸**。用户这轮明确推翻：
       「鸭子可以上岸走动或者下水，只能在湖里和下方的小广场活动」。
     于是判据从"湖面"换成"**活动域**（湖面 ∪ 南岸石板路）"。约束的**强度没变** ——
     活动域之外（东西主路的沥青、绿地）照样一格都不许去，而下界正是鸭子不该上的马路。
     活动域的定义在 45_water.js §4.5.3d：x/宽与湖同源，南界 = 89*CELL = 1424。 */
  var DA = DUCK_AREA;
  chk('H2 鸭子始终在活动域内缩 10px 内（湖面 ∪ 南岸小广场，闸门 = 不上马路）',
      D0.x >= DA.x + 9.5 && D0.x <= DA.x + DA.w - 9.5 &&
      D0.y >= DA.y + 9.5 && D0.y <= DA.y + DA.h - 9.5,
      'x=' + D0.x.toFixed(1) + ' y=' + D0.y.toFixed(1)
      + ' area_y=' + DA.y.toFixed(0) + '..' + (DA.y + DA.h).toFixed(0));
  /* H2b 是**静态几何**判据：轨道最南点（cy + ry）必须越过岸线，否则"上岸"这件事
     在几何上就不可能发生。⚠️ 刻意不用"某一帧的 y > 岸线"来测 —— 那取决于取数时
     撞上第几帧，是个随机通过/随机失败的假判据（本项目栽过这类）。 */
  var ybReach = [];
  for (var dj = 0; dj < ducks.length; dj++) ybReach.push(ducks[dj].cy + ducks[dj].ry);
  /* ⚠️ 判据是 `some` 不是 `every`：三只的圆心照活动域 0.28/0.50/0.72 铺开，只有最南
     那只（鸭 2，cy≈1310）的轨道真的越过 1328，另两只整条轨道都在湖里。**这正是要的
     样子** —— 用户要的是「鸭子可以上岸走动**或者**下水」，不是"三只全上岸"。
     写成 every 就必须把三只都推到南边，代价是明湖北半部一只鸭子都没有。 */
  chk('H2b 至少一只鸭子的轨道越过湖南岸（"上岸"在几何上可能）',
      ybReach.some(function (v) { return v > RL.y + RL.h; }),
      'reach=' + ybReach.map(function (v) { return v.toFixed(0); }).join('/')
      + ' 南岸=' + (RL.y + RL.h).toFixed(1));

  player.x = 100; player.y = 100;                    // 走到远远的岸上
  for (var f6 = 0; f6 < 600; f6++) animateWater(1/60);
  chk('H3 人走开 → 慢慢游回来（sc < 0.1）', D0.sc < 0.1, 'sc=' + D0.sc.toFixed(4));

  /* H4 岛与塔：鸭子与鱼的轨道**本来就穿过**它们（这是一处既存缺陷，本轮顺手收掉）。
     判两件事：① 原始轨道点确实落进盒子里（证明缺陷真实存在 —— 这条断言如果哪天
     变成 rawHit=0，说明轨道改了，这段推挤代码也就该删了）；② 推挤后的落点从不落在
     盒子里（box 内缩 2px 容差，给随波起伏的 ±1.2px 留余地）。
     覆盖一整个轨道周期：2400 帧 = 40 s，sp 最大 0.28 rad/s ⇒ 转满 6.28 rad 有余。 */
  for (var ri = 0; ri < savedAvoid.length; ri++) WATER_AVOID.push(savedAvoid[ri]);
  player.x = 100; player.y = 100;
  var rawHit = 0, fixHit = 0, outArea = 0, onLand = 0, nSamp = 0;
  var S_ = RL.y + RL.h;                              // 湖南岸线（= 石板路北缘）
  for (var f7 = 0; f7 < 2400; f7++) {
    animateWater(1/60);
    for (var di = 0; di < ducks.length; di++) {
      var dk = ducks[di];
      nSamp++;
      /* H2c 的两项统计。容差 2px 是给 `ny = p[1] + round(sin*1.2)` 那一下随波起伏
         留的：夹取本身留了 10px 余量，正常永远碰不到边界，2px 只为防"夹取常量哪天
         被调小"时判据跟着一起失效。 */
      if (dk.x < DA.x - 2 || dk.x > DA.x + DA.w + 2 ||
          dk.y < DA.y - 2 || dk.y > DA.y + DA.h + 2) outArea++;
      if (dk.y > S_) onLand++;
      for (var ai = 0; ai < WATER_AVOID.length; ai++) {
        var bx = WATER_AVOID[ai];
        if (dk.x0 > bx.x0 && dk.x0 < bx.x1 && dk.y0 > bx.y0 && dk.y0 < bx.y1) rawHit++;
        if (dk.x > bx.x0 + 2 && dk.x < bx.x1 - 2 && dk.y > bx.y0 + 2 && dk.y < bx.y1 - 2) fixHit++;
      }
    }
  }
  /* ⚠️ 2026-09-13 第七轮：原来这里还要求 `WATER_AVOID.length === 2` —— 那是个**数量
     代理**，影壁 ×2 / 门垛 ×2 / 假山 登记进来之后它变成 7。数量变了，但判据的**意图**
     一条都没变。改成直接钉住那两条已知的盒（岛 / 塔）：这比数个数**更强** ——
     数量碰巧对上、而岛盒被删或被影壁盒顶替的情况，旧写法是查不出来的。
     岛盒 x2758..2850 / y1046..1108，塔盒 x2928..2948 / y1245..1253（56 段 §5.6.4）。 */
  var hasIsle = false, hasTower = false;
  for (var bi2 = 0; bi2 < WATER_AVOID.length; bi2++) {
    var bb = WATER_AVOID[bi2];
    if (Math.abs(bb.x0 - 2758) < 1.5 && Math.abs(bb.y1 - 1108) < 1.5) hasIsle = true;
    if (Math.abs(bb.x0 - 2928) < 1.5 && Math.abs(bb.y0 - 1245) < 1.5) hasTower = true;
  }
  chk('H4 鸭子的轨道穿过岛/塔（既存缺陷），推挤后落点永不进盒',
      rawHit > 0 && fixHit === 0 && hasIsle && hasTower,
      'rawHit=' + rawHit + ' fixHit=' + fixHit
      + ' isle=' + hasIsle + ' tower=' + hasTower + ' boxes=' + WATER_AVOID.length);
  chk('H2c 一整个轨道周期内：鸭子从不越出活动域，且确实上过岸',
      outArea === 0 && onLand > 0,
      'out=' + outArea + ' onLand=' + onLand + '/' + nSamp);

  /* ---------- K 明湖南岸影壁群（第七轮） ---------- */
  /* 影壁 / 假山是逐像素手绘，三套验收查不出"画成什么样"（那只能靠肉眼出图）——
     但**摆在哪、挡不挡人、窗是不是真挖穿了**这三类是能查的，而且恰恰是最容易静默坏掉
     的：把 clearRect 换成 px(…粉墙色) 画面照样"看着像窗"，鸭子/人被挡住才有人发现。 */
  var ybW = [], ybD = null, ybJ = null;
  for (var yi = 0; yi < props.length; yi++) {
    var pp = props[yi];
    if (pp.tag === 'yingbi') { if (pp.img.width === 68) ybW.push(pp); else ybD = pp; }
    if (pp.tag === 'jiashan') ybJ = pp;
  }
  chk('K1 影壁 ×2 + 月亮门 + 假山，四件都在 props 里',
      ybW.length === 2 && ybD !== null && ybJ !== null,
      'win=' + ybW.length + ' door=' + (ybD ? 1 : 0) + ' rock=' + (ybJ ? 1 : 0));
  /* 广场矩形与 57 段同源：x 读 WATER[0]（经 DUCK_AREA），南界 = 89*CELL。
     ⚠️ 刻意不用 ARTERY 声明的 1431.62 —— 那一格实际被「东西主路」抢走了。 */
  var PX0 = DA.x, PX1 = DA.x + DA.w, PY1 = DA.y + DA.h;
  var allYb = [ybW[0], ybW[1], ybD, ybJ], outN = 0;
  for (var qi = 0; qi < allYb.length; qi++) {
    var qp = allYb[qi];
    if (!qp || !(qp.x > PX0 && qp.x < PX1 && qp.y > DA.y && qp.y < PY1)) outN++;
  }
  chk('K2 四件都落在小广场矩形内（不越到马路 / 绿地 / 湖里）', outN === 0,
      'bad=' + outN + ' x=' + PX0.toFixed(0) + '..' + PX1.toFixed(0)
      + ' y=' + DA.y.toFixed(0) + '..' + PY1.toFixed(0));
  chk('K3 三块同高同落地线（影壁 68×56 / 月亮门 52×56）',
      !!(ybW[0] && ybW[1] && ybD) && ybW[0].y === ybW[1].y && ybD.y === ybW[0].y &&
      ybW[0].img.height === 56 && ybD.img.height === 56 && ybD.img.width === 52,
      'by=' + (ybW[0] ? ybW[0].y : '?') + ' h=' + (ybW[0] ? ybW[0].img.height : '?')
      + ' doorW=' + (ybD ? ybD.img.width : '?'));
  /* 月亮门：门洞 20 宽**必须无盒**（人和鸭子才穿得过），两侧门垛必须有盒。
     ⚠️ 判据只能走 ptBlocked —— 通行与否只认 solids 的 AABB，精灵上画没画洞不算数。 */
  var CD = ybD ? ybD.x : 0, BYY = ybW[0] ? ybW[0].y : 0;
  chk('K4 月亮门可穿：门洞无盒，两侧门垛有盒',
      !ptBlocked(CD, BYY - 7) && ptBlocked(CD - 18, BYY - 7) && ptBlocked(CD + 18, BYY - 7),
      'hole=' + ptBlocked(CD, BYY - 7) + ' jambL=' + ptBlocked(CD - 18, BYY - 7)
      + ' jambR=' + ptBlocked(CD + 18, BYY - 7));
  chk('K5 影壁本体与假山都挡得住人',
      !!(ybW[0] && ybW[1] && ybJ) && ptBlocked(ybW[0].x, BYY - 7)
      && ptBlocked(ybW[1].x, BYY - 7) && ptBlocked(ybJ.x, ybJ.y - 7),
      'wL=' + ptBlocked(ybW[0] ? ybW[0].x : -9e5, BYY - 7)
      + ' wR=' + ptBlocked(ybW[1] ? ybW[1].x : -9e5, BYY - 7)
      + ' rock=' + ptBlocked(ybJ ? ybJ.x : -9e5, ybJ ? ybJ.y - 7 : -9e5));
  /* K6 两端缺口必须过得去：三块总宽 204、广场 272.32 ⇒ 两侧各余 34.16。
     扫余量的中点（玩家 18 宽、blocked 用 hw=6，7 的默认 hw 比它更严）。 */
  chk('K6 广场两端缺口可通行（两侧各余 34px）',
      !ptBlocked(PX0 + 17, BYY - 7) && !ptBlocked(PX1 - 17, BYY - 7),
      'L=' + ptBlocked(PX0 + 17, BYY - 7) + ' R=' + ptBlocked(PX1 - 17, BYY - 7));
  /* K7 假山必须比影壁高 —— 用户拍板③「在北侧、被影壁挡住、从墙顶露出来」。 */
  chk('K7 假山顶高于影壁顶（从墙后才露得出来）',
      !!(ybW[0] && ybJ) && (ybJ.y - ybJ.img.height) < (BYY - ybW[0].img.height),
      'rockTop=' + (ybJ ? ybJ.y - ybJ.img.height : '?')
      + ' wallTop=' + (ybW[0] ? BYY - ybW[0].img.height : '?'));
  /* K9 假山只该从墙顶**露出个头**。用户 2026-09-13：「往前移动一点假山，能够露出个头
     在墙后即可」。K7 只管"露得出来"—— 露成半座山它也过（改之前那版露 22px 一整块）。
     现在 10px ≈ 影壁高的 18%；上界给 20px，超了就该把假山往下挪（YB_JIASHAN_DY 调大）。 */
  var ybRev = (BYY - (ybW[0] ? ybW[0].img.height : 0))
            - (ybJ ? ybJ.y - ybJ.img.height : 0);
  chk('K9 假山从墙顶只露一个头（4..20px）',
      !!(ybW[0] && ybJ) && ybRev >= 4 && ybRev <= 20, 'reveal=' + ybRev + 'px');
  /* K8 窗洞必须是**真透明**（clearRect 挖穿），不是拿粉墙色涂一块 —— 涂一块的话窗后
     永远看不到湖水/砖面，用户要的"把中间挖空作为窗户"就白做了，而画面上"看着像窗"。 */
  var ybG = ybW[0] ? ybW[0].img.getContext('2d') : null;
  /* ⚠️ 采样点必须**同时避开竖棂（x28 / x40）与中横（y31）**。第一版取了窗洞正中
     (30,31)，恰好落在中横那一条上，读出来 255 —— 断言假失败（洞是挖穿的）。
     取 (30,28)：x 在两竖棂之间，y 在中横之北、仍在洞内。 */
  var holeA = ybG ? ybG.getImageData(30, 28, 1, 1).data[3] : -1;
  var wallA = ybG ? ybG.getImageData(8, 31, 1, 1).data[3] : -1;    // 同高度的粉墙
  var laceA = ybG ? ybG.getImageData(28, 31, 1, 1).data[3] : -1;   // 竖窗棂
  chk('K8 窗洞挖穿了（中心透明），窗棂与墙仍实心',
      holeA === 0 && wallA === 255 && laceA === 255,
      'hole=' + holeA + ' wall=' + wallA + ' lace=' + laceA);

  /* ---------- I 斜向朝向（1 个字符的补丁） ---------- */
  player.x = WORLD_W/2; player.y = WORLD_H/2;
  keys.a = keys.w = true; keys.d = keys.s = false;   // 左上
  update(1/60);
  var dLU = player.dir;
  keys.a = keys.w = false; keys.d = keys.s = true;   // 右下
  update(1/60);
  var dRD = player.dir;
  keys.a = keys.d = keys.w = keys.s = false;
  keys.arrowup = true; update(1/60); var dU = player.dir; keys.arrowup = false;
  chk('I1 斜走露侧脸、纯上下仍朝上/下',
      dLU === 'left' && dRD === 'right' && dU === 'up',
      'LU=' + dLU + ' RD=' + dRD + ' U=' + dU);

  /* ---------- J 雕塑喷泉逐帧 ---------- */
  var sigs = [], fw = diaFrames[0].width, fh = diaFrames[0].height;
  for (var fi = 0; fi < diaFrames.length; fi++) {
    var dd = diaFrames[fi].getContext('2d').getImageData(0, 0, fw, fh).data;
    var hh = 0;
    for (var bi = 0; bi < dd.length; bi++) hh = (hh * 31 + dd[bi]) | 0;
    sigs.push(hh);
  }
  var uniq = 0;
  for (var u1 = 0; u1 < sigs.length; u1++) {
    var dup = false;
    for (var u2 = 0; u2 < u1; u2++) if (sigs[u2] === sigs[u1]) dup = true;
    if (!dup) uniq++;
  }
  chk('J1 喷泉 8 帧烘焙齐、逐帧各不同',
      diaFrames.length === 8 && uniq === 8 && diaFrames.indexOf(diaProp.img) >= 0,
      'n=' + diaFrames.length + ' uniq=' + uniq + ' prop=' + diaFrames.indexOf(diaProp.img));

  /* ⚠️ 闸①②③的回归测试 —— 2026-09-13 那次"整页永久定格"就是漏了闸③：
     负 dt → `%` 返回负 → 数组负下标 → img 变 undefined → 下一帧 render 死在 p.img.width。 */
  var t0 = diaT, i0 = diaFrameI;
  var threw = '';
  try { animateDiaosu(-1); animateDiaosu(NaN); } catch (ex) { threw = String(ex); }
  chk('J2 喷泉闸①（负 / NaN dt 不污染 diaT）',
      threw === '' && diaT === t0 && diaFrames.indexOf(diaProp.img) >= 0,
      'err=' + threw + ' dT=' + (diaT - t0));
  /* 直接喂一个超大 dt，让下标必然越过数组长度 —— 闸②必须把它夹回来 */
  animateDiaosu(1e6);
  chk('J3 喷泉闸②③（越界下标被夹回、img 绝不为 undefined）',
      diaFrameI >= 0 && diaFrameI < diaFrames.length &&
      diaFrames.indexOf(diaProp.img) >= 0 && !!diaProp.img.width,
      'i=' + diaFrameI + ' img=' + (diaProp.img ? diaProp.img.width : 'undef'));

  document.title = 'ACCEPT|OK[' + ok.length + ']=' + ok.join(' ; ')
                 + '|FAIL[' + bad.length + ']=' + (bad.join(' ; ') || 'none')
                 + '|err=' + (window.__diag.join(',') || 'clean');
})();
</script>
"""


def main():
    html = io.open(SRC, encoding='utf-8').read()
    html = html.replace('<script>', HARNESS + '<script>', 1)
    html = html.replace('</body>', TAIL + '</body>', 1)
    tmp = os.path.join(PROJ, '_accept_gen.html')
    io.open(tmp, 'w', encoding='utf-8', newline='\n').write(html)
    try:
        p = subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--no-sandbox',
                            '--hide-scrollbars', '--window-size=1200,700',
                            '--dump-dom', 'file:///' + tmp],
                           capture_output=True, check=False)
    finally:
        pass
    dom = p.stdout.decode('utf-8', 'replace')
    m = re.search(r'<title>(.*?)</title>', dom, re.S)
    t = m.group(1).strip() if m else 'NO TITLE'
    for part in t.split('|'):
        print(part)
    if os.path.exists(tmp):
        os.remove(tmp)


main()
