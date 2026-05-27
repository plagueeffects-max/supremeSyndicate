export interface ProcessStep {
  id: string
  number: string
  title: string
  description: string
}

export const processSteps: ProcessStep[] = [
  {
    id: 'consult',
    number: '01',
    title: 'Consult',
    description: 'We understand your requirements — category, quantity, budget, and timeline. One call is all it takes.',
  },
  {
    id: 'source',
    number: '02',
    title: 'Source',
    description: 'We procure from 25+ trusted brands at the best prices. GeM and tender documentation handled in full.',
  },
  {
    id: 'deliver',
    number: '03',
    title: 'Deliver',
    description: 'Pan-India delivery with careful packaging. We track every shipment until it reaches your premises.',
  },
  {
    id: 'install',
    number: '04',
    title: 'Install & Support',
    description: 'Our in-house team sets everything up. AMC and after-sales support keep you covered long after delivery.',
  },
]
