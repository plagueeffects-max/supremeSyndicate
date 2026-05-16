import { motion } from 'framer-motion'
import { VIEWPORT } from '../lib/motion'

export default function AnimatedLine({ className = '' }) {
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={VIEWPORT}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      style={{ transformOrigin: 'left' }}
      className={`h-px bg-white/30 ${className}`}
    />
  )
}
