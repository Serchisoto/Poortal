import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const profile = await prisma.profiles.findFirst({
    where: { user_id: session.user.id },
    select: { role: true },
  })
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { searchParams } = request.nextUrl
  const query = searchParams.get('q') ?? ''
  const destinationId = searchParams.get('destination_id')
  const categoryId = searchParams.get('category_id')

  const experiences = await prisma.experiences.findMany({
    where: {
      status: { not: 'archived' },
      ...(query.length >= 2 ? { title: { contains: query, mode: 'insensitive' } } : {}),
      ...(destinationId ? { destination_id: destinationId } : {}),
      ...(categoryId ? { category_id: categoryId } : {}),
    },
    select: {
      id: true,
      title: true,
      slug: true,
      price_amount: true,
      price_currency: true,
      average_rating: true,
      duration_minutes: true,
      status: true,
      categories: { select: { id: true, name: true } },
    },
    take: 50,
  })

  return NextResponse.json(experiences)
}
