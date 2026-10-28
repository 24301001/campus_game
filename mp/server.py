"""Local LAN lobby server. Run: python mp/server.py (Python 3.10+, websockets 15+)."""
from __future__ import annotations

import asyncio
import http.client
import hashlib
import hmac
import json
import mimetypes
import os
import re
import secrets
import sqlite3
import threading
import time
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from http.cookies import SimpleCookie
from pathlib import Path
from urllib.parse import parse_qs, unquote, urlsplit
import urllib.error
import urllib.request

from websockets.asyncio.server import serve

ROOT = Path(__file__).resolve().parent.parent
DB_PATH = Path(os.environ.get("MP_DB", ROOT / "mp" / "lobby.sqlite3"))
HOST = os.environ.get("MP_HOST", "0.0.0.0")
HTTP_PORT = int(os.environ.get("MP_HTTP_PORT", "3000"))
WS_PORT = int(os.environ.get("MP_WS_PORT", "8090"))
CMR_PORT = int(os.environ.get("CMR_PORT", "8020"))  # [QODER-FIX #22] 食堂阿姨可跑独立实例(如 8021)，不碰 /opt
DEFAULT_LOOK = {"skin": "#f2c9a0", "hairStyle": "short", "hairColor": "#30251e", "eye": "round", "eyeColor": "#332a2b", "cloth": "#c94954", "clothAlt": "#f3eee7", "clothPattern": "solid", "pants": "#38516d", "acc": "none", "accColor": "#b67a56"}
LOOK_COLORS = ("skin", "hairColor", "eyeColor", "cloth", "clothAlt", "pants", "accColor")
LOOK_CHOICES = {"hairStyle": ("short", "mid", "long", "ponytail", "bun", "twintails"), "eye": ("round", "narrow", "dot"), "acc": ("none", "glasses", "cap", "scarf"), "clothPattern": ("solid", "stripe")}
DEFAULT_VISIBILITY = {"bio": True, "college": True, "grade": True, "tags": True}
# 学院不手填：主页上是下拉，名单只有这里这一份（与 8081 那套 MpProfileService.COLLEGES 对齐）。
CAMPUS_COLLEGES = ("计算机科学与技术学院", "电子信息工程学院", "自动化与智能学院", "电气工程学院",
                   "机械与电子控制工程学院", "交通运输学院", "土木建筑工程学院", "环境学院",
                   "化学化工学院", "建筑与艺术学院", "数学与统计学院", "物理科学与工程学院",
                   "系统科学学院", "软件学院", "网络空间安全学院（国家保密学院）", "经济管理学院",
                   "法学院", "语言与传播学院", "马克思主义学院", "体育与健康学院",
                   "詹天佑学院", "威海国际学院", "国际教育学院", "继续教育学院", "其他")
SCENES = {"out", "center", "yifu"}
NPC_PORTS = {"xbg": 8010, "ld": 8000, "cmr": CMR_PORT, "agent": 8081}
PROXY_PREFIXES = (("/xbg", 8010), ("/ld", 8000), ("/cmr", CMR_PORT),
                  ("/api/", 8081), ("/agent", 3001), ("/assets/", 3001),
                  ("/@vite/", 3001), ("/@id/", 3001), ("/@fs/", 3001),
                  ("/__vite_ping", 3001), ("/src/", 3001), ("/node_modules/", 3001),
                  ("/favicon.ico", 3001))
NPC_HEALTH_PATHS = {"/xbg/api/health", "/ld/api/health", "/cmr/api/health", "/api/agent/status"}

