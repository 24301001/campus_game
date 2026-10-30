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
  const cheek = new THREE.Color(skin).lerp(new THREE.Color('#d98882'), .22).getStyle();
  const refs = {model, arms: [], legs: [], eyes: []};

  // A shoulder-to-waist taper and two separate pant legs read as a person
  // from the front, side and back, even when the camera is pitched.
  const body = new THREE.Group();
  model.add(body);
  refs.body = body;
  outlinedPrism(body, shirt, [
    [-.41, -.49], [.41, -.49], [.49, .43], [.36, .49],
    [-.36, .49], [-.49, .43]
  ], .43, .025);
  block(body, v.pants, 0, -.55, 0, .77, .18, .43, .018);
  block(body, v.clothAlt, 0, .465, .223, .28, .055, .025, .01);
  block(body, skin, 0, .55, 0, .20, .22, .22, .018);

  if (v.clothPattern === 'stripe') {
    for (const y of [.31, .18, .05, -.08, -.21, -.34]) {
      const width = y > .2 ? .81 : .77 + (y + .34) * .05;
      block(body, v.clothAlt, 0, y, .249, width, .042, .014, .004);
    }
  } else {
    // Small collar and shirt seam details stay visible without changing the
    // player's chosen solid color.
    block(body, shade(shirt, .86), 0, -.46, .246, .76, .025, .014, .004);
  }

  for (const sign of [-1, 1]) {
    const arm = new THREE.Group();
    arm.position.set(sign * .53, .45, 0);
    model.add(arm);
    block(arm, shirt, sign * .025, -.37, 0, .25, .78, .36, .03);
    block(arm, shade(shirt, .72), sign * .025, -.77, 0, .255, .055, .365, .009);
    block(arm, skin, sign * .025, -.93, .005, .205, .23, .27, .021);
    block(arm, skin, -sign * .07, -.91, .14, .07, .12, .075, .015);
    refs.arms.push({arm, sign});

    const leg = new THREE.Group();
    leg.position.set(sign * .20, -.60, 0);
    model.add(leg);
    block(leg, v.pants, 0, -.43, 0, .33, .86, .42, .025);
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
  const faceOutline = v.faceShape === 'round'
    ? [[-.25,.05],[.25,.05],[.36,.15],[.43,.32],[.44,.59],[.39,.78],
      [.30,.88],[-.30,.88],[-.39,.78],[-.44,.59],[-.43,.32],[-.36,.15]]
    : [[-.29,.05],[.29,.05],[.39,.18],[.40,.79],[.34,.88],
      [-.34,.88],[-.40,.79],[-.39,.18]];
  outlinedPrism(head, skin, faceOutline, .64, v.faceShape === 'round' ? .052 : .035);
  for (const sign of [-1, 1]) {
    const earX = v.faceShape === 'round' ? .47 : .435;
    block(head, skin, sign * earX, .43, 0, .13, .21, .19, .022);
    block(head, shade(skin, .85), sign * (earX + .071), .43, .083, .018, .09, .07, .006);
    const brow = block(head, darkHair, sign * .18, .635, .379, .20, .046, .03, .008);
    brow.rotation.z = -sign * .06;
    const eye = new THREE.Group();
    eye.position.set(sign * .18, .49, .379);
    head.add(eye);
    const eyeHeight = v.eye === 'narrow' ? .077 : v.eye === 'dot' ? .09 : .135;
    block(eye, '#f9f6ef', 0, 0, 0, .16, eyeHeight, .03, .014);
    block(eye, v.eyeColor, 0, -.007, .023, .085, eyeHeight * .82, .018, .016);
    block(eye, '#19202a', 0, -.010, .037, .040, eyeHeight * .56, .012, .008);
    block(eye, '#ffffff', -.018, .021, .048, .023, .027, .008, .004);
    block(eye, shade(skin, .80), 0, eyeHeight / 2 + .012, .024, .18, .025, .021, .009);
    block(eye, shade(skin, .92), 0, -eyeHeight / 2 - .008, .012, .16, .018, .015, .006);
    refs.eyes.push(eye);
    block(head, shade(skin, 1.03), sign * .285, .30, .36, .16, .10, .025, .021);
    block(head, cheek, sign * .30, .285, .379, .075, .026, .010, .006);
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
  const hairLength = v.hairStyle === 'long' ? .93 : v.hairStyle === 'mid' ? .72 : .57;
  block(head, darkHair, 0, .80 - hairLength / 2, -.356, .78, hairLength, .13, .019);
  for (const sign of [-1, 1]) {
    block(head, hair, sign * .393, .83 - hairLength / 2, .015, .105, hairLength, .67, .019);
    block(head, lightHair, sign * .27, .988, .09, .20, .035, .32, .007);
  }
  const fringe = ['ponytail','bun'].includes(v.hairStyle)
    ? [[-.30,.78,.21,.20],[-.11,.83,.18,.17],[.13,.82,.20,.17],[.31,.78,.17,.20]]
    : v.hairStyle === 'short'
      ? [[-.30,.78,.20,.23],[-.10,.82,.20,.19],[.11,.81,.19,.19],[.31,.76,.18,.25]]
      : [[-.31,.78,.19,.23],[-.11,.83,.20,.17],[.12,.83,.19,.17],[.31,.78,.18,.23]];
  for (const [x, y, w, h] of fringe)
    block(head, hair, x, y, .373, w, h, .115, .015);
  for (const [x,y,w] of [[-.31,1.004,.16],[-.08,1.018,.18],[.18,1.008,.17],[.36,.997,.11]])
    block(head, lightHair, x, y, .17, w, .028, .34, .006);
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
  scene.add(new THREE.HemisphereLight(0xf7f9ff, 0x58616e, 1.7));
  const key = new THREE.DirectionalLight(0xfff4e6, 2.5);
  key.position.set(-3, 5, 6);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xb3d9f1, 1.25);
  rim.position.set(3, 2, -4);
  scene.add(rim);
  const camera = new THREE.PerspectiveCamera(38, 1, .1, 30);
  camera.position.set(0, .04, 5.65);
  camera.lookAt(0, .04, 0);
  const orbit = new THREE.Group();
  scene.add(orbit);
  let figure = buildAvatar(recipe);
  orbit.add(figure.model);
  let yaw = -.22, pitch = -.10, viewMode = 'full', alive = true, frame = 0;
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
    if (viewMode === 'face') {
      const focus = new THREE.Vector3(0, 1.10 + figure.model.position.y, 0).applyQuaternion(orbit.quaternion);
      camera.position.set(focus.x, focus.y, focus.z + 1.95);
      camera.lookAt(focus);
    } else {
      camera.position.set(0, .04, 5.65);
      camera.lookAt(0, .04, 0);
    }
    if (!document.hidden && !stage.closest('#mpProfileShade')?.hidden) renderer.render(scene, camera);
    frame = requestAnimationFrame(tick);
  };
  frame = requestAnimationFrame(tick);
  return {
    setAngles(nextYaw, nextPitch) {
      yaw = radians(nextYaw);
      pitch = radians(THREE.MathUtils.clamp(nextPitch, -78, 78));
    },
    setView(mode) { viewMode = mode === 'face' ? 'face' : 'full'; },
    update(nextRecipe) {
      orbit.remove(figure.model);
      disposeModel(figure.model);
      figure = buildAvatar(nextRecipe);
      orbit.add(figure.model);
    },
    destroy
  };
}
