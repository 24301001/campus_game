r"""复习规划要回答「哪章是重点」，可库里从来没有一份**章级**的数字。

之前只能靠模型看题型—分值表（map-*）自己推"哪章重点"，而那张表按**题型**统计、
不按章 —— 章节顺序它讲得出（教材目录就在检索结果里），"哪章占的分多"讲不出，
讲出来也是编的。这个模块补的就是那一步：**数数由代码算，模型只把表讲成人话**
（和 kb/papermap.py 同一个分工，那边的依据也在那边写着）。

和 papermap 不同的一点：这张表**请求时现算**，不落成新语料。落成 .md 就要重建索引，
而现在索引在 api 向量空间里（`kb.build` 全量重扫 = 23 519 次调用、约 260 万 token），
更要命的是语料换了不重算表就会**过期** —— 学生照着过期的重点复习比没有更糟。
切片元数据里 course/book/chapter/section/page 都是现成的（`kb/chunk.py` 的标题栈），
扫一遍不到 50 ms，重建索引之后第二天它自己就是新的。

诚实口径写死在表格抬头里：**这是结构密度，不是考试分值**。
"定义/定理"出现得多，只说明概念多，不保证卷面就考它；有往年卷统计的课，
优先级以分值表为准。章号是从章标题的正则里归一的（OCR 把有的书切成了节级标题，
实测《大学物理(上)》的 chapter 有 157 种、《微积分下册》只有 8 种），
归不了章的碎片汇进「未归章」一行如实报数，不进排名 —— 宁可少统计，不许错归。
"""

from __future__ import annotations

import re
from collections import Counter, defaultdict

# 章号只认两种写法，都是从真语料的 chapter/section 里归纳的：
#   · 「第8章 多元函数…」「第 2 章」—— 阿拉伯或中文数字都行
#   · 「1.1 的概念」「12-1-3 热力学…」「8.3 …」—— 行首的「节级编号」取第一段当章号
# 行首编号设了上限（≤24 章）并且要求后面跟分隔符，免得水印行「2020学习资源…」被当成第 20 章。
_CHAP_RE = re.compile(r"第\s*([0-9０-９一二三四五六七八九十百]{1,4})\s*章")
# 行首编号**必须再跟一个数字**才算节级编号（「12-1-3」「8.3」「1.1 随机事件」）——
# 实测不带这条时，《大物下册》的列表标题「1. 熵与能量」「4. 范德瓦耳斯键」被当成
# 第 1、4 章，页码落在第 13、20 章的地盘上，表上就是白纸黑字的假章节。
_LEAD_RE = re.compile(r"^([0-9]{1,2})\s*[.．、\-–]\s*[0-9０-９]")

_CN = {"零": 0, "〇": 0, "一": 1, "二": 2, "三": 3, "四": 4, "五": 5, "六": 6,
       "七": 7, "八": 8, "九": 9, "十": 10, "百": 100}

# 关键词计数就数**字面出现次数**，不玩语义 —— 表上每个数都能用 Ctrl+F 在原文里核对。
# 「例题｜例 3.2」两类写法都算例题；习题/练习/思考题算一处习题类。
_MARKS = {
    "定义": re.compile(r"定义"),
    "定理": re.compile(r"定理|推论"),
    "例题": re.compile(r"例题|例\s*[0-9０-９]"),
    "习题": re.compile(r"习题|练习|思考题"),
}

_MAX_ROWS_PER_BOOK = 16        # 章号归一之后还超过 16 章的书，多半是标题层级没救回来，截断并说明


def _cn2int(s: str) -> int | None:
    s = s.strip().translate(str.maketrans("０１２３４５６７８９", "0123456789"))
    if s.isdigit():
        n = int(s)
        return n if 1 <= n <= 24 else None
    if not s or any(ch not in _CN for ch in s):
        return None
    if s.startswith("十"):
        return 10 + (sum(_CN.get(ch, 0) for ch in s[1:])) if len(s) > 1 else 10
    if "十" in s:
        a, b = s.split("十", 1)
        return (_CN.get(a, 1) if a else 1) * 10 + (sum(_CN.get(ch, 0) for ch in b) if b else 0)
    n = 0
    for ch in s:
        n = n * 10 + _CN[ch] if len(s) > 1 else _CN[ch]
    return n if 1 <= n <= 24 else None


