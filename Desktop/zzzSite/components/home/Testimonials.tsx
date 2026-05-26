import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { testimonials } from '@/data/testimonials'
import { Quote } from 'lucide-react'

function TestimonialCard({ item }: { item: (typeof testimonials)[0] }) {
  return (
    <div className="flex-shrink-0 w-72 md:w-80 mx-3 p-6 rounded-sm border border-gold/10 bg-navy/40 backdrop-blur-sm">
      <Quote size={20} className="text-gold/40 mb-4" />
      <p className="text-white/70 text-sm leading-relaxed mb-5 line-clamp-4">
        &ldquo;{item.quote}&rdquo;
      </p>
      <div className="border-t border-gold/10 pt-4">
        <p className="text-white font-semibold text-sm">{item.name}</p>
        <p className="text-gold/60 text-xs tracking-wider mt-0.5">{item.role}</p>
        <p className="text-white/40 text-xs mt-0.5">{item.organisation}</p>
      </div>
    </div>
  )
}

export function Testimonials() {
  const doubled = [...testimonials, ...testimonials]

  return (
    <section className="section-padding bg-navy/20 overflow-hidden">
      <div className="mx-auto max-w-7xl mb-14">
        <AnimatedSection className="text-center">
          <p className="label-gold mb-4">Client Voices</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
            What Our Partners Say
          </h2>
        </AnimatedSection>
      </div>

      <div className="pause-on-hover space-y-4">
        <div className="relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-deep to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-deep to-transparent z-10 pointer-events-none" />
          <div className="flex animate-marquee">
            {doubled.map((t, i) => (
              <TestimonialCard key={`row1-${i}`} item={t} />
            ))}
          </div>
        </div>

        <div className="relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-deep to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-deep to-transparent z-10 pointer-events-none" />
          <div className="flex animate-marquee-reverse">
            {doubled.map((t, i) => (
              <TestimonialCard key={`row2-${i}`} item={t} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
