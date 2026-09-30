# -*- coding: utf-8 -*-
"""拍照提问（`backend/vision.py`）—— 一张图变成一段**可编辑**的题目文字。

守四件事，都是这条链的命门：
1. **Key 只在 llm.py**：vision 一行都不碰密钥，只把 data URL 交给 `LLM.read_image()`；
2. **校验在花钱之前**：格式/大小不对，一次调用都不许发出去（用假 LLM 数调用次数钉死）；
3. **识别 ≠ 作答**：提示词里必须写着"不要解题"，回来的必须是转写而不是答案；
4. **入库的图只有一张缩略图**：气泡上显示它，检索和答题用的仍然是识别出来的那段文字；
   缩略图不合格就**悄悄丢掉**，绝不为了它把用户已经发出去的问题打回（第 6、7 条测它）。

全程不碰网络：真模型那一条在 `tests/smoke_api.py` 里跑（要 Key、要服务起着）。
"""

import base64
import os
import sys

import pytest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

from backend import prompts                                   # noqa: E402
from backend.llm import LLMError                              # noqa: E402
from backend.vision import (PROMPT, Reader, VisionError,      # noqa: E402
                            check_size, clean, parse_data_url)
from backend.vision import THUMB_MAX_CHARS, clean_thumb          # noqa: E402

PNG = base64.b64encode(b"\x89PNG\r\n\x1a\n" + b"0" * 64).decode()     # 内容无所谓，这里不真解码
NL = chr(10)                       # 工具链吃掉过 \n 四次，这里不用字面转义
L4 = ("例 4 某车间用一台包装机包装葡萄糖，包得的袋装糖重量是一个随机变量，它服从正态分布。"
      "当机器正常时，其均值为 $0.5\\,\\text{kg}$，标准差为 $0.015\\,\\text{kg}$。")


def data_url(mime="image/png", payload=PNG):
    return f"data:{mime};base64,{payload}"


class FakeLLM:
    """只记账，不发网络。provider 拨成 stub 就能验那条"没眼睛"的话术。"""

    def __init__(self, reply=L4, provider="api", cfg=None, boom=None):
        self.provider = provider
        self.cfg = cfg or {"model": "qwen3.8-flash"}
        self.reply = reply
        self.boom = boom
        self.calls = []

    def read_image(self, url, prompt, model="", max_tokens=900, timeout=0):
        self.calls.append({"url": url, "prompt": prompt, "model": model,
                           "max_tokens": max_tokens, "timeout": timeout})
        if self.boom:
            raise self.boom
        return self.reply, {"prompt_tokens": 288, "completion_tokens": 220}


# ---------------- 1. 进来的图先过三道校验 ----------------
def test_data_url_parses_to_mime_and_bytes():
    mime, raw = parse_data_url(data_url())
    assert mime == "image/png" and raw.startswith(b"\x89PNG")


def test_jpg_alias_becomes_jpeg():
    assert parse_data_url(data_url("image/jpg"))[0] == "image/jpeg"


@pytest.mark.parametrize("bad", ["", "你好", "data:text/plain;base64,AAAA",
                                 "http://x/a.png", "data:image/png;base64,"])
def test_garbage_is_refused_with_a_reason(bad):
    with pytest.raises(VisionError) as e:
        parse_data_url(bad)
    assert str(e.value)                                    # 不许抛一句空话，前端直接显示它


def test_size_cap_says_how_big_it_is():
    with pytest.raises(VisionError) as e:
        check_size(9 * 1048576, 6)
    assert "9.0 MB" in str(e.value) and "6" in str(e.value)


# ---------------- 2. 校验必须在花钱之前 ----------------
def test_bad_image_never_reaches_the_model():
    llm = FakeLLM()
    r = Reader(llm, {"max_mb": 6})
    for bad in ["not a data url", "data:application/pdf;base64,AAAA"]:
        with pytest.raises(VisionError):
            r.read(bad)
    assert llm.calls == []                                  # 一次调用都不该发出去


