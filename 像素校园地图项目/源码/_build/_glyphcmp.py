# -*- coding: utf-8 -*-
"""三款系统毛笔字在 24x24 下的可读性并排对比（照片上的金字是粗的毛笔字）。
左=华文行楷 / 中=新魏 / 右=华文楷体。挑清楚的那款做「交通大学」四字点阵。"""
import os, io
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
N, SS = 24, 8
FS = [(u'行楷', r'C:\Windows\Fonts\STXINGKA.TTF'),
      (u'新魏', r'C:\Windows\Fonts\STXINWEI.TTF'),
      (u'楷体', r'C:\Windows\Fonts\STKAITI.TTF')]


def render(c, path):
    im = Image.new('L', (N * SS, N * SS), 0)
    f = ImageFont.truetype(path, int(N * SS * 0.97))
    ImageDraw.Draw(im).text((N * SS / 2, N * SS / 2), c, font=f, fill=255, anchor='mm')
    q = im.resize((N, N), Image.LANCZOS).load()
    return [[1 if q[x, y] > 102 else 0 for x in range(N)] for y in range(N)]


out = ['N=%d  ' % N + '   '.join(n for n, _ in FS)]
for c in u'交通大学':
    ms = [render(c, p) for _, p in FS]
    out.append('=== %s ===' % c)
    for y in range(N):
        out.append('%s' % ' | '.join(''.join('#' if v else '.' for v in m[y]) for m in ms))
io.open(os.path.join(HERE, '_glyphcmp.txt'), 'w', encoding='utf-8').write('\n'.join(out))
print('ok')
