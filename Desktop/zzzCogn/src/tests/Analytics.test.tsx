import { describe, it, expect, vi, beforeEach } from 'vitest'
import { track } from '../lib/analytics'

describe('analytics.track', () => {
  beforeEach(() => {
    delete (window as any).plausible
  })

  it('calls window.plausible with the event name when available', () => {
    const mock = vi.fn()
    ;(window as any).plausible = mock
    track('form_submit_success')
    expect(mock).toHaveBeenCalledWith('form_submit_success')
  })

  it('does not throw when plausible is undefined', () => {
    expect(() => track('booking_click')).not.toThrow()
  })

  it('does not throw when plausible is not a function', () => {
    ;(window as any).plausible = 'not-a-function'
    expect(() => track('outbound_idmgmt')).not.toThrow()
  })
})
