# -*- coding: utf-8 -*-
"""16 号宿舍楼与东侧围墙的**精确像素间距**探针（不靠眼睛量）。

为什么要它：`_scene.py` 出的图只能目测，边界间距差 5px 肉眼分不出；
而"楼有没有顶到围墙"是这一轮的核心风险（用户事前就警告过"向右延长可能会突破边界"）。

用法：python _d16probe.py
"""
import io, os, re, subprocess

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(HERE)
SRC = os.path.join(PROJ, u'像素校园_全校地图.html')
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

PROBE = """
<script>
window.addEventListener('load', function(){ setTimeout(function(){
  try{
    function rectOf(name){
      for (var i=0;i<CAMPUS.length;i++) if (CAMPUS[i][0]===name) {
        var r = rc({x:CAMPUS[i][2], y:CAMPUS[i][3], w:CAMPUS[i][4], h:CAMPUS[i][5]});
        return {x:r.x, y:r.y, w:r.w, h:r.h};
      }
      return null;
    }
    var out = [];
    var names = ['16宿舍楼','运输实验馆','学生1食堂','18宿舍楼'];
    for (var i=0;i<names.length;i++){
      var r = rectOf(names[i]);
      out.push(names[i] + ' x[' + r.x.toFixed(1) + ',' + (r.x+r.w).toFixed(1) + '] y['
               + r.y.toFixed(1) + ',' + (r.y+r.h).toFixed(1) + ']');
    }
    /* 落在 16 号楼那条 y 带里的**所有** solid（含围墙），按 x 排序 */
    var r16 = rectOf('16宿舍楼');
    var band = [];
    for (var k=0;k<solids.length;k++){
      var b = solids[k];
      if (b.y < r16.y + r16.h && b.y + b.h > r16.y && b.x > r16.x - 40 && b.x < r16.x + r16.w + 200)
        band.push(b.x.toFixed(1) + '..' + (b.x+b.w).toFixed(1) + '@y' + b.y.toFixed(0));
    }
    out.push('BAND ' + band.join(' | '));
    /* 围墙折线在 16 号楼 y 带内的 x 实测 */
    var bx = [];
    for (var j=0;j<BOUND.length;j++){
      var a = BOUND[j], b2 = BOUND[(j+1)%BOUND.length];
      var yA = a[1], yB = b2[1];
      if ((yA - r16.y) * (yB - r16.y) < 0 || (yA - (r16.y+r16.h)) * (yB - (r16.y+r16.h)) < 0) {
        var t = (r16.y - yA) / (yB - yA);
        bx.push('y=' + r16.y.toFixed(0) + '->x' + (a[0] + t*(b2[0]-a[0])).toFixed(1));
        var t2 = (r16.y + r16.h - yA) / (yB - yA);
        bx.push('y=' + (r16.y+r16.h).toFixed(0) + '->x' + (a[0] + t2*(b2[0]-a[0])).toFixed(1));
      }
    }
    out.push('WALL ' + (bx.length ? bx.join(' ') : '(这一带没有围墙折线穿过)'));
    /* 精灵不透明像素的 x 包围盒：30 段的檐口外沿在 x0−3 = 23（这是**允许**的最左），
       重铺墙是从 x0 = 26 起的 ⇒ 只要 bbox 左界 < 23，就是有东西挂在墙外
       （首版就是这么冒出 [21,26) 那条 5px 旧窗渣的，四套验收全绿、只有出图看得见）。 */
    var p16 = null;
    for (var i2 = 0; i2 < props.length; i2++) if (props[i2].img.width === 450) p16 = props[i2];
    if (p16) {
      var ic = document.createElement('canvas');
      ic.width = p16.img.width; ic.height = p16.img.height;
      var ig = ic.getContext('2d');
      ig.drawImage(p16.img, 0, 0);
      var dat = ig.getImageData(0, 0, ic.width, ic.height).data;
      var minx = 1e9, maxx = -1, miny = 1e9, maxy = -1;
      for (var yy = 0; yy < ic.height; yy++) for (var xx = 0; xx < ic.width; xx++) {
        if (dat[(yy * ic.width + xx) * 4 + 3] > 0) {
          if (xx < minx) minx = xx; if (xx > maxx) maxx = xx;
          if (yy < miny) miny = yy; if (yy > maxy) maxy = yy;
        }
      }
      out.push('SPRITE 不透明包围盒 x[' + minx + ',' + maxx + '] y[' + miny + ',' + maxy + ']'
               + ' 期望左界=23(檐口外沿) ' + (minx < 23 ? '❌ 有东西伸出墙外 ' + (23 - minx) + 'px' : 'OK'));
    }
    document.title = 'DIAG|' + out.join(' ;; ');
  }catch(e){ document.title = 'DIAG|EX ' + e.message; }
}, 2500); });
</script>
"""


def main():
    base = io.open(SRC, encoding='utf-8').read()
    tmp = os.path.join(HERE, '_d16probe_gen.html')
    io.open(tmp, 'w', encoding='utf-8', newline='\n').write(base.replace('</body>', PROBE + '</body>', 1))
    dom = subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--no-sandbox',
                          '--hide-scrollbars', '--virtual-time-budget=20000',
                          '--window-size=1400,400', '--dump-dom', 'file:///' + tmp],
                         capture_output=True, check=False).stdout.decode('utf-8', 'replace')
    t = re.search(r'<title>(.*?)</title>', dom, re.S)
    if not t:
        print('NO TITLE')
        return
    print(t.group(1).replace('&gt;', '>').replace('&lt;', '<').replace('&amp;', '&').replace(' ;; ', '\n'))


main()
