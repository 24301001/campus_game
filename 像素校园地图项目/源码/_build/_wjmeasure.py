# -*- coding: utf-8 -*-
"""第五教学楼正面图量尺寸（第三十轮）

照片 = ..\\预览\\第五教学楼正面图.png，**正射正立面**（无透视）+ 透明底
⇒ 照片上的像素比例 = 真实比例，可直接换算（与第 29 轮第七教学楼同一类素材）。

⚠️ 本条走过的弯路（记在案，别再踩）：
   第一次拿到的是一张**实拍**（`第五教学楼正面图.jpg`，1279x1706，树挡掉半栋、
   带透视、整体偏暗偏紫）—— 那份读数的每一个数都作废。用户 2026-09-29 换成了
   这张正立面图。**同一路径两个扩展名并存过**，本脚本按**名字**取图，
   找不到就直接报错退出（绝不"退回 jpg"悄悄量错）。

本脚本只读照片、只打印 + 可选出局部放大图，不碰任何交付件。

用法:
  python _wjmeasure.py frame            外框 + 行列剖面（找楼体边界与主分界）
  python _wjmeasure.py bands [y0 y1]    逐行色带（一行按 112px 分块取平均）
  python _wjmeasure.py box <x0> <y0> <x1> <y1>    一块的均值 + 最常见八色
  python _wjmeasure.py col <x> <y0> <y1>          某一列自上而下的色变（跑长）
  python _wjmeasure.py row <y> <x0> <x1>          某一行自左而右的色变（跑长）
  python _wjmeasure.py crop <x0> <y0> <x1> <y1> <倍数> <出图.png>
"""
import os
import sys

from PIL import Image

_HERE = os.path.dirname(os.path.abspath(__file__))          # ...\源码\_build
_PROJ = os.path.dirname(os.path.dirname(_HERE))             # ...\像素校园地图项目
SRC = os.path.join(_PROJ, u'预览', u'第五教学楼正面图.png')

if not os.path.exists(SRC):
    raise SystemExit(u'找不到素材: %s' % SRC)
im = Image.open(SRC).convert('RGBA')
W, H = im.size
PX = im.load()

MINRUN = 4


def is_bg(p):
    """背景 = 近白的浅灰（棋盘格是**画进去的**，不是真透明：行行 1344 个不透明像素）
    ⇒ 判据取"三通道都 > 235 且最大最小差 < 12"。楼体上没有任何构件这么亮
      （最亮的白窗框实测 #e8e8ea 上下，仍低于 235 那档的边）。"""
    return p[0] > 235 and p[1] > 235 and p[2] > 235 and max(p[:3]) - min(p[:3]) < 12


def span(y):
    """这一行上"不透明"的最左/最右，以及不透明像素总数"""
    lo, hi, n = None, None, 0
    for x in range(W):
        if not is_bg(PX[x, y]):
            n += 1
            if lo is None:
                lo = x
            hi = x
    return lo, hi, n


def box(x0, y0, x1, y1):
    """一块的均值 + 出现最多的八色

    ⚠️ 第 29 轮教训：**"这个构件是什么颜色"要看直方图那一簇，不看均值** ——
       均值会把相邻构件的色、阴影一起拌进来（第 53 条）。
    """
    cnt = {}
    rs = gs = bs = n = 0
    for y in range(y0, y1):
        for x in range(x0, x1):
            p = PX[x, y]
            if is_bg(p):
                continue
            rs += p[0]; gs += p[1]; bs += p[2]; n += 1
            cnt[p[:3]] = cnt.get(p[:3], 0) + 1
    if not n:
        print(u'块 (%d,%d)-(%d,%d)  全是透明' % (x0, y0, x1, y1))
        return
    print(u'块 (%d,%d)-(%d,%d)  %d px' % (x0, y0, x1, y1, n))
    print(u'  均值 #%02x%02x%02x  (%d,%d,%d)'
          % (int(rs / n), int(gs / n), int(bs / n), int(rs / n), int(gs / n), int(bs / n)))
    for p, k in sorted(cnt.items(), key=lambda kv: -kv[1])[:8]:
        print(u'  #%02x%02x%02x  %4d  %5.1f%%   (%3d,%3d,%3d)'
              % (p[0], p[1], p[2], k, 100.0 * k / n, p[0], p[1], p[2]))


def runs(seq):
    out = []
    for i, (t, p) in enumerate(seq):
        if out and max(abs(p[k] - out[-1][2][k]) for k in range(3)) <= 10:
            out[-1][1] = t; out[-1][3] += 1
        else:
            out.append([t, t, p, 1])
    return [r for r in out if r[1] - r[0] + 1 >= MINRUN]


def main():
    a = sys.argv[1:]
    if not a:
        print(__doc__)
        return
    mode = a[0]
    print(u'图片 %dx%d  %s' % (W, H, os.path.basename(SRC)))

    if mode == 'frame':
        print(u'--- 每 12 行的 左/右/计数 ---')
        for y in range(0, H, 12):
            lo, hi, n = span(y)
            if n:
                print(u'%5d  lo=%-5s hi=%-5s n=%-6d' % (y, lo, hi, n))
        print(u'--- 每 24 列的 上/下/计数 ---')
        for x in range(0, W, 24):
            top, bot, n = None, None, 0
            for y in range(H):
                if not is_bg(PX[x, y]):
                    n += 1
                    if top is None:
                        top = y
                    bot = y
            print(u'%5d  top=%-5s bot=%-5s n=%-6d' % (x, top, bot, n))
    elif mode == 'bands':
        y0 = int(a[1]) if len(a) > 1 else 0
        y1 = int(a[2]) if len(a) > 2 else H
        for y in range(y0, y1, 10):
            out = []
            for x0 in range(0, W, 112):
                rs = gs = bs = c = 0
                for x in range(x0, min(x0 + 112, W), 4):
                    p = PX[x, y]
                    if is_bg(p):
                        continue
                    rs += p[0]; gs += p[1]; bs += p[2]; c += 1
                out.append(u'  ....' if not c else u'%3d,%3d,%3d' % (rs / c, gs / c, bs / c))
            print(u'%5d | %s' % (y, ' | '.join(out)))
    elif mode == 'box':
        box(*[int(v) for v in a[1:5]])
    elif mode == 'col':
        x, y0, y1 = int(a[1]), int(a[2]), int(a[3])
        for t, t2, p, n in runs([(y, PX[x, y][:3]) for y in range(y0, y1)]):
            print(u'  y %5d..%5d  (%3d)  #%02x%02x%02x  %s'
                  % (t, t2, t2 - t + 1, p[0], p[1], p[2], p))
    elif mode == 'row':
        y, x0, x1 = int(a[1]), int(a[2]), int(a[3])
        for t, t2, p, n in runs([(x, PX[x, y][:3]) for x in range(x0, x1)]):
            print(u'  x %5d..%5d  (%3d)  #%02x%02x%02x  %s'
                  % (t, t2, t2 - t + 1, p[0], p[1], p[2], p))
    elif mode == 'crop':
        x0, y0, x1, y1, S = [int(v) for v in a[1:6]]
        c = im.crop((x0, y0, x1, y1))
        bg = Image.new('RGB', c.size, (60, 60, 70))
        bg.paste(c, (0, 0), c)
        bg = bg.resize((c.width * S, c.height * S), Image.NEAREST)
        bg.save(a[6])
        print(u'已出图: %s  (%dx%d -> %dx%d)' % (a[6], x1 - x0, y1 - y0, bg.width, bg.height))
    else:
        print(__doc__)


main()
