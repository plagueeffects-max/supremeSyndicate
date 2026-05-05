# Production Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Harden `index.html` and `css/style.css` for production — fix bugs, eliminate render-blocking scripts, add SEO tags, and lazy-load below-fold images — without changing any layout, animation, or visual output.

**Architecture:** Pure static site (HTML + CSS + JS). No build step. All changes are to `index.html` and `css/style.css` only. `js/main.js` is obfuscated and must not be touched. Script execution order is preserved by using `defer` on all scripts in document order.

**Tech Stack:** Vanilla HTML5, CSS3, GSAP 3.12.2, Lenis 1.0.34, Three.js r128 (all via CDN)

---

## Files Modified

| File | Changes |
|------|---------|
| `index.html` | Add preconnect hints, move Google Fonts to `<link>`, add meta/OG tags, add `defer` to all scripts, fix hero video, add `loading="lazy"` to 18 images, fix external link security |
| `css/style.css` | Remove `@import` (line 147), remove duplicate `brands-section` block (lines 1–14), remove overbroad `will-change` from `section {}`, remove redundant `.hero-bg-video.video-ready` opacity |

---

## Task 1: HTML Head — Resource Hints + Google Fonts

**Files:**
- Modify: `index.html` (lines 1–13, the `<head>` block)

**Context:** Currently the `<head>` has no preconnect hints and Google Fonts is loaded via a CSS `@import` inside `style.css` at line 147. That `@import` is not the first rule in the file, which violates the CSS spec and may silently fail. Moving fonts to a `<link>` tag fixes both issues.

- [ ] **Step 1: Replace the opening `<head>` block**

Open `index.html`. Find this exact block (lines 4–13):

```html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Supreme Syndicate | Medical Excellence</title>
    <link rel="stylesheet" href="css/style.css">
    <script src="https://unpkg.com/@studio-freight/lenis@1.0.34/dist/lenis.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
</head>
```

Replace with:

```html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Supreme Syndicate | Medical Excellence</title>

    <!-- SEO -->
    <meta name="description" content="Supreme Syndicate – Kashmir's leading supplier of laboratory chemicals, reagents, bio-medical equipment and scientific instruments since 1978.">

    <!-- Open Graph -->
    <meta property="og:title" content="Supreme Syndicate | Medical Excellence">
    <meta property="og:description" content="Kashmir's leading supplier of laboratory chemicals, reagents, bio-medical equipment and scientific instruments since 1978.">
    <meta property="og:type" content="website">

    <!-- Preconnect to CDN hosts (opens TCP+TLS early) -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preconnect" href="https://cdnjs.cloudflare.com">
    <link rel="preconnect" href="https://unpkg.com">

    <!-- Google Fonts (replaces @import in style.css) -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700&display=swap">

    <link rel="stylesheet" href="css/style.css">

    <!-- CDN scripts — defer stops them blocking first paint; they run in document order after HTML parse -->
    <script defer src="https://unpkg.com/@studio-freight/lenis@1.0.34/dist/lenis.min.js"></script>
    <script defer src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    <script defer src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
    <script defer src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
</head>
```

- [ ] **Step 2: Verify in browser**

Open `index.html` in a browser (via `npx serve .` or live-server). Open DevTools → Network tab → filter by "Font". Confirm `Inter` and `JetBrains Mono` appear with status 200.

Open DevTools → Elements → `<head>`. Confirm `<meta name="description">` and four `<link rel="preconnect">` tags are present.

---

## Task 2: HTML Body — Defer Local Scripts

**Files:**
- Modify: `index.html` (lines 357–360, bottom of `<body>`)

**Context:** `main.js` and `footer-3d.js` are at the bottom of `<body>` (good), but without `defer` they are still parser-blocking at that point. Adding `defer` keeps execution order consistent: all deferred scripts — CDN libs first, then main.js, then footer-3d.js — run in document order after the full HTML is parsed. The inline `<script>` block (hero video random start) uses `DOMContentLoaded` so it is unaffected.

- [ ] **Step 1: Add defer to local script tags**

Find these lines near the bottom of `<body>`:

```html
    <script src="js/main.js"></script>
    <!-- Existing Footer 3D script -->
    <script src="js/footer-3d.js"></script>
```

Replace with:

```html
    <script defer src="js/main.js"></script>
    <!-- Footer WebGL -->
    <script defer src="js/footer-3d.js"></script>
```

- [ ] **Step 2: Verify animations still work**

Reload the page. Confirm:
- Hero title fades in correctly
- Horizontal card track scrolls
- Footer WebGL sphere grid animates
- Lenis smooth-scroll works throughout

---

## Task 3: HTML Body — Hero Video Fix

**Files:**
- Modify: `index.html` (the `<video>` tag inside `<header class="hero">`)

