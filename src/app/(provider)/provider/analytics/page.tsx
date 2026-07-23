import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { getProviderByAuthUserId } from '@/queries/providers'
import {
  getMonthlyBookingStats,
  getExperienceStats,
  getProviderReviews,
  getProviderRatingSummary,
} from '@/queries/analytics'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { BarChart3, Star, MessageSquare, TrendingUp } from 'lucide-react'
import {
  MonthlyReservationsChart,
  MonthlyRevenueChart,
  ExperienceStatsChart,
  RatingDistributionChart,
} from '@/components/provider/analytics-charts'
import { ReviewReplyForm } from '@/components/provider/review-reply-form'

export const metadata = { title: 'Analiticas' }

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString('es-MX', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`h-3 w-3 ${s <= rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'}`}
        />
      ))}
    </div>
  )
}

export default async function ProviderAnalyticsPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/login')

  const provider = await getProviderByAuthUserId(session.user.id)
  if (!provider) redirect('/register/provider')

  const [monthlyStats, experienceStats, reviews, ratingSummary] = await Promise.all([
    getMonthlyBookingStats(provider.id, 6),
    getExperienceStats(provider.id),
    getProviderReviews(provider.id, 20),
    getProviderRatingSummary(provider.id),
  ])

  const totalReservas = monthlyStats.reduce((s, m) => s + m.reservas, 0)
  const totalIngresos = monthlyStats.reduce((s, m) => s + m.ingresos, 0)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <BarChart3 className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Analiticas</h1>
          <p className="text-muted-foreground">Rendimiento de tus experiencias — últimos 6 meses</p>
        </div>
      </div>

      {/* KPI summary cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Reservas (6m)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReservas}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Ingresos netos (6m)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(totalIngresos)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Rating global</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">{ratingSummary.average > 0 ? ratingSummary.average : '--'}</div>
              {ratingSummary.total > 0 && <StarDisplay rating={Math.round(ratingSummary.average)} />}
            </div>
            <p className="text-xs text-muted-foreground">{ratingSummary.total} reseñas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Sin responder</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ratingSummary.unresponded}</div>
            <p className="text-xs text-muted-foreground">reseñas pendientes</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="reservas">
        <TabsList>
          <TabsTrigger value="reservas">Reservas</TabsTrigger>
          <TabsTrigger value="ingresos">Ingresos</TabsTrigger>
          <TabsTrigger value="resenas">Reseñas</TabsTrigger>
        </TabsList>

        {/* ── Reservas tab ────────────────────────────────────────────────── */}
        <TabsContent value="reservas" className="space-y-4 pt-2">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Reservas por mes</CardTitle>
              </CardHeader>
              <CardContent>
                <MonthlyReservationsChart data={monthlyStats} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Experiencias más reservadas</CardTitle>
              </CardHeader>
              <CardContent>
                <ExperienceStatsChart data={experienceStats} />
              </CardContent>
            </Card>
          </div>

          {experienceStats.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Detalle por experiencia</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border overflow-hidden">
                  <div className="grid grid-cols-3 gap-4 border-b bg-muted/50 px-4 py-3 text-xs font-medium text-muted-foreground">
                    <span className="col-span-1">Experiencia</span>
                    <span className="text-right">Reservas</span>
                    <span className="text-right">Ingresos netos</span>
                  </div>
                  <div className="divide-y">
                    {experienceStats.map((exp) => (
                      <div key={exp.id} className="grid grid-cols-3 gap-4 px-4 py-3 text-sm items-center">
                        <span className="font-medium truncate">{exp.title}</span>
                        <span className="text-right">{exp.reservas}</span>
                        <span className="text-right text-green-700 dark:text-green-400 font-medium">
                          {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(exp.ingresos)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ── Ingresos tab ─────────────────────────────────────────────────── */}
        <TabsContent value="ingresos" className="space-y-4 pt-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Ingresos netos por mes</CardTitle>
              <p className="text-xs text-muted-foreground">Después de comisión del 15%</p>
            </CardHeader>
            <CardContent>
              <MonthlyRevenueChart data={monthlyStats} />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {monthlyStats.slice(-3).reverse().map((m) => (
              <Card key={`${m.year}-${m.month}`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-medium text-muted-foreground">{m.month} {m.year}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">
                    {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(m.ingresos)}
                  </div>
                  <p className="text-xs text-muted-foreground">{m.reservas} reservas</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ── Reseñas tab ──────────────────────────────────────────────────── */}
        <TabsContent value="resenas" className="space-y-4 pt-2">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Distribución de calificaciones</CardTitle>
              </CardHeader>
              <CardContent>
                <RatingDistributionChart summary={ratingSummary} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Resumen</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Rating promedio</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{ratingSummary.average > 0 ? ratingSummary.average : '--'}</span>
                    {ratingSummary.total > 0 && <StarDisplay rating={Math.round(ratingSummary.average)} />}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total reseñas</span>
                  <span className="font-semibold">{ratingSummary.total}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Sin respuesta</span>
                  <Badge variant={ratingSummary.unresponded > 0 ? 'destructive' : 'secondary'}>
                    {ratingSummary.unresponded}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Review list */}
          <div className="space-y-3">
            {reviews.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <MessageSquare className="h-10 w-10 text-muted-foreground/40" />
                  <p className="mt-3 text-sm text-muted-foreground">Aún no tienes reseñas</p>
                </CardContent>
              </Card>
            ) : (
              reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="pt-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                          {(review.tourist_name ?? review.tourist_email).slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {review.tourist_name ?? review.tourist_email}
                          </p>
                          <p className="text-xs text-muted-foreground">{review.experience_title}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <StarDisplay rating={review.rating} />
                        <span className="text-xs text-muted-foreground">{formatDate(review.created_at)}</span>
                      </div>
                    </div>

                    {review.comment && (
                      <p className="text-sm text-muted-foreground">{review.comment}</p>
                    )}

                    {review.provider_response ? (
                      <div className="rounded-md bg-muted/50 px-3 py-2 text-sm">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Tu respuesta</p>
                        <p>{review.provider_response}</p>
                      </div>
                    ) : (
                      <ReviewReplyForm reviewId={review.id} />
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
