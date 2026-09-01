# Art direction presets

Pick **one** by niche. P1–P6 are dark; **P7 ENAMEL** (clinical white) and **P8 ORCHARD** (warm pastel)
are the light presets. Each fixes the palette, both fonts, the scene primitive,
and the motion signature. Do not blend presets. Do not invent a palette when one
of these fits — that is what makes output consistent instead of random.

Override only the palette block at the top of `assets/core.css`.

---

## P1 · VOID — AI / SaaS / infrastructure / dev tools / automation
Default when unsure. Dark void, violet signal, ember accent.

```css
--void:#05060a; --void-2:#090b12;
--ink:#f7f6fb; --muted:#9c9aae; --dim:#6a6880;
--accent:#8b5cf6; --accent-deep:#6d28d9; --accent-2:#f97316;
--accent-soft:rgba(139,92,246,.14);
--glass:rgba(247,246,251,.045); --glass-line:rgba(247,246,251,.12);
--pill:#f7f6fb; --pill-ink:#05060a;
```
Fonts `Instrument Serif` + `Manrope` · Scene `VoiceLattice` + `SignalGrid`
Motion: slow orbit right → rise → pull back. Restrained, almost still.
**Niches:** AI agents, dev tools, API/infra, cybersecurity, data platforms, automation agencies.

---

## P2 · KILN — architecture / interiors / construction / real estate / furniture
Warm concrete and clay. The only preset that is not near-black.

```css
--void:#100d0a; --void-2:#171310;
--ink:#f6efe4; --muted:#a99b88; --dim:#796d5e;
--accent:#c8622f; --accent-deep:#8f4420; --accent-2:#e0b57a;
--accent-soft:rgba(200,98,47,.16);
--glass:rgba(246,239,228,.05); --glass-line:rgba(246,239,228,.14);
--pill:#f6efe4; --pill-ink:#100d0a;
```
Fonts `Instrument Serif` + `Manrope` · Scene `MonolithRow` + `SignalGrid`
Motion: long horizontal dolly past the monoliths. Weighty, architectural.
**Niches:** architecture studios, interior design, property developers, contractors, furniture.

---

## P3 · CLINIC — health / medical / wellness / biotech / dental
Cold clean depth. Restraint reads as competence here — resist all glow.

```css
--void:#04090c; --void-2:#081117;
--ink:#f2f8fa; --muted:#93a6ae; --dim:#63757d;
--accent:#3ec7c1; --accent-deep:#1c8a86; --accent-2:#7fb4d4;
--accent-soft:rgba(62,199,193,.13);
--glass:rgba(242,248,250,.05); --glass-line:rgba(242,248,250,.13);
--pill:#f2f8fa; --pill-ink:#04090c;
```
Fonts `Instrument Serif` + `Manrope` · Scene `NodeGraph` + `CallStream`
Motion: gentle push-in, no orbit. Almost clinical stillness.
**Niches:** clinics, dental, wellness, biotech, labs, medical devices, insurance.

---

## P4 · TAPE — creative studio / agency / film / photo / music / portfolio
Monochrome with a single hot signal. Editorial, loud typography.

```css
--void:#070707; --void-2:#0d0d0d;
--ink:#fafafa; --muted:#9a9a9a; --dim:#5f5f5f;
--accent:#e8341f; --accent-deep:#a41f11; --accent-2:#fafafa;
--accent-soft:rgba(232,52,31,.14);
--glass:rgba(250,250,250,.05); --glass-line:rgba(250,250,250,.14);
--pill:#e8341f; --pill-ink:#fafafa;
```
Fonts `Instrument Serif` + `Manrope` · Scene `GlassSlab` + `MonolithRow`
Motion: hard cuts between keyframes (shorten the ramps to 120px), big scale jumps.
**Niches:** design studios, film/video production, photographers, music, personal portfolio,
web-build agencies, social-media agencies.

---

## P5 · VAULT — finance / legal / consulting / B2B enterprise / crypto
Deep navy, brass accent. Conservative, weighty, zero playfulness.

```css
--void:#060910; --void-2:#0b1018;
--ink:#f5f4f0; --muted:#9b9c9f; --dim:#696b70;
--accent:#c9a227; --accent-deep:#8f7118; --accent-2:#5b7db1;
--accent-soft:rgba(201,162,39,.13);
--glass:rgba(245,244,240,.045); --glass-line:rgba(245,244,240,.12);
--pill:#f5f4f0; --pill-ink:#060910;
```
Fonts `Instrument Serif` + `Manrope` · Scene `MonolithRow` + `GlassSlab`
Motion: minimal. Slow vertical rise only, no orbit, no scale.
**Niches:** law firms, accountancy, wealth management, consulting, fintech, crypto, insurance.

