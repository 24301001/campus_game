# -*- coding: utf-8 -*-
"""像素校园 —— 无头 Chrome 取景截图

用法:
  python _build/shot.py <x> <y> [zoom] [out]
    x y   世界坐标：把"玩家"放到这里，相机随之跟过去
    zoom  整数倍（1 世界像素 = zoom 屏幕像素），默认 3
    out   输出 png，默认 _build/_look/ 下（HERE 相对，项目内自洽）

  python _build/shot.py over [div] [out]      → 全图缩略（div 默认 4），带碰撞盒

  python _build/shot.py z <fit|档位> [out] [x] [y]
    → 游戏内**缩放**取景（与上面 <x> <y> 的 CSS 倍率 zoom 不是一回事，勿混用）
      <fit|档位>  fit 或 0.25 / 1 / 4 这类档位值；默认把玩家放在思源楼

  python _build/shot.py walk <方向> [相位] [out] [x] [y]
    → 按住方向键、用**真实的 update()** 把步态推到指定相位再截图，并回读 DIAG：
        phase=实际/目标、walk@hit / walk@+60f / dWalk / dX
      ⚠️ 它走真实路径而不是直接写 player.step，所以顺带验到两条行为契约：
         · 步态按**位移**推进（不是按时间）
         · 顶墙时位移为 0 ⇒ dWalk 必须是 0.0（老版是 walk += dt，会原地踏步）
      把玩家放在贴墙处跑一次即可验收第二条：`walk up 3 out.png <贴墙的x> <贴墙的y>`
"""
import io, os, re, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(HERE)
SRC  = os.path.join(PROJ, '像素校园_全校地图.html')
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
_LOOK = os.path.join(HERE, '_look') + os.sep   # 截图默认落这里
os.makedirs(_LOOK, exist_ok=True)

INJECT = """<script>
window.__diag=[];window.onerror=function(m,s,l,c){window.__diag.push('ERR '+m+' @'+l+':'+c);};
</script>
"""

