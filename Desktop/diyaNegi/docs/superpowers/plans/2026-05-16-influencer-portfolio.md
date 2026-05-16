# Influencer Portfolio Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Full redesign of Diya Negi's influencer portfolio — Pure Noir editorial aesthetic, cinematic section transitions, typographic hero with text scramble, Three.js grain canvas, drag gallery, and custom cursor.

**Architecture:** React 19 + Vite. All animation via Framer Motion. Three.js used only for the hero grain shader. 21dev Marquee and Aceternity Spotlight implemented inline (no npm). Each section is an isolated component under `src/sections/`. Shared primitives live in `src/components/`.

**Tech Stack:** React 19, Framer Motion 12, Tailwind CSS 4, Three.js, Lucide React (already installed)

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `package.json` | Modify | Add `three` dependency |
| `src/index.css` | Modify | Hide default cursor, custom scrollbar, base font |
| `src/App.jsx` | Full rewrite | Assemble all sections + CustomCursor |
| `src/components/AnimatedLine.jsx` | Create | scaleX-reveal horizontal rule |
| `src/components/SectionWrapper.jsx` | Create | Shared viewport-enter fade-up container |
| `src/components/TextScramble.jsx` | Create | Hook: scrambles a string char-by-char on trigger |
| `src/components/GrainCanvas.jsx` | Create | Three.js noise shader canvas for hero |
| `src/components/CustomCursor.jsx` | Create | CSS dot + lagging ring cursor |
| `src/components/MarqueeTrack.jsx` | Create | Infinite horizontal tag marquee |
| `src/components/Navbar.jsx` | Create | Fixed nav, scroll progress bar, active section |
| `src/sections/Hero.jsx` | Create | Typographic hero with grain + image diagonal |
| `src/sections/Introduction.jsx` | Create | Bio text + marquee + image |
| `src/sections/AboutMe.jsx` | Create | 3-image grid + about text |
| `src/sections/Vision.jsx` | Create | Numbered vision + image |
| `src/sections/Mission.jsx` | Create | 4-point mission list + 2×2 mosaic |
| `src/sections/Portfolio.jsx` | Create | Drag gallery + Aceternity spotlight |
| `src/sections/Contact.jsx` | Create | Contact info + image |
| `src/sections/ThankYou.jsx` | Create | Closing + asymmetric image grid + footer |

---

## Shared Animation Tokens

Define these once in `src/lib/motion.js` and import everywhere:

```js
export const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
}

export const clipRevealDown = {
  hidden: { clipPath: 'inset(100% 0 0 0)' },
  visible: { clipPath: 'inset(0% 0 0 0)', transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
}

export const clipRevealUp = {
  hidden: { clipPath: 'inset(0 0 100% 0)' },
  visible: { clipPath: 'inset(0 0 0% 0)', transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
}

export const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
}

export const VIEWPORT = { once: true, margin: '-80px' }
```

---

## Task 1: Install three + scaffold directories

**Files:**
- Modify: `package.json`
- Create dirs: `src/components/`, `src/sections/`, `src/lib/`

- [ ] **Step 1: Install three**

```bash
npm install three
```

Expected output: `added 1 package`

- [ ] **Step 2: Verify install**

```bash
node -e "import('three').then(m => console.log('three ok:', m.REVISION))"
```

Expected: `three ok: <revision number>`

- [ ] **Step 3: Create directories**

```bash
mkdir -p src/components src/sections src/lib
```

- [ ] **Step 4: Create motion tokens file**

Create `src/lib/motion.js`:

```js
export const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
}

export const clipRevealDown = {
  hidden: { clipPath: 'inset(100% 0 0 0)' },
  visible: { clipPath: 'inset(0% 0 0 0)', transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
}

export const clipRevealUp = {
  hidden: { clipPath: 'inset(0 0 100% 0)' },
  visible: { clipPath: 'inset(0 0 0% 0)', transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
}

export const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
}

export const VIEWPORT = { once: true, margin: '-80px' }
```

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json src/lib/motion.js
git commit -m "feat: install three, scaffold dirs, add motion tokens"
```

---

## Task 2: Global CSS

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Replace index.css content**

```css
@import "tailwindcss";

*, *::before, *::after {
  cursor: none !important;
}

html {
  scroll-behavior: smooth;
}

