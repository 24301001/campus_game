# -*- coding: utf-8 -*-
"""思源东楼 / 思源西楼 门头金字 → 1bit 点阵（供 parts/58_dxdoor.js 用）。

用法：
    python _dxfont.py probe   —— 出阈值对比图 _dxprobe_font.png + .txt，不写零件
    python _dxfont.py         —— 正式生成并拼接进 parts/58_dxdoor.js 的生成块

字形来源：用户提炼件 `_photo/siyuandongloufont.png`（金「思源东楼」）
          与 `_photo/siyuanxiloufont.png`（金「思源西楼」）—— 两张都是
          2048×2048 白底、金箔毛笔行楷、右下角一枚「豆包AI生成」水印。
          判据 `(r-b) > 45` 一刀切（与 §5.5 老体育馆同一套：水印是中性灰，切不到）。
          列投影应当正好断开 4 段；断不出 4 段说明阈值或图换了，直接 assert 报出来。

⚠️ **两栋楼的门完全一样**（用户 2026-09-13：「思源东楼和思源西楼的门是完全一样的，
   所以你参考哪个图片实际上是无所谓的」），只有门楣上那四个字不同。所以这里
**逐图各切 8 个字形**（东 4 + 西 4，"思/源/楼"两图各存一份）、**不共用** ——
   与 §5.1 的 syBits 同一个理由：两边各自独立，将来谁动了都牵连不到对方，
   而且数据量本来就小（每字 ≈ 14×14 → 不到 40 字节 base64）。

字高（**四字统一，不按实测 bbox 各自缩放**）：
  照片里「思源东楼」四个字是**等高**的（同一次书写、同一支笔），不像老体育馆的
  「大」那样真的矮一截（那是「交大体育馆」五字的特例，见 _gymfont.py）。
  所以这里只保留**逐字的宽高比**（不强行拉成方的），高度一律 ANCHOR。
  ⚠️ ANCHOR 的取值见上面 `ANCHOR` 那一段注释（22 → 11 是用户 2026-09-13 钦定的）。
"""
import io, os, re, sys, base64
from PIL import Image, ImageDraw
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
TGT = os.path.join(HERE, 'parts', '58_dxdoor.js')

GOLD = 45        # (r-b) 阈值：金/白底一刀切（水印在中性灰，切不到）
ANCHOR = 11      # 门头字的目标字高（世界像素）—— 四字统一
#                  ⚠️ 用户 2026-09-13 第二轮：「字体高度降低为原来的一半」⇒ 22 → 11，
#                     门楣梁同步 28 → 14（`DX_HB`），省下的 14px 让给黑色玻璃。
#                     22 那一版是"照片里字占梁高 82%"反推的；11 是用户钦定的值，
#                     **可读性明显下降**（毛笔行楷在 11px 下笔画只剩 1px 宽，
#                     「源」「楼」会糊成一团），这是用户看过 1× 画面后的取舍。
#                  ⚠️ 上限由**梁宽**卡死：现在四字合计 ≈ 38 + 字距 6 = 44，梁宽 108 —— 富余很大。
COV = 0.20       # 覆盖率阈值（降采样后 1bit 的判定）
#                  ⚠️ 这一档**跟着 ANCHOR 走**，不是固定的：22px 时 0.30 最优
#                     （0.40 把边缘像素全判成 0，「源」的三点水散成飞点）；
#                     11px 时反过来 —— 笔画只剩 1px 宽，阈值越低越连通，
#                     `probe` 逐档出图对比后取 0.20（0.25/0.30 下「源」「楼」糊成一片）。
#                     毛笔字本来就粗，0.20 只是把它还原成实心笔道，不是"发胖"。

# 东楼 / 西楼：源图、字序、常量前缀
SETS = [
    ('D', 'siyuandongloufont.png', ['思', '源', '东', '楼']),
    ('X', 'siyuanxiloufont.png', ['思', '源', '西', '楼']),
]


def load_glyphs(fn):
    """→ [np.bool_ 数组, ...]，逐字按 bbox 裁紧。靠列投影的空隙自动切段。"""
    a = np.array(Image.open(os.path.join(HERE, '_photo', fn)).convert('RGB')).astype(np.int16)
    m = (a[:, :, 0] - a[:, :, 2]) > GOLD
    cols = m.sum(axis=0) > 2          # >2 挡掉 JPEG/PNG 边缘的一两点杂色
    runs, start = [], None
    for i, v in enumerate(cols):
        if v and start is None:
            start = i
        if not v and start is not None:
            runs.append((start, i - 1))
            start = None
    if start is not None:
        runs.append((start, len(cols) - 1))
    assert len(runs) == 4, '%s 列投影切出 %d 块（应为 4）—— 阈值或图变了？' % (fn, len(runs))
    out = []
    for x0, x1 in runs:
        sub = m[:, x0:x1 + 1]
        rr = np.where(sub.sum(axis=1) > 0)[0]
        out.append(sub[rr.min():rr.max() + 1, :])
    return out


def down(m, th, cov):
    """面积平均降采样 → 1bit。宽按原字长宽比出格（**不强行拉方**）。"""
    bh, bw = m.shape
    tw = max(2, int(round(th * bw / float(bh))))
    f = np.array(Image.fromarray(m.astype(np.uint8) * 255).resize((tw, th), Image.BOX),
                 dtype=np.float32) / 255.0
    return [[1 if f[y][x] >= cov else 0 for x in range(tw)] for y in range(th)]


