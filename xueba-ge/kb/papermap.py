# -*- coding: utf-8 -*-
r"""从已入库的真题里算出「题型 — 分值 — 年份」结构，写成 outline 语料喂 §2.4 复习规划。

为什么要单独算，而不是把 21 份卷子丢给模型看：
  · 「考什么题型、哪部分占多少分」是**跨学年统计**。让模型去数 21 份文档的分值，
    又贵又不可核对；数数这件事写进代码，模型只负责把结果讲成人话。
  · 算出来的每个数字都要能回答"你凭什么"——所以产物里带来源卷子和缺口说明。
    学生照着这个准备考试，数字错了比没有更糟。

两条会静默出错的地方，都写在代码里了：
  · **答案卷不参与统计**（`is_answer`）：它把题干重抄一遍，算进去等于每个题型数两次；
  · **卷面没印分值的题型要说"未标"，不能补 0**：算法卷的单选题就是这么少 16 分，
    补 0 会让"分值分布"整张表看起来是对的，而它不是。

用法：
    python -m kb.papermap            # 生成 kb/sources/map-<课程>.md
    python -m kb.papermap --print    # 只打印第一份，看看长什么样
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
from collections import defaultdict

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MANIFEST = os.path.join(ROOT, "kb", "papers.json")
SRC_DIR = os.path.join(ROOT, "kb", "sources")

# 题型行两种写法都认：新卷印「第N部分、…」，离散/数据结构这些卷印「一、填空题（共20分…）」，
# 而且序号后面顿号、半角句点混着用（实测 dm24252a 印的是「二.填空题」）。
_HEAD = re.compile(r"^##\s+(第\s*[一二三四五六七八九十0-9]+\s*部分.*|[一二三四五六七八九十]+\s*[、.．]\s*.*)$")
_PART_PREFIX = re.compile(r"^(?:第\s*[一二三四五六七八九十0-9]+\s*部分[\s、，,。（(]*"
                          r"|[一二三四五六七八九十]+\s*[、.．][\s、，,。（(]*)")
_N_ITEMS = re.compile(r"(?:共\s*(\d+)\s*题|(\d+)\s*小题)")   # 「共5题」/「7小题」
_PER_ITEM = re.compile(r"每(?:小)?[题问空]\s*(\d+)\s*分")   # 每题 / 每小题 / 每空
_TOTAL = re.compile(r"共\s*(\d+)\s*分")
_TOTAL_BARE = re.compile(r"[（(]\s*(\d+)\s*分")
_NAME_STOP = re.compile(r"[。，,、（(\s]")
# 题目区之后另有一份「参考答案」，题型行会**再出现一遍**（实测 dm09102a 第 7 页起）：
# 见到就停，否则同一题型统计两次、第二次还没分值，题型表就成了「0 分」一堆。
_ANSWER_HEAD = re.compile(r"^[【\[（(]?\s*(参考答案|答案|评分标准)")
# 卷面写法不一致是常态（同一门课「单项选择题 / 单项选择 / 选择题」都出现过），
# 不归一就没法跨学年对齐；归一之后原始写法仍然照抄进"卷面写法"里，不藏。
_CANON = [("单项选择", "单项选择题"), ("选择题", "单项选择题"), ("判断", "判断题"),
          ("简答", "简答题"), ("综合", "综合分析题"), ("填空", "填空题"),
           ("证明", "证明题"), ("计算", "计算题")]
_CN = "〇一二三四五六七八九十"


def cn(n: int) -> str:
    return _CN[n] if 0 <= n <= 10 else str(n)


def canon(name: str) -> str:
    for key, val in _CANON:
        if key in name:
            return val
    return name


def parse_paper(md_path: str) -> list[dict]:
    """一份卷子 → 它的题型清单（按卷面顺序）。"""
    parts = []
    for line in open(md_path, encoding="utf-8").read().splitlines():
        t = line.strip()
        if not t.startswith("##"):
            continue
        # 「【参考答案】」这行本身不算题型行，但走到这里就得停：再往下「一、填空题」
        # 会把题目区的题型重复一遍、而且不带分值（实测 dm09102a 第 7 页起）。
        if _ANSWER_HEAD.match(t.lstrip("#").strip()):
            break
        m = _HEAD.match(t)
        if not m:
            continue
        s = m.group(1)
        rest = _PART_PREFIX.sub("", s).strip()
        name = _NAME_STOP.split(rest, maxsplit=1)[0] or rest[:12]
        total = _TOTAL.search(s) or _TOTAL_BARE.search(s)
        items = _N_ITEMS.search(s)
        per = _PER_ITEM.search(s)
        parts.append({"order": len(parts) + 1, "raw": s, "type": canon(name), "variant": name,
                      "total": int(total.group(1)) if total else None,
                      "n_items": int(items.group(1) or items.group(2)) if items else None,
                      "per_item": int(per.group(1)) if per else None})
    return parts


def label(paper: dict) -> str:
    # 期中考没印 A/B 卷：把 None 拼进去会被模型原样念给学生听（"第2学期None卷"）
    tail = "{}卷".format(paper["volume"]) if paper.get("volume") else (paper.get("exam") or "")
    return "{}—{}年第{}学期{}".format(paper["year_from"], paper["year_to"], paper["term"], tail)


def school_year(paper: dict) -> str:
    """数**学年**，不是数"份"。

    同一个学年可能有两份卷子（2021—2022 就有第一学期和第二学期各一份），
    拿份数说"连续 N 年"会把三年说成四年 —— 复习建议里最不该犯的就是这种夸大。
    """
    return f"{paper['year_from']}—{paper['year_to']}"


def build(course: str, papers: list[dict]) -> tuple[str, dict]:
    """一门课 → 语料正文 + 一份机器可读的小结（给 tests 和 eval 断言用）。"""
    years = sorted({label(p) for p in papers})
    sy = sorted({school_year(p) for p in papers})
    empty = [p for p in papers if not p["parts"]]
    by_type: dict[str, list[dict]] = defaultdict(list)
    for p in papers:
        for part in p["parts"]:
            by_type[part["type"]].append(dict(part, when=label(p), school_year=school_year(p)))
    rows, gaps = [], []
    for t, hits in by_type.items():
        scores = [h["total"] for h in hits if h["total"] is not None]
        rows.append({"type": t, "n_years": len({h["school_year"] for h in hits}),
                     "n_papers": len(hits), "hits": hits,
                     "scores": scores, "variants": sorted({h["variant"] for h in hits}),
                     "n_items": sorted({h["n_items"] for h in hits if h["n_items"]}),
                     "per_item": sorted({h["per_item"] for h in hits if h["per_item"]}),
                     "unscored": len(hits) - len(scores)})
    rows.sort(key=lambda r: (-r["n_years"], -(max(r["scores"]) if r["scores"] else 0)))
    repeated = [r for r in rows if r["n_years"] >= 3]
    once = [r for r in rows if r["n_years"] < 3]

    L = [f"# {course} 历年真题结构", ""]
    L.append(f"本结构由 {len(papers)} 份真题卷面自动统计得到（答案卷不参与统计），"
             f"覆盖 {len(sy)} 个学年（{sy[0]} 至 {sy[-1]}）、{len(years)} 份卷子。"
             f"来源卷子与缺口列在文末，可逐份核对。")
    L.append("")
    L.append("## 题型与分值分布")
    L.append("")
    L.append("| 题型 | 考到的学年数 | 分值 | 题数/每题分 | 卷面写法 |")
    L.append("| --- | --- | --- | --- | --- |")
    for r in rows:
        sc = "、".join(f"{h['when']} {h['total']}分" if h["total"] is not None
                       else f"{h['when']} 未标" for h in r["hits"])
        cells = []
        if r["n_items"]:
            cells.append("/".join(str(x) + "题" for x in r["n_items"]))
        if r["per_item"]:
            cells.append("/".join(str(x) + "分每题" for x in r["per_item"]))
        it = "；".join(cells) or "—"
        L.append(f"| {r['type']} | {r['n_years']} 个学年 | {sc} | {it} | {'/'.join(r['variants'])} |")
    L.append("")
    L.append("## 连续多年出现的题型")
    L.append("")
    for r in repeated:
        if r["scores"]:
            lo, hi = min(r["scores"]), max(r["scores"])
            trend = f"分值稳定在 {lo} 分" if lo == hi else f"分值在 {lo}-{hi} 分之间浮动"
        else:
            trend = "卷面未标分值"
        L.append(f"- {r['type']}：连续{cn(r['n_years'])}个学年出现"
                 f"（{r['n_papers']} 份卷子：{'、'.join(h['when'] for h in r['hits'])}），{trend}")
    if once:
        L.append(f"- 只出现过一两个学年的：{'、'.join(r['type'] for r in once)}（不足以判断是否必考）")
    L.append("")
    L.append("## 各份卷子的分值对照")
    L.append("")
    L.append("| 题型 | " + " | ".join(years) + " |")
    L.append("| --- |" + " --- |" * len(years))
    for r in rows:
        cells = []
        for y in years:
            got = [h["total"] for h in r["hits"] if h["when"] == y]
            cells.append("" if not got else (f"{got[0]}分" if got[0] is not None else "未标"))
        L.append(f"| {r['type']} | " + " | ".join(c or "—" for c in cells) + " |")
    L.append("")
    L.append("## 这套统计的来源卷子")
    L.append("")
    for p in papers:
        tot = sum(x["total"] for x in p["parts"] if x["total"] is not None)
        L.append(f"- 《{p['book']}》（切片前缀 `{p['book_id']}`，{p['pages']} 页，"
                 f"题型分值合计 {tot} 分）")
    L.append("")
    L.append("## 已知缺口")
    L.append("")
    for p in papers:
        miss = [x["raw"][:28] for x in p["parts"] if x["total"] is None]
        if miss:
            gaps.append({"book_id": p["book_id"], "missing": miss})
            L.append(f"- 《{p['book']}》有 {len(miss)} 个题型卷面没印分值：{'；'.join(miss)}")
    for p in empty:
        L.append(f"- 《{p['book']}》卷面**没有题型分段标题**（只有逐题分值），"
                 f"未计入上面的结构统计")
    for r in rows:
        if r["unscored"]:
            gaps.append({"type": r["type"], "unscored": r["unscored"]})
    if not gaps and not empty:
        L.append("- 无：每份卷子的题型分值都印全了，合计均为 100 分。")
    L.append("")
    L.append("注意：以上是**卷面印的结构**，不是学习建议的优先级；"
             "「年年考」只说明它年年出现，不代表你该从它开始学。")
    return "\n".join(L) + "\n", {"course": course, "n_papers": len(papers), "years": years,
                                   "school_years": sy,
                                   "papers_without_parts": [p["book_id"] for p in empty],
                                   "types": [{"type": r["type"], "n_years": r["n_years"],
                                              "n_papers": r["n_papers"], "scores": r["scores"]}
                                             for r in rows]}


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description="真题 → 题型/分值/年份 结构语料")
    ap.add_argument("--print", dest="show", action="store_true", help="只打印第一份")
    a = ap.parse_args(argv)

    papers = json.load(open(MANIFEST, encoding="utf-8"))["papers"]
    papers = [p for p in papers if not p["is_answer"] and os.path.exists(os.path.join(SRC_DIR, p["book_id"] + ".md"))]
    for p in papers:
        p["parts"] = parse_paper(os.path.join(SRC_DIR, p["book_id"] + ".md"))
    by_course: dict[str, list[dict]] = defaultdict(list)
    for p in papers:
        by_course[p["course"]].append(p)

    summary = {}
    for course, ps in sorted(by_course.items()):
        prefix = ps[0]["prefix"]
        body, summ = build(course, sorted(ps, key=lambda x: (x["year_from"], x["term"], x["volume"])))
        summary[course] = summ
        if a.show:
            print(body)
            return 0
        out = os.path.join(SRC_DIR, f"map-{prefix}.md")
        with open(out, "w", encoding="utf-8") as fh:
            fh.write("---\n"
                     f"course: {course}\nbook: {course} 真题结构（自动统计，{len(ps)} 份）\n"
                     f"book_id: map-{prefix}\nsource_type: outline\n---\n\n" + body)
        print(f"[OK] {course}: {len(ps)} 份 → {os.path.basename(out)}  "
              f"年年考={len([t for t in summ['types'] if t['n_years'] >= 3])} 种题型")
    json.dump({"说明": "各课程真题结构小结（kb/papermap.py 生成），给测试和评测断言用",
               "courses": summary}, open(os.path.join(ROOT, "kb", "papermap.json"), "w", encoding="utf-8"),
              ensure_ascii=False, indent=2)
    return 0


if __name__ == "__main__":
    sys.exit(main())