body {
  background: #000;
  color: #f4f4f5;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

::-webkit-scrollbar {
  width: 3px;
}

::-webkit-scrollbar-track {
  background: #000;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 2px;
}

::selection {
  background: #fff;
  color: #000;
}
```

- [ ] **Step 2: Start dev server and verify black background appears**

```bash
npm run dev
```

Open `http://localhost:5173`. Body should be black, default cursor hidden.

- [ ] **Step 3: Commit**

```bash
git add src/index.css
git commit -m "style: global CSS — black base, custom scrollbar, cursor none"
```

---

## Task 3: AnimatedLine + SectionWrapper

**Files:**
- Create: `src/components/AnimatedLine.jsx`
- Create: `src/components/SectionWrapper.jsx`

- [ ] **Step 1: Create AnimatedLine**

```jsx
// src/components/AnimatedLine.jsx
import { motion } from 'framer-motion'
import { VIEWPORT } from '../lib/motion'

export default function AnimatedLine({ className = '' }) {
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={VIEWPORT}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      style={{ transformOrigin: 'left' }}
      className={`h-px bg-white/30 ${className}`}
    />
  )
}
```

- [ ] **Step 2: Create SectionWrapper**

```jsx
// src/components/SectionWrapper.jsx
import { motion } from 'framer-motion'
import { stagger, VIEWPORT } from '../lib/motion'

export default function SectionWrapper({ children, className = '', id }) {
  return (
    <motion.section
      id={id}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={stagger}
      className={`py-32 lg:py-48 px-8 lg:px-24 xl:px-32 border-b border-white/5 ${className}`}
    >
      {children}
    </motion.section>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/AnimatedLine.jsx src/components/SectionWrapper.jsx
git commit -m "feat: AnimatedLine and SectionWrapper primitives"
```

---

## Task 4: TextScramble hook

**Files:**
- Create: `src/components/TextScramble.jsx`

- [ ] **Step 1: Create the hook**

```jsx
// src/components/TextScramble.jsx
import { useState, useEffect, useRef } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%'

export function useTextScramble(text, trigger, duration = 800) {
  const [output, setOutput] = useState(text)
  const frameRef = useRef(null)

  useEffect(() => {
    if (!trigger) return
    cancelAnimationFrame(frameRef.current)

    const startTime = performance.now()
    const len = text.length

    const animate = (now) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const settledCount = Math.floor(progress * len)

      const result = text
        .split('')
        .map((char, i) => {
          if (char === ' ') return ' '
          if (i < settledCount) return char
          return CHARS[Math.floor(Math.random() * CHARS.length)]
        })
        .join('')

      setOutput(result)

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate)
      } else {
        setOutput(text)
      }
    }

    frameRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameRef.current)
  }, [trigger, text, duration])

  return output
}
```

- [ ] **Step 2: Verify in browser (temporary test)**

Temporarily add to `src/App.jsx`:

```jsx
import { useState } from 'react'
import { useTextScramble } from './components/TextScramble'

export default function App() {
  const [go, setGo] = useState(false)
  const text = useTextScramble('DIYA NEGI', go, 1200)
  return (
    <div className="p-8 text-white text-6xl font-black">
      <button onClick={() => setGo(true)} className="text-sm mb-4 block">Trigger</button>
      {text}
    </div>
  )
}
```

Click "Trigger" — chars should scramble then settle to "DIYA NEGI".

- [ ] **Step 3: Commit**

```bash
git add src/components/TextScramble.jsx
git commit -m "feat: TextScramble hook — rAF-based char scramble animation"
```

---

## Task 5: GrainCanvas (Three.js)

**Files:**
- Create: `src/components/GrainCanvas.jsx`

- [ ] **Step 1: Create GrainCanvas**

```jsx
// src/components/GrainCanvas.jsx
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  uniform float uTime;
  varying vec2 vUv;

  float random(vec2 st) {
    return fract(sin(dot(st + uTime * 0.12, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    float noise = random(vUv * 8.0);
    gl_FragColor = vec4(vec3(noise), 0.5);
  }
`

export default function GrainCanvas() {
  const mountRef = useRef(null)

  useEffect(() => {
    const el = mountRef.current
    if (!el) return

    let renderer, animId

    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false })
      renderer.setSize(el.clientWidth, el.clientHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
      el.appendChild(renderer.domElement)

      const scene = new THREE.Scene()
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

      const geometry = new THREE.PlaneGeometry(2, 2)
      const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: { uTime: { value: 0 } },
        transparent: true,
      })

      scene.add(new THREE.Mesh(geometry, material))

      const startTime = performance.now()
      const animate = () => {
        animId = requestAnimationFrame(animate)
        material.uniforms.uTime.value = (performance.now() - startTime) / 1000
        renderer.render(scene, camera)
      }
      animate()

      const ro = new ResizeObserver(() => {
        renderer.setSize(el.clientWidth, el.clientHeight)
      })
      ro.observe(el)

      return () => {
        cancelAnimationFrame(animId)
        ro.disconnect()
        geometry.dispose()
        material.dispose()
        renderer.dispose()
        renderer.domElement.parentNode?.removeChild(renderer.domElement)
      }
    } catch {
      // WebGL unavailable — grain is cosmetic, fail silently
    }
  }, [])

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 0.35 }}
    />
  )
}
```

- [ ] **Step 2: Verify grain canvas in browser**

Temporarily update `src/App.jsx`:

```jsx
import GrainCanvas from './components/GrainCanvas'

export default function App() {
  return (
    <div className="relative w-screen h-screen bg-black">
      <GrainCanvas />
      <p className="relative z-10 text-white p-8 text-2xl">Grain test</p>
    </div>
  )
}
```

You should see animated film-grain noise layered over the black background. Text should still be readable.

- [ ] **Step 3: Commit**

```bash
git add src/components/GrainCanvas.jsx
git commit -m "feat: GrainCanvas — Three.js GLSL noise shader for hero"
```

---

## Task 6: CustomCursor

**Files:**
- Create: `src/components/CustomCursor.jsx`

- [ ] **Step 1: Create CustomCursor**

```jsx
// src/components/CustomCursor.jsx
import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    let ringX = window.innerWidth / 2
    let ringY = window.innerHeight / 2
    let mouseX = ringX
    let mouseY = ringY
    let animId

    const onMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouseX - 3}px, ${mouseY - 3}px)`
      }
    }

    const loop = () => {
      ringX += (mouseX - ringX) * 0.12
      ringY += (mouseY - ringY) * 0.12
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringX - 16}px, ${ringY - 16}px)`
      }
      animId = requestAnimationFrame(loop)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    animId = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference"
        style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff', willChange: 'transform' }}
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference"
        style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid #fff', willChange: 'transform' }}
      />
    </>
  )
}
```

- [ ] **Step 2: Verify cursor in browser**

Add `<CustomCursor />` to App.jsx temporarily. Move mouse — a small dot should follow precisely, a larger ring should lag behind. Both should invert colors where they overlap white content.

- [ ] **Step 3: Commit**

```bash
git add src/components/CustomCursor.jsx
git commit -m "feat: CustomCursor — dot + lagging ring with mix-blend-difference"
```

---

## Task 7: MarqueeTrack

**Files:**
- Create: `src/components/MarqueeTrack.jsx`

- [ ] **Step 1: Create MarqueeTrack**

```jsx
// src/components/MarqueeTrack.jsx
import { motion } from 'framer-motion'

const TAGS = ['Lifestyle', '·', 'Beauty', '·', 'Fashion', '·', 'Fragrance', '·', 'Skincare', '·', 'Pet', '·', 'Food']

