# Pointer-driven interactions

Everything here runs in **one** `requestAnimationFrame` loop — the one in
`engine.js`. Subscribe with `onFrame`. Never start a second loop.

All of it is decorative: `pointer-events: none`, hidden or disabled below `sm`,
and neutralised under `prefers-reduced-motion`.

---

## I1 · Cursor spotlight reveal — two images, one mask
The strongest single effect in this whole skill. Two stacked images; the second
is visible only inside a soft circle that follows the cursor.

```
.stack (relative)
├─ .img-base    z-10   background-image: IMAGE_A
└─ .img-reveal  z-30   background-image: IMAGE_B   ← masked
```
```js
const cvs = document.createElement('canvas');        // never inserted in the DOM
const ctx = cvs.getContext('2d');
let cx = -999, cy = -999, tx = -999, ty = -999;      // start off-screen
const R = 260;

addEventListener('pointermove', (e) => { tx = e.clientX; ty = e.clientY; requestTick(); },
  { passive: true });

onFrame(() => {
  cx = lerp(cx, tx, 0.1); cy = lerp(cy, ty, 0.1);    // smoothing is what sells it
  cvs.width = innerWidth; cvs.height = innerHeight;
  ctx.clearRect(0, 0, cvs.width, cvs.height);
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
  g.addColorStop(0,    'rgba(255,255,255,1)');
  g.addColorStop(0.40, 'rgba(255,255,255,1)');
  g.addColorStop(0.60, 'rgba(255,255,255,.75)');
  g.addColorStop(0.75, 'rgba(255,255,255,.40)');
  g.addColorStop(0.88, 'rgba(255,255,255,.12)');
  g.addColorStop(1,    'rgba(255,255,255,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.2832); ctx.fill();
  const url = `url(${cvs.toDataURL()})`;
  reveal.style.maskImage = url;
  reveal.style.webkitMaskImage = url;
  reveal.style.maskSize = reveal.style.webkitMaskSize = '100% 100%';
});
```
**Rules:** six gradient stops minimum — three looks like a hard circle. Lerp
`0.1`, not instant. Start at `(-999,-999)` so nothing is revealed before first
move. Disable entirely on touch (`(hover: none)`) and under reduced motion.

**Cheaper variant** — no canvas, works everywhere, slightly harder edge:
```css
.img-reveal{ mask-image: radial-gradient(circle 260px at var(--px) var(--py),
  #000 40%, rgba(0,0,0,.4) 75%, transparent 100%) }
```
Write `--px` / `--py` in px from the loop. Use this on mobile-capable builds.

---

## I2 · Ken Burns intro — the image settles
```css
@keyframes kenBurns{ from{ transform: scale(1.12) } to{ transform: scale(1) } }
.img-base{ animation: kenBurns var(--kb,2.4s) cubic-bezier(.22,1,.36,1) forwards }
```
`1.12 → 1` is fixed; the duration is the dial:
`1.8s` when text lands early and hard · `2.4s` when the type staggers in over it.
Faster than 1.6s reads cheap; slower than 2.8s reads broken. Always pair with a
text stagger so the type finishes as the image stops.

**Blur-rise companion** — the text half of the same gesture:
```css
@keyframes heroReveal{ from{opacity:0;transform:translateY(28px);filter:blur(12px)}
                       to  {opacity:1;transform:translateY(0);  filter:blur(0)} }
```
`1.1s`, `cubic-bezier(.16,1,.3,1)`, delays `.25s` / `.42s` for two headline
lines. Blur `12px` for a headline, `8px` for body — more than 12 looks like a
rendering fault, not an entrance.

> **Caveat:** a `.hero-anim{opacity:0}` resting state hides the page if
> animations never run. Prefer the `.appear` pattern in `entrances.md` §1
> (resting opacity **1**) unless the client explicitly wants the harder reveal
> — and if they do, still ship the two-frame `getAnimations()` fallback.

---

