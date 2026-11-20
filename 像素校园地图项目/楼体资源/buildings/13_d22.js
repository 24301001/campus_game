/* 13 22号宿舍楼
   照片：浅灰混凝土宿舍楼。右 3/4 是通长的玻璃阳台带 —— 深色玻璃 + 深色格栅栏杆
        + 零星晾晒的衣物，每层一道浅色楼板；左 1/4 是一条通高的素混凝土服务塔楼，
        墙上只有一列小方洞（检修口）。平屋顶，檐口一道浅色女儿墙；首层整条灰色
        雨篷，雨篷上金色「22号宿舍楼」，雨篷下是亮着灯的玻璃门厅，两端防盗栅窗，
        门口停着几辆蓝色自行车。 */
(function () {
  PC_BUILDINGS.push({
    id: "13-d22",
    name: "22号宿舍楼",
    note: "7 层 · 灰混凝土 / 玻璃阳台格栅 / 金色楼名雨篷",
    spec: {
      /* ⚠️ w / roofT 是这条占位算出来的：CAMPUS 那一行占地 272×294，
         base 在 y=1993、北边 61px 处是学生活动中心门前那条路（1638..1699）。
         屋面再厚 10px 就会压到路上，所以 roofT 只给 28（照片本身就是平屋顶）。 */
      w: 280, floors: 7, roofT: 28, sign: false, seed: 1313,
      wall: "#b8b6b0", roof: "#cfcec9", glass: "#5b6b77", texture: "none",
      draw: function (B) {
        const g = B.g, x0 = B.x0, x1 = B.x1, w = B.w;
        const eaveY = B.eaveY, baseY = B.baseY, PADT = B.PADT, FH = PC.FLOOR_H;
        const CX = x0 + Math.round(w / 2);
        const C = {
          con: "#b8b6b0", conL: "#cbc9c3", conD: "#96948e", conDD: "#7c7a75",
          slab: "#c9c7c1", slabL: "#dedcd6", slabD: "#a3a19b",
          glass: "#5b6b77", glassL: "#8798a2", glassD: "#3f4d58",
          rail: "#3d4248", railL: "#5d646b",
          tower: "#b2b0aa", towerL: "#c6c4be", towerD: "#8b8984",
          canopy: "#9c9c98", canopyL: "#bcbcb8", canopyD: "#73736c",
          lobby: "#6d7d86", lobbyL: "#e6d8ac", door: "#33424c",
          gold: "#d9b45f", bike: "#3f6da8", bikeD: "#26456b"
        };
        /* ⚠️ 本文件在「预览页」里只靠 style.js 一个库，拿不到地图那份全局
           makeRng；自带一支同参数的局部随机流，绝不碰共享 RNG。 */
        let _s = 1322 >>> 0;
        const rng = function () { _s = (_s * 1664525 + 1013904223) >>> 0; return _s / 4294967296; };

        /* ---------- 1. 墙底 ---------- */
        B.px(x0, eaveY, w, B.wallH, C.con);
        B.px(x0, eaveY, w, 2, C.conL);

        /* ---------- 2. 左端通高服务塔楼 ---------- */
        const TW = 74, tx1 = x0 + TW;
        B.px(x0, eaveY - 6, TW, B.wallH + 6, C.tower);
        B.px(x0, eaveY - 6, 2, B.wallH + 6, C.towerL);
        B.px(tx1 - 3, eaveY - 6, 3, B.wallH + 6, C.towerD);
        B.px(x0, eaveY - 6, TW, 2, "#d8d6d0");               // 塔顶压顶
        B.px(x0, eaveY - 4, TW, 1, "rgba(60,62,64,0.18)");
        /* 塔身两道竖缝 + 每层一道横缝 */
        B.px(x0 + 24, eaveY, 1, B.wallH, "rgba(60,62,64,0.14)");
        B.px(x0 + 51, eaveY, 1, B.wallH, "rgba(60,62,64,0.14)");
        for (let f = 1; f < B.floors; f++)
          B.px(x0, eaveY + f * FH, TW, 1, "rgba(60,62,64,0.16)");
        /* 一列小方洞：每层一个，两个检修口错开 */
        for (let f = 0; f < B.floors; f++) {
          const vy = eaveY + f * FH + 12;
          if (vy + 5 > baseY - 4) continue;
          const vx = x0 + (f % 2 ? 40 : 32);
          B.px(vx, vy, 5, 5, "#4f5358");
          B.px(vx, vy, 5, 1, "#6e7277");
        }
        /* 塔楼首层：一扇灰钢门 + 一个防盗栅窗 */
        B.px(x0 + 12, baseY - 34, 26, 32, C.conDD);
        B.px(x0 + 14, baseY - 32, 22, 30, "#8f918d");
        B.px(x0 + 14, baseY - 32, 22, 2, "#a9aba7");
        B.px(x0 + 24, baseY - 22, 2, 6, "#5c5e5a");
        B.px(x0 + 46, baseY - 30, 24, 20, "#5a5d60");
        for (let x = x0 + 47; x < x0 + 70; x += 3) B.px(x, baseY - 30, 1, 20, "#b7b8b4");
        B.px(x0 + 45, baseY - 30, 26, 1, "#b7b8b4");

        /* ---------- 3. 右翼：连续玻璃阳台带（首层以上留两层给门厅） ---------- */
        const wx0 = tx1 + 3, wx1 = x1 - 2, ww = wx1 - wx0;
        const rows = B.floors - 2;                            // 5 排阳台
        const FINS = 6, finStep = Math.round(ww / FINS);
        for (let f = 0; f < rows; f++) {
          const fy = eaveY + f * FH;
          /* 梁 + 阳台开口 + 楼板 */
          B.px(wx0, fy, ww, 3, C.conL);
          B.px(wx0, fy + 3, ww, 1, "rgba(60,62,64,0.24)");
          const oy = fy + 4, oh = 20;
          B.px(wx0, oy, ww, oh, C.glassD);
          B.px(wx0, oy, ww, 3, C.glass);
          B.px(wx0, oy + 3, ww, 3, C.glassL);
          /* 玻璃竖向反光 */
          for (let x = wx0 + 6; x < wx1 - 4; x += 23) B.px(x, oy + 3, 1, 5, "rgba(255,255,255,0.22)");
          /* 晾晒：每层两三件，颜色与位置走局部随机流 */
          for (let k = 0; k < 3; k++) {
            if (rng() < 0.35) continue;
            const lx = wx0 + 8 + ((rng() * (ww - 22)) | 0);
            const ly = oy + 6 + ((rng() * 7) | 0);
            const pick = (rng() * 5) | 0;
            const col = pick === 0 ? "#e8e2d4" : pick === 1 ? "#c96a5e"
                      : pick === 2 ? "#7f9fc4" : pick === 3 ? "#b8b8b8" : "#d8c47e";
            B.px(lx, ly, 3, 5, col);
            B.px(lx, ly, 3, 1, "rgba(255,255,255,0.35)");
          }
          /* 格栅栏杆（压在开口下半）+ 扶手 */
          for (let x = wx0 + 2; x < wx1 - 1; x += 3) B.px(x, oy + 9, 1, 11, C.rail);
          B.px(wx0, oy + 8, ww, 2, C.railL);
          B.px(wx0, oy + 19, ww, 1, C.rail);
          /* 楼板（开口下沿，左右各探 1px 出挑） */
          B.px(wx0 - 1, oy + oh, ww + 2, 4, C.slab);
          B.px(wx0 - 1, oy + oh, ww + 2, 1, C.slabL);
          B.px(wx0 - 1, oy + oh + 4, ww + 2, 1, C.slabD);
          /* 竖向混凝土隔板 */
          for (let k = 0; k <= FINS; k++) {
            const fx = wx0 + k * finStep;
            const fw = k === FINS ? Math.min(3, wx1 - fx) : 3;
            if (fw <= 0) continue;
            B.px(fx, fy + 2, fw, oh + 4, C.con);
            B.px(fx, fy + 2, 1, oh + 4, C.conL);
            B.px(fx + fw - 1, fy + 2, 1, oh + 4, C.conD);
          }
        }

        /* ---------- 4. 首两层：雨篷 + 金色楼名 + 玻璃门厅 ---------- */
        const py = eaveY + rows * FH;                  // 216
        const cy = py + 4, ch = 18;                    // 雨篷 220..238
        B.px(wx0, py, ww, baseY - py, C.conD);         // 门厅段的深一档墙
        B.px(wx0, py, ww, 2, C.conL);
        /* 雨篷（比墙面探出 2px） */
        B.px(wx0 - 2, cy, ww + 4, ch, C.canopy);
        B.px(wx0 - 2, cy, ww + 4, 2, C.canopyL);
        B.px(wx0 - 2, cy + ch - 2, ww + 4, 2, C.canopyD);
        B.px(wx0 - 2, cy + ch, ww + 4, 1, "rgba(20,24,32,0.30)");
        B.goldText("22号宿舍楼", Math.round((wx0 + wx1) / 2), cy + 3, 12, C.gold);

        /* 门厅玻璃：中段整幅，左右各一段防盗栅窗 */
        const gy = cy + ch + 3, gh = baseY - gy - 5;
        const ex0 = Math.round(CX) - 52, ex1 = ex0 + 104;
        B.px(ex0 - 3, gy - 2, 110, gh + 4, "#43474c");
        B.px(ex0, gy, 104, gh, C.lobby);
        B.px(ex0, gy, 104, 3, "rgba(10,13,20,0.45)");
        for (let x = ex0 + 17; x < ex1; x += 18) B.px(x, gy, 1, gh, "#8b969c");
        B.px(ex0, gy + Math.round(gh * 0.55), 104, 1, "rgba(20,24,30,0.35)");
        /* 亮着的门厅灯（两团暖光） */
        B.px(ex0 + 14, gy + 8, 22, 12, C.lobbyL);
        B.px(ex0 + 14, gy + 8, 22, 2, "#f4ecd0");
        B.px(ex0 + 58, gy + 8, 22, 12, C.lobbyL);
        B.px(ex0 + 58, gy + 8, 22, 2, "#f4ecd0");
        B.px(ex0 + 46, gy, 12, gh, C.door);            // 中间双开门
        B.px(ex0 + 51, gy, 1, gh, "#7d8a92");
        B.px(ex0 + 40, baseY - 16, 2, 8, "#c9ccc8");   // 门把手
        /* 两端防盗栅窗 */
        const gw = 34;
        B.px(wx0 + 6, gy + 4, gw, gh - 6, "#4d5357");
        B.px(wx1 - gw - 6, gy + 4, gw, gh - 6, "#4d5357");
        for (let x = wx0 + 7; x < wx0 + 6 + gw; x += 4) B.px(x, gy + 4, 1, gh - 6, "#c2c4c0");
        for (let x = wx1 - gw - 5; x < wx1 - 6; x += 4) B.px(x, gy + 4, 1, gh - 6, "#c2c4c0");
        /* 墙裙 */
        B.px(x0, baseY - 6, w, 6, C.conDD);
        B.px(x0, baseY - 6, w, 1, "#8f8d88");

        /* ---------- 5. 外轮廓 ---------- */
        B.edges("#d2d0ca", "#74726d");
      },
      after: function (B) {
        /* 门前一排蓝色自行车（画在墙根外侧，跟 05 段的灌木同一支笔） */
        const y = B.baseY - 1, x0 = B.x0, x1 = B.x1;
        const bike = (cx) => {
          B.px(cx + 1, y - 5, 6, 1, "#b9bcbc");                 // 车架横梁
          B.px(cx + 1, y - 5, 1, 4, "#b9bcbc");
          B.px(cx + 6, y - 5, 1, 4, "#b9bcbc");
          B.px(cx, y - 4, 2, 3, "#3a3d40");                     // 后轮
          B.px(cx + 6, y - 4, 2, 3, "#3a3d40");                 // 前轮
          B.px(cx + 2, y - 7, 4, 2, "#3f6da8");                 // 车筐 / 车座
          B.px(cx + 2, y - 7, 4, 1, "#6a92c4");
          B.px(cx - 1, y - 2, 10, 1, "rgba(14,18,28,0.26)");    // 落地影
        };
        bike(x0 + 108);
        bike(x0 + 120);
        bike(x0 + 132);
        bike(x1 - 44);
        bike(x1 - 32);
        B.px(x0, B.baseY + 1, B.w, 2, "rgba(14,18,28,0.24)");
      }
    }
  });
})();
