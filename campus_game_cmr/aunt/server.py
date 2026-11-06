"""Independent FastAPI service for the canteen aunt.

Run from the repository root with: python -m uvicorn aunt.server:app --reload
"""

from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional
import hashlib
import hmac
import json
import os
import re
import secrets
import sqlite3
import time

from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

from . import knowledge, tone


BASE = Path(__file__).absolute().parent
DB_PATH = Path(os.environ.get("AUNT_DB_PATH", str(BASE / "data" / "aunt.sqlite3")))


@contextmanager
def db():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(str(DB_PATH), timeout=10)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys=ON")
    try:
        yield connection
        connection.commit()
    except Exception:
        connection.rollback()
        raise
    finally:
        connection.close()


def _ensure_column(connection, table, name, definition):
    columns = {row["name"] for row in connection.execute("PRAGMA table_info(%s)" % table).fetchall()}
    if name not in columns:
        connection.execute("ALTER TABLE %s ADD COLUMN %s %s" % (table, name, definition))


def init_db():
    with db() as connection:
        connection.executescript(
            """
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY,
                username TEXT NOT NULL UNIQUE COLLATE NOCASE,
                password_hash TEXT NOT NULL,
                created_at REAL NOT NULL
            );
            CREATE TABLE IF NOT EXISTS sessions (
                token_hash TEXT PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                expires_at REAL NOT NULL
            );
            CREATE TABLE IF NOT EXISTS conversations (
                id INTEGER PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                title TEXT NOT NULL,
                created_at REAL NOT NULL,
                updated_at REAL NOT NULL
            );
            CREATE INDEX IF NOT EXISTS idx_conversations_user ON conversations(user_id, updated_at DESC);
            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                conversation_id INTEGER REFERENCES conversations(id) ON DELETE CASCADE,
                role TEXT NOT NULL CHECK(role IN ('user','assistant')),
                content TEXT NOT NULL,
                evidence_json TEXT NOT NULL DEFAULT '[]',
                ranking_json TEXT NOT NULL DEFAULT '[]',
                recommendations_json TEXT NOT NULL DEFAULT '[]',
                created_at REAL NOT NULL
            );
            CREATE TABLE IF NOT EXISTS user_memory (
                user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
                data_json TEXT NOT NULL DEFAULT '{}',
                updated_at REAL NOT NULL
            );
            CREATE TABLE IF NOT EXISTS reviews (
                id INTEGER PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
                stall_id TEXT NOT NULL,
                rating INTEGER CHECK(rating BETWEEN 1 AND 5),
                queue_minutes INTEGER CHECK(queue_minutes BETWEEN 0 AND 240),
                content TEXT NOT NULL,
                source TEXT NOT NULL DEFAULT 'user',
                source_ref TEXT,
                tags_json TEXT NOT NULL DEFAULT '[]',
                created_at REAL NOT NULL
            );
            CREATE INDEX IF NOT EXISTS idx_reviews_stall ON reviews(stall_id, created_at);
            """
        )
        # Preserve data created by the first independent demo.
        _ensure_column(connection, "messages", "conversation_id", "INTEGER REFERENCES conversations(id)")
        _ensure_column(connection, "messages", "evidence_json", "TEXT NOT NULL DEFAULT '[]'")
        _ensure_column(connection, "messages", "ranking_json", "TEXT NOT NULL DEFAULT '[]'")
        _ensure_column(connection, "messages", "recommendations_json", "TEXT NOT NULL DEFAULT '[]'")
        _ensure_column(connection, "reviews", "source_ref", "TEXT")
        _ensure_column(connection, "reviews", "tags_json", "TEXT NOT NULL DEFAULT '[]'")
        connection.execute("CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id, id)")
        old_user_ids = [row["user_id"] for row in connection.execute(
            "SELECT DISTINCT user_id FROM messages WHERE conversation_id IS NULL"
        ).fetchall()]
        for user_id in old_user_ids:
            now = time.time()
            cursor = connection.execute(
                "INSERT INTO conversations(user_id,title,created_at,updated_at) VALUES(?,?,?,?)",
                (user_id, "早期对话", now, now),
            )
            connection.execute("UPDATE messages SET conversation_id=? WHERE user_id=? AND conversation_id IS NULL",
                               (cursor.lastrowid, user_id))


