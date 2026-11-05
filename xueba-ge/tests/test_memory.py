"""跨会话记忆的归属和口径。

三件必须钉死的事（都是"记忆"这功能最容易做错的地方）：
  · 记忆跟着 user_id 走，A 的画像绝不能进 B 的 prompt；
  · 「清空记忆」≠「清空历史」，而且清空之后不能下一句又偷偷写回去；
  · 没有记忆时 system prompt 必须**一字不变** —— 它前面是 persona+资料那个稳定前缀，
    服务商的 prompt caching 全靠它，多一段空标题就是每条请求多花一次钱。
"""

from backend import db, memory, prompts


def _user(nick, n=0):
    uid = db.create_user(nick, "1234")
    sid = db.ensure_session(uid, None)
    for i in range(n):
        db.add_message(sid, uid, "user", f"{nick} 的第 {i+1} 个问题：洛埃镜")
        db.add_message(sid, uid, "assistant", "答的一段")
    return uid, sid


def test_stub_falls_back_to_rule_digest(tmpdb):
    """没有 LLM（provider=stub / 传 None）也得有记忆：规则版只报数得出来的东西。"""
    uid, sid = _user("张三", 3)
    db.add_message(sid, uid, "assistant", "x", "askTextbook", '[{"course":"大学物理"}]')
    text = memory.refresh(uid, llm=None)
    assert "累计提问 3 次" in text
    assert "大学物理" in text
    assert memory.load(uid) == text                       # 落库了，下次开新会话还在
    assert len(text) <= memory.MAX_CHARS


def test_memory_is_per_user(tmpdb):
    a, sa = _user("张三", 2)
    b, sb = _user("李四", 2)
    db.add_message(sa, a, "assistant", "x", "askTextbook", '[{"course":"大学物理"}]')
    memory.refresh(a, llm=None)
    assert "张三" in memory.load(a)
    assert memory.load(b) == "", "李四不能看见张三的画像"
    assert memory.info(b)["memory"] == ""
    qs = db.recent_questions(b, limit=5)
    assert len(qs) == 2 and all("张三" not in q for q in qs), "取历史提问也不能越到别人身上"


def test_refresh_is_throttled(tmpdb):
    """攒够 EVERY 条新提问才值得再花一次模型调用。"""
    uid, sid = _user("张三", memory.MIN_MSGS)
    assert memory.needs_refresh(uid) is True              # 还没生成过
    memory.refresh(uid, llm=None)
    assert memory.needs_refresh(uid) is False             # 刚写完，不该立刻再来
    for i in range(memory.EVERY - 1):
        db.add_message(sid, uid, "user", f"补问 {i}")
    assert memory.needs_refresh(uid) is False
    db.add_message(sid, uid, "user", "第 EVERY 条")
    assert memory.needs_refresh(uid) is True


def test_forget_stops_auto_refresh_but_keeps_history(tmpdb):
    uid, sid = _user("张三", 4)
    memory.refresh(uid, llm=None)
    before = db.list_messages(sid, uid)
    info = memory.forget(uid)
    assert info["memory"] == "" and info["paused"] is True
    assert info["questions"] == 4
    assert memory.needs_refresh(uid) is False, "用户说别记了，后台就不能自己又记上"
    assert memory.spawn(uid, None) is False, "spawn 也必须尊重 paused"
    assert db.list_messages(sid, uid) == before, "清空记忆不许动历史消息"
    memory.refresh(uid, llm=None)                         # 手动重新归纳 = 撤回暂停
    assert memory.load(uid) and memory.info(uid)["paused"] is False


def test_broken_llm_degrades_instead_of_raising(tmpdb):
    class Boom:
        def complete(self, *a, **kw):
            raise RuntimeError("服务商 500")

    uid, _ = _user("张三", 3)
    assert "累计提问 3 次" in memory.refresh(uid, Boom())


def test_empty_memory_leaves_the_system_prompt_untouched():
    """没有画像时前缀必须一字不变（prompt caching）；有画像时必须写明它不是资料。"""
    persona = {"role": "学霸哥", "system_prompt_template": "你是{role}。"}
    assert prompts.system_prompt(persona, "askTextbook") == \
        prompts.system_prompt(persona, "askTextbook", "")
    assert prompts.memory_block("  ") == ""
    with_mem = prompts.system_prompt(persona, "askTextbook", "薄弱点：极限")
    assert "薄弱点：极限" in with_mem and "禁止" in with_mem and "【关于这位同学" in with_mem
