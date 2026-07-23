import Link from 'next/link'
import { Star, Clock } from 'lucide-react'
import type { CollectionWithExperiences } from '@/types'
import { ROUTES } from '@/lib/constants'

interface CollectionGridProps {
  collections: CollectionWithExperiences[]
}

export function CollectionGrid({ collections }: CollectionGridProps) {
  const activeCollections = collections.filter(
    (col) => col.is_active && col.collection_experiences.length > 0
  )

  if (activeCollections.length === 0) return null

  return (
    <section className="px-6 space-y-8">
      {activeCollections.map((collection) => (
        <CollectionSection key={collection.id} collection={collection} />
      ))}
    </section>
  )
}

function CollectionSection({ collection }: { collection: CollectionWithExperiences }) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">{collection.name}</h2>
      {collection.description && (
        <p className="text-sm text-muted-foreground -mt-1">{collection.description}</p>
      )}
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide">
        {collection.collection_experiences.map((ce) => (
          <ExperienceCard key={ce.id} experience={ce.experiences} />
        ))}
      </div>
    </div>
  )
}

type ExperienceSnippet = CollectionWithExperiences['collection_experiences'][number]['experiences']

function ExperienceCard({ experience }: { experience: ExperienceSnippet }) {
  const coverUrl = experience.experience_images?.find((img) => img.is_cover)?.url
    ?? experience.experience_images?.[0]?.url

  return (
    <Link
      href={`${ROUTES.experience}/${experience.id}`}
      className="shrink-0 w-44 rounded-xl overflow-hidden border bg-card hover:shadow-md transition-shadow"
    >
      <div className="relative h-28 bg-muted">
        {coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverUrl}
            alt={experience.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-primary/20 to-primary/5" />
        )}
      </div>
      <div className="p-2.5 space-y-1">
        <p className="text-xs font-medium leading-tight line-clamp-2">{experience.title}</p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-0.5">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            {experience.average_rating.toFixed(1)}
          </span>
          {experience.duration_minutes && (
            <span className="flex items-center gap-0.5">
              <Clock className="h-3 w-3" />
              {experience.duration_minutes}m
            </span>
          )}
        </div>
        <p className="text-xs font-semibold">
          {experience.price_currency} {experience.price_amount.toLocaleString('es-MX')}
        </p>
      </div>
    </Link>
  )
}
