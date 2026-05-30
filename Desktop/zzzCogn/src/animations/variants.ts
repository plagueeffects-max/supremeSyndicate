import { Variants } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as const

/* ── Hero ─────────────────────────────────────────────────── */
export const heroZoom: Variants = {
  hidden:  { opacity: 0, scale: 1.04 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.9, ease } },
}

export const heroWord: Variants = {
  hidden:  { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.14 + 0.28, duration: 0.72, ease },
  }),
}

export const heroText: Variants = {
  hidden:  { opacity: 0, y: 16 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.6, ease },
  }),
}

export const heroAside: Variants = {
  hidden:  { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0, transition: { delay: 0.8, duration: 0.7, ease } },
}

/* ── Section reveals ──────────────────────────────────────── */
export const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
}

export const fadeIn: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
}

export const slideLeft: Variants = {
  hidden:  { opacity: 0, x: -22 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease } },
}

export const slideRight: Variants = {
  hidden:  { opacity: 0, x: 22 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease } },
}

/* ── Stagger container + child ────────────────────────────── */
export const staggerContainer: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
}

export const staggerItem: Variants = {
  hidden:  { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
}

/* ── Shared viewport config ───────────────────────────────── */
export const viewport = { once: true, margin: '-80px' } as const
