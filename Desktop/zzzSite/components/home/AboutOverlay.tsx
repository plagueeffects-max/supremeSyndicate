'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface AboutOverlayProps {
  isOpen: boolean
  onClose: () => void
}

export function AboutOverlay({ isOpen, onClose }: AboutOverlayProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] bg-deep/98 backdrop-blur-sm overflow-y-auto"
          initial={{ opacity: 0, y: '100%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '100%' }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <button
            onClick={onClose}
            aria-label="Close"
            className="fixed top-6 right-6 z-10 w-10 h-10 flex items-center justify-center border border-gold/20 text-white/60 hover:text-gold hover:border-gold/50 transition-colors rounded-sm"
          >
            <X size={18} />
          </button>

          <div className="mx-auto max-w-3xl section-padding">
            <p className="label-gold mb-4">Our Story</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-8 leading-snug">
              Built on a Belief That<br />Excellence Has No Single Form
            </h2>
            <div className="w-10 h-px bg-gold mb-10" />

            <div className="space-y-6 text-white/65 text-base leading-relaxed">
              <p>
                MDF Enterprises was founded with a singular vision: to be the most trusted partner for organisations and individuals who demand the best across sport, wellness, music, and recognition.
              </p>
              <p>
                We started as a sports equipment supplier to local academies. Over the years, our clients began asking — can you source fitness equipment too? Musical instruments for our school? Trophies for our annual event? The answer was always yes, and a multi-domain enterprise was born.
              </p>
              <p>
                Today, we serve national sports federations, corporate campuses, international schools, commercial gym chains, and individual champions. Every category we operate in is held to the same standard: the product must perform, the service must impress, and the relationship must last.
              </p>
              <p>
                We do not believe in being the cheapest. We believe in being the right choice — the partner you call again, the name you recommend to others, the team that shows up when it counts.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-8 border-t border-gold/10 pt-10">
              {[
                { value: '10+', label: 'Years of Excellence' },
                { value: '500+', label: 'Clients Served' },
                { value: '4', label: 'Product Domains' },
              ].map(stat => (
                <div key={stat.label} className="text-center">
                  <p className="font-display text-3xl font-bold text-gold mb-2">{stat.value}</p>
                  <p className="text-white/40 text-xs tracking-wider uppercase">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
