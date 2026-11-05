"""资料库面板 + 下载白名单的回归。

下载是这次新开的口子，测试的重点不是"能下"而是"只能下该下的"：
路径穿越、三棵根之外、没登记的编号，每一条都必须被挡回并说人话。
（这个接口背后就是 data/.secret 和 config 里那把 Key 所在的项目目录 —— 挡不住是一次事故。）
"""

import os

from backend import library

CHUNKS = [
    {"course": "高等数学", "book": "微积分(上册·第2版)", "book_id": "xbg-calc1",
     "source_type": "textbook", "page": 216, "chars": 10, "text": "x"},
    {"course": "高等数学", "book": "微积分(上册·第2版)", "book_id": "xbg-calc1",
     "source_type": "textbook", "page": 217, "chars": 10, "text": "x2"},
    {"course": "数据库", "book": "数据库 真题结构（自动统计，5 份）", "book_id": "map-db",
     "source_type": "outline", "chars": 5, "text": "y"},
    {"course": "数据库", "book": "数据库系统 2019—2020学年第1学期期末试卷(A卷)", "book_id": "db19201a",
     "source_type": "past_paper", "page": 4, "chars": 7, "text": "z"},
    {"course": "校园信息", "book": "校园总平面（像素校园 §5.1 全表）", "book_id": "campus",
     "source_type": "campus_info", "chars": 3, "text": "w"},
]
CORPUS = {
    "课程年级": {"高等数学": "大一", "数据库": "大三", "校园信息": "其他"},
    "网盘分享": {"url": "https://pan.baidu.com/s/1test?pwd=abcd", "内容": "全部教材 PDF"},
    "语料": [
        {"course": "高等数学", "book_id": "xbg-calc1", "source_type": "textbook", "PDF": "E:/x/教材/a.pdf"},
        {"course": "数据库", "book_id": "map-db", "source_type": "outline", "PDF": ""},
        {"course": "数据库", "book_id": "db19201a", "source_type": "past_paper", "PDF": "E:/x/试卷/b.pdf"},
    ],
    "已停用": {"语料": [{"course": "计算机网络", "book_id": "net8"}]},
}


def _course(payload, name):
    for g in payload["grades"]:
        for c in g["courses"]:
            if c["course"] == name:
                return c
    raise AssertionError(f"面板里没有 {name}")


def test_面板按年级分组_登记过但零切片的课也要露面():
    p = library.build_payload(CHUNKS, CORPUS)
    grades = {g["grade"]: [c["course"] for c in g["courses"]] for g in p["grades"]}
    assert grades["大一"] == ["高等数学"]
    assert "数据库" in grades["大三"]
    net = _course(p, "计算机网络")            # 只在「已停用」里登记过 —— 缺口必须看得见
    assert net["chunks"] == 0 and "零教材" in net["gaps"]


def test_面板说人话_页和字不是片():
    """组长反馈：「多少片」是检索内部单位，面板上要用页数/字数。
    页数 = 该书出现过的不同页码数（页锚点逐页打，数页码=数原书页数）。"""
    p = library.build_payload(CHUNKS, CORPUS)
    calc = _course(p, "高等数学")
    assert calc["pages"] == 2                                  # 两片各占一页 → 2 页
    assert calc["books"][0]["pages"] == 2
    assert p["stats"]["n_pages"] == 3                          # 高数2 + 真题1
    assert p["stats"]["n_chars"] == sum(c["chars"] for c in CHUNKS)
    assert _course(p, "数据库")["books"][0]["pages"] == 0      # 自动统计表没有页码 → 前端退回显示字数


def test_没进年级表的课归未分级不隐身():
    ch = CHUNKS + [{"course": "量子力学", "book": "Q", "book_id": "q1",
                    "source_type": "textbook", "chars": 1, "text": "t"}]
    p = library.build_payload(ch, CORPUS)
    assert _course(p, "量子力学")["grade"] == library.DEFAULT_GRADE


def test_下载标记_教材走网盘_真题留本地():
    p = library.build_payload(CHUNKS, CORPUS)
    calc = _course(p, "高等数学")["books"][0]
    assert calc["download_pdf"] is False                      # 教材原件不再从本机发（§10-36）
    assert calc["share_url"] == "https://pan.baidu.com/s/1test?pwd=abcd"
    books = {b["book_id"]: b for b in _course(p, "数据库")["books"]}
    assert books["db19201a"]["download_pdf"] is True          # 校本题库的卷子原件仍走本地
    assert books["db19201a"]["share_url"] == ""
    md_real = os.path.isfile(os.path.join(library.ROOT, "kb", "sources", "map-db.md"))
    assert books["map-db"]["download_md"] is md_real          # md 看磁盘，不看嘴
    assert p["share"]["url"].startswith("https://pan.baidu.com/")


def test_resolve_教材pdf通道已封死_指向网盘():
    path, err = library.resolve(CORPUS, "pdf", "xbg-calc1")
    assert path is None and "网盘" in err
    # 真题不受影响：过了类型闸，下一步才是文件存在性（测试语料里的假路径 → 报"文件不在"而不是"改走网盘"）
    path2, err2 = library.resolve(CORPUS, "pdf", "db19201a")
    assert path2 is None and "文件不在" in err2


def test_resolve_仓库内相对路径能解析到真文件():
    """2026-09-30 试卷进仓库的核心保证：对账单存的是相对路径 `试卷\\...`，
    clone 到任何机器、服务从任何工作目录起，都要能解到仓库内那份真文件（组长开箱可下载）。"""
    import json
    real_corpus = json.load(open(os.path.join(library.ROOT, "config", "corpus.json"), encoding="utf-8"))
    path, err = library.resolve(real_corpus, "pdf", "db19201a")
    assert path and os.path.isfile(path), err
    assert path.endswith("sql-sql-real1-pdf-1763201047545.pdf")
    # 必须落在仓库内（不是 E:\ 绝对路径），否则等于没进仓库
    assert os.path.realpath(path).startswith(os.path.realpath(library.ROOT))


def test_resolve_md_走磁盘真实文件():
    path, err = library.resolve(CORPUS, "md", "map-db")
    assert path and path.endswith("map-db.md") and os.path.isfile(path), err


def test_resolve_路径穿越全部挡回():
    for bad in ("../../config/llm", "..\\..\\data\\.secret", "map-db/../../settings",
                "", "a b", "%2e%2e%2e", ".hidden"):
        path, err = library.resolve(CORPUS, "md", bad)
        assert path is None and err, f"{bad!r} 竟然放行了"


def test_resolve_三棵根之外一律不放():
    evil = {"语料": [{"book_id": "x", "PDF": os.path.join(library.ROOT, "backend", "settings.py")}]}
    path, err = library.resolve(evil, "pdf", "x")
    assert path is None and "允许的目录" in err, err


def test_resolve_文件不在就说不在():
    evil = {"语料": [{"book_id": "m",
                      "PDF": os.path.join(library.MATERIAL_ROOTS[0], "绝对不存在的书.pdf")}]}
    path, err = library.resolve(evil, "pdf", "m")
    assert path is None and "不在" in err


def test_resolve_只认两种kind():
    assert library.resolve(CORPUS, "exe", "map-db")[1] == "只支持下载 pdf 原件或 md 语料"
