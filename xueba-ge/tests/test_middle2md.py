# -*- coding: utf-8 -*-
"""`kb/middle2md.py` 的回归测试：MinerU middle_json → 语料 .md → chunk 切片。

夹具 `tests/fixtures/middle_batch*.json` 是按 MinerU 4.0 实测 schema
（docvortex.middle v2.0）手工还原的，字段与真实产物一致：
上册 PDF 第 40 页的印刷页码是 27，第 41 页是 28，全局偏移 -13。
"""
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from kb.chunk import chunk_source                      # noqa: E402
from kb.middle2md import convert                       # noqa: E402

FIX = os.path.join(os.path.dirname(os.path.abspath(__file__)), "fixtures")
META = {"course": "高等数学", "book": "微积分(上册·第2版)",
        "book_id": "xbg-calc1", "source_type": "textbook"}


def _p(name):
    return os.path.join(FIX, name)


def _conv(*names, **kw):
    md, st = convert([_p(n) for n in names], META, kw.get("figure_note", False),
                     kw.get("keep_front", False))
    return md, st


def _pages(md):
    return [int(l.split(":")[1].rstrip("]")) for l in md.splitlines() if l.startswith("[page:")]


# ---------------- 页码：出处能不能点开全靠它 ----------------

def test_用印刷页码而不是pdf物理页码():
    md, st = _conv("middle_batch1.json")
    assert _pages(md) == [27, 28]
    assert st["page_offset"] == -13 and st["page_conflicts"] == 0


def test_漏读页码的那页用全局偏移补齐():
    """batch2 那页压根没有 page_number 块：物理页码 42 是错的，偏移推算出的 29 才对。"""
    md, _ = _conv("middle_batch1.json", "middle_batch2.json")
    assert _pages(md) == [27, 28, 29]
    assert "[page:42]" not in md


def test_没有页码样本时才退回物理页码():
    md, st = _conv("middle_batch2.json")
    assert st["page_offset"] is None
    assert _pages(md) == [42]


def test_识别错的页码由偏移纠偏并记账():
    """batch3 第 64 页被读成 999：不采信它，按偏移给 51，并计入 page_conflicts。"""
    md, st = _conv("middle_batch1.json", "middle_batch2.json", "middle_batch3.json")
    assert st["page_conflicts"] == 1
    assert "[page:51]" in md and "999" not in md


def test_跨批次按全局页号排序合并():
    # 故意把批次顺序颠倒传进去，结果仍应按 27,28,29 递增
    md, st = _conv("middle_batch2.json", "middle_batch1.json")
    assert st["pages"] == 3
    assert _pages(md) == [27, 28, 29]


def test_页码不连续时留注释不改数据():
    md, _ = _conv("middle_batch1.json", "middle_batch2.json", "middle_batch3.json")
    assert "页码不连续" in md
    assert _pages(md) == [27, 28, 29, 48, 49, 50, 51]


def test_罗马页码的前置页默认整页丢弃():
    """封面/前言/目录是 i、iv 一套编号，按偏移算出来 ≤0 —— 留下就会和正文第 1、2 页串号。"""
    md, st = _conv("middle_batch1.json", "middle_front.json")
    assert st["front_dropped"] == 2
    assert "内容简介" not in md and "一元函数微积分学" not in md
    assert _pages(md) == [27, 28]

    md2, st2 = _conv("middle_batch1.json", "middle_front.json", keep_front=True)
    assert st2["front_dropped"] == 0
    assert "内容简介" in md2 and "[page:0]" in md2


# ---------------- 书眉 vs 水印 ----------------

def test_水印冒充书眉时不被提升成章节标题():
    """真实事故：上册有一页两个 header 块，水印排前面，整节的 chapter 变成了一句广告。"""
    from kb.middle2md import pick_header

    wm = "北交知行plus 2020学习资源分享群为小红果提供学习上的帮助。"
    both = [{"type": "header", "content": [{"type": "text", "content": wm}]},
            {"type": "header", "content": [{"type": "text", "content": "2.5.1 夹逼准则"}]}]
    assert pick_header(both) == ("2.5.1 夹逼准则", 1)
    assert pick_header(both[:1]) == ("", 1)                  # 只有水印：宁可不给标题
    assert pick_header(both[1:]) == ("2.5.1 夹逼准则", 0)


def test_水印页仍然建库只是不当标题():
    md, st = _conv("middle_batch3.json", "middle_watermark.json")
    assert "北交知行plus" not in md                            # 没被提升成 ## 标题
    assert st["watermark_headers"] == 1
    assert "资料群水印" in md                                  # 正文照旧保留，我们不删语料


def test_只有第N章和附录才算章标题():
    """MinerU 把 4.3 的节标题标成 doc_title，害得整本书的 chapter 字段挂着第4章的一句话。"""
    md, _ = _conv("middle_chapter.json")
    lines = [l.strip() for l in md.splitlines()]
    assert "# 第6章 微分中值定理与导数的应用" in lines        # 章 -> 一级
    assert "## 6.3 泰勒公式" in lines                         # 节 -> 二级，不抢 chapter
    chunks = chunk_source(md, filename="xbg-calc1.md")
    tail = [x for x in chunks if x["page"] == 214]
    assert tail and all("6.3 泰勒公式" in x["chapter"] or "第6章" in x["chapter"] for x in tail), tail[0]["chapter"]
    assert not any("几何应用" in x["chapter"] for x in tail), [x["chapter"] for x in tail]# ---------------- 噪声与公式 ----------------

