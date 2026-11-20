/* 09 研究中心
   照片：三层红砖楼 + 浅色石材檐口与窗套 + 两侧顶层圆窗、二层双连拱窗、首层窄窗
        + 中央一整条砖砌塔楼（顶部三连拱敞廊、中部双拱阳台、底部拱门与圆徽）
        + 塔身正中一块「研究中心」白牌。 */
(function () {
  PC_BUILDINGS.push({
    id: "09-yanjiu",
    name: "研究中心",
    note: "3 层 · 红砖 / 连拱窗 / 中央塔楼 / 圆徽",
    spec: {
      w: 440, floors: 3, sign: false, seed: 6909,
      wall: "#963c34", roof: "#a2988a", glass: "#5b6d75", texture: "brick",
      draw: function (B) {
        const g = B.g, x0 = B.x0, x1 = B.x1, w = B.w;
        const eaveY = B.eaveY, baseY = B.baseY, PADT = B.PADT;
        const CX = x0 + Math.round(w / 2);
        const C = {
          brick: "#963c34", brickL: "#ad4f45", brickD: "#6f2822",
          stone: "#e0d6c8", stoneL: "#f1e9dc", stoneD: "#b3a898", stoneDD: "#8f8574",
          glass: "#5b6d75", glassD: "#394954", glassL: "#8ea3ab",
          frame: "#efe9dc", door: "#2a2522"
        };

        /* 1. 红砖墙 + 檐口石带 */
        B.px(x0, eaveY, w, B.wallH, C.brick);
        B.px(x0, eaveY, 3, B.wallH, C.brickL);
        B.px(x1 - 4, eaveY, 4, B.wallH, C.brickD);
        B.px(x0 - 2, eaveY - 2, w + 4, 6, C.stone);
        B.px(x0 - 2, eaveY - 2, w + 4, 2, C.stoneL);
        B.px(x0 - 2, eaveY + 4, w + 4, 2, "rgba(14,18,28,0.28)");
        /* 楼板线 */
        B.px(x0, eaveY + 40, w, 1, "rgba(30,10,8,0.30)");
        B.px(x0, eaveY + 76, w, 1, "rgba(30,10,8,0.30)");

        /* 2. 两翼：顶层圆窗 / 中层双连拱 / 首层窄窗 */
        for (let i = 0; i < 4; i++) {
          const cx = i < 2 ? x0 + 40 + i * 74 : x1 - 40 - (i - 2) * 74;
          /* 顶层圆窗 */
          B.roundWin(cx, eaveY + 22, 12, 12, C.stone, C.glassD);
          B.px(cx - 14, eaveY + 34, 28, 2, C.stoneD);
          /* 中层双连拱窗 */
          const ax = cx - 26, ay = eaveY + 44;
          B.archBand(ax + 26, ay + 32, 27, 20, 4, C.stone);
          B.arch(ax + 26, ay + 32, 23, 17, C.glassD);
          B.px(ax + 4, ay + 20, 44, 3, C.glass);
          B.px(ax + 24, ay + 15, 4, 17, C.frame);              // 中柱
          B.px(ax + 8, ay + 18, 2, 14, C.frame);               // 两侧细柱
          B.px(ax + 42, ay + 18, 2, 14, C.frame);
          B.px(ax - 2, ay + 32, 56, 3, C.stone);               // 窗台
          B.px(ax - 2, ay + 35, 56, 2, C.stoneD);
          /* 首层窄窗（一对） */
          for (let k = 0; k < 2; k++) {
            const wx = cx - 20 + k * 24;
            B.px(wx - 1, eaveY + 82, 18, 22, C.stoneD);
            B.px(wx, eaveY + 83, 16, 20, C.glassD);
            B.px(wx, eaveY + 83, 16, 3, C.glass);
            B.px(wx + 7, eaveY + 83, 1, 20, C.frame);
            B.px(wx - 2, eaveY + 80, 20, 2, C.stone);
          }
        }

        /* 3. 中央塔楼（从屋面以上一直落到地面） */
        const tw = 132, tx0 = CX - tw / 2, tx1 = CX + tw / 2;
        const ttop = PADT + 6;
        B.px(tx0, ttop, tw, baseY - ttop, C.brick);
        B.px(tx0, ttop, 4, baseY - ttop, C.brickL);
        B.px(tx1 - 5, ttop, 5, baseY - ttop, C.brickD);
        B.px(tx0 - 2, ttop, 2, baseY - ttop, C.stoneD);
        B.px(tx1, ttop, 2, baseY - ttop, C.stoneD);
        B.px(tx0, ttop, tw, 2, C.stoneL);                        // 塔顶压顶
        B.px(tx0 - 3, ttop, tw + 6, 3, C.stone);

        /* 3a. 顶部三连拱敞廊 */
        const ly = ttop + 12, lh = 34;
        B.px(tx0 + 8, ly, tw - 16, lh + 6, C.stone);
        B.px(tx0 + 8, ly, tw - 16, 2, C.stoneL);
        for (let k = 0; k < 3; k++) {
          const ax = tx0 + 22 + k * 30;
          B.arch(ax, ly + lh, 12, 22, C.glassD);
          B.px(ax - 12, ly + lh - 4, 24, 4, C.glassD);
        }
        for (let k = 0; k < 4; k++) {
          const cx = tx0 + 10 + k * 30;
          B.px(cx - 2, ly + 12, 5, lh - 12, C.frame);
          B.px(cx - 2, ly + 12, 1, lh - 12, "#ffffff");
          B.px(cx + 2, ly + 12, 1, lh - 12, C.stoneD);
        }
        B.px(tx0 + 6, ly + lh + 4, tw - 12, 4, C.stoneL);        // 敞廊底座
        B.px(tx0 + 6, ly + lh + 8, tw - 12, 2, "rgba(14,18,28,0.28)");

        /* 3b. 中部双拱阳台 */
        const my = eaveY + 30, mBase = eaveY + 72;
        B.archBand(CX, mBase, 48, 36, 7, C.stone);
        B.arch(CX, mBase, 41, 30, C.glassD);
        B.px(CX - 48, mBase - 36, 96, 4, C.stoneL);
        B.px(CX - 3, mBase - 26, 6, 26, C.frame);                // 中柱
        for (let k = 0; k < 2; k++) {
          const ax = CX - 24 + k * 48;
          B.archBand(ax, mBase - 2, 17, 15, 3, C.stoneL);
          B.arch(ax, mBase - 2, 14, 12, C.glassD);
          B.px(ax - 14, mBase - 14, 28, 2, C.glass);
        }
        B.px(CX - 52, mBase, 104, 4, C.stone);                   // 阳台板
        B.px(CX - 52, mBase + 4, 104, 2, "rgba(14,18,28,0.30)");
        /* 阳台上的圆雕饰 */
        B.roundWin(CX, my + 2, 9, 9, C.stoneL, C.stoneD);

        /* 3c. 「研究中心」白牌 */
        B.signPlate("研究中心", CX, mBase + 8, 14, {
          bg: "#efe7d2", bgL: "#fbf5e4", bgD: "#b5a98c", col: "#3a2f22", padX: 8, padY: 3
        });

        /* 3d. 底部拱门 + 圆徽 */
        const ey = baseY - 2;
        B.archBand(CX, ey, 42, 30, 7, C.stone);
        B.arch(CX, ey, 35, 25, C.door);
        B.px(CX - 35, baseY - 26, 70, 24, C.door);
        B.px(CX, baseY - 26, 1, 24, "#4c443a");
        B.px(CX - 16, baseY - 18, 2, 8, "#8b7d63");
        B.px(CX + 14, baseY - 18, 2, 8, "#8b7d63");
        B.roundWin(CX, baseY - 36, 8, 8, C.stoneL, C.stoneD);
        B.px(CX - 3, baseY - 37, 6, 1, "#f7f0dd");

        /* 4. 塔的墙面小竖缝 */
        for (let x = tx0 + 12; x < tx1 - 8; x += 14)
          B.px(x, my + 12, 1, baseY - my - 16, "rgba(30,10,8,0.10)");

        /* 5. 外轮廓 */
        B.px(x0 - 1, eaveY - 2, 1, B.wallH + 2, C.stoneDD);
        B.px(x1, eaveY - 2, 1, B.wallH + 2, C.brickD);
      },
      after: function (B) {
        B.steps(B.x0 + Math.round(B.w / 2), B.baseY + 1, 96, 3, "#b9b0a0");
      }
    }
  });
})();
