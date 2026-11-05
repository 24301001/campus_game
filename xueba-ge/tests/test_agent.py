"""课程守卫的回归测试 —— 接上真 LLM 第一次端到端就撞出来的那条。

`_courses()` 返回的 present 是「各种叫法 -> 库里真有的课程名」的映射：
用户和模型都可能说书名（微积分）而不是课程名（高等数学），
只比课程清单会把唯一一本真教材误判成"没这门课"，复习规划整条链堵死。
"""

from types import SimpleNamespace

from backend.agent import Agent

from conftest import offline_cfg

_CHUNKS = [
    {"course": "高等数学", "book": "微积分(上册·第2版)", "source_type": "textbook"},
    {"course": "高等数学", "book": "微积分(下册·第2版)", "source_type": "textbook"},
    {"course": "计算机网络", "book": "示例语料·计算机网络（占位，非教材原文）", "source_type": "textbook"},
    {"course": "校园信息", "book": "校园总平面", "source_type": "campus_info"},
]


class _Store:
    chunks = _CHUNKS

    def courses(self):
        seen, out = set(), []
        for c in self.chunks:
            k = c.get("course") or "未分类"
            if k not in seen:
                seen.add(k)
                out.append(k)
        return out


def _agent():
    engine = SimpleNamespace(store=_Store())
    return Agent(engine, llm=None)


def test_book_name_maps_to_course():
    _, present = _agent()._courses()
    assert present.get("微积分") == "高等数学"
    assert present.get("微积分(上册·第2版)") == "高等数学"


def test_alias_and_course_name_stay_valid():
    _, present = _agent()._courses()
    assert present.get("高数") == "高等数学"
    assert present.get("计算机网络") == "计算机网络"
    assert present.get("计网") == "计算机网络"


def test_course_without_book_is_not_present():
    # 线性代数在 corpus 清单里，但库里没有切片 —— 必须继续走"没这门课"兜底
    known, present = _agent()._courses()
    assert "线性代数" in known
    assert "线性代数" not in present
    assert "量子力学" not in present
def _real_agent():
    from backend.llm import LLM
    from backend.retrieval.engine import SearchEngine
    from backend.retrieval.store import Store

    engine = SearchEngine(Store().load(), offline_cfg())
    return Agent(engine, LLM({"provider": "stub"}))      # 这条测的是选片，不是生成


def test_同类往年题卡片只给真题目卷():
    ag = _real_agent()
    items = ag.related("E-R 图怎么转成关系模式", "数据库", set())
    assert items, "数据库有 5 份真题入库，卡片不该空"
    assert len(items) <= 2
    assert all("参考答案" not in it["book"] for it in items), \
        "答案卷不能当题目参考，等于把答案甩在卡片上"
    assert all(it["source_type"] == "past_paper" and it["page"] > 0 for it in items), \
        "卡片要能指到某一年某份卷的第几页，不然学生没法去翻原卷"


def test_正文引过的卷子不许把卡片挤没():
    """卡片是「再看两道别的」，不是把正文已经引过的那几页再挂一遍。

    2026-09-27 换成真语义向量后实测暴露：正文这条链会把 top5 全引掉，
    卡片只有 4 个候选，事后一删就剩 0 条 —— 冒烟里那条「答完会挂同类往年题」当场变红。
    修法是把已引用的片段传进检索的 `exclude=`，让候选池先补满再排序。
    """
    ag = _real_agent()
    q = "E-R 图怎么转成关系模式"
    cited = {h.chunk_id for h in ag.engine.search(q, source_type="all", top_k=5).hits}
    items = ag.related(q, "数据库", cited)
    assert items, "正文把最强的几条引完了，卡片仍要从剩下的卷子里出"
    assert len(items) <= 2
    assert not ({i["chunk_id"] for i in items} & cited), "卡片不许重复正文已经引用的片段"
    assert all(i["source_type"] == "past_paper" and "参考答案" not in i["book"] for i in items)


