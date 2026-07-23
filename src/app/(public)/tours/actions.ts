'use server'

import { searchExperiences } from '@/queries/experiences'
import type { ExperienceSearchResult } from '@/types'

export async function searchToursAction(params: {
  categoryId?: string
  availableDate?: string
}): Promise<ExperienceSearchResult[]> {
  return searchExperiences({
    categoryId: params.categoryId,
    availableDate: params.availableDate,
    sortBy: 'rating',
    pageSize: 20,
  })
}