export default function MarqueeTrack({ speed = 40 }) {
  // Render 4 copies so the loop is seamless at any container width
  const items = [...TAGS, ...TAGS, ...TAGS, ...TAGS]

  return (
    <div className="overflow-hidden border-t border-b border-white/[0.07] py-3 my-10">
      <motion.div
        className="flex gap-8 whitespace-nowrap w-max"
        animate={{ x: ['0%', '-25%'] }}
        transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
      >
        {items.map((tag, i) => (
          <span
            key={i}
            className="text-[10px] tracking-[0.28em] text-white/25 uppercase font-mono"
          >
            {tag}
          </span>
        ))}
      </motion.div>
    </div>
  )
}
```

- [ ] **Step 2: Verify in browser**

Temporarily render `<MarqueeTrack />` in App.jsx. Tags should scroll left infinitely without a visible jump.

- [ ] **Step 3: Commit**

```bash
git add src/components/MarqueeTrack.jsx
git commit -m "feat: MarqueeTrack — infinite linear tag marquee"
```

---

## Task 8: Navbar

**Files:**
- Create: `src/components/Navbar.jsx`

- [ ] **Step 1: Create Navbar**

```jsx
// src/components/Navbar.jsx
import { motion, useScroll } from 'framer-motion'
import { useEffect, useState } from 'react'

const LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Contact', href: '#contact' },
]

const SECTION_IDS = ['home', 'introduction', 'about', 'vision', 'mission', 'portfolio', 'contact', 'thankyou']

function useActiveSection() {
  const [active, setActive] = useState('home')

  useEffect(() => {
    const observers = SECTION_IDS.map((id) => {
      const el = document.getElementById(id)
      if (!el) return null
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id) },
        { threshold: 0.4 }
      )
      obs.observe(el)
      return obs
    })
    return () => observers.forEach((obs) => obs?.disconnect())
  }, [])

  return active
}

export default function Navbar() {
  const { scrollYProgress } = useScroll()
  const active = useActiveSection()

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 w-full z-50 bg-black/60 backdrop-blur-md border-b border-white/[0.06] overflow-hidden"
    >
      <div className="px-8 lg:px-24 xl:px-32 py-5 flex justify-between items-center">
        <span className="text-xs font-semibold tracking-[0.25em] uppercase text-white/80">
          Diya Negi
        </span>

        <div className="hidden md:flex gap-10">
          {LINKS.map(({ label, href }) => {
            const id = href.replace('#', '')
            const isActive = active === id || (id === 'home' && active === 'home')
            return (
              <a
                key={label}
                href={href}
                className={`text-[10px] tracking-[0.2em] uppercase transition-colors duration-300 ${
                  isActive ? 'text-white' : 'text-white/30 hover:text-white/70'
                }`}
              >
                {label}
              </a>
            )
          })}
        </div>

        <div className="flex flex-col gap-[5px] w-7">
          <span className="block h-px bg-white/60 w-full" />
          <span className="block h-px bg-white/60 w-3/5" />
        </div>
      </div>

      {/* Scroll progress bar */}
      <motion.div
        className="absolute bottom-0 left-0 h-px bg-white/50 origin-left"
        style={{ scaleX: scrollYProgress, width: '100%' }}
      />
    </motion.nav>
  )
}
```

- [ ] **Step 2: Verify in browser**

Add `<Navbar />` to App.jsx. Navbar should appear 1.4s after page load, slide down. Scroll progress bar should grow as you scroll.

- [ ] **Step 3: Commit**

```bash
git add src/components/Navbar.jsx
git commit -m "feat: Navbar — fixed nav with scroll progress bar and active section highlight"
```

---

## Task 9: Hero section

**Files:**
- Create: `src/sections/Hero.jsx`

- [ ] **Step 1: Create Hero**

```jsx
// src/sections/Hero.jsx
import { motion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import GrainCanvas from '../components/GrainCanvas'
import { useTextScramble } from '../components/TextScramble'

export default function Hero() {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const imageY = useTransform(scrollYProgress, [0, 1], ['0px', '-80px'])

  const [triggerDiya, setTriggerDiya] = useState(false)
  const [triggerNegi, setTriggerNegi] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setTriggerDiya(true), 400)
    const t2 = setTimeout(() => setTriggerNegi(true), 700)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  const diya = useTextScramble('DIYA', triggerDiya, 900)
  const negi = useTextScramble('NEGI', triggerNegi, 900)

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative min-h-screen bg-black overflow-hidden flex items-end"
    >
      {/* Three.js grain layer */}
      <GrainCanvas />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Portrait image — diagonal peek from right */}
      <motion.div
        initial={{ clipPath: 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)' }}
        animate={{ clipPath: 'polygon(12% 0, 100% 0, 100% 100%, 0% 100%)' }}
        transition={{ delay: 1.0, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        style={{ y: imageY }}
        className="absolute right-0 top-0 bottom-0 w-[52%]"
      >
        <img
          src="/images/myPortfolio1.png"
          alt="Diya Negi"
          className="w-full h-full object-cover object-top"
          loading="eager"
        />
        {/* Gradient to blend left edge into black */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to right, #000 0%, transparent 22%)' }}
        />
      </motion.div>

      {/* Text content — bottom-left */}
      <div className="relative z-10 px-8 lg:px-24 xl:px-32 pb-16 lg:pb-24 w-full">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-[10px] tracking-[0.3em] uppercase text-white/30 mb-3 font-mono"
        >
          Hello, I&apos;m
        </motion.p>

        <div className="overflow-hidden">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.1 }}
            className="text-[clamp(80px,12vw,160px)] font-black leading-[0.85] tracking-[-0.05em] text-white select-none"
          >
            {diya}
          </motion.h1>
        </div>

        <div className="overflow-hidden">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.1 }}
            className="text-[clamp(80px,12vw,160px)] font-black leading-[0.85] tracking-[-0.05em] select-none"
            style={{
              WebkitTextStroke: '1px rgba(255,255,255,0.35)',
              color: 'transparent',
            }}
          >
            {negi}
          </motion.h1>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-[10px] tracking-[0.22em] uppercase text-white/25 mt-6 font-mono"
        >
          Content Creator · Lifestyle · Beauty · Delhi
        </motion.p>
      </div>

      {/* Scroll indicator — right side */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.8 }}
        className="absolute right-8 lg:right-24 bottom-16 z-10 flex flex-col items-center gap-2"
      >
        <div
          className="w-px h-16"
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.3))' }}
        />
        <span
          className="text-[8px] tracking-[0.22em] text-white/20 uppercase font-mono"
          style={{ writingMode: 'vertical-rl' }}
        >
          Scroll
        </span>
      </motion.div>

      {/* Page number */}
      <div className="absolute bottom-6 left-8 lg:left-24 z-10 text-[9px] font-mono text-white/15 tracking-widest">
        01 / 08
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Wire into App.jsx and verify**

