"""检索层单测：`pytest tests/test_retrieval.py`（不需要服务、不需要网络、不需要 Key）。

测的是"链路对不对"，不是"模型好不好"——后者交给 eval/run_eval.py 去量。
"""

from __future__ import annotations

import json
import os
import sys

import pytest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

from backend.retrieval import fusion                       # noqa: E402
from backend.retrieval.bm25 import BM25Index               # noqa: E402
from backend.retrieval.embed import doc_text, embed        # noqa: E402
from backend.retrieval.engine import SearchEngine          # noqa: E402
from backend.retrieval.store import Store                  # noqa: E402
from backend.retrieval.tokenize import query_tokens, tokens  # noqa: E402

from conftest import offline_cfg                             # noqa: E402


@pytest.fixture(scope="module")
def engine() -> SearchEngine:
    cfg = offline_cfg()
    return SearchEngine(Store().load(), cfg)


# ---------------- 分词 ----------------
def test_mixed_script_is_stuck_together():
    """「B+ 树」和「B+树」必须是同一个词，否则专有词的字面匹配全线失效。"""
    assert "b+树" in tokens("B+ 树的叶子结点")
    assert "b+树" in tokens("B+树的叶子结点")


def test_query_tokens_dedupe():
    q = query_tokens("进程和线程的区别，进程和线程的区别")
    assert len(q) == len(set(q))


def test_fullwidth_ascii_normalized():
    assert "tcp" in tokens("ＴＣＰ 协议")


# ---------------- BM25 ----------------
def test_bm25_prefers_exact_rare_term():
    docs = ["TCP 三次握手建立连接", "UDP 没有连接概念", "三次握手的目的是同步序号"]
    idx = BM25Index.build([tokens(d) for d in docs])
    assert idx.rank(query_tokens("三次握手"))[0] in (0, 2)
    assert idx.df("三次握手") == 2


def test_generic_terms_do_not_win():
    """虚词占满查询时不能给无关文档高分（这是 35% df 过滤存在的理由）。"""
    docs = [
        "在交换数据之前必须先用三次握手来建立连接，之前不要重复",
        "B+ 树的所有叶子结点中存放了全部关键字的信息，并链接成有序链表",
    ]
    idx = BM25Index.build([tokens(d) for d in docs])
    sc = idx.score(query_tokens("叶子结点存放什么"))
    assert sc.get(1, 0.0) > sc.get(0, 0.0)


def test_bm25_roundtrip():
    idx = BM25Index.build([tokens("页面置换算法 FIFO LRU")])
    back = BM25Index.from_dict(json.loads(json.dumps(idx.to_dict())))
    assert back.score(query_tokens("LRU")) == idx.score(query_tokens("LRU"))


# ---------------- 融合 ----------------
def test_rrf_rewards_double_hits():
    lists = {"a": [1, 2, 3], "b": [2, 3, 1]}
    out = fusion.rrf(lists)
    assert max(out, key=out.get) == 2                  # 两条路都靠前 → 融合第一


def test_prior_penalizes_rank_not_score():
    """先验该是微调，不该是否决：第 1 名乘 0.7 之后不该掉到第 10 名后面。"""
    lists = {"a": list(range(1, 12))}
    no_prior = fusion.rrf(lists)
    with_prior = fusion.rrf(lists, prior_of=lambda d: 0.7 if d == 1 else 1.0)
    order = fusion.rank_by_score(with_prior)
    assert order[0] == 1


def test_per_book_cap_keeps_order():
    ranked = [0, 1, 2, 3, 4]
    books = {0: "A", 1: "A", 2: "B", 3: "A", 4: "B"}
    out = fusion.per_book_cap(ranked, books.get, 1)
    assert out == [0, 2]


