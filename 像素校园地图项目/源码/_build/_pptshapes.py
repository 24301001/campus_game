# -*- coding: utf-8 -*-
"""按**形状自己的 fill** 逐个列出 pptx 某页的全部形状（第十八轮 逸夫楼 立的规矩）。

    python _build/_pptshapes.py 6            # 第 6 页，世界坐标用默认换算
    python _build/_pptshapes.py 6 --csv out.csv
    python _build/_pptshapes.py 5 123.3 161.6 0.8396 1.2375   # 自定义原点/比例

## 为什么必须有这个工具（2026-09-19 的教训，花掉一整轮）

逸夫楼那轮，**四套自动验收全绿、连"玻璃区 = 5 个"的计数断言都绿**，而实际上：
  · 表里的 ① 被写成了 ppt 形状 #12 —— 那是 **#D0CECE 浅灰块**，不是玻璃；
  · 真正的第五个玻璃区（右翼底层横带）**整条漏掉**，注释里还留着"未记账"的疑问。
两个错**互相抵消了计数** ⇒ 计数断言的"5"从头到尾都对。

根因：判据取自**渲染图的连通域**。连通域会把
  · 白字"研究生院"在被盖住的板上**挤出来的碎块**，
  · 被后画形状**盖住一半**的块，
算成独立的区域 —— 拿它当"设计意图"的裁判必然错位。

**唯一正确的判据是形状自己的 `fill`**，就是本工具做的事：
直接读 `p:spPr/a:solidFill` 的 XML（`srgbClr` / `schemeClr`），
不经过渲染、不受遮挡与文字影响。

## 两个编号都印出来，别只写一个

`idx` 是 `slide.shapes` 的**枚举下标**（位置，插删形状就变），
`id` 是 `p:cNvPr/@id`（**稳定**，在 XML 里直接搜得到）。
本项目的注释里两者**混用过**（"#12"是 idx、"#30"是 id）⇒ 对账时查不到形状。
**新写注释一律用 `id`，并在同一行带上 idx**，形如 `形状 id=31(idx 26)`。

## 输出里的 `fill` 是 XML 原色，不是渲染色

⚠️ 与 §10.3 的坑配套：`scheme:bg1` 这类**主题色**读出来的字面值（如白）与
渲染出来的像素（如灰）**不是一回事**。所以本工具对主题色只报
`schemeClr:<名>` 让你知道"这里得去看渲染图"，而 `srgbClr` 才是可直接用的实测色。
逸夫楼那轮的做法是：**填充用 srgbClr，配色以渲染像素为准**（两者都记）。
"""
import sys, os, csv

try:
    from pptx import Presentation
except ImportError:
    sys.exit("需要 python-pptx：pip install python-pptx")

# ⚠️ 2026-09-27：项目搬家（旧 `D:\desktop\像素校园地图项目\` 已不存在），这里原来写死旧路径。
#    改成候选表，先找得到哪个用哪个 —— 与 `_pptlib.py` 同一轮一起修。
PPTX = None
for _c in (r"D:\desktop\像素校园项目总目录\校园示意图.pptx",
           r"D:\desktop\校园示意图.pptx"):
    if os.path.exists(_c):
        PPTX = _c
        break
if PPTX is None:
    sys.exit("找不到 校园示意图.pptx —— 改 _pptshapes.py 顶部的候选表")
PT = 12700.0          # EMU / pt
# 幻灯片 → 世界像素（全项目通用；第十八轮实测：逸夫楼立面的自带换算与它完全一致）
OX, OY, SX, SY = 123.3, 161.6, 0.8396, 1.2375

NS = {
    'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
    'p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
}


def _clr(el):
    """把 a:solidFill 的子元素折成一个短字符串。

    ⚠️ **主题色必须带上 lumMod/lumOff**，否则本工具毫无用处：逸夫楼那页 10 个形状全是
    `schemeClr:tx1`（字面=黑），而其中 6 个靠 `lumMod` 渲染成 **#595959 深灰玻璃**、
    4 个渲染成 **#D0CECE 浅灰块** —— 只印 `schemeClr:tx1` 等于把两色混成一色，
    就是当初那个错误的第二个版本。lumMod 是千分数：`lumMod 35000` ⇒ ×0.35
    （0x59 = 89 ≈ 255×0.35 ⇒ 正是 #595959）。"""
    if el is None:
        return "-"
    for tag in ('srgbClr', 'schemeClr', 'prstClr', 'sysClr', 'scrgbClr', 'hslClr'):
        c = el.find('a:' + tag, NS)
        if c is not None:
            v = c.get('val') or c.get('lastClr') or '?'
            if tag == 'srgbClr':
                return '#%s' % v.lower()
            mod = ''
            for m in ('lumMod', 'lumOff', 'shade', 'tint', 'satMod'):
                e = c.find('a:' + m, NS)
                if e is not None:
                    mod += ' %s%s' % (m, e.get('val'))
            return '%s:%s%s' % (tag, v, mod)
    return '?'


