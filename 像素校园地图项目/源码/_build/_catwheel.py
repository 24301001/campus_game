# -*- coding: utf-8 -*-
"""猫宠 · 交互重做（第四十四轮）的一次性运行时探针 —— 轮盘 / 蹲姿 / 猫走过来 / 猫粮。

用法:
  python _build/_catwheel.py logic     # 跑八组判据，结果写进 <title>，--dump-dom 回读
  python _build/_catwheel.py shot      # 出三张关键帧到 _look/wheel_*.png

为什么不能只看图 / 只跑 _catprobe.py：
  `_catprobe.py` 钉的是**第四十三轮**那套（档位 / 领地 / 记忆），本轮改的是
  「人有没有动」「猫有没有真的位移过来」—— 这两件事全在**时间轴上**，
  单帧截图看不出来。所以本探针显式驱动 `catTick(dt)` / `update(dt)`
  （不是后门：`catTick` 就是补丁 22 挂进主循环的那个，`update` 是补丁 24 改的那个）。

⚠️ `--headless=new --virtual-time-budget` 下 rAF 基本不推进，**必须显式调**；
   而且那个开关会把时钟**快进**，所以下面：
     · 每组之间的等待压到 20ms、喂那组只等 450ms（等 harness 自带的 setTimeout(320)）；
     · `--virtual-time-budget` 只给 8000。
   目的是让 `catNow().t` 在整条链里只走 ~2 秒 —— `comeTo`（8s）与粮 ttl（12s）
   这两个**基于真实时钟**的截止才不会在同步步进里被误判成过期
   （它们各自的语义由 `_catprobe.py` 与 `catTick` 开头那行负责，这里只验运动学）。
"""
import io, os, re, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(HERE)
SRC = os.path.join(PROJ, '像素校园_全校地图.html')
CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
LOOK = os.path.join(HERE, '_look') + os.sep
os.makedirs(LOOK, exist_ok=True)

# 登录门：没有 token 就弹一张盖全屏的模态框（同 _catshot.py 的处置，走它自己
# 「24 小时内再来直接进」那一支，不是绕过验证）。
INJECT = """<script>
window.__diag=[];window.onerror=function(m,s,l,c){window.__diag.push('ERR '+m+' @'+l+':'+c);};
try { localStorage.setItem('token', 'catwheel-probe'); } catch (e) {}
</script>
"""

