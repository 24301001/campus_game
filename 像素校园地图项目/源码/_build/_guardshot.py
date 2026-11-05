# -*- coding: utf-8 -*-
"""保安 · 老丁 实景出图（2026-10-09 · 接入地图）。

为什么非要有这一步：五套自动验收**一个像素都不看**，而这一轮加的是**第一个游荡的 NPC**
（银灰发 + 深藏青制服的精灵 + 头顶气泡 + 同源 iframe 抽屉）——"他长什么样、和玩家/向导/
算法哥分不分得开、气泡飘不飘在头顶、抽屉里是不是真的坐着老丁"这几件事只有肉眼能判。
本项目的老规矩：三套全绿而画面崩掉的事故有过。

三张图：
  a_wide   1× 全景：他巡逻到半路，玩家站他旁边，头顶「C 和老丁说话」
  b_bubble 3× 贴脸：老丁本人 + 气泡 —— 与玩家 / 向导 / 算法哥的区分度就看这张
  c_drawer ⭐ 抽屉打开：**laoding 真的坐在抽屉里**（唯一一张必须走 http 的，见下）

⚠️ c_drawer 走 `http://localhost:3000`，另外两张走 `file://`：
   抽屉里是 `/ld/`，file:// 下会解析成 `file:///ld/` **必然加载失败**。
   这不是取巧 —— 用户实际就是通过启动器在 3000 上玩的。
   跑之前先确认 Vite 在 3000 上（`python -m http.server` 顶不了 `/ld` 那个代理）。

用法：python _build/_guardshot.py
"""
import io, os, subprocess

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(HERE)                       # …\源码
ROOT = os.path.dirname(os.path.dirname(PROJ))      # …\像素校园项目总目录
SRC = os.path.join(PROJ, u'像素校园_全校地图.html')
GEN = os.path.join(HERE, '_gdshot_gen.html')
GEN_PUB = os.path.join(ROOT, 'campus_game', 'frontend', 'public', '_gdshot_gen.html')
LOOK = os.path.join(HERE, '_look') + os.sep
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
Z = 3
os.makedirs(LOOK, exist_ok=True)

VIEW_W_PX, VIEW_H_PX = 480 * Z + 20, 270 * Z + 20

SHOTS = {
    'a_wide': """
    for (var i = 0; i < 240; i++) update(1 / 60);
    player.x = GUARD.x + 30; player.y = GUARD.y + 10; player.dir = 'left';
    setZoom(6);                                   // 6 号档 = 1×
    for (var j = 0; j < 5; j++) update(1 / 60);    // 让 guardTick 把 near 翻真、气泡显形
    render();
""",
    'b_bubble': """
    for (var i = 0; i < 240; i++) update(1 / 60);
    player.x = GUARD.x + 22; player.y = GUARD.y + 8; player.dir = 'left';
    setZoom(8);                                   // 8 号档 = 3×，肉眼能数像素
    for (var j = 0; j < 5; j++) update(1 / 60);
    render();
""",
    'c_drawer': """
    /* ⭐ 按 C 开抽屉（走真实的 window keydown ⇒ 真监听链，不直接调 guardTalk）。
       ⚠️ 第四十三轮：先**真的登一次**（`ldSync`），否则抽屉里坐的是老丁自己的登录框 ——
          本轮要出图给人看的恰恰是「一次登录进三家之后，按 C 直接就是聊天界面」。 */
    for (var i = 0; i < 240; i++) update(1 / 60);
    player.x = GUARD.x + 22; player.y = GUARD.y + 8; player.dir = 'left';
    setZoom(6);
    for (var j = 0; j < 5; j++) update(1 / 60);    // near 翻真
    ldSync('admin', 'admin123', 0).then(function () {
      window.dispatchEvent(new KeyboardEvent('keydown',
        { key: 'c', code: 'c', bubbles: true, cancelable: true }));
      render();
    });
""",
}

