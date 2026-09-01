# Procedural scene primitives

Zero asset weight, zero load failure, integrated-GPU safe. Put these in
`assets/js/scenes.js` and pass them to `stage.add(...)`.

> **VARIETY IS MANDATORY.** Two builds must never share the same hero scene —
> a NodeGraph-on-black portfolio next to a NodeGraph-on-black agency site is a
> failure. Before choosing, read **§ Picking a distinct scene** at the bottom and
> the **Scene menu** below. `NodeGraph`, `VoiceLattice` and `SignalGrid` are the
> three most overused — reach past them unless the niche genuinely has no better
> fit. There are 38 scenes here; use the range.

## Scene menu (pick by feeling, not by habit)
| # | scene | reads as | good for |
|---|---|---|---|
| 1 | VoiceLattice | a speaking / living core | voice AI, audio, wellness |
| 2 | SignalGrid | a horizon / floor | pairs under any hero |
| 3 | NodeGraph | a connected system | networks, integrations |
| 4 | CallStream | flow / throughput | logistics, comms, data |
| 5 | MonolithRow | weight, permanence | architecture, finance, law |
| 6 | GlassSlab | one premium object | pricing, product focus |
| 7 | ParticleField | dust, atmosphere, scale | any; calm backdrop |
| 8 | FlowRibbons | silk / current / motion | creative, beauty, fashion |
| 9 | CrystalCluster | facets, precision, luxury | jewellery, gaming, crypto |
| 10 | Wormhole | speed, entry, depth | launch, travel, fintech |
| 11 | DuneField | organic terrain, calm | wellness, hospitality, eco |
| 12 | Gyroscope | orbit, engineering, balance | hardware, aerospace, science |
| 13 | LiquidPlane | breathing water surface | spa, water, meditation |
| 14 | TypeExtrude | the wordmark IS the 3D | portfolios, editorial, brand |
| 15 | HalftoneField | print, editorial, retro-tech | agencies, magazines, music |
| 16 | Starfield | space, ambition, quiet | SaaS, education, non-profit |
| 17 | Helix | biology, growth, DNA | biotech, health, labs |
| 18 | Mechanism | gears, process, industry | manufacturing, automation |
| 19 | IsoBlocks | building, structure, city | real estate, construction, ops |
| 20 | AuroraPlanes | soft light fields, mood | consumer, lifestyle, events |

### More scenes (21–36) — niche-specific, add via § Extended scenes
| # | scene | reads as | niche it BELONGS to |
|---|---|---|---|
| 21 | ToothArch | a clean dental arch of soft forms | dental, orthodontics |
| 22 | PulseLine | an ECG/heartbeat line across the void | clinics, cardiology, fitness |
| 23 | PlateSteam | rising steam ribbons over a warm pool of light | restaurants, cafés, bakery |
| 24 | ScissorComb | slow-orbiting salon tools as sculpture | salon, barber, beauty |
| 25 | GavelScale | a balance beam settling to level | law, arbitration, courts |
| 26 | CoinCascade | thin discs falling and stacking | finance, banking, crypto |
| 27 | RouteMap | glowing routes tracing between pins | logistics, delivery, travel |
| 28 | FloorPlan | an architectural plan drawing itself in light | real estate, architecture, interiors |
| 29 | ToolWall | pegboard of trade tools catching one light | plumbing, electrical, trades |
| 30 | LeafCanopy | translucent leaves drifting in a shaft | wellness, spa, eco, garden |
| 31 | LensRig | camera aperture blades opening/closing | photography, film, media |
| 32 | Waveform | an audio waveform bar field pulsing | music, podcast, audio |
| 33 | Chalkboard | equations/strokes writing themselves | education, tutoring, courses |
| 34 | PillOrbit | capsules orbiting a soft core | pharmacy, supplements, biotech |
| 35 | Storefront | a lit shelf/aisle receding into fog | retail, e-commerce, grocery |
| 36 | JerseyField | a stadium light-array pulsing over a pitch | sports clubs, esports arenas |
| 37 | ParticleRepel | a deep starfield that recoils from the cursor | portfolios, creative, agencies, launch |
| 38 | ShaderField | flowing liquid/fog/aurora GLSL field (see advanced-3d.md B) | creative, music, crypto, beauty, launch |

