"""Three independent client integration check on one computer; not a cross-computer acceptance test."""
import asyncio
import hashlib
import json
import os
import socket
import sqlite3
import subprocess
import sys
import tempfile
import time
import urllib.error
import urllib.request
from pathlib import Path

from websockets.asyncio.client import connect

HERE = Path(__file__).resolve().parent


def free_port():
    with socket.socket() as s:
        s.bind(("127.0.0.1", 0))
        return s.getsockname()[1]


def request(port, path, data=None, token=None, method=None):
    body = json.dumps(data).encode() if data is not None else None
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = "Bearer " + token
    req = urllib.request.Request(f"http://127.0.0.1:{port}/api/mp{path}", body, headers, method=method)
    with urllib.request.urlopen(req, timeout=3) as r:
        return json.load(r)


def check_static_files(port, ws_port):
    with urllib.request.urlopen(f"http://127.0.0.1:{port}/", timeout=3) as response:
        assert response.status == 200 and b"mp/lobby.js" in response.read()
    with urllib.request.urlopen(f"http://127.0.0.1:{port}/mp/lobby.js", timeout=3) as response:
        script = response.read()
        assert b"__MP_WS_PORT__" not in script and f"Number('{ws_port}')".encode() in script
    for path in ("/pixel-3d/pixel-3d.js", "/pixel-3d/pixel-3d.css"):
        with urllib.request.urlopen(f"http://127.0.0.1:{port}{path}", timeout=3) as response:
            assert response.status == 200 and response.read()
    for path in ("/mp/server.py", "/README.md", "/mp/lobby.sqlite3"):
        try:
            urllib.request.urlopen(f"http://127.0.0.1:{port}{path}", timeout=3)
            raise AssertionError(f"private file served: {path}")
        except urllib.error.HTTPError as exc:
            assert exc.code == 404, (path, exc.code)
    colleges = request(port, "/colleges")["colleges"]
    assert len(colleges) == 23 and "碳中和与环境学院" in colleges
    assert "环境学院" not in colleges and "其他" not in colleges
    try:
        request(port, "/look/from-photo", {"image": "not-a-photo"})
        raise AssertionError("server photo upload route should be disabled")
    except urllib.error.HTTPError as exc:
        assert exc.code == 410


async def recv_type(ws, typ, timeout=2):
    end = time.monotonic() + timeout
    while True:
        item = json.loads(await asyncio.wait_for(ws.recv(), max(.01, end-time.monotonic())))
        if item["type"] == typ:
            return item


async def send(ws, typ, **fields):
    await ws.send(json.dumps({"type": typ, **fields}))


