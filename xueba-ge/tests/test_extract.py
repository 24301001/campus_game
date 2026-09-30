# -*- coding: utf-8 -*-
"""抽文本前的形态判据单测：`kb/quality.py` + `kb/extract.py` 的两个纯函数。

起因是真事：微积分上册（超星扫描版）有一层私有编码假文字层，`pdfplumber` 每页能
"抽出" 300+ 字符，旧判据「字数 < 40 才算扫描页」整本书一个都没报出来 ——
一路静默建索引，检索命中的全是没人能读的字符。所以这几条断言守的是
**"不能拿字数判断能不能用"** 这一件事。
"""
import os
import sys

import pytest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

from kb.extract import header_lines, page_state           # noqa: E402
from kb.quality import counts, garbled_ratio, human_ratio, unusable  # noqa: E402

PUA = "\ue123\ue456\ue789"            # 私有区字符：PDF 里的"假字"就长这样
OK_ZH = ("设函数在闭区间上连续，在开区间内可导，则至少存在一点使得"
         "该点的导数等于两端点函数值之差除以区间长度。")


# ---------------- 字符计数 ----------------
def test_空白不计入总数():
    assert counts("中 文\n\t")[ "tot"] == 2


def test_数学符号和拉丁字母分开数():
    """早先 probe 用 set('...lim') 当符号集，把 l/i/m 三个字母算成了数学符号。"""
    c = counts("lim ∫")
    assert c["sym"] == 1 and c["latin"] == 3


def test_私有编码算乱码不算人话():
    txt = PUA * 40
    assert counts(txt)["bad"] == 120
    assert garbled_ratio(txt) > 0.05
    assert not human_ratio(txt) > 0.5


# ---------------- 页形态 ----------------
def test_字数很多但全是假字判garbled():
    assert page_state([PUA * 30]) == "garbled"
    assert unusable(PUA * 30) is True


def test_正常中文页判ok():
    assert page_state([OK_ZH]) == "ok"


def test_抽不到字判blank():
    assert page_state(["第 3 页"]) == "blank"


def test_个别乱码不冤枉好页():
    """真材实料的页里混几个替换符很常见（上下标、特殊符号），不该整页报警。"""
    assert page_state([OK_ZH + " ？" + "\ufffd"]) == "ok"


# ---------------- 书眉 / 水印 ----------------
def test_五十字开外的群水印被当书眉丢掉():
    watermark = "北交知行plus 2020学习资源分享群 内部资料 请勿外传 后果自负 谢谢配合，翻印必究违者责任自负"
    assert len(watermark) > 40, "夹具不够长，测不到当初那个卡 40 字的坑"
    pages = [[watermark, f"正文第{i}段：" + OK_ZH] for i in range(10)]
    assert watermark in header_lines(pages)


def test_正文行不会被当书眉():
    pages = [[f"每一页都不一样的正文内容第{i}段，重复率很低。"] for i in range(10)]
    assert header_lines(pages) == set()


def test_只重复两次的行留着():
    """整页级噪声要「至少 3 页 + 超过半数页」才算书眉，偶发重复的是内容。"""
    pages = [["这条只有两页出现一次次的重复行"], ["这条只有两页出现一次次的重复行"]] + \
            [[f"别的正文内容{i}" + OK_ZH] for i in range(8)]
    assert header_lines(pages) == set()