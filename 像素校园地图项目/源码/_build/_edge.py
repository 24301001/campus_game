# -*- coding: utf-8 -*-
"""真实浏览器 + **真实时钟** 长跑探针（Edge 与 Chrome 对照）。

存在的理由：accept / verify / zoomtest / _flaganim 四套**全在 Chrome headless + 虚拟时钟**
下跑。2026-09-13 用户报"卡死"，一测才发现 Edge 里 render 直接抛 `reading 'width'` ——
也就是说此前所有验证都盖不住"另一个引擎 + 真实时钟"这块地。

虚拟时钟有个要命的副作用：rAF 时间戳会**非单调**，于是 `now - last` 可以是负的
（主循环只夹上界 → dt 为负 → 累积相位转负 → 数组负下标 → undefined → rAF 断链）。
真实浏览器的时间戳是单调的，所以这里**故意不用 --virtual-time-budget**，
改走 CDP（DevTools 协议）读页面标题、按真实时间跑 20 秒。

探测办法：探针自己开一条 rAF 链统计**时间戳负跳变次数** —— 它和主循环共用同一个
时间戳源，所以"探针看到几次负跳变"就等于"主循环拿到几次负 dt"。
另外每 5 秒刷新一次 title，报告 flagPhase 是否还在涨（主循环是否还活着）。
"""
import io, json, os, re, shutil, subprocess, sys, time, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '_edge_gen.html')
PROF = os.path.join(HERE, '_edgeprof')          # 名字要独特：收尾按它筛进程，别误杀用户的 Edge
PORT = 9333
SECONDS = int(sys.argv[1]) if len(sys.argv) > 1 else 20
HEADFUL = 'headful' in [a.lower() for a in sys.argv]      # 有头 = 跟用户实际使用一致（真实合成器）
ONLY = next((a.upper() for a in sys.argv[1:] if a.upper() in ('EDGE', 'CHROME')), None)
# ⚠️ 2026-09-30 订正：项目搬过一次家（`D:\desktop\像素校园地图项目\` →
#    `D:\desktop\像素校园项目总目录\像素校园地图项目\`），老路径在这条一行上没跟着改，
#    于是 _edge.py 从搬家那天起一直是 FileNotFoundError —— 而它是**唯一**跑真实引擎
#    + 真实时钟的探针，等于"改了主循环的那几轮，最后一道闸是空的"。
#    ⚠️ 指向**源码产物**而不是项目根那份：项目根是上一次的交付件，
#       本轮的流程是「改 parts → build → 五套 + _edge → 才复制过去」，
#       所以 _edge 要验的永远是刚构建出来的这一份。
DELIV = r'D:\desktop\像素校园项目总目录\像素校园地图项目\源码\像素校园_全校地图.html'

