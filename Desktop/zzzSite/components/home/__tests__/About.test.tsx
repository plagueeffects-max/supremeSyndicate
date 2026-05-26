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
  useInView: () => false,
  animate: () => ({ stop: () => {} }),
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
