import { render, screen } from '@testing-library/react'
import { About } from '@/components/home/About'

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...p }: any) => <div {...p}>{children}</div>,
    section: ({ children, ...p }: any) => <section {...p}>{children}</section>,
    p: ({ children, ...p }: any) => <p {...p}>{children}</p>,
    h2: ({ children, ...p }: any) => <h2 {...p}>{children}</h2>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
  useReducedMotion: () => false,
  useScroll: () => ({ scrollYProgress: { get: () => 0 } }),
  useTransform: (_v: any, _i: any, o: any) => o[0],
  useInView: () => false,
  animate: () => ({ stop: () => {} }),
}))

jest.mock('@/components/ui/CountUp', () => ({
  CountUp: ({ target, suffix }: { target: number; suffix?: string }) => (
    <span>{target}{suffix}</span>
  ),
}))

describe('About', () => {
  it('renders the about section heading', () => {
    render(<About />)
    expect(screen.getByText(/about mdf enterprises/i)).toBeInTheDocument()
  })

  it('renders the main headline', () => {
    render(<About />)
    expect(screen.getByText(/more than a supplier/i)).toBeInTheDocument()
  })

  it('renders stat values', () => {
    render(<About />)
    expect(screen.getByText('18+')).toBeInTheDocument()
  })

  it('renders feature list items', () => {
    render(<About />)
    expect(screen.getByText('Wide Product Range')).toBeInTheDocument()
    expect(screen.getByText('Expert Installation')).toBeInTheDocument()
  })
})
