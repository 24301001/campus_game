# -*- coding: utf-8 -*-
"""抓**加载期 JS 错误**（window.onerror）+ props 条数 —— 页面"是不是活着"的唯一探针。

用法:
  python _build/_err.py [wait_ms] [html]

为什么要单独有这个工具（2026-09-17 §5.10 那轮踩出来的）：
  加载期抛 ReferenceError（比如引用了不存在的全局 `SHX`）时，`<script>` 从那行起
  整段不再执行 ⇒ **整页 JS 死**。而它的表现是：
    · `node --check` 过（语法没错）              —— 语法闸查不出
    · accept / verify / zoomtest **三套全绿**     —— 它们查的是"页面里的数"，不是"页面有没有数"
    · `_propdiff` / `_sprhash` 也只是道具表不同   —— 看不出根因
    · `_propview.py <tag>` 只报一句 `no prop tag`  —— **看着像"这个道具没加进去"**，
      实际上是页面在装到一半时就死了（本轮实测：props 停在 67 件）
  ⇒ 凡是"改了加载期代码之后道具忽然找不到了"，第一个该跑的就是这个。

输出（一张页面一条 `KEY|value` 行）：
  ERR|<错误1> ;; <错误2> ... |props=<n 或 UNDEF/EX:...>
    · 第一段 `clean` = 无 onerror
    · 第二段是 props 的真实条数（不是"某 tag 找到几个"）

⚠️ 与 _propview / _scene 同一套 headless 约定：--dump-dom 读 <title>，
   --virtual-time-budget 冻结虚拟时钟（真机计时另见 _edge.py）。
"""
import io, os, re, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(HERE)
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

HARNESS = (u"<script>window.__ERR=[];"
           u"window.onerror=function(m,s,l){window.__ERR.push(m+'@'+l);return false;};"
           u"</script>")

TAIL = u"""<script>
setTimeout(function(){
  var d = window.__ERR || [];
  var n = 'UNDEF';
  try { n = props.length; } catch(e) { n = 'EX:' + e.message; }
  document.title = 'ERR|' + (d.join(' ;; ') || 'clean') + '|props=' + n;
}, %(WAIT)d);
</script>"""


def main():
    a = sys.argv[1:]
    wait = int(a[0]) if a else 1200
    src = a[1] if len(a) > 1 else os.path.join(PROJ, u'像素校园_全校地图.html')
    html = io.open(src, encoding='utf-8').read()
    html = html.replace(u'<body>', HARNESS + u'\n<body>', 1)
    html = html.replace(u'</body>', (TAIL % {'WAIT': wait}) + u'\n</body>', 1)
    tmp = os.path.join(HERE, '_err_tmp.html')
    io.open(tmp, 'w', encoding='utf-8', newline='\n').write(html)
    try:
        out = subprocess.check_output(
            [CHROME, '--headless', '--disable-gpu', '--virtual-time-budget=%d' % (wait + 4000),
             '--dump-dom', tmp], stderr=subprocess.STDOUT)
    finally:
        os.remove(tmp)
    m = re.search(r'<title>(.*?)</title>', out.decode('utf-8', 'replace'), re.S)
    if not m:
        print('ERR|NO-TITLE（页面连 title 都没有，多半是整页死透了）|props=?')
        return 1
    t = m.group(1)
    for part in t.split('|'):
        print(part)
    return 0 if u'|props=' in t and t.split('|')[1] == u'clean' else 1


if __name__ == '__main__':
    sys.exit(main())
