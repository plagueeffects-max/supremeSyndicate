'use client'

import Link from 'next/link'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useRef } from 'react'

const staggerContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15, delayChildren: 0.4 },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.25, 0.1, 0.25, 1] },
  },
}

const zoomIn = {
  hidden: { opacity: 0, scale: 1.08 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1.2, ease: [0.25, 0.1, 0.25, 1] },
  },
}

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const shouldReduce = useReducedMotion()
  const { scrollY } = useScroll()
  const textY = useTransform(scrollY, [0, 600], [0, shouldReduce ? 0 : -80])
  const scrollIndicatorOpacity = useTransform(scrollY, [0, 120], [1, 0])

  return (
    <section
      ref={containerRef}
      className="relative h-screen min-h-[600px] overflow-hidden bg-deep"
    >
      <HeroBackground />
      <div className="absolute inset-0 bg-gradient-to-t from-deep/95 via-deep/30 to-deep/10 pointer-events-none" />

      <motion.div
        className="absolute bottom-[12%] left-6 md:left-16 lg:left-24 max-w-xl lg:max-w-2xl"
        style={{ y: textY }}
      >
        <motion.div variants={staggerContainer} initial="hidden" animate="show">
          <motion.p variants={fadeUp} className="label-gold mb-5">
            Sports · Fitness · Music · Awards
          </motion.p>

          <motion.h1
            variants={zoomIn}
            className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.05] tracking-tight"
          >
            Where Excellence<br />
            Meets Every Domain
          </motion.h1>

          <motion.div variants={fadeUp} className="w-10 h-px bg-gold my-6" />

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
            <Link href="/products" className="btn-primary">
              Browse Products
            </Link>
            <a href="#contact" className="btn-ghost">
              Partner With Us →
            </a>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ opacity: scrollIndicatorOpacity }}
        animate={shouldReduce ? {} : { y: [0, 6, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ChevronDown size={22} className="text-gold/40" />
      </motion.div>
    </section>
  )
}

function HeroBackground() {
  const shouldReduce = useReducedMotion()

  return (
    <>
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        onError={e => {
          ;(e.currentTarget as HTMLVideoElement).style.display = 'none'
        }}
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>

      <motion.div
        className="absolute inset-0"
        animate={
          shouldReduce
            ? {}
            : {
                background: [
                  'radial-gradient(ellipse at 25% 35%, #1a3a6b 0%, #0d1f4a 40%, #050e24 100%)',
                  'radial-gradient(ellipse at 75% 65%, #1a3a6b 0%, #0d1f4a 40%, #050e24 100%)',
                  'radial-gradient(ellipse at 50% 20%, #1a3a6b 0%, #0d1f4a 40%, #050e24 100%)',
                  'radial-gradient(ellipse at 25% 35%, #1a3a6b 0%, #0d1f4a 40%, #050e24 100%)',
                ],
              }
        }
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        style={{
          background: 'radial-gradient(ellipse at 25% 35%, #1a3a6b 0%, #0d1f4a 40%, #050e24 100%)',
        }}
      />

      {!shouldReduce && <GoldParticles />}
    </>
  )
}

const PARTICLES = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  left: `${(i * 37 + 11) % 100}%`,
  top: `${(i * 53 + 7) % 100}%`,
  size: (i % 3) + 1.5,
  duration: 15 + (i % 10),
  delay: (i * 0.7) % 8,
}))

function GoldParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {PARTICLES.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-gold/25"
          style={{ left: p.left, top: p.top, width: p.size, height: p.size }}
          animate={{ y: [-15, 15, -15], opacity: [0.1, 0.5, 0.1] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}
