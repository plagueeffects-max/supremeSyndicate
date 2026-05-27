'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { EASE } from '@/lib/animation'
import { processSteps } from '@/lib/data/process'

export function Process() {
  const shouldReduce = useReducedMotion()
  const lineRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: lineRef, offset: ['start 80%', 'end 20%'] })
  const lineWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <section id="process" className="bg-[#050505] py-20 md:py-28">
      <div className="max-w-[1440px] mx-auto w-full px-6 md:px-12">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="overline-gold justify-center mb-5">How We Work</p>
          <h2
            className="text-[36px] md:text-[48px] font-medium text-white leading-[1.05]"
            style={{ fontFamily: 'var(--font-cormorant), serif' }}
          >
            From Enquiry to Excellence<span className="text-[#C89B5E]">.</span>
          </h2>
        </div>

        {/* Steps */}
        <div ref={lineRef} className="relative">
          {/* Connecting gold line */}
          <div className="absolute top-[28px] left-[10%] right-[10%] h-[1px] bg-white/[0.06] hidden md:block" aria-hidden>
            <motion.div
              className="h-full bg-[#C89B5E]/50 origin-left"
              style={shouldReduce ? { width: '100%' } : { width: lineWidth }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
            {processSteps.map((step, i) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.15, duration: 0.6, ease: EASE }}
                className="relative flex flex-col items-start md:items-center text-left md:text-center"
              >
                {/* Step node */}
                <div className="relative z-10 flex items-center justify-center w-14 h-14 rounded-full border border-[#C89B5E]/30 bg-[#050505] mb-6">
                  <span
                    className="text-[18px] font-bold text-[#C89B5E]"
                    style={{ fontFamily: 'var(--font-cormorant), serif' }}
                  >
                    {step.number}
                  </span>
                </div>

                <h3 className="text-[20px] font-semibold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-white/45 text-[13px] leading-relaxed max-w-[220px]">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
