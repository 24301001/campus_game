/* 11 8号公寓楼
   照片：两排窗的红砖公寓 + 大坡红瓦屋顶（近半幅画面）
        + 灰色壁柱与楼层腰带 + 暖黄灯光窗与一排空调外机
        + 中央黑框玻璃门、门上「8号公寓楼」白牌、门右两块铜牌 + 铺装地面。 */
(function () {
  PC_BUILDINGS.push({
    id: "11-d8",
    name: "8号公寓楼",
    note: "2 层 · 红砖 / 红瓦坡顶 / 暖黄窗 / 黑框门",
    spec: {
      w: 400, floors: 2, sign: false, seed: 7111, roofT: 88,
      wall: "#9a3f35", roof: "#a8423a", glass: "#e8cf9a", texture: "brick",
      roofStyle: "tile",
      draw: function (B) {
        const g = B.g, x0 = B.x0, x1 = B.x1, w = B.w;
        const eaveY = B.eaveY, baseY = B.baseY;
        const CX = x0 + Math.round(w / 2);
        const C = {
          red: "#9a3f35", redL: "#b05247", redD: "#722b23",
          grey: "#8b8e93", greyL: "#a7aaaf", greyD: "#66696e",
          frame: "#e4e3dd", frameD: "#b3b2ab",
          lit: "#f0d9a4", litL: "#fbf0c8", litD: "#c9a86c",
          dark: "#2b2a28", door: "#232220",
          sign: "#eee8da", signD: "#aba38f", brass: "#b08a3c"
        };

        /* 1. 红砖墙 */
        B.px(x0, eaveY, w, B.wallH, C.red);
        B.px(x0, eaveY, 3, B.wallH, C.redL);
        B.px(x1 - 4, eaveY, 4, B.wallH, C.redD);
        /* 檐下阴影（坡屋面压下来的一条） */
        for (let i = 0; i < 8; i++)
          B.px(x0, eaveY + i, w, 1, "rgba(14,18,28," + (0.30 * (1 - i / 8)).toFixed(3) + ")");

        /* 2. 灰壁柱 + 楼层腰带 + 墙裙 */
        for (const px0 of [x0 + 6, x0 + 100, x0 + 296, x1 - 22]) {
          B.px(px0, eaveY + 4, 16, B.wallH - 4, C.grey);
          B.px(px0, eaveY + 4, 2, B.wallH - 4, C.greyL);
          B.px(px0 + 13, eaveY + 4, 3, B.wallH - 4, C.greyD);
        }
        B.px(x0, eaveY + 36, w, 6, C.grey);
        B.px(x0, eaveY + 36, w, 2, C.greyL);
        B.px(x0, eaveY + 42, w, 2, C.greyD);
        B.px(x0, baseY - 8, w, 8, C.grey);
        B.px(x0, baseY - 8, w, 2, C.greyL);
        B.px(x0, baseY - 1, w, 1, C.greyD);

        /* 3. 上排：暖黄灯光窗（左右各两扇） */
        const upY = eaveY + 10, upH = 22, ww = 40;
        const upX = [x0 + 28, x0 + 74, x1 - 112, x1 - 66];
        for (let i = 0; i < upX.length; i++) {
          const wx = upX[i];
          B.px(wx - 2, upY - 2, ww + 4, upH + 4, C.frameD);
          B.px(wx, upY, ww, upH, C.frame);
          B.px(wx + 1, upY + 1, ww - 2, upH - 2, C.lit);
          B.px(wx + 1, upY + 1, ww - 2, 4, C.litL);
          B.px(wx + 1, upY + 1, ww - 2, 2, "#fffbe8");
          B.px(wx + Math.round(ww / 2), upY + 1, 1, upH - 2, C.frame);
          B.px(wx + 2, upY + upH - 8, 12, 3, C.litD);
          B.px(wx - 2, upY + upH, ww + 4, 2, C.frameD);
          B.px(wx - 2, upY + upH + 2, ww + 4, 1, "rgba(14,18,28,0.26)");
          /* 空调外机（上排每扇一台） */
          B.ac(wx + ww + 4, upY + 6, { col: "#e3e4e4", w: 15, h: 11 });
        }

        /* 4. 下排：菱格栅窗（左右各两扇） */
        const loY = eaveY + 45, loH = 14;
        const loX = [x0 + 28, x0 + 74, x1 - 112, x1 - 66];
        for (let i = 0; i < loX.length; i++) {
          const wx = loX[i];
          B.px(wx - 2, loY - 2, ww + 4, loH + 4, C.frameD);
          B.px(wx, loY, ww, loH, C.lit);
          B.px(wx, loY, ww, 3, C.litL);
          /* 菱形防盗网 */
          for (let k = -loH; k < ww; k += 7)
            for (let j = 0; j < loH; j++) {
              const xx = wx + k + j;
              if (xx >= wx && xx < wx + ww) B.px(xx, loY + j, 1, 1, "rgba(120,120,112,0.55)");
            }
          for (let k = 0; k < ww + loH; k += 7)
            for (let j = 0; j < loH; j++) {
              const xx = wx + k - j;
              if (xx >= wx && xx < wx + ww) B.px(xx, loY + j, 1, 1, "rgba(120,120,112,0.45)");
            }
          B.px(wx, loY, 2, loH, C.frame);
          B.px(wx + ww - 2, loY, 2, loH, C.frame);
          B.px(wx - 2, loY + loH, ww + 4, 2, C.frameD);
          B.ac(wx + ww + 4, loY + 2, { col: "#e3e4e4", w: 15, h: 11 });
        }

        /* 5. 中央黑框玻璃门 + 白牌 + 铜牌 */
        /* 白牌（门楣上方的砖墙白牌） */
        B.signPlate("8号公寓楼", CX, eaveY + 8, 12, {
          bg: C.sign, bgL: "#fbf6e9", bgD: C.signD, col: "#2f2a24", padX: 6, padY: 3
        });
        const dW = 40, dx = CX - Math.round(dW / 2), dy = baseY - 30;
        B.px(dx - 5, dy - 4, dW + 10, 34, C.dark);
        B.px(dx - 2, dy - 1, dW + 4, 3, "#4a4a46");
        B.px(dx, dy, dW, 30, "#3a4a48");
        B.px(dx + 1, dy + 1, dW - 2, 28, "#55706c");
        B.px(dx + 1, dy + 1, dW - 2, 4, "rgba(220,235,230,0.30)");
        B.px(dx + Math.round(dW / 2), dy, 1, 30, C.dark);
        B.px(dx + 4, dy + 16, 2, 8, "#b9bcb8");
        B.px(dx + dW - 6, dy + 16, 2, 8, "#b9bcb8");
        B.px(dx - 5, dy + 32, dW + 10, 2, "#1a1918");
        /* 门右两块铜牌 */
        B.px(CX + 34, eaveY + 42, 22, 12, C.brass);
        B.px(CX + 35, eaveY + 43, 20, 10, "#c9a24f");
        B.px(CX + 34, eaveY + 56, 22, 10, C.brass);
        B.px(CX + 35, eaveY + 57, 20, 8, "#c9a24f");

        /* 6. 落水管 */
        B.px(x0 + 94, eaveY + 8, 2, B.wallH - 18, "#d8d7d1");
        B.px(x0 + 302, eaveY + 8, 2, B.wallH - 18, "#d8d7d1");

        /* 7. 外轮廓 */
        B.edges("#b05247", "#722b23");
      },
      after: function (B) {
        /* 门下一级石台 + 铺装广场 */
        const cx = B.x0 + Math.round(B.w / 2);
        B.px(cx - 34, B.baseY, 68, 4, "#b8b4ab");
        B.px(cx - 34, B.baseY, 68, 1, "#d0ccc3");
        B.px(B.x0 - 8, B.baseY + 5, B.w + 16, 12, "#a9a6a0");
        B.px(B.x0 - 8, B.baseY + 5, B.w + 16, 2, "#c2bfb8");
        for (let x = B.x0 - 8; x < B.x0 + B.w + 8; x += 24)
          B.px(x, B.baseY + 7, 1, 10, "rgba(60,58,52,0.16)");
        B.px(B.x0 - 8, B.baseY + 17, B.w + 16, 2, "#8e8a83");
      }
    }
  });
})();
