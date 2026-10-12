# -*- coding: utf-8 -*-
"""把 字体.png 的「北京交通大学」**六个**毛笔字描成点阵（思源楼红色题字用）。

与 _glyphs.py 同源同法（见那边文件头三条坑：alpha 当墨迹 / 覆盖率降采样 / bbox 采样
保长宽比），差别只有两点：

 1) 取**全部六个**窗口（北 京 交 通 大 学）—— _glyphs.py 只用了后四个（南门拱带）。
 2) 六字**共用一把比例尺** k，逐字保留照片里的 bbox 尺寸与相对位置（dx / dy）。
    毛笔字的字距、高低错落是书写的一部分，逐字归一到同一高度会把这层信息抹掉。
    同时照片里「大」「学」的甩笔比别的字长得多，统一缩放才能保住这个特征。

⚠️ 校徽必须**先整块摘掉**再切字：这张图只有 400×180，校徽是个大圆盘，
   横跨中间四字（京 交 通 大）的列，且它的顶弧与名字的下摆**在行上连成一片**
   —— 按"空行"切名字带会连校徽一起吞进来（第一版就栽在这：BH=176 而非 61，
   k 被压到 0.18，六字全糊成 5×9 的点）。
   所以改成按**8 邻接连通域**取最大的一块（= 校徽圆盘）直接抹掉，再走原本的
   「列投影切字 → bbox 采样」两步。擦除后的行剖面才有真正的空行可供切带。

不写死行号 —— 写死的话「大」那一笔甩到哪一行就得跟着改。

产物：
  _syfont.txt          —— 六字点阵 ASCII 预览 + 全部中间量（UTF-8，供 Read 查看）
把生成块写进 parts/51_siyuan_top.js 的 /*__SY_GEN_BEGIN__*/ … /*__SY_GEN_END__*/ 之间。
"""
import io, os, sys, base64
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
PH = os.path.join(HERE, '_photo')
TGT = os.path.join(HERE, 'parts', '51_siyuan_top.js')

SY_CH = int(sys.argv[1]) if len(sys.argv) > 1 else 32   # 六字里**最高**那个字的高度（世界像素）
NAME = [u'北', u'京', u'交', u'通', u'大', u'学']
ID = ['BEI', 'JING', 'JIAO', 'TONG', 'DA', 'XUE']

img = Image.open(os.path.join(PH, 'font.png'))
rgba = img.convert('RGBA')
W, H = rgba.size
lum = img.convert('L').load()
ap = rgba.load()

out = ['font.png %dx%d  目标字高 SY_CH=%d' % (W, H, SY_CH)]


def ink(x, y):
    return 1.0 if (0 <= x < W and 0 <= y < H and ap[x, y][3] > 128 and lum[x, y] < 190) else 0.0


# ---- 0) 摘掉校徽：8 邻接连通域里最大的一块（圆盘），逐像素抹掉 ----
seen = [[0] * W for _ in range(H)]
COMP = []
for sy in range(H):
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
                    if 0 <= xx < W and 0 <= yy < H and not seen[yy][xx] and ink(xx, yy):
                        seen[yy][xx] = 1
                        st.append((xx, yy))
        COMP.append(pts)
COMP.sort(key=len, reverse=True)
out.append('连通域 %d 个，前 4 大：%s'
           % (len(COMP), ' / '.join('n=%d bbox=(%d,%d,%d,%d)'
              % (len(p), min(q[0] for q in p), min(q[1] for q in p),
                 max(q[0] for q in p), max(q[1] for q in p)) for p in COMP[:4])))
EMB = set(COMP[0])
out.append('校徽 = 最大连通域 n=%d，已抹除' % len(EMB))


def ink(x, y, _e=EMB):
    if (x, y) in _e:
        return 0.0
    return 1.0 if (0 <= x < W and 0 <= y < H and ap[x, y][3] > 128 and lum[x, y] < 190) else 0.0


# ---- 0.5) 名字带：首行有墨往下，遇 ≥4 行全空即止（校徽已摘，这里就是名字的下摆） ----
rp = [sum(ink(x, y) for x in range(W)) for y in range(H)]
ys = [y for y in range(H) if rp[y] > 0]
assert ys, '整张图没有墨？'
y0n = ys[0]
y1n = y0n
gap = 0
for y in range(y0n, H):
    if rp[y] > 0:
        y1n = y; gap = 0
    else:
        gap += 1
        if gap >= 4:
            break
WR = (y0n, y1n + 1)
out.append('名字带 y %d..%d（高 %d）' % (WR[0], WR[1] - 1, WR[1] - WR[0]))

# ---- 1) 列投影极小值切 6 个字（切法与 _glyphs.py 逐字相同） ----
cp = [sum(ink(x, y) for y in range(*WR)) for x in range(W)]
xs = [x for x in range(W) if cp[x] > 0]
x0, x1 = xs[0], xs[-1]
cuts = [x0]
for kk in range(1, 6):
    c = int(x0 + (x1 - x0 + 1) * kk / 6.0)
    lo, hi = max(x0 + 1, c - 9), min(x1 - 1, c + 9)
    cuts.append(min(range(lo, hi + 1), key=lambda x: cp[x]))
