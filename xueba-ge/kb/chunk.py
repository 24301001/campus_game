r"""语义切片器：把「一本教材」切成带出处的片段。

## 源文件格式（`kb/sources/*.md`）

`extract.py` 从 PDF 生成的就是这个格式，手写示例语料也用同一个格式 —— 这样
「示例语料」和「真教材」走的是完全相同的代码路径，PDF 到手那天零改动。

    ---
    course: 计算机网络
    book: 谢希仁《计算机网络》第8版
    book_id: net8
    source_type: textbook
    ---
    # 第3章 传输层
    ## 3.5 TCP 的连接管理
    [page:104]
    正文段落……空一行是下一段。

约定就三条：
  · `#`/`##`/`###` 是**标题栈**，决定 chapter / section —— 这就是"按语义边界切"的依据；
  · `[page:N]` 设定其后正文所属页码，**出处能不能点开全靠它**；
  · 空行分段；`|` 开头的连续行算一个表块，`-` 开头的连续行算一个列表块，
    表/列表**独立成片**，不和正文混在同一个向量里（混了会同时污染两路的召回）。

## 为什么"适度重叠"

切口正好落在答案中间，就会「明明书上有，但检索不到」。所以强制长段断开时，
把上一片的**最后一句**带进下一片开头。重叠只在硬切时发生 —— 正常按段边界切不重叠，
否则语料量白涨三成。
"""

from __future__ import annotations

import re

FRONT_RE = re.compile(r"^---\s*\n(.*?)\n---\s*\n", re.S)
HEAD_RE = re.compile(r"^(#{1,4})\s+(.*)$")
PAGE_RE = re.compile(r"^\[page:(\d+)\]$")
SENT_RE = re.compile(r"[^。！？；!?;\n]+[。！？；!?;]?")

TARGET_CHARS = 420          # 目标片长（中文字符）
MAX_CHARS = 600             # 超过就按句硬切
MIN_CHARS = 40              # 短于这个就并进前一片，避免"标题孤片"
_TOKEN_RE = re.compile(r"\S+\s*")     # 按空格攒东西用（表格 HTML、LaTeX 数组里有空格）


class ChunkError(ValueError):
    pass


def parse_front_matter(raw: str) -> tuple[dict, str]:
    m = FRONT_RE.match(raw)
    if not m:
        raise ChunkError("源文件缺少 --- 头部（需要 course / book / book_id / source_type）")
    meta: dict[str, str] = {}
    for line in m.group(1).splitlines():
        if ":" in line and not line.strip().startswith("#"):
            k, v = line.split(":", 1)
            meta[k.strip()] = v.strip()
    for need in ("course", "book", "book_id"):
        if not meta.get(need):
            raise ChunkError(f"头部缺字段 {need}")
    return meta, raw[m.end():]


def blocks_of(body: str):
    """把正文切成块：('heading'|'page'|'para'|'table'|'list'|'code', payload, line_no)。"""
    out = []
    buf: list[str] = []
    kind = None

    def flush():
        nonlocal buf, kind
        if buf and kind:
            out.append((kind, "\n".join(buf).strip()))
        buf = []
        kind = None

    for line in body.splitlines():
        s = line.strip()
        if not s:
            flush()
            continue
        h = HEAD_RE.match(s)
        if h:
            flush()
            out.append(("heading", f"{'#' * len(h.group(1))} {h.group(2).strip()}"))
            continue
        pg = PAGE_RE.match(s)
        if pg:
            flush()
            out.append(("page", pg.group(1)))
            continue
        if s.startswith("```"):
            flush()
            kind = "code" if kind != "code" else None
            if kind:
                buf = []
            continue
        nxt = "table" if s.startswith("|") else ("list" if (s.startswith(("- ", "* ", "+ ")) or re.match(r"^\d+[.)]\s", s)) else "para")
        if kind and kind != nxt:
            flush()
        kind = kind or nxt
        buf.append(s)
    flush()
    return out


def _units(s: str) -> list[tuple[str, bool]]:
    """一句 -> [(片段, 这片是不是硬切出来的)]。不超 MAX_CHARS 就原样一条。

    整段不带任何句末标点的东西在真语料里是有的：OCR 出来的表格 HTML、
    《数据结构》第 311 页那个 3,595 字的 LaTeX 数组。原先"按句断"在这类段落上
    等于没断，实测《概率论》附表一片 18,777 字直接进索引 —— 长度归一被压坏，
    检索到就是上万字喂模型。所以再退两级：先按空格攒，连空格都没有就按字硬切。
    """
    if len(s) <= MAX_CHARS:
        return [(s, False)]
    out = []
    for tok in _TOKEN_RE.findall(s) or [s]:
        for i in range(0, len(tok), MAX_CHARS):
            out.append((tok[i:i + MAX_CHARS], True))
    return out


