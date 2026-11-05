# -*- coding: utf-8 -*-
"""第七教学楼楼名「第七教学楼」→ 1bit 点阵（供 parts/68_qijiao.js 的匾额用）。

与 `_j9font.py` / `_yffont.py` / `_kxfont.py` **三条不同**：

  ① **没有源图**。九教那一轮用户给了一张「jiujiaofont.png」（真实金匾照片），
     那支笔是从**照片**里把字抠出来的。本轮用户只给了一张**立面照片**，
     匾额上那五个字在照片里只有 170×40 px ⇒ 折算到精灵上每个字 4.9 px，
     **不可能从源图里抠**（`_j9font.py` 那条路走不通）。
     ⇒ 改走 30 段 §3.0 `makeSign` 的同一条路：**系统字体渲染 → 二值化 → 取墨框**。
       差别只在"往下采"这一步：`makeSign` 是 1:1 渲染 18px 再逐像素取 alpha，
        本脚本先在**大字号**上渲染（200px）再用**面积平均**缩到 9 行 ——
        小字号直接渲染时汉字的横画会整条消失（9px 的「教」只剩三笔），
        先大后小等价于"带抗锯齿的缩放"，笔画保住。

  ② 本脚本**自己往 68_qijiao.js 里写**（`_j9font.py` 是 `--write` 显式触发的）。
     落点是文件里那对标记 `/*__QJ_GEN_BEGIN__*/ … /*__QJ_GEN_END__*/`，
     重跑就是覆盖那一段，别的一个字节不动。

  ③ 字高 `H` **是判读出来的，不是被匾额框死的**（第一版写成"框死"是错的）：
     照片上那块匾整体只有 34 px 高，折过来点阵高 7 行，**7 行放不下五个汉字** ——
     本轮实测：H=7 时「第七教学楼」糊成一团色块，H=8 才认得出（逐字墨宽
     [7,9,8,7,7]、总宽 42）。⇒ H 取 8，匾额板跟着取 gh+2 = 10 行宽 46。
     **先定的 H，再反推板**；改 H 要同时看 68 段的匾额闸（板宽别撑破门楼留边）。

用法:
  python _qjfont.py          只算 + 出预览图（_look/qjfont_preview.png），不写源码
  python _qjfont.py --write  算完写进 parts/68_qijiao.js 的生成块
"""
import base64
import io
import os
import sys

from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))          # …\源码\_build
PROJ = os.path.dirname(HERE)                               # …\源码
ROOT = os.path.dirname(PROJ)                               # …\像素校园地图项目
TGT = os.path.join(HERE, 'parts', '68_qijiao.js')
LOOK = os.path.join(HERE, '_look')

NAME = u'第七教学楼'
N = len(NAME)                                              # 5

H = 8                    # 出图字高（行）—— 见文件头③（7 糊、8 可认，实测）
REF = 200                # 大字号渲染的像素高（"先大后小"的那个大）
TH = 0.5                 # 面积平均后的覆盖率阈值
GAP_MIN = 1              # 字缝下限（列）
WMAX = 11                # 单字墨宽上限（列）—— 超过就说明缩放出错，闸
FONT_CAND = [
    os.path.join(os.environ.get('WINDIR', r'C:\Windows'), 'Fonts', 'simhei.ttf'),
    os.path.join(os.environ.get('WINDIR', r'C:\Windows'), 'Fonts', 'msyhbd.ttc'),
    os.path.join(os.environ.get('WINDIR', r'C:\Windows'), 'Fonts', 'msyh.ttc'),
]


def load_font():
    for p in FONT_CAND:
        if os.path.exists(p):
            return ImageFont.truetype(p, REF), p
    raise SystemExit('找不到可用的中文字体（试过 %s）' % ' / '.join(FONT_CAND))


def ink_mat(ch, font):
    """单字 → 大字号下的 0/1 掩码（裁到墨框），返回 (mat, w, h)"""
    img = Image.new('L', (REF * 3, REF * 3), 0)
    d = ImageDraw.Draw(img)
    d.text((REF, REF), ch, font=font, fill=255)
    bb = img.getbbox()
    if bb is None:
        raise SystemExit('字形渲染为空：%r' % ch)
    img = img.crop(bb)
    w, h = img.size
    px = img.load()
    return [[1 if px[x, y] > 128 else 0 for x in range(w)] for y in range(h)], w, h


