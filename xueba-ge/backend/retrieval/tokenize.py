"""中英混合分词。

唯一的硬约束：**索引和查询必须走同一个函数**，否则字面匹不上，BM25 直接失效。

三处不是随手写写的处理：

1. **全角转半角**。「ＴＣＰ」和「TCP」必须是同一个词，否则专有词的字面匹配直接漏。
2. **中英混排粘合**。「B+ 树」→「B+树」。不粘回去，分词器会切出「树比」「树好」这种
   跨边界的假词 —— 而专有词的字面匹配优势正是我们保留 BM25 这条路的唯一理由。
3. **虚词按词表硬停，不看 df**（见 `_STOP_PHRASES`）。语料一旦偏斜，df 判虚词会反过来
   奖励噪声。索引侧和查询侧同一个 `_keep`，两边走不同规则才是灾难。
4. **整句交给 jieba**，不能先把中文段抠出来单独切（丢上下文）。领域术语另外用
   `config/userdict.txt` 注册，通用分词器不认识「页面置换」「银行家算法」。

jieba 装不上时退化成 CJK 字符 bigram：精度略降，但换机器跑不崩。
"""

from __future__ import annotations

import os
import re

_ASCII = re.compile(r"[a-z0-9][a-z0-9_+\-./#]*")
_HAS_CJK = re.compile(r"[\u4e00-\u9fff]")
_GAP_A = re.compile(r"([a-z0-9+#%])\s+([\u4e00-\u9fff])")
_GAP_B = re.compile(r"([\u4e00-\u9fff])\s+([a-z0-9+#])")

_CONFIG_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "config")

# 全角 ASCII（ＴＣＰ、０-９、全角标点）→ 半角
_FULL2HALF = {c: c - 0xFEE0 for c in range(0xFF01, 0xFF5F)}
_FULL2HALF[0x3000] = 0x20

# 这些单字几乎不携带检索信息，留着只会稀释 IDF。
_STOP_CJK = set("的了是在和与或及对为将由把被从到也都就还而且但则之其中能要个两这那有没什怎么样")
# 多字功能词（疑问/指代/人称/一般动词/连词）——**不看 df，按词表硬停**。
#
# 为什么不能只靠 df：原先的设计是「df > 35% 的词算虚词，不参与打分」。微积分上册入库后
# 这个假设当场失效 —— 全库 4197 片里教材占了 4089 片，"什么"这种词在正式教材里根本不出现，
# df 掉到 12，IDF 反而变得极高，一条计算机网络提纲（"各自在什么条件下切换"）就靠
# 「什么+使用」压过了真正的洛必达正文。虚词是不是虚词，取决于语言，不取决于语料有多少。
#
# 注意别停过头。两条实测出来的边界：
#   · "条件"在数学里是术语（充分条件、边界条件），不进表；
#   · "为什么/为何"也不进表 —— 说明文正文里它就是"这一段在讲原因"的路标。把它停掉，
#     `TCP 为什么需要三次握手` 这条查询的正确答案（net8#p105#i6，开头正是
#     "为什么 TCP 连接建立必须三次握手…"）从第 1 名掉到第 4 名，recall@3 当场从
#     100% 掉到 93%。查询侧看着像噪声的词，在文档侧可能是最强的段落信号。
_STOP_PHRASES = frozenset("""
什么 怎么 怎样 哪些 哪个 哪种 哪里 多少 是不是 能不能 有没有 可不可以
这个 那个 这些 那些 这样 那样 自己 我们 你们 他们 它们 大家
一下 一些 一个 一种 两个 时候 问题 情况 方面 东西
需要 可以 能够 应该 进行 使用 利用 采用 以及 并且 或者 但是 因为 所以 如果 那么 因此 而且 只是 就是 还是 不是
""".split())
_PUNCT = set("，。、；：！？“”‘’（）《》【】…—·,.;:!?\"'()<>[]{}|\\/@^&*~`%$+=- \t")

_JIEBA = None
_JIEBA_UNAVAILABLE = False


def _jieba():
    global _JIEBA, _JIEBA_UNAVAILABLE
    if _JIEBA is not None or _JIEBA_UNAVAILABLE:
        return _JIEBA
    try:
        import jieba

        jieba.setLogLevel(60)
        ud = os.path.join(_CONFIG_DIR, "userdict.txt")
        if os.path.exists(ud):
            jieba.load_userdict(ud)
        jieba.initialize()             # 提前建词典，别把首次代价漏给第一个用户
        _JIEBA = jieba
    except Exception:                  # pragma: no cover - 取决于部署机环境
        _JIEBA_UNAVAILABLE = True
        _JIEBA = None
    return _JIEBA


def normalize(text: str) -> str:
    if not text:
        return ""
    s = text.translate(_FULL2HALF).lower()
    for _ in range(3):                 # 「B+ 树 与」这种连续混排要粘两轮才干净
        s2 = _GAP_B.sub(r"\1\2", _GAP_A.sub(r"\1\2", s))
        if s2 == s:
            break
        s = s2
    return s


def cjk_bigrams(run: str) -> list[str]:
    """无分词器时的退路：单字 + 相邻二字。召回优先，精度交给 IDF 去压。"""
    out = [ch for ch in run if ch not in _STOP_CJK]
    out += [run[i:i + 2] for i in range(len(run) - 1)]
    return out


def _keep(w: str) -> bool:
    if not w or w in _STOP_PHRASES:
        return False
    if len(w) == 1 and (w[0] in _STOP_CJK or w[0] in _PUNCT):
        return False
    return any(ch not in _PUNCT for ch in w)


def tokens(text: str) -> list[str]:
    """切词。返回**可重复**的 token 列表 —— BM25 要算词频，不能去重。"""
    if not text:
        return []
    s = normalize(text)
    out: list[str] = list(_ASCII.findall(s))          # 术语/代码符号：正则保证完整成词
    jb = _jieba()
    if jb is None:
        for run in re.findall(r"[\u4e00-\u9fff]+", s):
            out += cjk_bigrams(run)
    else:
        for w in jb.lcut(s):
            w = w.strip()
            if _keep(w):
                out.append(w)
    return [t for t in out if _keep(t)]


def query_tokens(text: str, cap: int = 48) -> list[str]:
    """查询侧切词 + 去重（同一个词问两遍不额外带信息）。"""
    seen: set[str] = set()
    out: list[str] = []
    for t in tokens(text):
        if t in seen:
            continue
        seen.add(t)
        out.append(t)
        if len(out) >= cap:
            break
    return out


def engine_backend() -> str:
    return "jieba" if _jieba() is not None else "cjk-bigram"