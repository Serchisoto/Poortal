"use client"

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
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
  ChevronRight,
  Check,
} from 'lucide-react'
import { ROUTES } from '@/lib/constants'
import { useCartStore } from '@/stores/cart-store'
import { signOutAction } from '@/actions/auth'
import { cn } from '@/lib/utils'

// Destinations are fetched client-side for the picker
async function fetchDestinations() {
  const res = await fetch('/api/destinations', { cache: 'no-store' })
  if (!res.ok) return []
  const data = await res.json()
  return data.destinations as { id: string; name: string; slug: string }[]
}

export function Header() {
  const { user, profile, loading } = useAuth()
  const rawItemCount = useCartStore((s) => s.items.length)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const itemCount = mounted ? rawItemCount : 0
  const pathname = usePathname()
  const router = useRouter()
  const [, startTransition] = useTransition()
  const activeSlug = useDestinationStore((s) => s.activeSlug)
  const setActiveSlug = useDestinationStore((s) => s.setActiveSlug)
  const slugMatch = pathname.match(/^\/destinations\/([^\/]+)/)
  const infoHref = ROUTES.destinationInfo(slugMatch ? slugMatch[1] : activeSlug)

  // City picker sheet state
  const [cityOpen, setCityOpen] = useState(false)
  const [destinations, setDestinations] = useState<{ id: string; name: string; slug: string }[]>([])

  function openCityPicker() {
    setCityOpen(true)
    fetchDestinations().then(setDestinations)
  }

  function selectDestination(slug: string) {
    setActiveSlug(slug)
    setCityOpen(false)
    startTransition(() => router.push(ROUTES.destination(slug)))
  }

  // Mobile profile sheet state
  const [profileOpen, setProfileOpen] = useState(false)

  const cityLabel = activeSlug
    ? activeSlug.charAt(0).toUpperCase() + activeSlug.slice(1)
    : 'Ciudad'

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="w-full px-4 md:container md:mx-auto flex h-14 items-center justify-between gap-3">

          {/* Left: city picker (mobile) + logo (desktop) */}
          <div className="flex items-center gap-3">
            {/* City button — visible on all sizes */}
            <button
              onClick={openCityPicker}
              className="flex items-center gap-1.5 rounded-xl py-1.5 px-2 -ml-1 transition-colors hover:bg-muted active:bg-muted"
              aria-label="Cambiar destino"
            >
              <MapPin className="h-4 w-4 text-primary shrink-0" strokeWidth={2} />
              <div className="flex flex-col leading-none">
                <span className="text-[9px] text-muted-foreground font-semibold tracking-widest uppercase">Destino</span>
                <span className="text-sm font-bold text-foreground capitalize leading-tight">{cityLabel}</span>
              </div>
              <ChevronDown className="h-3 w-3 text-muted-foreground" strokeWidth={2.5} />
            </button>
          </div>

          {/* Center: wordmark */}
          <Link href={activeSlug ? ROUTES.destination(activeSlug) : ROUTES.home} className="absolute left-1/2 -translate-x-1/2">
            <span className="text-primary font-bold text-lg tracking-widest select-none">POORTAL</span>
          </Link>

          {/* Right: cart + auth */}
          <div className="flex items-center gap-1">
            {/* Cart */}
            <Link href={ROUTES.cart} className="relative h-9 w-9 flex items-center justify-center rounded-xl hover:bg-muted transition-colors">
              <ShoppingCart className="h-5 w-5 text-foreground/80" />
              {itemCount > 0 && (
                <Badge className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full p-0 text-[9px] flex items-center justify-center">
                  {itemCount}
                </Badge>
              )}
            </Link>

            {/* Auth */}
            {loading ? (
              <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
            ) : user && profile ? (
              <>
                {/* Mobile: avatar opens profile sheet */}
                <button
                  onClick={() => setProfileOpen(true)}
                  className="md:hidden"
                  aria-label="Perfil"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profile.avatar_url || undefined} alt={profile.full_name || ''} />
                    <AvatarFallback className="text-xs font-bold">
                      {profile.full_name?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </button>

                {/* Desktop: dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative hidden md:flex h-8 w-8 rounded-full p-0">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={profile.avatar_url || undefined} alt={profile.full_name || ''} />
                        <AvatarFallback className="text-xs font-bold">
                          {profile.full_name?.charAt(0)?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <div className="flex items-center gap-2 p-2">
                      <div className="flex flex-col space-y-0.5 leading-none">
                        <p className="font-semibold text-sm">{profile.full_name}</p>
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
                          Cerrar Sesion
                        </button>
                      </form>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                {/* Mobile: login icon */}
                <Link href={ROUTES.login} className="md:hidden h-9 w-9 flex items-center justify-center rounded-xl hover:bg-muted transition-colors">
                  <User className="h-5 w-5 text-foreground/70" />
                </Link>
                {/* Desktop: login + register buttons */}
                <div className="hidden items-center gap-2 md:flex">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={ROUTES.login}>Iniciar Sesion</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href={ROUTES.register}>Registrarse</Link>
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* City Picker Sheet */}
      <Sheet open={cityOpen} onOpenChange={setCityOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl pb-[env(safe-area-inset-bottom)]">
          <SheetHeader className="pb-4">
            <SheetTitle className="text-base font-bold">Elige tu destino</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-2 pb-4">
            {destinations.length === 0 ? (
              <div className="flex flex-col gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-14 rounded-xl bg-muted animate-pulse" />
                ))}
              </div>
            ) : (
              destinations.map((dest) => (
                <button
                  key={dest.id}
                  onClick={() => selectDestination(dest.slug)}
                  className={cn(
                    'flex items-center justify-between rounded-xl px-4 py-3.5 text-left transition-colors',
                    activeSlug === dest.slug
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-muted active:bg-muted'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 shrink-0" strokeWidth={2} />
                    <span className="font-semibold capitalize">{dest.name}</span>
                  </div>
                  {activeSlug === dest.slug ? (
                    <Check className="h-4 w-4" strokeWidth={2.5} />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
              ))
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Mobile Profile Sheet */}
      <Sheet open={profileOpen} onOpenChange={setProfileOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl pb-[env(safe-area-inset-bottom)]">
          <SheetHeader className="pb-2">
            <SheetTitle className="sr-only">Menu de perfil</SheetTitle>
            {profile && (
              <div className="flex items-center gap-3 px-1 pb-2">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={profile.avatar_url || undefined} alt={profile.full_name || ''} />
                  <AvatarFallback className="text-base font-bold">
                    {profile.full_name?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-bold text-sm leading-tight">{profile.full_name}</span>
                  <span className="text-xs text-muted-foreground">{profile.email}</span>
                </div>
              </div>
            )}
          </SheetHeader>

          {profile && (
            <div className="flex flex-col gap-1 pb-4">
              <SheetMenuLink
                href={profile.role === 'provider' ? ROUTES.providerProfile : ROUTES.profile}
                icon={<User className="h-4 w-4" />}
                label="Mi Perfil"
                onClick={() => setProfileOpen(false)}
              />
              {profile.role === 'tourist' && (
                <>
                  <SheetMenuLink
                    href={ROUTES.wallet}
                    icon={<Ticket className="h-4 w-4" />}
                    label="Mi Wallet"
                    onClick={() => setProfileOpen(false)}
                  />
                  <SheetMenuLink
                    href={ROUTES.bookings}
                    icon={<CalendarCheck className="h-4 w-4" />}
                    label="Mis Reservas"
                    onClick={() => setProfileOpen(false)}
                  />
                </>
              )}
              {profile.role === 'provider' && (
                <SheetMenuLink
                  href={ROUTES.providerDashboard}
                  icon={<Store className="h-4 w-4" />}
                  label="Panel Proveedor"
                  onClick={() => setProfileOpen(false)}
                />
              )}
              {profile.role === 'admin' && (
                <SheetMenuLink
                  href={ROUTES.adminDashboard}
                  icon={<Shield className="h-4 w-4" />}
                  label="Panel Admin"
                  onClick={() => setProfileOpen(false)}
                />
              )}
              <div className="mt-2 border-t pt-2">
                <form action={signOutAction}>
                  <button
                    type="submit"
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-destructive hover:bg-destructive/5 active:bg-destructive/5 transition-colors"
                  >
                    <LogOut className="h-4 w-4 shrink-0" />
                    <span className="font-semibold text-sm">Cerrar Sesion</span>
                  </button>
                </form>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}

function SheetMenuLink({
  href,
  icon,
  label,
  onClick,
}: {
  href: string
  icon: React.ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 rounded-xl px-4 py-3.5 hover:bg-muted active:bg-muted transition-colors"
    >
      <span className="text-muted-foreground shrink-0">{icon}</span>
      <span className="font-semibold text-sm">{label}</span>
      <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground/50" />
    </Link>
  )
}
