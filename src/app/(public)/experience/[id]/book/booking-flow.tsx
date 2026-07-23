'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, Info, Minus, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCartStore } from '@/stores/cart-store'

interface ExperienceInfo {
  id: string
  title: string
  shortDescription: string | null
  coverImageUrl: string | null
  providerName: string
  providerId: string
  priceAmount: number
  priceCurrency: string
  pricingType: 'per_person' | 'per_group' | 'flat_rate'
  maxCapacity: number
  subcategoryName: string | null
}

interface AvailabilitySlot {
  id: string
  date: string
  start_time: string
  end_time: string | null
  total_spots: number
  booked_spots: number
  price_override: number | null
}

const DAY_LABELS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function BookingFlow({
  experience,
  availability,
}: {
  experience: ExperienceInfo
  availability: AvailabilitySlot[]
}) {
  const router = useRouter()
  const addItem = useCartStore((s) => s.addItem)

  // Group slots by date
  const slotsByDate = useMemo(() => {
    const map: Record<string, AvailabilitySlot[]> = {}
    availability.forEach((slot) => {
      if (!map[slot.date]) map[slot.date] = []
      map[slot.date].push(slot)
    })
    return map
  }, [availability])

  const dates = Object.keys(slotsByDate).sort().slice(0, 7)

  const [selectedDate, setSelectedDate] = useState<string>(dates[0] || '')
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(
    dates[0] ? slotsByDate[dates[0]][0] : null
  )
  const [quantity, setQuantity] = useState(1)

  const timeSlotsForDate = selectedDate ? slotsByDate[selectedDate] || [] : []

  const effectivePrice = selectedSlot?.price_override ?? experience.priceAmount
  const total = experience.pricingType === 'per_person' ? effectivePrice * quantity : effectivePrice
  const availableSpots = selectedSlot
    ? selectedSlot.total_spots - selectedSlot.booked_spots
    : experience.maxCapacity

  const formattedTotal = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: experience.priceCurrency || 'MXN',
    minimumFractionDigits: 2,
  }).format(total)

  function handleSelectDate(date: string) {
    setSelectedDate(date)
    const slots = slotsByDate[date] || []
    setSelectedSlot(slots[0] || null)
    setQuantity(1)
  }

  function handleContinue() {
    if (!selectedSlot) return
    addItem({
      experienceId: experience.id,
      availabilityId: selectedSlot.id,
      title: experience.title,
      shortDescription: experience.shortDescription,
      coverImageUrl: experience.coverImageUrl,
      providerName: experience.providerName,
      providerId: experience.providerId,
      quantity,
      unitPrice: effectivePrice,
      currency: experience.priceCurrency,
      serviceDate: selectedSlot.date,
      serviceTime: selectedSlot.start_time,
      pricingType: experience.pricingType,
    })
    router.push('/cart')
  }

  function formatTime(time: string) {
    const [h, m] = time.split(':').map(Number)
    const ampm = h >= 12 ? 'pm' : 'am'
    const h12 = h % 12 || 12
    return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`
  }

  function formatDate(dateStr: string) {
    const d = new Date(dateStr + 'T00:00:00')
    return {
      day: DAY_LABELS[d.getDay()],
      num: d.getDate(),
      month: MONTH_LABELS[d.getMonth()],
    }
  }

  return (
    <div className="h-full bg-white flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-6 pb-4 flex-shrink-0">
        <button
          onClick={() => router.back()}
          className="p-2 -ml-2 text-slate-900 active:scale-95 transition-transform"
        >
          <ChevronLeft className="h-8 w-8" strokeWidth={3} />
        </button>
        <div className="flex-1 flex items-center justify-center">
          <div className="border border-slate-200 rounded-full px-10 py-2.5 shadow-sm">
            <h1 className="text-base font-bold text-slate-800 tracking-wide uppercase text-center">
              {experience.title}
            </h1>
          </div>
        </div>
        <div className="w-10" />
      </div>

      <main className="flex-1 overflow-y-auto container mx-auto max-w-md px-6 flex flex-col gap-6 mt-2">
        {/* Date selection */}
        {dates.length > 0 ? (
          <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
            {dates.map((date) => {
              const { day, num, month } = formatDate(date)
              const isSelected = date === selectedDate
              return (
                <button
                  key={date}
                  onClick={() => handleSelectDate(date)}
                  className={cn(
                    'flex flex-col items-center justify-center rounded-full px-5 py-2.5 shrink-0 transition-colors',
                    isSelected
                      ? 'bg-teal-700 text-white'
                      : 'border border-slate-200 text-slate-600'
                  )}
                >
                  <span className="text-[10px] font-bold tracking-wider uppercase">{day}</span>
                  <span className="text-[10px]">{num} {month}</span>
                </button>
              )
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            No hay fechas disponibles
          </p>
        )}

        {/* Time slots */}
        {timeSlotsForDate.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {timeSlotsForDate.map((slot) => (
              <button
                key={slot.id}
                onClick={() => setSelectedSlot(slot)}
                className={cn(
                  'rounded-md px-4 py-2 text-sm font-semibold transition-colors',
                  selectedSlot?.id === slot.id
                    ? 'bg-teal-700 text-white'
                    : 'border border-slate-200 text-slate-600'
                )}
              >
                {formatTime(slot.start_time)}
              </button>
            ))}
          </div>
        )}

        {/* Subcategory tabs (if available) */}
        {experience.subcategoryName && (
          <div className="flex gap-2">
            <button className="flex-1 py-3 text-xs font-semibold rounded-md bg-teal-700 text-white shadow-sm">
              {experience.subcategoryName.toUpperCase()}
            </button>
          </div>
        )}

        {/* Ticket row */}
        {selectedSlot && (
          <div className="flex flex-col gap-3">
            {Array.from({ length: Math.min(experience.pricingType === 'per_person' ? 1 : 1, 1) }).map((_, i) => {
              const price = selectedSlot.price_override ?? experience.priceAmount
              const formatted = new Intl.NumberFormat('es-MX', {
                style: 'currency',
                currency: experience.priceCurrency,
                minimumFractionDigits: 2,
              }).format(price)

              return (
                <div
                  key={i}
                  className="flex items-center justify-between px-4 py-3 rounded-full border border-slate-200 shadow-sm bg-white"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-teal-700 rounded-full h-6 w-6 flex items-center justify-center shrink-0">
                      <Info className="text-white h-3.5 w-3.5" strokeWidth={3} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-teal-700 font-bold leading-tight">
                        {experience.pricingType === 'per_person' ? 'Regular Ticket' : 'Group Ticket'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium leading-tight mb-0.5">
                        {experience.subcategoryName || 'General'}
                      </span>
                      <span className="font-bold text-slate-900 text-sm">{formatted}</span>
                    </div>
                  </div>

                  {experience.pricingType === 'per_person' ? (
                    <div className="flex items-center gap-4 pr-1">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="p-1 active:scale-95 text-slate-900"
                      >
                        <Minus className="h-5 w-5" strokeWidth={3} />
                      </button>
                      {quantity > 0 && (
                        <span className="font-bold text-sm w-4 text-center">{quantity}</span>
                      )}
                      <button
                        onClick={() => setQuantity((q) => Math.min(availableSpots, q + 1))}
                        className="bg-teal-700 text-white rounded-full p-1.5 shadow-sm active:scale-95"
                      >
                        <Plus className="h-5 w-5" strokeWidth={3} />
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400">x1</span>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* Bottom bar */}
      <div className="flex-shrink-0 px-6 pb-6 pt-2 bg-white border-t border-slate-100">
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-lg px-6 py-4 flex items-center justify-between">
          <div className="flex items-baseline gap-4">
            <span className="text-teal-700 font-bold tracking-widest text-lg">TOTAL</span>
            <span className="text-slate-900 font-bold text-lg">{formattedTotal}</span>
          </div>
          <button
            onClick={handleContinue}
            disabled={!selectedSlot}
            className={cn(
              'flex items-center gap-1 text-white rounded-xl px-5 py-2.5 text-sm font-semibold active:scale-95 transition-all',
              selectedSlot ? 'bg-teal-700' : 'bg-slate-300'
            )}
          >
            continue
            <ChevronRight className="h-4 w-4" strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  )
}
