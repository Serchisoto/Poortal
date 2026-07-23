'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, Star, Clock, MapPin } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ROUTES } from '@/lib/constants'
import type { TourSearchConfig } from './tour-flow'
import type { ExperienceSearchResult } from '@/types'
import { searchToursAction } from './actions'

interface TourResultsProps {
  config: TourSearchConfig
  categoryId: string | null
  onBack: () => void
}

export function TourResults({ config, categoryId, onBack }: TourResultsProps) {
  const [results, setResults] = useState<ExperienceSearchResult[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchResults() {
      try {
        const data = await searchToursAction({
          categoryId: categoryId ?? undefined,
          availableDate: config.date,
        })
        setResults(data)
      } finally {
        setLoading(false)
      }
    }
    fetchResults()
  }, [config, categoryId])

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

      {/* Results */}
      <div className="flex-1 px-4 pb-24">
        <div className="mb-4">
          <p className="text-sm font-semibold text-primary">Poortal:</p>
          <h2 className="text-lg font-semibold text-foreground">
            Here&apos;s what I found for you
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {loading ? 'Searching...' : `${results.length} tours available`}
            {config.date && ` for ${new Date(config.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
            {config.people > 0 && ` · ${config.people} ${config.people === 1 ? 'person' : 'people'}`}
          </p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <MapPin className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">
              No tours found for this date. Try a different date or categories.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((tour) => (
              <TourResultCard key={tour.id} tour={tour} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function TourResultCard({ tour }: { tour: ExperienceSearchResult }) {
  const formattedPrice = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: tour.price_currency || 'MXN',
    minimumFractionDigits: 0,
  }).format(Number(tour.price_amount))

  const pricingLabel =
    tour.pricing_type === 'per_person'
      ? '/ persona'
      : tour.pricing_type === 'per_group'
        ? '/ grupo'
        : ''

  return (
    <Link href={ROUTES.tourDetail(tour.id)}>
      <Card className="overflow-hidden transition-shadow hover:shadow-md">
        <div className="flex">
          {/* Image */}
          <div className="relative h-32 w-32 shrink-0">
            {tour.cover_image_url ? (
              <Image
                src={tour.cover_image_url}
                alt={tour.title}
                fill
                className="object-cover"
                sizes="128px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted">
                <MapPin className="h-6 w-6 text-muted-foreground/50" />
              </div>
            )}
          </div>

          {/* Info */}
          <CardContent className="flex-1 p-3">
            <h3 className="line-clamp-1 text-sm font-semibold">{tour.title}</h3>
            {tour.short_description && (
              <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                {tour.short_description}
              </p>
            )}
            <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
              {tour.average_rating > 0 && (
                <span className="flex items-center gap-0.5">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  {Number(tour.average_rating).toFixed(1)}
                </span>
              )}
              {tour.duration_minutes && (
                <span className="flex items-center gap-0.5">
                  <Clock className="h-3 w-3" />
                  {tour.duration_minutes >= 60
                    ? `${Math.floor(tour.duration_minutes / 60)}h`
                    : `${tour.duration_minutes}m`}
                </span>
              )}
              {tour.category_name && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  {tour.category_name}
                </Badge>
              )}
            </div>
            <div className="mt-2">
              <span className="text-sm font-bold text-primary">{formattedPrice}</span>
              {pricingLabel && (
                <span className="text-[10px] text-muted-foreground"> {pricingLabel}</span>
              )}
            </div>
          </CardContent>
        </div>
      </Card>
    </Link>
  )
}
