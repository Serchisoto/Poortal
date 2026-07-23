import { ExperienceCard } from './experience-card'
import type { ExperienceSearchResult } from '@/types'

interface ExperienceGridProps {
  experiences: ExperienceSearchResult[]
  emptyMessage?: string
}

export function ExperienceGrid({ experiences, emptyMessage }: ExperienceGridProps) {
  if (experiences.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
        <p className="text-sm text-muted-foreground">
          {emptyMessage || 'No se encontraron experiencias.'}
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {experiences.map((experience) => (
        <ExperienceCard key={experience.id} experience={experience} />
      ))}
    </div>
  )
}
