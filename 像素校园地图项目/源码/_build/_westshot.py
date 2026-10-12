# -*- coding: utf-8 -*-
"""一次性取景器（第四十七轮）：绕开登录门，出**带建筑精灵**的实景图。

为什么不能直接用 shot.py：它的 INJECT 没有种 `localStorage.token`，
登录门（`loginGate()` 见 `localStorage.token` 就自己藏）会盖住整屏。
用法：`python _build/_westshot.py <x> <y> [zoom] [out]`（其余照 shot.py 的 <x y> 分支）。
用完即删（逐个精确路径）。"""
import io, os, shutil, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(HERE)
SRC = os.path.join(PROJ, u'像素校园_全校地图.html')
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

INJECT = """<script>
try { localStorage.setItem('token', 'probe-47'); } catch (e) {}
window.__diag=[];window.onerror=function(m,s,l,c){window.__diag.push('ERR '+m+' @'+l+':'+c);};
</script>
"""

TAIL = """
<script>
window.addEventListener('load', function(){ setTimeout(function(){
  try{
    player.x = %(X)d; player.y = %(Y)d;
    var c=document.getElementById('cv');
    c.style.width=(VIEW_W*%(Z)d)+'px'; c.style.height=(VIEW_H*%(Z)d)+'px';
    document.title='DIAG|'+(window.__diag.join(' || ')||'clean');
  }catch(e){ document.title='DIAG|EX '+e.message; }
}, 2500); });
</script>
"""


TAIL_OVER =	"""
<script>
window.addEventListener('load', function(){ setTimeout(function(){
  try{
    var S=%(D)d, c=document.getElementById('cv');
    c.width=Math.round(WORLD_W/S); c.height=Math.round(WORLD_H/S);
    c.style.width=c.width+'px'; c.style.height=c.height+'px';
    var g2=c.getContext('2d'); g2.imageSmoothingEnabled=false;
    g2.drawImage(groundCanvas,0,0,WORLD_W,WORLD_H,0,0,c.width,c.height);
    props.sort(function(a,b){return a.baseY-b.baseY;});
    for(var i=0;i<props.length;i++){var p=props[i];
      g2.drawImage(p.img,(p.x-p.ax)/S,(p.y-p.ay)/S,p.img.width/S,p.img.height/S);}
    g2.fillStyle='#00ff00'; g2.fillRect(SPAWN.x/S-4,SPAWN.y/S-4,8,8);
    render=function(){};
    document.title='DIAG|'+(window.__diag.join(' || ')||'clean');
  }catch(e){ document.title='DIAG|EX '+e.message; }
}, 2500); });
</script>
"""


def main():
    a = sys.argv[1:]
    if a[0] == 'over':
        d = int(a[1]) if len(a) > 1 else 2
        out = a[2] if len(a) > 2 else os.path.join(HERE, '_look', 'west_over.png')
        tail, win = TAIL_OVER % {'D': d}, (1400, 800)
    else:
        x, y = int(a[0]), int(a[1])
        z = int(a[2]) if len(a) > 2 else 1
        out = a[3] if len(a) > 3 else os.path.join(HERE, '_look', 'west_shot.png')
        tail, win = TAIL % {'X': x, 'Y': y, 'Z': z}, (1480, 900)
    out = os.path.abspath(out)
    html = io.open(SRC, encoding='utf-8').read()
    assert '</body>' in html
    html = html.replace('<script>', INJECT + '<script>', 1)
    html = html.replace('</body>', tail + '</body>', 1)
    gen = os.path.join(PROJ, '_westshot_gen_%d.html' % os.getpid())
    prof = os.path.join(HERE, '_look', '_prof', 'p%d' % os.getpid())
    io.open(gen, 'w', encoding='utf-8', newline='\n').write(html)
    try:
        subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--no-sandbox',
                        '--user-data-dir=' + prof,
                        '--hide-scrollbars', '--virtual-time-budget=20000',
                        '--window-size=%d,%d' % win,
                        '--screenshot=' + out,
                        'file:///' + gen.replace('\\', '/')],
                       capture_output=True, check=False, timeout=180)
    finally:
        if os.path.exists(gen):
            os.remove(gen)          # 逐个精确路径删
        shutil.rmtree(prof, ignore_errors=True)
    print(out, os.path.getsize(out) if os.path.exists(out) else 'MISSING')


if __name__ == '__main__':
    main()
