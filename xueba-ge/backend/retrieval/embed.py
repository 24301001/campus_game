"""向量化：provider 可插拔。

构建期算**文档**向量（离线跑一次，固化进 doc_vecs.f32），运行期只算**查询**向量。
所以运行时真正需要 embedding 模型的只有「一句话」这一小段，代价很小。

| provider | 是什么 | 什么时候用 |
|---|---|---|
| `hash` | 零依赖、确定性的哈希词袋向量 | 单测和断网兜底。它是「带散列的第二条字面路」，**不是语义** |
| `api`  | OpenAI 兼容 `/v1/embeddings`（现在是百炼 `qwen3.7-text-embedding-flash`，512 维） | 生产默认：43 条回归上召回最好（对照数字见 README §8） |
| `onnx` | `models/bge-small-zh-v1.5` int8，本机 CPU 推理，**和浏览器同一份模型** | 要离线跑、或端上自己算查询向量时用（`onnx_embed`） |

⚠️ 诚实口径：`hash` **不是语义模型**，它是「带散列的第二条字面路」，所以单测里那份
配置（`tests/conftest.py:offline_cfg`）故意把它钉死成 hash —— 链路一样，数字不同。
provider 和索引必须是同一空间，这件事由 `engine._align_vectors` 强制核对。
"""

from __future__ import annotations

import hashlib
import os
import time
from typing import Sequence

import numpy as np

from ..settings import resolve_key
from .tokenize import normalize, tokens


class EmbedError(RuntimeError):
    pass


def doc_text(c: dict) -> str:
    """向量侧要嵌入的那段文本 = 课程｜章节标题 + 正文。

    规则只有这一份：建索引（`kb/build.py`）和运行期重算（`engine._align_vectors`）
    都必须走它。两边各写一遍字符串拼接，迟早出现"改了构建侧、运行期算出来的向量
    和索引里的不是一个东西"—— 那种 bug 不会报错，只会让排序悄悄变差。
    """
    return (f"{c.get('course', '')}｜{c.get('chapter', '')} {c.get('section', '')}\n"
            f"{c.get('text', '')}")


def _term_stream(text: str) -> list[str]:
    """分词结果 + CJK 字符 bigram。

    bigram 是刻意加的：分词器把「进程和线程啥区别」切成 进程/和/线程/啥/区别，
    和课本里的「进程与线程的区别」只差一个虚词；bigram 让两者还能重叠若干槽位，
    于是 hash 路至少带一点「近似字面」的软匹配，而不是纯精确词命中。
    """
    out = list(tokens(text))
    s = normalize(text)
    for i in range(len(s) - 1):
        pair = s[i:i + 2]
        if any("\u4e00" <= c <= "\u9fff" for c in pair) and not pair[0].isspace() and not pair[1].isspace():
            out.append(pair)
    return out


def _hash_vec(text: str, dim: int, df_of=None, n_docs: int = 0) -> np.ndarray:
    """tf-idf 加权的散列词袋。

    **idf 这一步不是可选的**。不加权时，52 条校园切片互相之间共享同一句模板
    （"……是校园总平面里的一项……"），任何提问都能和这堆模板句撞出高余弦，
    第二条腿反而往榜单里灌噪声。乘上 idf 之后，模板句和虚词自己就沉下去了。
    """
    v = np.zeros(dim, dtype=np.float32)
    tf: dict[str, int] = {}
    for t in _term_stream(text):
        tf[t] = tf.get(t, 0) + 1
    if not tf:
        return v
    for term, cnt in tf.items():
        w = (1.0 + float(np.log(cnt)))
        if df_of is not None and n_docs:
            import math
            df = df_of(term)
            if df == 0:
                continue                      # 全库没有这个词：它对匹配不贡献信息
            w *= math.log(1.0 + n_docs / df)
        h = hashlib.md5(term.encode("utf-8")).digest()
        idx = int.from_bytes(h[:4], "little") % dim
        v[idx] += (w if h[4] & 1 else -w)
    n = float(np.linalg.norm(v))
    return v / n if n else v