# --- 探针公共段（fixture + 断言器）---
LIB = """
/* ⚠️ 钉住时钟**不再是为了"让猫出现"** —— 第四十四轮起作息表里没有 `at: null` 了，
   全天 24 小时四只猫都在场（`76_cat_data.js` 顶部那段）。钉它只是为了**可复现**：
   不钉的话白天/夜里猫待的点不同，探针读数会随跑的时刻变。 */
catTimeOverride = '10:00';
function $$(id){ return document.getElementById(id); }
function byId(id){ return CAT_BY_ID[id]; }
function toastTxt(){ return ($$('toast') ? $$('toast').textContent : ''); }
function seed(id, v){                            // 种好感分（同 _catshot.py 的口径）
  var L = catLedger(), m = catRec(L, id);
  m.importance = v; m.time = Date.now(); m.lastDay = ''; catLedgerSave(L);
}
function clean(){                                // 每组开跑前的复位
  CAT_FOOD = null; player.act = null; player.actT = 0; player.actD = 0;
  for (var i = 0; i < CATS.length; i++){
    var c = CATS[i];
    c.comeTo = null; c.holdT = 0; c.holdAct = null;
    c.x = c.spot.x; c.y = c.spot.y;              // ⚠️ 位置也归零：不归零则后一组的
    c.lastX = c.x; c.lastY = c.y;                //    起点取决于上一组把猫推到哪了
  }
  keys.a = keys.d = keys.w = keys.s = 0;
  keys.arrowleft = keys.arrowright = keys.arrowup = keys.arrowdown = 0;
}
function steps(n){ for (var i = 0; i < n; i++) catTick(0.05); }
/* 把玩家放到猫周围 dist 处。
   ⚠️ `insideOnly` 时还必须落在**猫的领地圈内**（`|P - home| <= radius - 4`）——
      否则 `catLeash` 会把目标夹到圈边，猫走一半就"停"了，测出来的是领地边界
      而不是"猫自己走没走"。24 个方向逐个试，第一个同时满足"可走 + 在圈内"的胜出。 */
function placeNear(c, want, insideOnly, margin){
  var h = c.spot, R0 = c.cfg.roam.radius, mg = (margin == null ? 4 : margin);
  for (var d = want; d >= 40; d -= 5){          // 先要最远的，够不着再退
    for (var k = 0; k < 32; k++){
      var a = k / 32 * Math.PI * 2;
      var x = c.x + Math.cos(a) * d, y = c.y + Math.sin(a) * d;
      if (!(x > 14 && y > 60 && x < WORLD_W - 14 && y < WORLD_H - 16
            && canWalk(x, y) && !blocked(x, y))) continue;
      /* ⚠️ 还要**不在水里**：`canWalk` 允许下水（那是"下水淹没"那条特性的前提），
         可 `lakeSubmerge > 0` 时人物会被补丁 15 按行**裁掉**，截图上直接看不见 ——
         第一次拍喂食帧就栽在这儿：图上一个人都没有，还以为是渲染坏了。 */
      if (typeof lakeSubmerge === 'function' && lakeSubmerge(x, y) > 0) continue;
      if (insideOnly && Math.hypot(x - h.x, y - h.y) > R0 - mg) continue;
      player.x = x; player.y = y; return d;
    }
  }
  return 0;
}
function pressG(){                               // 走**真的**键盘路径，不调内部函数
  window.dispatchEvent(new KeyboardEvent('keydown', {key: 'g', bubbles: true}));
}
function dist2(a, b){ return Math.hypot(a.x - b.x, a.y - b.y); }
"""

