import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const CogMark = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 64 64" aria-hidden="true">
    <path
      d="M28.2 4h7.6l2.2 7.1a21.4 21.4 0 0 1 5.3 2.2l6.6-3.5 5.4 5.4-3.5 6.6a21.4 21.4 0 0 1 2.2 5.3l7.1 2.2v7.6L54 39.1a21.4 21.4 0 0 1-2.2 5.3l3.5 6.6-5.4 5.4-6.6-3.5A21.4 21.4 0 0 1 38 55.1L35.8 62h-7.6L26 55.1a21.4 21.4 0 0 1-5.3-2.2l-6.6 3.5L8.7 51l3.5-6.6a21.4 21.4 0 0 1-2.2-5.3L3 36.9v-7.6l7-2.2a21.4 21.4 0 0 1 2.2-5.3l-3.5-6.6 5.4-5.4 6.6 3.5a21.4 21.4 0 0 1 5.3-2.2L28.2 4Z"
      fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinejoin="round"
    />
    <path d="M32 19a13 13 0 1 0 0 26 13 13 0 0 0 0-26Z" fill="none" stroke="currentColor" strokeWidth="3.2" />
    <path d="M32 21v22" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
  </svg>
)

const navItems = [
  { href: '#what-we-do',  label: 'How we engage' },
  { href: '#current-work', label: 'Current work' },
  { href: '#how-we-build', label: 'How we build' },
  { href: '#about',        label: 'About' },
  { href: '#contact',      label: 'Contact' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const closeMenu = () => setOpen(false)

  return (
    <motion.header
      className="site-header"
      animate={{
        boxShadow: scrolled
          ? '0 4px 24px rgba(7, 19, 33, 0.07)'
          : '0 0 0 rgba(0,0,0,0)',
      }}
      transition={{ duration: 0.3 }}
    >
      <nav className="nav-shell" aria-label="Primary">
        <motion.a
          className="brand"
          href="#top"
          aria-label="Cogn8 Systems home"
          whileHover={{ opacity: 0.85 }}
          transition={{ duration: 0.15 }}
        >
          <motion.div
            whileHover={{ rotate: 18 }}
            transition={{ type: 'spring', stiffness: 280, damping: 18 }}
          >
            <CogMark className="mark" />
          </motion.div>
          <span>Cogn8 Systems</span>
        </motion.a>

        <button
          className={`menu-toggle${open ? ' open' : ''}`}
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={open}
          aria-controls="primary-menu"
          onClick={() => setOpen(v => !v)}
        >
          <span aria-hidden="true" />
        </button>

        {/* Nav links — CSS handles desktop vs mobile visibility */}
        <div className={`nav-links${open ? ' open' : ''}`} id="primary-menu">
          {navItems.map(({ href, label }) => (
            <a key={href} href={href} onClick={closeMenu}>{label}</a>
          ))}
        </div>
      </nav>
    </motion.header>
  )
}
