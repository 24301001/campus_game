/* =========================================================
   5. 角色：四向 × 六相位（重画版，A 档：头 6px / 4.3 头身）
   ---------------------------------------------------------
   ⚠️ 对外契约（**只有 step 的取值域变了**，别的与 demo §5 逐字相同）：
        CH_W / CH_H / CH_AX / CH_AY           四个常量（值不变）
        makeChar(dir, step) -> canvas         step 0..3 行走四帧 / 4..5 待机两帧
        charSprite(dir, step)                 按 dir+step 缓存（键自动扩到 6 个相位）
      唯一的调用点是主循环里的 drawList.push({... charSprite(player.dir, player.step) ...})，
      锚点仍是 ax = CH_AX / ay = CH_AY，所以"脚踩在世界坐标 y 上"这件事没变。

   与上一版的差别（这一步新做的三件事）：
      A) **2 帧 → 4 帧行走**。原来 `& 1` 只有两个姿势，一个周期里身体只起伏一次，
         看着像"整块人在弹"。现在走的是教科书四帧：接触（跨开）→ 通过（并立抬身）
         → 接触（镜像）→ 通过（并立抬身）。
      B) **待机呼吸帧**。站着不动时不再是死定格：2 帧、约 0.4 Hz，吸气时上身抬 1px。
      C) **步态由"实际位移"驱动**（改在主循环补丁 11，不在本文件）：原来 `walk += dt`
         顶着墙走也照常累加 → 人会原地踏步；现在顶墙位移为 0，脚立刻停。
         步频也不再是硬编码的 `* 7`，而是每 WALK_STRIDE 世界像素走完一个周期。

   为什么重画（对着 demo §5 逐条数出来的五个问题，前四个是代码/肉眼，第五个是实测）：
     1) 头身比 3.4（头 8px / 全身 27px）—— Q 版娃娃。
     2) 结构是"一摞方块"：躯干 = 一个 10×8 矩形，手臂/腿都是直条 ——
        没有肩斜、肘、膝、腰。
     3) 全画面只有它没有 1px 深色收边（楼有棱线、树有暗底叶簇、灌木有背光球）
        → 剪影在草地/路面上发虚。
     4) 明暗只有左右二分（左亮右暗），没有顶光、没有遮蔽（下巴/腋下/胯下）。
     5) 【实测】朝右的精灵**接地影方向是反的**：demo 的 flipH() 用 translate+scale
        画完后不 restore，变换留在返回画布的 context 上，末尾的 ellipsePx 影子
        被又镜像了一次。实测影子重心相对身体重心的偏移：
            现版 down +1.5 / left +1.0 / right **−1.0** / up +1.5
        树、楼、灌木的影子全朝右下，只有"朝右的角色"逆着光。本版修了，四向一律 +1.5。

   ⚠️ 头身比的取舍：真人 7.5 头身，但 30px 画布里头一缩小，脸就没了。
      540 个像素撑不起写实，只能撑起"可读的真人剪影 + 真实的重心与节拍"。
      这里取头 6px（4.3 头身）：脸留 4 行（眼/鼻/嘴/下颌），成年人骨架成立。
      （头 8px 的 3.4 头身版本试过，脸会挤成一团络腮胡，且与现版同比例、没解决问题。）
   ========================================================= */
const CH_W = 18, CH_H = 30, CH_AX = 9, CH_AY = 27;

/* --- 步态相位表 ---------------------------------------------------------
   4 帧行走 + 2 帧待机，一个周期 = 左右各一步。
   ⚠️ 两个视角要**分别**给参数，不能共用一个"腿相位"：
      侧面看不到左右，只能看前后 → m（1 左腿跨在前 / 2 右腿跨在前 / 0 并立）；
      正背面看不到前后，只能看左右 → fl（抬哪条腿：0 并立 / 1 抬左 / 2 抬右）+ spread（两腿分不分）。
   踩过坑：两帧都用"并立"来当通过帧，正背面看这两帧的腿就一模一样，4 帧白给一帧
   （只有手臂不同，远看就是同一张）。所以抬腿相位在两个通过帧里**交替**，
   接触帧也各抬一条（在后的那条腿离镜头更远，画高 1px）。
   bob 骨盆起伏（只抬腰以上，脚不离地）；sw 手臂摆相。 */
const WALK_FRAMES = 4, IDLE_BASE = 4, IDLE_FRAMES = 2;
const GAIT = [
  { m: 1, fl: 2, spread: 1, bob: 0, sw: 0 },   // 0 接触：两腿分开、左腿在前（右腿远，抬 1px）
  { m: 0, fl: 2, spread: 0, bob: 1, sw: 1 },   // 1 通过：并立抬身、右腿抬起经过
  { m: 2, fl: 1, spread: 1, bob: 0, sw: 1 },   // 2 接触：两腿分开、右腿在前（左腿远，抬 1px）
  { m: 0, fl: 1, spread: 0, bob: 1, sw: 0 },   // 3 通过：并立抬身、左腿抬起经过
  { m: 0, fl: 0, spread: 0, bob: 0, sw: 0 },   // 4 待机：呼气
  { m: 0, fl: 0, spread: 0, bob: 1, sw: 0 }    // 5 待机：吸气（上身抬 1px）
];
/* 一个完整步态周期走过的世界像素。1× 档速度 200 px/s → 200/160 = 1.25 周期/秒
   = 2.5 步/秒（真人 1.8~2.0，游戏里略快是合适的）。3× 档世界速度减半，步频跟着慢下来。
   ⚠️ 两个数都必须在这里声明：主循环补丁 11 要用，而主循环段排在角色段之后。 */
