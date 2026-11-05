# -*- coding: utf-8 -*-
"""「一次登录进三家」端到端探针 —— 老丁（保卫处）这一家（2026-10-09 · 第四十三轮）。

为什么必须单独有一个：本轮改的是**跨模块的单点登录**，而它的坏法全是**静默**的 ——
  · 请求体字段名发错（学霸姐要 `nick`，老丁要 `nickname`）⇒ 422，`ldSync` 读不到 `token`
    就落 skip，**控制台一个字都不报**，症状只是"按 C 又弹了个登录框"。
  · 老丁前端认领共享票时，`enterChat` 会**顺手把它自己那份会话也写下来** ⇒ 地图登出
    只清 `ld_token`，那份残留会让抽屉**以上一个账号的身份**自动进去。换个人来玩直接串号。
这两样 build.py 的静态断言只能钉住"代码还在"，**钉不住"行为对不对"**。

它验五件事，全部走真实浏览器 + 真实 iframe（不 mock 任何东西）：

  L0  先清干净 `ld_token` / `ld_cred`（保证从零开始）
  L1  ⭐ 地图侧 `ldSync('admin','admin123')` 真的换到了票：`st=ok` 且 `ld_token` 非空
  L2  ⭐ **负对照**：错密码**不能**默默成功 —— 必须是 `skip`，且**不许**把 L1 那张好票抹掉
  L3  ⭐ 老丁前端真的认领了这张票：iframe 里 `#login-view` 隐藏 + `#chat-view` 露出
  L4  ⭐ **不串号**：认领之后，老丁**自己那份**会话键必须是 0 个
  L5  ⭐ **负对照**：抽掉 `ld_token` 再开一次 ⇒ 必须回到登录框（没把"该登录的"也放过）
  L6  ⭐ 走**用户实际按的那个按钮**（登录门 `doLogin`）也能把票种上，`CENTER.ld` 变 `ok`
  L7  ⭐ **老会话自愈**：只有 `token`+`user`、没有 `ld_cred`（＝第四十三轮之前登过的人，
        也就是**绝大多数用户**）⇒ `ldBootSync` 靠预设账号把票补上，不然就是"看着修了其实没修"

⚠️ 为什么不用 file://：`/ld/` 这个同源代理链（Vite `/ld` → 8000 → PrefixStrip）只有在
   http://localhost:3000 上才成立（同 `_guardprobe.py` 的理由）。

用法：先确保 3000 / 8000 都在跑，再 `python _build/_ldloginprobe.py`。判读看最后的 `LDP|` 行。
"""
import io, json, os, shutil, subprocess, time, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(HERE)
OUT = os.path.join(HERE, '_ldprobe_gen.html')
# ⚠️ `campus_game` 挂在**总目录**下（`像素校园地图项目` 的父目录）。不 makedirs：
#    目录不存在就直接报错 —— 宁可红，不要静默造树（第一版栽过）。
ROOT = os.path.dirname(os.path.dirname(PROJ))
PUB = os.path.join(ROOT, 'campus_game', 'frontend', 'public', '_ldprobe_gen.html')
PROF = os.path.join(HERE, '_ldprobe_prof')
PORT = 9344
URL = 'http://localhost:3000/_ldprobe_gen.html'
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
MAXTICKS = 160                                     # 160 × 0.5s = 80s 上限

