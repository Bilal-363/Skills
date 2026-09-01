# WordPress — the full playbook

Everything for shipping a 3d-website build as **real, running WordPress**:
local dev in Docker, WP-CLI bootstrap, the theme structure, the engine-porting
traps, static export, custom-domain deploy, and developer handoff. All of it is
tested end-to-end on a real multi-page site — the numbers and gotchas here are
the ones that actually bit.

> **The rule that never bends:** WordPress runs PHP + MySQL and has **no
> bundler**. You build the **Vanilla** output (`stacks.md §1`) and wrap it as a
> **classic theme**. Never the React/Vite path for WP. Headless (Next + WPGraphQL)
> is a separate, heavier project — only if the user explicitly asks.

`stacks.md §3` has the theme-folder skeleton and the two enqueue gotchas. This
file is the rest of the lifecycle.

---

## 1 · Local dev in Docker (the reliable way)

No PHP/MySQL install on the machine — everything runs in containers. One
`docker-compose.yml` in a working dir (e.g. `wp-site/`):

```yaml
services:
  db:
    image: mariadb:11
    restart: unless-stopped
    environment:
      MARIADB_DATABASE: wordpress
      MARIADB_USER: wp
      MARIADB_PASSWORD: wp
      MARIADB_ROOT_PASSWORD: root
    volumes: [ db_data:/var/lib/mysql ]

  wordpress:
    image: wordpress:latest
    depends_on: [db]
    restart: unless-stopped
    ports: [ "8080:80" ]
    environment:
      WORDPRESS_DB_HOST: db
      WORDPRESS_DB_USER: wp
      WORDPRESS_DB_PASSWORD: wp
      WORDPRESS_DB_NAME: wordpress
    volumes:
      - wp_data:/var/www/html                                        # WP core (persists)
      - ./themes/<slug>:/var/www/html/wp-content/themes/<slug>       # your theme, live-mounted

  wpcli:
    image: wordpress:cli
    depends_on: [wordpress]
    entrypoint: ["tail","-f","/dev/null"]        # stays alive so `exec` works
    environment:
      WORDPRESS_DB_HOST: db
      WORDPRESS_DB_USER: wp
      WORDPRESS_DB_PASSWORD: wp
      WORDPRESS_DB_NAME: wordpress
    volumes:
      - wp_data:/var/www/html
      - ./themes/<slug>:/var/www/html/wp-content/themes/<slug>

volumes: { db_data: {}, wp_data: {} }
```

```bash
docker compose up -d          # first run pulls images (~1–2 min)
# site → http://localhost:8080   (302 to /wp-admin/install.php until installed)
```

- **Mount the theme folder directly to its slug path** (`./themes/<slug>` →
  `wp-content/themes/<slug>`), not to a generic `custom/` dir — the folder name
  *is* the theme slug. Mount it into **both** `wordpress` and `wpcli`.
- **Windows/WSL:** Docker needs the *Virtual Machine Platform* feature on and
  CPU virtualization enabled in BIOS. `wsl -d docker-desktop echo ok` is the
  green-light check; "virtualization is not enabled" → enable VT-x/SVM in
  firmware. This is the one step no software can do for the user.
- `docker compose stop` when done; `up -d` to resume. `down` removes containers
  but volumes (and the DB) persist.

**LocalWP** (localwp.com) is the no-terminal alternative for a beginner — same
theme zip installs the same way. Docker is better when *you* are driving.

---

## 2 · WP-CLI bootstrap — install + pages + front page, scripted

Run everything through the `wpcli` container with `docker compose exec -T wpcli
wp …`. Full first-time setup:

