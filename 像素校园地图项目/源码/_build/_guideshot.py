# -*- coding: utf-8 -*-
"""向导「小北」实景出图。

为什么非要有这一步：五套自动验收**一个像素都不看**，而这一轮加的是
**地图项目里第一个人**（红衣女生精灵 + 头顶气泡 + **她自己走路** + 对话框面板）——
"她长什么样、和玩家分不分得开、气泡飘在不在头顶、**她到底在不在玩家前面**、
停下等你的时候是什么表情/朝向"这几件事全部只有肉眼能判。这是本项目的老规矩
（三套全绿而画面崩掉的事故有过）。

五张图（2026-09-30 第三十六轮重排）：
  a_wide   南门全景（她在出生点旁边，1× 视角下找得到人吗）
  b_bubble 贴脸：她本人 + 「E 说话」气泡 —— 与玩家的区分度就看这张
  c_panel  对话框面板（含快捷按钮排布）
  d_lead   ⭐ **她走在前面、玩家跟在后面**（本轮的题眼，就看这张）
  e_wait   ⭐ **掉队：她停住转身、气泡「跟上来呀～」**

⚠️ 第三十五轮的 `d_route`（黄色流动虚线）**已删除** —— 引导线没了，用户明确要求。

用法：python _build/_guideshot.py [产物.html]
"""
import io, os, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(HERE)
SRC = sys.argv[1] if len(sys.argv) > 1 else os.path.join(PROJ, '像素校园_全校地图.html')
GEN = os.path.join(HERE, '_gshot_gen.html')
LOOK = os.path.join(HERE, '_look') + os.sep
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
Z = 3
os.makedirs(LOOK, exist_ok=True)

# 每张图一段注入：改状态 → （必要时）推进 update → render() → 交给 --screenshot
SHOTS = {
    'a_wide': """
    player.x = SPAWN.x; player.y = SPAWN.y + 26; player.dir = 'up';
    setZoom(6); cam.x = player.x - VIEW_W / 2; cam.y = player.y - VIEW_H * 0.62;
    render();
""",
    'b_bubble': """
    player.x = GUIDE.x + 20; player.y = GUIDE.y; player.dir = 'left';
    setZoom(8);                                   // 8 号档 = 3×，肉眼能数像素
    for (var i = 0; i < 3; i++) update(1 / 60);   // 让 guideTick 翻转 near → 冒气泡
    render();
""",
    'c_panel': """
    player.x = GUIDE.x + 20; player.y = GUIDE.y; player.dir = 'left';
    setZoom(8);
    update(1 / 60);
    guideOpenPanel("你好，我是小北。想去哪儿？说个地方，我带你过去。");
    guideAsk('五教');
    guideAsk('图书馆');
    render();
""",
    'd_lead': """
    /* ⭐ 本轮题眼：**她走在前面，玩家跟在后面。**
       ⚠️ 玩家不会自己跟着走（截图脚本里没有真实按键），所以用一个"橡皮筋"把他
          拴在她身后 48px —— 这正是"你跟上了"这个状态的画面。48 < LEAD_MAX(72)，
          所以她一路走不停。 */
    player.x = GUIDE.x + 20; player.y = GUIDE.y; player.dir = 'left';
    setZoom(7);                                   // 7 号档 = 2×：两个人 + 一点前后距离
    update(1 / 60);
    _startLead();
    for (var j = 0; j < 90; j++) { _trail(48); update(1 / 60); }   // 1.5 秒
    _trail(48);                                   // 收尾再摆一次，免得他被最后一帧甩开
    /* ⚠️ 步态要**手动摆**：主循环在"没按键"那条分支里会把 `player.walk` 归零、
       改写成待机帧（L15757-15759），所以靠橡皮筋挪出来的位移进不了他的相位。
       不改这一下，画面会是"她在走、他站着滑行"。 */
    player.idle = 0;
    player.walk = WALK_STRIDE * 0.4;
    player.step = (Math.floor(WALK_STRIDE * 0.4 / WALK_STRIDE * WALK_FRAMES)) & (WALK_FRAMES - 1);
    _frameTwo();
    render();
""",
    'e_wait': """
    /* ⭐ **掉队**：橡皮筋先跟 1.2 秒，然后**松手** —— 玩家原地不动，
       她自己往前走，拉开到 LEAD_MAX(72) 就停下转身，气泡换「跟上来呀～」。
       这正是用户要的"我没跟上就会等我一会"。 */
    player.x = GUIDE.x + 20; player.y = GUIDE.y; player.dir = 'left';
    setZoom(7);
    update(1 / 60);
    _startLead();
    for (var j = 0; j < 72; j++) { _trail(48); update(1 / 60); }   // 1.2 秒：跟上了
    for (var k = 0; k < 66; k++) update(1 / 60);                    // 1.1 秒：松手，她拉开
    _frameTwo();
    render();
""",
}

