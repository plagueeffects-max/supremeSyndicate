# Supreme Syndicate – Project Context Documentation (claude.md)

---
## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Directory Structure](#directory-structure)
3. [Core HTML (`index.html`)](#core-html-indexhtml)
4. [Styling (`css/style.css`)](#styling-cssstylecss)
5. [JavaScript (`js/main.js` & `js/footer-3d.js`)](#javascript-code)
   - 5.1 [Animation Engine](#animation-engine)
   - 5.2 [Scroll & Smooth‑Scrolling (Lenis + ScrollTrigger)](#scroll-smooth‑scrolling)
   - 5.3 [Hero Video Loading & Random Start](#hero-video-loading)
   - 5.4 [Horizontal Card Track](#horizontal-card-track)
   - 5.5 [Interactive Elements & Mouse‑Driven Parallax](#interactive-parallax)
6. [Assets (Images, Videos, 3D Canvas)](#assets)
7. [External Libraries & Versions](#external-libraries)
8. [Build / Development Workflow](#development‑workflow)
9. [Performance & Production Recommendations](#performance‑production)
10. [SEO & Accessibility Checklist](#seo‑accessibility)
11. [Future‑Proofing & Extensibility](#future‑proofing)
---

---
## 1️⃣ Project Overview <a name="project-overview"></a>
**Supreme Syndicate** is a premium‑grade landing‑page style website for a medical‑supplies company.  It showcases:
* A **hero video** with a subtle random start time to avoid a static feel.
* **Floating 3D assets** that drift based on data‑speed attributes (providing a “glass‑morphism / Awwwards” aesthetic).
* **Brand grid** of partner logos.
* **Horizontal scrolling showcase** of product cards (Chemicals, Equipment, Instruments, etc.) with smooth scroll‑triggered animations.
* **Legacy‑style section** with alternating image‑text rows.
* **Clients section** with stat counters and logo grid.
* A **premium footer** featuring a WebGL canvas background and a glowing text overlay.

All interactions rely on **GSAP** (for tweens & timelines) and **Lenis** (smooth‑scroll).  The site is built with **vanilla HTML, CSS, and JavaScript** – no framework is required, which keeps the bundle lightweight and straightforward for production deployment.
---

---
## 2️⃣ Directory Structure <a name="directory-structure"></a>
```
supremeSyndicate/
│   index.html               # Entry point, meta tags, page sections
│   package.json             # npm deps (gsap, lenis, etc.)
│   package-lock.json
│
├─ Assets/                   # Media assets – images, videos, logos
│   ├─ Hero/                 # hero video src + poster image
│   │   bg.mp4
│   │   backgroun.png        # poster image (note typo preserved from repo)
│   ├─ Hero/ (floating PNGs) # 1.png … 6.png – used for floating cells
│   └─ Cards/               # .webm clips for each horizontal card
│       Chemicals.webm
│       Equipment.webm
│       Centrifuge.webm
│       Plasticware.webm
│
├─ css/                      # Single stylesheet (style.css)
│   style.css
│
└─ js/                       # JavaScript bundle(s)
    main.js                  # Core logic – animation, scroll, hero video
    footer-3d.js             # Legacy 3‑D background for footer (currently blank import)
```
---

---
## 3️⃣ Core HTML – `index.html` <a name="core-html-indexhtml"></a>
Key sections (with IDs used for navigation / scroll triggers):
* **`#brands`** – Brand grid.
* **`#products`** – Horizontal product showcase.
* **`#about`** – Legacy rows with images & copy.
* **`#contact`** – Footer containing the WebGL canvas.

The `<head>` loads:
* Google Fonts **Inter** and **JetBrains Mono**.
* External scripts from CDN for **Lenis**, **GSAP**, **ScrollTrigger**, and **Three.js**.

Important attributes:
* `data-speed` on floating images – consumed by the JS‑driven parallax.
* `class="gsap‑fade"` – a utility class that GSAP targets for fade‑in on scroll.
---

---
## 4️⃣ Styling – `css/style.css` <a name="styling-cssstylecss"></a>
The stylesheet defines:
* **Root custom properties** (color palette, font families, radii) – makes theming trivial.
* **Utility classes**: `.brand-tile`, `.horizontal-card`, `.clients-stat`, `.footer-premium`.
* **Responsive grid layouts** using CSS Grid and Flexbox.
* **Glass‑morphism** via translucent backgrounds, backdrop‑filter, and subtle box‑shadows.
* **Micro‑animations** (hover scale, border‑color change) which are enhanced further by GSAP.
* **Scroll‑margin** settings for smooth navigation (`#brands, #products, #about, #contact`).

All sections share a **rounded‑corner, elevated‑card** aesthetic that matches the premium brand tone.
---

---
## 5️⃣ JavaScript – `js/main.js` & `js/footer-3d.js` <a name="javascript-code"></a>
The bulk of runtime logic lives in `main.js`.  The file is heavily obfuscated (IIFE + self‑defending code) but its **functional intent** can be broken down into several clear modules.

### 5.1 Animation Engine <a name="animation-engine"></a>
* **GSAP** is imported via CDN (`gsap.min.js`) and **ScrollTrigger** (`ScrollTrigger.min.js`).
* A global `Lenis` instance (`_0x3f5901`) is created with a **duration of 1.5 s** and an easing function that mimics natural scrolling.
* A request‑animation‑frame loop (`_0x456d6c`) continuously drives Lenis, ensuring ultra‑smooth scroll on all devices.
* **GSAP timelines** are built for each element that needs an entrance animation (e.g., hero title, brand tiles, horizontal cards, footer).  The timelines use properties such as `opacity`, `y`, `scale`, custom `ease`, and `duration`.
* **ScrollTrigger** binds each timeline to a specific viewport trigger (e.g., when the element reaches `top 80%`).  This creates the *fade‑in* and *slide‑up* effects that you see on the live site.

### 5.2 Scroll & Smooth‑Scrolling (Lenis + ScrollTrigger) <a name="scroll-smooth‑scrolling"></a>
* `Lenis` replaces the browser’s native scroll with a **hardware‑accelerated, momentum‑based** alternative.
* ScrollTrigger is configured to **listen to Lenis** (`Lenis.on('scroll', ScrollTrigger.update)`).  This ensures that scroll‑based tweens stay perfectly in sync with the custom scroll.
* The **horizontal section** (`#products`) uses a **pinning** strategy – the container is pinned while its internal track (`.horizontal-track`) translates horizontally based on scroll progress.
* Sticky elements (`.horizontal-sticky`) keep navigation and headings in place while the cards slide by.

### 5.3 Hero Video Loading & Random Start <a name="hero-video-loading"></a>
```js
const heroVid = document.getElementById('heroVideo');
heroVid.addEventListener('loadedmetadata', () => {
  heroVid.currentTime = Math.random() * heroVid.duration;
});
```
* The video autoplays muted, loops, and plays inline.
* Once metadata is ready, the script **randomizes the start time**, giving each page view a slightly different frame – this eliminates the “static video” feel.

### 5.4 Horizontal Card Track <a name="horizontal-card-track"></a>
* Cards are rendered as a **CSS Grid (2 columns)** inside `.horizontal-card`.  Each card contains a `<video>` element.
* On hover, the video and image inside the `.hc-img` container **scale up** (`transform: scale(1.05)`).
* GSAP animates the **track’s x‑position** based on the scroll percentage, creating a smooth lateral carousel effect.

### 5.5 Interactive Elements & Mouse‑Driven Parallax <a name="interactive-parallax"></a>
* **Floating cells** (`.float-cell`) each have a `data-speed` attribute (positive/negative).  The script reads this value and applies a **translateY / translateX** transform proportionally to the scroll delta, delivering a subtle 3‑D parallax.
* The **scroll‑indicator** (`.hero-scroll-indicator`) animates a dot using a keyframe (`@keyframes scrollDot`) to hint that more content lies below.
* **Clients section counters** count up from `0` to their target numbers using a tiny custom tween.
---

---
## 6️⃣ Assets <a name="assets"></a>
| Folder | Asset | Purpose |
|--------|-------|---------|
| `Assets/Hero/` | `bg.mp4` | Background hero video (looped, muted). |
| `Assets/Hero/` | `backgroun.png` | Poster image shown before video loads (notice the original typo). |
| `Assets/Hero/` | `1.png – 6.png` | Floating decorative images; each gets a `data‑speed` for parallax. |
| `Assets/Cards/` | `Chemicals.webm` | Video preview for the “Chemicals, Reagents” card. |
| `Assets/Cards/` | `Equipment.webm` | Video preview for the “Bio‑Medical Equipment” card. |
| `Assets/Cards/` | `Centrifuge.webm` | Video preview for the “Lab Instruments” card. |
| `Assets/Cards/` | `Plasticware.webm` | Video preview for the “Glassware & Plasticware” card. |
| `Assets/Our Clients/` | Various logos (e.g., `Merck.png`, `Sigma‑Aldrich-logo.png`) | Used in the client‑logo grid. |
---

---
## 7️⃣ External Libraries & Versions <a name="external-libraries"></a>
| Library | CDN URL | Version (as of checkout) |
|---------|---------|--------------------------|
| GSAP | `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js` | 3.12.2 |
| ScrollTrigger (GSAP plugin) | `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js` | 3.12.2 |
| Lenis (smooth scroll) | `https://unpkg.com/@studio-freight/lenis@1.0.34/dist/lenis.min.js` | 1.0.34 |
| Three.js (footer 3‑D canvas) | `https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js` | r128 |
---

---
## 8️⃣ Build / Development Workflow <a name="development‑workflow"></a>
The project is **pure static** – no bundler is required, but the following workflow is recommended for production:
1. **Install dependencies** (optional, only for linting or future bundling):
   ```bash
   npm install gsap @studio-freight/lenis three
   ```
2. **Run a local server** to test assets (e.g., `npm install -g serve && serve .`).
3. **Lint / format** – use `stylelint` for CSS and `prettier` for HTML/JS.
4. **Production build** – copy the directory to a CDN or static‑host (Netlify, Vercel, Cloudflare Pages). No further compilation is needed.
---

---
## 9️⃣ Performance & Production Recommendations <a name="performance‑production"></a>
| Area | Recommendation |
|------|----------------|
| **Video** | Convert `bg.mp4` to **WebM** for modern browsers and provide a **fallback MP4**. Enable `preload="metadata"`. |
| **Images** | Serve **optimized WebP** variants for logos and floating assets. Use `srcset` if you expect high‑DPI devices. |
| **CSS** | Extract critical CSS (above‑the‑fold) into the `<head>` to reduce first‑paint time. |
| **JS** | Defer non‑essential scripts (`defer` attribute) and **async‑load** GSAP/Lenis after the hero is visible. |
| **Cache** | Set long‑term `Cache‑Control` headers for static assets (images, videos) via your hosting platform. |
| **Accessibility** | Add `alt` text for every `<img>` (already present) and ensure button/anchor focus states are visible. |
| **SEO** | Add `<title>Supreme Syndicate – Medical Excellence</title>` and a `<meta name="description" content="...">`. Use proper heading hierarchy (`<h1>` only once). |
---

---
## 🔎 SEO & Accessibility Checklist <a name="seo‑accessibility"></a>
* **Title Tag** – present, descriptive, ≤ 60 chars.
* **Meta Description** – should be added (currently missing).
* **Open Graph** – optional but recommended for social sharing.
* **Heading Structure** – `<h1>` at top (hero title), subsequent headings use `<h2>`, `<h3>`.
* **ARIA Labels** – add `aria-label` to navigation links if further accessibility is needed.
* **Keyboard Navigation** – ensure all interactive elements (`<a>`, `<button>`) are reachable via tab order.
* **Contrast Ratio** – check that text against background meets WCAG AA (≥ 4.5:1).
---

---
## 🔭 Future‑Proofing & Extensibility <a name="future‑proofing"></a>
* **Component‑ise** the sections with a lightweight framework (e.g., **Alpine.js** or **HTMX**) if the site ever needs dynamic data.
* **Lazy‑load** the heavy hero video using IntersectionObserver to save bandwidth on mobile.
* **Convert the animation code** from the obfuscated IIFE into clear ES6 modules – this aids maintainability and allows tree‑shaking.
* **Add a build step** (Vite, esbuild) to minify JS/CSS, hash filenames for cache busting, and generate a service‑worker for offline support.
* **Add a style guide** (Figma or Storybook) to keep the visual language consistent across future brand updates.
---

---
## 📦 Quick Run‑through (for a new dev) 
```bash
# Clone the repo (already done)
cd c:/Users/Furqan/Desktop/supremeSyndicate

# Optional: install deps for linting or future bundling
npm install

# Start a simple static server (any will do)
npx serve .

# Open http://localhost:5000 (or the port shown) in a browser.
```
You should see the hero video with a subtle random start, floating decorative assets, smooth scroll, animated cards, and the premium footer.
---

---
## ✨ Closing Note
The above documentation provides a **single source of truth** for anyone (including Claude‑based agents) to understand every moving part of the Supreme Syndicate site.  All file responsibilities, animation pipelines, third‑party dependencies, and production recommendations are clearly enumerated, enabling rapid iteration, performance tuning, or migration to a modern build system without losing the visual polish that the project currently delivers.
---
