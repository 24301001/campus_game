# -*- coding: utf-8 -*-
"""相邻片段「上文/下文」的裁剪规则。

2026-09-22 用户反馈：点开出处，卡片里「上文」是一行
`ol{C}=\begin{pmatrix}1 & 0 & 0 \\0 & 2 & 0 ...$ ,求常数a 与矩阵C.` 那样的东西。
根因是老索引用 `text[-80:]` 按**字符**取上下文，正好把 `$\boldsymbol{C}$` 劈成
`ol{C}$` —— 一个不闭合的 `$` 就让前端 KaTeX 整行放弃渲染。
下面两串就是线上那一对邻居片（`xbg-linalg#p181#i2266` / `#i2267`）的真实文本。
"""
import os
import re
import sys

import pytest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

from backend.prompts import materials_block          # noqa: E402
from backend.retrieval.store import Store            # noqa: E402
from kb.chunk import (_PAIR_RE, ctx_ok, ctx_renderable, context_after,
                      context_before, chunk_source)  # noqa: E402

PREV = (r" 3\end{pmatrix}$ ，有正交矩阵C，使 $\boldsymbol{C}^{\mathrm{T}} \boldsymbol{A} "
        r"\boldsymbol{C}=\begin{pmatrix}1 & 0 & 0 \\0 & 2 & 0 \\0 & 0 & 5\end{pmatrix}$"
        r" ,求常数a 与矩阵C.")
NEXT = (r"3. 设三阶实对称矩阵A的特征值是1,2,3，矩阵A 对应于特征值1,2的特征向量分别是 "
        r"$\boldsymbol{\alpha}_{1}=(-1,-1,1)^")
# 用户贴出来的那一行：老写法（按字符硬切 80）的确切产物
HARD_CUT = PREV[-80:]


class _Store:
    def __init__(self, docs):
        self.docs = docs

    def doc(self, i):
        return self.docs[i]


@pytest.fixture(scope="module")
def real_store() -> Store:
    return Store().load()


# ---------------- 根因：按字符硬切 ----------------
def test_老写法的硬切产物确实渲染不出来():
    """留着这条：哪天有人把 context_before 改回 `[-80:]`，这条会先炸。"""
    assert HARD_CUT.startswith("ol{C}")          # 半个宏名漏在开头
    assert not ctx_ok(HARD_CUT)                  # 结尾那个 $ 是落单的


def test_上文不再劈开公式():
    tail = context_before(PREV)
    assert tail and ctx_ok(tail)
    assert tail in PREV                          # 逐字子串，没改一个字
    assert tail.endswith("求常数a 与矩阵C.")      # 贴着本片的话保住了
    assert not re.match(r"^[A-Za-z]{1,8}\{", tail)


def test_下文不再劈开公式():
    head = context_after(NEXT)
    assert head and ctx_ok(head) and "$" not in head
    assert "特征向量分别是" in head


# ---------------- 通用不变量 ----------------
def test_裁出来的一律是原文逐字子串():
    """只许丢字，不许改字 —— 中文标点和空格尤其不能吃掉的。"""
    for src in (PREV, NEXT, "设 $x=1$，求 $y$。", "An english sentence about $\\alpha$ trees."):
        for cut in (context_before(src), context_after(src)):
            assert cut == "" or cut in src


def test_中文标点不被吃掉():
    s = "第一句，第二句。第三句！还有「引号」和（括号）。"
    assert context_after(s, 12) == "第一句，第二句。第三句！"
    assert context_before(s, 12) == "还有「引号」和（括号）。"


def test_幂等_重建索引之后读取层是空操作():
    for fn, src in ((context_before, PREV), (context_after, NEXT)):
        once = fn(src)
        assert fn(once) == once


def test_长度上限守住():
    long_s = "字" * 3000
    assert 0 < len(context_before(long_s)) <= 80
    assert 0 < len(context_after(long_s)) <= 80


def test_紧挨巨型公式时宁可不给上文():
    assert context_before("前面的话。" + "$$" + "x" * 500 + "$$") == ""


def test_ctx_ok_抓出孤立美元符和半套环境():
    assert not ctx_ok(r"ol{C}=\begin{pmatrix}1 & 0\end{pmatrix}$")
    assert not ctx_ok(r"只有开头 \begin{matrix} 没有结尾")
    assert ctx_ok(r"求 $\alpha_{1}$ 与 $\beta$")
    assert ctx_ok("纯中文，一个美元符都没有。")


# ---------------- 整库 ----------------
def test_整库没有任何脏上下文(real_store):
    """这条挂了，就是「点开出处看到乱码」回来的时候。"""
    dirty = [c["id"] for c in real_store.chunks
             for f in ("n_prev", "n_next") if not ctx_renderable(c.get(f) or "")]
    assert dirty == []


def test_源文件里的裸宏不往卡片上搬():
    """《算法》试卷答案 OCR 出来有没被 $ 包住的裸 \boldsymbol，这种一律不给。

    用源文件里真实出现的单反斜杠串。老分词器会把 \right 劈成 \r + ight，
    于是剥完只剩 ight) 这种半截单词 —— 实测线上有 17 处，现在一处都不许剩。
    """
    bare = r"\boldsymbol{A}_{4} \boldsymbol{A}_{5} \right) \right) \right)"
    assert not ctx_renderable(bare)
    assert context_after(bare) == ""
    assert context_before(bare) == ""              # 光剩一个括号的残渣也不给