**38 scenes total** (scene 38 ShaderField is a GLSL surface — see `advanced-3d.md`). The rule stands: pick the one that BELONGS to the niche,
never a generic default. If the niche has a dedicated scene (21–36), it is almost
always the right hero. If it doesn't, use the feeling-based menu (1–20). Only fall
to NodeGraph/VoiceLattice/SignalGrid when nothing else fits.

Scenes 1–6 are documented in full below; 7–20 in **§ Extended scenes**; 21–36 in
**§ Niche scenes**. All obey the same factory contract and the Rules at the
bottom. Combine at most two per page (one hero + one floor/atmosphere).

Each factory returns `{ object, tick, thin? }`:
- `object` — a `THREE.Object3D` added to the scene
- `tick(stage, state, dt)` — called only while the canvas is visible
- `thin()` — optional; called by the quality ladder to shed detail

Import contract:
```js
import * as THREE from 'three';
export function Xxx(stage, opts = {}) { … return { object, tick, thin } }
```

---

## VoiceLattice — "something is speaking"
A displaced icosahedron. The hero object for P1 VOID and P3 CLINIC.

```js
export function VoiceLattice(stage, { radius = 1.35, detail = 4 } = {}) {
  const g = new THREE.IcosahedronGeometry(radius, detail);
  const base = g.attributes.position.array.slice();
  const wire = new THREE.LineSegments(
    new THREE.WireframeGeometry(g),
    new THREE.LineBasicMaterial({ color: stage.accent, transparent: true, opacity: .38 }));
  const solid = new THREE.Mesh(g, new THREE.MeshStandardMaterial({
    color: 0x0b0d16, roughness: .35, metalness: .9, flatShading: true }));
  solid.scale.setScalar(.992);
  const object = new THREE.Group(); object.add(solid, wire);

  // 64-value envelope LUT looped at 1.6s — reads as speech, not a sine wave
  const LUT = Array.from({ length: 64 }, (_, i) => {
    const p = i / 64;
    return .35 + .65 * Math.abs(Math.sin(p * Math.PI * 3.1)) * (1 - p * .35);
  });
  let amp = 1, step = 1;

  const tick = (st, s, dt) => {
    const env = LUT[Math.floor((st.time / 1.6 % 1) * 64)] * amp;
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i += step) {
      const x = base[i*3], y = base[i*3+1], z = base[i*3+2];
      const d = 1 + Math.sin(st.time * 1.4 + y * 3) * .045 * env;
      pos.array[i*3] = x*d; pos.array[i*3+1] = y*d; pos.array[i*3+2] = z*d;
    }
    pos.needsUpdate = true;
    object.rotation.y += dt * .00016;
    object.rotation.x = s.my * .18;
  };
  return { object, tick, thin(){ amp = .6; step = 2; } };
}
```

---

## SignalGrid — infinite fog-faded floor
The cheapest depth cue there is. Use on almost every build.

```js
export function SignalGrid(stage, { size = 60, seg = 90, y = -1.6 } = {}) {
  let g = new THREE.PlaneGeometry(size, size, seg, seg);
  const base = g.attributes.position.array.slice();
  const object = new THREE.Mesh(g, new THREE.MeshBasicMaterial({
    color: stage.accent, wireframe: true, transparent: true, opacity: .13 }));
  object.rotation.x = -Math.PI / 2; object.position.y = y;
  const tick = (st) => {
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = base[i*3], yy = base[i*3+1];
      p.array[i*3+2] = Math.sin(x * .34 + st.time) * Math.cos(yy * .28 - st.time * .7) * .9;
    }
    p.needsUpdate = true;
  };
  return { object, tick, thin(){ object.material.opacity = .08; } };
}
```

---

## NodeGraph — connected system
96 instanced spheres in 4 rings plus nearest-neighbour lines. One ring can be
highlighted per section (`setRing(i)`).

