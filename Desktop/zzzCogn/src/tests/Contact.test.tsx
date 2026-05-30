import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Contact from '../components/Contact'

describe('Contact form', () => {
  it('renders Name, Email, and Message fields', () => {
    render(<Contact />)
    expect(screen.getByLabelText('Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Message')).toBeInTheDocument()
  })

  it('renders the submit button', () => {
    render(<Contact />)
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument()
  })

  it('honeypot field is hidden from assistive technology', () => {
    render(<Contact />)
    const honeypot = screen.getByLabelText('Company', { selector: 'input' })
    expect(honeypot).toHaveAttribute('tabindex', '-1')
  })

  it('renders booking link with correct href', () => {
    render(<Contact />)
    const bookLink = screen.getByText(/book a call/i)
    expect(bookLink.closest('a')).toHaveAttribute('href', 'https://zcal.co/juliemcfadden')
  })

  it('renders section heading', () => {
    render(<Contact />)
    expect(screen.getByText('Get in touch')).toBeInTheDocument()
  })
})
