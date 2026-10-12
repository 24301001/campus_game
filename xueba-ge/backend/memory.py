r"""长期记忆 —— 把"这个人问过什么"压成一段画像，跟着 user_id 走。

和 db.py 那套 session/message 的分工（两层，别混）：
  · message 表 = **原始历史**：侧栏能点开回放，同一会话内的多轮上下文走它（context_messages）；
  · 本模块 = **归纳后的画像**：跨会话。少了这一层，点「＋新对话」就又失忆 ——
    换了段对话它就不知道你在准备期末、上次栽在洛埃镜上了。

三条口径，都是被部署和演示逼出来的：
  · **异步生成**：回答讲完之后丢后台线程去归纳，绝不在 SSE 中间等它。多花一次 LLM 调用
    也不能把首字延迟搭进去（演示当天第一条要求就是 0.5s 出字）。
  · **无 Key 也能跑**：provider=stub 时退回规则版摘要（问过几轮 / 哪些课 / 最近的问题），
    链路、存储、界面和真模型完全一致，只是话笨一点。评测和答辩时看不出来。
  · **只做贴合，不做事实**：注入时明说"这不是资料"，见 prompts.memory_block。
    画像里写着他问过高数，不等于高数的结论可以从画像里来 —— 引用只能来自检索。
"""

from __future__ import annotations

import re
import threading

from . import db

EVERY = 6           # 每攒够 6 条新用户提问重新归纳一次（一次调用几分钱，别每问就打）
MIN_MSGS = 2        # 少于这个数不归纳：刚注册问一句就写画像，写出来的全是猜的
MAX_CHARS = 240     # 画像上限。它每条请求都要被带一遍，长了既费 token 又稀释注意力

_lock = threading.Lock()
_busy: set[int] = set()

_SYS = ("你在给一个基于教材答疑的助手压缩『用户画像』。下面是这位同学的历史提问，"
        "把它们归纳成不超过 150 字的中文纯文本，只写三类能帮上讲课的信息：\n"
        "1) 在学什么课程、处在什么阶段（期末/考研/重修……只从提问里能看出来的才算）；\n"
        "2) 反复出现或明显没吃透的知识点——同类问题问过两次以上的标成薄弱点；\n"
        "3) 他偏好的答法（要概念、要分步解题、要复习规划……）。\n"
        "硬性要求：材料里没有的一律不写，宁可空着也别补；不要出现姓名、学号、联系方式；"
        "不要用 markdown 列表符号，不要写开场白和结束语。")


def load(uid: int) -> str:
    """画像正文；没有就返回 ""。调用方（app.py）每条请求只读一次，很便宜。"""
    row = db.get_memory(uid)
    return (row or {}).get("text") or ""


def info(uid: int) -> dict:
    row = db.get_memory(uid) or {}
    return {"memory": row.get("text") or "", "updated_at": row.get("updated_at") or 0,
            "paused": bool(row.get("paused")), "questions": db.count_messages(uid, "user"),
            "due": needs_refresh(uid)}


def needs_refresh(uid: int) -> bool:
    if db.count_messages(uid, "user") < MIN_MSGS:
        return False
    row = db.get_memory(uid)
    if row is None:
        return True                                    # 冷启动：一次都没归纳过，该写了
    if row.get("paused"):
        return False                                   # paused 是用户明确说过的"别记"，不自动突破
    return db.count_messages(uid, "user") - int(row.get("msg_count") or 0) >= EVERY


def _clean(text: str) -> str:
    """模型爱写 "- " 和 "以下是…"。压成一行，掐掉越界长度，别让它把画像写成作文。"""
    text = re.sub(r"^\s*[-*·\d.、]+\s*", "", (text or "").strip(), flags=re.M)
    text = re.sub(r"\s*\n\s*", "；", text)
    text = re.sub(r"；{2,}", "；", text).strip("； ")
    return text[:MAX_CHARS]


def digest_rules(uid: int) -> str:
    """规则版画像：不调模型也能有的那部分，同时也是 LLM 挂掉时的兜底。

    它只报**数得出来的东西**（问了几次、哪些课、最近的原话），不猜"他是大几的"——
    规则版没有推理能力，那就一句推理都不要有，这比让模型瞎推诚实。
    """
    n = db.count_messages(uid, "user")
    courses = db.recent_courses(uid, limit=4)
    bits = []
    if courses:
        bits.append("关注课程：" + "、".join(courses))
    asked = [q.strip()[:20] for q in db.recent_questions(uid, limit=6) if q.strip()]
    if asked:
        bits.append("最近问过：" + " / ".join(asked[:4]))
    bits.insert(0, f"这位同学累计提问 {n} 次")
    return _clean("；".join(bits))


def summarize(uid: int, llm) -> str:
    """让模型归纳。真历史一条都不落到 llm 的日志里之外的地方。"""
    courses = db.recent_courses(uid, limit=8)
    qs = db.recent_questions(uid, limit=24)
    body = "最近涉及的课程：" + ("、".join(courses) if courses else "（无）") + "\n历史提问（新→旧）：\n"
    body += "\n".join(f"- {q[:60]}" for q in qs)
    return _clean(llm.complete([{"role": "system", "content": _SYS},
                               {"role": "user", "content": body}], max_tokens=200))


def refresh(uid: int, llm=None) -> str:
    """生成 + 落库。异常一律吞回规则版：归纳失败绝不能把问答主链路带下水。"""
    text = ""
    if llm is not None:
        try:
            text = summarize(uid, llm)
        except Exception:                               # noqa: BLE001 - 后台线程里没人接异常，必须自己兜
            text = ""
    if not text:
        text = digest_rules(uid)
    if text:
        db.set_memory(uid, text, db.count_messages(uid, "user"), paused=0)
    return text


def forget(uid: int) -> dict:
    """用户点「清空」。停自动归纳，历史不动 —— 再要就手动「重新归纳」。"""
    db.pause_memory(uid)
    return info(uid)


def spawn(uid: int, llm) -> bool:
    """后台线程去归纳。返回有没有真开（不需要跑 / 已经在跑都是 False）。"""
    if not needs_refresh(uid):
        return False
    with _lock:
        if uid in _busy:
            return False
        _busy.add(uid)

    def worker() -> None:
        try:
            refresh(uid, llm)
        finally:
            with _lock:
                _busy.discard(uid)
            db.close_conn()                             # 这条线程的连接不会自己回收，别攒着

    threading.Thread(target=worker, name=f"xbg-memory-{uid}", daemon=True).start()
    return True
