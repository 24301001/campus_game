"""躲猫猫 · 房间桥接服务（CF 式游戏房间大厅）

独立部署，不隶属像素校园也不隶属 duo1：
  代码   /opt/campus_bridge/bridge.py      （本文件）
  大厅页 /opt/campus_bridge/lobby.html
  监听   127.0.0.1:8300，对外由 nginx 挂在 /game/ 前缀下
  服务   campus-bridge.service（User=wr）

它只管三件事：房间表、准备状态、开局时发一个一次性房码。
3D 同步仍然由 duo1 自己的 room_server.py(8124) 负责，本文件不碰游戏逻辑。

登录态**不回问数据库**，只回问大厅已有的接口：
  GET http://127.0.0.1:3000/api/mp/profile/me   （Bearer <mpToken>，200 才算登录）
所以本服务不读写 lobby.sqlite3，也不需要在 duo1 那边装任何账号体系。
"""
from __future__ import annotations

import hashlib
import hmac
import json
import os
import secrets
import threading
import time
import urllib.error
import urllib.parse
import urllib.request
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

HOST = os.environ.get("BRIDGE_HOST", "127.0.0.1")
PORT = int(os.environ.get("BRIDGE_PORT", "8300"))
LOBBY_BASE = os.environ.get("MP_LOBBY", "http://127.0.0.1:3000")
HERE = Path(__file__).resolve().parent

MAX_MEMBERS = 2                      # 与 duo1 room_server.py 的 MAX_PER_ROOM 对齐
MAX_OWN = 1                          # 一个人最多占 1 间房（做东或当客人都算），否则一个人能刷满列表
MAX_ROOMS = 60                       # 全局上限，防内存堆
CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"   # 与 net.js readRoom() 的字符集一致
CODE_LEN = 5
ROOM_IDLE = 900                      # 全员不再轮询 15 分钟 ⇒ 收房
CODE_TTL = 600                       # 房码 10 分钟内没人用就作废
AUTH_TTL = 60                        # 同一个 token 一分钟内不重复回问大厅
NAME_MAX = 24
PW_MAX = 16                          # 好友房密码长度上限


def pw_hash(rid: str, pw: str) -> str:
    """密码只留哈希，且拿房间 id 当盐：不同房用同一个密码也不会撞出同一个串。"""
    return hashlib.sha256((rid + ":" + pw).encode()).hexdigest()

# 本目录里可以直发的页面。照名字取，不拼路径 —— 防着 /game/../server.py 这种走法。
PAGES = {"duo1": "lobby.html", "probe-pointer-lock": "probe-pointer-lock.html"}

rooms: dict[str, dict] = {}
auth_cache: dict[str, tuple[float, dict]] = {}
lock = threading.RLock()
room_seq = 0


def now() -> float:
    return time.time()


def new_code() -> str:
    while True:
        code = "".join(secrets.choice(CODE_ALPHABET) for _ in range(CODE_LEN))
        with lock:                                  # 房码不许撞已在用的
            if not any(r["code"] == code for r in rooms.values()):
                return code


def identify(token: str):
    """问大厅这个 token 是谁。返回 {id, nickname} 或 None。"""
    if not token:
        return None
    key = hashlib.sha256(token.encode()).hexdigest()[:32]   # 不把 token 原文留在缓存键里
    hit = auth_cache.get(key)
    if hit and now() - hit[0] < AUTH_TTL:
        return hit[1]
    req = urllib.request.Request(LOBBY_BASE + "/api/mp/profile/me",
                                headers={"Authorization": "Bearer " + token})
    try:
        with urllib.request.urlopen(req, timeout=5) as resp:
            body = json.loads(resp.read(1 << 20))
    except (urllib.error.URLError, TimeoutError, ValueError):
        return None
    user = {"id": int(body["id"]), "nickname": body.get("nickname") or ("玩家" + str(body["id"]))}
    auth_cache[key] = (now(), user)
    return user


def alive_members(room: dict) -> list[dict]:
    return [m for m in room["members"].values() if now() - m["poll"] < ROOM_IDLE]


