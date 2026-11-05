# -*- coding: utf-8 -*-
"""注册验证码：拖动拼图 + 轨迹校验（自己造，不接第三方）。

为什么自己造：
1. 国内能用的第三方滑块（极验、腾讯）都要企业认证 + 年费，这站用不起；
2. 拼图背景直接用校园的像素风素材（assets/landmark-*.png），风格统一；
3. 轨迹校验放在自己手里，将来想加严、加松都是一行代码。

一次挑战的流程：
    出题 -> 返回「背景（带缺口）+ 拼图块 + 垂直位置」，答案只留在服务端；
    验题 -> 用户把拼图拖到缺口，回传最终横坐标 + 拖动轨迹；
           横向误差在 TOLERANCE 像素内、轨迹像人手，才算过；
    发票 -> 过关发一张一次性的 ticket，注册接口认票不认人。
"""
from __future__ import annotations

import base64
import io
import random
import secrets
import time
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter

CANVAS_W = 360
CANVAS_H = 212
PIECE = 52               # 拼图块边长
TAB = 13                 # 右侧凸起圆的半径，拼图块实际宽度 = PIECE + TAB
PIECE_W = PIECE + TAB
TOLERANCE = 6            # 横向误差容忍（像素）
EDGE = 8                 # 缺口离画布边缘的最小距离
CHALLENGE_TTL = 180      # 一次挑战 3 分钟内有效
TICKET_TTL = 900         # 过关票据 15 分钟内可用于注册

_MASK_CACHE: dict[int, Image.Image] = {}


def _mask(scale: int = 4) -> Image.Image:
    """拼图块形状：圆角方块 + 右边一个圆凸起。放大 4 倍画，缩回来边缘才干净。"""
    cached = _MASK_CACHE.get(scale)
    if cached is not None:
        return cached
    w = PIECE_W * scale
    h = PIECE * scale
    m = Image.new("L", (w, h), 0)
    d = ImageDraw.Draw(m)
    r = 9 * scale
    d.rounded_rectangle([0, 0, PIECE * scale - 1, h - 1], radius=r, fill=255)
    cx, cy = PIECE * scale, h / 2
    d.ellipse([cx - TAB * scale, cy - TAB * scale, cx + TAB * scale, cy + TAB * scale], fill=255)
    _MASK_CACHE[scale] = m
    return m


