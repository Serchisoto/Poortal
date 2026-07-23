'use client'

import { FilterPanel } from '@/components/search/filter-panel'
import type { Category } from '@/types'

interface ExploreFiltersProps {
  categories: Category[]
}

export function ExploreFilters({ categories }: ExploreFiltersProps) {
  return <FilterPanel categories={categories} />
}
