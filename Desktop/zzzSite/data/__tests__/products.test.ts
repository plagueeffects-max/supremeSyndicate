import { products, filterProducts } from '@/data/products'

describe('products data', () => {
  it('contains at least 8 products', () => {
    expect(products.length).toBeGreaterThanOrEqual(8)
  })

  it('each product has required fields', () => {
    products.forEach(p => {
      expect(p).toHaveProperty('id')
      expect(p).toHaveProperty('name')
      expect(p).toHaveProperty('category')
      expect(p).toHaveProperty('description')
      expect(p).toHaveProperty('image')
    })
  })

  it('filterProducts returns all when category is "all"', () => {
    expect(filterProducts('all').length).toBe(products.length)
  })

  it('filterProducts returns only matching category', () => {
    const sports = filterProducts('sports')
    expect(sports.length).toBeGreaterThan(0)
    sports.forEach(p => expect(p.category).toBe('sports'))
  })

  it('filterProducts returns empty for unknown category', () => {
    expect(filterProducts('unknown').length).toBe(0)
  })
})
