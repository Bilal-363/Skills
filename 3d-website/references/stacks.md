# Stack variants

Two targets. **Vanilla is the default** — it is what the engine files are
written for and what ships fastest.

---

## 1 · Vanilla static (default)

```
index.html                    (+ one file per page)
assets/css/core.css           ← copied verbatim
assets/js/engine.js           ← copied verbatim
assets/js/gl.js               ← copied verbatim
assets/js/scenes.js           ← from gl-scenes.md
assets/js/page.<name>.js      ← per-page channel writes + camera keys
assets/js/nav.js              ← header state, mobile menu, page curtain
```
```html
<script type="importmap">
{"imports":{
  "three":"https://cdn.jsdelivr.net/npm/three@0.168.0/build/three.module.js",
  "three/addons/":"https://cdn.jsdelivr.net/npm/three@0.168.0/examples/jsm/"
}}
</script>
<script type="module" src="./assets/js/page.home.js"></script>
```
Nothing else external except Google Fonts. No bundler, no npm, no build step.

---

## 2 · React + Vite + TypeScript + Tailwind

Only when the user asks. Packages: `react`, `react-dom`, `tailwindcss`,
`lucide-react` (icons only). **Nothing else** — no framer-motion, no GSAP, no
react-three-fiber unless 3D is actually in scope.

```
src/App.tsx        ← the whole page, one component tree
src/index.css      ← @tailwind directives + @font-face + @keyframes
src/hooks/usePointer.ts
src/hooks/useScrollRig.ts
```

### Porting the engine
The unit system moves into `index.css` unchanged — Tailwind and CSS variables
coexist fine:
```css
:root{ --u:calc(100vh / 1024); --h:clamp(var(--u),calc(var(--u)*.62 + var(--uw)*.38),calc(var(--u)*1.18)) }
```
Use arbitrary values for measured numbers: `className="text-[calc(96*var(--h))]"`,
`top-[calc(268*var(--u))]`. Do **not** approximate a measured value with a
Tailwind scale step — `text-6xl` is not `calc(96 * var(--h))`.

`engine.js` becomes one hook holding one rAF loop:
```ts
export function useRig(onTick: (s: RigState, dt: number) => void) {
  const cb = useRef(onTick); cb.current = onTick;
  useEffect(() => {
    let raf = 0, pending = false, sm = 0, mx = 0, my = 0, tmx = 0, tmy = 0, last = 0;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)');
    const tick = (t: number) => {
      pending = false; const dt = last ? Math.min(64, t - last) : 16; last = t;
      const target = scrollY;
      sm = reduce.matches ? target : sm + (target - sm) * 0.13;
      if (Math.abs(sm - target) < 0.08) sm = target;
      mx += ((reduce.matches ? 0 : tmx) - mx) * 0.11;
      my += ((reduce.matches ? 0 : tmy) - my) * 0.11;
      cb.current({ scroll: sm, mx, my, reduced: reduce.matches }, dt);
      if (Math.abs(sm - target) > 0.08 || Math.abs(mx - tmx) > 0.001) req();
    };
    const req = () => { if (!pending && !document.hidden) { pending = true; raf = requestAnimationFrame(tick); } };
    const onMove = (e: PointerEvent) => { tmx = e.clientX/innerWidth - .5; tmy = e.clientY/innerHeight - .5; req(); };
    addEventListener('scroll', req, { passive: true });
    addEventListener('pointermove', onMove, { passive: true });
    addEventListener('resize', req);
    req();
    return () => { cancelAnimationFrame(raf);
      removeEventListener('scroll', req); removeEventListener('pointermove', onMove);
      removeEventListener('resize', req); };
  }, []);
}
```

### React-specific rules
- **One** `useRig` per page. Multiple loops is the classic React failure here.
- Write CSS variables from the loop, never React state. `setState` at 60fps
  re-renders the tree and destroys the frame budget.
  ```ts
  document.documentElement.style.setProperty('--hero-y', y.toFixed(1) + 'px');
  ```
