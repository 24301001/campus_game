# -*- coding: utf-8 -*-
"""建筑遮挡虚化端到端探针（第三十七轮 2026-09-30）。

为什么必须单独有一个：accept / verify / zoomtest 三套**一个像素都不看**，
而这一轮加的是**渲染期逐条目改画布全局状态**（`ctx.globalAlpha`）——
"某个条目忘了复位"这类错，静态读代码看不出来、跑起来也不抛错，
只会让**下一帧的整片地面**悄悄变淡。`_edge.py` 能抓"页面死了"，
抓不到"画面错了"。所以这里把 `drawImage` 包一层，**逐笔记下当时的 alpha**。

⚠️ 零产品钩子：产品代码里**一行测试后门都不加**。探针只做两件事 ——
   ① 包 `CanvasRenderingContext2D.prototype.drawImage` / `clearRect`（浏览器 API）；
   ② 读产品本来就有的全局（`BLD_IMGS` / `props` / `player` / `GUIDE`）。

它验八件事：

  P0  登记表接上了没：`BLD_IMGS` 有几张画布、能不能在 `props` 里一一对上
  P1  **空地对照**：站在哪儿都不挡人的地方 ⇒ 所有 `drawImage` 的 alpha **全是 1**
  P2  ⭐ **楼后触发**：挪到某栋楼正北（被它盖住）⇒ 至少一笔 alpha < 1
  P3  ⭐ **淡的正好是那一栋**：alpha < 1 的画布**都属于** `BLD_IMGS`，且**只有一栋**
  P4  ⭐ **走出来就复原**：挪回空地 ⇒ 全部回到 1
  P5  ⭐ **小北也算**：玩家站空地、把她挪到同一栋楼后面 ⇒ 那栋楼照样淡
  P6  ⭐ **不闪**：淡入过程中连采的 alpha 必须**单调不增**且中间值够多（不是 1 → 0.34 跳变）
  P7  ⭐ **不泄漏**：每一帧**第一笔**（地面 mip）的 alpha 恒为 1 —— 这是本轮最要命的那条

⚠️ 判读口径：
    · P1 / P4 / P7 是**空对照**。没有它们，"楼后 alpha < 1"可能只是因为
      整块画布本来就半透明、或者上一帧的 alpha 漏到了这一帧的地面 ⇒ 判据假绿。
      这是闸门线一路换来的教训：任何"看到 X 就说 Y 成立"都必须先问
      「有没有一个已知的量也能造成 X」。
    · P6 的"单调"只在**淡入那一段**上判：从空地挪到楼后是单向的，
      所以这段序列天然应该单调不增。挪出去的 P4 单独判"回到 1"，不参与单调性。
"""
import io, json, os, shutil, subprocess, time, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(os.path.dirname(HERE), '像素校园_全校地图.html')
OUT = os.path.join(HERE, '_oprobe_gen.html')
PROF = os.path.join(HERE, '_oprobe_prof')          # 名字要独特：收尾按它筛进程
PORT = 9342
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
MAXTICKS = 300                                     # 300 × 0.5s = 150s 上限

