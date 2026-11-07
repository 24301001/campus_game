/* 06 2号宿舍楼
   照片：四层红砖墙 + 灰色壁柱与楼层腰带把立面分成「2–3–2」三跨
        + 白框蓝帘窗 + 中央灰色雨篷与「2号宿舍楼」白牌 + 灰色双开门
        + 首层一条灰色墙裙。 */
(function () {
  PC_BUILDINGS.push({
    id: "06-d2",
    name: "2号宿舍楼",
    note: "4 层 · 红砖 / 灰色壁柱 / 三跨立面 / 灰门",
    spec: {
      w: 380, floors: 4, sign: false, seed: 6606,
      /* 屋面压到 20：默认 114 的屋瓦会把天佑会堂与这栋之间那 54 行条带整个盖住
         （画布顶 = 落地线 − ay，ay = 18+114+136 = 268 → 1990）。20 之后 ay 174、
         画布顶 2084，屋瓦只从 2102 起，条带让给中间那排排球场；立面位置
         （檐口 2122 / 落地 2258）一点没动，遮挡关系与百叶窗、门牌都不受影响。 */
      roofT: 20,
      wall: "#a8402f", roof: "#8d8577", glass: "#8fa9c8", texture: "brick",
      draw: function (B) {
        const g = B.g, x0 = B.x0, x1 = B.x1, w = B.w;
        const eaveY = B.eaveY, baseY = B.baseY, FH = PC.FLOOR_H;
        const CX = x0 + Math.round(w / 2);
        const C = {
          red: "#a8402f", redL: "#bd5542", redD: "#822d20",
          grey: "#8b8e93", greyL: "#a5a8ad", greyD: "#6b6e73",
          frame: "#e6e5e0", glass: "#8fa9c8", glassD: "#5f7797",
          curtain: "rgba(190,210,235,0.34)",
          door: "#8a8d92", doorD: "#5f6267",
          sign: "#eee9dc", signD: "#a9a190"
        };

        /* 1. 红砖底：上受光、右背光 */
        B.px(x0, eaveY, w, B.wallH, C.red);
        B.px(x0, eaveY, 3, B.wallH, C.redL);
        B.px(x1 - 4, eaveY, 4, B.wallH, C.redD);

        /* 2. 灰色壁柱（两端 + 两道内柱） */
        const piers = [x0, x0 + 100, x0 + 266, x1 - 14];
        for (let i = 0; i < piers.length; i++) {
          const px0 = piers[i], pw = 14;
          B.px(px0, eaveY, pw, B.wallH, C.grey);
          B.px(px0, eaveY, 2, B.wallH, C.greyL);
          B.px(px0 + pw - 3, eaveY, 3, B.wallH, C.greyD);
          B.px(px0, eaveY, pw, 2, "#b6b9bd");
        }

        /* 3. 楼层腰带（每层一道厚灰梁） */
        for (let f = 0; f < B.floors; f++) {
          const y = eaveY + f * FH;
          B.px(x0, y, w, 7, C.grey);
          B.px(x0, y, w, 2, C.greyL);
          B.px(x0, y + 7, w, 2, C.greyD);
        }
        B.px(x0, baseY - 12, w, 14, C.grey);          // 首层墙裙
        B.px(x0, baseY - 12, w, 2, C.greyL);
        B.px(x0, baseY - 1, w, 3, C.greyD);

        /* 4. 窗阵：左 2 / 中 3 / 右 2 */
        const sects = [
          { x: x0 + 22, n: 2, ww: 30, step: 38 },
          { x: x0 + 125, n: 3, ww: 36, step: 47 },
          { x: x0 + 292, n: 2, ww: 30, step: 38 }
        ];
        const rowTop = f => eaveY + (B.floors - 1 - f) * FH + 12;
        for (let f = 1; f < B.floors; f++) {
          for (const s of sects) {
            for (let k = 0; k < s.n; k++) {
              const wx = s.x + k * s.step, wy = rowTop(f);
              B.win(wx, wy, s.ww, 24, {
                frame: C.frame, glass: C.glass, mullions: 1, sillCol: C.greyL
              });
              B.curtain(wx + 2, wy + 2, s.ww - 4, 20, C.curtain);
              B.px(wx - 1, wy - 1, s.ww + 2, 2, "#f2f1ec");
            }
          }
        }

        /* 5. 首层：两侧仍是窗，中央是门 */
        for (let i = 0; i < 2; i++) {
          const s = sects[i === 0 ? 0 : 2];
          for (let k = 0; k < s.n; k++) {
            const wx = s.x + k * s.step, wy = baseY - 46;
            B.win(wx, wy, s.ww, 24, {
              frame: C.frame, glass: C.glassD, mullions: 1, sillCol: C.greyL
            });
            B.curtain(wx + 2, wy + 2, s.ww - 4, 20, C.curtain);
          }
        }
        /* 6. 中央雨篷 + 门牌 + 灰门 */
        const cy = baseY - 60;
        B.px(CX - 82, cy, 164, 20, C.greyD);
        B.px(CX - 82, cy, 164, 2, C.greyL);
        B.px(CX - 82, cy + 20, 164, 2, "rgba(14,18,28,0.30)");
        B.signPlate("2号宿舍楼", CX, cy + 2, 13, {
          bg: C.sign, bgL: "#faf6ea", bgD: C.signD, col: "#2e2a24", padX: 7, padY: 2
        });
        const dW = 46, dH = 38, dx = CX - Math.round(dW / 2), dy = baseY - dH;
        B.px(dx - 4, dy - 2, dW + 8, dH + 2, C.greyD);
        B.px(dx, dy, dW, dH, C.door);
        B.px(dx, dy, dW, 2, "#b6b9bd");
        B.px(dx + Math.round(dW / 2), dy, 1, dH, C.doorD);
        B.px(dx + 4, dy + 8, dW - 8, 12, "#c9ccd0");           // 门上部小玻璃
        B.px(dx + 4, dy + 8, dW - 8, 2, "#e6e8ea");
        B.px(dx + 6, dy + 30, 2, 8, "#4a4d52");
        B.px(dx + dW - 8, dy + 30, 2, 8, "#4a4d52");
        B.px(dx - 4, baseY - 1, dW + 8, 3, "#9a9da2");

        /* 7. 落水管：两根银白管贴着壁柱走 */
        B.px(x0 + 96, eaveY + 8, 2, B.wallH - 16, "#d9d8d2");
        B.px(x0 + 282, eaveY + 8, 2, B.wallH - 16, "#d9d8d2");
        B.px(x0 + 95, eaveY + 8, 1, B.wallH - 16, "#b5b3ac");

        /* 8. 外轮廓 */
        B.edges("#c25b48", "#7a2a1e");
      }
    }
  });
})();