# --- 8 组判据 ---
# 每组是一个 (next) 函数；同步组自己调 next()，异步组在 setTimeout 里调。
SCEN = r"""
var SC = [
/* A 摸·亲近（**核心**）：猫必须从远处**真的走过来**，人蹲着不挪窝 */
function(next){
  clean(); seed('cat_daju', 70);
  var c = byId('cat_daju');
  var placed = placeNear(c, 110, true); steps(3);
  var d0 = dist2(player, c);
  var dHome = Math.hypot(player.x - c.spot.x, player.y - c.spot.y);
  pressG();
  var wheelOpened = window._wheelOpen();
  window._wheelRun('pet');
  var pact = player.act;
  var x0 = player.x, y0 = player.y;
  keys.a = 1;                                  // 按住左：蹲姿必须把它锁住
  for (var k = 0; k < 20; k++) update(0.05);   // 1.0 秒（actD=2.6，还在蹲）
  keys.a = 0;
  var pmoved = Math.hypot(player.x - x0, player.y - y0);
  var stillCrouch = player.act;
  steps(70);                                   // 猫走 3.5 秒
  var d1 = dist2(player, c), t = toastTxt();
  var lt = catLeash(c, player.x, player.y);
  var clamped = Math.hypot(lt.x - player.x, lt.y - player.y) > 0.5;
  if (!placed) bad.push('A-NO-SPOT');
  if (!wheelOpened) bad.push('A-WHEEL-NOT-OPEN');
  if (d0 < 55) bad.push('A-START-TOO-CLOSE ' + d0.toFixed(0));
  if (!(d1 < d0 - 25)) bad.push('A-NOT-APPROACH ' + d0.toFixed(0) + '->' + d1.toFixed(0));
  if (!(d1 <= 24)) bad.push('A-NOT-AT-LEG ' + d1.toFixed(0));
  if (c.act !== 'rub') bad.push('A-ACT ' + c.act);
  if (pact !== 'pet') bad.push('A-PACT ' + pact);
  if (stillCrouch !== 'pet') bad.push('A-CROUCH-BROKE ' + stillCrouch);
  if (pmoved > 0.001) bad.push('A-PLAYER-MOVED ' + pmoved.toFixed(2));
  if (/[0-9]/.test(t)) bad.push('A-NUM ' + t);
  R.push('A ' + d0.toFixed(0) + '->' + d1.toFixed(0) + ' act=' + c.act
         + ' 蹲=' + pact + ' 位移=' + pmoved.toFixed(1) + ' 「' + t + '」'
         + ' [R=' + c.cfg.roam.radius + ' 人到home=' + dHome.toFixed(0)
         + ' 夹住=' + clamped + ']');
  next();
},
/* B 摸·熟档：不让摸 —— 退开，且**不许**过来 */
function(next){
  clean(); seed('cat_guanzhang', 50);
  var c = byId('cat_guanzhang');
  placeNear(c, 60); steps(3);
  window._wheelRun('pet');
  var came = !!c.comeTo, a0 = c.act;
  steps(5);                                    // 0.25 秒（holdT=1.2，还在锁里）
  if (came) bad.push('B-COME(熟档不该过来)');
  if (a0 !== 'retreat') bad.push('B-ACT0 ' + a0);
  if (c.act !== 'retreat') bad.push('B-ACT ' + c.act);
  R.push('B comeTo=' + came + ' act=' + c.act + ' 「' + toastTxt() + '」');
  next();
},
/* C 喂·**陌生**档：那个「逃跑距离 120 = 喂食半径 120」的 bug 的正面验证
     —— 粮落地、猫走过来、低头吃。 */
function(next){
  clean(); seed('cat_daju', 0);
  var c = byId('cat_daju');
  placeNear(c, 90, true, 24); steps(3);
  var d0 = dist2(player, c);
  window._wheelRun('feed');
  var crouch = player.act;
  setTimeout(function(){
    var gotFood = !!CAT_FOOD;
    if (!gotFood) bad.push('C-NO-FOOD');
    var fx = CAT_FOOD ? CAT_FOOD.x : 0, fy = CAT_FOOD ? CAT_FOOD.y : 0;
    /* ⚠️ 探针专用：`--virtual-time-budget` 会把时钟快进，"粮到点消失"会在下面这个
       **同步**循环里被误判过期。这里把 `until` 顶到无穷远，只验"猫会不会走过来、
       走到**嘴够得着**的地方低头吃"。 */
    if (CAT_FOOD) CAT_FOOD.until = 1e18;
    steps(80);                                 // 猫走 4 秒
    var dFood = Math.hypot(c.x - fx, c.y - fy);
    var dPlayer = Math.hypot(fx - player.x, fy - player.y);
    var lt = catLeash(c, fx, fy);
    var clamped = Math.hypot(lt.x - fx, lt.y - fy) > 0.5;
    /* ★ 第四十四轮的两条新判据（用户 2026-10-09 报的"猫头在别处"）：
       ① 猫停在 `CAT_EAT_STOP` 附近 —— 原来写死 14，等于隔半个身子啃空气；
       ② 粮的"寿命"被改写成和"吃完"同一个时刻（`catTick` 到位那一帧干的）。 */
    var arrive = !!(c.comeTo && c.comeTo.arrived);
    var ttlSync = !!(CAT_FOOD && c.comeTo && Math.abs(CAT_FOOD.until - c.comeTo.until) < 2);
    /* ③ 猫得**面朝粮**。猫的朝向只在 `catStep` 里刷新；粮落在脚边时它一步没走，
       不补这一手就是"低着头朝别处啃"。 */
    var fdx = fx - c.x, fdy = fy - c.y;
    var wantDir = (Math.abs(fdx) >= Math.abs(fdy)) ? (fdx < 0 ? 'left' : 'right')
                                                  : (fdy < 0 ? 'up' : 'down');
    var faced = Math.hypot(fdx, fdy) <= 0.5 || c.dir === wantDir;
    if (CAT_FOOD) CAT_FOOD.until = 1e18;       // 收尾再顶一次（上面那几行读过真值了）
    if (crouch !== 'feed') bad.push('C-CROUCH ' + crouch);
    if (c.act !== 'eat') bad.push('C-ACT ' + c.act);
    if (!clamped && dFood > CAT_EAT_STOP + 2) bad.push('C-FAR ' + dFood.toFixed(1));
    if (!arrive) bad.push('C-NO-ARRIVE');
    if (!ttlSync) bad.push('C-TTL-SYNC');
    if (!faced) bad.push('C-NOT-FACING dir=' + c.dir + ' 想要=' + wantDir);
    if (clamped) bad.push('C-CLAMPED(粮落在领地外)');
    if (dPlayer > 20) bad.push('C-NOT-AT-FOOT ' + dPlayer.toFixed(0));
    R.push('C d0=' + d0.toFixed(0) + ' 粮@' + fx.toFixed(0) + ',' + fy.toFixed(0)
           + ' 猫到粮=' + dFood.toFixed(1) + ' 粮到人=' + dPlayer.toFixed(0)
           + ' act=' + c.act + ' 到达=' + arrive + ' 同步=' + ttlSync + ' 朝向=' + c.dir
           + ' 夹住=' + clamped + ' R=' + c.cfg.roam.radius
           + ' 「' + toastTxt() + '」');
    next();
  }, 450);
},
/* D 叫它：六档都抬头 */
function(next){
  clean(); seed('cat_lihua', 30);
  var c = byId('cat_lihua');
  placeNear(c, 100); steps(3);
  window._wheelRun('call'); steps(6);
  if (c.act !== 'look') bad.push('D-ACT ' + c.act);
  R.push('D act=' + c.act + ' 「' + toastTxt() + '」');
  next();
},
/* E 逗它·亲近：扑 */
function(next){
  clean(); seed('cat_daju', 70);
  var c = byId('cat_daju');
  placeNear(c, 100); steps(3);
  window._wheelRun('tease'); steps(4);
  if (c.act !== 'play') bad.push('E-ACT ' + c.act);
  R.push('E act=' + c.act + ' 「' + toastTxt() + '」');
  next();
},
/* F 出圈：所有动作跑完，每只猫仍在自己的 radius 内（验收第 7 条） */
function(next){
  var oob = [];
  for (var i = 0; i < CATS.length; i++){
    var c = CATS[i], d = Math.hypot(c.x - c.spot.x, c.y - c.spot.y);
    if (d > c.cfg.roam.radius + 0.5)
      oob.push(c.cfg.id + ' ' + d.toFixed(1) + '>' + c.cfg.roam.radius);
  }
  if (oob.length) bad.push('F-OOB ' + oob.join(','));
  R.push('F 出圈=' + (oob.length ? oob.join(',') : '无'));
  next();
},
/* G 轮盘 DOM：四个扇区、顺序与 data-act 正确，且**真点一下**能执行 */
function(next){
  clean(); seed('cat_daju', 70);
  var c = byId('cat_daju');
  placeNear(c, 40); player.dir = 'down'; steps(3);
  var secs = document.querySelectorAll('#wheel .ws'), acts = [];
  for (var i = 0; i < secs.length; i++) acts.push(secs[i].getAttribute('data-act'));
  pressG();
  var opened = window._wheelOpen();
  var el = document.getElementById('wheel');
  var vis = el && !el.hidden;
  /* 点「叫它」那一格 —— 用真的 MouseEvent，走的是 el 上那个 click 监听 */
  var target = null;
  for (var j = 0; j < secs.length; j++) if (secs[j].getAttribute('data-act') === 'call') target = secs[j];
  if (target) target.dispatchEvent(new MouseEvent('click', {bubbles: true}));
  steps(4);
  var closed = !window._wheelOpen();
  if (acts.join(',') !== 'pet,feed,call,tease') bad.push('G-SECTORS ' + acts.join(','));
  if (!opened) bad.push('G-NOT-OPEN');
  if (!vis) bad.push('G-NOT-VISIBLE');
  if (!closed) bad.push('G-NOT-CLOSED-AFTER-CLICK');
  if (c.act !== 'look') bad.push('G-CLICK-ACT ' + c.act);
  R.push('G 扇区=' + acts.join(',') + ' 点call→act=' + c.act + ' 点后收起=' + closed);
  next();
},
/* H 没有数字：整块可见 UI（轮盘 + 提示条）里不许出现数字或「好感」 */
function(next){
  clean();
  pressG();                                    // 开一次轮盘，让它参与扫描
  var txt = '';
  ['wheel', 'toast', 'tip'].forEach(function(id){
    var e = document.getElementById(id); if (e) txt += e.textContent;
  });
  if (/[0-9]/.test(txt)) bad.push('H-DIGIT');
  if (txt.indexOf('好感') >= 0) bad.push('H-AFFINITY-WORD');
  R.push('H 可见文案=「' + txt.replace(/\s+/g, ' ').trim() + '」');
  pressG();
  next();
}
];
"""

