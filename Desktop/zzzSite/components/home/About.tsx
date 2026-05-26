'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { CountUp } from '@/components/ui/CountUp'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { AboutOverlay } from './AboutOverlay'

const stats = [
  { target: 10, suffix: '+', label: 'Years' },
  { target: 500, suffix: '+', label: 'Clients' },
  { target: 4, suffix: '', label: 'Domains' },
]

export function About() {
  const [overlayOpen, setOverlayOpen] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const shouldReduce = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const imageY = useTransform(scrollYProgress, [0, 1], shouldReduce ? ['0%', '0%'] : ['-4%', '4%'])
  const textY = useTransform(scrollYProgress, [0, 1], shouldReduce ? ['0%', '0%'] : ['4%', '-4%'])

  return (
    <>
      <AboutOverlay isOpen={overlayOpen} onClose={() => setOverlayOpen(false)} />

      <section
        id="about"
        ref={sectionRef}
        className="section-padding bg-navy/30 overflow-hidden"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div style={{ y: imageY }} className="relative">
              <AnimatedSection delay={0.1}>
                <div className="relative aspect-[4/5] rounded-sm overflow-hidden border border-gold/10 bg-navy">
                  <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy/80 to-deep flex items-center justify-center">
                    <Image
                      src="/mdfLogoWtext.webp"
                      alt="MDF Enterprises"
                      width={220}
                      height={80}
                      className="w-44 opacity-40 object-contain"
                    />
                  </div>
                  <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-gold/40" />
                  <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-gold/40" />
                </div>
              </AnimatedSection>
            </motion.div>

            <motion.div style={{ y: textY }}>
              <AnimatedSection delay={0.2}>
                <p className="label-gold mb-4">About MDF</p>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-white leading-snug mb-5">
                  Your Partner in<br />Excellence, Across Domains
                </h2>
                <div className="w-10 h-px bg-gold mb-6" />
                <p className="text-white/60 text-base leading-relaxed mb-8">
                  From national sports academies to corporate campuses, MDF Enterprises delivers premium sports equipment, fitness gear, musical instruments, and custom awards — with the consistency and care that institutions demand.
                </p>

                <div className="flex gap-10 mb-10">
                  {stats.map(stat => (
                    <div key={stat.label}>
                      <p className="font-display text-3xl font-bold text-gold">
                        <CountUp target={stat.target} suffix={stat.suffix} />
                      </p>
                      <p className="text-white/40 text-xs tracking-widest uppercase mt-1">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setOverlayOpen(true)}
                  aria-label="Learn Our Story"
                  className="btn-ghost inline-flex"
                >
                  Learn More About Us →
                </button>
              </AnimatedSection>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}
