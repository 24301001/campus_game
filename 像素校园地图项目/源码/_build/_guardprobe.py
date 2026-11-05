# -*- coding: utf-8 -*-
"""保安 · 老丁 端到端探针（2026-10-09 · 接入地图）。

为什么必须单独有一个：accept / verify / zoomtest 三套全几何、全静态；
`_edge.py` 只管"页面活着不抛错 + 玩家能走"。老丁是地图项目里**第一个游荡的 NPC**
（巡逻寻路 / 走近冒泡 / 按 C 开同源 iframe 抽屉 / 抽屉锁步），这四样没有既有探针够得着。

⚠️ 与 `_guideprobe.py` / `_catshot.py` 的关键差别：**跑在 http://localhost:3000 上**，
   不走 file://。原因只有一个，但很硬：抽屉里那个 iframe 是 `/ld/` —— file:// 下会
   解析成 `file:///ld/`，**必然加载失败**，那条同源代理链（Vite `/ld` → 8000 → PrefixStrip）
   就一个字都验不到。走 3000 才能读 `ctrF.contentDocument`（同源），顺便把
   「laoding 真的在抽屉里渲染出来了」验掉。

它验九件事，每一件都是**真的驱动 UI**（合成 KeyboardEvent 走真实监听链，
不直接调内部函数）：

  G0  站位 + `GUARD_SPOTS` 全部落成、逐站可走
  G1  ⭐ **他真在走**：静置 3.5s，`GUARD` 位移 > 0（且每一帧采样都站在可走处）
  G2  ⭐ **巡逻路线不穿墙**：逐站 `guidePath` + 与 `guideLOS` 同款 Bresenham 逐格重放，
        每个中转格都必须 `CELLWALK && !NOGO && CELLK!==WATER`
  G3  走近 → `GUARD.near` 为真、头顶 `#ctip` 出现、文案含「老丁」
  G4  ⭐ 按 C → `CENTER.plat` 翻真、`#ctrP` 不再 hidden、`#ctrF.src` 指向 `/ld/`
  G5  ⭐ 抽屉里真的渲染出了 laoding：`ctrF.contentDocument.title` 含「保卫处」、
        `#guard-img` 的 `naturalWidth > 0`（图片经 `/ld/assets` 代理拿到了）
  G6  ⭐ **抽屉锁步**：抽屉开着按方向键 0.5s，`player.x/y` **逐帧不变**
  G7  ⭐ 在 **iframe 里**按 Esc → `ctrClosePlatform` 生效（`CENTER.plat` 翻假、`#ctrP` 收起）
  G8  ⭐ **锁步只在抽屉开时生效**：关掉抽屉再按方向键 ⇒ 玩家恢复位移

⚠️ 判读口径：
   · G1 位移**不必须**很大：他每站之间会停 1.3~2.0s 歇脚，3.5s 内可能刚起步。
     判据是"> 1px"（他真动了），而不是"走了多少"。
   · G5 的 `naturalWidth` 是**唯一**能证明"图片真加载了"的字（= 0 就是碎图）。
   · G6/G8 用**玩家位移**当自变量：探针只按方向键、不做别的，
     "他没动"只能是因为补丁 28 的锁步。
"""
import io, json, os, shutil, subprocess, time, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(HERE)
# ⚠️ 走 3000（Vite）而不是产物文件：抽屉里的 `/ld/` 只有在同源网关上才活得起来。
OUT = os.path.join(HERE, '_gdprobe_gen.html')
# ⚠️ `campus_game` 挂在**总目录**下（`像素校园地图项目` 的父目录），不是 PROJ 里面 ——
#    第一版把 PUB 算成 `PROJ/campus_game/...`，`makedirs` 当场凭空造了半棵树出来。
#    现在**不 makedirs**：目录必须在，不在就直接报错（宁可红，不要静默造树）。
ROOT = os.path.dirname(os.path.dirname(PROJ))
PUB = os.path.join(ROOT, 'campus_game', 'frontend', 'public', '_gdprobe_gen.html')
PROF = os.path.join(HERE, '_gdprobe_prof')
PORT = 9342
URL = 'http://localhost:3000/_gdprobe_gen.html'
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
MAXTICKS = 300                                     # 300 × 0.5s = 150s 上限

