# -*- coding: utf-8 -*-
"""逸夫楼两块楼名标牌 → 1bit 点阵（供 parts/63_yifu.js 用）。

    「逸夫教学楼」五字**竖排**（贴右翼最右端）—— 源 预览/yifujiaoxueloufont.png（1600×2432）
    「研究生院」  四字**横排**（贴研究生院门上方）—— 源 预览/yanjiushengyuanfont.png（2944×1312）

用法：
    python _yffont.py probe     —— 出切分/字高对比表 + 预览图，不写零件
    python _yffont.py           —— 正式生成并拼接进 parts/63_yifu.js 的生成块

⚠️ **两张图的阈值轴不一样，而且是必须的**（见 `load_mask(path, axis)`，逐张给）：

  ① 竖排「逸夫教学楼」（**2026-09-19 用户换的新字图**）：**金色实心字**，
     字身的**饱和度** sat 40..180，底子（浅灰棋盘 + 极淡斜纹）sat 恒为 0~2
     ⇒ 轴是**饱和度** `sat >= TH_SAT (40)`，**一刀切出来就是实心的字身**。
     ⚠️ 换图之前那张是**银白空心字**：字面与底同亮、只有倒角那一圈暗 ⇒ 按亮度
        切到的只是“倒角圈”，圈在笔画细处断裂 ⇒ 出图**碎成一地白渣**
        （用户原话「太飘了」）。那张的补救是“切完按源字高折算加粗 `grow`”——
        本质是**猜回去**。新图把这一整段删掉了：`V_GROW = 0`，不再需要加粗。
        **这就是本轮真正的修复。**

  ② 横排「研究生院」（未换，仍是原来那张）：**银白字**，全图 sat 分位 50/90/99 = 0/2/9，
     **按饱和度切等于全切掉**。它的对比度在**亮度**上：字的倒角边压到 lum 33–120，
     而棋盘格最暗的一格也只到 235 ⇒ 轴是**亮度** `lum < TH_LUM (215)`。
     ⚠️ 它切出来**仍然是“倒角那一圈”**，靠 `binary_closing` 并缝、
        `binary_fill_holes` 兜实心（实测：整幅 65940 px，fill 只加 478 px）。
        横排源字高 758 ⇒ 出 15 行 = 50 源像素/格，倒角圈的锯齿在降采样里被平均掉，
        **所以横排不需要加粗**（`H_GROW = 0`，理由见 down() 的 grow 注释）。

⚠️ 另一个只有这张源图才有的坑：**「研究生院」下面压着一条通长横线**
   （y≈1037..1153，横跨 x243..2680）。它比任何一横都长 ⇒ 会在**列/行投影**上
   把四个字连成一块，还会把 `binary_fill_holes` 引到线上去。
   处理办法是**先按"整行几乎全亮"把这条线挖掉**，再做投影 —— 见 `strip_bars()`。
   右下角还有一枚「豆包AI生成」水印，按角块直接清。
"""
import io, os, sys, base64
from PIL import Image
import numpy as np
from scipy import ndimage

HERE = os.path.dirname(os.path.abspath(__file__))          # …\源码\_build
PROJ = os.path.dirname(HERE)                               # …\源码
ROOT = os.path.dirname(PROJ)                               # …\像素校园地图项目
TGT = os.path.join(HERE, 'parts', '63_yifu.js')

SRC_V = os.path.join(ROOT, u'预览', 'yifujiaoxueloufont.png')  # 逸夫教学楼（竖排 5 字）
SRC_H = os.path.join(ROOT, u'预览', 'yanjiushengyuanfont.png')  # 研究生院（横排 4 字）