PROBE = r"""
<script>
(function(){
  var R = [];
  function note(k, v){ R.push(k + '=' + v); }
  function flush(){ document.title = 'OP|' + R.join(' | '); }
  window.onerror = function(m, u, l, c){ note('ERR@' + l + ':' + c, m); flush(); return false; };

  /* ---------- ① 包浏览器 API：逐笔记 alpha ---------- */
  var REC = false;                 // 只在要判读的窗口里记，省内存也省判断
  var SEQ = {};                    // canvas -> [alpha,...]（用下标当键，避免 Map 迭代顺序问题）
  var KEYS = [];                   // 与 SEQ 对应的 canvas 列表
  var FRAME = 0, FIRSTA = [];      // 每帧第一笔 drawImage 的 alpha（那就是地面 mip）

  function slot(im){
    var i = KEYS.indexOf(im);
    if (i < 0) { KEYS.push(im); SEQ[KEYS.length - 1] = []; i = KEYS.length - 1; }
    return i;
  }
  function clearSeq(){ SEQ = {}; KEYS = []; FIRSTA = []; }

  var _di = CanvasRenderingContext2D.prototype.drawImage;
  CanvasRenderingContext2D.prototype.drawImage = function(){
    var main = this.canvas && this.canvas.id === 'cv';
    if (REC && main){
      if (FIRSTA[FRAME] === undefined) FIRSTA[FRAME] = this.globalAlpha;
      var i = slot(arguments[0]);
      SEQ[i].push(this.globalAlpha);
    }
    return _di.apply(this, arguments);
  };
  var _cr = CanvasRenderingContext2D.prototype.clearRect;
  CanvasRenderingContext2D.prototype.clearRect = function(){
    if (this.canvas && this.canvas.id === 'cv') FRAME++;
    return _cr.apply(this, arguments);
  };

  /* ---------- ② 认楼与选点（全部读产品既有的全局，不加后门） ---------- */
  function bldList(){
    var out = [];
    for (var i = 0; i < props.length; i++)
      if (BLD_IMGS.has(props[i].img)) out.push(props[i]);
    return out;
  }
  function label(b){
    return (b.tag || '-') + '#' + (b.img.width) + 'x' + (b.img.height)
         + '@' + (b.x | 0) + ',' + (b.y | 0);
  }
  /* 人精灵矩形中心落在楼的精灵矩形内，且楼画在人之后 ⇒ 这栋楼会盖住这个人。
     ⚠️ 判据与 parts/73_occl.js 的 occlTick **逐字同款** —— 探针不许自己发明一套。 */
  function occludedBy(x, y, b){
    if (b.baseY <= y) return false;
    var cx = x - CH_AX + CH_W / 2, cy = y - CH_AY + CH_H / 2;
    return cx >= b.x - b.ax && cx <= b.x - b.ax + b.img.width &&
           cy >= b.y - b.ay && cy <= b.y - b.ay + b.img.height;
  }
  /* 找一个人精灵矩形**不被任何楼盖住**的可走点（空对照用）。
     avoid/minD：再要一个离它足够远的（用来把小北支开 —— 她要是也站在某栋楼后，
     那栋楼就该为她变淡，P1/P4 的"全 1"判据会被搅浑）。 */
  function openSpot(B, avoid, minD){
    for (var y = 220; y < WORLD_H - 220; y += 37){
      for (var x = 220; x < WORLD_W - 220; x += 41){
        if (!canWalk(x, y) || blocked(x, y)) continue;
        if (avoid && Math.hypot(x - avoid[0], y - avoid[1]) < (minD || 0)) continue;
        var ok = true;
        for (var i = 0; i < B.length; i++) if (occludedBy(x, y, B[i])) { ok = false; break; }
        if (ok) return [x, y];
      }
    }
    return null;
  }
  /* 找目标楼**附近**一个可走、且不被任何楼盖住的点。
     ⚠️ 为什么非要"附近"而不是用全局空点：相机跟着玩家走，玩家跑远了这栋楼就被
        视口裁掉、根本不进 drawList ⇒ 判据会**假绿**（没画当然没有 alpha < 1）。
        P1/P4/P5/P7 全部要在这栋楼**正在被画**的前提下判。 */
  function nearSpot(B, b){
    for (var r = 120; r <= 480; r += 30){
      for (var a = 0; a < 16; a++){
        var x = b.x + r * Math.cos(a * Math.PI / 8);
        var y = b.baseY + r * Math.sin(a * Math.PI / 8);
        if (!canWalk(x, y) || blocked(x, y)) continue;
        var ok = true;
        for (var i = 0; i < B.length; i++) if (occludedBy(x, y, B[i])) { ok = false; break; }
        if (ok) return [x, y];
      }
    }
    return null;
  }
  /* 找一栋楼**正北**一个可走点（楼体碰撞盒深 34 + 人的半高，所以至少要让开 45px）。
     返回 [x, y, 这栋楼的 prop]。 */
  function behindSpot(B){
    for (var i = 0; i < B.length; i++){
      var b = B[i];
      for (var dy = 45; dy <= 260; dy += 5){
        for (var dx = -b.img.width / 2 + 6; dx <= b.img.width / 2 - 6; dx += 10){
          var x = b.x + dx, y = b.baseY - dy;
          if (!canWalk(x, y) || blocked(x, y)) continue;
          if (occludedBy(x, y, b)) return [x, y, b];
        }
      }
    }
    return null;
  }

  function fadedKeys(){
    var out = [];
    for (var i = 0; i < KEYS.length; i++){
      var v = SEQ[i];
      for (var j = 0; j < v.length; j++) if (v[j] < 1) { out.push(KEYS[i]); break; }
    }
    return out;
  }
  function minAlpha(im){
    var i = KEYS.indexOf(im);
    if (i < 0) return null;
    var v = SEQ[i], m = 1;
    for (var j = 0; j < v.length; j++) if (v[j] < m) m = v[j];
    return m;
  }
  function seqOf(im){
    var i = KEYS.indexOf(im);
    return i < 0 ? [] : SEQ[i];
  }
  function badInfo(B){
    var out = [];
    for (var i = 0; i < KEYS.length; i++){
      var v = SEQ[i], m = 1;
      for (var j = 0; j < v.length; j++) if (v[j] < m) m = v[j];
      if (m >= 1) continue;
      var lbl = '?';
      for (var k = 0; k < B.length; k++) if (B[k].img === KEYS[i]) lbl = label(B[k]);
      out.push(lbl + '|min=' + m.toFixed(3) + '|n=' + v.length);
    }
    return out.length ? out.join(' ') : 'none';
  }
  function allOne(){
    for (var i = 0; i < KEYS.length; i++)
      for (var j = 0; j < SEQ[i].length; j++) if (SEQ[i][j] !== 1) return false;
    return true;
  }
  /* ⚠️ "复原"**不能**用 allOne 判：从楼后走出来的那个窗口里，头几十帧本来就该
     是 0.34 往上爬的恢复斜坡 —— 拿 allOne 去卡，卡住的是**合法的中间态**，
     报出来的红是假红。要看的是**末尾有没有归位**（最后 10 笔必须全是 1）。 */
  function settled(){
    for (var i = 0; i < KEYS.length; i++){
      var v = SEQ[i], n = v.length;
      if (!n) continue;
      for (var j = Math.max(0, n - 10); j < n; j++) if (v[j] !== 1) return false;
    }
    return true;
  }
  function firstLast(im){
    var v = seqOf(im);
    if (!v.length) return '-';
    return v[0].toFixed(3) + '>' + v[v.length - 1].toFixed(3);
  }

  /* 把她挪走：免得她正好站在同一栋楼后面，把 P2/P3 的判据搅浑。 */
  function parkGuide(p){
    GUIDE.x = p[0]; GUIDE.y = p[1];
  }

  var S = { ph: 0, mark: 0, B: null, near: null, gpark: null, bld: null, spot: null };
  function wait(ms){ return Date.now() - S.mark >= ms; }

  function run(){
    switch (S.ph) {

    /* ---------- P0 登记表接上了没 ---------- */
    case 0: {
      S.B = bldList();
      var miss = 0;
      BLD_IMGS.forEach(function(c){
        var hit = false;
        for (var i = 0; i < props.length; i++) if (props[i].img === c) { hit = true; break; }
        if (!hit) miss++;
      });
      note('P0', 'bldImgs=' + BLD_IMGS.size + ' inProps=' + S.B.length + ' orphan=' + miss
        + ' props=' + props.length);
      var bs = behindSpot(S.B);
      if (bs){ S.spot = [bs[0], bs[1]]; S.bld = bs[2]; }
      S.near = S.bld ? nearSpot(S.B, S.bld) : null;
      S.gpark = openSpot(S.B, S.near || [0, 0], 400);
      note('P0b', 'near=' + (S.near ? (S.near[0] | 0) + ',' + (S.near[1] | 0) : 'NULL')
        + ' gpark=' + (S.gpark ? (S.gpark[0] | 0) + ',' + (S.gpark[1] | 0) : 'NULL')
        + ' behind=' + (S.spot ? (S.spot[0] | 0) + ',' + (S.spot[1] | 0) : 'NULL')
        + ' bld=' + (S.bld ? label(S.bld) : '-'));
      S.ph = 1; break;
    }

    /* ---------- P1 空地对照：所有 alpha 全 1 ---------- */
    case 1:
      if (S.near){
        player.x = S.near[0]; player.y = S.near[1];
        parkGuide(S.gpark || [S.near[0] + 40, S.near[1]]);
      }
      clearSeq(); REC = true;
      S.ph = 2; S.mark = Date.now(); break;

    case 2:
      if (!wait(600)) break;
      REC = false;
      note('P1', 'calls=' + (function(){ var n = 0; for (var i = 0; i < KEYS.length; i++) n += SEQ[i].length; return n; })()
        + ' canvases=' + KEYS.length
        + ' allOne=' + (allOne() ? 'Y' : 'N')
        + ' bad=' + fadedKeys().length);
      /* 挪到楼后 */
      if (S.spot){
        player.x = S.spot[0]; player.y = S.spot[1];
        parkGuide([S.near[0], S.near[1]]);
      }
      clearSeq(); REC = true;
      S.ph = 3; S.mark = Date.now(); break;

    /* ---------- P2 楼后触发 ---------- */
    case 3:
      if (!wait(900)) break;
      REC = false;
      note('P2', 'spot=' + (S.spot ? 'Y' : 'N')
        + ' occl=' + (S.spot ? occludedBy(S.spot[0], S.spot[1], S.bld) : '-')
        + ' minA=' + (S.bld ? minAlpha(S.bld.img) : '-')
        + ' fadedN=' + fadedKeys().length);
      S.ph = 4; break;

    /* ---------- P3 淡的正好是那一栋 ---------- */
    case 4: {
      var f = fadedKeys(), sa = 0, bad = [], tag = [];
      for (var i = 0; i < f.length; i++){
        if (BLD_IMGS.has(f[i])) sa++; else bad.push('NOTBLD');
        tag.push(f[i] === (S.bld && S.bld.img) ? 'TARGET' : 'OTHER');
      }
      var others = 0;
      for (var j = 0; j < tag.length; j++) if (tag[j] === 'OTHER') others++;
      note('P3', 'faded=' + f.length + ' allBld=' + (bad.length ? 'N(' + bad.join(',') + ')' : 'Y')
        + ' targetFaded=' + (S.bld && minAlpha(S.bld.img) !== null && minAlpha(S.bld.img) < 1 ? 'Y' : 'N')
        + ' others=' + others);
      /* 挪回空地：走出来就该复原 */
      player.x = S.near[0]; player.y = S.near[1];
      parkGuide(S.gpark || [S.near[0] + 40, S.near[1]]);
      clearSeq(); REC = true;
      S.ph = 5; S.mark = Date.now(); break;
    }

    /* ---------- P4 走出来就复原 ---------- */
    case 5:
      if (!wait(900)) break;
      REC = false;
      note('P4', 'settled=' + (settled() ? 'Y' : 'N')
        + ' tgtSeq=' + (S.bld ? firstLast(S.bld.img) : '-')
        + ' anyFaded=' + fadedKeys().length
        + ' pAt=' + (player.x | 0) + ',' + (player.y | 0)
        + ' gAt=' + (GUIDE.x | 0) + ',' + (GUIDE.y | 0)
        + ' who=' + badInfo(S.B));
      /* 玩家留空地，把小北挪到楼后 */
      if (S.spot){
        parkGuide([S.spot[0], S.spot[1]]);
      }
      clearSeq(); REC = true;
      S.ph = 6; S.mark = Date.now(); break;

    /* ---------- P5 小北也算 ---------- */
    case 6:
      if (!wait(900)) break;
      REC = false;
      note('P5', 'gAt=' + (GUIDE.x | 0) + ',' + (GUIDE.y | 0)
        + ' occl=' + (S.spot ? occludedBy(GUIDE.x, GUIDE.y, S.bld) : '-')
        + ' minA=' + (S.bld ? minAlpha(S.bld.img) : '-')
        + ' fadedN=' + fadedKeys().length);
      /* 收尾：小北挪回空地，玩家也回空地 —— 让 P7 在一个"干净"的基线上跑 */
      parkGuide(S.gpark || [S.near[0] + 40, S.near[1]]);
      player.x = S.near[0]; player.y = S.near[1];
      S.ph = 7; S.mark = Date.now(); break;

    /* ---------- P7 不泄漏：每帧第一笔（地面）恒为 1 ---------- */
    case 7:
      if (!wait(700)) break;
      note('P7a', 'frames=' + FIRSTA.length
        + ' badGround=' + (function(){
            var n = 0;
            for (var i = 0; i < FIRSTA.length; i++) if (FIRSTA[i] !== undefined && FIRSTA[i] !== 1) n++;
            return n;
          })());
      /* P6：连采淡入过程的 alpha 序列（不清 SEQ，专门盯那栋楼） */
      clearSeq(); REC = true;
      if (S.spot){ player.x = S.spot[0]; player.y = S.spot[1]; }
      S.ph = 8; S.mark = Date.now(); break;

    case 8: {
      /* ⚠️ 等"采够 12 笔"而不是等固定毫秒数：录制窗口按墙上时钟算的话，
         headless 的帧率一抖（实测同一张页两次跑，一次 28 笔一次 1 笔）
         就会采到空窗口，P6 判成"没插值"——那是**假红**。 */
      var v8 = S.bld ? seqOf(S.bld.img) : [];
      if (v8.length < 12 && !wait(2000)) break;
      REC = false;
      S.ph = 9; break;
    }

    /* ---------- P6 不闪：单调不增 + 中间值够多 ---------- */
    case 9: {
      var v = S.bld ? seqOf(S.bld.img) : [];
      var mono = true, up = 0, mn = 1, mx = 1;
      for (var i = 0; i < v.length; i++){
        if (v[i] < mn) mn = v[i];
        if (v[i] > mx) mx = v[i];
        if (i && v[i] > v[i - 1] + 1e-9) { up++; mono = false; }
      }
      var uniq = {};
      for (var j = 0; j < v.length; j++) uniq[v[j].toFixed(4)] = 1;
      var tot = 0;
      for (var q = 0; q < KEYS.length; q++) tot += SEQ[q].length;
      note('P6', 'n=' + v.length + ' canvases=' + KEYS.length + ' calls=' + tot
        + ' mono=' + (mono ? 'Y' : 'N') + ' ups=' + up
        + ' first=' + (v.length ? v[0].toFixed(3) : '-') + ' last=' + (v.length ? v[v.length - 1].toFixed(3) : '-')
        + ' min=' + mn.toFixed(3) + ' max=' + mx.toFixed(3)
        + ' uniq=' + Object.keys(uniq).length);
      /* 再跑一遍泄漏判据 —— 这次基线是"刚刚有过淡入"，最能逼出残留 */
      clearSeq(); FIRSTA = [];
      player.x = S.near[0]; player.y = S.near[1];
      parkGuide(S.gpark || [S.near[0] + 40, S.near[1]]);
      REC = true;
      S.ph = 10; S.mark = Date.now(); break;
    }

    case 10:
      if (!wait(700)) break;
      REC = false;
      note('P7b', 'frames=' + FIRSTA.length
        + ' badGround=' + (function(){
            var n = 0;
            for (var i = 0; i < FIRSTA.length; i++) if (FIRSTA[i] !== undefined && FIRSTA[i] !== 1) n++;
            return n;
          })()
        + ' settled=' + (settled() ? 'Y' : 'N')
        + ' tgtSeq=' + (S.bld ? firstLast(S.bld.img) : '-')
        + ' anyFaded=' + fadedKeys().length);
      S.ph = 99; break;
    }
  }

  var T = setInterval(function(){
    if (S.ph >= 99) { clearInterval(T); flush(); return; }
    try { run(); } catch (e) { note('THROW', e.message + ' @ph' + S.ph); S.ph = 99; }
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
          "Where-Object { $_.CommandLine -like '*_oprobe_prof*' } | "
          "ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }")
    subprocess.run(['powershell', '-NoProfile', '-Command', ps], capture_output=True)


def main():
    if not os.path.exists(CHROME):
        raise SystemExit('找不到 Chrome：' + CHROME)
    html = io.open(SRC, encoding='utf-8').read()
    assert '</body>' in html, '源产物里没有 </body>'
    io.open(OUT, 'w', encoding='utf-8', newline='\n').write(
        html.replace('</body>', PROBE + '</body>'))

    # ⚠️ 探针脚本先过一遍语法闸：少一个括号，整段 IIFE 在**解析期**就死了，
    #    `window.onerror` 拦不到（它还没装上），页面标题一直是静态标题 ——
    #    表现出来就是"跑满 150 秒、一个字没读到"。栽过一次（P7b 那行多个右括号）。
    _js = PROBE.split('<script>', 1)[1].rsplit('</script>', 1)[0]
    _tmpjs = os.path.join(HERE, '_oprobe_gen.js')
    io.open(_tmpjs, 'w', encoding='utf-8', newline='\n').write(_js)
    _r = subprocess.run(['node', '--check', _tmpjs], capture_output=True)
    if _r.returncode != 0:
        raise SystemExit('探针脚本语法不过：\n' + _r.stderr.decode('utf-8', 'replace'))

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
    print('OCCL PROBE  (逐笔读 drawImage 的 alpha；判读见最后的 OP| 行)')
    try:
        for i in range(MAXTICKS):
            time.sleep(0.5)
            t = read_title()
            if t != last:
                last = t
                if 'P7b=' in t:
                    done = True
                    break
                if t.startswith('OP|'):
                    print('  t=%5.1fs  %s' % (i * 0.5, t[3:][:170]))
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
