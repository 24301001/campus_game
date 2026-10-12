# -*- coding: utf-8 -*-
r"""端上/本地 ONNX 这一路的回归。

    pytest tests/test_onnx_embed.py

分词那几条**不需要 onnxruntime、也不需要模型**（只读 vocab.txt + 一份基准），
所以任何机器上都能跑。推理那几条在缺 onnxruntime 或缺模型时 skip ——
但一 skip 就意味着"这个数字没人守"，所以 `tools/get_onnx_assets.py` +
`tools/xbg_embed_check.mjs` 是配套的：换模型/改分词必须连它们一起跑。
"""

from __future__ import annotations

import importlib.util
import json
import os
import sys

import pytest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

from backend.retrieval.onnx_embed import (DEFAULT_DIR, WordPiece, normalize,        # noqa: E402
                                          pre_tokenize)

VOCAB = os.path.join(DEFAULT_DIR, "vocab.txt")
TOK_FIXTURE = os.path.join(ROOT, "tests", "fixtures", "onnx_tokenizer.jsonl")
VEC_FIXTURE = os.path.join(ROOT, "web", "fixtures", "onnx_vectors.json")
HAS_VOCAB = os.path.exists(VOCAB)
HAS_MODEL = os.path.exists(os.path.join(DEFAULT_DIR, "onnx", "model_quantized.onnx"))
HAS_ORT = importlib.util.find_spec("onnxruntime") is not None

pytestmark = pytest.mark.skipif(not HAS_VOCAB, reason="没有 vocab.txt：先跑 tools/get_onnx_assets.py")


@pytest.fixture(scope="module")
def wp() -> WordPiece:
    return WordPiece(VOCAB)


def _fixture_rows():
    with open(TOK_FIXTURE, encoding="utf-8") as fh:
        return [json.loads(line) for line in fh if line.strip()]


def test_分词和落盘基准逐id相等(wp):
    """基准出自 `tokenizers` 库认可的实现（3,028 条真实文本 0 不一致），锁的是**未来别改坏**。

    浏览器那份 `web/vendor/xbg-embed.js` 由 `node tools/xbg_embed_check.mjs` 对同一份基准，
    所以这条红的同时，端上那条也会红 —— 三份实现是绑在一起的。
    """
    rows = _fixture_rows()
    assert len(rows) > 100, "基准文件太小，多半是生成脚本没跑完"
    bad = [r["text"][:40] for r in rows if wp.encode(r["text"])["input_ids"] != r["ids"]]
    assert not bad, f"{len(bad)} 条不一致，例：{bad[:3]}"


def test_控制符与中文边界(wp):
    """这几条是被实测"教"出来的规则，改动分词时最先该红的就是它们。"""
    assert wp.tokenize("a\x0bb") == ["ab"], "\\x0b 整个删掉，不是变成空格"
    assert wp.tokenize("a\u200bb") == ["ab"], "零宽空格（Cf）同样删掉"
    assert wp.tokenize("a\tb") == ["a", "b"], "\\t 是空格（分词边界）"
    assert wp.tokenize("a\u00a0b") == ["a", "b"], "NBSP（Zs）是空格"
    assert wp.tokenize("矩 阵") == ["矩", "阵"], "CJK 前后各插空格"
    assert wp.tokenize("$$y")[1] == "$", "$ 是切分边界：光看 Unicode 类别会漏（实测会让 ##y 冒出来）"
    # ＝(U+FF1D, \p{Sm}) 不是标点：整串是一个词，WordPiece 用 ## 续接（和参照实现逐位一致）
    assert wp.tokenize("x＝1") == ["x", "##＝", "##1"], "＝ 是符号不是标点，会并进前一个词"


def test_不小写不剥重音(wp):
    """`do_lower_case:false`：`TCP`/`café` 在 bge 词表里根本不存在，直接 [UNK]。

    这不是 bug，是这份端上小模型对**大写字母和 LaTeX** 的真实天花板；
    写进测试是为了谁也别"顺手加个 lower()"——那会和参照实现/浏览器那份立刻不一致。
    """
    assert wp.tokenize("TCP") == ["[UNK]"]
    assert wp.tokenize("tcp") != ["[UNK]"]
    assert wp.tokenize("café") == ["[UNK]"]
    assert normalize("TCP") == "TCP"


