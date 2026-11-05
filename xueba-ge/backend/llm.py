r"""生成层网关 —— **整个交付件里唯一持有 API Key 的地方**。

架构 A 的硬约束就在这里：Key 只在服务端，绝不下发进浏览器。
（浏览器里写 Key = 任何人 F12 就能拿走刷爆额度，这一条没有商量余地。）

provider:
  `stub` 不需要密钥。它把检索到的课本原文按引用编号组织成回答，
         **让整条链（登录 → 提问 → 流式 → 点出处）在没有任何外部服务时也能跑完**。
         拿到 Key 之前用它开发前端和验交互，用它做的检索评测同样有效（检索在它之前）。
  `api`  OpenAI 兼容 `/chat/completions`，流式。
         路由用**非流式**一次调用（带 tools），答案用**流式**一次调用 ——
         不去攒 tool_calls 的增量分片，那种解析在任何一家兼容实现上都不稳。
Key 的三处来源，按优先级：环境变量 `key_env` -> `config/llm.json` 的 `key` ->
`data/.llm_key`（本地开发用，`data/` 已在 .gitignore 里，别提交）。
服务器上只用环境变量，密钥文件不用带上去。

服务商特有参数走 `extra_body`：实测 qwen3.8-flash 关掉 enable_thinking 之后，
首字 18.6s -> 0.85s、输出 951 -> 437 token、路由 10.4s -> 2.1s。
"""

from __future__ import annotations

import json
import os
import re
import time
from typing import Iterable, Iterator

from .settings import load_config, resolve_key


class LLMError(RuntimeError):
    pass


def _key(cfg: dict) -> str:
    """三处来源见 `settings.resolve_key`（向量和生成分开写会走偏，所以只剩这一处）。"""
    return resolve_key(cfg)


