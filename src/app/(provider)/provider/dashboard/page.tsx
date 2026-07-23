import { redirect } from 'next/navigation'
import Link from 'next/link'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { getProviderByAuthUserId } from '@/queries/providers'
import { getExperiencesByProvider } from '@/queries/experiences'
import { getProviderBookingStats, getProviderBookingItems } from '@/queries/bookings'
import { getProviderRatingSummary } from '@/queries/analytics'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  LayoutDashboard,
  CalendarCheck,
  DollarSign,
  Star,
  Package,
  Plus,
  Pencil,
  AlertTriangle,
  MessageSquare,
  Clock,
  Hourglass,
  XCircle,
} from 'lucide-react'

export const metadata = {
  title: 'Dashboard Proveedor',
}

const statusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  draft: { label: 'Borrador', variant: 'outline' },
  pending_review: { label: 'En revisión', variant: 'secondary' },
  active: { label: 'Activa', variant: 'default' },
  paused: { label: 'Pausada', variant: 'outline' },
  rejected: { label: 'Rechazada', variant: 'destructive' },
  archived: { label: 'Archivada', variant: 'outline' },
}

function formatMoney(amount: number) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(amount)
}

function formatDate(dateStr: string | Date) {
  return new Date(dateStr).toLocaleDateString('es-MX', {
    weekday: 'short', day: '2-digit', month: 'short',
  })
}

