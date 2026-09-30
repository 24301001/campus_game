# -*- coding: utf-8 -*-
"""
账号服务（轻后端）—— 保安 · 老丁 独立交付件之一（保安.md §六）

职责边界（有意做小）：
  · 注册 / 登录 / 签发 token / 校验 token（Bearer）
  · 顺带托管前端与数据文件（index.html + data/*.json），一条命令独立可跑
它不是登录 UI 的附属，是「记忆归属」的前提：有了 user_id，私密记忆才能跨会话、
跨设备挂在同一个人身上。合体时五套账号并成一套统一账号，本文件整体退役。

运行（嵌入版 Python 需先装依赖到项目内 .pylibs，见仓库根目录说明）：
    python server/app.py
    # 或：uvicorn server.app:app --host 127.0.0.1 --port 8000
访问 http://127.0.0.1:8000

不破坏硬约束：这是账号服务，不是业务后端——失物库、工单库仍在前端本地闭环。
"""
import hashlib
import os
import secrets
import sqlite3
import time

from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(ROOT, "server", "users.db")
TOKEN_TTL = 7 * 24 * 3600  # token 有效期 7 天

app = FastAPI(title="北交大像素校园 · 保卫处账号服务", version="1.0")
# file:// 打开时 Origin 为 null，统一放行（无 Cookie 凭证，安全面可控）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_methods=["*"], allow_headers=["*"],
)


# ---------------- SQLite ----------------
def db() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    with db() as conn:
        conn.execute(
            """CREATE TABLE IF NOT EXISTS users(
                   user_id  TEXT PRIMARY KEY,
                   nickname TEXT UNIQUE NOT NULL,
                   pw_hash  TEXT NOT NULL,
                   created  REAL NOT NULL)"""
        )
        conn.execute(
            """CREATE TABLE IF NOT EXISTS tokens(
                   token   TEXT PRIMARY KEY,
                   user_id TEXT NOT NULL,
                   expires REAL NOT NULL)"""
        )


def hash_pw(password: str, salt: str) -> str:
    # PBKDF2-SHA256，10 万轮迭代；盐随机，逐用户独立
    return hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), bytes.fromhex(salt), 100_000).hex()


def issue_token(user_id: str) -> str:
    token = secrets.token_hex(32)
    with db() as conn:
        conn.execute(
            "INSERT INTO tokens(token, user_id, expires) VALUES(?,?,?)",
            (token, user_id, time.time() + TOKEN_TTL),
        )
    return token


def auth(authorization: str) -> dict:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(401, "未登录")
    token = authorization[7:]
    with db() as conn:
        row = conn.execute(
            """SELECT u.user_id, u.nickname FROM tokens t
               JOIN users u ON u.user_id = t.user_id
               WHERE t.token = ? AND t.expires > ?""",
            (token, time.time()),
        ).fetchone()
    if not row:
        raise HTTPException(401, "token 无效或已过期")
    return dict(row)


# ---------------- 接口 ----------------
class AuthBody(BaseModel):
    nickname: str
    password: str


@app.get("/api/health")
def health():
    return {"ok": True, "service": "guard-account", "time": time.time()}


@app.post("/api/register")
def register(body: AuthBody):
    nickname = body.nickname.strip()
    if not nickname or len(nickname) > 16:
        raise HTTPException(400, "昵称不合法（1~16 字符）")
    if len(body.password) < 6:
        raise HTTPException(400, "密码至少 6 位")
    salt = secrets.token_hex(16)
    user_id = "u_" + secrets.token_hex(4)
    try:
        with db() as conn:
            conn.execute(
                "INSERT INTO users(user_id, nickname, pw_hash, created) VALUES(?,?,?,?)",
                (user_id, nickname, hash_pw(body.password, salt) + ":" + salt, time.time()),
            )
    except sqlite3.IntegrityError:
        raise HTTPException(409, "昵称已被注册")
    return {"token": issue_token(user_id), "user_id": user_id, "nickname": nickname}


@app.post("/api/login")
def login(body: AuthBody):
    with db() as conn:
        row = conn.execute(
            "SELECT user_id, pw_hash FROM users WHERE nickname = ?", (body.nickname.strip(),)
        ).fetchone()
    if not row:
        raise HTTPException(401, "昵称或密码不对")
    stored, salt = row["pw_hash"].split(":")
    if not secrets.compare_digest(stored, hash_pw(body.password, salt)):
        raise HTTPException(401, "昵称或密码不对")
    return {"token": issue_token(row["user_id"]), "user_id": row["user_id"], "nickname": body.nickname.strip()}


@app.get("/api/me")
def me(authorization: str = Header(default="")):
    return auth(authorization)


# ---------------- 静态托管（前端 + 数据，独立可跑） ----------------
@app.get("/")
def index():
    return FileResponse(os.path.join(ROOT, "index.html"))


app.mount("/data", StaticFiles(directory=os.path.join(ROOT, "data")), name="data")


if __name__ == "__main__":
    init_db()
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info")
else:
    init_db()
