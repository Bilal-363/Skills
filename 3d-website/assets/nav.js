/* 3d-website nav.js — header state, mobile menu, page transition curtain.
 * Copy verbatim. Depends only on engine.js. ~3KB.
 *
 * Expects (all optional — missing pieces are skipped, never thrown on):
 *   header.chrome            gains .is-stuck past 24px of scroll
 *   button#burger            toggles html.is-open
 *   nav#menu                 the overlay/drawer
 *   a[href] same-origin      intercepted for the curtain transition
 */

import { onFrame, state } from './engine.js';

const root = document.documentElement;
const reduce = matchMedia('(prefers-reduced-motion: reduce)');

/* ---------- sticky header ---------- */
const chrome = document.querySelector('.chrome');
if (chrome) {
  let stuck = null;
  onFrame((st) => {
    const next = st.scroll > 24;
    if (next !== stuck) { stuck = next; chrome.classList.toggle('is-stuck', next); }
  });
}

/* ---------- active nav item ---------- */
{
  const here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.links a, #menu a').forEach((a) => {
    const href = a.getAttribute('href') || '';
    if (href && !href.startsWith('#') && href.split('/').pop() === here) {
      a.setAttribute('aria-current', 'page');
    }
  });
}

/* ---------- mobile menu ---------- */
const burger = document.getElementById('burger');
const menu = document.getElementById('menu');

if (burger && menu) {
  let lastFocus = null;
  const scrollLock = { y: 0 };

  const focusables = () => menu.querySelectorAll(
    'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])');

  function setOpen(open) {
    if (root.classList.contains('is-open') === open) return;
    root.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.setAttribute('aria-hidden', String(!open));

    if (open) {
      lastFocus = document.activeElement;
      scrollLock.y = scrollY;
      document.body.style.overflow = 'hidden';
      focusables()[0]?.focus({ preventScroll: true });
    } else {
      document.body.style.overflow = '';       // restore, always
      lastFocus?.focus?.({ preventScroll: true });
    }
  }

  burger.setAttribute('aria-controls', 'menu');
  burger.setAttribute('aria-expanded', 'false');
  menu.setAttribute('aria-hidden', 'true');

  burger.addEventListener('click', () => setOpen(!root.classList.contains('is-open')));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });

  addEventListener('keydown', (e) => {
    if (!root.classList.contains('is-open')) return;
    if (e.key === 'Escape') { setOpen(false); return; }
    if (e.key !== 'Tab') return;
    const f = focusables();
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  /* close when the viewport goes landscape/desktop */
  const wide = matchMedia('(min-aspect-ratio:11/10)');
  wide.addEventListener('change', () => { if (wide.matches) setOpen(false); });

  /* a stale lock is worse than no lock */
  addEventListener('pagehide', () => { document.body.style.overflow = ''; });
}

/* ---------- page transition curtain ---------- */
{
  const curtain = document.createElement('div');
  curtain.className = 'curtain';
  curtain.setAttribute('aria-hidden', 'true');
  document.body.appendChild(curtain);

  /* wipe away on arrival */
  if (!reduce.matches) {
    curtain.classList.add('curtain-in');
    curtain.addEventListener('animationend', () => curtain.classList.remove('curtain-in'),
      { once: true });
  }

  document.addEventListener('click', (e) => {
    if (reduce.matches) return;
    const a = e.target.closest('a[href]');
    if (!a) return;
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (a.target === '_blank' || a.hasAttribute('download')) return;

    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin) return;                 // external
    if (url.pathname === location.pathname && url.hash) return; // in-page anchor

    e.preventDefault();
    curtain.classList.add('curtain-out');
    let done = false;
    const go = () => { if (!done) { done = true; location.href = a.href; } };
    curtain.addEventListener('animationend', go, { once: true });
    setTimeout(go, 600);                                        // never strand the user
  });
}
