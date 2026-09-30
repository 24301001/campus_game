r"""Prompt 组装。

顺序是**固定的**：persona → 资料 → 对话 → 问题。这不是风格问题：
provider=api 时前缀（persona + 资料）稳定不变，服务商的前缀缓存才可能命中；
把问题放前面等于主动放弃 prompt caching。

出处规则也在这里钉死：**资料行自带〔课程·教材·章·节·第N页〕**，
模型只需照抄编号，页码不靠它回忆 —— 让它凭记忆写页码，演示时点不开就露馅。

另一条同样是从真教材里逼出来的：见 `material_text`。切片按段落切，一条定理可能散在
两三片里，只喂单片等于让模型照着半句话编结论。
"""

from __future__ import annotations

import re

_STEP_MARK = "###"
# 句末标点 + 闭合符号（公式片以 $$ 收尾、括号/引号收尾都算说完了一半以上）
_END_OK = "。！？；.!?;:）)】》」』”’$%"


def _flat(text: str) -> str:
    return re.sub(r"\s*\n\s*", " ", text or "").strip()


def is_cut(text: str) -> bool:
    """这一片像不像被切在句子中间。教材正文是按段落/公式块切片的，
    一条定理的"条件—式子—结论"经常散在三片里（实测微积分上册 2.5.2 就是这样）。"""
    return bool(text) and text[-1] not in _END_OK


def material_text(chunk: dict) -> str:
    """给模型看的正文：本片原文 + （被切断时）相邻片的 80 字上下文。

    上下文必须标明"非本片原文"，否则模型会把它当引用内容写进答案，
    而前端引用表（refs）里只有本片 —— 点开会不一样，这是演示现场最难看的一种错。
    """
    text = _flat(chunk.get("text", ""))
    if not is_cut(text):
        return text
    prev, nxt = _flat(chunk.get("n_prev")), _flat(chunk.get("n_next"))
    ctx = "｜".join(x for x in (f"上：…{prev}" if prev else "", f"下：{nxt}…" if nxt else "") if x)
    return f"{text} 〔上下文，非本片原文，勿据此引用：{ctx}〕" if ctx else text


_PLACE = re.compile(r"\{([^{}]+)\}")


def _fill(template: str, persona: dict) -> str:
    """把 `{role}` / `{voice.语气}` 这类**点号路径**占位符换成 persona 里的值。

    2026-09-20 修的真 bug：原来这里只手工替了 5 个顶层键，`{voice.语气}` 和 `{voice.句长}`
    是**原样发给模型的**（渲染出来看一眼就知道），也就是说"语气配置"从写下那天起没生效过。
    查不到的占位符原样留着 —— 兜底话术里的 `{course}`/`{hint}` 走的是另一条替换，别在这里吃掉。
    """
    def one(m):
        cur = persona
        for part in m.group(1).split("."):
            if isinstance(cur, dict) and part in cur:
                cur = cur[part]
            else:
                return m.group(0)
        if isinstance(cur, (list, tuple)):
            cur = "；".join(str(x) for x in cur)
        return _flat(str(cur))

    return _PLACE.sub(one, template)


def memory_block(memory: str) -> str:
    """长期记忆的注入段。单独成一个函数：它是最容易改口味的一段，也方便测试钉住措辞。

    为什么放在 system 里而不是伪装成一条历史消息：伪装成 history 它就会被前端的历史逻辑
    当成"学霸哥说过这句话"（回放时重复出现），也会被模型当成自己的上一轮承诺去续写。
    """
    text = _flat(memory)[:400]
    if not text:
        return ""
    return (chr(10) * 2 + "【关于这位同学（系统从以往提问里归纳的记忆，不是教材资料）】" + chr(10) + text
            + chr(10) + "用法：只拿它决定讲多深、从哪里讲起、要不要先补前置概念。"
              "它没有页码也不是资料，**禁止**当作出处引用，禁止写成「资料显示」「你上次问过」；"
              "画像里没写的事不要猜，需要就直接问。和当前问题冲突时以当前问题为准。")


