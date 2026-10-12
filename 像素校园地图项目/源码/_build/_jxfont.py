# -*- coding: utf-8 -*-
"""机械工程楼楼名带「机械工程楼」五字 → 1bit 点阵（供 parts/65_jixie.js 用）。

用法：
    python _jxfont.py probe     —— 出字高/阈值对比（_jxprobe.png / _jxprobe.txt / 屏上 ASCII），不写零件
    python _jxfont.py           —— 正式生成并拼接进 parts/65_jixie.js 的生成块

## 与 _kxfont.py / _yffont.py / _dxfont.py 的**根本差别**

前三个都是从**用户交付的位图**里抠字形（照片 / 金笔 PNG），所以整套阈值轴、列投影
切字、幂等断言都在对付"底子不干净"。机械工程楼这一轮用户明确放行：

    「你可以不用读照片字体，直接用楷体字」

⇒ 源是**系统字体 `C:\\Windows\\Fonts\\simkai.ttf`（楷体）**，底子是纯白、没有噪声，
   所以：**不做阈值那一轴**，直接渲染大字 → 按墨迹 bbox 裁紧 → 面积平均降采样 →
   覆盖率二值化。列投影切字也不需要（五个字是我们自己排的，字宽已知）。

## 楼名带到底是什么样（**渲染实测**，不是 XML）

第 21 轮查过两遍的旧记录是**错的**，一并作废：旧记录说「浅灰带 #d9d9d9 + 金字」，
那是**照 XML 的 `schemeClr bg1 lumMod85000` 折算**出来的，而把第 7 页整页导出
（`_look/ppt_s7.png`，192 px/in）逐像素扫过之后：

    带底 = **#ffc000 金**（JPEG 无关的纯色，整页只有 5 色，见 `_jxslide.py` 文件头①）
    字   = **#000000 黑**，5 个字每个**正好 30 x 30 px = 0.15625 英寸见方**、字缝 2 px
    字高 / 带高 = 0.15625 / 0.3632 = **0.4302**

（导出图上另有一小撮 #9f7800/#dfa800/#1f1700/#bf9000/#7f6000，各几十像素、
只出现在字缘 —— 那是**黑字压金底的抗锯齿**，不是第六种设计色。）

⇒ 所以本文件画的是**金底黑字**，笔也换成**平涂黑**（`INK_*` 三档同值）。

## 字高从哪来（量过，然后**有意偏离**——偏离多少、凭什么，写在下面）

落在精灵上：sc = 268 世界像素 / 10.7146 英寸 = 25.01 px/in ⇒
  带高 0.3632 × 25.01 = **9.08 行**；字高 0.15625 × 25.01 = **3.91 行**；
  五字总宽 (5×0.15625 + 4×0.0104) × 25.01 = **20.6 行**。

⇒ **正面图自己的比例 = 字高 4 行、总宽 21 行**。

⚠️⚠️ **照 4 行做出来根本不成字**：probe 表上 4 行的「机」是 4x4 的一团
   （`_look/jxprobe.txt` 第一段，`.#.` / `.###` / `.###` / `..#.`），
   5 行同样糊，6 行只有「工」认得出。原因是**楷体横细竖粗**——一笔横只有
   1/4 行宽，面积平均降采样后整笔消失。像素艺术里 4 行高的楷体五字
   物理上不可能清楚，这不是画错、是比例本身太小。

⇒ 本文件**故意偏离正面图比例**：

    THS = 8 行        带高 9.08 行 ⇒ 占 88%，上下各留半行（9 行会顶满、且触发字体闸）
    COV = 0.18        覆盖率阈值（0.32 会把楷体的细横整笔吃掉：8 行的「机」右半、
                       「械」的竖都会没；0.24 与 0.18 目视几乎无差，取更饱满的 0.18）

   代价（如实记）：字高 8 vs 4（**×2.0**）、总宽 51 vs 21 行（**×2.4**）。
   收益：1× 档能读出「机械工程楼」。

`JX_GLYPH_R = 0.88`（= 8 / 9.08）是 65 段字体闸用的同一个数 ——
**改 THS 必须同时改 65 段那一支**，否则加载期响警告。

probe 网格 = 字高 **4/5/6/7/8/9** × 覆盖率 0.18/0.24/0.32，**专门围着上面这个决定排的**
（低三档是用来把「4 行不可读」这条**留成证据**的，不是备选）。要重挑就照
`<th>_<cov>` 记下当选的那一格，再把理由写回这里。
"""
import io
import os
import sys
import base64

