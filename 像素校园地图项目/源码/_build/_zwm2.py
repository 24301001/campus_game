# -*- coding: utf-8 -*-
"""詹天佑雕塑 —— 精细量测（排除右下角"豆包AI生成"水印）。
用法: python _zwm2.py
"""
import io, os, sys
from PIL import Image
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
IMG = os.path.join(ROOT, u'预览', u'zhaitianyoudiaoxiang.png')

im = Image.open(IMG).convert('RGB')
W, H = im.size
px = im.load()
WHITE = (250, 250, 250)


def near(c, t, tol=16):
    return abs(c[0] - t[0]) <= tol and abs(c[1] - t[1]) <= tol and abs(c[2] - t[2]) <= tol


def isw(x, y):                       # 水印区：右下角一块
    return x > 990 and y > 1780


def span_row(y, tol=16):
    xs = [x for x in range(W) if not isw(x, y) and not near(px[x, y], WHITE, tol)]
    return (min(xs), max(xs)) if xs else None


def runs_row(y, tol=16, minlen=3):
    """该行的非白连续段（带颜色）"""
    out, cur = [], None
    for x in range(W):
        if isw(x, y):
            continue
        dark = not near(px[x, y], WHITE, tol)
        if dark:
            if cur is None:
                cur = [x, x]
            else:
                cur[1] = x
        else:
            if cur and cur[1] - cur[0] + 1 >= minlen:
                out.append((cur[0], cur[1], px[(cur[0] + cur[1]) // 2, y]))
            cur = None
    if cur and cur[1] - cur[0] + 1 >= minlen:
        out.append((cur[0], cur[1], px[(cur[0] + cur[1]) // 2, y]))
    return out


print('size', W, H)
tot = []
for y in range(H):
    s = span_row(y)
    if s:
        tot += [s[0], s[1]]
print('真实包围盒 x %d..%d' % (min(tot), max(tot)))
ys = [y for y in range(H) if span_row(y)]
print('真实包围盒 y %d..%d' % (min(ys), max(ys)))

print('\n=== 逐行宽度（每 25 行；标出窄/宽突变）===')
prev = -1
for y in range(180, 1900, 25):
    s = span_row(y)
    if not s:
        continue
    w = s[1] - s[0] + 1
    cx = (s[0] + s[1]) / 2
    flag = ''
    if prev > 0 and abs(w - prev) > 25:
        flag = '   <<< 突变'
    print('  y=%4d  x %4d..%4d  w=%3d  cx=%6.1f%s' % (y, s[0], s[1], w, cx, flag))
    prev = w

print('\n=== 中轴列 x=577 纵向分段 ===')
out = []
for y in range(H):
    if isw(577, y):
        continue
    c = px[577, y]
    if out and near(out[-1][2], c, 14):
        out[-1] = (out[-1][0], y, c)
    else:
        out.append((y, y, c))
for a, b, c in out:
    if b - a >= 5:
        print('  %4d..%4d  #%02x%02x%02x  len=%d' % (a, b, c[0], c[1], c[2], b - a + 1))

print('\n=== 找金色铭牌（R>170 且 G>140 且 B<140 且 R-B>50）===')
gx0, gx1, gy0, gy1 = 9999, -1, 9999, -1
for y in range(0, H, 2):
    for x in range(0, W, 2):
        c = px[x, y]
        if c[0] > 170 and c[1] > 140 and c[2] < 140 and c[0] - c[2] > 50:
            gx0, gx1 = min(gx0, x), max(gx1, x)
            gy0, gy1 = min(gy0, y), max(gy1, y)
print('  金色区 x %d..%d  y %d..%d  (宽 %d 高 %d)' % (gx0, gx1, gy0, gy1, gx1 - gx0 + 1, gy1 - gy0 + 1))

print('\n=== 几条关键行的连续段 ===')
for yc in (190, 210, 260, 340, 420, 560, 700, 860, 960, 1000, 1040, 1090, 1400, 1500, 1560, 1600, 1660, 1700, 1760, 1800, 1830, 1860):
    r = runs_row(yc)
    print('  y=%4d:' % yc, ' '.join('%d-%d#%02x%02x%02x' % (a, b, c[0], c[1], c[2]) for a, b, c in r))
