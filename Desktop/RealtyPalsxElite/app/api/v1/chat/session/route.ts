import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest) {
  const userId = req.headers.get('X-User-Id')
  if (!userId) {
    return NextResponse.json({ error: 'X-User-Id header required' }, { status: 400 })
  }

  let session = await prisma.chatSession.findFirst({
    where: { user_id: userId },
    orderBy: { last_active: 'desc' },
    include: {
      messages: {
        orderBy: { created_at: 'asc' },
        take: 50,
      },
    },
  })

  if (!session) {
    session = await prisma.chatSession.create({
      data: { user_id: userId },
      include: {
        messages: { orderBy: { created_at: 'asc' }, take: 50 },
      },
    })
  }

  return NextResponse.json({
    session_id: session.id,
    messages: session.messages.map((m) => ({
      id: m.id,
      role: m.role,
      content: m.content,
      created_at: m.created_at,
    })),
  })
}
