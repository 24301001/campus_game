# -*- coding: utf-8 -*-
"""第四十二轮一次性探针：天佑会堂实景出图（绕开第 41 轮的登录门）。

与 _wjscene.py 同一套取景逻辑，只在 render() 前多做一件事：把登录遮罩
（id="login"，71b_center.js L103）直接 hidden —— 否则截图正中是一个登录框，
而且它带全屏半透明黑，整张图都发暗，看不出楼的真实颜色。

用法:
  python _tyscene.py <档位> <x> <y> <出图.png>
档位取值 = ZOOM_STEPS 里的数（1/8 1/6 1/4 1/3 1/2 1 2 3 或 fit）。
"""
import io, os, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(HERE)
SRC = os.path.join(PROJ, u'像素校园_全校地图.html')
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
    var le = document.getElementById('login'); if (le) le.hidden = true;
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
    z, x, y, out = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), sys.argv[4]
    html = io.open(SRC, encoding='utf-8').read()
    html = html.replace('<script>', INJECT + '<script>', 1)
    html = html.replace('</body>', TAIL % {'Z': z, 'X': x, 'Y': y, 'S': 3} + '</body>', 1)
    tmp = os.path.join(HERE, '_tyscene_gen.html')
    io.open(tmp, 'w', encoding='utf-8', newline='\n').write(html)
    out = os.path.abspath(out)
    subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--no-sandbox',
                    '--hide-scrollbars', '--virtual-time-budget=20000',
                    '--window-size=%d,%d' % (480 * 3 + 40, 270 * 3 + 90),
                    '--screenshot=' + out, 'file:///' + tmp.replace('\\', '/')],
                   check=False, capture_output=True)
    print(out, os.path.getsize(out) if os.path.exists(out) else 'MISSING')


main()
