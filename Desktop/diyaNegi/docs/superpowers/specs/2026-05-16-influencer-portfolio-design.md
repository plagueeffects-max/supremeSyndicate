# Diya Negi — Influencer Portfolio Redesign

**Date:** 2026-05-16  
**Status:** Approved  
**Stack:** React 19 + Vite + Framer Motion + Tailwind CSS 4 + Three.js (grain only)

---

## Design Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Color palette | Pure Noir — black `#000` / `#0a0a0a`, white `#fff` only | Timeless editorial luxury |
| Scroll style | Cinematic full-screen sections | Luxury brand film reel feel |
| Hero layout | Name-first typographic + bigger diagonal peek image | Name dominates, portrait dramatically visible |
| Animation approach | Hybrid Premium — Framer Motion + Three.js grain + selective 21dev/Aceternity | Max visual impact, controlled bundle size |

---

## Architecture

```
src/
├── App.jsx                          ← root, section assembly
├── main.jsx
├── index.css                        ← global: custom cursor, scrollbar, font
├── components/
│   ├── CustomCursor.jsx             ← CSS dot + ring follower
│   ├── Navbar.jsx                   ← fixed nav, scroll progress bar, section highlights
│   ├── GrainCanvas.jsx              ← Three.js noise shader canvas (hero only)
│   ├── TextScramble.jsx             ← hook: scrambles string on mount
│   ├── AnimatedLine.jsx             ← scaleX reveal line
│   ├── MarqueeTrack.jsx             ← infinite horizontal marquee (21dev pattern)
│   └── SectionWrapper.jsx          ← shared viewport-enter fade-up wrapper
└── sections/
    ├── Hero.jsx
    ├── Introduction.jsx
    ├── AboutMe.jsx
    ├── Vision.jsx
    ├── Mission.jsx
    ├── Portfolio.jsx
    ├── Contact.jsx
    └── ThankYou.jsx
```

---

## Shared Animation Tokens

```js
// Used across all sections
const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } } }
// Top-to-bottom reveal (intro image): inset starts at top=100%, shrinks down
const clipRevealDown = { hidden: { clipPath: 'inset(100% 0 0 0)' }, visible: { clipPath: 'inset(0% 0 0 0)', transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } } }
// Bottom-to-top reveal (vision, contact images): inset starts at bottom=100%, shrinks up
const clipRevealUp = { hidden: { clipPath: 'inset(0 0 100% 0)' }, visible: { clipPath: 'inset(0 0 0% 0)', transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } } }
const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.12 } } }
```

Viewport trigger: `{ once: true, margin: "-80px" }` on all `whileInView` calls.

---

## Section Specs

### 00 — Navbar (fixed)

- **Position:** fixed top, `z-50`, `backdrop-blur-md`, `bg-black/60`
- **Left:** "Diya Negi" — `tracking-widest uppercase text-xs`
- **Center:** nav links — Home · About · Portfolio · Contact — `tracking-widest uppercase text-xs text-neutral-400 hover:text-white`
- **Right:** hamburger lines (decorative)
- **Scroll progress bar:** 1px white `<motion.div>` at bottom of nav, `scaleX` driven by `useScroll` `scrollYProgress`, `transformOrigin: left`
- **Load animation:** slides down `y: -100 → 0`, opacity 0→1, delay 1.4s (after hero completes)
- **Active link:** `useActiveSection` hook — brightens link when section is in viewport

**Custom cursor** (global, rendered in App.jsx):
- Small dot: 6px white circle, follows mouse exactly
- Ring: 32px circle, white border, follows with 0.1s spring lag
- Blend mode: `mix-blend-difference` so it inverts on white backgrounds

---

### 01 — Hero

**Layout:** Full viewport (`min-h-screen`). Black background. Three layers:

1. **GrainCanvas** — absolute fill, Three.js `PlaneGeometry` + custom GLSL shader generating Perlin noise, animates slowly. Opacity 0.4. No user interaction.
2. **Image (myPortfolio1.png)** — absolute right, width 52%, diagonal left edge via `clip-path: polygon(12% 0%, 100% 0%, 100% 100%, 0% 100%)`. Gradient overlay `linear-gradient(to right, #000 0%, transparent 20%)` softens the left edge.
3. **Text content** — absolute left, bottom-anchored, z-index above grain and image.