DB_PATH.parent.mkdir(parents=True, exist_ok=True)
db = sqlite3.connect(DB_PATH, check_same_thread=False, isolation_level=None)
db.row_factory = sqlite3.Row
lock = threading.RLock()
with lock:
    db.executescript("""
    PRAGMA journal_mode=WAL;
    CREATE TABLE IF NOT EXISTS mp_user(id INTEGER PRIMARY KEY, nickname TEXT NOT NULL UNIQUE, salt BLOB NOT NULL, password_hash BLOB NOT NULL);
    CREATE TABLE IF NOT EXISTS mp_npc_secret(user_id INTEGER PRIMARY KEY, secret BLOB NOT NULL);
    CREATE TABLE IF NOT EXISTS mp_token(token_hash TEXT PRIMARY KEY, user_id INTEGER NOT NULL, expires_at REAL NOT NULL);
    CREATE TABLE IF NOT EXISTS mp_player(user_id INTEGER PRIMARY KEY, look_json TEXT NOT NULL, bio TEXT NOT NULL DEFAULT '', college TEXT NOT NULL DEFAULT '', grade TEXT NOT NULL DEFAULT '', tags TEXT NOT NULL DEFAULT '[]', last_scene TEXT NOT NULL DEFAULT 'out', last_x REAL NOT NULL DEFAULT 0, last_y REAL NOT NULL DEFAULT 0);
    CREATE TABLE IF NOT EXISTS mp_presence(user_id INTEGER PRIMARY KEY, last_seen REAL NOT NULL, last_scene TEXT NOT NULL DEFAULT 'out');
    CREATE TABLE IF NOT EXISTS mp_session(id INTEGER PRIMARY KEY, user_a INTEGER NOT NULL, user_b INTEGER NOT NULL, created_at REAL NOT NULL, UNIQUE(user_a,user_b));
    CREATE TABLE IF NOT EXISTS mp_message(id INTEGER PRIMARY KEY, session_id INTEGER NOT NULL, from_user INTEGER NOT NULL, to_user INTEGER NOT NULL, content TEXT NOT NULL, created_at REAL NOT NULL, read_at REAL, client_msg_id TEXT, UNIQUE(from_user,client_msg_id));
    CREATE INDEX IF NOT EXISTS idx_mp_message_session ON mp_message(session_id,id);
    CREATE INDEX IF NOT EXISTS idx_mp_message_unread ON mp_message(to_user,read_at);
    CREATE INDEX IF NOT EXISTS idx_mp_message_sent ON mp_message(from_user,id);
    CREATE TABLE IF NOT EXISTS mp_announcement(id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL, content TEXT NOT NULL, created_at REAL NOT NULL, client_msg_id TEXT, UNIQUE(user_id,client_msg_id));
    CREATE INDEX IF NOT EXISTS idx_mp_announcement_time ON mp_announcement(created_at);
    CREATE INDEX IF NOT EXISTS idx_mp_announcement_user ON mp_announcement(user_id,id);
    """)
    if "visibility_json" not in {column["name"] for column in db.execute("PRAGMA table_info(mp_player)")}:
        db.execute("ALTER TABLE mp_player ADD COLUMN visibility_json TEXT NOT NULL DEFAULT '{\"bio\":true,\"college\":true,\"grade\":true,\"tags\":true}'")

active: dict[int, dict] = {}
grants: dict[str, set[str]] = {}
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


# ---------- 照片 → 形象：交给多模态模型看，浏览器里那套 128px 颜色统计只当断网兜底 ----------
# 密钥不出服务端：环境变量 DASHSCOPE_API_KEY 优先，否则复用老丁那侧已 gitignore 的 key 文件。
QWEN_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions"
QWEN_MODEL = "qwen3.8-flash"
QWEN_TIMEOUT = 25
QWEN_KEY_FILE = ROOT / "laoding" / "server" / "qwen_key.txt"
# 肤色和瞳色给的是**档位**不是自由值：像素小人脸只有 7 格宽，模型报回来的
# #e8c8a9 和 #f2c9a0 这种差别画不出来，反而每次刷新都换一个色。
SKIN_TONES = ("#f7d9bd", "#f2c9a0", "#e0ac7e", "#c68642", "#8d5524", "#5c3a21")
EYE_TONES = ("#332a2b", "#4a3423", "#6b4a2f", "#3d5a6c", "#4a5d4e", "#2f2f38")
LOOK_PROMPT = (
    "你是像素风卡通形象生成助手。看这张人物照片，抽出把**这个人**画成像素小人所需的特征。\n"
    "只根据图片里看得见的内容判断；被挡住、看不清的按最接近的选项，严禁编造。\n"
    '只输出一个 JSON 对象（不要 markdown 代码块、不要任何解释文字）：\n'
    '{"skin":"肤色","hairStyle":"发型","hairColor":"发色hex","eye":"眼型","eyeColor":"瞳色",'
    '"cloth":"上衣主色hex","clothPattern":"solid或stripe","clothAlt":"条纹副色hex",'
    '"pants":"裤子颜色hex","acc":"配饰","accColor":"配饰颜色hex"}\n'
    "取值规则：\n"
    "- 所有颜色写成 # 加 6 位十六进制，例如 #3a2b1f。\n"
    "- skin 必须从这 6 档里原样选一个：" + " ".join(SKIN_TONES) + "。\n"
    "- eyeColor 必须从这 6 档里原样选一个：" + " ".join(EYE_TONES) + "。\n"
    "- hairStyle 只能取 short(短发、露耳) mid(齐肩) long(过肩披发) ponytail(在脑后扎成一束) "
    "bun(盘成丸子) twintails(左右两束)；看不出扎没扎起来就选 short。\n"
    "- eye 只能取 round(圆而大) narrow(细长) dot(小而圆)。\n"
    "- hairColor 以头顶头发为准，避开高光、发丝反光和背景。\n"
    "- cloth/clothAlt/pants 取照片里这个人**身上实际穿的那件衣服和裤子**的颜色，"
    "不要取背景、不要取皮肤；上衣明显是条纹才 clothPattern=stripe，否则 solid。\n"
    "- acc 只能取 none glasses(戴眼镜) cap(戴帽子) scarf(围围巾)；没戴就 none。"
    "accColor 是镜框/帽子/围巾的颜色，none 时填 #b67a56。\n"
)


