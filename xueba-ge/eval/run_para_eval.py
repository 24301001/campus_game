# -*- coding: utf-8 -*-
r"""「换了说法的提问」对照：语义这条腿到底买到了什么。

    .\.venv\Scripts\python.exe eval\run_para_eval.py

**为什么单独有这一个脚本。** `eval/queries.jsonl` 那 43 条钉的是「期望的那一片必须进前三」，
而期望片段绝大多数本身就是**问题原话的出处** —— 这套题天生偏字面，用它来裁决
hash 和真语义，会得出"hash 更好"的假结论（实测 recall@3：hash 100% vs 真语义 97%）。
语义腿存在的理由是另一类问题：**学生的说法和课本的用词几乎不重叠**。
下面 10 条就是照这个标准手写的，每条都刻意避开课本原词。

三个对照跑同一批题：
  A 旧配置  provider=hash，w_vec=0.12      —— hash 向量由 engine 现场重算（见下）
  B 拆掉腿  provider=api， w_vec=0         —— 只剩 BM25 字面
  C 现配置  provider=api， w_vec=0.25      —— 真语义，config 里扫出来的那档
  D 加精排  C + rerank.provider=api        —— 只有加 `--rerank` 才跑（多花 10 次调用）

为什么 D 要单独在这儿：`run_eval.py --rerank` 的 A/B 结果是 **97% → 93%**，但那 43 条期望
钉的就是"问题原话的出处"，交叉编码器天生不吃这一套。精排到底有没有用，得在
**换了说法的题**上再看一眼，两边都测过才有资格决定开关。

A 不需要留一份备份索引：`engine._align_vectors` 发现配置要 hash、而索引是 api 空间时，
会按**和 `kb/build.py` 完全相同的规则**本地重算 hash 向量（确定性、免费，实测 15 秒），
算出来的和换模型前的旧索引逐元素相同。

诚实口径：10 条太少，**不能当质量指标**，只能当方向性证据；判据也比 run_eval 松
（只要求前三里有一片的章节标题/正文含指定字样）。别把它写进答辩的"准确率"一栏。
"""

from __future__ import annotations

import argparse
import copy
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

from backend.retrieval.engine import SearchEngine          # noqa: E402
from backend.retrieval.store import Store                  # noqa: E402

BASE = json.load(open(os.path.join(ROOT, "config", "retrieval.json"), encoding="utf-8"))

# (问题, 课程, 期望出现在标题或正文里的字样) —— 每条都故意避开课本原词
CASES = [
    ("什么时候能把极限符号塞进函数括号里去", "高等数学", "连续"),
    ("一个矩阵能不能化成只有对角线上有数的那种，看什么", "线性代数", "对角化"),
    ("两个事件互相不影响，书里是怎么定义的", "概率论", "独立"),
    ("查一个名字最好情况一步就找到，靠的是什么结构", "数据结构", "哈希"),
    ("为什么隔着墙能听见说话却看不见人", "大学物理", "衍射"),
    ("曲边梯形的面积是怎么变成一串数相加的", "高等数学", "定积分"),
    ("方程组到底有没有解，看那两个数比一比", "线性代数", "有解"),
    ("试验做得特别多以后频率就稳住了，那个结论叫什么", "概率论", "大数定律"),
    ("买票排队那种先来后到的规矩，书里管它叫什么", "数据结构", "队列"),
    ("把大问题拆成小问题反复解、可小问题会重复出现，该用什么办法", "算法设计与分析", "动态规划"),
]


def build(provider: str, w_vec: float, rerank: bool = False) -> SearchEngine:
    cfg = copy.deepcopy(BASE)
    cfg["weights"] = {"bm25": 1.0, "vector": w_vec}
    emb = dict(cfg.get("embedding") or {})
    if provider == "hash":
        emb.update({"provider": "hash", "model": ""})
    cfg["embedding"] = emb
    if rerank:
        rr = dict(cfg.get("rerank") or {})
        rr["provider"] = "api"
        cfg["rerank"] = rr
    return SearchEngine(Store().load(), cfg)


