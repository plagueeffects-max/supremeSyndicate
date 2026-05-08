# Hero Cinematic Animation & Sections Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the MDF Enterprises hero into a 9-layer scroll-driven cinematic walk-through using 7 pre-rendered images, and add premium Brands (logo marquee + grid) and Clients (institutional logo cards) sections.

**Architecture:** Hero section grows to `300vh` with a sticky inner container; 9 absolutely-positioned layers are stacked and their opacity/scale driven by `useScroll` + `useTransform` from framer-motion. Brands replaces the existing text grid with a real-logo marquee strip + glassmorphic grid. Clients is a new section inserted after Brands with 8 institutional logo cards.

**Tech Stack:** React 18, Framer Motion 11, Three.js / @react-three/fiber (existing HeroScene kept), @splinetool/react-spline (floating layer), Lenis smooth scroll (existing), Tailwind CSS utility classes, custom CSS for keyframes.

---

## File Map

| Action | File | Responsibility |
|---|---|---|
| Modify | `src/styles.css` | Add hero image layer CSS, dust keyframe, clients/brands grid styles |
| Full rewrite | `src/Hero.jsx` | 9-layer cinematic hero with all scroll logic |
| No change | `src/HeroScene.jsx` | Three.js scene — opacity controlled from Hero.jsx wrapper |
| Modify | `src/Sections.jsx` | Replace Brands with logo marquee+grid; add Clients export |
| Modify | `src/App.jsx` | Import + render Clients after Brands |

---

## Task 1: CSS — Hero Image Layers, Dust Keyframe, Section Styles

**Files:**
- Modify: `src/styles.css`

- [ ] **Step 1: Update hero-cinema height and add image layer rules**

Find the existing `.hero-cinema` block in `src/styles.css` (around line 251) and change `height: 200vh` to `300vh`. Then append the following CSS block directly after the existing `/* CINEMATIC HERO */` section:

```css
/* Hero image layers */
.hero-img-stack {
  position: absolute;
  inset: 0;
  z-index: 2;
}

.hero-img-layer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  will-change: opacity, transform;
  pointer-events: none;
  user-select: none;
  -webkit-user-select: none;
}

/* Gold dust drift — hero7 */
@keyframes dustDrift {
  0%   { transform: translateY(15px) translateX(-8px) scale(0.92); opacity: 0.25; }
  50%  { opacity: 0.5; }
  100% { transform: translateY(-35px) translateX(8px) scale(1.06); opacity: 0.2; }
}

.hero-dust-img {
  animation: dustDrift 9s ease-in-out infinite alternate;
  will-change: transform, opacity;
  pointer-events: none;
  user-select: none;
  -webkit-user-select: none;
}

/* Clients section */
.section.clients {
  background: linear-gradient(180deg, transparent 0%, rgba(250,219,95,0.02) 50%, transparent 100%);
}

.client-card {
  transition: transform 0.4s var(--ease-premium),
              border-color 0.4s ease,
              box-shadow 0.4s ease;
}

/* Brands marquee */
.brands-marquee-wrap {
  position: relative;
}
```

- [ ] **Step 2: Also update mobile breakpoint for hero-cinema**

Find the mobile breakpoint rule `hero-cinema { height: 160vh; }` (near line 1392 of styles.css) and update it to `height: 220vh;`.

- [ ] **Step 3: Verify CSS compiles — start dev server**

```bash
cd C:/Users/Furqan/Desktop/mdf-react-src && npm run dev
```

Expected: server starts on `http://localhost:5173` with no CSS errors in console.

- [ ] **Step 4: Commit**

```bash
git add src/styles.css
git commit -m "style: add hero image layer rules, dust keyframe, clients styles"
```

---

## Task 2: Full Hero.jsx Rewrite — 9-Layer Cinematic System

**Files:**
- Full rewrite: `src/Hero.jsx`

- [ ] **Step 1: Write the complete new Hero.jsx**

Replace the entire contents of `src/Hero.jsx` with:

