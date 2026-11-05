/* =========================================================================
   玩家形象：把 Soldier.glb 的士兵换成"玩家自己在校园里捏的那个方块人"
   -------------------------------------------------------------------------
   用的就是「玩家精灵」里那个能转的 3D 预览本人的模型（./voxel.js，从
   pixel-3d/pixel-3d.js 原样搬过来的体素小人）：同一份配方、同一套盒子、
   同一套发型五官，逐格相同。所以镜子里/对面的屏幕上看到的人，和他自己在
   个人中心里转着看的**是同一个人**。

   怎么和动作对上：
     士兵的骨架留着不动（走跑/换弹/蹲跳/持枪 IK 全靠它），但士兵的网格藏起来。
     方块人的身子、脑袋是刚的，跟着玩家整体走；
     两条胳膊每帧从肩膀「指向」骨架的手，两条腿从胯「指向」骨架的脚。
     换句话说：**手永远在枪上，脚永远在地上**，中间不管骨头怎么弯，胳膊腿
     都是一根直棍 —— 方块人本来就是这么回事，不需要肘和膝。
   ========================================================================= */
import * as THREE from 'three';
import { buildVoxelFigure } from './voxel.js?v=duo102';

/* 和 mp/look.js 一份口径。没登录 / 没捏过形象的人用这份默认。 */
const FALLBACK = {
  skin: '#e0ae87', faceShape: 'round', hairStyle: 'short', hairColor: '#3c291f',
  eye: 'round', eyeColor: '#238d9a', mouth: 'soft',
  cloth: '#f1f0ea', clothAlt: '#293944', clothPattern: 'stripe',
  pants: '#3d5274', acc: 'none', accColor: '#b67a56', packColor: '#b4552f',
};
const HEX = /^#[0-9a-f]{6}$/i;

export function normLook(value) {
  const v = value && typeof value === 'object' ? value : {};
  const r = { ...FALLBACK };
  for (const k of ['skin', 'hairColor', 'eyeColor', 'cloth', 'clothAlt', 'pants', 'accColor', 'packColor'])
    if (typeof v[k] === 'string' && HEX.test(v[k])) r[k] = v[k].toLowerCase();
  if (['short', 'mid', 'long', 'ponytail', 'bun', 'twintails'].includes(v.hairStyle)) r.hairStyle = v.hairStyle;
  if (['square', 'round'].includes(v.faceShape)) r.faceShape = v.faceShape;
  if (['round', 'narrow', 'dot'].includes(v.eye)) r.eye = v.eye;
  if (['soft', 'smile'].includes(v.mouth)) r.mouth = v.mouth;
  if (['none', 'glasses', 'cap', 'scarf'].includes(v.acc)) r.acc = v.acc;
  if (['solid', 'stripe'].includes(v.clothPattern)) r.clothPattern = v.clothPattern;
  return r;
}

/* 从校园账号里取自己的形象：登录态存在 localStorage.mpToken（和 mp 那套同一个键）。
   取不到返回 null —— 没登录的人照样能玩，用默认形象。 */
export async function fetchLook() {
  let token = '';
  try { token = localStorage.getItem('mpToken') || ''; } catch (e) {}
  if (!token) return null;
  try {
    const r = await fetch('/api/mp/profile/me', { headers: { Authorization: 'Bearer ' + token } });
    if (!r.ok) return null;
    const me = await r.json();
    return me && me.look ? me.look : null;
  } catch (e) { return null; }
}

/* 把士兵自带的蒙皮网格藏起来。只认 SkinnedMesh，不碰别的。 */
export function hideSoldier(av) {
  av.traverse((o) => { if (o.isSkinnedMesh) o.visible = false; });
}

const _DOWN = new THREE.Vector3(0, -1, 0);
const _DIR = new THREE.Vector3();
const _W = new THREE.Vector3();
const ARM_REST = 8;        // 体素：肩膀（19.5）到手心（11.5）
const LEG_REST = 9.5;      // 体素：胯（9.5）到鞋底（0）

/* 造一个人。
   skeleton：Soldier 的一份实例（只借它读手/脚的世界坐标、以及下蹲时根节点的高度）
   parent  ：挂在谁底下（自己挂 playerModel，对端挂 peerRig.root）
   opts.layer：只在哪一层出现（自己传 LAYER_PLAYER，对端不传）
   返回 { update(), dispose() } —— update 每帧调一次。 */
