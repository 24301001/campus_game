# -*- coding: utf-8 -*-
"""图书馆门头「圖書館」三字 → 1bit 点阵（供 parts/36_library.js 用）。

用法：
    python _libfont.py probe     —— 出阈值/字高对比表（_libprobe.png / _libprobe.txt），不写零件
    python _libfont.py           —— 正式生成并拼接进 parts/36_library.js 的生成块

字形来源：**用户从照片里提炼出来的 `_photo/tushuguanfont.png`**
  （3552×1184，白底金字，右下角一枚浅灰"豆包AI生成"水印，另有一层极淡的斜向水印纹理）。

⚠️ 阈值轴与 `_mhfont.py` **不同** —— 这是本文件唯一需要动脑的地方：
   `minghufont.png` 是**黑字白底**，`INK=110` 灰阶一刀切；
   这份是**金字白底**，灰阶切不开（金色受光面亮度 200+，比背景还亮，一刀切下去
   字会碎成"只有暗部"的残影）。实测：背景 sat 中位数 = 0、p75 = 2，
   金色 sat 中位数 116 ⇒ **按饱和度（max-min）切**，背景被整片清掉，
   连那层水印纹理和水印字一起（它们都是中性的）。sat>=50 时列投影恰好切出 3 块。
"""
import io, os, sys, base64
from PIL import Image
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
TGT = os.path.join(HERE, 'parts', '36_library.js')
SRC = os.path.join(HERE, '_photo', 'tushuguanfont.png')

NAME = [u'圖', u'書', u'館']
ID = ['TU', 'SHU', 'GUAN']
THS = [20, 20, 20]                  # 逐字目标字高（世界像素）
COV = 0.38                          # 覆盖率阈值（对比表见 _libprobe.png）
SAT = 45                            # 金/纸 二值化阈值：max(R,G,B)-min(R,G,B)
MINRUN = 20                         # 列投影里短于这个宽度的块当噪声丢掉


# ==================== 从提炼件取字 ====================
def load_glyphs(sat=None):
    """→ [np.bool_ 数组, ...]，逐字按 bbox 裁紧。字形靠列投影的空隙自动切开。"""
    a = np.array(Image.open(SRC).convert('RGB')).astype(np.int16)
    m = (a.max(axis=2) - a.min(axis=2)) >= (SAT if sat is None else sat)
    cols = m.sum(axis=0) > 0
    runs, start = [], None
    for i, v in enumerate(cols):
        if v and start is None:
            start = i
        if not v and start is not None:
            runs.append((start, i - 1))
            start = None
    if start is not None:
        runs.append((start, len(cols) - 1))
    wide = [r for r in runs if r[1] - r[0] + 1 >= MINRUN]
    assert len(wide) == 3, ('列投影切出 %d 块（应为 3）—— 阈值或图变了？原始块 %s'
                            % (len(wide), runs))
    out = []
    for x0, x1 in wide:
        sub = m[:, x0:x1 + 1]
        rr = np.where(sub.sum(axis=1) > 0)[0]
        out.append(sub[rr.min():rr.max() + 1, :])
    assert len(out) == len(NAME)
    return out


def down(m, th, cov):
    """面积平均降采样 → 1bit。宽按原字长宽比出格（不强行拉方）。"""
    bh, bw = m.shape
    tw = max(2, int(round(th * bw / float(bh))))
    f = np.array(Image.fromarray(m.astype(np.uint8) * 255).resize((tw, th), Image.BOX),
                 dtype=np.float32) / 255.0
    return [[1 if f[y][x] >= cov else 0 for x in range(tw)] for y in range(th)]


def b64(m):
    """MSB 优先（与 49_southgate.js 的 sgBits / 55_gym.js 的 gyBits / 56 的 mhBits 同一约定）"""
    bits = [v for row in m for v in row]
    by = bytearray()
    for i in range(0, len(bits), 8):
        v = 0
        for j in range(8):
            v = (v << 1) | (bits[i + j] if i + j < len(bits) else 0)
        by.append(v)
    return base64.b64encode(bytes(by)).decode()


def tile(ms, bg=(0xa8, 0xa4, 0x9c), fg=(0xd8, 0xb2, 0x4a), gap=3):
    tw = sum(len(m[0]) for m in ms) + gap * (len(ms) - 1)
    hh = len(ms[0])
    t = Image.new('RGB', (tw, hh), bg)
    pp = t.load()
    x = 0
    for m in ms:
        for j in range(hh):
            for i in range(len(m[0])):
                if m[j][i]:
                    pp[x + i, j] = fg
        x += len(m[0]) + gap
    return t


