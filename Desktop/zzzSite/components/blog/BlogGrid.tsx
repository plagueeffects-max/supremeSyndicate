'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Search } from 'lucide-react'

// Mock Data matching screenshot
const articles = [
  {
    category: 'SPORTS',
    title: 'Best Sports Equipment For Schools And Educational Institutions',
    excerpt: 'Choosing the right sports equipment plays a vital role in student development. Explore the must-have equipment for schools and how it benefits students.',
    author: 'MDF Team',
    date: 'May 10, 2024',
    image: '/assets/sportsGoods.png',
    isPlaceholder: false,
  },
  {
    category: 'FITNESS',
    title: 'Gym Setup Guide For Institutions: A Complete Step-by-Step Approach',
    excerpt: 'Setting up a gym for your institution? Here\'s a complete guide to planning, selecting equipment, and installation for maximum results.',
    author: 'MDF Team',
    date: 'May 02, 2024',
    image: '/assets/fitnessWelness.png',
    isPlaceholder: false,
  },
  {
    category: 'MUSIC',
    title: 'Choosing Professional Musical Instruments: What You Should Know',
    excerpt: 'From sound quality to build and durability, learn how to choose the right musical instruments for institutions, academies, and performance spaces.',
    author: 'MDF Team',
    date: 'Apr 25, 2024',
    image: '/assets/musicalInstruments.png',
    isPlaceholder: false,
  },
  {
    category: 'AWARDS',
    title: 'Trophy Customization For Events: Make Every Achievement Memorable',
    excerpt: 'Custom trophies add a personal touch to every milestone. Explore customization options, materials, and design ideas for your next event.',
    author: 'MDF Team',
    date: 'Apr 18, 2024',
    image: '/assets/awardsTrophies.png',
    isPlaceholder: false,
  },
  {
    category: 'INSTITUTIONAL',
    title: 'Sports Infrastructure Essentials For Modern Institutions',
    excerpt: 'A strong sports infrastructure builds strong future. Know the key elements required to build safe, functional, and future-ready sports facilities.',
    author: 'MDF Team',
    date: 'Apr 10, 2024',
    image: '/assets/hero.png',
    isPlaceholder: false,
  }
]

const popularPosts = [
  { title: 'Best Sports Equipment For Schools And Institutions', date: 'May 10, 2024', image: '/assets/sportsGoods.png' },
  { title: 'Gym Setup Guide For Institutions', date: 'May 02, 2024', image: '/assets/fitnessWelness.png' },
  { title: 'Choosing Professional Musical Instruments', date: 'Apr 25, 2024', image: '/assets/musicalInstruments.png' },
  { title: 'Trophy Customization For Events', date: 'Apr 18, 2024', image: '/assets/awardsTrophies.png' },
  { title: 'Sports Infrastructure Essentials', date: 'Apr 10, 2024', image: '/assets/hero.png' },
]

