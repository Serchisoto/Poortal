import { Suspense } from 'react'
import { searchExperiences } from '@/queries/experiences'
import { getCategories } from '@/queries/categories'
import { SearchBar } from '@/components/search/search-bar'
import { ExperienceGrid } from '@/components/experiences/experience-grid'
import { ExploreFilters } from './explore-filters'

export const metadata = {
  title: 'Explorar Experiencias',
}

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const q = typeof params.q === 'string' ? params.q : undefined
  const category = typeof params.category === 'string' ? params.category : undefined
  const minPrice = typeof params.minPrice === 'string' ? Number(params.minPrice) : undefined
  const maxPrice = typeof params.maxPrice === 'string' ? Number(params.maxPrice) : undefined
  const rating = typeof params.rating === 'string' ? Number(params.rating) : undefined
  const sort = typeof params.sort === 'string' ? params.sort : undefined
  const date = typeof params.date === 'string' ? params.date : undefined

  /* 
   * If category is a slug, resolve it to an ID first.
   * The RPC expects a UUID, but the URL param uses slugs.
   */
  let categoryId: string | undefined = undefined
  if (category) {
    // Check if it looks like a UUID (simple check)
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(category)
    if (isUuid) {
      categoryId = category
    } else {
      // It's a slug, fetch the category
      const { getCategoryBySlug } = await import('@/queries/categories')
      const cat = await getCategoryBySlug(category)
      if (cat) {
        categoryId = cat.id
        console.log(`[Explore] Resolved category slug "${category}" to ID "${cat.id}"`)
      } else {
        console.warn(`[Explore] Could not resolve category slug "${category}"`)
      }
    }
  }

  const [experiences, categories] = await Promise.all([
    searchExperiences({
      searchQuery: q,
      categoryId: categoryId,
      minPrice,
      maxPrice,
      minRating: rating,
      sortBy: sort,
      availableDate: date,
    }),
    getCategories(),
  ])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold">Explorar Experiencias</h1>
          <p className="mt-1 text-muted-foreground">
            Descubre las mejores actividades y servicios en Cancun
          </p>
        </div>

        <SearchBar defaultValue={q} placeholder="Que quieres hacer en Cancun?" />

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Sidebar filters */}
          <aside className="w-full shrink-0 lg:w-64">
            <Suspense>
              <ExploreFilters categories={categories} />
            </Suspense>
          </aside>

          {/* Results */}
          <div className="flex-1">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {experiences.length} {experiences.length === 1 ? 'experiencia encontrada' : 'experiencias encontradas'}
              </p>
            </div>

            <ExperienceGrid
              experiences={experiences}
              emptyMessage={
                q
                  ? `No se encontraron resultados para "${q}". Intenta con otros terminos.`
                  : 'No hay experiencias disponibles todavia. Los proveedores publicaran pronto.'
              }
            />
          </div>
        </div>
      </div>
    </div>
  )
}
