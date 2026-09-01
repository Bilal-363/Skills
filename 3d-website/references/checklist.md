# Verification checklist

Run every item. Report failures with the actual output. Never mark an item
passed without checking it — a claimed pass that fails is worse than a
reported failure.

## Content
1. Every string from the spec appears verbatim — spelling, punctuation, casing.
2. Where copy was scraped from a live site, it is unchanged. Diff a sample.
3. Every nav and footer link resolves to a real file. No `#` placeholders.
4. One `<h1>` per page. Heading order never skips a level.
5. Third-party embeds load and function (booking, forms, chat).

## Motion
6. The hero exit reads as one gesture: H1 rises and fades while the sub sinks.
7. Each act's enter/exit ramps match the preset's motion-signature lengths.
8. Camera reaches every keyframe. Scrub slowly and confirm no snap or flip.
9. The sticky-rail's last panel is fully reachable — its `--len` is long enough.
10. Reveals fire once and never re-animate on scroll back up.
11. Pointer parallax is present but subtle. Nothing moves more than ~22px.
12. Scroll direction reversal mid-transition produces no jump or flicker.

## The three tiers
13. Tier 1 (full WebGL) renders correctly.
14. Tier 2 — force `html.no-gl` in devtools. The page must look **intentional**,
    not broken. Screenshot it and judge it as a design.
15. Tier 3 — emulate `prefers-reduced-motion: reduce`. Static, fully readable,
    every piece of content reachable, video paused.
16. The quality ladder actually steps down. Throttle CPU 6× and confirm DPR
    drops, then that tier 3 engages, and that it does not oscillate.

## Engineering
17. Zero console errors or warnings, every page, desktop and mobile widths.
18. **Idle CPU ≈ 0.** Profile 5 seconds with no input; the rAF loop must have
    stopped. A spinning idle loop is a build failure.
19. Draw calls ≤ 6 per frame on the primary page (`renderer.info.render.calls`).
20. ≥ 45fps at 1512×1024 on integrated graphics after the ladder settles.
21. No per-frame allocation in any `tick` — check the allocation timeline.
22. `dispose()` runs on `pagehide`; no detached WebGL contexts after navigation.
23. Hero video (if any) is not requested during first paint. Check the network
    trace, not the code.
24. No horizontal scroll at any width from 320px to 2560px.
25. Layout holds with fonts blocked and with images blocked.

## Accessibility
26. Full keyboard traversal reaches every interactive element in a sane order.
27. `:focus-visible` ring present everywhere; no bare `outline:none`.
28. `canvas` is `aria-hidden="true"` and `pointer-events:none`.
29. Body text contrast ≥ 4.5:1 against its actual backdrop — including over the
    image plate at its brightest scroll position, not just over flat `--void`.
30. Skip link works and is visible on focus.
31. Rotators have `aria-live="polite"` and pause on hover/focus.
32. Screen-reader pass: the page reads as a coherent document with the canvas
    contributing nothing.

## Scores
33. Lighthouse desktop, throttled: Performance ≥ 92, Accessibility 100,
    Best Practices 100, SEO ≥ 95.
34. First-load transfer ≤ 780KB including Three.js and both font families,
    excluding any hero video.
35. CLS < 0.1. Reserve space for every embed and image.

## Intake & interactions
36. Nothing the user explicitly stated was overridden by a preset default.
37. Every authored default is labelled `‹authored — confirm›` in the spec.
38. Cursor spotlight (I1): six-plus gradient stops, lerp 0.1, starts off-screen,
    disabled on `(hover:none)` and under reduced motion. No second rAF loop.
39. Arc stats (I7): `transform-box: fill-box` present on every animated SVG node,
    both ends of each arc gradient fade to 0, `--len` matches `r × Δθ`.
40. Shine sweeps do not fire on touch devices.
41. Pointer travel within budget: layers ≤ 22px, grid ≤ 16px, camera ≤ 0.42u.

## Light-mode & mosaic (P7 / A16 / A17)
42. Anti-flash colour is **white**, not black.
43. Card text checked in BOTH crops — white on mobile, black on desktop, per card.
44. Masked mosaic: cards show genuinely different windows, not the same crop.
    Resize the window and confirm the mosaic re-solves.
45. `backgroundSize: auto {sh}px` everywhere — no `cover` on a masked card.
46. Every flex child in a mosaic section has `min-h-0`; nothing overflows at
    1280×720 or 1920×1080.
47. Mobile cards have explicit `min-h-*`; no zero-height cards when the grid
    switches to auto rows.
48. Mosaic re-measures after `document.fonts.ready`.
49. No shadows or glows anywhere on the light build.

