# MDF Enterprises Website — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a premium three-route Next.js 14 website (/, /products, /blog) for MDF Enterprises with cinematic animations, royal blue + gold brand identity, and dual consumer/institutional CTAs.

**Architecture:** Next.js 14 App Router with TypeScript. All animation-heavy sections are `"use client"` components. Static TypeScript data arrays serve as the content layer — no CMS or database. Framer Motion drives all animations including the hero zoom-in reveal, 3D card hover, parallax scroll, and testimonials marquee.

**Tech Stack:** Next.js 14 · TypeScript · Tailwind CSS · Framer Motion · shadcn/ui · Lucide React · Sonner (toasts) · Jest + React Testing Library

**Design tokens:** Primary `#0d1f4a` (navy) · Accent `#C9A227` (gold) · Background `#050e24` (deep) · Text `#ffffff`

---

## File Map

```
app/
  layout.tsx                    # Root layout: fonts, favicon, Navbar, Footer
  page.tsx                      # / — assembles all home sections
  globals.css                   # Tailwind base + CSS variables + custom utilities
  products/
    page.tsx                    # /products — filter pills + animated grid
  blog/
    page.tsx                    # /blog — editorial 3-col card grid
    [slug]/
      page.tsx                  # /blog/[slug] — coming soon scaffold
components/
  layout/
    Navbar.tsx                  # Sticky nav, transparent → solid on scroll
    Footer.tsx                  # 4-column footer
  home/
    Hero.tsx                    # 100vh cinematic hero
    Categories.tsx              # 4-domain cards with 3D hover
    About.tsx                   # Split layout + stats + overlay trigger
    AboutOverlay.tsx            # Full-screen story overlay
    Portfolio.tsx               # Asymmetric masonry grid
    Testimonials.tsx            # Dual-row marquee carousel
    CtaBand.tsx                 # Gold gradient CTA strip
    Contact.tsx                 # Inquiry form section
  ui/
    AnimatedSection.tsx         # whileInView fade-up wrapper
    CountUp.tsx                 # Animated number count-up
    TiltCard.tsx                # 3D mouse-tracking tilt wrapper
data/
  products.ts                   # { id, name, category, description, image }[]
  blog.ts                       # { slug, title, excerpt, category, date, readTime, image }[]
  testimonials.ts               # { quote, name, role, organisation }[]
  portfolio.ts                  # { title, client, category, description, image }[]
lib/
  utils.ts                      # cn() helper
__mocks__/
  fileMock.ts                   # Jest static asset stub
jest.config.ts
jest.setup.ts
tailwind.config.ts              # Extended with brand colors + fonts
public/
  hero.mp4                      # (placeholder — user adds real video)
  mdfLogoWtext.webp             # (already in root — move to public/)
  mdfFavicon.png                # (already in root — move to public/)
```

---

## Task 1: Project Scaffold + Dependencies

**Files:**
- Create: project root (Next.js scaffold)
- Create: `jest.config.ts`
- Create: `jest.setup.ts`
- Create: `__mocks__/fileMock.ts`

- [ ] **Step 1: Move existing assets into public/**

```bash
mkdir -p public
cp mdfLogoWtext.webp public/mdfLogoWtext.webp
cp mdfFavicon.png public/mdfFavicon.png
```

- [ ] **Step 2: Scaffold Next.js 14 project in current directory**

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*" --yes
```

When prompted (if not using `--yes`): TypeScript yes, ESLint yes, Tailwind yes, src/ no, App Router yes, import alias `@/*`.

Expected: Next.js project created. `app/`, `components/`, `public/`, `package.json` present.

- [ ] **Step 3: Install runtime dependencies**

```bash
npm install framer-motion lucide-react sonner
```

Expected output: packages added with no peer dependency errors.

- [ ] **Step 4: Initialize shadcn/ui**

```bash
npx shadcn@latest init -y
```

When prompted: Default style, neutral base color, CSS variables yes. This writes `components/ui/` and updates `tailwind.config.ts` and `globals.css`.

- [ ] **Step 5: Add shadcn Button component**

```bash
npx shadcn@latest add button
```

Expected: `components/ui/button.tsx` created.

- [ ] **Step 6: Install test dependencies**

```bash
npm install -D jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @types/jest ts-jest
```

- [ ] **Step 7: Create Jest config**

Create `jest.config.ts`:

```ts
import type { Config } from 'jest'

const config: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfterFramework: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '\\.(webp|png|jpg|jpeg|mp4|svg)$': '<rootDir>/__mocks__/fileMock.ts',
    '^next/image$': '<rootDir>/__mocks__/nextImageMock.tsx',
    '^next/link$': '<rootDir>/__mocks__/nextLinkMock.tsx',
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: { jsx: 'react-jsx' } }],
  },
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
}

export default config
```

- [ ] **Step 8: Create Jest setup file**

Create `jest.setup.ts`:

```ts
import '@testing-library/jest-dom'
```

- [ ] **Step 9: Create static asset mock**

Create `__mocks__/fileMock.ts`:

```ts
const fileMock = 'test-file-stub'
export default fileMock
```

- [ ] **Step 10: Create Next.js component mocks for tests**

Create `__mocks__/nextImageMock.tsx`:

```tsx
import { ComponentProps } from 'react'

function NextImage({ src, alt, ...props }: ComponentProps<'img'>) {
  return <img src={typeof src === 'string' ? src : 'mock-image'} alt={alt} {...props} />
}

export default NextImage
```

Create `__mocks__/nextLinkMock.tsx`:

```tsx
import { ComponentProps } from 'react'

function NextLink({ href, children, ...props }: ComponentProps<'a'> & { href: string }) {
  return <a href={href} {...props}>{children}</a>
}

export default NextLink
```

- [ ] **Step 11: Add test script to package.json**

Edit `package.json`, add to `"scripts"`:

```json
"test": "jest",
"test:watch": "jest --watch"
```

- [ ] **Step 12: Verify scaffold works**

```bash
npm run dev
```

Expected: Next.js dev server starts at `http://localhost:3000`. Default Next.js page visible in browser.

- [ ] **Step 13: Commit**

```bash
git add .
git commit -m "feat: scaffold Next.js 14 project with TypeScript, Tailwind, Framer Motion, Jest"
```

---

## Task 2: Tailwind Config + Global Styles

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `app/globals.css`
- Create: `lib/utils.ts`

- [ ] **Step 1: Write failing test for cn() utility**

Create `lib/__tests__/utils.test.ts`:

```ts
import { cn } from '@/lib/utils'

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('handles conditional classes', () => {
    expect(cn('base', false && 'hidden', 'visible')).toBe('base visible')
  })

  it('resolves tailwind conflicts (last wins)', () => {
    const result = cn('text-red-500', 'text-blue-500')
    expect(result).toBe('text-blue-500')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test lib/__tests__/utils.test.ts
```

Expected: FAIL — `Cannot find module '@/lib/utils'`

- [ ] **Step 3: Create lib/utils.ts**

```ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

Install dependencies:

```bash
npm install clsx tailwind-merge
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test lib/__tests__/utils.test.ts
```

Expected: PASS — 3 tests pass.

- [ ] **Step 5: Update tailwind.config.ts**

Replace the entire file content:

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0d1f4a',
          light: '#1a3a6b',
        },
        deep: '#050e24',
        gold: {
          DEFAULT: '#C9A227',
          dark: '#a07d10',
          muted: 'rgba(201,162,39,0.7)',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        marquee: 'marquee 35s linear infinite',
        'marquee-reverse': 'marquee-reverse 40s linear infinite',
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 6: Replace app/globals.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --font-display: 'Playfair Display';
    --font-body: 'Inter';
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    background-color: #050e24;
    color: #ffffff;
    font-family: var(--font-body), system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  ::selection {
    background: rgba(201, 162, 39, 0.3);
    color: #ffffff;
  }
}

@layer utilities {
  .label-gold {
    @apply text-xs tracking-[0.3em] uppercase text-gold/80 font-body font-medium;
  }

  .section-padding {
    @apply px-6 md:px-12 lg:px-24 py-20 md:py-28;
  }

  .btn-primary {
    @apply inline-flex items-center gap-2 bg-gold text-deep px-6 py-3 text-sm font-bold tracking-widest uppercase rounded-sm hover:bg-gold-dark transition-colors duration-200;
  }

  .btn-ghost {
    @apply inline-flex items-center gap-2 border border-white/30 text-white px-6 py-3 text-sm tracking-widest uppercase rounded-sm hover:border-gold/60 hover:text-gold transition-colors duration-200;
  }

  .btn-dark {
    @apply inline-flex items-center gap-2 bg-deep text-white px-6 py-3 text-sm font-bold tracking-widest uppercase rounded-sm hover:bg-navy transition-colors duration-200;
  }

  .gold-divider {
    @apply w-10 h-px bg-gold my-4;
  }

  /* Pause marquee on hover */
  .pause-on-hover:hover .animate-marquee,
  .pause-on-hover:hover .animate-marquee-reverse {
    animation-play-state: paused;
  }

  /* Perspective for 3D card tilts */
  .perspective-1000 {
    perspective: 1000px;
  }
}
```

- [ ] **Step 7: Commit**

```bash
git add tailwind.config.ts app/globals.css lib/utils.ts lib/__tests__/utils.test.ts
git commit -m "feat: add brand design tokens, Tailwind config, global styles, cn utility"
```

---

## Task 3: Static Data Layer

**Files:**
- Create: `data/products.ts`
- Create: `data/blog.ts`
- Create: `data/testimonials.ts`
- Create: `data/portfolio.ts`
- Create: `data/__tests__/products.test.ts`

- [ ] **Step 1: Write failing test for product filtering**

Create `data/__tests__/products.test.ts`:

```ts
import { products, filterProducts } from '@/data/products'