Replace `src/App.jsx` with:

```jsx
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
```

Verify:
- Black background, grain texture visible
- "DIYA" scrambles in at ~0.4s, "NEGI" at ~0.7s
- Portrait image wipes in from the right at ~1.0s with diagonal edge
- Navbar slides down at ~1.4s
- Custom cursor dot + ring visible
- Scroll progress bar grows as you scroll

- [ ] **Step 3: Commit**

```bash
git add src/sections/Hero.jsx src/App.jsx
git commit -m "feat: Hero section — scramble text, grain canvas, diagonal portrait"
```

---

## Task 10: Introduction section

**Files:**
- Create: `src/sections/Introduction.jsx`

- [ ] **Step 1: Create Introduction**

```jsx
// src/sections/Introduction.jsx
import { motion } from 'framer-motion'
import AnimatedLine from '../components/AnimatedLine'
import MarqueeTrack from '../components/MarqueeTrack'
import SectionWrapper from '../components/SectionWrapper'
import { clipRevealDown, fadeUp, VIEWPORT } from '../lib/motion'

export default function Introduction() {
  return (
    <SectionWrapper id="introduction">
      <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">

        {/* Left: text */}
        <div className="w-full lg:w-[55%] flex flex-col">
          <motion.p variants={fadeUp} className="text-[10px] tracking-[0.3em] uppercase text-white/25 font-mono mb-6">
            02 — Introduction
          </motion.p>

          <motion.h2 variants={fadeUp} className="text-5xl lg:text-7xl xl:text-8xl font-black tracking-[-0.04em] leading-[0.85] mb-8">
            Who<br />I Am
          </motion.h2>

          <AnimatedLine className="w-32 mb-10" />

          <motion.div variants={fadeUp} className="space-y-5 text-white/50 text-sm lg:text-base leading-relaxed font-light max-w-lg mb-2">
            <p>
              Hi, I&apos;m Diya Negi — a lifestyle and digital content creator passionate about creating aesthetic,
              engaging, and visually appealing content. My content focuses on beauty, fashion, skincare,
              fragrance, lifestyle, and pet-related collaborations with a clean and luxurious aesthetic.
            </p>
            <p>
              I&apos;ve collaborated with multiple beauty, fashion, fragrance, food, and lifestyle brands,
              helping them create visually strong and relatable promotional content through Instagram reels,
              stories, and creative campaigns.
            </p>
          </motion.div>

          <motion.div variants={fadeUp}>
            <MarqueeTrack />
          </motion.div>

          <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-6">
            <div>
              <h3 className="font-bold text-sm mb-3 tracking-wide uppercase text-white/70">About Me</h3>
              <p className="text-xs text-white/35 leading-relaxed font-light">
                My content mainly focuses on beauty, fashion, fragrance, lifestyle, and pet-related
                collaborations with a clean, elegant, and trendy aesthetic.
              </p>
            </div>
            <div className="md:pt-8">
              <h3 className="font-bold text-sm mb-3 tracking-wide uppercase text-white/70">About Portfolio</h3>
              <p className="text-xs text-white/35 leading-relaxed font-light">
                A blend of lifestyle, beauty, fashion, fragrance, food, and pet-related content created
                with a clean, elegant, and trend-driven aesthetic.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Right: image */}
        <motion.div
          variants={clipRevealDown}
          className="w-full lg:w-[45%] h-[70vh] lg:h-auto overflow-hidden"
        >
          <img
            src="/images/introduction1.png"
            alt="Introduction"
            loading="lazy"
            className="w-full h-full object-cover hover:scale-[1.03] transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)]"
          />
        </motion.div>

      </div>

      <div className="text-right text-[9px] font-mono text-white/15 tracking-widest mt-16">02 / 08</div>
    </SectionWrapper>
  )
}
```

- [ ] **Step 2: Add to App.jsx**

```jsx
import CustomCursor from './components/CustomCursor'
import Navbar from './components/Navbar'
import Hero from './sections/Hero'
import Introduction from './sections/Introduction'

export default function App() {
  return (
    <div className="bg-black text-white overflow-x-hidden">
      <CustomCursor />
      <Navbar />
      <Hero />
      <Introduction />
    </div>
  )
}
```

Verify: scroll past hero — Introduction fades up. Marquee scrolls. Image wipes down from top. Two-column sub-text appears.

- [ ] **Step 3: Commit**

```bash
git add src/sections/Introduction.jsx src/App.jsx
git commit -m "feat: Introduction section — marquee, clip reveal image, stagger text"
```

---

## Task 11: AboutMe section

**Files:**
- Create: `src/sections/AboutMe.jsx`

- [ ] **Step 1: Create AboutMe**