## Never-blank
50. Disable JS entirely — the page still renders complete and readable.
51. Block CSS animations — every `.appear` is visible (resting opacity 1).
52. Hard-refresh on a throttled connection: **no white flash** at any point.
53. The two-frame `getAnimations()` fallback fires when animations are blocked.
54. Single-viewport builds (A13) do not clip at 1440×720 or 1280×800.

## Video (video.md)
55. Exactly one video technique on the page.
56. Every video is `muted` + `playsinline`; none has `controls`.
57. Network trace: no video bytes requested during first paint.
58. Content colour over video verified at EVERY breakpoint, not just desktop.
59. V2 frame bank: every `VideoFrame` is `.close()`d; watchdog reverts to
    seeking; software-decode retry present; page still works with
    `VideoDecoder` deleted from `window`.
60. V2: smoothing uses `1 - exp(-dt * TAU)`, not a fixed lerp factor.
61. V4 switcher: rapid clicking never leaves two clips part-faded.
62. Reduced motion: V1 paused on poster, V2 snaps, V3 off, V4 frozen.

## Glass
63. Three glass fills and three blurs site-wide - no fourth value.
64. At most ~6 `backdrop-filter` elements on screen; none animated; none nested.
65. Liquid-glass edge renders in Safari (`-webkit-mask-composite: xor` present
    alongside `mask-composite: exclude`).

## Generated assets
66. Credit cost was preflighted and reported to the user before spending.
67. Every generated image was actually Read before being built around.
68. Hero poster and hero video are the same shot — no visible handoff.
69. Spotlight pairs are the same subject in two grades, not two subjects.
70. Negative space landed where the layout needs it; the headline is not
    sitting on visual noise.
71. No text, logos, or watermarks in any generated image.

## Assets & fallback
72. No placeholder services anywhere - no `placehold.co`, `picsum`, `unsplash`
    hotlinks, or grey boxes. Grep the source to be sure.
73. If nothing could be generated, the page uses a real zero-asset technique
    and looks intentional - screenshot it and judge it as a design.
74. No recognisable faces in any generated image.

## Responsive engine (responsive.md)
75. One engine per build; they are not mixed.
76. R2/R3: `clearInline()` runs on every mode change. Rotate a tablet back and
    forth five times - the layout must be correct without a reload.
77. Layout re-runs after `document.fonts.ready`.
78. Inputs are 16px on phone; iOS does not zoom on focus.
79. `100svh` used, not `100vh`. Safe-area insets on every edge element.
80. Deliberate asymmetries from the spec were reproduced, not rounded.

## Entrance (entrances.md 5e)
81. `entry-pending` guard is in `<head>` BEFORE the stylesheet, with the
    3500ms safety release.
82. JS disabled - the full page renders statically. No `<noscript>` needed.
83. Animations are `cancel()`ed on finish; no `fill:'both'` residue latched.
84. The entrance plays once on load and never again on resize.
85. Hero media is excluded from the entrance - it is the stage.

## Asset policy
86. The zero-asset question was actually asked: does this composition need a
    photograph, or does it need space?
87. No scraped or hotlinked images from sources that forbid it. Only the user's
    own, generated, or Unsplash/Pexels CDN URLs with a credit comment.
88. Every hotlinked stock URL pins size and quality, and still renders if the
    remote host is slow (reserved space, no CLS).

## Rotating & bleed elements
89. A22 rotating panel pauses on hover and on focus; reduced motion stops it on
    card 1 with the bars still operable.
90. Inactive rotator cards are absolutely positioned - the panel height never
    jumps between cards.
91. A23 bleed object is at `z-index:0`, behind the headline, and is a cut-out
    with transparency - not a rectangular photo.
92. At 2560px and at 360px the bleed object still reads as intentional, not
    as an overflow bug. Check both ends.

## Copy (copy.md)
93. No colon in any H1. No banned opener anywhere on the page.
94. Every authored line is flagged, and all of them are listed together under
    Facts to confirm.
95. No invented verifiable facts - years, counts, prices, ratings, awards.
96. No fabricated testimonials, staff names, or case studies.
97. No `AggregateRating` / `Review` schema for ratings the user did not supply.
98. `<title>` 50-60 chars, `<meta description>` 140-160, neither the H1 verbatim.
99. JSON-LD emitted from the same source array as the visible copy.
100. The page was read aloud top to bottom and the wincing lines were cut.

## Handover
101. The page was actually opened and looked at - at 1512x1024, 1280x720
     and 390x844 - not just built.