TMPL = """<script>
window.__diag = [];
window.onerror = function(m, s, l, c){ window.__diag.push('ERR ' + m + ' @' + l + ':' + c); };
window.addEventListener('load', function(){
  setTimeout(function(){
    try {
      var c = document.getElementById('cv');
      c.style.width = (VIEW_W * %(Z)d) + 'px';
      c.style.height = (VIEW_H * %(Z)d) + 'px';
      /* ⚠️ 地图有一道登录门（71b 的 `loginGate()`，见不到 `localStorage.token` 就亮
         `#login` 全屏盖住）。不看图根本不知道 —— 探针是功能性的，键盘事件照样派发，
         所以它一路绿着，出图才发现整屏都是登录框。出图前直接把它收掉。 */
      var _lg = document.getElementById('login');
      if (_lg) _lg.hidden = true;
%(BODY)s
      /* ⚠️ 摆完就冻住模拟（理由同 _guideshot.py）。c_drawer 那张**绝不能冻**：
         抽屉要等 fetch + iframe 加载，冻掉 update 不影响它（抽屉与主循环无关），
         但 `ctrProbe` 的 setTimeout 得继续走 —— 那是浏览器定时器，不受影响。 */
      if (%(FREEZE)s) update = function(){};
      document.title = 'GDS|' + (window.__diag.join(' || ') || 'clean')
        + '|guard=' + (GUARD.x | 0) + ',' + (GUARD.y | 0)
        + '|spot=' + GUARD.spot + '|dir=' + GUARD.dir
        + '|dGp=' + Math.hypot(player.x - GUARD.x, player.y - GUARD.y).toFixed(0)
        + '|near=' + GUARD.near
        + '|ctip=' + (function(){ var e = document.getElementById('ctip');
            return e && !e.hidden ? JSON.stringify(e.textContent) : 'hidden'; })()
        + '|plat=' + (typeof CENTER !== 'undefined' ? CENTER.plat : '-')
        + '|src=' + (function(){ var f = document.getElementById('ctrF');
            return f ? (f.getAttribute('src') || '-') : '-'; })()
        + '|ftitle=' + (function(){ try { var f = document.getElementById('ctrF');
            return JSON.stringify((f.contentDocument && f.contentDocument.title || '').slice(0, 20)); }
            catch (e) { return 'X'; } })();
    } catch (e) { document.title = 'GDS|EX ' + e.message; }
  }, 900);
});
</script>
"""


def _diag(args):
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


def shoot(name, body):
    freeze = 'false' if name == 'c_drawer' else 'true'
    inj = TMPL % {'Z': Z, 'BODY': body, 'FREEZE': freeze}
    src = io.open(SRC, encoding='utf-8').read()
    assert '</body>' in src, '源产物里没有 </body>'
    page = src.replace('</body>', inj + '</body>')

    if name == 'c_drawer':
        assert os.path.isdir(os.path.dirname(GEN_PUB)), \
            'frontend/public 不存在 —— 先跑一次启动器；c_drawer 需要 /ld 代理'
        io.open(GEN_PUB, 'w', encoding='utf-8', newline='\n').write(page)
        url, budget = 'http://localhost:3000/_gdshot_gen.html', 9000
    else:
        io.open(GEN, 'w', encoding='utf-8', newline='\n').write(page)
        url, budget = 'file:///' + GEN.replace('\\', '/'), 2200

    out = LOOK + 'guard_' + name + '.png'
    args = [CHROME, '--no-sandbox', '--no-first-run', '--no-default-browser-check',
            '--headless=new', '--disable-gpu', '--hide-scrollbars',
            '--window-size=%d,%d' % (VIEW_W_PX, VIEW_H_PX),
            '--virtual-time-budget=%d' % budget,
            '--screenshot=' + out, url]
    subprocess.run(args, capture_output=True, timeout=120)
    ok = os.path.exists(out) and os.path.getsize(out) > 2000
    print('  %-9s %s  %-8s %s' % (name, 'OK ' if ok else 'FAIL',
                                  ('%d B' % os.path.getsize(out)) if ok else '', _diag(args)))
    return ok


if __name__ == '__main__':
    if not os.path.exists(CHROME):
        raise SystemExit('找不到 Chrome：' + CHROME)
    print('老丁出图 → ' + LOOK)
    n = sum(1 for k in SHOTS if shoot(k, SHOTS[k]))
    print('%d/%d 张' % (n, len(SHOTS)))
    for p in (GEN, GEN_PUB):
        if os.path.exists(p):
            os.remove(p)
