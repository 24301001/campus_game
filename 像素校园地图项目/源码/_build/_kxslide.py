# -*- coding: utf-8 -*-
"""打印 `D:\\desktop\\校园示意图.pptx` **第 4 页**（科学会堂正面图）的逐形状几何 + 配色 + z 序。

用法：python _build/_kxslide.py [页码=4]

为什么要有它：61_kxht.js 的立面几何**全部**来自这一页（用户 2026-09-17 拍板的唯一权威），
而 pptx 是 ZIP + OOXML —— 用肉眼看 PPT 只能看个大概，量不出"两翼顶正好抵住檐口带底"
这种关系，也说不清哪个形状压在哪个上面（z 序 = 文档顺序，反了就是两个三角形盖住台阶）。
所以把这一页**逐形状**打印出来，几何按英寸、颜色按 sRGB 十六进制，落成可核对的清单。

⚠️ OOXML 两个坑（本工具已处理）：
  ① `rot` 单位是 1/60000 度；`flipH/flipV` 是 xfrm 的属性不是子元素；
  ② `prstGeom=rtTriangle` 的**直角默认在左下**（顶点 = 左上、右下、左下），
     `rot=270°`（即 `rot=-270` 的等价写法）绕形状**中心**转 ⇒ 视觉顶点要另算，
     不能拿 xfrm 的矩形直接当三角形用。
"""
import io, os, re, sys, zipfile

_HERE = os.path.dirname(os.path.abspath(__file__))      # …\源码\_build
_PROJ = os.path.dirname(_HERE)                          # …\源码
_ROOT = os.path.dirname(_PROJ)                          # …\像素校园地图项目
PPTX = os.path.join(os.path.dirname(_ROOT), '校园示意图.pptx')   # 桌面（用户交付件）
E = 914400.0            # EMU / 英寸


def shapes(page=4):
    z = zipfile.ZipFile(PPTX)
    x = z.read('ppt/slides/slide%d.xml' % page).decode('utf-8')
    out = []
    for i, b in enumerate(re.findall(r'<p:sp>.*?</p:sp>', x, re.S)):
        d = {'i': i}
        m = re.search(r'name="(.*?)"', b)
        d['name'] = m.group(1) if m else '?'
        m = re.search(r'<a:prstGeom prst="(\w+)"', b)
        d['prst'] = m.group(1) if m else '-'
        m = re.search(r'<a:off x="(-?\d+)" y="(-?\d+)"/><a:ext cx="(\d+)" cy="(\d+)"', b)
        if m:
            d['x'], d['y'], d['w'], d['h'] = [int(g) / E for g in m.groups()]
        m = re.search(r'rot="(-?\d+)"', b)
        d['rot'] = int(m.group(1)) / 60000.0 if m else 0.0
        d['fH'] = 'flipH="1"' in b
        d['fV'] = 'flipV="1"' in b
        d['txt'] = ''.join(re.findall(r'<a:t>(.*?)</a:t>', b, re.S))
        sp = re.search(r'<p:spPr>.*?</p:spPr>', b, re.S)
        sp = sp.group(0) if sp else ''
        col = re.findall(r'<a:srgbClr val="([0-9A-Fa-f]{6})"', sp)
        sch = re.findall(r'<a:schemeClr val="(\w+)"', sp)
        d['fill'] = col[0] if col else ('scheme:' + sch[0] if sch else '(none)')
        m = re.search(r'<a:ln w="(\d+)"', sp)
        d['ln'] = int(m.group(1)) / E if m else 0.0
        out.append(d)
    return out


def main():
    page = int(sys.argv[1]) if len(sys.argv) > 1 else 4
    ss = shapes(page)
    print('source: %s  slide %d  (%d shapes)' % (PPTX, page, len(ss)))
    print('%-3s %-10s %-11s %8s %8s %7s %7s %6s %-8s %s'
          % ('#', 'name', 'prst', 'x', 'y', 'w', 'h', 'rot', 'fill', 'text'))
    for d in ss:
        if 'x' in d:
            print('%-3d %-10s %-11s %8.4f %8.4f %7.4f %7.4f %6.1f %-8s %s'
                  % (d['i'], d['name'], d['prst'], d['x'], d['y'], d['w'], d['h'],
                     d['rot'], d['fill'] + (' fH' if d['fH'] else '') + (' fV' if d['fV'] else ''),
                     d['txt']))
        else:
            print('%-3d %-10s %-11s %s' % (d['i'], d['name'], d['prst'], d['txt']))
    # 外框（所有形状的并集）
    xs = [d['x'] for d in ss if 'x' in d] + [d['x'] + d['w'] for d in ss if 'x' in d]
    ys = [d['y'] for d in ss if 'x' in d] + [d['y'] + d['h'] for d in ss if 'x' in d]
    print('union: x %.4f..%.4f  y %.4f..%.4f  (%.4f x %.4f in)'
          % (min(xs), max(xs), min(ys), max(ys), max(xs) - min(xs), max(ys) - min(ys)))


main()
