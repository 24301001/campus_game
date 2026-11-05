/* 思源楼特写（1× 档 = 6 号档）+ 探一下"楼前哪里站得住人"。
   思源楼：门中心 x = 2023.9，落地线 y = 1431.6，精灵宽 450。
   楼在 y 更小的一侧（北），人站的地方在 y 更大的一侧（南）。 */
setZoom(6);

var found = [];
for (var y = 1440; y <= 1760; y += 8) {
  if (canWalk(2024, y) && !ptBlocked(2024, y)) found.push(y);
}
window.__diag.push('walkable@2024=[' + (found.join(',') || 'NONE') + ']');

/* 先试探：把每一段可行走的 y 都记下来，取最靠楼的那个当站位 */
var standY = found.length ? found[0] : 1500;
player.x = 2024; player.y = standY; player.dir = 'down';

cam.x = 2024 - viewW / 2;
cam.y = Math.max(0, 1431.6 - viewH * 0.72);
window.__diag.push('standY=' + standY);