```bash
cd wp-site
WP="docker compose exec -T wpcli wp"

# 1) install core (idempotent-ish; errors if already installed)
$WP core install --url="http://localhost:8080" --title="Site Name" \
  --admin_user=admin --admin_password=admin --admin_email=you@example.com --skip-email

# 2) activate the theme + set the tagline
$WP theme activate <slug>
$WP option update blogdescription "Your tagline here"

# 3) create pages, capture IDs, assign page templates
HOME=$($WP post create --post_type=page --post_status=publish --post_title="Home"     --post_name=home     --porcelain | tr -d '\r')
ABOUT=$($WP post create --post_type=page --post_status=publish --post_title="About"    --post_name=about    --porcelain | tr -d '\r')
SVC=$($WP  post create --post_type=page --post_status=publish --post_title="Services"  --post_name=services --porcelain | tr -d '\r')
CON=$($WP  post create --post_type=page --post_status=publish --post_title="Contact"   --post_name=contact  --porcelain | tr -d '\r')

# a page template is just a meta value — the file's `Template Name:` header must match
$WP post meta update $ABOUT _wp_page_template template-about.php
$WP post meta update $SVC   _wp_page_template template-services.php
$WP post meta update $CON   _wp_page_template template-contact.php

# 4) static front page → uses front-page.php
$WP option update show_on_front page
$WP option update page_on_front $HOME

# 5) pretty permalinks (so /about/ works) — flush after
$WP rewrite structure '/%postname%/' --hard
$WP rewrite flush --hard
```

- `--porcelain` returns just the new post ID. `tr -d '\r'` strips the CR that
  Docker-on-Windows appends, or the meta update silently targets the wrong ID.
- `front-page.php` is used for the front page **automatically** once
  `show_on_front=page` + `page_on_front` are set — no template assignment needed
  on the Home page itself.
- The `wordpress:latest` image has Apache + mod_rewrite on, so pretty permalinks
  work with no extra config.

---

## 3 · Theme structure — multi-page classic theme

For a content site with a nav (not a single landing), skip the "canvas template"
and use a normal classic theme with shared chrome:

```
<slug>/
  style.css              theme header ONLY (real CSS is in assets/)
  functions.php          enqueue + module upgrade + importmap + site-data helper + nav menus
  header.php             <!doctype>…<header class="chrome"> nav + #menu overlay + skip link
  footer.php             <footer> + reveal safety net + wp_footer()
  front-page.php         HOME composition
  template-about.php     /* Template Name: … About */  inner page
  template-services.php  inner page
  template-contact.php   inner page
  page.php  index.php    fallbacks (generic page + archive)
  assets/css/core.css    engine + palette
  assets/css/page.css    layout / type-scale / section styles  ← most visual edits
  assets/js/engine.js  nav.js  theme.js   (+ gl.js scenes.js if WebGL)
  assets/img/…           downscaled photos, team, logo
  screenshot.png         1200×900 gallery thumbnail
```

**A site-data helper in `functions.php`** keeps NAP (name/address/phone) in one
place, echoed everywhere — change it once:

```php
function site_data() {
  return [
    'full'   => 'Full Legal Name',
    'email'  => 'info@example.com',
    'phones' => ['+1 555-000-1111', '+1 555-000-2222'],
    'addr'   => '123 Main St, City, ST 00000',
    'hours'  => 'Mon–Fri · 9–5',
  ];
}
```

**Page templates** are declared by a header comment and assigned by meta (step 2
above):
```php
<?php /* Template Name: SSGC About */ ?>
```

**Nav** — build the `<a>` list from a small PHP array in `header.php` so the
markup exactly matches what `core.css`/`nav.js` expect (a `wp_nav_menu()` wraps
extra `<ul>`s that fight the `.links` flex). Register menus in `functions.php`
for future editability, but render the array for pixel control.

---

## 4 · Porting the engine into WordPress — the traps

These are the ones that actually broke the real build:

### 4a · The height-locked unit trap (the big one)
The engine's `--u`/`--h` units scale to **viewport height**. That's right for a
single cinematic viewport, but on a **scrolling multi-page content site viewed in
a short window** it makes type tiny and leaves huge side margins — the client
says "fonts too small, too much empty space." Fix in `page.css` (loads after
`core.css`), overriding the type scale and container with **rem/clamp**:

