import { Router, Request, Response } from 'express'
import { searchProjects, getProjectDetail } from '../repositories/projectRepository'

const router = Router()

router.get('/', async (req: Request, res: Response) => {
  const { sector, bhk, min_price, max_price } = req.query as Record<string, string | undefined>

  try {
    const projects = await searchProjects({
      city: 'Noida',
      sector: sector ?? 'Sector 150',
      bhk: bhk ? parseInt(bhk, 10) : undefined,
      budget_min_cr: min_price ? parseFloat(min_price) / 10_000_000 : undefined,
      budget_max_cr: max_price ? parseFloat(max_price) / 10_000_000 : undefined,
    })
    res.json({ projects })
  } catch (err) {
    console.error('[GET /api/v1/projects]', err)
    res.status(500).json({ error: 'Failed to fetch projects' })
  }
})

router.get('/:slug', async (req: Request, res: Response) => {
  const { slug } = req.params
  try {
    const project = await getProjectDetail(slug)
    if (!project) {
      res.status(404).json({ error: 'Project not found' })
      return
    }
    res.json({ project })
  } catch (err) {
    console.error('[GET /api/v1/projects/:slug]', err)
    res.status(500).json({ error: 'Failed to fetch project' })
  }
})

export default router
