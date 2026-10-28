// 判断一个骨骼模型「脸朝哪边」：不靠猜，用人体结构量三处
//   ① 膝盖在髋-踝连线的哪一侧（人的膝盖一定朝正面弯）
//   ② 脚掌重心在脚踝的哪一侧（脚尖比脚跟长得多）
//   ③ 全身网点重心的偏移
// 三个一起看，谁不合群一眼就看出来。
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
const poseName = process.argv[3] || null;   // 先播哪段动画（不传就按出厂姿势）

const buf = fs.readFileSync(file);
const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
const gltf = await new Promise((res, rej) => new GLTFLoader().parse(ab, '', res, rej));
const root = gltf.scene;

if (poseName && gltf.animations.length) {
  const clip = gltf.animations.find((a) => a.name === poseName)
    || gltf.animations.find((a) => a.name.toLowerCase().includes(poseName.toLowerCase()));
  if (clip) {
    const mx = new THREE.AnimationMixer(root);
    mx.clipAction(clip).play();
    mx.update(0);
  }
}
root.updateMatrixWorld(true);

const box = new THREE.Box3();
const tb = new THREE.Box3();
root.traverse((o) => {
  if (!o.isSkinnedMesh || !o.geometry) return;
  o.computeBoundingBox();
  tb.copy(o.boundingBox).applyMatrix4(o.matrixWorld);
  box.union(tb);
});
const h = box.max.y - box.min.y;

// ① ③ 顶点统计
let n = 0, sumZ = 0, fn = 0, fz = 0;
const yCut = box.min.y + h * 0.08;
const v = new THREE.Vector3();
root.traverse((o) => {
  if (!o.isSkinnedMesh) return;
  const cnt = o.geometry.attributes.position.count;
  for (let i = 0; i < cnt; i++) {
    o.getVertexPosition(i, v);
    v.applyMatrix4(o.matrixWorld);
    n++; sumZ += v.z;
    if (v.y < yCut) { fn++; fz += v.z; }
  }
});
const meanZ = sumZ / n;
const footMeanZ = fn ? fz / fn : 0;

// ② 骨头：按名字找（Mixamo / CityDead 两套都认，找不到就跳过）
const B = {};
root.traverse((o) => { if (o.isBone) B[o.name] = o; });
const pick = (...names) => names.map((x) => B[x]).find(Boolean) || null;
const wp = (o) => { const p = new THREE.Vector3(); if (o) o.getWorldPosition(p); return p; };

function kneeSide(hipN, kneeN, ankleN) {
  const hip = pick(hipN[0], hipN[1]);
  const knee = pick(kneeN[0], kneeN[1]);
  const ank = pick(ankleN[0], ankleN[1]);
  if (!hip || !knee || !ank) return null;
  const a = wp(hip), k = wp(knee), b = wp(ank);
  return k.z - (a.z + b.z) / 2;
}
function footSide(ankleN) {
  const ank = pick(ankleN[0], ankleN[1]);
  if (!ank) return null;
  return footMeanZ - wp(ank).z;   // 脚掌重心相对脚踝：往脚尖那边偏
}

const rows = [
  ['左腿膝盖', kneeSide(['mixamorigLeftUpLeg'], ['mixamorigLeftLeg'], ['mixamorigLeftFoot'])],
  ['右腿膝盖', kneeSide(['mixamorigRightUpLeg'], ['mixamorigRightLeg'], ['mixamorigRightFoot'])],
  ['左脚掌重心-脚踝', footSide(['mixamorigLeftFoot'])],
  ['右脚掌重心-脚踝', footSide(['mixamorigRightFoot'])],
  ['脚掌整体-全身重心', footMeanZ - meanZ],
];

console.log('文件：' + file + (poseName ? '   姿势：' + poseName : '   姿势：出厂'));
console.log('身高 ' + h.toFixed(2) + '   宽(X) ' + (box.max.x - box.min.x).toFixed(2) + '   厚(Z) ' + (box.max.z - box.min.z).toFixed(2));
for (const [k, val] of rows) {
  console.log('  ' + k.padEnd(16) + (val === null ? '（这套骨架没这几个名字，跳过）' : (val >= 0 ? '+' : '') + val.toFixed(3) + '  => ' + (val >= 0 ? '朝 +Z' : '朝 -Z')));
}
