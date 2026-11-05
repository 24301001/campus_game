# -*- coding: utf-8 -*-
"""猫宠 —— 活体取景截图（只给猫用的一次性探针，照 shot.py 的机制）。

为什么不能直接用 `shot.py`：`shot.py` 把玩家放到给定坐标就完事，而**猫在哪个点
取决于真实时钟**（作息表 §4.2）—— 同一个坐标，白天的猫在食堂、夜里的猫早换地方了，
按死坐标摆机位会拍到空景。所以这里要干三件 `shot.py` 干不了的事：

  ① `catTimeOverride = '10:00'` —— 把作息钉到"四只猫在各自白天点位上"那一档，
     机位才是可复现的。**注意这不再是为了"让猫出现"**：第四十四轮起作息表里没有
     `at: null` 了，全天四只都在（`76_cat_data.js` 顶部那段），钉时钟只为可复现。
  ② 给目标猫的**好感账本**种一个分（亲近档 70），让它在玩家跟前**停住蹭**
     （而不是照陌生档一溜烟跑掉 —— 那样拍到的只有背影，人和猫的**大小关系**看不出来）;
  ③ 把玩家放到猫身边（猫的位置在注入那一刻现读，不是猜的）。

用法:
  python _build/_catshot.py <cat_id|all> [zoom] [out]
    cat_id   cat_daju / cat_guanzhang / cat_zhima / cat_lihua，或 all（四只各出一张）
    zoom     整数倍，默认 6
    out      仅单只时有效；all 时自动出 _look/cat_<id>.png
"""
import io, os, re, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(HERE)
SRC = os.path.join(PROJ, '像素校园_全校地图.html')
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
LOOK = os.path.join(HERE, '_look') + os.sep
os.makedirs(LOOK, exist_ok=True)

INJECT = """<script>
window.__diag=[];window.onerror=function(m,s,l,c){window.__diag.push('ERR '+m+' @'+l+':'+c);};
/* ⚠️ 必须先塞一个 token：产物自带「登录门」（`71b_center.js:655 loginGate()`），
   没有 token 就弹一个盖住全屏的模态框 + 把地图压暗 —— 拍出来的是那张登录框，
   猫和人在底下，肉眼什么都判不了（第一次拍就栽在这儿）。
   这不是绕过验证，走的正是它自己的「24 小时内再来，直接进」那一支。 */
try { localStorage.setItem('token', 'catshot-probe'); } catch (e) {}
</script>
"""

TAIL = """
<script>
window.addEventListener('load', function(){ setTimeout(function(){
  try{
    /* ① 拨作息：10:00 四只猫都在场（§九 验收 5 的对照时刻） */
    catTimeOverride = '10:00';
    /* ② 种分：亲近档 —— 走近它会"蹭"，不会一溜烟跑掉；
       （种完还得让心跳跑两拍，`active` / `tier` / 朝向才会跟上） */
    var ID = '%(ID)s';
    var L = catLedger(), m = catRec(L, ID);
    m.importance = 70; m.time = Date.now(); m.lastDay = ''; catLedgerSave(L);
    /* ⚠️ **必须自己调两次心跳**：`--headless=new --virtual-time-budget` 下主循环的
       rAF 基本不推进（猫的 `act` 会一直停在初始的 `idle`、`active` 一直是 false），
       只等 rAF 的话拍出来**一只猫都没有** —— 而图里看着像"渲染坏了"。
       `catTick` 就是补丁 22 挂进主循环的那一个，不是后门。 */
    catTick(0.05); catTick(0.05);
    var c = CAT_BY_ID[ID];
    /* ③ 玩家放到猫身边（现读猫的位置，不是猜的） */
    var off = %(OFF)s;
    for (var i = 0; i < off.length; i++){
      var x = c.x + off[i][0], y = c.y + off[i][1];
      if (canWalk(x,y) && !blocked(x,y)) { player.x = x; player.y = y; break; }
    }
    /* ④ 相机跟到玩家身上再重画一帧（照 shot.py 的 TAIL_ZOOM） */
    cam.x = Math.max(0, Math.min(player.x - VIEW_W / 2,    Math.max(0, WORLD_W - VIEW_W)));
    cam.y = Math.max(0, Math.min(player.y - VIEW_H * 0.62, Math.max(0, WORLD_H - VIEW_H)));
    catTick(0.05);
    render();
    var cv = document.getElementById('cv');
    cv.style.width  = (VIEW_W * %(Z)d) + 'px';
    cv.style.height = (VIEW_H * %(Z)d) + 'px';
    document.title = 'CS|' + ID
      + '|cat=' + Math.round(c.x) + ',' + Math.round(c.y)
      + '|player=' + Math.round(player.x) + ',' + Math.round(player.y)
      + '|cam=' + Math.round(cam.x) + ',' + Math.round(cam.y)
      + '|tier=' + c.tier + '|act=' + c.act + '|dir=' + c.dir
      + '|' + (window.__diag.join(' || ') || 'clean');
  }catch(e){ document.title = 'CS|EX ' + e.message; }
}, 2000); });
</script>
"""

