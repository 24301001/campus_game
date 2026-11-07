/* 01 建筑与艺术学院
   照片：暖粉色涂料墙 + 三排深灰方框窗 + 首层深色玻璃幕（左侧银色帘影）
        + 锈红色耐候钢竖板门斗 + 深灰玻璃雨篷 + 门前一块耐候钢金字招牌。
   楼名不挂屋面：照片里名字在门前那块锈钢石板上。 */
(function () {
  PC_BUILDINGS.push({
    id: "01-jianyi",
    name: "建筑与艺术学院",
    note: "4 层 · 暖粉涂料墙 / 深灰方窗 / 锈钢门斗 / 玻璃幕",
    spec: {
      w: 420, floors: 4, sign: false, seed: 6101, roofT: 84,
      wall: "#d9bdaa", roof: "#b9a795", glass: "#839fa3", texture: "none",
      draw: function (B) {
        const g = B.g, x0 = B.x0, x1 = B.x1, w = B.w;
        const eaveY = B.eaveY, baseY = B.baseY, FH = PC.FLOOR_H;
        const C = {
          wall: "#d9bdaa", wallL: "#e8d2c0", wallD: "#c0a28e",
          seam: "rgba(90,58,44,0.10)",
          ledge: "#e6d3c2", ledgeD: "#b39a86",
          frame: "#3c3b38", frameL: "#5d5b56", glass: "#839fa3", glassD: "#4d666b",
          curtain: "#c9c8c2",
          lobby: "#2f3a3d", lobbyL: "#55696c",
          corten: "#8a4a33", cortenL: "#a65f42", cortenD: "#60331f",
          metal: "#4a4a46", metalL: "#6e6d67", metalD: "#2e2e2b",
          gold: "#d8b877"
        };
        const floorTop = f => eaveY + (B.floors - 1 - f) * FH;

        /* 1. 墙面：暖粉平涂 + 板缝 + 每层一道浅色窗台线 */
        B.px(x0, eaveY, w, B.wallH, C.wall);
        for (let x = x0 + 84; x < x1 - 6; x += 84)
          B.px(x, eaveY + 2, 1, B.wallH - 4, C.seam);
        for (let f = 1; f < B.floors; f++) {
          const y = floorTop(f - 1);                 // 该层楼板线
          B.px(x0, y - 2, w, 1, C.ledge);
          B.px(x0, y - 1, w, 1, C.ledgeD);
        }
        B.px(x0, eaveY, w, 2, "#e9d6c5");             // 檐口浅石线

        /* 2. 三排深灰方框窗（5 列） */
        const cols = 5, winW = 46, winH = 26;
        const wstep = Math.round((w - 52 - winW) / (cols - 1));
        const winX = [];
        for (let k = 0; k < cols; k++) winX.push(x0 + 26 + k * wstep);
        for (let f = 1; f < B.floors; f++) {
          const wy = floorTop(f) + 4;
          for (let k = 0; k < cols; k++) {
            B.win(winX[k], wy, winW, winH, {
              frame: C.frame, glass: C.glass, mullions: 1, sill: false
            });
            B.px(winX[k] - 1, wy - 1, winW + 2, 2, C.frameL);   // 上框受光
            B.px(winX[k] - 2, wy + winH, winW + 4, 2, C.ledge);  // 深窗台
            B.px(winX[k] - 2, wy + winH + 2, winW + 4, 1, "rgba(60,40,30,0.28)");
          }
        }

        /* 3. 首层左侧：整片深色玻璃幕（照片里室内银色帘子透出来） */
        const gTop = baseY - 32, gBot = baseY - 2;
        B.px(x0 + 4, gTop - 2, 230, gBot - gTop + 4, C.frame);
        B.px(x0 + 6, gTop, 226, gBot - gTop + 1, C.lobby);
        B.curtain(x0 + 12, gTop + 3, 200, gBot - gTop - 5, "rgba(150,160,158,0.30)");
        for (let x = x0 + 18; x < x0 + 230; x += 18)
          B.px(x, gTop, 1, gBot - gTop + 1, C.lobbyL);
        B.px(x0 + 6, gTop, 226, 3, C.lobbyL);
        B.px(x0 + 6, gBot - 1, 226, 2, C.frame);

        /* 4. 锈红耐候钢门斗：从地面一直长到三层窗下的窗间墙里 */
        const px0 = x0 + 238, px1 = x0 + 266;
        const pTop = floorTop(1) + 22;
        B.px(px0, pTop, px1 - px0, baseY - pTop, C.corten);
        B.px(px0, pTop, 3, baseY - pTop, C.cortenL);
        B.px(px1 - 4, pTop, 4, baseY - pTop, C.cortenD);
        for (let x = px0 + 8; x < px1 - 5; x += 9)
          B.px(x, pTop + 4, 1, baseY - pTop - 6, "rgba(60,30,18,0.26)");
        B.px(px0, pTop, px1 - px0, 2, "#b06a4a");
        B.px(px0 - 1, pTop, 1, baseY - pTop, "#5a2f1d");
        B.px(px1, pTop, 1, baseY - pTop, "#5a2f1d");

        /* 5. 深灰雨篷：从门斗右侧挑出，压住入口上方 */
        const cy0 = baseY - 44;
        B.px(px0, cy0, x0 + 356 - px0, 6, C.metal);
        B.px(px0, cy0, x0 + 356 - px0, 2, C.metalL);
        B.px(px0, cy0 + 6, x0 + 356 - px0, 2, C.metalD);
        B.px(px0 + 2, cy0 + 8, x0 + 352 - px0, 2, "rgba(14,18,28,0.26)");
        B.px(x0 + 352, cy0, 4, 9, C.metalD);

        /* 6. 入口：深色玻璃双开门，藏在门斗右侧的凹口里 */
        const dx0 = x0 + 282, dw = 48, dy0 = baseY - 34;
        B.px(dx0 - 3, dy0 - 3, dw + 6, 37, "#2b2b29");
        B.px(dx0, dy0, dw, 34, C.lobby);
        B.px(dx0, dy0, 3, 34, C.lobbyL);
        B.px(dx0, dy0 + 16, dw, 1, "rgba(180,190,188,0.45)");
        B.px(dx0 + Math.round(dw / 2), dy0, 1, 32, "#9ca6a4");
        B.px(dx0 + 4, dy0 + 24, 5, 1, "#b9bcb8");     // 拉手
        B.px(dx0 + dw - 9, dy0 + 24, 5, 1, "#b9bcb8");

        /* 7. 门前锈钢招牌（照片里那块大石板，金字） */
        B.px(x0 + 334, baseY - 34, 84, 32, C.cortenD);
        B.px(x0 + 336, baseY - 33, 80, 28, C.corten);
        B.px(x0 + 338, baseY - 32, 76, 3, C.cortenL);
        B.px(x0 + 336, baseY - 6, 80, 2, "rgba(20,10,6,0.40)");
        for (let x = x0 + 342; x < x0 + 414; x += 11)
          B.px(x, baseY - 29, 1, 21, "rgba(60,30,18,0.22)");
        B.goldText("建筑与艺术学院", x0 + 376, baseY - 28, 9, C.gold);

        /* 9. 墙面小细节：右侧一支摄像头 / 雨水口 */
        B.px(x1 - 18, eaveY + 12, 10, 3, "#5c5a55");
        B.px(x1 - 11, eaveY + 15, 2, 4, "#5c5a55");
        B.px(x0 + 88, eaveY + 2, 2, B.wallH - 4, "#c7b09d");
        B.px(x0 + 90, eaveY + 2, 1, B.wallH - 4, "#a9917e");

        /* 10. 外轮廓 */
        B.edges("#c9b09c", "#9c8371");
      }
    }
  });
})();
