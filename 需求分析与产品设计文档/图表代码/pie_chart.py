# -*- coding: utf-8 -*-
"""
任务量分布饼图生成脚本（北交大像素校园 · AI 万事通）

口径：张路坤（组长）任务占比 21.6%（含地图建模、向导、猫宠与全组统筹、合体联调）；
     其余四位成员平分剩余 78.4%，即每人 19.6%。

输出：图片/任务饼图/任务饼图.png
依赖：matplotlib（中文字体使用 Microsoft YaHei / SimHei）
"""
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

plt.rcParams["font.sans-serif"] = ["Microsoft YaHei", "SimHei", "DejaVu Sans"]
plt.rcParams["axes.unicode_minus"] = False

OUT = r"D:\Desktop\像素校园项目总目录\需求分析与产品设计文档\图片\任务饼图\任务饼图.png"

# ---------------------------------------------------------------- 数据
LEADER_PCT = 21.6                      # 组长占比
members = ["张路坤", "文腾", "王睿", "陈梦茹", "何珺艺"]
duties = ["地图建模 · 向导 · 猫宠 · 统筹与合体",
          "学霸哥（课业答疑）",
          "算法哥（判题与题单）",
          "阿姨 · 丙（食堂）",
          "保安 · 老丁（安保）"]
others = round((100.0 - LEADER_PCT) / 4, 1)      # 19.6
sizes = [LEADER_PCT] + [others] * 4
colors = ["#3F72B5", "#5B9BD5", "#4E9B62", "#C8912F", "#9B6BB5"]
explode = [0.06, 0, 0, 0, 0]

labels = ["%s\n%.1f%%" % (m, s) for m, s in zip(members, sizes)]

fig, ax = plt.subplots(figsize=(7.6, 5.6), dpi=200)
fig.patch.set_facecolor("white")

wedges, texts, autotexts = ax.pie(
    sizes, labels=labels, colors=colors, explode=explode,
    autopct="%1.1f%%", pctdistance=0.62, labeldistance=1.10,
    startangle=90, counterclock=False,
    wedgeprops=dict(edgecolor="white", linewidth=1.6),
    textprops=dict(fontsize=10.5, color="#1F2430"),
    shadow=False,
)
for t in autotexts:
    t.set_fontsize(9.5)
    t.set_color("white")
    t.set_fontweight("bold")

ax.text(0, 0, "5 人\n分工", ha="center", va="center", fontsize=12,
        fontweight="bold", color="#1B3A66")
ax.set_aspect("equal")

legend_labels = ["%s（%s）— %.1f%%" % (m, d, s) for m, d, s in zip(members, duties, sizes)]
ax.legend(wedges, legend_labels, loc="upper center", bbox_to_anchor=(0.5, 0.045),
          ncol=2, frameon=False, fontsize=8.8, handlelength=1.2, columnspacing=1.4)

ax.set_title("北交大像素校园 · AI 万事通  项目任务量分布\n"
             "全组 5 人 · 合计 100% · 组长 21.6%，其余四人各 19.6%",
             fontsize=12.5, fontweight="bold", color="#1F2430", pad=16)

fig.subplots_adjust(left=0.02, right=0.98, top=0.88, bottom=0.155)
fig.savefig(OUT, dpi=200, facecolor="white")
print("saved:", OUT)
print("占比 =", sizes, "合计 =", round(sum(sizes), 2))
