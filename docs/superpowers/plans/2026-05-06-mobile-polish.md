# Mobile Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every section of the Supreme Syndicate site look premium and animate smoothly on all mobile screen sizes (320px–768px) while leaving the desktop experience byte-for-byte identical.

**Architecture:** Pure CSS + minimal HTML additions. No changes to `main.js`. Hamburger menu uses a small inline `<script>` block (not main.js). All mobile overrides live inside `@media` blocks. The four scattered `@media (max-width: 768px)` blocks in `style.css` are consolidated into one at the bottom of the file.

**Tech Stack:** Vanilla HTML5, CSS3 (media queries, CSS animations, backdrop-filter)

---

## Files Modified

| File | Changes |
|------|---------|
| `index.html` | Add hamburger `<button>`, mobile nav overlay `<div>`, inline toggle `<script>` |
| `css/style.css` | Hamburger + overlay styles, hero fixes, products fixes, clients fixes, footer fixes, 390px breakpoint, prefers-reduced-motion, consolidate 768px blocks |

---

## Task 1: Add Hamburger Button + Overlay HTML

**Files:**
- Modify: `index.html` — `<nav>` and immediately after it

- [ ] **Step 1: Add hamburger button inside the navbar**

Find this exact block inside `<nav class="navbar ...">`:
```html
        <a href="#contact" class="nav-cta">Connect</a>
    </nav>
```

Replace with:
```html
        <a href="#contact" class="nav-cta">Connect</a>
        <button class="nav-hamburger" id="navHamburger" aria-label="Open menu" aria-expanded="false">
            <span></span>
            <span></span>
            <span></span>
        </button>
    </nav>
```

- [ ] **Step 2: Add mobile overlay immediately after the closing `</nav>` tag**

Find:
```html
    </nav>

    <header class="hero">
```

Replace with:
```html
    </nav>

    <div class="nav-mobile-overlay" id="navOverlay" aria-hidden="true">
        <div class="nav-mobile-links">
            <a href="#brands" class="nmo-link">Brands</a>
            <a href="#products" class="nmo-link">Products</a>
            <a href="#about" class="nmo-link">About Us</a>
            <a href="#contact" class="nmo-link">Contact Us</a>
            <a href="#contact" class="nmo-cta">Connect</a>
        </div>
    </div>

    <header class="hero">
```

- [ ] **Step 3: Add inline toggle script at bottom of body**

Find the very last `</script>` tag before `</body>`:
```html
    </script>
</body>
```

Replace with:
```html
    </script>

    <script>
        (function () {
            var btn = document.getElementById('navHamburger');
            var overlay = document.getElementById('navOverlay');
            if (!btn || !overlay) return;
            function closeMenu() {
                document.body.classList.remove('nav-open');
                btn.setAttribute('aria-expanded', 'false');
                overlay.setAttribute('aria-hidden', 'true');
            }
            btn.addEventListener('click', function () {
                var open = document.body.classList.toggle('nav-open');
                btn.setAttribute('aria-expanded', String(open));
                overlay.setAttribute('aria-hidden', String(!open));
            });
            overlay.querySelectorAll('a').forEach(function (a) {
                a.addEventListener('click', closeMenu);
            });
        })();
    </script>
</body>
```

- [ ] **Step 4: Verify HTML structure**

Open `index.html` in a browser. On desktop: no hamburger visible. On mobile emulator (DevTools → iPhone SE): hamburger icon appears top-right. Tapping it does nothing visually yet (CSS not added).

---

## Task 2: Add Hamburger + Overlay CSS

**Files:**
- Modify: `css/style.css` — append new rules before the final `@media (max-width: 768px)` block at line 2559

- [ ] **Step 1: Append hamburger and overlay styles**

Find the line that reads:
```css
@media (max-width: 768px) {

  body, html {
```
(This is the large mobile block starting around line 2559.)

Insert the following block **immediately before** that line:

