import * as THREE from 'three';
import { mergeGeometries } from './vendor/BufferGeometryUtils.js';
import { GLTFLoader } from './vendor/GLTFLoader.js';
import { MeshoptDecoder } from './vendor/meshopt_decoder.module.js';
import { clone as cloneSkinned } from './vendor/SkeletonUtils.js';
/* ⭐ 联机（第一、二步）：整个联网层在 net.js 里，本文件只留挂钩 ——
   ①这里 import、②fire() 里一句 netFire()、③文件末尾 initNet(...)。
   联机那套挂钩也都走这一行。
   数据是**双向的取值/回填函数**，通过 initNet 的 getFrame / applyFrame 交出去，
   所以 main.js 里既没有 WebSocket、也没有序列化代码。
   ⚠ 安全性靠一条性质保证：**没有对端时 netIsHost() 恒为 true**，
     于是所有 `if (!netIsHost())` 分支在单人下永不执行 = 单人玩完全不变。 */
import {
  initNet, netFire, netIsHost, netPeerAsPlayer,
  netSendDoor, netSendHit, netSendPick, netSendSteal, netSendReady, netSendGun, netSendReroll,
} from './net.js?v=duo101';

/* ── 地图：整层校园（几何 / 程序化贴图 / 材质 / 碰撞数据）全在 ./map.js ──
   这里只把玩法要摸到的那几样拿进来：世界容器、碰撞表、门和抽屉、吊扇、
   建伪装体要用的 box 和材质、以及那个真反射的 Mirror 类。
   ⚠ obstacles / ammoSpots / doorLeft 这些是 map.js 里的 const 或数组：
     只能改内容（push、改字段），不能整体重新赋值 —— ESM 的 import 绑定是只读的。 */
import {
  scene as mapScene, world, obstacles, DOOR_BLOCK, floor2Rects,
  ROOM_H, PLAYER_RADIUS, REST_DOOR_X, REST_DOOR_Z,
  box, makeBookStack, makeRestDoorModel, makeLectureChairModel, makeLectureTableModel, makePcUnit,
  R, newCanvas, sprinkleNoise, Mirror, buildDrawerBox,
  matMetal, matIron, matWhitePlastic, matFanBlade, matChairBlue, matDeskLeg, matWoodDark,
  ammoSpots, doorLeft, doorRight, fanGroup, hallFans, swingDoors, hideLockers,
  HALL_ZM, HALL_X0, HALL_X1, ROOMS, finishMap, setMapRenderer, setMirrorStride,
  nearestSwingDoorAt, FLOOR2_LIFT,
  SW_A0, SW_A1, SW_B0, SW_B1, SW_X0, SW_X1, SW_Z0, SW_Z1, SW_LAND, SW_MID, SW_RUN, SW_RISE,
  SB_A0, SB_A1, SB_B0, SB_B1, SB_ZM, SB_ZP, SB_RUN, SB_RISE, CLS_STB,
  CLS_KS, CLS_FOYER,
} from './map.js?v=duo101';

/* =========================================================================
   尺寸与常量
   ========================================================================= */

/* ROOM_W / ROOM_D / ROOM_H / PLAYER_RADIUS 现在从 ./map.js 进来（见上面的 import）：
   房间尺寸是地图的事，玩法这边不该再有第二份。 */

const EYE_HEIGHT = 1.62;
const WALK_SPEED = 2.4;
const RUN_SPEED = 4.2;
const MOUSE_SENS = 0.0022;

/* 出生点：教休室 YF311 门内 1.5 m（门在房间北墙，玩家面朝北 = 正对门）。
   ⚠ 坐标只从地图拿 REST_DOOR_X/Z，玩法这边不再写第二份。 */
const SPAWN = { x: REST_DOOR_X, z: REST_DOOR_Z + 1.5 };

const LAYER_PLAYER = 1;

/* =========================================================================
   渲染器 / 场景 / 相机
   ========================================================================= */
const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance' });
// 镜子每隔几帧重画一次：默认 3；掉到 40 帧以下切 4，回到 55 帧以上切回 3
let mirrorStride = 3;
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

const camera = new THREE.PerspectiveCamera(72, window.innerWidth / window.innerHeight, 0.05, 260);  // far 提上去：地图从一间房变成一整层，60 米会把远处墙体裁掉
camera.rotation.order = 'YXZ';

// 地图的根（里面已经有它自己的 world 了）挂进真场景；相机、人物、伪装体仍挂在 scene 上
scene.add(mapScene);
setMapRenderer(renderer);          // 贴图各向异性要等渲染器建好才补得上的那批

/* 教休室那道双开木门的状态机在玩法这边：地图只交出两扇门板（doorLeft/doorRight）。
   ⚠ 不能 import 进来再赋值 —— ESM 的 import 绑定是只读的，`doorTarget = 1` 会直接抛。 */
let doorOpen = 0;      // 0 = 全关，1 = 全开（每帧往 doorTarget 插值）
let doorTarget = 0;    // 按 E 翻的就是它；主机权威，随快照的 d 字段广播

/* 穿模审计用。mergeStatic 会把一件件家具并成大网格，之后就再也量不出单个
   物体的包围盒了 —— 所以趁现在还是一个一个独立 mesh，先把世界包围盒抄一份
   存着。等 obstacles 表定义完（它在四千多行之后）再拿 __audit 去比对。 */
const staticBoxes = [];
world.updateMatrixWorld(true);      // ⚠ 必须先刷矩阵：不刷的话 setFromObject 拿到的是
                                    //    局部坐标，一堆包围盒全挤在原点附近，审计结果没法看
world.traverse((m) => {
  if (!m.isMesh) return;
  const b = new THREE.Box3().setFromObject(m);
  if (b.isEmpty()) return;
  staticBoxes.push({
    x0: +b.min.x.toFixed(2), x1: +b.max.x.toFixed(2),
    y0: +b.min.y.toFixed(2), y1: +b.max.y.toFixed(2),
    z0: +b.min.z.toFixed(2), z1: +b.max.z.toFixed(2),
  });
});

/* ── 把地图里现成的物件抓一份，做成躲藏者可变的形态 ──────────────────
   为什么是 clone 而不是照抄尺寸再搭一遍：自己搭一份就是第二套真相 —— 以后谁
   把那件家具改了尺寸，伪装体和地图上那件立刻分叉，而这套代码里已经栽过两次
   （对端人形的手、枪的握点）。趁 mergeStatic 之前一件件还是独立节点，直接克隆，
   几何和材质都是同一份引用，几百件也不占什么。
   ⚠ 哪些算"地图自己的结构"不能靠材质判：matWoodDark 既是门框又是每一张课桌，
      matDoorDark 既是门扇又是音箱，matWhitePlastic 既是窗框又是插座和空调。
      所以只用几何判：
        最薄一维 < 8 厘米   → 纸片/薄片类（挂历 / 海报 / 黑板 / 幕布 / 窗帘 / 地板天花面片）
        最长一维 > 2.4 米    → 墙、横杆、灯条、走线槽、5.6 米那种
        高 > 2.2 米         → 全高的墙块、立管、暖气片柱子
        占地 > 3 平方米      → 地毯、房间 slab、整面墙级的东西
        次短一维 < 15 厘米   → 喷淋头、插座、灯管卡子这种扮了没人看得出的小件
      剩下的就是"一个人可以扮成的家具"。 */
function propEligible(sx, sy, sz) {
  const dims = [sx, sy, sz].sort((a, b) => a - b);
  const thin = dims[0], mid = dims[1], long = dims[2];
  if (thin < 0.08) return false;
  if (mid < 0.15) return false;            // 两条边都不到 15 厘米的东西扮了也没人看得出
  if (long > 2.4 || sy > 2.2) return false;
  if (sx * sz > 3.0) return false;
  return true;
}

/* 名字按"三条边排序后的尺寸签名"查。地图里同类家具的尺寸是一模一样的，所以
   签名比坐标稳；查不到就用尺寸当名字，卡片上反正有渲出来的缩略图，认得出是什么。 */
const PROP_SIGNATURES = [
  [[0.40, 0.40, 0.88], '蓝背椅'],
  // 注意不要收课桌那组尺寸：world 里那张课桌没有抽屉（抽屉挂在 scene 上），克隆
  // 出来的伪装体一眼少一块 —— 课桌走手建的 buildDeskForm。
  // 大教室那种 2.4 m 长桌和翻起座面的椅子也走手建：地图和伪装体共用
  // map.js 的 makeLectureTableModel / makeLectureChairModel，不能靠克隆合批后的节点。
  [[0.50, 0.62, 1.35], '文件柜'],
  [[0.32, 0.32, 0.42], '垃圾桶'],
  [[0.38, 0.44, 0.66], '纸箱'],
  [[0.93, 1.80, 0.78], '窗下书桌'],
  [[0.58, 0.58, 0.45], '小木茶几'],
  [[1.03, 1.26, 1.28], '单人沙发'],
  [[0.86, 1.03, 2.35], '三人沙发'],
  [[0.16, 0.68, 1.03], '暖气片'],
  [[0.20, 0.22, 0.92], '墙上书架'],
  [[0.30, 0.10, 0.26], '沙发靠垫'],
  [[0.02, 0.16, 0.34], '小搁板'],
  [[0.36, 0.06, 1.24], '吊扇'],
];
function propLabel(sx, sy, sz) {
  const sig = [sx, sy, sz].sort((a, b) => a - b);
  for (const [want, name] of PROP_SIGNATURES) {
    if (want.every((v, i) => Math.abs(v - sig[i]) < 0.07)) return name;
  }
  return `${sig.map((v) => v.toFixed(2)).join('×')}`;
}

const PROP_FORMS = [];
const PROP_COUNTS = {};
{
  const ctr = new THREE.Vector3();
  const seen = new Set();               // 同一种家具只留一份代表
  for (const c of world.children) {
    const bb = new THREE.Box3().setFromObject(c);
    if (bb.isEmpty()) continue;
    const s = bb.getSize(ctr);
    if (!propEligible(s.x, s.y, s.z)) continue;
    const sig = propLabel(s.x, s.y, s.z);
    // 没在 PROP_SIGNATURES 里对上号的**不收**。宁可少几样，也不要卡片上出现
    // "大件 / 家具 / 小件"这种玩家看不出是什么的名字 —— 那些以后按截图一件件补。
    if (sig.indexOf('×') >= 0) continue;
    PROP_COUNTS[sig] = (PROP_COUNTS[sig] || 0) + 1;
    if (seen.has(sig)) continue;
    seen.add(sig);
    const src = c.clone(true);          // 几何/材质仍是共享引用
    const ox = (bb.min.x + bb.max.x) / 2, oz = (bb.min.z + bb.max.z) / 2, oy = bb.min.y;
    PROP_FORMS.push({
      key: 'p' + PROP_FORMS.length,
      name: sig,
      hint: `${s.x.toFixed(2)}×${s.y.toFixed(2)}×${s.z.toFixed(2)} 米`,
      base: 'y-',
      dims: [+s.x.toFixed(3), +s.y.toFixed(3), +s.z.toFixed(3)],
      // 建的时候现克隆：同一件可以被两个窗口各摆一份，共用同一个源节点会打架
      build: () => {
        const g = new THREE.Group();
        const m = src.clone(true);
        m.position.x -= ox; m.position.z -= oz; m.position.y -= oy;
        g.add(m);
        return g;
      },
    });
  }
}

try {
  /* 合批 + 二楼克隆都在 map.finishMap() 里。为什么不在地图模块加载时就合完：
     mergeStatic 会 dispose 掉原始几何，而下面那批"从地图家具克隆出来的伪装形态"
     必须在合批之前抓，否则抓到的是废对象。 */
  finishMap();
} catch (err) {
  console.warn('静态合并 / 二楼克隆失败，按原样渲染', err);
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
/* 弹药数值（2026-10-22 重调，全部按"打躲藏者"这一件事来定）：
   damage 现在的含义是**每颗弹丸打在躲藏者身上扣多少**（躲藏者 100 血）——
   以前这个字段是僵尸时代的遗产，tryHitHider 走的是固定 HIDE_DMG=10，
   三把枪打中躲藏者都一样疼；现在改成按枪算（见 tryHitHider）。
     ak  10 / 发          → 10 发打死
     m4  10/1.5 = 6.667   → 15 发打死，但射速是 ak 的 1.5 倍 ⇒ 打死人用时一样
     sg  6.25 × 8 弹丸    → 全部打中 = 50，两枪打死（散布大，近身才算满）
   备弹也压小了：60 / 90 / 16，逼着抓捕者去翻抽屉。 */
const WEAPONS = {
  ak: {
    key: 'ak', name: 'AK-47', file: './assets/ak47.glb',
    magSize: 30, ammo: 30, reserve: 60, reserveMax: 999,
    mode: 'mag', auto: true,                       // 整匣换弹 / 全自动
    interval: 0.088, pellets: 1, damage: 10, headMul: 2, spread: 0.009,
    reloadTime: 2.6, kick: 1.0,
    sound: ['ak1', 'ak2', 'ak3', 'ak4'], reloadSfx: 'reload_rifle', fireSfxVol: 0.95,
    flashPos: new THREE.Vector3(0.02, 0.01, -0.64), flashScale: 1.0,
    loaded: false, rt: null,
  },
  m4: {
    key: 'm4', name: 'M4A1', file: './assets/m4a1.glb',
    magSize: 30, ammo: 30, reserve: 90, reserveMax: 999,
    mode: 'mag', auto: true,
    interval: 0.088 / 1.5, pellets: 1, damage: 10 / 1.5, headMul: 2, spread: 0.006,
    reloadTime: 2.35, kick: 0.85,
    sound: ['rifle1', 'rifle2'], reloadSfx: 'reload_rifle', fireSfxVol: 0.95,
    flashPos: new THREE.Vector3(0.01, 0.01, -0.66), flashScale: 1.0,
    loaded: false, rt: null,
  },
  sg: {
    key: 'sg', name: 'M870 霰弹枪', file: './assets/shotgun.glb',
    magSize: 8, ammo: 8, reserve: 16, reserveMax: 300,
    mode: 'shell', auto: false,                     // 一发一发装填 / 半自动
    interval: 0.82, pellets: 8, damage: 6.25, headMul: 2, spread: 0.050,
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

/* =========================================================================
   模型加载进度 + 进场门
   首屏要拉 3 把枪 + 人物（约 5.6 MB，1 Mbps 上要半分钟以上）。
   加载完之前 #overlay 的点击不生效 —— 否则点进去是一局空场，看起来像坏了。
   进度按字节算（xhr.total 有就给），readiness 交给 DefaultLoadingManager：
   所有经 loader 发出的请求都排完队才置 ready。
   ========================================================================= */
const LOAD = { jobs: [], ready: false };
const ovSub = document.getElementById('ovSub');
const ovBar = document.getElementById('ovBar');
const ovBarWrap = document.getElementById('ovBarWrap');

function loadPct() {
  let got = 0, all = 0;
  for (const j of LOAD.jobs) {
    got += j.loaded || 0;
    all += j.total || j.loaded || 0;      // 没给 Content-Length 的文件按"已下=总量"计，不让分母缩水
  }
  if (!all) return 0;
  return Math.max(0, Math.min(99, Math.round(100 * got / all)));   // 100% 只由 ready 触发
}
function paintLoad() {
  const p = LOAD.ready ? 100 : loadPct();
  if (ovBar) ovBar.style.width = p + '%';
  if (ovBarWrap) ovBarWrap.classList.toggle('hidden', LOAD.ready);
  if (ovSub) {
    ovSub.textContent = LOAD.ready
      ? '点击进入 · 两个人进同一个房间才能一起玩'
      : ('正在加载模型 ' + p + '%');
  }
  /* 全屏加载遮罩。为什么不能只靠 #overlay：躲猫猫自己的等待界面在 hs.phase='lobby'
     时会把 #overlay 藏掉（每帧兜一次），所以进度必须挂在一层更高的遮罩上；
     它也顺便把加载期间的点击全部吃掉 —— "加载完才能进"是它保证的。 */
  const mask = document.getElementById('loadMask');
  const maskSub = document.getElementById('maskSub');
  const maskBar = document.getElementById('maskBar');
  if (maskBar) maskBar.style.width = p + '%';
  if (maskSub) maskSub.textContent = LOAD.ready ? '' : ('正在加载模型 ' + p + '%');
  if (mask) mask.classList.toggle('hidden', LOAD.ready);
}
function loadJob() {
  const j = { loaded: 0, total: 0 };
  LOAD.jobs.push(j);
  paintLoad();
  return j;
}
function loadProgress(job) {
  return (xhr) => {
    if (!xhr) return;
    if (xhr.total) job.total = xhr.total;
    job.loaded = xhr.loaded || 0;
    paintLoad();
  };
}
THREE.DefaultLoadingManager.onLoad = () => { LOAD.ready = true; paintLoad(); };
window.__load = LOAD;      // 观测口，和 window.__net 同一套用法
paintLoad();

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
    loadProgress(loadJob()),
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

    // 量这副骨架：臂长 / 掌心坐标系 / 手指骨 / 腿骨。
    // 和对端那份共用同一个 measureRig —— 两份实例、一套算法。
    {
      const r = measureRig(avatar, mixer);
      if (r) {
        holdBones = r.bones; soldierHandFrame = r.sf; fingerBones = r.fingers; legBones = r.legs;
        rigSelfReady = true;
        console.log('[角色] 手臂骨长：右', r.rL1.toFixed(3), r.rL2.toFixed(3), '左',
          r.bones.lL1.toFixed(3), r.bones.lL2.toFixed(3), '手指骨', r.fingers.length,
          '手掌长', r.sf.R ? r.sf.R.palmLen.toFixed(3) : '?');
        peerMaybeBuild();       // 对端那个人要等"枪模型 + 这副骨架"两边都齐了才能拼
      }
      if (!legBones || !legBones.upL) console.warn('[角色] 找不到腿骨，下蹲只有视角效果');
    }

    window.__avatarReady = true;
    console.log('[角色] Soldier.glb 载入完成：', gltf.animations.map(a => a.name).join(' / '));
  },
  loadProgress(loadJob()),
  (err) => {
    console.warn('[角色] 模型没加载上，继续用程序化身体', err);
  }
);

/* 量一副骨架要用的东西：两条胳膊的分节骨长（IK 用）、两只手的「局部掌心坐标系」、
   每根手指「往掌心弯」的转轴、还有要掰的六根腿骨。
   ⚠ 为什么要抽成函数：镜子里那个人和联机对端那个人是 Soldier.glb 的**两份实例**，
     骨头是两套，这些数字必须各量各的；但"怎么量"的算法只能有一份。
     复制两份的后果我栽过：以后调 IK 只改到一边，两个人姿势悄悄分叉。
   ⚠ 一进来先 mixer.update(0) + updateMatrixWorld(true)：量的是一帧具体姿势下的
     世界坐标。骨架没刷新的话整棵树还停在原点，量出来的骨长全是 0。 */
function measureRig(av, mx) {
  const find = (n) => av.getObjectByName(n);
  const rUp = find('mixamorigRightArm'), rFore = find('mixamorigRightForeArm'), rHand = find('mixamorigRightHand');
  const lUp = find('mixamorigLeftArm'), lFore = find('mixamorigLeftForeArm'), lHand = find('mixamorigLeftHand');
  if (!rUp || !rFore || !lUp || !lFore) {
    console.warn('[角色] 找不到手臂骨头，持枪姿势关掉');
    return null;
  }
  mx.update(0);
  av.updateMatrixWorld(true);
  const s = new THREE.Vector3(), e = new THREE.Vector3(), w = new THREE.Vector3();
  rUp.getWorldPosition(s); rFore.getWorldPosition(e); (rHand || rFore).getWorldPosition(w);
  const rL1 = s.distanceTo(e), rL2 = e.distanceTo(w);
  lUp.getWorldPosition(s); lFore.getWorldPosition(e); (lHand || lFore).getWorldPosition(w);
  const bones = { rUp, rFore, rHand, lUp, lFore, lHand, rL1, rL2, lL1: s.distanceTo(e), lL2: e.distanceTo(w) };

  // 量两只手的「局部掌心坐标系」和手掌长度，用来把士兵的手摆成和枪模型一模一样
  const sf = {};
  const wp = (o) => { const v = new THREE.Vector3(); o.getWorldPosition(v); return v; };
  const wq = (o) => { const q = new THREE.Quaternion(); o.getWorldQuaternion(q); return q; };
  for (const [side, suffix, hand] of [['R', 'Right', rHand], ['L', 'Left', lHand]]) {
    const mid = find('mixamorig' + suffix + 'HandMiddle1');
    const idx = find('mixamorig' + suffix + 'HandIndex1');
    const pky = find('mixamorig' + suffix + 'HandPinky1');
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
    sf[side] = { Qinv: _qWorld.clone().invert(), palmLen: H.distanceTo(M) };
  }

  // 手指骨：每根记下「往掌心弯」的转轴（换到骨头自己的局部空间，之后随便怎么摆手都有效）
  const fingers = [];
  for (const side of ['Right', 'Left']) {
    const one = sf[side === 'Right' ? 'R' : 'L'];
    const hand = find('mixamorig' + side + 'Hand');
    if (!one || !hand) continue;
    // 世界空间里手当前的「手指方向」和「掌心方向」
    const fw = new THREE.Vector3(0, 1, 0).applyQuaternion(wq(hand));
    const pw = new THREE.Vector3(-1, 0, 0).applyQuaternion(wq(hand));
    const axisW = new THREE.Vector3().crossVectors(fw, pw).normalize();
    for (const part of ['Thumb', 'Index', 'Middle', 'Ring', 'Pinky']) {
      for (let i = 1; i <= 3; i++) {
        const b = find('mixamorig' + side + 'Hand' + part + i);
        if (!b) continue;
        const axis = axisW.clone().applyQuaternion(wq(b).invert()).normalize();
        fingers.push({ bone: b, axis, n: i, thumb: part === 'Thumb' });
      }
    }
  }

  // 下蹲 / 跳跃要掰的腿骨（Mixamo 命名，GLTFLoader 会把名字里的冒号去掉）
  const legs = {
    upL: find('mixamorigLeftUpLeg'), loL: find('mixamorigLeftLeg'), ftL: find('mixamorigLeftFoot'),
    upR: find('mixamorigRightUpLeg'), loR: find('mixamorigRightLeg'), ftR: find('mixamorigRightFoot'),
  };

  return { bones, sf, fingers, legs, rL1, rL2 };
}

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

/* 下蹲 / 跳跃的腿姿 + 整体压低。参数化后镜子里的人和对端的人共用同一段：
     th    大腿往前抬的角度，drop 整个人往下压多少，baseY 模型原本的离地高度
   对端那三个数都从网上来（ck = 下蹲程度、jy = 离地高度）。 */
function poseLegs(rig, th, drop, baseY) {
  if (rig.av) rig.av.position.y = baseY - drop;
  const bd = rig.legs;
  if (!bd || th < 0.001) return;
  const bend = (b, a) => { if (b) b.quaternion.multiply(_legQ.setFromAxisAngle(LEG_X, a)); };
  bend(bd.upL, -th);  bend(bd.upR, -th);
  bend(bd.loL, 2 * th); bend(bd.loR, 2 * th);
  bend(bd.ftL, -th);  bend(bd.ftR, -th);
}

// 镜子里那个人用的 rig：每次现取，不缓存（avatar / mirrorGun 都是异步加载好才有的）
function selfRig() {
  return { av: avatar, root: playerModel, gun: mirrorGun, bones: holdBones,
           hf: gunHandFrame, sf: soldierHandFrame, fingers: fingerBones, legs: legBones };
}

/* =========================================================================
   ⭐ 联机：对端那个人 —— 和镜子里那个人**同一套**持枪装置
   -------------------------------------------------------------------------
   为什么这段写在 main.js 而不是 net.js：net.js 只该管"传哪些数字"。
   骨头叫什么名、握点在枪模型的哪一处、换弹时左手往哪走、泵动护木退多少 ——
   这些全是上面那套镜子装置的知识。挪去 net.js 就得把常量抄一份过去，
   而"两处真相"正是第一步对端手枪挂不上那个坑的根因。

   对端那把枪直接**克隆镜子里那把**（def.rt.mirror 里去掉火光的那个子节点）：
   静止位 mirHome、旋转 gunRx/Ry/Rz、自带的手臂和悬空备用弹匣已经藏好了，
   连 gripR / gripL / handFrame 三个握持数都不用再量第二遍。
   ⚠ 唯一不能照搬的是火光：mirFlash 用的是和第一人称同一块 flashMat 材质，
     克隆过来就变成"我开枪、对面那人也亮"。所以对端那团光另造一个 PointLight。
   ========================================================================= */
const peerRig = {
  root: null, av: null, mixer: null, actions: {}, anim: null, baseY: 0,
  bones: null, sf: null, fingers: null, legs: null, ready: false,
  guns: {}, grp: null, gunKey: null, wantGun: null,
  magRec: null, pumpRec: null, gripR: null, gripL: null, hf: null,
  flash: null, flashT: 0, kickT: 0, home: null,
};
const _peerOff = new THREE.Vector3();
let rigSelfReady = false;      // 镜子里那副骨架量好了没（对端要等它，握持数才凑得齐）
const peerRigView = () => ({ av: peerRig.av, root: peerRig.root, gun: peerRig.grp,
  bones: peerRig.bones, hf: peerRig.hf, sf: peerRig.sf, fingers: peerRig.fingers, legs: peerRig.legs });

// 骨骼没量好之前什么都别干；两件事各自异步完成，谁先到都行
function peerMaybeBuild() {
  if (!rigSelfReady || !peerRig.root) return;
  if (!peerRig.av) return;                       // 等 Soldier.glb
  if (peerRig.wantGun && !peerRig.guns[peerRig.wantGun]) peerGun(peerRig.wantGun);
}

function peerBuild() {
  if (peerRig.root) return;
  const root = new THREE.Group();
  root.visible = false;
  scene.add(root);
  peerRig.root = root;
  new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).load('./assets/Soldier.glb', (gltf) => {
    const av = gltf.scene;
    av.traverse((o) => {
      if (!o.isMesh) return;
      o.layers.enable(0);        // 主相机要看得见（镜子里那个人是给镜子相机看的）
      o.frustumCulled = false;
      o.castShadow = false;      // 阴影是静态烘焙的，动的人不投影
      o.receiveShadow = false;
    });
    root.add(av);
    peerRig.av = av;
    peerRig.baseY = av.position.y;
    const mx = new THREE.AnimationMixer(av);
    peerRig.mixer = mx;
    for (const c of gltf.animations) {
      if (c.name === 'TPose') continue;
      peerRig.actions[c.name] = mx.clipAction(c);
    }
    if (peerRig.actions.Idle) { peerRig.anim = peerRig.actions.Idle; peerRig.anim.play(); }
    // 和对端共用量法：这副骨架的臂长 / 掌心系 / 手指骨 / 腿骨，各量各的
    const r = measureRig(av, mx);
    if (!r) { console.warn('[联机] 对端骨架量不出手臂骨，只摆身体不摆手里那把枪'); return; }
    peerRig.bones = r.bones; peerRig.sf = r.sf; peerRig.fingers = r.fingers; peerRig.legs = r.legs;
    peerRig.ready = true;
    peerMaybeBuild();
    console.log('[联机] 对端那个人装好了（和镜子里同一套持枪 IK）');
  }, loadProgress(loadJob()), (err) => console.warn('[联机] 对端模型没加载上', err));
}

function peerAnim(name) {
  const next = peerRig.actions[name];
  if (!next || peerRig.anim === next) return;
  next.reset().setEffectiveWeight(1).fadeIn(0.2).play();
  if (peerRig.anim) peerRig.anim.fadeOut(0.2);
  peerRig.anim = next;
}

// 对端手里那把枪：第一次用到哪把才现克隆（枪模型是各自异步加载的，不能假设都好了）
function peerGun(key) {
  peerRig.wantGun = key;
  if (!peerRig.root) return;
  if (peerRig.guns[key]) { if (peerRig.gunKey !== key) peerApplyGun(key); return; }
  const def = WEAPONS[key];
  if (!def || !def.rt) return;                 // 这把枪的模型还在加载，下一帧再试
  const src = def.rt.mirror.children.find((c) => c !== def.rt.mirFlash);
  if (!src) return;
  const c = src.clone(true);
  c.traverse((o) => { if (o.isMesh) { o.layers.enable(0); o.frustumCulled = false; } });
  const grp = new THREE.Group();
  grp.add(c);
  grp.position.copy(def.rt.mirror.position);   // 已经是"对齐握点之后"的静止位
  grp.rotation.copy(def.rt.mirror.rotation);
  grp.visible = false;
  peerRig.root.add(grp);
  const magNode = c.getObjectByName('Magazine');
  const pumpNode = c.getObjectByName('Pump');
  const fl = new THREE.PointLight(0xffc46a, 0, 3.2, 2);
  fl.layers.enable(0);
  fl.position.copy(def.flashPos || new THREE.Vector3(0, 0.035, -0.64));
  fl.scale.setScalar(def.flashScale || 1);
  grp.add(fl);
  peerRig.guns[key] = {
    grp, flash: fl, home: def.rt.mirror.position.clone(), def,
    magRec: magNode ? { node: magNode, base: magNode.position.clone() } : null,
    pumpRec: pumpNode ? { node: pumpNode, base: pumpNode.position.clone() } : null,
  };
  if (peerRig.wantGun === key) peerApplyGun(key);
}

