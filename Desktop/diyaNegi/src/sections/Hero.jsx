import { motion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import GrainCanvas from '../components/GrainCanvas'
import { useTextScramble } from '../components/TextScramble'

export default function Hero() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const imageY = useTransform(scrollYProgress, [0, 1], ['0px', '-80px'])

  const [triggerDiya, setTriggerDiya] = useState(false)
  const [triggerNegi, setTriggerNegi] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setTriggerDiya(true), 400)
    const t2 = setTimeout(() => setTriggerNegi(true), 700)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  const diya = useTextScramble('DIYA', triggerDiya, 900)
  const negi = useTextScramble('NEGI', triggerNegi, 900)

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative min-h-screen bg-black overflow-hidden flex items-end"
    >
      {/* Three.js grain layer */}
      <GrainCanvas />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Portrait image — diagonal peek from right */}
      <motion.div
        initial={{ clipPath: 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)' }}
        animate={{ clipPath: 'polygon(12% 0, 100% 0, 100% 100%, 0% 100%)' }}
        transition={{ delay: 1.0, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        style={{ y: imageY }}
        className="absolute right-0 top-0 bottom-0 w-[52%]"
      >
        <img
          src="/images/myPortfolio1.png"
          alt="Diya Negi"
          className="w-full h-full object-cover object-top"
          loading="eager"
        />
        {/* Gradient to blend left edge into black */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to right, #000 0%, transparent 22%)' }}
        />
      </motion.div>

      {/* Text content — bottom-left */}
      <div className="relative z-10 px-8 lg:px-24 xl:px-32 pb-16 lg:pb-24 w-full">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-[10px] tracking-[0.3em] uppercase text-white/30 mb-3 font-mono"
        >
          Hello, I&apos;m
        </motion.p>

        <div className="overflow-hidden">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.1 }}
            className="text-[clamp(80px,12vw,160px)] font-black leading-[0.85] tracking-[-0.05em] text-white select-none"
          >
            {diya}
          </motion.h1>
        </div>

        <div className="overflow-hidden">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.1 }}
            className="text-[clamp(80px,12vw,160px)] font-black leading-[0.85] tracking-[-0.05em] select-none"
            style={{
              WebkitTextStroke: '1px rgba(255,255,255,0.35)',
              color: 'transparent',
            }}
          >
            {negi}
          </motion.h1>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-[10px] tracking-[0.22em] uppercase text-white/25 mt-6 font-mono"
        >
          Content Creator · Lifestyle · Beauty · Delhi
        </motion.p>
      </div>

      {/* Scroll indicator — right side */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.8 }}
        className="absolute right-8 lg:right-24 bottom-16 z-10 flex flex-col items-center gap-2"
      >
        <div
          className="w-px h-16"
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.3))' }}
        />
        <span
          className="text-[8px] tracking-[0.22em] text-white/20 uppercase font-mono"
          style={{ writingMode: 'vertical-rl' }}
        >
          Scroll
        </span>
      </motion.div>

      {/* Page number */}
      <div className="absolute bottom-6 left-8 lg:left-24 z-10 text-[9px] font-mono text-white/15 tracking-widest">
        01 / 08
      </div>
    </section>
  )
}
