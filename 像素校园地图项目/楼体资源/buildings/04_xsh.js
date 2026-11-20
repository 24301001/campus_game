/* 04 学生活动服务中心
   照片：三层红色曲面裙房（顶部金色横排大字、两排窗、首层沿街店面）
        + 背后一团白色波浪板高层 + 左侧米色塔楼 + 右侧赭黄塔楼
        + 中部「美食汇」三块红牌 + 首层「北交文创」入口。

   ⚠️ 用户 2026-11-07 第四轮：「学生活动中心是那一整块空白处都是图片提供的
      建筑物，现有地图上建筑物占比不足」⇒ 占地 656 行，精灵原来只占 302 行
      （46%），北边 354 行全是空地。这一版把 roofT 由默认 114 提到 332：
        · baseY = 18+332+170 = 520，画布顶 = 落地线 − 520
        · 楼体从画布第 20 行画到 520 行 ⇒ 占占地约 79%，北边只剩 160 行的
          内院（交给 37b_farwest_sprite 的地坪：草坪 + 下沉广场）
     ⚠️ 立面宽度 w=380 一点没动：占地 370.9px，380 只超出 4.5px/边。
     ⚠️ 裙房（红色曲面）的所有构件仍按 B.eaveY / B.baseY 现算，位置与上一版
        完全一致 —— 变的只是它上面那截背景体量从 118 行长到 332 行。
     ⚠️ make() 默认的平屋面 / 通风井 / 墙体 / wallQuad 在这一版全部用不上：
        draw() 第一件事是 clearRect，整张画布从零画（连 make() 的落地影也
        一起抹掉，所以本文件自己补了一段朝东南的投影）。 */