def test_too_big_never_reaches_the_model():
    llm = FakeLLM()
    with pytest.raises(VisionError):
        Reader(llm, {"max_mb": 0.00001}).read(data_url())
    assert llm.calls == []


def test_stub_provider_says_it_has_no_eyes_without_calling():
    llm = FakeLLM(provider="stub")
    assert Reader(llm, {}).available() is False
    with pytest.raises(VisionError) as e:
        Reader(llm, {}).read(data_url())
    assert "stub" in str(e.value)
    assert llm.calls == []


# ---------------- 3. 识别 ≠ 作答 ----------------
def test_prompt_forbids_solving_and_asks_for_latex():
    assert "不要解题" in PROMPT and "LaTeX" in PROMPT
    assert "□" in PROMPT                                     # 认不准要占位，不许猜一个字


def test_read_forwards_the_image_and_returns_the_transcript():
    llm = FakeLLM()
    out = Reader(llm, {"max_mb": 6, "timeout": 45, "max_tokens": 900}).read(data_url())
    assert out["text"] == L4
    assert out["model"] == "qwen3.8-flash" and out["in_tokens"] == 288
    assert out["ms"] >= 0 and out["bytes"] > 0 and out["mime"] == "image/png"
    call = llm.calls[0]
    assert call["url"].startswith("data:image/png;base64,")   # 原样转发，不重编码
    assert "不要解题" in call["prompt"] and call["timeout"] == 45


def test_model_defaults_to_the_text_model_and_can_be_overridden():
    assert Reader(FakeLLM(), {}).model == "qwen3.8-flash"     # 同一把 Key、同一份计费
    assert Reader(FakeLLM(), {"model": "qwen3-vl-flash"}).model == "qwen3-vl-flash"


def test_upstream_failure_is_not_swallowed():
    """服务商挂了要原样冒出来（app.py 把它写成 502），不能被伪装成"图不行"。"""
    r = Reader(FakeLLM(boom=LLMError("LLM 接口 400: bad request")), {"max_mb": 6})
    with pytest.raises(LLMError):
        r.read(data_url())


# ---------------- 4. 模型爱加的壳子 ----------------
def test_clean_strips_fences_and_preamble():
    raw = "```text\n好的，图片内容如下：\n\n" + L4 + "\n```\n"
    txt, cut = clean(raw, 4000)
    assert L4 in txt and "```" not in txt and not txt.startswith("好的")
    assert cut is False


def test_clean_truncates_and_says_so():
    txt, cut = clean("字" * 100, 40)
    assert cut is True and len(txt) == 41 and txt.endswith("…")


def test_not_a_problem_is_refused_not_forwarded():
    r = Reader(FakeLLM(reply="这不是题目"), {"max_mb": 6})
    with pytest.raises(VisionError) as e:
        r.read(data_url())
    assert "没看到题目" in str(e.value)


def test_empty_transcript_is_refused():
    with pytest.raises(VisionError):
        Reader(FakeLLM(reply="  "), {"max_mb": 6}).read(data_url())


# ---------------- 5. 这句话是认出来的，得让模型知道 ----------------
def test_image_note_only_when_it_came_from_a_photo():
    plain = prompts.user_prompt("求极限", "资料", "explainProblem")
    shot = prompts.user_prompt("求极限", "资料", "explainProblem", True)
    assert "拍照识别" not in plain
    assert "拍照识别" in shot and shot.endswith("[[tool:explainProblem]]")
    assert "资料" in shot                                     # 资料块一个字没动（前缀缓存还要命中）


def test_build_and_memory_messages_both_carry_the_flag():
    store = type("S", (), {"doc": staticmethod(lambda i: dict(
        course="概率论", book="概率论与数理统计(第3版)", chapter="第7章假设检验",
        section="第7章假设检验", page=186, source_type="textbook",
        text=L4, id="xbg-prob#p186#i1", n_prev="", n_next=""))})()
    hit = [type("H", (), {"doc_idx": 0})()]
    msgs, refs = prompts.build_messages({}, L4, hit, store, "explainProblem", [], "", True)
    assert "拍照识别" in msgs[-1]["content"] and refs[0]["page"] == 186
    plain = prompts.build_messages({}, L4, hit, store, "explainProblem", [], "")[0]
    assert "拍照识别" not in plain[-1]["content"]
    assert "拍照识别" in prompts.memory_messages({}, "explainProblem", L4, [], "", True)[-1]["content"]


