# -*- coding: utf-8 -*-
"""二期模块 2 的六处挂载点：把联机客户端 `mp/client.js` 接进地图。

与 `apply_login_patch.py` 同一条规矩：按内容锚点替换，不靠行号，每处必须命中恰好一次。
不同之处：这六处在**当前副本**上是常驻的，所以这里做成**可重复跑**——
每一处先认"已经打上"的标记，认到就跳过，认不到才替换。这样它既是安装脚本，
也是"这六处还在不在"的检查脚本（`--check` 只查不写）。

⚠️ 它**不是**"从一期重造副本"的脚本：这份副本比一期的冻结文件多了四十多轮改动，
    `apply_login_patch.py` 今天从一期原文件跑就已经在第八步断言失败（`bindQuick` 锚点
    对不上）。所以本脚本只用于「副本被回退 / 挂载点被误删」时把这六处补回去。
"""
import io, sys

MAP = "像素校园_多人版.html"
CHECK = "--check" in sys.argv
src0 = io.open(MAP, encoding="utf-8").read()
src = src0

edits = []

# 1) 联机样式：排在一期那段 </style> 之后（同名选择器才轮到它赢）
edits.append((
    "样式 mp/theme.css",
    '<link rel="stylesheet" href="mp/theme.css">',
    """</style>
</head>""",
    """</style>
<!-- ⭐ 二期模块 2：联机 UI 的样式单独一个文件（任务书 §10.1「不覆盖一期样式」）。
     它排在一期那段之后 ⇒ 同名选择器会赢，所以文件里**只许**出现 `#mp*` 这些联机自己的
     id。文件没拷过来也只是没样式，功能不受影响（`mp/client.js` 里全部画在 canvas 上）。 -->
<link rel="stylesheet" href="mp/theme.css">
</head>"""
))

# 2) 室内（计算机中心 / 逸夫楼 / 食堂）：同场景玩家并进 `who` 那条排序数组
edits.append((
    "室内玩家 ctrDraw",
    "mpIndoorPeers",
    """  const who = [
    { y: n.y,      f: () => ctrDrawChar(g, n.spr(n.dir, n.step), n.x, n.y) },
    { y: CENTER.y, f: () => ctrDrawChar(g, charSprite(CENTER.dir, CENTER.step), CENTER.x, CENTER.y) }
  ].sort((a, b) => a.y - b.y);
  for (const o of who) o.f();""",
    """  const who = [
    { y: n.y,      f: () => ctrDrawChar(g, n.spr(n.dir, n.step), n.x, n.y) },
    { y: CENTER.y, f: () => ctrDrawChar(g, charSprite(CENTER.dir, CENTER.step), CENTER.x, CENTER.y) }
  ];
  if (typeof mpIndoorPeers === "function") for (const o of mpIndoorPeers(g, Z, ox, oy)) who.push(o);
  who.sort((a, b) => a.y - b.y);
  for (const o of who) o.f();
  /* §7.1：自己脚下多一圈青色淡光环（与 NPC 那个交互光圈同色），联机时才亮。 */
  if (typeof mpIndoorSelfRing === "function") mpIndoorSelfRing(g, Z, ox, oy);"""
))

# 3a) 室外：给自己那条 drawList 条目挂上 `mp: "self"`，画完才认得出该亮光环
edits.append((
    "室外自己 mp:self",
    'mp: "self"',
    """baseY: player.y, clip: chClip });""",
    """baseY: player.y, clip: chClip, mp: "self" });"""
))

# 3b) 室外：玩家必须在 `sort` **之前**并进 drawList，才拿得一期的 baseY 深度遮挡
edits.append((
    "室外玩家 mpCollectPeers",
    "mpCollectPeers",
    """  drawList.sort((a, b) => a.baseY - b.baseY);""",
    """  /* ⭐ 二期模块 2：同场景的其他玩家并进这条数组 —— 按 `baseY` 排序自然被楼挡住，
     这就是"不穿模"的全部实现（§7.1 层级），一期那套排序一个字都不改；
     别人**不参与碰撞**（§7.1）。⚠️ 必须在 `sort` 之前调用；单机回落时它自己
     early-return，画面与一期逐字相同。 */
  if (typeof mpCollectPeers === "function") mpCollectPeers(drawList, ox, oy, viewW, viewH);
  drawList.sort((a, b) => a.baseY - b.baseY);"""
))

# 3c) 室外：画完一笔之后补昵称 / 光环（继承上面 occlAlpha 的淡入淡出）
edits.append((
    "室外装饰 mpDrawDecor",
    "mpDrawDecor",
    """      ctx.drawImage(it.img, dx, dy, it.img.width * zoom, it.img.height * zoom);
    }
  }
}""",
    """      ctx.drawImage(it.img, dx, dy, it.img.width * zoom, it.img.height * zoom);
    }
    /* ⭐ 二期模块 2：这条目要是"人"（自己 / 别的玩家），补一笔装饰 ——
       自己 = 脚下青色淡光环，别人 = 头顶昵称（12 px 屏幕字号，不随缩放变大）。
       ⚠️ 排在 `drawImage` **之后**：这样它天然继承上面 `occlAlpha` 的那层淡入淡出，
          人被楼挡住时名字和光环一起淡，不会出现"楼里飘着一个名字"。 */
    if (it.mp && typeof mpDrawDecor === "function") mpDrawDecor(ctx, it, dx, dy, zoom);
  }
}"""
))

# 4) 联机客户端：必须排在主脚本 </script> 之后（顶层 const 的 TDZ）
edits.append((
    "客户端 mp/client.js",
    '<script src="mp/client.js"></script>',
    """requestAnimationFrame(loop);

</script>
</body>""",
    """requestAnimationFrame(loop);

</script>
<!-- ⭐ 二期模块 2：联机客户端独立成文件（任务书 §10.1 的文件策略）。
     ⚠️ **必须排在主脚本之后**：它要读主脚本顶层那些 `const`（`player` / `CENTER` /
        `charSprite` / `CH_AX` / `viewW` …）—— 同一个文档里的普通脚本共享一份全局词法
        环境，排在前面就会在加载期撞 TDZ（"整页白屏、三套自动验收都查不出"那次）。
     ⚠️ 这个文件**没拷过来也只是没有联机**：主脚本里三处挂载点全带 `typeof` 判空，
        双击 HTML 照样能走、能看、能跟 NPC 说话（§7.7 单机回落）。 -->
<script src="mp/client.js"></script>
</body>"""
))

report = []
for name, marker, old, new in edits:
    if marker in src:
        report.append((name, "已打上"))
        continue
    n = src.count(old)
    if n != 1:
        sys.exit("锚点 %r 命中 %d 次（必须是 1 次，或者标记已经在）：%s" % (name, n, old[:60]))
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
    print("ok: 六处挂载点齐了，文件未改动")
