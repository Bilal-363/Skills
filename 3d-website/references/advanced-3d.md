# Advanced 3D — real GLB products & GLSL shaders

Two capabilities beyond the procedural scene library. Use only when the brief
genuinely calls for them (a rotatable product, or a fluid/liquid look) — most
sites do not. Both ship the same three-tier fallback as everything else.

Verified specs: `@google/model-viewer` **4.3.1**, `three@0.168`.

---

## PART A · GLB product viewer — a real, spinnable 3D model

The visitor drags to rotate the product 360°, zooms, and clicks hotspots. Use for
**products with a hero object**: sneakers, watches, jewellery, gadgets, bottles,
cars, furniture, hardware.

### Preferred: Google `<model-viewer>` (one script, robust, AR + hotspots built-in)
Do NOT hand-roll GLTFLoader + OrbitControls unless you need custom shader
materials — `<model-viewer>` gives camera-controls, lazy loading, a poster, IBL
lighting, AR, and hotspots out of the box, and it is far less code to get right.

```html
<script type="module"
  src="https://ajax.googleapis.com/ajax/libs/model-viewer/4.3.1/model-viewer.min.js"></script>

<model-viewer
  src="/models/sneaker.glb"
  poster="/models/sneaker-poster.webp"            <!-- shown while the GLB loads -->
  alt="The Apex running shoe in 3D"
  camera-controls                                  <!-- drag to orbit -->
  auto-rotate auto-rotate-delay="0" rotation-per-second="18deg"
  interaction-prompt="none"
  touch-action="pan-y"                             <!-- page still scrolls on touch -->
  shadow-intensity="1" shadow-softness="0.9"
  exposure="1.0"
  environment-image="neutral"                      <!-- or a .hdr URL for real IBL -->
  loading="lazy" reveal="auto"
  style="width:100%; height:min(78vh,720px); background:transparent">

  <!-- hotspots: slot MUST be `hotspot-<id>`; position/normal are model-space -->
  <button class="hotspot" slot="hotspot-heel" data-position="0.04 0.06 -0.09" data-normal="0 0 -1">
    <div class="hs-label">Carbon heel plate</div>
  </button>
  <button class="hotspot" slot="hotspot-sole" data-position="0 -0.05 0.05" data-normal="0 -1 0">
    <div class="hs-label">Recycled foam sole</div>
  </button>
</model-viewer>
```
```css
model-viewer .hotspot{ width:14px;height:14px;border-radius:50%;border:2px solid #fff;
  background:var(--accent);box-shadow:0 0 0 4px rgba(255,255,255,.25);cursor:pointer }
model-viewer .hs-label{ position:absolute;left:20px;top:-6px;white-space:nowrap;
  padding:6px 10px;border-radius:8px;background:var(--void-2);color:var(--ink);
  font-size:12px;font-weight:600;box-shadow:var(--shadow-md,0 8px 24px rgba(0,0,0,.2));
  opacity:0;transition:opacity .2s }
model-viewer .hotspot:hover .hs-label,
model-viewer .hotspot:focus .hs-label{ opacity:1 }
```
- **Get `data-position`/`data-normal` from the model-viewer Editor** (modelviewer.dev
  → Editor) — click the model, it prints the exact coordinates. Never guess them.
- Scroll-drive the camera instead of/alongside drag by setting the
  `camera-orbit` attribute from the engine: `mv.cameraOrbit = `${p*360}deg 75deg 105%``.
- **`touch-action="pan-y"`** is mandatory or the model traps vertical scroll on phones.

### Alternative: raw Three.js (only when you need custom materials/shaders on the model)
```js
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
const draco = new DRACOLoader().setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
const loader = new GLTFLoader().setDRACOLoader(draco);
loader.load(url, (g) => { model = g.scene; scene.add(model); }, undefined, onError);
const controls = new OrbitControls(camera, canvas);   // the ONE sanctioned OrbitControls use
controls.enableZoom = true; controls.enablePan = false; controls.autoRotate = true;
controls.enableDamping = true;                          // inertia
```
Hotspots by hand: project the 3D anchor to screen each frame and place a DOM dot —
`v.copy(anchorWorldPos).project(camera); left = (v.x*.5+.5)*W; top = (-v.y*.5+.5)*H`;
hide when `v.z > 1` (behind the camera). Add an `EnvironmentMap`/HDR for PBR, cap
DPR, dispose geometries/materials/textures on unmount.

### Assets (the GLB itself) — ladder
1. **User supplies the `.glb`** (their real product scan/CAD). Best.
2. **Generate from a product photo** — Higgsfield `generate_3d` (image → GLB mesh).
   Preflight cost, report before spending. Good for a single hero object; expect
   to clean/scale it.
3. **No model available** → fall back to **A23 bleed** (a big product *photo*) or
   the layer swapper (A33). Do NOT fake 3D rotation with a sprite sheet unless the
   client supplies a real turntable sequence.
