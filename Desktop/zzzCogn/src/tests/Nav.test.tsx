import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Nav from '../components/Nav'

describe('Nav', () => {
  it('renders all nav links', () => {
    render(<Nav />)
    expect(screen.getByText('How we engage')).toBeInTheDocument()
    expect(screen.getByText('Current work')).toBeInTheDocument()
    expect(screen.getByText('How we build')).toBeInTheDocument()
    expect(screen.getByText('About')).toBeInTheDocument()
    expect(screen.getByText('Contact')).toBeInTheDocument()
  })

  it('renders brand with correct aria-label', () => {
    render(<Nav />)
    expect(screen.getByLabelText('Cogn8 Systems home')).toBeInTheDocument()
  })

  it('hamburger toggle updates aria-expanded', () => {
    render(<Nav />)
    const toggle = screen.getByRole('button', { name: /toggle navigation/i })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    fireEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
  })
})
