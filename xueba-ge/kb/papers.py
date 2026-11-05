# -*- coding: utf-8 -*-
r"""`试卷\` 里的真题 PDF → `past_paper` 语料（批量，元数据**以卷面为准**）。

为什么不让文件名说了算：实测 `软件设计与分析\2024B.pdf` 卷面印的是
「2023—2024 学年第二学期 B 卷」——和 `2023B.pdf` 是同一个学年同一份卷。
出处是要学生点开核对的东西，学年标错比不标更糟，所以一律解析卷面，
撞车时两边都加文件名后缀并打警告（见 `_dedupe`），宁可难看也不能标错。

产物两样：
  · `kb/sources/<book_id>.md` —— 交给 `kb/build.py` 切片入库；题型行会升成 `##`，
    于是每个切片自带 `section="第一部分，单项选择题…"`，复习规划和同类真题都靠它对齐；
  · `kb/papers.json` —— 这批卷子的台账（文件↔book_id↔学年↔A/B 卷↔是不是答案卷↔分值），
    §2.4 复习规划的题型/分值分布直接读它，不用再回头解析 PDF。

用法：
    python -m kb.papers --dry-run     # 只看解析出来的表，不写文件
    python -m kb.papers               # 抽取 + 写台账
"""

from __future__ import annotations

import argparse
import glob
import json
import os
import re
import sys

try:                                    # python -m kb.papers
    from kb.extract import extract
except ImportError:                       # python kb/papers.py 直跑
    from extract import extract

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEFAULT_SRC = os.path.join(os.path.dirname(ROOT), "试卷")
MANIFEST = os.path.join(ROOT, "kb", "papers.json")
SRC_DIR = os.path.join(ROOT, "kb", "sources")

_YEARS = re.compile(r"(20\d{2})\s*[—–―‐‑‒~至-]\s*(20\d{2})\s*学年\s*第?\s*([一二1234])\s*学期")
_VOL = re.compile(r"[（(]\s*([AB])\s*卷?\s*[)）]")
_EXAM = re.compile(r"(期中|期末|补考|重修)")
# 2007—2012 那几份老卷不印「课程名称：」栏，课名只在标题的《…》里；只看卷面前两页，不做全文匹配
_TITLE_COURSE = re.compile(r"《([^》]{2,20})》")
_ANSWER = re.compile(r"参考答案|评分标准")
_TERM = {"一": "1", "二": "2", "三": "3", "四": "4"}

# 卷面「课程名称：」后的正式课名 -> （路由用的课程名，book_id 前缀）
_COURSES = {"数据库系统": ("数据库", "db"),
            "算法设计与分析": ("算法设计与分析", "alg"),
            "软件系统分析与设计": ("软件设计与分析", "sda"),
            "离散数学": ("离散数学", "dm"),          # 卷面写「离散数学基础（信科专业）」，子串命中即可
            "数据结构": ("数据结构", "ds")}
# 课程名只从「课程名称：」这一项认。全文扫关键词会认错：
# 实测 软件设计与分析\2022A.pdf 正文里出现了"数据库"三个字，就被整本判成数据库卷。
_COURSE_FIELD = re.compile(r"课程名称[：:]\s*([^\n]{0,30}?)\s*(?:学年|教师|出题|课程编号|[（(]|$)")


def ocr_of(md_path: str) -> dict:
    """已经存在的语料如果是 MinerU OCR 出来的，回 {"ocr": 说明, "pages": 页数}；否则回 {}。

    为什么要守卫：真题有文字层，`python -m kb.papers` 一重跑就会用文字层直抽把 OCR 版
    盖回去。而 Word 里的公式用的是 Symbol / Wingdings / Cambria Math 这类字体，
    文字层抽出来是 U+F0xx 私用区乱码（实测 8 份算法卷 368 个：`1≤i≤9` 变成
    `1<U+F0A3>i<U+F0A3>9`、`s∈{0,1}` 变成 `s<U+F0CE>{0,1}`），公式和带圈序号直接丢失。
    OCR 版逐字认出来，实测乱码 368→0、公式 0→496 个 LaTeX 块、中文正文相似度 0.999。
    """
    if not os.path.exists(md_path):
        return {}
    with open(md_path, encoding="utf-8") as fh:
        txt = fh.read()
    m = re.search(r"(?m)^ocr:\s*(.+)$", txt[:400])
    if not m:
        return {}
    return {"ocr": m.group(1).strip(),
            "pages": len(set(re.findall(r"(?m)^\[page:(\d+)\]$", txt)))}