# ---------------- 端到端检索 ----------------
# 期望写成"原文里的一句话"而不是切片 id：重新切片会让 id 整体位移，
# 钉死在 id 上的测试会退化成"一改就全红"的摆设。
# 这四条原来钉在计网/OS/数据结构/数据库的示例语料上（句子是我手写的，一找一个准）。
# 2026-09-20 那四门下架之后它们必然全红 —— 红得对，但留着就是拿假语料当测试基线。
# 换成微积分上册（真 OCR 教材），判据也从"整句原文"改成"**节标题命中**"：
# OCR 正文里一句话可能跨片、也可能带公式噪声，钉整句会变成一改就全红的摆设（和 eval 的 节: 同一个道理）。
@pytest.mark.parametrize("q,expect_section", [
    ("洛必达法则的使用条件是什么", "洛必达"),
    ("单调有界数列为什么必定有极限", "单调有界"),
    ("什么时候能用等价无穷小替换", "无穷小"),
    ("不定积分怎么换元", "换元"),
])
def test_textbook_questions_retrieve_the_answer(engine, q, expect_section):
    rep = engine.search(q, source_type="textbook", top_k=5)
    assert not rep.low_confidence, rep.reasons
    secs = [(engine.store.doc(h.doc_idx).get("section") or "") for h in rep.hits[:3]]
    assert any(expect_section in x for x in secs), secs


def test_semantic_paraphrase_still_hits(engine):
    """换一种说法问同一件事，还要能捞回讲它的那一节（原来用进程/线程，语料下架后换微积分）。"""
    rep = engine.search("证明极限存在能不能一个夹一个地算", course="高等数学", source_type="textbook")
    secs = [(engine.store.doc(h.doc_idx).get("section") or "") for h in rep.hits[:3]]
    assert any("极限存在准则" in x or "夹逼" in x for x in secs), [rep.reasons, secs]


def test_没喂过的课必须低置信(engine):
    """以前这条用"洛必达法则"——微积分上册入库后它**不该**再拒答了（该拒的换成线代/概率）。

    留着不改等于把真教材判成失败，拒答率的数字也就假了。
    2026-09-21 线代入库，"矩阵特征值"同样从"该拒"变成"该答"，例子再换一次：
    概率论（还是没书）＋ 库里彻底没有的神经网络。
    2026-09-22 概率论、数据结构两本教材入库（corpus.json 的 xbg-prob / xbg-ds），
    "全概率公式"这条又失效了 —— 例子换成操作系统的页面置换：那门课仍是零教材。
    2026-09-28 计网/离散/数据库三本入库后又失效了一次，这次失效得**最有教育意义**：
    「神经网络」在《数据库系统概论》里真出现过四个字（全局 df>0），CNN 问题在高数课名下
    被"卷积积分"的页硬接 —— 全局 df 拦不住跨课同名词了。闸门改成**课程内 df**
    （engine._course_df），用例跟着钉上课程：没喂的课必须按"这门课的资料里查无此词"来拒。
    """
    rep = engine.search("页面置换算法的缺页率怎么算", course="操作系统", source_type="all")
    assert rep.low_confidence, [engine.store.doc(h.doc_idx)["id"] for h in rep.hits]
    rep2 = engine.search("卷积神经网络的反向传播怎么推导", course="高等数学", source_type="all")
    assert rep2.low_confidence, [engine.store.doc(h.doc_idx)["id"] for h in rep2.hits]


def test_线代入库后特征值不许再拒(engine):
    """反向护栏：这门课**真的**有教材了还判低置信，等于把书当没有。"""
    rep = engine.search("矩阵的特征值和特征向量怎么求", source_type="all")
    assert not rep.low_confidence, rep.reasons
    courses = {engine.store.doc(h.doc_idx)["course"] for h in rep.hits[:5]}
    assert courses == {"线性代数"}, [engine.store.doc(h.doc_idx)["id"] for h in rep.hits[:5]]


def test_数据结构与概率论入库后不许再拒(engine):
    """反向护栏，来路同 test_线代入库后特征值不许再拒：2026-09-22 概率论、数据结构两本教材入库。书上真有 7.3.5 B+ 树 和第 5 章大数定律，还判低置信等于把刚 OCR 的 6 098 片当没有；它和上面那条失效的拒答例子是一体两面，两条一起改才算改对。"""
    cases = (("B+ 树比 B 树好在哪", "数据结构"), ("大数定律和中心极限定理说什么", "概率论"))
    for q, course in cases:
        rep = engine.search(q, source_type="all")
        assert not rep.low_confidence, (q, rep.reasons)
        top = [engine.store.doc(h.doc_idx) for h in rep.hits[:3]]
        assert course in {d["course"] for d in top}, (q, [d["id"] for d in top])


