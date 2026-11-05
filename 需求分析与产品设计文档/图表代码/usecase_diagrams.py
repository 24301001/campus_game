# -*- coding: utf-8 -*-
"""
北交大像素校园 · AI 万事通 —— 总体用例图（4 张）
用 matplotlib 直接绘制：全部连线都是两点之间的直线，无拐弯。
排布规则（对齐用户给的示例）：
  1) 基础用例在主列纵向错落排布，外部角色连到它们；
  2) 被 include / extend 的"派生用例"移到其基础用例右侧一列（左右排布），
     因此虚线箭头基本水平，指向一目了然；
  3) include / extend 的派生用例不连外部角色。
用例椭圆大小与位置错落分布，外部角色不必左右对称。
输出：图片/总体用例图/*.png
"""
import math
import os
import random
import shutil

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Ellipse, FancyBboxPatch, Circle
from matplotlib.font_manager import FontProperties

BASE = r"D:\Desktop\像素校园项目总目录\需求分析与产品设计文档"
OUTDIR = os.path.join(BASE, "图片", "总体用例图")
CODEDIR = os.path.join(BASE, "图表代码")

C_LINE = "#6B7280"
C_BOX = "#2F5D8C"
C_FILL = "#F7F9FC"
C_ACT = "#333333"

# ---- 版式常量 ----
XC = 4.40       # 主列（基础用例）基准 x
XCOL = 4.40     # 派生用例列的横向间距（留出虚线箭头与标签的位置）
XA = 0.0        # 左侧角色基准 x
XG = 11.60      # 右侧角色基准 x
S = 0.66        # 每数据单位对应的英寸数（控制出图尺寸）
PT_PER_UNIT = 72 * S    # 1 个数据单位 = 多少 pt

FONT = r"C:\Windows\Fonts\msyh.ttc"
FONTB = r"C:\Windows\Fonts\msyhbd.ttc"
FP = FontProperties(fname=FONT if os.path.exists(FONT) else None)
FPB = FontProperties(fname=FONTB if os.path.exists(FONTB) else None)

FIGURES = [
    dict(
        seed=11,
        out="图2-1_总体总览.png",
        title="像素校园 · AI 万事通",
        ucs=["登录 / 注册", "漫游地图", "与角色对话", "导航", "学业",
             "算法", "食堂", "安保", "猫宠陪伴"],
        primary=[("玩家", list(range(9)))],
        secondary=[],
        # (基础用例, 派生用例, 关系)：导航 ← 与角色对话；学业 ← 算法
        relations=[(3, 2, "include"), (4, 5, "include")],
    ),
    dict(
        seed=23,
        out="图2-2_新生引导与陪伴.png",
        title="新生引导与陪伴",
        ucs=["校园导览", "问路与带路", "定位与辨认", "按需求找地方", "逗猫与喂猫", "点亮猫图鉴"],
        primary=[("新生", [0, 1, 2, 3]), ("全校师生", [4, 5])],
        secondary=[("向导 · 小北", [0, 1, 2, 3]), ("猫宠", [4, 5])],
        # 校园导览 ← 问路与带路（扩展）；逗猫与喂猫 → 点亮猫图鉴（包含）
        relations=[(0, 1, "extend"), (4, 5, "include")],
    ),
    dict(
        seed=37,
        out="图2-3_学习与成长.png",
        title="学习与成长",
        ucs=["分级提示", "在线判题", "学情分析与归因", "动态题单推荐", "查看排名榜单",
             "课本问答", "解题辅导", "往年资料查询", "复习规划"],
        primary=[("求职 / 升学人群", [0, 1, 2, 3, 4]), ("在校生", [5, 6, 7, 8])],
        secondary=[("算法哥", [0, 1, 2, 3, 4]), ("学霸哥", [5, 6, 7, 8])],
        # 在线判题 → 分级提示（包含）；课本问答 → 解题辅导（包含）
        relations=[(1, 0, "include"), (5, 6, "include")],
    ),
    dict(
        seed=59,
        out="图2-4_生活与安全.png",
        title="生活与安全",
        ucs=["以图搜物", "失物招领", "呼叫保安到场", "证件识别与核对", "报修与工单查询",
             "窗口与菜品查询", "口碑问答", "排队与实时状态", "两层档口地图", "打分"],
        primary=[("全校师生", list(range(10)))],
        secondary=[("保安 · 老丁", [0, 1, 2, 3, 4]), ("阿姨 · 丙", [5, 6, 7, 8, 9])],
        # 以图搜物 → 失物招领（包含）；窗口与菜品查询 → 口碑问答（包含）
        relations=[(0, 1, "include"), (5, 6, "include")],
    ),
]


