export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, Ban } from 'lucide-react'
import prisma from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'Disputas y Reclamaciones',
}

const POLICY_LABELS: Record<string, string> = {
  flexible: 'Flexible',
  moderate: 'Moderada',
  strict: 'Estricta',
}

export default async function AdminDisputesPage() {
  const [disputedBookings, recentCancellations] = await Promise.all([
    prisma.bookings.findMany({
      where: { status: 'disputed' },
      include: {
        profiles: { select: { full_name: true, email: true } },
        booking_items: {
          take: 1,
          include: {
            experiences: { select: { title: true } },
            provider_profiles: { select: { business_name: true } },
          },
        },
      },
      orderBy: { created_at: 'desc' },
    }),
    prisma.cancellations.findMany({
      include: {
        bookings: { select: { booking_number: true } },
        profiles: { select: { full_name: true, email: true } },
      },
      orderBy: { created_at: 'desc' },
      take: 30,
    }),
  ])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Disputas y Reclamaciones
        </h1>
        <p className="mt-1 text-muted-foreground">
          Gestiona las disputas entre turistas y proveedores
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="destructive">
          Disputas activas: {disputedBookings.length}
        </Badge>
        <Badge variant="outline">
          Cancelaciones totales: {recentCancellations.length}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Disputas activas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-5 gap-4 border-b bg-muted/50 px-4 py-3 text-sm font-medium text-muted-foreground">
              <div>Reserva</div>
              <div>Turista</div>
              <div>Proveedor</div>
              <div>Monto</div>
              <div>Fecha</div>
            </div>
            {disputedBookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <AlertTriangle className="h-10 w-10 text-muted-foreground/50" />
                <p className="mt-3 text-sm text-muted-foreground">
                  Sin disputas activas
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {disputedBookings.map((booking) => {
                  const item = booking.booking_items[0]
                  return (
                    <div
                      key={booking.id}
                      className="grid grid-cols-5 gap-4 px-4 py-3 text-sm"
                    >
                      <div className="font-mono font-medium text-xs">
                        {booking.booking_number}
                      </div>
                      <div>
                        <p className="truncate font-medium">
                          {booking.profiles.full_name ?? '—'}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {booking.profiles.email}
                        </p>
                      </div>
                      <div className="truncate text-muted-foreground">
                        {item?.provider_profiles.business_name ?? '—'}
                      </div>
                      <div className="font-medium">
                        ${Number(booking.total_amount).toLocaleString('es-MX')}{' '}
                        {booking.currency}
                      </div>
                      <div className="text-muted-foreground">
                        {new Date(booking.created_at).toLocaleDateString(
                          'es-MX'
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cancelaciones recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-5 gap-4 border-b bg-muted/50 px-4 py-3 text-sm font-medium text-muted-foreground">
              <div>Reserva</div>
              <div>Cancelado por</div>
              <div>Motivo</div>
              <div>Reembolso</div>
              <div>Fecha</div>
            </div>
            {recentCancellations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Ban className="h-10 w-10 text-muted-foreground/50" />
                <p className="mt-3 text-sm text-muted-foreground">
                  Sin cancelaciones registradas
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {recentCancellations.map((c) => (
                  <div
                    key={c.id}
                    className="grid grid-cols-5 gap-4 px-4 py-3 text-sm"
                  >
                    <div className="font-mono text-xs">
                      {c.bookings.booking_number}
                    </div>
                    <div>
                      <p className="truncate">
                        {c.profiles?.full_name ?? '—'}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {c.profiles?.email ?? c.cancelled_by_type}
                      </p>
                    </div>
                    <div className="truncate text-muted-foreground">
                      {c.reason ?? '—'}
                    </div>
                    <div>
                      <span className="font-medium">
                        {c.refund_percentage}%
                      </span>
                      <span className="ml-1 text-muted-foreground">
                        (${Number(c.refund_amount).toLocaleString('es-MX')})
                      </span>
                    </div>
                    <div className="text-muted-foreground">
                      {new Date(c.created_at).toLocaleDateString('es-MX')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
