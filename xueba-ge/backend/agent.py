r"""「智能体」这一层 —— 拆开就是三件事，没有任何魔法。

1. **选工具**：有 Key 就用模型的 function-calling；没 Key 就用一张关键词表（0 ms）。
   两条路同一个出口：`return (tool, args)`。
2. **执行检索**：这是**我们自己的代码**在算，模型不参与找资料。
3. **回填生成**：top-k 片段 + 问题 → 流式生成，出处编号在资料行里就写好了。

三个容易做错的判断，都在这里：

· **不做前置强制分课**。课程靠"用户显式选 + 检索分布"软定，
  一旦前置分类错了，整条链就永久召不回来，还会废掉跨教材对比。
· **但课程名要做守卫**：问题里出现了课程清单里有、**库里却没有**的课（比如高数），
  必须直接走兜底话术。这种时候分数照样很高（往年卷里抄着题目原话），
  只有查清单才能发现"我们根本没有这本书"。
· **低置信必须短路**。宁可少答，不能让模型拿着无关片段编。
"""

from __future__ import annotations

import difflib
import re
from dataclasses import dataclass, field

from . import chapterstat, prompts
from .settings import load_config

_PLAN = re.compile(r"怎么学|如何学|复习|考什么|考试范围|分值|题型|提纲|往年|资料|先修|前置|依赖|规划|安排")
_PROBLEM = re.compile(r"求|计算|算一下|算出|画|写出|判断|证明|求解|下面.{0,6}程序|输出是什么|错在哪|bug|"
                      r"周转时间|缺页|子网|ER ?图|时延|校验|特征值|极限|积分|秩")
# 「给我同类原题」这类问法不是在讲题，是要**题目本身**。三个工具都接不住它：实测模型会挑
# makeStudyPlan（它的 when 里就写着「有没有高数往年卷」），然后这门课库里一张卷都没有
# -> 引用 0 条 -> 模型顺着聊天历史把上一题又讲了一遍（2026-09-27 组长现场撞的那个答非所问）。
# 界面上那两个舞台选项（「出两道类似的题考我」「出道同类题我练练」）发回来的是同一句话，同一个洞。
_WANTS_PAPERS = re.compile(
    r"原题|往年卷|往年题|真题|类似的题|同类题|同类型.{0,3}题|同样的题|一样的题|"
    r"再来一?道|再给一?道|再出|出道|出两?道|找.{0,6}(题|卷)|来一?道")
# 说"练习题/模拟题"的是要**我自己出**，不是要**卷上的**：那种交给降级链凭记忆出就行。
# 不挡掉会绕死：没卷 -> 回一句没卷 -> 用户点「出两道练习题」-> 又被这条截住 -> 又回没卷。
_NOT_PAST_PAPER = re.compile(r"练习题|模拟题|自己出|随便出|出卷|出题考")
# 「有没有高数往年卷」问的是**存量**（这门课你到底有没有卷），那是 makeStudyPlan 的活儿：
# 它手上有题型结构和分值分布，比两张卡片信息量大。只有"给我题目本身"才归这条规则。
_INVENTORY_ASK = re.compile(r"(有没有|有哪些|有什么|有无).{0,8}(卷|试卷|真题)")


def wants_past_papers(question: str) -> bool:
    """是不是在要"往年真题本身"。判据故意写窄：宁可漏判走老路，也不许把真问题抢过来。"""
    q = (question or "").strip()
    if not q or len(q) > 26:                    # 超过这个长度多半是在描述一道题
        return False
    if _PROBLEM.search(q) or _NOT_PAST_PAPER.search(q):
        return False
    if _INVENTORY_ASK.search(q):
        return False
    return bool(_WANTS_PAPERS.search(q))


def _last_problem_text(history: list[dict]) -> str:
    """最近一条**像题面**的用户消息 —— 要题那句自己不是题面，不能拿它当查询。"""
    for m in reversed(history or []):
        if m.get("role") != "user":
            continue
        c = (m.get("content") or "").strip()
        if len(c) >= 12 and not wants_past_papers(c):
            return c[:600]
    return ""


# 校园判据要**两个信号同时命中**：话题词（多大/在哪/怎么走）+ 地点词（湖/楼/食堂…）。
# 只有一个信号会双向误伤，两边都是实测出来的：
#   · 「B+ 树比 B 树好在哪里」被"在哪"短路成校园检索 → 两路全无命中 → 连降级都被挡住；
#   · 「用定积分求面积」被"面积"短路 → 拿建筑物数据去答数学题。
_CAMPUS_TOPIC = re.compile(r"多大|多远|几号楼|哪个门|怎么走|在哪|开馆|闭馆|开门|几点|面积|占地")
_CAMPUS_PLACE = re.compile(r"图书馆|食堂|宿舍|教学楼|实验楼|体育馆|球?场|湖|楼|校门|大门|[东南西北]门|"
                           r"校园|校区|自习|浴室|澡堂|快递|医务|机房|车站|广场|公园|亭|林|山|河|湖心")