DRIVER = r"""
var R = [], bad = [], i = 0;
(function loopNext(){
  if (i >= SC.length) {
    document.title = 'CW|' + R.join(' || ')
      + '|' + (bad.length ? ('BAD ' + bad.join(' ; ')) : 'OK')
      + '|' + (window.__diag.join(' | ') || 'clean');
    return;
  }
  var f = SC[i++];
  try { f(function(){ setTimeout(loopNext, 20); }); }
  catch(e){ bad.push('EX@' + i + ' ' + e.message); setTimeout(loopNext, 20); }
})();
"""

LOGIC = LIB + SCEN + DRIVER

# --- 三张关键帧 ---
# 每一张都是"摆好 → 显式步进 → render() → 截图"，和 _catshot.py 一个套路。
SHOTS = {
 'wheel_pet': LIB + r"""
seed('cat_daju', 70);
var c = byId('cat_daju');
/* 先把玩家放到领地圈内的远处，再让他蹲下伸手、猫蹭上来 */
if (placeNear(c, 110, true)) { steps(3);
  window._wheelRun('pet');
  update(0.2); update(0.2);                 // 0.4 秒 ⇒ 补丁 23 取帧 1（手伸出去）
  steps(60);                                // 猫走到脚边
}
cam.x = Math.max(0, Math.min(player.x - VIEW_W / 2,    Math.max(0, WORLD_W - VIEW_W)));
cam.y = Math.max(0, Math.min(player.y - VIEW_H * 0.62, Math.max(0, WORLD_H - VIEW_H)));
render();
document.title = 'SHOT|pet|d=' + dist2(player, c).toFixed(0) + '|act=' + c.act
                 + '|pact=' + player.act + '|' + (window.__diag.join('|') || 'clean');
""",
 'wheel_open': LIB + r"""
seed('cat_daju', 70);
var c = byId('cat_daju');
placeNear(c, 40); steps(3);
pressG();
cam.x = Math.max(0, Math.min(player.x - VIEW_W / 2,    Math.max(0, WORLD_W - VIEW_W)));
cam.y = Math.max(0, Math.min(player.y - VIEW_H * 0.62, Math.max(0, WORLD_H - VIEW_H)));
render();
document.title = 'SHOT|open|wheel=' + window._wheelOpen();
""",
 'wheel_feed': LIB + r"""
/* ⚠️ 用**大橘**（食堂后）而不是芝麻（明湖影壁）：第一版用芝麻，玩家正好站在影壁
   背后被那面墙整个盖住 —— 图上一个人都没有。这是道具遮挡的正确行为（baseY 排序），
   只是当截图取景不合适。 */
seed('cat_daju', 0);
var c = byId('cat_daju');
placeNear(c, 90, true, 24); steps(3);
window._wheelRun('feed');
update(0.2); update(0.2);
setTimeout(function(){
  if (CAT_FOOD) CAT_FOOD.until = 1e18;
  steps(50);                                 // 猫走到粮跟前、低头开吃
  if (CAT_FOOD) CAT_FOOD.until = 1e18;       // 到位那一帧会被改写成 now+CAT_EAT_MS，再顶一次
  update(0.2);
  cam.x = Math.max(0, Math.min(player.x - VIEW_W / 2,    Math.max(0, WORLD_W - VIEW_W)));
  cam.y = Math.max(0, Math.min(player.y - VIEW_H * 0.62, Math.max(0, WORLD_H - VIEW_H)));
  render();
  document.title = 'SHOT|feed|food=' + (CAT_FOOD ? 1 : 0) + '|act=' + c.act
                   + '|pact=' + player.act;
  /* 把坐标写进页面自己 —— 截图与 --dump-dom 是**两次** Chrome，标题读的是另一次的
     状态；写进 DOM 的就是这一张图里的真值，可以直接在 PNG 上读。 */
  var t = $$('toast');
  if (t) t.textContent = 'P=' + Math.round(player.x) + ',' + Math.round(player.y)
    + ' C=' + Math.round(c.x) + ',' + Math.round(c.y)
    + ' F=' + (CAT_FOOD ? Math.round(CAT_FOOD.x) + ',' + Math.round(CAT_FOOD.y) : '-')
    + ' pdir=' + player.dir + ' cdir=' + c.dir
    + ' cam=' + Math.round(cam.x) + ',' + Math.round(cam.y)
    + ' subm=' + lakeSubmerge(player.x, player.y).toFixed(2)
    + ' dFood=' + Math.hypot(c.x - CAT_FOOD.x, c.y - CAT_FOOD.y).toFixed(1);
}, 450);
""",
}

