import * as THREE from 'three';
import { mergeGeometries } from './vendor/BufferGeometryUtils.js';
import { GLTFLoader } from './vendor/GLTFLoader.js';
import { MeshoptDecoder } from './vendor/meshopt_decoder.module.js';
import { clone as cloneSkinned } from './vendor/SkeletonUtils.js';

/* =========================================================================
   尺寸与常量
   ========================================================================= */
const ROOM_W = 6;
const ROOM_D = 4.8;
const ROOM_H = 3;

const EYE_HEIGHT = 1.62;
const PLAYER_RADIUS = 0.32;
const WALK_SPEED = 2.4;
const RUN_SPEED = 4.2;
const MOUSE_SENS = 0.0022;

const LAYER_PLAYER = 1;

/* =========================================================================
   渲染器 / 场景 / 相机
   ========================================================================= */
const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance' });
// 镜子每隔几帧重画一次：2 = 每两帧，3 = 每三帧（帧率掉下去时自动切到 3）
let mirrorStride = 2;
// 集显 + 2K 屏：内部渲染分辨率压到 0.72 倍，再被浏览器放大，肉眼几乎看不出
let pixelRatio = Math.min(window.devicePixelRatio, 0.72);
renderer.setPixelRatio(pixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.shadowMap.autoUpdate = false;      // 静态场景，阴影只算一次
renderer.shadowMap.needsUpdate = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.08;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0c0d0e);

const camera = new THREE.PerspectiveCamera(72, window.innerWidth / window.innerHeight, 0.05, 60);
camera.rotation.order = 'YXZ';

// 所有静态东西都放这个组里，最后合并成十几批
const world = new THREE.Group();
scene.add(world);

/* =========================================================================
   程序化纹理
   ========================================================================= */
function newCanvas(size) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  return c;
}

function sprinkleNoise(g, S, amount) {
  const img = g.getImageData(0, 0, S, S);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (Math.random() - 0.5) * amount;
    img.data[i] += n;
    img.data[i + 1] += n;
    img.data[i + 2] += n;
  }
  g.putImageData(img, 0, 0);
}

function makeTileTexture() {
  const S = 256, N = 4, T = S / N;
  const c = newCanvas(S);
  const g = c.getContext('2d');

  for (let ty = 0; ty < N; ty++) {
    for (let tx = 0; tx < N; tx++) {
      const v = 208 + Math.floor(Math.random() * 16);
      g.fillStyle = `rgb(${v}, ${v - 2}, ${v - 5})`;
      g.fillRect(tx * T, ty * T, T, T);

      for (let i = 0; i < 5; i++) {
        const x = tx * T + Math.random() * T;
        const y = ty * T + Math.random() * T;
        const r = 8 + Math.random() * 40;
        const grad = g.createRadialGradient(x, y, 0, x, y, r);
        const a = 0.02 + Math.random() * 0.05;
        grad.addColorStop(0, `rgba(70,64,54,${a})`);
        grad.addColorStop(1, 'rgba(70,64,54,0)');
        g.fillStyle = grad;
        g.fillRect(x - r, y - r, r * 2, r * 2);
      }
    }
  }

  g.strokeStyle = 'rgba(88,84,76,0.85)';
  g.lineWidth = 3;
  for (let i = 0; i <= N; i++) {
    g.beginPath(); g.moveTo(i * T, 0); g.lineTo(i * T, S); g.stroke();
    g.beginPath(); g.moveTo(0, i * T); g.lineTo(S, i * T); g.stroke();
  }

  for (let i = 0; i < 18; i++) {
    const x = Math.random() * S, y = Math.random() * S;
    const r = 30 + Math.random() * 110;
    const grad = g.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, `rgba(58,52,42,${0.015 + Math.random() * 0.05})`);
    grad.addColorStop(1, 'rgba(58,52,42,0)');
    g.fillStyle = grad;
    g.fillRect(x - r, y - r, r * 2, r * 2);
  }

  sprinkleNoise(g, S, 9);

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return tex;
}

function makeWallTexture() {
  const S = 256;
  const c = newCanvas(S);
  const g = c.getContext('2d');

  g.fillStyle = '#d9d5cc';
  g.fillRect(0, 0, S, S);

  for (let i = 0; i < 30; i++) {
    const x = Math.random() * S, y = Math.random() * S;
    const r = 24 + Math.random() * 95;
    const grad = g.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, `rgba(92,80,64,${0.015 + Math.random() * 0.055})`);
    grad.addColorStop(1, 'rgba(92,80,64,0)');
    g.fillStyle = grad;
    g.fillRect(x - r, y - r, r * 2, r * 2);
  }

  for (let i = 0; i < 8; i++) {
    const x = Math.random() * S;
    const w = 3 + Math.random() * 14;
    const y0 = Math.random() * S * 0.3;
    const h = 100 + Math.random() * 260;
    const grad = g.createLinearGradient(0, y0, 0, y0 + h);
    grad.addColorStop(0, `rgba(78,68,54,${0.015 + Math.random() * 0.03})`);
    grad.addColorStop(1, 'rgba(78,68,54,0)');
    g.fillStyle = grad;
    g.fillRect(x, y0, w, h);
  }

  const corners = [[0, 0], [S, 0], [0, S], [S, S]];
  for (const [cx, cy] of corners) {
    const grad = g.createRadialGradient(cx, cy, 0, cx, cy, 150);
    grad.addColorStop(0, 'rgba(60,52,42,0.10)');
    grad.addColorStop(1, 'rgba(60,52,42,0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, S, S);
  }

  sprinkleNoise(g, S, 10);

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return tex;
}

function makeCeilingTexture() {
  const S = 256;
  const c = newCanvas(S);
  const g = c.getContext('2d');
  g.fillStyle = '#e7e5df';
  g.fillRect(0, 0, S, S);

  for (let i = 0; i < 14; i++) {
    const x = Math.random() * S, y = Math.random() * S;
    const r = 30 + Math.random() * 90;
    const grad = g.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, `rgba(120,110,96,${0.01 + Math.random() * 0.035})`);
    grad.addColorStop(1, 'rgba(120,110,96,0)');
    g.fillStyle = grad;
    g.fillRect(x - r, y - r, r * 2, r * 2);
  }

  g.strokeStyle = 'rgba(150,148,142,0.55)';
  g.lineWidth = 2;
  g.strokeRect(1, 1, S - 2, S - 2);

  sprinkleNoise(g, S, 6);

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return tex;
}

function makeWoodTexture(r, gr, b) {
  const S = 128;
  const c = newCanvas(S);
  const g = c.getContext('2d');
  g.fillStyle = `rgb(${r},${gr},${b})`;
  g.fillRect(0, 0, S, S);

  for (let i = 0; i < 34; i++) {
    const y0 = Math.random() * S;
    g.strokeStyle = `rgba(20,10,4,${0.05 + Math.random() * 0.12})`;
    g.lineWidth = 0.6 + Math.random() * 1.6;
    g.beginPath();
    for (let x = 0; x <= S; x += 12) {
      const y = y0 + Math.sin(x * 0.02 + i * 1.7) * 3 + Math.sin(x * 0.08 + i) * 1.2;
      if (x === 0) g.moveTo(x, y); else g.lineTo(x, y);
    }
    g.stroke();
  }

  sprinkleNoise(g, S, 8);

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return tex;
}

function makeCurtainTexture() {
  const S = 128;
  const c = newCanvas(S);
  const g = c.getContext('2d');

  for (let x = 0; x < S; x++) {
    const wave = 0.55 + 0.28 * Math.sin(x * 0.19) + 0.12 * Math.sin(x * 0.07 + 1.3);
    g.fillStyle = `rgb(${Math.floor(148 * wave + 24)},${Math.floor(178 * wave + 26)},${Math.floor(204 * wave + 28)})`;
    g.fillRect(x, 0, 1, S);
  }

  sprinkleNoise(g, S, 10);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/* =========================================================================
   材质与辅助
   ========================================================================= */
const texTile = makeTileTexture();
texTile.repeat.set(ROOM_W / 2, ROOM_D / 2);   // 每 2 米一次贴图 → 地砖恒为 0.5 m 见方

const texWall = makeWallTexture();
const texCeil = makeCeilingTexture();
texCeil.repeat.set(ROOM_W / 2, ROOM_D / 2);

const texWoodDark = makeWoodTexture(58, 36, 20);
const texWoodRed = makeWoodTexture(74, 30, 22);

const matFloor = new THREE.MeshStandardMaterial({ map: texTile, roughness: 0.55, metalness: 0.05 });
const matWall = new THREE.MeshStandardMaterial({ map: texWall, roughness: 0.95 });
const matCeil = new THREE.MeshStandardMaterial({ map: texCeil, roughness: 1.0 });
const matBase = new THREE.MeshStandardMaterial({ color: 0x121212, roughness: 0.75 });

const matLeather = new THREE.MeshStandardMaterial({ color: 0x141417, roughness: 0.38, metalness: 0.05 });
const matLeatherWorn = new THREE.MeshStandardMaterial({ color: 0x2a2520, roughness: 0.85 });
const matLeatherPeel = new THREE.MeshStandardMaterial({ color: 0xd8d2c4, roughness: 0.95 });
const matWoodRed = new THREE.MeshStandardMaterial({ map: texWoodRed, roughness: 0.55, metalness: 0.05 });
const matWoodDark = new THREE.MeshStandardMaterial({ map: texWoodDark, roughness: 0.68 });
const matMetal = new THREE.MeshStandardMaterial({ color: 0x63676b, roughness: 0.42, metalness: 0.78 });
const matIron = new THREE.MeshStandardMaterial({ color: 0x8b8a84, roughness: 0.82, metalness: 0.18 });
const matWhitePlastic = new THREE.MeshStandardMaterial({ color: 0xdedbd4, roughness: 0.6 });

function box(parent, w, h, d, x, y, z, mat, shadow = true) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  m.castShadow = shadow;
  m.receiveShadow = true;
  parent.add(m);
  return m;
}

/* ── 能打开的抽屉：拉开可以拿子弹 ───────────────────────────────
   这些抽屉要能动，所以直接挂到 scene 上；
   放进 world 的话会被 mergeStatic 合进静态批次，就再也动不了了。 */
const ammoSpots = [];

function buildDrawerBox(parent, d) {
  const g = new THREE.Group();
  // 拉开后才看得见的抽屉盒
  box(g, d.w * 0.94, d.h * 0.86, d.depth, 0, 0, -d.depth / 2 - 0.012, d.mat, false);
  // 面板
  box(g, d.w, d.h, 0.02, 0, 0, 0, d.face, false);
  // 把手
  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 6), matMetal);
  knob.position.set(0, 0.013, 0.032);
  g.add(knob);
  g.position.set(d.x, d.y, d.z);
  parent.add(g);
  return g;
}

// drawers 一起滑出；opts.x / opts.z 是世界坐标，用来判断玩家够不够得着
function makeAmmoUnit(drawers, opts) {
  const unit = new THREE.Group();
  for (const d of drawers) buildDrawerBox(unit, d);
  scene.add(unit);                  // 不进 world，才不会被静态合并
  const spot = {
    mesh: unit, slide: opts.slide, cur: 0, open: false, cooldown: 0,
    x: opts.x, z: opts.z, name: opts.name || '抽屉',
    giveRifle: opts.giveRifle, giveShell: opts.giveShell,
  };
  ammoSpots.push(spot);
  return spot;
}

const V = (x, y, z) => new THREE.Vector3(x, y, z);
const R = (x, y, z) => new THREE.Euler(x, y, z);

function addPlane(w, h, mat, pos, rot) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
  m.position.copy(pos);
  m.rotation.set(rot.x, rot.y, rot.z);
  m.receiveShadow = true;
  world.add(m);
  return m;
}

/* =========================================================================
   房间壳：白瓷砖地 / 白吊顶 / 脏白墙 / 黑踢脚线
   ========================================================================= */
addPlane(ROOM_W, ROOM_D, matFloor, V(0, 0, 0), R(-Math.PI / 2, 0, 0));
addPlane(ROOM_W, ROOM_D, matCeil, V(0, ROOM_H, 0), R(Math.PI / 2, 0, 0));
addPlane(ROOM_W, ROOM_H, matWall, V(0, ROOM_H / 2, -ROOM_D / 2), R(0, 0, 0));           // 北
// 南墙：中间留 1.2 × 2.14 m 的门洞，门可以打开走到外面
box(world, 2.40, ROOM_H, 0.05, -1.80, ROOM_H / 2, ROOM_D / 2, matWall);
box(world, 2.40, ROOM_H, 0.05,  1.80, ROOM_H / 2, ROOM_D / 2, matWall);
box(world, 1.20, 0.86, 0.05,  0.00, 2.57,       ROOM_D / 2, matWall);
addPlane(ROOM_D, ROOM_H, matWall, V(-ROOM_W / 2, ROOM_H / 2, 0), R(0, Math.PI / 2, 0));  // 西
addPlane(ROOM_D, ROOM_H, matWall, V(ROOM_W / 2, ROOM_H / 2, 0), R(0, -Math.PI / 2, 0));  // 东

box(world, ROOM_W, 0.11, 0.035, 0, 0.055, -ROOM_D / 2 + 0.018, matBase);
box(world, ROOM_W, 0.11, 0.035, 0, 0.055, ROOM_D / 2 - 0.018, matBase);
box(world, 0.035, 0.11, ROOM_D, -ROOM_W / 2 + 0.018, 0.055, 0, matBase);
box(world, 0.035, 0.11, ROOM_D, ROOM_W / 2 - 0.018, 0.055, 0, matBase);

/* =========================================================================
   灯光
   ========================================================================= */
scene.add(new THREE.HemisphereLight(0xcfd8e2, 0x2e2a24, 1.05));
scene.add(new THREE.AmbientLight(0xb8c0c8, 0.42));

const fluo = new THREE.SpotLight(0xe6eef8, 72, 0, Math.PI / 2.5, 0.55, 2);
fluo.position.set(0, 2.88, 0);
fluo.target.position.set(0, 0, 0);
fluo.castShadow = true;
fluo.shadow.mapSize.set(512, 512);
fluo.shadow.bias = -0.0012;
fluo.shadow.camera.near = 0.2;
fluo.shadow.camera.far = 12;
scene.add(fluo, fluo.target);

const winLight = new THREE.DirectionalLight(0xc9dcf2, 1.5);
winLight.position.set(-1.2, 2.8, -5.5);
winLight.target.position.set(0.3, 0.8, 0.5);
scene.add(winLight, winLight.target);

/* =========================================================================
   通用沙发（黑皮 + 深红木扶手，可指定脱皮）
   ========================================================================= */
function buildSofa(width, depth, opts = {}) {
  const g = new THREE.Group();
  const leather = opts.worn ? matLeatherWorn : matLeather;

  box(g, width, 0.30, depth, 0, 0.32, 0, leather);
  box(g, width, 0.62, 0.18, 0, 0.72, -depth / 2 + 0.09, leather);

  box(g, 0.13, 0.62, depth, -(width / 2 - 0.065), 0.55, 0, matWoodRed);
  box(g, 0.13, 0.62, depth, (width / 2 - 0.065), 0.55, 0, matWoodRed);
  box(g, 0.16, 0.06, depth + 0.03, -(width / 2 - 0.065), 0.88, 0, matWoodRed);
  box(g, 0.16, 0.06, depth + 0.03, (width / 2 - 0.065), 0.88, 0, matWoodRed);

  const seats = opts.seats || 1;
  const innerW = width - 0.26;
  const seatW = innerW / seats;
  for (let i = 0; i < seats; i++) {
    const cx = -innerW / 2 + seatW * (i + 0.5);
    box(g, seatW - 0.03, 0.16, depth - 0.24, cx, 0.55, 0.03, leather);
  }

  for (let i = 0; i < seats; i++) {
    const cx = -innerW / 2 + seatW * (i + 0.5);
    const p = box(g, seatW - 0.05, 0.42, 0.12, cx, 0.86, -depth / 2 + 0.22, leather);
    p.rotation.x = -0.12;
  }

  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      box(g, 0.07, 0.10, 0.07, sx * (width / 2 - 0.12), 0.05, sz * (depth / 2 - 0.12), matWoodRed);
    }
  }

  // 严重脱皮：露出白色内衬
  if (opts.peeling) {
    const peel = [
      [0.30, 0.11, 0.02, 0.05, 0.56, depth / 2 - 0.08, 0.55],
      [-0.16, 0.08, 0.015, -0.10, 0.60, depth / 2 - 0.08, 0.30],
      [0.05, 0.13, 0.02, 0.02, 0.92, -depth / 2 + 0.29, 0.6],
      [0.24, 0.07, 0.015, 0.20, 0.88, -depth / 2 + 0.29, -0.4],
      [0.14, 0.09, 0.02, -0.26, 0.70, depth / 2 - 0.13, -0.9],
    ];
    for (const [w, h, d, x, y, z, rz] of peel) {
      const m = box(g, w, h, d, x, y, z, matLeatherPeel, false);
      m.rotation.z = rz;
    }
  }

  return g;
}

/* =========================================================================
   北墙：磨砂窗 + 浅蓝窗帘 + 深棕书桌 + 小茶几 + 两张单人沙发
   ========================================================================= */
const winGlassMat = new THREE.MeshBasicMaterial({ color: 0xdfe9f2, transparent: true, opacity: 0.92 });

// 磨砂玻璃窗
{
  const g = new THREE.Group();

  const glass = new THREE.Mesh(new THREE.PlaneGeometry(1.28, 1.46), winGlassMat);
  glass.position.z = 0.012;
  g.add(glass);

  const fm = matWhitePlastic;
  box(g, 1.42, 0.08, 0.08, 0, 0.77, 0, fm);
  box(g, 1.42, 0.08, 0.08, 0, -0.77, 0, fm);
  box(g, 0.08, 1.62, 0.08, -0.71, 0, 0, fm);
  box(g, 0.08, 1.62, 0.08, 0.71, 0, 0, fm);
  box(g, 1.34, 0.05, 0.05, 0, 0.0, 0, fm);
  box(g, 0.05, 1.54, 0.05, 0, 0, 0, fm);

  g.position.set(-1.15, 1.68, -2.34);
  world.add(g);
}

// 浅蓝窗帘
{
  const curtainMat = new THREE.MeshStandardMaterial({
    map: makeCurtainTexture(),
    roughness: 0.95,
    side: THREE.DoubleSide,
  });

  for (const sx of [-1, 1]) {
    const c = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 1.95), curtainMat);
    c.position.set(-1.15 + sx * 0.86, 1.65, -2.25);
    c.castShadow = true;
    world.add(c);
  }

  const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 2.1, 10), matMetal);
  rod.rotation.z = Math.PI / 2;
  rod.position.set(-1.15, 2.64, -2.25);
  world.add(rod);
}

// 窗下深棕书桌（带抽屉）
{
  const g = new THREE.Group();
  box(g, 1.20, 0.06, 0.62, 0, 0.72, 0, matWoodDark);
  box(g, 0.44, 0.66, 0.56, -0.34, 0.33, 0, matWoodDark);
  box(g, 0.44, 0.66, 0.56, 0.34, 0.33, 0, matWoodDark);

  for (const dx of [-0.34, 0.34]) {
    for (let i = 0; i < 2; i++) {
      box(g, 0.38, 0.26, 0.02, dx, 0.16 + i * 0.32, 0.29, matWoodDark);
      const knob = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 6), matMetal);
      knob.position.set(dx, 0.16 + i * 0.32, 0.31);
      g.add(knob);
    }
  }

  // 桌上一摞纸
  box(g, 0.30, 0.05, 0.22, 0.35, 0.775, 0.10, new THREE.MeshStandardMaterial({ color: 0xd6d2c6, roughness: 0.95 }), false);

  g.scale.set(1.5, 1, 1.5);     // 只放大平面，高度不变
  g.position.set(-1.15, 0, -1.92);
  world.add(g);

  // 四个抽屉都能拉开拿子弹。world 会被静态合并，所以抽屉单独挂在 scene 上；
  // 这张桌子整体放大了 1.5 倍，坐标要按世界尺寸写。
  const drawers = [];
  for (const dx of [-0.34, 0.34]) for (let i = 0; i < 2; i++) {
    drawers.push({
      x: -1.15 + dx * 1.5, y: 0.16 + i * 0.32, z: -1.92 + 0.31 * 1.5,
      w: 0.38 * 1.5, h: 0.26, depth: 0.80, mat: matWoodDark, face: matWoodDark,
    });
  }
  makeAmmoUnit(drawers, {
    x: -1.15, z: -1.90, slide: 0.34, name: '书桌抽屉',
    giveRifle: 120, giveShell: 24,
  });
}

// 小木茶几
{
  const g = new THREE.Group();
  box(g, 0.58, 0.05, 0.58, 0, 0.40, 0, matWoodDark);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    box(g, 0.05, 0.40, 0.05, sx * 0.24, 0.20, sz * 0.24, matWoodDark);
  }
  g.position.set(-1.15, 0, -0.95);
  world.add(g);
}

// 两张黑皮单人沙发（右边那张严重脱皮）
const northSofa1 = buildSofa(0.85, 0.84, { seats: 1 });
northSofa1.scale.set(1.5, 1, 1.5);   // 只放大平面，高度不变
northSofa1.position.set(0.54, 0, -1.75);
world.add(northSofa1);

const northSofa2 = buildSofa(0.85, 0.84, { seats: 1, worn: true });
northSofa2.scale.set(1.5, 1, 1.5);   // 只放大平面，高度不变
northSofa2.position.set(1.84, 0, -1.75);
world.add(northSofa2);

/* =========================================================================
   东墙：三人沙发 + 单人沙发 + 壁扇 + 金属管压力表
   ========================================================================= */
const sofa3 = buildSofa(2.35, 0.86, { seats: 3 });
sofa3.rotation.y = -Math.PI / 2;
sofa3.position.set(2.56, 0, 0.25);
world.add(sofa3);

// 壁挂风扇（会转，所以放在 scene 里不参与合并）
const fanGroup = new THREE.Group();
{
  const cage = new THREE.Mesh(new THREE.TorusGeometry(0.27, 0.018, 8, 32), matMetal);
  fanGroup.add(cage);

  for (let i = 0; i < 4; i++) {
    const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.012, 0.012), matMetal);
    spoke.rotation.z = (i * Math.PI) / 4;
    fanGroup.add(spoke);
  }

  const blades = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const b = new THREE.Mesh(new THREE.BoxGeometry(0.21, 0.09, 0.012), matWhitePlastic);
    b.position.set(0.10, 0, 0);
    const holder = new THREE.Group();
    holder.rotation.z = (i * Math.PI * 2) / 3;
    holder.add(b);
    blades.add(holder);
  }
  fanGroup.add(blades);
  fanGroup.userData.blades = blades;

  const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.06, 16), matMetal);
  hub.rotation.x = Math.PI / 2;
  fanGroup.add(hub);

  const arm = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.07, 0.16), matMetal);
  arm.position.z = -0.16;
  fanGroup.add(arm);
}
fanGroup.rotation.y = -Math.PI / 2;
fanGroup.position.set(2.92, 2.15, 0.25);
scene.add(fanGroup);

// 东墙南端：灰色金属管 + 压力表
{
  const g = new THREE.Group();

  const vp = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, ROOM_H, 14), matMetal);
  vp.position.y = ROOM_H / 2;
  vp.castShadow = true;
  g.add(vp);

  const hp = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, 0.70, 14), matMetal);
  hp.rotation.x = Math.PI / 2;
  hp.position.set(-0.02, 1.55, -0.35);
  hp.castShadow = true;
  g.add(hp);

  const tee = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 10), matMetal);
  tee.position.set(0, 1.55, 0);
  g.add(tee);

  // 压力表（朝房间内 -x）
  const gauge = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.045, 20), matMetal);
  body.rotation.x = Math.PI / 2;
  gauge.add(body);
  const face = new THREE.Mesh(new THREE.CircleGeometry(0.075, 20),
    new THREE.MeshStandardMaterial({ color: 0xe8e4d8, roughness: 0.7 }));
  face.position.z = 0.024;
  gauge.add(face);
  const needle = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.055, 0.004),
    new THREE.MeshStandardMaterial({ color: 0x8b1a12, roughness: 0.6 }));
  needle.position.set(0.008, 0.024, 0.028);
  needle.rotation.z = -0.5;
  gauge.add(needle);

  gauge.rotation.y = -Math.PI / 2;
  gauge.position.set(-0.10, 1.55, -0.70);
  g.add(gauge);

  g.position.set(2.86, 0, 2.32);
  world.add(g);
}

/* =========================================================================
   西墙：圆挂钟 + 白色空调 + 铸铁暖气片 + 竖管 + 插座
   ========================================================================= */
{
  const g = new THREE.Group();

  // 表圈
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.024, 10, 36), matMetal);
  g.add(rim);

  // 表盘
  const face = new THREE.Mesh(new THREE.CircleGeometry(0.205, 40),
    new THREE.MeshStandardMaterial({ color: 0xeeeae0, roughness: 0.85 }));
  face.position.z = 0.014;
  g.add(face);

  // 12 个刻度
  const tickMat = new THREE.MeshStandardMaterial({ color: 0x1c1c1c, roughness: 0.7 });
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const len = (i % 3 === 0) ? 0.045 : 0.026;
    const tick = new THREE.Mesh(new THREE.BoxGeometry(0.012, len, 0.006), tickMat);
    tick.position.set(Math.sin(a) * 0.175, Math.cos(a) * 0.175, 0.02);
    tick.rotation.z = -a;
    g.add(tick);
  }

  const handMat = new THREE.MeshStandardMaterial({ color: 0x141414, roughness: 0.55 });

  // 时针：整根指针挂在钟心上的组里，绕钟心转
  const hourPivot = new THREE.Group();
  hourPivot.position.z = 0.026;
  const hourHand = new THREE.Mesh(new THREE.BoxGeometry(0.020, 0.105, 0.006), handMat);
  hourHand.position.y = 0.052;
  hourPivot.add(hourHand);
  hourPivot.rotation.z = -1.14;
  g.add(hourPivot);

  // 分针
  const minPivot = new THREE.Group();
  minPivot.position.z = 0.034;
  const minHand = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.155, 0.005), handMat);
  minHand.position.y = 0.077;
  minPivot.add(minHand);
  minPivot.rotation.z = 1.05;
  g.add(minPivot);

  // 中心轴钉
  const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.02, 12), matMetal);
  pin.rotation.x = Math.PI / 2;
  pin.position.z = 0.04;
  g.add(pin);

  g.rotation.y = Math.PI / 2;
  g.position.set(-ROOM_W / 2 + 0.035, 2.25, 0.55);
  world.add(g);
}

// 白色壁挂空调
{
  const g = new THREE.Group();
  box(g, 0.20, 0.30, 0.92, 0, 0, 0, matWhitePlastic);
  box(g, 0.02, 0.05, 0.84, 0.105, -0.10, 0,
    new THREE.MeshStandardMaterial({ color: 0xb9b6ae, roughness: 0.8 }), false);
  const led = new THREE.Mesh(new THREE.CircleGeometry(0.012, 8),
    new THREE.MeshBasicMaterial({ color: 0x63d18a }));
  led.rotation.y = Math.PI / 2;
  led.position.set(0.103, 0.08, 0.32);
  g.add(led);

  g.position.set(-ROOM_W / 2 + 0.11, 2.18, -1.72);
  world.add(g);
}

// 铸铁暖气片
{
  const g = new THREE.Group();
  const n = 10;
  const finW = 0.072;
  const gap = 0.034;
  const total = n * (finW + gap) - gap;

  for (let i = 0; i < n; i++) {
    const z = -total / 2 + i * (finW + gap) + finW / 2;
    box(g, 0.15, 0.60, finW, 0, 0, z, matIron);
  }

  const pipeTop = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.036, total + 0.12, 12), matIron);
  pipeTop.rotation.x = Math.PI / 2;
  pipeTop.position.set(0, 0.28, 0);
  pipeTop.castShadow = true;
  g.add(pipeTop);
  const pipeBot = pipeTop.clone();
  pipeBot.position.y = -0.28;
  g.add(pipeBot);

  const red = new THREE.MeshStandardMaterial({ color: 0x9b1d17, roughness: 0.55, metalness: 0.25 });
  const valve = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.07, 12), red);
  valve.position.set(0.02, 0.36, total / 2 + 0.10);
  valve.castShadow = true;
  g.add(valve);
  const knob = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.02, 0.03), red);
  knob.position.set(0.02, 0.40, total / 2 + 0.10);
  g.add(knob);

  g.position.set(-ROOM_W / 2 + 0.16, 0.52, -0.92);
  world.add(g);
}

// 西墙竖管 + 白色插座
{
  const p = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, ROOM_H, 12), matMetal);
  p.position.set(-2.86, ROOM_H / 2, 2.05);
  p.castShadow = true;
  world.add(p);

  for (const z of [1.55, -2.1]) {
    box(world, 0.015, 0.09, 0.09, -ROOM_W / 2 + 0.01, 0.32, z, matWhitePlastic, false);
  }
}

/* =========================================================================
   南墙：双开木门（门框静态 + 门板可开）
   ========================================================================= */
let doorLeft, doorRight;
let doorOpen = 0;      // 0 = 全关，1 = 全开
let doorTarget = 0;

{
  const g = new THREE.Group();

  box(g, 0.10, 2.18, 0.10, -0.62, 1.09, 0, matWoodRed);
  box(g, 0.10, 2.18, 0.10, 0.62, 1.09, 0, matWoodRed);
  box(g, 1.34, 0.10, 0.10, 0, 2.19, 0, matWoodRed);

  g.position.set(0, 0, ROOM_D / 2 - 0.03);
  world.add(g);
}

// 两扇门板：各自挂在外侧门轴上的组里，绕门轴往外开
doorLeft = new THREE.Group();
doorRight = new THREE.Group();
{
  for (const [pivot, sx] of [[doorLeft, -1], [doorRight, 1]]) {
    const cx = -sx * 0.275;

    const p1 = new THREE.Mesh(new THREE.BoxGeometry(0.55, 2.05, 0.05), matWoodDark);
    p1.position.set(cx, 1.045, -0.045);
    pivot.add(p1);

    const p2 = new THREE.Mesh(new THREE.BoxGeometry(0.40, 0.72, 0.02), matWoodDark);
    p2.position.set(cx, 1.52, -0.072);
    pivot.add(p2);

    const p3 = new THREE.Mesh(new THREE.BoxGeometry(0.40, 0.62, 0.02), matWoodDark);
    p3.position.set(cx, 0.62, -0.072);
    pivot.add(p3);

    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.10, 10), matMetal);
    handle.rotation.z = Math.PI / 2;
    handle.position.set(-sx * 0.46, 1.02, -0.085);
    pivot.add(handle);

    pivot.position.set(sx * 0.56, 0, ROOM_D / 2 - 0.03);
    scene.add(pivot);
  }
}