```js
export function NodeGraph(stage, { rings = 4, per = 24 } = {}) {
  const N = rings * per;
  const geo = new THREE.SphereGeometry(.055, 12, 12);
  const mat = new THREE.MeshStandardMaterial({ color: stage.accent,
    emissive: stage.accent, emissiveIntensity: .5, roughness: .4 });
  const mesh = new THREE.InstancedMesh(geo, mat, N);
  const m = new THREE.Matrix4(), pts = [];
  for (let r = 0; r < rings; r++) for (let i = 0; i < per; i++) {
    const a = (i / per) * Math.PI * 2 + r * .3;
    const rad = 1.1 + r * .62, yy = (r - rings/2) * .42;
    const v = new THREE.Vector3(Math.cos(a) * rad, yy, Math.sin(a) * rad);
    pts.push(v); mesh.setMatrixAt(r*per + i, m.identity().setPosition(v));
  }
  const lg = new THREE.BufferGeometry().setFromPoints(
    pts.flatMap((v, i) => [v, pts[(i + per) % pts.length]]));
  const lines = new THREE.LineSegments(lg, new THREE.LineBasicMaterial({
    color: stage.accent, transparent: true, opacity: .16 }));
  const object = new THREE.Group(); object.add(mesh, lines);
  let ring = -1;
  const tick = (st, s, dt) => {
    object.rotation.y += dt * .00012;
    mat.emissiveIntensity = .35 + (ring >= 0 ? .5 : 0) * (.6 + .4 * Math.sin(st.time * 2));
  };
  return { object, tick, setRing(i){ ring = i; }, thin(){ lines.visible = false; } };
}
```

---

## CallStream — flow along a path
900 additive points travelling a curve. Reads as requests / calls / data moving.

```js
export function CallStream(stage, { count = 900 } = {}) {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-7, -.6, 2), new THREE.Vector3(-2, .9, -1),
    new THREE.Vector3(2, -.4, 1), new THREE.Vector3(7, 1.1, -2)]);
  let n = count;
  const g = new THREE.BufferGeometry();
  const off = new Float32Array(n).map(() => Math.random());
  g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3));
  const object = new THREE.Points(g, new THREE.PointsMaterial({
    color: stage.accent2 ?? stage.accent, size: .034, transparent: true,
    opacity: .8, blending: THREE.AdditiveBlending, depthWrite: false }));
  const v = new THREE.Vector3();
  const tick = (st) => {
    const p = g.attributes.position;
    for (let i = 0; i < n; i++) {
      curve.getPoint((off[i] + st.time * .07) % 1, v);
      p.array[i*3] = v.x; p.array[i*3+1] = v.y + Math.sin(i) * .06; p.array[i*3+2] = v.z;
    }
    p.needsUpdate = true;
  };
  return { object, tick, thin(){ n = Math.floor(count * .55); } };
}
```

---

## MonolithRow — architectural weight
Seven slabs at fixed heights, one lit. Deterministic — never randomise heights.

```js
export function MonolithRow(stage, { heights = [2.1,3.4,1.6,4.2,2.8,3.9,1.9] } = {}) {
  const object = new THREE.Group();
  const mats = heights.map((_, i) => new THREE.MeshStandardMaterial({
    color: 0x0a0c12, roughness: .62, metalness: .35,
    emissive: i === 3 ? stage.accent : 0x000000, emissiveIntensity: i === 3 ? .34 : 0 }));
  heights.forEach((h, i) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(.9, h, .9), mats[i]);
    m.position.set((i - 3) * 1.5, h / 2 - 1.6, (i % 2 ? -1 : 0) * .8);
    object.add(m);
  });
  const tick = (st, s, dt) => { object.rotation.y = s.mx * .10; };
  return { object, tick,
    setLit(i){ mats.forEach((m,j)=>{ m.emissive.set(j===i?stage.accent:0x000000);
      m.emissiveIntensity = j===i?.34:0; }); } };
}
```

---

## GlassSlab — the expensive one
`transmission` is costly. **Only ever one instance on screen.** Never on mobile.

```js
export function GlassSlab(stage, { w = 3.4, h = 4.6 } = {}) {
  const object = new THREE.Mesh(new THREE.PlaneGeometry(w, h),
    new THREE.MeshPhysicalMaterial({ transmission: .92, roughness: .18, ior: 1.42,
      thickness: .6, transparent: true, color: 0xffffff, metalness: 0 }));
  const tick = (st, s) => { object.rotation.y = s.mx * .22; object.rotation.x = s.my * -.12; };
  return { object, tick,
    thin(){ object.material.transmission = 0; object.material.opacity = .12; } };
}
```