```jsx
// src/sections/AboutMe.jsx
import { motion } from 'framer-motion'
import AnimatedLine from '../components/AnimatedLine'
import SectionWrapper from '../components/SectionWrapper'
import { fadeUp, VIEWPORT } from '../lib/motion'

const imgVariant = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] },
  }),
}

export default function AboutMe() {
  return (
    <SectionWrapper id="about">
      <div className="flex flex-col gap-16 lg:gap-24">

        {/* 3-image grid */}
        <div className="grid grid-cols-3 gap-3 lg:gap-5 h-[45vh] lg:h-[60vh]">
          {['/images/aboutMe1.png', '/images/aboutMe2.png', '/images/aboutMe3.png'].map((src, i) => (
            <motion.div
              key={src}
              custom={i}
              variants={imgVariant}
              className="overflow-hidden"
            >
              <img
                src={src}
                alt={`About ${i + 1}`}
                loading="lazy"
                className="w-full h-full object-cover hover:scale-[1.05] transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)]"
              />
            </motion.div>
          ))}
        </div>

        {/* Text block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <motion.div variants={fadeUp} className="lg:col-span-4">
            <h2 className="text-5xl lg:text-7xl font-black tracking-[-0.04em] mb-6">About Me</h2>
            <AnimatedLine className="w-24" />
          </motion.div>

          <motion.div variants={fadeUp} className="lg:col-span-4 space-y-3">
            <h3 className="font-bold text-sm uppercase tracking-widest text-white/60">My Vision</h3>
            <p className="text-sm text-white/40 leading-relaxed font-light">
              To build a creative and inspiring digital presence that connects brands and audiences
              through authentic, aesthetic, and meaningful content while growing as a versatile
              lifestyle creator.
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="lg:col-span-4 space-y-3">
            <h3 className="font-bold text-sm uppercase tracking-widest text-white/60">My Mission</h3>
            <p className="text-sm text-white/40 leading-relaxed font-light">
              To create high-quality, visually engaging, and relatable content that helps brands
              tell their story in a natural and impactful way through creativity, consistency,
              and authentic storytelling.
            </p>
          </motion.div>
        </div>

      </div>
      <div className="text-right text-[9px] font-mono text-white/15 tracking-widest mt-16">03 / 08</div>
    </SectionWrapper>
  )
}
```

- [ ] **Step 2: Add to App.jsx and verify**

Add `<AboutMe />` after `<Introduction />`. Verify the 3-image grid staggers in, images scale up on hover, text block below reveals.

- [ ] **Step 3: Commit**

```bash
git add src/sections/AboutMe.jsx src/App.jsx
git commit -m "feat: AboutMe section — stagger image grid, about text columns"
```

---

## Task 12: Vision section

**Files:**
- Create: `src/sections/Vision.jsx`

- [ ] **Step 1: Create Vision**

```jsx
// src/sections/Vision.jsx
import { motion } from 'framer-motion'
import AnimatedLine from '../components/AnimatedLine'
import SectionWrapper from '../components/SectionWrapper'
import { clipRevealUp, fadeUp } from '../lib/motion'

export default function Vision() {
  return (
    <SectionWrapper id="vision">
      <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">

        {/* Left: image */}
        <div className="w-full lg:w-[45%] relative h-[60vh] lg:h-[85vh]">
          {/* myVision1 as subtle background layer */}
          <img
            src="/images/myVision1.png"
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover opacity-15 blur-sm"
          />
          {/* myVision2 as main image with clip reveal */}
          <motion.div
            variants={clipRevealUp}
            className="absolute inset-0 overflow-hidden"
          >
            <img
              src="/images/myVision2.png"
              alt="My Vision"
              loading="lazy"
              className="w-full h-full object-cover hover:scale-[1.04] transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)]"
            />
          </motion.div>
        </div>

        {/* Right: text */}
        <div className="w-full lg:w-[55%] flex flex-col justify-center lg:pt-16">
          <motion.p variants={fadeUp} className="text-[10px] tracking-[0.3em] uppercase text-white/25 font-mono mb-6">
            04 — My Vision
          </motion.p>

          <motion.h2 variants={fadeUp} className="text-5xl lg:text-7xl xl:text-8xl font-black tracking-[-0.04em] leading-[0.85] mb-6">
            My Vision
          </motion.h2>

          <AnimatedLine className="w-32 mb-16" />

          <div className="space-y-16">
            {[
              'To become a recognized lifestyle and digital creator known for creating elegant, trend-driven, and impactful content that inspires audiences and builds meaningful brand connections through creativity and authenticity.',
              'My vision is to grow as a creative influencer and digital creator while building a strong personal brand based on authenticity, aesthetics, and innovation — delivering content that attracts audiences visually and creates genuine engagement.',
            ].map((text, i) => (
              <motion.div key={i} variants={fadeUp} className="flex gap-10">
                <span className="text-5xl lg:text-6xl font-black tracking-[-0.04em] shrink-0 text-white/20">
                  0{i + 1}.
                </span>
                <p className="text-sm lg:text-base text-white/45 leading-relaxed pt-2 font-light">
                  {text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
      <div className="text-right text-[9px] font-mono text-white/15 tracking-widest mt-16">04 / 08</div>
    </SectionWrapper>
  )
}
```

- [ ] **Step 2: Add to App.jsx and verify**

Add `<Vision />` after `<AboutMe />`. Verify: myVision1 is blurred and dim behind myVision2. myVision2 wipes up from bottom. Numbers and text stagger in.

- [ ] **Step 3: Commit**

```bash
git add src/sections/Vision.jsx src/App.jsx
git commit -m "feat: Vision section — dual image depth, numbered stagger"
```

---

## Task 13: Mission section

**Files:**
- Create: `src/sections/Mission.jsx`

- [ ] **Step 1: Create Mission**

