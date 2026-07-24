"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useDestinationStore } from '@/stores/destination-store'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import {
  ShoppingCart,
  User,
  Ticket,
  CalendarCheck,
  Store,
  Shield,
  LogOut,
  MapPin,
  ChevronDown,
} from 'lucide-react'
import { ROUTES } from '@/lib/constants'
import { useCartStore } from '@/stores/cart-store'
import { signOutAction } from '@/actions/auth'

export function Header() {
  const { user, profile, loading } = useAuth()
  const rawItemCount = useCartStore((s) => s.items.length)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const itemCount = mounted ? rawItemCount : 0
  const pathname = usePathname()
  const activeSlug = useDestinationStore((s) => s.activeSlug)
  const slugMatch = pathname.match(/^\/destinations\/([^\/]+)/)
  const infoHref = ROUTES.destinationInfo(slugMatch ? slugMatch[1] : activeSlug)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full px-4 md:container md:mx-auto flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-primary">POORTAL</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center space-x-6 md:flex">
          {/* City switcher */}
          <Link
            href={ROUTES.destination(activeSlug || 'cancun')}
            className="flex items-center gap-1.5 rounded-xl py-1.5 px-2.5 transition-colors hover:bg-muted"
          >
            <MapPin className="h-4 w-4 text-primary shrink-0" strokeWidth={2} />
            <div className="flex flex-col leading-none">
              <span className="text-[10px] text-muted-foreground font-medium tracking-wide uppercase">Destino</span>
              <span className="text-sm font-bold text-foreground capitalize">
                {activeSlug || 'Cancun'}
              </span>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground mt-0.5" strokeWidth={2.5} />
          </Link>
          <Link
            href={infoHref}
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Info
          </Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center space-x-3">
          {/* Cart */}
          <Link href={ROUTES.cart} className="relative">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
            </Button>
            {itemCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                {itemCount}
              </Badge>
            )}
          </Link>

          {/* Auth */}
          {loading ? (
            <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
          ) : user && profile ? (
            <>
              {/* Mobile: avatar links directly to profile */}
              <Link
                href={profile.role === 'provider' ? ROUTES.providerProfile : ROUTES.profile}
                className="md:hidden"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profile.avatar_url || undefined} alt={profile.full_name || ''} />
                  <AvatarFallback>
                    {profile.full_name?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Link>

              {/* Desktop: full dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative hidden md:flex h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile.avatar_url || undefined} alt={profile.full_name || ''} />
                      <AvatarFallback>
                        {profile.full_name?.charAt(0)?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{profile.full_name}</p>
                      <p className="text-xs text-muted-foreground">{profile.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={profile.role === 'provider' ? ROUTES.providerProfile : ROUTES.profile}>
                      <User className="mr-2 h-4 w-4" />
                      Mi Perfil
                    </Link>
                  </DropdownMenuItem>
                  {profile.role === 'tourist' && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href={ROUTES.wallet}>
                          <Ticket className="mr-2 h-4 w-4" />
                          Mi Wallet
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={ROUTES.bookings}>
                          <CalendarCheck className="mr-2 h-4 w-4" />
                          Mis Reservas
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  {profile.role === 'provider' && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href={ROUTES.providerDashboard}>
                          <Store className="mr-2 h-4 w-4" />
                          Panel Proveedor
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  {profile.role === 'admin' && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href={ROUTES.adminDashboard}>
                          <Shield className="mr-2 h-4 w-4" />
                          Panel Admin
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <form action={signOutAction} className="w-full">
                      <button type="submit" className="flex w-full items-center text-destructive">
                        <LogOut className="mr-2 h-4 w-4" />
                        Cerrar Sesión
                      </button>
                    </form>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="hidden items-center space-x-2 md:flex">
              <Button variant="ghost" size="sm" asChild>
                <Link href={ROUTES.login}>Iniciar Sesion</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href={ROUTES.register}>Registrarse</Link>
              </Button>
            </div>
          )}

        </div>
      </div>
    </header>
  )
}
