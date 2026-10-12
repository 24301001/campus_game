/* 全校园飞越：南门 → 思源楼 → 图书馆，每站停一下、站间缓入缓出地平移。
   每次 `update()` 照常推进（旗子 / 水波 / 鱼 / 向导都在动），只是相机不给它跟人。 */
var CROP = { x: @{CROPX}, y: @{CROPY}, w: @{CROPW}, h: @{CROPH} };
var K = @{K}, COLS = @{COLS}, NF = @{NF};

var sw = CROP.w * K, sh = CROP.h * K;
var strip = document.createElement('canvas');
strip.width = @{GW}; strip.height = @{GH};
var sg = strip.getContext('2d');
sg.imageSmoothingEnabled = false;

setZoom(5);
/* 把角色摆到思源楼前那条马路（实测 x1830~2030 / y1450~1630 全可走），
   这样平移经过中段时画面里有人，不至于空镜。 */
player.x = 1920; player.y = 1505; player.dir = 'down';
/* 三站的相机位（世界坐标）。⚠️ 相机 x/y 的上界是 WORLD - 视口，别越界。 */
function clampc(x, y) {
  return { x: Math.max(0, Math.min(WORLD_W - viewW, x)),
           y: Math.max(0, Math.min(WORLD_H - viewH, y)) };
}
/* ⚠️ 首站别用南门（世界 y≈2490 紧贴校园南界，相机一压下去半屏是校外地块）。
   选这三站：都在校园中部、一屏吃得下、自西向东一条线。 */
var P0 = clampc(1446.0 - viewW / 2, 2043.5 - viewH * 0.80);          // 天佑会堂
var P1 = clampc(2023.9 - viewW / 2, 1431.6 - viewH * 0.80);          // 思源楼
var P2 = clampc(3254.0 - viewW / 2, 1431.6 - viewH * 0.80);          // 图书馆
var STOPS = [P0, P1, P2];
var DWELL = 6, MOVE = 8;

/* 段表：停-移-停-移-停 … 展开成一串"这一帧的相机位" */
var frames = [];
for (var s = 0; s < STOPS.length; s++) {
  for (var d = 0; d < DWELL; d++) frames.push([s, s, 0]);
  if (s + 1 < STOPS.length) {
    for (var m = 1; m <= MOVE; m++) {
      var t = m / (MOVE + 1);
      frames.push([s, s + 1, t * t * (3 - 2 * t)]);                   // smoothstep
    }
  }
}
window.__diag.push('frames=' + frames.length + ' need=' + NF);
frames = frames.slice(0, NF);

for (var i = 0; i < NF; i++) {
  for (var sub = 0; sub < 4; sub++) update(1 / 60);
  var f = frames[Math.min(i, frames.length - 1)];
  var a = STOPS[f[0]], b = STOPS[f[1]], t = f[2];
  cam.x = a.x + (b.x - a.x) * t;
  cam.y = a.y + (b.y - a.y) * t;
  render();
  sg.drawImage(cv, CROP.x, CROP.y, CROP.w, CROP.h,
               (i % COLS) * sw, Math.floor(i / COLS) * sh, sw, sh);
}
window.__diag.push('cam=' + (cam.x | 0) + ',' + (cam.y | 0));
document.body.style.margin = '0';
document.body.innerHTML = '';
document.body.appendChild(strip);
