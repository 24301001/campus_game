# -*- coding: utf-8 -*-
"""保安立绘换图 —— 一次性运行时探针（验完删）。

读的是**真页面**（复制 index.html 到同目录 + 注入一段尾巴），用 file:// 打开 ——
这样连**相对路径 `assets/guard-*.png`** 一起验了（服务端 `/assets` 挂载与 file:// 两种走法
都吃相对路径，所以这条路径是两者共用的那一条）。

⚠️ 不登 8000 端口那套服务：本探针要验的是**立绘渲染**，不是登录流。直接进 `enterChat()`
（它就是"恢复会话"那一支最后调的函数，不是后门）。

用法:
  python _guardshot.py                 # 三档各出一张截图 + 回读一组读数
"""
import io, os, re, subprocess

HERE = os.path.dirname(os.path.abspath(__file__))
APP = 'D:/desktop/像素校园项目总目录/laoding'
SRC = os.path.join(APP, 'index.html')
PROBE = os.path.join(APP, '_probe_guard.html')          # 必须落在 laoding 里，assets/ 才解析得到
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

# 关掉所有 CSS 动画：`breathe` 会让立绘上下浮动 ±3px，量头顶行会飘。
INJECT = """<style>*{animation:none !important;transition:none !important}</style>
<script>window.__diag=[];window.onerror=function(m,s,l,c){window.__diag.push('ERR '+m+' @'+l+':'+c);};</script>
"""

TAIL = """
<script>
window.addEventListener('load', function(){
  var tries = 0;
  var t = setInterval(function(){
    tries++;
    if (tries > 80){ clearInterval(t); done('TIMEOUT Store.init'); return; }
    /* ⚠️ 不能写 `window.Store`：顶层 `const Store` **不挂在 window 上**（只有 function 声明才挂），
       写 window.Store 会永远 undefined ⇒ 一直等到超时（第一版就栽在这儿）。 */
    if (typeof Store === 'undefined' || !Store.lost.length || !Store.points.length) return;
    clearInterval(t);
    try { enterChat({ user_id:'probe', nickname:'探针', token:'probe' }); }
    catch(e){ done('EX enterChat: ' + e.message); return; }
    setTimeout(run, 300);                          // 等图片解码
  }, 100);

  function done(msg){
    window.requestAnimationFrame = function(){ return 0; };
    document.title = 'GS|' + msg + '|' + (window.__diag.join(' || ') || 'clean');
  }

  function run(){
    try {
      /* 造三行对话，覆盖三档表情（走**真**入口 pushMsg ⇒ 走 autoMood） */
      setMood('idle', 0);
      pushMsg({ who:'guard', kind:'text', text:'来了来了，丢什么了？' });      // -> greet -> normal
      var n1 = document.querySelectorAll('#msgs img.avatar-c').length;
      var a1 = document.querySelectorAll('#msgs img.avatar-c')[n1-1].getAttribute('src');
      var mood1 = document.getElementById('guard-portrait').dataset.mood;

      pushMsg({ who:'guard', kind:'text', text:'先说说它长什么样，我比对一下。' });  // -> think
      var n2 = document.querySelectorAll('#msgs img.avatar-c').length;
      var a2 = document.querySelectorAll('#msgs img.avatar-c')[n2-1].getAttribute('src');

      pushMsg({ who:'guard', kind:'text', text:'对上了，是你的，来保卫处领。' });   // -> found
      var n3 = document.querySelectorAll('#msgs img.avatar-c').length;
      var a3 = document.querySelectorAll('#msgs img.avatar-c')[n3-1].getAttribute('src');

      /* 钉到要拍的那一档（hold=0 ⇒ 不会 4.5 秒后自己回 idle） */
      setMood('%s', 0);

      var gi = document.getElementById('guard-img'), pi = document.getElementById('pet-img');
      var r = gi.getBoundingClientRect(), rp = pi.getBoundingClientRect();
      document.title = 'GS|' + JSON.stringify({
        want: '%s',
        mood: document.getElementById('guard-portrait').dataset.mood,
        guardSrc: gi.getAttribute('src'),
        petSrc: pi.getAttribute('src'),
        // 图片真加载了没（naturalWidth=0 就是"碎图"）
        natural: gi.naturalWidth + 'x' + gi.naturalHeight,
        petNatural: pi.naturalWidth + 'x' + pi.naturalHeight,
        guardBox: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)],
        petBox: [Math.round(rp.left), Math.round(rp.top), Math.round(rp.width), Math.round(rp.height)],
        // 交叉验证用：徽章是 `top:30px` 挂在立绘框上的，它的 rect 能反推立绘框的顶
        badgeBox: (function(q){ return [Math.round(q.left), Math.round(q.top), Math.round(q.width), Math.round(q.height)]; })(document.getElementById('pt-mood').getBoundingClientRect()),
        vp: window.innerWidth + 'x' + window.innerHeight,
        scrollY: window.scrollY, chatColTop: Math.round(document.getElementById('chat-col').getBoundingClientRect().top),
        avatars: [a1, a2, a3],
        badge: document.getElementById('pt-mood').textContent,
        nMsg: document.querySelectorAll('#msgs .row.guard').length
      }) + '|' + (window.__diag.join(' || ') || 'clean');
      window.requestAnimationFrame = function(){ return 0; };
    } catch(e){ done('EX run: ' + e.message + ' @ ' + (e.stack||'').split('\\n')[1]); }
  }
});
</script>
"""

def build(mood):
    html = io.open(SRC, encoding='utf-8').read()
    assert html.count('<script>') >= 1, '源页面没有裸 <script> 锚点'
    assert '</body>' in html, '源页面没有 </body>'
    html = html.replace('<script>', INJECT + '<script>', 1)
    html = html.replace('</body>', (TAIL % (mood, mood)) + '</body>', 1)
    io.open(PROBE, 'w', encoding='utf-8', newline='\n').write(html)


def chrome(args, timeout=90):
    return subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--no-sandbox',
                           '--hide-scrollbars', '--virtual-time-budget=15000'] + args,
                          capture_output=True, timeout=timeout)


def one(mood, out):
    build(mood)
    r = chrome(['--window-size=1180,820', '--screenshot=' + out,
                'file:///' + PROBE.replace('\\', '/')])
    p = chrome(['--window-size=1180,820', '--dump-dom',
                'file:///' + PROBE.replace('\\', '/')])
    m = re.search(r'<title>(.*?)</title>', p.stdout.decode('utf-8', 'replace'), re.S)
    return os.path.getsize(out) if os.path.exists(out) else -1, (m.group(1).strip() if m else 'NO TITLE')


def main():
    outs = []
    for mood in ('idle', 'think', 'found'):
        out = os.path.join(HERE, '_shot_%s.png' % mood)
        size, title = one(mood, out)
        outs.append((mood, size, title))
        print('%-6s -> %-22s %8d B' % (mood, os.path.basename(out), size))
    print()
    for mood, _, title in outs:
        print('=== %s\n    %s' % (mood, title.replace('|', '\n    ')))
    if os.path.exists(PROBE):
        os.remove(PROBE)


if __name__ == '__main__':
    main()