export default async function ProviderDashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/login')

  const provider = await getProviderByAuthUserId(session.user.id)
  if (!provider) redirect('/register/provider')

  const [experiences, stats, pendingItems, confirmedItems, ratingSummary] = await Promise.all([
    getExperiencesByProvider(provider.id),
    getProviderBookingStats(provider.id),
    getProviderBookingItems(provider.id, 'pending'),
    getProviderBookingItems(provider.id, 'confirmed'),
    getProviderRatingSummary(provider.id),
  ])

  const activeCount = experiences.filter(e => e.status === 'active').length
  const avgRating = ratingSummary.average > 0 ? ratingSummary.average : '--'

  // Next 3 confirmed bookings sorted by service_date
  const nextConfirmed = [...confirmedItems]
    .sort((a, b) => new Date(a.service_date).getTime() - new Date(b.service_date).getTime())
    .slice(0, 3)

  // Urgent pending (oldest first = waiting longest)
  const urgentPending = [...pendingItems]
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .slice(0, 5)

  const isPendingReview = provider.status === 'pending_review'
  const isRejected = provider.status === 'rejected'
  const canCreateExperience = !isPendingReview && !isRejected

  return (
    <div className="flex flex-col gap-6">
      {isPendingReview && (
        <div className="flex items-start gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900 dark:bg-yellow-950/30">
          <Hourglass className="mt-0.5 h-5 w-5 shrink-0 text-yellow-600 dark:text-yellow-500" />
          <div>
            <p className="font-semibold text-yellow-800 dark:text-yellow-400">Cuenta en revisión</p>
            <p className="mt-0.5 text-sm text-yellow-700 dark:text-yellow-500">
              El equipo de POORTAL revisará tu perfil en 1-2 días hábiles. Podrás publicar experiencias una vez que seas aprobado.
            </p>
          </div>
        </div>
      )}

      {isRejected && (
        <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4">
          <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          <div>
            <p className="font-semibold text-destructive">Solicitud rechazada</p>
            {provider.rejection_reason && (
              <p className="mt-0.5 text-sm text-destructive/80">{provider.rejection_reason}</p>
            )}
            <p className="mt-1 text-sm text-muted-foreground">Contacta al equipo de soporte para más información.</p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LayoutDashboard className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">{provider.business_name}</p>
          </div>
        </div>
        {canCreateExperience && (
          <Button asChild>
            <Link href="/provider/experiences/new">
              <Plus className="mr-2 h-4 w-4" />
              Nueva Experiencia
            </Link>
          </Button>
        )}
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Reservas del mes</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBookings}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingCount > 0
                ? `${stats.pendingCount} pendiente${stats.pendingCount !== 1 ? 's' : ''} de confirmar`
                : 'Sin pendientes'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ingresos del mes</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatMoney(stats.netMonthlyRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              Bruto: {formatMoney(stats.monthlyRevenue)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Rating promedio</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgRating}</div>
            <p className="text-xs text-muted-foreground">{ratingSummary.total} reseñas totales</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Experiencias activas</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCount}</div>
            <p className="text-xs text-muted-foreground">de {experiences.length} totales</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Pending orders queue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Reservas pendientes
              {pendingItems.length > 0 && (
                <Badge variant="destructive" className="text-xs">{pendingItems.length}</Badge>
              )}
            </CardTitle>
            <Button variant="ghost" size="sm" asChild className="text-xs h-7">
              <Link href="/provider/bookings">Ver todas</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {urgentPending.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CalendarCheck className="h-8 w-8 text-muted-foreground/40" />
                <p className="mt-2 text-sm text-muted-foreground">Sin reservas pendientes</p>
              </div>
            ) : (
              <div className="space-y-3">
                {urgentPending.map((item) => {
                  const hoursWaiting = Math.floor(
                    (Date.now() - new Date(item.created_at).getTime()) / 3_600_000
                  )
                  const isUrgent = hoursWaiting >= 12
                  return (
                    <div key={item.id} className={`flex items-start justify-between rounded-md border p-3 ${isUrgent ? 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30' : ''}`}>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">
                          {item.experiences?.title ?? 'Experiencia'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.bookings?.profiles?.full_name ?? item.bookings?.profiles?.email ?? 'Turista'}
                          {' · '}
                          {formatDate(item.service_date)}
                        </p>
                      </div>
                      <div className="ml-3 flex flex-col items-end gap-1.5">
                        <span className={`text-xs font-medium ${isUrgent ? 'text-red-600' : 'text-muted-foreground'}`}>
                          {hoursWaiting}h esperando
                        </span>
                        <Button size="sm" variant="outline" className="h-6 text-xs px-2" asChild>
                          <Link href="/provider/bookings">Atender</Link>
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Next confirmed bookings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CalendarCheck className="h-4 w-4" />
              Próximas reservas
            </CardTitle>
            <Button variant="ghost" size="sm" asChild className="text-xs h-7">
              <Link href="/provider/bookings">Ver todas</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {nextConfirmed.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CalendarCheck className="h-8 w-8 text-muted-foreground/40" />
                <p className="mt-2 text-sm text-muted-foreground">Sin reservas confirmadas próximas</p>
              </div>
            ) : (
              <div className="space-y-3">
                {nextConfirmed.map((item) => (
                  <div key={item.id} className="flex items-start justify-between rounded-md border p-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">
                        {item.experiences?.title ?? 'Experiencia'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.bookings?.profiles?.full_name ?? item.bookings?.profiles?.email ?? 'Turista'}
                        {' · '}{item.quantity} lugar{item.quantity !== 1 ? 'es' : ''}
                      </p>
                    </div>
                    <div className="ml-3 text-right">
                      <p className="text-xs font-medium">{formatDate(item.service_date)}</p>
                      <Badge variant="secondary" className="mt-1 text-xs">Confirmada</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Operational alerts */}
      {(ratingSummary.unresponded > 0 || pendingItems.length > 0) && (
        <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              Alertas operativas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {pendingItems.length > 0 && (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-600" />
                  <span>
                    <strong>{pendingItems.length}</strong> reserva{pendingItems.length !== 1 ? 's' : ''} sin confirmar
                  </span>
                </div>
                <Button size="sm" variant="outline" asChild className="h-7 text-xs">
                  <Link href="/provider/bookings">Revisar</Link>
                </Button>
              </div>
            )}
            {ratingSummary.unresponded > 0 && (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-amber-600" />
                  <span>
                    <strong>{ratingSummary.unresponded}</strong> reseña{ratingSummary.unresponded !== 1 ? 's' : ''} sin respuesta
                  </span>
                </div>
                <Button size="sm" variant="outline" asChild className="h-7 text-xs">
                  <Link href="/provider/analytics?tab=resenas">Responder</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Experiences list */}
      <Card>
        <CardHeader>
          <CardTitle>Mis Experiencias</CardTitle>
        </CardHeader>
        <CardContent>
          {experiences.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Package className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium">Aun no tienes experiencias</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Crea tu primera experiencia para empezar a recibir reservas.
              </p>
              <Button asChild className="mt-4">
                <Link href="/provider/experiences/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Crear Experiencia
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {experiences.map((exp) => {
                const status = statusLabels[exp.status] || { label: exp.status, variant: 'outline' as const }
                return (
                  <div key={exp.id} className="flex items-center justify-between rounded-md border p-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{exp.title}</span>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        ${Number(exp.price_amount).toLocaleString('es-MX')} {exp.price_currency}
                        {exp.review_count > 0 && (
                          <> &middot; {Number(exp.average_rating).toFixed(1)} ({exp.review_count} reseñas)</>
                        )}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/provider/experiences/${exp.id}/edit`}>
                        <Pencil className="mr-1 h-4 w-4" />
                        Editar
                      </Link>
                    </Button>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
