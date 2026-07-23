'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DynamicIcon } from '@/lib/lucide-icon-map'
import { cn } from '@/lib/utils'
import type { Subcategory } from '@/types'

// Fallback subcategories if none come from the DB
const FALLBACK_SUBCATEGORIES = [
  { id: 'adventure', name: 'Adventure', icon: 'Compass' },
  { id: 'culture', name: 'Culture', icon: 'Landmark' },
  { id: 'relax', name: 'Relax', icon: 'Heart' },
  { id: 'extreme', name: 'Extreme', icon: 'Dumbbell' },
  { id: 'discovery', name: 'Discovery', icon: 'MapPin' },
  { id: 'personal-growth', name: 'Personal Growth', icon: 'Sparkles' },
]

interface TourCategorySelectProps {
  subcategories: Subcategory[]
  onContinue: (selectedIds: string[]) => void
  initialSelected: string[]
}

export function TourCategorySelect({
  subcategories,
  onContinue,
  initialSelected,
}: TourCategorySelectProps) {
  const router = useRouter()
  const [selected, setSelected] = useState<string[]>(initialSelected)

  const items = subcategories.length > 0
    ? subcategories.map((s) => ({ id: s.id, name: s.name, icon: s.description ?? null }))
    : FALLBACK_SUBCATEGORIES.map((s) => ({ id: s.id, name: s.name, icon: s.icon }))

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4">
        <button
          onClick={() => router.back()}
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex-1 flex justify-center">
          <span className="rounded-full border bg-background px-6 py-1.5 text-sm font-semibold tracking-wide">
            TOURS
          </span>
        </div>
        <div className="w-8" />
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pt-4 pb-32">
        <div className="mb-6">
          <p className="text-sm font-semibold text-primary">Poortal:</p>
          <h2 className="text-lg font-semibold text-foreground">
            What are you looking for?
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {items.map((item) => {
            const isSelected = selected.includes(item.id)
            return (
              <button
                key={item.id}
                onClick={() => toggle(item.id)}
                className={cn(
                  'relative flex flex-col items-center gap-2 rounded-xl border-2 p-5 transition-all',
                  isSelected
                    ? 'border-accent bg-accent/5'
                    : 'border-border bg-background hover:border-muted-foreground/30'
                )}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                    <Check className="h-3 w-3 text-primary-foreground" />
                  </div>
                )}
                <div className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-lg',
                  isSelected ? 'text-accent' : 'text-muted-foreground'
                )}>
                  <DynamicIcon name={item.icon} className="h-7 w-7" />
                </div>
                <span className={cn(
                  'text-sm font-medium',
                  isSelected ? 'text-foreground' : 'text-muted-foreground'
                )}>
                  {item.name}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Continue Button */}
      <div className="fixed inset-x-0 bottom-20 px-6 pb-4 md:bottom-4">
        <Button
          onClick={() => onContinue(selected)}
          disabled={selected.length === 0}
          className="w-full rounded-full bg-primary text-primary-foreground py-6 text-base font-semibold"
          size="lg"
        >
          continue
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
