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
const HeroImageLayers = React.memo(function HeroImageLayers({ scrollProgress }) {
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
});

/* =============================================================
   LAYERS 8–9: BRAND ELEMENTS (hero5 badge + hero6 wordmark)
   Appear as floating glassmorphic panels mid-scroll.
   ============================================================= */
const BrandElements = React.memo(function BrandElements({ scrollProgress }) {
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
            alt=""
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
});

/* =============================================================
   LAYER 7: DUST OVERLAY (hero7)
   Gold atmospheric dust, drifts upward continuously.
   ============================================================= */
function DustOverlay() {
  return (
    <div
      className="absolute inset-0 z-[10] pointer-events-none overflow-hidden flex items-end justify-center pb-0"
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
const SplineLayer = React.memo(function SplineLayer({ scrollProgress }) {
  const splineOpacity = useTransform(
    scrollProgress,
    [0.05, 0.18, 0.45],
    [0, 0.5, 0]
  );

  return (
    <motion.div
      className="absolute inset-0 z-[9] pointer-events-none"
      style={{ opacity: splineOpacity }}
    >
      <Suspense fallback={null}>
        <Spline
          scene={SPLINE_SCENE}
          style={{ width: '100%', height: '100%' }}
          onError={() => {}}
        />
      </Suspense>
    </motion.div>
  );
});

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

  useEffect(() => {
    const unsub = smoothProgress.on('change', (v) => { scrollProgressRef.current = v; });
    return unsub;
  }, [smoothProgress]);

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

        {/* Z-9: Spline 3D (appears briefly on first scroll) */}
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
