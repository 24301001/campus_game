"""三处插座的幂等补丁器（躲猫猫联机桥接）。

对象是**本地待部署副本**，不直接碰服务器：
  待部署/map_live.html   ← 服务器那份地图（1,317,669 字节，与本地源码不同）
  待部署/server.py       ← 大厅 mp/server.py
  待部署/net.js          ← duo1 部署版

每条补丁按他定过的规矩做：改前重搜锚点、命中数必须等于预期、改后重读做骨架对账、
原文件留 .pre_duobridge 备份；锚点找不到或命中数不对就整条不写并退出非 0。
重复运行不会插两行（replacement 已在文件里就跳过并报告）。

跑法：
  ~/miniconda3/python.exe install.py            # 只看会改什么（dry-run，不写盘）
  ~/miniconda3/python.exe install.py --apply    # 真写到 待部署/ 里的副本
"""
from __future__ import annotations

import datetime
import shutil
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

HERE = Path(__file__).resolve().parent
STAGE = HERE / "待部署"
STAMP = "pre_duobridge"
VERSION = "duobridge02"

# (文件名, 锚点原文, 替换成什么, 说明, 预期命中次数)
PATCHES = [
    (
        "map_live.html",
        '<script src="mp/lobby.js?v=20261031-main3d"></script>',
        '<script src="mp/lobby.js?v=20261031-main3d"></script>\n'
        '<script src="mp/duo1-bridge.js?v=%s"></script>' % VERSION,
        "地图只加一行：把公告栏脚本接在 lobby.js 之后（它要读地图的 CENTER/ROOMS，必须在引擎之后执行）",
        1,
    ),
    (
        "server.py",
        '"mp/look.js", "mp/lobby.js",',
        '"mp/look.js", "mp/lobby.js", "mp/duo1-bridge.js",',
        "大厅静态白名单（server.py:470）加上这个文件名，否则浏览器取它 404",
        1,
    ),
    (
        "net.js",
        "  room = readRoom();",
        "  room = readRoom();\n  myNick = readNick();",
        "duo1 侧：initNet 里读一次 ?nick=（大厅带过来的昵称）",
        1,
    ),
    (
        "net.js",
        "function readRoom() {",
        "function readNick() {\n"
        "  const n = new URLSearchParams(location.search).get('nick');\n"
        "  return (n || '').slice(0, 24);\n"
        "}\n"
        "let myNick = '';\n\n"
        "function readRoom() {",
        "新增 readNick()。⚠ 这里只显示**自己**的昵称：对手昵称要中继把 nick 一起转发（改协议），"
        "而部署版 duo1 连名字牌代码都还没有，所以那一块不在本补丁里做",
        1,
    ),
    (
        "net.js",
        "setBadge(`房间 ${room} · 等待同学加入`)",
        "setBadge(`房间 ${room} · 我是 ${myNick || '匿名'} · 等待同学加入`)",
        "角标带上自己的昵称，一眼确认大厅把人对不对",
        1,
    ),
]

NEW_FILES = ["duo1-bridge.js", "bridge.py", "lobby.html"]
TARGETS_ON_SERVER = {
    "duo1-bridge.js": "/opt/campus_portal/mp/duo1-bridge.js",
    "map_live.html":  "/opt/campus_portal/像素校园_全校地图.html",
    "server.py":      "/opt/campus_portal/mp/server.py",
    "net.js":         "/opt/campus_duo1/duo1/net.js",
    "bridge.py":      "/opt/campus_bridge/bridge.py",
    "lobby.html":     "/opt/campus_bridge/lobby.html",
}


def locate(name: str) -> Path:
    p = STAGE / name
    if not p.exists():
        sys.exit("缺少待部署副本：%s（先从 基线快照/ 拷一份过去）" % p)
    return p


def apply_one(path: Path, anchor: str, replacement: str, desc: str, expect: int, apply: bool):
    text = path.read_text(encoding="utf-8")
    if replacement in text:
        return "SKIP  %-15s 已经打过了：%s" % (path.name, desc)
    hits = text.count(anchor)
    if hits != expect:
        raise SystemExit("ABORT %-15s 锚点命中 %d 次，期望 %d 次 ⇒ 不写盘。锚点：%r"
                         % (path.name, hits, expect, anchor[:70]))
    if not apply:
        return "WOULD %-15s %s" % (path.name, desc)
    bak = path.with_name(path.name + "." + STAMP)
    if not bak.exists():
        shutil.copy2(path, bak)
    path.write_text(text.replace(anchor, replacement, 1), encoding="utf-8")
    return "OK    %-15s %s（备份 %s）" % (path.name, desc, bak.name)


def verify(apply: bool):
    """改后重读做骨架对账，而不是只信 replace() 的返回。"""
    bad = []
    m = locate("map_live.html").read_text(encoding="utf-8")
    if m.count("mp/duo1-bridge.js") != 1:
        bad.append("地图里 duo1-bridge.js 应当恰好出现 1 次")
    if m.count('<script src="mp/lobby.js') != 1:
        bad.append("地图里 lobby.js 的 script 行应当还是 1 次（没被复制成两行）")
    s = locate("server.py").read_text(encoding="utf-8")
    if '"mp/duo1-bridge.js",' not in s:
        bad.append("白名单里没有 duo1-bridge.js")
    n = locate("net.js").read_text(encoding="utf-8")
    for frag, why in [("function readNick()", "readNick 没插入"),
                      ("myNick = readNick();", "initNet 里没调用 readNick"),
                      ("我是 ${myNick", "角标没换成带昵称的版本")]:
        if frag not in n:
            bad.append(why)
    cnt = n.count("function readNick()")
    if cnt == 0:
        bad.append("readNick 一次都没有（dry-run 下这是正常的，--apply 后必须为 1）")
    elif cnt > 1:
        bad.append("readNick 出现了 %d 次 ⇒ 补丁不幂等" % cnt)
    for f in NEW_FILES:
        if not (HERE / f).exists():
            bad.append("缺新文件 %s" % f)
    return bad


def main():
    apply = "--apply" in sys.argv
    print("模式：%s   目标目录：%s" % ("真写盘" if apply else "dry-run（不写盘）", STAGE))
    print("上线时这些副本要盖到服务器何处：")
    for k, v in TARGETS_ON_SERVER.items():
        print("   %-16s → %s" % (k, v))
    print()
    by_file: dict[str, list] = {}
    for name, anchor, repl, desc, expect in PATCHES:
        by_file.setdefault(name, []).append((anchor, repl, desc, expect))
    for name in ["map_live.html", "server.py", "net.js"]:
        path = locate(name)
        for anchor, repl, desc, expect in by_file.get(name, []):
            print(apply_one(path, anchor, repl, desc, expect, apply))
    print()
    bad = verify(apply)
    for b in bad:
        print("RED   " + b)
    if bad:
        return 1
    print("GREEN 骨架对账通过（%d 条补丁，%d 个新文件）" % (len(PATCHES), len(NEW_FILES)))
    print("提醒：地图/JS 改完必须 bump 版本号再刷新；改了 server.py 要 sudo systemctl restart campus-lobby；")
    print("      net.js 属 duo1，改完把 index.html 的 main.js?v= 和 main.js 里的 net.js?v= 一起 bump。")
    return 0


if __name__ == "__main__":
    sys.exit(main())
