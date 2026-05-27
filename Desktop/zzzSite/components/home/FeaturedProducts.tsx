'use client'

import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion'
import { EASE } from '@/lib/animation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

const products = [
  { id: 'p1', name: 'Basketball (Official Size)', category: 'Sports', image: '/assets/hero1Basketball.png', brand: 'NIVIA' },
  { id: 'p2', name: 'Adjustable Weight Bench', category: 'Fitness', image: '/assets/hero2Bench.png', brand: 'POWERMAX' },
  { id: 'p3', name: 'Acoustic Guitar', category: 'Music', image: '/assets/hero3Guitar.png', brand: 'YAMAHA' },
  { id: 'p4', name: 'Gold Trophy Set', category: 'Awards', image: '/assets/hero4Trophy.png', brand: 'ECHELON' },
  { id: 'p5', name: 'Sports Kit Bundle', category: 'Sports', image: '/assets/sportsGoods.png', brand: 'COSCO' },
  { id: 'p6', name: 'Treadmill Pro', category: 'Fitness', image: '/assets/fitnessWelness.png', brand: 'KONEX' },
]

function ProductCard({ p, index }: { p: (typeof products)[0]; index: number }) {
  const shouldReduce = useReducedMotion()
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [5, -5]), { stiffness: 300, damping: 30 })
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-5, 5]), { stiffness: 300, damping: 30 })

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (shouldReduce) return
    const r = e.currentTarget.getBoundingClientRect()
    rawX.set((e.clientX - r.left) / r.width - 0.5)
    rawY.set((e.clientY - r.top) / r.height - 0.5)
  }
  function onLeave() { rawX.set(0); rawY.set(0) }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay: index * 0.07, duration: 0.6, ease: EASE }}
      style={shouldReduce ? {} : { rotateX, rotateY, transformStyle: 'preserve-3d' }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="group"
    >
      <div className="bg-[#0f0f0f] border border-white/[0.06] group-hover:border-[#C89B5E]/25 transition-colors duration-400 rounded-xl overflow-hidden">
        <div className="relative w-full aspect-[4/3] overflow-hidden bg-[#111]">
          <Image
            src={p.image}
            alt={p.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-4 left-4">
            <span className="text-[9px] font-bold tracking-[0.15em] uppercase px-2.5 py-1 rounded bg-[#C89B5E]/15 text-[#C89B5E] border border-[#C89B5E]/20 backdrop-blur-sm">
              {p.category}
            </span>
          </div>
        </div>
        <div className="p-5">
          <p className="text-[10px] text-white/30 font-bold tracking-[0.15em] uppercase mb-1">{p.brand}</p>
          <h3 className="text-[15px] font-semibold text-white mb-4 leading-snug">{p.name}</h3>
          <a
            href={`https://wa.me/917006252334?text=Hi, I'm interested in: ${encodeURIComponent(p.name)}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.1em] uppercase text-white/40 group-hover:text-[#C89B5E] transition-colors duration-300 border border-white/[0.08] group-hover:border-[#C89B5E]/30 px-4 py-2.5 rounded"
          >
            Enquire <ArrowUpRight size={12} />
          </a>
        </div>
      </div>
    </motion.div>
  )
}

export function FeaturedProducts() {
  return (
    <section id="products" className="bg-[#050505] py-20 md:py-28">
      <div className="max-w-[1440px] mx-auto w-full px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="overline-gold mb-5">What We Stock</p>
            <h2
              className="text-[36px] md:text-[48px] font-medium text-white leading-[1.05]"
              style={{ fontFamily: 'var(--font-cormorant), serif' }}
            >
              Premium Equipment,<br />
              1000+ Products<span className="text-[#C89B5E]">.</span>
            </h2>
          </div>
          <Link href="/products" className="text-[12px] font-bold tracking-[0.12em] uppercase text-white/40 hover:text-[#C89B5E] transition-colors flex items-center gap-2 shrink-0">
            View All Products <ArrowUpRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" style={{ perspective: '1200px' }}>
          {products.map((p, i) => (
            <ProductCard key={p.id} p={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