export function BlogGrid() {
  return (
    <section className="bg-[#F7F4EF] py-12 md:py-16">
      <div className="max-w-[1440px] mx-auto w-full px-6 md:px-12 flex flex-col lg:flex-row gap-12">
        
        {/* Main Content (Articles) */}
        <div className="w-full lg:w-[68%] flex flex-col gap-8">
          
          {/* Top Filters Row */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap gap-2">
              <button className="px-5 py-2 rounded-full bg-[#C89B5E] text-white text-[12px] font-bold">All Posts</button>
              <button className="px-5 py-2 rounded-full bg-white border border-[#E8DFD2] text-gray-600 text-[12px] font-bold hover:bg-gray-50 transition-colors">Sports</button>
              <button className="px-5 py-2 rounded-full bg-white border border-[#E8DFD2] text-gray-600 text-[12px] font-bold hover:bg-gray-50 transition-colors">Fitness</button>
              <button className="px-5 py-2 rounded-full bg-white border border-[#E8DFD2] text-gray-600 text-[12px] font-bold hover:bg-gray-50 transition-colors">Music</button>
              <button className="px-5 py-2 rounded-full bg-white border border-[#E8DFD2] text-gray-600 text-[12px] font-bold hover:bg-gray-50 transition-colors">Awards</button>
              <button className="px-5 py-2 rounded-full bg-white border border-[#E8DFD2] text-gray-600 text-[12px] font-bold hover:bg-gray-50 transition-colors">Institutional</button>
              <button className="px-5 py-2 rounded-full bg-white border border-[#E8DFD2] text-gray-600 text-[12px] font-bold hover:bg-gray-50 transition-colors">Guides</button>
            </div>
            <div className="relative w-full md:w-64">
              <input type="text" placeholder="Search blog posts..." className="w-full text-[13px] bg-white border border-[#E8DFD2] rounded-full py-2.5 px-4 pr-10 focus:outline-none focus:border-[#C89B5E] text-black" />
              <Search size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#C89B5E]" />
            </div>
          </div>

          {/* Articles List */}
          <div className="flex flex-col gap-6">
            {articles.map((article, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white rounded-xl border border-[#E8DFD2] shadow-[0_2px_10px_rgb(0,0,0,0.02)] flex flex-col md:flex-row overflow-hidden hover:shadow-md transition-shadow group"
              >
                {/* Image */}
                <div className="w-full md:w-[35%] h-[220px] md:h-auto bg-gray-100 relative shrink-0">
                  {article.isPlaceholder ? (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm font-bold tracking-widest uppercase">
                      Image Mock
                    </div>
                  ) : (
                    <Image src={article.image} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  )}
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 flex flex-col flex-1">
                  <span className="bg-[#F7F4EF] text-[#C89B5E] border border-[#E8DFD2] text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded inline-block w-max mb-4">
                    {article.category}
                  </span>
                  
                  <h3 className="text-black font-bold text-[20px] md:text-[22px] leading-snug mb-3">
                    {article.title}
                  </h3>
                  
                  <p className="text-gray-600 text-[14px] leading-relaxed mb-6 font-medium">
                    {article.excerpt}
                  </p>
                  
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        <div className="w-4 h-4 bg-gray-400 rounded-full mt-2" />
                      </div>
                      <span className="text-gray-600 text-[12px] font-bold">{article.author} <span className="mx-1 text-gray-300">•</span> {article.date}</span>
                    </div>
                    <Link href={`/blog/${i}`} className="text-[#C89B5E] text-[13px] font-bold flex items-center hover:underline group-hover:translate-x-1 transition-transform">
                      Read More <ArrowRight size={14} className="ml-1" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8 flex justify-center items-center gap-2">
            <button className="w-8 h-8 flex items-center justify-center rounded text-gray-400 hover:text-black">{'<'}</button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-[#F7F4EF] text-[#C89B5E] font-bold border border-[#E8DFD2]">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded text-gray-600 hover:bg-gray-50 font-medium">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded text-gray-600 hover:bg-gray-50 font-medium">3</button>
            <button className="w-8 h-8 flex items-center justify-center rounded text-gray-600 hover:bg-gray-50 font-medium">4</button>
            <button className="w-8 h-8 flex items-center justify-center rounded text-gray-600 hover:bg-gray-50 font-medium">5</button>
            <span className="text-gray-400 px-1">...</span>
            <button className="w-8 h-8 flex items-center justify-center rounded text-gray-600 hover:bg-gray-50 font-medium">12</button>
            <button className="w-8 h-8 flex items-center justify-center rounded text-gray-600 hover:text-black">{'>'}</button>
          </div>

        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-[32%] flex flex-col gap-8 shrink-0">
          
          {/* Popular Posts */}
          <div className="bg-white rounded-xl border border-[#E8DFD2] shadow-[0_2px_10px_rgb(0,0,0,0.02)] p-6 md:p-8">
            <h3 className="text-black font-bold text-[18px] mb-6" style={{ fontFamily: 'var(--font-cormorant), serif' }}>Popular Posts</h3>
            <div className="flex flex-col gap-5">
              {popularPosts.map((post, i) => (
                <Link href={`/blog/${i}`} key={i} className="flex gap-4 group">
                  <div className="w-16 h-16 rounded bg-gray-100 shrink-0 relative overflow-hidden flex items-center justify-center">
                    <Image src={post.image} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h4 className="text-black font-bold text-[13px] leading-tight mb-2 group-hover:text-[#C89B5E] transition-colors">{post.title}</h4>
                    <span className="text-gray-400 text-[11px] font-medium">{post.date}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white rounded-xl border border-[#E8DFD2] shadow-[0_2px_10px_rgb(0,0,0,0.02)] p-6 md:p-8">
            <h3 className="text-black font-bold text-[18px] mb-6" style={{ fontFamily: 'var(--font-cormorant), serif' }}>Categories</h3>
            <ul className="flex flex-col gap-4">
              <li className="flex items-center justify-between text-[13px]">
                <div className="flex items-center gap-3">
                  <span className="text-[#C89B5E]">⚽</span>
                  <span className="text-gray-600 font-bold">Sports</span>
                </div>
                <span className="text-black font-bold">24</span>
              </li>
              <li className="flex items-center justify-between text-[13px]">
                <div className="flex items-center gap-3">
                  <span className="text-[#C89B5E]">💪</span>
                  <span className="text-gray-600 font-bold">Fitness</span>
                </div>
                <span className="text-black font-bold">18</span>
              </li>
              <li className="flex items-center justify-between text-[13px]">
                <div className="flex items-center gap-3">
                  <span className="text-[#C89B5E]">🎵</span>
                  <span className="text-gray-600 font-bold">Music</span>
                </div>
                <span className="text-black font-bold">16</span>
              </li>
              <li className="flex items-center justify-between text-[13px]">
                <div className="flex items-center gap-3">
                  <span className="text-[#C89B5E]">🏆</span>
                  <span className="text-gray-600 font-bold">Awards</span>
                </div>
                <span className="text-black font-bold">14</span>
              </li>
              <li className="flex items-center justify-between text-[13px]">
                <div className="flex items-center gap-3">
                  <span className="text-[#C89B5E]">🏛️</span>
                  <span className="text-gray-600 font-bold">Institutional</span>
                </div>
                <span className="text-black font-bold">20</span>
              </li>
              <li className="flex items-center justify-between text-[13px]">
                <div className="flex items-center gap-3">
                  <span className="text-[#C89B5E]">📖</span>
                  <span className="text-gray-600 font-bold">Guides</span>
                </div>
                <span className="text-black font-bold">12</span>
              </li>
            </ul>
            <Link href="/categories" className="text-[#C89B5E] text-[12px] font-bold mt-6 inline-flex items-center hover:underline group">
              View All Categories <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Newsletter Box */}
          <div className="bg-white rounded-xl border border-[#E8DFD2] shadow-[0_2px_10px_rgb(0,0,0,0.02)] p-6 md:p-8 flex flex-col gap-4">
            <h3 className="text-black font-medium text-[26px] leading-[1.1]" style={{ fontFamily: 'var(--font-cormorant), serif' }}>Stay Updated With Our Latest Insights</h3>
            <p className="text-gray-600 text-[13px] font-medium">Subscribe to our newsletter and never miss an update.</p>
            <form className="flex w-full mt-2" onSubmit={e => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full px-4 py-3 text-[13px] border border-gray-200 border-r-0 rounded-l focus:outline-none focus:border-[#C89B5E] text-black"
                required
              />
              <button 
                type="submit" 
                className="px-4 py-3 bg-[#C89B5E] text-white rounded-r flex items-center justify-center hover:bg-[#D7AE75] transition-colors"
              >
                <ArrowRight size={18} />
              </button>
            </form>
            <div className="text-gray-400 text-[11px] font-medium flex items-center gap-1 mt-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
              We respect your privacy.
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
