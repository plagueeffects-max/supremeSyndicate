import { useEffect } from 'react'
import { getSchemas } from './lib/schema'
import { track } from './lib/analytics'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Engage from './components/Engage'
import CurrentWork from './components/CurrentWork'
import HowWeBuild from './components/HowWeBuild'
import About from './components/About'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  /* Inject JSON-LD schema on mount */
  useEffect(() => {
    const schemas = getSchemas()
    const tags = schemas.map((schema, i) => {
      const el = document.createElement('script')
      el.type = 'application/ld+json'
      el.id = `schema-${i}`
      el.textContent = JSON.stringify(schema)
      document.head.appendChild(el)
      return el
    })
    return () => tags.forEach(el => el.remove())
  }, [])

  /* Section scroll tracking */
  useEffect(() => {
    const observed = new Set<string>()
    if (!('IntersectionObserver' in window)) return

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting || observed.has(entry.target.id)) return
          observed.add(entry.target.id)
          track(`scroll_section_${entry.target.id.replace(/-/g, '_')}`)
        })
      },
      { threshold: 0.45 },
    )

    document.querySelectorAll('main section[id]').forEach(s => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Nav />
      <main id="main">
        <Hero />
        <Engage />
        <CurrentWork />
        <HowWeBuild />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