**Context:** `poster="Assets/Hero/backgroun.png"` references a file that does not exist — every page load fires a 404 request. Removing it eliminates the error. Adding `preload="metadata"` lets the browser fetch video duration/dimensions without downloading the full file, which is required by the existing random-start-time script.

- [ ] **Step 1: Fix the video tag**

Find:

```html
        <video autoplay muted loop playsinline class="hero-bg-video" poster="Assets/Hero/backgroun.png" id="heroVideo">
            <source src="Assets/Hero/bg.mp4" type="video/mp4">
        </video>
```

Replace with:

```html
        <video autoplay muted loop playsinline preload="metadata" class="hero-bg-video" id="heroVideo">
            <source src="Assets/Hero/bg.mp4" type="video/mp4">
        </video>
```

- [ ] **Step 2: Verify no 404 in Network tab**

Reload. Open DevTools → Network → filter "404" or check the Console. Confirm no `backgroun.png` 404 error appears.

Confirm the hero video still plays and the random-start-time behaviour works (each reload starts at a different frame).

---

## Task 4: HTML Body — Lazy-Load Below-Fold Images

**Files:**
- Modify: `index.html` (brand grid, legacy section, clients section)

**Context:** 18 images are below the fold and load eagerly by default, competing with hero resources for bandwidth. Adding `loading="lazy"` defers them until the user scrolls near them. Do NOT add lazy to navbar logo or hero floating cells — they are above the fold.

- [ ] **Step 1: Add loading="lazy" to brand grid images (10 images)**

Find each `<img>` inside `.brands-grid` `.brand-tile` divs. There are 10 of them. Add `loading="lazy"` to each:

```html
<div class="brand-tile"><img src="Assets/merck.png" alt="Merck" loading="lazy"></div>
<div class="brand-tile"><img src="Assets/Sigma-Aldrich-logo.png" alt="Sigma-Aldrich" loading="lazy"></div>
<div class="brand-tile"><img src="Assets/HiMedia-Logo.jpg" alt="HiMedia" loading="lazy"></div>
<div class="brand-tile"><img src="Assets/Loba.png" alt="Loba Chemie" loading="lazy"></div>
<div class="brand-tile"><img src="Assets/Tosoh_logo..png" alt="Tosoh" loading="lazy"></div>
<div class="brand-tile"><img src="Assets/moxcare-logo.png" alt="Moxcare" loading="lazy"></div>
<div class="brand-tile"><img src="Assets/Abdoslogo.png" alt="Abdos" loading="lazy"></div>
<div class="brand-tile"><img src="Assets/OmsonsLogo.png" alt="Omsons" loading="lazy"></div>
<div class="brand-tile"><img src="Assets/Rivieralogo.webp" alt="Riviera" loading="lazy"></div>
<div class="brand-tile"><img src="Assets/real gene.png" alt="Real Gene" loading="lazy"></div>
```

- [ ] **Step 2: Add loading="lazy" to legacy section images (2 images)**

Find inside `<section class="legacy-section">`:

```html
                    <img src="Assets/Shop.jpeg" alt="Shop Overview" draggable="false" oncontextmenu="return false;"
                        style="pointer-events: none;">
```
Replace with:
```html
                    <img src="Assets/Shop.jpeg" alt="Shop Overview" draggable="false" oncontextmenu="return false;"
                        loading="lazy" style="pointer-events: none;">
```

Find:
```html
                    <img src="Assets/equipment.png" alt="Lab Equipment">
```
Replace with:
```html
                    <img src="Assets/equipment.png" alt="Lab Equipment" loading="lazy">
```

- [ ] **Step 3: Add loading="lazy" to client logo images (6 images)**

Find inside `<div class="clients-logo-grid">`. Add `loading="lazy"` to each `<img>`:

```html
<div class="client-logo-item">
    <img src="Assets/Our Clients/Sher-i-Kashmir_Institute_of_Medical_Sciences_Logo.svg" alt="SKIMS" loading="lazy">
    <span>Sher-i-Kashmir Institute of Medical Sciences</span>
</div>
<div class="client-logo-item">
    <img src="Assets/Our Clients/IIIM.png" alt="CSIR IIIM" loading="lazy">
    <span>CSIR Indian Institute of Integrative Medicine</span>
</div>
<div class="client-logo-item">
    <img src="Assets/Our Clients/IUST.png" alt="IUST" loading="lazy">
    <span>Islamic University of Science & Technology</span>
</div>
<div class="client-logo-item logo-lg">
    <img src="Assets/Our Clients/Kashmir university.png" alt="University of Kashmir" loading="lazy">
    <span>University of Kashmir</span>
</div>
<div class="client-logo-item">
    <img src="Assets/Our Clients/Skuast.png" alt="SKUAST" loading="lazy">
    <span>Sher-e-Kashmir University of Agricultural Sciences</span>
</div>
<div class="client-logo-item">
    <img src="Assets/Our Clients/gmc.png" alt="GMC Srinagar" loading="lazy">
    <span>Government Medical College, Srinagar</span>
</div>
```

