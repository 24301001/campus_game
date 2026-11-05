"""Local LAN lobby server. Run: python mp/server.py (Python 3.10+, websockets 15+)."""
from __future__ import annotations

import asyncio
import hashlib
import hmac
import json
import mimetypes
import os
import secrets
import sqlite3
import threading
import time
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, unquote, urlsplit

from websockets.asyncio.server import serve

ROOT = Path(__file__).resolve().parent.parent
DB_PATH = Path(os.environ.get("MP_DB", ROOT / "mp" / "lobby.sqlite3"))
HOST = os.environ.get("MP_HOST", "0.0.0.0")
HTTP_PORT = int(os.environ.get("MP_HTTP_PORT", "3000"))
WS_PORT = int(os.environ.get("MP_WS_PORT", "8090"))
DEFAULT_LOOK = {"skin": "#e9bb92", "hairStyle": "short", "hairColor": "#241d1a", "eye": "round", "cloth": "#3f6ea8", "pants": "#454c5a", "acc": "none"}
LOOK_COLORS = ("skin", "hairColor", "cloth", "pants")
LOOK_CHOICES = {"hairStyle": ("short", "mid", "long", "ponytail", "bun", "curly"), "eye": ("round", "narrow", "dot"), "acc": ("none", "glasses", "cap", "scarf")}
SCENES = {"out", "center", "yifu"}

DB_PATH.parent.mkdir(parents=True, exist_ok=True)
db = sqlite3.connect(DB_PATH, check_same_thread=False, isolation_level=None)
db.row_factory = sqlite3.Row
lock = threading.RLock()
with lock:
    db.executescript("""
    PRAGMA journal_mode=WAL;
    CREATE TABLE IF NOT EXISTS mp_user(id INTEGER PRIMARY KEY, nickname TEXT NOT NULL UNIQUE, salt BLOB NOT NULL, password_hash BLOB NOT NULL);
    CREATE TABLE IF NOT EXISTS mp_token(token_hash TEXT PRIMARY KEY, user_id INTEGER NOT NULL, expires_at REAL NOT NULL);
    CREATE TABLE IF NOT EXISTS mp_player(user_id INTEGER PRIMARY KEY, look_json TEXT NOT NULL, bio TEXT NOT NULL DEFAULT '', college TEXT NOT NULL DEFAULT '', grade TEXT NOT NULL DEFAULT '', tags TEXT NOT NULL DEFAULT '[]', last_scene TEXT NOT NULL DEFAULT 'out', last_x REAL NOT NULL DEFAULT 0, last_y REAL NOT NULL DEFAULT 0);
    CREATE TABLE IF NOT EXISTS mp_presence(user_id INTEGER PRIMARY KEY, last_seen REAL NOT NULL, last_scene TEXT NOT NULL DEFAULT 'out');
    CREATE TABLE IF NOT EXISTS mp_session(id INTEGER PRIMARY KEY, user_a INTEGER NOT NULL, user_b INTEGER NOT NULL, created_at REAL NOT NULL, UNIQUE(user_a,user_b));
    CREATE TABLE IF NOT EXISTS mp_message(id INTEGER PRIMARY KEY, session_id INTEGER NOT NULL, from_user INTEGER NOT NULL, to_user INTEGER NOT NULL, content TEXT NOT NULL, created_at REAL NOT NULL, read_at REAL, client_msg_id TEXT, UNIQUE(from_user,client_msg_id));
    CREATE INDEX IF NOT EXISTS idx_mp_message_session ON mp_message(session_id,id);
    CREATE INDEX IF NOT EXISTS idx_mp_message_unread ON mp_message(to_user,read_at);
    CREATE TABLE IF NOT EXISTS mp_announcement(id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL, content TEXT NOT NULL, created_at REAL NOT NULL, client_msg_id TEXT, UNIQUE(user_id,client_msg_id));
    CREATE INDEX IF NOT EXISTS idx_mp_announcement_time ON mp_announcement(created_at);
    """)

active: dict[int, dict] = {}
event_loop: asyncio.AbstractEventLoop | None = None


def now_iso(value: float | None = None) -> str:
    return datetime.fromtimestamp(value or time.time(), timezone.utc).isoformat()


def row(sql: str, args: tuple = ()):
    with lock:
        return db.execute(sql, args).fetchone()


