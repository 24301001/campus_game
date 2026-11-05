r"""账号与历史 —— 学霸哥.md §六 那句「账号服务是记忆归属的前提」的代码化。

为什么必须有它，而不是 localStorage 糊一下：
  · 记忆要跨会话、跨设备挂在**同一个人**身上 → 必须有 `user_id` 这个锚；
  · 部署到服务器之后就是真多用户，`user_id` 隔离不做就是**串号**（总体设计 §17）；
  · 组长那句「记住用户名和用户历史」在服务端只有这一种解释。

表：
  user(id, nick, pw_hash, pw_salt, created_at)
  session(id, user_id, title, created_at, last_at)
  message(id, session_id, user_id, role, content, tool, refs, created_at, no_source, src)
  user_memory(user_id, text, updated_at, msg_count, paused)   # 跨会话画像，读写在 memory.py

历史在这里是**两层**，别混成一层：
  · session/message 是原始历史 —— 侧栏那些能点开回放的会话，以及同一会话内的多轮上下文；
  · user_memory 是归纳出来的画像 —— 开一段全新的对话它照样跟着人走。
只有上一层的话，点一下「＋新对话」就又失忆了；那一层叫日志，不叫记忆。
token 不落库（HMAC 自签，见 auth.py），省一张表也省一次 DELETE 清理工夫。
"""

from __future__ import annotations

import hashlib
import secrets
import sqlite3
import threading
import time

from .settings import DB_PATH, ensure_dirs

PBKDF2_ITERS = 120_000
_local = threading.local()

_SCHEMA = """
CREATE TABLE IF NOT EXISTS user (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    nick      TEXT    NOT NULL UNIQUE,
    pw_hash   TEXT    NOT NULL,
    pw_salt   TEXT    NOT NULL,
    created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS session (
    id        TEXT    PRIMARY KEY,
    user_id   INTEGER NOT NULL REFERENCES user(id),
    title     TEXT    NOT NULL DEFAULT '',
    created_at INTEGER NOT NULL,
    last_at   INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS ix_session_user ON session(user_id, last_at DESC);
CREATE TABLE IF NOT EXISTS message (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT   NOT NULL REFERENCES session(id),
    user_id   INTEGER NOT NULL,
    role      TEXT    NOT NULL,
    content   TEXT    NOT NULL,
    tool      TEXT    NOT NULL DEFAULT '',
    refs      TEXT    NOT NULL DEFAULT '[]',
    created_at INTEGER NOT NULL,
    no_source INTEGER NOT NULL DEFAULT 0,
    src       TEXT    NOT NULL DEFAULT '',
    image     TEXT    NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS ix_msg_session ON message(session_id, id);
CREATE INDEX IF NOT EXISTS ix_msg_user ON message(user_id, id);
CREATE TABLE IF NOT EXISTS user_memory (
    user_id    INTEGER PRIMARY KEY REFERENCES user(id),
    text       TEXT    NOT NULL DEFAULT '',
    updated_at INTEGER NOT NULL DEFAULT 0,
    msg_count  INTEGER NOT NULL DEFAULT 0,
    paused     INTEGER NOT NULL DEFAULT 0
);
"""


def conn() -> sqlite3.Connection:
    """每线程一条连接。sqlite3 的连接不能跨线程共享，而 FastAPI 会把同步
    端点丢进线程池 —— 这里踩一次就是「随机 InterfaceError」。"""
    c = getattr(_local, "conn", None)
    if c is None:
        ensure_dirs()
        c = sqlite3.connect(DB_PATH, timeout=10, isolation_level=None)
        c.row_factory = sqlite3.Row
        c.execute("PRAGMA journal_mode=WAL")
        c.execute("PRAGMA foreign_keys=ON")
        _local.conn = c
    return c


def init_db() -> None:
    conn().executescript(_SCHEMA)
    # 老库补列：CREATE TABLE IF NOT EXISTS 不会动已经存在的表，加了字段得自己补上
    cols = [r[1] for r in conn().execute("PRAGMA table_info(message)").fetchall()]
    if "no_source" not in cols:
        conn().execute("ALTER TABLE message ADD COLUMN no_source INTEGER NOT NULL DEFAULT 0")
    # src：这条消息的来路。现在只有一个取值 `photo`（拍照识别出来的题目）。
    if "src" not in cols:
        conn().execute("ALTER TABLE message ADD COLUMN src TEXT NOT NULL DEFAULT ''")
    # image：拍照那条气泡上显示的**缩略图**（前端压好的 data URL，收不收见 vision.clean_thumb）。
    # 它只是显示件 —— 检索、答题、多轮上下文用的都是 content 里那段识别文字，
    # `context_messages()` 压根不选这一列，别把 base64 喂给模型。
    if "image" not in cols:
        conn().execute("ALTER TABLE message ADD COLUMN image TEXT NOT NULL DEFAULT ''")