def is_campus(question: str) -> bool:
    """是不是在问**地点**。"""
    return bool(_CAMPUS_TOPIC.search(question)) and bool(_CAMPUS_PLACE.search(question))
_TOOL_NAMES = {"askTextbook", "explainProblem", "makeStudyPlan"}
_CIT_MARK = re.compile(r"\[\d+\]")


def _no_marks(chunks):
    """降级回答里不许留下 [n] 角标：refs 是空的，点了什么也不会发生（实测模型照写 [1]）。
    流式逐片过滤要处理**标记被切碎**的情况，所以结尾像半个标记的先扣住等下一片。
    """
    hold = ""
    for piece in chunks:
        hold += piece
        m = re.search(r"\[\d{0,3}$", hold)
        cut = m.start() if m else len(hold)
        if cut:
            yield _CIT_MARK.sub("", hold[:cut])
            hold = hold[cut:]
    if hold:
        yield _CIT_MARK.sub("", hold)


@dataclass
class Turn:
    tool: str
    question: str
    args: dict = field(default_factory=dict)
    routed_by: str = "keyword"


class Agent:
    def __init__(self, engine, llm, persona: dict | None = None, tools_cfg: dict | None = None,
                 acfg: dict | None = None):
        self.engine = engine
        self.llm = llm
        self.persona = persona if persona is not None else load_config("persona", {})
        self.tools_cfg = tools_cfg if tools_cfg is not None else load_config("tools", {})
        self.acfg = acfg if acfg is not None else load_config("agent", {})
        self._hint_key: int | None = None
        self._hint_val = ""

    # ---------- 1. 选工具 ----------
    def classify(self, question: str) -> Turn:
        if _PLAN.search(question):
            return Turn("makeStudyPlan", question, routed_by="keyword")
        if is_campus(question):
            return Turn("askTextbook", question, {"course": "校园信息"}, routed_by="keyword")
        if _PROBLEM.search(question):
            return Turn("explainProblem", question, routed_by="keyword")
        return Turn("askTextbook", question, routed_by="keyword")

    def pick_tool(self, question: str, history: list[dict]) -> Turn:
        specs = self._openai_tools()
        if specs:
            context = " ".join(m["content"] for m in history[-2:])[:300]
            got = self.llm.route(question, specs, context)
            if got and got[0] in _TOOL_NAMES:
                args = {k: v for k, v in (got[1] or {}).items() if v not in (None, "")}
                return Turn(got[0], question, args, routed_by="llm")
        return self.classify(question)

    def _course_examples(self) -> str:
        """给模型的"这是哪门课"举例清单：**取自真实语料，不在代码里手抄**。

        2026-09-21 大物入库当天实测到手抄的代价：清单里没有「大学物理」，模型就把
        「熵增加原理怎么说」「卡诺循环效率怎么来的」「库仑定律的适用条件」三问全报成
        高等数学，检索于是真给出 5 条微积分的页给物理题当资料 —— 比拒答坏得多。
        按切片数缓存：重建索引会换 chunk 数，平时一次/轮都省掉。
        """
        n = len(self.engine.store.chunks)
        if self._hint_key != n:
            self._hint_key = n
            self._hint_val = " / ".join(self._courses()[0])
        return self._hint_val

    def _openai_tools(self) -> list[dict]:
        out = []
        for t in self.tools_cfg.get("tools", []):
            props, req = {}, []
            for pname, spec in (t.get("params") or {}).items():
                props[pname] = {k: v for k, v in spec.items() if k != "desc" and k != "required"}
                if spec.get("desc"):
                    props[pname]["description"] = spec["desc"]
                if pname == "course":
                    # 对外契约（config/tools.json）里它只是"用户显式选的课程"；路由时要得更狠一点：
                    # 计网/OS/数据结构四门示例语料已下架（README §10 第 1 条），库里根本没有它们，
                    # 但字面闸门拦不住两字专名（死锁/进程 df==0 也逃得过 >=3 字那条），
                    # 只能靠模型先认出这是哪门课，再判"这门课我没教材"走降级，
                    # 否则检索会把微积分的页拽过来当这道题的资料。
                    # 缩写不在此列：模型把学生嘴里的「软测」扩写成「软件测试技术」，实测同一道
                    # 「期末会怎么考」一次引到真卷、一次回「没这门课」——缩写一律留空，交给软路由认。
                    props[pname]["description"] = (
                        "这个问题属于大学里的哪门课，写课程名（" + self._course_examples() + " 之类）；说不准就留空。"
                        "学生只说缩写或简称（软测 / 高数 / 数分 / 毛概）时照他的原话，不要替他补全成另一门课的课名")
                if spec.get("required"):
                    req.append(pname)
            # 路由时顺带要一份「规范说法」。这是**内部参数**，故意不写进 config/tools.json：
            # 那份文件是四个角色合体时的对外契约，别的组的引擎不该为此多出一个键。
            props["terms"] = {"type": "array", "items": {"type": "string"},
                              "description": "把学生口语/缩写/错别字翻成教材里的规范说法，最多 4 个；"
                                             "拿不准就给空数组"}
            out.append({"type": "function", "function": {
                "name": t["name"], "description": t.get("desc", ""),
                "parameters": {"type": "object", "properties": props, "required": req}}})
        return out

    # ---------- 2+3. 一次完整的问答 ----------
    def run(self, question: str, history: list[dict] | None = None, course: str | None = None,
            memory: str = "", from_image: bool = False):
        """产出一串事件（dict），由 app.py 转成 SSE：
        meta → citation* → token* → done    /    meta → token(兜底) → done

        memory 是**跨会话画像**（backend/memory.py），history 是**本会话最近几轮**，两者不是一回事：
        前者跟着人走、后者跟着会话走。它只能当语气和深浅的参考，不能当出处 —— 所以它是参数，
        不是 self 上的字段：Agent 实例是所有请求共享的，挂 self 上就是 A 同学的记忆答 B 同学的题。

        from_image：这道题是**拍照识别**出来的（backend/vision.py）。检索照旧用识别出的文字，
        只在问题尾巴上注一句"可能有识别错字"（prompts.IMAGE_NOTE）—— 图不喂给答题那次调用，
        也不进多轮上下文（库里那张缩略图只是给气泡显示用的，`context_messages` 不选那一列）：
        出处靠文字检索产生，这是这条链的根。
        """
        history = history or []
        # 走规则还是走模型：要题这句交给规则，不进三选一（也就不引入新的路由错误面）
        ask_papers = bool((self.acfg or {}).get("找同类题", True)) and wants_past_papers(question)
        turn = (Turn("findPastPapers", question, {}, routed_by="rule") if ask_papers
                else self.pick_tool(question, history))
        prev_problem = _last_problem_text(history) if ask_papers else ""
        if course:                                     # 用户显式选的课，优先级最高
            turn.args["course"] = course

        known, present = self._courses()
        # 位置类问句（"图书馆在哪"）里没有任何课程名，模型也不会知道我们手里有一张校园平面图：
        # 这个信号只能自己认。真 LLM 一上线，pick_tool 就不再看 classify() 的关键词分支，
        # 校园兜底那条链是这么被绕过去的（冒烟"校园兜底能答"实测挂在这里）。
        asked = (_hit_course(question, known)
                 or ("校园信息" if is_campus(question) else None)
                 or turn.args.get("course"))
        # given = 课程名是**用户或模型说出来的**，不是检索分布猜出来的。
        # 它决定低置信时能不能跨课程放宽，见下面那段。
        given = asked is not None
        guard = None
        if asked:
            canon = _canon_course(asked, present)
            if canon:                              # 「微积分」-> 高等数学，后面按归一后的名字过滤
                asked = canon
            else:
                guard = ("no_course", str(asked).strip())
        else:                              # 没人说课程名时，才按检索分布猜一门课
            given = False
            soft = self._soft_route(question)          # 检索分布软路由
            asked = soft
        if ask_papers and prev_problem and not given:
            # 要题那句里通常没有课名，就用上一题的题干去认（用户自己选了课则优先级最高）。
            # 必须赶在 meta 之前定下来：界面上那行课名是 meta 里的 course，
            # 晚一步改，回答说的是《线性代数》没卷，标签却是空的。
            alt = _hit_course(prev_problem, known) or self._soft_route(prev_problem)
            if alt:
                asked = alt
        src_type = {"askTextbook": "textbook", "explainProblem": "textbook",
                    "makeStudyPlan": "all", "findPastPapers": "past_paper"}[turn.tool]
        if asked == "校园信息":
            src_type = "campus_info"                  # 课程本身就决定资料类型，别拿 textbook 去筛它

        yield {"type": "meta", "tool": turn.tool, "routed_by": turn.routed_by, "course": asked,
               "source_type": src_type}

        if guard:
            if self._can_degrade(question, turn, asked):
                yield {"type": "retrieval", "paths": [], "coverage": 0.0, "elapsed_ms": 0,
                       "low_confidence": True, "no_source": True,
                       "reasons": [f"{guard[1]}：库里没有这门课的任何切片，下面的回答没有出处"],
                       "n_candidates": 0, "terms": [], "dropped_terms": []}
                yield from self._answer_without_material(question, turn, history,
                                                         self._no_source_say(guard[1]), guard[0], memory,
                                                         from_image)
                return
            text = prompts.fallback(self.persona, guard[0], guard[1], hint=self._course_hint(guard[1], known))
            yield {"type": "token", "text": text}
            yield {"type": "done", "tool": turn.tool, "refs": [], "fallback": guard[0],
                   "retrieval_ms": 0, "low_confidence": True}
            return

        if ask_papers:
            yield from self._past_papers(question, asked, prev_problem)
            return

        def go(course, stype):
            return self.engine.search(question, course=course, source_type=stype,
                                      cross_book=bool(turn.args.get("cross_book")),
                                      use_prior=(turn.tool != "makeStudyPlan"),
                                      top_k=self.engine.top_k, per_book=self.engine.per_book,
                                      extra_terms=turn.args.get("terms") or [])

        rep = go(asked, src_type)
        # **资料类型是软约束**：收空或没把握就放宽重查（提纲/往年卷常常才写着题目本身）。
        # **课程是硬约束**（2026-09-20 改的）：用户或模型点名了课程，就不许跨到别的课去捞。
        # 原来这里是无条件放宽到"全部课程"的，四门示例语料下架之后它的后果实测出来了：
        # 问"数据库四种隔离级别"→ 数据库没教材 → 放宽 → 引《微积分上册》第 N 页当出处。
        # "我明明选了这门课它却说没找到"要治，但拿别的课的资料硬答比说没找到更坏。
        if rep.low_confidence and asked and not given:
            alt = go(None, src_type)
            if not alt.low_confidence:
                alt.reasons = alt.reasons + [f"《{asked}》里没有，已放宽到全部课程"]
                rep = alt
        if rep.low_confidence and src_type != "all":
            alt2 = go(asked if rep.filters.get("course") else None, "all")
            if not alt2.low_confidence:
                alt2.reasons = alt2.reasons + [f"资料类型已从 {src_type} 放宽到全部"]
                rep = alt2
        if rep.terms:
            rep.reasons.append("顺带按教材里的规范说法「" + "」「".join(rep.terms) + "」一起检索")
        if rep.dropped_terms:
            # 模型补的词在这批资料里一次都没出现过 —— 如实说出来，比悄悄丢掉可信
            rep.reasons.append("模型提的「" + "」「".join(rep.dropped_terms) + "」本库里没有这种说法，已忽略")
        yield {"type": "retrieval", "paths": rep.paths, "coverage": round(rep.coverage, 3),
               "elapsed_ms": rep.elapsed_ms, "low_confidence": rep.low_confidence,
               "reasons": rep.reasons, "n_candidates": len(rep.hits),
               "terms": rep.terms, "dropped_terms": rep.dropped_terms}

        if (rep.low_confidence or not rep.hits) and self._can_degrade(question, turn, asked):
            yield from self._answer_without_material(question, turn, history,
                                                     self._no_source_say(asked), "low_confidence", memory,
                                                     from_image)
            return

        if rep.low_confidence or not rep.hits:
            peek = self._peek(rep)
            text = prompts.fallback(self.persona, "low") + (("\n\n" + peek) if peek else "")
            yield {"type": "token", "text": text}
            yield {"type": "done", "tool": turn.tool, "refs": [], "fallback": "low_confidence",
                   "retrieval_ms": rep.elapsed_ms, "low_confidence": True}
            return

        # 「哪章是重点」的数字由代码现算（backend/chapterstat.py），只走复习规划这一条链。
        # 课程没定下来时不算：全库两张表（高数上下册是两本书）拼一起会把模型绕晕，
        # 而这时候它本来就该先问是哪门课。
        extra = ""
        if turn.tool == "makeStudyPlan" and asked != "校园信息":
            stats_course = asked or (
                self.engine.store.doc(rep.hits[0].doc_idx).get("course") if rep.hits else None)
            if stats_course != "校园信息":
                extra = chapterstat.plan_block(self.engine.store.chunks, stats_course)

        msgs, refs = prompts.build_messages(self.persona, question, rep.hits, self.engine.store,
                                            turn.tool, history, memory, from_image, extra=extra)
        for ref in refs:
            yield {"type": "citation", "ref": ref}
        try:
            for piece in self.llm.stream(msgs):
                yield {"type": "token", "text": piece}
        except Exception as exc:                        # noqa: BLE001 - 模型挂了要说话，不能空转圈
            yield {"type": "token", "text": f"\n\n（生成这一步出错了：{exc}。上面 [n] 编号对应的原文还是可以点开的。）"}
            yield {"type": "error", "message": str(exc)[:300]}
        rel = self.related(question, asked, {r["chunk_id"] for r in refs})
        if rel:
            yield {"type": "related", "items": rel}
        yield {"type": "done", "tool": turn.tool, "refs": refs, "retrieval_ms": rep.elapsed_ms,
               "low_confidence": False}

    # ---------- 无资料时：拒答还是承认后用记忆讲（config/agent.json 一行切换） ----------
    def _can_degrade(self, question: str, turn, asked: str | None) -> bool:
        """降级放行判据。三条都不满足才降：开关开着、不是校内事实类、不是复习规划/校园。

        校园这条看的是**用户原话和模型给的课名**，不是 `asked` —— `asked` 可能是软路由
        猜出来的，实测「B+ 树比 B 树好在哪」会被猜成校园信息，那样这门课的降级就被挡死了。
        """
        if (self.acfg or {}).get("无资料时", "拒答") != "降级":
            return False
        campus = is_campus(question) or turn.args.get("course") == "校园信息"
        if turn.tool == "makeStudyPlan" or campus:
            # 复习规划要的是你们这门课的卷面和提纲，校园信息归小北 —— 模型记忆在这两处一文不值
            return False
        return not any(kw in question for kw in self.acfg.get("降级不许碰的问题", []))

    def _no_source_say(self, course: str | None) -> str:
        """第一句承认。写具体（手上到底有什么）是人机味和可信度的分水岭，也是组长那条
        「不许只回一句课本里没有」的正面回答。"""
        inv = self._inventory().get(course or "", "")
        name = course or "这门课"
        if "教材" in inv:
            return (f"{name}我有{inv}，但你问的这一段我没翻到。下面这段是我凭一般知识讲的，"
                    f"没有出处，别当成书上的原话。")
        return (f"{name}我这库里没有教材" + (f"，只有{inv}" if inv else "") +
                "。下面这段是我凭一般知识讲的，没有出处，也没翻过你们的课本。")

    def _answer_without_material(self, question: str, turn, history: list[dict],
                                 say: str, reason: str, memory: str = "", from_image: bool = False):
        """承认 → 用模型记忆讲 → done 里 refs 为空 + no_source。
        挂牌靠 refs 为空这条**结构**，不靠模型自觉声明。"""
        yield {"type": "token", "text": say + "\n\n"}
        try:
            for piece in _no_marks(self.llm.stream(prompts.memory_messages(
                    self.persona, turn.tool, question, history, memory, from_image))):
                yield {"type": "token", "text": piece}
        except Exception as exc:                        # noqa: BLE001 - 没资料还挂了，就真没话了
            yield {"type": "token", "text": f"\n\n（这一段没答完：{exc}）"}
            yield {"type": "error", "message": str(exc)[:300]}
        yield {"type": "done", "tool": turn.tool, "refs": [], "no_source": True,
               "fallback": reason, "retrieval_ms": 0, "low_confidence": True}

    # ---------- 拒答时说清"我手上有什么"（人机味的主要来源就是只回一句"没有"） ----------
    def _inventory(self) -> dict[str, str]:
        """我库里到底有哪些课、每门课手上是什么资料 —— 从语料对账单里现算，不写死。"""
        cfg = load_config("corpus", {})
        kind_of = {"textbook": "教材", "past_paper": "往年卷", "outline": "题型结构",
                   "campus_info": "校园数据"}
        by: dict[str, dict[str, int]] = {}
        for row in cfg.get("语料", []):
            course, st = row.get("course"), row.get("source_type")
            if not course or not row.get("检索") or st not in kind_of:
                continue
            bucket = by.setdefault(course, {})
            kind = kind_of[st]
            bucket[kind] = bucket.get(kind, 0) + 1
        out: dict[str, str] = {}
        for course in sorted(by):
            out[course] = "、".join(f"{kind} {cnt} {_UNIT.get(kind, "份")}"
                                    for kind, cnt in sorted(by[course].items()))
        return out

    def _course_hint(self, name: str, known: list[str]) -> str:
        """用户嘴上的课名对不上时，给一句"你是不是想说 X" + 那门课手上有什么。

        刻意**不自动改判**：`软件测试` 和 `软件设计与分析` 是两回事，替用户决定等于瞎答。
        但只回一句"没这门课"是把活儿推回给用户 —— 至少让他知道该往哪儿问。
        篇幅也压着：早先版本把每门课的资料份数全列出来，一句话 200 字，像报错日志不像学长。
        """
        inv = self._inventory()
        near = _suggest_course(name, list(inv))
        if near:
            return f"你说的会不会是《{near}》？那门我手上有{inv[near]}，问「期末怎么考」这类题我直接能答。"
        return "我库里有的课：" + "、".join(inv) + "。"
    def _peek(self, rep) -> str:
        """低置信时把"翻到的最像的几页"摊出来，让用户判断是我们俩谁理解错了。"""
        bits = []
        for h in rep.hits[:3]:
            c = self.engine.store.doc(h.doc_idx)
            loc = " ".join(x for x in ((c.get("chapter") or "")[:12], (c.get("section") or "")[:12]) if x)
            page = f"第{c['page']}页" if c.get("page") else ""
            bits.append("《" + (c.get("book") or "")[:18] + "》" + page +
                        (("(" + loc + ")") if loc else ""))
        if not bits:
            return ""
        return "我翻到最像的是这几页：" + "、".join(bits) + " —— 都不是你要的那段。"
    # ---------- 同类往年真题（§2.3） ----------
    def related(self, question: str, course: str | None, cited: set[str]) -> list[dict]:
        """答完题之后附的那条"同类往年题"。

        三个刻意的限制，都是被实物逼出来的：
        · **不叫"相似题"**：判据是"同一门课 + 同类问法"的检索排序。说"相似"是在承诺
          一个第二条腿还是 hash 时无法验证的东西，卡片标题因此就叫"同类往年题"。
        · **答案卷不进卡片**：`参考答案与评分标准` 那 4 份的用处就是给答案，
          放进"给你练一道"里等于把答案甩在脸上（要答案区自己去点正文的引用）。
        · **只给 2 条**：卡片是顺手看一眼，不是第二个答案区，多了会盖住正文。
        """
        # cited 传进检索（exclude=），不是在结果里事后删：正文已经引过的那几片
        # 不该再来占卡片的坑，否则"正文引到卷子"和"卡片有题可挂"会变成互斥。
        rep = self.engine.search(question, course=course, source_type="past_paper",
                                 top_k=6, per_book=3, exclude=cited)
        if rep.low_confidence:
            return []
        return self._paper_items(rep, cited)

    def _paper_items(self, rep, cited: set[str]) -> list[dict]:
        """把一次检索的结果洗成卡片：正文引过的、答案卷的都不要，最多 2 条。

        单独拆出来只为 `_past_papers` 能复用同一条筛选口径 —— 两处各写一遍的话，
        "答案卷不许当练习题甩给学生"这种规矩迟早有一处会漏。
        """
        out = []
        for h in rep.hits:
            c = self.engine.store.doc(h.doc_idx)
            if c["id"] in cited or "参考答案" in (c.get("book") or ""):
                continue
            out.append({"n": len(out) + 1, "course": c.get("course"), "book": c.get("book"),
                        "chapter": c.get("chapter"), "section": c.get("section"),
                        "page": c.get("page"), "source_type": c.get("source_type"),
                        "chunk_id": c["id"], "quote": prompts._flat(c.get("text", ""))[:200]})
            if len(out) >= 2:
                break
        return out

    # ---------- 「有没有类似的题/原题」被规则截过来之后走这条 ----------
    def _past_papers(self, question: str, course: str | None, prev_problem: str):
        """要题那句的执行：只查一次往年卷，有题出卡片，没题老实说缺什么。

        三个刻意的选择，都是省过/被咬过的：
        · **不调 related()**：那个方法自己还要再检索一次，两条都跑等于同一个问题
          花两次 embedding 的钱、多等一倍时间。这里直接吃同一个 rep。
        · **不走模型生成**：这条链要回答的只有"有没有、在哪一页"。让模型拿着空资料块
          开口，它一定去续上一轮的话题 —— 2026-09-27 那个答非所问就是这么来的。
        · **不挂 no_source**：那张灰牌写的是「无出处 · AI 记忆」，而这里我一个字都没
          凭记忆编，说的是库里到底有什么。降级牌（fallback）才是对的。
        """
        probe = prev_problem or question
        rep = self.engine.search(probe, course=course, source_type="past_paper",
                                 top_k=6, per_book=3)
        yield {"type": "retrieval", "paths": rep.paths, "coverage": round(rep.coverage, 3),
               "elapsed_ms": rep.elapsed_ms, "low_confidence": rep.low_confidence,
               "reasons": rep.reasons, "n_candidates": len(rep.hits),
               "terms": rep.terms, "dropped_terms": rep.dropped_terms}
        items = [] if rep.low_confidence else self._paper_items(rep, set())
        if items:
            yield {"type": "token", "text": self._papers_say(items, course, prev_problem)}
            yield {"type": "related", "items": items}
            yield {"type": "done", "tool": "findPastPapers", "refs": [],
                   "retrieval_ms": rep.elapsed_ms, "low_confidence": False}
            return
        say, reason = self._no_paper_say(course, rep, prev_problem)
        yield {"type": "token", "text": say}
        yield {"type": "done", "tool": "findPastPapers", "refs": [], "fallback": reason,
               "retrieval_ms": rep.elapsed_ms, "low_confidence": True}

    def _papers_say(self, items: list[dict], course: str | None, prev_problem: str) -> str:
        """出卡片时那句正文。三处措辞必须跟着"到底认出了什么"变，不然就是在吹。

        · 没认出课程（course 为空）时卡片可能来自**任意一门课**，所以把课程名一起写出来，
          而且不许说"和刚才那题同一类" —— 跨课的题谈不上同类。
        · 没有上一题的题干（会话第一句就要题）时同样不许声称同类，只说"从卷子里翻到"。
        · 题干摘要写进正文不是为了好看：这条链不喂模型，正文是唯一会存进 message 表的东西。
          只写"两道同类题"的话，下一轮学生说"第一道不会"，模型手上没有"第一道"是什么；
          刷新页面之后卡片也不重放（历史里没有这一列，§10 第 14 条）。
        """
        named = "、".join(("" if course else ((it.get("course") or "") + "的"))
                         + "《" + (it.get("book") or "")[:18] + "》"
                         + (("第" + str(it["page"]) + "页") if it.get("page") else "")
                         for it in items)
        lead = ("和刚才那题同一类" if (course and prev_problem)
                else ("先按你这句从卷子里翻到" if not prev_problem else "这门课里翻到"))
        body = "\n".join(f"第 {it['n']} 道：{it['quote'][:60]}…" for it in items)
        return (f"你们卷子上的题我翻到 {len(items)} 道，{lead}：{named}"
                + "\n\n" + body
                + "\n\n点卡片直接跳到原卷那一页。答案卷没掺进来，先自己做，要对答案说一声。")

    def _no_paper_say(self, course: str | None, rep, prev_problem: str = "") -> tuple[str, str]:
        """没翻到题时说什么：点名缺什么 + 给一条走得通的路。只回"没有"是推活儿。"""
        inv = self._inventory()
        have = inv.get(course or "", "")
        with_papers = "、".join(c for c, v in sorted(inv.items()) if "往年卷" in v)
        if course == "校园信息":
            return ("要题得说一门课 —— 校园那部分是给小北答地点和时间的，里面没有卷子。"), "这不是门课"
        if not course:
            # 分两种：拿题干对过却认不出课（说了"翻过"才不空头），和压根没有题干可比。
            if prev_problem:
                return ("上一题的题干我拿去卷子里对过了，但没认出它是哪门课的题。"
                        "从别的课的卷子里抓两道给你谈不上「同类」，所以先不给卡片。"
                        + ((f"手上有往年卷的是这几门：{with_papers}。") if with_papers else "")
                        + "说一句课程名（比如「数据库」），我就只翻那门课的卷子。"), "没认出是哪门课"
            return ("这句里没听出是哪门课的题，上一轮也没接上题干，我没有可比的东西。"
                    + ((f"手上有往年卷的是这几门：{with_papers}。") if with_papers else "")
                    + "把课程名说出来（比如「数据库」），或者说「刚才那道概率的题」这种带课的指法。"
                    ), "没说是哪门课"
        if "往年卷" in have:
            peek = self._peek(rep)
            return (f"{course}的卷子我翻了一遍（{have}），但你这个说法没排到同类型的题上。"
                    + (peek or "") + "说个具体章节或知识点（比如「B+ 树」「第三范式」），"
                    "或者直接点名是哪一年的卷，我再翻一次。"), "卷里没搜到"
        return (f"{course}这门课我库里一张往年卷都没有"
                + ((f"，只有{have}") if have else "，题目本身给不了你") + "。"
                + "两条路：一是我凭一般知识给你出两道同类型的练习题（那种回答会挂上「无出处 · AI 记忆」"
                "的牌子，别当成你们老师出的题）；"
                + ((f"二是换成有卷子的课问：{with_papers}。") if with_papers else "")
                ), "这门课没有往年卷"

    # ---------- 课程：清单 vs 库里真有的 ----------
    def _courses(self) -> tuple[list[str], dict[str, str]]:
        """known = 用户可能挂在嘴上的课程名；present = 各种叫法 -> 库里真有的课程名。

        present 是个映射不是集合，因为**书名和课程名经常不是一回事**：
        用户说「微积分」，库里的课程叫「高等数学」、书名叫《微积分(上册·第2版)》。
        只比课程清单就会把唯一一本真教材误判成"没这门课"，复习规划整条链直接堵死
        （接上 LLM 第一次端到端就撞上了：模型在 makeStudyPlan 里回的是 course=微积分）。
        """
        cfg = load_config("corpus", {})
        known = []
        rows = list(cfg.get("语料", []))
        # 已停用的四门（示例语料下架）**必须继续留在课程清单里**：用户说"操作系统"时
        # 要能认出这是门课，才能走"这门课我没教材"的降级/拒答。
        # 认不出来的后果实测过：问"操作系统这门课考试考什么"会被软路由猜成算法课，
        # 然后引 5 条微积分/算法的资料一本正经地作答 —— 比拒答坏得多。
        # 只进 known（名字清单），不进 present（有资料的课），因为 present 取自真实切片。
        for row in ((cfg.get("已停用") or {}).get("语料") or []):
            rows.append(row)
        for row in rows:
            if row.get("course") and row["course"] not in known:
                known.append(row["course"])
        store_courses = set(self.engine.store.courses())
        for c in self.engine.store.courses():
            if c not in known:
                known.append(c)
        present: dict[str, str] = {c: c for c in store_courses}
        for alias, canon in _ALIAS.items():
            if canon in store_courses:
                present.setdefault(alias, canon)
        seen = set()
        for c in self.engine.store.chunks:                 # 书名别名取自真实切片，不靠 config 手抄
            course, book = c.get("course") or "", (c.get("book") or "").strip()
            if not course or (course, book) in seen:
                continue
            seen.add((course, book))
            for b in (book, re.sub(r"[（(].*?[)）]", "", book).strip()):
                if len(b) >= 2:
                    present.setdefault(b, course)
        return known, present

    def _soft_route(self, question: str) -> str | None:
        """不分类，只看**检索分布**：全库捞一次，按**名次加权**投票选出最集中的那门课。

        零额外模型调用，且天然可解释（答辩时能说"是资料自己聚出来的，不是猜的"）。

        为什么是权重不是条数：这是微积分上册入库当天撞出来的。一本 4,089 片的教材，
        蹭上几条边角命中就能在"条数"上赢掉只有 19 片的正确答案 ——
        实测"死锁的四个必要条件是什么"：操作系统 3 片（含第 1、2 名）vs 高等数学 5 片（第 3、4、6、7、8 名），
        按条数会路由到高等数学，然后把操作系统的资料整个过滤掉，答案直接没了。
        名次加权（第 1 名 8 分、往下递减）+ 要求绝对优势 ≥55%，不够集中就干脆不收窄，保持全库。
        """
        rep = self.engine.search(question, source_type="all", top_k=8, per_book=0)
        if rep.low_confidence or not rep.hits:
            return None
        n = len(rep.hits)
        weight: dict[str, float] = {}
        count: dict[str, int] = {}
        for rank, h in enumerate(rep.hits, 1):
            c = self.engine.store.doc(h.doc_idx).get("course") or ""
            weight[c] = weight.get(c, 0.0) + (n - rank + 1)
            count[c] = count.get(c, 0) + 1
        best, score = max(weight.items(), key=lambda kv: kv[1])
        total = sum(weight.values()) or 1.0
        if count[best] < 2 or score / total < 0.55:     # 太散 / 赢得不够多 = 不像在问某门课
            return None
        return best