def rows(sql: str, args: tuple = ()):
    with lock:
        return db.execute(sql, args).fetchall()


def execute(sql: str, args: tuple = ()):
    with lock:
        return db.execute(sql, args)


def valid_look(value):
    if not isinstance(value, dict):
        raise ValueError("形象数据无效")
    result = {}
    for key in LOOK_COLORS:
        color = value.get(key, DEFAULT_LOOK[key])
        if not isinstance(color, str) or len(color) != 7 or color[0] != "#" or any(c not in "0123456789abcdefABCDEF" for c in color[1:]):
            raise ValueError("形象颜色无效")
        result[key] = color.lower()
    for key, choices in LOOK_CHOICES.items():
        item = value.get(key, DEFAULT_LOOK[key])
        if item not in choices:
            raise ValueError("形象选项无效")
        result[key] = item
    return result


def token_user(token: str):
    if not token:
        return None
    digest = hashlib.sha256(token.encode()).hexdigest()
    return row("SELECT u.id,u.nickname FROM mp_token t JOIN mp_user u ON u.id=t.user_id WHERE t.token_hash=? AND t.expires_at>?", (digest, time.time()))


def player_of(user_id: int):
    p = row("SELECT p.*,u.nickname FROM mp_player p JOIN mp_user u ON u.id=p.user_id WHERE p.user_id=?", (user_id,))
    if not p:
        return None
    return {"id": user_id, "nickname": p["nickname"], "look": json.loads(p["look_json"]), "bio": p["bio"], "college": p["college"], "grade": p["grade"], "tags": json.loads(p["tags"])}


def public_profile(user_id: int):
    p = player_of(user_id)
    if not p:
        return None
    presence = row("SELECT last_seen FROM mp_presence WHERE user_id=?", (user_id,))
    p.update(online=user_id in active, lastSeen=now_iso(presence["last_seen"]) if presence else None)
    return p


def message_dict(m):
    sender = player_of(m["from_user"])
    return {"msgId": m["id"], "sessionId": m["session_id"], "from": m["from_user"], "to": m["to_user"], "fromNickname": sender["nickname"], "look": sender["look"], "content": m["content"], "at": now_iso(m["created_at"]), "clientMsgId": m["client_msg_id"]}


def announcements(limit=50):
    items = rows("SELECT a.*,u.nickname,p.look_json FROM mp_announcement a JOIN mp_user u ON u.id=a.user_id JOIN mp_player p ON p.user_id=a.user_id WHERE a.created_at>? ORDER BY a.id DESC LIMIT ?", (time.time() - 7 * 86400, min(max(int(limit), 1), 50)))
    return [{"id": a["id"], "userId": a["user_id"], "nickname": a["nickname"], "look": json.loads(a["look_json"]), "content": a["content"], "at": now_iso(a["created_at"]), "online": a["user_id"] in active} for a in reversed(items)]


