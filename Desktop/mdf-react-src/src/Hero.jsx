import React, { useRef, useEffect, useState, useMemo } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
} from 'framer-motion';
import HeroScene from './HeroScene.jsx';

/* =============================================================
   WORD ROTATOR (Mastery Style)
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
   HERO IMAGE PARALLAX STACK
   ============================================================= */
const HeroImageLayers = React.memo(function HeroImageLayers({ scrollProgress }) {
  // Parallax offsets
  const y1 = useTransform(scrollProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollProgress, [0, 1], [0, -150]);
  const y3 = useTransform(scrollProgress, [0, 1], [0, -100]);
  const y4 = useTransform(scrollProgress, [0, 1], [0, -50]);
  
  const scale = useTransform(scrollProgress, [0, 1], [1, 1.1]);
  const opacity3 = useTransform(scrollProgress, [0.2, 0.5], [0, 1]);
  const opacity4 = useTransform(scrollProgress, [0.4, 0.7], [0, 1]);

  return (
    <div className="hero-img-stack">
      {/* Background Layer: Floor */}
      <motion.img
        src="/hero/hero2.png"
        className="hero-img-layer"
        style={{ y: y1, scale }}
        alt=""
      />

      {/* Middle Layer: Arch */}
      <motion.img
        src="/hero/hero1.png"
        className="hero-img-layer"
        style={{ y: y2, scale }}
        alt=""
      />

      {/* Reveal Layer: Pedestals */}
      <motion.img
        src="/hero/hero3.png"
        className="hero-img-layer"
        style={{ y: y3, opacity: opacity3, scale }}
        alt=""
      />

      {/* Foreground Layer: Products */}
      <motion.img
        src="/hero/hero4.png"
        className="hero-img-layer"
        style={{ y: y4, opacity: opacity4, scale }}
        alt=""
      />
    </div>
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

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.6 });

  useEffect(() => {
    const unsub = smoothProgress.on('change', (v) => { scrollProgressRef.current = v; });
    return unsub;
  }, [smoothProgress]);

  // Content Parallax
  const contentY = useTransform(smoothProgress, [0, 1], [0, -100]);
  const contentOpacity = useTransform(smoothProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    const onMove = (e) => {
      mouseX.current = (e.clientX / window.innerWidth)  * 2 - 1;
      mouseY.current = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <section ref={sectionRef} className="hero-cinema" id="home">
      <div className="hero-sticky">
        
        {/* Parallax Image Stack */}
        <HeroImageLayers scrollProgress={smoothProgress} />

        {/* 3D Scene Layer */}
        <div className="hero-canvas absolute inset-0 z-[5]">
          <HeroScene mouseX={mouseX} mouseY={mouseY} scrollProgress={scrollProgressRef} />
        </div>

        {/* Atmospheric Overlays */}
        <div className="hero-dust-img absolute inset-0 z-[10] pointer-events-none mix-blend-screen opacity-40">
           <img src="/hero/hero7.png" className="w-full h-full object-cover" alt="" />
        </div>

        {/* Main Content */}
        <motion.div 
          className="hero-overlay absolute inset-0 z-[20] flex flex-col justify-center items-center text-center p-6"
          style={{ y: contentY, opacity: contentOpacity }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-[#fadb5f] text-xs tracking-[0.5em] uppercase mb-8"
          >
            Rooted in Kashmir · Established 1985
          </motion.div>

          <h1 className="hero-title text-white font-display leading-[0.85] tracking-tight mb-12" style={{ fontSize: 'clamp(4rem, 12vw, 10rem)' }}>
            <span className="block overflow-hidden">
               <motion.span 
                 initial={{ y: '100%' }} 
                 animate={{ y: 0 }} 
                 transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                 className="inline-block"
               >
                 Mastery in
               </motion.span>
            </span>
            <span className="block overflow-hidden pb-4">
               <motion.span 
                 initial={{ y: '100%' }} 
                 animate={{ y: 0 }} 
                 transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                 className="inline-block"
               >
                 <WordRotator />
               </motion.span>
            </span>
            <span className="block overflow-hidden">
               <motion.span 
                 initial={{ y: '100%' }} 
                 animate={{ y: 0 }} 
                 transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                 className="inline-block"
               >
                 One Address.
               </motion.span>
            </span>
          </h1>

          <motion.p 
            className="text-white/60 text-lg md:text-xl max-w-2xl font-light leading-relaxed mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
          >
            Heritage purveyors of sporting equipment, musical instruments, and bespoke awards from the Valley of Kashmir.
          </motion.p>

          <motion.div 
            className="flex gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.8 }}
          >
            <a href="#categories" className="px-12 py-6 bg-[#fadb5f] text-black font-bold uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-[0_0_50px_rgba(250,219,95,0.3)]">
              Explore Collection
            </a>
            <a href="#heritage" className="px-12 py-6 border border-white/20 text-white font-bold uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all">
              Our Story
            </a>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-4 text-[#fadb5f] text-[10px] tracking-[0.4em] uppercase"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span>Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-[#fadb5f] to-transparent" />
        </motion.div>

        {/* Deep Vignette */}
        <div className="absolute inset-0 z-[25] pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]" />
      </div>
    </section>
  );
}
