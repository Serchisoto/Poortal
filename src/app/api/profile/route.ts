import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const profile = await prisma.profiles.findFirst({
    where: { user_id: session.user.id },
  })

  // Merge user.role (single source of truth) on top of the profile row
  const role = (session.user as { role?: string }).role ?? profile?.role ?? 'tourist'

  return NextResponse.json({ ...profile, role })
}
