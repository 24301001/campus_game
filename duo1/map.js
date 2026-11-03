/* 地图：一整层校园（教休室 + 走廊 + 301/302/313/312 教室 + 阶梯教室 + 信号实验室
   + 男/女卫生间 + 办公室 + 两座楼梯间 + 二楼），几何、程序化贴图、材质、碰撞数据全在这里。
   ⚠ 这份文件是从 C:\Users\wangr\Desktop\3d_room\main.js 的地图段【整块切过来的】，
   只动了下面三处（都标了 [改]），其余字节照抄 —— 双人玩法的代码一行都不在这儿，都在 main.js。
   [改1] 贴图各向异性：源文件在模块顶层就读 renderer.capabilities，而 import 比 main.js 建
        渲染器更早，那会儿根本没有 renderer。改成先登记、等 setMapRenderer() 再统一补。
   [改2] 二楼整层抬高 FLOOR2_LIFT：原来二楼地板和一楼天花板都是 y=ROOM_H 同一个面，
        "爬天花板"和"上二楼"会分不清、还会共面闪面。抬 6 厘米之后：y=3.00 那块是一楼天花板
        （躲藏者贴顶时底座钉它、身子垂回一楼），y=3.06 那块是二楼地板（走楼梯上来的人踩它）。
   [改3] scene 在这里是个普通 Group，由 main.js 挂进真场景 —— 地图代码里有 28 处 scene.add，
        逐处改写不如给一个容器。 */
import * as THREE from './vendor/three.module.js';
import { mergeGeometries, mergeVertices } from './vendor/BufferGeometryUtils.js';

const ROOM_W = 6;
const ROOM_D = 4.8;
const ROOM_H = 3;
const PLAYER_RADIUS = 0.32;
const LAYER_PLAYER = 1;
const FLOOR2_LIFT = 0.06;                 // [改2] 二楼地板相对一楼天花板抬这么多
let mirrorStride = 3;                     // 镜子隔帧刷新（main.js 在掉帧时调 setMirrorStride）

const _anisoTex = [];                     // [改1] 等着补各向异性的贴图
function _aniso(t) { _anisoTex.push(t); return t; }
export function setMapRenderer(r) {
  const a = r.capabilities.getMaxAnisotropy();
  for (const t of _anisoTex) { t.anisotropy = a; t.needsUpdate = true; }
}
export function setMirrorStride(n) { mirrorStride = n; }

const scene = new THREE.Group();          // [改3] 地图的根，main.js 把它挂进真场景
const world = new THREE.Group();          // 静态东西都进这个组，最后 mergeStatic 合批
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
  _aniso(tex);
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
  _aniso(tex);
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
  _aniso(tex);
  return tex;
}

/* 走廊吊顶：照片里是白矿棉板 + 600 mm 方板，比房间里那张矿棉板更白、更干净。
   一张画 2×2 格 = 1.2 m，配 METRIC_UV 的 per=1.2 ⇒ 一格正好 600 mm。 */
function makeCorridorCeilTexture() {
  const S = 256, c = newCanvas(S), g = c.getContext('2d');
  g.fillStyle = '#f5f4ef';
  g.fillRect(0, 0, S, S);
  g.strokeStyle = 'rgba(198,196,190,0.5)';
  g.lineWidth = 1.5;
  for (const p of [0, S / 2, S]) {
    g.beginPath(); g.moveTo(p, 0); g.lineTo(p, S); g.stroke();
    g.beginPath(); g.moveTo(0, p); g.lineTo(S, p); g.stroke();
  }
  sprinkleNoise(g, S, 3);
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  _aniso(tex);
  return tex;
}

/* 乳胶漆墙（新楼用）：只有极淡的滚涂颗粒，没有水痕。
   ⚠ 别拿教休室那张 matWall 去铺走廊——它画了 8 道 2~3 m 长的流挂水痕，贴在 6 m 的
     小屋里是"旧墙"，沿 66 m 走廊平铺 11 次就变成一道道灰印子，像刚漏过水。 */
function makePaintTexture(base, speck) {
  const S = 256, c = newCanvas(S), g = c.getContext('2d');
  g.fillStyle = base;
  g.fillRect(0, 0, S, S);
  for (let i = 0; i < 26; i++) {
    const x = Math.random() * S, y = Math.random() * S, r = 26 + Math.random() * 70;
    const grad = g.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, `rgba(${speck},${0.012 + Math.random() * 0.022})`);
    grad.addColorStop(1, `rgba(${speck},0)`);
    g.fillStyle = grad;
    g.fillRect(x - r, y - r, r * 2, r * 2);
  }
  sprinkleNoise(g, S, 5);
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  _aniso(tex);
  return tex;
}

/* 水磨石：老教学楼走廊/教室地面就是这东西——水泥底 + 密石子 + 500 mm 分格。
   一张画满 2 m（4×4 格），配 METRIC_UV 的 per=2 ⇒ 全楼一个尺度。 */
function makeTerrazzoTexture(base, chipLo, chipHi) {
  const S = 256, N = 4, T = S / N;
  const c = newCanvas(S);
  const g = c.getContext('2d');
  g.fillStyle = base;
  g.fillRect(0, 0, S, S);

  const cols = [chipLo, chipHi, 'rgba(214,211,203,0.9)', 'rgba(58,56,52,0.8)', 'rgba(140,137,130,0.8)'];
  for (let i = 0; i < 3400; i++) {
    const x = Math.random() * S, y = Math.random() * S;
    const r = 0.5 + Math.random() * 1.3;
    g.fillStyle = cols[(Math.random() * cols.length) | 0];
    g.globalAlpha = 0.14 + Math.random() * 0.26;
    g.beginPath();
    g.ellipse(x, y, r, r * (0.55 + Math.random() * 0.7), Math.random() * 3.14, 0, Math.PI * 2);
    g.fill();
  }
  g.globalAlpha = 1;

  // 分格线（跨边界要画满，平铺后才是连续网格）
  g.strokeStyle = 'rgba(60,58,52,0.55)';
  g.lineWidth = 2;
  for (let i = 0; i <= N; i++) {
    g.beginPath(); g.moveTo(i * T, 0); g.lineTo(i * T, S); g.stroke();
    g.beginPath(); g.moveTo(0, i * T); g.lineTo(S, i * T); g.stroke();
  }
  // 几道磨不平整的暗影，免得看着像印刷品
  for (let i = 0; i < 10; i++) {
    const x = Math.random() * S, y = Math.random() * S, r = 30 + Math.random() * 90;
    const grad = g.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, 'rgba(48,46,42,0.06)');
    grad.addColorStop(1, 'rgba(48,46,42,0)');
    g.fillStyle = grad;
    g.fillRect(x - r, y - r, r * 2, r * 2);
  }
  sprinkleNoise(g, S, 7);

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  _aniso(tex);
  return tex;
}

/* 抛光砖（他给的照片：走廊和教室普遍铺这个）：米灰大板、800 mm 规格、缝很细很直、
   面上一丝丝浅纹，亮到能反出门和墙。和水磨石的区别是——水磨石是"碎石子磨平"，
   这个是"整块瓷"，所以石子噪点要几乎去掉，改成大块的柔和明暗 + 极淡的纹路。
   一张画 2×2 格 = 1.6 m，配 METRIC_UV 的 per=1.6 ⇒ 一格正好 800 mm。 */
function makePorcelainTexture(warm = false) {
  const S = 256, N = 2, T = S / N;
  const c = newCanvas(S);
  const g = c.getContext('2d');
  g.fillStyle = warm ? '#d3c6ae' : '#dcd9d2';
  g.fillRect(0, 0, S, S);

  for (let ty = 0; ty < N; ty++) for (let tx = 0; tx < N; tx++) {
    const v = warm ? 206 + Math.floor(Math.random() * 9) : 214 + Math.floor(Math.random() * 10);
    g.fillStyle = warm ? `rgb(${v}, ${v - 12}, ${v - 26})` : `rgb(${v}, ${v - 2}, ${v - 6})`;
    g.fillRect(tx * T, ty * T, T, T);
    // 每块砖一两笔极淡的丝纹（抛光砖的"云纹"），不能多，多了就成大理石背景墙
    for (let i = 0; i < 3; i++) {
      const x0 = tx * T + Math.random() * T, y0 = ty * T + Math.random() * T;
      g.strokeStyle = warm
        ? `rgba(${190 + ((Math.random() * 20) | 0)},${178 + ((Math.random() * 18) | 0)},156,${0.10 + Math.random() * 0.10})`
        : `rgba(${170 + ((Math.random() * 20) | 0)},${168 + ((Math.random() * 18) | 0)},160,${0.10 + Math.random() * 0.10})`;
      g.lineWidth = 1 + Math.random() * 2.5;
      g.beginPath();
      g.moveTo(x0, y0);
      g.bezierCurveTo(x0 + 30, y0 - 22, x0 + 62, y0 + 26, x0 + 96, y0 + 6);
      g.stroke();
    }
    // 面上那层反光：靠角落一圈柔和的高光，亮到能映出东西
    const hx = tx * T + T * (0.25 + Math.random() * 0.5), hy = ty * T + T * (0.2 + Math.random() * 0.4);
    const grad = g.createRadialGradient(hx, hy, 0, hx, hy, T * 0.72);
    grad.addColorStop(0, 'rgba(255,255,255,0.16)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grad;
    g.fillRect(tx * T, ty * T, T, T);
  }

  g.strokeStyle = warm ? 'rgba(120,108,92,0.72)' : 'rgba(74,72,68,0.80)';       // 缝：细、直、深
  g.lineWidth = 2;
  for (let i = 0; i <= N; i++) {
    g.beginPath(); g.moveTo(i * T, 0); g.lineTo(i * T, S); g.stroke();
    g.beginPath(); g.moveTo(0, i * T); g.lineTo(S, i * T); g.stroke();
  }
  sprinkleNoise(g, S, 3);

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  _aniso(tex);
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
  _aniso(tex);
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

/* 黑板：深绿底 + 一层擦痕 + 几行"板书"（长短不一的白线、几个小方框当公式）。
   画布按黑板的长宽比开成 1024×288，不然贴到 4.6×1.3 的板上字会被压扁。
   真写字需要字体度量、还要能看出是中文，三米外看游戏画面根本分辨不出，
   所以这里只做到"远看像写了东西"。 */
function makeBoardTexture() {
  // 512×144 就够：这块板在屏幕里最大也就占三分之一宽，再高只是白占显存。
  // 下面的绘制坐标是按 1024×288 写的，用 scale 折一半，省得重排一遍数字。
  const W = 512, H = 144;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const g = c.getContext('2d');
  g.fillStyle = '#20402f';
  g.fillRect(0, 0, W, H);
  g.scale(W / 1024, H / 288);
  // 板擦擦过的痕迹：一堆半透明的深绿横带（坐标已经在 1024×288 这套逻辑尺上）
  for (let i = 0; i < 90; i++) {
    g.fillStyle = `rgba(${28 + Math.random() * 26},${62 + Math.random() * 30},${46 + Math.random() * 24},0.16)`;
    g.fillRect(Math.random() * 1024, Math.random() * 288, 60 + Math.random() * 260, 8 + Math.random() * 26);
  }
  // 板书：标题一行短粗，正文几行长短不一，右边留一小块"图"
  g.strokeStyle = 'rgba(232,238,226,0.72)';
  g.lineCap = 'round';
  g.lineWidth = 5;
  g.beginPath(); g.moveTo(48, 46); g.lineTo(300, 44); g.stroke();
  g.lineWidth = 3;
  for (let r = 0; r < 6; r++) {
    const y = 86 + r * 30;
    const x0 = 48 + (r % 2) * 26;
    const x1 = x0 + 150 + Math.random() * 300;
    g.beginPath(); g.moveTo(x0, y); g.lineTo(x1, y); g.stroke();
    if (Math.random() < 0.5) {                       // 行末一个小方框，像公式
      g.strokeRect(x1 + 14, y - 11, 42, 20);
    }
  }
  g.beginPath(); g.arc(860, 170, 58, 0, Math.PI * 2); g.stroke();
  g.beginPath(); g.moveTo(802, 170); g.lineTo(918, 170); g.stroke();
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
// 吊扇叶片：照片里是白叶，但叶面朝下吃不到顶灯，只有环境光就会发黑。
// 伪装体的吊扇（main.js 的 buildHallFanForm）也必须用同一份，不能一边白一边灰。
const matFanBlade = new THREE.MeshBasicMaterial({ color: 0xe9e8e1 });
// 蓝色钢质门 + 门扇上方一块小观察窗（不是棕色木门）
const matDoorFrame = new THREE.MeshLambertMaterial({ color: 0x8b9095 });
// 门扇观察窗：照片里是反着走廊影子的灰蓝玻璃，不是能望到外面的假窗
const matDoorGlass = new THREE.MeshBasicMaterial({ color: 0x7f8f93 });

/* ── 教休室那套"生活件"的样式，提到模块级共用 ────────────────────────
   他："把其他地方的电脑、闹钟和垃圾桶都换成教休室的样式"。
   参数是从教休室那三件原样抄的（挂钟见 832 行那段、电脑见书桌那一组、垃圾桶见桌边那只），
   不是重新设计。**教休室自己那份没改调这里**——它是他眼里的参照物，动了就没对照了。
   ⚠ 这批材质必须声明在第一个调用点（buildLectureHall）之前，否则整页白屏（TDZ 踩过三次）。 */
const matPcPlastic = new THREE.MeshStandardMaterial({ color: 0x1b1d20, roughness: 0.52, metalness: 0.12 });
const matPcScreen = new THREE.MeshStandardMaterial({
  color: 0x0d1216, emissive: 0x31566e, emissiveIntensity: 0.65, roughness: 0.32,
});
const matPaperBall = new THREE.MeshStandardMaterial({ color: 0xe8e5da, roughness: 0.95 });
const matBinBody = new THREE.MeshStandardMaterial({ color: 0x2a2d31, roughness: 0.62, metalness: 0.08, side: THREE.DoubleSide });
const matClockFace = new THREE.MeshStandardMaterial({ color: 0xeeeae0, roughness: 0.85 });
const matClockInk = new THREE.MeshStandardMaterial({ color: 0x1c1c1c, roughness: 0.7 });

/* 挂钟：金属表圈 + 表盘 + 12 个刻度（三点位那四格加长）+ 时分两根针各自挂在钟心的组里
   + 中心轴钉。原来各间教室是"一个白圆柱 + 两根黑条"，远看像个按钮。
   yaw = 盘面朝哪（0 朝 +z）；s 是整体缩放（教室那只比屋里的大一圈）。 */
function pWallClock(x, y, z, yaw = 0, s = 1) {
  const g = new THREE.Group();
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.024, 10, 36), matMetal);
  g.add(rim);
  const face = new THREE.Mesh(new THREE.CircleGeometry(0.205, 40), matClockFace);
  face.position.z = 0.014;
  g.add(face);
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const len = (i % 3 === 0) ? 0.045 : 0.026;
    const tick = new THREE.Mesh(new THREE.BoxGeometry(0.012, len, 0.006), matClockInk);
    tick.position.set(Math.sin(a) * 0.175, Math.cos(a) * 0.175, 0.02);
    tick.rotation.z = -a;
    g.add(tick);
  }
  const pivot = (z0, w, len, ang) => {
    const p = new THREE.Group();
    p.position.z = z0;
    const hand = new THREE.Mesh(new THREE.BoxGeometry(w, len, 0.006), matClockInk);
    hand.position.y = len / 2;
    p.add(hand);
    p.rotation.z = ang;
    g.add(p);
  };
  pivot(0.026, 0.020, 0.105, -1.14);            // 时针
  pivot(0.034, 0.014, 0.155, 1.05);             // 分针
  const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.02, 12), matMetal);
  pin.rotation.x = Math.PI / 2;
  pin.position.z = 0.04;
  g.add(pin);
  g.position.set(x, y, z);
  g.rotation.y = yaw;
  g.scale.setScalar(s);
  world.add(g);
  return g;
}

/* 一台台式电脑：底座 + 立柱 + 略后仰的显示器（带发光屏面）+ 两排键帽的键盘 + 鼠标和鼠标垫。
   照教休室书桌那台抄的。x/y/z 是**台面**上放显示器底座的位置，yaw = 屏幕朝哪（0 朝 +z，
   也就是坐着的人面向 −z）。 */
function pDeskPC(x, y, z, yaw = 0, screenMat = matPcScreen, parent = world) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  g.rotation.y = yaw;
  parent.add(g);
  box(g, 0.24, 0.02, 0.17, 0, 0.01, 0, matPcPlastic, false);
  box(g, 0.05, 0.14, 0.05, 0, 0.08, 0, matPcPlastic, false);
  const mon = box(g, 0.52, 0.31, 0.035, 0, 0.28, -0.01, matPcPlastic, false);
  mon.rotation.x = -0.06;
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.46, 0.25), screenMat);
  scr.position.set(0, 0.28, 0.012);
  scr.rotation.x = -0.06;
  g.add(scr);
  box(g, 0.43, 0.022, 0.15, 0.02, 0.013, 0.34, matPcPlastic, false);
  for (let r = 0; r < 2; r++) for (let i = 0; i < 12; i++) {
    box(g, 0.026, 0.008, 0.024, -0.165 + i * 0.033, 0.028, 0.305 + r * 0.036, matPcPlastic, false);
  }
  box(g, 0.22, 0.004, 0.18, 0.44, 0.004, 0.34, matPcPlastic, false);
  const mouse = box(g, 0.07, 0.032, 0.11, 0.44, 0.022, 0.34, matPcPlastic, false);
  mouse.rotation.y = 0.12;
  return g;
}

/* 实验室台式机和躲藏者的"电脑"形态共用这一份模型。
   以前 pDeskPC 多两排键帽、鼠标和鼠标垫，显示器/键盘的 z 也比伪装体偏 4 厘米，
   蹲在旁边一眼能看出哪台是真的；现在两边都调这里，几何和材质只有一份。 */
export function makePcUnit() {
  const g = new THREE.Group();
  box(g, 0.24, 0.02, 0.17, 0, 0.01, 0, matPcPlastic, false);       // 底座
  box(g, 0.05, 0.14, 0.05, 0, 0.08, 0, matPcPlastic, false);       // 立柱
  const mon = box(g, 0.52, 0.31, 0.035, 0, 0.28, -0.02, matPcPlastic, false);
  mon.rotation.x = -0.06;                                          // 和伪装体同一个仰角
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.46, 0.25), matPcScreen);
  scr.position.set(0, 0.28, 0.002);
  scr.rotation.x = -0.06;
  g.add(scr);
  box(g, 0.43, 0.022, 0.15, 0, 0.013, 0.30, matPcPlastic, false);  // 键盘
  return g;
}
let labPcCount = 0;
function pLabPc(x, y, z, yaw = 0, parent = world) {
  const g = makePcUnit();
  g.position.set(x, y, z);
  g.rotation.y = yaw;
  parent.add(g);
  labPcCount++;
  return g;
}

/* ── 按米平铺 UV ────────────────────────────────────────────────────
   BoxGeometry 每张面的 UV 恒为 0~1，所以一张 256² 的墙纹贴到教休室那面 6 m 的墙
   是干净的织物纹，贴到走廊这道 66 m 的墙上就糊成一整片灰——"材质差"九成是这个，
   不是纹理本身不好。
   ⚠ 不能靠"每种尺寸克隆一张 texture 改 repeat"：mergeStatic 按 material.uuid 分桶，
     克隆纹理 = 一种尺寸多一个绘制批次。改顶点 UV 才能一张纹理吃遍全楼。
   METRIC_UV：材质 → 每多少米铺一次贴图。在各自材质声明处 set（这里 matWall 是上面
   那批 Standard 材质里唯一走纹理的，matHallFloor/matHallCeil 在走廊那段登记）。 */
const METRIC_UV = new Map([[matWall, 6]]);
const BOX_UV_EDGE = [[2, 1], [2, 1], [0, 2], [0, 2], [0, 1], [1, 1]];   // 面序 px nx py ny pz nz → 用哪两条边长
function uvBoxMeters(geo, size, per) {
  const uv = geo.attributes.uv;
  for (let f = 0; f < 6; f++) {
    const su = size[BOX_UV_EDGE[f][0]] / per, sv = size[BOX_UV_EDGE[f][1]] / per;
    for (let i = 0; i < 4; i++) {
      const k = f * 4 + i;
      uv.setXY(k, uv.getX(k) * su, uv.getY(k) * sv);
    }
  }
  uv.needsUpdate = true;
}
function uvPlaneMeters(geo, w, h, per) {
  const uv = geo.attributes.uv;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * w / per, uv.getY(i) * h / per);
  uv.needsUpdate = true;
}

function box(parent, w, h, d, x, y, z, mat, shadow = true) {
  const geo = new THREE.BoxGeometry(w, h, d);
  const per = METRIC_UV.get(mat);
  if (per) uvBoxMeters(geo, [w, h, d], per);
  const m = new THREE.Mesh(geo, mat);
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
const hideLockers = [];   // 实验室里能用 E 开门的储物柜（可藏人），每格 = 一组双开门

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
  // 抽屉盒本身是按"面板朝 +Z"建的（见 buildDrawerBox）。桌子转 90° 的教室
  // （比如 E：学生坐在 +X 那侧）要把整组转一下，滑出方向另用 axis 指定。
  if (opts.rotY) unit.rotation.y = opts.rotY;
  unit.position.set(opts.baseX || 0, 0, opts.baseZ || 0);
  scene.add(unit);                  // 不进 world，才不会被静态合并
  const spot = {
    mesh: unit, slide: opts.slide, cur: 0, open: false, cooldown: 0,
    axis: opts.axis || 'z', baseX: opts.baseX || 0, baseZ: opts.baseZ || 0,
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
scene.add(new THREE.HemisphereLight(0xd9e5f1, 0x726c60, 1.24));
scene.add(new THREE.AmbientLight(0xd0d4ce, 0.52));

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
   -------------------------------------------------------------------------
   这一整间（含后面的吊顶和细化陈设）先在旧房局部坐标建好，最后整组搬到
   新 YF311。用户只让搬房间位置，室内的家具、挂件、镜子一件都不重新设计。
   ========================================================================= */
const restOldStart = world.children.length;
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

/* 旧教休室的全部陈设收进这一组（组变换在坐标总表之后设置）。
   造型/坐标仍是旧房里的那套；新房的墙比旧墙厚 8 cm，所以整组只做 180° 旋转
   + 1.3% 的平面缩放，让贴墙件仍贴着新墙，室内的相互位置和照片一致。 */
const restOldRoom = new THREE.Group();
restOldRoom.add(...world.children.splice(restOldStart));
world.add(restOldRoom);

/* 旧房的脏白墙 + 黑踢脚也一起搬：新房间外壳原本是走廊式绿墙裙，现在走廊也
   改成了白墙黑踢脚；旧墙饰面仍整组缩进 2 cm 盖在新墙前面，家具和墙面件同组缩放，
   贴墙的间距保持原样。门洞留 1.36 m。 */
{
  const wallPanel = (w, h, x, y, z, ry) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), matWall);
    m.position.set(x, y, z);
    m.rotation.y = ry;
    m.receiveShadow = true;
    restOldRoom.add(m);
  };
  const sideW = ROOM_W / 2 - 0.68, sideC = 0.68 + sideW / 2;
  wallPanel(ROOM_W, ROOM_H, 0, ROOM_H / 2, -ROOM_D / 2, 0);                 // 旧北墙（朝 +z）
  wallPanel(ROOM_D, ROOM_H, -ROOM_W / 2, ROOM_H / 2, 0, Math.PI / 2);        // 旧西墙（朝 +x）
  wallPanel(ROOM_D, ROOM_H, ROOM_W / 2, ROOM_H / 2, 0, -Math.PI / 2);        // 旧东墙（朝 −x）
  for (const sx of [-1, 1]) {                                                 // 旧南墙门两侧
    wallPanel(sideW, ROOM_H, sx * sideC, ROOM_H / 2, ROOM_D / 2, Math.PI);
  }
  wallPanel(1.36, ROOM_H - 2.28, 0, (ROOM_H + 2.28) / 2, ROOM_D / 2, Math.PI); // 门上

  box(restOldRoom, ROOM_W, 0.11, 0.035, 0, 0.055, -ROOM_D / 2 + 0.018, matBase, false);
  box(restOldRoom, 0.035, 0.11, ROOM_D, -ROOM_W / 2 + 0.018, 0.055, 0, matBase, false);
  box(restOldRoom, 0.035, 0.11, ROOM_D, ROOM_W / 2 - 0.018, 0.055, 0, matBase, false);
  for (const sx of [-1, 1]) {
    box(restOldRoom, sideW, 0.11, 0.035, sx * sideC, 0.055,
      ROOM_D / 2 - 0.018, matBase, false);
  }
}

/* =========================================================================
   教休室南墙：照片里的深棕双扇木门
   -------------------------------------------------------------------------
   深棕近黑门框 + 实心双扇木门 + 左扇“6 1 2 / 教师休息室”黄牌 +
   右扇银色执手和锁 + 黑门槛/踢脚。门板仍然单独挂门轴组，由玩法那边
   （main.js）统一做开合。
   ⚠ 地图和伪装体「门」共用 makeRestDoorModel()：几何、材质、门牌只留一份，
     躲进门里才不会和真门分叉。
   ========================================================================= */
function makeRestSignTex(w, h, draw) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
const matRestPlaque = new THREE.MeshBasicMaterial({
  map: makeRestSignTex(512, 160, (g, w, h) => {
    g.fillStyle = '#f2c21a'; g.fillRect(0, 0, w, h);
    g.strokeStyle = '#1d1b17'; g.lineWidth = 10; g.strokeRect(8, 8, w - 16, h - 16);
    g.fillStyle = '#1d1b17'; g.font = 'bold 84px "Microsoft YaHei","SimHei",sans-serif';
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText('教师休息室', w / 2, h / 2 + 4);
  }),
});
const matRestNo = new THREE.MeshBasicMaterial({
  map: makeRestSignTex(256, 96, (g, w, h) => {
    g.fillStyle = '#f2c21a'; g.fillRect(0, 0, w, h);
    g.strokeStyle = '#1d1b17'; g.lineWidth = 5; g.strokeRect(5, 5, w - 10, h - 10);
    g.fillStyle = '#1d1b17'; g.font = 'bold 48px "Microsoft YaHei","SimHei",sans-serif';
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText('6 1 2', w / 2, h / 2 + 3);
  }),
});
const matRestFrame = new THREE.MeshStandardMaterial({ color: 0x2b211c, roughness: 0.62, metalness: 0.04 });
// 照片里的门是深巧克力色、不是纯黑。木纹走**竖向**：通用的 makeWoodTexture 是横向波浪，
// 贴到 0.56×2.12 的门板上会拉成斑马纹，和照片里的直纹差太远。
function makeRestLeafTex() {
  const S = 256;
  const c = document.createElement('canvas'); c.width = S; c.height = S;
  const g = c.getContext('2d');
  g.fillStyle = 'rgb(96,60,38)'; g.fillRect(0, 0, S, S);
  for (let i = 0; i < 120; i++) {
    const x0 = Math.random() * S;
    g.strokeStyle = `rgba(28,14,6,${0.02 + Math.random() * 0.055})`;
    g.lineWidth = 0.5 + Math.random() * 1.4;
    g.beginPath();
    for (let y = 0; y <= S; y += 10) {
      const x = x0 + Math.sin(y * 0.018 + i) * 1.5 + Math.sin(y * 0.06 + i * 2.1) * 0.6;
      if (y === 0) g.moveTo(x, y); else g.lineTo(x, y);
    }
    g.stroke();
  }
  for (let i = 0; i < 36; i++) {
    const x0 = Math.random() * S;
    g.strokeStyle = `rgba(158,110,72,${0.015 + Math.random() * 0.03})`;
    g.lineWidth = 0.8 + Math.random() * 1.2;
    g.beginPath();
    for (let y = 0; y <= S; y += 14) {
      const x = x0 + Math.sin(y * 0.02 + i * 1.3) * 1.1;
      if (y === 0) g.moveTo(x, y); else g.lineTo(x, y);
    }
    g.stroke();
  }
  sprinkleNoise(g, S, 7);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  _aniso(tex);
  return tex;
}
const matRestLeaf = new THREE.MeshStandardMaterial({
  map: makeRestLeafTex(), roughness: 0.62,
});
const matRestSteel = new THREE.MeshStandardMaterial({
  color: 0xc2c5c7, roughness: 0.3, metalness: 0.85,
});

function makeRestDoorModel() {
  const frame = new THREE.Group();
  // 门框 + 走廊侧门套 + 黑门槛（框内净宽 1.12：门板外沿正好压在门框里）
  box(frame, 0.10, 2.18, 0.10, -0.61, 1.09, 0, matRestFrame, false);
  box(frame, 0.10, 2.18, 0.10, 0.61, 1.09, 0, matRestFrame, false);
  box(frame, 1.32, 0.10, 0.10, 0, 2.19, 0, matRestFrame, false);
  box(frame, 0.08, 2.26, 0.05, -0.66, 1.13, 0.065, matRestFrame, false);
  box(frame, 0.08, 2.26, 0.05, 0.66, 1.13, 0.065, matRestFrame, false);
  box(frame, 1.40, 0.08, 0.05, 0, 2.27, 0.065, matRestFrame, false);
  box(frame, 1.22, 0.02, 0.14, 0, 0.01, 0.02, matBase, false);

  const leaves = [];
  for (const sx of [-1, 1]) {
    const pivot = new THREE.Group();
    const cx = -sx * 0.2795;
    const p1 = new THREE.Mesh(new THREE.BoxGeometry(0.559, 2.12, 0.05), matRestLeaf);
    p1.position.set(cx, 1.08, -0.045);
    p1.castShadow = false; p1.receiveShadow = true;
    pivot.add(p1);
    box(pivot, 0.53, 0.12, 0.008, cx, 0.08, -0.017, matBase, false);
    // 办公室内侧执手（原来就有，保留）
    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.10, 10), matMetal);
    handle.rotation.z = Math.PI / 2;
    handle.position.set(-sx * 0.46, 1.02, -0.085);
    pivot.add(handle);
    if (sx > 0) {
      // 走廊侧银色执手 + 锁（照片里在右扇靠门缝处）
      const rose = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.014, 12), matRestSteel);
      rose.rotation.x = Math.PI / 2;
      rose.position.set(cx - 0.19, 1.05, -0.012);
      pivot.add(rose);
      box(pivot, 0.14, 0.018, 0.018, cx - 0.13, 1.05, -0.012, matRestSteel, false);
      const lock = new THREE.Mesh(new THREE.CylinderGeometry(0.017, 0.017, 0.010, 10), matRestSteel);
      lock.rotation.x = Math.PI / 2;
      lock.position.set(cx - 0.19, 0.92, -0.012);
      pivot.add(lock);
    }
    pivot.position.set(sx * 0.56, 0, 0);
    pivot.userData.out = sx;
    leaves.push(pivot);
  }
  // 左扇门牌：教师休息室 + 6 1 2（走廊侧，都在门板高度内）
  const left = leaves[0];
  const plaque = new THREE.Mesh(new THREE.PlaneGeometry(0.46, 0.14), matRestPlaque);
  plaque.position.set(0.275, 1.90, -0.016);
  left.add(plaque);
  const no = new THREE.Mesh(new THREE.PlaneGeometry(0.26, 0.07), matRestNo);
  no.position.set(0.275, 2.025, -0.016);
  left.add(no);
  return { frame, leaves };
}

let doorLeft, doorRight;   // 实体在新教休室北墙（门厅侧），见下面坐标总表之后的那一组

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
      // 隔帧更新（默认每 3 帧一次，画面吃力时自动降到每 4 帧一次），开销减半以上
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

// 穿衣镜已随教休室搬到南侧新房间（房间坐标定下来之后才建，见下面总表后的镜子组）

/* =========================================================================
   吊顶：荧光灯 + 烟雾探测器 + 消防喷淋头
   ========================================================================= */
const restCeilStart = world.children.length;
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
restOldRoom.add(...world.children.splice(restCeilStart));

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
   门外世界：一条东西向走廊 + 五间教室
   -------------------------------------------------------------------------
   走廊：x -10 ~ 26.5，z 2.4 ~ 12.4（宽 10 m）
   南侧教室 A(-7~-2) B(2~7)，z 12.4 ~ 16.4
   北侧教室 C(-8.5~-3.5) D(3.5~8.5)，z -1.6 ~ 2.4
   东头教室 E：10~23 × 12.4~23.2，门开在它靠走廊那面墙（=学生的右手边）
   教室门洞：x -7~-5、5~7（走廊南墙 / 北墙各一对）
   ========================================================================= */
const WALL_T = 0.08;
const deskRects = [];
const chairRects = [];       // 蓝色椅子也要挡人（原来只有桌子登记了碰撞，人能穿椅而过）
const hallFans = [];         // 新教室里那几台吊扇，每帧转（办公室那台在 fanGroup 里自己转）

/* 一台吊扇：构造必须和躲藏者的吊扇形象**逐件一样**（main.js 的 buildHallFanForm）——
   0.30 长的吊杆、铁轮毂、三片 0.62×0.13 的叶片，叶片各挂在自己的旋转臂上、带 0.06
   迎风角。以前这里把三片叶合成了一个几何体（省批次），看起来就是个扁盘子，和躲藏者
   变出来的那台对不上；他要求全部以伪装体的样子为准，所以宁可多几个绘制批次
   （每台 5 个 mesh，18 台两层 = 90 个；合批时是 18 个 —— 这点开销换逐件一致）。
   原点 = 钉在天花板上的那一点，几何全挂在原点下方（叶片在 −0.36）：躲藏者爬上天花板
   （脚底 3.00）变成风扇时，垂下来的高度和这里分毫不差。
   ⚠ 不能挂 world —— mergeStatic 会按材质把它们并进静态批次、把原对象从父节点摘掉，
     那时 hallFans 里存的组只剩个空壳，`rotation.y += dt` 转的是空气（这次就是这样）。 */
function pCeilingFan(x, y, z) {
  const g = new THREE.Group();
  g.position.set(x, y, z);
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
  // 每台的转速给得不一样（按建成顺序，确定性，别用 random 免得两次截图对不上）：
  // 全楼同速会转成一片整齐的频闪，看着像贴图在跳。
  g.userData.spd = 5.6 + (hallFans.length % 3) * 1.5;
  scene.add(g);
  hallFans.push(g);
  return g;
}
// 测试口：吊扇到底有没有在转、转的是不是真几何。以前叶片被 mergeStatic 合掉，
// 转的是空壳，光看截图（静止的一帧）根本发现不了——所以要在两个时刻读同一个数求差。
// 现在一台扇子是一个 Group（吊杆 + 轮毂 + 三片叶），顶点数要把子树加在一起数。
window.__fans = () => hallFans.map((f) => {
  let verts = 0, meshes = 0;
  f.traverse((o) => {
    if (o.isMesh && o.geometry && o.geometry.attributes.position) {
      verts += o.geometry.attributes.position.count;
      meshes++;
    }
  });
  return [+f.rotation.y.toFixed(3), f.visible ? 1 : 0, verts, meshes,
    +(f.parent === scene ? 1 : (f.parent === floor2Group || (f.parent && f.parent.parent === scene) ? 2 : 0))];
});

// 地面/天花换成 Lambert：这两块是全屏面积的 PBR 像素，走廊加宽到 7.2 m 之后
// 更明显。roughness 0.9 / metalness 0.02 本来就约等于纯漫反射，看不出差别。
// ⚠ 原来是**纯色**，所以整条走廊看着像一张灰纸——现在挂上水磨石/矿棉板纹理，
//   并且登记进 METRIC_UV 按米平铺（不然纹理会被 66 m 的板拉成一片糊）。
const matHallFloor = new THREE.MeshLambertMaterial({ map: makeTerrazzoTexture('#8d8b83', 'rgba(228,224,214,0.9)', 'rgba(120,124,116,0.9)') });
const matHallCeil  = new THREE.MeshLambertMaterial({ map: makeCeilingTexture() });
// 走廊吊顶用不参与光照的材质：照片里天花板是均匀的白矿棉板，
// 受光后发黄会变成"旧茶色顶"，反而不像。
const matCorridorCeil = new THREE.MeshBasicMaterial({ map: makeCorridorCeilTexture() });
const matStrip     = new THREE.MeshBasicMaterial({ color: 0xf2f4e6 });
METRIC_UV.set(matHallFloor, 2);
METRIC_UV.set(matHallCeil, 1.2);
METRIC_UV.set(matCorridorCeil, 1.2);
// 教室/休息室：他照片里那种米灰抛光砖（800 规格）。实验室 F 仍用上面的水磨石。
const matFloorTile = new THREE.MeshLambertMaterial({ map: makePorcelainTexture() });
METRIC_UV.set(matFloorTile, 1.6);
/* 走廊和门厅照实拍用暖米色亮面砖：Lambert 没有高光，照片里那种"灯影拖在地上"
   出不来，所以这里单独用 Phong，低 shininess 只拉出柔和的反射，不做真镜面。 */
const matHallWalk = new THREE.MeshPhongMaterial({
  map: makePorcelainTexture(true), color: 0xfff4e6, shininess: 70, specular: 0x6a6256,
});
METRIC_UV.set(matHallWalk, 1.6);
// 走廊吊顶的圆形筒灯：照片里是暖白发光片 + 一圈浅灰收口
const matDownlight = new THREE.MeshBasicMaterial({ color: 0xffe4a8 });
const matDownRing  = new THREE.MeshBasicMaterial({ color: 0x8a857b });
const matSmoke     = new THREE.MeshLambertMaterial({ color: 0xf0eee8 });
const matSmokeDark = new THREE.MeshLambertMaterial({ color: 0x4d4b46 });
// 大教室 E 的地面偏暖：照片里是奶黄色 800 抛光砖，不是走廊那种灰白
// 砖本身已是暖米色，但天花板半球光偏蓝，照上去会中和成灰白；照片里是明显的米灰砖，
// 所以用材质色把被光吃掉的那点暖调补回来。只影响这一间教室。
const matFloorLect = new THREE.MeshLambertMaterial({ map: makePorcelainTexture(true), color: 0xfff2de });
METRIC_UV.set(matFloorLect, 1.6);
/* 电梯厅地面：同一张 800 抛光砖，但用 Standard + 低 roughness。
   他给的照片里地面能反出门和墙的影子——Lambert 一点高光都没有，看着像水泥。
   （不挂真镜面：那要多渲一遍整个场景，走廊尽头这间不值这个代价，
     低 roughness 在这盏顶灯下已经能拉出一条明显的高光。） */
const matFloorEL = new THREE.MeshStandardMaterial({
  map: matFloorTile.map, color: 0xb7b4b0, roughness: 0.20, metalness: 0.06,
});
METRIC_UV.set(matFloorEL, 1.6);
// 新楼（逸夫层）的墙：干净乳胶漆，和教休室那张带水痕的 matWall 分开。
// ⚠ 用 Lambert 不用 Standard：这两道墙是全屏面积，和地面天花同一个理由（见上面那段注释）。
const matWallPaint = new THREE.MeshLambertMaterial({ map: makePaintTexture('#e6e3dc', '96,88,74') });
METRIC_UV.set(matWallPaint, 4);
/* 走廊墙面照实拍改成整面白墙 + 12 cm 黑踢脚；原来 1.1 m 的深绿墙裙全部撤掉。
   黑踢脚沿用 matBase（地图里门槛/旧踢脚一直是这个颜色），不再另造一套。 */
const SKIRT_H = 0.12;

function slabRect(x0, x1, z0, z1, y, mat, down) {
  const w = x1 - x0, d = z1 - z0;
  const geo = new THREE.PlaneGeometry(w, d);
  const per = METRIC_UV.get(mat);
  if (per) uvPlaneMeters(geo, w, d, per);
  const m = new THREE.Mesh(geo, mat);
  m.rotation.x = down ? Math.PI / 2 : -Math.PI / 2;
  m.position.set((x0 + x1) / 2, y, (z0 + z1) / 2);
  m.receiveShadow = !down;
  world.add(m);
  return m;
}

function wallX(x0, x1, z) {     // 沿 x 方向延伸的墙
  box(world, x1 - x0, ROOM_H, WALL_T, (x0 + x1) / 2, ROOM_H / 2, z, matWallPaint);
  // 踢脚贴到墙的两侧（这道墙一边是走廊、一边是房间，两侧都得有）。
  // ⚠ 只许凸出墙面 1 cm：黑板/暖气片/窗帘杆这些贴墙件是按"离墙心 6~7 cm"建的，
  //   踢脚做厚了会从它们底下顶出来一条边。
  const w = x1 - x0, cx = (x0 + x1) / 2;
  if (w > 0.3) for (const s of [-1, 1]) {
    const zz = z + s * (WALL_T / 2 + 0.005);
    box(world, w, SKIRT_H, 0.012, cx, SKIRT_H / 2, zz, matBase, false);
  }
}

function wallZ(z0, z1, x) {     // 沿 z 方向延伸的墙
  box(world, WALL_T, ROOM_H, z1 - z0, x, ROOM_H / 2, (z0 + z1) / 2, matWallPaint);
  const d = z1 - z0, cz = (z0 + z1) / 2;
  if (d > 0.3) for (const s of [-1, 1]) {
    const xx = x + s * (WALL_T / 2 + 0.005);
    box(world, 0.012, SKIRT_H, d, xx, SKIRT_H / 2, cz, matBase, false);
  }
}

/* ── 能开关的门：教室 / 实验室 / 办公室 / 卫生间大门 / 隔间 ───────────
   门叶挂在 scene 上（不进 world，否则会被静态合并、再也转不动）。
   门轴在铰链处，门叶朝组内 +x 伸；closedYaw/openYaw 是组绕 y 的两个角度。
   一楼门 rect 挡人（top 2.4），二楼同一位置再挂一份门叶 + rect2（base 3, top 5.4）。
   两层共用开关状态；只做一楼会出现"按 E 显示开关了、二楼却没门"的假门。 */
const swingDoors = [];
function makeSwingDoor({ hx, hz, width, y0 = 0, closedYaw, openYaw, leafMat, glass = false,
  win = false, transom = false, name = '门', rect = null, startOpen = false, height = 2.06 }) {
  function leafAt(y) {
    const hg = new THREE.Group();
    hg.position.set(hx, y, hz);
    hg.rotation.y = closedYaw + (startOpen ? openYaw - closedYaw : 0);
    scene.add(hg);
    box(hg, width, height, 0.04, width / 2, height / 2, 0, leafMat, false);
    // 把手和小窗都要穿出门板两面：只做单面，从走廊看就是一整块没有窗的门
    for (const s of [-1, 1]) {
      box(hg, 0.05, 0.05, 0.16, width - 0.12, 1.02, s * 0.08, matAlu, false);
    }
    if (glass) box(hg, 0.22, 1.10, 0.06, width * 0.55, 1.35, 0, matGlassDay, false);
    if (win) {                                        // 门顶观察窗：深木框 + 灰蓝玻璃
      const gw = Math.min(width * 0.50, 0.74), gh = 0.92, gy = 1.52, fb = 0.05;
      box(hg, gw + 2 * fb, fb, 0.06, width * 0.5, gy + gh / 2 + fb / 2, 0, leafMat, false);
      box(hg, gw + 2 * fb, fb, 0.06, width * 0.5, gy - gh / 2 - fb / 2, 0, leafMat, false);
      box(hg, fb, gh, 0.06, width * 0.5 - gw / 2 - fb / 2, gy, 0, leafMat, false);
      box(hg, fb, gh, 0.06, width * 0.5 + gw / 2 + fb / 2, gy, 0, leafMat, false);
      // 玻璃两面各贴一片（门板是不透明的，塞在门板里那一层会被挡住）
      for (const s of [-1, 1]) {
        const pane = new THREE.Mesh(new THREE.PlaneGeometry(gw, gh), matDoorGlass);
        pane.position.set(width * 0.5, gy, s * 0.021);
        if (s < 0) pane.rotation.y = Math.PI;
        hg.add(pane);
      }
      box(hg, gw, 0.026, 0.07, width * 0.5, gy, 0, leafMat, false);   // 中横档
    }
    return hg;
  }
  const hinge = leafAt(y0);
  const hinge2 = leafAt(y0 + ROOM_H);          // 二楼那份
  // 门楣：门洞是通到 3 m 顶的，门扇只有 2.06 m，不补一块就变成"门上面一个大洞"
  if (transom) {
    const tg = new THREE.Group();
    tg.position.set(hx, y0, hz);
    tg.rotation.y = closedYaw;
    world.add(tg);
    box(tg, width, ROOM_H - 2.10, 0.06, width / 2, (ROOM_H + 2.10) / 2, 0, matWall, false);
  }
  let rect2 = null;
  if (rect) {
    rect.no2f = true; rect.top = startOpen ? 0 : 2.4; deskRects.push(rect);
    rect2 = { ...rect, top: startOpen ? 0 : ROOM_H + 2.4, base: ROOM_H, no2f: true };
    deskRects.push(rect2);
  }
  const d = {
    hinge, hinge2, width, open: startOpen, cur: startOpen ? 1 : 0, closedYaw, openYaw, rect, rect2, name,
    cx: hx + Math.cos(closedYaw) * width / 2,
    cz: hz - Math.sin(closedYaw) * width / 2,
  };
  swingDoors.push(d);
  return d;
}

// ── 壁挂空调（休息室那台的样子：白壳 + 下沿出风格栅 + 一颗绿灯）──────
// 学校各屋原来用的是吊顶方形风口，他要求统一换成这种。face = 出风朝向。
const matAcTrim = new THREE.MeshStandardMaterial({ color: 0xb9b6ae, roughness: 0.8 });
const matAcLed = new THREE.MeshBasicMaterial({ color: 0x63d18a });
function pSplitAC(x, y, z, face = '+x') {
  const g = new THREE.Group();
  box(g, 0.20, 0.30, 0.92, 0, 0, 0, matWhitePlastic);            // 机身（长边沿本地 z）
  box(g, 0.02, 0.05, 0.84, 0.105, -0.10, 0, matAcTrim, false);   // 下沿出风格栅
  const led = new THREE.Mesh(new THREE.CircleGeometry(0.012, 8), matAcLed);
  led.rotation.y = Math.PI / 2;
  led.position.set(0.103, 0.08, 0.32);
  g.add(led);
  g.position.set(x, y, z);
  g.rotation.y = { '+x': 0, '+z': -Math.PI / 2, '-x': Math.PI, '-z': Math.PI / 2 }[face];
  world.add(g);
}

// ── 走廊 / 教室坐标总表：以后要挪房间、改尺寸只动这一段 ─────────────// 走廊 2.4 m 时他说"至少三倍"，做到 7.2 又翻倍到 14.4，最后他定"走廊10"。
// ⚠ 只动南墙：北墙 z=2.4 是办公室那道门所在的面，一动就要跟着改
//   doorBetween / leapPathClear / inRoom 那一整串 2.40 的判据。
/* ══════════════════════════════════════════════════════════════════════
   逸夫楼三层 —— 照《逸夫楼三层安全疏散示意图》+ 门外实景照片重排（2026-10-24）
   ----------------------------------------------------------------------
   走廊东西向、宽 **4.5 m**。约定：**z 越小越北**，所以图上"上排"房间在 z<2.4，
   "下排"房间在 z>6.9。西→东的排布照图：
     北侧：旧西北角（封门空房，图上属西翼）→ YF301 → YF302 → 配电室 →
           楼梯间B → **YF303 = 实验室 F**（图里它本来就比邻居住得深，凸出来一块）→ 电梯厅
     南侧：YF313 → YF312 → 男女卫生间 → **开水间 → 教休室 YF311（凹进去 3 m）** →
           YF310 = 大教室 E → YF309 = 办公室 H
   西头另有楼梯间A。只做西半段 + YF310/YF309：YF304~YF308、YF306 和东南角
   楼梯间不建，走廊尽头仍用施工围挡封死。
   ⚠ 教休室整间南移 3 m，内部 6×4.8 与陈设一件不动；门前 z=6.9~9.9 变成凹进门厅，
     东墙就是 YF310 西墙（咖啡机/水架/货柜靠它朝西），开水间在门西侧、与前墙齐平。
   ========================================================================= */
const HALL_Z0 = 2.4, HALL_Z1 = 6.9;                  // 走廊 4.5 m 宽
const HALL_ZM = (HALL_Z0 + HALL_Z1) / 2;             // 走廊中线 z = 4.65
const HALL_WALK_Z0 = 2.62, HALL_WALK_Z1 = HALL_Z1 - 0.18;  // 丧尸能走的 z 带
const HALL_X0 = -10.0, HALL_X1 = 62.8;               // 东头那 2.4 m 是隔断后的死头

// ── 北侧房间（贴走廊北墙 z=2.4 开门），西→东 ─────────────────────────
const CLS_301 = [5.8, 13.8, -5.6, HALL_Z0];   // YF301 教室 8×8
const CLS_302 = [13.8, 21.8, -5.6, HALL_Z0];  // YF302 教室 8×8
const CLS_PD  = [21.8, 24.8, -1.4, HALL_Z0];  // 配电室 3×3.8
const CLS_STB = [24.8, 29.3, -4.0, HALL_Z0];  // 楼梯间B 4.5×6.4（双跑折返，见下面 SB_*）
// 楼梯间B：**双跑折返，真接二楼**（和西头那个同一套做法）
//   南侧平台 z 0.4~2.4 紧挨贴走廊那道门：1F 是 0 m、2F 是 3 m（两道门同一个 x 区间）。
//   西跑从平台往北上 0→1.5，北端半平台转身，东跑从北往南上 1.5→3.0 回到平台。
//   进深账：平台 2.0 + 梯段 3.0 + 半平台 1.4 = 6.4 = 房间进深。
const SB_W = 1.60;                                 // 单跑宽
const SB_A0 = 24.90, SB_A1 = 26.50;                 // 西跑（0 → 1.5，往北）
const SB_B0 = 27.60, SB_B1 = 29.20;                 // 东跑（1.5 → 3.0，往南）
const SB_ZP = 0.40, SB_ZM = -2.60;                  // 梯段南端 / 北端半平台南沿
const SB_RUN = SB_ZP - SB_ZM, SB_RISE = 1.5;        // 3.0 / 1.5
const CLS_EL  = [42.3, 46.5, -3.0, HALL_Z0];  // 电梯厅：两台电梯门，不做井道
const EL_OPEN = [CLS_EL[0] + 0.7, CLS_EL[1] - 0.7];   // 电梯厅对走廊是敞口
// ── 南侧房间（贴走廊南墙 z=6.9 开门），西→东 ─────────────────────────
// 照照片的凹进前室：进门后**正前方是女厕门（朝北/朝走廊）**，右侧是男厕门（朝东），
// 女厕门右边还有一扇常闭棕门（清洁间）。原来两边对开的做法是错的。
// 男厕向西扩 0.8 m（YF312/YF313 整间西移，内部陈设跟随房间不动），女厕挪到前室南侧，
// 进深 7.8 m，向南多出 3 m；前室因此放大到 3.9×3.0，走廊洞口 1.7 m。
const CLS_313 = [5.0, 13.0, HALL_Z1, 14.9];   // YF313 教室 8×8（整体西移 0.8）
const CLS_312 = [13.0, 21.0, HALL_Z1, 14.9];  // YF312 教室 8×8（整体西移 0.8）
const WC_MEN_DOOR_Z = [7.65, 8.55];           // 男厕门：前室西墙，朝东
const WC_WOMEN_DOOR_X = [26.70, 27.60];       // 女厕门：前室南墙东侧（照片左圈），朝北
const WC_BROWN_DOOR = [25.15, 26.05];         // 常闭棕门（清洁间）在前室南墙中间
const WC_CLOSET_D = 0.90;                     // 棕门后清洁间进深
const WC_LOBBY = [24.5, 28.4, HALL_Z1, 9.9];   // 共用前室 3.9×3.0（凹进走廊）
const WC_OPEN  = [24.85, 26.55];               // 走廊上的洞口（1.7 m）
const CLS_G   = [21.0, 24.5, HALL_Z1, 14.7];  // 男卫生间 3.5×7.8
const CLS_W   = [24.5, 28.4, 9.9, 17.7];      // 女卫生间 3.9×7.8（前室南侧）
// 教休室门前凹进门厅 3.0 m 深：把教休室整间南移，室内 6×4.8 一件不改。
const FOYER_D = 3.0;
const REST_FRONT_Z = HALL_Z1 + FOYER_D;              // 9.9 = 门厅南墙 / 教休室前墙
// 开水间在门西侧，北墙只砌到 30.9，30.9~32.8 朝走廊和门厅敞开；南墙与教休室前墙齐平。
const CLS_KS   = [28.4, 32.8, HALL_Z1, REST_FRONT_Z];
const CLS_FOYER = [32.8, 36.4, HALL_Z1, REST_FRONT_Z]; // 门厅东墙 = YF310 西墙
const CLS_REST = [30.4, 36.4, REST_FRONT_Z, REST_FRONT_Z + 4.8]; // 教休室 6×4.8
const CLS_H   = [49.4, 60.4, HALL_Z1, 15.4];  // YF309 办公室 11×8.5（他指定放 309）

// ── 大教室 E = YF310：13 m（沿走廊方向）× 10.8 m ─────────────────────
// ⚠ 长边必须沿走廊。门只能开在贴走廊那面墙上，而他要说的是"坐在椅子上走廊在右手边"
//   ⇒ 黑板墙必须和走廊垂直 ⇒ 排距方向变成 x、3 列长桌的方向变成 z。
// ⚠ 长宽都是被"人要能走过去"顶出来的：PLAYER_RADIUS = 0.32 ⇒ 通道净宽要 > 0.64
//   才走得动，留到 0.9 以上才不别扭。列间 0.95／排间 0.67／靠墙 0.81。
// ⚠ 西墙 36.4 现在同时是门厅东墙：机器靠这面墙朝西，前门仍在 x40 之后。
const CLS_E = [36.4, 49.4, HALL_Z1, HALL_Z1 + 10.8];
const CLS_E_DOORS = [[40.0, 41.6], [48.1, 49.0]];   // 前门（机器东侧）、后门（后走道）
// ── 实验室 F = YF303：13 × 16.2 = 210.6 m²，图里它本来就凸出来一块 ────
// 门只能在贴走廊那面墙（z=2.4），所以黑板放在最里侧的北墙。
const CLS_F = [29.3, 42.3, HALL_Z0 - 16.2, HALL_Z0];
const CLS_F_DOORS = [[31.5, 33.1]];
// ── 各间在走廊墙上的门洞（1.6 m 宽；配电室 1.4 m）──────────────────────
const DOOR_301 = [11.6, 13.2], DOOR_313 = [10.8, 12.4];   // 前门（靠东那头）
const DOOR_302 = [14.4, 16.0], DOOR_312 = [13.6, 15.2];
const DOOR_301B = [6.4, 8.0], DOOR_313B = [5.6, 7.2];     // 后门（靠西那头）—— 和大教室一样前后各一道
const DOOR_302B = [19.6, 21.2], DOOR_312B = [18.8, 20.4];
const DOOR_PD  = [22.4, 23.4];               // 强电间单扇门 1.0 m（照实拍门宽）
const DOOR_STB = [25.4, 27.0];
// 卫生间不再各自朝走廊开门：走廊上只有 WC_OPEN 一个凹口，进去后左右分流。
// 教休室门：1.2 m 净洞，双扇木门框压住两侧；门已经跟着房间退到 z=9.9 的门厅南墙。
const REST_DOOR_X = 33.4;
const REST_DOOR_Z = REST_FRONT_Z;
const REST_DOOR = [REST_DOOR_X - 0.6, REST_DOOR_X + 0.6];
// 开水间北墙只砌到 30.9；30.9~32.8 是开水间敞口，32.8~36.4 是门厅敞口。
// 两段口子之间没有 z=6.9 的墙，靠门厅东墙 x=36.4 和开水间北墙端头形成拐角。
const WATER_OPEN_X0 = 30.9;
const FOYER_OPEN = [WATER_OPEN_X0, CLS_FOYER[1]];
const OFFICE_DOOR = [57.0, 58.6];        // 办公室开在贴走廊那面（北墙，x 区间）
// 走廊两道墙上按 x 从小到大排的门洞清单（solidSpans 和 wallX 都吃它，要求有序）
const HALL_DOORS_N = [DOOR_301B, DOOR_301, DOOR_302, DOOR_302B,
                      DOOR_PD, DOOR_STB, CLS_F_DOORS[0], EL_OPEN];
const HALL_DOORS_S = [DOOR_313B, DOOR_313, DOOR_312, DOOR_312B, WC_OPEN,
                      FOYER_OPEN, CLS_E_DOORS[0], CLS_E_DOORS[1], OFFICE_DOOR];
// ── 旧教休室陈设 → 新 YF311：绕房间中心转 180°，旧门洞落到房间北墙（门厅侧）──
// 新墙厚 8 cm（旧房是零厚度面），所以平面收到墙内净尺寸：
// 旧 6×4.8 的贴墙件正好落在新墙面上，家具之间的相对位置一件没动。
const REST_CX = (CLS_REST[0] + CLS_REST[1]) / 2;
const REST_CZ = (CLS_REST[2] + CLS_REST[3]) / 2;
// 里面那层旧白墙/黑踢脚还要再占 2 cm，家具整组也一起退到它前面，
// 贴墙件才不会陷进墙里（新墙本身比旧房厚 8 cm，加上面层共 12 cm）。
const REST_INSET = 0.02;
const REST_SX = (CLS_REST[1] - CLS_REST[0] - WALL_T - REST_INSET * 2) / ROOM_W;
const REST_SZ = (CLS_REST[3] - CLS_REST[2] - WALL_T - REST_INSET * 2) / ROOM_D;
restOldRoom.position.set(REST_CX, 0, REST_CZ);
restOldRoom.rotation.y = Math.PI;
restOldRoom.scale.set(REST_SX, 1, REST_SZ);

// 丧尸能站到的走廊 x 范围（离墙留 0.9 m，免得它们贴着墙抖）。
// ⚠ 走廊变长必须一起改：原来写死 ±9.2，你走到新教室里，丧尸就会卡在 9.2 米处
//   进不了门 —— 那正是"加了间教室却变成绝对安全屋"的原因。
// ⚠ 走廊西端现在被楼梯占掉了（x -9.8~-8.6），丧尸的 x 下限收到 -8.2。
const HALL_TX0 = -8.2, HALL_TX1 = HALL_X1 - 0.9;

// ── 二楼 + 楼梯间A：走廊西端一间 2.9 × 6 m 的小楼梯间，里面是双跑折返楼梯 ──
// ⚠ 楼梯间的进深是它自己的 6 m（SW_Z0~SW_Z1），**不等于走廊宽**：走廊缩到
//   4.5 m 之后如果还跟 HALL_Z1 走，折返梯段和半平台会戳穿南墙。
const SW_X0 = -10.0, SW_X1 = -7.10;      // 楼梯间内净 x -9.96 ~ -7.10
const SW_Z0 = 2.4, SW_Z1 = 8.4;
const SW_DOOR = [2.70, 3.80];            // 东墙 1F/2F 门洞（z）
const SW_LAND = 3.80;                    // 北端上下平台南沿
const SW_MID = 7.50;                     // 南端半平台北沿
const SW_A0 = -9.90, SW_A1 = -8.85;      // 上行梯段（西侧）
const SW_B0 = -8.55, SW_B1 = -7.20;      // 折返梯段（东侧）
const SW_RUN = SW_MID - SW_LAND;         // 3.7 m
const SW_RISE = 1.5;                     // 每跑 1.5 m

// 走廊地面/天花只覆盖 x -7.10~62.8；西端整块 x -10~-7.10（楼梯间A）留空，
// 楼梯间自己的地面和 2F 顶盖在楼梯组里建（不进 world，就不会被整层克隆到二楼）。
slabRect(SW_X1, HALL_X1, HALL_Z0, HALL_Z1, 0.002, matHallWalk, false);
slabRect(SW_X1, HALL_X1, HALL_Z0, HALL_Z1, ROOM_H - 0.002, matCorridorCeil, true);

// 教休室门前凹进来的门厅 + 开水间：走廊地面/天花到 z=6.9 就断了，
// 这块 3 m 深的口子要自己补，材质跟着走廊的亮面砖和矿棉板。
slabRect(CLS_KS[0], CLS_REST[1], HALL_Z1, REST_FRONT_Z, 0.002, matHallWalk, false);
slabRect(CLS_KS[0], CLS_REST[1], HALL_Z1, REST_FRONT_Z, ROOM_H - 0.002, matCorridorCeil, true);

/* ── 教休室双扇木门：模型仍用 makeRestDoorModel()，整组绕 y 转 180° 装到门厅南墙 ──
   模型原来按"房间在北、走廊在南"建：局部墙在 z=2.4、门口朝 +z。
   新房间在南、门厅在北，所以把整组转 180° 再放到 (REST_DOOR_X, 0, 9.9)：
   局部门牌、执手、机柜的左右关系原样保留，从走廊看过去还是照片里那张脸。 */
const restDoorFrameRoot = new THREE.Group();
restDoorFrameRoot.position.set(REST_DOOR_X, 0, REST_DOOR_Z + ROOM_D / 2);
restDoorFrameRoot.rotation.y = Math.PI;
{
  const d = makeRestDoorModel();
  d.frame.position.set(0, 0, ROOM_D / 2 - 0.03);
  restDoorFrameRoot.add(d.frame);
  world.add(restDoorFrameRoot);
  const root = new THREE.Group();
  root.position.copy(restDoorFrameRoot.position);
  root.rotation.y = Math.PI;
  scene.add(root);
  doorLeft = d.leaves[0];
  doorRight = d.leaves[1];
  for (const p of [doorLeft, doorRight]) {
    p.position.z = ROOM_D / 2 - 0.03;
    root.add(p);
    // 二楼同一道门也要有门扇：作为一楼门扇的子节点抬高 3.06 m，
    // 这样一楼开关门时二楼门扇跟着同一根铰链转，不会出现"二楼门洞空着"。
    const up = p.clone(true);
    up.position.set(0, ROOM_H + FLOOR2_LIFT, 0);
    up.rotation.set(0, 0, 0);
    p.add(up);
  }
}
// wallX 的门洞是全高的，双扇门框只到 2.31 m：上面补一段白墙，屋内看过去不漏空。
box(world, 1.44, ROOM_H - 2.31, 0.05,
  REST_DOOR_X, (ROOM_H + 2.31) / 2, REST_DOOR_Z, matWallPaint, false);

// 穿衣镜回到旧教休室的位置：门内那面墙、门东侧（从走廊进门左手边）。
// 高度保持 1.52 m —— 伪装体 buildMirrorForm 的 MIRROR_LIFT 按这个高度定的。
{
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x2a2622, roughness: 0.55, metalness: 0.08 });
  const mx = REST_CX - REST_SX * -1.55;                 // 旧房 x = -1.55 随整组转 180°
  const mzFrame = REST_CZ - REST_SZ * (ROOM_D / 2 - 0.055);
  const mzGlass = REST_CZ - REST_SZ * (ROOM_D / 2 - 0.092);
  box(scene, 0.92, 1.34, 0.05, mx, 1.52, mzFrame, frameMat, false);
  const mirror = new Mirror(new THREE.PlaneGeometry(0.80, 1.22), {
    textureWidth: 512, textureHeight: 768, multisample: 0, clipBias: 0.003, color: 0x7a7f83,
  });
  mirror.rotation.y = 0;                                 // 镜面朝 +z（屋内）
  mirror.position.set(mx, 1.52, mzGlass);
  scene.add(mirror);

  // 二楼只做静态外观：真镜面要额外一遍渲染，二楼不放第二个 Mirror。
  const FY = 1.52 + ROOM_H + FLOOR2_LIFT;
  box(scene, 0.92, 1.34, 0.05, mx, FY, mzFrame, frameMat, false);
  const mirror2 = new THREE.Mesh(
    new THREE.PlaneGeometry(0.80, 1.22),
    new THREE.MeshStandardMaterial({ color: 0x9aa0a4, roughness: 0.12, metalness: 0.35 }),
  );
  mirror2.position.set(mx, FY, mzGlass);
  scene.add(mirror2);
}

// 原来的独享顶灯也跟着出生房走，旧办公室从此封死不再占一盏带阴影的聚光。
fluo.position.set(REST_DOOR_X, 2.88, (CLS_REST[2] + CLS_REST[3]) / 2);
fluo.target.position.set(REST_DOOR_X, 0, (CLS_REST[2] + CLS_REST[3]) / 2);

// ---- 北墙（z=2.4）/ 南墙（z=6.9）：门洞清单来自 HALL_DOORS_N / HALL_DOORS_S ----
// 旧西北角办公室已经封门（教休室搬到南侧 YF311），它自己那 6 m 南墙照旧，
// 中间这 1.2 m 门洞在这里补齐，走廊北墙才是一整面。
box(world, 1.20, 2.14, 0.05, 0, 1.07, ROOM_D / 2, matWall);
box(world, 1.24, 0.11, 0.035, 0, 0.055, ROOM_D / 2 - 0.018, matBase, false);
// 封门后这 6 m 会露出老办公室那面没墙裙的墙（三块拼缝）；整面盖一层和走廊一致的
// 墙漆 + 黑踢脚，接缝对齐 wallX 的 2.44 面。
box(world, 6.00, ROOM_H, 0.02, 0, ROOM_H / 2, 2.430, matWallPaint, false);
box(world, 6.00, SKIRT_H, 0.012, 0, SKIRT_H / 2, 2.445, matBase, false);
wallX(HALL_X0 + 0.04, -3.00, HALL_Z0);
{
  let x = 3.00;
  for (const [d0, d1] of HALL_DOORS_N) { wallX(x, d0, HALL_Z0); x = d1; }
  wallX(x, HALL_X1 - 0.04, HALL_Z0);
}
{
  let x = SW_X1;
  for (const [d0, d1] of HALL_DOORS_S) { wallX(x, d0, HALL_Z1); x = d1; }
  wallX(x, HALL_X1 - 0.04, HALL_Z1);
}

// ---- 门厅南墙 z=9.9：从开水间西墙一直连到 YF310 西墙，门洞两侧各一段 ----
// 这面墙是教休室的北墙（前墙），也是开水间的南墙；不是走廊墙，所以不能进
// HALL_DOORS_S。中间 1.2 m 门洞由双扇木门框压边，上面补到天花。
for (const [a, b] of [[CLS_KS[0], REST_DOOR[0]], [REST_DOOR[1], CLS_REST[1]]]) {
  box(world, b - a, ROOM_H, WALL_T, (a + b) / 2, ROOM_H / 2, REST_FRONT_Z, matWallPaint, false);
  // 门厅这一侧的黑踢脚；房间那一侧有旧教休室自己那层白墙/黑踢脚，不用重做。
  box(world, b - a, 0.11, 0.024, (a + b) / 2, 0.055,
    REST_FRONT_Z - WALL_T / 2 - 0.012, matBase, false);
}
box(world, REST_DOOR[1] - REST_DOOR[0], ROOM_H - 2.31, WALL_T,
  REST_DOOR_X, (ROOM_H + 2.31) / 2, REST_FRONT_Z, matWallPaint, false);

// 女厕与教休室之间、z=9.9~14.7 的 2.0 m 空档：做成实心管道井，
// 既补上两间侧墙之间那条缝，也不会在二楼楼板上留一个洞。
box(world, CLS_REST[0] - CLS_W[1], ROOM_H, CLS_REST[3] - REST_FRONT_Z,
  (CLS_W[1] + CLS_REST[0]) / 2, ROOM_H / 2, (REST_FRONT_Z + CLS_REST[3]) / 2,
  matWall, false);

// ---- 走廊两端 ----
wallZ(SW_Z0, SW_Z1, HALL_X0);                    // 西头：楼梯间A 自己的墙
wallZ(HALL_Z0, HALL_Z1, HALL_X1);                // 东头封死（杂物隔断在它前面）
wallX(HALL_X0 + 0.04, SW_X1, SW_Z1);             // 楼梯间A 的南墙（比走廊深 1.5 m）

// 走廊筒灯：照片里是白色矿棉板上一圈圈小圆灯，不是长条荧光灯。
// 4.5 m 宽仍排两排（离墙 1.4 m、纵向间距 2.8 m），保留原来的照度分布。
for (let i = -2; i <= 22; i++) for (const lz of [HALL_Z0 + 1.4, HALL_Z1 - 1.4]) {
  const lx = i * 2.8;
  const disc = new THREE.Mesh(new THREE.CircleGeometry(0.085, 20), matDownlight);
  disc.rotation.x = Math.PI / 2;
  disc.position.set(lx, ROOM_H - 0.014, lz);
  world.add(disc);
  const ring = new THREE.Mesh(new THREE.RingGeometry(0.088, 0.112, 20), matDownRing);
  ring.rotation.x = Math.PI / 2;
  ring.position.set(lx, ROOM_H - 0.013, lz);
  world.add(ring);
}
// 烟感：白色小圆盘，沿走廊中线隔一段一个（照片里天花板上的圆点）
for (let k = 0; k < 12; k++) {
  const x = -4.2 + k * 5.6;
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.085, 0.034, 12), matSmoke);
  body.position.set(x, ROOM_H - 0.032, HALL_ZM);
  world.add(body);
  const dot = new THREE.Mesh(new THREE.CircleGeometry(0.052, 12), matSmokeDark);
  dot.rotation.x = Math.PI / 2;
  dot.position.set(x, ROOM_H - 0.050, HALL_ZM);
  world.add(dot);
}
// 检修口：照片里靠墙一侧的方形板
for (const x of [2.0, 18.0, 34.0, 50.0]) {
  box(world, 0.60, 0.006, 0.60, x, ROOM_H - 0.008, HALL_Z0 + 0.62, matDownRing, false);
  box(world, 0.54, 0.006, 0.54, x, ROOM_H - 0.010, HALL_Z0 + 0.62, matSmoke, false);
}
// 吸顶扬声器：照片里靠窗那侧的白圆盘，两个够点一下
for (const x of [6.0, 46.0]) {
  const sp = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.145, 0.045, 16), matSmoke);
  sp.position.set(x, ROOM_H - 0.040, HALL_ZM + 1.0);
  world.add(sp);
  const gr = new THREE.Mesh(new THREE.CircleGeometry(0.095, 16), matSmokeDark);
  gr.rotation.x = Math.PI / 2;
  gr.position.set(x, ROOM_H - 0.064, HALL_ZM + 1.0);
  world.add(gr);
}

/* ── 顶灯（真光源）──────────────────────────────────────────────────
   教休室好看，一半是因为那里独享一盏 SpotLight；走廊和其余十四间只有
   半球光+环境光，等于全楼一样亮，所以看着像一张灰纸。
   ⚠ 前向渲染里灯是**全场景逐像素循环**：加一盏，每个像素多算一次，跟它照不照得到无关。
     无头实测（SwiftShader，只看相对值）：4 盏 = 0.72~0.76 帧、6 盏 = 0.60~0.68、
     12 盏 = 0.46~0.52。所以默认只点最值钱的 4 盏，其余备着。
   ?lamps=N 现场加减（0=全关），__lamps(false) 在同一页里做 A/B。 */
const ceilLamps = [];
for (const [lx, lz, li] of [
  [10.0, HALL_ZM, 34], [40.0, HALL_ZM, 34],                                  // 走廊两段
  [(CLS_E[0] + CLS_E[1]) / 2, (CLS_E[2] + CLS_E[3]) / 2, 46],                // YF310 大教室
  [(CLS_F[0] + CLS_F[1]) / 2, CLS_F[2] + 5.0, 46],                           // YF303 实验室
  [-4.0, HALL_ZM, 34], [18.0, HALL_ZM, 34], [33.4, HALL_ZM, 34], [56.8, HALL_ZM, 34],
  [9.8, -1.6, 30], [17.8, -1.6, 30], [9.8, 11.1, 30], [17.8, 11.1, 30],
]) {
  const L = new THREE.PointLight(ceilLamps.length < 2 ? 0xfffaf1 : 0xe6eef8,
    ceilLamps.length < 2 ? li + 4 : li, 13, 2);
  L.position.set(lx, ROOM_H - 0.18, lz);
  scene.add(L);
  ceilLamps.push(L);
}
const LAMP_CAP = Math.max(0, Math.min(ceilLamps.length,
  +(new URLSearchParams(location.search).get('lamps') ?? 4)));
const lampSet = (on) => ceilLamps.forEach((L, i) => { L.visible = !!on && i < LAMP_CAP; });
lampSet(true);
window.__lamps = (on) => { lampSet(on); return LAMP_CAP; };

// ---- 房间外壳：楼板 + 天花 + 外侧那面墙 ----
// 贴走廊那面墙由上面的 wallX 负责（门洞已经留好），这里只补外面三面。
// ⚠ 开水间不在这张表里：它朝门厅敞开、没有完整四壁，楼板/天花/南墙在门厅那段单独建。
const ROOMS = [CLS_301, CLS_302, CLS_PD, CLS_STB, CLS_EL,
               CLS_313, CLS_312, CLS_G, CLS_W, CLS_REST, CLS_E, CLS_F, CLS_H];
// 铺抛光砖的房间（他："走廊和教室里普遍是这种地板，实验室里就铺现在这种没问题"）。
// 教休室门前门厅和开水间也跟走廊一样是亮面砖；配电室/楼梯间留水磨石。
// 电梯厅在下面单独换成更亮的 matFloorEL（照片里那间的地面能反光）。
const TILE_ROOMS = new Set([CLS_301, CLS_302, CLS_313, CLS_312, CLS_REST, CLS_E]);
// 大教室 E 和四间 8×8 小教室统一铺暖米色亮面砖（同一份 matFloorLect）。
const LECT_FLOOR_ROOMS = new Set([CLS_E, CLS_301, CLS_302, CLS_313, CLS_312]);
for (const r of ROOMS) {
  const [x0, x1, z0, z1] = r;
  // 楼梯间B 的楼板/天花在 buildStairB 里自己画：clone 会把 1F 楼板原样抬到 3 m，
  // 那样梯段上方就没有洞口，人在半平台头顶直接穿到二楼板里（照楼梯间A的洞处理）。
  if (r !== CLS_STB) {
    slabRect(x0, x1, z0, z1, 0.002,
      r === CLS_EL ? matFloorEL : LECT_FLOOR_ROOMS.has(r) ? matFloorLect
        : TILE_ROOMS.has(r) ? matFloorTile : matHallFloor, false);
    slabRect(x0, x1, z0, z1, ROOM_H - 0.002, matHallCeil, true);
  }
  if (z1 > HALL_ZM) wallX(x0, x1, z1); else wallX(x0, x1, z0);
}
// 侧墙：相邻两间共用一道，先按 x 把 z 区间归并再画。各画各的会重合成一整面
// 从北屋一直戳到南屋的墙，把走廊拦腰切断（南北两侧同 x 的区间差 4.5 m，不会误并）。
{
  const byX = new Map();
  for (const [x0, x1, z0, z1] of ROOMS) {
    for (const x of [x0, x1]) {
      const list = byX.get(x) || [];
      list.push([z0, z1]);
      byX.set(x, list);
    }
  }
  for (const [x, list] of byX) {
    list.sort((a, b) => a[0] - b[0]);
    let cur = null;
    for (const [za, zb] of list) {
      if (cur && za - cur[1] < 0.2) cur[1] = Math.max(cur[1], zb);
      else { if (cur) wallZ(cur[0], cur[1], x); cur = [za, zb]; }
    }
    if (!cur) continue;
    // 男厕门开在 x=24.5 的前室西墙上，这道墙在门洞处断开，门楣另补；
    // 女厕门改到前室南墙（z=9.9，朝北），x=24.5 只在男厕门那里留口。
    const gap = (x === CLS_G[1]) ? WC_MEN_DOOR_Z : null;
    if (!gap) { wallZ(cur[0], cur[1], x); continue; }
    const [g0, g1] = gap;
    if (g0 > cur[0]) wallZ(cur[0], g0, x);
    if (g1 < cur[1]) wallZ(g1, cur[1], x);
  }
}
// 凹进前室 3.9×3.0：楼板/天花在这里补上；女厕的楼板/天花由 ROOMS 的 CLS_W 负责。
slabRect(WC_LOBBY[0], WC_LOBBY[1], WC_LOBBY[2], WC_LOBBY[3], 0.002, matHallFloor, false);
slabRect(WC_LOBBY[0], WC_LOBBY[1], WC_LOBBY[2], WC_LOBBY[3], ROOM_H - 0.002, matHallCeil, true);

/* ── 走廊墙上的一道门：门框 + 蓝门带小窗 + 门楣，门叶往房间里推开 ──────
   north=true ⇒ 房间在走廊北侧（门洞在 z=HALL_Z0），门叶和碰撞条都在墙北边。 */
function makeHallDoor(d0, d1, north, name, outward = false) {
  const zw = north ? HALL_Z0 : HALL_Z1;
  const w = d1 - d0, dx = (d0 + d1) / 2, fo = north ? 0.02 : -0.02;
  box(world, 0.10, ROOM_H, 0.10, d0 - 0.03, ROOM_H / 2, zw + fo, matWoodDark, false);
  box(world, 0.10, ROOM_H, 0.10, d1 + 0.03, ROOM_H / 2, zw + fo, matWoodDark, false);
  box(world, w + 0.20, 0.10, 0.10, dx, ROOM_H - 0.05, zw + fo, matWoodDark, false);
  makeSwingDoor({
    hx: d0 + 0.03, hz: north ? zw - 0.12 : zw + 0.12, width: w * 0.96, closedYaw: 0,
    // 默认往房间里开。YF310 前门紧贴第一排桌（0.85 m），往里开会扫穿桌面，
    // 所以单独让它往走廊开 —— 和教休室双扇门一样是疏散方向。
    openYaw: north ? (outward ? -Math.PI / 2 : Math.PI / 2)
      : (outward ? Math.PI / 2 : -Math.PI / 2),
    leafMat: matWoodDark, win: true, transom: true, name, startOpen: false,
    rect: { minX: d0, maxX: d1,
      minZ: north ? zw - 0.20 : zw + 0.04, maxZ: north ? zw - 0.08 : zw + 0.16, top: 2.4 },
  });
  // 门楣亮子（照片里门顶那道玻璃横窗）：走廊侧加一块深木框灰玻璃
  const cf = north ? 1 : -1;
  box(world, w * 0.80, 0.56, 0.04, dx, 2.40, zw + cf * 0.075, matWoodDark, false);
  box(world, w * 0.72, 0.46, 0.02, dx, 2.40, zw + cf * 0.096, matDoorGlass, false);
}

/* ── 门牌（照疏散图上的编号）：一块白板 + canvas 字 ─────────────────── */
function makePlateMat(text) {
  const c = document.createElement('canvas'); c.width = 256; c.height = 64;
  const g = c.getContext('2d');
  g.fillStyle = '#f2f2ec'; g.fillRect(0, 0, 256, 64);
  g.fillStyle = '#1c5aa6'; g.fillRect(0, 0, 256, 12);
  g.fillStyle = '#22262b'; g.font = 'bold 32px "Microsoft YaHei","SimHei",sans-serif';
  g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, 128, 40);
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
  return new THREE.MeshBasicMaterial({ map: tex });
}
function roomPlate(x, z, text, facePlusZ) {     // 牌子贴在门洞边的墙上
  const sgn = facePlusZ ? 1 : -1;
  box(world, 0.46, 0.16, 0.02, x, 1.62, z, matDeskLeg, false);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.12), makePlateMat(text));
  m.position.set(x, 1.62, z + sgn * 0.02);
  if (!facePlusZ) m.rotation.y = Math.PI;
  world.add(m);
}

/* ── 8 × 8 的标准教室（YF301/302/313/312）：统一大教室 YF310 的标准 ────
   朝向沿用：**黑板在侧墙**（北排房间＝西墙，南排房间＝东墙），门开在贴走廊那面墙。
   室内按大教室重做：
     · 白墙 + 黑踢脚；门洞两侧分段，门楣以上补白；
     · 走廊对面那面是外墙：三扇深棕框窗 + 蓝窗帘 + 石窗台 + 通长奶油暖气罩；
     · 暖米色亮面砖地面；白矿棉板吊顶 + 六盏格栅灯 + 一台白叶吊扇；
     · 2.4 m 长桌 + 蓝背椅，四椅一桌；8×8 放不下大教室的三组，缩成两组 × 两排，
       共 4 桌 16 椅（中间一排整排留空给躲藏者变身），组间仍留 0.36 m 缝；
       排距也和 YF310 一样用 1.45 m，大小教室疏密一致；讲台/黑板/白板/音箱/投影/挂钟同款。
   桌椅直接调用大教室的同一份模型 —— 躲藏者变桌椅时看起来必须一样。 */
function buildClassroom8([x0, x1, z0, z1], north, tag) {
  const cx = (x0 + x1) / 2, czc = (z0 + z1) / 2;
  const bx = north ? x0 : x1, sgx = north ? 1 : -1;      // 黑板墙
  const cw = north ? 1 : -1;                             // 走廊那一侧（+z / −z）
  const X = (f) => bx + sgx * f;                          // 离黑板墙 f 米
  const doorZ = north ? z1 : z0;                          // 走廊墙
  const doorFace = north ? -1 : 1;                        // 从门墙指向室内
  const winZ = north ? z0 : z1;                           // 外墙 / 窗墙
  const winFace = north ? 1 : -1;                         // 从窗墙指向室内
  const partyX = north ? x1 : x0;                         // 与隔壁共用的侧墙
  const partyFace = north ? -1 : 1;
  const boardFace = north ? 1 : -1;
  const boardYaw = boardFace > 0 ? Math.PI / 2 : -Math.PI / 2;

  // 走廊墙上两扇门的位置（只用来避开白墙分段和门边开关）
  const doors = {
    '301': [DOOR_301B, DOOR_301], '302': [DOOR_302B, DOOR_302],
    '313': [DOOR_313B, DOOR_313], '312': [DOOR_312B, DOOR_312],
  }[tag] || [];

  // ── 白墙 / 黑踢脚（大教室同款做法）──────────────────────────────
  const SKIN = WALL_T / 2 + 0.012;
  const skinX = (zw, face, xa, xb, ya = 0, yb = ROOM_H) => {
    if (xb - xa < 0.02 || yb - ya < 0.02) return;
    const zz = zw + face * SKIN;
    box(world, xb - xa, yb - ya, 0.012, (xa + xb) / 2, (ya + yb) / 2, zz, matWallWhite, false);
    if (ya < 0.2) box(world, xb - xa, 0.12, 0.024, (xa + xb) / 2, 0.06,
      zz + face * 0.007, matSkirtBlk, false);
  };
  const skinZ = (xw, face, za, zb) => {
    if (zb - za < 0.02) return;
    const xx = xw + face * SKIN;
    box(world, 0.012, ROOM_H, zb - za, xx, ROOM_H / 2, (za + zb) / 2, matWallWhite, false);
    box(world, 0.024, 0.12, zb - za, xx + face * 0.007, 0.06, (za + zb) / 2, matSkirtBlk, false);
  };
  skinZ(bx, boardFace, z0, z1);          // 黑板墙
  skinZ(partyX, partyFace, z0, z1);      // 隔壁共用墙
  skinX(winZ, winFace, x0, x1);          // 窗墙整面（窗框/玻璃在它前面）
  // 走廊墙：避开两道门，只砌到门楣 2.70；2.70 以上再补一条通长白墙
  const ds = doors.slice().sort((a, b) => a[0] - b[0]);
  let cur = x0;
  for (const [d0, d1] of ds) {
    if (d0 - cur > 0.04) skinX(doorZ, doorFace, cur, d0, 0, 2.70);
    cur = Math.max(cur, d1);
  }
  if (x1 - cur > 0.04) skinX(doorZ, doorFace, cur, x1, 0, 2.70);
  box(world, x1 - x0, ROOM_H - 2.70, 0.012, cx, (ROOM_H + 2.70) / 2,
    doorZ + doorFace * SKIN, matWallWhite, false);

  // ── 黑板 + 白板 + 幕盒 + 音箱 + 投影 ──────────────────────────────
  const BW = 4.20;
  box(world, 0.05, 1.30, BW, X(0.075), 1.62, czc, matBoardH, false);
  box(world, 0.09, 0.06, BW + 0.12, X(0.06), 2.30, czc, matAlu, false);
  box(world, 0.09, 0.06, BW + 0.12, X(0.06), 0.94, czc, matAlu, false);
  for (const s of [-1, 1]) box(world, 0.09, 1.42, 0.06, X(0.06), 1.62,
    czc + s * (BW / 2 + 0.03), matAlu, false);
  box(world, 0.16, 0.05, BW + 0.12, X(0.10), 0.88, czc, matAlu, false);

  // 白板放在靠走廊门那一侧（黑板 4.2 m，8 m 墙上两边各有约 1.9 m）
  const wbZ = czc + 3.00 * cw;
  box(world, 0.05, 0.94, 1.10, X(0.08), 1.74, wbZ, matAlu, false);
  box(world, 0.03, 0.82, 0.98, X(0.10), 1.74, wbZ, matScreenW, false);
  box(world, 0.11, 0.035, 0.98, X(0.12), 1.28, wbZ, matAlu, false);
  const slip = new THREE.Mesh(new THREE.PlaneGeometry(0.30, 0.40), matScreenW);
  slip.rotation.y = boardYaw;
  slip.position.set(X(0.116), 1.78, wbZ + 0.30);
  world.add(slip);

  const speakerAt = (z) => {
    box(world, 0.18, 0.34, 0.13, X(0.14), 2.42, z, matScreenW, false);
    const gr = new THREE.Mesh(new THREE.PlaneGeometry(0.14, 0.28), matPcPlastic);
    gr.rotation.y = boardYaw;
    gr.position.set(X(0.235), 2.42, z);
    world.add(gr);
  };
  speakerAt(czc + 2.55); speakerAt(czc - 2.20);

  box(world, 0.14, 0.12, 3.00, X(0.18), ROOM_H - 0.20, czc, matScreenW, false);
  box(world, 0.15, 0.14, 0.10, X(0.18), ROOM_H - 0.20, czc - 1.52, matDeskLeg, false);
  box(world, 0.15, 0.14, 0.10, X(0.18), ROOM_H - 0.20, czc + 1.52, matDeskLeg, false);
  box(world, 0.06, 0.34, 0.06, X(1.95), ROOM_H - 0.20, czc, matDeskLeg, false);
  box(world, 0.36, 0.14, 0.30, X(1.95), 2.63, czc, matPcPlastic, false);
  const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.07, 12), matMetal);
  lens.rotation.z = Math.PI / 2;
  lens.position.set(X(1.76), 2.62, czc); world.add(lens);

  // 讲台：和大教室同一套多媒体讲台，偏走廊侧，给老师留站位
  buildMultimediaPodium({
    name: 'smallPodium' + tag, wallX: bx, dir: sgx,
    deskZ: czc + 1.60 * cw, platformCenterZ: czc, platformLen: 4.80,
  });

  // ── 外墙三扇窗 + 石窗台 + 通长暖气罩 + 蓝窗帘 ─────────────────────
  const curtainGeo = new THREE.PlaneGeometry(0.17, 1.74);
  const winXs = [cx - 2.40, cx, cx + 2.40];
  for (const wx of winXs) {
    const zf = winZ + winFace * 0.060;
    box(world, 1.98, 0.08, 0.10, wx, 2.44, zf, matWinFrame, false);
    box(world, 1.98, 0.08, 0.10, wx, 0.78, zf, matWinFrame, false);
    for (const s of [-1, 1]) box(world, 0.07, 1.74, 0.10, wx + s * 0.955, 1.61, zf, matWinFrame, false);
    box(world, 0.05, 1.66, 0.08, wx, 1.61, zf + winFace * 0.005, matWinFrame, false);
    box(world, 1.86, 0.04, 0.07, wx, 1.14, zf + winFace * 0.005, matWinFrame, false);
    box(world, 1.86, 1.58, 0.02, wx, 1.60, winZ + winFace * 0.075, matGlassDay, false);
    box(world, 2.12, 0.06, 0.32, wx, 0.745, winZ + winFace * 0.20, matWinSill, false);
    box(world, 2.16, 0.58, 0.54, wx, 0.34, winZ + winFace * 0.33, matRadCab, false);
    box(world, 2.22, 0.055, 0.60, wx, 0.655, winZ + winFace * 0.33, matStoneTop, false);
    for (const s of [-1, 1]) {
      box(world, 0.98, 0.42, 0.012, wx + s * 0.53, 0.36, winZ + winFace * 0.605, matRadDoor, false);
      box(world, 0.028, 0.018, 0.026, wx + s * 0.94, 0.40, winZ + winFace * 0.615, matAlu, false);
    }
    box(world, 2.18, 0.08, 0.56, wx, 0.04, winZ + winFace * 0.33, matSkirtBlk, false);
    box(world, 2.20, 0.07, 0.14, wx, 2.53, winZ + winFace * 0.22, matScreenW, false);
    for (const s of [-1, 1]) for (let k = 0; k < 4; k++) {
      const m = new THREE.Mesh(curtainGeo, matCurtainH);
      m.position.set(wx + s * (0.78 + k * 0.12), 1.64, winZ + winFace * (0.255 + k * 0.02));
      m.rotation.y = (winFace > 0 ? 0 : Math.PI) + s * (0.05 + k * 0.03);
      world.add(m);
    }
  }
  // 窗间也接上，暖气罩看起来是一整条通长矮柜（和大教室一样）
  for (let i = 0; i < winXs.length - 1; i++) {
    const xa = winXs[i] + 1.08, xb = winXs[i + 1] - 1.08;
    if (xb - xa < 0.02) continue;
    const xc = (xa + xb) / 2, ww = xb - xa;
    box(world, ww, 0.58, 0.54, xc, 0.34, winZ + winFace * 0.33, matRadCab, false);
    box(world, ww, 0.055, 0.60, xc, 0.655, winZ + winFace * 0.33, matStoneTop, false);
    box(world, ww, 0.08, 0.56, xc, 0.04, winZ + winFace * 0.33, matSkirtBlk, false);
  }
  {
    const za = winZ + winFace * 0.02, zb = winZ + winFace * 0.62;
    deskRects.push({ minX: cx - 3.51, maxX: cx + 3.51,
      minZ: Math.min(za, zb), maxZ: Math.max(za, zb), top: 0.68 });
  }

  // 窗楣上的壁挂空调 + 侧墙挂钟
  pSplitAC(cx, 2.72, winZ + winFace * 0.12, north ? '+z' : '-z');
  pWallClock(partyX + partyFace * 0.10, 2.35, czc + 2.60 * cw,
    partyFace > 0 ? Math.PI / 2 : -Math.PI / 2, 0.85);

  // ── 桌椅：四椅一桌；每间只拆 1 张桌 + 8 把椅子，且桌和椅子分开拆 ──
  // 每间剩 5 桌 16 椅：3 个位置各少 2 把椅子（留桌），2 个位置各少 1 把；
  // 另有 1 张桌被拆掉但 4 把椅子原样留着。四间的拆法各不相同。
  // ⚠ 位置写死、不用 Math.random：主客各自加载地图，两边必须看到同一组缺口。
  const GAP = 0.36, ROW_C = czc + 0.30 * cw, F0 = 3.05, PITCH8 = 1.45, ROWS8 = 3;
  const groupPitch = 2.40 + GAP;
  const COLS8 = [ROW_C - groupPitch / 2, ROW_C + groupPitch / 2];
  const NO_TABLE8 = {
    '301': [0, 1], '302': [1, 1], '313': [2, 1], '312': [0, 0],
  }[tag] || [];
  const CUT_CHAIR8 = {
    '301': { '0,0': [0, 1], '2,0': [1, 2], '2,1': [0, 1], '1,0': [3], '1,1': [2] },
    '302': { '0,1': [1, 2], '1,0': [0, 1], '2,1': [2, 3], '0,0': [0], '2,0': [3] },
    '313': { '0,0': [1, 2], '1,1': [0, 1], '2,0': [2, 3], '0,1': [0], '1,0': [3] },
    '312': { '0,1': [0, 1], '1,0': [2, 3], '2,1': [1, 2], '1,1': [0], '2,0': [3] },
  }[tag] || {};
  for (let r = 0; r < ROWS8; r++) {
    const x = X(F0 + r * PITCH8);
    for (let ci = 0; ci < COLS8.length; ci++) {
      const key = r + ',' + ci;
      const z = COLS8[ci];
      if (!(NO_TABLE8[0] === r && NO_TABLE8[1] === ci)) {
        const T = makeLectureTableModel();
        T.position.set(x, 0, z);
        T.rotation.y = north ? 0 : Math.PI;
        world.add(T);
        deskRects.push({ minX: x - 0.26, maxX: x + 0.26, minZ: z - 1.20, maxZ: z + 1.20, top: 0.77 });
      }
      const cut = CUT_CHAIR8[key] || [];
      for (let k = 0; k < 4; k++) {
        if (cut.includes(k)) continue;
        const cz = z - 0.90 + k * 0.60;
        const chx = X(F0 + r * PITCH8 + 0.60);
        const C = makeLectureChairModel();
        C.position.set(chx, 0, cz);
        C.rotation.y = north ? 0 : Math.PI;
        world.add(C);
        chairRects.push({ minX: chx - 0.30, maxX: chx + 0.30,
          minZ: cz - 0.28, maxZ: cz + 0.28, top: 0.95 });
      }
    }
  }

  // ── 天花：白矿棉板 + 六盏格栅灯 + 白叶吊扇 ─────────────────────────
  box(world, x1 - x0, 0.006, z1 - z0, cx, ROOM_H - 0.010, czc, matLectCeil, false);
  for (const lx of [X(2.2), X(4.1), X(6.0)]) for (const dz of [-1.9, 1.9]) {
    box(world, 1.28, 0.016, 0.68, lx, ROOM_H - 0.026, czc + dz, matScreenW, false);
    box(world, 1.18, 0.006, 0.58, lx, ROOM_H - 0.036, czc + dz, matLectLight, false);
  }
  pCeilingFan(X(4.1), ROOM_H, czc);

  // 门边开关 + 黑板墙那头远角的垃圾桶（不挡两道门）
  const near = doors.slice().sort((a, b) => north
    ? (a[0] + a[1]) - (b[0] + b[1]) : (b[0] + b[1]) - (a[0] + a[1]))[0];
  if (near) {
    const swx = north ? near[1] + 0.20 : near[0] - 0.20;
    for (let i = 0; i < 2; i++) {
      box(world, 0.02, 0.12, 0.09, swx + (north ? i * 0.12 : -i * 0.12),
        1.36, doorZ + doorFace * 0.085, matScreenW, false);
    }
  }
  pBin(X(0.55), winZ + winFace * 0.90, false);
}

/* ── 小间：配电室 / 电梯厅 / 楼梯间B（只上一跑，不通二楼）────────────── */
function buildPowerRoom([x0, x1, z0, z1]) {        // 配电室：两排橙色配电柜
  const cz = (z0 + z1) / 2;
  for (let i = 0; i < 3; i++) {
    const x = x0 + 0.45 + i * 0.86;
    box(world, 0.78, 1.90, 0.42, x, 0.95, z0 + 0.26, matPropCard, false);
    box(world, 0.70, 0.34, 0.02, x, 1.55, z0 + 0.48, matDeskLeg, false);
    box(world, 0.10, 0.03, 0.03, x, 0.95, z0 + 0.48, matAlu, false);
    deskRects.push({ minX: x - 0.40, maxX: x + 0.40, minZ: z0 + 0.05, maxZ: z0 + 0.48, top: 2.4 });
  }
}
/* ── 电梯厅：照着照片（6F 电梯厅）重做 ────────────────────────────────
   照片里的元素，一个不落：
     ① 两台不锈钢双扇门（照片里门是**拉丝不锈钢**，不是现在的蓝色钢板门）；
     ② 门四周一圈更厚的不锈钢门框，门扇比框凹进去一层，缝里发黑；
     ③ 两门之间白墙上一块暗红横幅（校名 + "图书馆六层安全疏散示意图"）；
     ④ 横幅下面一张白底蓝块的楼层平面图（图直接按这张地图的真实房间画）；
     ⑤ 每扇门右侧一块竖长召唤面板：上面黑窗里红色楼层数字（6 / 7），下面两颗按钮；
     ⑥ 墙脚黑踢脚、门下一道深色门槛；
     ⑦ 800 亮面灰砖地面、600 矿棉板吊顶 + 喷淋头 + 烟感。
   门框/门扇只贴在墙上，没有可开的门叶 —— 电梯本来就不会开。 */
function makeBrushedSteelTex() {
  const W = 512, H = 1024;
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d');
  g.fillStyle = '#cdd0d3'; g.fillRect(0, 0, W, H);
  // 竖向拉丝：一条条比头发丝还细的明暗线（512 宽 ⇒ 一条不到 2 mm，不会变成条纹布）
  for (let i = 0; i < 4200; i++) {
    const x = Math.random() * W;
    const a = 0.012 + Math.random() * 0.045;
    g.strokeStyle = Math.random() < 0.5 ? `rgba(255,255,255,${a})` : `rgba(70,74,78,${a})`;
    g.lineWidth = 0.4 + Math.random() * 1.1;
    g.beginPath(); g.moveTo(x, 0); g.lineTo(x + (Math.random() - 0.5) * 1.4, H); g.stroke();
  }
  // 宽一点的竖向明暗带 + 少量横向反光（照片里门上有几片很淡的横带，不能画成斑马线）
  for (let i = 0; i < 7; i++) {
    const x = Math.random() * W, w = 18 + Math.random() * 70;
    const gr = g.createLinearGradient(x, 0, x + w, 0);
    gr.addColorStop(0, 'rgba(255,255,255,0)');
    gr.addColorStop(0.5, `rgba(255,255,255,${0.02 + Math.random() * 0.03})`);
    gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr; g.fillRect(x, 0, w, H);
  }
  for (let i = 0; i < 3; i++) {
    const y = Math.random() * H, h = 40 + Math.random() * 110;
    const gr = g.createLinearGradient(0, y, 0, y + h);
    gr.addColorStop(0, 'rgba(255,255,255,0)');
    gr.addColorStop(0.5, `rgba(255,255,255,${0.02 + Math.random() * 0.025})`);
    gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr; g.fillRect(0, y, W, h);
  }
  for (let i = 0; i < 10; i++) {
    const x = Math.random() * W, y = Math.random() * H, r = 14 + Math.random() * 40;
    const gr = g.createRadialGradient(x, y, 0, x, y, r);
    gr.addColorStop(0, 'rgba(55,58,62,0.035)');
    gr.addColorStop(1, 'rgba(55,58,62,0)');
    g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  _aniso(tex);
  return tex;
}

// 暗红横幅：左边校徽，右边校名 + 疏散图标题
function makeElBannerTex() {
  const W = 1200, H = 190;
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d');
  g.fillStyle = '#6d1422'; g.fillRect(0, 0, W, H);
  g.strokeStyle = 'rgba(255,255,255,0.42)'; g.lineWidth = 3;
  g.strokeRect(8, 8, W - 16, H - 16);
  g.beginPath(); g.arc(80, H / 2, 42, 0, Math.PI * 2);
  g.fillStyle = '#f4f0e8'; g.fill();
  g.fillStyle = '#6d1422'; g.font = 'bold 46px "Microsoft YaHei","SimHei",serif';
  g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('交', 80, H / 2 + 2);
  g.fillStyle = '#ffffff'; g.font = 'bold 41px "Microsoft YaHei","SimHei",sans-serif';
  g.textAlign = 'left'; g.fillText('北京交通大学  图书馆六层安全疏散示意图', 150, H / 2 - 8);
  g.fillStyle = 'rgba(255,255,255,0.82)'; g.font = '19px "Microsoft YaHei",sans-serif';
  g.fillText('BEIJING JIAOTONG UNIVERSITY · LIBRARY 6F EVACUATION PLAN', 152, H / 2 + 36);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  _aniso(tex);
  return tex;
}

/* 楼层平面图：按这张地图真实的房间矩形画，不是随手糊几个蓝块。
   x → 右、z → 下；走廊绿、房间蓝、电梯厅深蓝 + 红点标"您所在位置"。 */
function makeElPlanTex() {
  const W = 1000, H = 720;
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d');
  g.fillStyle = '#fbfbf8'; g.fillRect(0, 0, W, H);
  g.strokeStyle = '#c8c8c2'; g.lineWidth = 4; g.strokeRect(10, 10, W - 20, H - 20);
  g.fillStyle = '#9d2027'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = 'bold 30px "Microsoft YaHei","SimHei",sans-serif';
  g.fillText('图书馆六层安全疏散示意图', W / 2, 50);
  g.fillStyle = '#5c6064'; g.font = '15px "Microsoft YaHei",sans-serif';
  g.fillText('LIBRARY · FLOOR 6 · EVACUATION PLAN', W / 2, 80);

  const MX = 48, MY = 100, MW = W - 96, MH = 500;
  // 图的范围按真实房间算，别写死：以后加房间这张图自己会跟上
  let bx0 = Infinity, bx1 = -Infinity, bz0 = Infinity, bz1 = -Infinity;
  for (const r of [...ROOMS,
    [SW_X0, SW_X1, SW_Z0, SW_Z1], [SW_X1, HALL_X1, HALL_Z0, HALL_Z1]]) {
    bx0 = Math.min(bx0, r[0]); bx1 = Math.max(bx1, r[1]);
    bz0 = Math.min(bz0, r[2]); bz1 = Math.max(bz1, r[3]);
  }
  bx0 -= 0.5; bx1 += 0.5; bz0 -= 0.5; bz1 += 0.5;
  // 这张地图是一条很长的走廊（66 × 21 m），等比缩放会在白板上留出两大条空白；
  // 疏散图本来就是示意图，按横向/纵向各自铺满，板面才像照片里那样是满的。
  const sx = MW / (bx1 - bx0), sz = MH / (bz1 - bz0);
  const PX = (x) => MX + (x - bx0) * sx;
  const PZ = (z) => MY + (z - bz0) * sz;
  const rectM = (a, b, c2, d, fill, stroke, lw = 1.5) => {
    g.fillStyle = fill; g.strokeStyle = stroke; g.lineWidth = lw;
    g.fillRect(PX(a), PZ(c2), (b - a) * sx, (d - c2) * sz);
    g.strokeRect(PX(a), PZ(c2), (b - a) * sx, (d - c2) * sz);
  };
  // 走廊 + 楼梯间 + 教休室门前的凹进门厅 / 开水间
  rectM(SW_X1, HALL_X1, HALL_Z0, HALL_Z1, '#bed99c', '#7c9a5b', 1.5);
  rectM(SW_X0, SW_X1, SW_Z0, SW_Z1, '#d8dbcb', '#8c9078', 1.5);
  rectM(CLS_FOYER[0], CLS_FOYER[1], CLS_FOYER[2], CLS_FOYER[3], '#bed99c', '#7c9a5b', 1.5);
  rectM(CLS_KS[0], CLS_KS[1], CLS_KS[2], CLS_KS[3], '#f0b14a', '#b87d1e', 1.5);
  g.fillStyle = '#fff'; g.font = 'bold 11px "Microsoft YaHei",sans-serif';
  g.fillText('开水间', PX((CLS_KS[0] + CLS_KS[1]) / 2), PZ((CLS_KS[2] + CLS_KS[3]) / 2));
  // 男女厕共用的凹进前室：走廊绿伸进去一小块，图上能看出它不是走廊门挨门。
  rectM(WC_LOBBY[0], WC_LOBBY[1], WC_LOBBY[2], WC_LOBBY[3], '#bed99c', '#7c9a5b', 1.2);
  // 所有房间（教休室照图例画成紫色，和开水间的橙色分开）
  const NAMES = new Map([
    [CLS_301, 'YF301'], [CLS_302, 'YF302'], [CLS_313, 'YF313'], [CLS_312, 'YF312'],
    [CLS_E, 'YF310'], [CLS_F, 'YF303'], [CLS_STB, '楼梯'], [CLS_G, '男厕'],
    [CLS_W, '女厕'], [CLS_PD, '配电'],
    [CLS_REST, 'YF311'], [CLS_H, 'YF309'],
  ]);
  for (const r of ROOMS) {
    if (r === CLS_EL) continue;
    const isRest = r === CLS_REST;
    rectM(r[0], r[1], r[2], r[3],
      isRest ? '#9b5a9f' : '#3a8ec4', isRest ? '#66346a' : '#20618a');
    const nm = NAMES.get(r);
    if (nm && (r[1] - r[0]) * sx > 42 && (r[3] - r[2]) * sz > 24) {
      g.fillStyle = '#fff'; g.font = 'bold 12px "Microsoft YaHei",sans-serif';
      g.fillText(nm, PX((r[0] + r[1]) / 2), PZ((r[2] + r[3]) / 2));
    }
  }
  // 电梯厅：深蓝 + 红点
  rectM(CLS_EL[0], CLS_EL[1], CLS_EL[2], CLS_EL[3], '#1d6da6', '#0f3e5b', 2);
  const ecx = PX((CLS_EL[0] + CLS_EL[1]) / 2), ecy = PZ((CLS_EL[2] + CLS_EL[3]) / 2);
  g.beginPath(); g.arc(ecx, ecy, 8, 0, Math.PI * 2);
  g.fillStyle = '#c62828'; g.fill();
  g.lineWidth = 3; g.strokeStyle = '#fff'; g.stroke();
  g.fillStyle = '#9d2027'; g.font = 'bold 14px "Microsoft YaHei",sans-serif';
  g.textAlign = 'left'; g.fillText('电梯厅（您所在位置）', ecx + 13, ecy - 1);
  g.textAlign = 'center';
  // 指北针（这张图的"北"是 −z，也就是图的上方）
  g.save(); g.translate(W - 86, 142);
  g.fillStyle = '#1d1f22';
  g.beginPath(); g.moveTo(0, -24); g.lineTo(12, 18); g.lineTo(0, 10); g.lineTo(-12, 18);
  g.closePath(); g.fill();
  g.font = 'bold 15px "Microsoft YaHei",sans-serif'; g.fillText('北', 0, 36);
  g.restore();
  // 左下角楼层号 / 图例 / 落款
  g.textAlign = 'left';
  g.fillStyle = '#32363a'; g.font = 'bold 58px "Microsoft YaHei",sans-serif';
  g.fillText('6F', 56, H - 52);
  const ly = H - 56;
  g.fillStyle = '#3a8ec4'; g.fillRect(150, ly - 7, 18, 12);
  g.fillStyle = '#4b4f53'; g.font = '15px "Microsoft YaHei",sans-serif';
  g.fillText('房间', 174, ly);
  g.fillStyle = '#bed99c'; g.fillRect(236, ly - 7, 18, 12);
  g.fillStyle = '#4b4f53'; g.fillText('通道', 260, ly);
  g.fillStyle = '#c62828'; g.beginPath(); g.arc(322, ly - 1, 7, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#4b4f53'; g.fillText('当前位置', 336, ly);
  g.textAlign = 'right';
  g.fillStyle = '#6b6f73'; g.font = '14px "Microsoft YaHei",sans-serif';
  g.fillText('北京交通大学图书馆 · 六层平面图', W - 56, H - 44);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  _aniso(tex);
  return tex;
}

// 召唤面板上的红色楼层数字（黑底发光）
function makeElPanelTex(digit) {
  const W = 96, H = 120;
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d');
  g.fillStyle = '#050607'; g.fillRect(0, 0, W, H);
  g.strokeStyle = '#1b1e21'; g.lineWidth = 3; g.strokeRect(1.5, 1.5, W - 3, H - 3);
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.shadowColor = 'rgba(255,32,20,0.95)'; g.shadowBlur = 18;
  g.fillStyle = '#ff2a18'; g.font = 'bold 86px "Consolas","Microsoft YaHei",monospace';
  g.fillText(digit, W / 2, H / 2 + 4);
  g.shadowBlur = 0;
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  _aniso(tex);
  return tex;
}

function buildElevatorHall([x0, x1, z0, z1]) {
  const cxr = (x0 + x1) / 2;
  const DOOR_W = 1.05, DOOR_H = 2.20, FRAME = 0.10;
  const doorXs = [x0 + 0.875, x1 - 0.875];       // 两台门中心；中间白墙 1.2 m
  const texSteel = makeBrushedSteelTex();
  const matSteel = new THREE.MeshStandardMaterial({ map: texSteel, metalness: 0.42, roughness: 0.27 });
  const matDark = new THREE.MeshStandardMaterial({ color: 0x121417, roughness: 0.62, metalness: 0.18 });
  const matWallEL = new THREE.MeshLambertMaterial({ map: makePaintTexture('#f3f2ee', '94,90,82') });
  METRIC_UV.set(matWallEL, 4);

  // ① 整面刷白：原墙是偏米色的乳胶漆，照片里这面是冷白；两侧墙一起刷，免得一转头又回米色
  box(world, x1 - x0 - 0.006, ROOM_H, 0.012, cxr, ROOM_H / 2, z0 + 0.05, matWallEL, false);
  box(world, 0.012, ROOM_H, z1 - z0 - 0.006, x0 + 0.05, ROOM_H / 2, (z0 + z1) / 2, matWallEL, false);
  box(world, 0.012, ROOM_H, z1 - z0 - 0.006, x1 - 0.05, ROOM_H / 2, (z0 + z1) / 2, matWallEL, false);

  // ② 黑踢脚：南墙绕开两樘门；两侧墙也来一道
  const skH = 0.10, skD = 0.03;
  {
    const gaps = [[doorXs[0] - (DOOR_W / 2 + FRAME), doorXs[0] + (DOOR_W / 2 + FRAME)],
                  [doorXs[1] - (DOOR_W / 2 + FRAME), doorXs[1] + (DOOR_W / 2 + FRAME)]];
    let xs = x0 + 0.008;
    for (const [a, b] of gaps) {
      if (a - xs > 0.02) box(world, a - xs, skH, skD, (xs + a) / 2, skH / 2, z0 + 0.06, matBase, false);
      xs = b;
    }
    if (x1 - 0.008 - xs > 0.02) {
      box(world, x1 - 0.008 - xs, skH, skD, (xs + x1 - 0.008) / 2, skH / 2, z0 + 0.06, matBase, false);
    }
    box(world, skD, skH, z1 - z0 - 0.01, x0 + 0.062, skH / 2, (z0 + z1) / 2, matBase, false);
    box(world, skD, skH, z1 - z0 - 0.01, x1 - 0.062, skH / 2, (z0 + z1) / 2, matBase, false);
  }

  // ③ 两台门 + 召唤面板
  function callPanel(px, py, pz, digit) {
    box(world, 0.105, 0.46, 0.020, px, py, pz + 0.004, matSteel, false);
    box(world, 0.080, 0.105, 0.010, px, py + 0.155, pz + 0.018, matDark, false);
    const dm = new THREE.Mesh(new THREE.PlaneGeometry(0.066, 0.085),
      new THREE.MeshBasicMaterial({ map: makeElPanelTex(digit), toneMapped: false }));
    dm.position.set(px, py + 0.155, pz + 0.0245);
    world.add(dm);
    box(world, 0.082, 0.16, 0.010, px, py - 0.050, pz + 0.018, matDark, false);
    for (const dy of [0.027, -0.033]) {
      const b = new THREE.Mesh(new THREE.CylinderGeometry(0.013, 0.013, 0.012, 12), matSteel);
      b.rotation.x = Math.PI / 2;
      b.position.set(px, py - 0.050 + dy, pz + 0.028);
      world.add(b);
    }
    const k = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.009, 0.012, 8), matDark);
    k.rotation.x = Math.PI / 2;
    k.position.set(px, py - 0.155, pz + 0.028);
    world.add(k);
  }
  for (let i = 0; i < 2; i++) {
    const cx = doorXs[i];
    // 凹在门扇后面的黑底：门缝、顶缝从这儿透出来
    box(world, DOOR_W + 0.02, DOOR_H + 0.04, 0.012, cx, (DOOR_H + 0.04) / 2, z0 + 0.060, matDark, false);
    // 两扇门（中缝 1.2 cm），比门框往里凹 1.5 cm
    const leafW = (DOOR_W - 0.014) / 2;
    for (const s of [-1, 1]) {
      box(world, leafW, DOOR_H - 0.02, 0.030,
        cx + s * (0.007 + leafW / 2), (DOOR_H - 0.02) / 2 + 0.008, z0 + 0.078, matSteel, false);
    }
    // 门框：两侧立柱 + 门楣（08 深，前沿比门扇出来 1.2 cm）
    const fo = DOOR_W / 2 + FRAME / 2;
    box(world, FRAME, 2.30, 0.050, cx - fo, 1.15, z0 + 0.080, matSteel, false);
    box(world, FRAME, 2.30, 0.050, cx + fo, 1.15, z0 + 0.080, matSteel, false);
    box(world, DOOR_W + FRAME * 2, 0.10, 0.050, cx, 2.25, z0 + 0.080, matSteel, false);
    // 门槛：照片里门下是一条深色石材
    box(world, DOOR_W - 0.02, 0.012, 0.18, cx, 0.006, z0 + 0.155, matDark, false);
    // 召唤面板：在各自门框右侧（照片里两块都在右手边）
    callPanel(cx + DOOR_W / 2 + FRAME + 0.095, 1.35, z0 + 0.062, i === 0 ? '6' : '7');
  }

  // ④ 横幅 + 平面图（挂在两门之间的白墙上）
  box(world, 1.04, 0.78, 0.012, cxr, 2.06, z0 + 0.062, matDark, false);
  const plan = new THREE.Mesh(new THREE.PlaneGeometry(1.00, 0.72),
    new THREE.MeshBasicMaterial({ map: makeElPlanTex() }));
  plan.position.set(cxr, 2.06, z0 + 0.0695);
  world.add(plan);
  box(world, 1.10, 0.20, 0.012, cxr, 2.56, z0 + 0.062, matDark, false);
  const banner = new THREE.Mesh(new THREE.PlaneGeometry(1.08, 0.17),
    new THREE.MeshBasicMaterial({ map: makeElBannerTex() }));
  banner.position.set(cxr, 2.56, z0 + 0.0695);
  world.add(banner);

  // ⑤ 吊顶：喷淋头 + 烟感（照片顶上就这两件）
  {
    const spr = new THREE.Group();
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.030, 0.034, 0.055, 12), matSteel);
    body.position.y = -0.028;
    spr.add(body);
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.014, 8, 6),
      new THREE.MeshBasicMaterial({ color: 0xd4251a }));
    bulb.position.y = -0.062;
    spr.add(bulb);
    const defl = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.052, 0.008, 14), matSteel);
    defl.position.y = -0.080;
    spr.add(defl);
    spr.position.set(x0 + 0.90, ROOM_H - 0.005, z0 + 0.55);
    world.add(spr);

    const sd = new THREE.Group();
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.095, 0.028, 20), matWhitePlastic);
    disc.position.y = -0.014;
    sd.add(disc);
    const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.006, 16), matAlu);
    ring.position.y = -0.030;
    sd.add(ring);
    sd.position.set(x1 - 0.85, ROOM_H - 0.004, z0 + 0.75);
    world.add(sd);
  }

  // ⑥ 顶灯：照片里这面墙很亮，而且不锈钢要有高光才像金属
  const L = new THREE.PointLight(0xeef3fa, 12, 9, 2);
  L.position.set(cxr, ROOM_H - 0.18, z0 + 1.55);
  scene.add(L);
}
/* 楼梯间B（走廊东头，门牌旁边那间）：照 6F 实景照片重做
   -------------------------------------------------------------------------
   照片里两跑是开敞梯井 + 不锈钢栏杆，原来那面 1.5 m 高的实体梯井墙和绿地都拆掉。
   白墙 / 黑踢脚 / 800 亮面灰砖 / 灰砖踏步 + 防滑槽 / 混凝土梯帮 / 北墙大窗 /
   吸顶灯，和西头 A 梯共用同一套材质。门照照片做成关着的两扇常闭防火门，
   1F/2F 各一对，按 E 开关、主机权威同步；关着挡人，开了中间 1.6 m 净宽能走。
   ⚠ 楼梯画在 scene 的独立组里，不能画进 world（整层克隆会在二楼再长一条）。
   ⚠ 碰撞不逐级注册，走 groundAt 的连续坡面；梯井/支撑墙的碰撞单独在下面补。 */
function buildStairB([x0, x1, z0, z1]) {
  const G = new THREE.Group();
  scene.add(G);
  const W = x1 - x0, D = z1 - z0;
  const cxc = (x0 + x1) / 2, czc = (z0 + z1) / 2;
  const cxA = (SB_A0 + SB_A1) / 2, cxB = (SB_B0 + SB_B1) / 2;
  const IN_W = x0 + 0.06, IN_E = x1 - 0.06, IN_N = z0 + 0.06;
  const N = 15, run = SB_RUN / N, rise = SB_RISE / N;
  const doorCx = (DOOR_STB[0] + DOOR_STB[1]) / 2;
  const leafW = (DOOR_STB[1] - DOOR_STB[0]) / 2 - 0.006;

  const B = (w, h, d, x, y, z, mat, sh = false) => box(G, w, h, d, x, y, z, mat, sh);
  const CYL = (r1, r2, h, seg, mat, x, y, z, rot) => {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(r1, r2, h, seg), mat);
    m.castShadow = false; m.receiveShadow = true;
    m.position.set(x, y, z);
    if (rot) m.rotation.set(rot[0] || 0, rot[1] || 0, rot[2] || 0);
    G.add(m);
    return m;
  };
  const PLANE = (w, h, mat, x, y, z, ry) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
    m.position.set(x, y, z);
    m.rotation.y = ry || 0;
    m.castShadow = false; m.receiveShadow = true;
    G.add(m);
    return m;
  };
  const skH = 0.10, skD = 0.024;
  const SK = (w, d, x, z, y0) => B(w, skH, d, x, y0 + skH / 2, z, matBase, false);

  // ① 楼板 / 顶盖（1F 整块亮面灰砖；3 m 只铺门口那条平台，梯段上方留洞）
  B(W - 0.02, 0.04, D - 0.02, cxc, -0.018, czc, matSFloor, false);
  B(W - 0.02, 0.18, z1 - SB_ZP, cxc, ROOM_H - 0.09, (SB_ZP + z1) / 2, matSWall, false);
  B(W - 0.04, 0.012, z1 - SB_ZP - 0.02, cxc, ROOM_H + 0.006, (SB_ZP + z1) / 2, matSFloor, false);
  B(W, 0.06, D, cxc, ROOM_H * 2 - 0.03, czc, matHallCeil, false);
  B(W, 0.22, 0.20, cxc, ROOM_H * 2 - 0.13, SB_ZP + 0.12, matSWall, false);   // 门口上方一道白梁

  // ② 四面墙刷白（两层一起盖）
  const OV = 0.012;
  B(OV, ROOM_H * 2, D - 0.02, IN_W + 0.017, ROOM_H, czc, matSWall, false);
  B(OV, ROOM_H * 2, D - 0.02, IN_E - 0.017, ROOM_H, czc, matSWall, false);
  B(W - 0.02, ROOM_H * 2, OV, cxc, ROOM_H, IN_N + 0.017, matSWall, false);
  B(DOOR_STB[0] - x0 - 0.02, ROOM_H * 2, OV, (x0 + DOOR_STB[0]) / 2, ROOM_H, z1 - 0.06 - 0.017, matSWall, false);
  B(x1 - DOOR_STB[1] - 0.02, ROOM_H * 2, OV, (DOOR_STB[1] + x1) / 2, ROOM_H, z1 - 0.06 - 0.017, matSWall, false);
  // 门上方补白（1F 门洞 2.12 以上到 2F 楼面；2F 门洞 5.12 以上到顶）
  B(DOOR_STB[1] - DOOR_STB[0], 3.06 - 2.12, 0.14, doorCx, (2.12 + 3.06) / 2, z1, matSWall, false);
  B(DOOR_STB[1] - DOOR_STB[0], ROOM_H * 2 - 5.12, 0.14, doorCx, (5.12 + ROOM_H * 2) / 2, z1, matSWall, false);
  /* 走廊侧门洞周围也刷白：照片里门边是白墙 + 黑踢脚，现在走廊也统一成这一套。
     白色贴面只盖门洞两侧，门洞本身和上方的白过梁不动。 */
  const CZ = z1 + 0.055;
  B(DOOR_STB[0] - x0 - 0.02, ROOM_H * 2, OV, (x0 + DOOR_STB[0]) / 2, ROOM_H, CZ, matSWall, false);
  B(x1 - DOOR_STB[1] - 0.02, ROOM_H * 2, OV, (DOOR_STB[1] + x1) / 2, ROOM_H, CZ, matSWall, false);
  for (const y0 of [0, ROOM_H + FLOOR2_LIFT]) {
    SK(DOOR_STB[0] - x0 - 0.02, skD, (x0 + DOOR_STB[0]) / 2, CZ + 0.012, y0);
    SK(x1 - DOOR_STB[1] - 0.02, skD, (DOOR_STB[1] + x1) / 2, CZ + 0.012, y0);
  }

  // ③ 半平台（1.5 m）与支撑墙
  B(W - 0.02, 0.18, SB_ZM - z0, cxc, SB_RISE - 0.09, (z0 + SB_ZM) / 2, matSWall, false);
  B(W - 0.04, 0.012, SB_ZM - z0 - 0.02, cxc, SB_RISE - 0.006, (z0 + SB_ZM) / 2, matSFloor, false);
  B(W, 1.32, 0.10, cxc, 0.66, SB_ZM + 0.05, matSWall, false);

  // ④ 两跑灰砖台阶 + 深色防滑槽（视觉；碰撞走 groundAt 坡面）
  let stepCount = 0;
  for (let k = 0; k < N; k++) {
    const hA = (k + 1) * rise;
    const zA = SB_ZP - (k + 0.5) * run;
    B(SB_A1 - SB_A0, hA, run, cxA, hA / 2, zA, matSStep, false);
    B(SB_A1 - SB_A0, 0.012, 0.10, cxA, hA + 0.006, SB_ZP - k * run - 0.05, matSNose, false);
    const hB = SB_RISE + (k + 1) * rise;
    const zB = SB_ZM + (k + 0.5) * run;
    B(SB_B1 - SB_B0, hB, run, cxB, hB / 2, zB, matSStep, false);
    B(SB_B1 - SB_B0, 0.012, 0.10, cxB, hB + 0.006, SB_ZM + k * run + 0.05, matSNose, false);
    stepCount += 2;
  }
  // 梯井两侧的混凝土梯帮（照片里那块灰三角）
  function sidePlate(x, pts) {
    const n = pts.length;
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(n * 3), uv = new Float32Array(n * 2);
    pts.forEach(([z, y], i) => {
      pos[i * 3] = 0; pos[i * 3 + 1] = y; pos[i * 3 + 2] = z;
      uv[i * 2] = z; uv[i * 2 + 1] = y;
    });
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    const idx = [];
    for (let i = 1; i < n - 1; i++) idx.push(0, i, i + 1);
    g.setIndex(idx);
    g.computeVertexNormals();
    const m = new THREE.Mesh(g, matSConcrete);
    m.position.x = x;
    m.castShadow = false; m.receiveShadow = true;
    G.add(m);
  }
  sidePlate(SB_A1 + 0.002, [[SB_ZP, 0], [SB_ZM, SB_RISE], [SB_ZM, 0]]);
  sidePlate(SB_B0 - 0.002, [[SB_ZM, SB_RISE], [SB_ZP, ROOM_H], [SB_ZP, 0], [SB_ZM, 0]]);
  // 东跑顶到 2F 平台那一端朝南是实心梯段的断面：刷白成墙 + 黑踢脚，
  // 不然从一楼平台抬头看到一整面瓷砖断面（和西头 A 梯同一个处理）
  B(SB_B1 - SB_B0 + 0.02, ROOM_H, 0.012, (SB_B0 + SB_B1) / 2, ROOM_H / 2, SB_ZP + 0.006, matSWall, false);
  B(SB_B1 - SB_B0 + 0.02, skH, 0.024, (SB_B0 + SB_B1) / 2, skH / 2, SB_ZP + 0.024, matBase, false);

  // ⑤ 黑踢脚（10 cm）：1F 平台 / 半平台 / 2F 平台，只贴有墙的边
  SK(W - 0.02, skD, cxc, IN_N + 0.029, SB_RISE);
  SK(skD, SB_ZM - z0 - 0.02, IN_W + 0.035, (z0 + SB_ZM) / 2, SB_RISE);
  SK(skD, SB_ZM - z0 - 0.02, IN_E - 0.012, (z0 + SB_ZM) / 2, SB_RISE);
  for (const y0 of [0, ROOM_H]) {
    SK(skD, z1 - SB_ZP - 0.02, IN_W + 0.035, (SB_ZP + z1) / 2, y0);
    SK(skD, z1 - SB_ZP - 0.02, IN_E - 0.012, (SB_ZP + z1) / 2, y0);
    SK(DOOR_STB[0] - x0 - 0.02, skD, (x0 + DOOR_STB[0]) / 2, z1 - 0.06 - 0.029, y0);
    SK(x1 - DOOR_STB[1] - 0.02, skD, (DOOR_STB[1] + x1) / 2, z1 - 0.06 - 0.029, y0);
  }

  // ⑥ 不锈钢栏杆：两跑内侧 + 半平台 + 2F 平台洞口
  const pitch = Math.atan2(SB_RISE, SB_RUN);
  const railLen = Math.hypot(SB_RISE, SB_RUN);
  const railH = 0.96;
  let postCount = 0, barCount = 0, topRailCount = 0;
  function flightRail(x, dir) {                 // dir=+1 东跑往南升；-1 西跑往北升
    const yAt = (z) => dir > 0 ? SB_RISE + (z - SB_ZM) / SB_RUN * SB_RISE
                               : (SB_ZP - z) / SB_RUN * SB_RISE;
    const surfAt = (z) => {
      const d = dir > 0 ? (z - SB_ZM) / run : (SB_ZP - z) / run;
      const k = Math.max(0, Math.min(N, Math.ceil(d)));
      return (dir > 0 ? SB_RISE : 0) + k * rise;
    };
    for (let i = 0; i < 5; i++) {
      const z = dir > 0 ? SB_ZM + 0.18 + i * (SB_RUN - 0.36) / 4
                        : SB_ZP - 0.18 - i * (SB_RUN - 0.36) / 4;
      const y0 = surfAt(z), y1 = yAt(z) + railH;
      CYL(0.022, 0.022, y1 - y0, 10, matSRail, x, (y0 + y1) / 2, z);
      postCount++;
    }
    const cz = (SB_ZM + SB_ZP) / 2;
    const cy = (dir > 0 ? SB_RISE + SB_RISE / 2 : SB_RISE / 2) + railH;
    const rot = [dir > 0 ? Math.PI / 2 - pitch : -(Math.PI / 2 - pitch), 0, 0];
    CYL(0.028, 0.028, railLen, 12, matSRail, x, cy, cz, rot); topRailCount++;
    for (let b = 1; b <= 5; b++) {
      CYL(0.009, 0.009, railLen, 8, matSRail, x, cy - b * 0.135, cz, rot);
      barCount++;
    }
  }
  flightRail(SB_A1 - 0.03, -1);
  flightRail(SB_B0 + 0.03, 1);

  // 起步立柱旁的 U 形防滑环（照片里挂在梯段下端）
  function loopGuard(x, z0, dir, yBase) {
    const len = 0.34;
    for (const y of [0.34, 0.68]) CYL(0.014, 0.014, len, 8, matSRail, x, yBase + y, z0 + dir * len / 2, [Math.PI / 2, 0, 0]);
    CYL(0.014, 0.014, 0.34, 8, matSRail, x, yBase + 0.51, z0 + dir * len);
  }
  loopGuard(SB_A1 - 0.03, SB_ZP - 0.18, -1, 0.05);
  loopGuard(SB_B0 + 0.03, SB_ZM + 0.18, 1, SB_RISE + 0.05);

  // 半平台南沿横向栏杆（挡住开敞梯井）
  {
    const rz = SB_ZM + 0.10, rx0 = SB_A1, rx1 = SB_B0;
    for (const x of [rx0, (rx0 + rx1) / 2, rx1]) {
      CYL(0.022, 0.022, 0.96, 10, matSRail, x, SB_RISE + 0.48, rz);
      postCount++;
    }
    CYL(0.028, 0.028, rx1 - rx0, 12, matSRail, (rx0 + rx1) / 2, SB_RISE + 0.96, rz, [0, 0, Math.PI / 2]);
    topRailCount++;
    for (let b = 1; b <= 5; b++) {
      CYL(0.009, 0.009, rx1 - rx0, 8, matSRail, (rx0 + rx1) / 2, SB_RISE + 0.96 - b * 0.135, rz, [0, 0, Math.PI / 2]);
      barCount++;
    }
  }
  // 2F 平台洞口护栏：只拦西半 + 梯井，东跑 x 27.6 以北是上平台出口，必须留空
  {
    const rz = SB_ZP - 0.03, rx0 = x0 + 0.10, rx1 = SB_B0 - 0.03;
    for (let i = 0; i <= 4; i++) {
      const x = rx0 + i * (rx1 - rx0) / 4;
      CYL(0.022, 0.022, 1.0, 10, matSRail, x, ROOM_H + 0.52, rz);
      postCount++;
    }
    CYL(0.028, 0.028, rx1 - rx0, 12, matSRail, (rx0 + rx1) / 2, ROOM_H + 1.02, rz, [0, 0, Math.PI / 2]);
    topRailCount++;
    for (let b = 1; b <= 5; b++) {
      CYL(0.009, 0.009, rx1 - rx0, 8, matSRail, (rx0 + rx1) / 2, ROOM_H + 1.02 - b * 0.135, rz, [0, 0, Math.PI / 2]);
      barCount++;
    }
  }

  // ⑦ 靠墙不锈钢扶手（两跑 + 半平台北墙）
  function wallRail(railX, wallX, dir) {
    const yAt = (z) => dir > 0 ? SB_RISE + (z - SB_ZM) / SB_RUN * SB_RISE
                               : (SB_ZP - z) / SB_RUN * SB_RISE;
    const cz = (SB_ZM + SB_ZP) / 2;
    const cy = (dir > 0 ? SB_RISE + SB_RISE / 2 : SB_RISE / 2) + 0.90;
    const rot = [dir > 0 ? Math.PI / 2 - pitch : -(Math.PI / 2 - pitch), 0, 0];
    CYL(0.026, 0.026, railLen, 10, matSRail, railX, cy, cz, rot);
    for (let i = 0; i < 4; i++) {
      const z = dir > 0 ? SB_ZM + 0.28 + i * (SB_RUN - 0.56) / 3
                        : SB_ZP - 0.28 - i * (SB_RUN - 0.56) / 3;
      const y = yAt(z) + 0.90;
      CYL(0.014, 0.014, Math.abs(railX - wallX), 8, matSRail, (railX + wallX) / 2, y, z, [0, 0, Math.PI / 2]);
    }
  }
  wallRail(IN_W + 0.075, IN_W + 0.008, -1);
  wallRail(IN_E - 0.075, IN_E - 0.008, 1);
  CYL(0.026, 0.026, 1.10, 10, matSRail, 27.05, SB_RISE + 0.90, IN_N + 0.075, [0, 0, Math.PI / 2]);
  for (const x of [26.60, 27.50]) CYL(0.013, 0.013, 0.063, 8, matSRail, x, SB_RISE + 0.90, IN_N + 0.041, [0, 0, Math.PI / 2]);

  // ⑧ 北墙大窗（半平台上方，深色外圈 + 白框 + 白窗台）
  {
    const gx = 27.05, gy = 3.60;
    /* ⚠ 玻璃/窗框必须落在白墙贴面**外面**：贴面中心在 IN_N+0.017、厚 12 mm，
       外表面是 IN_N+0.023。之前把窗放在 WZ=IN_N+0.008，整个窗都埋进贴面里，
       屏幕上只剩一圈白框。 */
    const WALLF = IN_N + 0.023;
    const GZ = WALLF + 0.011;        // 玻璃
    const TZ = WALLF + 0.004;        // 深色外圈（玻璃后面、贴面前面）
    const FZ = WALLF + 0.017;        // 白框（玻璃前面）
    PLANE(1.90, 1.95, matGlassDay, gx, gy, GZ, 0);
    B(2.02, 0.05, 0.012, gx, gy + 1.005, TZ, matDoorDark, false);
    B(2.02, 0.05, 0.012, gx, gy - 1.005, TZ, matDoorDark, false);
    B(0.05, 2.06, 0.012, gx - 1.005, gy, TZ, matDoorDark, false);
    B(0.05, 2.06, 0.012, gx + 1.005, gy, TZ, matDoorDark, false);
    for (const yy of [gy - 0.995, gy + 0.995]) B(1.90, 0.06, 0.02, gx, yy, FZ, matScreenW, false);
    for (const xx of [gx - 0.915, gx + 0.915]) B(0.07, 1.90, 0.02, xx, gy, FZ, matScreenW, false);
    B(0.05, 1.84, 0.02, gx, gy, FZ, matScreenW, false);
    B(1.80, 0.05, 0.02, gx, gy - 0.03, FZ, matScreenW, false);
    B(2.06, 0.06, 0.14, gx, 2.60, WALLF + 0.060, matScreenW, false);
  }

  // ⑨ 吸顶圆灯 + 两盏真光源
  {
    const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.19, 0.018, 20), matWhitePlastic);
    ring.position.set(27.05, ROOM_H * 2 - 0.03, -0.70);
    G.add(ring);
    const face = new THREE.Mesh(new THREE.CircleGeometry(0.15, 20),
      new THREE.MeshBasicMaterial({ color: 0xfff5e6, toneMapped: false }));
    face.rotation.x = Math.PI / 2;
    face.position.set(27.05, ROOM_H * 2 - 0.041, -0.70);
    G.add(face);
    const L1 = new THREE.PointLight(0xeef3fa, 5.5, 12, 2);
    L1.position.set(27.05, 4.70, -0.70);
    scene.add(L1);
    const L2 = new THREE.PointLight(0xfff1dc, 1.6, 5.5, 2);
    L2.position.set(26.20, 2.55, 1.55);
    scene.add(L2);
  }

  // ⑩ 消防设施牌 + 开关（西墙）
  PLANE(0.34, 0.22, matNotice, IN_W + 0.008, 2.66, 1.30, Math.PI / 2);
  B(0.012, 0.09, 0.09, IN_W + 0.008, 1.25, 1.62, matSBeige, false);
  B(0.006, 0.05, 0.035, IN_W + 0.015, 1.25, 1.62, matWhitePlastic, false);

  // ⑪ 双扇常闭防火门（1F/2F 各一对，门面向走廊，朝楼梯间内开 90°）
  const doorLeaves = [];
  function makeLeaf(hingeX, dir, y0) {
    const g = new THREE.Group();
    const closedYaw = dir > 0 ? 0 : Math.PI;
    const openYaw = closedYaw + (dir > 0 ? Math.PI / 2 : -Math.PI / 2);
    g.position.set(hingeX, y0, z1);
    g.rotation.y = closedYaw;
    scene.add(g);
    const sface = dir > 0 ? -1 : 1;            // 楼梯间那一面（局部 ±z）
    box(g, leafW, 2.06, 0.035, leafW / 2, 1.03, 0, matSFire, false);
    box(g, 0.03, 2.06, 0.05, leafW - 0.005, 1.03, 0.024, matSHard, false);   // 中缝盖条
    for (const hy of [0.42, 1.64]) {
      box(g, 0.012, 0.12, 0.05, 0.014, hy, 0.026, matSHard, false);
      box(g, 0.012, 0.12, 0.05, 0.014, hy, -0.026, matSHard, false);
    }
    box(g, 0.22, 0.045, 0.045, 0.24, 2.00, sface * 0.036, matSHard, false);   // 闭门器
    const arm = box(g, 0.28, 0.024, 0.024, 0.10, 1.955, sface * 0.036, matSHard, false);
    arm.rotation.z = dir > 0 ? 0.18 : -0.18;
    if (dir > 0) {
      box(g, 0.06, 0.04, 0.004, 0.10, 1.95, sface * 0.024, matPropRed, false);
    } else {
      for (const s of [-1, 1]) {
        const rose = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.02, 12), matSHard);
        rose.rotation.x = Math.PI / 2;
        rose.position.set(leafW - 0.11, 1.02, s * 0.030);
        g.add(rose);
        box(g, 0.13, 0.028, 0.028, leafW - 0.065, 1.005, s * 0.045, matSHard, false);
        const lock = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.02, 10), matSHard);
        lock.rotation.x = Math.PI / 2;
        lock.position.set(leafW - 0.11, 1.17, s * 0.030);
        g.add(lock);
        const sign = new THREE.Mesh(new THREE.PlaneGeometry(0.235, 0.145), matFireSign);
        sign.position.set(leafW - 0.13, 1.43, s * 0.020);
        sign.rotation.y = s > 0 ? 0 : Math.PI;
        g.add(sign);
      }
    }
    doorLeaves.push({ g, closedYaw, openYaw });
  }
  function doorDress(y0) {
    // 楼梯间侧门套（z=2.32）+ 走廊侧门套（z=2.48）
    for (const zz of [2.32, 2.48]) {
      const sz = zz < z1 ? 0.05 : 0.04;
      const dz = zz < z1 ? 0.05 : 0.04;
      for (const xx of [DOOR_STB[0] - 0.025, DOOR_STB[1] + 0.025]) {
        B(sz, 2.14, dz, xx, y0 + 1.07, zz, matSTrim, false);
      }
      B(DOOR_STB[1] - DOOR_STB[0] + (zz < z1 ? 0.10 : 0.08), 0.08,
        dz, doorCx, y0 + 2.12, zz, matSTrim, false);
    }
    B(1.60, 0.012, 0.16, doorCx, y0 + 0.006, z1, matBase, false);              // 黑门槛
    // 6 号牌：黑底金圈，内外各一块
    for (const [pz, face] of [[2.303, -1], [2.497, 1]]) {
      const back = new THREE.Mesh(new THREE.CylinderGeometry(0.185, 0.185, 0.02, 32), matSDark);
      back.rotation.x = Math.PI / 2;
      back.position.set(doorCx, y0 + 2.45, pz + (face < 0 ? 0.012 : -0.012));
      G.add(back);
      const pl = new THREE.Mesh(new THREE.CircleGeometry(0.175, 32), matPlaque);
      pl.position.set(doorCx, y0 + 2.45, pz);
      pl.rotation.y = face < 0 ? Math.PI : 0;
      G.add(pl);
    }
    // 门旁米色门禁盒 + 黑屏（走廊侧）、墙开关
    B(0.16, 0.10, 0.03, 25.22, y0 + 2.35, 2.475, matSBeige, false);
    const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.10, 0.045), matSBlack);
    scr.position.set(25.22, y0 + 2.35, 2.492);
    G.add(scr);
    B(0.09, 0.09, 0.012, 25.22, y0 + 1.25, 2.475, matSBeige, false);
    B(0.035, 0.05, 0.006, 25.22, y0 + 1.25, 2.483, matWhitePlastic, false);
    // 暖气片（铸铁片）+ 上下横管 + 立管（西墙 1F 平台）
    const rx = IN_W + 0.065, rz0 = 1.05, rz1 = 1.95;
    for (let i = 0; i < 11; i++) {
      const z = rz0 + i * (rz1 - rz0) / 10;
      B(0.13, 0.50, 0.052, rx, y0 + 0.33, z, matSRad, false);
    }
    CYL(0.025, 0.025, rz1 - rz0 + 0.03, 8, matSRad, rx, y0 + 0.59, (rz0 + rz1) / 2, [Math.PI / 2, 0, 0]);
    CYL(0.025, 0.025, rz1 - rz0 + 0.03, 8, matSRad, rx, y0 + 0.10, (rz0 + rz1) / 2, [Math.PI / 2, 0, 0]);
    for (const z of [rz0 + 0.08, rz1 - 0.08]) B(0.05, 0.10, 0.10, rx, y0 + 0.05, z, matSRad, false);
    CYL(0.022, 0.022, 2.80, 8, matSRad, rx, y0 + 1.40, 2.15);
    CYL(0.020, 0.020, 0.16, 8, matSRad, rx, y0 + 0.59, 2.15, [Math.PI / 2, 0, 0]);
    // 黑地垫
    B(1.20, 0.012, 0.70, doorCx, y0 + 0.018, 1.85, matSMat, false);
  }
  doorDress(0);
  doorDress(ROOM_H);
  // 走廊侧门前的黑地垫（照片里那块大的）+ 门右侧的暖气片和立管
  B(1.70, 0.012, 0.95, doorCx, 0.014, 3.15, matSMat, false);
  {
    const rx0 = 27.12, rx1 = 28.02, rz = z1 + 0.075;
    for (let i = 0; i < 11; i++) {
      const x = rx0 + 0.06 + i * (rx1 - rx0 - 0.12) / 10;
      B(0.052, 0.50, 0.13, x, 0.33, rz, matSRad, false);
    }
    CYL(0.025, 0.025, rx1 - rx0 + 0.03, 8, matSRad, (rx0 + rx1) / 2, 0.59, rz, [0, 0, Math.PI / 2]);
    CYL(0.025, 0.025, rx1 - rx0 + 0.03, 8, matSRad, (rx0 + rx1) / 2, 0.10, rz, [0, 0, Math.PI / 2]);
    for (const x of [rx0 + 0.08, rx1 - 0.08]) B(0.05, 0.10, 0.10, x, 0.05, rz, matSRad, false);
    CYL(0.022, 0.022, 2.80, 8, matSRad, rx0, 1.40, rz);
    CYL(0.020, 0.020, 0.16, 8, matSRad, rx0, 0.59, rz, [Math.PI / 2, 0, 0]);
  }
  makeLeaf(DOOR_STB[0], 1, 0);
  makeLeaf(DOOR_STB[1], -1, 0);
  makeLeaf(DOOR_STB[0], 1, ROOM_H);
  makeLeaf(DOOR_STB[1], -1, ROOM_H);

  const dRect = {
    minX: DOOR_STB[0], maxX: DOOR_STB[1], minZ: z1 - 0.12, maxZ: z1 + 0.12,
    top: 2.4, no2f: true,
  };
  const dRect2 = { ...dRect, top: ROOM_H + 2.4, base: ROOM_H };
  deskRects.push(dRect, dRect2);
  const bDoor = {
    leaves: doorLeaves, open: false, cur: 0, rect: dRect, rect2: dRect2,
    name: '楼梯间门B', cx: doorCx, cz: z1,
  };
  swingDoors.push(bDoor);

  window.__stairB = () => ({
    steps: stepCount, posts: postCount, bars: barCount, topRails: topRailCount,
    doorLeaves: doorLeaves.length,
    doorOpen: !!bDoor.open, doorCur: +bDoor.cur.toFixed(2),
    rectTop: bDoor.rect.top, rect2Top: bDoor.rect2.top,
    leafYaw: doorLeaves.map((L) => +L.g.rotation.y.toFixed(2)),
    radiatorFins: 33, plaques: 4, mats: 3, windows: 1, windowX: 27.05, windowY: 3.60,
  });

  pendingMerge.push(G);
}

/* =========================================================================
   第五间教室 E：照照片建出来的「长条桌 + 蓝背椅」阶梯教室
   -------------------------------------------------------------------------
   朝向：黑板在西墙(x=10)，学生脸朝 −X；走廊在北边 ⇒ 学生的右手边就是走廊，
   门开在北墙(z=z0 那面)靠西的一头 x 10.9~12.9，在讲台的右边。
   南墙(x=26.4)一整排窗 + 蓝窗帘 + 窗下暖气片 = 学生的左手边，和照片对得上。
   ⚠ 窗是"贴在实心墙内侧的发光板"，不是真的在墙上开洞：这栋楼的墙是一整块
     box，开洞要拆成好几段墙；而办公室那侧本来也没有真窗，观感上够了。
   ========================================================================= */
/* ── 教室 E 的材质：全部共享、全部不走 PBR ─────────────────────────
   为什么抠这个：mergeStatic 是按 material.uuid 分桶合并的，一种材质 = 一个绘制批次。
   第一版我在 for 循环里 new 了三次窗帘材质（还各自带一张 128² 的 canvas 贴图），
   等于凭空多三批；而 MeshStandardMaterial 每个像素要算 PBR。
   这种"走过去看一眼"的房间用 Lambert 完全够 —— 半条命那年代本来就是
   平涂贴图 + 顶点光照，换过去反而更像，还省显存。
   阴影不用管：renderer.shadowMap.autoUpdate = false，静态阴影只烘一次。 */
const matChairBlue = new THREE.MeshLambertMaterial({ color: 0x3f7fa8 });
const matDeskTop   = new THREE.MeshLambertMaterial({ color: 0xdde2c6 });
const matDeskLeg   = new THREE.MeshLambertMaterial({ color: 0x2f3338 });
const matAlu       = new THREE.MeshLambertMaterial({ color: 0xb2b6bb });
const matScreenW   = new THREE.MeshLambertMaterial({ color: 0xf2f2ec });
const matDoorDark  = new THREE.MeshLambertMaterial({ color: 0x2a2320 });
/* 假窗原来是整块 0xbcd6ea 的 Basic 材质：不参与光照 ⇒ 永远是屋里最亮的一块，
   白框又几乎和墙同色，看着就是墙上挂了块白板。改成一张"窗外"：上头天光、
   中间过曝的雾白、底下两团树影，整体压暗一点，玻璃才有玻璃的样子。 */
const texDaylight = (() => {
  const S = 128, c = newCanvas(S), g = c.getContext('2d');
  const grad = g.createLinearGradient(0, 0, 0, S);
  grad.addColorStop(0, '#8fb2d4');
  grad.addColorStop(0.40, '#c2d6e6');
  grad.addColorStop(0.62, '#e2eae9');
  grad.addColorStop(1, '#a9b8a6');
  g.fillStyle = grad;
  g.fillRect(0, 0, S, S);
  for (let i = 0; i < 10; i++) {                       // 远处的树冠，只在下 1/3 冒头
    const x = Math.random() * S, y = S - 4 - Math.random() * 20, r = 7 + Math.random() * 15;
    g.fillStyle = `rgba(${52 + ((Math.random() * 26) | 0)},${78 + ((Math.random() * 26) | 0)},${58 + ((Math.random() * 18) | 0)},0.30)`;
    g.beginPath();
    g.ellipse(x, y, r, r * 0.72, 0, 0, Math.PI * 2);
    g.fill();
  }
  g.fillStyle = 'rgba(120,126,120,0.35)';
  g.fillRect(0, S * 0.52, S, 2);                       // 对面楼顶的一条横线
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
})();
const matGlassDay  = new THREE.MeshBasicMaterial({ map: texDaylight });   // 假窗：干脆不参与光照
const matCurtainH  = new THREE.MeshLambertMaterial({ map: makeCurtainTexture(), side: THREE.DoubleSide });
const matBoardH    = new THREE.MeshLambertMaterial({ map: makeBoardTexture() });
const matStairGreen = new THREE.MeshLambertMaterial({ color: 0x4a7a52 });  // 疏散图里楼梯间是绿的

/* ── 大教室多媒体讲台的材质（照 YF310 那五张照片）─────────────────
   白柜是冲孔钢板：用一张白底深孔的 canvas 贴图，按 0.20 m 重复；
   台面是浅木纹；底座是银色铝柱。全部 Lambert，合批后只多几批。 */
const texPodiumPerf = (() => {
  const S = 64, c = newCanvas(S), g = c.getContext('2d');
  g.fillStyle = '#ecebe6'; g.fillRect(0, 0, S, S);
  g.fillStyle = 'rgba(43,46,48,0.84)';
  for (let y = 4; y < S; y += 8) {
    for (let x = 4; x < S; x += 8) {
      g.beginPath(); g.arc(x, y, 1.7, 0, Math.PI * 2); g.fill();
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  _aniso(tex);
  return tex;
})();
const matPodiumWhite = new THREE.MeshLambertMaterial({ color: 0xebeae4 });
const matPodiumPerf  = new THREE.MeshLambertMaterial({ map: texPodiumPerf });
const matPodiumWood  = new THREE.MeshLambertMaterial({ map: makeWoodTexture(212, 198, 172) });
const matCableBlue   = new THREE.MeshLambertMaterial({ color: 0x2f6fd0 });
METRIC_UV.set(matPodiumPerf, 0.20);
METRIC_UV.set(matPodiumWood, 1.4);

/* ── 多媒体讲台（YF310 照片还原），大教室和四间小教室共用同一套 ────────
   白色冲孔柜体 + 浅木纹圆角台面 + 后两根白柱托起的搁板 + 左侧小抽屉/密码锁 +
   银色单柱底座。整台坐在 12 cm 高的灰砖台阶上（照片里讲台前那一级）。
   电脑直接调 pDeskPC —— 和伪装体 buildPcForm 同一套尺寸、同一套材质。
   碰撞按可见外形：台阶 0.12 / 台面 0.89 / 搁板 1.195；人能跳上讲台，但走不穿。

   局部坐标：+x 永远是从黑板墙指向教室里的方向。台面中心 PX = 1.19，
   台面后沿离黑板墙 0.78 m（一个人站得下的位置），柜体后沿 0.87 m ——
   以前柜体几乎顶到粉笔槽，老师没地方站。dir = -1 的教室整组绕 Y 转 180°。 */
function buildMultimediaPodium({ name, wallX, dir, deskZ, platformCenterZ, platformLen }) {
  const G = new THREE.Group();
  G.name = name;
  G.position.set(wallX, 0, deskZ);
  G.rotation.y = dir > 0 ? 0 : Math.PI;
  world.add(G);

  const PX = 1.19;                          // 台面中心到黑板墙
  const PZ = 0;                             // 局部坐标：台面中心在 z=0
  const TOP = 0.89;                         // 台面上表面
  const STEP = 0.12;                        // 台阶（≤STEP_UP，直接能走上去）
  const PLAT_X0 = 0.02, PLAT_X1 = 1.72;     // 台阶进深：教师站的那块也抬 12 cm
  const pzOff = (platformCenterZ - deskZ) * dir;

  const wx = (d) => wallX + dir * d;
  const wz = (lz) => deskZ + dir * lz;
  const rect = (x0, x1, z0, z1, top) => deskRects.push({
    minX: Math.min(wx(x0), wx(x1)), maxX: Math.max(wx(x0), wx(x1)),
    minZ: Math.min(wz(z0), wz(z1)), maxZ: Math.max(wz(z0), wz(z1)), top,
  });

  // ① 台阶 + 齐平的铝包边
  const pz0 = pzOff - platformLen / 2, pz1 = pzOff + platformLen / 2;
  box(G, PLAT_X1 - PLAT_X0, STEP, platformLen, (PLAT_X0 + PLAT_X1) / 2, STEP / 2, pzOff, matFloorTile, false);
  box(G, 0.05, 0.012, platformLen, PLAT_X1 - 0.02, STEP - 0.006, pzOff, matAlu, false);
  rect(PLAT_X0, PLAT_X1, pz0, pz1, STEP);

  // ② 银色单柱底座 + 平脚（放在右前，照片里从学生侧能看见）
  box(G, 0.20, 0.10, 0.20, PX + 0.12, 0.17, PZ - 0.30, matAlu, false);
  box(G, 0.54, 0.03, 0.32, PX + 0.12, 0.135, PZ - 0.30, matAlu, false);

  // ③ 白色柜体 + 三面冲孔
  box(G, 0.64, 0.62, 1.16, PX, 0.53, PZ, matPodiumWhite, false);          // y 0.22~0.84
  box(G, 0.012, 0.42, 1.06, PX + 0.326, 0.44, PZ, matPodiumPerf, false);  // 前面
  box(G, 0.60, 0.42, 0.012, PX, 0.44, PZ + 0.586, matPodiumPerf, false);  // 两侧
  box(G, 0.60, 0.42, 0.012, PX, 0.44, PZ - 0.586, matPodiumPerf, false);
  // 门缝 + 门锁
  for (const dz of [-0.50, 0.50]) {
    box(G, 0.007, 0.44, 0.008, PX + 0.334, 0.44, PZ + dz, matDeskLeg, false);
  }
  for (const yy of [0.228, 0.648]) {
    box(G, 0.007, 0.008, 1.016, PX + 0.334, yy, PZ, matDeskLeg, false);
  }
  const lock = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.014, 14), matAlu);
  lock.rotation.z = Math.PI / 2;
  lock.position.set(PX + 0.340, 0.50, PZ + 0.40);
  G.add(lock);
  box(G, 0.006, 0.022, 0.008, PX + 0.348, 0.50, PZ + 0.40, matDeskLeg, false);
  // 右上半排散热槽
  for (let i = 0; i < 6; i++) {
    box(G, 0.008, 0.014, 0.30, PX + 0.328, 0.685 + i * 0.026, PZ - 0.34, matDeskLeg, false);
  }

  // ④ 左侧带密码锁的小抽屉
  box(G, 0.36, 0.20, 0.36, PX + 0.16, 0.74, PZ + 0.40, matPodiumWhite, false);
  box(G, 0.006, 0.045, 0.075, PX + 0.345, 0.77, PZ + 0.40, matPcPlastic, false);
  box(G, 0.003, 0.028, 0.048, PX + 0.349, 0.77, PZ + 0.40, matPcScreen, false);
  const dlock = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.008, 10), matAlu);
  dlock.rotation.z = Math.PI / 2;
  dlock.position.set(PX + 0.348, 0.70, PZ + 0.52);
  G.add(dlock);

  // ⑤ 浅木纹台面（朝学生那两个前角圆角）
  const TW = 0.82, TL = 1.42, TR = 0.09;
  const shape = new THREE.Shape();
  shape.moveTo(-TW / 2, -TL / 2);
  shape.lineTo(TW / 2 - TR, -TL / 2);
  shape.quadraticCurveTo(TW / 2, -TL / 2, TW / 2, -TL / 2 + TR);
  shape.lineTo(TW / 2, TL / 2 - TR);
  shape.quadraticCurveTo(TW / 2, TL / 2, TW / 2 - TR, TL / 2);
  shape.lineTo(-TW / 2, TL / 2);
  shape.closePath();
  const topRaw = new THREE.ExtrudeGeometry(shape, { depth: 0.05, bevelEnabled: false, curveSegments: 8 });
  topRaw.rotateX(-Math.PI / 2);
  // ExtrudeGeometry 没有 index，和 BoxGeometry 合不到一批（mergeGeometries 会报错）：
  // 先 weld 一遍拿到 index，尺寸/UV 不变。
  const topGeo = mergeVertices(topRaw);
  topRaw.dispose();
  const topMesh = new THREE.Mesh(topGeo, matPodiumWood);
  topMesh.position.set(PX, TOP - 0.05, PZ);
  topMesh.castShadow = false; topMesh.receiveShadow = true;
  G.add(topMesh);

  // ⑥ 后方搁板 + 两根白柱 + 中控/鹅颈麦/笔筒
  const SHX = PX - 0.19;
  for (const dz of [-0.42, 0.42]) {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.28, 10), matPodiumWhite);
    post.position.set(SHX, 1.03, PZ + dz);
    post.castShadow = false; post.receiveShadow = true;
    G.add(post);
  }
  box(G, 0.40, 0.035, 1.00, SHX, 1.177, PZ - 0.02, matPodiumWood, false);
  box(G, 0.30, 0.055, 0.22, SHX, 1.224, PZ + 0.08, matPcPlastic, false);   // 中控台
  for (let i = 0; i < 3; i++) {
    box(G, 0.030, 0.010, 0.026, SHX - 0.09 + i * 0.09, 1.257, PZ + 0.08, matScreenW, false);
  }
  box(G, 0.16, 0.045, 0.11, SHX + 0.02, 1.215, PZ + 0.36, matChairBlue, false); // 笔盒
  for (let i = 0; i < 3; i++) {
    const pen = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.13, 6), matScreenW);
    pen.rotation.x = Math.PI / 2;
    pen.position.set(SHX + 0.02 + (i - 1) * 0.035, 1.23, PZ + 0.36);
    G.add(pen);
  }
  const micB = new THREE.Mesh(new THREE.CylinderGeometry(0.030, 0.040, 0.025, 12), matPcPlastic);
  micB.position.set(SHX + 0.08, 1.21, PZ - 0.26); G.add(micB);
  const micN = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.26, 6), matPcPlastic);
  micN.position.set(SHX + 0.08, 1.34, PZ - 0.26); micN.rotation.x = 0.18; G.add(micN);
  const micH = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 6), matPcPlastic);
  micH.position.set(SHX + 0.08, 1.47, PZ - 0.28); G.add(micH);

  // ⑦ 电脑：和伪装体同一台（pDeskPC），屏幕朝学生
  const pc = pDeskPC(PX + 0.04, TOP, PZ + 0.02, Math.PI / 2, matPcScreen, G);
  pc.name = name + 'PC';

  // ⑧ 桌面上的黑/蓝两根线（照片里最显眼的两根）
  const cable = (pts, r, mat) => {
    const curve = new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(p[0], p[1], p[2])));
    const m = new THREE.Mesh(new THREE.TubeGeometry(curve, 20, r, 5, false), mat);
    m.castShadow = false; m.receiveShadow = true;
    G.add(m);
  };
  cable([[PX + 0.02, TOP + 0.01, PZ + 0.20], [PX + 0.30, TOP + 0.005, PZ + 0.18],
    [PX + 0.36, 0.60, PZ + 0.14], [PX + 0.36, 0.14, PZ + 0.06],
    [PX + 0.28, 0.126, PZ - 0.08]], 0.006, matCableBlue);
  cable([[PX - 0.06, TOP + 0.01, PZ - 0.24], [PX - 0.18, 0.78, PZ - 0.38],
    [PX - 0.16, 0.30, PZ - 0.44], [PX - 0.08, 0.126, PZ - 0.50]], 0.005, matPcPlastic);

  // ⑨ 碰撞：按可见外形（台面 + 搁板），两段都从地面算起
  rect(PX - 0.41, PX + 0.41, PZ - 0.71, PZ + 0.71, TOP);
  rect(SHX - 0.20, SHX + 0.20, PZ - 0.52, PZ + 0.48, 1.195);
}

/* ── 大教室课桌椅（照 2026-10-25 那七张实拍重做）────────────────────
   桌子：浅黄绿台面 + 胶合板包边 + 浅木前挡板（带螺丝帽）+ 黑色钢 T 腿；
   椅子：蓝色塑壳靠背/翻起的座面 + 胶合板包边 + 黑钢侧架，和照片里
   “空教室、座面全部翻起”的状态一致。

   ⚠ 伪装体（main.js 的凳子和长条桌）**必须调用这两个 builder**：
     地图和伪装体是同一段代码长出来的，尺寸/材质/折角不会再分叉。 */
const matLectTop   = new THREE.MeshLambertMaterial({ color: 0xcfdca9 });
const matLectPly   = new THREE.MeshLambertMaterial({ map: makeWoodTexture(212, 188, 146) });
const matLectBlue  = new THREE.MeshLambertMaterial({ color: 0x4a87b3 });
const matLectSteel = new THREE.MeshLambertMaterial({ color: 0x24262a });
const matLectScrew = new THREE.MeshLambertMaterial({ color: 0x4c3a27 });
const matWinFrame  = new THREE.MeshLambertMaterial({ color: 0x4a3a2c });
const matWinSill   = new THREE.MeshLambertMaterial({ color: 0xe9e6dc });
const matStoneTop  = new THREE.MeshLambertMaterial({ color: 0x9d9a93 });
const matRadCab    = new THREE.MeshLambertMaterial({ color: 0xe6e1d4 });
const matRadDoor   = new THREE.MeshLambertMaterial({ color: 0xd7cab0 });
const matHeatPipe  = new THREE.MeshLambertMaterial({ color: 0x9ba0a3 });
const matWallWhite = new THREE.MeshLambertMaterial({ color: 0xf4f3ee });
const matSkirtBlk  = new THREE.MeshLambertMaterial({ color: 0x1d1f21 });
const matRailSteel = new THREE.MeshStandardMaterial({ color: 0xbfc4c7, roughness: 0.26, metalness: 0.82 });
const matLectCeil  = new THREE.MeshBasicMaterial({ map: makeCeilingTexture() });
METRIC_UV.set(matLectCeil, 0.6);
const matLectLight = new THREE.MeshBasicMaterial({ color: 0xf7f8f0, toneMapped: false });
// 落地空调上半截的浅灰缠枝花纹（照片里那台白柜子上的贴花）
const matAcFloral = new THREE.MeshLambertMaterial({ map: (() => {
  const S = 256, c = newCanvas(S), g = c.getContext('2d');
  g.fillStyle = '#f4f2ec'; g.fillRect(0, 0, S, S);
  g.strokeStyle = 'rgba(150,154,152,0.55)'; g.lineWidth = 3;
  for (let k = 0; k < 7; k++) {
    const cx = 26 + (k * 43) % 220, cy = 60 + (k * 67) % 150;
    g.beginPath();
    for (let a = 0; a < 5; a++) {
      const an = a / 5 * Math.PI * 2;
      g.ellipse(cx + Math.cos(an) * 15, cy + Math.sin(an) * 13, 9, 5, an, 0, Math.PI * 2);
    }
    g.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
})() });

/* 圆角板：宽沿 z、高沿 y、厚沿 x，几何中心在 (0,0,0)。
   靠背用上圆角 105 mm、下圆角 45 mm；照片里蓝色贴面和胶合板边差约 15 mm。 */
function lectPanelGeo(w, h, t, rTop, rBot) {
  const s = new THREE.Shape();
  const x0 = -w / 2, x1 = w / 2;
  s.moveTo(x0 + rBot, 0);
  s.lineTo(x1 - rBot, 0);
  s.quadraticCurveTo(x1, 0, x1, rBot);
  s.lineTo(x1, h - rTop);
  s.quadraticCurveTo(x1, h, x1 - rTop, h);
  s.lineTo(x0 + rTop, h);
  s.quadraticCurveTo(x0, h, x0, h - rTop);
  s.lineTo(x0, rBot);
  s.quadraticCurveTo(x0, 0, x0 + rBot, 0);
  const raw = new THREE.ExtrudeGeometry(s, { depth: t, bevelEnabled: false, curveSegments: 5 });
  raw.translate(0, 0, -t / 2);
  raw.rotateY(Math.PI / 2);
  raw.translate(0, -h / 2, 0);
  const geo = mergeVertices(raw);
  raw.dispose();
  return geo;
}
// 座面：先做成朝前的水平板，翻起时整组绕铰链转，铰链在靠背那侧（+x）
function lectSeatGeo(w, depth, t) {
  const g = lectPanelGeo(w, depth, t, 0.05, 0.05);
  g.rotateZ(Math.PI / 2);             // 高度 → −x（朝前）
  g.translate(-depth / 2, 0, 0);      // 后沿落在 x=0，前沿到 −depth
  return g;
}
/* 蓝色塑壳的贴面版：外形和圆角与 lectPanelGeo 一致，只去掉 4 mm 厚的侧壁。
   椅子外轮廓仍靠胶合板胎撑住，所以长宽厚不变；每块从 ~92 面降到 ~22 面。 */
function lectBlueFaceGeo(w, h, rTop, rBot, segments = 5) {
  const s = new THREE.Shape();
  const x0 = -w / 2, x1 = w / 2, y0 = -h / 2, y1 = h / 2;
  s.moveTo(x0 + rBot, y0);
  s.lineTo(x1 - rBot, y0);
  s.quadraticCurveTo(x1, y0, x1, y0 + rBot);
  s.lineTo(x1, y1 - rTop);
  s.quadraticCurveTo(x1, y1, x1 - rTop, y1);
  s.lineTo(x0 + rTop, y1);
  s.quadraticCurveTo(x0, y1, x0, y1 - rTop);
  s.lineTo(x0, y0 + rBot);
  s.quadraticCurveTo(x0, y0, x0 + rBot, y0);
  return new THREE.ShapeGeometry(s, segments);
}
function lectMesh(parent, geo, mat) {
  const m = new THREE.Mesh(geo, mat);
  m.castShadow = false;
  m.receiveShadow = true;
  parent.add(m);
  return m;
}

/* 一把蓝背椅：本地 −X 朝前（黑板），原点在椅子落地中心、y=0 是地面 */
function makeLectureChairModel() {
  const g = new THREE.Group();

  // ① 黑钢侧架（两侧 + 座铰 + 脚垫），合成一个 mesh
  const frame = [];
  const add = (geo, x, y, z, rx = 0, ry = 0, rz = 0) => frame.push({ g: geo, x, y, z, rx, ry, rz });
  for (const s of [-1, 1]) {
    const zz = s * 0.235;
    add(new THREE.BoxGeometry(0.045, 1.00, 0.045), 0.205, 0.50, zz);          // 靠背立柱
    add(new THREE.BoxGeometry(0.32, 0.035, 0.042), 0.045, 0.665, zz);         // 扶手
    add(new THREE.CylinderGeometry(0.021, 0.021, 0.042, 10), -0.125, 0.665, zz, Math.PI / 2);
    add(new THREE.BoxGeometry(0.042, 0.47, 0.042), 0.00, 0.225, zz, 0, 0, -0.40); // 前斜腿
    add(new THREE.BoxGeometry(0.28, 0.045, 0.075), 0.02, 0.0225, zz);         // 脚垫
    add(new THREE.CylinderGeometry(0.0375, 0.0375, 0.045, 10), -0.12, 0.0225, zz);
    add(new THREE.CylinderGeometry(0.0375, 0.0375, 0.045, 10), 0.16, 0.0225, zz);
    add(new THREE.BoxGeometry(0.07, 0.10, 0.05), 0.14, 0.39, zz);             // 座铰支座
  }
  add(new THREE.CylinderGeometry(0.017, 0.017, 0.50, 10), 0.15, 0.435, 0, Math.PI / 2);
  lectMesh(g, mergeParts(frame), matLectSteel);

  // ② 胶合板胎（靠背 + 翻起的座面）
  const ply = [];
  const BLUE_INSET = 0.012;
  const bw = 0.47, bh = 0.46, bt = 0.044;
  ply.push({ g: lectPanelGeo(bw, bh, bt, 0.105, 0.045), x: 0.195, y: 0.79, z: 0, rz: -0.10 });
  ply.push({ g: lectSeatGeo(0.45, 0.42, bt), x: 0.15, y: 0.435, z: 0, rz: -1.35 });
  lectMesh(g, mergeParts(ply), matLectPly);

  // ③ 正反两面的蓝色塑壳：贴面压到胶合板外沿，省掉每块 70 面的侧壁/壳厚
  const blueX = bt / 2 + 0.0005;
  const backBlue = new THREE.Group();
  backBlue.position.set(0.195, 0.79, 0);
  backBlue.rotation.z = -0.10;
  const backFace = lectBlueFaceGeo(bw - BLUE_INSET * 2, bh - BLUE_INSET * 2, 0.095, 0.04);
  backFace.rotateY(Math.PI / 2);
  const backOut = new THREE.Mesh(backFace, matLectBlue);
  backOut.position.x = blueX;
  backOut.receiveShadow = true;
  backBlue.add(backOut);
  const backIn = new THREE.Mesh(backFace, matLectBlue);
  backIn.position.x = -blueX;
  backIn.rotation.y = Math.PI;
  backIn.receiveShadow = true;
  backBlue.add(backIn);
  g.add(backBlue);

  const seatBlue = new THREE.Group();
  seatBlue.position.set(0.15, 0.435, 0);
  seatBlue.rotation.z = -1.35;
  const seatFace = lectBlueFaceGeo(0.45 - BLUE_INSET * 2, 0.42 - BLUE_INSET * 2, 0.05, 0.05);
  seatFace.rotateX(-Math.PI / 2);
  seatFace.rotateY(Math.PI / 2);
  const seatUp = new THREE.Mesh(seatFace, matLectBlue);
  seatUp.position.set(-0.21, blueX, 0);
  seatUp.receiveShadow = true;
  seatBlue.add(seatUp);
  const seatDown = new THREE.Mesh(seatFace, matLectBlue);
  seatDown.position.set(-0.21, -blueX, 0);
  seatDown.rotation.x = Math.PI;
  seatDown.receiveShadow = true;
  seatBlue.add(seatDown);
  g.add(seatBlue);

  // ④ 靠背外露的 4 颗螺丝帽
  const c0 = Math.cos(-0.10), s0 = Math.sin(-0.10);
  const faceX = blueX + 0.002;
  const screws = [];
  for (const sy of [-0.15, 0.15]) for (const sz of [-0.17, 0.17]) {
    screws.push({ g: new THREE.CylinderGeometry(0.008, 0.008, 0.006, 8),
      x: 0.195 + faceX * c0, y: 0.79 + faceX * s0 + sy, z: sz,
      rz: Math.PI / 2 });
  }
  lectMesh(g, mergeParts(screws), matLectScrew);
  return g;
}

/* 一张 2.4 m 长条桌：本地 −X 是讲台（挡板）那面，原点在桌面投影中心 */
function makeLectureTableModel() {
  const g = new THREE.Group();
  const L = 2.40, TOPY = 0.745;

  lectMesh(g, new THREE.BoxGeometry(0.44, 0.032, L - 0.024), matLectTop)
    .position.set(0, TOPY, 0);
  const ply = [];
  const addPly = (geo, x, y, z) => ply.push({ g: geo, x, y, z });
  addPly(new THREE.BoxGeometry(0.012, 0.032, L), -0.226, TOPY, 0);
  addPly(new THREE.BoxGeometry(0.012, 0.032, L), 0.226, TOPY, 0);
  addPly(new THREE.BoxGeometry(0.464, 0.032, 0.012), 0, TOPY, -(L / 2 - 0.006));
  addPly(new THREE.BoxGeometry(0.464, 0.032, 0.012), 0, TOPY, L / 2 - 0.006);
  addPly(new THREE.BoxGeometry(0.018, 0.50, L - 0.056), -0.212, 0.47, 0);
  lectMesh(g, mergeParts(ply), matLectPly);

  const steel = [];
  const addS = (geo, x, y, z) => steel.push({ g: geo, x, y, z });
  addS(new THREE.BoxGeometry(0.035, 0.07, L - 0.10), 0.195, 0.675, 0);          // 后挡沿
  for (const z of [-(L / 2 - 0.10), 0, L / 2 - 0.10]) {
    addS(new THREE.BoxGeometry(0.06, 0.72, 0.05), 0.01, 0.36, z);
    addS(new THREE.BoxGeometry(0.36, 0.035, 0.05), 0.01, 0.705, z);
    addS(new THREE.BoxGeometry(0.30, 0.045, 0.09), 0.01, 0.0225, z);
    addS(new THREE.CylinderGeometry(0.045, 0.045, 0.045, 10), -0.14, 0.0225, z);
    addS(new THREE.CylinderGeometry(0.045, 0.045, 0.045, 10), 0.16, 0.0225, z);
  }
  lectMesh(g, mergeParts(steel), matLectSteel);

  const screws = [];
  for (const z of [-1.08, 0.0, 1.08]) for (const y of [0.665, 0.275]) {
    screws.push({ g: new THREE.CylinderGeometry(0.011, 0.011, 0.006, 8),
      x: -0.222, y, z, rz: Math.PI / 2 });
  }
  lectMesh(g, mergeParts(screws), matLectScrew);
  return g;
}


/* =========================================================================
   第五间教室 E：照片里那间「3 列 × 8 排」长条桌阶梯教室（现按疏密改成 2 列 × 5 排，
   中间一列整列留空给躲藏者变身）
   -------------------------------------------------------------------------
   朝向（他连着纠正了两次，这次按"坐在椅子上"的体感来定）：
     黑板在西墙(x0)，学生坐下脸朝 −X；走廊在北边 ⇒ 学生的**右手边**就是走廊，
     门开在北墙(z0)靠西那一头(x 10.9~12.9)，正好在讲台(西墙偏南一侧)的右边。
     一整排窗 + 蓝窗帘 + 窗下暖气片在南墙(z1) = 学生的左手边，和照片对得上。

   ⚠ 这里的"左右"只能按学生视角算，不能按坐标大小：
     脸朝 −X 时右手 = −Z。上一版黑板在北墙、脸朝 −Z，门放在 +X 那头，
     从座位看走廊是在**正前方**而不是右手边 —— 那就是他说的"方向错了"。

   ⚠ 门在哪面墙，决定了排/列沿哪个轴：门只能在贴走廊那面墙，而它要是"右手边"，
     黑板墙就必须和走廊垂直 ⇒ 排沿 x 递进、3 列沿 z 排开。
     桌子、椅子、抽屉、挡腿板、窗、暖气片、吊扇、灯全部跟着换轴，不是挪个门就行。

   尺寸是倒推的（房间 13 m 沿走廊 × 10.8 m）：
     x：前区 4.00(黑板+讲台+过道，到首排桌心) + 4 × 排距 1.45 + 椅背到后墙 2.40 ≈ 13
     z：两侧各 1 组 2.4 m 长桌 + 中央 3.12 m 走道 = 7.92；北 1.24 / 南 1.64 = 10.8
   排数按进深缩放（小教室现在也是前后两排），桌椅不再贴着前一排。
   ⚠ 走道宽度不是审美问题：PLAYER_RADIUS = 0.32 ⇒ 净宽低于 0.64 人就是走不过去。
     上一版列间 0.55、排间 0.47、靠墙 0.61，三条全堵死，所以他站在讲台区动不了。
   ========================================================================= */
function buildLectureHall([x0, x1, z0, z1]) {
  const cc = (z0 + z1) / 2;
  // FRONT/BACK 是 x 方向（排沿 x 递进）；z 方向是"横排"，门在 z0 那面
  const FRONT = x0, BACK = x1;
  const ROWS = 5, PITCH = 1.45, FZ = 4.00;   // PITCH：排距（桌深 0.46 + 座椅/过腿 0.99）
  const SKIN = WALL_T / 2 + 0.012;

  // ── 黑板墙（西墙）：绿板 + 铝框 + 粉笔槽，整体偏南，把北边留给门和动线 ──
  const BW = 5.40, BZ = cc + 0.90, SZ = cc - 0.30, PZ = cc - 2.85;
  box(world, 0.05, 1.30, BW, FRONT + 0.075, 1.62, BZ, matBoardH, false);
  box(world, 0.09, 0.06, BW + 0.12, FRONT + 0.06, 2.30, BZ, matAlu, false);
  box(world, 0.09, 0.06, BW + 0.12, FRONT + 0.06, 0.94, BZ, matAlu, false);
  box(world, 0.09, 1.42, 0.06, FRONT + 0.06, 1.62, BZ - BW / 2 - 0.03, matAlu, false);
  box(world, 0.09, 1.42, 0.06, FRONT + 0.06, 1.62, BZ + BW / 2 + 0.03, matAlu, false);
  box(world, 0.16, 0.05, BW + 0.12, FRONT + 0.10, 0.88, BZ, matAlu, false);      // 粉笔槽

  // 黑板北侧（照片里靠门那侧）：白板 + 一排挂钩 + 一张 A4 通知
  const WBZ = cc - 2.65;
  box(world, 0.05, 0.94, 1.10, FRONT + 0.08, 1.74, WBZ, matAlu, false);
  box(world, 0.03, 0.82, 0.98, FRONT + 0.10, 1.74, WBZ, matScreenW, false);
  box(world, 0.11, 0.035, 0.98, FRONT + 0.12, 1.28, WBZ, matAlu, false);         // 白板笔槽
  const slip = new THREE.Mesh(new THREE.PlaneGeometry(0.30, 0.40), matScreenW);
  slip.rotation.y = Math.PI / 2;
  slip.position.set(FRONT + 0.116, 1.78, WBZ - 0.30);
  world.add(slip);
  for (let i = 0; i < 4; i++) {
    box(world, 0.04, 0.04, 0.04, FRONT + 0.10, 1.62, cc - 3.55 + i * 0.22, matDeskLeg, false);
    box(world, 0.025, 0.10, 0.025, FRONT + 0.09, 1.57, cc - 3.55 + i * 0.22, matDeskLeg, false);
  }

  // 投影幕布：照片里是收起的 —— 只留浅色卷筒，不再挂一块白布挡住黑板
  box(world, 0.14, 0.12, 3.00, FRONT + 0.18, ROOM_H - 0.20, SZ, matScreenW, false);
  box(world, 0.15, 0.14, 0.10, FRONT + 0.18, ROOM_H - 0.20, SZ - 1.52, matDeskLeg, false);
  box(world, 0.15, 0.14, 0.10, FRONT + 0.18, ROOM_H - 0.20, SZ + 1.52, matDeskLeg, false);

  // 多媒体讲台（照片还原）：台阶 + 白色冲孔柜 + 浅木台面 + 搁板 + 电脑
  // 照片里讲台在靠前门那一头（北侧），不是窗户那头 —— 整组镜像过去。
  buildMultimediaPodium({
    name: 'lecturePodium', wallX: FRONT, dir: 1,
    deskZ: PZ, platformCenterZ: cc - 0.90, platformLen: BW + 0.30,
  });

  // ── 学生区：每 4 把椅子配一张 2.4 m 长桌，三组之间留 0.36 m 空隙，5 排 ──
  // 照片里是"四椅一桌"独立成组，不是一条 7.2 m 的通桌。组间空隙比人窄，
  // 只做视觉分隔，不当作能穿过去的走道；整排略向北偏 0.20 m，
  // 给窗下暖气罩和不锈钢栏杆那头多留一点落脚。
  // 5 排放到 13 m 进深，排距 1.45 m（与小教室一致），
  // 椅背到下一排桌沿留出约 0.39 m，不再像 8 排时那样贴成一串。
  // 不再整组连桌子带椅子一起拆：
  //   · 5 个位置只拆桌，4 把椅子原样留在原地；
  //   · 另外 7 个位置各拆 2 把椅子（留桌），2 个位置各拆 1 把；
  //   · 1 个位置（弹药桌）一把不动。
  // 位置是写死的散点：主客各自加载地图，必须看到同一组缺口。
  const NO_TABLE = new Set(['0,1', '1,2', '2,0', '2,1', '4,2']);
  const NO_CHAIR = {
    '0,0': [0, 1], '0,2': [2, 3],
    '1,0': [2, 3], '1,1': [0, 1],
    '2,2': [1, 2],
    '3,0': [0, 1], '3,1': [2, 3],
    '4,0': [1], '4,1': [2],
  };
  function placeTable(x, z, withAmmo) {
    const G = makeLectureTableModel();
    G.position.set(x, 0, z);
    world.add(G);
    deskRects.push({ minX: x - 0.26, maxX: x + 0.26, minZ: z - 1.20, maxZ: z + 1.20, top: 0.77 });
    if (withAmmo) {
      // 抽屉盒是照"面板朝 +Z"建的（buildDrawerBox 里往 −Z 伸），所以整组转 +90°：
      // 面板改朝 +X（学生那侧）、盒身往 −X 缩进桌子里；滑出方向另用 axis:'x' 指过去。
      makeAmmoUnit([{ x: 0, y: 0.60, z: 0, w: 1.50, h: 0.15, depth: 0.36,
                      mat: matLectSteel, face: matLectPly }],
        { x: x + 0.21, z, baseX: x + 0.21, baseZ: z, rotY: Math.PI / 2,
          slide: 0.26, axis: 'x', name: '教室E长条桌', giveRifle: 80, giveShell: 12 });
    }
  }
  function placeChair(cx, cz, top = 0.95) {
    const G = makeLectureChairModel();
    G.position.set(cx, 0, cz);
    world.add(G);
    /* 椅子背到 1.03 m，座面是翻起的，因此碰撞顶面按椅背/翻起座面的上沿给
       0.95 m：跳不上椅子，但能先从走道跳上 0.77 m 的桌面再跨过去。 */
    chairRects.push({ minX: cx - 0.30, maxX: cx + 0.30, minZ: cz - 0.28, maxZ: cz + 0.28, top });
  }

  const GAP = 0.36, GROUP_PITCH = 2.40 + GAP, ROW_Z = cc - 0.20;
  const COLS = [ROW_Z - GROUP_PITCH, ROW_Z, ROW_Z + GROUP_PITCH];
  for (let r = 0; r < ROWS; r++) {
    const x = FRONT + FZ + r * PITCH;
    for (let c = 0; c < 3; c++) {
      const key = r + ',' + c;
      const z = COLS[c];
      // 弹药点：第 2 排西侧、倒数第 2 排东侧各一个，仍然一前一后。
      if (!NO_TABLE.has(key)) {
        placeTable(x, z, (c === 0 && r === 1) || (c === 2 && r === ROWS - 2));
      }
      const cut = NO_CHAIR[key] || [];
      for (let k = 0; k < 4; k++) {
        if (cut.includes(k)) continue;
        placeChair(x + 0.60, z - 0.90 + k * 0.60);
      }
    }
  }

  // 靠东墙的备用椅只在南头并排留 2 把，东墙中段空出来给躲藏者贴墙。
  for (let i = 2; i < 4; i++) placeChair(BACK - 0.36, cc + i * 0.60);

  // ── 南墙：四扇窗（深棕框）+ 石窗台 + 蓝窗帘 + 窗下暖气罩 ──────────
  const curtainGeo = new THREE.PlaneGeometry(0.17, 1.74);
  const winXs = [];
  for (let i = 0; i < 4; i++) winXs.push(BACK - 2.0 - i * 2.4);
  for (const x of winXs) {
    const zf = z1 - 0.060;
    box(world, 1.98, 0.08, 0.10, x, 2.44, zf, matWinFrame, false);
    box(world, 1.98, 0.08, 0.10, x, 0.78, zf, matWinFrame, false);
    for (const s of [-1, 1]) box(world, 0.07, 1.74, 0.10, x + s * 0.955, 1.61, zf, matWinFrame, false);
    box(world, 0.05, 1.66, 0.08, x, 1.61, zf - 0.005, matWinFrame, false);
    box(world, 1.86, 0.04, 0.07, x, 1.14, zf - 0.005, matWinFrame, false);
    box(world, 1.86, 1.58, 0.02, x, 1.60, z1 - 0.075, matGlassDay, false);
    box(world, 2.12, 0.06, 0.32, x, 0.745, z1 - 0.20, matWinSill, false);
    // 暖气罩：米色柜体 + 深灰石面 + 两扇门
    box(world, 2.16, 0.58, 0.54, x, 0.34, z1 - 0.33, matRadCab, false);
    box(world, 2.22, 0.055, 0.60, x, 0.655, z1 - 0.33, matStoneTop, false);
    for (const s of [-1, 1]) {
      box(world, 0.98, 0.42, 0.012, x + s * 0.53, 0.36, z1 - 0.605, matRadDoor, false);
      box(world, 0.028, 0.018, 0.026, x + s * 0.94, 0.40, z1 - 0.615, matAlu, false);
    }
    box(world, 2.18, 0.08, 0.56, x, 0.04, z1 - 0.33, matSkirtBlk, false);
    box(world, 2.20, 0.07, 0.14, x, 2.53, z1 - 0.22, matScreenW, false);
    for (const s of [-1, 1]) for (let k = 0; k < 4; k++) {
      const m = new THREE.Mesh(curtainGeo, matCurtainH);
      m.position.set(x + s * (0.78 + k * 0.12), 1.64, z1 - 0.255 - k * 0.02);
      m.rotation.y = Math.PI + s * (0.05 + k * 0.03);
      world.add(m);
    }
    deskRects.push({ minX: x - 1.09, maxX: x + 1.09, minZ: z1 - 0.62, maxZ: z1 - 0.02, top: 0.68 });
  }
  // 窗间那几段也接上，暖气罩看起来是一整条通长的矮柜（照片里就是这样）
  const wins = winXs.slice().sort((a, b) => a - b);
  for (let i = 0; i < wins.length - 1; i++) {
    const xa = wins[i] + 1.08, xb = wins[i + 1] - 1.08;
    if (xb - xa < 0.02) continue;
    const xc = (xa + xb) / 2, ww = xb - xa;
    box(world, ww, 0.58, 0.54, xc, 0.34, z1 - 0.33, matRadCab, false);
    box(world, ww, 0.055, 0.60, xc, 0.655, z1 - 0.33, matStoneTop, false);
    box(world, ww, 0.08, 0.56, xc, 0.04, z1 - 0.33, matSkirtBlk, false);
    deskRects.push({ minX: xa - 0.03, maxX: xb + 0.03, minZ: z1 - 0.62, maxZ: z1 - 0.02, top: 0.68 });
  }

  // 窗上方的白色壁挂空调（照片里窗楣上那台）
  pSplitAC(44.95, 2.72, z1 - 0.12, '-z');

  // 最靠前门那扇窗前的 304 不锈钢护栏（照片里正对第一排）
  {
    const railX0 = winXs[3] - 1.06, railX1 = winXs[3] + 1.06, railZ = z1 - 0.95;
    for (const rx of [railX0 + 0.05, railX1 - 0.05]) {
      const p = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.024, 0.98, 10), matRailSteel);
      p.position.set(rx, 0.49, railZ); world.add(p);
    }
    for (const yy of [0.95, 0.66, 0.37]) {
      const b = new THREE.Mesh(new THREE.CylinderGeometry(0.017, 0.017, 2.02, 10), matRailSteel);
      b.rotation.z = Math.PI / 2;
      b.position.set((railX0 + railX1) / 2, yy, railZ); world.add(b);
    }
    deskRects.push({ minX: railX0, maxX: railX1, minZ: railZ - 0.04, maxZ: railZ + 0.04, top: 0.98 });
  }

  // ── 东墙根：明装暖气管 + 铸铁暖气片 + 落地空调（照片里的白柜机）──
  {
    const radZ = cc - 1.30;
    for (let i = 0; i < 12; i++) {
      box(world, 0.14, 0.56, 0.045, BACK - 0.14, 0.42, radZ - 0.60 + i * 0.11, matIron, false);
    }
    box(world, 0.18, 0.05, 1.36, BACK - 0.14, 0.71, radZ, matIron, false);
    box(world, 0.18, 0.05, 1.36, BACK - 0.14, 0.16, radZ, matIron, false);
    deskRects.push({ minX: BACK - 0.24, maxX: BACK, minZ: radZ - 0.72, maxZ: radZ + 0.72, top: 0.74 });

    const hp = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, 6.6, 10), matHeatPipe);
    hp.rotation.x = Math.PI / 2;
    hp.position.set(BACK - 0.075, 0.92, cc + 2.1); world.add(hp);
    const vp = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, 2.9, 10), matHeatPipe);
    vp.position.set(BACK - 0.075, 1.50, cc - 1.9); world.add(vp);
    box(world, 0.05, 0.05, 0.14, BACK - 0.085, 0.66, radZ + 0.62, matHeatPipe, false);  // 阀门
    for (const zz of [cc - 1.0, cc + 1.5, cc + 4.2]) box(world, 0.05, 0.05, 0.06, BACK - 0.05, 0.93, zz, matAlu, false);

    const acx = BACK - 0.25, acz = z1 - 0.78;
    box(world, 0.34, 1.74, 0.54, acx, 0.90, acz, matWhitePlastic, false);
    box(world, 0.36, 0.05, 0.56, acx, 1.80, acz, matRadCab, false);
    box(world, 0.37, 0.06, 0.57, acx, 0.03, acz, matSkirtBlk, false);
    box(world, 0.012, 0.09, 0.46, acx - 0.172, 1.19, acz, matPcPlastic, false);
    const led = new THREE.Mesh(new THREE.CircleGeometry(0.012, 8), matAcLed);
    led.rotation.y = -Math.PI / 2;
    led.position.set(acx - 0.179, 1.19, acz + 0.16); world.add(led);
    for (let i = 0; i < 8; i++) {
      box(world, 0.012, 0.44, 0.012, acx - 0.172, 0.63, acz - 0.20 + i * 0.057, matRadDoor, false);
    }
    const acFloral = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.30), matAcFloral);
    acFloral.rotation.y = -Math.PI / 2;
    acFloral.position.set(acx - 0.174, 1.49, acz); world.add(acFloral);
    deskRects.push({ minX: acx - 0.20, maxX: BACK, minZ: acz - 0.29, maxZ: acz + 0.29, top: 1.81 });
  }

  // ── 墙裙：照片里大教室是白墙 + 黑踢脚 ───────────────────────────
  const skinX = (zw, face, xa, xb) => {
    if (xb - xa < 0.02) return;
    const zz = zw + face * SKIN;
    box(world, xb - xa, ROOM_H, 0.012, (xa + xb) / 2, ROOM_H / 2, zz, matWallWhite, false);
    box(world, xb - xa, 0.12, 0.024, (xa + xb) / 2, 0.06, zz + face * 0.007, matSkirtBlk, false);
  };
  const skinZ = (xw, face, za, zb) => {
    if (zb - za < 0.02) return;
    const xx = xw + face * SKIN;
    box(world, 0.012, ROOM_H, zb - za, xx, ROOM_H / 2, (za + zb) / 2, matWallWhite, false);
    box(world, 0.024, 0.12, zb - za, xx + face * 0.007, 0.06, (za + zb) / 2, matSkirtBlk, false);
  };
  skinX(z0, 1, x0, 39.94);
  skinX(z0, 1, 41.66, 48.04);
  skinX(z0, 1, 49.06, x1);
  skinZ(x0, 1, z0, z1);
  skinZ(x1, -1, z0, z1);
  skinX(z1, -1, x0, 39.18);
  skinX(z1, -1, 41.22, 41.58);
  skinX(z1, -1, 43.62, 43.98);
  skinX(z1, -1, 46.02, 46.38);
  skinX(z1, -1, 48.42, x1);
  // 窗顶到天花板那一段也是白墙（窗间墙已由上面的分段盖住）
  box(world, x1 - x0, ROOM_H - 2.50, 0.012, (x0 + x1) / 2, (ROOM_H + 2.50) / 2,
    z1 - SKIN, matWallWhite, false);

  // ── 墙面小件：音箱 / 投影机 / 开关 / 前门边的白立管 ──────────────
  const speaker = (x, z, toward) => {
    box(world, 0.18, 0.34, 0.13, x, 2.42, z, matScreenW, false);
    const gr = new THREE.Mesh(new THREE.PlaneGeometry(0.14, 0.28), matPcPlastic);
    gr.rotation.y = toward;
    gr.position.set(x + (toward > 0 ? 0.095 : -0.095), 2.42, z);
    world.add(gr);
  };
  speaker(FRONT + 0.14, cc + 2.5, Math.PI / 2);
  speaker(FRONT + 0.14, cc - 2.2, Math.PI / 2);
  speaker(BACK - 0.14, cc - 3.9, -Math.PI / 2);
  box(world, 0.06, 0.34, 0.06, FRONT + 1.95, ROOM_H - 0.20, cc + 2.55, matDeskLeg, false);
  box(world, 0.36, 0.14, 0.30, FRONT + 1.95, 2.63, cc + 2.55, matPcPlastic, false);
  const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.07, 12), matMetal);
  lens.rotation.z = Math.PI / 2;
  lens.position.set(FRONT + 1.76, 2.62, cc + 2.55); world.add(lens);
  for (let i = 0; i < 2; i++) box(world, 0.02, 0.12, 0.09, 41.90 + i * 0.12, 1.36, z0 + 0.085, matScreenW, false);
  const wp = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, ROOM_H, 10), matScreenW);
  wp.position.set(39.80, ROOM_H / 2, z0 + 0.09); world.add(wp);
  for (const yy of [0.9, 2.1]) box(world, 0.10, 0.04, 0.06, 39.80, yy, z0 + 0.13, matAlu, false);

  // 挂钟在后墙(x1)，盘面朝 −X（教休室同款，见 pWallClock）
  pWallClock(BACK - 0.10, 2.35, cc - 3.6, -Math.PI / 2, 0.95);

  // ── 天花：照片里是白矿棉板 + 一排排嵌入式格栅灯，不是灰顶 ─────────
  box(world, BACK - FRONT, 0.006, z1 - z0, (FRONT + BACK) / 2, ROOM_H - 0.010, cc, matLectCeil, false);
  for (let i = 0; i < 4; i++) for (const dz of [-2.4, 0, 2.4]) {
    const lx = FRONT + 2.2 + i * 3.0, lz = cc + dz;
    box(world, 1.28, 0.016, 0.68, lx, ROOM_H - 0.026, lz, matScreenW, false);
    box(world, 1.18, 0.006, 0.58, lx, ROOM_H - 0.036, lz, matLectLight, false);
  }
  for (let i = 0; i < 3; i++) for (const dz of [-2.55, 2.55]) {
    pCeilingFan(FRONT + 3.4 + i * 3.1, ROOM_H, cc + dz);
  }
}

buildLectureHall(CLS_E);

/* ── 实验室屏幕的两张贴图 ────────────────────────────────────────
   照片里那些显示器不是蓝屏桌面，是深蓝底 + 彩色进路线的站场图。
   256×160 够：一台显示器在屏幕里也就占十几个像素宽，再高只是白占显存。 */
function makeRailScreenTexture() {
  const W = 256, H = 160;
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d');
  g.fillStyle = '#0a1220'; g.fillRect(0, 0, W, H);
  g.fillStyle = '#16233a'; g.fillRect(0, 0, W, 13);            // 顶栏
  g.strokeStyle = '#1c2e4c'; g.lineWidth = 1;
  for (let y = 26; y < H - 8; y += 21) { g.beginPath(); g.moveTo(6, y); g.lineTo(W - 6, y); g.stroke(); }
  const cols = ['#4fd07a', '#ffd24a', '#ff6b57', '#5fb8ff', '#c58bff', '#7de3d0'];
  for (let k = 0; k < 8; k++) {                                 // 进路：折线 + 交叉
    const ya = 30 + Math.random() * (H - 58), yb = 30 + Math.random() * (H - 58);
    g.strokeStyle = cols[k % cols.length]; g.lineWidth = 1.5; g.globalAlpha = 0.82;
    g.beginPath(); g.moveTo(10, ya); g.lineTo(W * 0.46, yb); g.lineTo(W - 10, ya); g.stroke();
  }
  g.globalAlpha = 1;
  for (let k = 0; k < 6; k++) {                                 // 信号机
    g.fillStyle = k % 2 ? '#ff6b57' : '#4fd07a';
    g.fillRect(16 + k * 40, H - 16, 5, 5);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
// 同样全部共享 + 不走 PBR。新材质一种 = 多一个绘制批次，所以能蹭旧的就蹭：
// 主机/键盘/机柜蹭 matDeskLeg，柜体和空调面板蹭 matScreenW，窗蹭 matGlassDay。
const matBenchTop   = new THREE.MeshLambertMaterial({ color: 0xe7e1cf });
const matMeshChair  = new THREE.MeshLambertMaterial({ color: 0x8d939c });
const matRailScreen = new THREE.MeshBasicMaterial({ map: makeRailScreenTexture() });
const matModelGreen = new THREE.MeshLambertMaterial({ color: 0x53763c });
// 沙盘玻璃罩：唯一一张半透明。depthWrite 关掉，不然罩子会把里面的绿地小楼吃掉。
const matGlassPane  = new THREE.MeshBasicMaterial({
  color: 0xcfe4f0, transparent: true, opacity: 0.30, depthWrite: false,
});

/* =========================================================================
   实验室 F：走廊对面那间「轨道交通信号实验室」
   -------------------------------------------------------------------------
   照片里认得出的东西，一样一样对上（第三版，按他后面两条纠正改的）：
     · 最里侧一整面绿板，板前一块大显示屏，板上方挂钟 + 两只壁挂音箱
     · **一列**大实验台 × 6 排，一张 4.8 m 台坐 3 人，**每人单屏**，
       键盘 + 鼠标 + 桌底主机 + 台面一台掀开的笔记本，灰色网布椅
     · **右手边**东墙那一列：**两块同宽 4.0 m 的玻璃展示柜首尾接成一条** ——
       北段铁路沙盘 4.0 × 9.8（五条线路带双轨枕木 + 30 栋小楼 + 40 棵树 + 水面 +
       站台雨棚 + 一列四节车厢），南段城市沙盘 4.0 × 4.0 正方形（井字路网 + 16 个街区）
     · **左手边**西墙：五扇大窗，白天透光
     · 进门那面南墙：一整排白色金属储物柜（带门缝、把手、散热百叶）+ 东南角两台黑色机柜
     · 吊顶：矿棉板格子 + 24 块嵌入式平板灯（这屋不装吊扇）；空调是**三台休息室同款壁挂机**
   ⚠ 左右这条他改过两次：第二版我照 prompt 的"左侧沙盘"摆到西墙，他现场说"在右边"
     ⇒ **prompt 的方位和他当场说的话冲突时，以他当场说的为准**。
     第三版又指出两块沙盘不是"并排两列"而是"同一列、首尾相接"，铁路那段要缩短让位给方形城市。
   走道宽度照 E 那次的教训来：PLAYER_RADIUS 0.32 ⇒ 净宽一律给到 0.89 以上。
   ========================================================================= */
function buildSignalLab([x0, x1, z0, z1]) {
  const FRONT = z0, BACK = z1;              // FRONT=黑板那面（北）；BACK=贴走廊那面（南）
  // 学生脸朝 −Z ⇒ 右手边 = +X = 东墙 = 两块沙盘；左手边 = 西墙 = 窗。
  // 宽度账（净宽 12.92）：西道 0.96 + 实验台 4.80 + 东道 3.16 + 沙盘带 4.00
  // 两块沙盘**同宽 4.0、首尾接成一条**（铁路在北段、城市在南段），不是并排两列。
  // 沙盘要 6 m ⇒ 按他说的"删一列工位"，只剩一列台子。
  const BCX = x0 + 3.40, LEN = 4.80;                       // 唯一一列实验台
  const ST = [-1.60, 0, 1.60];                             // 台上 3 个工位，单屏
  const ROWS = 6, PITCH = 1.45, FZ = 4.05;
  const RW = 4.00, CW = 4.00;                              // 两块沙盘同宽
  const RX = x1 - RW / 2 - 0.06;                           // 同在一列：贴东墙那一条带
  const RZ0 = FRONT + 1.2, RZ1 = BACK - 5.6;               // 铁路沙盘：缩短后的长条
  const CZ0 = RZ1 + 0.40, CZ1 = CZ0 + CW;                  // 城市沙盘：两块之间留 0.4 m 缝

  // ── 最里侧：一整面绿板 + 板前大显示屏 + 挂钟 + 两只壁挂音箱 ──
  const BW = 8.00, BX = x0 + 6.50;
  box(world, BW, 1.30, 0.05, BX, 1.70, FRONT + 0.075, matBoardH, false);
  box(world, BW + 0.12, 0.06, 0.09, BX, 2.38, FRONT + 0.06, matAlu, false);
  box(world, BW + 0.12, 0.06, 0.09, BX, 1.02, FRONT + 0.06, matAlu, false);
  box(world, 0.06, 1.42, 0.09, BX - BW / 2 - 0.03, 1.70, FRONT + 0.06, matAlu, false);
  box(world, 0.06, 1.42, 0.09, BX + BW / 2 + 0.03, 1.70, FRONT + 0.06, matAlu, false);
  box(world, BW + 0.12, 0.05, 0.16, BX, 0.96, FRONT + 0.10, matAlu, false);
  const DX = BX - 1.60;
  box(world, 2.80, 1.58, 0.07, DX, 1.74, FRONT + 0.16, matDeskLeg, false);      // 大显示屏
  box(world, 2.64, 1.42, 0.02, DX, 1.74, FRONT + 0.21, matRailScreen, false);
  pWallClock(BX + 2.10, 2.66, FRONT + 0.06, 0, 1.05);     // 教休室同款挂钟，盘面朝 +z
  for (const sx of [x0 + 1.90, x1 - 1.90]) {
    box(world, 0.28, 0.38, 0.24, sx, 2.56, FRONT + 0.14, matDeskLeg, false);    // 壁挂音箱
  }

  // ── 演示台 + 讲桌（板前）──
  const DZ = FRONT + 0.95;
  box(world, 4.20, 0.05, 0.80, BX, 0.74, DZ, matBenchTop, false);
  for (const s of [-1, 1]) {
    box(world, 0.06, 0.74, 0.66, BX + s * (2.10 - 0.08), 0.37, DZ, matDeskLeg, false);
  }
  for (const dx of [-1.45, -0.35, 0.75]) pLabPc(BX + dx, 0.77, DZ - 0.18, 0);
  deskRects.push({ minX: BX - 2.1, maxX: BX + 2.1, minZ: DZ - 0.40, maxZ: DZ + 0.40, top: 0.77 });
  box(world, 0.72, 1.06, 0.52, x0 + 2.60, 0.53, FRONT + 1.05, matWoodDark, false);   // 讲桌
  deskRects.push({ minX: x0 + 2.24, maxX: x0 + 2.96, minZ: FRONT + 0.79, maxZ: FRONT + 1.31, top: 2.4 });

  // ── 工位：一张 4.8 m 台坐 3 人，每人一台显示器 ──────────────────
  // 每台都是和伪装体同一份 makePcUnit（底座/立柱/显示器/键盘），屏面也同款；
  // 站场图只留在板前那块大屏上，避免"电脑"形态在实验室里一眼穿帮。
  // 下面这 6 个工位不放显示器，椅子保留 —— 空座位比拆掉整台实验台自然。
  // 位置写死，主客两边必须看到同一组空位。
  const LAB_PC_CUT = new Set(['0,0', '0,2', '1,1', '2,0', '3,2', '5,1']);
  function workstation(sx, z, r, k) {
    if (!LAB_PC_CUT.has(r + ',' + k)) pLabPc(sx, 0.775, z - 0.16, 0);
    box(world, 0.46, 0.05, 0.44, sx, 0.44, z + 0.62, matMeshChair, false);          // 网布椅
    box(world, 0.44, 0.52, 0.06, sx, 0.74, z + 0.82, matMeshChair, false);
    box(world, 0.07, 0.40, 0.07, sx, 0.22, z + 0.62, matDeskLeg, false);
  }
  function labBench(x, z, len, withAmmo) {
    box(world, len, 0.05, 0.80, x, 0.74, z, matBenchTop, false);
    for (const s of [-1, 1]) {
      box(world, 0.06, 0.74, 0.70, x + s * (len / 2 - 0.08), 0.37, z, matDeskLeg, false);
    }
    box(world, len - 0.30, 0.04, 0.06, x, 0.20, z + 0.32, matDeskLeg, false);
    box(world, 0.16, 0.07, 0.11, x + len / 2 - 0.30, 0.80, z - 0.26, matScreenW, false);  // 插座盒
    for (const s of [-1, 1]) {
      box(world, 0.20, 0.42, 0.44, x + s * 1.10, 0.21, z + 0.10, matDeskLeg, false);      // 桌底主机
    }
    const lid = box(world, 0.34, 0.23, 0.012, x - len / 2 + 0.46, 0.88, z - 0.08, matDeskLeg, false);
    box(world, 0.34, 0.015, 0.24, x - len / 2 + 0.46, 0.775, z + 0.04, matDeskLeg, false); // 笔记本
    lid.rotation.x = -1.18;                 // 掀着。（mergeStatic 会把世界矩阵烘进几何，见 1092 行）
    deskRects.push({ minX: x - len / 2, maxX: x + len / 2, minZ: z - 0.40, maxZ: z + 0.40, top: 0.77 });
    if (withAmmo) {
      makeAmmoUnit([{ x, y: 0.60, z: z + 0.24, w: 1.10, h: 0.15, depth: 0.36,
                      mat: matDeskLeg, face: matBenchTop }],
        { x, z, slide: 0.26, name: '实验室F实验台', giveRifle: 80, giveShell: 12 });
    }
  }
  for (let r = 0; r < ROWS; r++) {
    const z = FRONT + FZ + r * PITCH;
    labBench(BCX, z, LEN, r === 1 || r === 4);
    for (let k = 0; k < ST.length; k++) {
      workstation(BCX + ST[k], z, r, k);
    }
  }

  // ── 展示柜公共件：底座（浅木）+ 绿地/地坪 + 玻璃罩 + 铝框 ─────────
  function modelCase(cx, cz, w, d, ground) {
    box(world, w, 0.85, d, cx, 0.425, cz, matBenchTop, false);
    box(world, w + 0.04, 0.10, d + 0.04, cx, 0.05, cz, matAlu, false);
    box(world, w - 0.06, 0.05, d - 0.06, cx, 0.875, cz, ground, false);
    box(world, w, 0.02, d, cx, 1.48, cz, matGlassPane, false);                 // 顶玻璃
    for (const s of [-1, 1]) {                                                 // 两端玻璃
      box(world, 0.02, 0.60, d, cx + s * (w / 2), 1.18, cz, matGlassPane, false);
    }
    box(world, 0.05, 0.05, d, cx + w / 2, 1.47, cz, matAlu, false);            // 铝框（朝室内那面）
    box(world, 0.05, 0.05, d, cx + w / 2, 0.90, cz, matAlu, false);
    box(world, 0.05, 0.05, w, cx, 1.47, cz + d / 2, matAlu, false);
    box(world, 0.05, 0.05, w, cx, 1.47, cz - d / 2, matAlu, false);
    box(world, 0.05, 0.60, 0.05, cx + w / 2, 1.18, cz + d / 2, matAlu, false);
    box(world, 0.05, 0.60, 0.05, cx + w / 2, 1.18, cz - d / 2, matAlu, false);
    deskRects.push({ minX: cx - w / 2, maxX: cx + w / 2, minZ: cz - d / 2, maxZ: cz + d / 2, top: 0.85 });
  }

  // ── 铁路沙盘（东墙那一列的北段，4.0 宽 × 9.8 长）──
  const RZC = (RZ0 + RZ1) / 2, RL = RZ1 - RZ0;
  modelCase(RX, RZC, RW, RL, matModelGreen);
  for (let i = 0; i < 5; i++) {                         // 五条线路：道砟 + 双轨 + 枕木
    const tx = RX - 1.50 + i * 0.75;
    box(world, 0.44, 0.02, RL - 0.30, tx, 0.905, RZC, matAlu, false);
    for (const s of [-1, 1]) box(world, 0.018, 0.02, RL - 0.30, tx + s * 0.115, 0.918, RZC, matIron, false);
    for (let k = 0; k < 26; k++) {
      box(world, 0.40, 0.012, 0.04, tx, 0.912, RZ0 + 0.25 + k * (RL - 0.50) / 25, matDeskLeg, false);
    }
  }
  for (let k = 0; k < 30; k++) {                        // 站房与小楼
    const bz = RZ0 + 0.35 + k * (RL - 0.7) / 29;
    const bx = RX + (((k * 5) % 5) - 2) * 0.72;
    const hh = 0.05 + ((k * 7) % 5) * 0.04;
    box(world, 0.18, hh, 0.26, bx, 0.90 + hh / 2, bz, k % 4 === 0 ? matAlu : matScreenW, false);
  }
  const treeGeo = new THREE.ConeGeometry(0.075, 0.20, 5);
  for (let k = 0; k < 40; k++) {
    const t = new THREE.Mesh(treeGeo, matModelGreen);
    t.castShadow = false; t.receiveShadow = true;       // 和 box() 一致，才能并进同一批
    t.position.set(RX + (k % 2 ? 1.78 : -1.78), 0.99, RZ0 + 0.4 + k * (RL - 0.8) / 39);
    world.add(t);
  }
  box(world, 1.10, 0.012, 2.40, RX - 1.10, 0.905, RZC + 1.8, matGlassDay, false);   // 水面
  box(world, 0.44, 0.06, 2.20, RX + 1.30, 0.93, RZC - 2.4, matScreenW, false);      // 站台
  box(world, 0.56, 0.10, 1.90, RX + 1.30, 1.14, RZC - 2.4, matAlu, false);          // 雨棚
  for (let k = 0; k < 4; k++) {                                                     // 一列四节车厢
    box(world, 0.20, 0.11, 0.44, RX - 0.75, 0.975, RZC - 1.0 + k * 0.50, matScreenW, false);
  }

  // ── 城市沙盘（接在铁路沙盘同一列的南头，4.0 × 4.0 正方形）──
  const CZC = (CZ0 + CZ1) / 2, CL = CZ1 - CZ0;
  modelCase(RX, CZC, CW, CL, matAlu);                  // 地坪是灰色的城市底板；RX=CX，同在一列
  for (let i = 0; i < 5; i++) {                         // 井字路网
    box(world, CW - 0.20, 0.015, 0.18, RX, 0.905, CZ0 + 0.40 + i * (CL - 0.80) / 4, matDeskLeg, false);
    box(world, 0.18, 0.015, CL - 0.20, RX - 1.50 + i * 0.75, 0.905, CZC, matDeskLeg, false);
  }
  for (let gx = 0; gx < 4; gx++) for (let gz = 0; gz < 4; gz++) {    // 十六个街区
    const bx = RX - 1.10 + gx * 0.73, bz = CZ0 + 0.72 + gz * 0.85;
    if ((gx + gz) % 3 === 0) {                                       // 隔几块做绿地
      box(world, 0.50, 0.02, 0.58, bx, 0.905, bz, matModelGreen, false);
      for (let k = 0; k < 3; k++) {
        const t = new THREE.Mesh(treeGeo, matModelGreen);
        t.castShadow = false; t.receiveShadow = true;
        t.position.set(bx - 0.16 + k * 0.16, 0.99, bz + ((k % 2) - 0.5) * 0.22);
        world.add(t);
      }
      continue;
    }
    for (let k = 0; k < 4; k++) {                                    // 每街区四栋，高低不齐
      const hh = 0.10 + ((gx * 3 + gz * 5 + k * 7) % 6) * 0.085;
      box(world, 0.20, hh, 0.22, bx - 0.13 + (k % 2) * 0.26, 0.90 + hh / 2,
        bz - 0.16 + Math.floor(k / 2) * 0.30, k % 3 === 0 ? matAlu : matScreenW, false);
    }
  }

  // ── 西墙（左手边）：五扇大窗，白天透光 ──
  for (let i = 0; i < 5; i++) {
    const z = FRONT + 1.8 + i * 3.0;
    box(world, 0.05, 1.70, 2.30, x0 + 0.07, 1.66, z, matGlassDay, false);
    for (const dz of [-1.20, 1.20]) box(world, 0.07, 1.86, 0.08, x0 + 0.07, 1.66, z + dz, matScreenW, false);
    box(world, 0.16, 0.06, 2.42, x0 + 0.10, 0.78, z, matScreenW, false);            // 宽窗台
    box(world, 0.07, 0.10, 2.42, x0 + 0.07, 2.62, z, matScreenW, false);
    box(world, 0.05, 0.90, 0.05, x0 + 0.07, 2.05, z, matScreenW, false);            // 中挺
  }

  // ── 南墙（进门那面）：一排**能打开、能藏人**的储物柜 + 东南角两台机柜 ──
  //   ⚠ 柜子的 x 必须避开门洞 12~14。第一版在门洞西侧补了一小段（11.25~13.60），
  //     正好把门砌死了 —— 走道测试"进门"那条从 6.5 只走到 2.69 才红出来。
  //   柜深 0.75（原来 0.46）：64 cm 直径的人站得进去；柜门用 E 键开，
  //   关着时柜门注册碰撞（top 2.4），一开就把 top 压到 0 放行。
  //   **顶板/底板只画不注册** —— 注册了人一进柜子就会被 groundAt 当成站在柜顶。
  const L_FRONT = BACK - 0.79, L_BACK = BACK - 0.04;
  {
    const LX0 = x0 + 4.10, LX1 = x1 - 3.40;
    const W = LX1 - LX0, BAYS = 4, bw = W / BAYS;
    const cz = (L_FRONT + L_BACK) / 2, D = L_BACK - L_FRONT;
    box(world, W, 1.85, 0.04, (LX0 + LX1) / 2, 0.925, L_BACK - 0.02, matScreenW, false);  // 背板
    box(world, W, 0.05, D, (LX0 + LX1) / 2, 1.88, cz, matAlu, false);                     // 顶
    box(world, W, 0.05, D, (LX0 + LX1) / 2, 0.025, cz, matAlu, false);                    // 底
    deskRects.push({ minX: LX0, maxX: LX1, minZ: L_BACK - 0.05, maxZ: L_BACK, top: 2.4 });
    for (let k = 0; k <= BAYS; k++) {
      const x = LX0 + k * bw;
      box(world, 0.04, 1.85, D, x, 0.925, cz, matScreenW, false);
      deskRects.push({ minX: x - 0.03, maxX: x + 0.03, minZ: L_FRONT + 0.02, maxZ: L_BACK, top: 2.4 });
    }
    for (let k = 0; k < BAYS; k++) {
      const xb = LX0 + k * bw, cx = xb + bw / 2;
      // 内衬板比门板暗一档：不然白门 + 白内壁，开门和关门在截图上分不出来
      box(world, bw - 0.10, 1.72, 0.02, cx, 0.94, L_BACK - 0.06, matDeskLeg, false);
      const unit = { x: cx, z: L_FRONT, open: false, cur: 0, hinges: [] };
      for (const s of [-1, 1]) {
        const hinge = new THREE.Group();
        hinge.position.set(cx + s * (bw / 2 - 0.02), 0, L_FRONT);
        scene.add(hinge);
        const lw = bw / 2 - 0.05;
        // ⚠ 门叶要朝格子中间伸（−s），不是朝外伸：朝外伸时每格正面反而全空着，
        //   碰撞盒却说"关着"——走道测试永远发现不了，只有截图能抓。
        box(hinge, lw, 1.78, 0.035, -s * lw / 2, 0.94, 0, matScreenW, false);
        box(hinge, 0.03, 0.16, 0.03, -s * (lw - 0.07), 1.02, 0.035, matDeskLeg, false); // 把手
        unit.hinges.push({ g: hinge, dir: -s });      // dir: 开门的旋转方向（朝室内 −Z 摆）
        // 二楼的同一格柜门也做出来（动态门不在整层克隆里，要单独建一份）
        const hinge2 = new THREE.Group();
        hinge2.position.set(cx + s * (bw / 2 - 0.02), ROOM_H, L_FRONT);
        scene.add(hinge2);
        box(hinge2, lw, 1.78, 0.035, -s * lw / 2, 0.94, 0, matScreenW, false);
        box(hinge2, 0.03, 0.16, 0.03, -s * (lw - 0.07), 1.02, 0.035, matDeskLeg, false);
        unit.hinges.push({ g: hinge2, dir: -s });
      }
      const rect = { minX: xb + 0.02, maxX: xb + bw - 0.02,
        minZ: L_FRONT - 0.04, maxZ: L_FRONT + 0.04, top: 2.4, no2f: true };
      deskRects.push(rect);
      unit.rect = rect;
      // 二楼那扇门的碰撞：base=3、top=5.4；开关时和一楼同步
      const rect2 = { minX: xb + 0.02, maxX: xb + bw - 0.02,
        minZ: L_FRONT - 0.04, maxZ: L_FRONT + 0.04, top: ROOM_H + 2.4, base: ROOM_H, no2f: true };
      deskRects.push(rect2);
      unit.rect2 = rect2;
      hideLockers.push(unit);
    }
  }
  for (let k = 0; k < 2; k++) {
    const rx = x1 - 2.50 + k * 0.75;
    const LCZ = BACK - 0.28;                    // 机柜那条带（储物柜已经换成能开门的款式）
    box(world, 0.66, 2.00, 0.88, rx, 1.00, LCZ, matDeskLeg, false);
    for (let s = 0; s < 7; s++) {
      box(world, 0.30, 0.05, 0.02, rx - 0.17, 0.35 + s * 0.22, LCZ - 0.45, matScreenW, false);
    }
    deskRects.push({ minX: rx - 0.33, maxX: rx + 0.33, minZ: LCZ - 0.44, maxZ: LCZ + 0.44, top: 2.4 });
  }

  // ── 门：南墙（走廊那面），扇叶往实验室里推开约 80° ──
  // 门同样由走廊那侧的 makeHallDoor('实验室门') 统一建，这里不再重复一份

  // ── 吊顶：矿棉板格子 + 嵌入式平板灯（方形风口已换成墙上的壁挂空调）──
  for (let i = 0; i <= 8; i++) {
    box(world, 0.03, 0.03, BACK - FRONT, x0 + 0.60 + i * 1.48, ROOM_H - 0.035, (FRONT + BACK) / 2, matScreenW, false);
  }
  for (let i = 0; i <= 11; i++) {
    box(world, x1 - x0 - 1.20, 0.03, 0.03, (x0 + x1) / 2, ROOM_H - 0.035, FRONT + 0.60 + i * 1.42, matScreenW, false);
  }
  for (let i = 0; i < 6; i++) for (const lx of [x0 + 1.30, BCX, x1 - 4.60, x1 - 1.50]) {
    box(world, 0.62, 0.04, 1.22, lx, ROOM_H - 0.05, FRONT + 1.5 + i * 2.85, matStrip, false);
  }
  // ── 空调：三台休息室同款壁挂机（贴走廊那面墙两台、沙盘那面一台）──
  pSplitAC((x0 + 4.10 + x1 - 3.40) / 2, 2.46, BACK - 0.16, '-z');   // 储物柜上方正中
  pSplitAC(x0 + 1.60, 2.46, BACK - 0.16, '-z');                     // 门西侧那截空墙
  pSplitAC(x1 - 0.16, 2.46, FRONT + 6.20, '-x');                    // 东墙（沙盘上方）
}
buildSignalLab(CLS_F);
window.__labPCs = () => labPcCount;

/* =========================================================================
   躲猫猫道具层
   -------------------------------------------------------------------------
   这张图以后要当躲猫猫地图，所以道具按**三种藏法**来摆，不是随便撒：
     ① 挡视线：高柜、货架、布帘、圆桶 —— 站后面就看不见
     ② 爬得上：纸箱堆、木托盘、长椅、设备箱 —— 注册了 top，groundAt 认它当台面，
                可以一级一级踩上去（纸箱堆三层 = 0.42 / 0.84 / 1.26）
     ③ 钻得进：开门的更衣柜 —— 背板 + 两块侧板给碰撞（top 2.4 = 挡人），
                **顶板只画不注册**，否则人站进柜子会被 groundAt 当成"站在柜顶"
                直接抬到 1.9 米。这是这类道具最容易踩的坑。
   布帘故意**不给碰撞**：能看穿不了、人能走过去，是躲猫猫里最便宜的一堵"软墙"。
   摆放纪律：一律贴墙或贴角落，主通道让开；摆完必须重跑四个走道测试
   （上一轮储物柜把实验室的门砌死，就是这么抓出来的）。
   ========================================================================= */
const matPropRed  = new THREE.MeshLambertMaterial({ color: 0xb02a22 });   // 灭火器 / 消防箱
const matPropCard = new THREE.MeshLambertMaterial({ color: 0xa8804f });   // 纸箱 / 木托盘 / 软木公告栏
const matPropSign = new THREE.MeshLambertMaterial({ color: 0xd8a41c });   // 警示黄
const matPropExit = new THREE.MeshBasicMaterial({ color: 0x2fd06a });     // 疏散指示：发光绿

const rect = (x, z, w, d, top) =>
  deskRects.push({ minX: x - w / 2, maxX: x + w / 2, minZ: z - d / 2, maxZ: z + d / 2, top });
// 圆柱类道具要和 box() 落到同一个批次里，必须手动对齐 castShadow / receiveShadow
function cyl(r1, r2, h, seg, mat, x, y, z, rot) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r1, r2, h, seg), mat);
  m.castShadow = false; m.receiveShadow = true;
  m.position.set(x, y, z);
  if (rot) m.rotation.set(rot[0] || 0, rot[1] || 0, rot[2] || 0);
  world.add(m);
  return m;
}
function cone(r, h, seg, mat, x, y, z) {
  const m = new THREE.Mesh(new THREE.ConeGeometry(r, h, seg), mat);
  m.castShadow = false; m.receiveShadow = true;
  m.position.set(x, y, z);
  world.add(m);
  return m;
}

// ── ① 灭火器（立地一只 + 墙上一只箱）────────────────────────────────
function pExt(x, z) {
  cyl(0.085, 0.085, 0.50, 10, matPropRed, x, 0.27, z);
  box(world, 0.07, 0.10, 0.06, x, 0.57, z, matDeskLeg, false);            // 压把
  box(world, 0.22, 0.02, 0.22, x, 0.01, z, matDeskLeg, false);            // 底座圈
  rect(x, z, 0.26, 0.26, 0.10);
}
function pExtBox(x, y, z, ax) {                                           // 嵌入式灭火器箱
  const w = ax ? 0.44 : 0.16, d = ax ? 0.16 : 0.44;
  box(world, w, 0.64, d, x, y, z, matPropRed, false);
  box(world, ax ? 0.34 : 0.02, 0.48, ax ? 0.02 : 0.34, x + (ax ? 0 : 0.08), y,
    z + (ax ? 0.08 : 0), matGlassDay, false);                              // 玻璃门
}
function pExitSign(x, y, z, ax) {                                         // 疏散指示（发光）
  box(world, ax ? 0.32 : 0.04, 0.13, ax ? 0.04 : 0.32, x, y, z, matPropExit, false);
  box(world, ax ? 0.10 : 0.02, 0.07, ax ? 0.02 : 0.10, x + (ax ? -0.08 : 0), y,
    z + (ax ? 0 : -0.08), matScreenW, false);                             // 小人
}
// ── ② 能踩上去的：纸箱堆 / 木托盘 / 设备箱 / 长椅 ───────────────────
function pBoxStack(x, z, n) {                                             // 一层一级台阶
  for (let k = 0; k < n; k++) {
    const s = 0.56 - k * 0.07;
    box(world, s, 0.42, s * 0.84, x + k * 0.05, 0.21 + k * 0.42, z - k * 0.04, matPropCard, false);
    box(world, s * 0.96, 0.02, 0.05, x + k * 0.05, 0.42 + k * 0.42, z - k * 0.04, matDeskLeg, false); // 封箱带
  }
  rect(x, z, 0.66, 0.60, n * 0.42);
}
function pPallet(x, z, ax) {
  const w = ax ? 1.20 : 0.82, d = ax ? 0.82 : 1.20;
  box(world, w, 0.09, d, x, 0.075, z, matPropCard, false);
  for (const s of [-1, 0, 1]) {
    box(world, ax ? 0.09 : w * 0.94, 0.06, ax ? d * 0.94 : 0.09,
      x + (ax ? s * w / 3 : 0), 0.03, z + (ax ? 0 : s * d / 3), matPropCard, false);
  }
  rect(x, z, w, d, 0.13);
}
function pCase(x, z, ax) {                                                 // 设备箱 / 航空箱
  const w = ax ? 1.00 : 0.60, d = ax ? 0.60 : 1.00;
  box(world, w, 0.52, d, x, 0.26, z, matDeskLeg, false);
  box(world, w * 0.96, 0.05, d * 0.96, x, 0.545, z, matAlu, false);
  for (const s of [-1, 1]) {
    box(world, ax ? 0.03 : 0.05, 0.10, ax ? 0.05 : 0.03, x + s * (w / 2 - 0.04), 0.40,
      z + (ax ? 0 : 0), matAlu, false);
  }
  box(world, ax ? 0.22 : 0.05, 0.05, ax ? 0.05 : 0.22, x, 0.575, z, matDeskLeg, false);   // 提手
  rect(x, z, w, d, 0.57);
}
function pBench(x, z, ax) {                                                // 长椅
  const w = ax ? 1.70 : 0.44, d = ax ? 0.44 : 1.70;
  box(world, w, 0.06, d, x, 0.44, z, matWoodDark, false);
  for (const s of [-1, 1]) {
    box(world, ax ? 0.06 : 0.40, 0.42, ax ? 0.40 : 0.06, x + s * (ax ? 0.72 : 0), 0.21,
      z + (ax ? 0 : s * 0.72), matDeskLeg, false);
  }
  box(world, w, 0.40, 0.05, x, 0.68, z + (ax ? -0.20 : 0), matWoodDark, false);
  rect(x, z, w + 0.06, d + 0.06, 0.48);
}
// ── ③ 挡视线的高物：货架 / 圆桶 / 更衣柜（可钻） / 布帘（不可挡人）───
function pShelf(x, z, ax) {
  const w = ax ? 1.80 : 0.50, d = ax ? 0.50 : 1.80;
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    box(world, 0.05, 1.75, 0.05, x + sx * (w / 2 - 0.04), 0.875, z + sz * (d / 2 - 0.04), matDeskLeg, false);
  }
  for (let k = 0; k < 4; k++) box(world, w, 0.04, d, x, 0.30 + k * 0.48, z, matAlu, false);
  for (let k = 0; k < 5; k++) {                                            // 架上的箱子：真挡视线
    box(world, ax ? 0.26 : 0.34, 0.24, ax ? 0.34 : 0.26,
      x + (ax ? -0.60 + k * 0.30 : 0), 0.44 + (k % 3) * 0.48, z + (ax ? 0 : -0.60 + k * 0.30),
      k % 2 ? matPropCard : matScreenW, false);
  }
  rect(x, z, w, d, 1.72);
}
function pBarrel(x, z, mat) {
  cyl(0.28, 0.28, 0.88, 12, mat || matPropRed, x, 0.44, z);
  box(world, 0.58, 0.03, 0.58, x, 0.30, z, matDeskLeg, false);
  box(world, 0.58, 0.03, 0.58, x, 0.60, z, matDeskLeg, false);
  rect(x, z, 0.58, 0.58, 0.88);
}
function pHideLocker(x, z, ax, backOnMinus) {
  /* 三面墙 + 顶。ax=true 时柜身沿 x 铺、开口朝 ±z；ax=false 沿 z 铺、开口朝 ±x。
     backOnMinus=true 表示背板在 − 那一侧（贴西墙 / 北墙时用），否则在 + 侧。
     顶板和内隔层**不注册碰撞** —— 注册了人进不去（会被当成柜顶抬高一米九）。 */
  const L = 1.00, D = 0.55, H = 1.90, bs = backOnMinus ? -1 : 1;
  box(world, ax ? L : 0.05, H, ax ? 0.05 : L, x + (ax ? 0 : bs * (D / 2 - 0.025)), H / 2,
    z + (ax ? -bs * (D / 2 - 0.025) : 0), matScreenW, false);
  for (const s of [-1, 1]) {
    box(world, ax ? 0.05 : D, H, ax ? D : 0.05,
      x + (ax ? s * (L / 2 - 0.025) : 0), H / 2, z + (ax ? 0 : s * (L / 2 - 0.025)), matScreenW, false);
  }
  box(world, ax ? L : D + 0.04, 0.05, ax ? D + 0.04 : L, x, H + 0.02, z, matAlu, false);      // 顶（无碰撞）
  box(world, ax ? L - 0.06 : D - 0.06, 0.04, ax ? D - 0.06 : L - 0.06, x, 1.30, z, matAlu, false); // 内隔层
  for (const s of [-1, 1]) box(world, 0.06, 0.06, 0.06, x + (ax ? s * L / 3 : 0), 0.03, z + (ax ? 0 : s * L / 3), matDeskLeg, false);
  // 只给背板和两块侧板注册，柜子里面留空
  if (ax) {
    rect(x, z - bs * (D / 2 - 0.025), L, 0.05, 2.4);
    rect(x - L / 2 + 0.025, z, 0.05, D, 2.4);
    rect(x + L / 2 - 0.025, z, 0.05, D, 2.4);
  } else {
    rect(x + bs * (D / 2 - 0.025), z, 0.05, L, 2.4);
    rect(x, z - L / 2 + 0.025, D, 0.05, 2.4);
    rect(x, z + L / 2 - 0.025, D, 0.05, 2.4);
  }
}
// ── 生活件：饮水机 / 垃圾桶 / 盆栽 / 清洁车 / 公告栏 / 圆桌 / 椅子堆 ──
function pCooler(x, z) {
  box(world, 0.34, 1.00, 0.34, x, 0.50, z, matScreenW, false);
  cyl(0.13, 0.15, 0.32, 10, matGlassDay, x, 1.18, z);                      // 桶装水
  box(world, 0.18, 0.12, 0.06, x, 0.70, z + 0.18, matDeskLeg, false);      // 出水口
  rect(x, z, 0.38, 0.38, 1.02);
}
/* 垃圾桶：教休室桌边那只的样式——深色塑料敞口桶（无盖、双面）+ 一圈口沿 + 桶里三团纸
   + 桶边掉出来两团。原来全楼用的是"一支铝圆柱 + 一道黑圈"，像烟灰柱。
   纸团用确定性的偏移（不用 random），两次截图才对得上。 */
function pBin(x, z, tip) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.13, 0.42, 14, 1, true), matBinBody);
  body.position.y = 0.21;
  body.castShadow = true;
  g.add(body);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.158, 0.010, 6, 18), matBinBody);
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 0.42;
  g.add(rim);
  // 桶里三团纸：倒着的桶要能看见纸撒出来
  for (const [dx, y, dz] of [[-0.02, 0.33, 0.03], [0.05, 0.30, -0.04], [-0.06, 0.28, -0.02]]) {
    const ball = new THREE.Mesh(new THREE.IcosahedronGeometry(0.035, 0), matPaperBall);
    ball.position.set(dx, y, dz);
    g.add(ball);
  }
  g.position.set(x, 0, z);
  if (tip) {                                   // 倒翻：绕 x 放平，桶口朝走廊里，纸撒一片
    g.rotation.x = -Math.PI / 2 + 0.12;
    g.position.y = 0.15;
    for (const [dx, dz] of [[0.30, 0.12], [0.42, -0.06], [0.36, 0.24], [0.55, 0.08]]) {
      const ball = new THREE.Mesh(new THREE.IcosahedronGeometry(0.032, 0), matPaperBall);
      ball.position.set(x + dx, 0.032, z + dz);
      world.add(ball);
    }
  } else {
    for (const [dx, dz] of [[0.18, 0.10], [0.24, -0.02]]) {
      const ball = new THREE.Mesh(new THREE.IcosahedronGeometry(0.032, 0), matPaperBall);
      ball.position.set(x + dx, 0.032, z + dz);
      world.add(ball);
    }
  }
  world.add(g);
  rect(x, z, 0.40, 0.40, tip ? 0.30 : 0.42);
}
function pPlant(x, z) {
  cyl(0.19, 0.15, 0.30, 10, matWoodDark, x, 0.15, z);
  cyl(0.20, 0.20, 0.03, 10, matPropCard, x, 0.31, z);                      // 土面
  cone(0.30, 0.72, 7, matModelGreen, x, 0.66, z);
  cone(0.22, 0.50, 7, matModelGreen, x + 0.10, 0.94, z - 0.06);
  rect(x, z, 0.44, 0.44, 0.33);
}
function pCleanCart(x, z) {
  box(world, 0.50, 0.42, 0.40, x, 0.42, z, matPropSign, false);
  box(world, 0.46, 0.30, 0.36, x, 0.15, z, matDeskLeg, false);             // 水桶
  box(world, 0.04, 1.05, 0.04, x + 0.24, 0.95, z, matAlu, false);          // 拖把杆
  box(world, 0.20, 0.05, 0.10, x + 0.24, 0.42, z, matScreenW, false);
  cone(0.16, 0.32, 4, matPropSign, x - 0.36, 0.16, z + 0.10);              // 小心地滑牌
  rect(x, z, 0.86, 0.46, 0.63);
}
function pNotice(x, y, z, ax) {
  const nw = 1.50, nh = 0.95, fw = 0.07;
  // 软木面 + 四条木框；原来拿一块更大的木箱直接盖住整面，远看就是一整块黑板
  box(world, ax ? nw : 0.06, nh, ax ? 0.06 : nw, x, y, z, matPropCard, false);
  if (ax) {
    box(world, nw + 2 * fw, fw, 0.09, x, y + nh / 2 + fw / 2, z, matWoodDark, false);
    box(world, nw + 2 * fw, fw, 0.09, x, y - nh / 2 - fw / 2, z, matWoodDark, false);
    box(world, fw, nh, 0.09, x - nw / 2 - fw / 2, y, z, matWoodDark, false);
    box(world, fw, nh, 0.09, x + nw / 2 + fw / 2, y, z, matWoodDark, false);
  } else {
    box(world, 0.09, fw, nw + 2 * fw, x, y + nh / 2 + fw / 2, z, matWoodDark, false);
    box(world, 0.09, fw, nw + 2 * fw, x, y - nh / 2 - fw / 2, z, matWoodDark, false);
    box(world, 0.09, nh, fw, x, y, z - nw / 2 - fw / 2, matWoodDark, false);
    box(world, 0.09, nh, fw, x, y, z + nw / 2 + fw / 2, matWoodDark, false);
  }
  const pf = ax ? (z > HALL_ZM ? -1 : 1) : 1;   // 南墙公告栏的纸要朝走廊（−z）
  for (let k = 0; k < 6; k++) {                                            // 贴的纸
    box(world, ax ? 0.24 : 0.01, 0.30, ax ? 0.01 : 0.24,
      x + (ax ? -0.54 + (k % 3) * 0.54 : 0.05), y + 0.22 - Math.floor(k / 3) * 0.44,
      z + (ax ? pf * 0.05 : -0.54 + (k % 3) * 0.54), matScreenW, false);
  }
}
function pRoundTable(x, z) {
  cyl(0.52, 0.52, 0.05, 14, matBenchTop, x, 0.72, z);
  cyl(0.06, 0.06, 0.70, 8, matDeskLeg, x, 0.36, z);
  cyl(0.30, 0.30, 0.04, 12, matDeskLeg, x, 0.02, z);
  rect(x, z, 1.04, 1.04, 0.75);
}
function pChairPile(x, z) {                                                // 摞起来的备用椅
  for (let k = 0; k < 3; k++) {
    box(world, 0.44, 0.05, 0.44, x, 0.44 + k * 0.30, z, matMeshChair, false);
    box(world, 0.42, 0.30, 0.05, x, 0.62 + k * 0.30, z - 0.20, matMeshChair, false);
    box(world, 0.06, 0.28, 0.06, x, 0.30 + k * 0.30, z, matDeskLeg, false);
  }
  rect(x, z, 0.52, 0.52, 1.06);
}

/* ── 桌面杂物：让房间"有人在用"的关键，全都不给碰撞 ─────────────────
   上一版被说"像专门乱摆的"，原因是我只往地上摆大件、台面全是空的。
   真实房间的阅读顺序是：先看到桌上有东西，再看到墙角堆着东西。
   这些放在 y=台面上，注册碰撞反而会让人在桌边被弹开，所以一律不注册。 */
const DESK_Y = 0.765;
/* 书摞：桌面上的书必须和伪装体同一摞，否则躲进书里一眼假。
   几何/颜色只留这一份，main.js 的 buildBookForm 也调这里。 */
const BOOK_STACK_COLS = [0x6c3b2a, 0x2f4a5c, 0x5a5130, 0x4a3040];
const matBookStack = BOOK_STACK_COLS.map((c) =>
  new THREE.MeshStandardMaterial({ color: c, roughness: 0.85 }));
function makeBookStack(parent = null) {
  const g = new THREE.Group();
  for (let i = 0; i < 4; i++) {
    box(g, 0.26 - i * 0.012, 0.035, 0.19, 0, 0.02 + i * 0.036, 0, matBookStack[i], false);
  }
  if (parent) parent.add(g);
  return g;
}
function pBooks(x, y, z, longAlongZ) {
  const g = makeBookStack();
  g.position.set(x, y, z);
  g.rotation.y = longAlongZ ? Math.PI / 2 : 0;
  world.add(g);
}
function pCup(x, y, z) {
  cyl(0.038, 0.030, 0.095, 8, matScreenW, x, y + 0.048, z);
  box(world, 0.022, 0.05, 0.022, x + 0.048, y + 0.055, z, matScreenW, false);
  box(world, 0.055, 0.008, 0.055, x, y + 0.004, z, matPropCard, false);     // 杯垫
}
function pPapers(x, y, z) {
  for (let k = 0; k < 3; k++) {
    const p = box(world, 0.21, 0.004, 0.29, x + k * 0.010, y + 0.002 + k * 0.004, z - k * 0.012, matScreenW, false);
    p.rotation.y = (k - 1) * 0.10;
  }
  box(world, 0.14, 0.006, 0.018, x + 0.03, y + 0.016, z + 0.09, matPropRed, false);      // 一支笔
  box(world, 0.05, 0.022, 0.05, x - 0.16, y + 0.011, z + 0.02, matPropSign, false);      // 便签座
}
function pStationery(x, y, z) {                       // 一台显示器旁的小组合
  box(world, 0.09, 0.06, 0.09, x, y + 0.03, z, matDeskLeg, false);          // 笔筒
  box(world, 0.13, 0.012, 0.05, x + 0.16, y + 0.006, z + 0.02, matAlu, false);          // 订书机
}
// 沿墙走线槽：让"墙根有东西"而不是空到地
function pCable(x, z, len, ax) {
  box(world, ax ? len : 0.07, 0.045, ax ? 0.07 : len, x, 0.115, z, matDeskLeg, false);
  for (let k = 0; k < Math.floor(len / 1.6); k++) {
    box(world, ax ? 0.05 : 0.09, 0.05, ax ? 0.09 : 0.05,
      x + (ax ? -len / 2 + 0.5 + k * 1.6 : 0), 0.115, z + (ax ? 0 : -len / 2 + 0.5 + k * 1.6), matAlu, false);
  }
}
function pPoster(x, y, z, ax) {                       // 墙上制度牌/宣传海报
  box(world, ax ? 0.52 : 0.02, 0.68, ax ? 0.02 : 0.52, x, y, z, matScreenW, false);
  box(world, ax ? 0.44 : 0.01, 0.14, ax ? 0.01 : 0.44, x, y + 0.24, z, matPropRed, false);
  for (let k = 0; k < 3; k++) {
    box(world, ax ? 0.40 : 0.01, 0.03, ax ? 0.01 : 0.40, x, y + 0.06 - k * 0.11, z, matDeskLeg, false);
  }
}

/* 照片 2 里那幅秋景画：程序化画一张 4:3 的河岸秋天，远看就是墙上挂的画。
   只画一遍、挂在走廊北墙，不做通用图片系统。 */
function makeLandscapeTexture() {
  const W = 512, H = 384, c = document.createElement('canvas');
  c.width = W; c.height = H;
  const g = c.getContext('2d');
  const sky = g.createLinearGradient(0, 0, 0, H * 0.62);
  sky.addColorStop(0, '#ccd4d2'); sky.addColorStop(0.6, '#e7d9b8'); sky.addColorStop(1, '#efe3c0');
  g.fillStyle = sky; g.fillRect(0, 0, W, H * 0.62);
  g.fillStyle = '#9aa189';
  g.beginPath();
  g.moveTo(0, H * 0.60);
  for (let x = 0; x <= W; x += 24) g.lineTo(x, H * 0.60 - 16 - Math.sin(x * 0.021) * 9 - (x % 96 === 0 ? 7 : 0));
  g.lineTo(W, H * 0.64); g.lineTo(0, H * 0.64); g.closePath(); g.fill();
  const wt = g.createLinearGradient(0, H * 0.62, 0, H);
  wt.addColorStop(0, '#b3bbb0'); wt.addColorStop(1, '#8d958a');
  g.fillStyle = wt; g.fillRect(0, H * 0.62, W, H * 0.38);
  const cols = ['#c98e36', '#a96d2d', '#dcaa4b', '#8f5f2a', '#bb7f30'];
  for (let i = 0; i < 14; i++) {
    const tx = 14 + i * 38, ty = H * 0.60 - (i % 4) * 9, r = 22 + (i % 5) * 8;
    g.fillStyle = '#5d4a33';
    g.fillRect(tx - 2, ty - r * 0.2, 4, r * 0.9);
    g.fillStyle = cols[i % cols.length];
    g.beginPath(); g.arc(tx, ty - r * 0.55, r * 0.62, 0, Math.PI * 2); g.fill();
    g.globalAlpha = 0.20;
    g.beginPath(); g.arc(tx, H * 0.74 + (i % 3) * 5, r * 0.5, 0, Math.PI * 2); g.fill();
    g.globalAlpha = 1;
  }
  // 近景探进画框的枝叶，压住天空和远树，像一幅实拍的秋景
  g.fillStyle = '#6e4e28';
  for (const [tx, ty, r] of [[18, 22, 26], [42, 34, 18], [W - 26, 20, 30], [W - 52, 38, 17]]) {
    g.beginPath(); g.arc(tx, ty, r, 0, Math.PI * 2); g.fill();
  }
  g.strokeStyle = 'rgba(244,240,228,0.32)';
  g.lineWidth = 2;
  for (let i = 0; i < 5; i++) {
    const y = H * 0.68 + i * 17;
    g.beginPath(); g.moveTo(W * 0.52 + (i % 2) * 20, y); g.lineTo(W * 0.52 + 120 + (i % 2) * 20, y); g.stroke();
  }
  g.fillStyle = '#c2b48f';
  g.beginPath();
  g.moveTo(W * 0.30, H); g.lineTo(W * 0.44, H * 0.72); g.lineTo(W * 0.58, H * 0.72); g.lineTo(W * 0.74, H);
  g.closePath(); g.fill();
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
let _matLandscape = null;
function pPainting(x, zw, face) {     // face=+1 挂在北墙（走廊在 +z 侧）
  if (!_matLandscape) _matLandscape = new THREE.MeshBasicMaterial({ map: makeLandscapeTexture() });
  const zc = zw + face * (WALL_T / 2 + 0.030);
  box(world, 1.22, 0.86, 0.06, x, 1.66, zc, matWoodDark, false);
  box(world, 1.08, 0.72, 0.02, x, 1.66, zc + face * 0.032, matScreenW, false);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(0.98, 0.62), _matLandscape);
  m.position.set(x, 1.66, zc + face * 0.044);
  m.rotation.y = face > 0 ? 0 : Math.PI;
  world.add(m);
}
function pWallPanel(x, zw, face) {    // 照片 2 里那块带屏的白色墙面面板
  const zc = zw + face * (WALL_T / 2 + 0.030);
  box(world, 0.36, 0.48, 0.05, x, 1.52, zc, matScreenW, false);
  box(world, 0.24, 0.28, 0.02, x, 1.54, zc + face * 0.030, matPcScreen, false);
  box(world, 0.06, 0.012, 0.012, x, 1.34, zc + face * 0.040, matPropRed, false);
}
function pCallPoint(x, zw, face) {    // 手动火灾报警按钮（照片 2 右墙那只红盒）
  const zc = zw + face * (WALL_T / 2 + 0.030);
  box(world, 0.20, 0.24, 0.045, x, 1.36, zc, matPropRed, false);
  box(world, 0.13, 0.13, 0.02, x, 1.36, zc + face * 0.028, matScreenW, false);
  const dot = new THREE.Mesh(new THREE.CircleGeometry(0.032, 12), matPropRed);
  dot.position.set(x, 1.36, zc + face * 0.040);
  dot.rotation.y = face > 0 ? 0 : Math.PI;
  world.add(dot);
}

/* ── 摆放 ────────────────────────────────────────────────────────────
   三条纪律（上一版没守，所以像道具展示）：
     ① 落地的大件一律贴墙或贴角，屋子中间只留通道和成组的休息位；
     ② 零碎的东西堆成**一个堆放角**，不要东一件西一件；
     ③ 台面必须有东西。
   坐标按"贴墙、让开主通道"挑，改完必须重跑 E:\tmp\walk-all.js（18 条）。 */

// 走廊只留"教学楼走廊本来就有"的东西：垃圾桶、灭火器箱、疏散指示、宣传牌、公告栏。
// ⚠ 垃圾桶一律贴"两扇门之间的实墙中段"，不许按"门洞 + 偏移"挂 —— 那样每只都站在门口。
// 走廊垃圾桶 4→2：南北墙各留一只，走廊两端墙根空出来给躲藏者贴墙。
pBin(17.00, HALL_Z1 - 0.40, false);
pBin(35.00, HALL_Z0 + 0.40, false);
// 挂件一律让开新教室门：YF302 后门 19.6~21.2、YF312 后门 18.8~20.4、
// YF310 后门 48.1~49.0，原来的 19.8/21.0/48.0 正好压在门上。
for (const x of [8.8, 17.8, 38.0]) pExtBox(x, 1.05, HALL_Z0 + 0.26, true);
for (const x of [21.8, 44.0]) pExtBox(x, 1.05, HALL_Z1 - 0.26, true);
for (const x of [-6.0, 4.6, 7.2, 12.4, 15.2, 20.4, 23.1, 26.2, 32.3, 44.4]) pExitSign(x, 2.72, HALL_Z0 + 0.14, true);
for (const x of [-6.0, 7.2, 12.4, 15.2, 20.4, 23.0, 26.3, 31.2, 41.4, 50.7]) pExitSign(x, 2.72, HALL_Z1 - 0.14, true);
for (const x of [8.8, 21.8, 36.5]) pPoster(x, 1.72, HALL_Z0 + 0.20, true);
for (const x of [-3.0, 13.0, 16.7, 47.0]) pPoster(x, 1.72, HALL_Z1 - 0.20, true);
pNotice(-6.0, 1.75, HALL_Z0 + 0.20, true); pNotice(2.4, 1.75, HALL_Z1 - 0.20, true);
pNotice(-1.20, 1.75, HALL_Z0 + 0.20, true);   // 旧教休室封门后的长墙，挂块公告栏
// 照片 2（办公室那一段）：北墙挂秋景画 + 带屏面板，斜对面的南墙上装手动报警按钮
pPainting(53.6, HALL_Z0, 1);
pWallPanel(56.5, HALL_Z0, 1);
pCallPoint(56.5, HALL_Z1, -1);

// ── 东头隔断：图上东半段（YF304~YF308 + 东南楼梯间）这次不建，用施工围挡封住 ──
{
  const X = HALL_X1 - 1.6, ZW = HALL_Z1 - HALL_Z0 - 0.10;
  box(world, 0.12, 1.90, ZW, X, 0.95, HALL_ZM, matScreenW, false);              // 围挡板
  for (const z of [HALL_Z0 + 0.70, HALL_ZM, HALL_Z1 - 0.70]) {
    box(world, 0.14, 0.24, 1.10, X, 1.42, z, matChairBlue, false);              // 蓝条
  }
  box(world, 0.22, 0.10, ZW + 0.10, X, 1.97, HALL_ZM, matAlu, false);           // 压顶
  rect(X, HALL_ZM, 0.30, ZW, 1.95);
  pBoxStack(X - 0.60, 3.30, 3); pPallet(X - 0.55, 4.60, false);
  pBarrel(X - 0.60, 5.90, matAlu); pCleanCart(X - 0.70, 6.35);
  const pg = new THREE.Group();
  pg.position.set(X - 0.10, 1.55, HALL_ZM);
  pg.rotation.y = -Math.PI / 2;                                                 // 牌子朝西（对着来路）
  world.add(pg);
  box(pg, 1.90, 0.34, 0.02, 0, 0, 0, matDeskLeg, false);
  const pm = new THREE.Mesh(new THREE.PlaneGeometry(1.80, 0.28), makePlateMat('东半段施工 · 请从楼梯间疏散'));
  pm.position.set(0, 0, 0.02);
  pg.add(pm);
}

// ---- 各间的门：大房间装蓝门扇，小间/服务间只留门框（留给"玩家变成门"）----
function makeHallFrame(d0, d1, north) {
  const zw = north ? HALL_Z0 : HALL_Z1, fo = north ? 0.02 : -0.02;
  const w = d1 - d0, dx = (d0 + d1) / 2;
  box(world, 0.10, ROOM_H, 0.10, d0 - 0.03, ROOM_H / 2, zw + fo, matDoorFrame, false);
  box(world, 0.10, ROOM_H, 0.10, d1 + 0.03, ROOM_H / 2, zw + fo, matDoorFrame, false);
  box(world, w + 0.20, 0.10, 0.10, dx, ROOM_H - 0.05, zw + fo, matDoorFrame, false);
  box(world, w, ROOM_H - 2.12, WALL_T, dx, (ROOM_H + 2.12) / 2, zw + fo, matWall, false);   // 门楣
}

/* ══════════════════════════════════════════════════════════════════════
   2026-10-25 两张实拍门
   ① 强电间：暖色竖向木纹单扇门 + 同色木门套 + 红底白字“强电间”牌
      + 银色执手/上方锁芯 + 右侧合页（照片 173a9ea8...）。
   ② 教室：深咖啡色双扇门 + 每扇一块高位观察窗 + 门上玻璃亮子（中竖框）
      + 亮子下框中间金色房号牌 + 银色执手/锁 + 深色门套（照片 5d96cd24...）。
   门扇必须挂在 scene 上（world 会被 mergeStatic 合批、转不动）；1F/2F 两扇
   放进同一个组，绕同一根竖轴转。门套/亮子/门牌放 world，照常合批+克隆二楼。
   ══════════════════════════════════════════════════════════════════════ */
function makeDoorGrainTex(base, dark, light) {
  const S = 256, c = document.createElement('canvas');
  c.width = c.height = S;
  const g = c.getContext('2d');
  g.fillStyle = base; g.fillRect(0, 0, S, S);
  for (let i = 0; i < 150; i++) {
    const x0 = Math.random() * S;
    g.strokeStyle = `rgba(${dark},${0.02 + Math.random() * 0.06})`;
    g.lineWidth = 0.5 + Math.random() * 1.3;
    g.beginPath();
    for (let y = 0; y <= S; y += 12) {
      const x = x0 + Math.sin(y * 0.02 + i) * 1.2 + Math.sin(y * 0.07 + i * 1.7) * 0.5;
      if (y === 0) g.moveTo(x, y); else g.lineTo(x, y);
    }
    g.stroke();
  }
  for (let i = 0; i < 40; i++) {
    const x0 = Math.random() * S;
    g.strokeStyle = `rgba(${light},${0.015 + Math.random() * 0.03})`;
    g.lineWidth = 0.7 + Math.random() * 1.2;
    g.beginPath();
    for (let y = 0; y <= S; y += 14) {
      const x = x0 + Math.sin(y * 0.024 + i * 1.2) * 1.0;
      if (y === 0) g.moveTo(x, y); else g.lineTo(x, y);
    }
    g.stroke();
  }
  sprinkleNoise(g, S, 7);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  _aniso(t);
  return t;
}
const matPowerDoor  = new THREE.MeshStandardMaterial({
  map: makeDoorGrainTex('rgb(166,118,74)', '62,40,18', '212,166,114'), roughness: 0.58,
});
const matPowerFrame = new THREE.MeshStandardMaterial({ color: 0x6a4a2b, roughness: 0.66 });
const matClassLeaf  = new THREE.MeshStandardMaterial({
  map: makeDoorGrainTex('rgb(58,39,31)', '18,10,7', '96,66,52'), roughness: 0.6,
});
const matClassGlass = new THREE.MeshBasicMaterial({
  color: 0xcfe4ea, transparent: true, opacity: 0.16, side: THREE.DoubleSide, depthWrite: false,
});
const matClassFrost = new THREE.MeshBasicMaterial({
  color: 0xe4ecec, transparent: true, opacity: 0.7, side: THREE.DoubleSide, depthWrite: false,
});

function makeDoorCanvasMat(w, h, draw) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  _aniso(t);
  return new THREE.MeshBasicMaterial({ map: t });
}
// 强电间门牌：红底白框 + 闪电 + 白色“强电间”（照片同款横牌）
const matPowerSign = makeDoorCanvasMat(512, 336, (g, w, h) => {
  g.fillStyle = '#b3121a'; g.fillRect(0, 0, w, h);
  g.strokeStyle = '#f5f0e6'; g.lineWidth = 6; g.strokeRect(14, 14, w - 28, h - 28);
  g.fillStyle = '#f7f3ea';
  g.beginPath();
  g.moveTo(278, 38); g.lineTo(214, 120); g.lineTo(252, 120); g.lineTo(224, 185);
  g.lineTo(298, 92); g.lineTo(258, 92); g.closePath(); g.fill();
  g.fillRect(28, 206, w - 56, 5);
  g.font = 'bold 92px "Microsoft YaHei","SimHei",sans-serif';
  g.textAlign = 'center'; g.textBaseline = 'middle';
  '强电间'.split('').forEach((ch, i) => g.fillText(ch, w / 2 + (i - 1) * 150, 268));
});
// 教室门上亮子中间的金色房号牌（照片里是 302 那块）
const classNoMats = new Map();
function classNoMat(no) {
  if (!classNoMats.has(no)) classNoMats.set(no, makeDoorCanvasMat(256, 80, (g, w, h) => {
    g.fillStyle = '#b28f45'; g.fillRect(0, 0, w, h);
    g.strokeStyle = '#3a2a12'; g.lineWidth = 4; g.strokeRect(4, 4, w - 8, h - 8);
    g.fillStyle = '#241a0c'; g.font = 'bold 44px "Microsoft YaHei","SimHei",sans-serif';
    g.textAlign = 'center'; g.textBaseline = 'middle';
    const s = String(no), step = 56;
    s.split('').forEach((ch, i) => g.fillText(ch, w / 2 + (i - (s.length - 1) / 2) * step, h / 2 + 2));
  }));
  return classNoMats.get(no);
}

// 门扇四块板 + 一块玻璃，中间留出真孔（不是贴片）；同材质的四块合成一个 mesh
function leafPanelGeo(w, h, t, win) {
  const geos = [];
  const add = (bw, bh, x, y) => {
    const g = new THREE.BoxGeometry(Math.max(bw, 0.008), Math.max(bh, 0.008), t);
    g.translate(x, y, 0);
    geos.push(g);
  };
  add(w, win.y0, w / 2, win.y0 / 2);
  add(w, h - win.y1, w / 2, (h + win.y1) / 2);
  add(win.x0, win.y1 - win.y0, win.x0 / 2, (win.y0 + win.y1) / 2);
  add(w - win.x1, win.y1 - win.y0, (w + win.x1) / 2, (win.y0 + win.y1) / 2);
  const out = mergeGeometries(geos, false);
  for (const g of geos) g.dispose();
  return out;
}
function mergeParts(parts) {
  const geos = [];
  for (const p of parts) {
    p.g.applyMatrix4(new THREE.Matrix4().compose(
      new THREE.Vector3(p.x, p.y, p.z),
      new THREE.Quaternion().setFromEuler(new THREE.Euler(p.rx || 0, p.ry || 0, p.rz || 0)),
      new THREE.Vector3(1, 1, 1)));
    geos.push(p.g);
  }
  const out = mergeGeometries(geos, false);
  for (const g of geos) g.dispose();
  return out;
}
// 教室门扇五金：两侧合页；活动扇在门缝边加执手和下方锁芯（照片同侧）
function classLeafMetalGeo(lw, t, active) {
  const parts = [];
  const addBox = (w, h, d, x, y, z) => parts.push({ g: new THREE.BoxGeometry(w, h, d), x, y, z });
  const addCyl = (r, hh, x, y, z) => parts.push({
    g: new THREE.CylinderGeometry(r, r, hh, 12), x, y, z, rx: Math.PI / 2,
  });
  for (const y of [0.55, 1.55]) for (const s of [-1, 1]) {
    addBox(0.018, 0.10, 0.008, 0.012, y, s * (t / 2 + 0.004));
  }
  if (active) {
    const hx = lw - 0.10;
    for (const s of [-1, 1]) {
      addCyl(0.028, 0.012, hx, 1.01, s * (t / 2 + 0.007));
      addBox(0.13, 0.018, 0.018, hx - 0.055, 1.00, s * (t / 2 + 0.024));
      addCyl(0.017, 0.014, hx, 0.89, s * (t / 2 + 0.008));
    }
  }
  return mergeParts(parts);
}
// 一扇教室门叶：1F/2F 两份共用同一批几何，只在 y 上错开；同组一起转
function addClassLeaf(hingeX, hingeZ, lw, closedYaw, openYaw, frost, active) {
  const H = 2.06, T = 0.045;
  const g = new THREE.Group();
  g.position.set(hingeX, 0, hingeZ);
  g.rotation.y = closedYaw;
  scene.add(g);
  const win = { x0: (lw - 0.40) / 2, x1: (lw + 0.40) / 2, y0: 1.44, y1: 1.84 };
  const panel = new THREE.Mesh(leafPanelGeo(lw, H, T, win), matClassLeaf);
  panel.receiveShadow = true;
  g.add(panel);
  const glass = new THREE.Mesh(new THREE.PlaneGeometry(0.40, 0.40),
    frost ? matClassFrost : matClassGlass);
  glass.position.set(lw / 2, 1.64, 0);
  g.add(glass);
  const metal = new THREE.Mesh(classLeafMetalGeo(lw, T, active), matRestSteel);
  metal.receiveShadow = true;
  g.add(metal);
  const Y2 = ROOM_H + FLOOR2_LIFT;
  for (const m of [panel, glass, metal]) {
    const c = m.clone();
    c.position.y += Y2;
    g.add(c);
  }
  return { g, closedYaw, openYaw };
}
// 教室门套 + 玻璃亮子 + 白门楣（2.70~3.0）+ 门槛 + 两面金色房号牌
function addClassDoorStatic(d0, d1, zw, face, no) {
  const w = d1 - d0, cx = (d0 + d1) / 2;
  const JW = 0.09, JD = 0.09, iw = w - 2 * JW;
  const FH = 2.70, LH = 2.06;
  for (const x of [d0 + JW / 2, d1 - JW / 2]) {
    box(world, JW, FH, JD, x, FH / 2, zw, matRestFrame, false);
  }
  box(world, iw, 0.08, JD, cx, LH + 0.04, zw, matRestFrame, false);   // 亮子下框 2.06~2.14
  box(world, iw, 0.08, JD, cx, 2.66, zw, matRestFrame, false);        // 亮子上框 2.62~2.70
  box(world, 0.045, 0.48, JD, cx, 2.38, zw, matRestFrame, false);     // 中竖框
  const paneW = (iw - 0.045) / 2;
  for (const s of [-1, 1]) {
    const pane = new THREE.Mesh(new THREE.PlaneGeometry(paneW, 0.48), matClassGlass);
    pane.position.set(cx + s * (0.0225 + paneW / 2), 2.38, zw);
    world.add(pane);
  }
  box(world, w, ROOM_H - FH, WALL_T, cx, (ROOM_H + FH) / 2, zw, matWall, false);
  box(world, w + 0.04, 0.018, 0.22, cx, 0.009, zw, matBase, false);
  const nm = classNoMat(no);
  for (const s of [1, -1]) {                   // +1 走廊面，-1 教室面
    const zb = zw + face * s * (JD / 2);
    box(world, 0.26, 0.072, 0.008, cx, 2.10, zb + face * s * 0.003, matRestFrame, false);
    const p = new THREE.Mesh(new THREE.PlaneGeometry(0.24, 0.06), nm);
    p.position.set(cx, 2.10, zb + face * s * 0.012);
    p.rotation.y = (face * s > 0) ? 0 : Math.PI;
    world.add(p);
  }
}
function makeClassroomDoor(d0, d1, north, no, name, outward = false) {
  const zw = north ? HALL_Z0 : HALL_Z1;
  const face = north ? 1 : -1;                 // 走廊在墙的哪一侧
  const dir = outward ? face : -face;          // 开向：+1 往 +z，-1 往 -z
  const leafZ = zw + dir * (outward ? 0.13 : 0.075);
  addClassDoorStatic(d0, d1, zw, face, no);
  const w = d1 - d0, JW = 0.09, iw = w - 2 * JW;
  const dbl = iw >= 1.2;
  const lw = dbl ? (iw - 0.012) / 2 : iw - 0.012;
  const openL = dir > 0 ? -Math.PI / 2 : Math.PI / 2;
  const openR = dir > 0 ? Math.PI * 1.5 : Math.PI / 2;
  // 从走廊看：北侧门左扇是 d0，南侧门左扇是 d1；照片里左边那块是磨砂玻璃
  const leaves = [addClassLeaf(d0 + JW, leafZ, lw, 0, openL, north, !dbl)];
  if (dbl) leaves.push(addClassLeaf(d1 - JW, leafZ, lw, Math.PI, openR, !north, true));
  const minZ = dir > 0 ? zw + 0.01 : zw - 0.20;
  const maxZ = dir > 0 ? zw + 0.20 : zw - 0.01;
  const rect = { minX: d0, maxX: d1, minZ, maxZ, top: 2.4, no2f: true };
  const rect2 = { ...rect, top: ROOM_H + 2.4, base: ROOM_H };
  deskRects.push(rect, rect2);
  swingDoors.push({
    leaves, open: false, cur: 0, rect, rect2, name,
    cx: (d0 + d1) / 2, cz: zw,
  });
}
// 强电间单扇木门（暖色木纹 + 红牌 + 银色执手/上方锁芯 + 右侧合页）
function makePowerDoor(d0, d1, north) {
  const zw = north ? HALL_Z0 : HALL_Z1;
  const face = north ? 1 : -1;
  const w = d1 - d0, cx = (d0 + d1) / 2;
  const JW = 0.06, JD = 0.12, FH = 2.18;
  const iw = w - 2 * JW;
  for (const x of [d0 + JW / 2, d1 - JW / 2]) {
    box(world, JW, FH, JD, x, FH / 2, zw, matPowerFrame, false);
  }
  box(world, w, 0.08, JD, cx, FH + 0.04, zw, matPowerFrame, false);
  box(world, w, ROOM_H - (FH + 0.08), WALL_T, cx, (ROOM_H + FH + 0.08) / 2, zw, matWall, false);
  box(world, w + 0.04, 0.018, 0.22, cx, 0.009, zw, matBase, false);
  const lw = iw - 0.006, lh = 2.16;
  // 合页在东侧（从走廊看右边），门扇往房间里开
  const g = new THREE.Group();
  g.position.set(d1 - JW, 0, zw - 0.075);
  g.rotation.y = Math.PI;
  scene.add(g);
  const Y2 = ROOM_H + FLOOR2_LIFT;
  for (const y0 of [0, Y2]) {
    const leaf = new THREE.Mesh(new THREE.BoxGeometry(lw, lh, 0.05), matPowerDoor);
    leaf.position.set(lw / 2, y0 + lh / 2, 0);
    leaf.receiveShadow = true;
    g.add(leaf);
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(0.46, 0.30), matPowerSign);
    sign.position.set(lw / 2, y0 + 1.68, -0.028);
    sign.rotation.y = Math.PI;                 // 组本身转 180°，两块叠起来正对走廊
    g.add(sign);
    const parts = [];
    const addBox = (bw, bh, d, x, y, z) => parts.push({ g: new THREE.BoxGeometry(bw, bh, d), x, y: y0 + y, z });
    const addCyl = (r, hh, x, y, z) => parts.push({
      g: new THREE.CylinderGeometry(r, r, hh, 12), x, y: y0 + y, z, rx: Math.PI / 2,
    });
    const hx = lw - 0.12;
    for (const s of [-1, 1]) {
      addCyl(0.034, 0.014, hx, 1.00, s * 0.032);
      addBox(0.14, 0.018, 0.018, hx - 0.07, 1.00, s * 0.050);
      addCyl(0.030, 0.014, hx, 1.14, s * 0.032);
      addCyl(0.014, 0.020, hx, 1.14, s * 0.044);
      for (const hy of [0.55, 1.55]) addBox(0.016, 0.10, 0.008, 0.012, hy, s * 0.030);
    }
    const metal = new THREE.Mesh(mergeParts(parts), matRestSteel);
    metal.receiveShadow = true;
    g.add(metal);
  }
  const rect = { minX: d0, maxX: d1, minZ: zw - 0.20, maxZ: zw - 0.01, top: 2.4, no2f: true };
  const rect2 = { ...rect, top: ROOM_H + 2.4, base: ROOM_H };
  deskRects.push(rect, rect2);
  swingDoors.push({
    leaves: [{ g, closedYaw: Math.PI, openYaw: Math.PI / 2 }],
    open: false, cur: 0, rect, rect2, name: '强电间门', cx, cz: zw,
  });
}

makeClassroomDoor(DOOR_301[0], DOOR_301[1], true, '301', 'YF301门');
makeClassroomDoor(DOOR_301B[0], DOOR_301B[1], true, '301', 'YF301后门');
makeClassroomDoor(DOOR_302[0], DOOR_302[1], true, '302', 'YF302门');
makeClassroomDoor(DOOR_302B[0], DOOR_302B[1], true, '302', 'YF302后门');
makePowerDoor(DOOR_PD[0], DOOR_PD[1], true);                        // 强电间
// 楼梯间B 的门由 buildStairB 连同门套、门叶一起做（不再是空门框）
makeHallDoor(CLS_F_DOORS[0][0], CLS_F_DOORS[0][1], true, '实验室门');
makeClassroomDoor(DOOR_313[0], DOOR_313[1], false, '313', 'YF313门');
makeClassroomDoor(DOOR_313B[0], DOOR_313B[1], false, '313', 'YF313后门');
makeClassroomDoor(DOOR_312[0], DOOR_312[1], false, '312', 'YF312门');
makeClassroomDoor(DOOR_312B[0], DOOR_312B[1], false, '312', 'YF312后门');
// 卫生间：走廊上只有一个凹进门洞，门套/门扇/黑牌在下面 buildWcLobby() 统一做。
// 开水间是朝走廊敞开的（没有门扇，也没有门框），只留 30.9~32.8 的洞口
makeHallFrame(EL_OPEN[0], EL_OPEN[1], true);                       // 电梯厅敞口
makeClassroomDoor(CLS_E_DOORS[0][0], CLS_E_DOORS[0][1], false, '310', '大教室门', true);
makeClassroomDoor(CLS_E_DOORS[1][0], CLS_E_DOORS[1][1], false, '310', '大教室后门');
makeHallDoor(OFFICE_DOOR[0], OFFICE_DOOR[1], false, '办公室门');   // YF309

// ---- 门牌（照疏散图上的编号）----
// 教休室门口改成照片里的红底开放时间牌 + 门上的黄牌，不再挂亚克力门牌（见下面 buildRestCorridorProps）
roomPlate(13.40, 2.42, 'YF301', true);
roomPlate(16.20, 2.42, 'YF302', true);
roomPlate(24.00, 2.42, '配电室', true);
roomPlate(27.20, 2.49, '楼梯间', true);
roomPlate(33.30, 2.42, 'YF303 实验室', true);
roomPlate(12.60, 6.88, 'YF313', false);
roomPlate(15.40, 6.88, 'YF312', false);
roomPlate(30.45, 6.87, '开水间', false);           // 开水间北墙端头、门西侧
roomPlate(41.80, 6.87, 'YF310', false);            // 大教室前门东侧
roomPlate(58.80, 6.87, 'YF309 办公室', false);

/* =========================================================================
   教休室门外的凹进门厅：照片里的咖啡机 + 桶装水架 + 友宝智能货柜 + 暖气片
   -------------------------------------------------------------------------
   布局照他给的全景照片（站在门厅朝门看）：
     货柜靠东墙 → 水架 → 咖啡机（照片从左到右），
     门东侧：暖气片（上方红牌）→ 教休室双扇门 → 开水炉（照片右边缘圈出）。
   ⚠ 机器不再贴着和门同一面的走廊直墙：它们背贴**门厅东墙**（YF310 西墙，
     x=36.4），正脸朝西，和门形成 90° 拐角。
   三台机器仍按"背贴 z=2.46、脸朝 +z"的局部坐标建，建成后整组绕 y 转 −90°：
   局部 +z → 世界 −x（朝西），局部 +x → 世界 +z（南），局部墙 z=2.40 落在 x=36.36。
   全部登记成 tall deskRects（top = 实际高度），人穿不过去，也能被子弹挡；
   rect 在组变换后统一换算，不手写第二套坐标。
   ========================================================================= */
const matShopBlack   = new THREE.MeshLambertMaterial({ color: 0x1a1b1d });
const matShopCream   = new THREE.MeshLambertMaterial({ color: 0xf1efe7 });
const matShopWhite   = new THREE.MeshLambertMaterial({ color: 0xfaf8f2 });
const matShopRed     = new THREE.MeshLambertMaterial({ color: 0xa32229 });
const matShopShelf   = new THREE.MeshLambertMaterial({ color: 0xe6e3da });
const matShopGlass   = new THREE.MeshBasicMaterial({
  color: 0xdcecf6, transparent: true, opacity: 0.16, depthWrite: false,
});
const matShopInterior = new THREE.MeshBasicMaterial({ color: 0xfffdf3 });
const matShopLed      = new THREE.MeshBasicMaterial({ color: 0xffffff });
const matRadiator     = new THREE.MeshStandardMaterial({ color: 0xb9bcb6, roughness: 0.42, metalness: 0.5 });
const matWaterBottle  = new THREE.MeshStandardMaterial({ color: 0x2b5f9f, roughness: 0.4, metalness: 0.04 });
const matWaterCap     = new THREE.MeshLambertMaterial({ color: 0xa9c9e8 });
const matWaterLabel   = new THREE.MeshLambertMaterial({ color: 0xe8edf2 });
const matGoods = [0xd9a227, 0x4f8b3b, 0x2f66aa, 0xc23a2d, 0xe6d24a, 0xe9e5d8]
  .map((c) => new THREE.MeshLambertMaterial({ color: c }));

const matCoffeeFront = new THREE.MeshBasicMaterial({
  map: makeRestSignTex(384, 512, (g, w, h) => {
    const bg = g.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, '#b5262d'); bg.addColorStop(1, '#8f1b20');
    g.fillStyle = bg; g.fillRect(0, 0, w, h);
    g.fillStyle = '#ffffff'; g.textBaseline = 'middle';
    g.font = 'bold 40px "Microsoft YaHei","SimHei",sans-serif';
    g.textAlign = 'left';
    g.fillText('Coffee Joyer', 34, 76);
    g.font = 'italic bold 88px Georgia,"Times New Roman",serif';
    g.textAlign = 'center';
    g.fillText('Enjoy!', w / 2, 212);
    g.strokeStyle = '#ffffff'; g.lineWidth = 9; g.lineCap = 'round';
    g.beginPath(); g.moveTo(108, 300); g.lineTo(116, 408);
    g.quadraticCurveTo(118, 430, 144, 430); g.lineTo(240, 430);
    g.quadraticCurveTo(266, 430, 268, 408); g.lineTo(276, 300); g.closePath(); g.stroke();
    g.beginPath(); g.ellipse(192, 300, 84, 16, 0, 0, Math.PI * 2); g.stroke();
    g.beginPath(); g.arc(294, 352, 34, -Math.PI * 0.45, Math.PI * 0.45); g.stroke();
    g.beginPath(); g.moveTo(96, 452); g.lineTo(288, 452); g.stroke();
    g.lineWidth = 6;
    g.beginPath(); g.moveTo(160, 268); g.bezierCurveTo(144, 242, 176, 228, 160, 200); g.stroke();
    g.beginPath(); g.moveTo(208, 266); g.bezierCurveTo(192, 240, 224, 226, 208, 198); g.stroke();
  }),
});
const matCoffeeWaist = new THREE.MeshBasicMaterial({
  map: makeRestSignTex(512, 288, (g, w, h) => {
    g.fillStyle = '#151618'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#070708'; g.fillRect(34, 92, 250, 178);
    g.strokeStyle = '#3c3e42'; g.lineWidth = 3; g.strokeRect(34, 92, 250, 178);
    g.fillStyle = '#d8d4ca'; g.textBaseline = 'middle';
    g.font = 'bold 24px "Microsoft YaHei","SimHei",sans-serif'; g.textAlign = 'left';
    g.fillText('请取杯', 34, 52);
    g.fillStyle = '#8f8b82'; g.font = '18px "Microsoft YaHei","SimHei",sans-serif';
    g.fillText('请先扫码选择口味', 34, 74);
    g.fillStyle = '#b9b5ab'; g.font = '16px "Microsoft YaHei","SimHei",sans-serif';
    g.fillText('支持微信 / 支付宝', 330, 118);
    g.fillText('现磨 · 约 40 秒', 330, 146);
    g.fillStyle = '#b3282d'; g.beginPath(); g.arc(402, 216, 34, 0, Math.PI * 2); g.fill();
    g.strokeStyle = '#ffffff'; g.lineWidth = 4;
    g.beginPath(); g.moveTo(388, 204); g.lineTo(391, 228); g.lineTo(413, 228); g.lineTo(416, 204);
    g.closePath(); g.stroke();
    g.beginPath(); g.arc(418, 214, 10, -Math.PI * 0.45, Math.PI * 0.45); g.stroke();
  }),
});
const matCoffeeMenu = new THREE.MeshBasicMaterial({
  map: makeRestSignTex(512, 640, (g, w, h) => {
    g.fillStyle = '#101113'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#ab2028'; g.fillRect(0, 0, w, 86);
    g.fillStyle = '#ffffff'; g.textBaseline = 'middle'; g.textAlign = 'left';
    g.font = 'bold 32px "Microsoft YaHei","SimHei",sans-serif';
    g.fillText('咖啡角儿  Coffee Joyer', 24, 45);
    g.fillStyle = '#f6d9a6'; g.font = 'bold 22px "Microsoft YaHei","SimHei",sans-serif';
    g.textAlign = 'right'; g.fillText('24h', w - 22, 45);
    const x0 = 16, y0 = 100, x1 = w - 16, y1 = h - 16;
    g.fillStyle = '#f4ecdc'; g.fillRect(x0, y0, x1 - x0, y1 - y0);
    const cols = 3, rows = 4, gap = 10;
    const tw = (x1 - x0 - gap * (cols + 1)) / cols;
    const th = (y1 - y0 - gap * (rows + 1)) / rows;
    const names = ['美式', '拿铁', '卡布', '摩卡', '澳白', '焦糖', '浓缩', '热巧', '抹茶', '红茶', '可可', '豆浆'];
    const prices = ['¥8', '¥12', '¥12', '¥14', '¥13', '¥15', '¥9', '¥14', '¥15', '¥10', '¥12', '¥8'];
    const cups = ['#6b4226', '#b57a4b', '#a86a3e', '#5a3521', '#c9a06a', '#b07b3f',
      '#3a2416', '#7a4a2c', '#7b8f4c', '#a64b35', '#6d4526', '#cbb68a'];
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const i = r * cols + c;
      const tx = x0 + gap + c * (tw + gap), ty = y0 + gap + r * (th + gap);
      g.fillStyle = '#fffaf0'; g.fillRect(tx, ty, tw, th);
      g.strokeStyle = '#d8c8ae'; g.lineWidth = 2; g.strokeRect(tx + 1, ty + 1, tw - 2, th - 2);
      const cxp = tx + tw * 0.5, cyp = ty + th * 0.40;
      g.fillStyle = cups[i];
      g.beginPath(); g.ellipse(cxp, cyp, tw * 0.20, th * 0.16, 0, 0, Math.PI * 2); g.fill();
      g.fillStyle = '#fdf6ea';
      g.beginPath(); g.ellipse(cxp, cyp - 2, tw * 0.13, th * 0.09, 0, 0, Math.PI * 2); g.fill();
      g.strokeStyle = cups[i]; g.lineWidth = 4;
      g.beginPath(); g.arc(cxp + tw * 0.20, cyp + 2, tw * 0.05, -Math.PI * 0.5, Math.PI * 0.5); g.stroke();
      g.fillStyle = '#3a2a1e'; g.textAlign = 'center'; g.textBaseline = 'middle';
      g.font = 'bold 20px "Microsoft YaHei","SimHei",sans-serif';
      g.fillText(names[i], cxp, ty + th * 0.70);
      g.fillStyle = '#a82229'; g.font = 'bold 22px "Microsoft YaHei","SimHei",sans-serif';
      g.fillText(prices[i], cxp, ty + th * 0.88);
    }
  }),
});
const matCoffeeTop = new THREE.MeshBasicMaterial({
  map: makeRestSignTex(512, 144, (g, w, h) => {
    g.fillStyle = '#b02128'; g.fillRect(0, 0, w, h);
    g.strokeStyle = '#ffffff'; g.lineWidth = 6; g.lineCap = 'round';
    g.beginPath(); g.moveTo(34, 48); g.lineTo(40, 98);
    g.quadraticCurveTo(42, 110, 56, 110); g.lineTo(96, 110);
    g.quadraticCurveTo(110, 110, 112, 98); g.lineTo(118, 48); g.stroke();
    g.beginPath(); g.ellipse(76, 48, 42, 8, 0, 0, Math.PI * 2); g.stroke();
    g.beginPath(); g.moveTo(130, 54); g.bezierCurveTo(118, 38, 140, 30, 128, 14); g.stroke();
    g.beginPath(); g.moveTo(158, 52); g.bezierCurveTo(146, 36, 168, 28, 156, 12); g.stroke();
    g.fillStyle = '#ffffff'; g.textAlign = 'right'; g.textBaseline = 'middle';
    g.font = 'italic bold 76px "Microsoft YaHei","SimHei",sans-serif';
    g.fillText('现磨咖啡', w - 26, h / 2 + 4);
  }),
});
const matVendHeader = new THREE.MeshBasicMaterial({
  map: makeRestSignTex(1024, 160, (g, w, h) => {
    g.fillStyle = '#fbfaf5'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#c22a2e'; g.fillRect(26, 24, 86, 86);
    g.fillStyle = '#ffffff'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = 'bold 46px "Microsoft YaHei","SimHei",sans-serif';
    g.fillText('友', 69, 65);
    g.fillStyle = '#c22a2e'; g.textAlign = 'left';
    g.font = 'bold 34px "Microsoft YaHei","SimHei",sans-serif';
    g.fillText('友宝', 130, 54);
    g.fillStyle = '#7a7c80'; g.font = 'bold 24px "Arial",sans-serif';
    g.fillText('UBOX', 130, 94);
    g.fillStyle = '#1b1c1e'; g.textAlign = 'center';
    g.font = 'bold 78px "Microsoft YaHei","SimHei",sans-serif';
    g.fillText('智能货柜', 660, 82);
    g.strokeStyle = '#d9d6cd'; g.lineWidth = 4;
    g.beginPath(); g.moveTo(0, h - 3); g.lineTo(w, h - 3); g.stroke();
  }),
});
const matVendSlogan = new THREE.MeshBasicMaterial({
  map: makeRestSignTex(1024, 128, (g, w, h) => {
    g.fillStyle = '#f8f6ef'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#c0242a'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = 'bold 62px "Microsoft YaHei","SimHei",sans-serif';
    g.fillText('智能自助 × 轻松购物', w / 2, h / 2);
  }),
});
const matVendPanel = new THREE.MeshBasicMaterial({
  map: makeRestSignTex(256, 384, (g, w, h) => {
    g.fillStyle = '#f6f4ee'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#17222b'; g.fillRect(18, 18, w - 36, 230);
    g.fillStyle = '#ffffff'; g.fillRect(70, 44, 116, 116);
    g.fillStyle = '#17222b';
    for (let i = 0; i < 7; i++) for (let j = 0; j < 7; j++) {
      if ((i * 3 + j * 5) % 4 < 2) g.fillRect(78 + i * 14, 52 + j * 14, 10, 10);
    }
    g.fillStyle = '#ffffff'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = 'bold 24px "Microsoft YaHei","SimHei",sans-serif';
    g.fillText('扫码支付', w / 2, 196);
    g.fillStyle = '#2f6fb0'; g.fillRect(24, 268, w - 48, 58);
    g.fillStyle = '#ffffff'; g.font = 'bold 28px "Microsoft YaHei","SimHei",sans-serif';
    g.fillText('打开货柜', w / 2, 297);
    g.fillStyle = '#d8532f'; g.fillRect(24, 338, w - 48, 26);
  }),
});
const matVendSide = new THREE.MeshBasicMaterial({
  map: makeRestSignTex(96, 768, (g, w, h) => {
    g.fillStyle = '#fbfaf5'; g.fillRect(0, 0, w, h);
    g.save(); g.translate(w / 2, h / 2); g.rotate(-Math.PI / 2);
    g.fillStyle = '#6f7378'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = 'bold 46px "Arial",sans-serif'; g.fillText('FRIEND BOX', 0, 0);
    g.restore();
    g.strokeStyle = '#d9d6cd'; g.lineWidth = 3; g.strokeRect(2, 2, w - 4, h - 4);
  }),
});
const matRestNotice = new THREE.MeshBasicMaterial({
  map: makeRestSignTex(512, 384, (g, w, h) => {
    g.fillStyle = '#a01f25'; g.fillRect(0, 0, w, h);
    g.strokeStyle = '#f6efe2'; g.lineWidth = 5; g.strokeRect(12, 12, w - 24, h - 24);
    g.fillStyle = '#ffffff'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = 'bold 54px "Microsoft YaHei","SimHei",sans-serif';
    g.fillText('教休室开放时间', w / 2, 98);
    g.font = 'bold 68px "Arial Black","Microsoft YaHei",sans-serif';
    g.fillText('7:00—22:00', w / 2, 205);
    g.font = '24px "Microsoft YaHei","SimHei",sans-serif';
    g.fillStyle = 'rgba(255,255,255,0.92)';
    g.fillText('教师休息室 · 请保持安静', w / 2, 288);
    g.fillStyle = 'rgba(255,255,255,0.8)';
    g.fillRect(120, 324, w - 240, 3);
  }),
});
const matWaterSign = new THREE.MeshBasicMaterial({
  map: makeRestSignTex(384, 256, (g, w, h) => {
    g.fillStyle = '#f8f6ef'; g.fillRect(0, 0, w, h);
    g.strokeStyle = '#cfcabd'; g.lineWidth = 4; g.strokeRect(6, 6, w - 12, h - 12);
    g.fillStyle = '#b0272d'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = 'bold 40px "Microsoft YaHei","SimHei",sans-serif';
    g.fillText('教休室饮用水', w / 2, 66);
    g.fillStyle = '#55524c'; g.font = '20px "Microsoft YaHei","SimHei",sans-serif';
    g.fillText('请按需取用 · 节约用水', w / 2, 112);
    g.strokeStyle = '#b0272d'; g.lineWidth = 5;
    g.beginPath(); g.moveTo(158, 152); g.lineTo(162, 208); g.lineTo(222, 208); g.lineTo(226, 152);
    g.closePath(); g.stroke();
    g.beginPath(); g.moveTo(166, 144); g.lineTo(218, 144); g.stroke();
    g.fillStyle = '#6b675f'; g.fillRect(84, 226, w - 168, 5);
    g.fillRect(104, 242, w - 208, 4);
  }),
});
// 开水间门头牌：白底红字 + 一行警示；挂在炉体正上方的南墙上
const matBoilerSign = new THREE.MeshBasicMaterial({
  map: makeRestSignTex(384, 256, (g, w, h) => {
    g.fillStyle = '#f7f5ef'; g.fillRect(0, 0, w, h);
    g.strokeStyle = '#b0272d'; g.lineWidth = 6; g.strokeRect(7, 7, w - 14, h - 14);
    g.fillStyle = '#b0272d'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = 'bold 60px "Microsoft YaHei","SimHei",sans-serif';
    g.fillText('开 水 间', w / 2, 82);
    g.fillStyle = '#55524c'; g.font = '24px "Microsoft YaHei","SimHei",sans-serif';
    g.fillText('小 心 烫 伤 · 请 勿 拥 挤', w / 2, 158);
    g.fillStyle = '#b0272d'; g.fillRect(58, 202, w - 116, 4);
    g.font = '18px "Microsoft YaHei","SimHei",sans-serif';
    g.fillText('BOILING WATER', w / 2, 226);
  }),
});

/* -------------------------------------------------------------------------
   门厅本体：白墙 + 黑踢脚（照片里这段没有走廊墙裙）。
   前墙 z=9.9 在上面用 matWallPaint 建好了；这里只贴东/西/北三面借来的墙，
   再加天花板灯带和照片里那根从地到顶的立管。
   ------------------------------------------------------------------------- */
const FY_N = REST_FRONT_Z - WALL_T / 2;        // 9.86，前墙朝门厅的面
{
  // 东墙 = YF310 西墙（x=36.4）；白板盖住走廊墙裙，机器背贴白板。
  box(world, 0.020, ROOM_H, FOYER_D, 36.4 - WALL_T / 2 - 0.017,
    ROOM_H / 2, HALL_Z1 + FOYER_D / 2, matWallPaint, false);
  box(world, 0.024, 0.11, FOYER_D, 36.4 - WALL_T / 2 - 0.029,
    0.055, HALL_Z1 + FOYER_D / 2, matBase, false);
  // 西墙 = 前室东墙（x=28.4），白板朝开水间。
  box(world, 0.020, ROOM_H, FOYER_D, 28.4 + WALL_T / 2 + 0.017,
    ROOM_H / 2, HALL_Z1 + FOYER_D / 2, matWallPaint, false);
  box(world, 0.024, 0.11, FOYER_D, 28.4 + WALL_T / 2 + 0.029,
    0.055, HALL_Z1 + FOYER_D / 2, matBase, false);
  // 北墙只到 30.9（开水间这一段），白板朝南开（开水间内侧）。
  const nw = WATER_OPEN_X0 - CLS_KS[0];
  box(world, nw, ROOM_H, 0.020, (CLS_KS[0] + WATER_OPEN_X0) / 2, ROOM_H / 2,
    HALL_Z1 + WALL_T / 2 + 0.017, matWallPaint, false);
  box(world, nw, 0.11, 0.024, (CLS_KS[0] + WATER_OPEN_X0) / 2, 0.055,
    HALL_Z1 + WALL_T / 2 + 0.029, matBase, false);
  // 天花灯带：门厅两条、开水间一条，位置和走廊灯错开
  box(world, 1.35, 0.055, 0.22, 34.55, ROOM_H - 0.06, 8.35, matStrip, false);
  box(world, 1.35, 0.055, 0.22, 34.55, ROOM_H - 0.06, 9.25, matStrip, false);
  box(world, 1.05, 0.055, 0.22, 30.55, ROOM_H - 0.06, 8.55, matStrip, false);
  // 照片里东墙与暖气片墙交界处有一根刷白的立管，从踢脚一直到吊顶
  cyl(0.027, 0.027, 2.88, 10, matWallPaint, 36.20, 1.44, 9.80);
  cyl(0.030, 0.030, 0.05, 10, matAlu, 36.20, 0.025, 9.80);
}

// ---- 暖气片：门东侧、照片里的 15 片翅片 + 立管；红底开放时间牌在它上方 ----
{
  const RX = 34.75, RZ = 9.78, RW = 0.86, FINS = 15;
  for (let i = 0; i < FINS; i++) {
    const x = RX - RW / 2 + 0.03 + i * (RW - 0.06) / (FINS - 1);
    box(world, 0.044, 0.52, i % 2 ? 0.105 : 0.10, x, 0.355, RZ, matRadiator, false);
  }
  for (const y of [0.10, 0.60]) cyl(0.028, 0.028, RW, 10, matRadiator, RX, y, RZ, [0, 0, Math.PI / 2]);
  for (const x of [RX - 0.28, RX + 0.28]) box(world, 0.05, 0.06, 0.09, x, 0.03, RZ, matRadiator, false);
  cyl(0.024, 0.024, 0.10, 8, matRadiator, 35.38, 0.32, RZ, [0, 0, Math.PI / 2]);
  const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.012, 8, 14), matShopRed);
  wheel.position.set(35.42, 0.36, RZ + 0.03);
  wheel.rotation.y = Math.PI / 2;
  world.add(wheel);
  deskRects.push({ minX: RX - RW / 2, maxX: RX + RW / 2, minZ: 9.70, maxZ: 9.86, top: 0.64 });
}
// 照片里门东侧那块红底开放时间牌
box(world, 0.36, 0.27, 0.014, 34.82, 1.62, FY_N - 0.012, matShopBlack, false);
addPlane(0.34, 0.255, matRestNotice, V(34.82, 1.62, FY_N - 0.020), R(0, Math.PI, 0));

/* 下面三台机器仍按旧局部坐标建：墙在 z=2.40，机器背贴 2.46，脸朝 +z。
   建完统一转 −90° 搬到门厅东墙，局部 +z 变成世界 −x（朝西）。 */
const machineStart = world.children.length;
const machineRectStart = deskRects.length;

// ---- 咖啡机：黑底座 + 红柜体 + 取杯腰 + 菜单屏 + 顶部“现磨咖啡”灯箱 ----
{
  const X = -4.68, ZB = 2.47, W = 0.74, D = 0.64, ZC = ZB + D / 2;   // 前脸 3.11
  box(world, 0.68, 0.08, 0.56, X, 0.04, ZC, matShopBlack, false);
  box(world, W, 0.88, D, X, 0.52, ZC, matShopRed, false);
  addPlane(0.70, 0.82, matCoffeeFront, V(X, 0.52, 3.111), R(0, 0, 0));
  box(world, 0.72, 0.44, 0.60, X, 1.18, ZC - 0.02, matShopBlack, false);
  addPlane(0.68, 0.40, matCoffeeWaist, V(X, 1.18, 3.072), R(0, 0, 0));
  box(world, 0.30, 0.018, 0.08, X - 0.02, 1.00, 3.06, matShopShelf, false);
  cyl(0.034, 0.029, 0.075, 10, matShopWhite, X - 0.02, 1.047, 3.06);
  box(world, 0.045, 0.035, 0.05, X - 0.02, 1.195, 3.06, matShopBlack, false);
  box(world, W, 0.56, 0.62, X, 1.68, ZC - 0.01, matShopBlack, false);
  addPlane(0.70, 0.52, matCoffeeMenu, V(X, 1.68, 3.092), R(0, 0, 0));
  box(world, 0.78, 0.22, 0.18, X, 2.06, 2.91, matShopBlack, false);
  addPlane(0.74, 0.20, matCoffeeTop, V(X, 2.06, 3.001), R(0, 0, 0));
  for (const sx of [-1, 1]) box(world, 0.03, 0.05, 0.05, X + sx * 0.28, 1.965, 2.92, matShopBlack, false);
  box(world, 0.07, 0.17, 0.04, X + 0.31, 1.25, 3.115, matShopWhite, false);
  box(world, 0.03, 0.03, 0.012, X + 0.31, 1.30, 3.138, matShopLed, false);
  deskRects.push({ minX: X - 0.40, maxX: X + 0.40, minZ: 2.46, maxZ: 3.13, top: 2.17 });
}

// ---- 桶装水架：铝框 + 5 桶横放（瓶盖朝走廊）----
{
  const X = -3.93, ZC = 2.75;
  for (const x of [X - 0.20, X + 0.20]) for (const z of [2.55, 2.95]) {
    box(world, 0.028, 1.50, 0.028, x, 0.75, z, matAlu, false);
  }
  for (const x of [X - 0.20, X + 0.20]) for (const y of [0.055, 0.32, 0.585, 0.85, 1.115, 1.42]) {
    box(world, 0.025, 0.022, 0.42, x, y, ZC, matAlu, false);
  }
  for (const z of [2.55, 2.95]) box(world, 0.43, 0.03, 0.028, X, 1.50, z, matAlu, false);
  box(world, 0.028, 0.03, 0.43, X - 0.20, 1.50, ZC, matAlu, false);
  box(world, 0.028, 0.03, 0.43, X + 0.20, 1.50, ZC, matAlu, false);
  for (const y of [0.19, 0.455, 0.72, 0.985, 1.25]) {
    cyl(0.135, 0.135, 0.40, 16, matWaterBottle, X, y, 2.74, [Math.PI / 2, 0, 0]);
    cyl(0.137, 0.137, 0.10, 16, matWaterLabel, X, y, 2.80, [Math.PI / 2, 0, 0]);
    cyl(0.052, 0.052, 0.055, 12, matWaterCap, X, y, 2.965, [Math.PI / 2, 0, 0]);
  }
  deskRects.push({ minX: X - 0.23, maxX: X + 0.23, minZ: 2.50, maxZ: 3.02, top: 1.52 });
  // 照片里水架上方那张白纸
  box(world, 0.29, 0.20, 0.012, X, 1.70, 2.446, matShopWhite, false);
  addPlane(0.28, 0.19, matWaterSign, V(X, 1.70, 2.453), R(0, 0, 0));
}

// ---- 友宝智能货柜：白壳 + 玻璃门 + 5 层货 + 灯箱 + 扫码屏 ----
{
  const X = -3.145, ZB = 2.46, W = 1.05, D = 0.78, ZC = ZB + D / 2, F = 3.24;
  box(world, 0.99, 0.07, 0.68, X, 0.035, ZC - 0.02, matShopBlack, false);
  box(world, 0.99, 0.12, 0.68, X, 0.11, ZC - 0.02, matShopBlack, false);
  box(world, W, 0.10, D, X, 0.22, ZC, matShopCream, false);          // 下沿白板
  box(world, W, 0.08, D, X, 2.00, ZC, matShopCream, false);          // 顶盖（2.04 顶）
  box(world, 0.06, 1.86, D, X - W / 2 + 0.03, 1.09, ZC, matShopCream, false);
  box(world, 0.06, 1.86, D, X + W / 2 - 0.03, 1.09, ZC, matShopCream, false);
  box(world, W, 1.86, 0.06, X, 1.09, ZB + 0.03, matShopCream, false);
  box(world, W, 0.26, 0.06, X, 1.83, F - 0.03, matShopCream, false); // 灯箱后板
  box(world, W, 0.16, 0.06, X, 0.25, F - 0.03, matShopCream, false); // 标语板
  // 玻璃 + 黑框
  addPlane(0.92, 1.38, matShopGlass, V(X, 1.00, F + 0.002), R(0, 0, 0));
  for (const [bw, bh, bx, by] of [
    [0.94, 0.03, X, 1.69], [0.94, 0.03, X, 0.31],
    [0.03, 1.41, X - 0.46, 1.00], [0.03, 1.41, X + 0.46, 1.00],
  ]) box(world, bw, bh, 0.03, bx, by, F - 0.005, matShopBlack, false);
  // 内胆：亮白背板 + 5 层搁板 + 商品
  addPlane(0.92, 1.36, matShopInterior, V(X, 1.01, 2.56), R(0, 0, 0));
  const shelfY = [0.46, 0.73, 1.00, 1.27, 1.49];
  for (const y of shelfY) {
    box(world, 0.92, 0.022, 0.50, X, y, 2.84, matShopShelf, false);
    box(world, 0.90, 0.030, 0.012, X, y + 0.022, 3.095, matShopCream, false);
  }
  for (let r = 0; r < shelfY.length; r++) {
    for (let c = 0; c < 6; c++) {
      const gx = X - 0.36 + c * 0.144;
      const gm = matGoods[(r * 2 + c) % matGoods.length];
      if (r >= 3) {
        box(world, 0.10, 0.16, 0.09, gx, shelfY[r] + 0.092, 2.86, gm, false);
      } else {
        cyl(0.032, 0.032, r === 0 ? 0.24 : 0.20, 10, gm, gx, shelfY[r] + (r === 0 ? 0.132 : 0.112), 2.86);
        cyl(0.013, 0.013, 0.018, 8, matShopWhite, gx, shelfY[r] + (r === 0 ? 0.262 : 0.222), 2.86);
      }
    }
  }
  // 灯带 + 内部橙色圆标
  for (const sx of [-1, 1]) box(world, 0.015, 1.30, 0.015, X + sx * 0.44, 1.00, 3.07, matShopLed, false);
  box(world, 0.86, 0.015, 0.015, X, 1.66, 3.07, matShopLed, false);
  const logo = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.012, 8, 18), matGoods[0]);
  logo.position.set(X - 0.33, 1.16, 3.06);
  world.add(logo);
  // 灯箱、标语、左侧竖条、右侧扫码屏
  addPlane(0.98, 0.22, matVendHeader, V(X, 1.83, F + 0.002), R(0, 0, 0));
  addPlane(0.94, 0.12, matVendSlogan, V(X, 0.25, F + 0.002), R(0, 0, 0));
  addPlane(0.055, 1.15, matVendSide, V(X - W / 2 + 0.04, 1.02, F + 0.002), R(0, 0, 0));
  box(world, 0.12, 0.30, 0.06, X + W / 2 - 0.10, 1.33, F + 0.03, matShopWhite, false);
  addPlane(0.09, 0.14, matVendPanel, V(X + W / 2 - 0.10, 1.38, F + 0.062), R(0, 0, 0));
  deskRects.push({ minX: X - 0.55, maxX: X + 0.55, minZ: 2.45, maxZ: 3.30, top: 2.04 });
}

/* 三台机器建成后整组转 −90° 靠到门厅东墙：
   局部墙 z=2.40 → 世界 x=36.36；局部 +x → 世界 +z。
   纵向起点 12.08 让咖啡机（局部 x=-4.68）落在 z≈7.40、货柜（-3.145）落在 8.94，
   从走廊口看过去就是照片里的 咖啡→水架→货柜→墙角。 */
{
  const MACH_Z0 = 12.08;
  const MACH_WALL_X = 36.4 - WALL_T / 2;         // 36.36
  const mg = new THREE.Group();
  mg.add(...world.children.splice(machineStart));
  mg.rotation.y = -Math.PI / 2;
  mg.position.set(MACH_WALL_X + 2.40, 0, MACH_Z0);
  world.add(mg);
  for (let i = machineRectStart; i < deskRects.length; i++) {
    const r = deskRects[i];
    const x0 = MACH_WALL_X + 2.40 - r.maxZ;
    const x1 = MACH_WALL_X + 2.40 - r.minZ;
    const z0 = MACH_Z0 + r.minX;
    const z1 = MACH_Z0 + r.maxX;
    r.minX = x0; r.maxX = x1; r.minZ = z0; r.maxZ = z1;
  }
}

/* ---- 开水间：照片里圈出的不锈钢开水炉，紧贴教休室前墙、在门西侧 0.4 m ----
   炉体背贴 z=9.86 的白墙，正脸朝北；东沿 32.37，门洞西沿 32.80。
   旁边是照片里那台带水槽的低柜；垃圾桶放在炉前，和照片里的位置一致。 */
{
  const BX = 32.06, BZ = REST_FRONT_Z - WALL_T / 2 - 0.21;   // 9.65，深 0.42
  const BW = 0.62, BD = 0.42, F = BZ - BD / 2;               // 前脸 9.44
  for (const s of [-1, 1]) box(world, 0.05, 0.05, 0.06, BX + s * 0.22, 0.025, BZ, matShopBlack, false);
  box(world, BW, 1.90, BD, BX, 0.99, BZ, matRestSteel, false);
  box(world, BW + 0.04, 0.05, BD + 0.04, BX, 1.965, BZ, matRestSteel, false);
  box(world, 0.012, 1.80, 0.012, BX + 0.13, 1.00, F - 0.006, matShopBlack, false);  // 拉丝拼缝
  box(world, 0.22, 0.30, 0.020, BX - 0.10, 1.42, F - 0.010, matShopBlack, false);   // 控制面板
  box(world, 0.10, 0.06, 0.012, BX - 0.10, 1.47, F - 0.022, matShopLed, false);
  box(world, 0.15, 0.11, 0.012, BX + 0.18, 1.80, F - 0.006, matGoods[0], false);    // 黄贴纸
  box(world, 0.12, 0.03, 0.06, BX, 1.10, F - 0.035, matShopBlack, false);           // 出水嘴
  box(world, 0.38, 0.03, 0.15, BX, 0.62, F - 0.055, matShopBlack, false);           // 接水盘
  for (let i = 0; i < 5; i++) box(world, 0.30, 0.008, 0.012, BX, 0.636, F - 0.12 + i * 0.026, matAlu, false);
  deskRects.push({ minX: BX - BW / 2, maxX: BX + BW / 2, minZ: 9.40, maxZ: 9.86, top: 1.99 });

  // 低柜水槽：紧挨炉体西侧，台面 0.92 m，和照片里的不锈钢水槽同高
  const SX = 31.34, SZ = REST_FRONT_Z - WALL_T / 2 - 0.26;   // 9.60，深 0.52
  box(world, 0.76, 0.86, 0.52, SX, 0.45, SZ, matRestSteel, false);
  box(world, 0.80, 0.04, 0.56, SX, 0.90, SZ, matRestSteel, false);
  box(world, 0.38, 0.025, 0.26, SX, 0.925, SZ - 0.02, matShopBlack, false);
  for (const [w, d, dx, dz] of [[0.04, 0.30, -0.21, -0.02], [0.04, 0.30, 0.21, -0.02],
    [0.42, 0.04, 0, -0.17], [0.42, 0.04, 0, 0.13]]) {
    box(world, w, 0.025, d, SX + dx, 0.925, SZ + dz, matAlu, false);
  }
  cyl(0.018, 0.018, 0.24, 8, matAlu, SX, 1.03, SZ + 0.14);
  cyl(0.016, 0.016, 0.18, 8, matAlu, SX, 1.15, SZ + 0.06, [Math.PI / 2, 0, 0]);
  for (let i = 0; i < 3; i++) cyl(0.026, 0.020, 0.075, 10, matShopWhite, SX + 0.42, 0.96 + i * 0.045, SZ + 0.10);
  deskRects.push({ minX: SX - 0.40, maxX: SX + 0.40, minZ: 9.32, maxZ: 9.86, top: 0.94 });

  // 照片里的黑色敞口桶：在炉前偏西，不妨碍接水
  pBin(31.92, 9.10, false);

  // 炉体上方的“开水间”牌
  box(world, 0.50, 0.30, 0.014, BX, 2.22, FY_N - 0.012, matShopWhite, false);
  addPlane(0.46, 0.26, matBoilerSign, V(BX, 2.22, FY_N - 0.020), R(0, Math.PI, 0));

  // 地面排水地漏
  cyl(0.10, 0.10, 0.006, 16, matAlu, 30.90, 0.006, 8.60);
  const drainRing = new THREE.Mesh(new THREE.TorusGeometry(0.095, 0.008, 6, 18), matShopBlack);
  drainRing.rotation.x = Math.PI / 2;
  drainRing.position.set(30.90, 0.012, 8.60);
  world.add(drainRing);
}

// ---- 内景：四间 8×8 教室 + 配电室/电梯厅（里面有 pBin/pCooler，必须排在 rect 之后）----
buildClassroom8(CLS_301, true, '301');
buildClassroom8(CLS_302, true, '302');
buildClassroom8(CLS_313, false, '313');
buildClassroom8(CLS_312, false, '312');
buildPowerRoom(CLS_PD);
buildElevatorHall(CLS_EL);
// 楼梯间 B 挪到照片材质定义之后再建（见文件后半段），否则拿不到那套灰砖/栏杆材质

// ── 教室 E = YF310：室内只留照片里有的东西；杂物都撤掉了 ─────────────
const ez = CLS_E[2];
pExitSign((CLS_E_DOORS[0][0] + CLS_E_DOORS[0][1]) / 2, 2.72, ez + 0.15, true);

// ── 实验室 F = YF303：一列台子、西侧道 0.96 m、门口那条竖线全程留空 ──────
// 坐标全部相对 CLS_F[0]（它在逸夫楼布局里挪到了 x 29.3，写死的数会跑到隔壁间）。
const fx = CLS_F[0];
pExt(fx + 1.15, -13.20); pExt(fx + 10.60, -13.20);
pExitSign(fx + 3.00, 2.72, 2.30, true);
pBin(fx + 2.60, -13.25, false); pBarrel(fx + 3.55, -13.25, matAlu);
pCooler(fx + 1.85, -13.20); pNotice(fx + 0.10, 1.75, -6.00, false);
pPoster(fx + 0.10, 1.75, -8.60, false); pPoster(fx + 0.10, 1.75, -3.40, false);
pCable(fx + 0.20, -7.00, 12.0, false);                           // 西墙根一整条走线（不注册碰撞）
pCase(fx + 9.40, -13.25, true); pHideLocker(fx + 11.60, -13.30, true);
// 西南角堆放组：全部让开门口那条竖线（x fx+2.68 ~ fx+3.32）
pShelf(fx + 1.00, 1.80, true); pPallet(fx + 1.95, 0.30, true);
pCase(fx + 1.95, -0.60, true); pCase(fx + 4.30, -0.60, true); pChairPile(fx + 5.20, -0.60);
pPlant(fx + 7.30, -0.60);

/* =========================================================================
   卫生间（男 / 女）：照 2026-10-25 的八张实景照片重做
   -------------------------------------------------------------------------
   走廊上不再并排开两樘门，只有一个 1.1 m 的凹进门洞 → 1.4×2.3 m 共用前室：
     · 女厕在左（东侧 x=25.8 的墙上开门）
     · 男厕在右（西侧 x=24.4 的墙上开门）
     · 正前方一扇常闭棕门（照片里那扇，没有牌）
   每间内部都是两段：
     前 2.2 m 洗手区：北墙三盆石台 + 通长大镜 + 龙头/皂液器/绿植/红瓶，
                      一道棕框竖玻璃门；
     后 5.6 m 厕所区：通顶米色隔间 6 间（蹲便器、蓝纸篓、挂钩、角架），
                      男厕对面 3 个落地小便池 + 米色挡板，女厕对面一条扶手，
                      尽头深灰门 + 白暖气片 + 纸盒 + 白立管。
   墙地是灰色大理石纹大砖，前室白墙 + 黑踢脚，门边是黑底洗手间牌。
   ========================================================================= */
function wcTileTexture(base, vein, grout, cols, rows) {
  const S = 512, c = newCanvas(S), g = c.getContext('2d');
  g.fillStyle = base; g.fillRect(0, 0, S, S);
  for (let i = 0; i < 24; i++) {
    g.globalAlpha = 0.05 + Math.random() * 0.09;
    g.strokeStyle = i % 4 === 0 ? '#f6f5f1' : vein;
    g.lineWidth = 1 + Math.random() * 6;
    g.beginPath();
    let x = Math.random() * S, y = Math.random() * S;
    g.moveTo(x, y);
    for (let k = 0; k < 4; k++) {
      x += (Math.random() - 0.5) * S * 0.55;
      y += (Math.random() - 0.5) * S * 0.55;
      g.lineTo(x, y);
    }
    g.stroke();
  }
  g.globalAlpha = 1;
  g.strokeStyle = grout; g.lineWidth = 3;
  for (let i = 0; i <= cols; i++) {
    const x = i * S / cols;
    g.beginPath(); g.moveTo(x, 0); g.lineTo(x, S); g.stroke();
  }
  for (let j = 0; j <= rows; j++) {
    const y = j * S / rows;
    g.beginPath(); g.moveTo(0, y); g.lineTo(S, y); g.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return _aniso(t);
}
function wcStoneTexture() {
  const S = 512, c = newCanvas(S), g = c.getContext('2d');
  g.fillStyle = '#8d8174'; g.fillRect(0, 0, S, S);
  sprinkleNoise(g, S, 0.16);
  for (let i = 0; i < 10; i++) {
    g.globalAlpha = 0.10 + Math.random() * 0.12;
    g.strokeStyle = i % 2 ? '#b8aa98' : '#6e6459';
    g.lineWidth = 2 + Math.random() * 10;
    g.beginPath();
    let x = Math.random() * S, y = Math.random() * S;
    g.moveTo(x, y);
    for (let k = 0; k < 3; k++) {
      x += (Math.random() - 0.5) * S * 0.8;
      y += (Math.random() - 0.5) * S * 0.8;
      g.lineTo(x, y);
    }
    g.stroke();
  }
  g.globalAlpha = 1;
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return _aniso(t);
}
function wcMirrorTexture() {
  const W = 256, H = 512, c = document.createElement('canvas');
  c.width = W; c.height = H;
  const g = c.getContext('2d');
  const grd = g.createLinearGradient(0, 0, 0, H);
  grd.addColorStop(0, '#b9c2c5'); grd.addColorStop(0.45, '#9aa3a7'); grd.addColorStop(1, '#6c7478');
  g.fillStyle = grd; g.fillRect(0, 0, W, H);
  // 对面灰砖墙的竖缝（镜子里看到的那面墙）
  g.strokeStyle = 'rgba(225,228,226,0.35)'; g.lineWidth = 2;
  for (let x = 24; x < W; x += 64) { g.beginPath(); g.moveTo(x, 40); g.lineTo(x, H - 70); g.stroke(); }
  g.strokeStyle = 'rgba(225,228,226,0.22)';
  for (let y = 120; y < H - 70; y += 88) { g.beginPath(); g.moveTo(22, y); g.lineTo(W - 22, y); g.stroke(); }
  // 反射里的米色隔间门（门缝 + 把手）和深棕内门（磨砂玻璃）
  g.fillStyle = 'rgba(205,198,186,0.5)'; g.fillRect(136, 92, 96, 304);
  g.strokeStyle = 'rgba(70,74,78,0.5)'; g.lineWidth = 3;
  for (const x of [136, 172, 208, 232]) {
    g.beginPath(); g.moveTo(x, 92); g.lineTo(x, 396); g.stroke();
  }
  g.fillStyle = 'rgba(218,218,212,0.5)';
  for (const x of [164, 200]) g.fillRect(x, 226, 5, 22);
  g.fillStyle = 'rgba(74,66,60,0.55)'; g.fillRect(20, 128, 50, 268);
  g.fillStyle = 'rgba(150,168,170,0.5)'; g.fillRect(38, 164, 16, 90);
  g.fillStyle = 'rgba(83,88,92,0.7)'; g.fillRect(70, 128, 4, 268);
  // 顶部灯和台面反光
  g.fillStyle = 'rgba(255,255,255,0.65)'; g.fillRect(96, 20, 58, 18);
  g.fillStyle = 'rgba(255,255,255,0.22)'; g.fillRect(0, 330, W, 40);
  g.fillStyle = 'rgba(50,58,62,0.28)'; g.fillRect(0, 300, W, 5);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return _aniso(t);
}

const WC_TILE = 1.2;
const matWcWall = new THREE.MeshLambertMaterial({ map: wcTileTexture('#cfd1cd', '#a8aca9', '#e9e8e3', 2, 1) });
METRIC_UV.set(matWcWall, WC_TILE);
const matWcFloor = new THREE.MeshLambertMaterial({ map: wcTileTexture('#94968f', '#878983', '#7f817b', 2, 2) });
METRIC_UV.set(matWcFloor, WC_TILE);
const matWcStone = new THREE.MeshLambertMaterial({ map: wcStoneTexture() });
METRIC_UV.set(matWcStone, WC_TILE);
const matWcPart = new THREE.MeshLambertMaterial({ color: 0xc8bfad });   // 米色隔间板
const matWcEdge = new THREE.MeshLambertMaterial({ color: 0x53585c });   // 深灰包边
const matWcCab  = new THREE.MeshLambertMaterial({ color: 0xe5e1d9 });   // 洗手柜
const matWcDark = new THREE.MeshLambertMaterial({ color: 0x232629 });   // 尽头深灰门
const matWcBin  = new THREE.MeshLambertMaterial({ color: 0x4b84b4 });   // 蓝纸篓
const matWcMirror = new THREE.MeshBasicMaterial({ map: wcMirrorTexture() });
const matWcMirrorFrame = new THREE.MeshLambertMaterial({ color: 0x302d29 });
const matWcFrost = new THREE.MeshLambertMaterial({ color: 0xcfd8d6 });
const matWcBasin = new THREE.MeshLambertMaterial({ color: 0xe9e6df });  // 门上的磨砂玻璃
const matWcWhite = new THREE.MeshLambertMaterial({ color: 0xf0efea });

function wcSolid(minX, maxX, minZ, maxZ, top = ROOM_H) {
  deskRects.push({ minX, maxX, minZ, maxZ, top });
}
function wcLed(x, z, w = 0.95, d = 0.55) {
  box(world, w + 0.06, 0.025, d + 0.06, x, ROOM_H - 0.03, z, matWcEdge, false);
  box(world, w, 0.02, d, x, ROOM_H - 0.045, z, matStrip, false);
}
function wcPerson(g, cx, cy, s, female) {
  g.fillStyle = '#f2f2ec';
  g.beginPath(); g.arc(cx, cy - s * 0.52, s * 0.17, 0, Math.PI * 2); g.fill();
  g.beginPath();
  if (female) {
    g.moveTo(cx, cy - s * 0.30); g.lineTo(cx - s * 0.34, cy + s * 0.34);
    g.lineTo(cx + s * 0.34, cy + s * 0.34);
  } else {
    g.rect(cx - s * 0.21, cy - s * 0.30, s * 0.42, s * 0.64);
  }
  g.closePath(); g.fill();
  g.fillRect(cx - s * 0.17, cy + s * 0.34, s * 0.11, s * 0.36);
  g.fillRect(cx + s * 0.06, cy + s * 0.34, s * 0.11, s * 0.36);
}
function wcSignMaterial(kind) {
  const W = kind === 'both' ? 200 : 256, H = kind === 'both' ? 520 : 256;
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d');
  g.fillStyle = '#0e1012'; g.fillRect(0, 0, W, H);
  g.strokeStyle = '#62686c'; g.lineWidth = 4; g.strokeRect(4, 4, W - 8, H - 8);
  if (kind === 'both') {
    // 门套竖牌：男女图标并排在上，下面竖排“洗手间”
    wcPerson(g, 62, 96, 112, false);
    wcPerson(g, 138, 96, 112, true);
    g.fillStyle = '#f2f2ec'; g.font = 'bold 46px "Microsoft YaHei","SimHei",sans-serif';
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText('洗', 100, 300);
    g.fillText('手', 100, 368);
    g.fillText('间', 100, 436);
  } else {
    const female = kind === 'women';
    wcPerson(g, 128, 82, 112, female);
    g.fillStyle = '#f2f2ec'; g.font = 'bold 76px "Microsoft YaHei","SimHei",sans-serif';
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(female ? '女' : '男', 128, 208);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return new THREE.MeshBasicMaterial({ map: t });
}
const matWcSignBoth = wcSignMaterial('both');
const matWcSignMen = wcSignMaterial('men');
const matWcSignWomen = wcSignMaterial('women');
function wcSignBoard(mat, w, h, x, y, z, yaw) {
  const back = box(world, w + 0.04, h + 0.04, 0.035, x, y, z, matWcEdge, false);
  back.rotation.y = yaw;
  addPlane(w, h, mat, V(x + Math.sin(yaw) * 0.028, y, z + Math.cos(yaw) * 0.028), R(0, yaw, 0));
}
function wcCautionMaterial() {
  const W = 256, H = 384, c = document.createElement('canvas');
  c.width = W; c.height = H;
  const g = c.getContext('2d');
  g.fillStyle = '#e8b51e'; g.fillRect(0, 0, W, H);
  g.strokeStyle = '#2a2a26'; g.lineWidth = 8; g.strokeRect(8, 8, W - 16, H - 16);
  g.beginPath(); g.moveTo(128, 46); g.lineTo(196, 168); g.lineTo(60, 168); g.closePath();
  g.lineWidth = 10; g.strokeStyle = '#2a2a26'; g.stroke();
  g.fillStyle = '#2a2a26'; g.beginPath(); g.arc(128, 112, 12, 0, Math.PI * 2); g.fill();
  g.fillRect(122, 126, 12, 28);
  g.fillStyle = '#2a2a26'; g.font = 'bold 72px "Microsoft YaHei","SimHei",sans-serif';
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText('小', 128, 234);
  g.fillText('心', 128, 300);
  g.fillText('地滑', 128, 358);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return new THREE.MeshBasicMaterial({ map: t });
}

/* 小便池壳体的几何工具。实拍里的便斗是"背面平贴墙、正面鼓、上宽下窄"的
   陶瓷盾形，车削出来的圆锥/花瓶一定不像。这里用一组水平截面（y 高度 /
   w 宽 / d 进深）拉出半椭圆壳：a=0 和 π 落在墙面上，a=π/2 是正前方；
   内胆背面再贴一块平板，感应器就装在它上面。 */
function wcUrinalShell(levels, backOff = 0, segs = 26) {
  const pos = [], idx = [];
  for (const lv of levels) {
    const hw = lv.w / 2;
    for (let j = 0; j <= segs; j++) {
      const a = Math.PI * j / segs;
      const k = 1 - Math.sin(a);
      const z = (lv.endl === undefined ? hw : hw + (lv.endl - hw) * k * k) * Math.cos(a);
      const y = lv.drop === undefined ? lv.y : lv.y - lv.drop * Math.sin(a) ** 2;
      pos.push(backOff + (lv.d - backOff) * Math.sin(a), y, z);
    }
  }
  for (let i = 0; i < levels.length - 1; i++) {
    for (let j = 0; j < segs; j++) {
      const a = i * (segs + 1) + j, b = a + 1, c = a + segs + 1, d = c + 1;
      idx.push(a, b, c, b, d, c);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo;
}
function wcUrinalRing(w, d, y, backOff = 0, segs = 26, endl = undefined, drop = 0) {
  const out = [];
  const hw = w / 2;
  for (let j = 0; j <= segs; j++) {
    const a = Math.PI * j / segs;
    const k = 1 - Math.sin(a);
    const z = (endl === undefined ? hw : hw + (endl - hw) * k * k) * Math.cos(a);
    out.push([backOff + (d - backOff) * Math.sin(a),
      y - drop * Math.sin(a) ** 2, z]);
  }
  return out;
}
/* 盆底的封板：截面是贴墙的半椭圆，拿整个椭圆去封底，两翼会离墙留缝；
   沿底圈从墙心拉扇形，正好填满这块 D 形底。 */
function wcUrinalFloorGeo(w, d, y, backOff = 0, segs = 26) {
  const ring = wcUrinalRing(w, d, y, backOff, segs);
  const pos = [backOff, y, 0];
  for (const p of ring) pos.push(p[0], p[1], p[2]);
  const idx = [];
  for (let j = 0; j < segs; j++) idx.push(0, j + 1, j + 2);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo;
}
function wcUrinalBandGeo(r0, r1, segs = 26) {
  const pos = [], idx = [];
  for (const p of r0) pos.push(...p);
  for (const p of r1) pos.push(...p);
  for (let j = 0; j < segs; j++) {
    const a = j, b = j + 1, c = segs + 1 + j, d = c + 1;
    idx.push(a, b, c, b, d, c);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo;
}
/* 内胆后壁：贴墙的竖板，四边和内胆壳的墙端对严。平面朝房间、顶灯只擦着照，
   会显得又平又灰；中间往盆里鼓 8 mm，既出一点明暗，底边也埋进盆底把接缝藏掉。 */
function wcUrinalBackGeo(levels, backOff = 0, segs = 8) {
  const pos = [], uv = [], idx = [];
  const bulge = 0.008;
  const y0 = levels[0].y, y1 = levels[levels.length - 1].y;
  for (const lv of levels) {
    const hw = lv.w / 2;
    for (let i = 0; i <= segs; i++) {
      const z = hw - (2 * hw * i) / segs;
      const t = z / hw;
      pos.push(backOff + bulge * (1 - t * t), lv.y, z);
      uv.push(i / segs, (lv.y - y0) / (y1 - y0));
    }
  }
  for (let r = 0; r < levels.length - 1; r++) {
    for (let i = 0; i < segs; i++) {
      const a = r * (segs + 1) + i, b = a + 1;
      const c = a + segs + 1, d = c + 1;
      idx.push(a, b, c, b, d, c);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo;
}
/* 一间卫生间：洗手区 + 内门 + 厕所区。kind = 'men' | 'women' */
function buildWcRoom([x0, x1, z0, z1], kind) {
  const men = kind === 'men';
  const wx0 = x0 + 0.04, wx1 = x1 - 0.04, wz0 = z0 + 0.04, wz1 = z1 - 0.04;
  const IX0 = wx0 + 0.02, IX1 = wx1 - 0.02;      // 贴完 2 cm 墙砖后的净墙面
  const IZ0 = wz0 + 0.02;
  const ZIN = f => z0 + f;
  const Z_DIV = ZIN(2.20);
  const entryX = men ? wx1 : wx0;
  const outSign = men ? 1 : -1;                  // 从房间看向前室的方向
  const cx = (x0 + x1) / 2;

  // ── 地面：大块灰砖 ──
  slabRect(x0, x1, z0, z1, 0.004, matWcFloor, false);

  // ── 墙面：灰石纹大砖，前室那一侧留出 0.9 m 门洞 ──
  const T = 0.02, H = ROOM_H;
  box(world, wx1 - wx0, H, T, cx, H / 2, wz0 + T / 2, matWcWall, false);   // 北（洗手台北墙）
  box(world, wx1 - wx0, H, T, cx, H / 2, wz1 - T / 2, matWcWall, false);   // 南（尽头墙）
  const farX = men ? wx0 : wx1;
  box(world, T, H, wz1 - wz0, farX + (men ? 1 : -1) * T / 2, H / 2,
    (wz0 + wz1) / 2, matWcWall, false);
  for (const [a, b] of [[wz0, WC_MEN_DOOR_Z[0]], [WC_MEN_DOOR_Z[1], wz1]]) {
    box(world, T, H, b - a, entryX + (men ? -1 : 1) * T / 2, H / 2,
      (a + b) / 2, matWcWall, false);
  }
  box(world, T, ROOM_H - 2.06, WC_MEN_DOOR_Z[1] - WC_MEN_DOOR_Z[0],
    entryX + (men ? -1 : 1) * T / 2, (ROOM_H + 2.06) / 2,
    (WC_MEN_DOOR_Z[0] + WC_MEN_DOOR_Z[1]) / 2, matWcWall, false);

  // ── 洗手区：北墙石台三盆 + 通长大镜 ──
  const VX0 = IX0 + 0.06, VX1 = IX1 - 0.06;
  const VZ = IZ0 + 0.30;
  const VL = VX1 - VX0;
  box(world, VL, 0.80, 0.52, (VX0 + VX1) / 2, 0.42, VZ, matWcCab, false);
  box(world, VL - 0.04, 0.10, 0.46, (VX0 + VX1) / 2, 0.05, VZ + 0.015, matDeskLeg, false);
  box(world, VL + 0.05, 0.06, 0.57, (VX0 + VX1) / 2, 0.86, VZ, matWcStone, false);
  for (let i = 1; i < 5; i++) {
    box(world, 0.008, 0.74, 0.012, VX0 + (VL / 5) * i, 0.43, VZ + 0.266, matWcEdge, false);
  }
  deskRects.push({ minX: VX0, maxX: VX1, minZ: IZ0, maxZ: VZ + 0.30, top: 0.95 });
  const bxs = [VX0 + 0.37, (VX0 + VX1) / 2, VX1 - 0.37];
  for (const bx of bxs) {
    const rim = cyl(0.185, 0.185, 0.014, 22, matScreenW, bx, 0.895, VZ + 0.01);
    rim.scale.z = 1.30;
    const hole = cyl(0.150, 0.150, 0.006, 22, matWcBasin, bx, 0.903, VZ + 0.01);
    hole.scale.z = 1.30;
    cyl(0.022, 0.022, 0.006, 10, matAlu, bx, 0.908, VZ + 0.01);
    box(world, 0.035, 0.20, 0.035, bx, 0.98, IZ0 + 0.10, matAlu, false);
    box(world, 0.028, 0.028, 0.16, bx, 1.07, IZ0 + 0.17, matAlu, false);
    box(world, 0.07, 0.022, 0.05, bx, 1.09, IZ0 + 0.10, matAlu, false);
  }
  box(world, VL - 0.02, 1.28, 0.03, (VX0 + VX1) / 2, 1.80, wz0 + 0.045, matWcMirrorFrame, false);
  addPlane(VL - 0.10, 1.20, matWcMirror,
    V((VX0 + VX1) / 2, 1.80, wz0 + 0.063), R(0, 0, 0));
  box(world, 0.11, 0.24, 0.10, VX0 + 0.16, 1.38, wz0 + 0.11, matScreenW, false);
  box(world, 0.05, 0.07, 0.07, VX0 + 0.16, 1.23, wz0 + 0.14, matAlu, false);
  cyl(0.045, 0.035, 0.10, 8, matPropRed, VX0 + 0.10, 0.94, VZ + 0.02);
  cone(0.060, 0.13, 6, matModelGreen, VX0 + 0.26, 1.04, VZ + 0.06);
  cone(0.050, 0.11, 6, matModelGreen, VX0 + 0.32, 1.03, VZ - 0.02);
  cone(0.045, 0.10, 6, matModelGreen, VX0 + 0.27, 1.02, VZ - 0.06);
  cyl(0.075, 0.062, 0.10, 10, matWcCab, VX0 + 0.28, 0.96, VZ + 0.02);
  wcLed((VX0 + VX1) / 2, IZ0 + 0.95, 0.85, 0.5);

  // ── 洗手区 / 厕所区之间的墙：0.9 m 门洞 + 半开棕框玻璃门 ──
  const dw = 0.90;
  const d0 = men ? wx0 + 0.50 : wx1 - 1.40;
  const d1 = d0 + dw;
  for (const [a, b] of [[wx0, d0], [d1, wx1]]) {
    box(world, b - a, ROOM_H, 0.08, (a + b) / 2, ROOM_H / 2, Z_DIV, matWcWall, false);
    wcSolid(a, b, Z_DIV - 0.05, Z_DIV + 0.05);
  }
  box(world, d1 - d0, ROOM_H - 2.06, 0.08, (d0 + d1) / 2, (ROOM_H + 2.06) / 2,
    Z_DIV, matWcWall, false);
  for (const [a, b] of [[d0 - 0.05, d0], [d1, d1 + 0.05]]) {
    box(world, 0.10, 2.12, 0.11, (a + b) / 2, 1.06, Z_DIV, matWoodDark, false);
  }
  box(world, d1 - d0 + 0.10, 0.10, 0.11, (d0 + d1) / 2, 2.10, Z_DIV, matWoodDark, false);
  {
    const hx = men ? d0 : d1;
    const g = new THREE.Group();
    g.position.set(hx, 0, Z_DIV);
    g.rotation.y = Math.PI / 2;                       // 门扇朝洗手区（北）开
    world.add(g);
    box(g, dw - 0.05, 2.03, 0.045, (dw - 0.05) / 2, 1.015, 0, matWoodDark, false);
    box(g, 0.24, 1.14, 0.02, (dw - 0.05) * 0.56, 1.30, 0.034, matWcFrost, false);
    box(g, 0.24, 1.14, 0.02, (dw - 0.05) * 0.56, 1.30, -0.034, matWcFrost, false);
    box(g, 0.05, 0.05, 0.16, dw - 0.18, 1.02, 0.075, matAlu, false);
    wcSolid(hx - 0.06, hx + 0.06, Z_DIV - (dw - 0.05), Z_DIV, 2.4);
  }

  // ── 厕所区：6 间通顶隔间 ──
  const nStall = 6, sw = 0.80, sDepth = 1.22;
  const zStart = ZIN(2.60);
  const sWall = men ? IX1 : IX0;
  const sFront = sWall + (men ? -sDepth : sDepth);
  for (let k = 0; k <= nStall; k++) {
    const zb = zStart + k * sw;
    box(world, sDepth, 2.9, 0.045, (sFront + sWall) / 2, 1.45, zb, matWcPart, false);
    box(world, 0.024, 2.9, 0.06, sFront, 1.45, zb, matWcEdge, false);
    wcSolid(Math.min(sFront, sWall), Math.max(sFront, sWall),
      zb - 0.03, zb + 0.03, 2.9);
  }
  for (let k = 0; k < nStall; k++) {
    const zs = zStart + k * sw + 0.03;
    const zc = zs + (sw - 0.06) / 2;
    const d = makeSwingDoor({
      hx: sFront, hz: zs, width: sw - 0.06, closedYaw: -Math.PI / 2,
      openYaw: men ? 0 : Math.PI, leafMat: matWcPart, height: 2.72,
      name: '隔间门', startOpen: (k === 1 || k === 4),
      rect: { minX: sFront - 0.04, maxX: sFront + 0.04,
        minZ: zs, maxZ: zs + sw - 0.06, top: 2.4 },
    });
    for (const hg of [d.hinge, d.hinge2]) {
      box(hg, 0.02, 2.66, 0.055, 0.035, 1.36, 0, matWcEdge, false);
      box(hg, 0.02, 2.66, 0.055, sw - 0.095, 1.36, 0, matWcEdge, false);
      for (const s of [-1, 1]) {
        const knob = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.032, 12), matAlu);
        knob.rotation.x = Math.PI / 2;
        knob.position.set(sw - 0.18, 1.02, s * 0.052);
        hg.add(knob);
      }
    }

    // 蹲便器：长边朝隔间里面（沿 x），脚垫在两侧
    const panBack = sWall + (men ? -0.04 : 0.04);
    const panCX = panBack + (men ? -0.475 : 0.475);
    box(world, 0.95, 0.09, 0.62, panCX, 0.045, zc, matScreenW, false);
    box(world, 0.98, 0.02, 0.65, panCX, 0.10, zc, matScreenW, false);
    const lip = cyl(0.165, 0.165, 0.012, 22, matScreenW, panCX - (men ? -0.28 : 0.28), 0.118, zc);
    lip.scale.x = 1.55;
    const hole = cyl(0.122, 0.122, 0.008, 22, matWcBasin,
      panCX - (men ? -0.28 : 0.28), 0.125, zc);
    hole.scale.x = 1.55;
    cyl(0.032, 0.032, 0.006, 12, matWcDark,
      panCX - (men ? -0.37 : 0.37), 0.130, zc);
    for (const sz of [-1, 1]) for (let r = 0; r < 4; r++) {
      box(world, 0.52, 0.008, 0.026, panCX + 0.04, 0.118, zc + sz * (0.19 + r * 0.042),
        matScreenW, false);
    }
    wcSolid(Math.min(panCX - 0.49, panCX + 0.49), Math.max(panCX - 0.49, panCX + 0.49),
      zc - 0.325, zc + 0.325, 0.12);
    // 冲水阀（后墙低处）+ 蓝纸篓 + 挂钩 + 角架 + 纸盒
    cyl(0.018, 0.018, 0.46, 8, matAlu, sWall + (men ? -0.045 : 0.045), 0.36, zc);
    box(world, 0.08, 0.035, 0.035, sWall + (men ? -0.10 : 0.10), 0.56, zc, matAlu, false);
    const binX = sFront + (men ? 0.16 : -0.16), binZ = zc + 0.24;
    cyl(0.105, 0.082, 0.28, 10, matWcBin, binX, 0.14, binZ);
    cyl(0.112, 0.112, 0.022, 10, matWcEdge, binX, 0.28, binZ);
    const hookZ = zs + 0.06;
    box(world, 0.03, 0.03, 0.10, sWall + (men ? -0.08 : 0.08), 1.02, hookZ + 0.10,
      matAlu, false);
    const shelf = box(world, 0.18, 0.02, 0.18,
      sFront + (men ? 0.26 : -0.26), 0.98, zs + 0.07, matWcPart, false);
    shelf.rotation.y = Math.PI / 4;
    box(world, 0.11, 0.15, 0.06,
      sFront + (men ? 0.06 : -0.06), 0.86, zs + 0.10, matScreenW, false);
  }

  // ── 对面墙：男厕小便池 / 女厕扶手 ──
  if (men) {
    const ux = IX0;
    const uz = [10.45, 11.65, 12.85];
    const matWcHinge = new THREE.MeshLambertMaterial({ color: 0x8a6d3b });
    /* 按照片重做：陶瓷盾形、背面平贴墙、上口一圈宽唇；便斗离地约 28 cm，
       下面一根白色排水管接地面（底端缠胶带）。旧版那种"细颈高脚杯"不见了。 */
    /* 白釉在灰砖卫生间里只靠环境光会发灰，尤其朝上的唇面和内胆；加一点
       自发光把阴影提亮（不是灯，只到"白瓷"该有的亮度）。 */
    const matUrinal = new THREE.MeshStandardMaterial({
      color: 0xf3f1ea, roughness: 0.32, emissive: 0xffffff, emissiveIntensity: 0.16,
    });
    const matUrinalIn = new THREE.MeshStandardMaterial({
      color: 0xf2f0e9, roughness: 0.40, side: THREE.DoubleSide, vertexColors: true,
      emissive: 0xffffff, emissiveIntensity: 0.05,
    });
    /* 后壁是一块正对房间的竖面，顶灯擦着照，跟内胆同材质会暗一大截；
       单独补一点自发光把亮度拉回白釉，不能让它看着像插进去的灰塑料板。 */
    const matUrinalBack = new THREE.MeshStandardMaterial({
      color: 0xf2f0e9, roughness: 0.40, side: THREE.DoubleSide, vertexColors: true,
      emissive: 0xffffff, emissiveIntensity: 0.2,
    });
    const matUrinalPipe = new THREE.MeshLambertMaterial({ color: 0xe4e1d7 });
    const matUrinalTape = new THREE.MeshLambertMaterial({ color: 0xd6d0c1 });
    const matUrinalSteel = new THREE.MeshLambertMaterial({ color: 0x9aa0a2 });
    const matUrinalSink = new THREE.MeshLambertMaterial({ color: 0xa9aba5 });
    const SEG = 26;
    /* 内胆后壁贴墙（只留 1.2 cm 瓷厚）。照片里尿斗后壁是整片贴在瓷砖上的；
       原来留 4.5 cm 安装台，从俯视看就是一块离墙的白色挡板。 */
    const backIn = 0.012;
    /* 外轮廓。上一版唇口几乎是水平的，站立视角下整圈白唇在投影里连成一片，
       看着就像盆口盖了一块白挡板；实拍照片是"后沿高、前沿低"的斜面开口，
       前唇比后沿低 29 cm，站着一低头就能看进盆里。
       每层的前沿高度 y-drop 必须单调上升，否则壳体在前脸会翻折。 */
    const outLevels = [
      { y: 0.290, w: 0.176, d: 0.136 },
      { y: 0.330, w: 0.210, d: 0.166, drop: 0.010 },
      { y: 0.390, w: 0.250, d: 0.196, drop: 0.035 },
      { y: 0.470, w: 0.296, d: 0.228, drop: 0.070 },
      { y: 0.560, w: 0.338, d: 0.258, drop: 0.110 },
      { y: 0.660, w: 0.376, d: 0.290, drop: 0.160 },
      { y: 0.760, w: 0.404, d: 0.318, drop: 0.215 },
      { y: 0.850, w: 0.420, d: 0.338, drop: 0.245 },
      { y: 0.918, w: 0.428, d: 0.348, drop: 0.272 },
      { y: 0.955, w: 0.430, d: 0.352, endl: 0.202, drop: 0.281 },
      { y: 0.970, w: 0.426, d: 0.352, endl: 0.199, drop: 0.290 },
    ];
    /* 内胆：唇口比外沿低 2 cm、内收 1.4~2 cm，盆口占整个顶面 3/4 以上；
       盆底抬到 0.50 m，排水口落在盆底偏前的平处，站着低头就能看见。
       每层和外壳仍留 2 cm 以上瓷壁。 */
    const inLevels = [
      { y: 0.500, w: 0.270, d: 0.215 },
      { y: 0.560, w: 0.300, d: 0.238, drop: 0.045 },
      { y: 0.640, w: 0.330, d: 0.268, drop: 0.085 },
      { y: 0.720, w: 0.354, d: 0.288, drop: 0.130 },
      { y: 0.800, w: 0.372, d: 0.305, drop: 0.175 },
      { y: 0.875, w: 0.386, d: 0.318, drop: 0.220 },
      { y: 0.948, w: 0.398, d: 0.332, drop: 0.280 },
    ];
    /* 顶唇就是从外沿卷到内胆口的那一圈窄边，外圈和内胆口同高差、同斜度，
       两者共用同一条边界，贴墙处不会再冒出"牛角"。 */
    const ringTop = wcUrinalRing(0.426, 0.352, 0.970, 0, SEG, 0.199, 0.290);
    const ringD = wcUrinalRing(0.398, 0.332, 0.948, backIn, SEG, undefined, 0.280);
    const lipGeo = wcUrinalBandGeo(ringTop, ringD, SEG);
    const outFloorGeo = wcUrinalFloorGeo(0.176, 0.136, 0.290, 0, SEG);
    const inFloorGeo = wcUrinalFloorGeo(0.270, 0.215, 0.500, backIn, SEG);
    const bodyGeo = wcUrinalShell(outLevels, 0, SEG);
    /* 内胆从盆底往上渐渐提亮：灰砖房里纯白内壁没有明暗，整圈唇口和盆底
       会连成一片白，怎么看都像盖着盖子。 */
    const innerGeo = wcUrinalShell(inLevels, backIn, SEG);
    {
      const pa = innerGeo.getAttribute('position');
      const cols = new Float32Array(pa.count * 3);
      for (let i = 0; i < pa.count; i++) {
        const t = Math.min(1, Math.max(0, (pa.getY(i) - 0.50) / 0.448));
        const v = 0.82 + 0.18 * t;
        cols[i * 3] = cols[i * 3 + 1] = cols[i * 3 + 2] = v;
      }
      innerGeo.setAttribute('color', new THREE.BufferAttribute(cols, 3));
    }
    {
      const n = inFloorGeo.getAttribute('position').count;
      const cols = new Float32Array(n * 3).fill(0.86);
      inFloorGeo.setAttribute('color', new THREE.BufferAttribute(cols, 3));
    }
    /* 后壁沿用内胆那条由下往上的明暗曲线，颜色才和两侧白釉接得上；
       它正对房间、受光最少，材质里另补了一点自发光。 */
    const backGeo = wcUrinalBackGeo(inLevels, backIn);
    {
      const pa = backGeo.getAttribute('position');
      const cols = new Float32Array(pa.count * 3);
      for (let i = 0; i < pa.count; i++) {
        const t = Math.min(1, Math.max(0, (pa.getY(i) - 0.50) / 0.448));
        const v = 0.82 + 0.18 * t;
        cols[i * 3] = cols[i * 3 + 1] = cols[i * 3 + 2] = v;
      }
      backGeo.setAttribute('color', new THREE.BufferAttribute(cols, 3));
    }
    for (const z of uz) {
      const g = new THREE.Group();
      g.position.set(ux, 0, z);
      world.add(g);
      const body = new THREE.Mesh(bodyGeo, matUrinal);
      body.castShadow = true; body.receiveShadow = true;
      g.add(body);
      /* 内胆不接烘死的阴影：顶唇会在自己碗里投下一道很重的影，照片里的
         白釉内壁是亮的，接了就成灰塑料盆。 */
      const inner = new THREE.Mesh(innerGeo, matUrinalIn);
      inner.receiveShadow = false;
      g.add(inner);
      const back = new THREE.Mesh(backGeo, matUrinalBack);
      back.receiveShadow = false;
      g.add(back);
      const lip = new THREE.Mesh(lipGeo, matUrinal);
      lip.castShadow = true;
      g.add(lip);
      const bottom = new THREE.Mesh(outFloorGeo, matUrinal);
      g.add(bottom);
      const inBottom = new THREE.Mesh(inFloorGeo, matUrinalIn);
      g.add(inBottom);
      // 离地排水立管：白管 + 上端卡箍 + 地面胶带/法兰
      const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.026, 0.30, 12), matUrinalPipe);
      pipe.position.set(0.070, 0.150, 0);
      pipe.castShadow = true;
      g.add(pipe);
      const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.031, 0.031, 0.022, 12), matUrinal);
      collar.position.set(0.070, 0.279, 0);
      g.add(collar);
      const tape = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.034, 0.085, 12), matUrinalTape);
      tape.position.set(0.070, 0.055, 0);
      g.add(tape);
      for (const ty of [0.028, 0.058, 0.088]) {
        const wrap = new THREE.Mesh(new THREE.CylinderGeometry(0.0345, 0.0345, 0.007, 12), matUrinalTape);
        wrap.position.set(0.070, ty, 0);
        g.add(wrap);
      }
      const flange = new THREE.Mesh(new THREE.CylinderGeometry(0.054, 0.058, 0.012, 16), matUrinalTape);
      flange.position.set(0.070, 0.006, 0);
      g.add(flange);
      /* 盆底偏前一处排水槽：浅灰沉槽里嵌不锈钢滤网（照片里那个圆盖），
         滤网比槽面略高一点，孔打穿成深色。 */
      const sink = new THREE.Mesh(new THREE.CircleGeometry(0.052, 24), matUrinalSink);
      sink.rotation.x = -Math.PI / 2;
      sink.scale.set(1, 0.86, 1);
      sink.position.set(0.155, 0.5012, 0);
      g.add(sink);
      const drain = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, 0.006, 20), matUrinalSteel);
      drain.position.set(0.155, 0.5045, 0);
      g.add(drain);
      const drainRing = new THREE.Mesh(new THREE.TorusGeometry(0.0385, 0.0022, 8, 24), matUrinalSteel);
      drainRing.rotation.x = -Math.PI / 2;
      drainRing.position.set(0.155, 0.5074, 0);
      g.add(drainRing);
      for (const [rad, n] of [[0.026, 12], [0.012, 6]]) {
        for (let i = 0; i < n; i++) {
          const a = (i / n) * Math.PI * 2 + 0.2;
          const hole = new THREE.Mesh(new THREE.CylinderGeometry(0.0028, 0.0028, 0.0016, 6), matWcDark);
          hole.position.set(0.155 + Math.cos(a) * rad, 0.5077, Math.sin(a) * rad);
          g.add(hole);
        }
      }
      const screw = new THREE.Mesh(new THREE.CylinderGeometry(0.0042, 0.0042, 0.0016, 10), matUrinalSteel);
      screw.position.set(0.155, 0.508, 0);
      g.add(screw);
      // 上口内侧的感应冲水头：白圆盘 + 灰圈 + 黑缝
      const sensorBack = new THREE.Mesh(new THREE.CylinderGeometry(0.041, 0.043, 0.030, 20), matUrinal);
      sensorBack.rotation.z = -Math.PI / 2;
      sensorBack.position.set(backIn + 0.010, 0.858, 0);
      g.add(sensorBack);
      const sensorRing = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.0024, 8, 24), matUrinalSteel);
      sensorRing.rotation.y = Math.PI / 2;
      sensorRing.position.set(backIn + 0.0265, 0.858, 0);
      g.add(sensorRing);
      const sensorFace = new THREE.Mesh(new THREE.CylinderGeometry(0.031, 0.032, 0.006, 20), matScreenW);
      sensorFace.rotation.z = -Math.PI / 2;
      sensorFace.position.set(backIn + 0.0285, 0.858, 0);
      g.add(sensorFace);
      const slit = box(g, 0.0025, 0.007, 0.027, backIn + 0.032, 0.858, 0, matWcDark, false);
      slit.castShadow = false;
      wcSolid(ux + 0.010, ux + 0.360, z - 0.215, z + 0.215, 0.96);
    }
    for (const z of [9.85, 11.05, 12.25, 13.45]) {
      box(world, 0.42, 1.26, 0.04, ux + 0.21, 0.68, z, matWcPart, false);
      box(world, 0.03, 1.26, 0.055, ux + 0.405, 0.68, z, matWcEdge, false);
      // 照片里隔板靠前一侧的黄铜色合页和落到地面的不锈钢脚
      for (const hy of [0.56, 1.02]) {
        cyl(0.024, 0.024, 0.016, 10, matWcHinge, ux + 0.432, hy, z,
          [0, 0, Math.PI / 2]);
      }
      cyl(0.017, 0.017, 0.30, 8, matAlu, ux + 0.38, 0.15, z);
      wcSolid(ux - 0.02, ux + 0.43, z - 0.03, z + 0.03, 1.26);
    }
    wcLed(cx, ZIN(4.6), 1.05, 0.55);
    wcLed(cx, ZIN(6.6), 1.05, 0.55);
  } else {
    cyl(0.025, 0.025, 3.9, 8, matAlu, IX1 - 0.08, 0.95, ZIN(4.45), [Math.PI / 2, 0, 0]);
    for (const f of [2.55, 4.45, 6.35]) {
      box(world, 0.10, 0.08, 0.08, IX1 - 0.12, 0.95, ZIN(f), matAlu, false);
    }
    wcLed(cx, ZIN(4.6), 1.05, 0.55);
    wcLed(cx, ZIN(6.6), 1.05, 0.55);
  }

  // ── 尽头：深灰门 + 暖气片 + 纸盒 + 白立管 + 地上纸 ──
  const edx = cx + (men ? 0.10 : -0.10);
  box(world, 1.00, 2.10, 0.05, edx, 1.05, wz1 - 0.06, matWcDark, false);
  box(world, 0.06, 0.10, 0.06, edx - 0.44, 1.02, wz1 - 0.10, matAlu, false);
  box(world, 0.06, 0.10, 0.06, edx + 0.44, 1.02, wz1 - 0.10, matAlu, false);
  box(world, 0.60, 0.05, 0.05, edx, 1.02, wz1 - 0.10, matAlu, false);
  const radX = edx + (men ? 0.72 : -0.72);
  box(world, 0.42, 0.42, 0.10, radX, 0.62, wz1 - 0.13, matScreenW, false);
  for (let i = 0; i < 7; i++) {
    box(world, 0.035, 0.36, 0.12, radX - 0.17 + i * 0.057, 0.62, wz1 - 0.14,
      matScreenW, false);
  }
  box(world, 0.14, 0.18, 0.08, edx + (men ? 0.44 : -0.44), 1.38, wz1 - 0.10,
    matScreenW, false);
  cyl(0.026, 0.026, ROOM_H, 8, matScreenW, farX + (men ? 0.14 : -0.14), ROOM_H / 2,
    wz1 - 0.07);
  const paper = box(world, 0.20, 0.004, 0.26, cx - 0.35, 0.008, ZIN(6.55),
    matScreenW, false);
  paper.rotation.y = 0.5;
  box(world, 0.28, 0.03, 0.20, cx + 0.10, 0.016, ZIN(6.3), matScreenW, false);
  cyl(0.10, 0.09, 0.16, 8, matWcBin, cx + 0.10, 0.11, ZIN(6.32));
}

/* 女厕：前室南侧 3.9×7.8。门朝北（走廊方向），进门后洗手台在东墙，
   内门在 z≈12.85，六个隔间沿西墙；北墙棕门后是一个 0.9×0.9 的常闭清洁间。 */
function buildWcWomenRoom() {
  const [x0, x1, z0, z1] = CLS_W;
  const wx0 = x0 + 0.04, wx1 = x1 - 0.04, wz0 = z0 + 0.04, wz1 = z1 - 0.04;
  const IX0 = wx0 + 0.02, IX1 = wx1 - 0.02;
  const T = 0.02, H = ROOM_H;
  const cx = (x0 + x1) / 2;
  const [d0, d1] = WC_WOMEN_DOOR_X;
  const [b0, b1] = WC_BROWN_DOOR;
  const cS = z0 + WC_CLOSET_D;

  slabRect(x0, x1, z0, z1, 0.004, matWcFloor, false);

  // 北墙：女厕门两侧 + 门楣；棕门那一段后面是清洁间，不做成房间北墙
  for (const [a, b] of [[wx0, b0], [b1, d0], [d1, wx1]]) {
    box(world, b - a, H, T, (a + b) / 2, H / 2, wz0 + T / 2, matWcWall, false);
  }
  box(world, d1 - d0, H - 2.06, T, (d0 + d1) / 2, (H + 2.06) / 2,
    wz0 + T / 2, matWcWall, false);
  // 南 / 东 / 西墙砖
  box(world, wx1 - wx0, H, T, cx, H / 2, wz1 - T / 2, matWcWall, false);
  box(world, T, H, wz1 - wz0, wx1 - T / 2, H / 2, (wz0 + wz1) / 2, matWcWall, false);
  box(world, T, H, wz1 - wz0, wx0 + T / 2, H / 2, (wz0 + wz1) / 2, matWcWall, false);

  // 清洁间：棕门后 0.9×0.9，常闭；三面墙把它和女厕隔开
  box(world, 0.08, H, cS - wz0, b0 + 0.04, H / 2, (wz0 + cS) / 2, matWcWall, false);
  box(world, 0.08, H, cS - wz0, b1 - 0.04, H / 2, (wz0 + cS) / 2, matWcWall, false);
  box(world, b1 - b0, H, 0.08, (b0 + b1) / 2, H / 2, cS - 0.04, matWcWall, false);
  wcSolid(b0, b0 + 0.08, wz0, cS, H);
  wcSolid(b1 - 0.08, b1, wz0, cS, H);
  wcSolid(b0, b1, cS - 0.08, cS, H);
  wcSolid(b0, b1, z0 - 0.04, z0 + 0.04, H);
  // 女厕北墙碰撞（女厕门洞留空；棕门常闭单算）
  wcSolid(x0, b0, z0 - 0.04, z0 + 0.04, H);
  wcSolid(b1, d0, z0 - 0.04, z0 + 0.04, H);
  wcSolid(d1, x1, z0 - 0.04, z0 + 0.04, H);

  // 女厕门：白门套，门扇向里开、贴西墙（门口朝北 = 朝走廊）
  for (const x of [d0 - 0.045, d1 + 0.045]) {
    box(world, 0.09, 2.16, 0.14, x, 1.08, z0, matWcWhite, false);
  }
  box(world, d1 - d0 + 0.18, 0.10, 0.14, (d0 + d1) / 2, 2.11, z0, matWcWhite, false);
  box(world, d1 - d0, 0.018, 0.22, (d0 + d1) / 2, 0.009, z0, matBase, false);
  {
    const g = new THREE.Group();
    g.position.set(d1 - 0.015, 0, z0 + 0.02);
    g.rotation.y = -Math.PI / 2;
    world.add(g);
    const dw = d1 - d0 - 0.06;
    box(g, dw, 2.02, 0.045, dw / 2, 1.01, 0, matWcWhite, false);
    box(g, 0.05, 0.05, 0.14, dw - 0.10, 1.02, 0.06, matAlu, false);
    wcSolid(d1 - 0.06, d1 + 0.005, z0, z0 + dw, 2.10);
  }

  // ── 洗手区：东墙石台三盆 + 通长镜 ──
  const vx1 = IX1 - 0.02;
  const vz0 = z0 + 0.40, vz1 = z0 + 2.62;
  const vcx = vx1 - 0.29, vl = vz1 - vz0;
  box(world, 0.58, 0.80, vl - 0.04, vcx, 0.42, (vz0 + vz1) / 2, matWcCab, false);
  box(world, 0.54, 0.10, vl - 0.10, vcx, 0.05, (vz0 + vz1) / 2, matDeskLeg, false);
  box(world, 0.62, 0.06, vl, vcx, 0.86, (vz0 + vz1) / 2, matWcStone, false);
  for (let i = 1; i < 4; i++) {
    box(world, 0.008, 0.74, 0.012, vcx - 0.295, 0.43, vz0 + (vl / 4) * i,
      matWcEdge, false);
  }
  deskRects.push({ minX: vcx - 0.31, maxX: IX1, minZ: vz0, maxZ: vz1, top: 0.95 });
  const bzs = [vz0 + 0.35, (vz0 + vz1) / 2, vz1 - 0.35];
  for (const bz of bzs) {
    const rim = cyl(0.185, 0.185, 0.014, 22, matScreenW, vcx + 0.01, 0.895, bz);
    rim.scale.z = 1.30;
    const hole = cyl(0.150, 0.150, 0.006, 22, matWcBasin, vcx + 0.01, 0.903, bz);
    hole.scale.z = 1.30;
    cyl(0.022, 0.022, 0.006, 10, matAlu, vcx + 0.01, 0.908, bz);
    box(world, 0.035, 0.20, 0.035, IX1 - 0.10, 0.98, bz, matAlu, false);
    box(world, 0.16, 0.028, 0.028, IX1 - 0.19, 1.07, bz, matAlu, false);
    box(world, 0.05, 0.022, 0.07, IX1 - 0.10, 1.09, bz, matAlu, false);
  }
  box(world, 0.03, 1.28, vl + 0.12, IX1 - 0.015, 1.80, (vz0 + vz1) / 2,
    matWcMirrorFrame, false);
  addPlane(vl + 0.04, 1.20, matWcMirror,
    V(IX1 - 0.033, 1.80, (vz0 + vz1) / 2), R(0, -Math.PI / 2, 0));
  box(world, 0.11, 0.24, 0.10, IX1 - 0.10, 1.38, vz1 + 0.18, matScreenW, false);
  box(world, 0.05, 0.07, 0.07, IX1 - 0.12, 1.23, vz1 + 0.21, matAlu, false);
  cyl(0.045, 0.035, 0.10, 8, matPropRed, vcx - 0.12, 0.94, vz0 + 0.12);
  cone(0.060, 0.13, 6, matModelGreen, vcx - 0.22, 1.04, vz0 + 0.30);
  cone(0.050, 0.11, 6, matModelGreen, vcx - 0.10, 1.03, vz0 + 0.36);
  cone(0.045, 0.10, 6, matModelGreen, vcx - 0.16, 1.02, vz0 + 0.22);
  cyl(0.075, 0.062, 0.10, 10, matWcCab, vcx - 0.20, 0.96, vz0 + 0.28);
  wcLed(26.2, 11.6, 0.85, 0.5);

  // ── 内门：z=12.85，棕色磨砂玻璃门，向北开 ──
  const ZP = z0 + 2.95;
  const [sd0, sd1] = [26.55, 27.45];
  for (const [a, b] of [[wx0, sd0], [sd1, wx1]]) {
    box(world, b - a, H, 0.08, (a + b) / 2, H / 2, ZP, matWcWall, false);
    wcSolid(a, b, ZP - 0.05, ZP + 0.05, H);
  }
  box(world, sd1 - sd0, H - 2.06, 0.08, (sd0 + sd1) / 2, (H + 2.06) / 2,
    ZP, matWcWall, false);
  for (const x of [sd0 - 0.05, sd1 + 0.05]) {
    box(world, 0.10, 2.12, 0.11, x, 1.06, ZP, matWoodDark, false);
  }
  box(world, sd1 - sd0 + 0.10, 0.10, 0.11, (sd0 + sd1) / 2, 2.10, ZP, matWoodDark, false);
  {
    const g = new THREE.Group();
    g.position.set(sd0, 0, ZP);
    g.rotation.y = Math.PI / 2;
    world.add(g);
    const dd = sd1 - sd0 - 0.04;
    box(g, dd, 2.03, 0.045, dd / 2, 1.015, 0, matWoodDark, false);
    box(g, 0.24, 1.14, 0.02, dd * 0.56, 1.30, 0.034, matWcFrost, false);
    box(g, 0.24, 1.14, 0.02, dd * 0.56, 1.30, -0.034, matWcFrost, false);
    box(g, 0.05, 0.05, 0.16, dd - 0.12, 1.02, 0.075, matAlu, false);
    wcSolid(sd0 - 0.05, sd0 + 0.05, ZP - dd, ZP, 2.30);
  }

  // ── 6 间通顶隔间：沿西墙，门朝东 ──
  const nStall = 6, sw = 0.79, sDepth = 1.22;
  const zStart = ZP + 0.06;
  const sWall = IX0, sFront = sWall + sDepth;
  for (let k = 0; k <= nStall; k++) {
    const zb = zStart + k * sw;
    box(world, sDepth, 2.9, 0.045, (sFront + sWall) / 2, 1.45, zb, matWcPart, false);
    box(world, 0.024, 2.9, 0.06, sFront, 1.45, zb, matWcEdge, false);
    wcSolid(Math.min(sFront, sWall), Math.max(sFront, sWall), zb - 0.03, zb + 0.03, 2.9);
  }
  for (let k = 0; k < nStall; k++) {
    const zs = zStart + k * sw + 0.03;
    const zc = zs + (sw - 0.06) / 2;
    const d = makeSwingDoor({
      hx: sFront, hz: zs, width: sw - 0.06, closedYaw: -Math.PI / 2,
      openYaw: Math.PI, leafMat: matWcPart, height: 2.72,
      name: '女厕隔间门', startOpen: (k === 1 || k === 4),
      rect: { minX: sFront - 0.04, maxX: sFront + 0.04,
        minZ: zs, maxZ: zs + sw - 0.06, top: 2.4 },
    });
    for (const hg of [d.hinge, d.hinge2]) {
      box(hg, 0.02, 2.66, 0.055, 0.035, 1.36, 0, matWcEdge, false);
      box(hg, 0.02, 2.66, 0.055, sw - 0.095, 1.36, 0, matWcEdge, false);
      for (const s of [-1, 1]) {
        const knob = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.032, 12), matAlu);
        knob.rotation.x = Math.PI / 2;
        knob.position.set(sw - 0.18, 1.02, s * 0.052);
        hg.add(knob);
      }
    }
    const panBack = sWall + 0.04;
    const panCX = panBack + 0.475;
    box(world, 0.95, 0.09, 0.62, panCX, 0.045, zc, matScreenW, false);
    box(world, 0.98, 0.02, 0.65, panCX, 0.10, zc, matScreenW, false);
    const lip = cyl(0.165, 0.165, 0.012, 22, matScreenW, panCX - 0.28, 0.118, zc);
    lip.scale.x = 1.55;
    const hole = cyl(0.122, 0.122, 0.008, 22, matWcBasin, panCX - 0.28, 0.125, zc);
    hole.scale.x = 1.55;
    cyl(0.032, 0.032, 0.006, 12, matWcDark, panCX - 0.37, 0.130, zc);
    for (const sz of [-1, 1]) for (let r = 0; r < 4; r++) {
      box(world, 0.52, 0.008, 0.026, panCX + 0.04, 0.118,
        zc + sz * (0.19 + r * 0.042), matScreenW, false);
    }
    wcSolid(panCX - 0.49, panCX + 0.49, zc - 0.325, zc + 0.325, 0.12);
    cyl(0.018, 0.018, 0.46, 8, matAlu, sWall + 0.045, 0.36, zc);
    box(world, 0.08, 0.035, 0.035, sWall + 0.10, 0.56, zc, matAlu, false);
    const binX = sFront - 0.16, binZ = zc + 0.24;
    cyl(0.105, 0.082, 0.28, 10, matWcBin, binX, 0.14, binZ);
    cyl(0.112, 0.112, 0.022, 10, matWcEdge, binX, 0.28, binZ);
    box(world, 0.03, 0.03, 0.10, sWall + 0.08, 1.02, zs + 0.16, matAlu, false);
    const shelf = box(world, 0.18, 0.02, 0.18, sFront - 0.26, 0.98, zs + 0.07,
      matWcPart, false);
    shelf.rotation.y = Math.PI / 4;
    box(world, 0.11, 0.15, 0.06, sFront - 0.06, 0.86, zs + 0.10, matScreenW, false);
  }

  // 东墙通长扶手
  cyl(0.025, 0.025, 4.0, 8, matAlu, IX1 - 0.08, 0.95, 15.15, [Math.PI / 2, 0, 0]);
  for (const z of [13.25, 15.15, 17.05]) {
    box(world, 0.10, 0.08, 0.08, IX1 - 0.12, 0.95, z, matAlu, false);
  }
  wcLed(26.3, 14.9, 1.05, 0.55);

  // 尽头：深灰门 + 暖气片 + 纸盒 + 白立管 + 地上的纸 + 蓝纸篓
  const edx = cx + 0.20;
  box(world, 1.00, 2.10, 0.05, edx, 1.05, wz1 - 0.06, matWcDark, false);
  box(world, 0.06, 0.10, 0.06, edx - 0.44, 1.02, wz1 - 0.10, matAlu, false);
  box(world, 0.06, 0.10, 0.06, edx + 0.44, 1.02, wz1 - 0.10, matAlu, false);
  box(world, 0.60, 0.05, 0.05, edx, 1.02, wz1 - 0.10, matAlu, false);
  const radX = edx + 0.72;
  box(world, 0.42, 0.42, 0.10, radX, 0.62, wz1 - 0.13, matScreenW, false);
  for (let i = 0; i < 7; i++) {
    box(world, 0.035, 0.36, 0.12, radX - 0.17 + i * 0.057, 0.62, wz1 - 0.14,
      matScreenW, false);
  }
  box(world, 0.14, 0.18, 0.08, edx + 0.44, 1.38, wz1 - 0.10, matScreenW, false);
  cyl(0.026, 0.026, ROOM_H, 8, matScreenW, IX1 - 0.12, ROOM_H / 2, wz1 - 0.07);
  const paper = box(world, 0.20, 0.004, 0.26, cx - 0.35, 0.008, z1 - 1.35,
    matScreenW, false);
  paper.rotation.y = 0.5;
  box(world, 0.28, 0.03, 0.20, cx + 0.55, 0.016, z1 - 1.6, matScreenW, false);
  cyl(0.10, 0.09, 0.16, 8, matWcBin, cx + 0.55, 0.11, z1 - 1.58);
}

/* 凹进前室：正前方（南）女厕门朝北，右侧（西）男厕门朝东，女厕门右边常闭棕门。
   3.9×3.0，白墙/黑踢脚、走廊门套、牌子、摄像头、小心地滑。 */
function buildWcLobby() {
  const [x0, x1, z0, z1] = WC_LOBBY;
  const cx = (x0 + x1) / 2;
  const [o0, o1] = WC_OPEN;
  const ox = (o0 + o1) / 2;
  const [m0, m1] = WC_MEN_DOOR_Z;
  const [w0, w1] = WC_WOMEN_DOOR_X;
  const [b0, b1] = WC_BROWN_DOOR;

  slabRect(x0, x1, z0, z1, 0.006, matWcFloor, false);
  wcLed(cx, z0 + 1.55, 0.62, 0.62);

  // 前室东墙（与开水间之间；女厕南移后这面墙要单独补）
  box(world, 0.10, ROOM_H, z1 - z0, x1 - 0.05, ROOM_H / 2, (z0 + z1) / 2,
    matWall, false);

  // 西墙白饰面（男厕门洞两侧 + 门楣）+ 黑踢脚
  for (const [a, b] of [[z0, m0], [m1, z1]]) {
    box(world, 0.016, ROOM_H, b - a, x0 + 0.05, ROOM_H / 2, (a + b) / 2,
      matWcWhite, false);
    box(world, 0.026, 0.11, b - a, x0 + 0.058, 0.055, (a + b) / 2, matBase, false);
  }
  box(world, 0.016, ROOM_H - 2.06, m1 - m0, x0 + 0.05, (ROOM_H + 2.06) / 2,
    (m0 + m1) / 2, matWcWhite, false);
  box(world, WALL_T, ROOM_H - 2.06, m1 - m0, x0, (ROOM_H + 2.06) / 2,
    (m0 + m1) / 2, matWallPaint, false);

  // 南墙白饰面：女厕门 / 棕门两侧 + 门楣 + 黑踢脚
  for (const [a, b] of [[x0, b0], [b1, w0], [w1, x1]]) {
    box(world, b - a, ROOM_H, 0.016, (a + b) / 2, ROOM_H / 2, z1 - 0.05,
      matWcWhite, false);
    box(world, b - a, 0.11, 0.026, (a + b) / 2, 0.055, z1 - 0.058, matBase, false);
  }
  box(world, w1 - w0, ROOM_H - 2.06, 0.016, (w0 + w1) / 2, (ROOM_H + 2.06) / 2,
    z1 - 0.05, matWcWhite, false);
  box(world, b1 - b0, ROOM_H - 2.10, 0.016, (b0 + b1) / 2, (ROOM_H + 2.10) / 2,
    z1 - 0.05, matWcWhite, false);

  // 南墙实体（女厕北墙）：墙段 + 门楣 + 清洁间后墙
  for (const [a, b] of [[x0, b0], [b1, w0], [w1, x1]]) {
    box(world, b - a, ROOM_H, WALL_T, (a + b) / 2, ROOM_H / 2, z1, matWall, false);
  }
  box(world, w1 - w0, ROOM_H - 2.06, WALL_T, (w0 + w1) / 2, (ROOM_H + 2.06) / 2,
    z1, matWall, false);
  box(world, b1 - b0, ROOM_H - 2.10, WALL_T, (b0 + b1) / 2, (ROOM_H + 2.10) / 2,
    z1, matWall, false);

  // 东墙白饰面 + 黑踢脚
  box(world, 0.016, ROOM_H, z1 - z0, x1 - 0.114, ROOM_H / 2, (z0 + z1) / 2,
    matWcWhite, false);
  box(world, 0.026, 0.11, z1 - z0, x1 - 0.122, 0.055, (z0 + z1) / 2, matBase, false);

  // 走廊一侧白饰面（洞口两侧 + 门楣）+ 黑踢脚
  for (const [a, b] of [[x0, o0], [o1, x1]]) {
    box(world, b - a, ROOM_H, 0.016, (a + b) / 2, ROOM_H / 2, z0 + 0.05,
      matWcWhite, false);
    box(world, b - a, 0.11, 0.026, (a + b) / 2, 0.055, z0 + 0.058, matBase, false);
  }
  box(world, o1 - o0, ROOM_H - 2.43, 0.016, ox, (ROOM_H + 2.43) / 2, z0 + 0.05,
    matWcWhite, false);
  box(world, o1 - o0, ROOM_H - 2.43, WALL_T, ox, (ROOM_H + 2.43) / 2, z0,
    matWallPaint, false);

  // 走廊门洞：细边深棕门套（内贴洞口、9 cm 等宽、四角齐平）+ 黑门槛
  const FW = 0.09, FD = 0.10, FH = 2.34;
  for (const x of [o0 + FW / 2, o1 - FW / 2]) {
    box(world, FW, 2.43, FD, x, 1.215, z0, matWoodDark, false);
  }
  box(world, o1 - o0, 2.43 - FH, FD, ox, (2.43 + FH) / 2, z0,
    matWoodDark, false);
  box(world, o1 - o0, 0.018, 0.26, ox, 0.009, z0, matBase, false);

  // 男厕门套：深棕（照片右侧）
  for (const z of [m0 - 0.04, m1 + 0.04]) {
    box(world, 0.10, 2.16, 0.09, x0, 1.08, z, matWoodDark, false);
  }
  box(world, 0.10, 0.10, m1 - m0 + 0.16, x0, 2.14, (m0 + m1) / 2,
    matWoodDark, false);

  // 常闭棕门（清洁间）：门套内贴洞口、7 cm 等宽方角，门扇填满洞口
  const BW = b1 - b0, BF = 0.07, BD = 0.12;
  for (const x of [b0 + BF / 2, b1 - BF / 2]) {
    box(world, BF, 2.18, BD, x, 1.09, z1 - 0.02, matWoodDark, false);
  }
  box(world, BW, 0.08, BD, (b0 + b1) / 2, 2.14, z1 - 0.02, matWoodDark, false);
  box(world, BW, 2.10, 0.05, (b0 + b1) / 2, 1.05, z1 - 0.045, matWoodDark, false);
  box(world, 0.05, 0.05, 0.14, (b0 + b1) / 2 + 0.30, 1.02, z1 - 0.115,
    matAlu, false);

  // 黑牌：洗手间刀旗牌，左边框贴洞口西竖框，正反两面沿走廊
  {
    const sx = o0 + FW / 2, sy = 2.08, sz = z0 - FD / 2;
    const sw = 0.16, sh = 0.40, st = 0.035;
    box(world, st, sh, sw, sx, sy, sz - sw / 2, matWcEdge, false);
    for (const [dx, ry] of [[st / 2 + 0.001, Math.PI / 2],
      [-st / 2 - 0.001, -Math.PI / 2]]) {
      const p = new THREE.Mesh(new THREE.PlaneGeometry(sw - 0.02, sh - 0.03),
        matWcSignBoth);
      p.rotation.y = ry;
      p.position.set(sx + dx, sy, sz - sw / 2);
      world.add(p);
    }
  }
  wcSignBoard(matWcSignMen, 0.24, 0.30, x0 + 0.052, 2.05, m0 - 0.26, Math.PI / 2);
  wcSignBoard(matWcSignWomen, 0.24, 0.30, (w0 + w1) / 2, 2.42, z1 - 0.075, Math.PI);

  // 摄像头：前室天花角
  cyl(0.065, 0.065, 0.035, 16, matScreenW, x1 - 0.25, ROOM_H - 0.045, z1 - 0.25);
  const dome = new THREE.Mesh(
    new THREE.SphereGeometry(0.052, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), matWcDark);
  dome.position.set(x1 - 0.25, ROOM_H - 0.055, z1 - 0.25);
  dome.rotation.x = Math.PI;
  world.add(dome);

  // 黄色小心地滑牌（靠棕门/男厕一侧，不挡女厕门）
  {
    const g = new THREE.Group();
    g.position.set(25.02, 0, z1 - 0.45);
    g.rotation.y = 0.32;
    world.add(g);
    const front = box(g, 0.26, 0.48, 0.016, 0, 0.26, 0, matPropSign, false);
    front.rotation.x = -0.16;
    const plaque = new THREE.Mesh(new THREE.PlaneGeometry(0.24, 0.44), wcCautionMaterial());
    plaque.position.set(0, 0.26, 0.015);
    plaque.rotation.x = -0.16;
    g.add(plaque);
    const back = box(g, 0.26, 0.48, 0.016, 0, 0.26, 0, matPropSign, false);
    back.rotation.x = 0.16;
    wcSolid(24.86, 25.18, z1 - 0.61, z1 - 0.29, 0.55);
  }

  cyl(0.065, 0.065, 0.008, 12, matAlu, cx, 0.012, z0 + 1.9);
}

buildWcRoom(CLS_G, 'men');
buildWcWomenRoom();
buildWcLobby();

/* =========================================================================
   办公室 H：走廊东头、卫生间 G 的斜对面
   11 × 8.5 = 93.5 m²，正好是教室 E（13 × 10.8 = 140.4）的三分之二。
   门开在走廊东端墙上（z 6~8），进门朝 +X；家具沿用老办公室的深木 + 白柜。
   ========================================================================= */
function buildOffice([x0, x1, z0, z1]) {
  const cz = (z0 + z1) / 2, cxc = (x0 + x1) / 2;
  const [d0, d1] = OFFICE_DOOR;

  // 门在贴走廊那面北墙（z0），门框/门扇/门牌由 makeHallDoor('办公室门') 统一建

  // ── 白板：东墙，正对门 ──
  const BX = x1 - 0.07, BZ = cz + 0.55;
  box(world, 0.04, 1.26, 3.10, BX, 1.72, BZ, matAlu, false);
  box(world, 0.02, 1.14, 2.96, BX - 0.03, 1.72, BZ, matScreenW, false);
  box(world, 0.10, 0.04, 2.96, BX - 0.05, 1.10, BZ, matAlu, false);            // 笔槽
  box(world, 0.05, 0.03, 0.05, BX - 0.10, 1.15, BZ - 0.70, matPropRed, false);  // 红笔
  box(world, 0.05, 0.03, 0.05, BX - 0.10, 1.15, BZ - 0.50, matPropSign, false); // 蓝笔
  box(world, 0.06, 0.05, 0.14, BX - 0.10, 1.14, BZ + 0.90, matDeskLeg, false);  // 板擦

  // ── 北墙一排文件柜（四组，每组三抽）──
  for (let k = 0; k < 4; k++) {
    const fx = x0 + 1.7 + k * 1.18;
    box(world, 1.12, 1.90, 0.46, fx, 0.95, z0 + 0.27, matScreenW, false);
    box(world, 1.16, 0.05, 0.50, fx, 1.92, z0 + 0.27, matAlu, false);
    for (let d = 0; d < 3; d++) {
      const dy = 0.36 + d * 0.58;
      box(world, 1.06, 0.012, 0.01, fx, dy + 0.29, z0 + 0.505, matDeskLeg, false);  // 抽屉缝
      box(world, 0.20, 0.03, 0.03, fx, dy + 0.02, z0 + 0.515, matAlu, false);        // 拉手
    }
    deskRects.push({ minX: fx - 0.57, maxX: fx + 0.57, minZ: z0 + 0.03, maxZ: z0 + 0.51, top: 2.4 });
  }

  // ── 六个工位分开拆：东北、西南角只拆桌留椅；西北、东南角只拆椅留桌 ──
  //   列 x = x0+4.38 / x0+6.88 / x0+9.38（间距 2.5），排 z = z0+3.40 / z0+6.40（间距 3.0）；
  //   每组 1.30 × 1.02 的 U 形屏风（上一版 1.45 × 1.15，他说"稍微小一点"），
  //   人朝北坐 = 进门那条线正对着一排脸；工位之间走道 1.2 m 以上。
  //   拆桌和拆椅分开下刀，不整组消失；位置写死，主客各自加载也必须看到同一组缺口。
  {
    const PX = [x0 + 4.38, x0 + 6.88, x0 + 9.38];
    const PZ = [z0 + 3.40, z0 + 6.40];
    const PW = 1.26, PD = 0.62;                      // 桌面宽 / 深
    const POD_NO_DESK = new Set(['0,2', '1,0']);     // 东北、西南：桌+屏风+电脑撤走，椅子留
    const POD_NO_CHAIR = new Set(['0,0', '1,2']);    // 西北、东南：只撤椅子，桌和电脑留
    function podChair(x, z) {                        // 背朝南、人朝北
      box(world, 0.48, 0.09, 0.48, x, 0.47, z, matMeshChair, false);
      box(world, 0.48, 0.62, 0.07, x, 0.83, z + 0.23, matMeshChair, false);
      cyl(0.04, 0.04, 0.40, 6, matDeskLeg, x, 0.25, z);
      cyl(0.29, 0.31, 0.04, 10, matDeskLeg, x, 0.03, z);
    }
    for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) {
      const key = r + ',' + c;
      const px = PX[c], pz = PZ[r], k = r * 3 + c;
      if (!POD_NO_DESK.has(key)) {
        // 桌子
        box(world, PW, 0.05, PD, px, 0.75, pz, matWoodDark, false);
        for (const s of [-1, 1]) box(world, 0.05, 0.72, 0.55, px + s * 0.58, 0.36, pz, matDeskLeg, false);
        box(world, 1.14, 0.05, 0.03, px, 0.36, pz - 0.27, matDeskLeg, false);     // 挡腿板
        deskRects.push({ minX: px - PW / 2, maxX: px + PW / 2, minZ: pz - PD / 2, maxZ: pz + PD / 2, top: 0.78 });
        // 本工位自己的三面屏风（两侧 + 背面），1.30 m 高
        for (const s of [-1, 1]) {
          box(world, 0.05, 1.30, 0.68, px + s * 0.63, 0.65, pz, matMeshChair, false);
          box(world, 0.07, 0.05, 0.70, px + s * 0.63, 1.32, pz, matAlu, false);
          deskRects.push({ minX: px + s * 0.63 - 0.025, maxX: px + s * 0.63 + 0.025,
            minZ: pz - 0.34, maxZ: pz + 0.34, top: 1.30 });
        }
        box(world, 1.30, 1.30, 0.05, px, 0.65, pz - 0.34, matMeshChair, false);
        box(world, 1.32, 0.05, 0.07, px, 1.32, pz - 0.34, matAlu, false);
        deskRects.push({ minX: px - 0.65, maxX: px + 0.65, minZ: pz - 0.365, maxZ: pz - 0.315, top: 1.30 });
        // 显示器朝南（坐着的人），键鼠、台面小物 —— 教休室那台同款（见 pDeskPC）
        pDeskPC(px, 0.775, pz - 0.16, 0);
        // 四个工位只摆两张桌面，另外两张全空，给道具变身留位
        if (k % 2 === 0) {
          if (k % 3 === 0) { pPapers(px - 0.34, 0.777, pz - 0.02); pCup(px + 0.36, 0.777, pz - 0.12); }
          if (k % 3 === 1) pBooks(px + 0.26, 0.777, pz + 0.02, false);
          if (k % 3 === 2) pStationery(px - 0.32, 0.777, pz + 0.02);
        }
      }
      if (!POD_NO_CHAIR.has(key)) podChair(px, pz + 0.64);
    }
  }

  // ── 饮水机（西南角）+ 文件架（南墙）+ 绿植 + 垃圾桶 ──
  pCooler(x0 + 0.85, z1 - 0.45);
  pShelf(cxc - 0.70, z1 - 0.28, true);
  pPlant(x0 + 0.65, z0 + 0.60);
  pBin(x0 + 0.34, 10.60, false);        // 贴西墙，不在进门那条线上

  // ── 南墙两扇假窗（和 E/F 一样：贴在实墙内侧的发光板）──
  for (const wx of [x0 + 2.6, x0 + 8.6]) {
    box(world, 1.60, 1.45, 0.05, wx, 1.62, z1 - 0.06, matGlassDay, false);
    for (const dx of [-0.83, 0.83]) box(world, 0.07, 1.60, 0.07, wx + dx, 1.62, z1 - 0.06, matScreenW, false);
    box(world, 1.70, 0.07, 0.09, wx, 0.85, z1 - 0.06, matScreenW, false);
    box(world, 0.05, 1.66, 0.07, wx, 2.47, z1 - 0.06, matScreenW, false);
    box(world, 0.05, 1.50, 0.05, wx, 1.62, z1 - 0.09, matScreenW, false);       // 中挺
  }

  // ── 吊顶：两条长灯 + 一台吊扇 ──
  for (const lz of [z0 + 2.2, z1 - 2.2]) {
    box(world, 2.60, 0.05, 0.24, cxc, ROOM_H - 0.06, lz, matStrip, false);
  }
  pCeilingFan(cxc, ROOM_H, cz);
}
buildOffice(CLS_H);

/* 教休室 YF311 的室内不在这里新建：旧西北角那间 6×4.8 的全部陈设已整组搬过来
   （见前面 restOldRoom 与坐标总表后的组变换），这里不再补任何家具。 */

// ── 台面：把每桌/每台都点上东西。E 的长桌长边在 z（0.48 × 2.4），
//   F 的实验台长边在 x（4.8 × 0.8）—— 两种形状分开摆，别一把抓。
let clutter = 0;
for (const d of deskRects) {
  if (d.top !== 0.77) continue;
  const w = d.maxX - d.minX, dp = d.maxZ - d.minZ;
  const cx2 = (d.minX + d.maxX) / 2, cz = (d.minZ + d.maxZ) / 2;
  const slot = clutter++;
  if (slot % 2) continue;                       // 隔一桌摆一桌：空桌面留给"变书本/文具"的玩家
  const k = (slot >> 1) % 4;
  if (dp > 2.0 && w < 1.0) {                                 // E 的 2.4 m 长桌，沿 z 摆
    if (k === 0) { pBooks(cx2, DESK_Y, cz - 0.62, true); pCup(cx2, DESK_Y, cz + 0.30); }
    if (k === 1) { pPapers(cx2, DESK_Y, cz - 0.30); pCup(cx2, DESK_Y, cz + 0.72); }
    if (k === 2) { pBooks(cx2, DESK_Y, cz + 0.45, true); pPapers(cx2, DESK_Y, cz - 0.62); }
    if (k === 3) { pPapers(cx2, DESK_Y, cz + 0.10); pStationery(cx2, DESK_Y, cz - 0.80); }
  } else if (w > 4.5 && dp < 1.0) {                          // F 的 4.8 m 实验台（演示台 4.2 m 不摆，那儿已有三台显示器）
    pBooks(cx2 - 0.80, DESK_Y, cz + 0.05, false);
    pCup(cx2 + 0.80, DESK_Y, cz - 0.02);
    if (k % 2) pPapers(cx2 + 2.10, DESK_Y, cz + 0.08);
    else pStationery(cx2 + 2.05, DESK_Y, cz + 0.10);
  }
}

/* =========================================================================
   室内陈设细化：桌面办公用品 / 地毯 / 文件柜 / 纸箱 / 挂历 / 海报 / 靠垫
   —— 全部加进 world，随后和原有家具一起静态合并
   ========================================================================= */
const restDetailStart = world.children.length;
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

    // 桌面上那摞书已撤掉，留一块空台面给"变书本"的玩家

    // 散落的纸
    const sheet = box(g, 0.21, 0.004, 0.29, -0.90, topY + 0.004, -1.90, matPaper, false);
    sheet.rotation.y = 0.22;
    const sheet2 = box(g, 0.21, 0.004, 0.29, -0.86, topY + 0.008, -1.86, matPaperW, false);
    sheet2.rotation.y = -0.14;

    world.add(g);
  }

  // ---- 茶几上的书和杯子 ----
  {
    pBooks(-1.28, 0.43, -1.02, false);
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
restOldRoom.add(...world.children.splice(restDetailStart));

/* 旧教休室的抽屉和壁扇不在 world 里（要动，不能被静态合并），跟着整组搬。
   抽屉面板朝旧房 +z，转 180° 后朝 −z（屋内），所以滑出量取负。 */
for (const s of ammoSpots) {
  if (s.name !== '书桌抽屉' && s.name !== '文件柜抽屉') continue;
  const px = s.mesh.position.x, pz = s.mesh.position.z;
  s.mesh.position.set(REST_CX - REST_SX * px, 0, REST_CZ - REST_SZ * pz);
  s.mesh.rotation.y = Math.PI;
  s.mesh.scale.set(REST_SX, 1, REST_SZ);
  s.x = REST_CX - REST_SX * s.x;
  s.z = REST_CZ - REST_SZ * s.z;
  s.baseX = s.mesh.position.x;
  s.baseZ = s.mesh.position.z;
  s.slide = -Math.abs(s.slide);

  // 二楼静态同款（只做外观，抽屉不参与交互）
  const up = s.mesh.clone(true);
  up.position.y += ROOM_H + FLOOR2_LIFT;
  scene.add(up);
}
fanGroup.position.set(REST_CX - REST_SX * 2.92, 2.15, REST_CZ - REST_SZ * 0.25);
fanGroup.rotation.y = Math.PI / 2;
{
  const fan2 = fanGroup.clone(true);
  fan2.position.y += ROOM_H + FLOOR2_LIFT;
  scene.add(fan2);
}

const pendingMerge = [];      // [改5] 等 main.js 建完伪装池再合；必须在第一次 push 之前声明
try {
  pendingMerge.push(world);
} catch (err) {
  console.warn('静态合并整体失败，按原样渲染', err);
}

/* =========================================================================
   二楼：合并之后把整层静态几何克隆一份，抬到 y=ROOM_H
   -------------------------------------------------------------------------
   为什么在合并之后克隆：合并前克隆会和 mergeStatic 共用/释放同一批几何；
   合并后克隆只共享合并好的几何、不再二次合并，代价约 100 个额外 draw call。
   ⚠ 必须在楼梯建好之前克隆 —— 楼梯只属于 1F，克隆进去会在二楼再长一条。
   ========================================================================= */
let floor2Group = null;   // [改5] 克隆挪进 finishMap()：必须在合批之后

/* ── 楼梯间A 的照片纹理（照 6F 实景）────────────────────────────────
   梯级：灰色瓷砖踏面 + 深灰防滑槽；混凝土梯帮：大块灰斑；门牌：金圈黑底 6；
   防火门红牌：左图标右红底白字；地垫：深色菱形胶垫。 */
function makeStairStepTex() {
  const S = 256, N = 2, T = S / N;
  const c = newCanvas(S), g = c.getContext('2d');
  g.fillStyle = '#7f8385'; g.fillRect(0, 0, S, S);
  for (let ty = 0; ty < N; ty++) for (let tx = 0; tx < N; tx++) {
    const v = 128 + ((Math.random() * 8) | 0);
    g.fillStyle = `rgb(${v}, ${v + 1}, ${v + 1})`;
    g.fillRect(tx * T, ty * T, T, T);
    for (let i = 0; i < 2; i++) {
      const x0 = tx * T + Math.random() * T, y0 = ty * T + Math.random() * T;
      g.strokeStyle = `rgba(196,198,196,${0.05 + Math.random() * 0.05})`;
      g.lineWidth = 1 + Math.random() * 2;
      g.beginPath(); g.moveTo(x0, y0);
      g.bezierCurveTo(x0 + 36, y0 - 12, x0 + 66, y0 + 16, x0 + 100, y0 + 4);
      g.stroke();
    }
  }
  g.strokeStyle = 'rgba(80,82,81,0.55)'; g.lineWidth = 2;
  for (let i = 0; i <= N; i++) {
    g.beginPath(); g.moveTo(i * T, 0); g.lineTo(i * T, S); g.stroke();
    g.beginPath(); g.moveTo(0, i * T); g.lineTo(S, i * T); g.stroke();
  }
  sprinkleNoise(g, S, 4);
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  _aniso(tex);
  return tex;
}

// 踏步前沿的深色防滑条：六道细槽（顶面 UV 直接把整张图铺满 10 cm 深的那条）
function makeStairNoseTex() {
  const W = 64, H = 64;
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d');
  g.fillStyle = '#565a5d'; g.fillRect(0, 0, W, H);
  for (let i = 0; i < 6; i++) {
    const y = 5 + i * 9;
    g.fillStyle = 'rgba(26,29,31,0.95)'; g.fillRect(0, y, W, 3);
    g.fillStyle = 'rgba(188,192,194,0.28)'; g.fillRect(0, y + 3, W, 1);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  _aniso(tex);
  return tex;
}

function makeStairConcreteTex() {
  const S = 256;
  const c = newCanvas(S), g = c.getContext('2d');
  g.fillStyle = '#8b8a85'; g.fillRect(0, 0, S, S);
  for (let i = 0; i < 26; i++) {
    const x = Math.random() * S, y = Math.random() * S, r = 20 + Math.random() * 80;
    const gr = g.createRadialGradient(x, y, 0, x, y, r);
    gr.addColorStop(0, `rgba(74,73,69,${0.05 + Math.random() * 0.10})`);
    gr.addColorStop(1, 'rgba(74,73,69,0)');
    g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2);
  }
  for (let i = 0; i < 500; i++) {
    g.fillStyle = `rgba(70,70,66,${0.05 + Math.random() * 0.1})`;
    g.fillRect(Math.random() * S, Math.random() * S, 1, 1);
  }
  sprinkleNoise(g, S, 6);
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  _aniso(tex);
  return tex;
}

// 门上方那块金圈黑底的楼层牌
function makeStairNumTex(num) {
  const S = 256;
  const c = document.createElement('canvas'); c.width = c.height = S;
  const g = c.getContext('2d');
  g.clearRect(0, 0, S, S);
  g.save(); g.translate(S / 2, S / 2);
  g.beginPath(); g.arc(0, 0, 118, 0, Math.PI * 2); g.fillStyle = '#1a1f25'; g.fill();
  g.lineWidth = 10; g.strokeStyle = '#b08a42'; g.stroke();
  g.beginPath(); g.arc(0, 0, 98, 0, Math.PI * 2); g.lineWidth = 5; g.strokeStyle = '#d9b665'; g.stroke();
  g.beginPath(); g.arc(-30, -38, 72, Math.PI * 0.9, Math.PI * 1.55);
  g.strokeStyle = 'rgba(255,235,180,0.22)'; g.lineWidth = 8; g.stroke();
  g.fillStyle = '#d9b665'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = 'bold 150px Georgia, "Times New Roman", serif';
  g.fillText(num, 0, 10);
  g.restore();
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  _aniso(tex);
  return tex;
}

// 常闭式防火门红牌：左边白底红图标，右边红底白字
function makeStairFireSignTex() {
  const W = 256, H = 160;
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d');
  g.fillStyle = '#f4f2ec'; g.fillRect(0, 0, W, H);
  g.strokeStyle = '#b7b3a8'; g.lineWidth = 4; g.strokeRect(2, 2, W - 4, H - 4);
  g.fillStyle = '#c02a26'; g.fillRect(12, 12, 54, 54);
  g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = 'bold 30px "Microsoft YaHei",sans-serif'; g.fillText('防', 39, 40);
  g.fillStyle = '#b32320'; g.fillRect(76, 12, W - 88, H - 24);
  g.fillStyle = '#fff';
  g.font = 'bold 30px "Microsoft YaHei",sans-serif'; g.fillText('常闭式防火门', (76 + W - 12) / 2, 55);
  g.font = 'bold 26px "Microsoft YaHei",sans-serif'; g.fillText('请保持关闭', (76 + W - 12) / 2, 95);
  g.font = '12px Arial,sans-serif'; g.fillText('Keep the door closed', (76 + W - 12) / 2, 126);
  g.font = '10px "Microsoft YaHei",sans-serif'; g.fillStyle = 'rgba(255,255,255,0.75)';
  g.fillText('北京交通大学', (76 + W - 12) / 2, 144);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  _aniso(tex);
  return tex;
}

function makeStairMatTex() {
  const S = 128;
  const c = newCanvas(S), g = c.getContext('2d');
  g.fillStyle = '#2a2c2d'; g.fillRect(0, 0, S, S);
  g.strokeStyle = 'rgba(255,255,255,0.055)'; g.lineWidth = 2;
  for (let i = -S; i < S * 2; i += 16) {
    g.beginPath(); g.moveTo(i, 0); g.lineTo(i + S, S); g.stroke();
    g.beginPath(); g.moveTo(i, S); g.lineTo(i + S, 0); g.stroke();
  }
  g.strokeStyle = 'rgba(0,0,0,0.55)'; g.lineWidth = 6; g.strokeRect(3, 3, S - 6, S - 6);
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  _aniso(tex);
  return tex;
}

function makeStairNoticeTex() {
  const W = 256, H = 160;
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d');
  g.fillStyle = '#f6f4ed'; g.fillRect(0, 0, W, H);
  g.strokeStyle = '#b9b5aa'; g.lineWidth = 4; g.strokeRect(2, 2, W - 4, H - 4);
  g.fillStyle = '#b32320'; g.fillRect(10, 10, W - 20, 34);
  g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.font = 'bold 22px "Microsoft YaHei",sans-serif'; g.fillText('消防设施 · 请勿遮挡', W / 2, 28);
  g.fillStyle = '#2a5d9c'; g.fillRect(28, 58, 64, 64);
  g.fillStyle = '#fff'; g.font = 'bold 40px "Microsoft YaHei",sans-serif'; g.fillText('消', 60, 92);
  g.fillStyle = '#c02a26'; g.fillRect(110, 58, 64, 64);
  g.fillStyle = '#fff'; g.fillText('防', 142, 92);
  g.fillStyle = '#555'; g.font = '16px "Microsoft YaHei",sans-serif';
  g.fillText('保持疏散通道畅通', W / 2, 140);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  _aniso(tex);
  return tex;
}

/* ── 两座楼梯间共用同一套照片材质（A 在西头、B 在东头）─────────────────
   贴图只做一次：灰砖踏步、防滑槽、混凝土梯帮、6 号金圈牌、常闭红牌、菱形地垫、
   消防设施牌。楼梯间 B 也照 6F 实景照片重做，共用材质才不会被合批拆成两套。 */
const matSWall = new THREE.MeshLambertMaterial({ map: makePaintTexture('#eae8e1', '98,94,86') });
METRIC_UV.set(matSWall, 4);
const matSStep = new THREE.MeshLambertMaterial({ map: makeStairStepTex() });
METRIC_UV.set(matSStep, 1.2);
const matSNose = new THREE.MeshLambertMaterial({ map: makeStairNoseTex() });
const matSRail = new THREE.MeshLambertMaterial({ color: 0x9ea3a6 });
const matSConcrete = new THREE.MeshLambertMaterial({ map: makeStairConcreteTex(), side: THREE.DoubleSide });
METRIC_UV.set(matSConcrete, 2);
const matSFloor = matFloorEL;                 // 和电梯厅同一套 800 亮面灰砖
const matSFire = new THREE.MeshStandardMaterial({ color: 0xc4c6c3, roughness: 0.60, metalness: 0.04 });
const matSTrim = new THREE.MeshLambertMaterial({ color: 0xe4e2da });
const matSHard = new THREE.MeshStandardMaterial({ color: 0xb9bdc0, roughness: 0.3, metalness: 0.7 });
const matSRad = new THREE.MeshLambertMaterial({ color: 0x8f9390 });
const matSMat = new THREE.MeshLambertMaterial({ map: makeStairMatTex() });
const matSBeige = new THREE.MeshLambertMaterial({ color: 0xcfc7ad });
const matSDark = new THREE.MeshLambertMaterial({ color: 0x171a1c });
const matSBlack = new THREE.MeshBasicMaterial({ color: 0x101315, toneMapped: false });
const texNum = makeStairNumTex('6');
const matPlaque = new THREE.MeshBasicMaterial({ map: texNum, transparent: true, alphaTest: 0.08, toneMapped: false });
const matFireSign = new THREE.MeshBasicMaterial({ map: makeStairFireSignTex(), toneMapped: false });
const matNotice = new THREE.MeshBasicMaterial({ map: makeStairNoticeTex(), toneMapped: false });

// 东头楼梯间 B 用同一套材质，所以放在材质定义之后建（函数体在前面声明）
buildStairB(CLS_STB);

/* =========================================================================
   楼梯间A：照 6F 实景照片重做（白墙 / 亮面灰砖 / 灰梯级 / 不锈钢栏杆 / 双扇防火门）
   -------------------------------------------------------------------------
   结构没动：东墙上下两樘门（z 2.7~3.8）、北端 0/3 m 平台、南端 1.5 m 半平台、
   西跑 0→1.5、东跑 1.5→3.0。台阶仍然只做视觉，碰撞走 groundAt 的坡面。
   照片里两跑之间是开敞梯井 + 不锈钢栏杆 —— 原来那面 3 m 高的实体隔墙拆了，
   同一位置的碰撞盒保留（人不会从栏杆中间掉下去）。
   门照照片改成**关着的**两扇常闭防火门，挂在 swingDoors 上：按 E 开关，
   主机权威、随快照同步；关着时门板挡人（rect top 2.4），开了两边都能过。
   ========================================================================= */
{
  const stairG = new THREE.Group();
  scene.add(stairG);
  const cx = (SW_X0 + SW_X1) / 2, czc = (SW_Z0 + SW_Z1) / 2;
  const W = SW_X1 - SW_X0, D = SW_Z1 - SW_Z0;
  const IN_W = HALL_X0 + 0.04, IN_E = SW_X1, IN_N = SW_Z0 + 0.04, IN_S = SW_Z1 - 0.04;

  const B = (w, h, d, x, y, z, mat, sh = false) => box(stairG, w, h, d, x, y, z, mat, sh);
  const CYL = (r1, r2, h, seg, mat, x, y, z, rot) => {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(r1, r2, h, seg), mat);
    m.castShadow = false; m.receiveShadow = true;
    m.position.set(x, y, z);
    if (rot) m.rotation.set(rot[0] || 0, rot[1] || 0, rot[2] || 0);
    stairG.add(m);
    return m;
  };
  const PLANE = (w, h, mat, x, y, z, ry) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
    m.position.set(x, y, z);
    m.rotation.y = ry || 0;
    m.castShadow = false; m.receiveShadow = true;
    stairG.add(m);
    return m;
  };

  // ① 地面 / 顶盖
  B(W, 0.02, D, cx, 0.002, czc, matSFloor, false);
  B(W + 0.10, 0.04, D + 0.10, cx, ROOM_H * 2 - 0.02, czc, matHallCeil, false);
  // 顶上那道白梁（照片抬头能看见结构梁）
  B(W, 0.28, 0.22, cx, ROOM_H * 2 - 0.16, SW_LAND + 0.15, matSWall, false);

  // ② 三面墙刷白（和走廊同色），窗/门都落在白墙上
  const OV = 0.012;
  B(OV, ROOM_H * 2, D - 0.02, IN_W + 0.017, ROOM_H, czc, matSWall, false);
  B(W + 0.005, ROOM_H * 2, OV, cx + 0.008, ROOM_H, IN_N + 0.017, matSWall, false);
  B(W + 0.005, ROOM_H * 2, OV, cx + 0.008, ROOM_H, IN_S - 0.017, matSWall, false);

  // ③ 东墙（0~6 m）：门洞 z 2.7~3.8，上下过梁
  const EX = SW_X1 + 0.04;
  B(0.08, ROOM_H * 2, SW_DOOR[0] - SW_Z0, EX, ROOM_H, (SW_Z0 + SW_DOOR[0]) / 2, matSWall, false);
  B(0.08, ROOM_H * 2, SW_Z1 - SW_DOOR[1], EX, ROOM_H, (SW_DOOR[1] + SW_Z1) / 2, matSWall, false);
  B(0.08, 0.90, SW_DOOR[1] - SW_DOOR[0], EX, 2.55, (SW_DOOR[0] + SW_DOOR[1]) / 2, matSWall, false);
  B(0.08, 0.90, SW_DOOR[1] - SW_DOOR[0], EX, 5.55, (SW_DOOR[0] + SW_DOOR[1]) / 2, matSWall, false);

  // ④ 黑踢脚（10 cm）
  const skH = 0.10, skD = 0.024;
  const SK = (w, d, x, z, y0) => B(w, skH, d, x, y0 + skH / 2, z, matBase, false);
  SK(W - 0.02, skD, cx, IN_N + 0.029, 0);
  SK(skD, SW_MID - IN_N - 0.02, IN_W + 0.035, (IN_N + SW_MID) / 2, 0);
  SK(skD, SW_DOOR[0] - IN_N - 0.02, IN_E - 0.012, (IN_N + SW_DOOR[0]) / 2, 0);
  SK(W - 0.02, skD, cx, IN_S - 0.029, SW_RISE);
  SK(skD, IN_S - SW_MID - 0.02, IN_W + 0.035, (SW_MID + IN_S) / 2, SW_RISE);
  SK(skD, IN_S - SW_MID - 0.02, IN_E - 0.012, (SW_MID + IN_S) / 2, SW_RISE);
  SK(W - 0.02, skD, cx, IN_N + 0.029, ROOM_H);
  SK(skD, SW_LAND - IN_N - 0.02, IN_W + 0.035, (IN_N + SW_LAND) / 2, ROOM_H);
  SK(skD, SW_DOOR[0] - IN_N - 0.02, IN_E - 0.012, (IN_N + SW_DOOR[0]) / 2, ROOM_H);

  // ⑤ 平台（3 m / 1.5 m）与支撑墙
  B(W, 0.18, SW_LAND - SW_Z0, cx, ROOM_H - 0.09, (SW_Z0 + SW_LAND) / 2, matSFloor, false);
  B(W - 0.02, 0.012, SW_LAND - SW_Z0 - 0.02, cx, ROOM_H - 0.186, (SW_Z0 + SW_LAND) / 2, matSWall, false);
  B(W, 0.18, 0.03, cx, ROOM_H - 0.09, SW_LAND - 0.005, matSWall, false);
  B(W, 0.18, IN_S - SW_MID, cx, SW_RISE - 0.09, (SW_MID + IN_S) / 2, matSFloor, false);
  B(W, SW_RISE - 0.09, 0.10, cx, (SW_RISE - 0.09) / 2, SW_MID + 0.05, matSWall, false);

  // ⑥ 两跑台阶：灰砖踏面 + 深色防滑槽（视觉；碰撞见 groundAt）
  const N = 13, run = SW_RUN / N, rise = SW_RISE / N;
  let stepCount = 0;
  for (let k = 0; k < N; k++) {
    const hA = (k + 1) * rise;
    const zA = SW_LAND + (k + 0.5) * run;
    B(SW_A1 - SW_A0, hA, run, (SW_A0 + SW_A1) / 2, hA / 2, zA, matSStep, false);
    B(SW_A1 - SW_A0, 0.012, 0.10, (SW_A0 + SW_A1) / 2, hA + 0.006, SW_LAND + k * run + 0.05, matSNose, false);
    const hB = SW_RISE + (k + 1) * rise;
    const zB = SW_MID - (k + 0.5) * run;
    B(SW_B1 - SW_B0, hB, run, (SW_B0 + SW_B1) / 2, hB / 2, zB, matSStep, false);
    B(SW_B1 - SW_B0, 0.012, 0.10, (SW_B0 + SW_B1) / 2, hB + 0.006, SW_MID - k * run - 0.05, matSNose, false);
    stepCount += 2;
  }
  // 两跑外侧露出的混凝土梯帮（照片里那块灰色三角）
  function sidePlate(x, pts) {
    const n = pts.length;
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(n * 3), uv = new Float32Array(n * 2);
    pts.forEach(([z, y], i) => {
      pos[i * 3] = 0; pos[i * 3 + 1] = y; pos[i * 3 + 2] = z;
      uv[i * 2] = z; uv[i * 2 + 1] = y;
    });
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    const idx = [];
    for (let i = 1; i < n - 1; i++) idx.push(0, i, i + 1);
    g.setIndex(idx);
    g.computeVertexNormals();
    const m = new THREE.Mesh(g, matSConcrete);
    m.position.x = x;
    m.castShadow = false; m.receiveShadow = true;
    stairG.add(m);
  }
  sidePlate(SW_B0 - 0.002, [[SW_LAND, ROOM_H], [SW_MID, SW_RISE], [SW_MID, 0], [SW_LAND, 0]]);
  sidePlate(SW_A1 + 0.002, [[SW_LAND, 0], [SW_MID, SW_RISE], [SW_MID, 0]]);
  // 东跑顶端朝北那一面（门厅右手边）：刷白成墙，别让人从楼梯厅看到一大块瓷砖断面
  B(SW_B1 - SW_B0 + 0.10, ROOM_H, 0.012, (SW_B0 + SW_B1 + 0.10) / 2, ROOM_H / 2, SW_LAND - 0.008, matSWall, false);
  B(SW_B1 - SW_B0 + 0.10, skH, 0.024, (SW_B0 + SW_B1 + 0.10) / 2, skH / 2, SW_LAND - 0.026, matBase, false);

  // ⑦ 不锈钢栏杆：圆管立柱 + 五道横杆（两跑内侧 + 3 m 平台边）
  const pitch = Math.atan2(SW_RISE, SW_RUN);
  const railLen = Math.hypot(SW_RISE, SW_RUN);
  const railH = 0.96;
  let postCount = 0, barCount = 0, topRailCount = 0;
  function flightRail(x, dir) {
    const yAt = (z) => dir > 0 ? (z - SW_LAND) / SW_RUN * SW_RISE : SW_RISE + (SW_MID - z) / SW_RUN * SW_RISE;
    const surfAt = (z) => {
      const d = dir > 0 ? (z - SW_LAND) / run : (SW_MID - z) / run;
      const k = Math.max(0, Math.min(N, Math.ceil(d)));
      return (dir > 0 ? 0 : SW_RISE) + k * rise;
    };
    for (let i = 0; i < 5; i++) {
      const z = dir > 0 ? SW_LAND + 0.18 + i * (SW_RUN - 0.36) / 4
                        : SW_MID - 0.18 - i * (SW_RUN - 0.36) / 4;
      const y0 = surfAt(z), y1 = yAt(z) + railH;
      CYL(0.022, 0.022, y1 - y0, 10, matSRail, x, (y0 + y1) / 2, z);
      postCount++;
    }
    const cz = (SW_LAND + SW_MID) / 2;
    const cy = SW_RISE / 2 + railH + (dir > 0 ? 0 : SW_RISE);
    const rot = [dir > 0 ? Math.PI / 2 - pitch : -(Math.PI / 2 - pitch), 0, 0];
    CYL(0.028, 0.028, railLen, 12, matSRail, x, cy, cz, rot); topRailCount++;
    for (let b = 1; b <= 5; b++) {
      CYL(0.009, 0.009, railLen, 8, matSRail, x, cy - b * 0.135, cz, rot);
      barCount++;
    }
  }
  flightRail(SW_A1 - 0.03, 1);
  flightRail(SW_B0 + 0.03, -1);

  // 梯段下端那个 U 形防滑环（照片里挂在起步立柱旁）
  function loopGuard(x, z0, dir, yBase) {
    const len = 0.34;
    for (const y of [0.34, 0.68]) CYL(0.014, 0.014, len, 8, matSRail, x, yBase + y, z0 + dir * len / 2, [Math.PI / 2, 0, 0]);
    CYL(0.014, 0.014, 0.34, 8, matSRail, x, yBase + 0.51, z0 + dir * len);
  }
  loopGuard(SW_A1 - 0.03, SW_LAND + 0.18, 1, 0.05);
  loopGuard(SW_B0 + 0.03, SW_MID - 0.18, -1, SW_RISE + 0.05);

  // 3 m 平台南沿护栏（照片里转身处的横向栏杆）
  {
    const trZ = SW_LAND - 0.03;
    const trX0 = IN_W + 0.05, trX1 = SW_B0;
    const trTop = ROOM_H + 1.02;
    for (let i = 0; i <= 4; i++) {
      const x = trX0 + i * (trX1 - trX0) / 4;
      CYL(0.022, 0.022, 1.0, 10, matSRail, x, ROOM_H + 0.52, trZ);
      postCount++;
    }
    CYL(0.028, 0.028, trX1 - trX0, 12, matSRail, (trX0 + trX1) / 2, trTop, trZ, [0, 0, Math.PI / 2]);
    topRailCount++;
    for (let b = 1; b <= 5; b++) {
      CYL(0.009, 0.009, trX1 - trX0, 8, matSRail, (trX0 + trX1) / 2, trTop - b * 0.135, trZ, [0, 0, Math.PI / 2]);
      barCount++;
    }
  }

  // ⑧ 靠墙不锈钢扶手（斜跑 + 半平台横杆），支架落在白墙上
  function wallRail(railX, wallX, dir) {
    const yAt = (z) => dir > 0 ? (z - SW_LAND) / SW_RUN * SW_RISE : SW_RISE + (SW_MID - z) / SW_RUN * SW_RISE;
    const cz = (SW_LAND + SW_MID) / 2;
    const cy = SW_RISE / 2 + 0.90 + (dir > 0 ? 0 : SW_RISE);
    const rot = [dir > 0 ? Math.PI / 2 - pitch : -(Math.PI / 2 - pitch), 0, 0];
    CYL(0.026, 0.026, railLen, 10, matSRail, railX, cy, cz, rot);
    for (let i = 0; i < 4; i++) {
      const z = dir > 0 ? SW_LAND + 0.28 + i * (SW_RUN - 0.56) / 3 : SW_MID - 0.28 - i * (SW_RUN - 0.56) / 3;
      const y = yAt(z) + 0.90;
      CYL(0.014, 0.014, Math.abs(railX - wallX), 8, matSRail, (railX + wallX) / 2, y, z, [0, 0, Math.PI / 2]);
    }
  }
  wallRail(-9.88, -9.943, 1);
  wallRail(-7.16, -7.10, -1);
  CYL(0.026, 0.026, 0.70, 10, matSRail, -9.88, 2.40, 7.93, [Math.PI / 2, 0, 0]);
  for (const z of [7.64, 8.22]) CYL(0.013, 0.013, 0.063, 8, matSRail, -9.9115, 2.40, z, [0, 0, Math.PI / 2]);

  // ⑨ 半平台南墙的大窗：深色外圈 + 白框 + 中挺 + 白窗台
  {
    const gx = -8.5, gy = 3.35;
    const glass = new THREE.Mesh(new THREE.PlaneGeometry(1.80, 1.90), matGlassDay);
    glass.position.set(gx, gy, 8.326); glass.rotation.y = Math.PI;
    stairG.add(glass);
    const TZ = 8.332, FZ = 8.318;
    B(2.02, 0.05, 0.012, gx, 4.38, TZ, matDoorDark, false);
    B(2.02, 0.05, 0.012, gx, 2.32, TZ, matDoorDark, false);
    B(0.05, 2.06, 0.012, gx - 1.005, gy, TZ, matDoorDark, false);
    B(0.05, 2.06, 0.012, gx + 1.005, gy, TZ, matDoorDark, false);
    for (const yy of [4.30, 2.40]) B(1.90, 0.06, 0.02, gx, yy, FZ, matScreenW, false);
    for (const xx of [gx - 0.915, gx + 0.915]) B(0.07, 1.90, 0.02, xx, gy, FZ, matScreenW, false);
    B(0.05, 1.84, 0.02, gx, gy, FZ, matScreenW, false);
    B(1.80, 0.05, 0.02, gx, 3.30, FZ, matScreenW, false);
    B(2.06, 0.06, 0.14, gx, 2.29, 8.27, matScreenW, false);
  }

  // ⑩ 吸顶圆灯 + 两盏真光源（楼梯间本来一盏都没有，上去全靠走廊溢光）
  {
    const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.19, 0.018, 20), matWhitePlastic);
    ring.position.set(-8.5, ROOM_H * 2 - 0.03, 5.0);
    stairG.add(ring);
    const face = new THREE.Mesh(new THREE.CircleGeometry(0.15, 20),
      new THREE.MeshBasicMaterial({ color: 0xfff5e6, toneMapped: false }));
    face.rotation.x = Math.PI / 2;
    face.position.set(-8.5, ROOM_H * 2 - 0.041, 5.0);
    stairG.add(face);
    const L1 = new THREE.PointLight(0xeef3fa, 5.5, 11, 2);
    L1.position.set(-8.5, 4.7, 5.2);
    scene.add(L1);
    const L2 = new THREE.PointLight(0xfff1dc, 1.6, 5, 2);
    L2.position.set(-8.15, 2.55, 3.15);
    scene.add(L2);
  }

  // ⑪ 墙上的消防设施牌 + 开关
  PLANE(0.34, 0.22, matNotice, -9.928, 2.66, 4.55, Math.PI / 2);
  B(0.012, 0.09, 0.09, -9.928, 1.22, 4.72, matSBeige, false);
  B(0.006, 0.05, 0.035, -9.921, 1.22, 4.72, matWhitePlastic, false);

  // ⑫ 双扇常闭防火门 + 门旁那一套（照片里：6 号牌、红牌、闭门器、执手、
  //    黑地垫、暖气片和立管、米色门禁盒、开关）
  const dz = (SW_DOOR[0] + SW_DOOR[1]) / 2;
  const leafW = (SW_DOOR[1] - SW_DOOR[0]) / 2 - 0.006;
  const doorLeaves = [];

  function makeStairLeaf(hingeZ, dir, y0) {
    const g = new THREE.Group();
    const closedYaw = dir > 0 ? -Math.PI / 2 : Math.PI / 2;
    const openYaw = closedYaw + (dir > 0 ? -1.30 : 1.30);   // 开约 75°：右扇贴不到门口那面白墙
    g.position.set(-7.125, y0, hingeZ);
    g.rotation.y = closedYaw;
    scene.add(g);
    const face = dir > 0 ? 0.019 : -0.019;      // 楼梯间那一面
    box(g, leafW, 2.06, 0.035, leafW / 2, 1.03, 0, matSFire, false);
    /* 中缝盖条：两扇门叶各留 6 mm 缝，缝正好在门中心；躲藏者相机的射线
       从缝里穿过去就会退到门外。盖条压过缝 1 cm，正好把这条射线挡住。 */
    box(g, 0.03, 2.06, 0.05, leafW - 0.005, 1.03, 0.024, matSHard, false);
    for (const hy of [0.42, 1.64]) box(g, 0.012, 0.12, 0.05, 0.014, hy, 0, matSHard, false);
    box(g, 0.22, 0.045, 0.045, 0.24, 2.00, face * 1.9, matSHard, false);      // 闭门器
    const arm = box(g, 0.28, 0.024, 0.024, 0.10, 1.955, face * 1.9, matSHard, false);
    arm.rotation.z = dir > 0 ? 0.18 : -0.18;
    if (dir > 0) {
      box(g, 0.06, 0.04, 0.004, 0.10, 1.95, face * 1.25, matPropRed, false);
    } else {
      const rose = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.02, 12), matSHard);
      rose.rotation.z = Math.PI / 2;
      rose.position.set(leafW - 0.11, 1.02, face * 1.3);
      g.add(rose);
      box(g, 0.13, 0.028, 0.028, leafW - 0.065, 1.005, face * 1.45, matSHard, false);
      const lock = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.02, 10), matSHard);
      lock.rotation.z = Math.PI / 2;
      lock.position.set(leafW - 0.11, 1.17, face * 1.3);
      g.add(lock);
      const sign = new THREE.Mesh(new THREE.PlaneGeometry(0.235, 0.145), matFireSign);
      sign.position.set(leafW - 0.13, 1.43, face * 1.2);
      sign.rotation.y = face > 0 ? 0 : Math.PI;
      g.add(sign);
      // 走廊那一面也得有执手和同一张常闭红牌，不然那边看就是一块没有五金的灰板
      const rose2 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.02, 12), matSHard);
      rose2.rotation.z = Math.PI / 2;
      rose2.position.set(leafW - 0.11, 1.02, -face * 1.3);
      g.add(rose2);
      box(g, 0.13, 0.028, 0.028, leafW - 0.065, 1.005, -face * 1.45, matSHard, false);
      const lock2 = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.02, 10), matSHard);
      lock2.rotation.z = Math.PI / 2;
      lock2.position.set(leafW - 0.11, 1.17, -face * 1.3);
      g.add(lock2);
      const sign2 = new THREE.Mesh(new THREE.PlaneGeometry(0.235, 0.145), matFireSign);
      sign2.position.set(leafW - 0.13, 1.43, -face * 1.2);
      sign2.rotation.y = face > 0 ? Math.PI : 0;
      g.add(sign2);
    }
    doorLeaves.push({ g, closedYaw, openYaw });
  }

  function doorDressing(y0) {
    for (const zz of [SW_DOOR[0] - 0.025, SW_DOOR[1] + 0.025]) {
      B(0.05, 2.14, 0.05, -7.135, y0 + 1.07, zz, matSTrim, false);
    }
    B(0.05, 0.08, (SW_DOOR[1] - SW_DOOR[0]) + 0.10, -7.135, y0 + 2.12, dz, matSTrim, false);
    B(0.16, 0.012, (SW_DOOR[1] - SW_DOOR[0]) - 0.02, -7.125, y0 + 0.006, dz, matBase, false);
    // 走廊侧也补一圈门套（从走廊看是一樘正经门，不是墙洞里一块板）
    for (const zz of [SW_DOOR[0] - 0.025, SW_DOOR[1] + 0.025]) {
      B(0.04, 2.14, 0.04, -7.005, y0 + 1.07, zz, matSTrim, false);
    }
    B(0.04, 0.08, (SW_DOOR[1] - SW_DOOR[0]) + 0.08, -7.005, y0 + 2.12, dz, matSTrim, false);
    // 6 号牌（黑底金圈，挂在门楣上方）
    const back = new THREE.Mesh(new THREE.CylinderGeometry(0.185, 0.185, 0.02, 32), matSDark);
    back.rotation.z = Math.PI / 2;
    back.position.set(-7.113, y0 + 2.53, dz);
    stairG.add(back);
    const plaque = new THREE.Mesh(new THREE.CircleGeometry(0.175, 32), matPlaque);
    plaque.position.set(-7.125, y0 + 2.53, dz);
    plaque.rotation.y = -Math.PI / 2;
    stairG.add(plaque);
    // 走廊侧也挂一块 6 号牌，从走廊抬头就知道这是 6F 楼梯间
    const back2 = new THREE.Mesh(new THREE.CylinderGeometry(0.185, 0.185, 0.02, 32), matSDark);
    back2.rotation.z = Math.PI / 2;
    back2.position.set(-7.007, y0 + 2.53, dz);
    stairG.add(back2);
    const plaque2 = new THREE.Mesh(new THREE.CircleGeometry(0.175, 32), matPlaque);
    plaque2.position.set(-6.995, y0 + 2.53, dz);
    plaque2.rotation.y = Math.PI / 2;
    stairG.add(plaque2);
    // 门禁/出门按钮（照片里门右侧墙上的米色小盒）
    B(0.03, 0.10, 0.16, -7.117, y0 + 2.42, 2.57, matSBeige, false);
    const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.10, 0.045), matSBlack);
    scr.position.set(-7.134, y0 + 2.43, 2.57);
    scr.rotation.y = -Math.PI / 2;
    stairG.add(scr);
    // 暖气片（铸铁片）+ 上下横管 + 立管
    const rx0 = -8.14, rx1 = -7.42, rz = IN_N + 0.085;
    for (let i = 0; i < 11; i++) {
      const x = rx0 + 0.06 + i * (rx1 - rx0 - 0.12) / 10;
      B(0.052, 0.50, 0.13, x, y0 + 0.33, rz, matSRad, false);
    }
    CYL(0.025, 0.025, rx1 - rx0 + 0.03, 8, matSRad, (rx0 + rx1) / 2, y0 + 0.59, rz, [0, 0, Math.PI / 2]);
    CYL(0.025, 0.025, rx1 - rx0 + 0.03, 8, matSRad, (rx0 + rx1) / 2, y0 + 0.10, rz, [0, 0, Math.PI / 2]);
    for (const x of [rx0 + 0.08, rx1 - 0.08]) B(0.05, 0.10, 0.10, x, y0 + 0.05, rz, matSRad, false);
    CYL(0.022, 0.022, 2.80, 8, matSRad, -7.34, y0 + 1.40, IN_N + 0.13);
    CYL(0.020, 0.020, 0.16, 8, matSRad, -7.36, y0 + 0.59, IN_N + 0.13, [0, 0, Math.PI / 2]);
    // 黑地垫 + 墙开关
    B(0.78, 0.012, 0.66, -7.48, y0 + 0.018, dz, matSMat, false);
    B(0.09, 0.09, 0.012, -7.28, y0 + 1.25, IN_N + 0.026, matSBeige, false);
    B(0.035, 0.05, 0.006, -7.28, y0 + 1.25, IN_N + 0.034, matWhitePlastic, false);
  }
  doorDressing(0);
  doorDressing(ROOM_H);

  makeStairLeaf(SW_DOOR[0], 1, 0);
  makeStairLeaf(SW_DOOR[1], -1, 0);
  makeStairLeaf(SW_DOOR[0], 1, ROOM_H);
  makeStairLeaf(SW_DOOR[1], -1, ROOM_H);
  const dRect = { minX: SW_X1 - 0.12, maxX: SW_X1 + 0.12, minZ: SW_DOOR[0], maxZ: SW_DOOR[1],
    top: 2.4, no2f: true };
  const dRect2 = { ...dRect, top: ROOM_H + 2.4, base: ROOM_H };
  deskRects.push(dRect, dRect2);
  const stairDoor = {
    leaves: doorLeaves, open: false, cur: 0, rect: dRect, rect2: dRect2,
    name: '楼梯间门', cx: SW_X1, cz: dz,
  };
  swingDoors.push(stairDoor);

  window.__stair = () => ({
    steps: stepCount, posts: postCount, bars: barCount, topRails: topRailCount,
    doorLeaves: doorLeaves.length,
    doorOpen: !!stairDoor.open, doorCur: +stairDoor.cur.toFixed(2),
    rectTop: stairDoor.rect.top, rect2Top: stairDoor.rect2.top,
    leafYaw: doorLeaves.map((L) => +L.g.rotation.y.toFixed(2)),
    radiatorFins: 22, plaques: 4, mats: 2,
  });

  pendingMerge.push(stairG);        // [改5]
}


/* ── 碰撞数据（源文件 L6966-7067 整块搬来；二楼那几处按 [改2] 抬了）── */
// ── 障碍生成：走廊墙上的"门洞之间那段墙" + 各间的外墙三面 ──────────────
function solidSpans(xFrom, xTo, doors) {
  const out = [];
  let x = xFrom;
  for (const [d0, d1] of doors) {
    if (d0 - x > 0.02) out.push([x, d0]);
    x = Math.max(x, d1);
  }
  out.push([x, xTo]);
  return out;
}
function roomWallObjs([x0, x1, z0, z1], hallSide) {     // hallSide = 贴走廊那一面是 z0 还是 z1
  const t = 0.06, out = [];
  out.push({ minX: x0 - t, maxX: x0 + t, minZ: z0, maxZ: z1 });
  out.push({ minX: x1 - t, maxX: x1 + t, minZ: z0, maxZ: z1 });
  if (hallSide === 'z0') out.push({ minX: x0, maxX: x1, minZ: z1 - t, maxZ: z1 + t });
  else out.push({ minX: x0, maxX: x1, minZ: z0 - t, maxZ: z0 + t });
  return out;
}

const obstacles = [
  // ── 旧教休室家具（已整组搬进新 YF311，碰撞按同一 180°+墙厚缩放变换）──
  ...([
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
  ]).map((b) => ({
    ...b,
    minX: REST_CX - REST_SX * b.maxX, maxX: REST_CX - REST_SX * b.minX,
    minZ: REST_CZ - REST_SZ * b.maxZ, maxZ: REST_CZ - REST_SZ * b.minZ,
  })),

  // ── 房间四壁（南墙留 ±0.6 门洞）──
  { minX: -3.06, maxX: 3.06, minZ: -2.46, maxZ: -2.34 },
  { minX: 2.94, maxX: 3.06, minZ: -2.46, maxZ: 2.46 },
  { minX: -3.06, maxX: -2.94, minZ: -2.46, maxZ: 2.46 },
  { minX: -3.06, maxX: 3.06, minZ: 2.34, maxZ: 2.46 },   // 旧教休室已封门，整面墙都挡人

  // ── 逸夫楼三层：走廊两道墙 + 各间外墙，全部由常量生成 ──────────────
  // 北墙（z=2.4）：旧教休室那 6 m 由它自己的墙占（见上面 -3.06~3.06 那一整段）
  ...solidSpans(3.00, HALL_X1 + 0.06, HALL_DOORS_N)
    .map(([a, b]) => ({ minX: a, maxX: b, minZ: HALL_Z0 - 0.06, maxZ: HALL_Z0 + 0.06 })),
  { minX: HALL_X0 - 0.06, maxX: -3.00, minZ: HALL_Z0 - 0.06, maxZ: HALL_Z0 + 0.06 },
  // 南墙（z=6.9）
  ...solidSpans(SW_X1, HALL_X1 + 0.06, HALL_DOORS_S)
    .map(([a, b]) => ({ minX: a, maxX: b, minZ: HALL_Z1 - 0.06, maxZ: HALL_Z1 + 0.06 })),
  // 走廊两端 + 楼梯间A 的南墙（比走廊深 1.5 m）
  { minX: HALL_X0 - 0.06, maxX: HALL_X0 + 0.06, minZ: SW_Z0, maxZ: SW_Z1 },
  { minX: HALL_X1 - 0.06, maxX: HALL_X1 + 0.06, minZ: HALL_Z0, maxZ: HALL_Z1 },
  { minX: HALL_X0 - 0.06, maxX: SW_X1 + 0.06, minZ: SW_Z1 - 0.06, maxZ: SW_Z1 + 0.06 },
  // 各间的外墙三面（贴走廊那一面已经在上面的门洞分段里算过了）
  // 男/女厕的侧墙要留门洞，单独在下面拼；其余房间照旧。
  ...ROOMS.filter(r => r !== CLS_G && r !== CLS_W)
    .flatMap(r => roomWallObjs(r, r[3] < HALL_ZM ? 'z1' : 'z0')),
  // 男厕：西墙 / 南墙 / 东墙在前室门洞处分两段；东墙南段延续成女厕西墙到 17.7
  { minX: CLS_G[0] - 0.06, maxX: CLS_G[0] + 0.06, minZ: CLS_G[2], maxZ: CLS_G[3] },
  { minX: CLS_G[0], maxX: CLS_G[1], minZ: CLS_G[3] - 0.06, maxZ: CLS_G[3] + 0.06 },
  { minX: CLS_G[1] - 0.06, maxX: CLS_G[1] + 0.06, minZ: CLS_G[2], maxZ: WC_MEN_DOOR_Z[0] },
  { minX: CLS_G[1] - 0.06, maxX: CLS_G[1] + 0.06, minZ: WC_MEN_DOOR_Z[1], maxZ: CLS_W[3] },
  // 女厕：东墙 / 南墙（西墙和北墙见上/下）
  { minX: CLS_W[1] - 0.06, maxX: CLS_W[1] + 0.06, minZ: CLS_W[2], maxZ: CLS_W[3] },
  { minX: CLS_W[0], maxX: CLS_W[1], minZ: CLS_W[3] - 0.06, maxZ: CLS_W[3] + 0.06 },
  // 前室东墙（与开水间之间）
  { minX: WC_LOBBY[1] - 0.06, maxX: WC_LOBBY[1] + 0.06, minZ: WC_LOBBY[2], maxZ: WC_LOBBY[3] },
  // 前室南墙：女厕门洞两侧（棕门常闭，一并算墙）
  { minX: WC_LOBBY[0], maxX: WC_WOMEN_DOOR_X[0], minZ: WC_LOBBY[3] - 0.05, maxZ: WC_LOBBY[3] + 0.05 },
  { minX: WC_WOMEN_DOOR_X[1], maxX: WC_LOBBY[1], minZ: WC_LOBBY[3] - 0.05, maxZ: WC_LOBBY[3] + 0.05 },
  // 门厅南墙 z=9.9：x28.4~32.8（开水间南墙 + 教休室前墙西段）和 34.0~36.4；
  // 门洞 32.8~34.0 由 DOOR_BLOCK 挡。碰撞条把白墙板和黑踢脚一起包进去。
  { minX: CLS_KS[0], maxX: REST_DOOR[0],
    minZ: REST_FRONT_Z - WALL_T / 2 - 0.04, maxZ: REST_FRONT_Z + WALL_T / 2 + 0.02 },
  { minX: REST_DOOR[1], maxX: CLS_REST[1],
    minZ: REST_FRONT_Z - WALL_T / 2 - 0.04, maxZ: REST_FRONT_Z + WALL_T / 2 + 0.02 },
  // 女厕与教休室之间 z=9.9~14.7 的实心管道井（视觉上是一整块，不能走进去）
  { minX: CLS_W[1], maxX: CLS_REST[0], minZ: REST_FRONT_Z, maxZ: CLS_REST[3] },
  // 门厅东南角那根白立管（模型半径 2.7 cm，碰撞按外径收一点）
  { minX: 36.17, maxX: 36.23, minZ: 9.77, maxZ: 9.83 },

  // ── 教室课桌 + 蓝色椅子 ──
  ...deskRects,
  ...chairRects,
];

// ── 二楼碰撞：1F 的整层再复制一遍（墙 3~6 m，家具 top+3）──
//   base=ROOM_H：这些体块只对二楼的人生效，1F 从底下走过时全部跳过。
const obstacles1F = obstacles.length;
for (let i = 0; i < obstacles1F; i++) {
  const b = obstacles[i];
  if (b.no2f) continue;                     // 动态柜门没有克隆到二楼
  obstacles.push({ ...b, top: b.top === undefined ? ROOM_H * 2 + FLOOR2_LIFT : b.top + ROOM_H + FLOOR2_LIFT,
    base: ROOM_H + FLOOR2_LIFT });
}
// 楼梯间（只属于 1F 的碰撞，放在复制之后）。台阶不逐级注册，用 groundAt 的坡面。
{
  // 东墙两段（门洞 z 2.7~3.8 之间是两樘门）；墙到 6 m，两层共用
  obstacles.push({ minX: SW_X1 - 0.04, maxX: SW_X1 + 0.04, minZ: HALL_Z0, maxZ: SW_DOOR[0], top: ROOM_H * 2 });
  obstacles.push({ minX: SW_X1 - 0.04, maxX: SW_X1 + 0.04, minZ: SW_DOOR[1], maxZ: SW_Z1, top: ROOM_H * 2 });
  // 两跑之间的梯井：照片里是开敞的（没有实体隔墙），但栏杆的碰撞仍按整层高挡着，
  // 免得人从两跑之间掉进 0.3 m 的缝里。视觉上的墙已经拆了，见楼梯建组。
  obstacles.push({ minX: SW_A1, maxX: SW_B0, minZ: SW_LAND, maxZ: SW_MID, top: ROOM_H });
  /* 二楼的人也要拦住 0.3 m 梯井：原来这块 top=3.0，脚底到 3.06 的人跨过去时
     碰撞已经被判成"站在它顶上"，会直接踩空掉进梯井。 */
  // ctop 只给相机看：整层高是挡人不跨梯井的，视觉栏杆只到楼面 +1 m。
  obstacles.push({ minX: SW_A1, maxX: SW_B0, minZ: SW_LAND, maxZ: SW_MID,
    top: ROOM_H * 2, base: ROOM_H + FLOOR2_LIFT, ctop: ROOM_H + FLOOR2_LIFT + 1.0 });
  // 折返梯段北立面：一楼从下平台不能走进实心梯段。
  // top 给 2.6 而不是 3.0 —— 给 3.0 会把爬到 y=2.85 的人挡在最后一级（实测停在 z=4.15）。
  obstacles.push({ minX: SW_B0, maxX: SW_B1, minZ: SW_LAND - 0.03, maxZ: SW_LAND + 0.03, top: 2.60 });
  // 半平台下的支撑墙（一楼钻不到平台底下）；墙体视觉到 1.41，碰撞跟着到 1.41
  obstacles.push({ minX: SW_X0, maxX: SW_X1, minZ: SW_MID - 0.03, maxZ: SW_MID + 0.13, top: 1.41 });
  // 2F 顶层平台护栏：一直拉到东跑西沿（x=SW_B0），梯井那 0.3 m 也拦住
  obstacles.push({ minX: SW_X0, maxX: SW_B0, minZ: SW_LAND - 0.03, maxZ: SW_LAND + 0.03,
    top: ROOM_H + FLOOR2_LIFT + 1.0, base: ROOM_H + FLOOR2_LIFT });
}
// 楼梯间B（同样只属于 1F 的碰撞放在复制之后；台阶不注册，走 groundAt 的坡面）
{
  // 两跑之间现在是开敞梯井（实体墙拆了），碰撞按整层高拦住，人不会从栏杆中间掉下去
  obstacles.push({ minX: SB_A1, maxX: SB_B0, minZ: SB_ZM, maxZ: SB_ZP, top: ROOM_H * 2,
    ctop: ROOM_H + FLOOR2_LIFT + 1.0 });
  // 半平台下的支撑墙：1F 不能从梯段旁边钻进平台底下；站上平台后不再拦。
  // top 必须跟视觉墙一样高（1.32），不能写 SB_RISE=1.5：西跑坡度 0.5，人被半径
  // 顶到 z=-2.18 时脚只有 1.28，1.5 比脚高 0.22 > STEP_UP，于是被这堵“墙”挡在半
  // 平台前 0.4 m —— 就是楼梯上那道空气墙。
  obstacles.push({ minX: CLS_STB[0], maxX: CLS_STB[1], minZ: SB_ZM - 0.001, maxZ: SB_ZM + 0.10,
    top: 1.32 });
  // 二楼洞口护栏（东跑那一头留着上平台，不拦）
  obstacles.push({ minX: CLS_STB[0], maxX: SB_B0, minZ: SB_ZP - 0.03, maxZ: SB_ZP + 0.03,
    top: ROOM_H + FLOOR2_LIFT + 1.0, base: ROOM_H + FLOOR2_LIFT });
}
// 二楼楼板：走廊（西端楼梯间那块是洞）+ 3 m 上平台 + 各房间 + 原办公室
// 楼梯间B 只算门口那一条 3 m 平台：梯段上方是洞，整间都给 3 m 会让人穿进板里。
const floor2Rects = [
  [SW_X1, HALL_X1, HALL_Z0, HALL_Z1],
  [SW_X0, SW_X1, SW_Z0, SW_LAND],
  // 教休室门前的凹进门厅 + 开水间（不属 ROOMS，二楼同样要能站人）
  [CLS_KS[0], CLS_REST[1], HALL_Z1, REST_FRONT_Z],
  // 男女厕共用的凹进前室
  [WC_LOBBY[0], WC_LOBBY[1], WC_LOBBY[2], WC_LOBBY[3]],
  ...ROOMS.map((r) => (r === CLS_STB ? [r[0], r[1], SB_ZP, r[3]] : r)),
  [-ROOM_W / 2, ROOM_W / 2, -ROOM_D / 2, ROOM_D / 2],
];

// 门关着时挡住门洞（教休室门在门厅南墙 z=9.9，x 33.4 ± 0.6）
const DOOR_BLOCK = {
  minX: REST_DOOR[0], maxX: REST_DOOR[1],
  minZ: REST_DOOR_Z - 0.08, maxZ: REST_DOOR_Z + 0.10,
};

/* ── 身边最近的一扇能开关的门（源文件 L7232-7238；[改6] player.pos 改成传进来）── */
function nearestSwingDoorAt(px, pz) {
  let best = null, bestD = 1.9;
  for (const d of swingDoors) {
    const dist = Math.hypot(px - d.cx, pz - d.cz);
    if (dist < bestD) { bestD = dist; best = d; }
  }
  return best;
}

/* [改5] 合批 + 二楼克隆：必须等 main.js 把"伪装形态池"从 world.children 里克隆完再调。
   顺序照源文件：先合 1F → 合完再克隆二楼（合并前克隆会和 mergeStatic 共用/释放同一批几何）
   → 最后合楼梯间。楼梯是在克隆之后才建的，所以二楼不会多出一条楼梯来。 */
const floor2GroupGet = () => floor2Group;
export function finishMap() {
  mergeStatic(world);
  try {
    floor2Group = world.clone(true);
    floor2Group.position.y = ROOM_H + FLOOR2_LIFT;
    scene.add(floor2Group);
    // 一台风扇现在是一个 Group（吊杆+轮毂+叶片），照着整棵子树克隆。
    // 位置/转角一起带过来，挂进 floor2Group 之后会跟着整层抬到二楼。
    for (const f of hallFans.slice()) {
      const c = f.clone(true);
      c.userData.spd = f.userData.spd;
      floor2Group.add(c);
      hallFans.push(c);
    }
  } catch (err) {
    console.warn('二楼整层克隆失败', err);
  }
  for (const g of pendingMerge) mergeStatic(g);
  return scene;
}

export { scene, world, obstacles, floor2Rects, DOOR_BLOCK, ROOM_W, ROOM_D, ROOM_H,
  PLAYER_RADIUS, box, makeBookStack, makeRestDoorModel, makeLectureChairModel, makeLectureTableModel,
  addPlane, rect, cyl, V, R, newCanvas, sprinkleNoise,
  buildDrawerBox, nearestSwingDoorAt, Mirror, hallFans,
  swingDoors, hideLockers, ammoSpots, doorLeft, doorRight, fanGroup, deskRects, solidSpans,
  roomWallObjs, ceilLamps, lampSet, LAMP_CAP, ROOMS, mergeStatic, HALL_ZM, HALL_Z0, HALL_Z1,
  HALL_X0, HALL_X1, CLS_E, CLS_E_DOORS, floor2GroupGet,
  REST_DOOR_X, REST_DOOR_Z, REST_DOOR, CLS_REST, CLS_FOYER, REST_FRONT_Z, FOYER_D,
  matMetal, matIron, matWhitePlastic, matFanBlade, matChairBlue, matDeskLeg, matWoodRed, matWoodDark,
  matDoorDark, matAlu, matHallFloor, matHallCeil, matGlassDay,
  FLOOR2_LIFT, SW_A0, SW_A1, SW_B0, SW_B1, SW_X0, SW_X1, SW_Z0, SW_Z1, SW_LAND, SW_MID,
  SW_RUN, SW_RISE, SB_A0, SB_A1, SB_B0, SB_B1, SB_ZM, SB_ZP, SB_RUN, SB_RISE, SB_W,
  CLS_STB, CLS_KS, CLS_301, CLS_302, CLS_313, CLS_312, CLS_F, CLS_G, CLS_W, CLS_H,
  CLS_EL, CLS_PD };
