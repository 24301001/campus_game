# -*- coding: utf-8 -*-
"""把「校园示意图.pptx」第 9 页（第九教学楼正面图）打成 **JS 可直接粘的表**（第二十七轮）。

用法：python _build/_j9slide.py            # 印 JS 字面量
      python _build/_j9slide.py --csv    # 同时出 csv 供人眼对账

## 与第 21 轮（机械楼 / `_jxslide.py`）的三处不同

① **页里有 3 个 `custGeom` 任意多边形**（id4 金门廊、id26/id29 两翼），
   机械楼那页 54 个形状全是轴对齐矩形 ⇒ 本工具**多输出一张 `J9_PATH`**：
   逐条多边形（英寸，相对外框左上角），`J9_EL` 里对应的行把 w/h 留原样、
   末尾一列填该多边形的序号。绘制时"有 pathIndex 就按多边形填，否则按矩形填"。

② **页里有 1 个 TEXT_BOX，内容是「字体插入位置」** —— 那是用户给的**标注**，
   不是立面构件（`_jxslide.py` 里没有这一类）。本工具把它**排除**在 `J9_EL` 之外，
   并把它的框单独输出成 `J9_TXT`：用户说「插入的字体我给你图片了，**位置也在 ppt 中**」
   ⇒ 这个框就是楼名（`预览/jiujiaofont.png`，8 字）的**落位与字号依据**。
   ⚠️ 断言它的文字仍是「字体插入位置」：哪天用户把真图贴进来（改成 PICTURE），
      这一条会先响，提醒重读本文件头。

③ **填充色仍是采样**（第 21 轮那次"照 XML 折算"翻车的教训）：
   第 9 页实测 5 种实色，逐形状取框内众数色，再断言①类↔色一一对应
   ②"照 XML 折算色"必须 0 像素。

## 输出

  x, y, w, h —— **英寸**，相对外框左上角（已减 ex0/ey0）；左上原点
  k          —— 形状类（看**该形状自己的填充**，第十八轮那条铁律）：
                `w` 白瓷砖楼体(bg1 lum85000) · `g` 蓝玻璃(继承 accent1)
                `k` 黑玻璃(tx1 lum75000 lumOff25000) · `d` 门(tx1 lum65000 lumOff35000)
                `m` 金门廊(accent3 lum75000) · `t` 梯形阶梯(prst=trapezoid)
  J9_PAL     —— 类 → **实测色**（67 段的 `J9_C` 必须与它逐条相等，build.py 有断言）
  J9_EW/EH   —— 外框并集（**实测**），67 段的 `sc = footprint 宽 / J9_EW`
  J9_TXT     —— 「字体插入位置」那个文本框的框（楼名的字号依据）

复现色频：见 `_look/j9_palette.txt`（本工具每次运行都会写）。
"""
import csv
import io
import os
import sys

import numpy as np
from PIL import Image

try:
    from pptx import Presentation
except ImportError:
    sys.exit("需要 python-pptx：pip install python-pptx")

HERE = os.path.dirname(os.path.abspath(__file__))
LOOK = os.path.join(HERE, '_look')
PPTX = None
for _c in (r"D:\desktop\像素校园项目总目录\校园示意图.pptx",
           r"D:\desktop\校园示意图.pptx"):
    if os.path.exists(_c):
        PPTX = _c
        break
if PPTX is None:
    sys.exit("找不到 校园示意图.pptx —— 改 _j9slide.py 顶部的候选表")

PNG = os.path.join(LOOK, '_r27_ppt_s9.png')      # 由 _pptshot.py 用 COM 导出的整页图
PAGE = 9
FOOT_W = 450.0                                  # CAMPUS 里第九教学楼的精灵宽（世界像素）
PT = 12700.0                                    # EMU / pt
SC = 192.0                                      # 导出图 px / in（2560 / 13.3333）
NS = {'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
      'p': 'http://schemas.openxmlformats.org/presentationml/2006/main'}