def qwen_api_key() -> str:
    key = os.environ.get("DASHSCOPE_API_KEY", "").strip()
    if key:
        return key
    try:
        return QWEN_KEY_FILE.read_text(encoding="utf-8").strip()
    except OSError:
        return ""


def _hex_color(value, fallback: str) -> str:
    text = str(value or "").strip().lower()
    digits = text[1:] if text.startswith("#") else ""
    if len(digits) == 3 and all(c in "0123456789abcdef" for c in digits):
        return "#" + "".join(c * 2 for c in digits)          # 模型爱写 #abc 这种缩写
    if len(digits) == 6 and all(c in "0123456789abcdef" for c in digits):
        return "#" + digits
    return fallback


def _nearest_tone(value, palette) -> str:
    """把模型给的任意颜色吸到最近的档位上（档位就是渲染器认的那几种肤色/瞳色）。"""
    text = _hex_color(value, "")
    if not text:
        return palette[0]
    rgb = [int(text[i:i + 2], 16) for i in (1, 3, 5)]
    def gap(color: str) -> int:
        tone = [int(color[i:i + 2], 16) for i in (1, 3, 5)]
        return sum((rgb[i] - tone[i]) ** 2 for i in range(3))
    return min(palette, key=gap)


def _one_of(value, choices, fallback: str) -> str:
    text = str(value or "").strip().lower()
    return text if text in choices else fallback


def model_look(data):
    """模型输出 → 合法 look。⚠️ 每个字段各自兜底：模型漏一个字段不该让整张脸回到默认。"""
    if not isinstance(data, dict):
        raise ValueError("模型没给出对象")
    return valid_look({
        "skin": _nearest_tone(data.get("skin"), SKIN_TONES),
        "hairStyle": _one_of(data.get("hairStyle"), LOOK_CHOICES["hairStyle"], DEFAULT_LOOK["hairStyle"]),
        "hairColor": _hex_color(data.get("hairColor"), DEFAULT_LOOK["hairColor"]),
        "eye": _one_of(data.get("eye"), LOOK_CHOICES["eye"], DEFAULT_LOOK["eye"]),
        "eyeColor": _nearest_tone(data.get("eyeColor"), EYE_TONES),
        "cloth": _hex_color(data.get("cloth"), DEFAULT_LOOK["cloth"]),
        "clothAlt": _hex_color(data.get("clothAlt"), DEFAULT_LOOK["clothAlt"]),
        "clothPattern": _one_of(data.get("clothPattern"), LOOK_CHOICES["clothPattern"], DEFAULT_LOOK["clothPattern"]),
        "pants": _hex_color(data.get("pants"), DEFAULT_LOOK["pants"]),
        "acc": _one_of(data.get("acc"), LOOK_CHOICES["acc"], DEFAULT_LOOK["acc"]),
        "accColor": _hex_color(data.get("accColor"), DEFAULT_LOOK["accColor"]),
    })


def strip_json(text: str) -> dict:
    body = (text or "").strip()
    if body.startswith("```"):
        body = body.split("\n", 1)[-1] if "\n" in body else body
        if body.rstrip().endswith("```"):
            body = body.rstrip()[:-3]
    start, end = body.find("{"), body.rfind("}")
    if 0 <= start < end:
        body = body[start:end + 1]
    return json.loads(body)


