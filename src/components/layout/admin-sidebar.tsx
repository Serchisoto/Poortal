"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/lib/constants'
import {
  LayoutDashboard,
  Store,
  Package,
  Users,
  MapPin,
  AlertTriangle,
  CreditCard,
  Settings,
} from 'lucide-react'

const adminNavItems = [
  { href: ROUTES.adminDashboard, label: 'Dashboard', icon: LayoutDashboard },
  { href: ROUTES.adminProviders, label: 'Proveedores', icon: Store },
  { href: ROUTES.adminExperiences, label: 'Experiencias', icon: Package },
  { href: ROUTES.adminUsers, label: 'Usuarios', icon: Users },
  { href: ROUTES.adminDestinations, label: 'Destinos', icon: MapPin },
  { href: ROUTES.adminDisputes, label: 'Disputas', icon: AlertTriangle },
  { href: ROUTES.adminPayments, label: 'Pagos', icon: CreditCard },
  { href: ROUTES.adminSettings, label: 'Configuracion', icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-64 shrink-0 border-r bg-muted/30 lg:block">
      <div className="flex h-full flex-col">
        <div className="p-6">
          <h2 className="text-lg font-semibold">Panel Admin</h2>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {adminNavItems.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
