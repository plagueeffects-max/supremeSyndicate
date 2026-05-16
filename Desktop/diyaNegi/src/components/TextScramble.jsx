// src/components/TextScramble.jsx
import { useState, useEffect, useRef } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%'

export function useTextScramble(text, trigger, duration = 800) {
  const [output, setOutput] = useState(text)
  const frameRef = useRef(null)

  useEffect(() => {
    if (!trigger) return
    cancelAnimationFrame(frameRef.current)

    const startTime = performance.now()
    const len = text.length

    const animate = (now) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const settledCount = Math.floor(progress * len)

      const result = text
        .split('')
        .map((char, i) => {
          if (char === ' ') return ' '
          if (i < settledCount) return char
          return CHARS[Math.floor(Math.random() * CHARS.length)]
        })
        .join('')

      setOutput(result)

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate)
      } else {
        setOutput(text)
      }
    }

    frameRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameRef.current)
  }, [trigger, text, duration])

  return output
}
