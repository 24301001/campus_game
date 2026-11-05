# -*- coding: utf-8 -*-
"""把**构建产物**按世界矩形合成一张图：地面画布 + 道具（按 baseY 排序）+ 可选碰撞盒。

为什么必须要有它：现有两个探针各看一半，都判不出"这一段地图画成了什么" ——
  · `_gview.py` 只画 `groundCanvas`，道具一个都不画（看得到广场铺装，看不到楼和坐像）；
  · `_propview.py` 只画**一个**道具的精灵（看得到楼画得对不对，看不到它和广场的关系）；
  · `_gt.py` 只给分类字符，连颜色都没有。
而"楼有没有压住台阶""坐像是不是站在台阶上""树有没有长到广场中间"这类问题，
**三套自动验收全查不出**，只能靠这张合成图。

用法：python _scene.py x0 y0 x1 y1 [倍率=1] [out=_look/sc.png] [--sol]
  --sol  额外叠一层**碰撞盒**（青色 1px 框 + 半透明填充），用来对 addSolid 的落点。
"""
import io, os, re, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(HERE)
SRC = os.environ.get('SCENE_SRC') or os.path.join(PROJ, u'像素校园_全校地图.html')
# ↑ 可用环境变量指向**任意一版产物**（如 _build/_b16_base.html）做前后对照：
#   SCENE_SRC=_build/_b16_base.html python _scene.py ...
#   量"改了之后这块变成什么样"必须两边都出图，只出新的等于没对照。
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
OUT = os.path.join(HERE, '_scene_gen.html')

X0, Y0, X1, Y1 = [int(v) for v in sys.argv[1:5]]
Z = int(sys.argv[5]) if len(sys.argv) > 5 and not sys.argv[5].startswith('-') else 1
_rest = [a for a in sys.argv[6:] if not a.startswith('-')]
SOL = '--sol' in sys.argv
PNG = _rest[0] if _rest else os.path.join(HERE, '_look', 'sc.png')
# ⚠️ 必须绝对路径：chrome 的 --screenshot 是相对**它自己的** cwd 落的
if not os.path.isabs(PNG):
    PNG = os.path.join(HERE, PNG)

PROBE = """
<script>
(function(){
  var x0=__X0__, y0=__Y0__, x1=__X1__, y1=__Y1__, z=__Z__, sol=__SOL__;
  var cv = document.createElement('canvas');
  cv.width = (x1-x0)*z; cv.height = (y1-y0)*z;
  var g = cv.getContext('2d');
  g.imageSmoothingEnabled = false;
  g.drawImage(groundCanvas, x0, y0, x1-x0, y1-y0, 0, 0, cv.width, cv.height);
  /* 与主循环同一条口径：按 baseY 升序，后画的盖前面的 */
  var L = props.slice().sort(function(a,b){ return a.baseY - b.baseY; });
  var n = 0;
  for (var i = 0; i < L.length; i++) {
    var p = L[i];
    var sx = (p.x - p.ax - x0) * z, sy = (p.y - p.ay - y0) * z;
    var sw = p.img.width * z, sh = p.img.height * z;
    if (sx + sw < 0 || sy + sh < 0 || sx > cv.width || sy > cv.height) continue;
    g.drawImage(p.img, sx, sy, sw, sh);
    n++;
  }
  if (sol) {
    g.lineWidth = 1;
    for (var k = 0; k < solids.length; k++) {
      var b = solids[k];
      g.fillStyle = 'rgba(0,220,220,0.18)';
      g.strokeStyle = 'rgba(0,220,220,0.85)';
      g.fillRect((b.x-x0)*z, (b.y-y0)*z, b.w*z, b.h*z);
      g.strokeRect((b.x-x0)*z+0.5, (b.y-y0)*z+0.5, b.w*z-1, b.h*z-1);
    }
  }
  document.body.style.margin = '0';
  document.body.innerHTML = '';
  document.body.appendChild(cv);
  document.title = 'SC|' + cv.width + 'x' + cv.height + '||drawn=' + n + '/' + L.length
                   + ' solids=' + solids.length;
})();
</script>
"""

html = io.open(SRC, encoding='utf-8').read()
html = html.replace('</body>', (PROBE.replace('__X0__', str(X0)).replace('__Y0__', str(Y0))
                               .replace('__X1__', str(X1)).replace('__Y1__', str(Y1))
                               .replace('__Z__', str(Z))
                               .replace('__SOL__', 'true' if SOL else 'false')) + '</body>')
io.open(OUT, 'w', encoding='utf-8', newline='\n').write(html)

p = subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--no-sandbox',
                    '--dump-dom', 'file:///' + OUT.replace('\\', '/')],
                   capture_output=True, check=False)
m = re.search(r'<title>(.*?)</title>', p.stdout.decode('utf-8', 'replace'), re.S)
print('title:', m.group(1) if m else 'NO TITLE（整页 JS 没跑？）')
if not m:
    sys.exit(1)
w, h = m.group(1).split('|')[1].split('x')

p = subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--no-sandbox',
                    '--hide-scrollbars', '--window-size=%s,%s' % (w, h),
                    '--screenshot=' + PNG, 'file:///' + OUT.replace('\\', '/')],
                   capture_output=True, check=False)
print(PNG, os.path.getsize(PNG) if os.path.exists(PNG) else 'MISSING')
