# -*- coding: utf-8 -*-
"""
计划工期甘特图生成脚本（北交大像素校园 · AI 万事通）

时间基准：第 1 周周一 = 2026-09-07，共 15 周（至 2026-12-20）
开发模式：敏捷开发，两周一个冲刺（Sprint），每周一次线上腾讯会议站会；
         第 1-6 周为 MVP 冲刺阶段（2026-10-16 交付 MVP）；
         第 7 周起每两周一个迭代，直至第 15 周结项。
         其中“智能体社交”为跨迭代的独立工作流（迭代 2–3，W9–W12）。

版式对齐项目内的《甘特图示例》：左侧“工作内容”列 + 顶部时间轴 + 横向条形，
时间轴由“月”改为“周（W1–W15）”，并按月分组、按敏捷冲刺分段。

输出：图片/计划工期甘特图/计划工期甘特图.png
依赖：matplotlib（中文字体使用 Microsoft YaHei / SimHei）
"""
import datetime as dt
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle, FancyBboxPatch
from matplotlib.lines import Line2D

plt.rcParams["font.sans-serif"] = ["Microsoft YaHei", "SimHei", "DejaVu Sans"]
plt.rcParams["axes.unicode_minus"] = False

# ---------------------------------------------------------------- 时间基准
START = dt.date(2026, 9, 7)        # 第 1 周周一
WEEKS = 15                         # 总周数
MVP_DATE = dt.date(2026, 10, 16)   # MVP 交付日（第 6 周周五）
END_DATE = dt.date(2026, 12, 20)   # 第 15 周周日（结项）

OUT = r"D:\Desktop\像素校园项目总目录\需求分析与产品设计文档\图片\计划工期甘特图\计划工期甘特图.png"

# ---------------------------------------------------------------- 配色
C_MVP = "#3F72B5"      # MVP 冲刺阶段
C_SPRINT = "#4E9B62"   # 敏捷迭代阶段
C_CROSS = "#C8912F"    # 贯穿全程
C_BAND = "#E8EEF7"     # 阶段分隔带底色
C_GRID = "#C9CFD8"
C_TXT = "#1F2430"
C_RED = "#C0392B"

# ---------------------------------------------------------------- 版式常量
LEFT = 8.6         # 左侧“工作内容”列宽度（周坐标单位）
H_ROW = 1.0        # 行高
H_MONTH = 1.05     # 表头：月份带
H_WEEK = 0.76      # 表头：周次带
H_MILE = 0.81      # 表头：里程碑带
H_HEAD = H_MONTH + H_WEEK + H_MILE

# ---------------------------------------------------------------- 行数据
# ("band", 文本)                                阶段分隔带
# ("task", 名称, 起始周, 结束周, 颜色)           普通任务条
# ("dots", 名称, 颜色)                          周期性短条（冲刺回顾）
ROWS = [
    ("band", "一、MVP 冲刺阶段（第 1–6 周 · 敏捷冲刺 1–3 · 2026-10-16 交付 MVP）"),
    ("task", "需求调研与《需求分析与产品设计文档》定稿", 1, 3, C_MVP),
    ("task", "地图底座：室外世界建模、相机与 baseY 遮挡排序", 3, 4, C_MVP),
    ("task", "室内场景：三栋楼建模 + 门表与场景切换", 4, 5, C_MVP),
    ("task", "向导 · 小北：图谱、问路与带路", 4, 6, C_MVP),
    ("task", "学霸哥：带出处课本问答与复习规划", 5, 6, C_MVP),
    ("task", "阿姨 · 丙：窗口事实与两层档口地图", 5, 6, C_MVP),
    ("task", "保安 · 老丁：失物匹配、以图搜物与工单", 5, 6, C_MVP),
    ("task", "猫宠：四只猫、好感档位与图鉴", 5, 6, C_MVP),
    ("task", "合体联调与 MVP 验收（单文件 HTML 零依赖）", 6, 6, C_MVP),

    ("band", "二、敏捷迭代阶段（第 7–15 周 · 每两周一个迭代 · 双周评审与回顾）"),
    ("task", "迭代 1：算法哥判题底座（Monaco + Docker 沙箱）", 7, 8, C_SPRINT),
    ("task", "迭代 2：L1–L4 分级提示、错误归因与检索调优", 9, 10, C_SPRINT),
    ("task", "迭代 3：角色主动行为、私密记忆与口碑众包", 11, 12, C_SPRINT),
    ("task", "智能体社交：角色间对话、关系边与消息传播", 9, 12, C_SPRINT),
    ("task", "迭代 4：场景扩展、性能与跨浏览器兼容优化", 13, 14, C_SPRINT),
    ("task", "结项：文档定稿、成果验收与答辩（12-20）", 15, 15, C_SPRINT),

    ("band", "三、贯穿全程（敏捷例会与节奏保障）"),
    ("task", "每周线上站会（腾讯会议，全组 5 人）", 1, 15, C_CROSS),
    ("dots", "冲刺评审与回顾（每两周一次 · W2/4/6/8/10/12/14）", C_CROSS),
]

