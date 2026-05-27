'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export function BlogHeader() {
  return (
    <section className="relative w-full bg-[#F7F4EF] pt-24 md:pt-32 pb-40 flex flex-col overflow-hidden">
      
      {/* Right Side: Slanted Images */}
      <div className="absolute right-0 top-0 bottom-[100px] w-full lg:w-[60%] hidden lg:block overflow-hidden z-0">
        <div className="flex w-full h-full transform -skew-x-[12deg] origin-bottom-left translate-x-[10%] bg-gray-100">
          
          <div className="flex-1 relative border-l-[6px] border-white overflow-hidden group">
            <Image 
              src="/assets/sportsGoods.png" 
              alt="Sports" 
              fill 
              className="object-cover transform skew-x-[12deg] scale-[1.35]" 
              priority 
            />
            <div className="absolute inset-0 bg-black/20" />
          </div>

          <div className="flex-1 relative border-l-[6px] border-white overflow-hidden group">
            <Image 
              src="/assets/fitnessWelness.png" 
              alt="Fitness" 
              fill 
              className="object-cover transform skew-x-[12deg] scale-[1.35]" 
              priority 
            />
            <div className="absolute inset-0 bg-black/20" />
          </div>

          <div className="flex-1 relative border-l-[6px] border-white overflow-hidden group">
            <Image 
              src="/assets/musicalInstruments.png" 
              alt="Music" 
              fill 
              className="object-cover transform skew-x-[12deg] scale-[1.35]" 
              priority 
            />
            <div className="absolute inset-0 bg-black/20" />
          </div>

          <div className="flex-1 relative border-l-[6px] border-white overflow-hidden group">
            <Image 
              src="/assets/awardsTrophies.png" 
              alt="Awards" 
              fill 
              className="object-cover transform skew-x-[12deg] scale-[1.35]" 
              priority 
            />
            <div className="absolute inset-0 bg-black/20" />
          </div>
          
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto w-full px-6 md:px-12 flex flex-col lg:flex-row items-center justify-between z-10">
        
        {/* Left Side: Content */}
        <div className="w-full lg:w-[45%] relative z-10 flex flex-col pt-12 pb-24">
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[#C89B5E] text-[11px] font-bold tracking-[0.1em] uppercase mb-6"
          >
            BLOG & INSIGHTS
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-[48px] sm:text-[56px] md:text-[60px] font-medium text-black leading-[1.1] mb-6 tracking-tight"
            style={{ fontFamily: 'var(--font-cormorant), serif' }}
          >
            Knowledge. Insights.<br />
            <span className="text-[#C89B5E]">Solutions.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-gray-600 text-[16px] leading-[1.6] max-w-[90%] font-medium"
          >
            Expert tips, guides, and insights on sports, fitness, music, awards and institutional equipment.
          </motion.p>
        </div>

      </div>

      {/* Bottom Features Bar */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-[1300px] bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] z-20 py-5 px-10 flex flex-wrap items-center justify-between gap-6 border border-gray-100">
        
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-[#F7F4EF] flex items-center justify-center text-[#C89B5E] border border-[#E8DFD2]">
             <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          </div>
          <div>
            <div className="font-bold text-black text-[16px] leading-tight">Expert Insights</div>
            <div className="text-gray-500 text-[13px] font-medium">Industry knowledge</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-[#F7F4EF] flex items-center justify-center text-[#C89B5E] border border-[#E8DFD2]">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>
          </div>
          <div>
            <div className="font-bold text-black text-[16px] leading-tight">Latest Trends</div>
            <div className="text-gray-500 text-[13px] font-medium">Stay updated</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-[#F7F4EF] flex items-center justify-center text-[#C89B5E] border border-[#E8DFD2]">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
          </div>
          <div>
            <div className="font-bold text-black text-[16px] leading-tight">Practical Guides</div>
            <div className="text-gray-500 text-[13px] font-medium">Actionable tips</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-[#F7F4EF] flex items-center justify-center text-[#C89B5E] border border-[#E8DFD2]">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"/><path d="M9 8h1"/><path d="M9 12h1"/><path d="M9 16h1"/><path d="M14 8h1"/><path d="M14 12h1"/><path d="M14 16h1"/><path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/></svg>
          </div>
          <div>
            <div className="font-bold text-black text-[16px] leading-tight">Institutional Focus</div>
            <div className="text-gray-500 text-[13px] font-medium">Solutions that matter</div>
          </div>
        </div>
        
        <div className="h-10 w-px bg-gray-200 hidden lg:block mx-4"></div>
        
        <div className="flex items-center gap-8 ml-auto">
          {/* GeM Logo Text Representation */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 relative flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm"><path d="M50 5 L90 25 L90 75 L50 95 L10 75 L10 25 Z" fill="#e53935"/><path d="M50 5 L50 95 L10 75 L10 25 Z" fill="#f44336"/><path d="M50 5 L90 25 L50 45 L10 25 Z" fill="#ffc107"/><path d="M50 95 L90 75 L50 45 L10 75 Z" fill="#4caf50"/></svg>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-[18px] text-black leading-none tracking-tight">GeM</span>
              <span className="text-[9px] text-gray-500 uppercase leading-tight font-medium mt-0.5">Government<br/>e Marketplace</span>
            </div>
          </div>

          {/* MSME Logo Text Representation */}
          <div className="flex flex-col border-l border-gray-200 pl-6 h-10 justify-center">
            <span className="font-extrabold text-[22px] text-[#00529b] leading-none tracking-tight">MSME</span>
            <span className="text-[10px] text-gray-500 tracking-[0.1em] font-semibold mt-1">REGISTERED</span>
          </div>
        </div>

      </div>
    </section>
  )
}
