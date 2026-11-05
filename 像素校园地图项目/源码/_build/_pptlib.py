# -*- coding: utf-8 -*-
"""把「校园示意图.pptx」第 2 张（用户亲手画的图书馆）渲染成 PNG，供人眼核对。

为什么必须出图：这张示意图是**主题色 + 形状表**画的（41 个形状，全部走 `p:style`
的 fillRef 取主题色），直接读 XML 只能得到一堆十六进制尺寸；而形状之间的**遮挡
与邻接关系**（谁压在谁上面、哪条带贴在哪个体量顶上）才是这张图的信息量所在 ——
那只有画出来才看得见。

用法：python _pptlib.py [页码=2] [倍率=2] [out=_look/ppt_s2.png]
"""
import io, os, re, sys, zipfile
from PIL import Image, ImageDraw, ImageFont
import xml.etree.ElementTree as ET

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(os.path.dirname(HERE))          # 地图项目所在的**总目录**
# ⚠️ 2026-09-27：项目搬过一次目录（旧的 `D:\desktop\像素校园地图项目\` 已不存在）。
#    原写法 `os.path.join(os.path.dirname(PROJ), ...)` 多剥了一层 ⇒ 落到 `D:\desktop\`，
#    而 pptx 现在就在 PROJ 里。改成候选表，**先找得到哪个用哪个**，
#    免得下一次再搬家又是一处静默失效（`_pptshapes.py` 同款，同一轮一起修）。
PPTX = None
for _c in (os.path.join(PROJ, u'校园示意图.pptx'),
           os.path.join(os.path.dirname(PROJ), u'校园示意图.pptx'),
           r'D:\desktop\校园示意图.pptx'):
    if os.path.exists(_c):
        PPTX = _c
        break
if PPTX is None:
    sys.exit(u'找不到 校园示意图.pptx —— 改 _pptlib.py 顶部的候选表')

PAGE = int(sys.argv[1]) if len(sys.argv) > 1 else 2
Z = float(sys.argv[2]) if len(sys.argv) > 2 else 2.0
OUT = sys.argv[3] if len(sys.argv) > 3 else os.path.join(HERE, '_look', 'ppt_s%d.png' % PAGE)

NS = {'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
      'p': 'http://schemas.openxmlformats.org/presentationml/2006/main'}
EMU = 914400.0
PT = 96.0 / EMU


def px(v):
    return None if v is None else int(v) * PT


z = zipfile.ZipFile(PPTX)


def theme_colors():
    x = z.read('ppt/theme/theme1.xml').decode('utf-8')
    m = re.search(r'<a:clrScheme.*?</a:clrScheme>', x, re.S).group(0)
    out = {}
    for mm in re.finditer(r'<a:(\w+)>(.*?)</a:\1>', m, re.S):
        # ⚠️ sysClr 形如 <a:sysClr val="windowText" lastClr="000000"/> —— 必须先取
        # lastClr，否则会拿到 "window"/"windowText" 这种**颜色名**，PIL 直接报错。
        v = re.search(r'lastClr="(\w+)"', mm.group(2)) or re.search(r'val="(\w+)"', mm.group(2))
        if v:
            out[mm.group(1)] = v.group(1)
    out['bg1'] = out.get('lt1', 'FFFFFF')
    out['tx1'] = out.get('dk1', '000000')
    return out


TH = theme_colors()
SLIDE = z.read('ppt/slides/slide%d.xml' % PAGE).decode('utf-8')
root = ET.fromstring(SLIDE)

# 幻灯片尺寸
sz = re.search(r'<p:sldSz cx="(\d+)" cy="(\d+)"', SLIDE)
W = px(int(sz.group(1))) if sz else 1280
H = px(int(sz.group(2))) if sz else 720

img = Image.new('RGB', (int(W * Z), int(H * Z)), (255, 255, 255))
d = ImageDraw.Draw(img)


def resolve_fill(sp):
    """先看显式 solidFill（含藏在 a14:hiddenFill 里的），再回落到 p:style 的 fillRef。"""
    f = sp.find('.//a:solidFill/a:srgbClr', NS)
    if f is not None:
        return '#' + f.get('val')
    f = sp.find('.//a:solidFill/a:schemeClr', NS)
    if f is not None:
        return '#' + TH.get(f.get('val'), '888888')
    st = sp.find('.//p:style/a:fillRef/a:schemeClr', NS)
    if st is not None:
        return '#' + TH.get(st.get('val'), '888888')
    return '#CCCCCC'


def resolve_line(sp):
    for c in sp.findall('.//a:ln/a:solidFill/a:srgbClr', NS):
        return '#' + c.get('val')
    for c in sp.findall('.//a:ln/a:solidFill/a:schemeClr', NS):
        return '#' + TH.get(c.get('val'), '444444')
    st = sp.find('.//p:style/a:lnRef/a:schemeClr', NS)
    if st is not None:
        return '#' + TH.get(st.get('val'), '444444')
    return '#444444'


shapes = root.findall('.//p:sp', NS) + root.findall('.//p:cxnSp', NS)
for sp in shapes:
    g = sp.find('.//a:prstGeom', NS)
    prst = g.get('prst') if g is not None else 'rect'
    xf = sp.find('.//a:xfrm', NS)
    if xf is None:
        continue
    off, ext = xf.find('a:off', NS), xf.find('a:ext', NS)
    if off is None or ext is None:
        continue
    x, y = px(off.get('x')), px(off.get('y'))
    x, y = x * Z, y * Z
    w = px(ext.get('cx')) * Z
    h = px(ext.get('cy')) * Z
    fill, line = resolve_fill(sp), resolve_line(sp)
    box = [x, y, x + w, y + h]
    if prst == 'triangle':
        d.polygon([(x + w / 2, y), (x + w, y + h), (x, y + h)], fill=fill, outline=line)
    elif prst == 'trapezoid':
        i = w * 0.22
        d.polygon([(x + i, y), (x + w - i, y), (x + w, y + h), (x, y + h)],
                  fill=fill, outline=line)
    else:
        d.rectangle(box, fill=fill, outline=line)
    txt = ''.join(e.text or '' for e in sp.findall('.//a:t', NS))
    if txt:
        try:
            fnt = ImageFont.truetype(r'C:\Windows\Fonts\simhei.ttf', int(16 * Z))
        except Exception:
            fnt = None
        d.text(((x + x + w) / 2, (y + y + h) / 2), txt, fill='#000000',
               font=fnt, anchor='mm')

img.save(OUT)
print('ppt 第 %d 张 -> %s   %dx%d  (主题色 %s)' % (PAGE, OUT, img.width, img.height, TH))
print('  形状数 %d' % len(shapes))
