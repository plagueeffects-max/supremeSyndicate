// src/sections/Portfolio.jsx
import { motion } from 'framer-motion'
import { useCallback, useRef, useState } from 'react'
import SectionWrapper from '../components/SectionWrapper'
import { fadeUp } from '../lib/motion'

function SpotlightContainer({ children }) {
  const divRef = useRef(null)
  const posRef = useRef({ x: 0, y: 0 })
  const [opacity, setOpacity] = useState(0)
  const gradientRef = useRef(null)

  const onMouseMove = useCallback((e) => {
    if (!divRef.current) return
    const rect = divRef.current.getBoundingClientRect()
    posRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    if (gradientRef.current) {
      gradientRef.current.style.background = `radial-gradient(500px circle at ${posRef.current.x}px ${posRef.current.y}px, rgba(255,255,255,0.05), transparent 55%)`
    }
    setOpacity(1)
  }, [])

  const onMouseLeave = useCallback(() => setOpacity(0), [])

  return (
    <div ref={divRef} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave} className="relative">
      <div
        ref={gradientRef}
        className="absolute inset-0 pointer-events-none rounded-sm transition-opacity duration-500"
        style={{ opacity }}
      />
      {children}
    </div>
  )
}

export default function Portfolio() {
  const constraintsRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [hasDragged, setHasDragged] = useState(false)

  const onDragStart = useCallback(() => { setIsDragging(true); setHasDragged(true) }, [])
  const onDragEnd = useCallback(() => setIsDragging(false), [])

  return (
    <SectionWrapper id="portfolio">
      <SpotlightContainer>
        <div className="flex justify-between items-end mb-10">
          <motion.div variants={fadeUp}>
            <p className="text-[10px] tracking-[0.3em] uppercase text-white/25 font-mono mb-4">
              06 — Favorite Portfolio
            </p>
            <h2 className="text-5xl lg:text-7xl xl:text-8xl font-black tracking-[-0.04em] leading-[0.85]">
              My Favorite<br />Portfolio
            </h2>
          </motion.div>

          <motion.span
            variants={fadeUp}
            animate={{ opacity: hasDragged ? 0 : 1 }}
            transition={{ duration: 0.5 }}
            className="text-[10px] tracking-[0.2em] uppercase text-white/25 font-mono hidden md:block pb-2"
          >
            ← Drag →
          </motion.span>
        </div>
      </SpotlightContainer>

      {/* Drag gallery */}
      <motion.div variants={fadeUp}>
        <div ref={constraintsRef} className="overflow-hidden">
          <motion.div
            drag="x"
            dragConstraints={constraintsRef}
            dragElastic={0.1}
            whileDrag={{ scale: 0.98 }}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            className="flex gap-4 lg:gap-6"
            style={{ cursor: isDragging ? 'grabbing' : 'grab', touchAction: 'pan-y' }}
          >
            <div className="relative shrink-0 w-[65%] lg:w-[55%] h-[60vh] lg:h-[75vh] overflow-hidden">
              <img
                src="/images/myFavPortfolio1.png"
                alt="Portfolio 1"
                loading="lazy"
                className="w-full h-full object-cover pointer-events-none select-none"
                draggable={false}
              />
            </div>
            <div className="relative shrink-0 w-[50%] lg:w-[42%] h-[60vh] lg:h-[75vh] overflow-hidden">
              <img
                src="/images/myFavPortfolio2.png"
                alt="Portfolio 2"
                loading="lazy"
                className="w-full h-full object-cover pointer-events-none select-none"
                draggable={false}
              />
            </div>
          </motion.div>
        </div>
      </motion.div>

      <div className="text-right text-[9px] font-mono text-white/15 tracking-widest mt-10">06 / 08</div>
    </SectionWrapper>
  )
}
