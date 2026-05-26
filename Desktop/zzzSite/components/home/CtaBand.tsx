import Link from 'next/link'
import { AnimatedSection } from '@/components/ui/AnimatedSection'

export function CtaBand() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-gold-dark via-gold to-gold-dark py-20 px-6">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.06)_0%,transparent_70%)]" />
      <div className="relative mx-auto max-w-4xl text-center">
        <AnimatedSection>
          <p className="text-deep/60 text-xs tracking-[0.3em] uppercase font-semibold mb-4">
            Ready to Partner
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-deep leading-tight mb-8">
            Ready to Partner with MDF?
          </h2>
          <p className="text-deep/60 text-base mb-10 max-w-xl mx-auto">
            Whether you need equipment for a single event or an ongoing institutional partnership, we are ready.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#contact" className="btn-dark">
              Get in Touch
            </a>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 border border-deep/30 text-deep px-6 py-3 text-sm font-bold tracking-widest uppercase rounded-sm hover:border-deep/60 transition-colors duration-200"
            >
              Browse Products
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
