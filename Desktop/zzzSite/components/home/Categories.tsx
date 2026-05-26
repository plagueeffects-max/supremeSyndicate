'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { TiltCard } from '@/components/ui/TiltCard'
import { AnimatedSection } from '@/components/ui/AnimatedSection'

const categories = [
  {
    id: 'sports',
    label: 'Sports Equipment',
    icon: '🏅',
    description: 'Cricket, badminton, football, athletics — premium gear for every sport.',
    href: '/products?category=sports',
    accent: 'from-blue-900/40',
  },
  {
    id: 'fitness',
    label: 'Fitness & Wellness',
    icon: '💪',
    description: 'Commercial-grade gym equipment, barbells, cardio machines, and more.',
    href: '/products?category=fitness',
    accent: 'from-emerald-900/30',
  },
  {
    id: 'music',
    label: 'Musical Instruments',
    icon: '🎵',
    description: 'Pianos, drum kits, guitars, brass — instruments for schools and professionals.',
    href: '/products?category=music',
    accent: 'from-purple-900/30',
  },
  {
    id: 'awards',
    label: 'Awards & Trophies',
    icon: '🏆',
    description: 'Custom trophies, crystal awards, and plaques crafted for every occasion.',
    href: '/products?category=awards',
    accent: 'from-amber-900/30',
  },
]

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}

const cardVariant = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } },
}

export function Categories() {
  return (
    <section className="section-padding bg-deep">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection className="mb-14 text-center">
          <p className="label-gold mb-4">What We Offer</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
            Four Domains. One Partner.
          </h2>
        </AnimatedSection>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {categories.map(cat => (
            <motion.div key={cat.id} variants={cardVariant} className="perspective-1000">
              <TiltCard>
                <Link href={cat.href} className="group block h-full">
                  <div
                    className={`
                      relative h-full min-h-[280px] rounded-sm border border-gold/10
                      bg-gradient-to-b ${cat.accent} to-navy/60
                      p-8 flex flex-col
                      hover:border-gold/30 transition-colors duration-300
                      overflow-hidden
                    `}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-sm" />
                    <div className="relative">
                      <span className="text-4xl mb-5 block">{cat.icon}</span>
                      <div className="w-8 h-px bg-gold/40 mb-5" />
                      <h3 className="font-display text-lg font-bold text-white mb-3 leading-snug">
                        {cat.label}
                      </h3>
                      <p className="text-white/50 text-sm leading-relaxed flex-1">
                        {cat.description}
                      </p>
                      <div className="mt-6 text-gold/60 text-xs tracking-widest uppercase group-hover:text-gold transition-colors duration-200">
                        Explore →
                      </div>
                    </div>
                  </div>
                </Link>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