def look_from_photo(image: str):
    """POST 一张 data:image 给 Qwen，换回一份 look 配方。失败抛 ValueError / OSError。"""
    if not isinstance(image, str) or not image.startswith("data:image/") or len(image) < 100:
        raise ValueError("image 必须是 data:image base64")
    key = qwen_api_key()
    if not key:
        raise LookupError("未配置 DASHSCOPE_API_KEY")
    payload = {
        "model": QWEN_MODEL,
        "messages": [{
            "role": "user",
            "content": [
                {"type": "image_url", "image_url": {"url": image[:12 * 1024 * 1024]}},
                {"type": "text", "text": LOOK_PROMPT},
            ],
        }],
        "response_format": {"type": "json_object"},
        "enable_thinking": False,
        "temperature": 0.1,
    }
    request = urllib.request.Request(
        QWEN_URL, data=json.dumps(payload).encode("utf-8"),
        headers={"Authorization": "Bearer " + key, "Content-Type": "application/json"}, method="POST")
    # 百炼是国内服务，显式绕过系统代理（Clash 之类会把请求绕到海外节点，超时就是这么来的）
    opener = urllib.request.build_opener(urllib.request.ProxyHandler({}))
    with opener.open(request, timeout=QWEN_TIMEOUT) as response:
        out = json.loads(response.read().decode("utf-8"))
    return model_look(strip_json(out["choices"][0]["message"]["content"]))


# 匿名可调（注册前就要生成形象），所以按来源 IP 限流：模型调用是要花钱的。
LOOK_RATE_WINDOW = 60.0
LOOK_RATE_LIMIT = 8
look_calls: dict[str, list[float]] = {}
look_rate_lock = threading.Lock()


def look_rate_limited(ip: str) -> bool:
    moment = time.time()
    with look_rate_lock:
        hits = [t for t in look_calls.get(ip, []) if moment - t < LOOK_RATE_WINDOW]
        if len(hits) >= LOOK_RATE_LIMIT:
            look_calls[ip] = hits
            return True
        hits.append(moment)
        look_calls[ip] = hits
        return False


def token_user(token: str):
    if not token:
        return None
    digest = hashlib.sha256(token.encode()).hexdigest()
    return row("SELECT u.id,u.nickname FROM mp_token t JOIN mp_user u ON u.id=t.user_id WHERE t.token_hash=? AND t.expires_at>?", (digest, time.time()))


def player_of(user_id: int):
    p = row("SELECT p.*,u.nickname FROM mp_player p JOIN mp_user u ON u.id=p.user_id WHERE p.user_id=?", (user_id,))
    if not p:
        return None
    return {"id": user_id, "nickname": p["nickname"], "look": json.loads(p["look_json"]), "bio": p["bio"], "college": p["college"], "grade": p["grade"], "tags": json.loads(p["tags"]), "visibility": json.loads(p["visibility_json"])}


def public_profile(user_id: int, viewer_id: int | None = None):
    p = player_of(user_id)
    if not p:
        return None
    if viewer_id != user_id:
        # [QODER-FIX #16] 公开/隐藏真正生效：别人查看主页时，取消勾选的字段直接清空
        # （签名/学院/年级置空，兴趣标签置空数组），而不是只在前端隐藏。
        visibility = p["visibility"]
        for field in DEFAULT_VISIBILITY:
            if not visibility.get(field, True):
                p[field] = [] if field == "tags" else ""
    presence = row("SELECT last_seen FROM mp_presence WHERE user_id=?", (user_id,))
    p.update(online=user_id in active, lastSeen=now_iso(presence["last_seen"]) if presence else None)
    return p


def message_dict(m):
    sender = player_of(m["from_user"])
    return {"msgId": m["id"], "sessionId": m["session_id"], "from": m["from_user"], "to": m["to_user"], "fromNickname": sender["nickname"], "look": sender["look"], "content": m["content"], "at": now_iso(m["created_at"]), "clientMsgId": m["client_msg_id"]}


def announcements(limit=50):
    items = rows("SELECT a.*,u.nickname,p.look_json FROM mp_announcement a JOIN mp_user u ON u.id=a.user_id JOIN mp_player p ON p.user_id=a.user_id WHERE a.created_at>? ORDER BY a.id DESC LIMIT ?", (time.time() - 7 * 86400, min(max(int(limit), 1), 50)))
    return [{"id": a["id"], "userId": a["user_id"], "nickname": a["nickname"], "look": json.loads(a["look_json"]), "content": a["content"], "at": now_iso(a["created_at"]), "online": a["user_id"] in active} for a in reversed(items)]