---

## P6 · CIRCUIT — cyberpunk / gaming / biotech / performance / motorsport
Hot red on near-black, monospace UI. The only preset with a mono body face.

```css
--void:#0a0506; --void-2:#120809;
--ink:#ffffff; --muted:#c9b6b8; --dim:#7d6b6d;
--accent:#ff2d3f; --accent-deep:#a80f1d; --accent-2:#ff8a3d;
--accent-soft:rgba(255,45,63,.15);
--glass:rgba(255,255,255,.05); --glass-line:rgba(255,255,255,.14);
--pill:#ffffff; --pill-ink:#0a0506;
```
Fonts `JetBrains Mono` 300–800 **for everything**, including headings —
```
https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,300..800;1,400..500&display=swap
```
Body wrapper carries `letter-spacing:-.02em`; H1 goes to `-.08em` — very tight
tracking is what separates this from generic mono.

Scene: no WebGL. Use `A14 spotlight hero` — two graded images, cursor mask,
SVG grid, arc stats. Motion: enter 240px / exit 220px, sharp.
**Niches:** gaming, esports, motorsport, performance hardware, biotech/augmentation,
crypto-native, anything that wants to feel like a HUD.

---

## P7 · ENAMEL — light mode. Clinics / wellness / hospitality / retail / consumer / food
A bright preset — and a **full design system, not "dark inverted."** Light pages
get depth in the opposite way to dark ones, so this preset carries its own rules
(see § Light-mode depth below). It ALWAYS takes an accent — an accent-less white
page is the "so simple / flat" failure mode. Pick the accent by niche.

```css
--void:#fbfaf7; --void-2:#ffffff;             /* warm off-white ground, white cards */
--ink:#141210; --muted:#5a544c; --dim:#9a948c; /* near-black ink, warm greys */
--line:rgba(20,18,16,.12); --line-2:rgba(20,18,16,.06);
--accent:#e8452a; --accent-deep:#c2371f; --accent-2:#f2a900;  /* REQUIRED — pick per niche */
--accent-soft:rgba(232,69,42,.10);
--glass:rgba(255,255,255,.62); --glass-line:rgba(20,18,16,.10);
--pill:#141210; --pill-ink:#fbfaf7;           /* dark pill on light */
/* light-mode depth tokens — NOT optional here */
--shadow-sm:0 2px 8px rgba(20,18,16,.06);
--shadow-md:0 12px 30px rgba(20,18,16,.10);
--shadow-lg:0 30px 70px rgba(20,18,16,.14);
--contact:0 24px 40px -20px rgba(20,18,16,.35);  /* the ground shadow under a product */
```
Accent by niche: food `#e8452a` (tomato) · clinic `#2f7d78` (teal) · wellness
`#7a8b5a` (sage) · beauty `#c98b8b` (rose) · finance `#1f6feb` (trust-blue) ·
kids `#f2a900` (mustard). **Never accent-less** — that is what reads as "empty."

Fonts: a warm display + a clean sans, NOT one austere geometric. Food/consumer →
`Fraunces` or `Bricolage Grotesque` (display) + `Inter`. Clinic/finance →
`Instrument Serif` or `Manrope` 700 (display) + `Inter`. Heavy display weights.

### Light-mode depth (the part that was missing)
On white you cannot lean on glow, bloom, fog or bright wireframes — they vanish.
Depth comes from **five** things, and a good light page uses several:
1. **Soft shadows are MANDATORY** — the token set above. A product with no
   contact shadow floats and looks fake. `--contact` under any hero object,
   `--shadow-md` on lifted cards. (Decorative *drop* shadows on flat panels still
   read cheap — the distinction is: shadow a *thing*, never a *box border*.)
2. **Real photography or a lifted product** carries the page — light pages are
   photo-led. Prefer generated/real imagery over WebGL here.
3. **Warm off-white ground (`#fbfaf7`), not pure `#fff`** — pure white is what
   makes a page feel unfinished. The faint warmth reads as intentional.
4. **One saturated accent** used sparingly — the CTA, one underline, one tag.
5. **Type scale contrast** — a very large display against small body. Tracking
   tight (`-.02em`), leading tight (`.95–1.05`) on the display.

### WebGL on light
Usually **skip heavy WebGL** — dark scenes wash out on white. Two light-safe
options: (a) **no canvas at all** — use layered PNG product images (A24) or the
masked-mosaic (A16); or (b) a **dark-stroke** scene only — Signal/DuneField/
HalftoneField rendered in `--ink` at low opacity as line art, never bright
wireframe, never bloom. `gl.js`: `bloom:0`, background transparent, materials in
`--ink`. If in doubt on a light build, drop WebGL and use A24 layered images —
it looks richer than a washed-out canvas.

