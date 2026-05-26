import type { Metadata } from 'next'
import { BlogHeader } from '@/components/blog/BlogHeader'
import { BlogGrid } from '@/components/blog/BlogGrid'

export const metadata: Metadata = {
  title: 'Blog — MDF Enterprises',
  description: 'Expert guides and insights on sports equipment, fitness, musical instruments, and awards.',
}

export default function BlogPage() {
  return (
    <>
      <BlogHeader />
      <BlogGrid />
    </>
  )
}