def hash_password(pw: str, salt: bytes | None = None) -> tuple[str, str]:
    salt = salt or secrets.token_bytes(16)
    dk = hashlib.pbkdf2_hmac("sha256", pw.encode("utf-8"), salt, PBKDF2_ITERS)
    return dk.hex(), salt.hex()


class AuthError(Exception):
    pass


# ---------- 用户 ----------
def create_user(nick: str, pw: str) -> int:
    nick = (nick or "").strip()
    if len(nick) < 2:
        raise AuthError("昵称至少 2 个字符")
    if len(pw) < 4:
        raise AuthError("密码至少 4 位")
    h, s = hash_password(pw)
    try:
        cur = conn().execute("INSERT INTO user(nick,pw_hash,pw_salt,created_at) VALUES(?,?,?,?)",
                             (nick, h, s, int(time.time())))
    except sqlite3.IntegrityError:
        raise AuthError("这个昵称已经被用了") from None
    return int(cur.lastrowid)


def user_by_nick(nick: str) -> sqlite3.Row | None:
    return conn().execute("SELECT * FROM user WHERE nick=?", ((nick or "").strip(),)).fetchone()


def user_by_id(uid: int) -> sqlite3.Row | None:
    return conn().execute("SELECT * FROM user WHERE id=?", (uid,)).fetchone()


def verify(nick: str, pw: str) -> int | None:
    row = user_by_nick(nick)
    if not row:
        return None
    h, _ = hash_password(pw, bytes.fromhex(row["pw_salt"]))
    return int(row["id"]) if secrets.compare_digest(h, row["pw_hash"]) else None


# ---------- 会话 ----------
def ensure_session(uid: int, sid: str | None) -> str:
    sid = (sid or "").strip()
    if sid:
        row = conn().execute("SELECT user_id FROM session WHERE id=?", (sid,)).fetchone()
        if row and int(row["user_id"]) == uid:
            conn().execute("UPDATE session SET last_at=? WHERE id=?", (int(time.time()), sid))
            return sid
        if row:
            raise AuthError("这个会话不属于当前账号")       # 串号防护
    new = secrets.token_hex(8)
    conn().execute("INSERT INTO session(id,user_id,title,created_at,last_at) VALUES(?,?,?,?,?)",
                   (new, uid, "", int(time.time()), int(time.time())))
    return new


def delete_session(sid: str, uid: int) -> bool:
    """删掉一段会话**和它下面的全部消息**。返回 True=确实删掉了一条。

    别人的会话 id 直接抛 AuthError（和 ensure_session 同一条串号防护，不静默假装"没这个会话"）；
    不存在或已经删过的返回 False，让前端可以幂等地刷一次列表。
    """
    sid = (sid or "").strip()
    if not sid:
        return False
    row = conn().execute("SELECT user_id FROM session WHERE id=?", (sid,)).fetchone()
    if row is None:
        return False
    if int(row["user_id"]) != int(uid):
        raise AuthError("这个会话不属于当前账号")
    conn().execute("DELETE FROM message WHERE session_id=? AND user_id=?", (sid, uid))
    conn().execute("DELETE FROM session WHERE id=? AND user_id=?", (sid, uid))
    return True


def set_session_title(sid: str, text: str) -> None:
    row = conn().execute("SELECT title FROM session WHERE id=?", (sid,)).fetchone()
    if row and not row["title"]:
        conn().execute("UPDATE session SET title=? WHERE id=?", (text.strip()[:40] or "新对话", sid))


def list_sessions(uid: int, limit: int = 30) -> list[dict]:
    rows = conn().execute(
        "SELECT id,title,created_at,last_at FROM session s WHERE s.user_id=? "
        "AND EXISTS(SELECT 1 FROM message m WHERE m.session_id=s.id) "
        "ORDER BY last_at DESC LIMIT ?",
        (uid, limit)).fetchall()
    return [dict(r) for r in rows]


# ---------- 消息 ----------
def add_message(sid: str, uid: int, role: str, content: str, tool: str = "", refs: str = "[]",
                no_source: int = 0, src: str = "", image: str = "") -> int:
    cur = conn().execute(
        "INSERT INTO message(session_id,user_id,role,content,tool,refs,created_at,no_source,src,image) "
        "VALUES(?,?,?,?,?,?,?,?,?,?)",
        (sid, uid, role, content, tool, refs, int(time.time()), int(no_source or 0), src or "",
         image or ""))
    return int(cur.lastrowid)


