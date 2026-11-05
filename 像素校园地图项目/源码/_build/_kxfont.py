# -*- coding: utf-8 -*-
"""科学会堂檐口带「科學會堂」四字 → 1bit 点阵（供 parts/61_kxht.js 用）。

用法：
    python _kxfont.py probe     —— 出阈值/字高对比表（_kxprobe.png / _kxprobe.txt），不写零件
    python _kxfont.py           —— 正式生成并拼接进 parts/61_kxht.js 的生成块

字形来源：**用户给的 `预览/kexuehuitangfont.png`**
  （4096×960，金笔四字，底子是**烘焙进去的浅灰棋盘格**，另有一层极淡的斜向纹理）。

⚠️ 阈值轴与 `_libfont.py` **同轴**（不是 `_mhfont.py` 的灰阶）：
   灰底是中性色（sat≈0），金字 sat 上百 ⇒ **按饱和度 max-min >= SAT 切**，
   棋盘格与斜纹一并被整片清掉。实测 SAT=45 时列投影恰好切出 4 块
   `(285,699)(1259,1607)(2146,2586)(3226,3676)` —— 下面把这条写成**幂等断言**：
   换源图 / 改阈值只要切不出这 4 块就当场报错，不许悄悄少一个字。

与 `_libfont.py` 的三处差别（其余逐条同构，便于两处一起维护）：
  ① 源在 `预览/`（用户交付件目录）而不是 `_build/_photo/`；
  ② 字序 = 科學會堂（四字，不是三字）⇒ 生成块是 `KX_CHARS`、标记 `KX_GEN`；
  ③ probe 的衬底用**真实底**：檐口带色 `shade(PALETTE[2].roof,-0.34)` = `#664629`
     （不是 `_libfont.py` 那块中灰）—— 金字最终就画在这个深褐带上，
     在别的底色上判"糊不糊"是自欺。
"""
import io, os, sys, base64
from PIL import Image
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))          # …\源码\_build
PROJ = os.path.dirname(HERE)                               # …\源码
ROOT = os.path.dirname(PROJ)                               # …\像素校园地图项目
TGT = os.path.join(HERE, 'parts', '61_kxht.js')
SRC = os.path.join(ROOT, u'预览', 'kexuehuitangfont.png')

NAME = [u'科', u'學', u'會', u'堂']
ID = ['KE', 'XUE', 'HUI', 'TANG']
THS = [28, 28, 28, 28]              # 逐字目标字高（世界像素）= 檐口板 44 行的 64%
COV = 0.42                          # 覆盖率阈值（对比表见 _kxprobe.png 与 _kxcmp.png）
#   probe 定稿（2026-09-17）：sat45 / th28 / cov0.42 —— 0.34 笔画断（學的「子」散）、
#   0.50 笔画并（科的「禾」糊成一坨），0.42 四个字都还认得出来。
#   逐字宽 = 21 / 18 / 23 / 22（按各字长宽比现算，不拉方）；加 3 道 4px 缝 = 总宽 96。
#   ⚠️ 字高 28 是**算出来的**、不是挑出来的：檐口板高 44 行（正面图 1.3576 英寸 ×
#      宽锚 32.18 px/英寸）的 64% —— 61 段有一条字体闸按同一个 0.64 现算比对
#      （`KX_GLYPH_R`）。所以改 THS 必须同时改那一支，否则加载期就响警告。
SAT = 45                            # 金/灰 二值化阈值：max(R,G,B)-min(R,G,B)
MINRUN = 20                         # 列投影里短于这个宽度的块当噪声丢掉
RUNS = [(285, 699), (1259, 1607), (2146, 2586), (3226, 3676)]   # 幂等断言用
BG = (0x66, 0x46, 0x29)             # 檐口带真实底色 shade("#9a6a3e",-0.34)
FG = (0xf2, 0xde, 0x8e)             # 亮金（照片里受光的那一档）


