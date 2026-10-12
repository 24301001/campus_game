# -*- coding: utf-8 -*-
"""像素校园 —— 道具集合对照（查"改一处、别处静悄悄挪了"这类事故）

用法：
  python _build/_propdiff.py dump <产物.html>            # 打印道具签名，重定向存盘
  python _build/_propdiff.py diff <旧产物> <新产物>      # 对照两版道具集合，只报差异

为什么要有这个工具（2026-09-13 第六轮实录）：
  给湖心岛 / 石塔补碰撞盒之后，`solids` 从 205 变 207 是**预期**的，但 `props` 从
  303 变成了 305 —— 多了一丛灌木和一棵树，都在东侧校区，离明湖一千多像素。
  根因是 `scatter()`（60_assemble.js §6.6）那句 `if (ptBlocked(x, y, 13, 8)) continue;`：
  新增的盒子挡住了**与岛同行**的那两个散射候选点，该行后半段的候选点因此全部挪位
  （`x = gx + (rngS()-0.5)*54`），有几个从水格挪到了草格，于是长出了道具。
  再往下还有一个隐蔽处：**道具构造本身要吃 `rngS`**，所以"少抽的 r 次"与"多造的道具次数"
  在该行内互相抵消，随机流到行尾**自己对齐** —— 全校园地面噪声没有被重掷（已实测：
  `rngS` 总调用次数两边都是 4375，302/303 个道具逐字节相同）。

  ⚠️ 三套自动验收（accept / verify / zoomtest）**一个数都不会变**，肉眼看图也看不出
     （那两件东西在画面另一边）。这与 README 里"改水域重掷全校园地面噪声"是同一类事故，
     判据只有"把道具集合整个比一遍"。所以这个工具不是可选的，是这类改动的**唯一**探针。

  ⚠️ 判读口径：`solids` 增减是**预期**结果，不进本表的判据；本表只看 props。
     新增/删除道具**不必然是错**，但必须逐条解释得清（哪一格、为什么、合不合法）。
"""
import io, os, re, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(HERE)
TMP = os.path.join(HERE, '_propdiff_gen.html')
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

TAIL = """
<script>
(function(){
  var out = [];
  for (var i = 0; i < props.length; i++) {
    var p = props[i];
    /* ⚠️ 跳过鸭子：它们是每帧被 animateWater 移动的**活物**，位置取决于
       --dump-dom 取数时撞上了第几帧 rAF（实测两版之间差 1 帧、三只鸭子全挪位），
       留在签名里就是纯噪声 —— 第一版没跳，diff 里冒出 3 删 3 加全是假的。 */
    if (p.tag === 'duck') continue;
    out.push([p.tag || '-', p.x | 0, p.y | 0, p.img.width, p.img.height].join(','));
  }
  document.title = 'PD|' + out.join(' ');
})();
</script>
"""


def dump(path):
    html = io.open(path, encoding='utf-8').read()
    assert '</body>' in html, '不是产物 HTML（没有 </body>）'
    io.open(TMP, 'w', encoding='utf-8', newline='\n').write(
        html.replace('</body>', TAIL + '</body>', 1))
    try:
        p = subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--no-sandbox',
                            '--hide-scrollbars', '--window-size=1200,700',
                            '--dump-dom', 'file:///' + TMP],
                           capture_output=True, check=False)
    finally:
        if os.path.exists(TMP):
            os.remove(TMP)
    m = re.search(r'<title>PD\|(.*?)</title>', p.stdout.decode('utf-8', 'replace'), re.S)
    assert m, '没取到道具表 —— 产物在加载期就死了？'
    return m.group(1).split(' ')


def main():
    if len(sys.argv) < 3:
        print(__doc__)
        raise SystemExit(2)
    cmd = sys.argv[1]
    if cmd == 'dump':
        for line in dump(sys.argv[2]):
            print(line)
        return
    if cmd != 'diff':
        print(__doc__)
        raise SystemExit(2)
    a, b = sorted(dump(sys.argv[2])), sorted(dump(sys.argv[3]))
    sa, sb = set(a), set(b)
    same, only_a, only_b = sa & sb, sa - sb, sb - sa
    # ⚠️ 控制台是 GBK，非 ASCII 会直接 UnicodeEncodeError（本项目老坑）——只用 ASCII
    print('props (ducks excluded): old %d / new %d / byte-identical %d'
          % (len(a), len(b), len(same)))
    for label, lst in (('ONLY-OLD (dropped)', only_a), ('ONLY-NEW (added)', only_b)):
        print('  %s: %d' % (label, len(lst)))
        for line in sorted(lst):
            print('    ' + line)
    if not only_a and not only_b:
        print('  => prop set is byte-identical')
    else:
        print('  !! every line above needs a reason (which grid cell / why / legal?)'
              ' -- otherwise something else moved silently')


main()
