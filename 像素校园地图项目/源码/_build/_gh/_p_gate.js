/* 南门取景：玩家出生点就在南门里侧，相机往南压一点把门楼带进来。 */
setZoom(5);
cam.x = Math.max(0, Math.min(WORLD_W - viewW, player.x - viewW / 2));
cam.y = Math.max(0, Math.min(WORLD_H - viewH, player.y - viewH * 0.30));
try { hudTick(); } catch (e) {}
