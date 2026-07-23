'use client'

import { useActionState, useEffect, useState, useTransition, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  addExperienceToCollectionAction,
  removeExperienceFromCollectionAction,
  type CollectionActionState,
} from '@/actions/collections'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Plus, Trash2, Star, Clock, Compass, Search } from 'lucide-react'
import type { CollectionWithExperiences } from '@/types'

interface CollectionDetailsProps {
  collection: CollectionWithExperiences
  destinationId: string
}

type ExperienceOption = {
  id: string
  title: string
  slug: string
  price_amount: number
  price_currency: string
  average_rating: number
  duration_minutes: number | null
  status?: string
  categories?: { id: string; name: string } | null
}

export function CollectionDetails({ collection, destinationId }: CollectionDetailsProps) {
  const experiences = collection.collection_experiences ?? []

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">{collection.name}</h2>
          {collection.description && (
            <p className="text-sm text-muted-foreground">{collection.description}</p>
          )}
        </div>
        <AddExperienceDialog
          collectionId={collection.id}
          destinationId={destinationId}
          existingIds={experiences.map((ce) => ce.experiences.id)}
        />
      </div>

      {experiences.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10 text-center">
            <Compass className="h-10 w-10 text-muted-foreground/50" />
            <p className="mt-3 text-sm text-muted-foreground">
              Esta coleccion no tiene experiencias. Agrega la primera.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {experiences.map((ce) => (
            <ExperienceItem
              key={ce.id}
              collectionId={collection.id}
              experience={ce.experiences}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function ExperienceItem({
  collectionId,
  experience,
}: {
  collectionId: string
  experience: ExperienceOption
}) {
  const router = useRouter()
  const [state, formAction, isPending] = useActionState<CollectionActionState, FormData>(
    removeExperienceFromCollectionAction,
    {}
  )

  useEffect(() => {
    if (state.success) router.refresh()
  }, [state.success]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Card>
      <CardHeader className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="min-w-0">
              <CardTitle className="text-sm font-medium truncate">{experience.title}</CardTitle>
              <CardDescription className="flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  {experience.average_rating != null ? Number(experience.average_rating).toFixed(1) : 'N/A'}
                </span>
                {experience.duration_minutes && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {experience.duration_minutes} min
                  </span>
                )}
                <span className="font-medium text-foreground">
                  {experience.price_currency} {experience.price_amount.toLocaleString()}
                </span>
              </CardDescription>
            </div>
          </div>
          <form action={formAction} className="shrink-0">
            <input type="hidden" name="collection_id" value={collectionId} />
            <input type="hidden" name="experience_id" value={experience.id} />
            <Button
              type="submit"
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-destructive hover:text-destructive"
              disabled={isPending}
              onClick={(e) => {
                if (!confirm(`¿Quitar "${experience.title}" de esta coleccion?`)) {
                  e.preventDefault()
                }
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </form>
        </div>
        {state.error && <p className="text-xs text-destructive mt-1">{state.error}</p>}
      </CardHeader>
    </Card>
  )
}

function AddExperienceDialog({
  collectionId,
  destinationId,
  existingIds,
}: {
  collectionId: string
  destinationId: string
  existingIds: string[]
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [allExperiences, setAllExperiences] = useState<ExperienceOption[]>([])
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [isLoading, startTransition] = useTransition()
  const router = useRouter()
  const [addState, addAction, isAdding] = useActionState<CollectionActionState, FormData>(
    addExperienceToCollectionAction,
    {}
  )

  useEffect(() => {
    if (addState.success) router.refresh()
  }, [addState.success]) // eslint-disable-line react-hooks/exhaustive-deps

  // Load all experiences when dialog opens
  useEffect(() => {
    if (!open) return
    setSearch('')
    setSelectedCategory(null)
    setFetchError(null)
    startTransition(async () => {
      try {
        const res = await fetch(
          `/api/admin/experiences/search?destination_id=${destinationId}`
        )
        const data = await res.json()
        if (!res.ok) {
          setFetchError(`Error ${res.status}: ${data?.error ?? 'desconocido'}`)
          return
        }
        setAllExperiences(data)
      } catch (e) {
        setFetchError(`Error de red: ${e instanceof Error ? e.message : 'desconocido'}`)
      }
    })
  }, [open, destinationId])

  // Derive categories from loaded experiences
  const categories = useMemo(() => {
    const seen = new Map<string, string>()
    for (const exp of allExperiences) {
      if (exp.categories && !seen.has(exp.categories.id)) {
        seen.set(exp.categories.id, exp.categories.name)
      }
    }
    return Array.from(seen.entries()).map(([id, name]) => ({ id, name }))
  }, [allExperiences])

  // Filter client-side
  const filtered = useMemo(() => {
    const existingSet = new Set(existingIds)
    return allExperiences.filter((exp) => {
      if (existingSet.has(exp.id)) return false
      const matchesSearch = search.length < 2 || exp.title.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = !selectedCategory || exp.categories?.id === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [allExperiences, existingIds, search, selectedCategory])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Agregar experiencia
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Agregar experiencia a la coleccion</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filtrar por nombre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Category chips */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setSelectedCategory(null)}
                className={`rounded-full px-3 py-0.5 text-xs font-medium border transition-colors ${!selectedCategory
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'
                  }`}
              >
                Todas
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id === selectedCategory ? null : cat.id)}
                  className={`rounded-full px-3 py-0.5 text-xs font-medium border transition-colors ${selectedCategory === cat.id
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'
                    }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}

          {/* Results */}
          {isLoading ? (
            <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
              Cargando experiencias...
            </div>
          ) : fetchError ? (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {fetchError}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Compass className="h-8 w-8 text-muted-foreground/40" />
              <p className="mt-2 text-sm text-muted-foreground">No hay experiencias disponibles.</p>
            </div>
          ) : (
            <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
              {filtered.map((exp) => (
                <form key={exp.id} action={addAction}>
                  <input type="hidden" name="collection_id" value={collectionId} />
                  <input type="hidden" name="experience_id" value={exp.id} />
                  <div className="flex items-center gap-3 rounded-lg border p-2.5 hover:bg-muted/50 transition-colors">
                    {/* Thumbnail placeholder */}
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md bg-muted flex items-center justify-center">
                      <Compass className="h-5 w-5 text-muted-foreground/40" />
                    </div>
                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className="text-sm font-medium leading-tight truncate">{exp.title}</p>
                        {exp.status !== 'active' && (
                          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-muted text-muted-foreground shrink-0">
                            {exp.status}
                          </span>
                        )}
                      </div>
                      {exp.categories && (
                        <p className="text-xs text-muted-foreground mt-0.5">{exp.categories.name}</p>
                      )}
                      <div className="flex items-center gap-2.5 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-0.5">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {exp.average_rating != null ? Number(exp.average_rating).toFixed(1) : 'N/A'}
                        </span>
                        {exp.duration_minutes && (
                          <span className="flex items-center gap-0.5">
                            <Clock className="h-3 w-3" />
                            {exp.duration_minutes} min
                          </span>
                        )}
                        <span className="font-medium text-foreground">
                          {exp.price_currency} {exp.price_amount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    {/* Add button */}
                    <Button type="submit" size="sm" variant="outline" disabled={isAdding} className="shrink-0">
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </form>
              ))}
            </div>
          )}

          {addState.error && <p className="text-sm text-destructive">{addState.error}</p>}
          {addState.success && <p className="text-sm text-green-600">{addState.success}</p>}
        </div>
      </DialogContent>
    </Dialog>
  )
}