```css
:root{ --maxw:1320px; }
.wrap{ width:100%; max-width:var(--maxw); margin:0 auto; padding:0 clamp(22px,4.5vw,68px); }
.hero h1{ font-size:clamp(2.9rem,5.6vw,5.4rem); line-height:1.02; }
h2{ font-size:clamp(2rem,3.6vw,3.3rem); }
.lead{ font-size:clamp(1.15rem,1.5vw,1.5rem); }
p{ font-size:clamp(1.02rem,1.15vw,1.18rem); line-height:1.7; }
.section{ padding:clamp(54px,6vw,96px) 0; }
```
Keep `--u`/`--h` for any true full-viewport hero rig; use rem/clamp for
readable body content. A content site is not a single locked frame.

### 4b · Anti-flash colour must match the preset
`header.php` sets the pre-CSS background inline. For a **light** build it must be
the light ground, not the engine's default black — otherwise a black flash on a
white page:
```php
<html <?php language_attributes(); ?> class="no-gl no-js">
<head>
<meta charset="<?php bloginfo('charset'); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>html,body{background:#fbfaf7;color:#141210}</style>   <!-- light preset -->
<script>document.documentElement.classList.remove('no-js');</script>
<?php wp_head(); ?></head>
<body <?php body_class(); ?> style="background:#fbfaf7;color:#141210">
```

### 4c · Cache-busting on every edit
Enqueue with a **version constant** and bump it whenever you touch CSS/JS, or the
browser serves the stale file and "your change didn't apply":
```php
define('SSGC_VER', '1.4.0');   // bump on every asset edit
wp_enqueue_style('core', get_template_directory_uri().'/assets/css/core.css', [], SSGC_VER);
```

### 4d · Reveal safety net (never-blank, WP edition)
The scroll-reveal starts elements at `opacity:0`. If the ES module fails to load
(a plugin conflict, a CSP, a syntax slip), content stays invisible. Add a classic
(non-module) fallback in `footer.php` that force-reveals **only if the engine
never ran**, so the scroll effect is preserved when it does:
```html
<script>
(function(){var f=function(){var e=document.querySelectorAll('[data-reveal]:not(.in)');
for(var i=0;i<e.length;i++)e[i].classList.add('in');};
window.addEventListener('load',function(){setTimeout(function(){
if(!document.querySelector('[data-reveal].in'))f();},1600);});})();
</script>
```
Pair with `.no-js [data-reveal]{opacity:1!important;transform:none!important}` in
`page.css` and the inline `no-js`-removal in §4b.

### 4e · Scroll-responsive reveal (re-trigger)
If the client wants text to animate **every** time a section enters view (not
once), replace `engine.js`'s one-shot observer with a re-triggering one in
`theme.js` — add `.in` on enter, remove on leave:
```js
const io = new IntersectionObserver((es)=>{ for(const e of es)
  e.target.classList.toggle('in', e.isIntersecting); },
  { threshold:0.12, rootMargin:'0px 0px -12% 0px' });
document.querySelectorAll('[data-reveal]').forEach(el=>io.observe(el));
```
Guard it with `prefers-reduced-motion` (show all, observe none).

### 4f · Other WP traps
- Reference every asset with `get_template_directory_uri()`, never a hard path.
- The Docker WP image warns `Unable to create wp-content/uploads/…` — harmless
  for a code-built theme (no media library uploads); ignore, or
  `docker compose exec wordpress chown -R www-data:www-data wp-content/uploads`.
- `overflow-x:clip`, never `hidden`, on any sticky-rig ancestor (same as Vanilla).
- Inner-page hero top padding must clear the fixed header:
  `padding-top: calc(var(--nav-h) + …)`.

---

## 5 · Editable content — only when the client will self-edit

- **Static (default):** copy lives in the templates + `site_data()`. The client
  emails you changes, or edits PHP. Fine for a one-off delivered site.
