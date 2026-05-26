export interface PortfolioItem {
  id: string
  title: string
  client: string
  category: string
  description: string
  image: string
  featured: boolean
}

export const portfolioItems: PortfolioItem[] = [
  {
    id: 'pf-001',
    title: 'National Sports Academy Full Kit',
    client: 'Delhi Sports Academy',
    category: 'Sports',
    description: 'Supplied complete cricket, badminton, football, and athletics equipment for 500+ athletes.',
    image: '/placeholder/portfolio-academy.jpg',
    featured: true,
  },
  {
    id: 'pf-002',
    title: 'Corporate Awards Night — Apex Tech',
    client: 'Apex Technologies',
    category: 'Awards',
    description: '150 custom crystal and brass awards for annual recognition ceremony.',
    image: '/placeholder/portfolio-awards.jpg',
    featured: false,
  },
  {
    id: 'pf-003',
    title: 'School Music Department Setup',
    client: 'St. Xavier International School',
    category: 'Music',
    description: 'Full music department outfitting: pianos, drum kits, guitars, and brass instruments.',
    image: '/placeholder/portfolio-school-music.jpg',
    featured: false,
  },
  {
    id: 'pf-004',
    title: 'FitCore Commercial Gym Chain',
    client: 'FitCore Gyms',
    category: 'Fitness',
    description: 'Equipment procurement for 6 commercial gym locations across North India.',
    image: '/placeholder/portfolio-gym.jpg',
    featured: false,
  },
  {
    id: 'pf-005',
    title: 'National Badminton Championship Trophies',
    client: 'National Badminton Federation',
    category: 'Awards',
    description: '200 custom championship trophies delivered in 10 days for the national finals.',
    image: '/placeholder/portfolio-badminton-trophies.jpg',
    featured: false,
  },
  {
    id: 'pf-006',
    title: 'Corporate Wellness Center',
    client: 'Meridian Group',
    category: 'Fitness',
    description: 'End-to-end wellness center setup for a 10,000 sq ft corporate campus.',
    image: '/placeholder/portfolio-wellness.jpg',
    featured: false,
  },
]
