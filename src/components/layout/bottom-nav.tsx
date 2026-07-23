'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, Wallet, ConciergeBell } from 'lucide-react'
import { ROUTES } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { useDestinationStore } from '@/stores/destination-store'

export function BottomNav() {
  const pathname = usePathname()
  const activeSlug = useDestinationStore((s) => s.activeSlug)

  const isWallet  = pathname.startsWith('/wallet') || pathname.startsWith('/bookings')
  const isInfo    = pathname.includes('/info')
  const isHome    = !isWallet && !isInfo

  // Hide on booking flow — it has its own bottom bar
  if (pathname.endsWith('/book')) return null

  const match   = pathname.match(/^\/destinations\/([^\/]+)/)
  const infoHref = ROUTES.destinationInfo(match ? match[1] : activeSlug)
  const homeHref = match
    ? ROUTES.destination(match[1])
    : activeSlug
      ? ROUTES.destination(activeSlug)
      : ROUTES.home

  return (
    <nav
      aria-label="Navegación principal"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur-sm pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <div className="flex h-16 items-end justify-around px-8 pb-2">

        {/* Revista — Destination Info */}
        <Link
          href={infoHref}
          className={cn(
            'flex flex-col items-center gap-1 pb-1 transition-colors',
            isInfo ? 'text-primary' : 'text-muted-foreground'
          )}
        >
          <BookOpen className="h-6 w-6" strokeWidth={isInfo ? 2.5 : 1.75} />
          <span className={cn('text-[10px] font-semibold leading-none', isInfo ? 'text-primary' : 'text-muted-foreground')}>
            Revista
          </span>
        </Link>

        {/* Concierge — center FAB */}
        <Link href={homeHref} className="relative -top-4 flex flex-col items-center gap-1">
          <span
            className={cn(
              'flex h-14 w-14 items-center justify-center rounded-full shadow-lg ring-4 ring-background transition-colors',
              isHome
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground'
            )}
          >
            <ConciergeBell className="h-6 w-6" strokeWidth={isHome ? 2.5 : 1.75} />
          </span>
          <span className={cn('text-[10px] font-semibold leading-none', isHome ? 'text-primary' : 'text-muted-foreground')}>
            Concierge
          </span>
        </Link>

        {/* Wallet */}
        <Link
          href={ROUTES.wallet}
          className={cn(
            'flex flex-col items-center gap-1 pb-1 transition-colors',
            isWallet ? 'text-primary' : 'text-muted-foreground'
          )}
        >
          <Wallet className="h-6 w-6" strokeWidth={isWallet ? 2.5 : 1.75} />
          <span className={cn('text-[10px] font-semibold leading-none', isWallet ? 'text-primary' : 'text-muted-foreground')}>
            Wallet
          </span>
        </Link>

      </div>
    </nav>
  )
}
