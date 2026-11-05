r"""检索质量回归 —— **别用眼睛判断检索好不好，用这个。**

    python eval/run_eval.py                # 跑全部，报 recall@3 / MRR / 低置信正确率
    python eval/run_eval.py --top 5
    python eval/run_eval.py --only-diff    # 只列不通过的
    python eval/run_eval.py --rerank       # 打开精排做 A/B：开不开让数字说，不靠"本地太慢"猜

`eval/queries.jsonl` 里每条是一个问题 + 应该被捞到的切片 id。
每次改切片策略、改先验、换 embedding 模型，都跑一遍 —— 这样"改了个参数结果变差了"
会被当场抓住，而不是等到答辩排练。
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

from backend.retrieval.engine import SearchEngine          # noqa: E402
from backend.retrieval.store import Store                  # noqa: E402


SECTION_PREFIX = "节:"


def resolve(want, eng) -> list[str]:
    """期望值写成 `book_id#p页#i序号`、**原文里的一句话**、或 `节:标题片段` 都可以。

    写句子更耐改：重新切片、调整片长之后 id 会整体位移，把回归集钉死在 id 上
    会让它变成一改就全红的摆设。

    `节:` 是微积分上下册入库以后加的。语料从 108 片涨到 7,694 片之后，
    "证明数列极限存在用什么准则" 这种问题会捞回同一节里的三条准则（夹逼/单调有界/柯西），
    谁排第一取决于哪片更长，**答案在不在材料里**才是我们要测的东西。
    所以这一类用例的期望写成"这一节的任意一片进前三"，而不是钉死某一句。
    """
    if want.startswith(SECTION_PREFIX):
        key = want[len(SECTION_PREFIX):].strip()
        return [c["id"] for c in eng.store.chunks
                if key in " ".join(x for x in (c.get("chapter"), c.get("section"),
                                               c.get("heading")) if x)]
    if "#" in want:
        return [want]
    for c in eng.store.chunks:
        if want in c.get("text", ""):
            return [c["id"]]
    return []


def load_cases():
    out = []
    with open(os.path.join(ROOT, "eval", "queries.jsonl"), "r", encoding="utf-8") as fh:
        for line in fh:
            line = line.strip()
            if line:
                out.append(json.loads(line))
    return out


def main(argv=None) -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--top", type=int, default=3)
    ap.add_argument("--embedding-provider", default=None,
                    help="临时覆盖 embedding.provider（配 --index-dir 做向量空间 A/B：\n"
                         "索引和查询向量必须是同一个空间，否则 engine 会直接拒绝工作）")
    ap.add_argument("--index-dir", default=None,
                    help="换一份索引跑（默认 kb/index）。向量空间 A/B 用：kb/build.py --out 另建")
    ap.add_argument("--only-diff", action="store_true")
    ap.add_argument("--no-rewrite", action="store_true",
                    help="忽略用例里的 terms，做\"有没有归一这一步\"的对照")
    ap.add_argument("--w-vec", type=float, default=None,
                    help="临时覆盖 config 里的 weights.vector（扫权重用，不改文件）")
    ap.add_argument("--min-cos", type=float, default=None,
                    help="临时覆盖 config 里的 min_cos（换向量模型之后这条必须重扫）")
    ap.add_argument("--rerank", action="store_true",
                    help="临时把 rerank.provider 改成 api（地址/模型仍读 config），跑完自报调用数与失败数")
    a = ap.parse_args(argv)
    cfg = json.load(open(os.path.join(ROOT, "config", "retrieval.json"), encoding="utf-8"))
    tag = ""
    if a.w_vec is not None:
        cfg["weights"]["vector"] = a.w_vec
        cfg["weights"]["bm25"] = 1.0
        tag += " w_vec=%.2f" % a.w_vec
    if a.min_cos is not None:
        cfg["min_cos"] = a.min_cos
        tag += " min_cos=%.2f" % a.min_cos
    if a.rerank:
        rr = dict(cfg.get("rerank") or {})
        if not (rr.get("url") or rr.get("base_url")):
            raise SystemExit("[X] config 的 rerank 块里没有 url/base_url，开不了精排")
        rr["provider"] = "api"
        cfg["rerank"] = rr
        tag += " +rerank(%s)" % rr.get("model", "?")
    if a.embedding_provider:
        emb = dict(cfg.get("embedding") or {})
        emb["provider"] = a.embedding_provider
        cfg["embedding"] = emb
        tag += " emb=%s" % a.embedding_provider
    if a.index_dir:
        tag += " index=%s" % os.path.basename(a.index_dir.rstrip("\\"))
    eng = SearchEngine(Store(a.index_dir or None).load(), cfg)
    cases = load_cases()

    hits = rr = 0
    good_gate = 0
    fails = []
    t0 = time.perf_counter()
    for case in cases:
        # terms 是**人工 oracle**（这一列写的是"教材里的规范说法该是什么"），
        # 测的是"归一对了以后检索能不能吃到"。模型自己归一得准不准，另跑
        # tests/smoke_api.py 和 .tmp/gate_offline.py 对。
        rep = eng.search(case["query"], course=case.get("course"),
                         source_type=case.get("source_type", "all"), top_k=max(a.top, 8),
                         extra_terms=[] if a.no_rewrite else (case.get("terms") or []))
        ids = [eng.store.doc(h.doc_idx)["id"] for h in rep.hits]
        declared = case.get("expect") or []
        want = [i for w in declared for i in resolve(w, eng)]
        if declared and not want:
            # 期望的句子在库里找不到 = 用例本身失效了，不能当成"应拒答"蒙过去
            fails.append((case["id"], case["query"], declared,
                          ["期望的句子/章节在库里找不到，用例失效先修它"], False, []))
            continue
        if not want:                                        # 期望"捞不到"的用例
            ok = rep.low_confidence
            good_gate += 1 if ok else 0
        else:
            top = ids[: a.top]
            ok = any(w in top for w in want)
            hits += 1 if ok else 0
            first = next((i for i, x in enumerate(ids) if x in want), -1)
            rr += (1.0 / (first + 1)) if first >= 0 else 0.0
        if not ok:
            fails.append((case["id"], case["query"], case.get("expect"), ids[: a.top], rep.low_confidence, rep.reasons))
    dt = (time.perf_counter() - t0) * 1000 / max(1, len(cases))

    n_oracle = sum(1 for c in cases if c.get("terms"))
    print("归一术语 oracle：%d 条%s" % (n_oracle, "（本次已忽略 --no-rewrite）" if a.no_rewrite else ""))
    n_pos = sum(1 for c in cases if c.get("expect"))
    n_neg = len(cases) - n_pos
    print(f"\n{'=' * 74}")
    print(f"用例 {len(cases)}（正例 {n_pos} / 应拒答 {n_neg}）｜ top={a.top}{tag} ｜ 平均 {dt:.1f} ms/条")
    if n_pos:
        print(f"  recall@{a.top}  {hits / n_pos:.0%}   MRR  {rr / n_pos:.3f}")
    if n_neg:
        print(f"  正确拒答率    {good_gate / n_neg:.0%}")
    rs = eng.reranker.stats()
    if a.rerank or rs["calls"]:
        # 关键是 failures：精排没跑成也"看不出差别"，那这条 A/B 就是废的，必须当场暴露
        print(f"  精排 {rs['provider']}:{rs['model']}  调用 {rs['calls']} 次 / "
              f"失败 {rs['failures']} 次 / 平均 {rs['avg_ms']} ms"
              + (f"  最后错误 {rs['last_error']}" if rs["last_error"] else ""))
    for cid, q, want, got, low, reasons in fails:
        print(f"\n[FAIL] {cid} · {q}")
        print(f"       期望 {want}  实得 {got}  低置信={low}")
        if reasons:
            print(f"       原因 {'；'.join(reasons)}")
    print("=" * 74)
    return 1 if fails else 0


if __name__ == "__main__":
    raise SystemExit(main())
