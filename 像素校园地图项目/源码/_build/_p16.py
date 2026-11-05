# -*- coding: utf-8 -*-
"""16 号宿舍楼照片取色与量尺。
用法: python _p16.py <img> [u v u v ...]
  不带参数: 先打印尺寸并出一张 12x8 的采样网格色表
  带参数:   对每个 (u,v) 归一化坐标取 5x5 邻域中位色
"""
import sys
from PIL import Image

p = u"D:/desktop/像素校园地图项目/预览/18haosushelou.jpg"
im = Image.open(p).convert("RGB")
W, H = im.size
print("SIZE %dx%d" % (W, H))

def at(u, v, k=6):
    x, y = int(u * W), int(v * H)
    px = []
    for dx in range(-k, k + 1):
        for dy in range(-k, k + 1):
            xx, yy = min(W - 1, max(0, x + dx)), min(H - 1, max(0, y + dy))
            px.append(im.getpixel((xx, yy)))
    px.sort(key=lambda c: c[0] + c[1] + c[2])
    r, g, b = px[len(px) // 2]
    return "#%02x%02x%02x" % (r, g, b), (r, g, b)

if len(sys.argv) > 2:
    a = [float(v) for v in sys.argv[2:]]
    for i in range(0, len(a), 2):
        c, rgb = at(a[i], a[i + 1])
        print("u=%.3f v=%.3f -> %s %s" % (a[i], a[i + 1], c, rgb))
else:
    print("--- 12 x 8 grid ---")
    for j in range(1, 8):
        row = []
        for i in range(1, 12):
            c, _ = at(i / 12.0, j / 8.0, 4)
            row.append(c)
        print("v=%.3f %s" % (j / 8.0, " ".join(row)))