function peerApplyGun(key) {
  const g = peerRig.guns[key];
  if (!g) return;
  for (const k in peerRig.guns) peerRig.guns[k].grp.visible = (k === key);
  peerRig.gunKey = key;
  peerRig.grp = g.grp;
  peerRig.home = g.home;
  peerRig.magRec = g.magRec;
  peerRig.pumpRec = g.pumpRec;
  peerRig.flash = g.flash;
  peerRig.gripR = g.def.rt.gripR;
  peerRig.gripL = g.def.rt.gripL;
  peerRig.hf = g.def.rt.handFrame;
}

// 对端报来一次开枪：枪口亮一下、往后顶一下
function peerFire() { peerRig.flashT = 0.05; peerRig.kickT = 0.05; }

/* 把对端这一帧摆出来。st 里的数全是 net.js 从网上收到的：
     x z yaw 站位和朝向   jy 离地高度   ck 下蹲程度   air 是否腾空
     a 身体动画          w 哪把枪
     u 换弹进度(-1=没在换)  k 泵动进度   o 换弹时左手相对护木的位移(枪本地)
   ⚠ 左手位移是**发的那一侧算好再传**的：rifleHandOff / shotgunHandOff 都读
     发送方自己的当前武器和弹匣节点，接收方要重算就得把这两个函数也参数化，
     换回来的只是三个数字 —— 抄一份算法不值。 */
function peerDrive(st, dt) {
  // 先记下这一帧的姿态再判 pr.ready：躲藏者的形象/问号不依赖骨架是否就绪，
  // 而且抓捕者可能是对端，拿不到 netPeerAsPlayer()，只能靠这里存的这份。
  if (st) {
    peerPose.x = st.x; peerPose.z = st.z; peerPose.yaw = st.yaw || 0;
    peerPose.jy = st.jy || 0; peerPose.flip = st.flip || 0;
    peerPose.mnt = st.mnt | 0;            // 他贴的是地面 / 墙 / 天花板
    peerPose.oy = st.oy || 0;             // 他自己那个形象的实际朝向（含按 Enter 定住）
    peerPose.ma = Number.isFinite(st.ma) ? st.ma : NaN;   // 他贴的哪面墙；不是贴墙就 NaN
    peerPose.spin = st.spin || 0;               // 他滚轮转了多少（绕他自己那面的法线）
    peerPose.at = performance.now();
  }
  const pr = peerRig;
  if (!pr.ready || !st) return;

  const k = Math.min(1, dt * 14);
  pr.root.position.x += (st.x - pr.root.position.x) * k;
  pr.root.position.z += (st.z - pr.root.position.z) * k;
  pr.root.position.y += ((st.jy || 0) - pr.root.position.y) * k;
  let dy = (st.yaw || 0) - pr.root.rotation.y;
  while (dy > Math.PI) dy -= Math.PI * 2;
  while (dy < -Math.PI) dy += Math.PI * 2;
  pr.root.rotation.y += dy * Math.min(1, dt * 12);

  const u = st.u === undefined ? -1 : st.u;
  const pk = st.k || 0;
  const ck = st.c || 0;
  // 枪歪多少直接用发送方算好的（霰弹枪那种"一发一发装"的歪法跟整匣换弹不一样，
  // 靠 u 是推不出来的）；老版本没这个字段时退回按 u 现算。
  const tilt = st.tl !== undefined ? st.tl : (u >= 0 ? reloadPose(u).tilt : 0);

  if (pr.wantGun && st.w && pr.gunKey !== st.w) peerGun(st.w);
  if (!pr.grp) peerGun(st.w || 'ak');

  // 弹匣：没在换弹就归位，在换就照同一条时间轴摆（setMagPose 本来就只看 rec + u）
  if (pr.magRec) {
    if (u < 0) {
      pr.magRec.node.position.copy(pr.magRec.base);
      pr.magRec.node.rotation.set(0, 0, 0);
      pr.magRec.node.visible = true;
    } else setMagPose(pr.magRec, u);
  }
  if (pr.pumpRec) pr.pumpRec.node.position.z = pr.pumpRec.base.z + PUMP_TRAVEL * pk;

  pr.kickT = Math.max(0, pr.kickT - dt);
  const kick = pr.kickT > 0 ? pr.kickT / 0.05 : 0;
  if (pr.grp && pr.home) {
    pr.grp.position.set(pr.home.x, pr.home.y - CROUCH_DROP * ck, pr.home.z + kick * 0.05);
    pr.grp.rotation.set(HOLD.gunRx + 0.10 * tilt + kick * 0.18,
                        HOLD.gunRy - 0.16 * tilt,
                        HOLD.gunRz - 0.62 * tilt);
  }

  pr.mixer.update(dt);
  peerAnim(st.a || 'Idle');
  poseLegs(peerRigView(), CROUCH_THIGH * ck + 0.38 * (st.air ? 1 : 0), CROUCH_DROP * ck, pr.baseY);
  if (st.o) _peerOff.set(st.o[0], st.o[1], st.o[2]); else _peerOff.set(0, 0, 0);
  poseArms(peerRigView(), { pk, rWeight: st.rw === undefined ? (u >= 0 ? 1 : 0) : st.rw,
                             rOff: _peerOff, gripR: pr.gripR, gripL: pr.gripL });

  // ⚠ 衰减写在 if 外面：材质/灯没挂上时也要让它落回 0，
  //   不然会卡在最后一次赋值上，看着像"在闪"其实一动不动（第一步踩过）
  pr.flashT = Math.max(0, pr.flashT - dt);
  if (pr.flash) pr.flash.intensity = pr.flashT > 0 ? 7 : 0;
}

function peerVisible(on) { if (peerRig.root) peerRig.root.visible = !!on; }
// 给 net.js 挂名字牌用（牌子归 net.js，人归 main.js）
function peerRootObj() { return peerRig.root; }


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
const _reloadLTmp = new THREE.Vector3();

/* rig = 一副"会持枪的人"：
     rig.av    骨架所在的模型（镜子里的是 avatar，对端是它自己那份）
     rig.root  这个角色站的位置（playerModel / peer.root）
     rig.gun   身前那把枪（镜子里的 mirror group / 对端那份克隆）
     rig.hf    枪自带的握持骨架给出的 { R:{F,P}, L:{F,P} }
     rig.sf    这个人的两只手的掌心坐标系（每副骨架各量各的）
   ⚠ 之所以做成参数而不是继续用模块级的 avatar / mirrorGun / soldierHandFrame：
     镜子里的人和联机对面的人是**两份不同的骨架实例**。算法只留一份，
     数字各量各的 —— 否则以后调 HOLD 或改 IK 只会改到一边，两个人姿势就分叉了。 */
function solveArm(rig, up, fore, hand, targetLocal, poleLocal, L1, L2, side) {
  if (!up || !fore) return;
  up.getWorldPosition(_S);
  _T.copy(targetLocal).applyMatrix4(rig.root.matrixWorld);
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
  _p.copy(poleLocal).transformDirection(rig.root.matrixWorld);
  _p.addScaledVector(_n, -_p.dot(_n));
  if (_p.lengthSq() < 1e-6) _p.set(0, -1, 0).addScaledVector(_n, -_n.dot(new THREE.Vector3(0, -1, 0)));
  _p.normalize();

  _E.copy(_S).addScaledVector(_n, a).addScaledVector(_p, h);

  aimBoneWorld(up, _dir.subVectors(_E, _S));
  rig.av.updateMatrixWorld(true);

  fore.getWorldPosition(_S);
  aimBoneWorld(fore, _dir.subVectors(_T, _S));

  // 手掌：直接照抄枪模型自带握持骨架的手指方向和掌心方向
  if (hand && rig.hf && rig.sf && rig.gun) {
    rig.av.updateMatrixWorld(true);
    const gf = rig.hf[side], sf = rig.sf[side];
    if (!gf || !sf) return;
    _b1.copy(gf.F).transformDirection(rig.gun.matrixWorld);   // 手指该朝哪
    _b2.copy(gf.P).transformDirection(rig.gun.matrixWorld);   // 掌心该朝哪
    basisQuat(_b1, _b2, _qWorld);
    _qWorld.multiply(sf.Qinv);
    hand.parent.getWorldQuaternion(_qParent).invert();
    hand.quaternion.copy(_qParent.multiply(_qWorld));
  }
}

// 手指弯曲：绕着「掌心法线 × 手指方向」转，手指就朝掌心弯
const _curlQ = new THREE.Quaternion();

function curlFingers(fingers) {
  if (!fingers || !HOLD.curl) return;
  for (const f of fingers) {
    const ang = (f.n === 1 ? 0.50 : f.n === 2 ? 0.85 : 0.60) * HOLD.curl * (f.thumb ? 0.55 : 1);
    f.bone.quaternion.multiply(_curlQ.setFromAxisAngle(f.axis, ang));
  }
}

/* 把两条手臂掰到枪上。p 里是"这一帧该摆成什么样"的四个数：
     p.pk      泵动进度 0~1（护木后拉，左手跟着走）
     p.rWeight 左手离枪的权重 0~1（换弹时手要离开护木去摸弹匣）
     p.rOff    换弹时左手相对护木握点的位移（枪本地坐标）
     p.gripR/L 这把枪的两个握点（从枪模型自带的握持骨架里读出来的）
   镜子里那个人传自己算出来的数，对端传从网上收到的数 —— 同一段代码。 */
