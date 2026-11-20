/* 03 天佑会堂
   照片：米黄小瓷砖墙 + 两侧通高竖窗 + 中央凹进的蓝灰玻璃幕（白竖梃、顶部百叶）
        + 一道横贯整个中段的石面挑台与栏杆 + 首层玻璃幕（底边一条蓝色飘带）
        + 右墙面竖排金字「天佑会堂」。 */
(function () {
  PC_BUILDINGS.push({
    id: "03-tyht",
    name: "天佑会堂",
    note: "3 层 · 米黄瓷砖 / 蓝灰玻璃幕 / 石面挑台 / 竖排金字",
    spec: {
      w: 460, floors: 3, sign: false, seed: 6303,
      wall: "#d8cdb7", roof: "#a79c86", glass: "#7d94a0", texture: "tile",
      draw: function (B) {
        const g = B.g, x0 = B.x0, x1 = B.x1, w = B.w;
        const eaveY = B.eaveY, baseY = B.baseY;
        const C = {
          tile: "#d8cdb7", tileL: "#e5dcc8", tileD: "#bfb49d",
          stone: "#c9c2b3", stoneL: "#ddd7c9", stoneD: "#968f80",
          frame: "#e9e6dd", frameD: "#b9b5ab",
          glass: "#7d94a0", glassD: "#465a64", glassL: "#a3b8c1",
          louver: "#b8bdc0", louverD: "#8d949a",
          wave: "#3f7fc0", waveL: "#71b1e2",
          gold: "#d8b13e"
        };

        /* 1. 米黄瓷砖墙 */
        B.px(x0, eaveY, w, B.wallH, C.tile);
        B.px(x0, eaveY, 3, B.wallH, C.tileL);
        B.px(x1 - 4, eaveY, 4, B.wallH, C.tileD);
        for (let y = eaveY + 3; y < baseY; y += 3)
          B.px(x0, y, w, 1, "rgba(0,0,0,0.05)");
        for (let x = x0 + 5; x < x1; x += 6)
          for (let y = eaveY + 2; y < baseY; y += 3)
            B.px(x, y, 1, 3, "rgba(0,0,0,0.03)");
        B.px(x0, eaveY, w, 2, "#eee7d8");

        /* 2. 两侧通高竖窗 */
        for (let s = 0; s < 2; s++) {
          const sx = s ? x1 - 36 : x0 + 6;
          B.px(sx - 2, eaveY + 12, 34, baseY - eaveY - 24, C.frame);
          B.px(sx, eaveY + 14, 30, baseY - eaveY - 28, C.glassD);
          B.px(sx, eaveY + 14, 30, 3, "rgba(10,13,20,0.50)");
          B.px(sx + 2, eaveY + 16, 26, 10, "rgba(190,210,220,0.20)");
          for (let y = eaveY + 30; y < baseY - 18; y += 16) B.px(sx, y, 30, 1, C.frame);
          B.px(sx + 14, eaveY + 14, 1, baseY - eaveY - 28, C.frameD);
          B.px(sx - 2, baseY - 14, 34, 2, C.stoneD);
        }

        /* 3. 中央上部玻璃幕 */
        const cx0 = x0 + 78, cx1 = x0 + 382;
        const gy0 = eaveY + 18, gy1 = eaveY + 58;
        /* 顶部百叶带 */
        B.px(cx0 - 2, eaveY + 10, cx1 - cx0 + 4, 9, C.louverD);
        for (let y = eaveY + 11; y < eaveY + 18; y += 2)
          B.px(cx0 - 1, y, cx1 - cx0 + 2, 1, C.louver);
        /* 玻璃幕 */
        B.px(cx0 - 1, gy0 - 1, cx1 - cx0 + 2, gy1 - gy0 + 2, C.frameD);
        B.px(cx0, gy0, cx1 - cx0, gy1 - gy0, C.glass);
        B.px(cx0, gy0, cx1 - cx0, 3, C.glassL);
        for (let x = cx0 + 13; x < cx1; x += 13) B.px(x, gy0, 1, gy1 - gy0, C.frame);
        B.px(cx0, gy0 + 18, cx1 - cx0, 1, "rgba(20,30,38,0.45)");
        for (let x = cx0 + 4; x < cx1; x += 26)
          B.px(x, gy0 + 4, 2, 8, "rgba(200,220,228,0.20)");

        /* 4. 挑台：一道横贯中段的石面檐板（下沿压深阴影） */
        const sy = eaveY + 62;
        const bw0 = cx0 - 30, bw1 = cx1 + 10;
        B.px(bw0, sy, bw1 - bw0, 11, C.stone);
        B.px(bw0, sy, bw1 - bw0, 2, C.stoneL);
        B.px(bw0, sy + 11, bw1 - bw0, 2, C.stoneD);
        B.px(bw0 - 4, sy + 13, bw1 - bw0 + 8, 2, "rgba(14,18,28,0.28)");

        /* 5. 首层玻璃幕 */
        const dy0 = sy + 15, dy1 = baseY - 2;
        B.px(cx0 - 2, dy0, cx1 - cx0 + 4, dy1 - dy0, C.frameD);
        B.px(cx0, dy0 + 1, cx1 - cx0, dy1 - dy0 - 2, C.glassD);
        for (let x = cx0 + 14; x < cx1; x += 14) B.px(x, dy0 + 1, 1, dy1 - dy0 - 2, C.frame);
        B.px(cx0, dy0 + Math.round((dy1 - dy0) * 0.52), cx1 - cx0, 2, C.frameD);
        /* 门：下半部一排竖门扇 */
        for (let x = cx0 + 28; x < cx1 - 20; x += 26) {
          B.px(x, baseY - 26, 20, 24, "#2b3b44");
          B.px(x + 17, baseY - 18, 2, 6, "#c9c9c2");
        }
        /* 玻璃底部蓝色飘带（照片里是一条贴着门槛的浅蓝波浪） */
        B.wave(cx0 + 6, cx1 - 6, baseY - 14, 4, 72, C.wave);
        B.wave(cx0 + 6, cx1 - 6, baseY - 16, 3, 72, C.waveL);

        /* 6. 右墙面竖排金字 */
        for (let i = 0; i < 4; i++) {
          const ch = "天佑会堂".charAt(i);
          B.goldText(ch, x1 - 54, eaveY + 14 + i * 21, 18, C.gold);
        }

        /* 7. 墙面细节：左侧一根落水管 */
        B.px(x0 + 54, eaveY + 2, 2, B.wallH - 4, C.stoneD);

        /* 8. 屋面：几块小设备箱（照片顶沿的小方块） */
        for (let k = 0; k < 4; k++)
          B.px(x0 + 70 + k * 110, B.PADT + 12, 14, 8, "#9a9384");
        B.px(x0, B.PADT + 2, w, 2, "#c4bba9");

        /* 9. 外轮廓 */
        B.edges(C.tileL, C.tileD);
      }
    }
  });
})();
