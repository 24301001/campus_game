# -*- coding: utf-8 -*-
"""散射接受集重放：把 `scatter()` 的循环用同一条种子（31415926）在探针里重跑一遍，
逐格报出"接受了 / 被谁挡掉"，用来定位 `n` 平移的**具体格子**。

为什么需要它：`scatter()` 里 `n++` 只对**通过 `ptBlocked` 的点**计数，而 `n` 又是
物种种子（`anyTree((n*131+11)|0)`）⇒ 任何一个固体盒挪位都会让其后所有树换树种。
`_propdiff` 只能告我说"149 件变了"，说不出"是哪几格、被谁挡的"。这个工具补上那一步。

用法：python _scatprobe.py [html] [--rej]
  --rej  连被拒绝的格子一起打印（默认只打印接受的）
"""
import io, os, re, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(HERE)
_a = [x for x in sys.argv[1:] if not x.startswith('--')]
SRC = _a[0] if _a else os.path.join(PROJ, u'像素校园_全校地图.html')
REJ = '--rej' in sys.argv
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
OUT = os.path.join(HERE, '_scat_gen.html')

PROBE = r"""
<script>
(function(){
  /* ⚠️ 必须自己造一条同种子的流重放：加载期的 scatter() 已经把 rngS 抽干了 */
  var rng = makeRng(31415926);
  var out = [], n = 0, nCell = 0, nOut = 0, nBlk = 0;
  for (var gy = 80; gy < WORLD_H - 60; gy += 92) {
    for (var gx = 80; gx < WORLD_W - 60; gx += 92) {
      nCell++;
      var x = gx + (rng() - 0.5) * 54, y = gy + (rng() - 0.5) * 54;
      var why = 'ok';
      if (!insideBoundary(x, y) || distToBound(x, y) < 30) why = 'bound';
      else if (ptBlocked(x, y, 13, 8)) why = 'blk';
      var r = rng();
      if (why === 'bound') nOut++;
      if (why === 'blk') nBlk++;
      if (why === 'ok') {
        n++;
        out.push(n + ':' + Math.round(x) + ',' + Math.round(y) + ':' + cellAtSafe(x, y)
                 + ':' + Math.round(r * 1000));
      } else if (__REJ__) {
        out.push('-' + n + ':' + Math.round(x) + ',' + Math.round(y) + ':' + why);
      }
    }
  }
  document.title = 'SP|cell=' + nCell + ' out=' + nOut + ' blk=' + nBlk + ' acc=' + n
                   + '|' + out.join(' ');
})();
</script>
"""

html = io.open(SRC, encoding='utf-8').read()
html = html.replace('</body>', PROBE.replace('__REJ__', 'true' if REJ else 'false') + '</body>')
io.open(OUT, 'w', encoding='utf-8', newline='\n').write(html)

p = subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--no-sandbox',
                    '--dump-dom', 'file:///' + OUT.replace('\\', '/')],
                   capture_output=True, check=False)
m = re.search(r'<title>(.*?)</title>', p.stdout.decode('utf-8', 'replace'), re.S)
if not m:
    print('NO TITLE —— 整页 JS 没跑起来')
    sys.exit(1)
import html as _h
t = _h.unescape(m.group(1))
head, _, body = t.partition('|')
print(head)
print(u'源：%s' % SRC)
for row in body.split(' '):
    if row:
        print('  ' + row)