function poseArms(rig, p) {
  const bd = rig.bones;
  if (!bd || !HOLD.show || !rig.gun || !p.gripR || !p.gripL || !rig.hf || !rig.sf) return;
  rig.gun.updateMatrix();
  rig.root.updateMatrixWorld(true);   // 这一下会把骨架整棵树一起刷新

  // 枪骨架的 Hand 骨和士兵的手骨都在手腕上，直接对齐就行
  _targetR.copy(p.gripR).applyMatrix4(rig.gun.matrix);

  // 泵动时左手跟着护木一起后移（护木在枪模型本地 +z 方向后退）
  if (p.pk > 0) {
    _gripLTmp.set(p.gripL.x, p.gripL.y, p.gripL.z + PUMP_TRAVEL * 0.45 * p.pk);
  } else {
    _gripLTmp.copy(p.gripL);
  }
  _targetL.copy(_gripLTmp).applyMatrix4(rig.gun.matrix);

  // 换弹时左手离开护木：和第一人称共用同一条路线（握点 + 位移，再换到角色空间）
  if (p.rWeight > 0.001) {
    _reloadLTmp.copy(p.gripL).add(p.rOff).applyMatrix4(rig.gun.matrix);
    _targetL.lerp(_reloadLTmp, p.rWeight);
  }

  solveArm(rig, bd.rUp, bd.rFore, bd.rHand, _targetR, HOLD.rPole, bd.rL1, bd.rL2, 'R');
  solveArm(rig, bd.lUp, bd.lFore, bd.lHand, _targetL, HOLD.lPole, bd.lL1, bd.lL2, 'L');
  curlFingers(rig.fingers);
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

let started = false;           // 点过开始、锁上鼠标才算
/* 门**没有自动开关**：只有人按 E 才动（对端按 E 走请求、由主机改门位）。
   原来那套"开局 10 秒自动开、之后开 13 秒 / 关 9 秒循环"整条删掉了 —— 一扇会自己
   开的门，在躲猫猫里等于给抓捕者送一个"门刚开、快进"的信号。 */

/* =========================================================================
   音效系统（WebAudio）
   —— 素材全部 CC0，出处见 素材来源.txt
   —— 枪声/换弹/脚步都是「贴耳」的 2D 声，不做距离衰减
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

/* =========================================================================
   射击系统
   ========================================================================= */
const raycaster = new THREE.Raycaster();
raycaster.far = 30;
const shotDir = new THREE.Vector3();

/* ── 玩家生命 ─────────────────────────────────────── */
const MAX_HP = 100;
let playerHP = MAX_HP;
let hurtFlash = 0;
let lastHurtAt = -999;         // 上次掉血的时刻，用来算脱战回血
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

// 单颗弹丸：打中墙留个洞，打中花瓶就碎
function shootPellet(dir) {
  raycaster.set(camera.position, dir);

  /* 打墙的射线要打**整张地图**：原来只打一楼的 world，人在二楼开枪时二楼的墙
     完全不在射线里 —— 隔着楼板/隔墙也能打中对面。mapScene 里是 1F + 2F 整层。 */
  const targets = [mapScene];
  if (!vaseBroken) targets.push(vase);
  const hits = raycaster.intersectObjects(targets, true);
  const wallHit = hits.length ? hits[0] : null;
  const wallT = wallHit ? wallHit.distance : Infinity;

  // 躲藏者那个物体挡在墙前面就算打中他，一枪 10 点、不分部位
  if (tryHitHider(dir, wallT)) return;

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
  // 躲藏者没有枪；抓捕者还在门外时也打不出去
  if (gameOver || fireCooldown > 0 || iAmHider() || catcherWaiting() || huntFrozen()) return;
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
  netFire();                     // 联机：让对端看见枪口火光

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
    shootPellet(_pelletDir);
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

  // 每局把门推回关着：上一局末了它是开是关都别带过来
  started = locked;            // 死了鼠标会松开：重新点进来才算下一局
  doorTarget = 0;
  doorOpen = 0;
  doorLeft.rotation.y = 0;
  doorRight.rotation.y = 0;
  // 新地图那 13 樘推拉门和储物柜也一样：每局全关（两边都从同一份状态摆回去）
  doorState.swing.fill(0);
  doorState.lock.fill(0);
  applyDoorState();

  // 抽屉全部关上（"这一局用过了"的记号在 startRound 里随 hs.stolen 一起清）
  for (const s of ammoSpots) {
    s.open = false; s.cur = 0;
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
  pos: new THREE.Vector3(SPAWN.x, 0, SPAWN.z),
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
/* 水平位移一步最多走这么远，再大的位移拆成小步。
   墙只有 0.12 米厚：疾跑 4.2 m/s 掉到 10 帧时一帧 0.42 米，人从"离墙 0.32"
   一步就能跨过墙中线，pushOutOfBox 会按"离哪边近"把人推到墙的另一侧 ——
   这就是疾跑穿墙。拆到 8 厘米后，每一步都还没到墙中线，推回的方向永远是对的。 */
const MOVE_SUBSTEP = 0.08;
const topOf = (b) => (b.top === undefined ? ROOM_H : b.top);
/* 新地图是两层：二楼那些盒子的 `base` = 二楼地板高度。人在一楼时它们悬在头顶上，
   既不该挡横向的路、也不该当台面 —— 1.55 是"至少差一个多身高才算上下两层"，
   这样从楼梯走上来的时候会自然接上，而在一楼贴着二楼家具侧面走不会被吸住。 */
const onMyLevel = (b, feetY) => b.base === undefined || feetY + 1.55 >= b.base;

function resolveObstacles(x, z, feetY = 0) {
  for (const b of obstacles) {
    if (!onMyLevel(b, feetY)) continue;
    if (topOf(b) <= feetY + STEP_UP) continue;   // 已经在它顶上，横向不管
    [x, z] = pushOutOfBox(x, z, b);
  }
  if (doorOpen < 0.45) [x, z] = pushOutOfBox(x, z, DOOR_BLOCK);
  return [x, z];
}

/* 天花板上面挡"顶到人胸口以上"的东西：脚在 3.00 时一楼墙已经齐脚底，身体真正
   撞上的是二楼那份墙（base=3.06、整层高），以及二楼门洞上方 2.4 米高的门楣。
   桌子、椅子、矮柜（<2 米）不挡 —— 否则二楼满屋桌椅会把天花板爬行整条封死；
   它们也低于这个高度上人的胸口。 */
function resolveWalls(x, z, feetY = 0) {
  for (const b of obstacles) {
    if (!onMyLevel(b, feetY)) continue;
    const t = topOf(b);
    if (t <= feetY + STEP_UP) continue;
    if (b.top !== undefined && t - (b.base === undefined ? 0 : b.base) < 2.0) continue;
    [x, z] = pushOutOfBox(x, z, b);
  }
  return [x, z];
}

/* 爬墙只认"墙"：obstacles 里带 top 的是有台面的东西（桌椅、暖气片），
   人可以站上去，不需要挂在它侧面；不带 top 的才是全高的墙和柜子侧面，
   那才是能贴上去爬的东西。判据和 pushOutOfBox 用同一个 —— 把请求点往
   盒子上夹，夹完距离小过一个身位(PLAYER_RADIUS)就是"正顶着这面墙"。 */
function wallAhead(x, z, feetY) {
  for (const b of obstacles) {
    if (!onMyLevel(b, feetY)) continue;
    const t = topOf(b);
    if (t <= feetY + STEP_UP) continue;
    /* 只认"从脚下一直长到天花板"的墙。有台面的家具（桌子、柜子）是踩上去的，不是挂
       上去的；但二楼的墙和楼梯间的墙带 top（它们是整层盒子），原来一律 `top ===
       undefined` 判墙，把这两类全排除在外 —— 表现在二楼就是"哪面墙都爬不上去"。 */
    if (b.top !== undefined && t - (b.base === undefined ? 0 : b.base) < ROOM_H - 0.2) continue;
    const cx = clamp(x, b.minX, b.maxX), cz = clamp(z, b.minZ, b.maxZ);
    if (Math.hypot(x - cx, z - cz) < PLAYER_RADIUS + 0.02) return true;
  }
  return false;
}

/* ⭐ 爬墙只认**真实的墙**。obstacles 只是碰撞盒：有些"整层高"的矩形在模型里根本
   没有对应的墙（房间包络、补洞盒），光靠它判，人会在空教室里贴着一面看不见的墙
   往上爬（他反馈的就是这个）。
   这里从胸口朝移动方向打一条 0.75 m 的射线，必须真的命中一块**近乎竖直**的面：
   |法线·Y| > 0.6 的是地板、天花板、桌面，一律不算。返回那面墙朝外的法线，
   用来在"爬着爬着墙没了"的时候松手。 */
const _wallRay = new THREE.Raycaster();
const _wallN = new THREE.Vector3();
const _wallRayO = new THREE.Vector3();
const _wallRayD = new THREE.Vector3();
function realWallAt(x, z, feetY, dx, dz, maxD = PLAYER_RADIUS + 0.40) {
  const len = Math.hypot(dx, dz);
  if (len < 1e-6) return null;
  // 射线起点在胸口，但不能高过脚下这一层的天面：人爬到 2.9 m 时胸口已经越过 3.0 的墙顶
  const chest = Math.min(feetY + 1.05, storeyTop(feetY) - 0.12);
  _wallRayO.set(x, Math.max(storeyBase(feetY) + 0.10, chest), z);
  _wallRayD.set(dx / len, 0, dz / len);
  _wallRay.set(_wallRayO, _wallRayD);
  _wallRay.near = 0.01;
  _wallRay.far = maxD;
  /* 打**整张地图**，不是只有 world：楼梯间那几面墙在 stairG 里（不进 world，
     否则会被整层克隆到二楼），只打 world + 二楼的话楼梯间的墙全成了"隐形墙"，
     在楼梯里永远爬不上去。 */
  for (const h of _wallRay.intersectObjects([mapScene], true)) {
    if (!h.face) continue;
    _wallN.copy(h.face.normal).transformDirection(h.object.matrixWorld);
    if (Math.abs(_wallN.y) > 0.6) continue;
    return { nx: _wallN.x, nz: _wallN.z, d: h.distance };
  }
  return null;
}
/* 爬墙射线单次实测 12~17 ms（整张地图），原来贴墙时每帧要打 1~2 条。
   位置/朝向/脚高变化不大时复用上一次结果；0.10~0.12 秒或走开 0.3 米再重探。
   这不是视觉近似：墙的法线在这么短的距离内不会变，变的是"墙还在不在"，
   由重探的间隔兜住。 */
const wallProbeCache = {
  t: -1e9, x: NaN, z: NaN, ux: NaN, uz: NaN, feet: NaN, maxD: 0, result: null,
};
function realWallAtCached(x, z, feetY, dx, dz, maxD = PLAYER_RADIUS + 0.40, minGap = 0.10) {
  const len = Math.hypot(dx, dz);
  if (len < 1e-6) return null;
  const ux = dx / len, uz = dz / len;
  const now = performance.now();
  const moved = Math.hypot(x - wallProbeCache.x, z - wallProbeCache.z);
  const dot = ux * wallProbeCache.ux + uz * wallProbeCache.uz;
  if (now - wallProbeCache.t < minGap && moved < 0.30 && dot > 0.90
      && Math.abs(feetY - wallProbeCache.feet) < 0.30
      && maxD <= wallProbeCache.maxD + 1e-6) {
    return wallProbeCache.result;
  }
  const r = realWallAt(x, z, feetY, dx, dz, maxD);
  wallProbeCache.t = now; wallProbeCache.x = x; wallProbeCache.z = z;
  wallProbeCache.ux = ux; wallProbeCache.uz = uz;
  wallProbeCache.feet = feetY; wallProbeCache.maxD = maxD; wallProbeCache.result = r;
  return r;
}

/* 天花板上面哪些地方"有东西可站"。不写死矩形：地图里天花板本来就好几块
   （外壳那道 addPlane、走廊那道 slabRect、各教室各自的顶），写死一个数就等着
   某块板子边缘能走出去三步再飘在天上。这里直接从合并前的那批世界包围盒里挑
   "顶面≈ROOM_H"的块：天花板板、墙顶、高柜顶都算 —— 于是既能顺着板面前后左右
   随便爬、也能越过墙顶（墙本来就到 ROOM_H，站在墙顶是合理的），而楼外面的
   空中没有任何东西，自然就挡住了。 */
const ceilTops = [];
for (const b of staticBoxes) {
  if (Math.abs(b.y1 - ROOM_H) > 0.20) continue;
  if (b.x1 - b.x0 <= 0 || b.z1 - b.z0 <= 0) continue;
  ceilTops.push({ minX: b.x0, maxX: b.x1, minZ: b.z0, maxZ: b.z1 });
}
function hasCeilingUnder(x, z) {
  for (const r of ceilTops) {
    if (x >= r.minX && x <= r.maxX && z >= r.minZ && z <= r.maxZ) return true;
  }
  return false;
}

/* 天花板是**连成一片**的，而墙顶和板面又齐平（都在 3.00）：只查"脚下有没有板"的话，
   翻上去之后可以一路爬进隔壁房间 —— 可门框上面明明是实墙。
   所以翻上去的那一刻记下所在的那块地面矩形（房间 / 走廊 / 办公室各一块，来自地图的
   floor2Rects），之后只在它里面爬。矩形边缘是墙中线，再让一个身位就正好贴着墙内面。 */
let ceilZone = null;
/* 只认**包含这个点**的那块地面矩形，不再取最近邻。
   最近邻会出事：人贴在楼梯间/墙顶时脚下没有矩形，最近的那块可能在隔壁房间，
   之后 ceilClamp 一夹就是把人从墙这边**拽**到墙那边 —— 这正是"天花板疾跑
   穿墙"的画面来源。找不到就不让翻上天花板，留在墙上。 */
function zoneRectAt(x, z) {
  for (const r of floor2Rects) {
    if (x >= r[0] && x <= r[1] && z >= r[2] && z <= r[3]) return r;
  }
  return null;
}
function ceilClampX(x) {
  return ceilZone ? clamp(x, ceilZone[0] + PLAYER_RADIUS, ceilZone[1] - PLAYER_RADIUS) : x;
}
function ceilClampZ(z) {
  return ceilZone ? clamp(z, ceilZone[2] + PLAYER_RADIUS, ceilZone[3] - PLAYER_RADIUS) : z;
}

/* 每个楼梯间的踏步级数（map.js buildStairA 的 N=13 / buildStairB 的 N=15）。
   坡面抬一级踏高时要用它，空中落到梯面下的兜底也要用。 */
const SW_STEP_RISE = SW_RISE / 13;
const SB_STEP_RISE = SB_RISE / 15;

// 脚下这块地上「最高的可站台面」：家具顶就是它的 top，空地是 0
const STAND_MARGIN = 0.02;     // 台面判定几乎按脚底中心算（放宽会让贴墙站着被「吸」上暖气片）
/* ⚠ feetY 是必需的：新地图有两层，二楼的台面（3.06 / 家具顶 3.5…）对一楼的人来说
   全在头顶上，不能当脚底下的地。原来那份没有 feetY，因为那时整张图只有一个地面。
   楼梯用坡面而不是逐级盒子：踏面 0.2 m 小于人的半径，逐级会把人卡在两级之间。 */
function groundAt(x, z, feetY = 0) {
  let g = 0;
  /* 二楼楼板：脚要够到**楼板面**（ROOM_H + FLOOR2_LIFT）才算站在二楼。
     原来比的是 ROOM_H（3.00），可是人翻上一楼天花板时脚底正好是 3.00：
     于是 3.06 的二楼地板成了"脚底上方 6 厘米的小台阶"——从天花板松手会**往上落**
     到二楼，也就是"爬着爬着突然穿墙到楼上"。 */
  if (feetY + STEP_UP >= ROOM_H + FLOOR2_LIFT) {
    for (const r of floor2Rects) {
      if (x > r[0] - 0.06 && x < r[1] + 0.06 && z > r[2] - 0.06 && z < r[3] + 0.06) {
        g = ROOM_H + FLOOR2_LIFT; break;
      }
    }
  }
  for (const b of obstacles) {
    const t = b.top;
    if (t === undefined) continue;
    if (b.base !== undefined && feetY + 0.02 < b.base) continue;   // 二楼的东西，一楼踩不到
    if (t > feetY + STEP_UP) continue;          // 头顶上的台面不算
    if (t <= g) continue;
    if (x > b.minX - STAND_MARGIN && x < b.maxX + STAND_MARGIN &&
        z > b.minZ - STAND_MARGIN && z < b.maxZ + STAND_MARGIN) g = t;
  }
  // 楼梯间 A：西跑北→南升、东跑南→北升、北端上平台
  /* ⚠ 连续坡面要抬一级踏高。踏步盒的顶面是 (k+1)*rise，而原来的坡面正好压在
     第 k 级踏面的**后沿**、越往踏面前沿越低一整级（B 0.10 m / A 0.115 m）——
     视觉上就是"碰撞比台阶低，伪装体的下半截埋进台阶里"。抬一个 rise 之后，
     坡面在一级踏面内落在"该级顶面 ~ 上一级顶面"之间（中段高半级，0.05 m），
     任何位置都不低于脚下这一级，绝不会再埋进台阶；到半平台/二楼封顶，
     不会把人顶过平台面。 */
  if (x > SW_A0 && x < SW_A1 && z > SW_LAND && z < SW_MID) {
    g = Math.max(g, Math.min(SW_RISE, (z - SW_LAND) / SW_RUN * SW_RISE + SW_STEP_RISE));
  }
  if (x > SW_B0 && x < SW_B1) {
    if (z > SW_LAND && z < SW_MID) {
      g = Math.max(g, Math.min(SW_RISE * 2, SW_RISE + (SW_MID - z) / SW_RUN * SW_RISE + SW_STEP_RISE));
    } else if (z >= SW_Z0 && z <= SW_LAND && feetY > SW_RISE * 2 - 0.35) {
      /* 东跑顶到二楼平台那 1.4 m 再铺一层"虚拟顶步"。坡面公式到 z=3.8 就断，
         而二楼楼板要求脚 ≥3.06-STEP_UP，脚在 2.93 跨过 3.8 时会两边都接不住：
         中间那 1 cm 缝让人直接漏到一楼平台。只对已经接近梯顶的脚生效，
         一楼的脚（≈0）仍按平地算，不会被抬到 3 m。 */
      g = Math.max(g, SW_RISE * 2);
    }
  }
  if (x > SW_X0 && x < SW_X1 && z >= SW_MID) g = Math.max(g, SW_RISE);
  // 楼梯间 B：双跑折返，西跑 0→1.5、半平台 1.5、东跑 1.5→3.0
  if (x > SB_A0 && x < SB_A1 && z > SB_ZM && z < SB_ZP) {
    g = Math.max(g, Math.min(SB_RISE, (SB_ZP - z) / SB_RUN * SB_RISE + SB_STEP_RISE));
  }
  if (x > SB_B0 && x < SB_B1) {
    if (z > SB_ZM && z < SB_ZP) {
      g = Math.max(g, Math.min(SB_RISE * 2, SB_RISE + (z - SB_ZM) / SB_RUN * SB_RISE + SB_STEP_RISE));
    } else if (z >= SB_ZP && z <= CLS_STB[3] && feetY > SB_RISE * 2 - 0.35) {
      // 同 A：东跑顶步与二楼楼板之间的接缝（z=0.4），只给接近梯顶的脚搭桥
      g = Math.max(g, SB_RISE * 2);
    }
  }
  if (x > CLS_STB[0] && x < CLS_STB[1] && z >= CLS_STB[2] && z <= SB_ZM) g = Math.max(g, SB_RISE);
  return g;
}

/* 楼梯可站面（只在“脚已经低于梯面”时救人用）。只算四跑、两个半平台和梯间的
   一楼地面，**不算二楼楼板**：二楼楼板比一楼天花板高 6 cm，从天花板松手时
   绝不能再靠这条把人吸上去（那是以前的穿墙 bug）。 */
function stairSurfaceAt(x, z) {
  let g = null;
  const put = (v) => { g = g === null ? v : Math.max(g, v); };
  const inA = x > SW_X0 && x < SW_X1 && z > SW_Z0 && z < SW_Z1;
  const inB = x > CLS_STB[0] && x < CLS_STB[1] && z > CLS_STB[2] && z < CLS_STB[3];
  if (inA || inB) put(0);
  if (x > SW_A0 && x < SW_A1 && z > SW_LAND && z < SW_MID) {
    put(Math.min(SW_RISE, (z - SW_LAND) / SW_RUN * SW_RISE + SW_STEP_RISE));
  }
  if (x > SW_B0 && x < SW_B1 && z > SW_LAND && z < SW_MID) {
    put(Math.min(SW_RISE * 2, SW_RISE + (SW_MID - z) / SW_RUN * SW_RISE + SW_STEP_RISE));
  }
  if (inA && z >= SW_MID) put(SW_RISE);
  if (x > SB_A0 && x < SB_A1 && z > SB_ZM && z < SB_ZP) {
    put(Math.min(SB_RISE, (SB_ZP - z) / SB_RUN * SB_RISE + SB_STEP_RISE));
  }
  if (x > SB_B0 && x < SB_B1 && z > SB_ZM && z < SB_ZP) {
    put(Math.min(SB_RISE * 2, SB_RISE + (z - SB_ZM) / SB_RUN * SB_RISE + SB_STEP_RISE));
  }
  if (inB && z >= CLS_STB[2] && z <= SB_ZM) put(SB_RISE);
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
  /* 模型没加载完就锁鼠标 = 进了一局空场（对面隐身、自己也没枪），
     看起来就像坏了。这里先按住，进度条走完才放行。 */
  if (!LOAD.ready) { paintLoad(); return; }
  canvas.requestPointerLock();
});

document.addEventListener('pointerlockchange', () => {
  locked = document.pointerLockElement === canvas;
  // 真正开打：从这一刻起算波次和 10 秒开门；按 Esc 松开鼠标等于暂停
  started = locked;
  overlay.classList.toggle('hidden', locked || gameOver || hsUiUp());
  if (!locked) {
    for (const k in keys) keys[k] = false;
    mouseDown = false;
  }
});

document.addEventListener('mousedown', (e) => {
  initAudio();
  if (!locked || e.button !== 0) return;
  if (catcherWaiting()) return;   // 等待界面里鼠标可能还锁着：这一下不能当开枪/翻滚
  mouseDown = true;
  if (iAmHider()) { hideFlip(); return; }   // 躲藏者没枪：左键是翻跟头
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

/* 屏幕中间那句提示的原文。提成常量而不是两处各写一遍：抓捕者靠近"躲藏者变的门 /
   变的课桌"时看到的必须和靠近真门、真抽屉时**逐字相同**，这正是伪装的一部分；
   文案一旦分叉，他一眼就能从提示词分辨真假。 */
const PROMPT = {
  drawerPull: '按 E 拉开抽屉拿子弹',
  drawerBack: '按 E 关回去',
  doorOpen: '按 E 开门',
  doorClose: '按 E 关门',
  lockerOpen: '按 E 拉开柜门',
  lockerBack: '按 E 关上柜门',
};

/* ── 新地图那 13 樘推拉门 + 实验室储物柜 ────────────────────────────────
   和教休室那道双开木门同一套规矩：**只有主机那份是权威**，对端按 E 只发一个请求，
   状态随快照里的 sw / lk 两个 0/1 串报回来。两边跑的是同一份地图、同一个数组顺序，
   所以按序号对齐就够，不用传坐标。
   ⚠ rect.top（门板挡不挡人）必须在"状态变了"这一刻两边各自改一遍，不能只在按的人
     那边改 —— 否则一边能走过去、一边被同一扇门挡住，又是分叉。 */
const doorState = {
  swing: new Array(swingDoors.length).fill(0),
  lock: new Array(hideLockers.length).fill(0),
};
function applyDoorState() {
  for (let i = 0; i < swingDoors.length; i++) {
    const d = swingDoors[i], on = doorState.swing[i] === 1;
    if (!!d.open === on) continue;
    d.open = on;
    if (d.rect) d.rect.top = on ? 0 : 2.4;
    if (d.rect2) d.rect2.top = on ? 0 : ROOM_H + 2.4;
  }
  for (let i = 0; i < hideLockers.length; i++) {
    const u = hideLockers[i], on = doorState.lock[i] === 1;
    if (!!u.open === on) continue;
    u.open = on;
    if (u.rect) u.rect.top = on ? 0 : 2.4;
    if (u.rect2) u.rect2.top = on ? 0 : ROOM_H + 2.4;
  }
}
function nearestSwingDoor() { return nearestSwingDoorAt(player.pos.x, player.pos.z); }
/* 储物柜只算一楼、而且人得真在实验室那一侧（走廊北墙 z=2.4 那边）。
   不加这两条的话，站在走廊里隔着墙就能把柜门拉开。 */
function nearestHideLocker() {
  if (player.pos.z > 2.40 || jumpY >= ROOM_H) return null;
  let best = -1, bestD = 1.6;
  for (let i = 0; i < hideLockers.length; i++) {
    const u = hideLockers[i];
    const d = Math.hypot(player.pos.x - u.x, player.pos.z - u.z);
    if (d < bestD) { bestD = d; best = i; }
  }
  return best < 0 ? null : best;
}
function toggleMapDoor(i) {
  if (netIsHost()) { doorState.swing[i] ^= 1; applyDoorState(); }
  else netSendDoor(3, i);
}
function toggleMapLocker(i) {
  if (netIsHost()) { doorState.lock[i] ^= 1; applyDoorState(); }
  else netSendDoor(4, i);
}

function nearDoor() {
  return Math.hypot(player.pos.x - REST_DOOR_X, player.pos.z - REST_DOOR_Z) < 2.2;
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
  /* 判断必须排在开关动作**前面**。空掉的抽屉是永远敞着的，而原来第一行是
     s.open = !s.open —— 抓捕者按 E 会先把这个敞开的抽屉"关上"再静默 return：
     既没有任何提示，又抹掉了"这格用过了"的记号，再按一次才看得到话。 */
  if (iAmHider()) { stealAmmoSpot(s); return; }
  if (s.stolen) {
    s.open = true;
    showBanner(`${s.name}这一局已经空了`, 1.6);
    return;
  }
  /* 抽屉只刷抓捕者**这一局选的那把枪**的子弹：ak 30 / m4 45 / sg 8。
     以前是一把抽屉同时给步枪和霰弹两种，那等于逼他三把枪都留着，和"开局选一把"
     冲突。枪还没锁定时兜到 ak，不至于给 0 发。 */
  const key = WEAPONS[hs.gun] ? hs.gun : 'ak';
  const d = WEAPONS[key];
  const add = Math.min(DRAWER_AMMO[key] || 0, d.reserveMax - d.reserve);
  s.open = true;
  if (add <= 0) { showBanner(`${d.name}备弹已经满了（上限 ${d.reserveMax}）`, 1.8); updateAmmoUI(); return; }
  d.reserve += add;
  /* 真的拿到子弹才算"这格用过了"；满了没拿就不消耗，回头还能来。
     一回合一个抽屉只有一次，没有 12 秒补货那套了。 */
  spendSpot(s);
  updateAmmoUI();
  showBanner(`${s.name}：${d.name} +${add} 发 · 这格用过了`, 2.0);
}

window.addEventListener('keydown', (e) => {
  initAudio();
  // H 随时开关说明；开着的时候任何游戏键都不许透下去。
  if (e.code === 'KeyH' && !e.repeat) { e.preventDefault(); toggleHelp(); return; }
  if (helpOpen) {
    if (e.code === 'Escape') setHelp(false);
    e.preventDefault();
    return;
  }
  keys[e.code] = true;
  if (hideFrozen && HIDE_MOVE_CODES.includes(e.code)) hideFrozen = false;   // 一动就恢复跟随
  if (e.code === 'KeyR') startReload();
  if (e.code === 'KeyE' && !e.repeat && !huntFrozen()) {      // 按住不放不会反复开关
    const spot = nearestAmmoSpot();
    /* 一次按键只做一个动作，按这个优先级来：抽屉（有子弹，最该顺手）> 教休室那道
       双开木门 > 走廊/教室的推拉门 > 实验室储物柜 > 玩家变的门 / 桌子抽屉。
       后两个是"伪装体"，故意排在最后 —— 抓捕者站在真门和假门中间时，先开真的。 */
    const sw = spot ? null : nearestSwingDoor();
    const lk = (sw || spot) ? null : nearestHideLocker();
    if (spot) useAmmoSpot(spot);
    else if (nearDoor()) {
      // ⭐ 联机：门的开关权在主机。对端按 E 只发一个请求，本地不动 doorTarget，
      //   等快照把门位报回来 —— 不然两边门会一开一关地打架。
      if (!netIsHost()) { netSendDoor(); }
      else doorTarget = doorTarget > 0.5 ? 0 : 1;      // 就这一句：门只认 E
    }
    else if (sw) toggleMapDoor(swingDoors.indexOf(sw));
    else if (lk !== null && lk !== undefined) toggleMapLocker(lk);
    else if (atDisguisePart('door')) {
      /* 拉那扇"门"—— 它可能是躲藏者变的。开合权同样归主机：对端只发请求，
         等快照把 hs.door 报回来，两边才不会出现一开一关。 */
      if (!netIsHost()) netSendDoor(1);
      else toggleDisguiseDoor();
    }
    else if (atDisguisePart('drawer', false)) {
      /* 拉开那副"抽屉"：**只有抓捕者拉得动**（他查子弹本来就是这个动作）。变成桌子
         的躲藏者自己拉自己没有意义，所以这里传 pullableByMe=false。里面是空的 ——
         它和 ammoSpots 没有任何关联，所以拉开既拿不到子弹，也不会像"有子弹的抽屉"
         那样反而把人引过来。开合权一样归主机，两边各自播同一段推拉动画。 */
      if (!netIsHost()) netSendDoor(2);
      else toggleDisguiseDrawer();
    }
  }
  // 躲猫猫：鼠标锁定时系统光标是隐藏的，DOM 按钮点不到，所以选形和"先进去"
  // 必须同时有键盘这条路 —— 只挂 onclick 等于把玩家锁死在门外。
  if (hs.phase === 'pick' && iAmHider()) {
    const slot = e.code === 'Digit1' ? 0 : e.code === 'Digit2' ? 1 : e.code === 'Digit3' ? 2 : -1;
    // 走 hs.forms 而不是 HIDE_FORMS：卡片是每局随机那三个，数字键必须和屏幕上
    // 看到的第几张对得上，按 HIDE_FORMS 的下标会差一个。
    if (slot >= 0) { hidePick(hs.forms[slot]); return; }
  }
  if (e.code === 'CapsLock') {
    // 贴在墙上 / 天花板上时的"松手"键（Tab 把爬墙关掉也走同一条，见下面那段）。
    // 用 Caps 是因为它不在任何移动键里，爬的时候不会误触；按下之后大小写灯会翻一次，
    // 这是这台机器上换这个便利的代价。
    if (iAmHider() && attached()) detachMount();
    return;
  }
  if (e.code === 'Tab') {
    // 爬墙开关（只属于躲藏者）。抓捕者没有爬墙这回事，所以他的 Tab 原样留给浏览器
    // 跳焦点 —— 等待界面上那颗「准备」还得能用键盘选到。
    if (!iAmHider()) return;
    e.preventDefault();
    climbOn = !climbOn;
    /* 关掉的这一下，正贴着墙/顶着天花板就当场和 Caps Lock 一样松手：他要的是
       "我不爬了"，留他挂在半空和屏幕上那句"爬墙 关"对不上。
       Enter 的定住也一起解掉 —— 竖直方向第一段判的就是 hideFrozen，不解的话
       它会继续把他钉在空中，看起来就像按了没反应。 */
    if (!climbOn && attached()) { hideFrozen = false; detachMount(); }
    updateClimbStat();
    return;
  }
  if (e.code === 'Enter') {
    // 躲藏者觉得自己躲好了：按 Enter 冻结朝向，之后转头，形象也不跟着转
    if (iAmHider() && hs.form && hs.phase !== 'end') { hideFrozen = true; return; }
  }

  if (iAmHider()) return;      // 躲藏者没有枪，1/2/3/Q 不该去换武器
  /* 这三键现在是"选枪"而不是"随便换枪"：结果要写进 hs.gun（主机权威），并且
     躲藏者一躲完就锁死。锁了之后再按没有反应 —— 抽屉只刷手上这把的弹，
     允许中途换枪会让"哪把枪有补给"这件事变得没有意义。 */
  if (e.code === 'Digit1') chooseGun('ak');
  if (e.code === 'Digit2') chooseGun('m4');
  if (e.code === 'Digit3') chooseGun('sg');
  if (e.code === 'KeyQ') {
    const i = WEAPON_ORDER.indexOf(hs.gun);
    chooseGun(WEAPON_ORDER[(i + 1) % WEAPON_ORDER.length]);
  }
});
window.addEventListener('keyup', (e) => { keys[e.code] = false; });
window.addEventListener('blur', () => { for (const k in keys) keys[k] = false; });
/* 滚轮：躲藏者把自己那个形象绕"底座法线"拧一点。只有变成物体之后、并且已经进场
   才生效 —— 还在选形界面或者被关在地图外时滚轮要留给页面本身。
   抓捕者这边不响应：他没有可转的形象（他手上的枪是 viewmodel，不该被滚轮拧）。 */
window.addEventListener('wheel', (e) => {
  if (gameOver || !iAmHider() || !hs.form || catcherWaiting()) return;
  if (!e.deltaY) return;
  hideSpin = spinBy(e.deltaY, hideSpin);
}, { passive: true });

/* =========================================================================
   每帧更新
   ========================================================================= */
const clock = new THREE.Clock();
let walkPhase = 0;
let elapsed = 0;

const promptEl = document.getElementById('prompt');
let promptText = '';

// ---- 大字播报 ----
const bannerEl = document.getElementById('banner');
let bannerT = 0;

function showBanner(txt, sec = 3) {
  if (!bannerEl) return;
  bannerEl.textContent = txt;
  bannerEl.classList.add('show');
  bannerT = sec;
}

let fpsAcc = 0, fpsFrames = 0, lowStreak = 0;

function tickPerf(dt) {
  fpsAcc += dt;
  fpsFrames++;
  if (fpsAcc < 1) return;

  const fps = fpsFrames / fpsAcc;

  // 保险：万一上下文被系统挂起，立刻拉回来，下一枪不会等它醒
  if (audioState.ctx && audioState.ctx.state !== 'running') audioState.ctx.resume();

  /* 画面掉到 40 帧以下时，镜子改成每 4 帧画一次，把帧时间省下来；正常则每 3 帧。
     ⚠ Mirror 类现在住在 map.js 里，它读的是**它那一份** mirrorStride ——
       只改这边这个变量的话，降帧会静默失效（镜子照样每 3 帧画一次）。
       所以这边留的只是"我上次要求的是几"，真值必须用 setMirrorStride 推过去。 */
  if (fps < 40 && mirrorStride !== 4) { mirrorStride = 4; setMirrorStride(4); }
  else if (fps > 55 && mirrorStride !== 3) { mirrorStride = 3; setMirrorStride(3); }

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

/* =========================================================================
   躲猫猫：角色分配、回合状态机、三个可变形象
   -------------------------------------------------------------------------
   角色不需要两边协商：主机在快照里带一个 hiderIsGuest 位，
     主机   iAmHider = !hiderIsGuest
     对端   iAmHider =  hiderIsGuest
   各算各的就一致了，也省得把 net.js 里的 slot 暴露出去。
   hs 只有主机推进（相位、倒计时、血量、胜负），对端整份从快照里抄 ——
   和门的时间轴是同一套权威模型。
   ========================================================================= */
/* 双人测试版 1 的相位：
   lobby 双方都点"准备" → pick 躲藏者在地图外选形象 → 选完才把他放进地图，
   同时开始 hide 30 秒倒计时（两边都看得见秒数）→ 时间到才把抓捕者放进地图
   hunt 60 秒 → end 结算 8 秒 → 换角色开下一局。
   pick 故意不给超时：躲藏者不选，这局就不该往下走。 */
const HIDE_T = { lobby: 1e9, pick: 1e9, hide: 30, hunt: 60, end: 8 };
const HIDE_HP = 100;          // 躲藏者血量
const HIDE_DMG = 10;          // 兜底伤害：拿不到当前武器时才用（正常路径按枪的 damage 算）
const HIDE_ROUNDS = 3;        // 共几局，每局换角色，先赢两局的拿整场

/* 进地图时的落点见文件顶部 SPAWN：新教休室 YF311 门内，两个人都从这里进场。 */

const hs = {
  round: 0, phase: 'lobby', tLeft: 0,
  hiderIsGuest: 1, hp: HIDE_HP, form: '', dead: false,
  wins: [0, 0],               // [主机方胜局, 对端方胜局]
  winner: -1,                 // 本局谁赢了：0 主机方 / 1 对端方 / -1 还没打
  stolen: [],                 // 被躲藏者掏空的抽屉下标（ammoSpots 的 index）
  ready: 0,                   // 准备位：bit0=主机 bit1=对端，凑满 3 才开打
  forms: [],                  // 这一局摆出来的三个形象（从四个里随机抽，主机定）
  door: 0,                    // 伪装门板的开合目标：0 关 / 1 开（主机权威，两边同读）
  drawer: 0,                  // 伪装课桌抽屉的开合目标：同上，拉开没有子弹
  gun: '',                    // 抓捕者这一局用哪把枪；'' = 还没选（主机权威）
  gunLocked: 0,               // 躲藏者躲完（hide→hunt）就锁死，之后不许再换
  gunRandom: 0,               // 锁定时还没选 ⇒ 随机发的那一把（两边各提示一次）
};

/* 抽屉一次给多少发 —— 只给抓捕者**手上这一把**的，别的枪不刷。
   一回合一个抽屉只能拿一次（拿完就标 used，没有定时补货了）。 */
const DRAWER_AMMO = { ak: 30, m4: 45, sg: 8 };

/* ── 开局选枪 ──────────────────────────────────────────────────────
   只有抓捕者选，选的结果记在 hs.gun 上（主机权威、随快照广播，两边同一把）。
   时间闸在"躲藏者躲完"那一刻：hide→hunt 一切换就 lockGun()，那时还没选就随机
   发一把，之后整局不许再换（换了抽屉刷的弹就对不上了）。
   hs.gun 初值是空串而不是 'ak'：默认成 AK 的话，抓捕者会以为自己已经选过了。 */
/* 什么时候点得动：只有躲藏者挑形象(pick)和他正在躲(hide)这两段。
   lobby（准备界面）不算 —— 那会儿两个人还在"点准备"那一屏，枪却在同一块遮罩里
   能点，点完了没人能改（锁定看的是躲藏者躲完那一刻，不是开局那一刻）。 */
const gunPickable = () => !hs.gunLocked && (hs.phase === 'pick' || hs.phase === 'hide');
function chooseGun(key) {
  if (!gunPickable() || !WEAPONS[key]) return;
  if (netIsHost()) netApplyGun(key);
  else netSendGun(key);
  /* 选完枪就把鼠标收回游戏。第一局抓捕者本来没锁鼠标，如果等他进场再点
     那层"点击进入"，浏览器重新给指针锁会晚一帧以上，就是"视角卡一下再动"。
     借这次按键/点击的用户手势提前锁上；之后要换枪仍然按 1/2/3。 */
  if (LOAD.ready && !locked && !iAmHider() && (hs.phase === 'pick' || hs.phase === 'hide')) {
    try {
      const p = canvas.requestPointerLock();
      if (p && p.catch) p.catch(() => {});
    } catch (_) {}
  }
}
function netApplyGun(key) {
  if (!gunPickable() || !WEAPONS[key]) return;
  hs.gun = key;
}
function lockGun() {
  if (hs.gunLocked) return;
  if (!WEAPONS[hs.gun]) {
    const k = WEAPON_ORDER[Math.floor(Math.random() * WEAPON_ORDER.length)];
    hs.gun = k;
    hs.gunRandom = 1;                 // 用来在两边都提示一句"随机发的"
  }
  hs.gunLocked = 1;
}
let sawGunLock = 0;

let hideFrozen = false;       // 躲藏者按 Enter 之后，形象和高度都不再动
let climbing = false;         // 这一帧是不是正贴在墙上（每帧重算）
let onCeiling = false;        // 脚底已经翻上天花板面（y=ROOM_H）
const HIDE_MOVE_CODES = ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'Space', 'KeyC',
  'ShiftLeft', 'ShiftRight', 'ControlLeft', 'ControlRight'];

/* ── 空中翻滚 ──────────────────────────────────────────────────────
   躲藏者没有枪，左键空着，就给他一个翻跟头。
   进度 flipP 走 0→1 表示翻了 360°，只在空中推进；一落地立刻收尾成 1，
   否则可能正好卡在 90° —— 形象侧躺在地上就再也站不直了。
   时长取一次起跳到落地的时间（JUMP_SPEED 5.1 / GRAVITY 15 → 约 0.68 秒），
   所以落地那一帧基本刚好收满一圈。 */
const FLIP_TIME = 0.66;
let flipP = 0;
let selfYaw = 0;              // 形象自己的朝向：冻结时就停在最后一次的值
let hideSpin = 0;             // 滚轮加在形象上的额外转角（弧度）
/* 滚轮转体。⚠ 转的是"绕底座法线自转"，不是绕自己横轴滚 —— 区别在贴到墙上之后：
     地面 / 天花板：底座法线是竖直的 ⇒ 绕世界 Y 转，就是平时说的"原地转个方向"
     墙面：底座法线是**水平的**（戳进墙里那条）⇒ 只能绕那条法线转，像把一幅画在
       墙上拧一下。这时候要是还绕世界 Y 转，底座就会从墙里拔出来横着转；绕自己
       横轴转则变成空翻（那是左键那个 flip 干的事）。
   所以转角不并进 yaw，单独一个值发给他那边，两边各自按自己算出的法线转。
   ⚠ 符号：这套代码里前方是 −Z、+X 是右，从上面俯视时 yaw 增大是逆时针 ⇒
   "往上推 = 顺时针"要让它**减小**。左右反了靠肉眼看屏幕很难发现，所以拆成纯函数
   并在测试里用真 three 量前向向量往哪边偏。一格 15°：转一圈 24 格，够细也点得动。 */
const SPIN_STEP = Math.PI / 12;
function hideWrap(a) {
  const t = (a + Math.PI) % (Math.PI * 2);
  return (t < 0 ? t + Math.PI * 2 : t) - Math.PI;
}
function spinBy(deltaY, cur) { return hideWrap(cur + (deltaY < 0 ? -SPIN_STEP : SPIN_STEP)); }

/* 二段跳：只有躲藏者有。第一次跳完之后在空中再按一次跳，能凭空再蹬一下；
   用掉就没了，重新踩到地面才攒回来 —— 所以不存在三段跳，空中第三次按跳
   没有任何反应（就是继续往下落）。
   抓捕者不给：他本来就有枪有弹药，再多一跳就太能追了。
   第二下力度 0.9 倍，手感上像"借力"而不是把第一次复制一遍。 */
let airJumpLeft = false;
function tryJump(v) {
  /* 爬墙 / 贴住墙或天花板时不能跳，也不能借二段跳弹开：这两个动作会把人从附着
     状态里拽出来，表现出来就是"爬着爬着翻个跟头往上蹿"。要下来只走 Caps Lock
     （见 update 的 attached 分支），那一条不走这里。
     ⚠ climbing 也要算：贴墙刚起步、人还站在梯面/地面上时 wallMount 还是 false，
     只判 attached() 会漏掉这一帧，按下跳照样能弹开。 */
  if (attached() || climbing) return false;
  if (grounded) {
    grounded = false; jumpV = v; crouchK = 0;
    airJumpLeft = iAmHider();
    return true;
  }
  if (iAmHider() && airJumpLeft) {
    airJumpLeft = false;
    jumpV = v * 0.9;
    return true;
  }
  return false;
}

function hideFlip() {
  if (huntFrozen()) return;
  if (!tryJump(JUMP_SPEED)) return;
  flipP = 0.001;                       // 二段跳也重新翻一圈
}

function updateFlip(dt) {
  if (flipP <= 0) return;
  flipP = grounded ? 1 : flipP + dt / FLIP_TIME;
  if (flipP >= 1) flipP = 0;
}

/* 摆一个形象：先按朝向站正，再绕"它自己的左右轴"翻。
   用 rotateX 而不是直接写 rotation.x —— 后者受欧拉顺序影响，
   加了 yaw 之后翻的方向就不是想象中的前后空翻了。
   ⚠ 负号是方向：本地 +X 指向"右"，绕 +X 正转按右手定则把头顶甩向 +Z，
   而这套代码里前方是 −Z（见 update 里的 fx=-sin, fz=-cos），所以正转是
   后翻。要向前翻就得取负。 */
/* 摆一个形象。参数从一堆位置量改成一个"摆位描述"，因为现在要带的东西多了：
   位置、朝向(或贴墙算好的四元数)、底座倾斜、滚轮自转、空翻。
   顺序是有讲究的：先立好底座，再绕**底座法线**自转，最后才叠空翻（空翻是绕自己
   横轴滚，和自转不是一回事）。自转用 rotateOnWorldAxis 而不是改 yaw —— 贴在墙上
   的时候法线是水平的，改 yaw 会把底座从墙里拔出来。 */
const _spinAxis = new THREE.Vector3();
function poseHideObj(obj, p, flip) {
  obj.position.set(p.x, p.y, p.z);
  if (p.quat) obj.quaternion.copy(p.quat);
  else obj.rotation.set(0, p.yaw || 0, 0);
  if (p.tilt) obj.rotateX(p.tilt);
  const a = p.spinAxis;
  if (p.spin && a) obj.rotateOnWorldAxis(_spinAxis.set(a[0], a[1], a[2]), p.spin);
  if (flip > 0) obj.rotateX(-flip * Math.PI * 2);
}

/* 变成风扇的那一型，叶片要转。地图里那台真风扇本来就是每帧转的（见 fanGroup
   和 animate 里那句 += dt*1.6），伪装体不转就等于告诉抓捕者"这个是假的"。
   角度直接用 elapsed*1.6 而不是自己累加 dt：两边各自累加会漂出两个相位，
   而抓捕者那台机器上的真风扇走的就是 elapsed 这条时间轴。 */
function spinFormFan(obj) {
  const b = obj && obj.userData.blades;
  if (!b) return;
  const s = obj.userData.spin || { axis: 'z', rate: 1.6 };
  b.rotation[s.axis] = elapsed * s.rate;
}

/* 形象该摆在多高。绝大多数形象的原点就是"脚底"，摆 jumpY 即可；吊扇的原点是
   "天花板上的钉点"、几何全挂在下方，照脚底摆就等于整台钻进地板里看不见也
   打不着 —— 那等于凭空一个无敌状态。所以带 footLift 的形象按**脚底 + footLift**
   抬起来：一楼、二楼、楼梯上都一样，风叶最低点始终在脚下地面之上。
   （旧写法是 max(feetY, 0.45) 的绝对高度，脚底一超过 0.45 —— 上二楼、上楼梯 ——
   就不起作用，吊扇整台又垂到楼板下面去了。） */
function formMountY(kind, feetY) {
  const def = hideFormOf(kind);
  return def && def.footLift !== undefined ? feetY + def.footLift : feetY;
}

/* ── 贴在哪个面上 ─────────────────────────────────────────────────
   天花板就是"地面的反转版"：可以在上面跑，底座钉在板面上，身子垂回房间里。
   墙也一样：贴上去的时候该朝外的是这个形象自己的**底面**（壁扇是背面那根支架、
   吊扇是那截吊头），而不是像在地上跑那样仍然脚底朝下。
   所以每个形象在 HIDE_FORMS 里声明自己的底座在哪一面（base: 'y-' / 'z-' / 'y+'），
   贴上去时把那一面转到指向所贴的面上。 */
const MOUNT = { FLOOR: 0, WALL: 1, CEIL: 2 };
let wallMount = false;      // 正贴在墙上
const climbWallN = { x: 0, z: 0 };   // 贴的那面墙朝外的法线：爬墙中途用它确认墙还在
/* 贴墙时用的是哪面墙（法线方位角）+ 伪装体抽屉的开度。两个都是"只有变的人自己
   知道"的显示状态，必须发出去：对面自己重新量一遍墙会量到另一面上去（墙角、柱子
   旁边差几十厘米就是不同的面），于是自己看是正的、对面看是歪的。 */
let myMountAz = NaN;
/* 伪装体上那些"能拉开的部件"：门板、课桌的抽屉。开合目标一律放 hs 里，由主机改、
   随快照广播，两边各自把自己那帧的动画量往同一个目标推。
   为什么不放在躲藏者本地（抽屉原来就是 drawerWant 本地一份）：**拉的人常常是
   抓捕者**，拉的人不是拥有的人，状态只待在拥有者本地就会出现"他那边拉开了、
   我这边还关着"，而且抓捕者按 E 干脆没反应。
   这两个部件和 ammoSpots 没有任何关联 —— 拉开就是空的，一枪发子弹都摸不到。 */
let drawerK = 0, disDoorK = 0;
function toggleDisguiseDoor() { hs.door = hs.door > 0.5 ? 0 : 1; }
function toggleDisguiseDrawer() { hs.drawer = hs.drawer > 0.5 ? 0 : 1; }
/* 面前是不是这件带可拉部件的伪装体（'door' 门板 / 'drawer' 课桌抽屉）。
   pullableByMe=false 的部件躲藏者自己拉不动 —— 抽屉就是：自己变成桌子再把自己的
   抽屉拉开没有任何意义，那只会让自己更暴露；这个动作是留给抓捕者的诱饵。
   距离判据用 peerPose（对端发来的位置），不用伪装体的渲染位置：伪装体每帧被
   formPlace 挪去贴墙贴顶，拿它当"够不够得着"会随姿态漂。 */
function atDisguisePart(flag, pullableByMe) {
  const def = hideFormOf(hs.form);
  if (!def || !def[flag]) return false;
  if (iAmHider()) return pullableByMe !== false;  // 自己够得着自己的形象（除非明令禁止）
  // 距离用这件东西在地图里本来的触发半径（门 2.2 / 抽屉 1.5），抓捕者才分辨不出
  const reach = def.reach || 1.15;
  return peerAlive() && Math.hypot(player.pos.x - peerPose.x, player.pos.z - peerPose.z) < reach;
}
// 变成门就不许爬墙（也就上不了天花板）：门框的"底"是门槛，抱到墙上没有说得通的贴法
/* 爬墙的总开关（Tab 切换，默认开）。这是**本机本地的输入闸门**，不上网络：
   抓捕者看到的永远是他发来的 mnt/oy/ma，而这个开关只管"这边还让不让人往墙上贴"。
   关掉的时候如果正贴着，当场按 Caps Lock 那一套松手掉下来（见上面 keydown 那段）。 */
let climbOn = true;
const canClimb = () => climbOn && iAmHider() && !(hideFormOf(hs.form) || {}).noClimb;
function myMount() { return onCeiling ? MOUNT.CEIL : wallMount ? MOUNT.WALL : MOUNT.FLOOR; }
/* 贴在墙上 = 和站在地上一样稳：不吃重力、不会滑下来。唯一的出口是按 Caps Lock
   松手（见 keydown），以及落地 / 爬到没有墙的地方。 */
const attached = () => onCeiling || wallMount;
/* 主动松手：从墙上或天花板上放开来往下掉。现在只有 Caps Lock（和 Tab 关爬墙）走这里；
   空格是跳跃键，贴在墙上时必须彻底没反应，不再兼职松手。
   ⚠ 从墙面松手时先看脚下：楼梯上有可能人已经站在梯面上（或贴墙滑到上坡，
   脚比梯面低），这时该直接落地，不能再判"悬空"—— 悬空后只认从上方落下的
   落地判据接不住比梯面低的脚，人就一路掉出地图。天花板那条路不变。 */
function detachMount() {
  const wasWall = wallMount;
  onCeiling = false; wallMount = false; ceilZone = null;
  if (wasWall) {
    const g = groundAt(player.pos.x, player.pos.z, jumpY);
    if (sameStorey(g, jumpY) && jumpY <= g + 0.02) {
      jumpY = g; grounded = true; jumpV = 0; return;
    }
  }
  grounded = false; jumpV = 0;
}
/* 脚下这一层的天面 / 地面高度：一楼 3.00 / 0，二楼 6.06 / 3.06。
   爬墙、翻顶、贴顶取景都得用"这一层"的数。原来全写死 ROOM_H：在二楼贴着墙一按
   前进，jumpY 立刻被钳到 3.00（比二楼地板还低）—— 表现出来就是"二楼的墙爬不上去"。 */
const storeyTop = (feet) => (feet >= ROOM_H + FLOOR2_LIFT - 0.02 ? ROOM_H * 2 + FLOOR2_LIFT : ROOM_H);
const storeyBase = (feet) => (feet >= ROOM_H + FLOOR2_LIFT - 0.02 ? ROOM_H + FLOOR2_LIFT : 0);
/* 两处高度算不算同一层。一楼天花板 3.00 和二楼楼板 3.06 只差 6 厘米，
   光看高度会被当成普通台阶；攀爬/贴墙/松手时一跨层，人就"从一楼穿到二楼"了。 */
const sameStorey = (a, b) => Math.abs(storeyBase(a) - storeyBase(b)) < 1e-3;
/* 脚下这地方真正的天花板绝对高度。楼梯间是两层通高的（6 m），不能套 storeyTop：
   站在缓梯上脚高 2.9 时 storeyTop 还报 3.0，相机会被压到离脚 0 米甚至脚底以下，
   高爬时再触发"贴顶仰视"，镜头直接钻进梯段 —— "爬楼梯途中视角穿墙"就是这两处。
   房间照旧按层高，楼梯间按 6 m。 */
const inStairwell = (x, z) =>
  (x >= SW_X0 && x <= SW_X1 && z >= SW_Z0 && z <= SW_Z1) ||
  (x >= CLS_STB[0] && x <= CLS_STB[1] && z >= CLS_STB[2] && z <= CLS_STB[3]);
const localCeilY = (x, z, feetY) => (inStairwell(x, z) ? ROOM_H * 2 : storeyTop(feetY));
// 贴得够高就算到了"墙和天花板的交界处"：这时候自拍视角自动翻成仰视
const highMount = () => onCeiling
  || (wallMount && jumpY > localCeilY(player.pos.x, player.pos.z, jumpY) - 0.85);

/* 把底座转到指向要贴的那个面。返回的是在 yaw 之后绕**本地 X** 转的角度，
   所以算的是"形象自己的坐标轴"：本地 −Z 是脸朝的方向（见 update 里 fx=-sin,fz=-cos）。
   贴墙 = 底座要去 −Z；贴顶 = 底座要去 +Y。
     y-（普通形象，底面在下）：墙 → +90°（头顶甩向身后、脚底戳进墙）；顶 → 180°（整个倒挂）
     z-（壁扇，背面已经朝 −Z）：墙 → 不用转；顶 → +90°
     y+（吊扇，吊头在上）：墙 → −90°（吊头戳进墙、叶片伸回房间）；顶 → 不用转 */
function baseTilt(base, mount) {
  if (mount === MOUNT.CEIL) return base === 'y+' ? 0 : base === 'z-' ? Math.PI / 2 : Math.PI;
  if (mount === MOUNT.WALL) return base === 'z-' ? 0 : base === 'y+' ? -Math.PI / 2 : Math.PI / 2;
  return 0;
}

/* 这一个形象贴在这个面上时该摆在哪、转多少。三处都是"底座正好落在那个面上"：
   贴顶 → 钉在板面 y=ROOM_H、身子垂回房间；贴墙 → 底座贴到墙面上；地面 → 脚底。
   贴墙那支原来只是"往脸的方向挪一个身位"，那是近似：人贴着斜墙时脸的方向不必
   垂直于墙面，挪完要么扎进墙里要么还悬着 —— 所以改成从 obstacles 里把真正挡住
   他的那面墙找出来（夹最近点的法线方向），沿那条法线贴上去，和碰撞用的是同一套
   几何，不再靠猜。 */
/* 贴墙时的朝向不能一刀切。原来不管尺寸都"把底面怼进墙"，于是空调（0.20×0.30×0.92，
   最长那条边本来就在水平方向）被转成一根竖条贴在墙上 —— 那是横着挂的空调被掰竖了。
   正确做法看它自己的三边：
     · 最长的一边就是"高"（椅子、桌子、箱子、垃圾桶）→ 站到墙上：自己的 +Y 顶出墙面、
       底面贴在墙上。
     · 最长的一边在水平方向（空调、暖气片、书架、长条桌）→ 横着贴：+Y 仍然朝上，
       最薄的那根轴戳进墙，最长的沿墙横着 —— 就是它在地图里原本挂在墙上的那个姿势。
   三根轴直接按"世界方向"指派，不再绕本地 X 猜角度。 */
/* 这个形象站得直不直：最长的那条边是自己的"高"。三处都得用同一个判据 ——
   贴墙的朝向(wallMountQuat)、往墙里挪多少(wallPush)、滚轮自转轴(formPlace)，
   各判各的会互相打架：站姿说它横贴、自转轴却按站姿给，一转就把底座从墙里拔出来。 */
const standsTall = (d) => d[1] >= Math.max(d[0], d[2]);
const _waX = new THREE.Vector3(), _waY = new THREE.Vector3(), _waZ = new THREE.Vector3();
const _waOut = new THREE.Vector3(), _waMat = new THREE.Matrix4();
const _WA_UP = new THREE.Vector3(0, 1, 0);

function wallMountQuat(sx, sy, sz, nx, nz) {
  const ax = _waOut.set(nx, 0, nz).normalize();        // 离开墙面的方向
  const aw = _waZ.set(-ax.z, 0, ax.x);                 // 沿墙水平（和 ax 垂直）
  const X = _waX, Y = _waY;
  if (standsTall([sx, sy, sz])) {
    Y.copy(ax);                                        // 头顶出墙面 = 底面贴墙
    if (sz > sx) X.copy(_WA_UP); else X.copy(aw).negate();
  } else {
    Y.copy(_WA_UP);                                    // 还是立着的，只是横贴上去
    if (sx <= sz) X.copy(ax).negate(); else X.copy(aw);
  }
  _waZ.set(X.y * Y.z - X.z * Y.y, X.z * Y.x - X.x * Y.z, X.x * Y.y - X.y * Y.x);
  _waMat.makeBasis(X, Y, _waZ);                        // Z = X × Y，保证是右手系
  return new THREE.Quaternion().setFromRotationMatrix(_waMat);
}

/* 贴墙时原点往墙里挪多少。横贴：中心离墙要留"薄边的一半"，不然半截埋进墙里；
   站墙：原点就是底面，挪满一个身位正好贴在墙面上。 */
function wallPush(sx, sy, sz) {
  if (standsTall([sx, sy, sz])) return PLAYER_RADIUS;
  return Math.max(0.02, PLAYER_RADIUS - Math.min(sx, sz) / 2);
}

// 一个形象的三边。克隆出来的在抓进池子时就记下了；手工那几个现量一次存着。
function formDims(kind) {
  const def = hideFormOf(kind);
  if (!def) return [0.4, 0.7, 0.4];
  if (def.dims) return def.dims;
  const bb = new THREE.Box3().setFromObject(def.build());
  const s = bb.isEmpty() ? new THREE.Vector3(0.4, 0.7, 0.4) : bb.getSize(new THREE.Vector3());
  def.dims = [+s.x.toFixed(3), +s.y.toFixed(3), +s.z.toFixed(3)];
  return def.dims;
}

/* 这一个形象贴在这个面上时该摆在哪、转多少。三处都是"底座正好落在那个面上"：
   贴顶 → 钉在板面 y=ROOM_H、身子垂回房间；贴墙 → 见 wallMountQuat；地面 → 脚底。
   ⚠ mountAz 是"贴墙时用的那面墙的法线方位角"。躲藏者自己算（传 null，函数从
      obstacles 里找真正挡住他的那面墙），算完把结果随姿态发出去；抓捕者那边
      **必须用他发来的这个值**，不能自己再量一遍 —— 两边的位置差着网络延迟的
      几十厘米，在墙角、柱子旁边各自最近的那面墙可能根本不是同一面，于是
      "自己看是正的、对面看是歪的"。朝向的真相只有一份，在变的人那里。 */
function formPlace(kind, mount, x, z, feetY, yaw, mountAz, spin) {
  const def = hideFormOf(kind);
  const base = (def && def.base) || 'y-';
  const tilt = baseTilt(base, mount);
  // 贴顶的高度就是传进来的脚底高度（一楼 3.00 / 二楼 6.06），不再写死一楼天花板
  if (mount === MOUNT.CEIL) return { x, y: feetY, z, yaw, tilt, spinAxis: [0, 1, 0], spin };
  if (mount === MOUNT.WALL) {
    let nx, nz;
    if (mountAz === undefined || mountAz === null) {
      const w = wallNormalAt(x, z, feetY);
      nx = w ? w.nx : Math.sin(yaw); nz = w ? w.nz : Math.cos(yaw);
    } else {
      nx = Math.sin(mountAz); nz = Math.cos(mountAz);
    }
    const az = Math.atan2(nx, nz);
    /* 滚轮的自转轴 = 贴好之后**底座真正指着的那个方向**，只有绕它转才拧得动形象
       又不动底座（"转动是底座方向不变的转动，不是空翻那种"）。壁扇/吊扇贴墙时
       底座戳进墙 → 绕这条水平法线转，像把一幅画在墙上拧一下；而横贴的家具
       （显示器、暖气片、长条桌）贴完底座仍然朝下，给它法线就把底座从"朝下"
       拧歪了 → 绕世界 Y 转。 */
    if (base === 'y-') {                       // 地图里的家具：按自己的三边决定站/贴
      const d = formDims(kind);
      const push = wallPush(d[0], d[1], d[2]);
      return { x: x - nx * push, y: feetY, z: z - nz * push, az, quat: wallMountQuat(d[0], d[1], d[2], nx, nz),
        spinAxis: standsTall(d) ? [nx, 0, nz] : [0, 1, 0], spin };
    }
    // 手工那两型风扇有自己的底座方向，走原来的"底座转过去戳进墙"
    return { x: x - nx * PLAYER_RADIUS, y: feetY, z: z - nz * PLAYER_RADIUS, yaw: az, tilt, az,
      spinAxis: [nx, 0, nz], spin };
  }
  /* 地面。背面当底座的那几型（壁扇 / 空调 / 时钟 / 镜子）在这里要额外贴一次墙：
     碰撞把人的中心顶在离墙至少一个身位（PLAYER_RADIUS=0.32），而这几型的"背面"
     正好过原点 —— 于是背对墙一站，那块板子就浮着 0.32 米，0.05 厚的镜框被顶开
     六倍自己的厚度，一眼就假。贴墙那一支本来就有这个偏移，这里照抄：同样沿法线
     挪一个身位、同样按墙面定朝向，只是高度留在脚底、底座不翻（他还在地上）。
     背后没有墙（屋子中间）就一动不动，别把人凭空拖走。 */
  if (base === 'z-') {
    /* 和贴墙那一支同一套规矩：法线由"贴的人"算好发出去（sp.az → getState 的 ma），
       对面只照抄。让抓捕者用自己那份延迟几十厘米的位置再量一次墙，墙角、柱子旁边
       量到的可能根本不是同一面 —— 那就又是"自己看贴住了、对面看浮着"。 */
    let nx = NaN, nz = NaN;
    if (mountAz === undefined || mountAz === null || !isFinite(mountAz)) {
      const w = wallNormalAt(x, z, feetY);
      if (w) { nx = w.nx; nz = w.nz; }             // 背后没墙就原样待着，不凭空挪
    } else { nx = Math.sin(mountAz); nz = Math.cos(mountAz); }
    if (isFinite(nx)) {
      const az = Math.atan2(nx, nz);
      return { x: x - nx * PLAYER_RADIUS, y: formMountY(kind, feetY), z: z - nz * PLAYER_RADIUS,
        yaw: az, tilt, az, spinAxis: [nx, 0, nz], spin };
    }
  }
  return { x, y: formMountY(kind, feetY), z, yaw, tilt, spinAxis: [0, 1, 0], spin };
}

// 离这个点最近、而且真的还挡得住它的那面墙：返回朝外（远离墙心）的单位法线
function wallNormalAt(x, z, feetY) {
  let best = null, bestD = Infinity;
  for (const b of obstacles) {
    if (b.top !== undefined) continue;
    if (topOf(b) <= feetY + STEP_UP) continue;      // 已经翻到它顶上，不算贴着
    const cx = clamp(x, b.minX, b.maxX), cz = clamp(z, b.minZ, b.maxZ);
    let nx = x - cx, nz = z - cz;
    const len = Math.hypot(nx, nz);
    if (len < 1e-6) {                               // 点在盒子内部：往最近的面推出去
      const dl = x - b.minX, dr = b.maxX - x, df = z - b.minZ, db = b.maxZ - z;
      const m = Math.min(dl, dr, df, db);
      if (m === dl) { nx = -1; nz = 0; } else if (m === dr) { nx = 1; nz = 0; }
      else if (m === df) { nx = 0; nz = -1; } else { nx = 0; nz = 1; }
      return { nx, nz };
    }
    if (len > PLAYER_RADIUS + 0.06) continue;       // 不是贴着这面
    if (len < bestD) { bestD = len; best = { nx: nx / len, nz: nz / len }; }
  }
  return best;
}

/* 躲藏者的取景：相机退到身后，高度固定成人眼高（和抓捕者一模一样）。
   退多远按形象的包围盒算 —— 凳子 0.86 米高、书只有 0.16，写死一个数必然
   有一个框不准。俯角不在这一步定死，见 applyHideCamera：被墙挤近之后
   俯角必须跟着变，否则形象会从画面下沿掉出去。 */
const hideCam = { back: 2.25, h: EYE_HEIGHT, cY: 0.45, radius: 0.30 };
/* 实际用的退距（做过时间平滑），不是这一帧射线量到的那一个。见 applyHideCamera。 */
let hideBackShown = hideCam.back;
/* 相机防穿墙现在查 obstacles 的 AABB（见 hideCamBack），不再打整张地图的三角面。
   这里按“状态变了马上重算、状态没变才复用”缓存：跑动时最多 80 ms 探一次，
   静止时更疏。墙距余量 0.40，吃掉两次探测之间 4.2 m/s × 0.08 s ≈ 0.34 m 的位移。
   楼梯、天花板、爬墙、换形象照旧马上重算，避免旧穿墙回归。 */
const hideRayCache = {
  t: -1e9, probeH: NaN, want: NaN, back: hideCam.back,
  px: NaN, pz: NaN, yaw: NaN, jy: NaN, radius: NaN,
};
const HIDE_RAY_LIMIT = 0.08;        // 跑动时约 12 Hz
const HIDE_RAY_IDLE = 0.22;         // 站着不动约 4.5 Hz
const HIDE_RAY_MARGIN = 0.40;       // 给缓存间隔留安全余量（4.2 m/s × 0.08 s ≈ 0.34 m）
function inStairZone(x, z) {
  const pad = 0.45;
  return (x > SW_X0 - pad && x < SW_X1 + pad && z > SW_Z0 - pad && z < SW_Z1 + pad)
    || (x > CLS_STB[0] - pad && x < CLS_STB[1] + pad
      && z > CLS_STB[2] - pad && z < CLS_STB[3] + pad);
}

function frameHideCam(obj) {
  if (!obj) return;
  const bb = new THREE.Box3().setFromObject(obj);
  if (bb.isEmpty()) return;
  const c = bb.getCenter(new THREE.Vector3());
  const s = bb.getSize(new THREE.Vector3());
  const near = Math.max(s.x, s.z);
  hideCam.h = EYE_HEIGHT;                                    // 高度就是人眼高，不随形象变
  hideCam.back = Math.min(2.8, Math.max(1.9, near * 1.2 + 1.75));
  hideCam.cY = c.y;                                          // 形象中心离脚底多高
  /* 形象自己"有多占地方"。吊扇叶片横扫将近一米，而相机退多远是拿射线探 world
     探出来的 —— 伪装体挂在 scene 里、不在 world 里，射线当它不存在，于是探到的
     距离可以短到 0.3 米，相机直接钻到自家叶片中间，看见的就是模型内壁的反面，
     也就是"按了回车一动就穿模"。所以退让的下限不能用死的 0.30，得用这个形象
     自己的半径。 */
  hideCam.radius = clamp(Math.max(s.x, s.y, s.z) * 0.5 + 0.18, 0.30, 1.05);
}

/* 相机退距的廉价查询：直接查人物碰撞用的同一份 obstacles AABB。
   原来这里对 mapScene 打两条整图射线（39 万三角面），实测一次 30~48 ms；
   躲藏者每 55 ms 就要付一次，抓捕者完全不跑 —— 这就是两边帧率差的主因。
   墙、楼梯墙、门洞都在 obstacles 里，二维 slab 查询是几百个盒子的常数级循环。
   ⚠ 相机高度必须在盒子的 [base, top] 内才算挡住；二楼克隆体的 base=3.06，
   一楼相机不会被它们误挡，二楼相机也不会被一楼的墙误挡。 */
function camRayBoxDist(ox, oz, oy, dx, dz, b, maxT) {
  const base = b.base === undefined ? 0 : b.base;
  /* top 是挡人的整层高（楼梯梯井那种防止人掉下去的隐形盒），ctop 是它看得见的
     高度（栏杆顶）。相机要是拿 top 去探，站在 2F 栏杆边上抬头就被一个空气盒
     顶到身后半米 —— 旧的全图射线看得见栏杆上方是空的，不会这样。 */
  const top = b.ctop !== undefined ? b.ctop : (b.top === undefined ? ROOM_H : b.top);
  if (oy < base || oy > top) return Infinity;
  let tmin = 0, tmax = maxT;
  if (dx > -1e-9 && dx < 1e-9) {
    if (ox < b.minX || ox > b.maxX) return Infinity;
  } else {
    let t1 = (b.minX - ox) / dx, t2 = (b.maxX - ox) / dx;
    if (t1 > t2) { const t = t1; t1 = t2; t2 = t; }
    if (t1 > tmin) tmin = t1;
    if (t2 < tmax) tmax = t2;
    if (tmin > tmax) return Infinity;
  }
  if (dz > -1e-9 && dz < 1e-9) {
    if (oz < b.minZ || oz > b.maxZ) return Infinity;
  } else {
    let t1 = (b.minZ - oz) / dz, t2 = (b.maxZ - oz) / dz;
    if (t1 > t2) { const t = t1; t1 = t2; t2 = t; }
    if (t1 > tmin) tmin = t1;
    if (t2 < tmax) tmax = t2;
    if (tmin > tmax) return Infinity;
  }
  return tmin;
}
function camBlockedDist(ox, oz, oy, dx, dz, maxT) {
  let best = Infinity;
  for (let i = 0; i < obstacles.length; i++) {
    const d = camRayBoxDist(ox, oz, oy, dx, dz, obstacles[i], maxT);
    if (d < best) best = d;
  }
  if (doorOpen < 0.45) {
    const d = camRayBoxDist(ox, oz, oy, dx, dz, DOOR_BLOCK, maxT);
    if (d < best) best = d;
  }
  return best;
}

/* 相机不许穿墙。上一版这里也做了钳制，但只探一条水平射线、还从脚底高度探，
   结果两个毛病：低矮的桌腿会把相机挤到 0.25 米（而相机其实高过桌面），
   以及斜对墙角时探不到、相机半边埋进墙里。所以改成探两条 —— 相机高度
   本身、再低 35 厘米，取最近命中，留 40 厘米余量。
   身后确实没有墙的时候不钳（走廊里就能退满）。
   ⚠ 探测高度要按**相机真会被摆到的那个高度**来探：在天花板上时相机是压在
   板面之下的（见 hideCamPose 的 onCeiling 分支），还拿 1.62 去探就探在墙顶
   以上、什么都探不到，人会被甩到 2.8 米外埋进别的东西里。
   ⚠ 下限用形象自己的半径（hideCam.radius），不再用死的 0.30 —— 理由见 frameHideCam。 */
function hideCamBack(probeH = hideCam.h) {
  const now = performance.now();
  const dx = Math.sin(player.yaw), dz = Math.cos(player.yaw);
  const moved = Math.hypot(player.pos.x - hideRayCache.px, player.pos.z - hideRayCache.pz);
  const dyaw = Math.abs(Math.atan2(
    Math.sin(player.yaw - hideRayCache.yaw), Math.cos(player.yaw - hideRayCache.yaw)));
  const idle = moved < 0.005 && dyaw < 0.005
    && Math.abs(jumpY - hideRayCache.jy) < 0.002;
  const due = now - hideRayCache.t >= (idle ? HIDE_RAY_IDLE : HIDE_RAY_LIMIT);
  const must = climbing || onCeiling || highMount()
    || inStairZone(player.pos.x, player.pos.z)
    || Math.abs(probeH - hideRayCache.probeH) > 0.001
    || Math.abs(hideCam.radius - hideRayCache.radius) > 0.005
    || Math.abs(hideCam.back - hideRayCache.want) > 0.01
    || Math.abs(jumpY - hideRayCache.jy) > 0.12
    || moved > 0.60 || dyaw > 0.22;
  if (!must && !due) return hideRayCache.back;

  let best = hideCam.back;
  const maxT = hideCam.back + 0.4;
  /* 普通房间一条射线就够（相机在 1.62 m，桌腿在 0.77 m 以下，探不到它）；
     楼梯/爬墙/吊顶这些几何复杂的地方仍然保留第二条低 35 cm 的射线。 */
  const probes = (climbing || onCeiling || highMount() || inStairZone(player.pos.x, player.pos.z))
    ? [probeH, probeH - 0.35] : [probeH];
  for (const dy of probes) {
    const d = camBlockedDist(player.pos.x, player.pos.z, jumpY + dy, dx, dz, maxT);
    if (d < best + HIDE_RAY_MARGIN) best = Math.min(best, Math.max(hideCam.radius, d - HIDE_RAY_MARGIN));
  }
  best = Math.max(best, hideCam.radius);
  hideRayCache.t = now;
  hideRayCache.probeH = probeH;
  hideRayCache.want = hideCam.back;
  hideRayCache.back = best;
  hideRayCache.px = player.pos.x;
  hideRayCache.pz = player.pos.z;
  hideRayCache.yaw = player.yaw;
  hideRayCache.jy = jumpY;
  hideRayCache.radius = hideCam.radius;
  return best;
}

/* 取景算法收在这一个纯函数里：applyHideCamera 和调试口 __dbg 都调它。
   分成两处算就会出现"屏幕上看着对、调试口报的是另一套数"这种两处真相。 */
function hideCamPose(backIn) {
  /* 在天花板上面那一段，取景逻辑整个反过来：人是趴在板面上（脚底=板面=ROOM_H），
     而形象是**垂在板面之下**挂回房间里的（吊扇的叶片在 2.64）。这时候还按
     "相机在人身后 1.62 米高"来摆，相机就在板子上方 4.6 米、低头穿过那面单面朝下
     的天花板去看下面 —— 俯视角、还隔着板，看着就是穿模。所以这里把相机压到板面
     以下、改成仰视自己那台风扇，和站在地面上抬头看吊扇是同一个视角。 */
  if (highMount()) {
    const h = Math.min(hideCam.cY - 0.45, -0.62);       // 相对脚底：一定在贴的那个面之外侧
    const back = backIn === undefined ? hideCamBack(h) : backIn;
    return { back, h, pitch: Math.atan2(hideCam.cY - h, back) };
  }
  /* 相机永远压在**脚下这一层**的天花板下面。第三人称的高度是"脚底 +1.62"，
     人爬到 1.38 米以上时它就已经高过 3.00 了；从一楼天花板按 Caps 松手的那一帧
     脚底还在 3.00，相机会直接摆到 4.62 —— 整段下落都在二楼里看，就是"穿墙看到楼上"。
     所以先按天花板裁高度（可以裁到负的：脚底已经贴到板面时相机得压到脚底以下），
     再用**裁完的高度**取景，俯角照它重算。 */
  const maxH = localCeilY(player.pos.x, player.pos.z, jumpY) - 0.10 - jumpY;
  let h = Math.min(hideCam.h, maxH);
  const back = backIn === undefined ? hideCamBack(h) : backIn;
  /* 默认就是人眼高。但被墙挤到身后只剩几十厘米时，"保持 1.62 米高 + 还看得见
     自己"这两件事只能靠把视线压到近乎垂直俯视来同时满足 —— 实测贴墙时俯角
     -75.7°，形象是从正上方看的，画面废掉。所以给俯角设上限：超了就降相机高度。
     开阔地永远还是 1.62 米，只有缩在墙角那一下会矮。 */
  let pitch = -Math.atan2(h - hideCam.cY, back);
  const MAX_PITCH = 0.70;                       // ≈40°
  if (pitch < -MAX_PITCH) {
    pitch = -MAX_PITCH;
    h = Math.min(Math.max(0.55, hideCam.cY + back * Math.tan(MAX_PITCH)), maxH);
    pitch = -Math.atan2(h - hideCam.cY, back);  // 高度被天花板再压一次，俯角要跟着重算
  }
  return { back, h, pitch };
}

function applyHideCamera(dt) {
  /* 退距必须平滑，而且两个方向不能对称：
       挡住的那一瞬间要立刻收（晚一帧相机就埋进墙里了），
       挡住的东西扫过去之后要慢慢放（否则每次转头经过门框、桌角、墙角，画面都会
       "啪"地弹一下 —— 实测办公室门口扫过 5° 退距跳 0.69 米、俯角跳 6.4°）。
     0.12 秒的时间常数：60 帧下每帧走 13%，松手/转身看起来是推拉，不是闪。
     2 厘米死区：目标只抖一两厘米时按缓放处理，否则贴墙站着不动，射线每帧在
     墙缝之间跳一下，相机就跟着一抽一抽。 */
  const target = hideCamPose();
  const k = target.back < hideBackShown - 0.02 ? 1 : 1 - Math.exp(-dt / 0.12);
  hideBackShown = Math.max(hideCam.radius,
    hideBackShown + (target.back - hideBackShown) * k);
  if (Math.abs(hideBackShown - target.back) < 0.003) hideBackShown = target.back;
  const p = hideCamPose(hideBackShown);
  const dx = Math.sin(player.yaw), dz = Math.cos(player.yaw);
  camera.position.set(player.pos.x + dx * p.back, jumpY + p.h, player.pos.z + dz * p.back);
  camera.rotation.set(player.pitch + p.pitch, player.yaw, 0, 'YXZ');
}

function iAmHider() { return netIsHost() ? !hs.hiderIsGuest : !!hs.hiderIsGuest; }
/* 本局已经不能再操作：被抓碎、结算中、整场结束。三处都要用同一把尺子：
   死亡只藏模型不锁输入，会出现"人没了还能跑、还能按 E 开门"。 */
function huntFrozen() {
  return hs.dead || hs.phase === 'end' || hs.phase === 'idle';
}

/* 谁现在被关在地图外。双人版里"看不见地图"不再只属于抓捕者：
   lobby 和 pick 阶段**两个人都还在界面上** —— 躲藏者必须选完形象才进场。 */
function iAmLockedOut() {
  if (hs.phase === 'lobby' || hs.phase === 'pick') return true;
  if (hs.phase === 'hide') return !iAmHider();      // 躲藏者进图躲，抓捕者还在门外
  return false;                                      // hunt / end：两人都进场了
}
// 主循环、遮罩、输入闸门到处在用这个名字，保留它但含义换成"被关在外面"
const catcherWaiting = () => iAmLockedOut();

/* 开场那层"点击进入"的遮罩层级比界面高，这几块得压在它下面，
   否则一按 Esc 遮罩就压下来，界面既看不见也点不着。 */
function hsUiUp() {
  return hs.phase === 'lobby' || iAmLockedOut();
}

/* ── 三个可变形象 ────────────────────────────────────────────────────
   尺寸和材质全部照抄地图里已有的那几件：凳子 = 教室的蓝椅子（blueChair），
   电脑 = 办公桌上的显示器 + 键盘，书 = 书桌上那一摞书。
   为什么不另外造一个"看着像"的：躲藏能成立的前提就是它和背景里那件真家伙
   看不出区别，自己发挥就等于给抓捕者送线索。
   模型都挂在 Group 里、原点落在"脚底"，方便直接摆到玩家坐标上。 */
function buildStoolForm() {
  const g = new THREE.Group();
  const m = makeLectureChairModel();
  m.rotation.y = -Math.PI / 2;    // 地图里的椅子朝 −X（黑板），伪装体本地朝 −Z
  g.add(m);
  return g;
}

/* 大教室的长条桌：和地图里那批长条桌同源，连前挡板螺丝、胶合板包边都一样。
   转 −90° 后桌子的长边落在本地 x，玩家面朝黑板（yaw=π/2）时长边正好沿 z，
   和身后的整排桌对齐。 */
function buildLongTableForm() {
  const g = new THREE.Group();
  const m = makeLectureTableModel();
  m.rotation.y = -Math.PI / 2;
  g.add(m);
  return g;
}

function buildPcForm() {
  return makePcUnit();
}

/* 和地图桌面上的书共用同一份几何/颜色（map.js 的 makeBookStack），
   不然地图里的书和伪装体永远会对不上。 */
function buildBookForm() {
  return makeBookStack();
}

/* 风扇：尺寸、材质、叶片数全部照抄地图里那台壁挂风扇（见文件开头 fanGroup）。
   原点在"脚底"，风扇本体抬到 FAN_LIFT —— 站在地上时它挂在胸口高，一旦开始
   爬墙，人就顺着墙上去、风扇贴回墙面，和墙上那台真的一模一样。
   朝向：本地 −Z 是"脸朝的方向"（见 poseHideObj 与 update 里的 fx=-sin,fz=-cos），
   而支架在 −Z 那侧 ⇒ 选定形象时脸对着墙，风扇就是"挂"在墙上而不是悬浮。 */
const FAN_LIFT = 0.95;
function buildFanForm() {
  const g = new THREE.Group();
  const fan = new THREE.Group();
  fan.position.y = FAN_LIFT;

  const cage = new THREE.Mesh(new THREE.TorusGeometry(0.27, 0.018, 8, 32), matMetal);
  fan.add(cage);
  for (let i = 0; i < 4; i++) {
    const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.012, 0.012), matMetal);
    spoke.rotation.z = (i * Math.PI) / 4;
    fan.add(spoke);
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
  fan.add(blades);
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.06, 16), matMetal);
  hub.rotation.x = Math.PI / 2;
  fan.add(hub);
  const arm = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.07, 0.16), matMetal);
  arm.position.z = -0.16;
  fan.add(arm);

  g.add(fan);
  g.userData.blades = blades;      // 每帧转的那片，updateHideAvatars 拿它当"活着的证据"
  g.userData.spin = { axis: 'z', rate: 1.6 };
  return g;
}

