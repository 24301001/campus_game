#!/usr/bin/env python3
"""对真大厅 + 真 bridge 复现：建房 → 离开 → 再开/再进别人的房。只打印状态，不打印 token。"""
import json, urllib.request, urllib.error, time

LOBBY = "http://127.0.0.1:3000"
BRIDGE = "http://127.0.0.1:8300"
TAG = str(int(time.time()))[-6:]

def req(method, url, body=None, token=None):
    data = json.dumps(body).encode() if body is not None else None
    r = urllib.request.Request(url, data=data, method=method)
    if body is not None:
        r.add_header("Content-Type", "application/json")
    if token:
        r.add_header("Authorization", "Bearer " + token)
    try:
        with urllib.request.urlopen(r, timeout=10) as resp:
            return resp.status, json.loads(resp.read() or b"{}")
    except urllib.error.HTTPError as e:
        try: return e.code, json.loads(e.read() or b"{}")
        except Exception: return e.code, {}

def account(nick):
    name = nick + TAG
    st, d = req("POST", LOBBY + "/api/mp/register", {"nickname": name, "password": "test" + TAG + "x"})
    print(f"  注册 {name}: {st} {d if st != 201 else 'ok'}")
    st, d = req("POST", LOBBY + "/api/mp/login", {"nickname": name, "password": "test" + TAG + "x"})
    print(f"  登录: {st}  user_id={d.get('user', {}).get('id')}")
    return d.get("token"), d.get("user", {}).get("id")

def main():
    print("### 注册两个一次性测试账号")
    ta, ida = account("测A")
    tb, idb = account("测B")
    if not ta or not tb:
        print("!! 账号没拿到，停"); return

    print("\n### A：建房 → 离开（房主）→ 再建")
    st, d = req("POST", BRIDGE + "/game/duo1/create", {"name": "A的房"}, ta)
    ra = (d.get("room") or {}).get("id")
    print(f"  create → {st}  room={ra}")
    st, d = req("POST", BRIDGE + "/game/duo1/leave", {"id": ra}, ta)
    print(f"  leave(房主) → {st}  {d}")
    st, d = req("POST", BRIDGE + "/game/duo1/create", {"name": "A的房2"}, ta)
    print(f"  再 create → {st}  room={(d.get('room') or {}).get('id')}  {'' if st==200 else d}")
    ra2 = (d.get("room") or {}).get("id")
    req("POST", BRIDGE + "/game/duo1/leave", {"id": ra2}, ta)

    print("\n### B 建一间，A 进去 → 离开 → 再进去")
    st, d = req("POST", BRIDGE + "/game/duo1/create", {"name": "B的房"}, tb)
    rb = (d.get("room") or {}).get("id")
    print(f"  B create → {st}  room={rb}")
    st, d = req("POST", BRIDGE + "/game/duo1/join", {"id": rb, "pass": ""}, ta)
    print(f"  A join → {st}  members={len((d.get('room') or {}).get('members') or [])}")
    st, d = req("POST", BRIDGE + "/game/duo1/leave", {"id": rb}, ta)
    print(f"  A leave(客人) → {st}  {d}")
    st, d = req("POST", BRIDGE + "/game/duo1/join", {"id": rb, "pass": ""}, ta)
    print(f"  A 再 join → {st}  {'' if st==200 else d}")
    st, d = req("POST", BRIDGE + "/game/duo1/leave", {"id": rb}, ta)

    print("\n### 关键：A 离开后，列表里还有没有他")
    st, d = req("GET", BRIDGE + "/game/duo1/rooms", None, ta)
    mine = [r["id"] for r in (d.get("rooms") or []) if any(m["id"] == ida for m in r["members"])]
    print(f"  /rooms → {st}  共 {len(d.get('rooms') or [])} 间  A 仍在其中的房: {mine or '无'}")

    print("\n### 收尾：B 关房")
    st, d = req("POST", BRIDGE + "/game/duo1/leave", {"id": rb}, tb)
    print(f"  {st} {d}")

main()