---

## Extended scenes (7–20) — construction notes

Same factory contract (`{object, tick, thin?}`), same Rules. Each note gives the
geometry, the motion, and the one number that defines its character. Reuse one
`Vector3`/`Matrix4` per factory; no per-frame allocation.

**7 · ParticleField** — `BufferGeometry` `Points`, 1200 pts in a soft box
(`(rand-.5)*spread`), additive, size 2.2, `depthWrite:false`. tick: drift
`y += dt*.02`, wrap at bounds; whole cloud `rotation.y += dt*.00008`. Character
number: **spread 18** (bigger = emptier/calmer). Pairs under any hero as depth.

**8 · FlowRibbons** — 5–8 `TubeGeometry` along `CatmullRomCurve3`s whose control
points ride `sin(t + i)`; `MeshStandardMaterial` low-metal, accent-tinted,
`opacity:.6`. tick: rebuild curve points each frame (cache the geometry, update
positions only). Character: **ribbon width .04**. Reads as silk/current — beauty,
fashion, creative.

**9 · CrystalCluster** — 7 `OctahedronGeometry(r, 0)` at fixed offsets,
`MeshStandardMaterial{roughness:.1, metalness:.9, flatShading:true}`, one
emissive in the accent. tick: each shard `rotation` on its own axis+phase; group
bob. Character: **flatShading true** (the facets are the point). Luxury, gaming,
crypto.

**10 · Wormhole** — 40 `RingGeometry` (or torus) receding down −z at
`z = -i*step`, scale shrinking with distance, wireframe, accent→void fade via
per-ring `opacity`. tick: `z += dt*speed`, recycle the ring that passes the
camera to the back. Character: **step 1.2 / speed 3**. Speed, entry, fintech,
launch.

**11 · DuneField** — `PlaneGeometry(60,60,80,80)` rotated flat, vertex height =
layered `sin/cos` (2–3 octaves) for rolling dunes, `MeshStandardMaterial`
matte, subtle. tick: scroll the noise phase slowly. Character: **amplitude 1.4**.
Calm/organic — wellness, hospitality, eco, travel.

**12 · Gyroscope** — 3 nested `TorusGeometry` rings at 90° to each other, thin,
metallic, one accent-emissive, a small core sphere. tick: each ring spins on a
different axis at a different rate. Character: **3 rings, coprime speeds**.
Engineering, hardware, aerospace, science.

**13 · LiquidPlane** — `PlaneGeometry(40,40,64,64)` flat, vertex z =
`sin(x*.4+t)*cos(y*.3+t*.8)*.6`, `MeshStandardMaterial{roughness:.15,
metalness:.6}` accent-tinted so it reads as lit water. tick: advance `t`. Add a
faint `SignalGrid` reflection feel by low roughness. Character: **wave height
.6**. Spa, water, meditation, audio.

**14 · TypeExtrude** — the brand word as real 3D via `TextGeometry`
(load one font through `FontLoader` from a **Google Fonts `.json` facetype**, or
fall back to extruded `ShapeGeometry` from an inline SVG path so no external
load). Bevelled, metallic, one accent rim light. tick: gentle `rotation.y` with
pointer, float. Character: **bevelThickness .03**. THIS is the hero for many
portfolios/editorial — the wordmark is the visual, no abstract scene at all.
*(If font loading is unavailable, use the inline-SVG-extrude path; never skip to
NodeGraph.)*

**15 · HalftoneField** — `InstancedMesh` of ~600 small circles on a grid, each
scaled by a radial/`sin` function so the field reads as a halftone gradient that
breathes. Flat accent colour, no lighting needed. tick: animate the function
phase; pointer shifts its centre. Character: **grid 30×20, dot max r .06**.
Editorial, agencies, music, retro-tech.

**16 · Starfield** — 2000 `Points`, tiny, white→accent, in a large sphere shell;
a handful larger and brighter. tick: very slow `rotation.y`, occasional twinkle
via per-point opacity LUT. Character: **almost still** (rotation `dt*.00003`).
Quiet ambition — SaaS, education, non-profit, space.

