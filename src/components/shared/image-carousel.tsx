'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageCarouselProps {
  images: Array<{ id: string; url: string; alt_text: string | null; sort_order: number; is_cover: boolean }>
  className?: string
}

export function ImageCarousel({ images, className }: ImageCarouselProps) {
  const sorted = [...images].sort((a, b) => {
    if (a.is_cover && !b.is_cover) return -1
    if (!a.is_cover && b.is_cover) return 1
    return a.sort_order - b.sort_order
  })

  const [current, setCurrent] = useState(0)

  if (sorted.length === 0) {
    return (
      <div className={cn('flex items-center justify-center rounded-lg bg-muted aspect-[16/9]', className)}>
        <ImageIcon className="h-12 w-12 text-muted-foreground/30" />
      </div>
    )
  }

  return (
    <div className={cn('relative overflow-hidden rounded-lg', className)}>
      <div className="relative aspect-[16/9]">
        <Image
          src={sorted[current].url}
          alt={sorted[current].alt_text || 'Imagen de experiencia'}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 66vw"
          priority={current === 0}
        />
      </div>

      {sorted.length > 1 && (
        <>
          <Button
            variant="secondary"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full opacity-80 hover:opacity-100"
            onClick={() => setCurrent((prev) => (prev === 0 ? sorted.length - 1 : prev - 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full opacity-80 hover:opacity-100"
            onClick={() => setCurrent((prev) => (prev === sorted.length - 1 ? 0 : prev + 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
            {sorted.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={cn(
                  'h-2 w-2 rounded-full transition-colors',
                  i === current ? 'bg-white' : 'bg-white/50'
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
