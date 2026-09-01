---
name: 3d-website
description: "Write a complete, measured MASTER BUILD PROMPT for a 3D / motion-driven website from a one-line brief. Asks a short intake (look, site type, motion, stack, assets), picks an art-direction preset, assembles section archetypes, and emits ONE paste-ready spec any agent can build from later. The spec embeds a run-time asset ladder with ready-to-run generation prompts (2-3 images + one 4-second video) written for the niche, so a connected engine auto-generates and an unconnected one falls back to code. Building the site is optional and only on request. Covers dark-cinematic, light/clean, warm, and corporate looks — not dark only. Use when the user asks for a 3D website, WebGL/Three.js landing page, cinematic scroll site, parallax scroll story, awwwards-style page, immersive hero, scroll-driven camera, cursor-reveal hero, or a 3D remake of an existing site."
---

# 3D Website — brief in, master prompt out

**The deliverable is a master build prompt** — one complete, measured, paste-ready
spec (Steps 1–4). Building the actual site is optional and happens **only if the
user asks** (Step 5+). By default you hand over the prompt and stop.

**Not a dark-cinematic-only skill.** Ten presets span dark cinematic, clinical
light, warm pastel, bold editorial, brass-on-navy, mono/HUD, neo-brutalist and
cream editorial. The **first**
intake question is the *look*, so the user picks the aesthetic — never assume dark.

The engine, unit system, scene library, interaction library, entrance system and
section archetypes are all pre-authored here. You supply only what is genuinely
site-specific — and you **ask for it** rather than guessing.

## When to apply

3D / WebGL / Three.js sites, cinematic scroll stories, parallax layer sites,
cursor-reveal heroes, single-viewport landing frames, scroll-driven camera pages,
"make it feel expensive" redesigns, or a rebuild of an existing site.

Skip for: ordinary CRUD UI, dashboards, admin panels, docs sites, or anything
where motion is not part of the brief.

---

## Step 1 — Intake (ask, don't guess)

**Read `references/intake.md` and run its Round 1 `AskUserQuestion` call.**
Four questions, **look first**: look · site type · motion · stack. Then Round 2
for whatever is still open (**camera motion** if the build has a 3D scene, assets,
headline, art direction, asset URLs, page list).
The look question is what keeps this from defaulting to dark cinematic — and its
options **must always include a light / white-page choice** (P7 ENAMEL), whatever
the niche. A Look question with only dark options is a bug.

Two rules:
- **Skip any question the user already answered.** Restate what you inferred.
- **Never ask about craft** — units, easing, z-order, ramp lengths, breakpoints,
  which scene primitive. Those are yours to decide.

If the user gave an existing site URL, extract its real copy first:
```bash
curl -sL -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/126.0 Safari/537.36" URL -o /tmp/site.html
grep -oE '<script[^>]*src="[^"]*"' /tmp/site.html          # SPA? copy is in the bundle
curl -sL -A "Mozilla/5.0 ..." URL/assets/index-HASH.js -o /tmp/site.js
grep -oE 'path:"[^"]*"' /tmp/site.js | sort -u                                # routes
grep -oE '"[A-Z][A-Za-z0-9 ,.\x27!?&:%/+-]{14,180}"' /tmp/site.js | sort -u   # copy
grep -oE '"h1",\{className:"[^"]*",children:(\[)?[^;]{0,420}' /tmp/site.js    # headings
```
Scraped copy is **verbatim law** — never reword it.

Close intake with the five-line restatement from `intake.md`.

## Step 2 — Art direction + a UNIQUE visual signature
`references/art-direction.md`. Pick ONE preset (P1–P10) by the look chosen in
intake. P1–P6 are dark; **P7 ENAMEL** (clinical white), **P8 ORCHARD** (warm pastel),
**P9 BRUTAL** (neo-brutalist) and **P10 ATELIER** (cream editorial) are light. The preset fixes the palette family, fonts and ramp lengths.

