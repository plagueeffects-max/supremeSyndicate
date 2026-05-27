'use client'

import { motion } from 'framer-motion'
import { InfiniteMarquee } from '@/components/ui/InfiniteMarquee'
import { testimonials } from '@/lib/data/testimonials'

function TestimonialCard({ t }: { t: (typeof testimonials)[0] }) {
  return (
    <div className="flex-shrink-0 w-[340px] mx-3 bg-[#111] border border-white/[0.06] hover:border-[#C89B5E]/20 transition-colors duration-300 rounded-xl p-6">
      {/* Stars */}
      <div className="flex gap-1 mb-4" aria-label="5 stars">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg key={i} className="w-3.5 h-3.5 text-[#C89B5E]" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <blockquote className="text-white/65 text-[13px] leading-relaxed mb-5 italic">
        &ldquo;{t.quote}&rdquo;
      </blockquote>
      <div>
        <p className="text-white text-[13px] font-semibold leading-none mb-1">{t.name}</p>
        <p className="text-white/35 text-[11px]">{t.title} · {t.institution}</p>
      </div>
    </div>
  )
}

export function Testimonials() {
  const row1 = testimonials.slice(0, 3)
  const row2 = testimonials.slice(3)

  return (
    <section id="testimonials" className="bg-[#050505] py-20 md:py-28 overflow-hidden">
      <div className="max-w-[1440px] mx-auto w-full px-6 md:px-12 mb-12">
        <div className="text-center">
          <p className="overline-gold justify-center mb-5">What Our Clients Say</p>
          <h2
            className="text-[36px] md:text-[48px] font-medium text-white leading-[1.05]"
            style={{ fontFamily: 'var(--font-cormorant), serif' }}
          >
            Trusted Across J&K<br />
            And Beyond<span className="text-[#C89B5E]">.</span>
          </h2>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="space-y-4"
      >
        <InfiniteMarquee speed={35} direction="left" pauseOnHover className="py-2">
          {row1.map(t => <TestimonialCard key={t.id} t={t} />)}
        </InfiniteMarquee>
        <InfiniteMarquee speed={35} direction="right" pauseOnHover className="py-2">
          {row2.map(t => <TestimonialCard key={t.id} t={t} />)}
        </InfiniteMarquee>
      </motion.div>
    </section>
  )
}
