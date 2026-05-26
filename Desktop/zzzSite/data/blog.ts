export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  category: string
  date: string
  readTime: string
  image: string
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'choosing-cricket-bat',
    title: 'How to Choose the Right Cricket Bat for Your Game',
    excerpt: 'From English willow to Kashmir willow — a complete guide to picking the bat that elevates your game at every level.',
    category: 'Sports',
    date: 'May 18, 2026',
    readTime: '5 min read',
    image: '/placeholder/blog-cricket.jpg',
  },
  {
    slug: 'gym-setup-guide',
    title: 'Setting Up a Professional Gym: Equipment Checklist',
    excerpt: 'Whether you are opening a boutique studio or a full commercial gym, here is the exact equipment list you need.',
    category: 'Fitness',
    date: 'May 10, 2026',
    readTime: '7 min read',
    image: '/placeholder/blog-gym.jpg',
  },
  {
    slug: 'school-music-programs',
    title: 'Why Investing in School Music Programs Pays Off',
    excerpt: 'Research shows music education improves academic performance. Here is how institutions can build world-class programs on budget.',
    category: 'Music',
    date: 'Apr 28, 2026',
    readTime: '4 min read',
    image: '/placeholder/blog-music.jpg',
  },
  {
    slug: 'corporate-awards-culture',
    title: 'Building a Recognition Culture with Meaningful Awards',
    excerpt: 'Trophies and plaques drive more than morale. A look at how top organisations use recognition to retain talent.',
    category: 'Awards',
    date: 'Apr 15, 2026',
    readTime: '6 min read',
    image: '/placeholder/blog-awards.jpg',
  },
  {
    slug: 'badminton-equipment-guide',
    title: 'Badminton Equipment Guide: From Beginner to Pro',
    excerpt: 'Racket weight, string tension, shuttlecock speed — everything you need to know before making your next purchase.',
    category: 'Sports',
    date: 'Apr 3, 2026',
    readTime: '5 min read',
    image: '/placeholder/blog-badminton.jpg',
  },
  {
    slug: 'wellness-equipment-trends',
    title: '2026 Wellness Equipment Trends You Need to Know',
    excerpt: 'Recovery tech, smart fitness gear, and functional training — the equipment shaping the future of fitness facilities.',
    category: 'Fitness',
    date: 'Mar 22, 2026',
    readTime: '6 min read',
    image: '/placeholder/blog-wellness.jpg',
  },
]
