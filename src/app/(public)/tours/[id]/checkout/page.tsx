'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import { ChevronLeft, Percent, Plus, Ticket } from 'lucide-react'
import { confirmBooking } from '@/actions/confirm-booking'

interface ExperienceData {
  id: string
  title: string
  price_amount: number
  price_currency: string
  pricing_type: string
  provider_id: string
}

function TourCheckoutContent() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const id = params.id
  const searchParams = useSearchParams()

  const [experience, setExperience] = useState<ExperienceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const people = Number(searchParams.get('people') ?? 2)
  const unitPrice = Number(searchParams.get('unitPrice') ?? 0)
  const total = Number(searchParams.get('total') ?? 0)
  const date = searchParams.get('date') ?? ''
  const time = searchParams.get('time') ?? ''
  const availabilityId = searchParams.get('availabilityId') ?? null
  const pricingType = (searchParams.get('pricingType') ?? 'per_person') as 'per_person' | 'per_group' | 'flat_rate'
  const providerId = searchParams.get('providerId') ?? ''
  const guestEmail = searchParams.get('guestEmail') ?? ''
  const guestName = searchParams.get('guestName') ?? ''

  useEffect(() => {
    fetch(`/api/experiences/${id}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { if (data) setExperience(data) })
      .finally(() => setLoading(false))
  }, [id])

  const formatDate = (iso: string) => {
    if (!iso) return '-'
    return new Date(iso + 'T00:00:00').toLocaleDateString('es-MX', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    })
  }

  const formatTime = (iso: string) => {
    if (!iso) return '-'
    return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
  }

  const iva = total * 0.16
  const grandTotal = total + iva
  const currency = experience?.price_currency || 'MXN'
  const fmt = (amount: number) =>
    new Intl.NumberFormat('es-MX', { style: 'currency', currency, maximumFractionDigits: 2 }).format(amount)

  const handlePayNow = async () => {
    if (!experience) return
    setPaying(true)
    setError(null)
    try {
      const result = await confirmBooking({
        experienceId: id,
        availabilityId,
        providerId: providerId || experience.provider_id,
        quantity: people,
        unitPrice,
        currency,
        serviceDate: date,
        serviceTime: time || null,
        pricingType,
        guestEmail: guestEmail || undefined,
        guestName: guestName || undefined,
      })

      if ('error' in result) {
        setError('Hubo un problema al procesar tu reserva. Intenta de nuevo.')
        return
      }

      const bookingNumber = 'bookingNumber' in result ? result.bookingNumber : result.bookingId
      router.push(`/success?booking=${bookingNumber}`)
    } catch (e) {
      console.error('[checkout] pay now failed:', e)
      setError('Hubo un problema al procesar tu reserva. Intenta de nuevo.')
    } finally {
      setPaying(false)
    }
  }

  return (
    <div className="min-h-screen bg-white pb-32 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4">
        <button onClick={() => router.back()} className="p-2 -ml-2 text-slate-900 active:scale-95 transition-transform">
          <ChevronLeft className="h-8 w-8" strokeWidth={3} />
        </button>
        <div className="border border-slate-200 rounded-full px-12 py-3 shadow-sm">
          <h1 className="text-base font-bold text-slate-800 tracking-wide uppercase">CHECKOUT</h1>
        </div>
        <div className="w-8" />
      </div>

      <main className="container mx-auto px-6 flex flex-col gap-5 mt-4 max-w-md">
        {/* Top Info Section */}
        <div className="flex gap-4 items-start">
          <div className="w-24 h-24 bg-primary/10 rounded-lg shrink-0 flex items-center justify-center border border-primary/10">
            <Ticket className="h-8 w-8 text-teal-400" />
          </div>
          <div className="flex flex-col gap-1.5 pt-1">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-900">Tour</span>
              <span className="text-xs text-slate-600 line-clamp-1 max-w-[160px]">
                {loading ? '—' : (experience?.title ?? '—')}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-900">Fecha</span>
              <span className="text-xs text-slate-600">{formatDate(date)}</span>
            </div>
            {time && (
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-900">Hora</span>
                <span className="text-xs text-slate-600">{formatTime(time)}</span>
              </div>
            )}
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-900">Personas</span>
              <span className="text-xs text-slate-600">{people}</span>
            </div>
            {guestEmail && (
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-900">Correo</span>
                <span className="text-xs text-slate-500 truncate max-w-[160px]">{guestEmail}</span>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden">
          <div className="py-3 px-4 text-center">
            <h3 className="font-bold text-sm text-slate-800">Order Summary</h3>
          </div>
          <div className="border-t border-dashed border-slate-300 mx-4" />
          <div className="px-4 py-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-700">{people} x Admission</span>
              <span className="text-slate-700">{fmt(unitPrice * people)}</span>
            </div>
          </div>
        </div>

        {/* Checkout Summary */}
        <div className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden">
          <div className="py-3 px-4 text-center">
            <h3 className="font-bold text-sm text-slate-800">Checkout Summary</h3>
          </div>
          <div className="border-t border-dashed border-slate-300 mx-4" />
          <div className="px-8 py-4 flex flex-col gap-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-700">Subtotal:</span>
              <span className="text-slate-600">{fmt(total)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-700">Descuento:</span>
              <span className="text-slate-600">—</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-700">Cargo por servicio:</span>
              <span className="text-slate-600">—</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-700">IVA (16%):</span>
              <span className="text-slate-600">{fmt(iva)}</span>
            </div>
          </div>
          <div className="border-t border-dashed border-slate-300 mx-4" />
          <div className="py-4 px-8 flex justify-center items-center gap-4">
            <span className="font-bold text-sm text-slate-800">TOTAL:</span>
            <span className="font-bold text-sm text-slate-800">{fmt(grandTotal)} {currency}</span>
          </div>
        </div>

        {/* Special Notes */}
        <button className="w-full border border-slate-200 rounded-xl bg-white shadow-sm py-4 text-center">
          <span className="font-bold text-sm text-slate-800">Special Notes</span>
        </button>

        {/* Coupon */}
        <div className="flex justify-center mt-2">
          <button className="flex items-center gap-1.5">
            <Percent className="h-4 w-4 text-primary" strokeWidth={3} />
            <span className="text-[10px] font-medium text-slate-800 underline underline-offset-2">coupon code</span>
          </button>
        </div>

        {/* Error */}
        {error && (
          <p className="text-center text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 mt-4">
          <button
            onClick={() => router.push('/cart')}
            disabled={paying}
            className="flex-1 flex items-center justify-center gap-2 border border-primary text-primary rounded-md py-3 active:scale-95 transition-transform bg-white disabled:opacity-50"
          >
            <Plus className="h-5 w-5" strokeWidth={2} />
            <span className="text-sm font-semibold">add to cart</span>
          </button>
          <button
            onClick={handlePayNow}
            disabled={paying || loading || !experience}
            className="flex-1 flex items-center justify-center gap-2 bg-primary text-white rounded-md py-3 active:scale-95 transition-transform disabled:opacity-60"
          >
            <Ticket className="h-5 w-5" />
            <span className="text-sm font-semibold">{paying ? 'procesando...' : 'pay now'}</span>
          </button>
        </div>
      </main>
    </div>
  )
}

export default function TourCheckoutPage() {
  return (
    <Suspense>
      <TourCheckoutContent />
    </Suspense>
  )
}
