# -*- coding: utf-8 -*-
"""逸夫楼改前 / 改后**逐像素**对照（一次性诊断，不是常驻工具）。

为什么不能靠眼睛：本轮三处改动（换字图 / 缩到一半 / 清掉竖牌那一列的窗）里，
"清掉一列窗" 在 714×468 的精灵上只是 **8×15 像素 × 6 层** 那么小，
2× 图里夹在满屏窗阵中间根本看不出来 —— 而它恰恰是用户这次提的三件事之一。

做法：把（上一版交付件）当旧版、把（刚 build 出来的产物）当新版，
用同一个 `_bldview.py` 的出图口径各渲一张 1× 精灵，再做像素差，
把差异**按连通块**列出来（左边 = 旧，右边 = 新），逐块对照预期：
  ① 竖牌那 5 个字的框（尺寸减半 ⇒ 框变小）
  ② 竖牌那一列（整列通高留空 ⇒ 6 个 8×15 窗口消失）
  **不该有第三类** —— 多出任何一块都说明碰了别的东西。
"""
import io, os, shutil, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(HERE)
SRC = os.path.join(PROJ, '像素校园_全校地图.html')                    # _bldview.py 读的就是这个
OLD = os.path.join(os.path.dirname(PROJ), '像素校园_全校地图.html')   # 上一版交付件（在**工程根**）
LOOK = os.path.join(HERE, '_look')

from PIL import Image

bak = os.path.join(LOOK, '_new_deliverable.html')
shutil.copyfile(SRC, bak)
try:
    shutil.copyfile(OLD, SRC)
    r = subprocess.run([sys.executable, os.path.join(HERE, '_bldview.py'),
                        '714,468', '1', os.path.join(LOOK, 'yf_old_1x.png')],
                       capture_output=True, cwd=HERE)
    print('  旧版渲染:', r.stdout.decode('utf-8', 'replace').strip()[-80:])
finally:
    shutil.copyfile(bak, SRC)

r = subprocess.run([sys.executable, os.path.join(HERE, '_bldview.py'),
                    '714,468', '1', os.path.join(LOOK, 'yf_new_1x.png')],
                   capture_output=True, cwd=HERE)
print('  新版渲染:', r.stdout.decode('utf-8', 'replace').strip()[-80:])

a = Image.open(os.path.join(LOOK, 'yf_old_1x.png')).convert('RGB')
b = Image.open(os.path.join(LOOK, 'yf_new_1x.png')).convert('RGB')
print('  旧 %s  新 %s' % (a.size, b.size))
assert a.size == b.size, '两张精灵尺寸不同，先查 _bldview 的口径'

pa, pb = a.load(), b.load()
W, H = a.size
diff = set()
for y in range(H):
    for x in range(W):
        if pa[x, y] != pb[x, y]:
            diff.add((x, y))
print('  差异像素 %d（占 %.3f%%）' % (len(diff), 100.0 * len(diff) / (W * H)))

# 连通块（4 邻接）
seen = set()
blocks = []
for p in diff:
    if p in seen:
        continue
    stack = [p]
    seen.add(p)
    comp = []
    while stack:
        q = stack.pop()
        comp.append(q)
        for d in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            n = (q[0] + d[0], q[1] + d[1])
            if n in diff and n not in seen:
                seen.add(n)
                stack.append(n)
    xs = [c[0] for c in comp]
    ys = [c[1] for c in comp]
    blocks.append((min(xs), min(ys), max(xs), max(ys), len(comp)))
blocks.sort(key=lambda t: -t[4])
print('  连通块 %d 个，按面积降序：' % len(blocks))
for x0, y0, x1, y1, n in blocks[:40]:
    print('    x %3d..%3d  y %3d..%3d  (%dx%d, %d px)' % (
        x0, x1, y0, y1, x1 - x0 + 1, y1 - y0 + 1, n))

# 出对照图：上旧下新
c = Image.new('RGB', (W, H * 2 + 2), (0, 0, 0))
c.paste(a, (0, 0))
c.paste(b, (0, H + 2))
c.save(os.path.join(LOOK, 'yf_ab_1x.png'))
print('  对照图 _look/yf_ab_1x.png')
