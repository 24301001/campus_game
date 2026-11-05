r"""浏览器同款小模型，在服务端也跑一遍：WordPiece → ONNX(BERT) → CLS pooling → L2。

    provider=onnx 在 `config/retrieval.json` 里，和 hash / api 平级

它存在的理由有两条，第二条才是组长那条「浏览器内 WebGPU + ONNX 真推理」：

1. **`onnx` 不再是占位符。** 不联网、不要 Key、不花钱也有一条真语义腿；
2. **端上推理必须和服务端在同一个向量空间说话。** 文档向量是这里算的，浏览器算查询向量
   就必须用**同一个分词器、同一个模型**，否则两边的余弦是噪声 —— 而且不会报错，只会悄悄变差。

所以这里的 WordPiece 和 `web/vendor/xbg-embed.js` 是照着同一份 `tokenizer.json`
各写一遍的两份实现。三份对齐由 `tests/test_onnx_embed.py` 钉住：
拿**真实语料**逐 token 比对（本实现 vs `tokenizers` 库 vs 浏览器那份的转写快照）。

规则不是照记忆写的，是拿参照实现**测**出来的（2026-09-27）：
  · `\t \n \r` → 换成空格（分词边界）；其它 Cc/Cf 控制符（`\x0b`、零宽空格 U+200B…）**整个删掉**；
  · CJK 表意文字前后各插一个空格（`handle_chinese_chars`），所以 101 个「矩」是 101 个 token；
  · 切分边界 = 空白 + `\p{P}`（标点）。**注意 `＝`(U+FF1D) 是 `\p{Sm}` 符号不是标点**，
    实测它会被并进前一个词变成 `##＝`；破折号 `—`(Pd) 才是标点；
  · **不小写、不剥重音**（`do_lower_case:false`、`strip_accents:null`）：`TCP`、`café` 直接 [UNK]。
    这对我们这份语料是真代价 —— LaTeX 里的 `\boldsymbol`、`ＴＣＰ` 全在造 [UNK]；
  · WordPiece 贪心最长匹配，`##` 是续接前缀；单个词超过 100 字符 → 整个词 [UNK]；
  · 512 是位置编码上限，超长文本截到 `[CLS] + 前 510 个 + [SEP]`（tokenizer.json 自己不带
    truncation，参照实现对长文本会**直接报错**，所以这一步必须我们做，两边都要做）。
"""

from __future__ import annotations

import json
import os
import unicodedata

import numpy as np

from ..settings import MODELS_DIR

MODEL_NAME = "bge-small-zh-v1.5"
DEFAULT_MODEL_FILE = "model_quantized.onnx"
DEFAULT_DIR = os.path.join(MODELS_DIR, MODEL_NAME)
_MAX_CHARS_PER_WORD = 100


def _is_chinese_char(cp: int) -> bool:
    """和 HF BERT 一致的 8 个 CJK 表意文字区段（含扩展 B/F/A 与兼容表意文字）。"""
    return ((0x4E00 <= cp <= 0x9FFF) or (0x3400 <= cp <= 0x4DBF) or (0x20000 <= cp <= 0x2A6DF)
            or (0x2A700 <= cp <= 0x2B73F) or (0x2B740 <= cp <= 0x2B81F) or (0x2B820 <= cp <= 0x2CEAF)
            or (0xF900 <= cp <= 0xFAFF) or (0x2F800 <= cp <= 0x2FA1F))


def _keep(c: str) -> bool:
    """Cc/Cf 里的 \\t\\n\\r 之外全部删掉；\\t\\n\\r 变成空格（在 normalize 里处理）。"""
    return not (unicodedata.category(c) in ("Cc", "Cf"))


def normalize(text: str) -> str:
    """BertNormalizer 的 clean_text + handle_chinese_chars（lowercase/strip_accents 都关着）。"""
    out = []
    for ch in text:
        if ch == "\n" or ch == "\t" or ch == "\r":
            out.append(" ")
        elif not _keep(ch):
            continue                                  # 整个删掉：\x0b、U+200B、U+FEFF…
        elif _is_chinese_char(ord(ch)):
            out.append(" " + ch + " ")
        else:
            out.append(ch)
    return "".join(out)


def _is_whitespace(c: str) -> bool:
    return c == " " or c == "\u00a0" or unicodedata.category(c) == "Zs"


