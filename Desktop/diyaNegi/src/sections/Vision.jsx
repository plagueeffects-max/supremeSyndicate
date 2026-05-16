// src/sections/Vision.jsx
import { motion } from 'framer-motion'
import AnimatedLine from '../components/AnimatedLine'
import SectionWrapper from '../components/SectionWrapper'
import { clipRevealUp, fadeUp } from '../lib/motion'

export default function Vision() {
  return (
    <SectionWrapper id="vision">
      <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">

        {/* Left: image */}
        <div className="w-full lg:w-[45%] relative h-[60vh] lg:h-[85vh]">
          {/* myVision1 as subtle background layer */}
          <img
            src="/images/myVision1.png"
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover opacity-15 blur-sm"
          />
          {/* myVision2 as main image with clip reveal */}
          <motion.div
            variants={clipRevealUp}
            className="absolute inset-0 overflow-hidden"
          >
            <img
              src="/images/myVision2.png"
              alt="My Vision"
              loading="lazy"
              className="w-full h-full object-cover hover:scale-[1.04] transition-transform duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
            />
          </motion.div>
        </div>

        {/* Right: text */}
        <div className="w-full lg:w-[55%] flex flex-col justify-center lg:pt-16">
          <motion.p variants={fadeUp} className="text-[10px] tracking-[0.3em] uppercase text-white/25 font-mono mb-6">
            04 — My Vision
          </motion.p>

          <motion.h2 variants={fadeUp} className="text-5xl lg:text-7xl xl:text-8xl font-black tracking-[-0.04em] leading-[0.85] mb-6">
            My Vision
          </motion.h2>

          <AnimatedLine className="w-32 mb-16" />

          <div className="space-y-16">
            {[
              'To become a recognized lifestyle and digital creator known for creating elegant, trend-driven, and impactful content that inspires audiences and builds meaningful brand connections through creativity and authenticity.',
              'My vision is to grow as a creative influencer and digital creator while building a strong personal brand based on authenticity, aesthetics, and innovation — delivering content that attracts audiences visually and creates genuine engagement.',
            ].map((text, i) => (
              <motion.div key={i} variants={fadeUp} className="flex gap-10">
                <span className="text-5xl lg:text-6xl font-black tracking-[-0.04em] shrink-0 text-white/20">
                  0{i + 1}.
                </span>
                <p className="text-sm lg:text-base text-white/45 leading-relaxed pt-2 font-light">
                  {text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
      <div className="text-right text-[9px] font-mono text-white/15 tracking-widest mt-16">04 / 08</div>
    </SectionWrapper>
  )
}
