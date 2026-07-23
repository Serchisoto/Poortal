'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { completeProviderProfileAction, type ProviderActionState } from '@/actions/providers'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  UserCheck,
  Building2,
  FileText,
  CreditCard,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
} from 'lucide-react'
import type { ProviderProfile } from '@/types'

interface OnboardingClientProps {
  provider: ProviderProfile
}

const statusConfig = {
  pending_review: { label: 'En revision', icon: Clock, variant: 'secondary' as const },
  approved_incomplete: { label: 'Aprobado - Completa tu perfil', icon: AlertCircle, variant: 'default' as const },
  active: { label: 'Activo', icon: CheckCircle2, variant: 'default' as const },
  suspended: { label: 'Suspendido', icon: AlertCircle, variant: 'destructive' as const },
  rejected: { label: 'Rechazado', icon: AlertCircle, variant: 'destructive' as const },
}

export function OnboardingClient({ provider }: OnboardingClientProps) {
  const [state, formAction, isPending] = useActionState<ProviderActionState, FormData>(
    completeProviderProfileAction,
    {}
  )

  const status = statusConfig[provider.status as keyof typeof statusConfig]
  const canComplete = provider.status === 'approved_incomplete' || provider.status === 'active'
  const isPending_review = provider.status === 'pending_review'

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <UserCheck className="h-8 w-8 text-primary" />
          <div className="flex-1">
            <h1 className="text-3xl font-bold">Onboarding</h1>
            <p className="text-muted-foreground">
              {provider.business_name}
            </p>
          </div>
          <Badge variant={status.variant}>
            <status.icon className="mr-1 h-3 w-3" />
            {status.label}
          </Badge>
        </div>

        {provider.rejection_reason && (
          <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
            <strong>Motivo de rechazo:</strong> {provider.rejection_reason}
          </div>
        )}

        {isPending_review && (
          <Card>
            <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
              <Clock className="h-12 w-12 text-muted-foreground" />
              <div>
                <h2 className="text-lg font-semibold">Tu solicitud esta en revision</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Nuestro equipo esta revisando tu solicitud. Te notificaremos cuando sea aprobada.
                  Esto normalmente toma 24-48 horas.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 1: Business data - Complete profile */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                1
              </div>
              <div className="flex-1">
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Datos del negocio
                </CardTitle>
                <CardDescription>
                  {canComplete
                    ? 'Completa la informacion fiscal y operativa de tu negocio.'
                    : 'Disponible una vez aprobada tu solicitud.'}
                </CardDescription>
              </div>
              {provider.legal_name && (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              )}
            </div>
          </CardHeader>
          {canComplete && (
            <CardContent>
              {state.error && (
                <div className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  {state.error}
                </div>
              )}
              {state.success && (
                <div className="mb-4 rounded-md bg-green-500/10 p-3 text-sm text-green-700">
                  {state.success}
                </div>
              )}
              <form action={formAction} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="legal_name">Razon social *</Label>
                    <Input
                      id="legal_name"
                      name="legal_name"
                      defaultValue={provider.legal_name || ''}
                      placeholder="Razon social del negocio"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tax_id">RFC (opcional)</Label>
                    <Input
                      id="tax_id"
                      name="tax_id"
                      defaultValue={provider.tax_id || ''}
                      placeholder="XAXX010101000"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="full_address">Direccion completa *</Label>
                  <Input
                    id="full_address"
                    name="full_address"
                    defaultValue={provider.full_address || ''}
                    placeholder="Calle, numero, colonia, CP, ciudad"
                    required
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="customer_phone">Telefono de atencion *</Label>
                    <Input
                      id="customer_phone"
                      name="customer_phone"
                      type="tel"
                      defaultValue={provider.customer_phone || ''}
                      placeholder="+52 624 123 4567"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Sitio web (opcional)</Label>
                    <Input
                      id="website"
                      name="website"
                      type="url"
                      defaultValue={provider.website || ''}
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="operating_hours">Horarios de operacion</Label>
                  <Input
                    id="operating_hours"
                    name="operating_hours"
                    defaultValue={
                      typeof provider.operating_hours === 'object' && provider.operating_hours !== null
                        ? (provider.operating_hours as Record<string, string>).description || ''
                        : ''
                    }
                    placeholder="Ej: Lunes a Viernes 9am-6pm, Sabados 10am-2pm"
                  />
                </div>

                <Button type="submit" disabled={isPending}>
                  {isPending ? 'Guardando...' : 'Guardar datos del negocio'}
                </Button>
              </form>
            </CardContent>
          )}
        </Card>

        {/* Step 2: Documents */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-bold">
                2
              </div>
              <div className="flex-1">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Documentos
                </CardTitle>
                <CardDescription>
                  Sube documentos para verificar tu identidad y negocio.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex h-16 items-center justify-center rounded-lg border border-dashed">
              <p className="text-sm text-muted-foreground">
                Subida de documentos disponible en la siguiente version.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Step 3: Payments */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-bold">
                3
              </div>
              <div className="flex-1">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Configurar pagos
                </CardTitle>
                <CardDescription>
                  Conecta Stripe para recibir pagos de tus experiencias.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex h-16 items-center justify-center rounded-lg border border-dashed">
              <p className="text-sm text-muted-foreground">
                Configuracion de pagos disponible en Fase 3.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* CTA to create experience */}
        {(provider.status === 'active' || provider.status === 'approved_incomplete') && (
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <h3 className="font-semibold">Listo para crear tu primera experiencia?</h3>
                <p className="text-sm text-muted-foreground">
                  Publica tus servicios y comienza a recibir reservas.
                </p>
              </div>
              <Button asChild>
                <Link href="/provider/experiences/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Crear Experiencia
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
