# -*- coding: utf-8 -*-
"""把一期那段「地图替四家各登一次」的登录逻辑，换成二期的统一换票。

按内容锚点替换（不靠行号），每处必须命中恰好一次，否则报错退出、不写文件。
"""
import io, sys, re

MAP = "像素校园_多人版.html"
PATCH = "_patch/unified_login.js"

src = io.open(MAP, encoding="utf-8").read()
new_block = io.open(PATCH, encoding="utf-8").read().rstrip("\n")

edits = []

# 1) DOM 引用：门上多了提示语与登录/注册切换按钮
edits.append((
'''const lgOut       = document.getElementById("lgOut");''',
'''const lgOut       = document.getElementById("lgOut");
const lgHint      = document.getElementById("lgHint");
const lgSwitch    = document.getElementById("lgSwitch");'''
))

# 2) 删掉「踹醒停在登录页的抽屉」整段（任务书 §3.1.2 要求整段删除）
start = src.find("/* ⭐⭐ 第四十五轮：**踹醒停在登录页的抽屉**。")
end = src.find("function ctrTalk() {")
assert start != -1 and end != -1 and end > start, "找不到 ctrFrameOnLogin 段"
removed = src[start:end]
assert "ctrFrameOnLogin" in removed and "ctrUnstickFrame" in removed, "删除段内容不符"
assert removed.count("function ") == 2, "删除段里有预料之外的函数：%d" % removed.count("function ")
edits.append((removed, ""))

# 3) 开门出口不再需要踹醒
edits.append((
'''  const reuse = !!(ctrF && ctrF.getAttribute("src") === R.app);
''', ""))
edits.append((
'''    ctrBindFrameEsc();
    if (reuse && st === "ok") ctrUnstickFrame(R);      // 见 A5
''', '''    ctrBindFrameEsc();
'''))

# 4) 正文里那条「A5 踹醒判据」的说法跟着改掉
edits.append((
'''     比较的是 `R.app` —— 引擎泛化后这是唯一知道该开哪扇门的地方。
     ⚠️ `reuse` 必须在 set **之前**算出来（set 完就恒为 true 了），A5 那条踹醒判据要用它。 */''',
'''     比较的是 `R.app` —— 引擎泛化后这是唯一知道该开哪扇门的地方。 */'''))

# 5) 整段替换：7.5.14 登录门 → doLogout 结束
anchor_a = "/* --- 7.5.14 登录门 "
anchor_b = "\n/* --- 7.5.15 按键 "
ia = src.find(anchor_a)
ib = src.find(anchor_b)
assert ia != -1 and ib != -1 and ib > ia, "找不到 7.5.14 / 7.5.15 边界"
old = src[ia:ib]
for must_gone in ["XBG_CRED", "LD_CRED", "CMR_CRED", "CAMPUS_CRED", "xbgSync", "ldSync",
                  "cmrSync", "campusRelogin", "CTR_USERS",
                  "xbgBootSync", "ldBootSync", "cmrBootSync"]:
    assert must_gone in old, "旧段里少了 %s，锚点范围可能不对" % must_gone
edits.append((old, new_block + "\n"))

# 6) 开机补票
edits.append((
'''setTimeout(() => { loginGate(); xbgBootSync(); ldBootSync(); cmrBootSync(); ctrHudPulse(); }, 0);''',
'''setTimeout(() => { loginGate(); mpBootSync(); ctrHudPulse(); }, 0);'''
))

# 7) 门上：提示语 / 昵称占位 / 注册切换
edits.append((
'''    <div id="lgHint">选一个预设账号。登录这一次，刷题平台和学霸姐都不用再登了。</div>''',
'''    <div id="lgHint">填注册时那个昵称 + 密码。登录这一次，四家都不用再登。</div>'''
))
edits.append((
'''      <input id="lgU" type="text" autocomplete="off" spellcheck="false" placeholder="用户名">
      <input id="lgP" type="password" autocomplete="off" placeholder="密码">
    </div>
    <div id="lgMsg"></div>
    <div id="lgRow2"><button id="lgGo" type="button">进入像素校园</button></div>''',
'''      <input id="lgU" type="text" autocomplete="off" spellcheck="false" placeholder="昵称">
      <input id="lgP" type="password" autocomplete="off" placeholder="密码">
    </div>
    <div id="lgMsg"></div>
    <div id="lgRow2"><button id="lgGo" type="button">进入像素校园</button>
      <button id="lgSwitch" type="button">没有账号？注册一个</button></div>'''
))

for old, new in edits:
    n = src.count(old)
    if n != 1:
        sys.exit("命中 %d 次（必须是 1 次）：%r..." % (n, old[:70]))
    src = src.replace(old, new, 1)

# 8) 注册/登录切换按钮要绑上（只绑一次，与 #lgQuick 同一条理由）
gate_bind = '''(function bindQuick() {
  if (!loginEl) return;'''
assert src.count(gate_bind) == 1
src = src.replace(gate_bind, '''(function bindQuick() {
  if (lgSwitch) lgSwitch.addEventListener("click", () => lgSetMode(LG_MODE === "register" ? "login" : "register"));
  if (!loginEl) return;''', 1)

# 9) CENTER 那四行注释里的"登录结果"改成"换票结果"
src = src.replace('// 学霸姐那边的登录结果："" / "ok" / "skip" / "down"',
                  '// 学霸姐那边的换票结果："" / "ok" / "skip" / "down"', 1)

io.open(MAP, "w", encoding="utf-8", newline="\n").write(src)
print("ok: 已写入 %s（%d 字节）" % (MAP, len(src.encode("utf-8"))))
