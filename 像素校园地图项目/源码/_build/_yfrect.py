# -*- coding: utf-8 -*-
"""打印逸夫楼道具在**世界坐标**里的精灵矩形（给 _scene.py 取景用）。

逸夫楼在 props 里认不出 tag（`_bldview.py` 文件头说明过：只有体育馆有 tag），
唯一认得出的特征是**尺寸 714x468**。这里按尺寸取它，输出 `x0 y0 x1 y1`
（= 精灵图的世界包围盒，含 ax/ay 的偏移），直接贴给 `_scene.py`。
"""
import io, os, re, subprocess

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(HERE)
SRC = os.path.join(PROJ, '像素校园_全校地图.html')
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
TMP = os.path.join(HERE, '_yfrect_gen.html')
W, H = 714, 468

PROBE = """
<script>
window.addEventListener('load', function(){ setTimeout(function(){
  var t = [];
  for (var i = 0; i < props.length; i++) {
    var p = props[i];
    if (p.img.width === %(W)d && p.img.height === %(H)d)
      t.push([p.x, p.y, p.ax, p.ay, p.baseY, (p.tag||'-')].join(','));
  }
  document.title = 'DIAG|' + t.join(' ; ');
}, 2500); });
</script>
""" % {'W': W, 'H': H}

html = io.open(SRC, encoding='utf-8').read().replace('</body>', PROBE + '</body>', 1)
io.open(TMP, 'w', encoding='utf-8', newline='\n').write(html)
dom = subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--no-sandbox',
                      '--virtual-time-budget=20000', '--window-size=1400,400',
                      '--dump-dom', 'file:///' + TMP],
                     capture_output=True).stdout.decode('utf-8', 'replace')
m = re.search(r'<title>(.*?)</title>', dom, re.S)
t = (m.group(1) if m else 'NO TITLE').strip()
print('DIAG|', t)
for one in t.replace('DIAG|', '').split(';'):
    v = [x for x in one.strip().split(',') if x != '']
    if len(v) < 5:
        continue
    x, y, ax, ay = (int(float(v[i])) for i in range(4))
    print('  p.x=%d p.y=%d ax=%d ay=%d  ⇒ 精灵世界矩形 x %d..%d  y %d..%d'
          % (x, y, ax, ay, x - ax, x - ax + W, y - ay, y - ay + H))
