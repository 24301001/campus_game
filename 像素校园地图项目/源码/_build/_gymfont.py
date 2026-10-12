# -*- coding: utf-8 -*-
"""老体育馆门头「交大体育馆」五个金字 → 1bit 点阵（供 parts/55_gym.js 用）。

用法：
    python _gymfont.py probe   —— 出阈值对比表（_gymprobe.png / _gymprobe.txt），不写零件
    python _gymfont.py         —— 正式生成并拼接进 parts/55_gym.js 的生成块

字形来源（2026-09-13 第二轮改）：**用户从照片里提炼出来的 `_photo/jiaodatiyuguanfont.png`**。
  白底、五字金箔毛笔行楷、右下角一枚「豆包AI生成」水印。判据 `(r-b) > 45` 一刀切下去
  金/纸就干净分开（水印是中性灰，切不到 —— 实测右下角 y>1500,x>1400 金像素 **0**）；
  五个字的列投影正好断开五段，逐段按 bbox 裁紧，段内无空白列。
  ⇒ 与 §5.6 明湖那两个字是同一类提炼件、同一套做法。

⚠️ **第一版不是这么做的**：那时只有仰拍的实拍图，金字贴在青绿竖肋带上、金/底只差一点
   暖度，JPEG 又把笔画边缘糊成中间色。`(r-b)>16 and (r-g)>3` 抠出来全是糊块
   （「交」成一坨、「馆」连右下角那方落款一起吞进来），五字的 bbox 高还被绿带的**行
   范围截断**而失真（「馆」被切在带底 → 93 是假的）。所以第一版退成 FZYTK 渲染，
   只拿照片量版面。现在有了提炼件，**照片抠字那条路重新成立**，而且笔画是真的毛笔味，
   不是姚体那股板正的电脑味。旧的选型过程留在文件末，只作历史记录。

版面（**仍然是量的，别"对齐"它**）：
  提炼件里五字的 bbox 底是 1194 / 1131 / 1212 / 1207 / 1170 —— **不齐**，
  但那是毛笔字的正常现象（「体」「育」的长竖本来就出锋到基线以下、「交」的捺尾拖长），
  不是五个字各自站在不同高度上。折到世界像素后（k = 21/366.0 ≈ 0.0574）偏离 ≤5px、
  四个字 ≤2px，所以 §5.5.3 gymSign() 沿用**统一的 GY_BASE_Y 基线**，逐字 `GY_BASE_Y - nh`。
  唯一例外是「大」：它在提炼件里底边比「育」高 76px（≈4.4 世界像素），是唯一一个
  真的"没坐在基线上"的字 —— 但它是「撇」收笔上挑的字，底对齐后读起来就是正常的门头，
  真按 4.4px 抬起来反而会看出它悬空。**保持底对齐。**

逐字高的来源（**别改成统一值**，见 THS）：
  提炼件 bbox 高 339 / 213 / 348 / 366 / 311（交 大 体 育 馆），以「育」为锚折算
  ⇒ 「大」只有「育」的 0.58 倍。**这是原设计，不是抠图误差**：
  回头量了实拍 `_photo/tiyuguan1.jpg`（判据 (r-g)、逐字画框核对，见 _look/_gymband.png），
  得 交 0.89 / 大 **0.52** / 体 0.90 / 育 1.0 / 馆 0.80 —— 与提炼件（0.93/0.58/0.95/1.0/0.85）
  一致到几个百分点内，两个来源都认定「大」明显矮一截。
  ⚠️ 量实拍时**「馆」的框会一直拖到 y252** —— 那一截是右下角的**落款小字**，不是笔画，
  判 y 范围时要认清（馆的真实底是 y217 附近）。

为什么 ANCHOR 是 26（而不是先前的 21）：
  21 那版在精灵里**读不出来** —— 笔画只有 1~2px 而且断断续续，用户退第一版的理由
  正是"太粗糙"，不能再交一个认不出的字。定这个锚靠的是**横向足迹**（仰拍对垂直量
  失真大，水平量可信）：实拍门头「交」左缘到「馆」右缘占立面宽 **22%~78%**；
  26 锚下 THS=[24,15,25,26,22] ⇒ 合计宽 181，占精灵立面（330 世界像素）的
  **22.6%~77.4%**，几乎重合。21 锚只有 25.8%~74.2%（旧版更窄）。
  竖直方向 26 锚下「育」占带子 221..246（带 214..252），上留 7 下留 6，居中。
  A/B 对照见 _look/_gymab.png（21 锚 vs 26 锚 vs 28 锚）。
  ⚠️ 28 锚就溢出了：28 高 + 基线 247 ⇒ 顶到 219，只剩 5px 绿边，再高就顶穿上沿。

  TH_MIN=14 是**可读性下限**（防以后再提炼出更小的字），26 锚下不生效：
  「大」自然折出 15。降到 12（= 0.46 倍）时它的撇捺在 1bit 里并成一坨，
  读出来是个星号 —— 对比图 _look/_gymda.png 最左一列。
"""
import io, os, re, sys, base64
from PIL import Image, ImageDraw, ImageFont
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
TGT = os.path.join(HERE, 'parts', '55_gym.js')
SRC = os.path.join(HERE, '_photo', 'jiaodatiyuguanfont.png')

