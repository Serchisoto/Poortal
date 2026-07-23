"use client"

import { create } from 'zustand'

interface FilterState {
  searchQuery: string
  categorySlug: string | null
  subcategorySlug: string | null
  destinationSlug: string | null
  minPrice: number | null
  maxPrice: number | null
  minRating: number | null
  sortBy: 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'newest'
  date: string | null
  setSearchQuery: (query: string) => void
  setCategory: (slug: string | null) => void
  setSubcategory: (slug: string | null) => void
  setDestination: (slug: string | null) => void
  setPriceRange: (min: number | null, max: number | null) => void
  setMinRating: (rating: number | null) => void
  setSortBy: (sort: FilterState['sortBy']) => void
  setDate: (date: string | null) => void
  resetFilters: () => void
}

const initialState = {
  searchQuery: '',
  categorySlug: null,
  subcategorySlug: null,
  destinationSlug: null,
  minPrice: null,
  maxPrice: null,
  minRating: null,
  sortBy: 'relevance' as const,
  date: null,
}

export const useFilterStore = create<FilterState>()((set) => ({
  ...initialState,
  setSearchQuery: (query) => set({ searchQuery: query }),
  setCategory: (slug) => set({ categorySlug: slug, subcategorySlug: null }),
  setSubcategory: (slug) => set({ subcategorySlug: slug }),
  setDestination: (slug) => set({ destinationSlug: slug }),
  setPriceRange: (min, max) => set({ minPrice: min, maxPrice: max }),
  setMinRating: (rating) => set({ minRating: rating }),
  setSortBy: (sort) => set({ sortBy: sort }),
  setDate: (date) => set({ date }),
  resetFilters: () => set(initialState),
}))