// 门左侧白色开关
box(world, 0.09, 0.09, 0.015, 0.92, 1.22, ROOM_D / 2 - 0.012, matWhitePlastic, false);

/* =========================================================================
   镜子（南墙东侧，反射空调与暖气片）
   ========================================================================= */
class Mirror extends THREE.Mesh {
  constructor(geometry, options = {}) {
    super(geometry);

    const scope = this;
    this.type = 'Mirror';

    const color = new THREE.Color(options.color !== undefined ? options.color : 0x7f7f7f);
    const textureWidth = options.textureWidth || 256;
    const textureHeight = options.textureHeight || 384;
    const clipBias = options.clipBias || 0;
    const multisample = options.multisample !== undefined ? options.multisample : 0;

    const reflectorPlane = new THREE.Plane();
    const normal = new THREE.Vector3();
    const reflectorWorldPosition = new THREE.Vector3();
    const cameraWorldPosition = new THREE.Vector3();
    const rotationMatrix = new THREE.Matrix4();
    const lookAtPosition = new THREE.Vector3(0, 0, -1);
    const clipPlane = new THREE.Vector4();
    const view = new THREE.Vector3();
    const target = new THREE.Vector3();
    const q = new THREE.Vector4();
    const textureMatrix = new THREE.Matrix4();

    const virtualCamera = new THREE.PerspectiveCamera();
    virtualCamera.layers.enable(LAYER_PLAYER);
    this.camera = virtualCamera;

    const renderTarget = new THREE.WebGLRenderTarget(textureWidth, textureHeight, {
      samples: multisample,
      type: THREE.HalfFloatType,
    });

    const material = new THREE.ShaderMaterial({
      name: 'MirrorShader',
      uniforms: {
        color: { value: color },
        tDiffuse: { value: renderTarget.texture },
        textureMatrix: { value: textureMatrix },
      },
      vertexShader: /* glsl */`
        uniform mat4 textureMatrix;
        varying vec4 vUv;
        #include <common>
        #include <logdepthbuf_pars_vertex>
        void main() {
          vUv = textureMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          #include <logdepthbuf_vertex>
        }`,
      fragmentShader: /* glsl */`
        uniform vec3 color;
        uniform sampler2D tDiffuse;
        varying vec4 vUv;
        #include <logdepthbuf_pars_fragment>
        void main() {
          #include <logdepthbuf_fragment>
          vec4 base = texture2DProj(tDiffuse, vUv);
          // 直接出画面，只做一点点提亮和冷色偏；不用 overlay（那会把中间调压暗一半，人看起来发黑）
          vec3 tint = vec3(0.96, 0.985, 1.02);
          gl_FragColor = vec4(pow(base.rgb, vec3(0.90)) * tint, 1.0);
          #include <colorspace_fragment>
        }`,
    });

    this.material = material;

    let mirrorTick = 0;
    this.onBeforeRender = function (renderer, scene, camera) {
      // 隔帧更新（画面吃力时自动降到每 3 帧一次），开销减半以上
      if (mirrorTick++ % mirrorStride !== 0) return;

      reflectorWorldPosition.setFromMatrixPosition(scope.matrixWorld);
      cameraWorldPosition.setFromMatrixPosition(camera.matrixWorld);

      rotationMatrix.extractRotation(scope.matrixWorld);
      normal.set(0, 0, 1);
      normal.applyMatrix4(rotationMatrix);

      view.subVectors(reflectorWorldPosition, cameraWorldPosition);
      if (view.dot(normal) > 0) return;

      view.reflect(normal).negate();
      view.add(reflectorWorldPosition);

      rotationMatrix.extractRotation(camera.matrixWorld);
      lookAtPosition.set(0, 0, -1);
      lookAtPosition.applyMatrix4(rotationMatrix);
      lookAtPosition.add(cameraWorldPosition);

      target.subVectors(reflectorWorldPosition, lookAtPosition);
      target.reflect(normal).negate();
      target.add(reflectorWorldPosition);

      virtualCamera.position.copy(view);
      virtualCamera.up.set(0, 1, 0);
      virtualCamera.up.applyMatrix4(rotationMatrix);
      virtualCamera.up.reflect(normal);
      virtualCamera.lookAt(target);
      virtualCamera.far = camera.far;
      virtualCamera.updateMatrixWorld();
      virtualCamera.projectionMatrix.copy(camera.projectionMatrix);

      textureMatrix.set(
        0.5, 0.0, 0.0, 0.5,
        0.0, 0.5, 0.0, 0.5,
        0.0, 0.0, 0.5, 0.5,
        0.0, 0.0, 0.0, 1.0
      );
      textureMatrix.multiply(virtualCamera.projectionMatrix);
      textureMatrix.multiply(virtualCamera.matrixWorldInverse);
      textureMatrix.multiply(scope.matrixWorld);

      reflectorPlane.setFromNormalAndCoplanarPoint(normal, reflectorWorldPosition);
      reflectorPlane.applyMatrix4(virtualCamera.matrixWorldInverse);
      clipPlane.set(reflectorPlane.normal.x, reflectorPlane.normal.y, reflectorPlane.normal.z, reflectorPlane.constant);

      const projectionMatrix = virtualCamera.projectionMatrix;
      q.x = (Math.sign(clipPlane.x) + projectionMatrix.elements[8]) / projectionMatrix.elements[0];
      q.y = (Math.sign(clipPlane.y) + projectionMatrix.elements[9]) / projectionMatrix.elements[5];
      q.z = -1.0;
      q.w = (1.0 + projectionMatrix.elements[10]) / projectionMatrix.elements[14];
      clipPlane.multiplyScalar(2.0 / clipPlane.dot(q));

      projectionMatrix.elements[2] = clipPlane.x;
      projectionMatrix.elements[6] = clipPlane.y;
      projectionMatrix.elements[10] = clipPlane.z + 1.0 - clipBias;
      projectionMatrix.elements[14] = clipPlane.w;

      scope.visible = false;

      const currentRenderTarget = renderer.getRenderTarget();
      const currentXrEnabled = renderer.xr.enabled;
      const currentShadowAutoUpdate = renderer.shadowMap.autoUpdate;

      renderer.xr.enabled = false;
      renderer.shadowMap.autoUpdate = false;
      renderer.setRenderTarget(renderTarget);
      renderer.state.buffers.depth.setMask(true);
      if (renderer.autoClear === false) renderer.clear();
      renderer.render(scene, virtualCamera);

      renderer.xr.enabled = currentXrEnabled;
      renderer.shadowMap.autoUpdate = currentShadowAutoUpdate;
      renderer.setRenderTarget(currentRenderTarget);

      const viewport = camera.viewport;
      if (viewport !== undefined) renderer.state.viewport(viewport);

      scope.visible = true;
    };

    this.getRenderTarget = () => renderTarget;
    this.dispose = () => {
      renderTarget.dispose();
      material.dispose();
    };
  }
}

{
  const mirrorFrameMat = new THREE.MeshStandardMaterial({ color: 0x2a2622, roughness: 0.55, metalness: 0.08 });
  box(scene, 0.92, 1.34, 0.05, -1.55, 1.52, ROOM_D / 2 - 0.055, mirrorFrameMat, false);

  const mirror = new Mirror(new THREE.PlaneGeometry(0.80, 1.22), {
    textureWidth: 512,
    textureHeight: 768,
    multisample: 0,
    clipBias: 0.003,
    color: 0x7a7f83,
  });
  mirror.rotation.y = Math.PI;
  mirror.position.set(-1.55, 1.52, ROOM_D / 2 - 0.092);
  scene.add(mirror);
}

/* =========================================================================
   吊顶：荧光灯 + 烟雾探测器 + 消防喷淋头
   ========================================================================= */
{
  // 荧光灯外壳
  box(world, 1.35, 0.07, 0.36, 0, ROOM_H - 0.045, 0,
    new THREE.MeshStandardMaterial({ color: 0xd6d4ce, roughness: 0.6, metalness: 0.15 }), false);

  // 灯管（自发光）
  const tube = new THREE.Mesh(
    new THREE.BoxGeometry(1.18, 0.035, 0.13),
    new THREE.MeshBasicMaterial({ color: 0xf2f6fa })
  );
  tube.position.set(0, ROOM_H - 0.085, 0);
  world.add(tube);

  for (const sx of [-1, 1]) {
    const cap = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.05, 0.15),
      new THREE.MeshStandardMaterial({ color: 0x8d8b86, roughness: 0.5 }));
    cap.position.set(sx * 0.62, ROOM_H - 0.085, 0);
    world.add(cap);
  }

  // 烟雾探测器
  for (const [x, z] of [[-1.35, -1.6], [1.5, 1.1]]) {
    const det = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.065, 0.035, 18), matWhitePlastic);
    det.position.set(x, ROOM_H - 0.02, z);
    world.add(det);
    const led = new THREE.Mesh(new THREE.CircleGeometry(0.008, 8),
      new THREE.MeshBasicMaterial({ color: 0xd94a3a }));
    led.rotation.x = Math.PI / 2;
    led.position.set(x, ROOM_H - 0.038, z);
    world.add(led);
  }

  // 消防喷淋头
  for (const [x, z] of [[-1.6, 0.9], [1.6, -1.4], [0.2, 2.2]]) {
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.06, 10), matMetal);
    stem.position.set(x, ROOM_H - 0.03, z);
    world.add(stem);
    const disc = new THREE.Mesh(new THREE.CircleGeometry(0.055, 14), matMetal);
    disc.rotation.x = Math.PI / 2;
    disc.position.set(x, ROOM_H - 0.062, z);
    world.add(disc);
  }
}

/* =========================================================================
   静态合并：把上百个方块合成十几批
   ========================================================================= */
function mergeStatic(root) {
  root.updateMatrixWorld(true);

  const buckets = new Map();

  root.traverse((o) => {
    if (!o.isMesh || Array.isArray(o.material)) return;

    const key = `${o.material.uuid}|${o.castShadow ? 1 : 0}|${o.receiveShadow ? 1 : 0}`;
    let b = buckets.get(key);
    if (!b) {
      b = { mat: o.material, cast: o.castShadow, receive: o.receiveShadow, geos: [], srcs: [] };
      buckets.set(key, b);
    }

    const geo = o.geometry.clone();
    geo.applyMatrix4(o.matrixWorld);
    b.geos.push(geo);
    b.srcs.push(o);
  });

  let batches = 0;

  for (const b of buckets.values()) {
    let merged = null;
    try {
      merged = mergeGeometries(b.geos, false);
    } catch (err) {
      console.warn('合并失败，这一批保留原件', err);
    }
    for (const g of b.geos) g.dispose();

    if (!merged) continue;

    for (const src of b.srcs) {
      src.parent.remove(src);
      src.geometry.dispose();
    }

    const mesh = new THREE.Mesh(merged, b.mat);
    mesh.castShadow = b.cast;
    mesh.receiveShadow = b.receive;
    mesh.frustumCulled = false;
    root.add(mesh);
    batches++;
  }

  console.log(`[性能] 静态物体合并完成：${batches} 个绘制批次`);
}

/* =========================================================================
   门外世界：一条东西向走廊 + 四间教室
   -------------------------------------------------------------------------
   走廊：x -10 ~ 10，z 2.4 ~ 4.8
   南侧教室 A(-7~-2) B(2~7)，z 4.8 ~ 8.8
   北侧教室 C(-8.5~-3.5) D(3.5~8.5)，z -1.6 ~ 2.4
   教室门洞：x -7~-5、5~7（走廊南墙 / 北墙各一对）
   ========================================================================= */
const WALL_T = 0.08;
const deskRects = [];

const matHallFloor = new THREE.MeshStandardMaterial({ color: 0x8b8a7e, roughness: 0.9, metalness: 0.02 });
const matHallCeil  = new THREE.MeshStandardMaterial({ color: 0xd8d6cd, roughness: 1.0, metalness: 0 });
const matStrip     = new THREE.MeshBasicMaterial({ color: 0xf2f4e6 });

function slabRect(x0, x1, z0, z1, y, mat, down) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(x1 - x0, z1 - z0), mat);
  m.rotation.x = down ? Math.PI / 2 : -Math.PI / 2;
  m.position.set((x0 + x1) / 2, y, (z0 + z1) / 2);
  m.receiveShadow = !down;
  world.add(m);
  return m;
}

function wallX(x0, x1, z) {     // 沿 x 方向延伸的墙
  box(world, x1 - x0, ROOM_H, WALL_T, (x0 + x1) / 2, ROOM_H / 2, z, matWall);
}

function wallZ(z0, z1, x) {     // 沿 z 方向延伸的墙
  box(world, WALL_T, ROOM_H, z1 - z0, x, ROOM_H / 2, (z0 + z1) / 2, matWall);
}

// ---- 走廊 ----
slabRect(-10, 10, 2.4, 4.8, 0.002, matHallFloor, false);
slabRect(-10, 10, 2.4, 4.8, ROOM_H - 0.002, matHallCeil, true);

// 北墙：办公室门洞 ±0.6（就是房间那道门），教室 C 门洞 -7~-5，教室 D 门洞 5~7
wallX(-9.96, -7.00, 2.4);
wallX(-5.00, -3.10, 2.4);
wallX( 3.10,  5.00, 2.4);
wallX( 7.00,  9.96, 2.4);

// 南墙：教室 A 门洞 -7~-5，教室 B 门洞 5~7
wallX(-9.96, -7.00, 4.8);
wallX(-5.00,  5.00, 4.8);
wallX( 7.00,  9.96, 4.8);

// 走廊两头封死
wallZ(2.4, 4.8, -10);
wallZ(2.4, 4.8,  10);

// 走廊吊灯（自发光条，不参与光照计算，几乎不花性能）
for (let i = -4; i <= 4; i++) {
  box(world, 1.30, 0.055, 0.22, i * 2.1, ROOM_H - 0.06, 3.6, matStrip, false);
}

// ---- 四间教室 ----
const classrooms = [
  [-7, -2, 4.8, 8.8],     // A 南侧西
  [ 2,  7, 4.8, 8.8],     // B 南侧东
  [-8.5, -3.5, -1.6, 2.4], // C 北侧西
  [ 3.5,  8.5, -1.6, 2.4], // D 北侧东
];

for (const [x0, x1, z0, z1] of classrooms) {
  slabRect(x0, x1, z0, z1, 0.002, matHallFloor, false);
  slabRect(x0, x1, z0, z1, ROOM_H - 0.002, matHallCeil, true);
  wallZ(z0, z1, x0);
  wallZ(z0, z1, x1);
  if (z1 > 4) wallX(x0, x1, z1);   // 南侧教室的外墙在南边
  else        wallX(x0, x1, z0);   // 北侧教室的外墙在北边
}

// 教室课桌椅
function classDesk(x, z) {
  const g = new THREE.Group();
  box(g, 0.68, 0.045, 0.48, 0, 0.72, 0, matWoodDark, false);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    box(g, 0.05, 0.72, 0.05, sx * 0.27, 0.36, sz * 0.17, matWoodDark, false);
  }
  g.position.set(x, 0, z);
  world.add(g);
  deskRects.push({ minX: x - 0.36, maxX: x + 0.36, minZ: z - 0.26, maxZ: z + 0.26, top: 0.75 });

  // 桌肚里一个抽屉，拉开给弹药
  makeAmmoUnit([{ x, y: 0.60, z: z + 0.235, w: 0.56, h: 0.15, depth: 0.40,
                  mat: matWoodDark, face: matWoodDark }],
    { x, z, slide: 0.26, name: '课桌抽屉', giveRifle: 80, giveShell: 12 });
}

for (const [x0, x1, z0, z1] of classrooms) {
  const cx = (x0 + x1) / 2, cz = (z0 + z1) / 2;
  for (const dx of [-0.75, 0.75]) for (const dz of [-0.8, 0.8]) {
    classDesk(cx + dx, cz + dz);
  }
}

/* =========================================================================
   室内陈设细化：桌面办公用品 / 地毯 / 文件柜 / 纸箱 / 挂历 / 海报 / 靠垫
   —— 全部加进 world，随后和原有家具一起静态合并
   ========================================================================= */
{
  const matPaper    = new THREE.MeshStandardMaterial({ color: 0xd9d4c6, roughness: 0.96 });
  const matPaperW   = new THREE.MeshStandardMaterial({ color: 0xe8e5da, roughness: 0.95 });
  const matScreen   = new THREE.MeshStandardMaterial({
    color: 0x0d1216, emissive: 0x31566e, emissiveIntensity: 0.65, roughness: 0.32,
  });
  const matPlasticB = new THREE.MeshStandardMaterial({ color: 0x1b1d20, roughness: 0.52, metalness: 0.12 });
  const matCard     = new THREE.MeshStandardMaterial({ color: 0x9c7749, roughness: 0.96 });
  const matRug      = new THREE.MeshStandardMaterial({ color: 0x5c2e2a, roughness: 0.99 });
  const matFabric   = new THREE.MeshStandardMaterial({ color: 0x6d6459, roughness: 0.96 });
  const matCeramic2 = new THREE.MeshStandardMaterial({ color: 0xd8d4ca, roughness: 0.42 });
  const matGlassDk  = new THREE.MeshStandardMaterial({ color: 0x2a3438, roughness: 0.25, metalness: 0.5 });

  // 地毯（茶几下面，带一圈浅色边）
  {
    const rug = new THREE.Mesh(new THREE.PlaneGeometry(1.72, 1.44), matRug);
    rug.rotation.x = -Math.PI / 2;
    rug.position.set(-1.15, 0.006, -0.95);
    rug.receiveShadow = true;
    world.add(rug);
    for (const [w, d, x, z] of [[1.72, 0.05, 0, 0.69], [1.72, 0.05, 0, -0.69]]) {
      const b = new THREE.Mesh(new THREE.PlaneGeometry(w, d),
        new THREE.MeshStandardMaterial({ color: 0x8a6a4a, roughness: 0.99 }));
      b.rotation.x = -Math.PI / 2;
      b.position.set(-1.15 + x, 0.007, -0.95 + z);
      world.add(b);
    }
  }

  // ---- 书桌桌面：显示器 / 键盘 / 鼠标 / 台灯 / 杯子 / 笔筒 / 书 ----
  {
    const g = new THREE.Group();
    const topY = 0.72;

    // 显示器
    box(g, 0.24, 0.02, 0.17, -1.02, topY + 0.01, -2.10, matPlasticB, false);
    box(g, 0.05, 0.14, 0.05, -1.02, topY + 0.08, -2.10, matPlasticB, false);
    const mon = box(g, 0.52, 0.31, 0.035, -1.02, topY + 0.28, -2.11, matPlasticB, false);
    mon.rotation.x = -0.06;
    const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.46, 0.25), matScreen);
    scr.position.set(-1.02, topY + 0.28, -2.088);
    scr.rotation.x = -0.06;
    g.add(scr);

    // 键盘（底壳 + 两排键帽）
    box(g, 0.43, 0.022, 0.15, -1.00, topY + 0.013, -1.76, matPlasticB, false);
    for (let r = 0; r < 2; r++) {
      for (let i = 0; i < 12; i++) {
        box(g, 0.026, 0.008, 0.024, -1.185 + i * 0.033, topY + 0.028, -1.795 + r * 0.036,
          matPlasticB, false);
      }
    }

    // 鼠标 + 鼠标垫
    box(g, 0.22, 0.004, 0.18, -0.60, topY + 0.004, -1.76, matPlasticB, false);
    const mouse = box(g, 0.07, 0.032, 0.11, -0.60, topY + 0.022, -1.76, matPlasticB, false);
    mouse.rotation.y = 0.12;

    // 台灯：底座 + 两节灯臂 + 灯罩
    const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.10, 0.03, 16), matPlasticB);
    lampBase.position.set(-1.70, topY + 0.016, -2.10);
    g.add(lampBase);
    const arm1 = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.40, 8), matMetal);
    arm1.position.set(-1.70, topY + 0.21, -2.10);
    arm1.rotation.x = 0.20;
    g.add(arm1);
    const arm2 = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.011, 0.34, 8), matMetal);
    arm2.position.set(-1.66, topY + 0.39, -2.02);
    arm2.rotation.x = -0.55;
    g.add(arm2);
    const shade = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.13, 16, 1, true), matPlasticB);
    shade.position.set(-1.62, topY + 0.47, -1.90);
    shade.rotation.x = 1.15;
    shade.material.side = THREE.DoubleSide;
    g.add(shade);
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.022, 8, 6),
      new THREE.MeshBasicMaterial({ color: 0xfff2cf }));
    bulb.position.set(-1.62, topY + 0.45, -1.885);
    g.add(bulb);

    // 搪瓷杯 + 笔筒
    const mug = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.034, 0.095, 14), matCeramic2);
    mug.position.set(-0.48, topY + 0.048, -2.06);
    g.add(mug);
    const handle = new THREE.Mesh(new THREE.TorusGeometry(0.026, 0.007, 6, 12), matCeramic2);
    handle.position.set(-0.44, topY + 0.05, -2.06);
    handle.rotation.y = Math.PI / 2;
    g.add(handle);
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.036, 0.10, 12), matPlasticB);
    cup.position.set(-0.82, topY + 0.05, -2.14);
    g.add(cup);
    for (let i = 0; i < 3; i++) {
      const pen = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.16, 6),
        new THREE.MeshStandardMaterial({ color: [0x2b3f66, 0xa8322a, 0x2c2c2c][i], roughness: 0.6 }));
      pen.position.set(-0.82 + (i - 1) * 0.018, topY + 0.12, -2.14 + (i - 1) * 0.012);
      pen.rotation.z = (i - 1) * 0.14;
      g.add(pen);
    }

    // 一摞书
    const bookCols = [0x6c3b2a, 0x2f4a5c, 0x5a5130, 0x4a3040];
    for (let i = 0; i < 4; i++) {
      box(g, 0.26 - i * 0.012, 0.035, 0.19, -1.50, topY + 0.02 + i * 0.036, -1.72,
        new THREE.MeshStandardMaterial({ color: bookCols[i], roughness: 0.85 }), false);
    }

    // 散落的纸
    const sheet = box(g, 0.21, 0.004, 0.29, -0.90, topY + 0.004, -1.90, matPaper, false);
    sheet.rotation.y = 0.22;
    const sheet2 = box(g, 0.21, 0.004, 0.29, -0.86, topY + 0.008, -1.86, matPaperW, false);
    sheet2.rotation.y = -0.14;

    world.add(g);
  }

  // ---- 茶几上的书和杯子 ----
  {
    box(world, 0.20, 0.028, 0.27, -1.28, 0.44, -1.02, matPaper, false);
    box(world, 0.19, 0.026, 0.26, -1.27, 0.47, -1.01, matPaperW, false);
    const c = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.030, 0.085, 14), matCeramic2);
    c.position.set(-1.03, 0.455, -0.86);
    c.castShadow = false;
    world.add(c);
    const saucer = new THREE.Mesh(new THREE.CylinderGeometry(0.058, 0.052, 0.008, 16), matCeramic2);
    saucer.position.set(-1.03, 0.414, -0.86);
    world.add(saucer);
  }

  // ---- 西墙文件柜（三抽屉） ----
  {
    const g = new THREE.Group();
    box(g, 0.50, 1.24, 0.62, 0, 0.62, 0, matIron);
    for (let i = 0; i < 3; i++) {
      const y = 0.24 + i * 0.37;
      box(g, 0.44, 0.30, 0.02, 0, y, 0.315, matIron);
      box(g, 0.16, 0.022, 0.025, 0, y + 0.02, 0.335, matMetal, false);
      box(g, 0.06, 0.035, 0.012, 0, y + 0.02, 0.345, matMetal, false);
    }
    // 柜顶一摞档案盒
    for (let i = 0; i < 3; i++) {
      box(g, 0.40, 0.07, 0.30, 0.01, 1.28 + i * 0.072, 0.02, matPaper, false);
    }
    g.position.set(-2.70, 0, 0.52);
    world.add(g);

    // 三个抽屉都能拉开拿子弹（世界坐标：柜子在 x -2.70、z 0.52）
    const drawers = [];
    for (let i = 0; i < 3; i++) {
      drawers.push({
        x: -2.70, y: 0.24 + i * 0.37, z: 0.852, w: 0.44, h: 0.30,
        depth: 0.40, mat: matIron, face: matIron,
      });
    }
    makeAmmoUnit(drawers, {
      x: -2.70, z: 0.95, slide: 0.26, name: '文件柜抽屉',
      giveRifle: 140, giveShell: 28,
    });
  }

  // ---- 桌边垃圾桶 + 纸团 ----
  {
    const bin = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.13, 0.42, 14, 1, true), matPlasticB);
    bin.position.set(-2.48, 0.21, -1.95);
    bin.material = matPlasticB.clone();
    bin.material.side = THREE.DoubleSide;
    bin.castShadow = true;
    world.add(bin);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.158, 0.010, 6, 18), matPlasticB);
    rim.rotation.x = Math.PI / 2;
    rim.position.set(-2.48, 0.42, -1.95);
    world.add(rim);
    for (const [dx, dz, y] of [[-0.02, 0.03, 0.33], [0.05, -0.04, 0.30], [-0.06, -0.02, 0.28]]) {
      const ball = new THREE.Mesh(new THREE.IcosahedronGeometry(0.035, 0), matPaperW);
      ball.position.set(-2.48 + dx, y, -1.95 + dz);
      world.add(ball);
    }
    // 桶边掉出来的纸团
    for (const [dx, dz] of [[0.18, 0.10], [0.24, -0.02], [-0.06, 0.20]]) {
      const ball = new THREE.Mesh(new THREE.IcosahedronGeometry(0.032, 0), matPaperW);
      ball.position.set(-2.48 + dx, 0.032, -1.95 + dz);
      ball.castShadow = false;
      world.add(ball);
    }
  }

  // ---- 东南角纸箱 ----
  {
    const g = new THREE.Group();
    box(g, 0.44, 0.36, 0.38, 0, 0.18, 0, matCard);
    box(g, 0.44, 0.012, 0.02, 0, 0.36, 0, matPaper, false);
    box(g, 0.34, 0.30, 0.30, 0.02, 0.51, -0.02, matCard);
    // 封箱胶带
    box(g, 0.10, 0.002, 0.38, 0.02, 0.365, 0,
      new THREE.MeshStandardMaterial({ color: 0xb9a97c, roughness: 0.75 }), false);
    g.position.set(2.60, 0, 1.96);
    g.rotation.y = -0.18;
    world.add(g);
  }

  // ---- 南墙挂历 ----
  {
    const S = 256;
    const c = newCanvas(S);
    const g2 = c.getContext('2d');
    g2.fillStyle = '#e6e1d4'; g2.fillRect(0, 0, S, S);
    g2.fillStyle = '#9c2b22'; g2.fillRect(0, 0, S, 56);
    g2.fillStyle = '#f1ece0'; g2.font = 'bold 30px sans-serif';
    g2.fillText('10', 18, 42);
    g2.fillStyle = '#2a2a2a'; g2.font = '16px sans-serif';
    g2.fillText('OCTOBER', 90, 36);
    g2.strokeStyle = 'rgba(60,55,50,.45)'; g2.lineWidth = 1;
    for (let i = 0; i < 6; i++) {
      g2.beginPath(); g2.moveTo(16, 92 + i * 26); g2.lineTo(S - 16, 92 + i * 26); g2.stroke();
    }
    for (let i = 0; i < 7; i++) {
      g2.beginPath(); g2.moveTo(16 + i * 32, 92); g2.lineTo(16 + i * 32, S - 16); g2.stroke();
    }
    g2.fillStyle = '#9c2b22';
    g2.beginPath(); g2.arc(16 + 4 * 32 + 16, 92 + 2 * 26 + 13, 9, 0, Math.PI * 2); g2.fill();
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    const cal = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.34),
      new THREE.MeshStandardMaterial({ map: tex, roughness: 0.92 }));
    cal.position.set(1.34, 1.66, 2.365);
    cal.rotation.y = Math.PI;
    world.add(cal);
  }

  // ---- 东墙两张海报 ----
  {
    const mk = (base, accent, motif) => {
      const S = 128;
      const c = newCanvas(S);
      const g2 = c.getContext('2d');
      g2.fillStyle = base; g2.fillRect(0, 0, S, S);
      g2.fillStyle = accent;
      if (motif === 0) {
        g2.beginPath(); g2.arc(64, 58, 34, 0, Math.PI * 2); g2.fill();
        g2.fillRect(20, 100, 88, 8);
      } else {
        g2.fillRect(24, 24, 80, 10);
        g2.fillRect(24, 48, 56, 8);
        g2.fillRect(24, 70, 72, 8);
        g2.fillRect(24, 92, 40, 8);
      }
      const t = new THREE.CanvasTexture(c);
      t.colorSpace = THREE.SRGBColorSpace;
      return new THREE.MeshStandardMaterial({ map: t, roughness: 0.9 });
    };
    const p1 = mk('#25313c', '#d9a441', 0);
    const p2 = mk('#3a2a26', '#c8c2b4', 1);
    for (const [z, mat] of [[-0.55, p1], [0.88, p2]]) {
      box(world, 0.03, 0.44, 0.34, 2.955, 1.82, z,
        new THREE.MeshStandardMaterial({ color: 0x1c1a18, roughness: 0.6 }), false);
      const p = new THREE.Mesh(new THREE.PlaneGeometry(0.32, 0.42), mat);
      p.rotation.y = -Math.PI / 2;
      p.position.set(2.936, 1.82, z);
      world.add(p);
    }
  }

  // ---- 北墙书架（窗户西侧）----
  {
    const g = new THREE.Group();
    box(g, 0.92, 0.03, 0.20, 0, 1.86, 0, matWoodDark);
    box(g, 0.05, 0.16, 0.18, -0.43, 1.78, 0, matWoodDark, false);
    box(g, 0.05, 0.16, 0.18, 0.43, 1.78, 0, matWoodDark, false);
    const cols = [0x7d3b2c, 0x2f4a5c, 0x5a5130, 0x43304a, 0x8a6a3a, 0x354a3a];
    let bx = -0.40;
    for (let i = 0; i < 9; i++) {
      const w = 0.045 + (i % 3) * 0.012;
      const h = 0.17 + (i % 4) * 0.018;
      box(g, w, h, 0.13, bx, 1.875 + h / 2, 0,
        new THREE.MeshStandardMaterial({ color: cols[i % cols.length], roughness: 0.85 }), false);
      bx += w + 0.012;
    }
    // 斜靠着的一本
    const lean = box(g, 0.04, 0.20, 0.13, 0.30, 1.975, 0,
      new THREE.MeshStandardMaterial({ color: 0x6b2e28, roughness: 0.85 }), false);
    lean.rotation.z = 0.28;
    g.position.set(-2.40, 0, -2.36);
    world.add(g);
  }

  // ---- 沙发靠垫 ----
  {
    const pillow = (x, z, ry, rz, col) => {
      const p = box(world, 0.30, 0.26, 0.10, x, 0.72, z,
        new THREE.MeshStandardMaterial({ color: col, roughness: 0.97 }), false);
      p.rotation.set(0.18, ry, rz);
    };
    pillow(0.50, -1.83, 0.10, 0.06, 0x7a6d5a);
    pillow(1.86, -1.83, -0.12, -0.05, 0x5f5346);
    pillow(2.78, -0.35, -Math.PI / 2, 0.08, 0x7a6d5a);
    pillow(2.78, 0.90, -Math.PI / 2, -0.06, 0x5f5346);
  }

  // ---- 西墙小搁板上的杂物 ----
  {
    box(world, 0.34, 0.025, 0.16, -2.82, 1.20, 1.55, matWoodDark, false);
    for (let i = 0; i < 2; i++) {
      const can = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.10, 12), matMetal);
      can.position.set(-2.86 + i * 0.09, 1.265, 1.53);
      world.add(can);
    }
  }

  // ---- 吊顶走线槽 ----
  {
    const tr = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.05, 0.10), matWhitePlastic);
    tr.position.set(0, 2.92, -2.22);
    world.add(tr);
    for (let i = -2; i <= 2; i++) {
      const clampM = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.08, 0.14), matMetal);
      clampM.position.set(i * 1.2, 2.90, -2.22);
      world.add(clampM);
    }
  }
}

