// src/sections/Mission.jsx
import { motion } from 'framer-motion'
import AnimatedLine from '../components/AnimatedLine'
import SectionWrapper from '../components/SectionWrapper'
import { fadeUp } from '../lib/motion'

const MISSION_ITEMS = [
  { num: '01.', title: 'Authentic Storytelling', desc: 'Creating content that feels genuine, relatable, and naturally engaging — building trust between brands and audiences through authentic visual storytelling.' },
  { num: '02.', title: 'Visual Aesthetics', desc: 'Delivering high-end, clean, and elegant visual content that aligns with modern trends while maintaining a timeless appeal for lifestyle and beauty brands.' },
  { num: '03.', title: 'Strong Brand Collaborations', desc: 'Helping brands showcase their products in a modern and impactful way through engaging reels, stories, and creative campaigns that connect with audiences organically.' },
  { num: '04.', title: 'Consistent Growth', desc: 'Continuously improving creativity, content quality, and digital presence while adapting to new trends and creating content that remains fresh, stylish, and engaging.' },
]

const MISSION_IMGS = [
  { src: '/images/myMission1.png', fromX: -30 },
  { src: '/images/myMission2.png', fromX: 30 },
  { src: '/images/myMission3.png', fromX: 30 },
  { src: '/images/myMission4.png', fromX: -30 },
]

export default function Mission() {
  return (
    <SectionWrapper id="mission">
      <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">

        {/* Left: list */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <motion.p variants={fadeUp} className="text-[10px] tracking-[0.3em] uppercase text-white/25 font-mono mb-6">
            05 — My Mission
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-5xl lg:text-7xl xl:text-8xl font-black tracking-[-0.04em] leading-[0.85] mb-6">
            My Mission
          </motion.h2>
          <AnimatedLine className="w-32 mb-14" />

          <div className="space-y-12">
            {MISSION_ITEMS.map((item, i) => (
              <motion.div key={i} variants={fadeUp} className="flex gap-8">
                <span className="text-4xl lg:text-5xl font-black tracking-[-0.04em] shrink-0 text-white/20">
                  {item.num}
                </span>
                <div className="pt-1">
                  <h4 className="font-bold text-sm uppercase tracking-widest text-white/70 mb-2">{item.title}</h4>
                  <p className="text-sm text-white/35 leading-relaxed font-light">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right: 2x2 mosaic */}
        <div className="w-full lg:w-1/2 grid grid-cols-2 grid-rows-2 gap-3 lg:gap-4 h-[70vh] lg:h-auto">
          {MISSION_IMGS.map(({ src, fromX }, i) => (
            <motion.div
              key={src}
              className="overflow-hidden"
              initial={{ opacity: 0, x: fromX }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <img
                src={src}
                alt={`Mission ${i + 1}`}
                loading="lazy"
                className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 hover:scale-[1.05] transition-all duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
              />
            </motion.div>
          ))}
        </div>

      </div>
      <div className="text-right text-[9px] font-mono text-white/15 tracking-widest mt-16">05 / 08</div>
    </SectionWrapper>
  )
}
