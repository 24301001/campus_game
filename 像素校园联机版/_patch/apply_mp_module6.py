# -*- coding: utf-8 -*-
"""二期模块 6（个人中心）的挂载点记录。

和 `apply_mp_module2.py` / `apply_mp_module345.py` 同一条规矩：按内容锚点替换，
不靠行号，每处命中恰好一次；每处先认"已经打上"的标记，认到就跳过 —— 所以它既是
安装脚本，也是"这几处还在不在"的检查脚本（`--check` 只查不写）。

⚠️ 同样**不是**"从一期重造副本"的脚本（那活儿 `apply_login_patch.py` 今天已经跑不动了）。
   它只用于「副本被回退 / 挂载点被误删」时把这一处补回去。

模块 6 只有一处：脚本标签。
`mp/profile.js` 自己造 DOM（左上角头像按钮 / 双选菜单 / 全屏面板 / 缩略卡片）、
自己挂 `P` 键监听，公告栏与聊天窗那三处头像点击本来就留了
`typeof showAvatarMenu === "function"` 的钩子 —— **地图一个字都不用改**。
"""
import io, sys

MAP = "像素校园_多人版.html"
CHECK = "--check" in sys.argv
src0 = io.open(MAP, encoding="utf-8").read()
src = src0

edits = []

edits.append((
    "脚本 profile.js",
    '<script src="mp/profile.js"></script>',
    """<script src="mp/look.js"></script>
<script src="mp/chat.js"></script>
<script src="mp/client.js"></script>""",
    """<script src="mp/look.js"></script>
<script src="mp/chat.js"></script>
<!-- ⭐ 二期模块 6：个人中心（`mp/profile.js`）—— 头像双选菜单 `showAvatarMenu`、
     自己的全屏面板、别人的缩略主页。它自己造 DOM、自己挂 `P` 键监听，
     **不改地图一个字**；排在 chat.js 之后（公告栏与聊天窗的头像点击往它转），
     它只在运行期读全局，所以相对 client.js 前后都行。
     ⚠️ 这个文件没拷过来也只是没个人中心：chat.js 那三处 `typeof showAvatarMenu`
        判空会退回"点头像直接开聊"，一期的玩法一个字节都不动（§7.7）。 -->
<script src="mp/profile.js"></script>
<script src="mp/client.js"></script>"""
))

report = []
for name, marker, old, new in edits:
    if marker in src:
        report.append((name, "已打上"))
        continue
    n = src.count(old)
    if n != 1:
        sys.exit("锚点 %r 命中 %d 次（必须是 1 次，或者标记已经在）：%s" % (name, n, old[:70]))
    src = src.replace(old, new, 1)
    report.append((name, "打上了"))

for name, how in report:
    print("%-26s %s" % (name, how))
if CHECK:
    print("（--check：只查不写）")
    sys.exit(0)
if src != src0:
    io.open(MAP, "w", encoding="utf-8", newline="\n").write(src)
    print("ok: 已写入 %s（%d 字节）" % (MAP, len(src.encode("utf-8"))))
else:
    print("ok: 挂载点齐了，文件未改动")
