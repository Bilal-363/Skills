/* 3d-website engine — scroll smoothing, pointer parallax, reveal, sticky rigs.
 * Copy verbatim. No dependencies. ~5KB.
 *
 * Publishes CSS custom properties on <html>. Nothing else in the page may
 * write these. Read them from CSS; never set style.transform from JS.
 *
 * Exports:
 *   clamp, smoothstep, lerp, seg      — motion primitives
 *   onFrame(fn)                       — subscribe; fn({scroll, sp, mx, my, dt})
 *   registerRig(el, fn)               — fn(sectionPx, sectionLen) per sticky rig
 *   setVar(name, value)               — write a channel
 *   requestTick()                     — nudge the loop
 *   state                             — live read-only-ish snapshot
 */

const root = document.documentElement;
const reduce = matchMedia('(prefers-reduced-motion: reduce)');

/* ---------- primitives ---------- */
export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const smoothstep = (e0, e1, v) => {
  const x = clamp((v - e0) / (e1 - e0));
  return x * x * (3 - 2 * x);
};
export const lerp = (a, b, t) => a + (b - a) * t;

/** Scene window: enter ramp a→b, exit ramp c→d. `active` peaks at 1 between b and c. */
export const seg = (s, a, b, c, d) => {
  const enter = smoothstep(a, b, s);
  const exit = smoothstep(c, d, s);
  return { enter, exit, active: enter * (1 - exit) };
};

/* ---------- state ---------- */
export const state = {
  scroll: 0,        // smoothed scrollY
  target: 0,        // raw scrollY
  sp: 0,            // page progress 0..1
  mx: 0, my: 0,     // smoothed pointer, -0.5..0.5
  tmx: 0, tmy: 0,   // raw pointer
  max: 1,           // scrollable height
  reduced: reduce.matches,
};

let initialized = false;
let rafPending = false;
let lastT = 0;
const subs = [];
const rigs = [];

export const onFrame = (fn) => { subs.push(fn); return () => subs.splice(subs.indexOf(fn), 1); };

/* ---------- CSS channel writer (dedupes, so we never touch the CSSOM for nothing) ---------- */
const written = new Map();
export function setVar(name, value) {
  const v = String(value);
  if (written.get(name) === v) return;
  written.set(name, v);
  root.style.setProperty(name, v);
}

/* ---------- sticky rigs ----------
 * <section class="rig" style="--len:2600px"><div class="stage">…</div></section>
 * fn receives (sectionPx 0..len, len).
 */
export function registerRig(el, fn) {
  rigs.push({ el, fn, len: 0, top: 0, active: true });
  measure();
  requestTick();
}

function measure() {
  state.max = Math.max(1, root.scrollHeight - innerHeight);
  for (const r of rigs) {
    const rect = r.el.getBoundingClientRect();
    r.top = rect.top + scrollY;
    r.len = Math.max(1, r.el.offsetHeight - innerHeight);
  }
}

/* ---------- the loop ---------- */
function update(t) {
  rafPending = false;
  const dt = lastT ? Math.min(64, t - lastT) : 16;
  lastT = t;

  state.reduced = reduce.matches;
  state.target = scrollY;

  if (!initialized || state.reduced) {
    state.scroll = state.target;
    initialized = true;
  } else {
    state.scroll = lerp(state.scroll, state.target, 0.13);
  }
  if (Math.abs(state.scroll - state.target) < 0.08) state.scroll = state.target;

  const tmx = state.reduced ? 0 : state.tmx;
  const tmy = state.reduced ? 0 : state.tmy;
  state.mx = lerp(state.mx, tmx, 0.11);
  state.my = lerp(state.my, tmy, 0.11);

  state.sp = clamp(state.scroll / state.max);

  /* global channels */
  setVar('--sp', state.sp.toFixed(4));
  setVar('--mx', state.mx.toFixed(4));
  setVar('--my', state.my.toFixed(4));
  setVar('--tilt-x', (state.my * -3.2).toFixed(3) + 'deg');
  setVar('--tilt-y', (state.mx * 4.0).toFixed(3) + 'deg');
  setVar('--depth-1', (state.sp * -140).toFixed(1) + 'px');
  setVar('--depth-2', (state.sp * -76).toFixed(1) + 'px');
  setVar('--depth-3', (state.sp * -28).toFixed(1) + 'px');
  setVar('--grain', (0.055 + state.sp * 0.02).toFixed(4));

  /* per-rig local progress */
  for (const r of rigs) {
    const s = clamp(state.scroll - r.top, 0, r.len);
    const vis = s > -innerHeight && state.scroll < r.top + r.len + innerHeight;
    if (vis) r.fn(s, r.len);
  }

  for (const fn of subs) fn(state, dt);

  /* keep going only while something is actually moving */
  const moving =
    Math.abs(state.scroll - state.target) > 0.08 ||
    Math.abs(state.mx - tmx) > 0.001 ||
    Math.abs(state.my - tmy) > 0.001;
  if (moving) requestTick();
}

export function requestTick() {
  if (rafPending || document.hidden) return;
  rafPending = true;
  requestAnimationFrame(update);
}

/* ---------- reveal ---------- */
function initReveal() {
  const items = document.querySelectorAll('[data-reveal]');
  if (!items.length) return;
  if (state.reduced) { items.forEach((el) => el.classList.add('in')); return; }
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      e.target.classList.add('in');
      io.unobserve(e.target);           // never re-animate on scroll back up
    }
  }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });
  items.forEach((el) => io.observe(el));
}

/* ---------- listeners ---------- */
addEventListener('scroll', requestTick, { passive: true });
addEventListener('resize', () => { measure(); requestTick(); });
addEventListener('orientationchange', () => { measure(); requestTick(); });
addEventListener('pointermove', (e) => {
  state.tmx = e.clientX / innerWidth - 0.5;
  state.tmy = e.clientY / innerHeight - 0.5;
  requestTick();
}, { passive: true });
document.addEventListener('visibilitychange', () => { if (!document.hidden) requestTick(); });
reduce.addEventListener('change', () => { initialized = false; requestTick(); });

/* fonts landing shifts layout — re-measure */
if (document.fonts?.ready) document.fonts.ready.then(() => { measure(); requestTick(); });

function boot() {
  measure();
  initReveal();
  document.querySelectorAll('.rig[data-rig]').forEach((el) => {
    // opt-in generic rig: exposes --s (0..1) scoped to the element
    registerRig(el, (s, len) => el.style.setProperty('--s', (s / len).toFixed(4)));
  });
  requestTick();
}
if (document.readyState === 'loading') addEventListener('DOMContentLoaded', boot);
else boot();

/* observe late layout growth (images, embeds) */
if ('ResizeObserver' in self) new ResizeObserver(() => { measure(); requestTick(); }).observe(document.body);