def npc_credentials(user_id: int, kind: str):
    with lock:
        seed = db.execute("SELECT secret FROM mp_npc_secret WHERE user_id=?", (user_id,)).fetchone()
        if not seed:
            db.execute("INSERT OR IGNORE INTO mp_npc_secret(user_id,secret) VALUES(?,?)", (user_id, secrets.token_bytes(32)))
            seed = db.execute("SELECT secret FROM mp_npc_secret WHERE user_id=?", (user_id,)).fetchone()
    password = hmac.new(seed["secret"], kind.encode(), hashlib.sha256).hexdigest()
    return f"mp{user_id}_{seed['secret'].hex()[:4]}", password


def npc_request(kind: str, operation: str, payload: dict):
    conn = http.client.HTTPConnection("127.0.0.1", NPC_PORTS[kind], timeout=8)
    try:
        path = "/api/auth/" + operation if kind == "agent" else "/api/" + operation
        conn.request("POST", path, json.dumps(payload).encode(), {"Content-Type": "application/json"})
        response = conn.getresponse()
        body = response.read(1 << 20)
        try:
            data = json.loads(body)
        except (ValueError, UnicodeDecodeError):
            data = {}
        return response.status, data, response.getheader("Set-Cookie")
    finally:
        conn.close()


def npc_ticket(user, kind: str):
    name, password = npc_credentials(user["id"], kind)
    field = {"xbg": "nick", "ld": "nickname", "cmr": "username", "agent": "username"}[kind]
    # [QODER-FIX #19] NPC 对话里显示的是各角色服务自己的账号名。以前只用内部名
    # “mp<id>_<hex>”，界面上就成了乱码账号。现在优先用大厅注册昵称去登录/注册
    # （昵称不合法或已被占用时自动回退内部名，保证老账号仍能进）。
    # agent 的登录名保持内部名，它注册时本来就带 nickname=大厅昵称。
    real = (user["nickname"] or "").strip()
    display = None
    if kind in ("xbg", "ld", "cmr") and real:
        if kind == "ld" and 1 <= len(real) <= 16:
            display = real
        elif kind == "xbg" and len(real) >= 2:
            display = real
        elif kind == "cmr" and re.fullmatch(r"[\w\u4e00-\u9fff]{2,24}", real):
            display = real
    names = [display, name] if display and display != name else [name]
    status = data = cookie = None
    used = name
    for candidate in names:
        login_body = {field: candidate, "password": password}
        status, data, cookie = npc_request(kind, "login", login_body)
        good = (status == 200 and (bool(data.get("token")) if kind in ("xbg", "ld") else
                 bool((data.get("data") or {}).get("token")) if kind == "agent" else bool(cookie)))
        if good:
            used = candidate
            break
        register_body = dict(login_body)
        if kind == "agent":
            register_body.update(nickname=user["nickname"], email=f"{name}@local.invalid")
        status, data, cookie = npc_request(kind, "register", register_body)
        if status in (200, 201) and (kind == "agent" or data.get("token") or cookie):
            used = candidate
            break
        # 这个候选名不可用（多半是被别人占用）⇒ 继续试内部名
    if kind == "agent" and status in (200, 201) and not (data.get("token") or cookie):
        status, data, cookie = npc_request(kind, "login", {field: used, "password": password})
    if kind in ("xbg", "ld") and not data.get("token"):
        raise ValueError("角色服务未签发会话")
    if kind == "cmr" and not cookie:
        raise ValueError("阿姨服务未签发会话")
    if kind == "agent" and not (status == 200 and data.get("code") == 200 and (data.get("data") or {}).get("token")):
        raise ValueError("算法哥服务未签发会话")
    return ({"kind": kind, "token": data.get("token"), "user": data.get("user") or data.get("data")}, cookie)


