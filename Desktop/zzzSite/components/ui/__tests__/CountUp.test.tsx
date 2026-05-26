import { render, screen, act } from '@testing-library/react'
import { CountUp } from '@/components/ui/CountUp'

jest.mock('framer-motion', () => ({
  useInView: () => true,
  animate: (_from: number, to: number, opts: { onUpdate: (v: number) => void }) => {
    opts.onUpdate(to)
    return { stop: jest.fn() }
  },
}))

describe('CountUp', () => {
  it('renders with suffix', async () => {
    await act(async () => {
      render(<CountUp target={50} suffix="+" />)
    })
    expect(screen.getByText('50+')).toBeInTheDocument()
  })

  it('renders without suffix', async () => {
    await act(async () => {
      render(<CountUp target={10} />)
    })
    expect(screen.getByText('10')).toBeInTheDocument()
  })
})
