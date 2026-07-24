export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
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

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
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
        where: { type: 'charge', status: 'succeeded', created_at: { gte: startOfMonth } },
        _sum: { amount: true },
        _count: { id: true },
      }),
      prisma.payments.aggregate({
        where: { type: 'platform_fee', status: 'succeeded', created_at: { gte: startOfMonth } },
        _sum: { amount: true },
      }),
      prisma.payments.aggregate({
        where: { type: 'transfer', created_at: { gte: startOfMonth } },
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
            select: { provider_profiles: { select: { business_name: true } } },
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
    { title: 'Ingresos totales', value: `$${totalRevenue.toLocaleString('es-MX')}`, sub: 'Cobros exitosos este mes', icon: DollarSign },
    { title: 'Comision POORTAL', value: `$${totalFee.toLocaleString('es-MX')}`, sub: '15% — este mes', icon: TrendingUp },
    { title: 'Pagos procesados', value: processedCount.toString(), sub: 'Cobros exitosos este mes', icon: CreditCard },
    { title: 'A proveedores', value: `$${totalTransfers.toLocaleString('es-MX')}`, sub: `${transferCount} transferencias`, icon: ArrowDownToLine },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Pagos</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Transacciones, comisiones y pagos a proveedores
        </p>
      </div>

      {/* Summary cards — 2 col on mobile */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {summaryCards.map((card) => (
          <div key={card.title} className="rounded-2xl border bg-card p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="rounded-xl bg-primary/10 p-2">
                <card.icon className="h-4 w-4 text-primary" strokeWidth={2} />
              </div>
            </div>
            <p className="text-xl font-bold leading-none">{card.value}</p>
            <p className="mt-1 text-xs font-semibold leading-tight text-foreground">{card.title}</p>
            <p className="mt-0.5 text-[11px] leading-tight text-muted-foreground">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Transaction list */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Historial de transacciones
        </h2>
        {recentPayments.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border py-16 text-center">
            <CreditCard className="h-10 w-10 text-muted-foreground/40" />
            <p className="mt-3 text-sm font-medium text-muted-foreground">Sin transacciones</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {recentPayments.map((payment) => (
              <div key={payment.id} className="rounded-2xl border bg-card p-4 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-muted-foreground">
                    {payment.bookings.booking_number}
                  </span>
                  <Badge variant={STATUS_VARIANT[payment.status] ?? 'outline'} className="text-xs">
                    {STATUS_LABELS[payment.status] ?? payment.status}
                  </Badge>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">
                      {payment.bookings.profiles.full_name ?? payment.bookings.profiles.email}
                    </p>
                    {payment.booking_items?.provider_profiles.business_name && (
                      <p className="text-xs text-muted-foreground truncate">
                        {payment.booking_items.provider_profiles.business_name}
                      </p>
                    )}
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-bold">
                      ${Number(payment.amount).toLocaleString('es-MX')} MXN
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {TYPE_LABELS[payment.type] ?? payment.type}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