class Handler(BaseHTTPRequestHandler):
    def log_message(self, fmt, *args):
        print("[http] " + fmt % args)

    def send_json(self, code, data, cookie=None):
        body = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        if cookie:
            self.send_header("Set-Cookie", cookie)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def body(self, limit=4096):
        size = int(self.headers.get("Content-Length", "0"))
        if size < 1 or size > limit:
            raise ValueError("请求数据过大或为空")
        return json.loads(self.rfile.read(size))

    def auth(self):
        bearer = self.headers.get("Authorization", "")
        user = token_user(bearer[7:] if bearer.startswith("Bearer ") else "")
        if not user:
            raise PermissionError("请重新登录")
        return user

    def browser_session(self):
        cookies = SimpleCookie()
        try:
            cookies.load(self.headers.get("Cookie", ""))
        except Exception:
            return None, None
        item = cookies.get("mp_session")
        if not item:
            return None, None
        return token_user(item.value), hashlib.sha256(item.value.encode()).hexdigest()

    def proxy(self, path):
        browser_user, digest = self.browser_session()
        if not browser_user:
            return self.send_json(401, {"error": "请先在校园大厅登录"})
        normalized = path
        for _ in range(4):
            decoded = unquote(normalized)
            if decoded == normalized:
                break
            normalized = decoded
        # Reject ambiguous paths before forwarding: upstream servers can decode or
        # collapse them differently and accidentally expose an NPC login endpoint.
        if ("//" in normalized or "\\" in normalized or "\x00" in normalized or
                any(part in (".", "..") or ";" in part for part in normalized.split("/"))):
            return self.send_json(403, {"error": "角色接口路径无效"})
        normalized = normalized.lower().rstrip("/")
        if normalized.startswith("/api/auth/") or normalized in {
                f"/{kind}/api/{action}" for kind in ("xbg", "ld", "cmr")
                for action in ("login", "register")}:
            return self.send_json(403, {"error": "请使用校园大厅统一登录"})
        port = next((port for prefix, port in PROXY_PREFIXES if path == prefix or path.startswith(prefix)), None)
        if port is None:
            return self.send_json(404, {"error": "页面不存在"})
        kind = {8010: "xbg", 8000: "ld", CMR_PORT: "cmr"}.get(port, "agent")
        with lock:
            permitted = kind in grants.get(digest, set())
        if not permitted and path not in NPC_HEALTH_PATHS:
            return self.send_json(403, {"error": "请从校园地图进入该角色"})
        try:
            size = int(self.headers.get("Content-Length", "0"))
            if size < 0 or size > 20 * 1024 * 1024:
                return self.send_json(413, {"error": "请求体过大"})
            body = self.rfile.read(size) if size else None
            headers = {k: v for k, v in self.headers.items()
                       if k.lower() not in ("connection", "content-length", "transfer-encoding", "host")}
            headers["Host"] = self.headers.get("Host", "localhost:3000") if port == CMR_PORT else f"127.0.0.1:{port}"
            conn = http.client.HTTPConnection("127.0.0.1", port, timeout=30)
            try:
                conn.request(self.command, self.path, body=body, headers=headers)
                upstream = conn.getresponse()
                self.send_response(upstream.status)
                for key, value in upstream.getheaders():
                    if key.lower() not in ("connection", "transfer-encoding", "keep-alive"):
                        self.send_header(key, value)
                self.end_headers()
                while chunk := upstream.read(65536):
                    self.wfile.write(chunk)
            finally:
                conn.close()
        except (OSError, TimeoutError, http.client.HTTPException):
            try:
                self.send_json(502, {"error": "角色服务未启动或暂不可用"})
            except OSError:
                pass

    def do_POST(self):
        path = urlsplit(self.path).path
        try:
            if path == "/api/mp/look/from-photo":
                # 注册前就要生成形象 ⇒ 这个口不带 token，只能按 IP 限流（一次调用是要花钱的）
                if look_rate_limited(self.client_address[0]):
                    return self.send_json(429, {"error": "生成太频繁，请一分钟后再试", "code": "rate_limited"})
                image = self.body(4 << 20).get("image")
                try:
                    look = look_from_photo(image)
                except LookupError as exc:
                    return self.send_json(503, {"error": str(exc), "code": "no_key"})
                except (urllib.error.HTTPError, urllib.error.URLError, TimeoutError, OSError) as exc:
                    return self.send_json(504, {"error": "识别服务连不上：" + str(exc)[:160], "code": "upstream"})
                except (KeyError, ValueError, TypeError, json.JSONDecodeError) as exc:
                    return self.send_json(502, {"error": "识别结果读不出来：" + str(exc)[:160], "code": "bad_result"})
                return self.send_json(200, {"ok": True, "model": QWEN_MODEL, "look": look})
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
                    db.execute("INSERT INTO mp_npc_secret(user_id,secret) VALUES(?,?)", (cur.lastrowid, secrets.token_bytes(32)))
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
                self.send_json(200, {"token": token, "user": player_of(u["id"])},
                               f"mp_session={token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=86400")
            elif path == "/api/mp/logout":
                u = self.auth()
                digest = hashlib.sha256(self.headers.get("Authorization", "")[7:].encode()).hexdigest()
                execute("DELETE FROM mp_token WHERE user_id=?", (u["id"],))
                with lock:
                    grants.pop(digest, None)
                old = active.get(u["id"])
                if old and event_loop:
                    event_loop.call_soon_threadsafe(lambda: asyncio.create_task(old["ws"].close(4001, "已退出登录")))
                self.send_json(200, {"ok": True}, "mp_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0")
            elif path == "/api/mp/session":
                self.auth()
                bearer = self.headers.get("Authorization", "")
                self.send_json(200, {"ok": True},
                               f"mp_session={bearer[7:]}; HttpOnly; SameSite=Strict; Path=/; Max-Age=86400")
            elif path.startswith("/api/mp/npc/"):
                u = self.auth()
                kind = path.rsplit("/", 1)[1]
                if kind not in NPC_PORTS:
                    return self.send_json(404, {"error": "角色不存在"})
                try:
                    ticket, cookie = npc_ticket(u, kind)
                except (OSError, TimeoutError, http.client.HTTPException):
                    return self.send_json(503, {"error": "角色服务尚未启动"})
                digest = hashlib.sha256(self.headers.get("Authorization", "")[7:].encode()).hexdigest()
                with lock:
                    grants.setdefault(digest, set()).add(kind)
                self.send_json(200, ticket, cookie)
            elif any(path == prefix or path.startswith(prefix) for prefix, _ in PROXY_PREFIXES):
                self.proxy(path)
            else:
                self.send_json(404, {"error": "接口不存在"})
        except PermissionError as exc:
            self.send_json(401, {"error": str(exc)})
        except (ValueError, KeyError, TypeError, json.JSONDecodeError) as exc:
            self.send_json(400, {"error": str(exc)})

    def do_PUT(self):
        try:
            path = urlsplit(self.path).path
            if path != "/api/mp/profile/me":
                return self.proxy(path)
            u, data = self.auth(), self.body()
            if "nickname" in data:
                raise ValueError("昵称不可修改")
            look = valid_look(data.get("look", DEFAULT_LOOK))
            bio = str(data.get("bio", "")).strip()
            college = str(data.get("college", "")).strip()
            grade = str(data.get("grade", "")).strip()
            tags = data.get("tags", [])
            visibility = data.get("visibility", player_of(u["id"])["visibility"])
            if len(bio) > 40 or len(college) > 32 or len(grade) > 8 or not isinstance(tags, list) or len(tags) > 5 or any(not isinstance(t, str) or len(t) > 6 for t in tags):
                raise ValueError("资料长度超出限制")
            if college and college not in CAMPUS_COLLEGES:
                raise ValueError("学院请在下拉里选本校的院系")
            if not isinstance(visibility, dict) or set(visibility) != set(DEFAULT_VISIBILITY) or any(type(v) is not bool for v in visibility.values()):
                raise ValueError("资料展示设置无效")
            execute("UPDATE mp_player SET look_json=?,bio=?,college=?,grade=?,tags=?,visibility_json=? WHERE user_id=?", (json.dumps(look), bio, college, grade, json.dumps(tags, ensure_ascii=False), json.dumps(visibility), u["id"]))
            self.send_json(200, public_profile(u["id"], u["id"]))
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
                if path == "/api/mp/colleges":
                    return self.send_json(200, {"colleges": list(CAMPUS_COLLEGES)})
                u = self.auth()
                if path == "/api/mp/profile/me":
                    return self.send_json(200, public_profile(u["id"], u["id"]))
                if path == "/api/mp/history/me":
                    sent_board = rows("SELECT id,content,created_at FROM mp_announcement WHERE user_id=? ORDER BY id DESC", (u["id"],))
                    sent_private = rows("SELECT m.id,m.to_user,m.content,m.created_at,v.nickname FROM mp_message m JOIN mp_user v ON v.id=m.to_user WHERE m.from_user=? ORDER BY m.id DESC", (u["id"],))
                    # 聊天记录按“对话对象”分组时要收和发两边都算，昵称取对方的那一个
                    peer_rows = rows("SELECT m.id,m.from_user,m.to_user,m.content,m.created_at,n.nickname FROM mp_message m "
                                     "JOIN mp_user n ON n.id=(CASE WHEN m.from_user=? THEN m.to_user ELSE m.from_user END) "
                                     "WHERE m.from_user=? OR m.to_user=? ORDER BY m.id DESC", (u["id"], u["id"], u["id"]))
                    conversations, grouped = [], {}
                    for m in peer_rows:
                        other = m["to_user"] if m["from_user"] == u["id"] else m["from_user"]
                        group = grouped.get(other)
                        if group is None:
                            group = grouped[other] = {"peer": other, "nickname": m["nickname"], "items": []}
                            conversations.append(group)
                        group["items"].append({"id": m["id"], "mine": m["from_user"] == u["id"], "content": m["content"], "at": now_iso(m["created_at"])})
                    return self.send_json(200, {"announcements": [{"id": a["id"], "content": a["content"], "at": now_iso(a["created_at"])} for a in sent_board], "private": [{"id": m["id"], "to": m["to_user"], "nickname": m["nickname"], "content": m["content"], "at": now_iso(m["created_at"])} for m in sent_private], "conversations": conversations})
                if path.startswith("/api/mp/profile/"):
                    target = int(path.rsplit("/", 1)[1])
                    profile = public_profile(target, u["id"])
                    return self.send_json(200 if profile else 404, profile or {"error": "玩家不存在"})
                return self.send_json(404, {"error": "接口不存在"})
            except PermissionError as exc:
                return self.send_json(401, {"error": str(exc)})
            except ValueError:
                return self.send_json(400, {"error": "玩家编号无效"})
        if any(path == prefix or path.startswith(prefix) for prefix, _ in PROXY_PREFIXES):
            return self.proxy(path)
        requested = unquote(path.lstrip("/")) or "像素校园_全校地图.html"
        if requested not in {"像素校园_全校地图.html", "mp/look.js", "mp/lobby.js", "mp/theme.css"}:
            self.send_error(404)
            return
        target = (ROOT / requested).resolve()
        if not target.is_relative_to(ROOT) or not target.is_file():
            self.send_error(404)
            return
        body = target.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", (mimetypes.guess_type(target.name)[0] or "application/octet-stream") + ("; charset=utf-8" if target.suffix in (".html", ".js", ".css") else ""))
        # 这四个文件是改完直接生效的源码，绝不能让浏览器拿缓存：
        # 以前没发这个头，改完 look.js/lobby.js 后刷新仍是旧画面，看起来像"根本没改"。
        self.send_header("Cache-Control", "no-store, must-revalidate")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_DELETE(self):
        self.proxy(urlsplit(self.path).path)