class PrefixStrip:
    """把 `/cmr/...` 剥成 `/...` 的纯 ASGI 中间件（2026-10-11 · 接入像素校园大地图）。

    地图跑在 `http://localhost:3000`，本服务在 `127.0.0.1:8020` —— 不是同源。
    Vite 把 `/cmr` **原样转发**到这里，由本中间件摘掉前缀，于是浏览器眼里两边同源
    ⇒ 地图抽屉里按 Esc 能退出来（父页拿得到 iframe 的 document），
      而且本服务签发的 HttpOnly 会话 cookie 天然共享 —— 这就是「进食堂不用重复登录」的全部秘密。
    （做法与 `laoding/server/app.py`、`xueba-ge/backend/app.py` 逐字同款。）

    ⚠️ 只在**真的以 /cmr 开头**时才剥 ⇒ 裸 `/api/...` 与 `/cmr/api/...` 两条路同时活着，
       本服务仍能独立跑在 8020（DEPLOY.md 那条老路一个字不改）。
    ⚠️ 用纯 ASGI 而不是 `@app.middleware("http")`（BaseHTTPMiddleware 会把响应包进
       anyio 内存流，对静态文件有攒批的老毛病）。
    ⚠️ **不设 `scope["root_path"]`**：设了 Starlette 会给 `/static` 挂载点拼出 `/cmr/static`，
       `get_path()` 找不到文件 ⇒ HTML 正常、CSS/图片全 404，而且**静默不报错**。
    """

    def __init__(self, app, prefix: str = "/cmr"):
        self.app = app
        self.prefix = prefix.rstrip("/")

    async def __call__(self, scope, receive, send):
        if scope["type"] in ("http", "websocket"):
            p = scope.get("path", "")
            if p == self.prefix or p.startswith(self.prefix + "/"):
                scope["path"] = p[len(self.prefix):] or "/"     # `/cmr` 要落成 `/`，不是空串
                rp = scope.get("raw_path")
                if isinstance(rp, bytes) and rp.startswith(self.prefix.encode()):
                    scope["raw_path"] = rp[len(self.prefix):] or b"/"
        await self.app(scope, receive, send)


app = FastAPI(title="食堂阿姨", docs_url="/api/docs", redoc_url=None)
# ⚠️ 必须放在 app 建好之后、路由之前；先剥前缀再进路由。
app.add_middleware(PrefixStrip, prefix="/cmr")
app.mount("/static", StaticFiles(directory=str(BASE / "static")), name="static")


@app.on_event("startup")
def startup():
    init_db()


class Credentials(BaseModel):
    username: str = Field(min_length=2, max_length=24)
    password: str = Field(min_length=8, max_length=128)


class ChatInput(BaseModel):
    message: str = Field(min_length=1, max_length=1000)
    conversation_id: Optional[int] = None
    context_stall_id: Optional[str] = None


FOLLOWUP_WORDS = (
    "多少钱", "价格", "价钱", "几元", "怎么卖", "几点", "营业", "开门", "关门",
    "在哪", "位置", "排队", "等多久", "好吃吗", "怎么样", "有吗", "卖什么",
    "有什么菜", "有哪些菜", "有什么吃", "有啥吃",
)


def is_followup_without_topic(message: str) -> bool:
    """这句话是不是"接着上一句问"：只说了多少钱/在哪，没点名哪家食堂、哪个档口。

    分成函数是因为现在有两个地方要用它：同一段对话里往前找（contextual_question），
    以及换了一段对话、靠长期记忆往前找（chat 里的跨会话补全）。
    """
    return (any(word in message for word in FOLLOWUP_WORDS)
            and not knowledge.find_canteen(message)
            and not knowledge.find_zone(message)
            and not knowledge.matched_dishes(message))


