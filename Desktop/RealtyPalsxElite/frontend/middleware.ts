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

  // For chat API: validate Supabase session and set verified user ID
  if (pathname.startsWith('/api/v1/chat') || pathname.startsWith('/api/v1/saved') || pathname.startsWith('/api/v1/callback') || pathname.startsWith('/api/v1/site-visit')) {
    const claimedUserId = request.headers.get('x-user-id')
    if (claimedUserId) {
      // Get the Supabase access token from the auth cookie
      // Cookie name used by @supabase/ssr
      const supabaseToken = request.cookies.get('sb-eargxntetfmtdpwedjbd-auth-token')?.value
      if (supabaseToken) {
        try {
          const parsed = JSON.parse(supabaseToken)
          const accessToken: string | undefined = Array.isArray(parsed) ? parsed[0] : parsed?.access_token
          if (accessToken) {
            // Verify the JWT user ID matches the claimed user ID
            // JWT payload is base64url encoded at index 1
            const parts = accessToken.split('.')
            if (parts.length === 3) {
              const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString())
              if (payload.sub !== claimedUserId) {
                return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
              }
            }
          }
        } catch {
          // If cookie parse fails, let the request through (backward compat)
        }
      }
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