def first_page(pdf_path: str, n: int = 2) -> str:
    import pdfplumber

    with pdfplumber.open(pdf_path) as pdf:
        return "\n".join((p.extract_text() or "") for p in pdf.pages[:n])


def sidecar(pdf_path: str) -> str:
    """扫描件的 OCR 产物放在 PDF 旁边、同名不同后缀：`x.pdf` ↔ `x.md`。

    没它就谈不了元数据：扫描件压根没有文字层，first_page() 抽回来是空串，
    于是 6 份离散 + 1 份数据结构全被报成「认不出是哪门课」。跑完 .\run_ocr.ps1
    边车就位，卷面元数据从 OCR 正文里读 —— **仍然是卷面说了算，不是文件名说了算**。
    """
    return os.path.splitext(pdf_path)[0] + ".md"


def md_head(md_path: str, n: int = 2) -> str:
    """OCR md 的前 n 页纯文本：去 front matter、去得分表 HTML、去 markdown 井号。"""
    with open(md_path, encoding="utf-8") as fh:
        txt = fh.read()
    txt = re.sub(r"(?s)^---.*?---", "", txt, count=1)
    parts = re.split(r"(?m)^\[page:\d+\][ \t]*$", txt)
    body = "\n".join(parts[1:1 + n]) if len(parts) > 1 else txt
    body = re.sub(r"(?s)<table>.*?</table>", " ", body)
    return re.sub(r"(?m)^#{1,6} *", "", body)


def head_of(pdf_path: str, n: int = 2) -> str:
    """卷面前 n 页文字：有 OCR 边车就用边车，否则用 PDF 文字层。"""
    side = sidecar(pdf_path)
    if os.path.exists(side):
        return md_head(side, n)
    return first_page(pdf_path, n)


def install_md(src_md: str, course: str, book: str, book_id: str, dst_dir: str) -> dict:
    """把 OCR 边车按正规 book_id 装进 kb/sources/，换掉 front matter 里的占位元数据。

    run_ocr.ps1 不认卷面（只认命令行参数），边车里写的是 `course: 待识别`、
    `book_id: <文件名>`；这里解析完卷面再把这三行改对，并把语料放到正规 id 下。
    """
    with open(src_md, encoding="utf-8") as fh:
        txt = fh.read()
    body = re.sub(r"(?s)^---.*?---\s*", "", txt, count=1)
    note = re.search(r"(?m)^ocr:\s*(.+)$", txt[:400])
    head = ("---\ncourse: %s\nbook: %s\nbook_id: %s\nsource_type: past_paper\n"
            % (course, book, book_id))
    if note:
        head += "ocr: %s\n" % note.group(1).strip()
    head += "---\n\n"
    out = os.path.join(dst_dir, book_id + ".md")
    with open(out, "w", encoding="utf-8", newline="\n") as fh:
        fh.write(head + body)
    return {"pages": len(set(re.findall(r"(?m)^\[page:(\d+)\]$", body))),
            "chars": len(body), "out": out, "garbled_pages": [], "suspicious_pages": []}


