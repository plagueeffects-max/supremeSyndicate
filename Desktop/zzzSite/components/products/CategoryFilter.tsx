'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const PILLS = [
  { id: 'all', label: 'All' },
  { id: 'sports', label: 'Sports' },
  { id: 'fitness', label: 'Fitness' },
  { id: 'music', label: 'Music' },
  { id: 'awards', label: 'Awards' },
]

interface CategoryFilterProps {
  active: string
  onChange: (category: string) => void
}

export function CategoryFilter({ active, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {PILLS.map(pill => (
        <button
          key={pill.id}
          onClick={() => onChange(pill.id)}
          data-active={active === pill.id}
          className={cn(
            'relative px-5 py-2 text-xs tracking-widest uppercase rounded-sm transition-colors duration-200',
            active === pill.id
              ? 'text-deep font-bold'
              : 'text-white/50 border border-gold/15 hover:text-white hover:border-gold/40'
          )}
        >
          {active === pill.id && (
            <motion.div
              layoutId="active-pill"
              className="absolute inset-0 bg-gold rounded-sm"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10">{pill.label}</span>
        </button>
      ))}
    </div>
  )
}
