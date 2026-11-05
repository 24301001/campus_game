# -*- coding: utf-8 -*-
"""16 号宿舍楼照片：按色相聚类取主色（排除天空 / 树 / 阴影干扰）。
只看主楼立面那一段（纵向 5%~62%），横向全宽，每 3px 采一个点。
"""
from PIL import Image

im = Image.open(u"D:/desktop/像素校园地图项目/预览/18haosushelou.jpg").convert("RGB")
W, H = im.size
SRC = [im.getpixel((x, y))
       for y in range(int(H * 0.05), int(H * 0.62), 2)
       for x in range(0, W, 3)]

def med(px):
    px = sorted(px)
    n = len(px)
    return px[n // 2] if n % 2 else tuple((px[n // 2 - 1][i] + px[n // 2][i]) // 2 for i in range(3))

def rep(name, pred):
    sel = [c for c in SRC if pred(c)]
    if not sel:
        print("%-14s none" % name)
        return
    r, g, b = med(sel)
    print("%-14s n=%-7d #%02x%02x%02x  rgb(%d,%d,%d)" % (name, len(sel), r, g, b, r, g, b))

rep("brick-bright", lambda c: c[0] > c[1] + 38 and c[0] > c[2] + 38 and 145 < c[0] < 235)
rep("brick-mid",    lambda c: c[0] > c[1] + 30 and c[0] > c[2] + 30 and 110 < c[0] <= 175)
rep("brick-all",    lambda c: c[0] > c[1] + 30 and c[0] > c[2] + 30 and 100 < c[0] < 235)
rep("grayblue",     lambda c: c[2] > c[0] + 8 and 90 < c[2] < 210 and abs(c[2] - c[1]) < 45)
rep("white",        lambda c: min(c) > 195)
rep("white-mid",    lambda c: min(c) > 165 and max(c) - min(c) < 30)
rep("darkest",      lambda c: max(c) < 60)