def chapter_no(chunk: dict) -> int | None:
    """这片属于第几章。先看 chapter 再看 section，谁里有章号用谁。"""
    for field in ("chapter", "section"):
        title = (chunk.get(field) or "").strip()
        if not title:
            continue
        m = _CHAP_RE.search(title)
        if m:
            n = _cn2int(m.group(1))
            if n:
                return n
        m = _LEAD_RE.match(title)
        if m and int(m.group(1)) <= 24:
            return int(m.group(1))
    return None


def _book_label(book: str) -> str:
    """《微积分(上册·第2版) 刘迎东 …》->「微积分(上册·第2版)」：只砍作者那截尾巴，
    括号里的上/下册必须留着 —— 留着它，高数上下册才是两行，不然 11 张章行挤在
    同一个书名号下，页码区间从每本书内部数起，看上去就是"第1章 3~290 页"这种鬼话。"""
    head = (book or "").split(" ")[0].split("\u3000")[0]
    return head[:22] or (book or "")[:22]


def _scan(chunks: list[dict]) -> list[dict]:
    """每本教材按**文档序**（chunks.jsonl 里同书连续 = 源文件顺序）把同一章号的
    连续段归成行；正文里合法的同章号续段（图版/表格页打断后接着讲）并进主段，
    书末「习题答案」那种重开一遍章号的部分**不并**：它会把页码区间拖到几百页外，
    密度也在数答案页的字 —— 判据是尺寸和位置，见内联注释。
    """
    by_book: dict[str, list[dict]] = defaultdict(list)
    for idx, c in enumerate(chunks):
        by_book[c.get("book", "")].append(c)

    rows: list[dict] = []
    for book, bc in by_book.items():
        runs: list[tuple[int, list[dict]]] = []      # (章号, 连续片段)
        for c in bc:
            no = chapter_no(c)
            if runs and runs[-1][0] == no:
                runs[-1][1].append(c)
            else:
                runs.append((no, [c]))
        groups: dict[int, list[list[dict]]] = defaultdict(list)
        for no, rc in runs:
            groups[no].append(rc)

        stray_chunks = 0
        stray_chars = 0
        for no, rs in groups.items():
            if no is None:
                stray_chunks += sum(len(r) for r in rs)
                stray_chars += sum(c.get("chars") or len(c.get("text", "")) for r in rs for c in r)
                continue
            rs.sort(key=lambda r: -len(r))
            main = rs[0]
            lo = min((c["page"] for c in main if c.get("page")), default=0)
            hi = max((c["page"] for c in main if c.get("page")), default=0)
            merged = [main]
            for r in rs[1:]:
                size_ok = len(r) >= 0.25 * len(main)
                pos_ok = all((not c.get("page")) or c["page"] <= hi + 10 for c in r)
                if size_ok and pos_ok:               # 紧跟着的续段：打断后接着讲，并进来
                    merged.append(r)
                    rhi = max((c["page"] for c in r if c.get("page")), default=0)
                    hi = max(hi, rhi)
                else:                                # 书深处重开的章号（习题答案/重现书眉）
                    stray_chunks += len(r)
                    stray_chars += sum(c.get("chars") or len(c.get("text", "")) for c in r)
            inc = [c for r in merged for c in r]
            # 标题：有「第N章 …」这种全名就用全名（按出现次数取最长）；通篇只有节级
            # 编号的书（大物是 1-1-1 这种），取**该章第一段**的标题当名头，比按词频
            # 挑中段某个小节准。
            titles_list = [(c.get("chapter") or "").strip() for c in inc if (c.get("chapter") or "").strip()]
            title = ""
            if titles_list:
                zhang = [t for t in titles_list if "章" in t]
                if zhang:
                    title = sorted(Counter(zhang).items(), key=lambda kv: (-kv[1], -len(kv[0])))[0][0]
                else:
                    title = titles_list[0]
            pages = [c["page"] for c in inc if c.get("page")]
            marks: Counter = Counter()
            for c in inc:
                for name, rx in _MARKS.items():
                    marks[name] += len(rx.findall(c.get("text", "")))
            rows.append({
                "book": book, "no": no, "title": title,
                "chunks": len(inc),
                "chars": sum(c.get("chars") or len(c.get("text", "")) for c in inc),
                "page_lo": min(pages) if pages else lo,
                "page_hi": max(pages) if pages else hi,
                "marks": dict(marks), "density": sum(marks.values()),
            })
        # 封面/前言/总习题（无章号）+ 被剔除的同章号重开段，合成一条「其他」行
        rows.append({"book": book, "no": None, "title": "", "chunks": stray_chunks,
                     "chars": stray_chars, "page_lo": 0, "page_hi": 0,
                     "marks": {}, "density": 0})
    rows.sort(key=lambda r: (_book_label(r["book"]), (r["no"] is None, r["no"] or 0)))
    return rows


