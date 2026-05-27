export interface Brand {
  id: string
  name: string
  category: 'sports' | 'fitness' | 'music' | 'awards' | 'multi'
}

export const brands: Brand[] = [
  { id: 'cosco', name: 'COSCO', category: 'sports' },
  { id: 'nivia', name: 'NIVIA', category: 'sports' },
  { id: 'sg', name: 'SG', category: 'sports' },
  { id: 'ss', name: 'SS', category: 'sports' },
  { id: 'spartan', name: 'SPARTAN', category: 'sports' },
  { id: 'konex', name: 'KONEX', category: 'fitness' },
  { id: 'powermax', name: 'POWERMAX', category: 'fitness' },
  { id: 'fitbench', name: 'FITBENCH', category: 'fitness' },
  { id: 'yamaha', name: 'YAMAHA', category: 'music' },
  { id: 'roland', name: 'ROLAND', category: 'music' },
  { id: 'casio', name: 'CASIO', category: 'music' },
  { id: 'stagg', name: 'STAGG', category: 'music' },
  { id: 'trophy', name: 'ECHELON', category: 'awards' },
  { id: 'prime', name: 'PRIME', category: 'awards' },
  { id: 'yonex', name: 'YONEX', category: 'sports' },
]
