import { Hero } from '@/components/home/Hero'
import { Categories } from '@/components/home/Categories'
import { About } from '@/components/home/About'
import { Portfolio } from '@/components/home/Portfolio'
import { Testimonials } from '@/components/home/Testimonials'
import { CtaBand } from '@/components/home/CtaBand'
import { Contact } from '@/components/home/Contact'

export default function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <About />
      <Portfolio />
      <Testimonials />
      <CtaBand />
      <Contact />
    </>
  )
}
