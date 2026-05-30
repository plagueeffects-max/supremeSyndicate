import { useRef } from 'react'
import { useMotionValue, useSpring, useTransform } from 'framer-motion'

export function useCardTilt(maxTilt = 6) {
  const ref = useRef<HTMLElement>(null)

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)

  const x = useSpring(rawX, { stiffness: 400, damping: 30 })
  const y = useSpring(rawY, { stiffness: 400, damping: 30 })

  const rotateX = useTransform(y, [-0.5, 0.5], [maxTilt, -maxTilt])
  const rotateY = useTransform(x, [-0.5, 0.5], [-maxTilt, maxTilt])

  function onMouseMove(e: React.MouseEvent) {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    rawX.set((e.clientX - rect.left) / rect.width - 0.5)
    rawY.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  function onMouseLeave() {
    rawX.set(0)
    rawY.set(0)
  }

  return { ref, rotateX, rotateY, onMouseMove, onMouseLeave }
}
