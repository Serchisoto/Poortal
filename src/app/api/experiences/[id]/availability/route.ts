import { NextResponse } from 'next/server'
import { getExperienceAvailability } from '@/queries/experiences'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const today = new Date().toISOString().split('T')[0]
  const slots = await getExperienceAvailability(id, today)
  return NextResponse.json(slots)
}