/* 吊扇：照抄大教室天花板那几台（buildLectureHall 的天花那段）—— 三片 0.62×0.13 白叶、
   铁轮毂、0.30 长的吊杆，叶片离天花板面 0.36 米。
   ⚠ 和别的形象**反着来**：几何挂在原点下方。因为原点代表"钉在天花板上的那个点"，
   而躲藏者爬上天花板之后脚底正好就是天花板面（y=3.0），于是这台风扇垂在 2.64 米，
   和真那四台同一个高度、同一副尺寸 —— 站在地上时它反而会钻到地板底下去，所以
   HIDE_FORMS 里给它配了 footLift，按脚底整体抬起来（二楼、楼梯上同样生效）。
   转轴也不一样：壁挂那台的叶面是朝外的（绕 z 转），吊扇是朝下的（绕 y 转）。 */
function buildHallFanForm() {
  const g = new THREE.Group();
  box(g, 0.06, 0.30, 0.06, 0, -0.16, 0, matIron, false);
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.13, 0.09, 12), matIron);
  hub.position.set(0, -0.34, 0);
  g.add(hub);
  const blades = new THREE.Group();
  for (let b = 0; b < 3; b++) {
    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.02, 0.13), matFanBlade);
    blade.position.set(0.33, 0, 0);
    const arm = new THREE.Group();
    arm.rotation.y = b * Math.PI * 2 / 3;
    arm.add(blade);
    blades.add(arm);
  }
  blades.position.set(0, -0.36, 0);
  blades.rotation.x = 0.06;
  g.add(blades);
  g.userData.blades = blades;
  g.userData.spin = { axis: 'y', rate: 5.2 };      // 和地图那几台同一个转速
  return g;
}