Motion: enter 320px / exit 300px. **Niches:** clinics, wellness, hotels,
restaurants & **food**, retail & shops, consumer products, kids, portfolios that
want air.

---

## P8 · ORCHARD — soft consumer. Pets / kids / food / wellness retail / D2C
Light and warm, but not the clinical white of P7. Pastel ground, one deep
natural ink, one hot accent. The friendliest preset — and the only one where
playful motion (`word-pop`) is correct.

```css
--void:#effdf0; --void-2:#ffffff;          /* mint ground, white cards */
--ink:#1a3d1a; --muted:#4b5f4b; --dim:#8aa08a;
--line:rgba(26,61,26,.12); --line-2:rgba(26,61,26,.07);
--accent:#e86a10; --accent-deep:#d45e0d; --accent-2:#2a5a2a;
--accent-soft:rgba(232,106,16,.10);
--glass:rgba(255,255,255,.55); --glass-line:rgba(255,255,255,.75);
--pill:#1a3d1a; --pill-ink:#ffffff;
```
Fonts: `DM Serif Display` 400 for the hero heading **only**; `Inter` 400/500/600
for everything else.
```
https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@400;500;600&display=swap
```
Hero heading `clamp(60px, 7.5vw, 110px)`, `line-height:.95`, tracking tight,
one word per `inline-block` for `word-pop`.

**Rules that only apply here**
- Two accent colours coexist: orange for action, deep green for ink and
  secondary pills. Never a third.
- Cards are `rounded-2xl` on white, with real (soft) shadows — this is the one
  preset where shadow is allowed, because the ground is not white.
- Layout is `h-screen`, no scroll, with A20's three-panel image floor.
- Breakpoints are **show/hide**, not one composition resized: `hidden lg:flex`
  for desktop, a separate stacked block for mobile. Fighting one layout across
  three shapes costs more than writing two.
- Motion is bouncy: `cubic-bezier(.34,1.56,.64,1)`, overshoot allowed.

Scene: no WebGL. A20 floor + floating product/video cards.
Motion: enter 280px / exit 260px.
**Niches:** pet stores & grooming, children's brands, bakeries, food D2C,
toys, garden centres, wellness retail, anything that should feel warm.

---
## P9 · BRUTAL — neo-brutalism / claymorphism. Playful SaaS, kids, indie, fun brands
Thick black borders, **solid offset shadows (no blur)**, chunky rounded corners,
tactile press. Bright and friendly, the opposite of cinematic. A whole different
game — no WebGL, no glass, no gradients-as-depth; the *shadow* is the depth.

```css
--void:#f3efea; --void-2:#ffffff;             /* warm paper ground, white cards */
--ink:#000000; --muted:#3f3f3f; --dim:#6b6b6b;
--line:#000000; --line-2:rgba(0,0,0,.6);      /* borders are SOLID BLACK, 2-3px */
--accent:#ffe156; --accent-deep:#f1714e; --accent-2:#7ad0b0;  /* swap freely, high-chroma */
--accent-soft:rgba(255,225,86,.25);
--pill:#000000; --pill-ink:#ffffff;
/* brutalist shadow tokens — solid, no blur */
--brutal:8px 8px 0 0 #000; --brutal-sm:3px 3px 0 0 #000; --brutal-accent:10px 10px 0 0 var(--accent-deep);
```
Fonts: one rounded/chunky display for everything — `Fredoka`, `Bricolage
Grotesque`, or `Space Grotesk` 600–800. No serif, no thin weights.

**Rules unique to BRUTAL**
- Every card: `border:3px solid #000; border-radius:1.5–2.5rem; box-shadow:var(--brutal)`.
- **Tactile press** (`I18`): hover pushes the card down-right `translate(4px,4px)` and
  *reduces* the shadow to `4px 4px` — it looks physically pressed.
- Colour is loud: 2–3 high-chroma accents, swappable. Popular/featured item gets
  the `--brutal-accent` coloured shadow and sits raised (`-mt-6`).
- NO glass, NO blur, NO bloom, NO WebGL. The look is flat + shadow, deliberately.
- Icons can be emoji/twemoji SVGs here (the one preset where playful emoji-as-icon
  is on-brand) — via an icon CDN, never Unicode emoji in headings.
Scene: none. Entrance: `card-animate` fade-up + `cubic-bezier(.34,1.56,.64,1)`
overshoot, stagger 100/200/300ms.
**Niches:** playful SaaS, kids/education, indie makers, newsletters, communities,
fun D2C, anything that wants to feel friendly and tactile rather than luxe.

