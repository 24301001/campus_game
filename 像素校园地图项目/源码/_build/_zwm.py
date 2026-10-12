# -*- coding: utf-8 -*-
"""詹天佑雕塑（预览/zhaitianyoudiaoxiang.png）一次性量测：包围盒 + 分层边界 + 配色。
只做诊断，不是常驻工具。用法: python _zwm.py
"""
import io, os, sys
from PIL import Image
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))   # 像素校园地图项目
IMG = os.path.join(ROOT, u'预览', u'zhaitianyoudiaoxiang.png')

im = Image.open(IMG).convert('RGB')
W, H = im.size
print('size', W, H)
px = im.load()


def near(c, t, tol=18):
    return abs(c[0] - t[0]) <= tol and abs(c[1] - t[1]) <= tol and abs(c[2] - t[2]) <= tol


def seg(pts, minlen=6):
    out = []
    for i, c in pts:
        if out and near(out[-1][2], c, 14):
            out[-1] = (out[-1][0], i, c)
        else:
            out.append((i, i, c))
    return [(a, b, c) for a, b, c in out if b - a >= minlen]


WHITE = (250, 250, 250)


def span_row(y, tol=14):
    xs = [x for x in range(W) if not near(px[x, y], WHITE, tol)]
    return (min(xs), max(xs)) if xs else None


def span_col(x, tol=14):
    ys = [y for y in range(H) if not near(px[x, y], WHITE, tol)]
    return (min(ys), max(ys)) if ys else None


print('\n=== 整体非白包围盒 ===')
allx, ally = [], []
for y in range(0, H, 2):
    s = span_row(y)
    if s:
        allx += [s[0], s[1]]
        ally.append(y)
print('  x %d..%d   y %d..%d' % (min(allx), max(allx), min(ally), max(ally)))

print('\n=== 逐行宽度轮廓（每 20 行）===')
for y in range(0, H, 20):
    s = span_row(y)
    print('  y=%4d  %s  w=%s' % (y, s, (s[1] - s[0] + 1) if s else '-'))

print('\n=== 纵向分段：沿中轴列 ===')
cx = (min(allx) + max(allx)) // 2
print('  中轴 x =', cx)
for a, b, c in seg([(y, px[cx, y]) for y in range(0, H)]):
    print('  %4d..%4d  #%02x%02x%02x  len=%d' % (a, b, c[0], c[1], c[2], b - a + 1))

print('\n=== 几条关键横行的分段 ===')
for yc in (200, 300, 420, 620, 780, 900, 1080, 1200, 1300):
    print('  行 y=%d:' % yc)
    for a, b, c in seg([(x, px[x, yc]) for x in range(0, W)]):
        print('    %4d..%4d  #%02x%02x%02x  len=%d' % (a, b, c[0], c[1], c[2], b - a + 1))

print('\n=== 关键列的分段（找底盘/柱/人的上下边界）===')
for xc in (cx, min(allx) + 6, max(allx) - 6):
    print('  列 x=%d: %s' % (xc, span_col(xc)))
