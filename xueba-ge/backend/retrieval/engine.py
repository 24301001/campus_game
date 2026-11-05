"""检索引擎：双路 → RRF → 类型先验 → 分库配额 → top-k。

这里回答的是整个系统最值钱的一个问题：**「教材里哪几句跟这个问题有关」**。
不含任何 LLM 调用，纯本地计算。

三个必须写下来的设计决定：

1. **资料类型先验**（`source_prior`）。复习提纲和往年卷里**原样抄着题目本身**
   （"TCP 为什么需要三次握手"），字面匹配度天然高于讲答案的正文，讲原理的问题
   就会被它们盖住。所以对 textbook 提问时给提纲/往年卷降权，问复习规划时反过来。
   这不是玄学调参，是"问题问的是答案还是题目"这一件事的形式化。

2. **分库配额在融合之后做，而且带回填**。融合前截断会打散全局排序 —— 同一本书
   里第 1 名和第 5 名本该都进来时，截断会把第 4、5 名硬挤掉。所以默认路径是
   全局排序 → 按书限流 → 不够 top-k 再回填。只有在 `cross_book=True`
   （「不同教材怎么说」）时才在融合前各留一份，让每本书平等竞争。

3. **`low_confidence` 是一等公民**。检索没把握时上层必须走"课本里没找到"的兜底话术，
   而不是把无关片段塞给模型让它编。这一条直接决定用户信不信这个产品。
"""

from __future__ import annotations

import re
import time
from dataclasses import dataclass, field

from . import fusion
from .embed import describe as embed_describe, doc_text, embed
from .rerank import Reranker
from .tokenize import normalize, query_tokens
from .vector import VectorIndex

_SNIP = 260
DEFAULT_PRIOR = {"textbook": 1.0, "outline": 0.72, "past_paper": 0.68, "campus_info": 0.85}


@dataclass
class SearchHit:
    doc_idx: int
    chunk_id: str
    score: float
    norm: float
    paths: list[str]
    ranks: dict
    snippet: str
    rerank: float = 0.0            # 精排分：和 norm 不是一个量纲，没开精排就是 0

    def as_dict(self) -> dict:
        out = {"chunk_id": self.chunk_id, "score": round(self.score, 6), "norm": round(self.norm, 4),
               "paths": self.paths, "ranks": self.ranks, "snippet": self.snippet}
        if self.rerank:
            out["rerank"] = round(self.rerank, 4)   # 只在开了精排时出现：老字段一个不动
        return out


@dataclass
class SearchReport:
    query: str
    hits: list[SearchHit] = field(default_factory=list)
    paths: list[str] = field(default_factory=list)
    coverage: float = 0.0
    low_confidence: bool = False
    reasons: list[str] = field(default_factory=list)
    elapsed_ms: float = 0
    filters: dict = field(default_factory=dict)
    # terms = 本次真正用上的规范术语；dropped_terms = 模型给了但本库没有这种说法（被闸门丢掉）
    terms: list[str] = field(default_factory=list)
    dropped_terms: list[str] = field(default_factory=list)
    excluded: int = 0                 # exclude= 传进来时，实际从候选池摘掉的条数

    def as_dict(self) -> dict:
        return {"query": self.query, "paths": self.paths, "coverage": round(self.coverage, 3),
                "low_confidence": self.low_confidence, "reasons": self.reasons,
                "elapsed_ms": self.elapsed_ms, "filters": self.filters,
                "terms": self.terms, "dropped_terms": self.dropped_terms,
                "excluded": self.excluded,
                "hits": [h.as_dict() for h in self.hits]}


# 疑问与口语功能词：它们"没在课本里出现过"完全正常，不能当成"这门课没喂"的证据
_FUNCTION = {"有没有","是不是","能不能","可不可以","怎么样","怎么办","为什么","是什么","什么时候","哪些","哪个","多少","分别","各自","到底","大概","大约","别的","其他","一下","不行","可以吗","举例","一下呢"}


def _is_split_artifact(term: str, df_of) -> bool:
    """去掉**一个边上的字**之后，剩下那截是不是本库认识的词。

    分词器切错的产物长这样：`定积分换元` → `积分换`（去掉尾字=积分，df 2046）、
    `这类题`（去掉尾字=这类，df 4）。而真没喂的概念不是这样：
    `子网划分` 去掉任一边是 `子网划`/`网划分`，两个都不在库里（df=0），
    虽然 `子网`、`划分` 各自都出现过 —— 拿"任一二字片段出现过"当豁免，
    这条就会漏（实测：删掉假提纲之后 `子网划分的可用主机数怎么算` 被高数第 1 章
    硬接了，因为它命中了 `数`/`算` 两个字）。要豁免的只有"差一格"这一种。
    """
    return len(term) >= 3 and (df_of(term[1:]) > 0 or df_of(term[:-1]) > 0)


