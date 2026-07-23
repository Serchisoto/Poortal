import prisma from '@/lib/prisma'

export type DestinationInfoCategory = {
  id: string
  destination_id: string
  slug: string
  title: string
  icon: string
  color: string
  subtitle: string
  sort_order: number
}

export type DestinationInfoItem = {
  id: string
  category_id: string
  title: string
  description: string[]
  author: string | null
  date: string | null
  images_count: number | null
  actions: Record<string, boolean>
  sort_order: number
}

export async function getDestinationInfoCategories(destinationId: string): Promise<DestinationInfoCategory[]> {
  const rows = await prisma.destination_info_categories.findMany({
    where: { destination_id: destinationId },
    orderBy: { sort_order: 'asc' },
  })
  return rows as unknown as DestinationInfoCategory[]
}

export async function getDestinationInfoCategory(
  destinationId: string,
  slug: string
): Promise<DestinationInfoCategory | null> {
  const row = await prisma.destination_info_categories.findFirst({
    where: { destination_id: destinationId, slug },
  })
  return row as unknown as DestinationInfoCategory | null
}

export async function getDestinationInfoItems(categoryId: string): Promise<DestinationInfoItem[]> {
  const rows = await prisma.destination_info_items.findMany({
    where: { category_id: categoryId },
    orderBy: { sort_order: 'asc' },
  })
  return rows as unknown as DestinationInfoItem[]
}
