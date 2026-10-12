"""「给我类似的题/原题」这句话的回归测试。

2026-09-27 组长现场撞的：讲完一道线代题，追问「能不能给我找一点类似的原题」，
标题变成「复习规划」，正文把上一题又讲了一遍。三个工具都接不住这种问句
（判据在 backend/agent.py 的 wants_past_papers 上面），所以这条链改由规则先截。
这里锁的就是截得准不准、缺资料时说实话没有、以及别把上一轮的锅甩回来。
"""

import pytest

from backend.agent import Agent, _last_problem_text, wants_past_papers
from conftest import offline_cfg

# 题干里带上课程名：软路由对一句没有课名的话猜课本来就不稳（实测会把 E-R 图
# 猜成数据结构），这条测的是"认出课之后卡片对不对"，不是猜课。
_PREV_DB = "数据库这门课的 E-R 图怎么转成关系模式，请写出转换步骤"
_PREV_LIN = ("设三阶实对称矩阵 A 的特征值是 1,2,3，A 对应于特征值 1,2 的特征向量分别是 "
             "(1)求 A 对应于特征值 3 的特征向量；(2)求矩阵 A")
_ASK = "能不能给我找一点类似的原题"


@pytest.fixture(scope="module")
def ag():
    from backend.llm import LLM
    from backend.retrieval.engine import SearchEngine
    from backend.retrieval.store import Store

    # stub 生成器：这条链压根不走模型，用它是为了"万一走到了"能立刻看出来
    return Agent(SearchEngine(Store().load(), offline_cfg()), LLM({"provider": "stub"}))


def _events(agent, question, history=None, course=None, **kw):
    return list(agent.run(question, history=history or [], course=course, **kw))


def _text(evts):
    return "".join(e.get("text", "") for e in evts if e["type"] == "token")


def _done(evts):
    return [e for e in evts if e["type"] == "done"][-1]


# ---------- 判据：该截的截住，不该抢的一律不抢 ----------
@pytest.mark.parametrize("q,want", [
    (_ASK, True),
    ("出两道类似的题考我", True),
    ("出道同类题我练练", True),
    ("这题有往年卷吗", True),
    ("给我一道真题练练", True),
    ("帮我找两道软设的大题", True),
    # 存量询问归复习规划：它手上有题型结构和分值，比两张卡片有用
    ("有没有高数往年卷", False),
    # "练习题/模拟题"是要模型自己出，交给降级链去，别让这条规则原地打转
    ("出两道同类型的练习题考我", False),
    ("求这道极限", False),
    ("什么是假阳性问题", False),
    ("这道题的解答过程没看懂，能再讲一遍吗", False),
    ("这道综合题计算量太大，帮我找往年真题练手", False),
])
def test_要题的句子被规则截住_其余一律放行(q, want):
    assert wants_past_papers(q) is want


def test_空句子和纯空白不截():
    assert wants_past_papers("") is False
    assert wants_past_papers("   ") is False


# ---------- 拿哪句话去检索 ----------
def test_上一题的题干才是查询_要题那句自己不算():
    hist = [{"role": "user", "content": _PREV_DB},
            {"role": "assistant", "content": "第一步…"},
            {"role": "user", "content": _ASK}]
    assert _last_problem_text(hist) == _PREV_DB
    assert _last_problem_text([]) == ""
    assert _last_problem_text([{"role": "assistant", "content": _PREV_DB}]) == ""
    # 太短的（"再讲一遍"）当不了查询，检索进去只会捞回一堆无关页
    assert _last_problem_text([{"role": "user", "content": "再讲一遍"}]) == ""


# ---------- 端到端：没卷的课 ----------
def test_无卷的课要题时点名缺什么并给出路(ag):
    evts = _events(ag, _ASK, [{"role": "user", "content": _PREV_DB}], course="概率论")
    assert [e["tool"] for e in evts if e["type"] == "meta"] == ["findPastPapers"]
    assert [e["routed_by"] for e in evts if e["type"] == "meta"] == ["rule"]
    assert not [e for e in evts if e["type"] == "citation"], "缺资料还硬引课本就是答非所问"
    assert not [e for e in evts if e["type"] == "related"], "没卷就不许出卡片"
    say = _text(evts)
    assert "一张往年卷都没有" in say and "概率论" in say
    assert "教材 1 本" in say, "说缺什么要连着说手上有什么，只回一句「没有」是推活儿"
    assert "无出处 · AI 记忆" in say, "另一条路要如实标出会挂灰牌，不许悄悄用记忆补"
    d = _done(evts)
    assert d["refs"] == [] and d["fallback"] == "这门课没有往年卷"
    assert "no_source" not in d, "这里一个字都没凭记忆编，挂 AI 记忆牌是撒谎"
    assert "解题步骤" not in say and "复习规划" not in say, "不许续讲上一题"


def test_有卷的课要题时出卡片并写明页码(ag):
    hist = [{"role": "user", "content": _PREV_DB}, {"role": "assistant", "content": "…"}]
    evts = _events(ag, _ASK, hist)
    meta = [e for e in evts if e["type"] == "meta"][-1]
    assert meta["course"] == "数据库", "上一题的题干要在 meta 之前认出来，界面那行课名才对得上"
    rel = [e for e in evts if e["type"] == "related"]
    assert len(rel) == 1 and rel[0]["items"], "数据库有 5 份真题入库，这句该出卡片"
    items = rel[0]["items"]
    assert len(items) <= 2
    assert all("参考答案" not in it["book"] for it in items), "答案卷不许当练习题甩给学生"
    assert all(it["source_type"] == "past_paper" and it["page"] > 0 for it in items)
    say = _text(evts)
    for it in items:
        assert f"第{it['page']}页" in say, "正文要能指到原卷那一页，刷新后卡片没了也认得出"
    assert _done(evts)["tool"] == "findPastPapers"


