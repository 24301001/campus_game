# -*- coding: utf-8 -*-
"""密码强度与泄露库校验。

两道独立的关：

1. 本地常见密码表（NCSC / SecLists 前 10 万条，离线，查表是 O(1)）。
2. Have I Been Pwned 的 k-匿名接口：只把 SHA-1 的前 5 位发出去，
   明文不出服务器，对方也不知道查的是谁。网络不通时按"没查成"处理，
   不拦人（不能因为外网抖动就把注册全堵死）。

评分 0~4，注册要求 >= 2 分，且不在常见表 / 泄露库里。
前端 mp/lobby.js 里有一份同规则的即时评分，只负责提示，最终裁判在这里。
"""
from __future__ import annotations

import hashlib
import os
import re
import threading
import time
import urllib.request

COMMON_FILE = (os.environ.get("MP_COMMON_PW")
               or os.path.join(os.path.dirname(os.path.abspath(__file__)), "common_passwords.txt"))
HIBP_URL = "https://api.pwnedpasswords.com/range/"
HIBP_TIMEOUT = 2.5
HIBP_CACHE_TTL = 3600
HIBP_CACHE_MAX = 2000

LABELS = ("很弱", "弱", "一般", "强", "很强")

# 键盘上挨着的、或者按顺序排的字符串。命中一次扣一分。
SEQUENCES = re.compile(
    r"(0123|1234|2345|3456|4567|5678|6789|abcd|bcde|cdef|qwer|wert|asdf|sdfg|zxcv|1qaz|2wsx|qazwsx)",
    re.I)
REPEATS = re.compile(r"(.)\1\1", re.S)

_common = None
_common_lock = threading.Lock()
_hibp_cache: dict[str, tuple[float, str]] = {}
_hibp_lock = threading.Lock()


def common_passwords() -> set[str]:
    """读一次常见密码表，之后常驻内存。文件缺失就返回空集，不报错。"""
    global _common
    if _common is None:
        with _common_lock:
            if _common is None:
                words = set()
                try:
                    with open(COMMON_FILE, encoding="utf-8", errors="ignore") as f:
                        for line in f:
                            word = line.strip()
                            if 4 <= len(word) <= 64:
                                words.add(word.lower())
                except OSError:
                    pass
                _common = words
    return _common


def _result(ok: bool, score: int, issues: list[str]) -> dict:
    score = max(0, min(4, int(score)))
    return {"ok": bool(ok), "score": score, "label": LABELS[score],
            "issues": issues, "pwned": 0, "online": False}


def strength(password: str, nickname: str = "") -> dict:
    """只看密码本身长什么样，不发任何网络请求。"""
    pw = password or ""
    n = len(pw)
    if not pw:
        return _result(False, 0, ["密码不能为空"])
    if n < 8:
        return _result(False, 0, ["密码至少 8 位"])
    if n > 128:
        return _result(False, 0, ["密码太长（上限 128 位）"])

    issues: list[str] = []
    classes = sum(bool(re.search(p, pw)) for p in (r"[a-z]", r"[A-Z]", r"\d", r"[^A-Za-z0-9]"))

    if n >= 16:
        score = 4
    elif n >= 12:
        score = 3
    elif n >= 10:
        score = 2
    else:
        score = 1

    if classes >= 3:
        score += 1
    elif classes == 1:
        score -= 1
        issues.append("别只用一种字符（比如纯数字或纯字母）")
    if REPEATS.search(pw):
        score -= 1
        issues.append("别用连续重复的字符（aaa、111）")
    if SEQUENCES.search(pw):
        score -= 1
        issues.append("别用键盘上挨着的顺序（1234、qwer）")

    nick = (nickname or "").strip().lower()
    if len(nick) >= 3 and nick in pw.lower():
        score -= 2
        issues.append("密码里不要放昵称")

    # 只有一种字符的密码，再长也不给高分。
    if classes == 1:
        score = min(score, 2)

    score = max(0, min(4, score))
    return _result(score >= 2, score, issues)


def hibp_count(password: str):
    """返回这个密码在公开泄露库里出现的次数；查不到（网络问题）返回 None。"""
    digest = hashlib.sha1(password.encode("utf-8")).hexdigest().upper()
    prefix, suffix = digest[:5], digest[5:]
    now = time.time()

    with _hibp_lock:
        cached = _hibp_cache.get(prefix)
        if cached and now - cached[0] < HIBP_CACHE_TTL:
            body = cached[1]
        else:
            body = None

    if body is None:
        try:
            req = urllib.request.Request(
                HIBP_URL + prefix,
                headers={"User-Agent": "bjtupixelcampus-password-check"})
            with urllib.request.urlopen(req, timeout=HIBP_TIMEOUT) as resp:
                body = resp.read().decode("utf-8", "ignore")
        except Exception:
            return None
        with _hibp_lock:
            _hibp_cache[prefix] = (now, body)
            if len(_hibp_cache) > HIBP_CACHE_MAX:
                for key in list(_hibp_cache)[:500]:
                    _hibp_cache.pop(key, None)

    for line in body.splitlines():
        head, _, count = line.partition(":")
        if head.strip().upper() == suffix:
            try:
                return int(count.strip())
            except ValueError:
                return 1
    return 0


def check(password: str, nickname: str = "") -> dict:
    """完整校验：本地规则 + 常见表 + 泄露库。注册接口用的就是这个。"""
    result = strength(password, nickname)
    pw = password or ""
    if not pw or len(pw) > 128:
        return result

    if pw.lower() in common_passwords():
        result["issues"].insert(0, "这个密码在常见泄露密码库里出现过，换一个")
        result["score"] = min(result["score"], 1)
        result["ok"] = False

    count = hibp_count(pw)
    if count is not None:
        result["online"] = True
        result["pwned"] = count
        if count > 0:
            result["issues"].insert(0, f"这个密码在公开泄露库中出现过 {count} 次，换一个")
            result["score"] = min(result["score"], 1)
            result["ok"] = False

    result["score"] = max(0, min(4, result["score"]))
    result["label"] = LABELS[result["score"]]
    # 提示去重，别把同一句话刷两遍。
    seen, uniq = set(), []
    for item in result["issues"]:
        if item not in seen:
            seen.add(item)
            uniq.append(item)
    result["issues"] = uniq
    return result


if __name__ == "__main__":
    import sys
    samples = sys.argv[1:] or [
        "123456", "password", "abc12345", "aaaaaaaa", "qwerty123",
        "campus2026", "Bjtupixel@2026", "correcthorsebatterystaple",
    ]
    for item in samples:
        r = check(item)
        print("%-28s %s  %s  泄露:%s  提示:%s" % (
            item, r["score"], r["label"], r["pwned"] if r["online"] else "未查",
            "；".join(r["issues"]) or "无"))
