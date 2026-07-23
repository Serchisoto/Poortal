'use client'

import { useState, useActionState } from 'react'
import { approveExperienceAction, rejectExperienceAction, type AdminActionState } from '@/actions/admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Image from 'next/image'
import {
  Compass,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  Users,
  MapPin,
  Phone,
  User,
  Building2,
  DollarSign,
  ImageOff,
} from 'lucide-react'

type ExperienceRow = {
  id: string
  title: string
  slug: string
  status: string
  price_amount: number
  price_currency: string
  pricing_type: string
  duration_minutes: number | null
  max_capacity: number
  min_capacity: number
  cancellation_policy: string
  short_description: string | null
  description: string
  meeting_point: string | null
  rejection_reason: string | null
  created_at: string
  provider_profiles: {
    business_name: string
    representative_name: string
    phone: string
    location: string
    status: string
  } | null
  categories: { name: string } | null
  destinations: { name: string } | null
  experience_images: { url: string; alt_text: string | null; is_cover: boolean; sort_order: number }[]
}

interface ExperienceModerationProps {
  experiences: ExperienceRow[]
  showActions?: boolean
  emptyMessage?: string
}

const statusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  draft: { label: 'Borrador', variant: 'outline' },
  pending_review: { label: 'En revision', variant: 'secondary' },
  active: { label: 'Activa', variant: 'default' },
  paused: { label: 'Pausada', variant: 'outline' },
  rejected: { label: 'Rechazada', variant: 'destructive' },
  archived: { label: 'Archivada', variant: 'outline' },
}

const providerStatusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending_review: { label: 'En revision', variant: 'secondary' },
  approved_incomplete: { label: 'Incompleto', variant: 'outline' },
  active: { label: 'Activo', variant: 'default' },
  suspended: { label: 'Suspendido', variant: 'destructive' },
  rejected: { label: 'Rechazado', variant: 'destructive' },
}

const cancellationLabels: Record<string, string> = {
  flexible: 'Flexible',
  moderate: 'Moderada',
  strict: 'Estricta',
}

const pricingLabels: Record<string, string> = {
  per_person: 'Por persona',
  per_group: 'Por grupo',
}

export function ExperienceModeration({ experiences, showActions, emptyMessage }: ExperienceModerationProps) {
  if (experiences.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Compass className="h-12 w-12 text-muted-foreground/50" />
          <p className="mt-4 text-sm text-muted-foreground">
            {emptyMessage || 'No hay experiencias.'}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {experiences.map((exp) => (
        <ExperienceCard key={exp.id} experience={exp} showActions={showActions} />
      ))}
    </div>
  )
}

