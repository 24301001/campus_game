# -*- coding: utf-8 -*-
"""二期模块 3 / 4 / 5 的挂载点记录（形象、私聊、公告栏）。

与 `apply_mp_module2.py` 同一条规矩：按内容锚点替换，不靠行号，每处命中恰好一次；
每处先认"已经打上"的标记，认到就跳过 —— 所以它既是安装脚本，也是
"这几处还在不在"的检查脚本（`--check` 只查不写）。

⚠️ 同样**不是**"从一期重造副本"的脚本（那活儿 `apply_login_patch.py` 今天已经跑不动了）。
   它只用于「副本被回退 / 挂载点被误删」时把这几处补回去。

模块 3（照片→形象）改的是**画人那两笔**：自己和室内自己都要先问 `mp/look.js`。
模块 4（点击私聊）和模块 5（公告栏）**不改地图一个字**：
`mp/chat.js` 自己 `addEventListener` 挂 pointer 监听、自己造 DOM，
所以这里只有脚本标签一处。
"""
import io, sys

MAP = "像素校园_多人版.html"
CHECK = "--check" in sys.argv
src0 = io.open(MAP, encoding="utf-8").read()
src = src0

edits = []

# 1) 室外：自己这条 drawList 条目换成"有配方走配方精灵"（模块 2 已经把 `mp:"self"` 挂上了）
edits.append((
    "室外自己形象 mpSelfSprite",
    "mpSelfPose",
    """  drawList.push({ img: player.act ? poseSprite(player.dir, player.act, _pfr) : charSprite(player.dir, player.step), ax: CH_AX, ay: CH_AY, x: player.x, y: player.y, baseY: player.y, clip: chClip, mp: "self" });""",
    """  /* ⭐ 二期模块 3：有自定义形象就走 `charSpriteOf`（照片→配方→小人），没有就退回
     一期那张脸。两条出口都是 18×30 / 锚点 (9,27) —— 生成器内部复用的就是下面
     `buildChar`，规格不可能漂（§13 风险 1）。`mp/look.js` 没拷过来 ⇒ typeof 判空兜住。 */
  const _pimg = player.act
    ? (typeof mpSelfPose === "function" ? mpSelfPose(player.dir, player.act, _pfr) : poseSprite(player.dir, player.act, _pfr))
    : (typeof mpSelfSprite === "function" ? mpSelfSprite(player.dir, player.step) : charSprite(player.dir, player.step));
  drawList.push({ img: _pimg, ax: CH_AX, ay: CH_AY, x: player.x, y: player.y, baseY: player.y, clip: chClip, mp: "self" });"""
))

# 2) 室内：机房 / 逸夫楼 / 食堂里自己也同一口径
edits.append((
    "室内自己形象 mpSelfSprite",
    'ctrDrawChar(g, typeof mpSelfSprite === "function"',
    """    { y: CENTER.y, f: () => ctrDrawChar(g, charSprite(CENTER.dir, CENTER.step), CENTER.x, CENTER.y) }""",
    """    { y: CENTER.y, f: () => ctrDrawChar(g, typeof mpSelfSprite === "function" ? mpSelfSprite(CENTER.dir, CENTER.step) : charSprite(CENTER.dir, CENTER.step), CENTER.x, CENTER.y) }"""
))

# 3) 模块 3 / 4 / 5 的三个文件：都排在 client.js **之前**、主脚本之后
edits.append((
    "脚本 look.js + chat.js",
    '<script src="mp/chat.js"></script>',
    """<script src="mp/client.js"></script>""",
    """<!-- ⭐ 二期模块 3：形象配方与照片分析（`charSpriteOf` / `avatarOf` / `mpLookStudio`）。
     ⭐ 二期模块 4 + 5：点击私聊与公告栏（`mp/chat.js`）—— 它自己挂 pointer 监听、
        自己造 DOM，**不改地图一个字**；命中判定读的是主脚本顶层那些 `const`，
        所以同样必须排在主脚本之后（TDZ）。
     ⚠️ 顺序：look.js → chat.js → client.js。chat.js 里的头像要现画，用得到 look.js；
        client.js 会调 chat.js 的 `mpNetMessage` 转收私聊与公告。
     ⚠️ 这两个文件没拷过来也只是没形象、没私聊、没公告，单机照走（§7.7）。 -->
<script src="mp/look.js"></script>
<script src="mp/chat.js"></script>
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