class Handler(BaseHTTPRequestHandler):
    def log_message(self, fmt, *args):
        print("[http] " + fmt % args)

    def send_json(self, code, data):
        body = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def body(self):
        size = int(self.headers.get("Content-Length", "0"))
        if size < 1 or size > 4096:
            raise ValueError("请求数据过大或为空")
        return json.loads(self.rfile.read(size))

    def auth(self):
        bearer = self.headers.get("Authorization", "")
        user = token_user(bearer[7:] if bearer.startswith("Bearer ") else "")
        if not user:
            raise PermissionError("请重新登录")
        return user

    def do_POST(self):
        path = urlsplit(self.path).path
        try:
            if path == "/api/mp/register":
                data = self.body()
                name, password = str(data.get("nickname", "")).strip(), str(data.get("password", ""))
                if not 2 <= len(name) <= 16 or any(ord(c) < 32 for c in name):
                    raise ValueError("昵称须为 2 至 16 字")
                if len(password) < 8:
                    raise ValueError("密码至少 8 位")
                salt = secrets.token_bytes(16)
                digest = hashlib.scrypt(password.encode(), salt=salt, n=16384, r=8, p=1)
                with lock:
                    try:
                        cur = db.execute("INSERT INTO mp_user(nickname,salt,password_hash) VALUES(?,?,?)", (name, salt, digest))
                    except sqlite3.IntegrityError:
                        raise ValueError("昵称已被使用")
                    db.execute("INSERT INTO mp_player(user_id,look_json) VALUES(?,?)", (cur.lastrowid, json.dumps(DEFAULT_LOOK)))
                self.send_json(201, {"ok": True})
            elif path == "/api/mp/login":
                data = self.body()
                name, password = str(data.get("nickname", "")).strip(), str(data.get("password", ""))
                u = row("SELECT * FROM mp_user WHERE nickname=?", (name,))
                if not u or not hmac.compare_digest(hashlib.scrypt(password.encode(), salt=u["salt"], n=16384, r=8, p=1), u["password_hash"]):
                    raise PermissionError("昵称或密码错误")
                token = secrets.token_urlsafe(32)
                with lock:
                    db.execute("DELETE FROM mp_token WHERE user_id=?", (u["id"],))
                    db.execute("INSERT INTO mp_token(token_hash,user_id,expires_at) VALUES(?,?,?)", (hashlib.sha256(token.encode()).hexdigest(), u["id"], time.time() + 86400))
                old = active.get(u["id"])
                if old and event_loop:
                    event_loop.call_soon_threadsafe(lambda: asyncio.create_task(old["ws"].close(4001, "账号在另一处登录")))
                self.send_json(200, {"token": token, "user": player_of(u["id"])})
            elif path == "/api/mp/logout":
                u = self.auth()
                execute("DELETE FROM mp_token WHERE user_id=?", (u["id"],))
                old = active.get(u["id"])
                if old and event_loop:
                    event_loop.call_soon_threadsafe(lambda: asyncio.create_task(old["ws"].close(4001, "已退出登录")))
                self.send_json(200, {"ok": True})
            else:
                self.send_json(404, {"error": "接口不存在"})
        except PermissionError as exc:
            self.send_json(401, {"error": str(exc)})
        except (ValueError, KeyError, TypeError, json.JSONDecodeError) as exc:
            self.send_json(400, {"error": str(exc)})

    def do_PUT(self):
        try:
            if urlsplit(self.path).path != "/api/mp/profile/me":
                return self.send_json(404, {"error": "接口不存在"})
            u, data = self.auth(), self.body()
            if "nickname" in data:
                raise ValueError("昵称不可修改")
            look = valid_look(data.get("look", DEFAULT_LOOK))
            bio = str(data.get("bio", "")).strip()
            college = str(data.get("college", "")).strip()
            grade = str(data.get("grade", "")).strip()
            tags = data.get("tags", [])
            if len(bio) > 40 or len(college) > 32 or len(grade) > 8 or not isinstance(tags, list) or len(tags) > 5 or any(not isinstance(t, str) or len(t) > 6 for t in tags):
                raise ValueError("资料长度超出限制")
            execute("UPDATE mp_player SET look_json=?,bio=?,college=?,grade=?,tags=? WHERE user_id=?", (json.dumps(look), bio, college, grade, json.dumps(tags, ensure_ascii=False), u["id"]))
            self.send_json(200, public_profile(u["id"]))
        except PermissionError as exc:
            self.send_json(401, {"error": str(exc)})
        except (ValueError, TypeError, json.JSONDecodeError) as exc:
            self.send_json(400, {"error": str(exc)})

    def do_GET(self):
        path = urlsplit(self.path).path
        if path.startswith("/api/mp/"):
            try:
                if path == "/api/mp/health":
                    return self.send_json(200, {"ok": True, "online": len(active)})
                u = self.auth()
                if path == "/api/mp/profile/me":
                    return self.send_json(200, public_profile(u["id"]))
                if path.startswith("/api/mp/profile/"):
                    target = int(path.rsplit("/", 1)[1])
                    profile = public_profile(target)
                    return self.send_json(200 if profile else 404, profile or {"error": "玩家不存在"})
                return self.send_json(404, {"error": "接口不存在"})
            except PermissionError as exc:
                return self.send_json(401, {"error": str(exc)})
            except ValueError:
                return self.send_json(400, {"error": "玩家编号无效"})
        requested = unquote(path.lstrip("/")) or "像素校园_多人版.html"
        if requested not in {"像素校园_多人版.html", "mp/look.js", "mp/lobby.js", "mp/theme.css"}:
            self.send_error(404)
            return
        target = (ROOT / requested).resolve()
        if not target.is_relative_to(ROOT) or not target.is_file():
            self.send_error(404)
            return
        body = target.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", (mimetypes.guess_type(target.name)[0] or "application/octet-stream") + ("; charset=utf-8" if target.suffix in (".html", ".js", ".css") else ""))
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


