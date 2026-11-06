"""Local LAN lobby server. Run: python mp/server.py (Python 3.10+, websockets 15+)."""
from __future__ import annotations

import asyncio
import base64
import binascii
import gzip
import http.client
import hashlib
import hmac
import ipaddress
import json
import math
import mimetypes
import mmap
import os
import re
import secrets
import smtplib
import sqlite3
import threading
import time
import unicodedata
from datetime import datetime, timezone
from email.message import EmailMessage
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from http.cookies import SimpleCookie
from pathlib import Path
import urllib.request
from urllib.parse import parse_qs, unquote, urlsplit

from websockets.asyncio.server import serve

# 密码强度 / 泄露库校验放在单独文件里，方便本地直接跑单元自测。
# 直接 `python mp/server.py` 时它和本文件同目录；`python -m mp.server` 时走包路径。
try:
    from password_check import check as password_check, strength as password_strength
except ImportError:  # pragma: no cover - 取决于启动方式
    from mp.password_check import check as password_check, strength as password_strength
try:
    from rate_store import store as rate_store
except ImportError:  # pragma: no cover
    from mp.rate_store import store as rate_store
try:
    import npc_guard                      # NPC 转发口的限速 + 提示词注入体检
except ImportError:  # pragma: no cover
    from mp import npc_guard
# 注册验证码（拖动拼图 + 轨迹校验）自己实现，见 captcha.py。
try:
    import captcha as captcha_mod
except ImportError:  # pragma: no cover - 取决于启动方式
    from mp import captcha as captcha_mod

ROOT = Path(__file__).resolve().parent.parent
DB_PATH = Path(os.environ.get("MP_DB", ROOT / "mp" / "lobby.sqlite3"))
HOST = os.environ.get("MP_HOST", "0.0.0.0")
HTTP_PORT = int(os.environ.get("MP_HTTP_PORT", "3000"))
WS_PORT = int(os.environ.get("MP_WS_PORT", "8090"))
CMR_PORT = int(os.environ.get("CMR_PORT", "8020"))  # [QODER-FIX #22] 食堂阿姨可跑独立实例(如 8021)，不碰 /opt
XBG_PORT = int(os.environ.get("XBG_PORT", "8010"))
LD_PORT = int(os.environ.get("LD_PORT", "8000"))
AGENT_PORT = int(os.environ.get("AGENT_PORT", "8081"))
AGENT_WEB_PORT = int(os.environ.get("AGENT_WEB_PORT", "3001"))
DEFAULT_LOOK = {"skin": "#e0ae87", "faceShape": "round", "hairStyle": "short", "hairColor": "#3c291f", "eye": "round", "eyeColor": "#238d9a", "mouth": "soft", "cloth": "#f1f0ea", "clothAlt": "#293944", "clothPattern": "stripe", "pants": "#3d5274", "acc": "none", "accColor": "#b67a56", "packColor": "#b4552f"}
LOOK_COLORS = ("skin", "hairColor", "eyeColor", "cloth", "clothAlt", "pants", "accColor", "packColor")
LOOK_CHOICES = {"faceShape": ("square", "round"), "hairStyle": ("short", "mid", "long", "ponytail", "bun", "twintails"), "eye": ("round", "narrow", "dot"), "mouth": ("soft", "smile"), "acc": ("none", "glasses", "cap", "scarf"), "clothPattern": ("solid", "stripe")}
DEFAULT_VISIBILITY = {"bio": True, "college": True, "grade": True, "tags": True}


def nickname_key(name: str) -> str:
    """昵称的比较键：全角半角、大小写、首尾空白都不算数。

    "ZlK" / "zlk" / "ＺＬＫ" 在数据库里是三个不同的字符串，但在用户眼里是同一个
    名字 —— 不处理就会出现冒名顶替。先用 NFKC 把全角字母、兼容字符折成标准形式，
    再 casefold（比 lower 更彻底，ß、希腊字母这些也能折）。
    """
    return unicodedata.normalize("NFKC", str(name or "")).casefold().strip()