PROBE = r"""
<script>
(function(){
  var R = [];
  function note(k, v){ R.push(k + '=' + v); document.title = 'LDP|' + R.join(' | '); }
  window.onerror = function(m, u, l, c){ note('ERR@' + l + ':' + c, m); return false; };
  function sleep(ms){ return new Promise(function(r){ setTimeout(r, ms); }); }

  /* 看 iframe 里老丁到底是登录框还是聊天界面。同源 ⇒ 直接读它的 document。 */
  function viewState(f){
    try {
      var d = f.contentDocument;
      if (!d) return 'noDoc';
      var lv = d.getElementById('login-view'), cv = d.getElementById('chat-view');
      if (!lv || !cv) return 'noSections';
      return (lv.classList.contains('hidden') ? 'login:HIDDEN' : 'login:SHOWN')
           + ',' + (cv.classList.contains('hidden') ? 'chat:HIDDEN' : 'chat:SHOWN');
    } catch (e) { return 'X:' + e.message; }
  }
  /* 开一个真 iframe 指向 /ld/，等它自己的 init() 跑完（里面有一次 /api/me）。 */
  function frame(){
    return new Promise(function(res){
      var f = document.createElement('iframe');
      f.style.cssText = 'position:fixed;left:-9999px;top:0;width:900px;height:700px;';
      f.src = '/ld/';
      f.onload = function(){ sleep(2200).then(function(){ res([f, viewState(f)]); }); };
      document.body.appendChild(f);
    });
  }
  /* 老丁自己那份会话键：`guard_v<dataVersion>_auth`（见 laoding/index.html 的 Store.key）。 */
  function ownAuthKeys(){
    try { return Object.keys(localStorage).filter(function(k){ return /^guard_v\d+_auth$/.test(k); }); }
    catch (e) { return ['<X>']; }
  }

  (async function(){
    try {
      /* --- L0 先清干净 --- */
      try {
        localStorage.removeItem('ld_token');
        localStorage.removeItem('ld_cred');
        ownAuthKeys().forEach(function(k){ localStorage.removeItem(k); });
      } catch (e) {}
      note('L0', 'cleared');

      /* --- L1 正路：一次登录真的换到票 --- */
      var st = await ldSync('admin', 'admin123', 0);
      note('L1', 'st=' + st
        + ' tokLen=' + ((localStorage.getItem('ld_token') || '').length)
        + ' cred=' + (localStorage.getItem('ld_cred') ? 'Y' : 'N'));
      var goodTok = localStorage.getItem('ld_token') || '';

      /* --- L2 负对照：错密码不许默默成功，也不许毁掉好票 --- */
      var st2 = await ldSync('admin', 'definitely-wrong-pw', 0);
      note('L2', 'wrongPw_st=' + st2
        + ' goodTokIntact=' + ((localStorage.getItem('ld_token') === goodTok && goodTok) ? 'Y' : 'N'));

      /* --- L6 ⭐ 走**用户实际按的那个按钮**（登录门 → doLogin），别只测我自己调的 ldSync ---
         这一段才是真路径：`doLogin` 里得真的接了 `ldCredSave` + `ldSync` 这两句。 */
      try {
        localStorage.removeItem('ld_token');
        localStorage.removeItem('ld_cred');
      } catch (e) {}
      var lgU = document.getElementById('lgU'), lgP = document.getElementById('lgP');
      if (lgU && lgP) {
        lgU.value = 'admin'; lgP.value = 'admin123';
        doLogin();
        for (var i = 0; i < 40; i++) {
          await sleep(200);
          if (localStorage.getItem('ld_token') && CENTER.ld) break;
        }
        note('L6', 'tokLen=' + ((localStorage.getItem('ld_token') || '').length)
          + ' cred=' + (localStorage.getItem('ld_cred') ? 'Y' : 'N')
          + ' CENTER.ld=' + JSON.stringify(CENTER.ld));
      } else {
        note('L6', 'noGate');           // 找不到 #lgU/#lgP —— 登录门的结构变了
      }

      /* --- L3/L4 老丁前端认领共享票 --- */
      var r1 = await frame();
      note('L3', r1[1]);
      note('L4', 'ownAuthKeys=' + ownAuthKeys().length);
      try { r1[0].remove(); } catch (e) {}

      /* --- L5 负对照：抽掉共享票 ⇒ 必须回到登录框 --- */
      try { localStorage.removeItem('ld_token'); } catch (e) {}
      var r2 = await frame();
      note('L5', r2[1]);
      try { r2[0].remove(); } catch (e) {}

      /* --- L7 ⭐ 老会话自愈（用户这一轮就是这种情况）---
         模拟"第四十三轮之前登过"的状态：有 `token` + `user`，但 `ld_token`/`ld_cred` 一个都没有
         （`ld_cred` 是**本轮才开始记**的）。`ldBootSync` 必须靠登录门上那对预设账号把票补上，
         否则用户刷新后按 C **照样**弹登录框 —— 那就是"看起来修了其实没修"。 */
      try {
        localStorage.removeItem('ld_token');
        localStorage.removeItem('ld_cred');
        ownAuthKeys().forEach(function (k) { localStorage.removeItem(k); });
        localStorage.setItem('token', 'dummy-campus-token');        // 只要"有票"这个信号
        localStorage.setItem('user', JSON.stringify(
          { id: 1, username: 'admin', nickname: '管理员', role: 'ADMIN' }));
      } catch (e) {}
      ldBootSync();
      for (var j = 0; j < 40; j++) {
        await sleep(200);
        if (localStorage.getItem('ld_token')) break;
      }
      note('L7', 'tokLen=' + ((localStorage.getItem('ld_token') || '').length)
        + ' CENTER.ld=' + JSON.stringify(CENTER.ld));

      note('DONE', '1');
    } catch (e) {
      note('EX', String(e && e.message) + '@' + String((e && e.stack) || '').split('\n')[1]);
      note('DONE', '1');
    }
  })();
})();
</script>
"""


