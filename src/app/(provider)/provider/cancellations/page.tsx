import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { getProviderByAuthUserId } from '@/queries/providers'
import { getProviderBookingItems } from '@/queries/bookings'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Ban, User, Calendar, AlertCircle } from 'lucide-react'
import type { BookingItemWithDetails } from '@/queries/bookings'

export const metadata = { title: 'Cancelaciones' }

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('es-MX', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

function formatMoney(amount: number, currency = 'MXN') {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency }).format(amount)
}

function CancellationCard({ item }: { item: BookingItemWithDetails }) {
  const booking = item.bookings
  const tourist = booking?.profiles

  return (
    <div className="rounded-lg border p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{item.experiences?.title ?? 'Experiencia'}</span>
            <Badge variant={item.status === 'cancelled' ? 'outline' : 'destructive'}>
              {item.status === 'cancelled' ? 'Cancelada' : 'Rechazada'}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Reserva #{booking?.booking_number}
          </p>
        </div>
        <span className="font-semibold text-sm shrink-0 text-muted-foreground line-through">
          {formatMoney(Number(item.subtotal))}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <User className="h-3.5 w-3.5" />
          <span>{tourist?.full_name ?? tourist?.email ?? 'Cliente'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" />
          <span>Servicio: {formatDate(item.service_date)}</span>
        </div>
      </div>

      {item.provider_message && (
        <div className="flex gap-2 rounded bg-muted p-2.5 text-xs">
          <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0 text-muted-foreground" />
          <span>{item.provider_message}</span>
        </div>
      )}

      {item.responded_at && (
        <p className="text-xs text-muted-foreground">
          Procesada el {formatDate(item.responded_at)}
        </p>
      )}
    </div>
  )
}

export default async function ProviderCancellationsPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/login')

  const provider = await getProviderByAuthUserId(session.user.id)
  if (!provider) redirect('/register/provider')

  const items = await getProviderBookingItems(provider.id, ['cancelled', 'rejected'])

  const thisMonthStart = new Date()
  thisMonthStart.setDate(1)
  thisMonthStart.setHours(0, 0, 0, 0)

  const thisMonth = items.filter(
    (i) => new Date(i.updated_at) >= thisMonthStart
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Ban className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Cancelaciones</h1>
          <p className="text-muted-foreground">Historial de reservas canceladas y rechazadas</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total cancelaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{items.length}</div>
            <p className="text-xs text-muted-foreground">Historico</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Este mes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{thisMonth.length}</div>
            <p className="text-xs text-muted-foreground">Cancelaciones del mes actual</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tasa de cancelacion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {items.length === 0 ? '0%' : '--'}
            </div>
            <p className="text-xs text-muted-foreground">Disponible con mas datos</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historial de cancelaciones</CardTitle>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Ban className="h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-sm text-muted-foreground">
                No hay cancelaciones registradas. ¡Buen trabajo!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <CancellationCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
