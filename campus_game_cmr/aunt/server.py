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


def cookie_ticket(request: Request, name: str) -> str:
    """从 Cookie 头里挑出**路径最长**那张票。

    8081 换票种的是 `path=/cmr`，本服务自己登录种的是 `path=/`；两张同名票会一起
    寄过来并按「路径最长优先」排（RFC 6265 §5.4），而 Starlette 的 `request.cookies`
    是普通字典，同一个键后写的覆盖先写的 —— 用 `cookies.get()` 会拿到那张旧票，
    表现为「换了票，`/api/me` 还是上一个人」。这里自己扫一遍，取第一条。
    """
    for item in request.headers.get("cookie", "").split(";"):
        key, _, value = item.partition("=")
        if key.strip() == name:
            return value.strip()
    return ""


def current_user(request: Request) -> sqlite3.Row:
    token = cookie_ticket(request, "aunt_session")
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


def set_session(response: Response, user_id: int, secure: bool) -> str:
    token = secrets.token_urlsafe(32)
    with db() as connection:
        connection.execute("DELETE FROM sessions WHERE expires_at<?", (time.time(),))
        connection.execute(
            "INSERT INTO sessions(token_hash,user_id,expires_at) VALUES(?,?,?)",
            (hashlib.sha256(token.encode("utf-8")).hexdigest(), user_id, time.time() + 30 * 86400),
        )
    response.set_cookie("aunt_session", token, max_age=30 * 86400, httponly=True,
                        secure=secure, samesite="strict", path="/")
    return token


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
    token = cookie_ticket(request, "aunt_session")
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


class HostTicket(BaseModel):
    nickname: str = Field(min_length=2, max_length=16)
    campus_user_id: int


def internal_guard(request: Request):
    """服务间互信那道门闩（任务书 §3.1.3 第③步：8081 替玩家向各家换票）。

    密钥只从环境变量 `CAMPUS_INTERNAL_SECRET` 读，**没设就当场 503** ——
    宁可换不到票（地图上会挂「食堂阿姨没登进去」），也不能开一条不鉴权的发票通道。
    """
    secret = os.environ.get("CAMPUS_INTERNAL_SECRET", "")
    if not secret:
        raise HTTPException(503, "未配置 CAMPUS_INTERNAL_SECRET，内部换票通道没开")
    # ⚠️ 两边都 .encode() 再比：compare_digest 收 str 时只认 ASCII，
    #    有人拿中文当密钥会直接抛 TypeError 变成 500，而不是老老实实的 403。
    if not hmac.compare_digest(request.headers.get("x-campus-internal", "").encode("utf-8"),
                               secret.encode("utf-8")):
        raise HTTPException(403, "内部密钥不对")


@app.post("/api/host-ticket")
def host_ticket(payload: HostTicket, request: Request, response: Response):
    """主站登录后替玩家领一张阿姨自己认的票。抽屉里已经没有登录表单了（§3.1.2）。

    按昵称建号/取号，**不碰口令**：建出来的 `password_hash` 是个不带冒号的随机串，
    `password_matches()` 解析它必然抛 ValueError 并返回 False，所以这个号在阿姨这儿
    永远登录不进来，只能由主站过了 `internal_guard` 才拿得到。
    """
    internal_guard(request)
    nickname = payload.nickname.strip()
    with db() as connection:
        row = connection.execute("SELECT id FROM users WHERE username=?", (nickname,)).fetchone()
        if row is None:
            cursor = connection.execute(
                "INSERT INTO users(username,password_hash,created_at) VALUES(?,?,?)",
                (nickname, "!" + secrets.token_hex(32), time.time()),
            )
            user_id = cursor.lastrowid
        else:
            user_id = row["id"]
    token = set_session(response, user_id, request.url.scheme == "https")
    return {"ok": True, "id": user_id, "username": nickname, "token": token}


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
        previous_count = connection.execute(
            "SELECT COUNT(*) AS n FROM messages WHERE conversation_id=? AND role='user'", (conversation_id,)
        ).fetchone()["n"]
        connection.execute(
            "INSERT INTO messages(user_id,conversation_id,role,content,created_at) VALUES(?,?,'user',?,?)",
            (user["id"], conversation_id, message, time.time()),
        )
        result = knowledge.answer(message, user["id"], connection, payload.context_stall_id)
    # Do not hold a SQLite write transaction while the external model answers.
    result["reply"] = tone.respond(message, result)
    with db() as connection:
        connection.execute(
            "INSERT INTO messages(user_id,conversation_id,role,content,evidence_json,ranking_json,recommendations_json,created_at) "
            "VALUES(?,?,'assistant',?,?,?,?,?)",
            (user["id"], conversation_id, result["reply"], json.dumps(result["evidence"], ensure_ascii=False),
             json.dumps(result["ranking"], ensure_ascii=False),
             json.dumps(result["recommendations"], ensure_ascii=False), time.time()),
        )
        if previous_count == 0:
            title = message.replace("\n", " ")[:18]
            connection.execute("UPDATE conversations SET title=?,updated_at=? WHERE id=?",
                               (title, time.time(), conversation_id))
        else:
            connection.execute("UPDATE conversations SET updated_at=? WHERE id=?",
                               (time.time(), conversation_id))
    return {**result, "conversationId": conversation_id}