**Then make this build look unlike the last one.** Every 3D build must have its
own **Visual Signature** — do NOT default to NodeGraph/VoiceLattice/SignalGrid on
violet-black every time (that is the repeat users notice). From
`gl-scenes.md § Picking a distinct scene`:
1. Choose a **hero scene** from the **38-scene menu**. If the niche has a
   dedicated scene (21-37, e.g. ToothArch for dental, PulseLine for clinics,
   PlateSteam for food) that is almost always the hero. Otherwise use the
   feeling-based menu (1-20). Reach past the three overused defaults.
2. **Shift the accent hue** off the preset default so two dark builds don't share
   the same violet — teal / amber / magenta / lime / ice-blue / coral, keeping
   the structure (dark ground + one signal + one warm accent).
3. **Vary the camera path** from `gl-scenes.md § Motion is per-build` — push-in /
   orbit / fly-through / crane / dolly / rise, matched to the niche and never the
   same path as the previous build. The scene has its own signature motion; the
   camera path is authored fresh per build.
4. Record it as one line: `Visual Signature: <scene(s)> · <accent hex> · <camera
   motion> · <one signature move>`. **Two specs with the same signature is a bug.**

Do not blend presets. Do not invent a whole palette when a preset fits — but the
accent-hue shift and scene choice are what make each build distinct.

## Step 3 — Section set
`references/sections.md`. Assemble from archetypes A1–A35 — select and fill,
never design from zero.

| site type | shape |
|---|---|
| Scroll story | `A1 → A2 → A3 → A4 → A5 → A6 → A8 → A11` |
| Single viewport | `A13` alone (+ `A15` badge) |
| Spotlight / cursor-led | `A14` (+ `I7` arc stats) |
| Multi-page | scroll story home, `A10`/`A12` inner pages |
| Mosaic (light) | `A16` masked-mosaic inside `A17` seamless sections |
| Scroll-scrubbed video | `A18` sequential sections + `video.md` V2 |
| Video switcher | `A19` + `video.md` V4 |
| Retail / consumer | `A20` three-panel floor + `P8` word-pop |
| Auth / form page | `A21` + `responsive.md` R2 + `entrances.md` §5e |
| Product / D2C | `A23` bleed product + `A22` footer strip + `P8` |
| Reveal each layer on scroll (RELIABLE) | `A33` layer swapper — one full part hero at a time |
| Layered product (true aligned transparent layers only) | `A24` exploded assembly |
| Spinnable 3D product (drag/rotate + hotspots) | `A34` GLB via `advanced-3d.md` |
| Liquid / fluid / shader hero | `A35` GLSL via `advanced-3d.md` |
| Snap-panel worlds (per-section colour change) | `A25` — collections/moods, e.g. luxury chocolate |
| Horizontal pinned scroll | `A26` — portfolio / property / process reel |
| Full-screen modal (menu, gallery, detail) | `A27` |
| Editorial / masonry gallery | `A28` |
| Availability / status card | `A29` |
| Conventional premium landing | `A30` alternating dark/light rhythm (real estate, corporate) |
| Pinned collection swapper | `A31` — watch/car/jewellery ranges, one frame, N products |
| Glass service cards (video-on-hover) | `A32` — light glassmorphism services grid |

Then load only the reference files the chosen motion signature needs:
`interactions.md` for cursor work · `entrances.md` for load choreography ·
`video.md` for any video · `gl-scenes.md` for the 3D primitive ·
`stacks.md` if React, WordPress or a CMS embed was chosen (and
`wordpress.md` when it actually ships as WordPress).

## Step 4 — Write the master prompt (THE DELIVERABLE)
Fill `references/spec-template.md` completely and output it as one self-contained
master prompt. Say plainly which values were authored versus supplied.

The emitted prompt MUST include, in its §2b, **ready-to-run generation prompts
written for this exact niche**: 2–3 image prompts + one 4-second video prompt,
each a complete paste-ready string with this build's palette hexes. Written that
way, whoever runs the master prompt later gets automatic asset generation if any
engine is connected, and a clean code fallback if not. See `assets.md`
§ Embedded generation prompts.

