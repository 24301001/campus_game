# -*- coding: utf-8 -*-
"""一次性探针（第三十二轮）：给**任意一份产物 html** 出指定档位的实景图。

为什么不能直接用 shot.py：`shot.py` 把 SRC 写死成项目根那份 `像素校园_全校地图.html`，
所以它拍不出 `_look/_delivered_r31.html` 这种历史备份。
第三十二轮要做的对照 = **同一个世界窗口**下 r31 备份 vs 当前产物，
而 `shot.py z` 的取景只由 `player.x/y` 决定（窗口恒 1480×900）
⇒ 两次调用传**同一组 x,y** 就是逐像素同框。

用法:
  python _wjscene.py <产物html> <档位> <x> <y> <出图.png>
其余取景逻辑与 shot.py 的 `z` 分支**逐字相同**（含 cam 跟随后 clamp）。
"""
import io, os, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

TAIL = """
<script>
window.addEventListener('load', function(){ setTimeout(function(){
  try{
    var want = '%(Z)s';
    var idx = -1;
    if (want === 'fit') idx = 0;
    else for (var i = 0; i < ZOOM_STEPS.length; i++)
      if (Math.abs(ZOOM_STEPS[i] - parseFloat(want)) < 1e-6) idx = i;
    if (idx < 0) throw new Error('无此档位: ' + want);
    player.x = %(X)d; player.y = %(Y)d;
    setZoom(idx);
    cam.x = Math.max(0, Math.min(player.x - viewW / 2,    Math.max(0, WORLD_W - viewW)));
    cam.y = Math.max(0, Math.min(player.y - viewH * 0.62, Math.max(0, WORLD_H - viewH)));
    render();
    var c = document.getElementById('cv');
    c.style.width = (VIEW_W * %(S)d) + 'px'; c.style.height = (VIEW_H * %(S)d) + 'px';
    document.title = 'DIAG|idx=' + idx + ' zoom=' + zoom
      + ' view=' + Math.round(viewW) + 'x' + Math.round(viewH)
      + ' cam=' + Math.round(cam.x) + ',' + Math.round(cam.y);
  }catch(e){ document.title='DIAG|EX ' + e.message; }
}, 2500); });
</script>
"""

INJECT = """<script>
window.__diag=[];window.onerror=function(m,s,l,c){window.__diag.push('ERR '+m+' @'+l+':'+c);};
</script>
"""


def main():
    src, z, x, y, out = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4]), sys.argv[5]
    html = io.open(src, encoding='utf-8').read()
    html = html.replace('<script>', INJECT + '<script>', 1)
    html = html.replace('</body>', TAIL % {'Z': z, 'X': x, 'Y': y, 'S': 3} + '</body>', 1)
    tmp = os.path.join(HERE, '_wjscene_gen.html')
    io.open(tmp, 'w', encoding='utf-8', newline='\n').write(html)
    out = os.path.abspath(out)
    subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--no-sandbox',
                    '--hide-scrollbars', '--virtual-time-budget=20000',
                    '--window-size=%d,%d' % (480 * 3 + 40, 270 * 3 + 90),
                    '--screenshot=' + out, 'file:///' + tmp],
                   stderr=subprocess.DEVNULL, check=False)
    print(out, os.path.getsize(out) if os.path.exists(out) else 'MISSING')


main()
