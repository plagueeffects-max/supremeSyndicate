export type ProductCategory = 'sports' | 'fitness' | 'music' | 'awards'

export interface Product {
  id: string
  name: string
  category: ProductCategory
  description: string
  image: string
}

export const products: Product[] = [
  {
    id: 'sp-001',
    name: 'Professional Cricket Bat',
    category: 'sports',
    description: 'Full-grain English willow, tournament-grade. Built for power and precision.',
    image: '/placeholder/product-cricket-bat.jpg',
  },
  {
    id: 'sp-002',
    name: 'Football Training Set',
    category: 'sports',
    description: 'FIFA-approved match ball with full kit. Ideal for academies and clubs.',
    image: '/placeholder/product-football.jpg',
  },
  {
    id: 'sp-003',
    name: 'Badminton Racket Pro',
    category: 'sports',
    description: 'Carbon-fibre frame, competition-grade strings. Used by national players.',
    image: '/placeholder/product-badminton.jpg',
  },
  {
    id: 'fit-001',
    name: 'Olympic Barbell Set',
    category: 'fitness',
    description: '20kg Olympic bar with 100kg bumper plate set. Gym-grade construction.',
    image: '/placeholder/product-barbell.jpg',
  },
  {
    id: 'fit-002',
    name: 'Adjustable Dumbbell Pair',
    category: 'fitness',
    description: '5–50kg adjustable range. Space-efficient, premium build quality.',
    image: '/placeholder/product-dumbbell.jpg',
  },
  {
    id: 'fit-003',
    name: 'Commercial Treadmill',
    category: 'fitness',
    description: '22km/h max speed, 15% incline, 10-inch touchscreen. Gym-grade durability.',
    image: '/placeholder/product-treadmill.jpg',
  },
  {
    id: 'mu-001',
    name: 'Acoustic Grand Piano',
    category: 'music',
    description: 'Yamaha-grade 88-key acoustic. Ideal for schools, recital halls, and studios.',
    image: '/placeholder/product-piano.jpg',
  },
  {
    id: 'mu-002',
    name: 'Professional Drum Kit',
    category: 'music',
    description: '5-piece maple shell kit with Zildjian cymbals. Studio and stage ready.',
    image: '/placeholder/product-drums.jpg',
  },
  {
    id: 'aw-001',
    name: 'Championship Trophy',
    category: 'awards',
    description: 'Solid brass with custom engraving. Available in gold, silver, and bronze.',
    image: '/placeholder/product-trophy.jpg',
  },
  {
    id: 'aw-002',
    name: 'Crystal Recognition Award',
    category: 'awards',
    description: 'Laser-engraved optical crystal. Elegant corporate and academic presentation.',
    image: '/placeholder/product-crystal.jpg',
  },
  {
    id: 'aw-003',
    name: 'Shield Plaque Set',
    category: 'awards',
    description: 'Mahogany and brass shield. Custom institutional branding available.',
    image: '/placeholder/product-shield.jpg',
  },
]

export function filterProducts(category: string): Product[] {
  if (category === 'all') return products
  return products.filter(p => p.category === category)
}