def contextual_question(message: str, previous_messages) -> str:
    """Carry named food and venue into short follow-up questions only."""
    if not is_followup_without_topic(message):
        return message
    for earlier in previous_messages:
        canteen = knowledge.find_canteen(earlier)
        dishes = knowledge.matched_dishes(earlier, canteen)
        zone_id = knowledge.find_zone(earlier, canteen)
        if not (canteen or dishes or zone_id):
            continue
        parts = [canteen["name"]] if canteen else []
        floor = knowledge._requested_floor(earlier, canteen)
        if floor and not knowledge._requested_floor(message, canteen):
            parts.append(floor)
        if zone_id and not dishes:
            parts.append(knowledge.ZONES[zone_id]["name"])
        if dishes:
            parts.append(max((entry["dish"]["name"] for entry in dishes), key=len))
        return " ".join(parts + [message])
    return message


# ---------------------------------------------------------------------------
# 长期记忆（2026-11-06）：跨会话的"小纸条"
#
#   conversations / messages 记的是"这一段里聊了什么"；user_memory 记的是
#   "这个人常看哪家食堂、常问哪道菜、上一次问的是什么"。两者分工：
#     · 同一段对话里，"多少钱"指哪道菜，靠 messages 往前找 5 句；
#     · 换了一段对话（点"新对话"、隔天再登），靠这份小纸条接着答；
#     · 问"你还记得我吗"，直接从这份小纸条里报账。
#
#   只从**这个人自己的提问**里统计：不调模型、不推理、不猜口味，写进去的都是
#   他自己打出来的食堂名和菜名。别人看不到，删账号一起删。
# ---------------------------------------------------------------------------
MEMORY_SCAN = 200          # 老账号第一次用到时，最多回扫这么多条自己的历史提问
RECALL_HINTS = ("还记得我", "记得我吗", "记得我吧", "还认得我", "我是谁", "我叫什么", "认识我吗")


def _memory_topics(text):
    """从一句话里认出他提到了哪家食堂、哪个档口、哪道菜。"""
    canteen = knowledge.find_canteen(text)
    zone_id = knowledge.find_zone(text, canteen)
    dishes = knowledge.matched_dishes(text, canteen)
    return canteen, zone_id, dishes


def _topic_phrase(canteen, zone_id, dishes, text="") -> str:
    """拼成一句人话，例如「明湖 1F 川湘风味 麻辣香锅」。"""
    parts = []
    if zone_id:
        parts.append(knowledge._zone_name(zone_id))
    elif canteen:
        parts.append(canteen["name"])
        floor = knowledge._requested_floor(text, canteen) if text else None
        if floor:
            parts.append(floor)
    if dishes:
        parts.append(max((entry["dish"]["name"] for entry in dishes), key=len))
    return " ".join(parts)


def _absorb(memory: dict, text: str) -> dict:
    """把一句话记进小纸条。纯计数，不做任何推断。"""
    canteen, zone_id, dishes = _memory_topics(text)
    now = time.time()
    memory["n"] = int(memory.get("n") or 0) + 1
    memory["first_at"] = memory.get("first_at") or now
    memory["last_at"] = now
    if canteen:
        bucket = memory.setdefault("canteens", {})
        bucket[canteen["id"]] = int(bucket.get(canteen["id"]) or 0) + 1
    if zone_id:
        bucket = memory.setdefault("zones", {})
        bucket[zone_id] = int(bucket.get(zone_id) or 0) + 1
    for entry in dishes:
        name = entry["dish"]["name"]
        bucket = memory.setdefault("dishes", {})
        bucket[name] = int(bucket.get(name) or 0) + 1
    phrase = _topic_phrase(canteen, zone_id, dishes, text)
    if phrase:
        memory["last_topic"] = phrase
        memory["last_topic_at"] = now
    return memory


