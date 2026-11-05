# -*- coding: utf-8 -*-
"""用 **PowerPoint 自己**把某一页导成 PNG（COM）。

为什么必须有它：`_pptshapes.py` 读得到的是 `p:spPr/a:solidFill` 里的**变换式**
（`schemeClr:accent2 lumMod75000`），那不是像素；`_pptlib.py` 是自写的 PIL 渲染器，
**会把文字颜色当成形状填充画** —— 2026-09-27 机械工程楼那轮实测：楼名带真身是
`bg1 lumMod85000`（浅灰）+ 文字 `srgbClr FFC000`（金），`_pptlib` 出来的却是
**黄带黑字**（正好对调）。所以配色一律以**本条链路的输出**为准。
（与 §10.3 的坑配套：`scheme:bg1` 这类主题色读出来的字面值与渲染像素不是一回事。）

用法：python _pptshot.py <页码,1起> [出图=_look/ppt_com<N>.png] [宽=2560] [高=1440]

⚠️ 导的是**临时副本**，不是原件 —— 用户的 pptx 可能正开在 PowerPoint 里
（同目录会有 `~$xxx.pptx` 锁文件）。开原件再 `Close()` 会把人家没存的东西一起关掉。
⚠️ **绝不调用 `app.Quit()`**：PowerPoint 是单实例，Dispatch 会挂到用户已经开着的那个
进程上，Quit 等于替用户关掉整个 PowerPoint。只 `Close()` 自己打开的那份副本。
"""
import os
import shutil
import sys
import tempfile

import win32com.client

HERE = os.path.dirname(os.path.abspath(__file__))

PPTX = None
for _c in (r"D:\desktop\像素校园项目总目录\校园示意图.pptx",
           r"D:\desktop\校园示意图.pptx"):
    if os.path.exists(_c):
        PPTX = _c
        break
if PPTX is None:
    sys.exit("找不到 校园示意图.pptx —— 改 _pptshot.py 顶部的候选表")

PAGE = int(sys.argv[1])
OUT = os.path.abspath(sys.argv[2]) if len(sys.argv) > 2 else os.path.join(HERE, '_look', 'ppt_com%d.png' % PAGE)
W = int(sys.argv[3]) if len(sys.argv) > 3 else 2560
H = int(sys.argv[4]) if len(sys.argv) > 4 else 1440

tmpdir = tempfile.mkdtemp(prefix='pptshot_')
tmp = os.path.join(tmpdir, 'deck.pptx')
shutil.copy2(PPTX, tmp)

app = win32com.client.Dispatch("PowerPoint.Application")
pres = None
try:
    pres = app.Presentations.Open(tmp, ReadOnly=True, Untitled=False, WithWindow=False)
    pres.Slides(PAGE).Export(OUT, "PNG", W, H)
    print('page %d -> %s  (%dx%d)' % (PAGE, OUT, W, H))
finally:
    if pres is not None:
        pres.Close()          # ⚠️ 只关副本；不要 Quit
    shutil.rmtree(tmpdir, ignore_errors=True)
