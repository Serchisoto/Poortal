import prisma from '@/lib/prisma'
import type { Destination, Category } from '@/types'

export async function getDestinations(): Promise<Destination[]> {
  const rows = await prisma.destinations.findMany({
    where: { is_active: true },
    orderBy: { name: 'asc' },
  })
  return rows as unknown as Destination[]
}

export async function getDestinationBySlug(slug: string): Promise<Destination | null> {
  const row = await prisma.destinations.findFirst({
    where: { slug, is_active: true },
  })
  return row as unknown as Destination | null
}

export async function getDestinationCategories(destinationId: string): Promise<Category[]> {
  const rows = await prisma.destination_categories.findMany({
    where: { destination_id: destinationId },
    include: { categories: true },
  })
  return rows.map((dc) => dc.categories).filter(Boolean) as unknown as Category[]
}
