# -*- coding: utf-8 -*-
"""地面地形探针：把 CELLK / ROADCLS / PLAZA 覆盖在指定世界矩形里打成 ASCII 图。
用来判"这块到底是沥青、砖石、广场还是草地"，不靠肉眼猜像素颜色。

用法: python _gt.py [x0 y0 x1 y1]
结果写 <title>，用 --dump-dom 取回（同 verify.py / props_probe.py）。
"""
import io, os, re, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(HERE)
SRC  = os.path.join(PROJ, u'像素校园_全校地图.html')
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
OUT  = os.path.join(HERE, '_gt_gen.html')

PROBE = """
<script>
(function(){
  var diag = (window.__diag || []).join(' || ') || 'clean';
  var a = [__ARGS__];
  var x0 = a[0], y0 = a[1], x1 = a[2], y1 = a[3];
  var c0 = Math.floor(x0 / CELL), c1 = Math.floor(x1 / CELL);
  var r0 = Math.floor(y0 / CELL), r1 = Math.floor(y1 / CELL);
  /* 字符表：草地类看 K，路面看 ROADCLS（0 贴墙混凝土 / 1 砖石 / 2 主路沥青） */
  var CH = {0:'?',1:'B',2:'g',3:'W',4:'T',5:'b',6:'t',7:'x',8:'#'};
  var out = [];
  out.push('BOX ' + x0 + ',' + y0 + ' .. ' + x1 + ',' + y1
           + '  cell=' + CELL + '  列号 x=' + (c0*CELL) + '..' + (c1*CELL));
  var hdr = '      ';
  for (var cx = c0; cx <= c1; cx++) hdr += (cx % 5 === 0) ? '|' : ' ';
  out.push(hdr + '   (每 5 格一个 |)');
  for (var cy = r0; cy <= r1; cy++) {
    var ln = '';
    for (var cx2 = c0; cx2 <= c1; cx2++) {
      var i = cy * NW + cx2, k = CELLK[i];
      var ch;
      if (k === K.ROAD) ch = '0123456789'.charAt(ROADCLS[i]);
      else if (k === K.PLAZA) ch = 'P';
      else ch = CH[k] || '?';
      ln += ch;
    }
    out.push(('    ' + (cy*CELL)).slice(-6) + ln);
  }
  /* 顺带把每个 PLAZA 的实际覆盖数打出来（PLAZA 会被 ARTERY 覆盖掉，两个矩形同带时会打架） */
  var nPl = [];
  for (var p = 0; p < PLAZA.length; p++) {
    var z = PLAZA[p];
    var g = 0, rr = 0, gr = 0, o = 0;
    var q0 = Math.max(0, Math.floor(z.x/CELL)), q1 = Math.min(NW-1, Math.floor((z.x+z.w)/CELL));
    var s0 = Math.max(0, Math.floor(z.y/CELL)), s1 = Math.min(NH-1, Math.floor((z.y+z.h)/CELL));
    for (var yy = s0; yy <= s1; yy++) for (var xx = q0; xx <= q1; xx++) {
      var kk = CELLK[yy*NW+xx];
      if (kk === K.PLAZA) g++;
      else if (kk === K.ROAD) rr++;
      else if (kk === K.GRASS) gr++;
      else o++;
    }
    nPl.push(z.name + ':PLAZA' + g + ' ROAD' + rr + ' GRASS' + gr + ' other' + o);
  }
  document.title = 'GT|' + out.join(' ~~ ') + '||' + nPl.join(' ; ') + '||' + diag;
})();
</script>
"""


def main():
    box = [int(v) for v in sys.argv[1:5]] if len(sys.argv) > 4 else [1600, 1380, 2520, 2520]
    html = io.open(SRC, encoding='utf-8').read()
    html = html.replace('</body>', PROBE.replace('__ARGS__', ','.join(str(v) for v in box)) + '</body>')
    io.open(OUT, 'w', encoding='utf-8', newline='\n').write(html)
    p = subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--no-sandbox',
                        '--dump-dom', 'file:///' + OUT.replace('\\', '/')],
                       capture_output=True, check=False)
    m = re.search(r'<title>(.*?)</title>', p.stdout.decode('utf-8', 'replace'), re.S)
    if not m:
        print('NO TITLE（整页 JS 没跑？）')
        return
    L = []
    for ln in m.group(1).strip().split('|'):
        L.append(ln)
    io.open(os.path.join(HERE, '_gt_out.txt'), 'w', encoding='utf-8').write(
        '\n'.join(s for chunk in L for s in chunk.split(' ~~ ')))
    print('wrote _gt_out.txt  (%d lines)' % len(L))


main()