try {
  mergeStatic(world);
} catch (err) {
  console.warn('静态合并整体失败，按原样渲染', err);
}

/* =========================================================================
   玩家：方块小人
   ========================================================================= */
let legL, legR, armL, armR;

function makeCamoTexture() {
  const S = 128;
  const c = newCanvas(S);
  const g = c.getContext('2d');

  g.fillStyle = '#6b7048';
  g.fillRect(0, 0, S, S);

  const colors = ['#4b5236', '#2c3026', '#8b8264', '#3e4732', '#23261d'];
  for (let i = 0; i < 90; i++) {
    g.fillStyle = colors[i % colors.length];
    const x = Math.random() * S;
    const y = Math.random() * S;
    const rx = 5 + Math.random() * 13;
    const ry = rx * (0.5 + Math.random() * 0.7);
    g.beginPath();
    g.ellipse(x, y, rx, ry, Math.random() * Math.PI, 0, Math.PI * 2);
    g.fill();
  }

  sprinkleNoise(g, S, 10);

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

let bodyProc = null;      // 程序化拼的备用身体（加载到真模型后隐藏）

function buildPlayer() {
  const root = new THREE.Group();
  const proc = new THREE.Group();
  root.add(proc);
  bodyProc = proc;

  const camo   = new THREE.MeshStandardMaterial({ map: makeCamoTexture(), roughness: 0.95 });
  const mask   = new THREE.MeshStandardMaterial({ color: 0x1b1c1e, roughness: 0.95 });
  const skin   = new THREE.MeshStandardMaterial({ color: 0xd9ab86, roughness: 0.85 });
  const vestM  = new THREE.MeshStandardMaterial({ color: 0x34392c, roughness: 0.82 });
  const pouchM = new THREE.MeshStandardMaterial({ color: 0x25291f, roughness: 0.9 });
  const pants  = new THREE.MeshStandardMaterial({ color: 0x3b4030, roughness: 0.95 });
  const shoe   = new THREE.MeshStandardMaterial({ color: 0x141516, roughness: 0.75 });
  const eyeMat = new THREE.MeshStandardMaterial({ color: 0x101014, roughness: 0.35 });

  // 头：黑色蒙面头套
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.27, 0.25), mask);
  head.position.y = 1.615;
  proc.add(head);

  // 只露出眼部一条皮肤
  const eyeStrip = new THREE.Mesh(new THREE.BoxGeometry(0.185, 0.050, 0.012), skin);
  eyeStrip.position.set(0, 1.648, -0.129);
  proc.add(eyeStrip);

  for (const sx of [-1, 1]) {
    const eye = new THREE.Mesh(new THREE.BoxGeometry(0.040, 0.028, 0.010), eyeMat);
    eye.position.set(sx * 0.052, 1.649, -0.134);
    proc.add(eye);
  }

  // 躯干：迷彩
  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.40, 0.60, 0.23), camo);
  torso.position.y = 1.17;
  proc.add(torso);

  // 防弹衣
  const vestBox = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.40, 0.28), vestM);
  vestBox.position.set(0, 1.19, 0);
  proc.add(vestBox);

  for (const sx of [-1, 1]) {
    const strap = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.13, 0.30), vestM);
    strap.position.set(sx * 0.14, 1.43, 0);
    proc.add(strap);
  }

  // 胸前三个弹匣袋
  for (const sx of [-1, 0, 1]) {
    const p = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.115, 0.05), pouchM);
    p.position.set(sx * 0.13, 1.13, -0.155);
    proc.add(p);
  }

  // 腰包
  const beltPouch = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.11, 0.07), pouchM);
  beltPouch.position.set(0.02, 0.94, -0.12);
  proc.add(beltPouch);

  for (const sx of [-1, 1]) {
    const pivot = new THREE.Group();
    pivot.position.set(sx * 0.265, 1.45, 0);
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.55, 0.13), camo);
    arm.position.y = -0.275;
    pivot.add(arm);
    proc.add(pivot);
    if (sx < 0) armL = pivot; else armR = pivot;
  }

  // 单手端枪：右臂抬起扣扳机，左臂自然下垂
  armR.rotation.set(1.10, 0, -0.15);
  armL.rotation.set(0, 0, -0.12);

  for (const sx of [-1, 1]) {
    const pivot = new THREE.Group();
    pivot.position.set(sx * 0.105, 0.87, 0);
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.155, 0.82, 0.17), pants);
    leg.position.y = -0.41;
    pivot.add(leg);
    const foot = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.08, 0.26), shoe);
    foot.position.set(0, -0.78, -0.045);
    pivot.add(foot);
    proc.add(pivot);
    if (sx < 0) legL = pivot; else legR = pivot;
  }

  root.traverse(o => {
    if (o.isMesh) o.layers.set(LAYER_PLAYER);
  });

  return root;
}

const playerModel = buildPlayer();
scene.add(playerModel);

/* =========================================================================
   武器：AK-47 / M4A1 / M870 霰弹枪
   —— 三把枪共用同一套第一人称手套手臂骨架（cktang88/3d-fps，CC BY 4.0）
   —— 1/2/3 切枪，每把枪有自己的弹匣容量、射速、散布、伤害和音效
   ========================================================================= */
const LAYER_VIEWMODEL = 2;
camera.layers.enable(LAYER_VIEWMODEL);

function buildAK47() {
  const g = new THREE.Group();

  const metal = new THREE.MeshStandardMaterial({ color: 0x24272b, roughness: 0.38, metalness: 0.82 });
  const wood  = new THREE.MeshStandardMaterial({ color: 0x6d3f21, roughness: 0.62, metalness: 0.05 });
  const dark  = new THREE.MeshStandardMaterial({ color: 0x17191c, roughness: 0.5, metalness: 0.6 });

  const part = (geo, mat, x, y, z, rx = 0) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    m.rotation.x = rx;
    m.frustumCulled = false;
    g.add(m);
    return m;
  };

  part(new THREE.BoxGeometry(0.055, 0.085, 0.30), metal, 0, 0.020, -0.10);       // 机匣
  part(new THREE.BoxGeometry(0.046, 0.022, 0.26), dark,  0, 0.072, -0.10);       // 上机匣盖
  part(new THREE.CylinderGeometry(0.013, 0.013, 0.34, 10), metal, 0, 0.035, -0.42, Math.PI / 2); // 枪管
  part(new THREE.CylinderGeometry(0.016, 0.019, 0.06, 10), dark,  0, 0.035, -0.60, Math.PI / 2); // 消焰器
  part(new THREE.BoxGeometry(0.020, 0.045, 0.03), metal, 0, 0.062, -0.545);      // 准星座
  part(new THREE.BoxGeometry(0.008, 0.020, 0.012), dark, 0, 0.085, -0.545);      // 准星片
  part(new THREE.BoxGeometry(0.050, 0.055, 0.19), wood,  0, 0.028, -0.26);       // 下护木
  part(new THREE.BoxGeometry(0.038, 0.028, 0.15), wood,  0, 0.075, -0.25);       // 上护木
  part(new THREE.BoxGeometry(0.030, 0.020, 0.05), dark,  0, 0.075, -0.115);      // 表尺
  part(new THREE.BoxGeometry(0.036, 0.100, 0.05), dark,  0, -0.075, 0.015, 0.30); // 握把
  part(new THREE.BoxGeometry(0.030, 0.012, 0.06), metal, 0, -0.045, -0.005);     // 扳机护圈
  part(new THREE.BoxGeometry(0.045, 0.075, 0.26), wood,  0, 0.000, 0.20, -0.10); // 木托
  part(new THREE.BoxGeometry(0.050, 0.085, 0.015), dark, 0, -0.012, 0.335);      // 托底板

  // 弧形弹匣：三段盒子拼出弯月形，底部朝枪口方向（-z）外弯
  part(new THREE.BoxGeometry(0.032, 0.080, 0.055), dark, 0, -0.040, -0.130, 0.20);
  part(new THREE.BoxGeometry(0.032, 0.080, 0.055), dark, 0, -0.111, -0.144, 0.45);
  part(new THREE.BoxGeometry(0.030, 0.075, 0.050), dark, 0, -0.175, -0.176, 0.70);

  return g;
}

// ① 第一人称手上那把（只在玩家自己眼里出现）
const gunView = buildAK47();          // 程序化 AK，真枪模型载入失败时兜底
gunView.scale.setScalar(0.78);
const GUN_HOME = new THREE.Vector3(0.15, -0.155, -0.30);
gunView.position.copy(GUN_HOME);
gunView.rotation.set(0.02, -0.07, 0);
gunView.traverse(o => { if (o.isMesh) o.layers.set(LAYER_VIEWMODEL); });
camera.add(gunView);
scene.add(camera);          // 相机进了场景，挂在相机上的枪才会被画出来

// 当前第一人称枪的锚点：真枪加载成功后换过去
let fpGun = gunView;
let gunHome = GUN_HOME.clone();
let gunBaseRotX = 0.02;
let gunBaseRotY = -0.07;
let gunBaseRotZ = 0;

// 枪口火光
const flashMat = new THREE.MeshBasicMaterial({
  color: 0xffe6a8, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide,
});
const FLASH_GEO = new THREE.PlaneGeometry(0.13, 0.13);   // 第一人称和镜子共用同一块面片
const flash = new THREE.Mesh(FLASH_GEO, flashMat);
flash.position.set(0, 0.035, -0.64);
flash.layers.set(LAYER_VIEWMODEL);
flash.frustumCulled = false;
gunView.add(flash);

/* ── 武器表：数字改这里就能调手感 ─────────────────────────────── */
const WEAPONS = {
  ak: {
    key: 'ak', name: 'AK-47', file: './assets/ak47.glb',
    magSize: 30, ammo: 30, reserve: 300, reserveMax: 999,   // 打大波次，备弹给足
    mode: 'mag', auto: true,                       // 整匣换弹 / 全自动
    interval: 0.088, pellets: 1, damage: 1, headMul: 2, spread: 0.009,
    reloadTime: 2.6, kick: 1.0,
    sound: ['ak1', 'ak2', 'ak3', 'ak4'], reloadSfx: 'reload_rifle', fireSfxVol: 0.95,
    flashPos: new THREE.Vector3(0.02, 0.01, -0.64), flashScale: 1.0,
    loaded: false, rt: null,
  },
  m4: {
    key: 'm4', name: 'M4A1', file: './assets/m4a1.glb',
    magSize: 30, ammo: 30, reserve: 300, reserveMax: 999,
    mode: 'mag', auto: true,
    interval: 0.075, pellets: 1, damage: 1, headMul: 2, spread: 0.006,
    reloadTime: 2.35, kick: 0.85,
    sound: ['rifle1', 'rifle2'], reloadSfx: 'reload_rifle', fireSfxVol: 0.95,
    flashPos: new THREE.Vector3(0.01, 0.01, -0.66), flashScale: 1.0,
    loaded: false, rt: null,
  },
  sg: {
    key: 'sg', name: 'M870 霰弹枪', file: './assets/shotgun.glb',
    magSize: 8, ammo: 8, reserve: 120, reserveMax: 300,   // 8 发弹仓，备弹 120 发
    mode: 'shell', auto: false,                     // 一发一发装填 / 半自动
    interval: 0.82, pellets: 8, damage: 0.55, headMul: 2, spread: 0.050,
    reloadTime: 0.60, kick: 2.2,   // 每塞一发 0.6 秒（手要能看清）
    sound: ['shotgun1'], reloadSfx: 'shotgun_pump', fireSfxVol: 1.0,
    flashPos: new THREE.Vector3(0.01, 0.01, -0.60), flashScale: 1.7,
    loaded: false, rt: null,
  },
};
const WEAPON_ORDER = ['ak', 'm4', 'sg'];
let currentWeapon = 'ak';
const curWeapon = () => WEAPONS[currentWeapon];

// ③ 真枪模型（cktang88/3d-fps，CC BY 4.0，自带第一人称手套手臂）
const gltfLoader = new GLTFLoader();
gltfLoader.setMeshoptDecoder(MeshoptDecoder);

// 三把枪的模型原点不在同一个地方：AK 的右手握点几乎就在原点，
// M4A1 / 霰弹枪的握把却偏离原点 0.2~0.26 米。三把枪如果都挂在同一个位置，
// 后两把的右手就会被塞进胸口，镜子里的持枪姿势会整个乱掉。
// 所以统一按「右手握点」对齐：不管哪把枪，右手都落在同一个点上。
const GRIP_ANCHOR_BODY = new THREE.Vector3(0.143, 1.236, -0.104);   // 角色空间（镜子用）
const GRIP_ANCHOR_VIEW = new THREE.Vector3(0.193, -0.274, -0.019);  // 相机空间（第一人称用）

// 从枪自带的「握枪手臂」骨架里读出两只手的位置、手指朝向和掌心朝向
function captureGripFrames(mg) {
  const out = { gripR: null, gripL: null, handFrame: null };
  mg.updateMatrixWorld(true);
  const bp = (n) => {
    const o = mg.getObjectByName(n);
    if (!o) return null;
    const v = new THREE.Vector3();
    o.getWorldPosition(v);
    return v;
  };
  const hr = bp('Hand_R'), hl = bp('Hand_L');
  if (!hr || !hl) return out;

  out.gripR = hr;
  out.gripL = hl;
  out.handFrame = {};
  for (const [side, midRoot, mid2, idx2, pinky2] of [
    ['R', 'Bone_R008', 'Bone_R009', 'Bone_R005', 'Bone_R017'],
    ['L', 'Bone_L008', 'Bone_L009', 'Bone_L005', 'Bone_L017'],
  ]) {
    const m0 = bp(midRoot), m1 = bp(mid2), i1 = bp(idx2), k1 = bp(pinky2);
    if (!m0 || !m1 || !i1 || !k1) continue;
    const F = m1.clone().sub(m0).normalize();            // 手指朝哪
    const A = i1.clone().sub(k1).normalize();           // 食指→小指的连线
    const P = new THREE.Vector3().crossVectors(F, A);   // 掌心朝哪（右负左正）
    if (side === 'R') P.negate();
    P.addScaledVector(F, -P.dot(F)).normalize();
    out.handFrame[side] = { F, P };
  }
  return out;
}

function setupWeapon(def, gltf) {
  const ak = gltf.scene;
  ak.scale.setScalar(0.45);      // 模型自带的尺寸是真实枪的两倍

  ak.traverse((o) => {
    if (!o.isMesh && !o.isSkinnedMesh) return;
    o.layers.set(LAYER_VIEWMODEL);
    o.frustumCulled = false;
    o.castShadow = false;
    o.receiveShadow = false;
    if (/spare ?magazine/i.test(o.name)) o.visible = false;   // 悬空的备用弹匣藏掉
  });

  // 播一帧静态握持姿势，把枪和手臂摆到位
  const poseMixer = new THREE.AnimationMixer(ak);
  if (gltf.animations && gltf.animations[0]) poseMixer.clipAction(gltf.animations[0]).play();
  poseMixer.update(0.001);

  // 镜子里那把：复制一份，藏掉自带的第一人称手套手臂，挂到角色身前
  const mg = ak.clone(true);
  const grip = captureGripFrames(mg);

  mg.traverse((o) => {
    if (!o.isMesh) return;
    o.layers.set(LAYER_PLAYER);
    if (dbg.has('avatar')) o.layers.enable(0);   // 调试：也让主相机看见
    o.frustumCulled = false;
    o.castShadow = false;
    o.receiveShadow = false;
    if (/arms|spare ?magazine/i.test(o.name)) o.visible = false;
  });

  const mirror = new THREE.Group();
  mirror.add(mg);
  mirror.position.copy(HOLD.gunPos);
  mirror.rotation.set(HOLD.gunRx, HOLD.gunRy, HOLD.gunRz);
  mirror.visible = false;
  playerModel.add(mirror);

  // 镜子里的枪口火光：两片交叉的面片，从侧面、正面看都是一团亮光。
  // 它跟第一人称那块共用同一个材质，火光衰减时两边一起暗下去。
  const mirFlash = new THREE.Group();
  const mfA = new THREE.Mesh(FLASH_GEO, flashMat);
  const mfB = new THREE.Mesh(FLASH_GEO, flashMat);
  mfB.rotation.y = Math.PI / 2;
  mirFlash.add(mfA, mfB);
  mirFlash.traverse((o) => {
    if (!o.isMesh) return;
    o.layers.set(LAYER_PLAYER);
    o.frustumCulled = false;
  });
  mirFlash.position.copy(def.flashPos || new THREE.Vector3(0, 0.035, -0.64));
  mirFlash.scale.setScalar(def.flashScale || 1);
  mirror.add(mirFlash);

  const fp = new THREE.Group();
  fp.position.set(0.15, -0.19, -0.02);
  fp.add(ak);
  fp.visible = false;
  camera.add(fp);

  // 把右手握点对齐到统一的落脚点（AK 原本就在这个位置，所以 AK 一点不变）
  if (grip.gripR) {
    const _q = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(HOLD.gunRx, HOLD.gunRy, HOLD.gunRz)
    );
    mirror.position.copy(GRIP_ANCHOR_BODY).sub(grip.gripR.clone().applyQuaternion(_q));
    fp.position.copy(GRIP_ANCHOR_VIEW).sub(grip.gripR);
  }

  // 换弹 / 泵动要用的节点
  // 弹匣的位置直接从枪模型里读：三把枪的弹匣位置差很多，不能写死
  const magNode = ak.getObjectByName('Magazine');
  const magGripNode = ak.getObjectByName('MagazineGripSocket')
    || ak.getObjectByName('MagazineGrip')
    || magNode;
  let mwOff = null;
  if (magGripNode && grip.gripL) {
    ak.updateMatrixWorld(true);
    const v = new THREE.Vector3();
    magGripNode.getWorldPosition(v);
    ak.worldToLocal(v);          // → 模型本地单位
    v.multiplyScalar(0.45);      // → 与 captureGripFrames 同样的「米」
    mwOff = v.sub(grip.gripL);   // 相对护木握点
  }
  const magMesh = ak.getObjectByName('MagazineGeometry');
  const pumpNode = ak.getObjectByName('Pump');
  const mirPumpNode = mg.getObjectByName('Pump');
  const mmagNode = mg.getObjectByName('Magazine');

  // 泵动时左手要跟着护木一起走：连前臂骨和手骨一起平移（肘部在画面外，拉伸看不见）
  const pumpBones = [];
  for (const bn of ['Forearm_L', 'Hand_L']) {
    const b = ak.getObjectByName(bn);
    if (b) pumpBones.push({ bone: b, base: b.position.clone() });
  }

  def.rt = {
    fp, mirror,
    magRec: magNode ? { node: magNode, mesh: magMesh, base: magNode.position.clone() } : null,
    mirMagRec: mmagNode ? { node: mmagNode, base: mmagNode.position.clone() } : null,
    pumpRec: pumpNode ? { node: pumpNode, base: pumpNode.position.clone() } : null,
    mirPumpRec: mirPumpNode ? { node: mirPumpNode, base: mirPumpNode.position.clone() } : null,
    pumpBones, pumpApplied: false,
    root: ak, magGrip: magGripNode, // 换弹时左手跟着弹匣握点走
    mwOff,                          // 弹匣井相对护木握点的位置（米）
    gripR: grip.gripR, gripL: grip.gripL, handFrame: grip.handFrame,
    home: fp.position.clone(),
    mirHome: mirror.position.clone(),   // 镜子里那把枪的静止位置（后坐、下蹲都在它上面加减）
    mirFlash,                            // 镜子里的枪口火光
  };
  def.loaded = true;

  console.log(`[武器] ${def.name} 载入完成`,
    magNode ? '弹匣节点✓' : '无弹匣节点', pumpNode ? '泵动节点✓' : '');
  if (currentWeapon === def.key) activateWeapon(def.key, true);
  else updateAmmoUI();
}

// 切到某把枪：换第一人称模型、换镜子里那把、换握点和换弹节点
function activateWeapon(key, force = false) {
  const def = WEAPONS[key];
  if (!def || !def.rt) return false;
  if (!force && key === currentWeapon && def.rt.fp.visible) return true;

  cancelReload();      // 换枪时把上一把的换弹动作复位
  resetPumpState();    // 泵动也复位，免得护木停在半路、左手歪着

  for (const k of WEAPON_ORDER) {
    const d = WEAPONS[k];
    if (!d.rt) continue;
    d.rt.fp.visible = false;
    d.rt.mirror.visible = false;
  }

  const rt = def.rt;
  rt.fp.visible = true;
  rt.mirror.visible = true;

  currentWeapon = key;
  fpGun = rt.fp;
  mirrorGun = rt.mirror;
  gunHome.copy(rt.home);
  gunBaseRotX = 0;
  gunBaseRotY = 0;
  gunBaseRotZ = 0;

  if (rt.gripR) HOLD.gripR = rt.gripR;
  if (rt.gripL) HOLD.gripL = rt.gripL;
  if (rt.handFrame) gunHandFrame = rt.handFrame;

  fpMag = rt.magRec;
  mirMag = rt.mirMagRec;

  flash.removeFromParent();
  rt.fp.add(flash);
  flash.position.copy(def.flashPos);
  flash.scale.setScalar(def.flashScale);

  gunView.visible = false;
  gunWorld.visible = false;
  gunKick = 0;
  updateAmmoUI();
  console.log('[武器] 当前武器：' + def.name);
  return true;
}

function switchWeapon(key) {
  if (key === currentWeapon) return;
  const def = WEAPONS[key];
  if (!def) return;
  if (!def.loaded) { console.log('[武器] 还在载入：' + key); return; }
  activateWeapon(key);
}

for (const key of WEAPON_ORDER) {
  const def = WEAPONS[key];
  gltfLoader.load(
    def.file,
    (gltf) => setupWeapon(def, gltf),
    undefined,
    (err) => console.warn(`[武器] ${def.name} 没加载上`, err)
  );
}

// ② 角色手上那把（只在镜子里出现，由镜像相机渲染）
let mirrorGun = null;                 // ak47.glb 载入后生成的精细版，用来顶替下面的方块 AK
const gunWorld = buildAK47();
gunWorld.position.set(0.18, 1.275, -0.49);
gunWorld.rotation.y = 0.10;
gunWorld.traverse(o => { if (o.isMesh) o.layers.set(LAYER_PLAYER); });
playerModel.add(gunWorld);

/* =========================================================================
   真人比例角色：Soldier.glb（11376 面，1024 贴图，带 Idle / Walk / Run）
   载入成功后隐藏程序化身体，并把 AK 挂到右手骨头上
   ========================================================================= */
let avatar = null;
let mixer = null;
let animAction = null;
const animActions = {};

gltfLoader.load(
  './assets/Soldier.glb',
  (gltf) => {
    avatar = gltf.scene;
    // 模型本身脸朝 -Z（脚趾指向 -Z），和我们玩家的正前方一致，不用转

    avatar.traverse((o) => {
      if (!o.isMesh) return;
      o.layers.set(LAYER_PLAYER);     // 只在镜子里出现
      if (dbg.has('avatar')) o.layers.enable(0);   // 调试：也让主相机看见
      o.frustumCulled = false;        // 蒙皮网格别被静止包围球误剔除
      o.castShadow = false;           // 阴影是静态烘焙的，动的人不投影
      o.receiveShadow = false;
      const mats = Array.isArray(o.material) ? o.material : [o.material];
      for (const m of mats) {
        if (!m) continue;
        m.roughness = 0.78;
        m.metalness = 0.05;
        if (m.map) m.map.anisotropy = 1;
      }
    });

    playerModel.add(avatar);
    avatarBaseY = avatar.position.y;
    if (bodyProc) bodyProc.visible = false;

    mixer = new THREE.AnimationMixer(avatar);
    for (const clip of gltf.animations) {
      if (clip.name === 'TPose') continue;
      animActions[clip.name] = mixer.clipAction(clip);
    }
    if (animActions.Idle) {
      animAction = animActions.Idle;
      animAction.play();
    }

    // 量一下两条胳膊两节骨头的长度，给 IK 用（世界单位就是米）
    {
      const find = (n) => avatar.getObjectByName(n);
      const rUp = find('mixamorigRightArm'), rFore = find('mixamorigRightForeArm'), rHand = find('mixamorigRightHand');
      const lUp = find('mixamorigLeftArm'), lFore = find('mixamorigLeftForeArm'), lHand = find('mixamorigLeftHand');
      if (rUp && rFore && lUp && lFore) {
        mixer.update(0);
        avatar.updateMatrixWorld(true);
        const s = new THREE.Vector3(), e = new THREE.Vector3(), w = new THREE.Vector3();
        rUp.getWorldPosition(s); rFore.getWorldPosition(e); (rHand || rFore).getWorldPosition(w);
        const rL1 = s.distanceTo(e), rL2 = e.distanceTo(w);
        lUp.getWorldPosition(s); lFore.getWorldPosition(e); (lHand || lFore).getWorldPosition(w);
        holdBones = { rUp, rFore, rHand, lUp, lFore, lHand, rL1, rL2, lL1: s.distanceTo(e), lL2: e.distanceTo(w) };

        // 量两只手的「局部掌心坐标系」和手掌长度，用来把士兵的手摆成和枪模型一模一样
        soldierHandFrame = {};
        const wp = (o) => { const v = new THREE.Vector3(); o.getWorldPosition(v); return v; };
        const wq = (o) => { const q = new THREE.Quaternion(); o.getWorldQuaternion(q); return q; };
        for (const [side, suffix, hand] of [['R', 'Right', rHand], ['L', 'Left', lHand]]) {
          const mid = find(`mixamorig${suffix}HandMiddle1`);
          const idx = find(`mixamorig${suffix}HandIndex1`);
          const pky = find(`mixamorig${suffix}HandPinky1`);
          if (!hand || !mid || !idx || !pky) continue;
          const H = wp(hand), M = wp(mid), I = wp(idx), K = wp(pky);
          const Fw = M.clone().sub(H).normalize();
          const Aw = I.clone().sub(K).normalize();
          const Pw = new THREE.Vector3().crossVectors(Fw, Aw).normalize();
          if (side === 'R') Pw.negate();       // 右手掌 = -(手指 × 指根连线)，左手反过来
          Pw.addScaledVector(Fw, -Pw.dot(Fw)).normalize();
          const Qinv = wq(hand).invert();
          const Fl = Fw.clone().applyQuaternion(Qinv);
          const Pl = Pw.clone().applyQuaternion(Qinv);
          basisQuat(Fl, Pl, _qWorld);
          soldierHandFrame[side] = { Qinv: _qWorld.clone().invert(), palmLen: H.distanceTo(M) };
        }

        // 手指骨：每根记下「往掌心弯」的转轴（换到骨头自己的局部空间，之后随便怎么摆手都有效）
        fingerBones = [];
        for (const side of ['Right', 'Left']) {
          const sf = soldierHandFrame[side === 'Right' ? 'R' : 'L'];
          const hand = find(`mixamorig${side}Hand`);
          if (!sf || !hand) continue;
          // 世界空间里手当前的「手指方向」和「掌心方向」
          const fw = new THREE.Vector3(0, 1, 0).applyQuaternion(wq(hand));
          const pw = new THREE.Vector3(-1, 0, 0).applyQuaternion(wq(hand));
          const axisW = new THREE.Vector3().crossVectors(fw, pw).normalize();
          for (const part of ['Thumb', 'Index', 'Middle', 'Ring', 'Pinky']) {
            for (let i = 1; i <= 3; i++) {
              const b = find(`mixamorig${side}Hand${part}${i}`);
              if (!b) continue;
              const axis = axisW.clone().applyQuaternion(wq(b).invert()).normalize();
              fingerBones.push({ bone: b, axis, n: i, thumb: part === 'Thumb' });
            }
          }
        }
        console.log('[角色] 手臂骨长：右', rL1.toFixed(3), rL2.toFixed(3), '左', holdBones.lL1.toFixed(3), holdBones.lL2.toFixed(3), '手指骨', fingerBones.length, '手掌长', soldierHandFrame.R?.palmLen.toFixed(3));
      } else {
        console.warn('[角色] 找不到手臂骨头，持枪姿势关掉');
      }
    }

    // 下蹲 / 跳跃要掰的腿骨（Mixamo 命名，GLTFLoader 会把名字里的冒号去掉）
    {
      const find = (n) => avatar.getObjectByName(n);
      legBones = {
        upL: find('mixamorigLeftUpLeg'), loL: find('mixamorigLeftLeg'), ftL: find('mixamorigLeftFoot'),
        upR: find('mixamorigRightUpLeg'), loR: find('mixamorigRightLeg'), ftR: find('mixamorigRightFoot'),
      };
      if (!legBones.upL) console.warn('[角色] 找不到腿骨，下蹲只有视角效果');
    }

    window.__avatarReady = true;
    console.log('[角色] Soldier.glb 载入完成：', gltf.animations.map(a => a.name).join(' / '));
  },
  undefined,
  (err) => {
    console.warn('[角色] 模型没加载上，继续用程序化身体', err);
  }
);

