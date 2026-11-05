# -*- coding: utf-8 -*-
"""限流计数：优先走 Redis，连不上就退回进程内内存。

为什么要它：

1. 计数是滑动的 60 秒窗口，Redis 的 ZSET 天生就是干这个的：
   进一个请求写一个成员，读的时候按分数区间数一下，永远准。
2. 进程重启不清零，将来开多进程 / 多台机器时天然共享同一份计数。
3. Redis 挂了不能让网站跟着挂：连续出错三次就熔断 30 秒，
   这期间全部走内存，直到 Redis 恢复。

对外只有三个动作：hit（记一次并返回次数）、count（只数不记）、reset（清零）。
"""
from __future__ import annotations

import os
import threading
import time

REDIS_URL = os.environ.get("MP_REDIS_URL", "redis://127.0.0.1:6379/0")
FAIL_LIMIT = 3          # 连续失败几次就熔断
FAIL_COOLDOWN = 30      # 熔断多少秒
SOCKET_TIMEOUT = 0.4    # 单次操作最多等多久，不能拖慢正常请求


class _Memory:
    """Redis 不可用时的兜底：和改造前一样，纯进程内 list。"""

    def __init__(self):
        self.data: dict[str, list] = {}
        self.lock = threading.Lock()

    def hit(self, key: str, window: int, limit: int | None):
        now = time.time()
        with self.lock:
            queue = self.data.setdefault(key, [])
            while queue and now - queue[0] > window:
                queue.pop(0)
            if limit is not None and len(queue) >= limit:
                return len(queue), False
            queue.append(now)
            if len(self.data) > 20000:      # 极端情况下别把内存撑爆
                for old in list(self.data)[:5000]:
                    if not self.data[old] or now - self.data[old][-1] > window:
                        self.data.pop(old, None)
            return len(queue), True

    def count(self, key: str, window: int) -> int:
        now = time.time()
        with self.lock:
            queue = self.data.get(key) or []
            while queue and now - queue[0] > window:
                queue.pop(0)
            return len(queue)

    def reset(self, key: str):
        with self.lock:
            self.data.pop(key, None)


class Store:
    def __init__(self):
        self.mem = _Memory()
        self.lock = threading.Lock()
        self.fails = 0
        self.down_until = 0.0
        self._client = None
        self._seq = 0
        self._connect()

    # -- 连接与熔断 ---------------------------------------------------------
    def _connect(self):
        with self.lock:
            if self._client is not None:
                return
            try:
                import redis
                client = redis.Redis.from_url(
                    REDIS_URL, decode_responses=True,
                    socket_connect_timeout=SOCKET_TIMEOUT, socket_timeout=SOCKET_TIMEOUT)
                client.ping()
                self._client = client
                self.fails = 0
                print(f"[cache] 限流计数走 Redis：{REDIS_URL}")
            except Exception as exc:
                self._client = None
                self.down_until = time.time() + FAIL_COOLDOWN
                print(f"[cache] Redis 不可用（{exc.__class__.__name__}），先用进程内存计数")

    def _redis_ready(self) -> bool:
        now = time.time()
        if self._client is None:
            if now >= self.down_until:
                self._connect()
            return self._client is not None
        return now >= self.down_until

    def _failed(self):
        with self.lock:
            self.fails += 1
            if self.fails >= FAIL_LIMIT:
                self.down_until = time.time() + FAIL_COOLDOWN
                print("[cache] Redis 连续出错，熔断 30 秒，期间走内存")

    def _succeeded(self):
        with self.lock:
            self.fails = 0

    @property
    def backend(self) -> str:
        return "redis" if self._client is not None else "memory"

    # -- 对外接口 -----------------------------------------------------------
    def hit(self, key: str, window: int = 60, limit: int | None = None):
        """记一次，返回 (这一窗口内的次数, 是否放行)。次数含这次。"""
        if self._redis_ready():
            try:
                now = time.time()
                client = self._client
                pipe = client.pipeline()
                pipe.zremrangebyscore(key, 0, now - window)
                pipe.zcard(key)
                _, count = pipe.execute()
                if limit is not None and count >= limit:
                    client.expire(key, window * 2)
                    self._succeeded()
                    return count, False
                with self.lock:
                    self._seq += 1
                    seq = self._seq
                client.zadd(key, {f"{now:.6f}:{os.getpid()}:{seq}": now})
                client.expire(key, window * 2)
                self._succeeded()
                return count + 1, True
            except Exception:
                self._failed()
        return self.mem.hit(key, window, limit)

    def count(self, key: str, window: int = 60) -> int:
        """只数不记。读的时候先剪掉窗口外的，所以永远不会拿到陈年旧数。"""
        if self._redis_ready():
            try:
                now = time.time()
                pipe = self._client.pipeline()
                pipe.zremrangebyscore(key, 0, now - window)
                pipe.zcard(key)
                _, count = pipe.execute()
                self._succeeded()
                return count
            except Exception:
                self._failed()
        return self.mem.count(key, window)

    def reset(self, key: str):
        if self._redis_ready():
            try:
                self._client.delete(key)
                self._succeeded()
            except Exception:
                self._failed()
        self.mem.reset(key)


store = Store()