**Text content:**
```
"Hello, I'm"   ← 8px, tracking-[0.25em], uppercase, opacity-30
"DIYA"         ← 120px (lg: 160px), font-weight 900, tracking-[-0.05em], white fill
"NEGI"         ← same size, outlined: -webkit-text-stroke 1px white, color transparent
"Content Creator · Lifestyle · Beauty · Delhi"  ← 8px, tracking, opacity-25
```

**Load sequence (Framer Motion):**
| Delay | Element | Animation |
|-------|---------|-----------|
| 0.0s | GrainCanvas | opacity 0→0.4, duration 1.2s |
| 0.2s | "Hello, I'm" | fadeUp |
| 0.4s | "DIYA" | TextScramble — random chars settle to "DIYA" over 0.8s |
| 0.7s | "NEGI" | TextScramble — same, 0.3s later |
| 1.0s | Image | clipPath left-edge wipe: `polygon(100% 0,100% 0,100% 100%,100% 100%) → polygon(12% 0,100% 0,100% 100%,0% 100%)` |
| 1.2s | Tagline + scroll indicator | fadeUp |
| 1.4s | Navbar | slides down |

**Scroll behaviour:** `useScroll` + `useTransform` — image `y` moves `0 → -60px` as section scrolls out (parallax).

**Scroll indicator:** right-aligned, `writing-mode: vertical-rl` text "SCROLL", thin animated line beneath.

**TextScramble hook spec:**
- Takes `text: string`, `trigger: boolean`, `duration = 800`
- Uses `requestAnimationFrame` loop
- Each frame: randomly replace un-settled chars with chars from `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`
- Chars settle left-to-right at a rate of `duration / text.length` ms per char

---

### 02 — Introduction

**Layout:** Two columns. Left 55% text, right 45% image.

**Left column:**
- Section tag: `02 — Introduction`, monospace, opacity-30
- Heading: "Who I Am" — large display, fadeUp
- Body paragraph: bio text, stagger
- `MarqueeTrack` strip — `Lifestyle · Beauty · Fashion · Fragrance · Skincare · Pet · Food` — runs continuously, speed 40s loop, separated by `·`
- Below marquee: two-column sub-grid — "About Me" + "About Portfolio" text blocks

**Right column (image):**
- `introduction1.png` — full height
- Entry: `clipReveal` top-to-bottom
- Hover: scale 1→1.03, duration 1.5s

**MarqueeTrack component:**
- Renders two copies of tag list side by side
- `animate={{ x: ['0%', '-50%'] }}` `transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}`
- Border-top and border-bottom `rgba(255,255,255,0.08)` lines above and below strip

---

### 03 — About Me

**Layout:** Full-width top image grid, then text below.

**Image grid:**
- `aboutMe1.png`, `aboutMe2.png`, `aboutMe3.png` — 3 equal columns, `h-[55vh]`
- Each: `overflow-hidden`, inner img with hover `scale(1.05)` transition 1.5s
- Stagger entry: each image scales from `0.95, opacity 0` → `1, opacity 1`, 0.15s between

**Text block below:**
- 12-column grid: heading (col-span-4), Vision text (col-span-4), Mission text (col-span-4)
- "About Me" heading — large display, fadeUp after images
- AnimatedLine under heading

---

### 04 — My Vision

**Layout:** Two columns. Left 55% text, right 45% image.

**Left:**
- "My Vision" heading — display, fadeUp
- AnimatedLine — scaleX reveal
- Two numbered blocks (`01.` / `02.`) — stagger fadeUp
- Number counter: `useMotionValue` counts 0→1 and 0→2 on viewport enter (0.5s duration)

**Right:**
- `myVision2.png` fills column height
- `myVision1.png` used as a subtle opacity-20 background layer behind `myVision2` for depth
- Entry: `clipReveal` bottom-to-top

---

### 05 — My Mission

**Layout:** Two columns. Left 50% numbered list, right 50% 2×2 image grid.

**Left:**
- "My Mission" heading — display, fadeUp + AnimatedLine
- 4 mission items (01–04) — each is `flex gap-10`, number + title + description
- Stagger: 0.1s between each item
- Items: Authentic Storytelling · Visual Aesthetics · Strong Brand Collaborations · Consistent Growth

