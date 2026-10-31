import * as THREE from './three.module.js';

// Each visible side is geometry, including the hair, face, sleeves and shoes.
// The player's existing look recipe is shared with the map sprite.
const unitSphere = new THREE.SphereGeometry(1, 16, 12);
const radians = THREE.MathUtils.degToRad;

function roundedBox(width, height, depth, radius) {
  const geometry = new THREE.BoxGeometry(width, height, depth, 3, 3, 3);
  const positions = geometry.attributes.position;
  const normals = geometry.attributes.normal;
  const half = [width / 2 - radius, height / 2 - radius, depth / 2 - radius];
  const delta = new THREE.Vector3();
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i), y = positions.getY(i), z = positions.getZ(i);
    delta.set(x - THREE.MathUtils.clamp(x, -half[0], half[0]),
      y - THREE.MathUtils.clamp(y, -half[1], half[1]),
      z - THREE.MathUtils.clamp(z, -half[2], half[2])).normalize();
    positions.setXYZ(i,
      THREE.MathUtils.clamp(x, -half[0], half[0]) + delta.x * radius,
      THREE.MathUtils.clamp(y, -half[1], half[1]) + delta.y * radius,
      THREE.MathUtils.clamp(z, -half[2], half[2]) + delta.z * radius);
    normals.setXYZ(i, delta.x, delta.y, delta.z);
  }
  positions.needsUpdate = true;
  normals.needsUpdate = true;
  geometry.computeBoundingSphere();
  return geometry;
}

function mat(color, roughness = .72) {
  return new THREE.MeshStandardMaterial({color, roughness, metalness: 0});
}

function mesh(parent, geometry, color, x = 0, y = 0, z = 0) {
  const part = new THREE.Mesh(geometry, mat(color));
  part.position.set(x, y, z);
  part.castShadow = true;
  parent.add(part);
  return part;
}

function block(parent, color, x, y, z, w, h, d, bevel = .025) {
  return mesh(parent, roundedBox(w, h, d, Math.min(bevel, w / 2, h / 2, d / 2)), color, x, y, z);
}

function orb(parent, color, x, y, z, sx, sy, sz) {
  const part = mesh(parent, unitSphere, color, x, y, z);
  part.scale.set(sx, sy, sz);
  return part;
}

function outlinedPrism(parent, color, outline, depth, bevel = .025) {
  const shape = new THREE.Shape();
  outline.forEach(([x, y], index) => index ? shape.lineTo(x, y) : shape.moveTo(x, y));
  shape.closePath();
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth, steps: 1, bevelEnabled: true, bevelThickness: bevel,
    bevelSize: bevel, bevelSegments: 2, curveSegments: 1
  });
  geometry.translate(0, 0, -depth / 2);
  return mesh(parent, geometry, color);
}

