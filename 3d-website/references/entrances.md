# Entrances & resilience

The load choreography, and the discipline that stops a fancy page from ever
showing a blank or white screen.

Easing everywhere: `cubic-bezier(.16, 1, .3, 1)` for entrances,
`cubic-bezier(.22, 1, .36, 1)` for scroll and hover.

---

## 1 · The `.appear` system

**Resting opacity is `1`.** This is the rule that matters. If CSS animations
never run — blocked, unsupported, a JS error, an extension — the page is
complete and readable rather than invisible.

```css
.appear{
  animation-duration:1.05s;
  animation-fill-mode:both;                    /* holds the 0% frame during the delay */
  animation-timing-function:cubic-bezier(.16,1,.3,1);
  animation-delay:var(--d, .08s);
}
.appear.is-in{ animation:none; opacity:1; transform:none; clip-path:none; filter:none }
```

`both` + a resting opacity of 1 is the trick: elements *do* hide during their
delay when animations run, and are simply visible when they don't.

**Keyframes** — all end at opacity 1 / identity transform:
```css
@keyframes in-scale{ from{opacity:0;transform:scale(.84)} }
@keyframes in-soft { from{opacity:0;transform:translateY(14px)} }
@keyframes in-mask { from{opacity:0;transform:translateY(40%)} }   /* parent clips */
@keyframes in-pop  { 0%{opacity:0;transform:scale(.9)} 70%{transform:scale(1.03)} 100%{transform:scale(1)} }
@keyframes in-btn  { from{opacity:0;transform:translateY(18px) scale(.94)} }
@keyframes in-side { from{opacity:0;transform:translateX(22px)} }
@keyframes in-stat { from{opacity:0;transform:translateY(20px)} }
@keyframes in-blur { from{opacity:0;transform:translateY(26px);filter:blur(8px)} }
@keyframes draw    { from{stroke-dashoffset:var(--len)} to{stroke-dashoffset:0} }
```

**Masked headline lines** — the single best-looking entrance there is:
```html
<h1><span class="line"><span class="appear appear--mask" style="--d:.42s">Train AI agents on your</span></span>
    <span class="line"><span class="appear appear--mask" style="--d:.62s">workflows in minutes.</span></span></h1>
```
```css
.line{ display:block; overflow:hidden; padding:.06em .15em .14em }
```
The `padding` is required — descenders and italics clip without it.

---

## 2 · The delay table

Copy this shape; adjust only the labels. Every element gets its own `--d`.

| element | keyframe | `--d` | duration |
|---|---|---|---|
| logo | `in-scale` | .08s | 1.05s |
| nav item 1 | `in-scale` | .16s | |
| nav item 2 | `in-soft` | .28s | |
| nav item 3 | `in-scale` | .40s | |
| nav item 4 | `in-soft` | .52s | |
| header CTA / burger | `in-scale` | .34s | |
| badge | `in-pop` | .22s | |
| badge icon | `in-star` | .28s | .9s |
| H1 line 1 | `in-mask` | .42s | |
| H1 line 2 | `in-mask` | .62s | |
| H1 accent word | `in-em` | .72s | 1.2s |
| lede | `in-soft` | .82s | **1.25s** |
| primary CTA | `in-btn` | .96s | |
| secondary CTA | `in-side` | 1.10s | |
| stat 1 / 2 / 3 | `in-stat` | 1.12 / 1.28 / 1.44s | |

Alternating `in-scale` and `in-soft` across nav items is what stops the row
looking like a mechanical sweep.

Two extras:
```css
@keyframes in-star{ 0%{opacity:0;transform:scale(.2) rotate(-50deg)}
                    65%{transform:scale(1.2) rotate(8deg)} 100%{transform:scale(1) rotate(0)} }
@keyframes in-em  { from{opacity:.35;filter:blur(4px)} to{opacity:1;filter:blur(0)} }
```

---

## 3 · The animation fallback (required)

