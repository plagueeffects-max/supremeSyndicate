# Hero Animation & Sections Design
**Date:** 2026-05-08  
**Project:** MDF Enterprises — React/Vite site  
**Status:** Approved

---

## Overview

Replace the existing `Hero.jsx` + `HeroScene.jsx` with a cinematic scroll-driven journey using 7 pre-rendered images (`public/hero/hero1–7.png`). Add a premium Brands section (replacing the plain text grid) and a new Clients section — both using real logo assets from `public/brands/` and `public/clients/`.

---

## Image Assets & Their Role

| File | Content | Role |
|---|---|---|
| hero1.png | Grand dark hall, columns, arch, Kashmir mountains | Background — the hall environment |
| hero2.png | Golden cracked marble floor with light beam | Base layer — dramatic page-load reveal |
| hero3.png | Same hall with 4 product pedestals in shadow | Mid-scroll transition frame |
| hero4.png | 4 pedestals fully lit: bat, dumbbell, sitar, trophy | Deep-scroll full product reveal |
| hero5.png | MDF shield logo badge (white bg) | Brand reveal element (mix-blend-mode) |
| hero6.png | "MDF Enterprises — Rooted in Kashmir" wordmark | Brand wordmark element (mix-blend-mode) |
| hero7.png | Golden atmospheric dust/smoke (transparent) | Persistent overlay, drifts upward |

---

## Hero Section — Approach C: Dramatic Entrance + Camera Journey

### Layer Architecture (bottom → top, all `position: absolute; inset: 0`)

1. **hero2** — Gold cracked floor. Base layer, always visible. Scale-reveals from center on load (spring: scale 0.9→1.0, opacity 0→1, 1.2s).
2. **hero1** — Grand arch hall. Cross-dissolves in 2s after load (opacity 0→1, 1.5s ease).
3. **hero3** — Hall + pedestals in shadow. Opacity driven by scroll: `[0.25, 0.45] → [0, 1]`.
4. **hero4** — Full product reveal. Opacity driven by scroll: `[0.5, 0.7] → [0, 1]`.
5. **Three.js Canvas** — Existing `HeroScene` (particles, sparkles, orbit rings). Keep as-is, reduce opacity to 0.3, fade out by scroll 0.6.
6. **Spline 3D** — `@splinetool/react-spline` with a floating/rotating 3D element. Positioned center, fades in at scroll 0.1, fades out at 0.5.
7. **hero7** — Gold dust smoke. `mix-blend-mode: screen`. CSS keyframe drifts upward continuously (translateY 0→-30px, 8s infinite). Opacity 0.5, always on.
8. **hero5** — MDF shield badge. `mix-blend-mode: multiply` removed (use as overlay with `mix-blend-mode: luminosity`). Appears at scroll 0.05, scale 0→1 with golden glow pulse. Position: center, slightly above center.
9. **hero6** — MDF wordmark. Appears at scroll 0.08. Letters animate in with `letterSpacing` spring. Position: center, below hero5.
10. **Text overlay** — Title (`h1`), tagline, eyebrow, discipline labels, CTA buttons. Same as current Hero.jsx, z-index highest.

### Scroll Journey Timeline

| Scroll % | Event |
|---|---|
| 0% (load) | hero2 scale-reveals; hero7 dust starts drifting; preloader exits |
| ~2s (auto) | hero1 cross-dissolves in over hero2 |
| 0–30% | hero1 slowly zooms (scale 1→1.12 via useTransform); hero5 logo badge materializes with golden ring pulse |
| 5–15% | hero6 wordmark letterpress-animates in |
| 25–45% | hero3 cross-fades over hero1 (pedestals in shadow visible) |
| 30–50% | Discipline corner labels stagger in |
| 50–70% | hero4 fades in (full product reveal); Three.js icons fly to corners |
| 80–100% | All layers blur+fade out; transition to Marquee/Heritage |

### Scroll Implementation

- `useScroll` + `useTransform` (framer-motion) for all opacity/scale transforms
- `useSpring` for smoothing
- Lenis smooth scroll (already in App.jsx) handles the scroll events
- Images use `object-fit: cover`, `will-change: opacity, transform` for GPU compositing
- Hero section height: `300vh` (scroll-jacked, sticky inner container)

---

## Brands Section

**File:** `src/Sections.jsx` — replace existing `Brands` component.

### Layout
1. **Infinite marquee strip** — continuous left-scroll of all 9 brand logos using framer-motion `animate: { x: ['0%', '-50%'] }`, repeat: Infinity. Two copies of the logo set side-by-side for seamless loop.
2. **Logo grid** — 3×3 (or responsive) grid of glassmorphic cards. Each card: dark bg + gold border + logo image centered + hover: border brightens + subtle scale + glow shadow.

### Brand Logo Assets (`public/brands/`)
`yonexLogo.webp`, `stagLogo.webp`, `sslogo.webp`, `spartanLogo.webp`, `sgLogo.webp`, `niviaLogo.webp`, `netcoLogo.webp`, `jonexLogo.webp`, `coscoLogo.webp`

### Animation
- Grid cards: `whileInView` stagger fadeUp (already established pattern)
- Marquee: CSS `will-change: transform` on track, pause on hover
- Hover: `whileHover={{ scale: 1.04, boxShadow: '0 0 30px rgba(250,219,95,0.15)' }}`

---

## Clients Section

**File:** `src/Sections.jsx` — new `Clients` export, inserted after Brands in `App.jsx`.

### Heading
- Section number: `04 — Clients` (renumber subsequent sections)
- Title: `Trusted by <em>institutions.</em>`
- Subtitle: "From the valley's finest academies to national forces — MDF has been the address for those who demand the best."

### Layout
8 glassmorphic logo cards in a 4×2 grid (desktop), 2×4 (tablet), 1×8 (mobile).

Each card:
- Dark background (`rgba(10,20,40,0.5)`) + gold border (`rgba(250,219,95,0.12)`)
- `backdrop-blur`
- Logo image (auto height, max 60px, `object-fit: contain`, white logo support via `filter: brightness(0) invert(1)` — toggle based on dark bg)
- Institution name below in small caps

### Client Logo Assets (`public/clients/`)
| File | Name |
|---|---|
| crpfLogo.webp | CRPF |
| dsekLogo.webp | DSEK |
| dyssLogo.webp | DYSS |
| kuLogo.webp | Kashmir University |
| skaustLogo.webp | SKAUST |
| gmcLogo.webp | GMC |
| jkpLogo.webp | JK Police |
| clusterUniLogo.webp | Cluster University |

### Animation
- `whileInView` stagger (0.08s per card) fadeUp + blur clear
- Hover: gentle lift (`y: -4`) + glow border

---

## App.jsx Changes

- Add `<Clients />` import and place after `<Brands />`
- Renumber section headers in Craft, Valley, Trust, CTA accordingly (or keep numbers as-is)
- No other structural changes

---

## Dependencies

All already installed — no new packages needed:
- `framer-motion` ^11 — scroll transforms, animations
- `@react-three/fiber` + `@react-three/drei` — Three.js scene (keep existing HeroScene)
- `@splinetool/react-spline` — Spline 3D element in hero
- `three` — already installed
- `lenis` — smooth scroll (keep existing)

---

## Spec Self-Review

- No TBDs or placeholders remain
- Layer order is explicit and numbered
- Scroll percentages are concrete
- All asset paths verified against glob output
- Approach C is the only hero design — no ambiguity
- Clients section content is fully specified (8 real logos + names)
- Brands section content is fully specified (9 real logos)
- No new dependencies required