from PIL import Image, ImageDraw, ImageFont
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
TGT = os.path.join(HERE, 'parts', '65_jixie.js')

FONT = r'C:\Windows\Fonts\simkai.ttf'      # 楷体（用户 2026-09-27 放行直接用）
NAME = [u'机', u'械', u'工', u'程', u'楼']
ID = ['JI', 'XIE', 'GONG', 'CHENG', 'LOU']
PX = 320                                   # 渲染字号（够大，降采样才准）
THS = [8, 8, 8, 8, 8]                      # 逐字目标字高（世界像素）= 带高 9.08 行的 88%
COV = 0.18                                 # 覆盖率阈值（0.32 会把楷体的细横整笔吃掉）
GAP = 1                                    # 字缝（世界像素）

# 楼的带底 = #FFC000、字 = #000000 —— **两个都是从渲染像素取的**（见文件头「黑字压金底」）。
BAND = (0xff, 0xc0, 0x00)
# 墨三色：金底上**平涂黑**（三档同值）。
#   PPT 导出图上确实有 #9f7800 / #dfa800 / #1f1700 / #bf9000 / #7f6000 这几撮像素，
#   但它们是**黑字压在金底上的抗锯齿过渡**（各几十像素、只出现在字缘 1px 上），
#   不是设计色；把它当浮雕笔会画出一圈假描边。⇒ 忠实做法 = 平黑。
INK_D = INK = INK_L = (0x00, 0x00, 0x00)