# 月份分组（顶部时间轴）
MONTHS = [(dt.date(2026, 9, 7), dt.date(2026, 9, 30), "2026 年 9 月"),
          (dt.date(2026, 10, 1), dt.date(2026, 10, 31), "10 月"),
          (dt.date(2026, 11, 1), dt.date(2026, 11, 30), "11 月"),
          (dt.date(2026, 12, 1), dt.date(2026, 12, 20), "12 月")]


def wx(d):
    """日期 -> 周坐标（第 1 周左边界为 0，第 15 周右边界为 15）"""
    return (d - START).days / 7.0


n = len(ROWS)
fig, ax = plt.subplots(figsize=(10.4, 6.6), dpi=200)
fig.patch.set_facecolor("white")
ax.set_facecolor("white")
ax.set_xlim(-LEFT, WEEKS + 0.04)
ax.set_ylim(n + 0.12, -(H_HEAD + 0.10))     # y 向下增大
ax.axis("off")

# ---------------------------------------------------------------- 行底色
for i, row in enumerate(ROWS):
    if row[0] == "band":
        ax.add_patch(Rectangle((-LEFT, i), LEFT + WEEKS, H_ROW,
                               facecolor=C_BAND, edgecolor="none", zorder=1))
    elif i % 2 == 0:
        ax.add_patch(Rectangle((0, i), WEEKS, H_ROW,
                               facecolor="#FAFBFD", edgecolor="none", zorder=0))

# ---------------------------------------------------------------- 网格
for w in range(WEEKS + 1):
    ax.add_line(Line2D([w, w], [0, n], color=C_GRID, lw=0.5, zorder=2))
for m in [wx(a) for a, _, _ in MONTHS] + [wx(END_DATE)]:
    if 0 < m <= WEEKS:
        ax.add_line(Line2D([m, m], [0, n], color="#8A94A6", lw=0.9, zorder=2))
for i in range(1, n):
    ax.add_line(Line2D([-LEFT, WEEKS], [i, i], color=C_GRID, lw=0.5, zorder=2))

ax.set_xticks([])
ax.set_yticks([])

# ---------------------------------------------------------------- 表头
y_m = -H_HEAD                 # 月份带顶部
y_w = y_m + H_MONTH           # 周次带顶部
y_l = y_w + H_WEEK            # 里程碑带顶部（= 行区顶部 0）

# 月份带
for a, b, name in MONTHS:
    x0, x1 = wx(a), wx(b)
    ax.add_patch(Rectangle((x0, y_m), x1 - x0, H_MONTH,
                           facecolor="#DCE4F0", edgecolor="white", lw=1.0, zorder=3))
    ax.text((x0 + x1) / 2, y_m + H_MONTH / 2, name, ha="center", va="center",
            fontsize=10.5, color=C_TXT, zorder=4, fontweight="bold")
ax.add_patch(Rectangle((-LEFT, y_m), LEFT, H_MONTH,
                       facecolor="#DCE4F0", edgecolor="white", lw=1.0, zorder=3))
ax.text(-LEFT + LEFT / 2, y_m + H_MONTH / 2, "工作内容", ha="center", va="center",
        fontsize=11.5, color=C_TXT, zorder=4, fontweight="bold")

# 周次带
for w in range(1, WEEKS + 1):
    ax.add_patch(Rectangle((w - 1, y_w), 1, H_WEEK,
                           facecolor="#F1F5FA", edgecolor="white", lw=1.0, zorder=3))
    ax.text(w - 0.5, y_w + H_WEEK / 2, "W%d" % w, ha="center", va="center",
            fontsize=7.8, color="#4A5468", zorder=4)
ax.add_patch(Rectangle((-LEFT, y_w), LEFT, H_WEEK,
                       facecolor="#F1F5FA", edgecolor="white", lw=1.0, zorder=3))
ax.text(-LEFT + LEFT / 2, y_w + H_WEEK / 2, "周次（每两周 = 1 个 Sprint）",
        ha="center", va="center", fontsize=8.4, color="#4A5468", zorder=4)

# 里程碑带
ax.add_patch(Rectangle((-LEFT, y_l), LEFT + WEEKS, H_MILE,
                       facecolor="#FBF2F1", edgecolor="white", lw=1.0, zorder=3))
ax.text(-LEFT + 0.18, y_l + H_MILE / 2, "关键节点", ha="left", va="center",
        fontsize=8.6, color=C_RED, zorder=4, fontweight="bold")
