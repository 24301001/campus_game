"""bridge.py 的本地 mock 全流程自检（不连服务器、不花任何 API 钱）。

用一个假大厅（对任意 Bearer 回身份）+ 真 bridge，跑完整条 CF 流程并断言 19 项：
  鉴权 / 建房 / 空手开局被拒 / 进房 / 满员被拒 / 未准备开局被拒 / 非房主开局被拒 /
  开局发码 / 房码只给房内人 / 房码字符集与长度 / 结束作废 / 下局换码 /
  离开 / 房主走即关房 / 列表清空 / 大厅页可取 / healthz / 无 token 一律 401

跑法：~/miniconda3/python.exe test_bridge.py
退出码非 0 = 有断言红。结果同时落 test_report.txt（UTF-8）。
"""
import json
import os
import sys
import threading
import time
import urllib.error
import urllib.request
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

STUB_PORT = 8399
BRIDGE_PORT = 8301
USERS = {"tokA": (11, "房主甲"), "tokB": (22, "躲藏乙"), "tokC": (33, "第三人")}

os.environ["BRIDGE_HOST"] = "127.0.0.1"
os.environ["BRIDGE_PORT"] = str(BRIDGE_PORT)
os.environ["MP_LOBBY"] = "http://127.0.0.1:%d" % STUB_PORT

results = []


def check(name, ok, detail=""):
    results.append((name, bool(ok), detail))
    print(("PASS  " if ok else "FAIL  ") + name + ("   " + detail if detail else ""))


class StubLobby(BaseHTTPRequestHandler):
    """冒充像素校园大厅：GET /api/mp/profile/me 按 Bearer 回身份。"""
    def log_message(self, *a):
        pass

    def do_GET(self):
        tok = self.headers.get("Authorization", "").replace("Bearer ", "").strip()
        uid, nick = USERS.get(tok, (None, None))
        code, body = (200, {"id": uid, "nickname": nick}) if uid else (401, {"error": "重新登录"})
        raw = json.dumps(body).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(raw)))
        self.end_headers()
        self.wfile.write(raw)


def call(method, path, token=None, body=None):
    url = "http://127.0.0.1:%d%s" % (BRIDGE_PORT, path)
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(url, data=data, method=method)
    if token:
        req.add_header("Authorization", "Bearer " + token)
    if data:
        req.add_header("Content-Type", "application/json")
    try:
        with urllib.request.urlopen(req, timeout=5) as r:
            raw = r.read()
            return r.status, (json.loads(raw) if "json" in r.headers.get("Content-Type", "") else raw[:40])
    except urllib.error.HTTPError as e:
        raw = e.read()
        try:
            return e.code, json.loads(raw)
        except ValueError:
            return e.code, raw[:40]


def raw_get(path, token=None):
    """不截断地取整个响应体。call() 为了打印好看把非 JSON 截到 40 字节，
    拿它断言"页面里有没有某句正文"会永远红 —— 那是架子的错，不是服务的错。"""
    req = urllib.request.Request("http://127.0.0.1:%d%s" % (BRIDGE_PORT, path))
    if token:
        req.add_header("Authorization", "Bearer " + token)
    try:
        with urllib.request.urlopen(req, timeout=5) as r:
            return r.status, r.read()
    except urllib.error.HTTPError as e:
        return e.code, e.read()