NAME = [u'交', u'大', u'体', u'育', u'馆']
ID = ['JIAO', 'DA', 'TI', 'YU', 'GUAN']
GOLD = 45            # (r-b) 阈值：金/白底一刀切（水印在中性灰，切不到）
ANCHOR = 26          # 「育」的目标字高（世界像素）—— 其余四字按实测比例推
TH_MIN = 14          # 字高下限（当前**不生效**：26 锚下「大」自然折出 15；留着防再提炼）
COV = 0.36           # 覆盖率阈值（对比表见 _gymprobe.png：0.30 起细笔发出毛边，
                     #  0.52 起「大」的撇捺被填断）
# 旧路（FZYTK 渲染）保留：probe 模式还要拿它做对照行，且 §5.5 的门头字当年是它做的
BASE = 240
SS = 8
FONT = 'C:/Windows/Fonts/FZYTK.TTF'


# ==================== 从提炼件取字 ====================
def load_glyphs():
    """→ [np.bool_ 数组, ...]，逐字按 bbox 裁紧。字形靠列投影的空隙自动切开。"""
    a = np.array(Image.open(SRC).convert('RGB')).astype(np.int16)
    m = (a[:, :, 0] - a[:, :, 2]) > GOLD
    cols = m.sum(axis=0) > 2          # >2 挡掉 JPEG 边缘的一两点杂色
    runs, start = [], None
    for i, v in enumerate(cols):
        if v and start is None:
            start = i
        if not v and start is not None:
            runs.append((start, i - 1))
            start = None
    if start is not None:
        runs.append((start, len(cols) - 1))
    assert len(runs) == 5, '列投影切出 %d 块（应为 5）—— 阈值或图变了？' % len(runs)
    out = []
    for x0, x1 in runs:
        sub = m[:, x0:x1 + 1]
        rr = np.where(sub.sum(axis=1) > 0)[0]
        out.append(sub[rr.min():rr.max() + 1, :])
    assert len(out) == len(NAME)
    return out