# ==================== 从交付件取字 ====================
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
    assert len(wide) == 4, ('列投影切出 %d 块（应为 4）—— 阈值或图变了？原始块 %s'
                            % (len(wide), runs))
    if sat is None or sat == SAT:
        assert wide == RUNS, ('列投影块与 RUNS 不符 —— 换源图了？实测 %s' % (runs,))
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
    """MSB 优先（与 36 的 libBits / 49 的 sgBits / 55 的 gyBits 同一约定）"""
    bits = [v for row in m for v in row]
    by = bytearray()
    for i in range(0, len(bits), 8):
        v = 0
        for j in range(8):
            v = (v << 1) | (bits[i + j] if i + j < len(bits) else 0)
        by.append(v)
    return base64.b64encode(bytes(by)).decode()


def tile(ms, gap=3):
    tw = sum(len(m[0]) for m in ms) + gap * (len(ms) - 1)
    hh = len(ms[0])
    t = Image.new('RGB', (tw, hh), BG)
    pp = t.load()
    x = 0
    for m in ms:
        for j in range(hh):
            for i in range(len(m[0])):
                if m[j][i]:
                    pp[x + i, j] = FG
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


def brush(ms, gap=4, band=(0xce, 0xc3, 0xac)):
    """按**零件里那支三色笔**（下缘压暗 / 主金 / 上缘提亮）把点阵画在**檐口板的真实底色**
    上，横排成一条 —— 这才是"落进精灵之后看不看得清"的判据（`tile()` 那块深褐底是
    按旧口径画的，保留只为对照）。"""
    DARK, MAIN, LITE = (0x6d, 0x4f, 0x1a), (0xc4, 0x9a, 0x3c), (0xf2, 0xe3, 0xa8)
    Pad = 3
    tw = sum(len(m[0]) for m in ms) + gap * (len(ms) - 1) + Pad * 2
    hh = len(ms[0]) + Pad * 2
    t = Image.new('RGB', (tw, hh), band)
    pp = t.load()
    x = Pad
    for m in ms:
        for j in range(len(m)):
            for i in range(len(m[0])):
                if not m[j][i]:
                    continue
                col = LITE if j == 0 or not m[j - 1][i] else MAIN
                pp[x + i, Pad + j] = col
                if j + 1 < len(m) and not m[j + 1][i]:
                    pp[x + i, Pad + j + 1] = DARK        # 下缘压暗（浮雕的下沿）
        x += len(m[0]) + gap
    return t


def dump(m):
    return ['    ' + ''.join('#' if v else '.' for v in r) for r in m]


# ============================ probe ============================
if len(sys.argv) > 1 and sys.argv[1] == 'probe':
    lines = ['源：预览/kexuehuitangfont.png（用户交付件，金笔 + 浅灰棋盘底）',
             '阈值轴 = 饱和度 (max-min) >= %d   （灰底 sat≈0 ⇒ 整片清掉）' % SAT,
             '列投影块（幂等断言）= %s' % (RUNS,),
             '衬底 = 檐口带真实底色 #664629，金 #f2de8e', '']
    rows = []
    for sat in (35, 45, 60):
        gl = load_glyphs(sat)
        lines.append('=== 饱和度阈值 %d：逐字原像素 %s ==='
                     % (sat, ' / '.join('%s %dx%d' % (NAME[i], g.shape[1], g.shape[0])
                                        for i, g in enumerate(gl))))
        for cov in (0.34, 0.42, 0.50):
            for th in (26, 28, 30, 32):
                ms = [down(g, th, cov) for g in gl]
                lines.append('--- sat %d / 字高 %d / 阈值 %.2f ---' % (sat, th, cov))
                for nm, m in zip(NAME, ms):
                    lines.append('  %s  %d x %d' % (nm, len(m[0]), len(m)))
                    lines.extend(dump(m))
                rows.append(('sat%d th%d cov%.2f' % (sat, th, cov), tile(ms)))
    sheet(rows).save(os.path.join(HERE, '_kxprobe.png'))
    band = []
    for cov in (0.34, 0.42, 0.50):
        for th in (26, 28, 30, 32):
            ms = [down(g, th, cov) for g in load_glyphs(SAT)]
            band.append(brush(ms))
    bb = Image.new('RGB', (max(t.width for t in band), sum(t.height + 4 for t in band)),
                   (0x60, 0x5c, 0x56))
    yy = 0
    for t in band:
        bb.paste(t, (0, yy))
        yy += t.height + 4
    bb.resize((bb.width * 6, bb.height * 6), Image.NEAREST).save(
        os.path.join(HERE, '_kxprobe_band.png'))
    lines.append('')
    lines.append('_kxprobe.png 每行 = 一个 (饱和度, 字高, 覆盖率) 组合，自左至右 科學會堂。')
    lines.append('金色前景画在**檐口带的真实底色** #664629 上，判的就是最终观感。')
    io.open(os.path.join(HERE, '_kxprobe.txt'), 'w', encoding='utf-8').write('\n'.join(lines))
    print('probe -> _kxprobe.png / _kxprobe.txt  (%d 行)' % len(rows))
    sys.stdout.flush()
    raise SystemExit(0)