- **ACF (Advanced Custom Fields):** register fields, echo them in templates →
  the client edits hero text, stats, services from wp-admin. Add it **only** when
  self-editing is a real requirement; it is weight otherwise.
- **Block patterns / theme.json:** for clients who live in the block editor.
- **WooCommerce:** products/cart/checkout — keep the cinematic hero on the home
  template, let Woo own the shop pages.

---

## 6 · Forms

The emitted contact section is a **`mailto:` form** by default (opens the
visitor's mail app — zero backend, works anywhere). For real submissions:
- **Live WordPress:** Contact Form 7 or WPForms (a plugin + a shortcode in the
  template). Server sends the mail.
- **Static export (see §7):** the mailto still works; for captured submissions
  switch to **Netlify Forms** — add `netlify` + `name="contact"` to the `<form>`
  and a hidden `form-name` input; Netlify collects entries, no backend.

Say plainly in handover that the default form has no backend.

---

## 7 · Static export (WordPress → static files for a fast, free demo)

For a **client preview** that stays up with the PC off, export the local WP to
static HTML and host it free. No plugin needed for a small site — crawl with
`curl` (the boxes rarely have `wget`):

```bash
BASE="http://localhost:8080"; OUT="static-export"; UA="Mozilla/5.0 Chrome/126"
rm -rf "$OUT"; mkdir -p "$OUT"

# 1) fetch each page to /<slug>/index.html (pretty-URL friendly)
curl -sL -A "$UA" "$BASE/"          -o "$OUT/index.html"
for p in about services contact; do
  mkdir -p "$OUT/$p"; curl -sL -A "$UA" "$BASE/$p/" -o "$OUT/$p/index.html"; done

# 2) collect every localhost asset the HTML references (files only)
grep -rhoE "http://localhost:8080[^\"')( ]+\.(css|js|png|jpe?g|webp|svg|woff2?|ico|gif)" "$OUT" \
  | sort -u > /tmp/files.txt

# 3) download each, preserving path (strip the ?ver query for the filename)
while read -r url; do rel="${url#http://localhost:8080}"; rel="${rel%%\?*}"
  dest="$OUT$rel"; mkdir -p "$(dirname "$dest")"; curl -sfL -A "$UA" "$url" -o "$dest"; done < /tmp/files.txt

# 4) rewrite absolute localhost refs → root-relative (works at a domain root)
find "$OUT" -type f \( -name '*.html' -o -name '*.css' -o -name '*.js' \) \
  -exec sed -i 's#http://localhost:8080##g' {} +
```

- Root-relative `/wp-content/…` paths + Netlify serving `/about/` →
  `about/index.html` means nav and assets just work. Google Fonts stay external
  (keep those absolute URLs).
- `?ver=` query strings survive in the HTML; a static host ignores the query and
  serves the file — fine.
- The classic theme emits only your CSS/JS + a harmless `wp-emoji` script; there
  is no block-library CSS to chase.

### The zip-path bug that breaks Netlify (learned the hard way)
**Windows PowerShell `Compress-Archive` writes zip entries with backslashes.**
Netlify's (Unix) unzipper then reads `wp-content\…\page.css` as one flat
filename, so every `/wp-content/…` 404s and the site loads **unstyled**. Fixes,
in order of preference:
1. **Drag the folder, not a zip** — Netlify Deploys accepts a folder; no zip, no
   bug.
2. **Zip with `tar` (bsdtar, ships in Win10+ and every Unix)** — forward slashes:
   ```powershell
   tar.exe -a -c -f site.zip -C static-export index.html about services contact wp-content
   # verify: tar.exe -tf site.zip  → paths must use / not \
   ```
Never trust `Compress-Archive` for anything a Unix host will unzip.

---

## 8 · Deploying the static export

**Two Netlify surfaces — don't confuse them:**
- **Netlify Drop** (`app.netlify.com/drop`) — drag a folder/zip → **new** site,
  no login. Good for the very first throwaway link.
- **Site → Deploys tab** → *"Drag and drop your site output folder here"* →
  **updates the existing site in place**, keeping its domain + certificate. Use
  this for every update after the first.

**CLI alternative** (needs a token, fully scriptable):
```bash
npx netlify-cli deploy --dir=static-export --prod --site <SITE_ID> --auth <TOKEN>
```

### Custom subdomain (e.g. preview.clientdomain.com → Netlify)
Order matters or the cert provisions wrong:
1. **Netlify → Domain management → Add a domain alias** = `preview.clientdomain.com`
   (do this *before* the DNS record).
2. **DNS host → add a CNAME:** name = `preview` (the label only — the host
   appends the domain; typing the full name yields `preview.domain.com.domain.com`),
   value = `<site>.netlify.app`, TTL 300.
3. **Verify:** `nslookup preview.clientdomain.com` → resolves to `*.netlify.app`
   → Netlify's load-balancer IPs.
4. **Certificate is automatic + free** (Let's Encrypt): Domain management → HTTPS
   → once DNS resolves, *Verify DNS configuration* → *Provision certificate*
   (~1 min–1 h) → enable **Force HTTPS**. Renews itself forever.
5. **Kill the duplicate copy:** set the custom domain as **primary domain** so
   `*.netlify.app` 301-redirects to it — otherwise two live copies of the
   client's brand both return 200.

Same pattern for **Cloudflare Pages / Vercel** (CNAME to their target). A tunnel
(`cloudflared tunnel --url http://localhost:8080`) gives an instant public link
to the *live* WP, but only while the PC + tunnel run, and WP's hardcoded
`siteurl` needs a dynamic-host `wp-config` shim or links break — prefer the
static export for a client demo.

---

## 9 · Developer handoff — give them everything to run + edit

Package the whole project so the next person runs it in two commands:

```bash
# export the DB (pages, menus, settings, active theme) to a portable dump
docker compose exec -T wpcli wp db export - --add-drop-table > site-db.sql
```

Ship a **forward-slash zip** (tar, §7) of:
```
docker-compose.yml   site-db.sql   README.md   themes/<slug>/
```

The README's run steps:
```bash
docker compose up -d
docker compose exec -T wpcli wp db import - < site-db.sql   # restores everything
# → http://localhost:8080   admin/admin at /wp-admin
```
Include: the file-map (§3), *where to change text/colour/spacing* (site_data,
core.css palette, page.css), "bump SSGC_VER after CSS edits", how to deploy
(§8), and change `admin/admin` before going live:
```bash
docker compose exec -T wpcli wp user update admin --user_pass='strong-pass'
```

**GitHub** is the cleaner handoff when the next person is a developer: `git init`
the working dir (gitignore nothing sensitive beyond real secrets), push, they
`git clone`. The DB dump can live in the repo for a demo, or be left out and
recreated via the §2 bootstrap.

---

## 10 · WordPress verification checklist (add to the Step 7 pass)

- [ ] `docker compose ps` — db, wordpress, wpcli all **Up**.
- [ ] `curl -sL localhost:8080/` → 200, and `.../<theme>/assets/css/page.css` → 200.
- [ ] Every page (`/`, `/about/`, `/services/`, `/contact/`) → 200 with the theme
      chrome present (`grep 'class="chrome"'`).
- [ ] Module scripts render as `type="module"` (the `script_loader_tag` filter).
- [ ] Importmap printed in `<head>` **before** any module (only if WebGL is used).
- [ ] Light build: anti-flash colour is the light ground, not black.
- [ ] Reveal fires on scroll **and** the safety net force-shows on module failure.
- [ ] Type is readable in a short window (the rem/clamp override, not raw `--h`).
- [ ] Static export: 0 remaining `localhost:8080` refs; zip uses forward slashes.
- [ ] Deployed: custom domain 200 + styled; `*.netlify.app` **redirects** (not 200).
- [ ] Handoff zip imports cleanly on a fresh `docker compose up`.
