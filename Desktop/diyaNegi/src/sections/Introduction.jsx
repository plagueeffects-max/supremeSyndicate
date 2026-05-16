// src/sections/Introduction.jsx
import { motion } from 'framer-motion'
import AnimatedLine from '../components/AnimatedLine'
import MarqueeTrack from '../components/MarqueeTrack'
import SectionWrapper from '../components/SectionWrapper'
import { clipRevealDown, fadeUp, VIEWPORT } from '../lib/motion'

export default function Introduction() {
  return (
    <SectionWrapper id="introduction">
      <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">

        {/* Left: text */}
        <div className="w-full lg:w-[55%] flex flex-col">
          <motion.p variants={fadeUp} className="text-[10px] tracking-[0.3em] uppercase text-white/25 font-mono mb-6">
            02 — Introduction
          </motion.p>

          <motion.h2 variants={fadeUp} className="text-5xl lg:text-7xl xl:text-8xl font-black tracking-[-0.04em] leading-[0.85] mb-8">
            Who<br />I Am
          </motion.h2>

          <AnimatedLine className="w-32 mb-10" />

          <motion.div variants={fadeUp} className="space-y-5 text-white/50 text-sm lg:text-base leading-relaxed font-light max-w-lg mb-2">
            <p>
              Hi, I&apos;m Diya Negi — a lifestyle and digital content creator passionate about creating aesthetic,
              engaging, and visually appealing content. My content focuses on beauty, fashion, skincare,
              fragrance, lifestyle, and pet-related collaborations with a clean and luxurious aesthetic.
            </p>
            <p>
              I&apos;ve collaborated with multiple beauty, fashion, fragrance, food, and lifestyle brands,
              helping them create visually strong and relatable promotional content through Instagram reels,
              stories, and creative campaigns.
            </p>
          </motion.div>

          <motion.div variants={fadeUp}>
            <MarqueeTrack />
          </motion.div>

          <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-6">
            <div>
              <h3 className="font-bold text-sm mb-3 tracking-wide uppercase text-white/70">About Me</h3>
              <p className="text-xs text-white/35 leading-relaxed font-light">
                My content mainly focuses on beauty, fashion, fragrance, lifestyle, and pet-related
                collaborations with a clean, elegant, and trendy aesthetic.
              </p>
            </div>
            <div className="md:pt-8">
              <h3 className="font-bold text-sm mb-3 tracking-wide uppercase text-white/70">About Portfolio</h3>
              <p className="text-xs text-white/35 leading-relaxed font-light">
                A blend of lifestyle, beauty, fashion, fragrance, food, and pet-related content created
                with a clean, elegant, and trend-driven aesthetic.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Right: image */}
        <motion.div
          variants={clipRevealDown}
          className="w-full lg:w-[45%] h-[70vh] lg:h-auto overflow-hidden"
        >
          <img
            src="/images/introduction1.png"
            alt="Introduction"
            loading="lazy"
            className="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
          />
        </motion.div>

      </div>

      <div className="text-right text-[9px] font-mono text-white/15 tracking-widest mt-16">02 / 08</div>
    </SectionWrapper>
  )
}
