r"""命令行检索 —— **不用等前端和 LLM，就能先验证检索对不对**。

    python -m kb.query "TCP 为什么需要三次握手"
    python -m kb.query "进程和线程啥区别" --course 操作系统 --top 3
    python -m kb.query "考试考什么" --source-type outline
    python -m kb.query "有没有高数的往年卷"          # 应当报低置信，而不是硬答
    python -m kb.query "三次握手" --cross-book      # 跨教材对比：每本书各留一条
    python -m kb.query --warm 50                    # 预热计时：看服务端真实检索延迟
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

from backend.retrieval.engine import SearchEngine        # noqa: E402
from backend.retrieval.store import Store                # noqa: E402


def make_engine() -> SearchEngine:
    cfg = {}
    path = os.path.join(ROOT, "config", "retrieval.json")
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as fh:
            cfg = json.load(fh)
    return SearchEngine(Store().load(), cfg)


def show(rep, eng) -> None:
    print(f"\n问题：{rep.query}")
    print(f"路径 {'+'.join(rep.paths) or '无'} ｜ 词覆盖 {rep.coverage:.0%} ｜ {rep.elapsed_ms} ms ｜ "
          f"课程 {rep.filters.get('course') or '全部'} ｜ 资料 {rep.filters.get('source_type')}")
    if rep.low_confidence:
        print("[!] 低置信：" + "；".join(rep.reasons) + "  → 上层必须走兜底话术，不得硬答")
    elif rep.reasons:
        print("· " + "；".join(rep.reasons))
    for i, h in enumerate(rep.hits, 1):
        c = eng.store.doc(h.doc_idx)
        loc = f"第{c['page']}页" if c.get("page") else c.get("source_type")
        print(f"\n[{i}] {h.norm:.0%} {'/'.join(h.paths)} 〔{c['course']}·{c['book']}·{c.get('section') or c.get('chapter')}·{loc}〕 id={h.chunk_id}")
        print("    " + h.snippet.replace("\n", "\n    "))


def main(argv=None) -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("query", nargs="*")
    ap.add_argument("--course", default=None)
    ap.add_argument("--top", type=int, default=5)
    ap.add_argument("--per-book", dest="per_book", type=int, default=None)
    ap.add_argument("--source-type", dest="source_type", default="all")
    ap.add_argument("--cross-book", dest="cross_book", action="store_true")
    ap.add_argument("--warm", type=int, default=0, help="重复 N 次，报告稳定后的每次耗时")
    a = ap.parse_args(argv)
    eng = make_engine()

    if a.warm:
        qs = ["TCP 为什么需要三次握手", "什么是死锁", "B+ 树和 B 树的区别", "索引为什么用 B+ 树", "明湖多大"]
        for q in qs:
            eng.search(q, source_type="all")
        t0 = time.perf_counter()
        for _ in range(a.warm):
            for q in qs:
                eng.search(q, source_type="all")
        dt = (time.perf_counter() - t0) * 1000 / (a.warm * len(qs))
        print(f"[warm] {a.warm * len(qs)} 次检索，平均 {dt:.1f} ms/次（索引 {eng.store.stats()['n_docs']} 片）")
        return 0

    if not a.query:
        ap.print_help()
        return 2
    rep = eng.search(" ".join(a.query), course=a.course, source_type=a.source_type,
                     top_k=a.top, per_book=a.per_book, cross_book=a.cross_book)
    if a.cross_book:
        for book, hits in eng.group_by_book(rep).items():
            print(f"\n===《{book}》说：")
            for h in hits:
                c = eng.store.doc(h.doc_idx)
                print(f"  [{h.norm:.0%}] {c.get('section') or c.get('chapter')} 第{c.get('page')}页  {h.snippet[:150]}")
        return 0
    show(rep, eng)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())