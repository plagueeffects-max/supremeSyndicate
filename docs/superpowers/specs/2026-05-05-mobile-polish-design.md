# Mobile Polish — Design Spec
**Date:** 2026-05-05
**Scope:** Full mobile responsiveness overhaul. Every section polished for all screen sizes (320px–768px). Hamburger navigation added. Desktop (>768px) unchanged. `main.js` untouched.

---

## Goals
1. Every section looks premium on all mobile screen sizes (320px iPhone SE → 430px iPhone 15 Pro Max).
2. Navigation is usable on mobile via a hamburger menu overlay.
3. Animations look great on mobile — close to the desktop experience.
4. Users with motion sensitivity get `prefers-reduced-motion` support.
5. Zero regressions on desktop/laptop.

## Out of Scope
- Swipe gesture support for horizontal cards (requires new JS).
- Modifying `js/main.js` (obfuscated; untouched).
- Tablet breakpoint changes (1024px stays as-is).

---

## Files Modified

| File | Changes |
|------|---------|
| `index.html` | Add hamburger `<button>`, mobile nav overlay `<div>`, small inline toggle script |
| `css/style.css` | Hamburger + overlay styles, hero fixes, products fixes, clients fixes, footer fixes, 390px breakpoint, prefers-reduced-motion, consolidate scattered 768px blocks |

---

## Change Detail

### A. HTML — Hamburger Navigation

**Add inside `<nav class="navbar">` (after `.nav-links`, before `.nav-cta`):**
```html
<button class="nav-hamburger" id="navHamburger" aria-label="Open menu" aria-expanded="false">
  <span></span>
  <span></span>
  <span></span>
</button>
```

**Add immediately after the closing `</nav>` tag:**
```html
<div class="nav-mobile-overlay" id="navOverlay" aria-hidden="true">
  <div class="nav-mobile-links">
    <a href="#brands" class="nmo-link">Brands</a>
    <a href="#products" class="nmo-link">Products</a>
    <a href="#about" class="nmo-link">About Us</a>
    <a href="#contact" class="nmo-link">Contact Us</a>
    <a href="#contact" class="nmo-cta">Connect</a>
  </div>
</div>
```

**Add inline script at bottom of `<body>` (before closing tag):**
```html
<script>
  (function () {
    var btn = document.getElementById('navHamburger');
    var overlay = document.getElementById('navOverlay');
    if (!btn || !overlay) return;
    function close() {
      document.body.classList.remove('nav-open');
      btn.setAttribute('aria-expanded', 'false');
      overlay.setAttribute('aria-hidden', 'true');
    }
    btn.addEventListener('click', function () {
      var open = document.body.classList.toggle('nav-open');
      btn.setAttribute('aria-expanded', open);
      overlay.setAttribute('aria-hidden', !open);
    });
    overlay.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', close);
    });
  })();
</script>
```

**Behaviour:**
- Desktop (>768px): `nav-hamburger` and `nav-mobile-overlay` hidden via CSS. Original nav-links + Connect visible.
- Mobile (≤768px): `nav-links` and desktop `nav-cta` hidden. Hamburger visible top-right.
- On tap: full-screen dark overlay fades + slides in from top. Contains 4 links + Connect CTA.
- Hamburger icon: 3 bars animate to X via CSS `transform` when `body.nav-open`.
- Tapping any link or X closes the overlay.
- Body scroll is locked while menu is open (`overflow: hidden` on `body.nav-open`).

---

### B. CSS — Hamburger + Overlay Styles

