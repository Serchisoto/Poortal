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

export const metadata: Metadata = {
  title: 'Configuracion de la Plataforma',
}

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Configuracion de la Plataforma
        </h1>
        <p className="mt-1 text-muted-foreground">
          Administra las configuraciones generales de POORTAL
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                <span className="text-2xl font-bold">10%</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Se aplica sobre el monto total de cada reserva. El proveedor
                recibe el 90% restante.
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Modificar comision
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Politicas de cancelacion</CardTitle>
                <CardDescription>
                  Reglas de reembolso y cancelaciones
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cancelacion gratuita</span>
                  <span className="font-medium">Hasta 48h antes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cancelacion parcial</span>
                  <span className="font-medium">24-48h antes (50%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sin reembolso</span>
                  <span className="font-medium">Menos de 24h</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                Editar politicas
              </Button>
            </div>
          </CardContent>
        </Card>

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
              <Button variant="outline" size="sm" className="w-full">
                Configurar notificaciones
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
