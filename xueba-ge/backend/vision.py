r"""拍照 / 截图提问 —— 把题目图片转成**可编辑的文字**，再走原来那条检索链。

为什么不直接把图丢给模型让它答（三条理由，都是这条链已有的口径）：

1. **出处靠检索**。BM25 和向量都只吃文字；图不转成字，`[n]` 编号和「第186页」就无从产生，
   而"页码不靠模型回忆"是 prompts.py 开头钉死的规矩。实测：例4 那张图转成文字之后，
   检索第一条命中就是《概率论与数理统计》第186页的例4 原文 —— **图在书的哪一页根本不用我去找**。
2. **识别会错，而且错得很像**。数字认错一位（0.515→0.518）模型不会质疑，它会照着错的数据
   一路算到底。所以这段字必须**看得见、能改**：默认识别完自动发出去问（组长 2026-09-22 口径：
   拍完就出答案），但题面原样挂在带 📷 的那条气泡上，认错了一眼看得见、改一句重问就行；
   图片条上「拍完直接问」那个勾一关，就退回"先落在输入框里改完再发"。
3. **两段延迟分开**。识别 3 s 有明确的"识别中"，正文仍然走原来的流式；混在一起就变成
   "发张图干等十几秒什么都不出"。

Key 仍然只在 backend/llm.py：这个文件连读都不读，图片经 `LLM.read_image()` 出去。
默认沿用 `llm.model`（qwen3.8-flash）—— 实测同一个模型就吃 `image_url`，不必另开一个 vl 的账。
"""

from __future__ import annotations

import base64
import binascii
import re
import time

from .llm import LLMError
from .settings import load_config

MIME_OK = ("image/png", "image/jpeg", "image/webp", "image/bmp", "image/gif")


class VisionError(RuntimeError):
    """图片这一侧的错。话术直接给前端显示，所以写人话，不写异常栈。"""


PROMPT = "\n".join([
    "把图片里的题目或正文**一字不差**转写出来。只转写，不要解题、不要翻译、不要补充解释。",
    "· 数学式子写成 LaTeX，行内用 $...$；分数、根号、积分、上下标都要。",
    "· 数字、小数点、单位一个都不许改；中文标点照原样。",
    "· 图里有多小题就按原来的顺序逐行列出，保留题号（例4 / 1-3 / 6.22 这种）。",
    "· 认不准的字用一个 □ 占位，**不要猜一个字填上去**。",
    "· 图不是题目也不是正文（人像、风景、聊天截图）时，只回一行：这不是题目。",
    "只输出转写结果本身，不要加引号、不要代码块、不要说「好的」。",
])

_DATA_URL = re.compile(r"^data:([^;,\s]+)\s*;\s*base64\s*,(.*)$", re.S)
_FENCE_OPEN = re.compile(r"^```[a-zA-Z0-9]*[ \t]*\n?")
_FENCE_CLOSE = re.compile(r"\n?```\s*$")
_LEAD = re.compile(r"^(转写结果|识别结果|图片里的内容|图片内容)[为是:：]?\s*")
# 模型偶尔会先说一句"好的，图片内容如下："。只剥**单独成行、短、且以这些词起头**的那一行，
# 题干本身（"求下列极限"那种短行）不会被误伤。
_INTRO = re.compile(r"^(好的|嗯|当然|以下是|下面是|这是|图片|转写|识别|题目)[^0-9$□]{0,20}[：:，,。]?$")
_NOT_PROBLEM = re.compile(r"^这不是题目")


def parse_data_url(src: str) -> tuple[str, bytes]:
    """data URL -> (mime, 原始字节)。浏览器 `FileReader.readAsDataURL` 出来的就是这一串。"""
    m = _DATA_URL.match((src or "").strip())
    if not m:
        raise VisionError("没收到图片数据（要的是 `data:image/png;base64,……` 那一串）")
    mime = (m.group(1) or "").lower()
    if mime == "image/jpg":
        mime = "image/jpeg"
    if mime not in MIME_OK:
        raise VisionError(f"{mime} 这种图服务商不一定认，截成 PNG 或 JPG 再试一次")
    try:
        raw = base64.b64decode(m.group(2), validate=False)
    except (binascii.Error, ValueError) as exc:
        raise VisionError(f"图片数据没解开（{type(exc).__name__}），重截一张试试") from None
    if not raw:
        raise VisionError("图片是空的")
    return mime, raw


