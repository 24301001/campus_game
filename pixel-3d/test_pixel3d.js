/* pixel-3d 离线自检：不需要浏览器，用假的 canvas + 假 DOM 把渲染和挂载真实跑一遍。
   记录每次 fillRect 在**设备坐标**下的落点和颜色，于是能同时验四件事：
   ① 转满一圈不出画、不出 NaN；② 每张脸贴的颜色对不对（正/背/侧各有专属色）；
   ③ 画家算法顺序对不对（背对着你时书包必须盖在上衣外面）；④ mount 复用不打断拖动。
   跑法：node pixel-3d/test_pixel3d.js */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

/* ---------- 假 canvas：把 setTransform + fillRect 折成设备坐标矩形 ---------- */
function makeCanvas() {
  const cv = { width: 0, height: 0, shots: [], tag: 'canvas' };
  const g = {
    fillStyle: '#000000', globalAlpha: 1, imageSmoothingEnabled: true, m: [1, 0, 0, 1, 0, 0],
    setTransform(a, b, c, d, e, f) { this.m = [a, b, c, d, e, f] },
    clearRect() { },
    fillRect(x, y, w, h) {
      const [a, b, c, d, e, f] = this.m;
      const px = (u, v) => [a * u + c * v + e, b * u + d * v + f];
      const pts = [px(x, y), px(x + w, y), px(x + w, y + h), px(x, y + h)];
      const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
      cv.shots.push({ col: String(this.fillStyle), alpha: this.globalAlpha, x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) });
    },
    getImageData() { return { data: new Uint8ClampedArray(128 * 128 * 4) } },
    drawImage() { }
  };
  cv.getContext = () => g;
  cv.toDataURL = () => 'data:image/png;base64,AAA=';
  cv.getBoundingClientRect = () => ({ width: cv.width || 140, height: cv.height || 176, left: 0, top: 0 });
  /* 查看器会给画布挂 style/tabIndex/监听器：假画布也得接得住 */
  cv.style = {}; cv.classList = CLS(); cv.dataset = {}; cv.tabIndex = 0;
  cv.addEventListener = () => { }; cv.removeEventListener = () => { };
  cv.setPointerCapture = () => { }; cv.releasePointerCapture = () => { };
  cv.closest = () => null; cv.remove = () => { }; cv.isConnected = true;
  return cv;
}
/* ---------- 假 DOM：只够 pixel-3d 的 HUD 用 ---------- */
const CLS = o => ({
  _s: new Set(),
  add(c) { this._s.add(c) }, remove(c) { this._s.delete(c) },
  contains(c) { return this._s.has(c) }, toggle(c, on) { on ? this._s.add(c) : this._s.delete(c) }
});
function makeEl(tag) {
  if (tag === 'canvas') return makeCanvas();
  const cv = makeCanvas();
  const stub = name => ({ remove() { }, classList: CLS(), dataset: {}, style: {}, textContent: '' });
  const el = {
    tagName: tag, className: '', innerHTML: '', style: {}, dataset: {}, children: [], parentNode: null,
    isConnected: true, tabIndex: 0, _cv: cv,
    classList: CLS(),
    querySelector(sel) { return sel === '.p3d-cv' ? cv : stub(sel) },
    addEventListener() { }, removeEventListener() { },
    replaceChildren(...k) { this.children = k; for (const c of k) if (c) c.parentNode = this },
    append(...k) { this.children.push(...k) }, remove() { this.isConnected = false },
    getBoundingClientRect() { return { width: 140, height: 176, left: 0, top: 0 } },
    closest() { return null }, setPointerCapture() { }, releasePointerCapture() { },
    toDataURL: cv.toDataURL
  };
  return el;
}
const sandbox = { window: {}, document: { createElement: makeEl } };
sandbox.window.devicePixelRatio = 1;
/* 假时钟 + 假 rAF：动画循环要能被测试"手动推进帧"，否则补间和自转永远验不到。 */
let clock = 0;
const frameQ = [];
sandbox.requestAnimationFrame = cb => { frameQ.push(cb); return frameQ.length };
sandbox.cancelAnimationFrame = () => { };
sandbox.performance = { now: () => clock };
const runFrames = n => { for (let i = 0; i < n; i++) { clock += 120; for (const cb of frameQ.splice(0)) cb(clock) } };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'mp', 'look.js'), 'utf8'), sandbox);
vm.runInNewContext(fs.readFileSync(path.join(__dirname, 'pixel-3d.js'), 'utf8'), sandbox);
const P = sandbox.window.Pixel3D, M = sandbox.window.MPLook;
assert(P && typeof P.renderTo === 'function', 'window.Pixel3D must exist');

