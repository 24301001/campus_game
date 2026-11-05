# -*- coding: utf-8 -*-
"""像素校园 —— 树清单探针

用法: python _build/_trees.py <x0> <y0> <x1> <y1>

把**构建产物**原样加载，列出所有 tag 为 tree / lawnTree 的道具中**接地点**落在
给定矩形里的那些，按"离矩形中轴线的距离"排序输出：坐标、精灵尺寸、物种、离中轴多远。
用来定"沿某条路两侧到底有哪些树、要清多宽的一条带"。
不做任何修改。结果走 <title>，用 --dump-dom 取回。
"""
import io, os, re, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(HERE)
SRC  = os.path.join(PROJ, '像素校园_全校地图.html')
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
OUT  = os.path.join(HERE, '_trees_gen.html')

PROBE = """
<script>
(function(){
  var diag = (window.__diag || []).join(' || ') || 'clean';
  var x0=Number('__X0__'), y0=Number('__Y0__'), x1=Number('__X1__'), y1=Number('__Y1__');
  var AX = Number('__AX__');                       // 路的中心 x（用来算"离路多远"）
  var SPEC = {'70x88':'阔叶','54x104':'针叶','86x88':'垂柳','66x78':'开花',
              '46x132':'白杨'};   // 南门纵向大道两侧（47_plants.js §4.7.3b）
  var rows = [];
  for (var i = 0; i < props.length; i++) {
    var p = props[i];
    if (p.tag !== 'tree' && p.tag !== 'lawnTree') continue;
    if (p.x < x0 || p.x > x1 || p.y < y0 || p.y > y1) continue;
    var k = p.img.width + 'x' + p.img.height;
    rows.push({ x: p.x|0, y: p.y|0, w: p.img.width, h: p.img.height,
                sp: SPEC[k] || ('?' + k), d: Math.abs(p.x - AX), tag: p.tag });
  }
  rows.sort(function(a,b){ return a.d - b.d || a.y - b.y; });
  var out = [];
  for (var j = 0; j < rows.length; j++) {
    var r = rows[j];
    out.push(r.sp + '(' + r.x + ',' + r.y + ')' + r.w + 'x' + r.h
             + ' d' + (r.d|0) + (r.tag === 'lawnTree' ? '*' : ''));
  }
  document.title = 'TREES|L' + (x1-x0) + ' n=' + rows.length + '|'
    + out.join(' ') + '|' + diag;
})();
</script>
"""

def main():
    a = sys.argv[1:] + ['1900', '1875', '2165', '2500'][len(sys.argv) - 1:]
    x0, y0, x1, y1 = a[0], a[1], a[2], a[3]
    ax = (float(x0) + float(x1)) / 2
    html = io.open(SRC, encoding='utf-8').read()
    html = html.replace('</body>', PROBE.replace('__X0__', x0).replace('__Y0__', y0)
                                .replace('__X1__', x1).replace('__Y1__', y1)
                                .replace('__AX__', str(ax)) + '</body>')
    io.open(OUT, 'w', encoding='utf-8', newline='\n').write(html)
    p = subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--no-sandbox',
                        '--dump-dom', 'file:///' + OUT.replace('\\', '/')],
                       capture_output=True, check=False)
    m = re.search(r'<title>(.*?)</title>', p.stdout.decode('utf-8', 'replace'), re.S)
    if not m:
        print('NO TITLE'); return
    for ln in m.group(1).strip().split('|'):
        print(ln)

main()
