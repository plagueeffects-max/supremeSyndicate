import { render, screen } from '@testing-library/react'
import App from '../../App'

describe('App', () => {
  it('renders all section anchors', () => {
    render(<App />)
    expect(document.getElementById('categories')).toBeInTheDocument()
    expect(document.getElementById('clients')).toBeInTheDocument()
    expect(document.getElementById('about')).toBeInTheDocument()
    expect(document.getElementById('contact')).toBeInTheDocument()
  })

  it('renders the main landmark', () => {
    render(<App />)
    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('renders footer landmark', () => {
    render(<App />)
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })
})
