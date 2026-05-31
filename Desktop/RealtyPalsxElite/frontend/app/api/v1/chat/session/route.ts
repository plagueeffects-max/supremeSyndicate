import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

const MAX_MESSAGES = 50

function getUserId(req: NextRequest): string | null {
  return req.headers.get('x-user-id')
}

export async function GET(request: NextRequest) {
  const userId = getUserId(request)
  if (!userId) return NextResponse.json({ error: 'X-User-Id header required' }, { status: 400 })

  let session = await prisma.chatSession.findFirst({
    where: { user_id: userId },
    orderBy: { last_active: 'desc' },
    include: { messages: { orderBy: { created_at: 'asc' }, take: MAX_MESSAGES } },
  })

  if (!session) {
    session = await prisma.chatSession.create({
      data: { user_id: userId },
      include: { messages: { orderBy: { created_at: 'asc' }, take: MAX_MESSAGES } },
    })
  }

  return NextResponse.json({
    session_id: session.id,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    messages: session.messages.map((m: any) => ({
      id: m.id,
      role: m.role,
      content: m.content,
      created_at: m.created_at,
    })),
  })
}