def view(room: dict, me: dict):
    """给前端看的房间。房码只在"已开局且你是这间房里的人"时才给。

    名单只算「还在轮询的人」：关掉抽屉没点「离开房间」的人 poll 会停，
    若把这种僵尸成员也算进 members，房间会一直显示 2/2 满 —— 列表按钮变
    「进不去」，而服务端 act_join 又按 alive 判可以进，两边口径不一致，
    表现就是"点了没反应"。这里统一按 alive_members 出名单。
    """
    members = sorted(alive_members(room), key=lambda m: m["joined"])
    return {
        "id": room["id"],
        "name": room["name"],
        "owner": room["owner"],
        "status": room["status"],
        "capacity": MAX_MEMBERS,
        "members": [{"id": m["id"], "nickname": m["nickname"], "ready": m["ready"],
                     "isOwner": m["id"] == room["owner"]["id"]} for m in members],
        "full": len(members) >= MAX_MEMBERS,
        "locked": bool(room.get("pw")),        # 只说"要不要密码"，绝不把密码或哈希发出去
        "guestReady": any(m["id"] != room["owner"]["id"] and m["ready"] for m in members),
        "canStart": room["owner"]["id"] == me["id"] and len(members) >= 2
                    and room["status"] == "waiting",
        "startedBy": room.get("started_by"),
        "code": room["code"] if (me and me["id"] in room["members"] and room["status"] == "playing") else None,
        "created": room["created"],
    }


def touch(room: dict, me: dict):
    m = room["members"].get(me["id"])
    if m:
        m["poll"] = now()


def reap():
    with lock:
        for rid in list(rooms):
            room = rooms[rid]
            if alive_members(room):
                if room["status"] == "playing" and room["code"] and now() - room["code_at"] > CODE_TTL:
                    room["status"], room["code"] = "waiting", None   # 码过期但人还在
                continue
            rooms.pop(rid, None)


