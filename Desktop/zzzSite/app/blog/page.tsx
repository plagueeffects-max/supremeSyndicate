import type { Metadata } from 'next'
import { BlogHeader } from '@/components/blog/BlogHeader'
import { BlogGrid } from '@/components/blog/BlogGrid'
import { BlogFeaturesBand } from '@/components/blog/BlogFeaturesBand'

export const metadata: Metadata = {
  title: 'Blog — MDF Enterprises',
  description: 'Expert guides and insights on sports equipment, fitness, musical instruments, and awards.',
}

export default function BlogPage() {
  return (
    <div className="bg-bg-primary">
      <BlogHeader />
      <BlogGrid />
      <BlogFeaturesBand />
    </div>
  )
}