export function makeFigure(skeleton, parent, recipe, opts = {}) {
  if (!skeleton || !parent) return null;
  const refs = buildVoxelFigure(normLook(recipe));   // { root, body, arms:[{arm,sign}], legs:[{leg,sign}], height }
  const model = refs.root;

  /* 体素小人量出来就是 28.8 格高、脚底在 y=0，所以只要定一个比例：
     身高钉在 1.72 米（和原来的士兵一样高），一格 = 1.72/28.8 ≈ 0.0597 米。
     头发再高（丸子头、帽子）也不改这个基准 —— 那是"这个人高一点"，
     不是"所有人都缩小"。 */
  const S = 1.72 / refs.height;
  model.scale.setScalar(S);
  model.rotation.y = Math.PI;              // 模型脸朝 +z，游戏里角色脸朝 -z
  model.position.set(0, 0, 0);             // 脚底本来就在 0
  const footBase = 0;

  const layer = (opts.layer === undefined || opts.layer === null) ? null : opts.layer;
  model.traverse((o) => {
    if (!o.isMesh) return;
    o.castShadow = false;                  // 阴影是静态烘焙的，动的人不投影
    o.receiveShadow = false;
    o.frustumCulled = false;
    if (layer !== null) o.layers.set(layer);
  });
  parent.add(model);

  const bone = (n) => skeleton.getObjectByName('mixamorig' + n);
  const handR = bone('RightHand'), handL = bone('LeftHand');
  const footR = bone('RightFoot'), footL = bone('LeftFoot');

  /* 身体的高低跟着胯骨走：站着不动它就在 0，下蹲时胯落下去，方块人的上半身也跟着
     落下去（腿被压短、脚仍然踩在地上）。量一次站姿的胯高当零点。

     ⚠️ 下蹲是四九厘米，直接照搬会把方块人压进地里 —— 方块人的胯本来就比士兵的
     胯低（小人胯只占身高三成三，士兵占六成二）。所以按两个胯高的比例打个折：
     士兵胯落 49 厘米，方块人的身子落 26 厘米，看上去还是同一个蹲。 */
  const hipsBone = bone('Hips');
  const _H = new THREE.Vector3();
  let hipsY0 = null, HIP_K = 1, firstTick = true;
  if (hipsBone) {
    parent.updateWorldMatrix(true, true);
    hipsBone.getWorldPosition(_H);
    parent.worldToLocal(_H);
    hipsY0 = _H.y;
    const hipVox = (refs.legs[0] ? refs.legs[0].leg.position.y : LEG_REST) * (1.72 / refs.height);
    if (hipsY0 > 0.05) HIP_K = Math.min(1, hipVox / hipsY0);    // 0.567 / 1.061 ≈ 0.53
  }

  // 脚踝离地多高（量一次）。方块人的腿要"指着"脚踝再往下这么一截，鞋底才落在地上。
  let FOOT_H = 0.13;
  {
    const sk = new THREE.Vector3(); skeleton.getWorldPosition(sk);
    const f = footL || footR;
    if (f) { const p = new THREE.Vector3(); f.getWorldPosition(p); FOOT_H = Math.max(0.02, p.y - sk.y); }
  }

  // 让一节肢体从自己的轴心指向目标点：-Y 对着目标，长度按需要伸缩
  function aim(group, target, restLen, minS) {
    _DIR.copy(target).sub(group.position);
    const d = _DIR.length();
    if (d < 1e-4) return;
    group.quaternion.setFromUnitVectors(_DOWN, _DIR.divideScalar(d));
    group.scale.set(1, Math.max(minS, Math.min(1.4, d / restLen)), 1);
  }

  function update() {
    parent.updateWorldMatrix(true, true);   // 父级 → 骨架 → 每根骨头，一帧刷一次

    /* 上半身跟着胯骨升降（蹲下、跳跃的缓冲、走路的起伏都在胯上）。 */
    if (hipsBone && hipsY0 !== null) {
      hipsBone.getWorldPosition(_H);
      parent.worldToLocal(_H);
      if (firstTick) { firstTick = false; hipsY0 = _H.y; }   // 以动画第一帧为准，别用 T 姿
      model.position.y = footBase + (_H.y - hipsY0) * HIP_K;
    } else {
      model.position.y = footBase;
    }
    model.updateWorldMatrix(true, false);

    /* sign = -1 的那条是「角色自己的右手」：方块人朝 +Z 站着时右手在 -X，
       整体转过 180° 之后正好落在玩家的 +X 上。 */
    for (const { arm, sign } of refs.arms) {
      const b = sign < 0 ? handR : handL;
      if (!b) continue;
      b.getWorldPosition(_W);
      model.worldToLocal(_W);
      aim(arm, _W, ARM_REST, 0.45);
    }
    for (const { leg, sign } of refs.legs) {
      const b = sign < 0 ? footR : footL;
      if (!b) continue;
      b.getWorldPosition(_W);
      _W.y -= FOOT_H;
      model.worldToLocal(_W);
      aim(leg, _W, LEG_REST, 0.22);
    }
  }

  return {
    model,
    update,
    dispose() {
      parent.remove(model);
      model.traverse((o) => { if (o.isMesh && o.material && o.material.dispose) o.material.dispose(); });
    },
  };
}
