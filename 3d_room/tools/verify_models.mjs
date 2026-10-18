// 离线验证三个模型：摆正后的尺寸 / 脚底高度 / 骨头识别 / 每段动画播起来贴不贴地
// 这里刻意和 main.js 里的 normalizeModel / makeBoneIndex / pickClips 保持一致，
// 改了主程序就照着改这份，用来在不开浏览器的情况下先验一遍。
import fs from 'node:fs';
import * as THREE from '../vendor/three.module.js';
import { GLTFLoader } from './_conv/GLTFLoader.js';
import { clone as cloneSkinned } from './_conv/SkeletonUtils.js';

globalThis.window = globalThis;
globalThis.self = globalThis;
THREE.ImageLoader.prototype.load = function (url, onLoad) {
  const img = { width: 1, height: 1, complete: true };
  if (onLoad) onLoad(img);
  return img;
};

function skelOf(model) {
  let skel = null;
  model.traverse((o) => { if (!skel && o.isSkinnedMesh) skel = o.skeleton; });
  return skel;
}
function boneIndexOf(skel, name) {
  if (!skel || !name) return -1;
  return skel.bones.findIndex((b) => b.name === name);
}
function makeBoneIndex(skel, spec) {
  const out = {
    head: boneIndexOf(skel, spec.head),
    headTop: boneIndexOf(skel, spec.headTop),
    hips: boneIndexOf(skel, spec.hips),
    limbs: (spec.limbs || []).map((n) => boneIndexOf(skel, n)).filter((i) => i >= 0),
  };
  if (spec.auto && skel) {
    const v = new THREE.Vector3();
    let best = -1, bestY = -1e9;
    for (let i = 0; i < skel.bones.length; i++) {
      skel.bones[i].getWorldPosition(v);
      if (v.y > bestY) { bestY = v.y; best = i; }
    }
    out.head = best; out.headTop = -1; out.limbs = [];
    const step = Math.max(1, Math.floor(skel.bones.length / 12));
    for (let i = 0; i < skel.bones.length; i += step) out.limbs.push(i);
  }
  return out;
}

// 蒙皮后的真实包围盒（Box3.setFromObject 对骨骼模型是错的，只认静止网格）
function skinnedBox(obj) {
  obj.updateMatrixWorld(true);
  const box = new THREE.Box3();
  const tb = new THREE.Box3();
  obj.traverse((o) => {
    if (!o.isSkinnedMesh || !o.geometry) return;
    o.computeBoundingBox();
    if (!o.boundingBox || o.boundingBox.isEmpty()) return;
    tb.copy(o.boundingBox).applyMatrix4(o.matrixWorld);
    box.union(tb);
  });
  if (box.isEmpty()) box.setFromObject(obj);
  return box;
}