## I3 · SVG grid with pointer parallax
```html
<svg class="grid" aria-hidden="true"><defs>
  <pattern id="g" width="48" height="48" patternUnits="userSpaceOnUse"
           x="var(--gx)" y="var(--gy)">
    <path d="M48 0H0V48" fill="none" stroke="#64748b" stroke-width=".6"/>
  </pattern></defs>
  <rect width="100%" height="100%" fill="url(#g)"/></svg>
```
`.grid{ position:absolute; inset:0; z-index:0; opacity:.1; pointer-events:none }`
```js
onFrame((st) => {
  pattern.setAttribute('x', (st.mx * 16).toFixed(2));
  pattern.setAttribute('y', (st.my * 16).toFixed(2));
});
```
16px of travel, `opacity .1`. Both numbers matter — more of either turns a depth
cue into a distraction.

---

## I4 · Shine sweep — the hover language
One rule, reused on every pill, nav item, and card. Nothing else says
"expensive" this cheaply.
```css
.btn{ position:relative; isolation:isolate; overflow:hidden }
.btn::after{ content:""; position:absolute; inset:0;
  background:linear-gradient(115deg,transparent 20%,rgba(255,255,255,.45) 48%,transparent 76%);
  transform:translateX(-130%); transition:transform .65s ease }
.btn:hover::after{ transform:translateX(130%) }
```
Nav pills use `.16` alpha and `.6s`; solid CTAs use `.45` and `.65s`.

**Liquid-metal pill** (dark nav on dark ground):
```css
background:linear-gradient(105deg,#050505 0%,#2a2a2a 48%,#4a4a4a 100%);
border:1px solid rgba(198,198,198,.55);
/* hover */ background:linear-gradient(105deg,#111,#3a3a3a 45%,#6a6a6a);
border-color:rgba(235,235,235,.9); box-shadow:0 0 18px rgba(200,210,230,.18);
```
**Glass centre-pill nav** (over imagery, light or dark):
```css
.nav-pill{ display:flex; align-items:center; gap:4px; padding:8px;
  border-radius:999px; background:rgba(255,255,255,.20);
  border:1px solid rgba(255,255,255,.30); backdrop-filter:blur(12px) }
.nav-pill a{ padding:6px 16px; border-radius:999px; font-size:14px; font-weight:500;
  color:rgba(255,255,255,.8); transition:background-color .2s,color .2s }
.nav-pill a:hover,.nav-pill a[aria-current]{ background:rgba(255,255,255,.20); color:#fff }
```
Absolutely centred: `absolute left-1/2 -translate-x-1/2`, hidden below `md`.
The active item is **full-opacity white with no pill** — filling it too makes
every item look active.

**Accent CTA** (when the palette carries one warm signal):
```css
background:#e8702a; color:#fff; padding:12px 28px; border-radius:999px;
transition:all .25s;
/* hover */ background:#d2611f; transform:scale(1.03);
box-shadow:0 10px 30px rgba(232,112,42,.30);
/* active */ transform:scale(.95);
```
Exactly one accent CTA per viewport. A second one and neither is primary.

**Liquid-glass ghost:**
```css
background:linear-gradient(135deg,rgba(255,255,255,.12),rgba(0,0,0,.5) 46%,rgba(150,170,200,.1));
border:1px solid rgba(198,198,198,.55); backdrop-filter:blur(16px);
```

---

## I8 · Liquid glass — the real one

`backdrop-filter: blur()` alone reads flat. Glass needs a **gradient edge**:
bright at top and bottom, invisible in the middle, as if light is wrapping a
physical pane.

```css
.liquid-glass{
  position:relative; overflow:hidden; border:none;
  background:rgba(255,255,255,.01);
  background-blend-mode:luminosity;
  backdrop-filter:blur(4px); -webkit-backdrop-filter:blur(4px);
  box-shadow:inset 0 1px 1px rgba(255,255,255,.10);
}
.liquid-glass::before{
  content:""; position:absolute; inset:0; border-radius:inherit;
  padding:1.4px; pointer-events:none;
  background:linear-gradient(180deg,
    rgba(255,255,255,.45) 0%,  rgba(255,255,255,.15) 20%,
    rgba(255,255,255,0)   40%, rgba(255,255,255,0)   60%,
    rgba(255,255,255,.15) 80%, rgba(255,255,255,.45) 100%);
  -webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);
  -webkit-mask-composite:xor; mask-composite:exclude;
}
```
The `mask-composite` trick paints the gradient only in the 1.4px padding ring —
a real gradient border, which `border-image` cannot do with a radius.