def _hit_course(question: str, known: list[str]) -> str | None:
    for c in sorted(known, key=len, reverse=True):
        if c and c in question:
            return c
    for alias, canon in _ALIAS.items():
        if alias in question:
            return canon
    return None


_UNIT = {"教材": "本"}


def _canon_course(name: str, present: dict) -> str | None:
    """课程名归一：别名表命中 > 近似同名命中。

    模型回的名字经常不是库里的课程名（`数据结构与算法` / `微积分`），近似同名可以直接归一；
    但差得远的（`软件测试`）**不归一** —— 那是另一门课，替用户决定等于瞎答。
    """
    key = str(name).strip()
    canon = present.get(key)
    if canon:
        return canon
    near = difflib.get_close_matches(key, list(present), n=1, cutoff=0.72)
    if near:
        return present[near[0]]
    # **书名前缀**这一路是拍照提问当天撞出来的（2026-09-22）：模型报的是书脊上那个名字
    # 「概率论与数理统计」，而 `present` 里的书名别名取自真实切片，是全名
    # 「概率论与数理统计(第3版) 赵平 科学出版社 2024」。difflib 的整串相似度被版本号和出版社
    # 拖到 0.46（实测 `SequenceMatcher.ratio`），够不上 0.72，于是库里唯一那本真教材被判成"没这门课"、整条链走降级。
    # 收 >=5 字的前缀才认：再短就是撞名（「数学」两个字能前缀命中三门课）。
    # 命中多门课时**不归一**，和上面「差得远的别替用户决定」是同一条纪律。
    if len(key) >= 5:
        hits = {c for k, c in present.items()
                if min(len(k), len(key)) >= 5 and (k.startswith(key) or key.startswith(k))}
        if len(hits) == 1:
            return next(iter(hits))
    return None


