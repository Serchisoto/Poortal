'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import { ChevronLeft, Percent, Plus, Ticket } from 'lucide-react'
import { useSession } from '@/lib/auth-client'

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
  const { data: session } = useSession()

  const [experience, setExperience] = useState<ExperienceData | null>(null)
  const [loading, setLoading] = useState(true)

  const people = Number(searchParams.get('people') ?? 2)
  const unitPrice = Number(searchParams.get('unitPrice') ?? 0)
  const total = Number(searchParams.get('total') ?? 0)
  const date = searchParams.get('date') ?? ''
  const time = searchParams.get('time') ?? ''
  const availabilityId = searchParams.get('availabilityId') ?? null

  // Redirect to login if not authenticated
  useEffect(() => {
    if (session === null) {
      // session is still loading; wait
      return
    }
    if (!session?.user) {
      const currentPath = `/tours/${id}/checkout?${searchParams.toString()}`
      router.replace(`/login?redirectTo=${encodeURIComponent(currentPath)}`)
    }
  }, [session, id, router, searchParams])

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/experiences/${id}`)
        if (res.ok) setExperience(await res.json())
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const formatDate = (iso: string) => {
    if (!iso) return '-'
    return new Date(iso + 'T00:00:00').toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const formatTime = (iso: string) => {
    if (!iso) return '-'
    const d = new Date(iso)
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
  }

  const iva = total * 0.16
  const subtotal = total
  const grandTotal = total + iva

  const currency = experience?.price_currency || 'MXN'
  const fmt = (amount: number) =>
    new Intl.NumberFormat('es-MX', { style: 'currency', currency, maximumFractionDigits: 2 }).format(amount)

  if (!session?.user && session !== undefined) return null // Redirecting

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
        <div className="border border-slate-200 rounded-full px-12 py-3 shadow-sm">
          <h1 className="text-base font-bold text-slate-800 tracking-wide uppercase">
            CHECKOUT
          </h1>
        </div>
        <div className="w-8" />
      </div>

      <main className="container mx-auto px-6 flex flex-col gap-5 mt-4 max-w-md">

        {/* Top Info Section */}
        <div className="flex gap-4 items-start">
          <div className="w-24 h-24 bg-teal-50 rounded-lg shrink-0 flex items-center justify-center border border-teal-100">
            <Ticket className="h-8 w-8 text-teal-400" />
          </div>
          <div className="flex flex-col gap-1 pt-1">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-900">Tour</span>
              <span className="text-xs text-slate-600 line-clamp-1 max-w-[160px]">
                {loading ? '—' : (experience?.title ?? '—')}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-900">Date</span>
              <span className="text-xs text-slate-600">{formatDate(date)}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-900">Time</span>
              <span className="text-xs text-slate-600">{formatTime(time)}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-900">People</span>
              <span className="text-xs text-slate-600">{people}</span>
            </div>
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden flex flex-col mt-2">
          <div className="py-3 px-4 text-center">
            <h3 className="font-bold text-sm text-slate-800">Order Summary</h3>
          </div>
          <div className="border-t border-dashed border-slate-300 mx-4" />
          <div className="px-4 py-4 flex flex-col gap-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-700">{people} x Admission</span>
              <span className="text-slate-700">{fmt(unitPrice * people)}</span>
            </div>
          </div>
        </div>

        {/* Checkout Ticket Card */}
        <div className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden flex flex-col">
          <div className="py-3 px-4 text-center">
            <h3 className="font-bold text-sm text-slate-800">Checkout Summary</h3>
          </div>
          <div className="border-t border-dashed border-slate-300 mx-4" />
          <div className="px-8 py-4 flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700">Subtotal:</span>
              <span className="text-slate-600">{fmt(subtotal)}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700">Discount:</span>
              <span className="text-slate-600">—</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700">Service Fee:</span>
              <span className="text-slate-600">—</span>
            </div>
            <div className="flex justify-between items-center text-xs">
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
        <button className="w-full border border-slate-200 rounded-xl bg-white shadow-sm py-4 text-center active:scale-[0.98] transition-transform">
          <span className="font-bold text-sm text-slate-800">Special Notes</span>
        </button>

        {/* Coupon Code */}
        <div className="flex justify-center mt-2">
          <button className="flex items-center gap-1.5 active:scale-95 transition-transform">
            <Percent className="h-4 w-4 text-teal-600" strokeWidth={3} />
            <span className="text-[10px] font-medium text-slate-800 underline decoration-slate-800 underline-offset-2">coupon code</span>
          </button>
        </div>

        {/* Bottom Action Buttons */}
        <div className="flex gap-4 mt-4">
          <button
            onClick={() => router.push('/cart')}
            className="flex-1 flex items-center justify-center gap-2 border border-teal-700 text-teal-700 rounded-md py-3 active:scale-95 transition-transform bg-white"
          >
            <Plus className="h-5 w-5" strokeWidth={2} />
            <span className="text-sm font-semibold">add to cart</span>
          </button>
          <button
            onClick={() => router.push('/success')}
            className="flex-1 flex items-center justify-center gap-2 bg-teal-700 text-white rounded-md py-3 active:scale-95 transition-transform"
          >
            <Ticket className="h-5 w-5" />
            <span className="text-sm font-semibold">pay now</span>
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