`background: rgba(255,255,255,.01)` is deliberate. Anything higher and the blur
turns milky; the *edge* carries the material, not the fill.

### Glass token table — pick by role, never improvise
| role | fill | blur |
|---|---|---|
| desktop nav pill | `rgba(255,255,255,.10)` | `blur(16px)` |
| hamburger button | `rgba(255,255,255,.10)` | `blur(16px)` |
| content card | `rgba(255,255,255,.10)` | `blur(16px)` |
| mobile backdrop | `rgba(0,0,0,.80)` | `blur(12px)` |
| mobile drawer | `rgba(0,0,0,.90)` | `blur(24px)` |
| badge / eyebrow pill | `rgba(255,255,255,.01)` + `::before` edge | `blur(4px)` |

Three fills and three blurs for the whole site. A fourth value is a bug.

**Cost:** `backdrop-filter` is the most expensive property on this page. Cap it
at ~6 elements on screen; never animate it; never nest two blurred layers.

---

## I5 · Magnetic hover
```js
el.addEventListener('pointermove', (e) => {
  const r = el.getBoundingClientRect();
  el.style.setProperty('--tx', ((e.clientX - r.left - r.width/2) * .22).toFixed(1) + 'px');
  el.style.setProperty('--ty', ((e.clientY - r.top - r.height/2) * .22).toFixed(1) + 'px');
});
el.addEventListener('pointerleave', () => el.style.setProperty('--tx','0px'));
```
`.22` pull, `transition: transform .4s var(--ease)` on leave. Primary CTA only —
magnetic everything is nauseating.

---

## I6 · Before/after scrubber
Single container, second image clipped by a divider the pointer drags:
```css
.after{ position:absolute; inset:0; clip-path: inset(0 0 0 var(--split,50%)) }
.handle{ left: var(--split,50%) }
```
Drive `--split` from `pointermove` clamped `4%`–`96%`; keyboard `←`/`→` steps 2%
with `role="slider"` and `aria-valuenow`. Snap back to 50% on `pointerleave`
only if the user never dragged.

---

## I7 · Arc stats — numbers on a fading circular sweep
Concentric arcs sweeping in from an off-canvas centre. Replaces a stat-tile row
and cannot look like a template.

```
svg viewBox="0 0 380 700" preserveAspectRatio="xMaxYMid meet"  class="h-full w-auto"
centre (-110, 300)  ← off-canvas left, so arcs curve out of the subject
```
| r | arc | dot | value | label |
|---|---|---|---|---|
| 330 | −92° → 16° | −46° | `10+` | YEARS REAL |
| 395 | −56° → 60° | 2° | `40+` | USE FORMS |
| 460 | −14° → 72° | 44° | `95%` | REPEAT MEMBERS |

Each arc: `path` `A r r 0 0 1`, `stroke-width 1.1`, with its own
`userSpaceOnUse` linearGradient running start-point → end-point, white, stops
`0 → .5 @22% → .5 @55% → .1 @85% → 0` so **both ends fade out**. That double
fade is the whole trick.

At each dot (polar from centre): filled circle `r 3.4`; ring `r 7` at 35% stroke
opacity; number at `dot + (16, 4)`, 32px, suffix as `<tspan>` 19px `dy="-10"`
`letter-spacing:-1px`; label at `dot + (18, 22)`, 8.5px, weight 600,
`letter-spacing: 2px`, 80% opacity.

