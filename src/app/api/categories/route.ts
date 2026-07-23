import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  const categories = await prisma.categories.findMany({
    where: { is_active: true },
    orderBy: { sort_order: 'asc' },
  })
  return NextResponse.json({ categories })
}
