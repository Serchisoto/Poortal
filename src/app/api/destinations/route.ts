import { NextResponse } from 'next/server'
import { getDestinations } from '@/queries/destinations'

export async function GET() {
  try {
    const destinations = await getDestinations()
    return NextResponse.json({
      destinations: destinations.map((d) => ({
        id: d.id,
        name: d.name,
        slug: d.slug,
      })),
    })
  } catch {
    return NextResponse.json({ destinations: [] }, { status: 500 })
  }
}
