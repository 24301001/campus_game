"""检索层：BM25（字面）+ 向量余弦（语义）+ RRF 融合 + 分库配额。

这一层**只读**，不碰账号、不碰 LLM、不碰前端 —— 唯一职责是
「给一个问题，还回带出处的课本片段榜单」。其他角色要复用检索，
复用的也就是这一层加 `kb/` 的切片格式。
"""

from .store import Store
from .engine import SearchEngine, SearchHit

__all__ = ["Store", "SearchEngine", "SearchHit"]