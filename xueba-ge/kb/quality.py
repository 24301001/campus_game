# -*- coding: utf-8 -*-
r"""文本质量度量：判断「抽出来的字还是不是人读的」。

超星 / 学习通那种扫描 PDF 带一层**私有编码字体的假文字层**：`pdfplumber` 能"抽出"
几百个字符，字数>0 看着很健康，其实全是 U+E000–F8FF 私用区或 U+FFFD 替换符，
信息量为 0。**所以判扫描件、判能不能入库，不能数字数，要看乱码率。**
`kb/probe.py`（体检）和 `kb/extract.py`（抽文本）共用这里的计数，两边判据不会跑偏。
"""
from __future__ import annotations

# 数学符号：教材里公式是图还是字，看这个集合的比例。注意别把普通字母算进来
MATHSYM = set("∫∑∏∂∇√∞≈≠≤≥±×÷∈∉⊂∪∩πθλμσΩ→⇔∀∃")
GARBLED = 0.05          # 乱码率超过 5% 就不该拿去建索引（实测：好语料 0%，超星假文字层 >90%）


def counts(text: str) -> dict:
    """一次遍历出全部计数，probe 和 extract 都用它。"""
    r = {"tot": 0, "cjk": 0, "bad": 0, "sym": 0, "digits": 0, "latin": 0}
    for ch in text:
        if ch.isspace():
            continue
        r["tot"] += 1
        o = ord(ch)
        if 0x4E00 <= o <= 0x9FFF or 0x3400 <= o <= 0x4DBF:
            r["cjk"] += 1
        elif o == 0xFFFD or 0xE000 <= o <= 0xF8FF:
            r["bad"] += 1
        elif ch in MATHSYM:
            r["sym"] += 1
        elif ch.isdigit():
            r["digits"] += 1
        elif ch.isalpha():
            r["latin"] += 1
    return r


def ratio(part: int, total: int) -> float:
    return part / total if total else 0.0


def garbled_ratio(text: str) -> float:
    c = counts(text)
    return ratio(c["bad"], c["tot"])


def human_ratio(text: str) -> float:
    """能被人读懂的字符占比（中文 + 拉丁字母 + 数字 + 数学符号）。"""
    c = counts(text)
    return ratio(c["cjk"] + c["latin"] + c["digits"] + c["sym"], c["tot"])


def unusable(text: str, min_chars: int = 40, garble: float = GARBLED) -> bool:
    """这一页要不要报「需要 OCR」：字太少，或者字是假的。"""
    c = counts(text)
    return c["tot"] < min_chars or ratio(c["bad"], c["tot"]) > garble