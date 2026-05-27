export interface PortfolioItem {
  id: string
  name: string
  location: string
  category: 'sports' | 'fitness' | 'music' | 'awards'
  image: string
  year: string
}

export const portfolioItems: PortfolioItem[] = [
  { id: 'p1', name: 'Sports Complex Setup', location: 'University of Kashmir, Srinagar', category: 'sports', image: '/assets/hero1Basketball.png', year: '2024' },
  { id: 'p2', name: 'Gymnasium Installation', location: 'Army Public School, Jammu', category: 'fitness', image: '/assets/hero2Bench.png', year: '2024' },
  { id: 'p3', name: 'Music Lab Setup', location: 'Govt. Degree College, Baramulla', category: 'music', image: '/assets/hero3Guitar.png', year: '2023' },
  { id: 'p4', name: 'Annual Sports Awards', location: 'J&K Sports Council, Srinagar', category: 'awards', image: '/assets/hero4Trophy.png', year: '2023' },
  { id: 'p5', name: 'Multi-Sport Arena', location: 'Central University, Kashmere Gate', category: 'sports', image: '/assets/sportsGoods.png', year: '2023' },
  { id: 'p6', name: 'Wellness Centre Fit-out', location: 'SKIMS Medical College, Soura', category: 'fitness', image: '/assets/fitnessWelness.png', year: '2022' },
]
