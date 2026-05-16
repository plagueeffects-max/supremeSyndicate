// src/sections/ThankYou.jsx
import { motion } from 'framer-motion'
import AnimatedLine from '../components/AnimatedLine'
import SectionWrapper from '../components/SectionWrapper'
import { clipRevealDown, clipRevealUp, fadeUp } from '../lib/motion'

export default function ThankYou() {
  return (
    <>
      <SectionWrapper id="thankyou">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">

          {/* Left: text */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <motion.p variants={fadeUp} className="text-[10px] tracking-[0.3em] uppercase text-white/25 font-mono mb-6">
              08 — Thank You
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-5xl lg:text-7xl xl:text-8xl font-black tracking-[-0.04em] leading-[0.85] mb-6">
              Thank<br />You
            </motion.h2>
            <AnimatedLine className="w-32 mb-10" />

            <motion.div variants={fadeUp} className="space-y-5 text-white/45 text-sm lg:text-base leading-relaxed font-light max-w-md">
              <p>
                Thank you for taking the time to view my portfolio. I truly appreciate your interest
                in my work, creativity, and content journey.
              </p>
              <p>
                I look forward to creating meaningful and aesthetically engaging collaborations that
                bring value, creativity, and authentic storytelling to your brand.
              </p>
            </motion.div>

            <motion.p
              variants={fadeUp}
              className="mt-10 text-white font-medium tracking-wide text-sm italic"
            >
              Let&apos;s create something beautiful together.<br />— Diya Negi
            </motion.p>
          </div>

          {/* Right: asymmetric grid */}
          <div className="w-full lg:w-1/2 grid grid-cols-2 gap-3 lg:gap-4 h-[70vh] lg:h-auto">
            {/* thankYou2: tall left column */}
            <motion.div
              variants={clipRevealDown}
              className="row-span-2 overflow-hidden"
            >
              <img
                src="/images/thankYou2.png"
                alt="Thank You"
                loading="lazy"
                className="w-full h-full object-cover hover:scale-[1.04] transition-transform duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
              />
            </motion.div>

            {/* thankYou1: top right */}
            <motion.div
              variants={clipRevealUp}
              className="overflow-hidden"
            >
              <img
                src="/images/thankYou1.png"
                alt="Thank You"
                loading="lazy"
                className="w-full h-full object-cover hover:scale-[1.04] transition-transform duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
              />
            </motion.div>

            {/* thankYou3: bottom right */}
            <motion.div
              variants={fadeUp}
              className="overflow-hidden"
            >
              <img
                src="/images/thankYou3.png"
                alt="Thank You"
                loading="lazy"
                className="w-full h-full object-cover hover:scale-[1.04] transition-transform duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
              />
            </motion.div>
          </div>

        </div>
        <div className="text-right text-[9px] font-mono text-white/15 tracking-widest mt-16">08 / 08</div>
      </SectionWrapper>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-8 px-8 lg:px-24 xl:px-32">
        <p className="text-center text-[9px] font-mono text-white/20 tracking-widest uppercase">
          © 2026 Diya Negi · @dianegi_
        </p>
      </footer>
    </>
  )
}
