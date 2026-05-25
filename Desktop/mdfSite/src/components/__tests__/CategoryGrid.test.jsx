import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import CategoryGrid from '../CategoryGrid'

describe('CategoryGrid', () => {
  it('renders all 5 category labels', () => {
    render(<CategoryGrid />)
    expect(screen.getByText('Sports Equipment')).toBeInTheDocument()
    expect(screen.getByText('Fitness & Wellness')).toBeInTheDocument()
    expect(screen.getByText('Musical Instruments')).toBeInTheDocument()
    expect(screen.getByText('Awards & Trophies')).toBeInTheDocument()
    expect(screen.getByText('Institutional Supply')).toBeInTheDocument()
  })

  it('renders section anchor id for nav scroll', () => {
    render(<CategoryGrid />)
    expect(document.getElementById('categories')).toBeInTheDocument()
  })
})
