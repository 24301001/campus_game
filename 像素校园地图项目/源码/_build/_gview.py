# -*- coding: utf-8 -*-
"""临时：把**烘焙后的地面画布**按世界矩形裁出来放大看，并叠 100px 网格。
用来判"这块地面到底画成了什么"（颜色/纹理），_gt.py 只给分类字符，看不出观感。

用法：python _gview.py x0 y0 x1 y1 [倍率=1] [out=_look/gv.png]
"""
import io, os, re, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(HERE)
SRC = os.path.join(PROJ, u'像素校园_全校地图.html')
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
OUT = os.path.join(HERE, '_gview_gen.html')

X0, Y0, X1, Y1 = [int(v) for v in sys.argv[1:5]]
Z = int(sys.argv[5]) if len(sys.argv) > 5 else 1
PNG = sys.argv[6] if len(sys.argv) > 6 else os.path.join(HERE, '_look', 'gv.png')
if not os.path.isabs(PNG):
    PNG = os.path.join(HERE, PNG)

PROBE = """
<script>
(function(){
  var cv = document.createElement('canvas');
  var x0=__X0__, y0=__Y0__, x1=__X1__, y1=__Y1__, z=__Z__;
  cv.width = (x1-x0)*z; cv.height = (y1-y0)*z;
  var g = cv.getContext('2d');
  g.imageSmoothingEnabled = false;
  g.drawImage(groundCanvas, x0, y0, x1-x0, y1-y0, 0, 0, cv.width, cv.height);
  g.fillStyle = 'rgba(255,0,255,0.55)';
  for (var X = Math.ceil(x0/100)*100; X < x1; X += 100) g.fillRect((X-x0)*z, 0, 1, 6);
  for (var Y = Math.ceil(y0/100)*100; Y < y1; Y += 100) g.fillRect(0, (Y-y0)*z, 6, 1);
  document.body.style.margin = '0';
  document.body.innerHTML = '';
  document.body.appendChild(cv);
  document.title = 'GV|' + cv.width + 'x' + cv.height + '||' + ((window.__diag||[]).join(' '));
})();
</script>
"""

html = io.open(SRC, encoding='utf-8').read()
html = html.replace('</body>', (PROBE.replace('__X0__', str(X0)).replace('__Y0__', str(Y0))
                               .replace('__X1__', str(X1)).replace('__Y1__', str(Y1))
                               .replace('__Z__', str(Z))) + '</body>')
io.open(OUT, 'w', encoding='utf-8', newline='\n').write(html)

p = subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--no-sandbox',
                    '--dump-dom', 'file:///' + OUT.replace('\\', '/')],
                   capture_output=True, check=False)
m = re.search(r'<title>(.*?)</title>', p.stdout.decode('utf-8', 'replace'), re.S)
print('title:', m.group(1) if m else 'NO TITLE')
if not m:
    sys.exit(1)
w, h = m.group(1).split('|')[1].split('x')
p = subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--no-sandbox',
                    '--hide-scrollbars', '--window-size=%s,%s' % (w, h),
                    '--screenshot=' + PNG, 'file:///' + OUT.replace('\\', '/')],
                   capture_output=True, check=False)
print(PNG, os.path.getsize(PNG) if os.path.exists(PNG) else 'MISSING')