def target_heights(gl):
    """按提炼件的实测 bbox 高、以「育」为锚折出逐字目标字高（世界像素），
    再夹一次 TH_MIN（只有「大」会被抬起来）。"""
    h = [g.shape[0] for g in gl]
    top = float(max(h))
    return h, [max(TH_MIN, int(round(x / top * ANCHOR))) for x in h]


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
    ImageDraw.Draw(big).text((BASE // 2, BASE // 2), ch, font=font, fill=255)
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
            m[ty][tx] = 1 if hit >= 0.22 * SS * SS else 0
    return m


def b64(m):
    """MSB 优先（与 49_southgate.js 的 sgBits / 56_minghu.js 的 mhBits 同一约定）"""
    bits = [v for row in m for v in row]
    by = bytearray()
    for i in range(0, len(bits), 8):
        v = 0
        for j in range(8):
            v = (v << 1) | (bits[i + j] if i + j < len(bits) else 0)
        by.append(v)
    return base64.b64encode(bytes(by)).decode()


# ==================== 版面（从 55_gym.js 现读，别在两边各存一份） ====================
_txt = io.open(TGT, encoding='utf-8').read()


def jconst(name):
    m = re.search(r'\b%s = (-?\d+)' % name, _txt)
    assert m, '读不到 55_gym.js 的 %s' % name
    return int(m.group(1))


LAY = {k: jconst(k) for k in ('GY_X0', 'GY_X1', 'GY_CAP', 'GY_BAND',
                              'GY_CX', 'GY_GAP', 'GY_BASE_Y')}


def band(hgt, masks, ths, cap=0x21, cov_lbl=''):
    """把五字按 §5.5.3 gymSign() 的同一套排版画在青绿肋带上（1:1），并套上
    gyGlyph() 的"竖 run 铺金 + 两端高光/暗金"，出来就是门头那块的真实观感。"""
    X0, X1 = LAY['GY_X0'], LAY['GY_X1']
    C0, C1 = LAY['GY_CAP'], LAY['GY_BAND']
    im = Image.new('RGB', (X1 - X0, C1 - C0), (0x63, 0x89, 0x7f))
    d = ImageDraw.Draw(im)

    def P(x, y, w, h, c):
        if w > 0 and h > 0:
            d.rectangle([x, y, x + w - 1, y + h - 1], fill=c)

    for x in range(X0 + 1, X1, 4):                       # 竖肋
        P(x - X0, 0, 1, C1 - C0, (0x58, 0x7c, 0x73))
    P(0, 0, X1 - X0, 1, (0x4a, 0x6b, 0x63))
    P(0, C1 - C0 - 2, X1 - X0, 2, (0x4a, 0x6b, 0x63))
    if cap:                                              # 压顶下沿
        P(0, 0, X1 - X0, 1, (0xb3, 0xac, 0x9c))

    tw = sum(len(m[0]) for m in masks) + LAY['GY_GAP'] * (len(masks) - 1)
    x = LAY['GY_CX'] - tw / 2.0
    for m, th in zip(masks, ths):
        nw = len(m[0])
        ox, oy = int(round(x)) - X0, LAY['GY_BASE_Y'] - th - C0
        for i in range(nw):
            j = 0
            while j < th:
                if not m[j][i]:
                    j += 1
                    continue
                k = j
                while k + 1 < th and m[k + 1][i]:
                    k += 1
                P(ox + i, oy + j, 1, k - j + 1, (0xc8, 0x96, 0x3c))
                if k > j:
                    P(ox + i, oy + j, 1, 1, (0xec, 0xc9, 0x7c))
                    P(ox + i, oy + k, 1, 1, (0x7c, 0x5a, 0x24))
                j = k + 1
        x += nw + LAY['GY_GAP']
    sx = int(round(LAY['GY_CX'] + tw / 2.0)) + 2 - X0      # 落款小字 + 印
    P(sx, LAY['GY_BASE_Y'] - 4 - C0, 8, 3, (0xb9, 0x8d, 0x38))
    P(sx, LAY['GY_BASE_Y'] - 4 - C0, 8, 1, (0xd8, 0xae, 0x56))
    P(sx + 11, LAY['GY_BASE_Y'] - 6 - C0, 4, 4, (0xa8, 0x7f, 0x30))
    P(sx + 12, LAY['GY_BASE_Y'] - 5 - C0, 2, 2, (0xe0, 0xc0, 0x7a))
    if cov_lbl:
        pass
    return im


def strip(hgt, lbl):
    """左侧贴一行标签，方便在对比图里认出是哪一档。"""
    Z = 6
    t = Image.new('RGB', (180, hgt), (0x2e, 0x2b, 0x28))
    ImageDraw.Draw(t).text((6, hgt // 2 - 4), lbl, fill=(0xe0, 0xd8, 0xc8))
    return t


GL = load_glyphs()
RAW_H, THS = target_heights(GL)
MASKS = [down(g, th, COV) for g, th in zip(GL, THS)]


# ============================ probe ============================
if len(sys.argv) > 1 and sys.argv[1] == 'probe':
    lines = ['源：_photo/jiaodatiyuguanfont.png（用户提炼件，(r-b)>%d）' % GOLD,
             '逐字 bbox 像素：' + ' / '.join(
                 '%s %dx%d' % (n, g.shape[1], g.shape[0]) for n, g in zip(NAME, GL)),
             '以「育」= %d 世界像素为锚 ⇒ 逐字高 %s' % (ANCHOR, THS),
             '版面（从 55_gym.js 现读）：字距 GY_GAP=%d  基线 GY_BASE_Y=%d  中轴 GY_CX=%d'
             % (LAY['GY_GAP'], LAY['GY_BASE_Y'], LAY['GY_CX']), '']
    rows = []
    for cov in (0.30, 0.40, 0.50, 0.60):
        ms = [down(g, th, cov) for g, th in zip(GL, THS)]
        rows.append(('cov %.2f' % cov, band(RAW_H, ms, THS)))
        lines.append('--- 阈值 %.2f ---' % cov)
        for nm, m in zip(NAME, ms):
            lines.append('  %s  %d x %d' % (nm, len(m[0]), len(m)))
            for r in m:
                lines.append('    ' + ''.join('#' if v else '.' for v in r))
    fm = [mask_font(c, th, FONT) for c, th in zip(NAME, THS)]
    rows.append(('FZYTK (old)', band(RAW_H, fm, THS)))
    lines.append('')
    lines.append('_gymprobe.png 每行 = 一个阈值，整排按真实版面画在青绿肋带上；'
                 '最后一行是旧路 FZYTK 渲染。')
    Z = 5
    W = max(r.width for _, r in rows) + 180
    H = sum(r.height + 6 for _, r in rows)
    sheet = Image.new('RGB', (W, H), (0x60, 0x5c, 0x56))
    y = 0
    for lbl, r in rows:
        sheet.paste(strip(r.height, lbl), (0, y))
        sheet.paste(r, (180, y))
        y += r.height + 6
    sheet.resize((sheet.width * Z, sheet.height * Z), Image.NEAREST).save(
        os.path.join(HERE, '_gymprobe.png'))
    io.open(os.path.join(HERE, '_gymprobe.txt'), 'w', encoding='utf-8').write('\n'.join(lines))
    print('probe -> _gymprobe.png / _gymprobe.txt  (%d 行)' % len(rows))
    sys.stdout.flush()
    raise SystemExit(0)

# ============================ 正式生成 ============================
out = ['源 _photo/jiaodatiyuguanfont.png（(r-b)>%d）  逐字高 %s  阈值 %.2f'
       % (GOLD, THS, COV),
       '提炼件逐字 bbox 像素高 ' + ' / '.join(str(x) for x in RAW_H)
       + '（以「育」= %d 世界像素为锚）' % ANCHOR]
for nm, m in zip(NAME, MASKS):
    assert m, '%s 降采样成空白' % nm
    out.append('--- %s  %d x %d ---' % (nm, len(m[0]), len(m)))
    for r in m:
        out.append('    ' + ''.join('#' if v else '.' for v in r))

gen = ['/* ==== 由 _build/_gymfont.py 生成，勿手改 ==== */',
       '/* 老体育馆门头「交大体育馆」五字点阵 —— 源是用户从照片里提炼的',
       '   _photo/jiaodatiyuguanfont.png（白底金字，判据 (r-b) > %d 一刀切），' % GOLD,
       '   **不是**系统字体渲染。',
       '   ⚠️ 第一版走的是 FZYTK 渲染，笔画板正得像电脑字 —— 用户退回重做。',
       '   ⚠️ 逐字高 %s 是**按提炼件的实测 bbox 高折算的**（以「育」= %d' % (THS, ANCHOR),
       '      世界像素为锚，下夹 TH_MIN=%d）：「大」只有「育」的 0.58 倍，' % TH_MIN,
       '      这是**原设计** —— 实拍照片里「大」就明显矮一截（回量得 0.52），',
       '      基线齐平、顶更低。别"修"成统一值。',
       '   落笔仍是统一的 GY_BASE_Y 基线（见 _gymfont.py 文件头「版面」那段）。 */']
for i in range(5):
    gen.append('const GY_MASK_%s = "%s";' % (ID[i], b64(MASKS[i])))
gen.append('/* [点阵, 宽, 高] —— 顺序：交 大 体 育 馆 */')
gen.append('const GY_CHARS = [')
for i in range(5):
    gen.append('  [GY_MASK_%s, %d, %d]%s'
               % (ID[i], len(MASKS[i][0]), THS[i], ',' if i < 4 else ''))
gen.append('];')
gen.append('/* ==== 生成块结束 ==== */')

A, B = '/*__GY_GEN_BEGIN__*/', '/*__GY_GEN_END__*/'
assert A in _txt and B in _txt, '标记缺失: ' + TGT
head, rest = _txt.split(A, 1)
_, tail = rest.split(B, 1)
io.open(TGT, 'w', encoding='utf-8').write(head + A + '\n' + '\n'.join(gen) + '\n' + B + tail)

io.open(os.path.join(HERE, '_gymfont.txt'), 'w', encoding='utf-8').write('\n'.join(out))
band(RAW_H, MASKS, THS).resize(((LAY['GY_X1'] - LAY['GY_X0']) * 6,
                                (LAY['GY_BAND'] - LAY['GY_CAP']) * 6),
                               Image.NEAREST).save(os.path.join(HERE, '_gymfont.png'))
print('spliced -> %s' % TGT)
print('ok  %s  合计宽 %d + 字距 %d×4'
      % (' '.join('%s %dx%d' % (NAME[i], len(MASKS[i][0]), THS[i]) for i in range(5)),
         sum(len(m[0]) for m in MASKS), LAY['GY_GAP']))
sys.stdout.flush()
