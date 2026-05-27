'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { brands } from '@/lib/data/brands'

export function BrandPartners() {
  return (
    <section id="brands" className="bg-[#0f0f0f] py-20 md:py-28">
      <div className="max-w-[1440px] mx-auto w-full px-6 md:px-12">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <p className="overline-gold mb-5">Brands We Trust</p>
            <h2
              className="text-[36px] md:text-[48px] font-medium text-white leading-[1.05]"
              style={{ fontFamily: 'var(--font-cormorant), serif' }}
            >
              25+ Premium Brands,<br />
              Authorised Stock<span className="text-[#C89B5E]">.</span>
            </h2>
          </div>
        </div>

        {/* Brands grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mb-12">
          {brands.map((brand, i) => (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.04, duration: 0.4 }}
              className="group border border-white/[0.06] hover:border-[#C89B5E]/30 bg-[#111] hover:bg-[#0f0f0f] rounded-lg px-4 py-5 flex items-center justify-center transition-all duration-300 cursor-default"
            >
              <span className="text-[13px] font-black tracking-[0.12em] text-white/25 group-hover:text-[#C89B5E] transition-colors duration-300 uppercase">
                {brand.name}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Dealer CTA strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-6 border border-[#C89B5E]/15 bg-[#C89B5E]/[0.04] rounded-xl px-8 py-6"
        >
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#C89B5E] mb-1.5">For Brand Partners</p>
            <p className="text-white/70 text-[15px] font-medium">
              Interested in becoming our authorised dealer in J&amp;K Valley?
            </p>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <a
              href={`https://wa.me/917006252334?text=${encodeURIComponent('Hi, I am interested in a dealer partnership with MDF Enterprises in J&K.')}`}
              target="_blank"
              rel="noreferrer"
              className="btn-gold text-[11px] py-3 px-6 whitespace-nowrap"
            >
              Partner With Us <ArrowRight size={13} />
            </a>
            <Link href="/#contact" className="text-[12px] font-bold text-white/40 hover:text-white transition-colors whitespace-nowrap">
              Learn More →
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