async def send(ws, payload):
    await ws.send(json.dumps(payload, ensure_ascii=False, separators=(",", ":")))


async def broadcast(payload, recipients):
    await asyncio.gather(*(send(s["ws"], payload) for s in recipients if s["ws"].state.name == "OPEN"), return_exceptions=True)


def peer_data(s):
    return {"id": s["id"], "nickname": s["nickname"], "look": s["look"], "x": s["x"], "y": s["y"], "dir": s["dir"], "scene": s["scene"]}


async def leave_scene(s, reason="leave"):
    await broadcast({"type": "peer.leave", "id": s["id"], "reason": reason}, [p for p in active.values() if p is not s and p["scene"] == s["scene"]])


async def handle_message(s, data):
    typ = data.get("type")
    uid = s["id"]
    if typ == "ping":
        s["last_ping"] = time.monotonic()
        await send(s["ws"], {"type": "pong"})
        return
    if typ == "hello":
        if s["hello"]:
            return
        scene = data.get("scene", "out")
        if scene not in SCENES:
            scene = "out"
        s.update(scene=scene, x=clamp_number(data.get("x"), 0, 6000), y=clamp_number(data.get("y"), 0, 4000), dir=valid_dir(data.get("dir")), hello=True)
        peers = [peer_data(p) for p in active.values() if p is not s and p["hello"] and p["scene"] == scene]
        execute("INSERT INTO mp_presence(user_id,last_seen,last_scene) VALUES(?,?,?) ON CONFLICT(user_id) DO UPDATE SET last_seen=excluded.last_seen,last_scene=excluded.last_scene", (uid, time.time(), scene))
        s["last_save"] = time.monotonic()
        await send(s["ws"], {"type": "welcome", "me": player_of(uid), "scene": scene, "peers": peers, "serverTime": now_iso()})
        await broadcast({"type": "peer.join", "peer": peer_data(s)}, [p for p in active.values() if p is not s and p["hello"] and p["scene"] == scene])
        await broadcast({"type": "presence", "userId": uid, "online": True}, [p for p in active.values() if p is not s and p["hello"]])
        for item in rows("SELECT * FROM mp_message WHERE to_user=? AND read_at IS NULL ORDER BY id LIMIT 100", (uid,)):
            await send(s["ws"], {"type": "chat.msg", **message_dict(item)})
        return
    if not s["hello"]:
        return
    if typ == "move":
        stamp = time.monotonic()
        if stamp - s["last_move"] < 0.09:
            return
        x, y = clamp_number(data.get("x"), 0, 6000), clamp_number(data.get("y"), 0, 4000)
        if (x, y, data.get("dir")) == (s["x"], s["y"], s["dir"]):
            return
        s.update(x=x, y=y, dir=valid_dir(data.get("dir")), last_move=stamp)
        if stamp - s["last_save"] >= 10:
            execute("UPDATE mp_player SET last_scene=?,last_x=?,last_y=? WHERE user_id=?", (s["scene"], x, y, uid))
            s["last_save"] = stamp
        await broadcast({"type": "peer.move", "id": uid, "x": x, "y": y, "dir": s["dir"], "t": now_iso()}, [p for p in active.values() if p is not s and p["hello"] and p["scene"] == s["scene"] and abs(p["x"]-x) < 2400 and abs(p["y"]-y) < 1500])
    elif typ == "scene.change":
        target = data.get("to")
        if target not in SCENES or target == s["scene"]:
            return
        await leave_scene(s, "scene")
        s.update(scene=target, x=clamp_number(data.get("x"), 0, 6000), y=clamp_number(data.get("y"), 0, 4000))
        execute("UPDATE mp_presence SET last_seen=?,last_scene=? WHERE user_id=?", (time.time(), target, uid))
        execute("UPDATE mp_player SET last_scene=?,last_x=?,last_y=? WHERE user_id=?", (target, s["x"], s["y"], uid))
        await send(s["ws"], {"type": "scene.peers", "scene": target, "peers": [peer_data(p) for p in active.values() if p is not s and p["hello"] and p["scene"] == target]})
        await broadcast({"type": "peer.join", "peer": peer_data(s)}, [p for p in active.values() if p is not s and p["hello"] and p["scene"] == target])
    elif typ == "look.update":
        try:
            look = valid_look(data.get("look"))
        except ValueError:
            return await send(s["ws"], {"type": "error", "code": "BAD_LOOK", "msg": "形象数据无效"})
        s["look"] = look
        execute("UPDATE mp_player SET look_json=? WHERE user_id=?", (json.dumps(look), uid))
        await broadcast({"type": "peer.look", "id": uid, "look": look}, [p for p in active.values() if p is not s and p["hello"] and p["scene"] == s["scene"]])
    elif typ == "announce.list":
        await send(s["ws"], {"type": "announce.list", "items": announcements(data.get("limit", 50))})
    elif typ == "announce.post":
        content = str(data.get("content", "")).strip()
        key = str(data.get("clientMsgId", ""))[:80]
        if not content or len(content) > 200:
            return await send(s["ws"], {"type": "error", "code": "ANNOUNCE_LENGTH", "msg": "公告须为 1 至 200 字", "clientMsgId": key})
        if key and row("SELECT id FROM mp_announcement WHERE user_id=? AND client_msg_id=?", (uid, key)):
            return
        latest = row("SELECT created_at FROM mp_announcement WHERE user_id=? ORDER BY id DESC LIMIT 1", (uid,))
        count = row("SELECT COUNT(*) AS n FROM mp_announcement WHERE user_id=? AND created_at>?", (uid, time.time()-86400))["n"]
        if latest and time.time()-latest["created_at"] < 30 or count >= 20:
            return await send(s["ws"], {"type": "error", "code": "ANNOUNCE_RATE", "msg": "公告每 30 秒一条，每天最多 20 条", "clientMsgId": key})
        stamp = time.time()
        cur = execute("INSERT INTO mp_announcement(user_id,content,created_at,client_msg_id) VALUES(?,?,?,?)", (uid, content, stamp, key or None))
        await broadcast({"type": "announce.new", "id": cur.lastrowid, "userId": uid, "nickname": s["nickname"], "look": s["look"], "content": content, "at": now_iso(stamp), "online": True}, list(active.values()))
    elif typ == "chat.history":
        other = int(data.get("withUser", 0))
        if other == uid or not player_of(other):
            return await send(s["ws"], {"type": "error", "code": "BAD_USER", "msg": "玩家不存在"})
        a, b = sorted((uid, other))
        session = row("SELECT id FROM mp_session WHERE user_a=? AND user_b=?", (a, b))
        before, limit = int(data.get("beforeId") or 2**63-1), min(max(int(data.get("limit", 30)), 1), 30)
        msgs = rows("SELECT * FROM mp_message WHERE session_id=? AND id<? ORDER BY id DESC LIMIT ?", (session["id"] if session else -1, before, limit))
        execute("UPDATE mp_message SET read_at=? WHERE to_user=? AND from_user=? AND read_at IS NULL", (time.time(), uid, other))
        await send(s["ws"], {"type": "chat.history", "withUser": other, "items": [message_dict(m) for m in reversed(msgs)], "hasMore": len(msgs) == limit})
    elif typ == "chat.send":
        other = int(data.get("to", 0))
        content, key = str(data.get("content", "")).strip(), str(data.get("clientMsgId", ""))[:80]
        if other == uid or not player_of(other) or not content or len(content) > 500 or not key:
            return await send(s["ws"], {"type": "error", "code": "BAD_CHAT", "msg": "消息或收件人无效", "clientMsgId": key})
        dup = row("SELECT * FROM mp_message WHERE from_user=? AND client_msg_id=?", (uid, key))
        if dup:
            return await send(s["ws"], {"type": "chat.ack", "clientMsgId": key, "msgId": dup["id"], "at": now_iso(dup["created_at"])})
        recent = row("SELECT created_at FROM mp_message WHERE from_user=? ORDER BY id DESC LIMIT 1", (uid,))
        minute = row("SELECT COUNT(*) AS n FROM mp_message WHERE from_user=? AND created_at>?", (uid, time.time()-60))["n"]
        if recent and time.time()-recent["created_at"] < 1 or minute >= 30:
            return await send(s["ws"], {"type": "error", "code": "CHAT_RATE", "msg": "私聊至少间隔 1 秒，每分钟最多 30 条", "clientMsgId": key})
        a, b = sorted((uid, other))
        stamp = time.time()
        with lock:
            db.execute("INSERT OR IGNORE INTO mp_session(user_a,user_b,created_at) VALUES(?,?,?)", (a, b, stamp))
            session = db.execute("SELECT id FROM mp_session WHERE user_a=? AND user_b=?", (a, b)).fetchone()["id"]
            cur = db.execute("INSERT INTO mp_message(session_id,from_user,to_user,content,created_at,client_msg_id) VALUES(?,?,?,?,?,?)", (session, uid, other, content, stamp, key))
            msg = db.execute("SELECT * FROM mp_message WHERE id=?", (cur.lastrowid,)).fetchone()
        await send(s["ws"], {"type": "chat.ack", "clientMsgId": key, "msgId": msg["id"], "at": now_iso(stamp)})
        if other in active:
            await send(active[other]["ws"], {"type": "chat.msg", **message_dict(msg)})


