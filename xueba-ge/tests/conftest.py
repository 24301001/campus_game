"""共用 fixture。

`tmpdb` 原来住在 tests/test_no_source.py 里，删除会话的测试也要用同一份临时库，
就提到这里来 —— 复制一份迟早出现"改了一处忘另一处"。
"""

import copy
import os
import sys

import pytest

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)


def offline_cfg() -> dict:
    r"""单测专用的检索配置：**强制 embedding=hash**。

    生产配置（`config/retrieval.json`）现在是 `api` —— 真语义向量。单测不能跟着它走：
      · 要外网和 Key，断网/换机器就全红，而且每条查询 174 ms；
      · 花的是真钱，跑一轮回归几十次调用，没道理；
      · 结果不可复现：服务商换模型版本，分数自己会漂。
    双路的**链路逻辑与 provider 无关**，所以单测照样测得着；向量空间的对齐由
    `engine._align_vectors` 负责（第一次遇到 api 索引时本地重算 hash，进程内缓存）。

    权重用的是 hash 空间扫出来的那组（0.12 / min_cos 0.2），**不是** api 的 0.25 / 0.45：
    旋钮是按向量空间定的，混用会测出一个和生产无关的排序。
    """
    from backend.settings import load_config

    cfg = copy.deepcopy(load_config("retrieval", {}) or {})
    emb = dict(cfg.get("embedding") or {})
    emb.update({"provider": "hash", "dim": int(emb.get("dim", 512) or 512)})
    emb.pop("model", None)
    cfg["embedding"] = emb
    weights = dict(cfg.get("weights") or {})
    weights.update({"bm25": 1.0, "vector": 0.12})
    cfg["weights"] = weights
    cfg["min_cos"] = 0.2
    rerank = dict(cfg.get("rerank") or {})
    rerank["provider"] = "none"                  # 单测不许调外网精排
    cfg["rerank"] = rerank
    return cfg

@pytest.fixture()
def tmpdb(tmp_path, monkeypatch):
    from backend import db
    monkeypatch.setattr(db, "DB_PATH", str(tmp_path / "t.db"))
    monkeypatch.setattr(db._local, "conn", None, raising=False)
    db.init_db()
    yield db
    c = getattr(db._local, "conn", None)
    if c is not None:
        c.close()
    db._local.conn = None
