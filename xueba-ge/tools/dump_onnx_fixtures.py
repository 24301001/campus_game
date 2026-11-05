# -*- coding: utf-8 -*-
r"""生成"端上那份 JS 要对齐的两份基准"，落 tests/fixtures/。

    python tools/dump_onnx_fixtures.py

`onnx_tokenizer.jsonl`  文本 -> token id 列表，出自 backend/retrieval/onnx_embed.py，
                        而那份实现已用 `tokenizers` 库在 3,028 条真实文本上逐 token 比过（0 不一致）
`web/fixtures/onnx_vectors.json`  6 条查询 -> 512 维 float32，出自 onnxruntime(CPU) + CLS + L2
                        （放 web/ 下是为了让浏览器也能取到同一份，不留副本）
浏览器那份（web/vendor/xbg-embed.js）由 tools/xbg_embed_check.mjs 拿这两份对。
"""
import json, os, random, sys
sys.path.insert(0, os.getcwd())
import numpy as np
from backend.retrieval.embed import embed, doc_text
from backend.retrieval.onnx_embed import get_encoder

rows = [json.loads(l) for l in open("kb/index/chunks.jsonl", encoding="utf-8")]
random.seed(11)
picks = random.sample(rows, 40)
tricky = ["a\tb", "café résumé", "ＴＣＰ３", "解：x＝1、y＝2。", "值——到底", "好😀啊", "TCP tcp Tcp",
          "B+树 0.015 \\alpha_{1}", "a" * 101, "矩" * 101, "$$y = C_{1}x + x\\left[ C_{2}\\cos(\\ln x)\\right]$$",
          "he said \u201chi\u201d", "a+b-c*d/e", "　全角空格\x0b和\x00控制符", "①②③ A. B. C. Ⅲ Ⅳ",
          "（5分）【考点】…→ ⇒ •·×÷±≤≥≠≈", "设三阶实对称矩阵A的特征值是1,2,3", "http://a.b_c-d.e",
          "\u200b零宽\u200d空格\ufeff", "矩阵A对应于特征值1,2的特征向量分别是"]
with open("tests/fixtures/onnx_tokenizer.jsonl", "w", encoding="utf-8", newline="\n") as fh:
    n = 0
    for c in picks:
        for key in ("text", "chapter", "section", "heading"):
            t = c.get(key) or ""
            if t.strip():
                fh.write(json.dumps({"text": t, "ids": get_encoder({"provider": "onnx"}).tokenizer.encode(t)["input_ids"]},
                                    ensure_ascii=False) + "\n")
                n += 1
    for t in tricky:
        fh.write(json.dumps({"text": t, "ids": get_encoder().tokenizer.encode(t)["input_ids"] if False else get_encoder({"provider": "onnx"}).tokenizer.encode(t)["input_ids"]}, ensure_ascii=False) + "\n")
        n += 1
qs = ["洛必达法则的使用条件是什么", "进程和线程有什么区别", "矩阵能不能对角化看什么",
      "全概率公式和贝叶斯公式怎么用", "原函数和不定积分是什么关系", "TCP 为什么需要三次握手"]
vec = embed(qs, {"provider": "onnx", "dim": 512, "batch": 8})
assert vec.shape == (6, 512), vec.shape
with open("web/fixtures/onnx_vectors.json", "w", encoding="utf-8", newline="\n") as fh:
    json.dump({"model": "bge-small-zh-v1.5 int8 onnx", "pooling": "cls+l2", "dim": 512,
               "queries": qs, "vectors": [[round(float(x), 6) for x in v] for v in vec]}, fh, ensure_ascii=False)
print("写出 %d 条分词基准 + %d 条向量基准" % (n, len(qs)))
print("bytes:", os.path.getsize("tests/fixtures/onnx_tokenizer.jsonl"), os.path.getsize("web/fixtures/onnx_vectors.json"))