TH_SAT = 40       # 「逸夫教学楼」的轴：**饱和度**。字身金/米色 sat 40..180，
#   底子（浅灰棋盘 + 极淡斜纹）sat 恒为 0~2 ⇒ 中间是**空档**，40 落在正中。
#   实测（2026-09-19 新图）：sat>=25 → 字身连成 5 个整块（各 2.7~5.1 万 px），
#   sat>=60 → 笔画内部开始掏空、字框不变。取 40。
TH_LUM = 215      # 「研究生院」的轴：**亮度**。⚠️ 这个数不是随便挑的，是**量出来的**：
#   棋盘格最亮的一格与字的倒角边之间，背景还压着一层**极淡的斜向噪纹**。实测连通域个数：
#     th=235 → V 图 12049 个 / H 图 5866 个（几乎全是噪点，投影被填满、四个字切不开）
#     th=225 → V 358 / H 418
#     th=215 → V  427 / H 412      ← 平台区：再降噪点不再减少，而字还完整
#   所以取 215。字本身在 th=215 下倒角边仍连续（倒角是极暗的，实测最低到 33）。
COV = 0.42        # 覆盖率阈值（与 _kxfont.py 同值）
MINRUN = 60       # 投影里短于这个宽度的块当噪声丢掉
MINCOMP = 200     # 闭合补洞后，连通域小于这个像素数当噪声
#   ⚠️ 这个数取小值是有来历的：**旧的**竖排图是银白空心字，倒角描边按亮度切时
#      多处断裂，一个字被劈成十来块（实测最大块 8141 px、多数只有 100–2000）——
#      取 3000 会把「逸」的笔画整段删掉、字框从 231 行缩到 142 行，而**明细表里的
#      字高、字宽全都照常打印**，看上去只是"字瘦了点"。
#      换图后（金色实心字、按饱和度切）五个字各是**一个**连通域（2.7~5.1 万 px），
#      200 只兜掉残余散点。真正的去噪由 `strip_noise`（3×3 开）负责。
BAR_W, BAR_AR = 1200, 8   # 「通长横条」判据：宽 > 1200 且 宽/高 > 8
JOIN = 0.12       # 碎片并回判据：缝宽 < JOIN × 较宽那块（见 split() 里的实测表）

# 逐字目标字高（世界像素）—— probe 定稿后回填
V_NAMES = [u'逸', u'夫', u'教', u'学', u'楼']
V_IDS = ['YI', 'FU', 'JIAO', 'XUE', 'LOU']
H_NAMES = [u'研', u'究', u'生', u'院']
H_IDS = ['YAN', 'JIU', 'SHENG', 'YUAN']

# --- 点阵目标尺寸（世界像素）-----------------------------------------------
#   ⚠️ 这两个数与 parts/63_yifu.js 的 YF_V_W / YF_H_H **必须一致** ——
#      build.py 有断言把两处钉住：尺寸一脱钩，标牌要么糊出牌面、要么缩成一小撮。
#   定尺寸的依据是 ppt 第 6 页里两块标牌各自的**实际占位**。竖排那块要按
#   **pptx 形状几何**算，不能照渲染图目测（目测会把方字看成竖字）：
#     逸夫教学楼 TEXT_BOX = ppt 点 871.8..897.3 × 198.6..314.9，
#       按 world_x=(pt−123.3)×0.8396、row=(pt−161.6)×1.2375 换算
#       ⇒ world x 628.4..649.9（宽 21.6、中心 639.15）、行 45.8..189.7（高 143.9）。
#       5 字 ⇒ 字距约 26.6。
#   ⚠️ **2026-09-19（用户第二轮）：字缩到原来的一半 —— 20×26 ⇒ 10×13**，
#      字距同步减半（63 段的 YF_V_PITCH 26.6 → 13.3）。原话「太大」。
#      此时**横向压缩反而更狠**：换图后的字身是**宽扁行书**（w/h ≈ 1.61，比旧图的
#      1.38 还宽），塞进 10 宽的竖条要压 2.09 倍。所以 `V_COV` 必须**比旧值更低**：
#      压缩后笔画常常一格只覆盖 20%~30%，cov 取 0.42 会把整根笔画抹掉、字变成实心块
#      （实测出图：cov 0.40 时五字全是白疙瘩）。**0.22 是唯一还留得住字内空当的值**。
#      ⚠️ 这个尺寸下复杂字（逸 / 教 / 楼）**在 1× 档认不出是字**，这是用户明确选的
#         （"就按一半"）—— 1× 看是细碎纹理、3× 档能认出字形轮廓。别再"为了可读"偷偷放大。
#     研究生院  ：横排，贴在鲜红门牌（x 334.0..413.0 / 行 219.4..270.8）上，
#                 4 字共 56 宽 ⇒ 字高 15、宽随各字长宽比、字距 1.5（**未改**）
V_H, V_W = 13, 10
H_H = 15
# ⚠️ `grow` 现在**两块都是 0**：竖排换图后按饱和度切出来的就是实心字身，不需要
#    再靠膨胀"猜回去"（旧图要用 grow=3 补断裂的倒角圈，见文件头 §①）；
#    横排源字高 758 ⇒ 出 15 行 = 50 源像素/格，倒角圈的锯齿在降采样里被平均掉了。
#    留这个参数是因为 down() 的语义是通用的（`_kxfont.py` 那一族也用它）。
V_COV, V_GROW = 0.22, 0
H_COV, H_GROW = COV, 0


