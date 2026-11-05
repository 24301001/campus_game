# -*- coding: utf-8 -*-
"""第五教学楼（第三十轮起）：把**照片缩到精灵尺度**，与新图上下叠一张。

⚠️ 上一轮改过 W/H 的取景框（**第三十三轮**）：进深 352→528、屋面换几何
   ⇒ 精灵 266×405 变成 **266×581**，檐下沿 268→444、落地线 370→546；
   屋带（`ROOF_SPR`）从 (22,18)-(243,267) 变成 **(22,18)-(243,443)**。
   用户改了楼高/进深之后这两组数必须跟着改，否则裁出来的是**旧位置**的一块。
   ⚠️ 第三十三轮起屋面是**南北向正脊的双坡顶**：`ROOF_SPR` 那一框比照片
      （正射、横纹、三角轮廓）**不可直接对账**，只能看"瓦色 / 垄距 / 脊线"三件事。


为什么非要有这一步：第 54 条教训——配色 / 纹路的改动是**纯像素改动**，
`accept` / `verify` / `zoomtest` / `_propdiff` / `_sprhash` 五套自动验收会**全绿**
（`_sprhash` 只报"这件变了"，不报"变成什么样"）。唯一能看出"墙暗了一档"
"窗格画错了"的探针就是把两张图放在同一尺度上并排看。

用法:
  python _wjcmp.py facade <产物.html> <出图.png> [倍数] [gap]
      —— 上：照片立面缩到 214×102；下：新图立面 (26,268)-(239,369)
  python _wjcmp.py roof   <产物.html> <出图.png> [倍数]
      —— 上：照片屋面缩到 222×250；下：新图屋面 (22,18)-(243,267)
      ⚠️ 这两个尺度的竖向含义**不同**：照片是正射（1 px = 1 真实像素），
         新图是 0.6 进深投影。并排只为看"瓦色/垄距/脊线位置"，不是逐像素对账。
"""
import io, os, re, subprocess, sys

from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(os.path.dirname(HERE))
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
SRC = os.path.join(PROJ, u'预览', u'第五教学楼正面图.png')
_TMP = os.path.join(HERE, '_wjcmp_gen.html')

W, H = 266, 581                      # 第五教学楼精灵（第三十三轮：进深 352→528）
# 精灵里的取景框（左, 上, 右, 下）—— 含端点
FACADE_SPR = (26, 444, 239, 545)     # 立面 = 檐下沿(444) 到 落地线上一行(baseY 546 - 1)
ROOF_SPR   = (22, 18, 243, 443)
# 照片里的对应框
FACADE_PHOTO = (62, 583, 1290, 1424)
ROOF_PHOTO   = (38, 330, 1312, 583)

SHOT = """
<script>
window.addEventListener('load', function(){ setTimeout(function(){
  try{
    var p = null;
    for (var i=0;i<props.length;i++)
      if (props[i].img.width === %(W)d && props[i].img.height === %(H)d) p = props[i];
    if (!p) { document.title = 'DIAG|没有 %(W)d×%(H)d 的道具'; return; }
    var im = p.img, c2 = document.createElement('canvas');
    c2.width = im.width; c2.height = im.height;
    c2.getContext('2d').drawImage(im, 0, 0);
    document.body.innerHTML = '';
    document.body.style.margin = '0';
    document.body.appendChild(c2);
    document.title = 'DIAG|OK';
  }catch(e){ document.title='DIAG|EX '+e.message; }
}, 2500); });
</script>
"""


def sprite(src):
    """从产物里抠出第五教学楼的**原尺寸**精灵，存成临时 png 返回路径"""
    base = io.open(src, encoding='utf-8').read()
    io.open(_TMP, 'w', encoding='utf-8', newline='\n').write(
        base.replace('</body>', SHOT % {'W': W, 'H': H} + '</body>', 1))
    out = os.path.join(HERE, '_look', '_wjcmp_sprite.png')
    subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--no-sandbox',
                    '--hide-scrollbars', '--window-size=%d,%d' % (W, H),
                    '--screenshot=' + os.path.abspath(out),
                    '--virtual-time-budget=20000', 'file:///' + _TMP],
                   check=False, capture_output=True)
    im = Image.open(out).convert('RGBA')
    return im.crop((0, 0, W, H))


def crop_photo(box, size):
    im = Image.open(SRC).convert('RGB').crop(box)
    return im.resize(size, Image.LANCZOS)


def stack(top, bot, Z, gap, path):
    w = max(top.width, bot.width)
    c = Image.new('RGB', (w, top.height + gap + bot.height), (20, 20, 24))
    c.paste(top, (0, 0))
    c.paste(bot, (0, top.height + gap))
    c = c.resize((c.width * Z, c.height * Z), Image.NEAREST)
    c.save(path)
    print('已出图: %s  (%dx%d -> %dx%d)' % (path, w, top.height + gap + bot.height, c.width, c.height))


def main():
    a = sys.argv[1:]
    if len(a) < 3:
        print(__doc__)
        return
    mode, src, out = a[0], a[1], a[2]
    Z = int(a[3]) if len(a) > 3 else 3
    if not os.path.exists(SRC):
        raise SystemExit(u'找不到素材: %s' % SRC)
    sp = sprite(src)
    if mode == 'facade':
        bw = FACADE_SPR[2] - FACADE_SPR[0] + 1
        bh = FACADE_SPR[3] - FACADE_SPR[1] + 1
        bot = sp.crop((FACADE_SPR[0], FACADE_SPR[1], FACADE_SPR[2] + 1, FACADE_SPR[3] + 1)).convert('RGB')
        top = crop_photo(FACADE_PHOTO, (bw, bh))
        stack(top, bot, Z, int(a[4]) if len(a) > 4 else 6, out)
    elif mode == 'roof':
        bw = ROOF_SPR[2] - ROOF_SPR[0] + 1
        bh = ROOF_SPR[3] - ROOF_SPR[1] + 1
        bot = sp.crop((ROOF_SPR[0], ROOF_SPR[1], ROOF_SPR[2] + 1, ROOF_SPR[3] + 1)).convert('RGB')
        top = crop_photo(ROOF_PHOTO, (bw, bh))
        stack(top, bot, Z, 6, out)
    elif mode == 'box':
        # python _wjcmp.py box <产物> <出图> <Z> <px0> <py0> <px1> <py1> <sx0> <sy0> <sx1> <sy1>
        Z = int(a[3])
        px0, py0, px1, py1 = [int(v) for v in a[4:8]]
        sx0, sy0, sx1, sy1 = [int(v) for v in a[8:12]]
        bot = sp.crop((sx0, sy0, sx1 + 1, sy1 + 1)).convert('RGB')
        top = crop_photo((px0, py0, px1, py1), (bot.width, bot.height))
        stack(top, bot, Z, 6, out)
    else:
        print(__doc__)


main()
