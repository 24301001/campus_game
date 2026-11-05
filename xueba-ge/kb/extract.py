r"""教材 PDF → `kb/sources/<book_id>.md`（带 `[page:N]` 锚点）。

    python -m kb.extract "kb/教材/计算机网络.pdf" --course 计算机网络 `
        --book "谢希仁《计算机网络》第8版" --book-id net8

三件事，按重要性排：

1. **页码锚点**。每页开头写一行 `[page:N]`（N 是 PDF 物理页码）。"标出第3章第2节"
   谁都会写，**点开能跳到那一页**才是演示现场会被验的东西 —— 所以锚点必须在
   切片阶段就和 PDF 一起定死，绝不能事后靠章节号反推（书签和正文页码经常错位）。
2. **书眉去噪**。每页重复出现的那一行（书名/章名页眉）会被抽成正文，
   混进切片后既污染向量又让 BM25 的 IDF 失真。这里按「跨页重复率 > 55%」判为书眉丢掉。
3. **扫描件要报警，不是静默失败**。文字层抽不出字、**或者抽出来全是私有编码假字**的页会被
   列出来 —— 那些页需要 OCR，是工时 ×3 的信号，必须当场让人看见，而不是建完索引才发现
   半个学期没了。判据是**乱码率**不是字数（见 `kb/quality.py`）：超星那种「字数 300、
   可读字 0」的页，只看字数会被当成正常页放过去，然后一路静默建出个假索引。
"""

from __future__ import annotations

import argparse
import os
import re
import sys
from collections import Counter

try:                                     # python -m kb.extract
    from kb.quality import counts, ratio
except ImportError:                        # python kb/extract.py 直跑
    from quality import counts, ratio

_NOISE_PAGE = re.compile(r"^\s*[-–—]?\s*\d{1,4}\s*[-–—]?\s*$")
_CHAPTER = re.compile(r"^第\s*[0-9一二三四五六七八九十百]+\s*[章篇]")
_SECTION = re.compile(r"^\d{1,2}(\.\d{1,2}){0,3}\s+\S")
_FIGURE = re.compile(r"^(图|表|Fig\.?|Table)\s*\d")
# 真题的"题型行"必须升成标题，否则切片的 section 全是空的：
# 复习规划要靠它算"这门课考什么题型、各占多少分"，同类真题卡片也靠它对齐。
# 两种实物写法（都是试卷/ 里抽出来的）：`第一部分，单项选择题。（每题2分，共20分）`
# 和 `一、填空题（每空1分，共10分）`。后者必须再带一个题型词，
# 不然答案卷里的 `五、解：设…` 会被当成标题。
_NUM_ONLY2 = re.compile(r"^\d{1,2}(\.\d{1,2}){0,3}\s+(?![\u4e00-\u9fff])\S")   # 形如节号、后面又不是汉字 = 纯数字行
_PART = re.compile(r"^第\s*[一二三四五六七八九十0-9]+\s*部分")
_TYPE_WORDS = "选择|填空|简答|判断|计算|证明|应用|综合|分析|设计|阅读|程序|名词|术语|问答|编程|事务|索引|查询|描述|画图|说明|建|画"
_ITEM_TYPE = re.compile(r"^[一二三四五六七八九十]{1,3}\s*[、.．][^\n]{0,30}(?:" + _TYPE_WORDS + r")")


def header_lines(pages: list, min_repeat: int = 3, ratio_min: float = 0.55,
                 max_len: int = 80) -> set:
    """跨页重复出现的行 = 书眉/水印，不是正文。

    `max_len` 早先是 40，被超星那条 52 字的群水印钻了空子：一行噪声能在 55% 的页上
    重复出现，它多长都不是正文，所以放宽到 80。
    """
    cnt: Counter = Counter()
    for lines in pages:
        for s in set(lines):
            cnt[s] += 1
    n_page = max(1, len(pages))
    return {s for s, c in cnt.items()
            if c >= min_repeat and c / n_page >= ratio_min and len(s) <= max_len}


def page_state(lines: list) -> str:
    """一页（已去书眉）的形态：ok / blank（抽不到字）/ garbled（私有编码假字）。"""
    c = counts("".join(lines))
    if ratio(c["bad"], c["tot"]) > 0.05:
        return "garbled"
    return "blank" if c["tot"] < 40 else "ok"


