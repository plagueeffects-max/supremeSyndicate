// src/components/Navbar.jsx
import { motion, useScroll } from 'framer-motion'
import { useEffect, useState } from 'react'

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
        { threshold: 0.4 }
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

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 w-full z-50 bg-black/60 backdrop-blur-md border-b border-white/[0.06] overflow-hidden"
    >
      <div className="px-8 lg:px-24 xl:px-32 py-5 flex justify-between items-center">
        <span className="text-xs font-semibold tracking-[0.25em] uppercase text-white/80">
          Diya Negi
        </span>

        <div className="hidden md:flex gap-10">
          {LINKS.map(({ label, href }) => {
            const id = href.replace('#', '')
            const isActive = active === id
            return (
              <a
                key={label}
                href={href}
                className={`text-[10px] tracking-[0.2em] uppercase transition-colors duration-300 ${
                  isActive ? 'text-white' : 'text-white/30 hover:text-white/70'
                }`}
              >
                {label}
              </a>
            )
          })}
        </div>

        <div className="flex flex-col gap-[5px] w-7">
          <span className="block h-px bg-white/60 w-full" />
          <span className="block h-px bg-white/60 w-3/5" />
        </div>
      </div>

      {/* Scroll progress bar */}
      <motion.div
        className="absolute bottom-0 left-0 h-px bg-white/50 origin-left"
        style={{ scaleX: scrollYProgress, width: '100%' }}
      />
    </motion.nav>
  )
}