```js
const done = (el) => el.classList.add('is-in');
document.querySelectorAll('.appear').forEach((el) =>
  el.addEventListener('animationend', () => done(el), { once: true }));

requestAnimationFrame(() => requestAnimationFrame(() => {
  document.querySelectorAll('.appear, .hero-photo').forEach((el) => {
    const running = el.getAnimations?.().some((a) => a.playState === 'running' || a.playState === 'finished');
    if (!running) done(el);
  });
}));
```
Two frames, then check `getAnimations()`. Nothing is ever left mid-state.

---

## 4 · Never-blank discipline

**Anti-flash-white** — for any dark page, three layers of defence:
1. The very first CSS rule:
   `html, body { background:#000 !important; color:#fff }`
2. An inline attribute on `<body>`: `style="background:#000;color:#fff"`
3. Then the token version:
   `html, body { background: var(--bg, #000); color: var(--text, #fff) }`

Belt and braces, but a white flash on a black cinematic page is the single most
expensive-looking mistake there is.

**Also required**
- Every `<img>` and embed has reserved space — width/height or `aspect-ratio`.
  CLS < 0.1 is a checklist item.
- Fonts `font-display: swap`, with a real fallback stack. Layout must hold with
  fonts blocked.
- Hero video: poster first, `<source>` attached after `window.load`. The poster
  is what the user sees for the first second, so it must be the same shot.
- `.appear` resting opacity 1, per §1.
- If WebGL fails, `html.no-gl` engages and the CSS tier takes over. Never a
  blank canvas.

---

## 5 · Reduced motion

```css
@media (prefers-reduced-motion: reduce){
  *,*::before,*::after{ transition:none !important; animation:none !important }
  .appear,.hero-photo,h1 em,.badge-star{
    opacity:1 !important; transform:none !important;
    clip-path:none !important; filter:none !important }
  [data-reveal]{ opacity:1; transform:none }
  html{ scroll-behavior:auto }
}
```
Also in JS: force `--mx`/`--my` to 0, snap `smoothScroll` to target, pause hero
video, and freeze the camera at keyframe 0. `engine.js` already does the first
two.

---

## 5b · Splash counter — 0 → 100

For brands that want a beat before the page. Fixed white (or `--void`) overlay,
`z-[100]`, counter **bottom-left**, not centred — centred reads as a loading
spinner, bottom-left reads as a title card.

```
0ms      count 0 → 100, 100 steps × 20ms   (exactly 2000ms)
2000ms   hold 200ms at 100
2200ms   exiting = true → opacity-0, transition-opacity duration-700
2900ms   onComplete() removes it from the DOM
```
Counter: `text-7xl md:text-9xl font-bold tabular-nums p-6 md:p-10 leading-none`.
`tabular-nums` is required or the digits jitter as they change width.

**Rules**
- Never gate real content behind it — the page below is fully rendered and the
  splash is only an overlay. If the JS fails, nothing is hidden.
- Once per session (`sessionStorage`), never on repeat navigation.
- Skipped entirely under `prefers-reduced-motion` and when the user arrives at
  a deep link / anchor.
- Total 2.9s is the ceiling. Longer and it stops being a beat.

---

## 5c · Staggered reveal — the React hook

The `[data-reveal]` observer's React equivalent. One observer per section,
index-driven delay.

```ts
function useStaggeredReveal(count: number, threshold = 0.15) {
  const containerRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = containerRef.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); io.disconnect(); }   // fires once
    }, { threshold });
    io.observe(el); return () => io.disconnect();
  }, [threshold]);
  const getAnimStyle = (i: number): CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(24px)',
    transition: `opacity .6s cubic-bezier(.16,1,.3,1) ${i * 120}ms,
                 transform .6s cubic-bezier(.16,1,.3,1) ${i * 120}ms`,
  });
  return { containerRef, getAnimStyle };
}
```
`120ms` per index is the number. Below 80 the stagger is invisible; above 160 the
last card feels late. `io.disconnect()` on first intersection — never re-animate.

Under reduced motion, initialise `visible` to `true`.

---

## 5d · Drawer menu (mobile variant)

Alternative to the full-screen overlay in `core.css`. Use when the page is light
or content-dense.