class LLM:
    def __init__(self, cfg: dict | None = None):
        self.cfg = cfg if cfg is not None else load_config("llm", {})
        self.provider = self.cfg.get("provider", "stub")

    def describe(self) -> dict:
        cfg = self.cfg
        return {"provider": self.provider, "model": cfg.get("model") if self.provider == "api" else "stub",
                "key_present": bool(_key(cfg)) if self.provider == "api" else None,
                "stream": bool(cfg.get("stream", True))}

    # ---------- 服务商特有参数 ----------
    def _extras(self) -> dict:
        """把 `llm.extra_body` 里剥掉会搞坏链路的键，剩下的原样透传。

        DashScope、DeepSeek 这些兼容口各有各的私货参数（enable_thinking、
        thinking_budget……），写死在代码里就等于绑死一家服务商。
        """
        reserved = {"model", "messages", "stream", "tools", "tool_choice"}
        return {k: v for k, v in (self.cfg.get("extra_body") or {}).items() if k not in reserved}

    # ---------- 路由：让模型选工具 ----------
    def route(self, question: str, tool_specs: list[dict], context: str = "") -> tuple[str, dict] | None:
        """返回 (tool_name, args)；返回 None 表示该由调用方用关键词兜底分类。"""
        if self.provider != "api":
            return None
        msgs = [{"role": "system", "content":
                 "你在为「学霸哥」做意图路由。只选一个工具，不要回答内容本身。"
                 "判据：问原理/概念/区别/为什么 → askTextbook；给了一道具体的题要算要推 → explainProblem；"
                 "问怎么学/考什么/要资料/先修关系 → makeStudyPlan。"
                 "另外在 terms 里给出 2~4 个**教材里会用的规范术语**来复述这个问题："
                 "学生说『准则』书上写『法则』，说『内存爆了』书上写『缺页』，"
                 "说『谁也不让谁』书上写『死锁』。只能给标准术语名，"
                 "不知道书上怎么写就留空数组 —— 编一个词比不补更糟。"}]
        if context:
            msgs.append({"role": "system", "content": "最近的对话（用于补全指代）：\n" + context})
        msgs.append({"role": "user", "content": question})
        try:
            r = self._post({"model": self.cfg["model"], "messages": msgs, "tools": tool_specs,
                            "tool_choice": "auto", "temperature": 0.0, "max_tokens": 200,
                            "stream": False, **self._extras()})
        except LLMError:
            return None
        call = (r.get("choices") or [{}])[0].get("message", {}).get("tool_calls")
        if not call:
            return None
        fn = call[0].get("function", {})
        try:
            args = json.loads(fn.get("arguments") or "{}")
        except json.JSONDecodeError:
            args = {}
        return fn.get("name") or "", args

    # ---------- 生成：一次性（非流式） ----------
    def complete(self, messages: list[dict], max_tokens: int = 300,
                 temperature: float = 0.2) -> str:
        """要"一整段"而不是要打字机的场合用（记忆归纳）。provider=stub 时直接抛：
        抽取式的 stub 拼不出摘要，宁可让调用方走规则版兜底，也别把"我概括为…"这种话交给它。"""
        if self.provider != "api":
            raise LLMError("provider=stub，没有可用的归纳")
        r = self._post({"model": self.cfg["model"], "messages": messages,
                        "temperature": temperature, "max_tokens": max_tokens, "stream": False,
                        **self._extras()})
        msg = ((r.get("choices") or [{}])[0].get("message") or {})
        return (msg.get("content") or "").strip()

    # ---------- 拍照识别：多模态一次调用（非流式） ----------
    def read_image(self, data_url: str, prompt: str, model: str = "",
                   max_tokens: int = 900, timeout: int = 0) -> tuple[str, dict]:
        """一张图 + 一句指令 -> 文字。返回 (正文, usage)。

        默认沿用 `llm.model`：实测同一个 qwen3.8-flash 就吃 `image_url`
        （一张题目图 188 image_tokens、2.9~3.4 s、in=288/out=220 token），
        不必为视觉另开一个 vl 模型的账。`extra_body` 照旧透传，
        所以 enable_thinking 那条护栏在这里同样生效（不传的话实测会白烧 42 个 reasoning token）。
        """
        if self.provider != "api":
            raise LLMError(f"provider={self.provider}，没有视觉能力")
        body = {"model": model or self.cfg["model"],
                "messages": [{"role": "user", "content": [
                    {"type": "image_url", "image_url": {"url": data_url}},
                    {"type": "text", "text": prompt}]}],
                "temperature": 0.0, "max_tokens": max_tokens, "stream": False, **self._extras()}
        r = self._post(body, timeout=timeout)
        choice = (r.get("choices") or [{}])[0]
        text = ((choice.get("message") or {}).get("content") or "").strip()
        if not text:
            raise LLMError("模型没给识别结果"
                           + (f"（finish={choice.get('finish_reason')}）" if choice.get("finish_reason") else ""))
        return text, (r.get("usage") or {})

    # ---------- 生成：流式 ----------
    def stream(self, messages: list[dict]) -> Iterator[str]:
        if self.provider == "api":
            yield from self._stream_api(messages)
        else:
            yield from _stub_stream(messages)

    def _stream_api(self, messages: list[dict]) -> Iterator[str]:
        body = {"model": self.cfg["model"], "messages": messages,
                "temperature": self.cfg.get("temperature", 0.3),
                "max_tokens": self.cfg.get("max_tokens", 1200), "stream": True}
        body.update(self._extras())
        if self.cfg.get("prompt_cache", True):
            # 服务商侧的前缀缓存（把 persona + 资料放前面、问题放最后）基本都自动命中；
            # 这里显式带上，是为了在换服务商时至少有一个可控开关。
            body["prompt_cache_key"] = "xueba-ge"
        lines = self._sse(body)
        produced = 0
        for raw in lines:
            try:
                obj = json.loads(raw)
            except json.JSONDecodeError:
                continue
            ch = (obj.get("choices") or [{}])[0]
            piece = ((ch.get("delta") or {}).get("content")) or (ch.get("message") or {}).get("content") or ""
            if piece:
                produced += len(piece)
                yield piece
        if not produced:
            # 思考型模型会把 token 花在 reasoning_content 上，正文一个字不给，
            # 而且 max_tokens 封不住它（实测 out=976 > max_tokens=900）。
            # 这种时候必须说话，不能让前端转完圈以后显示一条空回答。
            raise LLMError("模型没返回正文（可能在 reasoning_content 里想完了）——"
                           "调大 max_tokens，或在 extra_body 里关掉 enable_thinking")

    def _sse(self, body: dict) -> Iterable[str]:
        import requests

        key = _key(self.cfg)
        if not key:
            raise LLMError("llm.provider=api 但没找到 Key（检查 config/llm.json 的 key_env）")
        url = self.cfg["base_url"].rstrip("/") + "/chat/completions"
        try:
            with requests.post(url, json=body, stream=True, timeout=self.cfg.get("timeout", 60),
                               headers={"Authorization": f"Bearer {key}",
                                        "Accept": "text/event-stream"}) as r:
                if r.status_code >= 400:
                    raise LLMError(f"LLM 接口 {r.status_code}: {r.text[:200]}")
                for line in r.iter_lines(decode_unicode=True):
                    if not line or not line.startswith("data:"):
                        continue
                    payload = line[5:].strip()
                    if payload and payload != "[DONE]":
                        yield payload
        except LLMError:
            raise
        except Exception as exc:                       # noqa: BLE001
            raise LLMError(f"调用 LLM 失败：{exc}") from exc

    def _post(self, body: dict, timeout: int = 0) -> dict:
        import requests

        key = _key(self.cfg)
        if not key:
            raise LLMError("llm.provider=api 但没找到 Key")
        url = self.cfg["base_url"].rstrip("/") + "/chat/completions"
        try:
            r = requests.post(url, json=body, timeout=timeout or self.cfg.get("timeout", 60),
                              headers={"Authorization": f"Bearer {key}"})
        except Exception as exc:                       # noqa: BLE001
            raise LLMError(f"调用 LLM 失败：{exc}") from exc
        if r.status_code >= 400:
            raise LLMError(f"LLM 接口 {r.status_code}: {r.text[:200]}")
        return r.json()