const WALK_STRIDE = 160;
const IDLE_HZ = 0.4;                   // 待机呼吸约 2.5 秒一个来回

const A2 = {
  skin:  "#e9bb92", skinD: "#c4906a", skinL: "#f7d3ae",
  hair:  "#241d1a", hairL: "#3d3029", hairD: "#150f10",
  coat:  "#3f6ea8", coatD: "#2b4d76", coatL: "#5d8cc4",
  pant:  "#454c5a", pantD: "#2b303a", pantL: "#5c6474",   // 比现版提亮：描边(k=0.45)才读得出来
  shoe:  "#26282e", shoeL: "#454a54",
  pack:  "#b4552f", packD: "#8a3f22", packL: "#d1704a"
};

/* --- 自动描边：给精灵四周的透明像素补 1px 收边 ---------------------------
   ⚠️ 不用"纯黑描边"（像素画里太硬、显脏），而是**取相邻实心像素的颜色压暗**
   —— 这叫彩色描边：头发的边 = 更黑的头发、袖子的边 = 更深的蓝。剪影立刻清楚。
   一次调用可给任何精灵加收边；给树/灌木加是同一行代码。
   ⚠️ 必须画在接地影**之前**，否则影子会被描一圈边。
   ⚠️⚠️ 必须先把变换复位成单位阵 —— flipH() 用 translate+scale 画完后**不 restore**，
   返回的画布 context 上永久留着 translate(W,0) scale(-1,1)。
   往这种画布上 fillRect(x,y,1,1) 会落到 W-1-x：描边跑到另一侧、原侧留空 1px，
   镜像方向的精灵会多出"空格 + 外挂 1px"的鬼影（实测：右侧 24 个内部空洞，
   左侧 0 个）。下面这行是必须的，不是防御性代码。 */
function outlineSprite(c, k) {
  const g = c.getContext("2d"), W = c.width, H = c.height;
  g.setTransform(1, 0, 0, 1, 0, 0);
  const d = g.getImageData(0, 0, W, H).data;
  const src = (x, y) => (x >= 0 && y >= 0 && x < W && y < H && d[(y * W + x) * 4 + 3] > 40)
    ? (y * W + x) * 4 : -1;
  const NB = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  const edge = [];
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (d[(y * W + x) * 4 + 3] > 40) continue;
      for (let n = 0; n < 4; n++) {                 // 四邻即可：八邻会让四角鼓 1px
        const j = src(x + NB[n][0], y + NB[n][1]);
        if (j >= 0) { edge.push(x, y, j); break; }
      }
    }
  }
  for (let i = 0; i < edge.length; i += 3) {
    const j = edge[i + 2];
    g.fillStyle = "rgb(" + ((d[j] * k) | 0) + "," + ((d[j + 1] * k) | 0) + "," + ((d[j + 2] * k) | 0) + ")";
    g.fillRect(edge[i], edge[i + 1], 1, 1);
  }
}

/* =========================================================
   参数化构建：HH = 头高（含发）。整个骨架由它推出来，改一处不散架。
   ---------------------------------------------------------
   纵向预算（画布 18×30，脚底线 gy = CH_AY = 27）：
     y1 .. y1+HH-1   头
     y1+HH           颈（1 行）
     y1+HH+1         肩/躯干起
     躯干 + 腿 平分剩下的行数（真人的肩-胯 ≈ 胯-脚底），鞋固定占 y25-26
   bob 只抬"腰以上"：走路的真实构造是**骨盆起伏、脚不离地**。
   现版是两帧整体平移（bob 直接加在全体），所以看着像"整块画在跳"。
   ========================================================= */