```jsx
import React, { useRef, useEffect, useState, useMemo, lazy, Suspense } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
} from 'framer-motion';
import HeroScene from './HeroScene.jsx';

const Spline = lazy(() => import('@splinetool/react-spline'));

// Replace with your published Spline scene URL (publish from spline.design)
const SPLINE_SCENE = 'https://prod.spline.design/6Wq1Q7YoRtBCMjEE/scene.splinecode';

/* =============================================================
   METEORS
   ============================================================= */
function Meteors({ number = 25 }) {
  const meteors = useMemo(
    () =>
      Array.from({ length: number }).map((_, i) => ({
        id: i,
        left: Math.random() * 120 - 10,
        top: Math.random() * 50 - 20,
        delay: Math.random() * 6,
        duration: 3 + Math.random() * 5,
        scale: 0.3 + Math.random() * 0.7,
        opacity: 0.2 + Math.random() * 0.8,
      })),
    [number]
  );

  return (
    <div className="meteors overflow-hidden absolute inset-0 pointer-events-none z-[6]">
      {meteors.map((m) => (
        <span
          key={m.id}
          className="meteor absolute h-[1px] w-[50px] bg-gradient-to-r from-transparent via-[#fadb5f] to-transparent"
          style={{
            left: `${m.left}%`,
            top: `${m.top}%`,
            animationDelay: `${m.delay}s`,
            animationDuration: `${m.duration}s`,
            transform: `scale(${m.scale}) rotate(215deg)`,
            opacity: m.opacity,
            boxShadow: '0 0 10px 1px rgba(250, 219, 95, 0.4)',
          }}
        />
      ))}
    </div>
  );
}

/* =============================================================
   WORD ROTATOR
   ============================================================= */
const ROTATING_WORDS = ['Sport.', 'Music.', 'Fitness.', 'Awards.'];

function WordRotator() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % ROTATING_WORDS.length), 2800);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="rotator relative inline-block text-transparent bg-clip-text bg-gradient-to-br from-[#fadb5f] to-[#e8a33d]">
      <AnimatePresence mode="wait">
        <motion.em
          key={ROTATING_WORDS[index]}
          initial={{ y: 40, opacity: 0, rotateX: -90, filter: 'blur(12px)' }}
          animate={{ y: 0, opacity: 1, rotateX: 0, filter: 'blur(0px)' }}
          exit={{ y: -40, opacity: 0, rotateX: 90, filter: 'blur(12px)' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="rotator-word absolute left-0 origin-bottom"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {ROTATING_WORDS[index]}
        </motion.em>
      </AnimatePresence>
      <span className="invisible">{ROTATING_WORDS[0]}</span>
    </span>
  );
}

/* =============================================================
   DISCIPLINE LABELS
   ============================================================= */
const DISCIPLINE_LABELS = [
  { type: 'sport',   title: 'Sporting Goods',       sub: 'Cricket · Football · Tennis', pos: { left: '8%', top: '22%' } },
  { type: 'music',   title: 'Musical Instruments',  sub: 'Tabla · Guitar · Strings',    pos: { right: '8%', top: '22%' } },
  { type: 'fitness', title: 'Fitness & Wellness',   sub: 'Cardio · Strength · Yoga',    pos: { left: '8%', bottom: '24%' } },
  { type: 'awards',  title: 'Awards & Trophies',    sub: 'Custom · Engraving · Crystal', pos: { right: '8%', bottom: '24%' } },
];

function DisciplineLabel({ label, opacity, scale, index }) {
  return (
    <motion.div
      className="discipline-label absolute p-4 rounded-xl border border-[rgba(250,219,95,0.15)] bg-[rgba(10,20,40,0.4)] backdrop-blur-md shadow-2xl"
      style={{ ...label.pos, opacity, scale }}
    >
      <motion.div
        className="text-[10px] tracking-[0.3em] text-[#fadb5f] mb-1 opacity-70 font-mono"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2.5 + index * 0.15 }}
      >
        0{index + 1}
      </motion.div>
      <div className="discipline-label-title font-display text-xl text-cream tracking-wide">{label.title}</div>
      <div className="discipline-label-sub text-xs text-white/50 tracking-widest uppercase mt-1">{label.sub}</div>
      <div className="discipline-label-line w-full h-[1px] mt-3 bg-gradient-to-r from-[#fadb5f] to-transparent opacity-40" />
    </motion.div>
  );
}

/* =============================================================
   LAYER 1–4: HERO IMAGE LAYERS
   Handles the floor reveal, arch cross-dissolve, and scroll
   cross-fades through hero3 and hero4.
   ============================================================= */
function HeroImageLayers({ scrollProgress }) {
  const [archVisible, setArchVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setArchVisible(true), 2000);
    return () => clearTimeout(t);
  }, []);

  // hero1 slowly zooms as user scrolls 0→35%
  const hero1Scale = useTransform(scrollProgress, [0, 0.35], [1, 1.12]);

  // hero3 (pedestals in shadow) fades in 25→45% scroll
  const hero3Opacity = useTransform(scrollProgress, [0.25, 0.45], [0, 1]);

  // hero4 (full product reveal) fades in 50→70% scroll
  const hero4Opacity = useTransform(scrollProgress, [0.5, 0.7], [0, 1]);

  return (
    <div className="hero-img-stack">
      {/* Layer 1: hero2 — gold cracked floor, scale-reveals on load */}
      <motion.img
        src="/hero/hero2.png"
        className="hero-img-layer"
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        alt=""
        aria-hidden="true"
        draggable="false"
      />

      {/* Layer 2: hero1 — grand arch hall, cross-dissolves in after 2s, zooms on scroll */}
      <AnimatePresence>
        {archVisible && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ scale: hero1Scale, transformOrigin: 'center center' }}
          >
            <img
              src="/hero/hero1.png"
              className="hero-img-layer"
              alt=""
              aria-hidden="true"
              draggable="false"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Layer 3: hero3 — hall + pedestals in shadow, scroll 25-45% */}
      <motion.img
        src="/hero/hero3.png"
        className="hero-img-layer"
        style={{ opacity: hero3Opacity }}
        alt=""
        aria-hidden="true"
        draggable="false"
      />

      {/* Layer 4: hero4 — full product reveal, scroll 50-70% */}
      <motion.img
        src="/hero/hero4.png"
        className="hero-img-layer"
        style={{ opacity: hero4Opacity }}
        alt=""
        aria-hidden="true"
        draggable="false"
      />
    </div>
  );
}

/* =============================================================
   LAYERS 8–9: BRAND ELEMENTS (hero5 badge + hero6 wordmark)
   Appear as floating glassmorphic panels mid-scroll.
   ============================================================= */
function BrandElements({ scrollProgress }) {
  const badgeOpacity = useTransform(scrollProgress, [0.03, 0.14], [0, 1]);
  const badgeScale  = useTransform(scrollProgress, [0.03, 0.14], [0.7, 1]);
  const wordmarkOpacity = useTransform(scrollProgress, [0.07, 0.18], [0, 1]);
  const wordmarkY       = useTransform(scrollProgress, [0.07, 0.18], [20, 0]);

  return (
    <div className="absolute inset-0 z-[15] flex flex-col items-center justify-center pointer-events-none gap-4">
      {/* hero5 — MDF Shield Badge */}
      <motion.div
        className="relative"
        style={{ opacity: badgeOpacity, scale: badgeScale }}
      >
        <div className="relative rounded-full p-3 bg-[rgba(5,14,28,0.55)] backdrop-blur-sm border border-[rgba(250,219,95,0.25)] shadow-[0_0_60px_rgba(250,219,95,0.15)]">
          <img
            src="/hero/hero5.png"
            className="w-28 h-28 object-contain"
            alt="MDF Enterprises"
            aria-hidden="true"
            draggable="false"
          />
        </div>
        {/* Pulsing gold ring */}
        <motion.div
          className="absolute inset-[-4px] rounded-full border border-[rgba(250,219,95,0.3)]"
          animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.04, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* hero6 — MDF Wordmark */}
      <motion.div
        className="px-7 py-3 rounded-xl bg-[rgba(5,14,28,0.5)] backdrop-blur-sm border border-[rgba(250,219,95,0.15)]"
        style={{ opacity: wordmarkOpacity, y: wordmarkY }}
      >
        <img
          src="/hero/hero6.png"
          className="h-9 w-auto object-contain max-w-xs"
          alt="MDF Enterprises — Rooted in Kashmir, Built for Excellence"
          aria-hidden="true"
          draggable="false"
        />
      </motion.div>
    </div>
  );
}

/* =============================================================
   LAYER 7: DUST OVERLAY (hero7)
   Gold atmospheric dust, drifts upward continuously.
   ============================================================= */
function DustOverlay() {
  return (
    <div
      className="absolute inset-0 z-[16] pointer-events-none overflow-hidden flex items-end justify-center pb-0"
      aria-hidden="true"
    >
      <img
        src="/hero/hero7.png"
        className="hero-dust-img w-[85%] max-w-3xl select-none"
        style={{ mixBlendMode: 'screen', opacity: 0.55 }}
        alt=""
        draggable="false"
      />
    </div>
  );
}

/* =============================================================
   LAYER 6: SPLINE 3D
   Floating 3D element fades in briefly mid-scroll then fades out.
   Replace SPLINE_SCENE with your published Spline URL.
   ============================================================= */
function SplineLayer({ scrollProgress }) {
  const splineOpacity = useTransform(
    scrollProgress,
    [0.05, 0.18, 0.45],
    [0, 0.5, 0]
  );

  return (
    <motion.div
      className="absolute inset-0 z-[17] pointer-events-none"
      style={{ opacity: splineOpacity }}
    >
      <Suspense fallback={null}>
        <Spline
          scene={SPLINE_SCENE}
          style={{ width: '100%', height: '100%' }}
          onError={() => {}} // silent fail if scene URL is not set
        />
      </Suspense>
    </motion.div>
  );
}

/* =============================================================
   MAIN HERO COMPONENT
   ============================================================= */
export default function Hero() {
  const sectionRef   = useRef(null);
  const mouseX       = useRef(0);
  const mouseY       = useRef(0);
  const scrollProgressRef = useRef(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 80, damping: 20, mass: 1 });

  useEffect(
    () => smoothProgress.on('change', (v) => { scrollProgressRef.current = v; }),
    [smoothProgress]
  );

  // --- Text parallax ---
  const titleY       = useTransform(smoothProgress, [0, 0.6],       ['0%', '-40%']);
  const titleOpacity = useTransform(smoothProgress, [0, 0.3, 0.7],  [1, 1, 0]);
  const titleScale   = useTransform(smoothProgress, [0, 0.7],       [1, 0.9]);
  const titleBlur    = useTransform(smoothProgress, [0, 0.5, 0.8],  ['blur(0px)', 'blur(0px)', 'blur(20px)']);
  const taglineOpacity = useTransform(smoothProgress, [0, 0.2, 0.5], [1, 1, 0]);
  const taglineY       = useTransform(smoothProgress, [0, 0.5],      ['0%', '-60%']);
  const bottomOpacity  = useTransform(smoothProgress, [0, 0.15, 0.4], [1, 1, 0]);
  const bottomY        = useTransform(smoothProgress, [0, 0.4],      [0, 100]);
  const eyebrowOpacity = useTransform(smoothProgress, [0, 0.1, 0.3], [1, 1, 0]);
  const labelOpacity   = useTransform(smoothProgress, [0.35, 0.55, 0.85], [0, 1, 0]);
  const labelScale     = useTransform(smoothProgress, [0.35, 0.55], [0.8, 1]);

  // Three.js canvas fades to 0 by scroll 65%
  const canvasOpacity = useTransform(smoothProgress, [0, 0.4, 0.65], [0.35, 0.3, 0]);

  useEffect(() => {
    const onMove = (e) => {
      mouseX.current = (e.clientX / window.innerWidth)  * 2 - 1;
      mouseY.current = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const titleVariants = {
    hidden: { y: '120%', rotateZ: 3, opacity: 0 },
    show: (i) => ({
      y: '0%', rotateZ: 0, opacity: 1,
      transition: { duration: 1.4, delay: 0.2 + i * 0.15, ease: [0.16, 1, 0.3, 1] },
    }),
  };

  return (
    <section ref={sectionRef} className="hero-cinema" id="home">
      <div className="hero-sticky">

        {/* Z-1: Deep atmospheric gradient */}
        <div className="hero-atmosphere absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,rgba(250,219,95,0.06)_0%,transparent_60%)] mix-blend-screen pointer-events-none" />

        {/* Z-2 to Z-5: Hero image layers (floor → arch → pedestals → products) */}
        <HeroImageLayers scrollProgress={smoothProgress} />

        {/* Z-6: Meteors */}
        <Meteors number={30} />

        {/* Z-7: Three.js particle scene — fades out on deep scroll */}
        <motion.div className="hero-canvas absolute inset-0 z-[7]" style={{ opacity: canvasOpacity }}>
          <HeroScene mouseX={mouseX} mouseY={mouseY} scrollProgress={scrollProgressRef} />
        </motion.div>

        {/* Z-8–9: Spline 3D (appears briefly on first scroll) */}
        <SplineLayer scrollProgress={smoothProgress} />

        {/* Z-10: Gold dust drift overlay */}
        <DustOverlay />

        {/* Z-11: Mountain silhouette SVG */}
        <div className="hero-mountains absolute bottom-0 left-0 right-0 h-[50vh] z-[11] pointer-events-none opacity-90">
          <svg viewBox="0 0 1600 500" preserveAspectRatio="none" className="w-full h-full">
            <defs>
              <linearGradient id="mtnFar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#0f1d36" stopOpacity="0.8" />
                <stop offset="1" stopColor="#050e1c" stopOpacity="1" />
              </linearGradient>
              <linearGradient id="mtnNear" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#0a1428" stopOpacity="0.95" />
                <stop offset="1" stopColor="#000000" stopOpacity="1" />
              </linearGradient>
            </defs>
            <path d="M0,300 L80,240 L180,280 L280,200 L380,260 L500,180 L620,250 L760,170 L880,240 L1020,180 L1160,230 L1300,170 L1440,220 L1600,180 L1600,500 L0,500 Z" fill="url(#mtnFar)" />
            <path d="M0,380 L120,320 L240,360 L380,300 L520,350 L660,290 L800,340 L940,280 L1080,330 L1220,270 L1360,320 L1500,290 L1600,310 L1600,500 L0,500 Z" fill="url(#mtnNear)" />
          </svg>
        </div>

        {/* Z-12: Discipline corner labels */}
        <div className="absolute inset-0 z-[12] pointer-events-none">
          {DISCIPLINE_LABELS.map((label, i) => (
            <DisciplineLabel key={label.type} label={label} opacity={labelOpacity} scale={labelScale} index={i} />
          ))}
        </div>

        {/* Z-15: Brand elements — logo badge + wordmark */}
        <BrandElements scrollProgress={smoothProgress} />

        {/* Z-20: Main text overlay (title, tagline, CTAs) */}
        <div className="hero-overlay absolute inset-0 z-[20] flex flex-col justify-between p-[10%] pt-[15%] pointer-events-none">

          <div className="hero-top flex justify-between items-start">
            <motion.div
              className="hero-eyebrow text-xs tracking-[0.4em] uppercase text-[#fadb5f] flex items-center gap-4"
              style={{ opacity: eyebrowOpacity }}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="w-10 h-[1px] bg-[#fadb5f]" />
              From the Valley · Since 1985
            </motion.div>
            <motion.div
              className="hero-est-mark text-right text-xs tracking-[0.4em] uppercase text-[#8a7445]"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              Srinagar · Kashmir
              <span className="block mt-2 font-display italic text-lg text-[#fadb5f] capitalize tracking-wider">एस्ट. १९८५</span>
            </motion.div>
          </div>

          <motion.div
            className="hero-center self-center text-center w-full max-w-6xl"
            style={{ y: titleY, opacity: titleOpacity, scale: titleScale, filter: titleBlur }}
          >
            <h1
              className="hero-title font-display font-light leading-[0.9] tracking-tight text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
              style={{ fontSize: 'clamp(4rem, 10vw, 12rem)' }}
            >
              <span className="word-line block overflow-hidden pb-2">
                <motion.span custom={0} variants={titleVariants} initial="hidden" animate="show" className="inline-block">
                  Mastery in
                </motion.span>
              </span>
              <span className="word-line block overflow-hidden pb-2">
                <motion.span custom={1} variants={titleVariants} initial="hidden" animate="show" className="inline-block">
                  <WordRotator />
                </motion.span>
              </span>
              <span className="word-line block overflow-hidden pb-2">
                <motion.span custom={2} variants={titleVariants} initial="hidden" animate="show" className="inline-block">
                  One Address.
                </motion.span>
              </span>
            </h1>

            <motion.p
              className="hero-tagline mt-10 text-lg md:text-xl text-white/70 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-md"
              style={{ opacity: taglineOpacity, y: taglineY }}
              initial={{ opacity: 0, filter: 'blur(10px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1.2, delay: 1.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <strong className="text-white font-normal">MDF Enterprises</strong> — heritage purveyors of sporting equipment, musical instruments, fitness gear, and bespoke awards from the Valley of Kashmir.
            </motion.p>
          </motion.div>

          <motion.div
            className="hero-bottom flex justify-between items-end w-full"
            style={{ opacity: bottomOpacity, y: bottomY }}
          >
            <motion.div
              className="hero-actions flex gap-6 pointer-events-auto"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 2.0, ease: [0.16, 1, 0.3, 1] }}
            >
              <a
                href="#categories"
                className="btn-primary relative overflow-hidden group bg-gradient-to-br from-[#fadb5f] to-[#e8a33d] text-[#0a1428] px-10 py-5 flex items-center gap-4 text-xs tracking-[0.2em] uppercase font-bold transition-all hover:scale-105 shadow-[0_0_40px_rgba(250,219,95,0.3)]"
              >
                <span className="relative z-10 flex items-center gap-3">
                  Explore Collection
                  <svg width="18" height="14" viewBox="0 0 16 12" fill="none" className="transition-transform group-hover:translate-x-2">
                    <path d="M1 6h13m0 0L9 1m5 5L9 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-white translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
              </a>
              <a
                href="https://wa.me/919419191919"
                className="btn-ghost relative text-white px-6 py-5 flex items-center gap-3 text-xs tracking-[0.2em] uppercase transition-all hover:text-[#fadb5f]"
              >
                <span className="border-b border-[#fadb5f]/30 pb-1">WhatsApp Concierge</span>
              </a>
            </motion.div>

            <motion.div
              className="hero-scroll-cue flex flex-col items-center gap-4 text-[10px] tracking-[0.4em] uppercase text-[#fadb5f]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 2.2 }}
            >
              <span className="opacity-70">Scroll to explore</span>
              <div className="w-[1px] h-16 bg-gradient-to-b from-[#fadb5f] to-transparent relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1/3 bg-white animate-[scrollDot_2s_ease-in-out_infinite]" />
              </div>
            </motion.div>

            <motion.div
              className="hero-meta flex gap-10 text-right"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, delay: 2.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex flex-col gap-1">
                <span className="text-[10px] tracking-[0.3em] uppercase text-[#fadb5f] opacity-80">Verticals</span>
                <span className="font-display text-2xl text-white">Four</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] tracking-[0.3em] uppercase text-[#fadb5f] opacity-80">Heritage</span>
                <span className="font-display text-2xl italic text-[#fadb5f]">1985</span>
              </div>
            </motion.div>
          </motion.div>

        </div>

        {/* Z-22: Vignette */}
        <div className="absolute inset-0 z-[22] pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.38)_100%)]" />
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify hero renders with no console errors**

With dev server running at `http://localhost:5173`:
- Page loads → hero2 (gold cracked floor) should scale up from center over 1.4s
- At 2 seconds → hero1 (grand dark hall with arch) cross-dissolves in
- Scroll slowly → hero title parallaxes upward; at ~25% scroll, hall with shadow pedestals (hero3) begins fading in; at ~50% the fully lit products (hero4) appear
- MDF badge (hero5) appears in center after first slight scroll; wordmark (hero6) appears just below it
- Gold dust (hero7) drifts upward continuously in `screen` blend mode
- Three.js sparkles/particles visible until 65% scroll