def classify_heading(s: str, source_type: str = "textbook") -> int:
    """给抽出来的行判层级：0 = 正文，1 = 章，2 = 节。只靠形状，不猜内容。

    `source_type="past_paper"` 时多两条真题专用规则（题型行升为节、纯数字行不算节），
    教材那两条规则一个字没动 —— 改它会让已入库的 7,600 片和重跑结果对不上。
    真题规则放在教材规则**前面**：`1 2`（卷首分数表里的残留）会先被 `_SECTION`
    当成"1.2 那种节号"收走，必须先挡掉。
    """
    if _CHAPTER.match(s) and len(s) <= 24:
        return 1
    if source_type != "past_paper":
        return 2 if (_SECTION.match(s) and len(s) <= 30 and not s.endswith("。")) else 0
    if len(s) <= 40 and (_PART.match(s) or _ITEM_TYPE.match(s)):
        return 2
    if _NUM_ONLY2.match(s):
        return 0
    return 2 if (_SECTION.match(s) and len(s) <= 30 and not s.endswith("。")) else 0


def extract(pdf_path: str, course: str, book: str, book_id: str,
            source_type: str = "textbook") -> dict:
    import pdfplumber

    pages: list[list[str]] = []
    with pdfplumber.open(pdf_path) as pdf:
        for p in pdf.pages:
            txt = p.extract_text() or ""
            pages.append([l.strip() for l in txt.splitlines() if l.strip()])

    n_page = max(1, len(pages))
    headers = header_lines(pages)

    blank, body, n_kept, n_garbled = [], [], 0, 0
    for i, lines in enumerate(pages, start=1):
        keep = [s for s in lines if s not in headers]
        state = page_state(keep)
        if state == "garbled":
            n_garbled += 1                 # 假文字层：字数很多，可读字为 0
            blank.append(i)
        elif state == "blank":
            blank.append(i)
        if not keep:
            continue
        body.append(f"[page:{i}]")
        prev_blank = True
        for s in keep:
            lvl = classify_heading(s, source_type)
            if _FIGURE.match(s):
                continue
            if lvl:
                body.append("#" * lvl + " " + s)
                prev_blank = True
                continue
            if prev_blank:
                body.append("")          # 段间空行，交给 chunk 分块
            body.append(s)
            prev_blank = False
            n_kept += 1
        body.append("")

    if n_garbled * 2 > n_page:
        # 过半页数是乱码 = 整本是扫描版。这时候写文件等于往 sources/ 塞一本假教材：
        # 索引建得出来、检索也有命中，点开全是乱码 —— 宁可不出货，让人先去 OCR。
        out = ""
    else:
        out_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "sources")
        os.makedirs(out_dir, exist_ok=True)
        out = os.path.join(out_dir, f"{book_id}.md")
        with open(out, "w", encoding="utf-8") as fh:
            fh.write("---\n"
                     f"course: {course}\nbook: {book}\nbook_id: {book_id}\n"
                     f"source_type: {source_type}\n---\n\n"
                     + "\n".join(body).rstrip() + "\n")
    return {"pdf": os.path.basename(pdf_path), "pages": n_page, "out": out,
            "chars": n_kept, "headers_dropped": len(headers), "suspicious_pages": blank,
            "garbled_pages": n_garbled}


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description="教材 PDF → 可切片源文件")
    ap.add_argument("pdf")
    ap.add_argument("--course", required=True)
    ap.add_argument("--book", required=True)
    ap.add_argument("--book-id", dest="book_id", required=True)
    ap.add_argument("--source-type", dest="source_type", default="textbook")
    a = ap.parse_args(argv)
    if not os.path.exists(a.pdf):
        print(f"[X] 找不到 {a.pdf}", file=sys.stderr)
        return 2
    r = extract(a.pdf, a.course, a.book, a.book_id, a.source_type)
    if not r["out"]:
        print(f"[X] {r['pdf']}：{r['pages']} 页里 {r['garbled_pages']} 页抽出来是私有编码乱码"
              f" —— 整本是扫描版，**没有写 sources 文件**。")
        print("    走 OCR：README §4B + run_ocr.ps1（实测 6-8 秒/页，330 页约 40 分钟）。")
        return 3
    print(f"[OK] {r['pdf']}：{r['pages']} 页 → {r['out']}（正文 {r['chars']} 行，去掉 {r['headers_dropped']} 种书眉）")
    if r["suspicious_pages"]:
        why = f"其中 {r['garbled_pages']} 页是私有编码乱码" if r["garbled_pages"] else "都是几乎抽不到字"
        print(f"[!] 以下 {len(r['suspicious_pages'])} 页需要 OCR（{why}）：{_tail(r['suspicious_pages'])}")
        print("    决定要么接 OCR，要么这几章不喂 —— 见 README「扫描件怎么办」。")
    return 0


def _tail(xs: list[int], n: int = 24) -> str:
    return ",".join(str(x) for x in xs[:n]) + ("…" if len(xs) > n else "")


if __name__ == "__main__":
    raise SystemExit(main())