TAIL_AT = """
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

TAIL_OVER = """
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
    if(%(SOLIDS)d) for(var j=0;j<solids.length;j++){var s2=solids[j];
      g2.fillStyle='rgba(255,0,0,0.20)'; g2.fillRect(s2.x/S,s2.y/S,s2.w/S,s2.h/S);}
    g2.fillStyle='#00ff00'; g2.fillRect(SPAWN.x/S-4,SPAWN.y/S-4,8,8);
    render=function(){};
    document.title='DIAG|'+(window.__diag.join(' || ')||'clean');
  }catch(e){ document.title='DIAG|EX '+e.message; }
}, 2500); });
</script>
"""


TAIL_ZOOM = """
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
      + ' cam=' + Math.round(cam.x) + ',' + Math.round(cam.y)
      + ' L=' + mipLevelFor(zoom)
      + '|' + (window.__diag.join(' || ') || 'clean');
  }catch(e){ document.title = 'DIAG|EX ' + e.message; }
}, 2500); });
</script>
"""

# --- walk 模式：按住方向键，用**真实的 update()** 把步态推到指定相位再截图 ---
# ⚠️ 必须走 update()，不能直接写 player.step —— 只有走真实路径才能同时验到
#    "步态按位移推进"和"顶墙时脚立刻停"这两条（直接改 step 会把这两条一起跳过）。
TAIL_WALK = """
<script>
window.addEventListener('load', function(){ setTimeout(function(){
  try{
    player.x = %(X)d; player.y = %(Y)d; player.dir = '%(D)s';
    var c = document.getElementById('cv');
    c.style.width = (VIEW_W * %(Z)d) + 'px'; c.style.height = (VIEW_H * %(Z)d) + 'px';
    var K = %(K)s;
    keys[K] = 1;
    var need = %(F)d, guard = 0, w0 = player.walk, moved0 = player.x;
    while (guard++ < 4000 && player.step !== need) update(1/60);
    var reached = player.step;
    var wMid = player.walk;
    /* 再空推 60 帧：正常情况步态继续走；若已经贴墙，位移为 0 ⇒ walk 必须原地不动 */
    for (var i = 0; i < 60; i++) update(1/60);
    keys[K] = 0;
    render();
    document.title = 'DIAG|phase=' + reached + '/' + need
      + ' walk@hit=' + wMid.toFixed(1) + ' walk@+60f=' + player.walk.toFixed(1)
      + ' dWalk=' + (player.walk - wMid).toFixed(1)
      + ' dX=' + (player.x - moved0).toFixed(1)
      + ' pos=' + Math.round(player.x) + ',' + Math.round(player.y)
      + '|' + (window.__diag.join(' || ') || 'clean');
  }catch(e){ document.title = 'DIAG|EX ' + e.message; }
}, 2500); });
</script>
"""
WALK_KEY = {'up': '"w"', 'down': '"s"', 'left': '"a"', 'right': '"d"'}


def main():
    a = sys.argv[1:]
    over = a and a[0] == 'over'
    want_title = False
    if a and a[0] == 'walk':
        d = a[1]                                   # up / down / left / right
        f = int(a[2]) if len(a) > 2 else 1         # 目标相位 0..3（4/5 是待机，不走这条）
        out = a[3] if len(a) > 3 else _LOOK + '_shot_walk.png'
        x = int(a[4]) if len(a) > 4 else 2005       # 默认南门内主路（开阔地，走得开）
        y = int(a[5]) if len(a) > 5 else 2400
        assert d in WALK_KEY, '方向必须是 up/down/left/right'
        tail = TAIL_WALK % {'D': d, 'K': WALK_KEY[d], 'F': f, 'X': x, 'Y': y, 'Z': 3}
        win = (480 * 3 + 40, 270 * 3 + 90)
        want_title = True
    elif a and a[0] == 'z':
        lvl = a[1]
        out = a[2] if len(a) > 2 else _LOOK + '_shot_zoom.png'
        x = int(a[3]) if len(a) > 3 else 2024      # 默认思源楼（标尺原点，最认得出）
        y = int(a[4]) if len(a) > 4 else 1431
        tail = TAIL_ZOOM % {'Z': lvl, 'X': x, 'Y': y, 'S': 3}
        win = (480 * 3 + 40, 270 * 3 + 90)
    elif over:
        d = int(a[1]) if len(a) > 1 else 4
        out = a[2] if len(a) > 2 else _LOOK + '_shot_over.png'
        solid = int(a[3]) if len(a) > 3 else 1
        tail = TAIL_OVER % {'D': d, 'SOLIDS': solid}
        win = (1320, 780)
    else:
        x, y = int(a[0]), int(a[1])
        z = int(a[2]) if len(a) > 2 else 3
        out = a[3] if len(a) > 3 else _LOOK + '_shot.png'
        tail = TAIL_AT % {'X': x, 'Y': y, 'Z': z}
        win = (480 * z + 40, 270 * z + 90)

    # ⚠️ --screenshot= 必须传**绝对路径**：Chrome 按它自己的 CWD 解析相对路径，
    #    同一句命令昨天能出图、今天可能就落到别处（或直接不写文件、静默 MISSING）。
    out = os.path.abspath(out)
    html = io.open(SRC, encoding='utf-8').read()
    html = html.replace('<script>', INJECT + '<script>', 1)
    html = html.replace('</body>', tail + '</body>', 1)
    tmp = os.path.join(HERE, '_shot_gen.html')
    io.open(tmp, 'w', encoding='utf-8', newline='\n').write(html)

    subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--no-sandbox',
                    '--hide-scrollbars', '--virtual-time-budget=20000',
                    '--window-size=%d,%d' % win,
                    '--screenshot=' + out, 'file:///' + tmp],
                   stderr=subprocess.DEVNULL, check=False)
    print(out, os.path.getsize(out) if os.path.exists(out) else 'MISSING')
    if want_title:
        p = subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--no-sandbox',
                            '--hide-scrollbars', '--virtual-time-budget=20000',
                            '--window-size=%d,%d' % win,
                            '--dump-dom', 'file:///' + tmp],
                           capture_output=True, check=False)
        t = re.search(r'<title>(.*?)</title>', p.stdout.decode('utf-8', 'replace'), re.S)
        print('DIAG ->', t.group(1).strip() if t else 'NO TITLE')


main()
