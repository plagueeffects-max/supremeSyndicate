import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import TrustedBy from '../TrustedBy'

describe('TrustedBy', () => {
  it('renders the section heading', () => {
    render(<TrustedBy />)
    expect(screen.getByText(/Leading institutions/i)).toBeInTheDocument()
  })

  it('renders all 8 client logos', () => {
    render(<TrustedBy />)
    const logos = screen.getAllByRole('img')
    expect(logos.length).toBeGreaterThanOrEqual(8)
  })

  it('renders section anchor for nav', () => {
    render(<TrustedBy />)
    expect(document.getElementById('clients')).toBeInTheDocument()
  })
})