def _hard_split(text: str) -> list[str]:
    """长段按句断，并把上一片的末句带进下一片（适度重叠）。

    重叠只给"整句"用：硬切出来的片段再复制一遍进下一片，纯属把同一串垃圾
    喂两次（实测《数据结构》两邻片因此各带 2,825 字同样的内容）。
    """
    units = []
    for raw in SENT_RE.findall(text):
        s = raw.strip()
        if s:
            units += _units(s)
    parts: list[str] = []
    cur: list[str] = []
    n = 0
    for s, fragmented in units:
        if cur and n + len(s) > MAX_CHARS:
            parts.append("".join(cur))
            cur = [] if fragmented else cur[-1:]    # 重叠：只带最后一句，硬切片段不带
            n = sum(len(x) for x in cur)
        cur.append(s)
        n += len(s)
    if cur:
        parts.append("".join(cur))
    return [p for p in parts if p.strip()]


# ---------- 相邻片段的「上下文」窗口：绝不把 LaTeX 从中间劈开 ----------
CTX_CHARS = 80               # 一侧最多带多少字
# 成对的数学式：行式 $$..$$ 可以含换行，行内 $..$ 不行
_PAIR_RE = re.compile(r"\$\$[^$]+\$\$|\$[^$\n]+\$")
# 切上下文用的「最小块」：一个公式、一个带参宏、一个控制序列、一个汉字、一个西文单词各算一块。
# 关键是 $...$ 和 \boldsymbol{A} 这类东西**不可分割**；其余按字/词切，
# 一个 HTML 标签也算一块（拆开就会露出 `/table>` 这种半截壳子）；
# 末尾两条（空白、任意单字符）是兜底 —— 少一条就会把中文标点和空格直接吃掉，
# 而上下文必须是原文的逐字子串，改一个字都不行。
_ATOM_RE = re.compile(
    r"\$\$.*?\$\$"
    r"|\$[^$\n]*\$"
    r"|\\[A-Za-z]+\{(?:[^{}\\]|\\.|\{(?:[^{}\\]|\\.)*\})*\}"
    r"|\\[A-Za-z]+"
    r"|\\[^A-Za-z]"
    r"|</?[A-Za-z][A-Za-z0-9]*/?>"
    r"|[$]"
    r"|[\u4e00-\u9fff]"
    r"|[A-Za-z0-9_.%]+"
    r"|\s+"
    r"|[^\s]")


def ctx_ok(s: str) -> bool:
    """这段上下文能不能安全地显示给真人、喂给模型。

    只问两件事：`$` 全部成对，`\\begin{}` 与 `\\end{}` 数量相等。不满足就宁可少给 ——
    一个没闭合的 `$` 会让前端 KaTeX 配不了对，整条上下文原样吐成
    `\\begin{pmatrix}1 & 0 \\\\0 & 2\\end{pmatrix}`，用户在卡片上看到的就是「乱码」。
    """
    if _PAIR_RE.sub("", s).count("$"):
        return False
    return s.count("\\begin{") == s.count("\\end{")


# 数学式外面不该出现的东西：反斜杠（裸宏、markdown 的换行）、裸花括号（`_{3}` 这种
# 上下标残渣），还有 OCR 从卷子里带出来的 HTML 表格壳子（实测《算法》答案有 980 处
# 上下文是 `></tr><tr><td>主定理</td><` 这种）。标签名一律要求两个字母以上，免得把
# `Key<A[mid]`、`<d> 的右陪集` 这种正常式子误伤；源文件里没写闭合的半截 `<td` 也要
# 抓住，所以尖括号两头各查一遍。只要冒头，这段上下文就是在给人看乱码。
_JUNK_RE = re.compile(r"\\|[{}]|</?[A-Za-z]{2,}|[A-Za-z]{2,}>")


def ctx_renderable(s: str) -> bool:
    r"""这段上下文能不能**给人看**（比 ctx_ok 更严）。

    除了 `$` 成对，还要排掉一种情况：源文件本来就没用 `$` 把公式包起来 ——
    实测《算法》试卷答案 OCR 出来有 401 处 `n_prev/n_next` 是
    `\boldsymbol{A}_{4} \boldsymbol{A}_{5} \right)` 这种裸宏串（占全部上下文片段的
    1.05%），前端拿不到定界符就只能原样显示。剥掉成对数学式之后**只要还剩一个**
    反斜杠、裸花括号或 HTML 标签，就说明这一眼看上去是乱码，宁可不给这一段上下文。
    """
    if not ctx_ok(s):
        return False
    return not _JUNK_RE.search(_PAIR_RE.sub("", s))