Animations — pass the arc length as `--len` (`r × Δθ` in radians):
```css
.arc-line{ stroke-dasharray:var(--len); stroke-dashoffset:var(--len);
  animation:draw 1.6s cubic-bezier(.65,0,.35,1) forwards }   /* delay .4s + i*.22s */
.arc-dot { animation:popIn .55s cubic-bezier(.34,1.56,.64,1) both;   /* lineDelay + .9s */
  transform-box:fill-box; transform-origin:center }          /* ← required in SVG */
.arc-ring{ animation:pulseRing 2.8s ease-in-out infinite }   /* markDelay + .3s */
.arc-text{ animation:fadeIn .7s both }                       /* +.15s / +.3s */
@keyframes popIn{ 0%{transform:scale(.4)} 70%{transform:scale(1.25)} 100%{transform:scale(1)} }
@keyframes pulseRing{ 0%{transform:scale(1);opacity:.35} 100%{transform:scale(1.45);opacity:0} }
```
`transform-box: fill-box` is not optional — without it SVG transform-origin is
the viewport and the dot flies off screen.

`pointer-events:none`, `hidden sm:block`. Wrap every keyframe above in
`@media (prefers-reduced-motion: no-preference)`.

---
## I9 · custom cursor — dot that reacts
A small dot following the pointer, expanding over interactive elements (BASILICO).
Desktop + fine-pointer only.
```js
const dot = ref;  // fixed, 10px, rounded-full, mix-blend-difference, pointer-events:none, z-[100]
addEventListener('pointermove', e => { tx = e.clientX; ty = e.clientY; requestTick(); }, {passive:true});
onFrame(() => { cx = lerp(cx, tx, 0.2); cy = lerp(cy, ty, 0.2);
  dot.style.transform = `translate3d(${cx-5}px,${cy-5}px,0) scale(${hover?2.6:1})`; });
// hover state: delegate pointerover/out on [data-cursor] / a / button → set `hover`
```
`mix-blend-mode:difference` makes it legible on any background. Hide the native
cursor only where the dot is active (`* { cursor:none }` on the shell, restored
on touch). **Disable on `(hover:none)` / `(pointer:coarse)`** — never hide the
real cursor on touch. Reduced motion: skip entirely, keep native cursor.

## I10 · 3D tilt — preserve-3d product parallax
A hero product/card that tilts toward the pointer in real 3D (CHÂTEAU chocolate).
```css
.tilt-wrap{ perspective:1000px }
.tilt{ transform-style:preserve-3d;
  transform:rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg)) }
```
```js
el.addEventListener('pointermove', e => {
  const r = el.getBoundingClientRect();
  const px = (e.clientX - r.left)/r.width - .5, py = (e.clientY - r.top)/r.height - .5;
  targetRX = -py * 15; targetRY = px * 15;              // ±15deg
});
onFrame(() => {  // spring-smoothed
  rx = lerp(rx, targetRX, 0.12); ry = lerp(ry, targetRY, 0.12);
  el.style.setProperty('--rx', rx.toFixed(2)+'deg');
  el.style.setProperty('--ry', ry.toFixed(2)+'deg');
});
```
±15° max — more looks like a novelty. Pair with an infinite float
(`translateY` 0→-12→0 over 6s) on a nested wrapper so it lives when idle.
One tilt target per screen. Reduced motion / touch: no tilt, keep the float only.

## I11 · giant watermark type — the background word
An oversized brand/collection word behind the content (CHÂTEAU).
```css
.watermark{ position:absolute; inset:0; display:grid; place-items:center;
  font-family:var(--serif); font-weight:900; text-transform:uppercase;
  font-size:35vw; line-height:1; letter-spacing:-.08em;
  color:var(--ink); opacity:.06; pointer-events:none; user-select:none }
@media (min-width:768px){ .watermark{ font-size:25vw } }
```
Opacity `.06–.09` only — it is texture, not a headline. Reveal with the section
(`scale .9→1, opacity 0→.08, 1.5s`). Never let it force horizontal scroll — the
parent must `overflow:hidden`.

## I12 · count-up stat — number that tallies on reveal
For stat rows (25+ Years, 4B+ Sold, 98%). Counts once when it enters view.
```js
// on IntersectionObserver enter, once:
let v = 0; const target = 25, dur = 1200, t0 = performance.now();
(function step(t){ const k = clamp((t - t0)/dur); v = target * (k*k*(3-2*k));
  el.textContent = Math.round(v) + suffix; if (k < 1) requestAnimationFrame(step); })(t0);
```
`tabular-nums` on the element or it jitters. Reduced motion: set the final value
immediately, no tally.

