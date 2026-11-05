/* 思源楼全景取景（50% 档 = 5 号档）：整栋楼 + 门前地面。
   顺带探"楼前一整条横线能不能走"——人物 GIF 要在这一条上来回走。 */
setZoom(5);                                  // 50%，视野 960×540 世界像素

var X0 = 2023.9;                             // 思源楼门中心
var rows = [];
[1520, 1555, 1590].forEach(function (y) {
  var ok = [];
  for (var x = 1840; x <= 2210; x += 5)
    if (canWalk(x, y) && !ptBlocked(x, y)) ok.push(x);
  rows.push(y + ':' + (ok.length ? ok[0] + '~' + ok[ok.length - 1] + '(' + ok.length + ')' : 'NONE'));
});
window.__diag.push('rows=[' + rows.join(' ') + ']');

player.x = X0; player.y = 1555; player.dir = 'down';
cam.x = X0 - viewW / 2;
cam.y = 1431.6 - viewH * 0.80;               // 落地线放在视口下 80% 处
try { hudTick(); } catch (e) {}