# 对所有工具生效的一条规矩。2026-09-27 组长现场撞的那个答非所问就是这么来的：
# 资料块里没有这次要的东西，模型不但不说，还顺着聊天历史把上一题又讲了一遍，
# 标题挂着这次的工具名，看起来"答了"，其实答的是上一轮。规则层已经先截了一道
# （backend/agent.py wants_past_papers），这条管的是剩下那些"缺东西但没被截住"的情况。
_TAIL = (
    "\n\n还有两条通用的规矩：\n"
    "· 只回答【问题】这一句。上一轮聊过的那道题，只有这次明确问到才继续讲，"
    "不许顺着旧话题往下讲。\n"
    "· 【资料】里没有这次要的东西时（比如你要卷面上的原题，给的资料却只有教材概念），"
    "第一句就点名缺什么，再给一条走得通的路（换个说法、点章节名、换一门有资料的课），"
    "然后停下——不要为了显得答得完整去续讲上一题。\n"
)


def system_prompt(persona: dict, tool: str, memory: str = "") -> str:
    p = dict(persona)
    p.setdefault("显示名", persona.get("role", "学霸哥"))      # 立绘是学姐，模块名仍是任务书里的 role
    base = _fill(persona.get("system_prompt_template", "你是{role}。"), p)
    extra = {
        "explainProblem": (
            f"\n6) 解题辅导：**每一小节标题必须写成 `{_STEP_MARK} 第n步 · 干什么`**（前端靠这个标记渲染步骤卡，少了它就没有分步效果）；每步只写『要什么 / 怎么做 / 检查点』三件事；"
            "最后一步只给方法，明确把结果留给用户算。**整条 900 字以内，每步不超过 3 行。**"
        ),
        "makeStudyPlan": ("\n7) 复习规划：三块——范围与题型分值 / 章节顺序 / 可用资料，每块不超过 5 条，"
                          "**整条 600 字以内**；分值只照资料里写的说，没写的说『卷面未标』。\n"
                          "   问「哪章是重点」时：资料末尾若有【章节结构统计】，只照抄那张表里的数字和页码区间，"
                          "并且**必须把口径说给它听**——那是结构密度（概念/例题的字面次数），不是卷面分值；"
                          "这门课同时有真题题型—分值统计的，复习优先级按分值表排，密度表只回答「先翻哪章」。\n"
                          "   【章节结构统计】是程序现算的、**不是检索命中**：引它的数字**不许挂 [n] 角标**"
                          "（编出 [n/a] 那种假角标前端点不开），写「章节结构统计」即可；列章节时把表里的"
                          "页码区间一起写上，学生能直接翻到书。\n"
                          "   【章节结构统计】里写着这门课没有教材切片的，就直接说章级建议算不出来，"
                          "**禁止**编一个「第几章最重要」出来。"),
        "askTextbook": "\n8) 概念题：先一句给定义，再讲为什么这么设计；有分歧时分别标引不同教材。**整条 500 字以内**，不要复述资料原文。",
    }.get(tool, "")
    return base + extra + _TAIL + memory_block(memory)


def materials_block(hits, store) -> tuple[str, list[dict]]:
    """把检索结果转成带编号的资料块 + 给前端用的引用表。"""
    lines: list[str] = []
    refs: list[dict] = []
    for n, h in enumerate(hits, 1):
        c = store.doc(h.doc_idx)
        loc = " ".join(x for x in (c.get("chapter"), c.get("section")) if x)
        page = f"第{c['page']}页" if c.get("page") else c.get("source_type", "")
        bits = [c.get("course"), _short(c.get("book", "")), loc, page]
        if "参考答案" in (c.get("book") or ""):
            bits.append("答案区")        # 明说是答案，免得模型把它当讲解材料引给学生
        src = "｜".join(x for x in bits if x)
        lines.append(f"[{n}]〔{src}〕{material_text(c)}")
        refs.append({"n": n, "course": c.get("course"), "book": c.get("book"),
                     "chapter": c.get("chapter"), "section": c.get("section"), "page": c.get("page"),
                     "source_type": c.get("source_type"), "chunk_id": c["id"],
                     "quote": _flat(c.get("text", ""))[:400]})
    return "\n".join(lines), refs


