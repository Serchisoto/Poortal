export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import prisma from '@/lib/prisma'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Users,
  Building2,
  Compass,
  CalendarCheck,
  DollarSign,
  AlertTriangle,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Admin Dashboard',
}

export default async function AdminDashboardPage() {
  const [
    totalUsers,
    activeProviders,
    pendingProviders,
    activeExperiences,
    pendingExperiences,
    monthBookings,
    pendingDisputes,
  ] = await Promise.all([
    prisma.profiles.count(),
    prisma.provider_profiles.count({ where: { status: 'active' } }),
    prisma.provider_profiles.count({ where: { status: 'pending_review' } }),
    prisma.experiences.count({ where: { status: 'active' } }),
    prisma.experiences.count({ where: { status: 'pending_review' } }),
    prisma.bookings.count({
      where: {
        created_at: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
        status: { notIn: ['cancelled', 'refunded'] },
      },
    }),
    prisma.cancellations.count(),
  ])

  const stats = [
    {
      title: 'Total usuarios',
      value: totalUsers.toString(),
      description: 'Registrados en la plataforma',
      icon: Users,
    },
    {
      title: 'Proveedores activos',
      value: activeProviders.toString(),
      description: `${pendingProviders} pendientes de aprobacion`,
      icon: Building2,
    },
    {
      title: 'Experiencias activas',
      value: activeExperiences.toString(),
      description: `${pendingExperiences} en revision`,
      icon: Compass,
    },
    {
      title: 'Reservas del mes',
      value: monthBookings.toString(),
      description: 'Mes actual',
      icon: CalendarCheck,
    },
    {
      title: 'Ingresos del mes',
      value: '—',
      description: 'Stripe no configurado aun',
      icon: DollarSign,
    },
    {
      title: 'Cancelaciones pendientes',
      value: pendingDisputes.toString(),
      description: 'Total registradas',
      icon: AlertTriangle,
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Panel de Administracion
        </h1>
        <p className="mt-1 text-muted-foreground">
          Resumen general de la plataforma POORTAL
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="mt-1 text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
