import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import Lenis from 'lenis';
import Hero from './Hero.jsx';
import { Marquee, Heritage, Categories, Brands, Clients, Craft, Valley, Trust, CTA, Footer } from './Sections.jsx';

/* CUSTOM CURSOR */
function Cursor() {
  const cursorRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    let mx = 0, my = 0, cx = 0, cy = 0;
    const onMove = (e) => {
      mx = e.clientX; my = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      }
    };
    const loop = () => {
      cx += (mx - cx) * 0.15;
      cy += (my - cy) * 0.15;
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      }
      requestAnimationFrame(loop);
    };
    document.addEventListener('mousemove', onMove);
    loop();

    const onEnter = (e) => {
      cursorRef.current?.classList.add('hover');
      if (e.target.classList.contains('btn-primary')) {
        cursorRef.current?.classList.add('btn-hover');
      }
    };
    const onLeave = () => {
      cursorRef.current?.classList.remove('hover');
      cursorRef.current?.classList.remove('btn-hover');
    };
    
    const els = document.querySelectorAll('.interactive, a, button');
    els.forEach((el) => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });

    const observer = new MutationObserver(() => {
      const newEls = document.querySelectorAll('.interactive, a, button');
      newEls.forEach((el) => {
        if (!el.dataset.cursorBound) {
          el.dataset.cursorBound = 'true';
          el.addEventListener('mouseenter', onEnter);
          el.addEventListener('mouseleave', onLeave);
        }
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener('mousemove', onMove);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div className="cursor" ref={cursorRef} />
      <div className="cursor-dot" ref={dotRef} />
    </>
  );
}

/* PRELOADER */
function Preloader({ onDone }) {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => {
      setHidden(true);
      onDone?.();
    }, 1100);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <motion.div
      className="preloader"
      initial={{ opacity: 1 }}
      animate={{ opacity: hidden ? 0 : 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{ pointerEvents: hidden ? 'none' : 'auto' }}
    >
      <div className="preloader-mark" />
      <div className="preloader-text">MDF · Established 1985</div>
    </motion.div>
  );
}

/* NAV */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <a href="#" className="nav-logo interactive">
        <img src="/logo.png" alt="MDF Enterprises" />
        <div className="nav-logo-text">
          MDF
          <span>Enterprises</span>
        </div>
      </a>
      <ul className="nav-menu">
        <li><a href="#heritage" className="interactive">Heritage</a></li>
        <li><a href="#categories" className="interactive">Catalogue</a></li>
        <li><a href="#brands" className="interactive">Brands</a></li>
        <li><a href="#clients" className="interactive">Clients</a></li>
        <li><a href="#craft" className="interactive">Craft</a></li>
        <li><a href="#contact" className="interactive">Contact</a></li>
      </ul>
      <a href="#contact" className="nav-cta interactive"><span>Visit Showroom</span></a>
    </nav>
  );
}

/* SCROLL PROGRESS BAR */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  return (
    <div className="scroll-progress">
      <motion.div className="scroll-progress-fill" style={{ scaleX }} />
    </div>
  );
}

/* APP */
export default function App() {
  // Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    document.documentElement.classList.add('lenis');

    // Smooth-scroll anchor links via Lenis
    const anchors = document.querySelectorAll('a[href^="#"]');
    const onAnchorClick = (e) => {
      const href = e.currentTarget.getAttribute('href');
      if (href.length > 1) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          lenis.scrollTo(target, { duration: 1.4 });
        }
      }
    };
    anchors.forEach((a) => a.addEventListener('click', onAnchorClick));

    return () => {
      lenis.destroy();
      anchors.forEach((a) => a.removeEventListener('click', onAnchorClick));
      document.documentElement.classList.remove('lenis');
    };
  }, []);

  return (
    <>
      <Preloader />
      <Cursor />
      <ScrollProgress />
      <Nav />

      <Hero />
      <Marquee />
      <Heritage />
      <Categories />
      <Brands />
      <Clients />
      <Craft />
      <Valley />
      <Trust />
      <CTA />
      <Footer />
    </>
  );
}