def load_mask(path, axis=u'lum', kill_corner=None):
    """→ np.bool_ 二值图（实心）。

    `axis` 决定用哪条轴切，**必须逐张给**（两张源图的字身一个有色一个没色）：
      'sat' ⇒ `max(RGB) − min(RGB) >= TH_SAT`，切**金色实心字身**（竖排那张）；
      'lum' ⇒ `mean(RGB) < TH_LUM`，切**银白空心字的倒角圈**（横排那张）。
    ⚠️ 给错轴的后果不是报错，是**整幅前景被清空或填满**：竖排图按 lum 切只剩
       倒角圈（一碰就碎）、横排图按 sat 切是**零像素**（那张图 sat 分位 99 才到 9）。
    `kill_corner` = 右下角要清掉的 (宽比, 高比)，默认不清（新竖排图没有水印）。"""
    a = np.array(Image.open(path).convert('RGB')).astype(np.int16)
    if axis == u'sat':
        m = (a.max(axis=2) - a.min(axis=2)) >= TH_SAT
    else:
        m = a.mean(axis=2) < TH_LUM
    H, W = m.shape
    if kill_corner:
        m[int(H * (1 - kill_corner[1])):, int(W * (1 - kill_corner[0])):] = False
    # ⚠️ 顺序是定死的：去噪 → 删横条 → 闭合补洞。任意两步对调都坏。
    return solid(strip_bars(strip_noise(m)))


def strip_bars(m):
    """挖掉源图里那条**通长下划线**（「研究生院」底下，实测 2696×52、横跨到画面右缘）。

    判据：连通域 **宽 > BAR_W 且 宽/高 > BAR_AR** —— 汉字没有这么扁长的一横
    （四个字里最扁的「生」长宽比也只有 0.96）。
    ⚠️ 早先按"某一行有 >半图宽的连续段"逐行扫，只杀掉 33 行（线的上下缘那两笔
       描边不连续），线身留着，投影照旧连成一块 —— 所以改成按连通域整块删。
    ⚠️ 必须跑在 `binary_closing` **之前**：闭合会把线与它上方的字黏在一起，
       那时任何判据都拆不开（实测 th=235 时线与「院」已经连成一块 2696×104）。"""
    lab, n = ndimage.label(m)
    if not n:
        return m
    # ⚠️ keep[0] 是**背景标签**，必须是 False。早先写成 `np.ones(n+1, bool)`，
    #    于是 `keep[lab]` 把整幅背景翻成前景（返回全 True、True 数恰等于画面像素数）。
    #    这个 bug 不报错、不抛异常，只是把"删掉那条线"变成"把整张图涂黑"——
    #    而下游的投影、切分、降采样全都照跑，直到出图才看得出是一团黑。
    keep = np.zeros(n + 1, bool)
    keep[1:] = True
    for i, o in enumerate(ndimage.find_objects(lab)):
        h = o[0].stop - o[0].start
        w = o[1].stop - o[1].start
        if w > BAR_W and w / float(max(1, h)) > BAR_AR:
            keep[i + 1] = False
    return keep[lab]


