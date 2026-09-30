r"""HTTP 层：登录/注册、历史、SSE 聊天、**拍照识别**、出处详情、健康检查。

跑起来：

    .venv\Scripts\python.exe -m uvicorn backend.app:app --host 127.0.0.1 --port 8010

三个和部署直接相关的细节：

· **SSE 用同步生成器**（`def` 而不是 `async def`）。检索和 LLM 转发都是阻塞调用，
  放在事件循环里会把整个服务卡住；FastAPI 会把同步端点丢进线程池，天然并行。
· **响应头必须带 `X-Accel-Buffering: no`**。nginx 默认 `proxy_buffering on`，
  会把流式攒成几坨，观感上就是"一顿一顿蹦出一大段"，像卡死。上线第一件事查这个。
· **Key 只在服务端**（llm.py 里读），浏览器永远拿不到。
"""

from __future__ import annotations

import json
import os
import mimetypes
import time
from dataclasses import dataclass

from fastapi import Depends, FastAPI, HTTPException, Request
from fastapi.responses import FileResponse, JSONResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles

from . import auth, db, library, memory, prompts, vision
from .agent import Agent
from .llm import LLM, LLMError
from .retrieval.engine import SearchEngine
from .retrieval.store import Store
from .settings import MODELS_DIR, WEB_DIR, ensure_dirs, load_config

SSE_HEADERS = {"Cache-Control": "no-cache", "Connection": "keep-alive", "X-Accel-Buffering": "no"}
# 拍照那条请求体的硬上限。vision.check_size 管的是**图片本身**（默认 6 MB），
# 这一层管的是"一条请求能占掉多少内存"——base64 是 4/3 倍，再留一倍余量。
VISION_BODY_CAP = 16 * 1024 * 1024
# /api/chat 现在也会带一张图上来了（拍照那条气泡的缩略图，上限见 vision.THUMB_MAX_CHARS），
# 所以这里同样得有个体头上限。留了十倍余量：超了基本只可能是把原图贴上来了。
CHAT_BODY_CAP = 2 * 1024 * 1024


@dataclass
class Ctx:
    store: Store
    engine: SearchEngine
    llm: LLM
    agent: Agent
    vision: vision.Reader


ctx: Ctx | None = None
app = FastAPI(title="学霸哥", version="1.0")


@app.on_event("startup")
def startup() -> None:
    global ctx
    ensure_dirs()
    db.init_db()
    rcfg = load_config("retrieval", {})
    store = Store().load()
    engine = SearchEngine(store, rcfg)
    llm = LLM(load_config("llm", {}))
    ctx = Ctx(store, engine, llm, Agent(engine, llm), vision.Reader(llm))
    engine.search("启动自检：TCP 为什么需要三次握手", source_type="all")   # 预热分词器与首条查询
    print(f"[学霸哥] 索引 {store.stats()['n_docs']} 片 ｜ 课程 {store.stats()['courses']} ｜ LLM {llm.describe()}"
          f" ｜ 拍照 {ctx.vision.describe()}")


def need_user(req: Request) -> int:
    raw = req.headers.get("authorization", "")
    token = raw[7:].strip() if raw.lower().startswith("bearer ") else req.cookies.get("xbg_token", "")
    uid = auth.decode(token)
    if uid is None:
        raise HTTPException(status_code=401, detail="先登录")
    return uid


def sse(event: str, data: dict) -> str:
    return f"event: {event}\ndata: {json.dumps(data, ensure_ascii=False)}\n\n"


# ---------------- 账号 ----------------
def _authed(payload: dict, uid: int) -> JSONResponse:
    """把响应变成 JSONResponse 才能 set_cookie。
    cookie 是给**浏览器原生下载**用的（<a href> 带不了 Authorization 头）——
    fetch+blob 那条路会被安全软件/下载助手插一手（实测教材整本必挂 Failed to fetch），
    原生下载走浏览器自己的下载器，有进度、可断点续传、不经过页面 JS。
    HttpOnly：token 不给 JS 读（XSS 偷不走）；聊天接口仍走 localStorage 的 Bearer 头，两路并存。"""
    r = JSONResponse(payload)
    r.set_cookie("xbg_token", payload["token"], httponly=True, samesite="lax", max_age=30 * 86400)
    return r


