import { describe, it, expect } from 'vitest'
import { getSchemas } from '../lib/schema'

describe('JSON-LD schemas', () => {
  const schemas = getSchemas()

  it('returns at least 4 schema objects', () => {
    expect(schemas.length).toBeGreaterThanOrEqual(4)
  })

  it('includes Organization schema with correct name and url', () => {
    const org = schemas.find((s: any) => s['@type'] === 'Organization') as any
    expect(org).toBeDefined()
    expect(org.name).toBe('Cogn8 Systems')
    expect(org.url).toBe('https://cogn8.com')
  })

  it('includes Person schema for Julie McFadden', () => {
    const person = schemas.find((s: any) => s['@type'] === 'Person') as any
    expect(person).toBeDefined()
    expect(person.name).toBe('Julie McFadden')
    expect(person.url).toBe('https://juliemcfadden.com')
  })

  it('includes WebSite schema', () => {
    const site = schemas.find((s: any) => s['@type'] === 'WebSite') as any
    expect(site).toBeDefined()
    expect(site.url).toBe('https://cogn8.com')
  })

  it('includes FAQPage with mainEntity array', () => {
    const faq = schemas.find((s: any) => s['@type'] === 'FAQPage') as any
    expect(faq).toBeDefined()
    expect(Array.isArray(faq.mainEntity)).toBe(true)
    expect(faq.mainEntity.length).toBeGreaterThanOrEqual(4)
  })

  it('each FAQ entry has Question type and acceptedAnswer', () => {
    const faq = schemas.find((s: any) => s['@type'] === 'FAQPage') as any
    faq.mainEntity.forEach((q: any) => {
      expect(q['@type']).toBe('Question')
      expect(q.acceptedAnswer['@type']).toBe('Answer')
      expect(typeof q.acceptedAnswer.text).toBe('string')
    })
  })
})