**17 · Helix** — two `Points`/small-sphere strands spiralling up
(`x=cos(θ), z=sin(θ), y=θ*pitch`) with `LineSegments` rungs between them —
a DNA/growth read. tick: rotate `y`, shimmer rungs. Character: **pitch .28**.
Biotech, health, labs, agri.

**18 · Mechanism** — 4–6 `CylinderGeometry` gears (low-poly, teeth faked with a
notched ring) meshed so they turn together, metallic, one accent. tick: each
gear `rotation.z += dt*speed*dir`, ratios consistent so they *look* meshed.
Character: **meshed ratios** (get them right or it reads broken). Manufacturing,
automation, industry.

**19 · IsoBlocks** — `InstancedMesh` of ~40 `BoxGeometry` at varied heights on a
grid, isometric-leaning camera, matte with one accent-lit block; slow height
breathing. tick: per-block height eased on a phase offset. Character: **height
array fixed, never random**. Real estate, construction, city, ops.

**20 · AuroraPlanes** — 3–4 large translucent `PlaneGeometry` stacked at depth,
each a soft vertical gradient (accent→transparent) via `MeshBasicMaterial` +
`opacity`, drifting sideways and warping via vertex `sin`. Additive. tick: drift
+ phase. Character: **opacity .12 each** (subtle mood, not a light show).
Consumer, lifestyle, events, beauty.

---

## Niche scenes (21–36) — construction notes

Same factory contract. Each has its **own signature motion** — the motion is
half the identity, so never reuse another scene's. All matte/low-key so text
stays legible; accent-tinted per the build's shifted hue.

**21 · ToothArch** (dental) — 14 rounded `RoundedBoxGeometry`/capsules in a
gentle parabola arch, pearl-white `MeshStandardMaterial{roughness:.25}`, one
accent-lit. **Motion:** the arch breathes (scale `1±.01`) and one tooth softly
pulses in sequence, left→right. Character: **arch radius 6**.

**22 · PulseLine** (health/fitness) — a `Line`/`TubeGeometry` tracing an ECG
waveform across the frame, emissive accent, faint after-glow trail. **Motion:**
the pulse *travels* left→right on a loop with one sharp QRS spike; a soft bloom
follows the peak. Character: **one spike per 2.4s** (a real resting rhythm).

**23 · PlateSteam** (food) — 3–4 `Points`/ribbon columns of steam rising from a
warm pooled light at the base, additive, amber-tinted. **Motion:** steam curls
upward and dissipates (`y+=dt`, opacity fades with height, wrap). Character:
**rise speed slow**, so it reads as heat not smoke.

**24 · ScissorComb** (salon/beauty) — 2–3 stylised tools (scissors as two thin
crossed boxes, a comb as a notched bar) floating as sculpture, chrome
`metalness:.9`. **Motion:** slow individual orbit on offset axes + a scissor
open/close every few seconds. Character: **chrome + one accent rim**.

**25 · GavelScale** (law) — a balance beam with two pans on a pivot, thin
metallic, one accent-lit pan. **Motion:** the beam rocks and *settles to level*
on a decaying oscillation, then nudges again — reads as judgement reaching
balance. Character: **settle, don't spin**.

**26 · CoinCascade** (finance) — ~30 thin `CylinderGeometry` discs falling and
stacking into short columns, brass/accent metal. **Motion:** discs drop on
staggered delays, land, a column occasionally topples-and-reforms. Character:
**thin discs (h .06)**, never fat coins.

**27 · RouteMap** (logistics/travel) — pins as small spheres on a faint sphere or
plane, `Line` routes drawn between them with a moving dash. **Motion:** a bright
packet travels each route on a loop; new routes fade in as old fade out.
Character: **dashed offset animation**, one packet per route.

**28 · FloorPlan** (architecture/real estate) — an architectural plan built from
`LineSegments`, sitting flat and tilted in space. **Motion:** the plan *draws
itself* (stroke-dash reveal) then a light sweeps across it; loops. Character:
**self-drawing lines**, not a static blueprint.

**29 · ToolWall** (trades) — a pegboard grid with ~8 simple tool silhouettes
(wrench, pipe, bolt as low-poly), matte metal, one hard raking light. **Motion:**
the raking light sweeps across the wall; one tool lifts and re-seats. Character:
**hard single light**, industrial.