def test_分词造出来的假词不能当成没喂(engine):
    """两条实测误拒：切错的词本身 df=0，但它里面的二字片段在库里满地都是。

    这道闸门拦的是"这门课没喂"，不是"分词器没切对"。放过去就会把该答的题拒掉
    ——§2.2 解题辅导整条链都建在它上面（接上真模型后 explainProblem 第一例就被拒）。
    """
    for q in ("定积分换元的上下限怎么处理",
              "求极限 lim(x->0) (sin x)/x 这类题一般怎么做"):
        rep = engine.search(q, source_type="textbook")
        assert not rep.low_confidence, (q, rep.reasons)


def test_子词回退不能把真缺席放过去():
    from backend.retrieval.engine import unknown_terms

    def df_of(word):
        return {"积分": 2046, "这类": 4}.get(word, 0)

    assert unknown_terms(["积分换"], df_of) == []
    assert unknown_terms(["这类题"], df_of) == []
    assert unknown_terms(["有没有"], df_of) == []
    assert unknown_terms(["特征值", "贝叶斯", "发明者"], df_of) == ["特征值", "贝叶斯", "发明者"]


def test_差一格豁免不能把真没喂的科目放过去():
    """`子网划分` 里 `子网`、`划分` 各自都在库出现过，但"子网划分"这个概念本库没有。

    第一版豁免写成"任一二字片段存在即放过"，这条就漏了 —— 删掉假提纲之后实测
    「子网划分的可用主机数怎么算」被高数第 1 章（区间长度那段）硬接，
    只因为命中了 `数`/`算` 两个字。判据因此收紧成"砍掉任意一个边字仍是库里的词"。
    """
    from backend.retrieval.engine import unknown_terms

    def df_of(word):
        return {"子网": 2, "划分": 6, "可用": 9, "主机": 1}.get(word, 0)

    assert unknown_terms(["子网划分", "可用主机"], df_of) == ["子网划分", "可用主机"]
    assert unknown_terms(["积分换", "这类题"], lambda w: {"积分": 2046, "这类": 4}.get(w, 0)) == []


def test_入库的真教材捞得到并且出处带书页码(engine):
    """OCR 进来的书不能只"能搜到词"，出处必须指到书上的印刷页 —— 点不开就等于没出处。"""
    rep = engine.search("零点定理要用在什么条件上", source_type="textbook")
    assert not rep.low_confidence, rep.reasons
    hit = rep.hits[0]
    doc = engine.store.doc(hit.doc_idx)
    assert doc["course"] == "高等数学" and doc["book_id"] == "xbg-calc1"
    assert 50 <= doc["page"] <= 56, f"零点定理在书第 53 页，实得第 {doc['page']} 页"
    texts = [engine.store.doc(h.doc_idx)["text"] for h in rep.hits[:3]]
    assert any("在开区间 $(a,b)$ 内至少存在" in x for x in texts), [x[:20] for x in texts]


def test_公式以latex进库没有被抽成乱码(engine):
    rep = engine.search("带皮亚诺余项的泰勒公式", course="高等数学", source_type="textbook")
    assert rep.hits
    t = engine.store.doc(rep.hits[0].doc_idx)["text"]
    assert "\\lim" in t or "R_{n}" in t, t[:80]


def test_疑问功能词按词表硬停不看df(engine):
    """语料被一本教材占满后，"什么"的 df 只有 12/4197 —— 靠 df 判虚词会把它当稀有术语。"""
    from backend.retrieval import tokenize as tz

    assert "什么" not in tokens("这是什么东西")
    assert "使用" not in tokens("常用的方法")
    assert "为什么" in tokens("为什么会出错")        # 说明文里它是"这段在讲原因"的路标
    # 停用表只管功能词，术语一律不进：数学里"条件"是内容（充分条件、边界条件）
    assert "条件" not in tz._STOP_PHRASES and "握手" not in tz._STOP_PHRASES
    assert all(w in tz._STOP_PHRASES for w in ("什么", "怎么", "哪些", "是不是"))


def test_citations_carry_full_provenance(engine):
    """出处必须自带"点得开"的全套字段：课程 / 书名 / 页码。

    这条以前顺手钉死了"必须来自哪三本书"，而真题入库后那两份假语料已经停用
    （改名 *.md.disabled：退出索引，但留着当"当初是假的"的证据）。
    钉书名就变成了测"哪本书在库"，不是测"出处完不完整"，所以改成只测字段。
    """
    rep = engine.search("洛必达法则的使用条件是什么", source_type="textbook")
    assert rep.hits and not rep.low_confidence, rep.reasons
    c = engine.store.doc(rep.hits[0].doc_idx)
    assert c["course"] and c["book"] and c["id"]
    assert c["page"] > 0, "页码为 0 的出处点不开，等于没有出处"
    assert "占位" not in c["book"] and "示例" not in c["book"], "示例语料已下架，不许再被当成出处"