def _trim(memory: dict) -> dict:
    """纸条有上限：只留问得最多的几个，别让它越记越长。"""
    for key, cap in (("canteens", 8), ("zones", 12), ("dishes", 20)):
        bucket = memory.get(key) or {}
        if len(bucket) > cap:
            memory[key] = dict(sorted(bucket.items(), key=lambda item: (-item[1], item[0]))[:cap])
    return memory


def save_memory(connection, user_id: int, memory: dict):
    connection.execute(
        "INSERT INTO user_memory(user_id,data_json,updated_at) VALUES(?,?,?) "
        "ON CONFLICT(user_id) DO UPDATE SET data_json=excluded.data_json,updated_at=excluded.updated_at",
        (user_id, json.dumps(memory, ensure_ascii=False), time.time()),
    )


def load_memory(connection, user_id: int) -> dict:
    """读出这个人的小纸条；老账号第一次用就从自己的历史提问里补一份。

    为什么要回扫：上线当天库里已经有一批历史提问，不回扫的话每个老用户都要
    "从今天起重新认识"，他们会觉得记忆丢了。
    """
    row = connection.execute("SELECT data_json FROM user_memory WHERE user_id=?", (user_id,)).fetchone()
    if row is not None:
        try:
            return json.loads(row["data_json"] or "{}")
        except ValueError:
            return {}
    rows = connection.execute(
        "SELECT content FROM messages WHERE user_id=? AND role='user' ORDER BY id DESC LIMIT ?",
        (user_id, MEMORY_SCAN),
    ).fetchall()
    memory = {}
    for item in reversed(rows):
        memory = _absorb(memory, item["content"])
    if memory:
        _trim(memory)
        save_memory(connection, user_id, memory)
    return memory


MESSAGE_KEEP = 600     # 每个账号只留最近 600 条消息（约 300 轮问答）


def prune_messages(connection, user_id):
    """聊得再多，库里也只留最近 MESSAGE_KEEP 条。

    会话列表、"上次聊的"、记忆画像要的东西都在最近这一段里；更早的旧账
    除了把库撑大没有别的用处，所以从旧往新删。每次写完顺手删一次，
    不需要定时任务，也不会某天突然丢掉一大批。"""
    connection.execute(
        "DELETE FROM messages WHERE user_id=? AND id NOT IN "
        "(SELECT id FROM messages WHERE user_id=? ORDER BY id DESC LIMIT ?)",
        (user_id, user_id, MESSAGE_KEEP),
    )


def remember_message(connection, user_id: int, message: str, memory: dict) -> dict:
    """把刚问的这句话记进去（memory 是**问这句话之前**读出来的那份）。"""
    memory = _trim(_absorb(memory, message))
    save_memory(connection, user_id, memory)
    return memory


def is_recall_question(text: str) -> bool:
    return any(hint in text for hint in RECALL_HINTS)


def recall_answer(memory: dict) -> str:
    """回答「你还记得我吗」。报的全是数出来的账，不猜。"""
    count = int(memory.get("n") or 0)
    if count <= 0:
        return "还没在这边聊过呢，孩子。想吃什么、问哪家食堂，说一句我就记下了。"
    parts = ["记得呀，你在这边问过 %d 次。" % count]
    canteens = memory.get("canteens") or {}
    if canteens:
        top_id, top_count = max(canteens.items(), key=lambda item: item[1])
        name = (knowledge.CANTEENS.get(top_id) or {}).get("name")
        if name:
            parts.append("看得最多的是%s，%d 次。" % (name, top_count))
    topic = memory.get("last_topic")
    if topic:
        parts.append("最近问的是%s。" % topic)
    dishes = memory.get("dishes") or {}
    if dishes:
        top_dish, top_count = max(dishes.items(), key=lambda item: item[1])
        parts.append("常问的菜是%s，%d 次。" % (top_dish, top_count))
    parts.append("今天想吃点啥？")
    return "".join(parts)