Always author a **poster** (a still of the product) so the section is never empty
while the GLB streams; keep GLBs Draco-compressed and under a few MB.

### Rules
- One GLB viewer per page (each is a WebGL context). Never two.
- `loading="lazy"` + poster; never block first paint on the model.
- Reduced motion → `auto-rotate` off, poster/first-frame static, drag still allowed.
- Low-power / no-WebGL → show the poster image only.
- Keep drag from eating page scroll (`touch-action="pan-y"`).

---

## PART B · GLSL shader hero — liquid, fog, ripple, morphing colour fields

A full-bleed animated surface that standard shapes can't make: flowing liquid,
smoke, aurora, ripples that react to the cursor. One fullscreen plane + a fragment
shader. Use sparingly — it is the most GPU-hungry thing in the skill.

### Three.js setup (fullscreen quad, orthographic — no camera math)
```js
import * as THREE from 'three';
const scene = new THREE.Scene();
const cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
const uniforms = {
  uTime: { value: 0 },
  uMouse: { value: new THREE.Vector2(0.5, 0.5) },
  uRes: { value: new THREE.Vector2(innerWidth, innerHeight) },
  uColorA: { value: new THREE.Color(0x0e2036) },   // from the preset palette
  uColorB: { value: new THREE.Color(0x17bcb4) },
};
const mat = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader });
scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat));
// in the engine's onFrame: uniforms.uTime.value = t; uniforms.uMouse lerps toward pointer
```
```glsl
// vertex — pass uv, draw the quad
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = vec4(position, 1.0); }
```
```glsl
// fragment — fbm-warped flowing colour field with a cursor ripple
precision highp float;
varying vec2 vUv;
uniform float uTime; uniform vec2 uMouse, uRes; uniform vec3 uColorA, uColorB;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453123); }
float noise(vec2 p){ vec2 i=floor(p), f=fract(p); vec2 u=f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),
             mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x), u.y); }
float fbm(vec2 p){ float v=0.0, a=0.5; for(int i=0;i<5;i++){ v+=a*noise(p); p*=2.0; a*=0.5; } return v; }

void main(){
  vec2 uv = vUv; uv.x *= uRes.x/uRes.y;              // aspect-correct
  float t = uTime*0.08;
  vec2 q = vec2(fbm(uv+t), fbm(uv+vec2(5.2,1.3)-t)); // domain warp = liquid flow
  float f = fbm(uv + 2.0*q + t);
  vec3 col = mix(uColorA, uColorB, smoothstep(0.2, 0.8, f));
  float d = distance(vUv*vec2(uRes.x/uRes.y,1.0), uMouse*vec2(uRes.x/uRes.y,1.0));
  col += (uColorB-uColorA) * sin(d*38.0 - uTime*6.0) * exp(-d*6.0) * 0.12; // ripple at cursor
  gl_FragColor = vec4(col, 1.0);
}
```
This gives a slow flowing liquid/aurora field in the palette's two colours, rippling
where the cursor is. For **fog/smoke**, raise the fbm octaves and lower contrast; for
**metal**, add `pow(f, 3.0)` highlights; for **ripple-on-text**, render the shader to
a texture and use it as a displacement `mask-image`.

### Performance (mandatory — shaders melt weak GPUs)
- Cap `renderer.setPixelRatio(Math.min(devicePixelRatio, isLowPower ? 1 : 1.5))`.
- 5 fbm octaves max on desktop; **drop to 3 and DPR 1 on integrated GPUs**
  (the `gl.js` quality ladder already detects `isLowPower`).
- Render on the shared rAF loop only while visible; pause off-screen and on
  `document.hidden`. Never a second render loop.
- **Reduced motion** → freeze `uTime` (static field) and disable the ripple.
- **No WebGL / low rung** → `html.no-gl` CSS fallback: an animated
  `background:linear-gradient` between the two palette colours (aurora pan from
  `interactions.md` I19). It must look intentional, not broken.

### Rules
- One shader surface per page; it sits at the canvas layer (z 0), behind content,
  `pointer-events:none`, with the grain + a legibility scrim over it.
- Keep it in the palette (two-colour `mix`) — a rainbow shader reads as a demo,
  not a brand.
- Dispose the material/geometry/renderer on unmount.

---

## When to reach for these
| brief | use |
|---|---|
| "spin / rotate / 360° the product", "view in AR", product with a hero object | **Part A** GLB viewer (`<model-viewer>`) |
| "liquid", "fluid", "smoke", "morphing", "ripple", "distortion", generative bg | **Part B** GLSL shader hero |
| anything else | the procedural scene menu in `gl-scenes.md` — cheaper and safer |

Both are opt-in: only build them when the niche/brief asks. Neither replaces the
default procedural scenes; they extend the top end.
