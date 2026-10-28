/* =========================================================
   二期模块 3 —— 玩家形象系统（照片 → look 配方 → 精灵 / 头像）
   ---------------------------------------------------------
   对外只有五个入口：
     mpNormLook(l) / mpLookKey(l)      配方校验与缓存键
     charSpriteOf(look, dir, step)     18×30 站姿精灵（与一期同规格）
     poseSpriteOf(look, dir, pose, fr) 18×30 蹲姿精灵
     avatarOf(look, size)              24×24 头肩像（画进 DOM 时靠 CSS 最近邻放大）
     mpAnalyzePhoto(file) -> Promise   照片 → 配方，**全程本地，一张像素都不外发**

   ⚠️ 三条不能破的规格（§3.4 / §8.5 / §13 风险 1）：
      画布 18×30、锚点 (9,27)、侧视只画朝左、`right` 用翻转。
      所以本文件**不重写骨架**，而是复用一期的 `buildChar(HH, PAL)` / `buildCrouch(PAL)`
      —— 它俩本来就留了换装入口（`PAL`）和两个可选钩子（`C.longHair` / `C.glasses`）。
      一期那两个函数一个字都不改，NPC 还在用它们。
      ⚠️ 但 `C.glasses` 这一版**不给玩家用**（镜框改在本文件 `lkExtras()` 里画，理由见那儿）。

   ⚠️ 蹲姿必须同步换形象（§11.2 第 4 条 / §13 风险 2）：`buildCrouch` 没有
      `longHair` / `glasses` 钩子，所以蹲姿的长发、眼镜、帽子、围巾全走本文件的
      后处理 `lkExtras()`，几何按 `CU_*` 常量算 —— 与 `buildCrouch` 里那几行同式子。
   ========================================================= */

/* --- 1. 配方：字段、白名单、缓存键 ------------------------------------ */
/* 发型里没有"卷发"：18×30 上只能靠发顶三格高光表达，读出来是"头发缺一块"。
   像素能读清楚的发型是**轮廓**，所以那格给了双马尾（两条垂在脸的两侧，一眼认得出）。 */
const LK_HAIR = ["short", "mid", "long", "ponytail", "bun", "twintails"];
const LK_EYE = ["round", "narrow", "dot"];
const LK_ACC = ["none", "glasses", "cap", "scarf"];
const LK_DEF = { skin: "#e9bb92", hairStyle: "short", hairColor: "#241d1a", eye: "round",
                 eyeColor: "#3a2a20", cloth: "#3f6ea8", pants: "#454c5a", acc: "none",
                 accColor: "#5a6270" };