# ---------------- 6. 来路标记 + 那张缩略图都跟着消息走 ----------------
def test_photo_source_and_thumb_round_trip(tmpdb):
    uid = tmpdb.create_user("carol", "1234")
    sid = tmpdb.ensure_session(uid, None)
    thumb = "data:image/jpeg;base64," + base64.b64encode(b"JPEGDATA" * 8).decode()
    tmpdb.add_message(sid, uid, "user", L4, src="photo", image=thumb)
    tmpdb.add_message(sid, uid, "user", "手打的一句")
    rows = tmpdb.list_messages(sid, uid)
    assert [r["src"] for r in rows] == ["photo", ""]
    assert rows[0]["content"] == L4, "识别出来的文字照样是正文，图只是显示件"
    assert rows[0]["image"] == thumb, "重放时那张图得回得来"
    assert rows[1]["image"] == "", "手打的那条没有图"
    # 喂给模型的多轮上下文里一个字都不许带 base64：那一头只选 role/content
    assert all(sorted(m) == ["content", "role"] for m in tmpdb.context_messages(sid, uid))


def test_old_database_gets_the_image_column(tmpdb, tmp_path, monkeypatch):
    """老库补列。`CREATE TABLE IF NOT EXISTS` 不会动已经存在的表，加字段得自己补上。"""
    import sqlite3
    from backend import db
    old = str(tmp_path / "old.db")
    con = sqlite3.connect(old)
    con.execute("CREATE TABLE message (id INTEGER PRIMARY KEY AUTOINCREMENT,"
                " session_id TEXT NOT NULL, user_id INTEGER NOT NULL, role TEXT NOT NULL,"
                " content TEXT NOT NULL, tool TEXT NOT NULL DEFAULT '',"
                " refs TEXT NOT NULL DEFAULT '[]', created_at INTEGER NOT NULL)")
    con.execute("INSERT INTO message(session_id,user_id,role,content,created_at)"
                "VALUES('s',1,'user','老库里的一条',0)")
    con.commit()
    con.close()
    monkeypatch.setattr(db, "DB_PATH", old)
    monkeypatch.setattr(db._local, "conn", None, raising=False)
    db.init_db()
    row = db.conn().execute("SELECT image,src,no_source FROM message").fetchone()
    assert (row["image"], row["src"], row["no_source"]) == ("", "", 0), "老消息没图，默认空串"


# ---------------- 7. 缩略图收不收：它自己的事，问出去的问题不受影响 ----------------
def test_thumb_takes_a_compressed_jpeg():
    ok = "data:image/jpeg;base64," + base64.b64encode(b"x" * 3000).decode()
    assert clean_thumb(ok) == ok


def test_thumb_refuses_junk_without_raising():
    assert clean_thumb("") == ""
    assert clean_thumb("javascript:alert(1)") == ""
    assert clean_thumb("data:image/svg+xml;base64,AAAA") == "", "svg 里能带脚本，不进库"
    assert clean_thumb("data:image/gif;base64,AAAA") == "", "动图和 1 位色没那个必要"
    assert clean_thumb("data:image/jpeg;base64,@@ 不是 base64 @@") == ""
    assert clean_thumb("data:image/jpeg;base64,AAAA" + NL) == "data:image/jpeg;base64,AAAA"


def test_thumb_over_budget_is_dropped_not_cut():
    """超账就整张丢掉：截一半的 base64 解不出来，留着比没有更糟。"""
    head = "data:image/jpeg;base64,"
    keep = head + "A" * (THUMB_MAX_CHARS - len(head))           # 正好压线：收
    assert clean_thumb(keep) == keep
    assert clean_thumb(keep + "A") == "", "多一个字符就整张丢掉，不截一半"
