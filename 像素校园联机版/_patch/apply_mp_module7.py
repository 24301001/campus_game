# -*- coding: utf-8 -*-
"""二期模块 7 的挂载点记录（NPC 对话一对一归属）。

与 `apply_mp_module2.py` / `apply_mp_module6.py` 同一条规矩：按内容锚点替换，
不靠行号，每处命中恰好一次；每处先认"已经打上"的标记，认到就跳过 ——
所以它既是安装脚本，也是"这一处还在不在"的检查脚本（`--check` 只查不写）。

⚠️ 模块 7 的**主体是核实，不是新功能**（任务书 §7.5 那张表里三家写着"已隔离"）：
   · 阿姨 :8020  —— `conversations` / `messages` 都带 `user_id`，实测过；
   · 算法哥 :8081 —— `agent_session` / `agent_message` / `agent_memory` 按 userId 过滤；
   · 保安 :8000  —— 老丁的聊天记录键是 `chat_<user_id>`（`laoding/index.html`），
                    每人一个 `u_xxxxxxxx`，实测甲聊完乙是空的；
   · 学霸姐 :8010 —— `session` / `message` / `user_memory` 三条 SQL 全带 `user_id=?`，
                    连"猜中别人的 session_id"都读不出东西（本机没起服务，按代码与库结构核）。

唯一要补的一刀在**地图这边**：`doLogout()` 以前只清票、回登录门，**不摘 iframe** ——
抽屉里挂着的还是上一个人聊完的那一屏，票作废了页面还亮着。这就是 §7.5
「换人即换历史」在 UI 上的漏洞，所以这里加一句 `ctrClosePlatform(true)`。

⚠️ 一期那份 `像素校园_全校地图.html` 是**冻结**的，这一刀只落在多人版副本上。
"""
import io, sys

MAP = "像素校园_多人版.html"
CHECK = "--check" in sys.argv
src0 = io.open(MAP, encoding="utf-8").read()
src = src0

edits = []

edits.append((
    "登出时摘掉抽屉 iframe",
    "ctrClosePlatform(true);\n  hudUserTick();",
    """  CENTER.xbg = ""; CENTER.ld = ""; CENTER.cmr = ""; CENTER.campus = "";
  hudUserTick();
  loginGate();
}""",
    """  CENTER.xbg = ""; CENTER.ld = ""; CENTER.cmr = ""; CENTER.campus = "";
  /* ⭐ §7.5「换人即换历史」在 UI 上的最后一道：抽屉里挂着的是**上一个人**的页面
     （阿姨/老丁已经把他聊过的话渲染出来了），票一作废就必须整块摘掉，
     只 `hidden` 不算 —— 下次别人进同一间房时 iframe 还活着，一秒就把旧历史亮出来。 */
  ctrClosePlatform(true);
  hudUserTick();
  loginGate();
}"""
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
