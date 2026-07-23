import prisma from '@/lib/prisma'
import type { CollectionWithExperiences, DestinationCollection } from '@/types'

const experienceSelect = {
  id: true,
  title: true,
  slug: true,
  short_description: true,
  price_amount: true,
  price_currency: true,
  average_rating: true,
  review_count: true,
  duration_minutes: true,
  experience_images: {
    select: { url: true, is_cover: true },
  },
}

export async function getDestinationCollections(
  destinationId: string
): Promise<CollectionWithExperiences[]> {
  const rows = await prisma.destination_collections.findMany({
    where: { destination_id: destinationId, is_active: true },
    include: {
      collection_experiences: {
        orderBy: { sort_order: 'asc' },
        include: { experiences: { select: experienceSelect } },
      },
    },
    orderBy: { sort_order: 'asc' },
  })
  return JSON.parse(JSON.stringify(rows)) as CollectionWithExperiences[]
}

export async function getCollectionById(
  collectionId: string
): Promise<CollectionWithExperiences | null> {
  const row = await prisma.destination_collections.findUnique({
    where: { id: collectionId },
    include: {
      collection_experiences: {
        orderBy: { sort_order: 'asc' },
        include: { experiences: { select: experienceSelect } },
      },
    },
  })
  return row ? (JSON.parse(JSON.stringify(row)) as CollectionWithExperiences) : null
}

export async function getCollectionsByDestinationAdmin(
  destinationId: string
): Promise<CollectionWithExperiences[]> {
  const rows = await prisma.destination_collections.findMany({
    where: { destination_id: destinationId },
    include: {
      collection_experiences: {
        orderBy: { sort_order: 'asc' },
        include: { experiences: { select: experienceSelect } },
      },
    },
    orderBy: { sort_order: 'asc' },
  })
  return JSON.parse(JSON.stringify(rows)) as CollectionWithExperiences[]
}

export async function getAllCollections(): Promise<DestinationCollection[]> {
  const rows = await prisma.destination_collections.findMany({
    orderBy: [{ destination_id: 'asc' }, { sort_order: 'asc' }],
  })
  return rows as unknown as DestinationCollection[]
}
