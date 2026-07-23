import prisma from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import type { Experience, ExperienceSearchResult } from '@/types'

async function rpcSearch(params: {
  search_query?: string | null
  dest_id?: string | null
  cat_id?: string | null
  subcat_id?: string | null
  min_price?: number | null
  max_price?: number | null
  min_rating?: number | null
  available_date?: string | null
  sort_by?: string
  page_size?: number
  page_offset?: number
}): Promise<ExperienceSearchResult[]> {
  console.log('[Experiences] Fetching with params:', JSON.stringify(params, null, 2))

  const results = await prisma.$queryRaw<ExperienceSearchResult[]>(
    Prisma.sql`SELECT * FROM search_experiences(
      ${params.search_query ?? null}::text,
      ${params.dest_id ?? null}::uuid,
      ${params.cat_id ?? null}::uuid,
      ${params.subcat_id ?? null}::uuid,
      ${params.min_price ?? null}::numeric,
      ${params.max_price ?? null}::numeric,
      ${params.min_rating ?? null}::numeric,
      ${params.available_date ?? null}::date,
      ${params.sort_by ?? 'relevance'}::text,
      ${params.page_size ?? 20}::int,
      ${params.page_offset ?? 0}::int
    )`
  )

  return results ?? []
}

export async function searchExperiences(params: {
  searchQuery?: string
  destinationId?: string
  categoryId?: string
  subcategoryId?: string
  minPrice?: number
  maxPrice?: number
  minRating?: number
  availableDate?: string
  sortBy?: string
  pageSize?: number
  pageOffset?: number
}): Promise<ExperienceSearchResult[]> {
  return rpcSearch({
    search_query: params.searchQuery || null,
    dest_id: params.destinationId || null,
    cat_id: params.categoryId || null,
    subcat_id: params.subcategoryId || null,
    min_price: params.minPrice ?? null,
    max_price: params.maxPrice ?? null,
    min_rating: params.minRating ?? null,
    available_date: params.availableDate || null,
    sort_by: params.sortBy || 'relevance',
    page_size: params.pageSize || 20,
    page_offset: params.pageOffset || 0,
  })
}

export type ExperienceWithDetails = Experience & {
  provider_profiles: { id: string; business_name: string; user_id: string } | null
  destinations: { name: string; slug: string } | null
  categories: { name: string; slug: string; icon: string | null } | null
  subcategories: { name: string; slug: string } | null
  experience_images: Array<{ id: string; url: string; alt_text: string | null; sort_order: number; is_cover: boolean }>
}

export async function getExperienceById(id: string): Promise<ExperienceWithDetails | null> {
  const row = await prisma.experiences.findUnique({
    where: { id },
    include: {
      provider_profiles: { select: { id: true, business_name: true, user_id: true } },
      destinations: { select: { name: true, slug: true } },
      categories: { select: { name: true, slug: true, icon: true } },
      subcategories: { select: { name: true, slug: true } },
      experience_images: {
        select: { id: true, url: true, alt_text: true, sort_order: true, is_cover: true },
        orderBy: { sort_order: 'asc' },
      },
    },
  })
  return row as unknown as ExperienceWithDetails | null
}

export async function getExperienceAvailability(experienceId: string, fromDate?: string) {
  const today = fromDate || new Date().toISOString().split('T')[0]
  const rows = await prisma.experience_availability.findMany({
    where: {
      experience_id: experienceId,
      is_blocked: false,
      date: { gte: new Date(today) },
    },
    orderBy: { date: 'asc' },
  })
  return rows.map((r) => ({
    id: r.id,
    experience_id: r.experience_id,
    date: r.date.toISOString().split('T')[0],
    start_time: r.start_time?.toISOString() ?? '',
    end_time: r.end_time?.toISOString() ?? null,
    total_spots: r.total_spots,
    booked_spots: r.booked_spots,
    price_override: r.price_override ? Number(r.price_override) : null,
    is_blocked: r.is_blocked,
  }))
}

export async function getExperiencesByProvider(providerId: string): Promise<Experience[]> {
  const rows = await prisma.experiences.findMany({
    where: { provider_id: providerId },
    orderBy: { created_at: 'desc' },
  })
  return rows as unknown as Experience[]
}

export async function getExperiencesByDestination(
  destinationId: string,
  limit = 12
): Promise<ExperienceSearchResult[]> {
  return rpcSearch({ dest_id: destinationId, sort_by: 'rating', page_size: limit, page_offset: 0 })
}

export async function getExperiencesByCategory(
  categoryId: string,
  limit = 12
): Promise<ExperienceSearchResult[]> {
  return rpcSearch({ cat_id: categoryId, sort_by: 'rating', page_size: limit, page_offset: 0 })
}

export async function getDestinationRecommendations(
  destinationId: string
): Promise<ExperienceSearchResult[]> {
  const rows = await prisma.destination_recommendations.findMany({
    where: { destination_id: destinationId },
    include: {
      experiences: {
        select: {
          id: true,
          title: true,
          short_description: true,
          price_amount: true,
          price_currency: true,
          average_rating: true,
          review_count: true,
          category_id: true,
          destination_id: true,
          experience_images: { select: { url: true, is_cover: true } },
        },
      },
    },
    orderBy: { sort_order: 'asc' },
  })

  return rows.map((row) => {
    const exp = row.experiences
    if (!exp) return null
    return {
      id: exp.id,
      title: exp.title,
      short_description: exp.short_description ?? '',
      price_amount: Number(exp.price_amount),
      price_currency: exp.price_currency,
      average_rating: Number(exp.average_rating),
      review_count: exp.review_count,
      category_id: exp.category_id,
      destination_id: exp.destination_id,
      cover_image_url:
        exp.experience_images.find((img) => img.is_cover)?.url ??
        exp.experience_images[0]?.url ??
        null,
    } as unknown as ExperienceSearchResult
  }).filter(Boolean) as ExperienceSearchResult[]
}

export async function getFeaturedExperiencesByCategory(
  categoryId: string,
  limit = 10
): Promise<ExperienceSearchResult[]> {
  const rows = await prisma.experiences.findMany({
    where: { category_id: categoryId, status: 'active', is_featured: true },
    select: {
      id: true,
      title: true,
      short_description: true,
      price_amount: true,
      price_currency: true,
      average_rating: true,
      review_count: true,
      category_id: true,
      destination_id: true,
      experience_images: { select: { url: true, is_cover: true } },
    },
    take: limit,
  })

  return rows.map((exp) => ({
    id: exp.id,
    title: exp.title,
    short_description: exp.short_description ?? '',
    price_amount: Number(exp.price_amount) || 0,
    price_currency: exp.price_currency || 'MXN',
    average_rating: Number(exp.average_rating) || 0,
    review_count: exp.review_count || 0,
    category_id: exp.category_id,
    destination_id: exp.destination_id,
    cover_image_url:
      exp.experience_images.find((img) => img.is_cover)?.url ??
      exp.experience_images[0]?.url ??
      null,
  })) as unknown as ExperienceSearchResult[]
}
