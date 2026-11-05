# -*- coding: utf-8 -*-
"""把 字体.png 的「交通大学」四字 + 校徽 描成点阵（**还原真实校名毛笔字**）。

三条关键做法（前两条各栽过一次）：
 1) 掩膜用 **RGBA 的 alpha 通道**，不是 convert('L')：透明底过 L 之后是黑的，
    会被当成满纸墨。
 2) 降采样判据是"这一格里墨的**覆盖率** ≥ COV"，不是平均亮度：笔画在 26px 下
    只有 1~2px，平均一下细笔整根被抹平 → 字碎成散点；纯 max 又把笔画胀粗。
    COV=0.22 等价于"细笔只要穿格就留"，顺带把孤立噪点滤掉。
 3) **长宽比必须保住**：最早按 max(w,h) 补成方框再降采样，交(31x42)被压成
    19 宽 —— 毛笔字本来就瘦，再横向压一道就认不出了。现在每字按自己的
    bbox 长宽比出格（高固定 CH_H），运行时按 w/h 分别反算。

产物：
  _glyphs.txt      —— 点阵 ASCII 预览
  _glyphs.gen.txt  —— 贴进 parts/49_southgate.js 的生成块（含颜色与几何）
"""
import os, io, sys, base64
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
PH = os.path.join(HERE, '_photo')
CH_H = 28              # 每字**高度**（世界像素）；宽按 bbox 长宽比推
EMN = 38               # 校徽边长（照片实测：直径 ≈ 2.0×拱带厚 ⇒ 38）

# 四个字的 φ（与 x 轴夹角，度，y 朝上，拱顶是 90°）。顺序 = SG_CHARS 顺序：交 通 大 学。
# 照片按拱心归算后大约落在 133 / 108 / 72 / 48，但**不能照抄**：那是在一张没
# 正对拍的照片上量的（近侧被压），而且照抄会让「通」「大」正好压到校徽上。
# 这里取 90°±47 / 90°±27 —— 间隔与照片同量级，且留出校徽那 38px 圆的净空。
PHI = [137.0, 117.0, 63.0, 43.0]

img = Image.open(os.path.join(PH, 'font.png'))
rgba = img.convert('RGBA')
W, H = rgba.size
lum = img.convert('L').load()
ap = rgba.load()
WR = (0, 58)                                    # 校名所在行带


def ink(x, y):
    return 1.0 if (0 <= x < W and 0 <= y < H and ap[x, y][3] > 128 and lum[x, y] < 190) else 0.0


# ---- 1) 列投影极小值切 6 个字 ----
cp = [sum(ink(x, y) for y in range(*WR)) for x in range(W)]
xs = [x for x in range(W) if cp[x] > 0]
x0, x1 = xs[0], xs[-1]


def cut_at(c, lo, hi):
    """在 [lo,hi] 里挑一条"缝"当切点，判据 = **离理论位置 c 最近的零墨游程**。

    ⚠️ 不能用"取列投影最小的一列"（原版）：行书里一个字**自己内部**也会有零墨的缝，
       而两字之间的缝未必更宽、更黑。「北」在 x88..134 分成 丬(88..114)+匕(119..134)
       两组，内部那条缝(115..118)比它与「京」之间那条(135..137)还宽 —— 按"最宽"或
       "最黑"都会从「北」中间切下去，切出来的「北」只剩半个、「京」多出一笔。
       等分后的理论位置落在这两条缝之间，取**离它最近**的那条才稳。"""
    runs = []
    x = lo
    while x <= hi:
        if cp[x] == 0:
            a = x
            while x + 1 <= hi and cp[x + 1] == 0:
                x += 1
            runs.append((a, x))
        x += 1
    if not runs:
        return min(range(lo, hi + 1), key=lambda t: cp[t])
    a, b = min(runs, key=lambda r: abs((r[0] + r[1]) / 2.0 - c))
    return (a + b) // 2


cuts = [x0]
for k in range(1, 6):                           # 5 个切点：理论位置附近找缝
    c = int(x0 + (x1 - x0 + 1) * k / 6.0)
    cuts.append(cut_at(c, max(x0 + 1, c - 12), min(x1 - 1, c + 12)))
cuts.append(x1 + 1)
out = ['校名 x %d..%d  切点 %s' % (x0, x1, cuts)]
wins = list(zip(cuts[:-1], cuts[1:]))


def bbox_of(win, y0, y1):
    a, b = win
    bx0, by0, bx1, by1 = 10 ** 9, 10 ** 9, -1, -1
    for x in range(a, b):
        for y in range(y0, y1):
            if ink(x, y):
                bx0 = min(bx0, x); bx1 = max(bx1, x); by0 = min(by0, y); by1 = max(by1, y)
    return bx0, by0, bx1, by1