```
outer:    fixed inset-0 z-40, pointer-events toggled by open state
backdrop: absolute inset-0 bg-black/20 backdrop-blur-sm   → click closes
panel:    absolute top-0 right-0 h-full w-[85%] max-w-sm bg-white shadow-2xl
          translate-x-0 (open) / translate-x-full (closed)
          duration-500 ease-[cubic-bezier(.76,0,.24,1)]
links:    opacity-0 translate-x-8 → opacity-100 translate-x-0
          transitionDelay: 100 + i * 60 ms
foot:     mt-8 pt-8 border-t, delay 450ms
```
`document.body.style.overflow = 'hidden'` while open — **and restore it in the
effect cleanup**, not just on close, or a route change leaves the page locked.

Hamburger: three `absolute h-0.5 w-6` spans, `transition-all duration-300
ease-[cubic-bezier(.76,0,.24,1)]`.
Closed `-translate-y-2` / `opacity-100 scale-x-100` / `translate-y-2`;
open `rotate-45 translate-y-0` / `opacity-0 scale-x-0` / `-rotate-45 translate-y-0`.

---

## 5e · WAAPI timeline + pre-paint guard

The most robust entrance system in this skill. Use it when the entrance must
play exactly once, must never flash, and must survive JS being off.

### The guard — a tiny script in `<head>`, *before* the stylesheet
```html
<script>
document.documentElement.classList.add('entry-pending');
window.__entryFallback = setTimeout(function(){
  document.documentElement.classList.remove('entry-pending');
}, 3500);
</script>
```
With JS disabled the class is never added, so the finished page just renders.
**That is the entire no-JS story — do not add a `<noscript>` block.** The 3500ms
timer is the safety release if the animation script never runs.

CSS then hides the first frame only while the class is present:
```css
.entry-pending .card{ opacity:0; transform:translateY(12px) scale(.988) }
.entry-pending .hl { opacity:0; transform:translateY(16px);
                     clip-path:inset(100% 0 0 0) }
.entry-pending .card,.entry-pending .hl{ will-change:transform,opacity,clip-path }
@media (prefers-reduced-motion:reduce){
  .entry-pending *{ opacity:1!important; transform:none!important;
                    clip-path:none!important; will-change:auto!important } }
```

### The timeline — one IIFE at the end of `<body>`
```js
if (matchMedia('(prefers-reduced-motion:reduce)').matches || !Element.prototype.animate) {
  release(); return;
}
const ease = 'cubic-bezier(.16,1,.3,1)', soft = 'cubic-bezier(.22,1,.36,1)';
const compact = matchMedia('(max-width:699px)').matches;
const anims = steps.map(([el, delay, dur, easing, from]) =>
  el.animate([from, { opacity:1, transform:'none' }],
             { delay, duration:dur, easing, fill:'both' }));
document.documentElement.classList.remove('entry-pending');   // handoff, immediately
Promise.allSettled(anims.map(a => a.finished))
  .then(() => { anims.forEach(a => a.cancel()); release(); });
```
Two things make this clean:
- **The handoff.** Remove `entry-pending` the instant the animations are
  scheduled — the animation layer now owns the hidden first frame, so the CSS
  guard drops without a flash.
- **`cancel()` at the end.** It restores the authored static styles exactly,
  leaving no `fill:'both'` residue latched on the elements.

### Trigger
```js
Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 650))])
  .then(() => requestAnimationFrame(() => requestAnimationFrame(start)));
```
Fonts get a chance to land; a slow font can never stall the page past 650ms.

### Reference timeline
Surface establishes depth → brand promise overlaps it → functional groups last.

| target | delay | dur | easing | from |
|---|---|---|---|---|
| panel / card | 40 | 820 | ease | `translateY(12px) scale(.988)` |
| badge | 120 | 480 | soft | `translateY(8px)` |
| headline 1 | 240 | 760 | ease | `translateY(16px)` + `clip-path:inset(100% 0 0 0)` |
| headline 2 | 330 | 760 | ease | same |
| h1 | 470 | 620 | ease | `translateY(10px)` |
| sub | 570 | 560 | ease | `translateY(10px)` |
| field 1 / 2 | 720 / 790 | 520 | soft | `translateY(8px)` |
| primary button | 930 | 560 | ease | `translateY(8px)` |
| divider | 1060 | 440 | soft | `translateY(6px)` |
| secondary button | 1150 | 540 | ease | `translateY(8px)` |
| footer line | 1260 | 500 | soft | `translateY(6px)` |

