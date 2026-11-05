# -*- coding: utf-8 -*-
"""第三十四轮一次性探针：把**建筑艺术学院的精灵原尺寸**抠出来 + 打印它的世界锚点。

为什么非要有这一步（同 `_wjcmp.py` 文件头那条理由）：
  配色 / 纹路 / 覆盖范围这类**纯像素改动**，`accept` / `verify` / `zoomtest` /
  `_propdiff` / `_sprhash` 五套自动验收会**全绿**（`_sprhash` 只报"这件变了"，
  不报"变成什么样"）。实景图（`_wjscene.py`）在 1× 档下楼的半截还在屏幕外，
  量不出"哪一行画的是什么" ⇒ 唯一能逐像素看的探针就是**把精灵本身抠出来**。

用法:
  python _jysprite.py <产物.html> <出图.png> [放大倍数]
  产物精灵尺寸写在下面 W/H —— 改楼高/进深/层数之后必须跟着改，否则找不到道具。
"""
import io, os, subprocess, sys

from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

# 建筑艺术学院精灵（第三十四轮）：461 立面宽 + 52 PADX × 18 + 96 roofT + 170 墙 + 35 尾
W, H = 513, 319

SHOT = """
<script>
window.addEventListener('load', function(){ setTimeout(function(){
  try{
    var hits = [];
    for (var i=0;i<props.length;i++)
      if (props[i].img.width === %(W)d && props[i].img.height === %(H)d) hits.push(props[i]);
    if (!hits.length) { document.title = 'DIAG|没有 %(W)d×%(H)d 的道具'; return; }
    var p = hits[0];
    var im = p.img, c2 = document.createElement('canvas');
    c2.width = im.width; c2.height = im.height;
    c2.getContext('2d').drawImage(im, 0, 0);
    document.body.innerHTML = '';
    document.body.style.margin = '0';
    document.body.appendChild(c2);
    document.title = 'DIAG|n=' + hits.length
      + ' x=' + Math.round(p.x) + ' y=' + Math.round(p.y)
      + ' ax=' + Math.round(p.ax) + ' ay=' + Math.round(p.ay)
      + ' baseY=' + (p.baseY === undefined ? '-' : Math.round(p.baseY));
  }catch(e){ document.title='DIAG|EX '+e.message; }
}, 2500); });
</script>
"""


def main():
    src, out = sys.argv[1], sys.argv[2]
    Z = int(sys.argv[3]) if len(sys.argv) > 3 else 2
    base = io.open(src, encoding='utf-8').read()
    tmp = os.path.join(HERE, '_jysprite_gen.html')
    io.open(tmp, 'w', encoding='utf-8', newline='\n').write(
        base.replace('</body>', SHOT % {'W': W, 'H': H} + '</body>', 1))
    out = os.path.abspath(out)
    raw = os.path.join(HERE, '_look', '_jysprite_raw.png')
    subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--no-sandbox',
                    '--hide-scrollbars', '--window-size=%d,%d' % (W, H),
                    '--screenshot=' + raw,
                    '--virtual-time-budget=20000', 'file:///' + tmp],
                   check=False, capture_output=True)
    im = Image.open(raw).convert('RGB').crop((0, 0, W, H))
    im = im.resize((W * Z, H * Z), Image.NEAREST)
    im.save(out)
    print('已出图: %s  (%dx%d -> %dx%d)' % (out, W, H, im.width, im.height))


main()
