# Section archetypes

Assemble pages from these. Each ships its own DOM, CSS notes, and scroll math —
select and fill, never design from zero. **None of them is a card grid.**

Default single-page order:
`hero → problem-stack → sticky-rail → results-ladder → process-spine →
proof-rotator → faq-accordion → final-cta`

`s` = section-local scroll px from `registerRig`. Ramp lengths come from the
preset's motion-signature table in `art-direction.md`.

---

## A1 · hero — the one composition
```
section.rig.hero  --len:2600px
└─ div.stage
   ├─ div.plate            (optional video/photo plate + ::after fades)
   ├─ div.fallback         (CSS parallax, shown only on html.no-gl)
   ├─ p.eyebrow
   ├─ h1                   ← ONE headline, accent span wrapped in <em>
   ├─ p.lead
   ├─ div.actions          pill + ghost
   └─ div.veil
```
```js
const intro = smoothstep(60, 620, s);
setVar('--hero-y', (intro * -190) + 'px');
setVar('--hero-scale', 1 - intro * 0.07);
setVar('--hero-opacity', 1 - intro);
setVar('--sub-y', (intro * 86) + 'px');
setVar('--sub-opacity', 1 - intro);
```
H1 left at `var(--gutter)`, `top:calc(268 * var(--u))`, `max-width:calc(1020 * var(--h))`,
`text-wrap:balance`. Lead at `+calc(214 * var(--h))`, `max-width:calc(560 * var(--h))`.
Actions at `+calc(318 * var(--h))`, `gap:calc(18 * var(--h))`.

**Nothing else above the fold.** No stats, no chips, no logo strip.

---

## A2 · problem-stack — numbered rows, not cards
Three to five rows, 1px `--line` divider between each.
`grid-template-columns: calc(64 * var(--h)) 1fr 38%`.
Hover: the numeral scales to 1.12 and turns `--accent`; row background lifts to
`--accent-soft` over 300ms. Reveal with `data-reveal data-d="1|2|3"`.

Use for: pain points, objections, "what's broken today", differentiators.

---

## A3 · sticky-rail — horizontal act sequence
The workhorse for services / features / product lines. 3–5 panels.
```
section.rig.rail  --len:2200px
└─ div.stage > div.track   (transform: translate3d(var(--rail-x),0,0))
   └─ article.panel × N
```
```js
setVar('--rail-x', `${-smoothstep(0, len, s) * (N - 1) * 72}vw`);
const idx = Math.min(N - 1, Math.floor(smoothstep(0, len, s) * N));
scene.setRing?.(idx);        // or setLit(idx) for MonolithRow
```
Panel: `flex:0 0 68vw`, `background:var(--glass)`, `border:1px solid var(--glass-line)`,
`backdrop-filter:blur(14px)`, radius ≤ 20px, giant index numeral behind the text
(`calc(190 * var(--h))`, colour `--line`).
Track transition `640ms cubic-bezier(.22,1,.36,1)`.
**Mobile:** `--rail-x:0px`, panels stack vertically, rig height auto.

---

## A4 · results-ladder — one line at a time
Each row is `text + <em>metric</em>`, serif, accent metric. Rows reveal
sequentially, 90px of scroll apart:
```js
rows.forEach((el, i) => el.classList.toggle('in', s > i * 90));
```
Use for: outcomes, stats-as-sentences, before/after claims. Reads far more
expensive than a stat-tile row, and it can't look like a template.

---

## A5 · process-spine — vertical timeline
Three to four steps on a 1px `--line` spine with an `--accent` fill that grows
with section progress:
```js
spine.style.setProperty('--fill', (smoothstep(0, len, s) * 100).toFixed(1) + '%');
```
```css
.spine{position:relative;background:var(--line)}
.spine::before{content:"";position:absolute;inset:0 auto auto 0;width:100%;
  height:var(--fill);background:var(--accent)}
```
Use for: how-it-works, onboarding, timeline, methodology.

---

## A6 · proof-rotator — one testimonial at a time
Full-width quoted slab, crossfading on a 6s timer plus `←` `→` arrows at
`left: var(--gutter)`. `aria-live="polite"`; pause on hover and focus.
Under the rotator, a 3-tile numeral row (serif, `--accent`).
Never a 3-across testimonial card grid.

---

## A7 · pricing-columns — vertical glass columns
`border:1px solid var(--glass-line)`, `background:var(--glass)`,
`backdrop-filter:blur(14px)`, radius ≤ 20px, separated by 1px vertical rules.
The popular column sits `translateY(calc(24 * var(--u)))` lower, carries an
`--accent` border and the ribbon, and is the **only** one with a `GlassSlab`
behind it. Price numerals serif `calc(64 * var(--h))`.
**Mobile:** single column, popular column `transform:none`.
Optional **billing toggle** (`interactions.md` I17) above the columns — prices
carry `data-monthly`/`data-yearly` and swap on switch.

---

## A8 · faq-accordion — native details
`<details>/<summary>`, 1px `--line` dividers, `+`→`−` rotating glyph,
`grid-template-rows` height animation 380ms. Emit `FAQPage` JSON-LD from the
same source array so the copy can never drift from the schema.

---