function lkHex(v, fb) {
  return (typeof v === "string" && /^#[0-9a-fA-F]{6}$/.test(v)) ? v.toLowerCase() : fb;
}
function lkOne(v, list, fb) { return list.indexOf(v) >= 0 ? v : fb; }
/* 认不出的一律回落默认，**绝不抛异常**：别人传来的 look 可能是半截 JSON。 */
function mpNormLook(l) {
  if (!l || typeof l !== "object") return null;
  return { skin: lkHex(l.skin, LK_DEF.skin), hairStyle: lkOne(l.hairStyle, LK_HAIR, LK_DEF.hairStyle),
           hairColor: lkHex(l.hairColor, LK_DEF.hairColor), eye: lkOne(l.eye, LK_EYE, LK_DEF.eye),
           eyeColor: lkHex(l.eyeColor, LK_DEF.eyeColor),
           cloth: lkHex(l.cloth, LK_DEF.cloth), pants: lkHex(l.pants, LK_DEF.pants),
           acc: lkOne(l.acc, LK_ACC, LK_DEF.acc), accColor: lkHex(l.accColor, LK_DEF.accColor) };
}
function mpDefaultLook() { return Object.assign({}, LK_DEF); }
function mpLookKey(l) {
  return l ? [l.skin, l.hairStyle, l.hairColor, l.eye, l.eyeColor, l.cloth, l.pants, l.acc, l.accColor].join("|") : "";
}
/* 一期那套三段配色（本色 / 受光 / 背光）由配方推出来，与 `A2` 同一组系数，
   所以自定义小人的一期味道（顶光 + 彩色收边）不会丢。 */
function mpPaletteOf(L) {
  /* `mid` 与 `twintails` 都用一期钩子那个长度（垂到肩），`long` 在 lkExtras 里往下接几行；
     钩子把两列画在躯干最外沿上、而且**画在描边之前**，所以这几档都拿得到彩色收边 ——
     后处理那层只能往已有剪影里画，往外扩就缺一圈边。 */
  const long = L.hairStyle === "mid" || L.hairStyle === "long" || L.hairStyle === "twintails";
  const C = {
    skin: L.skin, skinD: shade(L.skin, -0.28), skinL: shade(L.skin, 0.30),
    hair: L.hairColor, hairL: shade(L.hairColor, 0.28), hairD: shade(L.hairColor, -0.35),
    eye: L.eyeColor, eyeD: shade(L.eyeColor, -0.30), eyeL: shade(L.eyeColor, 0.55),
    coat: L.cloth, coatD: shade(L.cloth, -0.30), coatL: shade(L.cloth, 0.26),
    pant: L.pants, pantD: shade(L.pants, -0.30), pantL: shade(L.pants, 0.24),
    shoe: "#26282e", shoeL: "#454a54",
    /* 书包也是配饰 ⇒ 跟着 `accColor` 走（用户："配饰区域单独染色"）。
       之前这四样写死成一期的橙色，于是"配饰颜色"只能染到镜框/帽子/围巾那几格，
       背面那一整块 7×5 的书包永远不变色，看着就像染色没生效。
       默认 `accColor` 是 #5a6270 深灰蓝，背包该是暗色，不会染成荧光色。 */
    pack: L.accColor, packD: shade(L.accColor, -0.30), packL: shade(L.accColor, 0.24)
  };
  if (long) C.longHair = L.hairColor;
  /* ⚠️ 这里**故意不设 `C.glasses`**：一期那个钩子画的是"一整条上沿 + 左右外框 + 鼻梁"，
     而玩家这一版的圆眼有眼白，眼白那两格正好落在钩子的左右外框列上 —— 后画的镜框
     和先画的眼白互相擦，整副眼镜糊成额头下一条黑带（用户报的"眼镜显示有误"）。
     镜框改由 `lkExtras()` 在眼睛之后画，见那里。算法哥仍走钩子，不受影响。 */
  return C;
}

/* --- 2. 后处理：眼型 / 眼镜 / 垂发 / 马尾 / 丸子头 / 帽子 / 围巾 --------
   `buildChar` 出口已经把描边和接地影画完了，所以这一层只能往**已有剪影里面**画，
   往外扩会缺一圈彩色收边。坐标全部由 `HY`（头顶行，随步态 bob 起伏）推出来 ——
   与 `buildChar` 里那几行用同一个式子，否则 bob=1 那一帧会脱开脸往上飘。 */
function lkHeadGeom(L, dir, step, crouch) {
  const bob = crouch ? 0 : ((GAIT[step] || GAIT[0]).bob || 0);
  const TOP = crouch ? CU_TOP : 1;
  const HH = crouch ? CU_HH : 6, HW = crouch ? CU_HW : 7, H2 = crouch ? CU_H2 : 3;
  const FACE = crouch ? CU_FACE : HH - 2;
  return {
    crouch: !!crouch, dir: dir, bob: bob,
    cx: CH_AX, hy: TOP + bob, hh: HH, hw: HW, h2: H2, face: FACE,
    ey: TOP + bob + 2 + (FACE >= 5 ? 2 : 1),
    neck: TOP + bob + HH,                     // 颈那一行（围巾落点）
    front: dir === "down", back: dir === "up", side: dir === "left" || dir === "right"
  };
}
/* `right` 的画布是 `flipH()` 之后的，所以后处理一律换算成镜像列。 */
function lkRect(g, G, x, y, w, h, col) {
  if (w <= 0 || h <= 0) return;
  let X = x;
  if (G.dir === "right") X = CH_W - x - w;
  px(g, X, y, w, h, col);
}
function lkExtras(c, L, G) {
  const g = c.getContext("2d");
  const P = (x, y, w, h, col) => lkRect(g, G, x, y, w, h, col);
  const cx = G.cx, hy = G.hy, h2 = G.h2, hh = G.hh, face = G.face;
  const hair = L.hairColor, hairL = shade(hair, 0.28), hairD = shade(hair, -0.35);
  const eyeD = shade(L.eyeColor, -0.30), eyeSoft = shade(L.eyeColor, 0.10);
  const tie = shade(L.cloth, 0.20);                 // 发圈跟上衣一个色系，一眼看出是扎起来的
  /* 垂在脸两侧那两列 —— 一期 `longHair` 钩子用的就是这两列（正好压在躯干最外沿上）。 */
  const SX = cx + h2 + 1, DX = cx - h2 - 1;

  /* --- 眼型：round = 一格眼白 + 一格瞳孔；narrow = 一期那两格；dot = 1px 软色 ---
     ⚠️ 18×30 上一只眼睛只有两列可放。原先两列全涂黑发色，读出来是"脸上两个墨点"，
        没有眼白；现在白在外、瞳在内，三格排开正好是一张脸的眼睛。
        瞳孔的颜色走 `eyeColor`，不再跟着发色 —— 染了金发不该是一双金眼睛。 */
  const EYE_WHITE = "#f2efe9";
  if (!G.back) {
    if (L.eye === "round") {
      if (G.front) {
        P(cx - 3, G.ey, 1, 1, EYE_WHITE); P(cx + 2, G.ey, 1, 1, EYE_WHITE);
        P(cx - 2, G.ey, 1, 1, eyeD);      P(cx + 1, G.ey, 1, 1, eyeD);
      } else {
        /* 侧视（朝左）只有一只眼，眼白落在瞳孔后面 */
        P(cx - 3, G.ey, 1, 1, EYE_WHITE); P(cx - 2, G.ey, 1, 1, eyeD);
      }
    } else if (L.eye === "dot") {
      if (G.front) { P(cx - 2, G.ey, 1, 1, eyeSoft); P(cx + 1, G.ey, 1, 1, eyeSoft); }
      else P(cx - 2, G.ey, 1, 1, eyeSoft);
    } else {
      /* narrow：那两格的位置与一期逐字相同，只是颜色交给眼睛自己的配方 */
      if (G.front) { P(cx - 2, G.ey, 1, 1, eyeD); P(cx + 1, G.ey, 1, 1, eyeD); }
      else P(cx - 2, G.ey, 1, 1, eyeD);
    }
  }

  /* --- 眼镜：必须画在**眼睛之后**（镜框压眼白，不是眼白擦镜框）-----------
     18×30 上一只眼睛只有两列可放，能读出来的镜框只剩"每只眼睛头上一格 + 两眼之间
     一格鼻梁"：整条上沿（一期钩子那种画法）在这尺寸上就是一根黑带。
     侧视同理，只有一只眼，镜框那一格后面再接一格镜腿横到耳后（`side()` 画的是朝左的
     人，大 x 那侧是后脑）。背向什么都不画 —— 后脑勺上没有眼镜。 */
  if (L.acc === "glasses" && !G.back) {
    const GC = L.accColor;
    if (G.front) {
      P(cx - 3, G.ey - 1, 2, 1, GC);                     // 左镜圈上沿
      P(cx + 1, G.ey - 1, 2, 1, GC);                     // 右镜圈上沿
      P(cx - 1, G.ey, 2, 1, GC);                         // 鼻梁（正好夹在两眼中间那两格）
    } else {
      P(cx - 3, G.ey - 1, 2, 1, GC);                     // 那一只眼的镜圈
      P(cx, G.ey - 1, 2, 1, GC);                         // 镜腿：横过太阳穴到耳后
    }
  }

  /* --- 蹲姿补垂发（站姿由 C.longHair 钩子画过了，这里只补钩子没覆盖的两种） ---
     行数照钩子那套 `hh+3`：蹲姿头 y10..y15、躯干 y17..y20，垂发正好落到衣摆那一行。
     最后两格压在描边圈上（腰侧那一格本来就是黑的），剪影形状不变，只是换了颜色。 */
  if (G.crouch && (L.hairStyle === "mid" || L.hairStyle === "long" || L.hairStyle === "twintails")) {
    const LN = hh + 3;
    for (let i = 0; i < LN; i++) {
      const col = i < LN - 2 ? hair : hairD;
      P(SX, hy + 2 + i, 1, 1, col);
      if (!G.side) P(DX, hy + 2 + i, 1, 1, shade(col, 0.10));
    }
  }
  /* --- 长发：一期的钩子只到肩线下 3px，中长发就用它，长发在同一列往下再接一段 ---
     站姿接三行、卡在胸口那段的最下一行（`ty+chest`）：腰以下躯干左右各收 1px，
     这两列就空了 ⇒ 再往下接就垂在胳膊和腰之间那道缝里（描边早画完了，补的格子没边）。
     蹲姿身子压扁了，接两行落在折起的大腿横条（y21..y22）上。 */
  if (L.hairStyle === "long") {
    const y0 = hy + 2 + (hh + 3), LN = G.crouch ? 2 : 3;
    for (let i = 0; i < LN; i++) {
      const col = i >= LN - 2 ? hairD : hair;
      P(SX, y0 + i, 1, 1, col);
      if (!G.side) P(DX, y0 + i, 1, 1, shade(col, 0.10));
    }
  }
  /* --- 马尾：扎在脑后，所以**正面什么都不画** --------------------------
     之前正面往两颊各垂一条，看着像剃了两道鬓角 —— 马尾在脑后，从正面看
     只会被头挡住。侧视画在后脑那一侧（`side()` 画的是朝左的人，大 x 那侧就是后脑），
     背面画正中一条。发圈跟着马尾走，也不在正面露。 */
  if (L.hairStyle === "ponytail") {
    if (G.side) {
      for (let i = 0; i < 6; i++) P(cx + h2 + 1, hy + 1 + i, i < 4 ? 2 : 1, 1, i < 4 ? hair : hairD);
      P(cx + h2, hy + 1, 1, 1, tie);
    } else if (G.back) {
      for (let i = 0; i < 7; i++) P(cx - 1, hy + hh - 2 + i, 2, 1, i < 5 ? hair : hairD);
      P(cx + h2, hy + 1, 1, 1, tie);
    }
  }
  /* --- 双马尾：两条垂发本身走一期钩子（与中长发同一长度，拿得到彩色收边），
         后处理只在这一束上加两样都落在剪影里的东西：耳后那一格**发圈** + 圈下一格**束腰**。
         所以正面看是"两条 + 两个亮圈"，中长发是"两条光杆"，马尾是"正面什么都没有"。 --- */
  if (L.hairStyle === "twintails") {
    P(SX, hy + 2, 1, 1, tie);                              // 发圈（上衣亮色，一眼看出是扎的）
    P(SX, hy + 3, 1, 1, hairL);                            // 圈下那一格鼓起来
    if (!G.side) {
      P(DX, hy + 2, 1, 1, tie);
      P(DX, hy + 3, 1, 1, shade(hairL, -0.10));            // 左侧受光、右侧压暗一点（顶光偏左）
    }
  }
  /* --- 丸子头：头顶一个小揪 --- */
  if (L.hairStyle === "bun") {
    const by = Math.max(0, hy - 2);
    P(cx - 1, by, 3, 2, hair); P(cx - 1, by, 1, 1, hairL); P(cx + 1, by + 1, 1, 1, hairD);
  }
  /* --- 帽子：盖住发顶两行 + 一圈帽檐；颜色走 `accColor`（配饰单独调色） --- */
  if (L.acc === "cap") {
    const cap = L.accColor, capD = shade(L.accColor, -0.34);
    P(cx - h2, hy, G.hw, 2, cap);
    P(cx - h2, hy, 1, 2, shade(cap, 0.22));
    P(cx + h2, hy + 1, 1, 1, capD);
    if (G.front) P(cx - h2 - 1, hy + 2, G.hw + 2, 1, capD);          // 正面：帽檐横在额前
    else if (G.side) P(cx - h2 - 2, hy + 2, 3, 1, capD);             // 侧面：帽檐朝脸那侧
    else P(cx - 1, hy + 2, 2, 1, capD);                              // 背面：只露调节带
  }
  /* --- 围巾：颈那一行 + 垂下来一角；颜色同样走 `accColor` --- */
  if (L.acc === "scarf") {
    const sc = L.accColor, scL = shade(L.accColor, 0.30);
    P(cx - 3, G.neck, 7, 1, sc); P(cx - 3, G.neck, 2, 1, scL);
    if (!G.back) P(cx + 2, G.neck + 1, 1, 2, sc);
  }
  return c;
}

/* --- 3. 精灵缓存：一份配方 × 四向 × 六相位 = 24 张，几 KB --------------- */
const _lkChars = Object.create(null);
function charSpriteOf(look, dir, step) {
  const L = mpNormLook(look);
  if (!L) return charSprite(dir, step);          // 没配方 ⇒ 一期的脸，绝不空白
  const key = mpLookKey(L) + dir + step;
  if (_lkChars[key]) return _lkChars[key];
  const c = buildChar(6, mpPaletteOf(L))(dir, step);
  lkExtras(c, L, lkHeadGeom(L, dir, step, false));
  return (_lkChars[key] = c);
}
const _lkPoses = Object.create(null);
function poseSpriteOf(look, dir, pose, frame) {
  const L = mpNormLook(look);
  if (!L) return poseSprite(dir, pose, frame);
  const key = mpLookKey(L) + dir + pose + frame;
  if (_lkPoses[key]) return _lkPoses[key];
  const c = buildCrouch(mpPaletteOf(L))(dir, pose, frame);
  lkExtras(c, L, lkHeadGeom(L, dir, 0, true));
  return (_lkPoses[key] = c);
}
/* 自己（本地玩家）：`player.look` 空就退回一期那张脸。地图里两处画人的地方只调这两个。 */
function mpSelfSprite(dir, step) { return charSpriteOf(typeof player !== "undefined" && player ? player.look : null, dir, step); }
function mpSelfPose(dir, pose, frame) { return poseSpriteOf(typeof player !== "undefined" && player ? player.look : null, dir, pose, frame); }

/* --- 4. 头像：同一个人、同一套配方，再画一张 24×24 头肩像（§8.6） -------
   ⚠️ 不另存图片，打开时实时算，耗时 < 1 ms；公告栏 / 聊天窗 / 主页三处共用一张，
      所以「主页头像、公告头像、地图小人长得是同一个人」（验收 20 第 9 条）。 */
const _lkAvatars = Object.create(null);
function avatarOf(look, size) {
  const L = mpNormLook(look) || mpDefaultLook();
  const S = 24, key = mpLookKey(L);
  if (!_lkAvatars[key]) {
    const c = mkCanvas(S, S), g = c.getContext("2d");
    const C = mpPaletteOf(L);
    const R = (x, y, w, h, col) => { if (w > 0 && h > 0) px(g, x, y, w, h, col); };
    const cx = 12;
    /* 肩（上衣）+ 领口 */
    R(3, 19, 18, 5, C.coat); R(3, 19, 18, 1, C.coatL); R(9, 19, 6, 5, C.coatD);
    R(10, 19, 4, 2, C.skin);                                   // 脖子
    /* 头：脸 12×13，左颊受光、右颊背光（顶光偏左，与小人一致） */
    R(6, 5, 12, 13, C.skin); R(6, 5, 1, 13, C.skinL); R(17, 5, 1, 13, C.skinD);
    /* 头发：顶三行 + 两侧垂发。**两侧垂到哪儿就是发型的差别所在**：
       短发到颊 / 中长发到肩 / 长发压过肩；扎起来的（马尾、丸子头、双马尾）不留披发。 */
    const HS = L.hairStyle;
    const sideLen = (HS === "short" || HS === "ponytail" || HS === "bun") ? 7
                  : HS === "twintails" ? 5 : HS === "mid" ? 12 : 17;
    R(5, 2, 14, 3, C.hair); R(5, 2, 14, 1, C.hairL);
    R(5, 5, 2, sideLen, C.hair);
    R(17, 5, 2, sideLen, C.hairD);
    if (HS === "bun") { R(10, 0, 4, 2, C.hair); R(10, 0, 4, 1, C.hairL); }
    /* 头像是正面大头：马尾扎在脑后，被头挡住 ⇒ 什么都不画。
       （之前在这里贴了一截发梢，位置正好压着右脸，看着像一缕垂下来的鬓发。） */
    if (HS === "twintails") {                          // 两束垂在头两侧，扎绳取上衣的亮色
      const tie = shade(L.cloth, 0.20);
      R(3, 7, 2, 8, C.hair); R(19, 7, 2, 8, C.hairD);
      R(3, 7, 2, 2, tie); R(19, 7, 2, 2, shade(tie, -0.25));
      R(3, 13, 2, 2, C.hairD); R(19, 13, 2, 2, C.hairD);
    }
    /* 眼睛：眼白底 + 瞳孔。round = 3×3 眼白 + 2×2 瞳孔；narrow 与一期同款一条 3×1；
       dot 是 2×2 软色，不画眼白。瞳孔走 `eyeColor` 那套色，跟发色脱钩。
       ⚠️ 两眼恒在 x7..9 与 x14..16 —— 脸是 x6..x17（中心 11.5），这两组才对称。
          之前是 8..10 / 15..17（中心 12.5），整张脸往右歪一格：右眼贴着脸的边、
          左眼外面空一格，眼镜框无论怎么画都不对（用户报的"眼镜显示有误"根子在这儿）。 */
    const ey = L.eye === "narrow" ? 11 : 10, eh = L.eye === "narrow" ? 1 : 3;
    const E1 = 7, E2 = 14;
    if (L.eye === "round") {
      const WHITE = "#f4f2ee";
      R(E1, ey, 3, 3, WHITE); R(E2, ey, 3, 3, WHITE);
      R(E1 + 1, ey + 1, 2, 2, C.eyeD); R(E2 + 1, ey + 1, 2, 2, C.eyeD);
      R(E1 + 1, ey + 1, 1, 1, C.eyeL); R(E2 + 1, ey + 1, 1, 1, C.eyeL);
    } else if (L.eye === "dot") {
      R(E1 + 1, ey + 1, 2, 2, shade(C.eye, 0.10)); R(E2 + 1, ey + 1, 2, 2, shade(C.eye, 0.10));
    } else {
      R(E1, ey, 3, 1, C.eyeD); R(E2, ey, 3, 1, C.eyeD);
    }
    R(11, 12, 2, 1, C.skinD);                                  // 鼻影
    R(10, 15, 4, 1, shade(C.skinD, -0.28));                    // 嘴
    /* 眼镜：两个镜圈 + 鼻梁，**镜片不填色** —— 眼睛从框里透出来才叫眼镜，
       填了就是一副眼罩（之前那版画的是"上沿一整条 + 两根通高竖框"，竖框正好压在
       两只眼睛的外侧那一列上，把眼白擦掉半只）。 */
    if (L.acc === "glasses") {
      const GC = L.accColor;
      R(E1 - 1, ey - 1, 5, 1, GC); R(E2 - 1, ey - 1, 5, 1, GC);       // 两个镜圈的上沿
      R(E1 + 3, ey - 1, 2, 1, GC);                                     // 鼻梁（把它俩连起来）
      R(E1 - 1, ey, 1, eh, GC); R(E1 + 3, ey, 1, eh, GC);              // 左圈左右框
      R(E2 - 1, ey, 1, eh, GC); R(E2 + 3, ey, 1, eh, GC);              // 右圈左右框（右那根兼镜腿）
      R(E1 - 1, ey + eh, 5, 1, GC); R(E2 - 1, ey + eh, 5, 1, GC);      // 两个镜圈的下沿
    }
    if (L.acc === "cap") { R(4, 1, 16, 4, L.accColor); R(4, 5, 16, 1, shade(L.accColor, -0.34)); }
    if (L.acc === "scarf") { R(5, 18, 14, 3, L.accColor); R(5, 18, 5, 1, shade(L.accColor, 0.30)); }
    outlineSprite(c, 0.45);
    _lkAvatars[key] = c;
  }
  if (!size || size === 24) return _lkAvatars[key];
  const k = key + "@" + size;
  if (_lkAvatars[k]) return _lkAvatars[k];
  const o = mkCanvas(size, size), og = o.getContext("2d");
  og.imageSmoothingEnabled = false;                            // §10.5：24→48 最近邻，不许糊
  og.drawImage(_lkAvatars[key], 0, 0, size, size);
  return (_lkAvatars[k] = o);
}
/* 头像转 <img>（聊天窗 / 公告栏 / 主页三处都要往 DOM 里塞） */
function avatarSrcOf(look, size) { return avatarOf(look, size || 24).toDataURL("image/png"); }

/* --- 5. 照片分析（§8.3 流水线，全本地） --------------------------------
   分级降级链：L1 取色+发型+眼镜 → L2 只取色 → L3 默认小人 + 手动选。
   ⚠️ 任何一步炸了都必须交出一个小人（§8.3 那句"不能因为某个组件挂了就出不了小人"）。 */
const LK_N = 48;                                    // 分析用的降采样边长
function lkClamp(v, a, b) { return v < a ? a : v > b ? b : v; }
function lkLum(c) { return 0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]; }
function lkSat(c) { const m = Math.max(c[0], c[1], c[2]), n = Math.min(c[0], c[1], c[2]); return m ? (m - n) / m : 0; }
function lkHexOf(c) { return "#" + [0, 1, 2].map(i => lkClamp(Math.round(c[i]), 0, 255).toString(16).padStart(2, "0")).join(""); }
function lkDist(a, b) { return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]); }
/* 取一块区域里"最像主体"的颜色：先按 4bit 量化投票，再在赢家桶里取均值。 */
function lkDominant(d, x0, y0, x1, y1, filt) {
  const bins = Object.create(null);
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
    const i = (y * LK_N + x) * 4;
    if (d[i + 3] < 128) continue;
    const c = [d[i], d[i + 1], d[i + 2]];
    if (filt && !filt(c)) continue;
    const k = ((c[0] >> 4) << 8) | ((c[1] >> 4) << 4) | (c[2] >> 4);
    const b = bins[k] || (bins[k] = { n: 0, r: 0, g: 0, b: 0 });
    b.n++; b.r += c[0]; b.g += c[1]; b.b += c[2];
  }
  let best = null;
  for (const k in bins) if (!best || bins[k].n > best.n) best = bins[k];
  if (!best) return null;
  return [best.r / best.n, best.g / best.n, best.b / best.n];
}
function lkAvg(d, x0, y0, x1, y1, filt) {
  let n = 0, r = 0, g = 0, b = 0;
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
    const i = (y * LK_N + x) * 4;
    if (d[i + 3] < 128) continue;
    const c = [d[i], d[i + 1], d[i + 2]];
    if (filt && !filt(c)) continue;
    n++; r += c[0]; g += c[1]; b += c[2];
  }
  return n ? [r / n, g / n, b / n] : null;
}
/* 肤色必须落在"人皮"那条窄带上：照片背景（白墙 / 蓝天 / 草地）一律不许被当成脸。 */
function lkIsSkin(c) {
  const l = lkLum(c);
  if (l < 60 || l > 245) return false;
  if (!(c[0] > c[2])) return false;                       // 红 > 蓝，冷色背景一律出局
  if (c[0] - c[2] < 12 || c[0] - c[2] > 130) return false;
  if (Math.abs(c[0] - c[1]) > 78) return false;
  return true;
}
/* 取"最靠中心"的一簇肤色：脸的左右两端与背景同色，取极值会挑到耳朵外的墙。 */
function lkSkinRun(d, y, x0, x1) {
  let best = null, run = null;
  for (let x = x0; x <= x1 + 1; x++) {
    const i = (y * LK_N + x) * 4;
    const ok = x <= x1 && d[i + 3] >= 128 && lkIsSkin([d[i], d[i + 1], d[i + 2]]);
    if (ok) { if (!run) run = { a: x, b: x }; else run.b = x; }
    else if (run) {
      const mid = (run.a + run.b) / 2, score = run.b - run.a + 1 - Math.abs(mid - (x0 + x1) / 2) * 0.6;
      if (!best || score > best.score) { best = { score: score, a: run.a, b: run.b }; }
      run = null;
    }
  }
  return best;
}
function lkAnalyze(canvas) {
  const g = canvas.getContext("2d", { willReadFrequently: true });
  const d = g.getImageData(0, 0, LK_N, LK_N).data;
  const L = mpDefaultLook();
  /* 背景色 = 四个上角的众数。头发区先减掉它，否则白墙照片会把"墙"当成头发（实测就是 L3 那条路）。 */
  const corners = [];
  for (const p of [[1, 1], [LK_N - 2, 1], [1, 3], [LK_N - 2, 3]]) {
    const i = (p[1] * LK_N + p[0]) * 4; corners.push([d[i], d[i + 1], d[i + 2]]);
  }
  const bg = lkAvg0(corners);
  const notBg = c => lkDist(c, bg) > 84;

  /* ① 肤色：脸框在 x 14..33、y 15..29 里逐行找"最靠中心的那一长条肤色"。
     逐行取中位数而不是整块求平均：整块平均会把左右两端与背景同色的像素卷进来，
     实测一张白墙自拍出来 skin=#f9f0e6（墙），换成逐行中段就是 #eec39e（脸）。 */
  const acc = [0, 0, 0]; let n = 0;
  for (let y = 15; y <= 29; y++) {
    const r = lkSkinRun(d, y, 14, 33); if (!r || r.b - r.a < 3) continue;
    const mid = (r.a + r.b) >> 1, half = Math.min(5, (r.b - r.a) >> 1);
    for (let x = mid - half; x <= mid + half; x++) {
      const i = lkIdx(d, x, y), c = [d[i], d[i + 1], d[i + 2]];
      if (!lkIsSkin(c)) continue;
      acc[0] += c[0]; acc[1] += c[1]; acc[2] += c[2]; n++;
    }
  }
  let skin = n >= 24 ? [acc[0] / n, acc[1] / n, acc[2] / n] : null;
  if (!skin) skin = lkDominant(d, 16, 17, 31, 27, lkIsSkin) || lkAvg(d, 16, 17, 31, 27, lkIsSkin);
  if (skin) L.skin = lkHexOf([lkClamp(skin[0], 96, 246), lkClamp(skin[1], 62, 214), lkClamp(skin[2], 42, 192)]);

  /* ② 发色：额头以上那一条（y 4..12），排除背景。取不到 ⇒ 保留默认黑发。 */
  const hair = lkDominant(d, 13, 4, 34, 12, c => notBg(c) && lkLum(c) < lkLum(skin || [200, 200, 200]) + 34);
  if (hair) {
    /* 照片里的头发常常被压成近黑，但纯黑在 18×30 上会跟描边连成一片 ⇒ 抬一点点 */
    const l = lkLum(hair);
    L.hairColor = lkHexOf(l < 26 ? [hair[0] + 14, hair[1] + 12, hair[2] + 12] : hair);
  }
  /* ③ 衣服色：胸口那一块（y 36..46），排除背景 */
  const cloth = lkDominant(d, 12, 36, 35, 46, notBg);
  if (cloth) L.cloth = lkHexOf(cloth);
  /* ④ 裤色：一期默认是冷灰蓝，所以"比上衣更暗、往蓝偏一点"比硬猜下半身稳 */
  L.pants = lkHexOf([lkClamp(cloth ? cloth[0] * 0.52 : 69, 24, 150),
                     lkClamp(cloth ? cloth[1] * 0.56 : 76, 26, 160),
                     lkClamp(cloth ? cloth[2] * 0.68 : 90, 34, 180)]);

  /* ⑤ 发型：量"头发色像素在两颊外侧还往下垂多深"。垂过下巴 ⇒ 至少 mid，垂过肩 ⇒ long。 */
  const HC = hair || [36, 29, 26];
  let hangL = 0, hangR = 0, topBlob = 0;
  for (let y = 13; y <= 34; y++) {
    for (let x = 8; x <= 14; x++) if (lkDistAt(d, x, y, HC) < 96 && lkLumAt(d, x, y) < 200) { hangL = Math.max(hangL, y - 12); break; }
    for (let x = 33; x <= 40; x++) if (lkDistAt(d, x, y, HC) < 96 && lkLumAt(d, x, y) < 200) { hangR = Math.max(hangR, y - 12); break; }
  }
  for (let x = 16; x <= 31; x++) if (lkDistAt(d, x, 2, HC) < 96) topBlob++;
  const hang = Math.min(hangL, hangR), oneSide = Math.max(hangL, hangR);
  if (topBlob >= 9 && hang <= 3) L.hairStyle = "bun";
  else if (oneSide >= 12 && hang <= 5) L.hairStyle = "ponytail";
  else if (hang >= 16) L.hairStyle = "long";
  else if (hang >= 8) L.hairStyle = "mid";
  else L.hairStyle = "short";
  /* 照片里认不出双马尾（两束垂在头两侧，跟披发在 48×48 上是一个轮廓），
     所以这条链只交短发/中长发/长发/丸子头/马尾，剩下的让人自己在下面挑。 */

  /* ⑥ 眼镜：眼带（y 19..23）里找一条横贯、比两侧皮肤暗得多的连续带 */
  let darkRun = 0, bestRun = 0;
  for (let y = 19; y <= 23; y++) {
    darkRun = 0;
    for (let x = 12; x <= 35; x++) {
      const l = lkLumAt(d, x, y), sl = lkLum(skin || [200, 200, 200]);
      if (l < sl * 0.52) { darkRun++; if (darkRun > bestRun) bestRun = darkRun; } else darkRun = 0;
    }
  }
  /* 帽檐：发顶那一条几乎等色、且饱和度明显高于头发 ⇒ 当成帽子 */
  const capish = lkDominant(d, 13, 3, 34, 8, c => notBg(c) && lkSat(c) > 0.42);
  /* 镜框自己那条暗带的颜色：以前眼镜的颜色是拿发色压暗算的，染了金发就配一副金框，
     现在它有自己的字段，直接从照片那条带上取。 */
  const frameC = lkDominant(d, 12, 19, 35, 23, c => notBg(c) && lkLum(c) < 96);
  if (bestRun >= 15) { L.acc = "glasses"; if (frameC) L.accColor = lkHexOf(frameC); }
  else if (capish && lkSat(capish) > 0.46) { L.acc = "cap"; L.accColor = lkHexOf(capish); }
  else L.acc = "none";
  /* 围巾：下巴以下那一条（y 29..33）饱和度高、且与上衣不同色 */
  const neck = lkDominant(d, 16, 29, 31, 33, c => notBg(c) && lkSat(c) > 0.38);
  if (L.acc === "none" && neck && lkDist(neck, cloth || [0, 0, 0]) > 120) { L.acc = "scarf"; L.accColor = lkHexOf(neck); }

  /* ⑦ 眼型：眼带里那两团黑的宽高比 */
  let blk = 0, wsum = 0;
  for (let y = 19; y <= 23; y++) {
    let run = 0;
    for (let x = 13; x <= 34; x++) {
      if (lkLumAt(d, x, y) < lkLum(skin || [200, 200, 200]) * 0.55) run++;
      else { if (run === 1) blk++; if (run >= 2) wsum++; run = 0; }
    }
  }
  L.eye = bestRun >= 15 ? "round" : (blk > wsum * 1.6 && wsum + blk > 0) ? "dot" : "round";
  return L;
}
function lkAvg0(list) { let r = 0, g = 0, b = 0; for (const c of list) { r += c[0]; g += c[1]; b += c[2]; } return [r / list.length, g / list.length, b / list.length]; }
function lkIdx(d, x, y) { return (y * LK_N + x) * 4; }
function lkDistAt(d, x, y, c) { const i = lkIdx(d, x, y); return Math.abs(d[i] - c[0]) + Math.abs(d[i + 1] - c[1]) + Math.abs(d[i + 2] - c[2]); }
function lkLumAt(d, x, y) { const i = lkIdx(d, x, y); return 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]; }