def solid(m):
    """把**轮廓**补成**实心**字。
    ⚠️ 闭合核用 5×5 不是 7×7：7×7 会把散落的噪点互相黏成一张网
       （实测 th=215 下 7×7 闭合后整幅图变成**一个** 3.86M px 的连通域）。
       去噪的正确位置是闭合**之前**的 `binary_opening`，不是靠核的大小兜。"""
    m = ndimage.binary_closing(m, np.ones((5, 5)))
    m = ndimage.binary_fill_holes(m)
    lab, n = ndimage.label(m)
    if n:
        sizes = ndimage.sum(m, lab, range(1, n + 1))
        keep = np.zeros(n + 1, bool)
        for i in range(n):
            if sizes[i] >= MINCOMP:
                keep[i + 1] = True
        m = keep[lab]
    return m


def strip_noise(m):
    """3×3 开运算：只删"细到 3×3 盒里都塞不满"的散点。
    这一步必须**在 `strip_bars` 与任何闭合之前** —— 实测旧竖排图（亮度轴 th=215）下
    背景斜纹留下 400 余个 1–40 px 的散点，散点的行/列投影非零 ⇒ 切字的剖面被填满，
    "五个字"会连成一块 1594×2426 的整图。新图按饱和度切，斜纹是中性色（sat≈0）、
    本来就不进掩膜，但这一步对横排那张仍然是必需的。"""
    return ndimage.binary_opening(m, np.ones((3, 3)))


def split(m, axis, dens=0.02, minlen=40, join=JOIN):
    """按**行/列密度剖面**切字。axis=0 ⇒ 按行切（竖排）；axis=1 ⇒ 按列切（横排）。

    ⚠️ 为什么不用"投影 > 0"：那要求字之间**整行/整列一个像素都没有**，
       而背景斜纹经 `strip_noise` 之后仍有残余 ⇒ 永远切不开。
       密度剖面天然把字和残余噪点分开：实测 V 图字的行有 100–173 个暗像素，
       噪纹行只有个位数 —— 取 `max × 0.02`（≈3）就干净地切成 5 段。
       ⚠️ 这个比例不是拍的：V 图在 0.02 处**恰好**给出 5 段、长度 210/193/201/202/220，
          与各字已知的字框（高 231/222/238/261/255）逐字对应，且再放大到 0.06
          仍是 5 段（0.03–0.06 之间有一段平台）—— 平台中央才敢取。

    ⚠️ **光有密度剖面不够，还得再把碎片并回去**——这是「研究生院」那张图逼出来的：
       它是**行草连笔**，「生」的起笔撇、「院」的左耳旁都**与字身断开**，
       断开处的列剖面掉到阈值下 ⇒ 4 个字被切成 6 块（宽 472/408/**71**/212/**120**/325）。
       实测两类空隙的量级差得很开（单位 px）：
           字**间**缝 153 / 130 / 174   ← 缝里剖面最高只剩 0–8
           字**内**缝   8 /   7        ← 缝里剖面**恰好为 0**（不是"低"，是空）
       ⇒ 判据取"缝宽 < `JOIN` × 较宽那块"。0.12 × 472 ≈ 57，稳稳夹在 8 与 130 之间，
         两边各有一个数量级的余量（10 或 100 都行，是平台）。
       ⚠️ 别改成"缝里剖面为 0 就并"：字间缝 1284..1413 的剖面**也是 0**，那样会把四个字并成一个。"""
    prof = m.sum(axis=1 if axis == 0 else 0)
    if prof.max() <= 0:
        return []
    on = prof > prof.max() * dens
    idx = np.where(on)[0]
    if len(idx) == 0:
        return []
    brk = np.where(np.diff(idx) > 1)[0]
    segs = []
    for s in np.split(idx, brk + 1):
        a, b = int(s[0]), int(s[-1])
        if segs and a - segs[-1][1] - 1 < join * max(b - a + 1, segs[-1][1] - segs[-1][0] + 1):
            segs[-1] = (segs[-1][0], b)          # 同一字的另一半
        else:
            segs.append((a, b))
    segs = [(a, b) for a, b in segs if b - a + 1 >= minlen]
    out = []
    for a, b in segs:
        sub = m[a:b + 1, :] if axis == 0 else m[:, a:b + 1]
        # 再按另一轴裁紧。⚠️ 这里**也要用密度阈值、不能用 `> 0`**：`> 0` 只要该切窗里
        #    落了一粒残余散点，整条边就被撑出去（实测「逸夫教学楼」被撑到 287–301 宽，
        #    而字身实际只有 255 上下）。0.05 相对的是**这一块自己的**峰值，与 `dens` 无关。
        p2 = sub.sum(axis=0) if axis == 0 else sub.sum(axis=1)
        rr = np.where(p2 > p2.max() * 0.05)[0]
        if len(rr) == 0:
            continue
        out.append(sub[:, rr.min():rr.max() + 1] if axis == 0 else sub[rr.min():rr.max() + 1, :])
    return out


