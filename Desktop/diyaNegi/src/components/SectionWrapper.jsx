import { motion } from 'framer-motion'
import { stagger, VIEWPORT } from '../lib/motion'

export default function SectionWrapper({ children, className = '', id }) {
  return (
    <motion.section
      id={id}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={stagger}
      className={`py-32 lg:py-48 px-8 lg:px-24 xl:px-32 border-b border-white/5 ${className}`}
    >
      {children}
    </motion.section>
  )
}
