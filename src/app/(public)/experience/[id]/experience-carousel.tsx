'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Heart, ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ExperienceCarouselProps {
  images: Array<{ id: string; url: string; alt_text: string | null; sort_order: number; is_cover: boolean }>
  title: string
  description: string
}

export function ExperienceCarousel({ images, title, description }: ExperienceCarouselProps) {
  const sorted = [...images].sort((a, b) => {
    if (a.is_cover && !b.is_cover) return -1
    if (!a.is_cover && b.is_cover) return 1
    return a.sort_order - b.sort_order
  })

  const [current, setCurrent] = useState(0)
  const [liked, setLiked] = useState(false)
  const [expanded, setExpanded] = useState(false)

  if (sorted.length === 0) {
    return (
      <div className="relative w-full aspect-[4/3] bg-slate-100 rounded-xl flex items-center justify-center">
        <ImageIcon className="h-12 w-12 text-slate-300" />
      </div>
    )
  }

  return (
    <div
      className="relative w-full aspect-[4/3] overflow-hidden rounded-xl"
      onTouchStart={(e) => {
        const startX = e.touches[0].clientX
        const handleEnd = (ev: TouchEvent) => {
          const diff = startX - ev.changedTouches[0].clientX
          if (Math.abs(diff) > 50) {
            setCurrent((prev) =>
              diff > 0
                ? Math.min(sorted.length - 1, prev + 1)
                : Math.max(0, prev - 1)
            )
          }
          document.removeEventListener('touchend', handleEnd)
        }
        document.addEventListener('touchend', handleEnd)
      }}
    >
      {/* Image */}
      <Image
        src={sorted[current].url}
        alt={sorted[current].alt_text || title}
        fill
        className="object-cover"
        sizes="100vw"
        priority
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

      {/* Text overlay */}
      <div className="absolute bottom-10 left-4 right-12">
        <p className="text-white font-bold text-sm leading-tight mb-1">{title}</p>
        <p className={cn('text-white/80 text-xs leading-snug', !expanded && 'line-clamp-3')}>
          {description}
        </p>
        {description.length > 120 && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="text-white/60 text-xs underline mt-0.5"
          >
            {expanded ? 'less' : '... more'}
          </button>
        )}
      </div>

      {/* Heart */}
      <button
        onClick={() => setLiked((v) => !v)}
        className="absolute bottom-10 right-4 active:scale-95 transition-transform"
      >
        <Heart
          className={cn('h-6 w-6 transition-colors', liked ? 'fill-red-500 text-red-500' : 'text-white')}
        />
      </button>

      {/* Dots */}
      {sorted.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
          {sorted.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={cn(
                'rounded-full transition-all',
                i === current ? 'h-2 w-4 bg-teal-500' : 'h-2 w-2 bg-white/50'
              )}
            />
          ))}
        </div>
      )}
    </div>
  )
}