LABEL = u'字体插入位置'                          # 用户给楼名标注的那个文本框
# 第 9 页实测 5 色（`_look/j9_palette.txt` 的色频前 5）：
#   #d9d9d9 白瓷砖体   #4874cb 蓝玻璃   #404040 黑玻璃
#   #595959 门         #b58b02 金门廊
PAL5 = ['#d9d9d9', '#4874cb', '#404040', '#595959', '#b58b02']
DEAD = []                                       # 照 XML 折算会得到、渲染里应为 0 像素的色
# ⚠️ 第 9 页**没有**僵尸色：`bg1 lum85000` 折算出来就是 #d9d9d9（与渲染一致），
#    与第 7 页（accent2 折算 #c65f10 而渲染是 #ee822f）不同。
#    所以本页的 DEAD 只留一个**哨兵**：纯白。整页背景是白的，
#    一旦某块白件被"继承填充"顶掉（透明），它的框内众数色会变成 #ffffff —— 这条就是探针。
DEAD_SENTINEL = '#ffffff'


def kind_of(sp, txt=''):
    """形状类 = 看**该形状自己的填充**（第十八轮那条铁律：不看渲染连通域）。"""
    spPr = sp.find('.//p:spPr', NS)
    g = sp.find('.//a:prstGeom', NS)
    prst = g.get('prst') if g is not None else 'cust'
    fill = 'inherit'          # 没有 a:solidFill ⇒ 走 p:style 的 fillRef = 主题 accent1 蓝
    if spPr is not None:
        el = spPr.find('a:solidFill', NS)
        if el is not None:
            for tag in ('srgbClr', 'schemeClr'):
                c = el.find('a:' + tag, NS)
                if c is not None:
                    mod = ''
                    for m in ('lumMod', 'lumOff', 'shade', 'tint'):
                        e = c.find('a:' + m, NS)
                        if e is not None:
                            mod += ' %s%s' % (m, e.get('val'))
                    fill = ('#%s' % c.get('val').lower()) if tag == 'srgbClr' \
                        else '%s:%s%s' % (tag, c.get('val'), mod)
                    break
    if txt:
        return 'x'                                   # TEXT_BOX（标注，不是构件）
    if prst == 'trapezoid':
        return 't'
    if prst == 'cust':
        if fill == 'schemeClr:bg1 lumMod85000':
            return 'w'                               # 两翼（多边形白体）
        if fill == 'schemeClr:accent3 lumMod75000':
            return 'm'                               # 金门廊（多边形）
        return '?cust:' + fill
    if prst == 'rect':
        if fill == 'inherit':
            return 'g'
        if fill == 'schemeClr:bg1 lumMod85000':
            return 'w'
        if fill == 'schemeClr:tx1 lumMod75000 lumOff25000':
            return 'k'
        if fill == 'schemeClr:tx1 lumMod65000 lumOff35000':
            return 'd'
    return '?' + fill


def path_pts(sp):
    """custGeom 的折线点 → [(x, y)]（**形状本地单位**），外加 (单位宽, 单位高)。"""
    pa = sp.find('.//a:custGeom/a:pathLst/a:path', NS)
    if pa is None:
        return None
    pts = [(int(e.get('x')), int(e.get('y'))) for e in pa.iter()
           if e.tag.endswith('}pt')]
    return pts, int(pa.get('w')), int(pa.get('h'))


def mode_color(a, x0, y0, x1, y1):
    """框内众数色（跳过 1px 边框；y 夹到页内）。"""
    x0, x1 = max(0, int(round(x0 * SC))) + 1, min(a.shape[1] - 1, int(round(x1 * SC))) - 1
    y0, y1 = max(0, int(round(y0 * SC))) + 1, min(a.shape[0] - 1, int(round(y1 * SC))) - 1
    assert x1 > x0 and y1 > y0, '框太小取不到样'
    sub = a[y0:y1 + 1, x0:x1 + 1].reshape(-1, 3)
    u, n = np.unique(sub, axis=0, return_counts=True)
    c = u[n.argmax()]
    return '#%02x%02x%02x' % (c[0], c[1], c[2])


