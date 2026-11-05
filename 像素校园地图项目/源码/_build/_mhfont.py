# -*- coding: utf-8 -*-
"""明湖石碑「明湖」二字 → 1bit 点阵（供 parts/56_minghu.js 用）。

用法：
    python _mhfont.py probe     —— 出阈值/字高对比表（_mhprobe.png / _mhprobe.txt），不写零件
    python _mhfont.py           —— 正式生成并拼接进 parts/56_minghu.js 的生成块

字形来源（2026-09-13 第二轮改）：**用户从照片里提炼出来的 `_photo/minghufont.png`**。
  背景纯白（240+）、笔画纯黑（0-48）、只有右下角一枚浅灰水印（190-235）——
  阈值 110 一刀切下去就是干净的 1bit，与 §4.9 校名石那张「字体.png」是同一类。
  ⚠️ 第一版不是这么做的：那时只有 minghu1.jpg（**刻在花岗岩上**的灰字、斜侧光、
     石面本身还有花斑），抠出来边界永远是毛的，所以退而用 FZYTK 方正姚体渲染。
     现在有了提炼件，**照片抠字那条路重新成立**，而且比任何系统字体都像原物
     （原物就是毛笔写的，不是姚体）。旧选型过程留在文件末，只作历史记录。

版面（仍然是照片量的，**别"对齐"它**）：
  两字在石面上是**斜向排布**（明在右上、湖在左下、叠 5px），落款在左侧一列。
  这个排布不在本文件里 —— 在 §5.6.4 makeMinghuStone() 末尾的两处 mhGlyph 调用。
"""
import io, os, sys, base64
from PIL import Image, ImageDraw, ImageFont
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
TGT = os.path.join(HERE, 'parts', '56_minghu.js')
SRC = os.path.join(HERE, '_photo', 'minghufont.png')

NAME = [u'明', u'湖']
ID = ['MING', 'HU']
THS = [20, 20]                      # 逐字目标字高（世界像素）
COV = 0.38                          # 覆盖率阈值（对比表见 _look/_mhpick.png：
                                    # 0.46 起 日/月/古 的"白"会被填死，0.34 起笔画发毛）
INK = 110                           # 墨/纸 二值化阈值（水印在 190+，切不到）

# ---- 旧路（字体渲染）保留：probe 模式还要用它做对照，且 §5.5 门头字同款 ----
BASE = 256                          # 渲染用的大字磅值
SS = 8                              # 每个目标像素的超采样格
CHOSEN = 'C:/Windows/Fonts/FZYTK.TTF'
CAND = [
    ('FZYTK', 'C:/Windows/Fonts/FZYTK.TTF'),
    ('STXINWEI', 'C:/Windows/Fonts/STXINWEI.TTF'),
    ('STHUPO', 'C:/Windows/Fonts/STHUPO.TTF'),
    ('STLITI', 'C:/Windows/Fonts/STLITI.TTF'),
    ('SIMLI', 'C:/Windows/Fonts/SIMLI.TTF'),
    ('STKAITI', 'C:/Windows/Fonts/STKAITI.TTF'),
    ('STXINGKA', 'C:/Windows/Fonts/STXINGKA.TTF'),
    ('FZSTK', 'C:/Windows/Fonts/FZSTK.TTF'),
    ('STZHONGS', 'C:/Windows/Fonts/STZHONGS.TTF'),
    ('STXIHEI', 'C:/Windows/Fonts/STXIHEI.TTF'),
    ('simhei', 'C:/Windows/Fonts/simhei.ttf'),
    ('msyhbd', 'C:/Windows/Fonts/msyhbd.ttc'),
]


# ==================== 从提炼件取字 ====================
def load_glyphs():
    """→ [np.bool_ 数组, ...]，逐字按 bbox 裁紧。字形靠列投影的空隙自动切开。"""
    a = np.array(Image.open(SRC).convert('L'))
    m = a < INK
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
    assert len(runs) == 2, '列投影切出 %d 块（应为 2）—— 阈值或图变了？' % len(runs)
    out = []
    for x0, x1 in runs:
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