def fill_of(sp):
    """形状填充：返回 (XML 原色, 类型)。"""
    spPr = sp.find('.//p:spPr', NS)
    if spPr is None:
        return '-', 'none'
    for tag, name in (('solidFill', 'solid'), ('noFill', 'noFill'),
                      ('gradFill', 'grad'), ('blipFill', 'blip'), ('grpFill', 'grp')):
        el = spPr.find('a:' + tag, NS)
        if el is not None:
            return (_clr(el) if tag == 'solidFill' else '-'), name
    return '-', 'inherit'


def line_of(sp):
    spPr = sp.find('.//p:spPr', NS)
    if spPr is None:
        return '-'
    ln = spPr.find('a:ln', NS)
    if ln is None:
        return '-'
    if ln.find('a:noFill', NS) is not None:
        return 'noLine'
    return _clr(ln.find('a:solidFill', NS)) if ln.find('a:solidFill', NS) is not None else 'inherit'


def text_of(sh):
    try:
        return sh.text_frame.text.replace('\n', '/') if sh.has_text_frame else ''
    except Exception:
        return ''


def main():
    a = sys.argv[1:]
    if not a:
        sys.exit(__doc__.strip())
    page = int(a[0])
    ox, oy, sx, sy = OX, OY, SX, SY
    rest = a[1:]
    csv_out = None
    if '--csv' in rest:
        i = rest.index('--csv')
        csv_out = rest[i + 1]
        rest = rest[:i] + rest[i + 2:]
    if len(rest) >= 4:
        ox, oy, sx, sy = (float(v) for v in rest[:4])

    prs = Presentation(PPTX)
    sl = prs.slides[page - 1]
    X = lambda p: round((p - ox) * sx, 1)
    R = lambda p: round((p - oy) * sy, 1)

    rows, tally = [], {}
    print('page %d  原点 (%.1f, %.1f) × (%.4f, %.4f)   共 %d 个形状'
          % (page, ox, oy, sx, sy, len(sl.shapes)))
    print('idx  id   type          pt(l, t, w, h)                world  x0..x1 / row0..row1            fill        line      text')
    for i, sh in enumerate(sl.shapes):
        l, t = sh.left / PT, sh.top / PT
        w, h = sh.width / PT, sh.height / PT
        f, ft = fill_of(sh._element)
        ln = line_of(sh._element)
        txt = text_of(sh)
        print('%-4d %-4d %-13s %8.1f,%7.1f,%7.1f,%6.1f   %7.1f..%-7.1f / %7.1f..%-7.1f   %-11s %-9s %s'
              % (i, sh.shape_id, str(sh.shape_type).split('(')[0][:13], l, t, w, h,
                 X(l), X(l + w), R(t), R(t + h), f, ln, txt))
        tally[(ft, f)] = tally.get((ft, f), 0) + 1
        rows.append(dict(idx=i, id=sh.shape_id, type=str(sh.shape_type).split('(')[0],
                         pt_l=round(l, 1), pt_t=round(t, 1), pt_w=round(w, 1), pt_h=round(h, 1),
                         wx0=X(l), wx1=X(l + w), row0=R(t), row1=R(t + h),
                         fill=f, fill_type=ft, line=ln, text=txt))
    print('\n-- 按 (填充类型, 原色) 汇总 --')
    for k in sorted(tally, key=lambda k: (-tally[k], str(k))):
        print('  %-18s %d' % ('%s %s' % k, tally[k]))
    if csv_out:
        with open(csv_out, 'w', newline='', encoding='utf-8-sig') as fh:
            w_ = csv.DictWriter(fh, fieldnames=list(rows[0].keys()))
            w_.writeheader()
            w_.writerows(rows)
        print('\nCSV → %s' % os.path.abspath(csv_out))


if __name__ == '__main__':
    main()
