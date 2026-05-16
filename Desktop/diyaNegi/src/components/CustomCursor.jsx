// src/components/CustomCursor.jsx
import { useEffect, useRef } from 'react'

const isTouch = typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches

export default function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    if (isTouch) return

    let ringX = window.innerWidth / 2
    let ringY = window.innerHeight / 2
    let mouseX = ringX
    let mouseY = ringY
    let animId

    const onMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouseX - 3}px, ${mouseY - 3}px)`
      }
    }

    const loop = () => {
      ringX += (mouseX - ringX) * 0.12
      ringY += (mouseY - ringY) * 0.12
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringX - 16}px, ${ringY - 16}px)`
      }
      animId = requestAnimationFrame(loop)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    animId = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(animId)
    }
  }, [])

  if (isTouch) return null

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference"
        style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff', willChange: 'transform' }}
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference"
        style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid #fff', willChange: 'transform' }}
      />
    </>
  )
}
