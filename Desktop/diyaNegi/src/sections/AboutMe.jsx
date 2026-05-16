// src/sections/AboutMe.jsx
import { motion } from 'framer-motion'
import AnimatedLine from '../components/AnimatedLine'
import SectionWrapper from '../components/SectionWrapper'
import { fadeUp, VIEWPORT } from '../lib/motion'

const imgVariant = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] },
  }),
}

export default function AboutMe() {
  return (
    <SectionWrapper id="about">
      <div className="flex flex-col gap-16 lg:gap-24">

        {/* 3-image grid */}
        <div className="grid grid-cols-3 gap-3 lg:gap-5 h-[45vh] lg:h-[60vh]">
          {['/images/aboutMe1.png', '/images/aboutMe2.png', '/images/aboutMe3.png'].map((src, i) => (
            <motion.div
              key={src}
              custom={i}
              variants={imgVariant}
              className="overflow-hidden"
            >
              <img
                src={src}
                alt={`About ${i + 1}`}
                loading="lazy"
                className="w-full h-full object-cover hover:scale-[1.05] transition-transform duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
              />
            </motion.div>
          ))}
        </div>

        {/* Text block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <motion.div variants={fadeUp} className="lg:col-span-4">
            <h2 className="text-5xl lg:text-7xl font-black tracking-[-0.04em] mb-6">About Me</h2>
            <AnimatedLine className="w-24" />
          </motion.div>

          <motion.div variants={fadeUp} className="lg:col-span-4 space-y-3">
            <h3 className="font-bold text-sm uppercase tracking-widest text-white/60">My Vision</h3>
            <p className="text-sm text-white/40 leading-relaxed font-light">
              To build a creative and inspiring digital presence that connects brands and audiences
              through authentic, aesthetic, and meaningful content while growing as a versatile
              lifestyle creator.
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="lg:col-span-4 space-y-3">
            <h3 className="font-bold text-sm uppercase tracking-widest text-white/60">My Mission</h3>
            <p className="text-sm text-white/40 leading-relaxed font-light">
              To create high-quality, visually engaging, and relatable content that helps brands
              tell their story in a natural and impactful way through creativity, consistency,
              and authentic storytelling.
            </p>
          </motion.div>
        </div>

      </div>
      <div className="text-right text-[9px] font-mono text-white/15 tracking-widest mt-16">03 / 08</div>
    </SectionWrapper>
  )
}
