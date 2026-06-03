import { NextRequest, NextResponse } from 'next/server'
import { validateAdminToken } from '@/app/api/v1/admin/auth/route'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect all admin API routes (except the auth login endpoint itself)
  if (pathname.startsWith('/api/v1/admin') && pathname !== '/api/v1/admin/auth') {
    const token = request.cookies.get('admin_token')?.value
    if (!validateAdminToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  const response = NextResponse.next()

  // Log API requests for debugging
  if (pathname.startsWith('/api/')) {
    console.log(`[mw] ${request.method} ${pathname} uid=${request.headers.get('x-user-id')?.slice(0, 8) ?? '-'}`)
  }

  return response
}

export const config = {
  matcher: ['/api/v1/admin/:path*', '/api/:path*'],
}
