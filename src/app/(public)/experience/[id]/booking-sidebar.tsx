'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { AvailabilityPicker } from '@/components/booking/availability-picker'
import { Ticket, Check } from 'lucide-react'
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

interface BookingSidebarProps {
  experience: ExperienceInfo
  availability: AvailabilitySlot[]
  formattedPrice: string
  pricingLabel: string
  mobileBottomBar?: boolean
}

export function BookingSidebar({
  experience,
  availability,
  formattedPrice,
  pricingLabel,
  mobileBottomBar,
}: BookingSidebarProps) {
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const addItem = useCartStore((s) => s.addItem)
  const router = useRouter()

  const effectivePrice = selectedSlot?.price_override ?? experience.priceAmount
  const availableSpots = selectedSlot
    ? selectedSlot.total_spots - selectedSlot.booked_spots
    : experience.maxCapacity

  const total =
    experience.pricingType === 'per_person'
      ? effectivePrice * quantity
      : effectivePrice

  const formattedTotal = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: experience.priceCurrency || 'MXN',
    minimumFractionDigits: 0,
  }).format(total)

  function handleAddToCart() {
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

    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  function handleBookNow() {
    if (!selectedSlot) return
    handleAddToCart()
    router.push('/cart')
  }

  // Mobile: sticky bottom bar with price + two buttons
  if (mobileBottomBar) {
    return (
      <div className="fixed bottom-16 inset-x-0 z-40 px-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg px-5 py-4 space-y-3">
          {/* Date picker */}
          <div>
            <Label className="mb-1.5 block text-xs">Fecha y horario</Label>
            <AvailabilityPicker
              slots={availability}
              basePrice={experience.priceAmount}
              currency={experience.priceCurrency}
              onSelect={setSelectedSlot}
              selectedSlotId={selectedSlot?.id}
            />
          </div>

          {/* Quantity */}
          {selectedSlot && experience.pricingType === 'per_person' && (
            <div className="flex items-center gap-3">
              <Label className="text-xs shrink-0">Personas</Label>
              <Input
                type="number"
                min={1}
                max={availableSpots}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Math.min(availableSpots, Number(e.target.value))))}
                className="h-8 w-20"
              />
              <span className="text-xs text-muted-foreground">{availableSpots} disponibles</span>
            </div>
          )}

          {/* Price + buttons */}
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <span className="text-lg font-bold text-teal-700">
                {selectedSlot ? formattedTotal : formattedPrice}
              </span>
              <span className="text-xs text-muted-foreground ml-1">{pricingLabel}</span>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!selectedSlot}
              className="flex items-center gap-1.5 bg-slate-100 text-slate-700 rounded-xl px-4 py-2.5 text-sm font-semibold active:scale-95 transition-all disabled:opacity-40"
            >
              <Ticket className="h-4 w-4" />
              {added ? <Check className="h-4 w-4 text-green-600" /> : 'book'}
            </button>

            <button
              onClick={handleBookNow}
              disabled={!selectedSlot}
              className="flex items-center gap-1.5 bg-teal-700 text-white rounded-xl px-4 py-2.5 text-sm font-semibold active:scale-95 transition-all disabled:opacity-40"
            >
              <Ticket className="h-4 w-4" />
              booking
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Desktop: sidebar card
  return (
    <Card className="sticky top-24">
      <CardContent className="p-6 space-y-6">
        <div>
          <div className="text-3xl font-bold text-primary">{formattedPrice}</div>
          <p className="text-sm text-muted-foreground">{pricingLabel}</p>
        </div>

        <div>
          <Label className="mb-2 block">Selecciona fecha y horario</Label>
          <AvailabilityPicker
            slots={availability}
            basePrice={experience.priceAmount}
            currency={experience.priceCurrency}
            onSelect={setSelectedSlot}
            selectedSlotId={selectedSlot?.id}
          />
        </div>

        {selectedSlot && experience.pricingType === 'per_person' && (
          <div className="space-y-2">
            <Label htmlFor="quantity">Cantidad de personas</Label>
            <Input
              id="quantity"
              type="number"
              min={1}
              max={availableSpots}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Math.min(availableSpots, Number(e.target.value))))}
            />
            <p className="text-xs text-muted-foreground">
              {availableSpots} {availableSpots === 1 ? 'lugar disponible' : 'lugares disponibles'}
            </p>
          </div>
        )}

        {selectedSlot && (
          <div className="flex items-center justify-between border-t pt-4">
            <span className="font-medium">Total</span>
            <span className="text-xl font-bold">{formattedTotal}</span>
          </div>
        )}

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            disabled={!selectedSlot}
            onClick={handleAddToCart}
          >
            <Ticket className="mr-2 h-4 w-4" />
            {added ? 'Agregado' : 'book'}
          </Button>
          <Button
            className="flex-1"
            disabled={!selectedSlot}
            onClick={handleBookNow}
          >
            <Ticket className="mr-2 h-4 w-4" />
            booking
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
