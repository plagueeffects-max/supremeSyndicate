import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

function getUserId(req: NextRequest): string | null {
  return req.headers.get('x-user-id')
}

export async function GET(request: NextRequest) {
  const userId = getUserId(request)
  if (!userId) return NextResponse.json({ error: 'X-User-Id header required' }, { status: 400 })

  try {
    const sessions = await prisma.chatSession.findMany({
      where: { user_id: userId },
      orderBy: { last_active: 'desc' },
      take: 10,
      select: { id: true, title: true, last_active: true },
    })

    return NextResponse.json({
      sessions: sessions.map((s) => ({
        id: s.id,
        label: s.title ??
          `Chat ${new Date(s.last_active).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`,
        last_active: s.last_active,
      })),
    })
  } catch {
    return NextResponse.json({ sessions: [] })
  }
}
