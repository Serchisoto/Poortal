'use client'

import { useState, useEffect, useCallback, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, SlidersHorizontal, X, Star, Clock, MapPin } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { searchExperiencesAction } from '@/actions/search'
import { ROUTES } from '@/lib/constants'
import type { Category, ExperienceSearchResult } from '@/types'
import { cn } from '@/lib/utils'

interface ExploreClientProps {
  categories: Category[]
  initialResults: ExperienceSearchResult[]
  initialQ: string
  initialCategory: string
  initialSort: string
}

const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevancia' },
  { value: 'price_asc', label: 'Menor precio' },
  { value: 'price_desc', label: 'Mayor precio' },
  { value: 'rating', label: 'Mejor calificados' },
  { value: 'newest', label: 'Recientes' },
]

export function ExploreClient({
  categories,
  initialResults,
  initialQ,
  initialCategory,
  initialSort,
}: ExploreClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [query, setQuery] = useState(initialQ)
  const [activeCategory, setActiveCategory] = useState(initialCategory)
  const [activeSort, setActiveSort] = useState(initialSort || 'relevance')
  const [results, setResults] = useState<ExperienceSearchResult[]>(initialResults)
  const [isPending, startTransition] = useTransition()
  const [showSort, setShowSort] = useState(false)

  // Sync URL params → local state when navigating
  useEffect(() => {
    setQuery(searchParams.get('q') || '')
    setActiveCategory(searchParams.get('category') || '')
    setActiveSort(searchParams.get('sort') || 'relevance')
  }, [searchParams])

  const runSearch = useCallback((q: string, category: string, sort: string) => {
    startTransition(async () => {
      const res = await searchExperiencesAction({ q: q || undefined, category: category || undefined, sort })
      setResults(res)
    })
  }, [])

  // Debounced live search as user types
  useEffect(() => {
    const timer = setTimeout(() => {
      runSearch(query, activeCategory, activeSort)
      // Update URL without pushing a new history entry so back works naturally
      const params = new URLSearchParams()
      if (query.trim()) params.set('q', query.trim())
      if (activeCategory) params.set('category', activeCategory)
      if (activeSort && activeSort !== 'relevance') params.set('sort', activeSort)
      const qs = params.toString()
      router.replace(`/explore${qs ? `?${qs}` : ''}`, { scroll: false })
    }, 300)
    return () => clearTimeout(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, activeCategory, activeSort])

  function handleCategorySelect(slug: string) {
    setActiveCategory(prev => prev === slug ? '' : slug)
  }

  function handleSortSelect(value: string) {
    setActiveSort(value)
    setShowSort(false)
  }

  function clearQuery() {
    setQuery('')
  }

  const activeSortLabel = SORT_OPTIONS.find(o => o.value === activeSort)?.label ?? 'Relevancia'

  return (
    <div className="flex flex-col min-h-[calc(100vh-3.5rem)] bg-background">

      {/* Sticky search header */}
      <div className="sticky top-14 z-20 bg-background/98 backdrop-blur-sm border-b border-border/50 px-4 pt-3 pb-3 flex flex-col gap-3">

        {/* Search input */}
        <div className="relative flex items-center h-11 bg-secondary rounded-2xl border border-border/50">
          <Search className="absolute left-3.5 h-4 w-4 text-muted-foreground/60 pointer-events-none shrink-0" />
          <Input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar experiencias..."
            className="h-full border-0 shadow-none bg-transparent pl-10 pr-9 text-sm focus-visible:ring-0"
          />
          {query && (
            <button
              type="button"
              onClick={clearQuery}
              className="absolute right-3 text-muted-foreground/50 hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Category pills — horizontal scroll */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-1 px-1 pb-0.5">
          <button
            onClick={() => setActiveCategory('')}
            className={cn(
              'shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors border',
              !activeCategory
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background text-muted-foreground border-border hover:border-primary/40'
            )}
          >
            Todos
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.slug)}
              className={cn(
                'shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors border whitespace-nowrap',
                activeCategory === cat.slug
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background text-muted-foreground border-border hover:border-primary/40'
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Results toolbar */}
      <div className="flex items-center justify-between px-4 pt-3 pb-1">
        <p className="text-xs text-muted-foreground">
          {isPending ? 'Buscando...' : `${results.length} ${results.length === 1 ? 'resultado' : 'resultados'}`}
        </p>

        {/* Sort button */}
        <div className="relative">
          <button
            onClick={() => setShowSort(v => !v)}
            className="flex items-center gap-1.5 text-xs font-semibold text-foreground/70 hover:text-primary transition-colors"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            {activeSortLabel}
          </button>
          {showSort && (
            <div className="absolute right-0 top-6 z-30 bg-background border border-border rounded-xl shadow-xl overflow-hidden min-w-[160px]">
              {SORT_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => handleSortSelect(opt.value)}
                  className={cn(
                    'w-full text-left px-4 py-2.5 text-xs font-semibold transition-colors',
                    activeSort === opt.value
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-secondary text-foreground/70'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Results grid */}
      <div className="flex-1 px-4 pb-24">
        {isPending ? (
          <div className="grid grid-cols-2 gap-3 pt-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-secondary animate-pulse aspect-[3/4]" />
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
            <Search className="h-10 w-10 text-muted-foreground/30" />
            <p className="text-sm font-semibold text-muted-foreground">
              {query ? `Sin resultados para "${query}"` : 'No hay experiencias disponibles'}
            </p>
            {query && (
              <button onClick={clearQuery} className="text-xs text-primary underline underline-offset-2">
                Limpiar busqueda
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 pt-2">
            {results.map(exp => (
              <ExperienceResultCard key={exp.id} experience={exp} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ExperienceResultCard({ experience }: { experience: ExperienceSearchResult }) {
  const formattedPrice = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: experience.price_currency || 'MXN',
    minimumFractionDigits: 0,
  }).format(Number(experience.price_amount))

  return (
    <Link href={ROUTES.experience(experience.id)} className="group flex flex-col rounded-2xl overflow-hidden border border-border/60 bg-card active:scale-[0.98] transition-transform">
      {/* Image */}
      <div className="relative aspect-[4/3] bg-muted overflow-hidden">
        {experience.cover_image_url ? (
          <Image
            src={experience.cover_image_url}
            alt={experience.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <MapPin className="h-6 w-6 text-muted-foreground/30" />
          </div>
        )}
        {/* Category badge */}
        {experience.category_name && (
          <span className="absolute top-2 left-2 bg-background/90 backdrop-blur-sm text-foreground text-[10px] font-semibold px-2 py-0.5 rounded-full">
            {experience.category_name}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1 p-2.5">
        <p className="text-xs font-semibold text-foreground line-clamp-2 leading-snug">
          {experience.title}
        </p>

        <div className="flex items-center gap-2 mt-0.5">
          {experience.average_rating > 0 && (
            <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              {Number(experience.average_rating).toFixed(1)}
            </span>
          )}
          {experience.duration_minutes && (
            <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
              <Clock className="h-3 w-3" />
              {experience.duration_minutes >= 60
                ? `${Math.floor(experience.duration_minutes / 60)}h`
                : `${experience.duration_minutes}m`}
            </span>
          )}
        </div>

        <p className="text-sm font-bold text-primary mt-0.5">{formattedPrice}</p>
      </div>
    </Link>
  )
}