Expected console: no errors. Spline will silently fail if the URL is placeholder — that is expected.

- [ ] **Step 3: Commit**

```bash
git add src/Hero.jsx
git commit -m "feat: cinematic 9-layer scroll-driven hero (Approach C)"
```

---

## Task 3: Replace Brands Section with Logo Marquee + Grid

**Files:**
- Modify: `src/Sections.jsx` — replace the `Brands` export only

- [ ] **Step 1: Replace the `BRANDS` constant and `Brands` component**

Find the `/* BRANDS */` comment block (around line 287) in `src/Sections.jsx`. Replace everything from `const BRANDS = [` through the closing `}` of the `Brands` function with:

```jsx
/* BRANDS */
const BRAND_LOGOS = [
  { file: 'yonexLogo.webp',   name: 'Yonex'   },
  { file: 'stagLogo.webp',    name: 'Stag'    },
  { file: 'sslogo.webp',      name: 'SS'      },
  { file: 'spartanLogo.webp', name: 'Spartan' },
  { file: 'sgLogo.webp',      name: 'SG'      },
  { file: 'niviaLogo.webp',   name: 'Nivia'   },
  { file: 'netcoLogo.webp',   name: 'Netco'   },
  { file: 'jonexLogo.webp',   name: 'Jonex'   },
  { file: 'coscoLogo.webp',   name: 'Cosco'   },
];

// Two copies for seamless infinite loop
const MARQUEE_LOGOS = [...BRAND_LOGOS, ...BRAND_LOGOS];

export function Brands() {
  return (
    <section className="section brands" id="brands">
      <div className="container">
        <motion.div
          className="section-header"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.div className="section-num" variants={fadeUp}>03 — Brands</motion.div>
          <div style={{ overflow: 'hidden' }}>
            <motion.h2 className="section-title" variants={textReveal}>
              The <em>names we stock.</em>
            </motion.h2>
          </div>
        </motion.div>

        {/* Infinite marquee strip */}
        <div className="brands-marquee-wrap overflow-hidden relative my-12 py-6 border-y border-[rgba(250,219,95,0.07)]">
          {/* Fade masks */}
          <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-[#050e1c] to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-[#050e1c] to-transparent pointer-events-none" />

          <motion.div
            className="flex gap-14 items-center"
            style={{ width: 'max-content', willChange: 'transform' }}
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
          >
            {MARQUEE_LOGOS.map((b, i) => (
              <div
                key={i}
                className="flex-shrink-0 flex items-center justify-center h-14 px-4 opacity-50 hover:opacity-90 transition-opacity duration-300"
              >
                <img
                  src={`/brands/${b.file}`}
                  alt={b.name}
                  className="h-9 w-auto object-contain"
                  style={{ filter: 'brightness(0) invert(1)' }}
                  draggable="false"
                />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Logo grid */}
        <motion.div
          className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-4"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
        >
          {BRAND_LOGOS.map((b, i) => (
            <motion.div
              key={i}
              className="group flex flex-col items-center justify-center gap-3 p-5 rounded-xl
                border border-[rgba(250,219,95,0.1)] bg-[rgba(10,20,40,0.45)] backdrop-blur-sm
                cursor-default"
              variants={fadeUp}
              whileHover={{
                scale: 1.06,
                y: -5,
                borderColor: 'rgba(250,219,95,0.4)',
                boxShadow: '0 12px 40px rgba(250,219,95,0.1)',
                transition: { duration: 0.3 },
              }}
            >
              <img
                src={`/brands/${b.file}`}
                alt={b.name}
                className="h-11 w-full object-contain"
                style={{ filter: 'brightness(0) invert(1)', opacity: 0.75 }}
                draggable="false"
              />
              <span className="text-[8px] tracking-[0.2em] uppercase text-[rgba(250,219,95,0.4)] group-hover:text-[rgba(250,219,95,0.75)] transition-colors duration-300">
                {b.name}
              </span>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          className="brand-cta"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          Plus another hundred and twenty names you'd recognise — and a handful you wouldn't, because the right kit isn't always the loudest one.{' '}
          <a href="#contact">Ask the desk.</a>
        </motion.p>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify Brands section in browser**

Scroll to the Brands section at `http://localhost:5173/#brands`:
- Infinite marquee strip scrolls left continuously with 9 logos (white, inverted)
- On hover, marquee items brighten
- Below the marquee: 9 logo cards in a row (desktop) — dark glassmorphic cards with gold border hover glow
- Name labels in tiny gold caps below each logo