/* 课桌：地图里 classDesk 只往 world 里放桌面和四条腿，抽屉是另一条挂在 scene 上
   的 makeAmmoUnit（不然它会被静态合并、就拉不动了）。所以直接克隆 world 那份
   **必然少一个抽屉**，一眼就被认出来。这里照抄同一套尺寸和材质，并把同一个
   buildDrawerBox 装的抽屉一起带上 —— 能拉开，但里面什么都没有：伪装体的抽屉
   和地图里那些 ammoSpots 没有任何关系，拉开就是块空木头。 */
function buildDeskForm() {
  const g = new THREE.Group();
  box(g, 0.68, 0.045, 0.48, 0, 0.72, 0, matWoodDark, false);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    box(g, 0.05, 0.72, 0.05, sx * 0.27, 0.36, sz * 0.17, matWoodDark, false);
  }
  const drawer = buildDrawerBox(g, { x: 0, y: 0.60, z: 0.235, w: 0.56, h: 0.15, depth: 0.40,
    mat: matWoodDark, face: matWoodDark });
  g.userData.drawer = drawer;
  g.userData.slide = 0.26;
  return g;
}

// 把伪装体那个抽屉推到某个开度（0 关严 / 1 全拉出来）
function slideFormDrawer(obj, k) {
  const d = obj && obj.userData.drawer;
  if (d) d.position.z = 0.235 + (obj.userData.slide || 0.26) * clamp(k || 0, 0, 1);
}

/* 门：**整道门**，不是一片门板 —— 直接复用地图里教休室那道门的构造
   makeRestDoorModel()（深棕近黑门框 + 实心双扇木门 + 左扇黄牌 + 右扇银色执手）。
   以前这里另写了一份：伪装门和真门一旦分叉，躲进去一眼就穿帮，所以现在只留
   地图那一份。每扇门板挂在自己的门轴组上、轴在靠外那一侧，所以拉开时两扇
   **反向**转、往两边摊开，和真门一样。
   noClimb：变成门就不许爬墙、也就上不了天花板。理由是这道具有一米三四宽、两米二高，
   它的"底"是门槛而不是背面，抱到墙上没有任何一种贴法说得通 —— 宁可直接禁掉，
   也不给一个歪在墙上的门。 */
function buildDoorForm() {
  const d = makeRestDoorModel();
  const g = new THREE.Group();
  g.add(d.frame);
  for (const p of d.leaves) g.add(p);
  g.userData.doors = d.leaves;
  g.userData.swing = 1.9;                            // 全开约 109°，和地图那扇一致
  return g;
}

// 把伪装门推到某个开度（0 关严 / 1 全开）；两扇绕各自的轴反向转
function swingFormDoor(obj, k) {
  const list = obj && obj.userData.doors;
  if (!list) return;
  const a = (obj.userData.swing || 1.9) * clamp(k || 0, 0, 1);
  for (const p of list) p.rotation.y = -a * (p.userData.out || 1);
}

/* 空调：尺寸材质一个不改地照抄西墙那台（见文件开头"白色壁挂空调"那段）—— 0.92 长、
   0.30 高、0.20 厚，下沿一条灰白格栅、一头一颗绿色待机灯。
   底座 = **出风口的背面**（他的原话）：机身从 z=0 往 +Z 长，z=0 那一层就是贴墙的面。
   配上 base:'z-' 之后，贴墙时机身整个横着、出风口朝下朝外，和墙上真那台同一姿势；
   贴天花板时同一层面包在板面上、身子垂回房间。抬到 AC_LIFT 的理由和壁扇一样：
   站在地上它在胸口高，往上爬一米左右就正好对上真那台的高度（2.18 米）。 */
const AC_LIFT = 0.95;
function buildAcForm() {
  const g = new THREE.Group();
  const u = new THREE.Group();
  u.position.y = AC_LIFT;
  box(u, 0.92, 0.30, 0.20, 0, 0, 0.10, matWhitePlastic, false);          // 机身（背面正好压在 z=0）
  box(u, 0.84, 0.05, 0.02, 0, -0.10, 0.205,
    new THREE.MeshStandardMaterial({ color: 0xb9b6ae, roughness: 0.8 }), false);   // 出风格栅
  const led = new THREE.Mesh(new THREE.CircleGeometry(0.012, 8),
    new THREE.MeshBasicMaterial({ color: 0x63d18a }));
  led.position.set(-0.32, 0.08, 0.201);                                  // 圆面默认朝 +Z，不用转
  u.add(led);
  g.add(u);
  return g;
}

/* 时钟：照抄西墙那只圆挂钟（黑表圈 + 米白表盘 + 12 个刻度 + 两根指针 + 中心轴钉），
   每根指针挂在绕钟心转的组里，角度和真那只一模一样。整体沿 +Z 挪 0.024 —— 表圈的
   背面就落在 z=0 那一层，也就是它的底座（base:'z-'）。 */
const CLOCK_LIFT = 1.25;
function buildClockForm() {
  const g = new THREE.Group();
  const c = new THREE.Group();
  c.position.set(0, CLOCK_LIFT, 0.024);

  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.024, 10, 36), matMetal);
  c.add(rim);
  const face = new THREE.Mesh(new THREE.CircleGeometry(0.205, 40),
    new THREE.MeshStandardMaterial({ color: 0xeeeae0, roughness: 0.85 }));
  face.position.z = 0.014;
  c.add(face);

  const tickMat = new THREE.MeshStandardMaterial({ color: 0x1c1c1c, roughness: 0.7 });
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const len = (i % 3 === 0) ? 0.045 : 0.026;
    const tick = new THREE.Mesh(new THREE.BoxGeometry(0.012, len, 0.006), tickMat);
    tick.position.set(Math.sin(a) * 0.175, Math.cos(a) * 0.175, 0.02);
    tick.rotation.z = -a;
    c.add(tick);
  }

  const handMat = new THREE.MeshStandardMaterial({ color: 0x141414, roughness: 0.55 });
  const hourPivot = new THREE.Group();
  hourPivot.position.z = 0.026;
  const hourHand = new THREE.Mesh(new THREE.BoxGeometry(0.020, 0.105, 0.006), handMat);
  hourHand.position.y = 0.052;
  hourPivot.add(hourHand);
  hourPivot.rotation.z = -1.14;
  c.add(hourPivot);
  const minPivot = new THREE.Group();
  minPivot.position.z = 0.034;
  const minHand = new THREE.Mesh(new THREE.BoxGeometry(0.014, 0.155, 0.005), handMat);
  minHand.position.y = 0.077;
  minPivot.add(minHand);
  minPivot.rotation.z = 1.05;
  c.add(minPivot);
  const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.02, 12), matMetal);
  pin.rotation.x = Math.PI / 2;
  pin.position.z = 0.04;
  c.add(pin);

  g.add(c);
  return g;
}

/* 镜子：照抄教休室门内那面穿衣镜（0.92×1.34 的深棕外框 + 0.80×1.22 的镜面），连镜面用的
   都是同一个 Mirror 类 —— 一块不反射的灰板子站在镜子原地，抓捕者一眼就看出来那是假的。
   底座 = 镜子背面（base:'z-'）：框从 z=0 往 +Z 厚 0.05，镜面在框前面、法线朝 +Z，
   所以贴墙之后反射的是房间那一侧，绝不会把墙当镜子照。
   ⚠ reuse:true —— 每 new 一个 Mirror 就多一块反射渲染目标（WebGL 资源，把对象从场景里
   删掉并不会自动还），所以这一型整局只建一份、按"自己/对端"缓存，换形态时挂回同一个
   Group。别的形态都是每次现搭，只有它必须留档。 */
const MIRROR_LIFT = 0.85;
function buildMirrorForm() {
  const g = new THREE.Group();
  const m = new THREE.Group();
  m.position.y = MIRROR_LIFT;
  box(m, 0.92, 1.34, 0.05, 0, 0.67, 0.025,
    new THREE.MeshStandardMaterial({ color: 0x2a2622, roughness: 0.55, metalness: 0.08 }), false);
  const glass = new Mirror(new THREE.PlaneGeometry(0.80, 1.22), {
    textureWidth: 256, textureHeight: 384, multisample: 0, clipBias: 0.003, color: 0x7a7f83,
  });
  glass.position.set(0, 0.67, 0.052);
  m.add(glass);
  g.add(m);
  return g;
}

const HIDE_FORMS = [
  { key: 'stool', name: '蓝背椅', hint: '大教室那种蓝色折叠椅（座面全部翻起）', build: buildStoolForm, base: 'y-' },
  { key: 'longtable', name: '长条桌', hint: '大教室那种 2.4 m 一段的浅绿面长桌（挡板朝讲台）', build: buildLongTableForm, base: 'y-' },
  { key: 'door', name: '门', hint: '整道双扇门，抓捕者能把它拉开；变成它就不能爬墙', build: buildDoorForm, base: 'y-', door: true, reach: 2.2, noClimb: true },
  { key: 'desk', name: '课桌', hint: '带抽屉的教室课桌（抽屉只有抓捕者拉得动，里面是空的）', build: buildDeskForm, base: 'y-', drawer: true, reach: 1.5 },
  { key: 'pc', name: '电脑', hint: '办公桌上那台显示器', build: buildPcForm, base: 'y-' },
  { key: 'book', name: '书', hint: '书桌上那一摞书', build: buildBookForm, base: 'y-' },
  // 壁扇的底座是它的**背面**（那根支架）：贴在墙上时该转过去的是这一面。
  { key: 'fan', name: '壁扇', hint: '墙上那台壁挂风扇（要爬墙才贴得住）', build: buildFanForm, base: 'z-' },
  // 吊扇的底座是它的**吊头**（那一端吊杆）：贴在天花板上时朝上、贴墙上时横着戳进墙里。
  { key: 'hallfan', name: '吊扇', hint: '大教室天花板那几台（要爬上天花板才像）',
    build: buildHallFanForm, footLift: 0.45, base: 'y+' },
  // 这三型的底座都是"贴墙那一面"（base:'z-'），所以贴在墙上就是横着的、不会竖着站。
  { key: 'ac', name: '空调', hint: '西墙那台白色壁挂空调（底座是出风口的背面）', build: buildAcForm, base: 'z-' },
  { key: 'clock', name: '时钟', hint: '西墙那只圆挂钟（黑圈白面，底座是钟的背面）', build: buildClockForm, base: 'z-' },
  { key: 'mirror', name: '镜子', hint: '教休室门内左手边那面穿衣镜，真的会反射房间（底座是镜子背面）',
    build: buildMirrorForm, base: 'z-', reuse: true },
];
/* 全部可变的形态 = 上面那五个手工搭的（风扇那两型要特殊的底座朝向和自转，手工
   才控得住）+ 从地图里直接克隆下来的所有家具（PROP_FORMS，在文件前面建世界时
   顺手抓的）。每局从这一整堆里随机抽三个。 */
const ALL_FORMS = HIDE_FORMS.concat(PROP_FORMS);
const hideFormOf = (k) => ALL_FORMS.find((f) => f.key === k);
window.__forms = () => ({
  all: ALL_FORMS.map((f) => ({ key: f.key, name: f.name, dims: f.dims || null })),
  propCounts: { ...PROP_COUNTS },
});

/* 还没选形之前，躲藏者在场上就是一个红色问号。画在 canvas 上贴一块面片、
   每帧转向相机 —— 真要挤出立体"?"得再拖一套字体轮廓进来，不值。 */
function makeQuestionMark() {
  const c = newCanvas(128);
  const x = c.getContext('2d');
  x.font = 'bold 106px "Microsoft YaHei", sans-serif';
  x.textAlign = 'center';
  x.textBaseline = 'middle';
  x.lineWidth = 9;
  x.strokeStyle = 'rgba(52,0,0,.9)';
  x.strokeText('?', 64, 68);
  x.fillStyle = '#d8261c';
  x.fillText('?', 64, 68);
  const tex = new THREE.CanvasTexture(c);
  if (THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(0.46, 0.46),
    new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false }));
  return m;
}

// 本机脚下那个 / 对端那个。分成两份是因为两边看到的完全不是一回事：
// 躲藏者自己看得见自己变成什么，抓捕者只看见对端那个物体。
let hideSelfObj = null, hidePeerObj = null;
let hideSelfMark = null, hidePeerMark = null;
let hidePeerKind = '';

/* 少数几型必须留档（现在是镜子）：它每建一次就多一块反射渲染目标，那种 WebGL 资源
   把对象从场景里删掉并不会自动还回来。按"哪一侧 + 哪一型"缓存，整局最多两份。 */
const hideObjReuse = {};
function rebuildHideObj(which, kind) {
  const key = which === 'self' ? 'hideSelfObj' : 'hidePeerObj';
  const old = which === 'self' ? hideSelfObj : hidePeerObj;
  if (old) scene.remove(old);
  const def = hideFormOf(kind);
  let g = null;
  if (def) {
    const rk = which + ':' + kind;
    if (def.reuse && hideObjReuse[rk]) g = hideObjReuse[rk];
    else {
      g = def.build();
      if (def.reuse) hideObjReuse[rk] = g;
    }
    g.userData.hideKind = kind; scene.add(g);
  }
  if (which === 'self') hideSelfObj = g; else hidePeerObj = g;
  return g;
}

function ensureHideMarks() {
  if (!hideSelfMark) {
    hideSelfMark = makeQuestionMark();
    scene.add(hideSelfMark);
    // 先按"脚底在原点"量一次取景（问号面片挂在 0.95 米高），之后每帧再搬位置
    hideSelfMark.position.set(0, 0.95, 0);
    frameHideCam(hideSelfMark);
  }
  if (!hidePeerMark) { hidePeerMark = makeQuestionMark(); scene.add(hidePeerMark); }
}

/* 每帧把"我是什么 / 对端是什么"摆到该在的位置。
   抓捕者还在等待界面时全部藏掉 —— 那块遮罩是不透明的，但镜子是渲染到
   另一块 target 上的，留个缝就可能提前看见躲藏者站哪。 */
/* 对端那一帧的姿态。原来摆对端的形象用的是 netPeerAsPlayer()，但那个函数
   在非主机时**一律返回 null**（它本来是给主机冒充两个人算 AI 用的），结果
   抓捕者如果恰好是对端，就永远看不见躲藏者变成了什么。peerDrive 两边都会被
   调，所以从它这里取一份，谁当抓捕者都看得见。 */
const peerPose = { x: 0, z: 0, yaw: 0, jy: 0, flip: 0, mnt: 0, oy: 0, ma: NaN, spin: 0, at: -1e9 };
/* at 的初值不能是 0：performance.now() 在页面刚打开时也只有几百毫秒，
   "now - 0 < 600" 会成立，于是开局那半秒里一个人也没有却谎报"玩家 2/2"，
   准备按钮跟着被点亮。给个极负初值，没收到过就一定是 false。 */
const peerAlive = () => performance.now() - peerPose.at < 600;

function updateHideAvatars() {
  ensureHideMarks();
  ensureDummyHider();          // 一个人测的时候，走廊正中那把凳子就是靶子
  const meHider = iAmHider();
  const waiting = catcherWaiting();
  const inGame = hs.phase !== 'idle';   // ⚠ 别叫 started：模块级已经有个 started 表示"鼠标锁上了"

  // ── 本机 ──
  const showSelf = inGame && meHider && !waiting;
  hideSelfMark.visible = showSelf && !hs.form;
  if (hideSelfObj) hideSelfObj.visible = showSelf && !!hs.form && !hs.dead;
  /* 按 Enter 冻结之后：位置照旧跟着人走，只有"朝向"不再随视角转。
     这正是躲藏时想要的 —— 左右转头环顾，但自己那把凳子不会跟着原地打转。
     任何移动键一按就恢复（见 keydown 里那段）。 */
  if (!hideFrozen) selfYaw = player.yaw;
  if (hideSelfMark.visible) poseHideObj(hideSelfMark, { x: player.pos.x, y: jumpY + 0.95, z: player.pos.z, yaw: selfYaw + Math.PI });
  if (hideSelfObj && hideSelfObj.visible) {
    const sp = formPlace(hs.form, myMount(), player.pos.x, player.pos.z, jumpY, selfYaw, null, hideSpin);
    myMountAz = sp.az === undefined ? NaN : sp.az;      // 发给他那边照抄，别让对面自己再量一次墙
    poseHideObj(hideSelfObj, sp, flipP);
    slideFormDrawer(hideSelfObj, drawerK);
    swingFormDoor(hideSelfObj, disDoorK);
    spinFormFan(hideSelfObj);
  }
  /* 躲藏者整局都没有枪 —— 不是"变成物体之后才收起来"。
     选形那会儿他还是个人形，手里照样不该端着 AK：那把枪和手臂是同一个
     viewmodel（arms_basecolor 那套），所以藏 fpGun 就连手臂一起藏了。
     镜子里那把也得一起藏，否则第一人称没枪、低头看镜子却拿着枪。 */
  fpGun.visible = !meHider;
  if (mirrorGun) mirrorGun.visible = !meHider;
  // 人形也一并撤掉：躲藏者在设定上就是"一个问号 / 一件物体"，
  // 镜子里站着个人等于把自己的位置卖给抓捕者。
  playerModel.visible = !(inGame && meHider);

  // ── 对端 ──
  const p = peerPose;
  const peerIsHider = peerAlive() && !meHider;
  const showPeer = inGame && !waiting;
  peerVisible(showPeer && peerAlive() && !peerIsHider);
  if (peerIsHider) {
    /* 伪装体**在这里**建，不在 netApplyFrame 里建。
       原来只有 netApplyFrame 那一处会 rebuildHideObj('peer', …)，而那个函数
       只在**对端**跑；duo1 第一局的抓捕者恰好是**主机**，于是主机这边
       hidePeerObj 永远是 null —— 抓捕者看不见躲藏者变成了什么，也打不到：
       hideTargetObj() 空手返回 null，射线的第一个 if 就直接 return false。
       放在这里是因为 updateHideAvatars 两边每帧都跑，谁当抓捕者都建得出来。
       hideKind 记在建出来的那块上，免得每帧重建一次模型。 */
    if (hideFormOf(hs.form) && (!hidePeerObj || hidePeerObj.userData.hideKind !== hs.form))
      rebuildHideObj('peer', hs.form);
    hidePeerMark.visible = !hs.form;
    if (hidePeerObj) hidePeerObj.visible = !!hs.form && !hs.dead;
    if (hidePeerMark.visible) poseHideObj(hidePeerMark, { x: p.x, y: p.jy + 0.95, z: p.z, yaw: p.yaw + Math.PI });
    if (hidePeerObj && hidePeerObj.visible) {
      // 对面贴在墙上还是天花板上、滚轮转了多少，都是他那边算的（他才知道自己
      // 顶没顶到墙），这边只照抄 mnt / ma / spin —— 不然抓捕者看到的永远是
      // "脚底朝下站着"的壁扇，或者方向跟他自己屏幕对不上。
      const pp = formPlace(hs.form, p.mnt | 0, p.x, p.z, p.jy, p.oy, p.ma, p.spin || 0);
      poseHideObj(hidePeerObj, pp, p.flip);
      slideFormDrawer(hidePeerObj, drawerK);
      swingFormDoor(hidePeerObj, disDoorK);
      spinFormFan(hidePeerObj);
    }
  } else {
    hidePeerMark.visible = false;
    if (hidePeerObj) hidePeerObj.visible = false;
  }
}

/* ── 相位推进：只有主机数这套秒 ──────────────────────────────────────
   pick 选形 → hide 躲藏 30 秒 → hunt 追捕 60 秒 → end 结算 8 秒 → 下一局。
   pick 正常是"躲藏者一选完就走"，20 秒是没人选时的兜底。 */
function hideTick(dt) {
  if (!netIsHost() || hs.phase === 'idle' || hs.phase === 'end') return;
  // 等待大厅：两边都点了"准备"才开局。没点就一直停在这，不倒数。
  if (hs.phase === 'lobby') {
    if (hs.ready === 3) startRound(false);
    return;
  }
  hs.tLeft -= dt;
  if (hs.phase === 'pick') {
    if (hs.tLeft <= 0) toPhase('hide');
  } else if (hs.phase === 'hide') {
    if (hs.tLeft <= 0) { toPhase('hunt'); lockGun(); }   // 躲完了 = 选枪时间到，没选就随机
  } else if (hs.phase === 'hunt') {
    if (hs.tLeft <= 0) finishRound(HIDER_WON);   // 时间到还没打碎 ⇒ 躲藏者赢
  }
}

/* 准备握手。两个人各点一次"准备"，主机把两个位凑齐才开局。
   对端点的时候发一条 r 过来；主机自己点就直接置位。
   计数按座位记，所以两边看到的都是同一个 N/2。 */
function readyCount() { return (hs.ready & 1 ? 1 : 0) + (hs.ready & 2 ? 1 : 0); }
function iReady() { return !!(hs.ready & (netIsHost() ? 1 : 2)); }

function markReady(seat) {
  if (!netIsHost()) return;
  hs.ready |= (1 << seat);
}
function netApplyReady() { markReady(1); }
function pressReady() {
  if (hs.phase !== 'lobby' || !peerAlive()) return;   // 没连上时点了也没人收
  if (netIsHost()) markReady(0);
  else netSendReady();
  hideUpdateUI();
}

function toPhase(ph) {
  hs.phase = ph;
  hs.tLeft = HIDE_T[ph];
}

// 一局结束。hiderWon = 躲藏者活到了时间。只有主机走到这里（对端的 hs 全靠抄）。
const HIDER_WON = true, CATCHER_WON = false;   // 不用裸 true/false：这里传反过一次，而且反的时候注释还是对的
function finishRound(hiderWon) {
  if (hs.phase === 'end') return;
  hs.phase = 'end';
  hs.tLeft = HIDE_T.end;
  const hiderSeat = hs.hiderIsGuest ? 1 : 0;      // 躲藏者坐哪个位子：0 主机 / 1 对端
  hs.winner = hiderWon ? hiderSeat : 1 - hiderSeat;
  hs.wins[hs.winner]++;
}

/* 每局从"全部形态池"里随机出三个（池子 = 手工那五个 + 地图里克隆出来的所有家具）。
   必须在主机抽、然后随快照广播：两边各抽各的会出现"躲藏者那台是 椅子/书/吊扇，
   抓捕者那台是 椅子/柜子/纸箱"，抓捕者盯着一张场上根本没有的卡片猜，而这恰恰是
   只有联机才会碰到的坑。 */
function rollForms() {
  const k = ALL_FORMS.map((f) => f.key);
  for (let i = k.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [k[i], k[j]] = [k[j], k[i]];
  }
  hs.forms = k.slice(0, 3);
}

/* 「换一批」：重抽，并且**保证和刚才那三张不一样**。池子有二十来件、一次抽三张，
   撞回同一组的概率很低，但一旦撞上就是"点了没反应"—— 卡片按签名重建，签名没变
   就一块 DOM 都不动，玩家只会以为按钮坏了。抽 12 次还撞上是数学上不可能的量级，
   真撞上也照样收工（不比"不一样"这件事更重要）。 */
