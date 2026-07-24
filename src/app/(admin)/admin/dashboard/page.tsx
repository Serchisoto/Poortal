export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import { ROUTES } from '@/lib/constants'
import {
  Users,
  Building2,
  Compass,
  CalendarCheck,
  DollarSign,
  AlertTriangle,
  ChevronRight,
  Store,
  Settings,
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
      title: 'Usuarios',
      value: totalUsers,
      sub: 'Total registrados',
      icon: Users,
      href: ROUTES.adminUsers,
      accent: false,
    },
    {
      title: 'Proveedores activos',
      value: activeProviders,
      sub: pendingProviders > 0 ? `${pendingProviders} pendientes` : 'Todos aprobados',
      icon: Building2,
      href: ROUTES.adminProviders,
      accent: pendingProviders > 0,
    },
    {
      title: 'Experiencias activas',
      value: activeExperiences,
      sub: pendingExperiences > 0 ? `${pendingExperiences} en revision` : 'Sin pendientes',
      icon: Compass,
      href: ROUTES.adminExperiences,
      accent: pendingExperiences > 0,
    },
    {
      title: 'Reservas del mes',
      value: monthBookings,
      sub: 'Mes actual',
      icon: CalendarCheck,
      href: ROUTES.adminPayments,
      accent: false,
    },
    {
      title: 'Ingresos del mes',
      value: '—',
      sub: 'Stripe pendiente',
      icon: DollarSign,
      href: ROUTES.adminPayments,
      accent: false,
    },
    {
      title: 'Cancelaciones',
      value: pendingDisputes,
      sub: 'Total registradas',
      icon: AlertTriangle,
      href: ROUTES.adminDisputes,
      accent: pendingDisputes > 0,
    },
  ]

  const quickLinks = [
    { href: ROUTES.adminProviders, label: 'Gestionar proveedores', icon: Store, badge: pendingProviders },
    { href: ROUTES.adminExperiences, label: 'Moderar experiencias', icon: Compass, badge: pendingExperiences },
    { href: ROUTES.adminUsers, label: 'Ver usuarios', icon: Users, badge: 0 },
    { href: ROUTES.adminSettings, label: 'Configuracion', icon: Settings, badge: 0 },
  ]

  return (
    <div className="space-y-6 pb-2">

      {/* Stats grid — 2 columns on mobile, 3 on lg */}
      <section>
        <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">Resumen general</h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          {stats.map((stat) => (
            <Link
              key={stat.title}
              href={stat.href}
              className="group relative flex flex-col gap-2 rounded-2xl border bg-card p-4 transition-colors hover:bg-muted/50 active:bg-muted/50"
            >
              <div className="flex items-center justify-between">
                <div className={`rounded-xl p-2 ${stat.accent ? 'bg-destructive/10' : 'bg-primary/10'}`}>
                  <stat.icon className={`h-4 w-4 ${stat.accent ? 'text-destructive' : 'text-primary'}`} strokeWidth={2} />
                </div>
                {stat.accent && (
                  <span className="h-2 w-2 rounded-full bg-destructive" />
                )}
              </div>
              <div>
                <p className="text-2xl font-bold leading-none">{stat.value}</p>
                <p className="mt-1 text-xs font-semibold leading-none text-foreground">{stat.title}</p>
                <p className={`mt-0.5 text-[11px] leading-tight ${stat.accent ? 'text-destructive font-semibold' : 'text-muted-foreground'}`}>
                  {stat.sub}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick actions */}
      <section>
        <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">Acciones rapidas</h2>
        <div className="flex flex-col gap-2">
          {quickLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-4 rounded-2xl border bg-card px-4 py-3.5 transition-colors hover:bg-muted/50 active:bg-muted/50"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <item.icon className="h-4 w-4 text-primary" strokeWidth={2} />
              </div>
              <span className="flex-1 text-sm font-semibold">{item.label}</span>
              {item.badge > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-[11px] font-bold text-destructive-foreground">
                  {item.badge}
                </span>
              )}
              <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
            </Link>
          ))}
        </div>
      </section>

    </div>
  )
}
