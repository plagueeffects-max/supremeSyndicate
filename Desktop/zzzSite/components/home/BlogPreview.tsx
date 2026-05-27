'use client'

import { motion } from 'framer-motion'
import { EASE } from '@/lib/animation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

const posts = [
  {
    slug: 'how-to-equip-a-school-gymnasium',
    title: 'How to Equip a School Gymnasium on a Government Budget',
    category: 'Fitness',
    date: 'May 15, 2026',
    image: '/assets/hero2Bench.png',
    excerpt: 'A complete guide for school administrators looking to procure gymnasium equipment through GeM at the best L1 pricing.',
  },
  {
    slug: 'top-sports-brands-india-2026',
    title: 'Top Sports Equipment Brands in India for 2026',
    category: 'Sports',
    date: 'Apr 28, 2026',
    image: '/assets/sportsGoods.png',
    excerpt: 'We review the best brands across cricket, football, badminton and athletics for institutional buyers.',
  },
  {
    slug: 'setting-up-music-lab-school',
    title: 'Setting Up a Music Lab in Your School: A Step-by-Step Guide',
    category: 'Music',
    date: 'Apr 10, 2026',
    image: '/assets/hero3Guitar.png',
    excerpt: 'Everything you need to know about instruments, acoustics, and budgeting for a school music room.',
  },
]

export function BlogPreview() {
  return (
    <section id="blog" className="bg-[#0f0f0f] py-20 md:py-28">
      <div className="max-w-[1440px] mx-auto w-full px-6 md:px-12">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="overline-gold mb-5">Insights & Guides</p>
            <h2
              className="text-[36px] md:text-[48px] font-medium text-white leading-[1.05]"
              style={{ fontFamily: 'var(--font-cormorant), serif' }}
            >
              Knowledge for<br />
              Better Decisions<span className="text-[#C89B5E]">.</span>
            </h2>
          </div>
          <Link href="/blog" className="text-[12px] font-bold tracking-[0.12em] uppercase text-white/40 hover:text-[#C89B5E] transition-colors flex items-center gap-2 shrink-0">
            All Articles <ArrowUpRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: EASE }}
            >
              <Link href={`/blog/${post.slug}`} className="group block">
                <div className="bg-[#111] border border-white/[0.06] group-hover:border-[#C89B5E]/20 transition-colors duration-300 rounded-xl overflow-hidden">
                  <div className="relative w-full aspect-[16/9] overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute top-3 left-3">
                      <span className="text-[9px] font-bold tracking-[0.15em] uppercase px-2 py-1 rounded bg-[#C89B5E]/15 text-[#C89B5E] border border-[#C89B5E]/20 backdrop-blur-sm">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-white/30 text-[10px] font-medium mb-3">{post.date}</p>
                    <h3 className="text-white text-[15px] font-semibold leading-snug mb-3 group-hover:text-[#C89B5E] transition-colors duration-300">
                      {post.title}
                    </h3>
                    <p className="text-white/40 text-[12px] leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.1em] uppercase text-white/30 group-hover:text-[#C89B5E] transition-colors duration-300">
                      Read Article <ArrowUpRight size={11} />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
