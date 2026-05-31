import { Router, Request, Response } from 'express'
import { prisma } from '../lib/db'

const router = Router()

router.get('/', async (req: Request, res: Response) => {
  const userId = req.headers['x-user-id'] as string | undefined
  if (!userId) {
    res.status(400).json({ error: 'X-User-Id header required' })
    return
  }

  let session = await prisma.chatSession.findFirst({
    where: { user_id: userId },
    orderBy: { last_active: 'desc' },
    include: { messages: { orderBy: { created_at: 'asc' }, take: 50 } },
  })

  if (!session) {
    session = await prisma.chatSession.create({
      data: { user_id: userId },
      include: { messages: { orderBy: { created_at: 'asc' }, take: 50 } },
    })
  }

  res.json({
    session_id: session.id,
    messages: session.messages.map((m) => ({
      id: m.id,
      role: m.role,
      content: m.content,
      created_at: m.created_at,
    })),
  })
})

// GET /list — returns last 5 sessions with labels for sidebar display
router.get('/list', async (req: Request, res: Response) => {
  const userId = req.headers['x-user-id'] as string | undefined
  if (!userId) {
    res.status(400).json({ error: 'X-User-Id header required' })
    return
  }

  const sessions = await prisma.chatSession.findMany({
    where: { user_id: userId },
    orderBy: { last_active: 'desc' },
    take: 5,
    include: {
      messages: {
        where: { role: 'user' },
        orderBy: { created_at: 'asc' },
        take: 1,
      },
    },
  })

  res.json({
    sessions: sessions.map((s) => ({
      id: s.id,
      label: s.messages[0]?.content
        ? s.messages[0].content.slice(0, 45) + (s.messages[0].content.length > 45 ? '…' : '')
        : `Chat ${new Date(s.last_active).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`,
      last_active: s.last_active,
    })),
  })
})

export default router