async def scenario(http_port, ws_port, db_path):
    users = {}
    for name in ("联机测试甲", "联机测试乙", "联机测试丙"):
        request(http_port, "/register", {"nickname": name, "password": "testpass123"})
        data = request(http_port, "/login", {"nickname": name, "password": "testpass123"})
        users[name] = data
    a, b, c = users.values()
    url = lambda u: f"ws://127.0.0.1:{ws_port}/mp?token={u['token']}"
    async with connect(url(a)) as aw, connect(url(b)) as bw, connect(url(c)) as cw:
        await send(aw, "hello", scene="out", x=100, y=200, dir="down")
        assert (await recv_type(aw, "welcome"))["peers"] == []
        await send(bw, "hello", scene="out", x=110, y=200, dir="left")
        assert len((await recv_type(bw, "welcome"))["peers"]) == 1
        assert (await recv_type(aw, "peer.join"))["peer"]["id"] == b["user"]["id"]
        await send(cw, "hello", scene="center", x=150, y=180, dir="up")
        assert (await recv_type(cw, "welcome"))["peers"] == []
        await send(aw, "move", x=140, y=220, dir="right")
        assert (await recv_type(bw, "peer.move"))["x"] == 140
        try:
            await recv_type(cw, "peer.move", .25)
            raise AssertionError("movement leaked across scenes")
        except asyncio.TimeoutError:
            pass
        await send(aw, "scene.change", to="center", x=150, y=190)
        assert (await recv_type(bw, "peer.leave"))["id"] == a["user"]["id"]
        assert (await recv_type(cw, "peer.join"))["peer"]["id"] == a["user"]["id"]
        await recv_type(aw, "scene.peers")
        await send(aw, "announce.post", content="全服测试公告", clientMsgId="ann-1")
        assert (await recv_type(bw, "announce.new"))["content"] == "全服测试公告"
        await recv_type(cw, "announce.new")
        await recv_type(aw, "announce.new")
        assert (await recv_type(aw, "announce.ack"))["clientMsgId"] == "ann-1"
        await send(aw, "announce.post", content="刷屏", clientMsgId="ann-2")
        assert (await recv_type(aw, "error"))["code"] == "ANNOUNCE_RATE"
        await send(aw, "chat.send", to=b["user"]["id"], content="只给乙看", clientMsgId="chat-1")
        assert (await recv_type(aw, "chat.ack"))["clientMsgId"] == "chat-1"
        assert (await recv_type(bw, "chat.msg"))["content"] == "只给乙看"
        await send(cw, "chat.history", withUser=a["user"]["id"], limit=30)
        assert (await recv_type(cw, "chat.history"))["items"] == []
        await bw.close()
        await asyncio.sleep(1.1)
        await send(aw, "chat.send", to=b["user"]["id"], content="乙离线后再看", clientMsgId="chat-2")
        assert (await recv_type(aw, "chat.ack"))["clientMsgId"] == "chat-2"
        async with connect(url(b)) as bw2:
            await send(bw2, "hello", scene="out", x=110, y=200, dir="left")
            await recv_type(bw2, "welcome")
            assert (await recv_type(bw2, "chat.msg"))["content"] == "只给乙看"
            assert (await recv_type(bw2, "chat.msg"))["content"] == "乙离线后再看"
        profile = request(http_port, "/profile/me", token=a["token"])
        assert profile["nickname"] == "联机测试甲"
        try:
            request(http_port, "/profile/me", {"bio": "测试签名", "look": profile["look"], "nickname": "假名字"}, a["token"], "PUT")
            raise AssertionError("nickname update accepted")
        except urllib.error.HTTPError as exc:
            assert exc.code == 400
        striped_look = {**profile["look"], "cloth": "#cfccd2", "clothAlt": "#28242a", "clothPattern": "stripe", "packColor": "#3a74b2"}
        changed = request(http_port, "/profile/me", {"bio": "测试签名", "look": striped_look}, a["token"], "PUT")
        assert changed["nickname"] == "联机测试甲" and changed["bio"] == "测试签名"
        assert changed["look"]["clothPattern"] == "stripe" and changed["look"]["clothAlt"] == "#28242a" and changed["look"]["packColor"] == "#3a74b2"
        public = request(http_port, f"/profile/{a['user']['id']}", token=c["token"])
        assert set(public) == {"id", "nickname", "look", "bio", "college", "grade", "tags", "visibility", "online", "lastSeen"}
        assert public["look"]["clothPattern"] == "stripe" and public["look"]["packColor"] == "#3a74b2"
        visibility = {"bio": False, "college": True, "grade": True, "tags": False}
        mine = request(http_port, "/profile/me", {"bio": "私密签名", "tags": ["保密"], "look": striped_look, "visibility": visibility}, a["token"], "PUT")
        assert mine["bio"] == "私密签名" and mine["visibility"] == visibility
        hidden = request(http_port, f"/profile/{a['user']['id']}", token=c["token"])
        assert hidden["bio"] == "" and hidden["tags"] == [] and hidden["visibility"] == visibility
        request(http_port, "/login", {"nickname": "联机测试甲", "password": "testpass123"})
        await asyncio.wait_for(aw.wait_closed(), 2)
        assert aw.close_code == 4001
    print("PASS: 3 clients, scene isolation, movement, global announcement, rate limit, private/offline chat, profile whitelist, account kick")

    # Expiring the DB token stands in for 24 hours passing. The client remains
    # completely idle, so authorization must not depend on inbound WS messages.
    renewed = request(http_port, "/login", {"nickname": "联机测试甲", "password": "testpass123"})
    async with connect(url(renewed)) as idle:
        await send(idle, "hello", scene="out", x=100, y=200, dir="down")
        await recv_type(idle, "welcome")
        digest = hashlib.sha256(renewed["token"].encode()).hexdigest()
        conn = sqlite3.connect(db_path)
        try:
            conn.execute("UPDATE mp_token SET expires_at=? WHERE token_hash=?", (time.time() - 1, digest))
            assert conn.total_changes == 1
            conn.commit()
        finally:
            conn.close()
        await asyncio.wait_for(idle.wait_closed(), 8)
        assert idle.close_code == 4003, idle.close_code
    try:
        request(http_port, "/profile/me", token=renewed["token"])
        raise AssertionError("expired HTTP bearer token accepted")
    except urllib.error.HTTPError as exc:
        assert exc.code == 401
    fresh = request(http_port, "/login", {"nickname": "联机测试甲", "password": "testpass123"})
    async with connect(url(fresh)) as rejoined:
        await send(rejoined, "hello", scene="out", x=100, y=200, dir="down")
        assert (await recv_type(rejoined, "welcome"))["me"]["id"] == fresh["user"]["id"]
    print("PASS: expired idle WebSocket closes; fresh login reconnects")


def main():
    hp, wp = free_port(), free_port()
    with tempfile.TemporaryDirectory() as tmp:
        env = dict(os.environ, MP_HOST="127.0.0.1", MP_HTTP_PORT=str(hp), MP_WS_PORT=str(wp), MP_DB=str(Path(tmp) / "test.sqlite3"))
        process = subprocess.Popen([sys.executable, str(HERE / "server.py")], env=env, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)
        try:
            for _ in range(50):
                try:
                    request(hp, "/health")
                    break
                except (OSError, urllib.error.URLError):
                    time.sleep(.1)
            else:
                raise RuntimeError("server failed to start: " + process.stderr.read().decode(errors="replace"))
            check_static_files(hp, wp)
            asyncio.run(scenario(hp, wp, Path(tmp) / "test.sqlite3"))
        finally:
            process.terminate()
            process.wait(timeout=5)


if __name__ == "__main__":
    main()
