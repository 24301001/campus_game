# -*- coding: utf-8 -*-
"""把 `build.py` 的 `_strip_js` 换成"认字符串"的版本，逐 part 对比新旧输出。

为什么必须留下它（第十九轮，2026-09-20）：
  `_strip_js` 原来是两条裸正则，剥 `//[^\\n]*$` 时**不认字符串字面量** ⇒ b64 点阵里
  只要出现 `//`，那一行从 `//` 起被吃到行尾、**数据静默截断而所有断言照过**
  （存在性断言 `'X' in code` 不受截断影响）。实测咬过 5 个 part。
  换实现时**必须证明"除了这几处截断，别处逐字节不动"** —— 靠"跑一遍全绿"是证明不了的，
  因为绿灯只说明新实现与当前代码不冲突，不说明它没改别处的判据。
  本工具就是那条证明：全库逐 part 跑新旧两版、只报差异。

用法：python _stripdiff.py
  → 每处差异打印所在 part 与 unified diff 片段，末尾给"有差异的 part"计数。
  ⚠️ **正确输出 = 只报出"含 `//` 的点阵行"那几处**；多报任何一处都说明新实现有副作用。
  ⚠️ 两版对 `/* */` 与 `//` 的输出口径**故意逐字节相同**（前者→一个空格、后者→直接删）。
"""
import io, os, re, difflib

HERE = os.path.dirname(os.path.abspath(__file__))
PARTS = os.path.join(HERE, 'parts')
BS = chr(92)          # 反斜杠（不直接在源码里写，避免行尾转义踩坑）


def old_strip(s):
    """第十九轮之前 build.py 里的实现（留着当对照基准，别删）。"""
    s = re.sub(r'/\*.*?\*/', ' ', s, flags=re.S)
    return re.sub(r'(?m)//[^\n]*$', '', s)


def new_strip(s):
    """现在 build.py 里的实现（认字符串 + 转义）。两处改动要同步改。"""
    out = []
    i, n = 0, len(s)
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


def main():
    tot = 0
    for fn in sorted(os.listdir(PARTS)):
        if not fn.endswith('.js'):
            continue
        s = io.open(os.path.join(PARTS, fn), encoding='utf-8').read()
        a, b = old_strip(s), new_strip(s)
        if a != b:
            tot += 1
            print('=== %s 不同 ===' % fn)
            al, bl = a.split('\n'), b.split('\n')
            d = list(difflib.unified_diff(al, bl, lineterm='', n=0))[2:]
            for l in d[:40]:
                print('   ', l[:140])
            print('    行数 %d vs %d' % (len(al), len(bl)))
    print('---- 有差异的 part：%d ----' % tot)


if __name__ == '__main__':
    main()