**The hero photo or video is deliberately excluded.** It is the static stage and
never animates — animating it makes the whole page feel like a slideshow.

---

## 5f · Word-pop — per-word headline entrance

For consumer and retail pages where the headline should feel playful rather than
cinematic. Each word is an `inline-block` with its own delay.

```css
@keyframes wordPop{
  0%  { opacity:0; transform:translateY(60px) scale(.7) rotate(-4deg); filter:blur(8px) }
  60% { opacity:1; transform:translateY(-6px) scale(1.03) rotate(1deg); filter:blur(0) }
  100%{ opacity:1; transform:none; filter:blur(0) }
}
.word-pop{ display:inline-block; opacity:0;
  animation:wordPop .9s cubic-bezier(.34,1.56,.64,1) both }
```
The `60%` overshoot is the whole effect — remove it and it is just a fade-up.
Stagger 100ms per word; past six words it stops reading as one phrase.

Never combine word-pop with a masked-line entrance in the same headline.

### Word-reveal — the cinematic cousin of word-pop

Where `word-pop` bounces, this rises from behind a mask with a blur. Use it on
serif or wide-tracked headlines where bounce would look wrong.

```css
.word{ display:inline-block; overflow:hidden; vertical-align:bottom }
.word > span{ display:inline-block;
  animation:wordReveal .7s cubic-bezier(.16,1,.3,1) both }
@keyframes wordReveal{
  from{ opacity:0; transform:translateY(100%); filter:blur(4px) }
  to  { opacity:1; transform:none;            filter:blur(0) }
}
```
`translateY(100%)` with the parent clipping is what makes it read as *revealed*
rather than *faded*. Stagger 100ms per word, starting at 300ms.

**Dim/bright word split** — a strong, cheap device: set some words to `--ink`
and others to `--ink/45` within the same headline, so the eye reads a phrase
inside the phrase:
```
The Power of        ← "of" dimmed
Nature in Every     ← "Nature in" dimmed
Capsule             ← bright
```
Bright words must form a readable phrase on their own ("The Power … Every
Capsule"). If they do not, the split is decoration and should be dropped.
Never dim more than half the words.

### Delay utility ladder
```css
.delay-100{animation-delay:.1s} /* … through */ .delay-1200{animation-delay:1.2s}
```
Twelve classes in 100ms steps. Cheaper and more legible than inline styles when
a page has 20+ staggered elements.

Companion keyframes for the same family:
```css
@keyframes fadeUp    { from{opacity:0;transform:translateY(30px)} }        /* .8s  ease */
@keyframes slideUp   { from{opacity:0;transform:translateY(60px)} }        /* .9s  ease */
@keyframes slideInL  { from{opacity:0;transform:translateX(-40px)} }       /* .8s  ease */
@keyframes slideInR  { from{opacity:0;transform:translateX(40px)} }        /* .8s  ease */
@keyframes textReveal{ from{opacity:0;transform:translateY(40px) skewY(3deg);filter:blur(4px)} }
@keyframes scaleIn   { from{opacity:0;transform:scale(.85)} }              /* .7s  ease */
@keyframes photoReveal{from{opacity:0;transform:translateY(80px) scale(1.02)} } /* 1.1s */
```
All `animation-fill-mode: both`, all `cubic-bezier(.16,1,.3,1)` unless noted.

**Stagger order for a retail hero:** header 100–300 → headline words 200–600 →
side cards 600–700 → photos 600–900 (centre first) → overlay stats 1000–1200.

---

## 6 · Scroll-triggered reveals

Distinct from load entrances — use `[data-reveal]` with the shared
`IntersectionObserver` in `engine.js`:
```html
<div data-reveal data-d="2">…</div>
```
`threshold .18`, `rootMargin '0px 0px -8% 0px'`, **unobserve after firing**.
Nothing re-animates on scroll back up — re-animation is the clearest tell of a
template.