cuts.append(x1 + 1)
wins = list(zip(cuts[:-1], cuts[1:]))
out.append('校名 x %d..%d  切点 %s' % (x0, x1, cuts))


def bbox_of(win, y0, y1):
    a, b = win
    bx0, by0, bx1, by1 = 10 ** 9, 10 ** 9, -1, -1
    for x in range(a, b):
        for y in range(y0, y1):
            if ink(x, y):
                bx0 = min(bx0, x); bx1 = max(bx1, x); by0 = min(by0, y); by1 = max(by1, y)
    return bx0, by0, bx1, by1


def trace(win, nw, nh, y0, y1, clean=False, box=None):
    """窗口内的墨 → 覆盖率降采样成 nw×nh。采样区域就是 bbox 本身（保长宽比）。"""
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


BB = [bbox_of(wins[i], *WR) for i in range(6)]
for i in range(6):
    b = BB[i]
    out.append('  %s 窗[%d..%d] bbox=(%d,%d,%d,%d) %dx%d'
               % (NAME[i], wins[i][0], wins[i][1], b[0], b[1], b[2], b[3],
                  b[2] - b[0] + 1, b[3] - b[1] + 1))
assert all(b[2] > b[0] for b in BB), '有窗口没墨 → 切点漂了'

# ---- 2) 统一比例尺 k（六字并集高 → SY_CH），逐字出格 ----
BY0 = min(b[1] for b in BB)
BY1 = max(b[3] for b in BB)
BH = BY1 - BY0 + 1
k = SY_CH / float(BH)
BXL = BB[0][0]
TWD = int(round((BB[5][2] - BXL + 1) * k))
out.append('六字并集高 BH=%d → k=%.4f   整块 %d×%d' % (BH, k, TWD, SY_CH))

MASKS, GEO = [], []
for i in range(6):
    bx0, by0, bx1, by1 = BB[i]
    nw = max(5, int(round((bx1 - bx0 + 1) * k)))
    nh = max(5, int(round((by1 - by0 + 1) * k)))
    m, _ = trace(wins[i], nw, nh, *WR, clean=True, box=BB[i])
    dx = int(round((bx0 - BXL) * k))
    dy = int(round((by0 - BY0) * k))
    MASKS.append(m)
    GEO.append((nw, nh, dx, dy))
    out.append('  %s → 格 %dx%d  dx=%d dy=%d' % (NAME[i], nw, nh, dx, dy))

for i in range(6):
    out.append('--- %s (%dx%d) ---' % (NAME[i], GEO[i][0], GEO[i][1]))
    for row in MASKS[i]:
        out.append(''.join('#' if v else '.' for v in row))


def b64(m):
    bits = [v for row in m for v in row]
    by = bytearray()
    for i in range(0, len(bits), 8):
        v = 0
        for j in range(8):
            v = (v << 1) | (bits[i + j] if i + j < len(bits) else 0)
        by.append(v)
    return base64.b64encode(bytes(by)).decode()


gen = ['/* ==== 由 _build/_syfont.py 生成，勿手改（源：建筑物照片/字体.png）==== */',
       '/* 思源楼题字「北京交通大学」六字毛笔点阵：六字共用一把比例尺（k = SY_CH / 照片六字并集高），',
       '   逐字保留照片里的 bbox 尺寸与相对位置 dx/dy —— 字距与高低错落是书写本身的一部分。 */',
       'const SY_TW = %d;                       // 整块宽（世界像素）' % TWD]
for i in range(6):
    gen.append('const SY_MASK_%s = "%s";' % (ID[i], b64(MASKS[i])))
gen.append('/* [点阵, 宽, 高, dx, dy] —— dx 相对整块左缘，dy 相对整块顶' + ' */')
gen.append('const SY_CHARS = [')
for i in range(6):
    gen.append('  [SY_MASK_%s, %d, %d, %d, %d]%s'
               % (ID[i], GEO[i][0], GEO[i][1], GEO[i][2], GEO[i][3], ',' if i < 5 else ''))
gen.append('];')
gen.append('/* ==== 生成块结束 ==== */')
BLOCK = '\n'.join(gen)

txt = io.open(TGT, encoding='utf-8').read()
A, B = '/*__SY_GEN_BEGIN__*/', '/*__SY_GEN_END__*/'
assert A in txt and B in txt, '标记缺失: ' + TGT
head, rest = txt.split(A, 1)
_, tail = rest.split(B, 1)
io.open(TGT, 'w', encoding='utf-8').write(head + A + '\n' + BLOCK + '\n' + B + tail)

io.open(os.path.join(HERE, '_syfont.txt'), 'w', encoding='utf-8').write('\n'.join(out))
print('spliced -> %s' % TGT)
print('ok  SY_CH=%d BH=%d k=%.4f TWD=%d' % (SY_CH, BH, k, TWD))