PROBE = r"""
<script>
(function(){
  var R = [];
  function note(k, v){ R.push(k + '=' + v); }
  function flush(){ document.title = 'GDP|' + R.join(' | '); }
  window.onerror = function(m, u, l, c){ note('ERR@' + l + ':' + c, m); flush(); return false; };

  function key(k, tgt){
    (tgt || window).dispatchEvent(new KeyboardEvent('keydown',
      { key: k, code: k, bubbles: true, cancelable: true }));
  }
  function keyUp(k){
    window.dispatchEvent(new KeyboardEvent('keyup',
      { key: k, code: k, bubbles: true, cancelable: true }));
  }
  function dGP(){ return Math.hypot(player.x - GUARD.x, player.y - GUARD.y); }
  function ctipOn(){ var e = document.getElementById('ctip'); return !!(e && !e.hidden); }
  function ctipTxt(){ var e = document.getElementById('ctip'); return e ? e.textContent : ''; }
  function platOn(){ return !!(ctrP && !ctrP.hidden); }
  function frameDoc(){ try { return ctrF ? ctrF.contentDocument : null; } catch (e) { return null; } }

  /* 与 `72_guide.js` guideLOS() **逐字同款**的 Bresenham：路点是格心 gx*CELL+8。 */
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
  function pathOffends(P){
    var cs = traceCells(P), off = 0, first = '';
    for (var i = 0; i < cs.length; i++){
      var gx = cs[i][0], gy = cs[i][1], why = '';
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

  /* 瞬移到老丁身边（挑一个可走的方向落点）。 */
  function tpNearGuard(){
    var off = [[20,0],[-20,0],[0,20],[0,-20],[34,0],[0,-34],[26,18],[-26,18],[-30,-16]];
    for (var i = 0; i < off.length; i++){
      var x = GUARD.x + off[i][0], y = GUARD.y + off[i][1];
      if (canWalk(x, y) && !blocked(x, y)) { player.x = x; player.y = y; return true; }
    }
    return false;
  }
  /* 找一个**开阔可走、且往右能走一段**的点，用来测"抽屉锁步"（G6/G8）。
     ⚠️ 上一版 G6/G8 分别从"刚被推了 150px 的位置"和"贴墙的位置"起跑，两次的
        起跑条件不同、且有一次撞墙（只挪了 10px）⇒ 结论根本不能用。
        现在两次都从**同一个点**起跑，唯一变量就是"抽屉开没开"。
     候选顺序：东西主路的西/中/东三点（宽路，右侧一定有空间）。 */
  function pickOpenStart(){
    var i, x, y, k;
    for (i = 2; i < GUARD_SPOTS.length; i++){
      x = GUARD_SPOTS[i].x - 40; y = GUARD_SPOTS[i].y;      // 往路左一点，右侧留出跑道
      if (!(canWalk(x, y) && !blocked(x, y))) continue;
      /* 预检：从这儿往右 0.6s 的路程够不够（够才说明"能动"是可测的） */
      k = 0;
      for (k = 1; k <= 8; k++) if (!(canWalk(x + k * 18, y) && !blocked(x + k * 18, y))) break;
      if (k > 6) return { x: x, y: y };
    }
    return null;
  }

  var S = { ph: 0, mark: 0, g0: [0,0], p0: [0,0], walkMax: 0, offAll: 0, routeBad: [], start: null };

  function wait(ms){ return Date.now() - S.mark >= ms; }
  function run(){
    switch (S.ph) {

    /* ---------- G0 站位 + 路点 ---------- */
    case 0: {
      var nSpot = GUARD_SPOTS.length, bad = [];
      for (var i = 0; i < nSpot; i++){
        var s = GUARD_SPOTS[i];
        if (!(canWalk(s.x, s.y) && !blocked(s.x, s.y)))
          bad.push(i + '@' + (s.x | 0) + ',' + (s.y | 0));
      }
      note('G0', 'spots=' + nSpot + ' pos=' + (GUARD.x | 0) + ',' + (GUARD.y | 0)
        + ' spot=' + GUARD.spot + ' spawnOK=' + (canWalk(GUARD.x, GUARD.y) && !blocked(GUARD.x, GUARD.y) ? 'Y' : 'N')
        + ' badSpots=' + (bad.length ? bad.join(' ') : 'none'));
      S.g0 = [GUARD.x, GUARD.y];
      S.ph = 1; S.mark = Date.now(); break;
    }

    /* ---------- G1 他真在走（3.5s）---------- */
    case 1:
      /* 每轮采样一次：他一辈子都该站在可走处（这条比位移更能抓住"穿墙"）。 */
      if (!(canWalk(GUARD.x, GUARD.y) && !blocked(GUARD.x, GUARD.y))) S.walkMax = -999;
      if (canWalk(GUARD.x, GUARD.y) && !blocked(GUARD.x, GUARD.y)) {
        var d = Math.hypot(GUARD.x - S.p0[0], GUARD.y - S.p0[1]);
        if (d > S.walkMax) S.walkMax = d;
      }
      S.p0 = [GUARD.x, GUARD.y];
      if (!wait(3500)) break;
      note('G1', 'moved=' + Math.hypot(GUARD.x - S.g0[0], GUARD.y - S.g0[1]).toFixed(1)
        + ' allOnWalkable=' + (S.walkMax >= 0 ? 'Y' : 'N')
        + ' spot=' + GUARD.spot + ' hasPath=' + (GUARD.path ? GUARD.path.length : -1));
      S.ph = 2; break;

    /* ---------- G2 巡逻路线逐格重放 ---------- */
    case 2: {
      var offTot = 0, cells = 0, nulls = 0;
      for (var i = 0; i < GUARD_SPOTS.length; i++){
        var a = GUARD_SPOTS[i], b = GUARD_SPOTS[(i + 1) % GUARD_SPOTS.length];
        var P = guidePath(a.x, a.y, b.x, b.y);
        if (P === null) { nulls++; S.routeBad.push(i + ':NULL'); continue; }
        var po = pathOffends(P);
        cells += po.n; offTot += po.off;
        if (po.off) S.routeBad.push(i + ':' + po.off + '/' + po.first);
      }
      note('G2', 'legs=' + GUARD_SPOTS.length + ' null=' + nulls
        + ' cellsChecked=' + cells + ' offending=' + offTot
        + ' bad=' + (S.routeBad.length ? S.routeBad.join(' ') : 'none'));
      S.ph = 3; S.mark = Date.now(); break;
    }

    /* ---------- G3 走近 → 气泡 ---------- */
    case 3:
      note('G3tp', 'tp=' + tpNearGuard() + ' dGP=' + dGP().toFixed(0));
      S.ph = 4; S.mark = Date.now(); break;
    case 4:
      if (!wait(600)) break;
      note('G3', 'near=' + GUARD.near + ' ctip=' + (ctipOn() ? 'shown' : 'HIDDEN')
        + ' txt=' + JSON.stringify(ctipTxt()) + ' dGP=' + dGP().toFixed(0)
        + ' pos=' + (function(){ var e = document.getElementById('ctip');
            return e ? ((parseFloat(e.style.left) | 0) + ',' + (parseFloat(e.style.top) | 0)) : '-'; })());
      key('c');
      S.ph = 5; S.mark = Date.now(); break;

    /* ---------- G4 按 C → 抽屉开 ---------- */
    case 5:
      if (!wait(1200)) break;
      note('G4', 'plat=' + CENTER.plat + ' waiting=' + CENTER.waiting
        + ' ctrP=' + (platOn() ? 'shown' : 'HIDDEN')
        + ' src=' + (ctrF ? ctrF.getAttribute('src') : '-')
        + ' tip=' + (function(){ var e = document.getElementById('ctrTip');
            return e && !e.hidden ? JSON.stringify(e.textContent) : 'hidden'; })());
      S.ph = 6; S.mark = Date.now(); break;

    /* ---------- G5 抽屉里真的渲染出了 laoding ---------- */
    case 6: {
      var d = frameDoc();
      if (!d || d.readyState !== 'complete') {
        if (Date.now() - S.mark > 12000) { note('G5', 'TIMEOUT readyState=' + (d ? d.readyState : 'noframe')); S.ph = 7; S.mark = Date.now(); }
        break;
      }
      var gi = d.getElementById('guard-img');
      note('G5', 'title=' + JSON.stringify((d.title || '').slice(0, 24))
        + ' hasGuardImg=' + (gi ? 'Y' : 'N')
        + ' natural=' + (gi ? gi.naturalWidth + 'x' + gi.naturalHeight : '-')
        + ' bodyLen=' + (d.body ? d.body.innerHTML.length : -1));
      S.ph = 7; S.mark = Date.now(); break;
    }

    /* ---------- G6 抽屉锁步：按方向键玩家不动 ---------- */
    case 7:
      S.start = pickOpenStart();
      if (!S.start) { note('G6', 'NOSTART'); S.ph = 99; break; }
      player.x = S.start.x; player.y = S.start.y;            // 两次测试都从这儿起跑
      S.p0 = [player.x, player.y];
      key('ArrowRight');
      S.ph = 8; S.mark = Date.now(); break;
    case 8:
      if (!wait(600)) break;
      keyUp('ArrowRight');
      note('G6', 'drawerOpen=' + CENTER.plat
        + ' playerMoved=' + Math.hypot(player.x - S.p0[0], player.y - S.p0[1]).toFixed(2));
      /* 在 **iframe** 里按 Esc（71b 把监听绑在 iframe 的 document 上） */
      var d = frameDoc();
      if (d) d.dispatchEvent(new KeyboardEvent('keydown',
        { key: 'Escape', code: 'Escape', bubbles: true, cancelable: true }));
      else key('Escape');
      S.ph = 9; S.mark = Date.now(); break;

    /* ---------- G7 iframe 里按 Esc → 关抽屉 ---------- */
    case 9:
      if (!wait(500)) break;
      note('G7', 'plat=' + CENTER.plat + ' ctrP=' + (platOn() ? 'shown' : 'HIDDEN'));
      S.ph = 10; S.mark = Date.now(); break;

    /* ---------- G8 关掉抽屉后玩家恢复位移 ---------- */
    case 10:
      player.x = S.start.x; player.y = S.start.y;            // 同一个起跑点，唯一变量 = 抽屉开没开
      S.p0 = [player.x, player.y];
      key('ArrowRight');
      S.ph = 11; S.mark = Date.now(); break;
    case 11:
      if (!wait(600)) break;
      keyUp('ArrowRight');
      note('G8', 'playerMoved=' + Math.hypot(player.x - S.p0[0], player.y - S.p0[1]).toFixed(2)
        + ' plat=' + CENTER.plat);
      S.ph = 99; break;
    }
  }

  var T = setInterval(function(){
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


def kill_profile():
    ps = ("Get-CimInstance Win32_Process -Filter \"Name='chrome.exe'\" | "
          "Where-Object { $_.CommandLine -like '*_gdprobe_prof*' } | "
          "ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }")
    subprocess.run(['powershell', '-NoProfile', '-Command', ps], capture_output=True)


def main():
    if not os.path.exists(CHROME):
        raise SystemExit('找不到 Chrome：' + CHROME)
    html = io.open(os.path.join(PROJ, u'像素校园_全校地图.html'), encoding='utf-8').read()
    assert '</body>' in html, '源产物里没有 </body>'
    gen = html.replace('</body>', PROBE + '</body>')
    # ⚠️ 必须落在 frontend/public/ 里，`/ld` 代理才跟得上（同一个 Vite 服务在发它）。
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
    print('GUARD PROBE  (老丁要真走路、抽屉要真加载 laoding，全程约 20~60s；判读见最后的 GDP| 行)')
    try:
        for i in range(MAXTICKS):
            time.sleep(0.5)
            t = read_title()
            if t != last:
                last = t
                if 'G8=' in t:
                    done = True
                    break
                if t.startswith('GDP|'):
                    print('  t=%5.1fs  %s' % (i * 0.5, t[4:][:170]))
        if done:
            print('\n==== 最终 ====')
            print(last[4:].replace(' | ', '\n'))
        else:
            print('\n!! 没跑完（%d 个 tick 用光）。最后一次读到：' % MAXTICKS)
            print(last)
    finally:
        p.terminate()
        kill_profile()
        # ⚠️ 收尾必须**逐个精确路径**删（桌面/交付目录里绝不扫描式清理）。
        #    PUB 尤其重要：它落在 frontend/public/ 里，是要被 Vite 发布出去的目录。
        for _f in (OUT, PUB):
            try:
                if os.path.exists(_f):
                    os.remove(_f)
            except OSError:
                pass


if __name__ == '__main__':
    main()
