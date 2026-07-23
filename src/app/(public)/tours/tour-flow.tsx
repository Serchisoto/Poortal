'use client'

import { useState } from 'react'
import type { Subcategory } from '@/types'
import { TourCategorySelect } from './tour-category-select'
import { TourBookingConfig } from './tour-booking-config'
import { TourLoading } from './tour-loading'
import { TourResults } from './tour-results'

type Step = 'categories' | 'config' | 'loading' | 'results'

export interface TourSearchConfig {
  subcategoryIds: string[]
  date: string
  people: number
}

interface TourFlowProps {
  subcategories: Subcategory[]
  categoryId: string | null
}

export function TourFlow({ subcategories, categoryId }: TourFlowProps) {
  const [step, setStep] = useState<Step>('categories')
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([])
  const [config, setConfig] = useState<TourSearchConfig | null>(null)

  function handleCategoriesContinue(ids: string[]) {
    setSelectedSubcategories(ids)
    setStep('config')
  }

  function handleConfigContinue(searchConfig: TourSearchConfig) {
    setConfig(searchConfig)
    setStep('loading')
  }

  function handleLoadingComplete() {
    setStep('results')
  }

  function handleBack() {
    if (step === 'config') setStep('categories')
    if (step === 'results') setStep('config')
  }

  return (
    <div className="min-h-screen">
      {step === 'categories' && (
        <TourCategorySelect
          subcategories={subcategories}
          onContinue={handleCategoriesContinue}
          initialSelected={selectedSubcategories}
        />
      )}
      {step === 'config' && (
        <TourBookingConfig
          selectedSubcategories={selectedSubcategories}
          onContinue={handleConfigContinue}
          onBack={handleBack}
        />
      )}
      {step === 'loading' && (
        <TourLoading onComplete={handleLoadingComplete} />
      )}
      {step === 'results' && config && (
        <TourResults
          config={config}
          categoryId={categoryId}
          onBack={handleBack}
        />
      )}
    </div>
  )
}
