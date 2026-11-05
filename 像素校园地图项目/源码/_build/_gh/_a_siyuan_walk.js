/* 思源楼前：像素人物来回走动。
   站位是实测的：y = 1505 这一整条从 x1840 到 x2210 全部 canWalk 且不撞道具，
   正好是楼前那条马路（楼体落地线 1431.6，国旗旗杆 ≈1469，树行 ≈1531）。
   50% 档下整栋思源楼（含顶部红字）刚好一屏吃得下。 */
var CROP = { x: @{CROPX}, y: @{CROPY}, w: @{CROPW}, h: @{CROPH} };
var K = @{K}, COLS = @{COLS}, NF = @{NF};

var sw = CROP.w * K, sh = CROP.h * K;
var strip = document.createElement('canvas');
strip.width = @{GW}; strip.height = @{GH};
var sg = strip.getContext('2d');
sg.imageSmoothingEnabled = false;
window.__diag.push('cv=' + cv.width + 'x' + cv.height);

/* ⚠️ 走道必须**留在旗杆西侧**（旗杆 ≈ x2024、旗面还往东铺开）：
   实测那一带旗子是**画在角色之前**的，人一走进 x≳2010 就被旗面盖住。
   所以只走 1840→2000（12 帧 × 13.3 世界像素 = 160），收尾正好差 24 px 不碰旗杆。 */
player.x = 1840; player.y = 1505; player.dir = 'right';
var half = Math.floor(NF / 2);
for (var i = 0; i < NF; i++) {
  for (var kk in keys) keys[kk] = 0;
  keys[i < half ? 'd' : 'a'] = 1;                 // 前半程往右、后半程往左（回到原点 ⇒ 无缝循环）
  for (var sub = 0; sub < 4; sub++) update(1 / 60);   // 4×(1/60) = 一帧 66.7ms ⇒ 15fps
  /* ⚠️ update() 每帧都把 cam 拉成"跟人走"（见它末尾两行），想固定机位必须摁回去 */
  cam.x = 2023.9 - viewW / 2;
  cam.y = 1005;
  render();
  sg.drawImage(cv, CROP.x, CROP.y, CROP.w, CROP.h,
               (i % COLS) * sw, Math.floor(i / COLS) * sh, sw, sh);
}
window.__diag.push('p=' + (player.x | 0) + ',' + (player.y | 0) + ' step=' + player.step);
document.body.style.margin = '0';
document.body.innerHTML = '';
document.body.appendChild(strip);
