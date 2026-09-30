"""token：HMAC 自签，不落库。

    <user_id>.<过期时间戳>.<随机数>.<签名>

为什么不存库：省一张表、省一次过期清理，而且服务器重启不会把所有人踢下线
（这条在演示当天很重要 —— 后端崩一次重启，如果 token 在库里，全班的登录态都没了）。
代价是不能主动吊销，所以密码改了必须等 token 自然过期；本项目 MVP 接受这个取舍。
"""

from __future__ import annotations

import hashlib
import hmac
import secrets
import time

from .settings import secret

TTL_SECONDS = 30 * 24 * 3600


class BadToken(Exception):
    pass


def _sig(payload: str) -> str:
    return hmac.new(secret(), payload.encode("utf-8"), hashlib.sha256).hexdigest()[:32]


def issue(uid: int, ttl: int = TTL_SECONDS) -> str:
    nonce = secrets.token_hex(6)
    payload = f"{uid}.{int(time.time()) + ttl}.{nonce}"
    return f"{payload}.{_sig(payload)}"


def decode(token: str) -> int | None:
    """返回 user_id；签名不对、格式不对或过期都返回 None。"""
    if not token:
        return None
    parts = token.strip().split(".")
    if len(parts) != 4:
        return None
    payload = ".".join(parts[:3])
    if not secrets.compare_digest(_sig(payload), parts[3]):
        return None
    try:
        uid, exp = int(parts[0]), int(parts[1])
    except ValueError:
        return None
    if exp < time.time():
        return None
    return uid