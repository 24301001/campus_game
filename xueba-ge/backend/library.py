r"""资料库面板 + 下载 —— 组长 2026-09-28 口径：「按年级划分资料数据」「数据库可视化面板」。

两条设计决定：

· **数据全部现算**（store.chunks + config/corpus.json 对账单），不落新文件。
  面板显示的必须是"库里现在真有什么"，抄一份静态清单迟早和索引对不上 ——
  对不上的面板比没有面板更坏（它会被当成承诺）。
· **下载走白名单**：能下的只有 corpus.json 里登记过的 PDF 和 kb/sources 下的 .md，
  并且 resolve 之后必须仍在 教材/试卷/kb/sources 三棵根里。
  路径穿越是这类接口最常见的死法（`?id=../../data/.secret` 一下就把 token 密钥发了），
  所以校验放在**拼路径之后、打开文件之前**，且 `tests/test_library.py` 专门演武。
  整本教材可下载 = 版权口径从"本机自测"变成"可传播"。组长文档 §13 第 7 条本来就挂着
  这条待确认，现按"校内作业演示"口径开启，**公网部署前必须关掉**（README §10 记了）。

年级归属是**暂口径**（按计算机专业常见排课猜的），培养方案一到手就照表改
`config/corpus.json` 的「课程年级」—— 代码里没有第二份年级表。
"""

from __future__ import annotations

import os
import re

from .settings import ROOT

# 下载允许的根。2026-09-30：试卷**进了仓库**（`试卷/`，37MB 校本资料），对账单里的
# 路径也从 E:\ 绝对改成相对 —— 组长 clone 下来不用改一行就能点「原件」。
# 教材不进仓库（网盘分享，见「网盘分享」），但旧绝对路径根仍留着：这台开发机上
# 重灌教材的离线管道（kb/extract / run_ocr.ps1）还指着它，删了会把入库链弄断。
MATERIAL_ROOTS = [
    os.path.join(ROOT, "试卷"),
    os.path.join(ROOT, "教材"),
    os.path.join(os.path.dirname(ROOT), "教材"),
    os.path.join(os.path.dirname(ROOT), "试卷"),
    os.path.join(ROOT, "kb", "sources"),
]
_ID_RE = re.compile(r"^[A-Za-z0-9][A-Za-z0-9._-]*$")   # 不许有 / \ .. —— 连构路径的资格都不给
DEFAULT_GRADE = "未分级"
_TYPE_LABEL = {"textbook": "教材", "outline": "提纲/统计", "past_paper": "真题", "campus_info": "校园"}


def _grade_map(corpus: dict) -> dict:
    return {k: v for k, v in (corpus.get("课程年级") or {}).items() if not k.startswith("_")}


