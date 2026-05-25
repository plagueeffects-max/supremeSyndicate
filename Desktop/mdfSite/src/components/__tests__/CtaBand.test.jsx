import { render, screen } from '@testing-library/react'
import CtaBand from '../CtaBand'

describe('CtaBand', () => {
  it('renders the headline', () => {
    render(<CtaBand />)
    expect(screen.getByText(/Ready to equip your institution/)).toBeInTheDocument()
  })

  it('renders WhatsApp CTA with correct href', () => {
    render(<CtaBand />)
    const link = screen.getByRole('link', { name: /whatsapp/i })
    expect(link).toHaveAttribute('href', 'https://wa.me/917006252334')
  })

  it('renders section anchor for contact nav', () => {
    render(<CtaBand />)
    expect(document.getElementById('contact')).toBeInTheDocument()
  })
})
