# -*- coding: utf-8 -*-
"""第四十三轮一次性探针：造一份「詹天佑雕塑不挂载」的基线产物，供 _propdiff/_sprhash 对账。

不改磁盘上任何一个源文件 —— 只在内存里改 build.py 的文本：
  ① 落盘路径改到 _look/_r43base.html（不覆盖现役产物）；
  ② 在写盘前，把 60 段里本件的三行抹掉（addProp / addSolid / clearZtClearance）。
其余（footprint / 散射随机流 / 所有别的道具与建筑）逐字节相同。
"""
import io, os

HERE = os.path.dirname(os.path.abspath(__file__))

Q = chr(34)                      # " —— 免得在源码里跟转义较劲
NL = chr(10)

src = io.open(os.path.join(HERE, 'build.py'), encoding='utf-8').read()

anchor_out = "OUT  = os.path.join(PROJ, '" + u'像素校园_全校地图.html' + "')"
assert anchor_out in src, 'build.py 的 OUT 行变了，探针要跟着改'
src = src.replace(anchor_out,
                  "OUT  = os.path.join(PROJ, '_build', '_look', '_r43base.html')", 1)

anchor_w = "io.open(OUT, 'w', encoding='utf-8'"

KILL = [
    "addProp(Object.assign({}, ztStand(), { x: ZT_CX, y: ZT_S, tag: " + Q + u'zhantianyou' + Q + " }));",
    "addSolid(ZT_CX, ZT_S, ZT_SOL_W, ZT_SOL_D);",
    "const ztCleared = clearZtClearance();",
]
for k in KILL:
    assert k in src, u'要抹的那一行不在产物里 —— 构建顺序或调用串改了: ' + k
SQ = chr(39)                     # ' —— 注入的 Python 里要用单引号包，否则与被抹的行里的 " 打架
inject = NL.join(["html = html.replace(" + SQ + k + SQ + ", " + SQ + SQ + ")" for k in KILL])
src = src.replace(anchor_w, inject + NL + anchor_w, 1)

tmp = os.path.join(HERE, '_r43base_build.py')
io.open(tmp, 'w', encoding='utf-8', newline=NL).write(src)
print('wrote ' + tmp)
