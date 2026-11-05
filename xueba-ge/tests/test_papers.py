# -*- coding: utf-8 -*-
"""真题入库的元数据解析单测：`kb/papers.py` + `kb/papermap.py`。

每条断言背后都是一次实物翻车：
  · 扫描件没有文字层，卷面读不出，6 份离散 + 1 份数据结构全被报「认不出是哪门课」；
  · 老卷题型行印「一、填空题」而不是「第一部分」，题型表整个是空的；
  · 题目区后面还跟着一份「参考答案」，题型重复一遍且不带分值，统计表冒出假缺口；
  · 期中卷不印 A/B 卷，label 拼出「第2学期None卷」，模型会原样念给学生听；
  · Word 的 Symbol/Wingdings 字体把 ≤ ∈ ① 抽成 U+F0xx 私用区乱码，公式只能靠 OCR。
"""
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

from kb.papers import base_id, md_head, meta_of, ocr_of, sidecar      # noqa: E402
from kb.papermap import label, parse_paper                           # noqa: E402
from kb.quality import counts                                        # noqa: E402

H2007 = ("北京交通大学\n2007-2008学年第二学期\n"
         "《离散数学基础（信科专业）》期末考试卷（A）\n一、填空题（共10分，每空1分）")
H2019 = ("2019―2020 学年第 2 学期期中考试试题\n"
         "课程名称:离散数学（II） 专业年级:\n一、选择题（7小题，共21分）")
H2017 = ("北京交通大学考试试题（A物）\n"
         "课程名称:离散数学（A）ⅡL 期2017.201811二9M\n一、填空题")


def test_老卷没有课程名称栏时从标题书名号认课():
    m = meta_of("2007-2008-离散数学-第二学期期末A.pdf", H2007)
    assert (m["course"], m["prefix"]) == ("离散数学", "dm")
    assert (m["year_from"], m["term"], m["volume"]) == ("2007", "2", "A")
    assert base_id(m) == "dm07082a"


def test_期中卷不印AB卷时用考试类型占位且破折号认得():
    m = meta_of("2019-2020-离散数学-第二学期期中.pdf", H2019)
    assert m["volume"] is None and m["exam"] == "期中"
    assert m["year_from"] == "2019"          # 卷面那个 ― 是 U+2015，不是 -
    assert base_id(m) == "dm19202m"


def test_学年读不出就不编id宁可跳过():
    m = meta_of("2017-2018-离散数学-第二学期试题.pdf", H2017)
    assert m["course"] == "离散数学" and m["year_from"] is None
    assert base_id(m) is None


def test_题型行两种写法都统计且答案区不重复计数(tmp_path):
    md = tmp_path / "dm99999a.md"
    md.write_text("---\nbook_id: dm99999a\n---\n\n[page:1]\n\n"
                  "## 一、填空题（共20分，每小题2分）\n题干\n"
                  "## 二.计算题 (共 22 分)\n题干\n"
                  "## 【参考答案】\n## 一、填空题\n不该被统计\n", encoding="utf-8")
    parts = parse_paper(str(md))
    assert [p["type"] for p in parts] == ["填空题", "计算题"]
    assert [p["total"] for p in parts] == [20, 22]
    assert parts[0]["per_item"] == 2          # 「每小题2分」也要认


def test_label不许把None念给学生():
    assert label({"year_from": "2019", "year_to": "2020", "term": "2",
                  "volume": None, "exam": "期中"}) == "2019—2020年第2学期期中"
    assert label({"year_from": "2024", "year_to": "2025", "term": "1",
                  "volume": "A", "exam": "期末"}) == "2024—2025年第1学期A卷"


def test_md_head读OCR边车不读得分表(tmp_path):
    md = tmp_path / "x.md"
    md.write_text("---\ncourse: 待识别\n---\n\n[page:1]\n\n## 北京交通大学\n"
                  "课程名称:数据结构_学年学期:2024-2025学年第1学期\n<table><tr><td>题号</td></tr></table>\n"
                  "[page:2]\n\n不该出现的一、选择题\n", encoding="utf-8")
    head = md_head(str(md), 1)
    assert "数据结构" in head and "<table" not in head and "##" not in head
    assert "不该出现的" not in head            # 只看第 1 页


def test_OCR标记让文字层重抽绕道(tmp_path):
    good = tmp_path / "alg23242a.md"
    good.write_text("---\nbook_id: alg23242a\nocr: MinerU 4.0 (ocr-mode=ocr)\n---\n\n"
                    "[page:1]\na\n[page:2]\nb\n", encoding="utf-8")
    assert ocr_of(str(good)) == {"ocr": "MinerU 4.0 (ocr-mode=ocr)", "pages": 2}
    plain = tmp_path / "db18191a.md"
    plain.write_text("---\nbook_id: db18191a\n---\n\n[page:1]\na\n", encoding="utf-8")
    assert ocr_of(str(plain)) == {}            # 没标记的照常重抽
    assert sidecar("E:\\a\\b.pdf").endswith("b.md")


def test_公式私用区乱码在判据里就是坏字():
    # 真题文字层抽出来就长这样：真 Unicode 的 ≤ 算好字，U+F0xx 一律算坏
    c = counts("1≤i≤9 能读；1\uf0a3i\uf0a39 和 s\uf0ce{0,1} 不能读")
    assert c["sym"] == 2
    assert c["bad"] == 3
    assert c["bad"] / max(c["tot"], 1) > 0.1
