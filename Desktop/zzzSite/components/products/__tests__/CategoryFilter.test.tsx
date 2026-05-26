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
