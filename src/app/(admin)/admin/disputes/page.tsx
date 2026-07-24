export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, Ban, User, Building2, CalendarDays } from 'lucide-react'
import prisma from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'Disputas y Reclamaciones',
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
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Disputas</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Gestiona las disputas entre turistas y proveedores
        </p>
      </div>

      {/* Summary badges */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="destructive">Disputas activas: {disputedBookings.length}</Badge>
        <Badge variant="outline">Cancelaciones: {recentCancellations.length}</Badge>
      </div>

      {/* Disputed bookings */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Disputas activas
        </h2>
        {disputedBookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border py-12 text-center">
            <AlertTriangle className="h-9 w-9 text-muted-foreground/40" />
            <p className="mt-3 text-sm text-muted-foreground">Sin disputas activas</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {disputedBookings.map((booking) => {
              const item = booking.booking_items[0]
              return (
                <div key={booking.id} className="rounded-2xl border bg-card p-4 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-muted-foreground">
                      {booking.booking_number}
                    </span>
                    <Badge variant="destructive" className="text-xs">Disputada</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5">Turista</p>
                      <p className="text-sm font-semibold leading-tight truncate">{booking.profiles.full_name ?? '—'}</p>
                      <p className="text-xs text-muted-foreground truncate">{booking.profiles.email}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-0.5">Proveedor</p>
                      <p className="text-sm font-semibold leading-tight truncate">{item?.provider_profiles.business_name ?? '—'}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="font-bold text-foreground">
                      ${Number(booking.total_amount).toLocaleString('es-MX')} {booking.currency}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <CalendarDays className="h-3 w-3" />
                      {new Date(booking.created_at).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Cancellations */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Cancelaciones recientes
        </h2>
        {recentCancellations.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border py-12 text-center">
            <Ban className="h-9 w-9 text-muted-foreground/40" />
            <p className="mt-3 text-sm text-muted-foreground">Sin cancelaciones registradas</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {recentCancellations.map((c) => (
              <div key={c.id} className="rounded-2xl border bg-card p-4 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-muted-foreground">
                    {c.bookings.booking_number}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <CalendarDays className="h-3 w-3" />
                    {new Date(c.created_at).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <User className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <span className="text-sm font-semibold truncate">{c.profiles?.full_name ?? c.cancelled_by_type}</span>
                </div>

                {c.reason && (
                  <p className="text-xs text-muted-foreground line-clamp-2">{c.reason}</p>
                )}

                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="outline">
                    {c.refund_percentage}% reembolso
                  </Badge>
                  <span className="text-muted-foreground text-xs">
                    ${Number(c.refund_amount).toLocaleString('es-MX')} MXN
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
