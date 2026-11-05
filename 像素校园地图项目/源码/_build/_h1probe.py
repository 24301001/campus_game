# -*- coding: utf-8 -*-
"""H1 差分探针：把鸭子/水面/玩家在 accept H1 那一刻的状态全部倒出来。

为什么不能靠读代码推：H1 的 `sc` 是 90 帧迭代后的**不动点**，
而我对本轮改动的"应该没影响"三次推理都被实测推翻（makeRng 无状态、专用种子、
panicStep 只读 o.area）。所以直接把状态打成一行 JSON 做 A/B。

用法：python _h1probe.py [html]   默认读 源码\像素校园_全校地图.html
"""
import io, os, re, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(HERE)
SRC = sys.argv[1] if len(sys.argv) > 1 else os.path.join(PROJ, u'像素校园_全校地图.html')
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
OUT = os.path.join(HERE, '_h1_gen.html')

PROBE = r"""
<script>
(function(){
  function r3(v){ return Math.round(v*1000)/1000; }
  var o = {};
  try {
    o.water = WATER.map(function(w){ return [r3(w.x), r3(w.y), r3(w.w), r3(w.h)]; });
    o.A = [r3(DUCK_AREA.x), r3(DUCK_AREA.y), r3(DUCK_AREA.w), r3(DUCK_AREA.h)];
    o.avoid = WATER_AVOID.length;
    o.nDuck = ducks.length;
    var d = ducks[0];
    o.orb = [r3(d.cx), r3(d.cy), r3(d.rx), r3(d.ry)];
    o.phsp = [r3(d.ph), r3(d.sp)];
    o.kn = [d.safe, d.run, d.rise, d.fall, d.area === DUCK_AREA];
    o.start = [r3(d.x), r3(d.y), r3(d.x0), r3(d.y0), r3(d.sc||0)];
    /* 复现 accept H1 的前半段 */
    var saved = WATER_AVOID.splice(0, WATER_AVOID.length);
    var PX = d.x + 20, PY = d.y;
    player.x = PX; player.y = PY;
    o.px = [r3(PX), r3(PY)];
    o.d0 = [r3(d.x), r3(d.y), r3(d.cx), r3(d.cy)];   /* 站定后、迭代前的轨道点 */
    for (var f = 0; f < 90; f++) animateWater(1/60);
    o.off = [r3(d.x - d.x0), r3(d.y - d.y0), r3(d.sc)];
    o.end = [r3(d.x), r3(d.y)];
    o.dA = r3(Math.hypot(d.x - PX, d.y - PY));
    /* 逐帧轨迹前 6 帧，看 sc 是不是根本没说上话 */
    WATER_AVOID.push.apply(WATER_AVOID, saved);
    o.err = null;
  } catch (e) { o.err = String(e); }
  document.title = 'H1|' + JSON.stringify(o);
})();
</script>
"""

html = io.open(SRC, encoding='utf-8').read()
html = html.replace('</body>', PROBE + '</body>')
io.open(OUT, 'w', encoding='utf-8', newline='\n').write(html)

p = subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--no-sandbox',
                    '--dump-dom', 'file:///' + OUT.replace('\\', '/')],
                   capture_output=True, check=False)
m = re.search(r'<title>(.*?)</title>', p.stdout.decode('utf-8', 'replace'), re.S)
if not m:
    print('NO TITLE —— 整页 JS 没跑起来')
    sys.exit(1)
import html as _h
print(u'源：%s' % SRC)
print(_h.unescape(m.group(1)))