IDS = ['cat_daju', 'cat_guanzhang', 'cat_zhima', 'cat_lihua']


# 默认把玩家放在猫**正东 46px**（不是正南 26px）——
# 正南 26px 在 3/4 视角下意味着猫正好站在玩家**头顶那一格**，两张精灵叠在一起，
# "猫有多大"根本判不了（第一版就栽在这儿：看着像猫骑在人背上）。
# 正东 46px 是并排站，脚底同一条水平线，大小一眼可比。
OFF_DEFAULT = '[[46,0],[-46,0],[0,46],[0,-46],[60,0],[-60,0],[0,60],[0,-60]]'


def shoot(cat_id, z, out, off=OFF_DEFAULT):
    html = io.open(SRC, encoding='utf-8').read()
    assert '</body>' in html, '源产物里没有 </body>'
    html = html.replace('<script>', INJECT + '<script>', 1)
    html = html.replace('</body>', TAIL % {'ID': cat_id, 'Z': z, 'OFF': off} + '</body>', 1)
    tmp = os.path.join(HERE, '_catshot_gen_' + cat_id + '.html')   # 按猫分文件：回读标题时不会串台
    io.open(tmp, 'w', encoding='utf-8', newline='\n').write(html)
    out = os.path.abspath(out)
    win = (480 * z + 40, 270 * z + 90)
    subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--no-sandbox',
                    '--hide-scrollbars', '--virtual-time-budget=20000',
                    '--window-size=%d,%d' % win,
                    '--screenshot=' + out, 'file:///' + tmp.replace('\\', '/')],
                   stderr=subprocess.DEVNULL, check=False)
    print('%-14s -> %s  %s' % (cat_id, os.path.basename(out),
                               os.path.getsize(out) if os.path.exists(out) else 'MISSING'))
    return tmp, win


def read_title(tmp, win):
    p = subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--no-sandbox',
                        '--hide-scrollbars', '--virtual-time-budget=20000',
                        '--window-size=%d,%d' % win,
                        '--dump-dom', 'file:///' + tmp.replace('\\', '/')],
                       capture_output=True, check=False)
    m = re.search(r'<title>(.*?)</title>', p.stdout.decode('utf-8', 'replace'), re.S)
    return m.group(1).strip() if m else 'NO TITLE'


def main():
    a = sys.argv[1:]
    if not a:
        raise SystemExit(__doc__)
    who = a[0]
    z = int(a[1]) if len(a) > 1 else 6
    ids = IDS if who == 'all' else [who]
    runs = []
    for cid in ids:
        out = a[2] if (len(a) > 2 and who != 'all') else (
            LOOK + 'cat_' + cid.replace('cat_', '') + '.png')
        runs.append((cid,) + shoot(cid, z, out))
    # ⚠️ 回读标题是**另起一次 Chrome**（--dump-dom），不是截那一张图时的状态 ——
    #    读数用来看"那时它在干什么"，不是图里那一帧的逐像素证据。
    print()
    for cid, tmp, win in runs:
        print('%-14s %s' % (cid, read_title(tmp, win)))


if __name__ == '__main__':
    main()