def _suggest_course(name: str, known: list[str]) -> str | None:
    """按**字符重合度 + 共有前缀**找最接近的课名（中文缩写没有词边界，difflib 那种整串相似度不认）。

    「软测」-> 软件设计与分析（重合 软/测 两个字，够说一句「你是不是问这个」）；
    「软件测试」-> 也是它，但**只建议不改判**：真有两门课时替用户决定就是瞎答。

    为什么光有重合度不够：「软件测试技术」六个字里只跟「软件设计与分析」重合 软/件 两个，
    2/6 = 0.33 够不上门槛，实测兜底话术就退化成干列一遍课程清单（截图里最难看的那条）。
    中文课名最有效的线索是**开头同字**（软件 / 数据 / 概率 / 马克思），所以共有前缀 >=2 字加分。
    """
    key = str(name).strip()
    s = {c for c in key if not c.isspace()}
    best, score = None, 0.0
    for k in known:
        t = {c for c in k if not c.isspace()}
        if not t or not s:
            continue
        ov = len(s & t) / min(len(s), len(t))
        if ov < 1.0 and _common_prefix(key, k) >= 2:
            ov += 0.25
        if ov > score:
            best, score = k, ov
    return best if score >= 0.4 else None


def _common_prefix(a: str, b: str) -> int:
    n = 0
    for x, y in zip(a, b):
        if x != y:
            break
        n += 1
    return n


_ALIAS = {"计网": "计算机网络", "操作系统原理": "操作系统", "数据结构": "数据结构",
          "微积分": "高等数学", "大物": "大学物理", "普通物理": "大学物理",
          "数据库原理": "数据库", "高数": "高等数学", "线代": "线性代数", "概率论": "概率论",
          "概率": "概率论"}
