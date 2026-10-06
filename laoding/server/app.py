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
import json
import os
import secrets
import sqlite3
import time
import urllib.error
import urllib.request

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


# ---------------- 视觉识别代理（qwen3.8-flash，阿里云百炼 OpenAI 兼容接口） ----------------
# Key 不落库、不进前端：环境变量 DASHSCOPE_API_KEY 优先，否则读 server/qwen_key.txt（已 gitignore）
QWEN_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions"
QWEN_MODEL = "qwen3.8-flash"
QWEN_TIMEOUT = 25
KEY_FILE = os.path.join(ROOT, "server", "qwen_key.txt")
# 与前端 CATEGORY_ALIAS 的类别保持一致；识别结果回前端后仍走本地归一化
ITEM_CATEGORIES = [
    "校园卡", "学生证", "身份证", "水杯", "钥匙", "耳机", "手机", "雨伞",
    "书", "充电宝", "眼镜", "钱包", "书包", "衣物", "其他",
]

ITEM_PROMPT = (
    "你是北京交通大学保卫处失物招领的图像识别助手。只根据图片可见内容判断，看不清就留空，严禁编造。\n"
    "识别图中用于失物招领的单件主体物品，只输出 JSON（不要 markdown 代码块、不要多余文字）：\n"
    '{"category":"物品类别","color":"主颜色","brand":"品牌或物体上的明显文字，没有则空字符串",'
    '"desc":"30字以内客观外观描述，含颜色/材质/图案/挂件等识别特征","is_card":false}\n'
    "category 必须且只能从以下词里选一个：" + "、".join(ITEM_CATEGORIES) + "。"
)
CARD_PROMPT = (
    "你是校园证件识别助手。只根据图片可见内容识别，看不清的字段留空，严禁猜测。\n"
    "若图片主体是校园卡/学生证/身份证等带照片证件，只输出 JSON（不要 markdown 代码块）：\n"
    '{"is_card":true,"type":"校园卡或学生证或身份证","student_id":"证号/学号数字",'
    '"name":"持证人姓名"}\n若图片不是证件，只输出：{"is_card":false}'
)


class VisionBody(BaseModel):
    kind: str           # item = 失物外观识别；card = 证件 OCR
    image: str          # data:image/...;base64,xxxx


def qwen_api_key() -> str:
    key = os.environ.get("DASHSCOPE_API_KEY", "").strip()
    if key:
        return key
    if os.path.exists(KEY_FILE):
        with open(KEY_FILE, "r", encoding="utf-8") as f:
            return f.read().strip()
    return ""


def _strip_json(text: str) -> dict:
    t = (text or "").strip()
    if t.startswith("```"):
        t = t.split("\n", 1)[-1] if "\n" in t else t
        if t.rstrip().endswith("```"):
            t = t.rstrip()[:-3]
    a, b = t.find("{"), t.rfind("}")
    if a >= 0 and b > a:
        t = t[a:b + 1]
    return json.loads(t)


@app.get("/api/vision/status")
def vision_status():
    return {"model": QWEN_MODEL, "enabled": bool(qwen_api_key())}


@app.post("/api/vision/recognize")
def vision_recognize(body: VisionBody):
    if body.kind not in ("item", "card"):
        raise HTTPException(400, "kind 只能是 item 或 card")
    if not isinstance(body.image, str) or not body.image.startswith("data:image/") or len(body.image) < 100:
        raise HTTPException(400, "image 必须是 data:image base64")
    key = qwen_api_key()
    if not key:
        raise HTTPException(503, detail={"code": "no_key",
                                         "msg": "未配置 DASHSCOPE_API_KEY（环境变量或 server/qwen_key.txt）"})
    payload = {
        "model": QWEN_MODEL,
        "messages": [{
            "role": "user",
            "content": [
                {"type": "image_url", "image_url": {"url": body.image[:12 * 1024 * 1024]}},
                {"type": "text", "text": CARD_PROMPT if body.kind == "card" else ITEM_PROMPT},
            ],
        }],
        "response_format": {"type": "json_object"},
        "enable_thinking": False,   # 识别任务直接作答，省 token、降延迟
        "temperature": 0.1,
    }
    req = urllib.request.Request(
        QWEN_URL, data=json.dumps(payload).encode("utf-8"),
        headers={"Authorization": "Bearer " + key, "Content-Type": "application/json"},
        method="POST",
    )
    # 百炼是国内服务，显式直连，绕过系统代理（Clash 等）避免绕行海外节点
    opener = urllib.request.build_opener(urllib.request.ProxyHandler({}))
    try:
        with opener.open(req, timeout=QWEN_TIMEOUT) as resp:
            out = json.loads(resp.read().decode("utf-8"))
        content = out["choices"][0]["message"]["content"]
        data = _strip_json(content)
    except urllib.error.HTTPError as e:
        raise HTTPException(502, detail={"code": "upstream_http", "status": e.code,
                                        "msg": e.read().decode("utf-8", "ignore")[:300]})
    except (urllib.error.URLError, TimeoutError) as e:
        raise HTTPException(504, detail={"code": "upstream_unreachable", "msg": str(e)[:200]})
    except (KeyError, json.JSONDecodeError) as e:
        raise HTTPException(502, detail={"code": "bad_upstream_response", "msg": str(e)[:200]})
    return {"ok": True, "model": out.get("model", QWEN_MODEL), "data": data}


# ---------------- 静态托管（前端 + 数据，独立可跑） ----------------
_NO_CACHE = {"Cache-Control": "no-cache, no-store, must-revalidate"}


@app.get("/")
def index():
    # 入口 HTML 禁止缓存：前端是单文件持续迭代，避免用户浏览器吃旧版（旧版还在打 9000 端口）
    return FileResponse(os.path.join(ROOT, "index.html"), headers=_NO_CACHE)


app.mount("/data", StaticFiles(directory=os.path.join(ROOT, "data")), name="data")
_assets_dir = os.path.join(ROOT, "assets")
if os.path.isdir(_assets_dir):
    app.mount("/assets", StaticFiles(directory=_assets_dir), name="assets")


if __name__ == "__main__":
    init_db()
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info")
else:
    init_db()
