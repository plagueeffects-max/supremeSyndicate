'use client'

import { motion } from 'framer-motion'
import { EASE } from '@/lib/animation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { portfolioItems } from '@/lib/data/portfolio'

function PortfolioCard({ item, index }: { item: (typeof portfolioItems)[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay: index * 0.08, duration: 0.6, ease: EASE }}
      className="group relative overflow-hidden rounded-xl bg-[#0f0f0f] break-inside-avoid mb-4"
    >
      <div className="relative w-full aspect-[4/3]">
        <Image
          src={item.image}
          alt={`${item.name} — ${item.location}`}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-500" />
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] bg-gradient-to-t from-black/90 to-transparent">
        <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#C89B5E] mb-1.5">{item.year}</span>
        <p className="text-white font-semibold text-[14px] leading-snug mb-1">{item.name}</p>
        <p className="text-white/50 text-[11px]">{item.location}</p>
      </div>

      {/* Category tag */}
      <div className="absolute top-3 left-3">
        <span className="text-[8px] font-bold tracking-[0.15em] uppercase px-2 py-1 rounded bg-black/60 text-white/60 backdrop-blur-sm capitalize">
          {item.category}
        </span>
      </div>
    </motion.div>
  )
}

export function Portfolio() {
  return (
    <section id="portfolio" className="bg-[#0f0f0f] py-20 md:py-28">
      <div className="max-w-[1440px] mx-auto w-full px-6 md:px-12">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="overline-gold mb-5">Our Work</p>
            <h2
              className="text-[36px] md:text-[48px] font-medium text-white leading-[1.05]"
              style={{ fontFamily: 'var(--font-cormorant), serif' }}
            >
              Real Projects,<br />
              Real Impact<span className="text-[#C89B5E]">.</span>
            </h2>
          </div>
          <Link href="/#contact" className="text-[12px] font-bold tracking-[0.12em] uppercase text-white/40 hover:text-[#C89B5E] transition-colors flex items-center gap-2 shrink-0">
            Start Your Project <ArrowUpRight size={14} />
          </Link>
        </div>

        {/* Masonry grid via CSS columns */}
        <div
          className="gap-4"
          style={{ columns: 'var(--portfolio-cols, 3)', columnGap: '16px' }}
        >
          <style>{`
            @media (max-width: 767px) { :root { --portfolio-cols: 1; } }
            @media (min-width: 768px) and (max-width: 1023px) { :root { --portfolio-cols: 2; } }
            @media (min-width: 1024px) { :root { --portfolio-cols: 3; } }
          `}</style>
          {portfolioItems.map((item, i) => (
            <PortfolioCard key={item.id} item={item} index={i} />
          ))}
        </div>

      </div>
    </section>
  )
}