WRAP_HEAD = """<script>
"""


def build(body):
    html = io.open(SRC, encoding='utf-8').read()
    assert '</body>' in html, '源产物里没有 </body>'
    html = html.replace('<script>', INJECT + '<script>', 1)
    html = html.replace('</body>',
                        '<script>\nwindow.addEventListener("load", function(){\n'
                        'setTimeout(function(){ try{\n' + body
                        + '\n}catch(e){ document.title = "CW|EX " + e.message; } }, 1500);\n'
                        '});\n</script>\n</body>', 1)
    return html


def chrome(args, tmp):
    return subprocess.run([CHROME, '--headless=new', '--disable-gpu', '--no-sandbox',
                           '--hide-scrollbars', '--virtual-time-budget=8000'] + args
                          + ['file:///' + tmp.replace('\\', '/')],
                          capture_output=True, check=False)


def title_of(stdout):
    m = re.search(r'<title>(.*?)</title>', stdout.decode('utf-8', 'replace'), re.S)
    return m.group(1).strip() if m else 'NO TITLE'


def main():
    mode = sys.argv[1] if len(sys.argv) > 1 else 'logic'
    if mode == 'logic':
        tmp = os.path.join(HERE, '_catwheel_gen.html')
        io.open(tmp, 'w', encoding='utf-8', newline='\n').write(build(LOGIC))
        p = chrome(['--dump-dom', '--window-size=1200,820'], tmp)
        print(title_of(p.stdout))
        return
    if mode == 'shot':
        for name, body in sorted(SHOTS.items()):
            tmp = os.path.join(HERE, '_catwheel_gen_' + name + '.html')
            io.open(tmp, 'w', encoding='utf-8', newline='\n').write(build(body))
            out = os.path.abspath(LOOK + name + '.png')
            chrome(['--screenshot=' + out, '--window-size=1400,900'], tmp)
            p = chrome(['--dump-dom', '--window-size=1400,900'], tmp)
            print('%-12s %-8s %s' % (name,
                                     os.path.getsize(out) if os.path.exists(out) else 'MISSING',
                                     title_of(p.stdout)))
        return
    raise SystemExit(__doc__)


if __name__ == '__main__':
    main()
