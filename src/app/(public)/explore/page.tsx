import { Suspense } from 'react'
import { searchExperiences } from '@/queries/experiences'
import { getCategories } from '@/queries/categories'
import { getCategoryBySlug } from '@/queries/categories'
import { ExploreClient } from './explore-client'

export const metadata = {
  title: 'Explorar Experiencias',
}

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const q = typeof params.q === 'string' ? params.q : ''
  const category = typeof params.category === 'string' ? params.category : ''
  const sort = typeof params.sort === 'string' ? params.sort : 'relevance'

  // Resolve category slug → id for initial server render
  let categoryId: string | undefined = undefined
  if (category) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(category)
    if (isUuid) {
      categoryId = category
    } else {
      const cat = await getCategoryBySlug(category)
      if (cat) categoryId = cat.id
    }
  }

  const [initialResults, categories] = await Promise.all([
    searchExperiences({ searchQuery: q || undefined, categoryId, sortBy: sort }),
    getCategories(),
  ])

  return (
    <Suspense>
      <ExploreClient
        categories={categories}
        initialResults={initialResults}
        initialQ={q}
        initialCategory={category}
        initialSort={sort}
      />
    </Suspense>
  )
}