def test_上下文不从西文单词中间起头(real_store):
    """旧索引里那 80 字本身就是硬切产物，开头可能就是半截单词（nd wave). 频率…）。
    现在重裁拿的是邻居全文，接缝必须落在真正的词边界上。
    """
    parse = re.compile(r"^(?P<b>[^#]+)#p\d+#i(?P<i>\d+)$")
    by_pos = {}
    for c in real_store.chunks:
        m = parse.match(c["id"])
        if m:
            by_pos[(m["b"], int(m["i"]))] = c

    def latin(ch):
        return bool(ch) and ch.isascii() and ch.isalnum()

    bad = []
    for c in real_store.chunks:
        m = parse.match(c["id"])
        for field, step in (("n_prev", -1), ("n_next", 1)):
            v = c.get(field) or ""
            nb = by_pos.get((m["b"], int(m["i"]) + step)) if m else None
            if not v or nb is None or not nb.get("text"):
                continue
            src = nb["text"]
            at = src.rfind(v) if step < 0 else src.find(v)
            assert at >= 0, (c["id"], field, "上下文不是邻居原文的逐字子串")
            if step < 0:
                seam = src[at - 1:at]
                if latin(seam) and latin(v[0]):
                    bad.append((c["id"], field, v[:24]))
            else:
                seam = src[at + len(v):at + len(v) + 1]
                if latin(v[-1]) and latin(seam):
                    bad.append((c["id"], field, v[-24:]))
    assert bad == [], bad[:5]


def test_OCR带出的表格壳子不往卡片上搬(real_store):
    """《算法》答案的卷子是 HTML 表格，OCR 之后正文里全是 </td></tr>，别抖进卡片。"""
    shell = r"></tr><tr><td>主定理</td></tr></table>"
    assert not ctx_renderable(shell)
    assert context_before(shell) == ""
    assert context_after(shell) == ""
    # 半截标签也算脏：源文件里就有没写闭合的 <td，剥完不许剩 `td>` / `<td`。
    # 查之前先剥掉成对数学式（$AX>0$ 这种比较式是无辜的），和生产代码同一顺序。
    shells = [(c["id"], f, (c[f] or "")[:30]) for c in real_store.chunks
              for f in ("n_prev", "n_next")
              if re.search(r"<[A-Za-z]{2,}|[A-Za-z]{2,}>", _PAIR_RE.sub("", c.get(f) or ""))]
    assert shells == []
    # 但正常句子里的比较式子不许被误伤
    for ok in [r"若 a<b 则 x>1", r"求 <d> 的右陪集", r"Key<A[mid] 时 high←mid-1", r"对所有 n > 1，均有"]:
        assert ctx_renderable(ok), ok


def test_带一对数学式的正常上下文照给():
    frag = r"C. 对所有 n > 1，均有 $\\mathbf{f}(n) \\geq 4\\mathbf{g}(n)$"
    assert ctx_renderable(frag)
    assert context_before(frag) == frag


def test_去乱码没有把上下文功能裁没(real_store):
    n = len(real_store.chunks)
    prev = sum(1 for c in real_store.chunks if c.get("n_prev"))
    assert prev > n * 0.7, f"只剩 {prev}/{n}"


def test_线上那条出处现在干净(real_store):
    c = real_store.by_id("xbg-linalg#p181#i2267")
    assert c, "索引重建过就别拿老 id 测，换成本页任一 id"
    assert ctx_ok(c["n_prev"]) and ctx_ok(c["n_next"])
    assert not c["n_prev"].startswith("ol{C}")


def test_重建索引走的是同一套规则():
    body = "\n".join(["---", "course: 线性代数", "book: 测试教材", "book_id: tst",
                      "source_type: textbook", "---", "## 习题5.4", "[page:181]",
                      "第一段 " + "甲" * 700, "", "第二段 $x_{1}$ 结尾。"])
    pieces = chunk_source(body, "t.md")
    assert len(pieces) > 2
    for p in pieces:
        assert ctx_ok(p["n_prev"]) and ctx_ok(p["n_next"])


# ---------------- 喂模型的那一份 ----------------
def test_模型看到的上下文也没有源码():
    chunk = {"course": "线性代数", "book": "测试教材", "book_id": "tst",
             "source_type": "textbook", "chapter": "第五章", "section": "习题5.4",
             "page": 181, "kind": "para", "text": "(1)求A对应于特征值3的特征向量",
             "n_prev": context_before(PREV), "n_next": context_after(NEXT),
             "id": "tst#p181#i0"}
    materials, _ = materials_block([_H(0)], _Store([chunk]))
    assert "上下文" in materials
    assert materials.count("$") % 2 == 0         # 整块喂模型的东西里 $ 必须成对
    assert "ol{C}" not in materials.replace(r"\boldsymbol{C}", "")


class _H:
    def __init__(self, doc_idx):
        self.doc_idx = doc_idx
