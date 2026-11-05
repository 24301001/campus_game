# -*- coding: utf-8 -*-
"""
北交大像素校园 · AI 万事通 —— 总体顶层架构图（图 3-1）
版式对齐用户提供的示例：整体一个大矩形，内部横向分层；层名写在左侧窄栏；
模块用小矩形；数据存储用圆柱。坐标系 = 插入文档后的厘米（设计宽 12.4 cm，插入 12.0 cm），
因此图内字号所见即所得。所有模块文字自动缩放以保证不溢出。
输出：图片/总体顶层架构图/总体顶层架构图.png
"""
import os
import shutil

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, Rectangle, Ellipse
from matplotlib.font_manager import FontProperties

BASE = r"D:\Desktop\像素校园项目总目录\需求分析与产品设计文档"
OUTDIR = os.path.join(BASE, "图片", "总体顶层架构图")
OUTPNG = os.path.join(OUTDIR, "总体顶层架构图.png")
CODEDIR = os.path.join(BASE, "图表代码")

FONT = r"C:\Windows\Fonts\msyh.ttc"
FONTB = r"C:\Windows\Fonts\msyhbd.ttc"
FP = FontProperties(fname=FONT if os.path.exists(FONT) else None)
FPB = FontProperties(fname=FONTB if os.path.exists(FONTB) else None)

C_BORDER = "#2F5D8C"
C_BAND = "#F8FAFD"
C_LABEL = "#DCE6F2"
C_LABEL_T = "#1F3B57"
C_BOX = "#FFFFFF"
C_BOX_E = "#7A9CC0"
C_CYL = "#EDF2F9"
C_TXT = "#1F3B57"
C_TXT2 = "#4A6B8A"

W, H = 12.4, 7.60          # 设计尺寸（cm）
LX0, LX1 = 0.20, 12.20     # 大矩形（系统边界）
LBW = 1.32                 # 左侧层名栏宽
CX0, CX1 = 1.75, 12.10     # 模块区左右

FIG = plt.figure(figsize=(W / 2.54, H / 2.54), dpi=300)
AX = FIG.add_axes([0, 0, 1, 1])
AX.set_xlim(0, W)
AX.set_ylim(0, H)
AX.set_aspect("equal")
AX.axis("off")

WARN = []


def text_w(s, fs):
    """按中英文估算文字宽度（cm）：CJK 记 1 em，其余记 0.52 em。"""
    n = 0.0
    for ch in s:
        n += 1.0 if ord(ch) > 0x2E7F else 0.52
    return n * fs / 72 * 2.54


def fit_fs(text, width, fs_max, fs_min=5.6, pad=0.90, tag=""):
    longest = max((text_w(ln, fs_max) for ln in text.split("\n")), default=0.0)
    if longest <= width * pad or longest == 0:
        return fs_max
    fs = fs_max * (width * pad) / longest
    if fs < fs_min:
        WARN.append("%s 文字过长，已按最小字号绘制: %r" % (tag, text))
        return fs_min
    return fs


def box(x, y, w, h, text, fs=8.0, fill=C_BOX, ec=C_BOX_E, lw=0.8, color=C_TXT):
    AX.add_patch(FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0,rounding_size=0.06",
                                fc=fill, ec=ec, lw=lw, zorder=3))
    f = fit_fs(text, w, fs, 5.4, tag="模块")
    AX.text(x + w / 2, y + h / 2, text, ha="center", va="center", fontproperties=FP,
            fontsize=f, color=color, zorder=4, linespacing=1.30 if "\n" in text else 1.0)


def cylinder(x, y, w, h, text, fs=7.4):
    """圆柱：上椭圆 + 长方柱 + 下弧，经典"数据库"表示法。"""
    ry = min(0.15, h * 0.16)
    AX.add_patch(Rectangle((x, y + ry), w, h - 2 * ry, fc=C_CYL, ec="none", zorder=3))
    AX.plot([x, x], [y + ry, y + h - ry], color=C_BORDER, lw=0.9, zorder=3.6)
    AX.plot([x + w, x + w], [y + ry, y + h - ry], color=C_BORDER, lw=0.9, zorder=3.6)
    AX.add_patch(Ellipse((x + w / 2, y + ry), w, 2 * ry, fc=C_CYL, ec=C_BORDER,
                         lw=0.9, zorder=3.5))
    AX.add_patch(Ellipse((x + w / 2, y + h - ry), w, 2 * ry, fc=C_CYL, ec=C_BORDER,
                         lw=0.9, zorder=3.7))
    f = fit_fs(text, w, fs, 5.2, tag="圆柱")
    AX.text(x + w / 2, y + h / 2 - ry * 0.30, text, ha="center", va="center",
            fontproperties=FP, fontsize=f, color=C_TXT, zorder=5, linespacing=1.28)


def row(y_top, h, texts, fs=8.0, gap=0.16, widths=None, kind="box"):
    n = len(texts)
    if widths is None:
        widths = [(CX1 - CX0 - gap * (n - 1)) / n] * n
    else:
        gap = (CX1 - CX0 - sum(widths)) / (n - 1)
    x = CX0
    for i, t in enumerate(texts):
        if kind == "box":
            box(x, y_top - h, widths[i], h, t, fs)
        else:
            cylinder(x, y_top - h, widths[i], h, t, fs)
        x += widths[i] + gap


