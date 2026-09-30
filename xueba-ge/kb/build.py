r"""建索引：`kb/sources/*.md` → `kb/index/`（chunks.jsonl / bm25_index.json / doc_vecs.f32 / meta.json）。

    python -m kb.build            # 全量重建（教材换了/加了书，就跑这个）
    python -m kb.build --check    # 只校验索引与语料是否同步，不写文件
    python -m kb.build --out kb/index_onnx --embedding-provider onnx
                                  # 换向量空间做 A/B 时用：不动生产索引，另建一份

**加一门课 = 丢一个 .md 进 sources/ + 跑一次 build，运行时代码零改动。**
课程清单见 `config/corpus.json`（那是给组长看的对账单，不是代码里的分支）。
"""

from __future__ import annotations

import argparse
import glob
import json
import os
import sys
import time
from collections import Counter

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.retrieval import tokenize                      # noqa: E402
from backend.retrieval.bm25 import BM25Index                # noqa: E402
from backend.retrieval.embed import describe as embed_describe            # noqa: E402
from backend.retrieval.embed import doc_text, embed         # noqa: E402
from backend.retrieval.vector import VectorIndex            # noqa: E402
from kb.chunk import chunk_file                             # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "sources")
OUT = os.path.join(HERE, "index")
CONFIG = os.path.join(os.path.dirname(HERE), "config")


def load_cfg() -> dict:
    path = os.path.join(CONFIG, "retrieval.json")
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as fh:
            return json.load(fh)
    return {}


def load_embed_cfg() -> dict:
    return load_cfg().get("embedding", {"provider": "hash", "dim": 256})


def index_text(c: dict) -> str:
    """BM25 侧把标题链也索引进来：用户问"第3章讲什么"，只有标题里有"第3章"。"""
    return " ".join(x for x in (c.get("chapter"), c.get("section"), c.get("heading"), c.get("text")) if x)


def embed_text(c: dict) -> str:
    """向量侧带上课程/书名，让"换了说法的问法"也有课程先验可依附。"""
    return doc_text(c)


def collect() -> list[dict]:
    paths = sorted(glob.glob(os.path.join(SRC, "*.md")))
    if not paths:
        raise SystemExit(f"[X] {SRC} 下没有任何 .md 语料。先看 README「灌教材」。")
    chunks: list[dict] = []
    for p in paths:
        got = chunk_file(p)
        print(f"  · {os.path.basename(p):<22} {len(got):>4} 片")
        chunks += got
    dup = [i for i, n in Counter(c["id"] for c in chunks).items() if n > 1]
    if dup:
        # 出处串号是**最严重**的一类 bug：点开的原文会是另一本书的
        raise SystemExit(f"[X] 切片 id 撞了（book_id 重名？）：{dup[:5]}")
    return chunks


def main(argv=None) -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true")
    ap.add_argument("--no-vector", action="store_true", help="只建 BM25（调试用）")
    ap.add_argument("--out", default=OUT, help="输出目录（默认 kb/index）")
    ap.add_argument("--embedding-provider", default=None,
                    help="临时覆盖 config 里的 embedding.provider，做向量空间 A/B 用")
    a = ap.parse_args(argv)

    out = a.out
    t0 = time.perf_counter()
    print(f"[1/4] 切片：来源 {SRC} -> {out}")
    chunks = collect()
    emb_cfg = load_embed_cfg()
    if a.embedding_provider:
        emb_cfg = dict(emb_cfg)
        emb_cfg["provider"] = a.embedding_provider
        print(f"      embedding.provider 被命令行覆盖为 {a.embedding_provider}")

    bm25_cfg = load_cfg().get("bm25", {})
    k1 = float(bm25_cfg.get("k1", 1.4))
    b = float(bm25_cfg.get("b", 0.75))
    print(f"[2/4] BM25：{len(chunks)} 片，分词器 {tokenize.engine_backend()}，k1={k1} b={b}")
    idx = BM25Index.build([tokenize.tokens(index_text(c)) for c in chunks], k1=k1, b=b)

    vec_dim = 0
    if a.no_vector:
        print("[3/4] 向量：跳过（--no-vector）")
    else:
        print(f"[3/4] 向量化：provider={emb_cfg.get('provider')} …")
        mat = embed([embed_text(c) for c in chunks], emb_cfg, df_of=idx.df, n_docs=idx.n_docs)
        vec_dim = int(mat.shape[1])

    os.makedirs(out, exist_ok=True)
    with open(os.path.join(out, "chunks.jsonl"), "w", encoding="utf-8") as fh:
        for c in chunks:
            fh.write(json.dumps(c, ensure_ascii=False) + "\n")
    with open(os.path.join(out, "bm25_index.json"), "w", encoding="utf-8") as fh:
        json.dump(idx.to_dict(), fh, ensure_ascii=False)
    if not a.no_vector:
        VectorIndex.save(mat, os.path.join(out, "doc_vecs.f32"))


    per_book = Counter((c["course"], c["book"]) for c in chunks)
    meta = {
        "built_at": time.strftime("%Y-%m-%d %H:%M:%S"),
        "n_docs": len(chunks),
        "terms": len(idx.postings),

        "tokenizer": tokenize.engine_backend(),
        # 来源由 embed.describe() 说了算（它知道 onnx 那条实际加载的是哪个权重文件），
        # 不让 meta 和配置各写各的 —— 见 engine._align_vectors 的注释
        "embed_provider": embed_describe(emb_cfg)["provider"],
        "embed_model": embed_describe(emb_cfg)["model"],
        "embed_dim": vec_dim or int(embed_describe(emb_cfg)["dim"] or 0),
        "avg_chars": round(sum(c["chars"] for c in chunks) / max(1, len(chunks)), 1),
        "per_book": [{"course": k[0], "book": k[1], "chunks": v} for k, v in sorted(per_book.items())],
    }
    with open(os.path.join(out, "meta.json"), "w", encoding="utf-8") as fh:
        json.dump(meta, fh, ensure_ascii=False, indent=2)

    print(f"[4/4] 写出 {out}")
    for row in meta["per_book"]:
        print(f"      {row['course']:<12} {row['chunks']:>4} 片  {row['book']}")
    print(f"      合计 {meta['n_docs']} 片 / {meta['terms']} 个词 / 平均 {meta['avg_chars']} 字每片"
          f" / {int((time.perf_counter() - t0) * 1000)} ms")
    if emb_cfg.get("provider") == "hash":
        print("      [!] embedding=hash：第二条腿是『近似字面』而非语义。生产用 api/onnx，"
              "hash 留给单测和断网兜底（见 config/retrieval.json 的 embedding）。")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