function buildChar(HH, PAL) {
  /* 配色表：默认 `A2`（玩家）。第二个参数是**换装入口** —— 向导 · 小北 走这条：
     同一套骨架、同一套步态、同一组相位表，只换颜色。
     ⚠️ 传 undefined 时 `C === A2`，产出与加这个参数之前**逐字节相同**，
        所以 `buildChar(6)` 那一行（玩家）一个字没动。
     ⚠️ 函数体里**一个 `A2.` 都不许留** —— 留一个就会让 NPC 身上出现一块玩家色。 */
  const C = PAL || A2;
  const TOP = 1, SHOE_TOP = 25, cx = CH_AX, gy = CH_AY;
  const NECK = TOP + HH, TOR = NECK + 1;
  const bodyRows = SHOE_TOP - TOR;
  const TORSO = Math.max(6, Math.round(bodyRows / 2));
  const LEGT = TOR + TORSO, LEGR = SHOE_TOP - LEGT;          // 腿的行数（不含鞋）
  const KNEE = LEGT + Math.max(2, Math.round(LEGR * 0.55));
  const HW = HH >= 7 ? 8 : 7;                                // 头宽
  const H2 = (HW - 1) >> 1;                                  // 头左右各伸出的像素数
  const ARMR = Math.max(4, TORSO - 3);
  const FACE = HH - 2;                                       // 脸的行数

  return function (dir, step) {
    const c = mkCanvas(CH_W, CH_H), g = c.getContext("2d");
    const P = (x, y, w, h, col) => { if (w > 0 && h > 0) px(g, x, y, w, h, col); };
    const F = GAIT[step] || GAIT[0];                         // 相位：0..3 行走 / 4..5 待机
    const b = F.bob;                                         // 骨盆起伏 1px
    const HY = TOP + b;                                      // 头顶（腰以上整体上移）
    const ty = TOR + b, ly = LEGT + b;                       // 躯干起 / 髋

    /* ---------- 头 ---------- */
    function head(face) {
      P(cx - H2 + 1, HY, HW - 2, 1, C.hairL);               // 发顶受光（顶光层）
      P(cx - H2, HY + 1, HW, 1, C.hair);
      if (!face) {                                           // 背向：后脑 + 左棱受光
        P(cx - H2, HY + 2, HW, HH - 2, C.hair);
        P(cx - H2, HY + 1, 1, HH - 1, C.hairL);
        P(cx + H2, HY + 1, 1, HH - 1, C.hairD);
        P(cx - 1, HY + 2, 2, 1, shade(C.hair, 0.20));       // 发旋小高光（不是横贯亮带）
        return;
      }
      P(cx - H2, HY + 2, HW, FACE, C.skin);                 // 脸
      P(cx - H2, HY + 2, 1, FACE, C.skinL);                 // 左颊受光（光自左上）
      P(cx + H2, HY + 2, 1, FACE, C.skinD);                 // 右颊背光
      /* ⚠️ 五官一律以 HY（会随 bob 起伏）为基准，**不能用 TOP 绝对行号**：
         b=1 时脸整体下移 1px，五官若留在原地就顶到刘海线上、嘴跑到眼睛下格，
         整张脸糊成一条黑带（sprite.py 的"头块刚性"探针会实测出来）。 */
      const EY = HY + 2 + (FACE >= 5 ? 2 : 1);               // 眼睛所在行
      P(cx - 2, EY, 1, 1, C.hairD);                         // 左眼
      P(cx + 1, EY, 1, 1, C.hairD);                         // 右眼（间距 2px）
      if (FACE >= 5) P(cx, EY + 1, 1, 1, C.skinD);          // 鼻影（脸够高才放得下）
      P(cx - 1, HY + FACE, 3, 1, shade(C.skinD, -0.28));    // 嘴（脸的倒数第二行）
      P(cx - H2 + 1, HY + FACE + 1, HW - 2, 1, C.skinD);    // 下颌收边（脸的最后一行）
    }
    /* ---------- 躯干（胸宽 9 → 腰宽 7 → 衣摆） ---------- */
    function torso(back) {
      P(cx - 4, ty, 9, 1, C.coatL);                         // 肩顶受光
      const chest = Math.max(2, TORSO - 3);
      P(cx - 4, ty + 1, 9, chest, C.coat);                  // 胸
      P(cx - 3, ty + 1 + chest, 7, TORSO - 1 - chest, C.coat);   // 腰（左右各收 1px）
      P(cx - 4, ty + 1, 2, TORSO - 1, C.coatL);             // 左侧受光面
      P(cx + 3, ty + 1, 1, TORSO - 1, C.coatD);             // 右侧背光面
      P(cx - 4, ty + chest, 9, 1, "rgba(0,0,0,0.13)");       // 胸腰分界
      P(cx - 3, ty + TORSO - 1, 7, 1, C.coatD);             // 衣摆（压实腰线，与裤头对齐）
      if (back) {
        P(cx - 3, ty + 1, 7, TORSO - 4, C.pack);            // 书包
        P(cx - 3, ty + 1, 7, 1, C.packL);
        P(cx + 2, ty + 1, 1, TORSO - 4, C.packD);
        P(cx - 2, ty - 1, 5, 1, "rgba(0,0,0,0.26)");         // 背带压肩
      } else {
        P(cx, ty + 1, 1, TORSO - 2, C.coatD);               // 前襟
        P(cx - 2, ty + chest + 2, 4, 1, C.coatD);           // 口袋线
      }
    }
    /* ---------- 手臂（2px，肘内收 1px），左右反相摆动 ---------- */
    function arms(sw, back) {
      const aL = ty + 1 + sw, aR = ty + 1 + (sw ? 0 : 1);
      P(cx - 6, aL, 2, ARMR, back ? C.coat : C.coatL);     // 左臂（受光侧）
      P(cx - 6, aL + ((ARMR / 2) | 0), 1, 1, C.coatD);      // 肘
      P(cx - 6, aL + ARMR, 2, 2, C.skin);                   // 左手
      P(cx + 5, aR, 2, ARMR, C.coatD);                      // 右臂（背光侧）
      P(cx + 6, aR + ((ARMR / 2) | 0), 1, 1, C.hairD);      // 肘
      P(cx + 5, aR + ARMR, 2, 2, C.skinD);                  // 右手
    }
    /* ---------- 腿（大腿 → 膝 → 小腿 → 鞋）----------
       fl: 0 并立 / 1 抬左腿 / 2 抬右腿。抬腿 = 小腿与鞋整体上移 1px（在后的那条腿离镜头更远）。
       spread: 接触帧两腿各外移 1px —— 正背面看"迈步"只能靠这个（前后是看不出来的）。
       ⚠️ 小腿的**起点必须跟着上移到 knee**。老写法是"大腿缩短 1px、小腿仍从 KNEE 起"，
          会在 KNEE-1 行留一条 1px 空洞 —— 描边会把这个洞填成一圈深色，肉眼看是腿中段断了一格。
          现在大腿定长、小腿从 knee 起严丝合缝，膝线**显式画**出来（不再靠缝隙让描边去填）。 */
    function legs(fl, spread) {
      function one(x, shx, edge, edgeCol, up) {
        const knee = KNEE - up, bot = SHOE_TOP - up;
        P(x, ly, 3, KNEE - ly, C.pant);                 // 大腿（定长，到 KNEE-1）
        P(x + edge, ly, 1, KNEE - ly, edgeCol);          // 受光 / 背光边
        P(x, ly, 3, 1, "rgba(0,0,0,0.18)");              // 胯下遮蔽
        P(x, knee, 3, bot - knee, C.pant);              // 小腿
        P(x, knee, 3, 1, shade(C.pant, -0.20));         // 膝线
        P(shx, bot, 4, 2, C.shoe);                      // 鞋（比腿宽 1px：脚是横的）
        P(shx, bot, 4, 1, C.shoeL);
      }
      const d = spread ? 1 : 0;
      one(cx - 3 - d, cx - 4 - d, 0, C.pantL, fl === 1 ? 1 : 0);   // 左腿（受光侧，亮边在左）
      one(cx + 1 + d, cx + 1 + d, 2, C.pantD, fl === 2 ? 1 : 0);   // 右腿（背光侧，暗边在右）
    }
    /* ---------- 侧视：额头-鼻-下巴的台阶 + 迈步的前后腿交叉 ----------
       mode: 0 并立 / 1 左腿跨在前 / 2 右腿跨在前。侧面看不到左右，只有"前后"：
       跨步靠**两条腿的横向错位**表达（前腿短 1px 显得更远、后腿长 1px 是蹬地踩实），
       所以 mode 1/2 的差别不是几何而是**亮暗边换边**——哪条腿在前，亮边就跟到哪条腿上。
       并立帧（mode 0）两腿重叠在同一列，这时由 sw 决定亮边露在哪一侧：
       1 帧与 3 帧的**像素差别就只有这个**（不然两帧完全相同，4 帧白给一帧）。 */
    function side(mode, sw) {
      const s = mode === 0 ? 2 : 0;                      // 2 = 两腿并到同一列
      const fx = cx - 3 + s, bx = cx + 1 - s;
      const fl = mode === 1 || (mode === 0 && !sw);       // 跨在前的是不是左腿
      const th = KNEE - ly;
      P(fx, ly, 3, th, C.pant);                         // 前腿（迈向前）
      P(fx + (fl ? 0 : 2), ly, 1, th, fl ? C.pantL : C.pantD);
      P(fx, KNEE, 3, SHOE_TOP - KNEE, C.pant);
      P(fx - 1, SHOE_TOP, 4, 2, C.shoe);                // 前脚（脚尖朝行进方向）
      P(fx - 1, SHOE_TOP, 4, 1, C.shoeL);
      P(bx, ly, 3, th + 1, C.pant);                     // 后腿（蹬地，长 1px）
      P(bx + (fl ? 2 : 0), ly, 1, th + 1, fl ? C.pantD : C.pantL);
      P(bx, KNEE + 1, 3, SHOE_TOP - KNEE - 1, C.pant);
      P(bx, SHOE_TOP, 4, 2, C.shoe);                    // 后脚
      P(bx, SHOE_TOP, 4, 1, C.shoeL);
    }
    /* ---------- 侧视的头与躯干（与相位无关，抽出来只为让 side() 读起来是"人"不是"色块"） ---------- */
    function sideBody(sw) {
      P(cx - H2 + 1, HY, HW - 2, 1, C.hairL);
      P(cx - H2, HY + 1, HW, 1, C.hair);
      P(cx - H2, HY + 2, HW, HH - 2, C.skin);
      P(cx + 1, HY + 2, 3, HH - 2, C.hair);                 // 后脑
      P(cx + H2, HY + 2, 1, HH - 2, C.hairD);
      P(cx - H2, HY + 2, H2 + 1, 1, C.hair);                // 刘海压额（额头有台阶）
      const EY = HY + 2 + (FACE >= 5 ? 2 : 1);               // 同正面：五官必须跟着 HY 走
      P(cx - 2, EY, 1, 1, C.hairD);                         // 眼
      P(cx - H2, EY - 1, 1, 1, C.skinL);                    // 额头受光
      P(cx - H2, EY + 1, 1, 1, C.skinL);                    // 鼻尖受光（侧脸第二个台阶）
      P(cx - H2, HY + FACE, 2, 1, C.skinD);                 // 下巴
      P(cx - 3, ty, 6, 1, C.coatL);                         // 肩顶
      P(cx - 3, ty + 1, 6, TORSO - 1, C.coat);              // 侧视厚度 6px（正/背面 9px）
      P(cx - 3, ty + 1, 1, TORSO - 1, C.coatL);             // 胸前受光
      P(cx + 2, ty + 1, 1, TORSO - 1, C.coatD);             // 后背背光
      P(cx - 3, ty + TORSO - 1, 6, 1, C.coatD);             // 衣摆
      P(cx + 1, ty + 1, 3, TORSO - 3, C.pack);              // 书包（侧视露在背后）
      P(cx + 3, ty + 1, 1, TORSO - 3, C.packD);
      P(cx + 1, ty + 1, 3, 1, C.packL);
      /* ⚠️ 侧视摆臂**故意摆 2px**（正/背面只有 1px）：侧视的"通过帧"在几何上近乎对称，
         两帧只能靠亮暗边换边 + 手臂位置区分，摆 1px 时两帧差异只有 ~20 像素、几乎看不出。
         侧视里手臂是唯一能大幅表达节奏的部位，摆大一点整个步态才读得出来。 */
      const ao = sw ? 2 : 0;
      P(cx - 4, ty + 2 + ao, 2, ARMR, C.coatL);             // 前臂摆到身前
      P(cx - 4, ty + 2 + ao + ARMR, 2, 2, C.skin);          // 手
    }

    if (dir === "up")        { head(false); torso(true);  arms(F.sw, true);  legs(F.fl, F.spread); }
    else if (dir === "down") { head(true);  torso(false); arms(F.sw, false); legs(F.fl, F.spread); }
    /* ⚠️ 顺序不能反：先头/躯干再腿，腿压在躯干上沿 —— 反过来衣摆会盖住大腿根。 */
    else                     { sideBody(F.sw); side(F.m, F.sw); }

    /* ---------- 长发（可选钩子，`C.longHair`）----------
       侧视只画**后脑那一侧**：side() 画的是朝左的人（后脑恒在 x 较大的一侧），
       前面再挂一条会盖在脸上 —— 那不是长发，那是头发糊住了五官。
       ⚠️ 必须画在**描边之前**，否则这两条不会得到彩色收边，3× 下像两片浮在肩上的色块。
       ⚠️ 落在 x = cx±(H2+1) 即躯干的最外两列上，所以它会自然压在肩上 ——
          这正是"垂到肩头"的样子，不用另外算肩线。 */
    if (C.longHair) {
      const LN = HH + 3;                                   // 发梢落到肩线下方 3px
      for (let i = 0; i < LN; i++) {
        const col = i < LN - 2 ? C.hair : C.hairD;         // 发梢两行压暗
        P(cx + H2 + 1, HY + 2 + i, 1, 1, col);             // 后脑侧（四向都有）
        if (dir === "up" || dir === "down")                // 正 / 背面才补前面那一条
          P(cx - H2 - 1, HY + 2 + i, 1, 1, shade(col, 0.10));
      }
    }

    /* ---------- 眼镜（可选钩子，`C.glasses`，第四十轮）----------
       给「算法哥」用。⚠️ `undefined` 时**一个像素都不画** ⇒ 玩家（`A2`）与小北
       （`GUIDE_PAL`）的产出与本轮之前**逐字节相同**（`buildChar` 头顶那条契约）。
       ⚠️ 必须画在**描边之前**（与上面的 `C.longHair` 同一条规矩）—— 否则镜框得不到
          彩色收边，3× 下像两片浮在脸上的色块。
       ⚠️ 背向（`dir === "up"`）**不画** —— 否则后脑勺上会凭空多出一副眼镜。
       ⚠️ 眼睛行必须复用 `head()` / `sideBody()` 那**同一个式子** —— 见上面 `:158-160`
          的警告：五官一律以 `HY`（会随 bob 起伏）为基准，**不能用 TOP 绝对行号**，
          否则 b=1 那一帧眼镜会脱开脸往上飘 1px。
       画法：只画「上沿 + 左右外框 + 鼻梁」，**两眼那两格留空** —— 留空处就是镜片，
       眼睛从镜片后面透出来。这是 18×30 这种尺寸下唯一读得出来的眼镜画法
       （试过实心 3×3 镜框：脸只有 4 行高，实心框一盖，整张脸糊成一条黑带）。 */
    if (C.glasses) {
      const GE = HY + 2 + (FACE >= 5 ? 2 : 1);             // = head() 里的 EY，同一个式子
      if (dir === "down") {
        P(cx - H2, GE - 1, HW - 1, 1, C.glasses);          // 上沿：x6..x11，右侧留 1px 脸的边
        P(cx - H2, GE,     1, 1, C.glasses);               // 左外框
        P(cx - 1,  GE,     2, 1, C.glasses);               // 鼻梁（x8..x9，正好夹在两眼中间）
        P(cx + 2,  GE,     1, 1, C.glasses);               // 右外框
      } else if (dir !== "up") {                           // left / right：侧脸只有一只眼
        P(cx - H2, GE - 1, 3, 1, C.glasses);               // 上沿（短，只罩得住那一只）
        P(cx - H2, GE,     1, 1, C.glasses);               // 外框
        P(cx,      GE - 1, 3, 1, C.glasses);               // 镜腿：横过太阳穴压在后脑发上
      }
    }

    /* --- 后处理：镜像 → 描边 → 接地影（唯一一条出口）---
       ⚠️ 镜像后必须复位变换（flipH 的 translate+scale 留在 context 上），
       否则描边和接地影都会被**再镜像一次** —— 影子跑到左下（demo 现版朝右精灵就中招）。 */
    let out = c;
    if (dir === "right") { out = flipH(c); out.getContext("2d").setTransform(1, 0, 0, 1, 0, 0); }
    outlineSprite(out, 0.45);
    /* 接地影：朝右下（与树/楼/灌木同向，偏移 +1.5）。
       ⚠️ 必须在描边之后画 —— 否则影子会被描一圈边。
       ⚠️ 几何是量出来的，不是拍的：足迹必须落在 x6..16 / y27..29 内。
          试过 (cx+3, rx=8)，会铺到 x4..20 —— 右端被画布硬切，
          y29 在最右列留下一排 α54 的实心影子（肉眼是一条竖刀口）。 */
    shadowBlob(out.getContext("2d"), cx + 2, gy + 1, 5, 2, 0.46, 3);
    return out;
  };
}
const makeChar = buildChar(6);       // A 档：头 6px（4.3 头身）