```jsx
// src/sections/Mission.jsx
import { motion } from 'framer-motion'
import AnimatedLine from '../components/AnimatedLine'
import SectionWrapper from '../components/SectionWrapper'
import { fadeUp } from '../lib/motion'

const MISSION_ITEMS = [
  { num: '01.', title: 'Authentic Storytelling', desc: 'Creating content that feels genuine, relatable, and naturally engaging — building trust between brands and audiences through authentic visual storytelling.' },
  { num: '02.', title: 'Visual Aesthetics', desc: 'Delivering high-end, clean, and elegant visual content that aligns with modern trends while maintaining a timeless appeal for lifestyle and beauty brands.' },
  { num: '03.', title: 'Strong Brand Collaborations', desc: 'Helping brands showcase their products in a modern and impactful way through engaging reels, stories, and creative campaigns that connect with audiences organically.' },
  { num: '04.', title: 'Consistent Growth', desc: 'Continuously improving creativity, content quality, and digital presence while adapting to new trends and creating content that remains fresh, stylish, and engaging.' },
]

const MISSION_IMGS = [
  { src: '/images/myMission1.png', from: 'left' },
  { src: '/images/myMission2.png', from: 'right' },
  { src: '/images/myMission3.png', from: 'right' },
  { src: '/images/myMission4.png', from: 'left' },
]

export default function Mission() {
  return (
    <SectionWrapper id="mission">
      <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">

        {/* Left: list */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <motion.p variants={fadeUp} className="text-[10px] tracking-[0.3em] uppercase text-white/25 font-mono mb-6">
            05 — My Mission
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-5xl lg:text-7xl xl:text-8xl font-black tracking-[-0.04em] leading-[0.85] mb-6">
            My Mission
          </motion.h2>
          <AnimatedLine className="w-32 mb-14" />

          <div className="space-y-12">
            {MISSION_ITEMS.map((item, i) => (
              <motion.div key={i} variants={fadeUp} className="flex gap-8">
                <span className="text-4xl lg:text-5xl font-black tracking-[-0.04em] shrink-0 text-white/20">
                  {item.num}
                </span>
                <div className="pt-1">
                  <h4 className="font-bold text-sm uppercase tracking-widest text-white/70 mb-2">{item.title}</h4>
                  <p className="text-sm text-white/35 leading-relaxed font-light">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right: 2x2 mosaic */}
        <div className="w-full lg:w-1/2 grid grid-cols-2 grid-rows-2 gap-3 lg:gap-4 h-[70vh] lg:h-auto">
          {MISSION_IMGS.map(({ src, from }, i) => (
            <motion.div
              key={src}
              variants={fadeUp}
              custom={i}
              className="overflow-hidden"
              initial={{ opacity: 0, x: from === 'left' ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <img
                src={src}
                alt={`Mission ${i + 1}`}
                loading="lazy"
                className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 hover:scale-[1.05] transition-all duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)]"
              />
            </motion.div>
          ))}
        </div>

      </div>
      <div className="text-right text-[9px] font-mono text-white/15 tracking-widest mt-16">05 / 08</div>
    </SectionWrapper>
  )
}
```

- [ ] **Step 2: Add to App.jsx and verify**

Add `<Mission />` after `<Vision />`. Verify: 4 mission items stagger in, 2×2 grid images alternate slide directions, images desaturate → saturate on hover.

- [ ] **Step 3: Commit**

```bash
git add src/sections/Mission.jsx src/App.jsx
git commit -m "feat: Mission section — 4-point list, 2x2 alternating mosaic"
```

---

## Task 14: Portfolio section (drag gallery + Aceternity spotlight)

**Files:**
- Create: `src/sections/Portfolio.jsx`

- [ ] **Step 1: Create Portfolio**

```jsx
// src/sections/Portfolio.jsx
import { motion, useDragControls } from 'framer-motion'
import { useRef, useState } from 'react'
import SectionWrapper from '../components/SectionWrapper'
import { fadeUp } from '../lib/motion'

function SpotlightContainer({ children }) {
  const divRef = useRef(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [opacity, setOpacity] = useState(0)

  const onMouseMove = (e) => {
    const rect = divRef.current.getBoundingClientRect()
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    setOpacity(1)
  }

  return (
    <div ref={divRef} onMouseMove={onMouseMove} onMouseLeave={() => setOpacity(0)} className="relative">
      <div
        className="absolute inset-0 pointer-events-none rounded-sm transition-opacity duration-500"
        style={{
          opacity,
          background: `radial-gradient(500px circle at ${pos.x}px ${pos.y}px, rgba(255,255,255,0.05), transparent 55%)`,
        }}
      />
      {children}
    </div>
  )
}

export default function Portfolio() {
  const trackRef = useRef(null)
  const constraintsRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [hasDragged, setHasDragged] = useState(false)

  return (
    <SectionWrapper id="portfolio">
      <SpotlightContainer>
        <div className="flex justify-between items-end mb-10">
          <motion.div variants={fadeUp}>
            <p className="text-[10px] tracking-[0.3em] uppercase text-white/25 font-mono mb-4">
              06 — Favorite Portfolio
            </p>
            <h2 className="text-5xl lg:text-7xl xl:text-8xl font-black tracking-[-0.04em] leading-[0.85]">
              My Favorite<br />Portfolio
            </h2>
          </motion.div>

          <motion.span
            variants={fadeUp}
            animate={{ opacity: hasDragged ? 0 : 1 }}
            transition={{ duration: 0.5 }}
            className="text-[10px] tracking-[0.2em] uppercase text-white/25 font-mono hidden md:block pb-2"
          >
            ← Drag →
          </motion.span>
        </div>
      </SpotlightContainer>

      {/* Drag gallery */}
      <motion.div variants={fadeUp}>
        <div ref={constraintsRef} className="overflow-hidden">
          <motion.div
            ref={trackRef}
            drag="x"
            dragConstraints={constraintsRef}
            dragElastic={0.1}
            whileDrag={{ scale: 0.99 }}
            onDragStart={() => { setIsDragging(true); setHasDragged(true) }}
            onDragEnd={() => setIsDragging(false)}
            className="flex gap-4 lg:gap-6"
            style={{ cursor: isDragging ? 'grabbing' : 'grab', touchAction: 'pan-y' }}
          >
            <div className="relative shrink-0 w-[65%] lg:w-[55%] h-[60vh] lg:h-[75vh] overflow-hidden">
              <img
                src="/images/myFavPortfolio1.png"
                alt="Portfolio 1"
                loading="lazy"
                className="w-full h-full object-cover pointer-events-none select-none"
                draggable={false}
              />
            </div>
            <div className="relative shrink-0 w-[50%] lg:w-[42%] h-[60vh] lg:h-[75vh] overflow-hidden">
              <img
                src="/images/myFavPortfolio2.png"
                alt="Portfolio 2"
                loading="lazy"
                className="w-full h-full object-cover pointer-events-none select-none"
                draggable={false}
              />
            </div>
          </motion.div>
        </div>
      </motion.div>

      <div className="text-right text-[9px] font-mono text-white/15 tracking-widest mt-10">06 / 08</div>
    </SectionWrapper>
  )
}
```