**30 · LeafCanopy** (wellness/eco) — ~40 translucent `PlaneGeometry` leaves
drifting down through a light shaft, green-tinted, `opacity:.5`. **Motion:**
leaves fall and rotate gently, wrap at the bottom; the shaft flickers. Character:
**slow drift**, dappled calm.

**31 · LensRig** (photography/film) — aperture blades (6 thin triangles) forming
an iris, plus a faint lens-flare sprite. **Motion:** the aperture *opens and
closes* on a slow breath; the flare tracks the pointer. Character: **6 blades**,
mechanical precision.

**32 · Waveform** (music/podcast) — a row of ~48 `BoxGeometry` bars, heights from
a looped LUT (fake spectrum), emissive accent. **Motion:** bars bounce to the LUT
so it reads as playing audio; a scrub highlight moves across. Character:
**LUT-driven**, never random noise.

**33 · Chalkboard** (education) — a dark tilted plane with `LineSegments`
equations/diagrams. **Motion:** strokes *write themselves* in sequence, hold,
erase, rewrite different content. Character: **handwriting reveal**, chalk-dust
particles optional.

**34 · PillOrbit** (pharmacy/supplements) — capsules (two-tone rounded cylinders)
orbiting a soft glowing core. **Motion:** capsules orbit at different radii/speeds
like electrons; the core pulses. Character: **two-tone capsules**, clinical.

**35 · Storefront** (retail) — a lit shelf/aisle of abstract product blocks
receding into fog, one endcap accent-lit. **Motion:** a slow dolly *down the
aisle*; products catch light as they pass. Character: **fog depth**, inviting.

**36 · JerseyField** (sports) — a stadium floodlight array over a dark pitch with
faint yard/court lines. **Motion:** floodlights flare on in sequence (kickoff
feel); a light bloom sweeps the pitch. Character: **floodlight flare-up**, energy.

> Add any of these to `scenes.js` from the note; they are one small factory each.
> If a niche scene isn't yet coded, the note is enough for the builder to write it
> — that is preferable to falling back to a generic scene.

---

**37 · ParticleRepel** (creative/portfolio) — a large `Points` field (5k–15k;
**cap at 6k on integrated GPUs / drop to 2k via `thin()`**) in deep blue
`0x001f3f`, additive, size `.5`, opacity `.2`, plus a set of forward-moving
dashed energy `LineSegments` in `0x88aaff` opacity `.2`. One `UnrealBloomPass`
(strength .8, radius .1, threshold 1.0). **Motion:** on `pointermove` project a
3D cursor; points within a radius are **repulsed** (force ~.04) and lerp their
colour toward the accent; a spring returns them home. Character: **repulsion +
colour-shift to accent** — that interaction is the whole effect. `thin()`:
particles ×0.3, drop the bloom, disable line dashes. Dispose geometry/material/
composer on unmount. This is the richest particle scene — reserve it for a hero
that can afford it, and let the quality ladder shrink it.


## Motion is per-build — never reuse a camera path

Two things move: the **scene's own signature motion** (fixed per scene above) and
the **camera path** (authored per build in the keyframe table). Give every build
a camera path that hasn't been used, matched to the niche. **18 paths** — pick by
feeling, or use the one the user chose in the intake Motion question.

