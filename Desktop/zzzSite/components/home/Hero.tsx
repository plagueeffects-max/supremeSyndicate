'use client'

import { motion, useReducedMotion, type Variants } from 'framer-motion'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { MagneticButton } from '@/components/ui/MagneticButton'

const panels = [
  { label: 'Sports', image: '/assets/hero1Basketball.png', alt: 'Sports equipment' },
  { label: 'Fitness', image: '/assets/hero2Bench.png', alt: 'Fitness equipment' },
  { label: 'Music', image: '/assets/hero3Guitar.png', alt: 'Musical instruments' },
  { label: 'Awards', image: '/assets/hero4Trophy.png', alt: 'Awards & trophies' },
]

const statBadges = [
  { value: '18+', label: 'Years of Excellence' },
  { value: '1000+', label: 'Institutions Served' },
  { value: 'GeM', label: 'Registered Supplier' },
  { value: 'MSME', label: 'Certified Enterprise' },
]

const statsBar = [
  { value: '18+', label: 'Years of Excellence' },
  { value: '1000+', label: 'Institutions Served' },
  { value: '500+', label: 'Installations Done' },
  { value: '25+', label: 'Expert Professionals' },
]

const headlineWords = ['ONE', 'STOP.', 'EVERY', 'NEED.']

export function Hero() {
  const shouldReduce = useReducedMotion()

  const container: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.08, delayChildren: shouldReduce ? 0 : 0.5 },
    },
  }
  const wordVar: Variants = {
    hidden: { opacity: 0, y: shouldReduce ? 0 : 50 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
  }

  return (
    <motion.section
      className="relative w-full min-h-screen bg-[#050505] flex items-center overflow-hidden"
      initial={shouldReduce ? {} : { scale: 1.06, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Subtle radial glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(ellipse,rgba(200,155,94,0.06)_0%,transparent_70%)]" />
      </div>

      {/* ── Left content ── */}
      <div className="relative z-10 w-full lg:w-[52%] px-6 md:px-12 lg:pl-[8%] lg:pr-10 pt-32 pb-32 lg:pt-40 lg:pb-40">

        {/* Eyebrow */}
        <motion.div
          className="overline-gold mb-7"
          initial={shouldReduce ? {} : { opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          J&K&apos;s Premier Equipment Hub · Est. 2006
        </motion.div>

        {/* H1 — staggered words */}
        <motion.h1
          variants={container}
          initial="hidden"
          animate="show"
          className="mb-5"
          style={{ fontFamily: 'var(--font-cormorant), serif' }}
        >
          {headlineWords.map((word, i) => (
            <motion.span
              key={word}
              variants={wordVar}
              className={[
                'block text-[64px] md:text-[80px] lg:text-[88px] xl:text-[100px] leading-[0.95] font-bold tracking-tight',
                i === 1
                  ? 'text-[#C89B5E]'
                  : i === 2
                  ? 'text-transparent'
                  : 'text-white',
              ].join(' ')}
              style={
                i === 2
                  ? { WebkitTextStroke: '1.5px rgba(255,255,255,0.5)' }
                  : undefined
              }
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>

        {/* Service tags */}
        <motion.p
          className="text-white/40 text-[12px] font-medium tracking-[0.18em] uppercase mb-10"
          initial={shouldReduce ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85, duration: 0.5 }}
        >
          Sports · Fitness · Music · Awards · Installation · Service
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-wrap gap-4 items-center mb-12"
          initial={shouldReduce ? {} : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <MagneticButton as="a" href="/products" className="btn-gold gap-2">
            Explore Products <ArrowRight size={16} />
          </MagneticButton>
          <MagneticButton
            as="a"
            href="https://wa.me/917006252334"
            target="_blank"
            rel="noreferrer"
            className="btn-ghost-dark gap-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            WhatsApp Us
          </MagneticButton>
        </motion.div>

        {/* Stat badges */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-white/[0.06]"
          initial={shouldReduce ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.5 }}
        >
          {statBadges.map(b => (
            <div key={b.value} className="flex flex-col">
              <span className="text-[18px] font-bold text-white leading-none mb-1">{b.value}</span>
              <span className="text-[10px] text-white/35 font-medium tracking-wide uppercase">{b.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── Right — slanted image panels ── */}
      <div
        className="absolute right-0 top-0 bottom-0 w-[54%] hidden lg:flex z-0 overflow-hidden"
        aria-hidden
      >
        <div
          className="flex w-[130%] h-[110%] -translate-y-[5%] -skew-x-[8deg] origin-bottom-left translate-x-[8%]"
        >
          {panels.map((panel, i) => (
            <motion.div
              key={panel.label}
              className="flex-1 relative border-l border-[rgba(200,155,94,0.12)] group overflow-hidden"
              initial={shouldReduce ? {} : { opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="absolute inset-[-20px] skew-x-[8deg]">
                <Image
                  src={panel.image}
                  alt={panel.alt}
                  fill
                  className="object-cover scale-[1.1] group-hover:scale-[1.18] transition-transform duration-700"
                  sizes="15vw"
                  priority={i < 2}
                />
              </div>
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />
              {/* Gold border on hover */}
              <div className="absolute inset-0 border-[1.5px] border-transparent group-hover:border-[#C89B5E]/30 transition-colors duration-500" />
              {/* Vertical label */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                <span
                  className="text-[9px] font-bold tracking-[0.3em] text-[rgba(200,155,94,0.45)] group-hover:text-[#C89B5E] uppercase transition-colors duration-300"
                  style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
                >
                  {panel.label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Stats bar ── */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[92%] max-w-[1200px] bg-[#0f0f0f] border border-white/[0.06] rounded-t-xl z-20 py-5 px-8 hidden md:flex items-center justify-between gap-0"
        initial={shouldReduce ? {} : { opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {statsBar.map((stat, i) => (
          <div key={stat.value} className="flex items-center gap-0 flex-1">
            <div className="flex-1 text-center">
              <div className="text-[20px] font-bold text-white leading-none mb-1">{stat.value}</div>
              <div className="text-[10px] text-white/35 font-medium tracking-wide uppercase">{stat.label}</div>
            </div>
            {i < statsBar.length - 1 && (
              <div className="w-px h-8 bg-white/[0.06]" />
            )}
          </div>
        ))}
        {/* GeM + MSME */}
        <div className="flex items-center gap-5 pl-6 border-l border-white/[0.06] ml-4">
          <div className="text-center">
            <div className="text-[11px] font-black text-[#4caf50] tracking-tight leading-none">GeM</div>
            <div className="text-[8px] text-white/25 tracking-widest uppercase mt-0.5">Registered</div>
          </div>
          <div className="text-center">
            <div className="text-[11px] font-black text-[#1565c0] tracking-tight leading-none">MSME</div>
            <div className="text-[8px] text-white/25 tracking-widest uppercase mt-0.5">Certified</div>
          </div>
        </div>
      </motion.div>
    </motion.section>
  )
}