# ============================ stub 生成 ============================

_MATERIALS = re.compile(r"【资料】(.*?)(?=【问题】)", re.S)
_QUESTION = re.compile(r"【问题】(.*)$", re.S)
_TOOL = re.compile(r"^\[\[tool:(\w+)\]\]", re.M)


def _stub_stream(messages: list[dict]) -> Iterator[str]:
    """无密钥时的**抽取式**回答：只把检索到的原文按编号串起来。

    它刻意不"像人话"—— stub 的职责是验证链路与交互，不是冒充模型。
    所以看到这种回答说明 provider 还是 stub，别拿它去答辩。
    """
    joined = "\n".join(m.get("content", "") for m in messages if m.get("role") == "user")
    mats = _MATERIALS.findall(joined)
    q = _QUESTION.findall(joined)
    tool = (_TOOL.findall(joined) or ["askTextbook"])[0]
    refs = []
    for block in mats:
        for line in block.splitlines():
            m = re.match(r"^\[(\d+)\]〔(.*?)〕(.*)$", line.strip())
            if m:
                refs.append((int(m.group(1)), m.group(2), m.group(3)))
    question = q[-1].strip() if q else ""
    if not refs:
        text = "这个我课本里没翻到。你换个说法，或者告诉我哪本书哪一章 —— 我不想凭记忆给你说错。\n（当前 provider=stub，接上 LLM 后这里由模型作答）"
    elif tool == "explainProblem":
        text = _stub_steps(question, refs)
    elif tool == "makeStudyPlan":
        text = _stub_plan(refs)
    else:
        text = _stub_explain(refs)
    text += f"\n\n> provider=stub ｜ {time.strftime('%H:%M:%S')}"
    for i in range(0, len(text), 14):
        yield text[i:i + 14]


def _stub_explain(refs) -> str:
    head = "课本上是这么说的："
    body = "\n".join(f"{n}. 〔{src}〕{txt[:150]}{'…' if len(txt) > 150 else ''}" for n, src, txt in refs[:4])
    tail = "\n".join(f"[{n}] 出处：{src}" for n, src, _ in refs[:4])
    return f"{head}\n\n{body}\n\n{tail}"


def _stub_steps(question: str, refs) -> str:
    src = refs[0]
    sents = [s.strip() for s in re.split(r"[。；]", src[2]) if len(s.strip()) > 10][:3] or [src[2][:60]]
    lines = [f"先看清题目要什么：{question[:40]}", ""]
    for i, s in enumerate(sents, 1):
        lines.append(f"第{i}步 · {s[:70]}{'…' if len(s) > 70 else ''} [{src[0]}]")
    lines.append("")
    lines.append("到这一步你自己先算一遍，卡住告诉我第几步。")
    return "\n".join(lines)


def _stub_plan(refs) -> str:
    lines = ["复习路线（按资料里的说法排的）：", ""]
    for n, src, txt in refs[:4]:
        lines.append(f"· 〔{src}〕{txt[:90]}{'…' if len(txt) > 90 else ''} [{n}]")
    lines.append("")
    lines.append("重点和分值以提纲/往年卷为准，上面每条都能点开看原文。")
    return "\n".join(lines)
