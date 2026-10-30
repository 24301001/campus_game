/* 照片 → 形象完全在浏览器处理：定位脸、分区取色并拼装像素部件。
   认不出脸时会用默认脸框和可手动调整的配方。服务端只保存 look，不接收照片。 */
(() => {
  const fallback = {skin:'#f2c9a0',hairStyle:'short',hairColor:'#30251e',eye:'round',eyeColor:'#332a2b',cloth:'#c94954',clothAlt:'#f3eee7',clothPattern:'solid',pants:'#38516d',acc:'none',accColor:'#b67a56'};
  const oldFallback = {skin:'#e9bb92',hairStyle:'short',hairColor:'#241d1a',eye:'round',cloth:'#3f6ea8',pants:'#454c5a',acc:'none'};
  const cache = new Map();
  const hex = ([r,g,b]) => '#' + [r,g,b].map(x => Math.max(0,Math.min(255,Math.round(x))).toString(16).padStart(2,'0')).join('');
  const rgb = h => [1,3,5].map(i => parseInt(h.slice(i,i+2),16));
  const dist = (a,b) => Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2]);
  /* 提亮偏暖、压暗偏冷（地图 shade 同一条式子）：中性灰的加减在像素画里会让衣服发脏，
     高光往暖、阴影往冷才有体积感。 */
  const shade=(h,k)=>{const c=rgb(h);return hex(k>=0
    ? [c[0]+(255-c[0])*k, c[1]+(255-c[1])*k*0.93, c[2]+(255-c[2])*k*0.80]
    : [c[0]*(1+k*1.08), c[1]*(1+k), c[2]*(1+k*0.86)]);};
  const norm = value => {
    const v=value&&typeof value==='object'?value:{};
    const result={...fallback};
    for(const k of ['skin','hairColor','eyeColor','cloth','clothAlt','pants','accColor'])if(typeof v[k]==='string'&&/^#[0-9a-f]{6}$/i.test(v[k]))result[k]=v[k].toLowerCase();
    if(['short','mid','long','ponytail','bun','twintails'].includes(v.hairStyle))result.hairStyle=v.hairStyle;
    if(['round','narrow','dot'].includes(v.eye))result.eye=v.eye;
    if(['none','glasses','cap','scarf'].includes(v.acc))result.acc=v.acc;
    if(['solid','stripe'].includes(v.clothPattern))result.clothPattern=v.clothPattern;
    return result;
  };
  const isDefault = value => [fallback,oldFallback].some(v=>JSON.stringify(norm(value))===JSON.stringify(norm(v)));
  /* 骨架照搬地图自带的 buildChar（像素校园_全校地图.html 第 4710 行起）：4.3 头身 ——
     头 6 行（第 1..6 行）· 颈 1 行 · 躯干 9 行（8..16）· 腿 8 行（17..24）· 鞋 2 行（25..26），
     头宽 7 格（x6..12），眼睛各 1 格（x7 与 x11，关于脸中线 x9 镜像，和嘴 x8..x10 同轴），落地锚点 (9,27)，最后统一过一遍彩色自动描边。
     ⚠️ 以前这套 look 是自己一套 8 行大头 + 2×2 眼白的画法，玩家往街上一站就和地图上
        所有 NPC 不像同一种人（头大一号、眼大两号、还没有收边）—— 这是"形象很怪"的根因。
     ⚠️ 五官一律以 HY（会随走路起伏）为基准，不能用绝对行号，否则抬身那一帧脸会散。 */
  const GAIT = [
    { m: 1, fl: 2, spread: 1, bob: 0, sw: 0 },
    { m: 0, fl: 2, spread: 0, bob: 1, sw: 1 },
    { m: 2, fl: 1, spread: 1, bob: 0, sw: 1 },
    { m: 0, fl: 1, spread: 0, bob: 1, sw: 0 },
    { m: 0, fl: 0, spread: 0, bob: 0, sw: 0 },
    { m: 0, fl: 0, spread: 0, bob: 1, sw: 0 }
  ];
  /* 自动描边：不用纯黑（像素画里太硬显脏），取相邻实心像素的颜色压暗补 1px 收边 ——
     头发的边=更黑的头发、袖子的边=更深的蓝。和地图 outlineSprite 同一口径。 */
  function outlineSprite(c, k) {
    const g = c.getContext('2d'), W = c.width, H = c.height;
    const d = g.getImageData(0, 0, W, H).data;
    const src = (x, y) => (x >= 0 && y >= 0 && x < W && y < H && d[(y * W + x) * 4 + 3] > 40) ? (y * W + x) * 4 : -1;
    const NB = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    const edge = [];
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      if (d[(y * W + x) * 4 + 3] > 40) continue;
      for (let n = 0; n < 4; n++) { const j = src(x + NB[n][0], y + NB[n][1]); if (j >= 0) { edge.push(x, y, j); break } }
    }
    for (let i = 0; i < edge.length; i += 3) {
      const j = edge[i + 2];
      g.fillStyle = 'rgb(' + ((d[j] * k) | 0) + ',' + ((d[j + 1] * k) | 0) + ',' + ((d[j + 2] * k) | 0) + ')';
      g.fillRect(edge[i], edge[i + 1], 1, 1);
    }
  }
  /* 接地影：分几层由深到浅的像素椭圆叠在一起（地图 shadowBlob 同一口径），
     比一个实心椭圆柔和，也不会有抗锯齿的灰边。 */
  function shadowBlob(g, bx, by, rx, ry, alpha, layers) {
    const L = layers || 4, step = alpha / L;
    for (let i = L; i >= 1; i--) {
      const t = i / L, w = Math.max(1, Math.round(rx * t)), h = Math.max(1, Math.round(ry * t));
      g.fillStyle = 'rgba(14,18,28,' + step.toFixed(3) + ')';
      for (let y = -h; y <= h; y++) {
        const q = 1 - (y * y) / (h * h);
        if (q <= 0) continue;
        const dx = Math.floor(w * Math.sqrt(q));
        g.fillRect(Math.round(bx - dx), Math.round(by + y), dx * 2 + 1, 1);
      }
    }
  }
  function paint(look, dir, step, crouched, pose) {
    const v = norm(look), c = document.createElement('canvas'); c.width = 18; c.height = 30;
    const g = c.getContext('2d'); g.imageSmoothingEnabled = false;
    const side = dir === 'left' || dir === 'right', back = dir === 'up', flip = dir === 'right';
    const C = {
      skin: v.skin, skinL: shade(v.skin, .14), skinD: shade(v.skin, -.20),
      hair: v.hairColor, hairL: shade(v.hairColor, .22), hairD: shade(v.hairColor, -.34),
      coat: v.cloth, coatL: shade(v.cloth, .20), coatD: shade(v.cloth, -.26),
      pant: v.pants, pantL: shade(v.pants, .18), pantD: shade(v.pants, -.23),
      shoe: '#26282e', shoeL: '#454a54', eye: v.eyeColor,
      pack: '#b4552f', packL: '#d1704a', packD: '#8a3f22',   // 与地图 A2 同款书包：进图后 silhouette 才对得上
      tie: shade(v.cloth, .30)
    };
    function px(x, y, w, h, col) { if (w > 0 && h > 0) { g.fillStyle = col; g.fillRect(flip ? 18 - x - w : x, y, w, h) } }
    function pxr(x, y, w, h, col) { if (w > 0 && h > 0) { g.fillStyle = col; g.fillRect(x, y, w, h) } }
    const cx = 9, HW = 7, H2 = 3, HH = 6, FACE = 4, SHOE_TOP = 25;
    const F = crouched ? { m: 0, fl: 0, spread: 0, bob: 0, sw: 0 } : (GAIT[step] || GAIT[4]);
    // Walking is carried by feet and arms. Moving the whole head by one source
    // pixel becomes a three-pixel jolt in close view and shakes the name tag.
    const b = step < 4 ? 0 : F.bob;
    const TOP = crouched ? 10 : 1, TORSO = crouched ? 4 : 9;
    const HY = TOP + b, ty = TOP + HH + 1 + b, ly = TOP + HH + 1 + TORSO + b;
    const KNEE = crouched ? 23 : 21, ARMR = crouched ? 4 : 6;
    const EY = HY + 4; // Leave a full forehead row between the fringe and the upper eye pixel.

    /* ---------- 躯干：肩宽 9 → 腰宽 7 → 衣摆压实腰线（逐格照搬 buildChar 的 torso） ---------- */
    function torsoFront() {
      px(cx - 4, ty, 9, 1, C.coatL);                               // 肩顶受光
      const chest = Math.max(2, TORSO - 3);
      px(cx - 4, ty + 1, 9, chest, C.coat);                        // 胸
      px(cx - 3, ty + 1 + chest, 7, TORSO - 1 - chest, C.coat);    // 腰（左右各收 1px）
      px(cx - 4, ty + 1, 2, TORSO - 1, C.coatL);                   // 左侧受光面
      px(cx + 3, ty + 1, 1, TORSO - 1, C.coatD);                   // 右侧背光面
      px(cx - 4, ty + chest, 9, 1, 'rgba(0,0,0,0.13)');            // 胸腰分界
      px(cx - 3, ty + TORSO - 1, 7, 1, C.coatD);                   // 衣摆
      if (back) {
        px(cx - 3, ty + 1, 7, TORSO - 4, C.pack);                  // 书包
        px(cx - 3, ty + 1, 7, 1, C.packL);
        px(cx + 2, ty + 1, 1, TORSO - 4, C.packD);
        px(cx - 2, ty - 1, 5, 1, 'rgba(0,0,0,0.26)');              // 背带压肩
      } else {
        if (!crouched) {
          px(cx - 2, ty + 1, 2, 1, C.coatL);                  // collar catches the light
          px(cx + 1, ty + 1, 2, 1, C.coatL);
          px(cx - 1, ty + 2, 1, 1, C.skinD);                  // a narrow V at the neckline
        }
        px(cx, ty + 1, 1, TORSO - 2, C.coatD);                     // 前襟
        if (!crouched) px(cx - 2, ty + chest + 2, 4, 1, C.coatD);  // 口袋线（蹲姿躯干只有 4 行，画不下）
      }
      if (v.clothPattern === 'stripe' && !back) for (let r = ty + 2; r < ty + TORSO - 1; r += 3) { px(cx - 4, r, 9, 1, v.clothAlt); px(cx - 6, r + 1, 2, 1, v.clothAlt); px(cx + 5, r + 1, 2, 1, v.clothAlt) }
    }
    function armsFront() {
      const aL = ty + 1 + F.sw, aR = ty + 1 + ((step === 4 || crouched) ? 0 : (F.sw ? 0 : 1));
      px(cx - 6, aL, 2, ARMR, back ? C.coat : C.coatL); px(cx - 6, aL + ((ARMR / 2) | 0), 1, 1, C.coatD);
      px(cx - 6, aL + ARMR, 2, 2, C.skin);
      px(cx + 5, aR, 2, ARMR, C.coatD); px(cx + 6, aR + ((ARMR / 2) | 0), 1, 1, C.hairD);
      px(cx + 5, aR + ARMR, 2, 2, C.skinD);
    }
    function legsFront() {
      function one(x, shx, edge, edgeCol, up) {
        const knee = KNEE - up, bot = SHOE_TOP - up;
        /* 大腿定长到 KNEE-1，小腿从 knee 起严丝合缝（照 buildChar.legs）：
           若把大腿缩短 1px 让小腿上移，会在 KNEE-1 留一条 1px 空洞，描边把它填成一圈深色，
           肉眼看是腿中段断了一格。 */
        px(x, ly, 3, KNEE - ly, C.pant); px(x + edge, ly, 1, KNEE - ly, edgeCol);
        px(x, ly, 3, 1, 'rgba(0,0,0,0.18)');
        px(x, knee, 3, bot - knee, C.pant); px(x, knee, 3, 1, shade(C.pant, -.20));
        px(shx, bot, 4, 2, C.shoe); px(shx, bot, 4, 1, C.shoeL);   // 鞋比腿宽 1px：脚是横的
      }
      const d = F.spread ? 1 : 0;
      one(cx - 3 - d, cx - 4 - d, 0, C.pantL, F.fl === 1 ? 1 : 0);
      one(cx + 1 + d, cx + 1 + d, 2, C.pantD, F.fl === 2 ? 1 : 0);
    }
    /* ---------- 侧视：厚度 6px，前臂摆到身前，两条腿靠横向错位表达迈步 ---------- */
    function bodySide() {
      px(cx - 3, ty, 6, 1, C.coatL); px(cx - 3, ty + 1, 6, TORSO - 1, C.coat);
      if (!crouched) px(cx - 3, ty + 1, 2, 1, C.coatL);          // side collar
      px(cx - 3, ty + 1, 1, TORSO - 1, C.coatL); px(cx + 2, ty + 1, 1, TORSO - 1, C.coatD);
      px(cx - 3, ty + TORSO - 1, 6, 1, C.coatD);
      px(cx + 1, ty + 1, 3, TORSO - 3, C.pack);                    // 书包露在背后
      px(cx + 3, ty + 1, 1, TORSO - 3, C.packD);
      px(cx + 1, ty + 1, 3, 1, C.packL);
      if (v.clothPattern === 'stripe') for (let r = ty + 2; r < ty + TORSO - 1; r += 3) px(cx - 3, r, 6, 1, v.clothAlt);
      const ao = crouched ? (pose === 'pet' || pose === 'feed' ? -1 : 0) : F.sw * 2;
      px(cx - 4, ty + 2 + ao, 2, ARMR, C.coatL); px(cx - 4, ty + 2 + ao + ARMR, 2, 2, C.skin);
    }
    function legsSide() {
      // One foot plants while the other passes one pixel above the ground.
      // The old passing frames drew both legs and both shoes on the same
      // columns, which looked like a rigid figure sliding across the map.
      function leg(upper, lower, shoe, raised, light) {
        const foot = SHOE_TOP - (raised ? 1 : 0);
        px(upper, ly, 3, KNEE - ly, C.pant);
        px(upper + (light ? 0 : 2), ly, 1, KNEE - ly, light ? C.pantL : C.pantD);
        px(lower, KNEE, 3, foot - KNEE, C.pant);
        px(lower, KNEE, 3, 1, C.pantD); // articulated knee
        px(shoe, foot, 4, 2, C.shoe);
        px(shoe, foot, 4, 1, C.shoeL);
      }
      const phase = crouched ? 4 : step;
      if (phase === 0) { leg(cx, cx + 1, cx + 1, false, false); leg(cx - 2, cx - 3, cx - 4, false, true); }
      else if (phase === 1) { leg(cx, cx + 1, cx, true, false); leg(cx - 2, cx - 2, cx - 3, false, true); }
      else if (phase === 2) { leg(cx - 2, cx - 3, cx - 4, false, false); leg(cx, cx + 1, cx + 1, false, true); }
      else if (phase === 3) { leg(cx - 2, cx - 3, cx - 4, true, false); leg(cx, cx, cx, false, true); }
      else { leg(cx - 2, cx - 2, cx - 3, false, true); leg(cx, cx, cx, false, false); }
    }

    /* ---------- 头与五官（骨架逐格照搬 buildChar 的 head / sideBody） ----------
       ⚠️ 脸的可用列是 x6..x12（共 7 列，中线 **x9**），嘴 x8..x10、下颌 x7..x11 都以 x9 对称。
          地图权威画法（buildChar.head，像素校园_全校地图.html 第 4758 行）两眼落在 x7、x10，
          中线其实是 8.5 ⇒ 眼睛整排比嘴往左偏半格，18×30 放大 6 倍就是 3 屏幕像素的歪，
          看着就是"嘴和眼睛对不上"。这一版把右眼挪到 x11，两眼 {x7}{x11} 真正关于 x9 镜像，
          地图那两处正脸（4759 / 5006）同步改，玩家和 NPC 仍逐格一致。
          三档眼型只在"往哪个方向多占一格"上做文章：
            豆豆眼  1 列 × 1 行（x7、x11 @ EY）
            圆眼    1 列 × 2 行（往**上**长一行到 EY-1，两格同色）⇒ 竖着大一圈
            细眼    2 列 × 1 行（{x7,x8} 与 {x10,x11} @ EY，全瞳孔实色，往**内**扩一格）
       ⚠️ 侧视只有靠近镜头这一只眼（x7）：细眼朝后拖成 2 格实线，圆眼往上长一行（EY-1）。
       ⚠️ 圆眼的上排画在配饰**之后**（eyesTop）：眼镜上沿正好压在 EY-1 这一行，
          先画眼睛会被镜框整条抹掉，三档又退回两种。 */
    const EYE_CORE = [cx - 2, cx + 2];   // 正面两眼（x7、x11：关于脸中线 x9 镜像，与嘴同轴）
    /* 圆眼上排那一格画**瞳孔同色**（整只眼 = 1 列 × 2 行实心）。
       ⚠️ 试过点一格 55% 白做"眼神光"：18×30 上读起来是眼睛顶上顶了颗白点 = 眉毛/反光，
          而且眼镜上沿（中性灰）和它亮度几乎一样，一戴眼镜圆眼就糊回豆豆眼。
          圆眼靠**高度**赢，不靠高光。 */
    function eyesFront() {
      if (v.eye === 'dot') { px(EYE_CORE[0], EY, 1, 1, C.eye); px(EYE_CORE[1], EY, 1, 1, C.eye); return }
      if (v.eye === 'narrow') {
        /* 整条 2 列 × 1 行**全用瞳孔实色**：左眼从 x7 往里长到 x8，右眼从 x11 往里长到 x10，
           两半仍关于 x9 镜像（中间只剩 x9 一列鼻梁，眼镜那格正好压在下面）。
           ⚠️ 试过把朝外那一格压成 mix(瞳孔,肤色,45%) 做"眼尾渐隐"：18×30 上那格既不象
              瞳孔也不象皮肤，读起来是眼角蹭了块灰 ⇒ 整张脸显脏。细眼靠**宽度**赢，不靠渐隐。 */
        px(EYE_CORE[0], EY, 2, 1, C.eye); px(EYE_CORE[1] - 1, EY, 2, 1, C.eye);
        return
      }
      px(EYE_CORE[0], EY, 1, 1, C.eye); px(EYE_CORE[1], EY, 1, 1, C.eye)   // 圆眼瞳孔：与豆豆眼同两列
    }
    function eyesTop() {
      if (v.eye !== 'round' || back) return
      if (side) { px(cx - 2, EY - 1, 1, 1, C.eye); return }
      px(EYE_CORE[0], EY - 1, 1, 1, C.eye); px(EYE_CORE[1], EY - 1, 1, 1, C.eye)
    }
    function headFront() {
      px(cx - H2 + 1, HY, HW - 2, 1, C.hairL);                 // 发顶受光（顶光层）
      px(cx - H2, HY + 1, HW, 1, C.hair);
      px(cx - H2, HY + 2, HW, FACE, C.skin);                   // 脸
      px(cx - H2, HY + 2, 1, FACE, C.skinL);                   // 左颊受光（光自左上）
      px(cx + H2, HY + 2, 1, FACE, C.skinD);                   // 右颊背光
      eyesFront();
      eyesTop();
      px(cx - H2, EY + 1, 1, 1, shade(C.skin, -.08));            // warm cheek shadows
      px(cx + H2, EY + 1, 1, 1, shade(C.skin, -.08));
      px(cx - 1, HY + FACE + 1, 3, 1, shade(C.skinD, -.28)); // Mouth stays below every eye style.
      px(cx - H2 + 1, HY + FACE + 2, HW - 2, 1, C.skinD);
    }
    function headBack() {
      px(cx - H2 + 1, HY, HW - 2, 1, C.hairL);
      px(cx - H2, HY + 1, HW, 1, C.hair);
      px(cx - H2, HY + 2, HW, HH - 1, C.hair);                 // 后脑整片是发
      px(cx - H2, HY + 1, 1, HH - 1, C.hairL);
      px(cx + H2, HY + 1, 1, HH - 1, C.hairD);
      px(cx - 1, HY + 2, 2, 1, shade(C.hair, .2));             // 发旋小高光（不是横贯亮带）
    }
    function headSide() {
      px(cx - H2 + 1, HY, HW - 2, 1, C.hairL);
      px(cx - H2, HY + 1, HW, 1, C.hair);
      px(cx - H2, HY + 2, HW, HH - 2, C.skin);
      px(cx + 1, HY + 2, 3, HH - 1, C.hair);                   // 后脑
      px(cx + H2, HY + 2, 1, HH - 1, C.hairD);
      px(cx - H2, HY + 2, H2 + 1, 1, C.hair);                  // 刘海压额（额头有台阶）
      /* 侧视只有靠近镜头这一只眼（x7）：细眼朝**后**拖成 2 格实线，与正面同款；
         圆眼那一行高的差别在 eyesTop() 里补（要压在刘海/镜框之上才看得见）。 */
      if (v.eye === 'narrow') px(cx - 2, EY, 2, 1, C.eye);
      else { px(cx - 2, EY, 1, 1, C.eye); eyesTop() }
      px(cx - H2, EY - 1, 1, 1, C.skinL);                      // 额头受光
      px(cx - H2, EY + 1, 1, 1, C.skinL);                      // 鼻尖受光（侧脸第二个台阶）
      px(cx - H2, HY + FACE + 1, 2, 1, C.skinD);              // 下巴
    }
    /* ⚠️ 顺序不能反：先头/躯干再腿，腿压在躯干下沿（反过来衣摆会盖住大腿根）。 */
    if (side) { headSide(); bodySide(); legsSide(); }
    else if (back) { headBack(); torsoFront(); armsFront(); legsFront(); }
    else { headFront(); torsoFront(); armsFront(); legsFront(); }
    /* ---------- 发型：全部用地图长发钩子那一套工艺 ----------
       长发/中发＝贴在 x = cx±(H2+1) 这两列（正好是躯干最外两列）的细发帘，发梢两行压暗 ⇒
       它会自然压在肩头上，这就是"垂到肩"的样子，不用另算肩线。
       ⚠️ 四段发型都必须画在描边之前，否则这些 1px 细列拿不到彩色收边，3× 下像两片浮在肩上的色块。
       ⚠️ 侧视只画**后脑那一侧**（画的是朝左的人，后脑恒在 x 较大的一侧）；前面再挂一条
          会盖住五官，那不叫长发，那叫头发糊脸。 */
    function curtain(len) {
      for (let i = 0; i < len; i++) {
        const col = i < len - 2 ? C.hair : C.hairD;
        px(cx + H2 + 1, HY + 2 + i, 1, 1, col);
        if (!side) px(cx - H2 - 1, HY + 2 + i, 1, 1, shade(col, .1));
      }
    }
    if (v.hairStyle === 'mid') curtain(5);
    if (v.hairStyle === 'long') curtain(HH + 3);
    if (v.hairStyle === 'ponytail') {
      /* 马尾扎在脑后 ⇒ 三个视图说的是同一件事：**束根在头顶正中，尾巴往后垂**。
         正面只有束根那一小截 + 脑袋两侧各露 2 格尾巴边（旧代码正面画在 x13，读起来是侧马尾）。 */
      if (side) {
        px(cx + H2 - 1, HY + 2, 2, 1, C.tie);                   // 扎带（耳后）
        px(cx + H2, HY + 3, 1, 7, C.hairD);                     // 靠脑袋那列压暗：尾巴要和后脑分开
        px(cx + H2 + 1, HY + 3, 1, 7, C.hair);
        px(cx + H2, HY + 9, 2, 1, C.hairD);                     // 发梢
      } else if (back) {
        px(cx - 2, HY + 2, 5, 1, C.tie);                        // 扎带横压在后脑发上
        px(cx - 1, HY + 3, 3, 8, C.hair);
        px(cx - 2, HY + 3, 1, 8, C.hairD); px(cx + 2, HY + 3, 1, 8, C.hairD);
        px(cx - 1, HY + 9, 3, 2, C.hairD);
      } else {
        px(cx - 1, HY, 3, 1, C.tie);                            // 束根（头顶正中）
        px(cx - H2 - 1, HY + 3, 1, 2, C.hairD); px(cx + H2 + 1, HY + 3, 1, 2, C.hairD);
      }
    }
    if (v.hairStyle === 'bun') {
      /* 丸子头：头顶之外只剩 1 行可堆，光往上堆会读成"一顶扁帽子"。
         所以丸子**压在发顶两行上**（球的下半嵌进脑袋），靠自动描边给出圆轮廓，
         再用一道扎带把球和发顶切开，球才"站"在头上。 */
      const w = side ? 4 : 5, x0 = side ? cx - 1 : cx - 2;
      px(x0, HY - 1, w, 2, C.hair);
      px(x0, HY - 1, w - 1, 1, C.hairL);                        // 顶部受光
      px(x0 + w - 1, HY - 1, 1, 2, C.hairD);                    // 背光侧
      px(x0, HY + 1, w, 1, C.tie);                              // 扎带
    }
    if (v.hairStyle === 'twintails') {
      /* 双马尾：两束各 2 列宽，扎在耳下（第 HY+3 行）往下垂，压在袖子上方。
         贴头那列用主色、外侧那列压暗，两束才不会和脑袋糊成一片（连成一片就成头盔）。 */
      const LN = 8, top = HY + 3;
      const one = (outer, inner) => {
        px(inner, top, 1, LN, C.hair);
        px(outer, top, 1, LN, C.hairD);
        px(inner, top + LN - 2, 1, 2, C.hairD);
        px(inner, top, 1, 1, C.tie);
      };
      if (side) one(cx + H2 + 1, cx + H2);
      else { one(cx - H2 - 2, cx - H2 - 1); one(cx + H2 + 2, cx + H2 + 1) }
    }
    /* ---------- 配饰：眼镜的几何直接取地图 C.glasses 那段（算法哥同款） ----------
       只画「上沿 + 左右外框 + 鼻梁」，**两眼那两格留空** ⇒ 眼睛从镜片后面透出来。
       18×30 上脸只有 4 行高，试过实心 3×3 镜框：一盖上去整张脸糊成一条黑带。
       ⚠️ 眼线行必须复用 EY 这同一个式子，不能写绝对行号 —— 否则走路抬身那一帧眼镜会脱开脸往上飘。
       ⚠️ 背向不画（后脑勺上凭空一副眼镜），并且一律画在描边之前，镜框才拿得到彩色收边。 */
    if (v.acc === 'glasses' && !back) {
      const frame = v.accColor, GE = EY;
      if (side) {
        px(cx - H2, GE - 1, 3, 1, frame);                       // 上沿（短，只罩得住那一只眼）
        px(cx - H2, GE, 1, 1, frame);                            // 外框
        px(cx, GE - 1, 3, 1, frame);                             // 镜腿：横过太阳穴压在后脑发上
      } else {
        /* 镜框左右两柱必须关于脸中线 x9 真镜像：左柱在 x6（脸的左边缘），右柱就得在 x12
           （脸的右边缘）。以前右柱写成 x11，一是左右不对称，二是正好盖住细眼朝外那一格，
           戴眼镜的细眼脸整排糊成一条黑带。上沿同理铺满 x6..x12，跟两柱接上。 */
        px(cx - H2, GE - 1, HW, 1, frame);                        // 上沿 x6..x12
        px(cx - H2, GE, 1, 1, frame);                              // 左外框 x6
        px(cx, GE, 1, 1, frame);                                   // 鼻梁：圆眼时两眼之间只剩这一格
        px(cx + H2, GE, 1, 1, frame);                              // 右外框 x12
         px(cx - 2, GE + 1, 1, 1, frame); px(cx + 2, GE + 1, 1, 1, frame); // 两侧下沿，不压住嘴
      }
      eyesTop();                    // 圆眼的上排补在镜框之上，否则三档退回两档
    }
    if (v.acc === 'cap') {
      /* 帽檐落在发际线那一行（HY+1），**不占额头行 HY+2**：一来帽子上沿本来就该压在头发
         和皮肤的分界处，二来圆眼的眼上排正是 HY+2 —— 檐压上去三档又退回两档。 */
      px(cx - H2, HY - 1, HW, 1, shade(v.accColor, .16));        // 帽顶受光
      px(cx - H2, HY, HW, 1, v.accColor);                        // 帽身盖住发顶
      if (side) px(cx - H2 - 2, HY + 1, H2 + 3, 1, shade(v.accColor, -.22));   // 帽檐朝前
      else if (!back) px(cx - H2, HY + 1, HW, 1, shade(v.accColor, -.22));     // 正面：檐压在发际线
      else px(cx - H2 + 1, HY + 1, HW - 2, 1, shade(v.accColor, -.22));        // 背面：只剩帽底边
    }
    if (v.acc === 'scarf') {
      px(cx - 4, ty - 1, 9, 1, v.accColor);                      // 绕颈一圈（压在颈行上）
      px(cx - 4, ty, 9, 1, shade(v.accColor, -.18));             // 搭在肩上那排
      if (back) px(cx - 2, ty + 1, 4, 2, v.accColor);            // 背面：巾尾搭在背上
      else px(cx + 1, ty + 1, 2, 3, shade(v.accColor, -.26));    // 正/侧面：垂下来的巾角
    }
    /* --- 后处理：彩色描边 → 接地影（唯一一条出口，顺序不能反）---
       ⚠️ 描边必须先把变换复位；接地影必须在描边之后，否则影子会被描一圈边。
          影子的几何是地图上量出来的：足迹落在 x6..16 / y27..29 内，不会被画布硬切。 */
    outlineSprite(c, .45);
    shadowBlob(g, flip ? cx - 1 : cx, 28, 5, 2, .46, 3);
    return c;
  }
  function sprite(look,dir='down',step=4) {
    const v=norm(look), k=JSON.stringify(v)+'|'+dir+'|'+step;
    if (!cache.has(k)) {if(cache.size>768)cache.clear();cache.set(k,paint(v,dir,step,false,''))}
    return cache.get(k);
  }
  function crouch(look,dir='down',pose='pet',frame=0) {
    const v=norm(look), k=JSON.stringify(v)+'|c|'+dir+'|'+pose+'|'+frame;
    if (!cache.has(k)) {if(cache.size>768)cache.clear();cache.set(k,paint(v,dir,frame,true,pose))}
    return cache.get(k);
  }
  function avatar(look) {
    const c=document.createElement('canvas');c.width=c.height=24;
    const g=c.getContext('2d');g.imageSmoothingEnabled=false;
    g.drawImage(sprite(look,'down',4),3,0,12,12,0,0,24,24);
    return c;
  }
  function portrait(look) {
    const c=document.createElement('canvas');c.width=c.height=96;
    const g=c.getContext('2d');g.imageSmoothingEnabled=false;
    g.fillStyle='#1b2630';g.fillRect(0,0,96,96);
    g.fillStyle='#304b50';g.fillRect(5,5,86,86);
    g.fillStyle='#88c8ad';g.fillRect(9,9,78,78);
    g.fillStyle='#496c5f';g.fillRect(9,70,78,17);
    g.drawImage(sprite(look,'down',4),0,0,18,28,21,4,54,84);
    g.fillStyle='#e9d9a5';g.fillRect(4,4,88,2);g.fillRect(4,90,88,2);
    g.fillRect(4,4,2,88);g.fillRect(90,4,2,88);
    return c;
  }
  function sample(data,x1,y1,x2,y2,filter) {
    const out=[];
    for(let y=Math.max(0,Math.floor(y1*128));y<Math.min(128,Math.floor(y2*128));y+=2)
      for(let x=Math.max(0,Math.floor(x1*128));x<Math.min(128,Math.floor(x2*128));x+=2) {
        const i=(y*128+x)*4, col=[data[i],data[i+1],data[i+2]];
        if (!filter || filter(col)) out.push(col);
      }
    if (!out.length) return null;
    const mid=a=>a.sort((a,b)=>a-b)[a.length>>1];
    return [0,1,2].map(i=>mid(out.map(c=>c[i])));
  }
  /* [QODER-FIX #4] 取“最常见颜色”而不是中位数：照片里的背景/阴影会把中位数拉灰，
     分桶投票后再平均，衣服、头发、裤子都更接近照片主色。 */
  function dominant(list, fallbackColor) {
    if (!list || !list.length) return fallbackColor;
    const bins=new Map();
    for(const c of list){
      const key=(c[0]>>4)+','+(c[1]>>4)+','+(c[2]>>4);
      const bin=bins.get(key)||{n:0,s:[0,0,0]};
      bin.n++;bin.s[0]+=c[0];bin.s[1]+=c[1];bin.s[2]+=c[2];bins.set(key,bin);
    }
    let best=null;for(const bin of bins.values())if(!best||bin.n>best.n)best=bin;
    return hex(best.s.map(v=>v/best.n));
  }
  /* [QODER-FIX #4-v2] 用连通域找脸：只有成片、位于画面中上部、宽高比例像脸的肤色块才算脸。
     老算法按“行投影”分组，背景里的土路、树干、墙面颜色接近肤色时会被连成一大块，
     导致脸框变成 90×70，后面的头发/衣服全采到背景上。 */
  function locateFace(data,skinTest){
    const W=128,seen=new Uint8Array(W*W),queue=new Int32Array(W*W);
    const isSkin=(x,y)=>{const i=(y*W+x)*4;return skinTest([data[i],data[i+1],data[i+2]])};
    let best=null;
    const comps=[];
    for(let sy=8;sy<100;sy++)for(let sx=10;sx<118;sx++){
      const start=sy*W+sx;
      if(seen[start]||!isSkin(sx,sy))continue;
      let head=0,tail=0;queue[tail++]=start;seen[start]=1;
      let n=0,minX=sx,maxX=sx,minY=sy,maxY=sy;
      while(head<tail){
        const cur=queue[head++],x=cur%W,y=(cur/W)|0;n++;
        if(x<minX)minX=x;if(x>maxX)maxX=x;if(y<minY)minY=y;if(y>maxY)maxY=y;
        for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){
          const nx=x+dx,ny=y+dy;
          if(nx<10||nx>117||ny<8||ny>99)continue;
          const ni=ny*W+nx;
          if(seen[ni]||!isSkin(nx,ny))continue;
          seen[ni]=1;queue[tail++]=ni;
        }
      }
      if(n<60)continue;
      const cw=maxX-minX+1,ch=maxY-minY+1;
      comps.push({x:minX,y:minY,w:cw,h:ch,n});
      if(n<150)continue;
      const w=cw,h=ch;
      if(w<18||h<18||w>72||h>88||h/w<0.62||h/w>2.1)continue;
      const cx=(minX+maxX)/2,cy=(minY+maxY)/2;
      if(cy>88)continue;
      const score=n*(1-.55*Math.abs(cx-64)/64)*(1-.55*Math.max(0,cy-62)/62);
      if(!best||score>best.score)best={x:minX,y:minY,w,h,score};
    }
    /* 眼镜/刘海会把脸切成上下两块，把正上方宽度相近的肤色块并回脸框，
       否则脸框只剩下半张，后面的眼镜检测和头发采样都会错位。 */
    if(best)for(const c of comps){
      const overlap=Math.min(best.x+best.w,c.x+c.w)-Math.max(best.x,c.x);
      const gap=best.y-(c.y+c.h);
      if(overlap<Math.min(best.w,c.w)*.5)continue;
      if(gap<-4||gap>10)continue;
      if(c.w<best.w*.5||c.w>best.w*2||c.n<80)continue;
      best={x:Math.min(best.x,c.x),y:Math.min(best.y,c.y),score:best.score,
        w:Math.max(best.x+best.w,c.x+c.w)-Math.min(best.x,c.x),
        h:Math.max(best.y+best.h,c.y+c.h)-Math.min(best.y,c.y)};
    }
    return best?{x:best.x,y:best.y,w:best.w,h:best.h}:null;
  }
  /* [QODER-FIX #4-v2] 上衣：取下巴正下方、身体中段的像素，排除肤色和头发后做主色投票；
     两个色团都占 28% 以上且色差明显时才判成条纹，避免阴影被误判成条纹。 */
  function shirtFromPhoto(data,face,skinTest,hairRgb){
    const luma=c=>c[0]*.21+c[1]*.72+c[2]*.07;
    const x1=Math.max(0,Math.floor(face.x+face.w*.05)),x2=Math.min(128,Math.ceil(face.x+face.w*.95));
    const y1=Math.min(126,Math.floor(face.y+face.h*.96)),y2=Math.min(128,Math.ceil(Math.max(y1+14,face.y+face.h*1.5)));
    if(x2-x1<6||y2-y1<4)return {cloth:fallback.cloth,clothAlt:fallback.clothAlt,clothPattern:'solid'};
    const colors=[];
    for(let y=y1;y<y2;y+=2)for(let x=x1;x<x2;x+=2){
      const i=(y*128+x)*4,col=[data[i],data[i+1],data[i+2]];
      if(skinTest(col))continue;
      if(y<face.y+face.h+3&&luma(col)<150&&dist(col,hairRgb)<52)continue;
      if(luma(col)>242)continue;
      colors.push(col);
    }
    if(colors.length<12)return {cloth:fallback.cloth,clothAlt:fallback.clothAlt,clothPattern:'solid'};
    const avg=list=>[0,1,2].map(i=>list.reduce((s,c)=>s+c[i],0)/list.length);
    const sorted=[...colors].sort((a,b)=>luma(a)-luma(b));
    let lo=sorted[Math.floor(sorted.length*.25)],hi=sorted[Math.floor(sorted.length*.75)];
    for(let k=0;k<4;k++){
      const g1=[],g2=[];
      for(const c of colors)(dist(c,lo)<dist(c,hi)?g1:g2).push(c);
      if(!g1.length||!g2.length)break;
      lo=avg(g1);hi=avg(g2);
    }
    const g1=[],g2=[];
    for(const c of colors)(dist(c,lo)<dist(c,hi)?g1:g2).push(c);
    if(g1.length>=colors.length*.28&&g2.length>=colors.length*.28&&dist(lo,hi)>58){
      const main=g1.length>=g2.length?lo:hi, alt=g1.length>=g2.length?hi:lo;
      return {cloth:hex(main),clothAlt:hex(alt),clothPattern:'stripe'};
    }
    /* 照片里的衣服有一半落在阴影里，直接取主色会偏暗；取偏亮的那一半做投票，
       像素小人上的衣服才接近肉眼看到的颜色（深色衣服仍然是深色）。 */
    const byLuma=[...colors].sort((a,b)=>luma(a)-luma(b));
    const lit=byLuma.slice(Math.floor(byLuma.length*.55),Math.floor(byLuma.length*.92));
    return {cloth:dominant(lit.length>=8?lit:colors,hex(rgb(fallback.cloth))),clothAlt:fallback.clothAlt,clothPattern:'solid'};
  }
  /* [QODER-FIX #4/#14] 从照片下半身取裤子的主色；只有真的采到有饱和度的像素才用，
     否则保留默认色，避免把背景墙或上衣下摆误当裤子。 */
  function pantsFromPhoto(data,face,skinTest){
    const x1=Math.max(0,Math.floor(face.x-face.w*.55)),x2=Math.min(128,Math.ceil(face.x+face.w*1.55));
    const y1=Math.min(126,Math.floor(face.y+face.h*2.0));
    if(128-y1<6)return rgb(fallback.pants);
    const colors=[];
    for(let y=y1;y<128;y+=2)for(let x=x1;x<x2;x+=2){
      const i=(y*128+x)*4,col=[data[i],data[i+1],data[i+2]];
      const value=col[0]*.21+col[1]*.72+col[2]*.07;
      if(!skinTest(col)&&value<215&&Math.max(...col)-Math.min(...col)>14)colors.push(col);
    }
    if(colors.length<12)return rgb(fallback.pants);
    return rgb(dominant(colors,hex(rgb(fallback.pants))));
  }
  async function fromPhoto(file) {
    if (!file || !file.type.startsWith('image/')) throw Error('请选择照片文件');
    if (file.size > 10 * 1024 * 1024) throw Error('照片不能超过 10 MB');
    const bitmap=await createImageBitmap(file), c=document.createElement('canvas');c.width=c.height=128;
    const g=c.getContext('2d',{willReadFrequently:true});
    // Fit portrait photos instead of cutting away their hair and clothing.
    const scale=Math.min(128/bitmap.width,128/bitmap.height);
    const dw=Math.round(bitmap.width*scale),dh=Math.round(bitmap.height*scale);
    g.fillStyle='#ececf0';g.fillRect(0,0,128,128);
    g.drawImage(bitmap,0,0,bitmap.width,bitmap.height,(128-dw)/2,(128-dh)/2,dw,dh);bitmap.close?.();
    const data=g.getImageData(0,0,128,128).data;
    const skinTest=([r,gr,b])=>r>50 && gr>38 && b>26 && r/gr>1.04 && r/gr<1.85 && gr/b>.85 && gr/b<1.8 && r-b>8;
    const luma=c=>c[0]*.21+c[1]*.72+c[2]*.07;
    const face=locateFace(data,skinTest)||{x:46,y:40,w:36,h:43};
    const region=(x1,y1,x2,y2,filter)=>sample(data,x1/128,y1/128,x2/128,y2/128,filter);
    const skin=region(face.x+face.w*.22,face.y+face.h*.38,face.x+face.w*.78,face.y+face.h*.76,skinTest)||rgb(fallback.skin);
    /* [QODER-FIX #4-v2] 头发只从“额头正上方窄带 + 两颊外侧”取像素，并要求：
       不是肤色、不是画布留白、亮度不太高、不是绿色背景。再投票取主色。
       旧版取“脸上方一大片”，树林/墙面常被当成头发（曾出现橄榄绿头发）。 */
    const hairPixels=[];
    const pushHair=(x0,y0,x1,y1,top=false)=>{
      for(let y=Math.max(0,Math.floor(y0));y<Math.min(128,Math.floor(y1));y+=2)
        for(let x=Math.max(0,Math.floor(x0));x<Math.min(128,Math.floor(x1));x+=2){
          const i=(y*128+x)*4,col=[data[i],data[i+1],data[i+2]];
          if(dist(col,skin)<35||(!top&&skinTest(col)))continue;
          const l=luma(col),chroma=Math.max(...col)-Math.min(...col);
          if(l>205)continue;
          if(col[0]>225&&col[1]>225&&col[2]>225)continue;
          if(col[1]>col[0]*1.18&&col[1]>col[2]*1.25)continue;
          if(!top&&chroma>80)continue;
          hairPixels.push(col);
        }
    };
    pushHair(face.x+face.w*.05,face.y-face.h*.20,face.x+face.w*.95,face.y+face.h*.10,true);
    pushHair(face.x-face.w*.18,face.y+face.h*.10,face.x+face.w*.02,face.y+face.h*.95);
    pushHair(face.x+face.w*.98,face.y+face.h*.10,face.x+face.w*1.18,face.y+face.h*.95);
    /* 只取偏暗的一半投票：浅色墙面/树叶再亮也可能混进来，头发本体通常在这条暗带里。 */
    const darkHair=hairPixels.slice().sort((a,b)=>luma(a)-luma(b)).slice(0,Math.max(8,Math.ceil(hairPixels.length*.55)));
    const hairHex=dominant(darkHair.length?darkHair:hairPixels,hex(rgb(fallback.hairColor)));
    const hairRgb=rgb(hairHex);
    const share=(a,b)=>{
      let match=0,total=0;
      for(let y=Math.max(0,Math.floor(face.y+face.h*.55));y<Math.min(128,Math.floor(face.y+face.h*.87));y+=2)
        for(let x=Math.max(0,Math.floor(a));x<Math.min(128,Math.floor(b));x+=2){
          const i=(y*128+x)*4,col=[data[i],data[i+1],data[i+2]];total++;
          if(!skinTest(col)&&luma(col)<200&&dist(col,hairRgb)<58)match++;
        }
      return total?match/total:0;
    };
    const left=share(face.x+face.w*.05,face.x+face.w*.30);
    const right=share(face.x+face.w*.70,face.x+face.w*.95);
    let hairStyle=left>.08&&right>.08?'long':((left>.02&&right<left*.45)||(right>.02&&left<right*.45))?'ponytail':Math.max(left,right)>.02?'mid':'short';
    /* [QODER-FIX #4-v3] 不再凭“明暗起伏”猜卷发：128px 下头发高光/阴影的起伏
       比真实卷度更明显，容易把普通短发判成卷发；照片只区分短/中/长/马尾。 */
    const shirt=shirtFromPhoto(data,face,skinTest,hairRgb);
    let pantsRgb=pantsFromPhoto(data,face,skinTest);
    if(dist(pantsRgb,rgb(shirt.cloth))<38)pantsRgb=rgb(fallback.pants);
    // Two matching dark lens bands across the eye area; use both halves so hair on
    // one side does not turn into a false eyeglass frame.
    let glassesRows=0;
    for(let y=Math.floor(face.y+face.h*.25);y<Math.floor(face.y+face.h*.60);y++){
      const density=(a,b)=>{let dark=0,total=0;for(let x=Math.floor(face.x+face.w*a);x<Math.ceil(face.x+face.w*b);x++){
        const i=(y*128+x)*4;if(i<0||i+2>=data.length)continue;
        total++;if(luma([data[i],data[i+1],data[i+2]])<125)dark++;
      }return total?dark/total:0};
      if(density(.16,.46)>.20&&density(.54,.84)>.20)glassesRows++;
    }
    // The photo's shaded cheek is too gray at 18 pixels; warm the sampled tone for the sprite.
    const paintedSkin=[skin[0]+35,skin[1]+22,skin[2]+5];
    return {...fallback,skin:hex(paintedSkin),hairColor:hairHex,...shirt,pants:hex(pantsRgb),hairStyle,acc:glassesRows>=2?'glasses':'none',accColor:glassesRows>=2?'#777a83':fallback.accColor};
  }
  window.MPLook={fallback,norm,isDefault,sprite,crouch,avatar,portrait,fromPhoto};
})();