## A9 · media-act — photo or video reveal
Sticky rig; the plate is unveiled by a `clip-path` wipe, never a fade:
```js
const rev = smoothstep(0, 900, s);
setVar('--plate-reveal', rev.toFixed(4));
setVar('--plate-y', ((1 - rev) * 26).toFixed(1) + 'px');
setVar('--plate-scale', (1.06 - rev * .06).toFixed(4));
setVar('--plate-sat', (.72 + rev * .28).toFixed(3));
setVar('--plate-bright', (.78 + rev * .22).toFixed(3));
```
```css
.plate-video,.plate img{
  clip-path:inset(calc((1 - var(--plate-reveal)) * 74%) 0% 0% 0%);
  transform:translate3d(0,var(--plate-y),0) scale(var(--plate-scale));
  filter:saturate(var(--plate-sat)) brightness(var(--plate-bright))}
```
**Two fade gradients on `.plate::after`, keep both** — a bottom fade into
`--void`, and a to-right gradient that keeps the type column legible over the
image's negative space. Do not weaken the to-right one.

Video rules: `autoplay muted loop playsinline preload="metadata"`, the still as
`poster`, `<source>` attached only after `window.load`, poster preloaded with
`fetchpriority="high"`, skipped on `saveData`/2G, `pause()` on `document.hidden`
and off-screen. Never `controls`. Never `pointer-events`.

---

## A10 · legal-reader — policy / terms pages
Two columns: sticky section index left (`calc(240 * var(--h))` wide, current
section highlighted by `IntersectionObserver`), prose right at
`max-width:calc(720 * var(--h))`. Scene at 35% opacity. `h2` serif
`calc(30 * var(--h))`, `margin-top:calc(64 * var(--u))`.

---

## A11 · final-cta — wide and empty
H2 with an `<em>` accent span, one lead line, pill + ghost. The camera's last
keyframe belongs here: pulled far back, fov opened, the scene small and distant.
Negative space is the whole point — do not fill it.

---

## A12 · contact-embed / booking-embed
Third-party iframe in a glass panel, `min-height:700px`, skeleton shimmer until
`load`. Never restyle the iframe's internals. Left column carries the contact
rails as plain labelled rows, not cards.

---

## A13 · single-viewport hero — locked frame, no scroll
For "one perfect screen" briefs. Desktop locks; phone releases to normal flow.

```css
@media (min-width:901px){
  html,body{height:100%;overflow:hidden}
  .page{height:100vh;height:100dvh;overflow:hidden;
        display:grid;grid-template-rows:auto 1fr auto}
}
@media (max-width:900px){ html,body{height:auto;overflow-y:auto} }
```
Rows: `header` / `main.hero` / `footer.stats`.
Hero is **bottom-weighted, not centred**: `display:flex; align-items:flex-end;
justify-content:center; padding:8px 24px var(--hero-gap)`. Centring wastes the
top third; bottom-weighting is what makes it read as a film frame.

Composition: badge → masked H1 (2 lines) → lede → two CTAs → three stats.
Nothing else. No scroll cue, because there is nothing to scroll to.

**Height breakpoints are as important as width** here — at
`(min-width:901px) and (max-height:850px)` shrink `--hero-gap` and `--h1`; again
at `max-height:720px`. A laptop at 1440×720 must not clip.

Pair with `entrances.md` §2 — the delay table *is* the choreography, since
there is no scroll to carry it.

---

## A14 · spotlight hero — two images, cursor reveal
Full-screen `100dvh`, `relative overflow-hidden`. Layers:
```
z-0   SVG grid, opacity .1, pointer-parallax     (interactions.md I3)
z-10  base image, Ken Burns 2.4s                 (I2)
z-30  reveal image, canvas radial mask           (I1)
z-50  arc stats, right edge, hidden below sm     (I7)
z-50  text block, bottom-left, staggered rise
```
Text block: `absolute bottom-12 sm:bottom-16 md:bottom-24 left-5 sm:left-8
md:left-12 max-w-[300px] sm:max-w-md` — eyebrow, H1 with manual `<br/>`,
paragraph, CTA with shine sweep.

Reveal image must be **the same subject, different treatment** — a different
colour grade, a wireframe of the same object, the same person in different
light. Two unrelated images read as a bug.

Stagger: eyebrow `.15s`, H1 `.3s`, paragraph `.5s`, button `.7s`, using
`in-blur` from `entrances.md`.

---

## A15 · badge row — one line above the H1
`inline-flex; gap:8px; padding:9px 15px; border:0; border-radius:5px`, gradient
`linear-gradient(90deg,#7d7d7d,#2a2a2a 52%,#0a0a0a)`, an 18×20 icon with
`filter: drop-shadow(0 0 3px rgba(255,255,255,.45))`, then the label.

Exactly one badge, exactly one line of text, directly above the H1. Two badges
is a template. Enters with `in-pop`; the icon with `in-star`.

---

## A16 · masked-mosaic — one image, many windows
The signature move of the light preset, and the best-looking layout in this
skill. Several cards sit in a grid; **all of them share one background image**,
each showing a different window into it. The gaps become slices cut out of a
single photograph, so the section reads as one object rather than N cards.

```
section (h-screen, flex-col, gap-1.5 md:gap-2, px-3 md:px-5)
├─ MaskedCard  bar 1      h-14 md:h-20
├─ MaskedCard  bar 2
├─ MaskedCard  bar 3
└─ MaskedCard  hero       flex-1 min-h-0
```
Every card: `rounded-xl md:rounded-2xl overflow-hidden relative`.

### The three hooks

