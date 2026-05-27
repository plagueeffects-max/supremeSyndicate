export interface Testimonial {
  id: string
  quote: string
  name: string
  title: string
  institution: string
  category: 'sports' | 'fitness' | 'music' | 'awards' | 'govt'
}

export const testimonials: Testimonial[] = [
  {
    id: 't1',
    quote: 'MDF Enterprises delivered and installed an entire gymnasium for our college within two weeks. Quality products, professional team.',
    name: 'Dr. Tariq Ahmad',
    title: 'Principal',
    institution: 'Govt. Degree College, Sopore',
    category: 'fitness',
  },
  {
    id: 't2',
    quote: 'We procured all sports equipment for our annual district games through MDF. GeM process was smooth and pricing was transparent.',
    name: 'Riyaz Ahmed',
    title: 'Sports Officer',
    institution: 'District Sports Council, Anantnag',
    category: 'govt',
  },
  {
    id: 't3',
    quote: 'Our school music room is equipped entirely by MDF. The Yamaha keyboards and Roland drum kit are of excellent quality.',
    name: 'Nusrat Mir',
    title: 'HOD Arts',
    institution: 'DPS, Srinagar',
    category: 'music',
  },
  {
    id: 't4',
    quote: 'From custom trophies to medals — MDF handled everything for our state-level tournament beautifully and on time.',
    name: 'Farooq Abdullah',
    title: 'Secretary',
    institution: 'J&K Basketball Association',
    category: 'awards',
  },
  {
    id: 't5',
    quote: 'Reliable supplier with excellent after-sales support. We have been partnering with MDF for over 5 years across all our campuses.',
    name: 'Prof. Sameer Wani',
    title: 'Director Physical Education',
    institution: 'University of Kashmir',
    category: 'sports',
  },
  {
    id: 't6',
    quote: 'MDF set up our entire sports complex — courts, gym, equipment. Professional installation team and zero hassle.',
    name: 'Brig. (Retd.) S.K. Sharma',
    title: 'Principal',
    institution: 'Army Public School, Jammu',
    category: 'sports',
  },
]