async def send(ws, payload):
    await ws.send(json.dumps(payload, ensure_ascii=False, separators=(",", ":")))


def authorized(s):
    return active.get(s["id"]) is s and bool(token_user(s["token"]))


async def broadcast(payload, recipients):
    await asyncio.gather(*(send(s["ws"], payload) for s in recipients if s["ws"].state.name == "OPEN" and authorized(s)), return_exceptions=True)


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
        peers = [peer_data(p) for p in active.values() if p is not s and p["hello"] and p["scene"] == scene and authorized(p)]
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
        await send(s["ws"], {"type": "scene.peers", "scene": target, "peers": [peer_data(p) for p in active.values() if p is not s and p["hello"] and p["scene"] == target and authorized(p)]})
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
        if key:
            duplicate = row("SELECT id FROM mp_announcement WHERE user_id=? AND client_msg_id=?", (uid, key))
            if duplicate:
                return await send(s["ws"], {"type": "announce.ack", "clientMsgId": key, "id": duplicate["id"]})
        latest = row("SELECT created_at FROM mp_announcement WHERE user_id=? ORDER BY id DESC LIMIT 1", (uid,))
        count = row("SELECT COUNT(*) AS n FROM mp_announcement WHERE user_id=? AND created_at>?", (uid, time.time()-86400))["n"]
        if latest and time.time()-latest["created_at"] < 30 or count >= 20:
            return await send(s["ws"], {"type": "error", "code": "ANNOUNCE_RATE", "msg": "公告每 30 秒一条，每天最多 20 条", "clientMsgId": key})
        stamp = time.time()
        cur = execute("INSERT INTO mp_announcement(user_id,content,created_at,client_msg_id) VALUES(?,?,?,?)", (uid, content, stamp, key or None))
        await broadcast({"type": "announce.new", "id": cur.lastrowid, "userId": uid, "nickname": s["nickname"], "look": s["look"], "content": content, "at": now_iso(stamp), "online": True}, list(active.values()))
        if s["ws"].state.name == "OPEN":
            await send(s["ws"], {"type": "announce.ack", "clientMsgId": key, "id": cur.lastrowid})
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
        if other in active and authorized(active[other]):
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
    s = {"id": uid, "token": token, "nickname": user["nickname"], "look": p["look"], "ws": ws, "hello": False, "scene": "out", "x": 0, "y": 0, "dir": "down", "last_move": 0, "last_ping": time.monotonic()}
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
            if not authorized(s):
                await s["ws"].close(4003, "登录已失效")
            elif time.monotonic()-s["last_ping"] > 45:
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
