import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function DELETE(req: NextRequest) {
  const userId = req.headers.get('X-User-Id')
  if (!userId) {
    return NextResponse.json({ error: 'X-User-Id header required' }, { status: 400 })
  }

  await prisma.userMemory.deleteMany({ where: { user_id: userId } })

  return NextResponse.json({ ok: true })
}