function setAvatarAnim(name) {
  const next = animActions[name];
  if (!next || next === animAction) return;
  next.reset().setEffectiveWeight(1).fadeIn(0.22).play();
  if (animAction) animAction.fadeOut(0.22);
  animAction = next;
}

/* 下蹲 / 跳跃的腿姿：等 Idle/Walk 播完，再在这副骨架上「叠」一层角度。
   大腿往前抬 th、小腿回折 2th、脚掌补 -th，膝盖就朝前弯、脚底还是平的。
   空中时 th 固定加 0.38，腿自然收起一点，看起来像跳起来了。 */
const _legQ = new THREE.Quaternion();
const LEG_X = new THREE.Vector3(1, 0, 0);

function poseLegs() {
  const th = CROUCH_THIGH * crouchK + 0.38 * airK;
  if (avatar) avatar.position.y = avatarBaseY - CROUCH_DROP * crouchK;
  if (!legBones || th < 0.001) return;
  const bend = (b, a) => { if (b) b.quaternion.multiply(_legQ.setFromAxisAngle(LEG_X, a)); };
  bend(legBones.upL, -th);  bend(legBones.upR, -th);
  bend(legBones.loL, 2 * th); bend(legBones.loR, 2 * th);
  bend(legBones.ftL, -th);  bend(legBones.ftR, -th);
}

/* =========================================================================
   持枪姿态：Idle/Walk 播完后，用两段 IK 把两条手臂掰到枪上
   下面所有坐标/方向都是「角色本地空间」（角色脸朝 -Z，1 单位 = 1 米）
   调姿势只需要改 HOLD 里的数字
   ========================================================================= */
const HOLD = {
  gunPos: new THREE.Vector3(0.10, 1.32, -0.10),   // 枪身挂在哪（角色本地）
  gunRx: 0.02, gunRy: 0.12, gunRz: 0.00,          // 枪的俯仰 / 左右摆
  rPole: new THREE.Vector3(0.9, -0.5, 0.35),      // 右肘往哪边顶
  lPole: new THREE.Vector3(-0.9, -0.5, 0.30),     // 左肘往哪边顶
  curl: 1.0,                                      // 手指弯曲程度：0 = 不弯，1 = 握住
  gripR: null, gripL: null,                       // 握点，等枪载入后从枪的骨架里读出来
  show: true,                                     // 调试时可以直接关掉看原始动作
};
window.__hold = HOLD;

let holdBones = null;        // 两条胳膊的骨头和骨长
let fingerBones = null;      // [{ bone, axis, n, thumb }]
let legBones = null;         // 下蹲 / 跳跃用的六根腿骨
let avatarBaseY = 0;         // 角色模型原本的离地高度（下蹲是在它上面减）
let gunHandFrame = null;     // 枪自带握持骨架给出的 { R:{F,P}, L:{F,P} }（枪本地空间）
let soldierHandFrame = null; // 士兵的手：{ R:{Qinv,palmLen}, L:{...} }

const BONE_UP = new THREE.Vector3(0, 1, 0);
const _qTmp = new THREE.Quaternion();
const _S = new THREE.Vector3(), _T = new THREE.Vector3(), _E = new THREE.Vector3();
const _n = new THREE.Vector3(), _p = new THREE.Vector3();
const _dir = new THREE.Vector3();
const _b1 = new THREE.Vector3(), _b2 = new THREE.Vector3(), _b3 = new THREE.Vector3();
const _bm = new THREE.Matrix4();
const _qWorld = new THREE.Quaternion(), _qParent = new THREE.Quaternion();

function aimBoneWorld(bone, dirWorld) {
  bone.parent.getWorldQuaternion(_qTmp).invert();
  _dir.copy(dirWorld).applyQuaternion(_qTmp).normalize();
  bone.quaternion.setFromUnitVectors(BONE_UP, _dir);
}

// 用「手指方向 f」+「掌心方向 p」拼一个旋转（自动正交化）
function basisQuat(f, p, out) {
  _b1.copy(f).normalize();
  _b2.copy(p).addScaledVector(_b1, -p.dot(_b1)).normalize();
  _b3.crossVectors(_b1, _b2);
  _bm.makeBasis(_b1, _b2, _b3);
  return out.setFromRotationMatrix(_bm);
}

// 两段 IK：已知肩膀 S、目标手腕 T、两节骨长 L1/L2、肘部朝向 pole，求肘位置
const _targetR = new THREE.Vector3(), _targetL = new THREE.Vector3();
const _gripLTmp = new THREE.Vector3();   // 泵动时左手要跟着护木后移

function solveArm(up, fore, hand, targetLocal, poleLocal, L1, L2, side) {
  if (!up || !fore) return;
  up.getWorldPosition(_S);
  _T.copy(targetLocal).applyMatrix4(playerModel.matrixWorld);
  _n.subVectors(_T, _S);
  let dist = _n.length();
  if (dist < 1e-4) return;
  _n.divideScalar(dist);

  // 够不着就把目标点拉到手能伸到的位置
  const minR = Math.abs(L1 - L2) * 1.002;
  const maxR = (L1 + L2) * 0.999;
  dist = Math.min(maxR, Math.max(minR, dist));
  _T.copy(_S).addScaledVector(_n, dist);

  const a = (L1 * L1 - L2 * L2 + dist * dist) / (2 * dist);
  const h = Math.sqrt(Math.max(0, L1 * L1 - a * a));

  // 肘部朝向：把 pole 投影到垂直于 S→T 的平面上
  _p.copy(poleLocal).transformDirection(playerModel.matrixWorld);
  _p.addScaledVector(_n, -_p.dot(_n));
  if (_p.lengthSq() < 1e-6) _p.set(0, -1, 0).addScaledVector(_n, -_n.dot(new THREE.Vector3(0, -1, 0)));
  _p.normalize();

  _E.copy(_S).addScaledVector(_n, a).addScaledVector(_p, h);

  aimBoneWorld(up, _dir.subVectors(_E, _S));
  avatar.updateMatrixWorld(true);

  fore.getWorldPosition(_S);
  aimBoneWorld(fore, _dir.subVectors(_T, _S));

  // 手掌：直接照抄枪模型自带握持骨架的手指方向和掌心方向
  if (hand && gunHandFrame && soldierHandFrame && mirrorGun) {
    avatar.updateMatrixWorld(true);
    const gf = gunHandFrame[side], sf = soldierHandFrame[side];
    _b1.copy(gf.F).transformDirection(mirrorGun.matrixWorld);   // 手指该朝哪
    _b2.copy(gf.P).transformDirection(mirrorGun.matrixWorld);   // 掌心该朝哪
    basisQuat(_b1, _b2, _qWorld);
    _qWorld.multiply(sf.Qinv);
    hand.parent.getWorldQuaternion(_qParent).invert();
    hand.quaternion.copy(_qParent.multiply(_qWorld));
  }
}

// 手指弯曲：绕着「掌心法线 × 手指方向」转，手指就朝掌心弯
const _curlQ = new THREE.Quaternion();

function curlFingers() {
  if (!fingerBones || !HOLD.curl) return;
  for (const f of fingerBones) {
    const ang = (f.n === 1 ? 0.50 : f.n === 2 ? 0.85 : 0.60) * HOLD.curl * (f.thumb ? 0.55 : 1);
    f.bone.quaternion.multiply(_curlQ.setFromAxisAngle(f.axis, ang));
  }
}

function poseArms() {
  if (!holdBones || !HOLD.show || !mirrorGun || !HOLD.gripR || !gunHandFrame || !soldierHandFrame) return;
  mirrorGun.updateMatrix();
  playerModel.updateMatrixWorld(true);   // 这一下会把 avatar 整棵树一起刷新

  // 枪骨架的 Hand 骨和士兵的手骨都在手腕上，直接对齐就行
  _targetR.copy(HOLD.gripR).applyMatrix4(mirrorGun.matrix);

  // 泵动时镜子里的左手跟着护木一起后移（护木在枪模型本地 +z 方向后退）
  const pk = pumpT > 0 ? pumpCurve(1 - pumpT / PUMP_TIME) : 0;
  if (pk > 0) {
    _gripLTmp.set(HOLD.gripL.x, HOLD.gripL.y, HOLD.gripL.z + PUMP_TRAVEL * 0.45 * pk);
  } else {
    _gripLTmp.copy(HOLD.gripL);
  }
  _targetL.copy(_gripLTmp).applyMatrix4(mirrorGun.matrix);

  // 换弹时左手离开护木：和第一人称共用同一条路线（握点 + 位移，再换到角色空间）
  if (reloadHandWeight > 0.001) {
    _reloadLTmp.copy(HOLD.gripL).add(reloadHandOff).applyMatrix4(mirrorGun.matrix);
    _targetL.lerp(_reloadLTmp, reloadHandWeight);
  }

  solveArm(holdBones.rUp, holdBones.rFore, holdBones.rHand, _targetR, HOLD.rPole, holdBones.rL1, holdBones.rL2, 'R');
  solveArm(holdBones.lUp, holdBones.lFore, holdBones.lHand, _targetL, HOLD.lPole, holdBones.lL1, holdBones.lL2, 'L');
  curlFingers();
}

/* =========================================================================
   桌上的花瓶（可击碎）
   ========================================================================= */
const vase = new THREE.Group();
{
  const ceramic = new THREE.MeshStandardMaterial({ color: 0x7f9294, roughness: 0.35, metalness: 0.08 });

  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.078, 0.26, 16), ceramic);
  body.position.y = 0.13;
  body.castShadow = true;
  body.receiveShadow = true;
  vase.add(body);

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.046, 0.055, 0.07, 16), ceramic);
  neck.position.y = 0.29;
  neck.castShadow = true;
  vase.add(neck);

  const lip = new THREE.Mesh(new THREE.CylinderGeometry(0.058, 0.05, 0.022, 16), ceramic);
  lip.position.y = 0.335;
  vase.add(lip);
}
vase.position.set(-1.50, 0.75, -1.90);
scene.add(vase);

/* =========================================================================
   走廊里的丧尸
   模型：OpenGameArt "Male City Zombie"（CC0 公共领域）
         FBX + PBR 贴图，源文件附 11 段动画，这里转成 GLB 并挑用其中 8 段。
   身高 1.79 米，正面朝 +Z
   ========================================================================= */
const ZOMBIE_SCALE = 1.0;                  // GLB 里已经缩成米制 1.79 米
const ZOMBIE_SPAWN = [-4.2, -2.1, 0, 2.1, 4.2];
const ZOMBIE_Z = 3.6;
const zombies = [];

// ── 波次刷怪 ────────────────────────────────────────────────────
// 出生口：走廊左右两端和中段。每轮挑「离玩家最远」的那个，绝不贴脸生成。
const ZOMBIE_GATES = [
  [-9.0, 3.55], [9.0, 3.55], [-6.3, 3.55], [6.3, 3.55], [-3.0, 3.55], [3.0, 3.55],
];
const MAX_ALIVE = 8;           // 同时最多活着几只（太多了顶不住）
const MAX_BRUTE = 3;           // 大块头最多同时几只
const SPAWN_GAP = 0.5;         // 有配额时每隔多久冒一只
const CORPSE_LIFE = 10;        // 尸体留多久后消失（不然越积越多）
const MAX_CORPSE = 16;         // 尸体最多留几具，超了先清最老的

// ── 新怪：扑食者（跳人头上）／爆炸者 ─────────────────────────
const MAX_JUMPER = 2;          // 同时最多两只扑食者
const MAX_BLOATER = 1;         // 爆炸者同时最多一只
const JUMPER_LEAP_DIST = 5.2;  // 离人这么近就蓄力起跳
const JUMPER_CATCH_DIST = 1.45;// 落点离人这么近就算扑中
const JUMPER_CD = 4.0;         // 一次起跳 / 被甩开后，多久才能再扑
const PIN_DRAIN = 7.5;         // 被按住时每秒掉多少血
const PIN_ESCAPE = 9;          // 要按几下空格才能甩开
const PIN_AUTO = 8.0;          // 一直按不动，它也会自己松开（不让局面死锁）
const BLOATER_FUSE = 0.75;     // 爆炸者贴身之后的引信
const BLOATER_BLAST = 3.0;     // 爆炸半径

let pinnedBy = null;           // 现在按住玩家的那只扑食者
let pinT = 0;                  // 被按住多久了
let pinPress = 0;              // 已经按了几下空格
let shakeAmp = 0;              // 镜头抖动强度（爆炸 / 被扑共用）

// 波次表：第一波 200 只，之后每分钟 +100，封顶 500
const WAVE_SIZES = [200, 300, 400, 500];
const WAVE_PERIOD = 60;        // 每波相隔多少秒
const DOOR_AUTO_AT = 10;       // 开局多少秒后门自动开
const DOOR_OPEN_TIME = 13;     // 自动开着多少秒
const DOOR_CLOSED_TIME = 9;    // 自动关上多少秒（关着的时候外面咬不到你）

let spawnTimer = 6.0;
let spawnCount = 0;
let waveIdx = -1;              // 已经放出的最后一波下标
let waveQuota = 0;             // 还没刷出来的丧尸数
let waveAnnounced = -1;        // 已经播报过第几波
let waveClock = 0;             // 从真正开始玩算起的秒数
let waveAlive = 0;             // 场上活着的数量（每帧算一次，给 HUD 用）
let victory = false;
let started = false;           // 点过开始、锁上鼠标才算
let doorAutoDone = false;
let doorPhase = 'idle';        // idle / open / closed
let doorCycleT = 0;            // 当前这一档还剩几秒

let zombieTemplate = null;     // 基础丧尸：普通 / 爆炸者
let zombieClips = null;
let zombieBones = null;

// 两张新脸：大块头 = 巨型变异体，扑食者 = 人形怪物
let giantTemplate = null;
let giantClips = null;
let giantBones = null;
let monsterTemplate = null;
let monsterClips = null;
let monsterBones = null;
let templatesReady = 0;
const TEMPLATE_NEED = 3;

// 身体 / 服饰两套 PBR 贴图（BaseColor、法线、ORM）
const zombieTexLoader = new THREE.TextureLoader();
const zombieTex = {};
for (const set of ['body', 'outfit']) {
  const base = zombieTexLoader.load(`./assets/zombie_tex/${set}_basecolor.png`);
  base.colorSpace = THREE.SRGBColorSpace;
  zombieTex[set] = {
    base,
    normal: zombieTexLoader.load(`./assets/zombie_tex/${set}_normal.png`),
    orm: zombieTexLoader.load(`./assets/zombie_tex/${set}_orm.png`),
  };
}

function dressZombie(material) {
  if (!material || !material.name) return;
  const set = /outfit/i.test(material.name) ? zombieTex.outfit : zombieTex.body;
  material.map = set.base;
  material.normalMap = set.normal;
  material.roughnessMap = set.orm;   // ORM：G 通道=粗糙度，B 通道=金属度
  material.metalnessMap = set.orm;
  material.color.setRGB(1, 1, 1);
  material.roughness = 1;
  material.metalness = 1;
  material.needsUpdate = true;
}

// 人形怪物的贴图（血丝脓疮那种），原先的 FBX 里是 DDS，已经转成 webp
const monsterTexLoader = new THREE.TextureLoader();
const monsterTex = {
  base: monsterTexLoader.load('./assets/monster_tex/monster_albedo.webp'),
  normal: monsterTexLoader.load('./assets/monster_tex/monster_normal.webp'),
  orm: monsterTexLoader.load('./assets/monster_tex/monster_orm.webp'),
};
monsterTex.base.colorSpace = THREE.SRGBColorSpace;

function dressMonster(material) {
  if (!material) return;
  material.map = monsterTex.base;
  material.normalMap = monsterTex.normal;
  material.roughnessMap = monsterTex.orm;
  material.metalnessMap = monsterTex.orm;
  material.color.setRGB(1, 1, 1);
  material.roughness = 1;
  material.metalness = 1;
  material.needsUpdate = true;
}

/* ── 模型装配工具 ─────────────────────────────────────────────
   三个模型骨架不同（丧尸是 CityDead 命名、巨型体是 mixamorig、
   人形怪物是一堆 joint 编号），所以统一按「骨架里的第几根骨头」来记。
   ──────────────────────────────────────────────────────────── */
function skelOf(model) {
  let skel = null;
  model.traverse((o) => { if (!skel && o.isSkinnedMesh) skel = o.skeleton; });
  return skel;
}

function boneIndexOf(skel, name) {
  if (!skel || !name) return -1;
  return skel.bones.findIndex((b) => b.name === name);
}

// 挑出「脑袋 / 胯 / 贴着墙要检查的那几根骨头」
function makeBoneIndex(skel, spec) {
  const out = {
    head: boneIndexOf(skel, spec.head),
    headTop: boneIndexOf(skel, spec.headTop),
    hips: boneIndexOf(skel, spec.hips),
    limbs: (spec.limbs || []).map((n) => boneIndexOf(skel, n)).filter((i) => i >= 0),
  };
  if (spec.auto && skel) {
    // 名字认不出来的模型：世界坐标最高的那根骨头当脑袋，
    // 再均匀抽十来根骨头当身体采样点（贴墙检测用）
    const v = new THREE.Vector3();
    let best = -1, bestY = -1e9;
    for (let i = 0; i < skel.bones.length; i++) {
      skel.bones[i].getWorldPosition(v);
      if (v.y > bestY) { bestY = v.y; best = i; }
    }
    out.head = best;
    out.headTop = -1;
    out.limbs = [];
    const step = Math.max(1, Math.floor(skel.bones.length / 12));
    for (let i = 0; i < skel.bones.length; i += step) out.limbs.push(i);
  }
  return out;
}

// 把模型摆正：脚底贴 y=0、胯在 x=z=0、身高统一成 1.79 米、正面朝 +Z
// 这样 spawnZombie 里那套「大块头 ×1.32 / 扑食者 ×1.16」的系数就不用改
//
// ⚠ 量尺寸必须按「动画里的姿势」量，不能按模型自带的静止姿势量。
//   巨型变异体导出时静止姿势是躺平的，只有动起来才是站着的；
//   要是量静止姿势，会把它当成一条六米长的麻袋，缩完人就埋进地板里了。
function normalizeModel(obj, opt = {}) {
  // ⓪ 有的模型正面朝 -Z，先原地转 180 度统一成「正面朝 +Z」
  if (opt.rotY) {
    obj.rotation.y += opt.rotY;
    obj.updateMatrixWorld(true);
  }

  // ① 先摆一帧基准动画（默认 idle），让骨头站成真正要用的样子
  if (opt.poseClip && opt.clips && opt.clips.length) {
    const want = String(opt.poseClip).toLowerCase();
    const clip = opt.clips.find((c) => c.name === opt.poseClip)
      || opt.clips.find((c) => c.name.toLowerCase().includes(want));
    if (clip) {
      const mx = new THREE.AnimationMixer(obj);
      mx.clipAction(clip).play();
      mx.update(0);              // 只取第 0 帧，不推时间轴
    }
    obj.updateMatrixWorld(true);
  }

  // ② 蒙皮后的真实包围盒：SkinnedMesh.computeBoundingBox 会把骨骼形变算进去，
  //    普通 Box3.setFromObject 只认静止网格，对骨骼模型是错的
  const box = new THREE.Box3();
  const tb = new THREE.Box3();
  obj.updateMatrixWorld(true);
  obj.traverse((o) => {
    if (!o.isSkinnedMesh || !o.geometry) return;
    o.computeBoundingBox();
    if (!o.boundingBox || o.boundingBox.isEmpty()) return;
    tb.copy(o.boundingBox).applyMatrix4(o.matrixWorld);
    box.union(tb);
  });
  if (box.isEmpty()) box.setFromObject(obj);

  const h = Math.max(1e-4, box.max.y - box.min.y);
  const c = new THREE.Vector3();
  const hips = opt.hips ? obj.getObjectByName(opt.hips) : null;
  if (hips) hips.getWorldPosition(c);
  else box.getCenter(c);

  const inner = new THREE.Group();
  inner.add(obj);
  const wrap = new THREE.Group();
  wrap.add(inner);

  inner.position.x -= c.x;
  inner.position.z -= c.z;
  inner.position.y -= box.min.y;
  wrap.scale.setScalar((opt.height || 1.79) / h);
  wrap.updateMatrixWorld(true);
  return wrap;
}

// 动画名对不上：按「我们的叫法 → 模型里的真名」翻译一遍
function pickClips(anims, map) {
  const find = (n) => anims.find((a) => a.name === n)
    || anims.find((a) => a.name.toLowerCase() === String(n).toLowerCase())
    || anims.find((a) => a.name.endsWith('|' + n));
  const out = {};
  for (const k of Object.keys(map)) {
    const c = find(map[k]);
    if (c) out[k] = c;
  }
  return out;
}

function onTemplateLoaded(what) {
  templatesReady++;
  console.log('[模型] ' + what + ' 就绪 (' + templatesReady + '/' + TEMPLATE_NEED + ')');
  if (templatesReady >= TEMPLATE_NEED) resetZombies();
}

const modelLoader = new GLTFLoader();


// ① 基础丧尸（CC0 · Rikindle3D）
modelLoader.load('./assets/zombie_real.glb', (gltf) => {
  const obj = gltf.scene;
  obj.scale.setScalar(ZOMBIE_SCALE);
  obj.traverse((o) => {
    if (!o.isMesh) return;
    o.castShadow = false;
    o.receiveShadow = false;
    o.frustumCulled = false;
    dressZombie(o.material);
  });
  zombieTemplate = obj;
  zombieClips = pickClips(gltf.animations, {
    Idle: 'Idle', Walk: 'Walk', Run: 'Run', Punch: 'Punch', Punch2: 'Punch2',
    HitReact: 'HitReact', Death: 'Death', Scream: 'Scream',
  });
  zombieBones = makeBoneIndex(skelOf(obj), {
    head: 'CityDeadOutfitHead', headTop: 'CityDeadOutfitHeadTop_End',
    hips: 'CityDeadOutfitHips', limbs: ZOMBIE_LIMB_BONES,
  });
  console.log('[丧尸] 动画：', Object.keys(zombieClips).join(' / '));
  onTemplateLoaded('丧尸');
}, undefined, (err) => {
  console.warn('[丧尸] zombie_real.glb 没加载上', err);
  onTemplateLoaded('丧尸(失败)');
});

// ② 巨型变异体（CC0 · eldritch-grim）
//    静止姿势是躺平的，动画里才是站着的 —— 所以按 idle 这一帧来量身高
modelLoader.load('./assets/giant_mutant.glb', (gltf) => {
  // 正面朝 +Z 不用转：两腿膝盖都落在「髋—踝」连线的 +Z 一侧，说明它就是朝 +Z 的
  const obj = normalizeModel(gltf.scene, {
    height: 1.79, poseClip: 'idle', clips: gltf.animations, hips: 'mixamorigHips',
  });
  obj.traverse((o) => {
    if (!o.isMesh) return;
    o.castShadow = false;
    o.receiveShadow = false;
    o.frustumCulled = false;
    o.material = o.material.clone();
    o.material.color.setRGB(1.08, 1.06, 1.02);   // 原贴图偏黑，稍微提一点亮度
    o.material.needsUpdate = true;
  });
  giantTemplate = obj;
  // ⚠ 不用 Jump Slam 当吼叫：那一段自带六米多的位移，一播就整个人飞出去
  giantClips = pickClips(gltf.animations, {
    Idle: 'idle', Walk: 'Giant Run', Run: 'Giant Run',
    Punch: 'Right Punch', Punch2: 'Left Punch',
    Death: 'Death', Scream: 'idle',
  });
  // 贴墙检测只采「躯干和脚」这几根：它的胳膊张得很开（跑起来两臂展开近 2.3 米），
  // 手也拿来当采样点的话，在 2 米宽的走廊里会被两边墙同时顶住，整个人卡住原地抖。
  // 胳膊偶尔扫进墙里比卡住不动强得多。
  giantBones = makeBoneIndex(skelOf(obj), {
    head: 'mixamorigHead', headTop: 'mixamorigHeadTop_End', hips: 'mixamorigHips',
    limbs: ['mixamorigHead', 'mixamorigSpine2',
      'mixamorigLeftFoot', 'mixamorigRightFoot',
      'mixamorigLeftToeBase', 'mixamorigRightToeBase'],
  });
  console.log('[巨型体] 动画：', Object.keys(giantClips).join(' / '));
  onTemplateLoaded('巨型变异体');
}, undefined, (err) => {
  console.warn('[巨型体] giant_mutant.glb 没加载上', err);
  onTemplateLoaded('巨型体(失败)');
});

// ③ 人形怪物（CC0 · city-building-game-art）
modelLoader.load('./assets/horror_game_monster.glb', (gltf) => {
  const obj = normalizeModel(gltf.scene, {
    height: 1.79, poseClip: 'Idle', clips: gltf.animations,
  });
  obj.traverse((o) => {
    if (!o.isMesh) return;
    o.castShadow = false;
    o.receiveShadow = false;
    o.frustumCulled = false;
    o.material = new THREE.MeshStandardMaterial({ name: 'monster', roughness: 1, metalness: 1 });
    dressMonster(o.material);
  });
  monsterTemplate = obj;
  // ⚠ 不用 Jump：那一小段整个人往地下扎（最低 -1.87），播出来是钻地不是扑。
  //    它没有「攻击 / 倒地」动画，攻击就用 Run 顶上，倒地交给主角自己侧翻（见尸体那段）。
  monsterClips = pickClips(gltf.animations, {
    Idle: 'Idle', Walk: 'Walk', Run: 'Run',
    Punch: 'Run', Punch2: 'Run', HitReact: 'Idle', Scream: 'Idle',
  });
  // 这个模型骨头名全是 joint 编号（还有重名），只能用自动识别
  monsterBones = makeBoneIndex(skelOf(obj), { auto: true });
  console.log('[人形怪] 动画：', Object.keys(monsterClips).join(' / '));
  onTemplateLoaded('人形怪物');
}, undefined, (err) => {
  console.warn('[人形怪] horror_game_monster.glb 没加载上', err);
  onTemplateLoaded('人形怪(失败)');
});

/* ── 爆炸者的身形改造 ─────────────────────────────────────────
   骨骼在自身的局部空间里都指向 +Y（子骨头的位移全是 +Y），
   所以把某根骨头的 scale.y 放大就是在「把这段肢体拉长」，
   蒙皮会跟着变形，动画也照常播。
   （扑食者 / 大块头已经换成另外两个模型，不再靠掰骨头）
   ──────────────────────────────────────────────────────────── */
function shapeBloater(model) {
  const bone = (n) => model.getObjectByName(n);
  // 躯干横着撑开、竖着压短：像一个鼓起来的脓包
  for (const n of ['CityDeadOutfitSpine', 'CityDeadOutfitSpine1', 'CityDeadOutfitSpine2']) {
    const b = bone(n); if (b) b.scale.set(1.18, 0.94, 1.18);
  }
  const head = bone('CityDeadOutfitHead');
  if (head) head.scale.setScalar(1.08);
}

// kind: 'normal' 普通丧尸 / 'brute' 厚血大块头
//       'jumper' 扑食者（会跳到你头上） / 'bloater' 爆炸者
function spawnZombie(x, z, kind = 'normal') {
  const brute = kind === 'brute';
  const jumper = kind === 'jumper';
  const bloater = kind === 'bloater';

  // 各自用自己那套模型 / 骨架 / 动画
  const tpl = brute ? giantTemplate : jumper ? monsterTemplate : zombieTemplate;
  const clips = brute ? giantClips : jumper ? monsterClips : zombieClips;
  const boneIdx = brute ? giantBones : jumper ? monsterBones : zombieBones;
  if (!tpl || !clips || !boneIdx) return;

  // 体型：大块头整体放大；扑食者又高又瘦；爆炸者又矮又胖
  const sx = brute ? 1.32 : jumper ? 0.88 : bloater ? 1.18 : 1.0;
  const sy = brute ? 1.32 : jumper ? 1.16 : bloater ? 1.28 : 1.0;
  const sizeMul = sy;                        // 命中盒高度跟着身高走

  const model = cloneSkinned(tpl);
  const bs = tpl.scale;
  model.scale.set(bs.x * sx, bs.y * sy, bs.z * sx);
  model.position.set(x, 0, z);
  if (bloater) shapeBloater(model);     // 驼背、躯干横着撑开
  model.traverse((o) => {
    if (!o.isMesh) return;
    o.castShadow = false;
    o.receiveShadow = false;
    o.frustumCulled = false;
    // 每只丧尸用自己的材质，之后要单独做受击闪红/淡出也方便
    o.material = o.material.clone();
    if (!o.material || !o.material.color) return;
    if (bloater) o.material.color.setRGB(0.94, 1.04, 0.52);   // 爆炸者：脓黄泛绿
  });

  const skel = skelOf(model);
  const boneAt = (i) => (skel && i >= 0 ? (skel.bones[i] || null) : null);

  const mixer = new THREE.AnimationMixer(model);
  const actions = {};
  const usedClips = new Set();
  for (const [k, clip] of Object.entries(clips)) {
    // 同一段动画可能被挂到两个动作上（比如人形怪拿 Run 当出拳）。
    // three 里同一段 clip 只会有一个 action，两个动作共用一个的话，
    // 「播一次」和「一直循环」的设置会互相覆盖 —— 所以重复的就复制一份。
    const c = usedClips.has(clip) ? clip.clone() : clip;
    usedClips.add(clip);
    const a = mixer.clipAction(c);
    if (k === 'Punch' || k === 'Punch2' || k === 'HitReact' || k === 'Death' || k === 'Scream') {
      a.setLoop(THREE.LoopOnce, 1);
      a.clampWhenFinished = true;
    }
    actions[k] = a;
  }
  actions.Idle.play();

  // 扑食者按住人时要一直啃：Punch2 本来是「播一次就停」，这里改成循环
  if (jumper && actions.Punch2) {
    actions.Punch2.setLoop(THREE.LoopRepeat, Infinity);
    actions.Punch2.clampWhenFinished = false;
  }

  const zb = {
    mesh: model,
    mixer, actions,
    animName: 'Idle',
    kind, brute, jumper, bloater,
    headBone: boneAt(boneIdx.head),
    headTop: boneAt(boneIdx.headTop),
    hipsBone: boneAt(boneIdx.hips),
    bodyBones: boneIdx.limbs.map(boneAt).filter(Boolean),
    headDy: jumper ? -0.13 : 0.10,          // 人形怪的「最高那根骨」是头顶，脑袋中心要往下挪
    attackTiming: brute ? GIANT_ATTACK : jumper ? MONSTER_ATTACK : null,
    alive: true,
    hp: brute ? 9 : bloater ? 6 : jumper ? 2.5 : 2,   // 普通：身体两枪；爆炸者 6 枪；扑食者 3 枪
    speed: brute
      ? 2.20 + Math.random() * 0.50          // 大块头 2.20~2.70 米/秒（慢一点但扛揍）
      : bloater
        ? 1.45 + Math.random() * 0.30        // 爆炸者最慢，但千万别让它走到跟前
        : jumper
          ? 2.90 + Math.random() * 0.60      // 扑食者小跑，好让你在它起跳前打掉
          : 2.70 + Math.random() * 1.00,     // 普通丧尸 2.70~3.70（你冲刺 4.2，跑得掉）
    // 命中盒跟着体型走，大块头别打不中
    bodyR: (brute ? 0.34 : jumper ? 0.22 : bloater ? 0.32 : ZOMBIE_BODY_R) * (sizeMul > 1.2 ? sizeMul : 1),
    bodyTop: 1.62 * sizeMul,
    headR: (jumper ? 0.17 : bloater ? 0.19 : ZOMBIE_HEAD_R) * (sizeMul > 1.2 ? sizeMul : 1),
    biteRange: brute ? 1.95 : bloater ? 1.90 : jumper ? 1.50 : 1.65,
    clawRange: brute ? 1.75 : bloater ? 1.70 : jumper ? 1.35 : 1.30,
    // 停步距离：大块头胸脯很厚、胳膊又长，站到 0.85 米镜头会直接埋进它身子里
    keepDist: brute ? 1.45 : jumper ? 1.00 : bloater ? 0.95 : 0.85,
    // 贴墙余量：骨头离墙表面还要留多少，大块头肩膀宽、胳膊粗
    wallPad: brute ? 0.22 : jumper ? 0.05 : bloater ? 0.06 : 0,
    dmg: brute ? 30 : jumper ? 20 : bloater ? 0 : 18,   // 爆炸者不咬人，只炸
    lane: (Math.random() - 0.5) * (brute ? 0.16 : jumper ? 0.16 : bloater ? 0.10 : 0.40),
    attackCd: 0.8 + Math.random() * 1.0,
    attackT: -1,                   // -1 = 没在攻击；>=0 = 攻击动画走到第几秒
    attackClip: 'Punch',
    hitDone: false,
    hitT: 0,                       // 受击反应剩余时间
    deathT: 0,
    gone: false,                   // 尸体到时间后移除
    growlCd: 1.5 + Math.random() * 6,   // 下一次低吼倒计时

    // ── 扑食者状态机：walk → crouch → leap →（扑中 pin / 没扑中 stun）──
    state: 'walk',
    leapCd: 2.5 + Math.random() * 2.0,
    leapT: -1,
    leapDur: 0.7,
    crouchT: 0,
    leapFrom: new THREE.Vector3(),
    leapTo: new THREE.Vector3(),
    stunT: 0,
    pin: false,
    // ── 爆炸者 ──
    fuseT: -1,
    exploded: false,
  };

  // 跑步动作跟着速度放快，脚才不会在地上打滑
  if (actions.Run) actions.Run.timeScale = clamp(zb.speed / 3.0, 0.85, 1.7);
  zb.runScale = actions.Run ? actions.Run.timeScale : 1;   // 腾空时临时加快，落地要还原

  model.traverse((o) => { o.userData.zombie = zb; });

  scene.add(model);
  zombies.push(zb);
}

