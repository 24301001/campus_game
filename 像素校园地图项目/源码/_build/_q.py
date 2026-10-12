# -*- coding: utf-8 -*-
"""裁 _map_render.png 的局部放大（对 PPT 版式用）。用法：python _q.py x0 y0 x1 y1 sc out
坐标是**世界像素**（5208x2929）。"""
import os, sys
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(os.path.dirname(HERE), u'过程文件', '_map_render.png')
WORLD_W, WORLD_H = 5208.0, 2929.0

a = [float(v) for v in sys.argv[1:5]]
sc = float(sys.argv[5]) if len(sys.argv) > 5 else 1.0
out = sys.argv[6] if len(sys.argv) > 6 else '_q_crop.png'

im = Image.open(SRC).convert('RGB')
W, H = im.size
sx, sy = W / WORLD_W, H / WORLD_H
box = (int(a[0] * sx), int(a[1] * sy), int(a[2] * sx), int(a[3] * sy))
c = im.crop(box)
c = c.resize((int(c.width * sc), int(c.height * sc)), Image.LANCZOS)
p = os.path.join(HERE, out)
c.save(p)
print('%s %s  (render %dx%d, world->render %.4f,%.4f)' % (p, c.size, W, H, sx, sy))
