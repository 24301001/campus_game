# -*- coding: utf-8 -*-
"""像素校园 —— 草坪边界树圈探针（查"树圈豁了口 / 中间还长着东西 / 根跑出草坪"）

用法: python _build/_lawn.py

把**构建产物**（像素校园_全校地图.html）原样加载，主脚本跑完之后同步执行一段探针：
  ① 自检行（console.log 的计数）；
  ② 草坪矩形 + 树圈**逐个坑位**的实到 / 应有（按 plantLawnRing 的等分取点复算坑位，
     不是按"离边线多近"分带 —— 分带数出来的分母是错的）；
  ③ 每个空坑**为什么空**（bound / solid / cell / used / prop 五类卡点）；
  ④ `prop` 卡点撞上的那个道具点名（tag + 位置 + 画布尺寸）；
  ⑤ **根扎在哪**：边界树的接地点必须落在草坪矩形内且格子分类是 K.GRASS
     （用户原话「树的根部要求在草坪上，不能跑其他地方去」）；
  ⑥ 草坪整治区 LAWN_ZONE 内残留的非白名单道具（**必须 0**，否则"中间只有草地"没做到）。

结果写 <title> 用 --dump-dom 取回（同 verify.py 的做法）。
"""
import io, os, re, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(HERE)
SRC = os.path.join(PROJ, u'像素校园_全校地图.html')
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
OUT = os.path.join(HERE, '_lawn_gen.html')

HEAD = """<script>
window.__log = [];
(function(){ var o = console.log;
  console.log = function(){ window.__log.push(Array.prototype.join.call(arguments, ' ')); o.apply(console, arguments); };
})();
</script>
"""