def trace(win, nw, nh, y0, y1, clean=False, box=None):
    """窗口内的墨 → 覆盖率降采样成 nw×nh。

    ⚠️ 采样区域就是 **bbox 本身**（不是"以 bbox 中心扩成正方形"）：后者会让
    nw≠nh 时横向和纵向的格宽不等，字被横向压扁（交 31x42 会被压成 19 宽）。
    取 bbox 时 格宽 = bw/nw = bh/nh = 格高 ⇒ 长宽比天然保住。
    clean=True 再删一次小块连通域，去掉邻字扫进来的笔尾。"""
    a, b = win
    if box is None:
        box = bbox_of(win, y0, y1)
    bx0, by0, bx1, by1 = box
    bw, bh = bx1 - bx0 + 1, by1 - by0 + 1
    SS, COV = 6, 0.22
    m = [[0] * nw for _ in range(nh)]
    for ty in range(nh):
        for tx in range(nw):
            hit = 0
            for sy in range(SS):
                for sx in range(SS):
                    px_ = int(bx0 + (tx + (sx + 0.5) / SS) * bw / nw)
                    py_ = int(by0 + (ty + (sy + 0.5) / SS) * bh / nh)
                    if a <= px_ < b and y0 <= py_ < y1 and ink(px_, py_):
                        hit += 1
            m[ty][tx] = 1 if hit >= COV * SS * SS else 0
    if clean:
        m = drop_specks(m)
    return m, (bx0, by0, bx1, by1, bw, bh)


def drop_specks(m, keep=12):
    """删掉小于 keep 像素的连通域（4 邻接）——只删得起噪的碎渣与串进来的笔尾。"""
    nh, nw = len(m), len(m[0])
    seen = [[0] * nw for _ in range(nh)]
    for sy in range(nh):
        for sx in range(nw):
            if not m[sy][sx] or seen[sy][sx]:
                continue
            st, comp = [(sx, sy)], []
            seen[sy][sx] = 1
            while st:
                x, y = st.pop()
                comp.append((x, y))
                for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    xx, yy = x + dx, y + dy
                    if 0 <= xx < nw and 0 <= yy < nh and m[yy][xx] and not seen[yy][xx]:
                        seen[yy][xx] = 1
                        st.append((xx, yy))
            if len(comp) < keep:
                for x, y in comp:
                    m[y][x] = 0
    return m


# 六个字全描（2026-09-13 起）：南门红拱只用得到后四个「交通大学」，
# 而南门校名石那面红石板是**六字一行「北京交通大学」**，所以「北」「京」也一起描出来。
# 两处同一个字必须逐像素一致（用户："字体其实就是那个font照片里的字体"）—— 同一份
# MASKS、同一个 CH_H，碑那边只是**不旋转、排成一行**，不做第二次描点。
MASKS, GEO = {}, []
for i, name in enumerate(u'北京交通大学'):
    bb = bbox_of(wins[i], 0, 58)
    bw, bh = bb[2] - bb[0] + 1, bb[3] - bb[1] + 1
    nw = max(6, int(round(CH_H * bw / float(bh))))      # 保住真实长宽比
    MASKS[name], bo = trace(wins[i], nw, CH_H, 0, 58, clean=True, box=bb)
    GEO.append((nw, CH_H))
    out.append('字 %s 窗[%d..%d] bbox=(%d,%d,%d,%d) %dx%d → 格 %dx%d'
               % (name, wins[i][0], wins[i][1], bb[0], bb[1], bb[2], bb[3], bw, bh, nw, CH_H))

# ---- 2) 校徽 ----
# ⚠️ 不能用「y >= 某行」来切：校名的下摆垂到 y68，任何行切法要么切掉徽顶、要么把
#    邻字笔尾算进来。改用**连通域**：取 y>55 的最大连通块（= 徽的那个圆）的 bbox。
def components(y0):
    seen = [[0] * W for _ in range(H)]        # ⚠️ [y][x]，写反了越界
    best = None
    for sy in range(y0, H):
        for sx in range(W):
            if seen[sy][sx] or not ink(sx, sy):
                continue
            st, pts = [(sx, sy)], []
            seen[sy][sx] = 1
            while st:
                x, y = st.pop()
                pts.append((x, y))
                for dx in (-1, 0, 1):
                    for dy in (-1, 0, 1):
                        xx, yy = x + dx, y + dy
                        if 0 <= xx < W and y0 <= yy < H and not seen[yy][xx] and ink(xx, yy):
                            seen[yy][xx] = 1
                            st.append((xx, yy))
            if best is None or len(pts) > len(best):
                best = pts
    xs_ = [q[0] for q in best]; ys_ = [q[1] for q in best]
    return min(xs_), min(ys_), max(xs_), max(ys_), len(best)


eb = components(55)
out.append('校徽连通块 bbox=(%d,%d,%d,%d) n=%d  %dx%d'
           % (eb[:4] + (eb[4], eb[2] - eb[0] + 1, eb[3] - eb[1] + 1)))
EM, ebox = trace((eb[0], eb[2] + 1), EMN, EMN, eb[1], eb[3] + 1)
out.append('校徽方框=%s' % (ebox,))


def art(m, title):
    out.append('--- %s ---' % title)
    for row in m:
        out.append(''.join('#' if v else '.' for v in row))


