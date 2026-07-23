'use client'

import { useEffect } from 'react'
import { Compass } from 'lucide-react'

interface TourLoadingProps {
  onComplete: () => void
}

export function TourLoading({ onComplete }: TourLoadingProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2500)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="relative mb-8">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <Compass className="h-10 w-10 text-primary animate-spin" style={{ animationDuration: '3s' }} />
        </div>
        {/* Pulse ring */}
        <div className="absolute inset-0 animate-ping rounded-full bg-primary/10" style={{ animationDuration: '2s' }} />
      </div>

      <p className="text-sm font-semibold text-primary">Poortal:</p>
      <h2 className="mt-1 text-xl font-semibold text-foreground text-center">
        Finding the best tours for you...
      </h2>
      <p className="mt-2 text-sm text-muted-foreground text-center">
        Searching across verified providers
      </p>

      {/* Progress dots */}
      <div className="mt-8 flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-2 w-2 rounded-full bg-primary animate-bounce"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  )
}
