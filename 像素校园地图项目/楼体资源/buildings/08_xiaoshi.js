/* 08 校史馆
   照片：两层红砖 + 浅色石材壁柱与深挑檐 + 两排绿玻璃窗（窗下砖砌百叶）
        + 中央整座石门套（黑漆双门、门上一块「校史馆」白牌）
        + 门前一整片宽石阶。 */
(function () {
  PC_BUILDINGS.push({
    id: "08-xiaoshi",
    name: "校史馆",
    note: "2 层 · 红砖 / 石壁柱 / 石门套 / 宽石阶",
    spec: {
      w: 420, floors: 2, sign: false, seed: 6808, roofT: 46,
      wall: "#8f3e33", roof: "#a89f90", glass: "#4f6b58", texture: "brick",
      draw: function (B) {
        const g = B.g, x0 = B.x0, x1 = B.x1, w = B.w;
        const eaveY = B.eaveY, baseY = B.baseY;
        const CX = x0 + Math.round(w / 2);
        const C = {
          brick: "#8f3e33", brickL: "#a75245", brickD: "#6b2b23",
          stone: "#d9d1c0", stoneL: "#ece6d8", stoneD: "#aba291",
          stoneDD: "#8c8473",
          frame: "#dedad0", frameD: "#b6b0a2",
          glass: "#4f6b58", glassD: "#33493c", glassL: "#7d9884",
          door: "#171514", doorL: "#2e2a26",
          sign: "#f0e8d2", signD: "#b8ac90"
        };

        /* 1. 红砖底 + 深挑檐 */
        B.px(x0, eaveY, w, B.wallH, C.brick);
        B.px(x0, eaveY, 3, B.wallH, C.brickL);
        B.px(x1 - 4, eaveY, 4, B.wallH, C.brickD);
        B.px(x0 - 4, eaveY, w + 8, 6, C.stone);            // 檐口石带
        B.px(x0 - 4, eaveY, w + 8, 2, C.stoneL);
        B.px(x0 - 4, eaveY + 6, w + 8, 3, "rgba(14,18,28,0.30)");
        B.px(x0 - 2, eaveY + 9, w + 4, 1, C.stoneD);

        /* 2. 石壁柱：两端 + 门套两侧 */
        const piers = [x0 + 8, x0 + 118, x0 + 284, x1 - 28];
        for (const px0 of piers) {
          B.px(px0, eaveY + 9, 18, B.wallH - 9, C.stone);
          B.px(px0, eaveY + 9, 2, B.wallH - 9, C.stoneL);
          B.px(px0 + 15, eaveY + 9, 3, B.wallH - 9, C.stoneD);
          B.px(px0, baseY - 10, 18, 3, C.stoneDD);
        }
        B.px(x0, baseY - 8, w, 8, C.stone);                 // 石材基座
        B.px(x0, baseY - 8, w, 2, C.stoneL);
        B.px(x0, baseY - 1, w, 1, C.stoneDD);

        /* 3. 两排窗（每侧两扇） */
        const wxs = [x0 + 44, x0 + 82, x1 - 122, x1 - 84];
        for (const wx of wxs) {
          /* 上排：高窗，深绿玻璃 */
          B.px(wx - 2, eaveY + 14, 34, 28, C.frameD);
          B.px(wx, eaveY + 16, 30, 24, C.glassD);
          B.px(wx, eaveY + 16, 30, 3, C.glassL);
          B.px(wx + 14, eaveY + 16, 2, 24, C.frame);
          B.px(wx, eaveY + 28, 30, 1, C.frameD);
          B.px(wx - 3, eaveY + 41, 36, 2, C.stoneD);
          /* 下排：矮窗 */
          B.px(wx - 2, eaveY + 45, 34, 14, C.frameD);
          B.px(wx, eaveY + 46, 30, 12, C.glass);
          B.px(wx, eaveY + 46, 30, 2, C.glassL);
          B.px(wx + 14, eaveY + 46, 2, 12, C.frame);
        }

        /* 4. 中央石门套 */
        const sx0 = CX - 62, sx1 = CX + 62, sy0 = eaveY + 9;
        B.px(sx0, sy0, sx1 - sx0, baseY - sy0, C.stone);
        B.px(sx0, sy0, 3, baseY - sy0, C.stoneL);
        B.px(sx1 - 4, sy0, 4, baseY - sy0, C.stoneD);
        B.px(sx0 - 3, sy0, sx1 - sx0 + 6, 4, C.stoneL);
        B.px(sx0 - 3, sy0 + 4, sx1 - sx0 + 6, 2, "rgba(14,18,28,0.26)");

        /* 「校史馆」白牌 */
        B.signPlate("校史馆", CX, sy0 + 6, 14, {
          bg: C.sign, bgL: "#fbf4e2", bgD: C.signD, col: "#3a2f22", padX: 8, padY: 3
        });

        /* 5. 门洞：深色花格边框 + 黑漆双门 */
        const dx0 = CX - 36, dx1 = CX + 36, dy0 = sy0 + 26;
        B.px(dx0 - 6, dy0 - 2, dx1 - dx0 + 12, baseY - dy0 + 2, "#4a3f36");   // 花格边
        for (let y = dy0; y < baseY - 8; y += 4) {
          for (let x = dx0 - 5; x < dx1 + 5; x += 4) {
            if (x > dx0 && x < dx1) continue;
            B.px(x, y, 2, 2, "#6b5c4e");
          }
        }
        B.px(dx0, dy0, dx1 - dx0, baseY - dy0 - 8, C.door);
        B.px(dx0, dy0, dx1 - dx0, 2, C.doorL);
        B.px(dx0 + Math.round((dx1 - dx0) / 2), dy0, 1, baseY - dy0 - 8, "#3a352f");
        /* 每扇一对圆环装饰 */
        const rings = [[CX - 20, dy0 + 9], [CX - 20, dy0 + 20], [CX + 20, dy0 + 9], [CX + 20, dy0 + 20]];
        for (const r of rings) {
          B.roundWin(r[0], r[1], 5, 5, "#4d4436", "#241f1b");
          B.px(r[0] - 2, r[1] - 1, 4, 1, "#6d5f4a");
        }
        /* 门缝光 */
        B.px(CX, dy0 + 4, 1, baseY - dy0 - 12, "rgba(180,170,140,0.20)");

        /* 6. 外轮廓 */
        B.px(x0 - 1, eaveY + 9, 1, B.wallH - 9, C.stoneDD);
        B.px(x1, eaveY + 9, 1, B.wallH - 9, C.brickD);
      },
      after: function (B) {
        /* 门前宽石阶：五级，越往下越宽 */
        B.steps(B.x0 + Math.round(B.w / 2), B.baseY + 1, 230, 5, "#b8b3a8");
        B.px(B.x0, B.baseY + 18, B.w, 1, "rgba(14,18,28,0.22)");
      }
    }
  });
})();