def _take(atoms: list[str], limit: int, from_end: bool) -> list[str]:
    """从靠近本片的那一头开始，整块整块地攒到 limit（返回阅读顺序）。

    第一块无条件收下：装不下一个完整公式时，「多给点」远好于「把公式劈成两半」。
    """
    out: list[str] = []
    n = 0
    seq = list(reversed(atoms)) if from_end else atoms
    for a in seq:
        if n and n + len(a) > limit:
            break
        out.append(a)
        n += len(a)
        if n >= limit:
            break
    if from_end:
        out.reverse()
    return out


_MEAT_RE = re.compile(r"[A-Za-z0-9\u4e00-\u9fff]")


def _keep(picked: list[str]) -> str:
    r"""收尾：光剩标点、或者首尾挂着半个尖括号斜杠的残渣，不如不给。

    标签壳子整块丢掉之后，接缝上可能剩下一个孤零零的 `<` 或 `>`（源文件里
    那种没写完的 `<td`）；这种字符没有信息量，剥掉。
    """
    out = "".join(picked).strip().strip("<>/ \n\t")
    return out if _MEAT_RE.search(out) else ""


def context_before(text: str, limit: int = CTX_CHARS) -> str:
    """前一片的结尾（界面上的「上文 …」、prompt 里的「上：」）。

    不干净就从**不靠近本片**的那一头整块丢掉，直到干净 —— 优先保住贴着本片的字。
    幂等：对已经裁好的结果再算一次，不会变更短以外的东西。
    """
    picked = _take(_ATOM_RE.findall(text), limit, True)
    if len(picked) == 1 and len(picked[0]) > limit * 2:
        return ""                     # 紧挨着一个巨型公式：宁可不给上文
    while picked and not ctx_renderable("".join(picked)):
        picked.pop(0)
    return _keep(picked)


def context_after(text: str, limit: int = CTX_CHARS) -> str:
    """后一片的开头（「下文 …」）。规则同 context_before，方向相反。"""
    picked = _take(_ATOM_RE.findall(text), limit, False)
    if len(picked) == 1 and len(picked[0]) > limit * 2:
        return ""
    while picked and not ctx_renderable("".join(picked)):
        picked.pop()
    return _keep(picked)


def chunk_source(raw: str, filename: str = "<inline>") -> list[dict]:
    """一个源文件 -> 若干片。每片自带完整出处元数据。"""
    meta, body = parse_front_matter(raw)
    course = meta["course"]
    book = meta["book"]
    book_id = meta["book_id"]
    source_type = meta.get("source_type", "textbook")

    chapter = ""
    section = ""
    page = 0
    pending_head = ""
    pieces: list[dict] = []

    def emit(text: str, kind: str):
        pieces.append({
            "course": course, "book": book, "book_id": book_id, "source_type": source_type,
            "chapter": chapter or section, "section": section or chapter, "page": page,
            "heading": pending_head, "kind": kind, "text": text.strip(),
            "file": filename,
        })

    for kind, payload in blocks_of(body):
        if kind == "page":
            page = int(payload)
            continue
        if kind == "heading":
            lvl = payload.index(" ")
            depth = payload[:lvl].count("#")
            title = payload[lvl + 1:].strip()
            pending_head = title
            if depth <= 1:
                chapter, section = title, ""
            elif depth == 2:
                section = title
            continue
        text = payload
        if len(text) < MIN_CHARS and pieces:
            last = pieces[-1]
            if last["page"] == page:                     # 只在同页内合并，否则出处会错
                last["text"] += "\n" + text
                continue
        if kind in ("para",) and len(text) > MAX_CHARS:
            for sub in _hard_split(text):
                emit(sub, kind)
        else:
            emit(text, kind)

    for i, p in enumerate(pieces):
        p["id"] = f"{book_id}#p{p['page'] or 0}#i{i}"
        p["chars"] = len(p["text"])
        p["n_prev"] = context_before(pieces[i - 1]["text"]) if i else ""
        p["n_next"] = context_after(pieces[i + 1]["text"]) if i + 1 < len(pieces) else ""
    return [p for p in pieces if p["text"]]


def chunk_file(path: str) -> list[dict]:
    import os

    with open(path, "r", encoding="utf-8") as fh:
        return chunk_source(fh.read(), os.path.basename(path))