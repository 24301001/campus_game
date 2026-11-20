/* 05 19号宿舍楼
   照片：五排白色凸窗（6 个开间）的红砖主楼 + 右端红色楼梯塔
        + 屋面一排太阳能板 + 两层银灰金属板裙房（中央雨篷挂「19号宿舍楼」）
        + 首层玻璃门厅 + 墙根两丛修剪过的灌木。 */
(function () {
  PC_BUILDINGS.push({
    id: "05-d19",
    name: "19号宿舍楼",
    note: "7 层 · 红砖 / 白色凸窗 / 银灰裙房 / 屋顶太阳能",
    spec: {
      w: 520, floors: 7, sign: false, seed: 6505,
      wall: "#a8402f", roof: "#8f8779", glass: "#9db6c4", texture: "brick",
      draw: function (B) {
        const g = B.g, x0 = B.x0, x1 = B.x1, w = B.w;
        const eaveY = B.eaveY, baseY = B.baseY, PADT = B.PADT;
        const CX = x0 + Math.round(w / 2);
        const C = {
          red: "#a8402f", redL: "#bd5542", redD: "#822d20",
          bay: "#e1e4e6", bayL: "#f2f4f5", bayD: "#b6bbbe",
          glass: "#9db6c4", glassD: "#6f8996", glassL: "#c3d5dc",
          spand: "#cfd5d8", spandD: "#a9b0b5",
          metal: "#8d939c", metalL: "#a8aeb6", metalD: "#666c75",
          metalDD: "#4f555e",
          hall: "#3f4d55", sign: "#e8e2d2", signD: "#a79f8c",
          solar: "#2f3f55", solarL: "#4d6b8f", shrub: "#2f5c33", shrubL: "#4a7d47"
        };

        /* 1. 屋顶太阳能板（画在屋带上，读作楼顶） */
        for (let r = 0; r < 3; r++) {
          const sy = PADT + 14 + r * 12;
          for (let k = 0; k < 8; k++) {
            const sx = x0 + 26 + k * 46;
            if (sx + 40 > x1 - 100) break;
            B.px(sx, sy, 40, 9, C.solar);
            B.px(sx, sy, 40, 2, C.solarL);
            B.px(sx, sy + 9, 40, 1, "#1b2634");
            B.px(sx + 4, sy + 10, 2, 3, "#5a6068");
          }
        }
        B.px(x0, PADT + 2, w, 2, "#b3aa99");

        /* 2. 红砖主楼底 */
        B.px(x0, eaveY, w, 170, C.red);
        for (let y = eaveY + 5; y < eaveY + 170; y += 5) {
          B.px(x0, y, w, 1, "rgba(0,0,0,0.10)");
          const off = (((y - eaveY) / 5) | 0) & 1 ? 4 : 0;
          for (let x = x0 + off; x < x1; x += 8) B.px(x, y - 5, 1, 5, "rgba(0,0,0,0.06)");
        }
        B.px(x0, eaveY, 3, 170, C.redL);
        B.px(x1 - 4, eaveY, 4, 170, C.redD);

        /* 3. 五排白色凸窗（6 个开间） */
        const bays = 6, bw = 56, bstep = Math.round((w - 28 - bw) / (bays - 1));
        for (let f = 0; f < 5; f++) {
          const wy = eaveY + 8 + f * PC.FLOOR_H;
          for (let k = 0; k < bays; k++) {
            const bx = x0 + 14 + k * bstep;
            if (bx + bw > x1 - 6) continue;
            B.px(bx + bw, wy + 2, 2, 25, "rgba(40,16,12,0.24)");      // 右侧投在砖上的影
            B.px(bx - 1, wy - 1, bw + 2, 28, C.bayD);
            B.px(bx, wy, bw, 26, C.bay);
            B.px(bx, wy, bw, 2, C.bayL);
            B.px(bx + 2, wy + 2, bw - 4, 16, C.glass);
            B.px(bx + 2, wy + 2, bw - 4, 3, C.glassL);
            B.px(bx + 2, wy + 8, bw - 4, 2, "rgba(255,255,255,0.18)");
            B.px(bx + 18, wy + 2, 2, 16, C.bay);                       // 竖棂
            B.px(bx + 36, wy + 2, 2, 16, C.bay);
            B.px(bx + 2, wy + 18, bw - 4, 6, C.spand);                 // 窗下白裙板
            B.px(bx + 2, wy + 23, bw - 4, 1, C.spandD);
            B.px(bx - 2, wy + 26, bw + 4, 2, C.bayD);                  // 凸窗底板
            B.px(bx - 2, wy + 28, bw + 4, 1, "rgba(40,16,12,0.30)");
          }
        }

        /* 4. 右端红色楼梯塔（从屋顶长下来，压在最后一个开间前） */
        const tx0 = x1 - 92, tw = 88, ttop = PADT + 28;
        B.px(tx0, ttop, tw, baseY - ttop, C.red);
        B.px(tx0, ttop, 3, baseY - ttop, C.redL);
        B.px(tx0 + tw - 4, ttop, 4, baseY - ttop, C.redD);
        for (let y = ttop + 5; y < baseY; y += 5)
          B.px(tx0, y, tw, 1, "rgba(0,0,0,0.10)");
        B.px(tx0, ttop, tw, 2, "#c9604c");
        B.px(tx0 - 1, ttop, 1, baseY - ttop, "#5e2318");
        B.px(tx0 + tw, ttop, 1, baseY - ttop, "#5e2318");
        for (let f = 0; f < 5; f++) {
          for (let k = 0; k < 2; k++) {
            const wx = tx0 + 14 + k * 40, wy = eaveY + 12 + f * PC.FLOOR_H;
            if (wy + 18 > baseY - 72) continue;
            B.px(wx - 1, wy - 1, 26, 20, "#e3e5e6");
            B.px(wx, wy, 24, 18, C.glassD);
            B.px(wx, wy, 24, 3, C.glass);
            B.px(wx + 11, wy, 1, 18, "#d8dcdd");
          }
        }
        /* 塔顶小机房 */
        B.px(tx0 + 10, PADT + 12, tw - 20, 18, "#9b5040");
        B.px(tx0 + 10, PADT + 12, tw - 20, 2, "#b96956");

        /* 5. 两层银灰金属裙房 */
        const py = eaveY + 170;
        B.px(x0, py, w, baseY - py + 2, C.metal);
        for (let x = x0 + 3; x < x1; x += 7)
          B.px(x, py, 1, baseY - py + 2, "rgba(40,44,52,0.16)");       // 竖向压型肋
        B.px(x0, py, w, 2, C.metalL);
        B.px(x0, py + 2, w, 2, "rgba(40,44,52,0.20)");
        B.px(x0, baseY - 4, w, 6, C.metalD);
        B.px(x0, baseY - 1, w, 3, C.metalDD);

        /* 雨篷 + 楼名牌 */
        B.px(CX - 120, py + 4, 240, 18, C.metalD);
        B.px(CX - 120, py + 4, 240, 2, C.metalL);
        B.px(CX - 120, py + 22, 240, 2, "rgba(20,24,32,0.34)");
        B.signPlate("19号宿舍楼", CX, py + 5, 14, {
          bg: C.sign, bgL: "#f7f2e4", bgD: C.signD, col: "#2f2a24", padX: 6, padY: 3
        });

        /* 首层玻璃门厅 */
        const dx0 = CX - 76, dx1 = CX + 76, dy0 = py + 30;
        B.px(dx0 - 3, dy0 - 3, dx1 - dx0 + 6, baseY - dy0, "#3b424a");
        B.px(dx0, dy0, dx1 - dx0, baseY - dy0 - 2, C.hall);
        for (let x = dx0 + 18; x < dx1; x += 19) B.px(x, dy0, 1, baseY - dy0 - 2, "#77828a");
        B.px(dx0, dy0, dx1 - dx0, 2, "rgba(10,13,20,0.50)");
        B.px(dx0, baseY - 18, dx1 - dx0, 3, "#2f5f9a");                 // 蓝色门带
        B.px(dx0 + 60, baseY - 26, 2, 8, "#c9c9c2");
        /* 两侧卷帘门 / 窗 */
        B.px(x0 + 18, py + 34, 54, baseY - py - 40, "#7f858d");
        for (let y = py + 36; y < baseY - 8; y += 3) B.px(x0 + 18, y, 54, 1, "#6a7078");
        B.px(x1 - 76, py + 34, 54, baseY - py - 40, "#7f858d");
        for (let y = py + 36; y < baseY - 8; y += 3) B.px(x1 - 76, y, 54, 1, "#6a7078");

        /* 6. 外轮廓 */
        B.edges("#c25b48", "#7a2a1e");
      },
      after: function (B) {
        /* 墙根两丛修剪灌木 */
        const y = B.baseY - 6, x0 = B.x0, x1 = B.x1;
        const shrub = (cx, rx) => {
          for (let i = -rx; i <= rx; i++) {
            const h = Math.round(8 * Math.sqrt(Math.max(0, 1 - (i * i) / (rx * rx))));
            B.px(cx + i, y - h, 1, h + 6, "#2f5c33");
            B.px(cx + i, y - h, 1, 2, "#4a7d47");
          }
        };
        shrub(x0 + 30, 34);
        shrub(x1 - 30, 34);
        B.px(x0, B.baseY + 1, B.w, 2, "rgba(14,18,28,0.26)");
      }
    }
  });
})();