# ============================ 正式生成 ============================
GL = load_glyphs()          # 内部已把列投影块与 RUNS 逐字比过
MASKS = [down(g, th, COV) for g, th in zip(GL, THS)]
out = ['源 预览/kexuehuitangfont.png  目标字高 %s  覆盖率 %.2f  饱和度 %d'
       % (THS, COV, SAT)]
for nm, m in zip(NAME, MASKS):
    assert m, '%s 渲染成空白' % nm
    out.append('--- %s  %d x %d ---' % (nm, len(m[0]), len(m)))
    out.extend(dump(m))

gen = ['/* ==== 由 _build/_kxfont.py 生成，勿手改 ==== */',
       '/* 科学会堂檐口带「科學會堂」四字点阵 —— 源是用户给的 预览/kexuehuitangfont.png',
       '   （金笔 + **烘焙进去的浅灰棋盘底**；按**饱和度** max-min >= %d 切，不是灰阶，' % SAT,
       '   棋盘格与斜向纹理都是中性的，一并被切掉）。逐字高 %d/%d/%d/%d。' % tuple(THS),
       '   ⚠️ 这里**故意不写坐标**：字宽随各字长宽比走，换一次源就要重算，',
       '      写死一份必然和调用点对不上。排布在调用点现算（见 61 段的 kxPlaque()）。 */']
for i in range(4):
    gen.append('const KX_MASK_%s = "%s";' % (ID[i], b64(MASKS[i])))
gen.append('/* [点阵, 宽, 高] —— 顺序：科 學 會 堂 */')
gen.append('const KX_CHARS = [')
for i in range(4):
    gen.append('  [KX_MASK_%s, %d, %d]%s'
               % (ID[i], len(MASKS[i][0]), THS[i], ',' if i < 3 else ''))
gen.append('];')
gen.append('/* ==== 生成块结束 ==== */')

txt = io.open(TGT, encoding='utf-8').read()
A, B = '/*__KX_GEN_BEGIN__*/', '/*__KX_GEN_END__*/'
assert A in txt and B in txt, '标记缺失: ' + TGT
head, rest = txt.split(A, 1)
_, tail = rest.split(B, 1)
io.open(TGT, 'w', encoding='utf-8', newline='\n').write(
    head + A + '\n' + '\n'.join(gen) + '\n' + B + tail)
io.open(os.path.join(HERE, '_kxfont.txt'), 'w', encoding='utf-8').write('\n'.join(out))
print('spliced -> %s' % TGT)
print('ok  ' + ' '.join('%s %dx%d' % (NAME[i], len(MASKS[i][0]), THS[i]) for i in range(4)))
sys.stdout.flush()