class Handler(BaseHTTPRequestHandler):
    server_version = "campus-bridge/1"

    def log_message(self, fmt, *args):
        print("[bridge] " + fmt % args, flush=True)

    # ---------- 小工具 ----------
    def json_out(self, code, data):
        body = json.dumps(data, ensure_ascii=False).encode()
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def html_out(self, path: Path):
        body = path.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def me(self):
        return identify(self.headers.get("Authorization", "").removeprefix("Bearer ").strip())

    def payload(self):
        try:
            n = int(self.headers.get("Content-Length") or 0)
            return json.loads(self.rfile.read(min(n, 1 << 16)) or b"{}")
        except (ValueError, TypeError):
            return {}

    def room_of(self, data):
        rid = str(data.get("id") or "")
        return rooms.get(rid), rid

    # ---------- 路由 ----------
    def do_GET(self):
        path = self.path.split("?")[0]
        if path == "/game/healthz":
            return self.json_out(200, {"ok": True, "rooms": len(rooms), "lobby": LOBBY_BASE})
        # 页面按**整路径**匹配。早先用 startswith("/game/") 再取首段当名字，
        # 会把 /game/duo1/rooms 也当成"取 duo1 页面"而吃掉 JSON 路由。
        if path in ("/game/duo1", "/game/duo1/"):
            return self.html_out(HERE / PAGES["duo1"])
        if path in ("/game/probe-pointer-lock", "/game/probe-pointer-lock/"):
            return self.html_out(HERE / PAGES["probe-pointer-lock"])

        me = self.me()
        if not me:
            return self.json_out(401, {"error": "请先在像素校园登录"})
        if path == "/game/duo1/rooms":
            with lock:
                items = [view(r, me) for r in rooms.values() if alive_members(r)]
            return self.json_out(200, {"me": me, "rooms": sorted(items, key=lambda x: x["created"])})
        if path == "/game/duo1/room":
            query = urllib.parse.urlsplit(self.path).query
            rid = (urllib.parse.parse_qs(query).get("id") or [""])[0]
            with lock:
                room = rooms.get(rid)
                if not room:
                    return self.json_out(404, {"error": "房间不存在或已关闭"})
                touch(room, me)
                return self.json_out(200, {"me": me, "room": view(room, me)})
        return self.json_out(404, {"error": "no such path"})

    def do_POST(self):
        path = self.path.split("?")[0]
        me = self.me()
        if not me:
            return self.json_out(401, {"error": "请先在像素校园登录"})
        data = self.payload()
        self._body = data                       # act_join 要读 body 里的 pass；一条连接一个 handler，不共享
        action = path.rsplit("/", 1)[-1]

        if action == "create":
            return self.create(me, data)
        if action in ("join", "ready", "unready", "start", "end", "leave"):
            with lock:
                room, rid = self.room_of(data)
                if not room:
                    return self.json_out(404, {"error": "房间不存在或已关闭"})
                touch(room, me)
                handler = getattr(self, "act_" + action)
                return self.json_out(*handler(room, me))
        return self.json_out(404, {"error": "no such action"})

    # ---------- 动作 ----------
    def create(self, me, data):
        global room_seq
        name = str(data.get("name") or "").strip()[:NAME_MAX] or (me["nickname"] + " 的房间")
        with lock:                                  # 闸和建房必须在同一把锁里，否则并发能刷出两间
            busy = sorted(r["id"] for r in rooms.values()
                          if alive_members(r) and (r["owner"]["id"] == me["id"] or me["id"] in r["members"]))
            if busy:
                return self.json_out(409, {"error": "你已经在一间房里了（%s）：先「离开房间」，或直接等对方进来"
                                                  % "、".join(busy)})
            if len([r for r in rooms.values() if alive_members(r)]) >= MAX_ROOMS:
                return self.json_out(503, {"error": "公告栏已经贴满（%d 间），过一会儿再来" % MAX_ROOMS})
            room_seq += 1
            rid = "R%03d" % room_seq
            pw = str(data.get("pass") or "").strip()[:PW_MAX]
            rooms[rid] = {
                "id": rid, "name": name, "owner": {"id": me["id"], "nickname": me["nickname"]},
                "members": {me["id"]: {"id": me["id"], "nickname": me["nickname"],
                                       "ready": False, "joined": now(), "poll": now()}},
                "status": "waiting", "code": None, "code_at": 0,
                "created": now(), "started_by": None,
                "pw": pw_hash(rid, pw) if pw else None,
            }
            room = rooms[rid]
        print(f"[bridge] 建房 {rid}「{name}」房主={me['nickname']}"
              f"{'（好友房）' if room['pw'] else ''}", flush=True)
        return self.json_out(200, {"me": me, "room": view(room, me)})

    def act_join(self, room, me):
        if me["id"] in room["members"]:
            return 200, {"me": me, "room": view(room, me)}      # 已经在里面（含房主）⇒ 不再要密码
        if room["status"] == "playing":
            return 409, {"error": "这局已经开始了，等他们打完"}
        if room.get("pw"):
            given = str((self._body or {}).get("pass") or "").strip()[:PW_MAX]
            if not given:
                return 403, {"error": "这间房是好友房，要密码"}
            if not hmac.compare_digest(pw_hash(room["id"], given), room["pw"]):
                return 403, {"error": "密码不对"}
        if len(alive_members(room)) >= MAX_MEMBERS:
            return 409, {"error": "这间房满了（%d/%d）" % (len(room["members"]), MAX_MEMBERS)}
        room["members"][me["id"]] = {"id": me["id"], "nickname": me["nickname"],
                                     "ready": False, "joined": now(), "poll": now()}
        print(f"[bridge] 进房 {room['id']} {me['nickname']}", flush=True)
        return 200, {"me": me, "room": view(room, me)}

    def act_ready(self, room, me):
        m = room["members"].get(me["id"])
        if not m:
            return 409, {"error": "你不在这间房里"}
        m["ready"] = True
        return 200, {"me": me, "room": view(room, me)}

    def act_unready(self, room, me):
        m = room["members"].get(me["id"])
        if not m:
            return 409, {"error": "你不在这间房里"}
        m["ready"] = False
        return 200, {"me": me, "room": view(room, me)}

    def act_start(self, room, me):
        """房主专属。条件按他说的：房主之外那位也准备了就行，房主自己不用点准备。"""
        if room["owner"]["id"] != me["id"]:
            return 403, {"error": "只有房主能开始"}
        if room["status"] == "playing":
            return 409, {"error": "已经开始了"}
        if len(alive_members(room)) < 2:
            return 409, {"error": "还差一个人"}
        if not view(room, me)["guestReady"]:
            return 409, {"error": "另一位还没准备"}
        room["code"], room["code_at"] = new_code(), now()
        room["status"], room["started_by"] = "playing", me["nickname"]
        for m in room["members"].values():
            m["ready"] = False
        print(f"[bridge] 开局 {room['id']} 房码={room['code']} 房主={me['nickname']}", flush=True)
        return 200, {"me": me, "room": view(room, me)}

    def act_end(self, room, me):
        """打完回大厅：作废旧码，下局换新码（防 iframe 沿用旧地址）。"""
        if room["owner"]["id"] != me["id"]:
            return 403, {"error": "只有房主能结束"}
        room["status"], room["code"] = "waiting", None
        for m in room["members"].values():
            m["ready"] = False
        return 200, {"me": me, "room": view(room, me)}

    def act_leave(self, room, me):
        room["members"].pop(me["id"], None)
        if me["id"] == room["owner"]["id"]:
            rooms.pop(room["id"], None)          # 房主走 = 房关，不做隐式的房主移交
            return 200, {"left": True, "dissolved": True}
        if not alive_members(room):
            rooms.pop(room["id"], None)
        return 200, {"left": True}


def main():
    threading.Thread(target=lambda: [time.sleep(60) or reap() for _ in iter(int, 1)],
                     daemon=True).start()
    httpd = ThreadingHTTPServer((HOST, PORT), Handler)
    print(f"[bridge] 躲猫猫房间大厅已启动：http://{HOST}:{PORT}/game/duo1/ （回问大厅 {LOBBY_BASE}）", flush=True)
    httpd.serve_forever()


if __name__ == "__main__":
    main()
