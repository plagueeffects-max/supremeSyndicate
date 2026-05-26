import Link from 'next/link'
import type { Metadata } from 'next'
import { blogPosts } from '@/data/blog'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return blogPosts.map(post => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = blogPosts.find(p => p.slug === slug)
  return {
    title: post ? `${post.title} — MDF Enterprises` : 'Post — MDF Enterprises',
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = blogPosts.find(p => p.slug === slug)

  return (
    <div className="min-h-screen bg-deep flex flex-col items-center justify-center section-padding text-center">
      <p className="label-gold mb-4">{post?.category ?? 'Blog'}</p>
      <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-6 max-w-2xl leading-snug">
        {post?.title ?? 'Coming Soon'}
      </h1>
      <div className="w-10 h-px bg-gold mb-8 mx-auto" />
      <p className="text-white/50 text-base mb-10 max-w-md">
        Full article coming soon. Check back shortly.
      </p>
      <Link href="/blog" className="btn-ghost inline-flex">
        ← Back to Blog
      </Link>
    </div>
  )
}
