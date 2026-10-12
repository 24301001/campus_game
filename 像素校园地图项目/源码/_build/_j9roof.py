# -*- coding: utf-8 -*-
"""第九教学楼屋面探针（第二十八轮）。

用途：把 30 段 makeBuilding() 在**第九教学楼那个种子**上跑出来的屋面设备箱
逐块算出来（世界/画布坐标），回答一个只有它能回答的问题：

    「在屋面上挖一个天井（口字形），会不会切到那些随机撒的设备箱？」

做法：`makeRng` 是《数值食谱》的 LCG（`_b64_base.html` L130）：
    s = (s * 1664525 + 1013904223) >>> 0 ; 返回 s / 2^32
纯整数递推 ⇒ Python 里能**逐位复现**同一条流，不必跑 JS。

⚠️ 种子的来源不是写死的：`60_assemble.js` 里 `let bSeed = 7001`，
   每遇到一条 `kind === "bld"` 且 `R.w >= 40 && R.h >= 40` 的占位就 +1
   ⇒ 这里把那条循环照抄一遍现算，楼序一变种子自己就跟上来。

用法：
    python _build/_j9roof.py            # 打印种子、屋面几何、设备箱、天井候选
"""
import io, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
PART = lambda n: os.path.join(HERE, "parts", n)

M32 = 0xFFFFFFFF


class Rng(object):
    """makeRng 的逐位复现（整数递推，不碰浮点）。"""
    def __init__(self, seed):
        self.s = seed & M32

    def __call__(self):
        self.s = (self.s * 1664525 + 1013904223) & M32
        return self.s / 4294967296.0


def read(p):
    with io.open(p, encoding="utf-8") as f:
        return f.read()


def get_u():
    """世界比例尺 U（英寸 → 世界像素），从 10_const.js 现读。

    ⚠️ 源里写的是 `const U = 450 / 1.1521;` —— 是**除法**不是字面量。
       第一版正则抓成了 450（U 被放大 1.15 倍 ⇒ w=518 / depth=350.6 / roofT=190
       / eaveY=208 全错），第二十八轮修。
    """
    src = read(PART("10_const.js"))
    m = re.search(r"const U\s*=\s*([0-9.]+)\s*/\s*([0-9.]+)\s*;", src)
    if m:
        return float(m.group(1)) / float(m.group(2))
    m = re.search(r"const U\s*=\s*([0-9.]+)\s*;", src)
    assert m, "10_const.js 里找不到 U"
    return float(m.group(1))


def get_campus():
    """CAMPUS 表：[(name, kind, x, y, w, h), ...]（英寸）。"""
    src = read(PART("20_ground.js"))
    i = src.index("const CAMPUS = [")
    j = src.index("\n];", i)
    body = src[i:j]
    out = []
    for m in re.finditer(r'\[\s*"([^"]+)"\s*,\s*"([^"]+)"\s*,([^\]]*)\]', body):
        nums = [float(v) for v in m.group(3).split(",") if v.strip()]
        out.append((m.group(1), m.group(2)) + tuple(nums))
    return out


def seed_of(target):
    """照抄 60_assemble.js §6.2 的循环，现算 target 的 seed。"""
    U = get_u()
    bSeed, hits = 7001, []
    for e in get_campus():
        name, kind = e[0], e[1]
        if kind != "bld":
            continue
        Rw, Rh = e[4] * U, e[5] * U
        if Rw < 40 or Rh < 40:
            continue
        hits.append((name, bSeed))
        if name == target:
            return bSeed, hits
        bSeed += 1
    raise SystemExit("CAMPUS 里没有 %s" % target)


def roof(w, depth, floors, PADT=18, PADX=26, FLOOR_H=34):
    wallH = floors * FLOOR_H
    roofT = int(round(depth * 0.60))
    roofT = max(20, min(190, roofT))
    return dict(w=int(round(w)), depth=depth, wallH=wallH, roofT=roofT,
                PADT=PADT, PADX=PADX,
                x0=PADX, x1=PADX + int(round(w)),
                eaveY=PADT + roofT,
                H=PADT + roofT + wallH + 21 + 14)


def boxes(seed, g, floors):
    """照抄 30 段 §3.2 的设备箱那段（rng 的**头几个**调用就在那里）。"""
    rng = Rng(seed)
    w, roofT = g["w"], g["roofT"]
    x0 = g["x0"]
    out = []
    if roofT <= 46:
        return out
    nb = 2 + int(rng() * 3)
    for i in range(nb):
        bw = 18 + rng() * 34
        bh = 12 + rng() * 20
        bx = int(round(x0 + 14 + rng() * max(1, w - 28 - bw)))
        by = int(round(g["PADT"] + 14 + rng() * max(1, roofT - 28 - bh - bh * 0.5)))
        out.append(dict(i=i, bw=bw, bh=bh, bx=bx, by=by))
    return out


def main():
    NAME = "第九教学楼"
    U = get_u()
    seed, hits = seed_of(NAME)
    print("U = %.4f px/in" % U)
    print("第九教学楼 seed = %d（CAMPUS 里第 %d 栋合格的 bld）" %
          (seed, len(hits)))
    print("  前 4 栋: %s" % ", ".join("%s=%d" % h for h in hits[:4]))
    print()

    e = [x for x in get_campus() if x[0] == NAME][0]
    w, depth = e[4] * U, e[5] * U
    g = roof(w, depth, 4)
    for k in ("w", "depth", "roofT", "wallH", "x0", "x1", "eaveY", "H"):
        print("  %-6s = %s" % (k, ("%.3f" % g[k]) if isinstance(g[k], float) else g[k]))
    print()

    print("屋面设备箱（%d 个）:" % len(boxes(seed, g, 4)))
    for b in boxes(seed, g, 4):
        print("  #%d  画布 x=%d..%d  y=%d..%d  (%.1f×%.1f)"
              % (b["i"], b["bx"], b["bx"] + b["bw"], b["by"], b["by"] + b["bh"],
                 b["bw"], b["bh"]))


if __name__ == "__main__":
    main()
