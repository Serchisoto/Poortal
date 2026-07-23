import prisma from '@/lib/prisma'
import type { Category, Subcategory } from '@/types'

export async function getCategories(): Promise<Category[]> {
  const rows = await prisma.categories.findMany({
    where: { is_active: true },
    orderBy: { sort_order: 'asc' },
  })
  return rows as unknown as Category[]
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const row = await prisma.categories.findFirst({
    where: { slug },
  })
  return row as unknown as Category | null
}

export async function getSubcategories(categoryId: string): Promise<Subcategory[]> {
  const rows = await prisma.subcategories.findMany({
    where: { category_id: categoryId, is_active: true },
    orderBy: { sort_order: 'asc' },
  })
  return rows as unknown as Subcategory[]
}
