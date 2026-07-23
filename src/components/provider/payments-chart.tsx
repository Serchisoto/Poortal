'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { MonthlyBookingStat } from '@/queries/analytics'

type Props = { data: MonthlyBookingStat[] }

export function PaymentsRevenueChart({ data }: Props) {
  const hasData = data.some(d => d.ingresos > 0)

  if (!hasData) {
    return (
      <div className="flex h-48 items-center justify-center rounded-lg bg-muted/40">
        <p className="text-sm text-muted-foreground">Aún no hay ingresos registrados</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={192}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
        <YAxis
          tick={{ fontSize: 11 }}
          tickFormatter={(v: number) => v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`}
        />
        <Tooltip
          formatter={(v) => [
            new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(Number(v)),
            'Ingresos netos',
          ]}
        />
        <Bar dataKey="ingresos" radius={[4, 4, 0, 0]} fill="hsl(var(--primary))" />
      </BarChart>
    </ResponsiveContainer>
  )
}
