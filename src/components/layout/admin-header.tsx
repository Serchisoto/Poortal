"use client"

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronLeft, LogOut, User, Shield } from 'lucide-react'
import { signOutAction } from '@/actions/auth'
import { ROUTES } from '@/lib/constants'
import { cn } from '@/lib/utils'

const PAGE_TITLES: Record<string, string> = {
  [ROUTES.adminDashboard]: 'Dashboard',
  [ROUTES.adminProviders]: 'Proveedores',
  [ROUTES.adminExperiences]: 'Experiencias',
  [ROUTES.adminUsers]: 'Usuarios',
  [ROUTES.adminDestinations]: 'Destinos',
  [ROUTES.adminDisputes]: 'Disputas',
  [ROUTES.adminPayments]: 'Pagos',
  [ROUTES.adminSettings]: 'Configuracion',
}

export function AdminHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const [, startTransition] = useTransition()
  const { profile } = useAuth()

  // Determine page title — match deepest first
  const title =
    Object.entries(PAGE_TITLES)
      .sort((a, b) => b[0].length - a[0].length)
      .find(([route]) => pathname.startsWith(route))?.[1] ?? 'Admin'

  const isDashboard = pathname === ROUTES.adminDashboard || pathname === '/admin'

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center gap-3 px-4">

        {/* Left: back button or wordmark */}
        <div className="flex w-10 shrink-0 items-center">
          {!isDashboard ? (
            <button
              onClick={() => startTransition(() => router.back())}
              className="flex h-9 w-9 items-center justify-center rounded-xl transition-colors hover:bg-muted active:bg-muted"
              aria-label="Volver"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={2.5} />
            </button>
          ) : (
            <Link
              href={ROUTES.home}
              className="text-xs font-bold tracking-widest text-primary"
            >
              PRT
            </Link>
          )}
        </div>

        {/* Center: page title */}
        <div className="flex-1 text-center">
          <span className="text-sm font-bold leading-none">{title}</span>
          <span className="block text-[10px] font-semibold uppercase tracking-widest text-muted-foreground leading-none mt-0.5">
            Panel Admin
          </span>
        </div>

        {/* Right: avatar dropdown */}
        <div className="flex w-10 shrink-0 items-center justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="flex h-8 w-8 items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Opciones de cuenta"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.full_name || ''} />
                  <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
                    {profile?.full_name?.charAt(0)?.toUpperCase() || 'A'}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              {profile && (
                <>
                  <div className="px-3 py-2">
                    <p className="text-sm font-semibold leading-none">{profile.full_name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{profile.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem asChild>
                <Link href={ROUTES.profile} className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Mi Perfil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={ROUTES.adminDashboard} className="cursor-pointer">
                  <Shield className="mr-2 h-4 w-4" />
                  Inicio Admin
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <form action={signOutAction} className="w-full">
                  <button type="submit" className="flex w-full items-center text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar Sesion
                  </button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

      </div>
    </header>
  )
}