| # | feel | camera path | fits |
|---|---|---|---|
| C1 | arrival / focus | slow straight **push-in** | portfolios, single product, clinics |
| C2 | showcase / turn | **orbit** left or right around the hero | agencies, voice AI, hardware |
| C3 | journey / speed | **fly-through** (camera travels −z) | launches, travel, fintech (Wormhole) |
| C4 | grandeur / reveal | **crane down** then level | architecture, real estate, hospitality |
| C5 | survey / breadth | **lateral dolly** past a row | industries, portfolios of many works |
| C6 | ascent / growth | **rise** while looking down | biotech, education, non-profit |
| C7 | pull-back / scale | **dolly out** to emptiness | every build's closing keyframe |
| C8 | tension / drama | **dolly-zoom** (vertigo: dolly in while fov widens) | film, launches, one hero reveal |
| C9 | hypnotic / immersive | **spiral-in** (orbit + push combined) | crypto, gaming, music |
| C10 | calm / floating | **sway** (slow pendulum L↔R, tiny) | wellness, spa, beauty, meditation |
| C11 | reveal-from-behind | **tilt-up** (camera pitches up to uncover the hero) | architecture, product, hospitality |
| C12 | energy / edge | **subtle barrel-roll** (±3° z-roll on scroll) | sports, esports, streetwear |
| C13 | scan / inspect | **track-and-orbit** (orbit while sliding sideways) | hardware, automotive, science |
| C14 | cinematic pan | **horizontal pan** across a wide scene | agencies, editorial, galleries |
| C15 | descent / dive | **dive-down** (camera drops through the scene) | travel, real estate, ocean/eco |
| C16 | breakthrough | **ascend-through** (rise up past/through the hero) | biotech, launch, growth stories |
| C17 | focus-rack | **rack focus** (dof shifts near→far, camera nearly still) | photography, film, luxury |
| C18 | anchored / poised | **hero-lock** (camera still, only parallax + scene motion) | law, finance, minimal/editorial |

Pick the path from the feeling **or the user's Motion answer**, then vary the
*numbers* (positions, fov, the px at which each keyframe lands) so even two orbits
differ. Every build's **final** keyframe is C7 (pull-back to emptiness) regardless
of the main path. Record the chosen path in the Visual Signature line.
**A build that reuses the previous build's camera path AND scene is the repeat
users notice — change at least one, ideally both.**

### Reduced-motion / low-power downgrades
Each path degrades to a still framing at keyframe 0 under `prefers-reduced-motion`
and keeps only pointer-parallax under the quality ladder's middle rung. C8
(dolly-zoom) and C12 (barrel-roll) are the most nausea-prone — halve their
amplitude on the middle rung, disable entirely on the low rung.

---

## Picking a distinct scene (do this every build)

1. **Never auto-pick NodeGraph / VoiceLattice / SignalGrid.** They are the
   defaults everyone reaches for — that is exactly why every AI site looks the
   same. Only use them if the menu offers nothing better for the niche.
2. From the **Scene menu**, choose the hero scene by what the business *feels*
   like, then a second scene only for floor/atmosphere. Prefer a hero the niche
   list in `art-direction.md` and `assets.md` points to.
3. **Shift the palette accent** off the preset default by a niche-appropriate
   hue so two dark builds don't share the same violet. VOID's `--violet` can
   become teal, amber, magenta, lime, ice-blue, coral — keep the *structure*
   (dark ground + one signal + one warm accent), change the *hue*.
4. **Vary the camera path** — the keyframe table is per build. A portfolio might
   push straight in; an agency might orbit; a launch might fly through a Wormhole.
5. State the result as a one-line **Visual Signature** in the spec (SKILL Step 4
   / spec §6): `scene(s) · accent hue · camera motion · one signature move`.
   Two specs with the same Visual Signature line is a bug.

Worked contrasts (so nothing repeats):
- Voice-AI agency → VoiceLattice + SignalGrid, violet, orbit-right.
- Dev portfolio → **TypeExtrude** (the name in 3D) + Starfield, **ice-blue**,
  straight push-in. *(Not NodeGraph — that was the repeat you caught.)*
- Architecture → MonolithRow + DuneField, warm clay, long lateral dolly.
- Biotech clinic → Helix + ParticleField, teal, gentle rise.
- Fintech launch → Wormhole, lime-on-black, fly-through.
- Beauty brand → FlowRibbons + AuroraPlanes, coral, slow drift.

---

## Rules

- **Draw-call ceiling:** 6 per frame on the primary page. Two primitives max
  per scene, three only if one is `SignalGrid`.
- **Never randomise geometry** across loads — a layout that shifts between
  refreshes cannot be reviewed or screenshotted.
- Reuse one `Matrix4` / `Vector3` per factory. No per-frame allocation.
- `depthWrite: false` on every additive material.
- Vertex loops must respect the `step` stride so `thin()` actually helps.
- Never add `OrbitControls`. The camera belongs to the keyframe rig.
- No shadows anywhere. `renderer.shadowMap.enabled = false` is already set.
- Mobile (`max-aspect-ratio: 11/10`): drop to a single primitive at
  `canvas#gl{opacity:.72}` and skip `GlassSlab` entirely.