**Every prompt must be BUILD-COMPLETE — no hand-waving.** The #1 failure is a
spec that names an effect without its numbers, so the built site "doesn't work
properly." For every animated section the emitted prompt MUST spell out, in full:
- the exact scroll math (the `smoothstep`/`seg` ranges, per-element transforms,
  the `.toFixed` precision) — copied out, not referenced by archetype name;
- every CSS custom property the section reads, with its formula;
- the mobile values AND the reduced-motion fallback for that section;
- for light builds: the shadow tokens and where each applies (light needs shadow
  for depth — see `art-direction.md § Light-mode depth`);
- for layered/product reveals: the per-layer offset, rotation, opacity and the
  assembled-hold range (see `sections.md` A24), plus the exact asset list.
A reader must be able to build the section from the prompt alone, with nothing
left to "design." If a value is a judgement call, write the number and mark it
tunable — never omit it.

**Then stop and hand it over.** The prompt is the product — and what the user
learns from. Do **not** start building unless the user explicitly says "build it",
"make the site", or "code it now". If they do, continue to Step 5.

## Step 5 — Generate the assets  *(only if the user asked to build)*

Read `references/assets.md`. Assets are resolved by a **run-time ladder** — the
spec you emitted in Step 4 carries it (§2b), so the build adapts to whatever is
available in the session it runs in. Walk it per shot, stop at the first rung
that succeeds:

1. **User URLs** → use verbatim.
2. **A generation tool is connected** (Higgsfield, or any image/video tool
   exposed this session, and the user hasn't forbidden it) → build the shot
   list, **preflight the cost and report it before spending**, generate the
   still first and pass it as a video's `start_image`, **Read each result**
   before wiring it, drop URLs into the asset table.
3. **Free-licence stock** (Unsplash/Pexels, size pinned, credited) → when the
   niche needs a real photograph and no generator is available.
4. **Build it in code** → the procedural system in `gl-scenes.md`. The default
   for abstract niches, and a real answer, not a degradation.

Detect, don't assume: if no generation tool is visible this session, or the
user said "no generation", skip Rung 2 silently and go to 3/4. Never announce a
tool you cannot see.

**Not every page needs a photograph.** Decide per composition. A11, A13 and A21
are always better with zero assets; A16 and A20 genuinely need real photographs.
Niches with nothing to photograph — software, consulting, legal, insurance —
look most expensive with type, space, grain and one procedural mark.

**The fallback ladder** (`assets.md`): user's URLs → generate with Higgsfield
→ free-licence stock hotlinked from Unsplash/Pexels with credit → build the
visual in code. **Never** grey placeholders, `placehold.co`, `picsum`, or
scraped Google Images — those break on hotlink and expose the client
commercially. Say so once and offer a real option instead.

## Step 6 — Build  *(only if the user asked to build)*
Copy `assets/core.css`, `assets/engine.js`, `assets/gl.js` and `assets/nav.js`
in unchanged — they are the frozen engine. Write the page against them.
`scenes.js` and `page.<name>.js` are written per project from `gl-scenes.md`
and the spec.

```
core.css tokens → chrome + footer → engine.js + nav.js → gl.js + scene →
hero → sections in order → mobile pass → a11y pass → perf pass → ship
```
Report each step as done.

## Step 7 — Verify and hand over  *(only if the user asked to build)*

Run every item in `references/checklist.md`. Report failures with the actual
output. Never claim a criterion passed without checking it.

Then hand over properly:
- Open the page (the `run` skill, or `python -m http.server`) and **look at it**
  at 1512×1024, 1280×720 and 390×844. Screenshot the first viewport.
- `sitemap.xml` + `robots.txt`, favicon, OG tags on every page.
- List every `‹authored — confirm›` line and every **Fact to confirm** in one
  block at the end, so the user knows exactly what to check.
- Say plainly what is static: forms have no backend, embeds are third-party.
- One line on deploying: any static host — drag the folder to Netlify, or
  `gh-pages`. No build step means no build config.

---

## Hard rules

**Architecture**
- Vanilla by default: static files, no framework, no bundler, no build step.
  React + Vite + TS + Tailwind only when chosen — see `stacks.md`.
- **WordPress / CMS:** always build the **Vanilla** output, then wrap it as a WP
  theme (`stacks.md` §3) or embed it (§3b). Never the React/Vite path for WP.
  When a build actually ships as WordPress, follow **`references/wordpress.md`**
  — the tested lifecycle (Docker dev, WP-CLI, engine-porting traps, static
  export, custom-domain deploy, handoff).
- Three.js from CDN via `<script type="importmap">`. Nothing else external
  except Google Fonts.
- **No animation library.** No GSAP, ScrollTrigger, Lenis, Locomotive, AOS.
  `assets/engine.js` is the whole engine. Framer Motion is allowed **only** when
  the user names it, and only for `AnimatePresence` exits, spring layout, and
  gestures — never for scroll, parallax, or staggers (`stacks.md` §2b).
- **No loaded 3D models.** All geometry procedural.
- **One rAF loop.** One WebGL context. On-demand rendering only.

**Units** — height-locked. `--u` = 1 design px of viewport height, `--h` = type
unit. Fixed positions use `--u`, type uses `--h`, gutters use `--gutter`, scroll
timelines use **raw px**, never vh. Height breakpoints matter as much as width.

**Motion** — the only bridge between DOM and WebGL is one scalar. `engine.js`
owns `smoothScroll`; `gl.js` reads it and nothing else. CSS holds every
`transform`; JS writes only numbers into variables.

**Never blank** (`entrances.md` §4) — on a light build the anti-flash colour
inverts to white.
- `.appear` resting opacity is **1** — if animations never run, the page is
  still complete.
- Anti-flash-black: `!important` first rule, inline `<body style>`, then tokens.
- Reserve space for every image and embed. CLS < 0.1.
- Poster before video; `<source>` attached after `window.load`.
- Content colour over video is verified at **every** breakpoint — the crop
  changes, so the same text sits on light and dark regions (`video.md`).

**Engineering traps (learned the hard way)**
- **Never `overflow-x:hidden` on any ancestor of a sticky rig** — it kills
  `position:sticky` and the scroll stage shows blank. Use `overflow-x:clip`.
- Tie scroll progress to the real pin range (`rig.offsetHeight − innerHeight`),
  never a guessed pixel length, or the end state lands off-screen.
- Generated square heroes on a coloured ground: edge-mask them
  (`mask-image:radial-gradient(...)`) or generate transparent — no visible box.
- **Downscale generated images to ~1200px WebP** before shipping (a 2048² PNG
  is ~7MB; the WebP ~90KB). Never ship multi-MB hero images.
- For a layered-product reveal, prefer the **A33 swapper** over A24 unless the
  layers are truly aligned transparents; never clip-path-slice one flat photo.

**Banned, every time**
- Generic card-grid template layout as the primary composition — bordered
  boxes in a 3-across row. (A16 masked-mosaic is **not** this: it is one
  image cut into windows, and it is allowed and encouraged.)
- Glowing orbs, blurred blob gradients, mesh-gradient wallpaper **as a main
  visual** — the generic-AI tell. (Sole exception: faint ambient light orbs
  BEHIND a light-glassmorphism section, `interactions.md` I16.)
- Emoji. Stock illustration. Lorem. Invented copy where real copy exists.
- Gradient text fills on headings — solid accent + a drawn underline instead.
- A `<canvas>` that captures pointer events.
- `outline: none` without a replacement focus ring.
- Re-animating a reveal on scroll back up.

**Copy** — when you author a word, `copy.md` governs it. No colons in an H1.
No *Unlock / Elevate / Transform / Seamless / Discover*. Never invent a
verifiable fact — years, counts, prices, ratings, awards — and never generate
a fake testimonial or `AggregateRating` schema.

**Composition** — the first viewport is ONE composition: brand + nav + one H1 +
one sub + one CTA pair + the visual. No stat strips, chips, or secondary blocks
above the fold.

**Three tiers ship every time**
1. Full WebGL / full motion.
2. `html.no-gl` — CSS-only layered parallax, must look *intentional*.
3. `prefers-reduced-motion: reduce` — static, readable, all content reachable.

The quality ladder in `gl.js` moves between tiers automatically. Never ship
tier 1 alone.

---

## Companion skills

Two installed skills cover ground this one deliberately does not. **Query them;
do not duplicate them here.**

### `ui-ux-pro-max` — queryable design database
Use it at three specific moments:

| moment | query |
|---|---|
| the niche maps to no preset | `--domain color "<niche> <mood>"` and `--domain typography "<mood>"` |
| you need a landing section order | `--domain landing "<pattern keywords>"` |
| a11y / contrast / touch verification | `--domain ux "accessibility contrast touch"` |
| Three.js stack rules | `--domain stack "threejs"` |

```bash
# resolve <SKILLS_DIR> to this machine's Claude skills folder
# (usually ~/.claude/skills — the same dir this skill lives in)
python "<SKILLS_DIR>/ui-ux-pro-max/scripts/search.py" "<query>" --domain <domain>
```
**Its GSAP motion presets do not apply here** — this skill has no animation
library. Read them for the *durations and easings*, then implement in the engine.
An art-direction preset from `art-direction.md` always wins over a database
palette; only query when no preset fits.

### `ui-styling` — Tailwind + shadcn + offline fonts
- `references/tailwind-responsive.md` and `tailwind-customization.md` when the
  React/Tailwind stack is chosen (`stacks.md` §2).
- **`canvas-fonts/`** holds 30+ OFL-licensed TTFs on disk (Bricolage Grotesque,
  Big Shoulders, Gloock, Crimson Pro, Geist Mono, IBM Plex, Erica One,
  Boldonse…). These are the **offline font fallback** when Google Fonts is
  blocked or the page must work with no network — self-host with `@font-face`
  and keep the same stack shape.

Neither skill overrides this one's Hard rules. Where they conflict — card grids,
animation libraries, shadow usage — this skill's rules stand.

---

## Reference files — read on demand, not upfront

| file | read when |
|---|---|
| `references/intake.md` | **Step 1 — always** |
| `references/copy.md` | **whenever you author a word** — H1 formulas, voice, SEO, schema |
| `references/art-direction.md` | Step 2 — palette, fonts, scene, ramps |
| `references/sections.md` | Step 3 — archetypes A1–A35 |
| `references/interactions.md` | cursor spotlight, Ken Burns, grid parallax, shine, arc stats, liquid glass, **custom cursor, 3D tilt, watermark type, count-up** |
| `references/entrances.md` | load choreography, `.appear` system, never-blank rules |
| `references/assets.md` | **Step 5 — shot lists, prompt recipes, per-niche subjects** |
| `references/video.md` | any video: plate, scroll-scrub, pointer-scrub, switcher |
| `references/responsive.md` | scale-the-interior, 3-mode JS layout, `clearInline()` |
| `references/gl-scenes.md` | the chosen 3D primitive |
| `references/advanced-3d.md` | **spinnable GLB product (model-viewer) & GLSL shader heroes** |
| `references/stacks.md` | React variant, **WordPress theme / CMS embed**, porting the engine |
| `references/wordpress.md` | **shipping as real WordPress** — Docker dev, WP-CLI bootstrap, theme structure, engine-porting traps, static export, custom-domain deploy, handoff |
| `references/spec-template.md` | Step 4 — writing the spec |
| `references/checklist.md` | Step 7 — verification |

`assets/` is copied verbatim, not read for guidance.

---

## Generated assets

See `references/assets.md`. Two rules that never bend: **preflight the credit
cost and report it before spending**, and **read every generated image before
you build around it**.