function normalizeModel(obj, opt = {}) {
  if (opt.rotY) {
    obj.rotation.y += opt.rotY;
    obj.updateMatrixWorld(true);
  }
  if (opt.poseClip && opt.clips && opt.clips.length) {
    const want = String(opt.poseClip).toLowerCase();
    const clip = opt.clips.find((c) => c.name === opt.poseClip)
      || opt.clips.find((c) => c.name.toLowerCase().includes(want));
    if (clip) {
      const mx = new THREE.AnimationMixer(obj);
      mx.clipAction(clip).play();
      mx.update(0);
    }
    obj.updateMatrixWorld(true);
  }
  const box = skinnedBox(obj);
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

function pickClips(anims, map) {
  const find = (n) => anims.find((a) => a.name === n)
    || anims.find((a) => a.name.toLowerCase() === String(n).toLowerCase())
    || anims.find((a) => a.name.endsWith('|' + n));
  const out = {};
  for (const k of Object.keys(map)) { const c = find(map[k]); if (c) out[k] = c; }
  return out;
}

async function load(file) {
  const buf = fs.readFileSync(file);
  const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
  return await new Promise((res, rej) => new GLTFLoader().parse(ab, '', res, rej));
}

// 判断正面朝哪边：看膝盖往哪边弯（人只有一个弯法）。
// ⚠ 别用「脚尖比身体重心靠前」那套 —— 实测对正常的丧尸都会判反。
function facingKnee(obj) {
  const B = {};
  obj.traverse((o) => { if (o.isBone) B[o.name] = o; });
  const p = (n) => { const b = B[n]; if (!b) return null; const v = new THREE.Vector3(); b.getWorldPosition(v); return v; };
  const vals = [];
  for (const s of ['Left', 'Right']) {
    const hip = p('mixamorig' + s + 'UpLeg'), knee = p('mixamorig' + s + 'Leg'), ank = p('mixamorig' + s + 'Foot');
    if (!hip || !knee || !ank) return null;
    vals.push(knee.z - (hip.z + ank.z) / 2);
  }
  const d = (vals[0] + vals[1]) / 2;
  return { d, dir: d > 0 ? '+Z' : '-Z' };
}

const cases = [
  { name: '丧尸', file: 'assets/zombie_real.glb', sy: 1.0,
    norm: null,
    clips: { Idle: 'Idle', Walk: 'Walk', Run: 'Run', Punch: 'Punch', Punch2: 'Punch2',
      HitReact: 'HitReact', Death: 'Death', Scream: 'Scream' },
    bones: { head: 'CityDeadOutfitHead', headTop: 'CityDeadOutfitHeadTop_End', hips: 'CityDeadOutfitHips',
      limbs: ['CityDeadOutfitHead', 'CityDeadOutfitLeftHand', 'CityDeadOutfitLeftFoot'] } },
  { name: '巨型变异体', file: 'assets/giant_mutant.glb', sy: 1.32,
    norm: { height: 1.79, poseClip: 'idle', hips: 'mixamorigHips' },
    clips: { Idle: 'idle', Walk: 'Giant Run', Run: 'Giant Run',
      Punch: 'Right Punch', Punch2: 'Left Punch', Death: 'Death', Scream: 'idle' },
    bones: { head: 'mixamorigHead', headTop: 'mixamorigHeadTop_End', hips: 'mixamorigHips',
      limbs: ['mixamorigHead', 'mixamorigSpine2', 'mixamorigLeftFoot', 'mixamorigRightFoot'] } },
  { name: '人形怪', file: 'assets/horror_game_monster.glb', sy: 1.16,
    norm: { height: 1.79, poseClip: 'Idle' },
    clips: { Idle: 'Idle', Walk: 'Walk', Run: 'Run',
      Punch: 'Run', Punch2: 'Run', HitReact: 'Idle', Scream: 'Idle' },
    bones: { auto: true } },
];

let bad = 0;
for (const c of cases) {
  console.log('\n===== ' + c.name + ' =====');
  const gltf = await load('D:/desktop/3d_room/' + c.file);
  let tpl = c.norm ? normalizeModel(gltf.scene, { ...c.norm, clips: gltf.animations }) : gltf.scene;
  tpl.updateMatrixWorld(true);

  const skel = skelOf(tpl);
  const idx = makeBoneIndex(skel, c.bones);
  console.log('bones', skel ? skel.bones.length : 0, 'idx', JSON.stringify(idx).slice(0, 140));
  const b0 = skinnedBox(tpl);
  console.log('摆正后  height', (b0.max.y - b0.min.y).toFixed(3),
    'minY', b0.min.y.toFixed(3), 'maxY', b0.max.y.toFixed(3));

  const model = cloneSkinned(tpl);
  model.scale.set(tpl.scale.x, tpl.scale.y * c.sy, tpl.scale.z);
  model.updateMatrixWorld(true);
  console.log('游戏里  height', (() => { const b = skinnedBox(model); return (b.max.y - b.min.y).toFixed(3); })());
  // 最高的几根骨头：自动认脑袋的模型靠这个确认「最高那根」真是脑袋而不是举手
  const mskel0 = skelOf(model);
  if (mskel0) {
    const vv = new THREE.Vector3();
    const tops = mskel0.bones.map((b, i) => { b.getWorldPosition(vv); return [i, b.name, vv.y]; })
      .sort((a, b) => b[2] - a[2]).slice(0, 5);
    console.log('最高骨头：' + tops.map((x) => `${x[1]}(${x[2].toFixed(2)})`).join(' '));
  }
  const fc = facingKnee(model);
  if (fc) console.log('正面朝  ' + fc.dir + '  (膝盖比髋-踝连线往前 ' + fc.d.toFixed(3) + ')');
  else console.log('正面朝  （这套骨架没有 mixamorig 膝盖骨头，判不了）');

  console.log('动画表：', Object.entries(pickClips(gltf.animations, c.clips)).map(([k, v]) => k + '=' + v.name).join('  '));

  const mixer = new THREE.AnimationMixer(model);
  for (const [k, clip] of Object.entries(pickClips(gltf.animations, c.clips))) {
    const act = mixer.clipAction(clip);
    act.reset(); act.play();
    let lo = 1e9, hi = -1e9, wx = 0, wz = 0;
    const N = 8;
    for (let i = 0; i <= N; i++) {
      mixer.setTime(clip.duration * i / N);
      model.updateMatrixWorld(true);
      const b = skinnedBox(model);
      lo = Math.min(lo, b.min.y); hi = Math.max(hi, b.max.y);
      wx = Math.max(wx, b.max.x - b.min.x);
      wz = Math.max(wz, b.max.z - b.min.z);
    }
    mixer.stopAllAction(); mixer.setTime(0);
    const flag = lo < -0.25 ? '  ⚠️钻地' : '';
    if (lo < -0.25) bad++;
    console.log(`  ${k.padEnd(8)} ${clip.name.padEnd(12)} 最低 ${lo.toFixed(2)}  最高 ${hi.toFixed(2)}` +
      `  最宽 ${wx.toFixed(2)}  最厚 ${wz.toFixed(2)}${flag}`);
  }
}

console.log('\n' + (bad ? `⚠️ 有 ${bad} 段动画会钻到地板底下` : '全部动画都站得住，没有钻地的'));