- [ ] **Step 4: Verify lazy loading in DevTools**

Reload with DevTools → Network tab open. Filter by "Img". On initial load only the navbar logo and hero floating cells (1.png–6.png) should load. Scroll down — brand logos should appear in the Network tab only when you reach the brands section.

---

## Task 5: HTML Body — External Link Security

**Files:**
- Modify: `index.html` (footer contact card)

**Context:** The website link opens in a new tab (`target="_blank"`) without `rel="noopener noreferrer"`. This gives the opened page access to `window.opener`, a known security/privacy vulnerability.

- [ ] **Step 1: Add rel attribute to external link**

Find:

```html
                    <a class="fcc-item" href="https://supremesyndicate.in" target="_blank">
```

Replace with:

```html
                    <a class="fcc-item" href="https://supremesyndicate.in" target="_blank" rel="noopener noreferrer">
```

- [ ] **Step 2: Verify**

In browser, right-click the website contact item → Inspect. Confirm the `rel="noopener noreferrer"` attribute is present on the anchor tag.

---

## Task 6: CSS — Remove @import and Duplicate Block

**Files:**
- Modify: `css/style.css`

**Context:** Two issues to fix:
1. `@import url('https://fonts.googleapis.com/...')` sits at line 147 — CSS spec requires `@import` to be the first rule in a file; anywhere else it may be silently ignored. Fonts are now loaded via `<link>` in HTML so this line must be removed.
2. The `brands-section` block is defined identically at lines 1–14 AND lines 379–392. The duplicate at lines 1–14 must be removed.

- [ ] **Step 1: Remove the duplicate brands-section block at the top of the file**

The file currently starts with:

```css
.brands-section {
  padding: 12vh 0 8vh;
  background: #f8fafc;
  position: relative;
  z-index: 2;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-top-left-radius: 40px;
  border-top-right-radius: 40px;
  box-shadow: 0 -30px 100px rgba(0, 0, 0, 0.1);
  width: 100%;
}
.hero-float-container {
```

Delete the entire `.brands-section { ... }` block at the top (lines 1–14) so the file now starts with `.hero-float-container {`. The identical rule at lines 379–392 remains.

- [ ] **Step 2: Remove the Google Fonts @import**

Find this line (previously line 147, now shifted up by ~14 lines after Step 1):

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700&display=swap');
```

Delete this entire line. Fonts are already loaded via `<link>` in `index.html`.

- [ ] **Step 3: Verify fonts still load**

Reload the page. Confirm the Inter typeface still renders on headings and body text (not a system sans-serif fallback). Check DevTools → Network → Font — Inter and JetBrains Mono should appear, loaded from the `<link>` tag.

---

## Task 7: CSS — Fix will-change and Redundant Opacity

**Files:**
- Modify: `css/style.css`

**Context:** Two clean-ups:
1. `section { will-change: clip-path, transform, opacity; }` promotes every section to a GPU layer simultaneously, wasting VRAM. The properties that legitimately need `will-change` (`.horizontal-track`, `.float-cell`) already have their own targeted rules.
2. `.hero-bg-video.video-ready { opacity: 1; }` duplicates the `opacity: 1` already set on `.hero-bg-video`. Dead specificity weight.

- [ ] **Step 1: Remove will-change from the blanket section rule**

Find:

```css
section {
  will-change: clip-path, transform, opacity;
}
```

Replace with:

```css
section {
  will-change: auto;
}
```

(`will-change: auto` is the browser default — it explicitly opts sections back out without removing the rule entirely, keeping intent clear.)

- [ ] **Step 2: Remove redundant opacity from .hero-bg-video.video-ready**

Find:

```css
.hero-bg-video.video-ready {
  opacity: 1;
}
```

Delete the entire block. The base `.hero-bg-video` rule already sets `opacity: 1`.

- [ ] **Step 3: Verify hero video still visible**

Reload. Confirm the hero background video is fully visible with no transparency issues.

---

## Task 8: Final Commit

- [ ] **Step 1: Confirm no console errors**

Open DevTools → Console tab. Reload. There should be zero errors and zero 404 warnings.

- [ ] **Step 2: Full visual pass**

Scroll through the entire page and confirm:
- Navbar, hero title, floating cells — intact
- Brands grid — logos load as you scroll near them
- Horizontal product card track — smooth scroll works
- Legacy section — images load lazily, layout unchanged
- Clients section — stats count up, logos load lazily
- Footer WebGL sphere grid animates, contact card visible

- [ ] **Step 3: Commit all changes**

```bash
git add index.html css/style.css
git commit -m "perf: production polish — fix render-blocking scripts, fonts, lazy images, broken poster, security"
```