def check_size(n_bytes: int, max_mb: float) -> None:
    """上限是给"整屏截图"准备的：一张题目图 100~400 KB 就够，base64 还要再乘 4/3。"""
    if n_bytes > max_mb * 1048576:
        raise VisionError(f"图片 {n_bytes / 1048576:.1f} MB，超过上限 {max_mb:g} MB"
                          " —— 只截题目那一块就行，别截整屏")


# ---------------- 缩略图：拍照那条气泡上那张图的存储口径 ----------------
THUMB_MAX_CHARS = 160000          # 约 117 KB 原始字节（base64 撑大的那 4/3 已经算在里面）
_THUMB = re.compile(r"^data:image/(?:jpeg|png|webp);base64,[A-Za-z0-9+/=]+$")


def clean_thumb(src: str) -> str:
    """前端压好的缩略图，入库前的三道检查。**不合格一律回空串，不报错**。

    存不进去的代价只是"这条气泡看不到图"，识别出来的文字照样在、照样能接着追问；
    为这个把用户已经发出去的问题打回 400 是本末倒置。
    · 只收 jpeg/png/webp 的 data URL（gif/bmp 不进库：动图和 1 位色没那个必要）；
    · 长度卡 `THUMB_MAX_CHARS`：一个会话几十条，每条挂一张图的账要算得起；
    · 字符集白名单：这一串以后会原样进 `<img src>`，宁可在这儿拦住。
    """
    s = (src or "").strip()
    if not s or len(s) > THUMB_MAX_CHARS or not _THUMB.match(s):
        return ""
    return s


def clean(text: str, max_chars: int = 0) -> tuple[str, bool]:
    """去掉模型爱加的代码块壳子和"好的，"这类前言。返回 (正文, 有没有被截断)。"""
    t = (text or "").strip()
    t = _FENCE_OPEN.sub("", t)
    t = _FENCE_CLOSE.sub("", t)
    first, nl, rest = t.partition("\n")
    if nl and _INTRO.match(first.strip()):
        t = rest.lstrip("\n")
    t = _LEAD.sub("", t).strip().strip('"').strip()
    t = re.sub(r"\n{3,}", "\n\n", t)
    cut = False
    if max_chars and len(t) > max_chars:
        t = t[:max_chars].rstrip() + "…"
        cut = True
    return t, cut


class Reader:
    """一张图 -> 一段可编辑的题目文字。开关和上限都在 `config/llm.json` 的 `vision` 块里。"""

    def __init__(self, llm, cfg: dict | None = None):
        self.llm = llm
        self.cfg = cfg if cfg is not None else (load_config("llm", {}).get("vision") or {})

    @property
    def max_mb(self) -> float:
        return float(self.cfg.get("max_mb", 6))

    @property
    def model(self) -> str:
        """留空就跟着主模型走：同一把 Key、同一份计费、同一个服务商。"""
        return str(self.cfg.get("model") or self.llm.cfg.get("model", "") or "")

    def available(self) -> bool:
        return self.llm.provider == "api" and bool(self.model)

    def describe(self) -> dict:
        return {"available": self.available(), "provider": self.llm.provider,
                "model": self.model, "max_mb": self.max_mb}

    def read(self, data_url: str) -> dict:
        """识别一张图。校验全在**花钱那一步之前**做完，格式不对不该产生任何调用。"""
        mime, raw = parse_data_url(data_url)
        check_size(len(raw), self.max_mb)
        if not self.available():
            raise VisionError(f"拍照识别要有真模型（现在 llm.provider={self.llm.provider}，没有眼睛）。"
                              "接上 Key 就能用，代码一行不用改")
        url = (data_url or "").strip()
        if not url.startswith("data:"):
            url = f"data:{mime};base64," + base64.b64encode(raw).decode()
        t0 = time.perf_counter()
        text, usage = self.llm.read_image(url, PROMPT, model=self.model,
                                          max_tokens=int(self.cfg.get("max_tokens", 900)),
                                          timeout=int(self.cfg.get("timeout", 45)))
        body, cut = clean(text, int(self.cfg.get("max_chars", 4000)))
        if not body:
            raise VisionError("什么都没识别出来 —— 图太糊或字太小，截近一点再试")
        if _NOT_PROBLEM.match(body):
            raise VisionError("这张图里没看到题目或正文（模型原话：「" + body[:40] + "」）")
        return {"text": body, "truncated": cut, "ms": round((time.perf_counter() - t0) * 1000),
                "model": self.model, "mime": mime, "bytes": len(raw),
                "in_tokens": usage.get("prompt_tokens"),
                "out_tokens": usage.get("completion_tokens")}
