export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Percent, FileText, Bell } from 'lucide-react'
import { PLATFORM_FEE_PERCENTAGE, CANCELLATION_RULES } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Configuracion de la Plataforma',
}

export default function AdminSettingsPage() {
  const providerShare = 100 - PLATFORM_FEE_PERCENTAGE
  const flexible = CANCELLATION_RULES.flexible
  const moderate = CANCELLATION_RULES.moderate
  const strict = CANCELLATION_RULES.strict

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Configuracion</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Administra las configuraciones generales de POORTAL
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Comision */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Percent className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Comision de plataforma</CardTitle>
                <CardDescription>
                  Porcentaje cobrado por transaccion
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Comision actual
                </span>
                <span className="text-2xl font-bold">{PLATFORM_FEE_PERCENTAGE}%</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Se aplica sobre el monto total de cada reserva. El proveedor
                recibe el {providerShare}% restante.
              </p>
              <Button variant="outline" size="sm" className="w-full" disabled>
                Modificar comision
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Politicas de cancelacion — leidas desde CANCELLATION_RULES */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Politicas de cancelacion</CardTitle>
                <CardDescription>
                  Reglas de reembolso por politica
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-3 text-sm">
                {/* Flexible */}
                <div className="rounded-xl border bg-muted/40 p-3 space-y-1">
                  <p className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Flexible</p>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reembolso total</span>
                    <span className="font-medium">Hasta {flexible.full_refund_hours}h antes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Parcial ({flexible.partial_refund_percentage}%)</span>
                    <span className="font-medium">{flexible.partial_refund_hours}–{flexible.full_refund_hours}h antes</span>
                  </div>
                </div>
                {/* Moderada */}
                <div className="rounded-xl border bg-muted/40 p-3 space-y-1">
                  <p className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Moderada</p>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reembolso total</span>
                    <span className="font-medium">Hasta {moderate.full_refund_hours}h antes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Parcial ({moderate.partial_refund_percentage}%)</span>
                    <span className="font-medium">{moderate.partial_refund_hours}–{moderate.full_refund_hours}h antes</span>
                  </div>
                </div>
                {/* Estricta */}
                <div className="rounded-xl border bg-muted/40 p-3 space-y-1">
                  <p className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Estricta</p>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reembolso total</span>
                    <span className="font-medium">Hasta {strict.full_refund_hours}h antes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sin parcial</span>
                    <span className="font-medium">—</span>
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full" disabled>
                Editar politicas
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notificaciones */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Notificaciones</CardTitle>
                <CardDescription>
                  Configuracion de emails y alertas
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email de reservas</span>
                  <span className="font-medium">Activo</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Alertas de disputas</span>
                  <span className="font-medium">Activo</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Resumen semanal</span>
                  <span className="font-medium">Activo</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full" disabled>
                Configurar notificaciones
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