def test_真题的出处也点得开(engine):
    """往年卷不能只"搜得到"，得能指到"哪一年哪份卷第几页"——不然学生没法去翻原卷。"""
    rep = engine.search("E-R 模型转关系模式", source_type="past_paper")
    assert rep.hits, [r for r in rep.reasons]
    c = engine.store.doc(rep.hits[0].doc_idx)
    assert c["source_type"] == "past_paper"
    assert c["course"] and c["book"] and c["page"] > 0, c
    assert "学年" in c["book"], f"书名里要带学年，不然分不清是哪一年的卷子：{c['book']}"



def test_换词问同一节不能被同名不同节挤掉(engine):
    """学生嘴里的「洛必达**准则**」，书上写的是「洛必达**法则**」。

    hash 向量按字面相似把「2.5 极限存在准则」「11.1.3 柯西准则」顶到前两名（它们字面
    就带"准则"），正主 6.2 反而掉出前三 —— 模型照着资料回一句"课本里没有"，用户看到的
    就是"我明明有这本书你却说没有"（2026-09-20 截图实测）。
    判据：vector 权重从 0.5 降到 0.12，让它**只当召回兜底、不当排序话语权**。
    """
    rep = engine.search("微积分里洛必达准则是什么啊", course="高等数学", source_type="textbook")
    secs = [(engine.store.doc(h.doc_idx).get("section") or "") for h in rep.hits[:3]]
    assert any("洛必达" in s for s in secs), f"前三没有一节是洛必达：{secs}"
    assert not rep.low_confidence, rep.reasons
def test_embed_hash_is_deterministic_and_normalized():
    cfg = {"provider": "hash", "dim": 512}
    a, b = embed(["死锁的四个必要条件"], cfg), embed(["死锁的四个必要条件"], cfg)
    assert a.shape == b.shape and float((a - b).__abs__().max()) == 0.0
    assert abs(float((a * a).sum()) - 1.0) < 1e-4


# ---------------- 向量空间对齐：换 embedding 之后最容易踩的坑 ----------------
def test_向量空间不同源时必须拒绝而不是硬算(engine):
    """索引里那坨 float32 和配置说的不是一个模型 —— 这件事**必须炸**，不能静默降质。

    dim 相同（都是 512）时 `VectorIndex.load` 看不出任何异常，查询向量和文档向量
    来自两个空间，余弦变成噪声，排序悄悄变差。这是换模型场景下最阴的 bug。
    """
    from backend.retrieval import engine as eng_mod

    st = engine.store
    meta0, vec0 = dict(st.meta), st.vec
    try:
        st.meta = {**meta0, "embed_provider": "api", "embed_model": "别的模型", "embed_dim": 512}
        with pytest.raises(RuntimeError, match="kb.build"):
            eng_mod._align_vectors(st, {"provider": "api", "model": "qwen3.7-text-embedding-flash", "dim": 512})
        # 同 provider、换模型名也一样不许混
        st.meta = {**meta0, "embed_provider": "hash", "embed_model": "", "embed_dim": 999}
        with pytest.raises(RuntimeError):
            eng_mod._align_vectors(st, {"provider": "api", "model": "m", "dim": 512})
        # 两边同源：一次重算都不许发生（生产路径每次 search 都会走到这个判断）
        st.meta = {**meta0, "embed_provider": "hash", "embed_model": "",
                   "embed_dim": int(engine.embed_cfg.get("dim", 512))}
        eng_mod._align_vectors(st, engine.embed_cfg)
        assert st.vec is vec0
    finally:
        st.meta, st.vec = meta0, vec0


