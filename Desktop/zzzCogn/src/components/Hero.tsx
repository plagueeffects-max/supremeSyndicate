import { motion, useScroll, useTransform } from 'framer-motion'
import { heroZoom, heroWord, heroText, heroAside } from '../animations/variants'

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

export default function Hero() {
  const { scrollY } = useScroll()
  const bgY = useTransform(scrollY, [0, 600], ['0%', '28%'])

  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      {/* Parallax background grid */}
      <motion.div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'linear-gradient(90deg, rgba(7,19,33,0.035) 1px, transparent 1px)',
          backgroundSize: '92px 92px',
          y: bgY,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Zoom-in border frame */}
      <motion.div
        className="hero-frame"
        variants={heroZoom}
        initial="hidden"
        animate="visible"
      />

      <div className="wrap hero-grid">
        <div>
          <motion.span
            className="section-kicker"
            custom={0}
            variants={heroText}
            initial="hidden"
            animate="visible"
          >
            Product studio
          </motion.span>

          <h1 id="hero-title">
            {['Cogn8', 'Systems'].map((word, i) => (
              <motion.span
                key={word}
                custom={i}
                variants={heroWord}
                initial="hidden"
                animate="visible"
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.p
            className="hero-statement"
            custom={0.55}
            variants={heroText}
            initial="hidden"
            animate="visible"
          >
            A product studio that builds platforms where identity, data, and human experience converge.
          </motion.p>

          <motion.p
            className="hero-copy"
            custom={0.7}
            variants={heroText}
            initial="hidden"
            animate="visible"
          >
            We engage with founders, operators, and companies at three levels: as architects, as co-builders, and as full build partners.
          </motion.p>

          <motion.div
            className="hero-actions"
            custom={0.85}
            variants={heroText}
            initial="hidden"
            animate="visible"
            aria-label="Hero links"
          >
            <a className="text-link" href="#current-work">See current work <span aria-hidden="true">→</span></a>
            <a className="text-link" href="#what-we-do">How we engage <span aria-hidden="true">→</span></a>
          </motion.div>
        </div>

        <motion.aside
          className="hero-aside"
          variants={heroAside}
          initial="hidden"
          animate="visible"
          aria-label="Studio positioning"
        >
          <CogMark className="large-mark" />
          <p className="aside-label">Studio surface</p>
          <p className="aside-line">Architecture, platform delivery, and durable systems work.</p>
        </motion.aside>
      </div>
    </section>
  )
}
