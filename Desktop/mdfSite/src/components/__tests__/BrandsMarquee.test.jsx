import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import BrandsMarquee from '../BrandsMarquee'

describe('BrandsMarquee', () => {
  it('renders the section label', () => {
    render(<BrandsMarquee />)
    expect(screen.getByText(/brands we carry/i)).toBeInTheDocument()
  })

  it('renders brand logos duplicated for seamless loop (9 brands x2 = 18 images)', () => {
    render(<BrandsMarquee />)
    const logos = screen.getAllByRole('img')
    expect(logos.length).toBe(18)
  })
})
