/* 12 15号宿舍楼
   照片：六层红墙 + 中央一整条灰蓝楼梯间（每层一樘白框大窗）
        + 两侧成对宽窗与大量空调外机 + 通长灰雨篷挂「15号宿舍楼」白牌
        + 门口两块白色花格屏板 + 深色玻璃门 + 门前台阶与两丛灌木。 */
(function () {
  PC_BUILDINGS.push({
    id: "12-d15",
    name: "15号宿舍楼",
    note: "6 层 · 红墙 / 灰蓝楼梯间 / 空调外机 / 花格屏板",
    spec: {
      w: 440, floors: 6, sign: false, seed: 7212,
      wall: "#a8403a", roof: "#8b8274", glass: "#8ea9c6", texture: "none",
      draw: function (B) {
        const g = B.g, x0 = B.x0, x1 = B.x1, w = B.w;
        const eaveY = B.eaveY, baseY = B.baseY, FH = PC.FLOOR_H;
        const CX = x0 + Math.round(w / 2);
        const C = {
          red: "#a8403a", redL: "#bf554d", redD: "#7e2c27",
          grey: "#6f7c8a", greyL: "#8b98a6", greyD: "#505b67", greyDD: "#3f4954",
          frame: "#e8e8e2", frameD: "#b7b7af",
          glass: "#8ea9c6", glassD: "#5e7896",
          curtain: "rgba(198,218,238,0.36)",
          ac: "#e2e5ea", door: "#39434b",
          sign: "#eae4d6", signD: "#a9a190", cream: "#e3ddcd"
        };
        const floorTop = f => eaveY + (B.floors - 1 - f) * FH;

        /* 1. 红墙：横向抹灰分格（照片里是整片红色涂料） */
        B.px(x0, eaveY, w, B.wallH, C.red);
        B.px(x0, eaveY, 3, B.wallH, C.redL);
        B.px(x1 - 4, eaveY, 4, B.wallH, C.redD);
        for (let f = 1; f < B.floors; f++)
          B.px(x0, floorTop(f - 1) - 1, w, 1, "rgba(40,14,12,0.22)");

        /* 2. 两侧窗（每层 2 扇） + 空调外机 */
        const winW = 46, winH = 24;
        for (let f = 0; f < B.floors; f++) {
          const wy = floorTop(f) + 6;
          for (let s = 0; s < 2; s++) {
            for (let k = 0; k < 2; k++) {
              const wx = s ? x1 - 126 + k * 58 : x0 + 20 + k * 58;
              B.win(wx, wy, winW, winH, {
                frame: C.frame, glass: C.glass, mullions: 1, sillCol: C.frameD
              });
              B.curtain(wx + 2, wy + 2, winW - 4, winH - 4, C.curtain);
              B.px(wx - 1, wy - 1, winW + 2, 2, "#f4f4ef");
              B.ac(wx + winW + 4, wy + 6, { col: C.ac, w: 15, h: 11 });
              if (f < B.floors - 1) B.ac(wx - 19, wy + 6, { col: C.ac, w: 15, h: 11 });
            }
          }
        }

        /* 3. 中央灰蓝楼梯间 */
        const tw = 124, tx0 = CX - Math.round(tw / 2), tx1 = tx0 + tw;
        B.px(tx0, eaveY, tw, B.wallH, C.grey);
        B.px(tx0, eaveY, 4, B.wallH, C.greyL);
        B.px(tx1 - 5, eaveY, 5, B.wallH, C.greyD);
        B.px(tx0, eaveY, tw, 2, "#9dabb8");
        for (let x = tx0 + 6; x < tx1 - 6; x += 6)
          B.px(x, eaveY + 2, 1, B.wallH - 4, "rgba(30,38,48,0.08)");
        for (let f = 0; f < B.floors; f++) {
          const wy = floorTop(f) + 5;
          B.px(CX - 34, wy, 68, 26, C.frame);
          B.px(CX - 32, wy + 2, 64, 22, C.glassD);
          B.px(CX - 32, wy + 2, 64, 4, C.glass);
          B.curtain(CX - 32, wy + 2, 64, 22, C.curtain);
          B.px(CX - 11, wy + 2, 1, 22, C.frame);
          B.px(CX + 10, wy + 2, 1, 22, C.frame);
          B.px(CX - 34, wy + 26, 68, 2, "rgba(14,18,28,0.28)");
          B.ac(tx0 + 8, wy + 10, { col: C.ac, w: 15, h: 11 });
          B.ac(tx1 - 24, wy + 10, { col: C.ac, w: 15, h: 11 });
        }
        B.px(tx0 - 1, eaveY, 1, B.wallH, "#39434e");
        B.px(tx1, eaveY, 1, B.wallH, "#39434e");

        /* 4. 通长灰雨篷（楼名牌见第 6 步，压在门框之上） */
        const cy = baseY - 80;
        B.px(CX - 124, cy, 248, 14, C.greyD);
        B.px(CX - 124, cy, 248, 2, C.greyL);
        B.px(CX - 124, cy + 14, 248, 3, "rgba(14,18,28,0.34)");

        /* 5. 两块白花格屏板 */
        for (let s = 0; s < 2; s++) {
          const sx = CX - 102 + s * 156;
          B.px(sx, baseY - 66, 40, 58, C.cream);
          B.px(sx, baseY - 66, 40, 2, "#f1ecdf");
          B.px(sx, baseY - 66, 2, 58, "#f1ecdf");
          B.px(sx + 38, baseY - 66, 2, 58, "#b5ad9b");
          /* 回纹：四角小方框 + 中间十字 */
          for (let r = 0; r < 3; r++)
            for (let c = 0; c < 2; c++) {
              const bx = sx + 8 + c * 16, by = baseY - 60 + r * 18;
              B.px(bx, by, 12, 2, "#b5ad9b");
              B.px(bx, by, 2, 12, "#b5ad9b");
              B.px(bx + 10, by, 2, 12, "#b5ad9b");
              B.px(bx, by + 10, 12, 2, "#b5ad9b");
              B.px(bx + 5, by + 4, 4, 4, "#cfc6b2");
            }
        }

        /* 6. 入口：深色玻璃门 */
        const dx0 = CX - 40, dx1 = CX + 40, dy0 = baseY - 62;
        B.px(dx0 - 4, dy0 - 4, dx1 - dx0 + 8, 64, C.greyDD);
        B.px(dx0, dy0, dx1 - dx0, 60, C.door);
        B.px(dx0, dy0, dx1 - dx0, 2, "rgba(10,13,20,0.55)");
        for (let x = dx0 + 20; x < dx1; x += 20) B.px(x, dy0, 1, 60, "#79838b");
        B.px(dx0, dy0 + 30, dx1 - dx0, 1, "rgba(170,180,190,0.40)");
        B.px(dx0 + 28, dy0 + 40, 2, 8, "#b9bcbf");
        B.px(dx1 - 30, dy0 + 40, 2, 8, "#b9bcbf");
        B.signPlate("15号宿舍楼", CX, cy + 1, 14, {
          bg: C.sign, bgL: "#f9f4e6", bgD: C.signD, col: "#2e2a24", padX: 7, padY: 2
        });

        /* 7. 灰墙裙 */
        B.px(x0, baseY - 10, w, 10, "#69747f");
        B.px(x0, baseY - 10, w, 2, "#8b97a3");
        B.px(x0, baseY - 1, w, 1, "#49525c");

        /* 8. 落水管 */
        B.px(x0 + 12, eaveY + 4, 2, B.wallH - 14, "#dcdcd6");
        B.px(x1 - 14, eaveY + 4, 2, B.wallH - 14, "#dcdcd6");

        /* 9. 外轮廓 */
        B.edges("#bf554d", "#7e2c27");
      },
      after: function (B) {
        B.steps(B.x0 + Math.round(B.w / 2), B.baseY + 1, 100, 3, "#b5b1a8");
        /* 门前两丛圆灌木 */
        const shrub = (cx, rx) => {
          const y = B.baseY - 4;
          for (let i = -rx; i <= rx; i++) {
            const h = Math.round(12 * Math.sqrt(Math.max(0, 1 - (i * i) / (rx * rx))));
            B.px(cx + i, y - h, 1, h + 4, "#2f5c33");
            B.px(cx + i, y - h, 1, 2, "#4a7d47");
          }
        };
        shrub(B.x0 + 42, 30);
        shrub(B.x1 - 42, 30);
        B.px(B.x0, B.baseY + 12, B.w, 2, "rgba(14,18,28,0.20)");
      }
    }
  });
})();
