// src/components/ScrollExpandMedia.jsx
// Adapted from Next.js to React/Vite — no next/image, no TypeScript
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const ScrollExpandMedia = ({
  mediaType = 'image',
  mediaSrc,
  posterSrc,
  bgImageSrc,
  title,
  date,
  scrollToExpand,
  textBlend,
  children,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showContent, setShowContent] = useState(false)
  const [mediaFullyExpanded, setMediaFullyExpanded] = useState(false)
  const [touchStartY, setTouchStartY] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setScrollProgress(0)
    setShowContent(false)
    setMediaFullyExpanded(false)
  }, [mediaType])

  useEffect(() => {
    const handleWheel = (e) => {
      if (mediaFullyExpanded && e.deltaY < 0 && window.scrollY <= 5) {
        setMediaFullyExpanded(false)
        e.preventDefault()
      } else if (!mediaFullyExpanded) {
        e.preventDefault()
        const newProgress = Math.min(Math.max(scrollProgress + e.deltaY * 0.0009, 0), 1)
        setScrollProgress(newProgress)
        if (newProgress >= 1) { setMediaFullyExpanded(true); setShowContent(true) }
        else if (newProgress < 0.75) setShowContent(false)
      }
    }

    const handleTouchStart = (e) => setTouchStartY(e.touches[0].clientY)

    const handleTouchMove = (e) => {
      if (!touchStartY) return
      const touchY = e.touches[0].clientY
      const deltaY = touchStartY - touchY
      if (mediaFullyExpanded && deltaY < -20 && window.scrollY <= 5) {
        setMediaFullyExpanded(false)
        e.preventDefault()
      } else if (!mediaFullyExpanded) {
        e.preventDefault()
        const factor = deltaY < 0 ? 0.008 : 0.005
        const newProgress = Math.min(Math.max(scrollProgress + deltaY * factor, 0), 1)
        setScrollProgress(newProgress)
        if (newProgress >= 1) { setMediaFullyExpanded(true); setShowContent(true) }
        else if (newProgress < 0.75) setShowContent(false)
        setTouchStartY(touchY)
      }
    }

    const handleTouchEnd = () => setTouchStartY(0)
    const handleScroll = () => { if (!mediaFullyExpanded) window.scrollTo(0, 0) }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('touchstart', handleTouchStart, { passive: false })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', handleTouchEnd)

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [scrollProgress, mediaFullyExpanded, touchStartY])

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const mediaWidth = 300 + scrollProgress * (isMobile ? 650 : 1250)
  const mediaHeight = 400 + scrollProgress * (isMobile ? 200 : 400)
  const textSlide = scrollProgress * (isMobile ? 180 : 150)

  const firstWord = title ? title.split(' ')[0] : ''
  const restOfTitle = title ? title.split(' ').slice(1).join(' ') : ''

  return (
    <div className="overflow-x-hidden">
      <section className="relative flex flex-col items-center justify-start min-h-[100dvh]">
        <div className="relative w-full flex flex-col items-center min-h-[100dvh]">

          {/* Fading background */}
          <motion.div
            className="absolute inset-0 z-0 h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 - scrollProgress }}
            transition={{ duration: 0.1 }}
          >
            <img
              src={bgImageSrc}
              alt=""
              aria-hidden="true"
              className="w-screen h-screen object-cover object-center"
            />
            <div className="absolute inset-0 bg-black/65" />
          </motion.div>

          <div className="mx-auto flex flex-col items-center justify-start relative z-10 w-full">
            <div className="flex flex-col items-center justify-center w-full h-[100dvh] relative">

              {/* Expanding media frame */}
              <div
                className="absolute z-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl overflow-hidden"
                style={{
                  width: `${mediaWidth}px`,
                  height: `${mediaHeight}px`,
                  maxWidth: '95vw',
                  maxHeight: '85vh',
                  boxShadow: '0 0 80px rgba(0,0,0,0.7)',
                }}
              >
                {mediaType === 'video' ? (
                  <div className="relative w-full h-full pointer-events-none">
                    <video
                      src={mediaSrc}
                      poster={posterSrc}
                      autoPlay muted loop playsInline preload="auto"
                      className="w-full h-full object-cover"
                    />
                    <motion.div
                      className="absolute inset-0 bg-black/30"
                      animate={{ opacity: 0.5 - scrollProgress * 0.3 }}
                    />
                  </div>
                ) : (
                  <div className="relative w-full h-full">
                    <img
                      src={mediaSrc}
                      alt={title || ''}
                      className="w-full h-full object-cover object-top"
                    />
                    <motion.div
                      className="absolute inset-0 bg-black/40"
                      animate={{ opacity: 0.7 - scrollProgress * 0.55 }}
                      transition={{ duration: 0.15 }}
                    />
                  </div>
                )}

                {/* Labels inside bottom of frame */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-between px-5 z-10">
                  {date && (
                    <p
                      className="text-[10px] tracking-[0.28em] uppercase text-white/60 font-mono"
                      style={{ transform: `translateX(-${textSlide * 0.3}vw)`, transition: 'transform 0s' }}
                    >
                      {date}
                    </p>
                  )}
                  {scrollToExpand && (
                    <p
                      className="text-[10px] tracking-[0.22em] uppercase text-white/35 font-mono"
                      style={{ transform: `translateX(${textSlide * 0.3}vw)`, transition: 'transform 0s' }}
                    >
                      {scrollToExpand}
                    </p>
                  )}
                </div>
              </div>

              {/* DIYA / NEGI splitting title */}
              <div
                className={`flex items-center justify-center text-center gap-2 w-full relative z-10 flex-col pointer-events-none ${
                  textBlend ? 'mix-blend-difference' : ''
                }`}
              >
                <h1
                  className="font-black leading-[0.85] tracking-[-0.05em] text-white select-none"
                  style={{
                    fontSize: 'clamp(64px, 11vw, 152px)',
                    transform: `translateX(-${textSlide}vw)`,
                    transition: 'transform 0s',
                  }}
                >
                  {firstWord}
                </h1>
                <h1
                  className="font-black leading-[0.85] tracking-[-0.05em] select-none"
                  style={{
                    fontSize: 'clamp(64px, 11vw, 152px)',
                    WebkitTextStroke: '1px rgba(255,255,255,0.5)',
                    color: 'transparent',
                    transform: `translateX(${textSlide}vw)`,
                    transition: 'transform 0s',
                  }}
                >
                  {restOfTitle}
                </h1>
              </div>

            </div>

            {/* Content revealed after full expand */}
            <motion.div
              className="w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: showContent ? 1 : 0 }}
              transition={{ duration: 0.7 }}
            >
              {children}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ScrollExpandMedia
