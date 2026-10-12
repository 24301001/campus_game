# -*- coding: utf-8 -*-
"""猫宠 —— **喂食那一帧的自证截图**（一次性，验完删）。

为什么还要拍这一张：`_catwheel.py logic` 的 C 组已经把数读出来了
（`粮@3303,361 猫到粮=4.5 朝向=right 到达=true 同步=true`），但我**盯图盯错过一次**
（把朝右的猫看成朝左）。肉眼判读既然出过一次假警，就不该再当第二道裁判。

所以这一张不靠眼睛"看形状"，而是**把判据画进图里**：

  · **绿竖线 + 绿横线** = 猫粮的锚点（`CAT_FOOD.x / .y`，世界坐标）
  · **红竖线** = 猫的锚点 x（`c.x`，世界坐标）

判据一眼可读：**猫的脸（耳朵→鼻尖那一簇像素）应当正好压在绿竖线上，
且鼻尖落在绿横线上**；红竖线应当落在猫的**后腰**（锚点在脊椎中段，脸在它右边 4px）。
两条线的位置是**算出来的、不是眼估的** —— 图里线在哪、脸在哪，谁都赖不掉。

用法:
  python _build/_cateat.py            # 出 _look/eat_zoom.png
"""
import os, re, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import _catwheel as CW          # 复用它的 fixture（seed / placeNear / steps / _wheelRun）

BODY = CW.LIB + r"""
/* 用大橘、陌生档（0）—— 陌生猫也会走过来吃（§7.5.4 收口表：喂食任何档位都肯过来），
   顺便把"逃跑半径 120 = 喂食半径 120"那个老 bug 一起验了。 */
seed('cat_daju', 0);
var c = byId('cat_daju');
placeNear(c, 90, true, 24); steps(3);
window._wheelRun('feed');
update(0.2); update(0.2);                  // 蹲下取帧 1（手伸出去）
setTimeout(function(){
  if (CAT_FOOD) CAT_FOOD.until = 1e18;     // 把粮的到期时间顶到无穷，专心验姿势
  steps(50);                               // 猫走到粮跟前、低头开吃
  /* ⚠️⚠️ **两个 until 都要顶**，只顶粮的那个会出这种假现场：
         `comeTo.until` 到期 ⇒ 猫退出「吃」、落回陌生档 ⇒ **扭头往左就跑**，
         而 `--virtual-time-budget` 会把时间快进，截图抓的是之后好几秒那一帧 ——
         拍出来是"猫背对着粮"，看着像朝向 bug，其实是**截图时机**的 bug（第一版就栽在这儿，
         量出来眼睛在锚点左边 4.58px、与 dir=right 矛盾，才顺出来的）。 */
  if (CAT_FOOD) CAT_FOOD.until = 1e18;     // 到位那一帧会被改写成 now+CAT_EAT_MS，再顶一次
  if (c.comeTo) c.comeTo.until = 1e18;
  update(0.2);
  if (c.comeTo) c.comeTo.until = 1e18;
  setZoom(8);                              // 3×（ZOOM_STEPS[8]）
  cam.x = Math.max(0, Math.min(c.x - viewW / 2,     Math.max(0, WORLD_W - viewW)));
  cam.y = Math.max(0, Math.min(c.y - viewH * 0.55,  Math.max(0, WORLD_H - viewH)));
  render();
  /* --- 把判据画进画布（背板坐标，随 CSS 整数倍一起放大） ---
     ⚠️ **必须挂在 `render` 上、不能在 `render()` 之后补两笔** ——
        主循环 `loop()` 每帧都 `render()`，而它开头就 `clearRect`，
        补的那两笔下一帧（十几毫秒后）就被冲掉了，截图上什么都没有（第一版就栽在这儿）。 */
  var g = document.getElementById('cv').getContext('2d');
  function vline(wx, col){
    g.fillStyle = col;
    g.fillRect(Math.round((wx - Math.round(cam.x)) * zoom), 0, 1, VIEW_H);
  }
  function hline(wy, col){
    g.fillStyle = col;
    g.fillRect(0, Math.round((wy - Math.round(cam.y)) * zoom), VIEW_W, 1);
  }
  var _r0 = render;
  render = function(){
    _r0();
    if (CAT_FOOD) { vline(CAT_FOOD.x, '#25ff6a'); hline(CAT_FOOD.y, '#25ff6a'); }
    vline(c.x, '#ff2d2d');
  };
  render();
  /* ★ **把主循环停掉**：截图是 Chrome 在 `--virtual-time-budget` 用完之后才落盘的，
     循环多跑一帧，画面就不是刚才那一帧了。停在这里，截到的才是"猫正低头吃"。
     （`loop()` 每次都用 `requestAnimationFrame` 重新排下一帧 —— 把它换成空函数即可。） */
  window.requestAnimationFrame = function () { return 0; };
  document.title = 'CE|food=' + (CAT_FOOD ? 1 : 0) + '|act=' + c.act + '|dir=' + c.dir
    + '|C=' + Math.round(c.x) + ',' + Math.round(c.y)
    + '|F=' + (CAT_FOOD ? Math.round(CAT_FOOD.x) + ',' + Math.round(CAT_FOOD.y) : '-')
    + '|d=' + (CAT_FOOD ? Math.hypot(CAT_FOOD.x - c.x, CAT_FOOD.y - c.y).toFixed(1) : '-')
    + '|zoom=' + zoom + '|cam=' + Math.round(cam.x) + ',' + Math.round(cam.y)
    + '|catScr=' + Math.round((c.x - Math.round(cam.x)) * zoom)
    + '|foodScr=' + (CAT_FOOD ? Math.round((CAT_FOOD.x - Math.round(cam.x)) * zoom) : '-')
    + '|' + (window.__diag.join('|') || 'clean');
}, 450);
"""


def main():
    tmp = os.path.join(CW.HERE, '_cateat_gen.html')
    open(tmp, 'w', encoding='utf-8', newline='\n').write(CW.build(BODY))
    out = os.path.abspath(CW.LOOK + 'eat_zoom.png')
    CW.chrome(['--screenshot=' + out, '--window-size=1400,900'], tmp)
    p = CW.chrome(['--dump-dom', '--window-size=1400,900'], tmp)
    print('eat_zoom.png  %s' % (os.path.getsize(out) if os.path.exists(out) else 'MISSING'))
    print(CW.title_of(p.stdout).replace('|', '\n  '))


if __name__ == '__main__':
    main()