- Cancel the rAF and remove every listener in the effect cleanup. StrictMode
  double-invokes effects in dev — the cleanup must be exact or you get two loops.
- Canvas for the spotlight mask (`interactions.md` I1) lives in a `useRef` and
  is never inserted into the DOM.
- `lucide-react` for icons; import only the ones used (`Menu`, `X`). Never an
  icon font, never emoji.
- Keyframes live in `index.css`, not inline styles. Stagger delays go inline as
  `style={{ animationDelay: '.3s' }}`.

### Tailwind config
Extend rather than replace: add the palette from `art-direction.md` as
`theme.extend.colors`, and the two font families as `theme.extend.fontFamily`.
Keep `tracking-[-0.02em]` style arbitrary values for measured tracking.

---

## 2b · Framer Motion — allowed only on request

The default ban stands: **do not reach for `motion/react` on your own.** The
engine covers scroll, pointer, entrance and reveal without it, and adding it
costs ~35KB plus a second animation clock competing with the rAF loop.

Add it **only** when the user names it, and then keep it to what it is actually
good at — things the engine genuinely cannot do:
- `AnimatePresence` for exit animations of removed nodes
- spring layout transitions (`height: 'auto'`)
- gesture-driven `whileHover` / `whileTap` on interactive controls

Never use it for scroll progress, parallax, or entrance staggers — those stay in
the engine, or you end up with two clocks and visible drift.

Springs, when used: `{ type:'spring', stiffness:300, damping:20 }`.

---

## 2b-i · Translating GSAP / Lenis / Framer references

Award-site references (CHÂTEAU, LUXONN, BASILICO, etc.) are written for GSAP +
Lenis + Framer Motion. This skill replaces all three with its own engine — copy
the *effect*, not the library. Map them:

| reference uses | this skill's equivalent |
|---|---|
| Lenis `ReactLenis lerp:.05` | `useRig` scroll smoothing (`lerp .13`) — already smooth, no lib |
| GSAP `ScrollTrigger` reveal | `IntersectionObserver` + `[data-reveal]` (`entrances.md`) |
| GSAP `ScrollTrigger scrub` | `registerRig` section progress → CSS var (the rig pattern) |
| GSAP `ScrollTrigger pin` + x-translate | `A26` horizontal pinned scroll (sticky rig) |
| Framer `whileInView` re-trigger | IntersectionObserver with `once:false` (re-add/remove `.in`) |
| Framer `useSpring` tilt | `I10` 3D tilt (lerp-smoothed in the rAF loop) |
| Framer `AnimatePresence` worlds | `A25` snap-panel worlds (theme swap + CSS transition) |
| GSAP magnetic hover | `I5` magnetic hover |

Only pull in Framer Motion itself when the user names it (§2b) — for
`AnimatePresence` exits / spring layout the engine genuinely can't do. Never add
GSAP or Lenis; the engine covers both. `scroll-snap-type:y mandatory` (A25) is
pure CSS and always allowed.

---

## 2c · Typewriter hook

```ts
function useTypewriter(text: string, speed = 38, startDelay = 600) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayed(text); setDone(true); return;
    }
    let i = 0, iv: number;
    const t = setTimeout(() => {
      iv = window.setInterval(() => {
        i++; setDisplayed(text.slice(0, i));
        if (i >= text.length) { clearInterval(iv); setDone(true); }
      }, speed);
    }, startDelay);
    return () => { clearTimeout(t); clearInterval(iv); };
  }, [text, speed, startDelay]);
  return { displayed, done };
}
```
`38ms` per character, `600ms` before starting. Slower than 55ms feels broken;
faster than 25ms is unreadable.

