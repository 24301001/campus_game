# -*- coding: utf-8 -*-
"""按**精灵宽度**取建筑原精灵放大出图 + 列出全部宽建筑。

为什么不用 _propview.py：建筑是 addProp 造的，tag 只有老体育馆给了 "gym"，
其余全是 undefined ⇒ 按 tag 取不到。建筑在 props 里唯一还认得出的特征是尺寸。

用法:
  python _bldview.py list              只列出（宽度 >= 300 的建筑，按 props 顺序）
  python _bldview.py <width> [scale] [out]
"""
import io, os, re, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(HERE)
SRC = os.path.join(PROJ, u'像素校园_全校地图.html')
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
_LOOK = os.path.join(HERE, '_look') + os.sep
os.makedirs(_LOOK, exist_ok=True)

LIST = """
<script>
window.addEventListener('load', function(){ setTimeout(function(){
  var t = [];
  for (var i=0;i<props.length;i++)
    if (props[i].img.width >= 300) t.push(i + ':' + props[i].img.width + 'x' + props[i].img.height);
  document.title = 'DIAG|' + t.join(' ');
}, 2500); });
</script>
"""

PICK = """
<script>
window.addEventListener('load', function(){ setTimeout(function(){
  try{
    var p = null;
    for (var i=0;i<props.length;i++)
      if (props[i].img.width === %(W)d && (!%(H)d || props[i].img.height === %(H)d)) p = props[i];
    if (!p) {
      document.title = props.length ? 'DIAG|没有宽度 %(W)d 的道具（先跑 _bldview.py list）'
        : 'DIAG|props 整个是空的 —— 页在**加载期**就死了，先跑 _err.py';
      return;
    }
    var S = %(S)d, im = p.img;
    var c2 = document.createElement('canvas');
    c2.width = im.width*S; c2.height = im.height*S;
    var g2 = c2.getContext('2d');
    g2.imageSmoothingEnabled = false;
    /* 棋盘底：空像素（透明）必须一眼可见 —— 早退擦空那类事故只有这里看得见 */
    for (var y=0;y<c2.height;y+=8) for (var x=0;x<c2.width;x+=8)
      { g2.fillStyle = (((x/8+y/8)|0)%%2) ? '#2a2a30' : '#3a3a42'; g2.fillRect(x,y,8,8); }
    g2.drawImage(im, 0, 0, c2.width, c2.height);
    document.body.innerHTML = '';
    document.body.style.margin = '0'; document.body.style.background = '#000';
    document.body.appendChild(c2);
    document.title = 'DIAG|' + im.width + 'x' + im.height + ' -> ' + c2.width + 'x' + c2.height;
  }catch(e){ document.title='DIAG|EX '+e.message; }
}, 2500); });
</script>
"""


def run(html, tmp, win):
    io.open(tmp, 'w', encoding='utf-8', newline='\n').write(html)
    dom = subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--no-sandbox',
                          '--hide-scrollbars', '--virtual-time-budget=20000',
                          '--window-size=%d,%d' % win, '--dump-dom', 'file:///' + tmp],
                         capture_output=True, check=False).stdout.decode('utf-8', 'replace')
    t = re.search(r'<title>(.*?)</title>', dom, re.S)
    if not t:
        return 'NO TITLE'
    return t.group(1).replace('&gt;', '>').replace('&lt;', '<').replace('&amp;', '&').strip()


def main():
    a = sys.argv[1:]
    base = io.open(SRC, encoding='utf-8').read()
    tmp = os.path.join(HERE, '_bldview_gen.html')

    if not a or a[0] == 'list':
        print(run(base.replace('</body>', LIST + '</body>', 1), tmp, (1400, 400)))
        return

    ws = a[0].split(',')
    w = int(ws[0])
    h = int(ws[1]) if len(ws) > 1 else 0
    S = int(a[1]) if len(a) > 1 else 3
    out = a[2] if len(a) > 2 else (_LOOK + 'bld%d_%d_x%d.png' % (w, h, S))
    diag = run(base.replace('</body>', PICK % {'W': w, 'H': h, 'S': S} + '</body>', 1), tmp, (1400, 1400))
    m = re.match(r'^DIAG\|(\d+)x(\d+) -> (\d+)x(\d+)$', diag)
    if not m:
        print('DIAG ->', diag)
        return
    ww, hh = int(m.group(3)), int(m.group(4))
    out = os.path.abspath(out)
    run(io.open(tmp, encoding='utf-8').read(), tmp, (ww + 1, hh + 1))
    subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--no-sandbox',
                    '--hide-scrollbars', '--virtual-time-budget=20000',
                    '--window-size=%d,%d' % (ww + 1, hh + 1),
                    '--screenshot=' + out, 'file:///' + tmp],
                   stderr=subprocess.DEVNULL, check=False)
    print(out, os.path.getsize(out) if os.path.exists(out) else 'MISSING', '|', diag)


main()
