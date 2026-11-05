"""Reranker（交叉编码器精排）。

**接口形状是按服务商实测写的，不是照抄文档。** 百炼的 `qwen3.7-text-rerank` 实测：
OpenAI 那种 `POST {base}/v1/rerank` **返回 404**，只有原生口能用
（`.../api/v1/services/rerank/text-rerank/text-rerank`，请求体分 `input` / `parameters` 两层，
结果在 `output.results[]`，每条是 `{index, relevance_score}`）。12 个候选一次调用 156–174 ms。

默认还是关（`provider: none`），但"关不关"从此不必靠猜：
`python eval/run_eval.py --rerank` 能量出开与不开的 recall@3 / MRR 差多少。
关着的真实理由是本机 CPU 上跑 `bge-reranker-base` 要 2–6 秒，会把首字延迟从 1 秒拖到 6 秒；
换成外部接口之后代价变成一次约 170 ms 的网络调用，那是**另一个决定**，见 README §8。

三条不能改的行为：
  · 没 Key / 没地址 → 原样返回，不报错。精排是锦上添花，配置缺失不该打挂检索；
  · HTTP >= 400 / 超时 → 原样返回，但计进 `failures`，评测会把它印出来 ——
    否则"精排没效果"的结论可能其实只是"精排没跑成"；
  · **不覆盖 `norm`**。`norm` 是 RRF 归一化置信度，接口契约里靠它卡 `min_norm` 和拒答判据；
    精排分是另一个量纲（而且不同服务商尺度不同），只写进 `rerank` 字段，两者不许互相冒充。

provider:
  `none`  直接透传（默认）
  `api`   HTTP 精排服务，两种请求体用 `shape` 选：`dashscope`（百炼原生）/ `openai`（jina、cohere 等）
  `onnx`  本地交叉编码器接入点，未实现
"""

from __future__ import annotations

import time

from ..settings import resolve_key


class Reranker:
    def __init__(self, cfg: dict | None = None):
        cfg = cfg or {}
        self.cfg = cfg
        self.provider = cfg.get("provider", "none")
        self.max_chars = int(cfg.get("max_chars", 800))
        self.calls = 0
        self.failures = 0
        self.last_error = ""
        self.total_ms = 0.0

    def enabled(self) -> bool:
        return self.provider != "none"

    def stats(self) -> dict:
        """给评测和 /api/health 看的自报家门：跑了几次、失败过没有、平均多少毫秒。"""
        return {"provider": self.provider, "model": self.cfg.get("model", ""),
                "calls": self.calls, "failures": self.failures,
                "avg_ms": round(self.total_ms / self.calls, 1) if self.calls else 0.0,
                "last_error": self.last_error[:200]}

    # ---------- 主入口 ----------
    def apply(self, query: str, hits: list, text_of, top_k: int) -> list:
        """按精排分**重排全部候选**，返回顺序变了的列表。

        `top_k` 只表达"调用方最终要几条"，这里不截断：截断之后就没法做分库配额了，
        而配额必须建立在精排后的顺序上。
        """
        if not self.enabled() or len(hits) <= 1:
            return hits
        if self.provider == "api":
            return self._api(query, hits, text_of)
        if self.provider == "onnx":
            raise RuntimeError("rerank provider=onnx 未接入，见 README「换真模型」")
        return hits

    # ---------- HTTP ----------
    def _url(self) -> str:
        u = (self.cfg.get("url") or "").strip()
        if u:
            return u
        base = (self.cfg.get("base_url") or "").strip()
        if not base:
            return ""
        return base if base.rstrip("/").endswith("/rerank") else base.rstrip("/") + "/rerank"

    def _shape(self, url: str) -> str:
        got = (self.cfg.get("shape") or "").strip().lower()
        if got:
            return got
        return "dashscope" if "/services/rerank/" in url else "openai"

    def _api(self, query: str, hits: list, text_of) -> list:
        url, key = self._url(), resolve_key(self.cfg)
        if not url or not key:
            return hits                                  # 没配全就当没开，不把用户的请求打断
        import requests

        docs = [str(text_of(h) or "")[: self.max_chars] for h in hits]
        model = self.cfg.get("model", "")
        if self._shape(url) == "dashscope":
            body = {"model": model, "input": {"query": query, "documents": docs},
                    "parameters": {"top_n": len(docs), "return_documents": False}}
        else:
            body = {"model": model, "query": query, "documents": docs, "top_n": len(docs)}
        self.calls += 1
        t0 = time.perf_counter()
        try:
            r = requests.post(url, json=body, timeout=self.cfg.get("timeout", 15),
                              headers={"Authorization": f"Bearer {key}",
                                       "Content-Type": "application/json"})
            if r.status_code >= 400:
                self.failures += 1
                self.last_error = f"HTTP {r.status_code}: {r.text[:200]}"
                return hits
            payload = r.json()
            results = (payload.get("output") or {}).get("results") or payload.get("results") or []
        except Exception as exc:                          # noqa: BLE001 - 精排挂了不能带崩检索
            self.failures += 1
            self.last_error = f"{type(exc).__name__}: {exc}"
            return hits
        self.total_ms += (time.perf_counter() - t0) * 1000
        return self._reorder(hits, results)

    @staticmethod
    def _reorder(hits: list, results: list) -> list:
        """把服务商给的 `(index, relevance_score)` 落回 hit 上。

        认三种字段名（`relevance_score` / `relevance` / `score`）—— 这几家接口没一家统一，
        而**取不到分就把整次精排丢掉**太脆：顺序已经按它给的结果排了，分数只影响展示。
        没返回的候选垫回原来的相对顺序，不凭空丢掉（少一条可能就是少一个出处）。
        """
        out, seen = [], set()
        for item in results or []:
            try:
                i = int(item.get("index", -1))
            except (TypeError, ValueError):
                continue
            if not 0 <= i < len(hits) or i in seen:
                continue
            seen.add(i)
            h = hits[i]
            h.paths = list(dict.fromkeys(list(h.paths) + ["rerank"]))
            raw = item.get("relevance_score", item.get("relevance", item.get("score")))
            if raw is not None:
                try:
                    h.rerank = float(raw)
                except (TypeError, ValueError):
                    pass
            out.append(h)
        left = {x.doc_idx for x in out}
        out += [h for h in hits if h.doc_idx not in left]
        return out