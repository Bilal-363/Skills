# Responsive engines

Three ways to make a measured composition survive every screen. Pick one per
build and commit — mixing them produces layouts that only look right after a
reload.

| | engine | when |
|---|---|---|
| R1 | **Height-locked units** (`--u`/`--h`) | default; cinematic full-bleed pages |
| R2 | **Scale-the-interior** (JS transform) | dense fixed-pixel panels — forms, cards, dashboards |
| R3 | **Fluid clamp + show/hide** | content pages with genuinely different mobile layouts |

---

## R1 · Height-locked units — the default

Already in `assets/core.css`. `--u` = 1 design px of viewport height, `--h` =
the type blend. Everything is CSS; no JS layout pass. Use unless the composition
has more than ~15 fixed-pixel values that must hold their exact relationships.

---

## R2 · Scale-the-interior

For a panel whose interior is calibrated to the pixel — a login card, a pricing
panel, a form. Rather than making 40 values responsive, **author the interior
once at reference size and scale the whole thing**.

```js
const REF_W = 613, REF_H = 922, CONTENT_H = 697;   // reference panel + its content

function placeCard(paneW, vh) {
  const cs = Math.min(paneW / REF_W, vh / CONTENT_H);     // one scalar
  const mT = 14 * cs, mB = 13 * cs, gapL = 1 * cs, mR = 14 * cs;
  const cw = Math.max(REF_W * cs, paneW - gapL - mR);
  card.style.width  = cw + 'px';
  card.style.height = (vh - mT - mB) + 'px';
  card.style.borderRadius = 26 * cs + 'px';
  card.style.borderWidth  = Math.max(1, cs) + 'px';
  // the interior is authored at REF_W and simply scaled
  cardIn.style.transform = `translate(${(cw - REF_W * cs) / 2}px,0) scale(${cs})`;
  cardIn.style.transformOrigin = 'left top';
}
```
`CONTENT_H` — not `REF_H` — is the second term. Scaling to full panel height
shrinks the form on short screens for no reason; scaling to the *content* height
keeps type readable and lets the panel simply have more margin.

**Ratio ramping** — give width to the panel as the frame narrows, without a jump:
```js
function photoRatio(vw) {
  if (vw >= 1280) return 1 - PANE_RATIO;                    // 57.1%
  if (vw >= 1000) return lerpRange(vw, 1280, 1000, 1 - PANE_RATIO, 0.42);
  return lerpRange(vw, 1000, 820, 0.42, 0.36);
}
```
Two linear ramps, three anchors. A single ramp over the whole range either
collapses too early or too late.

**Never scale text below ~0.8×.** Past that the panel should reflow (R3), not
shrink — scaled-down 16px type is unreadable and looks like a rendering bug.

---

## R3 · Three-mode JS layout

When landscape, portrait-tablet and phone are genuinely different compositions,
not one composition resized.

```js
const mqLandscape = matchMedia('(min-width:700px) and (min-aspect-ratio:51/50)');
const mqPortrait  = matchMedia('(min-width:700px) and (max-aspect-ratio:51/50)');
```
- **`land`** — the two-column reference composition, R2 scaling inside it.
- **`tabport`** — the media column becomes a masthead band
  (`height: round(vh * 0.425)`), the panel takes the full measure beneath it, and
  the interior goes **fluid, not scaled**: `inset:0; transform:none`, with every
  interior value written as a CSS variable derived from the panel's own measure.
- **`phone`** — real document flow. Nothing viewport-scaled, page scrolls,
  `min-height:100svh`. **The phone branch does no measuring at all** — it only
  calls `setMode('phone')` and lets CSS own it.

### `clearInline()` — the rule people miss
Every branch writes inline styles, and inline styles outrank the stylesheet.
On any mode change, **wipe first**:
```js
function clearInline(){ [photo, pane, card, cardIn, hero]
  .forEach(el => { el.style.cssText = ''; }); }
```
Without this the outgoing mode's `left/top/width/padding` stay latched and the
incoming mode's CSS never applies — the layout looks correct only after a
reload. This is the single most common bug in a JS layout engine. None of these
elements should carry a `style` attribute in the markup, so clearing is safe.

### Binding
```js
['resize','orientationchange'].forEach(e => addEventListener(e, layout, {passive:true}));
mqLandscape.addEventListener('change', layout);
mqPortrait .addEventListener('change', layout);
document.fonts.ready.then(layout);
layout();                                    // once, immediately
```
`document.fonts.ready` matters — web fonts change measured text width, and a
layout computed before they land is wrong by a few percent.

### Measuring text you are about to fit
```js
function measure(text, el){
  const c = document.createElement('span'), cs = getComputedStyle(el);
  c.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap';
  ['fontFamily','fontSize','fontWeight','letterSpacing','wordSpacing',
   'fontVariationSettings'].forEach(k => c.style[k] = cs[k]);
  c.textContent = text; document.body.appendChild(c);
  const w = c.getBoundingClientRect().width; c.remove(); return w;
}
```
Set a headline's measure to a fraction of this (e.g. `× 0.61`) to force a break
at a chosen word instead of hard-coding `<br>`.

---

## Deliberate asymmetry

In a reconstructed comp, values like `69.14px` and `68.95px` on two headline
lines, or divider rules of `205px` and `204px`, are **intentional** — optical
corrections from the original design. Do not round them to match each other.
If a spec carries them, reproduce them and note in a comment that they are
deliberate, or the next person will "fix" them.

Same for negative padding used as optical centring
(`padding-left: -12px` against a trailing arrow icon).

---

## Standing rules

- One engine per build.
- `100svh` on mobile, not `100vh` — browser chrome otherwise clips the frame.
- Inputs are `font-size: 16px` on phone or iOS zooms on focus. No exceptions.
- Safe-area insets on anything touching an edge:
  `padding-bottom: max(30px, env(safe-area-inset-bottom))`.
- Height breakpoints are as important as width — check `1440×720` and
  `(max-height:520px) and (orientation:landscape)`.
- Re-run the layout pass after fonts load and after images/embeds resize.
