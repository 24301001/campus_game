// 检查一个 GLB：尺寸、脚朝向、骨骼列表
import fs from 'node:fs';
import * as THREE from '../vendor/three.module.js';
import { GLTFLoader } from './_conv/GLTFLoader.js';

globalThis.window = globalThis;
globalThis.self = globalThis;
THREE.ImageLoader.prototype.load = function (url, onLoad) {
  const img = { width: 1, height: 1, complete: true };
  if (onLoad) onLoad(img);
  return img;
};

const file = process.argv[2];
const buf = fs.readFileSync(file);
const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
const loader = new GLTFLoader();
const gltf = await new Promise((res, rej) => loader.parse(ab, '', res, rej));
const root = gltf.scene;
// 可选：先把根节点转一下再看（--rot 90 表示绕 X 轴转 90 度）
const rotArg = process.argv.find(a => a.startsWith('--rot'));
if (rotArg) {
  const deg = parseFloat(rotArg.split('=')[1] || '0');
  root.rotation.x = deg * Math.PI / 180;
}
root.updateMatrixWorld(true);

const box = new THREE.Box3().setFromObject(root);
const size = new THREE.Vector3(); box.getSize(size);
console.log('height', size.y.toFixed(3), 'width', size.x.toFixed(3), 'depth', size.z.toFixed(3));
console.log('min', box.min.toArray().map(n => n.toFixed(2)).join(','), 'max', box.max.toArray().map(n => n.toFixed(2)).join(','));

let nVerts = 0, sumZ = 0, feetZ = 0, nFeet = 0, feetY = 0;
const yCut = box.min.y + size.y * 0.06;
root.traverse((o) => {
  if (!o.isMesh) return;
  const p = o.geometry.attributes.position;
  if (!p) return;
  const v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i).applyMatrix4(o.matrixWorld);
    nVerts++; sumZ += v.z;
    if (v.y < yCut) { feetZ += v.z; nFeet++; feetY += v.y; }
  }
});
const meanZ = sumZ / nVerts;
const footZ = nFeet ? feetZ / nFeet : 0;
console.log('verts', nVerts, 'meanZ', meanZ.toFixed(3), 'feet meanZ', footZ.toFixed(3),
  '-> toes point', (footZ - meanZ) > 0 ? '+Z' : '-Z', `(${(footZ - meanZ).toFixed(3)})`);

const bones = [];
const v = new THREE.Vector3();
root.traverse((o) => { if (o.isBone) { o.getWorldPosition(v); bones.push([o.name, v.x, v.y, v.z]); } });
bones.sort((a, b) => b[2] - a[2]);
console.log('bones', bones.length);
for (const b of bones.slice(0, 14)) console.log('  top', b[0], b[1].toFixed(2), b[2].toFixed(2), b[3].toFixed(2));
console.log('anims:', gltf.animations.map(a => `${a.name}(${a.duration.toFixed(2)}s)`).join(', '));
