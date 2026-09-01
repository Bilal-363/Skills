# Intake — the questions to ask

Ask with `AskUserQuestion`. **Round 1 always. Round 2 only for what Round 1 left
open.** Never more than two rounds — after that, author a default, label it
`‹authored — confirm›`, and keep moving.

If the user's opening message already answers a question, **do not ask it.**
Restate what you inferred instead.

---

## Round 1 — the look first, then the shape

**Lead with the look — never assume dark cinematic.** AskUserQuestion caps at 4
questions per call, so send **Look · Site type · Motion · Stack** in one call and
fold **Assets** into Round 2 (or swap it in if the user already stated one of the
four). Skip anything the opening message already answered.

### Q1 · header `Look` — the overall aesthetic (single-select)
Offer **4 options, and one of them is ALWAYS a light/white look.** Never present
a Look question that is all-dark — that is the mistake this question exists to
prevent. AskUserQuestion caps at 4, so pick the four that fit the niche, but the
light row is non-negotiable. Add `Other` (auto-added) for anything else.

| option | preset it points to | feel |
|---|---|---|
| **Dark cinematic** (default for tech/agency) | P1 VOID · P4 TAPE · P6 CIRCUIT | black stage, restrained, "expensive" |
| **Light & clean (white pages)** | P7 ENAMEL | bright white ground, black ink, calm — clinics, retail, portfolios that want air |
| **Warm & friendly** | P8 ORCHARD | pastel ground, playful — consumer, pets, food, kids |
| **Corporate & weighty** | P5 VAULT | navy + brass — finance, legal, B2B |
| **Playful / tactile** | P9 BRUTAL | thick borders + solid shadows — indie, kids, fun SaaS |
| **Warm editorial** | P10 ATELIER | cream + serif-italic accent — studios, agencies, fashion |

There are now more than four looks (P1–P10); pick the four most relevant to the niche **but always keep the light row.** For a
portfolio, offer Dark cinematic + Light & clean + Bold editorial (P4) + Corporate;
for a clinic, lead with Light & clean. The look narrows the preset;
`art-direction.md` finalises it by niche.

**The light look is a first-class path, not a fallback.** P7 ENAMEL is a
complete white-page design system (see `art-direction.md`) — every archetype,
the whole engine, and all fallback tiers work in light exactly as in dark; only
the palette and the anti-flash colour invert. If the user says "white",
"minimal", "clean", "light", or "Apple-like", take P7 without hesitation.

If the user names a different vibe (`Other`), map it to the nearest preset, or
author a new preset in `art-direction.md` first. **This skill is not dark-only.**

### Q2 · header `Site type` — what the page *is*
| option | meaning | → |
|---|---|---|
| **Scroll story** (recommended default) | one sticky stage, acts reveal as you scroll | rig pattern, `sections.md` A1–A11 |
| **Single viewport** | one locked frame, no scroll on desktop | `sections.md` A13, Vesper lock |
| **Multi-page** | 5–12 real pages sharing chrome | full spec, per-page camera tables |
| **Hybrid** | scroll-story home, simple inner pages | A1–A11 home, A10/A12 elsewhere |

### Q3 · header `Motion` — how it moves (**multiSelect: true**)
This is the *technique* — how the page animates. The *camera motion* (how the 3D
stage moves) is a separate question, Q6 below.
| option | meaning | → |
|---|---|---|
| **Reveals as I scroll** | plates wipe in, camera moves, acts enter/exit | `sections.md` A9, engine rigs |
| **Reacts to my cursor** | spotlight mask, parallax layers, magnetic hover | `interactions.md` I1–I5 |
| **Images change / swap** | two-image reveal, before-after, sequence | `interactions.md` I1, I6 |
| **One image, many windows** | shared-background card mosaic | `sections.md` A16, A17 |
| **Entrance choreography** | staggered load-in, masked lines, draw-on strokes | `entrances.md` |
| **Video drives the page** | scroll scrubs the clip frame by frame | `video.md` V2 + `sections.md` A18 |
| **Spin a 3D product** | drag-to-rotate real 3D model + hotspots | `advanced-3d.md` A / `sections.md` A34 |
| **Liquid / fluid / shader** | animated GLSL field, cursor ripple | `advanced-3d.md` B / `sections.md` A35 |