def _is_punct(c: str) -> bool:
    """BERT 的标点定义 = ASCII 特殊字符四段 **或** Unicode 类别以 P 开头。

    光看类别会漏掉 `$ ^ _ ` | ~`（它们是 Sc/Sk/Pc 里的一部分，落在 ASCII 段内），
    实测后果：`$$y` 被当成一个词，WordPiece 拼出 `##y`，参照实现给的是 `y`。
    语料里 LaTeX 一片 `$`，这条错会波及上千片。
    """
    cp = ord(c)
    return ((33 <= cp <= 47) or (58 <= cp <= 64) or (91 <= cp <= 96) or (123 <= cp <= 126)
            or unicodedata.category(c).startswith("P"))


def _boundary(c: str) -> bool:
    return _is_whitespace(c) or _is_punct(c)


def pre_tokenize(text: str) -> list[str]:
    """空白 + 标点切分（和 BertPreTokenizer 一样，标点自己单独成一个词）。"""
    words, cur = [], []
    for ch in text:
        if _boundary(ch):
            if cur:
                words.append("".join(cur))
                cur = []
            if not _is_whitespace(ch):
                words.append(ch)
        else:
            cur.append(ch)
    if cur:
        words.append("".join(cur))
    return words


class WordPiece:
    """vocab.txt + 贪心最长匹配。id 表就一份，浏览器那边读的是同一个 tokenizer.json。"""

    def __init__(self, vocab_file: str):
        self.vocab: dict[str, int] = {}
        with open(vocab_file, "r", encoding="utf-8") as fh:
            for i, line in enumerate(fh.read().split("\n")):
                tok = line.strip("\n")
                if tok:
                    self.vocab[tok] = i
        missing = [t for t in ("[PAD]", "[UNK]", "[CLS]", "[SEP]") if t not in self.vocab]
        if missing:
            raise ValueError(f"vocab.txt 缺 {missing}，不是 BERT 系的词表？")
        self.pad_id = self.vocab["[PAD]"]
        self.unk_id = self.vocab["[UNK]"]
        self.cls_id = self.vocab["[CLS]"]
        self.sep_id = self.vocab["[SEP]"]

    def encode_word(self, word: str) -> list[int]:
        if len(word) > _MAX_CHARS_PER_WORD:
            return [self.unk_id]
        ids, start = [], 0
        while start < len(word):
            best, cur = None, None
            end = min(len(word), start + _MAX_CHARS_PER_WORD)
            while start < end:
                piece = ("" if start == 0 else "##") + word[start:end]
                if piece in self.vocab:
                    best = self.vocab[piece]
                    cur = end
                    break
                end -= 1
            if best is None:
                return [self.unk_id]                  # 一个字符都拼不出来：整个词 [UNK]
            ids.append(best)
            start = cur
        return ids

    def tokenize(self, text: str) -> list[str]:
        """只给 token 字符串（比对/调试用）。和 encode() 走的是同一条流水线。"""
        out = []
        for w in pre_tokenize(normalize(text)):
            if len(w) > _MAX_CHARS_PER_WORD:
                out.append("[UNK]")
                continue
            start, ok = 0, True
            pieces = []
            while start < len(w) and ok:
                end, hit = min(len(w), start + _MAX_CHARS_PER_WORD), None
                while start < end:
                    piece = ("" if start == 0 else "##") + w[start:end]
                    if piece in self.vocab:
                        hit = piece
                        break
                    end -= 1
                if hit is None:
                    ok = False
                else:
                    pieces.append(hit)
                    start = end
            out += pieces if ok else ["[UNK]"]
        return out

    def encode(self, text: str, max_seq: int = 512) -> dict:
        """`[CLS] A [SEP]`，超长截到 max_seq-2 个内容 token。type_ids 恒 0（单句）。"""
        ids = []
        for w in pre_tokenize(normalize(text)):
            ids += self.encode_word(w)
            if len(ids) >= max_seq - 2:
                break
        ids = ids[: max_seq - 2]
        ids = [self.cls_id] + ids + [self.sep_id]
        n = len(ids)
        return {"input_ids": ids, "attention_mask": [1] * n, "token_type_ids": [0] * n}


