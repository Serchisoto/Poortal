import { notFound } from 'next/navigation'
import { getExperienceById, getExperienceAvailability } from '@/queries/experiences'
import { BookingFlow } from './booking-flow'

export default async function ExperienceBookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const experience = await getExperienceById(id)

  if (!experience || experience.status !== 'active') notFound()

  const availability = await getExperienceAvailability(id)

  return (
    <BookingFlow
      experience={{
        id: experience.id,
        title: experience.title,
        shortDescription: experience.short_description,
        coverImageUrl:
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          experience.experience_images?.find((i: any) => i.is_cover)?.url ||
          experience.experience_images?.[0]?.url ||
          null,
        providerName: experience.provider_profiles?.business_name || '',
        providerId: experience.provider_profiles?.id || '',
        priceAmount: Number(experience.price_amount),
        priceCurrency: experience.price_currency,
        pricingType: experience.pricing_type,
        maxCapacity: experience.max_capacity,
        subcategoryName: experience.subcategories?.name || null,
      }}
      availability={availability}
    />
  )
}