def text_half_width(s, fs=9.5):
    """估算文字半宽（数据单位）。"""
    w = 0.0
    for ch in s:
        w += fs if ord(ch) > 0x2E7F else fs * 0.52
    return w / 2 / PT_PER_UNIT


def derived_set(relations):
    return {b for _, b, _ in relations}


def build_layout(ucs, relations, seed):
    """基础用例在主列纵向错落；派生用例（include/extend 的被指向方）
    放到其基础用例右侧一列，与该基础用例基本同一水平线，使虚线箭头近乎水平。"""
    rnd = random.Random(seed)
    phase = rnd.uniform(0.0, 2 * math.pi)
    der = derived_set(relations)
    bases = {}
    for a, b, _ in relations:
        bases.setdefault(b, []).append(a)

    items = [None] * len(ucs)
    y = 0.0
    # 主列：基础用例
    for i, name in enumerate(ucs):
        if i in der:
            continue
        hw = text_half_width(name)
        rx = max(1.22, hw + 0.60) * (0.94 + 0.26 * rnd.random())
        ry = 0.235 + 0.055 * rnd.random()
        cx = XC + 0.38 * math.sin(i * 1.05 + phase) + rnd.uniform(-0.14, 0.14)
        items[i] = dict(name=name, cx=cx, cy=y, rx=rx, ry=ry)
        y -= 0.76 + 0.12 * rnd.random()

    # 右列：派生用例，拉到基础用例右侧、同高
    placed = []
    for b in sorted(bases):
        hw = text_half_width(ucs[b])
        rx = max(1.22, hw + 0.60) * (0.94 + 0.22 * rnd.random())
        ry = 0.235 + 0.055 * rnd.random()
        cy = sum(items[a]["cy"] for a in bases[b]) / len(bases[b]) + rnd.uniform(-0.08, 0.08)
        while any(abs(cy - py) < 0.72 for py in placed):   # 右列内不重叠
            cy -= 0.46
        placed.append(cy)
        cx = XC + XCOL + rnd.uniform(-0.10, 0.24)
        items[b] = dict(name=ucs[b], cx=cx, cy=cy, rx=rx, ry=ry)
    return items


def ellipse_point(it, tx, ty):
    """椭圆边界上、朝向 (tx, ty) 的那一点。"""
    dx, dy = tx - it["cx"], ty - it["cy"]
    if dx == 0 and dy == 0:
        return it["cx"], it["cy"]
    k = 1.0 / math.sqrt((dx / it["rx"]) ** 2 + (dy / it["ry"]) ** 2)
    return it["cx"] + k * dx, it["cy"] + k * dy


def draw_stickman(ax, x, y, label, fs=9.5):
    ax.add_patch(Circle((x, y + 0.36), 0.17, fc="none", ec=C_ACT, lw=1.2, zorder=3))
    ax.plot([x, x], [y + 0.19, y - 0.16], color=C_ACT, lw=1.2, zorder=3)
    ax.plot([x - 0.24, x + 0.24], [y + 0.02, y + 0.02], color=C_ACT, lw=1.2, zorder=3)
    ax.plot([x, x - 0.19], [y - 0.16, y - 0.55], color=C_ACT, lw=1.2, zorder=3)
    ax.plot([x, x + 0.19], [y - 0.16, y - 0.55], color=C_ACT, lw=1.2, zorder=3)
    ax.text(x, y - 0.78, label, ha="center", va="top", fontproperties=FP,
            fontsize=fs, color=C_ACT)


