import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Navbar from '../Navbar'

describe('Navbar', () => {
  it('renders the MDF logo image', () => {
    render(<Navbar />)
    const logo = screen.getByAltText('MDF Enterprises')
    expect(logo).toBeInTheDocument()
  })

  it('renders WhatsApp CTA with correct href', () => {
    render(<Navbar />)
    const cta = screen.getByRole('link', { name: /whatsapp/i })
    expect(cta).toHaveAttribute('href', 'https://wa.me/917006252334')
  })

  it('renders all nav links', () => {
    render(<Navbar />)
    expect(screen.getByRole('link', { name: /products/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /clients/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument()
  })
})
