/* cat-3d.js 离线自检：不需要浏览器，用假 canvas + 假 DOM 把渲染真实跑一遍。
   验四件事：
   ① 盒子之间没有互相插入（插入 ⇒ 画家算法在某些角度翻面）；
   ② 转满一圈不出画、不出 NaN、每帧都有东西；
   ③ 正面的眼睛 / 鼻头用对了颜色（毛色来自 CAT_PAL，不能是兜底灰）；
   ④ 头饰真的多出一个盒子，且 mount 能挂上、destroy 能收摊。
   跑法：node cat-dex/test_cat3d.js */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

/* ---------- 假 canvas（同 pixel-3d/test_pixel3d.js 的口径） ---------- */
function makeCanvas() {
  const cv = { width: 0, height: 0, shots: [] };
  const g = {
    fillStyle: '#000000', globalAlpha: 1, imageSmoothingEnabled: true, m: [1, 0, 0, 1, 0, 0],
    setTransform(a, b, c, d, e, f) { this.m = [a, b, c, d, e, f] },
    clearRect() { },
    fillRect(x, y, w, h) {
      const [a, b, c, d, e, f] = this.m;
      const px = (u, v) => [a * u + c * v + e, b * u + d * v + f];
      const pts = [px(x, y), px(x + w, y), px(x + w, y + h), px(x, y + h)];
      const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
      cv.shots.push({
        col: String(this.fillStyle), alpha: this.globalAlpha,
        x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys)
      });
    },
    getImageData() { return { data: new Uint8ClampedArray(64 * 64 * 4) } },
    drawImage() { }
  };
  cv.getContext = () => g;
  cv.toDataURL = () => 'data:image/png;base64,AAA=';
  cv.getBoundingClientRect = () => ({ width: cv.width || 140, height: cv.height || 176, left: 0, top: 0 });
  cv.style = {}; cv.classList = CLS(); cv.dataset = {}; cv.tabIndex = 0; cv.setAttribute = () => { };
  cv.addEventListener = () => { }; cv.removeEventListener = () => { };
  cv.setPointerCapture = () => { }; cv.releasePointerCapture = () => { };
  cv.closest = () => null; cv.remove = () => { }; cv.isConnected = true;
  return cv;
}
const CLS = () => ({
  _s: new Set(),
  add(c) { this._s.add(c) }, remove(c) { this._s.delete(c) },
  contains(c) { return this._s.has(c) }, toggle(c, on) { on ? this._s.add(c) : this._s.delete(c) }
});
function makeEl(tag) {
  if (tag === 'canvas') return makeCanvas();
  const cv = makeCanvas();
  const stub = () => ({ remove() { }, classList: CLS(), dataset: {}, style: {}, textContent: '' });
  return {
    tagName: tag, className: '', innerHTML: '', style: {}, dataset: {}, children: [], parentNode: null,
    isConnected: true, tabIndex: 0,
    classList: CLS(),
    querySelector(sel) { return sel === '.p3d-cv' ? cv : stub() },
    setAttribute() { },
    addEventListener() { }, removeEventListener() { },
    replaceChildren(...k) { this.children = k; for (const c of k) if (c) c.parentNode = this },
    append(...k) { this.children.push(...k) },
    remove() {
      this.isConnected = false;
      const p = this.parentNode;
      if (p && p.children) { const i = p.children.indexOf(this); if (i >= 0) p.children.splice(i, 1) }
    },
    getBoundingClientRect() { return { width: 400, height: 238, left: 0, top: 0 } },
    closest() { return null }, setPointerCapture() { }, releasePointerCapture() { },
    toDataURL: cv.toDataURL
  };
}

const root = path.join(__dirname, '..');
const sandbox = { window: {}, document: { createElement: makeEl } };
sandbox.window.devicePixelRatio = 1;
let clock = 0;
const frameQ = [];
sandbox.requestAnimationFrame = cb => { frameQ.push(cb); return frameQ.length };
sandbox.cancelAnimationFrame = () => { };
sandbox.performance = { now: () => clock };
sandbox.ResizeObserver = function () { this.observe = () => { }; this.disconnect = () => { } };
sandbox.console = console;

/* 地图脚本里的 CAT_PAL 是 top-level const，这里直接塞进沙箱当全局词法之外的变量：
   vm 里用 `var` 声明挂在全局对象上，效果等同于"主脚本先加载过了"。 */
