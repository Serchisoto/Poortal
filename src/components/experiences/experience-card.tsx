import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, Clock, MapPin } from 'lucide-react'
import { ROUTES } from '@/lib/constants'
import type { ExperienceSearchResult } from '@/types'

interface ExperienceCardProps {
  experience: ExperienceSearchResult
}

export function ExperienceCard({ experience }: ExperienceCardProps) {
  const formattedPrice = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: experience.price_currency || 'MXN',
    minimumFractionDigits: 0,
  }).format(Number(experience.price_amount))

  const pricingLabel =
    experience.pricing_type === 'per_person'
      ? '/ persona'
      : experience.pricing_type === 'per_group'
        ? '/ grupo'
        : ''

  return (
    <Link href={ROUTES.experience(experience.id)}>
      <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
        <div className="relative aspect-[4/3] overflow-hidden">
          {experience.cover_image_url ? (
            <Image
              src={experience.cover_image_url}
              alt={experience.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <MapPin className="h-8 w-8 text-muted-foreground/50" />
            </div>
          )}
          {experience.category_name && (
            <Badge className="absolute top-2 left-2" variant="secondary">
              {experience.category_name}
            </Badge>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="line-clamp-1 font-semibold">{experience.title}</h3>
          {experience.short_description && (
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
              {experience.short_description}
            </p>
          )}
          <div className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
            {experience.average_rating > 0 && (
              <span className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                {Number(experience.average_rating).toFixed(1)}
                <span className="text-xs">({experience.review_count})</span>
              </span>
            )}
            {experience.duration_minutes && (
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {experience.duration_minutes >= 60
                  ? `${Math.floor(experience.duration_minutes / 60)}h${experience.duration_minutes % 60 > 0 ? ` ${experience.duration_minutes % 60}m` : ''}`
                  : `${experience.duration_minutes}m`}
              </span>
            )}
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div>
              <span className="text-lg font-bold text-primary">{formattedPrice}</span>
              {pricingLabel && (
                <span className="text-xs text-muted-foreground"> {pricingLabel}</span>
              )}
            </div>
            {experience.provider_name && (
              <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                {experience.provider_name}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