def memory_text(memory: dict) -> str:
    """给接口看的一行摘要。"""
    count = int(memory.get("n") or 0)
    if count <= 0:
        return ""
    parts = ["在食堂这边问过 %d 次" % count]
    canteens = memory.get("canteens") or {}
    if canteens:
        names = []
        for key, cnt in sorted(canteens.items(), key=lambda item: -item[1])[:3]:
            names.append("%s（%d 次）" % ((knowledge.CANTEENS.get(key) or {}).get("name") or key, cnt))
        parts.append("常看：" + "、".join(names))
    dishes = memory.get("dishes") or {}
    if dishes:
        top = sorted(dishes.items(), key=lambda item: -item[1])[:3]
        parts.append("常问的菜：" + "、".join("%s（%d 次）" % item for item in top))
    if memory.get("last_topic"):
        parts.append("上次问的是：" + str(memory["last_topic"]))
    return "；".join(parts) + "。"


def password_hash(password: str, salt: Optional[bytes] = None) -> str:
    salt = salt or secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 260000)
    return salt.hex() + ":" + digest.hex()


def password_matches(password: str, saved: str) -> bool:
    try:
        salt_hex, _ = saved.split(":", 1)
        return hmac.compare_digest(password_hash(password, bytes.fromhex(salt_hex)), saved)
    except (ValueError, TypeError):
        return False


def check_origin(request: Request):
    origin = request.headers.get("origin")
    if origin and origin.rstrip("/") != str(request.base_url).rstrip("/"):
        raise HTTPException(403, "请求来源不匹配")


def current_user(request: Request) -> sqlite3.Row:
    token = request.cookies.get("aunt_session")
    if not token:
        raise HTTPException(401, "请先登录")
    token_hash = hashlib.sha256(token.encode("utf-8")).hexdigest()
    with db() as connection:
        row = connection.execute(
            "SELECT users.id,users.username FROM sessions JOIN users ON users.id=sessions.user_id "
            "WHERE token_hash=? AND expires_at>?", (token_hash, time.time())
        ).fetchone()
    if not row:
        raise HTTPException(401, "登录已过期，请重新登录")
    return row


def set_session(response: Response, user_id: int, secure: bool):
    token = secrets.token_urlsafe(32)
    with db() as connection:
        connection.execute("DELETE FROM sessions WHERE expires_at<?", (time.time(),))
        connection.execute(
            "INSERT INTO sessions(token_hash,user_id,expires_at) VALUES(?,?,?)",
            (hashlib.sha256(token.encode("utf-8")).hexdigest(), user_id, time.time() + 30 * 86400),
        )
    response.set_cookie("aunt_session", token, max_age=30 * 86400, httponly=True,
                        secure=secure, samesite="strict", path="/")


def iso(timestamp):
    return datetime.fromtimestamp(timestamp, timezone.utc).isoformat()


def create_conversation(connection, user_id, title="新对话"):
    now = time.time()
    cursor = connection.execute(
        "INSERT INTO conversations(user_id,title,created_at,updated_at) VALUES(?,?,?,?)",
        (user_id, title, now, now),
    )
    return cursor.lastrowid


def require_conversation(connection, user_id, conversation_id):
    if conversation_id is None:
        row = connection.execute(
            "SELECT id FROM conversations WHERE user_id=? ORDER BY updated_at DESC,id DESC LIMIT 1",
            (user_id,),
        ).fetchone()
        return row["id"] if row else create_conversation(connection, user_id)
    row = connection.execute(
        "SELECT id FROM conversations WHERE id=? AND user_id=?", (conversation_id, user_id)
    ).fetchone()
    if not row:
        raise HTTPException(404, "没有这段对话")
    return row["id"]


@app.get("/")
def index():
    return FileResponse(BASE / "static" / "index.html")


