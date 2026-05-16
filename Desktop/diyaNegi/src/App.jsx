// src/App.jsx
import CustomCursor from './components/CustomCursor'
import Navbar from './components/Navbar'
import AboutMe from './sections/AboutMe'
import Contact from './sections/Contact'
import Hero from './sections/Hero'
import Introduction from './sections/Introduction'
import Mission from './sections/Mission'
import Portfolio from './sections/Portfolio'
import ThankYou from './sections/ThankYou'
import Vision from './sections/Vision'

export default function App() {
  return (
    <div className="bg-black text-white overflow-x-hidden">
      <CustomCursor />
      <Navbar />
      <Hero />
      <Introduction />
      <AboutMe />
      <Vision />
      <Mission />
      <Portfolio />
      <Contact />
      <ThankYou />
    </div>
  )
}
