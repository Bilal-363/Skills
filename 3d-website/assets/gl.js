/* 3d-website GL layer — renderer, camera keyframe rig, adaptive quality ladder.
 * Copy verbatim. Requires the importmap below in the page <head>:
 *
 * <script type="importmap">
 * {"imports":{
 *   "three":"https://cdn.jsdelivr.net/npm/three@0.168.0/build/three.module.js",
 *   "three/addons/":"https://cdn.jsdelivr.net/npm/three@0.168.0/examples/jsm/"
 * }}
 * </script>
 *
 * Usage in a page module:
 *   import { createStage } from './assets/js/gl.js';
 *   import { VoiceLattice, SignalGrid } from './assets/js/scenes.js';
 *   const stage = await createStage({ canvas:'#gl', keys: CAMERA_KEYS });
 *   stage.add(VoiceLattice(stage), SignalGrid(stage));
 *
 * Contract: this module reads engine.js's `state.scroll` and NOTHING else from
 * the page. It never touches the DOM outside its own canvas.
 */

import * as THREE from 'three';
import { state, onFrame, clamp, smoothstep, lerp, requestTick } from './engine.js';

const root = document.documentElement;

/* ---------- capability probe ---------- */
function probe() {
  let rendererName = '';
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2') || c.getContext('webgl');
    if (!gl) return { ok: false, low: true, rendererName };
    const dbg = gl.getExtension('WEBGL_debug_renderer_info');
    rendererName = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : '';
  } catch { return { ok: false, low: true, rendererName }; }
  const cores = navigator.hardwareConcurrency || 4;
  const low = cores <= 4 || /Intel|UHD|Iris|Apple GPU|Mali|Adreno|SwiftShader|llvmpipe/i.test(rendererName);
  return { ok: true, low, rendererName };
}

/* ---------- camera keyframe rig ----------
 * keys: [{ at:<scrollPx>, pos:[x,y,z], look:[x,y,z], fov:<deg> }, …] ascending `at`.
 * Position lerps componentwise; orientation slerps between look-at quaternions,
 * so it can never gimbal-flip.
 */
function makeRig(camera, keys) {
  const a = new THREE.Vector3(), b = new THREE.Vector3();
  const la = new THREE.Vector3(), lb = new THREE.Vector3();
  const qa = new THREE.Quaternion(), qb = new THREE.Quaternion();
  const m = new THREE.Matrix4(), up = new THREE.Vector3(0, 1, 0);
  const posOut = new THREE.Vector3(), lookOut = new THREE.Vector3();

  const quatFor = (from, to, q) => {
    m.lookAt(from, to, up);
    q.setFromRotationMatrix(m);
    return q;
  };

  return function apply(scroll) {
    if (keys.length === 1) {
      const k = keys[0];
      posOut.fromArray(k.pos); lookOut.fromArray(k.look);
      camera.fov = k.fov; camera.position.copy(posOut);
      camera.quaternion.copy(quatFor(posOut, lookOut, qa));
      return;
    }
    let i = 0;
    while (i < keys.length - 2 && scroll > keys[i + 1].at) i++;
    const k0 = keys[i], k1 = keys[i + 1];
    const t = smoothstep(k0.at, k1.at, scroll);

    a.fromArray(k0.pos); b.fromArray(k1.pos);
    la.fromArray(k0.look); lb.fromArray(k1.look);
    posOut.lerpVectors(a, b, t);
    lookOut.lerpVectors(la, lb, t);

    quatFor(a, la, qa); quatFor(b, lb, qb);
    camera.quaternion.copy(qa).slerp(qb, t);
    camera.fov = lerp(k0.fov, k1.fov, t);

    /* pointer offset applied AFTER interpolation, then re-aim */
    if (!state.reduced) {
      posOut.x += state.mx * 0.42;
      posOut.y += -state.my * 0.30;
      camera.quaternion.copy(quatFor(posOut, lookOut, qa));
    }
    camera.position.copy(posOut);
    camera.updateProjectionMatrix();
  };
}

