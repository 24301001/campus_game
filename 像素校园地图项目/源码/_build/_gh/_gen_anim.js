/* 思源楼前：一个人走出个小方阵，四个方向各走一段 —— 展示"四向行走"的操作感。
   ⚠️ 走位有讲究：**只能贴着楼前那条马路**。y1830~2030 那片虽然 canWalk 全 1，
      但往南两格就是草坪/灌木，**树和花是画在角色之后**的 ⇒ 人一往下走就被叶子盖住。
      所以方阵只取 40×40 世界像素，整块落在 y1485~1525 这段路面上。
   ⚠️ 每帧 4 次 `update(1/120)`（而不是 1/60）= 一帧走 6.67 px ⇒ 6 帧一段刚好 40 px。
      步数仍是每帧 4 次，步态循环跟其它 GIF 一致。 */
var CROP = { x: 140, y: 55, w: 200, h: 150 };
var K = 3, COLS = 6, NF = 24;

var sw = CROP.w * K, sh = CROP.h * K;
var strip = document.createElement('canvas');
strip.width = 3600; strip.height = 1800;
var sg = strip.getContext('2d');
sg.imageSmoothingEnabled = false;

/* 1× 档：人 18×30 世界像素，一屏 480×270 世界像素 —— 人物够大，背景还认得出是思源楼 */
setZoom(6);
var CX = 1910, CY = 1505;                  // 方阵中心
var DIRS = ['d', 's', 'a', 'w'];           // 右 → 下 → 左 → 上
var per = Math.floor(NF / 4);

player.x = 1890; player.y = 1485; player.dir = 'right';
for (var i = 0; i < NF; i++) {
  for (var kk in keys) keys[kk] = 0;
  keys[DIRS[Math.min(Math.floor(i / per), 3)]] = 1;
  for (var sub = 0; sub < 4; sub++) update(1 / 120);
  cam.x = CX - viewW / 2;                  // update() 会覆写 cam，必须摁回来
  cam.y = CY - viewH / 2;
  render();
  sg.drawImage(cv, CROP.x, CROP.y, CROP.w, CROP.h,
               (i % COLS) * sw, Math.floor(i / COLS) * sh, sw, sh);
}
window.__diag.push('p=' + (player.x | 0) + ',' + (player.y | 0) + ' dir=' + player.dir);
document.body.style.margin = '0';
document.body.innerHTML = '';
document.body.appendChild(strip);
