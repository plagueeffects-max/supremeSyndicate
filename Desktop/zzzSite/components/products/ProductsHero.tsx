import { AnimatedSection } from '@/components/ui/AnimatedSection'

export function ProductsHero() {
  return (
    <section className="relative pt-32 pb-16 px-6 md:px-12 lg:px-24 bg-deep overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-navy/40 to-transparent pointer-events-none" />
      <div className="relative mx-auto max-w-7xl">
        <AnimatedSection>
          <p className="label-gold mb-4">Our Products</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Equipment Built for Excellence
          </h1>
          <div className="w-10 h-px bg-gold mb-5" />
          <p className="text-white/50 text-base max-w-xl">
            Browse our complete range across sports, fitness, music, and awards. Every product sourced for quality and built to perform.
          </p>
        </AnimatedSection>
      </div>
    </section>
  )
}
