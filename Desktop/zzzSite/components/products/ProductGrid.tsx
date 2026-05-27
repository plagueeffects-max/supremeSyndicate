'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Search, MessageCircle } from 'lucide-react'
import Image from 'next/image'

// Temporary mock products array based on the screenshot
const mockProducts = [
  { id: 1, name: 'Wilson Evolution Basketball', brand: 'WILSON', image: '/assets/sportsGoods.png', placeholder: false },
  { id: 2, name: 'Fitline Multi Station Gym Machine', brand: 'FITLINE', image: '/assets/fitnessWelness.png', placeholder: false },
  { id: 3, name: 'Yamaha F310 Acoustic Guitar', brand: 'YAMAHA', image: '/assets/musicalInstruments.png', placeholder: false },
  { id: 4, name: 'Premium Gold Trophy with Wooden Base', brand: 'MDF AWARDS', image: '/assets/awardsTrophies.png', placeholder: false },
  { id: 5, name: 'Nivia Ashtang 2.0 Football', brand: 'NIVIA', image: '/assets/sportsGoods.png', placeholder: false },
  { id: 6, name: 'Yonex Astrox 99 Play Badminton Racket', brand: 'YONEX', image: '/assets/sportsGoods.png', placeholder: false },
  { id: 7, name: 'Rubber Hex Dumbbell (Pair)', brand: 'BOUNCER', image: '/assets/fitnessWelness.png', placeholder: false },
  { id: 8, name: 'Fitline Treadmill FT-300', brand: 'FITLINE', image: '/assets/fitnessWelness.png', placeholder: false },
  { id: 9, name: 'Yonex Mavis 350 Nylon Shuttlecock', brand: 'YONEX', image: '/assets/sportsGoods.png', placeholder: false },
  { id: 10, name: 'Kadence Violin KV-101', brand: 'KADENCE', image: '/assets/musicalInstruments.png', placeholder: false },
  { id: 11, name: 'Adjustable Workout Bench', brand: 'CULTSPORT', image: '/assets/fitnessWelness.png', placeholder: false },
  { id: 12, name: 'Gold Medal with Ribbon', brand: 'MDF AWARDS', image: '/assets/awardsTrophies.png', placeholder: false },
]