@app.get("/api/health")
def health():
    """给地图抽屉的 ctrProbe 当探针。

    地图那边要求探针返回 **2xx** 才算「服务活着」；而本服务其余接口都要登录（401），
    不能拿来探活。这里刻意不校验登录、不碰数据库 —— 只回答「进程在听」。
    """
    return {"ok": True}


@app.post("/api/register")
def register(payload: Credentials, request: Request, response: Response):
    check_origin(request)
    username = payload.username.strip()
    if not re.fullmatch(r"[\w\u4e00-\u9fff]{2,24}", username, flags=re.UNICODE):
        raise HTTPException(400, "用户名只能包含中文、字母、数字或下划线，长度 2–24 位")
    with db() as connection:
        try:
            cursor = connection.execute(
                "INSERT INTO users(username,password_hash,created_at) VALUES(?,?,?)",
                (username, password_hash(payload.password), time.time()),
            )
        except sqlite3.IntegrityError:
            raise HTTPException(409, "用户名已经存在")
        user_id = cursor.lastrowid
    set_session(response, user_id, request.url.scheme == "https")
    return {"id": user_id, "username": username}


@app.post("/api/login")
def login(payload: Credentials, request: Request, response: Response):
    check_origin(request)
    with db() as connection:
        user = connection.execute(
            "SELECT id,username,password_hash FROM users WHERE username=?", (payload.username.strip(),)
        ).fetchone()
    if not user or not password_matches(payload.password, user["password_hash"]):
        raise HTTPException(401, "用户名或密码不正确")
    set_session(response, user["id"], request.url.scheme == "https")
    return {"id": user["id"], "username": user["username"]}


@app.post("/api/logout")
def logout(request: Request, response: Response):
    check_origin(request)
    token = request.cookies.get("aunt_session")
    if token:
        with db() as connection:
            connection.execute("DELETE FROM sessions WHERE token_hash=?",
                               (hashlib.sha256(token.encode("utf-8")).hexdigest(),))
    response.delete_cookie("aunt_session", path="/")
    return {"ok": True}


@app.get("/api/me")
def me(request: Request):
    user = current_user(request)
    return {"id": user["id"], "username": user["username"]}


@app.get("/api/canteens")
def canteens(request: Request):
    current_user(request)
    return knowledge.CATALOG


@app.get("/api/conversations")
def conversations(request: Request):
    user = current_user(request)
    with db() as connection:
        rows = connection.execute(
            "SELECT c.id,c.title,c.created_at,c.updated_at,COUNT(m.id) AS message_count "
            "FROM conversations c LEFT JOIN messages m ON m.conversation_id=c.id "
            "WHERE c.user_id=? GROUP BY c.id ORDER BY c.updated_at DESC,c.id DESC",
            (user["id"],),
        ).fetchall()
    return [{"id": row["id"], "title": row["title"], "createdAt": iso(row["created_at"]),
             "updatedAt": iso(row["updated_at"]), "messageCount": row["message_count"]} for row in rows]


@app.post("/api/conversations")
def new_conversation(request: Request):
    check_origin(request)
    user = current_user(request)
    with db() as connection:
        conversation_id = create_conversation(connection, user["id"])
    return {"id": conversation_id, "title": "新对话"}


@app.get("/api/conversations/{conversation_id}/messages")
def conversation_messages(conversation_id: int, request: Request):
    user = current_user(request)
    with db() as connection:
        require_conversation(connection, user["id"], conversation_id)
        rows = connection.execute(
            "SELECT id,role,content,evidence_json,ranking_json,recommendations_json,created_at FROM messages "
            "WHERE conversation_id=? ORDER BY id ASC", (conversation_id,)
        ).fetchall()
    return [{"id": row["id"], "role": row["role"], "content": row["content"],
             "evidence": json.loads(row["evidence_json"] or "[]"),
             "ranking": json.loads(row["ranking_json"] or "[]"),
             "recommendations": json.loads(row["recommendations_json"] or "[]"),
             "createdAt": iso(row["created_at"])}
            for row in rows]