describe('products data', () => {
  it('contains at least 8 products', () => {
    expect(products.length).toBeGreaterThanOrEqual(8)
  })

  it('each product has required fields', () => {
    products.forEach(p => {
      expect(p).toHaveProperty('id')
      expect(p).toHaveProperty('name')
      expect(p).toHaveProperty('category')
      expect(p).toHaveProperty('description')
      expect(p).toHaveProperty('image')
    })
  })

  it('filterProducts returns all when category is "all"', () => {
    expect(filterProducts('all').length).toBe(products.length)
  })

  it('filterProducts returns only matching category', () => {
    const sports = filterProducts('sports')
    expect(sports.length).toBeGreaterThan(0)
    sports.forEach(p => expect(p.category).toBe('sports'))
  })

  it('filterProducts returns empty for unknown category', () => {
    expect(filterProducts('unknown').length).toBe(0)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test data/__tests__/products.test.ts
```

Expected: FAIL — `Cannot find module '@/data/products'`

- [ ] **Step 3: Create data/products.ts**

```ts
export type ProductCategory = 'sports' | 'fitness' | 'music' | 'awards'

export interface Product {
  id: string
  name: string
  category: ProductCategory
  description: string
  image: string
}

export const products: Product[] = [
  {
    id: 'sp-001',
    name: 'Professional Cricket Bat',
    category: 'sports',
    description: 'Full-grain English willow, tournament-grade. Built for power and precision.',
    image: '/placeholder/product-cricket-bat.jpg',
  },
  {
    id: 'sp-002',
    name: 'Football Training Set',
    category: 'sports',
    description: 'FIFA-approved match ball with full kit. Ideal for academies and clubs.',
    image: '/placeholder/product-football.jpg',
  },
  {
    id: 'sp-003',
    name: 'Badminton Racket Pro',
    category: 'sports',
    description: 'Carbon-fibre frame, competition-grade strings. Used by national players.',
    image: '/placeholder/product-badminton.jpg',
  },
  {
    id: 'fit-001',
    name: 'Olympic Barbell Set',
    category: 'fitness',
    description: '20kg Olympic bar with 100kg bumper plate set. Gym-grade construction.',
    image: '/placeholder/product-barbell.jpg',
  },
  {
    id: 'fit-002',
    name: 'Adjustable Dumbbell Pair',
    category: 'fitness',
    description: '5–50kg adjustable range. Space-efficient, premium build quality.',
    image: '/placeholder/product-dumbbell.jpg',
  },
  {
    id: 'fit-003',
    name: 'Commercial Treadmill',
    category: 'fitness',
    description: '22km/h max speed, 15% incline, 10-inch touchscreen. Gym-grade durability.',
    image: '/placeholder/product-treadmill.jpg',
  },
  {
    id: 'mu-001',
    name: 'Acoustic Grand Piano',
    category: 'music',
    description: 'Yamaha-grade 88-key acoustic. Ideal for schools, recital halls, and studios.',
    image: '/placeholder/product-piano.jpg',
  },
  {
    id: 'mu-002',
    name: 'Professional Drum Kit',
    category: 'music',
    description: '5-piece maple shell kit with Zildjian cymbals. Studio and stage ready.',
    image: '/placeholder/product-drums.jpg',
  },
  {
    id: 'aw-001',
    name: 'Championship Trophy',
    category: 'awards',
    description: 'Solid brass with custom engraving. Available in gold, silver, and bronze.',
    image: '/placeholder/product-trophy.jpg',
  },
  {
    id: 'aw-002',
    name: 'Crystal Recognition Award',
    category: 'awards',
    description: 'Laser-engraved optical crystal. Elegant corporate and academic presentation.',
    image: '/placeholder/product-crystal.jpg',
  },
  {
    id: 'aw-003',
    name: 'Shield Plaque Set',
    category: 'awards',
    description: 'Mahogany and brass shield. Custom institutional branding available.',
    image: '/placeholder/product-shield.jpg',
  },
]

export function filterProducts(category: string): Product[] {
  if (category === 'all') return products
  return products.filter(p => p.category === category)
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test data/__tests__/products.test.ts
```

Expected: PASS — 5 tests pass.

- [ ] **Step 5: Create data/blog.ts**

```ts
export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  category: string
  date: string
  readTime: string
  image: string
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'choosing-cricket-bat',
    title: 'How to Choose the Right Cricket Bat for Your Game',
    excerpt: 'From English willow to Kashmir willow — a complete guide to picking the bat that elevates your game at every level.',
    category: 'Sports',
    date: 'May 18, 2026',
    readTime: '5 min read',
    image: '/placeholder/blog-cricket.jpg',
  },
  {
    slug: 'gym-setup-guide',
    title: 'Setting Up a Professional Gym: Equipment Checklist',
    excerpt: 'Whether you are opening a boutique studio or a full commercial gym, here is the exact equipment list you need.',
    category: 'Fitness',
    date: 'May 10, 2026',
    readTime: '7 min read',
    image: '/placeholder/blog-gym.jpg',
  },
  {
    slug: 'school-music-programs',
    title: 'Why Investing in School Music Programs Pays Off',
    excerpt: 'Research shows music education improves academic performance. Here is how institutions can build world-class programs on budget.',
    category: 'Music',
    date: 'Apr 28, 2026',
    readTime: '4 min read',
    image: '/placeholder/blog-music.jpg',
  },
  {
    slug: 'corporate-awards-culture',
    title: 'Building a Recognition Culture with Meaningful Awards',
    excerpt: 'Trophies and plaques drive more than morale. A look at how top organisations use recognition to retain talent.',
    category: 'Awards',
    date: 'Apr 15, 2026',
    readTime: '6 min read',
    image: '/placeholder/blog-awards.jpg',
  },
  {
    slug: 'badminton-equipment-guide',
    title: 'Badminton Equipment Guide: From Beginner to Pro',
    excerpt: 'Racket weight, string tension, shuttlecock speed — everything you need to know before making your next purchase.',
    category: 'Sports',
    date: 'Apr 3, 2026',
    readTime: '5 min read',
    image: '/placeholder/blog-badminton.jpg',
  },
  {
    slug: 'wellness-equipment-trends',
    title: '2026 Wellness Equipment Trends You Need to Know',
    excerpt: 'Recovery tech, smart fitness gear, and functional training — the equipment shaping the future of fitness facilities.',
    category: 'Fitness',
    date: 'Mar 22, 2026',
    readTime: '6 min read',
    image: '/placeholder/blog-wellness.jpg',
  },
]
```

- [ ] **Step 6: Create data/testimonials.ts**

```ts
export interface Testimonial {
  quote: string
  name: string
  role: string
  organisation: string
}

export const testimonials: Testimonial[] = [
  {
    quote: 'MDF supplied our entire sports academy with premium equipment. The quality is unmatched and delivery was ahead of schedule.',
    name: 'Arjun Sharma',
    role: 'Sports Director',
    organisation: 'Delhi Sports Academy',
  },
  {
    quote: 'The trophies and shields MDF crafted for our annual awards night were exceptional. Every recipient was genuinely impressed.',
    name: 'Priya Mehta',
    role: 'HR Director',
    organisation: 'Apex Technologies',
  },
  {
    quote: 'We outfitted our entire school music department through MDF. Competitive pricing, genuine instruments, outstanding support.',
    name: 'Dr. Rajesh Kumar',
    role: 'Principal',
    organisation: 'St. Xavier International School',
  },
  {
    quote: 'Our gym chain has sourced fitness equipment from MDF for three years. Consistent quality, fast turnaround, and a team that actually cares.',
    name: 'Meera Kapoor',
    role: 'Founder',
    organisation: 'FitCore Gyms',
  },
  {
    quote: 'For our national championship, MDF delivered 200 custom trophies in 10 days. Flawless execution under pressure.',
    name: 'Vikram Singh',
    role: 'Event Coordinator',
    organisation: 'National Badminton Federation',
  },
  {
    quote: 'The attention to detail on our corporate recognition awards was extraordinary. Our team felt truly celebrated.',
    name: 'Sunita Agarwal',
    role: 'CEO',
    organisation: 'Meridian Group',
  },
]
```

- [ ] **Step 7: Create data/portfolio.ts**

```ts
export interface PortfolioItem {
  id: string
  title: string
  client: string
  category: string
  description: string
  image: string
  featured: boolean
}

export const portfolioItems: PortfolioItem[] = [
  {
    id: 'pf-001',
    title: 'National Sports Academy Full Kit',
    client: 'Delhi Sports Academy',
    category: 'Sports',
    description: 'Supplied complete cricket, badminton, football, and athletics equipment for 500+ athletes.',
    image: '/placeholder/portfolio-academy.jpg',
    featured: true,
  },
  {
    id: 'pf-002',
    title: 'Corporate Awards Night — Apex Tech',
    client: 'Apex Technologies',
    category: 'Awards',
    description: '150 custom crystal and brass awards for annual recognition ceremony.',
    image: '/placeholder/portfolio-awards.jpg',
    featured: false,
  },
  {
    id: 'pf-003',
    title: 'School Music Department Setup',
    client: 'St. Xavier International School',
    category: 'Music',
    description: 'Full music department outfitting: pianos, drum kits, guitars, and brass instruments.',
    image: '/placeholder/portfolio-school-music.jpg',
    featured: false,
  },
  {
    id: 'pf-004',
    title: 'FitCore Commercial Gym Chain',
    client: 'FitCore Gyms',
    category: 'Fitness',
    description: 'Equipment procurement for 6 commercial gym locations across North India.',
    image: '/placeholder/portfolio-gym.jpg',
    featured: false,
  },
  {
    id: 'pf-005',
    title: 'National Badminton Championship Trophies',
    client: 'National Badminton Federation',
    category: 'Awards',
    description: '200 custom championship trophies delivered in 10 days for the national finals.',
    image: '/placeholder/portfolio-badminton-trophies.jpg',
    featured: false,
  },
  {
    id: 'pf-006',
    title: 'Corporate Wellness Center',
    client: 'Meridian Group',
    category: 'Fitness',
    description: 'End-to-end wellness center setup for a 10,000 sq ft corporate campus.',
    image: '/placeholder/portfolio-wellness.jpg',
    featured: false,
  },
]
```

- [ ] **Step 8: Commit**

```bash
git add data/ __mocks__/ jest.config.ts jest.setup.ts
git commit -m "feat: add static data layer for products, blog, testimonials, portfolio"
```

---

## Task 4: Shared Animation Primitives

**Files:**
- Create: `components/ui/AnimatedSection.tsx`
- Create: `components/ui/CountUp.tsx`
- Create: `components/ui/TiltCard.tsx`
- Create: `components/ui/__tests__/CountUp.test.tsx`

- [ ] **Step 1: Write failing test for CountUp**

Create `components/ui/__tests__/CountUp.test.tsx`:

```tsx
import { render, screen, act } from '@testing-library/react'
import { CountUp } from '@/components/ui/CountUp'

jest.mock('framer-motion', () => ({
  useInView: () => true,
  animate: (_from: number, to: number, opts: { onUpdate: (v: number) => void }) => {
    opts.onUpdate(to)
    return { stop: jest.fn() }
  },
}))

describe('CountUp', () => {
  it('renders with suffix', async () => {
    await act(async () => {
      render(<CountUp target={50} suffix="+" />)
    })
    expect(screen.getByText('50+')).toBeInTheDocument()
  })

  it('renders without suffix', async () => {
    await act(async () => {
      render(<CountUp target={10} />)
    })
    expect(screen.getByText('10')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test components/ui/__tests__/CountUp.test.tsx
```

Expected: FAIL — `Cannot find module '@/components/ui/CountUp'`

- [ ] **Step 3: Create components/ui/AnimatedSection.tsx**

```tsx
'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ReactNode } from 'react'

interface AnimatedSectionProps {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  once?: boolean
}

export function AnimatedSection({
  children,
  className,
  delay = 0,
  y = 40,
  once = true,
}: AnimatedSectionProps) {
  const shouldReduce = useReducedMotion()

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
```

- [ ] **Step 4: Create components/ui/CountUp.tsx**

```tsx
'use client'

import { useEffect, useRef } from 'react'
import { useInView, animate } from 'framer-motion'

interface CountUpProps {
  target: number
  suffix?: string
}

export function CountUp({ target, suffix = '' }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView || !ref.current) return
    const controls = animate(0, target, {
      duration: 2,
      ease: 'easeOut',
      onUpdate(value) {
        if (ref.current) {
          ref.current.textContent = Math.round(value) + suffix
        }
      },
    })
    return () => controls.stop()
  }, [inView, target, suffix])

  return <span ref={ref}>0{suffix}</span>
}
```

- [ ] **Step 5: Create components/ui/TiltCard.tsx**

```tsx
'use client'

import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion'
import { ReactNode, useRef } from 'react'

interface TiltCardProps {
  children: ReactNode
  className?: string
  intensity?: number
}

export function TiltCard({ children, className, intensity = 8 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const shouldReduce = useReducedMotion()

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)

  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [intensity, -intensity]), {
    stiffness: 300,
    damping: 30,
  })
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-intensity, intensity]), {
    stiffness: 300,
    damping: 30,
  })

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (shouldReduce || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    rawX.set((e.clientX - rect.left) / rect.width - 0.5)
    rawY.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  function handleMouseLeave() {
    rawX.set(0)
    rawY.set(0)
  }

  return (
    <motion.div
      ref={ref}
      style={shouldReduce ? {} : { rotateX, rotateY, transformStyle: 'preserve-3d' }}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  )
}
```

- [ ] **Step 6: Run CountUp test to verify it passes**

```bash
npm test components/ui/__tests__/CountUp.test.tsx
```

Expected: PASS — 2 tests pass.

- [ ] **Step 7: Commit**

```bash
git add components/ui/AnimatedSection.tsx components/ui/CountUp.tsx components/ui/TiltCard.tsx components/ui/__tests__/
git commit -m "feat: add shared animation primitives — AnimatedSection, CountUp, TiltCard"
```

---

## Task 5: Navbar

**Files:**
- Create: `components/layout/Navbar.tsx`
- Create: `components/layout/__tests__/Navbar.test.tsx`

- [ ] **Step 1: Write failing test**

Create `components/layout/__tests__/Navbar.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { Navbar } from '@/components/layout/Navbar'

describe('Navbar', () => {
  it('renders logo image', () => {
    render(<Navbar />)
    expect(screen.getByAltText('MDF Enterprises')).toBeInTheDocument()
  })

  it('renders Products link', () => {
    render(<Navbar />)
    expect(screen.getByRole('link', { name: /products/i })).toHaveAttribute('href', '/products')
  })

  it('renders Blog link', () => {
    render(<Navbar />)
    expect(screen.getByRole('link', { name: /blog/i })).toHaveAttribute('href', '/blog')
  })

  it('renders Get in Touch CTA', () => {
    render(<Navbar />)
    expect(screen.getByRole('link', { name: /get in touch/i })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test components/layout/__tests__/Navbar.test.tsx
```

Expected: FAIL — `Cannot find module '@/components/layout/Navbar'`

- [ ] **Step 3: Create components/layout/Navbar.tsx**

```tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/#about' },
  { label: 'Contact', href: '/#contact' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-navy/95 backdrop-blur-md border-b border-gold/10'
          : 'bg-transparent'
      )}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-24">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/mdfLogoWtext.webp"
              alt="MDF Enterprises"
              width={140}
              height={48}
              className="h-10 md:h-12 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs tracking-widest uppercase text-white/70 hover:text-gold transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Link href="/#contact" className="btn-primary text-xs">
              Get in Touch
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white/80 hover:text-white p-2"
            onClick={() => setMenuOpen(v => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-navy/98 backdrop-blur-md border-t border-gold/10 overflow-hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-5">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-sm tracking-widest uppercase text-white/70 hover:text-gold transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/#contact"
                onClick={() => setMenuOpen(false)}
                className="btn-primary text-xs mt-2 text-center"
              >
                Get in Touch
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test components/layout/__tests__/Navbar.test.tsx
```

Expected: PASS — 4 tests pass.

- [ ] **Step 5: Commit**

```bash
git add components/layout/
git commit -m "feat: add sticky Navbar with transparent-to-solid scroll transition and mobile menu"
```

---

## Task 6: Footer + Root Layout

**Files:**
- Create: `components/layout/Footer.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Create components/layout/Footer.tsx**

```tsx
import Link from 'next/link'
import Image from 'next/image'
import { Instagram, Linkedin, Facebook, Mail, Phone, MapPin } from 'lucide-react'

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Blog', href: '/blog' },
  { label: 'About Us', href: '/#about' },
  { label: 'Contact', href: '/#contact' },
]

const categories = [
  { label: 'Sports Equipment', href: '/products?category=sports' },
  { label: 'Fitness & Wellness', href: '/products?category=fitness' },
  { label: 'Musical Instruments', href: '/products?category=music' },
  { label: 'Awards & Trophies', href: '/products?category=awards' },
]

export function Footer() {
  return (
    <footer className="bg-deep border-t border-gold/10">
      <div className="mx-auto max-w-7xl section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Image
              src="/mdfLogoWtext.webp"
              alt="MDF Enterprises"
              width={130}
              height={44}
              className="h-11 w-auto object-contain mb-5"
            />
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              Excellence across sports, fitness, music, and recognition. Trusted by institutions and individuals across India.
            </p>
            <div className="flex gap-4">
              {[
                { icon: Instagram, href: '#', label: 'Instagram' },
                { icon: Linkedin, href: '#', label: 'LinkedIn' },
                { icon: Facebook, href: '#', label: 'Facebook' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 border border-gold/20 rounded-sm flex items-center justify-center text-gold/50 hover:text-gold hover:border-gold/60 transition-colors duration-200"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <p className="label-gold mb-5">Quick Links</p>
            <ul className="space-y-3">
              {quickLinks.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/50 text-sm hover:text-gold transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <p className="label-gold mb-5">Categories</p>
            <ul className="space-y-3">
              {categories.map(cat => (
                <li key={cat.href}>
                  <Link
                    href={cat.href}
                    className="text-white/50 text-sm hover:text-gold transition-colors duration-200"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="label-gold mb-5">Contact</p>
            <ul className="space-y-4">
              {[
                { icon: MapPin, text: 'New Delhi, India' },
                { icon: Phone, text: '+91 98765 43210' },
                { icon: Mail, text: 'info@mdfenterprises.in' },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3 text-white/50 text-sm">
                  <Icon size={14} className="text-gold/60 mt-0.5 shrink-0" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-gold/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-xs tracking-wider">
            © {new Date().getFullYear()} MDF Enterprises. All rights reserved.
          </p>
          <p className="text-white/20 text-xs">
            Sports · Fitness · Music · Awards
          </p>
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 2: Replace app/layout.tsx**

```tsx
import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700', '800', '900'],
  variable: '--font-display',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'MDF Enterprises — Sports · Fitness · Music · Awards',
  description:
    'Premium sports equipment, fitness gear, musical instruments, and awards. Trusted by institutions and individuals across India.',
  icons: {
    icon: '/mdfFavicon.png',
    apple: '/mdfFavicon.png',
  },
  openGraph: {
    title: 'MDF Enterprises',
    description: 'Where Excellence Meets Every Domain',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="bg-deep text-white font-body antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
```

- [ ] **Step 3: Verify in browser**

```bash
npm run dev
```

Open `http://localhost:3000`. Expected: Navbar visible at top (transparent). Footer visible at page bottom. Playfair Display font loaded.

- [ ] **Step 4: Commit**

```bash
git add components/layout/Footer.tsx app/layout.tsx
git commit -m "feat: add Footer and root layout with Playfair Display + Inter fonts, metadata"
```

---

## Task 7: Hero Section

**Files:**
- Create: `components/home/Hero.tsx`

- [ ] **Step 1: Create components/home/Hero.tsx**

```tsx
'use client'

import Link from 'next/link'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useRef } from 'react'

const staggerContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15, delayChildren: 0.4 },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.25, 0.1, 0.25, 1] },
  },
}

const zoomIn = {
  hidden: { opacity: 0, scale: 1.08 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1.2, ease: [0.25, 0.1, 0.25, 1] },
  },
}

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const shouldReduce = useReducedMotion()
  const { scrollY } = useScroll()
  const textY = useTransform(scrollY, [0, 600], [0, shouldReduce ? 0 : -80])
  const scrollIndicatorOpacity = useTransform(scrollY, [0, 120], [1, 0])

  return (
    <section
      ref={containerRef}
      className="relative h-screen min-h-[600px] overflow-hidden bg-deep"
    >
      {/* Background */}
      <HeroBackground />

      {/* Gradient overlay — dark at bottom for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-deep/95 via-deep/30 to-deep/10 pointer-events-none" />

      {/* Bottom-left anchored text */}
      <motion.div
        className="absolute bottom-[12%] left-6 md:left-16 lg:left-24 max-w-xl lg:max-w-2xl"
        style={{ y: textY }}
      >
        <motion.div variants={staggerContainer} initial="hidden" animate="show">
          <motion.p variants={fadeUp} className="label-gold mb-5">
            Sports · Fitness · Music · Awards
          </motion.p>

          <motion.h1
            variants={zoomIn}
            className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.05] tracking-tight"
          >
            Where Excellence<br />
            Meets Every Domain
          </motion.h1>

          <motion.div variants={fadeUp} className="w-10 h-px bg-gold my-6" />

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4">
            <Link href="/products" className="btn-primary">
              Browse Products
            </Link>
            <a href="#contact" className="btn-ghost">
              Partner With Us →
            </a>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ opacity: scrollIndicatorOpacity }}
        animate={shouldReduce ? {} : { y: [0, 6, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ChevronDown size={22} className="text-gold/40" />
      </motion.div>
    </section>
  )
}

function HeroBackground() {
  const shouldReduce = useReducedMotion()

  return (
    <>
      {/* Video — hides itself if /hero.mp4 not found */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        onError={e => {
          ;(e.currentTarget as HTMLVideoElement).style.display = 'none'
        }}
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>

      {/* Animated gradient — always rendered, visible as fallback */}
      <motion.div
        className="absolute inset-0"
        animate={
          shouldReduce
            ? {}
            : {
                background: [
                  'radial-gradient(ellipse at 25% 35%, #1a3a6b 0%, #0d1f4a 40%, #050e24 100%)',
                  'radial-gradient(ellipse at 75% 65%, #1a3a6b 0%, #0d1f4a 40%, #050e24 100%)',
                  'radial-gradient(ellipse at 50% 20%, #1a3a6b 0%, #0d1f4a 40%, #050e24 100%)',
                  'radial-gradient(ellipse at 25% 35%, #1a3a6b 0%, #0d1f4a 40%, #050e24 100%)',
                ],
              }
        }
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        style={{
          background: 'radial-gradient(ellipse at 25% 35%, #1a3a6b 0%, #0d1f4a 40%, #050e24 100%)',
        }}
      />

      {/* Gold particles */}
      {!shouldReduce && <GoldParticles />}
    </>
  )
}

const PARTICLES = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  left: `${(i * 37 + 11) % 100}%`,
  top: `${(i * 53 + 7) % 100}%`,
  size: (i % 3) + 1.5,
  duration: 15 + (i % 10),
  delay: (i * 0.7) % 8,
}))

function GoldParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {PARTICLES.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-gold/25"
          style={{ left: p.left, top: p.top, width: p.size, height: p.size }}
          animate={{ y: [-15, 15, -15], opacity: [0.1, 0.5, 0.1] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Verify in browser**

```bash
npm run dev
```

Open `http://localhost:3000`. Temporarily add `<Hero />` to `app/page.tsx`:

```tsx
import { Hero } from '@/components/home/Hero'
export default function Home() {
  return <Hero />
}
```

Expected: Full-screen hero with animated gradient, gold particles, bottom-left text, zoom-in animation on load, scroll chevron.

- [ ] **Step 3: Commit**

```bash
git add components/home/Hero.tsx app/page.tsx
git commit -m "feat: add Hero section — cinematic bottom-left layout, zoom-in reveal, particle bg"
```

---

## Task 8: Categories Section

**Files:**
- Create: `components/home/Categories.tsx`

- [ ] **Step 1: Create components/home/Categories.tsx**

```tsx
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { TiltCard } from '@/components/ui/TiltCard'
import { AnimatedSection } from '@/components/ui/AnimatedSection'

const categories = [
  {
    id: 'sports',
    label: 'Sports Equipment',
    icon: '🏅',
    description: 'Cricket, badminton, football, athletics — premium gear for every sport.',
    href: '/products?category=sports',
    accent: 'from-blue-900/40',
  },
  {
    id: 'fitness',
    label: 'Fitness & Wellness',
    icon: '💪',
    description: 'Commercial-grade gym equipment, barbells, cardio machines, and more.',
    href: '/products?category=fitness',
    accent: 'from-emerald-900/30',
  },
  {
    id: 'music',
    label: 'Musical Instruments',
    icon: '🎵',
    description: 'Pianos, drum kits, guitars, brass — instruments for schools and professionals.',
    href: '/products?category=music',
    accent: 'from-purple-900/30',
  },
  {
    id: 'awards',
    label: 'Awards & Trophies',
    icon: '🏆',
    description: 'Custom trophies, crystal awards, and plaques crafted for every occasion.',
    href: '/products?category=awards',
    accent: 'from-amber-900/30',
  },
]

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}

const cardVariant = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } },
}

export function Categories() {
  return (
    <section className="section-padding bg-deep">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection className="mb-14 text-center">
          <p className="label-gold mb-4">What We Offer</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
            Four Domains. One Partner.
          </h2>
        </AnimatedSection>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {categories.map(cat => (
            <motion.div key={cat.id} variants={cardVariant} className="perspective-1000">
              <TiltCard>
                <Link
                  href={cat.href}
                  className="group block h-full"
                >
                  <div
                    className={`
                      relative h-full min-h-[280px] rounded-sm border border-gold/10
                      bg-gradient-to-b ${cat.accent} to-navy/60
                      p-8 flex flex-col
                      hover:border-gold/30 transition-colors duration-300
                      overflow-hidden
                    `}
                  >
                    {/* Hover glow */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-sm" />

                    <div className="relative">
                      <span className="text-4xl mb-5 block">{cat.icon}</span>
                      <div className="w-8 h-px bg-gold/40 mb-5" />
                      <h3 className="font-display text-lg font-bold text-white mb-3 leading-snug">
                        {cat.label}
                      </h3>
                      <p className="text-white/50 text-sm leading-relaxed flex-1">
                        {cat.description}
                      </p>
                      <div className="mt-6 text-gold/60 text-xs tracking-widest uppercase group-hover:text-gold transition-colors duration-200">
                        Explore →
                      </div>
                    </div>
                  </div>
                </Link>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Add to app/page.tsx and verify in browser**

```tsx
import { Hero } from '@/components/home/Hero'
import { Categories } from '@/components/home/Categories'

export default function Home() {
  return (
    <>
      <Hero />
      <Categories />
    </>
  )
}
```

Open `http://localhost:3000`. Scroll down. Expected: 4 category cards with stagger reveal animation. Move mouse over cards — 3D tilt should respond.

- [ ] **Step 3: Commit**

```bash
git add components/home/Categories.tsx app/page.tsx
git commit -m "feat: add Categories section — 4-domain cards with 3D tilt hover and stagger reveal"
```

---

## Task 9: About Section + Overlay

**Files:**
- Create: `components/home/About.tsx`
- Create: `components/home/AboutOverlay.tsx`
- Create: `components/home/__tests__/About.test.tsx`

- [ ] **Step 1: Write failing test**

Create `components/home/__tests__/About.test.tsx`:

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { About } from '@/components/home/About'

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...p }: any) => <div {...p}>{children}</div>,
    section: ({ children, ...p }: any) => <section {...p}>{children}</section>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
  useReducedMotion: () => false,
  useScroll: () => ({ scrollYProgress: { get: () => 0 } }),
  useTransform: (_v: any, _i: any, o: any) => o[0],
}))

describe('About', () => {
  it('renders the section heading', () => {
    render(<About />)
    expect(screen.getByText(/about mdf/i)).toBeInTheDocument()
  })

  it('opens overlay when Learn Our Story is clicked', () => {
    render(<About />)
    const btn = screen.getByRole('button', { name: /learn our story/i })
    fireEvent.click(btn)
    expect(screen.getByText(/our story/i)).toBeInTheDocument()
  })

  it('closes overlay when close button is clicked', () => {
    render(<About />)
    fireEvent.click(screen.getByRole('button', { name: /learn our story/i }))
    fireEvent.click(screen.getByRole('button', { name: /close/i }))
    expect(screen.queryByText(/founded with a singular vision/i)).not.toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test components/home/__tests__/About.test.tsx
```

Expected: FAIL — `Cannot find module '@/components/home/About'`

- [ ] **Step 3: Create components/home/AboutOverlay.tsx**

```tsx
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface AboutOverlayProps {
  isOpen: boolean
  onClose: () => void
}

export function AboutOverlay({ isOpen, onClose }: AboutOverlayProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] bg-deep/98 backdrop-blur-sm overflow-y-auto"
          initial={{ opacity: 0, y: '100%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '100%' }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close"
            className="fixed top-6 right-6 z-10 w-10 h-10 flex items-center justify-center border border-gold/20 text-white/60 hover:text-gold hover:border-gold/50 transition-colors rounded-sm"
          >
            <X size={18} />
          </button>

          <div className="mx-auto max-w-3xl section-padding">
            <p className="label-gold mb-4">Our Story</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-8 leading-snug">
              Built on a Belief That<br />Excellence Has No Single Form
            </h2>
            <div className="w-10 h-px bg-gold mb-10" />

            <div className="space-y-6 text-white/65 text-base leading-relaxed">
              <p>
                MDF Enterprises was founded with a singular vision: to be the most trusted partner for organisations and individuals who demand the best across sport, wellness, music, and recognition.
              </p>
              <p>
                We started as a sports equipment supplier to local academies. Over the years, our clients began asking — can you source fitness equipment too? Musical instruments for our school? Trophies for our annual event? The answer was always yes, and a multi-domain enterprise was born.
              </p>
              <p>
                Today, we serve national sports federations, corporate campuses, international schools, commercial gym chains, and individual champions. Every category we operate in is held to the same standard: the product must perform, the service must impress, and the relationship must last.
              </p>
              <p>
                We do not believe in being the cheapest. We believe in being the right choice — the partner you call again, the name you recommend to others, the team that shows up when it counts.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-8 border-t border-gold/10 pt-10">
              {[
                { value: '10+', label: 'Years of Excellence' },
                { value: '500+', label: 'Clients Served' },
                { value: '4', label: 'Product Domains' },
              ].map(stat => (
                <div key={stat.label} className="text-center">
                  <p className="font-display text-3xl font-bold text-gold mb-2">{stat.value}</p>
                  <p className="text-white/40 text-xs tracking-wider uppercase">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

- [ ] **Step 4: Create components/home/About.tsx**

```tsx
'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { CountUp } from '@/components/ui/CountUp'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { AboutOverlay } from './AboutOverlay'

const stats = [
  { target: 10, suffix: '+', label: 'Years' },
  { target: 500, suffix: '+', label: 'Clients' },
  { target: 4, suffix: '', label: 'Domains' },
]

export function About() {
  const [overlayOpen, setOverlayOpen] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const shouldReduce = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const imageY = useTransform(scrollYProgress, [0, 1], shouldReduce ? ['0%', '0%'] : ['-4%', '4%'])
  const textY = useTransform(scrollYProgress, [0, 1], shouldReduce ? ['0%', '0%'] : ['4%', '-4%'])

  return (
    <>
      <AboutOverlay isOpen={overlayOpen} onClose={() => setOverlayOpen(false)} />

      <section
        id="about"
        ref={sectionRef}
        className="section-padding bg-navy/30 overflow-hidden"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Image column */}
            <motion.div style={{ y: imageY }} className="relative">
              <AnimatedSection delay={0.1}>
                <div className="relative aspect-[4/5] rounded-sm overflow-hidden border border-gold/10 bg-navy">
                  {/* Placeholder — replace src with real image */}
                  <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy/80 to-deep flex items-center justify-center">
                    <Image
                      src="/mdfLogoWtext.webp"
                      alt="MDF Enterprises"
                      width={220}
                      height={80}
                      className="w-44 opacity-40 object-contain"
                    />
                  </div>
                  {/* Gold corner accent */}
                  <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-gold/40" />
                  <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-gold/40" />
                </div>
              </AnimatedSection>
            </motion.div>

            {/* Text column */}
            <motion.div style={{ y: textY }}>
              <AnimatedSection delay={0.2}>
                <p className="label-gold mb-4">About MDF</p>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-white leading-snug mb-5">
                  Your Partner in<br />Excellence, Across Domains
                </h2>
                <div className="w-10 h-px bg-gold mb-6" />
                <p className="text-white/60 text-base leading-relaxed mb-8">
                  From national sports academies to corporate campuses, MDF Enterprises delivers premium sports equipment, fitness gear, musical instruments, and custom awards — with the consistency and care that institutions demand.
                </p>

                {/* Stats row */}
                <div className="flex gap-10 mb-10">
                  {stats.map(stat => (
                    <div key={stat.label}>
                      <p className="font-display text-3xl font-bold text-gold">
                        <CountUp target={stat.target} suffix={stat.suffix} />
                      </p>
                      <p className="text-white/40 text-xs tracking-widest uppercase mt-1">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setOverlayOpen(true)}
                  className="btn-ghost inline-flex"
                >
                  Learn Our Story →
                </button>
              </AnimatedSection>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}
```

- [ ] **Step 5: Run test to verify it passes**

```bash
npm test components/home/__tests__/About.test.tsx
```

Expected: PASS — 3 tests pass.

- [ ] **Step 6: Add to app/page.tsx and verify in browser**

```tsx
import { Hero } from '@/components/home/Hero'
import { Categories } from '@/components/home/Categories'
import { About } from '@/components/home/About'

export default function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <About />
    </>
  )
}
```

Open `http://localhost:3000`. Scroll to About section. Expected: Split layout with parallax, count-up numbers, and "Learn Our Story" button opening full-screen overlay.

- [ ] **Step 7: Commit**

```bash
git add components/home/About.tsx components/home/AboutOverlay.tsx components/home/__tests__/
git commit -m "feat: add About section — parallax split layout, count-up stats, full-screen story overlay"
```

---

## Task 10: Portfolio Section

**Files:**
- Create: `components/home/Portfolio.tsx`

- [ ] **Step 1: Create components/home/Portfolio.tsx**

```tsx
'use client'

import { motion } from 'framer-motion'
import { TiltCard } from '@/components/ui/TiltCard'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { portfolioItems } from '@/data/portfolio'

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } },
}

function PortfolioCard({
  item,
  className = '',
}: {
  item: (typeof portfolioItems)[0]
  className?: string
}) {
  return (
    <motion.div variants={cardVariant} className={`perspective-1000 ${className}`}>
      <TiltCard className="h-full">
        <div className="group relative h-full overflow-hidden rounded-sm border border-gold/10 bg-navy hover:border-gold/30 transition-colors duration-300">
          {/* Placeholder image */}
          <div className="absolute inset-0 bg-gradient-to-br from-navy-light/60 to-deep" />

          {/* Gold border on hover */}
          <div className="absolute inset-0 border border-gold/0 group-hover:border-gold/20 transition-colors duration-300 rounded-sm pointer-events-none" />

          {/* Content */}
          <div className="relative h-full p-8 flex flex-col justify-end min-h-[200px]">
            {/* Category tag */}
            <span className="label-gold mb-3 block">{item.category}</span>
            <h3 className="font-display text-lg font-bold text-white mb-2 leading-snug">
              {item.title}
            </h3>
            <p className="text-gold/60 text-xs tracking-wider mb-2">{item.client}</p>
            <p className="text-white/50 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300 max-h-0 group-hover:max-h-20 overflow-hidden">
              {item.description}
            </p>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  )
}

export function Portfolio() {
  const featured = portfolioItems.find(i => i.featured)!
  const rest = portfolioItems.filter(i => !i.featured)

  return (
    <section className="section-padding bg-deep">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection className="mb-14">
          <p className="label-gold mb-4">Our Work</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
            Delivered with Precision
          </h2>
        </AnimatedSection>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
        >
          {/* Row 1: Featured (spans 2) + one card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
            <PortfolioCard item={featured} className="md:col-span-2 md:row-span-2" />
            {rest[0] && <PortfolioCard item={rest[0]} />}
            {rest[1] && <PortfolioCard item={rest[1]} />}
          </div>

          {/* Row 2: Three equal cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {rest.slice(2, 5).map(item => (
              <PortfolioCard key={item.id} item={item} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Add to app/page.tsx and verify in browser**

```tsx
import { Hero } from '@/components/home/Hero'
import { Categories } from '@/components/home/Categories'
import { About } from '@/components/home/About'
import { Portfolio } from '@/components/home/Portfolio'

export default function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <About />
      <Portfolio />
    </>
  )
}
```

Expected: Asymmetric masonry grid with featured item spanning 2 columns. 3D tilt on hover. Description reveals on hover.

- [ ] **Step 3: Commit**

```bash
git add components/home/Portfolio.tsx app/page.tsx
git commit -m "feat: add Portfolio section — asymmetric masonry grid with 3D tilt hover"
```

---

## Task 11: Testimonials Marquee

**Files:**
- Create: `components/home/Testimonials.tsx`

- [ ] **Step 1: Create components/home/Testimonials.tsx**

```tsx
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { testimonials } from '@/data/testimonials'
import { Quote } from 'lucide-react'

function TestimonialCard({ item }: { item: (typeof testimonials)[0] }) {
  return (
    <div className="flex-shrink-0 w-72 md:w-80 mx-3 p-6 rounded-sm border border-gold/10 bg-navy/40 backdrop-blur-sm">
      <Quote size={20} className="text-gold/40 mb-4" />
      <p className="text-white/70 text-sm leading-relaxed mb-5 line-clamp-4">
        &ldquo;{item.quote}&rdquo;
      </p>
      <div className="border-t border-gold/10 pt-4">
        <p className="text-white font-semibold text-sm">{item.name}</p>
        <p className="text-gold/60 text-xs tracking-wider mt-0.5">{item.role}</p>
        <p className="text-white/40 text-xs mt-0.5">{item.organisation}</p>
      </div>
    </div>
  )
}

export function Testimonials() {
  const doubled = [...testimonials, ...testimonials]

  return (
    <section className="section-padding bg-navy/20 overflow-hidden">
      <div className="mx-auto max-w-7xl mb-14">
        <AnimatedSection className="text-center">
          <p className="label-gold mb-4">Client Voices</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
            What Our Partners Say
          </h2>
        </AnimatedSection>
      </div>

      {/* Marquee rows */}
      <div className="pause-on-hover space-y-4">
        {/* Row 1 — left to right */}
        <div className="relative overflow-hidden">
          {/* Fade masks */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-deep to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-deep to-transparent z-10 pointer-events-none" />
          <div className="flex animate-marquee">
            {doubled.map((t, i) => (
              <TestimonialCard key={`row1-${i}`} item={t} />
            ))}
          </div>
        </div>

        {/* Row 2 — right to left */}
        <div className="relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-deep to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-deep to-transparent z-10 pointer-events-none" />
          <div className="flex animate-marquee-reverse">
            {doubled.map((t, i) => (
              <TestimonialCard key={`row2-${i}`} item={t} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Add to app/page.tsx and verify in browser**

```tsx
import { Hero } from '@/components/home/Hero'
import { Categories } from '@/components/home/Categories'
import { About } from '@/components/home/About'
import { Portfolio } from '@/components/home/Portfolio'
import { Testimonials } from '@/components/home/Testimonials'

export default function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <About />
      <Portfolio />
      <Testimonials />
    </>
  )
}
```

Expected: Two rows of testimonial cards scrolling in opposite directions. Both rows pause on hover.

- [ ] **Step 3: Commit**

```bash
git add components/home/Testimonials.tsx app/page.tsx
git commit -m "feat: add Testimonials section — dual-row auto-scroll marquee, pause on hover"
```

---

## Task 12: CTA Band + Contact Section

**Files:**
- Create: `components/home/CtaBand.tsx`
- Create: `components/home/Contact.tsx`

- [ ] **Step 1: Create components/home/CtaBand.tsx**

```tsx
import Link from 'next/link'
import { AnimatedSection } from '@/components/ui/AnimatedSection'

export function CtaBand() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-gold-dark via-gold to-gold-dark py-20 px-6">
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.06)_0%,transparent_70%)]" />

      <div className="relative mx-auto max-w-4xl text-center">
        <AnimatedSection>
          <p className="text-deep/60 text-xs tracking-[0.3em] uppercase font-semibold mb-4">
            Ready to Partner
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-deep leading-tight mb-8">
            Ready to Partner with MDF?
          </h2>
          <p className="text-deep/60 text-base mb-10 max-w-xl mx-auto">
            Whether you need equipment for a single event or an ongoing institutional partnership, we are ready.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#contact" className="btn-dark">
              Get in Touch
            </a>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 border border-deep/30 text-deep px-6 py-3 text-sm font-bold tracking-widest uppercase rounded-sm hover:border-deep/60 transition-colors duration-200"
            >
              Browse Products
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Install Sonner for toasts**

```bash
npm install sonner
```

- [ ] **Step 3: Create components/home/Contact.tsx**

```tsx
'use client'

import { useState, FormEvent } from 'react'
import { toast } from 'sonner'
import { MapPin, Phone, Mail, Send } from 'lucide-react'
import { AnimatedSection } from '@/components/ui/AnimatedSection'

interface FormState {
  name: string
  organisation: string
  message: string
}

const INITIAL: FormState = { name: '', organisation: '', message: '' }

export function Contact() {
  const [form, setForm] = useState<FormState>(INITIAL)
  const [submitting, setSubmitting] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || !form.message.trim()) {
      toast.error('Please fill in your name and message.')
      return
    }
    setSubmitting(true)
    // Placeholder submission — wire to backend/email service later
    await new Promise(resolve => setTimeout(resolve, 800))
    toast.success('Message sent! We will be in touch within 24 hours.')
    setForm(INITIAL)
    setSubmitting(false)
  }

  return (
    <section id="contact" className="section-padding bg-deep border-t border-gold/10">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left — contact info */}
          <AnimatedSection delay={0.1}>
            <p className="label-gold mb-4">Get in Touch</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-5 leading-snug">
              Let&apos;s Build Something<br />Exceptional Together
            </h2>
            <div className="w-10 h-px bg-gold mb-8" />
            <p className="text-white/55 text-base leading-relaxed mb-10">
              Whether you are an institution procuring equipment, a business commissioning awards, or an individual looking for the best — reach out. We respond within 24 hours.
            </p>
            <ul className="space-y-5">
              {[
                { icon: MapPin, text: 'New Delhi, India' },
                { icon: Phone, text: '+91 98765 43210' },
                { icon: Mail, text: 'info@mdfenterprises.in' },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-4 text-white/60 text-sm">
                  <div className="w-9 h-9 border border-gold/20 rounded-sm flex items-center justify-center text-gold/60 shrink-0">
                    <Icon size={15} />
                  </div>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </AnimatedSection>

          {/* Right — form */}
          <AnimatedSection delay={0.25}>
            <form onSubmit={handleSubmit} className="space-y-5">
              {[
                { name: 'name', label: 'Your Name', placeholder: 'John Smith', type: 'input' },
                {
                  name: 'organisation',
                  label: 'Organisation (optional)',
                  placeholder: 'Delhi Sports Academy',
                  type: 'input',
                },
              ].map(field => (
                <div key={field.name}>
                  <label className="label-gold mb-2 block" htmlFor={field.name}>
                    {field.label}
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    type="text"
                    placeholder={field.placeholder}
                    value={form[field.name as keyof FormState]}
                    onChange={handleChange}
                    className="w-full bg-navy/50 border border-gold/15 rounded-sm px-4 py-3 text-white placeholder-white/25 text-sm focus:outline-none focus:border-gold/50 transition-colors duration-200"
                  />
                </div>
              ))}
              <div>
                <label className="label-gold mb-2 block" htmlFor="message">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Tell us what you need..."
                  value={form.message}
                  onChange={handleChange}
                  className="w-full bg-navy/50 border border-gold/15 rounded-sm px-4 py-3 text-white placeholder-white/25 text-sm focus:outline-none focus:border-gold/50 transition-colors duration-200 resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={14} />
                {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Add Sonner Toaster to root layout**

Edit `app/layout.tsx`, add Toaster import and component:

```tsx
import type { Metadata } from 'next'
import { Playfair_Display, Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import './globals.css'

// ... (font configs unchanged) ...

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="bg-deep text-white font-body antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
        <Toaster
          theme="dark"
          toastOptions={{
            style: { background: '#0d1f4a', border: '1px solid rgba(201,162,39,0.2)', color: '#fff' },
          }}
        />
      </body>
    </html>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add components/home/CtaBand.tsx components/home/Contact.tsx app/layout.tsx
git commit -m "feat: add CTA Band and Contact section with inquiry form and toast feedback"
```

---

## Task 13: Home Page Assembly

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Replace app/page.tsx with full home assembly**

```tsx
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
```

- [ ] **Step 2: Verify full home page in browser**

```bash
npm run dev
```

Open `http://localhost:3000`. Scroll through the entire page and verify:
- Hero loads with animation, video/gradient bg, bottom-left text
- Categories scroll-reveal with 3D tilt hover
- About section with parallax, count-up numbers, overlay opens/closes
- Portfolio masonry grid with hover reveal
- Testimonials dual-row marquee, pauses on hover
- CTA Band gold gradient
- Contact form submits, shows toast

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: assemble complete home page — all 7 sections wired in scroll order"
```

---

## Task 14: Products Page

**Files:**
- Create: `app/products/page.tsx`
- Create: `components/products/ProductsHero.tsx`
- Create: `components/products/CategoryFilter.tsx`
- Create: `components/products/ProductGrid.tsx`
- Create: `components/products/__tests__/CategoryFilter.test.tsx`

- [ ] **Step 1: Write failing test for CategoryFilter**

Create `components/products/__tests__/CategoryFilter.test.tsx`:

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { CategoryFilter } from '@/components/products/CategoryFilter'

jest.mock('framer-motion', () => ({
  motion: { div: ({ children, ...p }: any) => <div {...p}>{children}</div> },
  AnimatePresence: ({ children }: any) => <>{children}</>,
  useReducedMotion: () => false,
  layoutId: undefined,
}))

describe('CategoryFilter', () => {
  it('renders all category pills', () => {
    render(<CategoryFilter active="all" onChange={jest.fn()} />)
    expect(screen.getByRole('button', { name: /all/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sports/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /fitness/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /music/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /awards/i })).toBeInTheDocument()
  })

  it('calls onChange when a pill is clicked', () => {
    const onChange = jest.fn()
    render(<CategoryFilter active="all" onChange={onChange} />)
    fireEvent.click(screen.getByRole('button', { name: /sports/i }))
    expect(onChange).toHaveBeenCalledWith('sports')
  })

  it('marks active pill', () => {
    render(<CategoryFilter active="fitness" onChange={jest.fn()} />)
    const fitnessBtn = screen.getByRole('button', { name: /fitness/i })
    expect(fitnessBtn).toHaveAttribute('data-active', 'true')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test components/products/__tests__/CategoryFilter.test.tsx
```

Expected: FAIL — `Cannot find module '@/components/products/CategoryFilter'`

- [ ] **Step 3: Create components/products/ProductsHero.tsx**

```tsx
import { AnimatedSection } from '@/components/ui/AnimatedSection'

export function ProductsHero() {
  return (
    <section className="relative pt-32 pb-16 px-6 md:px-12 lg:px-24 bg-deep overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-navy/40 to-transparent pointer-events-none" />
      <div className="relative mx-auto max-w-7xl">
        <AnimatedSection>
          <p className="label-gold mb-4">Our Products</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Equipment Built for Excellence
          </h1>
          <div className="w-10 h-px bg-gold mb-5" />
          <p className="text-white/50 text-base max-w-xl">
            Browse our complete range across sports, fitness, music, and awards. Every product sourced for quality and built to perform.
          </p>
        </AnimatedSection>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Create components/products/CategoryFilter.tsx**

```tsx
'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const PILLS = [
  { id: 'all', label: 'All' },
  { id: 'sports', label: 'Sports' },
  { id: 'fitness', label: 'Fitness' },
  { id: 'music', label: 'Music' },
  { id: 'awards', label: 'Awards' },
]

interface CategoryFilterProps {
  active: string
  onChange: (category: string) => void
}

export function CategoryFilter({ active, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {PILLS.map(pill => (
        <button
          key={pill.id}
          onClick={() => onChange(pill.id)}
          data-active={active === pill.id}
          className={cn(
            'relative px-5 py-2 text-xs tracking-widest uppercase rounded-sm transition-colors duration-200',
            active === pill.id
              ? 'text-deep font-bold'
              : 'text-white/50 border border-gold/15 hover:text-white hover:border-gold/40'
          )}
        >
          {active === pill.id && (
            <motion.span
              layoutId="active-pill"
              className="absolute inset-0 bg-gold rounded-sm"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10">{pill.label}</span>
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 5: Create components/products/ProductGrid.tsx**

```tsx
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TiltCard } from '@/components/ui/TiltCard'
import { CategoryFilter } from './CategoryFilter'
import { products, filterProducts } from '@/data/products'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export function ProductGrid() {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get('category') ?? 'all'
  const [active, setActive] = useState(initialCategory)
  const filtered = filterProducts(active)

  useEffect(() => {
    const cat = searchParams.get('category')
    if (cat) setActive(cat)
  }, [searchParams])

  return (
    <section className="section-padding bg-deep">
      <div className="mx-auto max-w-7xl">
        {/* Filter */}
        <div className="mb-10">
          <CategoryFilter active={active} onChange={setActive} />
        </div>

        {/* Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map(product => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                className="perspective-1000"
              >
                <TiltCard>
                  <div className="group relative rounded-sm border border-gold/10 bg-navy/40 hover:border-gold/30 transition-colors duration-300 overflow-hidden">
                    {/* Placeholder image */}
                    <div className="h-52 bg-gradient-to-br from-navy-light/50 to-deep flex items-center justify-center">
                      <span className="text-4xl opacity-20">
                        {product.category === 'sports' && '🏅'}
                        {product.category === 'fitness' && '💪'}
                        {product.category === 'music' && '🎵'}
                        {product.category === 'awards' && '🏆'}
                      </span>
                    </div>

                    <div className="p-6">
                      <span className="label-gold mb-2 block">{product.category}</span>
                      <h3 className="font-display text-base font-bold text-white mb-2 leading-snug">
                        {product.name}
                      </h3>
                      <p className="text-white/50 text-sm leading-relaxed mb-5">
                        {product.description}
                      </p>
                      <a
                        href="/#contact"
                        className="btn-ghost text-xs py-2 px-4 inline-flex"
                      >
                        Enquire →
                      </a>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <p className="text-center text-white/40 py-20 text-sm tracking-wider">
            No products in this category yet.
          </p>
        )}
      </div>
    </section>
  )
}
```

- [ ] **Step 6: Run CategoryFilter test to verify it passes**

```bash
npm test components/products/__tests__/CategoryFilter.test.tsx
```

Expected: PASS — 3 tests pass.

- [ ] **Step 7: Create app/products/page.tsx**

```tsx
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
```

(`Suspense` required because `ProductGrid` uses `useSearchParams`)

- [ ] **Step 8: Verify in browser**

Navigate to `http://localhost:3000/products`. Expected: Hero banner, filter pills, 11-product grid. Click Sports pill — non-sports products exit with animation. Click All — all return. Hover product cards — 3D tilt.

- [ ] **Step 9: Commit**

```bash
git add app/products/ components/products/
git commit -m "feat: add Products page — animated category filter, 3D card grid, search-param aware filter"
```

---

## Task 15: Blog Page + Slug Scaffold

**Files:**
- Create: `components/blog/BlogHeader.tsx`
- Create: `components/blog/BlogGrid.tsx`
- Create: `app/blog/page.tsx`
- Create: `app/blog/[slug]/page.tsx`

- [ ] **Step 1: Create components/blog/BlogHeader.tsx**

```tsx
import { AnimatedSection } from '@/components/ui/AnimatedSection'

export function BlogHeader() {
  return (
    <section className="relative pt-32 pb-16 px-6 md:px-12 lg:px-24 bg-deep overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-navy/40 to-transparent pointer-events-none" />
      <div className="relative mx-auto max-w-7xl">
        <AnimatedSection>
          <p className="label-gold mb-4">Insights & Updates</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            The MDF Blog
          </h1>
          <div className="w-10 h-px bg-gold mb-5" />
          <p className="text-white/50 text-base max-w-xl">
            Expert guides, industry news, and stories from the world of sports, fitness, music, and recognition.
          </p>
        </AnimatedSection>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Create components/blog/BlogGrid.tsx**

```tsx
import Link from 'next/link'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { blogPosts } from '@/data/blog'

function BlogCard({ post, delay }: { post: (typeof blogPosts)[0]; delay: number }) {
  return (
    <AnimatedSection delay={delay}>
      <Link href={`/blog/${post.slug}`} className="group block h-full">
        <div className="rounded-sm border border-gold/10 bg-navy/30 hover:border-gold/25 transition-colors duration-300 overflow-hidden h-full">
          {/* Placeholder image */}
          <div className="h-48 bg-gradient-to-br from-navy-light/50 to-deep" />

          <div className="p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="label-gold">{post.category}</span>
              <span className="text-white/30 text-xs">{post.readTime}</span>
            </div>
            <h3 className="font-display text-base font-bold text-white mb-3 leading-snug group-hover:text-gold/90 transition-colors duration-200">
              {post.title}
            </h3>
            <p className="text-white/50 text-sm leading-relaxed mb-5 line-clamp-2">
              {post.excerpt}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-white/30 text-xs">{post.date}</span>
              <span className="text-gold/50 text-xs tracking-wider group-hover:text-gold transition-colors duration-200">
                Read →
              </span>
            </div>
          </div>
        </div>
      </Link>
    </AnimatedSection>
  )
}

export function BlogGrid() {
  return (
    <section className="section-padding bg-deep">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post, i) => (
            <BlogCard key={post.slug} post={post} delay={i * 0.08} />
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Create app/blog/page.tsx**

```tsx
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
```

- [ ] **Step 4: Create app/blog/[slug]/page.tsx**

```tsx
import Link from 'next/link'
import type { Metadata } from 'next'
import { blogPosts } from '@/data/blog'

interface Params {
  params: { slug: string }
}

export async function generateStaticParams() {
  return blogPosts.map(post => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const post = blogPosts.find(p => p.slug === params.slug)
  return {
    title: post ? `${post.title} — MDF Enterprises` : 'Post — MDF Enterprises',
  }
}

export default function BlogPostPage({ params }: Params) {
  const post = blogPosts.find(p => p.slug === params.slug)

  return (
    <div className="min-h-screen bg-deep flex flex-col items-center justify-center section-padding text-center">
      <p className="label-gold mb-4">{post?.category ?? 'Blog'}</p>
      <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-6 max-w-2xl leading-snug">
        {post?.title ?? 'Coming Soon'}
      </h1>
      <div className="w-10 h-px bg-gold mb-8 mx-auto" />
      <p className="text-white/50 text-base mb-10 max-w-md">
        Full article coming soon. Check back shortly.
      </p>
      <Link href="/blog" className="btn-ghost inline-flex">
        ← Back to Blog
      </Link>
    </div>
  )
}
```

- [ ] **Step 5: Verify in browser**

Navigate to `http://localhost:3000/blog`. Expected: Header + 6 blog cards in 3-col grid with stagger animation. Click any card — reaches `/blog/[slug]` with coming soon page and back link.

- [ ] **Step 6: Run full test suite**

```bash
npm test
```

Expected: All tests pass.

- [ ] **Step 7: Final production build check**

```bash
npm run build
```

Expected: Build completes with no errors. Warnings about missing `/hero.mp4` are acceptable — it is intentionally absent until user provides it.

- [ ] **Step 8: Add .gitignore entry for superpowers brainstorm assets**

Edit `.gitignore`, add:

```
# Brainstorm session files
.superpowers/brainstorm/
```

- [ ] **Step 9: Final commit**

```bash
git add app/blog/ components/blog/ .gitignore
git commit -m "feat: add Blog page, [slug] scaffold, final build verified"
```

---

## Post-Build: Swapping Placeholders for Real Assets

When real assets are ready:

| Asset | Replace |
|-------|---------|
| Hero video | Add `public/hero.mp4` — video element will auto-use it |
| Product images | Update `image` field in `data/products.ts` and add files to `public/placeholder/` |
| Portfolio images | Update `image` field in `data/portfolio.ts` |
| Blog images | Update `image` field in `data/blog.ts` |
| About section image | Replace gradient div in `About.tsx` with `<Image src="..." />` |
| Contact info | Update phone/email/address in `Footer.tsx` and `Contact.tsx` |