def _short(book: str) -> str:
    return re.sub(r"[（(].*?[)）]", "", book).strip()[:24]


IMAGE_NOTE = "\n".join([
    "",
    "（上面这道题是**拍照识别**进来的，不是学生手打的：数字、小数点、上下标都可能认错。",
    "如果题目本身看着就不合理——条件矛盾、数值明显抄错、少了关键一步——先问一句再往下讲，"
    "别照着错的数据一路算到底。这句提醒本身不用说给学生听。）",
])


def user_prompt(question: str, materials: str, tool: str, from_image: bool = False) -> str:
    """问题放最后（前缀缓存那条）。`from_image` 只在尾巴上多注一句"这是拍照识别的"，
    资料块和 persona 一个字不动 —— 缓存照样命中。"""
    return (f"【资料】\n{materials or '（本次没有检索到资料）'}\n\n【问题】{question}"
            + (IMAGE_NOTE if from_image else "") + f"\n[[tool:{tool}]]")


def build_messages(persona: dict, question: str, hits, store, tool: str,
                   history: list[dict] | None = None, memory: str = "",
                   from_image: bool = False, extra: str = "") -> tuple[list[dict], list[dict]]:
    """extra 是给复习规划的【章节结构统计】这类**程序现算**的块：挂在【资料】末尾，
    但它不是检索命中 —— refs 一个不加，模型引用不到编号就不会伪造点得开的出处。"""
    materials, refs = materials_block(hits, store)
    if extra:
        materials = (materials + "\n\n" + extra) if materials else extra
    msgs = [{"role": "system", "content": system_prompt(persona, tool, memory)}]
    msgs += history or []
    msgs.append({"role": "user", "content": user_prompt(question, materials, tool, from_image)})
    return msgs, refs


_MEMORY_RULES = """
9) 【这一段没有任何资料可引】前面那句说清"我手上没有这门课教材"的开场白已经给过了，别重复。
   现在正常讲原理和方法，但全篇**禁止**出现「第N页」「课本第几页」「书上原文」「资料显示」这类
   指向具体出处的说法，也**禁止**用 [1] [2] 编号 —— 你一个 [n] 都没有，编号会被前端点开成空页。
   凭一般知识讲的内容，收尾补一句「不同教材的写法和记号可能不一样，以你们课本为准」；
   涉及本校事实（考什么、给分点、老师划的范围、几点在哪）一律不许猜，让人去问老师或同学。"""


def memory_messages(persona: dict, tool: str, question: str,
                    history: list[dict] | None = None, memory: str = "",
                    from_image: bool = False) -> list[dict]:
    """无资料降级的 messages。**刻意不放【资料】块** —— 把"不许引用"做成结构而不是话术：
    一个编号都没有，模型就编不出点得开的出处，前端也就不会有假的金色出处块。
    换行一律用 chr(10) 拼：这个文件是被脚本改出来的，写转义符迟早被吃一次。
    """
    br = chr(10)
    body = (f"【资料】" + br
            + "（无：这门课/这一段没有可引的资料，下面这段凭一般知识讲，要挂牌）"
            + br + br + f"【问题】{question}" + (IMAGE_NOTE if from_image else "")
            + br + f"[[tool:{tool}]]")
    msgs = [{"role": "system", "content": system_prompt(persona, tool, memory) + _MEMORY_RULES}]
    msgs += history or []
    msgs.append({"role": "user", "content": body})
    return msgs


def fallback(persona: dict, reason: str, course: str | None = None, hint: str = "") -> str:
    """拒答话术。hint 是"我手上到底有什么"——只说"没有"是把活儿推回给用户。"""
    talk = persona.get("兜底话术", {})
    if reason == "no_course" and course:
        return (talk.get("没这门课", "这门课我还没喂课本。").replace("{course}", course)
                .replace("{hint}", hint))
    return talk.get("低置信", "这个我没在资料里找到，换个说法再问一次试试。")