def main():
    prs = Presentation(PPTX)
    sl = prs.slides[PAGE - 1]
    rows, txts = [], []
    for i, sh in enumerate(sl.shapes):
        t = sh.text_frame.text if sh.has_text_frame else ''
        r = dict(idx=i, id=sh.shape_id,
                 k=kind_of(sh._element, t),
                 x=sh.left / PT / 72.0, y=sh.top / PT / 72.0,
                 w=sh.width / PT / 72.0, h=sh.height / PT / 72.0,
                 txt=t.strip(),
                 pts=path_pts(sh._element))
        (txts if r['k'] == 'x' else rows).append(r)
    # ---- ② 标注文本框：排除出构件表，单列成 J9_TXT ---------------------------
    assert len(txts) == 1, '第 %d 页的 TEXT_BOX 不是 1 个而是 %d 个' % (PAGE, len(txts))
    lab = txts[0]
    assert lab['txt'] == LABEL, \
        '那个文本框的文字是「%s」而不是「%s」—— 用户可能已把真图贴进来，重读文件头②' \
        % (lab['txt'], LABEL)

    # ---- ① 颜色一律取采样 --------------------------------------------------
    a = np.array(Image.open(PNG).convert('RGB'))
    for r in rows:
        r['col'] = mode_color(a, r['x'], r['y'], r['x'] + r['w'], r['y'] + r['h'])
    hist = {('#' + '%02x%02x%02x' % tuple(c)): int(n)
            for c, n in zip(*np.unique(a.reshape(-1, 3), axis=0, return_counts=True))}
    for r in rows:
        assert r['col'] in PAL5, \
            'id%d 采到 %s，不在 5 色表里 —— 要么有第六种颜色，要么取样的框被盖住了' \
            % (r['id'], r['col'])
    pal = {}
    for r in rows:
        if r['k'] in pal:
            assert pal[r['k']] == r['col'], \
                '同类不同色：%s 既有 %s 又有 %s（id%d）' % (r['k'], pal[r['k']], r['col'], r['id'])
        pal[r['k']] = r['col']
    assert set(pal) == set('wtgkmd'), '出现了没见过的类：%s' % sorted(pal)
    assert pal['w'] == pal['t'] == '#d9d9d9', '白体/梯形不同色，检查取景'

    # ---- 外框并集（不含标注文本框）------------------------------------------
    ex0 = min(r['x'] for r in rows); ey0 = min(r['y'] for r in rows)
    ex1 = max(r['x'] + r['w'] for r in rows); ey1 = max(r['y'] + r['h'] for r in rows)
    sc = FOOT_W / (ex1 - ex0)

    # ---- 多边形表（只有 3 个，逐条落盘）------------------------------------
    paths = []
    nrect = 0
    for r in rows:
        if r['pts'] is None:
            r['pi'] = -1
            nrect += 1
            continue
        pts, uw, uh = r['pts']
        assert uw > 0 and uh > 0
        # 本地单位 → 英寸（相对外框左上角）。⚠️ 用**框的宽/高分别除**，
        # 不做等比缩放（形状框就是按这两个数放大到 xfrm 的）。
        pl = [((r['x'] - ex0) + px * r['w'] / uw, (r['y'] - ey0) + py * r['h'] / uh)
              for px, py in pts]
        # 收尾点与起点重合的（moveTo 后又 lnTo 回来）去掉，绘制时自动闭合
        if len(pl) > 2 and abs(pl[0][0] - pl[-1][0]) < 1e-6 and abs(pl[0][1] - pl[-1][1]) < 1e-6:
            pl.pop()
        r['pi'] = len(paths)
        paths.append(dict(id=r['id'], k=r['k'], col=r['col'], pts=pl))
    assert len(paths) == 3, '多边形不是 3 个而是 %d 个（_j9slide 文件头①的前提变了）' % len(paths)

    # ---- 落盘 + 印 ---------------------------------------------------------
    buf = ['/* 由 _build/_j9slide.py 生成，勿手改 —— 第 %d 页 %d 个立面构件 + 1 个标注框' % (PAGE, len(rows)),
           '   外框并集 = %.4f x %.4f in，左上角 (%.4f, %.4f) in（x/y 已减去它）；',
           '   `pi >= 0` 的行是**多边形**（点表见 J9_PATH），其余是矩形。',
           '   颜色全部**采样**自 _look/_r27_ppt_s9.png（192 px/in 整页导出）。 */',
           'const J9_EW = %.4f, J9_EH = %.4f;' % (ex1 - ex0, ey1 - ey0)]
    buf[1] = buf[1] % (ex1 - ex0, ey1 - ey0, ex0, ey0)
    buf.append('/* 类 → 实测色（67 段的 J9_C 必须与它逐条相等） */')
    buf.append('const J9_PAL = { %s };'
               % ', '.join("%s: \"%s\"" % (k, pal[k]) for k in sorted(pal)))
    buf.append('const J9_TXT = { x: %.4f, y: %.4f, w: %.4f, h: %.4f };   // 标注框「%s」'
               % (lab['x'] - ex0, lab['y'] - ey0, lab['w'], lab['h'], LABEL))
    buf.append('/* 多边形：逐条点表（英寸，相对外框左上角） */')
    buf.append('const J9_PATH = [')
    for p in paths:
        buf.append('  /* %d */ [%s],   // id%d %s %s'
                   % (p['id'], ', '.join('[%.4f, %.4f]' % (x, y) for x, y in p['pts']),
                      p['id'], p['k'], p['col']))
    buf.append('];')
    buf.append('const J9_EL = [')
    buf.append('  /* k    x       y       w       h      pi     实测色      来源 */')
    for r in sorted(rows, key=lambda r: r['idx']):
        buf.append("  ['%s', %7.4f, %7.4f, %7.4f, %7.4f, %2d],  /* %s  idx%-2d id%-2d */"
                   % (r['k'], r['x'] - ex0, r['y'] - ey0, r['w'], r['h'], r['pi'],
                      r['col'], r['idx'], r['id']))
    buf.append('];')
    tally = {}
    for r in rows:
        tally[r['k']] = tally.get(r['k'], 0) + 1
    buf.append('/* 类计数：%s（矩形 %d + 多边形 %d） */'
               % (' '.join('%s=%d' % kv for kv in sorted(tally.items())), nrect, len(paths)))
    txt = '\n'.join(buf)
    dest = os.path.join(LOOK, 'j9_table.txt')
    io.open(dest, 'w', encoding='utf-8', newline='\n').write(txt + '\n')

    io.open(os.path.join(LOOK, 'j9_palette.txt'), 'w', encoding='utf-8', newline='\n').write(
        '第 %d 页整页导出（%dx%d @ %.0f px/in）色频，前 16 名：\n%s\n\n'
        '类 → 实测色：%s\n'
        % (PAGE, a.shape[1], a.shape[0], SC,
           '\n'.join('  %-9s %8d' % (k, v) for k, v in
                     sorted(hist.items(), key=lambda kv: -kv[1])[:16]),
           '  '.join('%s=%s' % kv for kv in sorted(pal.items()))))
    try:
        print(txt)
    except UnicodeEncodeError:
        pass
    print('\n表已写入（UTF-8）-> %s' % dest)
    print('并集 %.4f x %.4f in  ⇒ sc = %.4f px/in（footprint 宽 %.0f ⇒ 立面高 %d 行）'
          % (ex1 - ex0, ey1 - ey0, sc, FOOT_W, round((ey1 - ey0) * sc)))
    print('标注框 %.4f x %.4f in ⇒ %d x %d 像素'
          % (lab['w'], lab['h'], round(lab['w'] * sc), round(lab['h'] * sc)))

    if '--csv' in sys.argv:
        out = os.path.join(LOOK, 'j9_s9.csv')
        with open(out, 'w', newline='', encoding='utf-8-sig') as fh:
            wr = csv.DictWriter(fh, fieldnames=['idx', 'id', 'k', 'x', 'y', 'w', 'h', 'col', 'pi'],
                                extrasaction='ignore')
            wr.writeheader()
            wr.writerows(rows)
        print('\nCSV -> %s' % out)


if __name__ == '__main__':
    main()