```css
/* Hamburger button */
.nav-hamburger {
  display: none; /* hidden on desktop */
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  width: 44px;
  height: 44px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 1001;
}
.nav-hamburger span {
  display: block;
  width: 24px;
  height: 2px;
  background: currentColor;
  border-radius: 2px;
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s;
  transform-origin: center;
}
body.nav-open .nav-hamburger span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
body.nav-open .nav-hamburger span:nth-child(2) { opacity: 0; transform: scaleX(0); }
body.nav-open .nav-hamburger span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
/* Hamburger colour inherits from text — needs explicit white on dark hero */
body.dark-hero-active .nav-hamburger { color: var(--white); }

/* Mobile overlay */
.nav-mobile-overlay {
  display: none; /* hidden on desktop */
  position: fixed;
  inset: 0;
  background: rgba(9, 14, 23, 0.97);
  backdrop-filter: blur(16px);
  z-index: 999;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  overflow-y: auto;
}
body.nav-open .nav-mobile-overlay {
  opacity: 1;
  pointer-events: auto;
}
body.nav-open { overflow: hidden; }

.nav-mobile-links {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: 0.5rem;
  padding: 6rem 2rem 4rem;
}
.nmo-link {
  font-size: clamp(2rem, 8vw, 3rem);
  font-weight: 800;
  color: rgba(255,255,255,0.85);
  text-decoration: none;
  letter-spacing: -0.03em;
  line-height: 1.2;
  transition: color 0.2s, transform 0.2s;
  transform: translateY(0);
}
.nmo-link:hover { color: #fff; transform: translateX(8px); }

/* Staggered entrance animation for links when menu opens */
@keyframes slideInLink {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}
body.nav-open .nmo-link:nth-child(1) { animation: slideInLink 0.45s 0.05s cubic-bezier(0.16,1,0.3,1) both; }
body.nav-open .nmo-link:nth-child(2) { animation: slideInLink 0.45s 0.12s cubic-bezier(0.16,1,0.3,1) both; }
body.nav-open .nmo-link:nth-child(3) { animation: slideInLink 0.45s 0.19s cubic-bezier(0.16,1,0.3,1) both; }
body.nav-open .nmo-link:nth-child(4) { animation: slideInLink 0.45s 0.26s cubic-bezier(0.16,1,0.3,1) both; }
body.nav-open .nmo-cta          { animation: slideInLink 0.45s 0.33s cubic-bezier(0.16,1,0.3,1) both; }
.nmo-cta {
  margin-top: 2rem;
  display: inline-flex;
  align-items: center;
  padding: 1rem 2.5rem;
  background: #2563eb;
  color: #fff;
  border-radius: 100px;
  font-weight: 600;
  font-size: 1.1rem;
  text-decoration: none;
  letter-spacing: -0.01em;
  transition: background 0.2s, transform 0.2s;
}
.nmo-cta:hover { background: #1d4ed8; transform: scale(1.03); }

/* Show on mobile */
@media (max-width: 768px) {
  .nav-hamburger { display: flex; }
  .nav-mobile-overlay { display: block; }
  .navbar .nav-cta { display: none; } /* Connect lives in the overlay */
}
```

---

### C. CSS — Hero Fixes (inside existing @media max-width: 768px)

| Property | Current | New | Reason |
|----------|---------|-----|--------|
| `.fc-complex width` | `75vw` | `55vw` | 75vw covers hero text on small phones |
| `.fc-2` visibility | `display: block` | `display: none !important` | Too many cells, clutters hero |
| `.fc-5` visibility | `display: block` | `display: none !important` | Same |
| Float cell opacity | `0.6` | `0.45` | Subtler, less distracting behind text |

---

### D. CSS — Products Cards (inside existing @media max-width: 768px)

| Property | Current | New | Reason |
|----------|---------|-----|--------|
| `.horizontal-track gap` | `4rem` | `2rem` | 4rem wastes screen height between stacked cards |
| `.horizontal-card nth-child tops` | `100/120/140/160px` | `80/96/112/128px` | Tighter stagger, fits better below navbar |
| `.hc-content h3 font-size` | inherited 2.5rem | `1.75rem` | 2.5rem overflows on 375px wide screens |
| `.hc-img height` | `250px` | `220px` | Slightly shorter on small screens |

---

### E. CSS — Clients Section (inside existing @media max-width: 768px)