- [ ] **Step 2: Add to App.jsx and verify**

Add `<Portfolio />` after `<Mission />`. Verify:
- Mouse over heading → subtle radial spotlight glow follows cursor
- Images can be dragged left/right
- "← Drag →" hint fades out after first drag
- `whileDrag` slightly scales gallery down

- [ ] **Step 3: Commit**

```bash
git add src/sections/Portfolio.jsx src/App.jsx
git commit -m "feat: Portfolio section — drag gallery + Aceternity spotlight on heading"
```

---

## Task 15: Contact section

**Files:**
- Create: `src/sections/Contact.jsx`

- [ ] **Step 1: Create Contact**

```jsx
// src/sections/Contact.jsx
import { motion } from 'framer-motion'
import { Mail, MapPin, Phone } from 'lucide-react'
import AnimatedLine from '../components/AnimatedLine'
import SectionWrapper from '../components/SectionWrapper'
import { clipRevealUp, fadeUp } from '../lib/motion'

const CONTACTS = [
  { icon: Phone, text: '92660 27894', href: 'tel:+919266027894' },
  { icon: Mail, text: 'Dianegi741@gmail.com', href: 'mailto:Dianegi741@gmail.com' },
  { icon: MapPin, text: 'Delhi, India', href: null },
]

export default function Contact() {
  return (
    <SectionWrapper id="contact">
      <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">

        {/* Left: info */}
        <div className="w-full lg:w-[55%] flex flex-col justify-center">
          <motion.p variants={fadeUp} className="text-[10px] tracking-[0.3em] uppercase text-white/25 font-mono mb-6">
            07 — Contact
          </motion.p>
          <motion.h2 variants={fadeUp} className="text-5xl lg:text-7xl xl:text-8xl font-black tracking-[-0.04em] leading-[0.85] mb-6">
            Let&apos;s Work<br />Together
          </motion.h2>
          <AnimatedLine className="w-40 mb-10" />

          <motion.div variants={fadeUp} className="mb-10 space-y-1 font-mono text-xs text-white/40">
            <p>Instagram — @dianegi_</p>
            <a
              href="https://www.instagram.com/dianegi_"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/50 hover:text-white transition-colors underline underline-offset-4"
            >
              instagram.com/dianegi_
            </a>
          </motion.div>

          <div className="space-y-6">
            {CONTACTS.map(({ icon: Icon, text, href }, i) => {
              const inner = (
                <motion.div
                  key={text}
                  variants={fadeUp}
                  className="flex items-center gap-6 group"
                >
                  <span className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center shrink-0 group-hover:bg-white group-hover:border-white transition-all duration-500">
                    <Icon
                      size={16}
                      strokeWidth={1.5}
                      className="text-white/60 group-hover:text-black transition-colors duration-500"
                    />
                  </span>
                  <span className="font-mono text-xs text-white/50 group-hover:text-white transition-colors duration-300">
                    {text}
                  </span>
                </motion.div>
              )

              return href ? (
                <a key={text} href={href} className="block">
                  {inner}
                </a>
              ) : (
                inner
              )
            })}
          </div>
        </div>

        {/* Right: image */}
        <motion.div
          variants={clipRevealUp}
          className="w-full lg:w-[45%] h-[65vh] lg:h-auto overflow-hidden"
        >
          <img
            src="/images/myContact1.png"
            alt="Contact"
            loading="lazy"
            className="w-full h-full object-cover hover:scale-[1.04] transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)]"
          />
        </motion.div>

      </div>
      <div className="text-right text-[9px] font-mono text-white/15 tracking-widest mt-16">07 / 08</div>
    </SectionWrapper>
  )
}
```

- [ ] **Step 2: Add to App.jsx and verify**

Add `<Contact />` after `<Portfolio />`. Verify: contact icons fill white on hover, icon turns black, Instagram link opens new tab, image wipes up from bottom.

- [ ] **Step 3: Commit**

```bash
git add src/sections/Contact.jsx src/App.jsx
git commit -m "feat: Contact section — icon hover fill, Instagram link, clip reveal image"
```

---

## Task 16: ThankYou section + footer

**Files:**
- Create: `src/sections/ThankYou.jsx`

- [ ] **Step 1: Create ThankYou**

