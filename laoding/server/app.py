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

from fastapi import FastAPI, Header, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(ROOT, "server", "users.db")
TOKEN_TTL = 7 * 24 * 3600  # token 有效期 7 天

class PrefixStrip:
    """把 `/ld/...` 剥成 `/...` 的纯 ASGI 中间件（2026-10-09 · 接入像素校园大地图）。

    地图跑在 `http://localhost:3000`，本服务在 `127.0.0.1:8000` —— 不是同源。
    Vite 把 `/ld` **原样转发**到这里，由本中间件摘掉前缀，于是浏览器眼里两边同源
    ⇒ 地图抽屉里按 Esc 能退出来（父页拿得到 iframe 的 document），路径也对得上。
    （做法与 `xueba-ge/backend/app.py` 的 PrefixStrip 逐字同款。）

    ⚠️ 只在**真的以 /ld 开头**时才剥 ⇒ 裸 `/api/...` 与 `/ld/api/...` 两条路同时活着，
       本服务仍能独立跑在 8000（双击 run_server.bat 那条老路一个字不改）。
    ⚠️ 用纯 ASGI 而不是 `@app.middleware("http")`（BaseHTTPMiddleware 会把响应包进
       anyio 内存流，对静态文件与流式响应都有攒批的老毛病）。
    ⚠️ **不设 `scope["root_path"]`**：设了 Starlette 会给 `/assets`、`/data` 那两个
       StaticFiles 挂载拼出 `/ld/assets`，`get_path()` 找不到文件 ⇒ HTML 正常、
       CSS/图片全 404，而且**静默不报错**（xueba 那边最难查的一类，注释里记着）。
    """

    def __init__(self, app, prefix: str = "/ld"):
        self.app = app
        self.prefix = prefix.rstrip("/")

    async def __call__(self, scope, receive, send):
        if scope["type"] in ("http", "websocket"):
            p = scope.get("path", "")
            if p == self.prefix or p.startswith(self.prefix + "/"):
                scope["path"] = p[len(self.prefix):] or "/"     # `/ld` 要落成 `/`，不是空串
                rp = scope.get("raw_path")
                if isinstance(rp, bytes) and rp.startswith(self.prefix.encode()):
                    scope["raw_path"] = rp[len(self.prefix):] or b"/"
        await self.app(scope, receive, send)


app = FastAPI(title="北交大像素校园 · 保卫处账号服务", version="1.0")
# file:// 打开时 Origin 为 null，统一放行（无 Cookie 凭证，安全面可控）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], allow_methods=["*"], allow_headers=["*"],
)
# ⚠️ 排在 CORS **之后**加 ⇒ 它是中间件栈的**最外层**，先剥前缀再进路由。
app.add_middleware(PrefixStrip, prefix="/ld")


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


def auth(authorization: str, cookie_token: str = "") -> dict:
    token = authorization[7:] if authorization and authorization.startswith("Bearer ") else cookie_token
    if not token:
        raise HTTPException(401, "未登录")
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


LD_COOKIE = "ld_t"


def with_ticket(payload: dict) -> JSONResponse:
    """把老丁的票同时写进 **HttpOnly cookie**（二期 §3.1.2：抽屉里不再有自己的登录表单，
    身份只认宿主给的票）。

    · path=`/`：独立跑在 :8000（`/api/me`）和被地图挂在 `/ld`（`/ld/api/me`）两条路
      都要能带上，限到 `/ld` 会让独立跑失效。
    · 浏览器只按**请求路径**匹配，同名 cookie 按「路径最长优先」发送，所以将来
      8081 的 `/api/auth/exchange` 用 `path=/ld` 再种一张时，抽屉里的请求会优先带那张。
    """
    response = JSONResponse(payload)
    response.set_cookie(LD_COOKIE, payload["token"], max_age=TOKEN_TTL,
                        httponly=True, samesite="lax", path="/")
    return response


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
    return with_ticket({"token": issue_token(user_id), "user_id": user_id, "nickname": nickname})


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
    return with_ticket({"token": issue_token(row["user_id"]), "user_id": row["user_id"], "nickname": body.nickname.strip()})


