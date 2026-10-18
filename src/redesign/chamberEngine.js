import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';

export const N = 9000;
const R = 2.7;           // invisible bounds of the particle cloud
const HALF_H = 2.6;

// ───────────────────────── target sampling ─────────────────────────
const rnd = Math.random;

function loadImage(src) {
  return new Promise((res, rej) => {
    const im = new Image();
    im.onload = () => res(im);
    im.onerror = rej;
    im.src = src;
  });
}

function sampleCanvas(canvas, { mode, width, height, depth = 0.55, page = false }) {
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const { width: cw, height: ch } = canvas;
  const data = ctx.getImageData(0, 0, cw, ch).data;
  const cand = [];
  for (let y = 0; y < ch; y += 1) {
    for (let x = 0; x < cw; x += 1) {
      const i = (y * cw + x) * 4;
      const a = data[i + 3];
      const lum = (data[i] * 0.3 + data[i + 1] * 0.59 + data[i + 2] * 0.11);
      const on = mode === 'dark' ? (a > 80 && lum < 150) : mode === 'logo' ? (a > 80 && lum < 235) : (a > 80 && lum > 110);
      if (on) { cand.push(x, y); if (mode === 'logo' && lum < 90) cand.push(x, y, x, y); }
    }
  }
  const total = cand.length / 2;
  const out = new Float32Array(N * 3);
  const edgeCount = page ? Math.floor(N * 0.12) : 0;
  const body = N - edgeCount;
  for (let k = 0; k < body; k++) {
    const j = Math.floor(rnd() * total) * 2;
    const px = cand[j] + rnd(), py = cand[j + 1] + rnd();
    out[k * 3] = (px / cw - 0.5) * width;
    out[k * 3 + 1] = (0.5 - py / ch) * height;
    out[k * 3 + 2] = (rnd() - 0.5) * depth;
  }
  // page silhouette so a paper reads as a sheet, not just scattered text
  for (let k = 0; k < edgeCount; k++) {
    const s = rnd() * 4, t = rnd();
    let x, y;
    if (s < 1) { x = t - 0.5; y = 0.5; } else if (s < 2) { x = t - 0.5; y = -0.5; } else if (s < 3) { x = -0.5; y = t - 0.5; } else { x = 0.5; y = t - 0.5; }
    const o = (body + k) * 3;
    out[o] = x * width; out[o + 1] = y * height; out[o + 2] = (rnd() - 0.5) * depth * 0.5;
  }
  return out;
}

async function imageTargets(f) {
  const im = await loadImage(f.src);
  const [sx, sy, sw, sh] = f.crop || [0, 0, im.width, im.height];
  const aspect = sw / sh;
  const width = f.w, height = f.h || f.w / aspect;
  const cvs = document.createElement('canvas');
  cvs.width = 520; cvs.height = Math.round(520 / aspect);
  cvs.getContext('2d').drawImage(im, sx, sy, sw, sh, 0, 0, cvs.width, cvs.height);
  return sampleCanvas(cvs, { mode: f.mode, width, height, depth: 0.7 });
}

async function textTargets(f) {
  try { await document.fonts.load("700 160px 'Syne'"); } catch { /* fall through */ }
  const cvs = document.createElement('canvas');
  cvs.width = 900; cvs.height = 300;
  const ctx = cvs.getContext('2d');
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, 900, 300);
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  let size = 170;
  ctx.font = `700 ${size}px 'Syne', sans-serif`;
  while (ctx.measureText(f.text).width > 820 && size > 40) { size -= 6; ctx.font = `700 ${size}px 'Syne', sans-serif`; }
  ctx.fillText(f.text, 450, 150);
  return sampleCanvas(cvs, { mode: 'light', width: 4.8, height: 4.8 / 3, depth: 0.7 });
}

