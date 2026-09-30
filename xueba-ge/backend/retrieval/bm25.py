"""Okapi BM25 倒排索引。

语料只有几千片，**纯 Python 字典就是最优解**：建索引 O(词数)，查询只走命中的
posting list，复杂度与语料总量无关。上 whoosh / FAISS 都是负收益。

这一路负责的是「字面」：专有词、术语、公式名 —— "三次握手""B+ 树"这种，
字面比语义更准。它不懂意思，所以必须和向量路配着用（见 engine.py）。
"""

from __future__ import annotations

import math
from typing import Iterable

K1 = 1.4
B = 0.75
MAX_DF_RATIO = 0.35     # 词出现在 35% 以上文档里视为虚词，不参与打分


class BM25Index:
    def __init__(self, postings, doc_len, k1=K1, b=B, max_df_ratio=MAX_DF_RATIO):
        # postings: {term: (doc_idx 升序 tuple, tf tuple)}
        self.postings = postings
        self.doc_len = list(doc_len)
        self.n_docs = len(self.doc_len)
        self.avg_len = (sum(self.doc_len) / self.n_docs) if self.n_docs else 0.0
        self.k1 = k1
        self.b = b
        self.max_df_ratio = max_df_ratio

    # ---------- 构建 ----------
    @classmethod
    def build(cls, token_lists: Iterable[Iterable[str]], k1=K1, b=B) -> "BM25Index":
        acc: dict[str, dict[int, int]] = {}
        doc_len: list[int] = []
        for di, toks in enumerate(token_lists):
            n = 0
            tf: dict[int, int] = {}
            for t in toks:
                tf[t] = tf.get(t, 0) + 1
                n += 1
            doc_len.append(n)
            for t, c in tf.items():
                acc.setdefault(t, {})[di] = c
        postings = {t: (tuple(d), tuple(tf)) for t, (d, tf) in
                    ((t, (sorted(v), [v[d] for d in sorted(v)])) for t, v in acc.items())}
        return cls(postings, doc_len, k1, b)

    # ---------- 查询 ----------
    def idf(self, term: str) -> float:
        n = len(self.postings.get(term, ((), ()))[0])
        if not n:
            return 0.0
        return math.log(1.0 + (self.n_docs - n + 0.5) / (n + 0.5))

    def _informative(self, qterms: list[str]) -> list[str]:
        """滤掉「出现在超过 MAX_DF 比例文档里」的词。

        「之前 / 区别 / 怎么 / 是什么」这类词在几千片里几乎页页都有，判别力为零，
        留着它们只会让**无关但恰好带这些虚词**的片段冲到榜首。若全被滤掉则原样返回
        （否则"什么是"这种问法就彻底查不动了）。
        """
        # 先只看"库里确实有的词"：df==0 的词（"什么"、错别字）留在 keep 里会
        # 把 keep 撑成非空，让下面那句兜底失效 —— 实测就是这样把 叶子/结点
        # 全滤掉、只剩一个"什么"，结果整条查询零命中。
        present = [t for t in qterms if t in self.postings]
        if not present:
            return qterms                      # 一个都没有：原样交给上层判低置信
        limit = self.max_df_ratio * self.n_docs
        keep = [t for t in present if len(self.postings[t][0]) <= limit]
        return keep or present

    def score(self, qterms: list[str]) -> dict[int, float]:
        """返回 {doc_idx: bm25 分}，只包含至少命中一个词的文档。"""
        out: dict[int, float] = {}
        k1, b, av = self.k1, self.b, self.avg_len or 1.0
        for t in self._informative(qterms):
            p = self.postings.get(t)
            if p is None:
                continue
            docs, tfs = p
            idf = math.log(1.0 + (self.n_docs - len(docs) + 0.5) / (len(docs) + 0.5))
            if idf <= 0.0:
                continue
            for d, f in zip(docs, tfs):
                dl = self.doc_len[d]
                out[d] = out.get(d, 0.0) + idf * (f * (k1 + 1.0)) / (f + k1 * (1.0 - b + b * dl / av))
        return out

    def rank(self, qterms: list[str]) -> list[int]:
        return [d for d, _ in sorted(self.score(qterms).items(), key=lambda kv: (-kv[1], kv[0]))]

    def coverage(self, qterms: list[str]) -> float:
        """查询词里有多少个真的存在于索引中。全为 0 = 用户问了本库根本没有的东西。"""
        if not qterms:
            return 0.0
        hit = sum(1 for t in qterms if t in self.postings)
        return hit / len(qterms)

    def df(self, term: str) -> int:
        return len(self.postings.get(term, ((), ()))[0])

    # ---------- 序列化（离线建，运行时只读） ----------
    def to_dict(self) -> dict:
        return {
            "k1": self.k1,
            "max_df_ratio": self.max_df_ratio,
            "b": self.b,
            "doc_len": self.doc_len,
            "postings": {t: {"d": list(d), "f": list(f)} for t, (d, f) in self.postings.items()},
        }

    @classmethod
    def from_dict(cls, raw: dict) -> "BM25Index":
        postings = {t: (tuple(v["d"]), tuple(v["f"])) for t, v in raw["postings"].items()}
        return cls(postings, raw["doc_len"], raw.get("k1", K1), raw.get("b", B), max_df_ratio=raw.get("max_df_ratio", MAX_DF_RATIO))
