"""索引装载：把 kb/index/ 下的静态文件读进内存，进程启动时一次。

服务器部署的关键取舍 —— 索引**在服务器上常驻一份**、所有用户共享：
  · 比每个访客各自下载几 MB 快得多（这是「服务端检索」优于「浏览器检索」的实际理由）
  · 冷启动只在 uvicorn 启动时发生一次，不摊到第一个用户头上
"""

from __future__ import annotations

import json
import os
import re
import threading

from .bm25 import BM25Index
from .vector import VectorIndex

HERE = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DEFAULT_INDEX_DIR = os.path.join(HERE, "kb", "index")

# 片段 id 形如 `xbg-linalg#p181#i2267`，最后那个 i 在每本书内连续，
# 靠它就能找回邻居原文，不用猜 chunks 列表的顺序。
_ID_RE = re.compile(r"^(?P<b>[^#]+)#p(?P<p>\d+)#i(?P<i>\d+)$")


def _repair_context(chunks: list[dict]) -> None:
    r"""把索引里按字符硬切的相邻上下文，按邻居**全文**重裁一遍。

    2026-09-22 查「点开出处是一行乱码」时定位到的：老索引里 `n_prev = text[-80:]`
    是**按字符**盲切，正好把 `$\boldsymbol{C}$` 劈成 `ol{C}$`。实测 23,519 片里有
    9,849 片（41.9%）的「上文」、9,573 片（40.7%）的「下文」带着配不了对的孤立 `$`，
    前端 KaTeX 一遇到不闭合的 `$` 就整行放弃渲染，用户看到的就是
    `\begin{pmatrix}1 & 0 \\0 & 2 & 0\end{pmatrix}$` 这种源码；同一串还照样喂给模型。

    重建索引能顺带修好，但那会挪动全部片段 id（老会话的「点开原文」集体 404），
    所以改成读取时重裁：纯函数、幂等、只丢字不改字（裁出来的一定是邻居原文的
    逐字子串），`kb/build.py` 跑过之后这里算出来的值和建索引时一模一样。

    为什么要拿邻居全文、而不是就地修那条 80 字的旧串：旧串本身可能就从一个单词
    中间切断（实测留下 `nd wave). 频率低于…`、`ight层第一个结点时…` 这种残字），
    只看这 80 字是查不出「这里断了一半」的，拿原文重裁才知道边界在哪。
    裁不干净的直接给空串 —— 前端那一行整个不显示，比显示半行源码好。
    判据是 `ctx_renderable`（比「`$` 成对」更严：数学式外面还有反斜杠、裸花括号的直接不给）。
    """
    from kb.chunk import ctx_renderable, context_after, context_before   # 规则只有一份，不复制

    by_pos = {}
    for c in chunks:
        m = _ID_RE.match(c.get("id") or "")
        if m:
            by_pos[(m["b"], int(m["i"]))] = c

    for c in chunks:
        m = _ID_RE.match(c.get("id") or "")
        if not m:
            continue                    # id 认不出来的，宁可原样留着也别乱猜邻居
        i = int(m["i"])
        for field, fn, step in (("n_prev", context_before, -1), ("n_next", context_after, 1)):
            nb = by_pos.get((m["b"], i + step))
            if nb is not None and nb.get("text"):
                c[field] = fn(nb["text"])
            else:                       # 书的首/末片：邻居不在库里，退一步只清洗旧串
                raw = c.get(field) or ""
                if raw and not ctx_renderable(raw):
                    c[field] = fn(raw)



class Store:
    """一份只读语料。`maybe_reload()` 让重建索引后不必重启进程。"""

    def __init__(self, index_dir: str | None = None):
        self.index_dir = index_dir or DEFAULT_INDEX_DIR
        self._lock = threading.Lock()
        self.chunks: list[dict] = []
        self.ids: list[str] = []
        self._by_id: dict[str, int] = {}
        self.books: list[str] = []
        self.bm25: BM25Index | None = None
        self.vec: VectorIndex | None = None
        self.meta: dict = {}
        self._fingerprint = None

    # ---------- 加载 ----------
    def _paths(self):
        d = self.index_dir
        return (os.path.join(d, "chunks.jsonl"),
                os.path.join(d, "bm25_index.json"),
                os.path.join(d, "doc_vecs.f32"),
                os.path.join(d, "meta.json"))

    def load(self) -> "Store":
        cpath, bpath, vpath, mpath = self._paths()
        for p in (cpath, bpath):
            if not os.path.exists(p):
                raise FileNotFoundError(f"缺少索引文件 {p} —— 先跑 python -m kb.build")
        with open(cpath, "r", encoding="utf-8") as fh:
            chunks = [json.loads(line) for line in fh if line.strip()]
        _repair_context(chunks)
        with open(bpath, "r", encoding="utf-8") as fh:
            bm25 = BM25Index.from_dict(json.load(fh))
        if len(chunks) != bm25.n_docs:
            raise ValueError(f"chunks({len(chunks)}) 与 BM25 文档数({bm25.n_docs}) 不一致，重跑 kb/build.py")
        meta = {}
        if os.path.exists(mpath):
            with open(mpath, "r", encoding="utf-8") as fh:
                meta = json.load(fh)

        
        vec = None
        if os.path.exists(vpath) and meta.get("embed_dim"):
            try:
                vec = VectorIndex.load(vpath, len(chunks), int(meta["embed_dim"]))
            except ValueError:
                vec = None                       # 向量与语料不同步：降级成单路 BM25，而不是整体崩

        with self._lock:
            self.meta = meta
            self.chunks = chunks
            self.ids = [c["id"] for c in chunks]
            self._by_id = {cid: i for i, cid in enumerate(self.ids)}
            self.books = [c.get("book", "") for c in chunks]
            self.bm25 = bm25
            self.vec = vec
            self._fingerprint = os.path.getmtime(cpath)
        return self

    def maybe_reload(self) -> None:
        cpath = self._paths()[0]
        if os.path.exists(cpath) and os.path.getmtime(cpath) != self._fingerprint:
            self.load()

    # ---------- 访问 ----------
    def doc(self, idx: int) -> dict:
        return self.chunks[idx]

    def by_id(self, chunk_id: str) -> dict | None:
        i = self._by_id.get(chunk_id)
        return None if i is None else self.chunks[i]

    def index_of(self, chunk_id: str) -> int | None:
        return self._by_id.get(chunk_id)

    def book_of(self, idx: int) -> str:
        return self.books[idx] if 0 <= idx < len(self.books) else ""

    def courses(self) -> list[str]:
        seen, out = set(), []
        for c in self.chunks:
            k = c.get("course") or "未分类"
            if k not in seen:
                seen.add(k)
                out.append(k)
        return out

    def source_types(self) -> list[str]:
        return sorted({c.get("source_type", "textbook") for c in self.chunks})

    def stats(self) -> dict:
        return {
            "n_docs": len(self.chunks),
            "courses": self.courses(),
            "books": sorted({c.get("book", "") for c in self.chunks}),
            "source_types": self.source_types(),
            "terms": len(self.bm25.postings) if self.bm25 else 0,
            "tokenizer": self.meta.get("tokenizer"),
            "vector_docs": (self.vec.n_docs if self.vec else 0),
            "embed_dim": self.meta.get("embed_dim"),
            "embed_provider": self.meta.get("embed_provider"),
            "built_at": self.meta.get("built_at"),
        }