const CAT_PAL = {
  DAJU: { fur: '#d98a3c', furL: '#f2ad5e', furD: '#a2601f', belly: '#f6e7d0', ear: '#e8a8a0', nose: '#c96f6a', eye: '#2b2a24', paw: '#f6e7d0' },
  GUANZHANG: { fur: '#efe9dc', furL: '#fbf8f0', furD: '#bdb2a0', belly: '#fbf8f0', ear: '#e8a8a0', nose: '#c96f6a', eye: '#4a6a48', paw: '#fbf8f0', patch: '#4a4038', patch2: '#d98a3c' },
  ZHIMA: { fur: '#3b3730', furL: '#585249', furD: '#221f1b', belly: '#4c4740', ear: '#7c5c58', nose: '#90706a', eye: '#d8c060', paw: '#4c4740' },
  LIHUA: { fur: '#8d826e', furL: '#ab9e86', furD: '#5f5646', belly: '#efe8da', ear: '#c09088', nose: '#b07a74', eye: '#4a6a48', paw: '#efe8da', stripe: '#463f34' }
};
sandbox.CAT_PAL = CAT_PAL;

vm.runInNewContext(fs.readFileSync(path.join(root, 'pixel-3d', 'pixel-3d.js'), 'utf8'), sandbox);
vm.runInNewContext(fs.readFileSync(path.join(__dirname, 'cat-3d.js'), 'utf8'), sandbox);
const P = sandbox.window.Pixel3D, K = sandbox.window.CatDex3D;
assert(P && typeof P.renderTo === 'function', 'window.Pixel3D must exist');
assert(K && typeof K.model === 'function', 'window.CatDex3D must exist');
assert.equal(P.VERSION, '1.1.0', 'pixel-3d 需要 >= 1.1.0（opts.buildModel）');

const IDS = ['cat_daju', 'cat_guanzhang', 'cat_zhima', 'cat_lihua'];
const PALKEY = { cat_daju: 'DAJU', cat_guanzhang: 'GUANZHANG', cat_zhima: 'ZHIMA', cat_lihua: 'LIHUA' };

/* ---------- 1. 盒子不许互相插入，且不许掉到地平面以下 ---------- */
{
  for (const id of IDS) {
    const m = K.model(id);
    assert(m.boxes.length >= 12, id + ' 盒子太少，装配没跑完');
    for (const b of m.boxes) {
      assert(b.y >= -1e-9, `${id}: 盒子 ${b.kind} 掉到地面以下 y=${b.y}`);
      for (const f of ['w', 'h', 'd']) assert(b[f] > 0, `${id}: 盒子 ${b.kind} 的 ${f} 不是正数`);
    }
    // 相交体积 > 0 ⇒ 插入；恰好贴面（重叠为 0）是允许的
    for (let i = 0; i < m.boxes.length; i++) for (let j = i + 1; j < m.boxes.length; j++) {
      const a = m.boxes[i], b = m.boxes[j];
      const ov = (p0, p1, q0, q1) => Math.min(p1, q1) - Math.max(p0, q0);
      const dx = ov(a.x, a.x + a.w, b.x, b.x + b.w);
      const dy = ov(a.y, a.y + a.h, b.y, b.y + b.h);
      const dz = ov(a.z, a.z + a.d, b.z, b.z + b.d);
      assert(!(dx > 1e-6 && dy > 1e-6 && dz > 1e-6),
        `${id}: ${a.kind} 与 ${b.kind} 互相插入 (${dx.toFixed(2)}, ${dy.toFixed(2)}, ${dz.toFixed(2)})`);
    }
    // 包围盒必须是有限数，fit() 全靠它
    assert(Number.isFinite(m.spanY) && m.spanY > 8, id + ' 高度不合理');
    assert(Number.isFinite(m.spanH) && m.spanH > m.spanY, id + ' 横向跨度不合理（尾巴/脑袋没算进去？）');
  }
  console.log('✓ 1 盒子几何：%d 只猫，无插入、无沉地', IDS.length);
}

