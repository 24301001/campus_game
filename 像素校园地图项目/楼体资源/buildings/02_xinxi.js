/* 02 信息中心
   照片：浅灰白小瓷砖上段 + 二层整条横向窗带（白框、拉着帘）
        + 一条深灰雨篷底 + 首层红砖墙（防盗窗） + 中央深色玻璃门厅（橙色腰线）
        + 右上方金色「信息中心」 + 门前浅灰石材铺地。 */
(function () {
  PC_BUILDINGS.push({
    id: "02-xinxi",
    name: "信息中心",
    note: "4 层 · 灰白瓷砖 / 横向窗带 / 红砖首层 / 玻璃门厅",
    spec: {
      w: 380, floors: 4, sign: false, seed: 6202,
      wall: "#cfc7bb", roof: "#a9a196", glass: "#a9c2cc", texture: "tile",
      draw: function (B) {
        const g = B.g, x0 = B.x0, x1 = B.x1, w = B.w;
        const eaveY = B.eaveY, baseY = B.baseY;
        const C = {
          tile: "#d7d0c5", tileL: "#e6e0d6", tileD: "#bdb5a8",
          frame: "#e6e3da", glass: "#a9c2cc", glassD: "#7d97a2",
          soffit: "#6e6a63", soffitD: "#4e4b45", lamp: "#e8dcb4",
          brick: "#8f4436", brickL: "#a45443", brickD: "#743328",
          steel: "#d2d2cc", steelD: "#9c9c96",
          door: "#31393c", doorL: "#586569",
          orange: "#d96a1f", gold: "#d8b13e", goldL: "#f0d878"
        };

        /* 1. 上段灰白瓷砖墙（底子已是 tile 纹，这里只补受光/背光） */
        B.px(x0, eaveY, w, 86, C.tile);
        B.px(x0, eaveY, 3, 86, C.tileL);
        B.px(x1 - 4, eaveY, 4, 86, C.tileD);
        for (let y = eaveY + 3; y < eaveY + 86; y += 3)
          B.px(x0, y, w, 1, "rgba(0,0,0,0.055)");
        for (let x = x0 + 6; x < x1 - 4; x += 6)
          for (let y = eaveY + 2; y < eaveY + 86; y += 3)
            B.px(x, y, 1, 3, "rgba(0,0,0,0.035)");
        B.px(x0, eaveY, w, 2, "#efeae0");                 // 檐口亮线
        B.px(x0, eaveY + 84, w, 2, C.tileD);

        /* 2. 右上方金色楼名 */
        B.goldText("信息中心", x1 - 58, eaveY + 8, 16, C.gold);

        /* 3. 二层整条横向窗带 */
        const by = eaveY + 48, bh = 28;
        B.band(x0 + 4, by, w - 8, bh, {
          frame: C.frame, glass: C.glass, step: 15, transom: false, sill: false
        });
        /* 帘影：照片里每扇窗都垂着浅色帘子 */
        for (let x = x0 + 7; x < x1 - 7; x += 15) {
          B.px(x + 1, by + 1, 12, 2, "rgba(255,255,255,0.30)");
          for (let xx = x + 3; xx < x + 12; xx += 4)
            B.px(xx, by + 2, 1, bh - 4, "rgba(255,255,255,0.20)");
        }
        B.px(x0 + 2, by + bh, w - 4, 3, "#c9c3b6");
        B.px(x0 + 2, by + bh + 3, w - 4, 1, "rgba(14,18,28,0.26)");

        /* 4. 雨篷底（深灰一条，带五盏筒灯） */
        const sy = eaveY + 83, sh = 10;
        B.px(x0 - 2, sy, w + 4, sh, C.soffit);
        B.px(x0 - 2, sy, w + 4, 2, C.soffitD);
        B.px(x0 - 2, sy + sh - 1, w + 4, 1, "rgba(14,18,28,0.34)");
        for (let k = 0; k < 5; k++)
          B.px(x0 + 40 + k * 74, sy + 3, 4, 2, C.lamp);

        /* 5. 首层红砖墙 */
        const ry = sy + sh;
        B.brickPatch(x0, ry, w, baseY - ry, C.brick);
        B.px(x0, ry, w, 1, C.brickL);

        /* 6. 首层防盗窗（左右各两扇） */
        const wy = baseY - 38, wh = 30, ww = 32;
        const gx = [x0 + 18, x0 + 64, x1 - 100, x1 - 54];
        for (let k = 0; k < gx.length; k++) {
          const x = gx[k];
          B.px(x - 2, wy - 2, ww + 4, wh + 4, C.steel);
          B.px(x, wy, ww, wh, C.glassD);
          B.px(x, wy, ww, 2, "rgba(10,13,20,0.50)");
          B.px(x + 2, wy + 2, ww - 4, 5, "rgba(200,220,224,0.30)");
          for (let xx = x + 4; xx < x + ww; xx += 4) B.px(xx, wy, 1, wh, C.steel);   // 竖栅
          for (let yy = wy + 8; yy < wy + wh; yy += 8) B.px(x, yy, ww, 1, C.steelD); // 横栅
          B.px(x - 2, wy + wh, ww + 4, 2, C.steelD);
        }

        /* 7. 中央门厅：深色玻璃 + 橙色腰线 + 两侧铜牌 */
        const dx0 = x0 + 148, dx1 = x0 + 226, dy0 = baseY - 50;
        B.px(dx0 - 3, dy0 - 3, dx1 - dx0 + 6, 53, "#3d3d3a");
        B.px(dx0, dy0, dx1 - dx0, 48, C.door);
        for (let x = dx0 + 12; x < dx1; x += 13) B.px(x, dy0, 1, 48, C.doorL);
        B.px(dx0, dy0, dx1 - dx0, 2, "rgba(10,13,20,0.55)");
        B.px(dx0 + 2, dy0 + 3, dx1 - dx0 - 4, 8, "rgba(150,190,205,0.16)");
        B.px(dx0 - 1, baseY - 27, dx1 - dx0 + 2, 4, C.orange);          // 橙色腰线
        B.px(dx0 - 1, baseY - 27, dx1 - dx0 + 2, 1, "#ef8a3e");
        B.px(dx0 + 30, baseY - 20, 2, 10, "#9aa5a6");                    // 门把手
        /* 铜牌 */
        B.px(x0 + 127, baseY - 42, 14, 8, "#a8873a");
        B.px(x0 + 128, baseY - 41, 12, 6, "#c8a94e");
        B.px(x0 + 127, baseY - 31, 14, 8, "#a8873a");
        B.px(x0 + 128, baseY - 30, 12, 6, "#c8a94e");
        B.px(dx1 + 8, baseY - 40, 15, 9, "#a8873a");
        B.px(dx1 + 9, baseY - 39, 13, 7, "#c8a94e");

        /* 8. 墙面雨水管 */
        B.px(x1 - 14, eaveY + 2, 2, B.wallH - 4, C.steelD);

        /* 10. 外轮廓 */
        B.edges("#e2dbcf", "#a49b8d");
      },
      after: function (B) {
        /* 门前浅灰石材铺地：两排石板 + 一道深色路缘 */
        const y = B.baseY + 1, w = B.w, x0 = B.x0;
        B.px(x0 - 6, y, w + 12, 12, "#b9b4a9");
        B.px(x0 - 6, y, w + 12, 2, "#cbc6bb");
        for (let x = x0 - 6; x < x0 + w + 6; x += 26)
          B.px(x, y + 2, 1, 10, "rgba(60,56,48,0.16)");
        B.px(x0 - 6, y + 6, w + 12, 1, "rgba(60,56,48,0.12)");
        B.px(x0 - 6, y + 12, w + 12, 2, "#8f8a80");
      }
    }
  });
})();