```jsx
// src/sections/ThankYou.jsx
import { motion } from 'framer-motion'
import AnimatedLine from '../components/AnimatedLine'
import SectionWrapper from '../components/SectionWrapper'
import { clipRevealDown, clipRevealUp, fadeUp } from '../lib/motion'

export default function ThankYou() {
  return (
    <>
      <SectionWrapper id="thankyou">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">

          {/* Left: text */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <motion.p variants={fadeUp} className="text-[10px] tracking-[0.3em] uppercase text-white/25 font-mono mb-6">
              08 — Thank You
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-5xl lg:text-7xl xl:text-8xl font-black tracking-[-0.04em] leading-[0.85] mb-6">
              Thank<br />You
            </motion.h2>
            <AnimatedLine className="w-32 mb-10" />

            <motion.div variants={fadeUp} className="space-y-5 text-white/45 text-sm lg:text-base leading-relaxed font-light max-w-md">
              <p>
                Thank you for taking the time to view my portfolio. I truly appreciate your interest
                in my work, creativity, and content journey.
              </p>
              <p>
                I look forward to creating meaningful and aesthetically engaging collaborations that
                bring value, creativity, and authentic storytelling to your brand.
              </p>
            </motion.div>

            <motion.p
              variants={fadeUp}
              className="mt-10 text-white font-medium tracking-wide text-sm italic"
            >
              Let&apos;s create something beautiful together.<br />— Diya Negi
            </motion.p>
          </div>

          {/* Right: asymmetric grid */}
          <div className="w-full lg:w-1/2 grid grid-cols-2 gap-3 lg:gap-4 h-[70vh] lg:h-auto">
            {/* thankYou2: tall left column */}
            <motion.div
              variants={clipRevealDown}
              className="row-span-2 overflow-hidden"
            >
              <img
                src="/images/thankYou2.png"
                alt="Thank You"
                loading="lazy"
                className="w-full h-full object-cover hover:scale-[1.04] transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)]"
              />
            </motion.div>

            {/* thankYou1: top right */}
            <motion.div
              variants={clipRevealUp}
              className="overflow-hidden"
            >
              <img
                src="/images/thankYou1.png"
                alt="Thank You"
                loading="lazy"
                className="w-full h-full object-cover hover:scale-[1.04] transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)]"
              />
            </motion.div>

            {/* thankYou3: bottom right */}
            <motion.div
              variants={fadeUp}
              className="overflow-hidden"
            >
              <img
                src="/images/thankYou3.png"
                alt="Thank You"
                loading="lazy"
                className="w-full h-full object-cover hover:scale-[1.04] transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)]"
              />
            </motion.div>
          </div>

        </div>
        <div className="text-right text-[9px] font-mono text-white/15 tracking-widest mt-16">08 / 08</div>
      </SectionWrapper>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-8 px-8 lg:px-24 xl:px-32">
        <p className="text-center text-[9px] font-mono text-white/20 tracking-widest uppercase">
          © 2026 Diya Negi · @dianegi_
        </p>
      </footer>
    </>
  )
}
```

- [ ] **Step 2: Add to App.jsx and verify**

Add `<ThankYou />` after `<Contact />`. Verify: asymmetric grid with thankYou2 tall on left, thankYou1+3 stacked right. Footer visible at page bottom.

- [ ] **Step 3: Commit**

```bash
git add src/sections/ThankYou.jsx src/App.jsx
git commit -m "feat: ThankYou section — asymmetric image grid, italic signature, footer"
```

---

## Task 17: Final App.jsx assembly

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Write final App.jsx**

```jsx
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
```

- [ ] **Step 2: Full scroll-through verification**

Scroll from top to bottom and verify each section:

| Section | Check |
|---------|-------|
| Navbar | Slides down at 1.4s, progress bar grows |
| Hero | Grain, scramble DIYA+NEGI, image diagonal wipe |
| Introduction | Marquee scrolling, image clip reveal top→down |
| About Me | 3-image grid staggers, hover scale |
| Vision | myVision1 blurred behind myVision2, numbers visible |
| Mission | 4 items stagger, 2×2 grid alternates directions |
| Portfolio | Drag works, spotlight on heading, hint fades |
| Contact | Icon hover fill, image clip reveal bottom→up |
| Thank You | Asymmetric grid, signature italic, footer |
| Custom cursor | Dot + ring visible throughout |

- [ ] **Step 3: Commit**

```bash
git add src/App.jsx
git commit -m "feat: final App.jsx assembly — all 8 sections wired"
```

---

## Task 18: Polish — mobile, performance, a11y

**Files:**
- Modify: `src/index.css` (mobile cursor fix)
- Modify: `src/components/CustomCursor.jsx` (hide on touch)
- Modify: `src/sections/Hero.jsx` (mobile font size guard)

- [ ] **Step 1: Hide custom cursor on touch devices**

```jsx
// src/components/CustomCursor.jsx — add at the top of the component:
const isTouchDevice = window.matchMedia('(hover: none)').matches
if (isTouchDevice) return null
```

Add after the existing imports, before the `useEffect`.

- [ ] **Step 2: Restore cursor on touch devices in CSS**

Add to `src/index.css`:

```css
@media (hover: none) {
  *, *::before, *::after {
    cursor: auto !important;
  }
}
```

- [ ] **Step 3: Verify mobile layout at 375px viewport**

In DevTools, set viewport to 375px wide. Check:
- Hero: text does not overflow horizontally
- All sections: images stack vertically, not cut off
- Drag gallery: touch dragging works (touchAction: pan-y set)
- MarqueeTrack: not overflowing

- [ ] **Step 4: Reduce motion preference**

Add to `src/index.css`:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 5: Final commit**

```bash
git add src/index.css src/components/CustomCursor.jsx
git commit -m "polish: hide cursor on touch, reduced motion, mobile viewport fixes"
```

---

## Task 19: Git tag + cleanup

- [ ] **Step 1: Verify build passes**

```bash
npm run build
```

Expected: no errors, `dist/` folder created.

- [ ] **Step 2: Check bundle size**

```bash
npm run build 2>&1 | grep -E "kB|MB"
```

Three.js adds ~160kB gzipped. Total bundle should be under 500kB gzipped. If larger, check for accidental duplicate imports.

- [ ] **Step 3: Final tag**

```bash
git tag v1.0.0-portfolio-redesign
```

---

## Self-Review Notes

**Spec coverage check:**

| Spec requirement | Covered in task |
|-----------------|-----------------|
| Pure Noir palette | Task 2 (global CSS) + all sections |
| Three.js grain canvas | Task 5 |
| TextScramble DIYA/NEGI | Tasks 4 + 9 |
| Hero diagonal image peek | Task 9 |
| Custom cursor dot + ring | Task 6 |
| Scroll progress bar | Task 8 |
| Marquee strip in Introduction | Tasks 7 + 10 |
| 3-image stagger grid (About) | Task 11 |
| myVision1 as bg layer | Task 12 |
| 2×2 alternating mosaic (Mission) | Task 13 |
| Drag gallery (Portfolio) | Task 14 |
| Aceternity Spotlight | Task 14 |
| Contact icon hover fill | Task 15 |
| Asymmetric thank you grid | Task 16 |
| Footer © 2026 | Task 16 |
| All 18 images used | Tasks 9–16 |
| `loading="lazy"` on all except hero | Tasks 10–16 |
| `prefers-reduced-motion` | Task 18 |
| Mobile touch cursor fix | Task 18 |

All spec requirements covered. No gaps.
