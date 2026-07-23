import { NextResponse } from 'next/server'
import { getExperienceById } from '@/queries/experiences'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const experience = await getExperienceById(id)
  if (!experience) return NextResponse.json({ error: 'not_found' }, { status: 404 })
  return NextResponse.json({
    id: experience.id,
    title: experience.title,
    price_amount: Number(experience.price_amount),
    price_currency: experience.price_currency,
    pricing_type: experience.pricing_type,
    provider_id: experience.provider_id,
  })
}