BROWSERS = [
    ('EDGE', r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'),
    ('CHROME', r'C:\Program Files\Google\Chrome\Application\chrome.exe'),
]


def probe_html(src):
    """把诊断脚本塞进 </body> 前。src 是交付件路径。"""
    PROBE = r"""
<script>
(function(){
  var ERR = [];
  window.onerror = function(m, s, l, c, e){
    ERR.push('ERR:' + m + ' @' + l + ':' + c + ' <<' + (e && e.stack ? String(e.stack).split('\n')[1] : '') + '>>');
  };
  window.addEventListener('unhandledrejection', function(e){ ERR.push('REJ:' + e.reason); });

  /* rAF 时间戳负跳变计数 —— 与主循环共用同一时间戳源，等价于"主循环拿到几次负 dt" */
  var nf = 0, lastT = -1, negJump = 0, minJump = 0, firstT = -1, lastT2 = -1;
  function tick(now){
    if (firstT < 0) firstT = now;
    if (lastT >= 0) { var d = now - lastT; if (d < 0) { negJump++; if (d < minJump) minJump = d; } }
    lastT = now; lastT2 = now; nf++;
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  /* ⑥ 合成按键走一遭 —— 这是用户真正的操作路径。键位走 e.key.toLowerCase()，
     WATCHED 里有 arrowup/w，所以合成事件的 key:'ArrowUp' 能命中。
     焦点状态一起报：键盘事件只到**有焦点**的文档，切走的标签页 rAF 还会被节流。 */
  var walk = '未开始';
  function key(k, down){
    window.dispatchEvent(new KeyboardEvent(down ? 'keydown' : 'keyup',
      { key: k, code: k, bubbles: true, cancelable: true }));
  }
  function startWalk(){
    try {
      var x0 = player.x, y0 = player.y;
      key('ArrowUp', true);
      setTimeout(function(){
        key('ArrowUp', false);
        var d = Math.sqrt((player.x - x0) * (player.x - x0) + (player.y - y0) * (player.y - y0));
        walk = 'Up=' + d.toFixed(1) + 'px dir=' + player.dir;
        key('0', true); key('0', false);
        var zA = zoomI;
        key('1', true); key('1', false);
        walk += ' key0→' + zA + ' key1→' + zoomI;
      }, 2000);
    } catch (e) { walk = 'THROW:' + e.message; }
  }

  var prevPhase = null, noGrowth = 0;
  function report(tag){
    var s = [tag];
    s.push('frames=' + nf + ' negJump=' + negJump + (negJump ? (' minJump=' + minJump.toFixed(1) + 'ms') : ''));
    s.push('errs=' + ERR.length);
    try {
      var grow = (prevPhase === null) ? '?' : (flagPhase > prevPhase ? 'GROW' : 'STUCK');
      if (prevPhase !== null && flagPhase <= prevPhase) noGrowth++;
      prevPhase = flagPhase;
      s.push('flagPhase=' + flagPhase.toFixed(3) + '(' + grow + ')');
      s.push('flagProp=' + (flagProp && flagProp.img ? 'imgOK' : 'IMG_NULL'));
      s.push('frames16=' + flagFrames.length);
      s.push('noimg=' + props.filter(function(p){ return !p.img; }).length + '/' + props.length);
      s.push('focus=' + document.hasFocus() + ' vis=' + document.visibilityState);
      s.push('walk[' + walk + ']');
    } catch (e) { s.push('THROW:' + e.message); }
    if (ERR.length) s = s.concat(ERR.slice(0, 3));
    document.title = s.join(' | ');
  }
  window.addEventListener('load', function(){
    setTimeout(startWalk, 500);
    setTimeout(function(){ report('T1'); }, 1000);
    setTimeout(function(){ report('T5'); }, 5000);
    setTimeout(function(){ report('T10'); }, 10000);
    setTimeout(function(){ report('END'); }, %d);
  });
})();
</script>
""" % (max(2000, (SECONDS - 2) * 1000))

    html = io.open(src, encoding='utf-8').read()
    assert '</body>' in html, '交付件里没有 </body>'
    io.open(OUT, 'w', encoding='utf-8', newline='\n').write(html.replace('</body>', PROBE + '</body>'))


def kill_profile():
    ps = ("Get-CimInstance Win32_Process -Filter \"Name='msedge.exe' or Name='chrome.exe'\" | "
          "Where-Object { $_.CommandLine -like '*_edgeprof*' } | "
          "ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }")
    subprocess.run(['powershell', '-NoProfile', '-Command', ps], capture_output=True)


def read_title():
    try:
        data = json.load(urllib.request.urlopen('http://127.0.0.1:%d/json' % PORT, timeout=5))
    except Exception as e:
        return '<CDP 连不上: %s>' % e
    out = []
    for t in data:
        if t.get('type') == 'page' and t.get('url', '').startswith('file:'):
            out.append(t.get('title', ''))
    return out[-1] if out else '<没有页面>'


def run(name, exe, src):
    if not os.path.exists(exe):
        print(name, 'NOT FOUND', exe); return
    probe_html(src)
    kill_profile()
    if os.path.isdir(PROF):
        shutil.rmtree(PROF, ignore_errors=True)
    args = [exe, '--no-sandbox', '--no-first-run', '--no-default-browser-check',
            '--remote-debugging-port=%d' % PORT,
            '--user-data-dir=' + PROF,
            '--window-size=1280,720']
    if not HEADFUL:
        args[1:1] = ['--headless=new', '--disable-gpu']
    else:
        args.append('--new-window')
    args.append('file:///' + OUT.replace('\\', '/'))
    p = subprocess.Popen(args, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print('====', name, '(真实时钟 %ds)' % SECONDS)
    try:
        for i in range(SECONDS):
            time.sleep(1)
            if i + 1 in (2, 6, 11, SECONDS):
                print('  t=%2ds  %s' % (i + 1, read_title()))
    finally:
        p.terminate()
        kill_profile()
    print()


for name, exe in BROWSERS:
    if ONLY and name != ONLY:
        continue
    run(name, exe, DELIV)
