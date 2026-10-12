# -*- coding: utf-8 -*-
"""把某个带 tag 的道具**原精灵**放大 N 倍（就近邻）单独出图 —— 抠细节专用。

用法:
  python _propview.py <tag>[#n] [scale] [out]
    tag    道具的 tag（如 smLion / smStone / flag / diaosu）
           tag 后可带 "#n" 选**第 n 个**同 tag 的道具（从 0 数）；不给 = 最后一个（原行为）
           —— 第七轮三块影壁共用 tag "yingbi"，不给 n 就永远只能看到最后那块月亮门，
              西影壁的窗洞根本出不了图。
    scale  整数倍，默认 8
    out    输出 png，默认 _build/_look/<tag>[n]_x8.png

为什么不用 shot.py：shot.py 只能拍"游戏视口"，道具在里面最多几十像素高，
再截图放大只会拿到插值糊图 —— 判断一个 56×96 的精灵画得对不对，
必须看**原始像素**。这里直接把 props 里那个 img 取出画布，
imageSmoothingEnabled=false 放大，一个世界像素 = N 个硬边方块。

⚠️ 与 shot.py 同样：`--screenshot=` 必须绝对路径；out 也建议绝对路径。
"""
import io, os, re, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(HERE)
SRC = os.path.join(PROJ, '像素校园_全校地图.html')
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
_LOOK = os.path.join(HERE, '_look') + os.sep
os.makedirs(_LOOK, exist_ok=True)

TAIL = """
<script>
window.addEventListener('load', function(){ setTimeout(function(){
  try{
    var ps = [], want = %(IDX)d;
    for (var i=0;i<props.length;i++) if (props[i].tag === '%(TAG)s') ps.push(props[i]);
    var p = want < 0 ? ps[ps.length-1] : ps[want];
    if (!p) {
      /* ⚠️ 别把"页面死了"误读成"这个道具没加进去"：加载期抛 ReferenceError 时
         props 会停在半路（本轮实测停在 67 件），此时**任何** tag 都找不到。
         判据取"props 整个是空的" —— 只要还有别的道具在，就是真的没有这个 tag。 */
      document.title = props.length
        ? 'DIAG|no prop tag %(TAG)s n=' + want
        : 'DIAG|props 整个是空的 —— 页面在**加载期**就死了（不是这个 tag 没加上）。'
          + '先跑 python _build/_err.py 拿 onerror 文本';
      return;
    }
    var S = %(S)d, im = p.img;
    var c2 = document.createElement('canvas');
    c2.width = im.width*S; c2.height = im.height*S;
    var g2 = c2.getContext('2d');
    g2.imageSmoothingEnabled = false;
    /* 棋盘底：编出来的空像素（透明）必须一眼可见，否则"边角被裁平"这类错看不出来 */
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


def main():
    a = sys.argv[1:]
    tag = a[0] if a else 'smLion'
    scale = int(a[1]) if len(a) > 1 else 8
    # tag 可带 "#n" 选第 n 个同 tag 的道具（从 0 数）；不给 = 最后一个（与原行为一致）
    idx = -1
    if '#' in tag:
        tag, _, _n = tag.partition('#')
        idx = int(_n)
    out = a[2] if len(a) > 2 else (
        _LOOK + (tag + '%d' % idx if idx >= 0 else tag) + '_x%d.png' % scale)

    # 先跑一次 dump-dom 拿精灵尺寸，好定窗口 —— 尺寸不定窗口会裁掉一块
    html = io.open(SRC, encoding='utf-8').read()
    html = html.replace('</body>', TAIL % {'TAG': tag, 'S': scale, 'IDX': idx} + '</body>', 1)
    tmp = os.path.join(HERE, '_propview_gen.html')
    io.open(tmp, 'w', encoding='utf-8', newline='\n').write(html)

    dom = subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--no-sandbox',
                          '--hide-scrollbars', '--virtual-time-budget=20000',
                          '--window-size=1400,1400', '--dump-dom', 'file:///' + tmp],
                         capture_output=True, check=False).stdout.decode('utf-8', 'replace')
    t = re.search(r'<title>(.*?)</title>', dom, re.S)
    # ⚠️ dump-dom 的 title 是 HTML 转义过的：`->` 回来变成 `-&gt;`
    diag = t.group(1).replace('&gt;', '>').replace('&lt;', '<').replace('&amp;', '&').strip() if t else 'NO TITLE'
    m = re.match(r'^DIAG\|(\d+)x(\d+) -> (\d+)x(\d+)$', diag)
    if not m:
        print('DIAG ->', diag)
        return
    w, h = int(m.group(3)), int(m.group(4))
    out = os.path.abspath(out)
    subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--no-sandbox',
                    '--hide-scrollbars', '--virtual-time-budget=20000',
                    '--window-size=%d,%d' % (w + 1, h + 1),
                    '--screenshot=' + out, 'file:///' + tmp],
                   stderr=subprocess.DEVNULL, check=False)
    print(out, os.path.getsize(out) if os.path.exists(out) else 'MISSING', '|', diag)


main()