class OnnxEncoder:
    """一个模型实例常驻。`embed()` 返回行归一化的 (n, dim) float32。"""

    def __init__(self, model_dir: str | None = None, threads: int = 0, providers: list | None = None,
                 model_file: str = DEFAULT_MODEL_FILE):
        model_dir = model_dir or DEFAULT_DIR
        cfg_path = os.path.join(model_dir, "config.json")
        if not os.path.exists(cfg_path):
            raise FileNotFoundError(
                f"找不到 {cfg_path}。模型不入库：先跑 python tools/get_bge_model.py 下载"
                f"（实测走 hf-mirror，huggingface.co 在本机 DNS 不通）")
        with open(cfg_path, "r", encoding="utf-8") as fh:
            self.config = json.load(fh)
        self.dim = int(self.config["hidden_size"])
        self.max_seq = int(self.config.get("max_position_embeddings", 512))
        self.tokenizer = WordPiece(os.path.join(model_dir, "vocab.txt"))
        import onnxruntime as ort                        # noqa: PLC0415 - 没装也能 import 本模块

        opts = ort.SessionOptions()
        opts.log_severity_level = 3
        if threads:
            opts.intra_op_num_threads = int(threads)
        # 默认 int8（22.9 MB）。**int8 在 wasm EP 和 CPU EP 上是两套 kernel**，实测两边算出来
        # 的向量差 0.6%（cos 0.994：同一批片子还捞得到，但 top3 名次会抖）。要两边逐位一致
        # 就换 model_file="model.onnx"（fp32，95 MB），代价是下载和推理都贵几倍。
        path = os.path.join(model_dir, "onnx", model_file)
        if not os.path.exists(path):
            raise FileNotFoundError(f"找不到 {path} —— 跑 python tools/get_onnx_assets.py 下载"
                                    f"（fp32 那份要加 --full）")
        self.session = ort.InferenceSession(
            path, sess_options=opts, providers=providers or ort.get_available_providers())
        self._feeds = {i.name for i in self.session.get_inputs()}

    # ---------- 推理 ----------
    def encode_batch(self, texts: list[str]) -> dict:
        encs = [self.tokenizer.encode(t, self.max_seq) for t in texts]
        width = max(len(e["input_ids"]) for e in encs)
        pad = self.tokenizer.pad_id
        ids = np.full((len(encs), width), pad, dtype=np.int64)
        mask = np.zeros((len(encs), width), dtype=np.int64)
        types = np.zeros((len(encs), width), dtype=np.int64)
        for r, e in enumerate(encs):
            n = len(e["input_ids"])
            ids[r, :n] = e["input_ids"]
            mask[r, :n] = e["attention_mask"]
            types[r, :n] = e["token_type_ids"]
        feed = {"input_ids": ids, "attention_mask": mask}
        if "token_type_ids" in self._feeds:
            feed["token_type_ids"] = types
        return feed

    def embed(self, texts: list[str], batch: int = 32) -> np.ndarray:
        """CLS pooling + L2 —— bge 系列的取法（不是 mean pooling），两边必须一致。"""
        out = []
        for i in range(0, len(texts), batch):
            part = texts[i:i + batch]
            feed = self.encode_batch([t or " " for t in part])
            hidden = self.session.run(["last_hidden_state"], feed)[0]
            vec = hidden[:, 0, :]                        # [CLS]
            nrm = np.linalg.norm(vec, axis=1, keepdims=True)
            out.append(vec / np.where(nrm == 0, 1.0, nrm))
        return np.ascontiguousarray(np.vstack(out), dtype=np.float32)

    def describe(self) -> dict:
        return {"model_dir": os.path.basename(DEFAULT_DIR), "dim": self.dim,
                "max_seq": self.max_seq, "pooling": "cls+l2",
                "providers": self.session.get_providers()}


_cache: dict[tuple, OnnxEncoder] = {}


def model_id(cfg: dict | None = None) -> str:
    """这套 onnx 配置**实际**用的是哪个模型 —— 写进索引 meta，运行期据此对账。

    为什么不让 `kb.build` 直接抄配置里的 `embedding.model`：那一段是和生成层共用的旋钮，
    provider=onnx 时它写的往往是服务商那个模型名（`qwen3.7-text-embedding-flash`）。
    照抄进 meta 就等于**索引自报了一个没参与建向量的模型名**：换个 int8/fp32 权重对账看不出来，
    两套空间的余弦硬乘，分数还会好看地骗人。文件名一起报，int8 和 fp32 换权重能被闸门抓到。
    """
    cfg = cfg or {}
    d = cfg.get("model_dir") or DEFAULT_DIR
    name = os.path.basename(os.path.normpath(d)) or "?"
    return f"{name}/{cfg.get('model_file') or DEFAULT_MODEL_FILE}"


def get_encoder(cfg: dict | None = None) -> OnnxEncoder:
    cfg = cfg or {}
    key = (cfg.get("model_dir") or DEFAULT_DIR, int(cfg.get("threads", 0) or 0),
           cfg.get("model_file") or DEFAULT_MODEL_FILE)
    if key not in _cache:
        _cache[key] = OnnxEncoder(key[0], key[1], cfg.get("providers"), key[2])
    return _cache[key]