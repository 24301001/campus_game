# -*- coding: utf-8 -*-
"""把 建筑物照片\ 里的两张图拷到 ASCII 路径下，方便查看/引用。
⚠️ 不要用 `python -c "…中文路径…"` 调本机 Python：git bash → CreateProcess 的
   命令行编码会把中文参数搞成另一种字符串（现象：listdir 能列出来、把名字**打进去**
   就 FileNotFoundError）。写进 .py 文件由 Python 自己读 UTF-8 源就没这问题。"""
import os, shutil, io

SRC = u'D:\\desktop\\像素校园地图项目\\建筑物照片'
DST = u'D:\\desktop\\像素校园地图项目\\源码\\_build\\_photo'

out = []
if not os.path.isdir(SRC):
    out.append('SRC NOT FOUND: ' + SRC)
    # 退路：从父目录里按名字找
    par = u'D:\\desktop\\像素校园地图项目'
    for f in sorted(os.listdir(par)):
        out.append('  parent entry: ' + f + ' dir=' + str(os.path.isdir(os.path.join(par, f))))
else:
    os.makedirs(DST, exist_ok=True)
    for f in sorted(os.listdir(SRC)):
        src = os.path.join(SRC, f)
        ext = os.path.splitext(f)[1].lower()
        name = 'font.png' if '字体' in f else 'gate' + ext
        shutil.copy(src, os.path.join(DST, name))
        out.append('%s -> %s  %d B' % (f, name, os.path.getsize(src)))

io.open(os.path.join(os.path.dirname(os.path.abspath(__file__)), '_imgs.txt'),
        'w', encoding='utf-8').write('\n'.join(out))
print('done')