def _load_sources(assets_dir: Path) -> list[Image.Image]:
    """背景素材：只用校园实景渲染图，缩到统一尺寸缓存起来（8 张，约 2 MB）。"""
    images = []
    for path in sorted(assets_dir.glob("landmark-*.png")):
        try:
            im = Image.open(path).convert("RGB")
        except Exception:
            continue
        images.append(im)
    if not images:
        # 素材丢了也不能让注册瘫掉：退化成一张程序画的渐变。
        base = Image.new("RGB", (980, 560))
        d = ImageDraw.Draw(base)
        for y in range(560):
            d.line([(0, y), (980, y)], fill=(60 + y // 6, 90 + y // 8, 150 - y // 10))
        images.append(base)
    return images


def _background(img: Image.Image) -> Image.Image:
    """从素材里随机裁一块、轻微缩放，凑成画布大小。"""
    src_w, src_h = img.size
    zoom = random.uniform(1.0, 1.35)
    crop_w = int(CANVAS_W * zoom)
    crop_h = int(CANVAS_H * zoom)
    left = random.randint(0, max(0, src_w - crop_w))
    top = random.randint(0, max(0, src_h - crop_h))
    return img.crop((left, top, left + crop_w, top + crop_h)).resize(
        (CANVAS_W, CANVAS_H), Image.Resampling.LANCZOS)


def _png(img: Image.Image) -> str:
    buf = io.BytesIO()
    img.save(buf, "PNG", optimize=True)
    return "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode()


def _jpg(img: Image.Image) -> str:
    buf = io.BytesIO()
    img.save(buf, "JPEG", quality=82, optimize=True, progressive=True)
    return "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode()


def make_challenge(assets_dir: Path, sources: list[Image.Image] | None = None) -> dict:
    """出一题。答案（target）只返回给调用方存库，不下发给浏览器。"""
    sources = sources or _load_sources(assets_dir)
    bg = _background(random.choice(sources))

    y = random.randint(EDGE + 6, CANVAS_H - PIECE - EDGE)
    target = random.randint(PIECE_W + 40, CANVAS_W - PIECE_W - EDGE)

    mask = _mask()
    size = (PIECE_W, PIECE)
    small = mask.resize(size, Image.Resampling.LANCZOS)

    # 拼图块：从原图里抠出来，加一圈浅色描边，看着像一块真的碎片
    piece = bg.crop((target, y, target + PIECE_W, y + PIECE)).convert("RGBA")
    piece.putalpha(small)
    # 描边 = 稍微胀大一圈减掉本身，得到一条干净的两像素边，比 FIND_EDGES 少毛刺
    edge = ImageChops.subtract(small.filter(ImageFilter.MaxFilter(5)),
                               small.filter(ImageFilter.MinFilter(3)))
    glow = Image.new("RGBA", size, (255, 255, 255, 0))
    glow.putalpha(edge.point(lambda v: int(v * 0.85)))
    piece = Image.alpha_composite(piece, glow)

    # 背景挖洞：缺口压暗 + 描边，用户一眼能看到要拖到哪。
    # 阴影和描边都先铺到整张画布的透明图层上再合成 —— 直接 paste 会把底色
    # 的透明度一起覆盖掉，边缘会发黑。
    hole = bg.convert("RGBA")
    shade = Image.new("RGBA", (CANVAS_W, CANVAS_H), (0, 0, 0, 0))
    shade.paste((12, 8, 24, 255), (target, y), small.point(lambda v: int(v * 0.62)))
    hole = Image.alpha_composite(hole, shade)
    outline = Image.new("RGBA", (CANVAS_W, CANVAS_H), (0, 0, 0, 0))
    outline.paste((255, 255, 255, 255), (target, y), edge.point(lambda v: int(v * 0.55)))
    hole = Image.alpha_composite(hole, outline)

    return {
        "id": secrets.token_urlsafe(18),
        "w": CANVAS_W,
        "h": CANVAS_H,
        "pieceW": PIECE_W,
        "pieceH": PIECE,
        "y": y,
        "target": target,
        "bg": _jpg(hole.convert("RGB")),
        "piece": _png(piece),
        "ttl": CHALLENGE_TTL,
    }


def public_view(challenge: dict) -> dict:
    """去掉答案之后的版本，返回给浏览器。"""
    return {k: challenge[k] for k in ("id", "w", "h", "pieceW", "pieceH", "y", "bg", "piece", "ttl")}


def trail_ok(trail, final_x: float) -> bool:
    """拖动轨迹像不像人手。只挡最荒唐的：瞬移、没动、来回抽搐。

    宁可放过，不要误杀 —— 真人在手机上偶尔拖得飞快，卡掉一个真用户比放过一个
    脚本贵得多（注册本来就还有密码强度和邮箱时代的其他关口）。
    """
    if not isinstance(trail, list) or len(trail) < 6:
        return False
    points = []
    for item in trail[:400]:
        try:
            t, x = float(item[0]), float(item[1])
        except (TypeError, ValueError, IndexError):
            continue
        if t != t or x != x:          # NaN
            continue
        points.append((t, x))
    if len(points) < 6:
        return False
    duration = points[-1][0] - points[0][0]
    if duration < 220 or duration > 30000:
        return False
    xs = [x for _, x in points]
    if max(xs) - min(xs) < 12:        # 根本没拖动
        return False
    back = sum(1 for i in range(1, len(xs)) if xs[i] < xs[i - 1] - 2)
    if back > max(3, len(xs) * 0.35):  # 来回抽搐的脚本
        return False
    if abs(xs[-1] - final_x) > 30:     # 报的终点和轨迹对不上
        return False
    return True


def check_answer(target: int, x: float, trail, spent_ms: float) -> tuple[bool, str]:
    """spent_ms = 从拿到题到松手的毫秒数。"""
    if spent_ms < 500:
        return False, "手速太快了，再来一次"
    if abs(x - target) > TOLERANCE:
        return False, "没对准，再试一次"
    if not trail_ok(trail, x):
        return False, "拖动轨迹不像真人操作，再来一次"
    return True, ""


def new_ticket() -> str:
    return secrets.token_urlsafe(24)


def now() -> float:
    return time.time()