/* 缓存键就是 dir + step。step 从布尔扩到 0..5 之后键自动变成 6 个相位，
   四向 × 6 = 24 张，仍是一次性烘焙（每张 18×30，总共不到 13 KB）。 */
const _chars = Object.create(null);
function charSprite(dir, step) {
  const k = dir + step;
  if (!_chars[k]) _chars[k] = makeChar(dir, step);
  return _chars[k];
}

/* =========================================================
   蹲姿（猫宠交互 · 第四十四轮）—— 「蹲下来摸猫 / 蹲下来放猫粮」
   ---------------------------------------------------------
   ⚠️ 为什么另起一个工厂、不去改 `buildChar`：
      `buildChar(6)` 是**玩家**的入口，而同一个工厂还供着向导 / 算法哥 /
      学霸姐（各自传自己的调色板）。蹲姿要动的是**纵向骨架** —— 站姿那套
      `TOP=1 / SHOE_TOP=25 / 躯干与腿平分` 撑不住蹲下的折腿与压低。塞进去
      就会连坐三个 NPC 的产出，而头顶那条契约写死了 `buildChar(6)` 一个字不动。
      所以照 `buildCat`（`75_cat_char.js`）另起一个工厂，只共用工艺链。

   ⚠️ 翻转约定**照人物、不照猫**：本文件画的是**朝左**的侧视，**只有 `right`
      去 flipH**。（`75_cat_char.js` 正好相反 —— 它画朝右、`left` 翻转。
      照猫抄 ⇒ 人一蹲下就左右镜像。）

   ⚠️ 画布与锚点必须与站姿**逐字相同**（`CH_W/CH_H/CH_AX/CH_AY`）：绘制是
      `drawImage(img, x - ax, y - ay)`，锚点就是"脚踩的那一点"。不一致的话
      人一蹲就"跳"一下，两个姿势接不上。

   纵向预算（蹲 = 髋压低、腿折起来；站姿那套撑不住）：
     鞋 y25..y26 · 脚点 gy = CH_AY = 27        ← 与站姿一致，脚不动
     小腿 y23..y24 · 折腿/髋 y21..y22
     躯干 y17..y20（站姿 9 行 → 蹲姿 4 行）
     头   y10..y15（站姿 y1..y6）
   ⇒ 头顶低 9px、总高 26 → 17 行，这就是肉眼读得出来的"蹲下去"。
   ========================================================= */
