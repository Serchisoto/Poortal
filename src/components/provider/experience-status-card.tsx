'use client'

import { useState, useTransition } from 'react'
import { submitExperienceForReviewAction } from '@/actions/experiences'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Send, CheckCircle, Clock, XCircle, PauseCircle, Archive } from 'lucide-react'

interface ExperienceStatusCardProps {
  experienceId: string
  status: string
  rejectionReason?: string | null
}

const statusConfig: Record<string, {
  label: string
  icon: React.ReactNode
  message: string
  variant: 'default' | 'secondary' | 'destructive' | 'outline'
  canSubmit: boolean
}> = {
  draft: {
    label: 'Borrador',
    icon: <Archive className="h-4 w-4" />,
    message: 'Esta experiencia es un borrador. Envíala a revisión para que el equipo la apruebe y sea visible para los turistas.',
    variant: 'outline',
    canSubmit: true,
  },
  pending_review: {
    label: 'En revisión',
    icon: <Clock className="h-4 w-4" />,
    message: 'Tu experiencia está siendo revisada por el equipo. Te notificaremos cuando sea aprobada.',
    variant: 'secondary',
    canSubmit: false,
  },
  active: {
    label: 'Activa',
    icon: <CheckCircle className="h-4 w-4" />,
    message: 'Tu experiencia está activa y visible para los turistas.',
    variant: 'default',
    canSubmit: false,
  },
  paused: {
    label: 'Pausada',
    icon: <PauseCircle className="h-4 w-4" />,
    message: 'Tu experiencia está pausada. Envíala a revisión nuevamente para reactivarla.',
    variant: 'outline',
    canSubmit: true,
  },
  rejected: {
    label: 'Rechazada',
    icon: <XCircle className="h-4 w-4" />,
    message: 'Tu experiencia fue rechazada. Corrige los detalles y vuelve a enviarla a revisión.',
    variant: 'destructive',
    canSubmit: true,
  },
  archived: {
    label: 'Archivada',
    icon: <Archive className="h-4 w-4" />,
    message: 'Esta experiencia está archivada.',
    variant: 'outline',
    canSubmit: false,
  },
}

export function ExperienceStatusCard({ experienceId, status, rejectionReason }: ExperienceStatusCardProps) {
  const config = statusConfig[status] ?? {
    label: status,
    icon: null,
    message: '',
    variant: 'outline' as const,
    canSubmit: false,
  }

  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<{ error?: string; success?: string } | null>(null)

  function handleSubmit() {
    startTransition(async () => {
      const res = await submitExperienceForReviewAction(experienceId)
      setResult(res)
    })
  }

  return (
    <Card className={status === 'active' ? 'border-green-200 bg-green-50/50' : status === 'rejected' ? 'border-destructive/30 bg-destructive/5' : ''}>
      <CardContent className="flex flex-col gap-3 pt-4 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">Estado de la experiencia</span>
            <Badge variant={config.variant} className="flex items-center gap-1">
              {config.icon}
              {config.label}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{config.message}</p>
          {rejectionReason && status === 'rejected' && (
            <p className="text-sm text-destructive font-medium">Motivo: {rejectionReason}</p>
          )}
          {result?.error && (
            <p className="text-sm text-destructive">{result.error}</p>
          )}
          {result?.success && (
            <p className="text-sm text-green-700">{result.success}</p>
          )}
        </div>

        {config.canSubmit && !result?.success && (
          <Button onClick={handleSubmit} disabled={isPending} className="shrink-0">
            <Send className="mr-2 h-4 w-4" />
            {isPending ? 'Enviando...' : 'Enviar a revisión'}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