@app.post("/api/register")
async def register(req: Request):
    body = await req.json()
    try:
        uid = db.create_user(str(body.get("nick", "")), str(body.get("password", "")))
    except db.AuthError as exc:
        raise HTTPException(400, str(exc)) from None
    sid = db.ensure_session(uid, None)
    return _authed({"token": auth.issue(uid), "user": {"id": uid, "nick": (body.get("nick") or "").strip()},
                    "session": sid}, uid)


@app.post("/api/login")
async def login(req: Request):
    body = await req.json()
    uid = db.verify(str(body.get("nick", "")), str(body.get("password", "")))
    if uid is None:
        raise HTTPException(401, "昵称或密码不对")
    row = db.user_by_id(uid)
    return _authed({"token": auth.issue(uid), "user": {"id": uid, "nick": row["nick"]},
                    "session": db.ensure_session(uid, body.get("session"))}, uid)


@app.get("/api/me")
def me(uid: int = Depends(need_user)):
    row = db.user_by_id(uid)
    return {"id": uid, "nick": row["nick"], "recent_courses": db.recent_courses(uid)}


@app.get("/api/bootstrap")
def bootstrap(uid: int = Depends(need_user)):
    st = ctx.store.stats()
    cfg = load_config("corpus", {})
    wanted = [{"course": r.get("course"), "book": r.get("book"), "状态": r.get("状态")}
              for r in cfg.get("语料", [])]
    persona = ctx.agent.persona
    return {"name": persona.get("显示名") or persona.get("role", "学霸哥"),
            "user": dict(db.user_by_id(uid)), "courses": st["courses"], "books": st["books"],
            "n_docs": st["n_docs"], "tokenizer": st["tokenizer"], "llm": ctx.llm.describe(),
            "embedding": st.get("embed_provider"), "vector_docs": st.get("vector_docs"),
            "planned_courses": wanted, "tools": [t["name"] for t in load_config("tools", {}).get("tools", [])],
            # 拍照按钮的显隐就认这一个字段：provider=stub 时前端不该给用户一个点了没反应的相机
            "vision": ctx.vision.describe()}


# ---------------- 历史 ----------------
@app.get("/api/sessions")
def sessions(uid: int = Depends(need_user)):
    return {"sessions": db.list_sessions(uid)}


@app.post("/api/session/new")
async def new_session(req: Request):
    uid = need_user(req)
    return {"session": db.ensure_session(uid, None)}


@app.delete("/api/session/{sid}")
def del_session(sid: str, uid: int = Depends(need_user)):
    """删除一段对话（连同里面的消息）。不是自己的会话 → 403，和历史读取同一套口径。"""
    try:
        gone = db.delete_session(sid, uid)
    except db.AuthError as exc:
        raise HTTPException(403, str(exc)) from None
    return {"deleted": bool(gone)}


@app.get("/api/history")
def history(req: Request, session: str = "", uid: int = Depends(need_user)):
    try:
        sid = db.ensure_session(uid, session or None)
    except db.AuthError as exc:
        raise HTTPException(403, str(exc)) from None
    msgs = db.list_messages(sid, uid)
    for m in msgs:
        try:
            m["refs"] = json.loads(m.get("refs") or "[]")
        except json.JSONDecodeError:
            m["refs"] = []
    return {"session": sid, "messages": msgs}


# ---------------- 长期记忆（跨会话，跟着 user_id 走） ----------------
@app.get("/api/memory")
def get_memory(uid: int = Depends(need_user)):
    """侧栏那块「记忆」卡片读的就是这里：画像正文 + 它知不知道自己被暂停了。"""
    return memory.info(uid)


