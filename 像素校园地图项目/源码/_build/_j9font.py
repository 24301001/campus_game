# -*- coding: utf-8 -*-
"""第九教学楼楼名「计算机科学与技术学院」→ 1bit 点阵（供 parts/67_j9.js 用）。

    源（用户给，2026-09-27 23:11 落盘）：预览/jiujiaofont.png（2592×832）
    —— **金色 3D 立体字**，**横排 10 字**，右下角带一枚「豆包AI生成」水印。

用法：
    python _build/_j9font.py probe     —— 出切分/字号表 + 预览图（_look/_r27_font_probe.png），不写零件
    python _build/_j9font.py           —— 正式生成并拼接进 parts/67_j9.js 的生成块
    python _build/_j9font.py --h 10    —— 换字高重生成（默认 %d）

## 三件与 `_yffont.py` 不同的事

① **源图没有 alpha**（mode = RGB）：底子是**烤进像素的**浅灰棋盘（249/230/242），
   不是透明通道 ⇒ 切分只能按颜色。**轴 = 饱和度**：字身金 `sat` 40..180+，
   棋盘灰 `sat` 恒 0..10 ⇒ 实测分位 50/90/99 = 3/10/157，**40 落在正中空档**。
   一刀切出来就是实心字身（不需要 closing/fill_holes）。

② **右下角那枚水印不用管**：整块 `sat < 40`（实测右 400 × 下 130 px 内
   sat>=40 的像素 **0 个**）⇒ 饱和度轴自带"去水印"，不必像 `_yffont.py` 那样按角块挖。

③ ⚠️ **字号：全图统一缩放率 + 底边对齐**（这是本方与 `_yffont.py` 最实质的差别）。
   源图各字的墨迹高差得很开（261 → 197 px，**1.32 倍**）。若像 `_yffont.py` 那样
   **逐字各自拉满 H 行**，「与」（197）会被抻到和「算」（261）一样高，一眼就假。
   CJK 各字**同坐一条基线**（与 的最下一横、计 的十底都在基线上）⇒ 正确做法是
   拿**一个**缩放率 `s = H / (最高那个字的墨迹高)` 去缩所有字，再**底边对齐**。
   实测：H=%d 时 s = %d/261 ⇒ 各字落到 %d~%d 行（见 probe 表），这才是原样的比例。

④ **横向宽度是被匾额反推死的，不是随便挑的**：ppt 上门廊那道金匾（`J9_PATH[0]`）
   内宽 `1.9583 in × 41.6774 px/in = 82 px`，用户那个标注框宽 `1.8069 in = 75 px`。
   实测两个候选（见 `_look/_r27_font_probe.png`）：

   | H | 逐字宽 | 缝 | 总宽 | 落位 |
   |---|---|---|---|---|
   | **9（当前）** | 7,6,7,6,5,5,7,6,5,7 | 10 | **71** | 在用户框（75）**内**，金匾两侧各留 4~5 px |
   | 10 | 8,7,8,7,5,6,7,6,6,8 | 12 | **80** | 金匾里只剩 1 px，**顶穿用户框 5 px** |
   | 11 | — | — | 84 | **顶穿金匾** |

   ⇒ 取 H=9：用户「**位置也在ppt中**」给的就是那个框，H=9 是唯一同时落在
   "框内 + 匾内" 的档；H=10 更清楚一点，但要拿"框外 5 px"换。
   ⚠️ 横向是**硬约束**（H=11 就已经顶穿匾额）；竖向上限是 `min(匾高 34, 框高 17)`。

⚠️ 立体字的**投影/厚度**也算在字身里（`sat` 对金与暗金都 >= 40）⇒ 字自带一层
   右/下的暗金。绘制端（67 段 §5.16 的 `j9Glyph`）按"笔画上沿提亮、下沿压暗"
   把它读出来 —— 与 `_yffont.py` 的 brush 逐条同构。

⑤ ⚠️ **覆盖率阈值 COV 取 0.22，不是别处那份 0.42**（一处必须记下来的**偏离**）。
   0.42 在 **1/8 的纵向缩放**下会把字底那几行**细笔画带**整行判空：输出一行要吃源图
   ~32 行（`H=9`、源墨高 285），而这一行里往往只剩两三根竖笔（如「科」的斗底、
   「算」的廾底）。实测（`--cov` 逐档跑，逐字墨迹最低行）：

   | COV | 逐字墨迹最低行 | 墨迹量 |
   |---|---|---|
   | 0.42 | 8,7,7,6,8,8,8,8,8,8 | 13~24 |
   | 0.30 | 8,7,8,7,8,8,8,8,8,8 | 13~28 |
   | **0.22** | **8,8,8,8,8,8,8,8,8,8** | 16~31 |
   | 0.16 | 8,8,8,8,8,8,8,8,8,8 | 17~35（「院」占 78%，开始糊成实心） |

   ⇒ 0.42 时「科」只占 5 行（2..6）、「算/机」占 7 行、其余占 8 行 —— **各字高低不齐**，
      正是用户在第 24 轮点过名的「不能看起来很不均匀」。0.22 让**每一字的墨迹都踩到
      第 8 行**（底边真齐了），墨迹量只涨了三成；再降到 0.16 就是实心块。
   ⚠️ 横向宽度**不受 COV 影响**（一个字多宽取的是源图墨迹的**列**极值，不是逐行阈值）
      ⇒ 总宽仍是 71 px，撞不到金匾那 82 px 的硬约束。
   ⚠️ build.py ⑩c-4 有一条**按这条实测写死**的判据（"每字最低墨迹行必须 = 8"），
      改 COV 会在那儿先响。
"""
import base64
import io
import os
import sys

