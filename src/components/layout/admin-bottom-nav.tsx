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
  MoreHorizontal,
} from 'lucide-react'
import { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { MapPin, AlertTriangle, CreditCard, Settings } from 'lucide-react'

// Primary nav items shown in the bottom bar (max 4 + more)
const primaryItems = [
  { href: ROUTES.adminDashboard, label: 'Dashboard', icon: LayoutDashboard },
  { href: ROUTES.adminProviders, label: 'Proveedores', icon: Store },
  { href: ROUTES.adminExperiences, label: 'Experiencias', icon: Package },
  { href: ROUTES.adminUsers, label: 'Usuarios', icon: Users },
]

// Secondary items in the "More" sheet
const moreItems = [
  { href: ROUTES.adminDestinations, label: 'Destinos', icon: MapPin },
  { href: ROUTES.adminDisputes, label: 'Disputas', icon: AlertTriangle },
  { href: ROUTES.adminPayments, label: 'Pagos', icon: CreditCard },
  { href: ROUTES.adminSettings, label: 'Configuracion', icon: Settings },
]

export function AdminBottomNav() {
  const pathname = usePathname()
  const [moreOpen, setMoreOpen] = useState(false)

  return (
    <>
      <nav
        aria-label="Navegacion admin"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur-sm pb-[env(safe-area-inset-bottom)] lg:hidden"
      >
        <div className="flex h-16 items-end justify-around px-2 pb-2">
          {primaryItems.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-1 pb-1 px-3 transition-colors',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                <item.icon className="h-6 w-6" strokeWidth={isActive ? 2.5 : 1.75} />
                <span className={cn('text-[10px] font-semibold leading-none', isActive ? 'text-primary' : 'text-muted-foreground')}>
                  {item.label}
                </span>
              </Link>
            )
          })}

          {/* More button */}
          <button
            onClick={() => setMoreOpen(true)}
            className={cn(
              'flex flex-col items-center gap-1 pb-1 px-3 transition-colors',
              moreItems.some((i) => pathname.startsWith(i.href)) ? 'text-primary' : 'text-muted-foreground'
            )}
            aria-label="Mas opciones"
          >
            <MoreHorizontal className="h-6 w-6" strokeWidth={1.75} />
            <span className="text-[10px] font-semibold leading-none">Mas</span>
          </button>
        </div>
      </nav>

      {/* More options sheet */}
      <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl pb-[env(safe-area-inset-bottom)]">
          <SheetHeader className="pb-4">
            <SheetTitle className="text-base font-bold">Panel Admin</SheetTitle>
          </SheetHeader>
          <div className="grid grid-cols-2 gap-2 pb-6">
            {moreItems.map((item) => {
              const isActive = pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMoreOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-4 py-3.5 transition-colors',
                    isActive ? 'bg-primary/10 text-primary' : 'hover:bg-muted active:bg-muted text-foreground'
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" strokeWidth={isActive ? 2.5 : 1.75} />
                  <span className="font-semibold text-sm">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