def b64(m):
    """MSB 优先（与 sgBits / mhBits / gyBits 同一约定）"""
    bits = [v for row in m for v in row]
    by = bytearray()
    for i in range(0, len(bits), 8):
        v = 0
        for j in range(8):
            v = (v << 1) | (bits[i + j] if i + j < len(bits) else 0)
        by.append(v)
    return base64.b64encode(bytes(by)).decode()


# ==================== probe：阈值对比 ====================
if len(sys.argv) > 1 and sys.argv[1] == 'probe':
    rows, lines = [], []
    for key, fn, names in SETS:
        GL = load_glyphs(fn)
        lines.append('%s  %s  逐字 bbox：%s' % (
            key, fn, ' / '.join('%s %dx%d' % (n, g.shape[1], g.shape[0])
                                for n, g in zip(names, GL))))
        for cov in (0.20, 0.25, 0.30):
            ms = [down(g, ANCHOR, cov) for g in GL]
            W = sum(len(m[0]) for m in ms) + 3 * (len(ms) - 1)
            im = Image.new('RGB', (W, ANCHOR), (0xf0, 0xe8, 0xd8))   # 门楣石板色
            d = ImageDraw.Draw(im)
            x = 0
            for m in ms:
                for i in range(len(m[0])):
                    for j in range(ANCHOR):
                        if m[j][i]:
                            d.point((x + i, j), fill=(0xc8, 0x96, 0x3c))
                x += len(m[0]) + 3
            rows.append(('cov %.2f' % cov, im))
            lines.append('  --- cov %.2f ---' % cov)
            for nm, m in zip(names, ms):
                lines.append('    %s %dx%d' % (nm, len(m[0]), len(m)))
                for r in m:
                    lines.append('      ' + ''.join('#' if v else '.' for v in r))
    Z = 8
    W = max(r.width for _, r in rows)
    H = sum(r.height + 4 for _, r in rows)
    sheet = Image.new('RGB', (W, H), (0x30, 0x2c, 0x28))
    y = 0
    for _, r in rows:
        sheet.paste(r, (0, y))
        y += r.height + 4
    sheet.resize((sheet.width * Z, sheet.height * Z), Image.NEAREST).save(
        os.path.join(HERE, '_dxprobe_font.png'))
    io.open(os.path.join(HERE, '_dxprobe_font.txt'), 'w', encoding='utf-8').write('\n'.join(lines))
    print('probe -> _dxprobe_font.png / _dxprobe_font.txt  (%d 行)' % len(rows))
    sys.stdout.flush()
    raise SystemExit(0)

# ==================== 正式生成 ====================
gen = ['/* ==== 由 _build/_dxfont.py 生成，勿手改 ==== */',
       '/* 思源东/西楼门头金字「思源东楼」/「思源西楼」点阵 —— 源是用户提炼件',
       '   _photo/siyuandongloufont.png 与 _photo/siyuanxiloufont.png',
       '   （白底金箔毛笔行楷，判据 (r-b) > %d 一刀切），**不是**系统字体渲染。' % GOLD,
       '   两栋楼的门完全一样、只有这四个字不同 ⇒ 逐图各存一套，不共用字形。',
       '   字高统一锚 %d（照片里四字等高），只保留逐字的宽高比。 */' % ANCHOR]
txt = []
for key, fn, names in SETS:
    GL = load_glyphs(fn)
    MS = [down(g, ANCHOR, COV) for g in GL]
    txt.append('%s %s bbox %s' % (key, fn, [g.shape for g in GL]))
    gen.append('/* [点阵, 宽, 高] —— 顺序：%s */' % ' '.join(names))
    gen.append('const DX_%s_CHARS = [' % key)
    for i, m in enumerate(MS):
        assert m, '%s 的第 %d 字降采样成空白' % (key, i)
        tw, th = len(m[0]), len(m)
        txt.append('  %s %dx%d' % (names[i], tw, th))
        for r in m:
            txt.append('    ' + ''.join('#' if v else '.' for v in r))
        gen.append('  ["%s", %d, %d]%s' % (b64(m), tw, th, ',' if i < 3 else ''))
    gen.append('];')
gen.append('/* ==== 生成块结束 ==== */')

A, B = '/*__DX_GEN_BEGIN__*/', '/*__DX_GEN_END__*/'
if not os.path.exists(TGT):
    io.open(TGT, 'w', encoding='utf-8', newline='\n').write(
        '/* §5.8 思源东/西楼门面（占位，等 _dxfont.py 填生成块） */\n' + A + '\n' + B + '\n')
_txt = io.open(TGT, encoding='utf-8').read()
assert A in _txt and B in _txt, '标记缺失: ' + TGT
head, rest = _txt.split(A, 1)
_, tail = rest.split(B, 1)
io.open(TGT, 'w', encoding='utf-8', newline='\n').write(
    head + A + '\n' + '\n'.join(gen) + '\n' + B + tail)

io.open(os.path.join(HERE, '_dxfont.txt'), 'w', encoding='utf-8').write('\n'.join(txt))
print('spliced -> %s' % TGT)
print('ok  ' + ' | '.join('%s %d 字 %s' % (k, 4, ' '.join('%dx%d' % (len(m[0]), len(m))
                                                      for m in MS))
                          for (k, _, _), GL, MS in
                          [(s, load_glyphs(s[1]), [down(g, ANCHOR, COV)
                                                   for g in load_glyphs(s[1])]) for s in SETS]))
sys.stdout.flush()