def test_丢弃书眉页脚页码与脚注():
    md, _ = _conv("middle_batch1.json")
    lines = [l.strip() for l in md.splitlines()]
    assert "极限" not in lines                 # footer 单独成行的内容不进正文
    assert "27" not in lines and "28" not in lines   # page_number 只用来定页码
    assert "*本节大纲要求" not in md            # page_footnote 丢
    assert "## 2.2 函数的极限" in lines          # 书眉只作为 ## 标题出现，不重复进正文


def test_书眉只在变化时输出一次标题():
    md, _ = _conv("middle_batch1.json")
    assert md.count("## 2.2 函数的极限") == 1        # 两页同一书眉，只出一次


def test_独立公式转双美元行内转单美元():
    md, _ = _conv("middle_batch1.json")
    assert "$$\\left| f(x) - 2 \\right| = \\left| x - 1 \\right| < \\varepsilon,$$" in md
    assert "$\\varepsilon > 0$" in md
    assert "$$\\lim_{x \\to 1} (x + 1) = 2.$$" not in md   # 行内的不该变独立


def test_图片块默认丢弃可保留占位():
    md, st = _conv("middle_batch1.json")
    assert "插图" not in md and st["images_dropped"] == 1
    md2, _ = _conv("middle_batch1.json", figure_note=True)
    assert "此处有插图" in md2


# ---------------- 头部与端到端兼容 ----------------

def test_头部字段齐全():
    md, _ = _conv("middle_batch1.json")
    assert md.startswith("---\ncourse: 高等数学\nbook: 微积分(上册·第2版)\n"
                       "book_id: xbg-calc1\nsource_type: textbook\n---\n\n")


def test_产物能被现有chunk切片并带真页码():
    """这条是真正的验收：转换器不用改 build.py 一行，产出必须能直接建库。"""
    md, _ = _conv("middle_batch1.json", "middle_batch2.json")
    chunks = chunk_source(md, filename="xbg-calc1.md")
    assert chunks, "切片为空"
    assert all(c["course"] == "高等数学" for c in chunks)
    assert all(c["book_id"] == "xbg-calc1" for c in chunks)
    pages = {c["page"] for c in chunks}
    assert {27, 28} <= pages
    for c in chunks:
        assert c["id"].startswith("xbg-calc1#p")
        assert c["id"] == f"xbg-calc1#p{c['page']}#i{c['id'].rsplit('#i', 1)[1]}"
    hit = next(c for c in chunks if c["page"] == 27)
    assert "\\varepsilon" in hit["text"]                 # 公式进了正文
    assert "函数的极限" in (hit["chapter"] or "") + (hit["heading"] or "")
    assert all(c["source_type"] == "textbook" for c in chunks)

# ---------------- OCR 垃圾与超长段（2026-09-22 概率论/数据结构入库暴露） ----------------

def test_内联图片与替换符不进语料():
    """实测事故：MinerU 把表格里的图片当单元格内容抄成语料，4 处共 43,407 字 base64。"""
    from kb.middle2md import strip_junk

    blob = "data:image/jpeg;base64," + "A" * 5000
    raw = '<table><tr><td>正态分布表的用法</td><td><img src="' + blob + '" /></td></tr></table>'
    txt, junk = strip_junk(raw)
    assert "base64" not in txt and "<img" not in txt and "正态分布表的用法" in txt
    assert junk == len(raw) - len(txt)                      # 清掉多少字必须能追溯
    assert strip_junk("替换符\ufffd\ufffd要丢掉")[0] == "替换符要丢掉"
    assert strip_junk("干净的一页正文")[1] == 0              # 正常文本一个字都不许动


def _only(body):
    return ("---\ncourse: 概率论\nbook: 夹具\nbook_id: t\nsource_type: textbook\n---\n\n"
            + body)


def test_没有句号的超长段也必须切断():
    """附表那种一整段没有句末标点的表格 HTML：原先"按句断"等于没断，一片 18,777 字。"""
    from kb.chunk import MAX_CHARS, chunk_source

    blob = "<table>" + ("<tr><td>" + "X" * 40 + "</td></tr>") * 200 + "</table>"
    assert len(blob) > 8000 and all(c not in blob for c in "。！？；")
    chunks = chunk_source(_only("[page:1]" + chr(10) + blob + chr(10)), filename="t.md")
    assert len(chunks) > 8, [len(c["text"]) for c in chunks]
    assert all(len(c["text"]) <= MAX_CHARS for c in chunks), max(len(c["text"]) for c in chunks)
    # 硬切出来的片段不许再当"上一句"重叠一遍（否则同一串垃圾喂两次）
    assert sum(len(c["text"]) for c in chunks) < len(blob) * 1.3


def test_按句断的长段仍然带最后一句做重叠():
    """上一条不许顺手改掉这条：定理的"条件—式子—结论"散在两三片，靠重叠接上（§10 第 9 条）。"""
    from kb.chunk import chunk_source

    a, b, c = "甲" * 300 + "。", "乙" * 300 + "。", "丙" * 300 + "。"
    chunks = chunk_source(_only("[page:1]" + chr(10) + a + b + c + chr(10)), filename="t.md")
    assert [x["text"][:1] for x in chunks] == ["甲", "甲", "乙"], [len(x["text"]) for x in chunks]
    assert chunks[1]["text"].endswith("乙" * 300 + "。")