def test_describe_报的是实际参与建向量的那个模型():
    """索引 meta 里的"来源"必须由 `embed.describe()` 算，不能让 `kb.build` 直接抄配置。

    provider=onnx 时配置里的 `model` 是**服务商**那个名字（这一段和生成层共用旋钮），
    照抄进 meta 就等于索引自报了一个从没参与建向量的模型 —— 换 int8/fp32 权重、
    甚至换一整份 bge，对账都看不出来，两套空间的余弦会硬乘，而分数还会好看地骗人。
    """
    from backend.retrieval.embed import describe

    assert describe({"provider": "hash"})["model"] == ""
    d = describe({"provider": "onnx", "dim": 512})
    assert d["provider"] == "onnx" and d["model"].startswith("bge-small-zh-v1.5")
    assert d["model"].endswith("model_quantized.onnx")
    # 换权重文件必须换身份，否则闸门拦不住 int8 <-> fp32 串空间
    assert describe({"provider": "onnx", "model_file": "model.onnx"})["model"] != d["model"]
    # api 那条照配置报（那才是真参与建向量的名字）
    assert describe({"provider": "api", "model": "qwen3.7-text-embedding-flash"})["model"] \
        == "qwen3.7-text-embedding-flash"


def test_运行期重算的hash向量和建索引时逐元素相同(engine):
    """单测敢强制 provider=hash，靠的是这条：重算规则和 `kb/build.py` 是**同一份代码**。

    判据取逐元素完全相等（== 0.0）而不是"余弦接近 1"：hash 是确定性计算，
    只要两边文本拼接规则一致就该比特级相同。哪天有人把标题链格式改了，这条会红。
    """
    st = engine.store
    cfg = {"provider": "hash", "dim": int(engine.embed_cfg.get("dim", 512))}
    for i in (0, 1234, len(st.chunks) - 1):
        want = embed([doc_text(st.doc(i))], cfg, df_of=st.bm25.df, n_docs=st.bm25.n_docs)[0]
        got = st.vec.mat[i]
        assert max(abs(float(x) - float(y)) for x, y in zip(want, got)) == 0.0, f"第 {i} 片向量不同源"


def test_offline_cfg不许跟着生产配置走():
    """单测一旦跟着 config 换成 api，就会要外网、要 Key、花钱、且测不出延迟回归。"""
    cfg = offline_cfg()
    assert cfg["embedding"]["provider"] == "hash"
    assert "model" not in cfg["embedding"]
    assert cfg["rerank"]["provider"] == "none"
    assert cfg["weights"]["vector"] == 0.12 and cfg["min_cos"] == 0.2


def test_生产配置的旋钮要和向量空间配套():
    """`config/retrieval.json` 是**生产**参数：换 provider 不重扫旋钮，这条会拦。"""
    from backend.settings import load_config

    prod = load_config("retrieval", {})
    emb = prod["embedding"]
    assert emb["provider"] != "hash", "生产配置退回 hash：README §10『语义向量是假的』那条就不能算修好"
    assert emb.get("model"), "provider=api 必须写清模型名，索引 meta 才有东西可对"
    assert float(prod["weights"]["vector"]) >= 0.2, "0.12 是 hash 空间扫出来的，真语义要重扫"
    assert float(prod["min_cos"]) >= 0.3, "0.2 是 hash 空间的阈值，真向量下太松"


def test_warm_search_is_submillisecond(engine):
    """把"暴力余弦够快，不需要向量库"这句话变成一条会失败的断言。"""
    import time

    for _ in range(5):
        engine.search("什么是虚拟存储器", source_type="all")
    t0 = time.perf_counter()
    for _ in range(30):
        engine.search("页面置换算法有哪些", source_type="all")
    ms = (time.perf_counter() - t0) * 1000 / 30
    assert ms < 60, f"平均 {ms:.1f} ms/次，检索层慢了，先看是不是每查询都在重载索引"


# ---------------- 规范术语归一（route() 把学生口语翻成教材里的说法） ----------------
def _sections(engine, rep):
    return [(engine.store.doc(h.doc_idx).get("section") or "") for h in rep.hits]


def test_extra_terms_pull_the_right_section(engine):
    """原话捞不到的那一节，补上教材规范说法就该进前三。"""
    q = "极限那个上面下面一起求导的法则叫啥来着"
    raw = engine.search(q, course="高等数学", source_type="textbook", top_k=3)
    new = engine.search(q, course="高等数学", source_type="textbook", top_k=3,
                        extra_terms=["洛必达法则", "未定式"])
    assert not any("洛必达" in t for t in _sections(engine, raw))
    assert any("洛必达" in t for t in _sections(engine, new))
    # 「未定式」也认（它会被拆成成分「未定」）——这里只要求洛必达在名单最前面
    assert new.terms[0] == "洛必达"


