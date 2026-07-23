'use server'

import { auth } from '@/lib/auth'
import { headers, cookies } from 'next/headers'
import prisma from '@/lib/prisma'

interface CartItem {
  experienceId: string
  availabilityId: string | null
  providerId: string
  quantity: number
  unitPrice: number
  currency: string
  serviceDate: string
  serviceTime: string | null
  pricingType: 'per_person' | 'per_group' | 'flat_rate'
}

interface CreateBookingInput {
  items: CartItem[]
  guestEmail?: string
  guestName?: string
}

function parseServiceTime(serviceTime: string | null): Date | null {
  if (!serviceTime) return null
  // Already a full ISO string (e.g. "1970-01-01T15:00:00.000Z")
  if (serviceTime.includes('T')) return new Date(serviceTime)
  // Bare time string (e.g. "09:00:00")
  return new Date(`1970-01-01T${serviceTime}Z`)
}

export async function createBookingFromCart({ items, guestEmail, guestName }: CreateBookingInput) {
  if (items.length === 0) return { error: 'empty_cart' as const }

  const experienceIds = items.map((i) => i.experienceId)
  const existingExperiences = await prisma.experiences.findMany({
    where: { id: { in: experienceIds } },
    select: { id: true },
  })
  const foundIds = new Set(existingExperiences.map((e) => e.id))
  const missing = experienceIds.filter((id) => !foundIds.has(id))
  if (missing.length > 0) return { error: 'invalid_experiences' as const }

  const session = await auth.api.getSession({ headers: await headers() })

  let profileId: string

  if (session?.user) {
    const profile = await prisma.profiles.findFirst({
      where: { user_id: session.user.id },
      select: { id: true },
    })
    if (!profile) return { error: 'not_authenticated' as const }
    profileId = profile.id
  } else {
    if (!guestEmail) return { error: 'guest_email_required' as const }

    const email = guestEmail.trim().toLowerCase()
    const existing = await prisma.profiles.findUnique({
      where: { email },
      select: { id: true },
    })

    if (existing) {
      profileId = existing.id
    } else {
      const created = await prisma.profiles.create({
        data: {
          email,
          full_name: guestName?.trim() || null,
          role: 'tourist',
        },
        select: { id: true },
      })
      profileId = created.id
    }
  }

  const subtotal = items.reduce((acc, item) => {
    const lineTotal = item.pricingType === 'per_person' ? item.unitPrice * item.quantity : item.unitPrice
    return acc + lineTotal
  }, 0)
  const iva = subtotal * 0.16
  const total = subtotal + iva

  const bookingNumber = `POORTAL-${crypto.randomUUID().substring(0, 8).toUpperCase()}`
  const guestToken = crypto.randomUUID()

  const booking = await prisma.bookings.create({
    data: {
      booking_number: bookingNumber,
      user_id: profileId,
      guest_email: session?.user ? null : guestEmail?.trim().toLowerCase(),
      guest_token: guestToken,
      status: 'pending_payment',
      total_amount: total,
      platform_fee: 0,
      currency: items[0].currency,
    },
    select: { id: true },
  })

  for (const item of items) {
    const lineTotal = item.pricingType === 'per_person' ? item.unitPrice * item.quantity : item.unitPrice

    const bookingItem = await prisma.booking_items.create({
      data: {
        booking_id: booking.id,
        experience_id: item.experienceId,
        availability_id: item.availabilityId,
        provider_id: item.providerId,
        status: 'pending',
        quantity: item.quantity,
        unit_price: item.unitPrice,
        subtotal: lineTotal,
        service_date: new Date(item.serviceDate),
        service_time: parseServiceTime(item.serviceTime),
      },
      select: { id: true },
    })

    await prisma.tickets.create({
      data: {
        booking_item_id: bookingItem.id,
        user_id: profileId,
        experience_id: item.experienceId,
        provider_id: item.providerId,
        qr_code: crypto.randomUUID(),
        status: 'active',
        service_date: new Date(item.serviceDate),
        service_time: parseServiceTime(item.serviceTime),
        quantity: item.quantity,
      },
    })
  }

  if (!session?.user) {
    const cookieStore = await cookies()
    const existing = cookieStore.get('guest_tokens')?.value
    const tokens: string[] = existing ? JSON.parse(existing) : []
    tokens.push(guestToken)
    cookieStore.set('guest_tokens', JSON.stringify(tokens), {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    })
  }

  return { bookingId: booking.id, guestToken }
}