async function stlTargets(f) {
  const buf = await (await fetch(f.src)).arrayBuffer();
  const geo = new STLLoader().parse(buf);
  geo.rotateX(f.rotX || 0);
  geo.computeBoundingBox();
  const c = new THREE.Vector3(); geo.boundingBox.getCenter(c);
  const sz = new THREE.Vector3(); geo.boundingBox.getSize(sz);
  const k = f.size / Math.max(sz.x, sz.y, sz.z);
  const pos = geo.attributes.position;
  const tris = pos.count / 3;
  const cum = new Float32Array(tris);
  const a = new THREE.Vector3(), b = new THREE.Vector3(), d = new THREE.Vector3();
  let acc = 0;
  for (let t = 0; t < tris; t++) {
    a.fromBufferAttribute(pos, t * 3); b.fromBufferAttribute(pos, t * 3 + 1); d.fromBufferAttribute(pos, t * 3 + 2);
    b.sub(a); d.sub(a);
    acc += b.cross(d).length() * 0.5;
    cum[t] = acc;
  }
  const out = new Float32Array(N * 3);
  const p1 = new THREE.Vector3(), p2 = new THREE.Vector3(), p3 = new THREE.Vector3();
  for (let i = 0; i < N; i++) {
    const r = rnd() * acc;
    let lo = 0, hi = tris - 1;
    while (lo < hi) { const m = (lo + hi) >> 1; if (cum[m] < r) lo = m + 1; else hi = m; }
    p1.fromBufferAttribute(pos, lo * 3); p2.fromBufferAttribute(pos, lo * 3 + 1); p3.fromBufferAttribute(pos, lo * 3 + 2);
    let u = rnd(), v = rnd(); if (u + v > 1) { u = 1 - u; v = 1 - v; }
    out[i * 3] = (p1.x + (p2.x - p1.x) * u + (p3.x - p1.x) * v - c.x) * k;
    out[i * 3 + 1] = (p1.y + (p2.y - p1.y) * u + (p3.y - p1.y) * v - c.y) * k;
    out[i * 3 + 2] = (p1.z + (p2.z - p1.z) * u + (p3.z - p1.z) * v - c.z) * k;
  }
  geo.dispose();
  return out;
}

const modelCache = new Map();
export function getModelGeo(f) {
  if (!modelCache.has(f.src)) {
    modelCache.set(f.src, fetch(f.src).then(r => r.arrayBuffer()).then(buf => {
      const geo = new STLLoader().parse(buf);
      geo.rotateX(f.rotX || 0);
      geo.computeBoundingBox();
      const c = new THREE.Vector3(); geo.boundingBox.getCenter(c);
      const sz = new THREE.Vector3(); geo.boundingBox.getSize(sz);
      const k = f.size / Math.max(sz.x, sz.y, sz.z);
      geo.translate(-c.x, -c.y, -c.z); geo.scale(k, k, k);
      geo.computeVertexNormals();
      geo.userData.cached = true;
      return geo;
    }));
  }
  return modelCache.get(f.src);
}

// Show one item in an engine: real card (png/page), real STL mesh, or particle text fallback.
export async function present(eng, item, stale = () => false) {
  const f = item.form;
  if (f.type === 'card' || f.type === 'paper') {
    if (stale()) return;
    eng.setTarget(null, false, false);
    await eng.showCard(f.src, { crop: f.crop, h: f.h || (f.type === 'paper' ? 5.2 : 4.2) });
  } else if (f.type === 'stl') {
    const geo = await getModelGeo(f);
    if (stale()) return;
    eng.setTarget(null, false, false);
    await eng.showModel(geo);
  } else {
    const tg = await getTargets(item);
    if (stale()) return;
    eng.setTarget(tg, false, false);
  }
}

const cache = new Map();
export function getTargets(item) {
  if (!cache.has(item.id)) {
    const f = item.form;
    cache.set(item.id, f.type === 'paper' ? Promise.resolve(null) : f.type === 'image' ? imageTargets(f) : f.type === 'stl' ? stlTargets(f) : textTargets(f));
  }
  return cache.get(item.id);
}

// ───────────────────────── shaders ─────────────────────────
const pointVS = `
  attribute float aSeed;
  uniform float uScale, uCloud, uFlash;
  varying float vSeed; varying float vDepth;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    float size = mix(0.05, 0.085, uCloud) * (0.65 + 0.7 * aSeed);
    gl_PointSize = max(size * uScale / -mv.z, 1.2);
    vSeed = aSeed; vDepth = clamp((-mv.z - 8.0) / 6.0, 0.0, 1.0);
    gl_Position = projectionMatrix * mv;
  }`;
const pointFS = `
  uniform float uCloud, uFlash, uFade, uTime;
  varying float vSeed; varying float vDepth;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float soft = smoothstep(0.5, 0.0, d);
    vec3 gold = mix(vec3(1.0, 0.50, 0.30), vec3(1.0, 0.86, 0.62), vSeed);
    // evening pollen: warm specks, only a few of the particles, each with its own slow twinkle
    vec3 pollen = mix(vec3(1.0, 0.78, 0.50), vec3(1.0, 0.93, 0.78), vSeed);
    float keep = mix(1.0, step(vSeed, 0.14), uCloud);
    float twinkle = 0.45 + 0.55 * (0.5 + 0.5 * sin(uTime * (0.8 + vSeed * 9.0) + vSeed * 80.0));
    vec3 col = mix(gold, pollen, uCloud);
    float a = mix(pow(soft, 1.4) * (1.0 - vDepth * 0.55), pow(soft, 1.6) * 0.55 * twinkle, uCloud) * keep;
    gl_FragColor = vec4(col, a * uFade);
  }`;