def test_hallucinated_term_is_dropped_and_reported(engine):
    """模型编出来的说法本库 df==0：不进检索，但要如实说出来，不能悄悄吞。"""
    # 不能用「量子纠缠」了：2026-09-21 大物下册入库，回退成分「量子」df=65，会被当成库里有
    rep = engine.search("洛必达法则的使用条件是什么", source_type="textbook",
                        extra_terms=["哈密顿量"])
    assert rep.terms == []
    assert "哈密顿量" in rep.dropped_terms


def test_users_own_words_are_not_double_weighted(engine):
    """用户自己已经这么写的词不重复加（会偷偷改排序），也不算"库里没有"。"""
    rep = engine.search("函数极限存在需要什么条件", source_type="textbook", extra_terms=["极限"])
    assert rep.terms == [] and rep.dropped_terms == []


def test_compound_term_falls_back_to_pieces(engine):
    """「单调有界准则」在库里成不了一个词，退成分之后「单调」得能用上。"""
    rep = engine.search("怎么判断一个数列有没有极限啊，夹着算那种", course="高等数学",
                        source_type="textbook", extra_terms=["单调有界准则"])
    assert "单调" in rep.terms
    assert "单调有界准则" not in rep.dropped_terms


def test_extra_terms_are_capped(engine):
    """补词封顶 4 个：再多就不许往查询里灌了。"""
    rep = engine.search("这道题怎么做", source_type="all",
                        extra_terms=["洛必达", "单调", "夹逼定理", "聚簇索引", "循环等待", "贪心"])
    assert len(rep.terms) <= 4


def test_coverage_and_refusal_gate_read_only_the_original_words(engine):
    """**这条是整套归一的安全带**：coverage 和"这门课没喂"闸门只看用户原话，
    补词不许把该拒的问题洗成能答。
    2026-09-28 起闸门按课程内 df 判（见 test_没喂过的课必须低置信 的注释），
    课程不钉住的问法在引擎层本来就放行，所以这条必须带 course 才测得到安全带。"""
    q = "卷积神经网络的反向传播怎么推导"      # RSA 那条换掉了：大物入库后「数学原理」df=2，不再该拒
    raw = engine.search(q, course="高等数学", source_type="all", top_k=5)
    patched = engine.search(q, course="高等数学", source_type="all", top_k=5,
                            extra_terms=["哈密顿量", "鲁棒性", "卷积核"])
    assert patched.coverage == raw.coverage
    assert patched.low_confidence is True


# ---------------- 精排（rerank）：形状按实测、分数不许冒充置信度 ----------------
def _hit(i, paths=("bm25",)):
    from backend.retrieval.engine import SearchHit

    return SearchHit(doc_idx=i, chunk_id=f"c{i}", score=1.0 / (i + 1), norm=0.5,
                     paths=list(paths), ranks={}, snippet="")


def test_rerank_重排候选但不覆盖置信度():
    """`norm` 是 RRF 归一化置信度，接口契约里靠它卡 `min_norm` 和拒答。

    精排分是**另一个量纲**（不同服务商尺度还不一样），只能待在 `rerank` 字段里。
    上一版直接 `h.norm = relevance_score`，等于让外部模型改写我们的拒答判据。
    """
    from backend.retrieval.rerank import Reranker

    rr = Reranker({"provider": "api", "model": "m",
                   "url": "https://x/api/v1/services/rerank/text-rerank/text-rerank"})
    out = rr._reorder([_hit(i) for i in range(4)],
                      [{"index": 2, "relevance_score": 0.9}, {"index": 0, "relevance_score": 0.1}])
    assert [h.doc_idx for h in out] == [2, 0, 1, 3], "没返回的候选要按原序垫在后面，不许凭空丢"
    assert out[0].rerank == 0.9 and out[0].norm == 0.5, "精排分不许冒充 norm"
    assert [h.rerank for h in out] == [0.9, 0.1, 0.0, 0.0]
    assert "rerank" in out[0].paths and "rerank" not in out[2].paths
    assert "rerank" in out[0].as_dict() and "rerank" not in out[2].as_dict()