def down(m, th, force_w=None, cov=COV, grow=0):
    """面积平均降采样 → 1bit。

    ⚠️ `grow` 是**源像素**为单位的加粗（先膨胀再降采样）。**两块现在都是 0。**
       它的来历：**旧的**竖排图字身是白面 + 灰倒角、按亮度只切到"倒角那一圈"，
       倒角圈降采样后笔画只剩 1–2 格、对角笔画断成虚线（20×26 下曾是一团乱麻），
       所以要在降采样前把圈加粗。加粗量按**源字高**折算：字高 207 → 出 26 行，
       1 源像素 = 0.126 格 ⇒ grow=3 才等效 0.75 格。两张源图字高差 3.7 倍
       （207 vs 758）⇒ 同一个 grow 的等效加粗也差 3.7 倍，**这个参数只能逐块给**。
       **2026-09-19 换图后**竖排按饱和度切出来就是实心字身，**不再需要它**。
       参数留着是因为 down() 的语义是通用的（`_kxfont.py` 那一族也用它）。

    ⚠️ `force_w` 是给**竖排**那一列用的、不是通用的：
       「逸夫教学楼」五个源字形的长宽比在 0.61–0.67 之间抖（行草，笔画外廓不齐），
       各按自己的比例出格会得到一个**参差的右边缘**，而它是挂在右翼最右端的一条
       竖牌 —— 参差在画面上就是"字没对齐"。
       统一压到 10×13（= 0.77）后，每个字横向被拉/压的幅度一致，整列左右边缘齐平。
       ⚠️ 换图后的字身更宽（w/h ≈ 1.61），压到 0.77 是 **2.09 倍**横向压缩 ——
          这是"缩到一半"的必然代价，`V_COV` 已经为它降到 0.22（见尺寸块注释）。
       横排的「研究生院」**不传这个参数**：「生」的 h/w 是 1.6，强行拉方要横向撑 1.4 倍，
       那个变形是看得见的 —— 横排本来就该按各字自然宽度排（见 63_yifu.js 的排布）。"""
    bh, bw = m.shape
    if grow:
        m = ndimage.binary_dilation(m, np.ones((2 * grow + 1, 2 * grow + 1)))
    tw = force_w if force_w else max(2, int(round(th * bw / float(bh))))
    f = np.array(Image.fromarray(m.astype(np.uint8) * 255).resize((tw, th), Image.BOX),
                 dtype=np.float32) / 255.0
    return [[1 if f[y][x] >= cov else 0 for x in range(tw)] for y in range(th)]


def b64(m):
    """MSB 优先（与 36 libBits / 49 sgBits / 55 gyBits / 61 KX_MASK 同一约定）"""
    bits = [v for row in m for v in row]
    by = bytearray()
    for i in range(0, len(bits), 8):
        v = 0
        for j in range(8):
            v = (v << 1) | (bits[i + j] if i + j < len(bits) else 0)
        by.append(v)
    return base64.b64encode(bytes(by)).decode()


