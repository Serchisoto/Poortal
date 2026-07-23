import Link from 'next/link'
import Image from 'next/image'
import { Star, MapPin } from 'lucide-react'
import { ROUTES } from '@/lib/constants'
import { cn } from '@/lib/utils'
import type { ExperienceSearchResult } from '@/types'

interface ExperienceCardCompactProps {
  experience: ExperienceSearchResult
  className?: string
}

export function ExperienceCardCompact({ experience, className }: ExperienceCardCompactProps) {
  const formattedPrice = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: experience.price_currency || 'MXN',
    minimumFractionDigits: 0,
  }).format(Number(experience.price_amount))

  return (
    <Link
      href={ROUTES.experience(experience.id)}
      className={cn("block w-[164px] shrink-0", className)}
    >
      <div className="relative aspect-square overflow-hidden rounded-xl">
        {experience.cover_image_url ? (
          <Image
            src={experience.cover_image_url}
            alt={experience.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 164px, 300px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <MapPin className="h-6 w-6 text-muted-foreground/50" />
          </div>
        )}
      </div>
      <div className="mt-2 space-y-1">
        <h3 className="line-clamp-2 text-sm font-medium leading-tight">
          {experience.title}
        </h3>
        <div className="flex items-center gap-2">
          {experience.average_rating > 0 && (
            <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              {Number(experience.average_rating).toFixed(1)}
            </span>
          )}
          <span className="text-sm font-semibold text-primary">
            {formattedPrice}
          </span>
        </div>
      </div>
    </Link>
  )
}