function setZAnim(zb, name, fade = 0.18) {
  if (zb.animName === name || !zb.actions[name]) return;
  const prev = zb.actions[zb.animName];
  const next = zb.actions[name];
  next.reset();
  next.setEffectiveWeight(1);
  next.fadeIn(fade);
  next.play();
  if (prev && prev !== next) prev.fadeOut(fade);
  zb.animName = name;
}

/* ── 扑食者：跳人头上（求生之路的 Hunter）─────────────────────
   walk → crouch（0.55 秒蓄力，尖啸提醒）→ leap（抛物线飞扑）
   扑中 = pin：镜头乱晃、不能走不能开枪、每秒掉血，狂按空格才甩得开
   扑空 = stun：自己摔一跤，趴在地上 1 秒多，这时候最好打
   ──────────────────────────────────────────────────────────── */
function pinPlayer(zb) {
  zb.pin = true;
  zb.state = 'walk';
  pinnedBy = zb;
  pinT = 0;
  pinPress = 0;
  shakeAmp = 1.0;
  setZAnim(zb, 'Punch2', 0.06);       // Punch2 已改成循环，会一直低头啃
  showBanner('它扑到你身上了！狂按 空格 甩开', 2.6);
  _sfxPos.copy(zb.mesh.position);
  _sfxPos.y = 1.45;
  sfxAt('growl1', _sfxPos, { rate: 1.35, volume: 1.25 });
}

// 起跳路线会不会穿墙：跨门的时候，只许从门洞那条竖条穿过去
function leapPathClear(zb) {
  const m = zb.mesh;
  const aCorr = m.position.z >= 2.40;
  const pCorr = player.pos.z >= 2.40;
  if (aCorr === pCorr) return true;
  const f = (2.40 - m.position.z) / (player.pos.z - m.position.z);
  const crossX = m.position.x + (player.pos.x - m.position.x) * f;
  return Math.abs(crossX) < 0.52;
}

function startLeap(zb) {
  const m = zb.mesh;
  zb.state = 'leap';
  zb.leapT = 0;
  zb.leapFrom.set(m.position.x, 0, m.position.z);
  const d = Math.hypot(player.pos.x - m.position.x, player.pos.z - m.position.z);
  zb.leapDur = clamp(d / 6.2, 0.42, 0.95);
  // 落点 = 玩家「现在」站的位置。扑出去之后你侧身跑开，它就会扑空。
  const dx = player.pos.x - m.position.x;
  const dz = player.pos.z - m.position.z;
  const dl = Math.hypot(dx, dz) || 1;
  zb.leapTo.set(
    player.pos.x - (dx / dl) * 0.55,
    0,
    player.pos.z - (dz / dl) * 0.55
  );
  zb.leapCd = JUMPER_CD;
  if (zb.actions.Run) zb.actions.Run.timeScale = 2.2;   // 空中蹬腿蹬得飞快
  setZAnim(zb, 'Run', 0.08);
  _sfxPos.copy(m.position);
  _sfxPos.y = 1.60;
  sfxAt('growl2', _sfxPos, { rate: 1.45, volume: 1.0 });
}

// 甩开 / 它自己松口：把它掀到前面的地上，愣一会儿挨打
function releasePin(knocked, silent = false) {
  const zb = pinnedBy;
  pinnedBy = null;
  pinT = 0;
  pinPress = 0;
  if (!zb) return;
  zb.pin = false;
  zb.state = 'stun';
  zb.stunT = knocked ? 2.0 : 1.2;
  zb.leapCd = JUMPER_CD;
  zb.mesh.rotation.set(0, zb.mesh.rotation.y, 0);
  zb.mesh.position.y = 0;
  if (zb.actions.Run) zb.actions.Run.timeScale = zb.runScale;
  setZAnim(zb, 'HitReact', 0.06);
  clampZombieBody(zb);
  shakeAmp = Math.max(shakeAmp, 0.35);
  if (silent) return;
  showBanner(knocked ? '甩开了！它被你掀翻在地' : '它自己松口了', 1.8);
  _sfxPos.copy(zb.mesh.position);
  _sfxPos.y = 1.0;
  sfxAt('growl3', _sfxPos, { rate: 0.95, volume: 0.9 });
}

// 被按住时每帧调一次：持续掉血 + 镜头抖；按够空格才甩得开
function updatePin(dt) {
  shakeAmp = Math.max(0, shakeAmp - dt * 1.3);
  if (!pinnedBy) return;
  if (!started) return;                     // 按 Esc 暂停时，扑咬也停
  if (gameOver) { releasePin(false, true); return; }
  pinT += dt;
  damagePlayer(PIN_DRAIN * dt, 0.035);   // 持续掉血，但别把整块屏幕糊成红色
  shakeAmp = 0.75 + Math.sin(elapsed * 34) * 0.15;
  if (pinT >= PIN_AUTO) {
    showBanner('它咬累了，自己松开', 1.6);
    releasePin(false, true);
  }
}

// 每按一下空格算一下挣扎
function struggle() {
  if (!pinnedBy) return;
  pinPress++;
  shakeAmp = 1.0;
  if (pinPress >= PIN_ESCAPE) {
    releasePin(true);
  } else {
    _sfxPos.copy(pinnedBy.mesh.position);
    _sfxPos.y = 1.20;
    sfxAt('growl3', _sfxPos, { rate: 1.30, volume: 0.45 });
  }
}

// 爆炸者炸开：离得越近伤越重，周围丧尸一起炸（引爆另一只爆炸者会连锁）
function explodeBloater(zb) {
  if (zb.exploded) return;
  zb.exploded = true;
  const p = zb.mesh.position.clone();
  p.y = 1.0;

  const pd = Math.hypot(player.pos.x - p.x, player.pos.z - p.z);
  const doorNow = doorOpen < 0.45 &&
    (player.pos.z - 2.40) * (p.z - 2.40) < 0;
  if (pd < BLOATER_BLAST && !doorNow && !gameOver) {
    damagePlayer(Math.round(26 + 34 * (1 - pd / BLOATER_BLAST)));
  }

  for (const o of zombies) {
    if (o === zb || !o.alive) continue;
    const d = Math.hypot(o.mesh.position.x - p.x, o.mesh.position.z - p.z);
    if (d < BLOATER_BLAST) hitZombie(o, p.clone(), false, 4, null, _UP.clone());
  }

  spawnBlood(p, _UP.clone(), 4, bileShades);
  shakeAmp = Math.max(shakeAmp, 1.0);
  _sfxPos.copy(p);
  sfxAt('growl3', _sfxPos, { rate: 0.36, volume: 1.3 });
  killZombie(zb);
  zb.deathT = 7.0;                    // 炸成一摊，尸体早点清掉
}

function resetZombies() {
  for (const zb of zombies) scene.remove(zb.mesh);
  zombies.length = 0;
  pinnedBy = null; pinT = 0; pinPress = 0; shakeAmp = 0;
  spawnTimer = 6.0;
  spawnCount = 0;
  waveIdx = 0;
  waveQuota = WAVE_SIZES[0];
  waveClock = 0;
  waveAlive = 0;
  waveAnnounced = -1;
  victory = false;
  doorAutoDone = false;
  doorPhase = 'idle';
  doorCycleT = 0;
  if (!zombieTemplate) return;   // 另外两只没加载上也能开局，只是那两种怪不会刷
  for (let i = 0; i < ZOMBIE_SPAWN.length; i++) {
    spawnZombie(ZOMBIE_SPAWN[i], ZOMBIE_Z + (Math.random() - 0.5) * 0.5);
  }
  // 一开始就在走廊两头各放一只「新怪」，让人第一眼就看见
  spawnZombie(8.4, ZOMBIE_Z, 'brute');
  spawnZombie(-8.4, ZOMBIE_Z, 'jumper');
  spawnCount = 1;
  waveQuota = WAVE_SIZES[0] - ZOMBIE_SPAWN.length - 2;   // 开局场上这几只也算进第一波
  if (waveQuota < 0) waveQuota = 0;
}

// 波次：第一波 200 只，之后每 60 秒 +100，封顶 500；配额刷完、场上清空 = 通关
function updateSpawning(dt) {
  if (!started || gameOver || !zombieTemplate) return;

  if (!victory) {
    waveClock += dt;
    while (waveIdx + 1 < WAVE_SIZES.length &&
           waveClock >= (waveIdx + 1) * WAVE_PERIOD) {
      waveIdx++;
      waveQuota += WAVE_SIZES[waveIdx];
    }
    if (waveAnnounced !== waveIdx) {
      waveAnnounced = waveIdx;
      showBanner(`第 ${waveIdx + 1} 波 · ${WAVE_SIZES[waveIdx]} 只丧尸`, 3.2);
    }
  }

  // 每帧点一次人数：HUD 和「通关」都靠它
  let alive = 0, brutes = 0, jumpers = 0, bloaters = 0;
  for (const z of zombies) {
    if (!z.alive) continue;
    alive++;
    if (z.brute) brutes++;
    else if (z.jumper) jumpers++;
    else if (z.bloater) bloaters++;
  }
  waveAlive = alive;

  if (!victory && waveIdx === WAVE_SIZES.length - 1 && waveQuota <= 0 && alive === 0) {
    victory = true;
    showBanner('🎉 恭喜通关！按 T 再来一局', 12);
  }
  if (victory) return;

  if (waveQuota <= 0) return;
  spawnTimer -= dt;
  if (spawnTimer > 0) return;
  spawnTimer = SPAWN_GAP;
  if (alive >= MAX_ALIVE) return;

  // 挑离玩家最远的出生口；连最远的都不到 4 米，这一轮就不刷
  let gx = ZOMBIE_GATES[0][0], gz = ZOMBIE_GATES[0][1], best = -1;
  for (const [gx2, gz2] of ZOMBIE_GATES) {
    const dd = Math.hypot(gx2 - player.pos.x, gz2 - player.pos.z);
    if (dd > best) { best = dd; gx = gx2; gz = gz2; }
  }
  if (best < 4.0) return;

  spawnCount++;
  // 先保证大块头的节奏（每 4 只一个），剩下按概率混进扑食者和爆炸者
  const roll = Math.random();
  let kind = 'normal';
  if (spawnCount % 4 === 0 && brutes < MAX_BRUTE) kind = 'brute';
  else if (roll < 0.12 && jumpers < MAX_JUMPER) kind = 'jumper';
  else if (roll < 0.18 && bloaters < MAX_BLOATER) kind = 'bloater';
  spawnZombie(
    clamp(gx + (Math.random() - 0.5) * 0.8, -9.2, 9.2),
    clamp(gz + (Math.random() - 0.5) * 0.5, 2.62, 4.55),
    kind
  );
  waveQuota--;
}

/* =========================================================================
   音效系统（WebAudio）
   —— 素材全部 CC0，出处见 素材来源.txt
   —— 枪声/换弹/脚步是「贴耳」的 2D 声；丧尸吼叫按距离和左右声像衰减
   ========================================================================= */
const AUDIO_BASE = './assets/audio/sfx/';
const AUDIO_FILES = {
  ak1: 'ak1.ogg', ak2: 'ak2.ogg', ak3: 'ak3.ogg', ak4: 'ak4.ogg',
  rifle1: 'rifle1.ogg', rifle2: 'rifle2.ogg', shotgun1: 'shotgun1.ogg',
  pistol1: 'pistol1.ogg', pistol2: 'pistol2.ogg', pistol3: 'pistol3.ogg',
  reload_rifle: 'reload_rifle.ogg', reload_pistol: 'reload_pistol.ogg',
  shotgun_pump: 'shotgun_pump.ogg',
  foot1: 'foot1.ogg', foot2: 'foot2.ogg', foot3: 'foot3.ogg',
  foot4: 'foot4.ogg', foot5: 'foot5.ogg', foot6: 'foot6.ogg',
  growl1: 'growl1.ogg', growl2: 'growl2.ogg', growl3: 'growl3.ogg',
  bite: 'bite.ogg',
};

const audioState = { ctx: null, master: null, buffers: {}, raw: {}, loading: false, decoding: {}, primed: false };

// 页面一打开就把 24 个音效的原始字节下好（下载不需要用户操作），
// 等玩家第一次点击建好音频上下文后马上解码，第一枪就能出声。
function prefetchAudio() {
  const st = audioState;
  if (st.loading) return;
  st.loading = true;
  for (const [k, f] of Object.entries(AUDIO_FILES)) {
    fetch(AUDIO_BASE + f, { cache: 'force-cache' })
      .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(r.status)))
      .then((b) => { st.raw[k] = b; decodeAudio(k); })
      .catch(() => { console.warn('[音效] 载入失败', f); });
  }
}

function decodeAudio(k) {
  const st = audioState;
  if (!st.ctx || !st.raw[k] || st.buffers[k] || st.decoding[k]) return;
  st.decoding[k] = true;
  st.ctx.decodeAudioData(st.raw[k])
    .then((buf) => { st.buffers[k] = buf; st.raw[k] = null; })
    .catch(() => { console.warn('[音效] 解码失败', k); });
}

// 音频上下文必须在「用户操作」里创建：在点击之前建出来的上下文会被浏览器
// 挂起，恢复时容易带着一个大缓冲，声音就会整体晚半拍。所以这里只在手势里建。
function makeAudioContext() {
  const st = audioState;
  if (st.ctx) return st.ctx;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  let ctx;
  try {
    ctx = new AC({ latencyHint: 'interactive' });   // 标准的低延迟模式
  } catch (e) {
    console.warn('[音效] 建音频上下文失败', e);
    return null;
  }
  const master = ctx.createGain();
  master.gain.value = 0.85;
  master.connect(ctx.destination);
  st.ctx = ctx;
  st.master = master;
  for (const k of Object.keys(st.raw)) if (st.raw[k]) decodeAudio(k);
  return ctx;
}

// 浏览器要求先有用户操作才允许出声：第一次点击/按键时恢复上下文
function initAudio() {
  const ctx = makeAudioContext();
  if (!ctx) return;
  if (ctx.state === 'suspended') ctx.resume();
  // 预热：播一个 1 样本的静音，让音频管线立刻转起来，避免第一声慢半拍
  if (!audioState.primed) {
    audioState.primed = true;
    const b = ctx.createBuffer(1, 1, ctx.sampleRate);
    const s = ctx.createBufferSource();
    s.buffer = b;
    s.connect(ctx.destination);
    s.start(0);

    // 用一个 20Hz、几乎听不见的极弱信号把音频设备「按住」不让它休眠。
    // 增益完全为 0 时，系统和驱动可能认为没有声音在播，就把声卡挂起，
    // 下一次开枪要等它醒，听起来像声音晚了好几秒。
    const keep = ctx.createOscillator();
    const keepGain = ctx.createGain();
    keep.frequency.value = 20;
    keepGain.gain.value = 0.0002;   // -74dB，耳朵听不出来，但波形是真实存在的
    keep.connect(keepGain);
    keepGain.connect(ctx.destination);
    keep.start();
    audioState.keepAlive = keep;
  }
}

// 页面一打开就开始下载音效（比等到点鼠标再下载快得多）
prefetchAudio();

// 播一个 2D 音效；rate 变调、pan 左右、volume 音量
function sfx(name, opt = {}) {
  const st = audioState;
  const ctx = st.ctx;
  if (!ctx) return;
  if (ctx.state === 'suspended') ctx.resume();   // 保险：万一被浏览器挂起，先恢复再播
  const buf = st.buffers[name];
  if (!buf) return;

  const src = ctx.createBufferSource();
  src.buffer = buf;
  src.playbackRate.value = opt.rate || 1;

  let tail = src;
  if (ctx.createStereoPanner) {
    const p = ctx.createStereoPanner();
    p.pan.value = clamp(opt.pan || 0, -1, 1);
    tail.connect(p);
    tail = p;
  }
  const g = ctx.createGain();
  g.gain.value = Math.max(0, opt.volume === undefined ? 1 : opt.volume);
  tail.connect(g);
  g.connect(st.master);
  src.start(ctx.currentTime);   // 立刻出声，不留调度余量
}

// 世界坐标音效：按距离衰减、按左右声像定位
const _sfxRel = new THREE.Vector3();
const _sfxRight = new THREE.Vector3();
const _sfxPos = new THREE.Vector3();

function sfxAt(name, pos, opt = {}) {
  if (!audioState.ctx) return;
  _sfxRel.copy(pos).sub(camera.position);
  const dist = _sfxRel.length();
  if (dist > 22) return;
  _sfxRight.set(1, 0, 0).applyQuaternion(camera.quaternion);
  const pan = dist > 1e-4 ? clamp(_sfxRel.normalize().dot(_sfxRight), -1, 1) * 0.85 : 0;
  const vol = (opt.volume === undefined ? 1 : opt.volume) / (1 + dist * 0.30);
  if (vol < 0.015) return;
  sfx(name, { ...opt, pan, volume: vol });
}

// 脚步：按走过的距离触发（走路约 1.75 米一步，跑步约 1.55 米）
let stepDist = 0;
let stepIdx = 0;

function updateFootsteps(dt, moving, running) {
  if (!audioState.ctx) return;
  if (!moving) { stepDist = Math.min(stepDist, 0.30); return; }
  stepDist += dt * (running ? RUN_SPEED : WALK_SPEED);
  const gap = running ? 1.55 : 1.75;
  if (stepDist < gap) return;
  stepDist -= gap;
  stepIdx = (stepIdx + 1 + (Math.random() * 5 | 0)) % 6;
  sfx('foot' + (stepIdx + 1), {
    rate: 0.90 + Math.random() * 0.20,
    volume: (running ? 0.34 : 0.22) * (0.85 + Math.random() * 0.3),
    pan: (Math.random() - 0.5) * 0.25,
  });
}

// 丧尸低吼：每只丧尸有独立计时器，离得近才听得见
function updateZombieAudio(dt) {
  if (!audioState.ctx) return;
  for (const zb of zombies) {
    if (!zb.alive) continue;
    zb.growlCd -= dt;
    if (zb.growlCd > 0) continue;
    zb.growlCd = 4.5 + Math.random() * 7;
    if (Math.random() < 0.40) continue;
    _sfxPos.copy(zb.mesh.position);
    _sfxPos.y = 1.35;
    sfxAt('growl' + (1 + (Math.random() * 3 | 0)), _sfxPos, {
      rate: (zb.brute ? 0.62 : 0.82) + Math.random() * 0.28,
      volume: (zb.brute ? 0.72 : 0.55) * (0.7 + Math.random() * 0.6),
    });
  }
}

/* =========================================================================
   射击系统
   ========================================================================= */
const raycaster = new THREE.Raycaster();
raycaster.far = 30;
const shotDir = new THREE.Vector3();

/* ── 玩家生命 / 丧尸受击 ─────────────────────────────────────── */
const MAX_HP = 100;
let playerHP = MAX_HP;
let hurtFlash = 0;
let lastHurtAt = -999;         // 上次挨咬的时刻，用来算脱战回血
let gameOver = false;

const healthEl = document.getElementById('healthText');
const healthFillEl = document.getElementById('healthFill');
const hurtEl = document.getElementById('hurt');

function updateHealthUI() {
  if (healthEl) healthEl.textContent = `生命 ${Math.round(playerHP)}`;
  if (healthFillEl) {
    const k = Math.max(0, playerHP / MAX_HP);
    healthFillEl.style.width = (k * 100).toFixed(1) + '%';
    healthFillEl.style.background = k > 0.5
      ? 'linear-gradient(90deg,#4f9c46,#8ec06a)'
      : k > 0.25
        ? 'linear-gradient(90deg,#c99a3a,#e0b451)'
        : 'linear-gradient(90deg,#b23327,#d9534a)';
  }
}

function damagePlayer(n, flash = 0.5) {
  if (gameOver) return;
  playerHP = Math.max(0, playerHP - n);
  lastHurtAt = elapsed;
  hurtFlash = Math.min(0.85, hurtFlash + flash);
  updateHealthUI();

  if (playerHP <= 0) {
    gameOver = true;
    mouseDown = false;
    if (document.pointerLockElement) document.exitPointerLock();
  }
}

const _headPos = new THREE.Vector3();
const _eyePos = new THREE.Vector3();
const _bodyPos = new THREE.Vector3();

function zombieHeadCenter(zb, out) {
  // 「头骨底」和「头顶」两个骨骼的中点就是头的中心
  if (zb.headBone && zb.headTop) {
    zb.headBone.getWorldPosition(out);
    zb.headTop.getWorldPosition(_eyePos);
    out.add(_eyePos).multiplyScalar(0.5);
    return true;
  }
  if (zb.headBone) {
    zb.headBone.getWorldPosition(out);
    out.y += (zb.headDy ?? 0.10);
    return true;
  }
  return false;
}

// 射线与球 / 竖直圆柱的求交（丧尸蒙皮网格的 raycast 用的是绑定姿势，打移动中的丧尸会偏，
// 所以身体判定改成解析几何：一个圆柱当身体，一个球当头）
function raySphereT(o, d, c, r) {
  const ox = o.x - c.x, oy = o.y - c.y, oz = o.z - c.z;
  const b = ox * d.x + oy * d.y + oz * d.z;
  const cc = ox * ox + oy * oy + oz * oz - r * r;
  const disc = b * b - cc;
  if (disc < 0) return -1;
  const sq = Math.sqrt(disc);
  let t = -b - sq;
  if (t < 0) t = -b + sq;
  return t >= 0 ? t : -1;
}

function rayCylinderT(o, d, cx, cz, r, y0, y1) {
  const ox = o.x - cx, oz = o.z - cz;
  const a = d.x * d.x + d.z * d.z;
  if (a < 1e-8) return -1;
  const b = 2 * (ox * d.x + oz * d.z);
  const c = ox * ox + oz * oz - r * r;
  const disc = b * b - 4 * a * c;
  if (disc < 0) return -1;
  const sq = Math.sqrt(disc);
  let t = (-b - sq) / (2 * a);
  if (t < 0) t = (-b + sq) / (2 * a);
  if (t < 0) return -1;
  const y = o.y + d.y * t;
  if (y < y0 || y > y1) return -1;
  return t;
}

const ZOMBIE_BODY_R = 0.22;    // 身体圆柱半径（写实人体肩宽的一半左右）
const ZOMBIE_HEAD_R = 0.16;    // 头部球半径（实测头顶到下巴约 0.25 米）

/* ── 丧尸的身体不许穿墙 / 穿门 ────────────────────────────────
   动画本身会把身体甩出模型原点很远：走路左右歪到 0.7 米、
   出拳往前探 1 米、倒地往前滑 2 米。所以光挡住「脚下那个点」不够，
   这里每帧把身上 12 个关键骨点都查一遍，哪个点越过墙面，
   就把整只丧尸平移回去，保证连手指头都留在墙的这一侧。
   ──────────────────────────────────────────────────────────── */
const ZOMBIE_LIMB_BONES = [
  'CityDeadOutfitHead', 'CityDeadOutfitHeadTop_End',
  'CityDeadOutfitLeftForeArm', 'CityDeadOutfitRightForeArm',
  'CityDeadOutfitLeftHand', 'CityDeadOutfitRightHand',
  'CityDeadOutfitHips', 'CityDeadOutfitSpine2',
  'CityDeadOutfitLeftFoot', 'CityDeadOutfitRightFoot',
  'CityDeadOutfitLeftToeBase', 'CityDeadOutfitRightToeBase',
];

// 墙的内表面（墙中心 ±0.06）再往里让 0.12 米，给骨头和肉之间的厚度留余量
const ZB_WALL_MARGIN = 0.12;
const ZB_CORRIDOR = {
  minX: -9.94 + ZB_WALL_MARGIN, maxX: 9.94 - ZB_WALL_MARGIN,
  minZ: 2.46 + ZB_WALL_MARGIN,  maxZ: 4.74 - ZB_WALL_MARGIN,
};
const ZB_ROOM = {
  minX: -2.94 + ZB_WALL_MARGIN, maxX: 2.94 - ZB_WALL_MARGIN,
  minZ: -2.34 + ZB_WALL_MARGIN, maxZ: 2.34 - ZB_WALL_MARGIN,
};
const ZB_DOOR_HALF = 0.60;

const _zbBone = new THREE.Vector3();

function clampZombieBody(zb) {
  const m = zb.mesh;
  const inCorridor = m.position.z >= 2.40;
  // 大块头身子比普通丧尸厚一圈，骨头得离墙再远一点，不然肩膀会陷进墙里
  const pad = zb.wallPad || 0;
  const R0 = inCorridor ? ZB_CORRIDOR : ZB_ROOM;
  const R = pad
    ? { minX: R0.minX + pad, maxX: R0.maxX - pad, minZ: R0.minZ + pad, maxZ: R0.maxZ - pad }
    : R0;
  const doorPassable = doorOpen > 0.5;
  // 正在门洞里走（身子横跨门框）：这一段两边都不算墙，
  // 不然「身体比门洞宽」会被两边同时顶住，卡在门口反复弹
  // 这里只看「身子有没有横跨门洞」，跟胖瘦无关，所以不扣 pad
  const bodyInDoorway = doorPassable && Math.abs(m.position.x) < 0.50 &&
                        m.position.z > 2.05 && m.position.z < 2.90;

  for (let pass = 0; pass < 2; pass++) {
    m.updateMatrixWorld(true);

    let needPX = 0, needNX = 0, needPZ = 0, needNZ = 0;
    for (const bone of zb.bodyBones) {
      bone.getWorldPosition(_zbBone);
      const x = _zbBone.x, z = _zbBone.z;

      let dx = 0, dz = 0;
      if (x < R.minX) dx = R.minX - x;
      else if (x > R.maxX) dx = R.maxX - x;
      // 门开着时，门洞那一竖条允许身体探出去（进出房间）
      const inDoorway = bodyInDoorway ||
        (doorPassable && Math.abs(x) < ZB_DOOR_HALF - 0.10 - pad);
      if (inCorridor) {
        if (!inDoorway && z < R.minZ) dz = R.minZ - z;
        else if (z > R.maxZ) dz = R.maxZ - z;
      } else {
        if (z < R.minZ) dz = R.minZ - z;
        else if (!inDoorway && z > R.maxZ) dz = R.maxZ - z;
      }
      if (dx > needPX) needPX = dx;
      if (dx < needNX) needNX = dx;
      if (dz > needPZ) needPZ = dz;
      if (dz < needNZ) needNZ = dz;
    }

    if (!needPX && !needNX && !needPZ && !needNZ) break;

    // 两个方向都被顶住时（身体比屋子还长），挑挪动小的那边
    const mx = (needPX > 0 && needNX < 0)
      ? (Math.abs(needPX) <= Math.abs(needNX) ? needPX : needNX)
      : (needPX || needNX);
    const mz = (needPZ > 0 && needNZ < 0)
      ? (Math.abs(needPZ) <= Math.abs(needNZ) ? needPZ : needNZ)
      : (needPZ || needNZ);
    m.position.x += mx;
    m.position.z += mz;
  }
}
// 攻击动画里「真正打到人」的时刻（秒），以及动作何时结束
const ZOMBIE_ATTACK = {
  Punch:  { hit: 1.10, end: 2.50 },   // 抡胳膊
  Punch2: { hit: 1.70, end: 2.20 },   // 低头扑咬
};
// 新模型的动作长度不一样，打到人的时间点要单独给
// 出拳动画有多长，就按多长算：打中的那一下（hit）和收招（end）都写死在片长之内
const GIANT_ATTACK = {
  Punch:  { hit: 0.90, end: 1.92 },   // 右直拳（原片 1.96 秒，动作最大）
  Punch2: { hit: 0.50, end: 1.05 },   // 左横扫（原片 1.08 秒，快）
};
const MONSTER_ATTACK = {
  Punch:  { hit: 0.32, end: 0.70 },   // 人形怪没有出拳动画，用 Run 顶上，一拍一抓
  Punch2: { hit: 0.32, end: 0.70 },
};
const _hitPoint = new THREE.Vector3();

