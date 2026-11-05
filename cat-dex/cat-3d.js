/* cat-3d.js — 猫咪图鉴里的方块猫 3D 预览
   ---------------------------------------------------------
   只做一件事：把 `cat-dex.js` 里那只 2D 像素猫，按同一套毛色烘成一个能拖着转的方块猫。
   相机、光照、画家算法、拖动/滚轮/四视角全是 `pixel-3d/pixel-3d.js` 那一套 ——
   本文件只负责"猫的盒子从哪来"，渲染器一行没抄。

   依赖（顺序不能反）：
     1. 主地图脚本（提供 top-level 的 `CAT_PAL`，毛色唯一的真相）
     2. pixel-3d/pixel-3d.js（window.Pixel3D，>= 1.1.0：要有 opts.buildModel）
     3. 本文件
     4. cat-dex/cat-dex.js

   用法：
     CatDex3D.mount(container, "cat_daju", { wear: "bow" })   → 挂一个可拖动的查看器
     CatDex3D.unmount(container)
     CatDex3D.thumb(canvas, "cat_daju", { width: 140, height: 176 })  → 画一张静态图
     CatDex3D.snapshot("cat_daju")                            → dataURL
     CatDex3D.model("cat_daju")                               → 盒子清单（自检/离线用）
   ========================================================= */