```ts
/* 1 · where each card sits inside the section */
function useMaskPositions(sectionRef, cardsRef) {
  const [pos, setPos] = useState<Pos[]>([]);
  useEffect(() => {
    const sec = sectionRef.current; if (!sec) return;
    const measure = () => {
      const s = sec.getBoundingClientRect();
      setPos(cardsRef.current.map((c) => {
        if (!c) return { x: 0, y: 0, sw: s.width, sh: s.height };
        const r = c.getBoundingClientRect();
        return { x: r.left - s.left, y: r.top - s.top, sw: s.width, sh: s.height };
      }));
    };
    measure();
    const ro = new ResizeObserver(measure); ro.observe(sec);
    return () => ro.disconnect();
  }, []);
  return pos;
}

/* 2 · how wide the image would be if scaled to fill the section height */
function useImageWidth(src: string, sectionHeight: number) {
  const [w, setW] = useState(0);
  useEffect(() => {
    if (!sectionHeight) return;
    const img = new Image();
    img.onload = () => setW(img.naturalWidth * (sectionHeight / img.naturalHeight));
    img.src = src;
  }, [src, sectionHeight]);
  return w;
}

/* 3 · viewport class */
function useIsMobile() {
  const [m, setM] = useState(false);
  useEffect(() => {
    const q = matchMedia('(max-width: 767px)');
    const on = () => setM(q.matches); on();
    q.addEventListener('change', on); return () => q.removeEventListener('change', on);
  }, []);
  return m;
}
```

### The card
```tsx
function MaskedCard({ bgImage, position, imageWidth, focalX = .8, ...rest }) {
  const overflow = imageWidth > position.sw ? imageWidth - position.sw : 0;
  const focalOffset = overflow * focalX;
  return <div {...rest} style={{
    backgroundImage: `url(${bgImage})`,
    backgroundSize: `auto ${position.sh}px`,
    backgroundPosition: `-${position.x + focalOffset}px -${position.y}px`,
    backgroundRepeat: 'no-repeat',
    ...rest.style }} />;
}
```

**`focalX` (0–1) is the only art-direction dial** — it slides which part of the
photograph the whole mosaic is looking at. Mobile crops harder, so it needs its
own value: mobile `.65–.7`, desktop `.8`.

**Rules**
- `backgroundSize: auto {sh}px` — height-locked, never `cover`. `cover` breaks
  the illusion because each card would scale independently.
- Positions are **negative offsets**, so every card is looking at the same
  origin. Getting a sign wrong is the usual bug; the tell is cards showing the
  same crop.
- One `ResizeObserver` on the section, not one per card.
- Recompute on font load — text reflow changes card heights.
- Give the section a solid background so the first paint before `useImageWidth`
  resolves is a clean colour, not a flash of unstyled boxes.
- This is **not** a card grid in the banned sense. The ban is on generic
  bordered boxes in a 3-across row; this is one image cut into windows.

Vanilla equivalent: same maths, `ResizeObserver` + a `--bg-x` / `--bg-y` CSS
variable per card. No React required.

---

## A17 · seamless mosaic sections
The layout language A16 lives in. Sections butt against each other with almost
no seam, so the page reads as one continuous sheet of cards.

```
section: h-screen w-full overflow-hidden flex flex-col
         pt-1.5 md:pt-2  px-3 md:px-5  pb-1.5 md:pb-2  gap-1.5 md:gap-2
first section only: pt-24 md:pt-24   (clears the fixed navbar)
later sections: min-h-screen md:h-screen   (mobile grows, desktop locks)
```
Inner grid: `flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 gap-1.5 md:gap-2`,
with explicit `grid-rows-[1fr_1fr_0.8fr]` on desktop and `auto` rows on mobile.
Cards that span: `md:row-span-2`, `md:col-span-2`.

`min-h-0` on every flex child is not optional — without it `flex-1` children
refuse to shrink and the section overflows.

Mobile cards need explicit `min-h-[160px]` / `[200px]` / `[350px]`, because
`h-screen` becomes `min-h-screen` and the grid has nothing to divide.

One `md:` breakpoint (768px) for the whole page. Resist adding more — the
mosaic's simplicity is the point.

---

## A18 · sequential sections — one at a time over a fixed stage
For scroll-scrubbed video (`video.md` V2) and any sticky stage where text blocks
must **fully clear** before the next appears. Different from the `seg()` overlap
model in A1–A11: here the crossfade gap is deliberate empty space.

`p` = 0–1 progress over the whole track. Each section is `absolute inset-0`,
`transition: opacity .1s ease-out` (short — the scroll *is* the timeline).

```js
const s1 = p < 0.20 ? 1 : Math.max(0, 1 - (p - 0.20) / 0.08);
const s2 = p < 0.32 ? 0
         : p < 0.40 ? (p - 0.32) / 0.08
         : p < 0.55 ? 1
         : Math.max(0, 1 - (p - 0.55) / 0.08);
const s3 = p < 0.67 ? 0
         : p < 0.75 ? (p - 0.67) / 0.08 : 1;
```
Read the gaps: s1 is gone at `.28`, s2 arrives at `.32`. **4% of empty stage
between them** — that pause is what makes it feel edited rather than crossfaded.
`.08` ramps throughout; keep them equal.

Children stagger in when their section's opacity passes `0.3`:
`opacity 0→1`, `translateY(24px)→0`, `.8s cubic-bezier(.16,1,.3,1)`,
delays `0 / 150 / 300ms`.

**Nav colour flips with the footage**, not with a section:
`p > 0.55 ? white : ink`, `transition-colors duration-500`. Pick the threshold
by watching the clip, not by dividing the track evenly.

Alignment should change per section — left, centre, right — so the eye moves.
Three left-aligned sections read as one long block.

---

## A19 · video-switcher hero
One viewport, N clips, the visitor picks the mood. See `video.md` V4.

```
section relative w-full h-screen overflow-hidden bg-black
├─ videos      N stacked, only active at opacity-100, 1000ms crossfade
├─ overlay PNG z-1, "train-bob" 3s oscillation      (optional)
└─ content     z-2, flex-col h-full
   ├─ nav
   ├─ centre: badge → h1 → sub → email pill
   ├─ switcher row: N text buttons
   └─ stats row, mt-auto
```
`bg-black` on the section prevents a flash before the first clip decodes.