```css
/* ============================================================
   HAMBURGER NAV
   ============================================================ */
.nav-hamburger {
  display: none;
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
  color: var(--text-dark);
}
.nav-hamburger span {
  display: block;
  width: 24px;
  height: 2px;
  background: currentColor;
  border-radius: 2px;
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease;
  transform-origin: center;
}
body.dark-hero-active .nav-hamburger { color: var(--white); }
body.nav-open .nav-hamburger span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
body.nav-open .nav-hamburger span:nth-child(2) { opacity: 0; transform: scaleX(0); }
body.nav-open .nav-hamburger span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

.nav-mobile-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(9, 14, 23, 0.97);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
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
  color: rgba(255, 255, 255, 0.75);
  text-decoration: none;
  letter-spacing: -0.03em;
  line-height: 1.2;
  opacity: 0;
  transition: color 0.2s ease, transform 0.2s ease;
}
.nmo-link:active { color: #fff; }
.nmo-cta {
  opacity: 0;
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
  transition: background 0.2s ease, transform 0.2s ease;
}
.nmo-cta:active { background: #1d4ed8; transform: scale(0.97); }

@keyframes slideInLink {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}
body.nav-open .nmo-link:nth-child(1) { animation: slideInLink 0.45s 0.08s cubic-bezier(0.16, 1, 0.3, 1) both; }
body.nav-open .nmo-link:nth-child(2) { animation: slideInLink 0.45s 0.15s cubic-bezier(0.16, 1, 0.3, 1) both; }
body.nav-open .nmo-link:nth-child(3) { animation: slideInLink 0.45s 0.22s cubic-bezier(0.16, 1, 0.3, 1) both; }
body.nav-open .nmo-link:nth-child(4) { animation: slideInLink 0.45s 0.29s cubic-bezier(0.16, 1, 0.3, 1) both; }
body.nav-open .nmo-cta              { animation: slideInLink 0.45s 0.36s cubic-bezier(0.16, 1, 0.3, 1) both; }

@media (max-width: 768px) {
  .nav-hamburger { display: flex; }
  .nav-mobile-overlay { display: block; }
  .navbar .nav-cta { display: none; }
}
```

- [ ] **Step 2: Verify hamburger on mobile**

Open in DevTools → iPhone SE (375px). Tap the hamburger: overlay should fade in with staggered link entrance. Each link should slide up. Tap a link: overlay closes. Desktop: hamburger is invisible, original nav intact.

---

## Task 3: Fix Hero Float Cells on Mobile

**Files:**
- Modify: `css/style.css` — inside the large `@media (max-width: 768px)` block (around line 2659–2677 in current file, slightly shifted after Task 2 inserts)

- [ ] **Step 1: Update float cell rules inside the 768px block**

Find this block inside `@media (max-width: 768px)`:
```css
  .hero .fc-1, .hero .fc-complex, .hero .fc-4, .hero .fc-5, .hero .fc-3 {

    display: block !important; 

    opacity: 0.6 !important; 

    pointer-events: none;

    filter: drop-shadow(0 15px 30px rgba(0,0,0,0.4)) !important;

  }

  .fc-1 { width: 40vw; top: 58% !important; bottom: auto !important; left: auto !important; right: 5%; } 

  .fc-complex { width: 75vw; top: 12% !important; left: 8% !important; right: auto !important; } 

  .fc-4 { width: 28vw; top: 45%; left: 5%; } 

  .fc-3 { width: 25vw; top: 42% !important; right: 5% !important; bottom: auto !important; } 

  .fc-5 { width: 32vw; top: 62% !important; left: 8% !important; bottom: auto !important; } 
```

Replace with:
```css
  .hero .fc-1, .hero .fc-complex, .hero .fc-4, .hero .fc-3 {

    display: block !important;

    opacity: 0.45 !important;

    pointer-events: none;

    filter: drop-shadow(0 15px 30px rgba(0,0,0,0.4)) !important;

  }

  .hero .fc-2, .hero .fc-5 { display: none !important; }

  .fc-1 { width: 38vw; top: 58% !important; bottom: auto !important; left: auto !important; right: 4%; }

  .fc-complex { width: 55vw; top: 10% !important; left: 8% !important; right: auto !important; }

  .fc-4 { width: 26vw; top: 46%; left: 4%; }

  .fc-3 { width: 24vw; top: 43% !important; right: 4% !important; bottom: auto !important; }
```

- [ ] **Step 2: Verify hero on mobile**

DevTools → iPhone SE. Confirm the large floating cell (fc-complex) no longer covers the hero text. Confirm fc-2 and fc-5 are not visible. Confirm remaining cells are subtle (opacity 0.45).

---