const CU_HH = 6;                          // 头高：与 makeChar 同一个 4.3 头身
const CU_HW = CU_HH >= 7 ? 8 : 7;         // = 7（照 buildChar 里同一条式子）
const CU_H2 = (CU_HW - 1) >> 1;           // = 3
const CU_FACE = CU_HH - 2;                // = 4
const CU_TOP = 10;                        // 蹲姿头顶（站姿 1）
const CU_SHOE = 25;                       // 鞋顶（与站姿 SHOE_TOP 同值）
const CU_TOR = CU_TOP + CU_HH + 1;        // = 17 躯干起（中间 1 行颈）
const CU_TORSO = 4;                       // 蹲姿躯干 4 行（站姿 9 行）
const CU_HIP = CU_TOR + CU_TORSO;         // = 21 折腿/髋的顶行

/* 姿势 → 帧数（同 `CAT_ACTS` 的口径，主循环补丁按它取模） */
const CU_POSES = { pet: 2, feed: 2 };

function buildCrouch(PAL) {
  const C = PAL || A2;
  const cx = CH_AX, gy = CH_AY;
  const TOP = CU_TOP, TOR = CU_TOR, TORSO = CU_TORSO, HIP = CU_HIP, SHOE = CU_SHOE;
  const H2 = CU_H2, HW = CU_HW, FACE = CU_FACE, HH = CU_HH;

  return function (dir, pose, frame) {
    const c = mkCanvas(CH_W, CH_H), g = c.getContext("2d");
    const P = (x, y, w, h, col) => { if (w > 0 && h > 0) px(g, x, y, w, h, col); };
    const fd = CU_POSES[pose] || 2;
    frame = ((frame | 0) % fd + fd) % fd;
    const reach = frame & 1;                       // 0 手收着 / 1 手伸出去
    const low = (pose === "feed") ? 1 : 0;         // 喂食：手再低 1px（把粮放到地上）

    /* ---------- 头（五官式子与站姿同一套，只是基准行从 TOP=1 挪到 10） ---------- */
    function head(face) {
      P(cx - H2 + 1, TOP, HW - 2, 1, C.hairL);
      P(cx - H2, TOP + 1, HW, 1, C.hair);
      if (!face) {                                          // 背向：后脑
        P(cx - H2, TOP + 2, HW, HH - 2, C.hair);
        P(cx - H2, TOP + 1, 1, HH - 1, C.hairL);
        P(cx + H2, TOP + 1, 1, HH - 1, C.hairD);
        return;
      }
      P(cx - H2, TOP + 2, HW, FACE, C.skin);                // 脸
      P(cx - H2, TOP + 2, 1, FACE, C.skinL);                // 左颊受光
      P(cx + H2, TOP + 2, 1, FACE, C.skinD);                // 右颊背光
      const EY = TOP + 2 + (FACE >= 5 ? 2 : 1);             // = TOP+3
      P(cx - 2, EY, 1, 1, C.hairD);
      P(cx + 1, EY, 1, 1, C.hairD);
      P(cx - 1, TOP + FACE, 3, 1, shade(C.skinD, -0.28));   // 嘴
      P(cx - H2 + 1, TOP + FACE + 1, HW - 2, 1, C.skinD);   // 下颌
    }
    /* ---------- 躯干（4 行：肩顶 1 / 胸 2 / 衣摆 1） ---------- */
    function torso(back) {
      P(cx - 4, TOR, 9, 1, C.coatL);
      P(cx - 4, TOR + 1, 9, TORSO - 2, C.coat);
      P(cx - 4, TOR + 1, 2, TORSO - 2, C.coatL);
      P(cx + 3, TOR + 1, 1, TORSO - 2, C.coatD);
      P(cx - 3, TOR + TORSO - 1, 7, 1, C.coatD);
      if (back) {
        P(cx - 3, TOR + 1, 7, TORSO - 2, C.pack);
        P(cx - 3, TOR + 1, 7, 1, C.packL);
        P(cx + 2, TOR + 1, 1, TORSO - 2, C.packD);
      } else {
        P(cx, TOR + 1, 1, TORSO - 1, C.coatD);              // 前襟
      }
    }
    /* ---------- 折腿（正 / 背面：两膝分开、小腿竖直、脚平放） ---------- */
    function legs() {
      const lh = SHOE - (HIP + 2);                        // 小腿行数 = 2
      P(cx - 5, HIP, 11, 2, C.pant);                      // 折起的大腿（正视读作一条横条）
      P(cx - 5, HIP, 11, 1, "rgba(0,0,0,0.16)");          // 胯下遮蔽
      P(cx - 4, HIP + 2, 3, lh, C.pant);
      P(cx - 4, HIP + 2, 1, lh, C.pantL);
      P(cx + 2, HIP + 2, 3, lh, C.pant);
      P(cx + 4, HIP + 2, 1, lh, C.pantD);
      P(cx - 5, SHOE, 4, 2, C.shoe);
      P(cx - 5, SHOE, 4, 1, C.shoeL);
      P(cx + 2, SHOE, 4, 2, C.shoe);
      P(cx + 2, SHOE, 4, 1, C.shoeL);
    }
    /* ---------- 手臂（正 / 背面：伸手 = 右臂向外前伸，手放低） ---------- */
    function arms() {
      P(cx - 6, TOR + 1, 2, 3, C.coatL);                  // 左臂垂着
      P(cx - 6, TOR + 4, 2, 1, C.skin);
      if (reach) {
        P(cx + 4, TOR + 2, 3, 2, C.coatD);                // 右臂伸出去
        P(cx + 6, TOR + 4 + low, 2, 1, C.skinD);
      } else {
        P(cx + 4, TOR + 1, 2, 3, C.coatD);                // 右臂还收着
        P(cx + 4, TOR + 4 + low, 2, 1, C.skinD);
      }
    }
    /* ---------- 手臂（背面）：**手往前伸 ⇒ 背视看不见了**，两帧靠这个区分 ----------
       ⚠️ 背向必须也调一次手臂函数，否则 `reach` 在那三个背向精灵上完全没有效果，
       `_crouch.py` 的帧差判据会直接报 `upet=0 / ufeed=0`（刚栽过一次）。 */
    function armsBack() {
      P(cx - 6, TOR + 1, 2, 3, C.coat);                   // 左臂（背面：左臂不再是受光侧）
      P(cx + 5, TOR + 1, 2, 3, C.coatD);
      if (!reach) {                                       // 手收着时看得见，伸出去就藏到身前
        P(cx - 6, TOR + 4, 2, 1, C.skin);
        P(cx + 5, TOR + 4 + low, 2, 1, C.skinD);
      }
    }
    /* ---------- 侧视（朝左）：脚在前、小腿竖直、大腿折回髋、躯干前倾、手伸向前下 ---------- */
    function crouchSide() {
      const ax = cx - 5 - (reach ? 2 : 0);                // 伸手时手往前 2px（帧差靠这个）
      const lh = SHOE - (HIP + 2);
      P(cx - 5, SHOE, 5, 2, C.shoe);                      // 脚（脚尖朝左）
      P(cx - 5, SHOE, 5, 1, C.shoeL);
      P(cx - 4, HIP + 2, 3, lh, C.pant);                  // 小腿（竖直）
      P(cx - 5, HIP + 1, 4, 2, C.pant);                   // 膝（前伸 1px）
      P(cx - 4, HIP, 9, 2, C.pantD);                      // 大腿（向后折回髋）
      P(cx + 3, HIP - 1, 4, 3, C.pant);                   // 髋 / 臀（坐低）
      P(cx + 3, HIP - 1, 1, 3, C.pantL);
      P(cx - 3, TOR, 8, TORSO, C.coat);                   // 躯干（侧视厚度 8px）
      P(cx - 3, TOR, 1, TORSO, C.coatL);                  // 胸前受光
      P(cx + 4, TOR, 1, TORSO, C.coatD);                  // 后背背光
      P(cx - 3, TOR + TORSO - 1, 8, 1, C.coatD);          // 衣摆
      P(cx + 1, TOR, 3, TORSO - 1, C.pack);               // 书包（侧视露在背后）
      P(cx + 3, TOR, 1, TORSO - 1, C.packD);
      /* 头：侧脸朝左（与站姿同规 —— 后脑恒在 x 较大的一侧） */
      P(cx - H2 + 1, TOP, HW - 2, 1, C.hairL);
      P(cx - H2, TOP + 1, HW, 1, C.hair);
      P(cx - H2, TOP + 2, HW, FACE, C.skin);
      P(cx + 1, TOP + 2, 3, FACE, C.hair);                // 后脑
      P(cx + H2, TOP + 2, 1, FACE, C.hairD);
      P(cx - H2, TOP + 2, H2 + 1, 1, C.hair);             // 刘海压额
      const EY = TOP + 2 + (FACE >= 5 ? 2 : 1);
      P(cx - 2, EY, 1, 1, C.hairD);                       // 眼
      P(cx - H2, EY - 1, 1, 1, C.skinL);                  // 额头受光
      P(cx - H2, EY + 1, 1, 1, C.skinL);                  // 鼻尖受光
      P(cx - H2, TOP + FACE, 2, 1, C.skinD);              // 下巴
      /* 手臂：伸向前下 */
      P(ax + 1, TOR + 1, 2, 3, C.coatL);                  // 上臂
      P(ax, TOR + 3, 2, 2, C.coatL);                      // 前臂
      P(ax, TOR + 4 + low, 2, 1, C.skin);                 // 手
    }

    if (dir === "up")        { head(false); torso(true);  legs(); armsBack(); }
    else if (dir === "down") { head(true);  torso(false); legs(); arms(); }
    else                     { crouchSide(); }

    /* --- 出口链：与站姿逐字同规（**只有 right 翻转**） --- */
    let out = c;
    if (dir === "right") { out = flipH(c); out.getContext("2d").setTransform(1, 0, 0, 1, 0, 0); }
    outlineSprite(out, 0.45);
    shadowBlob(out.getContext("2d"), cx + 2, gy + 1, 5, 2, 0.46, 3);
    return out;
  };
}

const _crouchMake = buildCrouch();        // 玩家色（A2），与 makeChar 同一个角色
const _crouches = Object.create(null);
function poseSprite(dir, pose, frame) {
  const k = dir + pose + frame;
  if (!_crouches[k]) _crouches[k] = _crouchMake(dir, pose, frame);
  return _crouches[k];
}
