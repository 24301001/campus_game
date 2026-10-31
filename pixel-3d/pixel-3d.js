/* pixel-3d.js — 3D 像素小人查看器（我的世界画风）
   全部代码只在这个目录里；宿主引一个 <script> 就能用 window.Pixel3D。
   吃的输入是形象编辑器那 12 个字段的 look 配方（和 mp/look.js 同一份数据），
   给的是一块能按住拖动 360° 转体、滚轮缩放的方块人。 */
(() => {
  'use strict';
  const VERSION = "1.0.0";

  /* ---------- §1 颜色 ----------
     shade 的式子照抄 mp/look.js:14：高光往暖、阴影往冷。
     中性灰的加减在像素画里会让衣服发脏，两边共用同一条式子，
     同一个配方才不会在四视图里是暖的、在 3D 里是灰的。 */
  const rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const hex = c => '#' + c.map(x => Math.max(0, Math.min(255, Math.round(x))).toString(16).padStart(2, '0')).join('');
  const shade = (h, k) => {
    const c = rgb(h);
    return hex(k >= 0
      ? [c[0] + (255 - c[0]) * k, c[1] + (255 - c[1]) * k * 0.93, c[2] + (255 - c[2]) * k * 0.80]
      : [c[0] * (1 + k * 1.08), c[1] * (1 + k), c[2] * (1 + k * 0.86)]);
  };
  const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
  /* 收进 [-180, 180]。⚠️ 180 那端必须留着：写成 x>=180 归 -180 的话，
     转到正背面的最后一帧 wrap180(-180) 会变成 0 ⇒ 点"背面"人反而转回正面。 */
  const wrap180 = a => { const x = ((a % 360) + 360) % 360; return x > 180 ? x - 360 : x };
  const BLEED = 0.06;          // 每格外扩一点点：相邻像素块之间不留发丝缝
  const NONE = () => { };

  /* ---------- §2 look 配方规范化 ----------
     规则与 mp/look.js:17 的 norm 一致（8 个颜色 + 4 个枚举）。
     模块自带一份是为了这个文件夹能整体搬走；两边对同一配方的判定结果相同，
     不存在"谁的 norm 说了算"的分裂。 */
  const COLORS = ['skin', 'hairColor', 'eyeColor', 'cloth', 'clothAlt', 'pants', 'accColor', 'packColor'];
  const CHOICE = {
    hairStyle: ['short', 'mid', 'long', 'ponytail', 'bun', 'twintails'],
    eye: ['round', 'narrow', 'dot'],
    acc: ['none', 'glasses', 'cap', 'scarf'],
    clothPattern: ['solid', 'stripe']
  };
  const FALLBACK = { skin: '#f2c9a0', hairStyle: 'short', hairColor: '#30251e', eye: 'round', eyeColor: '#332a2b', cloth: '#c94954', clothAlt: '#f3eee7', clothPattern: 'solid', pants: '#38516d', acc: 'none', accColor: '#b67a56', packColor: '#b4552f' };
  function normLook(value) {
    const v = value && typeof value === 'object' ? value : {};
    const out = { ...FALLBACK };
    for (const k of COLORS) if (typeof v[k] === 'string' && /^#[0-9a-f]{6}$/i.test(v[k])) out[k] = v[k].toLowerCase();
    for (const k in CHOICE) if (CHOICE[k].includes(v[k])) out[k] = v[k];
    return out;
  }

  /* ---------- §3 调色板（档位与 mp/look.js:81 的 C 一致）----------
     鞋色/书包色沿用地图 A2 同款，转过去再转回来还是同一个人。 */
  function palette(v) {
    return {
      skin: v.skin, skinL: shade(v.skin, .14), skinD: shade(v.skin, -.20), skinD2: shade(v.skin, -.36),
      hair: v.hairColor, hairL: shade(v.hairColor, .22), hairD: shade(v.hairColor, -.34),
      coat: v.cloth, coatL: shade(v.cloth, .20), coatD: shade(v.cloth, -.26),
      alt: v.clothAlt, altD: shade(v.clothAlt, -.20),
      pant: v.pants, pantL: shade(v.pants, .18), pantD: shade(v.pants, -.23),
      shoe: '#26282e', shoeL: '#454a54',
      eye: v.eyeColor,
      /* 书包现在是配方里的一个字段（packColor）。默认值仍是地图 A2 那只书包的 #b4552f；
         高光/暗部改由 shade 现算 —— 原来写死的 #d1704a / #8a3f22 与算出来的
         #c2724d / #854125 差不到 5%，换来的是"染成什么书包就是什么明暗"。 */
      pack: v.packColor, packL: shade(v.packColor, .18), packD: shade(v.packColor, -.24),
      tie: shade(v.cloth, .30),
      acc: v.accColor, accL: shade(v.accColor, .16), accD: shade(v.accColor, -.22)
    };
  }

  /* ---------- §4 体素坐标与盒子
     x 向右、y 向上、z 朝镜头（正面 = +z）。1 体素 = 贴图上 1 格。
     身高 28.8：腿 9.5 + 躯干 10 + 颈 1.3 + 头 8 ⇒ 3.6 头身，和四视图那套
     （头 7 行 / 全身 26 行 = 3.7）是同一种人。手臂各 3 宽贴在躯干两侧，
     肩宽 14 = 躯干 8 的 1.75 倍，正好对上四视图"躯干 9 列 + 袖子各 2 列"。

     ⚠️ 这套尺寸是刻意留缝的：颈那 1.3 行空档是为了让围巾能套上脖子而不和
        头/躯干的方块互相插入。两个盒子一旦互相插入，画家算法就没法稳定排序，
        转到某些角度会看到头发从手臂里翻出来。现在所有盒子要么分开、要么恰好
        共面相邻，而相邻那两面里总有一面不带贴图（见 §5 的 NONE 位）。 */
  const HEAD_BOT = 20.8, HEAD_TOP = 28.8, TORSO_TOP = 19.5, TORSO_BOT = 9.5;
  const box = (kind, x, y, z, w, h, d) => ({ kind, x, y, z, w, h, d });

  /* 面定义：O = (u=0,v=0) 那个角点，Au/Av = 每走 1 体素的方向（Av 恒朝下 ⇒ 第 0 行是顶行）。
     贴图列表头约定：front/back = 正对着这张脸的人看到的左右；side = "朝左站"的侧脸像
     （第 0 列是鼻尖那侧）。-X 面按这个约定看过去人变成朝右转，所以标 flip。 */
  const FACES = [
    { id: 'front', n: [0, 0, 1], O: b => [b.x, b.y + b.h, b.z + b.d], Au: [1, 0, 0], Av: [0, -1, 0], nu: b => b.w, nv: b => b.h },
    { id: 'back', n: [0, 0, -1], O: b => [b.x + b.w, b.y + b.h, b.z], Au: [-1, 0, 0], Av: [0, -1, 0], nu: b => b.w, nv: b => b.h },
    { id: 'right', n: [1, 0, 0], O: b => [b.x + b.w, b.y + b.h, b.z + b.d], Au: [0, 0, -1], Av: [0, -1, 0], nu: b => b.d, nv: b => b.h },
    { id: 'left', n: [-1, 0, 0], O: b => [b.x, b.y + b.h, b.z], Au: [0, 0, 1], Av: [0, -1, 0], nu: b => b.d, nv: b => b.h, flip: true },
    { id: 'top', n: [0, 1, 0], O: b => [b.x, b.y + b.h, b.z], Au: [1, 0, 0], Av: [0, 0, 1], nu: b => b.w, nv: b => b.d },
    { id: 'bottom', n: [0, -1, 0], O: b => [b.x, b.y, b.z], Au: [1, 0, 0], Av: [0, 0, 1], nu: b => b.w, nv: b => b.d }
  ];

  /* ---------- §5 面贴图：每个面产出一串 [u, v, w, h, 颜色]
     行号口径全部对齐 mp/look.js 的 headFront/headSide/headBack：
     头 8 行里第 0..1 行是发顶/刘海，第 2..6 行是脸（FACE=5），
     眼睛第 4 行（EY = HY+4），嘴第 5 行，下颌第 6 行，第 7 行是颈。
     每个生成器都按传进来的 (nu,nv) 铺，不写死 8 —— 侧面的宽是"厚度"，
     躯干侧面只有 4 格，写死 8 会画到隔壁面去。 */
  const EYE = [2, 5];              // 8 格脸的双眼列：关于中线 3.5 镜像
  function texSet(v, C) {
    const put = (t, x, y, w, h, c) => { if (c && w > 0 && h > 0) t.push([x, y, w, h, c]) };

    /* 三档眼型靠"占几格"分而不是靠颜色分（同四视图）：
       豆豆眼 1×1、圆眼 1 列 ×2 行（往上长一行）、细眼 2 列 ×1 行。
       ⚠️ 细眼在 3D 上是**往外**扩到 1..2 / 5..6：8 格宽的脸上往内扩会两眼相接，
          中间连鼻梁那一格都留不住（四视图是 7 格脸、只 1 格鼻梁，扩得开）。 */
    function eyes(t, row) {
      if (v.eye === 'dot') { put(t, EYE[0], row, 1, 1, C.eye); put(t, EYE[1], row, 1, 1, C.eye); return; }
      if (v.eye === 'narrow') { put(t, EYE[0] - 1, row, 2, 1, C.eye); put(t, EYE[1], row, 2, 1, C.eye); return; }
      put(t, EYE[0], row, 1, 1, C.eye); put(t, EYE[1], row, 1, 1, C.eye);
      put(t, EYE[0], row - 1, 1, 1, C.eye); put(t, EYE[1], row - 1, 1, 1, C.eye);
    }
    /* 镜圈上沿那一行按眼型定：圆眼的眼珠占第 3..4 行 ⇒ 圈要从第 2 行起才罩得住；
       细眼/豆豆眼只占第 4 行 ⇒ 圈从第 3 行起。正面和侧面共用这一个式子，
       否则转到 45° 时正面的圈和侧面的边接不上，看着像两副眼镜。 */
    const glassTop = () => (v.eye === 'round' ? 2 : 3);
    const crown = (t, w) => { put(t, 0, 0, w, 1, C.hairL); put(t, 0, 1, w, 1, C.hair) };

    function headFront(v2, C2, t, W, H) {
      crown(t, W);
      put(t, 0, 2, W, 5, C.skin);
      put(t, 0, 2, 1, 5, C.skinL);                    // 左颊受光（光自左上）
      put(t, W - 1, 2, 1, 5, C.skinD);                // 右颊背光
      put(t, 1, 6, W - 2, 1, C.skinD);                // 下颌收边
      put(t, 0, 7, W, 1, C.skinD2);                   // 颈
      eyes(t, 4);
      put(t, 3, 5, 2, 1, shade(C.skinD, -.28));       // 嘴（脸的倒数第二行，关于中线对称）
      if (v.acc === 'glasses') {
        /* 两只镜圈各罩一只眼：上沿只铺自己那三列（cols 0..2 / 5..7），中间空两格 ⇒
           读得出是"两个圈"。鼻梁压在第 gt+1 行那两格（两眼之间），只有一行高。
           ⚠️ 上沿不许横贯脸宽、鼻梁不许占两行以上、并且**不画下沿**：
              第 5 行是嘴，铺上去等于给嘴染一圈镜框色；上沿一贯通就成了发带
              （这两条就是实测"眼镜显示混乱"的成因）。 */
        const gt = glassTop();
        put(t, 0, gt, 3, 1, C.acc);                         // 左镜圈上沿
        put(t, W - 3, gt, 3, 1, C.acc);                     // 右镜圈上沿
        put(t, 0, gt + 1, 1, 4 - gt, C.acc);                // 左外框：沿脸左边缘竖到眼行
        put(t, W - 1, gt + 1, 1, 4 - gt, C.acc);            // 右外框
        put(t, 3, gt + 1, 2, 1, C.accD);                    // 鼻梁：两眼之间那一行
      }
    }
    /* 侧脸像：只有最前面两列是脸（额头 / 鼻尖 / 下巴那条轮廓，鼻尖在第 0 列），
       第 2 列往后整片是头发；第 0..1 行由 crown 铺满全宽 = 刘海压额，额头才有那个台阶。

       ⚠️ 侧面**不画眼睛**（实测反馈"左侧右侧应该全是头发"）。四视图那种"侧视留一只
          近眼"是 2D 的画法；3D 里侧面是一块真的、与脸成 90° 的平面，瞳孔长在正面那块上，
          转到 ±90° 时正面被窄面剔除 ⇒ 侧面只剩头发才对。眼睛要看得见就得往正面转。
       ⚠️ 也**不留耳朵位**（第二轮实测："左右两侧不留耳朵位置了，把中间填上头发"）：耳朵那
          两格嵌在整片发里读成一块色斑，紧贴侧脸皮肤又读成"脸上缺了一格"。取掉之后侧面是
          一块干净的发，只留前两列侧脸轮廓 —— 也更接近我的世界那种"侧面就是头发，转过来才有脸"。 */
    function headSide(v2, C2, t, W, H) {
      crown(t, W);
      put(t, 0, 2, 2, 4, C.skin);                     // 侧脸只剩前两列
      put(t, 2, 2, W - 2, 5, C.hair);                 // 中间到后脑整片是发（不留耳朵位）
      put(t, 2, 2, W - 2, 1, C.hairL);                // 靠脸那一行提亮：整片发才不像一块色板
      put(t, W - 1, 2, 1, 5, C.hairD);                // 后脑背光边
      put(t, 0, 2, 1, 1, C.skinL);                    // 额头受光
      put(t, 0, 4, 1, 1, C.skinL);                    // 鼻尖受光（侧脸第二个台阶）
      put(t, 0, 6, 2, 1, C.skinD);                    // 下巴
      put(t, 2, 6, W - 2, 1, C.hairD);                // 发梢收边：和底下的脖子分界
      put(t, 0, 7, W, 1, C.skinD2);                   // 颈：⚠️ 颈椎块深度和脑袋一样是 8，这一行必须
                                                       //    铺满皮肤，否则侧脸第 6/7 行交界会留一个
                                                       //    2×1 空洞，转过去看就是一个白缺口
      if (v.acc === 'glasses') {
        /* 侧面两笔：鼻尖那一列（第 0 列，和正面第 0/7 列是同一条竖棱）上的一条镜圈外沿，
           行号跟着正面的 glassTop 走；再加一条镜腿从镜圈横过太阳穴绕到耳后。
           ⚠️ 镜腿只有 1 行高，且外沿只占第 0 列：侧面再铺一条横贯整块的头带就不是眼镜了。 */
        const gt = glassTop();
        put(t, 0, gt, 1, 5 - gt, C.acc);                       // 镜圈外沿（竖）
        put(t, 1, gt + 1, W - 1, 1, C.accD);                   // 镜腿
      }
    }
    function headBack(v2, C2, t, W, H) {
      crown(t, W);
      put(t, 0, 2, W, 5, C.hair);
      put(t, 0, 2, 1, 5, C.hairL);
      put(t, W - 1, 2, 1, 5, C.hairD);
      put(t, 3, 2, 2, 1, shade(C.hair, .2));           // 发旋小高光（不是横贯亮带）
      put(t, 0, 7, W, 1, C.hairD);
      /* 镜腿只到脑袋左右两角那两格：横贯后脑的那是一条头带，不是眼镜。 */
      if (v.acc === 'glasses') { put(t, 0, 3, 2, 1, C.accD); put(t, W - 2, 3, 2, 1, C.accD) }
    }
    function headTop(v2, C2, t, W, D) {
      put(t, 0, 0, W, D, C.hair);
      put(t, 0, 0, W, 2, C.hairD);                    // 靠后脑那两行压暗（顶光下的弧度）
      put(t, 2, D - 3, W - 4, 2, C.hairL);            // 发旋在靠前那侧
    }

    /* 躯干：肩顶受光 → 胸 → 胸腰分界 → 衣摆；正面有前襟和口袋线，背面有背带压肩。
       条纹按两行一切换 cloth/clothAlt（和四视图的横条纹同一节奏）。 */
    function torsoFace(face) {
      return (v2, C2, t, W, H) => {
        const stripe = v.clothPattern === 'stripe';
        put(t, 0, 0, W, 1, C.coatL);
        for (let r = 1; r < H - 1; r++) put(t, 0, r, W, 1, (stripe && ((r / 2 | 0) % 2 === 1)) ? C.alt : C.coat);
        put(t, 0, H - 1, W, 1, C.coatD);
        put(t, 0, 1, 1, H - 2, stripe ? C.altD : C.coatL);
        put(t, W - 1, 1, 1, H - 2, C.coatD);
        if (H > 6) put(t, 0, 4, W, 1, 'rgba(0,0,0,.13)');
        if (face === 'front' && W >= 6) {
          put(t, W >> 1, 1, 1, H - 2, C.coatD);                                // 前襟
          put(t, 1, H - 3, 2, 1, C.coatD); put(t, W - 3, H - 3, 2, 1, C.coatD); // 口袋线（关于中线镜像）
        } else if (face === 'back' && W >= 6) {
          put(t, 1, 0, 1, 2, C.packD); put(t, W - 2, 0, 1, 2, C.packD);         // 背带压肩
        }
      };
    }
    const torsoTop = (v2, C2, t, W, D) => { put(t, 0, 0, W, D, C.coatL); put(t, 0, 0, W, 1, shade(C.coatL, .12)) };

    /* 手臂：袖子（条纹跟躯干同一节奏）+ 袖口压暗 + 底下两行是手 */
    function armFace(v2, C2, t, W, H) {
      const stripe = v.clothPattern === 'stripe';
      for (let r = 0; r < H - 2; r++) put(t, 0, r, W, 1, (stripe && ((r / 2 | 0) % 2 === 1)) ? C.alt : C.coat);
      put(t, 0, H - 3, W, 1, C.coatD);
      put(t, 0, H - 2, W, 1, C.skin);
      put(t, 0, H - 1, W, 1, C.skinD);
    }
    /* 腿：裤子到底，最后两行鞋（鞋面那行受光）。顶面不画 —— 和躯干底面共面，画了会打架。 */
    function legFace(v2, C2, t, W, H) {
      put(t, 0, 0, W, H - 2, C.pant);
      put(t, 0, H - 3, W, 1, C.pantD);
      put(t, 0, H - 2, W, 1, C.shoeL);
      put(t, 0, H - 1, W, 1, C.shoe);
    }
    /* 附加块（书包/帽子/围巾/发束/扎带）三段：顶行受光、中间主色、底行压暗。
       ⚠️ 矮块（帽壳 1.8 / 围巾 1.1）不能再按"整行"分：三条各占 1 行的话，后画的
          暗行会把主色整个盖掉，配饰染色等于没染。按高度切比例，主色保证有活着的一带。 */
    const slab = (light, base, dark) => (v2, C2, t, W, H) => {
      if (H >= 3) { put(t, 0, 0, W, 1, light); put(t, 0, 1, W, H - 2, base); put(t, 0, H - 1, W, 1, dark); return }
      const top = Math.max(.34, H * .28), bot = Math.max(.3, H * .24);
      put(t, 0, 0, W, top, light);
      put(t, 0, top, W, Math.max(.18, H - top - bot), base);
      put(t, 0, H - bot, W, bot, dark);
    };
    const fill = c => (v2, C2, t, W, H) => { put(t, 0, 0, W, H, c) };
    const wrap = (face, top, bottom) => ({ front: face, back: face, side: face, top: top || face, bottom: bottom || NONE });

    return {
      head: { front: headFront, back: headBack, side: headSide, top: headTop, bottom: fill(C.skinD2) },
      torso: { front: torsoFace('front'), back: torsoFace('back'), side: torsoFace('side'), top: torsoTop, bottom: fill(C.pantD) },
      arm: wrap(armFace, fill(C.coatL), fill(C.skinD)),
      leg: wrap(legFace, NONE, fill(C.shoe)),
      neck: wrap(slab(C.skinL, C.skin, C.skinD), NONE, NONE),
      pack: wrap(slab(C.packL, C.pack, C.packD), slab(C.packL, C.pack, C.packD), NONE),
      acc: wrap(slab(C.accL, C.acc, C.accD), slab(C.accL, C.acc, C.accD), NONE),
      hair: wrap(slab(C.hairL, C.hair, C.hairD), fill(C.hair), NONE),
      tie: wrap(fill(C.tie), fill(C.tie), NONE)
    };
  }

  /* ---------- §6 装配：配方 → 盒子清单
     发型和配饰全部用实心方块，不做半透明片：半透明面在同深度里没法稳定排序，
     转体时就会闪。只有眼镜例外（它只有几根线宽，做成方块会糊脸），
     走 §5 的贴图路线：正面镜框 + 两侧镜腿 + 后脑一段。 */
  function buildModel(v) {
    const C = palette(v), tex = texSet(v, C);
    const B = [];
    const add = b => { b.tex = tex[b.kind]; B.push(b) };

    add(box('head', -4, HEAD_BOT, -4, 8, HEAD_TOP - HEAD_BOT, 8));
    /* 颈：4 宽 × 8 深（和脑袋同进深）。⚠️ 深度必须铺满 8 —— 只留 3 的话，
       从侧面看脑袋底下会透出背景，像下巴掉了一块（实测正侧面各一个白缺口）。
       宽度仍然只有 4，正面才读得出"脖子"而不是脑袋直接插在身体上。 */
    add(box('neck', -2, TORSO_TOP, -4, 4, HEAD_BOT - TORSO_TOP, 8));
    add(box('torso', -4, TORSO_BOT, -2, 8, TORSO_TOP - TORSO_BOT, 4));
    add(box('arm', -7, 10.5, -1.5, 3, 9, 3));
    add(box('arm', 4, 10.5, -1.5, 3, 9, 3));
    add(box('leg', -3.5, 0, -1.5, 3, TORSO_BOT, 3));
    add(box('leg', 0.5, 0, -1.5, 3, TORSO_BOT, 3));
    add(box('pack', -3, 12, -4, 6, 6, 2));          // 书包常驻：转到背面有东西读，才确认是同一个人在转

    /* 发型。束点全部落在头顶正中或耳后，和四视图口径一致
       （马尾正面只有束根那一小截 + 脑袋两侧各露一点边）。
       ⚠️ 垂下来的发束一律落在脑袋**侧面靠后**那一档（z ≤ -2.2）：挂到胸前就成"两缕头发糊脸"，
          贴到手臂那一列（x -7..-4、z -1.5..1.5）上又会和袖子互相插入 —— 一旦插入，
          画家算法在某个角度就会让头发从手臂里翻出来。 */
    if (v.hairStyle === 'mid' || v.hairStyle === 'long') {
      const len = v.hairStyle === 'long' ? 9 : 5;
      add(box('hair', -4.2, HEAD_BOT - len, -5.4, 8.4, len, 1.4));              // 后发帘
      /* 两侧各一条贴着脑袋侧面、和后发帘接成一片的发束（z -4..-2.2，与后发帘只在 z=-4 那面
         共面相邻，不互相插入）。正面看出去只剩它们从脑袋左右探出的一条边 ——
         和四视图 curtain 那两条剪影列（x5 / x13）同一个意思。 */
      for (const s of [-1, 1]) add(box('hair', s < 0 ? -5.4 : 4.0, HEAD_BOT - len, -4.0, 1.4, len, 1.8));
    }
    if (v.hairStyle === 'ponytail') {
      /* 束根压在头顶后沿，帽壳也坐在那一档 ⇒ 戴上帽子就不画束根，只留垂下来的辫子
         （辫子整段在帽壳后缘 z=-4.5 之外，转体时不会和帽子互相插入）。 */
      if (v.acc !== 'cap') add(box('tie', -1.7, 28.0, -5.6, 3.4, 1.6, 1.35));
      add(box('hair', -1.5, 22.4, -6.6, 3.0, 5.6, 1.6));
      add(box('hair', -1.2, 17.4, -6.3, 2.4, 5.0, 1.2));                        // 第二段垂到肩胛（和上一段首尾相接）
      add(box('hair', -1.1, 14.8, -6.0, 2.2, 2.6, 1.0));                        // 发梢
    }
    if (v.hairStyle === 'bun') {
      /* 丸子头是整个造型都在头顶上方的，和帽子占同一块地方 ⇒ 戴帽就收掉丸子，
         不然两者重叠 0.9 格，画家算法转到某些角度会看到发髻从帽子里翻出来。 */
      if (v.acc !== 'cap') {
        add(box('tie', -2.8, HEAD_TOP, -2.8, 5.6, 0.9, 5.6));                    // 扎带把球和发顶切开
        add(box('hair', -2.4, 29.7, -2.4, 4.8, 3.0, 4.8));                       // 球坐在扎带上
      }
    }
    if (v.hairStyle === 'twintails') {
      /* 双马尾扎在**脑后两侧**：束点落在耳后上方（y 25.2..26.7），两束贴着脑袋侧面往下垂，
         整块落在 z -4..-2 这一档（和书包同一进深）。从背面看两束正好接在后脑那片发的左右
         两个角上，读得出是一个整体；从侧面看是后脑垂下来的头发，不再糊在脸前面。
         ⚠️ x 收到 ±4 为止（贴着脑袋侧面的那一列），垂下的部分在书包（x -3..3）和
            手臂（z -1.5..1.5）之外，谁也不插谁。 */
      for (const s of [-1, 1]) {
        const xo = s < 0 ? -6.2 : 4.0;
        add(box('tie', xo, 25.2, -4.0, 2.2, 1.5, 2.0));                          // 扎带（耳后）
        add(box('hair', xo, 16.4, -4.0, 2.2, 8.8, 2.0));                         // 发束
        add(box('hair', xo + 0.2, 13.6, -3.8, 1.8, 2.8, 1.6));                   // 发梢
      }
    }

    if (v.acc === 'cap') {
      add(box('acc', -4.5, HEAD_TOP, -4.5, 9.0, 1.8, 9.0));                        // 帽身坐在头顶
      add(box('acc', -4.5, 28.4, 4.5, 9.0, 0.9, 3.0));                             // 帽檐朝前，压在发际线那一档，不占额头行
    }
    if (v.acc === 'scarf') {
      /* 围巾套在那 1.3 行的颈空档里，四片围成一圈，全部贴在颈盒（4 宽 × 8 深）的外侧，
         谁也不插进谁 —— 插入会让画家算法在某个角度突然翻面。 */
      const y = 19.6, h = 1.1;
      add(box('acc', -2.4, y, 4.0, 4.8, h, 0.9));                                 // 喉结前那一圈
      /* 后颈那一圈：中长发/长发的后发帘就挂在这块地方（z 到 -4.0），再塞一片必然互相插入。
         头发本来也把它整个盖住 ⇒ 有后发帘时干脆不生成这一片。 */
      if (v.hairStyle !== 'mid' && v.hairStyle !== 'long') add(box('acc', -2.4, y, -4.9, 4.8, h, 0.9));
      add(box('acc', -2.9, y, -4, 0.9, h, 8));                                    // 左/右两片
      add(box('acc', 2.0, y, -4, 0.9, h, 8));
      add(box('acc', 0.6, 14.6, 4.05, 2.2, 5.0, 0.7));                            // 从前襟垂下来的巾尾
    }

    /* 包围盒：取景、旋转中心、会不会被画布切掉，全部由它算 */
    let minX = 9, maxX = -9, minY = 99, maxY = -99, minZ = 9, maxZ = -9;
    for (const b of B) {
      minX = Math.min(minX, b.x); maxX = Math.max(maxX, b.x + b.w);
      minY = Math.min(minY, b.y); maxY = Math.max(maxY, b.y + b.h);
      minZ = Math.min(minZ, b.z); maxZ = Math.max(maxZ, b.z + b.d);
    }
    return { boxes: B, look: v, C, minY, maxY, centerY: (minY + maxY) / 2, spanY: maxY - minY, spanH: 2 * Math.max(maxX - minX, maxZ - minZ) };
  }

  /* ---------- §7 渲染：正交投影 + 相机固定光 + 画家算法
     光固定在相机空间（左上前方）：模型转 ⇒ 各面明度跟着换，这是"转起来了"
     读得出来的关键（我的世界物品栏里的小人也是这个做法）。
     正交投影下轴对齐面的投影必是平行四边形 ⇒ 一次 setTransform 把整个
     "贴图坐标系"铺上去，每格 1 次 fillRect，比逐格算投影便宜且硬边。 */
  const LIGHT = (() => { const l = [-0.34, 0.86, 0.38], m = Math.hypot(l[0], l[1], l[2]); return l.map(x => x / m) })();
  const faceLight = n => clamp(-0.06 + 0.32 * (n[0] * LIGHT[0] + n[1] * LIGHT[1] + n[2] * LIGHT[2]), -0.30, 0.22);
  const FACE_KEY = { front: 'front', back: 'back', right: 'side', left: 'side', top: 'top', bottom: 'bottom' };

  function draw(ctx, model, o) {
    const yaw = o.yaw * Math.PI / 180, pitch = o.pitch * Math.PI / 180;
    const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
    const rot = (x, y, z) => {
      const rx = x * cy + z * sy, rz = -x * sy + z * cy;
      return [rx, y * cp - rz * sp, y * sp + rz * cp];
    };
    const S = o.scale, ox = o.cx, oy = o.cy, mid = model.centerY;
    const pt = p => { const r = rot(p[0], p[1] - mid, p[2]); return [ox + r[0] * S, oy - r[1] * S] };

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, o.W, o.H);
    ctx.imageSmoothingEnabled = false;

    /* 接地影：贴在 y=0 的水平"像素椭圆"，永远第一个画（方块都在它上面，
       所以任何俯角下画家顺序都对）。pitch=0 时它退化成一条线 ⇒ 默认给 12° 俯角。 */
    ctx.fillStyle = '#0e121c';
    ctx.globalAlpha = o.shadow === undefined ? 0.32 : o.shadow;
    for (let row = -4; row <= 4; row++) {
      const q = 1 - (row * row) / 20.25;
      if (q <= 0) continue;
      const dx = Math.round(6.5 * Math.sqrt(q));
      const A = pt([-dx - 0.5, 0.02, row - 0.5]), B2 = pt([dx + 0.5, 0.02, row - 0.5]), C2 = pt([-dx - 0.5, 0.02, row + 0.5]);
      ctx.setTransform(B2[0] - A[0], B2[1] - A[1], C2[0] - A[0], C2[1] - A[1], A[0], A[1]);
      ctx.fillRect(0, 0, 1, 1);
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;

    /* 收集可见面：背面剔除（法线转完 z≤0 一律不要），深度取四角均值。 */
    const quads = [];
    for (let bi = 0; bi < model.boxes.length; bi++) {
      const b = model.boxes[bi];
      for (const f of FACES) {
        const n = rot(f.n[0], f.n[1], f.n[2]);
        if (n[2] <= 0.0001) continue;
        const nu = f.nu(b), nv = f.nv(b);
        if (nu <= 0 || nv <= 0) continue;
        const O = f.O(b), A = f.Au, V = f.Av;
        const P0 = pt(O);
        const Pu = pt([O[0] + A[0], O[1] + A[1], O[2] + A[2]]);
        const Pv = pt([O[0] + V[0], O[1] + V[1], O[2] + V[2]]);
        const a = Pu[0] - P0[0], bb = Pu[1] - P0[1], c = Pv[0] - P0[0], dd = Pv[1] - P0[1];
        if (Math.abs(a * dd - bb * c) * nu * nv < 0.6) continue;            // 投影后不到一格的窄面不必画
        const cz = (du, dv) => rot(O[0] + A[0] * du + V[0] * dv, O[1] + A[1] * du + V[1] * dv, O[2] + A[2] * du + V[2] * dv)[2];
        quads.push({
          depth: (cz(0, 0) + cz(nu, 0) + cz(nu, nv) + cz(0, nv)) / 4,
          box: bi, face: f, a, bb, c, dd, x0: P0[0], y0: P0[1], nu, nv, k: faceLight(n), tex: b.tex
        });
      }
    }
    quads.sort((p, q) => p.depth - q.depth || p.box - q.box);

    for (const q of quads) {
      const gen = q.tex && q.tex[FACE_KEY[q.face.id]];
      ctx.setTransform(q.a, q.bb, q.c, q.dd, q.x0, q.y0);
      if (gen) {
        const cells = [];
        gen(model.look, model.C, cells, q.nu, q.nv);
        const flip = !!q.face.flip;
        for (const [u, vv, w, h, col] of cells) {
          if (u < 0 || vv < 0 || u >= q.nu || vv >= q.nv) continue;
          const ww = Math.min(w, q.nu - u), hh = Math.min(h, q.nv - vv);
          ctx.fillStyle = col;
          const uu = flip ? q.nu - u - ww : u;
          ctx.fillRect(uu - BLEED, vv - BLEED, ww + 2 * BLEED, hh + 2 * BLEED);
        }
      }
      if (q.k < 0) ctx.fillStyle = 'rgba(10,16,28,' + (-q.k).toFixed(3) + ')';
      else if (q.k > 0.004) ctx.fillStyle = 'rgba(255,238,200,' + (q.k * 0.55).toFixed(3) + ')';
      else continue;
      ctx.fillRect(-BLEED, -BLEED, q.nu + 2 * BLEED, q.nv + 2 * BLEED);
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  /* ---------- §8 取景：整圈转都不出画
     横向余量取 max(肩宽, 前后深)：侧过去时"前后深"会变成横向跨度，
     马尾/书包在头后 2.6 格，只按肩宽算的话正侧面会把尾巴切掉。
     W/H 一律传设备像素，缩放和 dpr 已经算在里面。 */
  function fit(model, W, H, zoom) {
    return Math.max(1, Math.min(H / (model.spanY + 1.6), W / (model.spanH + 1.6)) * 0.90 * (zoom || 1));
  }

  /* ---------- §9 查看器：按住拖动 360°、滚轮缩放、自转、四个视角快捷键 ---------- */
  const PITCH_MIN = -14, PITCH_MAX = 74;
  const VIEW = { front: [0, 12], left: [-90, 12], right: [90, 12], back: [180, 15] };
  const HUD = `<div class="p3d-stage"><canvas class="p3d-cv" role="img" aria-label="3D 像素小人"></canvas><span class="p3d-hint">按住拖动可 360° 观察</span></div>
    <div class="p3d-bar">
      <button type="button" class="p3d-v" data-v="front">正面</button>
      <button type="button" class="p3d-v" data-v="right">右侧</button>
      <button type="button" class="p3d-v" data-v="back">背面</button>
      <button type="button" class="p3d-v" data-v="left">左侧</button>
      <span class="p3d-gap"></span>
      <button type="button" class="p3d-t" data-a="out" title="缩小">−</button>
      <button type="button" class="p3d-t" data-a="in" title="放大">+</button>
      <button type="button" class="p3d-t p3d-spin" data-a="spin">自转</button>
      <button type="button" class="p3d-t" data-a="reset">复位</button>
    </div>`;

  function create(look, opts) {
    opts = opts || {};
    const el = document.createElement('div');
    el.className = 'p3d-root';
    el.innerHTML = HUD;
    const cv = el.querySelector('.p3d-cv');
    const spinBtn = el.querySelector('.p3d-spin');
    const live = opts.interactive !== false;
    if (!live) { el.querySelector('.p3d-bar').remove(); el.querySelector('.p3d-hint').remove(); el.classList.add('p3d-static') }

    const v = {
      dpr: 1, zoom: opts.zoom || 1,
      yaw: opts.yaw === undefined ? -24 : opts.yaw,
      pitch: opts.pitch === undefined ? 12 : opts.pitch,
      spin: live && opts.autoRotate !== false,
      look: null, model: null, tween: null, raf: 0, dirty: true, drag: null, ro: null, visible: true
    };

    function render() {
      const r = cv.getBoundingClientRect();
      if (!el.isConnected) { v.visible = false; return false }
      if (!r.width || !r.height) { v.visible = false; return false }   // 面板被 hidden：量不到尺寸
      v.visible = true;
      const dpr = Math.min(3, window.devicePixelRatio || 1);
      const W = Math.max(1, Math.round(r.width * dpr)), H = Math.max(1, Math.round(r.height * dpr));
      if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H }
      v.dpr = dpr;
      v.dirty = false;
      draw(cv.getContext('2d'), v.model, {
        W, H, cx: W / 2, cy: H / 2, scale: fit(v.model, W, H, v.zoom),
        yaw: v.yaw, pitch: v.pitch, shadow: opts.shadow
      });
      return true;
    }
    function setLook(next) { v.look = normLook(next); v.model = buildModel(v.look); v.dirty = true; render(); return api }

    function loop() {
      v.raf = 0;
      if (!el.isConnected) return;                                  // 面板关掉 ⇒ 循环自己收摊，不留后台空转
      const now = performance.now();
      if (v.tween) {
        const t = clamp((now - v.tween.t0) / v.tween.dur, 0, 1);
        const e = t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        v.yaw = wrap180(v.tween.from + (v.tween.to - v.tween.from) * e);
        v.pitch = v.tween.p0 + (v.tween.p1 - v.tween.p0) * e;
        if (t >= 1) v.tween = null;
        v.dirty = true;
      }
      if (v.spin && !v.drag) { v.yaw = wrap180(v.yaw + 0.42); v.dirty = true }
      if (v.dirty) render();
      /* 面板收起来（hidden ⇒ 量不到尺寸）⇒ 循环收摊，别在背后空转 60fps。
         重新展开由 ResizeObserver 接管：尺寸从 0 变回来那一刻再 kick。 */
      if ((v.spin && v.visible) || v.tween || v.drag) v.raf = requestAnimationFrame(loop);
    }
    function kick() { if (!v.raf) v.raf = requestAnimationFrame(loop) }

    function setView(name) {
      const t = VIEW[name]; if (!t) return api;
      /* 补间走最短那条路：从 170° 回 0° 不该倒着绕一大圈。 */
      let from = v.yaw, to = t[0];
      while (to - from > 180) to -= 360;
      while (to - from < -180) to += 360;
      v.tween = { from, to, p0: v.pitch, p1: t[1], t0: performance.now(), dur: 320 };
      v.spin = false;
      if (spinBtn) spinBtn.classList.remove('on');
      kick();
      return api;
    }
    function reset() { v.zoom = 1; return setView('front') }

    if (live) {
      cv.style.touchAction = 'none';
      cv.tabIndex = 0;
      cv.addEventListener('pointerdown', e => {
        if (e.button !== 0) return;
        v.drag = { id: e.pointerId, x: e.clientX, y: e.clientY, yaw: v.yaw, pitch: v.pitch };
        v.tween = null;
        cv.setPointerCapture(e.pointerId);
        e.preventDefault();
      });
      cv.addEventListener('pointermove', e => {
        const d = v.drag;
        if (!d || e.pointerId !== d.id) return;
        v.yaw = wrap180(d.yaw + (e.clientX - d.x) * 0.45);
        v.pitch = clamp(d.pitch - (e.clientY - d.y) * 0.34, PITCH_MIN, PITCH_MAX);
        v.dirty = true; render();
      });
      const up = e => { if (v.drag && e.pointerId === v.drag.id) { v.drag = null; kick() } };
      cv.addEventListener('pointerup', up);
      cv.addEventListener('pointercancel', up);
      cv.addEventListener('lostpointercapture', () => { v.drag = null });
      cv.addEventListener('wheel', e => {
        e.preventDefault();
        v.zoom = clamp(v.zoom * (e.deltaY > 0 ? 0.9 : 1.1), 0.6, 2.6);
        v.dirty = true; render();
      }, { passive: false });
      cv.addEventListener('keydown', e => {
        const k = e.key;
        if (k === 'ArrowLeft') v.yaw = wrap180(v.yaw - 15);
        else if (k === 'ArrowRight') v.yaw = wrap180(v.yaw + 15);
        else if (k === 'ArrowUp') v.pitch = clamp(v.pitch + 8, PITCH_MIN, PITCH_MAX);
        else if (k === 'ArrowDown') v.pitch = clamp(v.pitch - 8, PITCH_MIN, PITCH_MAX);
        else if (k === '+' || k === '=') v.zoom = clamp(v.zoom * 1.12, 0.6, 2.6);
        else if (k === '-') v.zoom = clamp(v.zoom / 1.12, 0.6, 2.6);
        else if (k === 'r' || k === 'R') return void reset();
        else return;
        e.preventDefault(); v.tween = null; v.dirty = true; render();
      });
      el.addEventListener('click', e => {
        const b = e.target.closest('button'); if (!b) return;
        if (b.dataset.v) return setView(b.dataset.v);
        if (b.dataset.a === 'spin') { v.spin = !v.spin; b.classList.toggle('on', v.spin); kick(); return }
        if (b.dataset.a === 'in') v.zoom = clamp(v.zoom * 1.16, 0.6, 2.6);
        else if (b.dataset.a === 'out') v.zoom = clamp(v.zoom / 1.16, 0.6, 2.6);
        else if (b.dataset.a === 'reset') return reset();
        v.dirty = true; render();
      });
      spinBtn.classList.toggle('on', v.spin);
      /* 面板隐藏时量到 0，显示出来那一刻必须重画一次；ResizeObserver 正好管这件事，
         顺带把窗口缩放、面板改宽一起接上。 */
      if (window.ResizeObserver) v.ro = new ResizeObserver(() => { v.dirty = true; kick() }), v.ro.observe(cv);
    }

    const api = {
      el, canvas: cv,
      get state() { return { yaw: Math.round(v.yaw), pitch: Math.round(v.pitch), zoom: +v.zoom.toFixed(2), spin: v.spin, look: v.look } },
      setLook,
      render: () => { v.dirty = true; render(); return api },
      setView, reset,
      resize: () => { v.dirty = true; kick(); return api },
      snapshot: type => cv.toDataURL(type || 'image/png'),
      destroy: () => { if (v.raf) cancelAnimationFrame(v.raf); v.raf = 0; if (v.ro) v.ro.disconnect(); el.remove() }
    };
    setLook(look);
    kick();
    return api;
  }

  /* mount：同一个容器只挂一个查看器。个人主页每改一个控件都会调 preview()，
     重建 DOM 会把拖动状态和 rAF 一起丢，所以这里认出容器上已有的实例。 */
  function mount(container, look, opts) {
    if (!container) return null;
    const prev = container.__p3d;
    if (prev && prev.el.parentNode === container) { prev.setLook(look); return prev }
    if (prev) { try { prev.destroy() } catch (e) { } }
    const viewer = create(look, opts);
    container.replaceChildren(viewer.el);
    container.__p3d = viewer;
    viewer.render();                                    // 挂进 DOM 之后再画一次：create 时还量不到尺寸
    return viewer;
  }
  function unmount(container) {
    const p = container && container.__p3d;
    if (p) { p.destroy(); delete container.__p3d }
    return !!p;
  }

  /* renderTo：给一块现成的 canvas 画一张静态 3D（导出图片、别人自己做缩略图用）。
     没有布局可量 ⇒ 尺寸按参数来，和 §9 走同一个 draw()。 */
  function renderTo(cv, look, opt) {
    opt = opt || {};
    const model = buildModel(normLook(look));
    const dpr = Math.min(3, window.devicePixelRatio || 1);
    const W = Math.round((opt.width || 140) * dpr), H = Math.round((opt.height || 176) * dpr);
    cv.width = W; cv.height = H;
    draw(cv.getContext('2d'), model, {
      W, H, cx: W / 2, cy: H / 2, scale: fit(model, W, H, opt.zoom || 1),
      yaw: opt.yaw === undefined ? -20 : opt.yaw,
      pitch: opt.pitch === undefined ? 12 : opt.pitch, shadow: opt.shadow
    });
    return cv;
  }

  window.Pixel3D = {
    VERSION, FALLBACK, normLook, palette, FACES,
    model: look => buildModel(normLook(look)),
    create, mount, unmount, renderTo,
    snapshot: look => {                                   // 无 DOM：离屏画一张再转 dataURL
      const cv = document.createElement('canvas');
      renderTo(cv, look, { width: 140, height: 176 });
      return cv.toDataURL('image/png');
    }
  };
})();