@app.post("/api/logout")
def logout(request: Request):
    """退登：作废服务端这张票，并把浏览器 cookie 删掉。

    ⚠️ 票同时存在两处（一期 localStorage `ld_token` / 二期 cookie），只清一边会
    留下「页面说退出了、`/api/me` 还是上一个人」的串号口子。
    """
    token = request.cookies.get(LD_COOKIE, "")
    if not token:
        authorization = request.headers.get("Authorization", "")
        if authorization.startswith("Bearer "):
            token = authorization[7:]
    if token:
        with db() as conn:
            conn.execute("DELETE FROM tokens WHERE token = ?", (token,))
    response = JSONResponse({"ok": True})
    response.delete_cookie(LD_COOKIE, path="/")
    return response


@app.get("/api/me")
def me(request: Request, authorization: str = Header(default="")):
    return auth(authorization, request.cookies.get("ld_t", ""))


class HostTicketBody(BaseModel):
    nickname: str
    campus_user_id: int


def internal_guard(request: Request) -> None:
    """服务间互信那道门闩（任务书 §3.1.3 第③步：8081 替玩家向各家换票）。

    密钥只从环境变量 `CAMPUS_INTERNAL_SECRET` 读，**没设就当场 503** ——
    宁可换不到票（地图上会挂「老丁没登进去」），也不能开一条不鉴权的发票通道。
    """
    secret = os.environ.get("CAMPUS_INTERNAL_SECRET", "")
    if not secret:
        raise HTTPException(503, "未配置 CAMPUS_INTERNAL_SECRET，内部换票通道没开")
    # ⚠️ 两边都 .encode() 再比：compare_digest 收 str 时只认 ASCII，
    #    有人拿中文当密钥会直接抛 TypeError 变成 500，而不是老老实实的 403。
    if not secrets.compare_digest(request.headers.get("x-campus-internal", "").encode("utf-8"),
                                  secret.encode("utf-8")):
        raise HTTPException(403, "内部密钥不对")


@app.post("/api/host-ticket")
def host_ticket(body: HostTicketBody, request: Request):
    """主站登录后替玩家领一张老丁认的票 —— 抽屉里已经没有登录表单了（§3.1.2）。

    `pw_hash` 写的是 `"!host:" + 随机` ：形状上还是 `存储值:盐`，`login()` 那行
    `split(":")` 不会炸，但 `hash_pw()` 怎么算都对不上，所以这个号在老丁这儿
    **永远登录不进来**，只能由主站过完门闩才拿得到。
    """
    internal_guard(request)
    nickname = body.nickname.strip()
    if not nickname or len(nickname) > 16:
        raise HTTPException(400, "昵称不合法（1~16 字符）")
    with db() as conn:
        row = conn.execute("SELECT user_id FROM users WHERE nickname = ?", (nickname,)).fetchone()
        if row:
            user_id = row["user_id"]
        else:
            # ⚠️ 别拿主站的 user_id 当本地主键：本地是按**昵称**找人的，同一个人改了昵称
            #    再换票，就会拿同一个 host_<主站ID> 插第二次，撞 PRIMARY KEY 直接 500。
            #    主站 ID 与本地 ID 的对应关系记在 8081 的 mp_ticket 表里，不在这儿。
            user_id = "u_" + secrets.token_hex(4)
            conn.execute(
                "INSERT INTO users(user_id, nickname, pw_hash, created) VALUES(?,?,?,?)",
                (user_id, nickname, "!host:" + secrets.token_hex(32), time.time()),
            )
    return with_ticket({"token": issue_token(user_id), "user_id": user_id, "nickname": nickname})


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