xm = wx(MVP_DATE)
ax.add_patch(FancyBboxPatch((xm - 1.85, y_l + 0.09), 1.55, H_MILE - 0.18,
                            boxstyle="round,pad=0,rounding_size=0.08",
                            facecolor="white", edgecolor=C_RED, lw=0.9, zorder=4))
ax.text(xm - 1.075, y_l + H_MILE / 2, "MVP 交付 10-16", ha="center", va="center",
        fontsize=8.4, color=C_RED, zorder=5, fontweight="bold")
xe = wx(END_DATE)
ax.add_patch(FancyBboxPatch((xe - 1.75, y_l + 0.09), 1.55, H_MILE - 0.18,
                            boxstyle="round,pad=0,rounding_size=0.08",
                            facecolor="white", edgecolor=C_RED, lw=0.9, zorder=4))
ax.text(xe - 0.975, y_l + H_MILE / 2, "结项 12-20", ha="center", va="center",
        fontsize=8.4, color=C_RED, zorder=5, fontweight="bold")

# ---------------------------------------------------------------- 行内容
name_texts = []
for i, row in enumerate(ROWS):
    yc = i + H_ROW / 2
    if row[0] == "band":
        ax.text(-LEFT + 0.18, yc, row[1], ha="left", va="center",
                fontsize=10, color="#1B3A66", fontweight="bold", zorder=5)
        continue

    name = row[1]
    name_texts.append(ax.text(-LEFT + 0.18, yc, name, ha="left", va="center",
                              fontsize=9.3, color=C_TXT, zorder=5))

    if row[0] == "dots":
        for w in range(2, WEEKS, 2):
            ax.add_patch(FancyBboxPatch((w - 0.78, i + 0.30), 0.56, 0.40,
                                        boxstyle="round,pad=0,rounding_size=0.10",
                                        facecolor=row[2], edgecolor="none", zorder=4))
    else:
        _, _, w1, w2, color = row
        ax.add_patch(FancyBboxPatch((w1 - 1 + 0.14, i + 0.22), (w2 - w1 + 1) - 0.28, 0.56,
                                    boxstyle="round,pad=0,rounding_size=0.14",
                                    facecolor=color, edgecolor="none", zorder=4))

# ---------------------------------------------------------------- 关键节点竖线（仅在行区绘制，避开表格文字）
ax.add_line(Line2D([xm, xm], [0, n], color=C_RED, lw=1.2, ls=(0, (5, 3)), zorder=6))

# ---------------------------------------------------------------- 外框
ax.add_patch(Rectangle((-LEFT, y_m), LEFT + WEEKS, H_HEAD + n,
                       facecolor="none", edgecolor="#5A6478", lw=1.2, zorder=8))

# ---------------------------------------------------------------- 图例与标题
handles = [Rectangle((0, 0), 1, 1, facecolor=C_MVP, edgecolor="none"),
           Rectangle((0, 0), 1, 1, facecolor=C_SPRINT, edgecolor="none"),
           Rectangle((0, 0), 1, 1, facecolor=C_CROSS, edgecolor="none"),
           Line2D([0], [0], color=C_RED, lw=1.2, ls=(0, (5, 3)))]
ax.legend(handles, ["MVP 冲刺阶段（第 1–6 周）", "敏捷迭代阶段（第 7–15 周）",
                    "贯穿全程（每周站会 / 双周回顾）", "关键节点"],
          loc="upper center", bbox_to_anchor=(0.5, -0.004), ncol=4, frameon=False,
          fontsize=8.8, handlelength=1.5, handleheight=0.9, columnspacing=1.8)

ax.set_title("北交大像素校园 · AI 万事通  项目计划工期甘特图\n"
             "敏捷开发 · 两周一个 Sprint · 每周一次线上腾讯会议站会 · 第 1 周周一 = 2026-09-07",
             fontsize=12.5, fontweight="bold", color=C_TXT, pad=12)

fig.subplots_adjust(left=0.012, right=0.988, top=0.902, bottom=0.088)
fig.canvas.draw()

# ---------------------------------------------------------------- 版式自检：左列文字不得越过 x = 0
r = fig.canvas.get_renderer()
x_zero_px = ax.transData.transform((0, 0))[0]
overflow = []
for t in name_texts:
    if t.get_window_extent(renderer=r).x1 > x_zero_px - 4:
        overflow.append(t.get_text())
if overflow:
    print("!! 左列文字可能越界：")
    for s in overflow:
        print("   -", s)
else:
    print("版式自检通过：左列文字均在“工作内容”列内")

fig.savefig(OUT, dpi=200, facecolor="white")
print("saved:", OUT)
print("第 1 周周一 weekday =", START.weekday(), "(0 = 周一)｜ 共", WEEKS, "周｜ 总行数 =", n)
print("MVP 交付竖线 x =", round(xm, 3), "｜ 结项 =", END_DATE)
