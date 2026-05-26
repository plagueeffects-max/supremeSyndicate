'use client'

import { useEffect, useRef } from 'react'
import { useInView, animate } from 'framer-motion'

interface CountUpProps {
  target: number
  suffix?: string
}

export function CountUp({ target, suffix = '' }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView || !ref.current) return
    const controls = animate(0, target, {
      duration: 2,
      ease: 'easeOut',
      onUpdate(value) {
        if (ref.current) {
          ref.current.textContent = Math.round(value) + suffix
        }
      },
    })
    return () => controls.stop()
  }, [inView, target, suffix])

  return <span ref={ref}>0{suffix}</span>
}
