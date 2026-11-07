/* 10 9号公寓楼
   照片：两层红砖 + 两道灰壁柱（左中、右中）+ 灰色楼层腰带与墙裙
        + 绿玻璃窗（银白窗框）+ 中央暗棕双开门、门上白牌与小白雨篷
        + 檐口一道红瓦。 */
(function () {
  PC_BUILDINGS.push({
    id: "10-d9",
    name: "9号公寓楼",
    note: "2 层 · 红砖 / 灰壁柱 / 绿玻璃 / 暗棕门",
    spec: {
      w: 380, floors: 2, sign: false, seed: 7010, roofT: 54,
      wall: "#963c32", roof: "#9a9184", glass: "#a9bd8e", texture: "brick",
      draw: function (B) {
        const g = B.g, x0 = B.x0, x1 = B.x1, w = B.w;
        const eaveY = B.eaveY, baseY = B.baseY;
        const CX = x0 + Math.round(w / 2);
        const C = {
          red: "#963c32", redL: "#ad4f43", redD: "#6f2821",
          grey: "#8a8d92", greyL: "#a6a9ae", greyD: "#66696e",
          frame: "#dcdcd6", frameL: "#f2f2ee", frameD: "#a9a9a2",
          glass: "#a9bd8e", glassD: "#75886a", glassL: "#cfdcb4",
          lit: "#d8d9a6", litL: "#efedc6",
          door: "#5a3b2a", doorD: "#3d271c",
          sign: "#ece6d8", signD: "#a9a190", tile: "#8e3a34"
        };

        /* 1. 红砖墙 */
        B.px(x0, eaveY, w, B.wallH, C.red);
        B.px(x0, eaveY, 3, B.wallH, C.redL);
        B.px(x1 - 4, eaveY, 4, B.wallH, C.redD);

        /* 2. 檐口红瓦 */
        B.px(x0 - 3, eaveY - 3, w + 6, 5, C.tile);
        for (let x = x0 - 3; x < x1 + 3; x += 6) B.px(x, eaveY - 3, 3, 2, "#a44a3f");
        B.px(x0 - 3, eaveY + 2, w + 6, 2, "rgba(14,18,28,0.30)");

        /* 3. 灰壁柱 + 楼层腰带 + 墙裙 */
        for (const px0 of [x0 + 112, x0 + 252]) {
          B.px(px0, eaveY + 2, 16, B.wallH - 2, C.grey);
          B.px(px0, eaveY + 2, 2, B.wallH - 2, C.greyL);
          B.px(px0 + 13, eaveY + 2, 3, B.wallH - 2, C.greyD);
        }
        B.px(x0, eaveY + 36, w, 6, C.grey);
        B.px(x0, eaveY + 36, w, 2, C.greyL);
        B.px(x0, eaveY + 42, w, 2, C.greyD);
        B.px(x0, baseY - 8, w, 8, C.grey);
        B.px(x0, baseY - 8, w, 2, C.greyL);
        B.px(x0, baseY - 1, w, 1, C.greyD);

        /* 4. 上排窗：左右各两扇 */
        const upY = eaveY + 10, upH = 22;
        const upX = [x0 + 16, x0 + 58, x1 - 92, x1 - 50];
        for (let i = 0; i < upX.length; i++) {
          const wx = upX[i];
          B.px(wx - 2, upY - 2, 38, upH + 4, C.frameD);
          B.px(wx, upY, 34, upH, C.frameL);
          B.px(wx + 1, upY + 1, 32, upH - 2, C.glass);
          B.px(wx + 1, upY + 1, 32, 4, C.glassL);
          B.px(wx + 1, upY + 1, 32, 3, "rgba(255,255,255,0.24)");
          B.px(wx + 12, upY + 1, 2, upH - 2, C.frame);        // 左固定扇
          B.px(wx + 22, upY + 1, 1, upH - 2, C.frameD);
          B.px(wx - 3, upY + upH, 40, 3, C.greyL);            // 窗台
          B.px(wx - 3, upY + upH + 3, 40, 1, "rgba(14,18,28,0.26)");
        }

        /* 5. 下排窗：左二右二 */
        const loY = eaveY + 45, loH = 14;
        const loX = [x0 + 16, x0 + 58, x1 - 92, x1 - 50];
        for (let i = 0; i < loX.length; i++) {
          const wx = loX[i];
          B.px(wx - 2, loY - 2, 38, loH + 4, C.frameD);
          B.px(wx, loY, 34, loH, C.frameL);
          B.px(wx + 1, loY + 1, 32, loH - 2, i === 1 || i === 2 ? C.lit : C.glassD);
          B.px(wx + 1, loY + 1, 32, 2, i === 1 || i === 2 ? C.litL : C.glass);
          B.px(wx + 12, loY + 1, 2, loH - 2, C.frame);
          B.px(wx + 22, loY + 1, 1, loH - 2, C.frameD);
          B.px(wx - 3, loY + loH, 40, 3, C.greyL);
        }

        /* 6. 中央门：白牌 → 小白雨篷 → 暗棕双扇 */
        /* 楼名牌（砖墙上嵌一块白牌） */
        B.signPlate("9号公寓楼", CX, eaveY + 8, 12, {
          bg: C.sign, bgL: "#faf5e8", bgD: C.signD, col: "#2f2a24", padX: 6, padY: 3
        });
        const dW = 38, dx = CX - Math.round(dW / 2), dy = baseY - 30;
        B.px(dx - 8, eaveY + 28, dW + 16, 6, "#e6e2d6");        // 小白雨篷
        B.px(dx - 8, eaveY + 28, dW + 16, 2, "#f7f4ea");
        B.px(dx - 8, eaveY + 34, dW + 16, 2, "rgba(14,18,28,0.28)");
        B.px(dx - 4, dy - 4, dW + 8, 34, C.greyD);
        B.px(dx, dy - 2, dW, 8, "#e8e4d2");                     // 门上亮子
        B.px(dx + 2, dy, dW - 4, 6, C.litL);
        B.px(dx, dy + 6, dW, 24, C.door);
        B.px(dx, dy + 6, dW, 2, "#7a5a42");
        B.px(dx + Math.round(dW / 2), dy + 6, 1, 24, C.doorD);
        for (let y = dy + 10; y < dy + 28; y += 6) {
          B.px(dx + 4, y, 10, 1, "rgba(0,0,0,0.22)");
          B.px(dx + dW - 14, y, 10, 1, "rgba(0,0,0,0.22)");
        }
        B.px(dx + 4, dy + 18, 2, 6, "#b9a06a");
        B.px(dx + dW - 6, dy + 18, 2, 6, "#b9a06a");

        /* 7. 落水管 */
        B.px(x0 + 106, eaveY + 6, 2, B.wallH - 16, "#d6d5cf");
        B.px(x0 + 270, eaveY + 6, 2, B.wallH - 16, "#d6d5cf");

        /* 8. 外轮廓 */
        B.edges("#ad4f43", "#6f2821");
      },
      after: function (B) {
        /* 门前一步混凝土台阶 + 地面 */
        B.px(B.x0 + Math.round(B.w / 2) - 30, B.baseY, 60, 4, "#b5b1a8");
        B.px(B.x0 + Math.round(B.w / 2) - 30, B.baseY, 60, 1, "#cbc7be");
        B.px(B.x0 + Math.round(B.w / 2) - 30, B.baseY + 4, 60, 1, "rgba(14,18,28,0.26)");
        B.px(B.x0, B.baseY + 6, B.w, 2, "rgba(14,18,28,0.16)");
      }
    }
  });
})();
