import '@testing-library/jest-dom'
import { vi } from 'vitest'

/* Framer Motion's whileInView needs IntersectionObserver — stub it for jsdom */
const mockObserver = {
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}

vi.stubGlobal('IntersectionObserver', vi.fn(() => mockObserver))
