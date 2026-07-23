'use client'

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import type { MonthlyBookingStat, ExperienceStat, RatingSummary } from '@/queries/analytics'

function formatMoney(n: number) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(n)
}

// ─── Monthly Reservations Bar Chart ─────────────────────────────────────────

type MonthlyReservationsChartProps = { data: MonthlyBookingStat[] }

export function MonthlyReservationsChart({ data }: MonthlyReservationsChartProps) {
  if (data.every(d => d.reservas === 0)) {
    return <EmptyChart message="Aún no hay reservas registradas" />
  }
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
        <Tooltip formatter={(v) => [v, 'Reservas']} />
        <Bar dataKey="reservas" radius={[4, 4, 0, 0]} fill="hsl(var(--primary))" />
      </BarChart>
    </ResponsiveContainer>
  )
}

// ─── Monthly Revenue Line Chart ──────────────────────────────────────────────

type MonthlyRevenueChartProps = { data: MonthlyBookingStat[] }

export function MonthlyRevenueChart({ data }: MonthlyRevenueChartProps) {
  if (data.every(d => d.ingresos === 0)) {
    return <EmptyChart message="Aún no hay ingresos registrados" />
  }
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
        <Tooltip formatter={(v) => [formatMoney(Number(v)), 'Ingresos netos']} />
        <Line
          type="monotone"
          dataKey="ingresos"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

// ─── Experiences Horizontal Bar Chart ────────────────────────────────────────

type ExperienceStatsChartProps = { data: ExperienceStat[] }

export function ExperienceStatsChart({ data }: ExperienceStatsChartProps) {
  if (data.length === 0) {
    return <EmptyChart message="Aún no hay datos de experiencias" />
  }

  const COLORS = [
    'hsl(var(--primary))',
    'hsl(var(--primary) / 0.8)',
    'hsl(var(--primary) / 0.6)',
    'hsl(var(--primary) / 0.45)',
    'hsl(var(--primary) / 0.3)',
  ]

  const top5 = data.slice(0, 5)
  const chartHeight = Math.max(120, top5.length * 44)

  return (
    <ResponsiveContainer width="100%" height={chartHeight}>
      <BarChart
        data={top5}
        layout="vertical"
        margin={{ top: 4, right: 40, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
        <YAxis
          type="category"
          dataKey="title"
          tick={{ fontSize: 11 }}
          width={120}
          tickFormatter={(v: string) => v.length > 18 ? v.slice(0, 18) + '…' : v}
        />
        <Tooltip formatter={(v) => [v, 'Reservas']} />
        <Bar dataKey="reservas" radius={[0, 4, 4, 0]}>
          {top5.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

// ─── Rating Distribution Bar Chart ───────────────────────────────────────────

type RatingDistributionChartProps = { summary: RatingSummary }

export function RatingDistributionChart({ summary }: RatingDistributionChartProps) {
  if (summary.total === 0) {
    return <EmptyChart message="Aún no hay reseñas" />
  }

  const data = ([5, 4, 3, 2, 1] as const).map((star) => ({
    star: `${star}★`,
    count: summary.distribution[star] ?? 0,
  }))

  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 40, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
        <YAxis type="category" dataKey="star" tick={{ fontSize: 12 }} width={32} />
        <Tooltip formatter={(v) => [v, 'Reseñas']} />
        <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

// ─── Shared empty state ──────────────────────────────────────────────────────

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="flex h-40 items-center justify-center rounded-lg bg-muted/40">
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
}
