import { getSubcategories, getCategoryBySlug } from '@/queries/categories'
import { TourFlow } from './tour-flow'

export const metadata = {
  title: 'Tours - POORTAL',
}

export default async function ToursPage() {
  const category = await getCategoryBySlug('tours')
  const subcategories = category ? await getSubcategories(category.id) : []

  return <TourFlow subcategories={subcategories} categoryId={category?.id ?? null} />
}