@app.post("/api/memory/refresh")
async def refresh_memory(req: Request):
    """手动重算。用户当场点着等，所以这条是同步的（跟 SSE 后面那个后台归纳不是一回事）。"""
    uid = need_user(req)
    return {"memory": memory.refresh(uid, ctx.llm), **memory.info(uid)}


@app.delete("/api/memory")
def forget_memory(uid: int = Depends(need_user)):
    """清空画像并停掉自动归纳。**历史会话一条不动** —— "别记着我"和"删了我的聊天记录"
    是两件事，混在一起做早晚会惹出事故（而且这是不可逆的那种）。"""
    return memory.forget(uid)


# ---------------- 问答（SSE） ----------------
@app.post("/api/chat")
async def chat(req: Request, uid: int = Depends(need_user)):
    # 先看 Content-Length 再读体：读进来才发现超限，那份内存已经花掉了。
    cl = str(req.headers.get("content-length") or "")
    if cl.isdigit() and int(cl) > CHAT_BODY_CAP:
        raise HTTPException(413, f"请求体过大（{int(cl) / 1048576:.1f} MB，上限 "
                                 f"{CHAT_BODY_CAP / 1048576:g} MB）—— 缩略图该是前端压过的，"
                                 "这里不该出现原图")
    body = await req.json()
    q = str(body.get("question", "")).strip()
    if not q:
        raise HTTPException(400, "问题不能为空")
    course = (body.get("course") or "").strip() or None
    from_image = bool(body.get("from_image"))
    # image：那张题图的缩略图，**只用来把气泡画成图**。检索、答题、多轮上下文仍然只看 q 这段
    # 文字（`db.context_messages` 压根不选这一列），所以图压糊一点、甚至没存进去，都不影响答案。
    # 只有"这条确实是拍照来的"才收 —— src 和 image 得说同一件事。
    thumb = vision.clean_thumb(str(body.get("image") or "")) if from_image else ""
    try:
        sid = db.ensure_session(uid, body.get("session"))
    except db.AuthError as exc:
        raise HTTPException(403, str(exc)) from None
    history = db.context_messages(sid, uid, turns=int(load_config("llm", {}).get("history_turns", 6)))
    mem = memory.load(uid)                    # 跨会话画像：本会话没历史时也照样"认得这个人"
    db.set_session_title(sid, q)
    db.add_message(sid, uid, "user", q, src="photo" if from_image else "", image=thumb)

    def stream():
        parts: list[str] = []
        refs: list[dict] = []
        tool = ""
        yield sse("session", {"session": sid})
        try:
            no_source = 0
            for ev in ctx.agent.run(q, history=history, course=course, memory=mem,
                                    from_image=from_image):
                kind = ev.get("type")
                if kind == "meta":
                    tool = ev["tool"]
                    yield sse("meta", ev)
                elif kind == "citation":
                    yield sse("citation", ev["ref"])
                elif kind == "retrieval":
                    yield sse("retrieval", ev)
                elif kind == "related":
                    yield sse("related", ev)
                elif kind == "token":
                    parts.append(ev["text"])
                    yield sse("token", {"t": ev["text"]})
                elif kind == "done":
                    no_source = 1 if ev.get("no_source") else 0
                    refs = ev.get("refs") or []
                    yield sse("done", {k: v for k, v in ev.items() if k != "refs"})
                elif kind == "error":
                    yield sse("error", ev)
        except Exception as exc:                        # noqa: BLE001 - 宁可报错也别让前端永远转圈
            yield sse("error", {"message": f"{type(exc).__name__}: {exc}"[:300]})
        finally:
            text = "".join(parts).strip()
            if text:
                db.add_message(sid, uid, "assistant", text, tool,
                               json.dumps(refs, ensure_ascii=False), no_source=no_source)
            # 讲完再归纳：放在流中间就是把 14s 的回答变成 20s。攒够 EVERY 条才真调一次模型。
            memory.spawn(uid, ctx.llm)
            yield sse("end", {"at": int(time.time())})

    return StreamingResponse(stream(), media_type="text/event-stream", headers=SSE_HEADERS)


