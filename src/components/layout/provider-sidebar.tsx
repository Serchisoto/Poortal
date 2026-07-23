"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/lib/constants'
import {
  LayoutDashboard,
  Package,
  CalendarCheck,
  BarChart3,
  CreditCard,
  Ban,
  HeadphonesIcon,
  QrCode,
  Bell,
  Settings,
  MoreHorizontal,
  LogOut,
} from 'lucide-react'
import { useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { signOutAction } from '@/actions/auth'

const providerNavItems = [
  { href: ROUTES.providerDashboard, label: 'Dashboard', icon: LayoutDashboard },
  { href: '/provider/experiences', label: 'Experiencias', icon: Package },
  { href: ROUTES.providerBookings, label: 'Reservas', icon: CalendarCheck },
  { href: '/provider/validator', label: 'Validador QR', icon: QrCode },
  { href: ROUTES.providerAnalytics, label: 'Analiticas', icon: BarChart3 },
  { href: ROUTES.providerPayments, label: 'Pagos', icon: CreditCard },
  { href: '/provider/cancellations', label: 'Cancelaciones', icon: Ban },
  { href: '/provider/notifications', label: 'Notificaciones', icon: Bell },
  { href: '/provider/profile', label: 'Mi Perfil', icon: Settings },
  { href: '/provider/support', label: 'Soporte', icon: HeadphonesIcon },
]

// Items shown in the mobile bottom bar
const mobileMainItems = providerNavItems.slice(0, 4)

export function ProviderSidebar() {
  const pathname = usePathname()
  const [moreOpen, setMoreOpen] = useState(false)

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r bg-muted/30 lg:block">
        <div className="flex h-full flex-col">
          <div className="p-6">
            <h2 className="text-lg font-semibold">Panel Proveedor</h2>
          </div>
          <nav className="flex-1 space-y-1 px-3">
            {providerNavItems.map((item) => {
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

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t bg-background flex items-center justify-around h-16">
        {mobileMainItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-2 text-[10px] font-medium transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          )
        })}
        <button
          onClick={() => setMoreOpen(true)}
          className="flex flex-col items-center gap-0.5 px-3 py-2 text-[10px] font-medium text-muted-foreground"
        >
          <MoreHorizontal className="h-5 w-5" />
          Más
        </button>
      </nav>

      {/* "More" sheet for remaining items */}
      <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
        <SheetContent side="bottom" className="h-auto pb-safe">
          <SheetHeader>
            <SheetTitle>Menú</SheetTitle>
          </SheetHeader>
          <div className="grid grid-cols-3 gap-2 p-4">
            {providerNavItems.slice(4).map((item) => {
              const isActive = pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMoreOpen(false)}
                  className={cn(
                    'flex flex-col items-center gap-1.5 rounded-xl p-3 text-xs font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              )
            })}
          </div>
          <div className="border-t px-4 pb-4">
            <form action={signOutAction} className="w-full">
              <button
                type="submit"
                className="flex w-full items-center gap-2 rounded-xl p-3 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
              >
                <LogOut className="h-5 w-5" />
                Cerrar Sesión
              </button>
            </form>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
