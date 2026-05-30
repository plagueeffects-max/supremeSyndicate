import { motion } from 'framer-motion'
import { fadeIn, viewport } from '../animations/variants'

export default function Footer() {
  return (
    <motion.footer
      className="site-footer"
      variants={fadeIn}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
    >
      <div className="wrap footer-inner">
        <p>&copy; {new Date().getFullYear()} Cogn8 Systems. All rights reserved.</p>
        <a href="/privacy.html">Privacy notice</a>
      </div>
    </motion.footer>
  )
}