def shrink(mat, w, h, out_h):
    """面积平均缩放到 out_h 行；列宽按同一比例（保持字形长宽比）"""
    out_w = max(3, int(round(w * out_h / float(h))))
    if out_w > WMAX:
        out_w = WMAX
    res = []
    for j in range(out_h):
        y0, y1 = j * h / float(out_h), (j + 1) * h / float(out_h)
        row = []
        for i in range(out_w):
            x0, x1 = i * w / float(out_w), (i + 1) * w / float(out_w)
            s = n = 0
            for y in range(int(y0), max(int(y0) + 1, int(y1 + 0.999))):
                if y >= h:
                    break
                for x in range(int(x0), max(int(x0) + 1, int(x1 + 0.999))):
                    if x >= w:
                        break
                    s += mat[y][x]
                    n += 1
            row.append(1 if n and s / float(n) >= TH else 0)
        res.append(row)
    # 空的边列去掉（缩放的副作用，留着会让字看着偏）
    while res and not any(r[0] for r in res):
        for r in res:
            del r[0]
    while res and not any(r[-1] for r in res):
        for r in res:
            del r[-1]
    return res, (len(res[0]) if res and res[0] else 0), len(res)


def enc(mat):
    """1bit 点阵 → base64（与 63/67 段**同一套位序**：行优先、MSB 在前）"""
    nh, nw = len(mat), len(mat[0])
    raw = bytearray((nh * nw + 7) // 8)
    for j in range(nh):
        for i in range(nw):
            if mat[j][i]:
                k = j * nw + i
                raw[k >> 3] |= 1 << (7 - (k & 7))
    return base64.b64encode(bytes(raw)).decode('ascii')


def gen():
    font, fpath = load_font()
    chars, gaps = [], []
    for ch in NAME:
        big, w, h = ink_mat(ch, font)
        m, mw, mh = shrink(big, w, h, H)
        chars.append((m, mw, mh))
    for i in range(N - 1):
        gaps.append(GAP_MIN)
    total = sum(c[1] for c in chars) + sum(gaps)
    return chars, gaps, total, fpath


def preview(chars, gaps, out):
    """按 10 倍画出最终点阵，供肉眼判读（金面 + 上沿提亮 / 下沿压暗，与 68 段同法）"""
    Z = 10
    LIGHT, DARK, BOARD = (240, 206, 120), (150, 104, 20), (122, 31, 22)
    tw = sum(c[1] for c in chars) + sum(gaps)
    im = Image.new('RGB', ((tw + 4) * Z, (H + 3) * Z), BOARD)
    px = im.load()
    x = 2 * Z
    for ci, (m, mw, mh) in enumerate(chars):
        for j in range(mh):
            for i in range(mw):
                if not m[j][i]:
                    continue
                up = (j == 0) or not m[j - 1][i]
                dn = (j + 1 >= mh) or not m[j + 1][i]
                col = LIGHT if up else (DARK if dn else (216, 173, 62))
                for yy in range(j * Z, (j + 1) * Z):
                    for xx in range(x + i * Z, x + (i + 1) * Z):
                        px[xx, yy] = col
        x += (mw + (gaps[ci] if ci < len(gaps) else 0)) * Z   # 末字后面没有缝
    im.save(out)
    return out


def main():
    chars, gaps, total, fpath = gen()
    print('字体     : %s' % fpath)
    print('字高     : %d 行' % H)
    for i, (m, w, h) in enumerate(chars):
        print('  %d %s  墨 %d×%d  %s' % (i + 1, NAME[i], w, h, enc(m)))
    print('字缝     : %s' % gaps)
    print('总宽     : %d 列（%d 字 + %d 缝）' % (total, sum(c[1] for c in chars), sum(gaps)))
    if total > 52:
        print('⚠️ 总宽 %d > 52 —— 匾额板会撑破门楼两侧的留边' % total)
    p = preview(chars, gaps, os.path.join(LOOK, 'qjfont_preview.png'))
    print('预览图   : %s（10 倍）' % p)

    if '--write' not in sys.argv:
        print('\n（没加 --write，源码一个字没动）')
        return
    src = io.open(TGT, encoding='utf-8').read()
    B, E = '/*__QJ_GEN_BEGIN__*/', '/*__QJ_GEN_END__*/'
    i, j = src.find(B), src.find(E)
    if i < 0 or j < 0:
        raise SystemExit('68_qijiao.js 里找不到 %s / %s 这对标记' % (B, E))
    lines = [B]
    lines.append('const QJ_CHARS = [   /* 逐字 %d 行、宽随各字墨宽（行优先 MSB 在前的 1bit） */' % H)
    for i2, (m, w, h) in enumerate(chars):
        lines.append('  ["%s", %d, %d],   /*  %d  %s  墨高 %d 行 */'
                     % (enc(m), w, h, i2 + 1, NAME[i2], h))
    lines.append('];')
    lines.append('const QJ_GAPS = [%s];   /* 字缝（列） */' % ', '.join(str(g) for g in gaps))
    lines.append(E)
    io.open(TGT, 'w', encoding='utf-8').write(src[:i] + '\n'.join(lines) + src[j + len(E):])
    print('已写入 %s 的生成块（%d 行）' % (os.path.basename(TGT), len(lines)))


main()