function rerollForms() {
  const before = hs.forms.join(',');
  for (let i = 0; i < 12; i++) {
    rollForms();
    if (hs.forms.join(',') !== before) break;
  }
  hideUpdateUI();                 // 立刻重建卡片，不等下一帧
}

/* 谁能换、什么时候能换：只有躲藏者、只有还在选形这一屏、并且还没选定。
   点的人可能是对端 —— 那他只发一个请求，抽由主机抽，抽完随快照报回来，
   两边看到的三张永远同一组（和选形、选枪、开门是同一套权威规则）。 */
function requestReroll() {
  if (hs.phase !== 'pick' || !iAmHider() || hs.form) return;
  if (netIsHost()) rerollForms();
  else netSendReroll();
}

function startRound(swap) {
  hs.round++;
  hs.phase = 'pick';
  hs.tLeft = HIDE_T.pick;
  hs.hp = HIDE_HP;
  hs.form = '';
  hs.door = 0;                                  // 新一局那扇"门"是关着的（只有主机该改这个）
  hs.drawer = 0;                                // 那副"抽屉"也是关着的
  hs.gun = ''; hs.gunLocked = 0; hs.gunRandom = 0;   // 每局重新选枪（startRound 只在主机跑）
  sawGunLock = 0;
  hs.dead = false;
  hs.winner = -1;
  hs.stolen = [];
  myLastHp = HIDE_HP;                               // 新一局第一次掉血才闪红屏
  rollForms();                                      // 每局重抽三个形象
  for (const s of ammoSpots) { s.stolen = false; s.open = false; }   // 抽屉重新装满并关回去
  if (swap) hs.hiderIsGuest = 1 - hs.hiderIsGuest;  // 每局换角色
  hideSyncPick();
  hideUpdateUI();
}

function startMatch() {
  hs.round = -1;
  hs.wins = [0, 0];
  hs.ready = 0;
  /* 双人版不随机分配：先连进来的窗口是主机，当抓捕者；后开的对端当躲藏者。
     测试时不用猜"这局我是谁"。第二局起 startRound(true) 会翻转，照常轮换。 */
  hs.hiderIsGuest = 1;
  hs.phase = 'lobby';
  hs.tLeft = 0;
  hs.hp = HIDE_HP;
  hs.form = '';
  hs.dead = false;
  hs.winner = -1;
  hs.stolen = [];
  hs.door = 0;
  hs.drawer = 0;
  hs.gun = ''; hs.gunLocked = 0; hs.gunRandom = 0;
  sawGunLock = 0;
  myLastHp = HIDE_HP;
  for (const s of ammoSpots) { s.stolen = false; s.open = false; }
  hideUpdateUI();
}

/* ── 受击与粉碎 ──────────────────────────────────────────────────────
   躲藏者的血是 hs.hp，不是原来那套 playerHP —— 抓捕者没有血条，
   playerHP 在这里已经没人管了，混用会让两边的血互相打脸。

   ⚠ 这里**不设 hurtFlash**。hurtFlash 是"本机玩家挨了一下"的红屏，
   而这个函数跑在主机上：主机是抓捕者时，掉血的是躲藏者，红屏却会闪在
   开枪的人自己脸上。受击反馈必须挂在"谁掉血"上，不能挂在"谁结算伤害"上
   —— 见 hideWatchMyDamage()。 */
function hideTakeDamage(n) {
  if (hs.dead) return;
  hs.hp = Math.max(0, hs.hp - n);
  if (hs.hp <= 0) {
    hs.dead = true;
    shatterActiveForm();
    finishRound(CATCHER_WON);      // 被抓碎 ⇒ 抓捕者赢
  }
}

/* 本机是躲藏者时盯着自己的血：掉了就闪红屏 + 抖一下。
   两条掉血路径（主机自己结算 / 对端从快照里读到）都汇到这里，所以只写一处。 */
let myLastHp = HIDE_HP;
function hideWatchMyDamage() {
  if (!iAmHider()) { myLastHp = hs.hp; return; }
  if (hs.hp < myLastHp) hurtFlash = Math.min(0.85, hurtFlash + 0.45);
  myLastHp = hs.hp;
}

/* 开火方的命中反馈：准星四角冒短线（三角洲那种），不是红屏。
   计时走每帧递减而不是 setTimeout —— 后者会和 rAF 不同步，闪的时长
   跟着帧率漂。 */
const hitMarkEl = document.getElementById('hitmark');
let hitMarkT = 0;
function showHitMark() { hitMarkT = 0.22; }
function updateHitMark(dt) {
  if (!hitMarkEl) return;
  if (hitMarkT <= 0) { if (hitMarkEl.style.opacity !== '0') hitMarkEl.style.opacity = '0'; return; }
  hitMarkT = Math.max(0, hitMarkT - dt);
  const k = hitMarkT / 0.22;
  hitMarkEl.style.opacity = String(Math.min(1, k * 1.6));
  hitMarkEl.style.transform = `scale(${(1.35 - 0.35 * k).toFixed(3)})`;
}

/* 粉碎直接借用花瓶那套碎片系统：同样的重力、落地反弹、超时淡出。
   只是颜色要跟被砸的那个形象一致，所以给每个材质克隆一份单独淡出，
   不去动全局的 shardMat（那是花瓶自己的）。 */
function shatterActiveForm() {
  const obj = iAmHider() ? hideSelfObj : hideTargetObj();
  const at = new THREE.Vector3();
  if (obj && obj.visible) obj.getWorldPosition(at);
  else {
    if (peerAlive()) at.set(peerPose.x, 0.3, peerPose.z);
    else at.set(player.pos.x, 0.3, player.pos.z);
  }
  const mats = [];
  if (obj) obj.traverse((o) => { if (o.isMesh && !mats.includes(o.material)) mats.push(o.material); });
  if (!mats.length) mats.push(new THREE.MeshStandardMaterial({ color: 0x8a8a8a }));
  for (const m0 of mats) {
    const m = m0.clone();
    m.transparent = true;
    m.opacity = 1;
    for (let i = 0; i < 6; i++) {
      const sh = new THREE.Mesh(shardGeo, m);
      sh.position.copy(at);
      sh.position.y += 0.08 + Math.random() * 0.5;
      const a = Math.random() * Math.PI * 2;
      const sp = 0.8 + Math.random() * 2.2;
      sh.userData.v = new THREE.Vector3(Math.cos(a) * sp, 1.2 + Math.random() * 2.4, Math.sin(a) * sp);
      sh.userData.w = new THREE.Vector3((Math.random() - 0.5) * 14, (Math.random() - 0.5) * 14, (Math.random() - 0.5) * 14);
      sh.userData.fadeMat = m;
      sh.scale.setScalar(0.7 + Math.random() * 0.9);
      scene.add(sh);
      shards.push(sh);
    }
  }
  if (obj) obj.visible = false;
  shardLife = 0;
  shardMat.opacity = 1;
}

/* ── 命中判定：抓捕者的射线打到躲藏者那个物体就算中 ────────────────
   打中哪个部位都是 10 点，所以这里不需要像原来丧尸那样分身体/头。
   谁开的枪谁判：本机是抓捕者时本地算射线，命中就发一发伤害给主机；
   主机收到记在 hs.hp 上，再随快照广播回去 —— 血只有一处真相。 */
const _hitBox = new THREE.Box3();
const _hitPt = new THREE.Vector3();
let lastShot = null;             // 上一枪的诊断（打没打中、离形象多远、墙在多远）
function tryHitHider(dir, wallT) {
  const obj = hideTargetObj();                   // 真人对端的形象，没有真人就是测试假人
  if (!obj || hs.dead) {
    lastShot = { why: !obj ? 'no-target' : 'dead', wallT: wallT === Infinity ? null : +wallT.toFixed(2) };
    return false;
  }
  raycaster.set(camera.position, dir);
  obj.updateWorldMatrix(true, true);
  _hitBox.setFromObject(obj);
  /* ⭐ 打的是**这件伪装体的包围盒**，不是它表面的三角面。
     伪装体大多是镂空的：凳子只有一块薄座面和一根细腿、吊扇是三片薄叶、门有两扇门板，
     中间全是空隙。按表面打，子弹会从叶片之间、腿之间穿过去 —— 屏幕上明明瞄着它，
     血却一点不掉（他反馈的"打不死躲藏者"就是这个）。包围盒等于给每件伪装体配一个
     和它自己一样大的实体靶，不会比看起来更大。往内收 2 厘米防擦边。 */
  _hitBox.expandByScalar(-0.02);
  if (_hitBox.isEmpty()) _hitBox.setFromObject(obj);   // 极薄的形象收完会变成空盒
  const pt = raycaster.ray.intersectBox(_hitBox, _hitPt);
  const dist = pt ? raycaster.ray.origin.distanceTo(pt) : Infinity;
  lastShot = {
    obj: obj.userData.hideKind || hs.form || '?', why: '',
    dist: Number.isFinite(dist) ? +dist.toFixed(2) : null,
    wallT: wallT === Infinity ? null : +wallT.toFixed(2),
    box: [_hitBox.min.x, _hitBox.min.y, _hitBox.min.z, _hitBox.max.x, _hitBox.max.y, _hitBox.max.z]
      .map((v) => +v.toFixed(2)),
  };
  // 必须"真的打中这个形象"且"它比墙更近"。没打中不能往下走掉血分支 —— 闭眼开枪都算命中。
  if (!pt) { lastShot.why = 'miss'; return false; }
  if (dist >= wallT) { lastShot.why = 'wall'; return false; }
  lastShot.why = 'hit'; lastShot.hit = true;
  showHitMark();                   // 打中了：准星四角冒短线，不是红屏
  /* 伤害按**这一把枪**算，不再是三把枪都扣固定 10。这个函数是"每颗弹丸"调用一次
     （霰弹枪一枪 8 颗 ⇒ 8 次），所以 sg 全中 = 8 × 6.25 = 50，ak 一发 = 10。
     curWeapon() 拿不到时兜回 HIDE_DMG，不至于打一枪 NaN 把血条算没。 */
  const dmg = (curWeapon() || {}).damage || HIDE_DMG;
  if (netIsHost()) hideTakeDamage(dmg);
  else netSendHit(0, dmg, false);
  return true;
}

// 主机收到对端（抓捕者）报来的一枪
function netRemoteHit(id, dmg) {
  if (!netIsHost() || hs.phase !== 'hunt') return;
  hideTakeDamage(Number.isFinite(dmg) ? dmg : HIDE_DMG);
}

/* ── 选形：躲藏者点一张卡片，立刻变，再报给主机 ────────────────────
   本机先变是为了"点了马上有反馈"，不等那一趟网络往返。
   主机那边只是把 hs.form 记下来随快照发回去，好让抓捕者看到的是同一个东西。 */
function hidePick(kind) {
  if (!iAmHider() || hs.phase !== 'pick' || hs.form) return;
  if (!hs.forms.includes(kind)) return;         // 不是这一局摆出来的三个
  hs.form = kind;
  rebuildHideObj('self', kind);
  frameHideCam(hideSelfObj);        // 换成物体了，相机得按它的实际尺寸重新取景
  hideFrozen = false;
  drawerK = 0; disDoorK = 0; hideSpin = 0;   // 新形象新开局，能拉的部件先关严、转角清零
  hideSyncPick();                   // 先让相位落地，再刷 UI
  hideUpdateUI();              // 反过来写会差一帧：卡片在下一帧之前还赖在屏幕上
}

function hideSyncPick() {
  if (!iAmHider() || !hs.form) return;
  // 主机自己不用过网络，但**必须走同一个落地函数**：原来这里直接 return，
  // 结果主机当躲藏者时相位永远卡在 pick，30 秒躲藏根本不会开始。
  if (netIsHost()) netApplyPick(hs.form);
  else netSendPick(hs.form);
}

// 主机收到躲藏者选了什么
function netApplyPick(kind) {
  if (!hideFormOf(kind) || !hs.forms.includes(kind)) return;
  hs.form = kind;
  if (hs.phase === 'pick') toPhase('hide');      // 一选完就进躲藏，20 秒只是兜底
}

/* ── 偷子弹 ────────────────────────────────────────────────────────
   躲藏者拉开抽屉不是"拿"（他没枪，拿了没用），是"偷"：这一格子弹就此没掉，
   抓捕者再也拿不到。权威仍然只在主机 —— hs.stolen 记 ammoSpots 的下标，
   随快照广播。躲藏者可能是主机也可能是对端，所以两条路都要走。 */
function markStolen(i) {
  const s = ammoSpots[i];
  if (!s || s.stolen) return;
  s.stolen = true;
  s.open = true;         // 永远敞着当记号：一眼就能看出这格这一局已经没了
}

// 把一格抽屉记成"这一局用过了"：敞着当记号，并且报到主机（对端发一条过去）
function spendSpot(s) {
  const i = ammoSpots.indexOf(s);
  if (i < 0) return;
  markStolen(i);
  if (netIsHost()) { if (!hs.stolen.includes(i)) hs.stolen.push(i); }
  else netSendSteal(i);
}

function stealAmmoSpot(s) {
  if (s.stolen) return;
  spendSpot(s);
  showBanner(`偷走了「${s.name}」的子弹 · 抓捕者拿不到了`, 2.0);
}

// 主机收到对端（躲藏者）偷了一格
function netApplySteal(i) {
  if (!netIsHost()) return;
  const n = Number(i);
  if (!Number.isInteger(n)) return;
  markStolen(n);
  if (!hs.stolen.includes(n)) hs.stolen.push(n);
}

/* ── 测试假人：一个人也能测受击 ────────────────────────────────────
   只有"我是抓捕者 且 没有真人对端"时，才在走廊正中放一把凳子当躲藏者。
   它的血就是 hs.hp，所以打中它走的是和打真人**完全同一条路**：
   tryHitHider → 主机 hideTakeDamage → 掉血 → 归零粉碎 → 本局结算。
   以后接回"两个人都到位才开始"，删掉 ensureDummyHider 的调用即可。 */
let hideDummy = null;

function ensureDummyHider() {
  /* 双人版**不放**仿真躲藏者：两个窗口都是真人，摆一把假凳子只会挡路、
     还会让人误以为打中了人。函数留着但永远不生成，hideTargetObj() 因此
     只会返回真人对端那个形象。 */
  const want = false;
  if (!want) { if (hideDummy) hideDummy.visible = false; return; }
  if (!hideDummy) {
    hideDummy = buildStoolForm();
    scene.add(hideDummy);
  }
  hideDummy.visible = true;
  hideDummy.position.set(0, 0, HALL_ZM);
}

// 抓捕者的射线该打谁：有真人对端就打他那个形象，没有就打假人
function hideTargetObj() {
  if (hidePeerObj && hidePeerObj.visible) return hidePeerObj;
  return (hideDummy && hideDummy.visible) ? hideDummy : null;
}

/* ── 屏幕上的四块东西：选形卡、等待界面、顶部状态、结算大字 ────────
   全部是 DOM 遮罩，不动 three.js 的渲染。等待界面必须是不透明的，
   否则抓捕者在门外就能从缝里看见地图。 */
const pickEl = document.getElementById('pick');
const rerollBtnEl = document.getElementById('rerollBtn');
if (rerollBtnEl) rerollBtnEl.addEventListener('click', (e) => { e.stopPropagation(); requestReroll(); });
const waitEl = document.getElementById('wait');
const waitTitleEl = document.getElementById('waitTitle');
const waitMsgEl = document.getElementById('waitMsg');
const waitReadyEl = document.getElementById('waitReady');
const readyBtnEl = document.getElementById('readyBtn');
const gunsEl = document.getElementById('guns');
const gunRowEl = document.getElementById('gunRow');
/* 三把枪的按钮。标签上故意不写"备弹多少"：reserve 是会被打掉的数，写在这里
   就成了第二处真相（打完一局还显示 60 就假了）。写弹仓容量和抽屉给弹 —— 两个
   都是常量。 */
function buildGunButtons() {
  if (!gunRowEl || gunRowEl.childElementCount) return;
  WEAPON_ORDER.forEach((k, i) => {
    const d = WEAPONS[k];
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'gbtn';
    b.dataset.gun = k;
    b.innerHTML = `<span class="gk">${i + 1}</span>${d.name}<small>弹仓 ${d.magSize} · 每格抽屉 +${DRAWER_AMMO[k]}</small>`;
    b.addEventListener('click', (e) => { e.stopPropagation(); chooseGun(k); });
    gunRowEl.appendChild(b);
  });
}
/* 按钮上"这把枪长什么样"。和形象卡片同一个做法：拿真模型渲一张，不手画示意图 ——
   手画的一定和手里那把对不上，而选枪要看的恰恰是"开局拿的是不是它"。
   三把枪的 glb 各自异步加载，所以等三把都到位才拍一次；在那之前按钮只有文字，
   下一次刷新自动补上图（模型一到就拍，不需要谁去点）。
   取景从右侧偏前去：枪管在模型自己的 −Z 上（枪口火光 flashPos 就是 z=-0.6x），
   所以沿 +X 看过去正好是"一把枪的侧影"，弹匣、握把、枪托都在画面里。 */
const gunPics = {};
let gunPicsDone = false;
function shootGunPics() {
  if (gunPicsDone || WEAPON_ORDER.some((k) => !WEAPONS[k].rt)) return;
  gunPicsDone = true;
  let pr = null;
  try {
    pr = new THREE.WebGLRenderer({ alpha: true, antialias: true, preserveDrawingBuffer: true });
    pr.setSize(240, 120, false);
    const sc = new THREE.Scene();
    sc.add(new THREE.AmbientLight(0xffffff, 1.15));
    const key = new THREE.DirectionalLight(0xffffff, 2.3);
    key.position.set(2.4, 3.6, 2.8);
    sc.add(key);
    const cam = new THREE.PerspectiveCamera(30, 2, 0.02, 20);
    for (const k of WEAPON_ORDER) {
      const rt = WEAPONS[k].rt;
      const src = rt.mirror.children.find((c) => c !== rt.mirFlash);   // 镜子里那把：自带的手臂已经藏了
      if (!src) continue;
      const g = src.clone(true);
      g.traverse((o) => { if (o.isMesh) { o.layers.enable(0); o.frustumCulled = false; } });
      sc.add(g);
      const bb = new THREE.Box3().setFromObject(g);
      const c = bb.getCenter(new THREE.Vector3());
      const rad = bb.getSize(new THREE.Vector3()).length() * 0.5;
      cam.position.set(c.x + rad * 2.15, c.y + rad * 0.95, c.z + rad * 0.85);
      cam.lookAt(c);
      pr.render(sc, cam);
      gunPics[k] = pr.domElement.toDataURL('image/png');
      sc.remove(g);
    }
  } catch (e) {
    console.warn('[躲猫猫] 枪械按钮的图没生成，按钮退回只显示文字', e);
  }
  if (pr) {
    pr.forceContextLoss();
    pr.dispose();
  }
}
function fillGunPics() {
  shootGunPics();
  if (!gunRowEl) return;
  for (const b of gunRowEl.children) {
    const k = b.dataset.gun;
    if (!gunPics[k] || b.querySelector('img')) continue;
    const im = document.createElement('img');
    im.src = gunPics[k];
    im.alt = WEAPONS[k].name;
    b.insertBefore(im, b.firstChild);
  }
}
/* 爬墙开关的屏上显示（右上角那颗）。只有躲藏者这一屏出现 —— 抓捕者没有"爬墙"这回事，
   给他一颗按了没反应的开关只是误导。
   每帧都会被调到，所以先算一个签名、变了才动 DOM：这是躲藏者唯一需要一直盯着的能力位。 */
const climbEl = document.getElementById('climbstat');
const climbStateEl = document.getElementById('climbState');
const climbHintEl = document.getElementById('climbHint');
let climbSig = '';
function updateClimbStat() {
  if (!climbEl) return;
  const me = iAmHider();
  const noByForm = !!(hideFormOf(hs.form) || {}).noClimb;
  const sig = `${me ? 1 : 0}${climbOn ? 1 : 0}${noByForm ? 1 : 0}`;
  if (sig === climbSig) return;
  climbSig = sig;
  climbEl.classList.toggle('hidden', !me);
  if (!me) return;
  climbStateEl.textContent = `爬墙 ${climbOn ? '开' : '关'}`;
  climbEl.classList.toggle('off', !climbOn);
  // 变成门的时候本来就爬不了，这和开关无关，得单独说一句 —— 不然他会以为是
  // 自己按错了 Tab 才上不去的。
  climbHintEl.textContent = noByForm ? '这一型不能爬（门）' : (climbOn ? '按 Tab 关掉' : '按 Tab 开启');
}
const statEl = document.getElementById('hsstat');
const resultEl = document.getElementById('result');
let lastPickSig = '';
let pickCardSig = '';        // 上一回建卡片用的是哪三个形象
let lastStatSig = '';

/* 玩法说明：等待界面和对局里都常驻一颗入口。打开时放掉指针锁、清空按键，
   但**不暂停对局** —— 联机里一方单方面停表，另一方就被冻住了。 */
const helpEl = document.getElementById('help');
const helpBtnEl = document.getElementById('helpBtn');
const helpCloseEl = document.getElementById('helpClose');
let helpOpen = false;
function setHelp(on) {
  helpOpen = !!on;
  if (helpEl) helpEl.classList.toggle('hidden', !helpOpen);
  if (helpBtnEl) helpBtnEl.style.visibility = helpOpen ? 'hidden' : 'visible';
  if (!helpOpen) return;
  for (const k in keys) keys[k] = false;
  mouseDown = false;
  if (document.pointerLockElement) document.exitPointerLock();
}
function toggleHelp() { setHelp(!helpOpen); }
if (helpBtnEl) helpBtnEl.addEventListener('click', (e) => { e.stopPropagation(); setHelp(true); });
if (helpCloseEl) helpCloseEl.addEventListener('click', (e) => { e.stopPropagation(); setHelp(false); });
if (helpEl) helpEl.addEventListener('click', (e) => { if (e.target === helpEl) setHelp(false); });

/* 卡片上要能看到"变成之后长什么样"。为什么不手画一张 2D 示意图：
   手绘的一定和真模型对不上，而这个玩法成立的前提就是卡片上的东西和地图里
   那件东西是同一件 —— 差一点玩家就会怀疑"我变的和桌上摆的不是一个"。
   所以开一个一次性的渲染器，把 HIDE_FORMS 里同一个 build() 产出的真模型
   各拍一张图，塞成 <img>，拍完立刻销毁：WebGL 上下文是稀缺资源，
   不能为了三张静态图一直占着。 */
function previewFormShots(only) {
  const out = {};
  const list = only ? ALL_FORMS.filter((f) => only.includes(f.key)) : ALL_FORMS;
  let pr = null;
  try {
    pr = new THREE.WebGLRenderer({ alpha: true, antialias: true, preserveDrawingBuffer: true });
    pr.setSize(112, 112, false);
    const sc = new THREE.Scene();
    sc.add(new THREE.AmbientLight(0xffffff, 1.15));
    const key = new THREE.DirectionalLight(0xffffff, 2.3);
    key.position.set(2.4, 3.6, 2.8);            // 从屏幕前方偏上打，显示器那块正面才亮
    sc.add(key);
    const cam = new THREE.PerspectiveCamera(32, 1, 0.02, 20);
    for (const f of list) {
      const g = f.build();
      sc.add(g);
      const bb = new THREE.Box3().setFromObject(g);
      const c = bb.getCenter(new THREE.Vector3());
      const rad = bb.getSize(new THREE.Vector3()).length() * 0.5;
      cam.position.set(c.x + rad * 1.75, c.y + rad * 1.3, c.z + rad * 1.95);
      cam.lookAt(c);
      pr.render(sc, cam);
      out[f.key] = pr.domElement.toDataURL('image/png');
      sc.remove(g);
    }
  } catch (e) {
    console.warn('[躲猫猫] 形象预览图没生成，卡片退回只显示文字', e);
  }
  if (pr) {
    pr.forceContextLoss();
    pr.dispose();
  }
  return out;
}

/* 预览图很贵：previewFormShots 会另起一个 WebGLRenderer、把每个模型真渲染一遍
   再 forceContextLoss。原来只建一次卡片所以无所谓，现在每局都要换三个形象，
   要是每局都重算一遍就是白给一次上下文丢失的风险。所以缓存按 key 存，抽到
   哪个就从缓存里拿。 */
const formShotCache = {};
function shotFor(key) {
  if (formShotCache[key] === undefined) {
    Object.assign(formShotCache, previewFormShots([key]));
    if (formShotCache[key] === undefined) formShotCache[key] = '';
  }
  return formShotCache[key];
}

function buildPickCards() {
  const row = pickEl && pickEl.querySelector('.row');
  if (!row) return;
  const forms = hs.forms.map(hideFormOf).filter(Boolean);
  if (!forms.length) return;                 // 还没收到主机那一帧，别把卡片刷空
  const sig = forms.map((f) => f.key).join(',');
  if (sig === pickCardSig && row.childElementCount === forms.length) return;
  pickCardSig = sig;
  row.textContent = '';
  forms.forEach((f, i) => {
    const b = document.createElement('button');
    b.className = 'card';
    b.type = 'button';
    const shot = shotFor(f.key);
    b.innerHTML = `<span class="key">按 ${i + 1}</span>`
      + (shot ? `<img src="${shot}" alt="${f.name}">` : '')
      + `<span class="cn">${f.name}</span><span class="ch">${f.hint}</span>`;
    b.addEventListener('click', (e) => { e.stopPropagation(); hidePick(f.key); });
    row.appendChild(b);
  });
}

