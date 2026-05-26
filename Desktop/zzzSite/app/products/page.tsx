import { Suspense } from 'react'
import type { Metadata } from 'next'
import { ProductsHero } from '@/components/products/ProductsHero'
import { ProductGrid } from '@/components/products/ProductGrid'

export const metadata: Metadata = {
  title: 'Products — MDF Enterprises',
  description: 'Browse our complete range of sports equipment, fitness gear, musical instruments, and awards.',
}

export default function ProductsPage() {
  return (
    <>
      <ProductsHero />
      <Suspense fallback={null}>
        <ProductGrid />
      </Suspense>
    </>
  )
}