/* ---------- stage ---------- */
export async function createStage({
  canvas = '#gl',
  keys = [{ at: 0, pos: [0, 0.4, 6.2], look: [0, 0.15, 0], fov: 38 }],
  fogDensity = 0.052,
  bloom = 0.58,
  accent = 0x8b5cf6,
  accent2 = 0xf97316,
  background = 0x05060a,
} = {}) {
  const el = typeof canvas === 'string' ? document.querySelector(canvas) : canvas;
  const cap = probe();

  if (!el || !cap.ok || state.reduced && matchMedia('(max-aspect-ratio:11/10)').matches) {
    root.classList.add('no-gl');
    // safe stub: scene factories may still be called; give them harmless values
    return { disabled: true, scene: null, camera: null, renderer: null, THREE,
      accent, accent2, time: 0, ticks: [], thins: [],
      add() {}, dispose() {} };
  }

  el.setAttribute('aria-hidden', 'true');

  let DPR_CAP = cap.low ? 1.35 : 1.75;
  let useBloom = !cap.low;

  const renderer = new THREE.WebGLRenderer({
    canvas: el, antialias: !cap.low, alpha: true, powerPreference: 'high-performance',
  });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.shadowMap.enabled = false;
  renderer.setPixelRatio(Math.min(devicePixelRatio, DPR_CAP));

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(background, fogDensity);

  const camera = new THREE.PerspectiveCamera(38, innerWidth / innerHeight, 0.1, 120);
  const applyRig = makeRig(camera, keys);

  /* lighting — identical everywhere, cheap */
  const key = new THREE.DirectionalLight(0xffffff, 1.35); key.position.set(4, 6, 3);
  const rimA = new THREE.PointLight(accent, 2.6, 14);
  const rimB = new THREE.PointLight(accent2, 1.1, 10); rimB.position.set(-5, -2, 3);
  scene.add(new THREE.AmbientLight(0x9c9aae, 0.55), key, rimA, rimB);

  /* optional single bloom pass, lazily imported so no-bloom builds pay nothing */
  let composer = null;
  async function buildComposer() {
    if (composer || !useBloom) return;
    try {
      const [{ EffectComposer }, { RenderPass }, { UnrealBloomPass }] = await Promise.all([
        import('three/addons/postprocessing/EffectComposer.js'),
        import('three/addons/postprocessing/RenderPass.js'),
        import('three/addons/postprocessing/UnrealBloomPass.js'),
      ]);
      composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));
      composer.addPass(new UnrealBloomPass(
        new THREE.Vector2(innerWidth, innerHeight), bloom, 0.42, 0.86));
      composer.setSize(innerWidth, innerHeight);
    } catch { useBloom = false; composer = null; }
  }
  await buildComposer();

  const api = {
    disabled: false, scene, camera, renderer, THREE,
    accent, accent2, rimA,
    time: 0,
    ticks: [],      // tick functions, run every frame
    thins: [],      // thin functions, run once by the quality ladder
    add(...objs) {
      for (const o of objs.flat()) {
        if (!o) continue;
        if (o.isObject3D) scene.add(o);
        else if (o.object) {
          scene.add(o.object);
          if (o.tick) api.ticks.push(o.tick);
          if (o.thin) api.thins.push(o.thin);   // keep thin() reachable
        }
        else if (typeof o === 'function') api.ticks.push(o);
      }
      requestTick();
    },
    dispose,
  };

  /* ---------- adaptive quality ladder ---------- */
  const win = []; let lastStep = 0;
  function ladder(dt, now) {
    win.push(dt); if (win.length > 45) win.shift();
    if (win.length < 45 || now - lastStep < 6000) return;
    const avg = win.reduce((s, v) => s + v, 0) / win.length;
    if (avg > 34) {
      root.classList.add('no-gl');           // tier 3 — hand off to CSS parallax
      dispose();
      lastStep = now;
    } else if (avg > 22 && (DPR_CAP > 1.25 || useBloom)) {
      DPR_CAP = 1.25; useBloom = false; composer = null;
      renderer.setPixelRatio(Math.min(devicePixelRatio, DPR_CAP));
      api.thins.forEach((fn) => { try { fn(); } catch (e) {} });   // scenes shed detail
      win.length = 0; lastStep = now;
    }
  }

  /* ---------- resize ---------- */
  function resize() {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(devicePixelRatio, DPR_CAP));
    renderer.setSize(innerWidth, innerHeight, false);
    composer?.setSize(innerWidth, innerHeight);
  }
  addEventListener('resize', resize);
  resize();

  /* ---------- on-demand render ---------- */
  let visible = true, disposed = false;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) requestTick(); })
    .observe(el);

  onFrame((st, dt) => {
    if (disposed || !visible || document.hidden) return;
    const now = performance.now();
    api.time += dt / 1000;
    applyRig(st.scroll);
    rimA.position.set(st.mx * 2, 0.6 - st.my * 1.2, 2.4);
    for (const t of api.ticks) (t.update || t)(api, st, dt);
    if (composer) composer.render(); else renderer.render(scene, camera);
    ladder(dt, now);
  });

  function dispose() {
    if (disposed) return;
    disposed = true;
    scene.traverse((o) => {
      o.geometry?.dispose?.();
      const m = o.material;
      if (Array.isArray(m)) m.forEach((x) => x.dispose?.()); else m?.dispose?.();
    });
    composer?.renderTarget1?.dispose?.();
    composer?.renderTarget2?.dispose?.();
    renderer.dispose();
    el.style.display = 'none';
  }
  addEventListener('pagehide', dispose);

  return api;
}
