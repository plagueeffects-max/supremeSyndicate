'use client'

import { motion } from 'framer-motion'
import { TiltCard } from '@/components/ui/TiltCard'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { portfolioItems } from '@/data/portfolio'

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } },
}

function PortfolioCard({
  item,
  className = '',
}: {
  item: (typeof portfolioItems)[0]
  className?: string
}) {
  return (
    <motion.div variants={cardVariant} className={`perspective-1000 ${className}`}>
      <TiltCard className="h-full">
        <div className="group relative h-full overflow-hidden rounded-sm border border-gold/10 bg-navy hover:border-gold/30 transition-colors duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-navy-light/60 to-deep" />
          <div className="absolute inset-0 border border-gold/0 group-hover:border-gold/20 transition-colors duration-300 rounded-sm pointer-events-none" />
          <div className="relative h-full p-8 flex flex-col justify-end min-h-[200px]">
            <span className="label-gold mb-3 block">{item.category}</span>
            <h3 className="font-display text-lg font-bold text-white mb-2 leading-snug">
              {item.title}
            </h3>
            <p className="text-gold/60 text-xs tracking-wider mb-2">{item.client}</p>
            <p className="text-white/50 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300 max-h-0 group-hover:max-h-20 overflow-hidden">
              {item.description}
            </p>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  )
}

export function Portfolio() {
  const featured = portfolioItems.find(i => i.featured)!
  const rest = portfolioItems.filter(i => !i.featured)

  return (
    <section className="section-padding bg-deep">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection className="mb-14">
          <p className="label-gold mb-4">Our Work</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
            Delivered with Precision
          </h2>
        </AnimatedSection>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
            <PortfolioCard item={featured} className="md:col-span-2 md:row-span-2" />
            {rest[0] && <PortfolioCard item={rest[0]} />}
            {rest[1] && <PortfolioCard item={rest[1]} />}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {rest.slice(2, 5).map(item => (
              <PortfolioCard key={item.id} item={item} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
