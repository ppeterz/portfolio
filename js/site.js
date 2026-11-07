/* Shared behaviour for index.html and blog.html: visit counting, nav material, mobile menu, section spy, reveal on scroll. */

/* ---------- Visit counting (GoatCounter: no cookies, no consent banner needed) ----------
   Set this to your GoatCounter code, e.g. 'pelumi-peter' for https://pelumi-peter.goatcounter.com.
   Left empty, nothing is loaded or sent. GoatCounter also ignores localhost, so previews never count. */
const GOATCOUNTER_CODE = 'pelumi-peter';

(() => {
  if (!GOATCOUNTER_CODE) return;
  window.goatcounter = { endpoint: `https://${GOATCOUNTER_CODE}.goatcounter.com/count` };
  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://gc.zgo.at/count.js';
  s.dataset.goatcounter = window.goatcounter.endpoint;
  document.head.appendChild(s);
})();

// Count a named event (a click, a sent form). Safe to call before the script loads or with no code set.
window.trackEvent = (name) => {
  try {
    if (window.goatcounter && typeof window.goatcounter.count === 'function') {
      window.goatcounter.count({ path: name, title: name, event: true });
    }
  } catch { /* counting must never break the page */ }
};

/* ---------- Nav: scroll-edge hairline, menu sheet, section spy ---------- */
(() => {
  const nav = document.getElementById('nav');
  if (!nav) return;
  const toggle = nav.querySelector('.nav-toggle');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 4);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const setOpen = (open) => {
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  toggle.addEventListener('click', () => setOpen(!nav.classList.contains('open')));
  nav.querySelectorAll('.nav-sheet a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });

  // Highlights the nav link for the section in the middle of the screen (same-page links only).
  const links = [...document.querySelectorAll('[data-spy]')].filter((l) => l.getAttribute('href').startsWith('#'));
  if (!links.length || !('IntersectionObserver' in window)) return;
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((l) => {
        if (l.getAttribute('href') === '#' + entry.target.id) l.setAttribute('aria-current', 'true');
        else l.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  links.forEach((l) => { const s = document.getElementById(l.getAttribute('href').slice(1)); if (s) spy.observe(s); });
})();

/* ---------- Reveal on scroll ---------- */
(() => {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) { els.forEach((el) => el.classList.add('in')); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  els.forEach((el) => io.observe(el));
})();
