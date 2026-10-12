# -*- coding: utf-8 -*-
"""第七教学楼（第二十九轮）：**任意一版产物**里那一件精灵取图 + 屋面逐行对账。

为什么不用 `_bldview.py`：它的源产物写死成 `源码\\像素校园_全校地图.html`，
而本轮必须把"改前"（项目根那份上一轮交付件）和"改后"**并排比**，
才知道屋面那几块灰斑是本段画错的、还是本来就在那儿。

用法:
  python _qjview.py shot <产物.html> <出图.png> [放大倍数] [精灵W 精灵H]
  python _qjview.py rows <产物.html> <y0> <y1> [精灵W 精灵H]   # 逐行的颜色段（找异色方块）

⚠️ 第三十轮（第五教学楼）复用了本工具：那栋的精灵是 **266 × 372**，不是 310 × 293。
   为了不动第二十九轮的记录，默认值仍是 310/293，新楼由**命令行末两个参数**传进来。
"""
import io, os, re, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(HERE)
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
_TMP = os.path.join(HERE, '_qjview_gen.html')

# 第七教学楼在 props 里唯一还认得出的特征：精灵 310 × 293（258 + 2×26 宽）
W, H = 310, 293

SHOT = """
<script>
window.addEventListener('load', function(){ setTimeout(function(){
  try{
    var p = null;
    for (var i=0;i<props.length;i++)
      if (props[i].img.width === %(W)d && props[i].img.height === %(H)d) p = props[i];
    if (!p) { document.title = 'DIAG|没有 %(W)d×%(H)d 的道具（props=%%d 件）'.replace('%%d', props.length); return; }
    var S = %(S)d, im = p.img;
    var c2 = document.createElement('canvas');
    c2.width = im.width*S; c2.height = im.height*S;
    var g2 = c2.getContext('2d');
    g2.imageSmoothingEnabled = false;
    for (var y=0;y<c2.height;y+=8) for (var x=0;x<c2.width;x+=8)
      { g2.fillStyle = (((x/8+y/8)|0)%%2) ? '#2a2a30' : '#3a3a42'; g2.fillRect(x,y,8,8); }
    g2.drawImage(im, 0, 0, c2.width, c2.height);
    document.body.innerHTML = '';
    document.body.style.margin = '0'; document.body.style.background = '#000';
    document.body.appendChild(c2);
    document.title = 'DIAG|p=' + p.x + ',' + p.y + ' ' + im.width + 'x' + im.height;
  }catch(e){ document.title='DIAG|EX '+e.message; }
}, 2500); });
</script>
"""

# 屋面逐行：把 [0, y1) 里每一行按"连续同色段"打出来（长段才打，短段是斑点）
ROWS = """
<script>
window.addEventListener('load', function(){ setTimeout(function(){
  try{
    var p = null;
    for (var i=0;i<props.length;i++)
      if (props[i].img.width === %(W)d && props[i].img.height === %(H)d) p = props[i];
    if (!p) { document.title = 'DIAG|没有那件道具'; return; }
    var im = p.img, c2 = document.createElement('canvas');
    c2.width = im.width; c2.height = im.height;
    var g2 = c2.getContext('2d');
    g2.drawImage(im, 0, 0);
    var d = g2.getImageData(0, 0, im.width, im.height).data;
    var out = [];
    for (var y = %(Y0)d; y < %(Y1)d; y++) {
      var segs = [], x = 0;
      while (x < im.width) {
        var i0 = (y*im.width + x)*4;
        var c = d[i0]+','+d[i0+1]+','+d[i0+2]+(d[i0+3]<128?',T':'');
        var x1 = x + 1;
        while (x1 < im.width) {
          var j = (y*im.width + x1)*4;
          var c1 = d[j]+','+d[j+1]+','+d[j+2]+(d[j+3]<128?',T':'');
          if (c1 !== c) break;
          x1++;
        }
        if (x1 - x >= 12) segs.push(x + '..' + (x1-1) + '=' + c);
        x = x1;
      }
      out.push(y + '|' + segs.join(' '));
    }
    document.title = 'DIAG|' + out.join(' ;; ');
  }catch(e){ document.title='DIAG|EX '+e.message; }
}, 2500); });
</script>
"""


def run(html, win):
    io.open(_TMP, 'w', encoding='utf-8', newline='\n').write(html)
    dom = subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--no-sandbox',
                          '--hide-scrollbars', '--virtual-time-budget=20000',
                          '--window-size=%d,%d' % win, '--dump-dom', 'file:///' + _TMP],
                         capture_output=True, check=False).stdout.decode('utf-8', 'replace')
    t = re.search(r'<title>(.*?)</title>', dom, re.S)
    if not t:
        return 'NO TITLE'
    return t.group(1).replace('&gt;', '>').replace('&lt;', '<').replace('&amp;', '&').strip()


def main():
    global W, H
    a = sys.argv[1:]
    if len(a) < 3:
        print(__doc__)
        return
    mode, src = a[0], a[1]
    base = io.open(src, encoding='utf-8').read()
    if mode == 'shot':
        out = a[2]
        S = int(a[3]) if len(a) > 3 else 1
        if len(a) > 5:
            W, H = int(a[4]), int(a[5])
        body = SHOT % {'W': W, 'H': H, 'S': S}
        r = run(base.replace('</body>', body + '</body>', 1), (W * S + 40, H * S + 40))
        print(r)
        m = re.search(r'DIAG\|p=([\d.]+),([\d.]+)', r)
        if not m:
            return
        # 把画布抠出来：chrome 的 --dump-dom 拿不到像素，改走"截图 + 裁"
        subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--no-sandbox',
                        '--hide-scrollbars', '--window-size=%d,%d' % (W * S, H * S),
                        '--screenshot=' + os.path.abspath(out),
                        '--virtual-time-budget=20000', 'file:///' + _TMP], check=False,
                       capture_output=True)
        print('已出图: %s' % out)
    elif mode == 'rows':
        y0, y1 = int(a[2]), int(a[3])
        if len(a) > 5:
            W, H = int(a[4]), int(a[5])
        body = ROWS % {'W': W, 'H': H, 'Y0': y0, 'Y1': y1}
        r = run(base.replace('</body>', body + '</body>', 1), (900, 400))
        for line in r.replace('DIAG|', '').split(' ;; '):
            print(line)


main()