# ---- 旧路：字体渲染（只给 probe 的对照行用） ----
def mask_font(ch, th, fontpath):
    font = ImageFont.truetype(fontpath, BASE)
    big = Image.new('L', (BASE * 2, BASE * 2), 0)
    ImageDraw.Draw(big).text((BASE // 4, BASE // 4), ch, font=font, fill=255)
    bb = big.getbbox()
    if not bb:
        return None
    bw, bh = bb[2] - bb[0], bb[3] - bb[1]
    tw = max(2, int(round(th * bw / float(bh))))
    lp = big.load()
    m = [[0] * tw for _ in range(th)]
    for ty in range(th):
        for tx in range(tw):
            hit = 0
            for sy in range(SS):
                for sx in range(SS):
                    px_ = int(bb[0] + (tx + (sx + 0.5) / SS) * bw / tw)
                    py_ = int(bb[1] + (ty + (sy + 0.5) / SS) * bh / th)
                    if lp[px_, py_] > 128:
                        hit += 1
            m[ty][tx] = 1 if hit >= 0.24 * SS * SS else 0
    return m


def b64(m):
    """MSB 优先（与 49_southgate.js 的 sgBits / 55_gym.js 的 gyBits 同一约定）"""
    bits = [v for row in m for v in row]
    by = bytearray()
    for i in range(0, len(bits), 8):
        v = 0
        for j in range(8):
            v = (v << 1) | (bits[i + j] if i + j < len(bits) else 0)
        by.append(v)
    return base64.b64encode(bytes(by)).decode()


def tile(ms, Z=1, bg=(0xa8, 0xa4, 0x9c), fg=(0x28, 0x28, 0x2c)):
    tw = sum(len(m[0]) for m in ms) + 3
    hh = len(ms[0])
    t = Image.new('RGB', (tw, hh), bg)
    pp = t.load()
    x = 0
    for m in ms:
        for j in range(hh):
            for i in range(len(m[0])):
                if m[j][i]:
                    pp[x + i, j] = fg
        x += len(m[0]) + 3
    return t.resize((t.width * Z, t.height * Z), Image.NEAREST)


def sheet(rows, Z=6):
    W = max(t.width for _, t in rows)
    s = Image.new('RGB', (W, sum(t.height + 6 for _, t in rows)), (0x60, 0x5c, 0x56))
    y = 0
    for _, t in rows:
        s.paste(t, (0, y))
        y += t.height + 6
    return s.resize((s.width * Z, s.height * Z), Image.NEAREST)


# ============================ probe ============================
if len(sys.argv) > 1 and sys.argv[1] == 'probe':
    gl = load_glyphs()
    lines = ['源：_photo/minghufont.png（用户提炼件）',
             '逐字像素：明 %d x %d / 湖 %d x %d（阈值 <%d）'
             % (gl[0].shape[1], gl[0].shape[0], gl[1].shape[1], gl[1].shape[0], INK), '']
    rows = []
    for cov in (0.34, 0.42, 0.50, 0.58):
        for th in (16, 18, 20):
            ms = [down(g, th, cov) for g in gl]
            lines.append('--- 字高 %d / 阈值 %.2f ---' % (th, cov))
            for nm, m in zip(NAME, ms):
                lines.append('  %s  %d x %d' % (nm, len(m[0]), len(m)))
                for r in m:
                    lines.append('    ' + ''.join('#' if v else '.' for v in r))
            rows.append(('th%d cov%.2f' % (th, cov), tile(ms, 1)))
    # 旧路对照（FZYTK）
    fm = [mask_font(c, 20, CHOSEN) for c in NAME]
    rows.append(('FZYTK 20 (旧)', tile(fm, 1)))
    sheet(rows).save(os.path.join(HERE, '_mhprobe.png'))
    lines.append('')
    lines.append('_mhprobe.png 每行 = 一个 (字高, 阈值) 组合，左明右湖；最后一行是旧的 FZYTK 渲染。')
    io.open(os.path.join(HERE, '_mhprobe.txt'), 'w', encoding='utf-8').write('\n'.join(lines))
    print('probe -> _mhprobe.png / _mhprobe.txt  (%d 行)' % len(rows))
    sys.stdout.flush()
    raise SystemExit(0)

# ============================ 正式生成 ============================
GL = load_glyphs()
MASKS = [down(g, th, COV) for g, th in zip(GL, THS)]
out = ['源 _photo/minghufont.png  目标字高 %s  阈值 %.2f' % (THS, COV)]
for nm, m in zip(NAME, MASKS):
    assert m, '%s 渲染成空白' % nm
    out.append('--- %s  %d x %d ---' % (nm, len(m[0]), len(m)))
    for r in m:
        out.append('    ' + ''.join('#' if v else '.' for v in r))

gen = ['/* ==== 由 _build/_mhfont.py 生成，勿手改 ==== */',
       '/* 明湖石碑「明湖」二字点阵 —— 源是用户从照片里提炼的 _photo/minghufont.png',
       '   （白底黑字，阈值 <%d 一刀切），**不是**系统字体渲染。' % INK,
       '   ⚠️ 第一版走的是 FZYTK 渲染，20px 下笔画只有 2-3px，太细太板 —— 用户退回重做。',
       '   逐字高 %d/%d。两字在石面上是**斜向排布**（明在右上、湖在左下，中间留一行空），' % tuple(THS),
       '   排布不在这里 —— 在 §5.6.4 makeMinghuStone() 末尾那两行 mhGlyph 调用，',
       '   是照照片量的。⚠️ 这里**故意不写坐标数字**：字宽随长宽比走，换一次源就要重算，',
       '      写死一份到生成块里必然和调用点对不上（上一版就是这么留了组错坐标）。 */']
for i in range(2):
    gen.append('const MH_MASK_%s = "%s";' % (ID[i], b64(MASKS[i])))
gen.append('/* [点阵, 宽, 高] —— 顺序：明 湖 */')
gen.append('const MH_CHARS = [')
for i in range(2):
    gen.append('  [MH_MASK_%s, %d, %d]%s'
               % (ID[i], len(MASKS[i][0]), THS[i], ',' if i < 1 else ''))
gen.append('];')
gen.append('/* ==== 生成块结束 ==== */')

txt = io.open(TGT, encoding='utf-8').read()
A, B = '/*__MH_GEN_BEGIN__*/', '/*__MH_GEN_END__*/'
assert A in txt and B in txt, '标记缺失: ' + TGT
head, rest = txt.split(A, 1)
_, tail = rest.split(B, 1)
io.open(TGT, 'w', encoding='utf-8').write(head + A + '\n' + '\n'.join(gen) + '\n' + B + tail)
io.open(os.path.join(HERE, '_mhfont.txt'), 'w', encoding='utf-8').write('\n'.join(out))
print('spliced -> %s' % TGT)
print('ok  ' + ' '.join('%s %dx%d' % (NAME[i], len(MASKS[i][0]), THS[i]) for i in range(2)))
sys.stdout.flush()