def list_messages(sid: str, uid: int, limit: int = 40) -> list[dict]:
    rows = conn().execute(
        "SELECT role,content,tool,refs,created_at,no_source,src,image FROM message "
        "WHERE session_id=? AND user_id=? "
        "ORDER BY id DESC LIMIT ?", (sid, uid, limit)).fetchall()
    return [dict(r) for r in reversed(rows)]


def context_messages(sid: str, uid: int, turns: int = 6) -> list[dict]:
    """给 LLM 的多轮上下文（只要 user/assistant，不带 system）。"""
    rows = conn().execute(
        "SELECT role,content FROM message WHERE session_id=? AND user_id=? AND role IN ('user','assistant') "
        "ORDER BY id DESC LIMIT ?", (sid, uid, turns * 2)).fetchall()
    return [{"role": r["role"], "content": r["content"]} for r in reversed(rows)]


def recent_courses(uid: int, limit: int = 20) -> list[str]:
    """最近问过哪些课 —— 用来给下拉框排序，也用来做"你是不是想问《X》"的提示。"""
    rows = conn().execute(
        "SELECT refs FROM message WHERE user_id=? AND refs != '[]' ORDER BY id DESC LIMIT ?",
        (uid, limit)).fetchall()
    import json

    out: list[str] = []
    for r in rows:
        try:
            for ref in json.loads(r["refs"]):
                c = ref.get("course")
                if c and c not in out:
                    out.append(c)
        except Exception:                              # noqa: BLE001
            continue
    return out

# ---------- 跨会话记忆（读写口径见 memory.py） ----------
def count_messages(uid: int, role: str | None = None) -> int:
    sql = "SELECT COUNT(*) FROM message WHERE user_id=?"
    args: tuple = (uid,)
    if role:
        sql += " AND role=?"
        args += (role,)
    return int(conn().execute(sql, args).fetchone()[0])


def get_memory(uid: int) -> dict | None:
    row = conn().execute("SELECT text,updated_at,msg_count,paused FROM user_memory WHERE user_id=?",
                         (uid,)).fetchone()
    return dict(row) if row else None


def set_memory(uid: int, text: str, msg_count: int, paused: int = 0) -> None:
    """一条 INSERT 顶两条：SQLite 3.24+ 的 UPSERT，省一次「先查有没有、再决定插还是改」。"""
    conn().execute(
        "INSERT INTO user_memory(user_id,text,updated_at,msg_count,paused) VALUES(?,?,?,?,?) "
        "ON CONFLICT(user_id) DO UPDATE SET text=excluded.text, updated_at=excluded.updated_at, "
        "msg_count=excluded.msg_count, paused=excluded.paused",
        (uid, (text or "").strip()[:600], int(time.time()), int(msg_count), int(paused)))


def pause_memory(uid: int) -> int:
    """清空画像**并且不再自动归纳**，直到用户手动恢复。历史消息一条不动。

    只删不暂停是会说谎的：下一句问完后台又给他写回去了。用户点「清空记忆」要的是
    "别记着我"，不是"把聊天记录删了" —— 两件事在 UI 上必须能分开。
    """
    conn().execute("INSERT INTO user_memory(user_id,text,updated_at,msg_count,paused) "
                   "VALUES(?, '', ?, 0, 1) ON CONFLICT(user_id) DO UPDATE "
                   "SET text='', updated_at=excluded.updated_at, paused=1",
                   (uid, int(time.time())))
    return count_messages(uid, "user")


def recent_questions(uid: int, limit: int = 24) -> list[str]:
    """跨会话、按最近出现顺序、**去掉重复问法**的问题原文 —— 归纳的原料，不给前端看。

    去重是因为同一句问三遍（换 key、重试）很常见，不去重画像里那条的权重就虚高。
    """
    rows = conn().execute(
        "SELECT content FROM message WHERE user_id=? AND role='user' "
        "GROUP BY content ORDER BY MAX(id) DESC LIMIT ?", (uid, limit)).fetchall()
    return [r["content"] for r in rows]


def close_conn() -> None:
    """后台线程用完就关。连接是每线程一条（见 conn()），线程死了不关就是白攥着 WAL 句柄。"""
    c = getattr(_local, "conn", None)
    if c is not None:
        try:
            c.close()
        finally:
            _local.conn = None
