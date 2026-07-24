'use server'

import { searchExperiences } from '@/queries/experiences'
import { getCategoryBySlug } from '@/queries/categories'
import type { ExperienceSearchResult } from '@/types'

export async function searchExperiencesAction(params: {
  q?: string
  category?: string
  sort?: string
}): Promise<ExperienceSearchResult[]> {
  let categoryId: string | undefined = undefined

  if (params.category) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(params.category)
    if (isUuid) {
      categoryId = params.category
    } else {
      const cat = await getCategoryBySlug(params.category)
      if (cat) categoryId = cat.id
    }
  }

  return searchExperiences({
    searchQuery: params.q,
    categoryId,
    sortBy: params.sort,
  })
}