def sheet(rows, Z=6):
    W = max(t.width for _, t in rows)
    s = Image.new('RGB', (W, sum(t.height + 6 for _, t in rows)), (0x60, 0x5c, 0x56))
    y = 0
    for _, t in rows:
        s.paste(t, (0, y))
        y += t.height + 6
    return s.resize((s.width * Z, s.height * Z), Image.NEAREST)


def dump(m):
    return ['    ' + ''.join('#' if v else '.' for v in r) for r in m]


# ============================ probe ============================
if len(sys.argv) > 1 and sys.argv[1] == 'probe':
    lines = ['源：_photo/tushuguanfont.png（用户提炼件，白底金字）',
             '阈值轴 = 饱和度 (max-min) >= %d' % SAT, '']
    rows = []
    for sat in (35, 45, 60):
        gl = load_glyphs(sat)
        lines.append('=== 饱和度阈值 %d：逐字原像素 %s ==='
                     % (sat, ' / '.join('%s %dx%d' % (NAME[i], g.shape[1], g.shape[0])
                                        for i, g in enumerate(gl))))
        for cov in (0.34, 0.42, 0.50):
            for th in (16, 18, 20, 22):
                ms = [down(g, th, cov) for g in gl]
                lines.append('--- sat %d / 字高 %d / 阈值 %.2f ---' % (sat, th, cov))
                for nm, m in zip(NAME, ms):
                    lines.append('  %s  %d x %d' % (nm, len(m[0]), len(m)))
                    lines.extend(dump(m))
                rows.append(('sat%d th%d cov%.2f' % (sat, th, cov), tile(ms)))
    sheet(rows).save(os.path.join(HERE, '_libprobe.png'))
    lines.append('')
    lines.append('_libprobe.png 每行 = 一个 (饱和度, 字高, 覆盖率) 组合，自左至右 圖 書 館。')
    lines.append('金色前景用 #d8b24a 画在灰底上，便于判断笔画是否糊。')
    io.open(os.path.join(HERE, '_libprobe.txt'), 'w', encoding='utf-8').write('\n'.join(lines))
    print('probe -> _libprobe.png / _libprobe.txt  (%d 行)' % len(rows))
    sys.stdout.flush()
    raise SystemExit(0)

# ============================ 正式生成 ============================
GL = load_glyphs()
MASKS = [down(g, th, COV) for g, th in zip(GL, THS)]
out = ['源 _photo/tushuguanfont.png  目标字高 %s  覆盖率 %.2f  饱和度 %d'
       % (THS, COV, SAT)]
for nm, m in zip(NAME, MASKS):
    assert m, '%s 渲染成空白' % nm
    out.append('--- %s  %d x %d ---' % (nm, len(m[0]), len(m)))
    out.extend(dump(m))

gen = ['/* ==== 由 _build/_libfont.py 生成，勿手改 ==== */',
       '/* 图书馆门头「圖書館」三字点阵 —— 源是用户从照片里提炼的 _photo/tushuguanfont.png',
       '   （白底金字，按**饱和度** max-min >= %d 切，不是灰阶；' % SAT,
       '   灰色水印与斜向水印纹理都是中性的，一并被切掉）。逐字高 %d/%d/%d。' % tuple(THS),
       '   ⚠️ 这里**故意不写坐标**：字宽随长宽比走，换一次源就要重算，',
       '      写死一份到生成块里必然和调用点对不上（_mhfont.py 上一版就是这么留了组错坐标）。',
       '      排布在调用点现算（见 §3.6 libPlaque()）。 */']
for i in range(3):
    gen.append('const LIB_MASK_%s = "%s";' % (ID[i], b64(MASKS[i])))
gen.append('/* [点阵, 宽, 高] —— 顺序：圖 書 館 */')
gen.append('const LIB_CHARS = [')
for i in range(3):
    gen.append('  [LIB_MASK_%s, %d, %d]%s'
               % (ID[i], len(MASKS[i][0]), THS[i], ',' if i < 2 else ''))
gen.append('];')
gen.append('/* ==== 生成块结束 ==== */')

txt = io.open(TGT, encoding='utf-8').read()
A, B = '/*__LIB_GEN_BEGIN__*/', '/*__LIB_GEN_END__*/'
assert A in txt and B in txt, '标记缺失: ' + TGT
head, rest = txt.split(A, 1)
_, tail = rest.split(B, 1)
io.open(TGT, 'w', encoding='utf-8', newline='\n').write(
    head + A + '\n' + '\n'.join(gen) + '\n' + B + tail)
io.open(os.path.join(HERE, '_libfont.txt'), 'w', encoding='utf-8').write('\n'.join(out))
print('spliced -> %s' % TGT)
print('ok  ' + ' '.join('%s %dx%d' % (NAME[i], len(MASKS[i][0]), THS[i]) for i in range(3)))
sys.stdout.flush()