def main():
    threading.Thread(target=lambda: ThreadingHTTPServer(("127.0.0.1", STUB_PORT), StubLobby).serve_forever(),
                     daemon=True).start()
    import bridge
    threading.Thread(target=lambda: bridge.ThreadingHTTPServer(
        ("127.0.0.1", BRIDGE_PORT), bridge.Handler).serve_forever(), daemon=True).start()
    time.sleep(0.4)

    ALPHABET = set(bridge.CODE_ALPHABET)

    st, d = call("GET", "/game/healthz")
    check("healthz 可用", st == 200 and d.get("ok") is True, str(d))

    st, body = raw_get("/game/duo1/")
    need = ("躲猫猫 · 公告栏".encode(), b'id="rooms"', b'id="readyBtn"', b'id="startBtn"', b'id="seats"')
    check("大厅页取得到（公告栏皮 + 四个钩子 id 齐）",
          st == 200 and all(k in body for k in need), "字节 %d" % len(body))

    st, body = raw_get("/game/probe-pointer-lock")
    check("指针锁探针页取得到（含 pointerLockElement 判据）",
          st == 200 and b"pointerLockElement" in body, "字节 %d" % len(body))

    st, d = call("GET", "/game/duo1/rooms", "tokA")
    check("页面路由没吃掉 JSON 路由（列表仍返回 rooms 字段）",
          st == 200 and isinstance(d, dict) and "rooms" in d, str(d)[:60])

    st, d = call("GET", "/game/..%2f..%2f..%2fetc%2fpasswd", "tokA")
    check("编码过的路径穿越拿不到文件", st in (401, 404) and b"root:" not in (d if isinstance(d, bytes) else b""), str(d)[:40])

    st, d = call("GET", "/game/duo1/rooms")
    check("无 token 的列表 → 401", st == 401, str(d))
    st, d = call("POST", "/game/duo1/create", body={})
    check("无 token 的建房 → 401", st == 401, str(d))

    st, d = call("POST", "/game/duo1/create", "tokA", {"name": "逸夫楼加时赛"})
    room = d.get("room") or {}
    rid = room.get("id")
    check("A 建房成功", st == 200 and rid and room["status"] == "waiting", str(room))
    check("房主昵称来自大厅（不是自报）", room.get("owner", {}).get("nickname") == "房主甲", str(room.get("owner")))

    st, d = call("POST", "/game/duo1/create", "tokA", {"name": "再开一间刷列表"})
    check("同一个人开第二间 → 服务端拒（他实测能无限开）", st == 409 and "已经在一间房里" in str(d), str(d)[:60])

    st, d = call("POST", "/game/duo1/start", "tokA", {"id": rid})
    check("一个人就想开局 → 拒", st == 409 and "还差一个人" in str(d), str(d))

    st, d = call("POST", "/game/duo1/join", "tokB", {"id": rid})
    room = d.get("room") or {}
    check("B 进房，2/2 标记为满", st == 200 and room.get("full") is True and len(room["members"]) == 2, str(room.get("full")))

    st, d = call("POST", "/game/duo1/join", "tokC", {"id": rid})
    check("第三人挤进同一间 → 拒", st == 409, str(d))

    st, d = call("POST", "/game/duo1/start", "tokA", {"id": rid})
    check("对方没准备就想开局 → 拒", st == 409 and "还没准备" in str(d), str(d))

    st, d = call("POST", "/game/duo1/start", "tokB", {"id": rid})
    check("非房主点开始 → 403", st == 403, str(d))

    st, d = call("POST", "/game/duo1/ready", "tokB", {"id": rid})
    room = d.get("room") or {}
    check("B 准备后 guestReady 为真", st == 200 and room.get("guestReady") is True, str(room.get("guestReady")))
    st, d = call("GET", "/game/duo1/room?id=" + rid, "tokA")
    roomA = d.get("room") or {}
    check("房主那一侧 canStart 为真", roomA.get("canStart") is True, str(roomA.get("canStart")))
    check("非房主那一侧 canStart 恒为假",
          (call("GET", "/game/duo1/room?id=" + rid, "tokB")[1].get("room") or {}).get("canStart") is False)

    st, d = call("POST", "/game/duo1/start", "tokA", {"id": rid})
    room = d.get("room") or {}
    code1 = room.get("code")
    check("房主开局拿到房码", st == 200 and code1, str(room))
    check("房码 5 位且字符集与 net.js 一致", len(code1 or "") == 5 and set(code1) <= ALPHABET, str(code1))
    check("开局后状态是 playing", room.get("status") == "playing", str(room.get("status")))

    st, d = call("GET", "/game/duo1/room?id=" + rid, "tokC")
    check("路人能看详情但拿不到房码", st == 200 and (d.get("room") or {}).get("code") is None, str(d.get("room")))
    check("路人的 poll 不会把自己塞进成员表",
          len((d.get("room") or {}).get("members", [])) == 2, str((d.get("room") or {}).get("members")))
    st, d = call("GET", "/game/duo1/rooms", "tokC")
    seen = [r for r in d.get("rooms", []) if r["id"] == rid]
    check("局外人在列表里看不到房码", bool(seen) and seen[0]["code"] is None, str(seen))
    st, d = call("GET", "/game/duo1/room?id=" + rid, "tokB")
    check("房内人 poll 得到房码", (d.get("room") or {}).get("code") == code1, str(d.get("room")))
    st, d = call("POST", "/game/duo1/join", "tokC", {"id": rid})
    check("游戏中不接受新进人", st == 409, str(d))

    st, d = call("POST", "/game/duo1/end", "tokA", {"id": rid})
    room = d.get("room") or {}
    check("房主结束 → 回 waiting 且码作废", room.get("status") == "waiting" and room.get("code") is None, str(room))

    st, d = call("POST", "/game/duo1/ready", "tokB", {"id": rid})
    st, d = call("POST", "/game/duo1/start", "tokA", {"id": rid})
    code2 = (d.get("room") or {}).get("code")
    check("下一局换新码（旧码不复用）", code2 and code2 != code1, "%s → %s" % (code1, code2))

    st, d = call("POST", "/game/duo1/leave", "tokB", {"id": rid})
    check("B 离开后房间还在", d.get("left") is True and not d.get("dissolved"), str(d))
    st, d = call("POST", "/game/duo1/leave", "tokA", {"id": rid})
    check("房主离开即关房", d.get("dissolved") is True, str(d))
    st, d = call("POST", "/game/duo1/create", "tokA", {"name": "离开后重开"})
    check("离开之后允许再开一间（闸不是把他永久锁死）", st == 200, str(d)[:50])
    call("POST", "/game/duo1/leave", "tokA", {"id": (d.get("room") or {}).get("id")})

    # ── 好友房（密码）────────────────────────────────────────────────
    PW = "kaimen6"
    st, d = call("POST", "/game/duo1/create", "tokA", {"name": "好友房", "pass": PW})
    lid = (d.get("room") or {}).get("id")
    check("建房可带密码，列表标 locked", st == 200 and lid and d["room"]["locked"] is True, str(d)[:50])
    check("响应里不含密码原文", PW not in json.dumps(d, ensure_ascii=False), json.dumps(d)[:60])
    st, d = call("POST", "/game/duo1/join", "tokB", {"id": lid})
    check("没给密码进好友房 → 403", st == 403 and "要密码" in str(d), str(d))
    st, d = call("POST", "/game/duo1/join", "tokB", {"id": lid, "pass": "猜一个"})
    check("密码不对 → 403", st == 403 and "密码不对" in str(d), str(d))
    st, d = call("POST", "/game/duo1/join", "tokB", {"id": lid, "pass": PW})
    check("密码对 → 进房", st == 200 and len(d["room"]["members"]) == 2, str(d)[:50])
    st, d = call("POST", "/game/duo1/join", "tokB", {"id": lid})
    check("已在房里的人重进不再要密码", st == 200, str(d)[:50])
    st, d = call("GET", "/game/duo1/rooms", "tokC")
    seen = [r for r in d.get("rooms", []) if r["id"] == lid]
    check("局外人只看到 locked，看不到密码或哈希",
          bool(seen) and seen[0]["locked"] is True and PW not in json.dumps(seen, ensure_ascii=False))
    call("POST", "/game/duo1/leave", "tokA", {"id": lid})

    st, d = call("GET", "/game/duo1/rooms", "tokA")
    check("列表已空", d.get("rooms") == [], str(d.get("rooms")))

    # ── 僵尸成员：客人关掉抽屉没点「离开房间」，poll 停在 15 分钟前 ──────────
    # 旧版 view() 用 len(members) 判满员，僵尸会让房间永远显示 2/2 → 列表按钮
    # 变「进不去」，而 act_join 又按 alive 判能进 ⇒ 用户看到的就是"点了没反应"。
    st, d = call("POST", "/game/duo1/create", "tokA", {"name": "僵尸测试"})
    zrid = (d.get("room") or {}).get("id")
    st, d = call("POST", "/game/duo1/join", "tokB", {"id": zrid})
    check("两人进房（僵尸测试前置）", st == 200 and len(d["room"]["members"]) == 2, str(st))
    with bridge.lock:
        bridge.rooms[zrid]["members"][USERS["tokB"][0]]["poll"] = time.time() - 1000
    st, d = call("GET", "/game/duo1/rooms", "tokC")
    z = [r for r in d.get("rooms", []) if r["id"] == zrid]
    check("僵尸成员不计入满员（否则列表 2/2 进不去）",
          bool(z) and z[0]["full"] is False and len(z[0]["members"]) == 1,
          "full=%s members=%s" % (z[0]["full"] if z else "?", len(z[0]["members"]) if z else "?"))
    st, d = call("POST", "/game/duo1/join", "tokC", {"id": zrid})
    check("列表说能进，服务端就必须真能进（口径一致）", st == 200, str(d)[:60])
    call("POST", "/game/duo1/leave", "tokC", {"id": zrid})
    call("POST", "/game/duo1/leave", "tokA", {"id": zrid})
    st, d = call("GET", "/game/duo1/rooms", "tokA")
    check("僵尸测试收尾：列表清空", d.get("rooms") == [], str(d.get("rooms")))

    bad = [n for n, ok, _ in results if not ok]
    with open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "test_report.txt"),
              "w", encoding="utf-8") as f:
        for n, ok, detail in results:
            f.write(("PASS  " if ok else "FAIL  ") + n + ("   " + detail if detail else "") + "\n")
        f.write("\n合计 %d 项，红 %d 项：%s\n" % (len(results), len(bad), bad or "无"))
    print("\n合计 %d 项，红 %d 项%s" % (len(results), len(bad), ("：" + ", ".join(bad)) if bad else ""))
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