def meta_of(pdf_path: str, head: str) -> dict:
    """从卷面文字里抠出处。抠不到就留 None，让上层打警告——不猜。"""
    paper_course = course = prefix = None
    field = None
    fm = _COURSE_FIELD.search(head)
    if fm:
        field = fm.group(1).strip()
    else:                                          # 老卷没有课程名称栏，退到标题《…》
        tm = _TITLE_COURSE.search(head)
        if tm:
            field = tm.group(1).strip()
    if field:
        for key in _COURSES:                      # 只认这两处，不做全文匹配
            if key in field:
                paper_course = key
                course, prefix = _COURSES[key]
                break
    m = _YEARS.search(head)
    v = _VOL.search(head)
    ex = _EXAM.search(head)
    stem = os.path.splitext(os.path.basename(pdf_path))[0]
    return {
        "file": os.path.basename(pdf_path),
        "course": course,
        "paper_course": paper_course,
        "prefix": prefix,
        "year_from": m.group(1) if m else None,
        "year_to": m.group(2) if m else None,
        "term": _TERM.get(m.group(3), m.group(3)) if m else None,
        "volume": v.group(1) if v else None,
        "exam": ex.group(1) if ex else None,
        "is_answer": bool(_ANSWER.search(head) or _ANSWER.search(stem)),
        "stem": stem,
    }


def base_id(meta: dict) -> str:
    """`sda23242b` = 软件课 2023—2024 学年第 2 学期 B 卷；答案卷再加 `-ans`。"""
    if not (meta["prefix"] and meta["year_from"] and meta["year_to"]):
        # 卷面学年读不出来就别硬编 id：2017—2018 那份离散扫描件的页眉 OCR 成
        # "期2017.201811二9M"，硬凑一个 id 出去就是假出处。让它落到 skipped 里说清楚。
        return None
    sid = "{}{}{}{}".format(meta["prefix"], meta["year_from"][2:], meta["year_to"][2:],
                            meta["term"])
    # 卷面没印 A/B 卷的（期中卷就这样）用考试类型占位，别让 "?" 混进切片 id
    sid += (meta["volume"] or {"期中": "m", "期末": "f"}.get(meta.get("exam")) or "x").lower()
    return sid + ("-ans" if meta["is_answer"] else "")


def _dedupe(metas: list[dict]) -> list[dict]:
    """同一 base_id 有多个文件 = 卷面学年撞车（2023B / 2024B 就是这种）。

    两边都加文件名后缀：谁也不占用"干净"的 id，免得看的人以为其中一份是权威。
    """
    seen: dict[str, int] = {}
    for m in metas:
        if m["prefix"]:
            seen[m["book_id"]] = seen.get(m["book_id"], 0) + 1
    dup = {k for k, n in seen.items() if n > 1}
    for m in metas:
        if m["book_id"] in dup:
            m["collided"] = True
            tag = re.sub(r"[^0-9a-z]", "", m["stem"].lower())[:10]
            m["book_id"] = f"{m['book_id']}-{tag}"
        else:
            m["collided"] = False
    return metas


def book_name(meta: dict) -> str:
    vol = "({}卷)".format(meta["volume"]) if meta["volume"] else ""
    name = "{} {}—{}学年第{}学期{}试卷{}".format(
        meta["paper_course"], meta["year_from"], meta["year_to"], meta["term"],
        meta.get("exam") or "期末", vol)
    return name + " 参考答案与评分标准" if meta["is_answer"] else name


