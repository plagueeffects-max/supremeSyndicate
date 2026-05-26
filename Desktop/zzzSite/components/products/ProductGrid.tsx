'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TiltCard } from '@/components/ui/TiltCard'
import { CategoryFilter } from './CategoryFilter'
import { filterProducts } from '@/data/products'
import { useSearchParams } from 'next/navigation'

export function ProductGrid() {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get('category') ?? 'all'
  const [active, setActive] = useState(initialCategory)
  const filtered = filterProducts(active)

  useEffect(() => {
    const cat = searchParams.get('category')
    if (cat) setActive(cat)
  }, [searchParams])

  return (
    <section className="section-padding bg-deep">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <CategoryFilter active={active} onChange={setActive} />
        </div>

        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map(product => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="perspective-1000"
              >
                <TiltCard>
                  <div className="group relative rounded-sm border border-gold/10 bg-navy/40 hover:border-gold/30 transition-colors duration-300 overflow-hidden">
                    <div className="h-52 bg-gradient-to-br from-navy-light/50 to-deep flex items-center justify-center">
                      <span className="text-4xl opacity-20">
                        {product.category === 'sports' && '🏅'}
                        {product.category === 'fitness' && '💪'}
                        {product.category === 'music' && '🎵'}
                        {product.category === 'awards' && '🏆'}
                      </span>
                    </div>
                    <div className="p-6">
                      <span className="label-gold mb-2 block">{product.category}</span>
                      <h3 className="font-display text-base font-bold text-white mb-2 leading-snug">
                        {product.name}
                      </h3>
                      <p className="text-white/50 text-sm leading-relaxed mb-5">
                        {product.description}
                      </p>
                      <a href="/#contact" className="btn-ghost text-xs py-2 px-4 inline-flex">
                        Enquire →
                      </a>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <p className="text-center text-white/40 py-20 text-sm tracking-wider">
            No products in this category yet.
          </p>
        )}
      </div>
    </section>
  )
}
