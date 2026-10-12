# -*- coding: utf-8 -*-
"""GitHub README 素材出图：往地图产物里注入一段 JS，再交给 Chrome headless 截图。

用法：
  python _ghshot.py <src.html> <js场景脚本> <out.png> [--zoom N] [--scale K]
                    [--w W] [--h H] [--crop x,y,w,h] [--budget 毫秒]

⚠️ 与 `_guideshot.py` 的分工：**它只管「注入 + 截图」这一件事**，
   场景状态全部写在独立的 `.js` 里（可复用、可 diff、可批跑成动画）。
⚠️ `src.html` 一律**只读**。演示页是另写的产物（见 `_ghdemo.py`），
   本脚本绝不写回任何地图源文件。
⚠️ 输出必须**绝对路径**：Chrome 的 `--screenshot` 相对它自己的 cwd 落文件，
   传相对路径会**静默**出旧图（`_flaganim.py` 踩过）。
⚠️ 本文件内的 `%` 是模板占位，注入脚本里别写裸 `%`（会当格式化符炸）。
"""
import io, os, re, subprocess, sys, urllib.parse

CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
HERE = os.path.dirname(os.path.abspath(__file__))

# 场景模板：① 先藏登录门（演示/出图一律不进登录流程）
#           ② 摆状态 → ③ 冻住模拟（否则 rAF 会在截图前再跑几十帧，截到"另一时刻"）
TMPL = """<script>
window.__diag = [];
window.onerror = function(m, s, l, c){ window.__diag.push('ERR ' + m + ' @' + l + ':' + c); };
window.addEventListener('load', function(){
  setTimeout(function(){
    try {
      /* ① 登录门：直接藏。它本来就只是"进门前按一下"的仪式（预设账号明写在按钮上），
           这里是离线演示 / 出图，不进登录流程。 */
      try { localStorage.setItem('token', 'gh-demo'); } catch (e) {}
      if (typeof loginEl !== 'undefined' && loginEl) loginEl.hidden = true;
      try { hudUserTick(); } catch (e) {}

      var c = document.getElementById('cv');
      if (typeof setZoom === 'function' && %(ZOOM)s >= 0) setZoom(%(ZOOM)s);
      /* 画布按整数倍放大，像素不外糊 */
      var K = %(SCALE)s;
      c.style.width = (VIEW_W * K) + 'px';
      c.style.height = (VIEW_H * K) + 'px';

%(BODY)s

      update = function(){};        /* 冻住模拟（update 是顶层函数声明，绑定可写） */
      render();
      document.title = 'DIAG|' + (window.__diag.join(' || ') || 'clean')
        + '|zoom=' + zoom + '|view=' + (viewW|0) + 'x' + (viewH|0)
        + '|cam=' + (cam.x|0) + ',' + (cam.y|0)
        + '|p=' + (player.x|0) + ',' + (player.y|0) + '|dir=' + player.dir;
    } catch (e) {
      document.title = 'DIAG|EX ' + (e && e.message) + ' @' + (e && e.stack || '').split('\\n')[1];
    }
  }, %(DELAY)d);
});
</script>
"""


def build(src, jsfile, zoom, scale, delay):
    body = io.open(jsfile, encoding='utf-8').read()
    src_html = io.open(src, encoding='utf-8').read()
    assert '</body>' in src_html, '源产物里没有 </body>'
    inj = TMPL % {'BODY': body, 'ZOOM': str(zoom), 'SCALE': str(scale), 'DELAY': delay}
    gen = os.path.join(HERE, '_gen.html')
    io.open(gen, 'w', encoding='utf-8', newline='\n').write(src_html.replace('</body>', inj + '</body>'))
    return gen


def chrome(args, timeout=120):
    return subprocess.run([CHROME] + args, capture_output=True, timeout=timeout)


def page_url(gen, query=''):
    """⚠️ 要把 `#片段` 传给页面，只能拼在 URL 末尾；而且必须放到**最后一个参数**，
       否则 Chrome 会把它当成另一个开关。
       `--query` 传地标中文名即可（自动百分号编码，页面那侧 decodeURIComponent 还原）。"""
    if query and not query.startswith('#'):
        query = '#' + urllib.parse.quote(query)
    return 'file:///' + gen.replace('\\', '/') + query


def main():
    a = sys.argv[1:]
    if len(a) < 3:
        raise SystemExit(__doc__)
    src, jsfile, out = a[0], a[1], a[2]
    opt = {'--zoom': -1, '--scale': 3, '--w': 0, '--h': 0, '--budget': 2500,
           '--crop': '', '--query': ''}
    i = 3
    while i < len(a):
        k = a[i]
        if k in opt:
            opt[k] = a[i + 1]; i += 2
        else:
            raise SystemExit('未知参数 ' + k)
    zoom = int(opt['--zoom']); scale = int(opt['--scale'])
    budget = int(opt['--budget']); crop = opt['--crop']; query = opt['--query']
    W = int(opt['--w']); H = int(opt['--h'])
    if not W or not H:
        W, H = 480 * scale + 20, 270 * scale + 20

    out = os.path.abspath(out)
    gen = build(src, jsfile, zoom, scale, 700)
    base = ['--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
            '--no-first-run', '--no-default-browser-check',
            '--virtual-time-budget=%d' % budget,
            '--window-size=%d,%d' % (W, H)]
    url = page_url(gen, query)

    d = chrome(base[:1] + ['--dump-dom'] + base[1:] + [url])
    dom = d.stdout.decode('utf-8', 'replace')
    m = re.search(r'<title>(.*?)</title>', dom, re.S)
    diag = m.group(1) if m else '<无 title —— 整页 JS 没跑？>'

    args = base + ['--screenshot=' + out, url]
    chrome(args)
    ok = os.path.exists(out) and os.path.getsize(out) > 2000
    print('%-28s %s %s' % (os.path.basename(out),
                           ('OK %d B' % os.path.getsize(out)) if ok else 'FAIL', diag))
    if crop:
        try:
            from PIL import Image
            x, y, w, h = [int(v) for v in crop.split(',')]
            im = Image.open(out); im.crop((x, y, x + w, y + h)).save(out)
            print('   crop ->', crop)
        except Exception as e:
            print('   crop 失败:', e)
    return 0 if ok else 1


if __name__ == '__main__':
    sys.exit(main())