def layer(y_top, y_bot, label, fill=C_BAND):
    h = y_top - y_bot
    AX.add_patch(Rectangle((LX0, y_bot), LX1 - LX0, h, fc=fill, ec="none", zorder=1))
    AX.add_patch(Rectangle((LX0, y_bot), LX1 - LX0, h, fc="none", ec=C_BOX_E,
                           lw=0.55, zorder=2))
    AX.add_patch(Rectangle((LX0, y_bot), LBW, h, fc=C_LABEL, ec=C_BOX_E,
                           lw=0.55, zorder=2.5))
    f = fit_fs(label, LBW, 7.6, 6.0, pad=0.87, tag="层名")
    AX.text(LX0 + LBW / 2, y_bot + h / 2, label, ha="center", va="center",
            fontproperties=FPB, fontsize=f, color=C_LABEL_T, zorder=3, linespacing=1.25)


def note(x, y, s, fs=7.0, color=C_TXT2):
    f = fit_fs(s, CX1 - x, fs, 5.6, pad=1.0, tag="注解")
    AX.text(x, y, s, ha="left", va="center", fontproperties=FP, fontsize=f, color=color,
            zorder=4)


# ================= 画面 =================
AX.text(W / 2, 7.34, "北交大像素校园 · AI 万事通  总体顶层架构图",
        ha="center", va="center", fontproperties=FPB, fontsize=10.5, color=C_LABEL_T)

# 大矩形 = 系统边界
AX.add_patch(Rectangle((LX0, 0.20), LX1 - LX0, 7.06 - 0.20, fc="none",
                       ec=C_BORDER, lw=1.5, zorder=2))

# 五层（自上而下）
L1_T, L1_H = 6.92, 0.80
L2_T, L2_H = 5.99, 0.96
L3_T, L3_H = 4.86, 1.42
L4_T, L4_H = 3.32, 1.95
L5_T, L5_H = 1.25, 1.01

layer(L1_T, L1_T - L1_H, "接入层")
layer(L2_T, L2_T - L2_H, "表现层")
layer(L3_T, L3_T - L3_H, "智能体层")
layer(L4_T, L4_T - L4_H, "能力与\n数据层")
layer(L5_T, L5_T - L5_H, "运行环境")

# ---- 接入层 ----
row(L1_T - 0.12, 0.56,
    ["玩家：新生 / 在校生 / 师生 / 求职者", "浏览器 · 双击即开", "账号与进度"],
    fs=8.0, widths=[4.90, 2.90, 2.45])

# ---- 表现层：单文件 HTML + Canvas 2D ----
row(L2_T - 0.10, 0.44,
    ["单文件 HTML\n零依赖零构建", "场景与相机\n世界 5208×2930", "baseY 排序\n自然遮挡",
     "像素渲染\n稳定 60 fps", "对话气泡\n就地按钮"], fs=7.4)
note(CX0, 5.19, "交互输入：WASD / 方向键移动 · 滚轮缩放 · 走近即触发 · 进门自动切场景")

# ---- 智能体层 ----
row(L3_T - 0.12, 0.54,
    ["向导·小北", "学霸哥", "算法哥", "阿姨·丙", "保安·老丁", "猫宠 × 4"], fs=7.6, gap=0.16)
note(CX0, L3_T - 0.94, "功能 = 工具集 + 人格配置：换一项功能只换一份 JSON，引擎一行不改")
note(CX0, L3_T - 1.20, "引擎负责意图路由 · 对话编排 · 记忆读写；答不了就说不知道，并推给对的人")

# ---- 能力与数据层：上排工具集，下排数据（圆柱） ----
row(L4_T - 0.10, 0.50,
    ["图谱导航", "混合检索", "真判题", "口碑与档口", "匹配与 OCR"], fs=7.6)
row(L4_T - 0.74, 1.10,
    ["graph.json\n地图图谱", "教材库与\n向量索引", "canteen.json\n窗口事实",
     "公共记忆层\n工单 · 口碑", "账号与进度库"], fs=7.2, kind="cyl")

# ---- 运行环境与外部依赖 ----
row(L5_T - 0.22, 0.60,
    ["账号服务\nFastAPI · SQLite", "LLM 服务\n只做听懂与转述", "云端 CV\nCLIP · OCR",
     "判题沙箱\nDocker 隔离", "真实时间层\n固定时刻表"], fs=7.2)


def main():
    os.makedirs(OUTDIR, exist_ok=True)
    FIG.savefig(OUTPNG, dpi=300, facecolor="white")
    print("saved: %s (%d KB)" % (OUTPNG, os.path.getsize(OUTPNG) // 1024))
    print("设计尺寸: %.2f x %.2f cm" % (W, H))
    if WARN:
        print("警告 %d 条:" % len(WARN))
        for w in WARN:
            print("  -", w)
    else:
        print("无文字溢出告警")
    os.makedirs(CODEDIR, exist_ok=True)
    shutil.copy(os.path.abspath(__file__), os.path.join(CODEDIR, "arch_diagram.py"))
    print("code ->", os.path.join(CODEDIR, "arch_diagram.py"))


if __name__ == "__main__":
    main()