def build_onnx(w_vec: float, index_dir: str) -> SearchEngine:
    """E 档：端上同款 —— 本地 bge-small-zh int8 的向量空间（读另一份索引目录）。

    为什么单独立一档：`provider=api` 那条腿**不可复现** —— 服务商的向量接口不保证逐位一致
    （实测同一条查询连调 4 次，3 次逐位相同、1 次 cos=0.9990 / 最大差 6.1e-3），
    43 条里有 2 条的期望正好卡在 3/4 名之间，于是 recall@3 会在 93%~97% 之间跳。
    本地这条是确定性的，同一份索引跑几次都是同一个数，**可以直接当回归基线**。
    """
    cfg = copy.deepcopy(BASE)
    cfg["weights"] = {"bm25": 1.0, "vector": w_vec}
    emb = dict(cfg.get("embedding") or {})
    emb.update({"provider": "onnx", "model": "bge-small-zh-v1.5", "dim": 512})
    cfg["embedding"] = emb
    return SearchEngine(Store(index_dir).load(), cfg)


def rank_of(eng: SearchEngine, query: str, course: str, want: str) -> int:
    """期望字样出现在第几名（1 起）；前三都没有就 0。"""
    rep = eng.search(query, course=course, source_type="textbook", top_k=3)
    for n, h in enumerate(rep.hits[:3]):
        d = eng.store.doc(h.doc_idx)
        loc = " ".join(str(d.get(k) or "") for k in ("chapter", "section", "heading", "text"))
        if want in loc:
            return n + 1
    return 0


def main(argv=None) -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--skip-hash", action="store_true", help="不跑 A（省掉那次 15 秒的 hash 重算）")
    ap.add_argument("--rerank", action="store_true", help="多跑一档 D：C + 精排（每条问题多一次接口调用）")
    ap.add_argument("--onnx", action="store_true", help="多跑一档 E：端上同款（本地 bge int8，读 --onnx-index）")
    ap.add_argument("--onnx-index", default=os.path.join(ROOT, "kb", "index_onnx"),
                    help="E 档的索引目录（由 `python -m kb.build --embedding-provider onnx --out ...` 生成）")
    a = ap.parse_args(argv)

    variants = []
    if not a.skip_hash:
        variants.append(("A hash 0.12(旧)", build("hash", 0.12)))
    variants.append(("B 无向量腿", build("api", 0.0)))
    c_w = float(BASE.get("weights", {}).get("vector", 0.25))
    variants.append(("C 真语义 %.2f" % c_w, build("api", c_w)))
    if a.rerank:
        variants.append(("D C+精排", build("api", c_w, rerank=True)))
    if a.onnx:
        variants.append(("E 端上 int8", build_onnx(c_w, a.onnx_index)))

    head = "%-34s" % "换了说法的提问" + "".join("%-16s" % n for n, _ in variants)
    print(head)
    print("-" * len(head))
    score = [0] * len(variants)
    for q, course, want in CASES:
        row = []
        for i, (_, eng) in enumerate(variants):
            r = rank_of(eng, q, course, want)
            score[i] += 1 if r else 0
            row.append(("第%d名" % r) if r else "没进前三")
        print("%-34s" % q[:16] + "".join("%-16s" % x for x in row))
    print("-" * len(head))
    print("前三命中条数（共 %d 条）  " % len(CASES)
          + "   ".join("%s=%d" % (n, s) for (n, _), s in zip(variants, score)))
    d = [v for v in variants if v[0].startswith("D")]
    if d:
        rs = d[0][1].reranker.stats()
        print("D 档精排自报：调用 %d 次 / 失败 %d 次 / 平均 %.1f ms  %s"
              % (rs["calls"], rs["failures"], rs["avg_ms"], rs["last_error"]))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())