def _fmt_marks(marks: dict) -> str:
    return " ".join(f"{k}{marks[k]}" for k in ("定义", "定理", "例题", "习题") if marks.get(k))


def render(rows: list[dict], course: str) -> str:
    """表 + 口径 + 排名行。排名只用表里的数，不引入新算法。"""
    books: dict[str, list[dict]] = defaultdict(list)
    for r in rows:
        books[_book_label(r["book"])].append(r)
    lines = [f"【章节结构统计·{course}】（程序从教材切片现算，页码可核对；"
             "口径是**结构密度**（概念/例题/习题的字面次数与篇幅），**不是考试分值**"
             "——该课若有真题题型—分值统计，复习优先级以分值表为准，本表只用于「先翻哪章」】"]
    for label, brows in books.items():
        named = [r for r in brows if r["no"] is not None]
        rest = [r for r in brows if r["no"] is None]
        total_c = sum(r["chunks"] for r in brows)
        lines.append(f"《{label}》共 {len(named)} 章 / {total_c} 片：")
        for r in named[:_MAX_ROWS_PER_BOOK]:
            name = (r["title"] or f"第{r['no']}章").strip()[:24]
            pages = f"第{r['page_lo']}~{r['page_hi']}页" if r["page_lo"] else "页码未标"
            mark = _fmt_marks(r["marks"])
            lines.append(f"  第{r['no']}章 {name} ｜ {pages} ｜ {r['chunks']}片/{round(r['chars'] / 10000, 1)}万字"
                         + (f" ｜ {mark}" if mark else ""))
        if len(named) > _MAX_ROWS_PER_BOOK:
            lines.append(f"  （其余 {len(named) - _MAX_ROWS_PER_BOOK} 章未列，该书章标题层级异常，别据此排重点）")
        if rest and sum(r["chunks"] for r in rest):
            rc = sum(r["chunks"] for r in rest)
            rr = sum(r["chars"] for r in rest)
            lines.append(f"  未归章与被剔除片段：{rc} 片/{round(rr / 10000, 1)} 万字"
                         "（封面/前言/总习题这类无章号内容，加上书末重开章号的习题答案区，不进区间和排名）")
    ranked = [r for r in rows if r["no"] is not None]
    hot = sorted(ranked, key=lambda r: -r["density"])[:3]
    if hot and hot[0]["density"] > 0:
        lines.append("概念密度最高：" + "、".join(
            f"{_book_label(r['book'])}第{r['no']}章({r['density']}次)" for r in hot if r["density"] > 0))
    longest = sorted(ranked, key=lambda r: -r["chars"])[:3]
    if longest:
        lines.append("篇幅最大：" + "、".join(
            f"{_book_label(r['book'])}第{r['no']}章({round(r['chars'] / 10000, 1)}万字)" for r in longest))
    return "\n".join(lines)


def plan_block(chunks: list[dict], course: str | None) -> str:
    """给 makeStudyPlan 的注入块。三种情形：
      · 课程为空 —— 返回空串（模型本来就在含糊，别硬塞一张表）；
      · 这门课有教材切片 —— 渲染统计表；
      · 这门课**没有**教材（只有往年卷/提纲）—— 返回一句明说「无从算起」，
        模型据此告诉学生章节密度算不了、只能给题型分值那条路，而不是编一章出来。
    """
    if not course:
        return ""
    mine = [c for c in chunks if c.get("course") == course]
    if not mine:
        return ""
    tb = [c for c in mine if c.get("source_type") == "textbook"]
    if not tb:
        have = Counter(c.get("source_type", "") for c in mine)
        got = "、".join(f"{k} {v} 片" for k, v in sorted(have.items()) if k)
        return (f"【章节结构统计·{course}】这门课库里**没有教材切片**（只有：{got or '无'}），"
                "章节密度无从算起 —— 不要编造「第几章重点」，只能力求把已有资料讲清楚，"
                "并说明想要章级建议得先喂这本教材的电子版。")
    return render(_scan(tb), course)
