// src/components/MarqueeTrack.jsx
import { motion } from 'framer-motion'

const TAGS = ['Lifestyle', '·', 'Beauty', '·', 'Fashion', '·', 'Fragrance', '·', 'Skincare', '·', 'Pet', '·', 'Food']

export default function MarqueeTrack({ speed = 40 }) {
  // Render 4 copies so the loop is seamless at any container width
  const items = [...TAGS, ...TAGS, ...TAGS, ...TAGS]

  return (
    <div className="overflow-hidden border-t border-b border-white/[0.07] py-3 my-10">
      <motion.div
        className="flex gap-8 whitespace-nowrap w-max"
        animate={{ x: ['0%', '-25%'] }}
        transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
      >
        {items.map((tag, i) => (
          <span
            key={i}
            className="text-[10px] tracking-[0.28em] text-white/25 uppercase font-mono"
          >
            {tag}
          </span>
        ))}
      </motion.div>
    </div>
  )
}