import numpy as np
from PIL import Image
from scipy import ndimage

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(errors='replace')     # 控制台是 GBK，`=>` 之外的符号一律降级

HERE = os.path.dirname(os.path.abspath(__file__))          # …\源码\_build
PROJ = os.path.dirname(HERE)                               # …\源码
ROOT = os.path.dirname(PROJ)                               # …\像素校园地图项目
TGT = os.path.join(HERE, 'parts', '67_j9.js')
SRC = os.path.join(ROOT, u'预览', 'jiujiaofont.png')
LOOK = os.path.join(HERE, '_look')

NAME = u'计算机科学与技术学院'
N = len(NAME)                                              # 10

TH_SAT = 40        # 轴：**饱和度**（理由见文件头①）
# ⚠️ **本文与 `_yffont.py` / `_kxfont.py` 不同值**（那两处 0.42）—— 见文件头⑤。
COV = 0.22         # 覆盖率阈值
GAP_COL = 8        # 列投影里窄于这个宽度的空档不当切分点
MINCOMP = 200      # 连通域小于这个像素数当噪点
GAP_MIN = 1        # 字缝下限（列）—— 源图实测缝 0.6~1.7 px，取整后基本就是它

H = 9              # 出图字高（行）—— 见文件头③④


def load_mask(path):
    """饱和度轴 → bool 掩膜（顺带把小于 MINCOMP 的连通域当噪点去掉）。"""
    a = np.array(Image.open(path).convert('RGB')).astype(int)
    mx, mn = a.max(2), a.min(2)
    sat = np.where(mx > 0, (mx - mn) * 255 // np.maximum(mx, 1), 0)
    m = sat >= TH_SAT
    lab, n = ndimage.label(m, structure=np.ones((3, 3)))
    if n:
        sizes = ndimage.sum(m, lab, range(1, n + 1))
        for i, s in enumerate(sizes):
            if s < MINCOMP:
                m[lab == i + 1] = False
    return m


def boxes(m, n=N):
    """列投影切成 n 个字。返回 [(xa, xb, ya, yb)] —— **行号是绝对行的**，
    底边对齐（文件头③）要用它。"""
    cols = m.any(0)
    runs, s = [], None
    for i, v in enumerate(cols):
        if v and s is None:
            s = i
        elif not v and s is not None:
            runs.append((s, i)); s = None
    if s is not None:
        runs.append((s, len(cols)))
    assert runs, u'什么都没切出来 —— 阈值 TH_SAT=%d 被动过？' % TH_SAT
    # 窄空档并回（立体字的笔画尖角会在列投影上断开）
    merge = [runs[0]]
    for a, b in runs[1:]:
        if a - merge[-1][1] < GAP_COL:
            merge[-1] = (merge[-1][0], b)
        else:
            merge.append((a, b))
    assert len(merge) == n, \
        u'切出 %d 块，应为 %d —— 切分参数（TH_SAT/GAP_COL/MINCOMP）被动过？' \
        % (len(merge), n)
    out = []
    for a, b in merge:
        rows = m[:, a:b].any(1)
        y0, y1 = int(np.argmax(rows)), int(len(rows) - np.argmax(rows[::-1]))
        out.append((a, b, y0, y1))
    return out


def carve(m, bx, s, th):
    """出一个字的点阵：统一缩放率 s、底边贴到第 th 行。
    返回 (mat, w, h_ink)：mat 是**完整 th 行**（上面空行也补上），绘制端不必再管对齐。"""
    xa, xb, ya, yb = bx
    w = max(2, int(round((xb - xa) * s)))
    h = max(1, min(th, int(round((yb - ya) * s))))
    sub = m[ya:yb, xa:xb].astype(np.uint8) * 255
    f = np.array(Image.fromarray(sub).resize((w, h), Image.BOX), dtype=np.float32) / 255.0
    ink = [[1 if f[j][i] >= COV else 0 for i in range(w)] for j in range(h)]
    return [[0] * w for _ in range(th - h)] + ink, w, h


def layout(m):
    """整段排版：出 (chars, gaps, s, 表)。chars[i] = mat（th 行 × w），
    gaps[i] = 第 i 与 i+1 字之间的缝（列）。"""
    bs = boxes(m)
    gtop = min(b[2] for b in bs)
    gbot = max(b[3] for b in bs)
    s = H / float(gbot - gtop)
    chars, ink_h = [], []
    for bx in bs:
        mat, w, h = carve(m, bx, s, H)
        chars.append(mat); ink_h.append(h)
    gaps = [max(GAP_MIN, int(round((bs[i + 1][0] - bs[i][1]) * s))) for i in range(N - 1)]
    return chars, gaps, s, (bs, gtop, gbot, ink_h)


def enc(mat):
    """1bit 点阵 → base64（与 63 段那两张牌**同一套位序**：行优先、MSB 在前）。"""
    nh, nw = len(mat), len(mat[0])
    raw = bytearray((nh * nw + 7) // 8)
    for j in range(nh):
        for i in range(nw):
            if mat[j][i]:
                k = j * nw + i
                raw[k >> 3] |= 1 << (7 - (k & 7))
    return base64.b64encode(bytes(raw)).decode('ascii')


def total_w(chars, gaps):
    return sum(len(c[0]) for c in chars) + sum(gaps)


def draw_preview(chars, gaps, out):
    """按 8 倍画出最终点阵，供肉眼判读。金色面 + 上沿提亮 / 下沿压暗（与 67 段同法）。"""
    Z, LIGHT, DARK = 8, (236, 205, 112), (96, 64, 8)
    W = total_w(chars, gaps)
    im = Image.new('RGB', ((W + 2) * Z, (H + 2) * Z), (181, 139, 2))   # 底 = 匾额金 #b58b02
    pxl = im.load()
    x = Z
    for ci, mat in enumerate(chars):
        for j in range(H):
            for i in range(len(mat[j])):
                if not mat[j][i]:
                    continue
                up = (j == 0) or not mat[j - 1][i]
                dn = (j + 1 >= H) or not mat[j + 1][i]
                col = DARK if dn else LIGHT
                for dy in range(Z):
                    for dx in range(Z):
                        pxl[x + i * Z + dx, Z + j * Z + dy] = col
        x += len(mat[0]) * Z
        if ci < len(gaps):
            x += gaps[ci] * Z
    im.save(out)
    print(u'预览 -> %s  （点阵 %d x %d，%d 倍）' % (out, W, H, Z))


def probe():
    m = load_mask(SRC)
    print(u'源图 %s  %s  墨迹像素 %d' % (SRC, Image.open(SRC).size, int(m.sum())))
    chars, gaps, s, (bs, gtop, gbot, ink_h) = layout(m)
    print(u'切出 %d 块（目标 %s，%d 字）  墨迹纵跨 %d..%d = %d px'
          % (len(bs), NAME, N, gtop, gbot, gbot - gtop))
    print(u'统一缩放率 s = %.5f（= %d / %d）' % (s, H, gbot - gtop))
    print(u'  #  字  源(宽x高)   相对底边   出图(宽)  出图(墨高)  出图(顶行)')
    for i, (c, bx) in enumerate(zip(NAME, bs)):
        w = len(chars[i][0])
        print(u' %2d  %s  %3dx%3d    %3d..%3d    %2d       %2d          %2d'
              % (i + 1, c, bx[1] - bx[0], bx[3] - bx[2], bx[2] - gtop, bx[3] - gtop,
                 w, ink_h[i], H - ink_h[i]))
    print(u'出图逐字宽 %s  合计 %d' % ([len(c[0]) for c in chars], sum(len(c[0]) for c in chars)))
    print(u'字缝(列)   %s  合计 %d' % (gaps, sum(gaps)))
    print(u'>>> 总宽 %d px（匾额内宽 82 px，用户标注框 75 px）' % total_w(chars, gaps))
    draw_preview(chars, gaps, os.path.join(LOOK, '_r27_font_probe.png'))


def gen():
    m = load_mask(SRC)
    chars, gaps, s, (bs, gtop, gbot, ink_h) = layout(m)
    tw = total_w(chars, gaps)
    L = [u'/*__J9_GEN_BEGIN__*/',
         u'/* ==== 由 _build/_j9font.py 生成，勿手改 ==== */',
         u'/* 楼名点阵。源（用户给）：预览/jiujiaofont.png —— 「%s」横排 %d 字，' % (NAME, N),
         u'   金色 3D 立体字，底子是**烤进像素的浅灰棋盘**（无 alpha）=> 按**饱和度**',
         u'   sat>=%d 切（分位 50/90/99 = 3/10/157，40 落在正中空档）；右下角那枚' % TH_SAT,
         u'   「豆包AI生成」水印整块 sat<40，自带过滤。整条流水线见 _j9font.py 文件头。',
         u'   ⚠️ 各字**同用一个缩放率** s = %d / %d = %.5f、**底边对齐**' % (H, gbot - gtop, s),
         u'      （源图墨高 261..197 差 1.32 倍；逐字各自拉满会把「与」抻成「算」那么高）。',
         u'   ⚠️ 字高 %d 与字缝都是**被匾额宽度反推**的：金匾内宽 82 px，这里总宽 %d px。'
         % (H, tw),
         u'      改字号先看 _j9font.py 文件头③④。',
         u'   ⚠️ 这里**故意不写坐标**：落位在调用点现算（67 段 §5.16 的 j9Plaque）。 */',
         u'const J9_CHARS = [   /* 逐字 %d 行（上补空行，底边对齐）、宽随各字墨宽 */' % H]
    # ⚠️ 第三个字段是**出图字高**（= H，含上补空行）；绘制端 j9Glyph 按它走位，
    #    不许在 67 段再写一份 H（坑 18：派生量不许存第二份）。
    for i, (nm, mat) in enumerate(zip(NAME, chars)):
        L.append(u'  ["%s", %2d, %d],   /* %2d  %s  墨高 %d 行 */'
                 % (enc(mat), len(mat[0]), len(mat), i + 1, nm, ink_h[i]))
    L.append(u'];')
    L.append(u'const J9_GAPS = [%s];   /* 字缝（列），源图字距按同一 s 缩来 */' % ', '.join(map(str, gaps)))
    L.append(u'/*__J9_GEN_END__*/')
    blk = u'\n'.join(L)

    src = io.open(TGT, encoding='utf-8').read()
    a = src.index(u'/*__J9_GEN_BEGIN__*/')
    b = src.index(u'/*__J9_GEN_END__*/') + len(u'/*__J9_GEN_END__*/')
    io.open(TGT, 'w', encoding='utf-8', newline='\n').write(src[:a] + blk + src[b:])
    print(u'写好 %s' % TGT)
    print(u'  %s：%d 字，逐字高 %d，宽 %s'
          % (NAME, len(chars), H, [len(c[0]) for c in chars]))
    print(u'  总宽 %d px（字缝 %d）' % (tw, sum(gaps)))


if __name__ == '__main__':
    if '--h' in sys.argv:
        H = int(sys.argv[sys.argv.index('--h') + 1])
    if '--cov' in sys.argv:
        COV = float(sys.argv[sys.argv.index('--cov') + 1])
    if len(sys.argv) > 1 and sys.argv[1] == 'probe':
        probe()
    else:
        gen()
