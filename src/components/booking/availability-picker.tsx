'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Calendar, Clock } from 'lucide-react'

interface AvailabilitySlot {
  id: string
  date: string
  start_time: string
  end_time: string | null
  total_spots: number
  booked_spots: number
  price_override: number | null
}

interface AvailabilityPickerProps {
  slots: AvailabilitySlot[]
  basePrice: number
  currency: string
  onSelect: (slot: AvailabilitySlot) => void
  selectedSlotId?: string | null
}

export function AvailabilityPicker({
  slots,
  basePrice,
  currency,
  onSelect,
  selectedSlotId,
}: AvailabilityPickerProps) {
  // Group slots by date
  const grouped = slots.reduce<Record<string, AvailabilitySlot[]>>((acc, slot) => {
    if (!acc[slot.date]) acc[slot.date] = []
    acc[slot.date].push(slot)
    return acc
  }, {})

  const dates = Object.keys(grouped).sort()
  const [expandedDate, setExpandedDate] = useState<string | null>(dates[0] || null)

  if (slots.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-center">
        <Calendar className="mx-auto h-8 w-8 text-muted-foreground/50" />
        <p className="mt-2 text-sm text-muted-foreground">
          No hay fechas disponibles por el momento.
        </p>
      </div>
    )
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T12:00:00')
    return date.toLocaleDateString('es-MX', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatTime = (time: string) => time.slice(0, 5)

  const formatPrice = (amount: number) =>
    new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    }).format(amount)

  return (
    <div className="space-y-2">
      {dates.map((date) => (
        <div key={date} className="rounded-lg border">
          <button
            className="flex w-full items-center justify-between p-3 text-sm font-medium hover:bg-muted/50"
            onClick={() => setExpandedDate(expandedDate === date ? null : date)}
          >
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              {formatDate(date)}
            </span>
            <span className="text-xs text-muted-foreground">
              {grouped[date].length} {grouped[date].length === 1 ? 'horario' : 'horarios'}
            </span>
          </button>

          {expandedDate === date && (
            <div className="border-t p-3 space-y-2">
              {grouped[date].map((slot) => {
                const availableSpots = slot.total_spots - slot.booked_spots
                const effectivePrice = slot.price_override ?? basePrice
                const isSelected = selectedSlotId === slot.id

                return (
                  <button
                    key={slot.id}
                    className={cn(
                      'flex w-full items-center justify-between rounded-md border p-3 text-sm transition-colors',
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'hover:bg-muted/50',
                      availableSpots === 0 && 'opacity-50 cursor-not-allowed'
                    )}
                    onClick={() => availableSpots > 0 && onSelect(slot)}
                    disabled={availableSpots === 0}
                  >
                    <span className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      {formatTime(slot.start_time)}
                      {slot.end_time && ` - ${formatTime(slot.end_time)}`}
                    </span>
                    <div className="flex items-center gap-3">
                      <Badge variant={availableSpots > 3 ? 'secondary' : 'destructive'}>
                        {availableSpots} {availableSpots === 1 ? 'lugar' : 'lugares'}
                      </Badge>
                      {slot.price_override && slot.price_override !== basePrice && (
                        <span className="font-medium text-primary">
                          {formatPrice(effectivePrice)}
                        </span>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
