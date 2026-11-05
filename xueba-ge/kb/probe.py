# -*- coding: utf-8 -*-
r"""教材/试卷 PDF 体检：`python -m kb.probe <文件或目录> [...] [--password xxx]`

只回答一个问题：**这个 PDF 能不能进检索库**。不打印正文，只打印指标。

三种密码/形态的处置完全不同：
  打开密码(U)  不给密码连看都看不到      -> 读不了，换版本
  权限密码(O)  能看，但复制/转Word弹框    -> 一般能抽，pdfminer 走内容流不申请「复制」权限
  扫描件       整页是图片，文字层为 0     -> 要 OCR，工时 x3
"""
from __future__ import annotations

import argparse
import os
import sys

try:                                     # python -m kb.probe
    from kb.quality import GARBLED, counts, ratio
except ImportError:                        # python kb/probe.py 直跑
    from quality import GARBLED, counts, ratio


def _open_state(path, password=None):
    """返回 (是否加密, 能否打开, 权限三元, 加密参数字典, 失败原因)"""
    from pdfminer.pdfparser import PDFParser
    from pdfminer.pdfdocument import PDFDocument
    st = {"encrypted": False, "opened": False, "why": "", "perm": {}, "p": {}}
    cands = ([("给定密码", password)] if password else []) + [("空口令", "")]
    for label, pw in cands:
        try:
            with open(path, "rb") as fh:
                doc = PDFDocument(PDFParser(fh), password=pw)
            st["encrypted"] = doc.encryption is not None
            st["opened"] = True
            st["how"] = label
            st["perm"] = {"可打印": doc.is_printable, "可修改": doc.is_modifiable,
                          "可提取": doc.is_extractable}
            if doc.encryption:
                st["p"] = {k: v for k, v in doc.encryption[1].items()
                           if k in ("V", "R", "Length", "P", "Filter")}
            return st
        except Exception as exc:                                  # noqa: BLE001
            st["why"] = f"{label} -> {type(exc).__name__}: {exc}"[:110]
    return st


def _body(path):
    """抽样 12 页数各类字符。计数和 `kb/extract.py` 共用 `quality.counts` ——
    不然会出现「体检说可用、抽文本说乱码」这种自相矛盾的判断。"""
    import pdfplumber

    keys = ("tot", "cjk", "bad", "sym", "digits", "latin")
    r = {k: 0 for k in keys}
    r.update({"pages": 0, "avg": 0.0, "blank": 0, "sampled": 0})
    with pdfplumber.open(path) as pdf:
        n = len(pdf.pages)
        r["pages"] = n
        step = max(1, n // 12)
        idx = list(range(0, n, step))[:12]
        r["sampled"] = len(idx)
        for i in idx:
            c = counts(pdf.pages[i].extract_text() or "")
            for k in keys:
                r[k] += c[k]
            r["blank"] += 1 if c["tot"] < 50 else 0
        r["avg"] = r["tot"] / max(1, r["sampled"])
        r["cjk_avg"] = r["cjk"] / max(1, r["sampled"])
    return r


def probe(path, password=None):
    from pdfminer.pdfparser import PDFSyntaxError
    name = os.path.basename(path)
    try:
        st = _open_state(path, password)
    except PDFSyntaxError as exc:
        print(f"{name[:46]:<46} | 坏文件: {str(exc)[:40]}")
        return "bad"
    if not st["opened"]:
        need = "需要密码（打开密码或权限密码，两种都要试）" if st["encrypted"] else "打不开"
        print(f"{name[:46]:<46} | ❌ {need} | {st['why']}")
        return "locked"

    b = _body(path)
    flags = []
    if st["encrypted"]:
        flags.append(f"加密V{st['p'].get('V')}R{st['p'].get('R')}")
        flags.append("可提取=" + ("Y" if st["perm"]["可提取"] else "N"))
        flags.append("空口令可开" if st.get("how") == "空口令" else "给定口令可开")
    if b["avg"] < 50:
        verdict = "扫描件(整页图片)->要OCR"
    elif ratio(b["bad"], b["tot"]) > GARBLED:
        verdict = "字体缺Unicode映射->抽出即乱码"
    elif b["cjk"] < b["avg"] * 0.15 and b["tot"] > 300:
        verdict = "几乎没有中文(英文教材或乱码)"
    elif b["avg"] < 200:
        # 同样"字少"，处置完全不同：PPT 讲义字少但中文正常（能入库，只能当 outline）；
        # 公式书的字少是公式全成了图（抽不出正文，别硬抽）。
        verdict = ("字少但中文正常(幻灯片/提纲：可入库，source_type=outline)"
                   if b["cjk_avg"] >= 60 else "字少且中文也少(公式/图占多数，抽不出正文)")
    else:
        verdict = "可用"
    pct = lambda a: f"{a / max(1, b['tot']):.0%}"
    print(f"{name[:46]:<46} | {b['pages']:>4}页 | 抽 {b['avg']:>5.0f} 字/页(样{b['sampled']}) | "
          f"中{pct(b['cjk'])} 乱{pct(b['bad'])} 数{pct(b['digits'])} 式{pct(b['sym'])} | "
          f"低字页{b['blank']} | {' '.join(flags) or '无加密'} | {verdict}")
    return verdict


def _expand(args):
    out = []
    for a in args:
        if os.path.isdir(a):
            for root, _d, files in os.walk(a):
                out += [os.path.join(root, f) for f in sorted(files) if f.lower().endswith(".pdf")]
        else:
            out.append(a)
    return out


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description="教材/试卷 PDF 体检（只出指标，不读正文）")
    ap.add_argument("pdf", nargs="+")
    ap.add_argument("--password", default=None)
    a = ap.parse_args(argv)
    files = _expand(a.pdf)
    print(f"共 {len(files)} 个 PDF\n" + "-" * 130)
    tally = {}
    for f in files:
        v = probe(f, a.password)
        tally[v] = tally.get(v, 0) + 1
    print("-" * 130)
    print("  ".join(f"{k}: {n}" for k, n in sorted(tally.items(), key=lambda x: -x[1])))
    return 0


if __name__ == "__main__":
    sys.exit(main())