def sheet(rows, Z=5, bg=(0x50, 0x4c, 0x48)):
    W = max(sum(len(m[0]) for m in ms) + 4 * (len(ms) - 1) for _, ms in rows)
    tiles = []
    for label, ms in rows:
        t = Image.new('RGB', (W, len(ms[0]) + 2), bg)
        pp = t.load()
        x = 0
        for m in ms:
            for j in range(len(m)):
                for i in range(len(m[0])):
                    if m[j][i]:
                        pp[x + i, j + 1] = (0xf2, 0xf4, 0xf8)
            x += len(m[0]) + 4
        tiles.append((label, t))
    s = Image.new('RGB', (W, sum(t.height + 8 for _, t in tiles)), (0x20, 0x1e, 0x1c))
    y = 0
    for _, t in tiles:
        s.paste(t, (0, y)); y += t.height + 8
    return s.resize((s.width * Z, s.height * Z), Image.NEAREST)


def ascii_art(m):
    return '\n'.join(''.join('#' if v else '.' for v in row) for row in m)


def build():
    gv = split(load_mask(SRC_V, u'sat'), 0)   # 金色实心字 ⇒ 饱和度轴
    gh = split(load_mask(SRC_H, u'lum'), 1)   # 银白空心字 ⇒ 亮度轴（见 load_mask）
    return gv, gh