## I13 · animated headline text — scramble, rotator, looping typewriter
Three ways to make a headline alive (Eathan / portfolio references). One per
headline, never stacked.

**Scramble-in** — cycles random chars, then settles on the word:
```js
const CH='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
function scramble(el, target, dur=900){
  const t0=performance.now();
  (function step(t){ const k=clamp((t-t0)/dur), n=target.length;
    el.textContent=target.split('').map((c,i)=>
      i < k*n ? c : CH[(Math.random()*26)|0]).join('');
    if(k<1) requestAnimationFrame(step); else el.textContent=target;
  })(t0);
}
```
**Word rotator** — swaps through a list on a timer, scramble between:
```js
const WORDS=['PURPOSE','IMPACT','INTENT']; let i=0;
setInterval(()=>{ i=(i+1)%WORDS.length; scramble(el, WORDS[i]); }, 4000);
```
Solid accent colour on the rotating word; fixed-width container so layout
doesn't jump. **Looping typewriter bio** — the `useTypewriter` hook (stacks.md
2c) with a `key` that increments every ~7s so it remounts and replays. All three:
reduced motion → show the final text immediately, no cycling.

## I14 · giant type devices — stroke outline, marquee, scroll cue, status pulse
Editorial type moves from the portfolio references.

**Stroke-outline headline** — transparent fill, drawn edge:
```css
.stroke-head{ color:transparent; -webkit-text-stroke:1px #fff;
  font-weight:900; text-transform:uppercase }         /* thicker at ≥md */
```
Pair a stroke line above a solid-accent line for the classic hi-contrast hero.

**Footer marquee** — ultra-large stroked text scrolling forever:
```css
.marquee{ position:absolute; bottom:0; white-space:nowrap; font-weight:900;
  color:transparent; -webkit-text-stroke:1px rgba(255,255,255,.15);
  font-size:12vw; animation:marq 24s linear infinite }
@keyframes marq{ to{ transform:translateX(-50%) } }   /* content duplicated ×2 */
```
Duplicate the text twice inside so the loop is seamless. `overflow:hidden` parent.

**Scroll indicator (wheel)** — a small mouse-shape with a dot that falls:
```css
.wheel{ animation:wheel 2s ease-in-out infinite }
@keyframes wheel{ 0%{opacity:1;transform:translateY(0)} 100%{opacity:0;transform:translateY(15px)} }
```
Hide it once the user has scrolled past the first viewport, and on reduced motion.

**Status / availability pulse** — a live dot for "available for work":
```css
.pulse-dot{ position:relative; width:10px; height:10px; border-radius:50%;
  background:#00ff88 }
.pulse-dot::after{ content:''; position:absolute; inset:0; border-radius:50%;
  background:#00ff88; animation:pulse 2s ease-out infinite }
@keyframes pulse{ 0%{transform:scale(1);opacity:.8} 100%{transform:scale(2.5);opacity:0} }
```
Sits in the availability glass card (A29). Accent-green regardless of preset —
"live" reads green universally. Reduced motion: static dot, no ping.

## I15 · velocity skew — motion that leans into scroll speed
Gallery/row items skew slightly based on scroll velocity, so fast scrolling
"drags" them (Maison gallery). Adds physicality.
```js
let last = 0, vel = 0;
onFrame((st) => {
  vel = (st.scroll - last); last = st.scroll;
  const skew = clamp(vel * 0.4, -15, 15);        // clamp ±15deg
  items.forEach(el => el.style.setProperty('--skew', skew.toFixed(2) + 'deg'));
});
```
```css
.gallery-item{ transform:skewX(var(--skew,0deg)); transition:transform .1s linear }
```
Clamp hard at ±15° — beyond that it reads as breakage, not speed. Reduced motion:
disable (skew 0). Pair with A26 horizontal pin or A28 gallery.

