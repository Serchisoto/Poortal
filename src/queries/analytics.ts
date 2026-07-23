import prisma from '@/lib/prisma'

const PLATFORM_FEE_RATE = 0.15

export type MonthlyBookingStat = {
  month: string // 'Ene', 'Feb', etc.
  year: number
  reservas: number
  ingresos: number // net after fee
}

export type ExperienceStat = {
  id: string
  title: string
  reservas: number
  ingresos: number // net
}

export type ReviewWithDetails = {
  id: string
  rating: number
  comment: string | null
  provider_response: string | null
  created_at: Date
  experience_title: string
  tourist_name: string | null
  tourist_email: string
}

export type RatingSummary = {
  average: number
  total: number
  distribution: Record<1 | 2 | 3 | 4 | 5, number>
  unresponded: number
}

const MONTH_LABELS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

export async function getMonthlyBookingStats(
  providerId: string,
  months = 6
): Promise<MonthlyBookingStat[]> {
  const now = new Date()
  const startDate = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1)

  const items = await prisma.booking_items.findMany({
    where: {
      provider_id: providerId,
      status: { in: ['confirmed', 'completed'] as any[] },
      created_at: { gte: startDate },
    },
    select: { subtotal: true, created_at: true },
    orderBy: { created_at: 'asc' },
  })

  const buckets = new Map<string, { reservas: number; bruto: number; month: number; year: number }>()

  // Pre-fill all months with zeros
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${d.getMonth()}`
    buckets.set(key, { reservas: 0, bruto: 0, month: d.getMonth(), year: d.getFullYear() })
  }

  for (const item of items) {
    const d = new Date(item.created_at)
    const key = `${d.getFullYear()}-${d.getMonth()}`
    const bucket = buckets.get(key)
    if (bucket) {
      bucket.reservas += 1
      bucket.bruto += Number(item.subtotal)
    }
  }

  return Array.from(buckets.values()).map(({ reservas, bruto, month, year }) => ({
    month: MONTH_LABELS[month],
    year,
    reservas,
    ingresos: bruto * (1 - PLATFORM_FEE_RATE),
  }))
}

export async function getExperienceStats(providerId: string): Promise<ExperienceStat[]> {
  const items = await prisma.booking_items.findMany({
    where: {
      provider_id: providerId,
      status: { in: ['confirmed', 'completed'] as any[] },
    },
    select: {
      subtotal: true,
      experience_id: true,
      experiences: { select: { id: true, title: true } },
    },
  })

  const map = new Map<string, { title: string; reservas: number; bruto: number }>()
  for (const item of items) {
    const expId = item.experience_id
    const title = item.experiences?.title ?? 'Experiencia'
    const existing = map.get(expId) ?? { title, reservas: 0, bruto: 0 }
    map.set(expId, {
      title,
      reservas: existing.reservas + 1,
      bruto: existing.bruto + Number(item.subtotal),
    })
  }

  return Array.from(map.entries())
    .map(([id, { title, reservas, bruto }]) => ({
      id,
      title,
      reservas,
      ingresos: bruto * (1 - PLATFORM_FEE_RATE),
    }))
    .sort((a, b) => b.reservas - a.reservas)
}

export async function getProviderReviews(
  providerId: string,
  limit = 20
): Promise<ReviewWithDetails[]> {
  const rows = await prisma.reviews.findMany({
    where: {
      is_visible: true,
      booking_items: { provider_id: providerId },
    },
    include: {
      experiences: { select: { title: true } },
      profiles: { select: { full_name: true, email: true } },
    },
    orderBy: { created_at: 'desc' },
    take: limit,
  })

  return rows.map((r) => ({
    id: r.id,
    rating: r.rating,
    comment: r.comment,
    provider_response: r.provider_response,
    created_at: r.created_at,
    experience_title: r.experiences.title,
    tourist_name: r.profiles.full_name,
    tourist_email: r.profiles.email,
  }))
}

export async function getProviderRatingSummary(providerId: string): Promise<RatingSummary> {
  const reviews = await prisma.reviews.findMany({
    where: {
      is_visible: true,
      booking_items: { provider_id: providerId },
    },
    select: { rating: true, provider_response: true },
  })

  const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  let total = 0
  let sum = 0
  let unresponded = 0

  for (const r of reviews) {
    total++
    sum += r.rating
    distribution[r.rating] = (distribution[r.rating] ?? 0) + 1
    if (!r.provider_response) unresponded++
  }

  return {
    average: total > 0 ? Math.round((sum / total) * 10) / 10 : 0,
    total,
    distribution: distribution as Record<1 | 2 | 3 | 4 | 5, number>,
    unresponded,
  }
}
