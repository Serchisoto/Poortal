'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Percent, X, Loader2, Mail } from 'lucide-react'
import Image from 'next/image'
import { useCartStore } from '@/stores/cart-store'
import { createBookingFromCart } from '@/actions/bookings'
import { useSession } from '@/lib/auth-client'

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00')
  return `${d.getDate()} ${MONTH_LABELS[d.getMonth()]} ${d.getFullYear()}`
}

function formatTime(time: string) {
  const [h, m] = time.split(':').map(Number)
  const ampm = h >= 12 ? 'pm' : 'am'
  const h12 = h % 12 || 12
  return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`
}

export default function CartPage() {
  const router = useRouter()
  const { data: session, isPending: sessionLoading } = useSession()
  const { items, removeItem, clearCart } = useCartStore()
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Guest email form state
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [guestEmail, setGuestEmail] = useState('')
  const [guestName, setGuestName] = useState('')
  const [emailError, setEmailError] = useState<string | null>(null)

  async function submitBooking(email?: string, name?: string) {
    setLoading(true)
    setErrorMsg(null)

    const result = await createBookingFromCart({
      items: items.map((item) => ({
        experienceId: item.experienceId,
        availabilityId: item.availabilityId,
        providerId: item.providerId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        currency: item.currency,
        serviceDate: item.serviceDate,
        serviceTime: item.serviceTime,
        pricingType: item.pricingType,
      })),
      guestEmail: email,
      guestName: name,
    })

    setLoading(false)

    if ('error' in result) {
      if (result.error === 'invalid_experiences') {
        clearCart()
        setErrorMsg('Algunas experiencias ya no están disponibles. Tu carrito fue vaciado.')
      } else {
        setErrorMsg('Hubo un error al procesar tu reserva. Intenta de nuevo.')
      }
      return
    }

    clearCart()
    router.push('/wallet?confirmed=1')
  }

  async function handleConfirm() {
    if (!agreed || items.length === 0) return

    if (session?.user) {
      await submitBooking()
    } else {
      setShowEmailForm(true)
    }
  }

  async function handleGuestSubmit(e: React.FormEvent) {
    e.preventDefault()
    setEmailError(null)

    const email = guestEmail.trim()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Por favor ingresa un email válido.')
      return
    }

    await submitBooking(email, guestName.trim() || undefined)
  }

  const currency = items[0]?.currency || 'MXN'

  const fmt = (amount: number) =>
    new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(amount)

  const subtotal = items.reduce((acc, item) => {
    const itemTotal =
      item.pricingType === 'per_person' ? item.unitPrice * item.quantity : item.unitPrice
    return acc + itemTotal
  }, 0)

  const iva = subtotal * 0.16
  const total = subtotal + iva

  return (
    <div className="bg-[#FDFDFD] pb-32 flex flex-col">
      {/* Mobile sub-header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4 bg-white sticky top-0 z-10 border-b border-slate-100 mb-2 md:hidden">
        <button
          onClick={() => router.back()}
          className="p-2 -ml-2 text-slate-900 active:scale-95 transition-transform"
        >
          <ChevronLeft className="h-8 w-8" strokeWidth={3} />
        </button>
        <div className="border border-slate-200 bg-white rounded-full px-12 py-3 shadow-sm">
          <h1 className="text-base font-bold text-slate-800 tracking-wide uppercase">CART</h1>
        </div>
        <div className="w-8" />
      </div>

      {/* Desktop page title */}
      <div className="hidden md:block container mx-auto max-w-5xl px-6 pt-8 pb-2">
        <h1 className="text-2xl font-bold text-slate-800">Your Cart</h1>
      </div>

      <main className="container mx-auto px-6 mt-4 max-w-md md:max-w-5xl">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-sm text-slate-400">Tu carrito está vacío</p>
          </div>
        ) : (
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:gap-10">
            {/* Left col: Cart Items */}
            <div className="flex flex-col gap-4 md:flex-1">
              {items.map((item) => {
                const itemTotal =
                  item.pricingType === 'per_person'
                    ? item.unitPrice * item.quantity
                    : item.unitPrice

                return (
                  <div
                    key={`${item.experienceId}-${item.serviceDate}`}
                    className="flex bg-white border border-slate-200 rounded-lg shadow-sm p-4 relative"
                  >
                    <button
                      onClick={() => removeItem(item.experienceId, item.serviceDate)}
                      className="absolute top-2 right-2 p-1 text-slate-400 active:scale-95"
                    >
                      <X className="h-4 w-4" />
                    </button>

                    <div className="w-24 h-24 bg-slate-100 rounded-lg shrink-0 overflow-hidden relative mr-4">
                      {item.coverImageUrl ? (
                        <Image
                          src={item.coverImageUrl}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-200" />
                      )}
                    </div>

                    <div className="flex flex-col flex-1 justify-between">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center w-[90%] gap-2">
                          <span className="text-xs font-bold text-slate-900 w-12 shrink-0">XP</span>
                          <span className="text-xs text-slate-700 flex-1 truncate">{item.title}</span>
                        </div>
                        <div className="flex items-center w-[90%] gap-2">
                          <span className="text-xs font-bold text-slate-900 w-12 shrink-0">Date</span>
                          <span className="text-xs text-slate-700 flex-1">{formatDate(item.serviceDate)}</span>
                        </div>
                        {item.serviceTime && (
                          <div className="flex items-center w-[90%] gap-2">
                            <span className="text-xs font-bold text-slate-900 w-12 shrink-0">Time</span>
                            <span className="text-xs text-slate-700 flex-1">{formatTime(item.serviceTime)}</span>
                          </div>
                        )}
                        {item.pricingType === 'per_person' && (
                          <div className="flex items-center w-[90%] gap-2">
                            <span className="text-xs font-bold text-slate-900 w-12 shrink-0">Qty</span>
                            <span className="text-xs text-slate-700 flex-1">× {item.quantity}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">TOTAL:</span>
                        <span className="text-sm font-bold text-slate-800">{fmt(itemTotal)}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Right col: Checkout summary + controls */}
            <div className="flex flex-col gap-5 md:w-96 md:sticky md:top-24">
              {/* Checkout Ticket */}
              <div className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden flex flex-col mt-2 md:mt-0">
                <div className="py-3 px-4 text-center">
                  <h3 className="font-bold text-sm text-slate-800">Checkout Ticket</h3>
                </div>
                <div className="border-t border-dashed border-slate-300 mx-4" />
                <div className="px-8 py-4 flex flex-col gap-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700 w-24 text-right">Experiences:</span>
                    <span className="text-slate-600 w-20 text-left">{items.length}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700 w-24 text-right">Discount:</span>
                    <span className="text-slate-600 w-20 text-left">0</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700 w-24 text-right">Subtotal:</span>
                    <span className="text-slate-600 w-20 text-left">{fmt(subtotal)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700 w-24 text-right">Service Fee:</span>
                    <span className="text-slate-600 w-20 text-left">0</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700 w-24 text-right">IVA (16%):</span>
                    <span className="text-slate-600 w-20 text-left">{fmt(iva)}</span>
                  </div>
                </div>
                <div className="border-t border-dashed border-slate-300 mx-4" />
                <div className="py-4 px-8 flex justify-center items-center gap-4">
                  <span className="font-bold text-sm text-slate-800 tracking-wide uppercase">TOTAL:</span>
                  <span className="font-bold text-sm text-slate-800">{fmt(total)}</span>
                </div>
              </div>

              {/* Coupon Code */}
              <div className="flex justify-center">
                <button className="flex items-center gap-1.5 active:scale-95 transition-transform">
                  <Percent className="h-4 w-4 text-primary" strokeWidth={3} />
                  <span className="text-[10px] font-medium text-foreground underline decoration-foreground underline-offset-2">
                    coupon code
                  </span>
                </button>
              </div>

              {/* Terms */}
              <div className="flex justify-center px-4">
                <label className="flex items-center gap-3 cursor-pointer" onClick={() => setAgreed((v) => !v)}>
                  <div
                    className={`w-5 h-5 border-2 rounded-sm flex items-center justify-center shrink-0 transition-colors ${
                      agreed ? 'border-primary bg-primary' : 'border-border bg-background'
                    }`}
                  >
                    {agreed && <span className="text-primary-foreground text-[10px] font-bold leading-none">✓</span>}
                  </div>
                  <span className="text-[11px] text-foreground font-medium">
                    I have read and agree to this{' '}
                    <span className="underline font-bold decoration-foreground">Terms and Conditions</span>
                  </span>
                </label>
              </div>

              {/* Payment Options */}
              <div className="flex flex-col items-center mb-4">
                <span className="text-sm font-bold text-slate-800 mb-4">Select payment option</span>
                <div className="flex items-center justify-center gap-4">
                  <div className="w-16 h-10 bg-white border border-slate-200 shadow-sm rounded-full flex items-center justify-center overflow-hidden">
                    <div className="w-10 h-10 bg-black rounded-full scale-[1.2] translate-y-2 translate-x-1" />
                  </div>
                  <div className="w-16 h-10 bg-white border border-slate-200 shadow-sm rounded-full flex items-center justify-center overflow-hidden relative">
                    <div className="w-[120%] h-3 border-t-[3px] border-slate-700 rounded-t-[50%] -translate-y-1" />
                    <div className="w-[120%] h-3 border-b-[3px] border-slate-700 rounded-b-[50%] translate-y-1 absolute" />
                  </div>
                  <div className="w-16 h-10 bg-white border border-slate-200 shadow-sm rounded-full flex flex-col items-center justify-center">
                    <span className="font-extrabold text-[10px] italic">VISA</span>
                    <div className="flex gap-1 mt-0.5">
                      <div className="w-2 h-0.5 bg-slate-400" />
                      <div className="w-2 h-0.5 bg-slate-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Error message */}
              {errorMsg && (
                <p className="text-center text-xs text-red-500 font-medium">{errorMsg}</p>
              )}

              {/* Confirm button */}
              <div className="flex justify-center mb-8">
                <button
                  onClick={handleConfirm}
                  disabled={!agreed || loading || sessionLoading}
                  className="bg-primary disabled:bg-muted text-primary-foreground disabled:text-muted-foreground rounded-[2rem] px-14 py-3.5 text-base font-semibold active:scale-95 transition-all shadow-md flex items-center gap-2"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {loading ? 'Procesando...' : 'Confirm Booking'}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Guest email modal */}
      {showEmailForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl w-full max-w-md p-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">¿A dónde enviamos tu ticket?</h2>
                <p className="text-xs text-slate-500 mt-0.5">No necesitas cuenta. Solo tu email.</p>
              </div>
            </div>

            <form onSubmit={handleGuestSubmit} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-700">Nombre (opcional)</label>
                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Tu nombre"
                  className="border border-border rounded-lg px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary transition-colors bg-background"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-foreground">Email *</label>
                <input
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="tu@email.com"
                  autoFocus
                  className="border border-border rounded-lg px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary transition-colors bg-background"
                />
                {emailError && <p className="text-xs text-red-500">{emailError}</p>}
              </div>

              <div className="flex gap-3 mt-1">
                <button
                  type="button"
                  onClick={() => setShowEmailForm(false)}
                  className="flex-1 border border-slate-200 rounded-xl py-3 text-sm font-semibold text-slate-700 active:scale-95 transition-transform"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-primary disabled:bg-muted text-primary-foreground disabled:text-muted-foreground rounded-xl py-3 text-sm font-semibold active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {loading ? 'Procesando...' : 'Confirmar reserva'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
