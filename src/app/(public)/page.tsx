import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/lib/constants'

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center bg-background">
      <h1 className="text-4xl font-bold tracking-tight text-primary mb-4">
        POORTAL
      </h1>
      <p className="text-lg text-muted-foreground max-w-md mb-8">
        Your digital concierge for the best travel experiences.
      </p>

      <Button asChild size="lg" className="rounded-full px-8">
        <Link href={ROUTES.destination('cancun')}>
          Explore Cancun
        </Link>
      </Button>
    </div>
  )
}
