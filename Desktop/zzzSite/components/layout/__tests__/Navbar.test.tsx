import { render, screen } from '@testing-library/react'
import { Navbar } from '@/components/layout/Navbar'

jest.mock('next/navigation', () => ({ usePathname: () => '/' }))
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...p }: any) => <div {...p}>{children}</div>,
    a: ({ children, ...p }: any) => <a {...p}>{children}</a>,
    span: ({ children, ...p }: any) => <span {...p}>{children}</span>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
  useReducedMotion: () => false,
  useMotionValue: () => ({ set: jest.fn(), get: () => 0 }),
  useSpring: (v: any) => v,
}))

describe('Navbar', () => {
  it('renders MDF logo text', () => {
    render(<Navbar />)
    expect(screen.getByText('MDF')).toBeInTheDocument()
  })

  it('renders Products link', () => {
    render(<Navbar />)
    const links = screen.getAllByRole('link', { name: /products/i })
    expect(links[0]).toHaveAttribute('href', '/products')
  })

  it('renders Blog link', () => {
    render(<Navbar />)
    const links = screen.getAllByRole('link', { name: /blog/i })
    expect(links[0]).toHaveAttribute('href', '/blog')
  })

  it('renders WhatsApp CTA', () => {
    render(<Navbar />)
    const links = screen.getAllByRole('link', { name: /whatsapp/i })
    expect(links.length).toBeGreaterThan(0)
  })

  it('renders Get in Touch link', () => {
    render(<Navbar />)
    const links = screen.getAllByRole('link', { name: /get in touch/i })
    expect(links.length).toBeGreaterThan(0)
  })
})