def build_payload(chunks: list[dict], corpus: dict) -> dict:
    """面板的整包数据：全局统计 + 按年级分组的课程卡片。

    给组长/学生看的单位是**页和字**（"片/chunk"是检索内部单位，面板上不说）：
    页数 = 该书出现过的不同页码数（页锚点是 OCR 时逐页打的，数页码=数原书页数）；
    没有页码的资料（自动统计表这类）退回按字数展示。
    """
    per: dict[str, dict] = {}
    for c in chunks:
        course = c.get("course") or "未分类"
        row = per.setdefault(course, {
            "course": course, "chunks": 0, "chars": 0, "books": {}, "types": {}})
        row["chunks"] += 1
        row["chars"] += c.get("chars") or len(c.get("text", ""))
        bk = row["books"].setdefault(c.get("book", ""), {"book": c.get("book", ""),
                                                         "book_id": c.get("book_id", ""),
                                                         "source_type": c.get("source_type", "textbook"),
                                                         "chunks": 0, "chars": 0, "_pages": set()})
        bk["chunks"] += 1
        bk["chars"] += c.get("chars") or len(c.get("text", ""))
        if c.get("page"):
            bk["_pages"].add(c["page"])
        st = c.get("source_type", "textbook")
        row["types"][st] = row["types"].get(st, 0) + 1

    grades = _grade_map(corpus)
    # 对账单里登记过、但库里零切片的课也要露面（面板的价值恰恰是让人看见缺口）
    known_courses = {e.get("course") for e in corpus.get("语料", [])} | {
        e.get("course") for e in (corpus.get("已停用") or {}).get("语料", [])}
    for course in known_courses:
        if course and course not in per:
            per[course] = {"course": course, "chunks": 0, "chars": 0, "books": {}, "types": {}}

    pdf_by_id = {e.get("book_id"): (e.get("PDF") or "") for e in corpus.get("语料", [])}
    type_by_id = {e.get("book_id"): e.get("source_type", "") for e in corpus.get("语料", [])}
    md_ids = {e.get("book_id") for e in corpus.get("语料", []) if e.get("book_id")}
    share = corpus.get("网盘分享") or {}

    groups: dict[str, list[dict]] = {}
    for course, row in per.items():
        grade = grades.get(course, DEFAULT_GRADE)
        books = sorted(row["books"].values(), key=lambda b: (b["source_type"], -b["chunks"]))
        for b in books:
            b["pages"] = len(b.pop("_pages"))
            # 教材原件 2026-09-29 起不再从本机发（版权口径降级）：面板改挂「网盘」外链。
            # 往年卷是学校自己的题，原件仍走本地下载。
            b["download_pdf"] = (bool(pdf_by_id.get(b["book_id"]))
                                 and b["source_type"] != "textbook")
            b["share_url"] = share.get("url", "") if b["source_type"] == "textbook" else ""
            b["download_md"] = b["book_id"] in md_ids and os.path.exists(
                os.path.join(ROOT, "kb", "sources", f"{b['book_id']}.md"))
        have = {k: v for k, v in row["types"].items()}
        gaps = []
        if not have.get("textbook"):
            gaps.append("零教材")
        if not have.get("past_paper"):
            gaps.append("无往年卷")
        groups.setdefault(grade, []).append({
            "course": course, "grade": grade, "chunks": row["chunks"], "chars": row["chars"],
            "pages": sum(b["pages"] for b in books),
            "types": have, "books": books, "gaps": gaps,
        })
    order = ["大一", "大二", "大三", "大四", DEFAULT_GRADE, "其他"]
    by_grade = [{"grade": g, "courses": sorted(groups[g], key=lambda r: -r["chunks"])}
                for g in sorted(groups, key=lambda x: order.index(x) if x in order else 99)]
    return {"ok": True,
            "share": {"url": share.get("url", ""), "内容": share.get("内容", "")},
            "stats": {"n_docs": sum(r["chunks"] for r in per.values()),
                      "n_pages": sum(r["pages"] for r in (
                          c for g in groups.values() for c in g)),
                      "n_chars": sum(r["chars"] for r in per.values()),
                      "n_courses": len(per), "n_books": len({b["book"] for r in per.values() for b in r["books"].values()}),
                      "type_label": _TYPE_LABEL},
            "grades": by_grade}


def resolve(corpus: dict, kind: str, book_id: str) -> tuple[str | None, str]:
    """(绝对路径, 错误说明)。任何一步不对都返回 (None, 人话)，绝不猜。"""
    if not _ID_RE.match(book_id or "") or ".." in book_id:
        return None, "资料编号格式不对"
    if kind == "md":
        path = os.path.join(ROOT, "kb", "sources", f"{book_id}.md")
    elif kind == "pdf":
        entry = next((e for e in corpus.get("语料", []) if e.get("book_id") == book_id), None)
        if entry and entry.get("source_type") == "textbook":
            # 教材原件走网盘（面板「网盘」按钮），本机这条路 2026-09-29 起封死 ——
            # 不是改口径，是降级传播面：服务器不再对外发整本教材（README §10 第 36 条）
            return None, "教材原件已改走网盘分享，请用面板上的「网盘」按钮"
        path = (entry or {}).get("PDF") or ""
        if not path:
            return None, "这份资料没有登记原件路径"
    else:
        return None, "只支持下载 pdf 原件或 md 语料"
    # 相对路径一律**显式拼到项目根** —— 不能用 abspath(相对)：那是按"当前工作目录"解的，
    # 服务从别的目录起（或组长仓库里换个位置起），同一份对账单会解到别人机器上去。
    if not os.path.isabs(path):
        path = os.path.join(ROOT, path)
    real = os.path.realpath(path)
    if not os.path.isfile(real):
        return None, "文件不在（换过机器或被移走，对账单和磁盘不同步）"
    def inside(p: str, root: str) -> bool:
        try:
            return os.path.commonpath([p, root]) == root
        except ValueError:          # 不同盘符（E: vs C:）：直接算不在根内
            return False
    allowed = [os.path.realpath(os.path.abspath(r)) for r in MATERIAL_ROOTS]
    if not any(inside(real, root) for root in allowed):
        return None, "该文件不在允许的目录里"
    return real, ""
