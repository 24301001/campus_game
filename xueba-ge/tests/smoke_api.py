r"""端到端冒烟测试（需要服务已经在跑）。

    .\run.ps1                              # 另开一个窗口
    .\.venv\Scripts\python.exe tests\smoke_api.py http://127.0.0.1:8010

它验的是"组长那句验收标准"：打开 → 登录 → 敲一句话 → 程序回答，
外加三条只有真跑一遍才会发现的链路问题（流式是不是真的分段、出处取不取得到、
换浏览器历史还在不在）。
"""

from __future__ import annotations

import base64
import json
import os
import re
import sys
import time
import uuid

import requests

BASE = (sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:8010").rstrip("/")
NICK = "smoke_" + uuid.uuid4().hex[:6]
PW = "1234"
fails: list[str] = []


def check(name: str, cond: bool, extra: str = "") -> None:
    print(("  PASS  " if cond else "  FAIL  ") + name + (("  · " + extra) if extra else ""))
    if not cond:
        fails.append(name)


def events(question: str, session: str, token: str, course: str = "",
           from_image: bool = False, image: str = "") -> tuple[list, float]:
    got, t0, buf = [], time.perf_counter(), []
    payload = {"question": question, "session": session, "course": course}
    if from_image:
        # 这句是拍照识别出来的。它不改检索、不改路由，只让后端在问题尾巴上注一句
        # "数字可能认错"（prompts.IMAGE_NOTE），并在历史里留下 src=photo。
        payload["from_image"] = True
    if image:
        # 气泡上那张缩略图：只用来把这条显示成图，检索和答题一个字都不看它
        payload["image"] = image
    with requests.post(BASE + "/api/chat", headers={"Authorization": "Bearer " + token},
                       json=payload, stream=True, timeout=60) as r:
        assert r.status_code == 200, f"HTTP {r.status_code}: {r.text[:200]}"
        name = None
        for raw in r.iter_lines(decode_unicode=True):
            if not raw:
                continue
            if raw.startswith("event:"):
                name = raw[6:].strip()
            elif raw.startswith("data:"):
                d = json.loads(raw[5:].strip())
                got.append((name, d, round((time.perf_counter() - t0) * 1000)))
                if name == "token":
                    buf.append(d["t"])
    return got, "".join(buf)


print(f"\n{'=' * 68}\n冒烟：{BASE}   账号 {NICK}\n{'=' * 68}")

r = requests.post(BASE + "/api/register", json={"nick": NICK, "password": PW}, timeout=20)
check("注册返回 token+session", r.status_code == 200 and "token" in r.json(), r.text[:80])
tok, sid = r.json()["token"], r.json()["session"]
H = {"Authorization": "Bearer " + tok}

check("未带 token 被拒", requests.get(BASE + "/api/me").status_code == 401)
me = requests.get(BASE + "/api/me", headers=H, timeout=20).json()
check("登录态能认出人", me["nick"] == NICK)
b = requests.get(BASE + "/api/bootstrap", headers=H, timeout=20).json()
check("bootstrap 带课程清单", len(b["courses"]) >= 3, " / ".join(b["courses"]))
check("索引已加载", b["n_docs"] > 50, f"{b['n_docs']} 片，分词 {b['tokenizer']}")
_h = requests.get(BASE + "/api/health", timeout=20).json()
_st = _h.get("stats") or {}
check("第二条腿是**真**语义向量（索引里自己写着来源）",
      _st.get("embed_provider") not in (None, "", "hash"),
      f"embed_provider={_st.get('embed_provider')} dim={_st.get('embed_dim')} "
      f"覆盖 {_st.get('vector_docs')}/{b['n_docs']} 片")
_rr = _h.get("rerank") or {}
check("精排状态可观测（关着要说清是关着，不是坏了）",
      "provider" in _rr and "failures" in _rr and _rr.get("calls", 0) >= 0,
      f"{_rr.get('provider')}:{_rr.get('model')} 调用 {_rr.get('calls')} 次 / 失败 {_rr.get('failures')} 次")
check("端上那份模型挂在自己的地址上（0 公网依赖）",
      requests.get(BASE + "/models/bge-small-zh-v1.5/vocab.txt", timeout=20).status_code == 200
      and requests.get(BASE + "/static/vendor/onnxruntime/ort.webgpu.bundle.min.mjs",
                       timeout=20).headers.get("Content-Type", "").startswith("text/javascript"))

# 第一条**必须**用真有的教材：四门示例语料下架后，TCP/死锁这类题走的是"无资料降级"那条链
# （下面 evs2 专门测它），拿它验"出处可点"就永远验不到了。
evs, answer = events("洛必达法则的使用条件是什么", sid, tok)
kinds = [e[0] for e in evs]
first_tok = next((ms for k, d, ms in evs if k == "token"), None)
ntok = sum(1 for k in kinds if k == "token")
check("工具路由到 askTextbook", next((d["tool"] for k, d, _ in evs if k == "meta"), "") == "askTextbook")
check("先推引用再推正文", kinds.index("citation") < kinds.index("token") if "citation" in kinds else False)
check("有引用（出处可点）", sum(1 for k in kinds if k == "citation") >= 3, f"{sum(1 for k in kinds if k=='citation')} 条")
check("流式是分段的（不是一坨）", ntok >= 5, f"{ntok} 个分片，首片 {first_tok} ms")
check("回答里带引用角标 [n]", bool(re.search(r"\[\d+\]", answer)), re.findall(r"\[\d+\]", answer)[:6] and "".join(sorted(set(re.findall(r"\[\d+\]", answer)))) or "无")
check("回答提到了未定式这个要点", "未定式" in answer or "0/0" in answer, answer[:60].replace("\n", " "))

# 库里没这门课教材 → ②的降级链：**牌必须挂上，页码和角标一个都不许有**
evs2, ans2 = events("死锁的四个必要条件是什么", sid, tok)
done2 = next((d for k, d, _ in evs2 if k == "done"), {})
kinds2 = [k for k, _, _ in evs2]
check("没教材的课走降级并挂牌", done2.get("no_source") is True, ans2[:40].replace("\n", " "))
check("降级回答一个假出处都没有", kinds2.count("citation") == 0 and not done2.get("refs")
      and not re.search(r"第\s*\d+\s*页", ans2) and not re.search(r"\[\d+\]", ans2),
      f"citation {kinds2.count('citation')} 条 / 正文 {len(ans2)} 字")
check("降级仍然讲了东西", "互斥" in ans2 or "循环等待" in ans2, ans2[:40].replace("\n", " "))
# 2026-09-28 三门新教材入库后撞出来的新面：跨课同名词让引擎的全局 df 拦不住
# （「神经网络」在《数据库系统概论》里真出现过）。无课程问句的拒答上移到 agent 的课程守卫 ——
# 这句必须挂牌、一个出处都不许有，更不许把别的课的页缝过来当资料。
evs2b, ans2b = events("卷积神经网络的反向传播怎么推导", sid, tok)
done2b = next((d for k, d, _ in evs2b if k == "done"), {})
kinds2b = [k for k, _, _ in evs2b]
check("跨课同名词的无门题由课程守卫挂牌（引擎全局 df 已拦不住）",
      done2b.get("no_source") is True and kinds2b.count("citation") == 0
      and not re.search(r"\[\d+\]", ans2b),
      f"citation {kinds2b.count('citation')} 条 / 正文 {len(ans2b)} 字 / {ans2b[:36]}".replace("\n", " "))
evs3, ans3 = events("明湖大概有多大", sid, tok)
check("校园兜底能答", "米" in ans3, ans3[:50].replace("\n", " "))
evs4, ans4 = events("全概率公式和贝叶斯公式怎么用", sid, tok)
cits4 = [d for k, d, _ in evs4 if k == "citation"]
# 2026-09-22 概率论入库：这句以前是"没喂的课该拒答"的例子（全概率公式正是那门课的核心节），
# 现在它必须有真书出处 —— 判据反过来，不许再拿它当"该拒答"用。
check("概率论入库后全概率公式引到概率论课本",
      bool(cits4) and any("概率论" in (c.get("book") or "") for c in cits4),
      f"{len(cits4)} 条引用，首条 {cits4[0]['book'][:14]} 第{cits4[0].get('page')}页"
      if cits4 else ans4[:40].replace("\n", " "))
# 2026-09-21 线代/大物入库：上面这道"特征值"以前是该拒答的例子，现在必须有真书出处
evs4b, ans4b = events("矩阵的特征值和特征向量怎么求", sid, tok)
cits4b = [d for k, d, _ in evs4b if k == "citation"]
check("线代入库后特征值引到线性代数课本",
      any((d.get("book") or "").startswith("线性代数") for d in cits4b),
      f'{len(cits4b)} 条引用，首条 {cits4b[0]["book"][:16] if cits4b else "无"}'
      f' 第{cits4b[0].get("page") if cits4b else "?"}页')
evs4c, ans4c = events("熵增加原理怎么说", sid, tok)
cits4c = [d for k, d, _ in evs4c if k == "citation"]
check("大物入库后概念题引到大学物理学",
      any((d.get("book") or "").startswith("大学物理学") for d in cits4c),
      f'{len(cits4c)} 条引用，首条 {cits4c[0]["book"][:16] if cits4c else "无"}'
      f' 第{cits4c[0].get("page") if cits4c else "?"}页')
# 换一道真教材题：既要能答、要指到书页，也要"高数没真题"这条不挂卡片
evs5, ans5 = events("不定积分怎么换元", sid, tok)
done5 = next((d for k, d, _ in evs5 if k == "done"), {})
cits5 = [d for k, d, _ in evs5 if k == "citation"]        # 引用走 citation 事件，done 里刻意不带 refs
check("OCR 进来的真高数教材能答且出处指到微积分",
      any((d.get("book") or "").startswith("微积分") for d in cits5),
      f'{len(cits5)} 条引用，首条 {cits5[0]["book"][:14] if cits5 else "无"}'
      f' 第{cits5[0].get("page") if cits5 else "?"}页')
m5 = sorted({m for m in re.findall(r"\[\d+\]", ans5)})
check("真教材题也带引用角标", bool(m5), f"{m5[:5]} 共 {len(m5)} 个")
check("真教材的回答不空", bool(cits5) and ("换元" in ans5 or "微分" in ans5), ans5[:36].replace("\n", " "))
h0 = requests.get(BASE + "/api/history", headers=H, params={"session": sid}, timeout=20).json()
deg = [m for m in h0["messages"] if m.get("no_source")]
check("降级那条在历史里也带着牌", bool(deg) and not deg[0]["refs"],
      f"{len(deg)} 条无出处 / 首条 refs {len(deg[0]['refs']) if deg else '?'} 条")

h = requests.get(BASE + "/api/history", headers=H, params={"session": sid}, timeout=20).json()
check("历史按 user_id 落库了", len(h["messages"]) >= 8, f"{len(h['messages'])} 条")
roles = [m["role"] for m in h["messages"]]
check("历史是 user/assistant 成对", roles[0] == "user" and "assistant" in roles)
refs = h["messages"][-3]["refs"] if len(h["messages"]) >= 3 else []
asst = [m for m in h["messages"] if m["role"] == "assistant" and m["refs"]]
check("历史里保留了出处", bool(asst), f"{len(asst[0]['refs']) if asst else 0} 条引用")

cid = asst[0]["refs"][0]["chunk_id"] if asst else None
if cid:
    c = requests.get(BASE + "/api/chunk", headers=H, params={"i": cid}, timeout=20).json()
    check("出处能取回原文与页码", bool(c.get("text")) and c.get("page", 0) > 0, f"{c.get('book','')[:16]} 第{c.get('page')}页")
check("未知出处返回 404", requests.get(BASE + "/api/chunk", headers=H, params={"i": "nope"}, timeout=20).status_code == 404)

# 同类往年题卡片（§2.3）：答完题在正文下面挂两道真题目，出处必须是卷面而不是教材
evs6, ans6 = events("E-R 图怎么转成关系模式", sid, tok, course="数据库")
rel = next((d for k, d, _ in evs6 if k == "related"), {})
items = rel.get("items") or []
check("答完会挂同类往年题", len(items) >= 1, f"{len(items)} 条")
check("卡片只放真题卷（不掺答案卷）",
      bool(items) and all(i.get("source_type") == "past_paper"
                          and "参考答案" not in (i.get("book") or "") for i in items),
      items[0]["book"][:26] if items else "无")
if items:
    cw = requests.get(BASE + "/api/chunk", headers=H, params={"i": items[0]["chunk_id"]}, timeout=20).json()
    check("卡片点开就是那份卷子的原题", bool(cw.get("text")) and cw.get("page", 0) > 0,
          f"{cw.get('book','')[:20]} 第{cw.get('page')}页")
check("库里没真题的课不硬挂卡片（高数）", not any(k == "related" for k, _, _ in evs5), "洛必达那题")

# 追问「能不能给我找一点类似的原题」——2026-09-27 组长现场撞的答非所问：
# 三个工具都接不住这句，实测路由成"复习规划"、引用 0 条、正文把上一题又讲了一遍。
# 现在这句由规则先截（config/agent.json 的「找同类题」），产出只有两种：卡片 / 点名缺什么。
evs7, ans7 = events("能不能给我找一点类似的原题", sid, tok, course="数据库")
meta7 = next((d for k, d, _ in evs7 if k == "meta"), {})
done7 = next((d for k, d, _ in evs7 if k == "done"), {})
items7 = (next((d for k, d, _ in evs7 if k == "related"), {}) or {}).get("items") or []
check("要题那句由规则截住（不进三选一，也就不引入新的路由错误面）",
      meta7.get("tool") == "findPastPapers" and meta7.get("routed_by") == "rule",
      f"{meta7.get('tool')}/{meta7.get('routed_by')}")
check("要题那句给的是卡片，不是把上一题又讲一遍",
      len(items7) >= 1 and "### 第" not in ans7 and "参考答案" not in "".join(i.get("book", "") for i in items7),
      f"{len(items7)} 条 · " + ans7[:34].replace(chr(10), " "))
check("这条链一个字没凭记忆编：不挂「无出处 · AI 记忆」灰牌",
      not done7.get("no_source") and not done7.get("refs"),
      str(sorted(done7.keys()))[:44])
evs8, ans8 = events("能不能给我找一点类似的原题", sid, tok, course="概率论")
done8 = next((d for k, d, _ in evs8 if k == "done"), {})
check("没卷的课点名缺什么并给一条走得通的路",
      "一张往年卷都没有" in ans8 and "无出处" in ans8
      and done8.get("fallback") == "这门课没有往年卷"
      and not any(k == "related" for k, _, _ in evs8),
      ans8[:34].replace(chr(10), " "))

# 课程名对不上（"软测"这种缩写）：不许只回一句"没这门课"。要么引到真卷上，
# 要么点名最接近的那门课 + 说清手上有什么。判据按分支写：同一句话模型可能路由成
# makeStudyPlan（校内事实，闸门不许降级 -> 走兜底话术），也可能落到往年卷上直接作答。
evs7, ans7 = events("软测的期末会怎么考", sid, tok)
refs7 = [d.get("ref") or d for k7, d, _ in evs7 if k7 == "citation"]
check("缩写课名不硬编：引到真卷或点名最接近的课",
      bool(refs7) or "软件设计与分析" in ans7,
      ("引用 " + str(len(refs7)) + " 条") if refs7 else ans7[:40].replace(chr(10), " "))
check("拒答时也说了最接近的课/手上有什么（且不刷屏）",
      bool(refs7) or ("软件设计与分析" in ans7 and "往年卷" in ans7 and len(ans7) < 200),
      str(len(ans7)) + " 字 / 引用 " + str(len(refs7)) + " 条")

r2 = requests.post(BASE + "/api/register", json={"nick": NICK, "password": PW}, timeout=20)
check("重复昵称被拒", r2.status_code == 400, r2.json().get("detail", ""))
r3 = requests.post(BASE + "/api/login", json={"nick": NICK, "password": "wrong"}, timeout=20)
check("错密码被拒", r3.status_code == 401)
r4 = requests.get(BASE + "/api/history", headers={"Authorization": "Bearer " + tok + "x"}, timeout=20)
check("伪造 token 被拒", r4.status_code == 401)

# 会话隔离：另一个账号看不到这个账号的历史
rb = requests.post(BASE + "/api/register", json={"nick": NICK + "_b", "password": PW}, timeout=20)
tokb = rb.json()["token"]
hb = requests.get(BASE + "/api/history", headers={"Authorization": "Bearer " + tokb}, params={"session": sid}, timeout=20)
check("换账号读别人的会话被明确拒绝（403，而不是装作空会话）", hb.status_code == 403, hb.text[:60])

# ---------------- 长期记忆（跨会话画像） ----------------
# 上面已经问过 8 句，后台那条归纳线程早该跑完了 —— 这里验的是"记忆归谁"，不是"模型概括得好不好"。
time.sleep(8)
ma = requests.get(BASE + "/api/memory", headers=H, timeout=30).json()
check("问过几轮后自动长出画像", bool(ma["memory"]), f'{ma["questions"]} 问 → ' + ma["memory"][:36])
mb = requests.get(BASE + "/api/memory", headers={"Authorization": "Bearer " + tokb}, timeout=30).json()
check("另一个账号一句没问，画像必须是空的（记忆不串号）",
      mb["memory"] == "" and mb["questions"] == 0, str(mb)[:70])
h_before = requests.get(BASE + "/api/history", headers=H, params={"session": sid}, timeout=30).json()["messages"]
requests.delete(BASE + "/api/memory", headers=H, timeout=30)
mc = requests.get(BASE + "/api/memory", headers=H, timeout=30).json()
check("清空 = 画像为空且标 paused（说停就得真停，别下一句又长回来）",
      mc["memory"] == "" and mc["paused"] is True and mc["due"] is False, str(mc)[:70])
check("清空记忆不动历史消息",
      len(requests.get(BASE + "/api/history", headers=H, params={"session": sid},
                       timeout=30).json()["messages"]) == len(h_before), f"{len(h_before)} 条")
md = requests.post(BASE + "/api/memory/refresh", headers=H, timeout=180).json()
check("手动「重新归纳」能恢复", bool(md["memory"]) and md["paused"] is False, md["memory"][:36])

# ---------------- 拍照提问：图 -> 题目文字 -> 原来那条检索链 ----------------
# fixture（tests/fixtures/prob_l4.png）是《概率论与数理统计》第 186 页例 4 那张截图。
# 全程没有人告诉系统这张图在书的第几页 —— 倒数第二条验的就是那段识别出来的文字
# 自己把第 186 页捞了回来。这就是"先转写再提问"而不是"把图直接丢给模型"的理由。
bz = requests.get(BASE + "/api/bootstrap", headers=H, timeout=20).json().get("vision") or {}
check("bootstrap 说清了拍照能不能用（前端据此决定画不画 📷）",
      isinstance(bz.get("available"), bool),
      "{} / {} / 上限 {} MB".format(bz.get("available"), bz.get("model"), bz.get("max_mb")))
check("未带 token 的识别请求被拒",
      requests.post(BASE + "/api/vision",
                    json={"image": "data:image/png;base64,AAAA"}).status_code == 401)
bad = requests.post(BASE + "/api/vision", headers=H,
                    json={"image": "data:text/plain;base64,AAAA"}, timeout=20)
check("非图片格式 400 且说人话",
      bad.status_code == 400 and "PNG" in bad.json().get("detail", ""),
      bad.json().get("detail", "")[:38])
big = requests.post(BASE + "/api/vision", headers=H, timeout=30,
                    json={"image": "data:image/png;base64,"
                          + base64.b64encode(bytes(7_000_000)).decode()})
check("超上限的图 400 挡回（在花钱那一步之前就拦住）",
      big.status_code == 400 and "MB" in big.json().get("detail", ""),
      big.json().get("detail", "")[:44])
fat = requests.post(BASE + "/api/chat", headers=H, timeout=30,
                    data=b'{"question":"\xe9\x97\xae\xe4\xb8\x80\xe4\xb8\x8b","image":"'
                         + b"A" * 3_000_000 + b'"}')
check("把原图贴进 /api/chat 也是 413（读体之前就拦，不白答一次题）",
      fat.status_code == 413 and "MB" in fat.text, fat.text[:44])
fixture = os.path.join(os.path.dirname(os.path.abspath(__file__)), "fixtures", "prob_l4.png")
if not bz.get("available"):
    check("provider=stub：没有眼睛，直说（跳过真图那四条）", True, str(bz))
elif not os.path.exists(fixture):
    check("缺 tests/fixtures/prob_l4.png，真图那四条没法测", False, fixture)
else:
    data_url = "data:image/png;base64," + base64.b64encode(open(fixture, "rb").read()).decode()
    t0 = time.perf_counter()
    v = requests.post(BASE + "/api/vision", headers=H, json={"image": data_url}, timeout=120)
    sec = round(time.perf_counter() - t0, 2)
    vd = v.json() if v.status_code == 200 else {}
    txt = vd.get("text", "")
    check("一张题目截图 -> 可编辑的文字", v.status_code == 200 and len(txt) > 30,
          "{} s / {} 字 / in={} out={}".format(sec, len(txt), vd.get("in_tokens"), vd.get("out_tokens")))
    check("数字一个都不许认错（0.015 与 0.5 都在）", "0.015" in txt and "0.5" in txt,
          "".join(txt.split())[:40])
    check("只转写不作答（不许顺手把假设检验做了）",
          not any(w in txt for w in ("拒绝原假设", "接受原假设", "结论：", "答案")),
          txt[-30:].replace("\n", " "))
    # 缩略图跟着这条一起发：气泡显示图，字折在下面，检索照旧用那段字
    thumb = "data:image/jpeg;base64," + base64.b64encode(
        b"\xff\xd8\xff\xe0" + b"THUMBDATA" * 32).decode()
    evs8, ans8 = events(txt, sid, tok, from_image=True, image=thumb)
    refs8 = [d.get("ref") or d for k8, d, _ in evs8 if k8 == "citation"]
    pages8 = [c.get("page") for c in refs8 if c.get("page")]
    check("识别出的文字自己检索到了那一页（页码不靠模型回忆）",
          bool(pages8) and any(180 <= p <= 190 for p in pages8)
          and any("概率论" in (c.get("book") or "") for c in refs8),
          "第 " + "、".join(str(p) for p in pages8[:3]) + " 页")
    h8 = requests.get(BASE + "/api/history", headers=H, params={"session": sid},
                      timeout=20).json()["messages"]
    check("历史里那条标着「拍照识别」（src=photo 在重放后还在）",
          any(m["role"] == "user" and m.get("src") == "photo" for m in h8[-2:]),
          str([(m["role"], m.get("src") or "-") for m in h8[-2:]])[:56])
    mine = [m for m in h8[-2:] if m["role"] == "user"]
    check("那条消息把缩略图带回来了（刷新之后气泡还是图，不是退回一段字）",
          bool(mine) and mine[-1].get("image") == thumb,
          "{} 字缩略图".format(len(mine[-1].get("image") or "") if mine else 0))
    check("图只是显示件：正文里存的就是那段识别出来的文字，能接着追问",
          bool(mine) and mine[-1].get("content") == txt, str(len(txt)) + " 字")
    check("手打的那些条不带图（image 默认空串，不是 null）",
          all(m.get("image") == "" for m in h8 if m["role"] == "user" and m.get("src") != "photo"),
          str(sorted({repr(m.get("image")) for m in h8 if m.get("src") != "photo"})[:1])[:36])
print("=" * 68)
print("全部通过" if not fails else "失败项：" + "；".join(fails))
sys.exit(1 if fails else 0)