# 两张带路图的公共前戏（用 `guideAsk` 的真实入口，不直接调内部函数）
PREAMBLE = """
    function _startLead() {
      var best = null, bd = -1;
      for (var i = 0; i < GDEST.length; i++) {
        var d = GDEST[i];
        var dd = (d.ax - player.x) * (d.ax - player.x) + (d.ay - player.y) * (d.ay - player.y);
        if (dd > bd) { bd = dd; best = d; }        // 挑最远的：保证 1.5 秒内到不了
      }
      guideAsk(best.name);
      GUIDE.delay = 0;
      if (GUIDE.lastAsk) guideStart(GUIDE.lastAsk.spot, GUIDE.lastAsk.name);
    }
    function _trail(gap) {
      var dx = GUIDE.x - player.x, dy = GUIDE.y - player.y;
      var dd = Math.hypot(dx, dy);
      if (dd > gap) { var k = (dd - gap) / dd; player.x += dx * k; player.y += dy * k; }
      if (Math.abs(dx) >= Math.abs(dy)) player.dir = dx < 0 ? 'left' : 'right';
      else player.dir = dy < 0 ? 'up' : 'down';
    }
    /* 相机要**框住两个人**，不能只跟玩家：`cam` 是**世界坐标**（主循环 L15764 写它），
       所以要用 `viewW/viewH` 而不是 `VIEW_W/VIEW_H` —— 2× 下两者差一倍。 */
    function _frameTwo() {
      var mx = (player.x + GUIDE.x) / 2, my = (player.y + GUIDE.y) / 2;
      cam.x = Math.max(0, Math.min(WORLD_W - viewW, mx - viewW / 2));
      cam.y = Math.max(0, Math.min(WORLD_H - viewH, my - viewH / 2));
    }
"""

TMPL = """<script>
window.__diag = [];
window.onerror = function(m, s, l, c){ window.__diag.push('ERR ' + m + ' @' + l + ':' + c); };
window.addEventListener('load', function(){
  setTimeout(function(){
    try {
      var c = document.getElementById('cv');
      c.style.width = (VIEW_W * %(Z)d) + 'px';
      c.style.height = (VIEW_H * %(Z)d) + 'px';
%(PRE)s
%(BODY)s
      /* ⚠️ **摆完就冻住模拟**。不冻的话，主循环的 rAF 在截图前还会跑几十帧
         （`--virtual-time-budget` 2000ms，注入点在 900ms）：带路图里她会继续走、
         `c_panel` 里 `GUIDE.delay` 会走完 1.1 秒把面板关掉 —— 截出来的是"另一时刻"。
         `update` 是顶层函数声明（L15728），绑定可写，换掉它 `loop()` 就空转，
         而 `render()` 照常每帧重画同一幅冻结画面。 */
      update = function(){};
      document.title = 'DIAG|' + (window.__diag.join(' || ') || 'clean')
        + '|guide=' + (GUIDE.x | 0) + ',' + (GUIDE.y | 0)
        + '|mode=' + GUIDE.mode + '|hold=' + GUIDE.hold
        + '|dGp=' + Math.hypot(player.x - GUIDE.x, player.y - GUIDE.y).toFixed(0)
        + '|tip=' + (guideTip && !guideTip.hidden
                     ? JSON.stringify(guideTip.textContent) : 'hidden');
    } catch (e) { document.title = 'DIAG|EX ' + e.message; }
  }, 900);
});
</script>
"""


def shoot(name, body):
    """⚠️ 每张图都要重新拼一份 HTML：注入脚本必须在 load 时就位，
       不能靠一张页面里跑四段（`--screenshot` 只截一次）。"""
    src = io.open(SRC, encoding='utf-8').read()
    assert '</body>' in src, '源产物里没有 </body>'
    inj = TMPL % {'Z': Z, 'BODY': body, 'PRE': PREAMBLE}
    io.open(GEN, 'w', encoding='utf-8', newline='\n').write(src.replace('</body>', inj + '</body>'))
    out = LOOK + 'guide_' + name + '.png'
    args = [CHROME, '--no-sandbox', '--no-first-run', '--no-default-browser-check',
            '--headless=new', '--disable-gpu',
            '--hide-scrollbars',
            '--window-size=%d,%d' % (VIEW_W_PX, VIEW_H_PX),
            '--virtual-time-budget=2200',
            '--screenshot=' + out,
            'file:///' + GEN.replace('\\', '/')]
    subprocess.run(args, capture_output=True, timeout=90)
    ok = os.path.exists(out) and os.path.getsize(out) > 2000
    print('  %-10s %s  %s  %s' % (name, 'OK ' if ok else 'FAIL',
                                  ('%d B' % os.path.getsize(out)) if ok else '',
                                  _diag(args)))
    return ok


def _diag(args):
    """再跑一次同一张页，把 `document.title` 读回来。

    ⚠️ 为什么非要这一步：图只看得到"画出来什么"，看不到"状态是什么"。
       `e_wait` 第一版就是这么打脸的 —— 玩家不在画面里、气泡也没有，
       光看图分不清是"她没停下"还是"相机框错了"。标题里那六个字段
       （mode / hold / dGp / tip / 两个坐标）当场就能定性。"""
    a = [x for x in args if not x.startswith('--screenshot')]
    a.insert(1, '--dump-dom')
    try:
        r = subprocess.run(a, capture_output=True, timeout=90)
        dom = r.stdout.decode('utf-8', 'replace')
    except Exception as e:
        return '<diag 失败: %s>' % e
    i = dom.find('<title>')
    if i < 0:
        return '<无 title>'
    t = dom[i + 7:dom.find('</title>', i)]
    return t.replace('&quot;', '"').replace('&amp;', '&').replace('&gt;', '>').replace('&lt;', '<')


# 画布 CSS 尺寸 = VIEW_W×Z，窗口要放得下（480×270 的 3 倍 = 1440×810）
VIEW_W_PX, VIEW_H_PX = 480 * Z + 20, 270 * Z + 20

if __name__ == '__main__':
    if not os.path.exists(CHROME):
        raise SystemExit('找不到 Chrome：' + CHROME)
    print('向导出图 → ' + LOOK)
    n = sum(1 for k in SHOTS if shoot(k, SHOTS[k]))
    print('%d/%d 张' % (n, len(SHOTS)))