/* 照片 → 48×48 分析画布：正方形居中裁切（人像照基本都是居中构图），
   再"缩到 1.18 倍"把画面往中心收 —— 手机自拍里头发常贴到画面上沿，
   不收这一道就会把背景当成头发（实测：白墙照片 hairColor=#f9f0e6）。 */
function lkFit(img) {
  const iw = img.naturalWidth || img.width, ih = img.naturalHeight || img.height;
  const side = Math.max(1, Math.min(iw, ih));
  const c = mkCanvas(LK_N, LK_N), g = c.getContext("2d", { willReadFrequently: true });
  g.fillStyle = "#000"; g.fillRect(0, 0, LK_N, LK_N);
  const zoom = 1.18, src = side / zoom;
  g.drawImage(img, (iw - src) / 2, (ih - src) / 2, src, src, 0, 0, LK_N, LK_N);
  return c;
}
/* 对外：`mpAnalyzePhoto(File)` → Promise<look>。
   ⚠️ 只用 `FileReader` + canvas，**没有任何 fetch**（§8.7 / 验收 18：照片不出浏览器）。 */
function mpAnalyzePhoto(file) {
  return new Promise(res => {
    const fb = mpDefaultLook();
    let settled = false;
    const done = l => { if (!settled) { settled = true; res(mpNormLook(l) || fb); } };
    try {
      if (!file || typeof file.name !== "string") return done(fb);
      if (!/^image\//i.test(file.type || "") || file.size > 12 * 1024 * 1024) return done(fb);
      const fr = new FileReader();
      fr.onerror = () => done(fb);
      fr.onload = () => {
        const im = new Image();
        im.onerror = () => done(fb);
        im.onload = () => {
          try { done(lkAnalyze(lkFit(im))); } catch (e) { console.warn("[look] 分析失败，回落默认：" + e.message); done(fb); }
        };
        im.src = fr.result;
      };
      fr.readAsDataURL(file);
    } catch (e) { done(fb); }
  });
}

/* --- 6. 落地：把一张配方变成"我在地图里的样子" ------------------------- */
/* 存本地 + 推给服务端（`look.update`）。单机模式（没有 MP / 没连上）只存本地，
   不碰任何 `mp_*` 网络链路 —— §7.7 那条"单机不写 mp_* 本地键"讲的是**联机数据**，
   形象配方属于 §10.3 表里的"形象配方"一类：本地缓存 + 服务端为准。 */
function mpApplyLook(look, opt) {
  const L = mpNormLook(look); if (!L) return null;
  if (typeof player !== "undefined" && player) player.look = L;
  try { localStorage.setItem("mp_look", JSON.stringify(L)); } catch (e) {}
  if (typeof mpPushLook === "function") mpPushLook(L);
  if (!opt || !opt.silent) {
    if (typeof mpNotice === "function") mpNotice("形象已更新，其他玩家看到的就是这个样子", "ok");
  }
  return L;
}
/* 恢复默认形象（§8.7 那条"删除"） */
function mpResetLook() { return mpApplyLook(mpDefaultLook()); }

/* --- 7. 试衣间（§8.3 第 ⑤⑥ 步：当场预览 + 三个下拉微调） --------------
   返回一个 DOM 片段，给模块 6 的个人中心与「换形象」弹窗共用。 */
function mpLookStudio(cur, onPick) {
  const L = mpNormLook(cur) || mpDefaultLook();
  const wrap = document.createElement("div"); wrap.id = "lkStudio";
  const prev = document.createElement("div"); prev.className = "lkPrev";
  const form = document.createElement("div"); form.className = "lkForm";
  const file = document.createElement("label"); file.className = "lkFile";
  file.innerHTML = "选择照片<input type=\"file\" accept=\"image/*\">";
  const inp = file.querySelector("input");
  const stat = document.createElement("div"); stat.className = "lkStat";
  const pick = document.createElement("div"); pick.className = "lkPick";
  const btns = document.createElement("div"); btns.className = "lkBtns";
  const ok = document.createElement("button"); ok.type = "button"; ok.className = "lkOk"; ok.textContent = "使用当前形象";
  const def = document.createElement("button"); def.type = "button"; def.className = "lkDef"; def.textContent = "恢复默认形象";
  btns.appendChild(ok); btns.appendChild(def);

  function drawPrev() {
    prev.textContent = "";
    for (const dir of ["down", "up", "left", "right"]) {
      const c = mkCanvas(CH_W * 3, CH_H * 3);
      const g = c.getContext("2d"); g.imageSmoothingEnabled = false;
      g.drawImage(charSpriteOf(L, dir, 0), 0, 0, CH_W * 3, CH_H * 3);
      prev.appendChild(c);
    }
    const a = avatarOf(L, 24);
    const ac = mkCanvas(72, 72); const ag = ac.getContext("2d"); ag.imageSmoothingEnabled = false;
    ag.drawImage(a, 0, 0, 72, 72); prev.appendChild(ac);
  }
  /* 下拉框给用户看的中文名。⚠️ 键是**配方字段名**（hairStyle/eye/acc），
     不是界面上那三个字 —— 之前 sel() 把"发型"当键去查表，查不到就把英文原样
     吐回给用户看了（short / round / none 就是这么漏出去的）。 */
  const LK_LABEL = {
    hairStyle: { short: "短发", mid: "中长发", long: "长发", ponytail: "马尾", bun: "丸子头", twintails: "双马尾" },
    eye:       { round: "圆眼", narrow: "细长眼", dot: "点状眼" },
    acc:       { none: "无", glasses: "眼镜", cap: "帽子", scarf: "围巾" }
  };
  const LK_FIELD = { hairStyle: "发型", eye: "眼型", acc: "配饰" };
  function lkLabelOf(field, v) { const m = LK_LABEL[field]; return (m && m[v]) || v; }
  function sel(field, list, val, on) {
    const box = document.createElement("label"); box.textContent = LK_FIELD[field] || field;
    const s = document.createElement("select");
    for (const v of list) { const o = document.createElement("option"); o.value = v; o.textContent = lkLabelOf(field, v); s.appendChild(o); }
    s.value = val; s.addEventListener("change", () => on(s.value));
    box.appendChild(s); return box;
  }
  function color(label, val, on) {
    const box = document.createElement("label"); box.textContent = label;
    const i = document.createElement("input"); i.type = "color"; i.value = val;
    i.addEventListener("input", () => on(i.value));
    box.appendChild(i); return box;
  }
  function rebuild() {
    pick.textContent = "";
    pick.appendChild(sel("hairStyle", LK_HAIR, L.hairStyle, v => { L.hairStyle = v; drawPrev(); fire(); }));
    pick.appendChild(sel("eye", LK_EYE, L.eye, v => { L.eye = v; drawPrev(); fire(); }));
    pick.appendChild(sel("acc", LK_ACC, L.acc, v => { L.acc = v; drawPrev(); fire(); }));
    pick.appendChild(color("发色", L.hairColor, v => { L.hairColor = v; drawPrev(); fire(); }));
    pick.appendChild(color("瞳色", L.eyeColor, v => { L.eyeColor = v; drawPrev(); fire(); }));
    pick.appendChild(color("肤色", L.skin, v => { L.skin = v; drawPrev(); fire(); }));
    pick.appendChild(color("上衣颜色", L.cloth, v => { L.cloth = v; drawPrev(); fire(); }));
    pick.appendChild(color("裤子颜色", L.pants, v => { L.pants = v; drawPrev(); fire(); }));
    pick.appendChild(color("配饰颜色", L.accColor, v => { L.accColor = v; drawPrev(); fire(); }));
  }
  function fire() { if (onPick) onPick(Object.assign({}, L)); }
  inp.addEventListener("change", () => {
    const f = inp.files && inp.files[0]; if (!f) return;
    stat.textContent = "正在识别照片…";
    mpAnalyzePhoto(f).then(got => {
      Object.assign(L, got);
      stat.textContent = "识别结果：" + lkLabelOf("hairStyle", L.hairStyle) + "、" + lkLabelOf("eye", L.eye) +
        (L.acc === "none" ? "，无配饰" : "，佩戴" + lkLabelOf("acc", L.acc)) + "。如有偏差请在下方调整。";
      rebuild(); drawPrev(); fire();
    });
  });
  ok.addEventListener("click", () => mpApplyLook(L));
  def.addEventListener("click", () => { Object.assign(L, mpDefaultLook()); rebuild(); drawPrev(); mpResetLook(); });
  wrap.appendChild(prev); wrap.appendChild(file); wrap.appendChild(stat);
  wrap.appendChild(pick); wrap.appendChild(btns);
  rebuild(); drawPrev();
  if (!cur) stat.textContent = "照片仅在本机识别，不会上传服务器。也可跳过照片，在下方手动选择。";
  return wrap;
}