for name in u'北京交通大学':
    art(MASKS[name], name)
art(EM, u'校徽 %dx%d' % (EMN, EMN))

# ---- 3) 照片里的真实颜色 ----
ph = Image.open(os.path.join(PH, 'gate.jpg')).convert('RGB')
pp = ph.load()
buckets = {u'金字': [], u'徽蓝': [], u'拱红': []}
for y in range(690, 880):
    for x in range(300, 780):
        r, g, b = pp[x, y]
        if r > 120 and g > 95 and r >= b + 45 and r >= g + 8 and g >= b + 5:
            buckets[u'金字'].append((r, g, b))
for y in range(660, 780):
    for x in range(480, 620):
        r, g, b = pp[x, y]
        if b > 70 and b >= r + 25 and b >= g + 12:
            buckets[u'徽蓝'].append((r, g, b))
for y in range(1100, 1500):
    for x in range(240, 300):
        r, g, b = pp[x, y]
        if r >= 55 and r >= g + 16 and r >= b + 10 and g <= 120:
            buckets[u'拱红'].append((r, g, b))
COL = {}
for tag, pts in buckets.items():
    pts.sort()
    COL[tag] = pts[len(pts) // 2]
    out.append('%s n=%d 中位色=%s' % (tag, len(pts), '#%02x%02x%02x' % COL[tag]))


def b64(m):
    bits = [v for row in m for v in row]
    by = bytearray()
    for i in range(0, len(bits), 8):
        v = 0
        for k in range(8):
            v = (v << 1) | (bits[i + k] if i + k < len(bits) else 0)
        by.append(v)
    return base64.b64encode(bytes(by)).decode()


NAME = {u'北': 'BEI', u'京': 'JING', u'交': 'JIAO', u'通': 'TONG', u'大': 'DA', u'学': 'XUE'}   # 标识符用 ASCII
gen = ['/* ==== 由 _build/_glyphs.py 生成，勿手改（源：建筑物照片/字体.png + 南门.jpg）==== */',
       'const SG_EMN = %d;' % EMN,
       'const SG_GOLD = "#%02x%02x%02x", SG_EMBLUE = "#%02x%02x%02x", SG_RED = "#%02x%02x%02x";'
       % (COL[u'金字'] + COL[u'徽蓝'] + COL[u'拱红'])]
for name in u'北京交通大学':
    gen.append('const SG_MASK_%s = "%s";' % (NAME[name], b64(MASKS[name])))
gen.append('const SG_MASK_EM = "%s";' % b64(EM))
gen.append('/* 四个金字：[点阵, φ(度), 宽, 高] —— 宽高逐字不同是**故意的**（见文件头 3），')
gen.append('   压成方字会把毛笔字横向压扁到认不出。φ 以拱心为原点、y 朝上，拱顶 90°。 */')
gen.append('const SG_CHARS = [')
for i, name in enumerate(u'交通大学'):
    gen.append('  [SG_MASK_%s, %s, %d, %d]%s'
               % (NAME[name], PHI[i], GEO[i + 2][0], GEO[i + 2][1], ',' if i < 3 else ''))
gen.append('];')
gen.append('/* 南门校名石（§5.4）的六字一行：[点阵, 宽, 高]，**不旋转**。')
gen.append('   与上面四个金字同源同高（%dpx），所以「交 通 大 学」四点阵与拱上是同一串字节。 */' % CH_H)
gen.append('const SG_ROW6 = [')
for i, name in enumerate(u'北京交通大学'):
    gen.append('  [SG_MASK_%s, %d, %d]%s' % (NAME[name], GEO[i][0], GEO[i][1], ',' if i < 5 else ''))
gen.append('];')
gen.append('/* ==== 生成块结束 ==== */')
BLOCK = '\n'.join(gen)

# 若给了目标 part 文件，就把生成块**替换**进两个标记之间（免手工复制出错）
if len(sys.argv) > 1:
    tgt = sys.argv[1]
    txt = io.open(tgt, encoding='utf-8').read()
    A, B = '/*__SG_GEN_BEGIN__*/', '/*__SG_GEN_END__*/'
    assert A in txt and B in txt, '标记缺失: ' + tgt
    head, rest = txt.split(A, 1)
    _, tail = rest.split(B, 1)
    io.open(tgt, 'w', encoding='utf-8').write(head + A + '\n' + BLOCK + '\n' + B + tail)
    print('spliced ->', tgt)

io.open(os.path.join(HERE, '_glyphs.txt'), 'w', encoding='utf-8').write('\n'.join(out))
io.open(os.path.join(HERE, '_glyphs.gen.txt'), 'w', encoding='utf-8').write(BLOCK + '\n')
print('ok  CH_H=%d EMN=%d  gold=%s blue=%s red=%s'
      % (CH_H, EMN, '#%02x%02x%02x' % COL[u'金字'], '#%02x%02x%02x' % COL[u'徽蓝'], '#%02x%02x%02x' % COL[u'拱红']))