def unknown_terms(qterms: list, df_of) -> list:
    """查询词里**本库一次都没出现过、三个字以上、又不是疑问功能词**的说法。

    四个条件缺一不可，每一条都是被误拒案例逼出来的：
      · 必须 df==0 —— 否则「缺页次数」「B+树」这种**库里明明有**的词也会被当成没喂；
      · 必须 >=3 字 —— 两个字的口语词（浪费、先学、参考）遍地都是，放过才不误伤；
      · 必须排除疑问功能词 —— 「有没有」也三个字，但它没出现过完全正常；
      · 必须连"差一格"的形态都不是（见 `_is_split_artifact`）—— 分词器造出来的假词
        不能当"没喂这门课"的证据：`积分换`（去尾字=积分）、`这类题`（去尾字=这类）
        是该豁免的；`神经网络`/`贝叶斯`/`发明者`/`子网划分` 砍掉任一边都不成立，照旧拦。
    换成真语义 embedding 之后这条可以放宽到两个字，那时语义路自己能分辨。
    """
    return [t for t in qterms
            if len(t) >= 3 and t not in _FUNCTION and df_of(t) == 0
            and not _is_split_artifact(t, df_of)]

    

def _snippet(text: str, qterms: list[str]) -> str:
    """围绕命中词开窗，而不是截前 260 字 —— 最相关的句子经常不在开头。"""
    if len(text) <= _SNIP:
        return text
    low = text.lower()
    pos = -1
    for t in qterms:
        if len(t) < 2:
            continue
        p = low.find(t)
        if p >= 0:
            pos = p
            break
    if pos < 0:
        return text[:_SNIP] + "…"
    start = max(0, pos - _SNIP // 3)
    end = min(len(text), start + _SNIP)
    return ("…" if start else "") + text[start:end] + ("…" if end < len(text) else "")



_VEC_CACHE: dict[tuple, object] = {}


def _align_vectors(store, embed_cfg: dict | None) -> None:
    """把 `store.vec` 换成**和当前配置同一个向量空间**的索引（就地改，带进程内缓存）。

    为什么非要有这一步：`doc_vecs.f32` 是一坨裸 float32，`VectorIndex.load` 只校验
    「字节数 == 片数 × 维度 × 4」。hash 512 维和真语义模型 512 维**字节数一模一样**，
    加载不会报错，于是查询向量是 A 空间、文档向量是 B 空间，算出来的"余弦"是噪声 ——
    表现为第二条腿悄悄把无关片段顶进前三，分数掉下来还查不出原因。

    三种情况按"能不能自己修好"分：
      · 两边同源 → 什么都不做（生产路径；每次 search 只多几次字符串比较）；
      · 配置要 hash → 本地重算。确定性、免费、实测 23,519 片 15 秒，按语料指纹缓存，
        单测因此可以永远跑离线向量，不必连外网；
      · 配置要外部模型 → **抛错**。启动时偷偷调接口重建 46 MB 索引是要花钱的事，
        那属于 `python -m kb.build`，必须有人显式跑一次。
    """
    meta = getattr(store, "meta", None) or {}
    if store.vec is None:
        return                      # 向量文件缺失/尺寸不符：早就是单路 BM25，这里不新增故障
    cfg = embed_cfg or {}
    provider = cfg.get("provider", "hash")
    want_dim = int(cfg.get("dim", 0) or 0)
    got_dim = int(meta.get("embed_dim", 0) or 0)
    got_provider = meta.get("embed_provider") or "hash"
    # hash 没有"模型名"这个概念，两边都当空串比，否则老索引的 model:"" 会被判成不同源
    # 配置这一侧的名字必须问 embed.describe()：provider=onnx 时配置里的 model 是服务商的，
    # 和实际建向量用的本地权重不是一个东西。
    want_model = "" if provider == "hash" else (embed_describe(cfg)["model"] or "")
    got_model = "" if got_provider == "hash" else (meta.get("embed_model") or "")

    same = (got_provider == provider and got_model == want_model
            and (not want_dim or not got_dim or want_dim == got_dim))
    if same:
        return
    if provider != "hash":
        raise RuntimeError(
            f"索引里的向量是 {got_provider}:{got_model or '-'}（{got_dim} 维），"
            f"配置要的是 {provider}:{want_model or '-'}（{want_dim or '?'} 维）—— "
            f"两个向量空间不能混用。改完 config/retrieval.json 的 embedding 之后"
            f"要重跑：python -m kb.build")
    dim = want_dim or got_dim or 256
    key = (store.index_dir, store.bm25.n_docs, dim)
    if key not in _VEC_CACHE:
        t0 = time.perf_counter()
        mat = embed([doc_text(c) for c in store.chunks], {"provider": "hash", "dim": dim},
                    df_of=store.bm25.df, n_docs=store.bm25.n_docs)
        _VEC_CACHE[key] = VectorIndex(mat)
        print(f"[embed] 索引是 {got_provider} 空间、配置要 hash：已按当前语料重算 "
              f"{len(store.chunks)} 片向量，{int((time.perf_counter() - t0) * 1000)} ms"
              f"（进程内缓存，只此一次）")
    store.vec = _VEC_CACHE[key]


class SearchEngine:
    def __init__(self, store, cfg: dict | None = None):
        cfg = cfg or {}
        self.store = store
        self.cfg = cfg
        self.deep = int(cfg.get("deep", 80))
        self.per_book = int(cfg.get("per_book", 3))
        self.top_k = int(cfg.get("top_k", 5))
        self.rrf_k = int(cfg.get("rrf_k", fusion.RRF_K))
        self.min_norm = float(cfg.get("min_norm", 0.30))
        self.min_coverage = float(cfg.get("min_coverage", 0.2))
        self.min_cos = float(cfg.get("min_cos", 0.10))
        self.rare_df_ratio = float(cfg.get("rare_df_ratio", 0.2))
        self.embed_cfg = cfg.get("embedding", {"provider": "hash", "dim": 256})
        self.weights = cfg.get("weights", {"bm25": 1.0, "vector": 1.0})
        # 向量空间核对：索引里那 46 MB 到底是不是配置说的那个模型算出来的
        _align_vectors(store, self.embed_cfg)
        self._vec = store.vec
        # 配置里以 _ 开头的是注释键（_说明 / _换成真模型），不能被当成数值读进来
        prior = {k: float(v) for k, v in (cfg.get("source_prior") or {}).items()
                 if not k.startswith("_") and isinstance(v, (int, float))}
        self.prior = {**DEFAULT_PRIOR, **prior}
        self.reranker = Reranker(cfg.get("rerank", {"provider": "none"}))
        self.rerank_candidates = int(cfg.get("rerank_candidates", 12))

    # ---------- 过滤：多科靠 filter，不靠前置强制分类 ----------
    def _allowed(self, course: str | None, source_type: str | None, book: str | None) -> set[int]:
        out = set()
        for i, c in enumerate(self.store.chunks):
            if course and course not in (c.get("course") or ""):
                continue
            if source_type and source_type != "all" and c.get("source_type", "textbook") != source_type:
                continue
            if book and c.get("book") != book:
                continue
            out.add(i)
        return out

    def _quota(self, order: list[int], cap: int, k: int) -> list[int]:
        """按书限流 + 回填：既防厚书包圆，又不牺牲同书内的次序。"""
        if cap <= 0:
            return order[:k]
        used: dict[str, int] = {}
        picked, rest = [], []
        for d in order:
            b = self.store.book_of(d)
            if used.get(b, 0) < cap:
                used[b] = used.get(b, 0) + 1
                picked.append(d)
            else:
                rest.append(d)
        return (picked + rest)[:k]

    # ---------- 主入口 ----------
    def _gate_terms(self, terms, qterms_raw: list[str]) -> tuple[list[str], list[str]]:
        """把模型给的规范术语过一道**真值闸门**，分成「本库认」和「本库不认」两堆。

        这一步是代码强制的，不靠提示词自觉：模型幻觉出来的词在本库倒排里 df==0，
        直接丢掉。学霸哥.md 里"不许用记忆补"这条规矩，落到检索层就是这里。
        用户自己已经说过的词不重复加（否则等于给那个词加权两次，会偷偷改变排序）。

        三种形态都要认，每一条都是刚才实测出来的：
          ① `缺页` 本身就是索引里的词，直接用；
          ② `B+树` 书上确实这么写，但查 df 前得先过 normalize()，否则大小写/符号形态会被误杀；
          ③ `单调有界` / `夹逼` 成不了一个词（分词器会切），退回去按成分查，
             只留**每个成分都在库里出现过**的；成分也凑不出来时，找**包含它的**索引词
             （`夹逼` → `夹逼定理`）捞最后一次，命中最短的那个。
        单个字和标点不算成分，否则等于往查询里灌噪声。用户自己已经说过的词不重复加
        （加权两次会偷偷改变排序），也不因此被算成"库里没有这种说法"。

        **没有加"判别力"上限，因为实测证明它是个假旋钮**：本库只有 8,098 片，
        连「极限」都只出现在 580 片里（7%），`rare_df_ratio=0.2` 那道墙（1,619 片）
        一条都拦不住。第一次离线跑（12 条真模型给的 terms）想拿它滤掉
        「准则/测试/方式/存在」这类口水词，实测 df 分别只有 53/1/21/303 —— 全在墙内，
        一行死代码。真正的风险也不是"词太常见"：「黑盒测试」被补成「等价类划分」时，
        `等价` 在数学里只出现 17 次，够稀有了，照样把微积分的页拽进来。
        拦得住这件事的是语料覆盖和"没资料就明说"，不是阈值。见 README §10。
        """
        cap = int(self.cfg.get("rewrite_max_terms", 4))
        df = self.store.bm25.df
        postings = self.store.bm25.postings
        known = set(qterms_raw)
        accepted: list[str] = []
        dropped: list[str] = []
        for raw_term in (terms or []):
            term = normalize(str(raw_term).strip())
            if not term:
                continue
            if df(term) > 0:
                pieces = [term]
            else:
                pieces = [t for t in query_tokens(term)
                          if (len(t) >= 2 or t.isascii()) and df(t) > 0]
                if not pieces:
                    longer = sorted((t for t in postings if term in t), key=len)
                    pieces = longer[:1]
            if not pieces:
                if term not in dropped:
                    dropped.append(term)              # 本库确实没这种说法
                continue
            fresh = [p for p in pieces if p not in known]
            if not fresh:
                continue                              # 用户自己已经这么写了，不重复加权
            for piece in fresh:
                if piece not in accepted and len(accepted) < cap:
                    accepted.append(piece)
        return accepted, dropped

    def _course_df(self, course: str | None):
        """df 的**课程内**版本。三门新教材入库后撞出来的洞：「神经网络」「页面置换」
        这类词在**别课**的书里也存在了（王珊书里真出现了"神经网络"四个字），全局 df 一放行，
        高数课名下的 CNN 问题就会被"卷积积分"的页硬接 —— §8 第 10 条说的"把两门课缝在一起
        瞎答"换了个入口复发。判"这门课没喂"从来就该看这门课的材料；course 为空时返回全局 df，
        行为与旧版逐字一致（无课查询的拒答上移到了 agent 的课程守卫，不在这里改）。
        课程文档集按索引指纹缓存，一次遍历，之后每词只是 postings 列表上的集合求交。"""
        st = self.store
        if not course:
            return st.bm25.df
        fp = getattr(st, "_fingerprint", None)
        cache = getattr(self, "_course_df_cache", None)
        if not cache or cache[0] != fp:
            cache = self._course_df_cache = (fp, {})
        docs = cache[1].get(course)
        if docs is None:
            docs = {i for i, c in enumerate(st.chunks) if c.get("course") == course}
            cache[1][course] = docs
        postings = st.bm25.postings

        def df(term: str) -> int:
            p = postings.get(term)
            if not p:
                return 0
            return sum(1 for d in p[0] if d in docs)
        return df

    def search(self, query: str, *, course: str | None = None, source_type: str | None = "textbook",
               book: str | None = None, top_k: int | None = None, per_book: int | None = None,
               cross_book: bool = False, use_vector: bool = True, use_prior: bool = True,
               extra_terms: list[str] | None = None, exclude: set[str] | None = None) -> SearchReport:
        t0 = time.perf_counter()
        st = self.store
        st.maybe_reload()
        if st.vec is not self._vec:        # 索引被热重载过：向量空间要重新核对
            _align_vectors(st, self.embed_cfg)
            self._vec = st.vec
        k = top_k or self.top_k
        cap = self.per_book if per_book is None else per_book
        rep = SearchReport(query=query, filters={"course": course, "source_type": source_type,
                                                 "book": book, "cross_book": cross_book})
        allowed = self._allowed(course, source_type, book)
        if not allowed:
            rep.low_confidence = True
            rep.reasons.append("该课程/资料类型下没有任何切片")
            rep.elapsed_ms = round((time.perf_counter() - t0) * 1000, 1)
            return rep
        if exclude:
            # 排除必须在**进榜之前**做。事后过滤（"先排好名次再把引用过的那几条删掉"）
            # 等于让已经用掉的片段白占坑：候选池本来就不大时，删完就空了 ——
            # "同类往年题"卡片就是这么变成 0 条的（2026-09-27 换成真向量后实测暴露）。
            drop = {idx for idx in (st.index_of(c) for c in exclude) if idx is not None}
            allowed = allowed - drop
            rep.excluded = len(drop)
            if not allowed:
                rep.low_confidence = True
                rep.reasons.append("排除已引用的片段后没有候选了")
                rep.elapsed_ms = round((time.perf_counter() - t0) * 1000, 1)
                return rep

        qterms_raw = query_tokens(query)
        if not qterms_raw:
            rep.low_confidence = True
            rep.reasons.append("问题里提不出可检索的词")
            rep.elapsed_ms = round((time.perf_counter() - t0) * 1000, 1)
            return rep
        # 归一术语只喂给 BM25 这一条腿。coverage 和 unknown_terms 两道闸门继续**只看用户原话**，
        # 否则模型补一个词就能把"这门课没喂"说成"喂过了"，那是最坏的自欺。
        # 向量路同样继续吃原话（hash embedding，换词只会引入字面噪声）。
        accepted, dropped = self._gate_terms(extra_terms, qterms_raw)
        qterms = qterms_raw + accepted
        rep.terms, rep.dropped_terms = accepted, dropped
        N = st.bm25.n_docs
        # rare = 有判别力且本库里存在的词；absent = 本库一次都没出现过的说法
        rare = [t for t in qterms if 0 < st.bm25.df(t) <= self.rare_df_ratio * N]
        absent = [t for t in qterms if len(t) >= 2 and st.bm25.df(t) == 0]

        # --- 路 1：BM25（字面） ---
        bm25_ranked = [d for d in st.bm25.rank(qterms) if d in allowed]
        rep.coverage = st.bm25.coverage(qterms_raw)
        if bm25_ranked:
            rep.paths.append("bm25")

        # --- 路 2：向量（语义，取决于 provider） ---
        vec_ranked: list[int] = []
        vector_error = None
        if use_vector and st.vec is not None:
            try:
                qv = embed([query], self.embed_cfg, df_of=st.bm25.df, n_docs=st.bm25.n_docs)[0]
                vec_ranked = [d for d, cos in st.vec.rank(qv, top=self.deep * 4)
                              if d in allowed and cos > self.min_cos]
                if vec_ranked:
                    rep.paths.append("vector")
            except Exception as exc:                    # noqa: BLE001 - 单路挂了不能带崩整条链
                vector_error = str(exc)[:200]

        if not bm25_ranked and not vec_ranked:
            rep.low_confidence = True
            rep.reasons.append("两路都没有任何命中")
            rep.elapsed_ms = round((time.perf_counter() - t0) * 1000, 1)
            return rep

        # --- 榜单：cross_book 才在融合前按书截断 ---
        lists = {}
        if bm25_ranked:
            lists["bm25"] = (fusion.per_book_cap(bm25_ranked[: self.deep], lambda d: st.book_of(d), cap)
                             if cross_book else bm25_ranked[: self.deep])
        if vec_ranked:
            lists["vector"] = (fusion.per_book_cap(vec_ranked[: self.deep], lambda d: st.book_of(d), cap)
                               if cross_book else vec_ranked[: self.deep])

        # 类型先验只在混合检索（source_type=all）时生效；调用方已经指定类型就说明它知道要什么
        # `use_prior=False` 是给复习规划用的：先验回答的是"这问题想要哪类资料"，
        # 而 §2.4 恰恰**只想要**提纲和往年卷，压它们等于把这门课的考纲压没（真题入库后实测
        # plan-exam 就是这么掉的：前三名被 db19201a/ds1 占住，统计表 map-sda 排第 3 险进）。
        prior_of = None
        if use_prior and source_type in (None, "all"):
            prior_of = lambda d: self.prior.get(st.doc(d).get("source_type", "textbook"), 1.0)
        fused = fusion.rrf(lists, k=self.rrf_k, weights=self.weights, prior_of=prior_of)
        ranks = fusion.rrf_ranks(lists)
        ceiling = fusion.theoretical_max(len(lists), self.rrf_k)
        order = fusion.rank_by_score(fused)

        # 精排必须在**候选池**上做、并且排在分库配额之前。老写法是先截到 top-k 再精排，
        # 等于只允许这 k 条互相换手，第 k+1~12 名永远进不来 —— "精排没有增益"就是这么来的。
        def _mk(d: int) -> SearchHit:
            c = st.doc(d)
            return SearchHit(
                doc_idx=d, chunk_id=c["id"], score=fused[d], norm=min(1.0, fused[d] / ceiling),
                paths=[n for n in lists if n in ranks.get(d, {})],
                ranks=dict(ranks.get(d, {})),
                snippet=_snippet(c.get("text", ""), qterms))

        if self.reranker.enabled():
            pool = [_mk(d) for d in order[: max(k, self.rerank_candidates)]]
            pool = self.reranker.apply(query, pool, lambda h: st.doc(h.doc_idx).get("text", ""), top_k=k)
            chosen = self._quota([h.doc_idx for h in pool], 0 if cross_book else cap, k)
            by_idx = {h.doc_idx: h for h in pool}
            rep.hits = [by_idx[d] for d in chosen]
        else:
            rep.hits = [_mk(d) for d in self._quota(order, 0 if cross_book else cap, k)]

        # --- 判据：没把握就明说 ---
        best = rep.hits[0] if rep.hits else None
        rare_hit = bool(best is not None and rare) and any(
            t in st.bm25.postings and best.doc_idx in st.bm25.postings[t][0] for t in rare)
        if best is None:
            rep.low_confidence = True
            rep.reasons.append("无候选")
        else:
            if best.norm < self.min_norm and rep.coverage < self.min_coverage:
                rep.low_confidence = True
                rep.reasons.append(f"最好一条只到满分 {best.norm:.0%}，且问题只有 {rep.coverage:.0%} 的词在库里出现过")
            elif len(best.paths) < 2 and rep.coverage < self.min_coverage:
                # 只有一条路命中时，norm 会被 RRF 自己顶成 1.0（它就是那条路的满分），
                # 所以**不能**拿 norm 当判据 —— 得看查询词到底在库里出现了多少。
                rep.low_confidence = True
                rep.reasons.append(f"只有一条路命中，且问题只有 {rep.coverage:.0%} 的词在库里出现过")
            elif len(best.paths) < 2 and len(rep.hits) == 1:
                rep.low_confidence = True
                rep.reasons.append("单路且只捞出 1 条候选，证据太薄")
            elif rare and not rare_hit:
                # 只靠「使用 / 条件 / 什么 / 怎么」这类常见词撑起来的命中 = 没有命中。
                # 这是"绝不硬答"最重要的一道闸门：没有它，库里没有的话题也会被虚词
                # 拽出高分（实测「洛必达法则的使用条件」会命中操作系统的死锁那两片）。
                rep.low_confidence = True
                rep.reasons.append("只命中了常见词，问题里的专有词在本库里一次都没出现过")
            else:
                unk = unknown_terms(qterms_raw, self._course_df(course))
                if unk:
                    rep.low_confidence = True
                    where = f"《{course}》的资料" if course else "本库"
                    rep.reasons.append(where + "里从没出现过「" + "」「".join(unk) + "」这种说法，这门课大概还没喂")
        if vector_error:
            rep.reasons.append("向量路本次不可用：" + vector_error)
        if rep.coverage == 0.0 and not rep.low_confidence:
            rep.reasons.append("问题字面全不命中，靠语义路捞回")
        rep.elapsed_ms = round((time.perf_counter() - t0) * 1000, 1)
        return rep

    # ---------- 跨教材对比：按书分组 ----------
    def group_by_book(self, report: SearchReport) -> dict[str, list[SearchHit]]:
        out: dict[str, list[SearchHit]] = {}
        for h in report.hits:
            book = self.store.doc(h.doc_idx).get("book") or "未署名"
            out.setdefault(book, []).append(h)
        return out

    def lookup(self, chunk_id: str) -> dict | None:
        return self.store.by_id(chunk_id)
