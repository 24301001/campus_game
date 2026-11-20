# -*- coding: utf-8 -*-
"""把「楼体资源」的楼体精灵接进**已存在**的地图 HTML（2026-11-07）。

为什么不是跑 build.py：这个 checkout 里 `_look/j9_table.txt` 等第 27 轮的几何权威
产物不在，build.py 会在第 3277 行直接断言失败；而根目录那份地图还领先源码
（鸭子咬人 / 楼宇主页 / 猫不下水 / app-track 都只在根目录那份里）。所以这轮的
交付方式是**就地插入**同一份源码：

    · 库 = `楼体资源/style.js` + 各栋 `楼体资源/buildings/*.js`
          + `源码/_build/parts/35_west_sprite.js`（西侧一列七栋）
          + `源码/_build/parts/36_center_sprite.js`（中部一列四栋 + 积秀园公园）
          + `源码/_build/parts/37b_farwest_sprite.js`（远端西侧两行 + 活动中心地坪）
    · 插入点 = `/* --- 6.2 批量生成建筑 --- */` 之前（必须在建筑循环之前）
    · 调用点 = `westSpriteApply(e, b);` 之后（60 段循环内、addProp 之前）

三份地图都会改：根目录（大厅实际服务的那份）、项目根、源码。幂等：已插入的
内容会原地更新/跳过。用法：`python _west_apply.py`。
"""
import io
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
SRC_DIR = os.path.dirname(HERE)                 # .../像素校园地图项目/源码
PROJ = os.path.dirname(SRC_DIR)                 # .../像素校园地图项目
ROOT = os.path.dirname(PROJ)                    # .../campus_game

MAPS = [
    os.path.join(ROOT, '像素校园_全校地图.html'),
    os.path.join(PROJ, '像素校园_全校地图.html'),
    os.path.join(SRC_DIR, '像素校园_全校地图.html'),
]

LIB_HEADER = '/* ===== 楼体资源 · 西侧一列七栋（2026-11-07） ===== */'
LIB_MARK = '/* --- 6.2 批量生成建筑 --- */'
CALL_MARK = '  const ax = R.x + R.w / 2, ay = R.y + R.h;'
CALL = '  westSpriteApply(e, b);\n' + CALL_MARK
HOOK_START = 'const WEST_SPRITE_X = 1.5986;'
HOOK_END = '  b.ay = s.ay + (WEST_SPRITE_DY[item.id] || 0);\n  return true;\n}'
OLD_HOOK_END = '  b.ay = s.ay;\n  return true;\n}'

PICK = ['buildings/01_jianyi.js', 'buildings/05_d19.js', 'buildings/06_d2.js',
        'buildings/07_d12.js', 'buildings/09_yanjiu.js', 'buildings/10_d9.js',
        'buildings/11_d8.js', 'buildings/12_d15.js']

CENTER_MARK = '/* ===== 楼体资源 · 中部一列（2026-11-07） ===== */'
CENTER_END = '/* ===== 楼体资源 · 中部一列 · 结束 ===== */'
CENTER_PICK = ['buildings/02_xinxi.js', 'buildings/03_tyht.js',
               'buildings/08_xiaoshi.js']
CENTER_CALL = '  centerSpriteApply(e, b);\n'

FARWEST_MARK = '/* ===== 楼体资源 · 远端西侧（2026-11-07） ===== */'
FARWEST_END = '/* ===== 楼体资源 · 远端西侧 · 结束 ===== */'
FARWEST_PICK = ['buildings/04_xsh.js', 'buildings/13_d22.js']
FARWEST_CALL = '  farwestSpriteApply(e, b);\n'


def read(path):
    with open(path, 'rb') as f:
        return f.read().decode('utf-8')


def write(path, text):
    with open(path, 'wb') as f:
        f.write(text.encode('utf-8'))


def load_hook():
    return read(os.path.join(HERE, 'parts', '35_west_sprite.js')).rstrip('\n')


def load_center_hook():
    return read(os.path.join(HERE, 'parts', '36_center_sprite.js')).rstrip('\n')


def load_farwest_hook():
    return read(os.path.join(HERE, 'parts', '37b_farwest_sprite.js')).rstrip('\n')


