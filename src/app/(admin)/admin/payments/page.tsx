export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  ArrowDownToLine,
} from 'lucide-react'
import prisma from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'Pagos de la Plataforma',
}

const TYPE_LABELS: Record<string, string> = {
  charge: 'Cobro',
  transfer: 'Transferencia',
  refund: 'Reembolso',
  platform_fee: 'Comision',
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente',
  succeeded: 'Completado',
  failed: 'Fallido',
  refunded: 'Reembolsado',
  partially_refunded: 'Reemb. parcial',
}

const STATUS_VARIANT: Record<
  string,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  pending: 'outline',
  succeeded: 'default',
  failed: 'destructive',
  refunded: 'secondary',
  partially_refunded: 'secondary',
}

export default async function AdminPaymentsPage() {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [monthlyCharges, monthlyFees, monthlyTransfers, recentPayments] =
    await Promise.all([
      prisma.payments.aggregate({
        where: {
          type: 'charge',
          status: 'succeeded',
          created_at: { gte: startOfMonth },
        },
        _sum: { amount: true },
        _count: { id: true },
      }),
      prisma.payments.aggregate({
        where: {
          type: 'platform_fee',
          status: 'succeeded',
          created_at: { gte: startOfMonth },
        },
        _sum: { amount: true },
      }),
      prisma.payments.aggregate({
        where: {
          type: 'transfer',
          created_at: { gte: startOfMonth },
        },
        _sum: { amount: true },
        _count: { id: true },
      }),
      prisma.payments.findMany({
        include: {
          bookings: {
            select: {
              booking_number: true,
              profiles: { select: { full_name: true, email: true } },
            },
          },
          booking_items: {
            select: {
              provider_profiles: { select: { business_name: true } },
            },
          },
        },
        orderBy: { created_at: 'desc' },
        take: 50,
      }),
    ])

  const totalRevenue = Number(monthlyCharges._sum.amount ?? 0)
  const totalFee = Number(monthlyFees._sum.amount ?? 0)
  const totalTransfers = Number(monthlyTransfers._sum.amount ?? 0)
  const processedCount = monthlyCharges._count.id
  const transferCount = monthlyTransfers._count.id

  const summaryCards = [
    {
      title: 'Ingresos totales',
      value: `$${totalRevenue.toLocaleString('es-MX')} MXN`,
      description: 'Cobros exitosos este mes',
      icon: DollarSign,
    },
    {
      title: 'Comision POORTAL (15%)',
      value: `$${totalFee.toLocaleString('es-MX')} MXN`,
      description: 'Este mes',
      icon: TrendingUp,
    },
    {
      title: 'Pagos procesados',
      value: processedCount.toString(),
      description: 'Cobros exitosos este mes',
      icon: CreditCard,
    },
    {
      title: 'Pagos a proveedores',
      value: `$${totalTransfers.toLocaleString('es-MX')} MXN`,
      description: `${transferCount} transferencias este mes`,
      icon: ArrowDownToLine,
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Pagos de la Plataforma
        </h1>
        <p className="mt-1 text-muted-foreground">
          Resumen de transacciones, comisiones y pagos a proveedores
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <card.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="mt-1 text-xs text-muted-foreground">
                {card.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historial de transacciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-6 gap-4 border-b bg-muted/50 px-4 py-3 text-sm font-medium text-muted-foreground">
              <div>Reserva</div>
              <div>Turista</div>
              <div>Proveedor</div>
              <div>Tipo</div>
              <div>Monto</div>
              <div>Estado</div>
            </div>
            {recentPayments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <CreditCard className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-medium">
                  Sin transacciones
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Las transacciones apareceran aqui
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {recentPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="grid grid-cols-6 gap-4 px-4 py-3 text-sm"
                  >
                    <div className="font-mono text-xs">
                      {payment.bookings.booking_number}
                    </div>
                    <div className="truncate">
                      {payment.bookings.profiles.full_name ??
                        payment.bookings.profiles.email}
                    </div>
                    <div className="truncate text-muted-foreground">
                      {payment.booking_items?.provider_profiles.business_name ??
                        '—'}
                    </div>
                    <div className="text-muted-foreground">
                      {TYPE_LABELS[payment.type] ?? payment.type}
                    </div>
                    <div className="font-medium">
                      ${Number(payment.amount).toLocaleString('es-MX')}
                    </div>
                    <div>
                      <Badge
                        variant={STATUS_VARIANT[payment.status] ?? 'outline'}
                      >
                        {STATUS_LABELS[payment.status] ?? payment.status}
                      </Badge>
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
