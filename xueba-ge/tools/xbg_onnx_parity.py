# -*- coding: utf-8 -*-
"""端上向量的真正验收：不是 cos=1，而是**排序一样不一样**。

    node tools/xbg_embed_check.mjs                       # 分词逐 id 对齐（Node 就能验）
    powershell -File tools/run_onnx_page.ps1             # 无头浏览器跑 web/onnx.html
    python tools/xbg_onnx_parity.py                      # 拿浏览器那份向量在真索引上重排

浏览器 int8(wasm EP) 和服务端 int8(CPU EP) 的向量差 0.005~0.007（两套 int8 kernel 的残余）。
这个差别要不要紧，只看一件事：**top-k 还是不是那几片**。
"""
import json, os, sys

sys.path.insert(0, os.getcwd())
import numpy as np
from backend.retrieval.store import Store

SRC = sys.argv[1] if len(sys.argv) > 1 else ".tmp/browser_vecs.json"
IDX = sys.argv[2] if len(sys.argv) > 2 else "kb/index_onnx"
if not os.path.exists(SRC):
    raise SystemExit(f"[X] 没有 {SRC} —— 先跑 powershell -File tools/run_onnx_page.ps1")
data = json.load(open(SRC, encoding="utf-8"))
st = Store(IDX).load()
ref = json.load(open("web/fixtures/onnx_vectors.json", encoding="utf-8"))
pyv = {q: np.asarray(v, dtype=np.float32) for q, v in zip(ref["queries"], ref["vectors"])}
bad = 0
print(f"索引 {IDX}（{st.vec.n_docs} 片 / {st.vec.dim} 维）  embed_provider={st.meta.get('embed_provider')}")
for row in data["queries"]:
    q = row["query"]
    js = np.asarray(row["vec"], dtype=np.float32)
    if q not in pyv:
        print(f"[SKIP] {q}：基准里没有这条")
        continue
    srv = pyv[q]
    a = [st.chunks[i]["id"] for i, _ in st.vec.rank(srv, top=10)]
    b = [st.chunks[i]["id"] for i, _ in st.vec.rank(js, top=10)]
    same3 = a[:3] == b[:3]
    overlap = len(set(a) & set(b))
    cos = float(srv @ js / (np.linalg.norm(srv) * np.linalg.norm(js)))
    bad += 0 if same3 else 1
    print("%-22s cos=%.5f  top3 一致=%s  top10 重合=%d/10" % (q[:20], cos, "是" if same3 else "否", overlap))
    if not same3:
        print("        服务端 top3:", a[:3])
        print("        浏览器 top3:", b[:3])
print("\n结论：%d 条里 top3 不一致 %d 条" % (len(data["queries"]), bad))
sys.exit(1 if bad else 0)