function killZombie(zb) {
  if (!zb.alive) return;
  zb.alive = false;
  zb.attackT = -1;
  zb.hitT = 0;
  // 正趴在玩家身上的那只被打死 / 炸死：先把玩家放开，再倒地
  if (zb.pin) {
    zb.pin = false;
    if (pinnedBy === zb) { pinnedBy = null; pinT = 0; pinPress = 0; }
  }
  // 空中被击落：不要留一具悬空的尸体
  if (zb.leapT >= 0) {
    zb.leapT = -1;
    zb.state = 'walk';
    zb.mesh.position.y = 0;
    zb.mesh.rotation.x = 0;
  }
  setZAnim(zb, 'Death', 0.07);
  _sfxPos.copy(zb.mesh.position);
  _sfxPos.y = 1.30;
  // 大块头倒下时吼得更闷、更低沉
  sfxAt('growl3', _sfxPos, {
    rate: (zb.brute ? 0.44 : 0.60) + Math.random() * 0.12,
    volume: zb.brute ? 1.0 : 0.90,
  });

  // 尸体太多时，最老的一具立刻消失，省得地面上堆几十具拖慢机器
  let deadN = 0, oldest = null;
  for (const z of zombies) {
    if (z.alive) continue;
    deadN++;
    if (!oldest || z.deathT > oldest.deathT) oldest = z;
  }
  if (deadN > MAX_CORPSE && oldest && oldest !== zb) oldest.deathT = CORPSE_LIFE;
}

// 打中丧尸：伤害由武器决定（AK/M4 身体 1、爆头 ×2；霰弹枪每颗弹丸 0.55）
function hitZombie(zb, point, isHead, dmg = 1, d, dir) {
  if (!zb.alive) return;
  zb.hp -= dmg;

  _sfxPos.copy(zb.mesh.position);
  _sfxPos.y = 1.30;

  if (zb.hp <= 0) {
    // 爆炸者一死就炸，别给玩家「站脸上打爆」的机会
    if (zb.bloater && !zb.exploded) { explodeBloater(zb); return; }
    // 倒下那一下喷得更凶；大块头血量厚，血更多
    spawnBlood(point, dir, (isHead ? 2.2 : 1.5) * (zb.brute ? 1.8 : 1));
    killZombie(zb);
    return;
  }
  sfxAt(isHead ? 'bite' : 'growl3', _sfxPos, {
    rate: (zb.brute ? 0.82 : 1.02) + Math.random() * 0.18,
    volume: isHead ? 0.55 : 0.42,
  });
  // 大块头皮厚：多数子弹打不出硬直，只有约三成会踉跄一下
  if (zb.attackT < 0 && !(zb.brute && Math.random() < 0.70)) {
    zb.hitT = 1.2;
    setZAnim(zb, 'HitReact', 0.05);
  }
}

/* ── 血花：血滴 + 血雾 + 地上血渍 + 击中亮斑 ──────────────────────
   一团「柔边圆斑」贴图，血雾、地上的血渍、击中亮斑都用它，省得加载图片 */
const blobTex = (() => {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(32, 32, 1, 32, 32, 31);
  grd.addColorStop(0, 'rgba(255,255,255,1)');
  grd.addColorStop(0.40, 'rgba(255,255,255,0.82)');
  grd.addColorStop(0.72, 'rgba(255,255,255,0.28)');
  grd.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
})();

const bloodGeo = new THREE.SphereGeometry(1, 6, 5);      // 半径 1 的球，用缩放做大小/拉长的血滴
const bloodShades = [0x5c0b06, 0x7d130c, 0x9a1d13, 0xb02a1c].map(
  (c) => new THREE.MeshBasicMaterial({ color: c })
);
// 爆炸者的脓液：同一套粒子，只把颜色换成黄绿
const bileShades = [0x54610f, 0x6f7d16, 0x8a9a24, 0xa7b23a].map(
  (c) => new THREE.MeshBasicMaterial({ color: c })
);
const splatGeo = new THREE.PlaneGeometry(1, 1);
const bloodBits = [];       // 飞出去的血滴
const bloodMist = [];       // 血雾（柔边贴图，几帧内胀大淡出）
const bloodSplats = [];     // 落在地上的血渍
const bloodFlashes = [];    // 打中那一下的亮斑
const BLOOD_MAX = 460;
const MIST_MAX = 60;
const SPLAT_MAX = 70;
const _UP = new THREE.Vector3(0, 1, 0);
const _blV = new THREE.Vector3();

// 地上留一块血渍（最多 70 块，满了就把最老的清掉）
function spawnSplat(x, z, size) {
  if (bloodSplats.length >= SPLAT_MAX) {
    const old = bloodSplats.shift();
    scene.remove(old.mesh);
    old.mat.dispose();
  }
  const mat = new THREE.MeshBasicMaterial({
    map: blobTex, color: 0x6d0f0a, transparent: true, opacity: 0.82,
    depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2,
  });
  const m = new THREE.Mesh(splatGeo, mat);
  m.rotation.x = -Math.PI / 2;
  m.rotation.z = Math.random() * Math.PI * 2;
  m.position.set(x, 0.006 + Math.random() * 0.002, z);
  m.scale.set(size * (0.8 + Math.random() * 0.6), size * (0.8 + Math.random() * 0.6), 1);
  scene.add(m);
  bloodSplats.push({ mesh: m, mat, life: 16 + Math.random() * 12, maxLife: 28 });
}

// dir = 子弹飞过去的方向；power 越大喷得越凶（爆头/击杀时加大）
function spawnBlood(point, dir, power = 1, palette = null) {
  const n = (dir ? dir.clone() : new THREE.Vector3(0, 1, 0)).normalize();
  const shades = palette || bloodShades;

  // ① 血滴：沿子弹方向喷出一个锥，一部分是拉长的血线
  const count = Math.round(15 * power);
  for (let i = 0; i < count && bloodBits.length < BLOOD_MAX; i++) {
    const b = new THREE.Mesh(bloodGeo, shades[(Math.random() * shades.length) | 0]);
    b.position.copy(point);
    b.position.x += (Math.random() - 0.5) * 0.07;
    b.position.y += (Math.random() - 0.5) * 0.07;
    b.position.z += (Math.random() - 0.5) * 0.07;

    const sp = 1.0 + Math.random() * 2.8;
    b.userData.v = n.clone().multiplyScalar(sp);
    b.userData.v.x += (Math.random() - 0.5) * 1.7;
    b.userData.v.y += (Math.random() - 0.5) * 1.5 + 1.0 + Math.random() * 1.6;
    b.userData.v.z += (Math.random() - 0.5) * 1.7;

    const drop = Math.random() < 0.55;           // 一半是长条血线，一半是小血珠
    const s = 0.011 + Math.random() * 0.015;
    b.scale.set(s * (drop ? 0.72 : 1), s * (drop ? 2.6 : 1), s * (drop ? 0.72 : 1));
    b.userData.drop = drop;
    b.userData.life = 0.7 + Math.random() * 0.7;
    scene.add(b);
    bloodBits.push(b);
  }

  // ② 血雾：贴着伤口的两团柔边贴图，0.4 秒内胀到三倍大、淡出
  for (let i = 0; i < 2 && bloodMist.length < MIST_MAX; i++) {
    const mat = new THREE.SpriteMaterial({
      map: blobTex, color: palette ? (i ? 0x8a9a24 : 0x6f7d16) : (i ? 0xa8231a : 0x7d130c),
      transparent: true, depthWrite: false, opacity: 0.42 + Math.random() * 0.18,
    });
    const sp = new THREE.Sprite(mat);
    sp.position.copy(point).addScaledVector(n, 0.03 + Math.random() * 0.10);
    sp.position.y += (Math.random() - 0.5) * 0.06;
    const s0 = 0.10 + Math.random() * 0.10;
    sp.scale.setScalar(s0);
    sp.userData = {
      s0,
      v: n.clone().multiplyScalar(0.45 + Math.random() * 0.9),
      life: 0.42, maxLife: 0.42,
    };
    scene.add(sp);
    bloodMist.push(sp);
  }

  // ③ 击中那一瞬间的亮斑：一闪就没，让「打中了」有回馈
  {
    const mat = new THREE.SpriteMaterial({
      map: blobTex, color: 0xffd9b0, transparent: true,
      depthWrite: false, opacity: 0.9, blending: THREE.AdditiveBlending,
    });
    const sp = new THREE.Sprite(mat);
    sp.position.copy(point);
    sp.scale.setScalar(0.14 + Math.random() * 0.08);
    sp.userData = { life: 0.07 };
    scene.add(sp);
    bloodFlashes.push(sp);
  }
}

function updateBlood(dt) {
  // 血滴
  for (let i = bloodBits.length - 1; i >= 0; i--) {
    const b = bloodBits[i];
    b.userData.life -= dt;
    const v = b.userData.v;
    v.y -= 9.5 * dt;
    b.position.addScaledVector(v, dt);
    if (b.userData.drop) {                    // 长条血线始终朝着速度方向
      b.quaternion.setFromUnitVectors(_UP, _blV.copy(v).normalize());
    }
    if (b.userData.life <= 0 || b.position.y < 0.012) {
      // 落地：有一半几率在地上留一块血渍
      if (b.position.y < 0.012 && Math.random() < 0.5) {
        spawnSplat(b.position.x, b.position.z, 0.05 + Math.random() * 0.10);
      }
      scene.remove(b);
      bloodBits.splice(i, 1);
    }
  }

  // 血雾
  for (let i = bloodMist.length - 1; i >= 0; i--) {
    const sp = bloodMist[i];
    const u = sp.userData;
    u.life -= dt;
    if (u.life <= 0) {
      scene.remove(sp);
      sp.material.dispose();
      bloodMist.splice(i, 1);
      continue;
    }
    const k = 1 - u.life / u.maxLife;         // 0 → 1
    sp.position.addScaledVector(u.v, dt);
    u.v.multiplyScalar(1 - Math.min(1, dt * 3.5));
    sp.scale.setScalar(u.s0 * (1 + k * 2.2));
    sp.material.opacity = (1 - k) * 0.55;
  }

  // 击中亮斑
  for (let i = bloodFlashes.length - 1; i >= 0; i--) {
    const sp = bloodFlashes[i];
    sp.userData.life -= dt;
    if (sp.userData.life <= 0) {
      scene.remove(sp);
      sp.material.dispose();
      bloodFlashes.splice(i, 1);
      continue;
    }
    sp.material.opacity = sp.userData.life / 0.07;
  }

  // 地上血渍：慢慢淡掉
  for (let i = bloodSplats.length - 1; i >= 0; i--) {
    const s = bloodSplats[i];
    s.life -= dt;
    if (s.life <= 0) {
      scene.remove(s.mesh);
      s.mat.dispose();
      bloodSplats.splice(i, 1);
      continue;
    }
    if (s.life < 4) s.mat.opacity = 0.82 * (s.life / 4);
  }
}

/* ── 弹药 / 换弹 ─────────────────────────────────────────────── */
let reloading = false;
let reloadT = 0;            // 这次换弹已经进行了几秒
let reloadDropped = false;  // 旧弹匣是否已经甩出去了
let reloadSeated = false;   // 新弹匣是否已经拍进弹匣井（霰弹枪：已经装进一发）
let pendingMagDrop = false; // 待生成「掉在地上的弹匣」（等枪的姿态算好之后再生成）
let reloadPoseNow = { tilt: 0 };  // 每帧算出的换弹姿态，给枪的倾斜用
let reloadHandWeight = 0;         // 左手离开护木的程度（0~1），第一人称和镜子共用
let shellTimer = 0;               // 霰弹枪：这一发装填走了多久
let shellSeated = false;          // 霰弹枪：这一发是否已经压进弹仓

// 左手相对「护木握点」的位移（米，枪本地坐标）。第一人称和镜子都靠它摆左手。
const reloadHandOff = new THREE.Vector3();
const _reloadSW = new THREE.Vector3();   // 换算世界空间时的临时量
const _reloadLTmp = new THREE.Vector3(); // 镜子里左手的临时目标点

let fpMag = null;           // 第一人称枪上的弹匣节点 { node, mesh, base }
let mirMag = null;          // 镜子里那把枪的弹匣节点 { node, base }

const droppedMags = [];     // 掉在地上的弹匣
const MAX_DROPPED_MAGS = 10;
const MAG_DROP_OUT = 0.62;  // 弹匣往下拔出的距离（枪模型本地单位）

const sstep = (a, b, x) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

let vaseBroken = false;
let mouseDown = false;
let fireCooldown = 0;
let gunKick = 0;
let bobT = 0;
let flashTime = 0;
let shardLife = 0;
// 霰弹枪泵动：开一枪 → 稍等 → 护木往后拉到底 → 再推回去 → 才能打下一发
const PUMP_TIME = 0.62;       // 一次泵动总时长（秒）
const PUMP_TRAVEL = 0.16;     // 护木后拉距离（模型单位，缩放后约 7 厘米）
let pumpWait = 0;             // 开枪后到开始泵动的短暂等待
let pumpT = 0;                // 泵动剩余时间

const _pumpQ = new THREE.Quaternion(), _pumpQ2 = new THREE.Quaternion();
const _pumpS = new THREE.Vector3(), _pumpS2 = new THREE.Vector3();
const _pumpDelta = new THREE.Vector3(), _pumpLocal = new THREE.Vector3();
const _pumpTmp = new THREE.Vector3();

function pumpCurve(u) {
  if (u <= 0 || u >= 1) return 0;
  if (u < 0.34) return sstep(0, 0.34, u);      // 往后拉
  if (u < 0.44) return 1;                      // 拉到底停一下
  return 1 - sstep(0.44, 0.92, u);             // 推回去
}

// k=0 静止，k=1 护木拉到底：只摆护木本身，左臂交给 applyLeftArmPose 统一处理
function applyPumpPose(def, k) {
  if (!def) return;
  const d = PUMP_TRAVEL * k;
  if (def.pumpRec) def.pumpRec.node.position.z = def.pumpRec.base.z + d;
  if (def.mirPumpRec) def.mirPumpRec.node.position.z = def.mirPumpRec.base.z + d;
}

// 第一人称左臂：泵动（护木后拉）+ 换弹（手离开护木去摸弹匣）合成一个世界位移，
// 再原样加到前臂骨和手骨上（肘部在画面外，平移看不出来）
function applyLeftArmPose(def, pumpK) {
  if (!def || !def.pumpBones || !def.pumpBones.length) return;

  _reloadSW.set(0, 0, 0);

  if (pumpK > 1e-5 && def.pumpRec) {
    def.fp.updateMatrixWorld(true);
    const pp = def.pumpRec.node.parent;
    pp.matrixWorld.decompose(_pumpTmp, _pumpQ, _pumpS);
    _pumpDelta.set(0, 0, PUMP_TRAVEL * pumpK).multiply(_pumpS).applyQuaternion(_pumpQ);
    _reloadSW.add(_pumpDelta);
  }

  // 换弹位移是按「枪本地」算的，先转到相机（fp 组）朝向，再进世界空间
  if (reloadHandWeight > 0.001) {
    def.fp.updateMatrixWorld(true);
    def.fp.getWorldQuaternion(_pumpQ2);
    _pumpDelta.copy(reloadHandOff).applyQuaternion(_pumpQ2);
    _reloadSW.add(_pumpDelta);
  }

  if (_reloadSW.lengthSq() < 1e-10) {
    if (def.pumpApplied) {
      for (const b of def.pumpBones) b.bone.position.copy(b.base);
      def.pumpApplied = false;
    }
    return;
  }
  def.pumpApplied = true;

  def.fp.updateMatrixWorld(true);
  for (const b of def.pumpBones) {
    const bp = b.bone.parent;
    bp.matrixWorld.decompose(_pumpTmp, _pumpQ2, _pumpS2);
    _pumpLocal.copy(_reloadSW).applyQuaternion(_pumpQ2.invert());
    _pumpLocal.x /= _pumpS2.x;
    _pumpLocal.y /= _pumpS2.y;
    _pumpLocal.z /= _pumpS2.z;
    b.bone.position.copy(b.base).add(_pumpLocal);
  }
}

/* ── 换弹时左手往哪走（都是相对护木握点的米数，枪本地坐标）──────
   步枪：护木 → 弹匣井 → 握着旧匣往下拔 → 弹袋 → 握着新匣推回井里 → 回护木
   霰弹枪：护木 → 装填口下面 → 往上顶一发 → 回护木
   ─────────────────────────────────────────────────────────── */
const RIFLE_MW_FALLBACK = { x: 0.027, y: -0.022, z: 0.136 };  // 读不到弹匣井时的保底值（AK）
const RIFLE_POUCH = { x: 0.055, y: -0.320, z: 0.150 };   // 弹袋（画面下方）
const SG_PORT = { x: 0.034, y: -0.082, z: 0.115 };       // 装填口下沿（枪身底板外面）

// 当前这一帧「弹匣握点」在哪（相对护木握点，米，枪本地）。
// 直接读弹匣节点的当前位置，所以拔匣、推匣、拍一下都自动对上，三把枪也不用分别调。
const _magWorld = new THREE.Vector3();
const _magCapture = new THREE.Vector3();
const _magOffNow = new THREE.Vector3();
function currentMagGripOff(rt, out) {
  if (!rt || !rt.root) return out.copy(RIFLE_MW_FALLBACK);
  const node = rt.magGrip || (rt.magRec && rt.magRec.node);
  if (!node) return out.copy(RIFLE_MW_FALLBACK);
  rt.root.updateMatrixWorld(true);
  node.getWorldPosition(_magWorld);   // 顺带刷新父链矩阵
  _magCapture.copy(_magWorld);
  rt.root.worldToLocal(_magCapture);
  _magCapture.multiplyScalar(0.45);   // 模型单位 → 米（和 captureGripFrames 同一空间）
  return out.copy(_magCapture).sub(HOLD.gripL);
}

function rifleHandOff(u, out) {
  const rt = curWeapon().rt;
  // 弹匣握点这一帧的位置（弹匣藏在井里时，它会停在拔出/未插入的位置）
  currentMagGripOff(rt, _magOffNow);

  // 0~0.131 伸手到弹匣井
  if (u < 0.131) {
    out.copy(_magOffNow).multiplyScalar(sstep(0, 0.131, u));
    return;
  }
  // 0.131~0.240 握着旧弹匣一起往下拔（完全跟着弹匣走）
  if (u < 0.240) {
    out.copy(_magOffNow);
    return;
  }
  // 0.240~0.340 松手，往下摸弹袋
  if (u < 0.340) {
    const k = sstep(0.240, 0.340, u);
    out.set(
      _magOffNow.x + (RIFLE_POUCH.x - _magOffNow.x) * k,
      _magOffNow.y + (RIFLE_POUCH.y - _magOffNow.y) * k,
      _magOffNow.z + (RIFLE_POUCH.z - _magOffNow.z) * k
    );
    return;
  }
  // 0.340~0.440 在袋里抓弹匣（小幅晃一下）
  if (u < 0.440) {
    out.set(RIFLE_POUCH.x, RIFLE_POUCH.y, RIFLE_POUCH.z);
    out.y += Math.sin((u - 0.340) / 0.100 * Math.PI) * 0.018;
    return;
  }
  // 0.440~0.500 带着新弹匣回到弹匣井下面
  if (u < 0.500) {
    const k = sstep(0.440, 0.500, u);
    out.set(
      RIFLE_POUCH.x + (_magOffNow.x - RIFLE_POUCH.x) * k,
      RIFLE_POUCH.y + (_magOffNow.y - RIFLE_POUCH.y) * k,
      RIFLE_POUCH.z + (_magOffNow.z - RIFLE_POUCH.z) * k
    );
    return;
  }
  // 0.500~0.800 握着新弹匣推进井里，拍一下（照样跟着弹匣走）
  if (u < 0.800) {
    out.copy(_magOffNow);
    return;
  }
  // 0.800~0.940 回护木
  const k = sstep(0.800, 0.940, u);
  out.copy(_magOffNow).multiplyScalar(1 - k);
}

function shotgunHandOff(p, out) {
  // 0~0.24 从护木挪到装填口下面
  if (p < 0.24) {
    const k = sstep(0, 0.24, p);
    out.set(SG_PORT.x * k, (SG_PORT.y - 0.020) * k, SG_PORT.z * k);
    return;
  }
  // 0.24~0.42 把这一发顶上装填口
  if (p < 0.42) {
    const k = sstep(0.24, 0.42, p);
    out.set(SG_PORT.x, SG_PORT.y - 0.020 * (1 - k), SG_PORT.z);
    return;
  }
  // 0.42~0.78 顶住，等弹塞进去
  if (p < 0.78) {
    out.set(SG_PORT.x, SG_PORT.y, SG_PORT.z);
    if (p < 0.62) out.y += Math.sin((p - 0.42) / 0.20 * Math.PI) * 0.014;
    return;
  }
  // 0.78~0.97 回护木，准备下一发
  const k = sstep(0.78, 0.97, p);
  out.set(SG_PORT.x * (1 - k), SG_PORT.y * (1 - k), SG_PORT.z * (1 - k));
}

/* ── 霰弹枪的单发弹壳：从左手送到装填口，再压进枪身 ───────────── */
const SG_HOLD = { x: 0.006, y: -0.012, z: 0.010 };   // 出现在左手里（护木附近），跟着手走
const SG_IN = { x: 0.034, y: -0.030, z: 0.115 };     // 压进枪身里的位置

const shellBodyGeo = new THREE.CylinderGeometry(0.0105, 0.0105, 0.050, 12);
const shellHeadGeo = new THREE.CylinderGeometry(0.0115, 0.0115, 0.018, 12);
const shellBodyMat = new THREE.MeshStandardMaterial({ color: 0xb02a1e, roughness: 0.55, metalness: 0.05 });
const shellHeadMat = new THREE.MeshStandardMaterial({ color: 0xc9a227, roughness: 0.35, metalness: 0.65 });

function makeShell(layer) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(shellBodyGeo, shellBodyMat);
  body.position.y = 0.000;
  const head = new THREE.Mesh(shellHeadGeo, shellHeadMat);
  head.position.y = 0.032;
  for (const m of [body, head]) {
    m.layers.set(layer);
    m.castShadow = false;
    m.receiveShadow = false;
    g.add(m);
  }
  g.visible = false;
  return g;
}

// 第一次装填时再造弹壳：第一人称一份、镜子里一份
function ensureShells(def) {
  if (!def || !def.rt) return null;
  if (def.rt.shells) return def.rt.shells;
  const fpShell = makeShell(LAYER_VIEWMODEL);
  const mirShell = makeShell(LAYER_PLAYER);
  def.rt.fp.add(fpShell);
  def.rt.mirror.add(mirShell);
  def.rt.shells = [fpShell, mirShell];
  return def.rt.shells;
}

function hideShells() {
  for (const k of WEAPON_ORDER) {
    const rt = WEAPONS[k].rt;
    if (!rt || !rt.shells) continue;
    for (const s of rt.shells) s.visible = false;
  }
}

// p = 这一发的进度 0~1：0.06 出现在手里 → 0.40 到装填口 → 0.62 压进枪身
function updateShell(def, p) {
  const shells = ensureShells(def);
  const gl = HOLD.gripL;
  if (!shells || !gl) return;

  if (p < 0.06 || p >= 0.62) {
    shells[0].visible = false;
    shells[1].visible = false;
    return;
  }

  let x, y, z, rx, rz;
  if (p < 0.40) {
    const k = sstep(0.06, 0.40, p);
    x = SG_HOLD.x + (SG_PORT.x - SG_HOLD.x) * k;
    y = SG_HOLD.y + (SG_PORT.y - SG_HOLD.y) * k;
    z = SG_HOLD.z + (SG_PORT.z - SG_HOLD.z) * k;
    rx = 0.55 + (0.15 - 0.55) * k;
    rz = 0.45 + (0.05 - 0.45) * k;
  } else {
    const k = sstep(0.40, 0.62, p);
    x = SG_PORT.x;
    z = SG_PORT.z;
    y = SG_PORT.y + (SG_IN.y - SG_PORT.y) * k;
    rx = 0.15 * (1 - k);
    rz = 0.05 * (1 - k);
  }

  for (const s of shells) {
    s.visible = true;
    s.position.set(gl.x + x, gl.y + y, gl.z + z);
    s.rotation.set(rx, -0.25 * (1 - Math.min(1, (p - 0.06) / 0.34)), rz);
  }
}

function resetPumpState() {
  pumpWait = 0;
  pumpT = 0;
  reloadHandWeight = 0;
  reloadHandOff.set(0, 0, 0);
  hideShells();
  for (const k of WEAPON_ORDER) {
    const d = WEAPONS[k];
    if (d.rt) {
      applyPumpPose(d.rt, 0);
      applyLeftArmPose(d.rt, 0);
    }
  }
}

const shards = [];
const shardGeo = new THREE.BoxGeometry(0.055, 0.055, 0.008);
const shardMat = new THREE.MeshStandardMaterial({
  color: 0x8fa2a4, roughness: 0.45, metalness: 0.05, transparent: true, opacity: 1,
});

const holes = [];
const holeGeo = new THREE.CircleGeometry(0.022, 10);
const holeMat = new THREE.MeshBasicMaterial({ color: 0x140f0a, side: THREE.DoubleSide });

const ammoEl = document.getElementById('ammo');

function updateAmmoUI() {
  const d = curWeapon();
  let hint = '';
  if (reloading) hint = d.mode === 'shell' ? '  ·  装填中…' : '  ·  换弹中…';
  else if (d.ammo === 0 && d.reserve === 0) hint = '  ·  没子弹了，按 T 重来';
  else if (d.ammo === 0) hint = '  ·  按 R 换弹';
  ammoEl.textContent = `${d.name}   ${d.ammo} / ${d.magSize}   ·   备弹 ${d.reserve}${hint}`;
  ammoEl.classList.toggle('empty', d.ammo === 0);
}

/* ── 整匣换弹：时间轴（按归一化进度 u 算，换枪时只需改总时长）─────
   0.000~0.115  枪往右一歪（弹匣井甩到左边，正对左手）
   0.131~0.238  旧弹匣被甩出去（0.231 时变成地上的实体弹匣）
   0.238~0.500  空井（左手在镜子里下去摸新弹匣）
   0.500~0.723  新弹匣从下面推进弹匣井
   0.715        拍进去 —— 弹药补满，备弹扣掉
   0.723~0.800  拍一下的小回弹
   0.800~0.954  枪回正
   ─────────────────────────────────────────────────────────── */
function reloadPose(u) {
  const tilt = Math.min(sstep(0, 0.115, u), 1 - sstep(0.800, 0.954, u));
  return {
    tilt,
    out: sstep(0.131, 0.238, u),    // 旧弹匣拔出的进度
    inQ: sstep(0.500, 0.723, u),    // 新弹匣推入的进度
  };
}

// 把弹匣节点摆到换弹时间轴对应的位置（枪模型本地坐标）
function setMagPose(rec, u) {
  if (!rec) return;
  const { node, base } = rec;

  if (u < 0.131) {
    node.visible = true;
    node.position.copy(base);
    node.rotation.set(0, 0, 0);
    return;
  }

  if (u < 0.238) {
    // 旧弹匣：往下、往后滑出弹匣井，同时向前歪
    const k = reloadPose(u).out;
    node.visible = true;
    node.position.set(base.x, base.y - MAG_DROP_OUT * k, base.z + 0.10 * k);
    node.rotation.set(0.55 * k, 0, 0);
    return;
  }

  if (u < 0.500) {
    node.visible = false;          // 弹匣井空了
    return;
  }

  // 新弹匣：从下面推上来，到位后轻轻拍一下
  const k = reloadPose(u).inQ;
  const bump = u > 0.723 ? Math.sin(Math.min(1, (u - 0.723) / 0.077) * Math.PI) * 0.055 : 0;
  node.visible = true;
  node.position.set(base.x, base.y - MAG_DROP_OUT * (1 - k) + bump, base.z + 0.10 * (1 - k));
  node.rotation.set(0.55 * (1 - k), 0, 0);
}

// 把枪上的弹匣节点恢复原状（换枪 / 重来时用）
function cancelReload() {
  reloading = false;
  reloadT = 0;
  shellTimer = 0;
  shellSeated = false;
  reloadPoseNow = { tilt: 0 };
  reloadHandWeight = 0;
  reloadHandOff.set(0, 0, 0);
  reloadDropped = false;
  reloadSeated = false;
  pendingMagDrop = false;
  for (const rec of [fpMag, mirMag]) {
    if (!rec) continue;
    rec.node.position.copy(rec.base);
    rec.node.rotation.set(0, 0, 0);
    rec.node.visible = true;
  }
  hideShells();
}

function startReload() {
  if (gameOver || reloading) return;
  const d = curWeapon();
  if (d.ammo >= d.magSize) return;      // 满弹匣不用换
  if (d.reserve <= 0) { updateAmmoUI(); return; }

  reloading = true;
  reloadT = 0;
  shellTimer = 0;
  shellSeated = false;
  reloadDropped = false;
  reloadSeated = false;
  pendingMagDrop = false;
  if (fpMag) fpMag.node.visible = true;
  if (mirMag) mirMag.node.visible = true;

  // 换弹音效：整匣的是「拔匣-插匣」，霰弹枪是「塞一发」
  if (d.mode === 'shell') {
    if (d.reloadSfx) sfx(d.reloadSfx, { rate: 1.55, volume: 0.40 });
  } else if (d.reloadSfx) {
    sfx(d.reloadSfx, { volume: 0.75 });
  }
  updateAmmoUI();
}