Switcher buttons: active = full colour + 2px bottom border; inactive = 50%
opacity + transparent border, hover 80%. Text only — thumbnails turn a mood
selector into a media player.

Label each clip with a real name (`Golden Hour`, `Still Water`), never
`Video 1`.

If one clip inverts the contrast, flip only the hero block's colour for that
index, `transition-colors duration-700`; leave nav and stats fixed.

---

## A20 · three-panel image floor
The bottom third of the viewport is three photographs butted edge to edge with
**no gaps**, the centre one taller. Reads as a single wide plate but crops
independently, so it survives every aspect ratio.

```
div  absolute bottom-0 left-0 right-0 z-10  flex items-end
├─ img  flex-1        max-h: min(70vh, 55vw)
├─ img  flex-[1.265]  max-h: min(85vh, 70vw)     ← centre, wider AND taller
└─ img  flex-1        max-h: min(70vh, 55vw)
```
All three `w-full h-auto block`. `items-end` is what aligns the baselines while
letting the centre rise.

`1.265` is the ratio that makes the centre read as the subject without looking
like a mistake. `1.5` looks like a layout bug; `1.1` looks like an accident.

**Overlays** sit at `bottom: clamp(20px, 4vh, 50px)` — one per panel, no more:
left a stat with an avatar stack, centre a heading plus the primary pill, right
a rating. Three overlays is the ceiling; a fourth turns the floor into a banner.

Entrance: `photoReveal` (`entrances.md` §5f), **centre panel first**, then the
outer two 150ms later. Outside-in reads as a curtain; centre-first reads as a
reveal.

Mobile: same three-panel flex, drop the `max-height` constraints entirely and
let them size naturally.

---

## A21 · split auth / form page
A two-column composition: media on one side, a calibrated form panel on the
other. Not cinematic — it is a working page that must feel expensive.

```
.stage  fixed inset-0 overflow-hidden
├─ section.photo   left:0; height:100%; width:57.1%   (video or still + scrim)
│  └─ .hero        badge + two headline lines, anchored bottom-left
└─ section.pane    left:57.1%; right:0
   └─ .card        the panel
      └─ .card-in  authored at reference size, JS-scaled
```
Use **R2 scale-the-interior** from `responsive.md` — the interior carries 30+
calibrated pixel values, and scaling one transform beats making each responsive.
Three modes: `land` / `tabport` / `phone`, with `clearInline()` between them.

**Form rules that are not negotiable**
- Inputs `font-size:16px` on phone, or iOS zooms on focus.
- Real `<input type="email" autocomplete="email" aria-label>`; a static
  composition still gets correct semantics.
- `:focus-visible{outline:2px solid; outline-offset:2px}` on every control.
- Two buttons max: one filled primary, one bordered secondary, a rule between.
- The media side never animates — it is the stage (`entrances.md` §5e).

Entrance: the WAAPI timeline in `entrances.md` §5e, with the `entry-pending`
pre-paint guard. This is the archetype it was written for.

Phone: the media becomes a `clamp(244px,34svh,304px)` band with the scrim
turned **on**, the headline goes white over it, and the card overlaps upward
with `margin-top:-28px; border-radius:28px 28px 0 0`.

---

## A22 · footer strip — three panels, three jobs
A full-width band under the hero, `grid-cols-1 md:grid-cols-[2fr_1fr_2fr]`.
Not a footer in the navigation sense — it is the third act of the hero.

The `2fr / 1fr / 2fr` ratio matters: the narrow centre reads as a spacer with
content in it, which is what stops the band looking like three equal cards.

| panel | job | treatment |
|---|---|---|
| 1 | the next step | pale ground, one heading + one underlined link, a decorative cut-out at `right:0 bottom:0` with `mix-blend-mode: multiply` |
| 2 | rotating proof | the lightest ground, an auto-cycling card (below) |
| 3 | the number | the darkest ground — one stat, one line of context, one product cut-out |

Each panel gets its own `fadeUp` delay, left to right, 100ms apart.

### The rotating card (panel 2)
Four cards, `3500ms` each, cross-faded — not slid:
```
active   : opacity-100 translate-y-0  (in flow)
inactive : opacity-0  translate-y-4   (absolute, so height never jumps)
```
Each card is a coloured circle icon (40px, `sm:48px`) plus one sentence. Icon
colours vary per card; nothing else does.

Progress indicator: four `h-0.5 flex-1 rounded-full` bars — active `--ink`,
inactive `--ink/20`. Bars, not dots: they read as progress and they fill the
width without needing to be centred.

`3500ms` is the dial. Below 2500 it is unreadable; above 5000 nobody sees card 4.
**Pause the cycle on hover and on focus**, and stop it entirely under
`prefers-reduced-motion` (show card 1, keep the bars, make them clickable).

---

## A23 · bleed product — the object that breaks the frame
One product or subject cut-out, deliberately oversized, escaping the viewport
on one or two edges. Reads as confidence; a contained, centred product reads as
a catalogue.

**Desktop** — absolutely positioned, negative offsets clamped so it never fully
leaves at extreme widths:
```css
position:absolute; z-index:0;
width: clamp(600px, 80vw, 1412px); height:auto;
bottom:-10%;
right: clamp(-400px, -20vw, -100px);
```
**Mobile/tablet** — in flow, wider than its container, overlapping the band below:
```
w-[180%] sm:w-[151%] max-w-[1296px] object-contain mx-auto
margin-bottom: -180px  sm:-220px
```
The negative bottom margin is what makes it overlap A22 rather than sit above it.

