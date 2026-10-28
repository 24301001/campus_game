// FBX -> GLB 离线转换（Node 里跑 three 的 FBXLoader + GLTFExporter）
// 用法：node tools/fbx2glb.mjs <输出.glb> <基准.fbx> [追加动画的.fbx ...]
// 第 2 个文件提供网格和骨骼，后续文件的动画按文件名当作 clip 名追加进去。
import fs from 'node:fs';
import path from 'node:path';
import * as THREE from '../vendor/three.module.js';
import http from 'node:http';
import https from 'node:https';

// Node 里没有 window；FBXLoader 会用 window.URL.createObjectURL 处理内嵌图片
globalThis.window = globalThis;
globalThis.document = { createElementNS: () => ({ style: {} }), createElement: () => ({ style: {} }) };
// GLTFExporter 输出二进制时要 FileReader；Node 里没有，补一个够用的
globalThis.FileReader = class {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((buf) => { this.result = buf; if (this.onloadend) this.onloadend(); });
  }
};
import { FBXLoader } from './_conv/FBXLoader.js';
import { GLTFExporter } from './_conv/GLTFExporter.js';

const [, , outArg, ...inArgs] = process.argv;
if (!outArg || inArgs.length === 0) {
  console.error('用法: node fbx2glb.mjs <out.glb> <base.fbx> [anim.fbx ...]');
  process.exit(1);
}

// 贴图不走网络/磁盘：返回空 Texture 占位，材质贴图后面在游戏里手动挂
const manager = new THREE.LoadingManager();
// Node 没有 <img>：把 ImageLoader 整个换成立刻回一个空壳
THREE.ImageLoader.prototype.load = function (url, onLoad) {
  const img = { width: 1, height: 1, complete: true, name: String(url) };
  if (onLoad) onLoad(img);
  return img;
};

function parseFbx(file) {
  const buf = fs.readFileSync(file);
  const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
  const loader = new FBXLoader(manager);
  // 彻底不碰贴图：FBXLoader 内部会 new TextureLoader，这里直接换掉
  loader.textureLoader = { load(url, onLoad) { const t = new THREE.Texture(); t.name = String(url); if (onLoad) onLoad(t); return t; } };
  return loader.parse(ab, '');
}

function describe(obj) {
  let meshes = 0, bones = 0, verts = 0, mats = new Set();
  obj.traverse((o) => {
    if (o.isSkinnedMesh || o.isMesh) {
      meshes++;
      const p = o.geometry.attributes.position;
      verts += p ? p.count : 0;
      const m = Array.isArray(o.material) ? o.material : [o.material];
      for (const x of m) if (x) mats.add(x.name || '(unnamed)');
    }
    if (o.isBone) bones++;
  });
  const box = new THREE.Box3().setFromObject(obj);
  const size = new THREE.Vector3();
  box.getSize(size);
  return { meshes, bones, verts, mats: [...mats], size };
}

const base = parseFbx(inArgs[0]);
const info = describe(base);
console.log('BASE', path.basename(inArgs[0]), JSON.stringify(info));
console.log('  clips:', base.animations.map((a) => `${a.name}(${a.duration.toFixed(2)}s,${a.tracks.length}t)`).join(', ') || 'none');

const clips = [];
for (const a of base.animations) clips.push(a);

for (const f of inArgs.slice(1)) {
  const extra = parseFbx(f);
  const name = path.basename(f, '.fbx');
  const ei = describe(extra);
  console.log('EXTRA', path.basename(f), 'bones', ei.bones, 'clips', extra.animations.length);
  for (const a of extra.animations) {
    const c = a.clone();
    c.name = name;
    clips.push(c);
  }
}

// 把贴图全摘掉（占位 Texture 没有 image，导出会炸）
base.traverse((o) => {
  if (!o.material) return;
  const list = Array.isArray(o.material) ? o.material : [o.material];
  for (const m of list) {
    for (const k of ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'aoMap', 'emissiveMap', 'specularMap', 'bumpMap', 'displacementMap', 'alphaMap', 'lightMap']) {
      if (m[k]) { m[k] = null; }
    }
    m.needsUpdate = true;
  }
});

const wrap = new THREE.Group();
wrap.name = 'FBXRoot';
wrap.add(base);
const S = process.env.SCALE ? parseFloat(process.env.SCALE) : 1;
if (S !== 1) wrap.scale.setScalar(S);

const exporter = new GLTFExporter();
const glb = await exporter.parseAsync(wrap, { binary: true, animations: clips, onlyVisible: false });
fs.writeFileSync(outArg, Buffer.from(glb));
console.log('WROTE', outArg, fs.statSync(outArg).size, 'bytes');
