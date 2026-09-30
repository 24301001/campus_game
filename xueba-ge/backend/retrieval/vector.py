"""向量路：暴力余弦。

文档向量在**离线预处理阶段就算好并固化**成一个 float32 裸数组，每行已归一化，
于是运行时一次余弦就退化成一次矩阵乘 —— 4200×256 的 float32 只有 4.3 MB，
numpy 读一遍比建任何索引都快。

预留的切换点：语料超过十万条时，把 `rank()` 换成 HNSW 实现即可，
接口不变（仍是 `rank(qvec) -> [(doc_idx, cos)]`）—— 那是配置项，不是重写。
"""

from __future__ import annotations

import numpy as np


class VectorIndex:
    def __init__(self, mat: np.ndarray):
        if mat.ndim != 2:
            raise ValueError("向量矩阵必须是 (n_docs, dim)")
        self.mat = np.ascontiguousarray(mat, dtype=np.float32)
        self.n_docs, self.dim = self.mat.shape

    def rank(self, qvec, top: int | None = None) -> list[tuple[int, float]]:
        if qvec is None:
            return []
        q = np.asarray(qvec, dtype=np.float32).ravel()
        if q.size != self.dim:
            raise ValueError(f"查询向量维度 {q.size} 与索引维度 {self.dim} 不一致")
        n = np.linalg.norm(q)
        if n == 0.0:
            return []
        sims = self.mat @ (q / n)
        k = self.n_docs if top is None else min(top, self.n_docs)
        if k <= 0:
            return []
        idx = np.argpartition(-sims, k - 1)[:k]
        idx = idx[np.argsort(-sims[idx], kind="stable")]
        return [(int(i), float(sims[i])) for i in idx]

    # ---------- 读写：float32 裸数组 + 同名 .json 记形状 ----------
    @staticmethod
    def save(mat: np.ndarray, path: str) -> None:
        mat = np.ascontiguousarray(mat, dtype=np.float32)
        with open(path, "wb") as fh:
            fh.write(mat.tobytes(order="C"))

    @classmethod
    def load(cls, path: str, n_docs: int, dim: int) -> "VectorIndex":
        need = n_docs * dim * 4
        import os

        have = os.path.getsize(path)
        if have != need:
            raise ValueError(f"{path} 大小 {have} != n_docs*dim*4 = {need}，索引与语料不同步，重跑 kb/build.py")
        mat = np.fromfile(path, dtype=np.float32, count=n_docs * dim).reshape(n_docs, dim)
        return cls(mat)