Rules: `z-index: 0` — it sits *behind* the headline, never over it. Transparent
PNG or a cut-out; a rectangular photo destroys the effect. `drop-shadow-2xl`
only if the ground is light. Enter with `scaleIn` at ~700ms, after the
headline has resolved.

**Inline-in-headline variant:** the same cut-out at
`height: clamp(60px, 10vw, 160px)`, `display:inline-block`, `vertical-align:middle`
sitting inside the last headline line. `hidden sm:inline-block` — on phone it
crowds the type. Enter it last, on its own delay, so it lands as punctuation.

---

## A24 · layered product assembly — the exploded-object scroll
A product built from **stacked transparent PNG layers** (burger: bun-top →
sauce → pickles → patty → bacon → patty → bun-bottom) that **fly apart into an
exploded view and reassemble as you scroll** — or the reverse. Works on light or
dark. This is the single most-requested product effect and it has exact math;
do not hand-wave it.

### Assets
One transparent PNG **per layer**, all the same canvas size and registration so
they stack pixel-aligned (like animation cels). Either the user supplies them,
or generate each layer on a transparent/plain ground (see `assets.md` — exploded
product prompts). N layers, typically 4–8.

### DOM
```
section.rig.assembly  --len:2400px          (sticky rig, engine.js)
└─ div.stage
   ├─ div.assembly            (relative, centred, the stack)
   │  └─ img.layer  × N        each absolute, same box, z by stack order
   ├─ div.contact-shadow       one soft ellipse under the stack (light builds)
   ├─ h2.assembly-title        copy that changes per phase (optional)
   └─ ul.assembly-labels       callout labels that fade in at full-explode (optional)
```
Layer order in the DOM = bottom-of-burger first (lowest z) to top-of-burger last
(highest z), so the natural paint order already stacks correctly.

### The math (per layer i of N, top layer = index 0)
Section-local progress `s` (0…len). Choose ONE direction:

**Assemble-on-scroll** (starts exploded, comes together — recommended):
```js
const p = smoothstep(0, len * 0.82, s);        // 0 exploded → 1 assembled
layers.forEach((el, i) => {
  const mid = (N - 1) / 2;
  const rank = i - mid;                          // −mid … +mid, signed by position
  const gap  = 120;                              // px between layers when exploded (tune)
  const y = rank * gap * (1 - p);                // slides to 0 as p→1
  const rot = rank * 4 * (1 - p);                // slight fan, straightens on assemble
  const op  = 1;  // NEVER fade a layer below 1 — the classic 'washed-out ghost layers' bug
  el.style.setProperty('--ly', y.toFixed(1) + 'px');
  el.style.setProperty('--lrot', rot.toFixed(2) + 'deg');
  el.style.opacity = op.toFixed(3);
});
// whole stack settles + contact shadow tightens
stage.style.setProperty('--stack-scale', (0.94 + p * 0.06).toFixed(4));
shadow.style.setProperty('--sh', (0.3 + p * 0.7).toFixed(3));  // shadow opacity
```
**Explode-on-scroll** is the same with `(1 - p)` → `p` (starts assembled, flies apart).

```css
.layer{ position:absolute; inset:0; margin:auto; width:100%; height:auto;
  transform:translate3d(0, var(--ly,0), 0) rotate(var(--lrot,0));
  will-change:transform,opacity; pointer-events:none }
.assembly{ transform:scale(var(--stack-scale,1)); transform-origin:50% 60% }
.contact-shadow{ opacity:var(--sh,.3);
  background:radial-gradient(ellipse 45% 40% at 50% 50%, rgba(20,18,16,.5), transparent 70%) }
```

### Numbers that matter
- `gap` **120px** exploded spacing — smaller reads as "already assembled," larger
  pushes layers off-screen. Tune to layer count and image height.
- Layers assemble **bottom-first** feels most natural for food (the `rank`-based
  opacity stagger does this); top-first for tech/hardware.
- Reserve the **last 18% of the rig** (`len*0.82`) fully assembled, so the hero
  holds still before the next section — nothing worse than it never finishing.
- Pointer parallax: add `+ state.mx * rank * 6` to each layer's X for a live 3D
  feel while assembled.

### Light vs dark
- **Light build:** the `contact-shadow` is essential — the burger floats without
  it. Ground `#fbfaf7`, product lit warm.
- **Dark build:** drop the contact shadow, add a soft radial glow behind the
  assembled product instead.

### Copy choreography (optional but strong)
Swap the headline per phase: exploded → `Every layer, made fresh.`; assembling →
`Stacked to order.`; assembled → the product name + price + CTA. Cross-fade on
the same `p` thresholds.

### Mobile
Reduce `gap` to ~70px, stack the labels below instead of beside, and if the rig
feels long on a phone shorten `--len` to 1600px. Under reduced motion: show the
**assembled** state immediately, no explode.

This is the burger/sneaker/phone/cosmetic-bottle effect. Any product with
separable parts suits it; a single solid object does not (use A23 bleed instead).

### Hard-won lessons (do NOT skip — these are real failures seen in the wild)
1. **`position:sticky` silently dies if ANY ancestor has `overflow-x:hidden`**
   (body, `#root`, the app wrapper). The rig unpins early and the stage shows
   blank space. Use **`overflow-x:clip`** everywhere instead — clips the same but
   does NOT create a scroll container. This is the #1 reason a scroll rig "does
   nothing." (core.css already ships `clip`; keep it that way in React ports too.)
2. **Never fade a layer below opacity 1.** A `0.15 + …` floor produces the
   washed-out ghost-stack look. Layers stay fully opaque; motion alone conveys
   the assemble.
