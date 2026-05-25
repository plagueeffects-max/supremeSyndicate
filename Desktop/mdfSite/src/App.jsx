import Navbar from './components/Navbar'
import Hero from './components/Hero'
import CategoryGrid from './components/CategoryGrid'
import TrustedBy from './components/TrustedBy'
import BrandsMarquee from './components/BrandsMarquee'
import About from './components/About'
import CtaBand from './components/CtaBand'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <CategoryGrid />
        <TrustedBy />
        <BrandsMarquee />
        <About />
        <CtaBand />
      </main>
      <Footer />
    </>
  )
}
