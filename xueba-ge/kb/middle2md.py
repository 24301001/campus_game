# -*- coding: utf-8 -*-
r"""MinerU 的 middle_json → 本项目的语料 `.md`。

    python -m kb.middle2md 批次1.json [批次2.json ...] -o 输出.md \
        --course 高等数学 --book "微积分(上册·第2版)" --book-id xbg-calc1

**为什么吃 middle_json 而不是 MinerU 的 markdown**：markdown 里没有页码，
而 `[page:N]` 是"可点出处"的唯一凭依。

## 页码怎么定（实测出来的，不是猜的）

middle_json 每页有 `page_idx`（全局 0-based）和一个 `page_number` 块（**书印刷页码**）。
两者不是一回事，而且偏移量每本书都不同：上册 PDF 第 14 页 = 书第 1 页（偏移 -13），
下册偏移 -8。逐页读 `page_number` 又不可靠——实测 55 页里有 10 页压根没识别出页码块、
1 页把 19 读成了别的数，逐页 fallback 到物理页码会造出 `[page:32]` 这种**假页码**，
点开的原文和页码对不上（出处串号是本项目最严重的一类 bug）。

所以这里的做法是：把所有阿拉伯页码的"印刷页 - 物理页"做个多数投票，
用一个**全局偏移**统一推算每一页的书页码。上册实测 39 个样本 39 票一致，
投票后与逐页识别值再对账，不一致的计入 `page_conflicts` 供人事后核查。

封面/版权/前言/目录用的是罗马数字页码（i、viii…），和正文的阿拉伯页码**是两套编号**，
按偏移推算会得出 ≤ 0 的页码 —— 这些页默认**整页丢弃**（`--keep-front` 可留，
留下来的页码记作 0，即"没有可点开的书页码"）。丢的是内容简介/CIP/目录，
章节结构不丢：它来自每页书眉和正文标题，见下面的 `##`。
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
from collections import Counter

# 噪声块：书眉、页脚、页码本身。page_number 只用来定页码，不进正文。
NOISE = {"header", "footer", "page_number", "page_footnote", "aside_text"}
HEAD_LEVEL = {"title": 2, "paragraph_title": 2, "doc_title": 2, "section_header": 2}
# MinerU 的 title / doc_title / paragraph_title **分不出章和节**：实测它把 4.3 的节标题
# "反函数与复合函数的微分与求导法则" 标成了 doc_title，于是从第 4 章到第 7 章，
# 每一片的 chapter 字段都挂着这句 4.3 的话（引用行、向量文本全都跟着错，页码倒还是对的）。
# 所以层级按内容形状判：只有"第N章/篇"和"附录"算章（chunk.py 里 depth<=1 才会重置 chapter）。
_CHAPTER_SHAPE = re.compile(r"^\s*(?:第\s*[0-9一二三四五六七八九十]+\s*[章篇]|附\s*录)")
_NUM = re.compile(r"(\d+)")
_ROMAN = {"i": 1, "v": 5, "x": 10, "l": 50, "c": 100, "d": 500, "m": 1000}
# OCR 顺手抄进来的非文字。MinerU 把表格里的图片当单元格内容原样写进 html 字段，
# 实测《概率论与数理统计》附表有 4 处内联图片、合计 43,348 字 = 全书语料的 7.2%。
# 一整串没有句号的 base64 后果有两头：切片器切不动（一片 18,777 字，见 chunk.py 的
# _hard_split），以及它一旦被检索到就是上万字垃圾喂给模型。U+FFFD 同理
# （《数据结构》迪杰斯特拉那页 116 个）。图片本身不进语料：和 image 块一个口径。
_IMG_TAG = re.compile(r"<img\b[^>]*/?>", re.I)
_DATA_URI = re.compile(r"data:image/[a-z0-9.+-]+;base64,[A-Za-z0-9+/=]+")


def strip_junk(text: str) -> tuple[str, int]:
    """去掉内联图片（含 base64）和 U+FFFD，返回 (干净文本, 丢掉的字符数)。

    字数要回传：清理不能是隐形改动，corpus.json 和 README 里的语料字数得能追溯。
    """
    out = _IMG_TAG.sub("", text)
    out = _DATA_URI.sub("", out)
    out = out.replace(chr(0xFFFD), "").strip()
    return out, len(text) - len(out)
# 一行 header 块是不是"书眉"：像章节号才算。上册实测 86% 的 header 命中这个形状，
# 剩下的是目录/前言/习题答案这类真标题，以及被误判成 header 的公式碎片。
_SECTIONISH = re.compile(r"^\s*(?:\d+(?:\.\d+)*\s*\S|第\s*[0-9一二三四五六七八九十]+\s*[章篇节]|"
                         r"习\s*题\s*答\s*案|附\s*录)")
# 资料群水印冒充书眉（实测："北交知行plus 2020学习资源分享群为小红果提供学习上的帮助。"）。
# 只拦"提升成章节标题"这一步，正文里出现什么照原样留着 —— 我们不删语料，只是别拿
# 广告当 chapter 字段，那会跟着进引用、进向量，脏一整片。
_WATERMARK = re.compile(r"群|分享|资源|扫码|二维码|微信|公众号|QQ|qq|淘宝|盗版|水印|勿外传|知行")
MIN_VOTES = 2          # 至少两页一致才敢用全局偏移
MIN_RATIO = 0.8        # 一致率低于八成说明这书的页码本身有问题，退回逐页识别


def _spans(content, out: list) -> None:
    """把 MinerU 的 content（字符串 / span 列表 / 嵌套块）摊平成一行文本。

    equation_inline -> $...$   equation -> $$...$$   其余按纯文本拼接。
    """
    if content is None:
        return
    if isinstance(content, str):
        out.append(content.strip())
        return
    if isinstance(content, dict):
        for key in ("text", "content", "latex", "html"):
            if key in content:
                _spans(content[key], out)
                return
        return
    if isinstance(content, list):
        for item in content:
            _spans(item, out)
        return
    out.append(str(content))


def span_text(block: dict) -> str:
    """一个块 -> 一行文本。行内公式包 $，独立公式块由调用方处理。"""
    parts: list[str] = []
    _walk(block.get("content"), parts)
    txt = "".join(p for p in parts if p)
    return re.sub(r"[ \t]+\n", "\n", txt).strip()


def _walk(content, parts: list) -> None:
    if content is None:
        return
    if isinstance(content, str):
        parts.append(content)
        return
    if isinstance(content, dict):
        typ = content.get("type")
        if typ == "equation_inline":
            body = content.get("content") or content.get("latex") or ""
            if isinstance(body, list):                      # 少见：内层还有 span
                inner: list[str] = []
                _walk(body, inner)
                body = "".join(inner)
            body = str(body).strip()
            if body:
                parts.append(f"${body}$")
            return
        if typ == "text":
            parts.append(str(content.get("content") or content.get("text") or ""))
            return
        # 其余（table/image 的嵌套结构）继续往下钻
        for key in ("content", "text", "latex", "html", "spans", "lines", "blocks"):
            if key in content:
                _walk(content[key], parts)
                return
        return
    if isinstance(content, list):
        for item in content:
            _walk(item, parts)


def pick_header(blocks: list) -> tuple:
    """一页里所有 header 块 -> (该当章节标题的那一行, 被当水印丢掉的行数)。

    一页可能有多个 header 块（实测上册有 4 页如此），原先"取第一个"会撞上
    水印排在前面那种页，整节的 chapter 就变成了一句广告。
    """
    heads = [span_text(b) for b in blocks if b.get("type") == "header"]
    heads = [h for h in heads if h]
    clean = [h for h in heads if not _WATERMARK.search(h)]
    dropped = len(heads) - len(clean)
    for h in clean:
        if _SECTIONISH.match(h):
            return h, dropped
    return (clean[0] if clean else ""), dropped


def page_label(page: dict) -> str:
    """这一页 `page_number` 块的原文（"27" / "viii" / ""）。"""
    for b in page.get("blocks") or []:
        if b.get("type") == "page_number":
            return span_text(b)
    return ""


def arabic_page(page: dict):
    t = page_label(page)
    return int(t) if t.isdigit() else None


def roman_value(t: str):
    t = t.strip().lower()
    if not t or any(ch not in _ROMAN for ch in t):
        return None
    vals = [_ROMAN[c] for c in t]
    total = 0
    for i, v in enumerate(vals):
        total += -v if (i + 1 < len(vals) and v < vals[i + 1]) else v
    return total


def printed_page(page: dict) -> int:
    """逐页识别的书页码；取不到就退回 PDF 物理页码（页码会偏，仅兜底用）。"""
    t = page_label(page)
    n = arabic_page(page)
    if n is not None:
        return n
    r = roman_value(t)
    if r is not None:
        return r
    m = _NUM.search(t)
    if m:
        return int(m.group(1))
    return int(page.get("page_idx", 0)) + 1


def page_offset(pages: list) -> tuple:
    """多数投票求「印刷页码 - 物理页码」的全局偏移。返回 (偏移或None, 有页码的页数)。"""
    votes = Counter()
    n = 0
    for pg in pages:
        a = arabic_page(pg)
        if a is not None:
            votes[a - (int(pg.get("page_idx", 0)) + 1)] += 1
            n += 1
    if n < MIN_VOTES:
        return None, n
    off, top = votes.most_common(1)[0]
    return (off, n) if top / n >= MIN_RATIO else (None, n)


def convert(json_paths: list[str], meta: dict, figure_note: bool = False,
            keep_front: bool = False, ocr_note: str = "") -> tuple:
    pages: list[dict] = []
    for jp in json_paths:
        with open(jp, "r", encoding="utf-8") as fh:
            doc = json.load(fh)
        pages += doc.get("pages") or []
    # 分批跑出来的 JSON 必须按全局页号排序后再合并，否则章节会串页
    pages.sort(key=lambda pg: int(pg.get("page_idx", 0)))

    off, numbered = page_offset(pages)

    lines: list[str] = []
    last_header, prev_page = "", None
    n_eq = n_fig = n_img = 0
    n_conflict = n_front = n_wm = 0
    n_junk = 0
    first_page = None
    for pg in pages:
        idx = int(pg.get("page_idx", 0))
        if off is None:
            pno = printed_page(pg)
        else:
            pno = idx + 1 + off
            det = arabic_page(pg)
            if det is not None and det != pno:
                n_conflict += 1
            if pno < 1:                              # 封面/前言/目录：另一套罗马页码
                if not keep_front:
                    n_front += 1
                    continue
                pno = 0
        if prev_page is not None and pno not in (prev_page + 1, prev_page):
            lines.append(f"<!-- 页码不连续：上一段止于第 {prev_page} 页，此处第 {pno} 页 -->")
        lines.append(f"[page:{pno}]")
        lines.append("")
        if first_page is None:
            first_page = pno
        prev_page = pno

        blocks = pg.get("blocks") or []
        header, wm = pick_header(blocks)
        n_wm += wm
        # 书眉只在**变化时**当章节标题输出一次：白送 chapter/section 字段，又不每页重复
        if header and header != last_header and len(header) <= 40:
            lines.append("## " + header)
            lines.append("")
            last_header = header

        for b in blocks:
            typ = b.get("type")
            if typ in NOISE:
                continue
            if typ == "image":
                n_img += 1
                if figure_note:
                    lines.append("（此处有插图，内容未识别）")
                    lines.append("")
                continue
            txt, junk = strip_junk(span_text(b))
            n_junk += junk
            if not txt:
                continue
            if typ in HEAD_LEVEL:
                lines.append("#" * (1 if _CHAPTER_SHAPE.match(txt) else HEAD_LEVEL[typ]) + " " + txt)
            elif typ == "equation":
                n_eq += 1
                lines.append(f"$${txt}$$")
            else:
                lines.append(txt)
            lines.append("")
    body = "\n".join(lines).rstrip() + "\n"
    # ocr: 这行是给 kb/papers.py 看的——有它就说明这份 md 是 MinerU 逐字认出来的，
    # 文字层直抽会把它覆盖回去（真题的公式正是被文字层抽成私用区乱码的），所以默认跳过。
    head = ("---\n"
            f"course: {meta['course']}\nbook: {meta['book']}\nbook_id: {meta['book_id']}\n"
            f"source_type: {meta['source_type']}\n"
            + (f"ocr: {ocr_note}\n" if ocr_note else "")
            + "---\n\n")
    stats = {"pages": len(pages), "pages_emitted": len(pages) - n_front,
             "equations": n_eq, "images_dropped": n_img, "chars": len(body),
             "junk_chars": n_junk,
             "page_offset": off, "numbered_pages": numbered,
             "page_conflicts": n_conflict, "front_dropped": n_front,
             "watermark_headers": n_wm,
             "first_page": first_page}
    return head + body, stats


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description="MinerU middle_json → kb 语料 .md")
    ap.add_argument("json", nargs="+", help="一个或多个批次的 middle_json（会按全局页号排序合并）")
    ap.add_argument("-o", "--output", required=True)
    ap.add_argument("--course", required=True)
    ap.add_argument("--book", required=True)
    ap.add_argument("--book-id", dest="book_id", required=True)
    ap.add_argument("--source-type", dest="source_type", default="textbook")
    ap.add_argument("--figure-note", action="store_true", help="保留插图占位说明（默认丢）")
    ap.add_argument("--ocr-note", dest="ocr_note", default="",
                    help="写进 front matter 的 ocr: 行，标记这份语料由 OCR 生成（kb/papers.py 见到就跳过重抽）")
    ap.add_argument("--keep-front", dest="keep_front", action="store_true",
                    help="保留封面前置页（页码记作 0）；默认整页丢弃")
    a = ap.parse_args(argv)

    md, st = convert(a.json, {"course": a.course, "book": a.book, "book_id": a.book_id,
                              "source_type": a.source_type}, a.figure_note, a.keep_front,
                       a.ocr_note)
    os.makedirs(os.path.dirname(os.path.abspath(a.output)), exist_ok=True)
    with open(a.output, "w", encoding="utf-8", newline="\n") as fh:
        fh.write(md)
    print(f"[OK] {a.output}")
    print(f"     页 {st['pages']}（丢弃前置页 {st['front_dropped']}）  起始书页码 {st['first_page']}"
          f"  全局偏移 {st['page_offset']}  对账不符 {st['page_conflicts']}")
    print(f"     独立公式 {st['equations']}  丢弃图片块 {st['images_dropped']}  "
          f"水印书眉 {st['watermark_headers']}  字符 {st['chars']}"
          + (f"  清内联图片/乱码 {st['junk_chars']} 字" if st["junk_chars"] else ""))
    if st["page_offset"] is None:
        print("     [!] 没能确定全局页码偏移（页码样本太少或太乱），页码是逐页识别的，出处可能偏")
    return 0


if __name__ == "__main__":
    sys.exit(main())