3. **Real transparent, pixel-aligned layers are hard to get.** AI generation
   rarely returns cels that stack cleanly. If you can't get aligned transparent
   layers, do **A33 layer-swapper** instead (one full layer hero at a time) — it
   is far more reliable and reads just as premium. Slicing ONE flat photo with
   `clip-path` into fake bands looks broken; do not do it.
4. **Tie progress to the real pin range**, not a guessed px: `pin = rig.offsetHeight
   - innerHeight; p = s / pin`. Otherwise the finished state lands after the stage
   has already unpinned and scrolled away.
5. **Generated square heroes on a coloured ground** show a visible rectangle —
   fade the edges with `mask-image:radial-gradient(ellipse 72% 72% at 50% 50%,
   #000 58%, transparent 90%)`, or generate transparent.
6. **Downscale generated images** to ~1200px WebP (a 2048² PNG is ~7MB; the WebP
   is ~90KB). Six raw layers = 42MB of hero images otherwise.

---
## A25 · snap-panel worlds — full-viewport sections that change the world
Each section is a full-screen panel (`h-[100dvh] snap-start`) and the **page
background transitions per active panel** — a different colour/gradient "world"
for each. From the CHÂTEAU reference. Best for a small set (3–6) of distinct
collections/moods on one page.

### Mechanics (pure CSS snap, no scroll hijack)
```css
html{ scroll-snap-type:y mandatory; scroll-behavior:smooth }
::-webkit-scrollbar{ display:none }              /* + scrollbar-width:none */
section.panel{ height:100dvh; scroll-snap-align:start }
```
Background lives in a **fixed** layer behind everything (`fixed inset-0 z-[-1]`).
Each panel reports "I'm active" via `IntersectionObserver(threshold:.5)`; the
active panel's theme is lifted to a parent that swaps the fixed background:
```js
// per panel
const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setTheme(id); },
  { threshold: 0.5 });
// background swaps instantly (0.2s) between worlds:
bg.style.background = WORLDS[theme];   // radial-gradient per theme
bg.style.transition = 'background .2s ease-in-out';
```
Define 3–6 `WORLDS` gradients (e.g. white-choc cream, dark-choc brown, etc.).
**Theme-aware text:** light worlds → dark ink; dark worlds → white. Flip nav +
text colour off the same `theme` value, transition `.3s`.

### Per-panel layout & entrances (each panel)
Split: product image left (anchored `items-end`, oversized
`h-[70vh] md:h-[100vh] object-contain`, pushed `translate-y-12 md:translate-y-28`
so it bleeds off the bottom), content right. **Entrances wait for the 0.2s world
swap**, then stagger: giant watermark word (`I11`) `opacity 0→.08, scale .9→1,
y 50→0, 1.5s delay .2`; product `x -100→0, 1.5s delay .4` + float + 3D tilt
(`I10`); text block `x 60→0, 1.5s delay .6`. Re-trigger on scroll up/down
(`viewport once:false amount:.1`).

Under reduced motion: snap stays, entrances off, worlds still swap (colour only).
Mobile: same, product smaller, watermark `text-[35vw]`.

---

## A26 · horizontal pinned scroll — the sideways gallery
A section that **pins to the viewport and scrolls its inner row sideways** as you
scroll vertically. From LUXONN. The canonical "portfolio / property showcase /
process reel" move. Fills the horizontal-scroll need without a separate page.

### Mechanics (engine-native, no GSAP)
```
section.rig.pin  --len: <N*80>vh          (tall outer rig; N = panels)
└─ div.stage (sticky)
   └─ div.track (flex row, width = N*100vw)
      └─ article.hpanel × N   (each 100vw or a fixed wide card)
```
```js
// section-local progress s over the rig
const p = smoothstep(0, len, s);
const maxX = track.scrollWidth - innerWidth;        // total sideways travel
track.style.transform = `translate3d(${(-p * maxX).toFixed(1)}px,0,0)`;
```
`--len` ≈ `panels * 80vh` (more = slower sideways). Each panel reveals its own
caption as it centres: `active = clamp(1 - abs(panelCenterX - viewportCenter)/W)`.
Transition on the track is **none** (scroll drives it directly); add a 120ms
ease only for keyboard/prev-next jumps.

**Mobile:** pinning sideways is awkward on touch — collapse to a normal
`overflow-x:auto` swipe row with `scroll-snap-type:x mandatory`, rig height auto.
Reduced motion: same collapse. Never trap vertical scroll on a phone.

---

## A27 · full-screen glass modal — menu / gallery / detail overlay
A `fixed inset-0 z-[90]` overlay with a glassmorphism panel, opened from a button
(BASILICO menu, gallery lightbox, product detail). Not a section — a component
any page can open.

```
button → opens overlay
overlay: fixed inset-0 z-90, bg rgba(7,7,7,.6) + backdrop-blur-md, fade .3s
panel:  centred, max-w, glass (bg-white/5, blur, 1px white/10 border, glow shadow)
close:  top-right button + Escape + backdrop click
```
**Must:** lock body scroll on open (`document.body.style.overflow='hidden'`) and
**restore it on close AND on unmount** (the classic leak). Trap focus inside the
panel; return focus to the trigger on close. `aria-modal="true"`, `role="dialog"`,
labelled by the panel title. Content example (menu): categorised lists with
**dashed leader lines** connecting item → price
(`flex-1 border-b border-dashed border-white/20` between name and price).
Reduced motion: no fade, instant show/hide.

---