Render into a `whitespace-pre-wrap` heading so `\n` in the source becomes a real
line break, and show the caret only while `!done`:
```tsx
<span className="inline-block w-[2px] h-[1.1em] bg-current align-middle ml-[2px] animate-blink" />
```
```css
@keyframes blink{ 0%,100%{opacity:1} 50%{opacity:0} }
.animate-blink{ animation:blink 1s step-end infinite }
```
`step-end` — a smooth fade reads as a glow, not a cursor.

**Accessibility:** the heading must contain the full string for screen readers.
Either render the complete text in a visually-hidden node, or set
`aria-label={text}` on the `<h1>` and `aria-hidden` on the animated span.
Reserve the height so the block does not grow as it types (CLS).

---

## 2d · Multi-select pills

```
active   - bg-[ink] text-white shadow-md, check icon springs in
inactive - bg-white text-[ink] border border-[line] hover:bg-[line]/55
```
Use real `<button aria-pressed>` elements, not divs. Wrap the status banner in
`AnimatePresence mode="wait"` with `height:'auto'` so it grows rather than jumps.
Empty state is a 50%-opacity italic hint, not a disabled-looking box.

---

## 3 · WordPress (install-ready theme)

> **Full lifecycle in `references/wordpress.md`** — Docker local dev, WP-CLI
> bootstrap, multi-page theme structure, the engine-porting traps (the
> height-locked-unit type trap, anti-flash colour, cache-busting, reveal safety
> net), static export, the Compress-Archive zip-path bug, custom-domain deploy +
> Let's Encrypt, and developer handoff. This section is the skeleton; that file
> is the tested playbook. Read it whenever a build actually ships as WordPress.

WordPress runs PHP + MySQL and has **no bundler** — so you build the **Vanilla**
stack (§1) and wrap it as a **classic theme with a full-width template**. Never
the React/Vite path for WordPress (WP won't run Vite; a headless setup is a
different, heavier project — out of scope unless the user asks for headless).

**What ships:** a self-contained theme folder the user zips and uploads via
*Appearance → Themes → Add New → Upload*. No build step, Three.js from CDN.

### Theme folder
```
copper-and-char/                 (theme slug = folder name, lowercase-hyphen)
  style.css                      ← REQUIRED theme header (below) + the site's core.css appended, OR @import
  functions.php                  ← enqueue assets, register the importmap + module scripts
  index.php                      ← fallback (can just call the front page template)
  front-page.php                 ← the home composition (the built HTML, PHP-escaped where dynamic)
  template-canvas.php            ← "Canvas" full-width template for extra landing pages
  screenshot.png                 ← 1200×900 theme thumbnail
  assets/
    css/core.css  js/engine.js  js/gl.js  js/nav.js  js/scenes.js  js/page.home.js
    images/ …                    ← generated/downscaled assets
```

**`style.css` header** (this line is what makes WP see it as a theme):
```css
/*
Theme Name: Copper & Char
Theme URI:  https://example.com
Author:     ESTA / built with 3d-website
Description: Cinematic food-truck theme. No build step.
Version:    1.0.0
*/
```

### `functions.php` — the two gotchas that trip everyone
```php
<?php
add_action('wp_enqueue_scripts', function () {
  $v = '1.0.0';
  wp_enqueue_style('cc-core', get_template_directory_uri().'/assets/css/core.css', [], $v);
  // Google Fonts
  wp_enqueue_style('cc-fonts', 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600&family=Inter:wght@400;500;600&display=swap', [], null);
  // page module — enqueue normally, then upgrade to type="module" below
  wp_enqueue_script('cc-page', get_template_directory_uri().'/assets/js/page.home.js', [], $v, true);
});

// GOTCHA 1: WP <script> tags are classic; ES-module imports need type="module".
add_filter('script_loader_tag', function ($tag, $handle, $src) {
  if ($handle === 'cc-page') return '<script type="module" src="'.esc_url($src).'"></script>'."\n";
  return $tag;
}, 10, 3);

// GOTCHA 2: the Three.js importmap must be printed in <head> BEFORE any module.
add_action('wp_head', function () { ?>
  <script type="importmap">
  {"imports":{
    "three":"https://cdn.jsdelivr.net/npm/three@0.168.0/build/three.module.js",
    "three/addons/":"https://cdn.jsdelivr.net/npm/three@0.168.0/examples/jsm/"
  }}</script>
<?php }, 1);
```
- **Module type**: `wp_enqueue_script` emits a classic tag; the `script_loader_tag`
  filter rewrites the one handle to `type="module"`. Without it every `import` throws.
