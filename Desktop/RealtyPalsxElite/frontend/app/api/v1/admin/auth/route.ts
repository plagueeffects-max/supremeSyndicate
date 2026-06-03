import { NextRequest } from 'next/server'
import { createHash } from 'crypto'

function makeToken(password: string): string {
  const secret = process.env.ADMIN_SECRET ?? 'fallback_secret'
  return createHash('sha256').update(password + secret).digest('hex')
}

export function validateAdminToken(token: string | undefined): boolean {
  if (!token) return false
  const expected = makeToken(process.env.ADMIN_PASSWORD ?? '')
  return token === expected
}

export async function POST(req: NextRequest) {
  const { password } = await req.json().catch(() => ({ password: '' }))
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword || password !== adminPassword) {
    return Response.json({ error: 'Invalid password' }, { status: 401 })
  }
  const token = makeToken(password)
  const isProduction = process.env.NODE_ENV === 'production'
  const res = Response.json({ ok: true })
  res.headers.set(
    'Set-Cookie',
    `admin_token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${60 * 60 * 24 * 7}${isProduction ? '; Secure' : ''}`,
  )
  return res
}

export async function DELETE() {
  const isProduction = process.env.NODE_ENV === 'production'
  const res = Response.json({ ok: true })
  res.headers.set('Set-Cookie', `admin_token=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${isProduction ? '; Secure' : ''}`)
  return res
}
