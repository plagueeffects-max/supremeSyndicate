import { Router, Request, Response } from 'express'
import { prisma } from '../lib/db'

const router = Router()

router.delete('/', async (req: Request, res: Response) => {
  const userId = req.headers['x-user-id'] as string | undefined
  if (!userId) {
    res.status(400).json({ error: 'X-User-Id header required' })
    return
  }

  await prisma.userMemory.deleteMany({ where: { user_id: userId } })

  const newSession = await prisma.chatSession.create({
    data: { user_id: userId },
  })

  res.json({ ok: true, session_id: newSession.id })
})

export default router
