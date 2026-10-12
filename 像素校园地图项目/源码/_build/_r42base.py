# -*- coding: utf-8 -*-
"""第四十二轮一次性探针：造一份「天佑会堂不重绘」的基线产物，供 _propdiff/_sprhash 对账。

不改磁盘上任何一个源文件 —— 只在内存里改 build.py 的文本：
  ① 落盘路径改到 _look/_r42base.html（不覆盖现役产物）；
  ② 在写盘前，把 60 段分发链里那一行新调用抹掉 ⇒ 天佑会堂保持第四十一轮的旧脸。
其余（footprint / addSolid / 散射随机流 / 所有其他建筑）逐字节相同。
"""
import io, os

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(HERE)

Q = chr(34)                      # " —— 免得在源码里跟转义较劲
NL = chr(10)

src = io.open(os.path.join(HERE, 'build.py'), encoding='utf-8').read()

anchor_out = "OUT  = os.path.join(PROJ, '" + u'像素校园_全校地图.html' + "')"
assert anchor_out in src, 'build.py 的 OUT 行变了，探针要跟着改'
src = src.replace(anchor_out,
                  "OUT  = os.path.join(PROJ, '_build', '_look', '_r42base.html')", 1)

anchor_w = "io.open(OUT, 'w', encoding='utf-8'"
assert anchor_w in src, 'build.py 的落盘那一行变了，探针要跟着改'
js = 'else if (name === ' + Q + u'天佑会堂' + Q + ') tyRestyle(b, pal);'
inject = ("html = html.replace('" + js + "', '')" + NL + anchor_w)
assert js in src, '60 段里那条新分发不在产物里 —— 构建顺序或调用串改了'
src = src.replace(anchor_w, inject, 1)

tmp = os.path.join(HERE, '_r42base_build.py')
io.open(tmp, 'w', encoding='utf-8', newline=NL).write(src)
print('wrote ' + tmp)
