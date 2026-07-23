"use client"

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface DestinationState {
  activeSlug: string
  setActiveSlug: (slug: string) => void
}

export const useDestinationStore = create<DestinationState>()(
  persist(
    (set) => ({
      activeSlug: 'cancun',
      setActiveSlug: (slug) => set({ activeSlug: slug }),
    }),
    {
      name: 'poortal-destination',
    }
  )
)
