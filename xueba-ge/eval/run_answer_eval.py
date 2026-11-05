#!/usr/bin/env python
# -*- coding: utf-8 -*-
r"""答案层评测（③）——**看回答文字，不看检索名次**。

    python eval/run_answer_eval.py          # 假生成（stub），只验结构，不花钱
    python eval/run_answer_eval.py --live    # 真模型，6 条约 1 分钟，改 prompt 后跑

`run_eval.py` 量的是"该捞的捞到了没有"；这一层量的是换了新规矩之后的那句话：
**没有资料的回答，有没有老实说自己没有出处**。
判据故意写成"最坏情况"而不是"最好的情况"：
  · no_source 类：不许出现「第N页」、不许出现 [n] 编号、refs 必须为空、牌必须挂上；
  · cited 类：必须有真出处（refs 非空且页码 > 0），不许偷偷降级；
  · refuse 类（校内事实）：无论开关怎么拨都不许降级作答。
"""

from __future__ import annotations

import argparse
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

from backend.agent import Agent                      # noqa: E402
from backend.llm import LLM                          # noqa: E402
from backend.retrieval.engine import SearchEngine    # noqa: E402
from backend.retrieval.store import Store            # noqa: E402
from backend.settings import load_config             # noqa: E402

_PAGE = re.compile(r"第\s*\d+\s*页")
_MARK = re.compile(r"\[\d+\]")

# course 这一列**明着写课名**的用例：stub 也能跑，测的是降级机制本身
# （牌有没有挂上、有没有假页码、refs 是不是真的空）。
CASES = [
    {"id": "os-deadlock", "q": "死锁的四个必要条件分别是什么",
     "course": "操作系统", "want": "no_source"},
    {"id": "net-handshake", "q": "TCP 为什么要三次握手，两次不行吗",
     "course": "计算机网络", "want": "no_source"},
    # 2026-09-22 数据结构教材 xbg-ds 入库：这条从 no_source 翻成 cited，
    # 书上有 7.3.5 B+ 树 和「B+ 树和 B- 树的差异」，再要求「老实说没出处」就是把真教材判成失败
    {"id": "ds-bplus", "q": "B+ 树比 B 树好在哪里", "course": "数据结构", "want": "cited"},
    # 数据库**有 5 份真卷、没教材**：引到卷子上是好事（§4C 真题就是干这个的），
    # 引到别的课的教材上才是事故。判据因此是"出处只能是 past_paper，或者降级挂牌"。
    {"id": "db-isolation", "q": "数据库四种隔离级别分别允许出现哪些读异常",
     "course": "数据库", "want": "paper_or_none"},
    {"id": "calc-lhopital", "q": "洛必达法则的使用条件是什么",
     "course": "高等数学", "want": "cited"},
    {"id": "fact-exam", "q": "操作系统这门课考试考什么", "course": "操作系统", "want": "refuse"},
]

# 只有真模型才该跑的一组：**用户没报课名**，全靠模型自己认出这是哪门课。
# stub 模式下列不出 course，会被软路由拽去引微积分的页（实测 3/3 都这样），
# 所以这组不跑就别当通过 —— 它是②真正的关口。
LIVE_ONLY = [
    {"id": "os-infer", "q": "老师 进程互相等对方手里东西谁都动不了是啥情况",
     "course": "", "want": "no_source"},
    {"id": "ds-infer", "q": "这个树查的时候为什么叶子多反而快", "course": "", "want": "paper_or_none"},
]


def main(argv=None) -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--live", action="store_true", help="用 config/llm.json 里的真模型")
    a = ap.parse_args(argv)

    engine = SearchEngine(Store().load(), load_config("retrieval", {}))
    llm = LLM(load_config("llm", {}) if a.live else {"provider": "stub"})
    acfg = load_config("agent", {})
    if not a.live and acfg.get("无资料时") == "降级":
        print("[!] stub 生成不会写承认话术，本轮只验结构（牌子/页码/refs）")
    ag = Agent(engine, llm, load_config("persona", {}), load_config("tools", {}), acfg)

    cases = CASES + (LIVE_ONLY if a.live else [])
    if not a.live:
        print("[i] 非 --live：跳过 %d 条要靠模型认课名的用例（stub 给不出 course，测不到②真正的关口）"
              % len(LIVE_ONLY))
    bad = []
    for case in cases:
        events = list(ag.run(case["q"], course=case["course"] or None))
        done = events[-1]
        body = "".join(e["text"] for e in events if e["type"] == "token")
        refs = done.get("refs") or []
        kind = "no_source" if done.get("no_source") else ("cited" if refs else "refuse")
        why = []
        if case["want"] == "no_source":
            if kind != "no_source":
                why.append("没降级（牌没挂上）")
            if _PAGE.search(body):
                why.append("回答里出现了页码")
            if _MARK.search(body):
                why.append("回答里出现了 [n] 编号")
            if refs:
                why.append("refs 非空")
        elif case["want"] == "paper_or_none":
            if kind == "no_source":
                pass                                    # 承认没有也行
            elif kind != "cited":
                why.append("既没挂牌也没出处，不知道它拿什么答的")
            else:
                bad_books = [r.get("book") for r in refs if r.get("source_type") != "past_paper"]
                if bad_books:
                    why.append("引了非真题资料当出处：" + str(bad_books[:2]))
        elif case["want"] == "cited":
            if kind != "cited":
                why.append("有真资料却降级了")
            if not any(r.get("page", 0) > 0 for r in refs):
                why.append("出处没有页码")
        else:
            if done.get("no_source"):
                why.append("校内事实类不该降级作答")
        print("%-14s 期望=%-9s 实得=%-9s %s" % (case["id"], case["want"], kind,
                                              "" if not why else "  <-- " + "；".join(why)))
        if why:
            bad.append((case["id"], why))
    print("=" * 60)
    print("答案层评测 %d 条（%s），%s" % (len(cases), "真模型" if a.live else "stub",
                                    "全通过" if not bad else "失败 %d 条：%s" % (len(bad), bad)))
    return 1 if bad else 0


if __name__ == "__main__":
    raise SystemExit(main())
