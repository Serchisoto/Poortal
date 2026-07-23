import { NextRequest, NextResponse } from 'next/server'
import { getDestinationInfoItems } from '@/queries/destination_info'

export async function GET(request: NextRequest) {
  const categoryId = request.nextUrl.searchParams.get('categoryId')
  if (!categoryId) {
    return NextResponse.json({ error: 'categoryId required' }, { status: 400 })
  }
  const items = await getDestinationInfoItems(categoryId)
  return NextResponse.json({ items })
}