def test_没有真题的课不出卡片():
    ag = _real_agent()
    assert ag.related("柯西收敛准则是什么", "高等数学", set()) == []
    assert ag.related("明湖在哪儿", "校园信息", set()) == []

def test_近似课名自动归一_差得远的绝不替用户决定():
    from backend.agent import _canon_course
    present = {"数据结构": "数据结构", "高等数学": "高等数学", "微积分": "高等数学"}
    assert _canon_course("数据结构与算法", present) == "数据结构"
    assert _canon_course("微积分", present) == "高等数学"
    assert _canon_course("软件测试", present) is None        # 另一门课，不能悄悄换成软设去答


def test_模型报的是书脊上的名字也要归到那本书():
    """2026-09-22 拍照提问当天撞出来的：题图上印着「概率论与数理统计」，模型就照这个报；
    库里的课程名却叫「概率论」，书名别名是从真实切片取的**全名**（带版本号和出版社）。
    difflib 的整串相似度被那条尾巴拖到 0.48，够不上 0.72 —— 结果库里唯一那本真教材
    被判成"没这门课"，整条链走降级、引用 0 条。前缀这一路补的就是这个洞。
    """
    from backend.agent import _canon_course
    present = {"概率论": "概率论",
               "概率论与数理统计(第3版) 赵平 科学出版社 2024": "概率论",
               "概率论与数理统计 赵平 科学出版社 2024": "概率论",
               "高等数学": "高等数学"}
    assert _canon_course("概率论与数理统计", present) == "概率论"
    assert _canon_course("数学分析", present) is None          # 前缀撞不上就不许换成概率论
    assert _canon_course("软件", present) is None              # 太短，撞名而已，不猜
    # 前缀命中两门课 = 不替用户决定。书名都带长尾巴，difflib 那条先让开，才走到这一路
    both = {"数据结构与算法(第3版) 王 出版社 2019": "数据结构",
            "数据结构与算法(第5版) 严 出版社 2020": "算法设计与分析"}
    assert _canon_course("数据结构与算法", both) is None


def test_缩写只建议不改判并且建议里带上手上有什么():
    ag = _agent()
    hint = ag._course_hint("软测", ["软件设计与分析", "高等数学"])
    assert "软件设计与分析" in hint, hint                     # 至少告诉他往哪儿问
    assert "往年卷" in hint, hint                             # 那门课有什么资料，说清楚
    assert len(hint) < 90, f"别把整份对账单倒给用户：{hint}"   # 200 字报错日志味道的教训


def test_没有相近课程时别硬凑():
    from backend.agent import _suggest_course
    assert _suggest_course("明湖在哪儿", ["软件设计与分析", "高等数学"]) is None


def test_模型扩写出来的整门课名也要给出最接近的那门():
    """冒烟实测：模型把「软测」扩写成「软件测试技术」，纯字符重合度只剩 2/6，
    早先这里提不出建议，兜底话术退化成干列一遍课程清单。共有前缀（软件）才是有效线索。"""
    from backend.agent import _canon_course, _suggest_course
    known = ["数据库", "校园信息", "算法设计与分析", "软件设计与分析", "高等数学"]
    assert _suggest_course("软件测试技术", known) == "软件设计与分析"
    assert _suggest_course("操作系统", known) is None            # 没有相近的就不硬凑
    present = {c: c for c in known}
    assert _canon_course("软件测试技术", present) is None        # 建议可以，替用户改判不行


def test_路由不许把缩写补全成另一门课():
    """course 里出现库里没有的课名 = 整条链走兜底，缩写让模型自己扩写就是掷硬币。"""
    specs = _agent()._openai_tools()
    ask = next(t for t in specs if t["function"]["name"] == "askTextbook")
    desc = ask["function"]["parameters"]["properties"]["course"]["description"]
    assert "留空" in desc and "不要替他补全" in desc