def collect(root: str) -> list[dict]:
    out = []
    for path in sorted(glob.glob(os.path.join(root, "**", "*.pdf"), recursive=True)):
        m = meta_of(path, head_of(path))
        m["path"] = path
        side = sidecar(path)
        m["sidecar"] = side if os.path.exists(side) else "" 
        m["book_id"] = base_id(m) if m["prefix"] else None
        out.append(m)
    return _dedupe(out)


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description="批量把试卷 PDF 抽成 past_paper 语料")
    ap.add_argument("--root", default=DEFAULT_SRC, help="试卷目录（默认 %(default)s）")
    ap.add_argument("--dry-run", dest="dry_run", action="store_true", help="只解析不写文件")
    ap.add_argument("--force", action="store_true",
                    help="连 OCR 版的语料也一起用文字层重抽（默认跳过，见 ocr_of）")
    a = ap.parse_args(argv)

    metas = collect(a.root)
    rows, skipped, kept = [], [], []
    for m in metas:
        if not m["prefix"]:
            skipped.append((m["file"], "认不出是哪门课（卷面没有课程名）"))
            continue
        if not m["year_from"] or not (m["volume"] or m.get("exam")):
            skipped.append((m["file"], "卷面缺元数据：学年=%s 卷别=%s 考试类型=%s"
                            % (m["year_from"], m["volume"], m.get("exam"))
                            + ("" if m.get("sidecar") else "（扫描件，先跑 run_ocr.ps1 出边车 md）")))
            continue
        row = {"book_id": m["book_id"], "course": m["course"], "book": book_name(m),
               "source_type": "past_paper", "is_answer": m["is_answer"], "collided": m["collided"],
               "prefix": m["prefix"], "year_from": m["year_from"], "year_to": m["year_to"],
               "term": m["term"], "volume": m["volume"], "exam": m.get("exam"), "file": m["file"]}
        if a.dry_run:
            rows.append(row | {"pages": "?", "chars": "?"})
            continue
        if m.get("sidecar"):                       # 扫描件：语料 = 旁边的 OCR md，文字层指望不上
            r = install_md(m["sidecar"], m["course"], row["book"], m["book_id"], SRC_DIR)
            rows.append(row | {"pages": r["pages"], "chars": r["chars"],
                               "md": os.path.basename(r["out"]), "ocr": "边车 OCR 版",
                               "garbled_pages": [], "source_pages": [],
                               "rel": os.path.relpath(m["path"], a.root)})
            continue
        note = ocr_of(os.path.join(SRC_DIR, m["book_id"] + ".md"))
        if note and not a.force:
            rows.append(row | {"pages": note["pages"], "chars": "?", "ocr": note["ocr"],
                               "md": m["book_id"] + ".md", "garbled_pages": [],
                               "source_pages": [], "rel": os.path.relpath(m["path"], a.root)})
            kept.append(m["book_id"])
            continue
        r = extract(m["path"], m["course"], row["book"], m["book_id"], "past_paper")
        rows.append(row | {"pages": r["pages"], "chars": r["chars"], "md": os.path.basename(r["out"]) if r["out"] else "",
                           "garbled_pages": r["garbled_pages"], "source_pages": r["suspicious_pages"],
                           "rel": os.path.relpath(m["path"], a.root)})
        if not r["out"]:
            skipped.append((m["file"], f"{r['garbled_pages']}/{r['pages']} 页乱码 = 扫描版，没写文件"))

    print(f"{'book_id':<20}{'课程':<12}{'页':>4}{'行':>6}  书名")
    for row in rows:
        print(f"{row['book_id']:<20}{row['course']:<12}{str(row['pages']):>4}{str(row['chars']):>6}  "
              f"{row['book'][:46]}" + ("  [!]学年撞车" if row["collided"] else ""))
    print(f"\n{len(rows)} 份，其中答案卷 {sum(1 for r in rows if r['is_answer'])} 份")
    for f, why in skipped:
        print(f"[X] {f}：{why}")
    if kept:
        print(f"[i] {len(kept)} 份语料是 MinerU OCR 版，已跳过文字层重抽（重抽请加 --force）："
              + "、".join(sorted(kept)))
    if not a.dry_run and rows:
        with open(MANIFEST, "w", encoding="utf-8") as fh:
            json.dump({"说明": "试卷/ 的入库台账，由 kb/papers.py 生成；元数据取自卷面，不取自文件名",
                       "来源目录": a.root, "papers": rows}, fh, ensure_ascii=False, indent=2)
        print(f"[OK] 台账 → {MANIFEST}")
    return 0 if not skipped else 1


if __name__ == "__main__":
    sys.exit(main())