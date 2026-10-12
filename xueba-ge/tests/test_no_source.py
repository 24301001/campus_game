"""无资料降级（②）与"有没有老实声明没出处"（③）的结构断言。

这里**不联网、不花钱**：用假 LLM 只测一件事——降级的那条回答在结构上编不出出处
（messages 里没有【资料】块、事件里没有 citation、done 里 refs 为空 + no_source）。
措辞好不好、模型有没有真的听话，是另一层：`python eval/run_answer_eval.py --live`。
"""

import re

import pytest

from backend.agent import Agent
from backend.retrieval.engine import SearchEngine
from backend.retrieval.store import Store
from backend.settings import load_config

from conftest import offline_cfg

_PAGE = re.compile(r"第\s*\d+\s*页")


class FakeLLM:
    """只记录送进模型的 messages —— 结构断言靠它，不靠模型自觉。"""

    provider = "api"

    def __init__(self):
        self.sent = []
        self.route_args = ("askTextbook", {})

    def route(self, question, tool_specs, context=""):
        return self.route_args

    def stream(self, messages):
        self.sent.append(messages)
        yield "凭一般知识讲的一段，没有编号也没有页码。"


def _agent(acfg, course=None):
    engine = SearchEngine(Store().load(), offline_cfg())
    llm = FakeLLM()
    llm.route_args = ("askTextbook", {"course": course} if course else {})
    return Agent(engine, llm, load_config("persona", {}), load_config("tools", {}), acfg)


DEGRADE = {"无资料时": "降级", "降级不许碰的问题": ["考什么"]}
REFUSE = {"无资料时": "拒答"}


def _last(events):
    return events[-1]


def test_unknown_course_degrades_without_any_citation():
    """库里没这门课：承认之后用记忆讲，但**一个出处都不许有**。"""
    ag = _agent(DEGRADE, course="操作系统")
    evs = list(ag.run("死锁的四个必要条件分别是什么"))
    assert [e["type"] for e in evs].count("citation") == 0
    done = _last(evs)
    assert done["no_source"] is True and done["refs"] == []
    body = "".join(e["text"] for e in evs if e["type"] == "token")
    assert not _PAGE.search(body), "降级回答里出现了页码，等于凭空造出处"


def test_degrade_prompt_has_no_materials_block():
    """关键那条：送进模型的 messages 里根本没有可引的原文，编不出 [n]。"""
    ag = _agent(DEGRADE, course="操作系统")
    list(ag.run("死锁的四个必要条件分别是什么"))
    user = ag.llm.sent[-1][-1]["content"]
    assert "【资料】" in user and "（无" in user
    assert not _PAGE.search(user) and "〔" not in user


def test_known_course_low_confidence_also_degrades():
    """课程有教材、但这一段没翻到：同样承认 + 挂牌，不再只回一句"没有"。"""
    ag = _agent(DEGRADE, course="高等数学")
    evs = list(ag.run("卷积神经网络的反向传播怎么推导"))   # 线代入库后特征值有真教材，不再适合当"没翻到"的例子
    assert _last(evs)["no_source"] is True
    first = next(e["text"] for e in evs if e["type"] == "token")
    assert "没翻到" in first or "没有教材" in first, first[:60]


def test_switch_back_to_refusal_costs_no_generation():
    """开关拨回"拒答"= 任务书原口径：不生成，也就不可能编。"""
    ag = _agent(REFUSE, course="操作系统")
    evs = list(ag.run("死锁的四个必要条件分别是什么"))
    assert _last(evs).get("no_source") is None
    assert _last(evs)["fallback"] == "no_course"
    assert ag.llm.sent == [], "拒答分支不该花一次生成"


def test_school_facts_never_degrade():
    """"考试考什么"是校内事实，模型必编 —— 开关开着也不许降级。"""
    ag = _agent(DEGRADE, course="操作系统")
    evs = list(ag.run("操作系统这门课考试考什么"))
    assert _last(evs).get("no_source") is None
    assert ag.llm.sent == []


def test_study_plan_never_degrades():
    """复习规划要的是你们这门课的卷面和提纲，模型记忆在这里一文不值。"""
    ag = _agent(DEGRADE, course="操作系统")
    ag.llm.route_args = ("makeStudyPlan", {"course": "操作系统"})
    evs = list(ag.run("操作系统这门课怎么学"))
    assert _last(evs).get("no_source") is None


def test_real_material_still_gets_real_citations():
    """反向护栏：有真资料时不许偷偷走降级——金色出处和灰牌必须分得清。"""
    ag = _agent(DEGRADE, course="高等数学")
    evs = list(ag.run("洛必达法则的使用条件是什么"))
    cites = [e for e in evs if e["type"] == "citation"]
    assert cites and any(c["ref"].get("page", 0) > 0 for c in cites)
    assert _last(evs).get("no_source") is None
    assert _last(evs)["refs"]


def test_no_source_survives_history(tmpdb):
    """刷新页面之后牌子还在：历史里的降级回答必须还带着 no_source。"""
    uid = tmpdb.create_user("nick", "1234")
    sid = tmpdb.ensure_session(uid, None)
    tmpdb.add_message(sid, uid, "assistant", "凭记忆讲的一段", "askTextbook", "[]", no_source=1)
    tmpdb.add_message(sid, uid, "assistant", "有出处的一段", "askTextbook", "[]")
    rows = tmpdb.list_messages(sid, uid)
    assert [r["no_source"] for r in rows] == [1, 0], rows
