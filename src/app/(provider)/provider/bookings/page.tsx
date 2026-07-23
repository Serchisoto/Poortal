import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { getProviderByAuthUserId } from '@/queries/providers'
import { getProviderBookingItems } from '@/queries/bookings'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { BookingActions } from '@/components/provider/booking-actions'
import { CalendarCheck, Clock, CheckCircle2, CircleCheck, XCircle, User, Calendar } from 'lucide-react'
import type { BookingItemWithDetails } from '@/queries/bookings'

export const metadata = { title: 'Gestionar Reservas' }

const itemStatusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending:   { label: 'Pendiente', variant: 'secondary' },
  confirmed: { label: 'Confirmada', variant: 'default' },
  rejected:  { label: 'Rechazada', variant: 'destructive' },
  cancelled: { label: 'Cancelada', variant: 'outline' },
  completed: { label: 'Completada', variant: 'outline' },
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('es-MX', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

function formatMoney(amount: number, currency = 'MXN') {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency }).format(amount)
}

function BookingCard({ item }: { item: BookingItemWithDetails }) {
  const booking = item.bookings
  const tourist = booking?.profiles
  const cfg = itemStatusConfig[item.status] ?? { label: item.status, variant: 'outline' as const }

  return (
    <div className="rounded-lg border p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-sm">{item.experiences?.title ?? 'Experiencia'}</span>
            <Badge variant={cfg.variant}>{cfg.label}</Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Reserva #{booking?.booking_number}
          </p>
        </div>
        <span className="font-semibold text-sm shrink-0">{formatMoney(Number(item.subtotal))}</span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <User className="h-3.5 w-3.5" />
          <span>{tourist?.full_name ?? tourist?.email ?? 'Cliente'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" />
          <span>{formatDate(item.service_date)}{item.service_time ? ` · ${item.service_time}` : ''}</span>
        </div>
        <div className="flex items-center gap-1.5 col-span-2">
          <CalendarCheck className="h-3.5 w-3.5" />
          <span>Reservado el {formatDate(booking?.created_at ?? item.created_at)}</span>
          {item.quantity > 1 && <span>· {item.quantity} personas</span>}
        </div>
      </div>

      {item.provider_message && (
        <p className="text-xs bg-muted rounded p-2">{item.provider_message}</p>
      )}

      <BookingActions bookingItemId={item.id} status={item.status} />
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <CalendarCheck className="h-12 w-12 text-muted-foreground/50" />
        <p className="mt-4 text-sm text-muted-foreground">{message}</p>
      </CardContent>
    </Card>
  )
}

export default async function ProviderBookingsPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/login')

  const provider = await getProviderByAuthUserId(session.user.id)
  if (!provider) redirect('/register/provider')

  const [pending, confirmed, completed, rejected] = await Promise.all([
    getProviderBookingItems(provider.id, 'pending'),
    getProviderBookingItems(provider.id, 'confirmed'),
    getProviderBookingItems(provider.id, 'completed'),
    getProviderBookingItems(provider.id, ['rejected', 'cancelled']),
  ])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <CalendarCheck className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Gestionar Reservas</h1>
          <p className="text-muted-foreground">Administra las reservas de tus experiencias</p>
        </div>
      </div>

      <Tabs defaultValue="pendientes">
        <TabsList>
          <TabsTrigger value="pendientes" className="gap-1.5">
            <Clock className="h-4 w-4" />
            Pendientes
            {pending.length > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">{pending.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="confirmadas" className="gap-1.5">
            <CheckCircle2 className="h-4 w-4" />
            Confirmadas
          </TabsTrigger>
          <TabsTrigger value="completadas" className="gap-1.5">
            <CircleCheck className="h-4 w-4" />
            Completadas
          </TabsTrigger>
          <TabsTrigger value="rechazadas" className="gap-1.5">
            <XCircle className="h-4 w-4" />
            Rechazadas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pendientes" className="mt-4">
          {pending.length === 0 ? (
            <EmptyState message="No tienes reservas pendientes por confirmar." />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Reservas por confirmar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {pending.map((item) => <BookingCard key={item.id} item={item} />)}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="confirmadas" className="mt-4">
          {confirmed.length === 0 ? (
            <EmptyState message="No tienes reservas confirmadas en este momento." />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Reservas confirmadas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {confirmed.map((item) => <BookingCard key={item.id} item={item} />)}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completadas" className="mt-4">
          {completed.length === 0 ? (
            <EmptyState message="Aun no tienes reservas completadas." />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Historial de reservas completadas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {completed.map((item) => <BookingCard key={item.id} item={item} />)}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="rechazadas" className="mt-4">
          {rejected.length === 0 ? (
            <EmptyState message="No hay reservas rechazadas o canceladas." />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Rechazadas y canceladas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {rejected.map((item) => <BookingCard key={item.id} item={item} />)}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
