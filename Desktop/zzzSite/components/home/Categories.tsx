'use client'

import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion'
import { EASE } from '@/lib/animation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

const categories = [
  {
    id: 'sports',
    label: 'Sports Goods',
    tagline: 'Equip. Perform. Excel.',
    image: '/assets/sportsGoods.png',
    href: '/products?category=sports',
  },
  {
    id: 'fitness',
    label: 'Fitness & Wellness',
    tagline: 'Stronger Every Day.',
    image: '/assets/fitnessWelness.png',
    href: '/products?category=fitness',
  },
  {
    id: 'music',
    label: 'Musical Instruments',
    tagline: 'Sound that Inspires.',
    image: '/assets/musicalInstruments.png',
    href: '/products?category=music',
  },
  {
    id: 'awards',
    label: 'Awards & Trophies',
    tagline: 'Celebrate Excellence.',
    image: '/assets/awardsTrophies.png',
    href: '/products?category=awards',
  },
]

function CategoryCard({ cat, index }: { cat: (typeof categories)[0]; index: number }) {
  const shouldReduce = useReducedMotion()
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [6, -6]), { stiffness: 300, damping: 30 })
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-6, 6]), { stiffness: 300, damping: 30 })

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (shouldReduce) return
    const r = e.currentTarget.getBoundingClientRect()
    rawX.set((e.clientX - r.left) / r.width - 0.5)
    rawY.set((e.clientY - r.top) / r.height - 0.5)
  }
  function onLeave() { rawX.set(0); rawY.set(0) }

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ delay: index * 0.1, duration: 0.7, ease: EASE }}
      style={shouldReduce ? {} : { rotateX, rotateY, transformStyle: 'preserve-3d' }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <Link href={cat.href} className="group block h-full">
        <div className="relative w-full overflow-hidden bg-[#0f0f0f] border border-white/[0.06] group-hover:border-[#C89B5E]/30 transition-colors duration-500" style={{ height: '480px' }}>
          {/* Image */}
          <Image
            src={cat.image}
            alt={cat.label}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
          {/* Gold line at top on hover */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#C89B5E] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-7">
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#C89B5E]/70 mb-2">{cat.tagline}</p>
            <h3
              className="text-[26px] font-medium text-white leading-tight mb-4"
              style={{ fontFamily: 'var(--font-cormorant), serif' }}
            >
              {cat.label}
            </h3>
            <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.12em] uppercase text-white/40 group-hover:text-[#C89B5E] transition-colors duration-300">
              Explore <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export function Categories() {
  return (
    <section id="categories" className="bg-[#050505] py-20 md:py-28">
      <div className="max-w-[1440px] mx-auto w-full px-6 md:px-12">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="overline-gold mb-5">Categories We Deal In</p>
            <h2
              className="text-[36px] md:text-[48px] font-medium text-white leading-[1.05]"
              style={{ fontFamily: 'var(--font-cormorant), serif' }}
            >
              Everything You Need,<br />
              For Every Purpose<span className="text-[#C89B5E]">.</span>
            </h2>
          </div>
          <Link
            href="/products"
            className="text-[12px] font-bold tracking-[0.12em] uppercase text-white/40 hover:text-[#C89B5E] transition-colors flex items-center gap-2 shrink-0"
          >
            View All Products <ArrowUpRight size={14} />
          </Link>
        </div>

        {/* Grid */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          style={{ perspective: '1200px' }}
        >
          {categories.map((cat, i) => (
            <CategoryCard key={cat.id} cat={cat} index={i} />
          ))}
        </div>

      </div>
    </section>
  )
}
