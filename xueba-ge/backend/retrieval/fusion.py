"""融合层：分库配额 + RRF。

两件事，缺一不可：

1. **分库配额**（多科场景的头号坑）。OS 喂了 1000 片、软工只喂 200 片，
   全局 top-5 会被厚书包圆。所以每条榜单**先按书名各取 per_book 条**，再融合。
2. **RRF**（Reciprocal Rank Fusion）。两路榜单的量纲完全不同（BM25 分值无上界、
   余弦在 [-1,1]），比分数是错的；比名次才对。`score = Σ 1/(k + rank)`，k=60 是原论文的默认。
"""

from __future__ import annotations

RRF_K = 60


def per_book_cap(ranked: list, book_of, per_book: int) -> list:
    """按书名截断榜单：每本最多 per_book 条，保持原有相对次序。"""
    if per_book <= 0:
        return list(ranked)
    used: dict[str, int] = {}
    out = []
    for item in ranked:
        book = book_of(item)
        c = used.get(book, 0)
        if c >= per_book:
            continue
        used[book] = c + 1
        out.append(item)
    return out


def rrf(rank_lists: dict[str, list], k: int = RRF_K, weights: dict[str, float] | None = None,
        prior_of=None) -> dict:
    """{榜单名: [item...]} -> {item: 融合分}。item 必须可哈希（这里用 doc_idx）。

    `prior_of(item)` 返回 0~1 的类型先验，**按名次惩罚**（`rank / prior`）而不是
    乘在融合分上。差别很大：第 1 名和第 10 名在 RRF 里只差 15%，直接乘 0.68 的
    先验会把差距吃掉，让一篇勉强沾边的往年卷把真正的课本正文挤下去。
    惩罚名次则只把它往后挪一点点 —— 先验该是微调，不该是否决权。
    """
    weights = weights or {}
    out: dict = {}
    for name, ranked in rank_lists.items():
        w = weights.get(name, 1.0)
        for rank, item in enumerate(ranked, start=1):
            p = 1.0 if prior_of is None else max(0.05, float(prior_of(item)))
            out[item] = out.get(item, 0.0) + w / (k + rank / p)
    return out


def rrf_ranks(rank_lists: dict[str, list]) -> dict:
    """记录每个 item 在各榜单里的名次，给「双路都命中」的判据用。"""
    out: dict = {}
    for name, ranked in rank_lists.items():
        for rank, item in enumerate(ranked, start=1):
            out.setdefault(item, {})[name] = rank
    return out


def rank_by_score(scores: dict, pool: set | None = None) -> list:
    items = scores.keys() if pool is None else [d for d in pool]
    return sorted(items, key=lambda d: (-scores.get(d, 0.0), d))


def theoretical_max(n_lists: int, k: int = RRF_K) -> float:
    """一篇文档在两路都排第一时的满分，用来把融合分归一成 0~1 的置信度。"""
    return n_lists / (k + 1)