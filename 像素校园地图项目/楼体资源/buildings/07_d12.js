/* 07 12号宿舍楼
   照片：六层红砖楼 + 中央一整条灰蓝楼梯间（每层一对小白框窗）
        + 两侧宽窗与密集空调外机 + 灰色雨篷挂「12号宿舍楼」白牌
        + 深色玻璃门 + 首层防盗栅 + 门前几级台阶。 */
(function () {
  PC_BUILDINGS.push({
    id: "07-d12",
    name: "12号宿舍楼",
    note: "6 层 · 红砖 / 灰蓝楼梯间 / 空调外机 / 白牌",
    spec: {
      w: 420, floors: 6, sign: false, seed: 6707,
      wall: "#9c3b30", roof: "#8a8173", glass: "#8ea9c6", texture: "brick",
      draw: function (B) {
        const g = B.g, x0 = B.x0, x1 = B.x1, w = B.w;
        const eaveY = B.eaveY, baseY = B.baseY, FH = PC.FLOOR_H;
        const CX = x0 + Math.round(w / 2);
        const C = {
          red: "#9c3b30", redL: "#b65447", redD: "#76251c",
          grey: "#7c8796", greyL: "#98a4b2", greyD: "#5b6674", greyDD: "#46505c",
          frame: "#e9e9e4", frameD: "#b9b9b2",
          glass: "#8ea9c6", glassD: "#5e7896",
          curtain: "rgba(198,218,238,0.36)",
          door: "#38424a", sign: "#e9e3d4", signD: "#a8a08e", ac: "#e2e5ea"
        };
        const floorTop = f => eaveY + (B.floors - 1 - f) * FH;

        /* 1. 红砖墙 */
        B.px(x0, eaveY, w, B.wallH, C.red);
        B.px(x0, eaveY, 3, B.wallH, C.redL);
        B.px(x1 - 4, eaveY, 4, B.wallH, C.redD);
        for (let f = 1; f < B.floors; f++)
          B.px(x0, floorTop(f - 1) - 1, w, 1, "rgba(30,10,8,0.28)");

        /* 2. 两侧窗阵（每层 2 扇宽窗） */
        const winW = 46, winH = 24;
        for (let f = 0; f < B.floors; f++) {
          const wy = floorTop(f) + 6;
          for (let s = 0; s < 2; s++) {
            for (let k = 0; k < 2; k++) {
              const wx = s ? x1 - 122 + k * 58 : x0 + 18 + k * 58;
              B.win(wx, wy, winW, winH, {
                frame: C.frame, glass: C.glass, mullions: 1, sillCol: C.frameD
              });
              B.curtain(wx + 2, wy + 2, winW - 4, winH - 4, C.curtain);
              B.px(wx - 1, wy - 1, winW + 2, 2, "#f4f4f0");
              B.px(wx + winW + 2, wy + 3, 2, winH - 6, C.redD);
              /* 空调外机：照片里每扇窗旁边几乎都挂一台 */
              if (f < B.floors - 1 || k === 0)
                B.ac(wx + winW + 4, wy + 7, { col: C.ac, w: 15, h: 11 });
              else
                B.ac(wx + winW + 4, wy + 5, { col: C.ac, w: 15, h: 11 });
            }
          }
        }

        /* 3. 中央灰蓝楼梯间 */
        const tw = 96, tx = CX - Math.round(tw / 2);
        B.px(tx, eaveY, tw, B.wallH, C.grey);
        B.px(tx, eaveY, 5, B.wallH, C.greyL);
        B.px(tx + tw - 6, eaveY, 6, B.wallH, C.greyD);
        B.px(tx, eaveY, tw, 2, "#a9b4c1");
        for (let x = tx + 7; x < tx + tw - 8; x += 7)
          B.px(x, eaveY + 2, 1, B.wallH - 4, "rgba(30,38,48,0.10)");
        for (let f = 0; f < B.floors; f++) {
          const wy = floorTop(f) + 7;
          for (let k = 0; k < 2; k++) {
            const wx = CX - 25 + k * 28;
            B.px(wx - 1, wy - 1, 24, 22, C.frame);
            B.px(wx, wy, 22, 20, C.glassD);
            B.px(wx, wy, 22, 3, C.glass);
            B.px(wx + 10, wy, 1, 20, C.frame);
            B.px(wx + 2, wy + 13, 18, 1, C.frame);
            B.px(wx - 1, wy + 21, 24, 2, "rgba(14,18,28,0.30)");
          }
          /* 楼梯间的层间横线 */
          B.px(tx, floorTop(f) + 30, tw, 1, "rgba(30,38,48,0.22)");
        }
        B.px(tx - 1, eaveY, 1, B.wallH, "#3d4652");
        B.px(tx + tw, eaveY, 1, B.wallH, "#3d4652");

        /* 4. 雨篷 + 楼名牌 */
        const cy = baseY - 76;
        B.px(CX - 92, cy, 184, 12, C.greyD);
        B.px(CX - 92, cy, 184, 2, C.greyL);
        B.px(CX - 92, cy + 12, 184, 2, "rgba(14,18,28,0.32)");
        B.signPlate("12号宿舍楼", CX, cy + 1, 14, {
          bg: C.sign, bgL: "#f8f3e5", bgD: C.signD, col: "#2e2a24", padX: 7, padY: 2
        });

        /* 5. 深色玻璃门 */
        const dx0 = CX - 34, dx1 = CX + 34, dy0 = baseY - 54;
        B.px(dx0 - 4, dy0 - 4, dx1 - dx0 + 8, 56, C.greyDD);
        B.px(dx0, dy0, dx1 - dx0, 52, C.door);
        B.px(dx0, dy0, dx1 - dx0, 2, "rgba(10,13,20,0.55)");
        for (let x = dx0 + 16; x < dx1; x += 17) B.px(x, dy0, 1, 52, "#79838b");
        B.px(dx0, dy0 + 24, dx1 - dx0, 1, "rgba(170,180,190,0.40)");
        B.px(dx0 + 24, dy0 + 34, 2, 8, "#b9bcbf");
        B.px(dx1 - 26, dy0 + 34, 2, 8, "#b9bcbf");

        /* 6. 首层防盗栅（两侧） */
        for (let s = 0; s < 2; s++) {
          for (let k = 0; k < 2; k++) {
            const wx = s ? x1 - 122 + k * 58 : x0 + 18 + k * 58;
            const wy = baseY - 44;
            for (let x = wx + 4; x < wx + winW; x += 5) B.px(x, wy, 1, 24, "#c9c9c4");
            B.px(wx - 1, wy, winW + 2, 1, "#c9c9c4");
            B.px(wx - 1, wy + 24, winW + 2, 1, "#c9c9c4");
          }
        }

        /* 7. 墙面落水管（白） */
        for (let s = 0; s < 2; s++) {
          const px = s ? x1 - 12 : x0 + 10;
          B.px(px, eaveY + 2, 2, B.wallH - 4, "#dcdcd6");
          B.px(px, eaveY + 2, 1, B.wallH - 4, "#b9b9b2");
        }

        /* 8. 灰墙裙 */
        B.px(x0, baseY - 10, w, 10, "#6f7a88");
        B.px(x0, baseY - 10, w, 2, "#8d98a6");
        B.px(x0, baseY - 1, w, 1, "#4e5763");

        /* 9. 外轮廓 */
        B.edges("#b65447", "#76251c");
      },
      after: function (B) {
        /* 门前三级台阶 */
        B.steps(B.x0 + Math.round(B.w / 2), B.baseY + 1, 92, 3, "#b3afa5");
        B.px(B.x0, B.baseY + 8, B.w, 1, "rgba(14,18,28,0.22)");
      }
    }
  });
})();
