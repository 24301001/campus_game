# -*- coding: utf-8 -*-
"""第七教学楼正面照片量尺寸（第二十九轮）

照片 = ..\\预览\\第七教学楼.png，1792x1344，**正射正立面**（无透视）
⇒ 照片上的像素比例 = 真实比例，可直接换算。

本脚本只读照片、只打印，不碰任何交付件。

用法:
  python _qjmeasure.py frame    外框 + 行列剖面（找楼体边界与主分界）
  python _qjmeasure.py bands    逐行色带（把一行按 16px 分块取平均色）
  python _qjmeasure.py col <y>  某一列的纵向色带
"""
import os
import sys

from PIL import Image

_HERE = os.path.dirname(os.path.abspath(__file__))          # ...\源码\_build
_PROJ = os.path.dirname(os.path.dirname(_HERE))             # ...\像素校园地图项目
SRC = os.path.join(_PROJ, u'预览', u'第七教学楼.png')

im = Image.open(SRC).convert('RGB')
W, H = im.size
PX = im.load()


def is_bg(p):
    """背景是极浅的暖白（带轻微渐变）——与楼体的米白墙仍差得开"""
    r, g, b = p
    return abs(r - 242) < 9 and abs(g - 242) < 9 and abs(b - 240) < 9


def span(y, step=1):
    """这一行上"非背景"的最左/最右，以及非背景像素总数"""
    lo, hi, n = None, None, 0
    for x in range(W):
        if not is_bg(PX[x, y]):
            n += 1
            if lo is None:
                lo = x
            hi = x
    return lo, hi, n


def main():
    a = sys.argv[1:]
    mode = a[0] if a else 'frame'

    if mode == 'frame':
        print('图片 %dx%d' % (W, H))
        print('--- 每 12 行的 左/右/计数 ---')
        for y in range(240, 1120, 12):
            lo, hi, n = span(y)
            print('%4d  lo=%-5s hi=%-5s n=%-5d' % (y, lo, hi, n))
        print('--- 每 24 列的 上/下/计数 ---')
        for x in range(0, W, 24):
            top, bot, n = None, None, 0
            for y in range(H):
                if not is_bg(PX[x, y]):
                    n += 1
                    if top is None:
                        top = y
                    bot = y
            print('%4d  top=%-5s bot=%-5s n=%-5d' % (x, top, bot, n))

    elif mode == 'bands':
        y0 = int(a[1]) if len(a) > 1 else 320
        y1 = int(a[2]) if len(a) > 2 else 1010
        step = int(a[3]) if len(a) > 3 else 10
        for y in range(y0, y1, step):
            out = []
            for x0 in range(0, W, 112):
                rs = gs = bs = c = 0
                for x in range(x0, min(x0 + 112, W), 4):
                    r, g, b = PX[x, y]
                    rs += r; gs += g; bs += b; c += 1
                out.append('%3d,%3d,%3d' % (rs / c, gs / c, bs / c))
            print('%4d | %s' % (y, ' | '.join(out)))

    elif mode == 'col':
        x = int(a[1])
        y0 = int(a[2]) if len(a) > 2 else 250
        y1 = int(a[3]) if len(a) > 3 else 1120
        prev = None
        for y in range(y0, y1):
            p = PX[x, y]
            if prev is None or max(abs(p[i] - prev[i]) for i in range(3)) > 12:
                print('%4d  %s' % (y, p))
                prev = p


main()