function ExperienceCard({
  experience,
  showActions,
}: {
  experience: ExperienceRow
  showActions?: boolean
}) {
  const [expanded, setExpanded] = useState(false)
  const [activeImage, setActiveImage] = useState(0)

  const [approveState, approveAction, isApproving] = useActionState<AdminActionState, FormData>(
    approveExperienceAction,
    {}
  )
  const [rejectState, rejectAction, isRejecting] = useActionState<AdminActionState, FormData>(
    rejectExperienceAction,
    {}
  )

  const status = statusLabels[experience.status] || { label: experience.status, variant: 'outline' as const }
  const providerStatus = experience.provider_profiles?.status
    ? (providerStatusLabels[experience.provider_profiles.status] || { label: experience.provider_profiles.status, variant: 'outline' as const })
    : null
  const message = approveState.success || approveState.error || rejectState.success || rejectState.error

  const formatPrice = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: experience.price_currency || 'MXN',
    minimumFractionDigits: 0,
  }).format(Number(experience.price_amount))

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return null
    if (minutes < 60) return `${minutes} min`
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    return m > 0 ? `${h}h ${m}min` : `${h}h`
  }

  const createdDate = new Date(experience.created_at).toLocaleDateString('es-MX', {
    day: 'numeric', month: 'short', year: 'numeric',
  })

  const sortedImages = [...(experience.experience_images ?? [])].sort((a, b) => {
    if (a.is_cover && !b.is_cover) return -1
    if (!a.is_cover && b.is_cover) return 1
    return a.sort_order - b.sort_order
  })

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-base">{experience.title}</CardTitle>
            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">
                {experience.provider_profiles?.business_name || 'Proveedor desconocido'}
              </span>
              <span>&middot;</span>
              <span>{experience.categories?.name}</span>
              {experience.destinations?.name && (
                <>
                  <span>&middot;</span>
                  <span>{experience.destinations.name}</span>
                </>
              )}
              <span>&middot;</span>
              <span>{formatPrice} {pricingLabels[experience.pricing_type] ? `(${pricingLabels[experience.pricing_type]})` : ''}</span>
              <span>&middot;</span>
              <span>{createdDate}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Badge variant={status.variant}>{status.label}</Badge>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="pt-0 border-t">
          <div className="grid gap-6 py-4 md:grid-cols-3">
            {/* Imágenes */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Imágenes ({sortedImages.length})
              </h4>
              {sortedImages.length === 0 ? (
                <div className="flex h-36 items-center justify-center rounded-lg border border-dashed text-muted-foreground">
                  <div className="flex flex-col items-center gap-1">
                    <ImageOff className="h-6 w-6" />
                    <span className="text-xs">Sin imágenes</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
                    <Image
                      src={sortedImages[activeImage].url}
                      alt={sortedImages[activeImage].alt_text || experience.title}
                      fill
                      className="object-cover"
                    />
                    {sortedImages[activeImage].is_cover && (
                      <span className="absolute left-2 top-2 rounded bg-black/60 px-1.5 py-0.5 text-xs text-white">
                        Portada
                      </span>
                    )}
                  </div>
                  {sortedImages.length > 1 && (
                    <div className="flex gap-1 overflow-x-auto">
                      {sortedImages.map((img, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveImage(i)}
                          className={`relative h-12 w-12 shrink-0 overflow-hidden rounded border-2 transition-colors ${
                            i === activeImage ? 'border-primary' : 'border-transparent'
                          }`}
                        >
                          <Image
                            src={img.url}
                            alt={img.alt_text || `Imagen ${i + 1}`}
                            fill
                            className="object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Experiencia + Precios */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Experiencia</h4>

              {experience.short_description && (
                <p className="text-sm text-muted-foreground">{experience.short_description}</p>
              )}
              {experience.description && (
                <p className="text-sm leading-relaxed line-clamp-4">{experience.description}</p>
              )}

              <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                {formatDuration(experience.duration_minutes) && (
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{formatDuration(experience.duration_minutes)}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Users className="h-3.5 w-3.5" />
                  <span>{experience.min_capacity}–{experience.max_capacity} personas</span>
                </div>
                {experience.meeting_point && (
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{experience.meeting_point}</span>
                  </div>
                )}
              </div>

              {/* Precios */}
              <div className="rounded-lg border bg-muted/40 p-3 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <DollarSign className="h-3.5 w-3.5" />
                  Precio
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold">{formatPrice}</span>
                  <span className="text-sm text-muted-foreground">
                    {pricingLabels[experience.pricing_type] || experience.pricing_type}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Cancelación: {cancellationLabels[experience.cancellation_policy] || experience.cancellation_policy}
                </div>
              </div>

              {experience.rejection_reason && (
                <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                  <span className="font-medium">Motivo de rechazo: </span>
                  {experience.rejection_reason}
                </div>
              )}
            </div>

            {/* Proveedor */}
            {experience.provider_profiles && (
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Proveedor</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <span className="font-medium">{experience.provider_profiles.business_name}</span>
                    {providerStatus && (
                      <Badge variant={providerStatus.variant} className="text-xs">{providerStatus.label}</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-3.5 w-3.5 shrink-0" />
                    <span>{experience.provider_profiles.representative_name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-3.5 w-3.5 shrink-0" />
                    <span>{experience.provider_profiles.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span>{experience.provider_profiles.location}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      )}

      <CardContent className={`pt-0 space-y-3 ${expanded ? 'border-t' : ''}`}>
        {message && (
          <div className={`rounded-md p-2 text-sm ${
            approveState.success || rejectState.success
              ? 'bg-green-500/10 text-green-700'
              : 'bg-destructive/10 text-destructive'
          }`}>
            {message}
          </div>
        )}

        {showActions && (
          <div className="flex gap-2 pt-2">
            <form action={approveAction}>
              <input type="hidden" name="experience_id" value={experience.id} />
              <Button size="sm" disabled={isApproving}>
                <CheckCircle2 className="mr-1 h-4 w-4" />
                {isApproving ? 'Aprobando...' : 'Aprobar'}
              </Button>
            </form>
            <form action={rejectAction} className="flex gap-2">
              <input type="hidden" name="experience_id" value={experience.id} />
              <Input
                name="rejection_reason"
                placeholder="Motivo de rechazo..."
                className="w-56"
              />
              <Button variant="destructive" size="sm" disabled={isRejecting}>
                <XCircle className="mr-1 h-4 w-4" />
                {isRejecting ? 'Rechazando...' : 'Rechazar'}
              </Button>
            </form>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
