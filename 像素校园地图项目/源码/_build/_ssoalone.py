# -*- coding: utf-8 -*-
"""独立跑不回归探针（2026-10-12 · 第四十五轮）。

本轮往**两家同学的交付物**里各插了一段代码（老丁 `index.html`、阿姨 `index.html` + `app.js`），
为的是"被地图嵌进抽屉时，开机先别摆登录卡，先亮一层『正在进入…』"。
改别人的东西，第一件要证的**不是**"嵌进去好使了"，而是"**不嵌的时候一个字都没变**"。

⚠️ 为什么用 `--dump-dom` 而不是像 `_ssoprobe.py` 那样往页面里塞探针：
   这两页是**别人服务端发出来的静态文件**，本机没有"注脚本"的口子（页面里没有可挂的钩）。
   而这里要量的是**渲染后的 DOM 事实**（`<html>` 上有没有那个类 / 登录卡有没有被收走），
   `--dump-dom` 把"JS 跑完之后"的 DOM 原样吐出来 —— 够用，而且**不碰他们的文件**。

三样，逐条量（判据钉在**那段代码自己那句开关**上，不另写一套）：
  · 老丁：`location.protocol !== 'file:' && location.pathname.indexOf('/ld') === 0`
  · 阿姨：既有 `window.AUNT_PREFIX`（`/cmr` 前缀）
两家直接开时 pathname 都是 `/` ⇒ 开关**不该**触发。

  A1  `<html>` 上**没有** `ld-embed` / `aunt-embed` 类（纱幕的 CSS 全靠它，没它纱幕就是死字）
  A2  纱幕那块 `<div id="ld-boot"/"aunt-boot">` 还在（代码在，只是不生效 —— 这是刻意留的，
      下一轮谁再动它，这里会立刻红）
  A3  登录卡**照旧露着**（`#login-view` 没有 `hidden` 类；`#auth-screen` 没有 `hidden` 属性）
      ＋ 负对照：阿姨的 `#app-screen` **带着** `hidden` ⇒ 证明这页真的停在"没登录"那一屏，
        不是因为"其实已经登录了"才看不见登录卡的。
"""
import os, re, shutil, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
PROF = os.path.join(HERE, '_ssoalone_prof')
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

SITES = [
    {
        'name': u'老丁 · 保卫处',
        'url': 'http://127.0.0.1:8000/',
        'cls': 'ld-embed',
        'boot': 'ld-boot',
        'card': ('id="login-view"', 'section', 'hidden'),      # 类控
    },
    {
        'name': u'阿姨 · 食堂',
        'url': 'http://127.0.0.1:8020/',
        'cls': 'aunt-embed',
        'boot': 'aunt-boot',
        'card': ('id="auth-screen"', 'div', 'hidden'),         # 属性控
    },
]


def dump(url):
    args = [CHROME, '--headless=new', '--disable-gpu', '--no-sandbox',
            '--no-first-run', '--no-default-browser-check',
            '--user-data-dir=' + PROF,
            '--virtual-time-budget=5000',
            '--dump-dom', url]
    r = subprocess.run(args, capture_output=True)
    return r.stdout.decode('utf-8', 'replace')


def tag_of(html, needle):
    """取含 `needle` 的那个开标签的原文。"""
    i = html.find(needle)
    if i < 0:
        return None
    a = html.rfind('<', 0, i)
    b = html.find('>', i)
    if a < 0 or b < 0:
        return None
    return html[a:b + 1]


def main():
    if not os.path.exists(CHROME):
        raise SystemExit('找不到 Chrome：' + CHROME)
    print(u'SSO ALONE PROBE（独立跑：不该出现「正在进入…」，登录卡照旧）')
    fails = []
    try:
        for s in SITES:
            shutil.rmtree(PROF, ignore_errors=True)
            html = dump(s['url'])
            if not html.strip():
                print(u'  ❌ %s  没拿到 DOM' % s['name'])
                fails.append(s['name'])
                continue
            htmlTag = tag_of(html, '<html') or ''
            card_id, card_tag, hide = s['card']
            bootTag = tag_of(html, 'id="%s"' % s['boot']) or ''
            cardT = tag_of(html, card_id) or ''
            appT = (tag_of(html, 'id="app-screen"') or '') if s['cls'] == 'aunt-embed' else ''

            a1 = (s['cls'] not in htmlTag)
            a2 = ('id="%s"' % s['boot']) in html
            a3 = (cardT != '') and (hide not in cardT)
            # 负对照：阿姨那页必须真的停在"没登录"那屏
            nc = True
            if appT:
                nc = (hide in appT)
            ok = a1 and a2 and a3 and nc
            print(u'  %s %s' % (u'✅' if ok else u'❌', s['name']))
            print(u'       <html> = %s' % htmlTag)
            print(u'       A1 没有 %s = %s' % (s['cls'], a1))
            print(u'       A2 纱幕还在 = %s   %s' % (a2, bootTag[:90]))
            print(u'       A3 登录卡露着 = %s   %s' % (a3, cardT[:90]))
            if appT:
                print(u'       负对照 app-screen=' + (u'hidden ✓' if nc else u'没 hidden ✗') + u'   %s' % appT[:70])
            if not ok:
                fails.append(s['name'])
    finally:
        shutil.rmtree(PROF, ignore_errors=True)
    print('')
    if fails:
        print(u'!! 有没过项：' + u' / '.join(fails))
        sys.exit(1)
    print(u'全部通过 ✅')


if __name__ == '__main__':
    main()