(function () {
  PC_BUILDINGS.push({
    id: "04-xsh",
    name: "学生活动服务中心",
    note: "裙房 3 层 · 白色波浪高层 / 米色塔楼 / 赭黄塔楼",
    spec: {
      w: 380, floors: 5, sign: false, seed: 6404,
      /* 332 = 画布上多出来的这截背景体量。改它会同时改画布高与 ay，
         37b 的地坪高度跟着 s.ay 现算，不用同步改数。 */
      roofT: 332,
      wall: "#a5453a", roof: "#dfe0e1", glass: "#b9c9a8", texture: "none",
      draw: function (B) {
        const g = B.g, x0 = B.x0, x1 = B.x1, w = B.w;
        const eaveY = B.eaveY, baseY = B.baseY, PADT = B.PADT;
        const CX = x0 + Math.round(w / 2);
        const C = {
          red: "#a5453a", redL: "#bd5a4c", redD: "#7d2f27",
          gold: "#d9b45f", goldD: "#8e6b24",
          white: "#e4e5e6", whiteL: "#f2f3f4", whiteD: "#c6c8ca",
          beige: "#cfc6b6", beigeD: "#b3a997", beigeL: "#e0d8c9",
          ochre: "#c98a52", ochreL: "#dc9f64", ochreD: "#a06a3a",
          glass: "#8fa3a6", glassD: "#5c7074", glassW: "#c9d3cf",
          frame: "#e6e4de", frameD: "#a8a49c",
          shop: "#c9d2b8", shopL: "#e2e8d4",
          deck: "#cdcbc3", deckL: "#e4e2da", deckD: "#8f8b80",
          dark: "#3a2b28", cream: "#e9e4d8"
        };

        /* 圆角矩形（白色波浪体量的轮廓） */
        function roundRect(x, y, ww, hh, r, col) {
          for (let j = 0; j < hh; j++) {
            let ins = 0;
            if (j < r) ins = r - Math.round(Math.sqrt(r * r - (r - j) * (r - j)));
            else if (j > hh - r) {
              const k = j - (hh - r);
              ins = r - Math.round(Math.sqrt(Math.max(0, r * r - k * k)));
            }
            B.px(x + ins, y + j, ww - ins * 2, 1, col);
          }
        }

        /* 0. 抹掉 make() 的骨架（默认平屋面 + 通风井 + 墙 + 落地影） */
        g.clearRect(0, 0, B.canvas.width, B.canvas.height);

        /* 0.1 落地影：SUN 在西北 ⇒ 影子朝东南，20 行，越远越淡 */
        for (let j = 1; j <= 20; j++) {
          const off = Math.round(16 * j / 21);
          B.px(x0 + off, baseY + j, w, 1,
               "rgba(14,18,28," + (0.10 * (1 - j / 22)).toFixed(3) + ")");
        }

        /* --- 1. 白色波浪板高层（背景最高的一团，先画） --- */
        const wx0 = x0 + 74, wx1 = x1 - 80;          // 100..326
        const wtop = PADT + 2, wbot = eaveY + 30;    // 20..380
        roundRect(wx0, wtop, wx1 - wx0, wbot - wtop, 18, C.white);
        roundRect(wx0 + 2, wtop + 2, wx1 - wx0 - 4, wbot - wtop - 4, 16, C.whiteL);
        /* 波浪横带：每一条由正弦偏移的像素行组成，铺满整个白色体量 */
        for (let by = wtop + 16; by < wbot - 10; by += 20) {
          for (let x = wx0 + 6; x < wx1 - 6; x++) {
            const t = (x - wx0) / 34;
            const yy = by + Math.round(3.2 * Math.sin(t * Math.PI * 2));
            B.px(x, yy, 1, 6, C.white);
            B.px(x, yy + 6, 1, 3, C.whiteD);
          }
        }
        /* 板缝：隔一段一条极淡的竖线，免得整面读成一块白板 */
        for (let x = wx0 + 24; x < wx1 - 12; x += 46)
          B.px(x, wtop + 12, 1, wbot - wtop - 22, "rgba(150,152,154,0.16)");
        /* 体量右侧背光 */
        B.px(wx1 - 10, wtop + 8, 8, wbot - wtop - 16, "rgba(90,90,92,0.10)");
        /* 屋顶机房 + 一小段天线 */
        B.px(wx0 + 82, wtop - 12, 58, 12, C.whiteD);
        B.px(wx0 + 82, wtop - 12, 58, 2, C.whiteL);
        B.px(wx0 + 96, wtop - 18, 10, 6, "#b9bbbd");
        B.px(wx0 + 100, wtop - 26, 2, 8, "#8f9193");

        /* --- 2. 左米色塔楼（次高） --- */
        const lw = 76, lx = x0, ltop = PADT + 16;    // 34
        B.px(lx, ltop, lw, baseY - ltop, C.beige);
        B.px(lx, ltop, 3, baseY - ltop, C.beigeL);
        B.px(lx + lw - 3, ltop, 3, baseY - ltop, C.beigeD);
        B.px(lx, ltop, lw, 3, "#e8e0d1");
        B.px(lx, ltop + 3, lw, 2, "rgba(30,24,16,0.22)");
        B.px(lx + 20, ltop - 10, 36, 10, C.beigeD);
        B.px(lx + 20, ltop - 10, 36, 2, "#e8e0d1");
        B.px(lx + 20, ltop - 10, 2, 10, C.beigeL);
        for (let f = 0; ; f++) {
          const wy = ltop + 12 + f * 30;
          if (wy + 20 > eaveY + 40) break;
          for (let k = 0; k < 4; k++) {
            const wx = lx + 7 + k * 17;
            B.px(wx, wy, 12, 20, C.frameD);
            B.px(wx + 1, wy + 1, 10, 18, C.glass);
            B.px(wx + 1, wy + 1, 10, 3, "#c9d5d8");
            B.px(wx + 6, wy + 1, 1, 18, C.frame);
            B.px(wx - 1, wy + 20, 14, 2, "rgba(40,32,24,0.20)");
          }
        }

        /* --- 3. 右赭黄塔楼（最矮一档） --- */
        const rw = 82, rx = x1 - rw, rtop = PADT + 30;   // 48
        B.px(rx, rtop, rw, baseY - rtop, C.ochre);
        B.px(rx, rtop, 3, baseY - rtop, C.ochreL);
        B.px(rx + rw - 4, rtop, 4, baseY - rtop, C.ochreD);
        B.px(rx, rtop, rw, 3, "#d9a06a");
        B.px(rx, rtop + 3, rw, 2, "rgba(60,30,12,0.24)");
        for (let f = 0; ; f++) {
          const wy = rtop + 14 + f * 32;
          if (wy + 18 > eaveY + 40) break;
          for (let k = 0; k < 2; k++) {
            const wx = rx + 12 + k * 40;
            B.px(wx, wy, 11, 18, "#8a6a48");
            B.px(wx + 1, wy + 1, 9, 16, "#6d7f86");
            B.px(wx + 1, wy + 1, 9, 3, "#a9c0c6");
          }
        }

        /* --- 4. 裙房屋面：三座塔楼脚下那块混凝土平台 --- */
        const dx0 = wx0, dx1 = wx1, dy0 = eaveY + 16;    // 366
        B.px(dx0, dy0, dx1 - dx0, 26, C.deck);
        B.px(dx0, dy0, dx1 - dx0, 2, C.deckL);
        B.px(dx0, dy0 + 2, dx1 - dx0, 1, "rgba(60,56,48,0.24)");
        for (let x = dx0 + 14; x < dx1 - 4; x += 26)
          B.px(x, dy0 + 3, 1, 25, "rgba(120,112,96,0.16)");
        /* 天窗 + 两组设备 */
        B.px(dx0 + 18, dy0 + 7, 26, 12, "#a9bcbe");
        B.px(dx0 + 18, dy0 + 7, 26, 2, "#cfe0e0");
        B.px(dx0 + 18, dy0 + 19, 26, 1, "rgba(0,0,0,0.22)");
        B.px(dx0 + 118, dy0 + 6, 34, 14, "#b8b5aa");
        B.px(dx0 + 118, dy0 + 6, 34, 2, "#d8d5ca");
        B.px(dx0 + 118, dy0 + 20, 34, 1, "rgba(0,0,0,0.24)");
        B.px(dx0 + 168, dy0 + 8, 20, 10, "#aeaba0");
        B.px(dx0 + 168, dy0 + 8, 20, 2, "#cfccc2");

        /* --- 5. 红色曲面裙房：顶边是一条浅弧（中间低、两端高） --- */
        const topAt = x => {
          const t = (x - CX) / (w / 2);
          return eaveY + 40 + Math.round(12 * (1 - t * t));
        };
        for (let x = x0; x <= x1; x++) {
          const ty = topAt(x);
          B.px(x, ty, 1, baseY - ty, C.red);
          B.px(x, ty, 1, 1, C.redL);
          B.px(x, ty + 1, 1, 2, C.redD);
        }
        /* 尽头一点点背光 */
        for (let x = x1 - 10; x <= x1; x++) B.px(x, topAt(x), 1, baseY - topAt(x), "rgba(60,20,16,0.16)");

        /* --- 6. 金色横排楼名（跟着顶边弧线走） --- */
        const txt = "学生活动服务中心";
        const step = 16, tx0 = CX - Math.round((txt.length - 1) * step / 2);
        for (let i = 0; i < txt.length; i++) {
          const cx = tx0 + i * step;
          const ty = topAt(cx) + 4;
          B.goldText(txt.charAt(i), cx, ty, 12, C.gold);
        }

        /* --- 7. 裙房上排窗：细高的竖窗，一长排 --- */
        const ay = eaveY + 64, ah = 20;
        for (let x = x0 + 18; x < x1 - 16; x += 31) {
          if (x > CX - 92 && x < CX + 84) continue;           // 中间留给楼名
          B.px(x, ay, 9, ah, C.frame);
          B.px(x + 1, ay + 1, 7, ah - 2, C.glassD);
          B.px(x + 1, ay + 1, 7, 3, C.glass);
          B.px(x + 1, ay + Math.round(ah * 0.6), 7, 1, "rgba(20,30,34,0.45)");
          B.px(x - 1, ay + ah, 11, 2, "rgba(60,20,16,0.30)");
        }

        /* --- 8. 裙房中排窗（沿街店面，绿玻璃） --- */
        const my = eaveY + 90, mh = 26;
        for (let x = x0 + 20; x + 28 <= x1 - 8; x += 34) {
          if (x > CX - 62 && x < CX + 62) continue;           // 中间留给美食汇
          B.px(x - 1, my - 1, 28, mh + 3, C.frameD);
          B.px(x, my, 26, mh, C.shop);
          B.px(x, my, 26, 4, C.shopL);
          B.px(x, my + Math.round(mh * 0.55), 26, 1, C.frameD);
          B.px(x + 12, my, 1, mh, C.frameD);
          B.px(x, my + mh, 26, 2, "rgba(60,20,16,0.35)");
        }
        /* 美食汇：三块红牌 + 白字 */
        const food = "美食汇";
        for (let i = 0; i < 3; i++) {
          const fx = CX - 44 + i * 34, fy = my + 2;
          B.px(fx + 2, fy + 2, 20, 20, "rgba(40,10,8,0.35)");
          B.px(fx, fy, 20, 20, "#c0392b");
          B.px(fx, fy, 20, 1, "#e0685c");
          B.px(fx, fy + 19, 20, 1, "#8e2018");
          B.goldText(food.charAt(i), fx + 10, fy + 4, 12, "#f5ead2");
        }

        /* --- 9. 首层沿街店面 --- */
        const gy = baseY - 34, gh = 30;
        for (let x = x0 + 14; x + 34 <= x1 - 10; x += 40) {
          if (x > CX - 42 && x < CX + 42) continue;           // 中间留给入口
          B.px(x, gy, 34, gh, C.dark);
          B.px(x + 1, gy + 1, 32, gh - 2, "#6f7f6d");
          B.px(x + 1, gy + 1, 32, 4, "#93a58c");
          B.px(x + 16, gy + 1, 1, gh - 2, "#3f4a3e");
          B.px(x, gy - 1, 34, 2, C.redD);
        }

        /* --- 10. 北交文创入口 --- */
        const ex0 = CX - 36, ex1 = CX + 36, ey0 = baseY - 56;
        B.px(ex0 - 4, ey0 - 4, ex1 - ex0 + 8, baseY - ey0 + 4, C.redD);
        B.px(ex0, ey0, ex1 - ex0, baseY - ey0 - 2, "#8e3a30");
        for (let x = ex0 + 4; x < ex1 - 4; x += 7)
          B.px(x, ey0 + 14, 2, baseY - ey0 - 18, "#c4645a");     // 竖向装饰肋
        B.px(ex0, ey0, ex1 - ex0, 3, "#c4645a");
        B.signPlate("北交文创", CX, ey0 + 3, 10, {
          bg: C.cream, bgL: "#f6f2e8", bgD: "#a89f8c", col: "#3a3230", padX: 4, padY: 3
        });
        B.px(ex0 + 18, baseY - 32, 18, 30, "#e7e0d2");
        B.px(ex0 + 40, baseY - 32, 16, 30, "#d9d2c4");
        B.px(ex0 + 20, baseY - 24, 2, 6, "#3a3230");
        B.px(ex0 + 50, baseY - 24, 2, 6, "#3a3230");

        /* --- 11. 外轮廓与接地 --- */
        B.edges(C.beigeL, C.ochreD);
        B.px(x0 - 1, ltop, 1, eaveY - ltop, C.beigeL);
        B.px(x1, rtop, 1, eaveY - rtop, C.ochreD);
        B.px(x0, baseY - 4, w, 4, "rgba(40,16,12,0.20)");
      }
    }
  });
})();
