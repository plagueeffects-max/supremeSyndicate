'use client'

import { useRef, ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface InfiniteMarqueeProps {
  children: ReactNode
  speed?: number          // seconds for one full pass
  direction?: 'left' | 'right'
  pauseOnHover?: boolean
  className?: string
  itemClassName?: string
}

export function InfiniteMarquee({
  children,
  speed = 30,
  direction = 'left',
  pauseOnHover = true,
  className,
  itemClassName,
}: InfiniteMarqueeProps) {
  const shouldReduce = useReducedMotion()
  const x = direction === 'left' ? [0, '-50%'] : ['-50%', 0]

  return (
    <div
      className={cn('overflow-hidden', className)}
      style={{ maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)' }}
    >
      <motion.div
        className={cn('flex w-max', itemClassName)}
        animate={shouldReduce ? {} : { x }}
        transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
        whileHover={pauseOnHover ? { animationPlayState: 'paused' } : undefined}
        style={pauseOnHover ? { willChange: 'transform' } : undefined}
      >
        {/* Duplicate children for seamless loop */}
        <div className="flex items-center">{children}</div>
        <div className="flex items-center" aria-hidden>{children}</div>
      </motion.div>
    </div>
  )
}