def draw(fig):
    ucs = fig["ucs"]
    items = build_layout(ucs, fig["relations"], fig["seed"])
    rnd = random.Random(fig["seed"] + 101)

    # ---- 角色站位的轻微不齐（左右不镜像） ----
    def place(side, idx, k):
        y = sum(items[i]["cy"] for i in idx) / len(idx) + rnd.uniform(-0.22, 0.22)
        if side == "L":
            x = XA + rnd.uniform(-0.34, 0.16) - 0.08 * k
        else:
            x = XG + rnd.uniform(-0.16, 0.34) + 0.08 * k
        return x, y

    actors = []
    der = derived_set(fig["relations"])
    for k, (label, idx) in enumerate(fig["primary"]):
        idx = [i for i in idx if i not in der]      # 派生用例不连外部实体
        if idx:
            actors.append(("L", label, idx) + place("L", idx, k))
    for k, (label, idx) in enumerate(fig["secondary"]):
        idx = [i for i in idx if i not in der]
        if idx:
            actors.append(("R", label, idx) + place("R", idx, k))

    # ---- 画面范围 ----
    bx0 = min(it["cx"] - it["rx"] for it in items) - 0.50
    bx1 = max(it["cx"] + it["rx"] for it in items) + 0.50
    by1 = max(it["cy"] + it["ry"] for it in items) + 0.42
    by0 = min(it["cy"] - it["ry"] for it in items) - 0.42

    x0 = bx0 - 0.88
    x1 = bx1 + 0.88
    ybot = by0
    for side, label, idx, ax_, ay_ in actors:
        hw = text_half_width(label)
        x0 = min(x0, ax_ - hw - 0.12)
        x1 = max(x1, ax_ + hw + 0.12)
        ybot = min(ybot, ay_ - 0.92)
    ytop = by1 + 0.48

    # 画面过窄时左右对称留白，避免出图过于瘦高（插入文档时才不会太高）
    need = (ytop - ybot) / 0.95 - (x1 - x0)
    if need > 0:
        x0 -= need / 2
        x1 += need / 2

    f, ax = plt.subplots(figsize=((x1 - x0) * S, (ytop - ybot) * S), dpi=200)
    ax.set_xlim(x0, x1)
    ax.set_ylim(ybot, ytop)
    ax.set_aspect("equal")
    ax.axis("off")
    f.subplots_adjust(left=0, right=1, top=1, bottom=0)

    # ---- 系统边界 ----
    ax.add_patch(FancyBboxPatch((bx0, by0), bx1 - bx0, by1 - by0,
                                boxstyle="square,pad=0", fc="none",
                                ec=C_BOX, lw=1.1, zorder=1))
    ax.text((bx0 + bx1) / 2, by1 + 0.12, fig["title"], ha="center", va="bottom",
            fontproperties=FPB, fontsize=10.5, color=C_BOX, zorder=4)

    # ---- 用例椭圆 ----
    for it in items:
        ax.add_patch(Ellipse((it["cx"], it["cy"]), 2 * it["rx"], 2 * it["ry"],
                             fc=C_FILL, ec=C_BOX, lw=1.0, zorder=2))
        ax.text(it["cx"], it["cy"], it["name"], ha="center", va="center",
                fontproperties=FP, fontsize=9.5, color="#1F3B57", zorder=4)

    # ---- 角色 + 关联实线（直线，端点落在椭圆边界） ----
    for side, label, idx, ax_, ay_ in actors:
        draw_stickman(ax, ax_, ay_, label)
        sx = ax_ + 0.30 if side == "L" else ax_ - 0.30
        for i in idx:
            px, py = ellipse_point(items[i], ax_, ay_)
            ax.plot([sx, px], [ay_, py], color=C_LINE, lw=0.9, zorder=5)

    # ---- include / extend：两点直连的虚线 + 箭头（左右走向，近乎水平） ----
    for a, b, kind in fig["relations"]:
        if kind == "extend":
            src, dst = items[b], items[a]     # <<extend>> 箭头由扩展用例指向基础用例
        else:
            src, dst = items[a], items[b]     # <<include>> 箭头由基础用例指向被包含用例
        sx, sy = ellipse_point(src, dst["cx"], dst["cy"])
        ex, ey = ellipse_point(dst, src["cx"], src["cy"])
        dx, dy = ex - sx, ey - sy
        d = math.hypot(dx, dy)
        ux, uy = dx / d, dy / d
        ax.annotate("", xy=(ex - ux * 0.03, ey - uy * 0.03),
                    xytext=(sx + ux * 0.05, sy + uy * 0.05),
                    arrowprops=dict(arrowstyle="-|>", color=C_BOX, lw=1.0,
                                    linestyle=(0, (4, 2)), shrinkA=0, shrinkB=0),
                    zorder=6)
        mx, my = (sx + ex) / 2 + (-uy) * 0.20, (sy + ey) / 2 + ux * 0.20
        ax.text(mx, my, "<<" + kind + ">>", ha="center", va="center",
                fontproperties=FP, fontsize=7.5, color=C_BOX, zorder=7,
                bbox=dict(fc="white", ec="none", pad=0.9))

    os.makedirs(OUTDIR, exist_ok=True)
    path = os.path.join(OUTDIR, fig["out"])
    f.savefig(path, dpi=200, facecolor="white")
    plt.close(f)
    return path


if __name__ == "__main__":
    for fig in FIGURES:
        p = draw(fig)
        print("saved: %s  (%d KB)  %d 个用例" %
              (os.path.basename(p), os.path.getsize(p) // 1024, len(fig["ucs"])))
    os.makedirs(CODEDIR, exist_ok=True)
    shutil.copy(os.path.abspath(__file__), os.path.join(CODEDIR, "usecase_diagrams.py"))
    print("code copied ->", CODEDIR)
    print("OUT ->", OUTDIR)
