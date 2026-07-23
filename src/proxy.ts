import { type NextRequest, NextResponse } from 'next/server'
import { PROTECTED_ROUTES, ROLE_ROUTES } from '@/lib/constants'
import type { UserRole } from '@/types'

type SessionUser = { id: string; role?: string } | null

async function getSessionUser(request: NextRequest): Promise<SessionUser> {
  try {
    const url = new URL('/api/auth/get-session', request.url)
    const res = await fetch(url, { headers: request.headers })
    if (!res.ok) return null
    const data = await res.json()
    return data?.user ?? null
  } catch {
    return null
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Get session via HTTP (avoids importing Prisma which is incompatible with Edge Runtime)
  const user = await getSessionUser(request)

  // Check if the route requires authentication
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  )

  if (isProtectedRoute && !user) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Check role-based access
  if (user) {
    const userRole = (user as { role?: string }).role as UserRole | undefined

    for (const [role, routes] of Object.entries(ROLE_ROUTES)) {
      const requiresRole = routes.some((route) => pathname.startsWith(route))
      if (requiresRole) {
        if (!userRole || userRole !== role) {
          const isProviderRoute = routes.some((route) => route.startsWith('/provider'))
          if (userRole !== 'admin' || isProviderRoute) {
            return NextResponse.redirect(new URL('/', request.url))
          }
        }
      }
    }

    // Redirect logged-in users away from auth pages
    if (pathname === '/login' || pathname === '/register') {
      if (userRole === 'admin') return NextResponse.redirect(new URL('/admin/dashboard', request.url))
      if (userRole === 'provider') return NextResponse.redirect(new URL('/provider/dashboard', request.url))
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/auth|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