# ---------------- 拍照提问：图片 -> 题目文字 ----------------
@app.post("/api/vision")
async def read_image(req: Request, uid: int = Depends(need_user)):
    """一张图（`{image: "data:image/png;base64,…"}`）→ `{text, ms, model, in_tokens, out_tokens}`。

    **只转写、不作答**：这一次调用只出文字，答题是紧接着的**另一次** `/api/chat`（问题就是这段字）。
    前端默认识别完就自动发出去（图片条上「拍完直接问」可关，关掉就是先让人改完再发）。
    为什么不是一步到位把图丢给模型答题，见 `backend/vision.py` 开头那段。
    400 = 图片本身不行（格式／大小／什么都没认出来），413 = 请求体过大，502 = 服务商那头出错。
    """
    raw = await req.body()
    if len(raw) > VISION_BODY_CAP:
        raise HTTPException(413, f"图片太大（请求体 {len(raw) / 1048576:.1f} MB，上限 "
                                 f"{VISION_BODY_CAP / 1048576:g} MB）—— 只截题目那一块就行")
    try:
        body = json.loads(raw or b"{}")
    except json.JSONDecodeError:
        raise HTTPException(400, "请求体不是 JSON") from None
    try:
        return ctx.vision.read(str(body.get("image", "")))
    except vision.VisionError as exc:
        raise HTTPException(400, str(exc)) from None
    except LLMError as exc:
        raise HTTPException(502, f"识别没走通：{exc}"[:200]) from None


# ---------------- 出处 ----------------
@app.get("/api/chunk")
def chunk(i: str = "", uid: int = Depends(need_user)):
    c = ctx.store.by_id(i)
    if not c:
        raise HTTPException(404, "这个出处已经不在了（索引重建过？）")
    return c


@app.get("/api/health")
def health():
    return {"ok": True, "n_docs": len(ctx.store.chunks), "stats": ctx.store.stats(),
            "rerank": ctx.agent.engine.reranker.stats(),
            "llm": ctx.llm.describe(), "vision": ctx.vision.describe()}


@app.get("/api/library")
def library_api(uid: int = Depends(need_user)):
    """资料库面板的数据。现算不缓存：面板说"库里有什么"，说错比不说更坏。"""
    return library.build_payload(ctx.store.chunks, load_config("corpus", {}))


@app.get("/api/download")
def download(kind: str = "", id: str = "", uid: int = Depends(need_user)):
    # 登录才配下载；路径白名单在 library.resolve 里（含穿越演武，见 tests/test_library.py）
    path, err = library.resolve(load_config("corpus", {}), kind, id)
    if err:
        raise HTTPException(404 if not path else 400, err)
    return FileResponse(path, filename=os.path.basename(path))


@app.get("/library")
def library_page():
    return FileResponse(os.path.join(WEB_DIR, "library.html"))


@app.get("/")
def index():
    return FileResponse(os.path.join(WEB_DIR, "index.html"))


# Windows 上 mimetypes 是查注册表的：`.mjs` 会被猜成 text/plain，而浏览器对 ES module
# 严格校验 MIME，直接拒绝 import()（实测报 "Failed to fetch dynamically imported module"）。
# 端上那份 onnxruntime-web 就是 .mjs，所以这两个类型定死在这里，别指望系统注册表。
mimetypes.add_type("text/javascript", ".mjs")
mimetypes.add_type("application/wasm", ".wasm")

app.mount("/static", StaticFiles(directory=WEB_DIR), name="static")

# 端上那份 ONNX 模型单独一条 mount：Python 和浏览器读的是**同一份文件**，
# 谁也不许复制一份副本到 web/ 下（副本迟早和原件不一致，而那正是"两边向量对不上"的成因）。
# 目录不存在（还没跑 tools/get_onnx_assets.py）就不挂，服务照常起 —— 端上推理是可选件。
if os.path.isdir(MODELS_DIR):
    app.mount("/models", StaticFiles(directory=MODELS_DIR), name="models")