- **Importmap first**: print it via `wp_head` priority 1 so it precedes the module.
- Reference assets with `get_template_directory_uri()`, never hard paths.

### The template files
`front-page.php` and `template-canvas.php` output the built markup between
`get_header()` / `get_footer()` — **but** the full-viewport sticky heroes fight a
theme's header/footer. For a pure landing, use a **canvas template** that emits
its own document and skips theme chrome:
```php
<?php /* Template Name: Canvas (full-bleed) */ ?>
<!doctype html><html <?php language_attributes(); ?>>
<head><meta charset="<?php bloginfo('charset'); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<?php wp_head(); ?></head>
<body <?php body_class(); ?>>
  <!-- the built site's <main> … paste the composition here -->
  <?php wp_footer(); ?>
</body></html>
```
Assign it in the page editor: *Page → Template → Canvas (full-bleed)*.

### Editable content (so the client can change text without code)
- **Simplest (static):** copy lives in the template; the client edits the PHP or a
  child theme. Fine for a one-off.
- **Better:** register a few **theme settings / a block pattern**, or expose fields
  with **ACF** (Advanced Custom Fields) and echo them in the template — then the
  client edits everything from the WP admin. Add ACF only when the client will
  self-edit.
- **e-commerce:** WooCommerce for products/cart; keep the cinematic hero on the
  home template and let Woo own the shop/checkout pages.

### Repeatable local bootstrap (WP-CLI)
```bash
wp core download
wp config create --dbname=site --dbuser=root --dbpass=root --dbhost=127.0.0.1
wp core install --url=localhost:8080 --title="Site" --admin_user=admin --admin_password=admin --admin_email=a@b.co
# copy the theme folder into wp-content/themes/, then:
wp theme activate copper-and-char
wp option update show_on_front page   # so front-page.php is used
```
For a beginner with no server, **LocalWP** (localwp.com) gives a one-click WP on
their machine; the theme zip installs the same way.

### Verify (screenshot-diff loop)
Same loop as any build: `wp` local (or LocalWP) serving → puppeteer-core drives
Chrome → screenshot the pages → check the WebGL/scroll works inside WP and the
theme header didn't wrap the canvas template.

---

## 3b · Other CMS / builders (embed the Vanilla build)
| platform | how the Vanilla build goes in |
|---|---|
| **Webflow / Squarespace / Wix** | Custom-code / HTML embed block (whole page or one section) |
| **Shopify** | paste into a Liquid section; assets in the theme's `assets/` |
| **Framer** | code component (the **React** path works here) |
| **Elementor / Divi / Gutenberg** | "HTML" widget / Custom HTML block for a hero or section |
Always the Vanilla output (no build step). Use a **blank / full-width** page so the
platform's chrome doesn't wrap a full-viewport hero. React only for Framer or headless.

---

## 4 · Choosing

| signal | stack |
|---|---|
| "landing page", "one page", "fast", nothing said | **Vanilla** |
| "React", "Vite", "Tailwind", "our app", "component" | **React** |
| "WordPress", "WP", "my client uses WordPress", "editable in admin" | **WordPress** (§3 — Vanilla wrapped as a theme) |
| Webflow / Squarespace / Shopify / Wix | **Vanilla** embed (§3b) |
| Multi-page marketing site | **Vanilla** — routing a SPA buys nothing here |
| Needs to drop into an existing React codebase | **React** |

When unsure, build Vanilla and say why in one line. It is strictly easier to port
vanilla into React or wrap it in a WP theme later than the reverse.