function hideUpdateUI() {
  const meHider = iAmHider();
  updateClimbStat();          // 右上角那颗爬墙开关（签名没变就不动 DOM）
  // 躲藏者没有枪、抓捕者不会掉血：各自用不到的那块 HUD 直接藏掉。
  const healthBox = document.getElementById('health');
  if (healthBox) healthBox.style.display = meHider ? 'block' : 'none';
  if (ammoEl) ammoEl.style.display = meHider ? 'none' : 'block';

  // 开场遮罩的显隐原来只在 pointerlockchange 里改。现在等待界面会主动把鼠标
  // 锁放开（见下面两行），那个事件就不一定踩得上了，所以每帧按"现在该不该
  // 显示"兜一次 —— 漏掉的后果是追捕开始时遮罩再也不出来，玩家没法重新锁鼠标。
  overlay.classList.toggle('hidden', locked || gameOver || hsUiUp());

  /* 等待期间不再一律松开鼠标。以前这里每次等待都 exitPointerLock，进场时
     再点一次遮罩重新申请；浏览器收回/重给指针锁不是同一帧完成的，表现出来
     就是"刚变成抓捕者，视角先卡一下再能动"。现在只有真需要光标时才松：
     开场点「准备」，以及躲藏者选形象点卡片/换一批。抓捕者等待时保持锁定，
     用 1/2/3 选枪（枪卡上也印了数字）。 */
  const needCursor = hs.phase === 'lobby' || (hs.phase === 'pick' && meHider);
  if (needCursor && document.pointerLockElement) document.exitPointerLock();

  const sig = hs.phase + '|' + (meHider ? 'H' : 'C') + '|' + hs.form + '|' + (hs.dead ? 1 : 0);

  buildPickCards();
  if (pickEl) {
    const show = meHider && hs.phase === 'pick';
    if (sig !== lastPickSig || show) pickEl.classList.toggle('hidden', !show);
    if (show) {
      for (const b of pickEl.querySelectorAll('.card')) b.classList.toggle('off', !!hs.form);
      // 选定之后「换一批」也一起按掉：换批只对"还没挑"的时候有意义
      if (rerollBtnEl) rerollBtnEl.classList.toggle('off', !!hs.form);
    }
  }
  /* 等待界面。双人版里它不再只属于抓捕者 —— lobby 和 pick 阶段两个人
     都在这块不透明遮罩后面，谁都看不到地图。躲藏者的选形卡压在它上面
     （#pick 的 z-index 比 #wait 高一级）。 */
  if (waitEl) {
    const lockedOut = iAmLockedOut();
    waitEl.classList.toggle('hidden', !lockedOut);
    waitEl.classList.toggle('picking', lockedOut && hs.phase === 'pick' && meHider);
    if (lockedOut) {
      /* 中继挂了的时候两边各自都是"主机"，于是都显示自己是抓捕者，
         点准备也同步不过去 —— 而且全程没有任何提示。所以这里先把
         "到底连上没有"摊到界面上：peerAlive() 靠的是对端的状态包还在不在，
         中继不通就永远收不到，比看 WebSocket 的 open 事件更实在。 */
      const linked = peerAlive();
      waitTitleEl.textContent = !linked ? '等 待 对 手' : (meHider ? '你 是 躲 藏 者' : '你 是 抓 捕 者');
      let msg = '', sec = '';
      if (hs.phase === 'lobby') msg = linked
        ? '点下面的「准备」，两个人都准备好才开局'
        : '没连上对手：确认两个人打开的是同一个房间地址。';
      else if (hs.phase === 'pick') msg = meHider ? '挑一个形象，选完你就进场' : '等对方挑形象 · 按 1/2/3 选枪';
      else if (hs.phase === 'hide') {
        msg = meHider ? '躲藏者正在找地方藏' : '躲藏者正在找地方藏 · 按 1/2/3 选枪';
        sec = Math.max(0, Math.ceil(hs.tLeft));
      }
      waitMsgEl.textContent = msg;
      /* 选枪那一排：只有抓捕者看得到（躲藏者没有枪，给他看是误导），而且
         **准备界面(lobby)不给看** —— 那一屏是"点准备"的，枪要等对面挑完形象、
         开始躲了再选（那时才知道他可能藏在哪一类地方）。
         锁定之后整排按掉、当前那把高亮 —— 他在 hide 结束前没点的话，
         hs.gun 是空串，此时高亮全灭、随机的那一把在锁定瞬间才出现。 */
      buildGunButtons();
      if (gunsEl) {
        gunsEl.classList.toggle('hidden', meHider || hs.phase === 'lobby');
        if (!meHider && hs.phase !== 'lobby') fillGunPics();
        if (!meHider && gunRowEl) {
          for (const b of gunRowEl.children) {
            const k = b.dataset.gun;
            b.classList.toggle('sel', k === hs.gun);
            b.classList.toggle('lock', !!hs.gunLocked && k !== hs.gun);
          }
        }
      }
      waitReadyEl.textContent = `玩家 ${linked ? 2 : 1}/2 · 准备：${readyCount()}/2`
        + (sec !== '' ? ` · 躲藏还剩 ${sec} 秒` : '');
      if (readyBtnEl) {
        const mine = iReady();
        readyBtnEl.style.visibility = (hs.phase === 'lobby' && linked) ? 'visible' : 'hidden';
        readyBtnEl.textContent = mine ? '已准备 · 等对方' : '准 备';
        readyBtnEl.disabled = mine;
      }
    }
  }

  if (statEl) {
    const role = meHider ? '躲藏者' : '抓捕者';
    const clock = hs.phase === 'lobby' ? `等待准备 ${readyCount()}/2`
      : hs.phase === 'pick' ? '选形象'
      : hs.phase === 'hide' ? `躲藏 ${Math.max(0, Math.ceil(hs.tLeft))} 秒`
      : hs.phase === 'hunt' ? `追捕 ${Math.max(0, Math.ceil(hs.tLeft))} 秒`
      : '';
    const pose = meHider && hs.form ? (hideFrozen ? ' · 已定住（动一下就恢复）' : ' · 按 Enter 定住朝向') : '';
    /* 抓捕者看不到躲藏者的血量 —— 他只知道"我打中了"（准星那四下），
       不知道还剩几滴。这条只有挨打的那个人自己看得见。 */
    const hpTxt = meHider ? ` · 我的血量 ${hs.hp}` : '';
    const roundTxt = hs.phase === 'lobby' || hs.round < 0
      ? '等待开始' : `第 ${hs.round + 1} / ${HIDE_ROUNDS} 局`;
    const txt = `${roundTxt} · 我是${role} · ${clock}${hpTxt}`
      + ` · 局分 ${hs.wins[0]}:${hs.wins[1]}` + pose;
    if (txt !== lastStatSig) {
      // 只改 .lbl 那一格。原来这里是 statEl.textContent = txt，那一下会把
      // 血条的 <i> 一起抹掉，血条永远出不来。
      statEl.querySelector('.lbl').textContent = txt;
      lastStatSig = txt;
    }
    const bar = statEl.querySelector('.bar');
    bar.style.display = meHider ? 'block' : 'none';
    bar.querySelector('i').style.width = Math.round(hs.hp / HIDE_HP * 100) + '%';
  }

  if (resultEl) {
    const show = hs.phase === 'end';
    resultEl.classList.toggle('hidden', !show);
    if (show) {
      const iWon = hs.winner === (netIsHost() ? 0 : 1);
      const over = hs.round + 1 >= HIDE_ROUNDS || hs.wins[0] === 2 || hs.wins[1] === 2;
      const matchWon = hs.wins[0] > hs.wins[1] ? netIsHost() : hs.wins[1] > hs.wins[0] ? !netIsHost() : null;
      resultEl.innerHTML = over
        ? (matchWon === null ? '平局' : matchWon ? '整场胜利' : '整场失败')
        : (iWon ? '本局胜利' : '本局失败');
    }
  }
}

/* 每帧推进。对端不数秒，整套 hs 从快照里抄，所以这两件事是分开的。 */
/* 从"被关在地图外"变成"在地图里"的那一帧，把人放到走廊正中。
   两边各自判各自的（相位是主机广播的，两边同一帧看到同一个 phase），
   所以不需要额外一条"我进场了"的消息。 */
let wasLocked = true;
function hideSpawnCheck() {
  const locked = iAmLockedOut();
  if (locked) { wasLocked = true; return; }
  if (!wasLocked) return;
  wasLocked = false;
  player.pos.set(SPAWN.x, 0, SPAWN.z);
  jumpY = 0; jumpV = 0; grounded = true; crouchK = 0; airK = 0;
  onCeiling = false; climbing = false; wallMount = false; ceilZone = null;   // 新的一局从地上重新开始
  drawerK = 0; myMountAz = NaN; hideSpin = 0;
  // 门在北墙：两个人都面朝门（yaw=0 朝 −z），躲藏者直接出门，抓捕者进场也正对出口
  player.yaw = 0;
  player.pitch = 0;
}

function hideFrame(dt) {
  hideSpawnCheck();
  /* 抓捕者手上那把跟着 hs.gun 走（谁选的都一样，hs 是权威）。模型可能还没加载完，
     switchWeapon 自己会跳过并打一行日志，下一帧再试，不会卡住。 */
  if (!iAmHider() && WEAPONS[hs.gun] && hs.gun !== currentWeapon) switchWeapon(hs.gun);
  if (!iAmHider() && hs.gunLocked && !sawGunLock) {
    sawGunLock = 1;
    const nm = (WEAPONS[hs.gun] || {}).name || '';
    showBanner(hs.gunRandom ? `没选枪 · 随机发你一把 ${nm}` : `枪已锁定：${nm}`, 2.4);
  }
  if (netIsHost()) {
    hideTick(dt);
    if (hs.phase === 'end') {
      hs.tLeft -= dt;
      if (hs.tLeft <= 0) {
        /* 整场打完不再掉进 idle：idle 没有结算界面、也不锁输入，上一版就是
           "死了还能走、能开门，但永远没有下一局"。回准备大厅，双方重新点准备。 */
        if (hs.round + 1 >= HIDE_ROUNDS || hs.wins[0] === 2 || hs.wins[1] === 2) startMatch();
        else startRound(true);
      }
    }
  }
  updateFlip(dt);              // 翻滚进度要在摆形象之前推
  hideWatchMyDamage();       // 躲藏者自己挨了才闪红屏（不看谁是主机）
  updateHitMark(dt);         // 开火方的命中短线
  drawerK += (hs.drawer - drawerK) * Math.min(1, dt * 8);  // 伪装抽屉的推拉（目标两边同读）
  disDoorK += (hs.door - disDoorK) * Math.min(1, dt * 3.2);  // 伪装门板的开合（目标两边同读）
  updateHideAvatars();
  hideUpdateUI();
}

// 抓捕者还在门外、或这一局已经结束（死亡/结算）：不吃移动、不吃开枪
function hideInputLocked() {
  if (!helpOpen && !catcherWaiting() && !huntFrozen()) return false;
  for (const k in keys) keys[k] = false;
  mouseDown = false;
  return true;
}
/* =========================================================================
   联机：主机 ↔ 对端之间搬的那一帧数据
   -------------------------------------------------------------------------
   一帧只有两个数：d 门的目标位（开 / 关）、dr 这一档还剩几秒，
   外加 net.js 自己补上去的 h（对端血量）。
   为什么门还要主机数秒：两个客户端各数各的，一秒后就是一边开一边关。
   对端 → 主机只有一种事件："我按了 E 开门"（netSendDoor）。
   net.js 那侧每个回调都是 if (api.xxx) 才调，所以这里少传几个挂钩不会炸。
   ========================================================================= */
const r2 = (v) => Math.round(v * 100) / 100;

function netHostFrame() {
  // ⚠ 倒计时字段名叫 sec 不叫 t：这条消息的外层类型标记就是 t（net.js 发的是
  //   Object.assign({t:'z'}, 这一帧)）。谁在这一帧里写 t，谁就把 'z' 覆盖掉，
  //   对端的 onmessage 再也匹配不上 d.t==='z'，于是它一帧状态都不吃 ——
  //   表现是主机自己 ready=11 已经进了挑形象，对端还停在准备位 00，
  //   而两边的位置包(t='s')照收不误，所以看起来"连上了但谁也没准备"。
  return {
    d: doorTarget > 0.5 ? 1 : 0,
    p: hs.phase, sec: r2(hs.tLeft), hi: hs.hiderIsGuest, r: hs.round,
    v: hs.hp, f: hs.form, x: hs.dead ? 1 : 0, w: hs.winner,
    a: hs.wins[0], b: hs.wins[1], st: hs.stolen.join(','), ry: hs.ready,
    fm: hs.forms.join(','), dn: hs.door ? 1 : 0, dw: hs.drawer ? 1 : 0,
    sw: doorState.swing.join(''), lk: doorState.lock.join(''),
    gu: hs.gun, gl: hs.gunLocked ? 1 : 0, gr: hs.gunRandom ? 1 : 0,
  };
}

// 对端按 E 要开哪一扇：和主机自己按 E 同一件事 —— 翻一下状态，没有别的时间轴。
function netRemoteDoor(which, i) {
  if (which === 1) { toggleDisguiseDoor(); return; }    // 对端拉的是那扇"伪装门板"
  if (which === 2) { toggleDisguiseDrawer(); return; }  // 对端拉开的是"伪装抽屉"
  /* 3 / 4 是新地图的推拉门和储物柜：序号是两边同一个数组的下标（同一份地图、同一个
     建门顺序），所以只传一个数就够。越界一律不认 —— 版本不一致时宁可不动，别乱开。 */
  if (which === 3 && i >= 0 && i < doorState.swing.length) { doorState.swing[i] ^= 1; applyDoorState(); return; }
  if (which === 4 && i >= 0 && i < doorState.lock.length) { doorState.lock[i] ^= 1; applyDoorState(); return; }
  doorTarget = doorTarget > 0.5 ? 0 : 1;
}

// 对端每帧把收到的这一帧"演"出来。net.js 在它自己的 rAF 里调，跟 animate() 并行。
function netApplyFrame(f, dt) {
  if (!f) return;

  doorTarget = f.d ? 1 : 0;
  /* 推拉门 / 储物柜：主机报回来的是一串 0/1，按序号对齐写进自己这两份数组。
     长度对不上（两边地图版本不同）就整个不认 —— 半套状态比没状态更难查。 */
  if (typeof f.sw === 'string' && f.sw.length === doorState.swing.length) {
    for (let i = 0; i < doorState.swing.length; i++) doorState.swing[i] = f.sw.charCodeAt(i) - 48;
    applyDoorState();
  }
  if (typeof f.lk === 'string' && f.lk.length === doorState.lock.length) {
    for (let i = 0; i < doorState.lock.length; i++) doorState.lock[i] = f.lk.charCodeAt(i) - 48;
    applyDoorState();
  }

  if (f.p === undefined) return;
  /* ⚠ 新回合要把本地那份形态清掉。客机上一局当抓捕者时，下面那条
     `if (!iAmHider() && f.f !== hs.form)` 会把躲藏者的形态抄进 hs.form；
     下一局它自己变成躲藏者，这条又不会抄空串，于是 hs.form 一直是非空的
     "desk" —— 选形函数看到 hs.form 非空就直接 return，第三局永远停在 pick。
     只在"回合号变了且新回合是 pick"这一刻清，避免把本地点完、还没被主机
     确认的那一帧倒回问号。 */
  const newRound = hs.round !== f.r;
  hs.phase = f.p;
  hs.tLeft = f.sec;
  hs.hiderIsGuest = f.hi;
  hs.round = f.r;
  hs.hp = f.v;
  hs.dead = !!f.x;
  if (newRound && f.p === 'pick') {
    hs.form = '';
    hideFrozen = false;
    drawerK = 0; disDoorK = 0; hideSpin = 0;
  }
  hs.winner = f.w;
  hs.wins[0] = f.a;
  hs.wins[1] = f.b;
  if (f.ry !== undefined) hs.ready = f.ry;
  if (f.dn !== undefined) hs.door = f.dn ? 1 : 0;      // 伪装门板的开合：两边同读一个目标
  if (f.dw !== undefined) hs.drawer = f.dw ? 1 : 0;    // 伪装抽屉的开合：同上（谁拉的都在这一份里）
  if (f.gu !== undefined && !hs.gunLocked) hs.gun = f.gu;   // 抓捕者用哪把：锁了就不再改
  if (f.gl !== undefined) hs.gunLocked = f.gl ? 1 : 0;
  if (f.gr !== undefined) hs.gunRandom = f.gr ? 1 : 0;
  if (f.fm !== undefined) {
    // 形象是主机抽的，卡片必须跟着换：对端手里那份是上局的三个，等于让他
    // 在"这一局根本没有的选项"里挑一个，挑完永远进不了 hide。
    const got = String(f.fm).split(',').filter((k) => hideFormOf(k));
    if (got.length && got.join(',') !== hs.forms.join(',')) hs.forms = got;
  }
  if (f.st !== undefined) {
    hs.stolen = f.st === '' ? [] : String(f.st).split(',').map(Number).filter(Number.isInteger);
    for (const i of hs.stolen) markStolen(i);
  }

  // 躲藏者自己那份形态是本地点的，别让主机还没收到的那一帧把它倒回"?"。
  // 这里只收数字，不建模型 —— 对端的伪装体统一由 updateHideAvatars 建，
  // 不然主机当抓捕者那一局就没人建它（这段只在対端跑）。
  if (!iAmHider() && f.f !== hs.form) hs.form = f.f;
  // 受击红屏不在这里做：统一由 hideWatchMyDamage() 每帧盯 hs.hp 有没有掉，
  // 主机自己结算和对端从快照读到两条路都覆盖，省得写两遍还写歪。
}