def valid_dir(value):
    return value if value in ("up", "down", "left", "right") else "down"


def clamp_number(value, minimum, maximum):
    try:
        number = float(value)
        if number != number or number in (float("inf"), float("-inf")):
            raise ValueError()
        return min(max(number, minimum), maximum)
    except (TypeError, ValueError):
        return minimum


async def handle_ws(ws):
    path = urlsplit(ws.request.path)
    if path.path != "/mp":
        await ws.close(4003, "路径无效")
        return
    token = parse_qs(path.query).get("token", [""])[0]
    user = token_user(token)
    if not user:
        await ws.close(4003, "登录已失效")
        return
    uid = user["id"]
    old = active.get(uid)
    if old:
        await old["ws"].close(4001, "账号在另一处登录")
    p = player_of(uid)
    s = {"id": uid, "nickname": user["nickname"], "look": p["look"], "ws": ws, "hello": False, "scene": "out", "x": 0, "y": 0, "dir": "down", "last_move": 0, "last_ping": time.monotonic()}
    active[uid] = s
    try:
        async for raw in ws:
            if len(raw) > 4096:
                await ws.close(1009, "消息过大")
                break
            if not token_user(token):
                await ws.close(4003, "登录已失效")
                break
            try:
                data = json.loads(raw)
                if isinstance(data, dict):
                    await handle_message(s, data)
            except (ValueError, TypeError, KeyError, json.JSONDecodeError):
                await send(ws, {"type": "error", "code": "BAD_REQUEST", "msg": "请求格式无效"})
    finally:
        if active.get(uid) is s:
            del active[uid]
            execute("INSERT INTO mp_presence(user_id,last_seen,last_scene) VALUES(?,?,?) ON CONFLICT(user_id) DO UPDATE SET last_seen=excluded.last_seen,last_scene=excluded.last_scene", (uid, time.time(), s["scene"]))
            execute("UPDATE mp_player SET last_scene=?,last_x=?,last_y=? WHERE user_id=?", (s["scene"], s["x"], s["y"], uid))
            if s["hello"]:
                await leave_scene(s, "offline")
                await broadcast({"type": "presence", "userId": uid, "online": False, "lastSeen": now_iso()}, list(active.values()))


async def sweep():
    while True:
        await asyncio.sleep(5)
        for s in list(active.values()):
            if time.monotonic()-s["last_ping"] > 45:
                await s["ws"].close(4008, "心跳超时")


async def main():
    global event_loop
    event_loop = asyncio.get_running_loop()
    http = ThreadingHTTPServer((HOST, HTTP_PORT), Handler)
    threading.Thread(target=http.serve_forever, daemon=True).start()
    print(f"大厅页面: http://localhost:{HTTP_PORT}/  (局域网其他电脑用本机 IP 替换 localhost)")
    print(f"WebSocket: ws://<本机 IP>:{WS_PORT}/mp | SQLite: {DB_PATH}")
    async with serve(handle_ws, HOST, WS_PORT, max_size=4096, ping_interval=None):
        await sweep()


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        pass
