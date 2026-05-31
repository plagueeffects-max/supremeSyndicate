import { Router, Request, Response } from 'express'
import { prisma } from '../lib/db'
import { toProjectCard } from '../repositories/projectRepository'

const router = Router()

router.post('/', async (req: Request, res: Response) => {
  const userId = req.headers['x-user-id'] as string | undefined
  if (!userId) { res.status(400).json({ error: 'X-User-Id required' }); return }
  const { project_id } = req.body as { project_id?: string }
  if (!project_id) { res.status(400).json({ error: 'project_id required' }); return }
  try {
    await prisma.savedProperty.upsert({
      where: { user_id_project_id: { user_id: userId, project_id } },
      create: { user_id: userId, project_id },
      update: {},
    })
    res.json({ ok: true })
  } catch (err) {
    console.error('[POST /api/v1/saved]', err)
    res.status(500).json({ error: 'Failed to save' })
  }
})

router.delete('/:project_id', async (req: Request, res: Response) => {
  const userId = req.headers['x-user-id'] as string | undefined
  if (!userId) { res.status(400).json({ error: 'X-User-Id required' }); return }
  await prisma.savedProperty.deleteMany({
    where: { user_id: userId, project_id: req.params.project_id },
  })
  res.json({ ok: true })
})

router.get('/', async (req: Request, res: Response) => {
  const userId = req.headers['x-user-id'] as string | undefined
  if (!userId) { res.status(400).json({ error: 'X-User-Id required' }); return }
  try {
    const saved = await prisma.savedProperty.findMany({
      where: { user_id: userId },
      include: {
        project: {
          include: {
            builder: { select: { name: true, slug: true } },
            unit_types: { orderBy: { bhk: 'asc' } },
            amenities: true,
            connectivity: true,
            images: { orderBy: { sort_order: 'asc' } },
          },
        },
      },
      orderBy: { saved_at: 'desc' },
    })
    const projects = saved.map((s) => toProjectCard(s.project))
    res.json({ projects, count: projects.length })
  } catch (err) {
    console.error('[GET /api/v1/saved]', err)
    res.status(500).json({ error: 'Failed to fetch saved' })
  }
})

export default router