// ───────────────────────── engine ─────────────────────────
export function createChamber(container, opts = {}) {
  const NN = opts.count || N;
  const ZOOM = opts.zoom || 1;
  const LOOK_Y = opts.lookY ?? 0.55; // positive = the object sits below the middle of the frame
  const W = () => container.clientWidth, H = () => container.clientHeight;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setSize(W(), H());
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, W() / H(), 0.1, 100);
  camera.position.set(0, 0.4, 13 * ZOOM);
  const FOV_K = () => H() / (2 * Math.tan((camera.fov * Math.PI) / 360));

  const flashU = { value: 0 };
  const timeU = { value: 0 };

  // particles
  const pos = new Float32Array(N * 3), vel = new Float32Array(N * 3), tgt = new Float32Array(N * 3), seed = new Float32Array(N), delay = new Float32Array(N);
  for (let i = 0; i < NN; i++) {
    seed[i] = rnd();
    const a = rnd() * 6.283, r = Math.sqrt(rnd()) * (R - 0.25), y = (rnd() - 0.5) * HALF_H * 2 * 0.92;
    pos[i * 3] = Math.cos(a) * r; pos[i * 3 + 1] = y; pos[i * 3 + 2] = Math.sin(a) * r;
  }
  const geo = new THREE.BufferGeometry();
  const posAttr = new THREE.BufferAttribute(pos, 3); posAttr.setUsage(THREE.DynamicDrawUsage);
  geo.setAttribute('position', posAttr);
  geo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
  geo.setDrawRange(0, NN);
  const fadeU = { value: 1 }, cloudU = { value: 1 }, scaleU = { value: FOV_K() };
  const pts = new THREE.Points(geo, new THREE.ShaderMaterial({
    vertexShader: pointVS, fragmentShader: pointFS,
    uniforms: { uScale: scaleU, uCloud: cloudU, uFlash: flashU, uFade: fadeU, uTime: timeU },
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  }));
  pts.frustumCulled = false;
  scene.add(pts);

  // display: the REAL asset (png card or stl mesh), revealed by a rising clip plane
  renderer.localClippingEnabled = true;
  const clip = new THREE.Plane(new THREE.Vector3(0, -1, 0), -9);
  scene.add(new THREE.HemisphereLight(0xf2d8c0, 0x2a1a36, 0.9));
  const keyL = new THREE.DirectionalLight(0xffd9ad, 2.4); keyL.position.set(5, 4, 5); scene.add(keyL);
  const fillL = new THREE.DirectionalLight(0x6f7bb8, 0.5); fillL.position.set(-5, 1, 2); scene.add(fillL);
  // three-step toon ramp shared by every model
  const ramp = new THREE.DataTexture(new Uint8Array([70, 70, 70, 255, 160, 160, 160, 255, 255, 255, 255, 255]), 3, 1, THREE.RGBAFormat);
  ramp.minFilter = ramp.magFilter = THREE.NearestFilter; ramp.needsUpdate = true;
  const INK = 0x1c1026;

  const display = new THREE.Group(); scene.add(display);
  let displayKind = null, displayToken = 0, reveal = 0, revealing = false;
  const rot = { x: 0, y: 0 }; let lastDrag = -10, dragging = false, baseX = 0;
  const texLoader = new THREE.TextureLoader();

  function clearDisplay() {
    displayToken++;
    display.visible = false; displayKind = null;
    display.children.slice().forEach(c => display.remove(c));
  }
  function startReveal() { reveal = 0; revealing = true; clip.constant = -HALF_H - 1; display.visible = true; fadeGoal = 0.03; rot.x = 0; rot.y = 0; lastDrag = -10; }

  function showCard(src, { crop, h = 5.2 } = {}) {
    const mine = ++displayToken;
    return new Promise((resolve) => {
      texLoader.load(src, base => {
        if (mine !== displayToken) { resolve(false); return; }
        let tex = base;
        const im = base.image;
        const [sx, sy, sw, sh] = crop || [0, 0, im.width, im.height];
        if (crop) {
          const c = document.createElement('canvas'); c.width = sw * 2; c.height = sh * 2;
          c.getContext('2d').drawImage(im, sx, sy, sw, sh, 0, 0, c.width, c.height);
          tex = new THREE.CanvasTexture(c);
        }
        tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
        const w = h * (sw / sh);
        display.children.slice().forEach(c => display.remove(c));
        const mat = new THREE.MeshBasicMaterial({ map: tex, color: 0xf3e6d4, side: THREE.DoubleSide, clippingPlanes: [clip] }); // warm the white of the logo plates toward the ivory of the page
        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
        const edge = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(w, h)), new THREE.LineBasicMaterial({ color: INK, transparent: true, opacity: 0.55, clippingPlanes: [clip] }));
        // a paper shadow instead of a glow
        const shadow = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: INK, transparent: true, opacity: 0.28, depthWrite: false, clippingPlanes: [clip] }));
        shadow.position.set(0.12, -0.14, -0.06);
        display.add(shadow, mesh, edge);
        displayKind = 'card'; baseX = 0; display.rotation.set(0, 0, 0);
        burst(); startReveal(); resolve(true);
      }, undefined, () => resolve(false));
    });
  }

  function showModel(geometry) {
    const mine = ++displayToken;
    display.children.slice().forEach(c => display.remove(c));
    const mat = new THREE.MeshToonMaterial({ color: 0xe6d6c2, gradientMap: ramp, clippingPlanes: [clip] });
    const mesh = new THREE.Mesh(geometry, mat);
    // ink outline: the same mesh pushed out along its normals, back faces only
    const outlineMat = new THREE.MeshBasicMaterial({ color: INK, side: THREE.BackSide, clippingPlanes: [clip] });
    outlineMat.onBeforeCompile = sh => { sh.vertexShader = sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n transformed += normal * 0.03;'); };
    const outline = new THREE.Mesh(geometry, outlineMat);
    const crease = new THREE.LineSegments(new THREE.EdgesGeometry(geometry, 40), new THREE.LineBasicMaterial({ color: INK, transparent: true, opacity: 0.45, clippingPlanes: [clip] }));
    display.add(outline, mesh, crease);
    displayKind = 'model'; baseX = 0.5; display.rotation.set(baseX, 0, 0);
    if (mine === displayToken) { burst(); startReveal(); }
    return Promise.resolve(true);
  }

  // drag to rotate the shown object
  let px = 0, py = 0;
  const down = e => { if (!displayKind) return; dragging = true; px = e.clientX; py = e.clientY; container.setPointerCapture?.(e.pointerId); container.style.cursor = 'grabbing'; };
  const move = e => { if (!dragging) return; rot.y += (e.clientX - px) * 0.01; rot.x = Math.max(-1.3, Math.min(1.3, rot.x + (e.clientY - py) * 0.01)); px = e.clientX; py = e.clientY; lastDrag = t; };
  const up = () => { dragging = false; container.style.cursor = 'grab'; };
  container.style.touchAction = 'none';
  container.addEventListener('pointerdown', down);
  window.addEventListener('pointermove', move);
  window.addEventListener('pointerup', up);

  // spark effects

  let t = 0;
  // state
  let mode = 'cloud';      // cloud | form
  let spark = 0;           // 1 → 0 over ~1.1s
  let sparkT = 0;
  let hasTarget = false;
  let spin = false;
  let fadeGoal = 1;
  const mouse = { x: 0, y: 0 };
  const onMove = e => { const r = container.getBoundingClientRect(); mouse.x = ((e.clientX - r.left) / r.width - 0.5) * 2; mouse.y = ((e.clientY - r.top) / r.height - 0.5) * 2; };
  window.addEventListener('pointermove', onMove);

  function burst() {
    spark = 1; sparkT = 0;
    for (let i = 0; i < NN; i++) {
      const x = pos[i * 3], y = pos[i * 3 + 1], z = pos[i * 3 + 2];
      const l = Math.hypot(x, y, z) || 1, s = 0.5 + rnd() * 1.1;
      vel[i * 3] += (x / l + (rnd() - 0.5)) * s; vel[i * 3 + 1] += (y / l + (rnd() - 0.5)) * s; vel[i * 3 + 2] += (z / l + (rnd() - 0.5)) * s;
      delay[i] = 0.35 + rnd() * 0.5;
    }
  }

  function setTarget(arr, spins = false, hide = false) {
    spin = spins; fadeGoal = hide ? 0.08 : 1;
    if (arr) { tgt.set(arr); hasTarget = true; mode = 'form'; } else { hasTarget = false; mode = 'cloud'; }
    if (arr) clearDisplay();
    burst();
  }

  let last = performance.now(), raf = 0, cloudMix = 1;
  function frame(now) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min((now - last) / 1000, window.__chamberMaxDt || 0.05); last = now; t += dt; timeU.value = t;
    cloudMix += ((mode === 'cloud' ? 1 : 0) - cloudMix) * Math.min(dt * 2.2, 1);
    cloudU.value = cloudMix;
    fadeU.value += (fadeGoal - fadeU.value) * Math.min(dt * 3, 1);

    const form = mode === 'form';
    const cosR = Math.cos(t * 0.24), sinR = Math.sin(t * 0.24);
    for (let i = 0; i < NN; i++) {
      const o = i * 3;
      let x = pos[o], y = pos[o + 1], z = pos[o + 2];
      let vx = vel[o], vy = vel[o + 1], vz = vel[o + 2];
      if (delay[i] > 0) delay[i] -= dt;
      if (form && delay[i] <= 0) {
        // spring to the formation (formation is local space; rotate group instead)
        const k = 16, c = 5.2;
        vx += ((tgt[o] - x) * k - vx * c) * dt;
        vy += ((tgt[o + 1] - y) * k - vy * c) * dt;
        vz += ((tgt[o + 2] - z) * k - vz * c) * dt;
      } else if (!form) {
        // swirling cloud inside the chamber
        const r = Math.hypot(x, z) + 1e-4, w = (0.12 + seed[i] * 0.18) / (0.6 + r * 0.45);
        vx += (-z / r * w + Math.sin(t * 0.37 + seed[i] * 31) * 0.08 - vx * 0.9) * dt * 2.4; vz += (x / r * w - vz * 0.9) * dt * 2.4;
        vy += (0.07 + Math.sin(t * 0.5 + seed[i] * 40) * 0.12 - vy * 0.9) * dt * 2.4;
        if (r > R - 0.3) { vx -= (x / r) * (r - R + 0.3) * 18 * dt; vz -= (z / r) * (r - R + 0.3) * 18 * dt; }
        if (y > HALF_H) { y = -HALF_H; vy = 0.05; }
        if (y < -HALF_H - 0.2) vy += (-HALF_H - 0.2 - y) * 18 * dt;
      } else {
        vx *= 1 - dt * 1.2; vy *= 1 - dt * 1.2; vz *= 1 - dt * 1.2;
      }
      pos[o] = x + vx * dt; pos[o + 1] = y + vy * dt; pos[o + 2] = z + vz * dt;
      vel[o] = vx; vel[o + 1] = vy; vel[o + 2] = vz;
    }
    posAttr.needsUpdate = true;
    pts.rotation.y = !form ? 0 : spin ? t * 0.35 : Math.sin(t * 0.55) * 0.6;
    void cosR; void sinR;

    // spark visuals
    if (spark > 0) { sparkT += dt; spark = Math.max(0, 1 - sparkT / 1.15); }
    flashU.value = 0;

    if (display.visible) {
      if (revealing) {
        // wait for the spark to build, then sweep the clip plane up through the object
        reveal = Math.min(1, Math.max(0, (sparkT - 0.05) / 1.0));
        clip.constant = -HALF_H - 1 + reveal * (HALF_H * 2 + 2.2);
        if (reveal >= 1) { revealing = false; clip.constant = 20; }
      }
      const idle = t - lastDrag > 1.8 && !dragging;
      if (displayKind === 'model') { if (idle) rot.y += dt * 0.45; display.rotation.set(baseX + rot.x, rot.y, 0); }
      else { display.rotation.set(rot.x, rot.y + (idle ? Math.sin(t * 0.5) * 0.3 : 0), 0); }
      display.position.y = Math.sin(t * 0.8) * 0.08;
    }
    camera.position.x += (mouse.x * 0.9 - camera.position.x) * 0.04;
    camera.position.y += (0.4 - mouse.y * 0.6 - camera.position.y) * 0.04;
    camera.lookAt(0, LOOK_Y, 0);
    renderer.render(scene, camera);
  }
  raf = requestAnimationFrame(frame);

  const resize = () => {
    renderer.setSize(W(), H());
    camera.aspect = W() / H();
    // keep the whole chamber visible on narrow screens
    camera.position.z = (camera.aspect < 0.9 ? 13 / Math.max(camera.aspect, 0.45) * 0.85 : 13) * ZOOM;
    camera.updateProjectionMatrix();
    scaleU.value = FOV_K();
  };
  window.addEventListener('resize', resize);
  resize();

  return {
    setTarget,
    showCard,
    showModel,
    clearDisplay,
    burst,
    hasTarget: () => hasTarget,
    dispose() {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      container.removeEventListener('pointerdown', down);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      renderer.dispose();
      scene.traverse(o => { if (o.geometry && !o.userData.keepGeo && !(o.geometry.userData && o.geometry.userData.cached)) o.geometry.dispose(); if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => m.dispose()); });
      container.removeChild(renderer.domElement);
    },
  };
}