@app.get("/api/history")
def history(request: Request):
    user = current_user(request)
    with db() as connection:
        rows = connection.execute(
            "SELECT id,role,content,evidence_json,ranking_json,recommendations_json,created_at "
            "FROM messages WHERE user_id=? ORDER BY id ASC",
            (user["id"],),
        ).fetchall()
    return [{"id": row["id"], "role": row["role"], "content": row["content"],
             "evidence": json.loads(row["evidence_json"] or "[]"),
             "ranking": json.loads(row["ranking_json"] or "[]"),
             "recommendations": json.loads(row["recommendations_json"] or "[]"),
             "createdAt": iso(row["created_at"])}
            for row in rows]


@app.get("/api/memory")
def memory_view(request: Request):
    """阿姨记得这位同学的什么。只读自己的，返回一句人话。"""
    user = current_user(request)
    with db() as connection:
        memory = load_memory(connection, user["id"])
    return {"count": int(memory.get("n") or 0),
            "lastTopic": memory.get("last_topic"),
            "text": memory_text(memory),
            "updatedAt": iso(memory["last_at"]) if memory.get("last_at") else None}


@app.delete("/api/memory")
def memory_forget(request: Request):
    """让他忘掉这位同学（只删小纸条，历史对话还在，要删对话另有接口）。"""
    check_origin(request)
    user = current_user(request)
    with db() as connection:
        connection.execute("DELETE FROM user_memory WHERE user_id=?", (user["id"],))
    return {"ok": True}


def get_rating(stall_id: str) -> dict:
    if stall_id not in knowledge.ZONES:
        raise KeyError(stall_id)
    init_db()
    with db() as connection:
        return knowledge.rating_for(connection, stall_id)


def list_windows(canteen_id: Optional[str] = None) -> list:
    return [{"stall": zone, "location": knowledge.ZONE_CONTEXT[zone_id]}
            for zone_id, zone in knowledge.ZONES.items()
            if canteen_id is None or knowledge.ZONE_CONTEXT[zone_id]["canteenId"] == canteen_id]


def should_appear(at=None):
    """Behavior-layer hook: show the NPC during ordinary meal windows."""
    hour = (at or datetime.now()).hour
    return 7 <= hour < 9 or 11 <= hour < 14 or 17 <= hour < 20


@app.get("/api/ratings")
def ratings(request: Request):
    current_user(request)
    with db() as connection:
        return {zone_id: knowledge.rating_for(connection, zone_id) for zone_id in knowledge.ZONES}


@app.get("/api/map-layer")
def map_layer(request: Request):
    current_user(request)
    with db() as connection:
        result = []
        for canteen in knowledge.CATALOG["canteens"]:
            rated = []
            for zone_id, context in knowledge.ZONE_CONTEXT.items():
                if context["canteenId"] == canteen["id"] and knowledge.rating_for(connection, zone_id)["score"] is not None:
                    rated.append(zone_id)
            result.append({"canteenId": canteen["id"], "ratedZoneIds": rated,
                           "hasReviews": bool(rated), "planVerified": canteen["floorplanStatus"] == "verified"})
    return result


@app.get("/api/stalls/{stall_id}")
def stall_details(stall_id: str, request: Request):
    current_user(request)
    if stall_id not in knowledge.ZONES:
        raise HTTPException(404, "没有这个分区")
    with db() as connection:
        score = knowledge.rating_for(connection, stall_id)
        queue = knowledge.recent_queue(connection, stall_id)
        rows = connection.execute(
            "SELECT rating,queue_minutes,content,source,source_ref,tags_json,created_at FROM reviews "
            "WHERE stall_id=? ORDER BY created_at DESC,id DESC LIMIT 20", (stall_id,)
        ).fetchall()
    context = knowledge.ZONE_CONTEXT[stall_id]
    canteen = knowledge.CANTEENS[context["canteenId"]]
    floor = next(item for item in canteen["floors"] if item["label"] == context["floorLabel"])
    return {"stall": knowledge.ZONES[stall_id], "location": context,
            "rating": score,
            "reviewSummary": floor.get("reviewSummary") or canteen.get("publicReviewSummary"),
            "sourceReviews": knowledge.ZONES[stall_id].get("publicReviews", []),
            "queue": {"minutes": queue["queue_minutes"], "reportedAt": iso(queue["created_at"])} if queue else None,
            "reviews": [
                {"rating": row["rating"], "queueMinutes": row["queue_minutes"],
                 "content": row["content"], "source": row["source"], "sourceRef": row["source_ref"],
                 "tags": json.loads(row["tags_json"] or "[]"), "createdAt": iso(row["created_at"])}
                for row in rows
            ]}


