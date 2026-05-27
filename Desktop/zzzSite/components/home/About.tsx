'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import { CountUp } from '@/components/ui/CountUp'

const stats = [
  { target: 18, suffix: '+', label: 'Years of Excellence' },
  { target: 1000, suffix: '+', label: 'Institutions Served' },
  { target: 500, suffix: '+', label: 'Installations Done' },
  { target: 25, suffix: '+', label: 'Trusted Brands' },
]

const features = [
  { title: 'Wide Product Range', desc: 'Sports, fitness, music & awards under one roof.' },
  { title: 'Quality Assurance', desc: '100% genuine products from certified brands.' },
  { title: 'Expert Installation', desc: 'In-house team for full setup and commissioning.' },
  { title: 'Pan India Delivery', desc: 'Fast, tracked delivery to any location.' },
  { title: 'Custom Solutions', desc: 'Tailored packages for institutions of every size.' },
  { title: 'After-Sales Support', desc: 'AMC and service contracts available.' },
]

export function About() {
  const shouldReduce = useReducedMotion()
  const imgRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: imgRef, offset: ['start end', 'end start'] })
  const yImg = useTransform(scrollYProgress, [0, 1], shouldReduce ? [0, 0] : [-30, 30])

  return (
    <section id="about" className="bg-[#0f0f0f] py-20 md:py-28">
      <div className="max-w-[1440px] mx-auto w-full px-6 md:px-12">

        {/* Top: text + image */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-16">

          {/* Left: editorial content */}
          <div>
            <motion.p
              className="overline-gold mb-6"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              About MDF Enterprises
            </motion.p>
            <motion.h2
              className="text-[36px] md:text-[48px] font-medium text-white leading-[1.05] mb-6"
              style={{ fontFamily: 'var(--font-cormorant), serif' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              More Than A Supplier.<br />
              We&apos;re Your Partner<span className="text-[#C89B5E]">.</span>
            </motion.h2>
            <motion.p
              className="text-white/50 text-[15px] leading-relaxed mb-4"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Founded in 2006 in Srinagar, MDF Enterprises has grown into J&K&apos;s most trusted equipment supplier — serving educational institutions, sports complexes, government bodies, gyms, and corporates across the valley and beyond.
            </motion.p>
            <motion.p
              className="text-white/50 text-[15px] leading-relaxed mb-10"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              From consultation and procurement to installation and after-sales support — we are with you at every step. GeM registered, MSME certified, and proud to be a one-stop shop.
            </motion.p>

            {/* Features grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i, duration: 0.5 }}
                >
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#C89B5E] flex-shrink-0" aria-hidden />
                  <div>
                    <p className="text-[13px] font-bold text-white mb-0.5">{f.title}</p>
                    <p className="text-[12px] text-white/40 leading-tight">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: parallax image */}
          <div ref={imgRef} className="relative overflow-hidden rounded-2xl">
            <motion.div style={{ y: yImg }}>
              <div className="relative w-full aspect-[4/3]">
                <Image
                  src="/assets/hero.png"
                  alt="MDF Enterprises store front"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-black/10" />
              </div>
            </motion.div>
            {/* Gold corner accent */}
            <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-[#C89B5E]/40" aria-hidden />
            <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-[#C89B5E]/40" aria-hidden />
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.06] border border-white/[0.06] rounded-xl overflow-hidden">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              className="bg-[#0f0f0f] px-8 py-7 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
            >
              <div className="text-[36px] font-bold text-white leading-none mb-2">
                <CountUp target={s.target} suffix={s.suffix} />
              </div>
              <div className="text-[11px] text-white/35 tracking-[0.12em] uppercase font-medium">{s.label}</div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