- [ ] **Step 3: Commit**

```bash
git add src/Sections.jsx
git commit -m "feat: replace Brands section with logo marquee + glassmorphic grid"
```

---

## Task 4: Add Clients Section to Sections.jsx

**Files:**
- Modify: `src/Sections.jsx` — add new `Clients` export before the `/* CRAFT */` comment

- [ ] **Step 1: Add the Clients component**

Insert the following block in `src/Sections.jsx` directly after the closing `}` of the `Brands` function (before the `/* CRAFT */` comment):

```jsx
/* CLIENTS */
const CLIENT_LIST = [
  { file: 'crpfLogo.webp',       name: 'CRPF',              full: 'Central Reserve Police Force'                    },
  { file: 'dsekLogo.webp',       name: 'DSEK',              full: 'Directorate of School Education, Kashmir'        },
  { file: 'dyssLogo.webp',       name: 'DYSS',              full: 'Directorate of Youth Services & Sports'          },
  { file: 'kuLogo.webp',         name: 'Kashmir University', full: 'University of Kashmir'                          },
  { file: 'skaustLogo.webp',     name: 'SKAUST',            full: 'Sher-e-Kashmir University of Agri. Sciences'    },
  { file: 'gmcLogo.webp',        name: 'GMC',               full: 'Government Medical College, Srinagar'           },
  { file: 'jkpLogo.webp',        name: 'JK Police',         full: 'Jammu & Kashmir Police'                        },
  { file: 'clusterUniLogo.webp', name: 'Cluster University', full: 'Cluster University Srinagar'                   },
];

export function Clients() {
  return (
    <section className="section clients" id="clients">
      <div className="container">
        <motion.div
          className="section-header"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.div className="section-num" variants={fadeUp}>04 — Clients</motion.div>
          <div style={{ overflow: 'hidden' }}>
            <motion.h2 className="section-title" variants={textReveal}>
              Trusted by <em>institutions.</em>
            </motion.h2>
          </div>
          <motion.p
            className="mt-6 max-w-2xl text-white/45 text-sm leading-relaxed"
            variants={fadeUp}
          >
            From the Valley's finest academies to national security forces — MDF has been the address for organisations that demand the very best.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 mt-14"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
        >
          {CLIENT_LIST.map((c, i) => (
            <motion.div
              key={i}
              className="group flex flex-col items-center gap-5 p-8 rounded-2xl
                border border-[rgba(250,219,95,0.1)] bg-[rgba(10,20,40,0.5)]
                backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.25)] cursor-default"
              variants={fadeUp}
              whileHover={{
                y: -7,
                borderColor: 'rgba(250,219,95,0.35)',
                boxShadow: '0 16px 60px rgba(250,219,95,0.09)',
                transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
              }}
            >
              <div className="w-16 h-16 flex items-center justify-center">
                <img
                  src={`/clients/${c.file}`}
                  alt={c.name}
                  className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
                  style={{ filter: 'brightness(0) invert(1)', opacity: 0.8 }}
                  draggable="false"
                />
              </div>
              <div className="text-center">
                <div className="text-[11px] tracking-[0.22em] uppercase text-[rgba(250,219,95,0.75)] font-semibold mb-1">
                  {c.name}
                </div>
                <div className="text-[9px] tracking-[0.04em] text-white/28 leading-relaxed">
                  {c.full}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify Clients section in browser**

Navigate to `http://localhost:5173`. Scroll past the Brands section — the Clients section should appear with:
- Section heading "Trusted by institutions." with gold italic em
- 4×2 grid of 8 logo cards (white inverted logos on dark glassmorphic cards)
- Card names in gold small-caps + full institution name in dim white below
- Hover lifts card by 7px with gold border brightening and subtle glow