def _api_vecs(texts: Sequence[str], cfg: dict) -> np.ndarray:
    """走 OpenAI 兼容的 `/v1/embeddings`。三处约束都是实测出来的，不是拍的：

    · **一批最多 10 条** —— 64 条服务商直接 400，所以 `batch` 默认 10；
    · **并发** —— 全库 23 519 片串行要 10 分钟，按 `concurrency` 并发实测 1 分半；
    · **`dimensions` 要显式传** —— 不传就是 1024 维，float32 落盘 92 MB；砍到 512 维
      内存和加载时间都省一半，`recall@3` 在评测上看不出差别（换维要重跑 `kb.build`）。

    限流是偶发的，所以每批退避重三次；三次都不通才抛 —— 运行期这一抛，
    `engine.search()` 会把向量路整条摘掉只走 BM25，不会把用户的提问打回 500。
    """
    key = resolve_key(cfg)
    if not key:
        env = cfg.get("key_env") or "key"
        raise EmbedError(f"embedding provider=api 需要密钥：环境变量 {env} 未设置，"
                         f"密钥文件也没读到（见 settings.resolve_key）")
    import requests

    url = cfg["base_url"].rstrip("/") + "/embeddings"
    items = list(texts)
    batch = max(1, int(cfg.get("batch", 10)))
    workers = max(1, int(cfg.get("concurrency", 8)))
    dim = int(cfg.get("dim", 0) or 0)
    timeout = cfg.get("timeout", 30)
    tries = max(1, int(cfg.get("retries", 3)))
    jobs = [(i, items[i:i + batch]) for i in range(0, len(items), batch)]

    def one(job):
        i, part = job
        body = {"model": cfg["model"], "input": list(part)}
        if dim:
            body["dimensions"] = dim
        last: Exception | None = None
        for attempt in range(tries):
            try:
                r = requests.post(url, json=body, timeout=timeout,
                                  headers={"Authorization": f"Bearer {key}"})
                if r.status_code >= 400:
                    raise EmbedError(f"embedding 接口返回 {r.status_code}: {r.text[:200]}")
                data = sorted(r.json()["data"], key=lambda d: d.get("index", 0))
                vecs = [d["embedding"] for d in data]
                if len(vecs) != len(part):
                    raise EmbedError(f"embedding 返回 {len(vecs)} 条，要 {len(part)} 条")
                return i, vecs
            except (EmbedError, requests.RequestException) as exc:   # noqa: PERF203
                last = exc
                time.sleep(0.6 * (attempt + 1))
        raise EmbedError(f"embedding 接口连试 {tries} 次都不通：{last}")

    if len(jobs) > 1 and workers > 1:
        from concurrent.futures import ThreadPoolExecutor

        with ThreadPoolExecutor(max_workers=workers) as pool:
            got = dict(pool.map(one, jobs))
    else:
        got = dict(one(j) for j in jobs)
    out: list[list[float]] = []
    for i, part in jobs:
        out += got[i]
    return np.asarray(out, dtype=np.float32)


def embed(texts: Sequence[str], cfg: dict, *, df_of=None, n_docs: int = 0) -> np.ndarray:
    """返回**行已归一化**的 (n, dim) float32，可直接与 doc_vecs.f32 做点积取余弦。"""
    cfg = cfg or {}
    provider = cfg.get("provider", "hash")
    dim = int(cfg.get("dim", 256))
    items = [t if t else " " for t in texts]
    if not items:
        return np.zeros((0, dim), dtype=np.float32)
    if provider == "hash":
        mat = np.vstack([_hash_vec(t, dim, df_of, n_docs) for t in items])
    elif provider == "api":
        mat = _api_vecs(items, cfg)
    elif provider == "onnx":
        # 浏览器同款模型本地跑：见 onnx_embed 的模块注释（为什么两边必须一份规则、三份对齐）
        from .onnx_embed import get_encoder

        enc = get_encoder(cfg)
        if dim and enc.dim != dim:
            raise EmbedError(f"配置 dim={dim} 但模型输出 {enc.dim} 维：bge-small-zh 就是 512 维，"
                             f"改 config 或者换模型，别偷偷截断")
        mat = enc.embed(items, batch=int(cfg.get("batch", 32)))
    else:
        raise EmbedError(f"未知 embedding provider: {provider}")
    norms = np.linalg.norm(mat, axis=1, keepdims=True)
    norms[norms == 0] = 1.0
    return np.ascontiguousarray(mat / norms, dtype=np.float32)


def describe(cfg: dict | None) -> dict:
    """这套配置**实际**会用到哪个向量空间：{provider, model, dim}。

    建索引（`kb.build` 写 meta）和运行期对账（`engine._align_vectors`）**必须都从这里取**，
    否则两边各抄一遍配置，抄出来的口径能差出一个模型名（onnx 那条就撞过：meta 里写的是
    服务商的模型名，实际跑的是 `models/bge-small-zh-v1.5`）。
    """
    cfg = cfg or {}
    provider = cfg.get("provider", "hash")
    if provider == "hash":
        return {"provider": "hash", "model": "", "dim": int(cfg.get("dim", 256))}
    if provider == "onnx":
        from .onnx_embed import model_id
        return {"provider": "onnx", "model": model_id(cfg), "dim": int(cfg.get("dim", 0) or 0)}
    return {"provider": provider, "model": cfg.get("model", ""),
            "dim": int(cfg.get("dim", 0) or 0)}


def probe(cfg: dict) -> dict:
    """启动自检用：这个 provider 现在到底能不能算。"""
    try:
        mat = embed(["自检：TCP 三次握手"], cfg)
        return {"ok": True, "provider": cfg.get("provider", "hash"), "dim": int(mat.shape[1])}
    except Exception as exc:                       # noqa: BLE001 - 自检不该把服务带崩
        return {"ok": False, "provider": cfg.get("provider", "hash"), "error": str(exc)[:300]}