export function ProductGrid() {
  return (
    <section className="bg-bg-primary py-12 md:py-16">
      <div className="max-w-[1440px] mx-auto w-full px-6 md:px-12 flex flex-col lg:flex-row gap-8">
        
        {/* Left Sidebar Filters */}
        <div className="w-full lg:w-[22%] shrink-0 flex flex-col gap-8">
          
          <div className="flex items-center justify-between pb-4 border-b border-gray-200">
            <h2 className="text-[13px] font-bold text-black uppercase tracking-wider">Filters</h2>
            <button className="text-accent-primary text-[13px] font-bold hover:underline">Clear All</button>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-[12px] font-bold text-black uppercase tracking-wider mb-4 flex justify-between items-center">
              Categories <span className="text-gray-400 rotate-180">▼</span>
            </h3>
            <ul className="space-y-2">
              <li className="flex justify-between items-center bg-bg-primary text-accent-primary px-3 py-2 rounded-md font-bold text-[13px]">
                <span>All Categories</span>
                <span>850+</span>
              </li>
              <li className="flex justify-between items-center text-gray-600 hover:text-black px-3 py-2 cursor-pointer font-medium text-[13px]">
                <span>Sports Goods</span>
                <span>350+</span>
              </li>
              <li className="flex justify-between items-center text-gray-600 hover:text-black px-3 py-2 cursor-pointer font-medium text-[13px]">
                <span>Fitness & Wellness</span>
                <span>250+</span>
              </li>
              <li className="flex justify-between items-center text-gray-600 hover:text-black px-3 py-2 cursor-pointer font-medium text-[13px]">
                <span>Musical Instruments</span>
                <span>150+</span>
              </li>
              <li className="flex justify-between items-center text-gray-600 hover:text-black px-3 py-2 cursor-pointer font-medium text-[13px]">
                <span>Awards & Trophies</span>
                <span>100+</span>
              </li>
              <li className="flex justify-between items-center text-gray-600 hover:text-black px-3 py-2 cursor-pointer font-medium text-[13px]">
                <span>Institutional Equipment</span>
                <span>50+</span>
              </li>
            </ul>
          </div>

          {/* Brands */}
          <div className="pt-4 border-t border-gray-100">
            <h3 className="text-[12px] font-bold text-black uppercase tracking-wider mb-4 flex justify-between items-center">
              Brands <span className="text-gray-400 rotate-180">▼</span>
            </h3>
            <div className="relative mb-4">
              <input type="text" placeholder="Search brand..." className="w-full text-[13px] bg-bg-primary/50 border border-gray-200 rounded py-2 px-3 focus:outline-none focus:border-accent-primary" />
            </div>
            <ul className="space-y-3">
              {[
                { name: 'Yonex', count: 45 },
                { name: 'Wilson', count: 38 },
                { name: 'Cosco', count: 32 },
                { name: 'Nivia', count: 28 },
                { name: 'Adidas', count: 24 },
                { name: 'Vector X', count: 20 },
              ].map(brand => (
                <li key={brand.name} className="flex justify-between items-center text-gray-600 text-[13px]">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="accent-accent-primary w-4 h-4 rounded border-gray-300" />
                    <span>{brand.name}</span>
                  </label>
                  <span>{brand.count}</span>
                </li>
              ))}
            </ul>
            <button className="text-accent-primary text-[12px] font-bold mt-4 flex items-center hover:underline">
              View All Brands <span className="ml-1">→</span>
            </button>
          </div>

          {/* Price Range */}
          <div className="pt-4 border-t border-gray-100">
            <h3 className="text-[12px] font-bold text-black uppercase tracking-wider mb-4 flex justify-between items-center">
              Price Range <span className="text-gray-400 rotate-180">▼</span>
            </h3>
            <div className="w-full h-1 bg-gray-200 rounded relative mb-4 mt-6">
              <div className="absolute left-0 top-0 h-full w-full bg-black rounded"></div>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-black rounded-full shadow cursor-pointer"></div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-black rounded-full shadow cursor-pointer"></div>
            </div>
            <div className="flex justify-between items-center text-black font-bold text-[13px]">
              <span>₹0</span>
              <span>₹50,000+</span>
            </div>
          </div>

          {/* Availability */}
          <div className="pt-4 border-t border-gray-100">
            <h3 className="text-[12px] font-bold text-black uppercase tracking-wider mb-4 flex justify-between items-center">
              Availability <span className="text-gray-400 rotate-180">▼</span>
            </h3>
            <ul className="space-y-3">
              <li className="flex justify-between items-center text-gray-600 text-[13px]">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="accent-accent-primary w-4 h-4 rounded border-gray-300" />
                  <span>In Stock</span>
                </label>
                <span>650</span>
              </li>
              <li className="flex justify-between items-center text-gray-600 text-[13px]">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="accent-accent-primary w-4 h-4 rounded border-gray-300" />
                  <span>Out of Stock</span>
                </label>
                <span>120</span>
              </li>
            </ul>
          </div>

          {/* CTA Box */}
          <div className="mt-4 p-6 bg-bg-primary border border-border-soft rounded-xl flex flex-col items-start gap-3">
            <h4 className="text-black font-bold text-[18px] leading-tight" style={{ fontFamily: 'var(--font-cormorant), serif' }}>Can't find what you're looking for?</h4>
            <p className="text-gray-600 text-[13px] font-medium leading-relaxed">Let us help you find the perfect equipment.</p>
            <button className="mt-2 bg-white text-black font-bold border border-gray-200 shadow-sm rounded px-5 py-2.5 text-[13px] flex items-center justify-center gap-2 w-full hover:bg-gray-50 transition-colors">
              Chat on WhatsApp
              <MessageCircle size={16} className="text-accent-primary" />
            </button>
          </div>

        </div>

        {/* Right Content */}
        <div className="flex-1 flex flex-col">
          
          {/* Top Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div className="text-gray-600 font-medium text-[13px]">
              Showing 1-12 of 850+ products
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <input type="text" placeholder="Search products..." className="w-full text-[13px] bg-white border border-gray-200 rounded py-2 px-3 pl-4 pr-10 focus:outline-none focus:border-accent-primary" />
                <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-accent-primary" />
              </div>
              <div className="w-full md:w-auto">
                <select className="w-full text-[13px] bg-white border border-gray-200 rounded py-2 px-4 focus:outline-none focus:border-accent-primary appearance-none font-medium cursor-pointer">
                  <option>Sort By: Newest First</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {mockProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-xl border border-gray-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] overflow-hidden hover:shadow-lg transition-shadow group flex flex-col">
                <div className="relative w-full aspect-square bg-gray-50 flex items-center justify-center p-8">
                  <button className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors z-10">
                    <Heart size={20} />
                  </button>
                  {product.placeholder ? (
                    <div className="text-gray-300 text-sm font-bold uppercase tracking-widest">{product.brand} Mock</div>
                  ) : (
                    <Image src={product.image} alt={product.name} fill className="object-contain p-6 mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <span className="text-accent-primary text-[10px] font-bold uppercase tracking-widest mb-2">{product.brand}</span>
                  <h3 className="text-black font-bold text-[14px] leading-snug mb-5">{product.name}</h3>
                  
                  <div className="mt-auto grid grid-cols-[1fr_auto] gap-2 pt-4 border-t border-gray-100">
                    <button className="bg-white border border-gray-200 text-black text-[13px] font-bold py-2.5 rounded hover:bg-gray-50 transition-colors">
                      View Details
                    </button>
                    <button className="bg-white border border-border-soft text-accent-primary w-10 flex items-center justify-center rounded hover:bg-bg-primary transition-colors">
                      <MessageCircle size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-12 flex justify-center items-center gap-2">
            <button className="w-8 h-8 flex items-center justify-center rounded text-gray-400 hover:text-black">{'<'}</button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-bg-primary text-accent-primary font-bold border border-border-soft">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded text-gray-600 hover:bg-gray-50 font-medium">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded text-gray-600 hover:bg-gray-50 font-medium">3</button>
            <button className="w-8 h-8 flex items-center justify-center rounded text-gray-600 hover:bg-gray-50 font-medium">4</button>
            <button className="w-8 h-8 flex items-center justify-center rounded text-gray-600 hover:bg-gray-50 font-medium">5</button>
            <span className="text-gray-400 px-1">...</span>
            <button className="w-8 h-8 flex items-center justify-center rounded text-gray-600 hover:bg-gray-50 font-medium">71</button>
            <button className="w-8 h-8 flex items-center justify-center rounded text-gray-600 hover:text-black">{'>'}</button>
          </div>

        </div>
      </div>
    </section>
  )
}