- [ ] **Step 3: Commit**

```bash
git add src/Sections.jsx
git commit -m "feat: add Clients section with 8 institutional logo cards"
```

---

## Task 5: Wire Clients into App.jsx

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Add Clients to the import and render**

In `src/App.jsx`, line 5, update the import from Sections.jsx to include `Clients`:

```jsx
import { Marquee, Heritage, Categories, Brands, Clients, Craft, Valley, Trust, CTA, Footer } from './Sections.jsx';
```

In the JSX render (currently around line 188–189), add `<Clients />` directly after `<Brands />`:

```jsx
      <Brands />
      <Clients />
      <Craft />
```

Also add Clients to the nav menu in the `Nav` component (around line 117), after the Brands link:

```jsx
        <li><a href="#brands" className="interactive">Brands</a></li>
        <li><a href="#clients" className="interactive">Clients</a></li>
```

- [ ] **Step 2: Verify full page in browser**

At `http://localhost:5173`, verify the complete page order:
1. Hero (cinematic scroll animation)
2. Marquee strip
3. Heritage
4. Categories
5. Brands (marquee + grid) — nav link "Brands" scrolls here
6. **Clients (new)** — nav link "Clients" scrolls here
7. Craft
8. Valley
9. Trust
10. CTA / Contact
11. Footer