Default if skipped: reveals-as-I-scroll + entrance choreography.

### Q4 · header `Stack`
| option | → |
|---|---|
| **Vanilla static** (recommended) | HTML + CSS + ES modules, no build step |
| **React + Vite + TS + Tailwind** | `stacks.md` §2, single `App.tsx` |
| **WordPress** | Vanilla wrapped as an install-ready theme — `stacks.md` §3 |
| **Other CMS** (Webflow/Squarespace/Shopify) | Vanilla embed — `stacks.md` §3b |

### Q5 · header `Assets` — usually Round 2
The master prompt is asset-optional either way (it carries the run-time ladder),
so this rarely blocks. Ask it only if it changes the section set.
| option | → |
|---|---|
| **Auto (recommended)** | the emitted prompt generates if an engine is connected, else builds in code |
| **I have URLs** | ask for them in Round 2; they become verbatim law |
| **Procedural only** | force code, zero asset weight — best for abstract tech |
| **Reference site to copy** | scrape it — see `SKILL.md` Step 1 |

If they hand over a video, ask one follow-up: **is it background atmosphere,
or is it the content?** Atmosphere → `video.md` V1 plate. Content → V2
scroll-scrub, which changes the whole page architecture to a 500vh sticky track.

### Q6 · header `Camera` — how the 3D stage moves (Round 2, single-select)
Ask whenever the build has a 3D scene, so the camera path is the user's choice,
not a repeat of the last build. Offer the 4 that best fit the niche from the 18
paths in `gl-scenes.md § Motion is per-build` (C1–C18), recommended first. Every
path still ends on a pull-back (C7) at the final CTA.
| option (example set) | path | feel |
|---|---|---|
| **Push in slowly** (recommended for portfolios/products) | C1 | arrival, focus |
| **Orbit around it** | C2 | showcase, turn |
| **Fly through it** | C3 | journey, speed |
| **Stay still, let it drift** | C18 hero-lock | anchored, minimal |

Swap these for the niche: a spa gets **Sway (C10)**, film gets **Dolly-zoom (C8)**
or **Rack focus (C17)**, sports gets **Barrel-roll (C12)**, architecture gets
**Crane down (C4)** or **Tilt-up (C11)**, crypto/gaming gets **Spiral-in (C9)**.
If skipped, pick the path the niche points to and state it in the restatement.

---

## Round 2 — only the gaps, max four

Ask **only** what is still unknown. Common ones:

- **Headline** — `You write it` / `I'll paste mine`. If they choose the second,
  ask for H1 + sub + both button labels in one message.
- **Art direction** — only if the niche didn't map cleanly to a preset. Offer
  the closest three from `art-direction.md`, four words each, with `preview`
  showing the palette swatches.
- **Asset URLs** — collect image, video, font, and embed URLs in one go, each
  labelled by role.
- **Page list** — only for Multi-page when the user named neither pages nor a
  source site.
- **Brand colour** — only if they said they have one.

---

## What never becomes a question

Decide these yourself; they are craft, not preference:

unit system · z-index order · easing curves · ramp lengths · scroll timeline
length · which scene primitive · draw-call budget · breakpoint values · reveal
technique · focus-ring style · JSON-LD types · fallback tier behaviour

Asking about these reads as not knowing the job.

---

## Writing the questions

- One `header` of ≤ 12 chars per question.
- Put the recommended option **first** and suffix its label `(Recommended)`.
- Every `description` says what the choice *does to the build*, not what the
  words mean.
- Use `preview` only where seeing beats reading — palette swatches, an ASCII
  layout of scroll-story vs single-viewport. Never for plain preference.
- Never ask "is the plan ready?" or "shall I proceed?".

---

## After intake — the restatement

Before writing the spec, say back exactly five lines and nothing else:

```
Niche        · <niche>
Brand        · <name>  ‹authored›
Look         · <look choice> → <preset> — <accent hex>, <fonts>
Type         · <site type> · <n> pages
Motion       · <signatures>  ·  scene: <primitives>
```

Then write the **master prompt** (SKILL Step 4) and hand it over. Do not ask
again, and do not start building unless the user explicitly asks.
