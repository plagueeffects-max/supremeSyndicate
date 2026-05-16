import CustomCursor from './components/CustomCursor'
import Navbar from './components/Navbar'
import Hero from './sections/Hero'

export default function App() {
  return (
    <div className="bg-black text-white overflow-x-hidden">
      <CustomCursor />
      <Navbar />
      <Hero />
    </div>
  )
}
