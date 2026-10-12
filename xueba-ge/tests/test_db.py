"""会话存储层：删除必须连消息一起删、不许越权、可重复点。

前端侧栏那个 ✕ 是**不可逆**操作（没有回收站），所以这几条是它的兜底：
删干净、删不错别人的、连点两次不炸。
"""

import pytest

from backend import db


def _two_sessions():
    a = db.create_user("alice", "1234")
    b = db.create_user("bob", "1234")
    sa = db.ensure_session(a, None)
    sb = db.ensure_session(b, None)
    db.add_message(sa, a, "user", "我问的一句", "askTextbook")
    db.add_message(sa, a, "assistant", "她答的一段", "askTextbook", '[{"page": 12}]')
    db.add_message(sb, b, "user", "bob 的一句", "askTextbook")
    return a, b, sa, sb


def test_delete_session_takes_messages_with_it(tmpdb):
    a, b, sa, sb = _two_sessions()
    assert tmpdb.delete_session(sa, a) is True
    assert tmpdb.list_messages(sa, a) == []
    assert [x["id"] for x in tmpdb.list_sessions(a)] == [], "会话本身也要从列表里消失"
    assert tmpdb.list_messages(sb, b), "别人的会话不能受牵连"


def test_delete_someone_elses_session_is_refused(tmpdb):
    a, b, sa, sb = _two_sessions()
    with pytest.raises(db.AuthError):
        tmpdb.delete_session(sa, b)                      # bob 删 alice 的会话
    assert len(tmpdb.list_messages(sa, a)) == 2, "被拒绝的删除必须一点没删"


def test_delete_twice_is_not_an_error(tmpdb):
    """连点两次 ✕（或者列表还没刷新又点一次）不该抛异常，前端只是再刷一次列表。"""
    a, b, sa, sb = _two_sessions()
    assert tmpdb.delete_session(sa, a) is True
    assert tmpdb.delete_session(sa, a) is False
    assert tmpdb.delete_session("", a) is False