def probe():
    mv, mh = build()
    print('逸夫教学楼（竖排）切出 %d 块：' % len(mv))
    for m in mv:
        print('   %dx%d  h/w=%.2f' % (m.shape[1], m.shape[0], m.shape[0] / float(m.shape[1])))
    print('研究生院（横排）切出 %d 块：' % len(mh))
    for m in mh:
        print('   %dx%d  h/w=%.2f' % (m.shape[1], m.shape[0], m.shape[0] / float(m.shape[1])))
    print()
    for th in (10, 13, 16, 20, 26):
        ds = [down(m, th, max(2, int(round(th * 10 / 13.0))), cov=V_COV, grow=V_GROW) for m in mv]
        print('逸夫教学楼 字高 %2d → 逐字宽 %s，总高（含 4 个 %s 字距）%s' % (
            th, [len(d[0]) for d in ds], 13.3, sum(len(d) for d in ds) + 4 * 13.3))
        ds2 = [down(m, th) for m in mh]
        print('研究生院   字高 %2d → 逐字宽 %s，总宽（含 %d 缝）%d' % (
            th, [len(d[0]) for d in ds2], 4, sum(len(d[0]) for d in ds2) + 4 * 3))
    for th in (13, 16, 26):
        rows = [('v%d 逸夫教学楼' % th,
                 [down(m, th, max(2, int(round(th * 10 / 13.0))), cov=V_COV, grow=V_GROW) for m in mv]),
                ('h%d 研究生院' % th, [down(m, th) for m in mh])]
        p = os.path.join(HERE, '_yfprobe_%d.png' % th)
        sheet(rows).save(p)
        print(' ->', p)
    # ⚠️ 分段预览画的是**未切分的整幅掩膜**，不是 build() 返回的字块列表。
    #    早先这里直接写 `m * 255`（m 是列表）⇒ AttributeError: 'list' object has no
    #    attribute 'astype'。切分结果另有 sheet() 预览，两者的用途不同、别混。
    for tag, src, ax in (('v', SRC_V, u'sat'), ('h', SRC_H, u'lum')):
        m = load_mask(src, ax)
        q = os.path.join(HERE, '_yfprobe_seg_%s.png' % tag)
        # 按 3 倍降采样落盘（原图 1600×2432 / 2944×1312，整幅看才看得出切在哪）
        Image.fromarray((m * 255).astype(np.uint8)).resize(
            (m.shape[1] // 3, m.shape[0] // 3), Image.BOX).save(q)
        print(' ->', q, '  前景 %d px' % int(m.sum()))


def gen():
    """正式生成：把两块标牌的点阵写进 parts/63_yifu.js 的 `/*__YF_GEN_BEGIN__*/` 块。"""
    mv = split(load_mask(SRC_V, u'sat'), 0)
    mh = split(load_mask(SRC_H, u'lum'), 1)
    assert len(mv) == len(V_NAMES), \
        u'逸夫教学楼切出 %d 块，应为 %d —— 切分参数（dens/JOIN/MINCOMP）被动过？' % (
            len(mv), len(V_NAMES))
    assert len(mh) == len(H_NAMES), \
        u'研究生院切出 %d 块，应为 %d —— 切分参数（dens/JOIN/MINCOMP）被动过？' % (
            len(mh), len(H_NAMES))
    dv = [down(m, V_H, V_W, cov=V_COV, grow=V_GROW) for m in mv]
    dh = [down(m, H_H, cov=H_COV, grow=H_GROW) for m in mh]
    L = []
    L.append(u'/*__YF_GEN_BEGIN__*/')
    L.append(u'/* ==== 由 _build/_yffont.py 生成，勿手改 ==== */')
    L.append(u'/* 两块楼名标牌的点阵。源（用户给）：')
    L.append(u'     预览/yifujiaoxueloufont.png —— 逸夫教学楼（竖排 5 字，2026-09-19 用户换的新图）')
    L.append(u'     预览/yanjiushengyuanfont.png —— 研究生院  （横排 4 字）')
    L.append(u'   ⚠️ **两张图的阈值轴不一样**：竖排新图是金/米色实心字 ⇒ 按**饱和度**')
    L.append(u'      sat>=40 一刀切出实心字身；横排那张是银白空心字（sat 恒≈0）⇒ 只能按')
    L.append(u'      **亮度** lum<215 切"倒角那一圈"，再 closing + fill_holes 兜成实心。')
    L.append(u'   整条流水线的坑（为什么换图能修掉"碎成一地白渣"）都写在 _yffont.py 开头。')
    L.append(u'   ⚠️ 这里**故意不写坐标**：排布在调用点现算（63_yifu.js §5.13.7），')
    L.append(u'      写死一份必然和调用点对不上。 */')
    L.append(u'const YF_V_CHARS = [   /* 逸夫教学楼：竖排 5 字，逐字 %d×%d（见 _yffont.py 的 V_W/V_H）' % (V_W, V_H))
    L.append(u'                            = 用户"缩到原来的一半"后的尺寸（原 20×26） */')
    for nm, d in zip(V_NAMES, dv):
        L.append(u'  ["%s", %d, %d],   /* %s */' % (b64(d), len(d[0]), len(d), nm))
    L.append(u'];')
    L.append(u'const YF_H_CHARS = [   /* 研究生院：横排 4 字，逐字高 %d、宽随各字长宽比 */' % H_H)
    for nm, d in zip(H_NAMES, dh):
        L.append(u'  ["%s", %d, %d],   /* %s */' % (b64(d), len(d[0]), len(d), nm))
    L.append(u'];')
    L.append(u'/*__YF_GEN_END__*/')
    blk = u'\n'.join(L)

    src = io.open(TGT, encoding='utf-8').read()
    a = src.index(u'/*__YF_GEN_BEGIN__*/')
    b = src.index(u'/*__YF_GEN_END__*/') + len(u'/*__YF_GEN_END__*/')
    io.open(TGT, 'w', encoding='utf-8', newline='\n').write(
        src[:a] + blk + src[b:])
    print(u'写好 %s' % TGT)
    print(u'  逸夫教学楼 %d 字，逐字 %dx%d' % (len(dv), V_W, V_H))
    print(u'  研究生院   %d 字，逐字高 %d、宽 %s' % (len(dh), H_H, [len(d[0]) for d in dh]))


if __name__ == '__main__':
    if len(sys.argv) > 1 and sys.argv[1] == 'probe':
        probe()
    else:
        gen()