## I16 · ambient light orbs — the ONLY sanctioned orbs
Blurred colour orbs are **banned as a main visual** (they are the generic-AI
tell). The **one** exception: faint, heavily-blurred ambient lights **behind a
light-glassmorphism section** (light-glass services, A32), where they give the
glass something to refract.
```css
.orb{ position:absolute; border-radius:50%; filter:blur(100px); opacity:.6;
  animation:orbFloat 15s ease-in-out infinite alternate; pointer-events:none }
/* e.g. 500px emerald top-left, 600px cyan bottom-right, 400px violet centre */
@keyframes orbFloat{
  0%{transform:translate(0,0) scale(1)} 50%{transform:translate(30px,50px) scale(1.05)}
  100%{transform:translate(-20px,20px) scale(.95)} }
```
Rules that keep it from looking generic: **light background only** (`z-index:-1`
behind glass), `blur(100px)`+, opacity ≤ .6, at most 3, slow drift, and there
must be **glass in front of them** — an orb with nothing over it is the banned
version. Never on a dark hero, never as the hero's main subject. Reduced motion:
freeze the float.

## I17 · billing toggle — monthly / annually
The pill switch on pricing (Aurora / brutal pricing refs).
```
container: pill (w-20 h-10), glass or bordered; inner knob (w-8 h-8 rounded-full)
knob: translateX 4px (monthly) ↔ 44px (yearly), cubic-bezier(.34,1.56,.64,1)
labels: active text/80, inactive text/50
prices: data-monthly / data-yearly attrs; on switch fade out (opacity 0, y -10px),
        swap number after 250ms, fade back in
```
`role="switch"`, `aria-checked` toggled, an `sr-only` label inside. Reduced
motion: instant knob + price swap, no fade.

## I18 · tactile press — the brutalist button/card feel
Solid-shadow elements that physically depress on interaction (P9 BRUTAL).
```css
.brutal-card{ box-shadow:var(--brutal); transition:transform .2s, box-shadow .2s }
.brutal-card:hover{ transform:translate(4px,4px); box-shadow:4px 4px 0 0 #000 }
.btn-press{ transition:transform .15s }
.btn-press:active{ transform:translate(2px,2px) }
```
The shadow *shrinks* as the element moves into it — that is the press illusion.
Only in BRUTAL builds. Keep focus-visible rings (brutalist ≠ inaccessible).

## I19 · aurora background — animated gradient + blend-screen blobs
A living gradient backdrop for dark tech/SaaS pricing (Aurora ref). This is the
**one sanctioned dark blob usage** — like I16, it is allowed only as an
*animated background behind glass content*, never a hero's main subject.
```css
body{ background:linear-gradient(#0a0514,#1a0a2e,#0a1128,#160824);
  background-size:400% 400%; animation:auroraPan 15s ease infinite }
@keyframes auroraPan{ 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
.aurora{ position:fixed; inset:0; z-index:-1; filter:blur(100px); pointer-events:none }
.aurora .blob{ position:absolute; border-radius:50%; mix-blend-mode:screen; opacity:.6;
  animation:blob 20s ease infinite }   /* 4 blobs, e.g. #7e22ce #0891b2 #db2777 #4f46e5 */
```
Rules: `mix-blend-mode:screen`, `blur(100px)`, opacity ≤ .6, `z-index:-1`, and
**glass cards must sit over it** (that is what makes it premium not generic).
`aria-hidden` the container. Reduced motion: freeze pan + blobs. Never on a hero
with no content over it — that is the banned generic-orb look.


## Standing rules

- One rAF loop. Subscribe via `onFrame`; never call `requestAnimationFrame`
  yourself outside `engine.js`.
- Remove listeners and cancel frames on unmount (React) or `pagehide` (vanilla).
- Every pointer effect needs a `(hover: none)` and a reduced-motion off-switch.
- Pointer travel budget: ≤ 22px for layers, ≤ 16px for the grid, ≤ 0.42 world
  units for the camera. Past that it stops reading as parallax.
- `toDataURL()` per frame (I1) is the one expensive thing here — it is acceptable
  because nothing else in the frame allocates. Do not add a second.
