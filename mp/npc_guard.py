# -*- coding: utf-8 -*-
"""NPC 门口的两道闸（2026-11-06）。

为什么做在**大厅转发口**而不是每个角色自己身上：

    学霸哥 8010、老丁 8000、食堂阿姨 8020 都只监听 127.0.0.1，外部唯一的路
    是大厅的 /xbg /ld /cmr 转发。闸门放在这里，三个角色自动全覆盖，
    以后再加角色也不用重写一遍。

两道闸：

1. `check_rate()` —— 每人每分钟几次、每天几次。挡的不是攻击，是**烧钱**：
   一次提问就是一次模型调用，没有上限的话，一个人挂个循环就能把额度跑干。
2. `screen()` —— 归一化（去零宽字符、全角转半角、去多余空格）后比对一组
   "像是要改我设定"的话术。命中就拦，不进模型。

⚠️ 说清楚这道闸的能力边界：它认的是**句式**，不是意图。把指令拆成拼音、
   换成别的语言、藏进图片文字里，它一律看不见。它挡的是"懒得动脑的复制粘贴"
   —— 也就是真实世界里的绝大多数情况。真正靠得住的是架构：
   食堂阿姨那种"模型只挑编号、正文由程序拼"的设计，模型根本没有编造的权力。
"""

from __future__ import annotations

import re
import time
import unicodedata

try:
    from rate_store import store as rate_store          # 以 mp/ 为根运行时
except ImportError:                                     # 以项目根为根运行时
    from mp.rate_store import store as rate_store

# ---- 额度 ---------------------------------------------------------------
NPC_PER_MIN = 8            # 每分钟最多问几次
NPC_PER_DAY = 200          # 每人每天（每个角色各算各的）
NPC_MAX_LEN = 1200         # 一次问句最长多少字

# ---- 归一化 -------------------------------------------------------------
_INVISIBLE = re.compile("[​-‏⁠-⁯﻿­᠎]")

# 繁体只需认得"攻击词汇里那些字"：設定 / 系統 / 規則 / 指令 / 現在 / 沒有 …
# 不做整套繁简转换（那是另一个依赖），够用就行。改的是**比对用的副本**，
# 送去模型的原话一个字都不动。
_T2S = str.maketrans({
    "設": "设", "統": "统", "規": "规", "則": "则", "條": "条", "個": "个", "們": "们",
    "現": "现", "沒": "没", "開": "开", "關": "关", "這": "这", "說": "说", "話": "话",
    "請": "请", "問": "问", "記": "记", "標": "标", "題": "题", "點": "点", "數": "数",
    "據": "据", "庫": "库", "學": "学", "習": "习", "復": "复", "導": "导", "師": "师",
    "對": "对", "與": "与", "後": "后", "麼": "么", "嗎": "吗", "還": "还", "將": "将",
    "給": "给", "輸": "输", "樣": "样", "誰": "谁", "認": "认", "為": "为", "義": "义",
    "實": "实", "際": "际", "無": "无", "幫": "帮", "寫": "写", "語": "语", "換": "换",
    "時": "时", "間": "间", "單": "单", "種": "种", "處": "处", "裡": "里", "裏": "里",
    "讓": "让", "應": "应", "該": "该", "會": "会", "從": "从", "來": "来", "過": "过",
    "進": "进", "級": "级", "員": "员", "機": "机", "構": "构", "調": "调", "試": "试",
    "驗": "验", "權": "权", "於": "于", "並": "并", "發": "发", "萬": "万", "體": "体",
    "變": "变", "轉": "转", "簡": "简", "節": "节", "頁": "页", "書": "书", "網": "网",
})


def normalize(text: str) -> str:
    """把这句话压成"最朴素"的样子再比对：繁体转简、全角转半角、去零宽、去多余空格。

    攻击载荷最常见的伪装就是"插空格 / 插零宽字符 / 用全角 / 写成繁体"，人眼看还是那句话，
    按字符串比对就全漏了。所以先归一化，再拿规则去撞。
    """
    text = _INVISIBLE.sub("", text or "")
    text = unicodedata.normalize("NFKC", text)
    text = text.translate(_T2S)
    text = re.sub(r"[\s　]+", "", text)      # 空格全去掉：忽 略 等 于 忽略
    return text.lower()


