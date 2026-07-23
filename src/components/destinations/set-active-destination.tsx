'use client'

import { useEffect } from 'react'
import { useDestinationStore } from '@/stores/destination-store'

export function SetActiveDestination({ slug }: { slug: string }) {
  const setActiveSlug = useDestinationStore((s) => s.setActiveSlug)
  useEffect(() => {
    setActiveSlug(slug)
  }, [slug, setActiveSlug])
  return null
}
