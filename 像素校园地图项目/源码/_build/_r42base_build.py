# -*- coding: utf-8 -*-
"""像素校园 · 全校地图 —— 单文件 HTML 构建脚本

复用段按行号**逐字节**切自 像素校园Demo.html（尤其思源楼，硬约束：一行不改），
新模块放在 parts/ 下，最后拼成一个可直接双击打开的单文件 HTML。

用法：  python _build/build.py
"""
import base64, io, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(HERE)
DEMO = os.path.join(PROJ, '像素校园Demo.html')
OUT  = os.path.join(PROJ, '_build', '_look', '_r42base.html')

_demo = io.open(DEMO, encoding='utf-8').read().split('\n')


def demo_slice(a, b):
    """1-based 闭区间切片"""
    return '\n'.join(_demo[a - 1:b])


def part(name):
    return io.open(os.path.join(HERE, 'parts', name), encoding='utf-8').read()


def _strip_js(s):
    """去掉 JS 注释（供**否定**断言使用）。

    ⚠️ 本项目的 part 文件里大量写着"⚠️ 不是 XXX"式的注释来记录旧写法；
    注释也算进判据的话，`'X' not in code` 就会拿**自己的注释**当靶子报假失败
    （45_water.js 的假山那轮栽过一次）。所以凡是否定断言，一律只吃这个函数的输出。

    ⚠️⚠️ **2026-09-19 修了一颗埋了很久的雷：字符串字面量里的 `//` 也被当成注释头。**
       旧实现是两条裸正则，剥 `//[^\\n]*$` 时不认字符串 ⇒ 凡是 b64 点阵**恰好含 `//`**
       的那一行，从 `//` 起整行被吃到行尾、**数据静默截断**，而所有断言照过。
       实测被咬过的有 5 个 part：`49_southgate`(SG_MASK_EM) / `55_gym`(YU/GUAN) /
       `58_dxdoor`(2 条) / `61_kxht`(KE/XUE/TANG) / `63_yifu`(新增的 学/楼)。
       为什么一直没暴露：⑨ 那类断言是 `'名字' in code` 的存在性检查，截断不影响；
       本轮 `63_yifu` 是**第一次**让截断撞上"逐条数点阵尺寸"的断言（5 个字只数到 3 个）。
       所以这里改成**认字符串**的扫描器：进 `"` `'` 反引号就整段跳过（含反斜杠转义），
       只在字符串外才认 `/*` 与 `//`。
       ⚠️ 两条输出口径**故意与旧实现逐字节相同**（`/* */` → 一个空格；`//` 直接删、
          不补空格）—— 换实现时全库跑过 `_stripdiff.py` 对账，除上述 5 处截断外零差异。
    """
    out = []
    i, n = 0, len(s)
    BS = chr(92)                       # 反斜杠
    while i < n:
        c = s[i]
        if c in '"' + "'" + '`':
            q = c
            j = i + 1
            while j < n:
                if s[j] == BS:
                    j += 2
                    continue
                if s[j] == q:
                    j += 1
                    break
                j += 1
            out.append(s[i:j])
            i = j
            continue
        if c == '/' and i + 1 < n:
            if s[i + 1] == '*':
                j = s.find('*/', i + 2)
                j = n if j < 0 else j + 2
                out.append(' ')
                i = j
                continue
            if s[i + 1] == '/':
                j = s.find('\n', i)
                i = n if j < 0 else j
                continue
        out.append(c)
        i += 1
    return ''.join(out)


# --- 复用段（行号边界见交接文档 §6，勿随 Demo 改动而漂移） ---
REUSE = {
    'utils':  demo_slice(50, 195),     # §1 通用工具（颜色 / 噪声 / 阴影三件套）
    'siyuan': demo_slice(602, 803),    # §3.5 思源楼 —— 冻结，一行不改
    'nature': demo_slice(805, 1049),   # §4 自然与杂物（树/灌木/灯/椅/花坛/桶/车）
    'loop':   demo_slice(1242, 1333),  # §7 相机 / 输入 / 主循环
}
# §5 角色（demo 1051-1167）**不再复用** —— 2026-09-12 换成了 parts/50_char.js（A 档重画）。
# 旧段只作对照留在 demo 里，不再进产物；替换不牵动任何调用点（见 50_char.js 头部契约）。

# --- 角色段契约：常量 + 两个函数名必须齐，缺一个产物就会静悄悄没有主角 ---
char = part('50_char.js')
for _need in ('const CH_W = 18, CH_H = 30, CH_AX = 9, CH_AY = 27;',
              'function charSprite(dir, step)',
              'const _chars = Object.create(null);',
              'const makeChar = buildChar(6);',
              # ↓ 主循环补丁 11 依赖这四个常量，失踪了补丁会在语法上"通"但运行时报未定义
              'const WALK_FRAMES = 4, IDLE_BASE = 4, IDLE_FRAMES = 2;',
              'const WALK_STRIDE = 160;',
              'const IDLE_HZ = 0.4;'):
    assert _need in char, '角色段契约缺失: ' + _need

# --- 思源楼顶部改写段契约（parts/51_siyuan_top.js）---
# 缺哪一样都**不会报错**，只是静悄悄没效果：ROOF_Y 改回 84 → 题字带又变薄、
# 字被幕墙戳进来；生成块空着（忘了跑 _syfont.py）→ SY_CHARS 未定义 → 整页 JS 死。
sy = part('51_siyuan_top.js')
for _need in ('function siyuanRestyle(s, S)', 'function syBits(b64, cnt)',
              'ROOF_Y = 72, WIN_TOP = 100',
              'const SY_GROW = 128;', 'const SY_ADD_F = 5;',
              'function pavilion(x0)', 'const MAST = [',
              'const SY_TW =', 'const SY_CHARS = [', 'const SY_MASK_XUE ='):
    assert _need in sy, '思源楼改写段契约缺失: ' + _need
# 覆盖重绘必须挂在 §6.3 的 makeSiyuan 之后、addProp 之前，挪了位置就前功尽弃
# ⚠️ 第十五轮起传**整个精灵对象**（不是 s.canvas）：函数要换成更高的画布并回写 s.ay
assert 'siyuanRestyle(s, 1.5);\n  addProp' in part('60_assemble.js'), '§6.3 的 siyuanRestyle 调用点丢了'

# --- 思源楼加高 5 层（第十五轮，parts/51_siyuan_top.js）---
# 这一整套**只钉得住数字与机制**："加高的样子对不对"仍然只能出图（_prop.py 4）。
# 逐条对应加高的四个必要条件：换画布 / 搬下半段 / 层界锚在下接缝 / 回写 ay。
_sycode = _strip_js(sy)                                      # 否定断言只吃去注释后的代码
assert 'const c = mkCanvas(src.width, src.height + SY_GROW);' in _sycode, \
    '加高没换画布（必须新建 src.height + SY_GROW 的画布）'
assert 'const src = s.canvas;' in _sycode and 's.canvas = c;' in _sycode, \
    '新画布没写回 s.canvas —— addProp 取的就是它，不回写等于白加'
assert 's.ay += SY_GROW;' in _sycode, \
    'ay 没跟着下移：落地线会整体上蹿 SY_GROW，楼就"飘"到天上去了（A4 会红）'
assert 'g.drawImage(src, 0, cut, src.width, src.height - cut,' in _sycode, \
    '下半段没搬（旧墙会原地留着，新区直接叠在它上面）'
assert 'const R0 = cut + SY_GROW;' in _sycode, \
    '层界的锚点必须是新老接缝（cut + SY_GROW）—— 锚错就是整排窗错槽'
assert 'const fy = k => Math.round(R0 - k * SY_GROW / SY_ADD_F);' in _sycode, \
    '层界公式被改了：层高必须由 SY_GROW / SY_ADD_F 现算，不许写死 25.6'
# 否定闸：全校 FLOOR_H=34 一旦漏进这一段，同一面墙上就有两套层高、上下错槽
#   —— 而错槽四套自动验收**一条都查不出**（只能出图看）。所以这里必须钉死。
assert 'FLOOR_H' not in _sycode, \
    '思源楼加高段出现了 FLOOR_H —— 层高必须用思源楼自己的 17 native（×S = 25.5 行）'
assert 'clearRect' not in _sycode, \
    '加高段不该再有 clearRect —— 擦除的对象已经是新画布，留着只会擦掉刚搬下来的下半段'
assert _sycode.count('for (let k = 1; k <= SY_ADD_F; k++)') >= 2, \
    '横缝与窗排必须各有一个 SY_ADD_F 循环（少一个就整层漏画）'
assert 'const MS = Math.round(14 * S);' in _sycode, \
    '幕墙横分格节拍必须现算（14 native × S），写死会与 §3.5.7 的下半段脱拍'
assert 'const RSTART = GLASS_L + GW + 10;' in _sycode, \
    '右半窗列起点必须由幕墙右缘现算（= GLASS_R + 10），写死会与下半段错列'

# --- 升旗台段契约（parts/52_flag.js）---
# 缺哪个函数都是"看着没跑"：stampFlagNotch 缺 → 草坪不缺口、台子直接压在草上；
# paintFlagGround 缺 → 凹口还是 K.BLD 的"楼前硬地"混凝土；flagStand 缺 → 只有坑没有旗。
fl = part('52_flag.js')
for _need in ('function stampFlagNotch()', 'function paintFlagGround(g)',
              'function starFill(', 'function flagStand()', 'function flagStandBody()',
              'function flagCloth(', 'function clothDY(', 'function animateFlag(dt)',
              'const FLAG_FRAMES', 'const flagFrames = []',
              'function clearFlagClearance()', 'const FLAG_CLR = '):
    assert _need in fl, '升旗台段契约缺失: ' + _need
# 旗面必须是逐帧画出来的：clothDY 得同时被布面与星子调用（少一处星星就会浮起来）
assert fl.count('clothDY(') >= 3, '旗面风动的 clothDY 调用点不足（布面 / 大星 / 小星）'
# 2026-09-13 Edge 定格事故的三道闸，任何一道被删都会让"一个动画把整页弄死"复发
assert 'if (!(dt > 0)) dt = 0;' in fl, \
    'animateFlag 的 dt 防御丢了（负/NaN dt 会污染累积相位）'
assert '((Math.floor(flagPhase) % FLAG_FRAMES) + FLAG_FRAMES) % FLAG_FRAMES' in fl, \
    '旗面换帧的负索引夹正丢了（% 对负数返回负数 → flagFrames[-7] = undefined → 整页定格）'
assert 'if (flagFrames[i]) flagProp.img = flagFrames[i];' in fl, \
    '换帧前的最后一道闸丢了（img 一旦写成 undefined，下一帧 render 就会断掉 rAF 链）'
# 三个调用点必须都在 60 里，且凹口必须在 buildGround 之前、净空必须在冲突清理之后
_ass = part('60_assemble.js')
assert _ass.index('stampFlagNotch();') < _ass.index('const groundCanvas = buildGround();'), \
    '升旗台凹口必须在 buildGround() 之前'
assert _ass.index('paintFlagGround(') > _ass.index('const groundCanvas = buildGround();'), \
    '凹口铺装必须在 buildGround() 之后覆盖重绘'
assert _ass.index('addSolid(FLAG_CX') < _ass.index('scatter();'), \
    '升旗台碰撞盒必须在 scatter() 之前'
assert _ass.index('clearFlagClearance();') > _ass.index('clearPropTreeClash();'), \
    '旗杆净空必须排在 clearPropTreeClash() 之后'

# --- 雕塑段契约（parts/53_diaosu.js）---
# 与升旗台严格同构的四段：缺 stampDiaNotch → 草坪不缺口、雕塑直接压在草上；
# 缺 paintDiaGround → 凹口还是 K.BLD 的"楼前硬地"混凝土；缺 diaStand → 只有坑没有雕塑。
dz = part('53_diaosu.js')
for _need in ('function stampDiaNotch()', 'function paintDiaGround(g)',
              'function ellipPx(', 'function ellipRing(', 'function diaFlowerBed(',
              'function diaPlinth(', 'function diaGear(', 'function diaAnvil(',
              'function diaPedestal(', 'function diaColumn(', 'function diaStand(phase)',
              'function diaStoneFoot(', 'function diaStones(', 'function diaRing()',
              'function diaStoneBoxes(', 'function clearDiaClearance()',
              'const DIA_CLR = ',
              # ↓ 第六轮（2026-09-13）喷泉：水柱画进雕塑那张画布 + 逐帧换 img
              'function diaJet(g, i)', 'function bakeDiaFountain(',
              'function animateDiaosu(dt)', 'const DIA_FRAMES = 8, DIA_FPS = 9;'):
    assert _need in dz, '雕塑段契约缺失: ' + _need
# 喷泉的逐帧换 img 与 §5.2 旗面同构，所以**三道闸一条都不能少**：
#   2026-09-13 那次 Edge 整页永久定格（rAF 断链）就是漏了闸③ —— dt 转负 → `%` 对负数
#   返回负 → 数组负下标 → img 变 undefined → 下一帧 render 死在 p.img.width。
#   ⚠️ 旗面那三条断言只查 52_flag.js，管不到这里，必须各钉一份。
assert 'if (!(dt > 0)) dt = 0;' in dz, \
    'animateDiaosu 的 dt 防御丢了（负/NaN dt 会污染 diaT，进而污染数组下标）'
assert 'const i = wrapi(Math.floor(diaT * DIA_FPS), DIA_FRAMES);' in dz, \
    '喷泉换帧的负索引夹正丢了（% 对负数返回负数 → diaFrames[-7] = undefined → 整页定格）'
assert '((Math.floor(diaT * DIA_FPS) % DIA_FRAMES) + DIA_FRAMES) % DIA_FRAMES' not in dz, \
    '喷泉又把取模自己写了一遍 —— 项目里已有 wrapi()（Demo 切片 :51），两份迟早漂开'
assert 'if (diaFrames[i]) diaProp.img = diaFrames[i];' in dz, \
    '换帧前的最后一道闸丢了（img 一旦写成 undefined，下一帧 render 就会断掉 rAF 链）'
# 水柱**不许另起一个道具**：道具按 baseY 排序，雕塑 baseY=1854（花坛落地线），
# 水柱落地点只有 1830 —— 单独立项会被排到雕塑背后、被前排柱子吃干净。
# 这条不是审美，是排序契约：钉住"水柱在 diaStand 里画"这件事本身。
assert 'diaJet(g, phase);' in dz and 'function diaStand(phase)' in dz, \
    '水柱必须画进 diaStand 那张画布（另起道具会被 baseY 排序排到柱子背后）'
assert _ass.count('diaProp = props[props.length - 1];') == 1, \
    'diaProp 必须恰好抓一次（喷泉每帧写它的 img，抓不到就整根水柱不动）'
# 「方向反了」这类返工三套验收一个数都不变（几何/碰撞/性能全同），只能钉死常量：
#   后围石必须以**正北(270°)** 为弧心（90° = 正南，是用户否掉的"前半个圆"那一版）。
assert 'const DIA_ST_ANG = [225, 255, 285, 315];' in dz, \
    '后围石方位角被改了（弧心必须 270°=正北：用户要的是"后半个圆"）'
assert 'DIA_ST_R = 113' in dz, \
    '后围石半径被改了（113 是"北侧两块整体落在草坪 y<1776 上"解出来的下界 112.5 取整）'
# 半轴是最容易在后续返工里被"统一"掉的东西，钉死：
#   齿轮是**竖直的圆盘** → 正圆（rx = ry = 20）；花坛/石台基是**水平面** → 1.71:1 椭圆。
assert 'DIA_GEAR_R = 22' in dz, '齿轮外半径被改了（22 → 屏幕外径 44，≈4.9m）'
assert 'const DIA_FLW_RX = 38, DIA_FLW_RY = 22;' in dz, \
    '花坛半轴被改了（38:22 = 76×44，即 1.73:1 的俯角投影，与 FLAG_PZ 的 48:28 同源）'
# 四个调用点
assert _ass.index('stampDiaNotch();') < _ass.index('const groundCanvas = buildGround();'), \
    '雕塑凹口必须在 buildGround() 之前'
assert _ass.index('paintDiaGround(') > _ass.index('const groundCanvas = buildGround();'), \
    '雕塑凹口铺装必须在 buildGround() 之后覆盖重绘'
assert _ass.index('addSolid(DIA_CX') < _ass.index('scatter();'), \
    '雕塑碰撞盒必须在 scatter() 之前'
assert _ass.index('clearDiaClearance();') > _ass.index('clearPropTreeClash();'), \
    '雕塑净空必须排在 clearPropTreeClash() 之后'

# --- 南门校名石契约（parts/54_southstone.js）---
# 这一段的字形是**从 49 段的白嫖**（SG_ROW6 与拱上四个金字同源），
# 所以两头都要钉：49 的生成块里必须有 SG_ROW6，54 里必须真的去读它。
# ⚠️ 一旦有人把 _glyphs.py 的「六字」改回「四字」，49 少了 SG_MASK_BEI/JING 与
#    SG_ROW6 —— 那时 54 会抛 ReferenceError，加载期整页 JS 死（见下面语法闸的注释）。
_ss = part('54_southstone.js')
# ⚠️ `smText` / `SM_FONT` 是**故意留着的死代码**（英文行按用户决定去掉了，字形表备用），
#    所以它在契约里，但下面钉住"不许再加调用点"—— 石板减半后 153px 的英文塞不进去。
for _need in ('function smStamp(', 'function smGold(', 'function smText(',
              'function smBlockBand(', 'function smBlockCol(', 'function smSlab(',
              'function makeSchoolStone(', 'function slEdge(', 'function slCurl(',
              'function makeStoneLion(', 'function buildSouthStone()',
              'function halfSprite(', 'const SM_TEXT = "BEIJING JIAOTONG UNIVERSITY"'):
    assert _need in _ss, '南门校名石契约缺失: ' + _need
assert 'smText(g, SM_TEXT' not in _ss, '英文行已经按用户要求去掉，不许加回来（石板只剩 90px 宽）'
# 减半（§5.4.1b）：碰撞盒一律按**成品**尺寸算（用设计尺寸会围出一圈空气墙）。
# ⚠️ 只有**校名石**走 halfSprite：牌面是一块平涂的红石板 + 金字，
#    2×2 抽样不掉信息；金字更是**减半之后**才用 sgHalf() 的覆盖掩膜点上去的
#    （跟着 halfSprite 一起抽会把「通」的辶抽断，见 §5.4.1b 注）。
# ⚠️ 石狮**必须直接按成品尺寸 34×62 画**，不许退回 halfSprite —— 实测两种抽样规则
#    （就近 / 取离群色）都会把卷毛糊成一坨，见 §5.4.8 头注。
#    2026-09-13 用户报「石狮子…我们画的效果太差了」，根因是**尺寸**不是画技：
#    28×46 那点面积放不下石狮赖以成形的细节，被迫减特征之后只剩个轮廓。
assert _ss.count('halfSprite(c)') == 1, '只有校名石该走 halfSprite；石狮直接按成品尺寸画'
assert 'function sgHalf(' in _ss and _ss.count('sgHalf(cs[0]') == 1, \
    '六个金字的减半必须走 sgHalf()（覆盖掩膜），不许跟着 halfSprite 一起抽'
assert 'const W = SL_DW, H = SL_DH;' in _ss, '石狮的成画画布必须是 34×62'
assert 'const SL_DW = 34, SL_DH = 62;' in _ss, \
    '石狮尺寸被改了 —— 34×62 是按实拍包围盒 440:810 = 1:1.84 与 63 高的校名石反推的'
assert 'const SM_DW = SM_W >> 1, SM_DH = SM_H >> 1;' in _ss, '石碑减半的成品尺寸被改了'
# ⚠️ 判据必须带空格 `SL_W =`：写成 `'const SL_H'` 会被 `const SL_HI = "#a9b2a9"` 误伤。
assert 'const SL_W =' not in _ss and 'const SL_H =' not in _ss, \
    '石狮不该再有"设计尺寸"这一层（旧 SL_W/SL_H 已被成品尺寸取代）'
assert 'addSolid(SM_X, SM_BY, SM_DW - 12, 11);' in _ss, \
    '校名石碰撞盒必须按成品宽（SM_DW）算 —— 用 SM_W 会围出一圈空气墙'
assert 'addSolid(SL_X, SL_BY, SL_DW - 6, 13);' in _ss, '石狮碰撞盒必须按成品宽（SL_DW）算'
# 字形表在 49 段这边：`_glyphs.py` 必须描满六字（北 京 交 通 大 学），
# 「北」「京」两个点阵是石碑专用的（拱只用得到后四字）。
_sg = part('49_southgate.js')
for _need in ('const SG_ROW6 = [', 'const SG_MASK_BEI = ', 'const SG_MASK_JING = '):
    assert _need in _sg, '49 段生成块缺六字点阵（跑 _build/_glyphs.py parts/49_southgate.js）: ' + _need
assert 'const SG_CHARS = [' in _sg and 'SG_CHARS' in _sg, '拱上四个金字被删了'
assert _ss.count('SG_ROW6') >= 1, '校名石没有去读 49 段的 SG_ROW6（字形必须是同一串字节）'
# 尺寸/位置是"照着 PPT 轮廓贴"的那几个数，返工时最容易被动到；也钉住：
#   设计 204 = 178 + 13×2，成品 102×63（用户 2026-09-13「大小变为原来的一半」）。
assert 'const SM_FRAME = 13;' in _ss, '花岗岩框厚被改了'
assert 'const SM_SLAB_W = 178, SM_SLAB_H = 100;' in _ss, '红石板尺寸被改了'
#   落地线 = 南门拱根的 y，**必须写成与 49 段同一个表达式**（`IX(6.3750)`），
#   这样 G2 一挪、碑与狮跟着挪，不会脱节。
#   ⚠️ 用户 2026-09-13：「位置太靠上了，移动到和拱形南门根部 y 轴高度一致处」
#      —— 那正是 GATES G2 的 y（= IX(6.3750) = 2490.02），也是校园最南一条
#      可通行路面（`_gt.py 2100 2280 2520 2560`：y2400..2491 是砖石，2496 起界外）。
#   ⚠️ 用户 2026-09-13 再追加「再往左移动一下，靠近拱形南门」：整组西移 66px
#      （碑心 2270 → 2204、狮心 2196 → 2130）。**西边界是地面定的，不是审美**。
#   ⚠️ 第三次动（同日，用户选「放大重画」）：狮从 28×46 放大到 34×62、狮心 2130 → 2128。
#      这个口袋的全部预算：**拱的不透明像素顶到 x2103**（`_clear.py` 实测，不是 README
#      早先写的"画布东缘 2102"）→ 碑的左框 x2153（2204 − SM_DW/2 = 2153），一共 **50px**。
#      狮子画布 34 ⇒ 两侧各 8px，已是这个口袋里放得下的最大宽度。
assert 'const SM_X = 2204, SM_BY = IX(6.3750);' in _ss, '校名石位置被改了'
#   石狮与碑**并排**：同一条落地线（baseY 相等），谁都不会把对方压住。
assert 'const SL_X = 2128, SL_BY = SM_BY;' in _ss, '石狮位置被改了'
#   上面两行已经把位置钉死了，这里再把"为什么是这两个数"变成可执行的检查。
#   狮的画布横跨 2111..2145，但**实际画到的**只有 2113..2143（耳朵尖在精灵 x2/x32）——
#   台基最宽一级是 x3..31 ⇒ 世界 2114..2142，稳稳落在砖石铺装里。
assert 2145 < 2153, '狮东缘压到校名石的左框了（x2153 = SM_X − SM_DW/2）'
assert 2114 > 2112, '狮的台基压进了门洞那条沥青车道（x2112 = 砖石/沥青分界）'
assert 2111 >= 2103 + 8, '狮的画布框骑到南门拱上了（拱的不透明像素顶到 x2103 = G2.x + SG_RO + 1）'
assert 'SM_BY' in _ss and 'SL_BY' in _ss, '石狮的落地线必须与校名石同源'
# 三个调用点：本体必须在 scatter() 之前（否则那一格长树/垃圾桶）；
# 且 buildSouthStone() 里必须**先 addProp 再 addSolid**，两块都要有。
assert 'buildSouthStone();' in _ass, '校名石没有在 60 段被调用'
assert _ass.index('buildSouthStone();') < _ass.index('scatter();'), \
    '校名石与石狮必须在 scatter() 之前摆（否则碰撞盒晚一步，格子上会长树）'
assert _ss.count('addSolid(') == 2, '校名石/石狮应为各一个碰撞盒（addSolid × 2）'

# --- 老体育馆门面契约（parts/55_gym.js §5.5）---
# 用户 2026-09-13：「西门的老体育馆照片我已经给你了，好好复刻一下上面的字体，
#                  注意体育馆门口有很长的楼梯，要求我们可以登上楼梯但是不能进去，
#                  这是与其他建筑物不同的地方」。
# 两条最容易在返工里被"顺手改掉"的东西，钉住：
_gm = part('55_gym.js')
for _need in ('function gyBits(', 'function gyGlyph(', 'function gymSign(',
              'function gymFacade(', 'function gymStair(', 'function gymRestyle(',
              'function clearGymStairs()',
              'const GY_MASK_JIAO = ', 'const GY_MASK_DA = ', 'const GY_MASK_TI = ',
              'const GY_MASK_YU = ', 'const GY_MASK_GUAN = ', 'const GY_CHARS = ['):
    assert _need in _gm, '体育馆契约缺失（点阵跑 _build/_gymfont.py）: ' + _need
# ① 门头字的**逐字高**是量出来的（交24 大15 体25 育26 馆22）：「大」本来就比其余
#    四字矮一圈、基线齐平 —— 这是原设计，不是抠图误差。**实拍与提炼件两个来源都
#    认定「大」只有「育」的 0.52~0.58 倍**（见 _gymfont.py 文件头「逐字高」那段）。
#    锚 26 不是拍的：实拍门头横向占立面 22%~78%，26 锚下是 22.6%~77.4%（同文件头）。
assert '[GY_MASK_JIAO, 23, 24]' in _gm and '[GY_MASK_DA, 12, 15]' in _gm, \
    '门头逐字高被改了 —— 「大」是唯一该比其余四字矮一圈的那个，别"修"成统一值'
#    关系式再钉一道："大"必须仍是五字里最矮的，且要比最高的「育」矮 ≥6（26→15）。
_gyh = [int(m) for m in re.findall(r'\[GY_MASK_\w+, \d+, (\d+)\]', _gm)]
assert len(_gyh) == 5 and min(_gyh) == _gyh[1] and max(_gyh) - _gyh[1] >= 6, \
    '门头五字的相对高关系散了（应 交24 大15 体25 育26 馆22，大 是唯一的矮子）: %s' % _gyh
#    字高锚还钉着两件不能碰的事：① 顶不能顶穿青绿带上沿（GY_BASE_Y − max = 39−26 = 13
#    > GY_CAP 的偏移 6）；② 整排宽不能盖住右下角落款（tw/2 + 馆 的右缘仍在 GY_X1 以内）。
#    ⚠️ 2026-09-17 起这两个分带写成 **GY_EAVE 的偏移式**（屋面板改成铺满进深之后，
#       檐下沿由 208 下移到 367，绝对行号会跟着漂）—— 所以关系式也按偏移量写。
assert 39 - max(_gyh) > 6 and max(_gyh) <= 28, \
    '门头字高锚被抬过头了 —— 26 锚下顶到带沿以上 13px（= 39−26，带沿偏移 6），28 就只剩 5px 绿边'
assert 'const GY_GAP = 20;' in _gm and 'const GY_BASE_Y = GY_EAVE + 39;' in _gm, \
    '门头字距/基线被改了 —— 两者与字高锚是一组，改任一个都要重跑横向足迹（_gymfont.py 文件头）'
# ② 檐下沿 / 落地线必须与 30_building.js 的算式同源（改模板时这里跟着炸）：
#    eaveY = PADT(18) + roofT，roofT = ceil(IX(1.1528)) − 3*FLOOR_H = 451 − 102 = 349
#    （老体育馆 2026-09-17 起走 `o.roofFull`，见 30_building.js 与 §6.2 styleOf）；
#    baseY = eaveY + 3*34。**两条都必须写成派生式**，绝对行号不许再回来。
assert 'const GY_ROOF = 349;' in _gm and 'const GY_EAVE = 18 + GY_ROOF;' in _gm \
    and 'const GY_BASE = GY_EAVE + 102;' in _gm, \
    '体育馆立面的檐下沿/落地线被改了（必须与 30 段的 PADT+roofT / +wallH 对上；' \
    'roofT 由 §6.2 styleOf 的 roofFull 决定，= ceil(IX(h)) − 3*FLOOR_H）'
# ②b 几何闸：判据必须是"落地线以下的尾巴"而不是画布总高 —— 总高跟着 roofT 走。
assert 'if (old.height - GY_BASE !== 35)' in _gm, \
    'gymRestyle 的几何闸丢了或换回了"总高 === 常数"的写法 —— 屋面板一改总高就变，' \
    '那种判据会天天误报，最后被人删掉'
# ③ 台阶必须画在**精灵画布内、baseY 之下**（往南长）。若改成另起一个 baseY=947 的道具，
#    玩家站在台阶上（y≈920）时会被台阶盖住 —— 见文件头第二段。
assert 'b.canvas = c;' in _gm and 'old.height + GY_STAIR' in _gm, \
    '台阶必须接在建筑精灵画布的下方（另起道具会因 baseY 把人盖住）'
# ④ "能上不能进"靠的是**已有的**楼体碰撞盒，不是新加的墙；这里钉住它没被偷偷加高。
#   ⚠️ 判据要**剔掉注释行**：文件头正文明写着 `addSolid(ax, ay, b.w-14, 34)` 这句话。
assert not any('addSolid(' in ln for ln in _gm.splitlines()
               if not ln.lstrip().startswith(('*', '/*', '//'))), \
    '体育馆不该新增碰撞盒：能上台阶靠的正是 60 段原有的 addSolid(ax, ay, b.w-14, 34)'
# ⑤ 台阶**不许**让 clearGymStairs 把楼自己删掉（宽 > 110 的当楼保留）
assert 'p.img.width > 110' in _gm, 'clearGymStairs 的"楼保留"闸没了'
# 调用点三条：
assert 'if (name === "老体育馆") gymRestyle(b);' in _ass, '体育馆没在 60 段被覆盖重绘'
assert _ass.index('gymRestyle(b);') < _ass.index('addProp(Object.assign({}, b,'), \
    'gymRestyle 必须排在 addProp 之前 —— 它换的就是 b.canvas'
assert 'const gymCleared = clearGymStairs();' in _ass, '台阶净空没被调用'
assert _ass.index('const gymCleared = clearGymStairs();') \
       > _ass.index('const clashDropped = clearPropTreeClash();'), \
    '台阶净空必须排在 clearPropTreeClash() 之后（先跑会改它的保留集）'

# --- 明湖三景契约（parts/56_minghu.js §5.6）---
# 用户 2026-09-13：「根据明湖所有的照片和我写的位置detail文件还原出明湖石碑，
#                  包括字体，明湖湖心岛及其上边的小亭子，还有水中央的石塔」。
# 三幅画（碑 / 岛+亭 / 塔）全部是**逐像素手绘**，三套验收一个数都查不出来 ——
# 判据只能钉在源码上。这里钉的是"改一下就会静默变错"的那几条：
_mh = part('56_minghu.js')
for _need in ('function mhBits(', 'function mhGlyph(', 'function mhSign(',
              'function makeMinghuStone()', 'function mhHexPts(',
              'function mhPave(', 'function mhIsleRim(', 'function mhBridge(',
              'function mhRoof(', 'function makeIslandPavilion(',
              'function mhRock(', 'function makeStoneTower()',
              'function buildMinghu()',
              'const MH_MASK_MING = ', 'const MH_MASK_HU = ', 'const MH_CHARS = ['):
    assert _need in _mh, '明湖契约缺失（点阵跑 _build/_mhfont.py）: ' + _need
# ① **唯一那个必须动的 y**：石塔 1356 → 1253。detail 文件写在「明湖缩小」之前，
#    三个 y 都是按旧湖量的；缩小后湖底北移 103.6px，1356 已落到南岸石板路**上**。
#    塔要"在水中央"就必须跟着缩水量一起北移。碑 / 亭两个 y 则**照抄用户原值**，别动。
assert 'const MH_ST_X = 2727, MH_ST_BY = 1187;' in _mh, \
    '石碑落点被改了 —— 用户给的就是 2727,1187（它站西岸环湖路上，不受缩湖影响）'
assert 'const MH_ISLE_X = 2804, MH_ISLE_BY = 1108;' in _mh, \
    '湖心亭落点被改了 —— 用户给的就是 2804,1073（BY = 1073 + AY−CY = 1073+35）'
assert 'const MH_TW_X = 2938, MH_TW_BY = 1253;' in _mh, \
    '石塔落点被改了 —— 2938,1356 是旧湖坐标，缩湖后必须北移 103.6 到 1253，' \
    '否则塔会长在南岸石板路上（见文件头一）'
# ② 岛心 / 精灵锚点这三条是**互相咬合**的：精灵 x0 必须正好落在湖面西缘
#    （IX(7.0104) = 2738.06 = 水面与西岸的接缝），多一格桥面就会盖到环湖路上；
#    岛心 x 必须等于用户给的亭子中轴 2804；AY − CY 必须等于"岛心到落地线"
#    （岛南尖角 RY + 石壁 8 = 35），因为它决定了 BY 怎么从用户的 1073 推出来。
#    改一个必须重解另外两个。
assert 'const MH_ISLE_W = 120, MH_ISLE_H = 132, MH_ISLE_AX = 66, MH_ISLE_AY = 125;' in _mh, \
    '湖心岛精灵框被改了（x0 必须 = 2738.06 水面西缘，岛心 x66 必须 = 2804，AY−CY 必须 = 35）'
assert 'const MH_ISLE_CY = 90;' in _mh and 'const MH_ISLE_R = 46, MH_ISLE_RY = 27;' in _mh, \
    '岛心 / 六边形半轴被改了：RY 必须是 R×MH_HEX_K（46×0.585 = 27）'
# ②b **1.71 是项目的既定约定**（§5.3 花坛 76×44 用的就是 ry = rx/1.71；Demo 树冠 0.8）。
#     湖心岛的铺装是地面上的正六边形，必须跟它一致 —— 第一版按 0.42 压，岛和屋顶
#     都成了饼。举高必须压过"北檐角在屏上的抬高"(ry+lift)，否则屋顶翻成一个碗。
assert 'const MH_HEX_K = 0.585;' in _mh, '地面压扁系数被改了（必须是 1/1.71，同 §5.3）'
assert 'const MH_PITCH = 0.95;' in _mh, '攒尖举高比被改了（0.62 压不过 0.585 的北檐角）'
# ②c ⚠️ 攒尖 y **不许存成常量**：mhRoof 必须把它 return 出去，上层从返回值往上接。
#     2026-09-13 第一版把攒尖存成 MH_P_APEX / MH_P_U_APEX，画的时候却由 rx 现算，
#     两者一漂移，宝顶就悬在屋顶上方 11px 飘着（三套验收全查不出）。
assert 'function mhRoof(g, cx, y0, rx)' in _mh and 'return Math.round(apex[1]);' in _mh, \
    'mhRoof 必须按 (g,cx,y0,rx) 画并返回攒尖 y —— 攒尖存常量就会漂移出悬空的宝顶'
assert 'const MH_P_APEX' not in _mh and 'const MH_P_U_APEX' not in _mh \
       and 'const MH_P_FIN' not in _mh, \
    '攒尖 / 宝顶的 y 又被写回常量了（必须从 mhRoof 的返回值推）'
assert 'const a1 = mhRoof(' in _mh and 'const a2 = mhRoof(' in _mh \
       and 'mhRoof(g, CX, MH_P_U_Y, MH_P_U_EAVE)' in _mh, \
    '上檐的 y0 必须挂在 MH_P_U_Y 上（写回 a1−8 = 上层柱又一根都露不出来）'
# ②d ⚠️ 上层柱（童柱）必须画在**下檐之前** —— 见 5.6.1c。
#     用户 2026-09-13 第二轮原话：「亭子上边那一小层没有柱子支撑」。
#     根因不是柱高，是画的次序：下檐要靠自己的戗脊去切柱脚。三套验收都测不到
#     "哪一笔先画"，判据只能钉在源码的先后次序上。
assert 'const MH_P_U_Y = 21, MH_P_U_R = 12, MH_P_U_FOOT = 56;' in _mh, \
    '上层柱的三条常量被改了 —— 动它们要重算上檐 / 宝顶还装不装得进精灵（5.6.1c）'
_i_up = _mh.index('px(g, x, MH_P_U_Y, 3, MH_P_U_FOOT - MH_P_U_Y, MH_PL);')
assert _i_up < _mh.index('const a1 = mhRoof('), \
    '上层柱被挪到下檐之后了 —— 下檐盖不住柱脚，那一层又成悬浮屋顶（见 5.6.1c）'
# ③ 三件**各有一个**碰撞盒。
#    ⚠️ 2026-09-13 第六轮改：原先这里钉的是「只有石碑一个（岛和塔在水里，加盒 =
#       隐形墙）」，理由是"水面本来就不可通行（K.WATER）"。**那个前提是错的**，
#       已实测证伪：canWalk() 只查边界多边形、addSolid 的 12 个调用点没有一处是水面，
#       水面一直可以走上去。前提一没，岛与塔的盒子就从"隐形墙"变成了**必需品**
#       （否则人能踩着水穿岛穿塔）。数量从 1 改成 3 是这次改动的**结果**，不是放松约束。
#    盒子的取法仍受约束：必须是**落地足迹**的 AABB，不是整张精灵框（岛精灵 120×132
#    里大半是亭子与水面反光）—— 岛那条的深度写成 AY−CY+RY，三个常量一动它自己跟着走。
assert _mh.count('addSolid(') == 2, \
    '明湖应只有碑走裸 addSolid（另加 mhSolid 函数体里那一次），找到 %d 个' % _mh.count('addSolid(')
assert _mh.count('mhSolid(') == 3, \
    '岛与塔的盒子必须走 mhSolid（1 处定义 + 2 处调用），找到 %d 个' % _mh.count('mhSolid(')
for _need in ('addSolid(MH_ST_X, MH_ST_BY,', 'mhSolid(MH_ISLE_X, MH_ISLE_BY,',
              'mhSolid(MH_TW_X, MH_TW_BY,'):
    assert _need in _mh, '明湖碰撞盒缺失: ' + _need
# 岛与塔的盒子必须**同时**登记进 WATER_AVOID（45_water.js 声明），否则鸭子与鱼
# 会继续穿石而过 —— 而它们**本来就是**穿过去的（鸭 1 轨道心 2819.9,1104 落在岛内），
# 本轮补了碰撞盒之后这处旧缺陷会从"看不出来"变成"很刺眼"。
assert 'WATER_AVOID.push({ x0: cx - w * 0.5, x1: cx + w * 0.5, y0: by - d, y1: by });' in _mh, \
    'mhSolid 没有把盒子登记进 WATER_AVOID（鸭子/鱼会重新穿岛穿塔）'
# mhRock 的 cols 参数是第七轮为假山加的，**必须可选**：不传就走原来的 MH_RK_* 与
# #d6d2c4，否则 §5.6 那 7 处岛边石头会跟着换色（那轮四套验收都查不出"石头变了色"）。
assert 'const C = cols || [MH_RK_L, MH_RK, MH_RK_D];' in _mh \
       and 'const HL = (cols && cols[3]) || "#d6d2c4";' in _mh, \
    'mhRock 的 cols 必须"不传就完全走原样"，否则明湖那 7 处石头会跟着变色'
assert _mh.count('mhRock(') == 8, \
    'mhRock 调用点应仍是 7 处（§5.6 的岛边石头）+ 1 处定义 = 8，找到 %d' % _mh.count('mhRock(')

# --- 明湖南岸影壁群契约（parts/57_yingbi.js §5.7）---
# 用户 2026-09-13：「…我打算放一些影壁，扇形带窗的影壁…影壁分布在 1378 这个 y 轴上，
#                  我打算是带窗影壁加门加带窗影壁，其中最左边那个影壁后边可以放上假山」。
# 影壁/假山全是**逐像素手绘**的，三套自动验收一个数都查不出来 —— 判据只能钉在源码上。
_yb = part('57_yingbi.js')
for _need in ('function makeYingbi(', 'function makeJiashan(', 'function buildYingbi()'):
    assert _need in _yb, '影壁契约缺失: ' + _need
# ① 落地线是**用户指定的 1378**，不许被"顺手对齐"到砖面中线或湖岸上去。
assert 'const YB_BY = 1378;' in _yb, \
    '影壁落地线被改了 —— 用户指定的就是 y1378（见 §5.7 文件头四）'
# ② 广场的 x/宽必须**读 WATER[0]**，不许抄一份数字：湖与广场同源
#    （都是 IX(7.0104)/IX(0.6972)），抄一份迟早会和 20_ground.js 漂开。
assert 'WATER[0].x' in _yb and 'WATER[0].w' in _yb, \
    '广场 x/宽没有读 WATER[0] —— 湖与广场同源，抄数字必漂'
# ③ 三块的排布必须**由常量算出**（带窗影壁 + 缝 + 月亮门 + 缝 + 带窗影壁）。这里钉的
#    是"算式还在"，不是钉 204 这个结果 —— 改窄影壁或改缝宽不该触发断言。
assert 'const SPAN = YB_W * 2 + YB_DOOR_W + YB_GAP * 2;' in _yb, \
    '三块的横向排布算式被改了（必须由 YB_W / YB_DOOR_W / YB_GAP 算出来）'
# ④ 月亮门是**两个门垛夹一个空门洞**：门洞那一段不许有盒子，否则人进不来也出不去。
#    ⚠️ 逐条钉**具体调用**，不数 `count('mhSolid(')` —— 文件头注释里也写着 `mhSolid()`，
#       数计数会被一句注释带偏（第一版就是这么误报的：报 5 处，第 5 处是注释）。
for _need in ('mhSolid(cx, YB_BY, YB_W, YB_SOLID_D);',
              'mhSolid(cd - (YB_DOOR_W / 2 - jamb / 2), YB_BY, jamb, YB_SOLID_D);',
              'mhSolid(cd + (YB_DOOR_W / 2 - jamb / 2), YB_BY, jamb, YB_SOLID_D);',
              'mhSolid(jx, jby, YB_JIASHAN_W, YB_JIASHAN_D);'):
    assert _need in _yb, '影壁碰撞盒缺失: ' + _need
# 影壁群一律走 mhSolid（= addSolid + 登记 WATER_AVOID）。用裸 addSolid 的话鸭子会
# 径直穿墙 —— 它读的是 WATER_AVOID，不是 solids。
assert 'addSolid(' not in _yb, \
    '影壁群不许用裸 addSolid（必须走 mhSolid 才能同步登记 WATER_AVOID，否则鸭子穿墙）'
assert 'YB_DOOR_HOLE = 20;' in _yb and 'const jamb = (YB_DOOR_W - YB_DOOR_HOLE) / 2;' in _yb, \
    '门垛宽必须由 YB_DOOR_W − YB_DOOR_HOLE 算出来（门洞 20 宽无盒，人和鸭子才走得过去）'
# ⑤ 挖空必须是**真透明**（clearRect），不是拿粉墙色涂一块 —— 涂一块的话窗后永远
#    看不到湖水/砖面，用户要的"把中间挖空作为窗户"就白做了。
assert 'g.clearRect(16, 24, 36, 15);' in _yb, \
    '窗洞没有用 clearRect 挖穿（涂色的话透不出背后的景，见 §5.7 文件头二）'
# ⑥ 假山在北侧（用户拍板③）⇒ 落地线比影壁**小**；写成加法它就跑到影壁前面去了。
assert 'const jx = cw - 4, jby = YB_BY - YB_JIASHAN_DY;' in _yb, \
    '假山落地线必须是 YB_BY − YB_JIASHAN_DY（在北侧），写成加法就跑到影壁前面去了'
# ⑦ 瓦顶**平直无弧**。用户 2026-09-13：「弧顶可以不要，按照那个照片画瓦片即可」——
#    这条**推翻了**上一轮 AskUserQuestion 里"扇形 = 顶部弧形扇面"的拍板。pinned 的是
#    "别再把弧加回来"，不是某个 R 值。
assert 'YB_ARC_R' not in _yb, \
    '瓦顶又出现弧了 —— 用户 2026-09-13 明确要求平直、照实例图画瓦片（见 §5.7 文件头三）'
# ⑧ 瓦垄必须是"**浅色筒瓦面** + 深色沟"。第一版画反了（#383038 底 + #1c181c 沟），
#    1× 下整片糊成黑、和旁边湖面一比就是个洞 —— 实拍正相反，筒瓦正面是受光的。
assert 'YB_TILE' in _yb and 'YB_RIDGE' in _yb \
    and 'const hTile = YB_ROOF_H - YB_RIDGE_H - YB_EAVE_H;' in _yb, \
    '瓦顶缺少筒瓦面(YB_TILE)/正脊(YB_RIDGE)，或瓦垄高没由 YB_ROOF_H − YB_RIDGE_H − YB_EAVE_H 算出'
# ⑨ 假山必须是**扁圆鹅卵石**（jPebble 逐行椭圆）。第一版复用 56 段的 mhRock（六边形切角）
#    画出来是一堆米白纸箱 —— 形状错，不是配色错，调色救不回来。
assert 'function jPebble(' in _yb and 'jPebble(g, b[0], b[1], b[2], b[3], b[4]);' in _yb, \
    '假山没走 jPebble（扁圆鹅卵石）—— 退回切角多边形就会画成米白纸箱'
assert 'mhRock(' not in _yb, \
    '本段不该再调 mhRock：它的顶点全在角上，画不出实例图的扁圆石头'
# ⑩ 假山**不许铺矩形底色**。第一版拿 YB_JSEAM 铺满 50×62 当"石缝"，于是从影壁墙顶
#    冒出来的是一块**方正的黑**。用户 2026-09-13：「假山不要有背景色」—— 缝改由每块
#    石头自己的 1px 描边拼，画布留透明，露出来的才是石头本身的圆弧轮廓。
assert 'px(g, 0, 0, YB_JIASHAN_W, YB_JIASHAN_H, YB_JSEAM);' not in _yb, \
    '假山又铺矩形底色了 —— 用户要求不要背景色，露在墙外的必须是石头轮廓'
assert 'px(g, x + x0 - 1, y + iy, cw + 2, 1, YB_JSEAM);' in _yb, \
    'jPebble 少了 1px 描边 —— 没了铺底又没描边，整座山就没有石缝了'
# ⑪ 假山从墙顶只许**露出个头**。用户 2026-09-13：「往前移动一点假山，能够露出个头在
#    墙后即可」。DY 是"比影壁多沉下去多少"，22px 那版是一整块。这里钉住这个数；
#    运行时的那一份判据在 accept.py K9（露出量 4..20px）。
assert 'const YB_JIASHAN_W = 50, YB_JIASHAN_H = 62, YB_JIASHAN_DY = 4;' in _yb, \
    '假山下沉量被改了 —— 露出量必须是个"头"（见 accept.py K9）'

# --- 思源东/西楼门面契约（parts/58_dxdoor.js §5.8）---
# 用户 2026-09-13：「思源东楼和思源西楼的门是完全一样的…先画门，只画门…注意还原
# 照片上的玻璃，入口，字体和一个门最上边的石头挡雨台」。四条要素各钉一条。
_dx = part('58_dxdoor.js')
_dxa = part('60_assemble.js')
# ① 两栋楼各挂一次，且都必须在 addProp **之前**（重绘的是同一张 canvas 的内容，
#    晚一步旧精灵已经进 props 了 —— 与 gymRestyle 同一条规矩）。
#    第五轮起第三个实参是**楼名**：楼顶那一段要按 `makeSign(name)` 现算屋名标牌的范围
#    才盖得住它（见 ⑨）—— 传错了名字就是"撤字"撤到另一栋楼上去。
#    第六轮起第四个实参是**屋面色 `pal.roof`**：探出体的顶面要与屋面同料（见 ⑨）。
assert 'else if (name === "思源东楼") dxRestyle(b, DX_D_CHARS, name, pal.roof);' in _dxa, \
    '思源东楼没接上门面重绘（或没把楼名/屋面色传进去 —— 楼顶撤不掉那四个字、凸不出那一块）'
assert 'else if (name === "思源西楼") dxRestyle(b, DX_X_CHARS, name, pal.roof);' in _dxa, \
    '思源西楼没接上门面重绘（或没把楼名/屋面色传进去 —— 楼顶撤不掉那四个字、凸不出那一块）'
assert 'const pal = PALETTE[st.p];' in _dxa, \
    '传进去的 pal.roof 必须来自 PALETTE[styleOf(name).p] —— 同源，58 段自己不存色号'
assert _dxa.index('dxRestyle(b, DX_D_CHARS, name, pal.roof)') < \
    _dxa.index('addProp(Object.assign({}, b,'), \
    'dxRestyle 必须在 addProp 之前 —— 否则画在精灵图外面，屏幕上什么都看不到'
# ② 两栋楼的门**共用同一套代码与同一组尺寸**（用户：「完全一样的」），
#    只有点阵表不同。若哪天有人给某栋单开了尺寸分支，这条会先炸。
assert 'function dxRestyle(b, CHARS, name, roof) {' in _dx, \
    '门面重绘必须只有一个入口、靠传入的点阵表/楼名/屋面色区分东/西楼'
# ②b 门区尺寸按**照片实测**重排过一次（第二版）：照片里入口是**四扇对开玻璃门**
#     （第一版凭想象画成"三开间：左平开 / 中旋转 / 右平开"，是错的）。门区 104 宽、
#     门组 27 高，六层自雨篷往下合计 92（墙高 102 ⇒ 门顶还留 10px 料石，不顶穿檐口）。
def _num(name):
    m = re.search(r'const %s = (\d+);' % name, _dx)
    assert m, '58 段里找不到常量 %s（名字改过？）' % name
    return int(m.group(1))
assert _num('DX_WG') == 104 and _num('DX_HG') == 27, \
    '门区/门组尺寸被改了 —— 六层立面（雨篷/高窗/门楣/亮窗/横带/门组）是按它排的'
assert 'const DX_DWN = 4;' in _dx, \
    '门扇数必须是 4（四扇对开）—— 照片如此，第一版的"三开间"就错在这里'
# ②c 六层常量一个都不能少。DX_HL（上亮窗）与 DX_HM（金属横带）是第二版照照片新加的：
#     删掉任何一层，立面就从"照片里的六段"退化成一条糊板，而自动验收一律看不出来。
for _c in ('DX_HT', 'DX_HC', 'DX_HB', 'DX_HL', 'DX_HM', 'DX_HG'):
    assert 'const %s = ' % _c in _dx, '六层立面的 %s 不见了' % _c
assert 'const DX_TOP = DX_HT + DX_HC + DX_HB + DX_HL + DX_HM + DX_HG;' in _dx, \
    'DX_TOP 必须由六层加起来 —— 写死一个数就会和上面某一层对不上'
assert 'speckle(g, Math.round(CX - wb), yb + 2, DX_WB, DX_HB - 3,' in _dx, \
    '门楣花岗岩少了石材颗粒 —— 会读成一整块塑料板'
# ③ 金字：两套点阵各 4 字，且**字高统一**（照片里四字等高，不像体育馆的「大」矮一截）
assert 'const DX_D_CHARS = [' in _dx and 'const DX_X_CHARS = [' in _dx, \
    '东/西楼门头点阵缺了一套 —— _dxfont.py 生成块被删了？'
assert _dx.count('["') >= 8, '门头点阵应有两套共 8 个字形（东 4 + 西 4）'
# ③b ⚠️ **点阵画了不等于字画上去了**：第一版 dxSign 定义了却从没被调用 ——
#     门楣带上一片空白，而三套自动验收全绿（它们查不出"少了四个字"）。
#     这条钉的是**调用点**，不是函数体。
assert 'dxSign(g, CHARS, CX, yb + DX_HB / 2);' in _dx, \
    '门头金字没被画出来 —— dxSign 定义了但没调用（第一版就是这么空的）'
# ③c 门头字**横竖都居中**：传进去的是梁的纵向中点，不是"梁底 − 3"那种偏置基线。
#     第三轮同时改过字高（22→11）与梁高（28→14），写死偏置会把字顶到梁的上棱上去。
assert 'function dxSign(g, CHARS, CX, yMid) {' in _dx, \
    'dxSign 必须吃"梁的纵向中点"（yMid），自己算居中基线'
# ③d 第三轮（用户钦定）：字高减半 ⇒ 梁 28→14、省下的 14px 全并进上亮窗（13→27）
#     并改成**黑色玻璃**。三个数必须同时对，只改一个就不是用户要的那个样子。
assert _num('DX_HB') == 14 and _num('DX_HL') == 27, \
    '门楣梁/上亮窗不是 14/27 —— 第三轮"梁减半、多出来的区域放黑色玻璃"的尺寸被改了'
assert 'const DX_BLKG' in _dx and 'px(g, R(-wm), yl, DX_WM, DX_HL, DX_BLKG);' in _dx, \
    '上亮窗必须是黑色玻璃（DX_BLKG）—— 省下的 14px 要落在这一层'
assert 'function dxFacade(g, CX, baseY, CHARS) {' in _dx, \
    'dxFacade 必须把点阵表传进来（东/西楼只有这四个字不同）'
# ④ 雨篷（用户点名的"门最上边的石头挡雨台"）：悬挑板 + 顶面受光 + 下沿暗线，
#    且**比幕墙区宽**（DX_WR > DX_WM）—— 不出挑就不是"挑"出来的雨篷。
assert 'const DX_WR = 124;    // 雨篷宽（门区外各再出挑 10 —— 挡雨台要"挑"得出来）' in _dx, \
    '雨篷尺寸被改了'
assert 'px(g, R(-wr), yTop, DX_WR, 1, DX_APRON);' in _dx, \
    '雨篷顶面没了 —— 悬挑石檐是用户点名的四要素之一'
# ⚠️ 雨篷必须比门区**宽**（这才叫"挑"出来），又不能宽成一条通长飞檐。
assert _num('DX_WR') > _num('DX_WG') and _num('DX_WR') <= _num('DX_WG') + 30, \
    '雨篷宽要"比门区出挑、又不至于宽成幕墙"—— 两边各出挑 10（124 = 104 + 2×10）'
# ⚠️ 门楣梁必须**比门区略宽**：第一版把它写成"= 幕墙宽"，门头变成一块左右各空
#    5 个字的白匾；反过来写成"= 门区宽"则匾额正好齐门洞、看不出两端压在墙上。
assert 'const DX_WB = 108;' in _dx, \
    '门楣梁宽被改了 —— 照片里梁/门 = 620:595 = ×1.042，这里取 ×1.04（104→108）'
assert _num('DX_WB') > _num('DX_WG') and _num('DX_WB') <= _num('DX_WG') * 1.1, \
    '门楣梁要比门区略宽（两端压在墙上），但只宽一点点 —— 齐平或宽一圈都不像照片'
assert 'px(g, R(-wb), yb, DX_WB, DX_HB, DX_STONE);' in _dx, \
    '门楣花岗岩带没按门楣带宽画'
assert "const glassCol = PALETTE[styleOf(" in _dx, \
    '窗玻璃色要读 PALETTE 同源（第四轮起"墙色"已由 §5.8.2b 自带，改读玻璃色）'
assert 'const glassCol = PALETTE' not in _dx.split('function dxRestyle')[0], \
    'PALETTE 不能在 58 段顶层求值 —— 58 在 60 段之前加载，会撞 const 暂时性死区、整页 JS 死'
# ⑤ 几何是**从精灵高度反推**的（见 58 段文件头 §三）：硬编码某一栋的数就会
#    在两栋楼之间错位。这条钉住那条推导链。
assert 'const baseY = H - 35;' in _dx, \
    'baseY 必须是 H − SHY(21) − 14 推出来的，不许硬编码'
assert 'const eaveY = baseY - DX_WALLH;' in _dx and 'const DX_WALLH = DX_FLOORS * FLOOR_H;' in _dx, \
    '檐口必须由 baseY − 层数 × FLOOR_H 反推，不许写死一个数'
# ⑤b 第四轮：**层数是数据不是模板** —— 加高到 8 层走的是装配处 styleOf 的 floors，
#     30_building.js 一个字没动（这正是"覆盖重绘不改模板"的边界）。
#     第十六轮用户要求"减少两层、不动塔顶"，8 → 6（H 429/439 → 361/371）。
#     ⚠️ 但两处必须**同时**是 6：styleOf 管墙高/画布高 H（3 层 259 ⇒ 8 层 429 ⇒ 6 层 361），
#        58 段的 DX_FLOORS 管窗排数、玻璃带分格与 eaveY（= baseY − DX_WALLH）。
#        只改一边 ⇒ H 与 eaveY 对不上，整面墙错位；而且 H∈{361,371} 的告警只在
#        运行时 console.warn，四套自动验收一个都不会报（它们都不看画面）。
_m_f = re.search(r'/思源\[东西\]楼/\.test\(name\)\)\s+return \{ p: 4, floors: (\d+) \};', _dxa)
assert _m_f, 'styleOf 里思源东/西楼的层数分档没了 —— 两栋会退回 3 层'
assert int(_m_f.group(1)) == _num('DX_FLOORS') == 6, \
    'styleOf 的层数与 58 段的 DX_FLOORS 不一致（或不是 6 层）—— eaveY 会算错、整面墙错位'
assert 'if (H !== 361 && H !== 371)' in _dx, \
    '58 段少了"精灵高不在 {361,371} 就告警"那道闸 —— 层数被改回来时没人吭声'
assert 'const axB = c.width / 2;' in _dx and \
    'const CX = axB + dxDoorShift(c.width, name);' in _dx, \
    '中轴必须是 canvas 宽 / 2（= PADX + w/2）推出的 —— 硬编码会让两栋楼里的一栋偏掉；' \
    '且第八轮起**门组中轴 CX 必须由建筑中轴 axB 加平移量**得到（见 §5.8.7）' \
    '—— 合成一条就等于门没挪，而四套自动验收全绿'
# ⑥ 不许吃掉共享随机流：内部必须自带 makeRng，否则 speckle 会重掷全校园噪声
#    （与第七轮"动水域 ⇒ 重掷地面噪声"同一个坑，而且三套验收都查不出来）。
assert 'const rng = makeRng(5813);' in _dx, \
    '门面重绘用了共享 RNG —— 会重掷全校园地面噪声（必须自带 makeRng）'
assert 'rngS(' not in _dx, '门面重绘不许碰 scatter 的随机流 rngS'
# ⑥b 门前净空（第三轮：用户「把西楼门口的树清除」）。同 §5.3.10 clearDiaClearance：
#     **摆完之后按美术盒删**，不是改散射种子 ⇒ 不动随机流、_propdiff 只少被删的那一件。
#     ⚠️⚠️ 门的坐标**不能在 props 里找** —— addProp 是按白名单复制的
#        （只取 img/ax/ay/x/y/baseY/tag），建筑对象上的 `__dx` 记号在那一刻就被丢掉。
#        第一版拿 `props.filter(p => p.__dx)` 找门 ⇒ DX_DOORS 恒空、净空一棵树都没删，
#        而四套自动验收全绿。门坐标只能由装配处登记，所以这里把两条线都钉住。
assert 'b.__dx = true;' in _dx, '建筑没打 __dx 记号 —— 门前净空就找不到门在哪'
assert 'const DX_DOORS = [];' in _dx and \
    'if (b.__dx) DX_DOORS.push({ x: ax + dxDoorShift(b.canvas.width, name), y: ay });' in _dxa, \
    '门的世界坐标没登记（或登记的仍是**建筑**中轴）—— 第八轮起门组平移了，' \
    '不加上同一个偏移，门前净空清的就是旧门前面那片地'
assert 'for (const d of DX_DOORS) {' in _dx and 'props.filter(p => p.__dx)' not in _dx, \
    '门前净空又在 props 里找楼了 —— addProp 的白名单复制会丢掉 __dx，那里找不到门'
assert 'function clearDxDoorFront() {' in _dx, '门前净空函数没了 —— 西楼门口那棵树会糊在门脸上'
assert 'if (p.tag !== "tree" && p.tag !== "lawnTree") { keep.push(p); continue; }' in _dx, \
    '门前净空只许删树（tree / lawnTree）—— 灌木矮、糊不住门，一并删就越权改了绿化'
assert 'if (!DX_DOORS.length) return 0;' in _dx, \
    '门前净空缺"没登记门就不动手"这道闸 —— 空的 DX_DOORS 不该删掉任何东西'
assert 'const dxDoorCleared = clearDxDoorFront();' in _dxa, \
    '门前净空没被调用 —— 光定义不调用（第一版 dxSign 就是这么空的）'
assert _dxa.index('const clashDropped = clearPropTreeClash();') < \
    _dxa.index('const dxDoorCleared = clearDxDoorFront();'), \
    '门前净空必须排在 clearPropTreeClash() 之后（与旗杆/雕塑/体育馆台阶同一族的约束）'
assert _dxa.index('const dxDoorCleared = clearDxDoorFront();') < \
    _dxa.index('const lawnRing = plantLawnRing();'), \
    '门前净空必须排在 plantLawnRing() 之前（树圈后种才绕得开已站好的树）'
# ⑦ 第四轮起，**整面墙**都由 58 段重铺（不再是"只擦门区那条带再补一块料石"）。
#    擦除框必须落在正面墙的左右边界上（PADX=26），否则两侧的棱光/外轮廓线会被一起擦掉；
#    而补墙的料石纹样被两种新墙皮取代 —— 旧的两条吸附断言守护的代码已经删了，
#    换成下面这一组**覆盖面更强**的契约（每条都只有出图才看得见）。
_bld = part('30_building.js')
# ⑧ 「两栋体育馆向北延长直到 K 灰色石板区域被覆盖」这条需求的可执行定义
#    （用户 2026-09-17）。灰石板 = K.BLD footprint 里精灵没盖住的北半边 ——
#    `paintCells` 给 K.BLD 铺的是"楼前硬地"（20_ground.js 里明写"露出来的北半边
#    读作前庭/消防通道"）。覆盖它的唯一杠杆是屋面板高度：
#      roofT = ceil(depth) − wallH  ⇒ 屋面顶边（局部第 PADT+roofT 行）落到 footprint 北缘。
#    ⚠️ 三条一起钉：① 模板里这个分支存在；② 是 ceil 不是 round（round 在半整数
#       进深上会向下取整、反倒留一条 1px 灰缝）；③ 只有那两栋挂 roofFull，
#       其余楼仍走通用的 0.60/190（改了会把运输实验馆、学生服务中心一起变形）。
assert 'const roofT  = o.roofFull ? (Math.ceil(depth) - wallH)' in _bld, \
    '30 段的 o.roofFull 分支没了或被改成 round —— 屋面板就盖不满 footprint 的北半边'
assert _ass.count('roofFull: true') == 2 and \
    'if (/^老体育馆$/.test(name))                    return { p: 3, floors: 3, roofFull: true };' in _ass and \
    'if (/^新体育馆$/.test(name))                    return { p: 3, floors: 5, roofFull: true };' in _ass, \
    'styleOf 里挂 roofFull 的不是恰好那两栋体育馆（多一个/少一个都会改变楼的外观）'
#    ⭐ 第三十二轮起调用点多了一个 `|| name === "第五教学楼"`：这栋的 roofFull
#       **不挂在 styleOf 上**（挂上去会顺带改 `styleOf("/教学楼/")`，全校 4 层教学楼
#       都去吃那个分支）⇒ 按楼名单独加。上面的 `count('roofFull: true') == 2` 不受影响。
assert 'roofFull: st.roofFull || name === "第五教学楼",' in _ass, \
    'styleOf 给了 roofFull，但 makeBuilding 的调用点没把它传下去（白写）—— ' \
    '第三十二轮起这里还必须带 `|| name === "第五教学楼"`（本楼的 roofFull 按楼名单独加）'
#    老体育馆这条必须排在通用那条**之前**，否则它先被 `/体育馆|实验|馆$/` 接走、拿不到标志。
assert _ass.index('if (/^老体育馆$/.test(name))') < _ass.index('if (/体育馆|实验|馆$/.test(name))'), \
    'styleOf 里老体育馆那条排到通用体育馆规则之后了 —— 它会被通用规则抢走、丢掉 roofFull'
assert 'const margin = 22;' in _bld, \
    '30 段窗阵的 margin 变了 —— 58 段的窗阵仍按 22 取齐墙沿，会算错列'
assert 'const wx = Math.round(margin + cn * (WIN_W + stepX));' in _bld, \
    '30 段窗列算式变了 —— 58 段的 DX_MARGIN / DX_W2 是以它为据定的'
assert 'g.clearRect(wx0, eaveY + 1, wx1 - wx0, baseY - eaveY);' in _dx, \
    '整面墙没被擦掉 —— 旧墙皮（砖缝/旧窗/旧楼层线）会与新墙皮叠在一起'
assert 'const wx0 = DX_PADX, wx1 = c.width - DX_PADX;' in _dx and \
    'const DX_PADX   = 26;' in _dx, \
    '正面墙左右边界必须取 PADX(26) —— 取宽了会把两侧的棱光与外轮廓线一起擦掉；' \
    '且这个 26 只许有一份（DX_PADX）：§5.8.7 的窗距是拿它现算的'
assert _dx.index('g.clearRect(wx0, eaveY + 1,') < _dx.index('dxWall2(g, wx0, wx1, eaveY, baseY);'), \
    '擦除必须排在重铺之前 —— 反了就等于什么都没画'
# ⑦b 两种墙皮（一楼浅棕方砖 / 2–8 层白色小方格瓷砖）+ 每层一排的加宽窗 + 中央蓝玻璃带
assert 'function dxWall2(g, x0, x1, eaveY, baseY) {' in _dx, \
    '两种墙皮的函数没了 —— 两栋楼会只剩擦空的白墙'
assert 'const gy = baseY - FLOOR_H;' in _dx, \
    '一楼顶必须正好落在 baseY − FLOOR_H（一楼 = 最底下一层），否则方砖/瓷砖的分界不在楼层线上'
assert 'const hb = baseY + 1 - gy;' in _dx, \
    '一楼方砖必须铺到 baseY 那一行（少 1px 楼脚会留一行透明，接地窄带压在半透明上）'
assert 'DX_TILE  = 4;' in _dx and 'DX_TILE0 = 12;' in _dx, \
    '楼上白瓷砖 4px 一格（用户："特别小"）、一楼方砖 12px 一格 —— 两条都是用户点名的'
assert 'DX_BTILE' in _dx and 'DX_WTILE' in _dx, \
    '两种墙皮各要一套底色 —— 一楼浅棕方砖、楼上白色小方格瓷砖'
assert 'dxWall2(g, wx0, wx1, eaveY, baseY);' in _dx, '墙皮函数定义了却没被调用'
assert 'const DX_W2    = Math.round(WIN_W * 1.5);' in _dx, \
    '窗宽必须是模板 WIN_W 的 1.5 倍（用户钦定），且写成算式才是同源'
assert 'const n = Math.max(1, Math.floor((span + DX_GAP2) / (DX_W2 + DX_GAP2)));' in _dx, \
    '窗阵必须**左右各自成阵**（从墙沿排到玻璃带边）—— 照 30 段从头等分再挖掉中间，带边会挂半扇窗'
# ⚠️ 第八轮：窗阵改成**固定窗距**（每侧"排得下几列是几列"），不再按各自跨度拉伸 ——
#    门一挪，两侧跨度就不等，各自拉伸会让一边窗挤成 34.6px、一边散成 63.5px，
#    "楼体不变、只是门的位置变了"就不成立了。窗距的口径在 dxPitch（见 ⑩）。
assert 'const pitch = dxPitch(x0, x1);' in _dx and \
    'const n = Math.max(1, Math.floor((span + step) / pitch));' in _dx and \
    'dxWinAt(g, Math.round(xa + c * pitch), wy, glassCol);' in _dx, \
    '窗阵又按跨度拉伸了 —— 固定窗距（dxPitch）是"楼体不动、只有门动"的可执行定义'
assert 'run(x0 + DX_MARGIN, bl - DX_BGAP);' in _dx and 'run(br + DX_BGAP, x1 - DX_MARGIN);' in _dx, \
    '窗阵的两半必须都排（少一半就是一侧没窗）'
assert 'const DX_BW    = DX_WG;' in _dx, \
    '中央玻璃带宽度必须钉在门区宽上 —— 用户："宽度不能超过大门宽度"'
assert 'const DX_BC    = 5;' in _dx, '玻璃带要分 5 列（用户钦定，思源楼只有 2 列）'
assert 'const C = SY_COL;' in _dx, \
    '玻璃带配色要读思源楼幕墙的 SY_COL（用户："可以参考思源楼的蓝色玻璃带"），不许自己写色号'
assert 'for (let y = eaveY + FLOOR_H; y < yBot; y += FLOOR_H)' in _dx, \
    '玻璃带横向分格要跟着楼层走（与窗排、腰线同节奏），不是照抄思源楼的 14px'
assert 'dxBand(g, CX, eaveY, yTop);' in _dx, \
    '玻璃带没被调用 —— 用户点名的"从大门垂直到楼顶"那一条会整条缺失'
# ⑦c ⚠️ 30 段画在墙面上的四笔（檐口横线 / 左右棱光 / 雨水管 / 接地窄带）在整面墙擦除时
#     **全被擦掉**，必须照原样补回 —— 少一笔就是"墙上少根雨水管"，四套自动验收照样全绿。
#     ⚠️ 只有左右**外轮廓**那两条竖线在擦除框之外、原样保留，不许重画。
assert 'function dxEdges(g, x0, x1, eaveY, baseY) {' in _dx, \
    '棱光/檐口线/雨水管/接地窄带的补笔没了 —— 墙上会少一根雨水管'
assert 'dxEdges(g, wx0, wx1, eaveY, baseY);' in _dx, '补笔定义了却没被调用'
assert 'const pipeX = x1 - 7;' in _dx, \
    '雨水管位置必须与 30 段 §3.6 一致（x1 − 7）—— 挪了就与隔壁那列建筑对不上'
assert 'contactBand(g, x0 + 1, x1 - 1, baseY - 1, 2, 0.34);' in _dx, \
    '接地最深窄带没补回来 —— 楼脚会少一道接地阴影'
# ⑧ ⚠️⚠️ **早退闸**（2026-09-13 事故，见 58 段文件头 §五）。
#    门区被 clearRect 擦空后，只要有一条**无条件**早退拦在 dxFacade 前面，
#    交付件里的门就是**一片透明** —— 而 accept 34/34、verify、zoomtest 28/28、
#    _propdiff 306/306 逐字节 **四套自动验收全部绿灯**，因为它们都不看画面。
#    所以这里钉两条：探针必须在"擦完、画之前"，且全函数**只许有一次裸 return b;**
#    （= 末尾那次）。探针那行以 `if (` 开头，不计入。
_dbody = _dx.split('function dxRestyle')[1]
assert _dbody.index('if (window.__DXBARE__) return b;') < \
    _dbody.index('dxFacade(g, CX, baseY, CHARS);'), \
    'DXBARE 探针必须夹在"擦完、画之前"—— 排到 dxFacade 后面就等于没探'
_bare = re.findall(r'(?m)^[ \t]*return b;[ \t]*(?://.*)?$', _dbody)
assert len(_bare) == 1, \
    'dxRestyle 里出现了 %d 条裸 `return b;`（只许末尾那一条）—— ' \
    '多出来的那条若在 dxFacade 之前，门区就是一片透明，而四套自动验收全绿' % len(_bare)
assert 'dxFacade(g, CX, baseY, CHARS);' in _dbody and 'dxStair(g, CX, baseY);' in _dbody, \
    '门面/台阶没画 —— 只擦不画就是"门是一片透明"那次事故的重演'
# ⑨（第五轮立、第六轮**改方向**）楼顶"凸"形 + 撤掉屋名标牌。用户 2026-09-13 第五轮：
#    「楼顶上思源东楼和思源西楼那几个字可以撤掉了。然后因为蓝色玻璃带实际上是突出于
#      楼层的。所以我们视觉上楼顶应该是凸这个形状的，更新一下两个楼的楼顶」
#    同日第六轮·纠正方向（**这一条是本组全部判据的根**）：
#    「你搞错了，虽然楼顶是突出的，但是不是向上突出，是向着屏幕里的南方突出，因此楼顶
#      看起来才是凸字形。因为玻璃带是向南方屏幕内水平面平行突出的」
#    ⇒ 探出体是**朝观者（屏幕里的南 = y 增大）水平探出**的一个水平面：顶面与屋面**同高同料**、
#      往南多铺 DX_OUTS px，南沿压一道檐口投影线；玻璃本身一个字不动（所以不会有接缝错位）。
#      ⚠️ 第五轮那版是"穿出屋面再往上长 DX_RISE"—— **方向错了，已整段作废**（见下 DX_RISE 断言）。
_m_out = re.search(r'const DX_OUT\s*=\s*(\d+);', _dx)
assert _m_out, '58 段里找不到 DX_OUT —— 第六轮"玻璃带朝观者（南）探出"的进深常量被删了'
assert 0 < int(_m_out.group(1)) <= 40, \
    'DX_OUT 必须在 1..40 世界像素（≈0.1..4m）：0 就不叫"探出"，太大就成一座凸出的盒子'
# ⚠️ 探出量在屏幕上的高度必须**由 DX_OUT 现算**：0.60 正是 30 段 §3.2 roofT = depth × 0.60 的
#    同一个进深压缩。另存一份常数就会与屋面/雨篷的进深对不上（本项目的"派生量不许再存一份"）。
assert 'const DX_OUTS  = Math.round(DX_OUT * 0.60);' in _dx, \
    'DX_OUTS 必须由 DX_OUT × 0.60 现算 —— 0.60 是 30 段进深压缩同一个数，另存一份就会错进深'
# ⚠️ 反向闸：第五轮那套"向上长"的写法不许复活（它是被用户明确否掉的方案）。
#    ⚠️ 判据只吃**代码**、不吃注释：本文件头与 §5.8.3d 都要把"第五轮错在哪儿"记下来
#    （含 DX_RISE 这个名字），把注释也算进来的话，这条否定断言会拿**自己的注释**当 target
#    报**假失败** —— 本项目在假山那轮已经栽过一次（README 已知坑）。
_dxcode = re.sub(r'/\*.*?\*/', ' ', _dx, flags=re.S)
_dxcode = re.sub(r'(?m)//[^\n]*$', '', _dxcode)
assert 'DX_RISE' not in _dxcode, \
    '58 段的**代码**里又出现了 DX_RISE —— 第六轮已判定"不是向上突出"：往上长是把方向搞反了'
# ⚠️⚠️ 与 §⑧ 同款：**定义了不等于画了**。第五轮的门面就是"dxSign 定义了没调用"，
#    门楣上一片空白而四套自动验收全绿（58 段文件头 §五）。这里钉的是**调用点**。
assert 'function dxRoofBand(g, x0, x1, eaveY, doorCX, name, roof) {' in _dx, \
    '楼顶探出段没独立成函数（或少了 doorCX）—— 它要按 makeSign 现算标牌范围、' \
    '按传入的屋面色取料，中轴得由门组给（第八轮起门组可偏）'
assert 'dxRoofBand(g, wx0, wx1, eaveY, CX, name, roof);' in _dx, \
    '⭐ dxRoofBand 定义了却没被调用 —— 楼顶还是平的、四个金字还挂在那儿，' \
    '而 accept / verify / zoomtest / _propdiff 四套自动验收全绿，只有出图才看得见'
_dxb = _dx.split('function dxRoofBand')[1].split('\nfunction ')[0]
# ⚠️ 本组最要紧的一条：探出段**只许盖、不许擦**。落在它这一条里的屋面设备
#    （30 段 §3.2 的随机方块，只要在标牌**上方**就逃得过"让开牌面"那道判据）一旦被
#    clearRect 切掉半块，露出的就是**透明豁口**，而画面之外没有任何验收看得见。
assert 'clearRect' not in _dxb, \
    '楼顶探出段里出现了 clearRect —— 它必须**只盖不擦**：擦到屋面设备就是切掉半块 + 透明豁口'
# ⚠️ **方向判据**（第六轮纠错的那个"根"）：南端必须 `eaveY + DX_OUTS`（檐口往南 = 屏幕下方），
#    写成 `eaveY − …` 就又成了"向上突出"。这一条是"方向"本身的可执行定义。
assert 'const pBot = eaveY + DX_OUTS;' in _dxb, \
    '探出体的南端必须是 eaveY + DX_OUTS（檐口之南 / 屏幕下方）—— ' \
    '写成 eaveY − … 就又成了用户否掉的"向上突出"'
# ⚠️ **不许碰玻璃**：玻璃（5 列分格 / 楼层节奏 / 反光相位）一律还是 §5.8.3b 那条。
#    第五轮那版就是在屋面这一段**另画了一遍玻璃**，才会与墙面那条错缝。
assert 'GLASS' not in _dxb and 'SY_COL' not in _dxb, \
    '楼顶探出段里出现了玻璃色 —— 它只许铺顶面，玻璃仍归 §5.8.3b 那一条；' \
    '在这儿重画一遍玻璃必然与墙面错缝（第五轮那版就错在这里）'
# ⚠️ **同料同源**：顶面用 30 段 §3.2 板面那句一模一样的料（shade(roof, −0.04)），
#    南沿用 30 段檐口投影线那句一模一样的式子（shade(roof, −0.60)）。
assert 'px(g, cv.x0, cv.y0, cv.x1 - cv.x0, cv.y1 - cv.y0, shade(roof, -0.04));' in _dxb, \
    '探出体的顶面必须与 30 段屋面**同料**（shade(roof, −0.04) 那句的同一个式子）'
assert 'shade(roof, -0.60)' in _dxb, \
    '探出段南沿必须压一道 30 段 §3.2 那样的檐口投影线（shade(roof, −0.60)）'
# ⚠️ **盖上去之后要把盖掉的屋面笔法补回来**，否则屋面上会凭空缺一道分坡脊线、少一片斑点。
assert 'PADT + Math.round((roofT - 12) * j / 4) + 6' in _dxb, \
    '被顶面盖掉的分坡脊线没补回来 —— 式必须与 30 段 §3.2 逐字同源，否则脊线会断在探出段边上'
assert 'speckle(g, a0, t0,' in _dxb and 'const rng = makeRng(5807);' in _dxb, \
    '被顶面盖掉的斑点没补回来，或补斑点时动了共享随机流 —— ' \
    '必须用**局部** makeRng：碰共享流会让全校园的散射逐字节重排'
# ⚠️ 宽度与覆盖范围一律**现算**：`makeSign` 的宽度是字体度量不是常数（第五轮已栽过），
#    北端要够到标牌顶边才盖得住那四个字。
assert 'const sg = sgn ? signRect(sgn, x0, w, eaveY) : null;' in _dxb and \
    '{ x0: sg.x - 2, x1: sg.x + sg.w + 5, y0: sg.y - 2, y1: eaveY }' in _dxb, \
    '屋名标牌那块遮盖必须由 signRect **现算**（北界 = 牌面顶边 sg.y − 2）—— ' \
    '第八轮门组一挪，探出体就盖不到挂在**建筑中轴**上的牌子了，' \
    '少画这一块那四个金字会原地露出来，而四套自动验收全绿'
assert _dx.index('dxEdges(g, wx0, wx1, eaveY, baseY);') < \
    _dx.index('dxRoofBand(g, wx0, wx1, eaveY, CX, name, roof);'), \
    '楼顶那一段必须排在 dxEdges **之后** —— 否则 §5.8.3c 的檐口横线会横穿探出体'

# ⑩ 第八轮（2026-09-17）**门组横向平移**。用户：「将思源西楼的大门连同其蓝色窗户带和突起
#    一同向右移动两个窗户的距离，楼体宽度高度都不变，只是大门位置变化，将思源东楼的大门
#    连同其窗户带，楼顶突起一起向左移动两个窗户的距离其他不变」。
#    ⇒ 门 / 玻璃带 / 楼顶探出体 / 门前台阶四件共用一条**门组中轴 CX**、一起平移 k 个窗距；
#      楼体（墙皮 / 窗阵 / 棱光 / 雨水管）只跟着带子重排，宽高与位置不动。
assert 'const DX_DOOR_K = { "思源西楼": +2, "思源东楼": -2 };' in _dx, \
    '门组平移表不见了或被改了数 —— 用户钦定：西楼右移 2 个窗距、东楼左移 2 个窗距'
assert 'function dxDoorShift(canvasW, name) {' in _dx and \
    'return (k < 0 ? -1 : 1) * Math.round(dxPitch(DX_PADX, canvasW - DX_PADX) * Math.abs(k));' in _dx, \
    '平移量必须按**窗距**现算（"两个窗户的距离" = 2 × 窗距）—— 写死 83/80 的话，' \
    '窗宽或墙宽一变就偏；且取整必须**按绝对值再补符号**（Math.round(−79.5) = −79，' \
    '东楼会少挪 1px ⇒ 右侧少排一列窗 + 墙右端留一条空墙）'
assert 'function dxPitch(x0, x1) {' in _dx and \
    'return DX_W2 + (span - n * DX_W2) / (n - 1 || 1);' in _dx and \
    'const span = (cx - DX_BW / 2 - DX_BGAP) - (x0 + DX_MARGIN);' in _dx, \
    '窗距必须在**原布局**上量（带子还在建筑中轴上那一版）—— 拿新中轴去量会自相矛盾'
assert 'dxWindows(g, wx0, wx1, CX, eaveY, baseY, glassCol);' in _dx and \
    'dxBand(g, CX, eaveY, yTop);' in _dx and \
    'dxFacade(g, CX, baseY, CHARS);' in _dx and \
    'dxStair(g, CX, baseY);' in _dx, \
    '门组四件（窗阵让位 / 玻璃带 / 门 / 台阶）没有共用同一条中轴 —— 少传一件就各画各的：' \
    '门挪走了、台阶还留在原地（四套自动验收全绿，只有出图看得见）'
assert 'const dx0 = Math.round(Math.min(CX, axB) - DX_WR / 2 - 4);' in _dx and \
    'const dx1 = Math.round(Math.max(CX, axB) + DX_WR / 2 + 4);' in _dx, \
    '门区擦除框必须取**旧门与新门的并集** —— 30 段那扇旧门的台阶画在 baseY 之下 9px，' \
    '整面墙那次擦除够不到，不并进来旧台阶会留在新墙脚下'
#    ⚠️ 移门之后**屋名标牌不再被探出体顺带盖住**（牌挂建筑中轴、探出体挂门组中轴），
#       所以 §5.8.3d 必须多盖一块；这条是本轮唯一"漏了就四个金字原地露出来、
#       而五套自动验收全绿"的地方，已在 ⑨ 组里钉住矩形与现算口径。

# ⑪ 第十五轮（2026-09-17）**楼顶阁楼 + 塔尖**。用户：「给我们的思源东楼和思源西楼各加上
#    一个顶楼或者说阁楼，这个阁楼的正面形状我放到了 ppt 的第三页，注意一定要控制好大小，
#    这个顶楼塔尖只加在我们大门上方，也就是玻璃幕墙正上方，高度差不多是两层。这个顶楼塔尖
#    外部覆盖和楼一样的白色小瓷砖，中间是蓝色窗户带，注意有窗户网格，大概是两行窗户」。
#    ⇒ 尺寸口径（用户拍板"宽锚幕墙、高锚两层"）：宽 = DX_BW、高 = 2 × FLOOR_H、
#      尖顶按 PPT slide3 那个等腰三角形的**自身比例**现算（104 / 2.504 ≈ 42）。
#    ⚠️ **同日修订**（用户）：「调整一下两个地方，第一个，尖顶是白色的，和屋顶棕色不一样，
#      尖顶的蓝色窗户带太大了，不需要和下方的竖直蓝色玻璃带连接，缩小至原来的 2/3」
#      ⇒ ① 尖顶改白（`roof` 参数连同屋面色一起从 dxAttic 里删干净）；② 蓝窗带 84 → 56（2/3）。
#      **这两条都是"退回去六套自动验收全绿、只有出图才看得见"的类型**，所以各有一条否定断言。
assert 'const DX_ATT_W  = DX_BW;' in _dx, \
    '塔面宽必须锚在**玻璃幕墙带宽**上（"只加在玻璃幕墙正上方"的可执行定义）'
assert 'const DX_ATT_H  = 2 * FLOOR_H;' in _dx, \
    '塔身高必须写成 2 × FLOOR_H（用户："高度差不多是两层"）—— 写死 68 的话层高一变就错'
assert 'const DX_ATT_D  = DX_OUT;' in _dx, \
    '塔的进深必须复用探出体那个进深 —— 塔站它上面，两个投影量必须同源，否则塔基与玻璃带错缝'
assert 'const DX_ATT_G  = Math.round(DX_ATT_W / 2.504);' in _dx, \
    '尖顶高必须按 PPT 第三页等腰三角形的**自身比例**现算（2.5722 : 1.0271 = 2.504 : 1）—— ' \
    '存一个 42 进去，体宽一调尖顶就不成比例了'
assert 'const DX_ATT_M  = DX_ATT_H - 2 * DX_ATT_R - 2 * DX_ATT_PH;' in _dx, \
    '中横梃厚必须由"塔高 − 上下框 − 两行窗"现算（派生量不许再存一份）—— 反解出来必须是 10'
assert 'const DX_ATT_BW = Math.round((DX_ATT_W - 20) * 2 / 3);' in _dx, \
    '蓝窗带宽必须**现算**：(塔面宽 − 两侧白瓷砖) × 2/3 = 56（用户："缩小至原来的 2/3"）—— ' \
    '写死 56 则塔面宽一调就不成 2/3；写回 DX_ATT_W − 20 就是"接住下方那条竖玻璃带"的旧观感'
assert 'dxAttic(g, CX, eaveY);' in _dx, \
    '⭐ dxAttic 定义了却没被调用 —— 两栋楼顶上还是平的，' \
    '而 accept / verify / zoomtest / _propdiff / _sprhash 五套自动验收全绿，只有出图才看得见'
assert 'function dxAttic(g, CX, eaveY) {' in _dx, \
    '阁楼段没独立成函数（或签名不对）—— 修订后尖顶改白，**不许再有 roof 参数**（见下条否定断言）'
assert _dx.index('dxRoofBand(g, wx0, wx1, eaveY, CX, name, roof);') < \
    _dx.index('dxAttic(g, CX, eaveY);'), \
    '⭐ 阁楼必须画在 dxRoofBand **之后** —— 塔基正好压在探出体的顶面上，' \
    '先画塔就会被那笔顶面盖掉半截（塔成半截而五套自动验收全绿，只有出图看得见）'
# ⚠️ `_dxa` 必须**只圈住 dxAttic 这一个函数**（从 `function dxAttic` 到 §5.8.7 的注释头，
#    含函数自己的收尾 `}`）—— 下面那条 `'roof' not in _dxa` 的否定断言全靠这个边界。
#    若哪天 dxAttic 被挪到 §5.8.7 之后，这里会悄悄圈进 dxRestyle（它签名里就有 roof）
#    ⇒ 断言变成"永远失败"暴露出来，不会变成假绿。
_dxa = _dx.split('function dxAttic')[1].split('\n/* --- 5.8.7')[0]
# ⚠️ 与 §⑨ 同一条铁律：**只盖不擦**。塔落在屋面中部，落在它这一条里的屋面随机设备
#    （30 段 §3.2 的方块）一旦被 clearRect 切掉半块，露出的就是**透明豁口**。
assert 'clearRect' not in _dxa, \
    '阁楼段里出现了 clearRect —— 它必须**只盖不擦**：擦到屋面设备就是切掉半块 + 透明豁口'
# ⚠️ 塔面对齐的两条：南沿必须落在 `eaveY + DX_OUTS`（与玻璃带顶严丝合缝），
#    北界必须由进深现算（写成常量就把 ×0.60 的压缩口径丢了）。
assert 'const fBot = eaveY + DX_OUTS;' in _dxa and \
    'const nTop = fTop - Math.round(DX_ATT_D * 0.60);' in _dxa, \
    '塔基南沿必须是 eaveY + DX_OUTS、北界必须由进深 ×0.60 现算 —— ' \
    '这两个数一错，塔就与玻璃带错开一条缝（出图才看得见）'
# ⚠️ 瓷砖必须与楼体同源同相位：竖缝从 DX_PADX 起算（两栋楼 w 不同，按各自左沿起算会错半格），
#    横缝一格 DX_TILE（"和楼一样的白色小瓷砖"）。
assert 'for (let x = DX_PADX + DX_TILE; x < br; x += DX_TILE)' in _dxa and \
    'px(g, bl, fTop, DX_ATT_W, DX_ATT_H, DX_WTILE);' in _dxa and \
    'for (let y = fTop + DX_TILE; y < fBot; y += DX_TILE)' in _dxa, \
    '塔面的白瓷砖必须照 §5.8.2b 的口径铺：DX_WTILE + DX_TILE 一格、竖缝相位从 DX_PADX 起算'
# ⚠️ 蓝窗带一律**读 SY_COL**（与墙上那条同源），且**必须在函数里读**（58 段在 60 段之前加载，
#    顶层读撞 const 暂时性死区 = 整页 JS 死）。
assert 'const C = SY_COL;' in _dxa and 'C.GLASS' in _dxa and 'C.GLASS_HI' in _dxa and \
    'C.GLASS_D' in _dxa, \
    '蓝窗带必须读 SY_COL（玻璃色与墙上那条同源）；且必须在函数体内读'
# ⚠️ "窗户网格 + 两行窗户"是用户点名的两条：竖分 DX_ATT_BC 列、两行窗各 DX_ATT_PH 高，
#    由 `const bw1 = ...` 与 `for (let r = 0; r < 2; r++)` 两处保证。
assert 'const bw1 = Math.round(DX_ATT_BW / DX_ATT_BC);' in _dxa and \
    'for (let r = 0; r < 2; r++)' in _dxa and \
    'px(g, bwl + 2, fTop + DX_ATT_R + DX_ATT_PH, DX_ATT_BW - 4, DX_ATT_M, C.GLASS_D);' in _dxa, \
    '两行窗 / 中横梃 / 竖分列这三笔是"窗户网格 + 两行窗户"本身，少一笔就是一条蓝带糊上去'
# ⚠️ 尖顶是**逐行扫描**画出来的（同 51 段攒尖顶的写法）：剪影 + 基带 + 三面坡 + 戗脊。
assert 'const span = fTop - apex, drop = nTop - apex;' in _dxa and \
    'const xl = y >= nTop ? bl : Math.round(cx - half * (y - apex) / drop);' in _dxa, \
    '尖顶必须逐行扫描：剪影 = 三角（apex..nTop）+ 全宽基带（nTop..fTop）—— ' \
    '这一条同时是"横带 + 三角"（PPT 第三页那个构图）的可执行定义'
# ⚠️ 修订后的两条（用户：「尖顶是白色的，和屋顶棕色不一样」「窗户带…缩小至原来的 2/3」）。
#    第一条是**否定断言**：`roof` 这个标识符在 dxAttic 里必须一个都不剩（连参数都删了）。
#    退回棕色的写法（`shade(roof, ...)`）能让 accept / verify / zoomtest / _propdiff /
#    _sprhash 六套自动验收**全绿**，只有出图看得见 —— 所以这条是本轮唯一的防回归手段。
assert 'roof' not in _dxa, \
    '⭐ dxAttic 里又出现了屋面色 `roof` —— 用户明确要求「尖顶是白色的，和屋顶棕色不一样」；' \
    '退回棕色的话六套自动验收全绿，只有出图看得见（而且 roof 参数已从签名/调用点删除）'
assert 'px(g, xl, y, xr - xl, 1, DX_WTILE);' in _dxa and \
    'DX_ATT_WL' in _dxa and 'DX_ATT_WD' in _dxa and \
    'px(g, bl, fTop - 2, DX_ATT_W, 2, shade(DX_WTILE, -0.60));' in _dxa, \
    '尖顶必须白：南坡 DX_WTILE、西坡 DX_ATT_WL、东坡 DX_ATT_WD、底沿 shade(DX_WTILE, −0.60) —— ' \
    '⚠️ 白底没有提亮余量（233 → 255 只剩 22 级），照旧写 shade(?, 0.30)/shade(?, −0.28) 的话' \
    '三个坡面会糊成一片纯白，必须走叠加色；底沿那道线是白尖顶与白塔面**唯一的分界**'
# ⚠️ 顶点行 = eaveY − 49：这条是"控制好大小"的落点（顶点必须留在画布内 ⇒ 不用改画布、
#    不动 baseY/ay、不碰任何碰撞盒）。写成别的式子就会顶出画布或把塔压扁。
assert 'fTop - Math.round((fTop - nTop) / 2) - DX_ATT_G' in _dxa, \
    '顶点行必须由"塔基带中点 + 尖顶高"现算（= eaveY − 49，东楼 19 / 西楼 29，都在画布内）'

# --- 图书馆契约（parts/36_library.js，2026-09-17 按**用户手绘的示意图**重设计）---
# 权威设计源 = `D:\desktop\校园示意图.pptx` 第 2 张（照片版交付被用户退回）。
# 背景：图书馆是全校**唯一没有任何断言**的建筑段（本文件里原先只有 chunk 注册那一行）。
# 而 accept / verify / zoomtest / _propdiff 四套自动验收**都不看画面**，
# 所以下面这组断言是这一节唯一的防回归手段 —— 每条都对应一个**真出过的错**。
_lib = part('36_library.js')
_libasm = part('60_assemble.js')
# ⚠️⚠️ 本组里有好几条**否定**断言（`X not in ...`），而这两个文件里恰恰都写着
#    "⚠️ 不是 XXX"式的注释来记录旧写法。注释也算进判据的话，断言就会拿**自己的注释**
#    当靶子报**假失败** —— 45_water.js 的假山那轮栽过一次，README 已知坑。
#    ⇒ 凡是否定断言，一律只吃**去注释后的代码**。`_strip_js` 已提到文件开头
#       （51 段那组加高断言也要用），下面的 `_libcode` / `_libasmcode` 就是它切的。
_libcode = _strip_js(_lib)
_libasmcode = _strip_js(_libasm)

# --- 网球场契约（parts/37_sports.js，2026-09-17 第七轮）---
# 用户口径（逐字）：「值得注意的是下方的网球场是被围栏围起来的，围栏比较高，是绿色的，
#   并且球场也是纵向排布的，球场颜色是蓝色」—— 三条：颜色 / 朝向 / 围栏。
# 37 段原先**一条断言都没有**，而 accept / verify / zoomtest 都不看画面 ⇒ 这组是唯一防线。
_sp = part('37_sports.js')
_spcode = _strip_js(_sp)
_tb = re.search(r'const TCOURT_BASE = "(#[0-9a-fA-F]{6})"', _spcode)
assert _tb, 'TCOURT_BASE 不见了'
_r, _g2, _b = (int(_tb.group(1)[i:i + 2], 16) for i in (1, 3, 5))
assert _b > _r and _b > _g2, \
    '网球场底色 %s 不是蓝色（用户口径："球场颜色是蓝色"；旧值 #4f7f52 是绿的）' % _tb.group(1)
# ① 纵向：长边是 ch（南北），短边由 ratio 反算 —— 可执行定义就是"ch 是自由量、cw 是导出量"。
assert 'ch = uh - 28; cw = ch / ratio;' in _spcode, \
    '网球场的长轴不是南北向 —— 用户口径："球场也是纵向排布的"。' \
    '旧口径 cw = uw - 22（长轴东西）会把球网画成竖线'
assert 'px(g, x0, cy - 1, Math.round(cw), 2, line);' in _spcode, \
    '球网不是**横线** —— 长轴南北时球网才左右横贯（照片里就是这样）'
assert 'const netX =' not in _spcode, \
    'netX 回来了 —— 那是个算了从没用过的死变量（本轮顺手删掉的）'
# ② 篮球场必须原样：它的自动判据与那对 clamp 一个字都不许跟着改。
assert 'if (uvert) { ch = (uh - 28); cw = ch / ratio; }' in _spcode and \
    'if (cw > uw - 16) { cw = uw - 16; ch = cw / ratio; }' in _spcode, \
    '篮球场那两条老式子被动过了 —— 用户这轮只提网球场，篮球场一个字不动'
# ③ 围栏：绿色 + 较高 + 绕一圈。
assert 'const TFEN_H = 32;' in _spcode, \
    '围栏高度不见了 —— 围栏要比校内围墙（46_walls.js 的 WALL_H = 22）"比较高"'
_fc = re.search(r'const TFEN_COL = "(#[0-9a-fA-F]{6})"', _spcode)
assert _fc, 'TFEN_COL 不见了'
_r2, _g3, _b2 = (int(_fc.group(1)[i:i + 2], 16) for i in (1, 3, 5))
assert _g3 > _r2 and _g3 > _b2, \
    '围栏颜色 %s 不是绿的 —— 用户口径："围栏比较高，是绿色的"' % _fc.group(1)
assert 'if (!isB) tfFenceRect(g, R);' in _spcode, \
    '网球场外圈没加围栏'
assert _spcode.index('if (!isB) tfFenceRect(g, R);') > \
    _spcode.index('px(g, ux + 4, uy + uh - 4, uw - 8, 4, "rgba(14,18,28,0.14)");'), \
    '围栏必须排在单元循环**之后** —— 南边那道（离镜头最近）要压住球场近端，' \
    '画在球场之前会被自己的场地盖掉'
# ④ ⚠️ 2026-09-17 第二轮：用户口径改口，围栏要**挡住小人**了 ——
#    「而且加上围栏之后小人不能移动到围栏内了」。第一轮那条"有意不做碰撞盒"的
#    断言随之作废（它守护的**行为**已被用户推翻），但**"37 段自己不许出现 addSolid"
#    这条形式约束必须留着**，理由换了：addSolid / solids 定义在 60_assemble.js，
#    而 37 段排在它**之前**加载 ⇒ 加载期引用会撞 const 暂时性死区、整页 JS 死
#    （58_dxdoor.js 的 PALETTE 栽过同款）。盒子写在 60 段 §6.5g，按 zoneRect 现算。
assert 'addSolid' not in _spcode, \
    '37 段出现了 addSolid —— addSolid/solids 定义在 60_assemble.js，本段排在它之前' \
    '加载，加载期引用会撞 const 暂时性死区＝整页 JS 死。碰撞盒写在 60 段 §6.5g'
# ⑤ **结构 = 立柱 + 柱间的编织网**（第二轮用户口径逐字：「围栏是那种绿色编织网围栏，
#    就是比如说四个栏杆围一个区域，区域中间是绿色铁丝网编织成的围栏这种，然后以这
#    四个栏杆和中间的网为单位连续放上这种单位组成的围栏」）。
#    第一版照 §4.6 围墙的 wallColumn 做成了"每 6px 一根连续竖带"＝一片实心绿，退回。
#    判据分三层：网面函数在（且**不铺底色**）/ 单元宽是唯一的步进量 / 望柱由它等分。
assert 'function tfMesh(g, x, y, w, h)' in _spcode, \
    '编织网的网面函数不见了 —— 用户口径："区域中间是绿色铁丝网编织成的围栏"'
assert 'function tfPost(g, x, y)' in _spcode, \
    '望柱不见了 —— 用户口径："四个栏杆围一个区域"，柱是"单元"的两个端点'
_mesh = _spcode.split('function tfMesh(')[1].split('\n}')[0]
assert 'px(g, x, y, w, h,' not in _mesh, \
    'tfMesh 在网面矩形上**铺了底色** —— "网"与"墙"在像素尺度上的唯一区别就是网面' \
    '**透气**：只落 1px 网丝、露出后面的球场与草地。第一版就是这么变成一片实心绿的'
assert 'TFEN_MESH_C' in _mesh, \
    'tfMesh 没画网丝'
assert 'const TFEN_UW = 30, TFEN_MESH = 5;' in _spcode, \
    '一个网片单元的宽 TFEN_UW / 网眼边长 TFEN_MESH 不见了 —— "以这四个栏杆和中间的' \
    '网为单位**连续**放上"的可执行定义就是"柱位置由 TFEN_UW 等分"'
assert 'const n = Math.max(1, Math.round((x1 - x0) / TFEN_UW));' in _spcode and \
    'const n = Math.max(1, Math.round((y1 - y0) / TFEN_UW));' in _spcode, \
    '东西/南北两向的望柱不是按 TFEN_UW 等分出来的 —— 柱子间距一自由，' \
    '"单元连续排列"就退化成"随手点缀几根柱子"'
# ⑥ 碰撞盒的**唯一**调用点（60 段 §6.5g）：必须按 zoneRect 现算（与这里画的这圈同源同式）。
assert 'addSolid(R.x + R.w / 2, R.y + R.h, R.w, R.h);' in _libasmcode, \
    '网球场围栏没有碰撞盒 —— 用户口径："加上围栏之后小人不能移动到围栏内了"'

# --- 新体育馆正面契约（parts/59_xgym.js §5.9，2026-09-17）---
# 用户口径（逐字）：「复刻新体育馆的正面，也就是那两张图片，并没有任何字体，可以理解为
#   墙面就是灰色长条形的瓷砖，纵向排布的，然后中间高度的区域是一块蓝色玻璃带，
#   不过这个玻璃带并没有水平贯穿建筑，并不长。」
# 与图书馆同理：accept / verify / zoomtest / _propdiff / _sprhash 五套**都不看画面**，
# 只有一条 `img.h` 变了（加高）会进 _sprhash 差异表，其余全靠下面这组断言。
_xg = part('59_xgym.js')
_xgcode = _strip_js(_xg)
_xghead = _xgcode.split('function ')[0]          # 顶层区（函数定义之前）
# ① 调用点：必须在 addProp **之前**（它换的是同一张 canvas 的内容，晚一步就画不进去）
assert 'else if (name === "新体育馆") xgRestyle(b, pal.roof);' in _libasmcode, \
    '新体育馆的覆盖重绘调用点不见了 —— 楼还是 30 段的通用外观（灰砖 + 窗阵 + 门 + 台阶）'
assert _libasmcode.index('xgRestyle(b, pal.roof)') < \
    _libasmcode.index('addProp(Object.assign({}, b,'), \
    'xgRestyle 必须排在 addProp **之前** —— addProp 取的是 s.canvas，晚一步重绘就白做' \
    '（55_gym.js / 58_dxdoor.js 都栽过这条）'
assert _libasmcode.count('xgRestyle(b, pal.roof)') == 1, \
    'xgRestyle 的调用点不是 1 个'
# ② 层数：styleOf 与 59 段必须同时是 5。两处一旦分开走，墙高与画布高就对不上，
#    反解出来的 roofT 会是个怪值、立面比例整体崩掉（验收全绿，只有出图看得见）。
assert 'if (/^新体育馆$/.test(name))                    return { p: 3, floors: 5, roofFull: true };' \
    in _libasmcode, 'styleOf 里"新体育馆 = 5 层"这条不见了（用户 2026-09-17 拍板）'
assert _libasmcode.index('if (/^新体育馆$/.test(name))') < \
    _libasmcode.index('if (/体育馆|实验|馆$/.test(name))'), \
    '这条必须排在 `/体育馆|实验|馆$/` **之前** —— 排在后面会被它先接住，' \
    '新体育馆又变回 3 层（墙高 102 对屋顶板 190，像一张煎饼）'
assert 'const XG_FLOORS = 5;' in _xgcode, \
    '59 段的 XG_FLOORS 不是 5 —— 必须与 styleOf("新体育馆").floors 一致'
# ③ 几何一律**反解**，不存第二份常量（用户交代过的铁律，56_minghu.js 踩过）。
assert 'const roofT = c.height - XG_PADT - wallH - XG_PADB;' in _xgcode, \
    'roofT 不是从画布高反解的 —— makeBuilding 的返回值里没有 roofT，' \
    '写死一个数就会在 30 段的 clamp 区间或 CAMPUS 进深一变时静悄悄错位'
assert 'const XG_ROOFT' not in _xgcode, \
    '又存了一份 roofT 常量 —— 派生量不许再存一份（反解写在 xgGeo 里）'
#    ⚠️ 自检的上界**不再**是 30 段的 clamp 上界 190：本栋 2026-09-17 起走
#       `o.roofFull`（屋面板铺满进深，用户要求"向北延长直到灰石板被覆盖"），
#       roofT 反解出来是 ceil(483) − 170 = 313，**故意**越过 190。
#       上界改挂"两倍墙高" —— 仍能抓住"画布高与 PADT/wallH/SHY 对不上、比例崩掉"。
assert 'G.roofT < 20 || G.roofT > G.wallH * 2' in _xgcode, \
    '反解出的 roofT 没有自检 —— 对不上时画出来是一栋比例崩掉的楼，五套验收一个都不报'
assert 'o.roofFull' in _bld and 'roofFull: st.roofFull || name === "第五教学楼",' in _ass, \
    '新体育馆走的是"屋面板铺满进深"，它的 roofT 必然 > 190；' \
    '若 30 段的 roofFull 分支或 styleOf 的标志没了，这里的自检会立刻报出来'
# ④ **撤屋名牌**：调而不画。
assert _xgcode.count('makeSign(XG_NAME)') == 1, \
    'makeSign(XG_NAME) 的调用点不是 1 个 —— 不是被拿掉（verify.py 报 MISS:新体育馆）' \
    '就是被调了两次'
assert 'drawImage' not in _xgcode, \
    '新体育馆精灵上又画上屋名牌了 —— 用户口径："并没有任何字体"，楼名标牌必须撤掉'
assert 'shade(roofCol, -0.04)' in _xgcode and 'signRect(sgn, G.x0' in _xgcode, \
    '撤牌之后必须按 signRect **现算**范围、用 30 段同一个板面色把屋面补回来 —— ' \
    '牌子挂在檐口**之上**，只 clearRect(eaveY 以下) 擦不到它，漏补就是' \
    '屋顶上留一块干净的空洞（五套验收全绿）'
# ⑤ 玻璃带**不水平贯穿**（"并不长"）—— 这是用户口径里最容易画反的一条：
#    画满整宽就变成思源楼那种通长幕墙。比例写进 xgGeo 的 gw，这里把它夹出来验。
_gwm = re.search(r'gw: ([0-9.]+)', _xgcode)
assert _gwm, 'xgGeo 里的玻璃带宽度比例 gw 不见了'
assert 0.5 <= float(_gwm.group(1)) <= 0.95, \
    '蓝玻璃带占了立面宽的 %s —— 用户口径："这个玻璃带并没有水平贯穿建筑，并不长"' \
    % _gwm.group(1)
assert 'const gw = Math.round((G.x1 - G.x0) * G.gw);' in _xgcode, \
    '玻璃带宽度必须是**现算**的（占立面宽 × gw），写死像素值就跟着楼宽一起错'
# ⑥ 玻璃带是**中段一条带**，不是通高幕墙。
_gyh = re.search(r'gy1: gy0 \+ Math\.round\(wallH \* ([0-9.]+)\)', _xgcode)
assert _gyh, '玻璃带高度没按墙高比例现算'
assert 0.25 <= float(_gyh.group(1)) <= 0.45, \
    '蓝玻璃带占墙高 %s —— 用户口径是"中间高度的区域"，变成通高幕墙就不是那张照片了' \
    % _gyh.group(1)
# ⑦ 灰肋必须是**纵向排布**（用户口径）—— 可执行定义：沿 x 步进画竖线。
assert 'for (let x = x0; x < x1; x += 7)' in _xgcode, \
    '灰肋不是竖着铺的 —— 用户口径："灰色长条形的瓷砖，纵向排布的"'
# ⑧ SY_COL 只能在函数内读（58_dxdoor.js 的 PALETTE 顶层读过一次：加载期整页 JS 死）。
assert 'SY_COL' not in _xghead, \
    '59 段的顶层读了 SY_COL —— 必须在函数内读（顶层读撞 const 暂时性死区＝整页 JS 死）'
assert 'const P = XG_PAL, GD = SY_COL.GLASS;' in _xgcode, \
    '蓝玻璃的暗色端没在函数内读 SY_COL.GLASS'
assert 'SY_COL' not in re.search(r'const XG_PAL = \{(.*?)\};', _xgcode, re.S).group(1), \
    'XG_PAL 表里抄了 SY_COL 的色号 —— 只许引用，不许复制第二份'
# ⑨ 不碰共享 RNG（碰了会重掷全校园散射，只有 _propdiff.py 看得见，见 60 段 §6.6）。
assert 'makeRng(5903)' in _xgcode and 'makeRng(5904)' in _xgcode, \
    '补屋面斑点没用局部 makeRng —— 碰共享 rng 会重掷全校园散射（三套验收查不出）'
# ⑩ 蓝玻璃带**分格成小窗**（用户 2026-09-17 第八轮：「对新体育馆的那个窗户带添加一些网格，
#    增加网格划分的小窗户数量，应该划分成四行，多少列你自己决定」）
#    ⇒ 行数落在横梃条数上：四行 = **3 道**横梃，位置由带高 h **四等分现算**
#      （h 是从 wallH 推出来的，写死像素值会跟着墙高一起错）；列沿用实拍里的 20px 等距
#      （第 7 条 ⑦ 已钉住竖肋，这里钉的是玻璃带上那一道 —— 两条都少了就只剩横条纹）。
assert 'for (let k = 1; k <= 3; k++)' in _xgcode, \
    '玻璃带没有横向分格 —— 用户点名要的"网格"就是它：四行 = 3 道横梃'
assert 'const my = y0 + Math.round(h * k / 4);' in _xgcode, \
    '横梃位置不是按带高四等分**现算**的 —— 写死像素值会在 wallH/层数一变时错位'
assert 'for (let x = x0 + 20; x < x1 - 6; x += 20)' in _xgcode, \
    '玻璃带上的竖梃不见了 —— "网格"是竖梃 + 横梃，少一半就只剩横条纹'
assert _xgcode.index('for (let x = x0 + 20; x < x1 - 6; x += 20)') > \
    _xgcode.index('blob(x0 + Math.round(w * 0.50)'), \
    '梃格必须画在树影**之后** —— 反过来那两块半透明倒影正好把网格糊掉一半'

# --- 伟人雕像契约（parts/59b_weiren.js §5.10，2026-09-17）---
# 用户口径（逐字）：「接下来我们复刻伟人的雕像，细节见图片，位置在2439，1880坐标，
#   这个雕像不是很大，下边有个石头灰色底座，然后i四周是石头栏杆。」
# 五套自动验收（accept / verify / zoomtest / _propdiff / _sprhash）**都不看画面** ⇒
# 这组是唯一防线。雕像本体是"像不像"的问题、只能出图看，这里钉的是**结构**。
_wr = part('59b_weiren.js')
_wrcode = _strip_js(_wr)
# ① 位置：用户给的那两个数是本段**唯一**允许写死的数，其余全部现算
#    （铁律「派生量不许再存一份常量」，56_minghu.js 踩过）。
assert 'const WR_CX = 2439, WR_CY = 1880;' in _wrcode, \
    '雕像的中心坐标不是用户给的 (2439, 1880)'
assert 'const WR_PED_X0 = WR_CX - WR_PED_W / 2;' in _wrcode and \
       'const WR_RAIL_X0 = WR_CX - WR_RAIL_W / 2;' in _wrcode and \
       'const WR_RAIL_Y1 = WR_CY + WR_RAIL_D / 2;' in _wrcode, \
    '底座/栏杆的四边不是从 WR_CX/WR_CY 现算的 —— 写死第二份坐标，' \
    '下次挪位置就会漏改一处（56_minghu.js：湖一缩小、贴湖的旧坐标全废）'
# ② 底座是**石头灰**：用户口径里点名的唯一颜色。灰 = R/G/B 三通道互相接近。
_st = re.search(r'WR_ST_FACE = "(#[0-9a-fA-F]{6})"', _wrcode)
assert _st, 'WR_ST_FACE 不见了'
_r3, _g4, _b3 = (int(_st.group(1)[i:i + 2], 16) for i in (1, 3, 5))
assert max(_r3, _g4, _b3) - min(_r3, _g4, _b3) <= 24, \
    '底座色 %s 不是灰色 —— 用户口径："下边有个石头灰色底座"（旧版若取青石/花岗岩偏色即中招）' \
    % _st.group(1)
# ③ 四周一圈栏杆：东西两条 + 南北两条，且**南道必须最后画** ——
#    这就是"北栏杆会被后画的底座盖住"这条正确遮挡的可执行定义（见 59b 文件头二）。
assert _wrcode.count('wrRailEW(g, ') == 3, \
    '东西走向的栏杆不是 2 条（1 处定义 + 2 个调用点）—— 实际 %d 处' % _wrcode.count('wrRailEW(g, ')
assert _wrcode.count('wrRailNS(g, ') == 3, \
    '南北走向的栏杆不是 2 条（1 处定义 + 2 个调用点）'
assert _wrcode.index('wrRailEW(g, WR_RAIL_X0, WR_RAIL_X1, WR_RAIL_Y0)') < \
       _wrcode.index('wrPedestal(g);') < \
       _wrcode.index('wrRailEW(g, WR_RAIL_X0, WR_RAIL_X1, WR_RAIL_Y1)'), \
    '栏杆的绘制次序不是 北道 → 底座+雕像 → 南道 —— 次序即遮挡关系：' \
    '南道（y1901，比底座南沿 y1888 更靠南）画早了会被底座压掉半截'
assert 'function wrPost(g, x, y)' in _wrcode, \
    '望柱不见了 —— 栏杆必须有柱子（"四周是石头栏杆"的最小结构）'
# ④ 装配三件套：落地线 / 碰撞盒 / 净空
assert 'addProp(Object.assign({}, wrStand(), { x: WR_CX, y: WR_RAIL_Y1, tag: "weiren" }));' \
    in _libasmcode, \
    '雕像没进装配段 —— 落地线必须是 WR_RAIL_Y1（最南那道栏杆，见 59b 文件头二）'
assert 'addSolid(WR_CX, WR_RAIL_Y1, WR_RAIL_W, WR_RAIL_D);' in _libasmcode, \
    '雕像栏杆圈没有碰撞盒 —— 用户口径是"四周是石头栏杆"，玩家从任一侧都不该走得进去'
assert _libasmcode.index('addSolid(WR_CX, WR_RAIL_Y1, WR_RAIL_W, WR_RAIL_D);') < \
       _libasmcode.index('scatter();'), \
    '雕像的 addSolid 排在 scatter() 之后 —— 散射点不会避开它，那块草坪上会' \
    '照常长出柏树/樱花，栏杆从树里冒出来（同 §6.5b~6.5g 的既有约束）'
assert 'const wrCleared = clearWrClearance();' in _libasmcode and \
       _libasmcode.index('const wrCleared = clearWrClearance();') > \
       _libasmcode.index('const clashDropped = clearPropTreeClash();'), \
    '雕像净空没排在 clearPropTreeClash() 之后 —— 先跑会改掉它的保留集，' \
    'clashDropped 的计数跟着变（§5.2.8/§5.3.10/§5.5.7 同款约束）'
#     ⚠️ 净空框**必须派生自精灵画布框**（WR_CV_*），不能是"栏杆圈 ± 手量的数" ——
#     第一版就是后者（`WR_RAIL_X0 - 32`），整个组件折半时它不会跟着缩，
#     树会长在举起来的那只手上；而且画布框才是"画出来的东西"那个量。
assert 'const WR_CLR = { x: WR_CV_X0 - 8, y: WR_CV_Y0 - 8,' in _wrcode, \
    '净空框不是从精灵画布框（WR_CV_*）派生的 —— 组件缩了而净空没跟，' \
    '树会长在举起来的那只手上'
assert 'if (p.tag === "weiren" || p.img.width > 110)' in _wrcode, \
    '净空函数没有把自己排除掉 —— 会把刚 addProp 的雕像精灵自己删掉'
# ⑤ 精灵：canvas 原点用 translate 挪到世界坐标（本段所有画法函数直接吃世界坐标）。
#    ⚠️ 这条是**前提性**的：px/poly/shadowQuad/contactBand 必须都只走 fillRect 路径，
#    哪天有工具改成 getImageData，这条就静默失效（画出来是空白/错位，五套验收全绿）。
assert 'g.translate(-WR_CV_X0, -WR_CV_Y0);' in _wrcode, \
    'wrStand 没有把画布原点挪到世界坐标 —— 各画法函数里的世界坐标会全画到界外' \
    '（canvas 越界是**静默**的，出图只剩一张空精灵）'
# ⑤b ⚠️ SHX / SHY 必须**现算**（30_building.js:83 / 36_library.js:472 的写法），
#     全校没有这两个名字的全局常量。第一版这里直接写了 SHX/SHY ⇒ 加载期
#     `ReferenceError: SHX is not defined`，此时 props 已装到 67 件、整页 JS 死，
#     而 `_propview.py` 只报一句 "no prop tag weiren"（看着像道具没加进去）。
assert 'const SHX = Math.round(-SUN.x * 26), SHY = Math.round(-SUN.y * 26);' in _wrcode, \
    'wrStand 没有现算 SHX/SHY —— 它们不是全局常量，直接引用会在**加载期**抛 ' \
    'ReferenceError、整页 JS 死（三套自动验收全绿，只有出图能发现）'
assert 'return { canvas: c, ax: WR_CX - WR_CV_X0, ay: WR_RAIL_Y1 - WR_CV_Y0 };' in _wrcode, \
    '锚点不是画布坐标 —— addProp 认的是画布内坐标，translate 对它无效'
# ⑥ 不碰共享 RNG（本段一个随机数都不用；碰了会重掷全校园散射，只有 _propdiff 看得见）。
assert 'rng' not in _wrcode, \
    '59b 段出现了 rng —— 本段是纯几何，一个随机数都不需要；' \
    '碰共享流会重掷全校园散射（60 段 §6.6 的地雷）'

# --- 伟人雕像·第二轮五条口径（parts/59b_weiren.js，2026-09-17）-----------------
# 用户口径（逐字）：「伟人雕像的问题是，手太长了，手掌太大，这部分不需要突出这个
#   手掌，而且围栏应该大幅度收缩，整个雕像也需要大幅收缩到原来的一半左右，伟人裤子
#   是连起来的两腿之间没有缝隙，现在腿也太细了，下身裤子和上身宽度要求一致」
# ⚠️ 这五条**全都是"像不像"的视觉判断**，而 accept / verify / zoomtest 一个像素都
#    不看 ⇒ 除了出图，只有这里能把它们钉成可执行的形状。每条都钉成"新形状必须在"
#    +（能钉的话）"旧形状必须不在"，防的是日后有人照着旧版又调回去。
# ① 整尊折半：底座 44×34×52 → 22×16×26、雕像 64 → 32。
#    ⚠️ 进深取 16 而非 17（34/2 是奇数 ⇒ WR_PED_BY 落半像素 ⇒ fillRect 出抗锯齿）。
#    栏杆另外**多收一档**（132×84 → 50×38，只 38%）—— 见 59b §5.10.2 那段：用户原话
#    是两句（"围栏应该大幅度收缩" + "整个雕像也需要大幅收缩到原来的一半左右"），
#    "也"字说明是两件事；只按同一比例折半的话"围栏/底座"这个比值 2.75 一点没动。
#    ⚠️ 进深也不能压到 34 以下：南道栏杆的屏幕底边 = WR_RAIL_Y1，必须大于
#       底座台座的屏幕底边 WR_PED_BY，否则最后画的南道会盖掉台座最下一行。
assert 'const WR_PED_W = 22, WR_PED_D = 16, WR_PED_H = 26;' in _wrcode and \
       'const WR_RAIL_W = 50, WR_RAIL_D = 38, WR_RAIL_H = 10;' in _wrcode and \
       'const WR_FIG_H = 32;' in _wrcode, \
    '雕像没折到一半（底座 22×16×26 / 人像 32 / 栏杆 50×38×10）—— 用户口径：' \
    '"整个雕像也需要大幅收缩到原来的一半左右"；进深必须是 16 而不是 17，' \
    '奇数会让 WR_PED_BY = WR_CY + D/2 落在半像素上（硬边项目，fillRect 小数即糊）'
# ② 手：**不画手掌、不画手指**，臂端直接收一个 3×3 的方块（与臂同宽、不外挑）。
#    ⚠️ 否定断言只打旧代码的形状（`const hx =` / 那个四指循环），**不要**写"手掌"
#       这类词 —— 注释里逐字出现过，会拿自己的注释当靶子报假失败（45_water.js 踩过）。
assert 'px(g, cx - 11, T - 4, 3, 3, WR_FIG_FACE);' in _wrcode, \
    '举起来的那只手不是"臂端一个 3×3 方块" —— 用户口径："手掌太大，' \
    '这部分不需要突出这个手掌"'
assert 'const hx = ' not in _wrcode and 'for (let k = 0; k < 4; k++)' not in _wrcode, \
    '又画出独立的手掌块/手指了 —— 第一版那块 8×7 的浅色手掌 + 四根 1px 手指在 1× 下' \
    '就是一团白斑，正是用户说的"手掌太大"'
# ③ 手不许高过头顶太多、更不许被画布裁掉：手最高一笔 = T−6，画布北沿 = T−8（留 2px）。
#    两条算式必须同时在 —— 单独把画布的 −8 改小，举起来的手会被**静默**裁掉一条边。
assert 'T - 4, 3, 3, WR_FIG_FACE' in _wrcode and 'WR_FIG_FOOT - WR_FIG_H - 8;' in _wrcode, \
    '手顶到画布北沿了（手 = T−4、画布北沿 = T−8，留 4px）—— canvas 越界是静默的'
# ④ 裤子：**一整块 8 宽**，中间只一道同色系明暗线（不是 2px 透明缝 —— 那会露背景）。
assert 'px(g, cx - 4, torsoB, 8, paw, WR_FIG_PANT);' in _wrcode and \
       'px(g, cx, torsoB, 1, paw, shade(WR_FIG_PANT, -0.10));' in _wrcode, \
    '裤子不是"一整块 + 一道同色系裤缝" —— 用户口径："裤子是连起来的' \
    '两腿之间没有缝隙"'
assert 'px(g, cx - 5, torsoB, 4,' not in _wrcode, \
    '两腿又拆回两块了 —— 它们之间的缝是**透明**的，背景草地会从裆里透出来'
# ⑤ 下身与上身同宽：躯干与裤都必须是 `cx - 4` 起、8 宽（第一版躯干 16/下摆 14、
#    两条腿各 4 合计 10 还夹 2px 缝 —— 比下摆还窄，正是"腿太细了"）。
assert 'px(g, cx - 4, neckB, 8, torsoB - neckB, WR_FIG_M);' in _wrcode, \
    '躯干不是上下同宽的直筒 8 —— 第一版"肩 16 → 下摆 14"的收分在 8px 尺度下' \
    '只会读成倒三角，而用户要的是"下身裤子和上身宽度要求一致"'

# --- 科学会堂契约（parts/61_kxht.js §5.11，2026-09-17）---
# 用户口径（逐字）：「然后进行科学会堂的复刻，也就是思源东楼北边的科学会堂。
#   字体和照片以及 ppt 制作的正面图都有，注意阶梯，ppt 左右的三角形和门下边的
#   矩形都是阶梯，字体 1 比 1 复刻，阶梯旁边有两个柱子上边两个用来放花的半圆形盆。
#   有可能会因为思源东楼遮挡一些，你适当将科学会堂向上移动一些」
# 五套自动验收（accept / verify / zoomtest / _propdiff / _sprhash）**都不看画面** ⇒
# 这组是唯一防线。"像不像"只能出图看，这里钉的是**结构**与**几何来源**。
_kx = part('61_kxht.js')
_kxcode = _strip_js(_kx)
# ① 几何来自 ppc 第 4 页 —— 外框与檐口带高必须与 `_kxslide.py 4` 的读数逐位一致，
#    且是**一处写死**：任何画笔里再出现 371 / 47 / 117 / 126 这类数字就是第二份派生量。
assert 'const KX_EW = 11.5299, KX_EH = 3.6354;' in _kxcode, \
    '正面图外框不是 11.5299 × 3.6354 英寸 —— 这是 _kxslide.py 4 算掉旋转后的并集，' \
    '照 rot-naive 的 3.9431 写就会把立面压矮 8%（老体育馆/新体育馆都踩过比例崩）'
assert 'const KX_SLAB_H = 1.3576;' in _kxcode, '檐口带高不是矩形5/3/6 的 1.3576 英寸'
assert 'const KX_DY     = 85;' in _kxcode, \
    '北移量 KX_DY 不是 85 —— 用户拍板"整栋完整露出来"落在这个数上'
# ⚠️ 立面高 / 比例尺必须**现算**：`sc = w / KX_EW`、`FH = U(KX_EH)`。
assert 'const sc     = w / KX_EW;' in _kxcode and 'const FH     = U(KX_EH);' in _kxcode, \
    '比例尺或立面高被写成了常量 —— 宽锚（w = 371）一变，立面就会与台阶/柱/盆错位；' \
    '铁律「派生量不许再存一份」'
# ⚠️ 反解 roofT 必须走 30 段的画布高公式（与 59 段同法），并带几何闸。
assert 'const roofT  = c.height - KX_PADT - wallH0 - KX_PADB;' in _kxcode and \
    'console.warn("61_kxht: 反解出的 roofT=' in _kxcode, \
    'roofT 不是从画布高反解的（或少了越界告警）—— 30 段的 PADT/画布高公式一改，' \
    '这里会静默画出一栋比例崩掉的楼，而三套自动验收都不看画面'
# ② 台阶：中央 6 级 + 左右三角各 6 级，**同一支 KX_STEPS**；左右三角一律由
#    「视觉外框 + 逐级错台」画出来（用户点名"ppt 左右的三角形……都是阶梯"）。
assert 'const KX_STEPS  = 6;' in _kxcode and \
    _kxcode.count('(yBot - yTop) * i / KX_STEPS') == 2 and \
    _kxcode.count('(yBot - yTop) * (i + 1) / KX_STEPS') == 2, \
    '台阶级数不是同一支 KX_STEPS 驱动的两处 6 级循环（中央 + 两侧）—— ' \
    '拆成两个数就会一边 6 级一边 5 级（用户口径："左右三角形和门下边的矩形都是阶梯"）'
assert 'const xe = Math.round(xIn + (xOut - xIn) * (i + 1) / KX_STEPS);' in _kxcode, \
    '两侧三角阶梯不是"外缘沿斜边逐级收"—— 逐级水平错台才是阶梯，' \
    '一条从顶到底的斜边是斜坡（45_water 的汀步踩过同款）'
assert 'triL' in _kxcode and 'triR' in _kxcode and 'stairY' in _kxcode, \
    '左右三角 / 台阶顶行没走 KX_EL 表 —— 几何来源又散回画笔里了'
# ③ 花盆柱 + 半圆盆：**柱顶 = 盆底**、盆口 = 圆心行；两柱同底线（右侧 ppt 手绘低 0.1 英寸 ⇒ 归一）。
assert 'const rimY = G.colTop - R;' in _kxcode, \
    '盆不是坐在柱顶上的 —— ppt 的硬关系是"空心弧 bbox 底 = 矩形7 的 y"；' \
    '写成别的偏移，盆会浮在柱子上方或陷进柱子里'
assert 'colTop: y0 + FH - U(KX_EL.colH),' in _kxcode, \
    '柱顶行不是由「落地线 − 柱高」现算（两柱同底线的归一就落在这里）'
assert 'Math.sqrt(RI * RI - dy * dy)' in _kxcode and 'Math.sqrt(R * R - dy * dy)' in _kxcode, \
    '半圆盆不是按半径扫描画出来的（外半圆 / 盆内 / 盆沿三处都要扫）'
# ⚠️ 盆沿必须**最后**画（压在植株根部）—— 次序反了就是"盆上飘着个球"。
assert _kxcode.index('dy > RI * 0.72 ? KX_PAL.LEAF_L') < \
       _kxcode.index('px(g, cx - R, rimY, R * 2 + 1, 1, C.POT_L);'), \
    '盆沿画在了植株之前 —— 实拍是"花长在盆里"，盆沿必须在植株根部之上'
# ③b **平屋顶**（用户口径「改平屋顶」）：屋面整片改石色、且**不许**再出现 pal.roof ——
#     褐色坡瓦顶是本段第一版的原样（30 段的屋面），出图里就是"顶着坡顶的会堂"。
assert 'function kxRoof(g, G, C)' in _kxcode and \
    'px(g, x, KX_PADT, wd, G.roofT, C.ROOF_D);' in _kxcode and \
    'px(g, G.x0, KX_PADT + 2, G.w, G.roofT - 5, C.ROOF);' in _kxcode, \
    '平屋顶不是照 30 段的矩形（x0−3 / w+6 / PADT / roofT、板面 PADT+2 高 roofT−5）重画的 —— ' \
    '几何另立一套，女儿墙外沿那 3px 出挑就会与其它楼对不上'
assert 'pal.roof' not in _kxcode, \
    '⭐ 61 段里还有 pal.roof —— 用户拍板"改平屋顶"，屋面必须整片走石色系；' \
    '留着褐色就是第一轮出图里那顶坡屋顶'
assert _kxcode.index('kxRoof(g, G, C);') < _kxcode.index('kxSlab(g, G, C);'), \
    '平屋顶画在了檐口板之后 —— 屋面矩形与檐口板在 eaveY 那一行相邻，' \
    '次序反了会把檐口板顶那 2 行压掉'
# ④ 金字：1:1 复刻的点阵，字高 / 总宽**现算**，且有字体闸。
assert 'const KX_GLYPH_R = 0.64;' in _kxcode and \
    'Math.abs(gh - G.slabH * KX_GLYPH_R) > 1' in _kxcode, \
    '金字字高与檐口板高的比例不是 0.64（probe 定稿）或没有字体闸 —— ' \
    '换源图/改板高时要先在控制台响，而不是等出图才发现字太大太小'
assert 'let x = G.x0 + Math.round((G.w - tw) / 2);' in _kxcode and \
    'for (const e of KX_CHARS) tw += e[1];' in _kxcode, \
    '金字不是按 KX_CHARS 的逐字宽现算居中（照 36 段 libPlaque）—— 写死坐标换一次源就废'
assert 'const s = atob(b64)' in _kxcode and 'KX_PAL.GOLD_L' in _kxcode and \
    'KX_PAL.GOLD_D' in _kxcode, \
    '金字不是"1bit 掩膜 + 三色浮雕笔"—— 与 _kxfont.py 的 brush() 同构是 probe 判据有效的前提'
# ⑤ ⭐ **只盖不擦**：全零件只许有 1 次 clearRect（撤屋名标牌），立面段一次都不许有。
assert _kxcode.count('clearRect') == 1, \
    '⭐ 61 段的 clearRect 不是恰好 1 次（撤标牌）—— 实际 %d 次。' % _kxcode.count('clearRect') + \
    '立面是**在新画布上重画**的（只拷旧画布檐口以上 y0+1 行），多一次 clearRect ' \
    '就会切掉落在这一条里的随机元素、留下透明豁口（铁律"只许盖不许擦"）'
assert 'ng.drawImage(c, 0, 0, c.width, G.y0 + 1, 0, 0, c.width, G.y0 + 1);' in _kxcode, \
    '新画布不是"只拷旧画布檐口以上 y0+1 行"—— 整张拷过来会把旧立面 / 旧投影 / ' \
    '旧接地带一起带进新画布（那正是旧 baseY 上的残留）'
# ⑥ 北移**只落在锚点上**：ay 是 baseY + KX_DY，而世界坐标与碰撞盒一个字节都不动。
assert 'b.ay = G.baseY + KX_DY;' in _kxcode, \
    '北移不是"只挪精灵锚点"—— 用户拍板的落地方式是只动 b.ay（PPT 轮廓 / 灰硬地 / ' \
    '碰撞盒全不动 ⇒ 全校园散射随机流一个数都不动）'
assert 'addSolid' not in _kxcode, \
    '⭐ 61 段动了 addSolid —— 改碰撞盒 = 重掷全校园散射（60 段 §6.6 的地雷，' \
    '只有 _propdiff 看得见，五套验收全绿）'
# ⑦ 不碰共享 RNG：斑点/颗粒一律局部 makeRng（照 55/58/59 段）。
assert 'rng' not in _kxcode and _kxcode.count('makeRng(') >= 10, \
    '61 段碰了共享随机流或没带够局部 makeRng —— 碰共享流会重掷全校园散射'
# ⑧ 色全部由调用点给的 pal 现推，本段不许再存一份 PALETTE。
assert 'PALETTE' not in _kxcode and 'shade(pal.wall' in _kxcode and 'kxCol(pal)' in _kxcode, \
    '色板不是由实参 `pal` 现推 —— PALETTE 只能在函数体里读（TDZ：本段在 60 段之前拼接），' \
    '顶层读它就是整页 JS 死'
# ⑨ 调用点唯一（60 段），且必须排在 addProp 之前。
_ca = part('60_assemble.js')
assert 'else if (name === "科学会堂") kxRestyle(b, pal);' in _ca, \
    '60 段少了 kxRestyle 的调用点 —— 定义了不等于画了（第五轮 dxSign 就是这么死的）'
assert _ca.index('kxRestyle(b, pal)') < _ca.index('addProp(Object.assign({}, b, { x: ax, y: ay,'), \
    'kxRestyle 排在 addProp **之后** —— addProp 取的是 s.canvas / s.ay，' \
    '晚一步挂进 props 的还是旧精灵（gymRestyle/dxRestyle/xgRestyle 同一规矩）'
# ⑩ 红线 3 正向断言：PPT 轮廓（CAMPUS 那一行）逐字不动。
assert '["科学会堂",   "bld",     5.8833, 2.6035, 0.9486, 0.4854],' in part('20_ground.js'), \
    '⭐ 红线 3：科学会堂的 PPT 轮廓行被改了 —— 本轮是"只挪精灵"，地图数据一个字都不许动'
# ⑪ 生成块：KX_CHARS 4 条 + 标记成对（_kxfont.py 拼接用）。
assert 'const KX_CHARS = [' in _kx and _kx.count('const KX_MASK_') == 4, \
    'KX_CHARS / KX_MASK_* 不是 4 条 —— 未跑 _build/_kxfont.py，或源图切不出四个字'
assert '/*__KX_GEN_BEGIN__*/' in _kx and '/*__KX_GEN_END__*/' in _kx, \
    '生成块标记不在了 —— _kxfont.py 找不到拼接位就会直接报错退出'

# --- §6.6c 建筑物误删的修复（60_assemble.js，2026-09-17）---
# 这不是"顺手做的重构"，是用户要求给围栏加碰撞盒（⇒ solids 变 ⇒ 散射重掷 ⇒ 树位变）
# **暴露出来的既存缺陷**：`clearPropTreeClash` 的保留判据原先只认 `p.tag`，
# 而建筑物没有 tag ⇒ 只要有棵树排在楼前、树冠像素正好压在楼的接地线上，
# **整栋楼就被当成"压着树的小道具"删掉**。本轮实测：第七教学楼（310×293）当场消失，
# 而 accept / verify / zoomtest / zoom 28 项**一个数都没变** —— 唯一探针是 `_propdiff`。
assert 'if (p.tag || p.img.width > 110) { keep.push(p); continue; }' in _libasmcode, \
    'clearPropTreeClash 的保留判据退回成只认 p.tag 了 —— 建筑物没 tag，' \
    '会被 footOnTree 当小道具删掉（阈值/口径见 §5.10.9 clearWrClearance，两者同款）'
# ① 落地线必须是 LIB_FY。楼体南墙整体后退 110px 让门前前庭是本方案的**几何前提**
#    （只退中央开间在深度排序上无解，见 36 段文件头硬约束②）。
assert 'y: LIB_FY, tag: "lib"' in _libasmcode, \
    '图书馆落地线不是 LIB_FY —— 楼体没后退，前庭就落到 baseY 之北，站在台阶上的玩家会被台阶盖住'
assert 'LIB.y + LIB.h' not in _libasmcode, \
    '装配段的**代码**里又出现了 LIB.y + LIB.h —— 那是旧落地线（= 主路北缘）；' \
    '写第二遍这个减法必然和 LIB_FY 漂开'
# ② 三锥顶：用户拍板"中央大锥 + 两侧小锥，共 3"，且示意图里**三个三角形的底边
#    全在同一条基线上**（pt2 里三块 triangle 的 bottom 都是 y=148.2）。
#    ⇒ 判据分三层：调用点唯一（底边线只能来自那一个常量）/ 实到 3 个 / 首尾相接盖满顶边。
_cn = _libcode.count('libCone(g, ')
assert _cn == 2, \
    'libCone 的调用点数不是 2（1 处定义 + 1 个调用点 = 唯一底边线）—— 实际 %d 处；' \
    '多于 2 处说明有锥顶自己带了 y，那就不是"共用一条基线"了' % _cn
assert 'libCone(g, T[0] + T[1] / 2, LIB_CBASE, T[1] / 2, T[2], P.ROOF)' in _libcode, \
    '三个锥顶没走 LIB_CBASE 这**一条**底边线 —— 底边线是用户口径里唯一被点名说"同一条"的量'
_m = re.search(r'const LIB_CONES = \[(.*?)\];', _libcode, re.S)
assert _m, 'LIB_CONES 不见了 —— 三个锥顶的 [左边界, 宽, 高] 表'
_rows = re.findall(r'\[\s*([\d.]+),\s*([\d.]+),\s*([\d.]+)\s*\]', _m.group(1))
assert len(_rows) == 3, 'LIB_CONES 不是 3 个锥顶 —— 实际 %d 个' % len(_rows)
_cw = [float(r[1]) for r in _rows]
_libub = 304 - 97                              # 中央体量宽 = LIB_UB − LIB_UA = 207
assert abs(sum(_cw) - _libub) < 0.51, \
    '三个锥顶的宽加和 %.1f != 中央体量宽 %d —— 顶边上会露出没盖住的女儿墙' % (sum(_cw), _libub)
assert abs(float(_rows[0][0]) - 97) < 0.51 and abs(float(_rows[2][0]) + _cw[2] - 304) < 0.51, \
    '三个锥顶没有首尾相接盖满中央体量顶边（97..304）'
# ⑩ 用户口径："四个周围的柱形都是浅红色屋顶"。
assert 'function libRoofBand(g, x0, x1, y0)' in _libcode, '浅红屋顶带的画法不见了'
_band = re.findall(r'libRoofBand\(g, V\[0\], V\[1\], (LIB_\w+)\)', _libcode)
assert _band == ['LIB_SROOF', 'LIB_WROOF'], \
    '四个矮体量的浅红屋顶带必须分两组各 2 条（外柱锚 LIB_SROOF、两翼锚 LIB_WROOF）—— 实际 %r' % (_band,)
# ⑪ 用户口径："图书馆外墙是那种细小的白色长方形瓷砖铺的"。
assert 'function libTiles(g, x0, x1, y0, y1)' in _libcode and \
    _libcode.count('libTiles(g, ') == 4, \
    '白瓷砖墙皮不见了或调用点数不对（1 处定义 + 3 层墙：中央体量 / 外左 / 外右）'
# ⑫ 用户口径："蓝色矩形分别表示横着的窗户带和竖着的玻璃带"。
assert 'function libGlassRibbon(g, x0, x1, y0, y1)' in _libcode, '竖向玻璃带不见了'
assert 'for (const y of LIB_VWY) libWinBand(g, x0, x0 + LIB_VWW, y, LIB_VWH);' in _libcode, \
    '两翼上的竖向窄窗不见了（或行距表 LIB_VWY 没被用）'
assert _libcode.count('libWinBand(g, ') >= 4, '横向蓝窗带不见了'
# ⑬ 用户口径："整体高度降下来，因为图书馆应该是低矮的，目前有些瘦高了，高度不要超过宽度"。
#    上一版画到 326 高（VS = 0.616，楼层间距正好 = FLOOR_H = 34）被判"瘦高"退回
#    ⇒ **"层高对齐全校"这条让位给"低矮"**。349 = PPT 权威矩形换算出的楼宽 LIB_W。
_lt = re.search(r'const LIB_TOP\s*=\s*(\d+);', _libcode)
_lb = re.search(r'const LIB_BASE\s*=\s*(\d+);', _libcode)
assert _lt and _lb, 'LIB_TOP / LIB_BASE 不见了 —— 楼高就是这两个数之差'
_libh = int(_lb.group(1)) - int(_lt.group(1))
assert _libh <= 349, \
    '图书馆楼高 %d > 楼宽 349 —— 用户口径："图书馆应该是低矮的，高度不要超过宽度"' % _libh
# ⑭ 用户口径："放图书馆字体的地方是白色背景不是蓝色背景"。
#    ⚠️ 旧门头横带那个函数名**不写进注释**——_libcode 只剥注释，写在这儿不影响断言，
#       但按本文件的老规矩（45_water.js 的假失败），凡进否定断言的字面量一律现拼，
#       免得日后有人把注释也纳进判据时拿自己的注释当靶子。
_banned = 'lib' + 'SignBand'
assert _banned not in _libcode, \
    '门头「圖書館」又画回蓝色横带上了 —— 用户口径："是白色背景不是蓝色背景"'
assert _libcode.count('libPlaque(g, ') == 2, \
    '门头刻字的调用点数不是 1（1 处定义 + 1 个调用点）—— 多出来的那个调用点意味着' \
    '某处又给这三个字铺了块底（用户要的是白瓷砖墙面本身当底）'
assert 'libPlaque(g, LIB_SX, LIB_GB + ' in _libcode, \
    '门头刻字没直接落在白瓷砖墙面上 —— 字位仍按"居中于 LIB_GB..LIB_SG_B 这条带"现算'
# ⑮ 用户口径："这个阶梯记得是彩绘的，多放几个颜色"。
#    上一轮我以"新立面只有白/蓝/浅红"为由把它改成三档蓝，被这一句推翻。
_pt  = re.search(r'const LIB_PAINT\s*=\s*\[(.*?)\];', _libcode, re.S)
_pta = re.search(r'const LIB_PAINT_A\s*=\s*\[(.*?)\];', _libcode, re.S)
assert _pt and _pta, '彩绘台阶的两个色表不见了'
_pn = len(re.findall(r'#[0-9a-fA-F]{6}', _pt.group(1))) + \
      len(re.findall(r'#[0-9a-fA-F]{6}', _pta.group(1)))
assert _pn >= 10, \
    '彩绘台阶只有 %d 种颜色 —— 用户口径："这个阶梯记得是彩绘的，多放几个颜色"' % _pn
assert 'LIB_PAINT[((i / 2) | 0) % LIB_PAINT.length]' in _libcode, \
    '台阶踢面没在换色 —— 而且是"每 2 级一色"（逐级换色在放大图里是彩虹条形码）'
# ⚠️ **级间投影必须画在 y+3**：下一步的踏面在 y+4，写 y+4 会被整行盖掉，
#    放大图里台阶会是一整片没有分级的色块 —— 三套自动验收一个都判不出来。
assert 'px(g, x, y + 3, w, 1, "rgba(14,18,28,0.26)");' in _libcode, \
    '台阶的级间投影挪到 y+4 了 —— 那里是下一步的踏面，整行会被盖掉（旧版就是这么死的）'
# 踢面 2 行是彩绘可读性的**结构性前提**（1 行时放大图里是彩虹条形码）。
assert 'px(g, x, y + 1, w, 2, LIB_PAINT[' in _libcode, \
    '台阶踢面不是 2 行 —— 1 行的踢面上彩绘读成"条形码"，等于白加颜色'
# ③ ⚠️ **方向判据**：台阶必须画在落地线**之下**（= 楼前 = 南侧）。
#    这是"台阶并进建筑精灵、往下长"那条规则的**可执行定义**（同 55_gym.js:28-30）。
assert 'y = LIB_BASE + i * 4;' in _lib, \
    '彩绘台阶没画在 LIB_BASE 之**下** —— 写成 LIB_BASE − … 台阶就长到楼里去了'
# ④ ⚠️ **锥顶不许上下颠倒**。`libCone` 的半宽必须随 i **增大**（i=0 是锥尖）。
#    第一版写成 `hw*(h-i)/h`，画出来是一排漏斗；三套验收全绿，只有 _propview.py 的放大图看得见。
assert 'const w = hw * (i + 1) / h;' in _lib, \
    'libCone 的半宽不是随 i 递增（写成 hw*(h-i)/h 就是上宽下窄的漏斗，自动验收查不出）'
# ⑤ ⚠️ 配色表**不许含 SY_COL**：它定义在 frozen demo 段里，顶层读撞 const 暂时性死区
#    ⇒ 加载期整个 <script> 死、页面全白，而三套自动验收一个都查不出（58 段 PALETTE 栽过）。
_libpal = _libcode.split('const LIB_PAL = {')[1].split('};')[0]
assert 'SY_COL' not in _libpal, \
    'LIB_PAL 顶层读了 SY_COL —— 必须挪进函数内（58_dxdoor.js 的 PALETTE 已栽过：整页 JS 死）'
assert 'const GD = SY_COL.GLASS;' in _lib, '蓝玻璃的暗色端没在函数内读 SY_COL.GLASS'
# ⑥（第七轮改口径）屋名标牌**已撤**，但调用必须留着。
#   verify.py 的屋名标牌自检读 _signCache：makeSign(LIB_NAME) 不调用就报 MISS:图书馆。
#   用户 2026-09-17 口径（逐字）：「图书馆几个简体字可以去掉了，留着那几个复刻的烫金字就行」
#   ⇒ 判据从"调用存在"升级成"**调而不画**"：调用点数必须是 1、且文件里一个 drawImage
#     都没有（36 段本来就不用 drawImage 画别的东西，这条是干净的）。若哪天有人手贱把
#     `g.drawImage(sgn.c, …)` 加回来，简体牌就会和 ⑧ 的烫金字同时出现 —— 四套自动验收
#     全绿、只有出图看得见。
assert _libcode.count('makeSign(LIB_NAME)') == 1, \
    'makeSign(LIB_NAME) 的调用点不是 1 个 —— 它不是被拿掉（verify.py 会报 MISS:图书馆）' \
    '就是被调了两次'
assert 'drawImage' not in _libcode, \
    '图书馆精灵上又画了点阵图 —— 屋名牌已撤（用户："图书馆几个简体字可以去掉了"），' \
    '楼名只留 ⑧ 那三个復刻烫金字，这里不许再 drawImage'
assert 'signRect(' not in _libcode, \
    '标牌又走回 signRect 了 —— 它的口径是"牌子站在平屋面上"，中央塔是四棱锥顶没有平屋面，' \
    '照它摆出来的牌子下半截压锥腰、两角露天空（实测放大图里就是一块悬空横幅）'
# ⑦ 点阵生成块（_libfont.py 的 splice 目标）。
assert '/*__LIB_GEN_BEGIN__*/' in _lib and 'const LIB_CHARS = [' in _lib, \
    '门头「圖書館」生成块不见了 —— 跑一次 python _build/_libfont.py 重新拼'
# ⑧ 前庭净空。楼体一后退，原先被楼挡住的树就翻到前面、正好站在彩绘台阶上。
assert 'function clearLibFore()' in _lib and 'const foreDropped = clearLibFore();' in _libasm, \
    'clearLibFore 没了调用点 —— 前庭会长出站在台阶上的树（三套验收都查不出）'
assert _libasm.index('const clashDropped = clearPropTreeClash();') < \
    _libasm.index('const foreDropped = clearLibFore();'), \
    'clearLibFore 必须排在 plantRows() 与 clearPropTreeClash() **之后** —— 散射与规则树阵都往前庭种树'
# ⑨ ⚠️ 反向闸：旧三角广场那套必须绝迹。判据只吃代码不吃注释 —— 本段文件头把三处已废弃的
#    口述逐条记了下来（含 LIB_TRI 这个名字），把注释也算进来就是拿自己的注释当靶子。
for _bad in ('LIB_TRI', 'LIB_CUTX', 'LIB_CUTY', 'inTri'):
    assert _bad not in _libcode, \
        '36 段的**代码**里又出现了 %s —— 三角广场方案已废弃（PPT 里没有三角形，照片里也没有）' % _bad

# --- 鸭子活动域契约（parts/45_water.js §4.5.3d）---
# 用户第七轮：「鸭子可以上岸走动或者下水，只能在湖里和下方的小广场活动」。
_wa = part('45_water.js')
assert 'const DUCK_AREA = { x: WATER[0].x, y: WATER[0].y, w: WATER[0].w,' in _wa, \
    '鸭子活动域必须与湖**同源**地写（x/宽读 WATER[0]）—— 抄数字的话湖一改就漂'
assert 'h: 89 * CELL - WATER[0].y };' in _wa, \
    '活动域南界必须是 89*CELL（砖面画出来的南缘 1424，不是 ARTERY 声明的 1431.62）'
assert 'const WATER_S = WATER[0].y + WATER[0].h;' in _wa, \
    '上岸判据线必须由湖的南界算（WATER[0].y + WATER[0].h），不许另存一份常量'
# ⚠️ 轨道必须照**活动域**算，不能照湖面：照湖面的话三只鸭子永远只在湖北半部绕圈，
#    南边那 96px 砖面一辈子等不来一只 —— 而"上岸走动"正是用户这轮的原话。
assert 'cx: A.x + A.w * (0.30 + 0.20 * i), cy: A.y + A.h * (0.28 + 0.22 * i),' in _wa, \
    '鸭子轨道圆心没有照活动域算（照湖面 = 永远上不了岸）'
assert 'ry: A.h * 0.22' in _wa, '鸭子轨道半轴没有照活动域算（太小则越不过岸线）'
# ⚠️ d.img 必须**每帧无条件**赋值：鸭子有两套图（水面版 / 陆地版），沿用原来的
#    "只在死区外赋值"，跨岸那一刻的直行帧不会换装，它会拖着水痕上岸。
assert 'd.img = d.dir < 0 ? (land ? d.landL : d.imgL) : (land ? d.landR : d.imgR);' in _wa, \
    '鸭子换装必须每帧无条件做（见 45_water.js animateWater 头注）'
# ⚠️ 上岸的鸭子必须**用腿走路**。只把水痕换成接地影是不够的 —— 没腿的鸭子站在砖面上
#    依然是"漂"着的。用户 2026-09-13：「鸭子上岸是用腿走路，不是游动」。
assert 'px(g, 4, 11, 2, 3, "#c8862e");' in _wa and 'px(g, 8, 13, 4, 1, "#d0902f");' in _wa, \
    '走路版鸭子没有腿 —— 只换掉水痕的话，上岸的鸭子还是漂在砖面上'
# 两条腿必须**一长一短**（后腿 3 行撑地、前腿 2 行抬起）。等长 = "立正站着"，
# 有腿也读不出"走路"。
assert 'px(g, 9, 11, 2, 2, "#e0a03a");' in _wa and 'px(g, 3, 14, 4, 1, "#b87c28");' in _wa, \
    '鸭子两条腿等长了（退回"立正"姿势）—— 走路要一腿撑地、一腿抬起'
# 两版必须共用 16×16 画布与同一个锚点 ay=14：spawnDucks 只存一份 w/h/ax/ay，
# 尺寸不一致另一版就会画歪（旧版是 16×13 / ay 11）。
assert 'return { canvas: c, ax: 8, ay: 14, w: 16, h: 16 };' in _wa, \
    '两版鸭子必须同画布同锚点（16×16 / ax 8 / ay 14），否则大小只对得上一版'
assert 'const dy = land ? 0 : 3;' in _wa, \
    '两版鸭子必须只差一个纵向偏移 dy（水面版下沉 3 行 = 泡在水里），身体整套共用'
# ⚠️ 湖心不许再盖**正圆**压暗。原版是 `circlePx(g, cx, cy, min(w,h)*0.30, "rgba(16,48,76,0.16)")`
#    —— 湖缩小之后半径 ≈82 占到湖宽的一大半，而湖是长方形 ⇒ 画面上就是一个"贴上去的
#    暗色圆盘"。用户 2026-09-13：「把湖中间那个暗色的圆形图标去掉，有碍观瞻」。
#    层次由上面那 4 圈"由岸向心浅化"负责，不需要再来一个方向相反的圆。
assert 'rgba(16,48,76,0.16)' not in _wa, \
    '湖心又盖上正圆压暗了 —— 那在长方形湖面上就是个暗色圆盘（用户已明确要去掉）'
_45 = part('45_water.js')
assert 'const WATER_AVOID = [];' in _45, 'WATER_AVOID 声明丢了'
assert 'return avoidPush(x, y);' in _45, 'panicStep 出口没有过 avoidPush（鸭子还是会穿石）'
# ④ 必须画成**道具**（不能烘进 groundCanvas）：滚动条序是 地面 → drawWater（每帧）
#    → 道具。烘进地面的话，每帧的波纹会画到岛 / 塔**上面**去。
assert _ass.count('buildMinghu();') == 1, '明湖三景没被调用或重复调用'
_idx_mh = _ass.index('buildMinghu();')
assert _idx_mh < _ass.index('\nscatter();'), \
    '明湖三景必须排在 scatter() 之前 —— 石碑的 addSolid 要先进 solids，' \
    '绿化/路灯才不会种到碑里去'
assert _ass.index('buildSouthStone();') < _idx_mh, \
    '明湖三景应排在 §6.5d 南门校名石之后（§6.5e，与既有段序一致）'
# ⑤ 刻字框：明 20x20 / 湖 22x20 —— 高 20 是 _mhfont.py 的 THS，宽由**提炼件的长宽比**
#    出格（明 650/658、湖 706/648，不强行拉方）⇒ 湖 比 明 宽 2px。
#    石面 40px 宽，两字 20+22 只能**斜排**才放得下 —— 再宽就顶到石头边缘了。
assert '[MH_MASK_MING, 20, 20]' in _mh and '[MH_MASK_HU, 22, 20]' in _mh, \
    '「明湖」点阵尺寸被改了（应为 20x20 / 22x20，源是 _photo/minghufont.png，见 _mhfont.py）'
#    两字的**调用点坐标**与字框是一组，必须一起动。2026-09-13 换字体时就栽在这：
#    旧 FZYTK 的「明」只有 13px 宽，换成毛笔字后宽到 20px，原坐标 (12,14)/(6,30) 下
#    两字竖直叠掉 4 行、「明」的月和「湖」的月上下压成一片黑。钉住"不重叠"这个不变量。
_mgc = re.findall(r"mhGlyph\(g, MH_CHARS\[(\d)\]\[0\], MH_CHARS\[\d\]\[1\], "
                  r"MH_CHARS\[\d\]\[2\], (-?\d+), (-?\d+)\);", _mh)
assert len(_mgc) == 2, '石碑只有两处 mhGlyph 调用，找到 %d 处' % len(_mgc)
(_mx0, _my0), (_mx1, _my1) = [(int(a), int(b)) for _, a, b in _mgc]
assert _my0 + 20 <= _my1 - 1, \
    '「明」底 y%d 和「湖」顶 y%d 之间没有空行 —— 毛笔字的月部会连成一片黑' % (_my0 + 19, _my1)
assert _mx1 + 22 <= 34 and _mx0 + 20 <= 34 and _my1 + 20 <= 68, \
    '「明湖」摆到石头外面去了（石面 x2..39 / y2..74，台座在 y70）: 明(%d,%d) 湖(%d,%d)' \
    % (_mx0, _my0, _mx1, _my1)

# --- 南门门洞无铺装契约（parts/20_ground.js §2.7.4）---
# 用户 2026-09-13：先「南门的人行横道可以去掉了」，再「把南门的灰色长方形路段去掉」。
# ⚠️ G2 现在**整块跳过**（车行道垫层 + 斑马线都不画），所以 zebra 那个变量已经删掉；
#    本函数不消耗 rng() —— 它若开始 rng()，后面 paintWear / paintDirt / paintWalls
#    三段共用的随机流会整体挪位，整片地面换脸（而验收数字查不出来）。
_g20 = part('20_ground.js')
assert 'if (gt.id === "G2") continue;' in _g20, '南门车行道垫层的跳过开关没了'
assert 'zebra' not in _g20.split('function paintGateAprons')[1].split('function paintKerbs')[0], \
    'G2 整块跳过之后 zebra 已无意义 —— 别留死代码误导后来人'
assert 'function paintGateAprons(g, rng)' in _g20 and 'rng()' not in \
    _g20.split('function paintGateAprons')[1].split('function paintKerbs')[0], \
    'paintGateAprons 里出现了 rng() —— 它必须保持零随机消耗，否则整片地面重排'

# --- 明湖缩小 + 南岸石板路契约（parts/20_ground.js §2.1 / §2.5）---
# 用户 2026-09-13：「把明湖进行缩小，将底部占整个明湖1/4的地方变成灰色石板路即可」。
# ⚠️ CAMPUS「水域」的高度与 ARTERY「明湖南岸石板路」是**一对**：2.6035 + 0.7965
#    = 3.4000（新湖底），3.4000 + 0.2653 = 3.6653（原湖底 = 东西主路北缘）。
#    改一个不改另一个，湖面上就会多出一条缝或者少一条岸。
# ⚠️ 石板的 ARTERY 必须排在东西主路**之前**：3.6653 那行两段共占一格，
#    后盖的沥青要赢，否则东西主路最北一排变砖石、白色外缘线压到砖上。
assert '["水域",       "water",   7.0104, 2.6035, 0.6972, 0.7965]' in _g20, \
    '明湖水位/高度被改动了（应为 y 2.6035 / h 0.7965）'
assert '{ name: "明湖南岸石板路", x: IX(7.0104), y: IX(3.4000), w: IX(0.6972), h: IX(0.2653), cls: 1 }' in _g20, \
    '明湖南岸石板路没了或参数被改动'
assert _g20.index('明湖南岸石板路') < _g20.index('{ name: "东西主路"'), \
    '明湖南岸石板路必须排在东西主路之前（共占那格的归属）'

# --- 白杨大道契约（parts/47_plants.js §4.7.3b / §4.7.4）---
# 用户 2026-09-13：「南门到思源楼那个雕塑的路两边的树是比较高的白杨树…
#                  清理现在这条路旁边的树重新种上白杨」（随后澄清：南门到校徽雕塑）。
# ⚠️ 做法是**换分发、不换种子**：`anyTree` 里 `onSouthAve` 排在最前，物种仍然只由
#    seed 的数值决定、**不消耗随机数** ⇒ 全校园 rngS 的序列一字不动，树的数量与
#    位置也一个不变，只有那 8 棵的**长相**变了。谁要是把 `onSouthAve` 挪到
#    `makeRng` 之后、或让它 rng() 一下，整幅地图的树都会重排 —— 那才是回归。
_pl = part('47_plants.js')
for _need in ('function makePoplar(', 'function onSouthAve(', 'const SOUTH_AVE = '):
    assert _need in _pl, '白杨契约缺失: ' + _need
assert 'onSouthAve(x, y) ? makePoplar(seed)' in _pl, \
    '白杨大道的分发必须排在 anyTree 的最前面（水边柳、阔叶/针叶/开花都在它之后）'
assert _pl.index('onSouthAve(x, y) ? makePoplar(seed)') < _pl.index('waterNear(x, y) ? makeWillow(seed)'), \
    '水边一律柳，白杨不许抢在柳前面'
# ⚠️ 走廊北界 y=1916 不是审美：草坪树圈的南缘那一排在 y1859，`LAWN_ZONE` 下沿
#    1915.1 —— 取 1916 就正好把它们挡在外面（取 1875 会把思源楼草坪南边的树也换掉）。
assert 'y0: 1916' in _pl and 'y1: 2500' in _pl, \
    '白杨走廊的南北界被改了（y0=1916 是为了不碰草坪树圈那一排 y1859）'
assert 'makePoplar(seed)' in _pl and _pl.count('makePoplar(') >= 2, 'makePoplar 没有被 anyTree 调用'

# --- 白杨大道·两排对齐契约（parts/47_plants.js §4.7.3c + 60_assemble.js §6.6b-2）---
# 用户 2026-09-13 追加：「白杨排布一定要整体，树根的 x 轴坐标要一致」。
# 从"换分发"改成"**清场 + 补种**"：删掉走廊里已经撒下的乱点树，再按固定 x 补两排。
# ⚠️ 这一节三套自动化验收**一个数都查不出**（只是树的 x 变了），只能靠断言 + 看画面。
for _need in ('function plantPoplarAve(', 'const AVE_X_W = 1920, AVE_X_E = 2144;',
              'const AVE_Y0 = 1994, AVE_Y1 = 2310, AVE_SP = 80;',
              'const AVE_CLR = ', 'const keepOut = [DIA_CLR, FLAG_CLR];'):
    assert _need in _pl, '白杨两排契约缺失: ' + _need
# ⚠️ 两个 x 是**量出来的**：路面栅格化后 x1952..2111，两侧各外扩 32 得 1920 / 2144，
#    关于路轴 2032 对称。改成从 `ARTERY`（x1955.6..2102.3，中轴 2028.95）反算会歪 3px。
assert 'AVE_ROW_DX = 32' in _pl, '树根离沥青边线的距离被改了（32 = 路面边线外的两个草格）'
# ⚠️ 北界 1994 是硬的：白杨 ay=127，树根 1990 时冠顶正好压在雕塑净空框 DIA_CLR 下沿
#    1863 上 —— `clearDiaClearance()` 按**美术盒**判，会把整棵无声无息地删掉。
#    1994 ⇒ 冠顶 1867，留 4px 余量。
assert 'AVE_Y0 = 1994' in _pl, \
    '白杨大道北界必须 > 1990（否则冠顶探进 DIA_CLR，会被 clearDiaClearance 整棵删掉）'
# ⚠️ 清场只删 tag "tree"：灯 / 桶 / 椅没有 tag，校名石 / 石狮 / 雕塑 / 围石 / 旗帜各有 tag。
assert 'p.tag === "tree" &&' in _pl, '白杨清场必须只删 tag "tree"，别把别的东西一起清了'
_idx_ave = _ass.index('const aveTrees = plantPoplarAve();')
assert _idx_ave > _ass.index('const rowTrees = plantRows();'), \
    '白杨两排必须排在 plantRows() 之后 —— 它要删的正是 plantRows 种下的乱点行道树'
assert _idx_ave < _ass.index('const clashDropped = clearPropTreeClash();'), \
    '白杨两排必须排在 clearPropTreeClash() 之前 —— 补种的树要一视同仁地参与冲突清理'

# --- 草坪边界树圈契约（parts/47_plants.js §4.7.6b / §4.7.6c）---
# 用户的验收标准是"草坪边界都是树、中间只有草地"—— 这两条只有**看画面**才查得出，
# 三套自动化（碰撞 / 计时 / 缩放）一个数都不会变，所以把判据钉在源码上。
_pl = part('47_plants.js')
for _need in ('function treeFreeOfProps(', 'function lawnSpotOK(',
              'function lawnTree(', 'function plantLawnRing()',
              'function clearLawnZone()', 'const LAWN = ', 'const LAWN_INSET = ',
              'const LAWN_BAND = 40;', 'const LAWN_ZONE = '):
    assert _need in _pl, '草坪树圈契约缺失: ' + _need
# ⚠️ 四条顺序不可换，换了不会报错、只会"看着不对"：
#   ① 清场必须排在 clearPropTreeClash() 之后（同旗 / 雕塑净空：先跑会改它的保留集，
#      clashDropped 的计数就变了），且必须在鸭子下水之前（鸭子是 props 里的引用）。
_idx_clash = _ass.index('const clashDropped = clearPropTreeClash();')
_idx_lawn = _ass.index('clearLawnZone();')
assert _idx_lawn > _idx_clash, '草坪清场必须排在 clearPropTreeClash() 之后'
assert _idx_lawn < _ass.index('/* --- 6.7 鸭子下水 --- */'), \
    '草坪清场必须在 §6.7 鸭子下水之前（否则会把鸭子删掉）'
#   ② 树圈必须排在**四个 clear* 之后**：clearFlagClearance / clearDiaClearance 按美术盒
#      判相交，会把挨着旗台 / 雕塑两个凹口的树圈连根删掉（实测 13 → 11，南边豁出 206px）。
_idx_ring = _ass.index('plantLawnRing();')
assert _idx_ring > _ass.index('clearDiaClearance();'), \
    '草坪树圈必须排在 clearDiaClearance() 之后（否则凹口两侧的树会被净空删掉）'
#   ③ 树圈必须排在 plantRows() **之后**：plantRows 的 treeSpotOK 也走 treeFreeOfProps，
#      树圈先种会把行道树顶掉（实测 88 → 87）。
assert _idx_ring > _ass.index('const rowTrees = plantRows();'), \
    '草坪树圈必须排在 plantRows() 之后'
#   ④ 清场必须排在树圈**之前**：清的是"根不在草坪上、却把树圈的坑顶掉"的那批冒充树
#      （北边两棵 + 东边两棵，实测 26 个坑只种上 20 个）。反过来就白清了。
assert _idx_lawn < _idx_ring, \
    '草坪清场必须排在 plantLawnRing() 之前（否则树圈照样围不满）'
assert _idx_ring < _ass.index('/* --- 6.7 鸭子下水 --- */'), \
    '草坪树圈必须在 §6.7 鸭子下水之前'

# --- 主循环补丁（三处：出生点与速度、动态水层、边界多边形钳制） ---
loop = REUSE['loop']

_p1_old = 'const player = { x: 640, y: 620, dir: "down", step: 0, walk: 0, speed: 94 };'
_p1_new = 'const player = { x: SPAWN.x, y: SPAWN.y, dir: "down", step: 0, idle: 0, walk: 0, speed: BASE_SPEED };'
assert _p1_old in loop, '补丁1（出生点）未命中'
loop = loop.replace(_p1_old, _p1_new)

_p2_old = '  ctx.drawImage(groundCanvas, ox, oy, VIEW_W, VIEW_H, 0, 0, VIEW_W, VIEW_H);\n'
_p2_new = (_p2_old
           + '  drawWater(ox, oy, zoom);                  // 动态水层：地面之后、道具之前\n')
assert _p2_old in loop, '补丁2（水层）未命中'
loop = loop.replace(_p2_old, _p2_new)

_p3_old = ('    if (!blocked(nx, player.y)) player.x = nx;      // 分轴滑动，撞墙能贴着走\n'
           '    if (!blocked(player.x, ny)) player.y = ny;')
_p3_new = ('    // 分轴滑动：撞墙能贴着走；canWalk 兜底（边界多边形 + 离墙 11px）\n'
           '    if (!blocked(nx, player.y) && canWalk(nx, player.y)) player.x = nx;\n'
           '    if (!blocked(player.x, ny) && canWalk(player.x, ny)) player.y = ny;')
assert _p3_old in loop, '补丁3（边界钳制）未命中'
loop = loop.replace(_p3_old, _p3_new)

_p4_old = '  cam.y = clamp(player.y - VIEW_H * 0.62, 0, WORLD_H - VIEW_H);\n'
_p4_new = (_p4_old
           + '  animateWater(dt);                         // 水波 / 鱼影 / 鸭子\n'
           + '  animateFlag(dt);                          // 旗面换帧（[52_flag] 风动）\n'
           + '  hudTick();                                // HUD：最近地标 + 坐标\n')
assert _p4_old in loop, '补丁4（动态层节拍）未命中'
loop = loop.replace(_p4_old, _p4_new)
assert loop.index('animateWater(dt);') < loop.index('animateFlag(dt);'), \
    '补丁4 的 animateFlag 挂点丢了（旗面就不会动）'

# --- 补丁 5：缩放初始化。必须在 player / cam 声明之后（setZoom 里写 player.speed） ---
_p5_old = 'const cam = { x: 0, y: 0 };'
_p5_new = _p5_old + '\nsetZoom(zoomI);                            // 缩放档位初始化（默认 1×）'
assert _p5_old in loop, '补丁5（缩放初始化）未命中'
loop = loop.replace(_p5_old, _p5_new)

# --- 补丁 6：相机夹取改用"可见世界尺寸"，并兜住视口大于世界的档位 ---
# ⚠️ 必须排在补丁 4 之后（补丁 4 拿 cam.y 那一行当锚点往后追加），锚定的是追加后的文本
_p6_old = ('  cam.x = clamp(player.x - VIEW_W / 2, 0, WORLD_W - VIEW_W);\n'
           '  cam.y = clamp(player.y - VIEW_H * 0.62, 0, WORLD_H - VIEW_H);\n')
_p6_new = ('  /* 可见世界尺寸随 zoom 变。⚠️ FIT 档下 viewH = 270/0.09217 = 2929.47 > WORLD_H = 2929，\n'
           '     上界 WORLD_H - viewH 是负数 → clamp 会返回负上界、把相机推到界外。\n'
           '     所以上界一律 max(0, …)：视口比世界大时相机老实待在原点。 */\n'
           '  cam.x = clamp(player.x - viewW / 2,    0, Math.max(0, WORLD_W - viewW));\n'
           '  cam.y = clamp(player.y - viewH * 0.62, 0, Math.max(0, WORLD_H - viewH));\n')
assert _p6_old in loop, '补丁6（相机夹取）未命中'
loop = loop.replace(_p6_old, _p6_new)

# --- 补丁 7：缩放输入。单挂监听，不碰原按键处理（WATCHED 只管方向键） ---
_p7_old = 'window.addEventListener("blur", () => { for (const k in keys) keys[k] = 0; });'
_p7_new = _p7_old + '''

/* 缩放输入。新挂监听而不是改上面的按键处理 —— 那段的 WATCHED 只管方向键，
   而且 "+" 需要 Shift、各键盘布局不一致，单列一份更清楚。 */
const _ZIN  = { "+": 1, "=": 1, "]": 1 };
const _ZOUT = { "-": 1, "_": 1, "[": 1 };
window.addEventListener("wheel", e => {
  e.preventDefault();                                  // 阻止页面滚动，必须 passive:false
  setZoom(zoomI + (e.deltaY < 0 ? 1 : -1));
}, { passive: false });
window.addEventListener("keydown", e => {
  const k = e.key;
  if      (_ZIN[k])    { setZoom(zoomI + 1); e.preventDefault(); }
  else if (_ZOUT[k])   { setZoom(zoomI - 1); e.preventDefault(); }
  else if (k === "0")  { setZoom(0);                     e.preventDefault(); }  // 看全图
  else if (k === "1")  { setZoom(ZOOM_STEPS.indexOf(1)); e.preventDefault(); }  // 回原尺寸
});
for (const b of document.querySelectorAll("#zoom button"))
  b.addEventListener("click", () => setZoom(zoomI + Number(b.dataset.z)));

/* 滑条：位置 = 档位下标，step=1 → 拖动自动吸附到档位 */
const _rng = document.getElementById("zrng");
if (_rng) {
  _rng.max = ZOOM_STEPS.length - 1;
  _rng.value = zoomI;
  _rng.addEventListener("input", () => setZoom(Number(_rng.value)));
  /* ⚠️ 滑条聚焦时方向键要调缩放、不能同时去推人物：原生 range 响应方向键，
     事件还会冒泡到 window 上那个移动监听。这里掐断传播，两者就不再打架。
     点一下画布即可把焦点还给人物操作。 */
  _rng.addEventListener("keydown", e => {
    if (/^(Arrow|Home|End|Page)/.test(e.key)) e.stopPropagation();
  });
}'''
assert _p7_old in loop, '补丁7（缩放输入）未命中'
loop = loop.replace(_p7_old, _p7_new)

# --- 补丁 8：地面改走 mip，源/目标矩形全部按 zoom 换算 ---
_p8_old = '  ctx.drawImage(groundCanvas, ox, oy, VIEW_W, VIEW_H, 0, 0, VIEW_W, VIEW_H);\n'
_p8_new = '''  /* 地面取 mip。L 保证 2^L <= 1/zoom ⇒ 只做「1:1 或轻微缩小」，绝不放大 mip（会糊）。
     源矩形按 WORLD 边界夹一次：FIT 档 viewH 比 WORLD_H 大 0.47px，不夹会在底边漏透明缝。
     crisp（整数放大 / 精确 mip）关平滑走最近邻，其余开平滑。 */
  const L = mipLevelFor(zoom), s = 1 << L;
  const mw = mips[L].width, mh = mips[L].height;
  const msw = Math.min(viewW, WORLD_W - ox) / s, msh = Math.min(viewH, WORLD_H - oy) / s;
  const crisp = zoom >= 1 || zoom * s === 1;
  let mox = ox / s, moy = oy / s;
  if (crisp) { mox = Math.round(mox); moy = Math.round(moy); }   // 精确贴图：对齐 mip 网格
  mox = Math.max(0, Math.min(mox, mw - msw));
  moy = Math.max(0, Math.min(moy, mh - msh));
  ctx.imageSmoothingEnabled = !crisp;
  ctx.drawImage(mips[L], mox, moy, msw, msh, 0, 0, msw * s * zoom, msh * s * zoom);
'''
assert _p8_old in loop, '补丁8（地面 mip）未命中'
loop = loop.replace(_p8_old, _p8_new)

# --- 补丁 9：道具视口裁剪改用"世界视口"，并滤掉亚像素道具 ---
_p9_old = '''    const sx = p.x - p.ax, sy = p.y - p.ay;
    if (sx > ox + VIEW_W || sx + p.img.width < ox) continue;
    if (sy > oy + VIEW_H || sy + p.img.height < oy) continue;
    drawList.push(p);'''
_p9_new = '''    const sx = p.x - p.ax, sy = p.y - p.ay;
    if (sx > ox + viewW || sx + p.img.width < ox) continue;      // 世界量纲 vs 世界视口
    if (sy > oy + viewH || sy + p.img.height < oy) continue;
    /* 缩得比 1.5 背板像素还小的道具（FIT 档下的树/花坛/垃圾桶）画出来也是亚像素点，
       白费力气还可能因点采样忽隐忽现，直接过滤掉。 */
    if (Math.max(p.img.width, p.img.height) * zoom < 1.5) continue;
    drawList.push(p);'''
assert _p9_old in loop, '补丁9（道具裁剪）未命中'
loop = loop.replace(_p9_old, _p9_new)

# --- 补丁 10：道具落笔按 zoom 缩放 ---
_p10_old = '''  for (const it of drawList)
    ctx.drawImage(it.img, Math.round(it.x - it.ax) - ox, Math.round(it.y - it.ay) - oy);'''
_p10_new = '''  /* ⚠️ 取整必须在**背板空间**：先 round 世界坐标再乘 zoom，会把物体相对间距量化到
     1/zoom 世界像素的网格上。宽高也必须显式传，否则 drawImage 不会放大。
     缩小时开平滑，否则小精灵会被点采样整帧"抽没"（角色只有 1~2 背板像素宽）。
     ⚠️ `k = it.clip` 只对**角色**非 0（补丁 15 给它加的）：入水时把精灵底部 k 行裁掉，
        下面对齐好的湖水与波纹自然露出来 —— 这就是"淹没"的全部实现，不加半透明水罩。
        裁的是**源矩形**（矩形高度改成 height - k），所以裁切边永远落在整数像素行上。
        非角色那条分支与加裁切之前**逐字相同**，热路径上只多一个整数判断。 */
  ctx.imageSmoothingEnabled = zoom < 1;
  for (const it of drawList) {
    const k = it.clip || 0;
    const dx = Math.round((it.x - it.ax - ox) * zoom), dy = Math.round((it.y - it.ay - oy) * zoom);
    if (k) {
      ctx.drawImage(it.img, 0, 0, it.img.width, it.img.height - k, dx, dy,
                    it.img.width * zoom, (it.img.height - k) * zoom);
      drawSwimRing(ctx, it, dx, dy, k, zoom);           // 水线涟漪：紧跟角色那一笔之后
    } else {
      ctx.drawImage(it.img, dx, dy, it.img.width * zoom, it.img.height * zoom);
    }
  }'''
assert _p10_old in loop, '补丁10（道具落笔）未命中'
loop = loop.replace(_p10_old, _p10_new)
assert loop.count('const k = it.clip || 0;') == 1, '补丁10 挂点不唯一'
# ⚠️ 涟漪必须在**角色那一笔之后**、且与角色同一轮循环里：那样它天然被更靠南的道具盖住，
#    不需要去抢 baseY 排序（抢 baseY 是隐性契约，见 45_water.js §4.5.1c 的注释）。
assert 'drawSwimRing(ctx, it, dx, dy, k, zoom);' in loop, '补丁10 里丢了水线涟漪的调用点'
assert loop.index('drawSwimRing(ctx, it, dx, dy, k, zoom);') > loop.index('ctx.drawImage(it.img, 0, 0,'), \
    '水线涟漪必须画在角色那一笔之后'

# --- 补丁 11：步态驱动（4 帧行走 + 待机呼吸 + 按位移推进） ---
# ⚠️ 锚定的是**补丁 3 替换后**的文本，所以必须排在补丁 3 之后。
_p11_old = ('    // 分轴滑动：撞墙能贴着走；canWalk 兜底（边界多边形 + 离墙 11px）\n'
            '    if (!blocked(nx, player.y) && canWalk(nx, player.y)) player.x = nx;\n'
            '    if (!blocked(player.x, ny) && canWalk(player.x, ny)) player.y = ny;\n'
            '    player.walk += dt;\n'
            '    player.step = ((player.walk * 7) | 0) & 1;\n'
            '  } else {\n'
            '    player.walk = 0; player.step = 0;\n'
            '  }')
_p11_new = ('    // 分轴滑动：撞墙能贴着走；canWalk 兜底（边界多边形 + 离墙 11px）\n'
            '    const _wx = player.x, _wy = player.y;              // 位移前的位置\n'
            '    if (!blocked(nx, player.y) && canWalk(nx, player.y)) player.x = nx;\n'
            '    if (!blocked(player.x, ny) && canWalk(player.x, ny)) player.y = ny;\n'
            '    /* 步态按**实际位移**推进，不是按时间 ——\n'
            '       ⚠️ 原版是 `player.walk += dt`：顶着墙走时它照常累加，人会原地踏步\n'
            '          （贴墙滑行时尤其明显）。改成累加碰撞后的真实位移，顶墙 → 位移 0 → 脚立刻停。\n'
            '       一个完整步态周期 = WALK_STRIDE 世界像素（4 帧 = 左右各一步），\n'
            '       所以档位越高（世界速度越慢）步频越低，屏幕上的节奏始终对得上。 */\n'
            '    player.idle = 0;\n'
            '    player.walk += Math.hypot(player.x - _wx, player.y - _wy);\n'
            '    player.step = (Math.floor(player.walk / WALK_STRIDE * WALK_FRAMES)) & (WALK_FRAMES - 1);\n'
            '  } else {\n'
            '    player.walk = 0;\n'
            '    player.idle = (player.idle || 0) + dt;              // 待机呼吸：慢速两帧\n'
            '    player.step = IDLE_BASE + (((player.idle * IDLE_HZ) | 0) & (IDLE_FRAMES - 1));\n'
            '  }')
assert _p11_old in loop, '补丁11（步态驱动）未命中'
loop = loop.replace(_p11_old, _p11_new)

# --- 补丁 12：dt 夹住**下界**（原 demo 只夹上界） ---
# 为什么非改不可：`let last = performance.now()` 在 loop 段（4000+ 行）求值，即**整页烘焙之后**；
# 而 rAF 首帧的 now 有可能比它小（时基倒挂 / 首帧时间戳缺失）→ dt 为负。
# 负 dt 只倒退一帧本来无害，但 waterT / flagPhase 这些**累积相位**一旦转负要爬几十帧才回正，
# 而 flagPhase 会立刻把负数喂进数组下标 → flagFrames[-7] = undefined → 下一帧 render 断链 → 整页定格。
# 这是 2026-09-13 在 Edge 127 上实录的事故，Chrome 首帧时基恰好正常所以四套自动化全绿。
_p12_old = 'const dt = Math.min(0.05, (now - last) / 1000);'
_p12_new = ('/* ⚠️ 必须**同时夹下界**：last 在整页烘焙之后才求值，而 rAF 首帧的 now 可能比它小\n'
            '     （时基倒挂）→ dt < 0。负值会污染所有累积相位（waterT / flagPhase），\n'
            '     并一路传进数组下标（见补丁 4 挂上的旗面换帧）。 */\n'
            '  const dt = Math.max(0, Math.min(0.05, (now - last) / 1000));')
assert _p12_old in loop, '补丁12（dt 夹下界）未命中'
loop = loop.replace(_p12_old, _p12_new)
assert loop.count('Math.max(0, Math.min(0.05') == 1, '补丁12 挂点不唯一'

# --- 补丁 13：雕塑喷泉换帧（挂 hudTick 之后，即补丁 4 追加段的末尾） ---
# ⚠️ 锚定的是**补丁 4 替换后**的文本，所以必须排在补丁 4 之后。
# 与 animateFlag 同构、同样的三道闸（闸本身写在 53_diaosu.js 里，契约断言在上面）。
_p13_old = '  hudTick();                                // HUD：最近地标 + 坐标\n'
_p13_new = (_p13_old
            + '  animateDiaosu(dt);                       // 雕塑喷泉换帧（[53_diaosu] 水柱）\n')
assert _p13_old in loop, '补丁13（喷泉换帧）未命中'
loop = loop.replace(_p13_old, _p13_new)

# --- 补丁 14：斜向朝向改用侧视（1 个字符） ---
# 八向摇杆斜推时 dx/dy 归一化后**相等**（各 0.7071），`>` 会落进 else 分支 →
# 斜向右上走时人物朝上，玩家看到的是后脑勺 —— 用户要的"头部朝移动方向"就丢在这里。
# 改 `>=` 后斜走取侧视（至少露侧脸）；纯上下（|dx| = 0）照旧走 else，不受影响。
# ⚠️ 不新画四个斜向方向是有意的：那是 4 向 × 6 相位 = 24 张新精灵，用户已明确不选这条。
_p14_old = ('    if (Math.abs(dx) > Math.abs(dy)) player.dir = dx < 0 ? "left" : "right";\n'
            '    else player.dir = dy < 0 ? "up" : "down";')
_p14_new = ('    /* ⚠️ `>=` 而不是 `>`：斜推时 |dx| === |dy|，用 `>` 会落进 else → 朝上（后脑勺）。\n'
            '       取侧视至少露侧脸。纯上下（|dx| = 0）仍走 else，行为一字不变。 */\n'
            '    if (Math.abs(dx) >= Math.abs(dy)) player.dir = dx < 0 ? "left" : "right";\n'
            '    else player.dir = dy < 0 ? "up" : "down";')
assert _p14_old in loop, '补丁14（斜向朝向）未命中'
loop = loop.replace(_p14_old, _p14_new)
assert loop.count('Math.abs(dx) >= Math.abs(dy)') == 1, '补丁14 挂点不唯一'
assert 'Math.abs(dx) > Math.abs(dy)' not in loop, '补丁14 之外还有一处老判据'

# --- 补丁 15：角色带上下水裁切量（落笔处按它裁，见补丁 10） ---
# ⚠️ 只给角色那一项加 `clip`，其余道具不带这个字段（`it.clip || 0` 在补丁 10 里兜底），
#    热路径上多出来的只是一个整数判断。
_p15_old = ('  drawList.push({ img: charSprite(player.dir, player.step), ax: CH_AX, ay: CH_AY,'
            ' x: player.x, y: player.y, baseY: player.y });')
_p15_new = ('''  /* 下水淹没：按**离岸距离**决定裁掉底部多少行。
     ⚠️ 贴岸与岸上自动收敛到 0（lakeSubmerge 自带这个性质），不需要额外夹取 ——
        "裁掉的部分露出的是岸不是水"这个边界情况因此不存在。
     湖心 subm=0.5 → cut=15 → 可见 0..14 行，水线正好落在腰上（行预算见 45_water.js §4.5.1b）。
     裁切边落在整数源像素行上，所以 zoom<1 开平滑也不会渗出半透明边。 */
  const chClip = Math.round(CH_H * lakeSubmerge(player.x, player.y));
  drawList.push({ img: charSprite(player.dir, player.step), ax: CH_AX, ay: CH_AY,'''
            ' x: player.x, y: player.y, baseY: player.y, clip: chClip });')
assert _p15_old in loop, '补丁15（下水裁切）未命中'
loop = loop.replace(_p15_old, _p15_new)
assert loop.count('clip: chClip });') == 1, '补丁15 挂点不唯一'
# 裁切量必须是**当前帧**算的：写进 player 或者挪到 update 里都会跟上一帧的落点错位。
assert 'lakeSubmerge(player.x, player.y)' in loop, '补丁15 的深度判据丢了'

# =========================================================================
# --- §7 向导「小北」：向导落笔 / 每帧心跳 ---
# ⚠️ 编号 = 应用顺序。这两条的编号**故意保留 18 / 19**（不重排成 16 / 17）：
#    parts/72_guide.js、_guideprobe.py、_guideshot.py 与 README 里到处按 18/19
#    引它们，重排只会制造一批"只在注释里存在的悬空编号"。
#    （曾经 18 依赖补丁 15、19 依赖补丁 13，这条依赖关系仍然成立。）
# ⚠️ 锚点一律**从上面的补丁里复制**，不要手打 —— 里面有对齐空格，手打必错。
# =========================================================================

# --- 补丁 16 / 17：已于 2026-09-30（第三十六轮）删除 ---
# 16 是"带路高亮"：把 drawGuideRoute 挂到 drawWater 之后，画一条黄色流动虚线。
# 17 是"自动接管玩家方向"：把 guideAutoStep 算出的方向覆盖进主循环的 dx/dy，
#    于是**玩家**被推着沿路走，而向导自己站着不动。
# 用户 2026-09-30 逐字要求「向导会走在我前面」「导航过程中不要显示引导线」——
# 两条补丁的实现基础同时消失：她改成自己走（GUIDE.x/y 由 72 段推进），
# 线整个不要了。§7 断言块里各留了一条 `== 0` 的反向断言，防的是复活。

# --- 补丁 18：向导落笔。挂在补丁 15 改写出来的那行之后 ---
# ⚠️ 与玩家走**同一条落笔路径** —— 补丁 9 的视口裁剪、补丁 10 的 zoom 缩放、
#    baseY 排序遮挡全部白拿。
# ⚠️ 不进 props 是**故意的**（见 parts/72_guide.js 文件头 (3)）：她是每帧换 img 的活人，
#    进 props 会让 _propdiff.py / _sprhash.py 每轮报一条假差异（同 duck / flag 的处置），
#    而且会落进 60 段那一串**白名单式** clear* 的射程里。
_p18_old = ' x: player.x, y: player.y, baseY: player.y, clip: chClip });\n'
_p18_new = (_p18_old
            + '  /* 向导「小北」：与补丁 9 同口径 —— FIT 档下 18px 的精灵只剩 1.6 背板像素，\n'
            + '     点采样会忽隐忽现，直接不画。 */\n'
            + '  if (Math.max(CH_W, CH_H) * zoom >= 1.5)\n'
            + '    drawList.push({ img: guideSprite(GUIDE.dir, GUIDE.step), ax: CH_AX, ay: CH_AY,\n'
            + '                    x: GUIDE.x, y: GUIDE.y, baseY: GUIDE.y });\n')
assert _p18_old in loop, '补丁18（向导落笔）未命中'
assert loop.count(_p18_old) == 1, '补丁18 锚点不唯一'
loop = loop.replace(_p18_old, _p18_new, 1)

# --- 补丁 19：向导每帧心跳。挂在补丁 13 追加出来的 animateDiaosu 那行之后 ---
# 挂这里是因为此时 cam 已经算完（相机在 update() 里算），气泡定位不差帧。
_p19_old = '  animateDiaosu(dt);                       // 雕塑喷泉换帧（[53_diaosu] 水柱）\n'
_p19_new = (_p19_old
            + '  guideTick(dt);                           // 向导：朝向 / 气泡 / 到站 / 卡死\n')
assert _p19_old in loop, '补丁19（向导心跳）未命中'
assert loop.count(_p19_old) == 1, '补丁19 锚点不唯一'
loop = loop.replace(_p19_old, _p19_new, 1)

# --- 补丁 20：建筑遮挡虚化（第三十七轮 2026-09-30） ---
#   用户：「走到某栋楼后边楼虚化我们可以看清楚自己在楼后边的行动」。
#   ⚠️ 只往绘制循环里插**两处**（帧首复位 + 循环头取值），循环体一个字不改 ——
#      `drawImage` 两条分支与 drawSwimRing 的相对位置是整套遮挡体系的既有契约。
#   ⚠️ 复位必须在**帧首**：地面 mip 与 drawWater 都排在绘制循环**之前**，
#      上一帧最后一笔留下的 0.34 会整片糊到这一帧的地面上（clearRect 不重置 alpha，
#      它只清像素）。所以下面 20a 挂在 clearRect 之前。
#   ⚠️ 下面两条锚点文本是**逐字**从 loop 里抄下来的（含对齐空格），不要手打 ——
#      手打必错，而且错了只会报"未命中"，看不出差在哪个空格上。
_p20a_old = ('  ctx.imageSmoothingEnabled = false;\n'
             '  ctx.clearRect(0, 0, VIEW_W, VIEW_H);\n')
_p20a_new = ('  ctx.imageSmoothingEnabled = false;\n'
             '  occlFrame();                              // 第三十七轮：复位 alpha + 算插值步长\n'
             '  ctx.clearRect(0, 0, VIEW_W, VIEW_H);\n')
assert _p20a_old in loop, '补丁20a（帧首复位）未命中'
assert loop.count(_p20a_old) == 1, '补丁20a 锚点不唯一'
loop = loop.replace(_p20a_old, _p20a_new, 1)

_p20b_old = ('  for (const it of drawList) {\n'
             '    const k = it.clip || 0;\n')
_p20b_new = ('  occlTick(drawList, ox, oy, zoom);          // 第三十七轮：先定「哪些楼该淡」\n'
             '  for (const it of drawList) {\n'
             '    const k = it.clip || 0;\n'
             '    ctx.globalAlpha = occlAlpha(it);       // 1 = 原样画；<1 = 这栋楼挡住了人\n')
assert _p20b_old in loop, '补丁20b（循环头）未命中'
assert loop.count(_p20b_old) == 1, '补丁20b 锚点不唯一'
loop = loop.replace(_p20b_old, _p20b_new, 1)

# 负向保护：§7 这批补丁的文本不许撞到上面那四条既有的唯一性断言
for _bad in ('const k = it.clip || 0;', 'Math.max(0, Math.min(0.05',
             'Math.abs(dx) >= Math.abs(dy)', 'clip: chClip });'):
    assert loop.count(_bad) == 1, '§7 补丁把既有唯一性断言撞了: ' + _bad

# --- 16 号宿舍楼契约（parts/62_dorm16.js §5.12，2026-09-19） ---
#   用户当天三条：「这栋楼楼体是红色的，有窗户和白色空调外机」「这栋楼有两个门楼，
#   一个在左侧一个在右侧，都距离边 2 个窗户」「大门前边四个柱子，除了正对门之外
#   另外两个空挡是白色小柱子（很小）组成的网格」；加长方式用户拍板"改占位，两端各延一点"。
#   ⚠️ 与科学会堂那组同理：五套自动验收都不看画面 ⇒ 这里钉的是**结构**与**接线**，
#      "像不像"只能出图看。本段最容易死的方式**不是报错，是画了但没接上**
#      （dxSign 第五轮就是这么死的：函数定义在，调用点丢了，楼上一个字没有）。
_d16 = part('62_dorm16.js')
_d16code = _strip_js(_d16)
# ① 层数必须与 styleOf 那一行**同源**：层数一变 wallH 就变，本段按 baseY 反推的 eaveY
#    是同一根链条，两处脱钩的话门楼会画到屋面上去。
_re_d16_style = re.search(r'/\^16宿舍楼\$/[^\n]*?return \{ p: 5, floors: (\d+) \}', _ca)
_re_d16_floors = re.search(r'const D16_FLOORS = (\d+);', _d16code)
assert _re_d16_style, "60 段 styleOf 里没有 `/^16宿舍楼$/` 那条 —— 红砖档 p:5 拿不到，" \
    "16 号楼会被归成 p:1 的米色宿舍，62 段的灰蓝门楼贴在一片米色墙上"
assert _re_d16_floors, '62 段没有 D16_FLOORS —— eaveY = baseY − wallH 反推不出墙顶'
assert _re_d16_style.group(1) == _re_d16_floors.group(1), \
    'styleOf 的 floors(%s) 与 62 段 D16_FLOORS(%s) 不一致 —— 门楼会画歪到屋面或半空中' % (
        _re_d16_style.group(1), _re_d16_floors.group(1))
# ② 红砖档本身（PALETTE 第 6 项）：62 段拿 pal.wall 当"砖红基准亮度"做像素换色，
#    这一档丢了 / 串了色，换出来的灰蓝明度层次就是错的。
assert '{ wall: "#bf6a59", roof: "#6b463c", glass: "#9ec0dc", door: "#5a3f2a" }' in _ca, \
    'PALETTE 第 6 档（16 号楼红砖）不在 —— 62 段的像素换色以 pal.wall 为基准亮度，' \
    '档位一丢，换出来的灰蓝就没了砖纹/窗台的明暗层次'
# ③ 加长落地：用户拍板"改占位，两端各延一点"（w 0.8931 → 1.0190，共 +39.5 世界像素）。
#    ⚠️ 上限不是拍脑袋的：楼右缘 3443.0（精灵再外溢 ~5px ⇒ 视觉 3448），
#    东围墙柱体内缘最紧处 **3463.7**（BOUND #60 折线 [8.8966,0.2854]→[8.8486,2.3118]，
#    墙随 y 南行而西收，y≈283 处最紧）——留给墙只剩 ~16px。
#    首版按"两端各 35"写成 w=1.0723（右缘 3463.8）**正好压在围墙柱体上**，
#    探针 _d16probe.py 抓到才退回来。谁再动这行，先跑 `python _d16probe.py`。
assert '["16宿舍楼",   "bld",     7.7958, 0.3319, 1.0190, 0.4583],' in part('20_ground.js'), \
    '16 号楼的占位行不是加长后的那一行 —— 楼体短了，两个门楼 + 中间红墙排不开'
# ④ 不动 bSeed / 不碰共享 RNG（§6.6 那颗地雷：散射流一重掷，全校园的树都换位置）
assert 'bSeed' not in _d16code and 'Math.random' not in _d16code, \
    '62 段碰了 bSeed 或 Math.random —— 会重掷全校园散射（必须用局部 makeRng）'
assert 'makeRng(1607)' in _d16code, \
    '62 段的空调外机没用局部 makeRng(1607) —— 共享 RNG 一旦被推进，全校园散射跟着变'
# ⑤ 顶层不许读 PALETTE（TDZ：62 段排在 60 段**之前**拼接，顶层读它 = 加载期整页 JS 死）
assert 'PALETTE' not in _d16code, \
    '62 段顶层读了 PALETTE —— 它只能在函数体里读（58 段 PALETTE 已栽过：整页 JS 死）'
# ⑥ 调用点唯一（60 段），且必须排在 addProp 之前（同 gymRestyle/dxRestyle/xgRestyle/kxRestyle）
assert 'else if (name === "16宿舍楼") dorm16Restyle(b, pal);' in _ca, \
    '60 段少了 dorm16Restyle 的调用点 —— 定义了不等于画了'
assert _ca.index('dorm16Restyle(b, pal)') < _ca.index('addProp(Object.assign({}, b, { x: ax, y: ay,'), \
    'dorm16Restyle 排在 addProp **之后** —— addProp 取的就是 s.canvas，' \
    '晚一步挂进 props 的还是旧精灵（55/58/59/61 同一规矩）'
# ⑦ 整面墙是**重绘**出来的，不是擦补丁：30 段 §3.5 的窗阵有 4px 排布缺陷
#    （f=0 落在 eaveY+floors·34−52、f=floors−1 落在 −48，**任何层数都差 4px**
#    ⇒ 最下两行窗重叠 18px）。62 段拿"砖底 + 砖纹 + 檐影 + 腰线 + 棱 + 雨水管 +
#    contactBand + 6 行窗"整套重铺一遍，缺一环就会在旧窗上叠新窗。
#    本轮**只修 16 号楼**（用户拍板"只做 16 号楼"），30 段模板一字未动。
assert 'contactBand' in _d16code and 'winAt' in _d16code, \
    '62 段没有整面墙重绘（contactBand/winAt 缺一）—— 30 段窗阵的 4px 缺陷压不下去，' \
    '最下两行窗会叠成一条 18px 的糊带'

# --- 逸夫楼契约（parts/63_yifu.js §5.13，2026-09-19） ---
#   用户当天七条：「逸夫楼主题是深红色的，你可以在深红色区域安排窗户，逸夫楼窗户是长条状的，
#   竖直方向的长条。深灰色部分是玻璃，这部分玻璃是深灰色的，注意玻璃网格，深灰色区域应该有
#   四块…（更正：）对了深灰色其实是 5 个区域，浅灰色代表建筑块，不需要特别安排，还原即可」
#   + 「黑色矩形代表露台、阳台，鲜红色部分代表墙面，不用安排窗户」；
#   三个拍板：层数 8、撤屋顶牌、占地 662px 保持不动（⇒ 20_ground.js 一个字节不改）。
#   ⚠️ 与 62 段同理：五套自动验收都不看画面 ⇒ 这里钉的是**结构**与**接线**。
#   本段最贵的一条恰恰是"绿着但没画出来"：初版的裁剪从 eaveY 起，把压在墙顶线以上的
#   两个浅灰块（id=15 / id=14，行 −45.8..0）**整个切掉**，而四套验收全绿、验收表里
#   5 个玻璃区照样报"5" —— 见 63 段 §5.13.4 的注释。
#   ⚠️ 编号约定：本段所有 `id=N` 都是 pptx 的 `p:cNvPr/@id`（**不是** slide.shapes 的
#   枚举下标，两者在第 6 页是 idx 0..26 / id 4..31）。2026-09-19 之前注释两种混用，
#   "按 #30 去查"根本查不到形状 —— 见 63 段文件头 §四。
_yf = part('63_yifu.js')
_yfcode = _strip_js(_yf)
# ① 层数必须与 styleOf 那一行**同源**（同 62 段）：层数一变 wallH 就变，本段按 baseY
#    反推出的 eaveY 是同一根链条，两处脱钩立面会画到屋面上去。
_re_yf_style = re.search(r'/\^逸夫楼\$/[^\n]*?return \{ p: 6, floors: (\d+) \}', _ca)
_re_yf_floors = re.search(r'const YF_FLOORS = (\d+);', _yfcode)
assert _re_yf_style, "60 段 styleOf 里没有 `/^逸夫楼$/` 那条 —— 深红档 p:6 拿不到，" \
    "逸夫楼会被归成 p:4 的米色其它楼、3 层，63 段的深红立面会贴在一栋 3 层米色楼上"
assert _re_yf_floors, '63 段没有 YF_FLOORS —— eaveY = baseY − wallH 反推不出墙顶'
assert _re_yf_style.group(1) == _re_yf_floors.group(1), \
    'styleOf 的 floors(%s) 与 63 段 YF_FLOORS(%s) 不一致 —— 立面会画歪到屋面或半空中' % (
        _re_yf_style.group(1), _re_yf_floors.group(1))
# ② 深红档本身（PALETTE 第 7 项）：30 段先按这一档铺底，63 段的"整面重铺"再盖上去。
#    档位丢了 / 串了色，先铺出来的底就不对，檐影与棱的明暗层次跟着错。
assert '{ wall: "#c00000", roof: "#6b6b70", glass: "#8f8f8f", door: "#3a1418" }' in _ca, \
    'PALETTE 第 7 档（逸夫楼深红）不在 —— 30 段铺底就没有深红，63 段的檐影/棱会按米色墙算'
# ③ 占地**一个字节不许动**（用户拍板"保持 662px 不动"）：动了就触发 §6.6 那颗地雷
#    （scatter() 的 n 既是接受计数又是物种种子 ⇒ 全校园散射重掷）。
#    这一行是 200 行占位表里的原文，谁改谁就得先跑 `python _propdiff.py`。
assert '["逸夫楼",     "bld",     9.0250, 4.0208, 1.6951, 0.6118],' in part('20_ground.js'), \
    '逸夫楼的占位行被改了 —— 碰撞盒/PPT 轮廓/散射候选格全变，全校园树的位置会重掷'
# ④ 不动 bSeed / 不碰共享 RNG（同 62 段）
assert 'bSeed' not in _yfcode and 'Math.random' not in _yfcode, \
    '63 段碰了 bSeed 或 Math.random —— 会重掷全校园散射（必须用局部 makeRng）'
assert 'makeRng(6317)' in _yfcode and 'makeRng(6318)' in _yfcode, \
    '63 段的屋面斑点没用局部 makeRng(6317)/(6318) —— 共享 RNG 一旦被推进，全校园散射跟着变'
# ⑤ 顶层不许读 PALETTE（TDZ：63 段排在 60 段**之前**拼接，顶层读它 = 加载期整页 JS 死）
assert 'PALETTE' not in _yfcode, \
    '63 段顶层读了 PALETTE —— 它只能在函数体里读（58 段 PALETTE 已栽过：整页 JS 死）'
# ⑥ 调用点唯一（60 段），且必须排在 addProp 之前（同 gymRestyle/dxRestyle/kxRestyle）
assert 'else if (name === "逸夫楼") yifuRestyle(b, pal);' in _ca, \
    '60 段少了 yifuRestyle 的调用点 —— 定义了不等于画了'
assert _ca.index('yifuRestyle(b, pal)') < _ca.index('addProp(Object.assign({}, b, { x: ax, y: ay,'), \
    'yifuRestyle 排在 addProp **之后** —— addProp 取的就是 s.canvas，晚一步挂进 props 的还是旧精灵'
# ⑦ **五个玻璃区**（用户口径）—— 数错一次就是"绿着但少画一块"：
#    初版把 idx 12（浅灰 #D0CECE，真身 id=15）当成了玻璃、又把真玻璃 id=31（右翼底层横带）
#    整条漏掉，**一错一漏互相抵消**，计数照样是 5，`YF_GLASS_ZONES` 的断言与验收表
#    一个数都没变。⇒ 光数数是不够的，⑫ 组把 pptx 的**逐形状对账表**也钉进来。
#    判据：`YF_GLASSES` 的条目数 + 每条的矩形总数。5 个区域 = 1+1+1+1+4 = **8 个矩形**。
_re_yf_glass = re.search(r'const YF_GLASSES = \[(.*?)\n\];', _yfcode, re.S)
assert _re_yf_glass, '63 段找不到 YF_GLASSES 表'
_re_yf_zones = re.search(r'const YF_GLASS_ZONES = (\d+);', _yfcode)
assert _re_yf_zones and int(_re_yf_zones.group(1)) == 5, \
    'YF_GLASS_ZONES 不是 5 —— 用户口径是「深灰色其实是 5 个区域」'
_yf_zone_rows = re.findall(r'\{\s*r:\s*\[', _re_yf_glass.group(1))
_yf_rects = re.findall(r'\[\s*\d+\.\d+,\s*\d+\.\d+,\s*-?\d+\.\d+,\s*-?\d+\.\d+\s*\]', _re_yf_glass.group(1))
assert len(_yf_zone_rows) == 5, \
    'YF_GLASSES 实际只有 %d 个区域（用户口径 5）—— 少的那块在画面上就是一片没有网格的红墙' % len(_yf_zone_rows)
assert len(_yf_rects) == 8, \
    'YF_GLASSES 的矩形总数是 %d，应为 8（1+1+1+1+4：⑤ 柱子后边被 5 根柱切成 4 格）—— ' \
    '"少一格"在画面上只是柱子后边少一条玻璃，出图也未必看得出来' % len(_yf_rects)
re_zone = None
# ⑧ 浅灰建筑块 9 块 = 4 个体块 + 5 根柱（id=15 / id=14 / id=19 / id=12 + 5 柱）
_re_yf_blocks = re.search(r'const YF_BLOCKS = \[(.*?)\n\];', _yfcode, re.S)
assert _re_yf_blocks, '63 段找不到 YF_BLOCKS 表'
_yf_brows = re.findall(r'^\s*\[\s*\d+\.\d+,', _re_yf_blocks.group(1), re.M)
assert len(_yf_brows) == 9, \
    'YF_BLOCKS 是 %d 块、应为 9（4 个体块 + 5 根柱）—— 少的那块正是"压在墙顶线以上"的 ' \
    'id=15，它必须靠 §5.13.4 那条抬高到 eaveY−52 的裁剪才画得出来' % len(_yf_brows)
# ⑨ 两块楼名标牌的点阵尺寸必须与 _yffont.py 的 V_H/V_W/H_H **同源**。
#    点阵是 _yffont.py 生成后**写回 63 段**的（§5.13.7 的生成块），两边脱钩时字体改了、
#    排布没改 —— 字会被拉伸成扁的，而四套验收全绿。
_fontsrc = open(os.path.join(HERE, '_yffont.py'), encoding='utf-8').read()
_re_font_vh = re.search(r'^V_H, V_W = (\d+), (\d+)$', _fontsrc, re.M)
_re_font_hh = re.search(r'^H_H = (\d+)$', _fontsrc, re.M)
assert _re_font_vh and _re_font_hh, '_yffont.py 里找不到 V_H/V_W 或 H_H'
_fv_h, _fv_w, _fh_h = int(_re_font_vh.group(1)), int(_re_font_vh.group(2)), int(_re_font_hh.group(1))
_re_yf_v = re.search(r'const YF_V_CHARS = \[(.*?)\n\];', _yfcode, re.S)
_re_yf_h = re.search(r'const YF_H_CHARS = \[(.*?)\n\];', _yfcode, re.S)
assert _re_yf_v and _re_yf_h, '63 段找不到 YF_V_CHARS / YF_H_CHARS 生成块'
_yf_vdims = re.findall(r'"\s*,\s*(\d+),\s*(\d+)\]', _re_yf_v.group(1))
_yf_hdims = re.findall(r'"\s*,\s*(\d+),\s*(\d+)\]', _re_yf_h.group(1))
assert len(_yf_vdims) == 5, '逸夫教学楼是 5 个字，点阵块里只有 %d 个' % len(_yf_vdims)
assert len(_yf_hdims) == 4, '研究生院是 4 个字，点阵块里只有 %d 个' % len(_yf_hdims)
for i, (w, h) in enumerate(_yf_vdims):
    assert (int(w), int(h)) == (_fv_w, _fv_h), \
        'YF_V_CHARS[%d] 的点阵是 %sx%s，_yffont.py 的 V_W/V_H 是 %sx%s —— ' \
        '改字号没重跑 _yffont.py，字会被拉伸' % (i, w, h, _fv_w, _fv_h)
for i, (w, h) in enumerate(_yf_hdims):
    assert int(h) == _fh_h, \
        'YF_H_CHARS[%d] 的点阵高 %s，_yffont.py 的 H_H 是 %s —— 同上' % (i, h, _fh_h)
#     ⚠️ 横排**故意**不查宽：宽是随各字长宽比走的（「生」的 h/w = 1.59），
#        查"等宽"会把正确的表判错。
# ⑩ 竖排标牌给的是**字列中心**，不是左缘。ppt 的 TEXT_BOX 是 871.8..897.3 点
#    （= world 628.4..649.9），文字在框里居中 ⇒ 中心 639.15。
#    早先按"左缘 639.2"画，整列右移半格宽、右边压到墙体棱上 —— 而出图前看不出来。
assert 'YF_V_CX - m[1] * SX / 2' in _yfcode, \
    '竖排标牌的 x 不是"中心 − 半字宽"算的 —— 说明又把 YF_V_CX 当左缘用了（整列会右移半格宽）'
# ⑪ 整面墙是**重绘**出来的，不是擦补丁（同 62 段）：30 段 §3.5 的窗阵有 4px 排布缺陷
#    （任何层数都差 4px ⇒ 最下两行窗叠 18px），在深红底上比米色墙更扎眼。
assert 'contactBand' in _yfcode and 'winAt' in _yfcode, \
    '63 段没有整面墙重绘（contactBand/winAt 缺一）—— 30 段窗阵的 4px 缺陷压不下去'
# ⑫ pptx 逐形状**对账表** —— 这一组是"每一块都对得上"，不是"数得对"。
#    ⑦ 的计数断言挡不住本轮真正的错：把浅灰块当成玻璃 + 漏掉真玻璃，**两个错互相抵消**。
#    表来源（**pptx 一改就得重跑、重贴**）：`python _build/_pptshapes.py 6`（2026-09-19 生成）。
#    key = pptx 形状 id（**不是** slide.shapes 的枚举下标，见 63 段文件头 §四），
#    value = (x0, x1, row0, row1, 类别)；类别 = 它**渲染成什么**：
#        red    #C00000 深红墙（有窗）        bright #FF0000 鲜红实墙（无窗）
#        glass  #595959 玻璃（schemeClr:tx1 + lumMod65000/lumOff35000）
#        block  #D0CECE 浅灰块（schemeClr:bg2 + lumMod90000）
#    ⚠️ 只列**参与对账的四类**（27 个形状里的 19 个）；5 条阳台 id=5..9（纯黑 #000000）、
#       两个凹区、两条蓝色台明 id=20/21（#4874CB）不在其中 —— 它们没有并排的"区域表"。
#    ⚠️ 2026-09-19 两个**负向测试**都实测过（改完就还原，63 段 md5 复原一致）：
#       a) 把 ③ 换成浅灰块 id=15 的 bbox ⇒ "不被 ppt 任何 glass 形状包住…落在类别 block"
#       b) 把 ③ 改成与 ① 同一条（矩形数照样 8）⇒ "ppt 的 glass 形状 [31] 一块都没有"
#       两个都是本轮真出过的错，且都**不会**被 ⑦ 的计数断言拦下。
_YF_PPT_SHAPES = {
     4: (   0.0, 238.1,   0.0, 271.9, 'red'),
    11: ( 294.1, 316.4,   0.0, 201.8, 'red'),
    17: ( 419.8, 657.9,  38.4, 218.6, 'red'),
    18: ( 497.3, 563.6,  55.1, 218.5, 'bright'),
    27: ( 332.8, 414.0, 218.6, 272.0, 'bright'),
    10: ( 237.4, 271.0,   0.0, 272.0, 'glass'),
    13: ( 316.0, 419.3,   0.1, 200.0, 'glass'),
    29: ( 271.6, 332.7, 218.5, 234.0, 'glass'),
    30: ( 469.0, 657.8, 218.6, 256.0, 'glass'),
    31: ( 563.6, 657.9, 183.2, 218.5, 'glass'),
    12: ( 271.6, 419.3, 200.0, 218.6, 'block'),
    14: ( 237.4, 271.6, -27.2,   0.0, 'block'),
    15: ( 237.4, 316.0, -45.8, -27.2, 'block'),
    16: ( 469.0, 480.7, 219.0, 256.5, 'block'),
    19: ( 505.3, 552.0,  11.3,  38.4, 'block'),
    22: ( 508.8, 520.5, 218.5, 256.0, 'block'),
    23: ( 553.8, 565.5, 219.2, 256.7, 'block'),
    25: ( 598.8, 610.5, 219.2, 256.7, 'block'),
    26: ( 646.2, 657.9, 219.2, 256.7, 'block'),
}
_yf_ppt_tally = {}
for _v in _YF_PPT_SHAPES.values():
    _yf_ppt_tally[_v[4]] = _yf_ppt_tally.get(_v[4], 0) + 1
assert _yf_ppt_tally == {'red': 3, 'bright': 2, 'glass': 5, 'block': 9}, \
    '对账表自己坏了（%s）—— 应为 red 3 / bright 2 / glass 5 / block 9（用户口径：深灰玻璃 5 个区域、' \
    '鲜红实墙 2 块、浅灰建筑块 9 个）。改了这张表就等于把判据改掉了' % _yf_ppt_tally
# 63 段的表比形状自己的 bbox 略宽（表是从**渲染连通块**量的，连通块含描边/棱线）
_YF_TOL = 4.5


def _yf_rect_list(body):
    """把 `[[x0,x1,row0,row1], ...]` 全抓成浮点四元组（负号 / 小数 / 空白都吃得下）。"""
    return [tuple(float(v) for v in m.groups()) for m in re.finditer(
        r'\[\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*,\s*'
        r'(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\]', body)]


def _yf_inside(inner, outer):
    return (inner[0] >= outer[0] - _YF_TOL and inner[1] <= outer[1] + _YF_TOL and
            inner[2] >= outer[2] - _YF_TOL and inner[3] <= outer[3] + _YF_TOL)


def _yf_pair(rects, cls, code_table, want_n):
    """双向对账：每个 code 矩形都要被**同类** ppt 形状包住；每个同类 ppt 形状都要**收到**一块。

    单向不够：只查"code ⊂ ppt"漏得掉多余块，只查"ppt ⊇ code"漏得掉放错位置。"""
    assert len(rects) == want_n, \
        '%s 是 %d 块，对账表说应是 %d（见 build.py ⑫）' % (code_table, len(rects), want_n)
    owned = set()
    for r in rects:
        hit = [k for k, v in _YF_PPT_SHAPES.items() if v[4] == cls and _yf_inside(r, v[:4])]
        if not hit:
            near = [(k, _YF_PPT_SHAPES[k][4]) for k in _YF_PPT_SHAPES
                    if _yf_inside(r, _YF_PPT_SHAPES[k][:4])]
            raise AssertionError(
                '%s 的 [%s] 不被 ppt 任何 %s 形状包住 —— %s。'
                '这正是"把浅灰块当成玻璃"那类错的形态：**数得对、位置错**，'
                '四套自动验收与计数断言全绿。逐形状对账：`python _build/_pptshapes.py 6`'
                % (code_table, ', '.join('%.1f' % v for v in r), cls,
                   ('它落在类别 %s 的形状 %s 里' % ([c for _, c in near], [k for k, _ in near]))
                   if near else 'ppt 第 6 页那个位置上什么都没有'))
        owned |= set(hit)
    lost = [k for k, v in _YF_PPT_SHAPES.items() if v[4] == cls and k not in owned]
    assert not lost, \
        'ppt 第 6 页的 %s 形状 %s 在 %s 里**一块都没有** —— 那一整块立面在画面上缺失，' \
        '而条目数与矩形数的断言照样过（本轮就是这么漏掉 id=31 右翼底层横带的）' \
        % (cls, lost, code_table)


_yf_pair(_yf_rect_list(_re_yf_glass.group(1)), 'glass', 'YF_GLASSES', 8)
_yf_pair(_yf_rect_list(_re_yf_blocks.group(1)), 'block', 'YF_BLOCKS', 9)
_yf_pair(_yf_rect_list(re.search(r'const YF_REDS = \[(.*?)\n\];', _yfcode, re.S).group(1)),
         'red', 'YF_REDS', 3)
_yf_pair(_yf_rect_list(re.search(r'const YF_BRIGHTS = \[(.*?)\n\];', _yfcode, re.S).group(1)),
         'bright', 'YF_BRIGHTS', 2)

# ⑬ 竖牌那一列**整列通高留空**（用户 2026-09-19：「字体下边不要有窗户」）。
#    ⚠️ 这一组是 ⑨⑩⑪ 都挡不住的那类错：**窗阵和标牌是两段独立的代码**，把标牌缩小、
#       或把窗阵的 step 改了 0.1，两者就会重新叠在一起 —— 而 ⑨（尺寸同源）、⑩（中心≠左缘）、
#       ⑪（整面重绘）**全部照过**，四套验收也全绿。只有把窗阵的列位**在这里重算一遍**、
#       再与标牌带子求交，才拦得住。判据只从 63 段自己的常数出发（不引 _yffont.py）：
#       n / step 的算法与 §5.13.5 的窗阵**逐字相同**，任何一边改了数这里就红。
_re_win_geom = re.search(
    r'const YF_WIN_W = ([\d.]+), YF_WIN_H = ([\d.]+), YF_COL_GAP = ([\d.]+), YF_WIN_MARGIN = ([\d.]+);',
    _yfcode)
assert _re_win_geom, '63 段找不到 YF_WIN_W/YF_WIN_H/YF_COL_GAP/YF_WIN_MARGIN 的定义行'
_ww, _wh, _gap, _mar = (float(v) for v in _re_win_geom.groups())
_re_vgeom = re.search(r'const YF_V_CX = ([\d.]+), YF_V_Y = ([\d.]+), YF_V_PITCH = ([\d.]+);', _yfcode)
_re_vw = re.search(r'^const YF_V_W = (\d+);', _yfcode, re.M)
_re_vpad = re.search(r'^const YF_V_PAD = (\d+);', _yfcode, re.M)
assert _re_vgeom and _re_vw and _re_vpad, '63 段找不到 YF_V_CX/YF_V_Y/YF_V_PITCH 或 YF_V_W/YF_V_PAD'
_v_cx, _v_y, _v_pitch = (float(v) for v in _re_vgeom.groups())
_v_w, _v_pad = float(_re_vw.group(1)), float(_re_vpad.group(1))
# ① 尺寸口径：用户「缩小到原来的一半」⇒ 字宽 = _yffont.py 的 V_W、字距也是原来的一半。
assert _v_w == _fv_w, \
    'YF_V_W = %g，_yffont.py 的 V_W = %d —— 竖牌声明宽与点阵宽脱钩（字会被横向拉伸）' % (_v_w, _fv_w)
assert abs(_v_pitch - 13.3) < 1e-9, \
    'YF_V_PITCH = %g，应是 13.3 —— 用户「缩小到原来的一半」：26.6 / 2。' \
    '字距不跟着减半、字就会在垂直方向叠成一坨（26.6 的间距配 13 高的字）' % _v_pitch
assert _v_pitch >= _fv_h, \
    'YF_V_PITCH = %g 小于点阵高 %d —— 五个字会互相重叠' % (_v_pitch, _fv_h)
# ② 重算竖牌带子，必须落在右翼那块深红墙上（否则"留空"留在了没有窗的地方）。
_band = (_v_cx - _v_w / 2 - _v_pad, _v_cx + _v_w / 2 + _v_pad)
_reds = _yf_rect_list(re.search(r'const YF_REDS = \[(.*?)\n\];', _yfcode, re.S).group(1))
_brights = _yf_rect_list(re.search(r'const YF_BRIGHTS = \[(.*?)\n\];', _yfcode, re.S).group(1))
_wing = [r for r in _reds if r[0] <= _v_cx <= r[1]]
assert len(_wing) == 1, '竖牌中心 %g 落在 %d 块深红墙上，应恰在右翼一块内' % (_v_cx, len(_wing))
_wing = _wing[0]
# ③ 逐窗重算（算法与 §5.13.5 相同）：把**真会画出来**的窗列出来，再与带子求交。
_yf_cols_all, _yf_cols_drawn = [], []
_n = max(1, int((_wing[1] - _wing[0] - _mar * 2 + _gap) // (_ww + _gap)))
_step = ((_wing[1] - _wing[0]) - _mar * 2 - _n * _ww) / (_n - 1 if _n > 1 else 1)
for _i in range(_n):
    _wx = _wing[0] + _mar + _i * (_ww + _step)
    _yf_cols_all.append(_wx)
    if _wx + _ww > _band[0] and _wx < _band[1]:
        continue                                    # = inSignBand()，整列排除
    if any(_wx + _ww > q[0] - 3 and _wx < q[1] + 3 for q in _brights):
        continue                                    # = 鲜红实墙板，与带子无关但同属"画不出来"
    _yf_cols_drawn.append(_wx)
_hit_band = [x for x in _yf_cols_drawn if x + _ww > _band[0] and x < _band[1]]
assert not _hit_band, \
    '竖牌带 %s..%s 里还有 %d 列窗在画（x = %s）—— 用户要求"字体下边不要有窗户"。' \
    '窗阵的 n/step 与 YF_V_BAND 已经对不上了（step 一改列位就整体平移）' % (
        '%.1f' % _band[0], '%.1f' % _band[1], len(_hit_band), ', '.join('%.1f' % x for x in _hit_band))
_killed = [x for x in _yf_cols_all if x + _ww > _band[0] and x < _band[1]]
assert len(_killed) == 1, \
    '竖牌带吃掉了 %d 列窗（x = %s），预期恰好 1 列 —— 0 列说明这个断言在**空转**' \
    '（带子落在两列之间的缝里，什么都没清、但断言照样绿）；>1 列说明余量 YF_V_PAD=%g 太大、' \
    '把邻列也吃掉了，右翼最右端的留白会宽得不自然' % (
        len(_killed), ', '.join('%.1f' % x for x in _killed), _v_pad)
# ④ 留白里要**装得下**这块竖牌、且左右都还有墙：左边最近的存活列、右边最近的存活列。
_left = [x + _ww for x in _yf_cols_drawn if x + _ww <= _band[0]]
_right = [x for x in _yf_cols_drawn if x >= _band[1]]
assert _left and _right, '竖牌左侧或右侧一列存活的窗都不剩 —— 那条墙被清成了光头'
_blank = (max(_left), min(_right))
assert _blank[1] - _blank[0] > _v_w + 4, \
    '留白只有 %.1f 宽，竖牌本身 %g 宽 —— 字会顶到窗上，等于没留' % (
        _blank[1] - _blank[0], _v_w)
assert _blank[0] <= _v_cx - _v_w / 2 + 1 and _v_cx + _v_w / 2 <= _blank[1] + 1, \
    '竖牌 %g..%g 没有被留白 %g..%g 包住 —— 字有一半压在窗列上' % (
        _v_cx - _v_w / 2, _v_cx + _v_w / 2, _blank[0], _blank[1])

# --- 机械工程楼契约（parts/65_jixie.js §5.14，2026-09-27） ---
#   用户当天两条：「机械工程楼已经在 ppt 中给了你完整的正面图，需要指明的是蓝色代表
#   玻璃，主楼玻璃有个特点是在柱子后边，被柱子遮挡了，黑色代表门。主楼的机械工程楼
#   几个字是金色楷体。进行完整复刻」+「你可以不用读照片字体，直接用楷体字」。
#   ⚠️ 与 55/58/59/61/62/63 六栋**做法不同**：那六栋是"人读图 → 手写一支笔画出来"，
#   65 段是**数据驱动的直搬**（54 个形状全是轴对齐矩形 + 1 个三角，且遮挡关系恰好
#   就是 ppt 的 z 序）。所以这里钉的不是"画得像不像"，而是**表本身对不对**。
#   表来源（**pptx 一改就得重跑、重贴**）：`python _build/_jxslide.py` → `_look/jx_table.txt`。
#   ⚠️ 本段最贵的一条是 **`id=11` 的双向翻车**（两版各错一次，写在这里免得再犯第三遍）：
#     · v1 照 XML 的 `rot=16200000`（270°）**折算**成轴对齐框 ⇒ 得到一道"满宽横梁"
#       （x 246..745pt / y 82..101pt），正面图上**根本没有**这道梁；
#     · 实测（`_look/ppt_s7.png` 逐行扫）它未旋转的字面框处有两条**竖向**描边、
#       从 y=0 通到 y≈909，而折算出的那对横边**一根像素都没有** ⇒ PowerPoint **没转它**。
#     · 真身 = 竖在 id9(6.2632) 与 id8(7.2271) 之间的**第 9 根柱**（把 0.964in 空档
#       切成 0.489+0.475），作者复制柱子时忘改长度（字面高 6.925in）才捅到画布外。
#   ⇒ `_jxslide.py` 现在 **x/w 用 id11 自己的、y/h 借邻柱 id8**，断言钉住前提
#     （rot 是 90 的奇数倍 / 字面宽 == 柱宽 / 字面高 > 柱长），外框并集**不含任何旋转折算**。
#   ⚠️ 同一件事还有第二面：**颜色也不许照 XML 折算**。照 `lumMod` 折出来的
#     `#c65f10`/`#bfbfbf`/`#d9d9d9` 在导出图上 **0 像素**，真色只有 5 个（见下面 ⑧）。
_jx = part('65_jixie.js')
_jxcode = _strip_js(_jx)
# ① 层数必须与 styleOf 那一行**同源**（同 62/63 段）：层数一变 wallH 就变，本段按
#    画布高反推出的 roofT/eaveY 是同一根链条，两处脱钩立面会画到屋面上去。
_re_jx_style = re.search(r'/\^机械楼\$/[^\n]*?return \{[^}]*floors: (\d+)[^}]*\}', _ca)
_re_jx_floors = re.search(r'const JX_FLOORS = (\d+);', _jxcode)
assert _re_jx_style, ("60 段 styleOf 里没有 `/^机械楼$/` 那条 —— 机械楼会落到最后的兜底档 "
                      "`{ p: 4, floors: 3 }`；65 段按 3 层反推 eaveY 恰好也成立，"
                      "所以这条一丢**不会报错**，只会让将来换档位时静默画歪")
assert _re_jx_floors, '65 段没有 JX_FLOORS —— eaveY = PADT + roofT 反推不出檐口行'
assert _re_jx_style.group(1) == _re_jx_floors.group(1), \
    'styleOf 的 floors(%s) 与 65 段 JX_FLOORS(%s) 不一致 —— 立面会画歪到屋面或半空中' % (
        _re_jx_style.group(1), _re_jx_floors.group(1))
# ② 逐形状表：**要素齐、计数对**。54 = 用户正面图的全部形状，少一个就少一块立面。
_re_jx_body = re.search(r'const JX_EL = \[(.*?)\n\];', _jxcode, re.S)
assert _re_jx_body, '65 段找不到 JX_EL 表'
_jx_rows = re.findall(r"\['(\w)',\s*(-?\d+\.\d+),\s*(-?\d+\.\d+),\s*(-?\d+\.\d+),\s*(-?\d+\.\d+)\]",
                      _re_jx_body.group(1))
assert len(_jx_rows) == 54, \
    'JX_EL 只有 %d 个形状，ppt 第 7 页有 54 个（重跑 _build/_jxslide.py 再重贴）' % len(_jx_rows)
_jx_tally = {}
for _r in _jx_rows:
    _jx_tally[_r[0]] = _jx_tally.get(_r[0], 0) + 1
assert _jx_tally == {'b': 5, 'c': 9, 'd': 2, 'g': 32, 'n': 1, 't': 1, 'w': 4}, \
    ('JX_EL 的类计数 %s 与 ppt 第 7 页对不上（应为 b5/c9/d2/g32/n1/t1/w4）—— '
     '改了表就等于把用户正面图的判据改掉了' % _jx_tally)
# ③ **第 9 根柱的指纹**（见上面那段注释：两版各错一次的那个件）。真身三条同时成立：
#    ① 它在 x 上**正好插在 id9(4.2410) 与 id8(5.2049) 中间**（中点 4.7299 与两支的
#       中点 4.7230 / 4.8629 ... 用"把 0.964in 空档切成 0.489+0.475"判）；
#    ② 它的 x/w 是**自己的**（4.7299 / 0.2639），
#    ③ 它的 y/h 是**借 id8 的**（0.0465 / 4.3958，不是那截失控的 6.9250）。
#    ⚠️ 照 XML 折算会得到 `['c', 1.3993, 0.0000, 6.9250, 0.2639]`（满宽横梁）——
#       这里**故意不写那个值**，免得下次又有人把它当"应该的样子"贴回来。
assert "['c',  4.7299,  0.0465,  0.2639,  4.3958]" in _jx, \
    '第 9 根柱（ppt id=11，字面 rot=270 但其实没转）不在表里 —— ' \
    '_jxslide.py 的 id11 处理被改回去了？照 XML 折算会画出一道正面图上没有的满宽横梁'
assert '6.9250,  0.2639' not in _jxcode, \
    '出现了一条"宽 6.9250 / 高 0.2639"的横梁 —— 那是 id=11 照 XML rot=270 折算出来的' \
    '假件，正面图上没有这道梁（见 65 段文件头坑 ①）'
# ④ **用户点名的那条遮挡关系**：主楼玻璃（idx7~15，x≈2.95）必须在"压在它上面"的那根
#    柱子（id10，x=3.2771）**之前**落到表里 —— 逐块按表序画，遮挡关系就靠这个顺序。
#    ⚠️ 这条是本段唯一"用户点名"的观感，而它**不是**靠画法保证的，是靠表序保证的 ⇒
#       必须钉在表上，不能只钉在渲染结果上（五套自动验收都不看画面）。
_i_glass = max(i for i, r in enumerate(_jx_rows)
               if r[0] == 'g' and r[1].startswith('2.9'))
_i_col = min(i for i, r in enumerate(_jx_rows)
             if r[0] == 'c' and r[1] == '3.2771')
assert _i_glass < _i_col, \
    ('IDX 顺序反了：压在主楼玻璃上的那根柱子（x=3.2771）排在最后一块玻璃（x=2.9x）**之前** '
     '—— 逐块落地时柱子会先画、玻璃糊在柱子上，"玻璃在柱子后边"当场反掉')
# ⑤ 楼名带矩形必须与 5.14.3 的 JX_BAND 是**同一个数**（字体闸按它算带高）。
_re_jx_band = re.search(r'const JX_BAND = \{ x: ([\d.]+), y: ([\d.]+), w: ([\d.]+), h: ([\d.]+) \}',
                        _jxcode)
assert _re_jx_band, '65 段找不到 JX_BAND'
assert [float(v) for v in _re_jx_band.groups()] == [2.4097, 3.5701, 5.7924, 0.3632], \
    'JX_BAND 与 ppt id=24 楼名带的实测值对不上（2.4097 / 3.5701 / 5.7924 / 0.3632）'
_r_jx_nrow = [r for r in _jx_rows if r[0] == 'n']
assert len(_r_jx_nrow) == 1 and [float(v) for v in _r_jx_nrow[0][1:]] == \
    [2.4097, 3.5701, 5.7924, 0.3632], \
    'JX_EL 里的楼名带与 JX_BAND 不是同一块 —— 字体闸算的带高就不是黑字实际落的那块'
# ⑥ 金字：五字、逐字尺寸与点阵字节数自洽、字高与 JX_GLYPH_R 闸同源。
_re_jx_chars = re.search(r'const JX_CHARS = \[(.*?)\n\];', _jxcode, re.S)
assert _re_jx_chars, '65 段找不到 JX_CHARS 生成块'
# ⚠️ 本段的点阵是**命名常量**（`[JX_MASK_JI, 9, 8]`，同 61 段的 KX_CHARS），
#    不是 63 段那种内联字符串 ⇒ 抓法不一样，照抄 63 段的正则会一个都抓不到。
_jx_crows = re.findall(r'JX_MASK_(\w+),\s*(\d+),\s*(\d+)', _re_jx_chars.group(1))
assert [r[0] for r in _jx_crows] == ['JI', 'XIE', 'GONG', 'CHENG', 'LOU'], \
    'JX_CHARS 的顺序/名字不是 机 械 工 程 楼 —— 金字会排错字序'
_jx_dims = [(int(w), int(h)) for _, w, h in _jx_crows]
#    b64 字节数 = ceil(w*h/8)：改了 THS 却忘了重跑 _jxfont.py，这里第一个响
for _id, (_w, _h) in zip([r[0] for r in _jx_crows], _jx_dims):
    _m = re.search(r'const JX_MASK_%s = "([^"]*)"' % _id, _jxcode)
    assert _m, '%s 的 b64 不见了' % _id
    _need = -(-_w * _h // 8)
    assert len(_m.group(1)) == 4 * ((_need + 2) // 3), \
        ('%s 是 %sx%s，应占 %d 字节（b64 %d 字符），实测 b64 %d 字符 —— '
         '改了 THS 没重跑 _build/_jxfont.py？'
         % (_id, _w, _h, _need, 4 * ((_need + 2) // 3), len(_m.group(1))))
_jx_fontsrc = open(os.path.join(HERE, '_jxfont.py'), encoding='utf-8').read()
_re_jx_ths = re.search(r'^THS = \[([\d,\s]+)\]', _jx_fontsrc, re.M)
_re_jx_gr = re.search(r'const JX_GLYPH_R = ([\d.]+);', _jxcode)
assert _re_jx_ths and _re_jx_gr, '_jxfont.py 里找不到 THS，或 65 段没有 JX_GLYPH_R'
_jx_ths = [int(v) for v in _re_jx_ths.group(1).split(',') if v.strip()]
assert _jx_ths == [h for _, h in _jx_dims], \
    ('_jxfont.py 的 THS %s 与 65 段 JX_CHARS 的字高 %s 不一致 —— '
     '字体闸（JX_GLYPH_R）比的是后者，两处脱钩闸就白设了'
     % (_jx_ths, [h for _, h in _jx_dims]))
#    字体闸本身：字高 ∈ JX_GLYPH_R × 带高 ± 1（带高 = U(JX_BAND.h) = round(0.3632 × sc)）
#    ⚠️ 0.88 = 8 / 9.08，与 `_jxfont.py` 的 THS=8 同源；**正面图自己的比值是 0.4302**
#       （字实测 30×30px @192dpi = 0.15625in ⇒ 3.91 行），照它做出来是 4×4 的一团、
#       连字都不成（`_jxfont.py probe` 第一段留了证据），两处要一起改。
assert abs(float(_re_jx_gr.group(1)) - 0.88) < 1e-9, \
    'JX_GLYPH_R 不是 0.88 —— 这个数是 probe 定稿的（正面图 0.4302 太糊，见 65 段文件头）'

# ⑧ **颜色闸（第 21 轮新增，这个坑栽过一次；第 22 轮改成"允许一处点名偏离"）**：
#    `JX_C` 的五个主色必须逐条等于 `_jxslide.py` **采样**出来的 `JX_PAL`，
#    **楼体色**是唯一例外 —— 用户第二轮点名「楼的颜色给红色一点」，取值 `JX_RED`。
#    例外不能是"想改就改"的白条：这里**现算 HSL**，证明 `JX_RED` 三色与采样楼体色
#    **饱和/明度相同、只有色相从 26.6° 挪到 13°**。改幅度可以，改"性质"（顺手调亮、
#    换个完全不同的色）当场响。另外**照 XML 折算的那三个僵尸色一个都不许出现**。
#    v1 的整套立面用的是 `#c65f10`/`#bfbfbf`/`#d9d9d9` + 金字 —— 那是照 `schemeClr lumMod`
#    折出来的，导出图上 **0 像素**；而**三套自动验收都不看画面**，所以只有这条闸拦得住。
_re_jx_pal = re.search(r'const JX_PAL = \{([^}]*)\}', _jxcode, re.S)
assert _re_jx_pal, '65 段找不到 JX_PAL（类 → 实测色）'
_jx_pal = dict(re.findall(r'(\w):\s*"(#\w{6})"', _re_jx_pal.group(1)))
assert _jx_pal == {'b': '#ee822f', 'c': '#ffffff', 'd': '#000000', 'g': '#4874cb',
                   'n': '#ffc000', 't': '#ee822f', 'w': '#ffffff'}, \
    ('JX_PAL 与 _look/jx_table.txt 的实测色对不上：%s —— 重跑 _build/_jxslide.py' % _jx_pal)
#    五个主色（**不含 BODY**）：键名 → 类。`BAND` 对应类 n、`DOOR` 对应 d、
#    `COL`/`WHITE` 都是 c/w 的白。
for _key, _k in (('COL', 'c'), ('GLASS', 'g'), ('BAND', 'n'), ('DOOR', 'd'), ('WHITE', 'w')):
    _m = re.search(r'\b%s:\s*"(#\w{6})"' % _key, _jxcode)
    assert _m, '65 段 JX_C 里没有 %s' % _key
    assert _m.group(1) == _jx_pal[_k], \
        ('JX_C.%s = %s，但导出图上类 %s 的实测色是 %s —— '
         '照 XML 折算会得到 #c65f10/#bfbfbf/#d9d9d9 那套假色' % (_key, _m.group(1), _k, _jx_pal[_k]))
#    BODY：**用户点名偏红**的那一处。判据不是"等于某个我挑的数"，而是三条**性质**：
#      · 色相 13°±3（采样色是 26.07°，用户口径是"再红一点"）；
#      · 饱和度与采样色相同（±0.02）—— "偏红"只许动色相，不许顺手加艳；
#      · `lit` 必须比 base **亮** 0.03~0.12、`dark` 必须比 base **暗** 0.08~0.20
#        （采样色当年那两档的偏移量是 +0.078 / −0.147）—— 顺手把亮暗档反过来、
#        或让三档挤在一起，当场响。
import colorsys as _cs
_hls = lambda h: _cs.rgb_to_hls(*[int(h[i:i + 2], 16) / 255.0 for i in (1, 3, 5)])
_bh, _bl, _bs = _hls(_jx_pal['b'])
_re_red = re.search(r'const JX_RED = \{ base: "(#\w{6})", lit: "(#\w{6})", dark: "(#\w{6})" \}',
                    _jxcode)
assert _re_red, '65 段找不到 JX_RED（楼体偏红的那三个色，见 65 段 §5.14.2）'
_jx_red = dict(zip(('base', 'lit', 'dark'), _re_red.groups()))
for _name, _hex in _jx_red.items():
    _h, _l, _s = _hls(_hex)
    assert abs(_h * 360 - 13) < 3, \
        ('JX_RED.%s = %s 的色相是 %.1f°，不是用户口径的 13°±3 —— '
         '"偏红一点"被改成了换色' % (_name, _hex, _h * 360))
    assert abs(_s - _bs) < 0.02, \
        ('JX_RED.%s 的饱和度 %.3f 与采样楼体色 %s 的 %.3f 不同 —— '
         '这处偏离只许动色相' % (_name, _s, _jx_pal['b'], _bs))
assert abs(_hls(_jx_red['base'])[1] - _bl) < 0.01, \
    'JX_RED.base 的明度与采样楼体色不同 —— 偏离只许动色相'
assert 0.03 < _hls(_jx_red['lit'])[1] - _bl < 0.12, \
    'JX_RED.lit 不是"比楼体亮一档"（采样色那档亮 0.078）—— 受光边会看不出来'
assert 0.08 < _bl - _hls(_jx_red['dark'])[1] < 0.20, \
    'JX_RED.dark 不是"比楼体暗一档"（采样色那档暗 0.147）—— 背光边会看不出来'
for _key, _slot in (('BODY', 'JX_RED.base'), ('BODY_L', 'JX_RED.lit'), ('BODY_D', 'JX_RED.dark')):
    _m = re.search(r'\b%s:\s*(JX_RED\.\w+)' % _key, _jxcode)
    assert _m, 'JX_C.%s 不是从 JX_RED 取的 —— 那这处偏离就没有单一出处了' % _key
    assert _m.group(1) == _slot, \
        'JX_C.%s 取的是 %s，应当是 %s —— 三档串了位' % (_key, _m.group(1), _slot)
for _dead in ('#c65f10', '#bfbfbf', '#d9d9d9'):
    assert _dead not in _jxcode, \
        '%s 出现在 65 段里 —— 这个色在 ppt 导出图上 0 像素（是 XML lumMod 折算的假色）' % _dead
#    楼名带的墨色：正面图是**黑字压金底**。用户口头说「金色楷体」，两者不能同时成立，
#    本段取正面图（红线 3）。下面钉住"取的是正面图"，免得被谁当成写错静默改回去。
assert re.search(r'const JX_INK = \{ L: "#000000", M: "#000000", D: "#000000" \}', _jxcode), \
    'JX_INK 不是平涂黑 —— 正面图实测是金底(#ffc000)黑字；要改成用户口径的「金字」' \
    '必须同时把带底换深，否则金字压金底等于看不见（见 65 段 §5.14.2）'

# ⑨ **柱阵正则化（第 24 轮新增）+ 柱间玻璃层（第 22 轮新增；第 23 轮换"等宽·居中"）**：
#    ① 用户第二轮说 ppt 那条玻璃"只是一个例子"，「其他柱子底下也是蓝色窗户」；
#    ② 第三轮看到成品说「注意柱子之间的间隔要合理，不能看起来很不均匀」
#       ⇒ 排法改成「每格一扇、宽度全一样、居中、放不下的空档不放」；
#    ③ 第四轮（2026-09-27）说「柱子之间这次给我严格等距。请完全对照我的ppt进行修改，
#       不允许一丝不同，不管是窗户还是柱子」。实测 **ppt 自己柱距就不等**
#       （1.010/0.870/0.964/**0.490**/**0.474**/0.885/0.885/0.891 in，中间三根挤在一起），
#       两句话不能同时成立 —— 当场把三种改法渲染给用户看，用户选了
#       **「剔掉那根手误白条、其余 8 根严格等距」** ⇒ 新增 §5.14.5a 的柱阵正则化。
#    `jxPiers` / `jxGlaze` 全是**外推 / 判据**，坐标一个都不许另写，所以钉五件事：
#    ① 玻璃层**必须排在每一根柱子之前** —— 否则"玻璃在柱子后边"当场反掉，而三套自动
#       验收都不看画面（这是本段唯一"用户点名"的观感，第 21 轮就栽在这上面过一次）；
#    ② 它选的"例子"确实就是 ppt 那条玻璃（把 JS 的判据在 Python 里**重算一遍**）；
#    ③ **柱阵只许来自 `jxPiers`**，且剔柱判据**不许写死坐标**
#       （下面把整条规则在 Python 里独立重算：中位空档、被两边挤住的那 1 根、
#        剩 8 根、间距恰好 23 整像素、像素落列**完全等距**、每格余量一模一样）；
#    ④ 窗宽**只许**是"示例两条可见条的平均"、落位**只许**是"等宽居中 + 放不下就不放"，
#       且示例那两格**不再豁免**（第四轮起示例宽板本身不画，7 格全铺同款窗）；
#    ⑤ 坐标不许另写一份（窗的位置只能来自 `JX_EL` 的柱与例子）。
_JX_SC = 268.0 / 10.7146        # 精灵的 px/in = footprint 宽 ÷ 外框宽（与 65 段的 sc 同源）
assert 'function jxExample()' in _jxcode and 'function jxPiers(G)' in _jxcode \
    and 'function jxPierMap(G)' in _jxcode, \
    '65 段缺 jxExample / jxPiers / jxPierMap —— 柱阵正则化那一层没了'
assert 'function jxGlaze(g, G, rng, PM)' in _jxcode, '65 段没有 jxGlaze —— 柱间玻璃整层没了'
_i_glz = _jxcode.index('jxGlaze(g, G, rng, PM);')
_i_body = _jxcode.index('jxBlk(g, r, e[0], rng);')
assert _i_body < _i_glz < _jxcode.index('contactBand(g, G.x0'), \
    '柱间玻璃不是在主体落地之后、接地带之前落的笔 —— 画面上会缺一层或压错序'
assert 'if (i === 0) jxGlaze(g, G, rng, PM);' in _jxcode, \
    '柱间玻璃不是挂在 `i === 0`（主体那一格）上 —— 落笔时机一挪，遮挡关系就看运气了'
assert "['b',  1.3993,  0.2465,  6.9250,  4.2049]" in _jx, \
    'JX_EL[0] 不是主楼主体（ppt id4）—— 玻璃层挂错了那一格'
assert 'EX.indexOf(e) >= 0) continue;' in _jxcode and 'if (!p) continue;' in _jxcode, \
    ('jxFront 没有"示例宽板跳过不画 / 手误柱整根不画"这两条 —— 第四轮的口径漏了一条：'
     '示例宽板照画会把那两格变回"宽板 + 中柱"，手误柱照画会把 0.2250 那格再挤回来')
#    把 JS 的"例子"判据在 Python 里重算：最宽的那族 g、且中心在主体框内。
_jx_gw = max(float(r[3]) for r in _jx_rows if r[0] == 'g')
_bx0, _bw = float(_jx_rows[0][1]), float(_jx_rows[0][3])    # 主体框，从表里现取
_jx_ex = [r for r in _jx_rows if r[0] == 'g' and abs(float(r[3]) - _jx_gw) < 1e-9
          and _bx0 < float(r[1]) + float(r[3]) / 2 < _bx0 + _bw]
assert len(_jx_ex) == 9 and all(abs(float(r[1]) - 2.95) < 0.06 for r in _jx_ex), \
    ('柱间玻璃选的"例子"不是 ppt idx7~15 那 9 块（选出 %d 块：%s）—— '
     '窗宽比例会跟着漂' % (len(_jx_ex), [r[1] for r in _jx_ex]))
_jx_glz = _jxcode.split('function jxGlaze')[1].split('function jxFront')[0]
assert 'ratio' not in _jx_glz, \
    'jxGlaze 又在按"空档比例"缩窗宽 —— 窄空档会缩成 3px 细条（用户 2026-09-27 第三轮退回）'
assert 'for (const c of ref) W += c.got;' in _jx_glz and 'W /= ref.length;' in _jx_glz, \
    '窗宽不是"示例两条可见条的平均" —— 取最大/最小或写死数，窗宽就不再等于示例同款'
assert 'c.got > 0) continue' not in _jx_glz, \
    ('jxGlaze 又豁免了示例那两格 —— 第四轮起示例宽板本身不画，7 格必须全铺同款窗，'
     '否则那两格与其余五格宽度不同，整排又一格一个样')
assert '(c.s1 - c.s0 - W) * G.sc < 3' in _jx_glz, \
    '放不下那一格的判据没了、或丢了 `* G.sc` —— 空档是英寸、门槛是像素（第 22 轮就栽在这）'
assert not re.search(r'\b\d+\.\d{3,}', _jx_glz), \
    'jxGlaze 里出现了硬写的带小数坐标 —— 窗的位置只能从 JX_EL 现算（坑 18：派生量不许存第二份）'
#    ── ③ 柱阵正则化：整条规则在 Python 里独立重算一遍 ────────────────────────
_jx_psb = _jxcode.split('function jxPiers')[1].split('function jxPierMap')[0]
assert not re.search(r'\b\d+\.\d{3,}', _jx_psb), \
    ('jxPiers 里出现了硬写的带小数坐标 —— 剔哪根柱、跨度多少只能从 JX_EL 现算'
     '（否则用户改 ppt 之后这里会与表脱钩）')
_px_c = sorted([r for r in _jx_rows if r[0] == 'c'], key=lambda r: float(r[1]))
assert len(_px_c) == 9, '主楼柱不是 9 根（%d）—— jxPiers 的前提变了' % len(_px_c)
_gaps = [float(_b[1]) - (float(_a[1]) + float(_a[3])) for _a, _b in zip(_px_c, _px_c[1:])]
assert all(abs(g - x) < 1e-3 for g, x in
           zip(_gaps, [0.7444, 0.6056, 0.7000, 0.2250, 0.2111, 0.6222, 0.6222, 0.6222])), \
    ('柱间**净空**不是实测那 8 个数（%s）—— ppt 那一页被改过，重读 _jxslide.py'
     % ['%.4f' % g for g in _gaps])
_med = sorted(_gaps)[len(_gaps) // 2]
assert abs(_med - 0.6222) < 1e-3, '中位空档重算成 %.4f（预期 0.6222）' % _med
_dud = [_r for _i, _r in enumerate(_px_c)
        if _i > 0 and _i + 1 < len(_px_c) and _gaps[_i - 1] < _med * 0.5 and _gaps[_i] < _med * 0.5]
assert len(_dud) == 1 and abs(float(_dud[0][1]) - 4.7299) < 1e-3, \
    ('"左右两个空档都不到中位空档一半"的柱不是恰好那 1 根 ppt id11（x=4.7299）'
     '—— 算出 %d 根：%s' % (len(_dud), [r[1] for r in _dud]))
_keep = [_r for _r in _px_c if _r not in _dud]
assert len(_keep) == 8, '剔完手误柱不是 8 根（%d）' % len(_keep)
_pw0, _px0 = float(_keep[0][3]), float(_keep[0][1])
_px1 = float(_keep[-1][1]) + float(_keep[-1][3])
assert all(abs(float(r[3]) - _pw0) < 1e-9 for r in _keep), \
    '这 8 根柱不同宽 —— jxPiers 只取首柱宽，先把它钉回同宽'
_ppx = round((_px1 - _px0 - _pw0) * _JX_SC / (len(_keep) - 1))
assert _ppx == 23, \
    ('柱间距重算成 %d 整像素（预期 23）—— 等距的"整像素"那一步漂了' % _ppx)
_jx_px = [_px0 + i * _ppx / _JX_SC for i in range(len(_keep))]
_cols = [round(v * _JX_SC) for v in _jx_px]
assert _cols == [_cols[0] + _ppx * i for i in range(len(_keep))], \
    '8 根柱的**像素落列**不是严格等距（%s）—— 英寸上等距、像素上会 23/24 交替' % _cols
#    ── ④ 窗：示例跨哪两格、可见条多宽、窗宽 W、7 格是否一模一样 ──────────────
_ex0 = min(float(r[1]) for r in _jx_ex)
_ex1 = max(float(r[1]) + float(r[3]) for r in _jx_ex)
_cells = []
for _a, _b in zip(_jx_px, _jx_px[1:]):          # ← 用**正则化后**的柱阵算空档
    _s0, _s1 = _a + _pw0, _b
    _cells.append((_s0, _s1, max(0.0, min(_s1, _ex1) - max(_s0, _ex0))))
assert len(_cells) == 7, '空档不是 7 个（%d）—— 剔柱之后应当是 8 根柱 7 个空档' % len(_cells)
_ref = [c for c in _cells if c[2] > 0]
assert len(_ref) == 2, \
    '示例没有正好跨在**两格**空档上（重算得 %d 格）—— jxGlaze 的前提变了' % len(_ref)
_jx_W = sum(c[2] for c in _ref) / len(_ref)
assert abs(_jx_W - 0.3632) < 2e-3, \
    ('窗宽重算成 %.4f，与 65 段注释里的 0.3632 不符（示例的可见条被改过了？）' % _jx_W)
_put = [c for c in _cells if (c[1] - c[0] - _jx_W) * _JX_SC >= 3]
assert len(_put) == 7, \
    ('该放窗的空档重算成 %d 个（第四轮起预期 **7**：8 根等距柱之间每格都是 16 像素、'
     '窗 10 像素，7 格全放得下）—— 窗的落位判据漂了' % len(_put))
_pwpx = round((_px0 + _pw0) * _JX_SC) - round(_px0 * _JX_SC)      # 柱宽（像素）
assert _pwpx == 7, '柱宽重算成 %d 像素（预期 7）—— 空档 = 23 − 柱宽 就是这一步' % _pwpx
_win, _marg = [], []
for _i in range(len(_jx_px) - 1):               # 与 jxGlaze 同一套算法：英寸定心、落笔取整
    _l = _jx_px[_i] + _pw0                      # 本格左沿 = 柱右沿
    _r = _jx_px[_i + 1]                         # 本格右沿 = 下一根柱左沿
    _c = (_l + _r) / 2.0
    _a = round((_c - _jx_W / 2) * _JX_SC)
    _b = round((_c + _jx_W / 2) * _JX_SC)
    _win.append(_b - _a)
    _marg.append((_a - round(_l * _JX_SC), round(_r * _JX_SC) - _b))
assert len(set(_win)) == 1 and _win[0] >= 9, \
    ('7 扇窗的像素宽不一致（%s）—— "看起来严格等距"就毁在这' % _win)
assert len(set(_marg)) == 1, \
    ('7 扇窗在各自空档里的余量不一致（%s）—— 7 格必须逐像素同款，'
     '"严格等距"就是这一条' % _marg)
assert abs(_marg[0][0] - _marg[0][1]) <= 1, \
    ('窗在空档里偏了 %s —— 居中的意思是两侧白边相等（空档 16、窗 9，'
     '余 7 是奇数，逐像素只能差 1）' % (_marg[0],))
# ⑦ 不碰共享 RNG / 不存第二份 PALETTE / 接线在三处（同 62/63 段那一组）
assert 'bSeed' not in _jxcode and 'Math.random' not in _jxcode, \
    '65 段碰了 bSeed 或 Math.random —— 会重掷全校园散射（60 段 §6.6 那颗地雷）'
assert 'makeRng(6517)' in _jxcode, \
    '65 段的墙面颗粒没用局部 makeRng(6517) —— 共享流一被碰就重掷全校园散射'
assert 'PALETTE' not in _jxcode, \
    '65 段自己存了一份 PALETTE（TDZ：PALETTE 只能在函数体里读）—— 58 段栽过，整页 JS 死'
assert 'else if (name === "机械楼") jixieRestyle(b, pal);' in _ca, \
    '60 段的 restyle 链里没有机械楼那一行 —— 65 段整段是死代码'
assert _ca.index('jixieRestyle(b, pal)') < _ca.index('addProp(Object.assign({}, b, { x: ax, y: ay,'), \
    'jixieRestyle 排在 addProp **之后** —— addProp 取的是 s.canvas，晚一步挂进 props 的还是旧精灵'
#    世界落地线与碰撞盒：65 段**不动** b.y、**不动** addSolid（文件头声明过）⇒
#    ppt 轮廓/硬地/散射流一个数不动的保证就落在"这两样没被写进 65 段"上。
assert 'addSolid' not in _jxcode and 'R.y + R.h' not in _jxcode, \
    '65 段动了世界落地线或碰撞盒 —— 那会改 CAMPUS 轮廓并重掷散射，本段只许换画布'
assert 'b.ay = G.baseY;' in _jxcode, \
    '65 段的锚点不是 G.baseY —— 只换画布时锚点必须落在新画布的接地行上，否则整栋浮起/入地'

# --- ⑩ 机械楼屋面：全灰 + 左沿收到最左白柱（第 25 轮新增，parts/65_jixie.js ②b 段）---
# 用户 2026-09-27 第二十五轮（逐字）：「机械工程楼楼顶应该是灰色的，并且屋顶矩形左边界
# 应该和主楼（也就是最靠左的白色柱子）左边界保持一致」。
# 这一段的实现是**逐像素改画布**（clearRect 裁出檐 + getImageData 去饱和 + 补新左沿），
# 三套自动验收一个数都查不出来 —— 只能钉在源码上。
#   ① 左沿必须是**现算**的：`JX_PADX + round(jxPiers(G)[0].x · sc)`。
#      判据是"算式在"，不是"= 61"：柱阵一挪（第 24 轮刚挪过），61 就成了错的常量。
assert 'const pierX = JX_PADX + Math.round(jxPiers(G)[0].x * G.sc);' in _jxcode, \
    '屋面左沿不是由最左柱的 x 现算的 —— 写死一个数会在柱阵挪位后静默错位'
assert re.search(r'(?m)^\s*const \w+ = JX_PADX \+ Math\.round\(jxPiers\(G\)\[0\]\.x \* G\.sc\);', _jxcode), \
    '屋面左沿的算式被改了（必须取 jxPiers(G) 的第 0 根、不能用 [1] 或排序后的另一根）'
#   ② 两个 `+ 1` 是**测出来的**，不是凑的：屋面最底那两行是檐口投影线（占 PADT+roofT−1
#      与 PADT+roofT 两行），少这 1 行就会在檐口上留一条橙色；而 getImageData 只取到
#      `G.y0 + 1` 是为了**不吃到屋面以下**的楼体橙（第 195 行起是 JX_RED 的立面本身）。
#      ⇒ 这两处"多 1"任何一处被"顺手改成 roofT / y0"，都会静默留下橙色残渣。
assert 'ng.clearRect(0, JX_PADT, pierX, G.roofT + 1);' in _jxcode, \
    '屋面左裁的高度必须是 G.roofT + 1 —— 檐口投影线占 PADT+roofT−1 与 PADT+roofT 两行，' \
    '少 1 行就在檐口上留一条橙色'
assert 'ng.getImageData(0, 0, c.width, G.y0 + 1)' in _jxcode, \
    '去饱和的范围必须是 0..G.y0（= y0 + 1 行）—— 取到 y0 以下会把楼体橙色一起洗掉'
#   ③ 去饱和必须是**亮度式**且 R=G=B（不是配色覆盖：屋面有 15 层叠加，配色盖不住）
assert 'Math.round(_rd[i] * 0.299 + _rd[i + 1] * 0.587 + _rd[i + 2] * 0.114)' in _jxcode \
    and '_rd[i] = _rd[i + 1] = _rd[i + 2] = L;' in _jxcode, \
    '屋面去饱和的算式被改了（必须按亮度 R=G=B，且 alpha=0 的像素跳过）'
assert 'if (_rd[i + 3] === 0) continue;' in _jxcode, \
    '去饱和少了"透明像素跳过"那道闸 —— 出檐外那一片会被填成黑（alpha 也一起改）'
assert 'ng.putImageData(_ri, 0, 0);' in _jxcode, \
    '去饱和的结果没写回画布（getImageData/putImageData 是一对，少一半等于没做）'
#   ④ 新左沿的补笔：1px 檐口（暗）+ 2px 板面内侧（亮）—— 与整条屋面的受光方向一致
assert 'px(ng, pierX, JX_PADT, 1, G.roofT, shade(_gray, -0.34));' in _jxcode \
    and 'px(ng, pierX + 1, JX_PADT + 2, 2, G.roofT - 5, shade(_gray, 0.14));' in _jxcode \
    and 'const _gray = "#6d6d6d";' in _jxcode, \
    '新左沿的三笔（暗檐口 / 亮板面 / 中性灰常量）被改了 —— 少一笔左沿就断成锯齿'
#   ⑤ 屋面色必须是**中性灰**，而且那个灰 = 机械楼屋面色的**亮度**
#      （去饱和 = 色相压掉、亮度一格不动）。109 不是挑的：
#      `PALETTE[4].roof`（机械楼走 styleOf 的兜底分支 `{ p: 4 }`）的亮度是 108.945。
#      ⚠️ 这条挡住"换成一个好看的灰" —— 深一档/浅一档都会让屋面与檐口投影线断开。
_m_pal = re.search(r'const PALETTE = \[(.*?)\n\];', part('60_assemble.js'), re.S)
assert _m_pal, '60 段找不到 PALETTE 数组（写法变了？）'
_pal_roofs = re.findall(r'roof:\s*"(#\w{6})"', _m_pal.group(1))
assert len(_pal_roofs) >= 5, 'PALETTE 的 roof 色没解析出来（%d 个）' % len(_pal_roofs)
_roof4 = _pal_roofs[4]
_L4 = round(0.299 * int(_roof4[1:3], 16) + 0.587 * int(_roof4[3:5], 16)
            + 0.114 * int(_roof4[5:7], 16))
assert _L4 == 109, \
    '机械楼屋面色 %s 的亮度是 %d（不是 109）—— 65 段的 _gray = #6d6d6d 是按 109 定的' \
    % (_roof4, _L4)
assert re.search(r'const _gray = "#%02x%02x%02x";' % (_L4, _L4, _L4), _jxcode), \
    '新左沿的灰色常量不是 %02x%02x%02x（R=G=B=屋面亮度）—— 屋面就与左沿对不上色' \
    % (_L4, _L4, _L4)
#   ⑥ 这一段的顺序：裁/去饱和必须在**换画布、搬完下半段之后**，否则改的是旧画布
assert _jxcode.index('ng.clearRect(0, JX_PADT, pierX,') \
       > _jxcode.index('ng.drawImage(c, 0, 0'), \
    '屋面改色排在"把旧画布搬进新画布"之前 —— 改的还是那张马上被丢掉的旧画布'
#   ⑦ ⚠️ 作用域闸：去饱和必须在 `jixieRestyle` **里面**（只对机械楼那一张 sprite）。
#      挪到顶层（或改成对整张画布/整幅地图处理）就是对全校动手 —— 画面里只是"颜色不对"，
#      而四套自动验收一个数都不变。⑥ 已经把"必须在 drawImage 之后"钉住了。
assert _jxcode.index('function jixieRestyle(b, pal) {') \
       < _jxcode.index('const _ri = ng.getImageData(0, 0, c.width, G.y0 + 1)'), \
    '屋面去饱和没在 jixieRestyle 里（挪到顶层 = 对整张画布/全校动手）'

# --- ⑩b 图书馆南侧那一列宿舍（第 25 轮新增，parts/66_dormlib.js §5.15）---
# 用户口径（逐字）：「我们画图书馆下边的三栋楼，图书馆下边理论上是有三个宿舍的，现在
# 只有两个。不过我们可以给第三个腾地方。这些宿舍楼都是只有两层，第一层有防盗窗，窗户
# 是中间白色十字，并且上下都有棕色带。记得给窗户加空调外机。每个宿舍楼外墙都是那种
# 白色方块瓷砖」；两次追问的选择：「不不不，那个宿舍就是这么宽，我们只能把上面的两个
# 改成三个，我觉得通过降低楼层之后 z 可以解决」＋「只改图书馆下边这一列」。
# 立论落在**层数**上：那一列 4 行里，中间那栋被南邻整栋压死、一个像素不剩
# （精灵顶 1877 vs 1878），降到两层才露出来 —— 用户的判断是对的。
# 第 26 轮（用户逐字）：「说几个问题，第一，这些宿舍没这么长，第二楼体中间没有门
# （可能把门去掉之后长度就不是很长了）。楼上边的宿舍几个字也去掉」＋「对了楼顶还是白色的」；
# 追问"缩多短"时三个候选（2/3 / 1/2 / 先不缩）里选的是「缩到 2/3」。
# ⇒ 本轮四类判据：**缩掉的那一截到底有没有缩**（Python 独立重算窄宽与窗数）、
#   **通道有没有被顺手改掉**（roof / noDoor / 碰撞盒走占位宽）、**门与台阶是不是真没了**、
#   **牌子是不是真擦了**（30 段挂在檐口之上，重铺墙擦不到它）。四套自动验收同样查不出来。
# 这一段的判据（命中集 / 层数 / 随机流 / 画没画 / 缩与撤）四套自动验收一个数都查不出来。
_dl  = part('66_dormlib.js')
_dlc = _strip_js(_dl)
# ⚠️ 上面的常量那一排**是对齐过的**（等号前好多个空格）⇒ 凡是查常量文本的判据一律吃
#    这个"折叠空白"后的副本，否则改一次对齐就会假失败 —— 而假失败的下场是那条断言被人删掉。
_dln = re.sub(r'[ \t]+', ' ', _dl)
# ⑩b-1 ⭐ 命中集必须**恰好是那一列 4 行**，而且是 Python 这边**独立重算**的
#      （不读 66 段的 DL_COL_X0/X1 —— 判据与被判对象同源就等于没判）。
#      判据 = 名字恰是「宿舍」+ 占位 x ∈ (7.40, 7.52)：西侧七栋（x ≤ 3.1125）、
#      16/18 号楼（7.7958 / 7.8861）都不许被吸进来。**多一行 = 多一栋楼被降层**，
#      而那栋楼在 5 公里外本来就看不出高矮，验收全绿。
_camp = re.findall(
    r'(?m)^\s*\["([^"]+)",\s*"([^"]+)",\s*(-?[\d.]+),\s*(-?[\d.]+),\s*([\d.]+),\s*([\d.]+)\],',
    part('20_ground.js'))
assert len(_camp) > 20, '20_ground.js 的 CAMPUS 行没解析出来（写法变了？）'
_dlh = [r for r in _camp if r[1] == 'bld' and r[0] == '宿舍'
        and 7.40 < float(r[2]) < 7.52]
assert len(_dlh) == 4, \
    ('dormLibPick 的命中集不是那一列 4 行（Python 独立重算得 %d 行）—— ' % len(_dlh)) + \
    '多一行/少一行都会让别的楼被降层、或这一列漏改，而四套自动验收全绿'
assert len(set(r[3] for r in _dlh)) == 4, \
    '那一列 4 行的占位 y 应当互不相同（自南向北 4.5486 / 4.9229 / 5.2674 / 5.7222）'
#      ⚠️ 中间那一行是本轮**改名**来的（ppt 上写「红果园餐厅」，_pptshapes 第 1 页 idx19）
#         —— 一处**必须向用户报备的偏离**。这条断言防的是"半吊子撤回"：
#         只把名字改回餐厅、没改这里的 4 ⇒ 那一列只剩 3 栋，而画面里只是"中间空一格"。
assert any(abs(float(r[3]) - 4.9229) < 1e-4 for r in _dlh), \
    '那一列第三行（ppt 的「红果园餐厅」）不在命中集里 —— 本轮按用户口径把它改名成「宿舍」；' \
    '若撤回改名，这条 4 行断言与 20_ground.js 第 51 行那段报备注释要一起改'
# ⑩b-2 层数与"覆盖必须比重绘靠前"：
assert 'const DL_FLOORS = 2;' in _dln, \
    'DL_FLOORS 不是 2 —— 用户明说「这些宿舍楼都是只有两层」'
assert 'const dlPick = dormLibPick(e);\n  if (dlPick) st.floors = DL_FLOORS;' in _ca, \
    '60 段没把 DL_FLOORS 覆盖进 st.floors（层数是数据；在 66 段里另开一套 6 层分支' \
    '会与 30 段的 wallH / 画布高打架）'
assert _ca.index('if (dlPick) st.floors = DL_FLOORS;') \
       < _ca.index('const b = makeBuilding({'), \
    '层数覆盖排在 makeBuilding **之后** —— 画布高还是 6 层那份，与 66 段反推的 eaveY 错位'
assert _ca.index('else if (dlPick) dormLibRestyle(b, name);') \
       < _ca.index('addProp(Object.assign({}, b, { x: ax, y: ay,'), \
    'dormLibRestyle 排在 addProp **之后** —— 换的那张画布已经进 props 了，屏幕上啥都不变'
# ⑩b-3 随机流（散射种子地雷的正面对照）：只许用**自己的** makeRng
assert 'bSeed' not in _dlc and 'Math.random' not in _dlc, \
    '66 段碰了 bSeed / Math.random —— 会重掷全校园散射（唯一探针是 _propdiff.py）'
assert 'rngS(' not in _dlc, '66 段碰了 scatter 的随机流 rngS'
assert _dlc.count('makeRng(') >= 2, \
    '66 段的瓷砖微色差与空调外机必须**各用一条**自带 makeRng —— 共用一条会把顺序耦合进画面'
assert 'b.ay =' not in _dlc and 'addSolid' not in _dlc, \
    '66 段改了 b.ay 或加了碰撞盒 —— 本段只许在同一张画布上重绘（层数走 60 段的 st.floors）'
# ⑩b-4 立面四要素各钉一条（少一个都是"看着没跑"，而四套自动验收全绿）
#      （常量一律查 `_dln` = 折叠空白后的副本，见文件上方那行注释）
for _need in ('function dormLibPick(e)', 'function dormLibRestyle(b, name)',
              'const DL_BANDS = [[3, 4, 5, 6], [27, 28, 29, 30]];',
              'const DL_TILE = "#e9e7e0";', 'const DL_BAND = "#8d6a4a";',
              'const DL_FRAME = "#f7f7f3";', 'const DL_WIN_H = 20;',
              'const DL_AC_W = 11, DL_AC_H = 8;',
              'const DL_W_RATIO = 2 / 3;',
              'const DL_ROOF = "#d9d9d9";'):
    assert _need in _dln, '66 段契约缺失: ' + _need
#      ① 窗与防盗窗各是**函数**（画了才算），白十字必须画在 winAt 里
assert 'const winAt = (wx, wy) => {' in _dl and 'const cageAt = (wx, wy) => {' in _dl \
       and 'winAt(wx, wy);' in _dl and 'cageAt(wx, wy);' in _dl, \
    '窗/防盗窗定义了没调用 —— 那一列会是一片白瓷砖墙（第一版 dxSign 就是这么空的）'
assert 'px(g, cx, wy, 2, DL_WIN_H, DL_FRAME);' in _dl \
       and 'px(g, wx, cyy, DL_WIN_W, 2, DL_FRAME);' in _dl, \
    '窗心的白色十字（一竖一横，各 2px）没了 —— 用户点名「窗户是中间白色十字」'
#      ② 防盗窗**只在首层**：二层也装就是全村都装笼子
assert 'if (f === DL_FLOORS - 1) cageAt(wx, wy);' in _dlc, \
    '防盗窗的"只在首层"条件被改成无条件调用 —— 用户说的是「第一层有防盗窗」'
#      ③ 上下两条棕带：**第一版只画了窗上那条**，已返工一次 —— 钉死"是一对"
assert 'DL_BANDS' in _dlc and _dlc.count('for (const band of DL_BANDS)') == 1, \
    '上/下棕色带必须由 DL_BANDS 两条一循环画出来（第一版只画了窗上那条）'
#      ④ 空调外机：必须有"三成不装"的闸（全装 = 一排铁盒子）
assert 'if (skip < 0.30) continue;' in _dlc, \
    '空调外机的"三成不装"闸没了 —— 每扇窗都挂会读成一排铁盒子'
#      ⑤ 第 26 轮「楼体中间没有门」：门 / 雨篷 / 台阶 / **门占位**四件套一件都不许剩。
#         30 段那套是靠 `noDoor` 整块跳过的（60 段把 dlPick 行一起判进去），本段第 25 轮
#         "逐字照抄 30 段 §3.7"的那一份必须跟着删 —— 它是**盖在** 30 段旧台阶上的，
#         留着就剩一座没有门的台阶（而四套自动验收全绿）。
for _gone in ('dcenter', 'DL_DW_MAX', 'DL_DH', 'DL_CAN_UP', 'w * 0.18'):
    assert _gone not in _dlc, \
        ('66 段还留着门的构件 `%s` —— 用户第 26 轮「楼体中间没有门」；' % _gone) + \
        '这一段只剩窗/防盗窗/棕带/空调四样，门连**门占位**一起撤（占位不撤首层空一列窗）'
#      ⑥ 第 26 轮「楼上边的宿舍几个字也去掉」：牌子挂在**檐口之上**（signRect:
#         y = eaveY − 8 − h），而本段是"重铺墙带"，擦不到它 ⇒ 必须单独擦一次。
#         判据取 61/65 段同一套（makeSign 填 _signCache + signRect 定位 + clearRect 擦）。
assert 'const sgn = makeSign(name);' in _dlc and 'signRect(sgn, x0, bw, eaveY)' in _dlc, \
    '屋名牌的擦除块没了（makeSign/signRect）—— 30 段的牌子在檐口以上，重铺墙擦不到，' \
    '用户会看见屋顶上还挂着四个「宿舍」'
assert 'g.clearRect(px0, py0, pw, ph);' in _dlc, \
    '屋名牌只定位没擦 —— 牌子仍在屋面上（第 61 段 dxSign 的原始版本就是只定位不擦）'
assert _dlc.index('const sgn = makeSign(name);') < _dlc.index('px(g, x0, eaveY + 2, bw, wh - 2, DL_TILE);'), \
    '撤牌子排在"重铺墙带"之后 —— 擦的是新墙不是旧牌（牌在屋面，顺序上无碰撞，但先撤后铺才是"擦完即封口"）'
#      ⑦ 檐下阴影画在棕带**之后**：画在前头会被棕带盖掉（最上一层顶上那条灰）
assert _dlc.index('for (const band of DL_BANDS)') \
       < _dlc.index('rgba(14,18,28,\" + (0.26'), \
    '檐下阴影排在棕带之前 —— 会被棕带与瓷砖盖掉，最上一层看不到檐影'
# --- ⑩b-5 第 26 轮：缩宽 / 白楼顶 / 无门 / 撤牌子（parts\66_dormlib.js §九）---
# ⑩b-5.1 ⭐ **缩掉的那一截到底缩了没有 —— Python 这边独立重算**
#   判据不读 66 段的 DL_W_RATIO，只用：CAMPUS 的英寸 + 10_const 的 U + 30 段的窗列公式。
#   U 与 WIN_W/WIN_GAP 都是**全局布局常量**（不是本轮被判的对象），从 part 里现取，
#   免得把 390.5911/16/12 三个数写死在 build.py 里、日后改了比例表这条闸反而"假过"。
_mu = re.search(r'const U\s*=\s*(\d+)\s*/\s*([\d.]+);', part('10_const.js'))
assert _mu, '10_const.js 的 `const U = 450 / 1.1521;` 写法变了'
_U = float(_mu.group(1)) / float(_mu.group(2))
_b30 = part('30_building.js')
_mw  = re.search(r'const WIN_W\s*=\s*(\d+)\s*,\s*WIN_H\s*=\s*\d+\s*,\s*WIN_GAP\s*=\s*(\d+)\s*;', _b30)
assert _mw, '30_building.js 的 `WIN_W/WIN_H/WIN_GAP` 写法变了'
_ww, _wg = float(_mw.group(1)), float(_mw.group(2))
_mm = re.search(r'const margin\s*=\s*(\d+)\s*;', _b30)
assert _mm, '30_building.js §3.5 的 `const margin = 22;` 写法变了'
_wm = float(_mm.group(1))
assert abs(_U - 390.5911) < 0.01, '10_const.js 的英寸→像素比例变了（%.4f）' % _U
def _dlcols(_bw):      # 30 段 §3.5 的窗列公式：cols = max(1, floor((bw − 2·margin + WIN_GAP) / (WIN_W + WIN_GAP)))
    return max(1, int((_bw - _wm * 2 + _wg) // (_ww + _wg)))
_ratio = 2.0 / 3.0
_dlwant = []           # (英寸, 缩前宽, 缩后宽, 缩前窗数, 缩后窗数)
for _r in _dlh:
    _wi  = float(_r[4])                        # 占位宽（英寸）
    _b0  = int(round(_wi * _U))                # = makeBuilding 的 `w: round(o.w)`，缩前
    _b1  = int(round(_wi * _U * _ratio))       # = 60 段 `Math.round(R.w * DL_W_RATIO)`，缩后
    _dlwant.append((_wi, _b0, _b1, _dlcols(_b0), _dlcols(_b1)))
#   满幅三栋：524 → 349，17 扇/层 → 11 扇/层；半幅那栋：258 → 172，8 → 5
assert [x[3] for x in _dlwant] == [17, 17, 17, 8], \
    '缩之前的窗数不是 17/17/17/8（实测 %r）—— 说明比例表或窗列公式动了，' \
    '那么"缩到 2/3 ⇒ 11 扇"这句话就无处落地' % ([x[3] for x in _dlwant],)
assert [x[4] for x in _dlwant] == [11, 11, 11, 5], \
    '缩到 2/3 之后的窗数不是 11/11/11/5（实测 %r）—— "缩短"没缩到位或缩过头' % ([x[4] for x in _dlwant],)
assert {x[1] for x in _dlwant[:3]} == {524} and _dlwant[3][1] == 258, \
    '缩之前的楼体宽不是 524/524/524/258（实测 %r）' % ([(x[1], x[2]) for x in _dlwant],)
assert {x[2] for x in _dlwant[:3]} == {349} and _dlwant[3][2] == 172, \
    '缩之后的楼体宽不是 349/349/349/172（实测 %r）' % ([(x[1], x[2]) for x in _dlwant],)
#   半幅那栋缩完仍**恰好是**满幅那三栋的一半（第 25 轮用户「那个宿舍就是这么宽」的口径）：
#   0.6611 / 1.3403 = 0.4933 —— 四栋一起缩才能保住这个比例，只缩三栋就会把半幅比顶到 0.74。
assert abs(_dlwant[3][0] / _dlwant[0][0] - 0.4933) < 0.001, \
    '半幅那栋的占位比不是 0.4933 —— 四栋必须**一起**缩 2/3，否则比例失衡'
# ⑩b-5.2 缩宽走的是**数据**（传小的 w），不是 66 段事后裁像素：
assert 'const dlW = dlPick ? Math.round(R.w * DL_W_RATIO) : R.w;' in _ca, \
    '60 段没有把窄宽算出来传给 makeBuilding —— 在 66 段裁像素的话，30 段按旧宽铺的' \
    '屋面（板面/女儿墙/分坡脊/设备/檐口）与雨水管全部错位、还得在 66 段重画一遍'
assert 'w: dlW, depth: R.h, floors: st.floors' in _ca, 'makeBuilding 没吃到 dlW'
assert _ca.index('const dlW = dlPick') < _ca.index('const b = makeBuilding({'), \
    'dlW 算在 makeBuilding **之后** —— 传进去的还是旧宽'
# ⑩b-5.3 **白楼顶**：走 roof 入参（30 段的屋面是十几层 shade(roof,k) 叠出来的，换入参一次全中）
assert 'roof: dlPick ? DL_ROOF : pal.roof,' in _ca, \
    '60 段没有把 DL_ROOF 传进去（用户「对了楼顶还是白色的」）'
assert re.search(r'const DL_ROOF\s*=\s*"#d9d9d9";', _dl), \
    'DL_ROOF 不是 #d9d9d9 —— 它是 ppt 第 1 页那四行矩形**渲染出来的像素色**' \
    '（_pptshot.py 实测 (217,217,217)，与图书馆/逸夫楼同一档底），不是随便挑的白'
# ⑩b-5.4 **无门**：60 段必须把 dlPick 一起判进 noDoor（只删 66 段那份不够 —— 30 段自己也会画门）
assert 'noDoor: name === "16宿舍楼" || name === "逸夫楼" || dlPick,' in _ca, \
    'noDoor 没带上 dlPick —— 30 段那扇门（连雨篷、台阶、门占位）仍会画上屏'
# ⑩b-5.5 ⭐ **散射种子地雷的正面对照**：缩了 b.w 之后碰撞盒必须仍取**占位宽**。
#   `b.w` 变小 ⇒ 那句 `addSolid(ax, ay, b.w - 14, 34)` 会把碰撞盒一起缩，
#   可能放出被挡住的散射候选点 ⇒ **重掷全校园散射**（唯一探针 `_propdiff.py`，
#   而四套自动验收里没有一个数会变）。R.w 与缩之前的 b.w 同值：30 段 `w = round(o.w)`。
assert 'addSolid(ax, ay, (dlPick ? Math.round(R.w) : b.w) - 14, 34);' in _ca, \
    '碰撞盒那一行没守住"dlPick 行走占位宽" —— 会重掷全校园散射'
assert re.search(r'const w\s*=\s*Math\.round\(o\.w\)', _b30), \
    '30 段的 `const w = Math.round(o.w);` 变了 —— "R.w 与缩之前的 b.w 同值"这条等式是' \
    '上面那句 addSolid 的立论根据'
# ⑩b-5.6 撤牌子**必须真的重新画回屋面板面**（只 clearRect 会留一个透出地面的方洞）
assert 'shade(DL_ROOF, -0.04)' in _dlc, \
    '擦掉牌子之后没把 30 段"板面"那一层（shade(roof,-0.04)）补回去 —— 屋顶会留一个透明的方洞'
assert 'for (let j = 1; j <= 3; j++)' in _dlc, \
    '没有补回被擦断的三条分坡脊线（30 段 §3.2 那三行白色横线）—— 屋顶上会有一块没有脊线的疤'
#      ⚠️ 补丁的斑点**按周围密度**补（30 段是 `(w/3)` 白 + `(w/4)` 黑铺在 `w-8 × roofT-12` 上
#         ⇒ 白 0.68% / 黑 0.51%；补丁 63×35 ⇒ 白 15 / 黑 11）。钉死这两个数是因为
#         "给少了"的后果**正好是四套自动验收与肉眼 1× 都看不出来**：第一版白 6 / 黑 5，
#         实测深色点 5 个 vs 左右对照组 10 / 13 个 —— 那块屋顶比周围干净，是一块平滑矩形。
assert 'speckle(g, px0, py0, pw, ph, "rgba(255,255,255,0.05)", 15, makeRng(6618));' in _dlc \
   and 'speckle(g, px0, py0, pw, ph, "rgba(0,0,0,0.07)", 11, makeRng(6619));' in _dlc, \
    '补丁斑点没按周围密度给（白 15 / 黑 11）—— 给少了那块屋顶会比周围干净、读成一块平滑矩形'

# --- ⑩c 第九教学楼（第 27 轮新增，parts/67_j9.js §5.16）---
# 用户口径（逐字）：「接下来我们画第九教学楼，我首先把第九d教学楼的轮廓画出来到ppt中了，
# 你只需要一比一复刻。其中中间的黑色区域代表黑色玻璃，你需要画上玻璃并进行网格划分，
# 梯形是阶梯，蓝色是普通的玻璃，整个楼，除了中间的大门区域，外边都贴上了白色小方格瓷砖。
# 请注意有些图形的覆盖关系和各个图形的轮廓。此外插入的字体我给你图片了，位置也在ppt中。
# 注意九教高度是七层楼。」
# 这一页与第 21 轮（机械楼）那页有两处**结构差别**（`_j9slide.py` 文件头①②）：
#   ① 3 个 `custGeom` 任意多边形（金门廊 + 两翼）⇒ `J9_EL` 多一列 `pi`；
#   ② 1 个 TEXT_BOX（「字体插入位置」）⇒ 被排除在构件之外、单列成 `J9_TXT`，
#      楼名的字号就是从它反推的（`_j9font.py` 文件头④）。
# ⇒ 本轮六类判据：**构件表逐条与 ppt 一致**（少一条 = 少画一块，画面里只是"少了个东西"）、
#   **比例与"七层"读数**（Python 从表独立重算 sc/FH，再与 30 段反解出的画布高对上）、
#   **色表逐条等于 ppt 采样**、**楼名点阵的位序与总宽**、**随机流 / 换画布契约**、
#   **沿 z 序落笔 + 整幅砖底**。六套自动验收里没有一个数会变。
_j9tab_p = os.path.join(HERE, '_look', 'j9_table.txt')
assert os.path.exists(_j9tab_p), \
    '找不到 _look/j9_table.txt —— 先跑 `python _build/_j9slide.py`（第 27 轮的几何权威）'
_j9tab = io.open(_j9tab_p, encoding='utf-8').read()
_j9  = part('67_j9.js')
_j9c = _strip_js(_j9)
# ⚠️ `J9_C` / `J9_EL` 那几排是**对齐过的**（冒号与逗号前好多个空格）⇒ 凡查常量文本的
#    判据一律吃这个"折叠空白"后的副本，否则改一次对齐就假失败 —— 而假失败的下场是
#    那条断言被人删掉。
_j9n = re.sub(r'[ \t]+', ' ', _j9)
#   ⚠️ 这里的 `_j9c` 比别段的危急：楼名的点阵是 **base64**，里面真出现过 `//`
#      （`_strip_js` 不识字符串的那些年会把整行吃到行尾、**数据静默截断**，
#      而所有断言照过 —— 见 `_strip_js` 自己的文件头）。2026-09-19 已修，
#      下面 ⑩c-4 的"解出来必须正好 10 字 × 逐字宽 [7,6,7,6,5,5,7,6,5,7]"就是它的探针。
#
# ⑩c-1 ⭐ **`J9_EL` / `J9_PATH` / `J9_EW` 必须与 `_j9slide.py` 的输出逐条相等**
#      （判据与被判对象**不同源**：这里是拿 Python 重新解析那张表，再解析零件里的字面量）。
#      "一比一复刻"这句话的全部重量都在这条上：漏一块、坐标错一位，画面里只是
#      "好像少点什么"，而六套自动验收全绿。
def _j9rows(txt):
    return [(m[0], float(m[1]), float(m[2]), float(m[3]), float(m[4]), int(m[5]))
            for m in re.findall(
                r"\[\s*'(\w)',\s*(-?[\d.]+),\s*(-?[\d.]+),\s*(-?[\d.]+),\s*(-?[\d.]+),\s*(-?\d+)\s*\]",
                txt)]
def _j9paths(txt):
    # ⚠️ 一行一条多边形（`_j9slide.py` / 67 段都是这么排的）⇒ **按行**取 `[x, y]` 点对。
    #    不许写 `\[(.*?)\]\]`：那个正则的 `.*?` 会把最后一对点的 `]` 也吃进去，
    #    于是每条多边形都**少一个顶点**（金门廊 12 → 11），而"顶点数"正是楼名横梁
    #    反算与 П 形腿位的依据 —— 少一个顶点画面里只是"门的比例不太对"。
    blk = re.search(r'const J9_PATH = \[(.*?)\n\];', txt, re.S)
    assert blk, '找不到 J9_PATH 数组（写法变了？）'
    out = []
    for row in blk.group(1).split('\n'):
        pts = re.findall(r'\[(-?[\d.]+),\s*(-?[\d.]+)\]', row)
        if pts:
            out.append([(float(a), float(b)) for a, b in pts])
    return out
_el_tab, _el_js = _j9rows(_j9tab), _j9rows(_j9)
assert len(_el_tab) == 53, \
    'ppt 第 9 页的立面构件不是 53 条而是 %d 条 —— 用户改过图？重跑 _j9slide.py 再对一遍' \
    % len(_el_tab)
assert _el_js == _el_tab, \
    '67 段的 J9_EL 与 _j9slide.py 的输出对不上（表 %d 条 / 零件 %d 条，逐条比较见下）' \
    % (len(_el_tab), len(_el_js))
_path_tab, _path_js = _j9paths(_j9tab), _j9paths(_j9)
assert len(_path_tab) == 3, '多边形不是 3 个（`_j9slide.py` 文件头①的前提变了）'
assert _path_js == _path_tab, '67 段的 J9_PATH 与 _j9slide.py 的输出对不上'
assert len(_path_tab[0]) == 12, '金门廊（П 形）的顶点不是 12 个 —— 楼名横梁的反算会跟着错'
_m_ew = re.search(r'const J9_EW = ([\d.]+), J9_EH = ([\d.]+);', _j9tab)
assert _m_ew, '表里没有 J9_EW/J9_EH（写法变了？）'
assert _m_ew.groups() == ('10.7972', '3.6771'), \
    '表里的外框并集变了：%s x %s in（原为 10.7972 x 3.6771）' % _m_ew.groups()
assert 'const J9_EW = %s, J9_EH = %s;' % _m_ew.groups() in _j9, \
    '67 段的 J9_EW/J9_EH 与表里的对不上（表 = %s x %s）—— 立面比例 sc 就是从它来的' \
    % _m_ew.groups()
#      构件类计数与 idx 集合：**那一行 TEXT_BOX 必须不在表里**（它在 ppt 里是 idx2）——
#      哪天它被当成构件落了地，画面上会在楼体正中多出一块白方块（正是用户写"字体插入位置"
#      那四个字的地方），而所有断言照过。
_j9cls = {}
for _r in _el_tab:
    _j9cls[_r[0]] = _j9cls.get(_r[0], 0) + 1
assert _j9cls == {'d': 1, 'g': 40, 'k': 1, 'm': 1, 't': 1, 'w': 9}, \
    '构件类计数变了：%s（表头记的是 d=1 g=40 k=1 m=1 t=1 w=9）' % _j9cls
_j9src = re.findall(r'#\w{6}\s+idx(\d+)\s+id(\d+)', _j9tab)
assert len(_j9src) == 53, '表里带 idx/id 的行不是 53 条（%d）' % len(_j9src)
assert sorted(int(a) for a, _ in _j9src) == [i for i in range(54) if i != 2], \
    'idx 集合不是 0..53 去掉 2 —— 去掉的 2 正是那个 TEXT_BOX「字体插入位置」'
#
# ⑩c-2 ⭐ 比例与"七层楼"：**Python 从两处独立重算一遍**
#      (a) 立面比例：sc = footprint 宽 / J9_EW（与 61/65 段同法"宽锚现算"）
#      (b) 画布高：J9_PADB 必须 = 30 段画布公式的尾巴 SHY + 14，再反解出 roofT
#      (c) "七层"：**从 ppt 的窗行数独立数出来**（不是抄 67 段的注释）
_camp9 = [r for r in _camp if r[0] == '第九教学楼']
assert len(_camp9) == 1, 'CAMPUS 里「第九教学楼」不是恰好 1 行（%d）' % len(_camp9)
assert _camp9[0][1] == 'bld', '第九教学楼在 CAMPUS 里的 kind 不是 bld'
_U = eval(re.search(r'const U\s*=\s*([^;]+);', part('10_const.js')).group(1).strip(),
          {'__builtins__': {}}, {})
_SUN = re.search(r'const SUN = \{ x: (-?[\d.]+), y: (-?[\d.]+) \}', part('10_const.js'))
assert _SUN, '10_const.js 的 SUN 写法变了'
_SHX = round(-float(_SUN.group(1)) * 26)
_SHY = round(-float(_SUN.group(2)) * 26)
assert _SHX == 16 and _SHY == 21, \
    'SHX/SHY 变成 %d/%d（原为 16/21）—— 投影与画布高的尾巴都跟着变' % (_SHX, _SHY)
assert 'const J9_PADX = 26, J9_PADT = 18;' in _j9n, \
    'J9_PADX/J9_PADT 不是 26/18（30 段的 makeBuilding 里写死的就是这两个）'
assert 'const J9_PADB = 21 + 14;' in _j9n, \
    'J9_PADB 不是 `21 + 14`（= SHY + 14，30 段画布高公式的尾巴）—— 与上面 SHX/SHY 同一条链'
_J9_W = 450.0                                   # CAMPUS 的 1.1514 in × U ⇒ round 到 450
_depth = float(_camp9[0][5]) * _U               # R.h = zoneRect(e).h = IX(e[5])，无取整
_roofT30 = min(190, max(20, round(_depth * 0.60)))
_wallH9 = 4 * 34                                # J9_FLOORS(4) × FLOOR_H(34)
_H30 = 18 + _roofT30 + _wallH9 + _SHY + 14      # 30 段 `PADT + roofT + wallH + SHY + 14`
_sc9 = _J9_W / 10.7972
_FH9 = round(3.6771 * _sc9)
assert _FH9 == 153, '按宽锚现算出的立面高是 %d 行，不是 153 —— 表里的 J9_EW/EH 变过？' % _FH9
assert _H30 - 18 - _wallH9 - (21 + 14) == _roofT30, \
    '67 段那套反解（c.height − J9_PADT − J9_FLOORS·FLOOR_H − J9_PADB）解不出 30 段的 roofT'
assert 20 <= _roofT30 <= 190 and _roofT30 == 183, \
    '第九教学楼反解出的 roofT 是 %d（原为 183）—— 进深/层数/画布高有一处动过' % _roofT30
assert _FH9 != _wallH9 and _FH9 - _wallH9 == 17, \
    '立面高（153）不再比 30 段的 4 层墙（136）高 17 行 —— **换画布**这个动作的前提没了；' \
    '若两者相等，67 段那张新画布会退化成"原地重绘"，而多拷/少拷的行数是北移量的来源'
assert 'const J9_SHADOW_H = 24;' in _j9n and min(24, _depth * 0.3) == 24, \
    'J9_SHADOW_H 不是 min(24, depth·0.30)（进深 %d ⇒ 24）—— 与 30 段 §3.1 的投影带对不上' \
    % round(_depth)
#      ⭐ "七层楼"（用户原话）**必须能从 ppt 的窗行数数出来**，不许只写在注释里：
#      `g` 类 40 块里，24 块是两翼的"大窗"（0.7285 × 0.2451），按 y 归并成 6 排
#      （左右翼各差 0.0389 in，那是用户画的抖动，归并容差 0.05 in）；
#      另 4 块（y≈3.1764）落在底部那条基座带上，是**第 7 层**。
#      ⚠️ 剩下 12 条窄窗（0.2458 × 0.5278）在端柱/竖条上，y 落在每两排之间
#         ⇒ **它们不是楼层**，数进去会得到 10 —— 这条断言把这个坑钉住。
_main = [m for m in _el_tab if m[0] == 'g' and abs(m[3] - 0.7285) < 1e-6
         and abs(m[4] - 0.2451) < 1e-6 and abs(m[2] - 3.1764) > 0.05]
_base = [m for m in _el_tab if m[0] == 'g' and abs(m[2] - 3.1764) < 0.05]
assert len(_main) == 24, '两翼的大窗不是 24 块（%d = 两翼各 6 排 × 2 列）' % len(_main)
assert len(_base) == 4, '底部基座带上的窗不是 4 块（%d）—— "七层"的最后一层就是它' % len(_base)
_cl = []
for _y in sorted(set(round(m[2], 4) for m in _main)):     # 左右翼各差 0.0389 in，归并容差 0.05
    if _cl and _y - _cl[-1][-1] < 0.05:
        _cl[-1].append(_y)
    else:
        _cl.append([_y])
assert len(_cl) == 6 and all(len(c) == 2 for c in _cl), \
    '两翼的大窗归并成 %s 排（应为 6 排 × 左右各 1）—— 用户说九教是七层楼 ' \
    '⇒ 6 排大窗 + 1 排基座；⚠️ 那 12 条窄窗（0.2458×0.5278，落在端柱/竖条上、' \
    'y 卡在每两排之间）**不是楼层**，数进去会得到 10' % [len(c) for c in _cl]
assert len(_cl) + 1 == 7, '"七层楼"数不出来（独立重算得 %d）' % (len(_cl) + 1)
#      ⚠️ 而 `J9_FLOORS = 4`（**画面上几层**）与这个 7 是两件不同的事：`J9_FLOORS` 只用来
#         反解 30 段的 roofT（上面那条），屏幕上那七层完全由 ppt 这张立面决定。
#         它必须等于 `styleOf("第九教学楼").floors` —— 下面按**独立重放分支链**求出来
#         （不是读注释，也不读 67 段的注释）：将来有人在 `/教学楼/` 之前插一条新分支，
#         这条会先响。
_jso = re.search(r'function styleOf\(name\) \{(.*?)\n\}', _ass, re.S)
assert _jso, '60 段的 styleOf 没解析出来（写法变了？）'
_jbr = re.findall(r"if \((/[^/\n]+/[a-z]*)\.test\(name\)\)\s*return \{([^}]*)\};",
                  _strip_js(_jso.group(1)))
assert len(_jbr) >= 10, 'styleOf 的分支只解析出 %d 条（写法变了？）' % len(_jbr)
_pal9, _fl9 = None, None
for _pat, _ret in _jbr:
    if re.search(_pat[1:-1], '第九教学楼'):
        _m = re.search(r'p:\s*(\d+)', _ret)
        _mm = re.search(r'floors:\s*(\d+)', _ret)
        _pal9 = int(_m.group(1)) if _m else None
        _fl9 = int(_mm.group(1)) if _mm else None
        break
assert _fl9 == 4, \
    '独立重放 styleOf 分支链，「第九教学楼」落在 floors=%s 那一档（原为 4）—— ' \
    '`J9_FLOORS` 与 30 段的 wallH / 画布高是同一根链条，一头动另一头必须跟着动' % _fl9
assert _pal9 == 0, '「第九教学楼」的调色板档位不是 p:0（原为 0）—— pal.roof 换了，撤名牌后的板面会串色'
assert 'const J9_FLOORS = 4;' in _j9n, 'J9_FLOORS 不是 4（见上面那条）'
#
# ⑩c-3 色表：`J9_C` 的六个主色必须**逐条等于 ppt 的采样色**
#      （第 21 轮"照 XML 折算色"翻车的教训：颜色一律取渲染采样）
_jpal_tab = dict(re.findall(r'([a-z]): "(#\w{6})"',
                            re.search(r'const J9_PAL = \{(.*?)\};', _j9tab, re.S).group(1)))
assert _jpal_tab == {'d': '#595959', 'g': '#4874cb', 'k': '#404040',
                     'm': '#b58b02', 't': '#d9d9d9', 'w': '#d9d9d9'}, \
    '表里的 J9_PAL 变了：%s' % _jpal_tab
_jc = dict(re.findall(r'(\w+):\s*"(#\w{6})"',
                      re.search(r'const J9_C = \{(.*?)\n\};', _j9, re.S).group(1)))
for _key, _cls in (('TILE', 'w'), ('GLASS', 'g'), ('BLACK', 'k'),
                   ('DOOR', 'd'), ('BAND', 'm')):
    assert _jc.get(_key) == _jpal_tab[_cls], \
        'J9_C.%s = %s，与 ppt 采样的 %s(%s) 不等 —— 颜色一错，"复刻"就无从谈起' \
        % (_key, _jc.get(_key), _cls, _jpal_tab[_cls])
assert re.search(r"const J9_TILE_P = 6;", _j9n) and 'const DL_TILE_P  = 6;' in _dl, \
    'J9_TILE_P 与 66 段的 DL_TILE_P 必须同值（6）—— 两处读起来要像同一族白瓷砖'
assert re.search(r'const J9_K_BASE = \{ w: J9_C\.TILE, t: J9_C\.TILE, g: J9_C\.GLASS,',
                 _j9n) and 'k: J9_C.BLACK, d: J9_C.DOOR, m: J9_C.BAND };' in _j9n, \
    'J9_K_BASE 的类→色映射被改了 —— 它是"类 ⇄ ppt 色"的唯一对照表'
# --- ★ 抄来的屋面：67 段 §5.16.7a 是照 30 段 §2 **逐笔**重画的（第二十八轮）---
#     第 27 轮的教训（㉒ 抄色号要抄**整笔**）：那一轮只把"板面"一笔抄进补丁，以为抄对了，
#     而 30 段的板面其实是 `shade(roof, -0.04)`、**不是** `pal.roof` 本色 ⇒ 屋面上
#     117×34 的亮斑（板面 (103,121,135) 占 82%、本色 (108,127,140) 只占 11%），
#     加擦除边合计 1847 px，而 accept/verify/zoomtest/propdiff/sprhash 五套自动验收
#     **一个数都不变** —— 唯一探针是"新旧精灵逐像素比"。
#     这一条把 30 段 §2 那几笔**在这里逐行列出来**，并把 `shade(roof,` 换成 `shade(r,`
#     之后要求 67 段一行不差地出现：30 段改了色号（或改了落笔），这里立刻挂。
_j9roof = re.search(r'function j9Roof\(g, G, pal\) \{(.*?)\n\}', _j9, re.S)
assert _j9roof, '67 段的 j9Roof 没解析出来（写法变了？）'
_j9roof = _j9roof.group(1)
_roof9 = [
    'px(g, x0 - 3, PADT, w + 6, roofT, shade(roof, -0.34));',
    'px(g, x0, PADT + 2, w, roofT - 5, shade(roof, -0.04));',
    'px(g, x0, PADT + 2, w, 4, shade(roof, 0.26));',
    'px(g, x0, PADT + 6, w, 3, "rgba(14,18,28,0.34)");',
    'px(g, x0, PADT + 6, 4, roofT - 9, shade(roof, 0.14));',
    'px(g, x1 - 4, PADT + 6, 4, roofT - 9, "rgba(14,18,28,0.22)");',
    'px(g, x0 + 5, PADT + Math.round((roofT - 12) * j / 4) + 6, w - 10, 1, "rgba(255,255,255,0.08)");',
    'px(g, x0 - 3, PADT + roofT - 1, w + 6, 2, shade(roof, -0.60));',
]
for _ln in _roof9:
    assert _ln in _b30, \
        '30 段 §2 的屋面少了这一笔（67 段 §5.16.7a 是照它抄的）：%s' % _ln
    _x = _ln.replace('shade(roof,', 'shade(r,')
    assert _x in _j9roof, \
        '67 段的屋面和 30 段对不上了：缺 `%s` —— 屋面是**逐笔抄**来的，' \
        '改一边必须同步改另一边（第 27 轮抄错一笔色号 = 屋面上 1847 px 的疤，' \
        '五套自动验收全查不出）' % _x
#     屋面设备箱那五笔同样是抄的（落点公式在 67 段里另算：环上放不下就整块不要）
for _ln in ('px(g, bx + 4, by + 4, bw, bh, "rgba(14,18,28,0.30)");',
            'px(g, bx, by + bh - 4, bw, 4, shade(roof, -0.38));',
            'px(g, bx, by, bw, bh, shade(roof, 0.16));',
            'px(g, bx, by, bw, 3, shade(roof, 0.34));',
            'px(g, bx, by + bh - 1, bw, 1, "rgba(14,18,28,0.30)");'):
    assert _ln in _b30, '30 段 §2 的屋面设备箱少了这一笔：%s' % _ln
    assert _ln.replace('shade(roof,', 'shade(r,') in _j9, \
        '67 段的屋面设备箱和 30 段对不上了：缺 `%s`' % _ln.replace('shade(roof,', 'shade(r,')
#     杂点：**粒数照 30 段那两条现算**（(w/3)|0 与 (w/4)|0），只是换成本段自带的
#     局部 makeRng（碰共享流会重掷全校园散射）。⚠️ 粒数写死成别的值要在这里能查出来。
assert 'speckle(g, x0 + 4, PADT + 7, w - 8, roofT - 12, "rgba(255,255,255,0.05)", (w / 3) | 0, makeRng(6720));' in _j9n \
   and 'speckle(g, x0 + 4, PADT + 7, w - 8, roofT - 12, "rgba(0,0,0,0.07)", (w / 4) | 0, makeRng(6721));' in _j9n, \
    '67 段屋面的杂点不是按 30 段的密度（(w/3)|0 白 + (w/4)|0 黑）现算的，' \
    '或没用**自带的**局部 makeRng(6720)/(6721)'
#
# --- ★ 口字形天井（第二十八轮）：几何**在 Python 里独立重算** ------------------
#     尺寸不许只写在注释里。环宽 55（平面像素）⇒ 院子 340 × 194；画布行方向乘
#     30 段那个进深比例（`depth * 0.60` 那一笔，_roofT30 已经独立算过一遍）。
_jsr = lambda v: int(v + 0.5)                      # JS 的 Math.round（正数）
_ring9 = int(re.search(r'const J9_RING\s*=\s*(\d+);', _j9n).group(1))
_kz9   = float(re.search(r'const J9_KZ\s*=\s*([0-9.]+);', _j9n).group(1))
_cw9   = float(re.search(r'const J9_CWALL\s*=\s*([0-9.]+);', _j9n).group(1))
_bn9   = int(re.search(r'const J9_BOX_N\s*=\s*(\d+);', _j9n).group(1))
assert _ring9 == 55, 'J9_RING 不是 55（原为 55：一圈楼的进深）—— 环宽一改，院子大小就全变'
assert abs(_kz9 - 0.60) < 1e-9, \
    'J9_KZ = %s ≠ 0.60 —— 它必须是 30 段 `clamp(round(depth * 0.60), 20, 190)` ' \
    '里那个 0.60（屋面"进深 → 画布行"的比例），写别的数会让天井在纵向上被拉扁/拉长' % _kz9
assert 'clamp(Math.round(depth * 0.60), 20, 190)' in _b30, \
    '30 段那条进深比例（`depth * 0.60`）找不到了 —— 67 段的 J9_KZ 抄的就是它'
assert 2 * _ring9 < _J9_W and 2 * _jsr(_ring9 * _kz9) < _roofT30, \
    '环宽 %d 撑破了屋面（w=%d / roofT=%d）—— 左右或上下两条环会变成负数宽度' \
    % (_ring9, _J9_W, _roofT30)
_riy9   = _jsr(_ring9 * _kz9)                      # 上下各让出的行数
_hole_w = int(_J9_W) - 2 * _ring9
_hole_h = _roofT30 - 2 * _riy9
assert (_riy9, _hole_w, _hole_h) == (33, 340, 117), \
    '天井独立重算得 上下 %d 行 / 洞 %d×%d，应为 33 / 340×117 —— 与 5.16.7b 头注写的不一致' \
    % (_riy9, _hole_w, _hole_h)
#     用户第二十八轮「口字缺口不能很小，实际上九教中间的院落是相当大的」：
#     院子要占 footprint 的七成宽、六成深（面积近一半）—— 这条把"不能很小"钉住。
assert _hole_w / _J9_W > 0.70 and (_hole_h / _kz9) / _depth > 0.60, \
    '院子只有 footprint 的 %.0f%% 宽 × %.0f%% 深 —— 用户明说"中间的口字缺口不能很小"' \
    % (100 * _hole_w / _J9_W, 100 * (_hole_h / _kz9) / _depth)
#     里院那面墙（5.16.7b）：墙高 = 洞高 × J9_CWALL；窗的行**照搬外面立面自己的那六排**
#     （只取左翼 —— 右翼整体错开 0.0389 in），落不进墙高的不画。
_wh9 = _jsr(_hole_h * _cw9)
_winw9, _winh9 = _jsr(0.7285 * _sc9), _jsr(0.2451 * _sc9)
_pit9 = _jsr((2.5528 - 0.7611) * _sc9)
_mrg9 = _jsr(0.5174 * _sc9)
_rows9 = sorted(set(_jsr(m[2] * _sc9) for m in _main if m[1] < 4))
_fit9 = [r for r in _rows9 if r + _winh9 <= _wh9 - 5]
_nc9 = max(2, min(6, (_hole_w - 2 * _mrg9 - _winw9) // _pit9 + 1))
assert (_winw9, _winh9, _pit9) == (30, 10, 75), \
    '里院那面墙的窗尺寸独立重算得 %d×%d、排距 %d，应为 30×10 / 75（从立面表现算）' \
    % (_winw9, _winh9, _pit9)
assert (_wh9, len(_fit9), _nc9) == (78, 4, 4), \
    '里院那面墙独立重算得 墙高 %d、落得下 %d 排窗、每排 %d 扇（应为 78 / 4 / 4）—— ' \
    '墙太矮会吃窗、太矮还压不住院子；排数/扇数一改，"露出一部分教学楼"就变样了' \
    % (_wh9, len(_fit9), _nc9)
assert _hole_h - _wh9 >= 24, \
    '院子地面只剩 %d 行 —— 少于 24 行就只是墙脚一条缝，读不出"院子"（见 5.16.7b 头注）' \
    % (_hole_h - _wh9)
#     ⚠️ 里院那面墙的**底**：`J9_C.JOINT` 是半透明的 ⇒ 底下铺什么，砖缝就是什么色。
#     铺 J9_C.TILE 才和外面立面同色（实测缝 198 vs 不铺底时的 94 —— 6 倍放大一眼可见）。
assert 'JOINT: "rgba(0,0,0,0.085)"' in _j9, \
    'J9_C.JOINT 不再是半透明 rgba —— "里院那面墙要先铺一层不透明底"这一笔的前提变了' \
    '（前提没了就该把底也撤掉，否则是白铺）'
assert 'px(g, x, y, w, wh, J9_C.TILE);' in _j9 and \
       'j9Tiles(g, [[x, y], [x + w, y], [x + w, y + wh], [x, y + wh]], G);' in _j9, \
    'j9CourtWall 少了"先铺不透明底、再走 j9Tiles"这一步：半透明的砖缝会压在屋面板面' \
    '(103,121,135) 上 ⇒ 里院墙的砖缝变成深蓝灰(94,110,123)，比外面立面的(198,198,198) ' \
    '深一大截；屋面那条 y=110 的脊线也会从缝里透出来'
assert 1 <= _bn9 <= 3 and _bn9 < 4, \
    'J9_BOX_N = %d —— 环上放得下的设备箱上限是 3（30 段的楼是 2~4 个，本楼环窄）' % _bn9
#
# ⑩c-4 ⭐ 楼名点阵：**在 Python 里按 JS 的读法把 base64 解回来**，
#      再逐条核对格式（位序 / 字高 / 总宽）。这一条同时是 `_strip_js` 的探针：
#      若点阵里出现 `//` 而 `_strip_js` 又不认字符串，数据会被静默截断 ⇒ 长度先不对。
_jcb = re.findall(r'\["([A-Za-z0-9+/=]+)",\s*(\d+),\s*(\d+)\]', _j9)
assert len(_jcb) == 10, 'J9_CHARS 里解出 %d 个字形（应为 10 —— 「计算机科学与技术学院」）' % len(_jcb)
assert [int(w) for _, w, _ in _jcb] == [7, 6, 7, 6, 5, 5, 7, 6, 5, 7], \
    '逐字宽不是 [7,6,7,6,5,5,7,6,5,7] —— 跑 `python _build/_j9font.py` 重新生成'
assert len(set(h for _, _, h in _jcb)) == 1 and int(_jcb[0][2]) == 9, \
    '逐字高不是同一个 9 —— 底边对齐的前提是整段共用一个 th'
_jg = [int(x) for x in re.search(r'const J9_GAPS = \[([\d, ]+)\];', _j9).group(1).split(',')]
assert _jg == [1, 1, 1, 1, 1, 2, 1, 1, 1], '字缝不是 [1,1,1,1,1,2,1,1,1]'
_tw9 = sum(int(w) for _, w, _ in _jcb) + sum(_jg)
assert _tw9 == 71, '楼名总宽 %d ≠ 71 —— 金匾内宽只有 82 px，涨上去就顶穿' % _tw9
assert _tw9 <= 82 - 2, '楼名总宽 %d 顶到金匾的 82 px（两侧要各留 1 px 收口）' % _tw9
_barmin = None
for _i, (b64, _ws, _hs) in enumerate(_jcb):
    _w, _h = int(_ws), int(_hs)
    _raw = base64.b64decode(b64.encode('ascii'))
    assert len(_raw) == (_w * _h + 7) // 8, \
        '第 %d 个字的 base64 长度 %d ≠ ceil(%d×%d/8) —— 数据被截断/长度算错' \
        % (_i + 1, len(_raw), _w, _h)
    _bit = lambda k: (_raw[k >> 3] >> (7 - (k & 7))) & 1

    def _row(j):
        return [_bit(j * _w + i) for i in range(_w)]
    # ⚠️ 位序与"底边对齐"的双向钉子（三条合起来把 `enc()` 的**行优先 / MSB 在前**
    #    与 `carve()` 的**底边贴到第 th−1 行**同时钉住）：
    #    ① 最上一行必无墨 —— 各字墨高 ≤ 8 < 9，第一行是 `carve()` 补的空行；
    #    ② 最下一行必有墨 —— 底边齐（**这条同时是 COV=0.22 的探针**：回到 0.42 时
    #       「科」只占 2..6，这条立刻挂，见 `_j9font.py` 文件头⑤那张表）；
    #    ③ 墨迹量在 (0, 75%) 之间 —— 空字或糊成实心块。
    #    行/列写反或 LSB 在前的实现，① 或 ② 就会挂。
    assert not any(_row(0)), \
        '第 %d 个字的第一行有墨 —— 上补空行没写进去，或位序（行优先/MSB 在前）错了' % (_i + 1)
    assert any(_row(_h - 1)), \
        '第 %d 个字的最下一行没有墨 —— 底边没齐（COV 被调回 0.42 了？见 _j9font.py 文件头⑤）' \
        '或位序错了' % (_i + 1)
    _ink9 = sum(sum(_row(j)) for j in range(_h))
    assert _w * _h * 0.30 < _ink9 < _w * _h * 0.75, \
        '第 %d 个字墨迹 %d 像素 / %d（%d×%d）—— 空字或糊成一块' \
        % (_i + 1, _ink9, _w * _h, _w, _h)
#
# ⑩c-5 随机流 / 换画布契约（散射种子地雷的正面对照，同 66 段那几条）
assert 'bSeed' not in _j9c and 'Math.random' not in _j9c, \
    '67 段碰了 bSeed / Math.random —— 会重掷全校园散射（唯一探针是 _propdiff.py）'
assert 'rngS(' not in _j9c, '67 段碰了 scatter 的随机流 rngS'
assert _j9c.count('makeRng(') >= 3, \
    '67 段的瓷砖色差表与两轮补丁斑点必须**各用一条**自带 makeRng —— 共用一条会把顺序耦合进画面'
assert 'addSolid' not in _j9c, '67 段加了碰撞盒 —— 本段只许在同一张画布上重绘'
assert _j9c.count('b.ay =') == 1 and 'b.ay = G.baseY;' in _j9c, \
    '67 段对 b.ay 的赋值不是**恰好一次**且等于 G.baseY —— 多出来的 17 行必须全部朝北长，' \
    'b.y（世界落地线）与 addSolid 的世界坐标一个字节都不许动'
assert 'b.y =' not in _j9c and 'b.w =' not in _j9c, '67 段改了 b.y / b.w —— 会把精灵的世界锚点带偏'
assert 'clearRect(0, 0' not in _j9c, \
    '67 段清了整张画布 —— 檐口以上的屋面/女儿墙/屋名标牌都要留着（只许换画布搬过去）'
assert 'ng.drawImage(c, 0, 0, c.width, G.y0 + 1, 0, 0, c.width, G.y0 + 1);' in _j9c \
   and 'b.canvas = nc;' in _j9c, \
    '67 段的换画布不是"只把檐口以上（含）搬进新画布"—— 檐口以下整段不许进新画布'
assert 'b.canvas = nc;' in _j9c and _j9c.index('b.canvas = nc;') < _j9c.index('b.ay = G.baseY;'), \
    '先改锚点后换画布 —— addProp 取的是 s.canvas / s.ay，两步之间不能有别的写法'
#
# ⑩c-6 落笔顺序：**整幅砖底必须在 EL 循环之前**（ppt 里两翼从 y=0.0236 起、
#      中间那条横带从 y=0 起，差 1 行；不铺底的话立面最上一行是一条透出地面的透明缝）
_j9base = _j9c.index('px(g, G.x0, G.y0, G.w, G.FH, J9_C.TILE);')
_j9loop = _j9c.index('for (let i = 0; i < J9_EL.length; i++)')
assert _j9base < _j9loop, \
    '整幅砖底排在逐形状循环**之后** —— 它会把 ppt 画的所有构件盖掉（画面全白），' \
    '而没有任何自动验收会变'
assert 'j9Spans' in _j9c and _j9c.count('j9Spans(') >= 3, \
    '多边形没走行扫描（j9Spans）—— `clip()` 的路径边是抗锯齿的，像素画上会描出一条软边'
assert 'J9_STAIR_N = 3' in _j9n and '0.25 * Math.min(w, h)' in _j9c, \
    '台阶的踏步数或梯形收分丢了（prst=trapezoid 的默认 adj=25000 ⇒ 单侧收 min(w,h)×0.25）'
assert 'mull' in _j9c and 'function j9MullPitch(G)' in _j9c, \
    '黑玻璃的幕墙分格模数不是现算的（j9MullPitch）—— 写死 17 会在改图后与翼楼窗行脱节'
assert 'J9_BAR_TOL' in _j9c and 'tx = G.rect([0, J9_TXT.x' in _j9c, \
    '楼名落位那道闸（与 J9_TXT 标注框的中心差）被删了 —— 换字号/换字体后不会再报警'
#      分发点在链里、且在 addProp 之前（晚一步挂进 props 的还是旧精灵）
assert _ca.index('if (name === "老体育馆") gymRestyle(b);') \
       < _ca.index('else if (name === "第九教学楼") j9Restyle(b, pal);') \
       < _ca.index('addProp(Object.assign({}, b, { x: ax, y: ay,'), \
    'j9Restyle 没排在分发链里、或排在 addProp **之后** —— 换的那张画布已经进 props 了'
assert re.search(r'function j9Restyle\(b,\s*pal\)', _j9c), \
    'j9Restyle 的签名不是 (b, pal) —— 撤屋名牌之后要按 pal.roof 补回屋面板面'
assert 'makeSign(J9_NAME)' in _j9c and 'signRect(' in _j9c and 'pal.roof' in _j9c, \
    '撤屋名牌那段不完整（makeSign 填 _signCache / signRect 算矩形 / pal.roof 补板面）'

# --- 拼装 ---
chunks = [
    part('00_head.html'),
    part('10_const.js'),
    REUSE['utils'],
    part('20_ground.js'),
    part('30_building.js'),
    REUSE['siyuan'],
    part('36_library.js'),
    part('37_sports.js'),
    REUSE['nature'],
    part('45_water.js'),
    part('46_walls.js'),
    part('47_plants.js'),              # 植物多样化 + 行道树成行（只加分发，不动 nature 段）
    part('48_ground_detail.js'),       # 地面细节：逐砖色差 / 井盖 / 磨损 / 落叶（被 20 与 60 调用）
    part('49_southgate.js'),           # 南门红色高拱（G2 专用，46 的 buildGates 跳过 G2 后调它）
    char,                              # §5 角色（parts/50_char.js，A 档重画）
    part('71b_center.js'),             # §7.5 室内场景**引擎** + 计算机中心（第四十轮建，
                                       #      第四十一轮拆成「引擎 + 房间表」）
                                       #      + 刷题平台 iframe + 登录门（第四十轮）
                                       #      + 一次登录进两边（`xbgSync`，第四十一轮）
                                       #      ⚠️⚠️ **必须排在 72_guide.js 之前**，这是本轮的命门：
                                       #         72 段那个全局 keydown 是全项目**最早**注册的，
                                       #         靠注册顺序 + stopImmediatePropagation() 压住
                                       #         后面所有人（主循环的 WATCHED、补丁 7 的缩放）。
                                       #         本段排它后面 ⇒ 教室里按 Esc 会去触发向导那张
                                       #         四档梯子、按 E 会把小北叫过来。
                                       #         编号 `71b` 表**位置**不表序号（同 59b_weiren.js）。
                                       #      ⚠️ 加载期只许取本段**之前**的东西
                                       #         （IX / CAMPUS / zoneRect / buildChar / charSprite /
                                       #          CH_AX / CH_AY / WALK_FRAMES / IDLE_*）；
                                       #         player / keys / cam / ctx 在主循环切片里，
                                       #         加载期碰一下就是整页 JS 静默死。
                                       #      ⚠️ 本段**不进** props、**不加** addSolid
                                       #         ⇒ 散射种子（§6.6）与 _propdiff 都不会响。
    part('71c_yifu.js'),               # §7.6 逸夫楼 · 一楼大厅 + 咨询台 —— 学霸姐（第四十一轮）
                                       #      ⚠️ **只放数据**（调色板 + 房间描述符），
                                       #         逻辑全在 71b 的引擎里。这里要是也注册一个
                                       #         keydown，`CENTER` 是共用的 ⇒ 先注册的 71b
                                       #         会 stopImmediatePropagation() 把它整个挡掉，
                                       #         症状是"逸夫楼里按 B 出不了门"。
                                       #      ⚠️ 排 71b **之后**（它调 defRoom / npcSprites）、
                                       #         72_guide.js **之前**（同 71b 的理由）。
                                       #      ⚠️ 同样不进 props、不加 addSolid。
    part('51_siyuan_top.js'),          # §5.1 思源楼顶部改写（中央塔降高 + 毛笔题字）
    part('52_flag.js'),                # §5.2 升旗台：草坪凹口 + 底座 + 旗杆 + 五星红旗
    part('53_diaosu.js'),              # §5.3 齿轮铁砧雕塑：草坪南缘凹口 + 花坛 + 齿轮环
    part('54_southstone.js'),          # §5.4 南门校名石（花岗岩框 + 磨光红石板 + 金色校名）+ 石狮
    part('55_gym.js'),                 # §5.5 老体育馆门面按实拍覆盖重绘 + 门前长台阶
    part('56_minghu.js'),              # §5.6 明湖三景：石碑（含刻字点阵）/ 湖心岛 + 亭子 / 石塔
    part('57_yingbi.js'),              # §5.7 明湖南岸影壁群：带窗影壁 ×2 + 月亮门 + 假山
    part('58_dxdoor.js'),              # §5.8 思源东/西楼门面按实拍覆盖重绘（金字点阵 + 幕墙 + 雨篷）
    part('59_xgym.js'),                # §5.9 新体育馆正面按实拍覆盖重绘（灰竖肋 + 中段蓝玻璃带）
    part('59b_weiren.js'),             # §5.10 伟人雕像：灰石底座 + 四周石栏杆（用户指定 2439,1880）
    part('61_kxht.js'),                # §5.11 科学会堂正面按 ppt 正面图覆盖重绘（含金字点阵生成块）
    part('62_dorm16.js'),              # §5.12 16 号宿舍楼：两个灰蓝门楼 + 红砖墙 + 白色空调外机
    part('63_yifu.js'),                # §5.13 逸夫楼：深红墙 + 竖长条窗 + 深灰玻璃幕墙 + 两块楼名标牌
    part('64_southwest.js'),           # §6.4 南门西侧保安厅（砖墙+保安室+矮墙+折叠雨棚）
                                       #      + 东侧校名碑墙（复用 §5.4 成品、去框嵌墙）
    part('65_jixie.js'),               # §5.14 机械工程楼正面按 ppt 正面图**逐形状**覆盖重绘
                                       #      （棕橙楼体 + 灰柱/横梁 + 柱后蓝玻璃 + 金色楷体楼名）
    part('66_dormlib.js'),             # §5.15 图书馆南侧那一列宿舍：白方块瓷砖墙 + 两层
                                       #      + 首层防盗窗 + 白十字窗棂 + 上下棕色带 + 空调外机
    part('67_j9.js'),                  # §5.16 第九教学楼正面按 ppt 第 9 页**逐形状**1:1 复刻
                                       #      （白方格瓷砖 + 黑玻璃幕墙 + 金门廊 + 阶梯 + 金字点阵楼名）
    part('68_qijiao.js'),              # §5.17 第七教学楼正面按用户给的照片覆盖重绘
                                       #      （砖红墙 + 细灰横带 + 灰竖柱 + 灰混凝土门楼
                                       #       + 银灰卷帘门 + 深红金字匾 + 首层防盗栏 + 空调外机）
    part('69_wujiao.js'),              # §5.18 第五教学楼正面按用户给的照片覆盖重绘
                                       #      （饱和砖红墙 + 两根灰角柱/两根灰中柱 + 上下两扇窗
                                       #       + 深蓝双开大门 + 墙裙）
                                       #      ＋ **自设计的四坡尖顶**（整张画布从零画 —— 与
                                       #      68 段"只搬 [0,eaveY) 行"是分水岭：照片是正立面，
                                       #      屋顶被透视压扁，必须按 0.6 进深投影自己立起来）
    part('70_jianyi.js'),              # §5.19 建筑艺术学院正面按用户给的照片覆盖重绘
                                       #      （浅黄墙 + 五排蓝玻璃窗 + 右中深蓝灰玻璃塔
                                       #       + 塔上竖排 BJTUSA 点阵 + 贯通全宽的木质棚架
                                       #       + 树状柱 + 首层落地大玻璃门厅 + 深棕金字招牌）
                                       #      ⚠️ 与 61/67/68 段那条"换画布 + 挪 b.ay"的路不同：
                                       #      不换画布、不动 b.ay，只覆盖行 [PADT, baseY)
    part('70b_tyht.js'),               # §5.20 天佑会堂正面按用户给的图片覆盖重绘
                                       #      （米黄石墙 + 白檐板 + 中央蓝玻璃幕墙
                                       #       + 白平台栏杆 + 灰悬挑雨棚 + 三组首层大门
                                       #       + 左右通高窄窗带 + 右墙竖排金字「天佑会堂」
                                       #       + 楼前大台阶 + 台阶下红黄绿蓝彩绘）
                                       #      ⚠️ 走 70_jianyi 那条路（不换画布、不动 b.ay），
                                       #         唯一分歧：往下多画 30 行（台阶 + 彩绘）——
                                       #         成因是用户点名要台阶和彩色涂装。
    part('71_guide_char.js'),          # §7.1 向导·小北的精灵：红衣女志愿者（换装配色，
                                       #      骨架/步态/四向×六相位全部走 50_char.js 的 buildChar）
    part('60_assemble.js'),
    part('72_guide.js'),               # §7.2 向导：地名词典 + 别称 + 栅格寻路 + 对话框 + 自动带路
                                       #      ⚠️ 必须排在 60_assemble.js **之后**：
                                       #         ① 站位要用 §6.8 的 SPAWN；
                                       #         ② 更要紧的是**排在所有 clear* 之后** ——
                                       #            那串清场是白名单式的，一个陌生小精灵
                                       #            落在草坪带上会被静默删掉。
    part('73_occl.js'),                # §7.3 建筑遮挡虚化：走到楼后边，那栋楼整栋变淡
                                       #      ⚠️ 必须排在 60_assemble.js **之后** ——
                                       #         认楼靠的是那边顶部的 BLD_IMGS 登记表；
                                       #         也必须排在主循环**之前**（补丁 20 要在
                                       #         render() 里调 occlFrame / occlTick / occlAlpha）。
                                       #      ⚠️ 段内加载期不许取 ctx / player / GUIDE：
                                       #         那三个的 `const` 在主循环切片里（Demo L1247 /
                                       #         L1257），排在本段**之后**，加载期取会撞 TDZ。
    part('74_llm.js'),                 # §7.4 「知识联系」表 + 大模型兜底（第三十九轮）
                                       #      ⚠️ 必须排在 72_guide.js **之后**：
                                       #         加载期就要读它的 GDEST / GKEY；
                                       #         也必须排在主循环**之前** —— 段内不碰
                                       #         ctx / player / cam（那三个在主循环切片里，
                                       #         加载期取会撞 TDZ）。
                                       #      ⚠️ key **不在**这里、也不在产物里：
                                       #         它只活在玩家浏览器的 localStorage，
                                       #         第一次用到时弹一次输入框（§7.4.3）。
    loop,
    '\n</script>\n</body>\n</html>\n',
]

html = '\n'.join(chunks)

# --- 段是否真的进了产物（只有拼完之后才查得了）---
assert 'function xgRestyle(b, roofCol)' in html, \
    "59_xgym.js 没进产物 —— build.py 的 chunks 列表里少了 part('59_xgym.js')"
assert 'function dorm16Restyle(b, pal)' in html, \
    "62_dorm16.js 没进产物 —— build.py 的 chunks 列表里少了 part('62_dorm16.js')" \
    "（语法闸查不出：dorm16Restyle 未定义只在 60 段的 `else if` 那一行触发，是**加载期**" \
    "ReferenceError，整页 JS 死 —— 页面只剩一行静态标题）"

# --- §7 向导「小北」：两段真的进了产物 + 玩家精灵没被换装参数动到 ---
# ⚠️ 下面几条都是**加载期**才炸得出来的错（node --check 只查语法）：
#    函数未定义 = ReferenceError = 整页 JS 死 = 只剩一行静态标题。
for _g in ('function guideSprite(dir, step)', 'function guideTick(dt)',
           'function guideWalkToward(tx, ty, dt)', 'function guideFollow(dt)',
           'function guideLeadStep(dt)', 'function guideReplan()',
           'function guideCall()', 'function guideGoHome()', 'function guideBubbleOf()',
           'function guidePath(sx, sy, tx, ty)', 'function guideAsk(text)',
           'function ensureWalkGrid()', 'function guideTipFollow()'):
    assert _g in html, '向导段没进产物：缺 ' + _g
assert 'function buildChar(HH, PAL)' in html, '50_char.js 的 buildChar 没有配色参数'
assert 'const makeChar = buildChar(6);' in html, '玩家精灵那一行被改动了（契约里钉着它）'
assert 'buildChar(6, GUIDE_PAL)' in html, \
    '向导精灵没走 buildChar(6, GUIDE_PAL) —— 与玩家不是同一套骨架/节拍'
assert 'tag: "guide"' not in html and "tag: 'guide'" not in html, \
    '向导进了 props —— 会落进 60 段白名单式 clear* 的射程，且每轮 _propdiff 报假差异'
# 保留的两条补丁真的落到该落的地方（各一条，不要多也不要少）
assert html.count('img: guideSprite(GUIDE.dir, GUIDE.step)') == 1, '补丁18 的向导落笔丢了'
assert html.count('guideTick(dt);                           // 向导') == 1, '补丁19 的心跳丢了'
# ⭐ 反向断言（2026-09-30 第三十六轮）：16 / 17 号补丁与它们挂的东西**必须真的没了**。
#    这不是洁癖 —— 用户的两条要求（走在前带队 / 不要引导线）正是靠这两条删除实现的，
#    哪天被谁"顺手加回来"，页面照样跑得起来、五套验收照样全绿，只有人会看出不对。
assert html.count('drawGuideRoute') == 0, \
    '引导线（drawGuideRoute / 补丁 16）又回来了 —— 用户明确要求导航中不显示引导线'
assert html.count('guideAutoStep') == 0, \
    'guideAutoStep / 补丁 17 又回来了 —— 那套是"把玩家推着走"，与"她走在你前面"互斥'
# 她真的在自己的位置上被驱动（不是又被谁改回"推玩家"）
assert html.count('GUIDE.x = nx') == 1, '她的位置推进点丢了 —— 她又变成不会走路的布景了'
assert html.count('guideLeadStep(dt);') == 1, '带队滞回的调用点丢了'

# --- §7.3 建筑遮挡虚化（第三十七轮 2026-09-30） ---
# ⚠️ 与上面向导那批同理：函数没进产物只是**加载期** ReferenceError，`node --check` 查不出。
for _g in ('function occlAlpha(it)', 'function occlFrame()',
           'function occlTick(list, ox, oy, zoom)'):
    assert _g in html, '遮挡虚化段没进产物：缺 ' + _g
assert html.count('var BLD_IMGS = new Set();') == 1, \
    '60_assemble.js 顶部的建筑画布登记表没了 —— 虚化会认不出任何一栋楼'
assert html.count('BLD_IMGS.add(') == 3, \
    '登记表必须正好挂在三处建筑推入点（§6.2 批量循环 / §6.3 思源楼 / §6.4 图书馆）；' \
    '少一处就有楼永远不虚化，多一处可能把角色或小道具也算成楼'
# 补丁 20 的两处真的落到该落的地方（各一条，不要多也不要少）
assert html.count('occlFrame();                              // 第三十七轮') == 1, \
    '补丁20a 的帧首复位丢了 —— 上一帧的 alpha 会糊到下一帧的整片地面上'
assert html.count('occlTick(drawList, ox, oy, zoom);') == 1, '补丁20b 的"先定谁该淡"丢了'
assert html.count('ctx.globalAlpha = occlAlpha(it);') == 1, '补丁20b 的逐条目取值丢了'
# ⚠️ 角色画布**永远不许**进登记表：绘制循环里 drawSwimRing 紧跟角色那一笔，
#    角色项一旦 alpha < 1，水线涟漪会被一起调暗。
for _forbid in ('BLD_IMGS.add(charSprite', 'BLD_IMGS.add(guideSprite',
                'BLD_IMGS.has(charSprite', 'BLD_IMGS.has(guideSprite'):
    assert html.count(_forbid) == 0, '角色画布被塞进了 BLD_IMGS：' + _forbid

# --- §7.4 小北不横穿草坪/明湖 + Esc 回家（第三十八轮 2026-09-30） ---
# ⚠️ 这批断言盯的是**两条用户看得见的规矩**。它们全都能在"页面照样跑得起来、
#    五套验收照样全绿"的前提下被改回去 —— 所以只能靠断言钉住。
# ① 明湖进她的黑名单（**只挡她**，玩家走的是主循环的 canWalk/blocked，一个字没动）
assert html.count('PASSK[K.WATER] = 0;') == 1, \
    '小北的寻路白名单里明湖又被放开了 —— 她会直接横穿湖面'
assert html.count('PASSK[K.GRASS] = PASSK[K.WATER]') == 0, \
    'K.WATER 又回到了那条 = 1 的链子上（第三十八轮把它单独摘出来写成 0）'
# ② 5 块景观草坪的禁区位图 + 它真的接进了烘焙那一行
assert html.count('const NOGO = new Uint8Array(NW * NH);') == 1, \
    'NOGO 位图没了 —— 小北会横穿 5 块设计草坪'
assert html.count('if (NOGO[i]) continue;') == 1, \
    'NOGO 没接进 ensureWalkGrid() —— 位图算了却没人读，等于没做'
assert html.count('markLawnNoGo') == 1, \
    'markLawnNoGo 只该定义一处（IIFE 名）；多出来说明有人在别处又盖了一张表'
# ⚠️ **绝不许**给草坪/湖面加碰撞盒：那会挪 solids ⇒ 重掷全校园散射（§6.6 地雷）。
#    用户拍板的就是"只挡小北"——玩家照样能踩草坪、能下水。
assert html.count('addSolid(NOGO') == 0 and html.count('addSolid(lawn') == 0, \
    '给草坪/湖面加 addSolid 了 —— 会挪 solids，重掷全校园散射（§6.6 地雷）'
# ③ 兜底半径 14 → 20 格：禁区变大后，站在草坪/湖心按 E 叫她得够得到岸
assert html.count('maxR = maxR || 20;') == 1, \
    'guideSnap 的兜底半径不是 20 格 —— 站在草坪/湖心按 E 会够不到岸'
assert html.count('guideSnap(tx, ty, 20)') == 1 and html.count('guideSnap(sx, sy, 20)') == 1, \
    'guidePath 里那两处显式半径不是 20'
# ④ Esc 回家：三个洞各一条断言
assert html.count('function guideExitDialog()') == 1, \
    '「退出对话」动作没抽成函数 —— 回复期按 Esc 只会关面板，那趟带路照旧启程'
assert html.count('guideExitDialog();') == 3, \
    'guideExitDialog() 必须正好三处调用（页面 Esc / 输入框 Esc / 点暗底）；' \
    '少一处就是又漏了一条退出路径'
assert html.count('GUIDE.retried ||') == 0, \
    '⭐ 那句 `GUIDE.retried ||` 短路回来了 —— 第二次卡住会既不重算也不兜底，' \
    '她会永远停在半路（用户报的就是这个：按了 Esc 没回到南门）'
assert html.count('if (GUIDE.retried) return false;') == 1, \
    'guideReplan 的守卫没搬进函数里'
assert html.count('!(GUIDE.retried') == 0, '守卫还在调用点上短路，等于没修'

# --- §7.5 「知识联系」+ 大模型兜底（第三十九轮 2026-09-30） ---
for _g in ('function linkResolve(t)', 'function llmAsk(text, cb)', 'function llmParse(s)',
           'function llmKeyGet()', 'function llmKeySet(k)', 'function llmKeyAsk()',
           'function guideOffer(pr, raw, lead)', 'function guideThink(raw)',
           'function guideBusy(on)'):
    assert _g in html, '第三十九轮那段没进产物：缺 ' + _g + \
        '（`74_llm.js` 没进 chunks 列表？只有加载期才炸得出来）'
# ⚠️⚠️ **产物里不许出现 key 的痕迹。** 这个 HTML 是要发出去、贴进 PPT 的 ——
#    把 key 写进去就是明文外泄，而且删不干净。key 只活在玩家的 localStorage 里。
# ⚠️ 判据写成"像 key 的长串"而不是裸的 `'sk-' not in html` —— 后者会被 base64
#    点阵里的普通子串误伤（base64 字母表含 s/k/-，六万多个格里出现一次是常态）。
assert not re.search(r'sk-[A-Za-z0-9_\-]{20,}', html), \
    '⭐ 产物 HTML 里出现了像 API key 的长串 —— key 被写进文件了，绝不允许'
assert html.count('const LLM_STORE = "pixelcampus_llm_key";') == 1, \
    'key 的 localStorage 键名变了 —— 老玩家已经存过的那份会突然失效'
assert html.count('localStorage.setItem(LLM_STORE') == 1 and \
       html.count('localStorage.getItem(LLM_STORE') == 1, \
    'key 的读写口不是各一处'
# 三层判读的顺序：字面地名 > 本地关联表 > 大模型。顺序反了会把已经匹配上的地名带偏。
assert html.count('const lk = linkResolve(t);') == 1, '本地关联表那一层没接进 guideAsk'
assert html.count('if (m) { guideOffer(m, raw, ""); return; }') == 1, \
    '字面地名不再是第一层了 —— 用户打了「五教」会被联想抢走'
# ⭐ 本地关联表的**右列**（目的地名）写错一个名字，**不会报错** —— `guidePick` 只会
#    静默返回 null、她说一句"没听明白"，极难查。这里只做**结构**检查（每行都解析得出来、
#    每一行都有至少一个目的地名）；**真正的名字核对在 `_guideprobe.py` 的 P20d**，
#    那条在**运行期**拿此刻的 `GDEST` 逐个比对 —— 静态文本比不过它。
_lk_rows = re.findall(r'\[\[([^\]]*)\],\s*\[([^\]]*)\],\s*"', html)
assert len(_lk_rows) >= 10, \
    'LINK 表只解析出 %d 行 —— 表被改坏了，或者写法换了（正则跟不上）' % len(_lk_rows)
for _k, _v in _lk_rows:
    assert len(re.findall(r'"([^"]+)"', _k)) >= 1, 'LINK 有一行左边没有触发词'
    assert len(re.findall(r'"([^"]+)"', _v)) >= 1, 'LINK 有一行右边没有目的地'
assert html.count('function guideOffer(pr, raw, lead)') == 1 and \
       html.count('function guideThink(raw)') == 1, '拆分 guideAsk 时把新函数弄丢了'

# --- §7.5 室内场景引擎 + 计算机中心 · 算法哥 · 刷题平台 ---
#     §7.6 逸夫楼 · 一楼大厅 · 学霸姐（第四十一轮 2026-10-01 并入）
# ⚠️ 这一批里有**本轮唯一的命门**（顺序），和几条"改回去页面照样跑、五套验收照样全绿、
#    只有人看得出来不对"的规矩。逐条都有它存在的理由，别当成模板套话。
for _g in ('function npcSprites(pal)', 'function defRoom(r)', 'function roomNear(R)',
           'function roomAt()', 'function roomFree(R, x, y)',
           'function roomEnter(R)', 'function roomLeave()',
           'function ctrTalk()', 'function ctrProbe(R)', 'function ctrOpenPlatform(R)',
           'function ctrBindFrameEsc()', 'function ctrFrameBindEsc()',
           'function loginGate()', 'function doLogin()', 'function doLogout()',
           'function xbgSync(u, p, left)'):
    assert _g in html, '室内场景段没进产物：缺 ' + _g + \
        '（`71b_center.js` / `71c_yifu.js` 没进 chunks 列表？只有加载期才炸得出来，node --check 查不出）'
# ⭐⭐ 第四十一轮：**两间房必须在同一张表里**。少了 71c 段的 `defRoom`，产物照样跑、
#    五套验收照样全绿，只有人走到逸夫楼按 F 没反应 —— 那种"没坏，只是没东西"最难报。
assert html.count('defRoom({') == 2, \
    'ROOMS 里的房间数不是 2 —— `71c_yifu.js` 没进 chunks（或它的 defRoom 被删了）'
assert html.count('key: "center"') == 1 and html.count('key: "yifu"') == 1, \
    '两间房的 key 不是 center/yifu 各一处 —— 引擎按 key 索引进 ROOMS，重名会互相顶掉'
# ⭐⭐ **顺序即命门**：本段那个 keydown 必须比 72_guide.js 那条**早注册**。
#    两个都是 window 上的 keydown，同 target 按注册顺序触发 ⇒ 只有排在前面，
#    本段的 stopImmediatePropagation() 才挡得住向导。顺序反了**不会报任何错**，
#    症状是"教室里按 Esc 弹出向导的梯子 / 按 E 把小北叫过来"——
#    而五套自动验收里跑的都是地图场景，一条都照不到。只能靠这条断言钉死。
assert html.index('[像素校园] 室内场景段就绪') < html.index('function guideTick(dt)'), \
    '⭐ 室内场景段排到 72_guide.js 后面了 —— 房间里的按键会被向导抢走' \
    '（按 Esc 触发四档梯子 / 按 E 叫小北）。chunks 表里 part("71b_center.js") 与 ' \
    'part("71c_yifu.js") 都必须在 part("72_guide.js") 之前。'
# 两个 NPC：走的是**同一个 buildChar**（骨架上不许有第二套），眼镜/长发走既有钩子。
# ⚠️ 第四十一轮起 buildChar 的调用**只剩工厂里那一处**（两个 NPC 都经 `npcSprites`），
#    所以这里钉的是工厂的写法，而不是某个 NPC 的调用点。
assert html.count('const ALG_PAL = {') == 1 and html.count('const XBJ_PAL = {') == 1, \
    '算法哥 / 学霸姐的配色表不是各一处'
assert html.count('buildChar(6, pal)') == 1 and html.count('function npcSprites(pal)') == 1, \
    'NPC 精灵没走 buildChar(6, pal) 工厂 —— 与玩家/小北不是同一套骨架或节拍'
assert html.count('npcSprites(ALG_PAL)') == 1 and html.count('npcSprites(XBJ_PAL)') == 1, \
    '两个 NPC 没各建一张精灵表（或有人绕过工厂直接调 buildChar）'
assert html.count('glasses:') == 1, '算法哥的眼镜配色没传下去（或学霸姐那边多写了一份）'
assert html.count('if (C.glasses)') == 1, \
    '50_char.js 的眼镜钩子没了 —— 算法哥会变成一张没有五官的黑脸'
# ⚠️ 长发钩子**小北（向导）第四十轮之前就在用**了 ⇒ `longHair: true` 是**两处**
#    （GUIDE_PAL + XBJ_PAL），而 50_char.js 里的实现**只有一处**（勾子本身不许被复制一份）。
assert html.count('longHair: true') == 2 and html.count('if (C.longHair)') == 1, \
    '长发钩子对不上了 —— 小北与学霸姐各开一次（2 处），50_char.js 的实现只许一份（1 处）'
# ⭐ 眼镜钩子的**反向契约**：`C.glasses` 为 undefined 时一个像素都不许画。
#    判据 = 玩家与小北的产出逐字节不变 —— 那条在 `verify.py` 的 props=320 与
#    `_propdiff.py` 的 317/317，静态文本这边比不过它们，所以这里只钉住写法：
assert html.count('C.glasses') >= 2, '眼镜钩子的判据写法被换了（改成 !== undefined 之类）'
# 室内**自建**按键表：如果谁图省事改成复用主循环的 keys，两个世界会一起动
assert html.count('const CKEYS = Object.create(null);') == 1, \
    '室内按键表 CKEYS 没了 —— 若改成复用主循环的 keys，室内走路会把地图玩家一起带着走'
assert html.count('stopImmediatePropagation()') >= 4, \
    '室内段的吞键逻辑被削了 —— 地图玩家会在房间里跟着走'
# 平台：同源相对路径 + 自定义协议各一处
assert html.count('pixelcampus://start') == 1, '启动协议的名字被改了（.bat 那边就对不上了）'
assert html.count('/api/auth/login') == 1, '登录门打的接口不是 /api/auth/login'
# ⭐⭐ 抽屉必须开 `/agent`，**不能是 `/`**。平台的 `App.vue` 只有 `<router-view/>` 和
#     `<AgentWatch/>` 两块，而 `AgentWatch.visible` 里有一条 `window.self === window.top`
#     ⇒ **被 iframe 嵌进来时，算法哥那个悬浮头像必然隐身**（平台作者故意的：嵌走时
#     让宿主自己给入口）。于是开 `/` = 抽屉里一个算法哥入口都没有，按 C 等于白按。
#     `/agent` 是平台自己的算法哥整页，页内自带「题库」和「返回地图」。
# ⚠️ 第四十一轮起 `app` 是**房间描述符的字段**（不再是全局 `CTR_APP`），两间房各一处。
assert html.count('app: "/agent"') == 1, \
    '⭐ 刷题抽屉的入口不是 /agent —— 开 `/` 的话抽屉里没有任何算法哥入口（见上一行注释）'
assert html.count('app: "/xbg/"') == 1, \
    '⭐ 学霸姐的抽屉入口不是 /xbg/ —— 她的前端 33 处路径都挂在这个前缀下，写错就是整页 404'
# ⭐⭐⭐ **反向判据：产物里绝不许出现绝对地址**。
#    一旦有人图省事把 `app` 写成 `http://127.0.0.1:8010/xbg/`，iframe 立刻跨源
#     ⇒ **免登录 / Esc 穿透 / 教材原件下载 cookie 三件事同时静默坏**，
#    而地图这边的五套自动验收**一条都照不到**（它们只看几何和"页面活着"）。
#    这条是本轮唯一能把那种写法挡在门外的静态闸。
#    ⚠️ 只吃 `_strip_js` 的输出（本文件里"凡是否定断言一律如此"的老规矩）：两个 part 的
#       注释里**故意**写着 "8010" / "127.0.0.1" 这些字样来讲这个坑，直接拿原文当靶子会假失败。
_abs = _strip_js(html)
for _h in ('8010', '127.0.0.1', 'localhost:3000'):
    assert _h not in _abs, \
        '⭐ 产物里出现了 ' + _h + ' —— 房间 iframe 必须写**同源相对路径**。' \
        '写成绝对地址 ⇒ 跨源 ⇒ 免登录/Esc 穿透/下载 cookie 同时静默坏，五套验收全绿也发现不了。'
# ⭐ 一次登录进两边（第四十一轮）。顺序是安全设计：这两条只在**平台已验证过凭据之后**才跑，
#    所以绝不会为没验证过的凭据在学霸姐那边开号。断言钉住"两条都在"和"那个前缀没被改掉"。
assert html.count('const XBG_LOGIN = "/xbg/api/login"') == 1 and \
       html.count('XBG_REG = "/xbg/api/register"') == 1, \
    '学霸姐那边的登录/注册接口不是 /xbg/api/login 与 /xbg/api/register'
assert html.count('xbg_token') >= 2, \
    '`xbg_token` 字面量少于 2 处 —— 存一处 + `doLogout` 清一处，少一个都会留下"换账号后以上一个账号身份进去"'
# ⚠️⚠️ 第四十一轮补丁（**用户实测撞出来的**）：`xbgSync` 必须**两个入口**。
#     `loginGate()` 见到 `localStorage.token` 就 `loginEl.hidden = true; return;` ⇒
#     `doLogin` 不会被调用。只挂 `doLogin` 的话，凡是"已经登录过"的人
#     ——也就是**从第二次打开起的所有人**——永远同步不上学霸姐：
#     走进逸夫楼按 C，弹的是她自己的登录框。用户原话「为啥给学霸姐对话需要我自己再登录」。
#     ⭐ 这类"新装能用、老用户不行"的 bug，五套自动验收**一条都照不到**：
#        `_centerprobe.py` 的 localStorage 是干净的，走的永远是首次登录那条路。
#     所以只能靠静态断言把第二个入口钉死，剩下一条（真登录一次再刷新的行为）
#     由探针 C19 覆盖。
assert html.count('function xbgBootSync()') == 1 and \
       html.count('loginGate(); xbgBootSync();') == 1, \
    '⭐ `xbgSync` 只剩 `doLogin` 一个入口（或 `xbgBootSync` 定义了却没接进启动的 setTimeout）' \
    '—— 已登录的老用户会被登录门跳过，永远同步不上学霸姐'
assert html.count('xbgCredSave(u, p);') == 1 and html.count('xbgCredLoad()') >= 1 and \
       html.count('localStorage.removeItem(XBG_CRED)') == 1, \
    '补同步的凭据 `xbg_cred` 没存 / 没读 / 没在退登时清 —— ' \
    '不清的话下一个登录的人会**以旧账号的身份**被 `xbgBootSync` 拿去登学霸姐'
# ⭐ localStorage 的形状必须与 `campus_game/frontend/src/stores/user.js:31-36` 的 setUser 一致。
#    字段名错一个，**免登录照样"看起来成了"**（token 存进去了、iframe 也开了），
#    但路由守卫读 `user.role` 拿到 undefined ⇒ admin 被挡在管理后台外面。
#    症状只在刷题平台里看得见，地图这边的任何一条验收都照不到。
assert html.count('role: d.role') == 1 and html.count('nickname: d.nickname') == 1 and \
       html.count('username: d.username') == 1 and html.count('id: d.userId') == 1, \
    '登录门写 localStorage 的字段名与平台 stores/user.js 对不上了（免登录会半残）'
# ⚠️⚠️ **本轮新增的泄密判据**：这一轮第一次让地图去跟刷题平台说话，
#    最容易出的事就是"顺手把 campus_game 的配置粘过来"。那三样**一个都不许进产物**：
#      MySQL 密码 / 163 邮箱授权码 / DeepSeek key（key 另有上面那条正则守着，这里是兜底）。
#    这个 HTML 是要发出去、贴进 PPT 的，写进去就是明文外传、且删不干净。
for _secret, _what in (('Zlk173096', 'MySQL 密码'),
                       ('GJivJGvUWJchujEi', '163 邮箱授权码'),
                       ('sk-4a243abb', 'DeepSeek key'),
                       ('coding-platform-secret-key-2024', 'jwt.secret')):
    assert _secret not in html, \
        '⭐ 产物里出现了 campus_game 的 ' + _what + ' —— 明文外泄，绝不允许'
# 两个演示账号是**故意**写在登录框上的（就是给人一键点的），但只能出现在那一处
assert html.count('data-p="admin123"') == 1 and html.count('data-p="user123"') == 1, \
    '演示账号的按钮不是各一处 —— 别处又硬编码了一份密码'

assert 'function yifuRestyle(b, pal)' in html, \
    "63_yifu.js 没进产物 —— build.py 的 chunks 列表里少了 part('63_yifu.js')" \
    "（语法闸查不出：yifuRestyle 未定义只在 60 段的 `else if` 那一行触发，是**加载期**" \
    "ReferenceError，整页 JS 死 —— 页面只剩一行静态标题）"
assert 'function tfFenceRect(g, R)' in html, \
    '网球场的围栏函数没进产物'
assert 'function makeGuardHouse()' in html and 'function makeSteleWall()' in html, \
    "64_southwest.js 没进产物 —— build.py 的 chunks 列表里少了 part('64_southwest.js')" \
    "（语法闸查不出：buildSouthWest/clearSouthWest 未定义只在 60 段那两行触发，是**加载期**" \
    "ReferenceError，整页 JS 死 —— 页面只剩一行静态标题）"
assert 'buildSouthWest();' in _ass, '64 段进了产物但 60 段没调用 buildSouthWest()'
assert 'clearSouthWest();' in _ass, '64 段进了产物但 60 段没调用 clearSouthWest()'
assert 'function jixieRestyle(b, pal)' in html, \
    "65_jixie.js 没进产物 —— build.py 的 chunks 列表里少了 part('65_jixie.js')" \
    "（语法闸查不出：jixieRestyle 未定义只在 60 段的 `else if` 那一行触发，是**加载期**" \
    "ReferenceError，整页 JS 死 —— 页面只剩一行静态标题）"
assert 'function wrStand()' in html, \
    "59b_weiren.js 没进产物 —— build.py 的 chunks 列表里少了 part('59b_weiren.js')" \
    "（语法闸查不出：wrStand 未定义是**加载期** ReferenceError，整页 JS 死）"
assert 'function dormLibRestyle(b, name)' in html, \
    "66_dormlib.js 没进产物 —— build.py 的 chunks 列表里少了 part('66_dormlib.js')" \
    "（语法闸查不出：dormLibRestyle / dormLibPick 未定义只在 60 段那两行触发，是**加载期**" \
    "ReferenceError，整页 JS 死 —— 页面只剩一行静态标题）"
assert 'function j9Restyle(b, pal)' in html, \
    "67_j9.js 没进产物 —— build.py 的 chunks 列表里少了 part('67_j9.js')" \
    "（语法闸查不出：j9Restyle 未定义只在 60 段的 `else if` 那一行触发，是**加载期**" \
    "ReferenceError，整页 JS 死 —— 页面只剩一行静态标题）"
assert 'const J9_EW = 10.7972' in html and 'const J9_CHARS = [' in html, \
    "67_j9.js 进了产物但几何表/楼名点阵丢了（生成块被覆盖？）"
assert 'function qjRestyle(b, pal)' in html, \
    "68_qijiao.js 没进产物 —— build.py 的 chunks 列表里少了 part('68_qijiao.js')" \
    "（语法闸查不出：qjRestyle 未定义只在 60 段的 `else if` 那一行触发，是**加载期**" \
    "ReferenceError，整页 JS 死 —— 页面只剩一行静态标题）"
assert 'const QJ_C = {' in html and 'const QJ_CHARS = [' in html, \
    "68_qijiao.js 进了产物但色表/匾额点阵丢了（生成块被覆盖？）"
# 匾额点阵必须**填过**（`_qjfont.py --write`）；那段标记在源码里一直躺着，
# 漏跑的话产物里是一条 `["", 1, 1]` 的占位 —— 页面照常打开、验收全绿，
# 只有出图看见门楼上挂着一块**空红板**。
assert 'const QJ_CHARS = [["", 1, 1]]' not in html, \
    "68_qijiao.js 的匾额点阵还是占位 —— 跑 `python _build/_qjfont.py --write`"
# 楼高链条：CAMPUS 的"第七教学楼"4 层 → 本段 QJ_FLOORS 必须同值。
# ⚠️ 改的是 footprint / styleOf 的 floors 时，这条先响，而不是等出图看见
#    立面比邻居高出一截（本段画布高是从 floors 反解出来的，配不上就错位）。
assert 'const QJ_FLOORS = 4;' in html and 'QJ_FLOORS = 4' in html, \
    "68_qijiao.js 的 QJ_FLOORS 与 styleOf 的 `/教学楼/ → floors: 4` 对不上了"

# --- §5.18 第五教学楼（第三十轮，parts/69_wujiao.js）---
# ⚠️ 同 68 段：`wjRestyle` 未定义是**加载期** ReferenceError（整页 JS 死、
#    页面只剩一行静态标题），而 60 段那一行 `else if` 只在跑到第五教学楼时才执行
#    —— 语法闸与三套自动验收都查不出"漏了一个 chunk"。
_wj  = part('69_wujiao.js')
_wjc = _strip_js(_wj)
assert 'function wjRestyle(b, pal)' in html, \
    "69_wujiao.js 没进产物 —— build.py 的 chunks 列表里少了 part('69_wujiao.js')" \
    "（语法闸查不出：wjRestyle 未定义只在 60 段的 `else if` 那一行触发，是**加载期**" \
    "ReferenceError，整页 JS 死 —— 页面只剩一行静态标题）"
assert 'const WJ_C = {' in html and 'const WJ_CORNER = [' in html, \
    "69_wujiao.js 进了产物但色表 / 立面横向分格丢了（生成块被覆盖？）"
# 楼高链条（第三十三轮重钉）：
#   CAMPUS 的进深 h = 1.3500  →（60 段开 roofFull）→ 30 段画布高 = PADT + ceil(进深) + PADB
#   →（69 段反解）depth = 画布高 − PADT − PADB = 528
#   → roofT = depth − 墙高 = 426  ⇒ 屋带 + 墙高 = 进深（**盖满 footprint**）
#   → 墙高 = WJ_WALL_MUL × FLOOR_H = 3 × 34 = 102（**与七教每层齐平**，用户原话）
#   ⭐ 第三十三轮起 `roofT` **只管"坡有多长"**，不再管"屋顶看起来多高"
#      —— 后者是 `WJ_GABLE = 44`（南北向正脊把这两件事解耦，见下面的长注释）。
# 这四段任何一段断了，症状都是"出图才知道"（五套自动验收全绿），所以逐段钉。
# ⚠️ `WJ_BASE_MUL`（第三十一轮用来反解 30 段画布高的那个 4）**第三十二轮已删除** ——
#    有了 `roofFull`，画布高公式里根本没有墙高，不需要任何反解常数。
#    谁把它加回来，就是在往"屋面不盖满 footprint"的老路上退（北缘露灰石板）。
assert 'WJ_BASE_MUL' not in _wjc, \
    "69_wujiao.js 里又出现了 WJ_BASE_MUL —— 第三十二轮起 60 段给本楼开了 roofFull，" \
    "画布高 = PADT + ceil(进深) + PADB（**不含墙高**），不再需要反解常数"
assert 'const WJ_WALL_MUL = 3;' in html, \
    "69_wujiao.js 的 WJ_WALL_MUL 不是 3 —— 用户要求「高度降低和七教每层多高对齐」：" \
    "每层必须正好 `FLOOR_H = 34` 行（七教 QJ_FLOORS=4 ⇒ 墙 136），所以本楼 3 层 ⇒ 102"
assert 'const depth  = c.height - WJ_PADT - WJ_PADB;' in html, \
    "69_wujiao.js 的 depth 反解式被改了 —— 开了 roofFull 之后 30 段画布高 = " \
    "PADT + ceil(进深) + PADB，depth 必须这样反解，否则进深读数整条错"
assert 'const roofT  = depth - wallH0;' in html, \
    "69_wujiao.js 的 roofT 不是 `depth - wallH0` —— 这是与两栋体育馆同一条规矩" \
    "（屋带 + 墙高 = 进深 ⇒ 精灵恰好盖满 footprint）。改回 0.6·进深 会让北缘" \
    "露出一条灰石板（用户 2026-09-17 对体育馆提过同一条要求）"
assert 'WJ_WIN_H = 16' in html, \
    "窗高被改了 —— 它是立面**唯一**不随 sv 自动走、必须手算的尺寸：" \
    "`WJ_WIN_H = round(132 × sv)`，132 = 照片上玻璃的高（px），sv = 墙高/841。" \
    "逐轮：r30 墙 136 ⇒ 21；r31 墙 170 ⇒ 该 27（当年漏改，留了 21）；" \
    "r32 墙 102 ⇒ **16**。校验：照片「窗下到层间带」72px ⇒ 8.7 行，取 16 时窗下正好留 8 行砖"
assert '["第五教学楼", "bld",     6.6097, 4.0208, 0.5486, 1.3500],' in html, \
    "CAMPUS 里第五教学楼的进深不是 1.3500（世界 527.5 px = 原 351.5 的 1.5 倍）" \
    "—— 用户第三十三轮要的「长度扩大到现在的1.5倍」就是这个数。" \
    "⚠️ 改它 = 动 addSolid 的盒子与 §2 的铺装 ⇒ **会重掷全校园散射**，唯一探针 _propdiff.py；" \
    "`y` 必须保持 4.0208（北缘贴死东西主路，往北一寸都没有 ⇒ 多出来的 176 行全在南边）"
# ⚠️ 第三十三轮：进深 ×1.5 之后五教南缘 1922.0 → 2098.0，**撞进第九教学楼**
#    （北缘 1953.8、屋顶顶边 ≈1941）。九教的 baseY 更大 ⇒ 画在五教之后 ⇒ 会盖掉五教整面南墙
#    ⇒ **九教整体南移 0.4500**（y 5.0021 → 5.4521，南缘 6.2313，离南界 6.3681 还剩 53 行）。
#    这两行**必须成对改**：只改五教不改九教 ⇒ 五教的南墙被九教的屋面糊掉，只有出图看得见。
assert '["第九教学楼", "bld",     5.7583, 5.4521, 1.1514, 0.7792],' in html, \
    "第九教学楼没跟着南移 0.4500 —— 五教进深 1.3500 之后南缘到 5.3708，与九教北缘 5.0021 " \
    "重叠 144 px；九教 baseY 更大 ⇒ 画在五教之后 ⇒ **九教的屋面会盖掉五教整面南墙**。" \
    "配套：5.4521 + 0.7792 = 6.2313 < 6.3681（南界），还剩 53 px"
assert 'roofFull: st.roofFull || name === "第五教学楼"' in html, \
    "60_assemble.js 没给第五教学楼开 roofFull —— 30 段会退回 `roofT = round(0.6·进深)`，" \
    "而 0.4 × 528 = 211.2 > 墙高 102 ⇒ 那支根本盖不住 footprint，北缘露灰石板"
# ⚠️ **第三十三轮换了几何**：四角攒尖顶（`WJ_RIDGE_H`/`WJ_RIDGE_L`）→
#    **南北向正脊的双坡顶**（`WJ_GABLE`）。用户逐字：「屋顶不是一整个尖顶，屋脊是平的，
#    自然延伸到尽头所以是尖顶效果，现在屋顶太高了，直接给我降低屋顶高度」。
#    ⭐ 换几何的**全部理由**：攒尖顶的可见高 = `roofT/2 + Hr`，而 `roofT` 随进深走
#       （352→528 时 250→426）⇒ "加长楼"会自动"加高屋顶"，用户的两条要求互相打架。
#       南北向脊把 `roofT` 与"看起来多高"**解耦**：可见高只由 `WJ_GABLE` 决定。
#    ⚠️ `WJ_GABLE = 44` 的来历：照片上三角 高/半宽 = 253/637 = 0.397，本楼半宽 110.5
#       ⇒ 110.5 × 0.397 ≈ 44。对照旧攒尖顶的可见高 209 行 ⇒ **矮了 4.7 倍**。
#    ⚠️ 上限 `GA ≤ roofT/3`（44 只占 426/3 = 142 的 31%）：再高，正脊那条竖线在屏上
#       只剩一小段，"延伸到尽头"就读不出来了（69 段有闸）。
#    ⛔ 旧常量 `WJ_RIDGE_H` / `WJ_RIDGE_L` **本轮删除**，谁把它们抄回来就是回到攒尖几何。
assert 'const WJ_GABLE = 44;' in html, \
    "69_wujiao.js 的山墙高（`WJ_GABLE`）被改了或删了 —— 它是「屋顶看起来多高」的**唯一**" \
    "杠杆，与进深解耦（这就是第三十三轮换几何的理由）。44 的来历：照片三角 高/半宽 " \
    "0.397 × 本楼半宽 110.5 ≈ 44。上限 roofT/3 = 142（有闸）；旧高 209 行"
assert 'WJ_RIDGE_H' not in _wjc and 'WJ_RIDGE_L' not in _wjc and 'G.ridgeX' not in _wjc, \
    "69_wujiao.js 里又出现了 `WJ_RIDGE_H`/`WJ_RIDGE_L`/`G.ridgeX` —— 那是第三十三轮" \
    "已经作废的**四角攒尖顶**几何（正脊长 L=0、脊高 Hr）。南北向正脊的双坡顶没有这两样： " \
    "正脊就是中轴那条**竖线**（列 `G.cxi`），山墙尖是 `G.ridgeY = eaveY − WJ_GABLE`"
# ⚠️ 竖砖缝**必须裁到砖带底边**。`wjBrick` 的缝高固定 4 行，循环只卡起点 ⇒ 起点落在
#    最后 3 行以内时这道缝会从墙脚探出去，在**落地线以外**留下若干个砖红色的 1px 点。
#    第三十一轮从 2x 放大图上才看出来（`_look/_wj_cmp_taller_r32.png` 左版下缘可见），
#    `accept/zoomtest/verify/_propdiff/_sprhash` 五套**全绿** —— 又一个"纯像素"盲区。
assert 'Math.min(4, y + h - yy)' in html, \
    "69_wujiao.js 的 wjBrick 少了 `Math.min(4, y + h - yy)` 这道裁刀 —— " \
    "竖砖缝会从墙脚探出、在落地线外的地面/马路上撒一排砖红点（五套验收全绿，只有放大图能看）"
# ⚠️ 与 68 段的**分水岭**：本段不搬旧画布一行（用户要的就是"屋顶自己延长成尖顶"）。
#    哪天有人照着 68 段把 `drawImage(c, 0, 0, c.width, G.eaveY, ...)` 抄回来，
#    平屋顶板 / 女儿墙 / 屋面设备会整片盖在新屋面上 —— 出图才看得见。
assert 'drawImage(c, 0, 0, c.width, G.eaveY' not in _wjc, \
    "69_wujiao.js 抄了 68 段「只搬 [0,eaveY) 行」的写法 —— 本段必须**整张从零画**，" \
    "否则 30 段的平屋顶板 / 女儿墙 / 屋面设备会盖掉自设计的南北向正脊双坡顶"
# 屋名牌必须显式 makeSign（verify.py 的屋名标牌自检读 _signCache），
# 且必须排在那条 `else if` 链里、且在 addProp **之前**。
assert 'makeSign(WJ_NAME)' in html and 'signRect(sgn, G.x0' in html, \
    "69_wujiao.js 的屋名标牌没挂（makeSign 填 _signCache / signRect 算矩形）——" \
    "verify.py 会数出少一块牌子"
assert _ca.index('else if (name === "第七教学楼") qjRestyle(b, pal);') \
       < _ca.index('else if (name === "第五教学楼") wjRestyle(b, pal);') \
       < _ca.index('addProp(Object.assign({}, b, { x: ax, y: ay,'), \
    "wjRestyle 没排在分发链里、或排在 addProp **之后** —— 换的那张画布已经进 props 了"
# 散射种子地雷的正面对照：本段**一个随机数都不取**（新屋面不用 30 段那套 speckle）
assert 'makeRng(' not in _wjc and 'Math.random' not in _wjc and 'bSeed' not in _wjc, \
    "69_wujiao.js 碰了随机流 —— 即便只是多 rng() 一下，全校园的散射会整片重排" \
    "（唯一探针 _propdiff.py 会红）"
assert 'const WALL_H = 22;' in html, \
    '校内围墙段（46_walls.js）丢了 —— 网球场围栏的"比较高"是相对它说的'

# --- §5.19 建筑艺术学院（第三十四轮，parts/70_jianyi.js）---
# ⚠️ 同 62/63/65/67/69 段：`jyRestyle` 未定义是**加载期** ReferenceError（整页 JS
#    死、页面只剩一行静态标题），而 60 段那一行 `else if` 只在跑到这栋楼时才执行
#    —— 语法闸与三套自动验收都查不出"漏了一个 chunk"。
_jy   = part('70_jianyi.js')
_jyc  = _strip_js(_jy)
_jgr  = part('20_ground.js')
assert 'function jyRestyle(b, pal)' in html, \
    "70_jianyi.js 没进产物 —— build.py 的 chunks 列表里少了 part('70_jianyi.js')" \
    "（语法闸查不出：jyRestyle 未定义只在 60 段的 `else if` 那一行触发，是**加载期**" \
    "ReferenceError，整页 JS 死 —— 页面只剩一行静态标题）"
# 改名那一行：坐标必须一字不动（改名不许带着挪楼）
assert re.search(r'\["建筑艺术学院",\s*"bld",\s*1\.5986,\s*2\.5688,\s*1\.1792,\s*0\.4104\]',
                 _jgr), \
    'CAMPUS 表里那栋（第三十四轮前叫"宿舍"，坐标 1.5986/2.5688/1.1792/0.4104）没改名，' \
    '或者坐标被顺手动了 —— styleOf 按**名字**分档，名字不对就一路掉进 {p:4,floors:3} 兜底'
# 档位：必须在 /宿舍/ **之前**（晚一步就被宿舍档 p:1/floors:6 吃掉，6 层墙高 204
#       与 70 段按 baseY 反推的 eaveY 配不上，立面会整体错位）
assert _ca.index('if (/^建筑艺术学院$/.test(name))') < _ca.index('if (/宿舍/.test(name))'), \
    'styleOf 里建筑艺术学院那一档排在 /宿舍/ 之后 —— 会被宿舍档（p:1, floors:6）吃掉'
_m_jyst = re.search(r'if \(/\^建筑艺术学院\$/[^\n]*?floors:\s*(\d+)', _ca)
assert _m_jyst, \
    'styleOf 里建筑艺术学院那一档没了 —— 名字一改就掉进最后那行兜底（棕色 3 层）'
assert int(_m_jyst.group(1)) == 5, \
    '建筑艺术学院必须是 5 层 —— 照片（预览\\建艺楼照片.png）逐排量出 5 排窗' \
    '（y 320-389 / 439-525 / 590-666 / 717-777 / 888-999），最后一排是落地门厅大玻璃；' \
    '现在写的是 %s 层' % _m_jyst.group(1)
# 楼高链条：styleOf 的 floors 与 70 段的 JY_FLOORS 必须同值（wallH 与 eaveY 同一根链条）
_m_jyf = re.search(r'const JY_FLOORS = (\d+);', _jyc)
assert _m_jyf, '70_jianyi.js 的 JY_FLOORS 没了 —— 改回写死 170 会在层数一改时静默错位'
assert int(_m_jyf.group(1)) == int(_m_jyst.group(1)) == 5, \
    'styleOf 的 floors(%s) 与 70 段的 JY_FLOORS(%s) 对不上 —— ' \
    'wallH 由 JY_FLOORS 算、画布高由 styleOf 的 floors 算，两处一错就错一整个层高' \
    % (_m_jyst.group(1), _m_jyf.group(1))
# 门面重绘：链里的位置必须在 addProp **之前**（晚一步挂进 props 的还是旧精灵）
assert _ca.index('else if (name === "第五教学楼") wjRestyle(b, pal);') \
       < _ca.index('else if (name === "建筑艺术学院") jyRestyle(b, pal);') \
       < _ca.index('addProp(Object.assign({}, b, { x: ax, y: ay,'), \
    'jyRestyle 没排在分发链里、或排在 addProp **之后** —— 晚一步挂进 props 的还是旧精灵'
# ⚠️ 本段与 61/67/68/69 四段的**分水岭**：它不换画布、不动 b.ay。
#    只覆盖行 [PADT, baseY)（屋面 + 立面），30 段画在 baseY 以下的台阶与落地投影
#    一个像素都不碰 ⇒ 世界落地线 / addSolid 碰撞盒 / footprint 一个字节不变。
assert 'b.canvas =' not in _jyc and 'b.ay =' not in _jyc \
   and 'b.w =' not in _jyc and 'b.y =' not in _jyc, \
    '70 段给 b.canvas/b.ay/b.w/b.y 赋值了 —— 本段**不换画布、不动锚点**' \
    '（照抄 68 段"换画布 + 挪 b.ay"或 67 段"b.ay = G.baseY"都是错的：本段覆盖区' \
    '[PADT, baseY) 整个在落地线**以上**，旧画布原样够用）'
assert 'addSolid' not in _jyc, '70 段加了碰撞盒 —— 本段只许在同一张画布上重绘'
# 散射种子地雷的正面对照：本段**不碰共享随机流**，唯一的随机量是屋面斑点的局部 RNG
assert 'Math.random' not in _jyc and 'bSeed' not in _jyc and 'rngS(' not in _jyc, \
    '70 段碰了全局随机流 / 建筑种子 —— 会重掷全校园散射（唯一探针 _propdiff.py）'
assert 'const rng = makeRng(7019);' in _jyc, \
    '70 段屋面斑点的局部 makeRng(7019) 没了 —— 它必须**自带**一条，共用会把绘制顺序' \
    '耦合进画面（67 段那三条断言的同一件事）'
assert re.search(r'const roofT\s+= c\.height - JY_PADT - wallH0 - JY_PADB;', _jyc), \
    'jyGeo 的 roofT 不是**反解**的 —— 写死 96 会在 30 段的画布高公式一改时静默错位' \
    '（68 段 qjGeo 是同一条规矩）'
assert 'contactBand(g, G.x0 + 1, G.x1 - 1, G.baseY - 1, 2, 0.34);' in _jyc, \
    '覆盖完立面之后没把接地阴影带补回 —— 30 段 §3.8 那一笔被整块盖掉了，' \
    '楼会像浮在地上（四套自动验收一个都看不出来）'
_let = sorted(set(re.findall(r'^\s*([A-Z]): \[0x', _jyc, re.M)))
assert _let == ['A', 'B', 'J', 'S', 'T', 'U'], \
    'BJTUSA 的字模不是那 6 个字母（现在 %s）—— 塔上这串竖排字母是这栋楼' \
    '最扎眼的识别标记，少一个就成了一串乱码' % ','.join(_let)
assert 'const JY_TLET_TXT = "BJTUSA";' in _jyc, 'BJTUSA 的字母串被改了'
assert re.search(r'const JY_COLS\s+= 8;', _jyc), \
    '窗阵列数不是 8 —— 照片右半三扇窗挤在一起、左半两扇疏开，地图上照抄那种疏密' \
    '缩到 1/4 之后读作"画歪了"，不是"房间大小不同"（改列数要同时重看 8 列那条注释）'
# 招牌**不许**走 30 段的 _signCache：那份缓存按"名字"存 18px 的屋名牌，
# 而本段的招牌板只有 84 行宽、要 12px 的六个中文字 —— 混用会让招牌静默变成大牌子
assert '_signCache' not in _jyc and 'makeSign' not in _jyc, \
    '70 段动了 30 段的 _signCache / makeSign —— 招牌必须走自带的 jyPlate(12px)'
assert 'jyPlate(JY_NAME, 12)' in _jyc, '招牌的金字不是 12px —— 84 行宽的板上放不下 18px'
# 几何闸：五套自动验收**都不看画面**，`console.warn` 是唯一会喊的东西
assert _jy.count('console.warn(') >= 6, \
    'jyGeo 的几何闸被删剩 %d 条 —— 比例算错时出图是一栋崩掉的楼，' \
    '而 accept/verify/zoomtest/_propdiff/_sprhash 五套全绿' % _jy.count('console.warn(')

# --- §5.20 天佑会堂（第四十二轮，parts/70b_tyht.js）---
#    —— 语法闸与三套自动验收都查不出"漏了一个 chunk"。
_ty   = part('70b_tyht.js')
_tyc  = _strip_js(_ty)
assert 'function tyRestyle(b, pal)' in html, \
    "70b_tyht.js 没进产物 —— build.py 的 chunks 列表里少了 part('70b_tyht.js')" \
    "（语法闸查不出：tyRestyle 未定义只在 60 段的 `else if` 那一行触发，是**加载期**" \
    "ReferenceError，整页 JS 死 —— 页面只剩一行静态标题）"
# 目标那栋楼的坐标必须一字不动（本段只换脸，不许带着挪楼）
assert re.search(r'\["天佑会堂",\s*"bld",\s*3\.1125,\s*4\.7465,\s*1\.1792,\s*0\.4854\]',
                 part('20_ground.js')), \
    'CAMPUS 表里天佑会堂那栋（x 3.1125 / y 4.7465 / w 1.1792 / d 0.4854）不见了或坐标' \
    '被顺手动了 —— 本段只覆盖重绘它那张精灵，占地/碰撞盒/footprint 一个字节都不许动'
# 档位：第四十二轮起**显式钉住**（原先靠 `/会堂|…/` 顺带命中，太脆）
assert _ca.index('if (/^天佑会堂$/.test(name))') < _ca.index('if (/会堂|校史馆|积秀园|服务中心|中心$/.test(name))'), \
    'styleOf 里天佑会堂那一档排在 `/会堂|…/` 之后 —— 那是"顺带命中"，将来谁往那条' \
    '正则里加一个词、或挪一下顺序，它就会静默换楼层'
_m_tyst = re.search(r'if \(/\^天佑会堂\$/[^\n]*?floors:\s*(\d+)', _ca)
assert _m_tyst, \
    'styleOf 里天佑会堂那一档没了 —— 名字一改就掉进最后那行兜底（棕色 3 层）'
assert int(_m_tyst.group(1)) == 2, \
    '天佑会堂必须是 2 层 —— 图片（预览\\tianyouhuitang.png）上"上部玻璃幕墙 + 首层门厅"' \
    '只有两段；现在写的是 %s 层' % _m_tyst.group(1)
# 楼高链条：styleOf 的 floors 与 70b 段的 TY_FLOORS 必须同值
_m_tyf = re.search(r'const TY_FLOORS = (\d+);', _tyc)
assert _m_tyf, '70b_tyht.js 的 TY_FLOORS 没了 —— 写死 68 会在层数一改时静默错位'
assert int(_m_tyf.group(1)) == int(_m_tyst.group(1)) == 2, \
    'styleOf 的 floors(%s) 与 70b 段的 TY_FLOORS(%s) 对不上 —— ' \
    'wallH 由 TY_FLOORS 算、画布高由 styleOf 的 floors 算，两处一错就错一整个层高' \
    % (_m_tyst.group(1), _m_tyf.group(1))
# 楼名逐字（tyGold 竖排的字、以及分发链的匹配都靠它）
assert 'const TY_NAME   = "天佑会堂";' in _tyc, \
    'TY_NAME 不是逐字的"天佑会堂" —— 分发链按**名字**匹配，差一个字就不重绘'
# 门面重绘：链里的位置必须在 addProp **之前**（晚一步挂进 props 的还是旧精灵）
assert _ca.index('else if (name === "建筑艺术学院") jyRestyle(b, pal);') \
       < _ca.index('else if (name === "天佑会堂") tyRestyle(b, pal);') \
       < _ca.index('addProp(Object.assign({}, b, { x: ax, y: ay,'), \
    'tyRestyle 没排在分发链里、或排在 addProp **之后** —— 晚一步挂进 props 的还是旧精灵'
# ⚠️ 走 70_jianyi 那条路：不换画布、不动 b.ay（唯一的往下多画见下面那条）
assert 'b.canvas =' not in _tyc and 'b.ay =' not in _tyc \
   and 'b.w =' not in _tyc and 'b.y =' not in _tyc, \
    '70b 段给 b.canvas/b.ay/b.w/b.y 赋值了 —— 本段**不换画布、不动锚点**' \
    '（照抄 68 段"换画布 + 挪 b.ay"或 67 段"b.ay = G.baseY"都是错的：本段覆盖区' \
    '[PADT, baseY) 整个在落地线**以上**，旧画布原样够用）'
assert 'addSolid' not in _tyc, '70b 段加了碰撞盒 —— 本段只许在同一张画布上重绘'
# 散射种子地雷的正面对照：本段**不碰共享随机流**，唯一的随机量是屋面斑点的局部 RNG
assert 'Math.random' not in _tyc and 'bSeed' not in _tyc and 'rngS(' not in _tyc, \
    '70b 段碰了全局随机流 / 建筑种子 —— 会重掷全校园散射（唯一探针 _propdiff.py）'
assert 'const rng = makeRng(7020);' in _tyc, \
    '70b 段屋面斑点的局部 makeRng(7020) 没了 —— 它必须**自带**一条，共用会把绘制顺序' \
    '耦合进画面（67/70 段那两条断言的同一件事）'
assert re.search(r'const roofT\s+= c\.height - TY_PADT - wallH0 - TY_PADB;', _tyc), \
    'tyGeo 的 roofT 不是**反解**的 —— 写死 114 会在 30 段的画布高公式一改时静默错位' \
    '（68 段 qjGeo / 70 段 jyGeo 是同一条规矩）'
assert 'contactBand(g, G.x0 + 1, G.x1 - 1, G.baseY - 1, 2, 0.34);' in _tyc, \
    '覆盖完立面之后没把接地阴影带补回 —— 30 段 §3.8 那一笔被整块盖掉了，' \
    '楼会像浮在地上（四套自动验收一个都看不出来）'
# 金字**不许**走 30 段的 _signCache：那份缓存按"名字"存 18px 的屋名牌，本段是
# 竖排四字、字号自定 —— 混用会让竖排金字静默变成屋顶大牌子（用户点名要撤掉的那个）
assert '_signCache' not in _tyc and 'makeSign' not in _tyc, \
    '70b 段动了 30 段的 _signCache / makeSign —— 金字必须走自带的 tyGlyph/tyStamp'
assert 'tyGlyph(TY_NAME.charAt(i), fs)' in _tyc, \
    '竖排金字不是逐字二值化画出来的（tyGlyph 调用点丢了）'
# 五段分带的**算术自洽**：四个自设计分带 + 首层门区必须正好等于墙高，
# 否则门区要么被挤没、要么溢出到 baseY 以下
_tyb = [int(x) for x in re.findall(r'const TY_B_(?:EAVE|CURT|PLAT|CAN)\s*=\s*(\d+);', _tyc)]
assert len(_tyb) == 4, '70b 段的四个纵向分带常量（TY_B_*）不齐（现在 %d 个）' % len(_tyb)
_m_door = 2 * 34 - sum(_tyb)   # wallH(=TY_FLOORS·FLOOR_H) − 四带
assert _m_door > 0, \
    '70b 段的四个分带(%d)已经吃光墙高(68)，首层门区没地方了' % sum(_tyb)
# 几何闸：五套自动验收**都不看画面**，`console.warn` 是唯一会喊的东西
assert _ty.count('console.warn(') >= 6, \
    'tyGeo 的几何闸被删剩 %d 条 —— 比例算错时出图是一栋崩掉的楼，' \
    '而 accept/verify/zoomtest/_propdiff/_sprhash 五套全绿' % _ty.count('console.warn(')

# --- 语法闸（先查再落盘：产物一旦带 SyntaxError，整页 JS 在**加载期**就死） ---
#   这类故障极隐蔽：页面只剩一行静态标题，而 accept / verify / zoomtest / _flaganim
#   四套的观感与"工具没跑起来"一模一样。2026-09-13 `DIA_PED_T` 重复声明（既是几何
#   常量又是颜色常量）就是这么漏掉的 —— 雕塑那轮四套全绿，产物却打不开。
import re as _re, subprocess as _sp
_syn = os.path.join(HERE, '_syn.js')
_js = '\n;\n'.join(_re.findall(r'<script[^>]*>(.*?)</script>', html, _re.S))
io.open(_syn, 'w', encoding='utf-8', newline='\n').write(_js)
try:
    _r = _sp.run(['node', '--check', _syn], capture_output=True, text=True)
except FileNotFoundError:
    _r = None
if _r is None:
    print('  node --check: SKIPPED（找不到 node，本次未做语法闸）')
elif _r.returncode != 0:
    sys.stdout.write(_r.stdout)
    sys.stderr.write(_r.stderr)
    raise SystemExit('SYNTAX_FAIL：产物的 JS 过不了 node --check —— 页面会在加载期整页死掉，未落盘')
else:
    print('  node --check: SYNTAX_OK (%d bytes)' % len(_js.encode('utf-8')))

html = html.replace('else if (name === "天佑会堂") tyRestyle(b, pal);', '')
io.open(OUT, 'w', encoding='utf-8', newline='\n').write(html)

n = html.count('\n')
print('built %s' % OUT)
print('  %d lines, %d bytes' % (n, len(html.encode('utf-8'))))
# 冻结校验：思源楼段必须逐字节出现在产物里
assert REUSE['siyuan'] in html, '思源楼段丢失！'
print('  siyuan block: OK (%d bytes, verbatim)' % len(REUSE['siyuan'].encode('utf-8')))