# ---- 规则 ---------------------------------------------------------------
# 每条 = (名字, 正则)。正则都在**归一化之后**的串上跑（已经没有空格了）。
RULES: list[tuple[str, re.Pattern]] = [
    ("改设定", re.compile(
        r"(忽略|无视|忘掉|忘记|抛开|作废|废除|停止执行|不要遵守|不用遵守|不必遵守)"
        r".{0,12}"
        r"(以上|之前|先前|上面|前面|刚才|所有|全部|一切|你的|原有|先前)"
        r".{0,12}"
        r"(指令|设定|设置|规则|提示|要求|人设|身份|限制|约定)")),
    ("英文版改设定", re.compile(
        r"(ignore|disregard|forget|override)\s*(all|any|the|your|previous|above|prior)"
        r".{0,20}(instruction|prompt|rule|setup|setting|guideline)")),
    ("索要提示词", re.compile(
        r"(系统提示|系统设定|系统指令|你的设定|你的提示词|你的设定词|第一条(系统)?指令|"
        r"systemprompt|initialprompt|yourinstructions?)"
        r".{0,24}"
        r"(原样|一字不改|一个字都别改|复述|照念|念给我|念出|打印|吐出|重复一遍|逐字|完整输出)"
        r"|"
        r"(原样|一字不改|一个字都别改|复述|照念|念出|打印|吐出|重复一遍|逐字)"
        r".{0,12}"
        r"(系统提示|系统设定|你的设定|你的提示词|systemprompt)")),
    ("伪造消息头", re.compile(
        r"(【系统】|\[系统\]|\[system\]|<\|im_start\|>|<system>|###\s*system|"
        r"管理员指令|管理员消息|开发者消息)")),
    ("开发者模式", re.compile(
        r"(开发者模式|管理员模式|上帝模式|越狱模式|无限制模式|dan模式|jailbreak|"
        r"developer\s*mode|您现在?是一个没有任何限制的|不受任何(校园)?规则限制)")),
    ("重设身份", re.compile(
        r"(从现在起|从今天起|从此刻起)"
        r".{0,8}"
        r"(你不再|你不是|你不再是|你(现在)?是|改叫|改名|扮演|充当)")),
    ("解锁口令", re.compile(
        r"(已解锁|已越狱|规则失效|规则作废|设置已更新|设定已更新|overrideok|"
        r"先回复.{0,6}(已解锁|好的|明白))")),
    ("伪装成资料框", re.compile(
        r"(【问题】|【资料】|\[\[tool:|<\|endoftext\|>)")),
]

# 这些是"看着可疑但不至于拦"的信号，只记账
SOFT = [
    ("疑似编码", re.compile(r"^[a-z0-9+/=]{60,}$")),
    ("重复灌水", re.compile(r"(.)\1{30,}")),
]


def screen(text: str) -> tuple[str, str]:
    """返回 ('ok'|'block'|'soft', 说明)。block 的理由直接给前端当提示用。"""
    raw = (text or "").strip()
    if len(raw) > NPC_MAX_LEN:
        return "block", f"这个问题太长了（{len(raw)} 字，上限 {NPC_MAX_LEN}）。请只贴题干本身。"
    if not raw:
        return "ok", ""
    flat = normalize(raw)
    for name, pat in RULES:
        if pat.search(flat):
            return "block", ("这句话读起来像是让我改设定或交出设定，我不接这种活。"
                             "要问题目就直接贴题干，要聊就去聊具体知识点。")
    for name, pat in SOFT:
        if pat.search(flat):
            return "soft", name
    return "ok", ""


def check_rate(uid: int, kind: str) -> tuple[bool, str]:
    """每人每角色：一分钟 N 次、一天 M 次。返回 (放行?, 说明)。"""
    _, ok_min = rate_store.hit(f"npc1m:{kind}:{uid}", 60, limit=NPC_PER_MIN)
    if not ok_min:
        return False, f"一分钟问 {NPC_PER_MIN} 次有点多了，喘口气再来。"
    _, ok_day = rate_store.hit(f"npc1d:{kind}:{uid}", 86400, limit=NPC_PER_DAY)
    if not ok_day:
        return False, f"今天的提问额度（{NPC_PER_DAY} 次）用完了，明天再来。"
    return True, ""


def daily_used(uid: int, kind: str) -> int:
    return rate_store.count(f"npc1d:{kind}:{uid}", 86400)