## A28 · editorial gallery — asymmetric / masonry grid
A dense, magazine-style image grid (BASILICO gallery). Not equal cards — varied
spans create rhythm.
```css
.gallery{ display:grid; grid-template-columns:repeat(12,1fr); gap:clamp(8px,1vw,16px) }
.gallery img{ width:100%; height:100%; object-fit:cover; border-radius:14px }
/* varied spans, fixed pattern (never random across loads): */
.g1{ grid-column:span 7; grid-row:span 2 } .g2{ grid-column:span 5 }
.g3{ grid-column:span 5 } .g4{ grid-column:span 4 } .g5{ grid-column:span 8 } /* … */
```
Each image reveals with a `clip-path` wipe + slight scale as it enters
(IntersectionObserver, stagger 80ms). Hover: scale 1.03, sibling images dim to
`.7` (spotlight the hovered one). Click → A27 lightbox. Mobile: collapse to
2 columns, equal spans. Fixed span pattern — never randomise, or it can't be
screenshotted/reviewed.

---

## A29 · availability / status card — the "open for work" glass panel
A small glassmorphism card (portfolio hero corner, or contact) showing live
status. From the portfolio reference.
```
glass card: bg var(--glass), backdrop-blur(16px), 1px var(--glass-line),
  radius 16px, padding 1.5rem 2rem, max-width 320px, shadow 0 20px 40px rgba(0,0,0,.4)
row: [pulse-dot (I14)] + "Available for new projects" + optional "Avg reply: 2h"
```
Use for: portfolios ("available for work"), agencies ("taking Q3 clients"),
services ("open now / hours"). One per page. The green pulse means *live* — keep
it green in any preset. Pair with a real contact CTA; a status with no action is
decoration.

---

## A30 · alternating dark/light marketing rhythm
For conventional premium landing pages (NORTHLINE real-estate reference): a long
page that **alternates dark and light sections** to create rhythm — hero (dark) →
features → trusted-by (light) → about (dark) → services (light) → showcase (dark)
→ insights (light) → CTA (dark) → footer (dark). Each section owns its ground:
```
dark  section: bg var(--void)/#0B0E14, text light
light section: bg #fff / #f9fafb, text dark
```
Rules: **the alternation is the design** — two same-tone sections in a row feel
flat. Kickers are uppercase tracked accent (`tracking-widest`), one accent colour
throughout. Entrances: each section `whileInView` (engine reveal, `once:true`,
`-50px` margin), lists stagger `delay:index*0.1`. **Glass-overlap trick:** a
feature grid can overlap the hero with `margin-top:-6rem; z-index:20` +
`backdrop-blur` for depth. Images zoom `scale-105 duration-700` on group hover;
dark overlays fade out on hover; button arrows translate-x on hover.

This is the least "3D" archetype — it is a polished conventional landing. Use it
when the brief wants *premium marketing site* more than *cinematic experience*.
A WebGL scene is optional here (a hero video or image is usually enough).

---

## A31 · pinned collection swapper — one pinned section, N products
A single section that **pins** while scroll cycles through N collections/products
in place (Maison Horlogerie watches). Different from A26 (which slides a row
sideways) and A25 (separate full-screen panels): here ONE frame stays put and its
contents cross-swap, with the background colour morphing per item.

```
section.rig.swap  --len: <N*300>px           (pin length; N products)
└─ div.stage (sticky)
   ├─ div.bg-morph          (fixed-behind colour that lerps per active index)
   ├─ div.left   number · name (serif) · headline · button   ← cross-fades
   ├─ img.center product (up to 90% height)                   ← drops in y:100%→0
   └─ div.right  description · 2×2 spec grid                   ← cross-fades
```
```js
const idx = Math.min(N - 1, Math.floor(smoothstep(0, len, s) * N));
if (idx !== active) { active = idx; render(idx); }   // ref-guard: swap only on change, not every px
// background morph: lerp the three stops of WORLDS[idx] toward the next
bg.style.background = COLLECTIONS[idx].gradient;
```
Swap the left/center/right blocks with a cross-fade (`AnimatePresence mode="wait"`
in React, or opacity+`y` in the engine). Centre product enters `y:100%,opacity:0`
→ settled. **Guard the index change behind a ref** or React re-renders every
pixel and janks. Specs as a 2×2 grid (Movement · Power · Case · Water-resist for
watches; adapt per product). Floating particle SVGs per collection optional.

Mobile: unpin — stack image over text, one collection per screen, normal scroll.
Reduced motion: show collection 0, arrows/dots to switch, no auto-morph.

Use for: watch/jewellery collections, car trims, product ranges, plan tiers with
big visuals. 3–5 items; beyond that use A26.

---

## A32 · glass service cards — video-on-hover, content inverts
A grid of glassmorphism cards where each card, on hover, reveals a looping video
background, a gradient wash, floats its icon, and **inverts its text to white**
(the light-glass services section reference).

```
grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3, gap-6 lg:gap-8
first cell = intro (title + explore button); rest = service cards
```
Card = `.glass-panel`: `background:rgba(255,255,255,.5); backdrop-filter:blur(20px);
border:1px solid rgba(255,255,255,.9); box-shadow:0 10px 30px rgba(0,0,0,.05);
rounded-3xl p-8`. On hover:
```
video (absolute inset-0, object-cover, -z-20, muted loop playsinline preload=none),
  opacity 0 → 100 over 700ms; JS: onmouseenter → currentTime=0; play(); onmouseleave → pause()
gradient wash (-z-10): from-accent/90 via-accent-2/90 to-accent/90, opacity 0 → .8, animate bg-position
panel: translateY -5px, border→white, shadow intensifies to accent-tinted
text: title/desc/link → white (inversion for legibility over the video)
icon: scale 1.1, bg→white/25, and floats (translateY 0→-5px, 1.5s ease infinite)
```
Every text node needs `position:relative; z-index:1` to sit above the video/wash.
`preload="none"` on the videos or N cards each fetch a clip on load — big waste.
Mobile / `(hover:none)`: no video (never autoplay N clips on a phone), keep the
glass + static gradient. Reduced motion: no float, no video, static card.

