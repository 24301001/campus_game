/* 1× 特写：思源楼门厅 + 国旗 + 人物（人在这一档是 18×30 世界像素，看得清四向行走）。 */
setZoom(6);

player.x = 2024; player.y = 1505; player.dir = 'down';

cam.x = 2024 - viewW / 2;
cam.y = 1505 - viewH * 0.62;
try { hudTick(); } catch (e) {}