def test_卡片只查一次检索(ag):
    """这条链只准跑一次 engine.search：多跑一次就是同一个问题花两份 embedding 的钱。"""
    calls = []
    real = ag.engine.search

    def spy(*a, **kw):
        calls.append(kw.get("source_type") or a[0][:8])
        return real(*a, **kw)

    ag.engine.search = spy
    try:
        _events(ag, _ASK, [{"role": "user", "content": _PREV_DB}], course="数据库")
    finally:
        ag.engine.search = real
    assert calls == ["past_paper"], f"往年卷只查一次，实际查了 {len(calls)} 次：{calls}"


@pytest.mark.parametrize("course,want_reason,need", [
    ("数据库", "卷里没搜到", "卷子我翻了一遍"),          # 有卷，但这个说法没排上
    ("概率论", "这门课没有往年卷", "一张往年卷都没有"),   # 只有教材
    ("校园信息", "这不是门课", "要题得说一门课"),
])
def test_缺的是哪一种_话术要分得清(ag, course, want_reason, need):
    """三种"没给出题"的原因不一样，话术也不能一样。

    都写成一句"没找到"就等于把三种情况的处理成本全推给学生：有卷的该换个说法，
    没卷的该换课或走降级，校园那条根本不是门课。
    """
    from types import SimpleNamespace
    say, reason = ag._no_paper_say(course, SimpleNamespace(hits=[]))
    assert reason == want_reason
    assert need in say


def test_没题干可比时只说有卷的课(ag):
    from types import SimpleNamespace
    say, reason = ag._no_paper_say(None, SimpleNamespace(hits=[]))
    assert reason == "没说是哪门课"
    assert "没有可比的东西" in say
    assert "往年卷" in say and "数据库" in say, "要点名有卷的课，别只说不知道"


def test_认不出课名时先承认拿题干对过(ag):
    """上一题的题干是真的拿去检索过的，话说"没接上题干"就是撒谎。"""
    from types import SimpleNamespace
    say, reason = ag._no_paper_say(None, SimpleNamespace(hits=[]), prev_problem=_PREV_LIN)
    assert reason == "没认出是哪门课"
    assert "题干我拿去卷子里对过了" in say and "没接上" not in say
    assert "同类" in say, "要解释为什么宁可不给卡片：跨课的题谈不上同类"


# ---------- 出卡片那句措辞必须跟着"认出了什么"变 ----------
def _items(*courses):
    return [{"n": i + 1, "course": c, "book": f"某课{c}2021期末试卷", "page": 7 + i,
             "source_type": "past_paper", "chunk_id": "x%d" % i, "quote": "设 K 是…" * 30}
            for i, c in enumerate(courses)]


def test_认出课程又有题干才敢说同类(ag):
    say = ag._papers_say(_items("数据库", "数据库"), "数据库", _PREV_DB)
    assert "和刚才那题同一类" in say
    assert "第7页" in say and "第8页" in say, "两道题各自指到哪一页要说清"
    assert "设 K 是…" in say and len(say) < 420, "题干摘要进正文（下一轮问得起、刷新也看得见）"


def test_没认出课程时卡片要写明是哪门课的并且不许说同类(ag):
    say = ag._papers_say(_items("数据库", "离散数学"), None, _PREV_LIN)
    assert "同一类" not in say, "跨课捞来的题说「同类」是在吹"
    assert "数据库的《" in say and "离散数学的《" in say


def test_会话第一句就要题时不假装刚才讲过题(ag):
    say = ag._papers_say(_items("数据库", "数据库"), "数据库", "")
    assert "同一类" not in say and "先按你这句从卷子里翻到" in say


def test_线代那道题的原样复现_不再串台讲上一题(ag):
    """组长那张截图的两轮：上一题是线代的特征值，追问要原题。

    线性代数在库里有教材、没有往年卷 —— 以前这条会被路由成"复习规划"，
    引用 0 条，然后正文把特征值又讲了一遍。现在必须一句话点破没有卷。
    """
    evts = _events(ag, _ASK, [{"role": "user", "content": _PREV_LIN}])
    meta = [e for e in evts if e["type"] == "meta"][-1]
    assert meta["tool"] == "findPastPapers" and meta["course"] == "线性代数"
    say = _text(evts)
    assert "一张往年卷都没有" in say
    assert "特征值" not in say and "正交" not in say, "不许把上一题再讲一遍"


def test_开关关掉就交回模型三选一(ag):
    off = Agent(ag.engine, ag.llm, persona=ag.persona, tools_cfg=ag.tools_cfg,
                acfg={"找同类题": False, "无资料时": "降级"})
    meta = [e for e in _events(off, _ASK, [{"role": "user", "content": _PREV_DB}])
            if e["type"] == "meta"][-1]
    assert meta["tool"] != "findPastPapers"
    assert meta["routed_by"] != "rule"
