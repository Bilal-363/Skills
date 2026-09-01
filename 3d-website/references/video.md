# Video techniques

Four ways a video can live on a cinematic page. Pick one per page — stacking
two of these is how you get a 40MB hero that stutters.

| | technique | cost | when |
|---|---|---|---|
| V1 | **Plate** — autoplay, loop, decorative | low | default; background atmosphere |
| V2 | **Scroll-scrubbed frame bank** — WebCodecs decode, scroll drives frame | high | the whole page *is* the clip |
| V3 | **Pointer-scrubbed** — mouse delta drives `currentTime` | medium | desktop-only playful hero |
| V4 | **Crossfade switcher** — N clips, one visible, user picks | medium-high | mood/variant selector |

---

## V1 · Plate — the default

```html
<div class="plate" aria-hidden="true">
  <video class="plate-video" autoplay muted loop playsinline
         preload="metadata" poster="POSTER_URL"></video>
</div>
```
`muted` + `playsinline` are both required or iOS refuses to autoplay. Never
`controls`. Never `pointer-events`.

**Ambient slow-mo:** set `video.playbackRate = 0.7` (0.6–0.8) in JS after load for
a calmer, more expensive feel on a background plate — a cheap, high-impact touch.

**Loading discipline — the video must never block first paint:**
- `preload="metadata"` only. Attach `<source>` after `window.load`.
- Poster is the **same shot** as frame 0, preloaded
  `<link rel="preload" as="image" fetchpriority="high">`.
- Skip the video entirely on `navigator.connection.saveData` or
  `effectiveType` `2g`/`slow-2g`.
- `video.pause()` on `document.hidden` and when off-screen
  (`IntersectionObserver`). Resume on return.
- Under reduced motion: pause, show the poster.

**Geometry** — size in `--u`, not `vw/vh`, so it matches the comp:
```css
.plate-video{ position:absolute; left:50%; top:calc(1 * var(--u));
  width:calc(1492 * var(--u)); height:calc(1054 * var(--u));
  transform:translateX(calc(-50% - calc(.5 * var(--u))));
  object-fit:cover; pointer-events:none }
```
Portrait: `inset:0; width:100%; height:100%; transform:none;
object-position:43% center` — the crop moves, so re-check text contrast.

**Two fade gradients on `.plate::after`, always both** — a bottom fade into the
page colour, and a side letterbox or a to-right gradient that keeps the type
column legible. The gradients are what make it read as a plate rather than a
video pasted on a page.

Scroll reveal → `sections.md` A9 (`clip-path` wipe, not a fade).

---

## V2 · Scroll-scrubbed frame bank (WebCodecs)

The page is a 500vh scroll track with a sticky viewport; scroll position *is*
the playhead. `video.currentTime = x` alone stutters badly — real smoothness
needs decoded frames held in memory.

```
outer:  relative h-[500vh]                 ← the scroll distance
sticky: sticky top-0 h-screen overflow-hidden
  1. <video>  full cover              ← fallback renderer, never play()ed
  2. <canvas width=1920 height=1080>  ← frame bank renderer, fades in when live
  3. overlay  absolute inset-0 pointer-events-none   ← nav + text sections
```

**Constants** (tuned; change only with a reason):
```
LERP_TAU = 8        // exponential smoothing rate
SNAP     = 0.002    // seconds; below this, snap to target
LRU_MAX  = 24       // decoded ImageBitmaps held
LEAD     = 24       // decode-ahead throttle
WATCHDOG = 60000    // ms before giving up on the bank
```

**Per-frame loop:**
```js
const dt = Math.min(0.1, deltaSeconds);
const p  = clamp(scrollY / (container.offsetHeight - innerHeight));
const target = p * duration;
if (reduceMotion) current = target;
else {
  current += (target - current) * (1 - Math.exp(-dt * LERP_TAU));
  if (Math.abs(target - current) < SNAP) current = target;
}
if (bankReady) drawNearestFrame(current);
else if (!video.seeking && Math.abs(video.currentTime - current) > 0.01)
  video.currentTime = current;
```
`1 - exp(-dt * TAU)` rather than a fixed lerp factor — it makes the smoothing
frame-rate independent, which a plain `* 0.1` is not.

**Building the bank** (after `window.load`; skip on reduced motion or when
`VideoDecoder` is undefined):
1. `fetch` the mp4 as `ArrayBuffer` (needs CORS on the host).
2. `MP4Box.createFile()` → video track → `VideoDecoder.configure({codec,
   description: avcC | hvcC | vpcC | av1C})`.
