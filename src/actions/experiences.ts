'use server'

import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import prisma from '@/lib/prisma'
import { experienceSchema, availabilitySchema } from '@/lib/validations/experience'

export type ExperienceActionState = {
  error?: string
  success?: string
  experienceId?: string
}

async function getCurrentProvider(): Promise<{ id: string; status: string } | null> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return null

  const profile = await prisma.profiles.findFirst({
    where: { user_id: session.user.id },
    select: { id: true },
  })
  if (!profile) return null

  const provider = await prisma.provider_profiles.findFirst({
    where: { user_id: profile.id },
    select: { id: true, status: true },
  })
  return provider
}

export async function createExperienceAction(
  _prevState: ExperienceActionState,
  formData: FormData
): Promise<ExperienceActionState> {
  const provider = await getCurrentProvider()
  if (!provider) return { error: 'Debes iniciar sesion y tener un perfil de proveedor.' }

  if (provider.status !== 'active' && provider.status !== 'approved_incomplete') {
    return { error: 'Tu cuenta de proveedor no esta activa.' }
  }

  const rawData = {
    title: formData.get('title') as string,
    slug: formData.get('slug') as string,
    description: formData.get('description') as string,
    short_description: (formData.get('short_description') as string) || '',
    destination_id: formData.get('destination_id') as string,
    category_id: formData.get('category_id') as string,
    subcategory_id: (formData.get('subcategory_id') as string) || '',
    highlights: formData.getAll('highlights').filter(Boolean) as string[],
    includes: formData.getAll('includes').filter(Boolean) as string[],
    excludes: formData.getAll('excludes').filter(Boolean) as string[],
    requirements: formData.getAll('requirements').filter(Boolean) as string[],
    meeting_point: (formData.get('meeting_point') as string) || '',
    duration_minutes: formData.get('duration_minutes') as string,
    max_capacity: formData.get('max_capacity') as string,
    min_capacity: formData.get('min_capacity') as string,
    pricing_type: formData.get('pricing_type') as string,
    price_amount: formData.get('price_amount') as string,
    price_currency: (formData.get('price_currency') as string) || 'MXN',
    cancellation_policy: formData.get('cancellation_policy') as string,
  }

  const parsed = experienceSchema.safeParse(rawData)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const experience = await prisma.experiences.create({
    data: {
      provider_id: provider.id,
      destination_id: parsed.data.destination_id,
      category_id: parsed.data.category_id,
      subcategory_id: parsed.data.subcategory_id || null,
      title: parsed.data.title,
      slug: parsed.data.slug,
      description: parsed.data.description,
      short_description: parsed.data.short_description || null,
      highlights: parsed.data.highlights || [],
      includes: parsed.data.includes || [],
      excludes: parsed.data.excludes || [],
      requirements: parsed.data.requirements || [],
      meeting_point: parsed.data.meeting_point || null,
      duration_minutes: parsed.data.duration_minutes || null,
      max_capacity: parsed.data.max_capacity,
      min_capacity: parsed.data.min_capacity || 1,
      pricing_type: parsed.data.pricing_type,
      price_amount: parsed.data.price_amount,
      price_currency: parsed.data.price_currency,
      cancellation_policy: parsed.data.cancellation_policy,
      status: 'pending_review',
    },
    select: { id: true },
  })

  redirect(`/provider/experiences/${experience.id}/edit`)
}

export async function updateExperienceAction(
  _prevState: ExperienceActionState,
  formData: FormData
): Promise<ExperienceActionState> {
  const experienceId = formData.get('experience_id') as string
  if (!experienceId) return { error: 'ID de experiencia no proporcionado.' }

  const provider = await getCurrentProvider()
  if (!provider) return { error: 'Debes iniciar sesion y tener un perfil de proveedor.' }

  const existing = await prisma.experiences.findFirst({
    where: { id: experienceId },
    select: { provider_id: true },
  })
  if (!existing || existing.provider_id !== provider.id) {
    return { error: 'No tienes permiso para editar esta experiencia.' }
  }

  const rawData = {
    title: formData.get('title') as string,
    slug: formData.get('slug') as string,
    description: formData.get('description') as string,
    short_description: (formData.get('short_description') as string) || '',
    destination_id: formData.get('destination_id') as string,
    category_id: formData.get('category_id') as string,
    subcategory_id: (formData.get('subcategory_id') as string) || '',
    highlights: formData.getAll('highlights').filter(Boolean) as string[],
    includes: formData.getAll('includes').filter(Boolean) as string[],
    excludes: formData.getAll('excludes').filter(Boolean) as string[],
    requirements: formData.getAll('requirements').filter(Boolean) as string[],
    meeting_point: (formData.get('meeting_point') as string) || '',
    duration_minutes: formData.get('duration_minutes') as string,
    max_capacity: formData.get('max_capacity') as string,
    min_capacity: formData.get('min_capacity') as string,
    pricing_type: formData.get('pricing_type') as string,
    price_amount: formData.get('price_amount') as string,
    price_currency: (formData.get('price_currency') as string) || 'MXN',
    cancellation_policy: formData.get('cancellation_policy') as string,
  }

  const parsed = experienceSchema.safeParse(rawData)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  await prisma.experiences.update({
    where: { id: experienceId },
    data: {
      destination_id: parsed.data.destination_id,
      category_id: parsed.data.category_id,
      subcategory_id: parsed.data.subcategory_id || null,
      title: parsed.data.title,
      slug: parsed.data.slug,
      description: parsed.data.description,
      short_description: parsed.data.short_description || null,
      highlights: parsed.data.highlights || [],
      includes: parsed.data.includes || [],
      excludes: parsed.data.excludes || [],
      requirements: parsed.data.requirements || [],
      meeting_point: parsed.data.meeting_point || null,
      duration_minutes: parsed.data.duration_minutes || null,
      max_capacity: parsed.data.max_capacity,
      min_capacity: parsed.data.min_capacity || 1,
      pricing_type: parsed.data.pricing_type,
      price_amount: parsed.data.price_amount,
      price_currency: parsed.data.price_currency,
      cancellation_policy: parsed.data.cancellation_policy,
    },
  })

  return { success: 'Experiencia actualizada correctamente.', experienceId }
}