def read_title():
    try:
        data = json.load(urllib.request.urlopen('http://127.0.0.1:%d/json' % PORT, timeout=5))
    except Exception as e:
        return '<CDP 连不上: %s>' % e
    for t in reversed(data):
        if t.get('type') == 'page' and t.get('url', '').startswith('http'):
            return t.get('title', '')
    return '<没有页面>'


def kill_profile():
    ps = ("Get-CimInstance Win32_Process -Filter \"Name='chrome.exe'\" | "
          "Where-Object { $_.CommandLine -like '*_ldprobe_prof*' } | "
          "ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }")
    subprocess.run(['powershell', '-NoProfile', '-Command', ps], capture_output=True)


def main():
    if not os.path.exists(CHROME):
        raise SystemExit('找不到 Chrome：' + CHROME)
    html = io.open(os.path.join(PROJ, u'像素校园_全校地图.html'), encoding='utf-8').read()
    assert '</body>' in html, '源产物里没有 </body>'
    gen = html.replace('</body>', PROBE + '</body>')
    assert os.path.isdir(os.path.dirname(PUB)), \
        'frontend/public 不存在（%s）—— 先跑一次启动器把前端铺起来' % os.path.dirname(PUB)
    io.open(PUB, 'w', encoding='utf-8', newline='\n').write(gen)
    io.open(OUT, 'w', encoding='utf-8', newline='\n').write(gen)

    kill_profile()
    shutil.rmtree(PROF, ignore_errors=True)
    args = [CHROME, '--no-sandbox', '--no-first-run', '--no-default-browser-check',
            '--headless=new', '--disable-gpu',
            '--remote-debugging-port=%d' % PORT,
            '--user-data-dir=' + PROF,
            '--window-size=1280,720',
            URL]
    p = subprocess.Popen(args, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    last = ''
    print('LD LOGIN PROBE  (要真开两个 /ld/ iframe，约 15~30s；判读见最后的 LDP| 行)')
    try:
        for i in range(MAXTICKS):
            time.sleep(0.5)
            t = read_title()
            if t != last:
                last = t
                if t.startswith('LDP|'):
                    print('  t=%5.1fs  %s' % (i * 0.5, t[4:][:180]))
                if 'DONE=1' in t:
                    break
        print('\n==== 最终 ====')
        print(last[4:].replace(' | ', '\n') if last.startswith('LDP|') else last)
    finally:
        p.terminate()
        kill_profile()
        # ⚠️ 收尾**逐个精确路径**删（PUB 落在 Vite 发布目录里，尤其不能留）。
        for _f in (OUT, PUB):
            try:
                if os.path.exists(_f):
                    os.remove(_f)
            except OSError:
                pass


if __name__ == '__main__':
    main()