## Task 4: Fix Product Cards on Mobile

**Files:**
- Modify: `css/style.css` — inside the large `@media (max-width: 768px)` block

- [ ] **Step 1: Update horizontal track and card rules**

Find inside `@media (max-width: 768px)`:
```css
  .horizontal-track {

    flex-direction: column;

    padding: 0 6vw;

    width: 100% !important;

    transform: none !important; 

    will-change: auto !important; 

    gap: 4rem; 

    padding-bottom: 0 !important; 

  }

  .horizontal-card {

    width: 100%;

    height: auto;

    grid-template-columns: 1fr;

    margin-right: 0;

    position: sticky;

    box-shadow: 0 -20px 40px rgba(0,0,0,0.06); 

    transition: transform 0.3s ease;

  }

  .horizontal-card:nth-child(1) { top: 100px; }

  .horizontal-card:nth-child(2) { top: 120px; }

  .horizontal-card:nth-child(3) { top: 140px; }

  .horizontal-card:nth-child(4) { top: 160px; }

  .hc-img {

    height: 250px;

  }

  .hc-content {

    padding: 2rem;

  }

  .hc-index {

    margin-bottom: 1rem;

  }
```

Replace with:
```css
  .horizontal-track {

    flex-direction: column;

    padding: 0 6vw;

    width: 100% !important;

    transform: none !important;

    will-change: auto !important;

    gap: 2rem;

    padding-bottom: 0 !important;

  }

  .horizontal-card {

    width: 100%;

    height: auto;

    grid-template-columns: 1fr;

    margin-right: 0;

    position: sticky;

    border-radius: 28px;

    box-shadow: 0 -20px 40px rgba(0,0,0,0.06);

    transition: transform 0.3s ease;

  }

  .horizontal-card:nth-child(1) { top: 80px; }

  .horizontal-card:nth-child(2) { top: 96px; }

  .horizontal-card:nth-child(3) { top: 112px; }

  .horizontal-card:nth-child(4) { top: 128px; }

  .hc-img {

    height: 220px;

  }

  .hc-content {

    padding: 2rem;

  }

  .hc-content h3 {

    font-size: 1.75rem;

  }

  .hc-index {

    margin-bottom: 1rem;

  }
```

- [ ] **Step 2: Verify product cards on mobile**

DevTools → iPhone SE. Scroll into the products section. Cards should stack cleanly with a visible stagger. Card text should not overflow. Image height should look balanced.

---

## Task 5: Fix Clients Section on Mobile

**Files:**
- Modify: `css/style.css` — inside the large `@media (max-width: 768px)` block

- [ ] **Step 1: Update clients header padding and logo grid**

Find inside `@media (max-width: 768px)`:
```css
  .clients-logo-grid {

    grid-template-columns: repeat(1, 1fr); 

    gap: 1.5rem;

    padding-bottom: 80vh; 

    display: flex;

    flex-direction: column;

  }

  .client-logo-item {

    min-height: 200px;

    padding: 2rem 1.5rem 1.5rem;

    position: sticky;

    box-shadow: 0 -20px 40px rgba(0,0,0,0.06);

  }

  .client-logo-item:nth-child(1) { top: 100px; z-index: 1; }

  .client-logo-item:nth-child(2) { top: 110px; z-index: 2; }

  .client-logo-item:nth-child(3) { top: 120px; z-index: 3; }

  .client-logo-item:nth-child(4) { top: 130px; z-index: 4; }

  .client-logo-item:nth-child(5) { top: 140px; z-index: 5; }

  .client-logo-item:nth-child(6) { top: 150px; z-index: 6; }
```

Replace with:
```css
  .clients-header {

    padding-top: 8vh !important;

  }

  .clients-logo-grid {

    grid-template-columns: repeat(1, 1fr);

    gap: 1.5rem;

    padding-bottom: 40vh;

    display: flex;

    flex-direction: column;

  }

  .client-logo-item {

    min-height: 200px;

    padding: 2rem 1.5rem 1.5rem;

    position: sticky;

    box-shadow: 0 -20px 40px rgba(0,0,0,0.06);

  }

  .client-logo-item:nth-child(1) { top: 80px;  z-index: 1; }

  .client-logo-item:nth-child(2) { top: 90px;  z-index: 2; }

  .client-logo-item:nth-child(3) { top: 100px; z-index: 3; }

  .client-logo-item:nth-child(4) { top: 110px; z-index: 4; }

  .client-logo-item:nth-child(5) { top: 120px; z-index: 5; }

  .client-logo-item:nth-child(6) { top: 130px; z-index: 6; }
```

