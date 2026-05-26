import Link from 'next/link'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { blogPosts } from '@/data/blog'

function BlogCard({ post, delay }: { post: (typeof blogPosts)[0]; delay: number }) {
  return (
    <AnimatedSection delay={delay}>
      <Link href={`/blog/${post.slug}`} className="group block h-full">
        <div className="rounded-sm border border-gold/10 bg-navy/30 hover:border-gold/25 transition-colors duration-300 overflow-hidden h-full">
          <div className="h-48 bg-gradient-to-br from-navy-light/50 to-deep" />
          <div className="p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="label-gold">{post.category}</span>
              <span className="text-white/30 text-xs">{post.readTime}</span>
            </div>
            <h3 className="font-display text-base font-bold text-white mb-3 leading-snug group-hover:text-gold/90 transition-colors duration-200">
              {post.title}
            </h3>
            <p className="text-white/50 text-sm leading-relaxed mb-5 line-clamp-2">
              {post.excerpt}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-white/30 text-xs">{post.date}</span>
              <span className="text-gold/50 text-xs tracking-wider group-hover:text-gold transition-colors duration-200">
                Read →
              </span>
            </div>
          </div>
        </div>
      </Link>
    </AnimatedSection>
  )
}

export function BlogGrid() {
  return (
    <section className="section-padding bg-deep">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post, i) => (
            <BlogCard key={post.slug} post={post} delay={i * 0.08} />
          ))}
        </div>
      </div>
    </section>
  )
}
