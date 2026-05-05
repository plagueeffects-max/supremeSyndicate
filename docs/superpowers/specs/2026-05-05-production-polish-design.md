# Production Polish — Design Spec
**Date:** 2026-05-05  
**Scope:** Performance, correctness, and SEO hardening. Layout, design, and animations are untouched. `main.js` is not modified.

---

## Goals
1. Fix all outright bugs (broken 404 asset, invalid CSS @import position, missing security attributes).
2. Eliminate render-blocking scripts from the critical path.
3. Improve perceived and measured load performance without changing any visual output.
4. Add missing SEO and social-sharing metadata.

## Out of Scope
- Any change to layout, colours, typography, or animations.
- Modifying `js/main.js` (obfuscated; behaviour must be preserved exactly).
- Self-hosting fonts (Approach C, deferred).
- Server-side caching headers (requires hosting-platform config, not static files).

---

## Changes

### File: `index.html`

| # | Change | Reason |
|---|--------|--------|
| 1 | Add `<link rel="preconnect">` for `fonts.googleapis.com`, `fonts.gstatic.com` (crossorigin), `cdnjs.cloudflare.com`, `unpkg.com` — placed before any `<link>` or `<script>` | Allows the browser to open TCP+TLS connections to CDN hosts during HTML parse, shaving 100–300 ms off first resource load |
| 2 | Replace CSS `@import` for Google Fonts with a `<link rel="stylesheet">` in `<head>` | The `@import` at line 147 of style.css is not the first rule in the file — CSS spec requires `@import` to precede all other rules, so fonts may silently fail on some browsers. `<link>` in HTML head is always correct. |
| 3 | Add `<meta name="description">` | Missing; required for SEO |
| 4 | Add Open Graph meta tags (`og:title`, `og:description`, `og:type`) | Required for correct social-share cards |
| 5 | Add `defer` to all four CDN `<script>` tags in `<head>` (Lenis, GSAP, ScrollTrigger, Three.js) | Without `defer` these scripts block HTML parsing and first paint. With `defer` they download in parallel and execute in document order after HTML is parsed — Lenis/GSAP/Three are always ready before main.js runs. |
| 6 | Add `defer` to `<script src="js/main.js">` and `<script src="js/footer-3d.js">` at bottom of `<body>` | Keeps execution order consistent with the deferred CDN scripts above |
| 7 | Remove `poster="Assets/Hero/backgroun.png"` from hero `<video>` | File does not exist — causes a 404 network request on every page load |
| 8 | Add `preload="metadata"` to hero `<video>` | Lets the browser fetch video duration/dimensions without downloading the full file; required by the random-start-time script in the page |
| 9 | Add `loading="lazy"` to brand-grid images (10 items), client-logo images (6 items), and legacy-section images (2 items) | All are below the fold; lazy-loading defers their network requests until the user scrolls near them, improving LCP and TTI |
| 10 | Do NOT add `loading="lazy"` to navbar logo or hero floating-cell images | These are above the fold and must load immediately |
| 11 | Add `rel="noopener noreferrer"` to the `target="_blank"` website link in the footer | Without this, the opened tab gets a reference to `window.opener`, a known security/privacy issue |

### File: `css/style.css`

| # | Change | Reason |
|---|--------|--------|
| 1 | Remove the `@import url('https://fonts.googleapis.com/...')` rule (line 147) | Fonts are now loaded via `<link>` in HTML; duplicate import wastes a network request |
| 2 | Remove the first (duplicate) `brands-section` block (lines 1–14) | Identical block appears again at lines 379–392; keeping both causes the browser to parse the same rules twice |
| 3 | Remove `will-change: clip-path, transform, opacity` from the blanket `section {}` rule | Applying `will-change` to every `<section>` forces the browser to promote all sections to separate GPU compositor layers simultaneously, wasting significant VRAM. The properties that genuinely need it (`.horizontal-track`, `.float-cell`) already have targeted `will-change: transform`. |
| 4 | Remove the redundant `opacity: 1` from `.hero-bg-video.video-ready` | `.hero-bg-video` already sets `opacity: 1`; the `.video-ready` class adds nothing. Harmless but adds dead specificity weight. |

---

## What Does NOT Change
- All GSAP animations, ScrollTrigger timelines, Lenis smooth-scroll
- Horizontal card track behaviour
- Hero video random-start-time script
- Three.js footer WebGL canvas
- Every section's layout, colours, spacing, typography, hover effects
- `js/main.js` — untouched
- `js/footer-3d.js` — untouched
- `js/three-bg.js` — already not imported in HTML, left alone

---

## Verification Steps (for the user after implementation)
1. Open the site in a browser — visually confirm every section looks identical to before.
2. Open DevTools → Network tab → reload. Confirm no 404 for `backgroun.png`.
3. DevTools → Network → filter "Font" — confirm Inter and JetBrains Mono load correctly.
4. DevTools → Performance tab → record a reload. Confirm scripts are no longer render-blocking (they will appear after the HTML parse line).
5. Scroll through the full page — confirm all animations (hero parallax, horizontal scroll, footer WebGL) work as before.
6. Check the `<head>` source — confirm `<meta name="description">` is present.
7. Right-click the page → View Page Source → search for `backgroun` — should not appear.
