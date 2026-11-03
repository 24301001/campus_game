"""无头 Edge + CDP 出真图（本地演示用，不上服务器）。

为什么不用内嵌浏览器：它没有可见表面，take_screenshot 直接报 viewport=0x0。
为什么要 CDP 而不是 msedge --screenshot：大厅页读的是 localStorage.mpToken，
命令行截图那一趟没法先写进同源存储，截出来只会是"没登录"那张脸。

跑法：C:\\Users\\17272\\miniconda3\\python.exe shot.py
产物：截图_大厅列表.png + 截图_房间内_房主视角.png（同目录）
"""
import asyncio
import base64
import json
import os
import subprocess
import sys
import tempfile
import time
import urllib.request

import websockets

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

EDGE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
BASE = "http://127.0.0.1:8301"
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "截图_大厅列表.png")
_id = 0


def msg(method, params=None):
    global _id
    _id += 1
    return json.dumps({"id": _id, "method": method, "params": params or {}})


async def rpc(ws, method, params=None, timeout=15):
    want = _id + 1
    await ws.send(msg(method, params))
    deadline = time.time() + timeout
    while time.time() < deadline:
        d = json.loads(await asyncio.wait_for(ws.recv(), timeout))
        if d.get("id") == want:
            if "error" in d:
                raise RuntimeError("%s → %s" % (method, d["error"]))
            return d.get("result", {})
    raise RuntimeError(method + " 超时")


async def main():
    profile = tempfile.mkdtemp(prefix="edge-shot-")
    marker = os.path.basename(profile)
    port = 9400 + int(time.time() * 7) % 500      # 每次换端口：上一趟残留的无头 Edge 子进程会占着老端口
    proc = subprocess.Popen(
        [EDGE, "--headless=new", "--disable-gpu", "--no-first-run",
         "--remote-debugging-port=%d" % port, "--user-data-dir=" + profile,
         "--proxy-bypass-list=*127.0.0.1;*localhost", "--window-size=1180,760", "about:blank"],
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    os.environ["NO_PROXY"] = "127.0.0.1,localhost"
    try:
        target = None
        for _ in range(40):
            time.sleep(0.4)
            try:
                tabs = json.loads(urllib.request.urlopen(
                    "http://127.0.0.1:%d/json/list" % port, timeout=3).read())
                page = [t for t in tabs if t.get("type") == "page"]
                if page:
                    target = page[0]["webSocketDebuggerUrl"]
                    break
            except Exception:
                pass
        if not target:
            raise RuntimeError("Edge 的 CDP 端口没起来")
        async with websockets.connect(target, max_size=32 << 20) as ws:
            await rpc(ws, "Page.enable")
            await rpc(ws, "Runtime.enable")
            await rpc(ws, "Page.navigate", {"url": BASE + "/game/healthz"})
            await asyncio.sleep(1.2)
            await rpc(ws, "Runtime.evaluate",
                      {"expression": "localStorage.setItem('mpToken','tokA')"})
            await rpc(ws, "Page.navigate", {"url": BASE + "/game/duo1/"})
            await asyncio.sleep(3.2)          # 让 1.5 秒轮询至少跑两轮
            probe = await rpc(ws, "Runtime.evaluate", {"expression": """
                JSON.stringify({
                  me: document.getElementById('me').textContent,
                  rooms: document.querySelectorAll('#rooms li.room').length,
                  names: [...document.querySelectorAll('#rooms .rname')].map(e=>e.textContent),
                  tags:  [...document.querySelectorAll('#rooms .tag')].map(e=>e.textContent),
                  hint:  document.getElementById('listHint').textContent
                })""", "returnByValue": True})
            info = json.loads(probe["result"]["value"])
            print("页面实测：", json.dumps(info, ensure_ascii=False))
            shot = await rpc(ws, "Page.captureScreenshot", {"format": "png"})
            with open(OUT, "wb") as f:
                f.write(base64.b64decode(shot["data"]))
            print("已落盘：", OUT, os.path.getsize(OUT), "字节")
            assert info["rooms"] >= 2, "列表里房不够，图是假的"
            assert "云验收甲" in info["me"], "昵称没从服务端来"

            # 第二张：点**第一个可点的**进入按钮。列表按创建时间升序，seed 脚本把
            # "我做东 + 对方已准备"的那间排在最前 ⇒ 点它才该亮"开始游戏"。
            # （上一版点最后一个，结果点进了别人做东的房 ⇒ 按钮该灰，断言判错对象。）
            await rpc(ws, "Runtime.evaluate", {"expression": """
                (() => { const b = document.querySelectorAll('#rooms li.room button[data-join]');
                         const t = b[0];
                         if (t) t.click(); return t ? t.getAttribute('data-join') : 'none'; })()"""})
            await asyncio.sleep(2.6)
            panel = await rpc(ws, "Runtime.evaluate", {"expression": """
                JSON.stringify({
                  title: document.getElementById('roomTitle').textContent,
                  seats: [...document.querySelectorAll('#seats .seat')].map(e=>e.textContent.trim()),
                  startDisabled: document.getElementById('startBtn').disabled,
                  readyHidden: document.getElementById('readyBtn').hidden,
                  hint: document.getElementById('roomHint').textContent
                })""", "returnByValue": True})
            p = json.loads(panel["result"]["value"])
            print("房间面板：", json.dumps(p, ensure_ascii=False))
            out2 = os.path.join(os.path.dirname(OUT), "截图_房间内_房主视角.png")
            shot = await rpc(ws, "Page.captureScreenshot", {"format": "png"})
            with open(out2, "wb") as f:
                f.write(base64.b64decode(shot["data"]))
            print("已落盘：", out2, os.path.getsize(out2), "字节")
            assert p["startDisabled"] is False, "对方已准备，开始按钮却还是灰的"
            assert "空位" not in "".join(p["seats"]), "两个人了还显示空位"
    finally:
        proc.terminate()
        try:
            proc.wait(timeout=8)
        except subprocess.TimeoutExpired:
            proc.kill()
        # 只收拾自己起的无头实例：按临时 profile 名匹配命令行，绝不动用户自己的 Edge
        subprocess.run(["powershell", "-NoProfile", "-Command",
                        "Get-CimInstance Win32_Process | Where-Object { $_.CommandLine -like '*%s*' }"
                        " | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }" % marker],
                       capture_output=True)


if __name__ == "__main__":
    asyncio.run(main())