---

## A33 · layer swapper — each part its own full hero, one per scroll (RELIABLE)
The dependable way to do "reveal every layer as I scroll" when you can't get
clean aligned transparent layers (i.e. almost always with generated assets).
Instead of stacking, each layer is its **own full hero image** and they **swap**
as you scroll — exactly the CHÂTEAU/collection feel, applied to one product's parts.

### Assets
One **isolated hero image per part** (bun, patty, bacon, …), each the full object
centred on a plain/transparent ground. Generate them independently — alignment
does NOT matter because only one shows at a time. Downscale to ~1200px WebP.

### DOM & math
```
section.rig.swap  style="--len: <N*120>vh"   (pinned; N = parts)
└─ div.stage (sticky top-0 h-[100svh] flex-col)
   ├─ intro (softens, stays)
   ├─ arena (flex-1, relative) → N <img> stacked centred, only active shown
   ├─ callout card (Layer i/N · name · note) — updates live
   └─ step dots
```
```js
const pin = rig.offsetHeight - innerHeight;      // real pin range
const p = clamp((-rect.top) / pin);              // 0..1
const active = Math.min(N-1, Math.floor(p * N * 0.999));
// per image: active = opacity 1, translateY 0, scale 1;
//   later = opacity 0, translateY +48, scale .94;  earlier = opacity 0, translateY -48, scale .94
// transition: opacity .5s + transform .6s cubic-bezier(.22,1,.36,1)  → crossfade + rise
```
Each part enters at **full opacity**, big (`max-h:62vh`), centred, with a
crossfade+rise. Callout and step-dots change with `active`.

### Rules
- Ground: put the section on a warm/tinted band that matches the image ground so
  each hero blends; edge-mask the images (A24 lesson 5) so no square shows.
- `overflow-x:clip` on ancestors, real-pin progress (A24 lessons 1 & 4).
- Reduced motion: show one representative part, no swap.
- Verify in a real browser at each step — this is the archetype most likely to
  look wrong from code alone.

This is the **recommended** answer to "each separate layer, full-size, one per
scroll." Use A24 (true stack) only when you have genuinely aligned transparent
layers; otherwise A33.

---

## A34 · GLB product viewer — drag-to-spin real 3D model
A rotatable 3D product with hotspots (sneaker, watch, gadget, bottle, car). Full
build in `advanced-3d.md § Part A`. Use `<model-viewer>` (one script) unless you
need custom shader materials on the mesh.
```
section (h-screen or tall): left = copy (name, spec, CTA); right = <model-viewer>
  camera-controls · auto-rotate · poster · touch-action:pan-y · hotspots via slot="hotspot-*"
```
Scroll can drive `mv.cameraOrbit`. Asset ladder: user's .glb → Higgsfield
`generate_3d` from a product photo → else fall back to A23 bleed photo. One viewer
per page; poster while it loads; reduced-motion stops auto-rotate; no-WebGL shows
the poster. Niches: footwear, watches, jewellery, gadgets, automotive, furniture,
hardware, cosmetics.

---

## A35 · shader hero — liquid / fog / ripple field
A full-bleed animated GLSL surface behind the hero copy. Full build in
`advanced-3d.md § Part B`. One fullscreen quad + fragment shader, two palette
colours, cursor ripple.
```
canvas z0 (shader, pointer-events:none) → grain → legibility scrim → hero copy
```
Perf-capped (octaves/DPR by the quality ladder), reduced-motion freezes it,
no-WebGL falls back to the I19 aurora CSS gradient. Keep it to the palette's two
colours. Niches: creative/agency, music, crypto/web3, launches, beauty, anything
wanting a fluid generative feel. **Most GPU-hungry archetype — one per page, opt-in.**

---


## Composition rules

- One archetype per screen. Never two side by side.
- Max **one** sticky-rail per page — a second one reads as a gimmick.
- Between any two acts, one full viewport of `--void` breathing room.
- Every act gets a `data-reveal` group; nothing appears without motivation.
- If a section would end up a 3-across card grid, you picked the wrong archetype.
- A13 single-viewport excludes every scroll archetype — it is the whole page.
- A14 spotlight and A1 hero are alternatives, never stacked.
- Max one badge (A15), one arc-stat cluster, one spotlight per site.
- A16 masked-mosaic replaces A1/A14 as the hero — never combine them.
- A18 sequential sections and the `seg()` overlap model are mutually exclusive.
- One video technique per page (`video.md`); never stack V2 and V4.
- A20's three overlays are a ceiling, not a target.
- A21 is the only archetype that may contain a form.
- A34 (GLB) and A35 (shader) are opt-in top-end; one WebGL context per page —
  never a GLB viewer AND a shader hero AND a procedural scene together.
- For "reveal each layer as I scroll": prefer **A33 swapper** unless you have
  truly aligned transparent layers (then A24). Never fake it by clip-path-
  slicing one flat photo.
- A25 snap-worlds and the sticky-rig scroll model are mutually exclusive per page.
- Max one A26 horizontal-pin per page (two traps the user sideways).
- A27 modal must restore body scroll on close AND unmount.
- A23 sits at `z-index:0`, always behind the type. One bleed object per page.
- A22's rotating panel pauses on hover/focus and stops under reduced motion.
- In a mosaic build (A16/A17) every section shares the layout language; one
  section using ordinary padded blocks breaks the whole illusion.