def load_glyphs():
    """把五个字渲染成大位图，逐字按墨迹 bbox 裁紧 → [bool 数组, ...]。"""
    f = ImageFont.truetype(FONT, PX)
    out = []
    for ch in NAME:
        im = Image.new('L', (PX * 2, PX * 2), 0)
        d = ImageDraw.Draw(im)
        d.text((PX // 2, PX // 2), ch, fill=255, font=f)
        a = np.array(im) > 96
        rr = np.where(a.sum(axis=1) > 0)[0]
        cc = np.where(a.sum(axis=0) > 0)[0]
        assert len(rr) and len(cc), '%s 渲染成空白 —— 字体没装？%s' % (ch, FONT)
        out.append(a[rr.min():rr.max() + 1, cc.min():cc.max() + 1])
    return out


def down(m, th, cov):
    """面积平均降采样 → 1bit。宽按原字长宽比出格（不强行拉方）。"""
    bh, bw = m.shape
    tw = max(2, int(round(th * bw / float(bh))))
    f = np.array(Image.fromarray(m.astype(np.uint8) * 255).resize((tw, th), Image.BOX),
                 dtype=np.float32) / 255.0
    return [[1 if f[y][x] >= cov else 0 for x in range(tw)] for y in range(th)]


def b64(m):
    """MSB 优先（与 36 的 libBits / 49 的 sgBits / 55 的 gyBits / 61 的 KX_MASK 同一约定）"""
    bits = [v for row in m for v in row]
    by = bytearray()
    for i in range(0, len(bits), 8):
        v = 0
        for j in range(8):
            v = (v << 1) | (bits[i + j] if i + j < len(bits) else 0)
        by.append(v)
    return base64.b64encode(bytes(by)).decode()


def brush(ms, gap=GAP, band=BAND):
    """横排成一条，**画在楼名带的真实底色上** —— 这才是"落进精灵之后看不看得清"的判据。"""
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
                pp[x + i, Pad + j] = INK_L if j == 0 or not m[j - 1][i] else INK
                if j + 1 < len(m) and not m[j + 1][i]:
                    pp[x + i, Pad + j + 1] = INK_D
        x += len(m[0]) + gap
    return t


def dump(m):
    return ['    ' + ''.join('#' if v else '.' for v in r) for r in m]


# ============================ probe ============================
if len(sys.argv) > 1 and sys.argv[1] == 'probe':
    gl = load_glyphs()
    lines = ['源 = 系统字体 %s（楷体）—— 用户 2026-09-27 放行「直接用楷体字」，不做阈值轴' % FONT,
             '衬底 = 楼名带真色 #ffc000（金）；墨 = #000000 平涂',
             '正面图自己的字高 = **4 行**（30px @192dpi ⇒ 0.15625in × 25.01px/in = 3.91）',
             '原始墨迹尺寸：' + ' / '.join('%s %dx%d' % (NAME[i], g.shape[1], g.shape[0])
                                          for i, g in enumerate(gl)), '']
    rows = []
    for th in (4, 5, 6, 7, 8, 9):
        for cov in (0.18, 0.24, 0.32):
            ms = [down(g, th, cov) for g in gl]
            lines.append('--- 字高 %d / 覆盖率 %.2f ---  逐字宽 %s  总宽 %d'
                         % (th, cov, [len(m[0]) for m in ms],
                            sum(len(m[0]) for m in ms) + GAP * 4))
            for nm, m in zip(NAME, ms):
                lines.extend(dump(m))
            lines.append('  拼起来： ' + '  '.join(
                ''.join('#' if v else '.' for v in row) for row in
                [[v for m in ms for v in ([0] * GAP + m[j] if i else m[j])]
                 for i, j in enumerate(range(len(ms[0])))]))
            rows.append(('th%d cov%.2f' % (th, cov), brush(ms)))
    im = Image.new('RGB', (max(t.width for _, t in rows), sum(t.height + 4 for _, t in rows)),
                   (0x60, 0x5c, 0x56))
    y = 0
    for _, t in rows:
        im.paste(t, (0, y))
        y += t.height + 4
    im.resize((im.width * 8, im.height * 8), Image.NEAREST).save(
        os.path.join(HERE, '_look', 'jxprobe_band.png'))
    io.open(os.path.join(HERE, '_look', 'jxprobe.txt'), 'w',
            encoding='utf-8').write('\n'.join(lines))
    print('probe -> _look/jxprobe_band.png / _look/jxprobe.txt  (%d 行组合)' % len(rows))
    sys.stdout.flush()
    raise SystemExit(0)

# ============================ 正式生成 ============================
GL = load_glyphs()
MASKS = [down(g, th, COV) for g, th in zip(GL, THS)]
out = ['源 %s（楷体）  目标字高 %s  覆盖率 %.2f  字缝 %d' % (FONT, THS, COV, GAP)]
for nm, m in zip(NAME, MASKS):
    assert m, '%s 渲染成空白' % nm
    out.append('--- %s  %d x %d ---' % (nm, len(m[0]), len(m)))
    out.extend(dump(m))
io.open(os.path.join(HERE, '_look', 'jxfont.txt'), 'w', encoding='utf-8').write('\n'.join(out))

gen = ['/* ==== 由 _build/_jxfont.py 生成，勿手改 ==== */',
       '/* 机械工程楼楼名带「机械工程楼」五字点阵 —— 源是**系统楷体 simkai.ttf**，',
       '   不是照片（用户 2026-09-27 放行「你可以不用读照片字体，直接用楷体字」）。',
       '   逐字高 %s，覆盖率 %.2f，字缝 %d 行。' % ('/'.join(str(t) for t in THS), COV, GAP),
       '   ⚠️ 这里**故意不写坐标**：字宽随各字长宽比走，排布在调用点现算（见 jxPlaque）。 */']
for i in range(5):
    gen.append('const JX_MASK_%s = "%s";' % (ID[i], b64(MASKS[i])))
gen.append('/* [点阵, 宽, 高] —— 顺序：机 械 工 程 楼 */')
gen.append('const JX_CHARS = [')
for i in range(5):
    gen.append('  [JX_MASK_%s, %d, %d]%s'
               % (ID[i], len(MASKS[i][0]), THS[i], ',' if i < 4 else ''))
gen.append('];')
gen.append('/* ==== 生成块结束 ==== */')

txt = io.open(TGT, encoding='utf-8').read()
A, B = '/*__JX_GEN_BEGIN__*/', '/*__JX_GEN_END__*/'
assert A in txt and B in txt, '标记缺失（先建好 65_jixie.js 的骨架）: ' + TGT
head, rest = txt.split(A, 1)
_, tail = rest.split(B, 1)
io.open(TGT, 'w', encoding='utf-8', newline='\n').write(
    head + A + '\n' + '\n'.join(gen) + '\n' + B + tail)
print('spliced -> %s' % TGT)
print('ok  ' + ' '.join('%s %dx%d' % (NAME[i], len(MASKS[i][0]), THS[i]) for i in range(5)))
sys.stdout.flush()