(function () {
  "use strict";

  var VERSION = "1.0.0";

  /* ---------- §1 颜色 ----------
     和 pixel-3d.js §1 同一条式子（高光往暖、阴影往冷）。CAT_PAL 里四只猫都自带
     furL/furD，正常走不到这里；只有狸花少了某个派生色、或脱离地图单开时才现算。 */
  function rgb(h) { return [1, 3, 5].map(function (i) { return parseInt(h.slice(i, i + 2), 16) }); }
  function hex(c) {
    return "#" + c.map(function (x) {
      return Math.max(0, Math.min(255, Math.round(x))).toString(16).padStart(2, "0");
    }).join("");
  }
  function shade(h, k) {
    var c = rgb(h);
    return hex(k >= 0
      ? [c[0] + (255 - c[0]) * k, c[1] + (255 - c[1]) * k * 0.93, c[2] + (255 - c[2]) * k * 0.80]
      : [c[0] * (1 + k * 1.08), c[1] * (1 + k), c[2] * (1 + k * 0.86)]);
  }

  var PAL_KEY = {
    cat_daju: "DAJU", cat_guanzhang: "GUANZHANG",
    cat_zhima: "ZHIMA", cat_lihua: "LIHUA"
  };
  /* 脱离地图单开本模块时的兜底：一只灰猫。不拿它当第二份毛色表 ——
     只要主脚本在，毛色一律读 CAT_PAL。 */
  var FALLBACK_PAL = {
    fur: "#9a9184", furL: "#b9b0a1", furD: "#6c655b",
    belly: "#efe8da", ear: "#c09088", nose: "#b07a74", eye: "#4a6a48", paw: "#efe8da"
  };

  function palOf(catId) {
    var p = null;
    try { if (typeof CAT_PAL !== "undefined") p = CAT_PAL[PAL_KEY[catId]] || null; } catch (e) { }
    p = p || FALLBACK_PAL;
    return {
      fur: p.fur,
      furL: p.furL || shade(p.fur, 0.22),
      furD: p.furD || shade(p.fur, -0.28),
      belly: p.belly || p.furL || shade(p.fur, 0.30),
      ear: p.ear || p.nose || shade(p.fur, -0.05),
      nose: p.nose || shade(p.fur, -0.15),
      eye: p.eye || "#2b2a24",
      paw: p.paw || p.belly || shade(p.fur, 0.26),
      stripe: p.stripe || null,
      patch: p.patch || null,
      patch2: p.patch2 || null
    };
  }

  /* ---------- §2 盒子尺寸 ----------
     坐标口径与 pixel-3d §4 完全一致：x 右、y 上、z 朝镜头（猫脸朝 +z）。
     单位还是"贴图上的 1 格"，所以 8 宽的身子 = 2D 那只 18px 猫的一半左右，
     站起来 15.6 格高 —— 比小人（28.8）矮一截，正好是"猫到人膝盖上面一点"。

     尺寸全取整（除了耳朵/尾巴这类细件），是为了让贴图按"格"对齐：
     半格的错位在像素画里就是一条毛边。
     ⚠️ 盒子之间只许"贴面相邻"，不许互相插入 —— 插入后画家算法在某些角度会翻面，
        这条是 pixel-3d.js §4 的原话，猫这边照抄。 */
  var BODY = { x: -4, y: 3, z: -5, w: 8, h: 6, d: 7 };
  var HEAD = { x: -3.5, y: 6, z: 2, w: 7, h: 7, d: 6 };
  var MUZZLE = { x: -1.5, y: 7, z: 8, w: 3, h: 2, d: 1 };

  /* ---------- §3 贴图 ----------
     每个盒子给出 front/back/side/top/bottom 五个生成器，签名同 pixel-3d §5：
       (look, C, cells, nu, nv) —— cells 收 [u, v, w, h, color]，v 是从顶行往下。
     侧面（right）的 u=0 是**脸那一侧**、u 到底边是尾巴那一侧，和 pixel-3d 一致。 */
  function catTex(v, C) {
    var put = function (t, x, y, w, h, c) { if (c && w > 0 && h > 0) t.push([x, y, w, h, c]) };
    var fill = function (c) { return function (a, b, t, W, H) { put(t, 0, 0, W, H, c) } };

    /* 一块皮毛的通用底：顶行受光、底行背光、左右各压一列暗边。
       窄面（耳朵 2.2 宽）不压边，否则整只耳朵都是一条暗线。 */
    function hide(t, W, H, base, light, dark) {
      put(t, 0, 0, W, H, base);
      put(t, 0, 0, W, 1, light);
      put(t, 0, H - 1, W, 1, dark);
      if (W >= 4) { put(t, 0, 0, 1, H, dark); put(t, W - 1, 0, 1, H, dark) }
    }

    /* 狸花的虎斑：竖条（顺着身子长），只刷在朝上的面和两侧。
       三花的两块色斑用同一套坐标，换成 patch/patch2。 */
    function marks(t, W, H, vertical) {
      if (C.stripe) {
        if (vertical) for (var u = 1; u < W - 0.5; u += 2) put(t, u, 1, 0.9, H - 2, C.stripe);
        else for (var r = 1; r < H - 0.5; r += 2) put(t, 0, r, W, 0.9, C.stripe);
      }
      if (C.patch) {
        put(t, W * 0.15, 1, W * 0.34, H * 0.5, C.patch);
        if (C.patch2) put(t, W * 0.55, H * 0.35, W * 0.3, H * 0.45, C.patch2);
      }
    }

    /* --- 身子 --------------------------------------------------------- */
    function bodyFront(a, b, t, W, H) {
      hide(t, W, H, C.fur, C.furL, C.furD);
      put(t, 1.5, H - 4, W - 3, 3.6, C.belly);          // 前胸白（脑袋一挡只剩下半截）
      marks(t, W, H, true);
    }
    function bodyBack(a, b, t, W, H) {
      hide(t, W, H, C.fur, C.furL, C.furD);
      put(t, W * 0.3, 0, W * 0.4, 1.4, C.furL);         // 背中线一道微光，转过去才不糊成一块
      marks(t, W, H, true);
    }
    function bodySide(a, b, t, W, H) {
      hide(t, W, H, C.fur, C.furL, C.furD);
      put(t, 0.5, H - 1.6, W * 0.34, 1.6, C.belly);     // 前腿那侧的肚皮白
      marks(t, W, H, true);
    }
    function bodyTop(a, b, t, W, H) {
      put(t, 0, 0, W, H, C.fur);
      put(t, W * 0.28, 0, W * 0.44, H, C.furL);         // 脊背受光
      marks(t, W, H, false);
    }

    /* --- 脑袋 --------------------------------------------------------- */
    /* 正面 7×7：第 0 行是头顶受光，第 2..3 行两只眼（1 列 × 2 行 + 1 格高光），
       第 4 行往下交给突出来的吻部盒子，所以这里只画眼睛和两颊。 */
    function headFront(a, b, t, W, H) {
      hide(t, W, H, C.fur, C.furL, C.furD);
      put(t, 1, 0, W - 2, 1, C.furL);                    // 额顶再提亮一行
      var ex = [1, W - 2];
      for (var i = 0; i < 2; i++) {
        put(t, ex[i], 2, 1, 2, C.eye);
        put(t, ex[i], 2, 1, 1, shade(C.eye, 0.62));      // 眼里的那格高光
      }
      put(t, W / 2 - 0.5, 1, 1, 1, C.furD);              // 眉心一点暗：两只眼才不像一张面具
    }
    function headSide(a, b, t, W, H) {
      hide(t, W, H, C.fur, C.furL, C.furD);
      put(t, 0, H * 0.42, 2, 2.4, C.belly);              // 侧脸的嘴套白
      if (C.stripe) put(t, 0, 1, 0.9, H - 2, C.stripe);  // 眼后那一道竖纹
    }
    function headBack(a, b, t, W, H) {
      hide(t, W, H, C.fur, C.furL, C.furD);
      marks(t, W, H, true);
    }
    function headTop(a, b, t, W, H) {
      put(t, 0, 0, W, H, C.fur);
      put(t, W * 0.3, 0, W * 0.4, H, C.furL);
      if (C.stripe) put(t, W * 0.45, 0, 0.9, H, C.stripe);
    }
    /* 耳背那一小块（bottom）：不画的话从上往下俯视能看到一个透光的洞 */
    function headBottom(a, b, t, W, H) { put(t, 0, 0, W, H, C.furD) }

    /* --- 耳朵：正面留一块粉的内耳，转过去就是一只纯毛的三角块 -------------- */
    function earFront(a, b, t, W, H) {
      put(t, 0, 0, W, H, C.fur);
      put(t, 0, 0, W, 1, C.furL);
      put(t, W * 0.22, H * 0.20, W * 0.56, H * 0.72, C.ear);
    }
    function earBack(a, b, t, W, H) { put(t, 0, 0, W, H, C.fur); put(t, 0, 0, W, 1, C.furL) }
    function earSide(a, b, t, W, H) { put(t, 0, 0, W, H, C.furD); put(t, 0, 0, W, 1, C.fur) }

    /* --- 吻部：白鼻梁 + 一颗粉鼻头 + 嘴线 --------------------------------- */
    function muzzleFront(a, b, t, W, H) {
      put(t, 0, 0, W, H, C.belly);
      put(t, (W - 1) / 2, 0, 1, 1, C.nose);
      put(t, (W - 1) / 2, 1, 1, 0.6, shade(C.nose, -0.32));
    }
    function muzzleSide(a, b, t, W, H) { put(t, 0, 0, W, H, C.belly); put(t, 0, 0, W, 1, shade(C.belly, -0.12)) }
    function muzzleTop(a, b, t, W, H) { put(t, 0, 0, W, H, C.fur) }

    /* --- 腿：主色毛 + 最下一行白脚掌 -------------------------------------- */
    function legFront(a, b, t, W, H) {
      put(t, 0, 0, W, H, C.fur);
      put(t, 0, 0, W, 1, C.furL);
      put(t, 0, H - 1, W, 1, C.paw);
    }
    function legSide(a, b, t, W, H) { put(t, 0, 0, W, H, C.furD); put(t, 0, H - 1, W, 1, C.paw) }
    function legBack(a, b, t, W, H) { put(t, 0, 0, W, H, C.furD); put(t, 0, H - 1, W, 1, C.paw) }

    /* --- 尾巴：三节都是毛，狸花画环纹（沿着尾巴长的那一头切） ---------------- */
    function tailFace(a, b, t, W, H) {
      put(t, 0, 0, W, H, C.fur);
      put(t, 0, 0, W, 1, C.furL);
      if (C.stripe) for (var u = 0; u < W; u += 1.6) put(t, u, 0, 0.8, H, C.stripe);
    }
    function tailTop(a, b, t, W, H) { put(t, 0, 0, W, H, C.furL) }

    /* --- 头饰：2D 那顶戴在头顶，3D 就摆在两耳中间那一格 --------------------- */
    var wearC = v.wearColor || C.furL;
    function wearFront(a, b, t, W, H) {
      put(t, 0, 0, W, H, wearC);
      put(t, 0, 0, W, 1, shade(wearC, 0.28));
      put(t, 0, H - 1, W, 1, shade(wearC, -0.25));
    }
    var wearSide = wearFront;

    return {
      body: { front: bodyFront, back: bodyBack, side: bodySide, top: bodyTop, bottom: fill(C.furD) },
      head: { front: headFront, back: headBack, side: headSide, top: headTop, bottom: headBottom },
      ear: { front: earFront, back: earBack, side: earSide, top: earBack, bottom: fill(C.furD) },
      muzzle: { front: muzzleFront, back: fill(C.belly), side: muzzleSide, top: muzzleTop, bottom: fill(C.furD) },
      leg: { front: legFront, back: legBack, side: legSide, top: fill(C.fur), bottom: fill(C.paw) },
      tail: { front: tailFace, back: tailFace, side: tailFace, top: tailTop, bottom: fill(C.furD) },
      wear: { front: wearFront, back: wearFront, side: wearSide, top: fill(shade(wearC, 0.2)), bottom: fill(shade(wearC, -0.2)) }
    };
  }

  var WEAR_COL = { bow: "#e8607f", hat: "#4f9c8f", flower: "#e0524f", crown: "#ffd76e" };

  /* ---------- §4 装配：一只猫 = 一块身子 + 一块脑袋 + 四个盒子 ---------- */
  function buildModel(input) {
    var catId = typeof input === "string" ? input : (input && input.catId) || "cat_daju";
    var wear = (input && typeof input === "object" && input.wear) || "none";
    var C = palOf(catId);
    var look = { catId: catId, wear: wear, C: C };
    var tex = catTex({ wear: wear, wearColor: WEAR_COL[wear] || null }, C);
    var B = [];
    var add = function (kind, x, y, z, w, h, d) {
      var b = { kind: kind, x: x, y: y, z: z, w: w, h: h, d: d };
      b.tex = tex[kind]; B.push(b);
    };

    /* 身子、脑袋、吻部 */
    add("body", BODY.x, BODY.y, BODY.z, BODY.w, BODY.h, BODY.d);
    add("head", HEAD.x, HEAD.y, HEAD.z, HEAD.w, HEAD.h, HEAD.d);
    add("muzzle", MUZZLE.x, MUZZLE.y, MUZZLE.z, MUZZLE.w, MUZZLE.h, MUZZLE.d);

    /* 耳朵：两块叠出"阶梯三角"（底宽 2.6 / 尖宽 1.6）。
       单块方耳读成两根柱子；两级台阶才像猫耳，也还是纯方块，不破画风。
       两耳之间留 1.8 格，正好给头饰（它只有 1.6 宽）。 */
    add("ear", -3.5, 13, 2.5, 2.6, 1.2, 2.4);
    add("ear", -3.0, 14.2, 2.7, 1.6, 1.3, 2.0);
    add("ear", 0.9, 13, 2.5, 2.6, 1.2, 2.4);
    add("ear", 1.4, 14.2, 2.7, 1.6, 1.3, 2.0);

    /* 四条腿：前腿齐身子前沿，后腿贴后沿 —— 侧着看才读得出"四条腿" */
    add("leg", -3, 0, 0, 2, 3, 2);
    add("leg", 1, 0, 0, 2, 3, 2);
    add("leg", -3, 0, -5, 2, 3, 2);
    add("leg", 1, 0, -5, 2, 3, 2);

    /* 尾巴：三节往上翘、一节比一节细、每节往后错一点（从背后看不是一根方柱）。
       ⚠️ 节与节只在水平面上贴面（下节顶 = 上节底），错开的 z 不许同时重叠 ——
          同时重叠就是互相插入，画家算法在某些角度会把尾巴翻到身子前面。
           前身 z -5 到 -6.2 只伸出去 1.2 格，影子半径因此按 7.5 报。 */
    add("tail", -1, 7, -6.2, 2, 3, 1.2);
    add("tail", -0.9, 10, -6.9, 1.8, 2.8, 1.2);
    add("tail", -0.7, 12.8, -7.5, 1.4, 1.8, 1.0);

    /* 头饰：好感 15 级解锁的那顶。位置在两耳正中间，x -0.8..0.8 谁都碰不到 */
    if (wear !== "none" && WEAR_COL[wear]) add("wear", -0.8, 13, 3.0, 1.6, 1.8, 1.8);

    /* 包围盒：取景、旋转中心、会不会被画布切掉，全由它算（同 pixel-3d §6） */
    var minX = 9, maxX = -9, minY = 99, maxY = -99, minZ = 9, maxZ = -9;
    for (var i = 0; i < B.length; i++) {
      var b = B[i];
      minX = Math.min(minX, b.x); maxX = Math.max(maxX, b.x + b.w);
      minY = Math.min(minY, b.y); maxY = Math.max(maxY, b.y + b.h);
      minZ = Math.min(minZ, b.z); maxZ = Math.max(maxZ, b.z + b.d);
    }
    return {
      boxes: B, look: look, C: C,
      minY: minY, maxY: maxY, centerY: (minY + maxY) / 2,
      spanY: maxY - minY,
      spanH: 2 * Math.max(maxX - minX, maxZ - minZ),
      /* 影子按猫的身子铺：横 5.5、前后 7.5（默认 6.5/4.5 是给小人脚下一圈的） */
      shadowR: 5.5, shadowZ: 7.5
    };
  }

  /* ---------- §5 对外接口 ---------- */
  function ready() {
    return !!(window.Pixel3D && typeof window.Pixel3D.create === "function");
  }

  /* opts：wear（头饰 id）/ autoRotate（默认开，猫是给人看的展品）/ zoom / yaw / pitch */
  function mount(container, catId, opts) {
    if (!container || !ready()) return null;
    opts = opts || {};
    var input = { catId: catId, wear: opts.wear || "none" };
    var viewer = window.Pixel3D.mount(container, input, {
      buildModel: buildModel,
      autoRotate: opts.autoRotate !== false,
      zoom: opts.zoom || 1.22,
      yaw: opts.yaw === undefined ? -26 : opts.yaw,
      pitch: opts.pitch === undefined ? 14 : opts.pitch,
      shadow: opts.shadow,
      label: opts.label || "猫咪 3D 预览",
      hint: opts.hint || "按住拖动可 360° 观察"
    });
    return viewer;
  }

  function unmount(container) {
    if (!container || !ready()) return false;
    return window.Pixel3D.unmount(container);
  }

  /* 静态图：图鉴格子、导出、离线自检都走这里 */
  function thumb(canvas, catId, opts) {
    if (!canvas || !ready()) return null;
    opts = opts || {};
    return window.Pixel3D.renderTo(canvas, { catId: catId, wear: opts.wear || "none" }, {
      buildModel: buildModel,
      width: opts.width || 140,
      height: opts.height || 176,
      zoom: opts.zoom || 1.0,
      yaw: opts.yaw === undefined ? -26 : opts.yaw,
      pitch: opts.pitch === undefined ? 14 : opts.pitch,
      shadow: opts.shadow
    });
  }

  function snapshot(catId, opts) {
    var cv = document.createElement("canvas");
    thumb(cv, catId, opts);
    return cv.toDataURL("image/png");
  }

  /* 自检用：拿到盒子清单就能离线验"有没有互相插入 / 有没有掉进地里" */
  function model(catId, opts) {
    return buildModel({ catId: catId, wear: (opts && opts.wear) || "none" });
  }

  window.CatDex3D = {
    VERSION: VERSION,
    mount: mount, unmount: unmount, thumb: thumb, snapshot: snapshot, model: model,
    palettes: function () { return { daju: palOf("cat_daju"), guanzhang: palOf("cat_guanzhang"), zhima: palOf("cat_zhima"), lihua: palOf("cat_lihua") } }
  };
})();
