"""章节结构统计（backend/chapterstat.py）的回归 —— 复习规划里「哪章是重点」的量化口径。

这块的每条判据都是被真语料逼出来的，用例就照着那些真事故写：
  · 《大物下册》的列表标题「1. 熵与能量」被当成假第 1 章（页码落在第 13 章地盘）；
  · 《微积分上册》书末「习题答案」重开章号，把第 1 章区间从 18 页拖到 290 页；
  · 上下册同名合并成一行，页码区间成了两本书混着数。
"""

from types import SimpleNamespace

from backend.chapterstat import _scan, chapter_no, plan_block
from backend import prompts


def _c(book, chapter, page, text, course="某课", stype="textbook"):
    return {"course": course, "book": book, "chapter": chapter, "section": "",
            "page": page, "text": text, "chars": len(text), "source_type": stype,
            "id": f"x#p{page}#i{book}"}


def test_章号归一认三种真实写法():
    assert chapter_no(_c("B", "第8章 无穷级数", 10, "")) == 8
    assert chapter_no(_c("B", "第三章 矩阵", 10, "")) == 3
    assert chapter_no(_c("B", "12-1-3 热力学", 10, "")) == 12
    assert chapter_no(_c("B", "1.1 随机事件", 10, "")) == 1


def test_列表编号和水印行不许当章号():
    assert chapter_no(_c("B", "1. 熵与能量", 37, "")) is None      # 大物下册的真事故
    assert chapter_no(_c("B", "超星2020学习资源交流群", 1, "")) is None


def test_习题答案重开的章号不进区间和密度():
    chunks = [
        _c("书A", "第1章 绪论", 1, "定义 1.1 是……"),
        _c("书A", "第1章 绪论", 2, "定理 1.2 ……"),
        _c("书A", "第2章 极限", 3, "例题 2.1"),
        _c("书A", "第2章 极限", 4, "例题 2.2"),
        _c("书A", "习题答案", 9, "略"),
        _c("书A", "第1章 绪论", 50, "答案区重开：定义 定义"),       # 尺寸够、位置不对 -> 剔除
        _c("书A", "第1章 绪论", 51, "答案……"),
    ]
    rows = _scan(chunks)
    ch1 = next(r for r in rows if r["book"] == "书A" and r["no"] == 1)
    assert ch1["chunks"] == 2 and ch1["page_lo"] == 1 and ch1["page_hi"] == 2
    assert ch1["marks"]["定义"] == 1, "答案页的『定义』不该数进第 1 章的密度"
    stray = next(r for r in rows if r["book"] == "书A" and r["no"] is None)
    assert stray["chunks"] == 3, "无章号 1 片 + 被剔除的答案区 2 片都要如实报数"


def test_紧邻的同章号续段要并进来():
    # 大段图版/表页打断后接着讲同一章：尺寸大、位置紧跟着主段 —— 这是正文，不是答案区
    chunks = [
        _c("书A", "第3章 栈", 1, "定义 1"),
        _c("书A", "第3章 栈", 2, "定义 2"),
        _c("书A", "插图说明", 3, "……"),
        _c("书A", "第3章 栈", 4, "定义 3"),
    ]
    ch3 = next(r for r in _scan(chunks) if r["no"] == 3)
    assert ch3["chunks"] == 3 and ch3["page_hi"] == 4
    assert ch3["marks"]["定义"] == 3


def test_plan_block_口径与排名都在文案里():
    chunks = [_c("书A", "第1章 绪论", 1, "定义 定理 例题"),
              _c("书A", "第2章 极限", 2, "例题 例题 例题 习题")]
    block = plan_block(chunks, "某课")
    assert "【章节结构统计·某课】" in block
    assert "结构密度" in block and "不是考试分值" in block
    assert "概念密度最高" in block and "第2章" in block.split("概念密度最高")[1]


def test_plan_block_三种课程三种说法():
    tb = [_c("书A", "第1章 绪论", 1, "定义")]
    assert plan_block(tb, None) == ""                       # 课程没定下来：不硬塞表
    assert plan_block(tb, "没这门课") == ""                  # 库里根本不会有它的切片
    paper_only = [_c("卷", "第1章", 5, "选择题", course="数据库", stype="past_paper")]
    say = plan_block(paper_only, "数据库")
    assert "没有教材切片" in say and "不要编造" in say        # 只有往年卷：明说章级密度无从算起
    assert "past_paper 1 片" in say                          # 手上有什么也要报得出


def test_extra进资料末尾_不进refs():
    store = SimpleNamespace(doc=lambda i: _c("书A", "第2章 极限", 19, "极限的定义"))
    hits = [SimpleNamespace(doc_idx=0)]
    msgs, refs = prompts.build_messages(
        {"system_prompt_template": "你是{role}。"}, "怎么复习", hits, store,
        "makeStudyPlan", extra="【章节结构统计·某课】假表")
    user = msgs[-1]["content"]
    assert "【章节结构统计·某课】假表" in user
    assert user.index("〔某课") < user.index("【章节结构统计"), "统计块挂在【资料】末尾"
    assert user.index("【章节结构统计") < user.index("【问题】")
    assert len(refs) == 1, "现算的表不是检索命中，不许多出一个能点开的出处"
    msgs2, _ = prompts.build_messages({"system_prompt_template": "你是{role}。"}, "q", hits, store,
                                      "askTextbook")
    assert "【章节结构统计" not in msgs2[-1]["content"], "不传 extra 时行为和以前一个字节都不差"


def _harness():
    """假 engine + 录制 LLM：只验 agent.run 把表接到了哪条链上，不碰真索引。"""
    from backend.agent import Agent

    chunks = [_c("书A", "第1章 绪论", 1, "定义 定理", course="高等数学"),
              _c("书A", "第2章 极限", 2, "例题 例题", course="高等数学")]
    store = SimpleNamespace(chunks=chunks, doc=lambda i: chunks[i], courses=lambda: ["高等数学"])
    rep = SimpleNamespace(hits=[SimpleNamespace(doc_idx=1, chunk_id="x")], coverage=0.9,
                          low_confidence=False, elapsed_ms=1, reasons=[], terms=[],
                          dropped_terms=[], paths=[], filters={})
    engine = SimpleNamespace(store=store, search=lambda *a, **k: rep, top_k=5, per_book=3)
    cap = {}

    class _LLM:
        provider = "stub"

        def route(self, *a, **k):
            return None

        def stream(self, msgs):
            cap["msgs"] = msgs
            yield "好"

    ag = Agent(engine, _LLM(), persona={"system_prompt_template": "你是{role}。"},
               tools_cfg={"tools": []}, acfg={"找同类题": False})
    ag.related = lambda *a, **k: []
    return ag, cap


def test_agent只把表塞进复习规划那一条链():
    ag, cap = _harness()
    list(ag.run("高等数学复习规划怎么排", course="高等数学"))
    assert "【章节结构统计·高等数学】" in cap["msgs"][-1]["content"]

    ag2, cap2 = _harness()
    list(ag2.run("极限怎么定义", course="高等数学", history=[{"role": "user", "content": "复习规划"}]))
    # 这一问 classify 走 askTextbook（关键词里没有规划），表不该出现
    assert "【章节结构统计" not in cap2["msgs"][-1]["content"]
