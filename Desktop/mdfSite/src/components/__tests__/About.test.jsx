import { render, screen } from '@testing-library/react'
import About from '../About'

describe('About', () => {
  it('renders the headline', () => {
    render(<About />)
    expect(screen.getByText(/Founded in 1997/)).toBeInTheDocument()
  })

  it('renders the founder name', () => {
    render(<About />)
    expect(screen.getByText(/Mr\. Syed Mumtaz/)).toBeInTheDocument()
  })

  it('renders section anchor for nav', () => {
    render(<About />)
    expect(document.getElementById('about')).toBeInTheDocument()
  })

  it('renders all 6 service pills', () => {
    render(<About />)
    expect(screen.getByText('Supply & Procurement')).toBeInTheDocument()
    expect(screen.getByText('Gym Setup')).toBeInTheDocument()
    expect(screen.getByText('Trophy Customization')).toBeInTheDocument()
  })
})
