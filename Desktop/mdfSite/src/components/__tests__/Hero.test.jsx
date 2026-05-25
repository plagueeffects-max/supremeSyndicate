import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Hero from '../Hero'

describe('Hero', () => {
  it('renders the main headline', () => {
    render(<Hero />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Kashmir.*Premier.*Supply Partner/i)
  })

  it('WhatsApp quote button links to correct number', () => {
    render(<Hero />)
    const btn = screen.getByRole('link', { name: /whatsapp for a quote/i })
    expect(btn).toHaveAttribute('href', 'https://wa.me/917006252334')
  })

  it('renders all three trust badge images', () => {
    render(<Hero />)
    expect(screen.getByAltText('MSME Registered')).toBeInTheDocument()
    expect(screen.getByAltText('GEM Portal')).toBeInTheDocument()
    expect(screen.getByAltText('Verified Supplier')).toBeInTheDocument()
  })
})
