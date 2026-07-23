'use client'

import { useActionState } from 'react'
import { approveProviderAction, rejectProviderAction, type AdminActionState } from '@/actions/admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Building2, CheckCircle2, XCircle, Mail, Phone, MapPin } from 'lucide-react'
import type { ProviderWithProfile } from '@/queries/providers'

interface ProviderTableProps {
  providers: ProviderWithProfile[]
  showActions?: 'approve' | 'suspend'
  emptyMessage?: string
}

const statusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending_review: { label: 'Pendiente', variant: 'secondary' },
  approved_incomplete: { label: 'Aprobado (Incompleto)', variant: 'outline' },
  active: { label: 'Activo', variant: 'default' },
  suspended: { label: 'Suspendido', variant: 'destructive' },
  rejected: { label: 'Rechazado', variant: 'destructive' },
}

export function ProviderTable({ providers, showActions, emptyMessage }: ProviderTableProps) {
  if (providers.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Building2 className="h-12 w-12 text-muted-foreground/50" />
          <p className="mt-4 text-sm text-muted-foreground">
            {emptyMessage || 'No hay proveedores.'}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {providers.map((provider) => (
        <ProviderCard
          key={provider.id}
          provider={provider}
          showActions={showActions}
        />
      ))}
    </div>
  )
}

function ProviderCard({
  provider,
  showActions,
}: {
  provider: ProviderWithProfile
  showActions?: 'approve' | 'suspend'
}) {
  const [approveState, approveAction, isApproving] = useActionState<AdminActionState, FormData>(
    approveProviderAction,
    {}
  )
  const [rejectState, rejectAction, isRejecting] = useActionState<AdminActionState, FormData>(
    rejectProviderAction,
    {}
  )

  const status = statusLabels[provider.status] || { label: provider.status, variant: 'outline' as const }
  const message = approveState.success || approveState.error || rejectState.success || rejectState.error

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              {provider.business_name}
              <Badge variant={status.variant}>{status.label}</Badge>
            </CardTitle>
            <div className="mt-2 flex flex-wrap gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5" />
                {provider.representative_name}
              </span>
              {provider.profiles?.email && (
                <span className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" />
                  {provider.profiles.email}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Phone className="h-3.5 w-3.5" />
                {provider.phone}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {provider.location}
              </span>
            </div>
            {provider.categories?.name && (
              <Badge variant="outline" className="mt-2">{provider.categories.name}</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm">{provider.short_description}</p>

        {provider.rejection_reason && (
          <div className="rounded-md bg-destructive/10 p-2 text-sm text-destructive">
            <strong>Motivo:</strong> {provider.rejection_reason}
          </div>
        )}

        {message && (
          <div className={`rounded-md p-2 text-sm ${
            approveState.success || rejectState.success
              ? 'bg-green-500/10 text-green-700'
              : 'bg-destructive/10 text-destructive'
          }`}>
            {message}
          </div>
        )}

        {showActions === 'approve' && (
          <div className="flex gap-2">
            <form action={approveAction}>
              <input type="hidden" name="provider_id" value={provider.id} />
              <Button size="sm" disabled={isApproving}>
                <CheckCircle2 className="mr-1 h-4 w-4" />
                {isApproving ? 'Aprobando...' : 'Aprobar'}
              </Button>
            </form>
            <form action={rejectAction} className="flex gap-2">
              <input type="hidden" name="provider_id" value={provider.id} />
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
