# -*- coding: utf-8 -*-
"""资料块（喂给模型的那段）的单测。

守两件事：
1. 切片切在句子中间时要把相邻原文当**上下文**补上，但必须标清"非本片原文"；
2. 引用表（前端和 stub 用的 refs.quote）永远只有本片原文，不能混进上下文。
"""
import os
import sys
from types import SimpleNamespace

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

from backend.prompts import is_cut, materials_block          # noqa: E402

THEorem = {"course": "高等数学", "book": "微积分(上册·第2版)", "book_id": "xbg-calc1",
           "source_type": "textbook", "chapter": "第2章 极限与连续",
           "section": "2.5.2 单调有界收敛准则", "page": 40, "kind": "para",
           "text": "单调有界收敛准则 如果数列 $\\{ x_{n} \\}$ 满足条件",
           "n_prev": "解 $\\lim_{x \\to 0} \\frac{\\arcsin x}{x} = 1.$",
           "n_next": "$$x_{1} \\leqslant x_{2} \\leqslant \\cdots$$ 并且有界，则此数列存在极限",
           "id": "xbg-calc1#p40#i428"}

DONE = dict(THEorem, text="两次握手无法让客户端确认服务器的接收能力。", id="xbg-calc1#p40#i429",
            n_prev="", n_next="")
FORMULA = dict(THEorem, text="$$\\int u v^{\\prime} \\mathrm{d}x = uv - \\int u^{\\prime}v\\,\\mathrm{d}x.$$",
               id="xbg-calc1#p129#i1592", n_prev="", n_next="")


class _Store:
    def __init__(self, docs):
        self.docs = docs

    def doc(self, i):
        return self.docs[i]


def _block(*chunks):
    hits = [SimpleNamespace(doc_idx=i) for i in range(len(chunks))]
    return materials_block(hits, _Store(list(chunks)))


def test_切一半的句子会被判成残句():
    assert is_cut("……如果数列满足条件")
    assert not is_cut("这是一个完整的句子。")
    assert not is_cut("$$\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1$$")   # 公式收尾算说完


def test_残句补上下文并标明非原文():
    materials, _ = _block(THEorem)
    assert "上下文" in materials and "并且有界，则此数列存在极限" in materials
    assert "勿据此引用" in materials


def test_完整句和公式句不补上下文():
    for chunk in (DONE, FORMULA):
        materials, _ = _block(chunk)
        assert "上下文" not in materials


def test_引用表里只有本片原文():
    """模型可以看上下文，用户在界面上点开必须只看到被引的那一片。"""
    materials, refs = _block(THEorem)
    assert "上下文" in materials
    assert "上下文" not in refs[0]["quote"]
    assert refs[0]["quote"].endswith("满足条件")
    assert refs[0]["page"] == 40 and refs[0]["chunk_id"] == "xbg-calc1#p40#i428"


def test_资料行自带可点出处():
    materials, _ = _block(THEorem, DONE)
    assert "〔高等数学｜微积分" in materials
    assert "2.5.2 单调有界收敛准则" in materials
    assert "第40页" in materials