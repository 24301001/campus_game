# -*- coding: utf-8 -*-
"""像素校园 —— 水平净空探针

用法: python _build/_clear.py <x> <y> [半径=200] [带宽=180]

把**构建产物**原样加载，对 (x,y) 附近每个道具报告：
  · 画布在世界坐标里的框（left..right, top..bot）
  · **在落地线那一条带内**（世界 y ∈ [y, y+带宽]）的**不透明像素**实际占的 x 区间
    —— 画布框往往比可见内容宽一大截（南门拱 195 宽的画布里有一圈透明留白），
       判断"能不能再往西挪"必须看这个，不能看画布框。
不做任何修改，只报告。结果走 <title>，用 --dump-dom 取回。
"""
import io, os, re, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(HERE)
SRC  = os.path.join(PROJ, '像素校园_全校地图.html')
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
OUT  = os.path.join(HERE, '_clear_gen.html')

PROBE = """
<script>
(function(){
  var diag = (window.__diag || []).join(' || ') || 'clean';
  var fx = Number('__FX__'), fy = Number('__FY__'),
      R  = Number('__R__'),  BH = Number('__BH__');
  var out = [];
  for (var i = 0; i < props.length; i++) {
    var w = props[i];
    var L = w.x - w.ax, T = w.y - w.ay, W = w.img.width, H = w.img.height;
    if (fx < L - R || fx > L + W + R) continue;
    if (fy < T - R || fy > T + H + R) continue;
    /* 带内逐行扫不透明像素，取 x 的最小/最大（世界坐标） */
    var y0 = Math.max(0, Math.floor(fy - T)), y1 = Math.min(H, Math.ceil(fy + BH - T));
    var lo = 1e9, hi = -1e9, rows = 0;
    if (y1 > y0) {
      var g = w.img.getContext('2d');
      var d = g.getImageData(0, y0, W, y1 - y0).data, sh = y1 - y0;
      for (var r = 0; r < sh; r++) {
        var any = 0;
        for (var x = 0; x < W; x++) {
          if (d[(r * W + x) * 4 + 3] > 40) { any = 1; if (x < lo) lo = x; if (x > hi) hi = x; }
        }
        if (any) rows++;
      }
    }
    out.push((w.tag || '(无tag)')
      + ' 画布[' + Math.round(L) + '..' + Math.round(L + W) + ']x['
      + Math.round(T) + '..' + Math.round(T + H) + '] ' + W + 'x' + H
      + ' | 带内[' + (hi < 0 ? '空' : Math.round(L + lo) + '..' + Math.round(L + hi + 1))
      + '] 有效行' + rows + ' | base' + Math.round(w.baseY));
  }
  /* 汇总：这条带里"被占住"的 x 区间并集（只看 baseY>=fy 的、真站在带上的） */
  document.title = 'CLEAR|' + out.join(' | ') + '|' + diag;
})();
</script>
"""

def main():
    fx = sys.argv[1] if len(sys.argv) > 1 else '2200'
    fy = sys.argv[2] if len(sys.argv) > 2 else '2400'
    r  = sys.argv[3] if len(sys.argv) > 3 else '200'
    bh = sys.argv[4] if len(sys.argv) > 4 else '180'
    html = io.open(SRC, encoding='utf-8').read()
    html = html.replace('</body>', PROBE.replace('__FX__', fx).replace('__FY__', fy)
                                .replace('__R__', r).replace('__BH__', bh) + '</body>')
    io.open(OUT, 'w', encoding='utf-8', newline='\n').write(html)
    p = subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--no-sandbox',
                        '--dump-dom', 'file:///' + OUT.replace('\\', '/')],
                       capture_output=True, check=False)
    m = re.search(r'<title>(.*?)</title>', p.stdout.decode('utf-8', 'replace'), re.S)
    if not m:
        print('NO TITLE')
        return
    for ln in m.group(1).strip().split(' | '):
        print(ln)

main()
