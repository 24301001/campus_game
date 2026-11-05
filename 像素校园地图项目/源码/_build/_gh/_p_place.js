/* 按**地标名**取景，名字从 URL 的 #片段 传进来（中文要 encodeURIComponent）。
   坐标不写死：直接查页面自己的 `_landmarks`（它就是 HUD「最近地标」那张表，
   由 CAMPUS 的 PPT 矩形推出来），这样改了布局也不会对不上。
   顺带在楼附近找一个**站得住人**的点，把玩家摆上去当比例尺。 */
var want = decodeURIComponent((location.hash || '').replace(/^#/, '')) || '图书馆';
var L = null;
for (var i = 0; i < _landmarks.length; i++) if (_landmarks[i].n === want) L = _landmarks[i];
if (!L) { window.__diag.push('NO-LANDMARK:' + want); } else {
  setZoom(5);                                   // 50%：一屏看得下整栋楼和它周围
  cam.x = Math.max(0, Math.min(WORLD_W - viewW, L.x - viewW / 2));
  cam.y = Math.max(0, Math.min(WORLD_H - viewH, L.y - viewH * 0.80));

  var best = null;
  for (var d = 60; d <= 420 && !best; d += 20) {
    var cand = [[L.x, L.y + d], [L.x - d, L.y + d], [L.x + d, L.y + d], [L.x, L.y + d + 60]];
    for (var c = 0; c < cand.length; c++)
      if (canWalk(cand[c][0], cand[c][1]) && !ptBlocked(cand[c][0], cand[c][1])) { best = cand[c]; break; }
  }
  if (best) { player.x = best[0]; player.y = best[1]; player.dir = 'down'; }
  window.__diag.push(want + '@' + L.x + ',' + L.y + ' stand=' + (best ? best.join(',') : 'none'));
  try { hudTick(); } catch (e) {}
}

/* README 要的是"干净的风景照"：HUD（帮助面板 / 缩放条 / 小地图）是 DOM，会糊在画布上，
   这里把**除画布及其祖先以外**的 body 子节点全隐掉。坐标读数已经写进 __diag 了，
   要看"真机界面"另拍一张带 HUD 的即可。 */
var c2 = document.getElementById('cv');
for (var bi = 0; bi < document.body.children.length; bi++) {
  var el2 = document.body.children[bi];
  if (el2 === c2 || el2.contains(c2)) continue;
  el2.style.display = 'none';
}