/* mp/look.js:14 的 shade 复刻一份，用来在测试里算出"嘴应该是什么色" */
const shade = (h, k) => {
  const c = [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  return '#' + [0, 1, 2].map(i => Math.max(0, Math.min(255, Math.round(k >= 0
    ? c[i] + (255 - c[i]) * k * [1, .93, .8][i]
    : c[i] * (1 + k * [1.08, 1, .86][i]))))).map(x => x.toString(16).padStart(2, '0')).join('');
};
function shot(look, yaw, pitch, W = 320, H = 400) {
  const cv = makeCanvas();
  P.renderTo(cv, look, { width: W, height: H, yaw, pitch });
  return { cv, list: cv.shots.filter(s => /^#[0-9a-f]{6}$/i.test(s.col)) };
}
const hasColor = (s, c) => s.list.some(x => x.col === String(c).toLowerCase());
const firstIndex = (s, pred) => s.list.findIndex(pred);
const signature = s => JSON.stringify(s.list.map(x => [x.col, x.x0.toFixed(1), x.y0.toFixed(1), x.x1.toFixed(1), x.y1.toFixed(1)]));
const V = v => ({ ...P.FALLBACK, ...v });
/* 把一串贴图格 [u,v,w,h,color] 按绘制顺序铺成网格：后画的盖住先画的，
   于是"这一格最终是什么色"能一格一格核对（眼镜圈没圈住眼睛、镜框压没压住嘴都是这么查的）。 */
function paintGrid(cells, W, H) {
  const g = Array.from({ length: H }, () => Array(W).fill(null));
  for (const [u, v, w, h, col] of cells) for (let y = Math.floor(v); y < v + h; y++) for (let x = Math.floor(u); x < u + w; x++)
    if (y >= 0 && y < H && x >= 0 && x < W) g[y][x] = col;
  return g;
}

/* ---------- 1. 配方规范化必须和 mp/look.js 完全一致 ----------
   两边各带一份 norm 是为了这个文件夹能整体搬走；但同一份数据判出来的结果必须相同，
   否则"存进库里的配方"和"3D 画出来的配方"会有谁说了算的分裂。 */
{
  const styles = ['short', 'mid', 'long', 'ponytail', 'bun', 'twintails', 'bald', '', null];
  const eyes = ['round', 'narrow', 'dot', 'cat', undefined];
  const accs = ['none', 'glasses', 'cap', 'scarf', 'bow', 42];
  const patterns = ['solid', 'stripe', 'check'];
  let cases = 0;
  for (const hairStyle of styles) for (const eye of eyes) for (const acc of accs) for (const clothPattern of patterns) {
    const raw = {
      hairStyle, eye, acc, clothPattern, skin: '#E0B080',
      hairColor: ['#ABCDEF', '#123456', 'red', '#12345', '#GGGGGG', 7, null][cases % 7],
      packColor: cases % 3 ? '#3a74b2' : 'navy',
      cloth: '#c94954', clothAlt: '#f3eee7', pants: '#38516d', eyeColor: '#332a2b', accColor: '#b67a56', junk: 'x'
    };
    const a = M.norm(raw), b = P.normLook(raw);
    for (const k of ['skin', 'hairColor', 'eyeColor', 'cloth', 'clothAlt', 'pants', 'accColor', 'packColor', 'hairStyle', 'eye', 'acc', 'clothPattern'])
      assert.equal(b[k], a[k], `normLook/norm disagree on ${k} for ${JSON.stringify(raw)}`);
    assert.equal(b.junk, undefined, 'unknown keys must not leak through');
    cases++;
  }
  assert.equal(cases, styles.length * eyes.length * accs.length * patterns.length, 'norm sweep must cover the enum space');
}

/* ---------- 2. 转满一圈：不出画、不出 NaN、每帧都有东西 ---------- */
{
  const looks = [];
  for (const hairStyle of ['short', 'mid', 'long', 'ponytail', 'bun', 'twintails'])
    for (const acc of ['none', 'glasses', 'cap', 'scarf']) looks.push(V({ hairStyle, acc }));
  const W = 320, H = 400;
  let frames = 0;
  for (const look of looks) for (let yaw = -180; yaw < 180; yaw += 15) for (const pitch of [-14, 6, 24, 45, 62, 74]) {
    const s = shot(look, yaw, pitch, W, H);
    assert(s.list.length > 60, `nothing to draw at yaw=${yaw} pitch=${pitch}`);
    for (const r of s.list) {
      assert([r.x0, r.y0, r.x1, r.y1].every(Number.isFinite), `NaN geometry at yaw=${yaw} pitch=${pitch}`);
      assert(r.x1 - r.x0 > 0 && r.y1 - r.y0 > 0, `degenerate block at yaw=${yaw} pitch=${pitch}`);
      assert(r.x0 > -1 && r.y0 > -1 && r.x1 < W + 1 && r.y1 < H + 1,
        `voxel leaves the canvas at yaw=${yaw} pitch=${pitch}: ${r.col} ${[r.x0, r.y0, r.x1, r.y1].map(n => n.toFixed(1))}`);
    }
    frames++;
  }
  assert.equal(frames, looks.length * 24 * 6, 'sweep must be complete');
}

/* ---------- 3. 确定性：同角度两次一样，转满 360° 回到原处 ---------- */
{
  const look = V({ hairStyle: 'ponytail', acc: 'scarf' });
  assert.equal(signature(shot(look, 37, 12)), signature(shot(look, 37, 12)), 'render must be deterministic');
  assert.equal(signature(shot(look, -120, 20)), signature(shot(look, 240, 20)), 'yaw must be periodic in 360°');
}

/* ---------- 4. 五官只朝前面：背面和侧面都不许有眼睛/嘴；侧面除前两列轮廓外整片是发 ----------
   ⚠️ 侧面（yaw=±90）第一版照抄四视图"留一只近眼"，实测判定为错：3D 的侧面是一块与脸成 90°
      的真平面，瞳孔画在上面等于"眼珠长在太阳穴"。第二版改成"头发 + 一只耳朵"，实测又判定
      "整片发里挖一块皮肤反而像脸上缺了格" ⇒ 现在只留前两列侧脸轮廓，其余全是发。 */
{
  for (const eye of ['round', 'narrow', 'dot']) {
    const look = V({ skin: '#e0b080', eye, eyeColor: '#317ac1', acc: 'none' });
    const C = P.palette(look), mouth = shade(C.skinD, -.28);
    const front = shot(look, 0, 12), back = shot(look, 180, 15), left = shot(look, -90, 12), right = shot(look, 90, 12);
    assert(hasColor(front, C.eye), `${eye}: front face needs pupils`);
    assert(hasColor(front, mouth), `${eye}: front needs a mouth`);
    for (const [name, s] of [['back', back], ['left profile', left], ['right profile', right]]) {
      assert(!hasColor(s, C.eye), `${eye}: pupils must not appear on the ${name}`);
      assert(!hasColor(s, mouth), `${eye}: mouth must not appear on the ${name}`);
    }
    const m = P.model(look), cells = [];
    m.boxes.find(b => b.kind === 'head').tex.side(look, m.C, cells, 8, 8);
    const S = paintGrid(cells, 8, 8);
    const isHair = c => c === C.hair || c === C.hairL || c === C.hairD;
    /* 第 2..7 列 × 第 2..6 行必须是发（不留耳朵位），第 0..1 列必须是皮肤（侧脸轮廓）。
       逐格断言而不是数颜色：数颜色的话，"耳朵挖在发里"和"发糊到脸上"两种错法都能蒙过去。 */
    for (let y = 2; y <= 6; y++) {
      for (let x = 2; x < 8; x++) assert(isHair(S[y][x]), `${eye}: side col ${x} row ${y} must be hair, got ${S[y][x]}`);
      for (const x of [0, 1]) assert(!isHair(S[y][x]), `${eye}: side col ${x} row ${y} must stay skin, got ${S[y][x]}`);
    }
    /* 整片发只由三档发色组成：不许有瞳孔、配饰，也不许有当年那种皮肤洞。 */
    assert(!cells.some(c => c[4] === C.eye), `${eye}: side texture must not paint pupils at all`);
    assert(!cells.some(c => c[4] === C.acc || c[4] === C.accD), `${eye}: acc:none must leave the profile clean`);
    assert([2, 3, 4, 5, 6].every(y => S[y][7] === C.hairD), `${eye}: the back edge of the profile must be shaded`);
  }
}

/* ---------- 5. 配饰：戴上每个角度都读得出染色，取下必须干净 ---------- */
{
  const dye = '#39d4c8', base = V({ eye: 'round', eyeColor: '#222222' });
  const C = P.palette({ ...base, accColor: dye });
  for (const acc of ['cap', 'scarf']) {
    const look = V({ ...base, acc, accColor: dye });
    for (const yaw of [0, 90, 180, -90]) assert(hasColor(shot(look, yaw, 12), dye), `${acc} dye must be visible at yaw=${yaw}`);
  }
  /* 眼镜走贴图路线：正面是镜框本色，背面/镜腿是压暗的那档（同四视图）。 */
  const g = V({ ...base, acc: 'glasses', accColor: dye });
  assert(hasColor(shot(g, 0, 12), dye), 'glasses frame must read the dye from the front');
  assert(hasColor(shot(g, 180, 15), C.accD), 'glasses temple strap must read from behind');
  assert(hasColor(shot(g, 90, 12), dye) && hasColor(shot(g, -90, 12), dye), 'glasses must show on both profiles');
  /* 镜圈必须是"两只圈 + 一段鼻梁"（实测报"眼镜显示混乱"）。三种错画法逐个验掉：
     ① 上沿横贯脸宽 ⇒ 正面读成发带；② 鼻梁占两行以上 ⇒ 脸正中一块棕色斑；
     ③ 第 5 行铺下沿 ⇒ 嘴上挂一圈镜框。圈顶按眼型定，中间空两格，第 5 行一律不碰。 */
  for (const eye of ['round', 'narrow', 'dot']) {
    const look = V({ ...base, eye, acc: 'glasses', accColor: dye }), m = P.model(look);
    const head = m.boxes.find(b => b.kind === 'head'), f = [], s = [];
    head.tex.front(look, m.C, f, 8, 8); head.tex.side(look, m.C, s, 8, 8);
    const F = paintGrid(f, 8, 8), S = paintGrid(s, 8, 8);
    const rim = c => c === m.C.acc || c === m.C.accD;
    const GT = eye === 'round' ? 2 : 3;
    assert([0, 1, 2, 5, 6, 7].every(x => rim(F[GT][x])), `${eye}: both lens tops must be drawn`);
    assert(!rim(F[GT][3]) && !rim(F[GT][4]), `${eye}: the lenses must not be joined across the face — that is a headband`);
    assert(F[GT + 1][3] === m.C.accD && F[GT + 1][4] === m.C.accD, `${eye}: one dark row of nose bridge must join the two rings`);
    assert(!rim(F[GT][3]) && !rim(F[GT + 2][3]), `${eye}: the bridge is one row tall, not a block`);
    for (let y = GT + 1; y <= 4; y++) assert(rim(F[y][0]) && rim(F[y][7]), `${eye}: rim row ${y} must hug both face edges`);
    assert(!F[5].some(rim), `${eye}: nothing of the frame may reach row 5 — that row is the mouth`);
    const mouth = shade(m.C.skinD, -.28);
    assert(F[5][3] === mouth && F[5][4] === mouth, `${eye}: the rim must not paint over the mouth`);
    let pupils = 0;
    for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) if (F[y][x] === m.C.eye) pupils++;
    assert.equal(pupils, eye === 'dot' ? 2 : 4, `${eye}: pupils must stay visible behind the lenses`);
    /* 侧面：第 0 列（和正面第 0/7 列是同一条竖棱）从圈顶走到眼行，镜腿只有 1 行高。 */
    for (let y = GT; y <= 4; y++) assert(rim(S[y][0]), `${eye}: profile needs the lens edge on the front column, row ${y}`);
    assert(!rim(S[5][0]), `${eye}: the frame must stop at the eye row on the profile`);
    assert(rim(S[GT + 1][6]), `${eye}: the temple must run back into the hair`);
    assert(!F.some(row => row.every(rim)), `${eye}: no row of the face may be all rim — that is a headband`);
    /* 镜腿在侧脸上只许占**一行**（它本来就横贯一块侧面，那是镜腿不是发带）；
       再多一行就是老画法那条"第 3 行 + 圈顶"叠成的胶带。 */
    const wide = S.map((row, y) => [y, row.filter(rim).length]).filter(e => e[1] >= 5);
    assert.equal(wide.length, 1, `${eye}: the profile may carry exactly one temple row, got ${JSON.stringify(wide)}`);
    assert.equal(wide[0][0], GT + 1, `${eye}: the temple must sit on the eye row`);
  }
  /* acc:none：配饰那一族颜色一律不许出现在任何角度（取下眼镜后眼部要干净）。 */
  for (const yaw of [0, 45, 90, 135, 180, -90]) {
    const s = shot(base, yaw, 12);
    assert(!s.list.some(r => [C.acc, C.accL, C.accD].includes(r.col)), `acc:none must paint no accessory color at yaw=${yaw}`);
  }
  /* 围巾套在颈空档里，正面要看得见，不能被躯干/头吃掉。 */
  assert(hasColor(shot(V({ ...base, acc: 'scarf', accColor: dye }), 0, 4), dye), 'scarf must survive the neck gap');
}

/* ---------- 6. 六种发型在背面各不相干（马尾/丸子头/双马尾本来就是背面读出来的） ---------- */
{
  const sig = new Map();
  for (const hairStyle of ['short', 'mid', 'long', 'ponytail', 'bun', 'twintails']) {
    const key = signature(shot(V({ hairStyle }), 180, 20));
    assert(!sig.has(key), `${hairStyle} renders identical to ${sig.get(key)} from behind`);
    sig.set(key, hairStyle);
  }
  assert.equal(sig.size, 6);
  const hairY = h => {
    const look = V({ hairStyle: h }), C = P.palette(look);
    const s = shot(look, 180, 20);
    return Math.max(...s.list.filter(r => [C.hair, C.hairL, C.hairD].includes(r.col)).map(x => x.y1));
  };
  assert(hairY('long') > hairY('mid') + 8, 'long hair must hang visibly lower than mid from behind');
  /* 垂下来的头发一律不许出现在胸前（实测报"中发/长发前面有两缕""双马尾挂在肩前"）：
     凡是整块落在下颌以下的发盒，必须待在 z ≤ -2 这一档（和书包同层）。 */
  for (const hairStyle of ['mid', 'long', 'ponytail', 'twintails', 'bun']) {
    const m = P.model(V({ hairStyle })), chin = m.boxes.find(b => b.kind === 'head').y;
    for (const b of m.boxes.filter(x => x.kind === 'hair' && x.y + x.h <= chin))
      assert(b.z + b.d <= -2, `${hairStyle}: 发束 (y ${b.y}..${b.y + b.h}) 垂到了胸前，maxZ=${b.z + b.d}`);
  }
  /* 中发/长发 = 后发帘 + 左右两条贴头侧面的发束，三块全在脑袋后半。 */
  for (const hairStyle of ['mid', 'long']) {
    const hairs = P.model(V({ hairStyle })).boxes.filter(b => b.kind === 'hair');
    assert.equal(hairs.length, 3, `${hairStyle} 应该是后发帘 + 两侧各一条`);
    assert(hairs.every(b => b.z + b.d <= -2), `${hairStyle}: 发帘必须全部落在脑袋后半`);
  }
  /* 双马尾：贴住脑袋侧面、束点抬到耳后、和后发同层，且不许和书包在 x 上重叠。 */
  {
    const m = P.model(V({ hairStyle: 'twintails' })), head = m.boxes.find(b => b.kind === 'head');
    const pack = m.boxes.find(b => b.kind === 'pack');
    const tails = m.boxes.filter(b => b.kind === 'hair' || b.kind === 'tie');
    assert.equal(tails.length, 6, '双马尾 = 扎带 + 发束 + 发梢，各两个');
    for (const s of [-1, 1]) {
      const side = tails.filter(b => (b.x + b.w / 2) * s > 0), who = s < 0 ? '左' : '右';
      assert.equal(side.length, 3, `${who}侧该有三块`);
      assert(side.some(b => Math.abs((s < 0 ? b.x + b.w : b.x) - (s < 0 ? head.x : head.x + head.w)) < 1e-6),
        `${who}侧发束必须贴在脑袋侧面，不能悬空挂着`);
      assert(side.every(b => b.z + b.d <= -2), `${who}侧必须落在后脑那一档，才接得上后发`);
      assert(Math.max(...side.map(b => b.y + b.h)) >= head.y + 4.4, `${who}侧束点要抬到耳后`);
      assert(side.every(b => b.x + b.w <= pack.x || b.x >= pack.x + pack.w), `${who}侧不许和书包重叠`);
    }
  }
}

/* ---------- 7. 三档眼型 / 上衣条纹 ---------- */
{
  const seen = new Set();
  for (const eye of ['round', 'narrow', 'dot']) seen.add(signature(shot(V({ eye, eyeColor: '#317ac1' }), 0, 12)));
  assert.equal(seen.size, 3, 'three eye shapes must render three different faces');
  const alt = '#f3eee7';
  assert(!hasColor(shot(V({ clothPattern: 'solid', clothAlt: alt }), 0, 12), alt), 'solid shirt must not use the secondary color');
  for (const yaw of [0, 90, 180]) assert(hasColor(shot(V({ clothPattern: 'stripe', clothAlt: alt }), yaw, 12), alt), `stripe must show at yaw=${yaw}`);
}

/* ---------- 8. 前后遮挡：书包和上衣的绘制顺序必须随转向翻转 ---------- */
{
  const look = V({ hairStyle: 'short', acc: 'none', cloth: '#101010' });
  const pack = P.palette(look).pack;
  const facing = shot(look, 0, 12), turned = shot(look, 180, 15);
  const p0 = firstIndex(facing, r => r.col === pack), t0 = firstIndex(facing, r => r.col === look.cloth);
  const p1 = firstIndex(turned, r => r.col === pack), t1 = firstIndex(turned, r => r.col === look.cloth);
  assert(p0 >= 0 && t0 >= 0 && p1 >= 0 && t1 >= 0, 'pack and shirt must both be drawn');
  assert(p0 < t0, 'facing you: the backpack is painted first (it is behind)');
  assert(p1 > t1, 'back to you: the backpack paints over the shirt');
}

/* ---------- 9. 颜色真的进了画面 + 20 个配方画得像 20 个人 ---------- */
{
  const look = V({ skin: '#e0b080', hairColor: '#f0c457', cloth: '#d03c3c', pants: '#3155aa', eyeColor: '#317ac1', accColor: '#39d4c8', acc: 'glasses' });
  for (const yaw of [0, 90, 180, 270]) for (const c of [look.hairColor, look.cloth, look.pants])
    assert(hasColor(shot(look, yaw, 12), c), `${c} must be drawn at yaw=${yaw}`);
  /* 书包色（packColor，配方第 12 个字段）：默认仍是地图 A2 那只 #b4552f；
     染了色要能从背面和两个侧面都读出来，且不许渗到别人的配方里。 */
  assert.equal(P.FALLBACK.packColor, '#b4552f', '默认书包色必须还是地图 A2 那只');
  const bag = V({ packColor: '#8f2bd0' });
  for (const yaw of [180, 90, -90]) assert(hasColor(shot(bag, yaw, 12), '#8f2bd0'), `书包染色必须在 yaw=${yaw} 看得见`);
  assert(!hasColor(shot(V({}), 180, 12), '#8f2bd0'), '书包染色不许渗进别的配方');
  const seen = new Set();
  for (let i = 0; i < 20; i++) seen.add(signature(shot(V({
    hairStyle: ['short', 'mid', 'long', 'ponytail', 'bun', 'twintails'][i % 6],
    acc: ['none', 'glasses', 'cap', 'scarf'][i % 4],
    eye: ['round', 'narrow', 'dot'][i % 3],
    clothPattern: i % 2 ? 'stripe' : 'solid',
    hairColor: '#' + i.toString(16).padStart(2, '0') + '3456',
    cloth: '#c0' + i.toString(16).padStart(2, '0') + '66'
  }), -24, 12)));
  assert.equal(seen.size, 20, 'twenty recipes must render twenty different figures');
}

/* ---------- 10. 盒子不许互相插入：画家算法稳定的前提 ----------
   共面相邻是允许的（相邻那两面里总有一面不贴图）。重叠到半格以上就得重做尺寸。 */
{
  let worst = { d: 0, pair: '' };
  for (const hairStyle of ['short', 'mid', 'long', 'ponytail', 'bun', 'twintails'])
    for (const acc of ['none', 'glasses', 'cap', 'scarf']) {
      const B = P.model(V({ hairStyle, acc })).boxes;
      const ov = (a1, w1, b1, w2) => Math.min(a1 + w1, b1 + w2) - Math.max(a1, b1);
      for (let i = 0; i < B.length; i++) for (let j = i + 1; j < B.length; j++) {
        const a = B[i], b = B[j];
        const d = Math.min(ov(a.x, a.w, b.x, b.w), ov(a.y, a.h, b.y, b.h), ov(a.z, a.d, b.z, b.d));
        if (d > worst.d) worst = { d, pair: `${hairStyle}/${acc}: ${a.kind} × ${b.kind}` };
      }
    }
  assert(worst.d < 0.35, `boxes interpenetrate by ${worst.d.toFixed(2)} voxels (${worst.pair}) — sorting will flicker`);
}

/* ---------- 11. 对外接口：宿主只靠这几个函数就能活 ---------- */
{
  for (const k of ['create', 'mount', 'unmount', 'renderTo', 'snapshot', 'normLook', 'palette', 'model'])
    assert.equal(typeof P[k], 'function', `Pixel3D.${k} must be callable`);
  const host = makeCanvas();
  assert.equal(P.renderTo(host, V({ acc: 'cap' }), { width: 140, height: 176 }), host, 'renderTo returns the canvas');
  assert(String(P.snapshot(V({ acc: 'scarf' }))).startsWith('data:image/'), 'snapshot hands back a data URL');
  assert(P.normLook({ hairStyle: 'mohawk' }).hairStyle === P.FALLBACK.hairStyle, 'bad enum falls back');

  const box = makeEl('div');
  const v1 = P.mount(box, V({}), {});
  assert(v1 && typeof v1.setLook === 'function' && v1.el === box.children[0], 'mount puts one viewer in the box');
  assert.equal(v1.state.spin, true, 'auto-rotate is the default');
  const yaw0 = v1.state.yaw;
  runFrames(4);
  assert.notEqual(v1.state.yaw, yaw0, 'the animation loop actually turns the model');
  const v2 = P.mount(box, V({ acc: 'cap' }), {});
  assert.equal(v1, v2, 'remounting the same box reuses the viewer（拖动角度不会每改一个控件就重置）');
  assert.notEqual(v2.state.yaw, yaw0, 'reuse keeps the current viewing angle');
  assert.equal(v2.state.look.acc, 'cap', 'reuse path still applies the new recipe');
  v2.setView('back');
  runFrames(6);
  assert.equal(v2.state.yaw, 180, 'view button target is reachable through the API');
  assert.equal(v2.state.spin, false, 'jumping to a named view stops the spin');
  assert.equal(P.unmount(box), true, 'unmount reports it did something');
  assert.equal(box.__p3d, undefined, 'unmount clears the handle on the container');
  assert.equal(P.mount(null, V({}), {}), null, 'mount(null) is a no-op, not a throw');
  const fresh = P.mount(makeEl('div'), V({}), { interactive: false });
  assert.equal(fresh.state.spin, false, 'static thumbnails must not spin');
}

/* ---------- 12. 每张贴图必须铺满自己那张面 ----------
   漏一格，转过去看就是一个透明缺口（实测侧脸下颌那一行漏过 2×1 格，
   正侧面出现一个白点）。空白面（腿顶/附加块底）由"一格都没生成"识别，跳过。 */
{
  const FACE_OF = { front: b => [b.w, b.h], back: b => [b.w, b.h], side: b => [b.d, b.h], top: b => [b.w, b.d], bottom: b => [b.w, b.d] };
  const holes = [];
  for (const hairStyle of ['short', 'mid', 'long', 'ponytail', 'bun', 'twintails'])
    for (const acc of ['none', 'glasses', 'cap', 'scarf'])
      for (const eye of ['round', 'narrow', 'dot']) {
        const look = V({ hairStyle, acc, eye }), m = P.model(look);
        for (const b of m.boxes) for (const key in FACE_OF) {
          const gen = b.tex && b.tex[key]; if (!gen) continue;
          const [nu, nv] = FACE_OF[key](b);
          const cells = [];
          gen(look, m.C, cells, nu, nv);
          if (!cells.length) continue;                                       // 故意留白的面
          for (let u = 0.1; u < nu - 0.05; u += 0.2) for (let w = 0.1; w < nv - 0.05; w += 0.2) {
            const covered = cells.some(c => c[4] && u >= c[0] && u < c[0] + c[2] && w >= c[1] && w < c[1] + c[3]);
            if (!covered) holes.push(`${hairStyle}/${acc}/${eye}: ${b.kind}.${key} 缺 (${u.toFixed(1)},${w.toFixed(1)})`);
          }
        }
      }
  assert.equal(holes.length, 0, 'see-through texture gaps:\n  ' + holes.slice(0, 8).join('\n  '));
}

console.log('PASS: pixel-3d 自检 —— norm 与 mp/look.js 全等(810 组配方·含 packColor)、3456 个姿态全部在画布内、五官只在正面(背面和侧面都不见眼/嘴、侧面除前两列侧脸轮廓外整片是发、不留耳朵)、镜圈按眼型把双眼圈在里面(不是横贯一条发带)、垂发一律落在 z≤-2 不糊脸、双马尾贴头侧并与后发帘同档、配饰戴上各角度可辨/取下无残留、书包染什么色出什么色、6 发型背面各异、条纹只在 stripe、书包遮挡顺序随转向翻转、盒子无互插、每张贴图铺满所在面、mount 复用不打断视角');
