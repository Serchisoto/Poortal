import { NextResponse } from 'next/server'

// OAuth callback is handled by Better Auth at /api/auth/[...all]
// This route exists for backwards compatibility and redirects to home
export async function GET() {
  return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'))
}
