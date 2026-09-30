"""从共用的《像素校园·全校地图》里抽出**校园信息切片**（学霸哥自带的兜底语料）。

地图 HTML 里的 `CAMPUS` 表是 PPT §5.1 全表（52 条：名称/类型/英寸坐标），
是本项目里唯一现成的公共数据。它正好能当 §2.5 那条"校园信息问答（兜底）"的料。

标尺（与地图同源，只这一处）：思源楼世界宽 450 px = 50 m，PPT 宽 1.1521 in
⇒ 1 英寸 = 50 / 1.1521 = 43.399 m。

产出 `kb/sources/campus.md`（`source_type: campus_info`）——
所以"多一类资料"这件事，在检索层是**零改动**，只是多一个源文件。
"""

from __future__ import annotations

import argparse
import os
import re
import sys

METERS_PER_INCH = 50.0 / 1.1521          # 43.399
ROW = re.compile(r'\["([^"]+)",\s*"([a-z]+)",\s*([-\d.]+),\s*([-\d.]+),\s*([-\d.]+),\s*([-\d.]+)\]')
# 总平面表里只有数据分类名（"水域"），但湖有正式称呼。不补这一层，用户问
# 「明湖多大」就一个字都匹不上 —— 这是数据对接问题，不是检索算法问题。
ALIAS = {"水域": "明湖"}

KIND_CN = {
    "bld": "建筑", "grass": "草坪/绿地", "bball": "篮球场", "tennis": "网球场",
    "run": "跑道", "water": "水域", "plaza": "广场", "road": "道路",
    "tree": "绿化", "gate": "校门", "wall": "围墙", "field": "场地",
}


def find_map_html(start: str) -> str | None:
    """从交付件目录往上找最多 3 层，地图 HTML 通常在同级的 campus_game/ 里。"""
    d = start
    for _ in range(4):
        if not os.path.isdir(d):
            break
        for dirpath, dirnames, filenames in os.walk(d):
            if dirpath.count(os.sep) - d.count(os.sep) > 2:
                dirnames[:] = []
                continue
            for f in filenames:
                if f.endswith(".html") and ("地图" in f or "campus" in f.lower()):
                    return os.path.join(dirpath, f)
        parent = os.path.dirname(d)
        if parent == d:
            break
        d = parent
    return None


def slices_from(rows: list[tuple]) -> list[str]:
    out = ["---", "course: 校园信息", "book: 校园总平面（像素校园 §5.1 全表）",
           "book_id: campus", "source_type: campus_info", "---", ""]
    for i, (name, kind, x, y, w, h) in enumerate(rows):
        cn = KIND_CN.get(kind, kind)
        mw, mh = w * METERS_PER_INCH, h * METERS_PER_INCH
        out.append(f"[page:{i + 1}]")
        out.append(f"## {name}")
        alias = ALIAS.get(name, "")
        head = f"{name}（{alias}）" if alias else name
        out.append(
            f"{head}是校园总平面里的一项{cn}（数据分类 {kind}）。"
            f"图幅原点起算，东偏 {x * METERS_PER_INCH:.0f} 米、南偏 {y * METERS_PER_INCH:.0f} 米，"
            f"东西向 {mw:.0f} 米、南北向 {mh:.0f} 米，占地约 {mw * mh:.0f} 平方米。"
        )
        if kind == "bld":
            floors = 6 if "宿舍" in name else (4 if "教学楼" in name else 3)
            out.append(f"{name}按{floors}层建筑渲染；同名的楼在总平面里可能有多栋，问路时要用完整名称区分。")
        out.append("")
    return out


def main(argv=None) -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--map-html", default=None)
    a = ap.parse_args(argv)
    here = os.path.dirname(os.path.abspath(__file__))
    path = a.map_html or find_map_html(os.path.dirname(here))
    if not path:
        print("[!] 没找到《像素校园·全校地图.html》，跳过校园切片。", file=sys.stderr)
        return 1
    with open(path, "r", encoding="utf-8") as fh:
        text = fh.read()
    rows = [(m.group(1), m.group(2), float(m.group(3)), float(m.group(4)), float(m.group(5)), float(m.group(6)))
            for m in ROW.finditer(text)]
    if not rows:
        print("[!] CAMPUS 表格式变了，正则没匹配上 —— 去看 kb/load_campus.py:ROW", file=sys.stderr)
        return 1
    out_dir = os.path.join(here, "sources")
    os.makedirs(out_dir, exist_ok=True)
    out = os.path.join(out_dir, "campus.md")
    with open(out, "w", encoding="utf-8") as fh:
        fh.write("\n".join(slices_from(rows)).rstrip() + "\n")
    print(f"[OK] 从 {os.path.basename(path)} 抽出 {len(rows)} 条 → {out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
