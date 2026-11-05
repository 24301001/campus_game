# -*- coding: utf-8 -*-
"""天佑会堂正面图(_previews/tianyouhuitang.png)一次性量测：找横带边界 + 配色。
只做诊断，不是常驻工具。用法: python _tym.py
"""
import io, os, sys
from PIL import Image
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))   # 像素校园地图项目
IMG = os.path.join(ROOT, u'预览', u'tianyouhuitang.png')

im = Image.open(IMG).convert('RGB')
W, H = im.size
print('size', W, H)
px = im.load()

def near(c, t, tol=26):
    return abs(c[0]-t[0]) <= tol and abs(c[1]-t[1]) <= tol and abs(c[2]-t[2]) <= tol

def seg(pts):
    """把连续相同/相近颜色压成段"""
    out = []
    for i, c in pts:
        if out and near(out[-1][2], c, 18):
            out[-1] = (out[-1][0], i, c)
        else:
            out.append((i, i, c))
    return [(a, b, c) for a, b, c in out if b - a >= 6]

# --- 纵向：沿中轴列扫（建筑中心大致 x=1024）---
for xc in (1024,):
    col = [(y, px[xc, y]) for y in range(0, H)]
    print('\n=== 列 x=%d 纵向分段 (y0..y1 色) ===' % xc)
    for a, b, c in seg(col):
        print('  %4d..%4d  #%02x%02x%02x  len=%d' % (a, b, c[0], c[1], c[2], b-a+1))

# --- 横向：几条关键行 ---
for yc in (150, 300, 470, 560, 700, 820, 900):
    row = [(x, px[x, yc]) for x in range(0, W)]
    print('\n=== 行 y=%d 横向分段 ===' % yc)
    for a, b, c in seg(row):
        print('  %4d..%4d  #%02x%02x%02x  len=%d' % (a, b, c[0], c[1], c[2], b-a+1))

# --- 墙顶/墙左右缘粗定位（在多个行上找"非白"区间的左右端）---
def rowspan(y, white=(250,250,250), tol=12):
    xs = [x for x in range(W) if not near(px[x, y], white, tol)]
    return (min(xs), max(xs)) if xs else None

print('\n=== 非白区左右端（找墙宽）===')
for y in (120, 200, 400, 600, 800, 860, 940, 985):
    print('  y=%4d -> %s' % (y, rowspan(y)))

def colspan(x, white=(250,250,250), tol=12):
    ys = [y for y in range(H) if not near(px[x, y], white, tol)]
    return (min(ys), max(ys)) if ys else None

print('\n=== 非白区上下端（找墙高，垂直线）===')
for x in (110, 260, 1024, 1800, 1930):
    print('  x=%4d -> %s' % (x, colspan(x)))
