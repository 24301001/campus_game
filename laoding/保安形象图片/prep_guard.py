# -*- coding: utf-8 -*-
"""保安三张表情图 —— 一次性预处理：抠白底 → 按脸对齐 → 输出到 laoding/assets/。

为什么要"按脸对齐"：三张图**构图不一样** ——
  · 微笑 / 正常 是**半身**（1664×2496，头顶到胯）
  · 思考 是**头肩特写**（1280×1920，脸占的画面比例大一半）
直接按同一宽度缩放贴上去，对话里一换表情**头会"啪"地放大/位移**，比现在还假。
所以统一到一个**公共画布**上，按**脸**缩放+定位 ⇒ 换表情时头原地不动，只有表情/姿势变。

对齐量取自「**肤色框**」：`(r>185)&(g>135)&(g<220)&(b>105)&(b<195)&(r-b>38)&(r-g>22)`
取最大连通块（＝脸+脖子+耳；两只手是更小的另两块）。实测这个框的**几何中心**在三张图上
都正好落在**眼睛高度**（已出 `_face_check.png` 目视核对过），所以：
  缩放 = 目标脸高 / 框高      定位 = 框中心对到公共画布的脸心
⚠️ 不写死任何一张的像素坐标 —— 换图重跑不用改常数。

抠白底：白底不透明（mode=RGB，没有 alpha）⇒ 必须自己抠。
  ① 阈值 `min(r,g,b) < 240` 取前景（这个阈值 230~242 之间主体面积稳定，取中）
  ② **只留最大连通块** ⇒ 右下角那行"豆包AI生成"水印是独立小块，**顺手就摘掉了**
  ③ `binary_fill_holes` 把衬衫/领口的浅色洞补回来
  ④ **去白边**：主体内每个像素的颜色换成**最近的核心像素**的颜色（距离变换），
     否则抗锯齿那一圈留的是"主体×白"的混合色，贴在深色底上会有一圈灰白光晕
  ⑤ 1px 软边（高斯）

用法：
  python prep_guard.py                 # 输出 6 张到 laoding/assets/
  python prep_guard.py --sheet         # 只出对照片 _sheet.png，不写 assets
"""
import os, glob, sys
import numpy as np
from PIL import Image
from scipy import ndimage

SRC = 'D:/desktop/像素校园项目总目录/laoding/保安形象图片'
DST = 'D:/desktop/像素校园项目总目录/laoding/assets'
HERE = os.path.dirname(os.path.abspath(__file__))

# 公共画布 840×1080（长宽比 0.778，与原 SVG 的 120/156=0.769 基本一致）。
# 取景是**比**出来的（出过 `_frame_cands.png` 四档对照，按真实显示宽度 150px 看）：
#   · 720 宽时肩**顶出画面两侧**（横向硬切），头也偏小
#   · 840 宽时肩完整入画、四周留白，头大小可读
# 脸高 0.44H 是我这套图的源决定的上限：源图肩宽≈脸宽 3.2 倍（原 SVG 只有 1.5 倍），
# 想让整条肩线进画面，脸就不可能再大。
CW, CH = 840, 1080
FACE_H = 0.440 * CH          # 脸框高（发际→脖子根）占画布高的比例
EYE_Y = 0.350 * CH           # 眼睛高度落在哪一行（原 SVG 是 64/156=0.41）

# 文件名里的关键字 → 输出名。关键字取各文件名里唯一的那一段。
MOODS = [
    ('正常表情', 'normal', '正常'),
    ('思考表情', 'think',  '思考'),
    ('微笑表情', 'smile',  '微笑'),
]


def cut(path):
    """抠白底 → RGBA（含去白边）。返回 (rgba, fg_mask)"""
    rgb = np.asarray(Image.open(path).convert('RGB')).astype(np.int16)
    fg = rgb.min(axis=2) < 240
    lab, n = ndimage.label(fg)
    sz = ndimage.sum(fg, lab, range(1, n + 1))
    fg = (lab == (int(np.argmax(sz)) + 1))                    # 只留最大块（水印一起没）
    fg = ndimage.binary_fill_holes(fg)
    core = ndimage.binary_erosion(fg, np.ones((3, 3)), iterations=2)
    idx = ndimage.distance_transform_edt(~core, return_distances=False, return_indices=True)
    clean = rgb[idx[0], idx[1]]
    alpha = ndimage.gaussian_filter(fg.astype(np.float32), 0.8)
    alpha[~ndimage.binary_dilation(fg, np.ones((3, 3)), iterations=2)] = 0.0
    return np.dstack([clean.astype(np.uint8), (np.clip(alpha, 0, 1) * 255).astype(np.uint8)]), fg