| Property | Current | New | Reason |
|----------|---------|-----|--------|
| `.clients-logo-grid padding-bottom` | `80vh` | `40vh` | 80vh creates a huge dead scroll zone |
| `.clients-header padding-top` | `12vh` | `8vh` | Too much space on small screens |
| Client item sticky tops | `100/110/120/130/140/150px` | `80/90/100/110/120/130px` | Tighter, works better with new navbar height |

---

### F. CSS — Footer (inside existing @media max-width: 768px)

| Property | Current | New | Reason |
|----------|---------|-----|--------|
| `.footer-premium padding` | `8rem 0 2rem` | `4rem 0 3rem` | 8rem top padding is excessive on mobile |
| `.footer-premium min-height` | `100vh` | `auto` | Forces a full-screen footer even when content is shorter |
| `.footer-massive-text` position | `absolute; bottom 12%; right 5%` | `relative; text-align: center; margin-top: 3rem` | Absolute positioning overlaps contact card on mobile |
| `.footer-massive-text h1 font-size` | `9vw` | `14vw` | At 9vw on 375px = 33px; 14vw = 52px fills width decoratively |
| `.footer-massive-text h1 opacity` via color | `rgba(255,255,255,0.25)` | `rgba(255,255,255,0.12)` | More subtle watermark on small screen |
| `.footer-massive-text h1 white-space` | `nowrap` | `normal` | Prevents overflow on very small screens |

---

### G. New Breakpoint — @media (max-width: 390px)

Covers iPhone SE (375px), Galaxy A series (360px), older Androids (320px):

```css
@media (max-width: 390px) {
  .hero-title { font-size: clamp(1.9rem, 10vw, 2.4rem); }
  .brand-tile { padding: 1.2rem 0.8rem; }
  .brand-tile img { max-height: 36px; }
  .fcc-value { white-space: normal; word-break: break-word; }
  .footer-massive-text h1 { font-size: 18vw; }
  .hc-content { padding: 1.5rem; }
  .hc-content h3 { font-size: 1.5rem; }
  .fcc-header h3 { font-size: 2rem; }
  .clients-title { font-size: clamp(2rem, 9vw, 2.6rem); }
}
```

---

### H. @media (prefers-reduced-motion: reduce)

Disables all looping CSS animations for users with motion sensitivity. GSAP scroll-trigger entrance animations (from main.js) are unaffected.

```css
@media (prefers-reduced-motion: reduce) {
  .hsi-dot,
  .card-glow-blob,
  .fcc-badge::before,
  .nav-cta::before,
  .fcc-icon svg,
  .fcc-item:nth-child(1) .fcc-icon svg,
  .fcc-item:nth-child(2) .fcc-icon svg,
  .fcc-item:nth-child(3) .fcc-icon svg,
  .fcc-item:nth-child(4) .fcc-icon svg {
    animation: none !important;
  }
  .footer-contact-card,
  .brand-tile,
  .client-logo-item,
  .fcc-item,
  .legacy-image img {
    transition: none !important;
  }
}
```

---

### I. Consolidate Scattered 768px Blocks

Currently there are **4 separate `@media (max-width: 768px)` blocks** across the CSS file (lines 1404, 1496, 1700, 2559). These will be merged into one consolidated block at the bottom, after the existing styles. Functionally identical — just cleaner.

---

## Desktop Unchanged
Zero changes to any style outside `@media (max-width: 768px)`, `@media (max-width: 390px)`, and `@media (prefers-reduced-motion: reduce)` blocks. Desktop experience is byte-for-byte identical.

---

## Verification Steps
1. Open the site on Chrome DevTools device emulator → iPhone SE (375px). Scroll through all sections.
2. Check hamburger: tap → overlay opens, links work, X closes it.
3. Check hero: floating cells don't cover the title text.
4. Check products: stacked cards stack cleanly with visible stagger.
5. Check clients: no excessive blank space after last logo.
6. Check footer: contact card visible, massive text is a subtle watermark below it.
7. Check desktop (1440px): everything identical to before.
8. Simulate `prefers-reduced-motion` in DevTools → Rendering → confirm no looping animations.
