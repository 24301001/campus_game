# -*- coding: utf-8 -*-
"""像素校园 —— 道具重叠探针（查"垃圾桶压在树冠上"这类错位）

用法: python _build/props_probe.py

把**构建产物**（像素校园_全校地图.html）原样加载，主脚本跑完之后同步执行一段
探针，把所有"小道具（桶/椅/灯/花坛）的美术盒压在某棵树冠上"的实例逐条列出来：
每个实例打 桶的 (x,y)、桶的画布尺寸、树的 (x,y)、树的画布尺寸、dx/dy。

不做任何修复，只报告 —— 修之前先看清到底是哪些实例、符合哪条判据。
结果写 <title> 用 --dump-dom 取回（同 verify.py 的做法）。
"""
import io, os, re, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(HERE)
SRC  = os.path.join(PROJ, '像素校园_全校地图.html')
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
OUT  = os.path.join(HERE, '_probe_gen.html')

PROBE = """
<script>
(function(){
  /* ⚠️ 产物里没有 __diag（那是 verify.py 注入的）—— 直接 .join 会抛异常，
     整个 IIFE 中止、title 停在静态值，看起来像"探针根本没跑"。 */
  var diag = (window.__diag || []).join(' || ') || 'clean';
  var out = [];
  /* ⚠️ 判类走 tag，不靠尺寸 —— 路灯 32×84 也是"窄而高"，按尺寸判会把 203 根路灯
     当成树，报出一堆假重叠（第一版就是这么错的）。树由 anyTree / §6.6 中央大树打 tag。
     小道具 = 没 tag 且比楼小：桶 24×34 / 椅 48×42 / 花坛 76×46 / 灯 32×84。 */
  /* 物种按**画布尺寸**区分（四个物种尺寸互不相同，见 47_plants.js 各 yield 注释）：
     阔叶 70x88 / 针叶 54x104 / 垂柳 86x88 / 开花 66x78。柳只种在水边 —— 这个计数
     同时回答"湖岸到底有没有柳"。 */
  var SPEC = {'70x88': '阔叶', '54x104': '针叶', '86x88': '垂柳', '66x78': '开花'};
  var bySpec = {}, trees = [], smalls = [];
  for (var i = 0; i < props.length; i++) {
    var q = props[i];
    if (q.tag === 'tree') {
      trees.push(q);
      var k2 = q.img.width + 'x' + q.img.height;
      bySpec[k2] = (bySpec[k2] || 0) + 1;
    }
    else if (!q.tag && q.img.width <= 90 && q.img.height < 90) smalls.push(q);
  }
  /* 真缺陷的判据**不是**"包围盒相交" —— 那 22 对里大半是长椅站在树影里、鸭子游在
     柳荫下，都是对的。真缺陷 = **树的不透明像素盖住了道具的脚**，且**树排在道具前面**
     （baseY 更大 = 更靠南）。这时道具的接地线整个被树画掉，
     看起来就像"垃圾桶挂在树冠尖上"。 */
  function footOnTree(p, q) {
    var g = q.img.getContext('2d');
    /* 道具的接地线换算到树的画布坐标（接地线 = 锚点行上下各 1px） */
    var x0 = Math.round(p.x - (q.x - q.ax) - p.img.width / 2);
    var y0 = Math.round(p.y - (q.y - q.ay)) - 1;
    if (x0 + p.img.width < 0 || y0 + 3 < 0 ||
        x0 >= q.img.width || y0 >= q.img.height) return false;
    var sx = Math.max(0, x0), sy = Math.max(0, y0);
    var sw = Math.min(q.img.width, x0 + p.img.width) - sx, sh = Math.min(q.img.height, y0 + 3) - sy;
    if (sw <= 0 || sh <= 0) return false;
    var d = g.getImageData(sx, sy, sw, sh).data, n = 0;
    for (var k = 3; k < d.length; k += 4) if (d[k] > 40) n++;
    return n >= 2;                       /* 1px 擦边不算，要真盖住 */
  }
  var hits = 0;
  for (var s = 0; s < smalls.length; s++) {
    var p = smalls[s];
    for (var t = 0; t < trees.length; t++) {
      var q = trees[t];
      if (q.baseY <= p.baseY) continue;                  /* 树在道具后面 → 遮挡正常 */
      if (p.y > q.y - 40) continue;                      /* 挨着站 = 正常遮挡（同产物判据） */
      if (!footOnTree(p, q)) continue;
      hits++;
      out.push('#' + hits
        + ' p(' + (p.x|0) + ',' + (p.y|0) + ')' + p.img.width + 'x' + p.img.height
        + ' t(' + (q.x|0) + ',' + (q.y|0) + ')' + q.img.width + 'x' + q.img.height
        + ' d(' + ((p.x - q.x)|0) + ',' + ((p.y - q.y)|0) + ')');
    }
  }
  /* 定点体检：把指定矩形内的道具连锚点/画布尺寸一起打出来，并逐行报某棵树在
     给定列上的不透明像素数 —— 用来定"到底是谁盖住了谁的哪一行"。 */
  var fx = Number('__FX__'), fy = Number('__FY__'), R = 260;
  for (var i2 = 0; i2 < props.length; i2++) {
    var w = props[i2];
    if (Math.abs(w.x - fx) > R || Math.abs(w.y - fy) > R) continue;
    out.push('LOCAL(' + (w.x|0) + ',' + (w.y|0) + ') ax' + w.ax + ' ay' + w.ay
      + ' ' + w.img.width + 'x' + w.img.height + ' base' + (w.baseY|0)
      + ' top' + ((w.y - w.ay)|0) + ' bot' + ((w.y - w.ay + w.img.height)|0)
      + (w.tag ? '/' + w.tag : ''));
  }
  for (var t2 = 0; t2 < trees.length; t2++) {
    var q2 = trees[t2];
    if (Math.abs(q2.x - fx) > R || Math.abs(q2.y - fy) > R) continue;
    var g2 = q2.img.getContext('2d');
    var prof = [];
    for (var yy = 0; yy < 40; yy += 2) {
      var d2 = g2.getImageData(0, yy, q2.img.width, 2).data, c = 0, lo = 99, hi = -1;
      for (var xx = 0; xx < q2.img.width; xx++)
        for (var kk = 0; kk < 2; kk++)
          if (d2[((kk*q2.img.width)+xx)*4+3] > 40) { c++; if (xx<lo) lo=xx; if (xx>hi) hi=xx; }
      prof.push((q2.y - q2.ay + yy) + ':' + c + (c ? '[' + lo + '-' + hi + ']' : ''));
    }
    out.push('PROF t(' + (q2.x|0) + ',' + (q2.y|0) + ') ' + q2.img.width + 'x' + q2.img.height
      + ' @' + prof.join(' '));
  }
  /* 柳=0 说明 waterNear 从没命中 —— 量一下"每棵树离最近的 K.WATER 格有多远" */
  var dmin = 99, near = [0,0,0,0,0,0];
  for (var t3 = 0; t3 < trees.length; t3++) {
    var tx = (trees[t3].x / CELL) | 0, ty = (trees[t3].y / CELL) | 0, best = 99;
    for (var jj = -5; jj <= 5; jj++) for (var ii = -5; ii <= 5; ii++) {
      var aa = tx + ii, bb = ty + jj;
      if (aa < 0 || bb < 0 || aa >= NW || bb >= NH) continue;
      if (CELLK[bb * NW + aa] !== K.WATER) continue;
      var dd = Math.max(Math.abs(ii), Math.abs(jj));
      if (dd < best) best = dd;
    }
    if (best < dmin) dmin = best;
    if (best <= 5) near[best]++;
    if (best <= 3) out.push('WATERNEAR t(' + (trees[t3].x|0) + ',' + (trees[t3].y|0) + ') '
      + trees[t3].img.width + 'x' + trees[t3].img.height + ' ring' + best);
  }
  window.__water = '水近距 min' + dmin + ' 各环' + near.join(',');
  var sp = [];
  for (var k3 in SPEC) sp.push(SPEC[k3] + ' ' + (bySpec[k3] || 0));
  document.title = 'PROBE|' + window.__water + '|树 ' + trees.length + '（' + sp.join(' / ') + '）'
    + ' · 小道具 ' + smalls.length + ' · 重叠 ' + hits + '|'
    + (out.join(' | ') || 'none') + '|' + diag;
})();
</script>
"""


def main():
    fx = sys.argv[1] if len(sys.argv) > 1 else '1569'
    fy = sys.argv[2] if len(sys.argv) > 2 else '2366'
    html = io.open(SRC, encoding='utf-8').read()
    html = html.replace('</body>', PROBE.replace('__FX__', fx).replace('__FY__', fy) + '</body>')
    io.open(OUT, 'w', encoding='utf-8', newline='\n').write(html)
    p = subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--no-sandbox',
                        '--dump-dom', 'file:///' + OUT.replace('\\', '/')],
                       capture_output=True, check=False)
    m = re.search(r'<title>(.*?)</title>', p.stdout.decode('utf-8', 'replace'), re.S)
    if not m:
        print('NO TITLE（整页 JS 没跑？）')
        return
    for ln in m.group(1).strip().split('|'):
        print(ln)


main()