@app.post("/api/chat")
def chat(payload: ChatInput, request: Request):
    check_origin(request)
    user = current_user(request)
    message = payload.message.strip()
    if not message:
        raise HTTPException(400, "请输入聊天内容")
    if payload.context_stall_id and payload.context_stall_id not in knowledge.ZONES:
        raise HTTPException(404, "没有这个档口")
    with db() as connection:
        conversation_id = require_conversation(connection, user["id"], payload.conversation_id)
        memory = load_memory(connection, user["id"])          # 问这句话之前的样子
        previous_messages = [row["content"] for row in connection.execute(
            "SELECT content FROM messages WHERE conversation_id=? AND role='user' ORDER BY id DESC LIMIT 5",
            (conversation_id,),
        ).fetchall()]
        answer_question = contextual_question(message, previous_messages)
        # 换了一段对话、又只问"多少钱/在哪"：用上次问过的东西把问题补全。
        used_memory = False
        if (not previous_messages and memory.get("last_topic")
                and is_followup_without_topic(message)):
            answer_question = str(memory["last_topic"]) + " " + message
            used_memory = True
        previous_count = connection.execute(
            "SELECT COUNT(*) AS n FROM messages WHERE conversation_id=? AND role='user'", (conversation_id,)
        ).fetchone()["n"]
        connection.execute(
            "INSERT INTO messages(user_id,conversation_id,role,content,created_at) VALUES(?,?,'user',?,?)",
            (user["id"], conversation_id, message, time.time()),
        )
        recalled = is_recall_question(message)
        if recalled:
            # "你还记得我吗" 不走知识库也不走模型：只报自己数出来的账。
            result = {"reply": recall_answer(memory), "evidence": [], "ratingsChanged": False,
                      "emotion": "happy", "ranking": [], "recommendations": []}
        else:
            result = knowledge.answer(answer_question, user["id"], connection, payload.context_stall_id)
    # Do not hold a SQLite write transaction while the external model answers.
    if not recalled:
        result["reply"] = tone.respond(answer_question, result)
        if used_memory:
            result["reply"] = (result["reply"].rstrip() + "\n（我记着你上次问的是"
                               + str(memory["last_topic"]) + "，就按这个接着查的。）")
    with db() as connection:
        connection.execute(
            "INSERT INTO messages(user_id,conversation_id,role,content,evidence_json,ranking_json,recommendations_json,created_at) "
            "VALUES(?,?,'assistant',?,?,?,?,?)",
            (user["id"], conversation_id, result["reply"], json.dumps(result["evidence"], ensure_ascii=False),
             json.dumps(result["ranking"], ensure_ascii=False),
             json.dumps(result["recommendations"], ensure_ascii=False), time.time()),
        )
        remember_message(connection, user["id"], message, memory)
        prune_messages(connection, user["id"])
        if previous_count == 0:
            title = message.replace("\n", " ")[:18]
            connection.execute("UPDATE conversations SET title=?,updated_at=? WHERE id=?",
                               (title, time.time(), conversation_id))
        else:
            connection.execute("UPDATE conversations SET updated_at=? WHERE id=?",
                               (time.time(), conversation_id))
    return {**result, "conversationId": conversation_id}