function update(dt) {
  elapsed += dt;

  // 抓捕者还在门外：这一帧不吃移动也不吃开枪（它把 keys / mouseDown 直接清掉）
  hideInputLocked();

  updateReload(dt);          // 换弹时间轴（会顺带摆好枪上的弹匣）

  // 下蹲 / 跳跃：先算状态，后面的移速、视角高度、镜子里的人都用它
  {
    const crouchHeld = !gameOver && (keys['KeyC'] || keys['ControlLeft'] || keys['ControlRight']);
    const wantCrouch = crouchHeld && grounded;
    crouchK += ((wantCrouch ? 1 : 0) - crouchK) * Math.min(1, dt * 9);
    if (crouchK < 0.002) crouchK = 0;

    if (!gameOver && keys['Space']) tryJump(JUMP_SPEED);
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
  const moving = !gameOver && (f !== 0 || s !== 0);

  let climbStep = 0;             // 这一帧沿墙升/降多少，先在这儿算好，竖直段再用

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

    const wantX = player.pos.x + dx, wantZ = player.pos.z + dz;
    let nx, nz;
    if (onCeiling) {
      /* 在天花板上面就是"蜘蛛"：前后左右随便爬，但**不许出翻上来时那间屋子**。
         板是连成一片的，墙顶又和板面齐平（都在 3.00），只查"脚下有没有板"就会
         从天花板一路爬进隔壁教室 —— 可门框上面明明是实墙。
         两道闸：① 脚下那点得真有板（ceilTops）；② 不许越过当前房间的矩形
         （ceilZone，翻上去那一刻锁定的 floor2Rects 那块）。第二道用夹的而不是
         拒绝，贴到边就沿墙滑，不会两个轴一起被拒而卡死。
         x / z 分开判，板子斜边缘不会让人弹停在边上；速度跟地面上完全一样。 */
      /* 夹取只在"人本来就在这块矩形里"时做；人已经在区域外时绝不夹回去 ——
         夹取会一帧把人从墙这边挪到墙那边，那就是穿墙。 */
      let px = player.pos.x, pz = player.pos.z;
      const sub = Math.max(1, Math.ceil(Math.hypot(dx, dz) / MOVE_SUBSTEP));
      for (let si = 0; si < sub; si++) {
        let cx = px + dx / sub, cz = pz + dz / sub;
        if (ceilZone) {
          const outside = px < ceilZone[0] || px > ceilZone[1]
            || pz < ceilZone[2] || pz > ceilZone[3];
          if (outside) { cx = px; cz = pz; }
          else { cx = ceilClampX(cx); cz = ceilClampZ(cz); }
        }
        /* 墙是实体：脚在 3.00 时和身体相交的是二楼那一份墙（3.06~6.06），
           只用矩形夹取会让身子扎进墙里 26 厘米，这里按实体推出去。 */
        const [wx] = resolveWalls(cx, pz, ROOM_H);
        const qx = hasCeilingUnder(wx, pz) ? wx : px;
        const [, wz] = resolveWalls(qx, cz, ROOM_H);
        const qz = hasCeilingUnder(qx, wz) ? wz : pz;
        px = qx; pz = qz;
      }
      nx = px; nz = pz;
    } else {
      /* ⚠ 贴在墙上时，判"翻过这块东西没"用的脚高要让一步。原来直接拿真实 jumpY，
         于是爬到 2.88 米时 resolveObstacles 认为"墙顶(3.0)比你脚低 12 厘米以内，
         你已经站它上面了"就不再挡人：位移不再被吃掉 → 顶墙判据失效 → 爬墙中断
         → 人从半空掉下来，而天花板在 3.0，永远差最后那 12 厘米上不去。压到离顶
         至少 0.5 米之后墙全程挡得住，矮台面（桌椅那些带 top 的）照旧会自动放开。 */
      const wallFeet = wallMount ? Math.min(jumpY, ROOM_H - 0.5) : jumpY;
      let px = player.pos.x, pz = player.pos.z;
      const sub = Math.max(1, Math.ceil(Math.hypot(dx, dz) / MOVE_SUBSTEP));
      for (let si = 0; si < sub; si++) {
        [px, pz] = resolveObstacles(px + dx / sub, pz + dz / sub, wallFeet);
      }
      nx = px; nz = pz;
      /* "过半才算"是必需的 —— 沿着墙跑时也被墙吃掉一小部分位移，那种擦着墙走的
         情况不该顺手爬上去，只有脑袋真顶着墙才算。 */
      const stepLen = Math.hypot(dx, dz) || 1;
      const eaten = Math.hypot(nx - wantX, nz - wantZ) / stepLen;
      /* 往前探固定 45 厘米再问"是不是墙"：整帧的目标点会在掉帧时越过墙，探到
         墙背后反而判成没有墙；探得太近又会被贴墙的矮桌挡住，看不到桌后的真墙
         （矮桌不算墙，但能站上去，胸口的射线能越过它打到墙）。 */
      const blocked = eaten > 0.5 && wallAhead(
        player.pos.x + dx / stepLen * 0.45, player.pos.z + dz / stepLen * 0.45, wallFeet);
      /* 碰撞盒说前面有墙还不够 —— 必须真的打到一块竖直的面。贴上去之后也要每帧确认
         那面墙还在：沿着墙滑到门口/墙角外时人已经悬空，不能再凭空往上爬。 */
      /* canClimb() 放在射线**前面**：抓捕者撞墙也走这一支，但爬墙那条射线要打整张
         地图（实测 ~2.3 ms），没理由让他每帧白付这个钱。 */
      const pressed = blocked && canClimb() && !wallMount
        ? realWallAtCached(player.pos.x, player.pos.z, jumpY, dx, dz) : null;
      if (pressed) { climbWallN.x = pressed.nx; climbWallN.z = pressed.nz; }
      let onWall = !!pressed;
      if (!onWall && wallMount && canClimb() && (climbWallN.x || climbWallN.z)) {
        onWall = !!realWallAtCached(player.pos.x, player.pos.z, jumpY,
          -climbWallN.x, -climbWallN.z, PLAYER_RADIUS + 1.0, 0.12);
      }
      climbing = canClimb() && onWall;
      /* 墙没了就松手（Tab 关掉爬墙也走这一条）。⚠ 沿着梯段侧墙滑到上坡处时，
         地面的坡面可能已经升到脚底以上；这时直接判"掉下去"会连梯面一起穿过
         （松手后的落地判据只认从上方落下，永远接不住）。脚在面里就站上去。 */
      if (!climbing && wallMount) {
        wallMount = false; jumpV = 0;
        const g = groundAt(nx, nz, jumpY);
        if (sameStorey(g, jumpY) && jumpY <= g + 0.02) { jumpY = g; grounded = true; }
        else grounded = false;
      }
      // 前进 = 往上爬，后退 = 沿墙往下爬；用的就是地面那个 speed（含 Shift 快跑）
      if (climbing && f !== 0) climbStep = Math.sign(f) * speed * dt;
    }
    player.pos.x = nx;
    player.pos.z = nz;
  } else {
    climbing = false;
    climbStep = 0;
  }

  // ── 竖直方向：跳起 / 落到家具顶上 / 走出边缘掉下去 / 沿墙上下 / 贴上天花板 ──
  {
    const ground = onCeiling ? ROOM_H : groundAt(player.pos.x, player.pos.z, jumpY);
    /* 头顶能到多高 = 他脚下那一层的天花板：一楼 3.00，二楼 6.06。
       写死 ROOM_H 的话，上了二楼连跳都跳不动 —— 1.28 那个绝对上限还在他脚底下。 */
    const headRoom = ground >= ROOM_H ? ROOM_H * 2 + FLOOR2_LIFT : ROOM_H;
    const ceil = headRoom - 1.72;                     // 头别穿天花板
    if (hideFrozen && iAmHider()) {
      /* 按过 Enter 定住：连高度一起钉住，不吃重力。任何移动键一按就恢复（见 keydown）。 */
    } else if (climbStep !== 0 && iAmHider()) {
      /* 上下限按**脚下这一层**算：一楼 0~3.00、二楼 3.06~6.06。二楼那堵墙原来被
         钳在 0~3.00，一按前进就落到一楼天花板的高度，所以二楼的墙根本爬不上去。 */
      const topY = storeyTop(jumpY);
      const baseY = storeyBase(jumpY);
      /* 下爬的底不能只按本层地面（一楼 0 / 二楼 3.06）：站在缓梯上往下爬时，
         脚底会一路压到 0，穿过 1~2.9 m 的梯面。人一旦到了梯面以下，松手后
         `fellFrom >= ground` 这条落地判据就永远不成立 —— 直接掉出地图。
         所以下限取"本层地面"和"脚下这块真实可站面"里更高的那个。 */
      const underRaw = groundAt(player.pos.x, player.pos.z, jumpY);
      /* ⚠ 一楼天花板 y=3.00 和二楼楼板 y=3.06 只差 6 厘米，groundAt 在一楼
         爬到 2.94 时就会把二楼楼板报成"脚下的台阶"。这里只认同层的落脚面：
         一楼的人不会被这一下抬上二楼；楼梯坡面（同层）照旧接住。 */
      const under = sameStorey(underRaw, jumpY) ? underRaw : baseY;
      /* 倒着爬（S）时人是往后退的：从梯段侧墙往坡上退，梯面会从脚下追上来。
         这时候再往下爬就是往梯段里面钻，直接站回梯面、松手。 */
      if (under > jumpY + 0.02) {
        jumpY = under; wallMount = false; grounded = true; jumpV = 0;
      } else {
        const floorY = Math.max(baseY, under);
        jumpY = clamp(jumpY + climbStep, floorY, topY);
        jumpV = 0; grounded = false;
        // 只有头顶那块确实铺着板、且人就在这块地面矩形里才"翻上去"：
        // 在没铺板的地方把他标成 onCeiling，接着每个方向都被"脚下没面"判成
        // 不可走，看起来就是爬到顶之后整个人冻住。
        const zr = zoneRectAt(player.pos.x, player.pos.z);
        if (jumpY >= topY - 0.005 && zr && hasCeilingUnder(player.pos.x, player.pos.z)) {
          jumpY = topY; onCeiling = true; wallMount = false; grounded = true;
          ceilZone = zr;                                        // 只准在这间屋子的天花板上爬
        } else if (jumpY <= floorY + 0.02) {
          jumpY = floorY; wallMount = false; grounded = true;   // 爬回真实地面就松手
        } else {
          wallMount = true;                             // 离开地面了就算贴在墙上
        }
      }
    } else if (attached()) {
      /* 贴住 = 和站在地上一样稳：不吃重力、不下滑。出口只有三个 ——
         按 Caps Lock 主动松手、按 Tab 把爬墙关掉（keydown 里就是调上面那个
         detachMount，和 Caps 同一条路），以及爬到没有墙 / 没有板的地方。
         ⚠ 空格不再松手：跳跃键在爬墙时必须完全没反应，否则一按就离墙掉下去，
         看起来还是"在墙上跳了一下"。 */
      if (!onCeiling) {
        const g = groundAt(player.pos.x, player.pos.z, jumpY);
        // 同层才接住。3.00 的墙顶旁边就是 3.06 的二楼楼板，跨层抬上去就是穿墙。
        if (sameStorey(g, jumpY) && g > jumpY + 0.02) {
          jumpY = g; wallMount = false; grounded = true; jumpV = 0;
        }
      }
      if (attached()) jumpV = 0;
    } else if (!grounded) {
      const fellFrom = jumpY;
      jumpV -= GRAVITY * dt;
      jumpY += jumpV * dt;
      // 1.28 那个上限只管"在屋里往上跳别顶到板"；从板子上往下跳的时候它会把人
      // 从 3.0 一把拽回 1.28（凭空掉一米七），所以加两个条件：正在上升、且还没出板。
      if (jumpV > 0 && jumpY > ceil && jumpY < headRoom) { jumpY = ceil; jumpV = Math.min(jumpV, 0); }
      /* 只从**上方**落到台面上。没有 fellFrom 这一条时，脚底在二楼楼板下面几厘米
         （比如刚从一楼天花板松手，3.00 vs 3.06）也会被判成"踩到了"——人被往上
         吸 6 厘米，直接穿过楼板站到二楼去。 */
      if (jumpV <= 0 && jumpY <= ground && fellFrom >= ground - 0.02) {
        jumpY = ground; jumpV = 0; grounded = true;
      } else if (jumpV <= 0) {
        /* 从梯面上起跳 / 跑跳上楼时，空中水平位移会把脚带到更高的梯面下方：
           此时 `fellFrom >= ground` 永远不成立，人会穿过梯段一路掉到虚空。
           只要脚已经在梯面下、而且只差半米以内，就拉回梯面站住。
           ⚠ 只认楼梯可站面；二楼楼板（3.06）刻意不在 stairSurfaceAt 里。 */
        const sg = stairSurfaceAt(player.pos.x, player.pos.z);
        if (sg !== null && jumpY < sg && sg - jumpY <= 0.5) {
          jumpY = sg; jumpV = 0; grounded = true;
        }
      }
    } else if (ground > jumpY + 0.02) {
      // 只有小台阶才自动迈上去；高度差大说明站位不正，绝不让它把人「吸」上去
      if (ground - jumpY <= STEP_UP + 0.02) jumpY = ground;
      else {
        /* 掉帧时一帧能跨大半级台阶，坡面一次涨超过 STEP_UP 就会被上面那条判成
           "站位不正"：水平位移照走、脚却留在旧高度，人一路钻进梯段里（模型下半截
           埋进台阶）。只要人还在梯段范围内、梯面就在脚上不到半米，就直接站回梯面。
           半米上限保证在一楼东跑底下走过的人不会被吸到 1.5 m 的梯面上。 */
        const sg = stairSurfaceAt(player.pos.x, player.pos.z);
        if (sg !== null && sg > jumpY && sg - jumpY <= 0.5) jumpY = sg;
      }
    } else if (ground < jumpY - 0.02) {
      if (jumpY - ground <= 0.30) jumpY = ground;       // 下小台阶
      else { grounded = false; jumpV = 0; }             // 走出沙发沿 → 掉下去
    }
    airK += ((grounded ? 0 : 1) - airK) * Math.min(1, dt * 12);
    if (airK < 0.002) airK = 0;
    if (grounded) airJumpLeft = iAmHider();   // 踩到地面就把二段跳攒回来
  }

  camera.position.set(
    player.pos.x,
    EYE_HEIGHT - CROUCH_DROP * crouchK + jumpY,   // 蹲下压低视线、跳起来抬高
    player.pos.z
  );
  camera.rotation.set(player.pitch, player.yaw, 0, 'YXZ');

  // 躲藏者要能看见自己那个形象：相机退到身后、按形象的包围盒自动俯角
  if (iAmHider() && hs.phase !== 'idle' && !catcherWaiting()) applyHideCamera(dt);

  if (dbg.has('avatar')) {
    // 调试：把角色摆到相机正前方转身展示（?shot&avatar）
    playerModel.position.set(0, 0, -1.0);
    playerModel.rotation.y = Math.PI;
    fpGun.visible = false;             // 调试近距离看手时，把手里的第一人称枪藏掉
  } else {
    playerModel.position.set(player.pos.x, jumpY, player.pos.z);   // 跳起来时镜子里的人一起离地
    playerModel.rotation.y = player.yaw;
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
    poseLegs(selfRig(), CROUCH_THIGH * crouchK + 0.38 * airK, CROUCH_DROP * crouchK, avatarBaseY);
    // 动画播完再盖一层持枪姿势，镜子里的手才会搭在枪上
    poseArms(selfRig(), {
      pk: pumpT > 0 ? pumpCurve(1 - pumpT / PUMP_TIME) : 0,
      rWeight: reloadHandWeight, rOff: reloadHandOff,
      gripR: HOLD.gripR, gripL: HOLD.gripL,
    });
  }

  fanGroup.userData.blades.rotation.z += dt * 1.6;
  /* 吊扇：新地图每台的转速是建的时候按顺序定的（全楼同速会转成一片整齐的频闪，
     看着像贴图在跳），二楼那几台克隆体也带着自己的 spd，所以这里读各自的。 */
  for (const b of hallFans) b.rotation.y += dt * (b.userData.spd ?? 5.2);

  /* 走廊两侧那 13 樘推拉门 + 实验室储物柜：开合目标 `open` 由按 E 翻（主机权威），
     这里只做插值和摆角度 —— 和教休室那道双开木门同一套做法，两边各自演同一段动画。 */
  for (const d of swingDoors) {
    d.cur += ((d.open ? 1 : 0) - d.cur) * Math.min(1, dt * 7);
    if (d.leaves) {
      // 楼梯间那两樘双扇门：一个状态带四扇门叶（1F/2F 各两扇），各自转各自的轴。
      for (const L of d.leaves) {
        L.g.rotation.y = L.closedYaw + (L.openYaw - L.closedYaw) * d.cur;
      }
      continue;
    }
    const yaw = d.closedYaw + (d.openYaw - d.closedYaw) * d.cur;
    d.hinge.rotation.y = yaw;
    d.hinge2.rotation.y = yaw;
  }
  for (const u of hideLockers) {
    u.cur += ((u.open ? 1 : 0) - u.cur) * Math.min(1, dt * 7);
    for (const h of u.hinges) h.g.rotation.y = h.dir * 1.72 * u.cur;
  }

  // 脚步声
  updateFootsteps(dt, moving, !!(keys['ShiftLeft'] || keys['ShiftRight']));

  // 门的开合：目标只有 doorTarget 一个（按 E 改，主机权威），没有自动时间轴。
  doorOpen += (doorTarget - doorOpen) * Math.min(1, dt * 7);
  const swing = doorOpen * 1.45;
  doorLeft.rotation.y = -swing;
  doorRight.rotation.y = swing;

  // 抽屉：滑出/归位。用过的抽屉**永远敞着**当记号 —— 一回合每格只给一次，
  // 不再有 12 秒补货再自己关回去那套（那会让"这格到底还有没有"看不出来）。
  for (const s of ammoSpots) {
    const want = s.open ? s.slide : 0;
    s.cur += (want - s.cur) * Math.min(1, dt * 10);
    if (s.axis === 'x') s.mesh.position.x = s.baseX + s.cur;
    else s.mesh.position.z = s.baseZ + s.cur;
  }

  // 大字播报到时间淡出
  if (bannerT > 0) {
    bannerT -= dt;
    if (bannerT <= 0 && bannerEl) bannerEl.classList.remove('show');
  }

  // 屏幕中间的提示：死亡 / 换弹 / 开抽屉 / 开门
  {
    const spot = nearestAmmoSpot();
    // 和 keydown 里那条 E 的优先级保持同一个顺序算出来，提示才可能和实际动作一致
    const swd = (spot || nearDoor()) ? null : nearestSwingDoor();
    const lkr = (spot || nearDoor() || swd) ? null : nearestHideLocker();
    let txt;
    if (gameOver) txt = '出局了 · 按 T 重新开始';
    else if (reloading) txt = '换弹中…';
    else if (spot) {
      txt = spot.stolen
        ? `${spot.name}这一局空了`
        : (spot.open ? PROMPT.drawerBack : PROMPT.drawerPull);
    }
    else if (nearDoor()) txt = doorTarget > 0.5 ? PROMPT.doorClose : PROMPT.doorOpen;
    /* 新地图的推拉门 / 储物柜：提示和上面真门同一组常量（逐字一样），
       判定顺序也和按 E 那条链一模一样 —— 不一致的话屏幕上说的和按下 E 做的会是两回事。 */
    else if (swd) txt = swd.open ? PROMPT.doorClose : PROMPT.doorOpen;
    else if (lkr !== null) txt = hideLockers[lkr].open ? PROMPT.lockerBack : PROMPT.lockerOpen;
    /* 伪装体的提示：和上面真物件用同一组常量，所以逐字一样。
       顺序也和 E 那条链一致（真抽屉 → 真门 → 伪装门 → 伪装抽屉），否则提示说的
       和按下 E 实际做的事会不一致。抽屉那一支传 false：躲藏者自己拉不动，
       所以也不该在他自己屏幕上显示"按 E 拉开"。 */
    else if (atDisguisePart('door')) txt = hs.door > 0.5 ? PROMPT.doorClose : PROMPT.doorOpen;
    else if (atDisguisePart('drawer', false)) txt = hs.drawer > 0.5 ? PROMPT.drawerBack : PROMPT.drawerPull;
    else if (curWeapon().ammo === 0) txt = curWeapon().reserve > 0 ? '按 R 换弹' : '按 T 重来';
    else txt = '';
    if (txt !== promptText) { promptText = txt; promptEl.textContent = txt; }
  }

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

  hideFrame(dt);             // 躲猫猫：推进相位、摆好"我是什么/对端是什么"、刷 UI
  updateShards(dt);

  // 受击红屏：挨咬时闪一下，死了就一直暗红
  hurtFlash = Math.max(0, hurtFlash - dt * 1.4);
  if (hurtEl) hurtEl.style.opacity = (hurtFlash + (gameOver ? 0.28 : 0)).toFixed(3);

  // 脱战回血：6 秒没挨咬就慢慢回，回到满为止
  // ⭐ 联机：对端的血条由主机每帧报（快照里的 h 字段），本地既不掉血也不回血，
  //   否则两边各算一套，血条会互相打脸。
  if (!gameOver && netIsHost() && playerHP < MAX_HP && elapsed - lastHurtAt > 6) {
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

/* ⭐ 调试口（不是游戏机制，正式玩完全不碰）。为什么要留：main.js 是 ES 模块，
   里面的 playerHP / doorTarget 这些在控制台和自动化脚本里一个都看不见，
   没这个口就只能靠肉眼盯屏幕。控制台敲 __dbg() 即可。
   握枪距离这两项是这里最有用的部分：躲猫猫要盯的就是人物模型，而 IK 坏掉时画面并不
   "报错"，只是手垂下来或者漂在半空，截图上看着还挺像个人 —— 只有量距离能
   一眼分清"握上了"和"没握上"。正常应 < 0.1 米；完全没跑 IK 时会差到半米以上。 */
window.__dbg = () => ({
  host: netIsHost(), peerOnline: !!netPeerAsPlayer(),
  hide: {
    phase: hs.phase, round: hs.round, tLeft: +hs.tLeft.toFixed(1), form: hs.form,
    hp: hs.hp, dead: hs.dead, iAmHider: iAmHider(), waiting: catcherWaiting(),
    wins: hs.wins.slice(), frozen: hideFrozen, stolen: hs.stolen.length, ready: hs.ready,
    // 爬墙这个功能"到底算不算在爬"肉眼分不出来（人和墙只差十几厘米），所以
    // 把 climbing / 脚底高度 / 这一局的三个形象一起摊到调试口里。
    forms: hs.forms.slice(), climb: climbing, onCeiling, feet: +jumpY.toFixed(2),
    ceilZone: ceilZone ? ceilZone.map((v) => +v.toFixed(1)) : null,
    mountAz: Number.isFinite(myMountAz) ? +myMountAz.toFixed(2) : null, drawer: +drawerK.toFixed(2),
    spin: +hideSpin.toFixed(3), spinDeg: Math.round(hideSpin * 57.3), peerSpinDeg: Math.round(peerPose.spin * 57.3),
    peerMount: peerPose.mnt | 0, peerAz: Number.isFinite(peerPose.ma) ? +peerPose.ma.toFixed(2) : null,
    disDoor: +disDoorK.toFixed(2), disDoorTarget: hs.door,
    drawerTarget: hs.drawer, atDoor: atDisguisePart('door'), atDrawer: atDisguisePart('drawer', false),
    flip: +flipP.toFixed(2), airJump: airJumpLeft, peerFlip: +peerPose.flip.toFixed(2), peerSeen: peerAlive(),
    // 假人是每帧摆的，这里直接调一次好让调试口在没有 rAF 的环境里也能验到
    target: (() => { const o = hideTargetObj();
      return o ? [+o.position.x.toFixed(2), +o.position.z.toFixed(2)] : null; })(),
    spots: ammoSpots.slice(0, 3).map((s) => ({ x: +s.x.toFixed(2), z: +s.z.toFixed(2), n: s.name, st: !!s.stolen })),
    cam: (() => {
      const p = hideCamPose();
      return {
        wantBack: +hideCam.back.toFixed(2), realBack: +p.back.toFixed(2),
        shownBack: +hideBackShown.toFixed(2),    // 相机这一帧真正用的（平滑后的）退距
        clamped: p.back < hideCam.back - 0.01,   // true = 身后有墙/家具，被挤近了
        eyeH: +p.h.toFixed(2),
        camY: +(jumpY + p.h).toFixed(2),          // 相机世界高度（看有没有越过 3.00 / 6.06）
        ceilY: +(localCeilY(player.pos.x, player.pos.z, jumpY) - 0.10).toFixed(2),   // 这一帧允许的最高相机高度
        pitchDeg: +(p.pitch * 180 / Math.PI).toFixed(1),
      };
    })(),
    selfObj: hideSelfObj ? hideSelfObj.visible : null,
    selfMark: hideSelfMark ? hideSelfMark.visible : null,
    peerObj: hidePeerObj ? hidePeerObj.visible : null,
    shot: lastShot,                       // 上一枪打到哪了：no-target / miss / wall / hit
  },
  hp: Math.round(playerHP), over: gameOver, started,
  door: +doorOpen.toFixed(2), doorTarget,
  me: [+player.pos.x.toFixed(2), +player.pos.z.toFixed(2)],
  gun: currentWeapon, ammo: curWeapon().ammo, reserve: curWeapon().reserve,
  mirrorGrip: (() => {
    if (!holdBones || !holdBones.rHand || !mirrorGun || !HOLD.gripR || !avatar) return null;
    const h = new THREE.Vector3(); holdBones.rHand.getWorldPosition(h);
    const g = HOLD.gripR.clone().applyMatrix4(mirrorGun.matrixWorld);
    return +h.distanceTo(g).toFixed(3);
  })(),
  peerGrip: (() => {
    if (!peerRig.bones || !peerRig.bones.rHand || !peerRig.grp || !peerRig.gripR) return null;
    const h = new THREE.Vector3(); peerRig.bones.rHand.getWorldPosition(h);
    const g = peerRig.gripR.clone().applyMatrix4(peerRig.grp.matrixWorld);
    return +h.distanceTo(g).toFixed(3);
  })(),
});

// 测试口：把玩家瞬移到 (x, z) 并转向。
// 为什么要有它：以前只能靠地址栏的 ?pos=&yaw=，一次页面加载只摆得一个点，
// 量"四条走道通不通"就要重载四次、每次等十几秒模型。有了这个，一个页面连着测完。
// 测试口：不开指针锁也能瞄准和开一枪（无头浏览器拿不到 pointer lock）
window.__aim = (yaw = 0, pitch = 0) => {
  player.yaw = +yaw || 0;
  player.pitch = clamp(+pitch || 0, -1.4, 1.4);
  return [+player.yaw.toFixed(2), +player.pitch.toFixed(2)];
};
window.__fire = () => {
  lastShot = null;
  fire();
  return { hp: hs.hp, phase: hs.phase, dead: hs.dead, ammo: curWeapon().ammo,
    cd: +fireCooldown.toFixed(3), shot: lastShot };
};
// 测试口：某个点朝某个方向是不是真的顶着一面"看得见的墙"（返回法线与距离）
window.__wallAt = (x, z, feet, dx, dz) => realWallAt(+x, +z, +feet || 0, +dx, +dz);
// 测试口：这一帧相机到底在哪、朝哪（截图对不上时先看这个，别靠猜）
window.__cam = () => ({
  pos: [+camera.position.x.toFixed(3), +camera.position.y.toFixed(3), +camera.position.z.toFixed(3)],
  yaw: +player.yaw.toFixed(3), pitch: +player.pitch.toFixed(3),
  me: [+player.pos.x.toFixed(3), +player.pos.z.toFixed(3)],
  hider: iAmHider(), phase: hs.phase,
});
window.__look = (dYaw = 0, dPitch = 0) => {
  const dir = new THREE.Vector3(0, 0, -1)
    .applyEuler(new THREE.Euler(player.pitch + dPitch, player.yaw + dYaw, 0, 'YXZ'));
  const rc = new THREE.Raycaster(camera.position, dir);
  const h = rc.intersectObjects([mapScene], true)[0];
  return h ? { d: +h.distance.toFixed(2),
    p: [+h.point.x.toFixed(2), +h.point.y.toFixed(2), +h.point.z.toFixed(2)],
    geo: h.object.geometry.type, mat: h.object.material.color ? h.object.material.color.getHexString() : '' } : null;
};
// 测试口：对端伪装体在世界里的包围盒中心/尺寸（瞄准它才不依赖"这个形象摆多高"）
window.__targetBox = () => {
  const o = hideTargetObj();
  if (!o) return null;
  const b = new THREE.Box3().setFromObject(o);
  const c = b.getCenter(new THREE.Vector3()), s = b.getSize(new THREE.Vector3());
  return { c: [c.x, c.y, c.z].map((v) => +v.toFixed(3)), s: [s.x, s.y, s.z].map((v) => +v.toFixed(3)) };
};
window.__tp = (x, z, yaw = 0, feet = 0) => {
  player.pos.set(x, 0, z);
  player.yaw = yaw;
  // 第四个参数把脚底放到指定高度（测二楼用；不给就是地面）
  jumpY = Math.max(0, +feet || 0);
  jumpV = 0; grounded = true; onCeiling = false; wallMount = false; climbing = false; ceilZone = null;
  return [+player.pos.x.toFixed(2), +player.pos.z.toFixed(2), +jumpY.toFixed(2)];
};

/* 穿模审计：把地图里每件静态家具的世界包围盒拿去和 obstacles 逐个比，
   列出"站着的人应该会撞上、但碰撞表里没登记"的东西。
   筛选条件就是"一个人会不会真的碰到它"：纵向跨过 0.25~1.45 这一段
   （低于 0.25 迈得过去，高于 1.45 撞不到身子），水平至少一边超过 0.2 米
   （细管子、门把手这类不算）。中心落在某个 already 登记的矩形里就算覆盖。 */
window.__audit = () => {
  const LO = 0.25, HI = 1.45, MIN = 0.20;
  const bad = [];
  for (const b of staticBoxes) {
    if (b.y1 < LO || b.y0 > HI) continue;
    if (Math.max(b.x1 - b.x0, b.z1 - b.z0) < MIN) continue;
    const cx = (b.x0 + b.x1) / 2, cz = (b.z0 + b.z1) / 2;
    if (obstacles.some((o) => cx > o.minX - 0.05 && cx < o.maxX + 0.05
      && cz > o.minZ - 0.05 && cz < o.maxZ + 0.05)) continue;
    bad.push(b);
  }
  return { scanned: staticBoxes.length, obstacles: obstacles.length, holes: bad.length, items: bad.slice(0, 120) };
};

/* 连通性检查：自动补固体最大的风险就是把某条路糊死，而这个后果是"游戏
   没法玩"而不是"报错"，不查就会一路做到底。所以在粗网格上从办公室出生点
   做一次 BFS，看每个房间还到不到得了。返回里出现 BLOCKED / UNREACHABLE
   就说明补过头了。 */
window.__reach = () => {
  const CELL = 0.3;
  // 扫描窗口也从 obstacles 现算，不再写死：地图从 x -11~24 变成 x -10~56 了
  let X0 = Infinity, X1 = -Infinity, Z0 = Infinity, Z1 = -Infinity;
  for (const o of obstacles) {
    X0 = Math.min(X0, o.minX); X1 = Math.max(X1, o.maxX);
    Z0 = Math.min(Z0, o.minZ); Z1 = Math.max(Z1, o.maxZ);
  }
  X0 -= 1; Z0 -= 1; X1 += 1; Z1 += 1;
  const nx = Math.ceil((X1 - X0) / CELL), nz = Math.ceil((Z1 - Z0) / CELL);
  const blocked = new Uint8Array(nx * nz);
  for (const o of obstacles) {
    const ix0 = Math.max(0, Math.floor((o.minX - X0) / CELL));
    const ix1 = Math.min(nx - 1, Math.ceil((o.maxX - X0) / CELL));
    const iz0 = Math.max(0, Math.floor((o.minZ - Z0) / CELL));
    const iz1 = Math.min(nz - 1, Math.ceil((o.maxZ - Z0) / CELL));
    for (let iz = iz0; iz <= iz1; iz++) for (let ix = ix0; ix <= ix1; ix++) blocked[iz * nx + ix] = 1;
  }
  const idx = (x, z) => Math.round((z - Z0) / CELL) * nx + Math.round((x - X0) / CELL);
  /* 探针点很可能正好落在一条桌腿、一把椅子上 —— 那不代表路被糊死。
     所以先在附近找一个半径 3 格（约 0.9 米）内的空格再判；找不到才真当它堵了。
     上一版没做这步，"教室E BLOCKED"其实是探针落在课桌上。 */
  const snap = (x, z) => {
    const gx = Math.round((x - X0) / CELL), gz = Math.round((z - Z0) / CELL);
    for (let r = 0; r <= 3; r++) {
      for (let dz = -r; dz <= r; dz++) for (let dx = -r; dx <= r; dx++) {
        const a = gx + dx, b = gz + dz;
        if (a < 0 || b < 0 || a >= nx || b >= nz) continue;
        if (!blocked[b * nx + a]) return b * nx + a;
      }
    }
    return -1;
  };
  /* 探针点不再手写坐标：旧那张表写的是旧地图的「教室A/B/C/D/E」，换了地图它就是一
     套指向别处的假坐标，报出来的 UNREACHABLE 没有任何意义。现在直接从地图的 ROOMS
     生成 —— 每间取中心；出生点、教休室门口和走廊两头另加。 */
  const pts = {
    出生点: [SPAWN.x, SPAWN.z], 教休室门口: [REST_DOOR_X, REST_DOOR_Z - 0.6],
    门厅: [(CLS_FOYER[0] + CLS_FOYER[1]) / 2, (CLS_FOYER[2] + CLS_FOYER[3]) / 2],
    开水间: [(CLS_KS[0] + CLS_KS[1]) / 2, (CLS_KS[2] + CLS_KS[3]) / 2],
    走廊西: [HALL_X0 + 1.0, HALL_ZM], 走廊东: [HALL_X1 - 1.0, HALL_ZM],
  };
  for (let i = 0; i < ROOMS.length; i++) {
    const r = ROOMS[i];
    pts[`房${i} x${r[0]}~${r[1]}`] = [(r[0] + r[1]) / 2, (r[2] + r[3]) / 2];
  }
  const s = idx(...pts['出生点']);
  if (blocked[s]) return { error: '出生点被堵住', at: pts['出生点'] };
  if (blocked[s]) return { error: '出生点被堵住' };
  const seen = new Uint8Array(nx * nz);
  const q = [s];
  seen[s] = 1;
  while (q.length) {
    const c = q.pop();
    const cx = c % nx, cz = (c - cx) / nx;
    for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const a = cx + dx, b = cz + dz;
      if (a < 0 || b < 0 || a >= nx || b >= nz) continue;
      const k = b * nx + a;
      if (blocked[k] || seen[k]) continue;
      seen[k] = 1;
      q.push(k);
    }
  }
  const out = {};
  for (const [n, [x, z]] of Object.entries(pts)) {
    const k = snap(x, z);
    out[n] = k < 0 ? 'NO-FREE-CELL' : (seen[k] ? 'ok' : 'UNREACHABLE');
  }
  /* 单点探针说明不了问题：教室 E 里每隔半米一张长桌一把椅子，探针落在
     家具上、连找 0.9 米内都找不到空格，是**正常**的，不代表那间房被封。
     所以真正该问的是"这间房里有没有任何一个空格能从办公室走到" ——
     按区域统计空格数和其中可达数，free>0 而 reach=0 才是真的糊死了。 */
  const regions = {
    办公室: [-3, 3, -2.4, 2.4], 走廊: [-10, 23, 2.7, 16.6],
    教室A: [-7, -2, 16.9, 20.7], 教室B: [2, 7, 16.9, 20.7],
    教室C: [-8.4, -3.6, -1.5, 2.3], 教室D: [3.6, 8.4, -1.5, 2.3],
    教室E: [10.1, 22.9, 16.9, 27.5],
  };
  const reg = {};
  for (const [n, [x0, x1, z0, z1]] of Object.entries(regions)) {
    let free = 0, reach = 0;
    for (let iz = 0; iz < nz; iz++) for (let ix = 0; ix < nx; ix++) {
      const wx = X0 + ix * CELL, wz = Z0 + iz * CELL;
      if (wx < x0 || wx > x1 || wz < z0 || wz > z1) continue;
      const k = iz * nx + ix;
      if (blocked[k]) continue;
      free++;
      if (seen[k]) reach++;
    }
    reg[n] = { free, reach, verdict: free === 0 ? 'ALL-FURNITURE' : (reach === 0 ? 'SEALED' : (reach / free < 0.25 ? 'MOSTLY-CUT-OFF' : 'ok')) };
  }
  return { cells: nx * nz, blockedCells: blocked.reduce((a, v) => a + v, 0), spots: out, regions: reg };
};

// 地面高度探针：想验"某个东西到底站不站得上去"，直接问 groundAt 最省事，
// 不用跳上去用眼睛看（无头环境里根本跑不了 rAF）。
window.__ground = (x, z, feetY = 0) => +groundAt(x, z, feetY).toFixed(3);

/* ⭐ 联机（第一、二步）：把 main.js 里的私有状态用**取值函数**交出去 ——
   net.js 拿不到 player / jumpY / crouchK 这些模块级变量，只能这样给它读口。
   不缓存值：每帧现取，免得又出现"两处真相"。
   getFrame / applyFrame 是第二步加的：前者=主机每帧要广播的那一帧，
   后者=对端收到后演一遍。net.js 里依然一行 WebSocket 都不认识 main.js 的对象。 */
initNet({
  scene,
  /* ⭐ 第二步 + 持枪同步：发出去的就是"我这帧把这个人摆成了什么样"的那几个数。
     为什么连左手位移都发过来而不是让对面重算：rifleHandOff / shotgunHandOff
     读的是发送方自己的当前武器、弹匣节点、换弹时间轴，对面要重算就得把那两函数
     也参数化一遍 —— 换回来的只是三个数字，抄一份算法不值。 */
  getState: () => {
    const d = curWeapon();
    const magReload = reloading && d && d.mode !== 'shell';
    return {
      x: player.pos.x, z: player.pos.z, yaw: player.yaw,
      jy: jumpY, ck: crouchK, air: !grounded, w: currentWeapon,
      mnt: myMount(),                     // 贴在地面/墙/天花板上，对面照这个摆底座
      oy: selfYaw, ma: myMountAz, sp: hideSpin,   // 朝向 + 贴的哪面墙 + 滚轮转角（抽屉/门板走 hs）
      /* 手上这几件事都发**发送方算好的结果**，不发现场原料：
         tl 枪歪多少 / rw 左手离枪权重 / o 左手位移 / u 弹匣时间轴 / k 泵动进度。
         原料（reloadT、shellTimer、当前武器）随武器和换弹方式变，
         对面要重算就得把 rifleHandOff / shotgunHandOff 也参数化一遍 —— 不值。 */
      tl: +(reloadPoseNow.tilt || 0).toFixed(3),                // 换弹时枪往右歪多少
      rw: +reloadHandWeight.toFixed(3),                         // 左手离枪的权重
      ro: [+reloadHandOff.x.toFixed(3), +reloadHandOff.y.toFixed(3), +reloadHandOff.z.toFixed(3)],
      u: magReload ? +Math.min(1, reloadT / d.reloadTime).toFixed(3) : -1,  // 弹匣时间轴，-1=没在换
      k: +(pumpT > 0 ? pumpCurve(1 - pumpT / PUMP_TIME) : 0).toFixed(3),    // 霰弹枪泵到哪儿了
      flip: +flipP.toFixed(2),                    // 空中翻滚的进度 0~1，0 = 没翻
    };
  },
  getFrame: netHostFrame,        // 主机：这一帧要广播什么（门 + 躲猫猫那一整套状态）
  applyFrame: netApplyFrame,     // 对端：把收到的那一帧演出来
  remoteDoor: netRemoteDoor,     // 对端：我按了 E 开门
  remoteHit: netRemoteHit,       // 抓捕者报来的一枪（他可能就是对端）
  pickForm: netApplyPick,        // 躲藏者选了哪个形象
  stealSpot: netApplySteal,      // 躲藏者掏空了哪一格抽屉
  peerReady: netApplyReady,      // 对端点了准备
  gunPick: netApplyGun,          // 对端（抓捕者）选了哪把枪
  rerollForms: () => rerollForms(),   // 对端（躲藏者）点了「换一批」—— 由主机重抽
  restart: () => restart(),
  maxHP: () => MAX_HP,                  // 对端的血上限不许 net.js 自己写死 100
  /* 对端那个人完全由上面那套"镜子装置"来摆 —— net.js 只递数字，
     不认识骨头名字、不认识握点、不认识换弹时间轴。 */
  peer: { build: peerBuild, drive: peerDrive, gun: peerGun, fire: peerFire,
          visible: peerVisible, root: peerRootObj, isReady: () => peerRig.ready,
          dbg: () => ({ ready: peerRig.ready, gunKey: peerRig.gunKey,
                        at: peerRig.root ? [+peerRig.root.position.x.toFixed(2), +peerRig.root.position.z.toFixed(2)] : null,
                        grpOnRoot: !!(peerRig.grp && peerRig.grp.parent === peerRig.root),
                        gunVisible: !!(peerRig.grp && peerRig.grp.visible),
                        grip: !!(peerRig.bones && peerRig.gripR && peerRig.hf && peerRig.grp),
                        fingers: peerRig.fingers ? peerRig.fingers.length : 0,
                        mag: !!peerRig.magRec, pump: !!peerRig.pumpRec,
                        flashT: +peerRig.flashT.toFixed(3) }) },
});

/* 准备按钮。点完由 pressReady() 决定是本地置位（主机）还是发一条 r 给主机。
   这颗按钮必须点得动 —— 所以等待期间指针锁是放开的，见 hideUpdateUI。 */
if (readyBtnEl) readyBtnEl.addEventListener('click', (e) => {
  e.stopPropagation();
  pressReady();
});

/* 回合状态机的自动化测试口：只在 ?test 下暴露，正常进游戏没有这些函数。
   没有它，验"第三局/死亡锁定/整场结束回大厅"要真等 30+60+8 秒 × 三局。 */
if (dbg.has('test')) {
  window.__hsTest = {
    ready: () => pressReady(),
    pickFirst: () => {
      if (iAmHider() && hs.phase === 'pick' && hs.forms[0]) hidePick(hs.forms[0]);
    },
    /* 爬墙测试要一个能爬的形象：这一局随机三个里如果抽到"门"，它本来就是 noClimb。 */
    pickClimbable: () => {
      if (!iAmHider() || hs.phase !== 'pick') return '';
      const k = hs.forms.find((f) => !(hideFormOf(f) || {}).noClimb);
      if (k) hidePick(k);
      return k || '';
    },
    /* 贴墙时这两下必须都没有反应：jump 返回 false、flip 不起翻。 */
    jump: () => tryJump(JUMP_SPEED),
    flip: () => hideFlip(),
    forceHunt: () => {
      if (netIsHost() && (hs.phase === 'pick' || hs.phase === 'hide')) { toPhase('hunt'); lockGun(); }
    },
    kill: () => {
      if (netIsHost() && hs.phase === 'hunt') hideTakeDamage(999);
    },
    hiderWin: () => {
      if (netIsHost() && hs.phase === 'hunt') hs.tLeft = 0.05;
    },
    endNow: () => {
      if (netIsHost() && hs.phase === 'end') hs.tLeft = 0.05;
    },
    state: () => ({
      host: netIsHost(), hider: iAmHider(), phase: hs.phase, round: hs.round,
      wins: hs.wins.slice(), hp: hs.hp, dead: hs.dead, hiderIsGuest: hs.hiderIsGuest,
      tLeft: +hs.tLeft.toFixed(2), frozen: huntFrozen(), ready: hs.ready,
      attached: attached(), feet: +jumpY.toFixed(2), flip: +flipP.toFixed(2),
      me: [+player.pos.x.toFixed(2), +player.pos.z.toFixed(2)],
      door: doorTarget, doorOpen: +doorOpen.toFixed(2),
      keys: Object.keys(keys).filter((k) => keys[k]),
    }),
  };
}

/* 开局进等待大厅：两个人都点了"准备"才开始。
   第一局角色是固定的（先开的窗口=主机=抓捕者），之后每局轮换。 */
startMatch();

animate();