def test_超长文本必须截到位置编码上限以内(wp):
    """tokenizer.json 自己不带 truncation，参照实现对 >512 的输入直接报错 —— 所以截断是我们做的。"""
    enc = wp.encode("矩" * 2000, max_seq=512)
    assert len(enc["input_ids"]) == 512
    assert enc["input_ids"][0] == wp.cls_id and enc["input_ids"][-1] == wp.sep_id
    assert sum(enc["attention_mask"]) == 512 and set(enc["token_type_ids"]) == {0}


def test_vocab行数与config对得上():
    """下载坏了一半（比如被镜像站截断）会在这里暴露，而不是在余弦里。"""
    with open(os.path.join(DEFAULT_DIR, "config.json"), encoding="utf-8") as fh:
        cfg = json.load(fh)
    n = len([v for v in open(VOCAB, encoding="utf-8").read().split("\n") if v])
    assert n == int(cfg["vocab_size"]), f"vocab.txt {n} 行 != config.vocab_size {cfg['vocab_size']}"
    assert int(cfg["hidden_size"]) == 512, "文档向量是 512 维建的，换维度要重跑 kb.build"


def test_pre_tokenize不会吞掉词():
    """`pre_tokenize` 拼回去的长度对不上，说明某个边界字符被吃掉了。"""
    s = "设 A=1，求 x_{1}+x_{2} 的值。"
    assert "".join(pre_tokenize(normalize(s))).replace(" ", "") == s.replace(" ", "")


@pytest.mark.skipif(not (HAS_ORT and HAS_MODEL), reason="缺 onnxruntime 或缺 int8 模型")
def test_本地推理算得出归一化向量():
    from backend.retrieval.embed import embed
    mat = embed(["洛必达法则的使用条件是什么", "进程和线程有什么区别"],
                {"provider": "onnx", "dim": 512, "batch": 8})
    assert mat.shape == (2, 512)
    assert abs(float(mat[0] @ mat[0]) - 1.0) < 1e-5, "行必须已归一化，否则 VectorIndex 的余弦是错的"


@pytest.mark.skipif(not (HAS_ORT and HAS_MODEL), reason="缺 onnxruntime 或缺 int8 模型")
def test_同一份模型同一份基准向量对得上():
    """两边同一套 CPU int8 kernel 时应该逐位一致；这里卡 0.9999，给 fp32/int8 混用留了报警。

    ⚠️ 已实测：浏览器 wasm EP 跑 **int8** 时只有 0.994（两套 int8 kernel），
    跑 **fp32** 时和 Python CPU 是 cos=1.0000000 / maxΔ<1e-6。
    所以"文档索引和端上推理要用同一种精度"不是洁癖，是 0.6% 的排序抖动。
    """
    import numpy as np

    from backend.retrieval.embed import embed
    fix = json.load(open(VEC_FIXTURE, encoding="utf-8"))
    got = embed(fix["queries"], {"provider": "onnx", "dim": 512, "batch": 8})
    ref = np.float32(fix["vectors"])
    cos = (got * ref).sum(axis=1) / (np.linalg.norm(got, axis=1) * np.linalg.norm(ref, axis=1))
    assert float(cos.min()) >= 0.9999, f"最差 cos={cos.min():.6f}；基准是 tools/dump_onnx_fixtures.py 生成的"


@pytest.mark.skipif(not (HAS_ORT and HAS_MODEL), reason="缺 onnxruntime 或缺 int8 模型")
def test_dim配错要报错而不是偷偷截断():
    from backend.retrieval.embed import EmbedError, embed
    with pytest.raises(Exception, match="512"):
        embed(["一条问题"], {"provider": "onnx", "dim": 256})


def test_provider没装依赖时的话要说人话(monkeypatch):
    """缺 onnxruntime 时不该把 ImportError 甩给用户，得说清跑哪个脚本。"""
    from backend.retrieval import embed as embed_mod
    if HAS_ORT:
        pytest.skip("这台机器装了 onnxruntime，测不到缺依赖那条路径")
    with pytest.raises(Exception, match="get_bge_model|get_onnx_assets"):
        embed_mod.embed(["一条问题"], {"provider": "onnx", "dim": 512})