// 每帧推进换弹；姿态写到 reloadPoseNow / reloadHandOff 给枪和手臂用
function updateReload(dt) {
  reloadPoseNow = { tilt: 0 };
  reloadHandWeight = 0;
  reloadHandOff.set(0, 0, 0);

  if (!reloading) { hideShells(); return; }
  const d = curWeapon();

  /* ── 霰弹枪：一发一发往里塞，打空几发就补几发 ── */
  if (d.mode === 'shell') {
    reloadT += dt;
    shellTimer += dt;
    const p = Math.min(1, shellTimer / d.reloadTime);   // 这一发的进度
    let tiltK = Math.min(1, reloadT / 0.18) * 0.55;
    // 最后一发：手往回走的时候枪也慢慢摆正，别到收尾时「啪」一下弹回去
    if (shellSeated && (d.ammo >= d.magSize || d.reserve <= 0)) {
      tiltK *= 1 - sstep(0.62, 0.97, p);
    }
    reloadPoseNow = { tilt: tiltK };
    shotgunHandOff(p, reloadHandOff);
    reloadHandWeight = 1;
    updateShell(d, p);

    // 0.62 处弹壳压进枪身：这时候才加子弹、响「咔哒」
    if (!shellSeated && p >= 0.62) {
      shellSeated = true;
      if (d.reserve > 0 && d.ammo < d.magSize) {
        d.ammo++;
        d.reserve--;
        sfx('shotgun_pump', { rate: 1.45 + Math.random() * 0.2, volume: 0.38 });
        updateAmmoUI();
      }
    }

    // 这一发走完：手已回到护木；打满或没备弹就收工
    if (p >= 1) {
      shellTimer = 0;
      shellSeated = false;
      if (d.ammo >= d.magSize || d.reserve <= 0) {
        reloading = false;
        reloadT = 0;
        reloadHandWeight = 0;
        reloadHandOff.set(0, 0, 0);
        hideShells();
        updateAmmoUI();
      }
    }
    return;
  }

  /* ── 步枪：整匣换弹 ── */
  const dur = d.reloadTime;
  reloadT += dt;

  if (reloadT >= dur) {
    reloading = false;
    reloadT = dur;
    reloadPoseNow = { tilt: 0 };
    reloadHandWeight = 0;
    reloadHandOff.set(0, 0, 0);
    for (const rec of [fpMag, mirMag]) {
      if (!rec) continue;
      rec.node.position.copy(rec.base);
      rec.node.rotation.set(0, 0, 0);
      rec.node.visible = true;
    }
    // 补满弹匣：从备弹里扣
    if (!reloadSeated) {
      reloadSeated = true;
      const need = d.magSize - d.ammo;
      const take = Math.min(need, d.reserve);
      d.ammo += take;
      d.reserve -= take;
    }
    updateAmmoUI();
    return;
  }

  const u = reloadT / dur;
  reloadPoseNow = reloadPose(u);
  setMagPose(fpMag, u);
  setMagPose(mirMag, u);

  // 第一人称和镜子里共用同一条左手路线
  rifleHandOff(u, reloadHandOff);
  reloadHandWeight = 1;

  if (!reloadDropped && u >= 0.231) {
    reloadDropped = true;
    pendingMagDrop = true;      // 等这一帧枪的姿态摆好，再生成地上的弹匣
  }

  if (!reloadSeated && u >= 0.715) {
    reloadSeated = true;
    const need = d.magSize - d.ammo;
    const take = Math.min(need, d.reserve);
    d.ammo += take;
    d.reserve -= take;
    sfx('reload_rifle', { rate: 1.25, volume: 0.5 });   // 拍弹匣的那一下
    updateAmmoUI();
  }
}
/* ── 掉在地上的弹匣：重力 + 旋转 + 落地弹跳，最后躺平 ────────── */
function spawnDroppedMag() {
  if (!fpMag || !fpMag.mesh) return;

  const src = fpMag.mesh;
  src.updateWorldMatrix(true, false);

  const m = new THREE.Mesh(src.geometry, src.material);
  src.matrixWorld.decompose(m.position, m.quaternion, m.scale);
  m.castShadow = false;
  m.receiveShadow = false;

  // 初速度：往下掉，往右手外侧甩一点
  const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
  m.userData.v = new THREE.Vector3(0, -1.25, 0).addScaledVector(right, 0.24);
  m.userData.w = new THREE.Vector3(
    (Math.random() - 0.5) * 9,
    -2 - Math.random() * 5,
    (Math.random() - 0.5) * 9
  );
  m.userData.state = 'fall';
  m.userData.settleT = 0;
  m.userData.flatQ = null;

  scene.add(m);
  droppedMags.push(m);
  if (droppedMags.length > MAX_DROPPED_MAGS) {
    scene.remove(droppedMags.shift());
  }
}

const _magCorner = new THREE.Vector3();
const _magAxis = new THREE.Vector3();
const _magQ = new THREE.Quaternion();
const _magMinY = { y: 0 };

// 用包围盒 8 个角算最低点，返回「穿进地面多少」
function magLowestPoint(m) {
  const bb = m.geometry.boundingBox || (m.geometry.computeBoundingBox(), m.geometry.boundingBox);
  let minY = Infinity;
  for (let i = 0; i < 8; i++) {
    _magCorner.set(
      (i & 1) ? bb.max.x : bb.min.x,
      (i & 2) ? bb.max.y : bb.min.y,
      (i & 4) ? bb.max.z : bb.min.z
    ).applyMatrix4(m.matrixWorld);
    if (_magCorner.y < minY) minY = _magCorner.y;
  }
  return minY;
}

// 把弹匣摆成「平躺在地上」：长轴水平、薄的那一面朝下
function flatQuaternion(m, out) {
  const lx = new THREE.Vector3(1, 0, 0).applyQuaternion(m.quaternion);   // 厚度轴
  const ly = new THREE.Vector3(0, 1, 0).applyQuaternion(m.quaternion);   // 长轴
  const up = new THREE.Vector3(0, lx.y >= 0 ? 1 : -1, 0);
  const flatY = ly.clone();
  flatY.y = 0;
  if (flatY.lengthSq() < 1e-6) flatY.set(0, 0, 1);
  flatY.normalize();
  const zAxis = new THREE.Vector3().crossVectors(up, flatY).normalize();
  return out.setFromRotationMatrix(new THREE.Matrix4().makeBasis(up, flatY, zAxis));
}

function updateDroppedMags(dt) {
  for (const m of droppedMags) {
    const st = m.userData.state;
    if (st === 'sleep') continue;

    if (st === 'fall') {
      const v = m.userData.v, w = m.userData.w;

      v.y -= 9.2 * dt;
      m.position.addScaledVector(v, dt);

      const wl = w.length();
      if (wl > 1e-4) {
        _magAxis.copy(w).multiplyScalar(1 / wl);
        _magQ.setFromAxisAngle(_magAxis, wl * dt);
        m.quaternion.premultiply(_magQ).normalize();
      }

      m.updateMatrixWorld(true);
      const low = magLowestPoint(m);

      if (low < 0) {
        m.position.y -= low;
        m.updateMatrixWorld(true);

        if (v.y < 0) {
          v.y = -v.y * 0.30;
          v.x *= 0.72;
          v.z *= 0.72;
          w.multiplyScalar(0.60);
          if (v.y < 0.35) v.y = 0;
        }
      }

      // 贴着地面就加摩擦；快停了就转入「躺平」阶段
      if (low < 0.004 && v.y === 0) {
        v.x *= Math.max(0, 1 - dt * 7);
        v.z *= Math.max(0, 1 - dt * 7);
        w.multiplyScalar(Math.max(0, 1 - dt * 5));

        if (v.lengthSq() < 0.0012 && w.lengthSq() < 0.35) {
          m.userData.state = 'settle';
          m.userData.settleT = 0;
          m.userData.flatQ = flatQuaternion(m, new THREE.Quaternion());
        }
      }
      continue;
    }

    // settle：平滑地躺平，同时贴着地面（转的过程中最低点会变，要一直吸在地上）
    m.userData.settleT += dt;
    const k = Math.min(1, dt * 9);
    m.quaternion.slerp(m.userData.flatQ, k);
    m.updateMatrixWorld(true);
    m.position.y -= magLowestPoint(m);
    m.updateMatrixWorld(true);

    if (m.userData.settleT > 0.45) {
      m.quaternion.copy(m.userData.flatQ);
      m.updateMatrixWorld(true);
      m.position.y -= magLowestPoint(m);
      m.updateMatrixWorld(true);
      m.userData.state = 'sleep';
    }
  }
}

function clearDroppedMags() {
  for (const m of droppedMags) scene.remove(m);
  droppedMags.length = 0;
}

function addBulletHole(point, normal, parent) {
  const h = new THREE.Mesh(holeGeo, holeMat);
  h.position.copy(point).addScaledVector(normal, 0.004);
  h.lookAt(h.position.clone().add(normal));
  parent.add(h);
  holes.push({ mesh: h, parent });
}

function breakVase() {
  vaseBroken = true;
  vase.visible = false;
  renderer.shadowMap.needsUpdate = true;   // 让花瓶的影子跟着消失

  for (let i = 0; i < 16; i++) {
    const m = new THREE.Mesh(shardGeo, shardMat);
    m.position.copy(vase.position);
    m.position.y += 0.10 + Math.random() * 0.20;
    const a = Math.random() * Math.PI * 2;
    const sp = 0.8 + Math.random() * 2.0;
    m.userData.v = new THREE.Vector3(Math.cos(a) * sp, 1.2 + Math.random() * 2.4, Math.sin(a) * sp);
    m.userData.w = new THREE.Vector3(
      (Math.random() - 0.5) * 14,
      (Math.random() - 0.5) * 14,
      (Math.random() - 0.5) * 14
    );
    m.scale.setScalar(0.6 + Math.random() * 0.9);
    scene.add(m);
    shards.push(m);
  }
  shardLife = 0;
  shardMat.opacity = 1;
}

const _shotRight = new THREE.Vector3();
const _shotUp = new THREE.Vector3();
const _pelletDir = new THREE.Vector3();

// 单颗弹丸：打丧尸优先，其次打墙/花瓶
function shootPellet(dir, d, pelletIdx) {
  raycaster.set(camera.position, dir);

  // 先打墙和花瓶，拿到「被墙挡住的距离」
  const targets = [world];
  if (!vaseBroken) targets.push(vase);
  const hits = raycaster.intersectObjects(targets, true);
  const wallHit = hits.length ? hits[0] : null;
  const wallT = wallHit ? wallHit.distance : Infinity;

  // 再挨个检查丧尸：圆柱当身体、球当头
  let bestT = Infinity;
  let bestZb = null;
  let bestHead = false;
  for (const zb of zombies) {
    if (!zb.alive) continue;
    zb.mesh.updateMatrixWorld(true);
    // 圆柱跟着胯部骨骼走：走路动画里胯会左右摆三十厘米、低头时人往前探，
    // 用模型原点当圆心的话，准星对着看得见的身体反而会打空
    if (zb.hipsBone) zb.hipsBone.getWorldPosition(_bodyPos);
    else zb.mesh.getWorldPosition(_bodyPos);
    const bodyT = rayCylinderT(camera.position, dir, _bodyPos.x, _bodyPos.z,
      zb.bodyR || ZOMBIE_BODY_R, 0.05, zb.bodyTop || 1.62);
    let t = bodyT;
    let isHead = false;
    if (zombieHeadCenter(zb, _headPos)) {
      const headT = raySphereT(camera.position, dir, _headPos, zb.headR || ZOMBIE_HEAD_R);
      // 头球稍微靠后一点（0.15 米容差）也算爆头，免得低头时把脸判成身子
      if (headT > 0 && (bodyT < 0 || headT <= bodyT + 0.15)) { t = headT; isHead = true; }
    }
    if (t > 0 && t < bestT) { bestT = t; bestZb = zb; bestHead = isHead; }
  }

  // 打中丧尸：按武器伤害扣血；血花朝枪口方向喷
  if (bestZb && bestT < wallT) {
    _hitPoint.copy(camera.position).addScaledVector(dir, bestT);
    if (pelletIdx < 3) spawnBlood(_hitPoint, dir, bestHead ? 1.5 : 1.0);
    hitZombie(bestZb, _hitPoint, bestHead, d.damage * (bestHead ? d.headMul : 1), d, dir);
    return;
  }

  if (!wallHit) return;

  let o = wallHit.object;
  let isVase = false;
  while (o) {
    if (o === vase) { isVase = true; break; }
    o = o.parent;
  }

  if (isVase) {
    breakVase();
  } else if (holes.length < 220) {
    const n = wallHit.face
      ? wallHit.face.normal.clone().transformDirection(wallHit.object.matrixWorld)
      : dir.clone().negate();
    addBulletHole(wallHit.point, n, scene);
  }
}

function fire() {
  if (gameOver || pinnedBy || fireCooldown > 0) return;   // 被扑在身上时开不了枪
  const d = curWeapon();

  // 霰弹枪装填时可以随时开枪打断；整匣换弹不能打断
  if (reloading) {
    if (d.mode === 'shell') cancelReload();
    else return;
  }
  if (d.ammo <= 0) return;
  // 霰弹枪：上一发还没泵完，打不出下一发
  if (d.key === 'sg' && (pumpT > 0 || pumpWait > 0)) return;

  d.ammo--;
  fireCooldown = d.interval;
  gunKick = d.kick;
  flashTime = 0.05;
  flashMat.opacity = 0.95;
  updateAmmoUI();

  // 枪声（每种枪有几段录音，随机挑一段，音高也微调）
  if (d.sound && d.sound.length) {
    sfx(d.sound[(Math.random() * d.sound.length) | 0], {
      rate: 0.95 + Math.random() * 0.10,
      volume: d.fireSfxVol,
      pan: (Math.random() - 0.5) * 0.12,
    });
  }
  // 霰弹枪：后坐一下再开始泵动（拉护木 → 推回去），泵完才能开下一枪
  if (d.key === 'sg') {
    pumpWait = 0.10;
    pumpT = 0;
  }
  // 第一次开枪时检查一下声音通道，只有明显不正常才弹面板（正常时不打扰）
  if (!diagOpened) {
    diagOpened = true;
    const c = audioState.ctx;
    const total = c ? (c.baseLatency || 0) + (c.outputLatency || 0) : 0;
    if (total > 0.25) showDiag(8);
  }

  camera.getWorldDirection(shotDir);
  _shotRight.set(1, 0, 0).applyQuaternion(camera.quaternion);
  _shotUp.set(0, 1, 0).applyQuaternion(camera.quaternion);

  // 霰弹枪一次打 8 颗弹丸，每颗独立散布；步枪只有 1 颗
  for (let p = 0; p < d.pellets; p++) {
    _pelletDir.copy(shotDir);
    if (d.spread > 0) {
      const a = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random()) * d.spread;
      _pelletDir
        .addScaledVector(_shotRight, Math.cos(a) * r)
        .addScaledVector(_shotUp, Math.sin(a) * r)
        .normalize();
    }
    shootPellet(_pelletDir, d, p);
  }
}

function updateShards(dt) {
  if (shards.length === 0) return;

  shardLife += dt;

  for (const m of shards) {
    const v = m.userData.v;
    v.y -= 9.8 * dt;
    m.position.addScaledVector(v, dt);

    if (m.position.y < 0.03) {
      m.position.y = 0.03;
      v.x *= 0.4;
      v.z *= 0.4;
      v.y = Math.abs(v.y) * 0.32;
    }

    m.rotation.x += m.userData.w.x * dt;
    m.rotation.y += m.userData.w.y * dt;
    m.rotation.z += m.userData.w.z * dt;
  }

  if (shardLife > 1.4) shardMat.opacity = Math.max(0, 1 - (shardLife - 1.4) / 0.8);

  if (shardLife > 2.3) {
    for (const m of shards) scene.remove(m);
    shards.length = 0;
  }
}

function restart() {
  // 三把枪全部回满弹
  for (const d of Object.values(WEAPONS)) {
    d.ammo = d.magSize;
    d.reserve = d.reserveMax;
  }
  resetPumpState();
  if (WEAPONS.ak.loaded) activateWeapon('ak', true);
  else cancelReload();
  clearDroppedMags();

  // 玩家状态
  playerHP = MAX_HP;
  lastHurtAt = -999;
  gameOver = false;
  hurtFlash = 0;
  if (hurtEl) hurtEl.style.opacity = 0;
  updateHealthUI();
  for (const b of bloodBits) scene.remove(b);
  bloodBits.length = 0;
  for (const sp of bloodMist) { scene.remove(sp); sp.material.dispose(); }
  bloodMist.length = 0;
  for (const sp of bloodFlashes) { scene.remove(sp); sp.material.dispose(); }
  bloodFlashes.length = 0;
  for (const s of bloodSplats) { scene.remove(s.mesh); s.mat.dispose(); }
  bloodSplats.length = 0;

  // 死了之后鼠标是松开的：重新显示开始页，点一下再进去
  if (!locked) overlay.classList.remove('hidden');

  vaseBroken = false;
  vase.visible = true;
  fireCooldown = 0;
  gunKick = 0;
  jumpY = 0; jumpV = 0; grounded = true; crouchK = 0; airK = 0;   // 重来时站回地面

  for (const m of shards) scene.remove(m);
  shards.length = 0;
  shardMat.opacity = 1;

  for (const h of holes) h.parent.remove(h.mesh);
  holes.length = 0;

  // 重开：松开「被扑住」的状态、停掉镜头抖动
  pinnedBy = null; pinT = 0; pinPress = 0; shakeAmp = 0;

  resetZombies();
  started = locked;            // 死了鼠标会松开：重新点进来才继续算波次
  doorTarget = 0;
  doorOpen = 0;
  doorLeft.rotation.y = 0;
  doorRight.rotation.y = 0;

  // 抽屉全部关上、补货冷却清零
  for (const s of ammoSpots) {
    s.open = false; s.cooldown = 0; s.cur = 0;
    s.mesh.position.z = 0;
  }
  if (bannerEl) bannerEl.classList.remove('show');
  bannerT = 0;

  renderer.shadowMap.needsUpdate = true;
  updateAmmoUI();
}

updateAmmoUI();
updateHealthUI();

/* =========================================================================
   玩家状态与碰撞
   ========================================================================= */
const player = {
  pos: new THREE.Vector3(0, 0, 0.6),
  yaw: 0,
  pitch: 0,
};

/* ── 跳跃 / 下蹲 ──────────────────────────────────────────────── */
// 大腿往前抬 CROUCH_THIGH 弧度、小腿回折两倍，脚掌再补回来，人就是标准下蹲。
// 腿一折，整个人会「浮」起来 CROUCH_DROP 米，所以要把身体整体放低同样高度，
// 脚才能重新踩在地上（数值由 Soldier.glb 的腿长 0.43+0.44 米算出来）。
const CROUCH_THIGH = 1.05;
const CROUCH_DROP = 0.49;
const JUMP_SPEED = 5.1;      // 起跳速度（米/秒）
const GRAVITY = 15.0;        // 重力（米/秒²）→ 跳起约 0.87 米：沙发（0.63）、书桌（0.75）都上得去
let jumpY = 0;               // 当前离地高度
let jumpV = 0;               // 竖直速度
let grounded = true;         // 是否踩在地上
let crouchK = 0;             // 蹲下的程度：0 站着 → 1 蹲到底（平滑过渡，不跳变）
let airK = 0;                // 「在空中」的程度，用来平滑收腿动作

// top = 这块东西有多高（米）。跳得够高就能站上去；不写 top 的一律当墙（ROOM_H 高），站不上去。
const obstacles = [
  // ── 办公室家具 ──
  { minX: -2.08, maxX: -0.22, minZ: -2.40, maxZ: -1.42, top: 0.75 },  // 北墙书桌（放大后）
  { minX: -1.46, maxX: -0.84, minZ: -1.26, maxZ: -0.64, top: 0.43 },  // 小茶几
  { minX: -0.12, maxX: 2.50, minZ: -2.40, maxZ: -1.10, top: 0.63 },   // 北墙两张单人椅（放大后）
  { minX: 2.10, maxX: 3.00, minZ: -0.94, maxZ: 1.45, top: 0.63 },     // 东墙三人沙发
  { minX: -3.00, maxX: -2.68, minZ: -1.50, maxZ: -0.34, top: 0.84 },  // 西墙暖气片
  { minX: -3.00, maxX: -2.80, minZ: 1.98, maxZ: 2.12 },    // 西墙竖管
  { minX: 2.78, maxX: 3.00, minZ: 2.25, maxZ: 2.39 },      // 东墙竖管
  { minX: -2.96, maxX: -2.44, minZ: 0.20, maxZ: 0.85, top: 1.24 },    // 西墙文件柜
  { minX: -2.66, maxX: -2.30, minZ: -2.12, maxZ: -1.78, top: 0.42 },  // 桌边垃圾桶
  { minX: 2.35, maxX: 2.88, minZ: 1.70, maxZ: 2.22, top: 0.66 },      // 东南角纸箱

  // ── 房间四壁（南墙留 ±0.6 门洞）──
  { minX: -3.06, maxX: 3.06, minZ: -2.46, maxZ: -2.34 },
  { minX: 2.94, maxX: 3.06, minZ: -2.46, maxZ: 2.46 },
  { minX: -3.06, maxX: -2.94, minZ: -2.46, maxZ: 2.46 },
  { minX: -3.06, maxX: -0.60, minZ: 2.34, maxZ: 2.46 },
  { minX: 0.60, maxX: 3.06, minZ: 2.34, maxZ: 2.46 },

  // ── 走廊北墙（门洞 ±0.6 / -7~-5 / 5~7）──
  { minX: -10.06, maxX: -7.00, minZ: 2.34, maxZ: 2.46 },
  { minX: -5.00, maxX: -3.06, minZ: 2.34, maxZ: 2.46 },
  { minX: 3.06, maxX: 5.00, minZ: 2.34, maxZ: 2.46 },
  { minX: 7.00, maxX: 10.06, minZ: 2.34, maxZ: 2.46 },

  // ── 走廊南墙（门洞 -7~-5 / 5~7）──
  { minX: -10.06, maxX: -7.00, minZ: 4.74, maxZ: 4.86 },
  { minX: -5.00, maxX: 5.00, minZ: 4.74, maxZ: 4.86 },
  { minX: 7.00, maxX: 10.06, minZ: 4.74, maxZ: 4.86 },

  // ── 走廊两端 ──
  { minX: -10.06, maxX: -9.94, minZ: 2.34, maxZ: 4.86 },
  { minX: 9.94, maxX: 10.06, minZ: 2.34, maxZ: 4.86 },

  // ── 教室 A（-7~-2, 4.8~8.8）──
  { minX: -7.06, maxX: -6.94, minZ: 4.74, maxZ: 8.86 },
  { minX: -2.06, maxX: -1.94, minZ: 4.74, maxZ: 8.86 },
  { minX: -7.06, maxX: -1.94, minZ: 8.74, maxZ: 8.86 },

  // ── 教室 B（2~7, 4.8~8.8）──
  { minX: 1.94, maxX: 2.06, minZ: 4.74, maxZ: 8.86 },
  { minX: 6.94, maxX: 7.06, minZ: 4.74, maxZ: 8.86 },
  { minX: 1.94, maxX: 7.06, minZ: 8.74, maxZ: 8.86 },

  // ── 教室 C（-8.5~-3.5, -1.6~2.4）──
  { minX: -8.58, maxX: -8.42, minZ: -1.66, maxZ: 2.40 },
  { minX: -3.58, maxX: -3.42, minZ: -1.66, maxZ: 2.40 },
  { minX: -8.58, maxX: -3.42, minZ: -1.66, maxZ: -1.54 },

  // ── 教室 D（3.5~8.5, -1.6~2.4）──
  { minX: 3.42, maxX: 3.58, minZ: -1.66, maxZ: 2.40 },
  { minX: 8.42, maxX: 8.58, minZ: -1.66, maxZ: 2.40 },
  { minX: 3.42, maxX: 8.58, minZ: -1.66, maxZ: -1.54 },

  // ── 教室课桌 ──
  ...deskRects,
];

// 门关着时挡住门洞
const DOOR_BLOCK = { minX: -0.62, maxX: 0.62, minZ: 2.32, maxZ: 2.50 };

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

function pushOutOfBox(x, z, b) {
  const cx = clamp(x, b.minX, b.maxX);
  const cz = clamp(z, b.minZ, b.maxZ);
  const dx = x - cx;
  const dz = z - cz;
  const d2 = dx * dx + dz * dz;

  if (d2 >= PLAYER_RADIUS * PLAYER_RADIUS) return [x, z];

  if (d2 > 1e-8) {
    const d = Math.sqrt(d2);
    return [cx + (dx / d) * PLAYER_RADIUS, cz + (dz / d) * PLAYER_RADIUS];
  }

  const dl = x - b.minX, dr = b.maxX - x, df = z - b.minZ, db = b.maxZ - z;
  const m = Math.min(dl, dr, df, db);
  if (m === dl) return [b.minX - PLAYER_RADIUS, z];
  if (m === dr) return [b.maxX + PLAYER_RADIUS, z];
  if (m === df) return [x, b.minZ - PLAYER_RADIUS];
  return [x, b.maxZ + PLAYER_RADIUS];
}

// 站得比这块东西的顶还高（留 12 厘米容差）就不用被它挡着了
const STEP_UP = 0.12;
const topOf = (b) => (b.top === undefined ? ROOM_H : b.top);

function resolveObstacles(x, z, feetY = 0) {
  for (const b of obstacles) {
    if (topOf(b) <= feetY + STEP_UP) continue;   // 已经在它顶上，横向不管
    [x, z] = pushOutOfBox(x, z, b);
  }
  if (doorOpen < 0.45) [x, z] = pushOutOfBox(x, z, DOOR_BLOCK);
  return [x, z];
}

// 脚下这块地上「最高的可站台面」：家具顶就是它的 top，空地是 0
const STAND_MARGIN = 0.02;     // 台面判定几乎按脚底中心算（放宽会让贴墙站着被「吸」上暖气片）
function groundAt(x, z) {
  let g = 0;
  for (const b of obstacles) {
    const t = b.top;
    if (t === undefined || t > 2) continue;     // 墙和管道不算能站的台面
    if (t <= g) continue;
    if (x > b.minX - STAND_MARGIN && x < b.maxX + STAND_MARGIN &&
        z > b.minZ - STAND_MARGIN && z < b.maxZ + STAND_MARGIN) g = t;
  }
  return g;
}

/* =========================================================================
   输入
   ========================================================================= */
const overlay = document.getElementById('overlay');
const canvas = renderer.domElement;

const dbg = new URLSearchParams(location.search);
if (dbg.has('shot')) overlay.style.display = 'none';
if (dbg.has('fov')) { camera.fov = parseFloat(dbg.get('fov')) || 70; camera.updateProjectionMatrix(); }
if (dbg.has('yaw')) player.yaw = parseFloat(dbg.get('yaw')) || 0;
if (dbg.has('pitch')) player.pitch = parseFloat(dbg.get('pitch')) || 0;
// 调试：从地址栏直接改握枪参数
if (dbg.has('curl')) HOLD.curl = parseFloat(dbg.get('curl')) || 0;
if (dbg.has('guny')) HOLD.gunPos.y = parseFloat(dbg.get('guny')) || HOLD.gunPos.y;
if (dbg.has('gunz')) HOLD.gunPos.z = parseFloat(dbg.get('gunz')) || HOLD.gunPos.z;
if (dbg.has('gunry')) HOLD.gunRy = parseFloat(dbg.get('gunry')) || 0;
if (dbg.has('pos')) {
  const [x, z] = dbg.get('pos').split(',').map(Number);
  if (Number.isFinite(x) && Number.isFinite(z)) player.pos.set(x, 0, z);
}

let locked = false;
const keys = Object.create(null);

overlay.addEventListener('click', () => {
  initAudio();               // 浏览器要求先有用户操作才允许出声
  if (gameOver) return;
  canvas.requestPointerLock();
});

document.addEventListener('pointerlockchange', () => {
  locked = document.pointerLockElement === canvas;
  // 真正开打：从这一刻起算波次和 10 秒开门；按 Esc 松开鼠标等于暂停
  started = locked;
  overlay.classList.toggle('hidden', locked || gameOver);
  if (!locked) {
    for (const k in keys) keys[k] = false;
    mouseDown = false;
  }
});

document.addEventListener('mousedown', (e) => {
  initAudio();
  if (!locked || e.button !== 0) return;
  mouseDown = true;
  fire();
});

document.addEventListener('mouseup', (e) => {
  if (e.button === 0) mouseDown = false;
});

document.addEventListener('mousemove', (e) => {
  if (!locked) return;
  player.yaw -= e.movementX * MOUSE_SENS;
  player.pitch -= e.movementY * MOUSE_SENS;
  const lim = Math.PI / 2 - 0.05;
  player.pitch = clamp(player.pitch, -lim, lim);
});

function nearDoor() {
  return Math.hypot(player.pos.x, player.pos.z - ROOM_D / 2) < 2.2;
}

// 身边最近的那个抽屉（1.5 米内）
function nearestAmmoSpot() {
  let best = null, bestD = 1.5;
  for (const s of ammoSpots) {
    const d = Math.hypot(player.pos.x - s.x, player.pos.z - s.z);
    if (d < bestD) { bestD = d; best = s; }
  }
  return best;
}

// 拉开 = 拿子弹；关上不算动作。同一个抽屉 12 秒后才会重新装满。
function useAmmoSpot(s) {
  s.open = !s.open;
  if (!s.open) return;                       // 只是关回去
  if (s.cooldown > 0) {
    showBanner(`${s.name}空了 · ${Math.ceil(s.cooldown)} 秒后补货`, 1.6);
    return;
  }
  let gotR = 0, gotS = 0;
  for (const k of ['ak', 'm4']) {
    const d = WEAPONS[k];
    const add = Math.min(s.giveRifle, d.reserveMax - d.reserve);
    if (add > 0) { d.reserve += add; gotR = Math.max(gotR, add); }
  }
  const sg = WEAPONS.sg;
  gotS = Math.min(s.giveShell, sg.reserveMax - sg.reserve);
  if (gotS > 0) sg.reserve += gotS;
  s.cooldown = 12;
  updateAmmoUI();
  if (gotR || gotS) showBanner(`拿到子弹：步枪 +${gotR} · 霰弹 +${gotS}`, 2.0);
  else showBanner('子弹已经满了', 1.6);
}

window.addEventListener('keydown', (e) => {
  initAudio();
  keys[e.code] = true;
  if (e.code === 'Space' && !e.repeat && pinnedBy && locked) struggle();   // 被扑住：狂按空格甩开
  if (e.code === 'KeyR') startReload();
  if (e.code === 'F9') audioSyncTest();
  if (e.code === 'KeyT') restart();
  if (e.code === 'KeyE' && !e.repeat) {      // 按住不放不会反复开关
    const spot = nearestAmmoSpot();
    if (spot) useAmmoSpot(spot);
    else if (nearDoor()) {
      doorTarget = doorTarget > 0.5 ? 0 : 1;
      // 手动开关后，自动循环从这一档重新计时，不会立刻又被门自己翻回去
      if (doorAutoDone) {
        doorPhase = doorTarget > 0.5 ? 'open' : 'closed';
        doorCycleT = doorPhase === 'open' ? DOOR_OPEN_TIME : DOOR_CLOSED_TIME;
      }
    }
  }
  if (e.code === 'Digit1') switchWeapon('ak');
  if (e.code === 'Digit2') switchWeapon('m4');
  if (e.code === 'Digit3') switchWeapon('sg');
  if (e.code === 'KeyQ') {
    const i = WEAPON_ORDER.indexOf(currentWeapon);
    switchWeapon(WEAPON_ORDER[(i + 1) % WEAPON_ORDER.length]);
  }
});
window.addEventListener('keyup', (e) => { keys[e.code] = false; });
window.addEventListener('blur', () => { for (const k in keys) keys[k] = false; });