# 北京交通大学官网“机构设置 → 直属学院”现列的 23 个学院。
# 主页只提供下拉选择；旧名称仍可显示为待重新选择的历史值。
CAMPUS_COLLEGES = (
    "自动化与智能学院", "电子信息工程学院", "计算机科学与技术学院", "经济管理学院",
    "交通运输学院", "土木建筑工程学院", "机械与电子控制工程学院", "电气工程学院",
    "数学与统计学院", "物理科学与工程学院", "马克思主义学院", "外国语与新闻传播学院",
    "软件学院", "建筑与设计学院", "法学院", "碳中和与环境学院", "系统科学学院",
    "网络空间安全学院（国家保密学院）", "詹天佑学院（智慧交通未来技术学院）",
    "国家卓越工程师学院", "威海国际学院", "国际教育学院", "体育学院",
)
SCENES = {"out", "center", "yifu"}
NPC_PORTS = {"xbg": XBG_PORT, "ld": LD_PORT, "cmr": CMR_PORT, "agent": AGENT_PORT}
PROXY_PREFIXES = (("/xbg", XBG_PORT), ("/ld", LD_PORT), ("/cmr", CMR_PORT),
                  ("/api/", AGENT_PORT), ("/algo", AGENT_WEB_PORT),
                  ("/agent", AGENT_WEB_PORT), ("/assets/", AGENT_WEB_PORT),
                  ("/@vite/", AGENT_WEB_PORT), ("/@id/", AGENT_WEB_PORT), ("/@fs/", AGENT_WEB_PORT),
                  ("/__vite_ping", AGENT_WEB_PORT), ("/src/", AGENT_WEB_PORT), ("/node_modules/", AGENT_WEB_PORT),
                  ("/favicon.ico", AGENT_WEB_PORT))
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
    /* --- 楼宇主页（building/ 模块）：照片墙 + 留言 ---------------------------
       bld = 楼宇 slug（与 building/building.js 里的 SITES 一一对应），
       file = 相对 ROOT 的图片路径（building/photos/… 或 building/seed/…）。
       种子照片由 seed_building() 在启动时按 manifest.json 补录，靠 file 唯一去重。 */
    CREATE TABLE IF NOT EXISTS mp_bld_photo(id INTEGER PRIMARY KEY, bld TEXT NOT NULL, user_id INTEGER NOT NULL, file TEXT NOT NULL UNIQUE, note TEXT NOT NULL DEFAULT '', created_at REAL NOT NULL);
    CREATE INDEX IF NOT EXISTS idx_mp_bld_photo ON mp_bld_photo(bld, id);
    CREATE TABLE IF NOT EXISTS mp_bld_comment(id INTEGER PRIMARY KEY, bld TEXT NOT NULL, user_id INTEGER NOT NULL, content TEXT NOT NULL, created_at REAL NOT NULL);
    CREATE INDEX IF NOT EXISTS idx_mp_bld_comment ON mp_bld_comment(bld, id);
    /* ---------------- 管理后台（2026-11-04） ----------------
       mp_login_log：每次登录一条（含自动登录），带 IP —— 后台的"什么时候登录的、登录 IP"就靠它。
       mp_play：一条 = 一段联机游玩（进大厅到断线），ended_at 为空表示还在玩 —— "结束游玩的时间"靠它。
       mp_app_log：打开过哪个小应用（算法哥 /agent、学霸姐 /xbg、阿姨 /cmr、躲猫猫 /game/duo1，
                   映射表在 mp/app-track.js），
                   日活按"当天有没有记录"去重算，同一天开十次也只算一个人。
       mp_user_secret：后台要显示的密码。⚠️ 这是**明文备份**，登录和注册时顺手存一份；
                       老账号在加这个功能之前注册的，只有哈希、永远补不回来，后台显示"（旧账号）"。 */
    CREATE TABLE IF NOT EXISTS mp_login_log(id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL, at REAL NOT NULL, ip TEXT NOT NULL DEFAULT '');
    CREATE INDEX IF NOT EXISTS idx_mp_login_log_time ON mp_login_log(at);
    CREATE INDEX IF NOT EXISTS idx_mp_login_log_user ON mp_login_log(user_id, at);
    CREATE TABLE IF NOT EXISTS mp_play(id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL, started_at REAL NOT NULL, ended_at REAL, ip TEXT NOT NULL DEFAULT '');
    CREATE INDEX IF NOT EXISTS idx_mp_play_time ON mp_play(started_at);
    CREATE INDEX IF NOT EXISTS idx_mp_play_user ON mp_play(user_id, id);
    CREATE TABLE IF NOT EXISTS mp_app_log(id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL, app TEXT NOT NULL, at REAL NOT NULL);
    CREATE INDEX IF NOT EXISTS idx_mp_app_log_time ON mp_app_log(at);
    CREATE TABLE IF NOT EXISTS mp_user_secret(user_id INTEGER PRIMARY KEY, password TEXT NOT NULL, updated_at REAL NOT NULL);
    /* ---------------- 网络安全（2026-11-04，后台第二个页签） ----------------
       mp_http_log：每个请求一行（IP / 时间 / 路径 / 状态码），只留 7 天 —— "每个 IP 发起的请求"靠它。
       mp_ip_ban：IP 封禁名单，until=0 表示永久，auto=1 表示是系统自动封的。
       mp_login_fail：登录失败记录 —— 撞库、猜密码的人在这里露头。
       mp_setting：后台的几个开关（维护模式、自动封禁阈值）存成键值对，改完立刻生效，重启不丢。 */
    CREATE TABLE IF NOT EXISTS mp_http_log(id INTEGER PRIMARY KEY, ip TEXT NOT NULL, at REAL NOT NULL, path TEXT NOT NULL DEFAULT '', status INTEGER NOT NULL DEFAULT 0);
    CREATE INDEX IF NOT EXISTS idx_mp_http_log_time ON mp_http_log(at);
    CREATE INDEX IF NOT EXISTS idx_mp_http_log_ip ON mp_http_log(ip, at);
    CREATE TABLE IF NOT EXISTS mp_ip_ban(ip TEXT PRIMARY KEY, reason TEXT NOT NULL DEFAULT '', until REAL NOT NULL DEFAULT 0, created_at REAL NOT NULL, auto INTEGER NOT NULL DEFAULT 0);
    CREATE TABLE IF NOT EXISTS mp_login_fail(id INTEGER PRIMARY KEY, ip TEXT NOT NULL, nickname TEXT NOT NULL DEFAULT '', at REAL NOT NULL);
    CREATE INDEX IF NOT EXISTS idx_mp_login_fail_time ON mp_login_fail(at);
    CREATE TABLE IF NOT EXISTS mp_setting(k TEXT PRIMARY KEY, v TEXT NOT NULL);
    /* ---------------- 每日任务（2026-11-04） ----------------
       一个玩家一天一行（day 按北京时间切）。
       login_food / run_food：当天两份猫粮的**发放**记录，各 0/1 —— 用"发过没有"而不是
              "还剩几份"来记，是为了让重复登录、重复跑圈天然幂等。
       food_used：当天喂出去几份。剩余 = login_food + run_food - food_used。
       laps：当天在操场跑完的圈数（服务端只认这一份，客户端进度只用来画 HUD）。 */
    CREATE TABLE IF NOT EXISTS mp_daily(user_id INTEGER NOT NULL, day INTEGER NOT NULL,
        login_food INTEGER NOT NULL DEFAULT 0, run_food INTEGER NOT NULL DEFAULT 0,
        food_used INTEGER NOT NULL DEFAULT 0, laps INTEGER NOT NULL DEFAULT 0,
        PRIMARY KEY(user_id, day));
    /* ---------------- 注册验证（2026-11-05） ----------------
       mp_captcha：一道拖动拼图题，答案 target 只存服务端，3 分钟作废、一题一用。
       mp_captcha_ticket：过关后换的一次性票据，注册时认票。放数据库而不是内存，
             是为了重启不丢、多进程也能共用同一份。 */
    CREATE TABLE IF NOT EXISTS mp_captcha(id TEXT PRIMARY KEY, ip TEXT NOT NULL DEFAULT '',
        target INTEGER NOT NULL, created_at REAL NOT NULL, used INTEGER NOT NULL DEFAULT 0);
    CREATE INDEX IF NOT EXISTS idx_mp_captcha_time ON mp_captcha(created_at);
    CREATE TABLE IF NOT EXISTS mp_captcha_ticket(token TEXT PRIMARY KEY, ip TEXT NOT NULL DEFAULT '',
        issued_at REAL NOT NULL, expires_at REAL NOT NULL, used INTEGER NOT NULL DEFAULT 0);
    /* ---------------- 审核与举报（2026-11-06） ----------------
       口径是「先发布、后审核」：内容照常进库照常给别人看，同时往 mp_review 记一行，
       后台的「审核和举报中心」盯着这一行。status：0 待审 / 1 通过 / 2 已清理。
       mp_report：私聊里的「举报」，带举报理由和被举报内容的快照（消息可能被删，快照留着）。
       mp_block：拉黑。user_id 拉黑 target_id，双向都不再收对方的新私聊。 */
    CREATE TABLE IF NOT EXISTS mp_review(id INTEGER PRIMARY KEY, kind TEXT NOT NULL, ref_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL, ip TEXT NOT NULL DEFAULT '', content TEXT NOT NULL DEFAULT '',
        extra TEXT NOT NULL DEFAULT '', status INTEGER NOT NULL DEFAULT 0, created_at REAL NOT NULL,
        reviewed_at REAL NOT NULL DEFAULT 0, reviewer TEXT NOT NULL DEFAULT '');
    CREATE INDEX IF NOT EXISTS idx_mp_review_status ON mp_review(status, id);
    CREATE TABLE IF NOT EXISTS mp_report(id INTEGER PRIMARY KEY, reporter_id INTEGER NOT NULL,
        target_id INTEGER NOT NULL, msg_id INTEGER NOT NULL DEFAULT 0, kind TEXT NOT NULL DEFAULT 'chat',
        content TEXT NOT NULL DEFAULT '', reason TEXT NOT NULL DEFAULT '', ip TEXT NOT NULL DEFAULT '',
        status INTEGER NOT NULL DEFAULT 0, created_at REAL NOT NULL, handled_at REAL NOT NULL DEFAULT 0,
        handler TEXT NOT NULL DEFAULT '', action TEXT NOT NULL DEFAULT '');
    CREATE INDEX IF NOT EXISTS idx_mp_report_status ON mp_report(status, id);
    CREATE TABLE IF NOT EXISTS mp_block(user_id INTEGER NOT NULL, target_id INTEGER NOT NULL,
        created_at REAL NOT NULL, PRIMARY KEY(user_id, target_id));
    /* ---------------- NPC 对话（2026-11-06） ----------------
       mp_npc_chat：对 NPC 的每一次提问记一行（谁、哪个角色、问的什么、当天第几次）。
              管理后台「NPC 对话」页签就是这张表摊开。verdict：
              ok 正常进模型 / soft 可疑但放行 / block 被体检拦下 / quota 超当日额度 /
              banned 提问权已被停用 / rate 一分钟内问太急被拦。
       保留 90 天，另有 20 万行硬上限（prune_npc_log 在重启和写日志时顺手裁）。
       mp_npc_limit：单个账号对单个角色的每日上限，覆盖全局默认；没有这行＝用默认。
       mp_npc_ban：停用某个账号对某个角色的提问权；kind='*' 表示全部角色，until=0 表示永久。 */
    CREATE TABLE IF NOT EXISTS mp_npc_chat(id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL,
        kind TEXT NOT NULL, text TEXT NOT NULL DEFAULT '', day INTEGER NOT NULL,
        at REAL NOT NULL, verdict TEXT NOT NULL DEFAULT 'ok');
    CREATE INDEX IF NOT EXISTS idx_mp_npc_chat_user ON mp_npc_chat(user_id, kind, day);
    CREATE INDEX IF NOT EXISTS idx_mp_npc_chat_at ON mp_npc_chat(at);
    CREATE TABLE IF NOT EXISTS mp_npc_limit(user_id INTEGER NOT NULL, kind TEXT NOT NULL,
        daily INTEGER NOT NULL, PRIMARY KEY(user_id, kind));
    CREATE TABLE IF NOT EXISTS mp_npc_ban(user_id INTEGER NOT NULL, kind TEXT NOT NULL,
        until REAL NOT NULL DEFAULT 0, reason TEXT NOT NULL DEFAULT '',
        created_by TEXT NOT NULL DEFAULT '', created_at REAL NOT NULL, PRIMARY KEY(user_id, kind));
    /* 个人主页的「近期动态」（2026-11-06）：喂猫、乐跑这类没有现成流水的事记在这里；
       和 NPC 的对话、留言板发言分别从 mp_npc_chat / mp_announcement 现查，不重复存。
       只留 30 天，启动时顺手清。 */
    CREATE TABLE IF NOT EXISTS mp_activity(id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL,
        kind TEXT NOT NULL, text TEXT NOT NULL DEFAULT '', day INTEGER NOT NULL, at REAL NOT NULL);
    CREATE INDEX IF NOT EXISTS idx_mp_activity_user ON mp_activity(user_id, at);
    /* 全校动态里的老丁失物：挂失/认领发生在老丁的 iframe 里，浏览器本地存，
       服务端只在事发时收一条"什么物品、挂失还是认领"，用来排"最近最多的物品"。
       不记是谁，也不记联系方式。保留 30 天。 */
    CREATE TABLE IF NOT EXISTS mp_pulse_event(id INTEGER PRIMARY KEY, kind TEXT NOT NULL,
        item TEXT NOT NULL DEFAULT '', at REAL NOT NULL);
    CREATE INDEX IF NOT EXISTS idx_mp_pulse_event_at ON mp_pulse_event(at);
    """)
    if "visibility_json" not in {column["name"] for column in db.execute("PRAGMA table_info(mp_player)")}:
        db.execute("ALTER TABLE mp_player ADD COLUMN visibility_json TEXT NOT NULL DEFAULT '{\"bio\":true,\"college\":true,\"grade\":true,\"tags\":true}'")
    _user_cols = {column["name"] for column in db.execute("PRAGMA table_info(mp_user)")}
    for _col, _ddl in (("is_admin", "ALTER TABLE mp_user ADD COLUMN is_admin INTEGER NOT NULL DEFAULT 0"),
                       ("banned_until", "ALTER TABLE mp_user ADD COLUMN banned_until REAL NOT NULL DEFAULT 0"),
                       ("ban_reason", "ALTER TABLE mp_user ADD COLUMN ban_reason TEXT NOT NULL DEFAULT ''"),
                       ("created_at", "ALTER TABLE mp_user ADD COLUMN created_at REAL NOT NULL DEFAULT 0"),
                       # 昵称规范化键：全角/半角、大小写视为同一个名字，唯一索引就建在它上面
                       ("name_key", "ALTER TABLE mp_user ADD COLUMN name_key TEXT NOT NULL DEFAULT ''"),
                       # 禁言：只挡「发东西」（私聊、留言板、楼宇照片/留言），不禁登录
                       ("muted_until", "ALTER TABLE mp_user ADD COLUMN muted_until REAL NOT NULL DEFAULT 0"),
                       ("mute_reason", "ALTER TABLE mp_user ADD COLUMN mute_reason TEXT NOT NULL DEFAULT ''")):
        if _col not in _user_cols:
            db.execute(_ddl)
    for _r in db.execute("SELECT id,nickname FROM mp_user WHERE name_key=''").fetchall():
        db.execute("UPDATE mp_user SET name_key=? WHERE id=?", (nickname_key(_r["nickname"]), _r["id"]))
    try:
        # 部分索引：只对填了键的行去重。系统自己建的服务号要是没填键（空串），
        # 空串之间不该互相冲突 —— 普通唯一索引会让第二个空串直接插不进去。
        db.execute("DROP INDEX IF EXISTS idx_mp_user_name_key")
        db.execute("CREATE UNIQUE INDEX IF NOT EXISTS idx_mp_user_name_key ON mp_user(name_key) WHERE name_key <> ''")
    except sqlite3.IntegrityError:
        # 历史数据里要是已经有同键账号，索引建不上；注册时还会再逐条比对，不会漏。
        print("[db] 昵称规范化键有重复，唯一索引未建立")

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


def token_user(token: str):
    if not token:
        return None
    digest = hashlib.sha256(token.encode()).hexdigest()
    return row("SELECT u.id,u.nickname FROM mp_token t JOIN mp_user u ON u.id=t.user_id WHERE t.token_hash=? AND t.expires_at>?", (digest, time.time()))


def player_of(user_id: int):
    p = row("SELECT p.*,u.nickname,u.is_admin FROM mp_player p JOIN mp_user u ON u.id=p.user_id WHERE p.user_id=?", (user_id,))
    if not p:
        return None
    return {"id": user_id, "nickname": p["nickname"], "look": json.loads(p["look_json"]), "bio": p["bio"], "college": p["college"], "grade": p["grade"], "tags": json.loads(p["tags"]), "visibility": json.loads(p["visibility_json"]), "admin": bool(p["is_admin"])}


def nickname_status(name: str) -> dict:
    """注册页边打字边问：这个名字还能不能用。按规范化键比对，大小写/全角都算同一个。"""
    name = (name or "").strip()
    if not 2 <= len(name) <= 16 or any(ord(c) < 32 for c in name):
        return {"ok": False, "available": False, "error": "昵称须为 2 至 16 字"}
    taken = row("SELECT id FROM mp_user WHERE name_key=?", (nickname_key(name),))
    return {"ok": True, "available": not taken,
            "error": "" if not taken else "这个昵称已经被使用了（大小写、全角半角算同一个）"}


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


# ---------------------------------------------------------------------------
# 管理后台：账号 admin（见 seed_admin）登录后不再进游戏，改去 /admin.html。
#   后台要的四件事都在这几行里：谁登录过（mp_login_log 带 IP）、玩了多久
#   （mp_play 记开始/结束）、最近一周日活（按天去重）、四个小应用各自的日活
#   （mp_app_log）。封号写 mp_user.banned_until，登录时先查它。
#   ⚠️ 时间一律按北京时间切日：服务器时区是哪都不影响，day_key() 里写死 +8 小时。
# ---------------------------------------------------------------------------
TZ_SHIFT = 8 * 3600
BAN_FOREVER = 4102444800.0          # 2100-01-01，当作"永久"
ADMIN_NICK = "admin"
# 管理员口令只写在服务器的 /etc/campus-portal/app.env（MP_ADMIN_PASS），不进仓库。
# 仓库是公开的，口令一旦提交上去等于公开。
ADMIN_PASS = os.environ.get("MP_ADMIN_PASS", "").strip()
APP_KEYS = {"algogo": "算法哥", "xbg": "学霸姐", "cmr": "食堂阿姨", "duo1": "躲猫猫", "ld": "保安老丁"}

# ---------------------------------------------------------------------------
# 管理员登录提醒邮件（2026-11-05）
#   管理员账号一登录就发一封信，写清楚是谁、从哪个 IP、什么时候。
#   QQ 邮箱要在「设置 → 账户」里开启 SMTP 并生成授权码，密码框填授权码，
#   不是 QQ 密码。口令只从环境变量读，不写进代码、不进 git。
#   MP_SMTP_PASS 没配就只打一行日志，不影响登录。
# ---------------------------------------------------------------------------
ALERT_TO = os.environ.get("MP_ALERT_TO", "zlk173096@qq.com")
SMTP_HOST = os.environ.get("MP_SMTP_HOST", "smtp.qq.com")
SMTP_PORT = int(os.environ.get("MP_SMTP_PORT", "465"))
SMTP_USER = os.environ.get("MP_SMTP_USER", ALERT_TO)
SMTP_PASS = os.environ.get("MP_SMTP_PASS", "")
SITE_NAME = os.environ.get("MP_SITE_NAME", "像素校园")


def send_admin_mail(subject: str, body: str):
    """给管理员邮箱发一封信。放后台线程，调用方不等它。没配口令就只打日志。"""
    if not SMTP_PASS:
        print(f"[alert] 没有配置 MP_SMTP_PASS，跳过：{subject}")
        return

    def worker():
        try:
            msg = EmailMessage()
            msg["Subject"] = subject
            msg["From"] = SMTP_USER
            msg["To"] = ALERT_TO
            msg.set_content(body)
            if SMTP_PORT == 465:
                with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT, timeout=10) as smtp:
                    smtp.login(SMTP_USER, SMTP_PASS)
                    smtp.send_message(msg)
            else:
                with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=10) as smtp:
                    smtp.starttls()
                    smtp.login(SMTP_USER, SMTP_PASS)
                    smtp.send_message(msg)
            print(f"[alert] 已发到 {ALERT_TO}：{subject}")
        except Exception as exc:
            print(f"[alert] 发送失败（{subject}）：{exc}")

    threading.Thread(target=worker, daemon=True).start()


def alert_admin_login(ip: str, user_agent: str = "", at: float | None = None):
    """管理员登录后发提醒邮件。"""
    when = at or time.time()
    stamp = datetime.fromtimestamp(when + TZ_SHIFT, timezone.utc).strftime("%Y-%m-%d %H:%M:%S")
    try:
        region = (geo_regions([ip]) or {}).get(ip, "")
    except Exception:
        region = ""
    send_admin_mail(
        f"{SITE_NAME}：管理员账号登录提醒",
        f"管理员账号 {ADMIN_NICK} 刚刚登录了{SITE_NAME}。\n\n"
        f"登录时间：{stamp}（北京时间）\n"
        f"登录 IP：{ip}\n"
        f"归属地：{region or '未知'}\n"
        f"浏览器：{user_agent[:200] or '未知'}\n\n"
        f"如果这不是你本人操作的，请立刻改管理员密码，"
        f"并到后台「网络安全」里把这个 IP 封掉。\n")


# ---------------------------------------------------------------------------
# 审核提醒邮件（2026-11-06）
#   有人发了内容进待审队列、或者有人提交举报，就给管理员发一封信。
#   不是来一条发一条 —— 第一条进来后先等 NOTIFY_DELAY 秒，把这段时间里的
#   一起写进同一封；两封之间至少隔 NOTIFY_GAP 秒，免得有人一分钟发五十条
#   把邮箱刷爆。从没配过 MP_SMTP_PASS 就只打日志，不影响发内容。
# ---------------------------------------------------------------------------
SITE_URL = os.environ.get("MP_SITE_URL", "https://bjtupixelcampus.online").rstrip("/")
NOTIFY_DELAY = 60          # 第一条进来后攒多久
NOTIFY_GAP = 600           # 两封提醒之间至少隔多久
_notify_lock = threading.Lock()
_notify_items: list[str] = []
_notify_timer = None
_notify_next_at = 0.0


def notify_moderation(line: str):
    """记一笔"要提醒管理员"的事，攒一会儿一起发。"""
    global _notify_timer
    with _notify_lock:
        _notify_items.append(line)
        if _notify_timer is not None:
            return                      # 已经有一个在倒计时，它会连这条一起发
        delay = max(NOTIFY_DELAY, _notify_next_at - time.time())
        t = threading.Timer(delay, _flush_moderation)
        t.daemon = True
        _notify_timer = t
        t.start()


def _flush_moderation():
    global _notify_timer, _notify_next_at
    with _notify_lock:
        items = _notify_items[:]
        _notify_items.clear()
        _notify_timer = None
        _notify_next_at = time.time() + NOTIFY_GAP
    if not items:
        return
    shown = items[:20]
    tail = "" if len(items) <= 20 else f"\n……还有 {len(items) - 20} 条，请到后台查看。"
    send_admin_mail(
        f"{SITE_NAME}：{len(items)} 条待审核 / 举报",
        f"{SITE_NAME}后台有 {len(items)} 件事等你处理。\n\n"
        + "\n".join(shown) + tail + "\n\n"
        f"处理入口：{SITE_URL}/admin.html 第三个页签「审核和举报中心」\n"
        "这些内容已经先发布出去了，看着不合适就点「清理」，人会当场看到它消失。\n")


def day_key(ts: float) -> int:
    return int((ts + TZ_SHIFT) // 86400)


def day_text(key: int) -> str:
    # day_key() 的产物是"北京时间的第几天"，直接按 UTC 打印就是北京日历上的日期。
    # ⚠️ 不要再减 TZ_SHIFT —— 减了会整体退回前一天（2026-11-04 显示成 11-03）。
    return datetime.fromtimestamp(key * 86400, timezone.utc).strftime("%Y-%m-%d")


# ---------------- NPC 对话：额度、停用、流水（2026-11-06） ----------------
# 口径只有一处：这里算，管理后台只负责画。
NPC_KINDS = {"xbg": "学霸姐", "cmr": "食堂阿姨", "ld": "保安老丁", "agent": "算法哥"}
NPC_DAILY_DEFAULT = 200        # 每人每角色每天提问上限的默认值（后台可改）
NPC_LOG_KEEP_DAYS = 90         # 提问流水保留天数
NPC_LOG_MAX_ROWS = 200000      # 再加一道硬上限，防止一天刷爆

# ---------------- 个人主页：近期动态（2026-11-06） ----------------
ACTIVITY_KINDS = {"cat": ("🐱", "喂了猫"), "run": ("🏃", "乐跑")}
NPC_ICONS = {"xbg": "🎓", "cmr": "🍚", "ld": "🛡️", "agent": "💻"}
ACTIVITY_KEEP_DAYS = 30
ACTIVITY_LIMIT = 30


def log_activity(uid: int, kind: str, text: str):
    """喂猫、乐跑这类没有现成流水的事，单独记一行给主页的动态看。"""
    execute("INSERT INTO mp_activity(user_id,kind,text,day,at) VALUES(?,?,?,?,?)",
            (uid, kind, (text or "")[:80], day_key(time.time()), time.time()))


def prune_activity():
    execute("DELETE FROM mp_activity WHERE at<?", (time.time() - ACTIVITY_KEEP_DAYS * 86400,))


def activity_feed(uid: int, limit: int = ACTIVITY_LIMIT) -> list:
    """一个人最近 30 天的动态：NPC 对话、喂猫、乐跑、留言板发言，按时间倒序。

    NPC 对话只取真正进了模型的（ok/soft），被拦下的尝试不上墙。"""
    since = time.time() - ACTIVITY_KEEP_DAYS * 86400
    items = []
    for r in rows("SELECT kind,text,at FROM mp_npc_chat WHERE user_id=? AND verdict IN ('ok','soft') "
                  "AND at>=? ORDER BY at DESC LIMIT ?", (uid, since, limit)):
        text = (r["text"] or "").strip()
        if text:
            items.append({"at": r["at"], "icon": NPC_ICONS.get(r["kind"], "🤖"),
                          "label": "问了" + npc_kind_name(r["kind"]), "text": text[:60]})
    for r in rows("SELECT kind,text,at FROM mp_activity WHERE user_id=? AND at>=? "
                  "ORDER BY at DESC LIMIT ?", (uid, since, limit)):
        icon, label = ACTIVITY_KINDS.get(r["kind"], ("·", "动态"))
        items.append({"at": r["at"], "icon": icon, "label": label, "text": (r["text"] or "")[:60]})
    for r in rows("SELECT content,created_at FROM mp_announcement WHERE user_id=? AND created_at>=? "
                  "ORDER BY id DESC LIMIT ?", (uid, since, limit)):
        items.append({"at": r["created_at"], "icon": "📣", "label": "发了留言",
                      "text": (r["content"] or "")[:60]})
    items.sort(key=lambda x: x["at"], reverse=True)
    return [{"icon": i["icon"], "label": i["label"], "text": i["text"], "at": now_iso(i["at"])}
            for i in items[:limit]]


# ---------------- 全校动态（2026-11-06） ----------------
# 右上角「📊 动态」面板的四块：算法哥刷题榜（问 Java 要）、食堂阿姨常被问的、
# 学霸姐常被问到的知识点、老丁这几天最多的失物。口径都在这一个函数里。
PULSE_DAYS = 7
CURATED_FOOD = Path("/opt/campus_portal/campus_game_cmr/aunt/data/curated_food.json")
XBG_DB = "/opt/campus_portal/xueba-ge/data/xueba.db"


def _dish_names() -> list:
    try:
        data = json.loads(CURATED_FOOD.read_text(encoding="utf-8"))
        return sorted({str(e.get("dish") or "").strip() for e in data.get("entries", [])
                       if str(e.get("dish") or "").strip()}, key=len, reverse=True)
    except Exception:
        return []


DISH_NAMES = _dish_names()


def _norm_q(text: str) -> str:
    t = re.sub(r"[\s，。！？、,.!?;；:：()（）\[\]【】…]+", "", text or "")
    return t[:30]


def _top_pairs(counter: dict, limit: int = 6) -> list:
    return [{"text": k, "count": v}
            for k, v in sorted(counter.items(), key=lambda kv: (-kv[1], kv[0]))[:limit]]


def cmr_pulse() -> dict:
    """阿姨最近被问最多的话 + 最常出现的菜。菜名从阿姨的菜品库里认，不在库里的不算。"""
    since = time.time() - PULSE_DAYS * 86400
    qs, dishes = {}, {}
    for r in rows("SELECT text FROM mp_npc_chat WHERE kind='cmr' AND verdict IN ('ok','soft') AND at>=?",
                  (since,)):
        raw = (r["text"] or "").strip()
        q = _norm_q(raw)
        if q:
            qs[q] = qs.get(q, 0) + 1
        for name in DISH_NAMES:
            if name in raw:
                dishes[name] = dishes.get(name, 0) + 1
                break
    return {"questions": _top_pairs(qs), "dishes": _top_pairs(dishes)}


def xbg_pulse() -> dict:
    """学霸姐最近回答引用最多的章节。refs 是每条回答自己带的出处，不推断。"""
    try:
        con = sqlite3.connect("file:%s?mode=ro" % XBG_DB, uri=True)
        con.row_factory = sqlite3.Row
        rs = con.execute("SELECT refs FROM message WHERE role='assistant' AND created_at>=?",
                         (time.time() - PULSE_DAYS * 86400,)).fetchall()
        con.close()
    except Exception:
        return {"points": []}
    counts = {}
    for r in rs:
        try:
            refs = json.loads(r["refs"] or "[]")
        except Exception:
            continue
        seen = set()
        for ref in refs if isinstance(refs, list) else []:
            if not isinstance(ref, dict):
                continue
            name = str(ref.get("section") or ref.get("chapter") or "").strip()
            if not name or "习题" in name or name in seen:
                continue
            seen.add(name)
            counts[name] = counts.get(name, 0) + 1
    return {"points": _top_pairs(counts)}


def ld_pulse() -> dict:
    since = time.time() - PULSE_DAYS * 86400
    return {"items": [{"text": r["item"], "count": r["n"], "lost": r["lost"], "claim": r["claim"]}
                      for r in rows("SELECT item, SUM(kind='lost') AS lost, SUM(kind='claim') AS claim, "
                                    "COUNT(*) AS n FROM mp_pulse_event WHERE at>=? GROUP BY item "
                                    "ORDER BY n DESC LIMIT 6", (since,))]}


def agent_pulse() -> dict:
    """算法哥的刷题榜在 Java 那边（MySQL），这里只转发；他不在也不影响另外三块。"""
    try:
        with urllib.request.urlopen("http://127.0.0.1:8081/api/agent/public/pulse", timeout=2) as r:
            payload = json.loads(r.read().decode("utf-8"))
        data = payload.get("data") or {}
        return {"leaders": data.get("leaders") or [], "recent": data.get("recent") or []}
    except Exception:
        return {"leaders": [], "recent": [], "offline": True}


_PULSE_CACHE = {"at": 0.0, "data": None}


def pulse_payload() -> dict:
    now = time.time()
    if _PULSE_CACHE["data"] and now - _PULSE_CACHE["at"] < 10:
        return _PULSE_CACHE["data"]
    data = {"agent": agent_pulse(), "cmr": cmr_pulse(), "xbg": xbg_pulse(), "ld": ld_pulse(),
            "days": PULSE_DAYS, "updatedAt": now_iso(now)}
    _PULSE_CACHE.update(at=now, data=data)
    return data


def prune_pulse():
    execute("DELETE FROM mp_pulse_event WHERE at<?", (time.time() - 30 * 86400,))


def npc_kind_name(kind: str) -> str:
    return NPC_KINDS.get(kind, kind)


def npc_default_limit() -> int:
    try:
        return max(1, int(setting_get("npc_daily_default", str(NPC_DAILY_DEFAULT))))
    except ValueError:
        return NPC_DAILY_DEFAULT


def npc_user_limit(uid: int, kind: str) -> int:
    """单账号对单角色的每日上限：有单独设过就用它，否则用全局默认。"""
    r = row("SELECT daily FROM mp_npc_limit WHERE user_id=? AND kind=?", (uid, kind))
    return int(r["daily"]) if r and r["daily"] > 0 else npc_default_limit()


def npc_ban_of(uid: int, kind: str):
    """这个账号对这个角色有没有被停用。'*' 优先（停用全部角色）。"""
    now = time.time()
    return row("SELECT * FROM mp_npc_ban WHERE user_id=? AND kind IN (?, '*') "
               "AND (until=0 OR until>?) ORDER BY (kind='*') DESC LIMIT 1", (uid, kind, now))


def npc_today_count(uid: int, kind: str) -> int:
    """今天真正进了模型的提问数。被拦下的（block/banned/quota/rate）不算额度。"""
    return row("SELECT COUNT(*) AS n FROM mp_npc_chat WHERE user_id=? AND kind=? AND day=? "
               "AND verdict IN ('ok','soft')", (uid, kind, day_key(time.time())))["n"]


def npc_log(uid: int, kind: str, text: str, verdict: str):
    execute("INSERT INTO mp_npc_chat(user_id,kind,text,day,at,verdict) VALUES(?,?,?,?,?,?)",
            (uid, kind, (text or "")[:500], day_key(time.time()), time.time(), verdict))


def prune_npc_log():
    execute("DELETE FROM mp_npc_chat WHERE at<?", (time.time() - NPC_LOG_KEEP_DAYS * 86400,))
    n = row("SELECT COUNT(*) AS n FROM mp_npc_chat")["n"]
    if n > NPC_LOG_MAX_ROWS:
        execute("DELETE FROM mp_npc_chat WHERE id IN "
                "(SELECT id FROM mp_npc_chat ORDER BY id ASC LIMIT ?)", (n - NPC_LOG_MAX_ROWS,))


def npc_admin_payload(query: dict) -> dict:
    """管理后台「NPC 对话」页签的全部数据，一次给全。"""
    day = (query.get("day") or [""])[0]
    try:
        target_day = int(day) if day else day_key(time.time())
    except ValueError:
        target_day = day_key(time.time())
    kind = (query.get("kind") or [""])[0]
    q = (query.get("q") or [""])[0].strip()[:40]
    try:
        cap = max(1, min(500, int((query.get("limit") or ["200"])[0])))
    except ValueError:
        cap = 200
    where, args = ["c.day=?"], [target_day]
    if kind in NPC_KINDS:
        where.append("c.kind=?")
        args.append(kind)
    if q:
        where.append("(c.text LIKE ? OR u.nickname LIKE ?)")
        args += ["%" + q + "%", "%" + q + "%"]
    logs = rows("SELECT c.id,c.user_id,u.nickname,c.kind,c.text,c.at,c.verdict FROM mp_npc_chat c "
                "LEFT JOIN mp_user u ON u.id=c.user_id WHERE " + " AND ".join(where) +
                " ORDER BY c.id DESC LIMIT ?", tuple(args) + (cap,))
    usage = rows("SELECT c.user_id,u.nickname,c.kind,COUNT(*) AS n FROM mp_npc_chat c "
                 "LEFT JOIN mp_user u ON u.id=c.user_id WHERE c.day=? AND c.verdict IN ('ok','soft') "
                 "GROUP BY c.user_id,c.kind ORDER BY n DESC", (target_day,))
    limits = {(r["user_id"], r["kind"]): r["daily"] for r in rows("SELECT * FROM mp_npc_limit")}
    now = time.time()
    bans = [r for r in rows("SELECT b.*,u.nickname FROM mp_npc_ban b LEFT JOIN mp_user u ON u.id=b.user_id "
                            "WHERE b.until=0 OR b.until>? ORDER BY b.created_at DESC", (now,))]
    default = npc_default_limit()
    items = []
    for r in usage:
        key = (r["user_id"], r["kind"])
        own = next((b for b in bans if b["user_id"] == r["user_id"] and b["kind"] in (r["kind"], "*")), None)
        items.append({"userId": r["user_id"], "nickname": r["nickname"] or ("#" + str(r["user_id"])),
                      "kind": r["kind"], "kindName": npc_kind_name(r["kind"]), "used": r["n"],
                      "limit": limits.get(key) or default, "custom": bool(limits.get(key)),
                      "banned": bool(own), "banKind": own["kind"] if own else "",
                      "banUntil": own["until"] if own else 0,
                      "banReason": own["reason"] if own else ""})
    stats = {
        "day": day_text(target_day),
        "total": sum(i["used"] for i in items),
        "users": len({i["userId"] for i in items}),
        "blocked": row("SELECT COUNT(*) AS n FROM mp_npc_chat WHERE day=? AND verdict='block'",
                       (target_day,))["n"],
        "banned": len(bans),
        "default": default,
    }
    return {
        "stats": stats,
        "logs": [{"id": r["id"], "userId": r["user_id"], "nickname": r["nickname"] or ("#" + str(r["user_id"])),
                  "kind": r["kind"], "kindName": npc_kind_name(r["kind"]), "text": r["text"],
                  "at": now_iso(r["at"]), "verdict": r["verdict"]} for r in logs],
        "usage": items,
        "bans": [{"userId": b["user_id"], "nickname": b["nickname"] or ("#" + str(b["user_id"])),
                  "kind": b["kind"], "kindName": "全部角色" if b["kind"] == "*" else npc_kind_name(b["kind"]),
                  "until": b["until"], "reason": b["reason"], "by": b["created_by"],
                  "at": now_iso(b["created_at"])} for b in bans],
        "kinds": [{"key": k, "name": v} for k, v in NPC_KINDS.items()],
    }


def stamp_text(ts) -> str:
    if not ts:
        return ""
    return datetime.fromtimestamp(float(ts) + TZ_SHIFT, timezone.utc).strftime("%Y-%m-%d %H:%M")


def client_ip(handler) -> str:
    """后台要显示的登录 IP。大厅前面可能挂着 nginx，那样 peer 永远是 127.0.0.1，
    所以只有"确实是从本机来的"才信 X-Forwarded-For（直连时伪造不了）。"""
    addr = handler.client_address[0] if handler.client_address else ""
    forwarded = handler.headers.get("X-Forwarded-For", "")
    if addr in ("127.0.0.1", "::1", "::ffff:127.0.0.1") and forwarded:
        # ⚠️ 必须取最后一项，不能取第一项。nginx 用的是 $proxy_add_x_forwarded_for，
        # 它把客户端自己发的 XFF 原样留在前面、把真实对端追加在最后。取第一项的话，
        # 攻击者只要自报 "X-Forwarded-For: <管理员IP>" 就能冒充白名单、绕过封禁。
        addr = forwarded.split(",")[-1].strip() or addr
    return addr


def ws_ip(ws) -> str:
    """联机那条连接上的客户端 IP。跟 client_ip() 一个规矩：确实是本机来的才信转发头。"""
    peer = ""
    try:
        peer = (ws.remote_address[0] if ws.remote_address else "") or ""
    except Exception:
        peer = ""
    forwarded = ""
    try:
        forwarded = ws.request.headers.get("X-Forwarded-For", "") or ""
    except Exception:
        forwarded = ""
    if peer in ("127.0.0.1", "::1", "::ffff:127.0.0.1") and forwarded:
        return forwarded.split(",")[-1].strip() or peer
    return forwarded.split(",")[-1].strip() if forwarded and not peer else peer


def close_stale_plays():
    """重启会把"还在玩"的那一段永远挂在那儿（ended_at 为空）。
    启动时按最后一次在线心跳补个结束时间，补不上的就按开始时间收尾 —— 宁短勿长。"""
    # 上限 12 小时：一段联机不该比这更长，防止某个号的心跳比这段游玩新得多时把时长算爆。
    execute("UPDATE mp_play SET ended_at = MIN(started_at + 43200, MAX(started_at, COALESCE("
            "(SELECT MAX(last_seen) FROM mp_presence WHERE mp_presence.user_id = mp_play.user_id), started_at))) "
            "WHERE ended_at IS NULL")


def record_login(user_id: int, ip: str):
    execute("INSERT INTO mp_login_log(user_id,at,ip) VALUES(?,?,?)", (user_id, time.time(), ip))


def remember_password(user_id: int, password: str):
    """【2026-11-05 停用】以前把明文口令存进 mp_user_secret，好让后台"找回密码"。
    但整个库一旦泄露就是全站口令裸奔，风险远大于这点便利，已停用：不再写入。
    函数名和调用点（注册、登录）保留不动，省得漏改。历史数据由部署脚本一并清掉。"""
    return


# ---------------- WAF（CrowdSec）对接（2026-11-05） ----------------
# CrowdSec 的本地 API 只听 127.0.0.1:8080，用 bouncer 级别的 key 只能读决策、
# 不能改配置，所以把 key 给网站进程是安全的。key 存在 /etc/campus-portal/app.env。
CROWDSEC_KEY = os.environ.get("MP_CROWDSEC_KEY", "").strip()
CROWDSEC_HOST = os.environ.get("MP_CROWDSEC_HOST", "127.0.0.1")
CROWDSEC_PORT = int(os.environ.get("MP_CROWDSEC_PORT", "8080"))


DUR_PART = re.compile(r"(\d+(?:\.\d+)?)(h|ms|m|s|us|ns)")
_DUR_UNIT = {"h": 3600.0, "m": 60.0, "s": 1.0, "ms": 1e-3, "us": 1e-6, "ns": 1e-9}

# 社区情报黑名单有一万多条，每次翻页都拉一遍太重；缓 10 分钟，后台线程去取。
CAPI_CACHE = {"ts": 0.0, "count": 0, "busy": False}
CAPI_LOCK = threading.Lock()


def _secs_left(d):
    """算这条决策还剩多久。CrowdSec 给的是 Go 风格时长串（3h51m44.2s），
    有的版本给 until 时间戳；两种都认，认不出就返回 None（前端显示"永久"）。"""
    dur = d.get("duration")
    if dur:
        total, hit = 0.0, False
        for num, unit in DUR_PART.findall(str(dur)):
            total += float(num) * _DUR_UNIT.get(unit, 0.0)
            hit = True
        if hit:
            return int(total)
    for key in ("until", "expiration"):
        text = d.get(key)
        if not text:
            continue
        try:
            dt = datetime.fromisoformat(str(text).replace("Z", "+00:00"))
            return max(0, int(dt.timestamp() - time.time()))
        except Exception:
            continue
    return None


def _capi_fetch(timeout=25):
    """取社区情报条数，结果丢进缓存。"""
    try:
        conn = http.client.HTTPConnection(CROWDSEC_HOST, CROWDSEC_PORT, timeout=timeout)
        conn.request("GET", "/v1/decisions?origins=CAPI,lists,console", headers={"X-Api-Key": CROWDSEC_KEY})
        resp = conn.getresponse()
        body = resp.read(64 * 1024 * 1024)
        conn.close()
        if resp.status in (200, 204):
            data = json.loads(body or b"null") or []
            with CAPI_LOCK:
                CAPI_CACHE["count"] = len(data) if isinstance(data, list) else 0
                CAPI_CACHE["ts"] = time.time()
    except Exception:
        pass
    finally:
        with CAPI_LOCK:
            CAPI_CACHE["busy"] = False


def _capi_count():
    """返回缓存的社区情报条数，顺手在过期时叫醒后台线程。

    进程刚起、一次都还没取过时同步取一回（限 6 秒），否则后台第一页会显示
    "社区 0 个"，看着像没生效。取过一次之后就全是缓存，不再卡页面。
    """
    with CAPI_LOCK:
        need_sync = not CAPI_CACHE["ts"] and not CAPI_CACHE["busy"]
        if need_sync:
            CAPI_CACHE["busy"] = True
        elif time.time() - CAPI_CACHE["ts"] > 600 and not CAPI_CACHE["busy"]:
            CAPI_CACHE["busy"] = True
            threading.Thread(target=_capi_fetch, daemon=True).start()
    if need_sync:
        _capi_fetch(timeout=6)      # 注意：必须在锁外面调，它结尾自己会去拿这把锁
    with CAPI_LOCK:
        return CAPI_CACHE["count"]


def waf_payload():
    """后台"网络安全"页要的 WAF 数据。没装/没配 key 时返回 installed=False，前端照常显示。

    ⚠️ 只查 origins=crowdsec,cscli（本机自己抓的、手动加的）。社区情报那 1.5 万条
    是全网黑名单，跟我们站点没关系，塞进表格既看不清也拖慢页面，只报个数。
    ⚠️ LAPI 的 limit 参数不生效（实测传 limit=5 仍返回全部），所以必须靠 origins 收窄。
    """
    out = {"installed": bool(CROWDSEC_KEY), "running": False, "count": 0,
           "community": 0, "decisions": [], "error": ""}
    if not CROWDSEC_KEY:
        return out
    out["community"] = _capi_count()
    try:
        conn = http.client.HTTPConnection(CROWDSEC_HOST, CROWDSEC_PORT, timeout=4)
        conn.request("GET", "/v1/decisions?origins=crowdsec,cscli", headers={"X-Api-Key": CROWDSEC_KEY})
        resp = conn.getresponse()
        body = resp.read(4 * 1024 * 1024)
        conn.close()
        if resp.status == 204:          # 204 = 当前一条决策都没有，这是正常状态
            out["running"] = True
            return out
        if resp.status != 200:
            out["error"] = "WAF 接口返回 %d" % resp.status
            return out
        data = json.loads(body or b"null") or []
        items = []
        for d in data:
            items.append({
                "ip": d.get("value", ""),
                "reason": d.get("scenario", ""),
                "origin": d.get("origin", ""),
                "left": _secs_left(d),
                "action": d.get("type", "ban"),
                "scope": d.get("scope", "Ip"),
            })
        # 归属地走本地离线库，一次批量查完；库里没有的国家/运营商就空着
        regions = geo_regions([x["ip"] for x in items])
        for x in items:
            x["region"] = regions.get(x["ip"], "")
        # 快过期的排前面，后台一眼看到马上要解封的
        items.sort(key=lambda x: (x["left"] is None, x["left"] if x["left"] is not None else 0))
        out.update(running=True, decisions=items, count=len(items))
    except Exception as exc:
        out["error"] = str(exc)[:100]
    return out


def ban_message(banned_until: float) -> str:
    if banned_until >= BAN_FOREVER:
        return "该账号已被封禁，请联系管理员"
    return f"该账号封禁至 {stamp_text(banned_until)}，时间到之后才能登录"


# ---------------- 审核与举报（2026-11-06） ----------------
# 口径：先发布、后审核。内容照常进库、照常显示，同时往 mp_review 记一行。
# 管理员在「审核和举报中心」里通过（什么都不用做）或清理（真删）。

REVIEW_KINDS = {"announce": "留言板", "bld_comment": "楼宇留言", "bld_photo": "楼宇照片"}


def blocked_ids(user_id: int) -> list:
    return [r["target_id"] for r in rows("SELECT target_id FROM mp_block WHERE user_id=?", (user_id,))]


def is_muted(user_id: int) -> bool:
    info = row("SELECT muted_until FROM mp_user WHERE id=?", (user_id,))
    return bool(info and info["muted_until"] and info["muted_until"] > time.time())


def mute_message(muted_until: float) -> str:
    if muted_until >= BAN_FOREVER:
        return "你已被禁言，暂时不能发消息、留言和传照片，可以浏览别人的内容"
    return f"你被禁言到 {stamp_text(muted_until)}，这期间不能发私聊、留言和传照片"


def push_review(kind: str, ref_id: int, user_id: int, ip: str, content: str, extra: str = ""):
    """先发布后审核：内容落库的同时记一条待审记录，后台据此排队。"""
    execute("INSERT INTO mp_review(kind,ref_id,user_id,ip,content,extra,status,created_at) VALUES(?,?,?,?,?,?,0,?)",
            (kind, int(ref_id), int(user_id), ip or "", (content or "")[:600], (extra or "")[:60], time.time()))
    try:
        who = row("SELECT nickname FROM mp_user WHERE id=?", (int(user_id),))
        where = REVIEW_KINDS.get(kind, kind)
        if kind in ("bld_comment", "bld_photo") and extra:
            where += "·" + (BLD_NAMES.get(extra) or extra)
        text = (content or "").replace("\n", " ")[:120]
        notify_moderation(f"[{where}] {(who['nickname'] if who else '（未知）')}"
                          f"（{ip or 'IP 未知'}） {stamp_text(time.time())}\n    {text}")
    except Exception as exc:      # 发信出问题不能拖累发布
        print(f"[alert] 待审提醒没排上：{exc}")


def _review_dict(r) -> dict:
    u = row("SELECT nickname,muted_until,banned_until FROM mp_user WHERE id=?", (r["user_id"],)) if r["user_id"] else None
    return {"id": r["id"], "kind": r["kind"], "kindName": REVIEW_KINDS.get(r["kind"], r["kind"]),
            "refId": r["ref_id"], "userId": r["user_id"],
            "nickname": (u["nickname"] if u else "（已删号）"),
            "muted": bool(u and u["muted_until"] > time.time()),
            "banned": bool(u and u["banned_until"] > time.time()),
            "ip": r["ip"] or "", "content": r["content"] or "", "extra": r["extra"] or "",
            "bldName": BLD_NAMES.get(r["extra"], r["extra"] or ""),
            "status": r["status"], "createdAt": stamp_text(r["created_at"]),
            "reviewedAt": stamp_text(r["reviewed_at"]) if r["reviewed_at"] else "",
            "reviewer": r["reviewer"] or "",
            # 照片要能直接看缩略图：content 里存的就是相对 ROOT 的路径
            "image": r["content"] if r["kind"] == "bld_photo" else ""}


def _report_dict(r) -> dict:
    rep = row("SELECT nickname FROM mp_user WHERE id=?", (r["reporter_id"],))
    tgt = row("SELECT nickname,muted_until,banned_until FROM mp_user WHERE id=?", (r["target_id"],))
    return {"id": r["id"], "reporterId": r["reporter_id"], "targetId": r["target_id"],
            "reporter": rep["nickname"] if rep else "（已删号）",
            "target": tgt["nickname"] if tgt else "（已删号）",
            "muted": bool(tgt and tgt["muted_until"] > time.time()),
            "banned": bool(tgt and tgt["banned_until"] > time.time()),
            "msgId": r["msg_id"], "kind": r["kind"], "content": r["content"] or "",
            "reason": r["reason"] or "", "ip": r["ip"] or "", "status": r["status"],
            "createdAt": stamp_text(r["created_at"]),
            "handledAt": stamp_text(r["handled_at"]) if r["handled_at"] else "",
            "handler": r["handler"] or "", "action": r["action"] or ""}


def review_payload() -> dict:
    pending = [_review_dict(r) for r in rows("SELECT * FROM mp_review WHERE status=0 ORDER BY id DESC LIMIT 200")]
    handled = [_review_dict(r) for r in rows("SELECT * FROM mp_review WHERE status<>0 ORDER BY id DESC LIMIT 100")]
    reports = [_report_dict(r) for r in rows("SELECT * FROM mp_report WHERE status=0 ORDER BY id DESC LIMIT 200")]
    report_handled = [_report_dict(r) for r in rows("SELECT * FROM mp_report WHERE status<>0 ORDER BY id DESC LIMIT 100")]
    return {"pending": pending, "handled": handled, "reports": reports,
            "reportHandled": report_handled,
            "counts": {"pending": len(pending), "reports": len(reports)}}


def notify_all(payload: dict):
    """内容被清理时广播一枪，开着的页面立刻把它拿掉，不用等刷新。"""
    loop = event_loop
    if not loop:
        return
    try:
        loop.call_soon_threadsafe(lambda: asyncio.create_task(broadcast(payload, list(active.values()))))
    except RuntimeError:
        pass


def review_mark(rev_id: int, status: int, admin_name: str):
    execute("UPDATE mp_review SET status=?,reviewed_at=?,reviewer=? WHERE id=?",
            (status, time.time(), admin_name, rev_id))


def review_remove(rev_id: int, admin_name: str) -> dict:
    """清理一条被否掉的内容：真删，删完广播。照片连文件一起删。"""
    rev = row("SELECT * FROM mp_review WHERE id=?", (rev_id,))
    if not rev:
        raise ValueError("没有这条待审记录")
    kind, ref_id = rev["kind"], rev["ref_id"]
    if kind == "announce":
        execute("DELETE FROM mp_announcement WHERE id=?", (ref_id,))
        notify_all({"type": "announce.remove", "id": ref_id})
    elif kind == "bld_comment":
        execute("DELETE FROM mp_bld_comment WHERE id=?", (ref_id,))
        notify_all({"type": "bld.remove", "bld": rev["extra"], "kind": "comment", "id": ref_id})
    elif kind == "bld_photo":
        photo = row("SELECT file FROM mp_bld_photo WHERE id=?", (ref_id,))
        execute("DELETE FROM mp_bld_photo WHERE id=?", (ref_id,))
        if photo and photo["file"]:
            try:
                (ROOT / photo["file"]).unlink()
            except OSError:
                pass      # 文件已经被手工删过，不要因为少一个文件让整个操作失败
        notify_all({"type": "bld.remove", "bld": rev["extra"], "kind": "photo", "id": ref_id})
    else:
        raise ValueError("这种内容不会自动删，请手动处理")
    review_mark(rev_id, 2, admin_name)
    return {"ok": True, "review": review_payload()}


def require_admin(handler):
    """先过普通登录，再看 mp_user.is_admin。两关都过才返回 user。"""
    user = handler.auth()
    info = row("SELECT is_admin FROM mp_user WHERE id=?", (user["id"],))
    if not info or not info["is_admin"]:
        raise PermissionError("需要管理员账号")
    return user


def admin_stats(days: int = 7) -> dict:
    """最近 days 天的日活。日活 = 当天登录过或联机玩过的人（同一个号一天只算一次）。"""
    now = time.time()
    today = day_key(now)
    keys = [today - i for i in range(days - 1, -1, -1)]
    start = keys[0] * 86400 - TZ_SHIFT

    admins = {r["id"] for r in rows("SELECT id FROM mp_user WHERE is_admin=1")}
    played = {key: set() for key in keys}          # 当天开始玩过
    finished = {key: set() for key in keys}        # 当天结束过一段游玩
    logged = {key: set() for key in keys}
    for r in rows("SELECT user_id,at FROM mp_login_log WHERE at>=?", (start,)):
        k = day_key(r["at"])
        if k in logged and r["user_id"] not in admins:
            logged[k].add(r["user_id"])
    for r in rows("SELECT user_id,started_at,ended_at FROM mp_play WHERE started_at>=? OR ended_at>=?", (start, start)):
        if r["user_id"] in admins:
            continue
        if r["started_at"] >= start:
            k = day_key(r["started_at"])
            if k in played:
                played[k].add(r["user_id"])
        if r["ended_at"] and r["ended_at"] >= start:
            k = day_key(r["ended_at"])
            if k in finished:
                finished[k].add(r["user_id"])

    apps = {key: {name: set() for name in APP_KEYS} for key in keys}
    for r in rows("SELECT user_id,app,at FROM mp_app_log WHERE at>=?", (start,)):
        k = day_key(r["at"])
        if k in apps and r["app"] in apps[k] and r["user_id"] not in admins:
            apps[k][r["app"]].add(r["user_id"])

    series = []
    for key in keys:
        dau = logged[key] | played[key]
        series.append({"date": day_text(key), "dau": len(dau), "played": len(played[key]),
                       "finished": len(finished[key]), "logged": len(logged[key])})
    app_series = {key_name: [{"date": day_text(key), "value": len(apps[key][key_name])}
                             for key in keys]
                  for key_name in APP_KEYS}
    return {"days": days, "series": series, "apps": app_series,
            "apps_meta": [{"key": k, "name": v} for k, v in APP_KEYS.items()]}


def admin_users() -> list:
    now = time.time()
    result = []
    for u in rows("SELECT id,nickname,is_admin,banned_until,ban_reason,muted_until,mute_reason,created_at FROM mp_user ORDER BY id"):
        last = row("SELECT at,ip FROM mp_login_log WHERE user_id=? ORDER BY at DESC LIMIT 1", (u["id"],))
        play = row("SELECT MAX(ended_at) AS last_end, SUM(COALESCE(ended_at,?)-started_at) AS secs, COUNT(*) AS n FROM mp_play WHERE user_id=?", (now, u["id"]))
        secret = row("SELECT 1 AS ok FROM mp_user_secret WHERE user_id=?", (u["id"],))
        banned_until = u["banned_until"] or 0
        muted_until = u["muted_until"] or 0
        result.append({
            "id": u["id"], "nickname": u["nickname"], "admin": bool(u["is_admin"]),
            "createdAt": stamp_text(u["created_at"]) if u["created_at"] else "",
            "lastLoginAt": stamp_text(last["at"]) if last else "",
            "lastLoginIp": (last["ip"] if last else "") or "",
            "lastPlayEnd": stamp_text(play["last_end"]) if play and play["last_end"] else "",
            "playSeconds": int(play["secs"] or 0) if play else 0,
            "playCount": int(play["n"] or 0) if play else 0,
            "online": u["id"] in active,
            "hasPassword": bool(secret),
            "banned": banned_until > now,
            "bannedUntil": stamp_text(banned_until) if banned_until > now else "",
            "banForever": banned_until >= BAN_FOREVER,
            "banReason": u["ban_reason"] or "",
            "muted": muted_until > now,
            "mutedUntil": stamp_text(muted_until) if muted_until > now else "",
            "muteForever": muted_until >= BAN_FOREVER,
            "muteReason": u["mute_reason"] or "",
        })
    return result


def seed_admin():
    """建管理员账号。已经有同名账号就只把它标成管理员，绝不覆盖密码。"""
    existing = row("SELECT id FROM mp_user WHERE nickname=?", (ADMIN_NICK,))
    if existing:
        execute("UPDATE mp_user SET is_admin=1 WHERE id=?", (existing["id"],))
        return
    if not ADMIN_PASS:
        print("[admin] 没配 MP_ADMIN_PASS，跳过管理员建号（已有账号不受影响）")
        return
    salt = secrets.token_bytes(16)
    digest = hashlib.scrypt(ADMIN_PASS.encode(), salt=salt, n=16384, r=8, p=1)
    with lock:
        cur = db.execute("INSERT INTO mp_user(nickname,salt,password_hash,is_admin,created_at,name_key) VALUES(?,?,?,?,?,?)",
                         (ADMIN_NICK, salt, digest, 1, time.time(), nickname_key(ADMIN_NICK)))
        db.execute("INSERT INTO mp_player(user_id,look_json) VALUES(?,?)", (cur.lastrowid, json.dumps(DEFAULT_LOOK)))
        db.execute("INSERT INTO mp_npc_secret(user_id,secret) VALUES(?,?)", (cur.lastrowid, secrets.token_bytes(32)))
    remember_password(cur.lastrowid, ADMIN_PASS)


# ---------------------------------------------------------------------------
# 每日任务（2026-11-04）
#   一天两份猫粮，来源只有两个：
#     ① 当天第一次进来（登录或带旧票自动登录）送一份；
#     ② 在新体育馆旁边那个操场跑满五圈，再送一份。
#   喂猫要扣一份 ⇒ "喂"这件事必须由服务端记账，客户端只说"我要喂"。
#   圈数也在服务端验：客户端只发"我过了一圈"，服务端拿自己攒的位移、两圈间隔、
#   以及当时人是不是在操场里核对 —— 改前端代码骗不来猫粮。
# ---------------------------------------------------------------------------
RUN_GOAL = 5                    # 跑满几圈算一次乐跑
RUN_MAX_LAPS = 20               # 一天最多记 20 圈，防止脚本一直刷
RUN_MIN_LAP_SECONDS = 5.0       # 一圈最少 5 秒（跑道一圈约 1780 像素，正常跑要 9 秒）
RUN_MIN_MOVE = 600.0            # 一圈最少走 600 像素
RUN_ZONE = (423.0, 152.0, 828.0, 898.0)   # 操场的包围盒（世界像素），外扩 80 像素再判
DAILY_MAX_FOOD = 2


def daily_row(user_id: int, day: int | None = None) -> dict:
    day = day_key(time.time()) if day is None else day
    with lock:
        db.execute("INSERT OR IGNORE INTO mp_daily(user_id,day) VALUES(?,?)", (user_id, day))
    return dict(row("SELECT * FROM mp_daily WHERE user_id=? AND day=?", (user_id, day)))


def daily_grant(user_id: int, kind: str) -> None:
    """发一份粮。重复调用不会多发（记的是"发过没有"，不是余额）。"""
    column = {"login": "login_food", "run": "run_food"}[kind]
    day = day_key(time.time())
    daily_row(user_id, day)
    execute(f"UPDATE mp_daily SET {column}=1 WHERE user_id=? AND day=?", (user_id, day))


def daily_state(user_id: int) -> dict:
    r = daily_row(user_id)
    return {"day": day_text(r["day"]), "loginFood": bool(r["login_food"]), "runFood": bool(r["run_food"]),
            "foodUsed": r["food_used"], "foodMax": DAILY_MAX_FOOD,
            "foodLeft": max(0, r["login_food"] + r["run_food"] - r["food_used"]),
            "laps": r["laps"], "goal": RUN_GOAL}


def daily_use_food(user_id: int) -> bool:
    """喂猫前扣一份。不够就一份都不扣（不是扣成负数）。"""
    r = daily_row(user_id)
    if r["login_food"] + r["run_food"] - r["food_used"] <= 0:
        return False
    execute("UPDATE mp_daily SET food_used=food_used+1 WHERE user_id=? AND day=?", (user_id, r["day"]))
    return True


def in_run_zone(x: float, y: float) -> bool:
    return RUN_ZONE[0] - 80 <= x <= RUN_ZONE[2] + 80 and RUN_ZONE[1] - 80 <= y <= RUN_ZONE[3] + 80


# ---------------------------------------------------------------------------
# 网络安全（后台第二个页签，2026-11-04）
#   能做的：看清谁在敲门、把敲门的人挡在外面、流量突然暴涨时自动挡。
#   做不了的：关掉服务器的系统端口（22/80/5432…）。那些要 root，而且关掉 22 就再也
#             连不上这台机器了 —— 后台只**显示**它们，并向你说明为什么不能动。
#             我们能真正"关"的只有自己的 3000/8090，方式是"维护模式"（对外 503，管理员照进）。
# ---------------------------------------------------------------------------
IP_RE = re.compile(r"^(?:\d{1,3}\.){3}\d{1,3}$|^[0-9a-fA-F:]{3,45}$")
SCAN_RE = re.compile(r"\.env|\.git|wp-(admin|login|content)|phpmyadmin|adminer|\.php|/etc/passwd|"
                     r"\.DS_Store|/config\.json|/backup|/\.svn|/vendor/|xmlrpc|/\.aws|/actuator", re.I)
# 常用的端口 → 服务名。只用来在界面上写清楚"这一行是谁"，判断依据是端口号本身。
PORT_NAMES = {22: "SSH 远程登录", 80: "HTTP（nginx）", 443: "HTTPS", 3000: "校园大厅（本服务·页面）",
              8090: "校园大厅（本服务·联机）", 5432: "PostgreSQL", 3307: "MySQL", 3001: "算法哥前端",
              3080: "nginx", 8010: "学霸姐", 8000: "保安老丁", 8020: "食堂阿姨", 8080: "其他 Web 服务",
              6379: "Redis", 27017: "MongoDB"}
SEC_LOG_KEEP_DAYS = 7
SEC_RATE_WINDOW = 60
SEC_RATE_DEFAULT = 600           # 60 秒内超过这么多请求就算异常（自动封禁默认关着）
SEC_AUTOBAN_SECONDS = 3600

# ---------------- 扫站探测：命中即永久封禁（2026-11-05） ----------------
# 判据只列"正常玩家绝不可能访问"的东西。宁可漏，不可错：
# 手滑打错网址不该被永久封，而 /wp-admin、/.env 这种路径没人会点。
# 目录型特征：后面必须跟斜杠或结尾。曾经的写法允许跟点，结果 /pma.png 这种
# 正常静态图会被当成扫描器 —— 误封一次就是永久，所以这里必须抠死。
SCAN_DIR = re.compile(
    r"(?:^|/)(?:"
    r"wp-admin|wp-content|wp-includes|wp-json"
    r"|phpmyadmin|pma|adminer|myadmin|mysqladmin"
    r"|actuator|jmx-console|druid|nacos|solr|telescope|elasticsearch"
    r"|cgi-bin|boaform|HNAP1|owa|ecp"
    r"|thinkphp|swagger-ui|api-docs|v2/api-docs"
    r"|\.git|\.svn|\.hg|\.aws|\.ssh|\.idea|\.vscode"
    r")(?:/|$|\?)", re.I)
# 文件型特征：精确到文件名，后面可以是斜杠、结尾、问号或点（.env.local 之类）
SCAN_FILE = re.compile(
    r"(?:^|/)(?:"
    r"wp-login\.php|xmlrpc\.php|wlwmanifest\.xml|adminer\.php|swagger-ui\.html"
    r"|autodiscover\.xml|db\.sql|dump\.sql"
    r"|\.env|\.DS_Store"
    r")(?:/|$|\?|\.)", re.I)
# UA 只认"除了扫描器没人会用"的签名。python-requests、Go-http-client 这类
# 正常脚本也在用，不列——把自家监控封了比放过脚本更麻烦。
SCAN_UA = re.compile(
    r"(?:sqlmap|nikto|nuclei|masscan|zgrab|wpscan|acunetix|netsparker|nessus"
    r"|openvas|dirbuster|gobuster|feroxbuster|wfuzz|xray|censys|shodan)", re.I)


def is_local_ip(ip: str) -> bool:
    """本机 / 内网地址永远不封：端口探活、健康检查都在这些地址上跑。"""
    try:
        a = ipaddress.ip_address(str(ip).split(",")[0].strip())
        return a.is_private or a.is_loopback or a.is_link_local
    except Exception:
        return False


def scan_hit(path: str, ua: str) -> str:
    """是不是扫站请求。返回命中说明，空串表示正常。"""
    try:
        if SCAN_DIR.search(path or "") or SCAN_FILE.search(path or ""):
            return "路径 " + (path or "")[:60]
        if ua and SCAN_UA.search(ua):
            return "UA " + ua[:40]
    except Exception:
        pass
    return ""

_log_writes = 0                        # 写了几条请求记录，用来决定什么时候清旧数据
# 密码校验接口对外的调用次数（每 IP 每分钟 30 次）。这个接口会替调用者去问
# 泄露库，不设上限就变成免费的公共查询代理了。
PW_CHECK_PER_MIN = 30
# 验证码：出题和验题各自限流。出题每次都要现画一张图，不限就会被拿来当图床 / 压测。
CAPTCHA_PER_MIN = 12
# 登录失败限流：同一 IP 10 分钟内最多错 7 次，超了先晾着。
# scrypt 本身每次要几十毫秒，但换 IP 并发就能慢慢试，所以按 IP 卡一道。
LOGIN_FAIL_WINDOW = 600
LOGIN_FAIL_LIMIT = 7
# 每一对账号之间的私聊只留最近 200 条，超出的从旧往新删。
# 两个人聊一年也就 200 条，翻不到更早的；换来的是库不会被聊天撑大。
CHAT_KEEP = 200
CAPTCHA_VERIFY_PER_MIN = 20
NICK_CHECK_PER_MIN = 40


def setting_get(key: str, default: str = "") -> str:
    r = row("SELECT v FROM mp_setting WHERE k=?", (key,))
    return r["v"] if r else default


def setting_set(key: str, value: str):
    execute("INSERT INTO mp_setting(k,v) VALUES(?,?) ON CONFLICT(k) DO UPDATE SET v=excluded.v", (key, value))


def maintenance_on() -> bool:
    return setting_get("maintenance", "0") == "1"


def autoban_threshold() -> int:
    try:
        return int(setting_get("autoban_threshold", str(SEC_RATE_DEFAULT)))
    except ValueError:
        return SEC_RATE_DEFAULT


def autoban_on() -> bool:
    return setting_get("autoban", "0") == "1"


def ip_ban_of(ip: str):
    """返回生效中的封禁记录（until=0 表示永久），没有就返回 None。"""
    r = row("SELECT * FROM mp_ip_ban WHERE ip=?", (ip,))
    if not r:
        return None
    if r["until"] and r["until"] <= time.time():
        return None
    return r


def note_hit(ip: str) -> int:
    """记一次敲门，返回这一分钟内该 IP 的次数。

    以前是进程内一个 list；现在交给 rate_store：有 Redis 就走 ZSET 滑窗，
    没有就自动退回内存。计数不落业务库，重启后归零也无所谓。
    """
    return rate_store.hit("req:" + ip, SEC_RATE_WINDOW)[0]


GEO_DB = ROOT / "mp" / "ip2region_v4.xdb"   # 离线归属地库（ip2region v4，约 11 MB）
_geo_db = None                                # mmap 进来的库；第一次用的时候才读
_geo_lock = threading.Lock()


def is_private_ip(ip: str) -> bool:
    try:
        a = ipaddress.ip_address(ip)
    except ValueError:
        return True                   # 空串、"未知" 之类，不当公网地址查
    return a.is_private or a.is_loopback or a.is_link_local or a.is_reserved


def _geo_open():
    """把库整块映射进内存（只读）。文件不在就返回 None，后台照常显示，只是没有地区。"""
    global _geo_db
    if _geo_db is not None:
        return _geo_db
    with _geo_lock:
        if _geo_db is None:
            try:
                f = open(GEO_DB, "rb")
            except OSError:
                return None
            try:
                _geo_db = mmap.mmap(f.fileno(), 0, access=mmap.ACCESS_READ)
            finally:
                f.close()
    return _geo_db


def _geo_search(ip: str) -> str:
    """在离线库里查一个 IPv4，返回 "中国|0|山东省|济南市|联通" 这种原始串；查不到回空串。

    库的格式（ip2region xdb）：头部 256 字节 + 512 KB 一级索引 + 段索引 + 数据区。
    一级索引按 IP 前两段取 8 字节（起止指针），段索引每段 14 字节（起 IP 4 + 止 IP 4 + 长度 2 + 数据指针 4），
    两个 IP 字段都是小端存的。"""
    db = _geo_open()
    if db is None:
        return ""
    try:
        a = ipaddress.ip_address(ip)
    except ValueError:
        return ""
    if a.version != 4:
        return ""                      # 这份库只管 IPv4
    n = int(a)
    idx = 256 + (((n >> 24) & 255) * 256 + ((n >> 16) & 255)) * 8
    s_ptr = int.from_bytes(db[idx:idx + 4], "little")
    e_ptr = int.from_bytes(db[idx + 4:idx + 8], "little")
    if not s_ptr or not e_ptr or e_ptr <= s_ptr:
        return ""
    low, high = 0, (e_ptr - s_ptr) // 14
    while low <= high:
        mid = (low + high) >> 1
        ptr = s_ptr + mid * 14
        start = int.from_bytes(db[ptr:ptr + 4], "little")
        end = int.from_bytes(db[ptr + 4:ptr + 8], "little")
        if n < start:
            high = mid - 1
        elif n > end:
            low = mid + 1
        else:
            d_len = int.from_bytes(db[ptr + 8:ptr + 10], "little")
            d_ptr = int.from_bytes(db[ptr + 10:ptr + 14], "little")
            if not d_len or d_ptr + d_len > len(db):
                return ""
            return db[d_ptr:d_ptr + d_len].decode("utf-8", "replace")
    return ""


def geo_region(ip: str) -> str:
    """给列表用：返回 "山东 济南 · 联通" 这种一行字；内网 IP 直接标出来；查不到回空串。"""
    if not ip:
        return ""
    if is_private_ip(ip):
        return "内网 / 本机"
    raw = _geo_search(ip)
    if not raw:
        return ""
    # 库里的字段顺序是「国家|省份|城市|运营商|国家代码」，五段
    parts = (raw.split("|") + [""] * 5)[:5]
    country, prov, city, isp = parts[0], parts[1], parts[2], parts[3]
    empty = ("", "0", "0地区")
    if prov and prov == city:
        prov = ""                     # 直辖市会出"北京 北京"，去掉重复的那个
    if country in ("中国", "0", ""):
        region = " ".join(x for x in (prov, city) if x not in empty)
    else:
        # 境外的库爱把国家名一路重复写进省份和城市（Singapore|Singapore|Singapore），
        # 紧挨着的重复只留一个，否则后台显示成「Singapore Singapore Singapore」
        bits = [x for x in (country, prov, city) if x not in empty]
        region = " ".join(b for i, b in enumerate(bits) if i == 0 or b != bits[i - 1])
    isp = "" if isp in empty else isp
    if not region:
        return isp
    return " · ".join(x for x in (region, isp) if x)


def geo_regions(ips) -> dict:
    return {ip: geo_region(ip) for ip in set(ips) if ip}


def security_log_request(ip: str, path: str, status: int):
    global _log_writes
    execute("INSERT INTO mp_http_log(ip,at,path,status) VALUES(?,?,?,?)", (ip, time.time(), path[:120], status))
    _log_writes += 1
    if _log_writes % 2000 == 0:          # 每 2000 条顺手清一次 7 天前的，不用定时任务
        try:
            prune_security_log()
        except Exception:
            pass


def admin_ips() -> set:
    """管理员账号登录用过的 IP。这些地址一律不许封（手动和自动都不许）——
    封了管理员自己就再也进不来后台了，只能去云控制台救。"""
    try:
        return {r["ip"] for r in rows(
            "SELECT DISTINCT l.ip AS ip FROM mp_login_log l JOIN mp_user u ON u.id=l.user_id "
            "WHERE u.is_admin=1")}
    except Exception:
        return set()


def ban_ip(ip: str, reason: str, seconds: float, auto: int = 0):
    """封一个 IP。seconds<=0 表示永久。已经封过的只是更新原因和时间。"""
    until = 0.0 if seconds <= 0 else time.time() + seconds
    execute("INSERT INTO mp_ip_ban(ip,reason,until,created_at,auto) VALUES(?,?,?,?,?) "
            "ON CONFLICT(ip) DO UPDATE SET reason=excluded.reason,until=excluded.until,auto=excluded.auto",
            (ip, reason[:80], until, time.time(), auto))
    rate_store.reset("req:" + ip)


def unban_ip(ip: str):
    execute("DELETE FROM mp_ip_ban WHERE ip=?", (ip,))


def prune_chat():
    """启动时把历史残留的超额消息清一遍（正常聊天时每条消息进来就会顺手裁）。"""
    try:
        sessions = rows("SELECT session_id, COUNT(*) AS n FROM mp_message GROUP BY session_id HAVING n>?", (CHAT_KEEP,))
        for item in sessions:
            execute("DELETE FROM mp_message WHERE session_id=? AND id <= "
                    "(SELECT id FROM mp_message WHERE session_id=? ORDER BY id DESC LIMIT 1 OFFSET ?)",
                    (item["session_id"], item["session_id"], CHAT_KEEP))
        if sessions:
            print(f"[chat] 清理超额历史：{len(sessions)} 个会话，各留最近 {CHAT_KEEP} 条")
    except Exception as exc:
        print("[chat] 清理历史失败:", exc)


def prune_security_log():
    execute("DELETE FROM mp_http_log WHERE at<?", (time.time() - SEC_LOG_KEEP_DAYS * 86400,))
    execute("DELETE FROM mp_login_fail WHERE at<?", (time.time() - SEC_LOG_KEEP_DAYS * 86400,))
    # 封禁到期的记录顺手清掉（永久封禁的 until=0 保留）
    execute("DELETE FROM mp_ip_ban WHERE until>0 AND until<=?", (time.time(),))
    # 验证码题和票据都是一次性的，过期即无意义
    execute("DELETE FROM mp_captcha WHERE created_at<?", (time.time() - 3600,))
    execute("DELETE FROM mp_captcha_ticket WHERE expires_at<?", (time.time() - 3600,))


PROC_NET = os.environ.get("MP_PROC_NET", "/proc/net")   # 测试时可以换成别的目录


def listen_ports() -> list:
    """从 /proc/net/tcp{,6} 读监听中的端口（不需要 root）。拿不到就返回空表，界面会说明。"""
    found = {}
    for name, family in ((f"{PROC_NET}/tcp", "ipv4"), (f"{PROC_NET}/tcp6", "ipv6")):
        try:
            with open(name, "r", encoding="utf-8") as fh:
                lines = fh.read().splitlines()[1:]
        except OSError:
            continue
        for line in lines:
            parts = line.split()
            if len(parts) < 4 or parts[3] != "0A":      # 0A = LISTEN
                continue
            addr, port_hex = parts[1].split(":")
            port = int(port_hex, 16)
            host = ""
            if family == "ipv4":
                octets = [int(addr[i:i + 2], 16) for i in (6, 4, 2, 0)]
                host = ".".join(str(o) for o in octets)
            else:
                host = "::"
            # 同一个端口会同时出现在 tcp（IPv4）和 tcp6（IPv6）里，按端口合并成一行，
            # 否则界面上 22、80 会各出现两次，看着像开了两个口子。
            item = found.setdefault(port, {"port": port, "hosts": set(), "public": False})
            item["hosts"].add(host)
            if host in ("0.0.0.0", "::"):
                item["public"] = True
    result = []
    for item in found.values():
        port = item["port"]
        hosts = sorted(item["hosts"])
        result.append({"port": port,
                       "host": "0.0.0.0" if item["public"] else (hosts[0] if hosts else ""),
                       "name": PORT_NAMES.get(port, ""),
                       "mine": port in (HTTP_PORT, WS_PORT),
                       "public": item["public"]})
    result.sort(key=lambda x: x["port"])
    return result


def security_payload() -> dict:
    now = time.time()
    start24 = now - 86400
    # 哪几个 IP 是管理员自己登录用过的：后台要在它们后面标一颗「管理员本人」，
    # 不然自己验个漏洞、试个接口，也跟外面的扫描器混在一张表里分不清。
    mine_ips = admin_ips()
    series, buckets = [], {}
    for r in rows("SELECT at FROM mp_http_log WHERE at>=?", (start24,)):
        key = int((r["at"] + TZ_SHIFT) // 3600)
        buckets[key] = buckets.get(key, 0) + 1
    today_hour = int((now + TZ_SHIFT) // 3600)
    for key in range(today_hour - 23, today_hour + 1):
        # key*3600 已经是"北京时间的第几个小时"，按 UTC 打印就是北京的钟点。
        # ⚠️ 不要再减 TZ_SHIFT —— 跟 day_text() 同一个坑，减了会整体早 8 小时。
        label = datetime.fromtimestamp(key * 3600, timezone.utc).strftime("%H:00")
        series.append({"hour": label, "value": buckets.get(key, 0)})

    ips = [dict(r) for r in rows(
        "SELECT ip, COUNT(*) AS n, SUM(CASE WHEN status>=400 THEN 1 ELSE 0 END) AS bad, "
        "MAX(at) AS last_at, COUNT(DISTINCT path) AS paths "
        "FROM mp_http_log WHERE at>=? GROUP BY ip ORDER BY n DESC LIMIT 60", (start24,))]
    # 最近一分钟的次数走 rate_store：读的时候顺带剪掉窗口外的，
    # 所以不会再出现"昨晚来过、现在仍显示一个数"的陈旧值。
    for item in ips:
        item["recent"] = rate_store.count("req:" + item["ip"], SEC_RATE_WINDOW)
    # 扫站：只翻最近 3000 条就够了（按 id 倒序走主键，翻多少条是封顶的，
    # 不会因为"最近 24 小时没扫站"就把整张表从头扫一遍）
    scans = rows("SELECT ip, path, at FROM mp_http_log ORDER BY id DESC LIMIT 3000")
    scan_rows = [s for s in scans if s["at"] >= start24 and SCAN_RE.search(s["path"])][:40]
    bans = rows("SELECT * FROM mp_ip_ban ORDER BY created_at DESC")
    fails = rows("SELECT ip, nickname, at FROM mp_login_fail ORDER BY id DESC LIMIT 40")
    fail_top = rows("SELECT ip, COUNT(*) AS n FROM mp_login_fail WHERE at>=? GROUP BY ip ORDER BY n DESC LIMIT 10", (start24,))
    # 归属地：只查这页要显示的这些 IP，读服务器本地的离线库，不外发任何数据
    region_of = geo_regions([r["ip"] for r in ips] + [s["ip"] for s in scan_rows]
                            + [f["ip"] for f in fails] + [b["ip"] for b in bans])

    return {
        "series": series,
        "today": sum(1 for r in rows("SELECT id FROM mp_http_log WHERE at>=?", (int((now + TZ_SHIFT) // 86400) * 86400 - TZ_SHIFT,))),
        "ips": [{"ip": r["ip"], "total": r["n"], "bad": r["bad"], "paths": r["paths"],
                 "recent": r.get("recent", 0), "lastAt": stamp_text(r["last_at"]),
                 "region": region_of.get(r["ip"], ""), "mine": r["ip"] in mine_ips} for r in ips],
        "scans": [{"ip": r["ip"], "path": r["path"], "at": stamp_text(r["at"]),
                   "region": region_of.get(r["ip"], ""), "mine": r["ip"] in mine_ips} for r in scan_rows],
        "bans": [{"ip": b["ip"], "reason": b["reason"], "auto": bool(b["auto"]),
                  "until": "永久" if not b["until"] else stamp_text(b["until"]),
                  "createdAt": stamp_text(b["created_at"]),
                  "region": region_of.get(b["ip"], ""), "mine": b["ip"] in mine_ips} for b in bans],
        "loginFails": [{"ip": r["ip"], "nickname": r["nickname"], "at": stamp_text(r["at"]),
                        "region": region_of.get(r["ip"], ""), "mine": r["ip"] in mine_ips} for r in fails],
        "failTop": [{"ip": r["ip"], "count": r["n"], "region": region_of.get(r["ip"], ""),
                     "mine": r["ip"] in mine_ips} for r in fail_top],
        "ports": listen_ports(),
        "maintenance": maintenance_on(),
        "autoban": autoban_on(),
        "autobanThreshold": autoban_threshold(),
        "now": stamp_text(now),
    }


# ---------------------------------------------------------------------------
# 楼宇主页：照片墙 + 留言（building/ 模块，2026-11-04）
#   照片只收 base64 的 jpeg/png/webp（前端先用 canvas 压到长边 1400），落盘在
#   ROOT/building/photos/，图片本身走静态路由 /building/... 取回。
#   种子照片（第一批“我们上传的”）放在 ROOT/building/seed/，由 seed_building()
#   按 manifest.json 幂等补录 —— 重装/重建库都不会重复插。
# ---------------------------------------------------------------------------
BLD_SLUG_RE = re.compile(r"^[a-z0-9_-]{1,32}$")
# 后台显示"在哪栋楼留的言"时用；前端的 SITES 里有同样的名字，两边必须一致。
BLD_NAMES = {"library": "图书馆", "yifu": "逸夫楼", "kexue": "科学会堂", "jiujiao": "第九教学楼",
             "jixie": "机械楼", "xin": "新体育馆", "tianyou": "天佑会堂"}
BLD_DIR = ROOT / "building"
BLD_PHOTO_DIR = BLD_DIR / "photos"
BLD_SEED_DIR = BLD_DIR / "seed"
BLD_NOTE_MAX = 60
BLD_COMMENT_MAX = 200
BLD_PHOTO_MAX = 200          # 每栋楼最多 200 张
BLD_USER_PHOTO_MAX = 6       # 每人每栋楼最多传 6 张，防止一个人刷满整面墙


def bld_photo_dict(p):
    who = player_of(p["user_id"]) or {"id": p["user_id"], "nickname": "已注销", "look": DEFAULT_LOOK}
    return {"id": p["id"], "url": "/" + p["file"], "note": p["note"], "at": now_iso(p["created_at"]),
            "by": {"id": who["id"], "nickname": who["nickname"], "look": who["look"]}}


def bld_comment_dict(c):
    who = player_of(c["user_id"]) or {"id": c["user_id"], "nickname": "已注销", "look": DEFAULT_LOOK}
    return {"id": c["id"], "content": c["content"], "at": now_iso(c["created_at"]),
            "by": {"id": who["id"], "nickname": who["nickname"], "look": who["look"]}}


def bld_payload(slug):
    photos = rows("SELECT * FROM mp_bld_photo WHERE bld=? ORDER BY id DESC", (slug,))
    comments = rows("SELECT * FROM mp_bld_comment WHERE bld=? ORDER BY id DESC LIMIT 200", (slug,))
    return {"site": slug,
            "photos": [bld_photo_dict(p) for p in photos],
            "comments": [bld_comment_dict(c) for c in comments]}


def save_bld_photo(slug: str, data_url: str) -> str:
    m = re.match(r"^data:image/(jpeg|png|webp);base64,([A-Za-z0-9+/=\s]+)$", data_url or "")
    if not m:
        raise ValueError("只收 jpeg / png / webp 图片")
    try:
        raw = base64.b64decode(m.group(2), validate=True)
    except (ValueError, binascii.Error):
        raise ValueError("图片数据损坏")
    if len(raw) > 3 * 1024 * 1024:
        raise ValueError("图片太大（压缩后上限 3 MB）")
    if len(raw) < 64:
        raise ValueError("图片数据不完整")
    ext, magic = {"jpeg": (".jpg", (b"\xff\xd8\xff",)), "png": (".png", (b"\x89PNG",)),
                  "webp": (".webp", (b"RIFF",))}[m.group(1)]
    if not raw.startswith(magic[0]):
        raise ValueError("图片格式与内容不符")
    BLD_PHOTO_DIR.mkdir(parents=True, exist_ok=True)
    name = f"{slug}-{hashlib.sha1(raw).hexdigest()[:12]}{ext}"
    (BLD_PHOTO_DIR / name).write_bytes(raw)
    return f"building/photos/{name}"


def seed_building():
    """把 building/seed/ 里的首批照片补录进库（幂等，靠 mp_bld_photo.file 唯一键）。
    上传人是一个固定账号「像素校园小编」：密码随机、不对外，只用来挂名。"""
    manifest = BLD_SEED_DIR / "manifest.json"
    if not manifest.is_file():
        return
    try:
        items = json.loads(manifest.read_text(encoding="utf-8"))
    except (OSError, ValueError) as exc:
        print("[building] 种子清单读取失败:", exc)
        return
    with lock:
        u = db.execute("SELECT id FROM mp_user WHERE nickname=?", ("像素校园小编",)).fetchone()
        if not u:
            look = dict(DEFAULT_LOOK, cloth="#b4552f", clothPattern="solid", acc="cap", accColor="#b4552f", hairStyle="short", hairColor="#2b1d16")
            salt = secrets.token_bytes(16)
            cur = db.execute("INSERT INTO mp_user(nickname,salt,password_hash,name_key) VALUES(?,?,?,?)",
                             ("像素校园小编", salt, hashlib.scrypt(secrets.token_hex(16).encode(), salt=salt, n=16384, r=8, p=1), nickname_key("像素校园小编")))
            db.execute("INSERT INTO mp_player(user_id,look_json) VALUES(?,?)", (cur.lastrowid, json.dumps(look, ensure_ascii=False)))
            u = db.execute("SELECT id FROM mp_user WHERE nickname=?", ("像素校园小编",)).fetchone()
        added = 0
        for it in items:
            slug, file = it.get("slug", ""), it.get("file", "")
            if not BLD_SLUG_RE.match(slug) or not file or not (BLD_SEED_DIR / file).is_file():
                continue
            rel = f"building/seed/{file}"
            if db.execute("SELECT 1 FROM mp_bld_photo WHERE file=?", (rel,)).fetchone():
                continue
            db.execute("INSERT INTO mp_bld_photo(bld,user_id,file,note,created_at) VALUES(?,?,?,?,?)",
                       (slug, u["id"], rel, str(it.get("note", ""))[:BLD_NOTE_MAX],
                        float(it.get("at") or time.time())))
            added += 1
        if added:
            print(f"[building] 补录种子照片 {added} 张")


class Handler(BaseHTTPRequestHandler):
    # 维护模式下仍然放行：管理员自己的页面、登录注册（不然管理员也进不来）、健康检查
    MAINT_ALLOW = {"/admin.html", "/mp/admin.js", "/mp/admin.css", "/mp/look.js",
                   "/api/mp/login", "/api/mp/register", "/api/mp/password/check",
                   "/api/mp/captcha", "/api/mp/captcha/verify", "/api/mp/nickname/check",
                   "/api/mp/session", "/api/mp/health", "/favicon.ico"}

    def log_message(self, fmt, *args):
        print("[http] " + fmt % args)
        # 这一行同时干三件事：把请求记进"谁在敲门"、给这个 IP 计一分钟内的次数、
        # 自动封禁开着且次数超线就封。任何一步出错都不许影响正常响应。
        try:
            if fmt.startswith('"%s"') and len(args) >= 2:
                status = int(args[1])
                ip = client_ip(self)
                path = urlsplit(getattr(self, "path", "")).path
                security_log_request(ip, path, status)
                hits = note_hit(ip)
                # 管理员自己登录用过的 IP 不参与自动封禁：自己压测两下把自己封了最冤
                if (autoban_on() and hits == autoban_threshold() and not self.is_admin_request()
                        and ip not in admin_ips()):
                    ban_ip(ip, f"系统自动：{SEC_RATE_WINDOW} 秒内 {hits} 次请求", SEC_AUTOBAN_SECONDS, auto=1)
                    print(f"[security] 自动封禁 {ip}：{hits} 次/分钟")
        except Exception:
            pass

    def end_headers(self):
        # 三个安全响应头，所有响应（包括转发出去的）都带上，成本为零。
        if not getattr(self, "_sec_hdr", False):
            self._sec_hdr = True
            try:
                self.send_header("X-Content-Type-Options", "nosniff")
                self.send_header("X-Frame-Options", "SAMEORIGIN")
                self.send_header("Referrer-Policy", "same-origin")
            except Exception:
                pass
        super().end_headers()

    def is_admin_request(self):
        """这个请求背后是不是管理员。封禁和维护模式都要先问这一句——
        否则管理员把自己 IP 封了、或者开了维护模式，就再也进不去后台了。"""
        try:
            bearer = self.headers.get("Authorization", "")
            token = bearer[7:] if bearer.startswith("Bearer ") else ""
            candidate = token_user(token) if token else None
            if not candidate:
                candidate, _ = self.browser_session()
            if not candidate:
                return False
            info = row("SELECT is_admin FROM mp_user WHERE id=?", (candidate["id"],))
            return bool(info and info["is_admin"])
        except Exception:
            return False

    def drop_connection(self):
        """不回状态码、不回正文，直接把连接掐掉 —— 扫站的连"这里有什么"都问不到。"""
        try:
            self.close_connection = True
            self.connection.close()
        except Exception:
            pass
        return True

    def guard(self):
        """每个请求进门先过这里。返回 True 表示已经答复完了，调用方直接 return。"""
        try:
            path = urlsplit(self.path).path
            ip = client_ip(self)
            # 扫站探测排在所有判断最前面：不等限流触发、不看维护模式，命中一次就永久封。
            # 白名单只有两种人：本机/内网，以及管理员账号登录用过的 IP（admin_ips）。
            # ⚠️ 用户 120.244.109.83 属于后者，别再改成"只豁免带管理员凭证的请求"，
            # 他浏览普通页面时不带凭证，那样照样会被封掉。
            if not is_local_ip(ip) and ip not in admin_ips():
                why = scan_hit(path, self.headers.get("User-Agent", ""))
                if why:
                    ban_ip(ip, "扫站探测：" + why, 0, auto=1)
                    print(f"[security] 永久封禁 {ip}：{why} | {path[:80]}")
                    return self.drop_connection()
            blocked = ip_ban_of(ip)
            maint = maintenance_on()
            if not blocked and not maint:
                return False
            if self.is_admin_request():
                return False
            if blocked:
                left = "" if not blocked["until"] else f"，解封时间 {stamp_text(blocked['until'])}"
                msg = f"这个 IP 已被管理员封禁{left}"
                if path.startswith("/api/"):
                    self.send_json(403, {"error": msg})
                else:
                    self.send_page(403, "<!doctype html><meta charset=utf-8><title>访问被拒绝</title>"
                                        "<body style='font-family:system-ui;background:#1b1430;color:#f6e7c8;"
                                        "display:grid;place-items:center;height:100vh;margin:0;text-align:center'>"
                                        f"<div><h1 style='margin:0 0 8px'>访问被拒绝</h1><p style='color:#b9a98a;margin:0'>{msg}</p></div>")
                return True
            if path in self.MAINT_ALLOW or path.startswith("/api/mp/admin/"):
                return False
            if path.startswith("/api/"):
                self.send_json(503, {"error": "网站正在维护，请稍后再来"})
            else:
                page = ("<!doctype html><meta charset=utf-8><title>维护中</title>"
                        "<body style='font-family:system-ui;background:#1b1430;color:#f6e7c8;"
                        "display:grid;place-items:center;height:100vh;margin:0;text-align:center'>"
                        "<div><h1 style='margin:0 0 8px'>校园正在维护</h1>"
                        "<p style='color:#b9a98a;margin:0'>管理员正在处理，过一会儿再来。</p></div>")
                self.send_page(503, page)
            return True
        except Exception:
            return False

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

    def send_page(self, code, html):
        body = html.encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
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

    def npc_gate(self, kind, user, body):
        """NPC 提问的两道闸。返回 None = 放行，否则返回已经写好的响应。

        1. 限速：每人每角色一分钟 8 次、一天 200 次。挡的不是坏人，是**烧钱**——
           一次提问就是一次模型调用，挂个循环就能把额度跑干。
        2. 体检：把这句话归一化后比对一组"想改我设定"的话术。命中就拦，不进模型。
        """
        uid = int(user["id"]) if user else 0
        name = npc_kind_name(kind)
        ban = npc_ban_of(uid, kind)
        if ban:
            npc_log(uid, kind, "", "banned")
            until = float(ban["until"] or 0)
            tail = "永久停用" if not until else "解禁时间 " + datetime.fromtimestamp(until).strftime("%m-%d %H:%M")
            why = ("（" + ban["reason"] + "）") if ban["reason"] else ""
            return self.send_json(403, {"error": f"管理员已停用你对{name}的提问{why}，{tail}。",
                                        "npcBan": True})
        ok, msg = npc_guard.check_rate(uid, kind)
        if not ok:
            print(f"[npc] 限速 kind={kind} uid={uid}：{msg}")
            npc_log(uid, kind, "", "rate")
            return self.send_json(429, {"error": msg, "retryAfter": 60})
        used, limit = npc_today_count(uid, kind), npc_user_limit(uid, kind)
        if used >= limit:
            npc_log(uid, kind, "", "quota")
            return self.send_json(429, {"error": f"今天已经跟{name}问了 {used} 次，到每日上限（{limit} 次）了，明天再来。",
                                        "npcQuota": True, "limit": limit})
        try:
            data = json.loads(body.decode("utf-8", "replace") or "{}")
        except Exception:
            return None
        text = ""
        for key in ("question", "message", "content", "q"):
            if isinstance(data.get(key), str):
                text = data[key]
                break
        verdict, reason = npc_guard.screen(text)
        if verdict == "block":
            print(f"[npc] 拦下可疑提问 kind={kind} uid={uid} 原文={text[:150]!r}")
            npc_log(uid, kind, text, "block")
            return self.send_json(400, {"error": reason, "blocked": "injection"})
        if verdict == "soft":
            print(f"[npc] 可疑但放行 kind={kind} uid={uid} 信号={reason} 原文={text[:100]!r}")
            npc_log(uid, kind, text, "soft")
        else:
            npc_log(uid, kind, text, "ok")
        return None

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
        kind = next((name for name in ("xbg", "ld", "cmr") if path == "/" + name or path.startswith("/" + name + "/")), "agent")
        with lock:
            permitted = kind in grants.get(digest, set())
        if not permitted and path not in NPC_HEALTH_PATHS:
            return self.send_json(403, {"error": "请从校园地图进入该角色"})
        try:
            size = int(self.headers.get("Content-Length", "0"))
            if size < 0 or size > 20 * 1024 * 1024:
                return self.send_json(413, {"error": "请求体过大"})
            body = self.rfile.read(size) if size else None
            # NPC 转发口的两道闸：先限速（挡烧钱），再体检这句话（挡改设定）。
            # 只对聊天接口做，图片识别、查资料、健康检查这些照旧。
            # 聊天口：三个 Python NPC 是 /<角色>/api/chat，算法哥是 /api/agent/chat。
            chat_path = path.rstrip("/").endswith("/api/chat") or (
                kind == "agent" and path.rstrip("/") == "/api/agent/chat")
            if body and chat_path:
                refused = self.npc_gate(kind, browser_user, body)
                if refused is not None:
                    return refused
            headers = {k: v for k, v in self.headers.items()
                       if k.lower() not in ("connection", "content-length", "transfer-encoding", "host")}
            headers["Host"] = self.headers.get("Host", f"localhost:{HTTP_PORT}") if kind == "cmr" else f"127.0.0.1:{port}"
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
        if self.guard():
            return
        path = urlsplit(self.path).path
        try:
            if path == "/api/mp/look/from-photo":
                return self.send_json(410, {"error": "形象照片只在浏览器处理"})
            if path == "/api/mp/password/check":
                # 前端边打字边问：够不够长、有没有踩常见密码、有没有在泄露库里。
                # 只回分数和提示，不回任何别人的信息。
                ip = client_ip(self)
                _, allowed = rate_store.hit("pw:" + ip, 60, limit=PW_CHECK_PER_MIN)
                if not allowed:
                    return self.send_json(429, {"error": "查得太频繁了，歇一分钟再试"})
                data = self.body()
                pw = str(data.get("password", ""))
                nick = str(data.get("nickname", ""))[:16]
                if len(pw) > 128:
                    raise ValueError("密码太长（上限 128 位）")
                self.send_json(200, password_check(pw, nick))
            elif path == "/api/mp/captcha/verify":
                # 用户松手后把最终位置和拖动轨迹发过来。过关只发一张票，
                # 注册时拿票换账号 —— 同一道题不能反复用，票据也是一次性的。
                ip = client_ip(self)
                _, allowed = rate_store.hit("capv:" + ip, 60, limit=CAPTCHA_VERIFY_PER_MIN)
                if not allowed:
                    return self.send_json(429, {"error": "试得太频繁了，歇一分钟再试"})
                data = self.body()
                cid = str(data.get("id", ""))[:64]
                try:
                    x = float(data.get("x", -9999))
                    spent = float(data.get("spent", 0))
                except (TypeError, ValueError):
                    raise ValueError("验证数据无效")
                challenge = row("SELECT * FROM mp_captcha WHERE id=? AND used=0", (cid,))
                if not challenge or challenge["ip"] != ip:
                    raise ValueError("验证码已失效，换一张")
                execute("UPDATE mp_captcha SET used=1 WHERE id=?", (cid,))
                if time.time() - challenge["created_at"] > captcha_mod.CHALLENGE_TTL:
                    raise ValueError("验证码超时了，换一张")
                passed, why = captcha_mod.check_answer(challenge["target"], x, data.get("trail"), spent)
                if not passed:
                    return self.send_json(400, {"ok": False, "error": why})
                ticket = captcha_mod.new_ticket()
                execute("INSERT INTO mp_captcha_ticket(token,ip,issued_at,expires_at) VALUES(?,?,?,?)",
                        (ticket, ip, time.time(), time.time() + captcha_mod.TICKET_TTL))
                self.send_json(200, {"ok": True, "ticket": ticket})
            elif path == "/api/mp/register":
                data = self.body()
                name, password = str(data.get("nickname", "")).strip(), str(data.get("password", ""))
                if not 2 <= len(name) <= 16 or any(ord(c) < 32 for c in name):
                    raise ValueError("昵称须为 2 至 16 字")
                # 昵称查重按"规范化键"来：ZlK / zlk / ＺＬＫ 算同一个名字。
                if row("SELECT id FROM mp_user WHERE name_key=?", (nickname_key(name),)):
                    raise ValueError("昵称已被使用")
                # 强度不够、或者踩中常见密码 / 泄露密码，直接挡在注册门口。
                # 失败时把第一条原因原样返回，前端直接显示给用户看。
                verdict = password_check(password, name)
                if not verdict["ok"]:
                    raise ValueError("；".join(verdict["issues"][:2]) or "密码太弱，换一个")
                # 验证码票据在昵称、密码都过了之后再核销：前面任何一步不通过，
                # 用户改一下就能重提，不用重新拖一次拼图。
                ip = client_ip(self)
                ticket = row("SELECT * FROM mp_captcha_ticket WHERE token=? AND used=0",
                             (str(data.get("captchaTicket", ""))[:64],))
                if not ticket or ticket["ip"] != ip or ticket["expires_at"] < time.time():
                    raise ValueError("请先完成拖动验证")
                salt = secrets.token_bytes(16)
                digest = hashlib.scrypt(password.encode(), salt=salt, n=16384, r=8, p=1)
                with lock:
                    try:
                        cur = db.execute("INSERT INTO mp_user(nickname,salt,password_hash,created_at,name_key) VALUES(?,?,?,?,?)",
                                         (name, salt, digest, time.time(), nickname_key(name)))
                    except sqlite3.IntegrityError:
                        raise ValueError("昵称已被使用")
                    db.execute("INSERT INTO mp_player(user_id,look_json) VALUES(?,?)", (cur.lastrowid, json.dumps(DEFAULT_LOOK)))
                    db.execute("INSERT INTO mp_npc_secret(user_id,secret) VALUES(?,?)", (cur.lastrowid, secrets.token_bytes(32)))
                    db.execute("UPDATE mp_captcha_ticket SET used=1 WHERE token=?", (ticket["token"],))
                remember_password(cur.lastrowid, password)
                self.send_json(201, {"ok": True})
            elif path == "/api/mp/login":
                data = self.body()
                name, password = str(data.get("nickname", "")).strip(), str(data.get("password", ""))
                ip = client_ip(self)
                # 同一 IP 10 分钟内错够 7 次就先不让试了。成功登录会清零，
                # 所以正常用户偶尔打错两次不会被晾着。
                if rate_store.count("loginfail:" + ip, LOGIN_FAIL_WINDOW) >= LOGIN_FAIL_LIMIT:
                    raise PermissionError("登录失败次数太多，请 10 分钟后再试")
                # 登录也认规范化键：注册时 "ZlK"、登录时打 "zlk" 也能进（键是唯一的，不会串号）
                u = row("SELECT * FROM mp_user WHERE name_key=?", (nickname_key(name),))
                if not u:
                    u = row("SELECT * FROM mp_user WHERE nickname=?", (name,))
                if not u or not hmac.compare_digest(hashlib.scrypt(password.encode(), salt=u["salt"], n=16384, r=8, p=1), u["password_hash"]):
                    # 密码错就记一笔：撞库、猜密码的人会在后台"登录失败"里露头。
                    # 只记 IP 和试的昵称，不记试的密码。
                    try:
                        execute("INSERT INTO mp_login_fail(ip,nickname,at) VALUES(?,?,?)",
                                (ip, name[:32], time.time()))
                    except Exception:
                        pass
                    # 记进限流窗口。用"失败次数"而不是"请求次数"计数：
                    # 连续错 7 次才拦，正常人多半是打错一两次。
                    rate_store.hit("loginfail:" + ip, LOGIN_FAIL_WINDOW)
                    raise PermissionError("昵称或密码错误")
                if u["banned_until"] and u["banned_until"] > time.time():
                    raise PermissionError(ban_message(u["banned_until"]))
                # 管理员一登录就发一封信记下 IP 和时间。放在后台线程里，
                # 邮件服务器慢也不会拖住登录。
                if u["is_admin"]:
                    alert_admin_login(client_ip(self), self.headers.get("User-Agent", ""))
                # 密码只在这两处（注册、登录）是明文，顺手存一份给后台看；
                # 老账号在功能上线前注册的没有这份，后台显示"（旧账号）"。
                remember_password(u["id"], password)
                record_login(u["id"], ip)
                rate_store.reset("loginfail:" + ip)   # 登进来了，把失败计数清掉
                daily_grant(u["id"], "login")       # 每日任务：当天第一次进来送一份猫粮
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
                su = self.auth()
                # 带着旧票进来=自动登录，也算一次"今天来玩过"（日活按人去重，不会灌水）
                record_login(su["id"], client_ip(self))
                daily_grant(su["id"], "login")      # 自动登录同样算"当天第一次进来"
                bearer = self.headers.get("Authorization", "")
                self.send_json(200, {"ok": True},
                               f"mp_session={bearer[7:]}; HttpOnly; SameSite=Strict; Path=/; Max-Age=86400")
            elif path.startswith("/api/mp/building/"):
                rest = path[len("/api/mp/building/"):]
                parts = rest.split("/")
                if len(parts) != 2 or not BLD_SLUG_RE.match(parts[0]) or parts[1] not in ("photo", "comment"):
                    return self.send_json(404, {"error": "接口不存在"})
                slug, action = parts
                u = self.auth()
                mute = row("SELECT muted_until FROM mp_user WHERE id=?", (u["id"],))
                if mute and mute["muted_until"] and mute["muted_until"] > time.time():
                    return self.send_json(403, {"error": mute_message(mute["muted_until"])})
                if action == "photo":
                    data = self.body(limit=5 * 1024 * 1024)
                    note = str(data.get("note", "")).strip()
                    if len(note) > BLD_NOTE_MAX:
                        raise ValueError(f"寄语最多 {BLD_NOTE_MAX} 字")
                    if row("SELECT COUNT(*) AS n FROM mp_bld_photo WHERE bld=?", (slug,))["n"] >= BLD_PHOTO_MAX:
                        raise ValueError("这栋楼的照片墙已经满了")
                    if row("SELECT COUNT(*) AS n FROM mp_bld_photo WHERE bld=? AND user_id=?", (slug, u["id"]))["n"] >= BLD_USER_PHOTO_MAX:
                        raise ValueError(f"每人每栋楼最多传 {BLD_USER_PHOTO_MAX} 张")
                    rel = save_bld_photo(slug, data.get("dataUrl", ""))
                    with lock:
                        cur = db.execute("INSERT INTO mp_bld_photo(bld,user_id,file,note,created_at) VALUES(?,?,?,?,?)",
                                         (slug, u["id"], rel, note, time.time()))
                    push_review("bld_photo", cur.lastrowid, u["id"], client_ip(self), rel, slug)
                    self.send_json(201, bld_payload(slug))
                else:
                    data = self.body()
                    content = str(data.get("content", "")).strip()
                    if not content:
                        raise ValueError("留言不能为空")
                    if len(content) > BLD_COMMENT_MAX:
                        raise ValueError(f"留言最多 {BLD_COMMENT_MAX} 字")
                    last = row("SELECT created_at FROM mp_bld_comment WHERE user_id=? ORDER BY id DESC LIMIT 1", (u["id"],))
                    if last and time.time() - last["created_at"] < 3:
                        raise ValueError("留言太快了，歇三秒再发")
                    with lock:
                        cur = db.execute("INSERT INTO mp_bld_comment(bld,user_id,content,created_at) VALUES(?,?,?,?)",
                                         (slug, u["id"], content, time.time()))
                    push_review("bld_comment", cur.lastrowid, u["id"], client_ip(self), content, slug)
                    self.send_json(201, bld_payload(slug))
            elif path == "/api/mp/app/open":
                # 地图里打开小应用时由 mp/app-track.js 打一枪，只记"谁、哪天、开了哪个"。
                # 缺这个字段一律当无效数据丢掉，不弹错误（前台看不见这一条链路）。
                u = self.auth()
                data = self.body()
                app = str(data.get("app", ""))
                if app not in APP_KEYS:
                    raise ValueError("未知的小应用")
                execute("INSERT INTO mp_app_log(user_id,app,at) VALUES(?,?,?)", (u["id"], app, time.time()))
                self.send_json(200, {"ok": True})
            elif path == "/api/mp/pulse/event":
                # 老丁 iframe 里的挂失/认领；只收物品名和动作，不收人。
                u = self.auth()
                data = self.body()
                kind = str(data.get("kind", ""))
                item = str(data.get("item", "")).strip()[:20]
                if kind not in ("lost", "claim") or not item:
                    raise ValueError("动态数据不对")
                ok, _ = rate_store.hit("pulse:" + str(u["id"]), 60, limit=30)
                if not ok:
                    return self.send_json(429, {"error": "上报太频繁了"})
                execute("INSERT INTO mp_pulse_event(kind,item,at) VALUES(?,?,?)", (kind, item, time.time()))
                self.send_json(200, {"ok": True})
            elif path == "/api/mp/task/feed":
                # 喂猫那一刻扣粮。前端已经在"伸手之前"问过 MPTask.noFood()，
                # 这里再判一次是因为手上可能同时开了两个页面，或者刚把最后一份用掉。
                u = self.auth()
                if not daily_use_food(u["id"]):
                    return self.send_json(409, {"error": "今日猫粮不够了", **daily_state(u["id"])})
                log_activity(u["id"], "cat", "喂了一次猫")
                self.send_json(200, daily_state(u["id"]))
            elif path == "/api/mp/admin/npc/limit":
                require_admin(self)
                data = self.body()
                target = int(data.get("userId", 0))
                kind = str(data.get("kind", ""))
                if kind not in NPC_KINDS:
                    raise ValueError("角色不对")
                if not row("SELECT id FROM mp_user WHERE id=?", (target,)):
                    raise ValueError("没有这个账号")
                daily = int(data.get("daily", 0) or 0)
                if daily < 0:
                    raise ValueError("次数不能是负数")
                if daily == 0:
                    execute("DELETE FROM mp_npc_limit WHERE user_id=? AND kind=?", (target, kind))
                else:
                    execute("INSERT INTO mp_npc_limit(user_id,kind,daily) VALUES(?,?,?) "
                            "ON CONFLICT(user_id,kind) DO UPDATE SET daily=excluded.daily",
                            (target, kind, daily))
                self.send_json(200, {"ok": True, **npc_admin_payload({})})
            elif path == "/api/mp/admin/npc/default":
                require_admin(self)
                try:
                    daily = int(self.body().get("daily", 0) or 0)
                except (TypeError, ValueError):
                    raise ValueError("次数要写数字")
                if not 1 <= daily <= 5000:
                    raise ValueError("默认上限请在 1 到 5000 之间")
                setting_set("npc_daily_default", str(daily))
                self.send_json(200, {"ok": True, "default": npc_default_limit()})
            elif path == "/api/mp/admin/npc/ban":
                admin = require_admin(self)
                data = self.body()
                target = int(data.get("userId", 0))
                kind = str(data.get("kind", "*") or "*")
                if kind != "*" and kind not in NPC_KINDS:
                    raise ValueError("角色不对")
                info = row("SELECT is_admin FROM mp_user WHERE id=?", (target,))
                if not info:
                    raise ValueError("没有这个账号")
                if info["is_admin"]:
                    raise ValueError("不能停管理员账号")
                hours = float(data.get("hours", 0) or 0)
                until = time.time() + hours * 3600 if hours > 0 else 0
                reason = str(data.get("reason", "")).strip()[:60] or "管理员停用"
                execute("INSERT INTO mp_npc_ban(user_id,kind,until,reason,created_by,created_at) "
                        "VALUES(?,?,?,?,?,?) ON CONFLICT(user_id,kind) DO UPDATE SET "
                        "until=excluded.until, reason=excluded.reason, "
                        "created_by=excluded.created_by, created_at=excluded.created_at",
                        (target, kind, until, reason, admin["nickname"], time.time()))
                self.send_json(200, {"ok": True, **npc_admin_payload({})})
            elif path == "/api/mp/admin/npc/unban":
                require_admin(self)
                data = self.body()
                target = int(data.get("userId", 0))
                kind = str(data.get("kind", "*") or "*")
                if kind == "*":
                    execute("DELETE FROM mp_npc_ban WHERE user_id=?", (target,))
                else:
                    execute("DELETE FROM mp_npc_ban WHERE user_id=? AND kind=?", (target, kind))
                self.send_json(200, {"ok": True, **npc_admin_payload({})})
            elif path == "/api/mp/admin/ban":
                require_admin(self)
                data = self.body()
                target = int(data.get("userId", 0))
                mode = str(data.get("mode", "forever"))
                reason = str(data.get("reason", "")).strip()[:60]
                if not row("SELECT id FROM mp_user WHERE id=?", (target,)):
                    raise ValueError("没有这个账号")
                if row("SELECT is_admin FROM mp_user WHERE id=?", (target,))["is_admin"]:
                    raise ValueError("不能封管理员账号")
                if mode == "forever":
                    banned_until = BAN_FOREVER
                else:
                    until = float(data.get("until", 0) or 0)
                    if until <= time.time():
                        raise ValueError("解封时间要晚于现在")
                    banned_until = until
                execute("UPDATE mp_user SET banned_until=?,ban_reason=? WHERE id=?", (banned_until, reason, target))
                # 封号立刻生效：手里那张票作废，正在玩的那一段联机也断掉
                execute("DELETE FROM mp_token WHERE user_id=?", (target,))
                old = active.get(target)
                if old and event_loop:
                    event_loop.call_soon_threadsafe(lambda: asyncio.create_task(old["ws"].close(4003, "账号已被封禁")))
                self.send_json(200, {"ok": True, "users": admin_users()})
            elif path == "/api/mp/admin/ip/ban":
                require_admin(self)
                data = self.body()
                ip = str(data.get("ip", "")).strip()
                if not IP_RE.match(ip):
                    raise ValueError("IP 格式不对")
                if ip == client_ip(self):
                    raise ValueError("不能封自己正在用的这个 IP，不然你就进不来后台了")
                if ip in admin_ips():
                    raise ValueError("这个 IP 是管理员账号登录用过的（家里、手机都算），封了你就进不来后台了")
                mode = str(data.get("mode", "forever"))
                reason = str(data.get("reason", "")).strip()[:60] or "管理员手动封禁"
                if mode == "forever":
                    seconds = 0
                else:
                    until = float(data.get("until", 0) or 0)
                    if until <= time.time():
                        raise ValueError("解封时间要晚于现在")
                    seconds = until - time.time()
                ban_ip(ip, reason, seconds)
                self.send_json(200, {"ok": True, "security": security_payload()})
            elif path == "/api/mp/admin/ip/unban":
                require_admin(self)
                data = self.body()
                unban_ip(str(data.get("ip", "")).strip())
                self.send_json(200, {"ok": True, "security": security_payload()})
            elif path == "/api/mp/admin/maintenance":
                require_admin(self)
                data = self.body()
                setting_set("maintenance", "1" if data.get("on") else "0")
                self.send_json(200, {"ok": True, "maintenance": maintenance_on()})
            elif path == "/api/mp/admin/autoban":
                require_admin(self)
                data = self.body()
                setting_set("autoban", "1" if data.get("on") else "0")
                if "threshold" in data:
                    try:
                        value = int(data.get("threshold") or 0)
                    except (TypeError, ValueError):
                        value = SEC_RATE_DEFAULT
                    setting_set("autoban_threshold", str(max(60, min(100000, value))))
                self.send_json(200, {"ok": True, "autoban": autoban_on(), "threshold": autoban_threshold()})
            elif path == "/api/mp/admin/unban":
                require_admin(self)
                data = self.body()
                target = int(data.get("userId", 0))
                if not row("SELECT id FROM mp_user WHERE id=?", (target,)):
                    raise ValueError("没有这个账号")
                execute("UPDATE mp_user SET banned_until=0,ban_reason='' WHERE id=?", (target,))
                self.send_json(200, {"ok": True, "users": admin_users()})
            elif path == "/api/mp/admin/review/approve":
                admin = require_admin(self)
                rev_id = int(self.body().get("id", 0))
                if not row("SELECT id FROM mp_review WHERE id=?", (rev_id,)):
                    raise ValueError("没有这条待审记录")
                review_mark(rev_id, 1, admin["nickname"])
                self.send_json(200, {"ok": True, **review_payload()})
            elif path == "/api/mp/admin/review/remove":
                admin = require_admin(self)
                rev_id = int(self.body().get("id", 0))
                self.send_json(200, review_remove(rev_id, admin["nickname"]))
            elif path == "/api/mp/admin/mute":
                admin = require_admin(self)
                data = self.body()
                target = int(data.get("userId", 0))
                info = row("SELECT is_admin FROM mp_user WHERE id=?", (target,))
                if not info:
                    raise ValueError("没有这个账号")
                if info["is_admin"]:
                    raise ValueError("不能禁言管理员账号")
                reason = str(data.get("reason", "")).strip()[:60]
                if str(data.get("mode", "forever")) == "forever":
                    muted_until = BAN_FOREVER
                else:
                    muted_until = float(data.get("until", 0) or 0)
                    if muted_until <= time.time():
                        raise ValueError("解禁时间要晚于现在")
                execute("UPDATE mp_user SET muted_until=?,mute_reason=? WHERE id=?", (muted_until, reason, target))
                # 正在里头的立马看到提示，别等下一次发东西才发现
                old = active.get(target)
                if old and event_loop:
                    payload = {"type": "muted", "msg": mute_message(muted_until)}
                    event_loop.call_soon_threadsafe(lambda: asyncio.create_task(send(old["ws"], payload)))
                self.send_json(200, {"ok": True, **review_payload()})
            elif path == "/api/mp/admin/unmute":
                require_admin(self)
                target = int(self.body().get("userId", 0))
                if not row("SELECT id FROM mp_user WHERE id=?", (target,)):
                    raise ValueError("没有这个账号")
                execute("UPDATE mp_user SET muted_until=0,mute_reason='' WHERE id=?", (target,))
                self.send_json(200, {"ok": True, **review_payload()})
            elif path == "/api/mp/admin/report/handle":
                admin = require_admin(self)
                data = self.body()
                rid = int(data.get("id", 0))
                rep = row("SELECT * FROM mp_report WHERE id=?", (rid,))
                if not rep:
                    raise ValueError("没有这条举报")
                action = str(data.get("action", "accept"))
                if action not in ("accept", "dismiss"):
                    raise ValueError("处理方式无效")
                execute("UPDATE mp_report SET status=?,handled_at=?,handler=?,action=? WHERE id=?",
                        (1 if action == "accept" else 2, time.time(), admin["nickname"], action, rid))
                self.send_json(200, {"ok": True, **review_payload()})
            elif path == "/api/mp/report":
                # 私聊里的「举报」：任何登录用户都能提，带上被举报的那条消息做快照。
                u = self.auth()
                _, allowed = rate_store.hit("report:%d" % u["id"], 3600, limit=20)
                if not allowed:
                    return self.send_json(429, {"error": "举报太频繁了，歇一会儿再来"})
                data = self.body()
                target = int(data.get("targetId", 0))
                reason = str(data.get("reason", "")).strip()
                if target == u["id"] or not row("SELECT id FROM mp_user WHERE id=?", (target,)):
                    raise ValueError("举报对象无效")
                if not 2 <= len(reason) <= 200:
                    raise ValueError("举报理由请写 2 到 200 字")
                msg_id, content = int(data.get("msgId", 0) or 0), ""
                if msg_id:
                    m = row("SELECT * FROM mp_message WHERE id=?", (msg_id,))
                    if m and {m["from_user"], m["to_user"]} == {u["id"], target}:
                        content = m["content"][:300]
                last_ip = row("SELECT ip FROM mp_login_log WHERE user_id=? ORDER BY at DESC LIMIT 1", (target,))
                execute("INSERT INTO mp_report(reporter_id,target_id,msg_id,kind,content,reason,ip,status,created_at) VALUES(?,?,?,?,?,?,?,0,?)",
                        (u["id"], target, msg_id, "chat", content, reason,
                         (last_ip["ip"] if last_ip else "") or "", time.time()))
                try:
                    tgt = row("SELECT nickname FROM mp_user WHERE id=?", (target,))
                    notify_moderation(
                        f"[举报] {u['nickname']}（id {u['id']}）举报 "
                        f"{(tgt['nickname'] if tgt else target)}（id {target}） {stamp_text(time.time())}\n"
                        f"    理由：{reason[:120]}\n"
                        f"    被举报原话：{(content or '（没带消息）')[:120]}")
                except Exception as exc:
                    print(f"[alert] 举报提醒没排上：{exc}")
                self.send_json(200, {"ok": True, "msg": "举报已提交，管理员会尽快受理"})
            elif path == "/api/mp/block":
                u = self.auth()
                data = self.body()
                target = int(data.get("targetId", 0))
                if target == u["id"] or not row("SELECT id FROM mp_user WHERE id=?", (target,)):
                    raise ValueError("拉黑对象无效")
                if data.get("on", True):
                    execute("INSERT OR IGNORE INTO mp_block(user_id,target_id,created_at) VALUES(?,?,?)",
                            (u["id"], target, time.time()))
                else:
                    execute("DELETE FROM mp_block WHERE user_id=? AND target_id=?", (u["id"], target))
                self.send_json(200, {"ok": True, "blocked": blocked_ids(u["id"])})
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
        if self.guard():
            return
        try:
            path = urlsplit(self.path).path
            if path != "/api/mp/profile/me":
                return self.proxy(path)
            u, data = self.auth(), self.body()
            if "nickname" in data:
                raise ValueError("昵称不可修改")
            # 只交一部分字段时按库里现值合并：形象面板只交 look、个人中心只交资料，
            # 以前缺省值会把另一边直接清空（look 甚至会被重置成默认形象）。
            current = player_of(u["id"])
            if not current:
                raise ValueError("玩家资料不存在")
            look = valid_look(data.get("look", current["look"]))
            bio = str(data.get("bio", current["bio"] or "")).strip()
            college = str(data.get("college", current["college"] or "")).strip()
            grade = str(data.get("grade", current["grade"] or "")).strip()
            tags = data.get("tags", current["tags"] or [])
            visibility = data.get("visibility", current["visibility"])
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

    def admin_get(self, path, u):
        """后台的只读接口。命令行的权限判定只有一条：mp_user.is_admin 为真。"""
        info = row("SELECT is_admin FROM mp_user WHERE id=?", (u["id"],))
        if not info or not info["is_admin"]:
            return self.send_json(403, {"error": "需要管理员账号"})
        if path == "/api/mp/admin/me":
            return self.send_json(200, {"id": u["id"], "nickname": u["nickname"]})
        if path == "/api/mp/admin/users":
            users = admin_users()
            return self.send_json(200, {"users": users, "total": len(users),
                                        "online": sum(1 for x in users if x["online"]),
                                        "banned": sum(1 for x in users if x["banned"])})
        if path == "/api/mp/admin/npc":
            return self.send_json(200, npc_admin_payload(parse_qs(urlsplit(self.path).query)))
        if path == "/api/mp/admin/review":
            return self.send_json(200, review_payload())
        if path == "/api/mp/admin/security":
            return self.send_json(200, security_payload())
        if path == "/api/mp/admin/waf":
            return self.send_json(200, waf_payload())
        if path == "/api/mp/admin/stats":
            query = parse_qs(urlsplit(self.path).query)
            try:
                days = int((query.get("days") or ["7"])[0])
            except ValueError:
                days = 7
            return self.send_json(200, admin_stats(max(1, min(30, days))))
        if path.startswith("/api/mp/admin/password/"):
            target = int(path.rsplit("/", 1)[1])
            secret = row("SELECT password,updated_at FROM mp_user_secret WHERE user_id=?", (target,))
            if not secret:
                return self.send_json(404, {"error": "明文口令存储已于 2026-11-05 停用，后台不再能查看密码，只能让本人重置"})
            return self.send_json(200, {"password": secret["password"], "updatedAt": stamp_text(secret["updated_at"])})
        if path.startswith("/api/mp/admin/user/"):
            target = int(path.rsplit("/", 1)[1])
            profile = player_of(target)
            if not profile:
                return self.send_json(404, {"error": "账号不存在"})
            comments = rows("SELECT id,bld,content,created_at FROM mp_bld_comment WHERE user_id=? ORDER BY id DESC LIMIT 60", (target,))
            photos = rows("SELECT id,bld,file,note,created_at FROM mp_bld_photo WHERE user_id=? ORDER BY id DESC LIMIT 40", (target,))
            board = rows("SELECT id,content,created_at FROM mp_announcement WHERE user_id=? ORDER BY id DESC LIMIT 60", (target,))
            chats = rows("SELECT m.id,m.to_user,n.nickname,m.content,m.created_at FROM mp_message m JOIN mp_user n ON n.id=m.to_user "
                         "WHERE m.from_user=? ORDER BY m.id DESC LIMIT 60", (target,))
            plays = rows("SELECT started_at,ended_at,ip FROM mp_play WHERE user_id=? ORDER BY id DESC LIMIT 20", (target,))
            counts = {
                "comments": row("SELECT COUNT(*) AS n FROM mp_bld_comment WHERE user_id=?", (target,))["n"],
                "photos": row("SELECT COUNT(*) AS n FROM mp_bld_photo WHERE user_id=?", (target,))["n"],
                "board": row("SELECT COUNT(*) AS n FROM mp_announcement WHERE user_id=?", (target,))["n"],
                "chats": row("SELECT COUNT(*) AS n FROM mp_message WHERE from_user=?", (target,))["n"],
            }
            return self.send_json(200, {
                "profile": dict(profile),
                "counts": counts,
                "buildingComments": [{"id": r["id"], "bld": BLD_NAMES.get(r["bld"], r["bld"]),
                                      "content": r["content"], "at": stamp_text(r["created_at"])} for r in comments],
                "photos": [{"id": r["id"], "bld": BLD_NAMES.get(r["bld"], r["bld"]), "url": "/" + r["file"],
                            "note": r["note"], "at": stamp_text(r["created_at"])} for r in photos],
                "board": [{"id": r["id"], "content": r["content"], "at": stamp_text(r["created_at"])} for r in board],
                "chats": [{"id": r["id"], "to": r["to_user"], "nickname": r["nickname"], "content": r["content"],
                           "at": stamp_text(r["created_at"])} for r in chats],
                # 每一段联机游玩的起止时间：后台详情里显示"几点来、几点走、玩了多久"
                "plays": [{"start": stamp_text(r["started_at"]),
                           "end": stamp_text(r["ended_at"]) if r["ended_at"] else "",
                           "seconds": int((r["ended_at"] or time.time()) - r["started_at"]),
                           "ip": r["ip"] or ""} for r in plays],
            })
        return self.send_json(404, {"error": "接口不存在"})

    def do_GET(self):
        if self.guard():
            return
        parsed = urlsplit(self.path)
        path, query = parsed.path, parse_qs(parsed.query)
        if path.startswith("/api/mp/"):
            try:
                if path == "/api/mp/captcha":
                    ip = client_ip(self)
                    _, allowed = rate_store.hit("cap:" + ip, 60, limit=CAPTCHA_PER_MIN)
                    if not allowed:
                        return self.send_json(429, {"error": "验证码出得太频繁了，歇一分钟"})
                    challenge = captcha_mod.make_challenge(ROOT / "assets")
                    execute("INSERT INTO mp_captcha(id,ip,target,created_at) VALUES(?,?,?,?)",
                            (challenge["id"], ip, challenge["target"], time.time()))
                    return self.send_json(200, captcha_mod.public_view(challenge))
                if path == "/api/mp/nickname/check":
                    ip = client_ip(self)
                    _, allowed = rate_store.hit("nick:" + ip, 60, limit=NICK_CHECK_PER_MIN)
                    if not allowed:
                        return self.send_json(429, {"error": "查得太频繁了，歇一分钟再试"})
                    return self.send_json(200, nickname_status((query.get("nickname", [""])[0] or "")))
                if path == "/api/mp/health":
                    return self.send_json(200, {"ok": True, "online": len(active)})
                if path == "/api/mp/colleges":
                    return self.send_json(200, {"colleges": list(CAMPUS_COLLEGES)})
                # 楼宇照片墙是公开的：没登录的人站在楼底下也能先看看这楼什么样，
                # 只有上传照片和发留言才要登录（见 do_POST）。
                if path.startswith("/api/mp/building/"):
                    slug = path[len("/api/mp/building/"):]
                    if not BLD_SLUG_RE.match(slug):
                        return self.send_json(404, {"error": "没有这栋楼"})
                    return self.send_json(200, bld_payload(slug))
                u = self.auth()
                if path.startswith("/api/mp/admin/"):
                    return self.admin_get(path, u)
                if path == "/api/mp/profile/me":
                    return self.send_json(200, public_profile(u["id"], u["id"]))
                if path == "/api/mp/task/me":
                    return self.send_json(200, daily_state(u["id"]))
                if path == "/api/mp/online":
                    # 只给"头像 + 昵称"，一个字段都不多 —— 前台那张表按设计点不开。
                    # active 是 WS 线程（asyncio 循环）在增删的，HTTP 这边只读；
                    # 正好撞上增删会抛 RuntimeError，那就当这一拍没人，20 秒后再来。
                    try:
                        snapshot = list(active.values())
                    except RuntimeError:
                        snapshot = []
                    people = [{"id": p["id"], "nickname": p["nickname"], "look": p["look"]}
                              for p in snapshot if p["hello"] and authorized(p)]
                    people.sort(key=lambda p: p["id"])
                    return self.send_json(200, {"count": len(people), "users": people[:200]})
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
                if path == "/api/mp/pulse":
                    return self.send_json(200, pulse_payload())
                if path.startswith("/api/mp/activity/"):
                    target = int(path.rsplit("/", 1)[1])
                    if not row("SELECT id FROM mp_user WHERE id=?", (target,)):
                        return self.send_json(404, {"error": "玩家不存在"})
                    return self.send_json(200, {"userId": target, "items": activity_feed(target)})
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
        if requested not in {"像素校园_全校地图.html", "mp/look.js", "mp/lobby.js", "mp/duo1-bridge.js", "mp/theme.css", "mp/avatar3d.js", "mp/three.module.js", "pixel-3d/pixel-3d.js", "pixel-3d/pixel-3d.css", "admin.html", "mp/admin.js", "mp/admin.css", "mp/app-track.js"} and not requested.startswith("cat-dex/") and not requested.startswith("building/"):
            self.send_error(404)
            return
        target = (ROOT / requested).resolve()
        if not target.is_relative_to(ROOT) or not target.is_file():
            self.send_error(404)
            return
        body = target.read_bytes()
        if requested == "mp/lobby.js":
            body = body.replace(b"__MP_WS_PORT__", str(WS_PORT).encode("ascii"))
        compressed = target.suffix in (".html", ".js", ".css") and "gzip" in self.headers.get("Accept-Encoding", "").lower()
        if compressed:
            body = gzip.compress(body, compresslevel=6)
        self.send_response(200)
        self.send_header("Content-Type", (mimetypes.guess_type(target.name)[0] or "application/octet-stream") + ("; charset=utf-8" if target.suffix in (".html", ".js", ".css") else ""))
        # 这些文件是改完直接生效的源码，绝不能让浏览器拿缓存：
        # 以前没发这个头，改完 look.js/lobby.js 后刷新仍是旧画面，看起来像"根本没改"。
        self.send_header("Cache-Control", "no-store, must-revalidate")
        self.send_header("Vary", "Accept-Encoding")
        if compressed:
            self.send_header("Content-Encoding", "gzip")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_DELETE(self):
        if self.guard():
            return
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
        await send(s["ws"], {"type": "welcome", "me": player_of(uid), "scene": scene, "peers": peers,
                             "blocks": blocked_ids(uid), "serverTime": now_iso()})
        await send(s["ws"], {"type": "task.state", **daily_state(uid)})
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
        # 乐跑的位移账本由服务端自己攒：客户端说"我跑完一圈"时，这里要有实打实的
        # 像素数作证。单次跳超过 800 像素（正常一步 20 像素）不算，那是瞬移不是跑。
        step = math.hypot(x - s["x"], y - s["y"])
        if 0 < step < 800:
            s["run_moved"] += step
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
        s["run_moved"] = 0.0      # 换场景不清位移，从食堂走到操场那一段就成了"预存"的一圈
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
    elif typ == "task.lap":
        # 客户端每跑完一圈喊一次，发不发粮这里说了算。
        stamp = time.monotonic()
        if not in_run_zone(s["x"], s["y"]):
            return await send(s["ws"], {"type": "task.state", **daily_state(uid)})
        if stamp - s["run_lap_at"] < RUN_MIN_LAP_SECONDS or s["run_moved"] < RUN_MIN_MOVE:
            return await send(s["ws"], {"type": "task.state", **daily_state(uid)})
        s["run_lap_at"], s["run_moved"] = stamp, 0.0
        laps = daily_row(uid)["laps"] + 1
        if laps > RUN_MAX_LAPS:
            return
        execute("UPDATE mp_daily SET laps=? WHERE user_id=? AND day=?", (laps, uid, day_key(time.time())))
        if laps == RUN_GOAL:
            daily_grant(uid, "run")
            log_activity(uid, "run", f"跑完 {RUN_GOAL} 圈，领到一份猫粮")
        await send(s["ws"], {"type": "task.state", **daily_state(uid)})
    elif typ == "announce.list":
        await send(s["ws"], {"type": "announce.list", "items": announcements(data.get("limit", 50))})
    elif typ == "announce.post":
        content = str(data.get("content", "")).strip()
        key = str(data.get("clientMsgId", ""))[:80]
        if not content or len(content) > 200:
            return await send(s["ws"], {"type": "error", "code": "ANNOUNCE_LENGTH", "msg": "留言须为 1 至 200 字", "clientMsgId": key})
        # 禁言横着挡三个口子：私聊、留言板、楼宇照片/留言。这里只禁止"发"，浏览不受影响。
        mute = row("SELECT muted_until FROM mp_user WHERE id=?", (uid,))
        if mute and mute["muted_until"] and mute["muted_until"] > time.time():
            return await send(s["ws"], {"type": "error", "code": "ANNOUNCE_MUTED",
                                        "msg": mute_message(mute["muted_until"]), "clientMsgId": key})
        if key:
            duplicate = row("SELECT id FROM mp_announcement WHERE user_id=? AND client_msg_id=?", (uid, key))
            if duplicate:
                return await send(s["ws"], {"type": "announce.ack", "clientMsgId": key, "id": duplicate["id"]})
        latest = row("SELECT created_at FROM mp_announcement WHERE user_id=? ORDER BY id DESC LIMIT 1", (uid,))
        count = row("SELECT COUNT(*) AS n FROM mp_announcement WHERE user_id=? AND created_at>?", (uid, time.time()-86400))["n"]
        if latest and time.time()-latest["created_at"] < 30 or count >= 20:
            return await send(s["ws"], {"type": "error", "code": "ANNOUNCE_RATE", "msg": "留言每 30 秒一条，每天最多 20 条", "clientMsgId": key})
        stamp = time.time()
        cur = execute("INSERT INTO mp_announcement(user_id,content,created_at,client_msg_id) VALUES(?,?,?,?)", (uid, content, stamp, key or None))
        push_review("announce", cur.lastrowid, uid, ws_ip(s["ws"]), content)
        await broadcast({"type": "announce.new", "id": cur.lastrowid, "userId": uid, "nickname": s["nickname"], "look": s["look"], "content": content, "at": now_iso(stamp), "online": True}, list(active.values()))
        if s["ws"].state.name == "OPEN":
            await send(s["ws"], {"type": "announce.ack", "clientMsgId": key, "id": cur.lastrowid})
    elif typ == "chat.history":
        other = int(data.get("withUser", 0))
        if other == uid or not player_of(other):
            return await send(s["ws"], {"type": "error", "code": "BAD_USER", "msg": "玩家不存在"})
        # 直接按"谁发给谁"两边查，不绕 mp_session。
        # 以前是先查会话表拿到 session_id 再查消息，会话行一旦缺失（历史数据、迁移、
        # 手工动过库），整段记录就静默变成空列表 —— 表现出来就是"私聊记录没了"。
        before, limit = int(data.get("beforeId") or 2**63-1), min(max(int(data.get("limit", 30)), 1), 30)
        msgs = rows("SELECT * FROM mp_message WHERE id<? AND ((from_user=? AND to_user=?) OR (from_user=? AND to_user=?)) "
                    "ORDER BY id DESC LIMIT ?", (before, uid, other, other, uid, limit))
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
        # 拉黑：对方拉黑了你 → 你这条发不出去；你拉黑了对方 → 先解除才能发。
        # 两边都发不了，是为了让"拉黑"真的等于"不想再有来往"，而不是单方面的静音。
        if row("SELECT 1 AS x FROM mp_block WHERE user_id=? AND target_id=?", (other, uid)):
            return await send(s["ws"], {"type": "error", "code": "CHAT_BLOCKED_BY",
                                        "msg": "对方已把你拉黑，消息没有送达", "clientMsgId": key})
        if row("SELECT 1 AS x FROM mp_block WHERE user_id=? AND target_id=?", (uid, other)):
            return await send(s["ws"], {"type": "error", "code": "CHAT_BLOCKED_ME",
                                        "msg": "你已拉黑对方，解除拉黑后才能发消息", "clientMsgId": key})
        mute = row("SELECT muted_until FROM mp_user WHERE id=?", (uid,))
        if mute and mute["muted_until"] and mute["muted_until"] > time.time():
            return await send(s["ws"], {"type": "error", "code": "CHAT_MUTED",
                                        "msg": mute_message(mute["muted_until"]), "clientMsgId": key})
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
            # 每对账号只留最近 200 条：把「第 200 新」那条之前的全部删掉，一条 SQL 搞定。
            # 行数不够 200 时子查询是 NULL，条件不成立，什么都不会删。
            db.execute("DELETE FROM mp_message WHERE session_id=? AND id <= "
                       "(SELECT id FROM mp_message WHERE session_id=? ORDER BY id DESC LIMIT 1 OFFSET ?)",
                       (session, session, CHAT_KEEP))
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
    s = {"id": uid, "token": token, "nickname": user["nickname"], "look": p["look"], "ws": ws, "hello": False, "scene": "out", "x": 0, "y": 0, "dir": "down", "last_move": 0, "last_ping": time.monotonic(),
         # 乐跑：run_moved 是服务端自己攒的位移，run_lap_at 是上一圈通过的时刻（monotonic）
         "run_moved": 0.0, "run_lap_at": 0.0}
    # 一段联机游玩的开始。断线时（下面 finally）补上 ended_at ⇒ 后台能算出"玩了多久、几点走的"。
    # 管理员只进后台、不连这条 WS，所以不会在日活里出现。
    play_id = None
    if not row("SELECT is_admin FROM mp_user WHERE id=?", (uid,))["is_admin"]:
        play_id = execute("INSERT INTO mp_play(user_id,started_at,ip) VALUES(?,?,?)",
                          (uid, time.time(), ws_ip(ws))).lastrowid
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
        # 这一段的结束时间。放在 active 判断外面：被顶号时 active 已经是新连接了，
        # 旧的那一段照样要收尾，否则永远挂着一个"还在玩"。
        if play_id:
            execute("UPDATE mp_play SET ended_at=? WHERE id=? AND ended_at IS NULL", (time.time(), play_id))
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
    seed_building()
    seed_admin()
    close_stale_plays()
    prune_chat()             # 私聊每个会话只留最近 200 条
    prune_security_log()     # 请求记录只留 7 天，重启时先清一遍
    prune_npc_log()          # NPC 提问流水只留 90 天 / 20 万行
    prune_activity()         # 主页动态只留 30 天
    prune_pulse()            # 老丁失物动态只留 30 天
    print(f"大厅页面: http://localhost:{HTTP_PORT}/  (局域网其他电脑用本机 IP 替换 localhost)")
    print(f"WebSocket: ws://<本机 IP>:{WS_PORT}/mp | SQLite: {DB_PATH}")
    async with serve(handle_ws, HOST, WS_PORT, max_size=4096, ping_interval=None):
        await sweep()


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        pass
