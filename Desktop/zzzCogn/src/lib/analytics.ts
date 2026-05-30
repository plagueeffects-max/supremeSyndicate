declare global {
  interface Window {
    plausible?: (event: string, opts?: Record<string, unknown>) => void
  }
}

export function track(event: string): void {
  if (typeof window !== 'undefined' && typeof window.plausible === 'function') {
    window.plausible(event)
  }
}
