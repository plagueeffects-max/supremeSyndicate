'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { EASE } from '@/lib/animation'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { MagneticButton } from '@/components/ui/MagneticButton'

export function CtaBand() {
  const shouldReduce = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], shouldReduce ? [0, 0] : [-40, 40])

  return (
    <section ref={ref} className="relative overflow-hidden bg-[#050505] py-28 md:py-36">

      {/* Parallax background grid */}
      <motion.div
        className="absolute inset-[-10%] pointer-events-none"
        style={{ y: bgY }}
        aria-hidden
      >
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(rgba(200,155,94,1) 1px, transparent 1px), linear-gradient(90deg, rgba(200,155,94,1) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(200,155,94,0.08)_0%,transparent_65%)]" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 max-w-[800px] mx-auto px-6 text-center">
        <motion.p
          className="overline-gold justify-center mb-6"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Ready to Get Started?
        </motion.p>
        <motion.h2
          className="text-[40px] md:text-[60px] lg:text-[72px] font-medium text-white leading-[1.0] mb-6"
          style={{ fontFamily: 'var(--font-cormorant), serif' }}
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.7, ease: EASE }}
        >
          Ready to Equip<br />
          Your Institution<span className="text-[#C89B5E]">?</span>
        </motion.h2>
        <motion.p
          className="text-white/45 text-[15px] leading-relaxed mb-10 max-w-[500px] mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25, duration: 0.5 }}
        >
          From consultation to installation — we handle everything. GeM registered, MSME certified, 18+ years of excellence.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35, duration: 0.5 }}
        >
          <MagneticButton as="a" href="/products" className="btn-gold">
            Explore Products <ArrowRight size={15} />
          </MagneticButton>
          <MagneticButton as="a" href="/#contact" className="btn-ghost-dark">
            Get a Quote
          </MagneticButton>
          <MagneticButton
            as="a"
            href="https://wa.me/917006252334"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-[12px] font-bold tracking-[0.1em] uppercase text-[#C89B5E]/70 hover:text-[#C89B5E] transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            WhatsApp Us
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  )
}
