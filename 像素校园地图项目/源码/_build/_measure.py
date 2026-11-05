# -*- coding: utf-8 -*-
"""把南门照片读成**数字**：红拱的逐行轮廓 + 金字/校徽的位置。

⚠️ 第一版把红判据写严了（r-b>32），结果照片里的暗红拱（实测 (86,53,60)：r-b=26）
   大半被漏掉，输出成了一堆 7~25px 的碎片。拱是**暗紫红**，判据要往暗里放：
   只要 r 明显大于 g、b 且整体偏暗就算，同时排掉亮白（天空）与绿（树叶）。

输出写文本文件（控制台是 GBK，中文会花）。"""
import os, io
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
P = os.path.join(HERE, '_photo')
im = Image.open(os.path.join(P, 'gate.jpg')).convert('RGB')
W, H = im.size
px = im.load()
out = ['image %dx%d' % (W, H)]


def is_red(c):
    r, g, b = c
    return r >= 55 and r >= g + 16 and r >= b + 10 and g <= 120 and not (r > 165 and g > 150)


def is_gold(c):
    r, g, b = c
    return r > 130 and g > 100 and r >= b + 45 and r >= g + 8 and g >= b + 10


def is_blue(c):
    r, g, b = c
    return b > 75 and b >= r + 30 and b >= g + 18


Y0, Y1 = 600, 1900
X0, X1 = 60, 1060
rows = []
for y in range(Y0, Y1):
    runs, x = [], X0
    while x < X1:
        if is_red(px[x, y]):
            s = x
            while x < X1 and is_red(px[x, y]):
                x += 1
            if x - s >= 5: runs.append((s, x - 1))
        else:
            x += 1
    if runs: rows.append((y, runs))

out.append('--- red rows %d: y=%d..%d ---' % (len(rows), rows[0][0], rows[-1][0]))
for y, runs in rows:
    if (y - rows[0][0]) % 25 == 0:
        out.append('y=%4d n=%d %s' % (y, len(runs), ' '.join('[%d..%d w%d]' % (a, b, b - a + 1) for a, b in runs[:8])))

L = min(r[0][0] for _, r in rows); R = max(r[-1][1] for _, r in rows)
out.append('red x extent: %d..%d (outer width %d)' % (L, R, R - L + 1))
out.append('apex row (first red) = %d' % rows[0][0])
two = [y for y, r in rows if len(r) >= 2]
out.append('first row with a gap (内开口开始) = %s' % (min(two) if two else None))
# 每行的"内开口"= 最左右两段之间的空隙
out.append('--- 内开口（每 25 行）---')
for y, runs in rows:
    if (y - rows[0][0]) % 25 or len(runs) < 2: continue
    out.append('y=%4d outer[%d..%d] gap %d..%d (w%d)' % (y, runs[0][0], runs[-1][1], runs[0][1] + 1, runs[-1][0] - 1, runs[-1][0] - runs[0][1] - 1))

out.append('--- colours ---')
PTS = [('arch red左柱', 250, 1300), ('arch red 拱腰', 300, 850), ('arch red 拱顶左', 420, 760),
       ('trim 外缘', 232, 900), ('trim 内缘', 288, 900), ('stone 左墙', 90, 1500),
       ('stone 右墙', 900, 1400), ('gold 字', 300, 790), ('emblem 蓝', 530, 640),
       ('emblem 金心', 540, 660)]
for n, x, y in PTS:
    out.append('%s (%d,%d) = %s' % (n, x, y, px[x, y]))

for tag, fn, y0, y1, x0, x1 in [('gold左', is_gold, 640, 900, 200, 520), ('gold右', is_gold, 640, 900, 560, 900),
                                ('blue徽', is_blue, 560, 760, 420, 700)]:
    xs, ys, n = [], [], 0
    for y in range(y0, y1):
        for x in range(x0, x1):
            if fn(px[x, y]): xs.append(x); ys.append(y); n += 1
    out.append('%s bbox=%s n=%d' % (tag, (min(xs), min(ys), max(xs), max(ys)) if n else None, n))

io.open(os.path.join(HERE, '_measure.txt'), 'w', encoding='utf-8').write('\n'.join(out))
print('rows', len(rows), 'x', L, R)