**Right 2×2 grid:**
- `myMission1.png` top-left, `myMission2.png` top-right, `myMission3.png` bottom-left, `myMission4.png` bottom-right
- Alternating entry directions: 1 slides from left, 2 from right, 3 from right, 4 from left
- Hover: scale up + `grayscale(0)` (images start at `grayscale(20%)`)

---

### 06 — Favorite Portfolio (Drag Gallery)

**Layout:** Heading top-left, drag hint top-right, full-width draggable image track below.

**Heading area:**
- "My Favorite Portfolio" — large display, fadeUp
- Aceternity Spotlight effect: mouse-following radial gradient light on the heading area
- Spotlight implementation: `onMouseMove` updates CSS custom property `--x` and `--y`, radial gradient `at var(--x) var(--y)` in `::before`

**Drag gallery:**
- `myFavPortfolio1.png` (wider, `flex: 1.3`) and `myFavPortfolio2.png` (`flex: 1`) side by side in a Framer Motion `motion.div`
- `drag="x"`, `dragConstraints` from ref measuring track width
- `whileDrag={{ scale: 0.98 }}` on the container
- Drag cursor: changes to `grabbing` on drag start
- Images: `object-cover`, tall aspect ratio (`h-[70vh]`)
- "← Drag →" hint in monospace, opacity-30, fades out after first drag interaction

---

### 07 — Contact

**Layout:** Two columns. Left 55% contact info, right 45% image.

**Left:**
- Heading: "Let's Work Together" — large display, fadeUp + AnimatedLine
- Instagram handle + link — monospace, opacity-60, links to `https://www.instagram.com/dianegi_` (new tab)
- Three contact rows (phone, email, location):
  - Each: 48px circle border button + text
  - Hover: circle fills white, icon turns black, `duration-500`
- Animated: each row stagger-fades in

**Right:**
- `myContact1.png` — `clipReveal` bottom-to-top entry
- Hover scale 1.05, 1.5s duration

---

### 08 — Thank You

**Layout:** Two columns. Left 50% text + signature, right 50% asymmetric image grid.

**Left:**
- "Thank You" heading — large display, fadeUp
- AnimatedLine
- Two body paragraphs — stagger
- Signature: `"— Diya Negi"` — italic, `text-white font-medium`, fades in last (0.6s delay after paragraphs)

**Right asymmetric grid:**
- `thankYou2.png` — tall, left column, `row-span-2`
- `thankYou1.png` — top-right
- `thankYou3.png` — bottom-right
- All three stagger-reveal with clipReveal, 0.2s between

**Footer (below Thank You):**
- Single line: `© 2026 Diya Negi · @dianegi_` — centered, monospace, opacity-25
- Border-top `rgba(255,255,255,0.06)`

---

## GrainCanvas (Three.js)

Minimal Three.js usage — no physics, no 3D objects, no complexity:

```
- Scene: PlaneGeometry fills canvas
- Material: ShaderMaterial with custom fragmentShader
- Shader: fract(sin(dot(uv, vec2(12.9898,78.233))) * 43758.5453) — classic noise
- Uniform: uTime — increments in animation loop for slow drift
- Renderer: WebGLRenderer, alpha: true, no antialias needed
- Resize: ResizeObserver updates camera + renderer on canvas size change
- Cleanup: renderer.dispose() on React unmount
```

Fallback: if WebGL unavailable, `GrainCanvas` renders nothing (no error, grain is cosmetic).

---

## npm Changes

**Add:**
```
three
```

**No other additions.** 21dev Marquee and Aceternity Spotlight are copy-pasted inline — no npm packages.

---

## Performance Constraints

- Three.js grain canvas: hero section only — contained in Hero JSX, unmounts naturally as section scrolls away
- Images: all `loading="lazy"` except `myPortfolio1.png` (hero, eager)
- `will-change: transform` only on actively animating elements, removed after animation completes
- `viewport={{ once: true }}` on all `whileInView` — no re-trigger on scroll back up

---

## Files Changed

| File | Action |
|------|--------|
| `src/App.jsx` | Full rewrite — assembles sections, renders CustomCursor |
| `src/index.css` | Add custom cursor CSS, hide default cursor, scrollbar style |
| `src/components/*` | All new files |
| `src/sections/*` | All new files |
| `package.json` | Add `three` |
