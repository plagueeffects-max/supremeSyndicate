// src/sections/Contact.jsx
import { motion } from 'framer-motion'
import { Mail, MapPin, Phone } from 'lucide-react'
import AnimatedLine from '../components/AnimatedLine'
import SectionWrapper from '../components/SectionWrapper'
import { clipRevealUp, fadeUp } from '../lib/motion'

const CONTACTS = [
  { icon: Phone, text: '92660 27894', href: 'tel:+919266027894' },
  { icon: Mail, text: 'Dianegi741@gmail.com', href: 'mailto:Dianegi741@gmail.com' },
  { icon: MapPin, text: 'Delhi, India', href: null },
]

export default function Contact() {
  return (
    <SectionWrapper id="contact">
      <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">

        {/* Left: info */}
        <div className="w-full lg:w-[55%] flex flex-col justify-center">
          <motion.p variants={fadeUp} className="text-[10px] tracking-[0.3em] uppercase text-white/25 font-mono mb-6">
            07 — Contact
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-5xl lg:text-7xl xl:text-8xl font-black tracking-[-0.04em] leading-[0.85] mb-6">
            Let&apos;s Work<br />Together
          </motion.h2>
          <AnimatedLine className="w-40 mb-10" />

          <motion.div variants={fadeUp} className="mb-10 space-y-1 font-mono text-xs text-white/40">
            <p>Instagram — @dianegi_</p>
            <a
              href="https://www.instagram.com/dianegi_"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/50 hover:text-white transition-colors underline underline-offset-4"
            >
              instagram.com/dianegi_
            </a>
          </motion.div>

          <div className="space-y-6">
            {CONTACTS.map(({ icon: Icon, text, href }) => {
              const inner = (
                <motion.div
                  key={text}
                  variants={fadeUp}
                  className="flex items-center gap-6 group"
                >
                  <span className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center shrink-0 group-hover:bg-white group-hover:border-white transition-all duration-500">
                    <Icon
                      size={16}
                      strokeWidth={1.5}
                      className="text-white/60 group-hover:text-black transition-colors duration-500"
                    />
                  </span>
                  <span className="font-mono text-xs text-white/50 group-hover:text-white transition-colors duration-300">
                    {text}
                  </span>
                </motion.div>
              )

              return href ? (
                <a key={text} href={href} className="block">
                  {inner}
                </a>
              ) : (
                <div key={text}>{inner}</div>
              )
            })}
          </div>
        </div>

        {/* Right: image */}
        <motion.div
          variants={clipRevealUp}
          className="w-full lg:w-[45%] h-[65vh] lg:h-auto overflow-hidden"
        >
          <img
            src="/images/myContact1.png"
            alt="Contact"
            loading="lazy"
            className="w-full h-full object-cover hover:scale-[1.04] transition-transform duration-[1500ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
          />
        </motion.div>

      </div>
      <div className="text-right text-[9px] font-mono text-white/15 tracking-widest mt-16">07 / 08</div>
    </SectionWrapper>
  )
}
