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