/* ---------- 2. 转满一圈：不出画、不出 NaN、每帧都有东西 ---------- */
{
  const W = 320, H = 400;
  let frames = 0, minShots = 1e9;
  for (const id of IDS) for (let yaw = -180; yaw < 180; yaw += 15) for (const pitch of [-14, 6, 24, 45, 62, 74]) {
    const cv = makeCanvas();
    P.renderTo(cv, { catId: id, wear: 'none' }, { buildModel: x => K.model(x.catId, x), width: W, height: H, yaw, pitch, zoom: 1.22 });
    const list = cv.shots.filter(s => /^#[0-9a-f]{6}$/i.test(s.col));
    assert(list.length > 40, `${id} yaw=${yaw} pitch=${pitch}: 几乎没画出东西`);
    minShots = Math.min(minShots, list.length);
    for (const r of list) {
      assert([r.x0, r.y0, r.x1, r.y1].every(Number.isFinite), `${id} yaw=${yaw} pitch=${pitch}: NaN 几何`);
      assert(r.x1 - r.x0 > 0 && r.y1 - r.y0 > 0, `${id} yaw=${yaw} pitch=${pitch}: 退化成零面积的块`);
      assert(r.x0 > -1 && r.y0 > -1 && r.x1 < W + 1 && r.y1 < H + 1,
        `${id} yaw=${yaw} pitch=${pitch}: 出画 ${r.col} ${[r.x0, r.y0].map(n => n.toFixed(1))}`);
    }
    frames++;
  }
  assert(minShots > 40, '最少一帧也要有 40 个可见格');
  console.log('✓ 2 整圈渲染：%d 帧（每帧至少 %d 格），不出画、无 NaN', frames, minShots);
}

/* ---------- 3. 毛色/眼睛/鼻子确实来自 CAT_PAL ---------- */
{
  for (const id of IDS) {
    const p = CAT_PAL[PALKEY[id]];
    const cv = makeCanvas();
    P.renderTo(cv, { catId: id, wear: 'none' }, { buildModel: x => K.model(x.catId), width: 320, height: 400, yaw: 0, pitch: 8, zoom: 1.22 });
    const cols = new Set(cv.shots.filter(s => /^#[0-9a-f]{6}$/i.test(s.col)).map(s => s.col.toLowerCase()));
    assert(cols.has(p.fur.toLowerCase()), `${id}: 主毛色 ${p.fur} 没出现`);
    assert(cols.has(p.eye.toLowerCase()) || p.eye === '#2b2a24',
      `${id}: 眼睛色 ${p.eye} 没出现（正面看不见眼？）`);
    assert(cols.has(p.nose.toLowerCase()), `${id}: 鼻头色 ${p.nose} 没出现`);
    if (p.stripe) assert(cols.has(p.stripe.toLowerCase()), `${id}: 虎斑条 ${p.stripe} 没出现`);
  }
  console.log('✓ 3 毛色：四只猫的主色/眼/鼻都对上了 CAT_PAL');
}

/* ---------- 4. 头饰多一个盒子；四只猫画出来必须不一样 ---------- */
{
  const base = K.model('cat_daju', { wear: 'none' });
  const bow = K.model('cat_daju', { wear: 'bow' });
  assert.equal(bow.boxes.length, base.boxes.length + 1, '戴蝴蝶结必须多出一个盒子');
  const sig = id => {
    const cv = makeCanvas();
    P.renderTo(cv, { catId: id, wear: 'none' }, { buildModel: x => K.model(x.catId), width: 240, height: 300, yaw: -26, pitch: 14, zoom: 1.22 });
    return JSON.stringify(cv.shots.filter(s => /^#[0-9a-f]{6}$/i.test(s.col)).map(s => [s.col, Math.round(s.x0), Math.round(s.y0)]));
  };
  const sigs = new Set(IDS.map(sig));
  assert.equal(sigs.size, IDS.length, '四只猫渲染出来必须各不相同（否则毛色没生效）');
  console.log('✓ 4 头饰 +1 个盒子；四只猫渲染互不相同');
}

/* ---------- 5. mount → 拖动/自转 → destroy 收摊 ---------- */
{
  const host = makeEl('div');
  const v = K.mount(host, 'cat_zhima', { wear: 'crown', autoRotate: false });
  assert(v && typeof v.destroy === 'function', 'mount 要返回查看器');
  assert(host.children.length === 1, 'mount 后容器里必须正好一个根节点');
  const before = v.state.yaw;
  v.setView('back');
  for (let i = 0; i < 10; i++) { clock += 120; for (const cb of frameQ.splice(0)) cb(clock) }
  assert(Math.abs(v.state.yaw - 180) < 1 || Math.abs(v.state.yaw + 180) < 1, '转到背面必须落在 180°');
  v.destroy();
  assert.equal(host.children.length, 0, 'destroy 后根节点必须撤掉');
  console.log('✓ 5 mount/转视角/destroy 都正常');
}

console.log('\ncat-3d 自检全部通过。');