def test_rerank_两种请求形状按实测的URL认():
    """百炼**不认** OpenAI 那套 `POST {base}/v1/rerank`（实测 404），只有原生口能用。"""
    from backend.retrieval.rerank import Reranker

    a = Reranker({"provider": "api", "base_url": "https://gate.example.com/v1"})
    assert a._url().endswith("/v1/rerank") and a._shape(a._url()) == "openai"
    b = Reranker({"provider": "api",
                  "url": "https://dashscope.aliyuncs.com/api/v1/services/rerank/text-rerank/text-rerank"})
    assert b._shape(b._url()) == "dashscope"
    assert Reranker({"provider": "api"})._url() == ""


def test_rerank_没key或调用失败都退回融合排序并且把失败记下来(monkeypatch):
    """pass-through 不能让它是"静默"的：评测要看 `stats()` 才知道这条 A/B 有没有真跑。"""
    import requests

    from backend.retrieval import rerank as rr_mod
    from backend.retrieval.rerank import Reranker

    hits = [_hit(i) for i in range(3)]
    monkeypatch.setattr(rr_mod, "resolve_key", lambda cfg, default=".llm_key": "")
    no_key = Reranker({"provider": "api", "model": "m", "url": "https://x/rerank"})
    assert no_key.apply("q", hits, lambda h: "正文", top_k=3) is hits
    assert no_key.stats()["calls"] == 0, "没配 key 就当没开，不该记成一次调用"

    monkeypatch.setattr(rr_mod, "resolve_key", lambda cfg, default=".llm_key": "k")
    monkeypatch.setattr(requests, "post", lambda *a, **k: (_ for _ in ()).throw(requests.ConnectionError("断网")))
    dead = Reranker({"provider": "api", "model": "m", "url": "https://x/rerank"})
    assert dead.apply("q", hits, lambda h: "正文", top_k=3) is hits
    st = dead.stats()
    assert st["failures"] == 1 and "ConnectionError" in st["last_error"]


def test_exclude_是在进榜之前摘掉不是排完名再删(engine):
    """`exclude=` 的意义在于「摘掉的人不给占坑」。

    事后过滤（先 ranking 再 `if cid in cited: continue`）会让被排除的片段白占名次：
    候选池本来只有 4~6 条时，删完就空了 —— 同类往年题卡片变成 0 条就是这么来的。
    """
    q = "E-R 图怎么转成关系模式"
    base = engine.search(q, course="数据库", source_type="past_paper", top_k=4, per_book=2)
    assert base.hits and not base.low_confidence
    first = base.hits[0]
    again = engine.search(q, course="数据库", source_type="past_paper", top_k=4, per_book=2,
                         exclude={first.chunk_id})
    ids = [h.chunk_id for h in again.hits]
    assert first.chunk_id not in ids, "被排除的片段一条都不许留在榜上"
    assert len(ids) == 4, f"排除一条之后必须补满 4 条，实际 {len(ids)} 条（= 事后过滤的特征）"
    assert again.excluded == 1
    # 排除到什么都不剩时要明说，不许静默返回空榜
    everything = {h["id"] for h in engine.store.chunks if h.get("course") == "数据库"}
    dry = engine.search(q, course="数据库", source_type="past_paper", exclude=everything)
    assert dry.low_confidence and dry.hits == [] and dry.reasons


def test_rerank_精排是在候选池上做不是在这三条里换手(engine, monkeypatch):
    """上一版先把榜单截到 top-k、再拿这 k 条去精排 —— 那精排只能在前三里换手。

    现在候选池（`rerank_candidates`，默认 12）先过精排，再按书限流取 top-k。
    用"倒序"这个假精排来验：**新的第一名必须是原来排第 12 的那一片**。
    老代码在这里必挂，因为它最多只能收到 3 条。
    """
    q = "进程和线程有什么区别"
    base = [h.chunk_id for h in engine.search(q, source_type="all", top_k=3).hits]
    seen = {}

    def fake(query, hits, text_of, top_k):
        seen["n"] = len(hits)
        return list(reversed(hits))

    monkeypatch.setattr(engine.reranker, "provider", "api")
    monkeypatch.setattr(engine.reranker, "apply", fake)
    got = [h.chunk_id for h in engine.search(q, source_type="all", top_k=3).hits]
    assert seen["n"] == engine.rerank_candidates > 3, f"精排只收到 {seen['n']} 条 = 老 bug"
    assert set(got).isdisjoint(base), f"倒序之后前三条应该全换掉：{base} / {got}"