- [ ] **Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "feat: add Clients to app layout and nav"
```

---

## Task 6: Final Visual Verification & Polish

**Files:** None (verification only)

- [ ] **Step 1: Full scroll-through test**

Open `http://localhost:5173` in browser. Perform the following checks:

| What to check | Expected |
|---|---|
| Page load | hero2 (cracked gold floor) scales up from center in ~1.4s |
| 2s after load | hero1 (dark hall + arch + mountains) cross-dissolves in |
| First 0–30% scroll | hero1 slowly zooms (1→1.12x); MDF badge appears center; wordmark appears below badge |
| 25–45% scroll | hero3 (pedestals in shadow) fades in over hero1 |
| 50–70% scroll | hero4 (all 4 lit products) fades in; Three.js icons fly to corners |
| ~80–100% scroll | Everything fades to dark; smooth Lenis transition into Marquee |
| hero7 dust | Gold smoke drifts upward continuously, screen blend mode |
| hero5 badge | Pulsing gold ring animation around badge |
| Brands section | Infinite marquee scrolling left; hover on logo cards triggers gold glow |
| Clients section | 4×2 grid, hover lifts cards; logos visible as white silhouettes |
| Nav | "Brands" and "Clients" links in nav scroll to correct sections |

- [ ] **Step 2: Check mobile (375px viewport)**

Resize browser to 375px width. Verify:
- Hero still shows floor → arch cross-dissolve (scroll zone is `220vh` on mobile)
- Hero title text doesn't overflow
- Clients grid collapses to 2-column layout
- Brands grid collapses to 3-column layout
- Marquee strip still scrolls

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "feat: complete cinematic hero animation + brands/clients sections"
```

---

## Self-Review Notes

- **Spec coverage:** All 9 layers implemented (hero1–7, Three.js, Spline). All scroll percentages match spec. Brands marquee + grid with real logos. Clients with all 8 institutions. App.jsx wired. ✓
- **No placeholders:** All code is complete. Spline uses a real (but generic) public URL — documented to replace. ✓  
- **Type consistency:** `scrollProgress` is passed as a framer-motion `MotionValue<number>` throughout. `useTransform` calls use the same value name in all tasks. ✓
- **Asset paths:** All logo paths verified against glob: `/brands/*.webp` and `/clients/*.webp`. ✓
- **`filter: brightness(0) invert(1)`:** Applied to all brand/client logos — renders them as white silhouettes on dark glassmorphic cards, which is the standard premium treatment. ✓