/* =========================================================================
   每帧更新
   ========================================================================= */
const clock = new THREE.Clock();
let walkPhase = 0;
let elapsed = 0;

const promptEl = document.getElementById('prompt');
let promptText = '';

// ---- 波次 HUD + 大字播报 ----
const waveEl = document.getElementById('wave');
const bannerEl = document.getElementById('banner');
let waveText = '';
let bannerT = 0;

function showBanner(txt, sec = 3) {
  if (!bannerEl) return;
  bannerEl.textContent = txt;
  bannerEl.classList.add('show');
  bannerT = sec;
}

const fpsEl = document.getElementById('fps');
let fpsAcc = 0, fpsFrames = 0, lowStreak = 0;

// ---- 声音延迟诊断 ----
const diagEl = document.getElementById('diag');
const syncFlashEl = document.getElementById('syncflash');
let diagUntil = 0;          // 诊断面板显示到这个时刻（秒）
let diagOpened = false;     // 第一次开枪时自动打开一次

// HUD 上顺带显示音频延迟和服务状态，用来判断延迟出在程序还是声卡
function audioDiagText() {
  const c = audioState.ctx;
  if (!c) return '  ·  音频未启动';
  const base = ((c.baseLatency || 0) * 1000).toFixed(0);
  const out = ((c.outputLatency || 0) * 1000).toFixed(0);
  return `  ·  音频 ${base}/${out}ms ${c.state}`;
}

function showDiag(seconds) {
  diagUntil = elapsed + seconds;
  if (diagEl) diagEl.classList.add('show');
}

function updateDiag(fps) {
  if (!diagEl) return;
  if (diagEl.classList.contains('show') && elapsed >= diagUntil) diagEl.classList.remove('show');
  const c = audioState.ctx;
  if (!c) return;
  const base = Math.round((c.baseLatency || 0) * 1000);
  const out = Math.round((c.outputLatency || 0) * 1000);
  const total = base + out;
  let verdict = '';
  if (total > 250) {
    verdict = `<br><span style="color:#ff8a7a">⚠ 系统声音缓冲 ${total} 毫秒，声音会明显滞后（声卡/驱动这一层）</span>`;
  } else if (fps < 30) {
    verdict = `<br><span style="color:#ffd27a">⚠ 画面只有 ${Math.round(fps)} 帧/秒，点击会被拖到下一帧</span>`;
  }
  diagEl.innerHTML =
    `画面 ${Math.round(fps)} 帧/秒 · 声音缓冲 ${base}+${out} 毫秒` + verdict +
    `<br><span class="hint">按 F9 测一次：屏幕闪白和「嗒」声应该同时出现</span>`;
}

// F9：屏幕闪白 + 同一时刻播一个短「嗒」，用来判断声音是不是真的晚了
function audioSyncTest() {
  initAudio();
  const ctx = audioState.ctx;
  if (syncFlashEl) {
    syncFlashEl.style.transition = 'none';
    syncFlashEl.style.opacity = '0.9';
    requestAnimationFrame(() => {
      syncFlashEl.style.transition = 'opacity .2s';
      syncFlashEl.style.opacity = '0';
    });
  }
  if (!ctx) { showDiag(6); return; }
  if (ctx.state === 'suspended') ctx.resume();
  const t0 = ctx.currentTime;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = 'square';
  o.frequency.value = 880;
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(0.45, t0 + 0.002);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.045);
  o.connect(g);
  g.connect(ctx.destination);
  o.start(t0);
  o.stop(t0 + 0.06);
  showDiag(6);
  console.log('[同步测试] baseLatency', ctx.baseLatency, 'outputLatency', ctx.outputLatency, 'state', ctx.state);
}

function tickPerf(dt) {
  fpsAcc += dt;
  fpsFrames++;
  if (fpsAcc < 1) return;

  const fps = fpsFrames / fpsAcc;
  fpsEl.textContent = `  ·  ${Math.round(fps)} FPS` + audioDiagText();
  updateDiag(fps);

  // 保险：万一上下文被系统挂起，立刻拉回来，下一枪不会等它醒
  if (audioState.ctx && audioState.ctx.state !== 'running') audioState.ctx.resume();

  // 画面掉到 40 帧以下时，镜子改成每 3 帧画一次，把帧时间省下来
  if (fps < 40) mirrorStride = 3;
  else if (fps > 55) mirrorStride = 2;

  if (fps < 50 && pixelRatio > 0.51) {
    if (++lowStreak >= 2) {
      pixelRatio = Math.max(0.5, pixelRatio - 0.12);
      renderer.setPixelRatio(pixelRatio);
      lowStreak = 0;
    }
  } else {
    lowStreak = 0;
  }

  fpsAcc = 0;
  fpsFrames = 0;
}

function updateZombies(dt, t) {
  for (const zb of zombies) {
    const m = zb.mesh;

    // 死了：倒地动画播完（约 3 秒），尸体留在原地一段时间，到点清掉
    if (!zb.alive) {
      if (zb.deathT < CORPSE_LIFE) {
        zb.deathT += dt;
        if (zb.deathT < 3.0) {
          zb.mixer.update(dt);
          // 人形怪没有「倒地」动画，就自己往前栽倒；不然尸体会直挺挺站着
          if (!zb.actions.Death) {
            const k = Math.min(1, zb.deathT / 0.6);
            m.rotation.order = 'YXZ';    // 先转向、再往前栽，倒的方向才对
            m.rotation.x = 1.45 * k * k;
          }
          // 倒地会往前滑两米，同样不许滑进墙里
          clampZombieBody(zb);
        }
      } else {
        scene.remove(m);
        m.traverse((o) => {
          if (!o.isMesh) return;
          const mats = Array.isArray(o.material) ? o.material : [o.material];
          for (const mm of mats) if (mm && mm.dispose) mm.dispose();
        });
        zb.gone = true;
      }
      continue;
    }

    zb.mixer.update(dt);
    zb.hitT = Math.max(0, zb.hitT - dt);
    zb.attackCd = Math.max(0, zb.attackCd - dt);
    zb.leapCd = Math.max(0, zb.leapCd - dt);

    // ── 扑食者：正趴在玩家头上 ──────────────────────────────
    if (zb.pin) {
      // 每帧摆在「镜头正前方一臂远」，脸对脸贴着，不甩开就一直啃
      const fx = -Math.sin(player.yaw), fz = -Math.cos(player.yaw);
      const wob = Math.sin(elapsed * 13) * 0.035;
      const inRoom = player.pos.z < 2.40;
      m.position.x = clamp(player.pos.x + fx * 1.35 + fz * wob,
        inRoom ? -2.80 : -9.30, inRoom ? 2.80 : 9.30);
      m.position.z = inRoom
        ? clamp(player.pos.z + fz * 1.35 - fx * wob, -2.22, 2.30)
        : clamp(player.pos.z + fz * 1.35 - fx * wob, 2.52, 4.60);
      m.position.y = jumpY;
      m.rotation.set(0.30, player.yaw, 0);   // 整个人向你压过来，脸贴到镜头前
      continue;
    }

    // ── 扑食者：腾空飞扑 ────────────────────────────────────
    if (zb.leapT >= 0) {
      zb.leapT += dt;
      const u = Math.min(1, zb.leapT / zb.leapDur);
      m.position.x = zb.leapFrom.x + (zb.leapTo.x - zb.leapFrom.x) * u;
      m.position.z = zb.leapFrom.z + (zb.leapTo.z - zb.leapFrom.z) * u;
      m.position.y = Math.sin(Math.PI * u) * 0.80;       // 抛物线（别顶穿 3 米的天花板）
      m.rotation.x = Math.sin(Math.PI * u) * 0.85;       // 整个人往前扑
      const lx = zb.leapTo.x - zb.leapFrom.x;
      const lz = zb.leapTo.z - zb.leapFrom.z;
      if (Math.hypot(lx, lz) > 0.05) m.rotation.y = Math.atan2(lx, lz);
      if (u >= 1) {
        zb.leapT = -1;
        zb.state = 'walk';
        m.position.y = 0;
        m.rotation.x = 0;
        if (zb.actions.Run) zb.actions.Run.timeScale = zb.runScale;
        const landD = Math.hypot(player.pos.x - m.position.x, player.pos.z - m.position.z);
        const doorNow = doorOpen < 0.45 &&
          (player.pos.z - 2.40) * (m.position.z - 2.40) < 0;
        if (landD < JUMPER_CATCH_DIST && !doorNow && !pinnedBy && !gameOver) {
          pinPlayer(zb);        // 扑中了：按住不放
        } else {
          // 扑空：自己摔一跤，这时候打它最好打
          zb.state = 'stun';
          zb.stunT = 1.15;
          zb.leapCd = JUMPER_CD * 0.55;
          setZAnim(zb, 'HitReact', 0.08);
          _sfxPos.copy(m.position); _sfxPos.y = 0.6;
          sfxAt('growl3', _sfxPos, { rate: 0.75, volume: 0.8 });
        }
      }
      continue;
    }

    // ── 扑食者：蹲身蓄力（约半秒，够你抬枪）───────────────────
    if (zb.state === 'crouch') {
      zb.crouchT -= dt;
      m.rotation.y = Math.atan2(player.pos.x - m.position.x, player.pos.z - m.position.z);
      if (zb.crouchT <= 0) startLeap(zb);
      continue;
    }

    // ── 扑食者：被甩开 / 摔倒，趴在地上不能动 ────────────────
    if (zb.stunT > 0) {
      zb.stunT -= dt;
      if (zb.stunT <= 0) {
        zb.state = 'walk';
        setZAnim(zb, 'Idle', 0.2);
      }
      clampZombieBody(zb);
      continue;
    }

    // ── 爆炸者：引信点着了，马上要炸 ──────────────────────────
    if (zb.fuseT >= 0) {
      zb.fuseT -= dt;
      if (zb.fuseT <= 0) explodeBloater(zb);
      continue;
    }

    const px = player.pos.x, pz = player.pos.z;
    const dxp = px - m.position.x;
    const dzp = pz - m.position.z;
    const dist = Math.hypot(dxp, dzp);

    // 头朝玩家（模型正面是 +Z）
    m.rotation.y = Math.atan2(dxp, dzp);

    // 门关着的时候，墙里墙外互相打不着（隔着门咬人算穿门）
    const doorBetween = doorOpen < 0.45 &&
      (pz - 2.40) * (m.position.z - 2.40) < 0;

    // 扑食者：进到起跳距离就蹲身蓄力（隔着关着的门不许扑）
    if (zb.jumper && started && !gameOver && !pinnedBy &&
        zb.leapCd <= 0 && dist > 1.55 && dist < JUMPER_LEAP_DIST && !doorBetween &&
        leapPathClear(zb)) {
      zb.state = 'crouch';
      zb.crouchT = 0.55;
      setZAnim(zb, 'Scream', 0.10);
      _sfxPos.copy(m.position);
      _sfxPos.y = 1.55;
      sfxAt('growl1', _sfxPos, { rate: 1.50, volume: 0.95 });   // 尖啸一声，提醒你快跳了
      continue;
    }

    // 爆炸者：贴身就点引信，0.75 秒后炸
    if (zb.bloater && started && !gameOver && dist < 2.05 && zb.fuseT < 0 && !doorBetween) {
      zb.fuseT = BLOATER_FUSE;
      setZAnim(zb, 'Scream', 0.08);
      _sfxPos.copy(m.position);
      _sfxPos.y = 1.20;
      sfxAt('growl3', _sfxPos, { rate: 0.42, volume: 1.10 });
      continue;
    }

    // 攻击动画：两套动作，各自在「真的打到人」的瞬间扣血
    if (zb.attackT >= 0) {
      zb.attackT += dt;
      const table = zb.attackTiming || ZOMBIE_ATTACK;
      const timing = table[zb.attackClip] || table.Punch || ZOMBIE_ATTACK.Punch;
      if (!zb.hitDone && zb.attackT >= timing.hit) {
        zb.hitDone = true;
        if (dist < (zb.biteRange || 1.65) && !doorBetween) {
          damagePlayer(zb.dmg || 28);   // 普通 28（4 口倒），大块头 45（3 口倒）
          _sfxPos.copy(m.position);
          _sfxPos.y = 1.35;
          sfxAt('bite', _sfxPos, { rate: 0.92 + Math.random() * 0.18, volume: 0.95 });
        }
      }
      if (zb.attackT >= timing.end) {
        zb.attackT = -1;
        zb.attackCd = 1.6 + Math.random() * 0.9;   // 咬完歇久一点，别连环啃
      }
      clampZombieBody(zb);
      continue;
    }

    // 够近就挥爪 / 扑咬（被扑住的时候别的丧尸不趁火打劫，只扣扑食者的那口）
    if (started && !gameOver && !pinnedBy && !zb.bloater &&
        dist < (zb.clawRange || 1.30) && zb.attackCd <= 0 && !doorBetween) {
      zb.attackT = 0;
      zb.hitDone = false;
      zb.attackClip = Math.random() < 0.35 && zb.actions.Punch2 ? 'Punch2' : 'Punch';
      setZAnim(zb, zb.attackClip, 0.12);
      clampZombieBody(zb);
      continue;
    }

    // 目标点：玩家在走廊就追人；玩家进屋且门开着就穿门进屋；门关着就堵门口
    let tx, tz;
    // ⚠ 大块头例外：它只在走廊里混，永远不进屋。
    //   玩家躲在屋里，它就堵在门口外面转；想打它得自己走出去。
    if (brute && pz < 2.55) {
      tx = clamp(px, -9.2, 9.2);
      tz = 2.62;
    } else if (pz >= 2.55) {
      tx = clamp(px, -9.2, 9.2);
      tz = clamp(pz, 2.62, 4.55);
    } else if (doorOpen > 0.5) {
      // 别都盯着门正中那一个点：各走各的车道，到了门口直接往人身上扑。
      // 原来所有丧尸共用 (0, 2.30) 这个点，先到的把点占住，后面的就停在门口排队。
      if (m.position.z > 2.55) { tx = zb.lane; tz = 2.20; }
      else { tx = px; tz = pz; }
    } else {
      tx = clamp(px, -9.2, 9.2);
      tz = 2.62;
    }

    const mx = tx - m.position.x;
    const mz = tz - m.position.z;
    const md = Math.hypot(mx, mz);
    // md 门槛原来是 0.30：走到离目标点 30 厘米就停，结果全堵在门口。
    // 现在只要没到跟前就一直挪，后面的人不用再「挤」着它走。
    const moving = !gameOver && started && md > 0.04 && dist > (zb.keepDist || 0.85);

    if (moving) {
      const step = Math.min(md, zb.speed * dt);
      m.position.x += (mx / md) * step;
      m.position.z += (mz / md) * step;
    }

    // 丧尸之间互相挤开，别叠成一坨
    for (const other of zombies) {
      if (other === zb || !other.alive) continue;
      const ox = m.position.x - other.mesh.position.x;
      const oz = m.position.z - other.mesh.position.z;
      const od = Math.hypot(ox, oz);
      const apart = (zb.brute || other.brute) ? 1.15 : 0.58;   // 大块头肩宽近一米，挤太近会互相穿进去
      if (od > 1e-4 && od < apart) {
        const push = (apart - od) * 0.5;
        m.position.x += (ox / od) * push;
        m.position.z += (oz / od) * push;
      }
    }

    // 走路姿态：受击反应没播完时不要抢
    // 速度翻倍后 Walk 的动作对不上脚了，动起来一律播 Run
    if (zb.hitT <= 0) setZAnim(zb, moving ? 'Run' : 'Idle');

    // 最后一道保险：这一帧不管怎么动、怎么摆，身体都不许越过墙面
    clampZombieBody(zb);
  }

  // 清掉已经到时间移除的尸体（倒着删，下标不会乱）
  let hasGone = false;
  for (const z of zombies) if (z.gone) { hasGone = true; break; }
  if (hasGone) {
    for (let i = zombies.length - 1; i >= 0; i--) if (zombies[i].gone) zombies.splice(i, 1);
  }
}

function update(dt) {
  elapsed += dt;

  updatePin(dt);             // 被扑住：持续掉血 + 镜头晃
  updateReload(dt);          // 换弹时间轴（会顺带摆好枪上的弹匣）

  // 下蹲 / 跳跃：先算状态，后面的移速、视角高度、镜子里的人都用它
  {
    const crouchHeld = !gameOver && (keys['KeyC'] || keys['ControlLeft'] || keys['ControlRight']);
    const wantCrouch = crouchHeld && grounded;
    crouchK += ((wantCrouch ? 1 : 0) - crouchK) * Math.min(1, dt * 9);
    if (crouchK < 0.002) crouchK = 0;

    if (!gameOver && !pinnedBy && grounded && keys['Space']) {
      grounded = false;
      jumpV = JUMP_SPEED;
      crouchK = 0;                     // 起跳的一瞬间直接站起来
    }
  }

  // 镜子里那把枪跟着一起歪，IK 的双手也就跟着走
  if (mirrorGun) {
    const mh = curWeapon().rt.mirHome || HOLD.gunPos;
    mirrorGun.position.set(
      mh.x,
      mh.y - CROUCH_DROP * crouchK + gunKick * 0.012,   // 下蹲时整个人矮一截；开枪时枪往后顶
      mh.z + gunKick * 0.05
    );
    mirrorGun.rotation.set(
      HOLD.gunRx + 0.10 * reloadPoseNow.tilt + gunKick * 0.18,   // 后坐：枪口上跳
      HOLD.gunRy - 0.16 * reloadPoseNow.tilt,
      HOLD.gunRz - 0.62 * reloadPoseNow.tilt
    );
  }

  const f = (keys['KeyW'] ? 1 : 0) - (keys['KeyS'] ? 1 : 0);
  const s = (keys['KeyD'] ? 1 : 0) - (keys['KeyA'] ? 1 : 0);
  const moving = !gameOver && !pinnedBy && (f !== 0 || s !== 0);   // 被扑住时动不了

  if (moving) {
    const speed = ((keys['ShiftLeft'] || keys['ShiftRight']) ? RUN_SPEED : WALK_SPEED)
      * (1 - 0.45 * crouchK);           // 蹲着走慢将近一半
    const len = Math.hypot(f, s);
    const sin = Math.sin(player.yaw);
    const cos = Math.cos(player.yaw);

    const fx = -sin, fz = -cos;
    const rx = cos,  rz = -sin;

    const dx = ((fx * f + rx * s) / len) * speed * dt;
    const dz = ((fz * f + rz * s) / len) * speed * dt;

    const [nx, nz] = resolveObstacles(player.pos.x + dx, player.pos.z + dz, jumpY);
    player.pos.x = nx;
    player.pos.z = nz;
  }

  // 丧尸会把玩家顶开：不能直接穿过一只丧尸（被扑住时不推，免得镜头乱飘）
  if (!gameOver && !pinnedBy) {
    let px = player.pos.x, pz = player.pos.z, pushed = false;
    for (const zb of zombies) {
      if (!zb.alive) continue;
      const ox = px - zb.mesh.position.x;
      const oz = pz - zb.mesh.position.z;
      const od = Math.hypot(ox, oz);
      if (od > 1e-4 && od < 0.62) {
        px = zb.mesh.position.x + (ox / od) * 0.62;
        pz = zb.mesh.position.z + (oz / od) * 0.62;
        pushed = true;
      }
    }
    if (pushed) {
      const [px2, pz2] = resolveObstacles(px, pz, jumpY);
      player.pos.x = px2;
      player.pos.z = pz2;
    }
  }

  // ── 竖直方向：跳起 / 落到家具顶上 / 走出边缘掉下去 ──
  {
    const ground = groundAt(player.pos.x, player.pos.z);
    if (!grounded) {
      jumpV -= GRAVITY * dt;
      jumpY += jumpV * dt;
      const ceil = ROOM_H - 1.72;                       // 头别穿天花板
      if (jumpY > ceil) { jumpY = ceil; jumpV = Math.min(jumpV, 0); }
      if (jumpV <= 0 && jumpY <= ground) {              // 踩到台面
        jumpY = ground; jumpV = 0; grounded = true;
      }
    } else if (ground > jumpY + 0.02) {
      // 只有小台阶才自动迈上去；高度差大说明站位不正，绝不让它把人「吸」上去
      if (ground - jumpY <= STEP_UP + 0.02) jumpY = ground;
    } else if (ground < jumpY - 0.02) {
      if (jumpY - ground <= 0.30) jumpY = ground;       // 下小台阶
      else { grounded = false; jumpV = 0; }             // 走出沙发沿 → 掉下去
    }
    airK += ((grounded ? 0 : 1) - airK) * Math.min(1, dt * 12);
    if (airK < 0.002) airK = 0;
  }

  camera.position.set(
    player.pos.x,
    EYE_HEIGHT - CROUCH_DROP * crouchK + jumpY,   // 蹲下压低视线、跳起来抬高
    player.pos.z
  );
  camera.rotation.set(player.pitch, player.yaw, 0, 'YXZ');

  // 镜头抖动：被扑食者按住、或者身边有爆炸者炸开
  if (shakeAmp > 0.002) {
    const sh = shakeAmp;
    camera.position.x += (Math.random() - 0.5) * 0.075 * sh;
    camera.position.y += (Math.random() - 0.5) * 0.075 * sh;
    camera.rotation.z += (Math.random() - 0.5) * 0.055 * sh;
  }

  if (dbg.has('avatar')) {
    // 调试：把角色摆到相机正前方转身展示（?shot&avatar）
    playerModel.position.set(0, 0, -1.0);
    playerModel.rotation.y = Math.PI;
    fpGun.visible = false;             // 调试近距离看手时，把手里的第一人称枪藏掉
  } else {
    playerModel.position.set(player.pos.x, jumpY, player.pos.z);   // 跳起来时镜子里的人一起离地
    playerModel.rotation.y = player.yaw;
    fpGun.visible = !pinnedBy;          // 被扑住时双手在挣扎，第一人称的枪先收起来
  }

  if (!avatar) {
    // 还没加载到真模型：用程序化身体的摆腿
    if (moving) {
      walkPhase += dt * 9;
      const sw = Math.sin(walkPhase);
      legL.rotation.x = sw * 0.55;
      legR.rotation.x = -sw * 0.55;
    } else {
      const k = Math.min(1, dt * 12);
      legL.rotation.x += (0 - legL.rotation.x) * k;
      legR.rotation.x += (0 - legR.rotation.x) * k;
    }
  } else {
    // 真模型：按走路 / 跑步切换动作
    if (moving) setAvatarAnim((keys['ShiftLeft'] || keys['ShiftRight']) ? 'Run' : 'Walk');
    else setAvatarAnim('Idle');
    mixer.update(dt);
    poseLegs();          // 下蹲 / 跳跃：在动画上叠腿部角度（只动腿，不碰手）
    poseArms();          // 动画播完再盖一层持枪姿势，镜子里的手才会搭在枪上
  }

  fanGroup.userData.blades.rotation.z += dt * 1.6;

  // 脚步声 + 丧尸低吼
  updateFootsteps(dt, moving, !!(keys['ShiftLeft'] || keys['ShiftRight']));
  updateZombieAudio(dt);

  // 门自己开关：开局 10 秒先打开，之后「开 13 秒 → 关 9 秒」自动循环。
  // 关着的时候外面进不来也咬不到你，正好换弹、翻抽屉、喘口气。
  if (started && !gameOver && !victory) {
    if (!doorAutoDone && waveClock >= DOOR_AUTO_AT) {
      doorAutoDone = true;
      doorPhase = 'open';
      doorCycleT = DOOR_OPEN_TIME;
      doorTarget = 1;
      showBanner('10 秒到 · 门自己开了', 2.2);
    } else if (doorAutoDone) {
      doorCycleT -= dt;
      if (doorCycleT <= 0) {
        if (doorPhase === 'open') {
          doorPhase = 'closed'; doorCycleT = DOOR_CLOSED_TIME; doorTarget = 0;
          showBanner('门关上了 · 9 秒', 1.4);
        } else {
          doorPhase = 'open'; doorCycleT = DOOR_OPEN_TIME; doorTarget = 1;
          showBanner('门开了 · 13 秒', 1.4);
        }
      }
    }
  }

  // 门的开合
  doorOpen += (doorTarget - doorOpen) * Math.min(1, dt * 7);
  const swing = doorOpen * 1.45;
  doorLeft.rotation.y = -swing;
  doorRight.rotation.y = swing;

  // 抽屉：滑出/归位 + 补货倒计时
  for (const s of ammoSpots) {
    if (s.cooldown > 0) {
      s.cooldown = Math.max(0, s.cooldown - dt);
      if (s.cooldown === 0) s.open = false;   // 补满货，抽屉自己关回去
    }
    const want = s.open ? s.slide : 0;
    s.cur += (want - s.cur) * Math.min(1, dt * 10);
    s.mesh.position.z = s.cur;
  }

  // 大字播报到时间淡出
  if (bannerT > 0) {
    bannerT -= dt;
    if (bannerT <= 0 && bannerEl) bannerEl.classList.remove('show');
  }

  // 顶部波次计数 + 门的状态
  if (waveEl) {
    const doorTxt = doorAutoDone
      ? ` · 门${doorPhase === 'open' ? '开' : '关'} ${Math.max(0, Math.ceil(doorCycleT))} 秒`
      : '';
    const txt = !started ? '' : victory ? '🎉 已通关 · 按 T 再来一局'
      : `第 ${waveIdx + 1} / ${WAVE_SIZES.length} 波 · 场上 ${waveAlive} · 待刷 ${waveQuota}${doorTxt}`;
    if (txt !== waveText) { waveText = txt; waveEl.textContent = txt; }
  }

  // 屏幕中间的提示：死亡 / 换弹 / 开抽屉 / 开门
  {
    const spot = nearestAmmoSpot();
    let txt;
    if (victory) txt = '🎉 恭喜通关！按 T 再来一局';
    else if (gameOver) txt = '你被丧尸咬死了 · 按 T 重新开始';
    else if (pinnedBy) txt = `狂按 空格 甩开它！  ${Math.min(pinPress, PIN_ESCAPE)} / ${PIN_ESCAPE}`;
    else if (reloading) txt = '换弹中…';
    else if (spot) {
      txt = spot.cooldown > 0
        ? `${spot.name}空了（${Math.ceil(spot.cooldown)} 秒后补货）`
        : (spot.open ? '按 E 关回去' : '按 E 拉开抽屉拿子弹');
    }
    else if (nearDoor()) txt = doorTarget > 0.5 ? '按 E 关门' : '按 E 开门';
    else if (curWeapon().ammo === 0) txt = curWeapon().reserve > 0 ? '按 R 换弹' : '按 T 重来';
    else txt = '';
    if (txt !== promptText) { promptText = txt; promptEl.textContent = txt; }
  }

  updateSpawning(dt);
  updateZombies(dt, elapsed);

  // 连续射击（只有全自动武器按住左键会连发；霰弹枪要一下一下点）
  fireCooldown = Math.max(0, fireCooldown - dt);
  if (mouseDown && locked && curWeapon().auto && fireCooldown <= 0) fire();

  // 后坐
  gunKick = Math.max(0, gunKick - dt * 9);
  // 走动时枪轻微上下晃，站住时几乎不动
  bobT += dt * (moving ? ((keys['ShiftLeft'] || keys['ShiftRight']) ? 10.5 : 7.0) : 2.0);
  const bobY = moving ? Math.sin(bobT) * 0.006 : 0;
  const bobX = moving ? Math.cos(bobT * 0.5) * 0.004 : 0;
  const rt = reloadPoseNow.tilt;
  fpGun.position.set(
    gunHome.x + bobX - 0.045 * rt,
    gunHome.y + bobY - gunKick * 0.012 - 0.030 * rt,
    gunHome.z + gunKick * 0.05 + 0.020 * rt
  );
  fpGun.rotation.set(
    gunBaseRotX + gunKick * 0.18 + 0.10 * rt,
    gunBaseRotY - 0.16 * rt,
    gunBaseRotZ - 0.62 * rt
  );

  // 霰弹枪泵动：开枪后等 0.1 秒，护木往后一拉、停一下、推回去
  {
    const rtDef = curWeapon().rt;
    if (pumpWait > 0) {
      pumpWait = Math.max(0, pumpWait - dt);
      if (pumpWait === 0) {
        pumpT = PUMP_TIME;
        sfx('shotgun_pump', { rate: 1.0, volume: 0.85 });   // 咔—嚓，两声都在这个文件里
      }
    }
    let pk = 0;
    if (pumpT > 0) {
      pumpT = Math.max(0, pumpT - dt);
      pk = pumpCurve(1 - pumpT / PUMP_TIME);
    }
    applyPumpPose(rtDef, pk);
    applyLeftArmPose(rtDef, pk);   // 泵动 + 换弹的左手位移一起写进去
  }

  // 换弹：枪的姿态这一帧已经摆好，再把旧弹匣变成地上的实体
  if (pendingMagDrop) {
    pendingMagDrop = false;
    camera.updateMatrixWorld(true);
    spawnDroppedMag();
  }
  updateDroppedMags(dt);

  // 枪口火光衰减
  if (flashTime > 0) {
    flashTime -= dt;
    flashMat.opacity = Math.max(0, flashTime / 0.05) * 0.95;
  }

  updateShards(dt);
  updateBlood(dt);

  // 受击红屏：挨咬时闪一下，死了就一直暗红
  hurtFlash = Math.max(0, hurtFlash - dt * 1.4);
  if (hurtEl) hurtEl.style.opacity = (hurtFlash + (gameOver ? 0.28 : 0)).toFixed(3);

  // 脱战回血：6 秒没挨咬就慢慢回，回到满为止
  if (!gameOver && playerHP < MAX_HP && elapsed - lastHurtAt > 6) {
    const before = Math.round(playerHP);
    playerHP = Math.min(MAX_HP, playerHP + 7 * dt);
    if (Math.round(playerHP) !== before) updateHealthUI();
  }
}

function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.1);
  update(dt);
  renderer.render(scene, camera);
  tickPerf(dt);
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
