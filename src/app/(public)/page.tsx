import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/lib/constants'

export default function LandingPage() {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center p-6 text-center bg-background">
      {/* Logo */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/poortal-logo.png"
        alt="Poortal"
        className="h-36 w-auto object-contain mb-6 select-none"
      />

      <p className="text-base text-muted-foreground max-w-xs mb-1 font-sans leading-relaxed">
        Tu concierge digital para las mejores experiencias de viaje.
      </p>
      <p className="text-xs tracking-[0.25em] uppercase text-primary/60 mb-10 font-semibold">
        — just ask —
      </p>

      <Button asChild size="lg" className="rounded-full px-10 h-12 text-sm font-semibold tracking-wide">
        <Link href={ROUTES.destination('cancun')}>
          Explorar Cancún
        </Link>
      </Button>
    </div>
  )
}