PROBE = """
<script>
function sampleFail(x, y) {
  if (!insideBoundary(x, y) || distToBound(x, y) < 30) return 'bound';
  if (ptBlocked(x, y, 16, 11)) return 'solid';
  if (cellAtSafe(x, y) !== K.GRASS) return 'cell';
  for (var i = 0; i < _lawnUsed.length; i++)
    if (Math.abs(_lawnUsed[i][0] - x) < 46 && Math.abs(_lawnUsed[i][1] - y) < 46) return 'used';
  if (!treeFreeOfProps(x, y, 'lawnTree', LAWN_ZONE)) return 'prop';
  return 'ok';
}
(function () {
  var out = [];
  out.push('LOG| ' + (window.__log || []).join(' || '));
  var L = LAWN, i = LAWN_INSET, s = LAWN_SP;
  out.push('LAWN x' + L.x.toFixed(1) + '..' + (L.x + L.w).toFixed(1)
         + ' y' + L.y.toFixed(1) + '..' + (L.y + L.h).toFixed(1)
         + '  inset=' + i + ' sp=' + s + ' band=' + LAWN_BAND);
  var ring = [];
  for (var k = 0; k < props.length; k++)
    if (props[k].tag === 'lawnTree') ring.push(props[k]);

  /* ---- 逐个坑位复算（与 plantLawnRing 同一套等分算法）---- */
  var x0 = L.x + i, x1 = L.x + L.w - i, y0 = L.y + i, y1 = L.y + L.h - i;
  var nx = Math.max(1, Math.round((x1 - x0) / s));
  var ny = Math.max(1, Math.round((y1 - y0) / s));
  var slots = [];
  for (var a = 0; a <= nx; a++) {
    var xx = x0 + (x1 - x0) * a / nx;
    slots.push(['N', xx, y0]); slots.push(['S', xx, y1]);
  }
  for (var b = 1; b < ny; b++) {
    var yy = y0 + (y1 - y0) * b / ny;
    slots.push(['W', x0, yy]); slots.push(['E', x1, yy]);
  }
  var fill = {}, holes = [], miss = {bound:0, solid:0, cell:0, used:0, prop:0, ok:0};
  for (var n = 0; n < slots.length; n++) {
    var sd = slots[n][0], sx = slots[n][1], sy = slots[n][2], hit = null;
    for (var m = 0; m < ring.length; m++) {
      if (Math.abs(ring[m].x - sx) < 20 && Math.abs(ring[m].y - sy) < 20) { hit = ring[m]; break; }
    }
    fill[sd] = fill[sd] || [0, 0];
    fill[sd][1]++;
    if (hit) { fill[sd][0]++; continue; }
    var why = sampleFail(sx, sy);
    miss[why]++;
    holes.push(sd + '@' + (sx | 0) + ',' + (sy | 0) + ':' + why);
  }
  var line = 'RING n=' + ring.length;
  for (var q in fill) line += ' ' + q + '=' + fill[q][0] + '/' + fill[q][1];
  out.push(line + '  坑位共 ' + slots.length + ' 空 ' + holes.length);
  out.push('MISS ' + JSON.stringify(miss));
  out.push('HOLES ' + (holes.length ? holes.join(' ') : '(无)'));

  /* ---- 空坑是撞上了谁 ---- */
  var det = [];
  for (var h = 0; h < holes.length; h++) {
    if (holes[h].indexOf(':prop') < 0 && holes[h].indexOf(':used') < 0) continue;
    var mm = holes[h].match(/([NSEW])@(\\d+),(\\d+)/), hx = +mm[2], hy = +mm[3];
    for (var t = 0; t < props.length; t++) {
      var c = props[t];
      if (c.tag === 'lawnTree' || c.img.width > 90 || c.y > hy + 4) continue;
      var cx0 = c.x - c.ax, cy0 = c.y - c.ay;
      if (cx0 < hx + 34 && cx0 + c.img.width > hx - 34 &&
          cy0 < hy - 10 && cy0 + c.img.height > hy - 96)
        det.push(holes[h] + '<-' + (c.tag || '?') + '@' + (c.x | 0) + ',' + (c.y | 0)
               + ' ' + c.img.width + 'x' + c.img.height);
    }
  }
  out.push('DET ' + det.join(' | '));

  /* ---- 根扎在哪：每棵边界树的接地点必须落在草坪内 + 格子是草 ---- */
  var offRoot = [], offCell = [];
  for (var r = 0; r < ring.length; r++) {
    var v = ring[r];
    if (!(v.x > L.x && v.x < L.x + L.w && v.y > L.y && v.y < L.y + L.h))
      offRoot.push('@' + (v.x | 0) + ',' + (v.y | 0));
    if (cellAtSafe(v.x, v.y) !== K.GRASS) offCell.push('@' + (v.x | 0) + ',' + (v.y | 0));
  }
  out.push('ROOT 出草坪=' + offRoot.length + (offRoot.length ? ' :: ' + offRoot.join(' ') : '')
         + ' | 非草格=' + offCell.length + (offCell.length ? ' :: ' + offCell.join(' ') : ''));

  /* ---- 整治区残留 ---- */
  var Z = LAWN_ZONE, zx1 = Z.x + Z.w, zy1 = Z.y + Z.h, left = [];
  for (var p2 = 0; p2 < props.length; p2++) {
    var g = props[p2];
    if (g.tag === 'lawnTree' || g.tag === 'flag' || g.tag === 'diaosu'
        || g.tag === 'diaRing' || g.img.width > 90 || g.tag === 'duck') continue;
    if (g.x > Z.x && g.x < zx1 && g.y > Z.y && g.y < zy1)
      left.push((g.tag || '?') + '@' + (g.x | 0) + ',' + (g.y | 0)
              + '(' + g.img.width + 'x' + g.img.height + ')');
  }
  out.push('ZONE leftovers=' + left.length + (left.length ? ' :: ' + left.join(' ') : ''));
  document.title = 'PROBE| ' + out.join(' ');
})();
</script>
"""


def main():
    html = io.open(SRC, encoding='utf-8').read()
    html = html.replace('</head>', HEAD + '</head>', 1)
    assert '</body>' in html
    html = html.replace('</body>', PROBE + '</body>', 1)
    io.open(OUT, 'w', encoding='utf-8', newline='\n').write(html)
    r = subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--no-sandbox',
                        '--virtual-time-budget=8000', '--dump-dom',
                        'file:///' + OUT.replace('\\', '/')],
                       capture_output=True, text=True, encoding='utf-8', errors='replace')
    m = re.search(r'<title>(.*?)</title>', r.stdout, re.S)
    sys.stdout.write((m.group(1) if m else 'NO_TITLE') + '\n')


main()
