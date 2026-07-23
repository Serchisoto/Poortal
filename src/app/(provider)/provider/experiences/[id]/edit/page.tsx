import { redirect, notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { getProviderByAuthUserId } from '@/queries/providers'
import { getCategories } from '@/queries/categories'
import { getDestinations } from '@/queries/destinations'
import prisma from '@/lib/prisma'
import type { Experience } from '@/types'
import { ExperienceForm } from '@/components/provider/experience-form'
import { AvailabilityManager } from '@/components/provider/availability-manager'
import { ExperienceStatusCard } from '@/components/provider/experience-status-card'

export const metadata = {
  title: 'Editar Experiencia',
}

export default async function EditExperiencePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/login')

  const provider = await getProviderByAuthUserId(session.user.id)
  if (!provider) redirect('/register/provider')

  const rawExperience = await prisma.experiences.findFirst({
    where: { id, provider_id: provider.id },
  })
  if (!rawExperience) notFound()

  const experience = {
    ...rawExperience,
    price_amount: Number(rawExperience.price_amount),
    meeting_point_lat: rawExperience.meeting_point_lat != null ? Number(rawExperience.meeting_point_lat) : null,
    meeting_point_lng: rawExperience.meeting_point_lng != null ? Number(rawExperience.meeting_point_lng) : null,
    average_rating: rawExperience.average_rating != null ? Number(rawExperience.average_rating) : null,
    created_at: rawExperience.created_at.toISOString(),
    updated_at: rawExperience.updated_at.toISOString(),
    published_at: rawExperience.published_at?.toISOString() ?? null,
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [categories, destinations, availabilityRows, imageRows] = await Promise.all([
    getCategories(),
    getDestinations(),
    prisma.experience_availability.findMany({
      where: { experience_id: id, date: { gte: today } },
      orderBy: { date: 'asc' },
    }),
    prisma.experience_images.findMany({
      where: { experience_id: id },
      orderBy: { sort_order: 'asc' },
    }),
  ])

  const availability = availabilityRows.map((r) => ({
    id: r.id,
    date: r.date.toISOString().split('T')[0],
    start_time: r.start_time?.toISOString().slice(11, 16) ?? '',
    end_time: r.end_time?.toISOString().slice(11, 16) ?? null,
    total_spots: r.total_spots,
    booked_spots: r.booked_spots,
    price_override: r.price_override ? Number(r.price_override) : null,
    is_blocked: r.is_blocked,
  }))

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Editar Experiencia</h1>
        <p className="text-muted-foreground">
          {(experience as unknown as Experience).title}
        </p>
      </div>

      <div className="space-y-8">
        <ExperienceStatusCard
          experienceId={id}
          status={(experience as unknown as Experience).status}
        />

        <ExperienceForm
          categories={categories}
          destinations={destinations}
          experience={experience as unknown as Experience}
          initialImages={imageRows.map((img) => ({
            id: img.id,
            url: img.url,
            alt_text: img.alt_text,
            sort_order: img.sort_order,
            is_cover: img.is_cover,
          }))}
        />

        <AvailabilityManager
          experienceId={id}
          availability={availability}
        />
      </div>
    </div>
  )
}