---

## P10 · ATELIER — warm cream editorial. Creative studios / agencies / fashion / craft
Warm cream ground, charcoal ink, one warm-orange accent, and a **serif-italic
emphasis word** in the headline (CreativaX / editorial studios). Light, but
refined and grown-up — where ORCHARD is playful, ATELIER is elegant.

```css
--void:#f5efe6; --void-2:#faf7f2;             /* primary cream, soft cream */
--ink:#161514; --muted:#635e59; --dim:#8f8880;
--line:#eadfcf; --line-2:rgba(22,21,20,.08);  /* border cream */
--accent:#de5d35; --accent-deep:#c24a26; --accent-2:#161514;  /* studio orange */
--accent-soft:rgba(222,93,53,.10);
--glass:rgba(255,255,255,.5); --glass-line:rgba(22,21,20,.10);
--pill:#161514; --pill-ink:#f5efe6;
```
Fonts: `Plus Jakarta Sans` (400–800, everything) + `Instrument Serif` **italic**
for the one emphasis word in the headline. Heavy display sizes.

**Rules unique to ATELIER**
- Headline is two lines: bold sans + a **serif-italic accent-orange word**
  ("Ideas That" / *"Inspire."*). That contrast is the whole identity.
- Video hero with **left-column cream gradient** (`from-void via-void/90 to-transparent`
  over the left ~42%) + top & bottom cream fades; the center-right of the video
  stays fully clear. Set `video.playbackRate = 0.7` for ambient slow motion.
- Category tag as a dotted-caps kicker (`• WE DESIGN • WE BRAND •`), orange, tracked.
- Social-proof avatar stack + "Trusted by 200+ …". Showreel modal (`A27`) on CTA.
- Soft shadows allowed (warm ground), not brutalist.
Scene: usually none (video-led); optional FlowRibbons in orange, very subtle.
**Niches:** creative studios, design/branding agencies, fashion, photographers,
craft/artisan makers, architecture-lite, boutique consultancies.

---


## Choosing when the niche fits nothing
Ask which of these ten feels closest — one question, four words each. Never
invent a sixth palette on the fly; if the user genuinely needs one, author it in
this file first so it is reusable.

## Font substitution
P1-P5 use the same pair; P6 uses JetBrains Mono alone. All from Google Fonts:
```html
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Manrope:wght@200..800&display=swap" rel="stylesheet">
```
Swap the display serif only if the user names a face. Body stays Manrope —
its variable range 200–800 is what the whole type scale is tuned against.

## Typographic devices

Reusable across presets. Each is one decision, not a system.

**Mixed serif-italic + sans headline** — line 1 in an italic display serif,
line 2 in the body sans at the same size. The contrast does the work that a
colour accent usually does, and it survives on a light or dark ground.
```
line 1 · Playfair Display / Instrument Serif, italic 400, letter-spacing -0.05em
line 2 · body sans, weight 400,               letter-spacing -0.08em, -mt-1
both   · same font-size, line-height 0.95
```
Per-line tracking is not a typo: the sans line needs more negative tracking than
the serif to look optically equal. Use for exactly one headline per site.

**Clamp-scaled hero word** — `clamp(3rem, 11vw, 11rem)` with
`line-height: .79`. The tight leading is what makes it read as a poster rather
than a heading.

**Stacked wordmark** — two lines, `font-extrabold uppercase tracking-tight
leading-none`, second line pulled up `-mt-1.5 md:-mt-2`, with an 8–9px
lowercase descriptor beneath. Works where a single-line logotype would be lost.

**Tabular numerals** — `font-variant-numeric: tabular-nums` on any counter,
price, or stat that changes. Without it the digits jitter as widths change.

---

## Motion signature — the ramp table
Each preset shapes scenes by how long its ramps are. Keep these consistent
within a build.

| preset | enter ramp | exit ramp | camera behaviour |
|---|---|---|---|
| P1 VOID | 380px | 360px | orbit + rise + pull back |
| P2 KILN | 460px | 420px | long lateral dolly |
| P3 CLINIC | 420px | 400px | straight push-in only |
| P4 TAPE | 120px | 140px | hard cuts, big scale deltas |
| P5 VAULT | 520px | 480px | vertical rise only |
| P6 CIRCUIT | 240px | 220px | no camera — pointer-driven only |
| P7 ENAMEL | 320px | 300px | no camera — mosaic + staggered reveal |
| P8 ORCHARD | 280px | 260px | no camera — word-pop + photo floor |
| P9 BRUTAL | 200px | 200px | no camera — tactile press, solid shadows |
| P10 ATELIER | 300px | 280px | no camera — video hero + serif-italic accent |
