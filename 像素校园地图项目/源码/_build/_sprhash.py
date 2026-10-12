# -*- coding: utf-8 -*-
"""像素校园 —— 逐件道具的**精灵像素**哈希对照（`_propdiff` 的像素层补充）。

用途：`_propdiff.py` 的签名是 `tag,x,y,w,h` —— 只看摆在哪、多大，**不看画的是什么**。
第十轮（楼顶"凸"形 + 撤屋名标牌）改的恰好是**纯像素**：两栋楼的精灵尺寸、位置、
道具集合全都不变，所以 `_propdiff` 一个字都不会报。这里补上那一层：
把每件道具精灵的**全部像素**哈希下来，逐件对照，证明"只有那两件变了、别的逐字节不动"。
实测：`old 305 / new 305 / identical 303`，差异**恰好**是两栋思源楼（当时签名里的 `513,439`
与 `423,429`；第十六轮两栋减两层后是 `513,371` 与 `423,361`）—— 与改动的预期完全吻合。

用法：
  python _build/_sprhash.py dump <产物.html> > a.txt
  python _build/_sprhash.py dump <另一个产物.html> > b.txt
  python _build/_sprhash.py diff a.txt b.txt

⚠️ 同样跳过 `tag === 'duck'`（每帧被 animateWater 移动的活物）与 `tag === 'flag'`
   （每帧被 animateFlag 换上另一张 flagFrames 的活物）—— 两者的哈希都取决于
   `--dump-dom` 取数时撞上第几帧，是噪声不是差异（第十五轮实测坐实）。"""
import io, os, re, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
TMP = os.path.join(HERE, '_sprhash_gen.html')
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

TAIL = """
<script>
(function(){
  var out = [];
  function h32(u32){
    var h = 2166136261;
    for (var i = 0; i < u32.length; i++){ h ^= u32[i]; h = (h * 16777619) >>> 0; }
    return h;
  }
  for (var i = 0; i < props.length; i++) {
    var p = props[i];
    /* ⚠️ 跳过鸭子**和旗子**：两者都是每帧换 img 的活物（鸭子被 animateWater 挪位、
       旗子被 animateFlag 逐帧换 flagFrames），哈希取决于 --dump-dom 取数时撞上第几帧。
       实测（第十五轮）：**同一份旧产物连 dump 两次**，flag 那件就报
       `fd36874 -> 866c3cb0` —— 与改动无关的纯噪声。留在签名里就会把每一轮都拖去
       查一只不存在的鬼。 */
    if (p.tag === 'duck' || p.tag === 'flag') continue;
    var c = p.img, g = c.getContext('2d'), d;
    try { d = g.getImageData(0, 0, c.width, c.height).data; }
    catch (e) { out.push('ERR,' + e.message); continue; }
    var u = new Uint32Array(d.buffer);
    out.push([p.tag || '-', p.x | 0, p.y | 0, c.width, c.height, h32(u).toString(16)]
             .join(','));
  }
  document.title = 'SH|' + out.join(' ');
})();
</script>
"""


def dump(path):
    html = io.open(path, encoding='utf-8').read()
    assert '</body>' in html, 'not an artifact html'
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
    m = re.search(r'<title>SH\|(.*?)</title>', p.stdout.decode('utf-8', 'replace'), re.S)
    assert m, 'no prop table -- page dead at load?'
    return m.group(1).split(' ')


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        raise SystemExit(2)
    cmd = sys.argv[1]
    if cmd == 'dump':
        for line in dump(sys.argv[2]):
            print(line)
        return
    if cmd == 'diff':
        a = [l for l in io.open(sys.argv[2], encoding='utf-8').read().split('\n') if l]
        b = [l for l in io.open(sys.argv[3], encoding='utf-8').read().split('\n') if l]
        ka = dict((l.rsplit(',', 1)[0], l.rsplit(',', 1)[1]) for l in a)
        kb = dict((l.rsplit(',', 1)[0], l.rsplit(',', 1)[1]) for l in b)
        same = 0
        print('keys old %d / new %d' % (len(ka), len(kb)))
        for k in sorted(set(ka) & set(kb)):
            if ka[k] == kb[k]:
                same += 1
            else:
                print('  PIXELS DIFFER: %s   %s -> %s' % (k, ka[k], kb[k]))
        for k in sorted(set(ka) - set(kb)):
            print('  ONLY-OLD: %s' % k)
        for k in sorted(set(kb) - set(ka)):
            print('  ONLY-NEW: %s' % k)
        print('  identical %d / %d' % (same, len(ka)))
        return
    print(__doc__)
    raise SystemExit(2)


main()
