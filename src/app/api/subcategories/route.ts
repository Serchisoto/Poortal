import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const categoryId = request.nextUrl.searchParams.get('categoryId')
  if (!categoryId) {
    return NextResponse.json({ error: 'categoryId required' }, { status: 400 })
  }
  const subcategories = await prisma.subcategories.findMany({
    where: { category_id: categoryId, is_active: true },
    orderBy: { sort_order: 'asc' },
  })
  return NextResponse.json({ subcategories })
}
