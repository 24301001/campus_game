# -*- coding: utf-8 -*-
"""猫宠 —— 生成「试玩页」`_play.html`（**一次性产物，绝不交付**）。

为什么不是直接开交付版：正经玩的话四只猫的好感都从 0 起、**一天只能喂一次**
（`交互.md §六` 的防刷冷却）、一次 +12 ⇒ 按 `CAT_TIERS` 要爬到第 5 个游戏日才够
「亲近」档。用户想现在就看到「猫自己靠过来蹭腿」，等不起。
所以这个页面只抢跑两件事，其余一切与交付版逐字相同：

  ① 跳过登录门（走它自己「24 小时内再来，直接进」那一支，读 `localStorage.token`）；
  ② 把「大橘」预置成 70 ＝ **亲近**档，并把 pid 钉死成 `p_demo`
     （不钉的话 `catPid()` 会另生成一个，种进去的记录对不上号）。

⚠️ 里面**没有**任何好感数字显示 —— `交互.md §六`「只有动作，没有数字」是解法不是冲突。
⚠️ 交付版（项目根那份）**不含这两段**，那边的节奏是设计好的，别动。

用法:
  python _build/_play.py            # 从当前产物重新生成 _play.html
"""
import io, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
PROJ = os.path.dirname(HERE)
SRC = os.path.join(PROJ, '像素校园_全校地图.html')
OUT = os.path.join(HERE, '_play.html')

# ⚠️ 本脚本自己的注释里也不能出现**带尖括号的脚本标签字面量** ——
#    下面那个锚点常量必须靠字符串拼接写出来，否则 build.py:4168 那种正则会错位。
_ST = '<' + 'script>'

INJECT = _ST + """
/* 试玩页注入（一次性，别拿去交付）：
   ① 跳过登录门 —— 走它自己「24 小时内再来，直接进」那一支（loginGate 读 localStorage.token）。
   ② **种一份演示存档**：把「大橘」的好感预置到 70（＝「亲近」档）。
      正经玩的话好感从 0 起、一天只能喂一次、一次 +12 ⇒ 要到第 5 天才会到「亲近」，
      这一轮没法试出「猫走过来蹭腿」。所以只在这个一次性页面上抢跑一下。
      ⚠️ 顺带把 pid 钉死成 p_demo，否则 catPid() 会另生成一个，种进去的记录就对不上号。
      ⚠️ 交付版（项目根那份）**不含**这段，那边的节奏是设计好的，别动。
   ③ 挂错误收集器，出错直接写标题栏，省得白屏了还不知道为什么。 */
try{
  localStorage.setItem('token','play');
  localStorage.setItem('user', JSON.stringify({id:0,username:'play',nickname:'试玩',role:'student'}));
  localStorage.setItem('pixelcampus.pid','p_demo');
  var _now = Date.now();
  localStorage.setItem('pixelcampus.cat_affinity', JSON.stringify({
    "p_demo|cat_daju": {desc:"对 cat_daju 的好感", time:_now, importance:70,
                        visibility:"private", playerId:"p_demo",
                        source:"cat_affinity", catId:"cat_daju", lastDay:""}
  }));
}catch(e){}
window.__playDiag=[];window.onerror=function(m,s,l,c){window.__playDiag.push(m+' @'+l+':'+c);};
</script>
"""

TAIL = _ST + """
/* 试玩页专用一件（**不进交付**）：按 `C` 轮着跳到下一只猫旁边。
   校园很大，四只猫是 18×18 的小图，靠腿找太费劲。
   ⚠️ 这是调试用的瞬移，交付版**没有**这个键。
   ⚠️ 落点要同时过 `canWalk` / `blocked` / `lakeSubmerge` 三关 ——
      只查前两个会把人放到水里（第四十三轮踩过）。 */
(function () {
  var idx = -1;
  var OFF = [[20,0],[-20,0],[0,16],[0,-16],[16,16],[-16,16],[16,-16],[-16,-16],[0,28],[0,-28],[28,0],[-28,0]];
  window.addEventListener('keydown', function (e) {
    if (e.isComposing || e.keyCode === 229) return;
    var t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
    if ((e.key || '').toLowerCase() !== 'c') return;
    if (document.body && document.body.classList.contains('ctr-on')) { guideToast('先出房间，再按 C'); return; }
    if (!window.CATS || !CATS.length) { guideToast('猫还没加载'); return; }
    idx = (idx + 1) % CATS.length;
    var c = CATS[idx];
    for (var i = 0; i < OFF.length; i++) {
      var x = c.x + OFF[i][0], y = c.y + OFF[i][1];
      if (canWalk(x, y) && !blocked(x, y) && lakeSubmerge(x, y) === 0) {
        player.x = x; player.y = y; player.dir = 'down';
        cam.x = x; cam.y = y;
        guideToast('已到「' + ((c.cfg && c.cfg.name) || '猫') + '」旁边 · 按 G 开轮盘');
        return;
      }
    }
    guideToast('「' + ((c.cfg && c.cfg.name) || '猫') + '」那块地站不下人');
  });
})();
</script>
"""

ANCHOR = _ST + '\n"use strict";'


def main():
    html = io.open(SRC, encoding='utf-8').read()
    assert html.count(ANCHOR) == 1, '产物里 %r 不唯一，注入锚点不可靠' % ANCHOR[:20]
    assert html.count('</body>') == 1, '产物里 </body> 不唯一'
    html = html.replace(ANCHOR, INJECT + ANCHOR, 1)
    html = html.replace('</body>', TAIL + '</body>', 1)
    io.open(OUT, 'w', encoding='utf-8', newline='\n').write(html)
    # 回读一遍，确认两段真的进去了（写盘成功 ≠ 内容对）
    back = io.open(OUT, encoding='utf-8').read()
    assert "'p_demo'" in back, '注入自检失败：演示存档没进去'
    assert 'importance:70' in back, '注入自检失败：好感预置没进去'
    assert '已到「' in back, '注入自检失败：C 键瞬移没进去'
    assert back.count(ANCHOR) == 1 and back.count('</body>') == 1, '注入后结构被破坏'
    print('play  %d bytes  <- %s' % (os.path.getsize(OUT), os.path.basename(SRC)))


if __name__ == '__main__':
    sys.exit(main())
