'use client'

import Link from 'next/link'
import { ShoppingCart, User, MapPin, ChevronDown } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useCartStore } from '@/stores/cart-store'
import { useDestinationStore } from '@/stores/destination-store'
import { ROUTES } from '@/lib/constants'

export function HomeHeader() {
  const { user, profile } = useAuth()
  const itemCount = useCartStore((s) => s.items.length)
  const activeSlug = useDestinationStore((s) => s.activeSlug)

  // Derive a display name from the slug (e.g. "cancun" → "Cancún")
  const cityLabel = activeSlug
    ? activeSlug.charAt(0).toUpperCase() + activeSlug.slice(1)
    : 'Ciudad'

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-background sticky top-0 z-10 border-b border-border/60 md:hidden">

      {/* Left: city selector */}
      <Link
        href={ROUTES.home}
        className="flex items-center gap-1.5 rounded-xl py-1.5 px-2 -ml-1 active:bg-muted transition-colors"
      >
        <MapPin className="h-4 w-4 text-primary shrink-0" strokeWidth={2} />
        <div className="flex flex-col leading-none">
          <span className="text-[10px] text-muted-foreground font-medium tracking-wide uppercase">Destino</span>
          <span className="text-sm font-bold text-foreground">{cityLabel}</span>
        </div>
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground mt-0.5" strokeWidth={2.5} />
      </Link>

      {/* Center: wordmark */}
      <span className="absolute left-1/2 -translate-x-1/2 text-primary font-bold text-lg tracking-widest pointer-events-none select-none">
        POORTAL
      </span>

      {/* Right: cart + avatar */}
      <div className="flex items-center gap-2">
        <Link href={ROUTES.cart} className="relative h-9 w-9 flex items-center justify-center">
          <ShoppingCart className="h-5 w-5 text-foreground/80" />
          {itemCount > 0 && (
            <Badge className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full p-0 text-[9px] flex items-center justify-center">
              {itemCount}
            </Badge>
          )}
        </Link>

        <Link href={user ? ROUTES.profile : ROUTES.login}>
          {user && profile ? (
            <Avatar className="h-8 w-8">
              <AvatarImage src={profile.avatar_url || undefined} alt={profile.full_name || ''} />
              <AvatarFallback className="text-xs">
                {profile.full_name?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
          ) : (
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
              <User className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
        </Link>
      </div>
    </header>
  )
}
