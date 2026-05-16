// src/components/Navbar.jsx
import { AnimatePresence, motion, useScroll } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'

const LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Contact', href: '#contact' },
]

const SECTION_IDS = ['home', 'introduction', 'about', 'vision', 'mission', 'portfolio', 'contact', 'thankyou']

function useActiveSection() {
  const [active, setActive] = useState('home')

  useEffect(() => {
    const observers = SECTION_IDS.map((id) => {
      const el = document.getElementById(id)
      if (!el) return null
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id) },
        { threshold: 0.3 }
      )
      obs.observe(el)
      return obs
    })
    return () => observers.forEach((obs) => obs?.disconnect())
  }, [])

  return active
}

export default function Navbar() {
  const { scrollYProgress } = useScroll()
  const active = useActiveSection()
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = useCallback(() => setMenuOpen(false), [])
  const toggleMenu = useCallback(() => setMenuOpen(prev => !prev), [])

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') closeMenu() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [closeMenu])

  // Prevent body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 w-full z-50 bg-black/70 backdrop-blur-md border-b border-white/[0.08] overflow-hidden"
      >
        <div className="px-6 lg:px-24 xl:px-32 py-5 flex justify-between items-center">
          {/* Logo */}
          <a
            href="#home"
            onClick={closeMenu}
            className="text-sm font-semibold tracking-[0.3em] uppercase text-white hover:text-white/80 transition-colors duration-300"
          >
            Diya Negi
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex gap-10 items-center">
            {LINKS.map(({ label, href }) => {
              const id = href.replace('#', '')
              const isActive = active === id
              return (
                <a
                  key={label}
                  href={href}
                  className={`text-xs tracking-[0.2em] uppercase font-medium transition-colors duration-300 ${
                    isActive ? 'text-white' : 'text-white/50 hover:text-white'
                  }`}
                >
                  {label}
                </a>
              )
            })}
          </div>

          {/* Hamburger — desktop decorative lines + mobile toggle */}
          <button
            onClick={toggleMenu}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="flex flex-col gap-[5px] w-7 cursor-pointer md:cursor-default group"
          >
            <motion.span
              animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="block h-px bg-white/70 w-full origin-center"
            />
            <motion.span
              animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.2 }}
              className="block h-px bg-white/70 w-3/5"
            />
            <motion.span
              animate={menuOpen ? { rotate: -45, y: -11 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="block h-px bg-white/70 w-full origin-center hidden md:block"
            />
          </button>
        </div>

        {/* Scroll progress bar */}
        <motion.div
          className="absolute bottom-0 left-0 h-px bg-white/60 origin-left"
          style={{ scaleX: scrollYProgress, width: '100%' }}
        />
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={closeMenu}
              className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden"
            />

            {/* Drawer */}
            <motion.div
              key="drawer"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-[57px] left-0 right-0 z-40 bg-black border-b border-white/10 md:hidden"
            >
              <nav className="flex flex-col px-6 py-8 gap-1">
                {LINKS.map(({ label, href }, i) => {
                  const id = href.replace('#', '')
                  const isActive = active === id
                  return (
                    <motion.a
                      key={label}
                      href={href}
                      onClick={closeMenu}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className={`py-4 text-2xl font-black tracking-[-0.02em] border-b border-white/[0.06] transition-colors duration-200 ${
                        isActive ? 'text-white' : 'text-white/40 hover:text-white'
                      }`}
                    >
                      {label}
                    </motion.a>
                  )
                })}

                <motion.a
                  href="https://www.instagram.com/dianegi_"
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35, duration: 0.4 }}
                  className="mt-6 text-xs tracking-[0.25em] uppercase text-white/30 font-mono hover:text-white/60 transition-colors"
                >
                  @dianegi_
                </motion.a>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