def load_lib_assets():
    """库头 + style.js + 西侧一列用到的各栋（**不含** 35 段本身）。
    每次都按文件重读：后续轮次往 PICK 里加楼（如 05_d19）时，已注入过的地图
    也能自动补上 —— 只替换 hook 的话新楼永远进不去（2026-11-07 踩过）。"""
    res = os.path.join(PROJ, '楼体资源')
    parts = [LIB_HEADER + '\n',
             'window.PC_BUILDINGS = window.PC_BUILDINGS || [];\n']
    parts.append(read(os.path.join(res, 'style.js')))
    for rel in PICK:
        parts.append(read(os.path.join(res, rel)))
    return '\n'.join(parts) + '\n'


def load_lib():
    return load_lib_assets() + load_hook() + '\n'


def load_center_block():
    res = os.path.join(PROJ, '楼体资源')
    parts = [CENTER_MARK + '\n']
    for rel in CENTER_PICK:
        parts.append(read(os.path.join(res, rel)) + '\n')
    parts.append(load_center_hook() + '\n')
    parts.append(CENTER_END + '\n')
    return '\n'.join(parts)


def load_farwest_block():
    res = os.path.join(PROJ, '楼体资源')
    parts = [FARWEST_MARK + '\n']
    for rel in FARWEST_PICK:
        parts.append(read(os.path.join(res, rel)) + '\n')
    parts.append(load_farwest_hook() + '\n')
    parts.append(FARWEST_END + '\n')
    return '\n'.join(parts)


def apply_west(text, hook):
    block = hook[hook.index(HOOK_START):]
    if 'function westSpriteApply(e, b)' in text:
        state = 'skip'
        li = text.index(LIB_HEADER)
        hi = text.index(HOOK_START)
        assets = load_lib_assets()
        if text[li:hi] != assets:
            text = text[:li] + assets + text[hi:]
            state = 'update'
        hi = text.index(HOOK_START)
        end = HOOK_END if HOOK_END in text else OLD_HOOK_END
        ei = text.index(end, hi) + len(end)
        if text[hi:ei] != block:
            text = text[:hi] + block + text[ei:]
            state = 'update'
        return text, state
    assert text.count(LIB_MARK) == 1, LIB_MARK
    assert text.count(CALL_MARK) == 1, CALL_MARK
    text = text.replace(CALL_MARK, CALL, 1)
    text = text.replace(LIB_MARK, load_lib() + '\n' + LIB_MARK, 1)
    return text, 'ok'


def apply_center(text, block):
    block = block.rstrip('\n')
    if CENTER_MARK in text:
        si = text.index(CENTER_MARK)
        if CENTER_END in text:
            ei = text.index(CENTER_END, si) + len(CENTER_END)
        else:
            ei = text.index(LIB_MARK, si)
        if text[si:ei].rstrip('\n') == block:
            state = 'skip'
        else:
            text = text[:si] + block + text[ei:]
            state = 'update'
    else:
        assert text.count(LIB_MARK) == 1, LIB_MARK
        text = text.replace(LIB_MARK, block + '\n\n' + LIB_MARK, 1)
        state = 'ok'
    if CENTER_CALL not in text:
        assert text.count('  westSpriteApply(e, b);\n') == 1
        text = text.replace('  westSpriteApply(e, b);\n',
                            '  westSpriteApply(e, b);\n' + CENTER_CALL, 1)
        state += '+call'
    return text, state


def apply_farwest(text, block):
    block = block.rstrip('\n')
    if FARWEST_MARK in text:
        si = text.index(FARWEST_MARK)
        if FARWEST_END in text:
            ei = text.index(FARWEST_END, si) + len(FARWEST_END)
        else:
            ei = text.index(LIB_MARK, si)
        if text[si:ei].rstrip('\n') == block:
            state = 'skip'
        else:
            text = text[:si] + block + text[ei:]
            state = 'update'
    else:
        assert text.count(LIB_MARK) == 1, LIB_MARK
        text = text.replace(LIB_MARK, block + '\n\n' + LIB_MARK, 1)
        state = 'ok'
    if FARWEST_CALL not in text:
        assert text.count(CENTER_CALL) == 1
        text = text.replace(CENTER_CALL, CENTER_CALL + FARWEST_CALL, 1)
        state += '+call'
    return text, state


def main():
    hook = load_hook()
    center_block = load_center_block()
    farwest_block = load_farwest_block()
    for path in MAPS:
        text = read(path)
        text, sw = apply_west(text, hook)
        text, sc = apply_center(text, center_block)
        text, sf = apply_farwest(text, farwest_block)
        if any(k in (sw, sc, sf) for k in ('ok', 'update', 'call')):
            write(path, text)
        print('west=%s center=%s farwest=%s %s (%d chars)'
              % (sw, sc, sf, path, len(text)))
    return 0


if __name__ == '__main__':
    sys.exit(main())
