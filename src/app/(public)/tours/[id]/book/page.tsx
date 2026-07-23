'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ChevronLeft, ChevronRight, Minus, Plus, Users } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSession } from '@/lib/auth-client'

interface AvailabilitySlot {
  id: string
  date: string
  start_time: string
  total_spots: number
  booked_spots: number
  price_override: number | null
}

interface ExperienceData {
  id: string
  title: string
  price_amount: number
  price_currency: string
  pricing_type: string
  provider_id: string
}

export default function TourBookingPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const id = params.id
  const { data: session } = useSession()

  const [experience, setExperience] = useState<ExperienceData | null>(null)
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([])
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null)
  const [people, setPeople] = useState(2)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [expRes, availRes] = await Promise.all([
          fetch(`/api/experiences/${id}`),
          fetch(`/api/experiences/${id}/availability`),
        ])
        if (expRes.ok) {
          const exp = await expRes.json()
          setExperience(exp)
        }
        if (availRes.ok) {
          const slots: AvailabilitySlot[] = await availRes.json()
          setAvailability(slots)
          if (slots.length > 0) setSelectedSlotId(slots[0].id)
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const selectedSlot = availability.find((s) => s.id === selectedSlotId) ?? null

  const unitPrice = selectedSlot?.price_override ?? experience?.price_amount ?? 0
  const isPerPerson = experience?.pricing_type === 'per_person'
  const totalAmount = isPerPerson ? unitPrice * people : unitPrice

  const formatDate = (iso: string) => {
    const d = new Date(iso + 'T00:00:00')
    return {
      day: d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
      date: d.toLocaleDateString('en-MX', { day: '2-digit', month: 'short' }),
    }
  }

  const formatTime = (iso: string) => {
    if (!iso) return ''
    const d = new Date(iso)
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
  }

  const handleContinue = () => {
    if (!selectedSlot || totalAmount === 0) return

    const params = new URLSearchParams({
      availabilityId: selectedSlot.id,
      date: selectedSlot.date,
      time: selectedSlot.start_time,
      people: String(people),
      unitPrice: String(unitPrice),
      total: String(totalAmount),
    })

    if (!session?.user) {
      router.push(`/login?redirectTo=/tours/${id}/book?${params.toString()}`)
      return
    }

    router.push(`/tours/${id}/checkout?${params.toString()}`)
  }

  const visibleSlots = availability.slice(0, 5)

  return (
    <div className="min-h-screen bg-white pb-32 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4">
        <button
          onClick={() => router.back()}
          className="p-2 -ml-2 text-slate-900 active:scale-95 transition-transform"
        >
          <ChevronLeft className="h-8 w-8" strokeWidth={3} />
        </button>
        <div className="border border-slate-200 rounded-full px-8 py-3 shadow-sm max-w-[60%]">
          <h1 className="text-sm font-bold text-slate-800 tracking-wide uppercase truncate text-center">
            {loading ? 'BOOK TOUR' : (experience?.title ?? 'BOOK TOUR')}
          </h1>
        </div>
        <div className="w-8" />
      </div>

      <main className="container mx-auto px-6 flex flex-col mt-4 max-w-md gap-6">
        {loading ? (
          <div className="flex flex-col gap-4 animate-pulse">
            <div className="flex gap-3 justify-center">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-14 w-20 rounded-full bg-slate-100" />
              ))}
            </div>
            <div className="h-10 w-24 rounded-md bg-slate-100" />
            <div className="flex flex-col gap-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-16 rounded-full bg-slate-100" />
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Date Selection */}
            {visibleSlots.length > 0 ? (
              <div className="flex gap-2 justify-center flex-wrap">
                {visibleSlots.map((slot) => {
                  const { day, date } = formatDate(slot.date)
                  const spotsLeft = slot.total_spots - slot.booked_spots
                  const isFull = spotsLeft <= 0
                  const isSelected = selectedSlotId === slot.id
                  return (
                    <button
                      key={slot.id}
                      disabled={isFull}
                      onClick={() => setSelectedSlotId(slot.id)}
                      className={cn(
                        'flex flex-col items-center justify-center rounded-full px-5 py-2 transition-colors min-w-[72px]',
                        isSelected
                          ? 'bg-teal-700 text-white'
                          : isFull
                          ? 'border border-slate-100 text-slate-300 cursor-not-allowed'
                          : 'border border-slate-200 text-slate-600 active:scale-95'
                      )}
                    >
                      <span className="text-[10px] font-bold tracking-wider uppercase">{day}</span>
                      <span className="text-[10px]">{date}</span>
                    </button>
                  )
                })}
              </div>
            ) : (
              <div className="text-center text-sm text-slate-500 py-4">
                No hay fechas disponibles en este momento.
              </div>
            )}

            {/* Time Badge */}
            {selectedSlot?.start_time && (
              <div className="flex justify-start">
                <div className="bg-teal-700 text-white text-xs font-semibold px-5 py-2.5 rounded-md">
                  {formatTime(selectedSlot.start_time)}
                </div>
              </div>
            )}

            {/* People Counter */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-teal-700" strokeWidth={2.5} />
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">People</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-full border border-slate-200 shadow-sm bg-white">
                <div className="flex items-center gap-3 pl-2">
                  <div className="flex flex-col">
                    <div className="text-[10px] text-teal-700 font-bold leading-tight">Admission</div>
                    <div className="text-[10px] text-slate-400 font-medium leading-tight mb-1">Per person</div>
                    <div className="font-bold text-slate-900">
                      {new Intl.NumberFormat('es-MX', {
                        style: 'currency',
                        currency: experience?.price_currency || 'MXN',
                        maximumFractionDigits: 0,
                      }).format(unitPrice)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 pr-1">
                  <button
                    onClick={() => setPeople((p) => Math.max(1, p - 1))}
                    className="p-1 active:scale-95 text-slate-900"
                  >
                    <Minus className="h-5 w-5" strokeWidth={3} />
                  </button>
                  <span className="font-bold text-sm w-4 text-center">{people}</span>
                  <button
                    onClick={() => setPeople((p) => p + 1)}
                    className="bg-teal-700 text-white rounded-full p-1.5 shadow-sm active:scale-95"
                  >
                    <Plus className="h-5 w-5" strokeWidth={3} />
                  </button>
                </div>
              </div>
            </div>

            {/* Availability notice */}
            {selectedSlot && (
              <p className="text-[11px] text-slate-400 text-center -mt-2">
                {selectedSlot.total_spots - selectedSlot.booked_spots} spots remaining
              </p>
            )}
          </>
        )}
      </main>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 inset-x-0 mx-auto max-w-md px-6 z-40 pb-safe-bottom">
        <div className="mb-6 bg-white rounded-[2rem] border border-slate-200 shadow-lg px-6 py-4 flex items-center justify-between">
          <div className="flex items-baseline gap-3">
            <span className="text-teal-700 font-bold tracking-widest text-lg">TOTAL</span>
            <span className="text-slate-900 font-bold text-lg">
              {new Intl.NumberFormat('es-MX', {
                style: 'currency',
                currency: experience?.price_currency || 'MXN',
                maximumFractionDigits: 0,
              }).format(totalAmount)}
            </span>
          </div>
          <button
            onClick={handleContinue}
            disabled={!selectedSlot || loading}
            className={cn(
              'flex items-center gap-1 text-white rounded-md px-5 py-2.5 text-xs font-semibold active:scale-95 transition-all outline-none',
              selectedSlot && !loading ? 'bg-teal-700' : 'bg-slate-300 cursor-not-allowed'
            )}
          >
            {session?.user ? 'continue' : 'log in to book'}
            <ChevronRight className="h-4 w-4" strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  )
}
