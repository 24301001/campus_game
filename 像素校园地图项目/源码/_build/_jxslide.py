# -*- coding: utf-8 -*-
"""把「校园示意图.pptx」第 7 页（机械工程楼正面图）打成 **JS 可直接粘的表**（第二十一轮）。

用法：python _build/_jxslide.py            # 印 JS 字面量
      python _build/_jxslide.py --csv    # 同时出 csv 供人眼对账

## 唯一权威 = 整页导出图，不是 XML

自动取数的两次翻车都在「照 XML 字面值推」上，所以本工具现在**只认采样**：

① **填充色**：XML 写的是 `schemeClr:accent2 lumMod75000` / `bg1 lumMod75000` /
   `bg1 lumMod85000`。照字面折算会得到 `#c65f10` 楼体 + `#bfbfbf` 柱 + `#d9d9d9` 楼名带。
   但把第 7 页整页导出（2560x1440 = 13.333x7.5 in @ **192 px/in**，正好整页）之后，
   **全图只有 5 种实色**：

       #ffffff 柱 / 白条      #ee822f 楼体 / 附楼 / 三角顶
       #4874cb 玻璃          #ffc000 楼名带的底
       #000000 门 + 楼名带上的字

   `#bfbfbf` / `#c65f10` / `#d9d9d9` **一次都没出现**（0 像素，本工具会断言）。
   另外那一小撮 `#9f7800/#dfa800/#1f1700/#bf9000/#7f6000`（几十像素）是**黑字压在金底上的
   抗锯齿**，不是设计色 —— 别把它当第六种颜色。

   ⇒ 逐形状在导出图上取「框内众数色」，直接得到该形状的真色；再按类做一致性断言
     （同类必须同色，否则响）。**改这一页任何东西，先重跑本工具。**

② **id=11「矩形 10」的 `a:xfrm rot="16200000"`（270°）是个坑，但方向和上一条相反**：
   折叠成轴对齐外框会得到一根「满宽横梁」（x 246..745 pt、y 82..101 pt）——
   第二十一轮第一版就是照这个做的，画出了一道正面图上**根本没有**的横梁。实测：

     · 导出图上 x 1296..1347 px（= 6.751..7.016 in）= **它未旋转的字面框**处，
       有两条竖向描边，从 y=0 一直通到 y≈909；
     · 而折算出的一对横边（y 219 / 270 px = 1.141 / 1.406 in，本应横跨 x 657..1986）
       **一根像素都没有**（`_look/ppt_s7.png` 逐行扫过，见本文末尾的复现命令）。

   ⇒ **渲染没转它**。真实身份：一根**竖向白条**，宽 0.2639 in 与其余柱同宽，
     竖在 id9(6.2632) 与 id8(7.2271) 之间，把那段 0.964 in 的空档切成
     0.489 + 0.475 —— 即**第 9 根柱**（作者复制柱子时忘了改长度，才捅到画布外）。
     本工具按「第 9 根柱」处理：**x/w 用 id11 自己的**，y/h 借**更近的那根邻柱 id8**，
     并在输出行上把这一处**偏离**标明。真正的「正面图里看得见的那条白条」也就是它。

## 输出

  x, y, w, h —— **英寸**，相对外框左上角（已减 ex0/ey0）；左上原点
  k          —— 形状类：`b` 橙楼体 / `c` 白柱·白条 / `g` 蓝玻璃 / `w` 纯白件 /
                `n` 楼名带 / `d` 门(黑) / `t` 三角顶
  JX_PAL     —— 类 → **实测色**（65 段的 `JX_C` 必须与它逐条相等，build.py 有断言）
                ⚠️ 唯一的例外：**楼体色** —— 用户 2026-09-27 第二轮点名「楼的颜色
                给红色一点」，65 段用 `JX_RED`（同饱和/同明度、色相 26.6°→13°），
                build.py ⑧ 会**现算 HSL** 证明它确实是本表 `b` 色的色相偏移。
                本工具与 `JX_EL` 的实测值**一个字都不改**。
  JX_BAND    —— 楼名带（id24）的框，65 段的字体闸按它的高算字高

（不输出描边：54 个形状全描 `accent1` = #4874CB，1pt 在 sc≈25 px/in 下只有 0.35px，
  画出来是噪点不是设计意图。导出图上描边只有 1 px 宽也是这个原因。）

复现①的色频：`python -c "from PIL import Image;from collections import Counter;..."`
见 `_look/jx_palette.txt`（本工具每次运行都会写）。
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
    sys.exit("找不到 校园示意图.pptx —— 改 _jxslide.py 顶部的候选表")

PNG = os.path.join(LOOK, 'ppt_s7.png')          # 由 _pptshot.py 用 COM 导出的整页图
PAGE = 7
PT = 12700.0                                    # EMU / pt
SC = 192.0                                      # 导出图 px / in（2560/13.3333）
NS = {'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
      'p': 'http://schemas.openxmlformats.org/presentationml/2006/main'}

PAL5 = ['#ffffff', '#ee822f', '#4874cb', '#ffc000', '#000000']
DEAD = ['#bfbfbf', '#c65f10', '#d9d9d9']        # 照 XML 折算会得到、但渲染里 0 像素的
ID11 = 11


def kind_of(sp, txt=''):
    """形状类 = 看填充本身（不是看渲染连通域，第十八轮那个错误的根因）。

    ⚠️ 只用来定「这是什么件」；**颜色一律取采样**（见文件头①）。
    """
    spPr = sp.find('.//p:spPr', NS)
    g = sp.find('.//a:prstGeom', NS)
    prst = g.get('prst') if g is not None else 'rect'
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
        return 'n'                                   # 楼名带（带字的那个）
    if prst == 'triangle':
        return 't'
    if fill == 'inherit':
        return 'g'                                   # 主题 accent1 = 玻璃
    if fill == 'schemeClr:accent2 lumMod75000':
        return 'b'
    if fill == 'schemeClr:bg1 lumMod75000':
        return 'c'
    if fill == 'schemeClr:bg1':
        return 'w'
    if fill == 'schemeClr:tx1':
        return 'd'
    return '?' + fill


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
    rows = []
    for i, sh in enumerate(sl.shapes):
        rows.append(dict(idx=i, id=sh.shape_id, rot=sh.rotation,
                         k=kind_of(sh._element,
                                   sh.text_frame.text if sh.has_text_frame else ''),
                         x=sh.left / PT / 72.0, y=sh.top / PT / 72.0,
                         w=sh.width / PT / 72.0, h=sh.height / PT / 72.0,
                         id11=(sh.shape_id == ID11)))
    # ---- ② id11 = 第 9 根柱（x/w 用自己的，y/h 借更近的邻柱）--------------------
    i11 = [r for r in rows if r['id11']]
    assert len(i11) == 1, 'id11 不见了'
    i11 = i11[0]
    nb = min((r for r in rows if r['k'] == 'c' and not r['id11']),
             key=lambda r: abs(r['x'] + r['w'] / 2 - (i11['x'] + i11['w'] / 2)))
    # 前提（变了就说明这页被改过，必须重读文件头②）：rot 是 90 的奇数倍、
    # **字面宽 == 柱宽**、字面高**比柱长**（就是那截捅出去的失控长度）
    assert i11['rot'] % 180 == 90 and abs(i11['w'] - nb['w']) < 1e-6 \
        and i11['h'] > nb['h'] + 1, 'id11 的前提变了（rot / 字面宽 / 字面高）'
    assert abs(i11['w'] - 0.2639) < 1e-3 and abs(nb['h'] - 4.3958) < 1e-3
    i11['y'], i11['h'], i11['from'] = nb['y'], nb['h'], nb['id']

    # ---- ① 颜色一律取采样 --------------------------------------------------
    a = np.array(Image.open(PNG).convert('RGB'))
    for r in rows:
        r['col'] = mode_color(a, r['x'], r['y'], r['x'] + r['w'], r['y'] + r['h'])
    # 帧回归闸：照 XML 折算出来的那三个色，导出图上必须是 0 像素
    hist = {('#' + '%02x%02x%02x' % tuple(c)): int(n)
            for c, n in zip(*np.unique(a.reshape(-1, 3), axis=0, return_counts=True))}
    for d in DEAD:
        assert hist.get(d, 0) == 0, \
            '%s 在导出图上出现了 %d 像素 —— id11/调色板的前提变了，重读文件头①' % (d, hist[d])
    for r in rows:
        assert r['col'] in PAL5, \
            'id%d 采到 %s，不在 5 色表里 —— 要么有第六种颜色，要么取样的框被盖住了' \
            % (r['id'], r['col'])
    # 类 → 色 必须一一对应
    pal = {}
    for r in rows:
        if r['k'] in pal:
            assert pal[r['k']] == r['col'], \
                '同类不同色：%s 既有 %s 又有 %s（id%d）' % (r['k'], pal[r['k']], r['col'], r['id'])
        pal[r['k']] = r['col']
    assert set(pal) == set('bcdgn tw'.replace(' ', '')), '出现了没见过的类：%s' % sorted(pal)
    assert pal['b'] == pal['t'] and pal['c'] == pal['w'], 'b/t 或 c/w 不同色，检查取景'

    # ---- 外框并集（用**按渲染所见**的框）--------------------------------------
    ex0 = min(r['x'] for r in rows); ey0 = min(r['y'] for r in rows)
    ex1 = max(r['x'] + r['w'] for r in rows); ey1 = max(r['y'] + r['h'] for r in rows)
    band = [r for r in rows if r['k'] == 'n']
    assert len(band) == 1, '楼名带不止一个'
    band = band[0]

    # ---- 落盘 + 印 ---------------------------------------------------------
    buf = ['/* 由 _build/_jxslide.py 生成，勿手改 —— 第 %d 页 %d 个形状' % (PAGE, len(rows)),
           '   外框并集 = %.4f x %.4f in，左上角 (%.4f, %.4f) in（x/y 已减去它）；',
           '   每个框都是**按渲染所见**的（id11 按第 9 根柱处理，见文件头②）。',
           '   颜色全部**采样**自 _look/ppt_s7.png（192 px/in 整页导出），见文件头①。 */',
           'const JX_EW = %.4f, JX_EH = %.4f;' % (ex1 - ex0, ey1 - ey0)]
    buf[1] = buf[1] % (ex1 - ex0, ey1 - ey0, ex0, ey0)
    buf.append('/* 类 → 实测色（65 段的 JX_C 必须与它逐条相等） */')
    buf.append('const JX_PAL = { %s };'
               % ', '.join("%s: \"%s\"" % (k, pal[k]) for k in sorted(pal)))
    buf.append('const JX_BAND = { x: %.4f, y: %.4f, w: %.4f, h: %.4f };   // id%d  %s'
               % (band['x'] - ex0, band['y'] - ey0, band['w'], band['h'],
                  band['id'], band['col']))
    buf.append('const JX_EL = [')
    buf.append('  /* k    x       y       w       h         实测色     来源 */')
    for r in sorted(rows, key=lambda r: r['idx']):
        buf.append("  ['%s', %7.4f, %7.4f, %7.4f, %7.4f],  /* %s  idx%-2d id%-2d%s%s */"
                   % (r['k'], r['x'] - ex0, r['y'] - ey0, r['w'], r['h'], r['col'],
                      r['idx'], r['id'], '  rot%d' % r['rot'] if r['rot'] else '',
                      '  ← 第9根柱(y/h 借 id%d)' % r['from'] if r['id11'] else ''))
    buf.append('];')
    tally = {}
    for r in rows:
        tally[r['k']] = tally.get(r['k'], 0) + 1
    buf.append('/* 类计数：%s */' % ' '.join('%s=%d' % kv for kv in sorted(tally.items())))
    txt = '\n'.join(buf)
    dest = os.path.join(LOOK, 'jx_table.txt')
    io.open(dest, 'w', encoding='utf-8', newline='\n').write(txt + '\n')

    io.open(os.path.join(LOOK, 'jx_palette.txt'), 'w', encoding='utf-8', newline='\n').write(
        '第 %d 页整页导出（%dx%d @ %.0f px/in）色频，前 16 名：\n%s\n\n'
        '断言为 0 像素的「照 XML 折算色」：%s\n'
        % (PAGE, a.shape[1], a.shape[0], SC,
           '\n'.join('  %-9s %8d' % (k, v) for k, v in
                     sorted(hist.items(), key=lambda kv: -kv[1])[:16]),
           '  '.join('%s=%d' % (d, hist.get(d, 0)) for d in DEAD)))
    try:
        print(txt)
    except UnicodeEncodeError:
        pass
    print('\n表已写入（UTF-8）-> %s' % dest)
    print('并集 %.4f x %.4f in  ⇒ sc = %.2f px/in' % (ex1 - ex0, ey1 - ey0, 268.0 / (ex1 - ex0)))
    print('/* 类计数：%s */' % ' '.join('%s=%d' % kv for kv in sorted(tally.items())))

    if '--csv' in sys.argv:
        out = os.path.join(LOOK, 'jx_s7.csv')
        with open(out, 'w', newline='', encoding='utf-8-sig') as fh:
            wr = csv.DictWriter(fh, fieldnames=list(rows[0].keys()))
            wr.writeheader()
            wr.writerows(rows)
        print('\nCSV -> %s' % out)


if __name__ == '__main__':
    main()
