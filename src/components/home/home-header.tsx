'use client'

import Link from 'next/link'
import { ShoppingCart, User } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useCartStore } from '@/stores/cart-store'
import { ROUTES } from '@/lib/constants'

export function HomeHeader() {
  const { user, profile } = useAuth()
  const itemCount = useCartStore((s) => s.items.length)

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-background sticky top-0 z-10 md:hidden">
      <div className="text-primary font-bold text-xl tracking-wider">
        POORTAL
      </div>

      {/* Right: avatar + cart */}
      <div className="flex items-center gap-3">
        <Link href={ROUTES.cart} className="relative">
          <div className="h-9 w-9 flex items-center justify-center">
            <ShoppingCart className="h-6 w-6 text-foreground" />
            {itemCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                {itemCount}
              </Badge>
            )}
          </div>
        </Link>

        <Link href={user ? ROUTES.profile : ROUTES.login}>
          {user && profile ? (
            <Avatar className="h-9 w-9">
              <AvatarImage src={profile.avatar_url || undefined} alt={profile.full_name || ''} />
              <AvatarFallback>
                {profile.full_name?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
          ) : (
            <div className="h-9 w-9 rounded-full bg-slate-200 flex items-center justify-center">
              <User className="h-5 w-5 text-muted-foreground" />
            </div>
          )}
        </Link>
      </div>
    </header>
  )
}
