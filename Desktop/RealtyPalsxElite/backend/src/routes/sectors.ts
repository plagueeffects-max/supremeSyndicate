import { Router } from 'express'

const router = Router()

router.get('/', (_, res) => {
  res.json({
    sectors: [
      { name: 'Sector 150', city: 'Noida', highlight: 'Sports City — luxury low-density' },
      { name: 'Sector 78',  city: 'Noida', highlight: 'Central Noida — premium & luxury' },
      { name: 'Sector 137', city: 'Noida', highlight: 'Noida Expressway — premium delivered' },
    ],
  })
})

export default router
