import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

function getUserId(req: NextRequest): string | null {
  return req.headers.get('x-user-id')
}

export async function GET(request: NextRequest) {
  const userId = getUserId(request)
  if (!userId) return NextResponse.json({ error: 'X-User-Id header required' }, { status: 400 })

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

  return NextResponse.json({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sessions: sessions.map((s: any) => ({
      id: s.id,
      label: s.messages[0]?.content
        ? s.messages[0].content.slice(0, 45) + (s.messages[0].content.length > 45 ? '…' : '')
        : `Chat ${new Date(s.last_active).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`,
      last_active: s.last_active,
    })),
  })
}
