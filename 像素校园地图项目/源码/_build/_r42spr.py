# -*- coding: utf-8 -*-
"""第四十二轮一次性探针：按 props **下标**取一件建筑的精灵原图放大出图。

为什么不用 _bldview.py：它是按 `宽+高` 找的，并且取的是**最后一个**匹配项 ——
513x235 在本校园有两件（24=计算机中心 / 27=天佑会堂），只会拿到 27，看不到 24。

用法: python _r42spr.py <props下标> [scale] [out.png]
"""
import io, os, re, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(HERE)
SRC = os.path.join(PROJ, u'像素校园_全校地图.html')
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

PICK = """
<script>
window.addEventListener('load', function(){ setTimeout(function(){
  try{
    var i = %(I)d, p = props[i];
    if (!p) { document.title = 'DIAG|没有下标 %(I)d（props 长度 ' + props.length + '）'; return; }
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
    document.title = 'DIAG|idx=%(I)d ' + im.width + 'x' + im.height + ' -> ' + c2.width + 'x' + c2.height;
  }catch(e){ document.title='DIAG|EX '+e.message; }
}, 2500); });
</script>
"""


def main():
    idx, scale = int(sys.argv[1]), int(sys.argv[2])
    out = os.path.abspath(sys.argv[3])
    html = io.open(SRC, encoding='utf-8').read()
    html = html.replace('</body>', (PICK % {'I': idx, 'S': scale}) + '</body>', 1)
    tmp = os.path.join(HERE, '_r42spr_gen.html')
    io.open(tmp, 'w', encoding='utf-8', newline='\n').write(html)
    subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--no-sandbox',
                    '--hide-scrollbars', '--virtual-time-budget=20000',
                    '--screenshot=' + out, '--window-size=%d,%d' % (600 * 3, 260 * 3),
                    'file:///' + tmp.replace('\\', '/')], capture_output=True, check=False)
    print(out, os.path.getsize(out) if os.path.exists(out) else 'MISSING')


main()