def face_box(rgb):
    """脸的锚：(cx, cy, h)。

    cy / h 取自「**肤色框**」（脸+脖子+耳的最大连通块）：框的**中心行**实测落在**眼睛高度**，
    框高当脸的尺度。**不用框心 x 当脸心** —— 框含脖子、含耳，三张图里框心与脸的对称轴差
    5~12 源像素（换算到画布 ≈11px，换表情时脸会横着挪一下）。
    x 改用**眼睛那一带的脸上左右边界中点**（±0.08h 的横带，已 `binary_fill_holes`），
    实测三张图的偏移从 +12/−5/+9 收敛到 ≈0。
    """
    r, g, b = rgb[:, :, 0].astype(np.int16), rgb[:, :, 1].astype(np.int16), rgb[:, :, 2].astype(np.int16)
    skin = (r > 185) & (g > 135) & (g < 220) & (b > 105) & (b < 195) & ((r - b) > 38) & ((r - g) > 22)
    lab, n = ndimage.label(skin)
    assert n, '没检出肤色块 —— 阈值该调了'
    sz = ndimage.sum(skin, lab, range(1, n + 1))
    face = ndimage.binary_fill_holes(lab == (int(np.argmax(sz)) + 1))
    ys, xs = np.where(face)
    cy = (ys.min() + ys.max()) / 2.0
    h = float(ys.max() - ys.min() + 1)
    band = face[int(cy - 0.08 * h):int(cy + 0.08 * h)]           # 眼高横带
    bxs = np.where(band.any(axis=0))[0]
    return (bxs.min() + bxs.max()) / 2.0, cy, h


def place(rgba, cx, cy, bh):
    """按脸对齐贴到公共画布上。返回 RGBA 画布。"""
    s = FACE_H / bh
    im = Image.fromarray(rgba, 'RGBA').resize((max(1, round(rgba.shape[1] * s)),
                                               max(1, round(rgba.shape[0] * s))), Image.LANCZOS)
    canvas = Image.new('RGBA', (CW, CH), (0, 0, 0, 0))
    canvas.alpha_composite(im, (round(CW / 2 - cx * s), round(EYE_Y - cy * s)))
    return canvas


def face_box_canvas(canvases):
    """给小头像/圆挂件用的**统一方形裁框**（三张共用同一个框）。

    ⚠️ 不能以眼睛为中心硬算半个框：框会**切掉头发顶**（第一版就栽在这儿 ——
    62px 圆挂件里头顶是平的）。改成从**三张画布的并集**取头顶那一行，
    再留出下巴以下的余量，保证整个头进框、且三张的裁框完全一致（换表情不跑）。
    """
    top = min(int(np.where((np.asarray(c)[:, :, 3] > 0).any(axis=1))[0][0]) for c in canvases)
    size = 1.42 * FACE_H
    y0 = top - 0.06 * size
    return (round(CW / 2 - size / 2), round(y0), round(CW / 2 + size / 2), round(y0 + size))


def save_png(im, path):
    """256 色量化后再存 —— 原图 ~750 KB/张，量化后 ~100 KB（13%），
    实测差异全在线条边缘的抖动（线条画本来就有），皮肤渐变区几乎逐像素相同
    （出过 `_quant_check.png` 对照：左原图 / 中量化 / 右差异×8）。"""
    im.quantize(colors=256, method=Image.FASTOCTREE).save(path, optimize=True)


def main():
    sheet = '--sheet' in sys.argv
    if not sheet:
        assert os.path.isdir(DST), '没有 assets 目录：' + DST
    outs = []
    for key, out, zh in MOODS:                      # 第一趟：抠 + 对齐 + 贴到公共画布
        p = sorted(glob.glob(os.path.join(SRC, '*' + key + '*.png')))
        assert len(p) == 1, '关键字 %s 命中 %d 个文件' % (key, len(p))
        rgba, fg = cut(p[0])
        cx, cy, bh = face_box(rgba[:, :, :3])
        canvas = place(rgba, cx, cy, bh)
        print('%-4s 源%-11s 脸框 %4.0f×%-4.0f 中心(%4.0f,%4.0f)  缩放 %.3f' %
              (zh, '%dx%d' % rgba.shape[1::-1], bh * 0.65, bh, cx, cy, FACE_H / bh))
        outs.append((out, canvas))
    fb = face_box_canvas([c for _, c in outs])      # 第二趟：**三张共用**的方脸裁框
    print('小头像统一裁框 %s  (%d×%d)' % (str(fb), fb[2] - fb[0], fb[3] - fb[1]))
    if not sheet:
        for out, canvas in outs:
            save_png(canvas, os.path.join(DST, 'guard-%s.png' % out))
            face = canvas.crop(fb).resize((160, 160), Image.LANCZOS)
            save_png(face, os.path.join(DST, 'guard-%s-face.png' % out))

    if sheet:
        w = sum(c.width for _, c in outs) // 2
        sh = Image.new('RGB', (w + 40, CH // 2 + 40), (245, 246, 248))
        x = 10
        for out, c in outs:
            sh.paste(c.resize((CW // 2, CH // 2), Image.LANCZOS), (x, 20), c.resize((CW // 2, CH // 2), Image.LANCZOS))
            x += CW // 2 + 10
        sh.save(os.path.join(HERE, '_sheet.png'))
        print('-> _sheet.png', sh.size)
    else:
        for out, _ in outs:
            for suf in ('', '-face'):
                q = os.path.join(DST, 'guard-%s%s.png' % (out, suf))
                print('   %-28s %7d B' % ('guard-%s%s.png' % (out, suf), os.path.getsize(q)))


if __name__ == '__main__':
    main()
