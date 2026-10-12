/* 全校园鸟瞰（FIT 档 = 0 号档）。给 README 当"全景"图，也是给思源楼取景的参照。
   ⚠️ 此档覆盖整个世界（5208×2929 世界像素），所以：
     ① `_ghshot.py` 那句「按 VIEW_W×K 撑开」是按 480 宽算的 ⇒ 会把全图压成一条，
        这里按 viewW/viewH 重设 CSS 尺寸；
     ② 世界大于 1736 px 就没意义了，直接缩到 1/3 出图（README 用图，不必 1:1）；
     ③ HUD 是 DOM、会盖在画布上，当壁纸图先把它全隐掉。 */
setZoom(0);
cam.x = 0; cam.y = 0;
var c2 = document.getElementById('cv');
var K = 1 / 3;
c2.style.width = Math.round(viewW * K) + 'px';
c2.style.height = Math.round(viewH * K) + 'px';
for (var i = 0; i < document.body.children.length; i++) {
  var el = document.body.children[i];
  if (el === c2 || el.contains(c2)) continue;   // 画布本身和它的祖先留着
  el.style.display = 'none';
}
window.__diag.push('canvas=' + viewW + 'x' + viewH + ' css=' + c2.style.width);