// Each horizontal ring has its own cheek, jaw and brow depth. Unlike a flat
// extruded outline, this keeps a readable human profile at every rotation.
function sculptedHead(parent, color, faceShape) {
  const round = faceShape === 'round';
  const rings = round
    ? [[.035,.22,.25,.23],[.09,.29,.30,.28],[.16,.35,.35,.31],
       [.25,.40,.40,.34],[.35,.44,.43,.36],[.47,.44,.40,.36],
       [.59,.42,.39,.35],[.72,.39,.36,.33],[.82,.34,.31,.30],
       [.89,.25,.24,.24],[.93,.13,.14,.15]]
    : [[.035,.23,.24,.23],[.09,.31,.29,.28],[.16,.36,.33,.31],
       [.25,.40,.37,.34],[.35,.42,.39,.35],[.47,.42,.39,.35],
       [.59,.41,.38,.34],[.72,.40,.36,.33],[.82,.36,.31,.30],
       [.89,.28,.24,.24],[.93,.15,.14,.15]];
  const sides = 24, power = round ? 1.0 : .58;
  const positions = [], indices = [];
  for (const [y, width, front, back] of rings) {
    for (let j = 0; j < sides; j++) {
      const angle = j * Math.PI * 2 / sides;
      const cx = Math.cos(angle), cz = Math.sin(angle);
      const x = width * Math.sign(cx) * Math.abs(cx) ** power;
      const cheek = cz > 0 ? .050 *
        Math.exp(-Math.pow((Math.abs(x) - .27) / .16, 2) - Math.pow((y - .34) / .15, 2)) : 0;
      positions.push(x, y,
        (cz >= 0 ? front : back) * Math.sign(cz) * Math.abs(cz) ** power + cheek);
    }
  }
  for (let i = 0; i < rings.length - 1; i++) for (let j = 0; j < sides; j++) {
    const a = i * sides + j, b = i * sides + (j + 1) % sides;
    const c = (i + 1) * sides + j, d = (i + 1) * sides + (j + 1) % sides;
    indices.push(a, c, b, b, c, d);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return mesh(parent, geometry, color);
}

function voxelTiles(parent, color, tiles) {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({color: 0xffffff, roughness: .82});
  const instanced = new THREE.InstancedMesh(geometry, material, tiles.length);
  const transform = new THREE.Object3D();
  const base = new THREE.Color(color);
  tiles.forEach(([x, y, z, sx, sy, sz, factor], index) => {
    transform.position.set(x, y, z);
    transform.scale.set(sx, sy, sz);
    transform.updateMatrix();
    instanced.setMatrixAt(index, transform.matrix);
    instanced.setColorAt(index, base.clone().multiplyScalar(factor));
  });
  instanced.instanceMatrix.needsUpdate = true;
  instanced.instanceColor.needsUpdate = true;
  instanced.castShadow = true;
  parent.add(instanced);
  return instanced;
}

function shade(color, factor) {
  return new THREE.Color(color).multiplyScalar(factor).getStyle();
}

function line(parent, color, points, radius = .009) {
  const curve = new THREE.CatmullRomCurve3(points.map(point => new THREE.Vector3(...point)));
  return mesh(parent, new THREE.TubeGeometry(curve, 12, radius, 5, false), color);
}

function buildAvatar(recipe) {
  const v = window.MPLook.norm(recipe);
  const model = new THREE.Group();
  const skin = v.skin, hair = v.hairColor, shirt = v.cloth;
  const darkHair = shade(hair, .72), lightHair = shade(hair, 1.14);
  const trouserShade = shade(v.pants, .74), shoeColor = shade(v.pants, .47);
  const lip = new THREE.Color(skin).lerp(new THREE.Color('#96555b'), .48).getStyle();
  const refs = {model, arms: [], legs: [], eyes: []};

  // A shoulder-to-waist taper and two separate pant legs read as a person
  // from the front, side and back, even when the camera is pitched.
  const body = new THREE.Group();
  model.add(body);
  refs.body = body;
  outlinedPrism(body, shirt, [
    [-.41, -.49], [.41, -.49], [.49, .43], [.36, .49],
    [-.36, .49], [-.49, .43]
  ], .55, .025);
  block(body, v.pants, 0, -.55, 0, .77, .18, .51, .018);
  block(body, v.clothAlt, 0, .465, .287, .28, .055, .025, .01);
  block(body, skin, 0, .55, 0, .20, .22, .22, .018);

  if (v.clothPattern === 'stripe') {
    for (const y of [.31, .18, .05, -.08, -.21, -.34]) {
      const width = y > .2 ? .81 : .77 + (y + .34) * .05;
      block(body, v.clothAlt, 0, y, .309, width, .042, .014, .004);
    }
  } else {
    // Small collar and shirt seam details stay visible without changing the
    // player's chosen solid color.
    block(body, shade(shirt, .86), 0, -.46, .306, .76, .025, .014, .004);
  }

  for (const sign of [-1, 1]) {
    const arm = new THREE.Group();
    arm.position.set(sign * .53, .45, 0);
    model.add(arm);
    block(arm, shirt, sign * .025, -.37, 0, .25, .78, .40, .03);
    block(arm, shade(shirt, 1.025), sign * .025, -.18, .204, .22, .31, .02, .012);
    block(arm, shade(shirt, .985), sign * .025, -.53, .203, .21, .26, .016, .009);
    block(arm, shade(shirt, .72), sign * .025, -.77, 0, .255, .055, .405, .009);
    block(arm, skin, sign * .025, -.93, .005, .205, .23, .27, .021);
    block(arm, skin, -sign * .07, -.91, .14, .07, .12, .075, .015);
    refs.arms.push({arm, sign});

    const leg = new THREE.Group();
    leg.position.set(sign * .20, -.60, 0);
    model.add(leg);
    block(leg, v.pants, 0, -.43, 0, .33, .86, .42, .025);
    block(leg, shade(v.pants, 1.018), 0, -.33, .217, .29, .39, .012, .009);
    block(leg, shade(v.pants, .978), 0, -.61, .218, .30, .12, .012, .009);
    block(leg, trouserShade, 0, -.83, .21, .33, .045, .016, .004);
    block(leg, trouserShade, 0, -.37, .217, .012, .65, .012, .003);
    block(leg, shoeColor, 0, -.96, .13, .36, .18, .59, .023);
    block(leg, shade(shoeColor, .83), 0, -1.065, .13, .38, .05, .61, .009);
    block(leg, shade(v.pants, .89), 0, -.89, .355, .20, .025, .012, .004);
    refs.legs.push({leg, sign});
  }

  const head = new THREE.Group();
  head.position.y = .65;
  model.add(head);
  refs.head = head;
  sculptedHead(head, skin, v.faceShape);
  for (const sign of [-1, 1]) {
    const earX = v.faceShape === 'round' ? .47 : .435;
    block(head, skin, sign * earX, .43, 0, .13, .21, .19, .022);
    block(head, shade(skin, .85), sign * (earX + .071), .43, .083, .018, .09, .07, .006);
    const brow = block(head, darkHair, sign * .18, .635, .379, .20, .046, .03, .008);
    brow.rotation.z = -sign * .06;
    const eye = new THREE.Group();
    eye.position.set(sign * .18, .49, .379);
    head.add(eye);
    const eyeHeight = v.eye === 'narrow' ? .10 : v.eye === 'dot' ? .11 : .165;
    block(eye, '#f9f6ef', 0, 0, 0, .205, eyeHeight, .03, .018);
    block(eye, v.eyeColor, 0, -.007, .023, .118, eyeHeight * .84, .018, .019);
    block(eye, '#19202a', 0, -.010, .037, .048, eyeHeight * .58, .012, .008);
    block(eye, '#ffffff', -.025, .028, .048, .026, .030, .008, .004);
    block(eye, shade(skin, .80), 0, eyeHeight / 2 + .013, .024, .215, .026, .021, .009);
    block(eye, shade(skin, .92), 0, -eyeHeight / 2 - .009, .012, .19, .018, .015, .006);
    refs.eyes.push(eye);
  }
  block(head, shade(skin, 1.04), 0, .365, .39, .071, .15, .070, .015);
  block(head, shade(skin, .94), 0, .305, .425, .10, .065, .060, .015);
  const smile = v.mouth === 'smile';
  line(head, lip, [[-.11, smile ? .23 : .205, .388],[-.055, smile ? .212 : .195, .404],
    [0, smile ? .20 : .19, .411],[.055, smile ? .212 : .195, .404],
    [.11, smile ? .23 : .205, .388]], .009);
  line(head, shade(skin,.87), [[-.055,.155,.391],[0,.145,.402],[.055,.155,.391]], .005);

  // Layered locks make the hair legible as sculpted geometry in side/back views.
  block(head, hair, 0, .89, -.015, .92, .25, .80, .025);
  block(head, hair, -.04, 1.048, .065, .73, .105, .62, .022);
  block(head, shade(hair, 1.045), -.11, 1.110, .025, .48, .085, .44, .014);
  const hairLength = v.hairStyle === 'long' ? .93 : v.hairStyle === 'mid' ? .72 : .57;
  const sideLength = v.hairStyle === 'short' ? .43 : hairLength;
  const backSections = Math.ceil(hairLength / .14);
  for (let row = 0; row < backSections; row++) {
    const y = .79 - row * .135;
    const width = .80 - Math.max(0, row - 1) * .045;
    block(head, darkHair, 0, y, -.354, width, .145, .13, .015);
  }
  for (const sign of [-1, 1]) {
    block(head, hair, sign * .393, .83 - sideLength / 2, .015, .105, sideLength, .67, .019);
    block(head, lightHair, sign * .27, .988, .09, .20, .035, .32, .007);
  }
  const fringe = ['ponytail','bun'].includes(v.hairStyle)
    ? [[-.34,.79,.14,.19],[-.21,.82,.15,.17],[-.07,.84,.15,.16],[.09,.83,.16,.17],[.24,.81,.15,.18],[.36,.78,.13,.19]]
    : v.hairStyle === 'short'
      ? [[-.34,.78,.15,.24],[-.20,.85,.16,.18],[-.05,.88,.16,.17],[.11,.83,.16,.22],[.26,.77,.15,.27],[.38,.76,.12,.22]]
      : [[-.35,.79,.14,.22],[-.21,.82,.15,.19],[-.06,.84,.16,.16],[.10,.84,.16,.17],[.25,.81,.15,.19],[.37,.79,.12,.22]];
  for (const [index, [x, y, w, h]] of fringe.entries()) {
    const lock = block(head, index % 3 === 0 ? shade(hair, 1.025) : hair,
      x, y, .376 + (index % 2) * .009, w, h, .115, .015);
    lock.rotation.z = (index - 2.5) * .015;
  }
  for (const [x,y,w] of [[-.31,1.004,.16],[-.08,1.018,.18],[.18,1.008,.17],[.36,.997,.11]])
    block(head, lightHair, x, y, .17, w, .028, .34, .006);
  const hairTiles = [];
  for (let ix = -4; ix <= 4; ix++) for (let iz = -3; iz <= 3; iz++) {
    const x = ix * .105, z = iz * .106;
    const centerLift = .035 * (1 - Math.abs(ix) / 5) * (1 - Math.abs(iz) / 4);
    hairTiles.push([x, 1.039 + centerLift, z, .104, .073 + centerLift, .105,
      .90 + ((ix * 7 + iz * 11 + 53) % 5) * .042]);
  }
  const backRows = Math.ceil(hairLength / .104);
  for (let row = 0; row < backRows; row++) for (let ix = -3; ix <= 3; ix++) {
    const y = .77 - row * .104;
    hairTiles.push([ix * .108, y, -.430, .107, .103, .070,
      .84 + ((ix * 5 + row * 3 + 41) % 5) * .048]);
  }
  const sideRows = Math.ceil(sideLength / .104);
  for (const sign of [-1, 1]) for (let row = 0; row < sideRows; row++) for (let iz = -2; iz <= 2; iz++) {
    const y = .78 - row * .104, z = iz * .12;
    if (y < .58 && z > -.13 && z < .19) continue; // leave the ear visible
    hairTiles.push([sign * .457, y, z, .067, .102, .118,
      .86 + ((row * 3 + iz * 7 + 29) % 5) * .044]);
  }
  voxelTiles(head, hair, hairTiles);
  if (v.hairStyle === 'ponytail') {
    block(head, hair, .35, .51, -.50, .24, .53, .23, .032);
    block(head, v.accColor, .35, .74, -.50, .17, .065, .24, .01);
  }
  if (v.hairStyle === 'bun') orb(head, hair, 0, 1.05, -.29, .25, .20, .20);
  if (v.hairStyle === 'twintails') for (const sign of [-1, 1])
    block(head, hair, sign * .53, .36, -.17, .22, .60, .22, .035);

  if (v.acc === 'glasses') {
    for (const sign of [-1, 1]) {
      block(head, v.accColor, sign * .18, .48, .428, .20, .018, .025, .003);
      block(head, v.accColor, sign * .18, .535, .428, .20, .015, .025, .003);
      for (const edge of [-1, 1])
        block(head, v.accColor, sign * .18 + edge * .095, .48, .428, .015, .12, .025, .003);
      block(head, v.accColor, sign * .39, .49, .17, .025, .020, .47, .004);
    }
    block(head, v.accColor, 0, .49, .431, .17, .018, .025, .004);
  }
  if (v.acc === 'cap') {
    block(head, v.accColor, 0, 1.00, -.01, .92, .22, .79, .025);
    block(head, v.accColor, 0, .925, .39, .82, .065, .28, .012);
  }
  if (v.acc === 'scarf') {
    block(model, v.accColor, 0, .55, .04, .60, .17, .46, .025);
    block(model, v.accColor, .25, .27, .26, .17, .43, .11, .020);
  }
  return refs;
}

export function mount(stage, recipe) {
  const renderer = new THREE.WebGLRenderer({alpha: true, antialias: true, powerPreference: 'low-power'});
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.domElement.className = 'mp-avatar-canvas';
  renderer.domElement.setAttribute('aria-hidden', 'true');
  stage.append(renderer.domElement);

  const scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight(0xfff7ef, 0x58616e, 1.25));
  const key = new THREE.DirectionalLight(0xffdfba, 2.9);
  key.position.set(-4, 5, 5);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xb3d9f1, 1.4);
  rim.position.set(3, 2, -4);
  scene.add(rim);
  const camera = new THREE.PerspectiveCamera(38, 1, .1, 30);
  camera.position.set(0, .04, 5.65);
  camera.lookAt(0, .04, 0);
  const orbit = new THREE.Group();
  scene.add(orbit);
  let figure = buildAvatar(recipe);
  orbit.add(figure.model);
  let yaw = -.22, pitch = -.10, alive = true, frame = 0;
  const size = () => {
    const width = Math.max(1, stage.clientWidth), height = Math.max(1, stage.clientHeight);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  };
  const observer = new ResizeObserver(size);
  observer.observe(stage);
  size();
  const disposeModel = model => model.traverse(item => {
    if (!item.isMesh) return;
    if (item.geometry !== unitSphere) item.geometry.dispose();
    item.material.dispose();
  });
  const destroy = () => {
    if (!alive) return;
    alive = false;
    cancelAnimationFrame(frame);
    observer.disconnect();
    disposeModel(figure.model);
    renderer.dispose();
    renderer.domElement.remove();
  };
  const tick = now => {
    if (!alive) return;
    if (!stage.isConnected) { destroy(); return; }
    const t = now / 1000;
    figure.model.position.y = Math.sin(t * 1.45) * .014;
    figure.model.rotation.z = Math.sin(t * .68) * .008;
    figure.body.scale.y = 1 + Math.sin(t * 1.45) * .005;
    figure.head.rotation.z = Math.sin(t * .82) * .018;
    figure.head.rotation.y = Math.sin(t * .61) * .025;
    for (const {arm, sign} of figure.arms)
      arm.rotation.x = sign * Math.sin(t * 1.05 + sign) * .025;
    for (const {leg, sign} of figure.legs)
      leg.rotation.x = Math.sin(t * .92 + sign) * .008;
    const blink = Math.abs((t % 4.7) - 4.25) < .075 ? .12 : 1;
    for (const eye of figure.eyes) eye.scale.y = blink;
    orbit.rotation.set(pitch, yaw, 0, 'YXZ');
    if (!document.hidden && !stage.closest('#mpProfileShade')?.hidden) renderer.render(scene, camera);
    frame = requestAnimationFrame(tick);
  };
  frame = requestAnimationFrame(tick);
  return {
    setAngles(nextYaw, nextPitch) {
      yaw = radians(nextYaw);
      pitch = radians(THREE.MathUtils.clamp(nextPitch, -78, 78));
    },
    update(nextRecipe) {
      orbit.remove(figure.model);
      disposeModel(figure.model);
      figure = buildAvatar(nextRecipe);
      orbit.add(figure.model);
    },
    destroy
  };
}
