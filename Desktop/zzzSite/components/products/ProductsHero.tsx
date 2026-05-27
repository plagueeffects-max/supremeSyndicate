'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

export function ProductsHero() {
  return (
    <section className="relative w-full bg-bg-primary pt-24 md:pt-32 pb-40 flex flex-col overflow-hidden">
      
      {/* Right Side: Slanted Images */}
      <div className="absolute right-0 top-0 bottom-[100px] w-full lg:w-[60%] hidden lg:block overflow-hidden z-0">
        <div className="flex w-full h-full transform -skew-x-[12deg] origin-bottom-left translate-x-[10%] bg-gray-100">
          
          <div className="flex-1 relative border-l-[6px] border-white overflow-hidden group">
            <Image 
              src="/assets/sportsGoods.png" 
              alt="Sports" 
              fill 
              className="object-cover transform skew-x-[12deg] scale-[1.08] group-hover:scale-[1.15] transition-transform duration-700" 
              priority 
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
          </div>

          <div className="flex-1 relative border-l-[6px] border-white overflow-hidden group">
            <Image 
              src="/assets/fitnessWelness.png" 
              alt="Fitness" 
              fill 
              className="object-cover transform skew-x-[12deg] scale-[1.08] group-hover:scale-[1.15] transition-transform duration-700" 
              priority 
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
          </div>

          <div className="flex-1 relative border-l-[6px] border-white overflow-hidden group">
            <Image 
              src="/assets/musicalInstruments.png" 
              alt="Music" 
              fill 
              className="object-cover transform skew-x-[12deg] scale-[1.08] group-hover:scale-[1.15] transition-transform duration-700" 
              priority 
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
          </div>

          <div className="flex-1 relative border-l-[6px] border-white overflow-hidden group">
            <Image 
              src="/assets/awardsTrophies.png" 
              alt="Awards" 
              fill 
              className="object-cover transform skew-x-[12deg] scale-[1.08] group-hover:scale-[1.15] transition-transform duration-700" 
              priority 
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />
          </div>
          
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto w-full px-6 md:px-12 flex flex-col lg:flex-row items-center justify-between z-10">
        
        {/* Left Side: Content */}
        <div className="w-full lg:w-[45%] relative z-10 flex flex-col pt-12 pb-24">
          
          {/* Breadcrumbs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 text-[13px] font-bold mb-6"
          >
            <Link href="/" className="text-accent-primary hover:opacity-80 transition-opacity">Home</Link>
            <span className="text-gray-300">/</span>
            <span className="text-accent-primary">Products</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-[48px] sm:text-[56px] md:text-[60px] font-medium text-black leading-[1.1] mb-6 tracking-tight"
            style={{ fontFamily: 'var(--font-cormorant), serif' }}
          >
            Our Products.<br />
            Built for <span className="text-accent-primary">Performance.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-gray-600 text-[16px] leading-[1.6] max-w-[90%] font-medium"
          >
            Explore our wide range of premium sports, fitness, music, awards and institutional equipment solutions.
          </motion.p>
        </div>

      </div>

      {/* Bottom Features Bar */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-[1300px] bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] z-20 py-5 px-10 flex flex-wrap items-center justify-between gap-6 border border-gray-100">
        
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-bg-primary flex items-center justify-center text-accent-primary border border-border-soft">
             <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
          </div>
          <div>
            <div className="font-bold text-black text-[16px] leading-tight">1000+</div>
            <div className="text-gray-500 text-[13px] font-medium">Products</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-bg-primary flex items-center justify-center text-accent-primary border border-border-soft">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          </div>
          <div>
            <div className="font-bold text-black text-[16px] leading-tight">25+</div>
            <div className="text-gray-500 text-[13px] font-medium">Top Brands</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-bg-primary flex items-center justify-center text-accent-primary border border-border-soft">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>
          </div>
          <div>
            <div className="font-bold text-black text-[16px] leading-tight">Pan India</div>
            <div className="text-gray-500 text-[13px] font-medium">Delivery</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-bg-primary flex items-center justify-center text-accent-primary border border-border-soft">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
          </div>
          <div>
            <div className="font-bold text-black text-[16px] leading-tight">Installation</div>
            <div className="text-gray-500 text-[13px] font-medium">Support</div>
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
