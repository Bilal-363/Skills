# Spec template

Fill every section. Show it to the user and get one approval before coding.
Mark authored defaults `‹authored — confirm›`; mark supplied values as given.

Open with this line verbatim:
> **Reproduce all values verbatim. They are not approximations.**

---

## 1 · IDENTITY
Brand · niche · art-direction preset (P1–P5) · scene primitives · one-line positioning.
Contact facts: phone, email, address, hours, socials. `‹authored›` where invented.

| page | file | `<title>` | `<meta description>` |
|---|---|---|---|

Head on every page: `<html lang>`, charset, viewport, `<link rel=icon>`, canonical, OG tags.

## 2 · ASSETS

Every spec is authored **asset-optional**: each visual has a procedural
fallback, so the page is always complete. Emit this section in two parts.

### 2a · Asset table (fonts, embeds, and any known URLs)
| role | URL / source | notes |
|---|---|---|

Fonts (Google Fonts link), Three.js importmap, third-party embeds. List any
user-supplied URLs verbatim. Leave photo/video rows as `‹resolved at build —
see 2b›` unless the URL is already known.

### 2b · Asset-acquisition ladder (the running agent executes this)
Copy this block into every spec verbatim, adjusting only the shot list and the
niche subject clause. It defers the image/video decision to build time, so the
same prompt works whether or not a generator is connected.

> Walk top to bottom, **stop at the first rung that succeeds for each shot**.
>
> **Rung 1 — user URLs.** In the brief → use verbatim, done.
> **Rung 2 — a generation tool is connected.** Detect any image/video
> capability this session (Higgsfield `generate_image`/`generate_video`, or any
> equivalent). If present: build the shot list, **preflight the cost and report
> it before spending**, generate the still first and pass it as a video's
> `start_image`, **Read each result** before wiring it, drop URLs into 2a.
> **Rung 3 — free-licence stock.** No generator but the niche needs a real
> photograph → hotlink Unsplash/Pexels with size pinned + credit comment.
> Never scrape Google Images or `placehold.co`/`picsum`.
> **Rung 4 — build it in code.** Nothing above, *or* the niche has nothing to
> photograph (software, AI, finance, legal) → the procedural system in §6.
> Not a downgrade; for abstract products it wins.
>
> Decide **per shot, not per project** — a page may mix rungs. First ask: does
> this composition need a photograph, or does it need space? A11/A13/A21 are
> better empty.

**Shot list** (only consulted if Rung 2 or 3 is reached) — a table of
`need → shot → procedural fallback`.

### 2c · Generation prompts (REQUIRED — write them out in full)
Emit **2–3 image prompts + one 4-second video prompt**, each a complete,
paste-ready string with this build's palette hexes and niche subject already
filled in — never a template with blanks. Use the exact shape and worked example
in `assets.md § Embedded generation prompts`. A connected engine runs them
automatically; an unconnected one ignores the block and uses §6. This block is
what makes the master prompt self-generating.

## 3 · TOKENS
The full `:root` block, verbatim, palette taken from the chosen preset.
Then the type-scale table: role · size · line-height · weight · family · tracking.

## 4 · UNIT SYSTEM
Reference canvas `1512 × 1024`. State the four rules: `--u` for fixed position,
`--h` for type, `--gutter` for horizontal, raw px for scroll timelines.
Include the portrait/tablet `--m` overrides.

## 5 · SHARED CHROME
- Brand mark: inline SVG with exact `viewBox` and path data. No image file.
- Header: grid, nav item list in order, `.is-stuck` behaviour, right slot.
- Mobile menu: burger geometry, overlay, stagger delays.
- Footer: column list with exact link labels, contact block, bottom rule.
- Grain + vignette.
- The stacking contract, as a numbered z-index list.

## 6 · 3D LAYER
Open with the one-line **Visual Signature** (scene(s) · accent hex · camera
motion · one signature move) — it must be unique to this build, never the same as
another spec. Then: renderer settings (colorspace, tone mapping, exposure, DPR
cap, no shadows), the chosen scene primitive(s) from the 36-scene menu **with
exact geometry, colours and motion spelled out in full** (not just a name),
lighting, bloom (or none).
**Camera keyframe table:**

| scroll px | position | target | fov | note |
|---|---|---|---|---|

The single-scalar bridge rule. The three-tier fallback. The perf budget.

## 7 · SCROLL ENGINE
State that `assets/engine.js` is copied verbatim, then list the per-page channel
writes with their exact formulas and `.toFixed` precision.

## 8 · PAGE-BY-PAGE
For each page:
- DOM tree, indented, **source order = paint order**, with aria labels
- Every string verbatim in a table
- The section archetypes used, in order, with their `--len` values
- The scroll math for each act, **written out in full** — the exact `smoothstep`/
  `seg` ranges, every per-element transform and CSS var formula, `.toFixed`
  precision, mobile values, and the reduced-motion fallback. Never "reveals on
  scroll" — always the numbers. A section a reader cannot build from the text
  alone is an incomplete spec.

## 9 · ENTRANCES
Keyframes + the load stagger table. Easing `cubic-bezier(.22, 1, .36, 1)`.

## 10 · BREAKPOINTS
Exact overrides at 1500 / 1100 / `max-aspect-ratio:11/10` / 600 tablet band /
430 / `prefers-reduced-motion`. Safe-area insets.

## 11 · ACCESSIBILITY & SEO
One h1 per page, skip link, focus rings, canvas `aria-hidden`, contrast targets,
JSON-LD types, sitemap + robots.

## 12 · ACCEPTANCE CRITERIA
Numbered, testable. Content first, then motion as an ordered scrub narrative
("scrubbing 0–620px must produce…"), then engineering. Copy the standing items
from `checklist.md` and add the site-specific ones.

## 12b · FACTS TO CONFIRM
Every `‹authored — confirm›` line and every invented-looking number, listed in
one block so the user can check them in one pass. Testimonials and staff names
appear here only if the user supplied them — otherwise the section is cut.

## 13 · BUILD ORDER
```
core.css tokens → chrome + footer → engine.js → gl.js + scene →
hero → sections in order → mobile pass → a11y pass → perf pass
```
State that each step will be reported as done.

---

## Voice rules for the spec itself
- Verbatim numbers, never "approximately".
- Tables over prose wherever there is more than one value.
- Every animated property is a CSS variable; JS writes only numbers.
- Include a BANNED list, restated from `SKILL.md`.
- No self-corrections in the finished document — edit them out.
