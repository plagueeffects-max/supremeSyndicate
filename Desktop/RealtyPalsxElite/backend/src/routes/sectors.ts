import { Router } from 'express'

const router = Router()

router.get('/', (_, res) => {
  res.json({ sectors: [{ name: 'Sector 150', city: 'Noida' }] })
})

export default router