102. sitemap.xml, robots.txt, favicon, OG tags present.
103. What is static was stated plainly: forms have no backend.

## Master prompt (the deliverable)
104. The output is ONE self-contained, paste-ready master prompt — not a built site (unless the user asked to build).
105. The look was chosen by the user in intake, not assumed dark cinematic.
106. §2b carries the run-time asset ladder verbatim.
107. §2c contains 2–3 full image prompts + one 4s silent-loop video prompt, palette hexes filled in, no blanks.
108. VID-1 first frame matches IMG-1 (poster rule stated).
109. Every authored value is flagged; the restatement was shown before writing.

## Luxury / advanced techniques
110. A25 snap-worlds: background swaps per active panel; nav+text colour flips light/dark per world.
111. A26 horizontal pin: never traps vertical scroll on touch — collapses to a swipe row on mobile.
112. A27 modal: body scroll locked on open AND restored on close and unmount; focus trapped; Escape closes.
113. I9 custom cursor: disabled on touch/coarse pointer; native cursor never hidden there.
114. I10 3D tilt: ±15deg max, disabled under reduced motion, one target per screen.
115. No GSAP / Lenis added — engine equivalents used (stacks.md 2b-i). Framer only if user named it.

## Aesthetic-specific
116. BRUTAL builds: shadows are SOLID offsets (no blur); tactile press shrinks the shadow; focus rings kept.
117. ATELIER builds: one serif-italic accent word in the headline; video playbackRate 0.7; left cream gradient over video.
118. Aurora (I19) / ambient orbs (I16): only as animated background BEHIND glass content, never a bare hero subject; aria-hidden; frozen under reduced motion.
119. Billing toggle (I17): role=switch, aria-checked updates, prices swap from data-attrs, reduced-motion instant.

## Per-niche variety (different result every time)
120. Two builds of DIFFERENT niches differ in at least THREE of: preset, hero
    scene, accent hue, camera path, section set. Same-looking output for a new
    niche is a bug — re-pick from the menus.
121. The niche's dedicated scene (gl-scenes 21-37) was used if one exists; the
    three overused defaults (NodeGraph/VoiceLattice/SignalGrid) were NOT the
    auto-pick.
122. The accent hue was shifted off the preset default so it does not match the
    previous build.
123. The Visual Signature line is unique to this build.

## Engineering traps
124. No `overflow-x:hidden` on any ancestor of a sticky rig (use clip). Sticky
    actually pins — verified by scrolling, not assumed.
125. Scroll progress uses the real pin range; the finished state is reached while
    still pinned.
126. Generated square heroes are edge-masked or transparent — no visible rectangle.
127. All generated images downscaled to ~1200px WebP; no multi-MB heroes shipped.
128. Layer reveal uses A33 swapper (or A24 with real transparent layers) — never a
    clip-path slice of one flat photo; every layer stays full opacity.

## Advanced 3D (A34 GLB · A35 shader) — only if used
129. GLB viewer: one WebGL context only; poster shown while it loads; `touch-action:pan-y`
    so the model never traps page scroll; reduced-motion stops auto-rotate; no-WebGL shows the poster.
130. GLB hotspot coordinates came from the model-viewer Editor, not guessed.
131. GLB asset: user's .glb, else generate_3d (cost preflighted), else A23 photo fallback — never a fake sprite spin.
132. Shader hero: perf-capped (octaves + DPR by the low-power ladder), palette-only two-colour mix, pauses off-screen, reduced-motion freezes it, no-WebGL falls back to the I19 aurora gradient.
133. Never a GLB viewer AND a shader AND a procedural scene on one page — one WebGL context.

## WordPress / CMS (only if that stack was chosen)
134. Built from the Vanilla output (no Vite/bundler) — WP cannot run a build step.
135. `style.css` has the theme header; assets referenced via `get_template_directory_uri()`.
136. The page module is upgraded to `type="module"` via `script_loader_tag`, and the
    Three.js importmap is printed in `<head>` before it — modules actually load.
137. Full-viewport hero uses a Canvas (full-width) template so the theme header/footer
    doesn't wrap it; verified in a real WP install (LocalWP or wp-cli), not assumed.
138. Client-editable copy via ACF/theme settings only if the client will self-edit;
    otherwise a static template is fine — never leave lorem in either.

## Final judgement
139. Screenshot the first viewport at 1512×1024. Ask honestly: does it read as
    ONE composition, or as a template with a canvas behind it? If the latter,
    the fix is removing elements, not adding effects.
140. Confirm nothing from the BANNED list slipped in — card grids, orbs, blob
    gradients, emoji, gradient headline fills, `outline:none`.