- [ ] **Step 2: Verify clients on mobile**

DevTools → iPhone SE. Scroll through the clients section. Logos should stack with a clean card-fan effect. After the last logo there should be a short scroll buffer (40vh) before the footer — not the current massive 80vh empty space.

---

## Task 6: Fix Footer on Mobile

**Files:**
- Modify: `css/style.css` — inside the large `@media (max-width: 768px)` block

- [ ] **Step 1: Update footer rules**

Find inside `@media (max-width: 768px)`:
```css
  .footer-premium .container.footer-content-layer {

    width: 100% !important;

    padding: 0 6vw !important;

    justify-content: center !important;

    position: relative !important;

    transform: none !important;

    top: auto !important;

    left: auto !important;

    margin-top: 3rem !important;

  }

  .footer-contact-card {

    padding: 2.5rem 1.5rem;

    width: 100%;

    max-width: 100%;

  }
```

Replace with:
```css
  .footer-premium {

    padding: 4rem 0 3rem !important;

    min-height: auto !important;

  }

  .footer-premium .container.footer-content-layer {

    width: 100% !important;

    padding: 0 6vw !important;

    justify-content: center !important;

    position: relative !important;

    transform: none !important;

    top: auto !important;

    left: auto !important;

    margin-top: 2rem !important;

    pointer-events: auto !important;

  }

  .footer-contact-card {

    padding: 2.5rem 1.5rem;

    width: 100%;

    max-width: 100%;

  }

  .footer-massive-text {

    position: relative !important;

    bottom: auto !important;

    right: auto !important;

    top: auto !important;

    left: auto !important;

    transform: none !important;

    text-align: center;

    margin-top: 2rem;

    padding-bottom: 2rem;

  }

  .footer-massive-text h1 {

    font-size: 14vw !important;

    white-space: normal !important;

    color: rgba(255, 255, 255, 0.12) !important;

    line-height: 0.9;

  }
```

- [ ] **Step 2: Verify footer on mobile**

DevTools → iPhone SE. Scroll to the footer. The contact card should appear first, fully readable. Below it, "SUPREME SYNDICATE" text should render as a large subtle watermark, not overlapping the card. Footer should not have 100vh+ height.

---

## Task 7: Add 390px Breakpoint

**Files:**
- Modify: `css/style.css` — append new block after the large 768px block

- [ ] **Step 1: Append the 390px breakpoint block**

Add the following after the closing `}` of the last `@media (max-width: 768px)` block:

```css
/* ============================================================
   VERY SMALL SCREENS (iPhone SE, Galaxy A, 320px–390px)
   ============================================================ */
@media (max-width: 390px) {
  .hero-title {
    font-size: clamp(1.9rem, 10vw, 2.4rem);
  }
  .brand-tile {
    padding: 1.2rem 0.8rem;
  }
  .brand-tile img {
    max-height: 36px;
  }
  .hc-content {
    padding: 1.5rem;
  }
  .hc-content h3 {
    font-size: 1.5rem;
  }
  .fcc-header h3 {
    font-size: 2rem;
  }
  .fcc-value {
    white-space: normal;
    word-break: break-word;
  }
  .clients-title {
    font-size: clamp(2rem, 9vw, 2.6rem);
  }
  .footer-massive-text h1 {
    font-size: 18vw !important;
  }
}
```

- [ ] **Step 2: Verify on small screens**

DevTools → iPhone SE (375px) and Galaxy S5 (360px). Hero title should be readable. Brand logos should fit without overflow. Footer email address should wrap correctly instead of overflowing.

---

## Task 8: Add prefers-reduced-motion

**Files:**
- Modify: `css/style.css` — append after the 390px block

- [ ] **Step 1: Append reduced-motion block**

Add after the closing `}` of the 390px block:

```css
/* ============================================================
   REDUCED MOTION (accessibility)
   ============================================================ */
@media (prefers-reduced-motion: reduce) {
  .hsi-dot,
  .card-glow-blob,
  .fcc-badge::before,
  .nav-cta::before,
  .fcc-icon svg,
  .fcc-item:nth-child(1) .fcc-icon svg,
  .fcc-item:nth-child(2) .fcc-icon svg,
  .fcc-item:nth-child(3) .fcc-icon svg,
  .fcc-item:nth-child(4) .fcc-icon svg,
  .nmo-link,
  .nmo-cta {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
  .footer-contact-card,
  .brand-tile,
  .client-logo-item,
  .fcc-item,
  .legacy-image img,
  .nav-hamburger span,
  .nav-mobile-overlay {
    transition: none !important;
  }
}
```

- [ ] **Step 2: Verify in DevTools**

DevTools → Rendering tab → check "Emulate CSS media feature prefers-reduced-motion: reduce". Reload. Scroll indicator dot, icon animations, blob float should all be still. Hamburger overlay should appear instantly (no fade). GSAP entrance animations (hero title, brand tiles) still run — those are JS not CSS.

---

## Task 9: Consolidate Scattered 768px Media Query Blocks

**Files:**
- Modify: `css/style.css`

**Context:** There are currently 4 separate `@media (max-width: 768px)` blocks scattered across the file (at roughly lines 1404, 1496, 1700, and 2559). The first three are small (1–5 rules each). The fourth is the large main block. This task merges the small three into the large one and removes the empty shells.

- [ ] **Step 1: Identify the three small scattered blocks**

The three small blocks contain these rules respectively:

**Block at ~line 1404:**
```css
@media (max-width: 768px) {

  .footer-grid {

    grid-template-columns: 1fr;

  }

}
```

**Block at ~line 1496:**
```css
@media (max-width: 768px) {

  .footer-links {

    justify-content: flex-start;

  }

}
```

**Block at ~line 1700:**
```css
@media (max-width: 768px) {

  .eco-grid {

    grid-template-columns: 1fr;

  }

  .clients-grid {

    grid-template-columns: repeat(2, 1fr);

  }

  .cb-large,

  .cb-wide {

    grid-column: span 1;

    grid-row: span 1;

  }

  .nav-links {

    display: none;

  }

}
```

- [ ] **Step 2: Remove the three small scattered blocks from their current locations**

Use PowerShell to remove each block. Each block starts with `@media (max-width: 768px) {` and ends with its own closing `}`. Remove all three blocks from their current positions in the file. (See implementation notes below for exact PowerShell approach.)

- [ ] **Step 3: Add the orphaned rules to the bottom of the main 768px block**

At the end of the large `@media (max-width: 768px)` block (just before its closing `}`), add:

```css
  .footer-grid {
    grid-template-columns: 1fr;
  }
  .footer-links {
    justify-content: flex-start;
  }
  .eco-grid {
    grid-template-columns: 1fr;
  }
  .clients-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .cb-large,
  .cb-wide {
    grid-column: span 1;
    grid-row: span 1;
  }
```

Note: `.nav-links { display: none; }` is already present in the large block — do not duplicate it.

- [ ] **Step 4: Verify no visual change**

Reload the page on mobile (DevTools → iPhone SE). Footer grid, footer links, and nav links should behave identically to before. Zero visual change — this is purely organisational.

---

## Task 10: Final Commit

- [ ] **Step 1: Check for console errors**

Open DevTools → Console → reload. Zero errors expected. Zero 404s.

- [ ] **Step 2: Full mobile visual pass**

Test these screen sizes in DevTools:
- iPhone SE (375×667)
- iPhone 14 Pro (393×852)
- Samsung Galaxy S20 (360×800)
- iPad Mini (768×1024) — desktop nav should show, no hamburger

Confirm per screen:
- [ ] Hamburger appears on phone, not on iPad
- [ ] Overlay opens/closes cleanly with stagger animation
- [ ] Hero float cells are subtle, not covering the title text
- [ ] Product cards stack with visible stagger, text fits
- [ ] Clients section: short buffer after last logo, no huge gap
- [ ] Footer: contact card visible, watermark text below it
- [ ] No horizontal scroll / content overflow on any screen
- [ ] Desktop (1440px): completely unchanged

- [ ] **Step 3: Commit**

```bash
git add index.html css/style.css
git commit -m "feat(mobile): full mobile polish — hamburger nav, hero fixes, card stagger, footer, 390px breakpoint, reduced-motion"
```