function parseTimeToDate(timeStr: string): Date {
  const [h, m] = timeStr.split(':').map(Number)
  return new Date(Date.UTC(1970, 0, 1, h, m, 0))
}

export async function addAvailabilityAction(
  _prevState: ExperienceActionState,
  formData: FormData
): Promise<ExperienceActionState> {
  const experienceId = formData.get('experience_id') as string

  const rawData = {
    date: formData.get('date') as string,
    start_time: formData.get('start_time') as string,
    end_time: (formData.get('end_time') as string) || '',
    total_spots: formData.get('total_spots') as string,
    price_override: formData.get('price_override') as string,
  }

  const parsed = availabilitySchema.safeParse(rawData)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const provider = await getCurrentProvider()
  if (!provider) return { error: 'Debes iniciar sesion y tener un perfil de proveedor.' }

  await prisma.experience_availability.create({
    data: {
      experience_id: experienceId,
      date: new Date(parsed.data.date),
      start_time: parseTimeToDate(parsed.data.start_time),
      end_time: parsed.data.end_time ? parseTimeToDate(parsed.data.end_time) : null,
      total_spots: parsed.data.total_spots,
      price_override: parsed.data.price_override || null,
    },
  })

  return { success: 'Disponibilidad agregada.', experienceId }
}

export async function submitExperienceForReviewAction(experienceId: string): Promise<ExperienceActionState> {
  const provider = await getCurrentProvider()
  if (!provider) return { error: 'Debes iniciar sesion.' }

  await prisma.experiences.update({
    where: { id: experienceId },
    data: { status: 'pending_review' },
  })

  return { success: 'Experiencia enviada para revision.' }
}

export async function addRecurringAvailabilityAction(
  _prevState: ExperienceActionState,
  formData: FormData
): Promise<ExperienceActionState> {
  const experienceId = formData.get('experience_id') as string
  const dateFrom = formData.get('date_from') as string
  const dateTo = formData.get('date_to') as string
  const weekdays = formData.getAll('weekdays').map(Number)
  const startTime = formData.get('start_time') as string
  const endTime = (formData.get('end_time') as string) || null
  const totalSpotsRaw = formData.get('total_spots') as string
  const priceOverrideRaw = formData.get('price_override') as string

  if (!experienceId || !dateFrom || !dateTo || !weekdays.length || !startTime || !totalSpotsRaw) {
    return { error: 'Completa todos los campos requeridos.' }
  }

  const totalSpots = parseInt(totalSpotsRaw, 10)
  if (isNaN(totalSpots) || totalSpots < 1) {
    return { error: 'Los lugares disponibles deben ser al menos 1.' }
  }

  const priceOverride = priceOverrideRaw ? parseFloat(priceOverrideRaw) : null

  const provider = await getCurrentProvider()
  if (!provider) return { error: 'Debes iniciar sesion.' }

  const dates: string[] = []
  const current = new Date(dateFrom + 'T12:00:00')
  const end = new Date(dateTo + 'T12:00:00')

  if (current > end) {
    return { error: 'La fecha de inicio debe ser anterior a la fecha de fin.' }
  }

  while (current <= end) {
    if (weekdays.includes(current.getDay())) {
      dates.push(current.toISOString().split('T')[0])
    }
    current.setDate(current.getDate() + 1)
  }

  if (dates.length === 0) {
    return { error: 'No hay fechas disponibles con esa combinacion de dias en el rango seleccionado.' }
  }
  if (dates.length > 365) {
    return { error: 'El rango genera demasiadas fechas. Reduce el periodo o los dias.' }
  }

  await prisma.experience_availability.createMany({
    data: dates.map((date) => ({
      experience_id: experienceId,
      date: new Date(date + 'T12:00:00'),
      start_time: parseTimeToDate(startTime),
      end_time: endTime ? parseTimeToDate(endTime) : null,
      total_spots: totalSpots,
      price_override: priceOverride,
    })),
  })

  return { success: `${dates.length} fechas agregadas correctamente.`, experienceId }
}
