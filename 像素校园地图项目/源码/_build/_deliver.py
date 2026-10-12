# -*- coding: utf-8 -*-
"""把构建产物交付到项目根，并核对 md5 一致。"""
import hashlib, io, os, shutil, sys

# ⚠️ 2026-09-27（第二十一轮）项目搬过目录，旧路径 `D:\desktop\像素校园地图项目\`
#    已不存在 —— 第二十轮就是因为这两行没改而**没投递**。改路径时**两行一起改**，
#    并先跑 `_look\_delivered_r19.html` 那类备份（根目录那份会被原地覆盖）。
PROJ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(PROJ, u'像素校园_全校地图.html')
DST = os.path.join(os.path.dirname(PROJ), u'像素校园_全校地图.html')


def md5(p):
    h = hashlib.md5()
    with open(p, 'rb') as f:
        for blk in iter(lambda: f.read(1 << 20), b''):
            h.update(blk)
    return h.hexdigest()


if not os.path.exists(SRC):
    print('MISSING SRC', SRC); sys.exit(1)
shutil.copyfile(SRC, DST)
a, b = md5(SRC), md5(DST)
print('src', os.path.getsize(SRC), a)
print('dst', os.path.getsize(DST), b)
print('MATCH' if a == b else 'MISMATCH !!')
print('lines', io.open(DST, encoding='utf-8').read().count('\n') + 1)
