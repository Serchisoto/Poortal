'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, CalendarDays, Users, Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { TourSearchConfig } from './tour-flow'

interface TourBookingConfigProps {
  selectedSubcategories: string[]
  onContinue: (config: TourSearchConfig) => void
  onBack: () => void
}

export function TourBookingConfig({
  selectedSubcategories,
  onContinue,
  onBack,
}: TourBookingConfigProps) {
  const [date, setDate] = useState('')
  const [people, setPeople] = useState(2)

  const today = new Date().toISOString().split('T')[0]

  function handleContinue() {
    onContinue({
      subcategoryIds: selectedSubcategories,
      date,
      people,
    })
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4">
        <button
          onClick={onBack}
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
        <div className="mb-8">
          <p className="text-sm font-semibold text-primary">Poortal:</p>
          <h2 className="text-lg font-semibold text-foreground">
            When and how many?
          </h2>
        </div>

        {/* Date picker */}
        <div className="mb-6">
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            Date
          </label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={today}
            className="rounded-xl py-6 text-base"
          />
        </div>

        {/* People counter */}
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Users className="h-4 w-4" />
            People
          </label>
          <div className="flex items-center gap-4 rounded-xl border p-4">
            <button
              onClick={() => setPeople(Math.max(1, people - 1))}
              className="flex h-10 w-10 items-center justify-center rounded-full border hover:bg-muted"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="flex-1 text-center text-2xl font-semibold">
              {people}
            </span>
            <button
              onClick={() => setPeople(Math.min(20, people + 1))}
              className="flex h-10 w-10 items-center justify-center rounded-full border hover:bg-muted"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="fixed inset-x-0 bottom-20 px-6 pb-4 md:bottom-4">
        <Button
          onClick={handleContinue}
          disabled={!date}
          className="w-full rounded-full bg-primary text-primary-foreground py-6 text-base font-semibold"
          size="lg"
        >
          Find tours
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