3. Feed samples as `EncodedVideoChunk` (`key` vs `delta`), throttled by `LEAD`
   so decode never outruns encoding.
4. Each `VideoFrame` → offscreen canvas → `toBlob('image/webp', .82)`, stored
   with its microsecond timestamp. **Close every `VideoFrame`** — leaking them
   exhausts the decoder within seconds.
5. Sort by timestamp. `nearestIndex` = binary search on `t * 1e6`.
6. `warmLRU(i-1 … i+2)` via `createImageBitmap`, evict oldest past `LRU_MAX`.
7. First successful paint → `canvasLive`, canvas fades in over the video
   (`transition-opacity duration-300`).

**Failure paths — all three are required:**
- Hardware decode throws → retry once with `hardwareAcceleration:'prefer-software'`.
- `WATCHDOG` elapses → revert to `currentTime` seeking, hide the canvas.
- No `VideoDecoder`, CORS failure, or reduced motion → never build the bank.

The `<video>` renders underneath the whole time, so every failure degrades to a
working page rather than a black rectangle.

**Do not** replace the lerp with raw progress (frames jump), call `play()`, or
swap this for a scroll library.

---

## V3 · Pointer-scrubbed video (desktop only)

Mouse horizontal movement scrubs the clip. Playful, cheap, desktop-only.
```js
if (innerWidth < 1024) return;                     // mobile autoplays instead
const delta = e.clientX - prevX; prevX = e.clientX;
target = clamp(target + (delta / innerWidth) * 0.8 * video.duration,
               0, video.duration);
video.currentTime = target;
```
`0.8` means a full screen-width sweep covers 80% of the clip. Bind `seeked` to
keep tracking frame-to-frame instead of queuing seeks.

Below 1024px set `video.autoplay = true; video.play()` — scrubbing has no input
device there, and a frozen first frame reads as broken.

---

## V4 · Crossfade switcher

N full-screen clips stacked absolutely; only the active one is `opacity-100`,
the rest `opacity-0`, `transition-opacity duration-1000 ease-in-out`.

```js
const [active, setActive] = useState(0);
const [locked, setLocked] = useState(false);
function pick(i){
  if (i === active || locked) return;
  setActive(i); setLocked(true);
  setTimeout(() => setLocked(false), 1000);   // must match the CSS duration
}
```
The cooldown is not optional — without it, rapid clicks leave two clips at
partial opacity and the composition greys out.

**Cost warning:** N clips all `preload="auto"` is N × the bandwidth. Load clip 0
eagerly and the rest on first interaction or `requestIdleCallback`. Four 1080p
loops is a realistic ceiling.

**Per-clip content colour:** when one clip is much lighter or darker, the
overlay text must flip for that clip only —
`transition-colors duration-700` between `#fff` and the dark ink. Nav and
footer usually stay fixed; only the hero block flips.

---

## Transparent PNG overlay (the "train-bob")

A cut-out foreground PNG over the video, gently oscillating so the scene feels
handheld:
```css
@keyframes bob{ 0%,100%{transform:translateY(0)    scale(1.03)}
                50%    {transform:translateY(-6px) scale(1.03)} }
.overlay{ position:absolute; inset:0; z-index:1; pointer-events:none;
          animation:bob 3s ease-in-out infinite }
```
`scale(1.03)` is load-bearing — without it the 6px travel exposes the PNG's
edges against the video.

---

## Responsive content-colour flip (applies to all four)

A video crops differently at each breakpoint, so the same text can sit on a
bright region on mobile and a dark one on desktop. Flip per element, per
breakpoint, and **verify both**:
```
text-[#010101] lg:text-white          /* headline, wordmark, stat numbers */
text-[#010101]/70 lg:text-white/70    /* body */
text-[#010101]/60 lg:text-white/60    /* meta */
```
This is not a dark-mode toggle — it is one composition photographed two ways.
Checking only one breakpoint is the single most common failure here.

---

## Standing rules

- One technique per page.
- Videos are always `muted` — a page that makes noise is a bug.
- Every technique degrades: V2 → seeking → poster; V4 → clip 0; V3 → autoplay.
- Reduced motion: V1 pauses on the poster, V2 snaps without lerp, V3 disables,
  V4 stops on the current clip.
- Never count video bytes inside the first-paint budget — attach sources after
  `window.load` and prove it in a network trace.
