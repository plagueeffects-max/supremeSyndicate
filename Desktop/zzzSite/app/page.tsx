import { Hero } from '@/components/home/Hero'
import { TrustMarquee } from '@/components/home/TrustMarquee'
import { Categories } from '@/components/home/Categories'
import { About } from '@/components/home/About'
import { WhoWeServe } from '@/components/home/WhoWeServe'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { BrandPartners } from '@/components/home/BrandPartners'
import { Process } from '@/components/home/Process'
import { Portfolio } from '@/components/home/Portfolio'
import { Testimonials } from '@/components/home/Testimonials'
import { BlogPreview } from '@/components/home/BlogPreview'
import { CtaBand } from '@/components/home/CtaBand'
import { Contact } from '@/components/home/Contact'

export default function Home() {
  return (
    <>
      <Hero />
      <TrustMarquee />
      <Categories />
      <About />
      <WhoWeServe />
      <FeaturedProducts />
      <BrandPartners />
      <Process />
      <Portfolio />
      <Testimonials />
      <BlogPreview />
      <CtaBand />
      <Contact />
    </>
  )
}
