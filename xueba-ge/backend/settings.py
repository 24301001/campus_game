"""配置与路径的唯一入口。所有模块从这里读，没有第二份。"""

from __future__ import annotations

import json
import os
from typing import Any

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONFIG_DIR = os.path.join(ROOT, "config")
WEB_DIR = os.path.join(ROOT, "web")
MODELS_DIR = os.path.join(ROOT, "models")     # 端上/服务端共用同一份 ONNX 模型，不许有第二份副本
DATA_DIR = os.environ.get("XBG_DATA") or os.path.join(ROOT, "data")
INDEX_DIR = os.path.join(ROOT, "kb", "index")
DB_PATH = os.environ.get("XBG_DB") or os.path.join(DATA_DIR, "xueba.db")

_cache: dict[str, tuple[float, Any]] = {}


def load_config(name: str, default: Any = None) -> Any:
    """按 mtime 缓存地读 config/*.json。改配置不用重启。"""
    path = os.path.join(CONFIG_DIR, f"{name}.json")
    if not os.path.exists(path):
        return default if default is not None else {}
    mtime = os.path.getmtime(path)
    hit = _cache.get(name)
    if hit and hit[0] == mtime:
        return hit[1]
    with open(path, "r", encoding="utf-8") as fh:
        data = json.load(fh)
    data = {k: v for k, v in data.items() if not k.startswith("_")} if isinstance(data, dict) else data
    _cache[name] = (mtime, data)
    return data


def ensure_dirs() -> None:
    os.makedirs(DATA_DIR, exist_ok=True)
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)


def secret() -> bytes:
    """token 签名密钥。生产用环境变量，开发期落盘一份，免得每次重启把登录态踢掉。"""
    env = os.environ.get("XBG_SECRET")
    if env:
        return env.encode("utf-8")
    path = os.path.join(DATA_DIR, ".secret")
    if os.path.exists(path):
        with open(path, "rb") as fh:
            return fh.read()
    import secrets

    raw = secrets.token_bytes(32)
    with open(path, "wb") as fh:
        fh.write(raw)
    return raw


def key_file(cfg: dict, default: str = ".llm_key") -> str:
    """本地开发用的密钥文件（默认 `data/.llm_key`，`data/` 已在 .gitignore 里）。
    服务器上不用它：那里用环境变量，优先级排在它前面。"""
    name = cfg.get("key_file") or default
    path = name if os.path.isabs(name) else os.path.join(DATA_DIR, name)
    try:
        with open(path, "r", encoding="utf-8") as fh:
            return fh.read().strip()
    except OSError:
        return ""


def resolve_key(cfg: dict, default: str = ".llm_key") -> str:
    """Key 的三处来源，按优先级：环境变量 -> 配置里的 `key` -> 密钥文件。

    生成层（llm.py）和向量层（retrieval/embed.py）**共用这一份口径**。以前它长在 llm.py 里，
    向量层只认环境变量，于是本地开发明明有 `data/.llm_key` 却报"没找到密钥" ——
    同一个规则写两遍，早晚会有一处忘了改。"""
    env = (cfg.get("key_env", "") or "").strip()
    return ((os.environ.get(env, "").strip() if env else "")
            or (cfg.get("key") or "").strip()
            or key_file(cfg, default))
