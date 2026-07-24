'use server'

import { createBookingFromCart } from '@/actions/bookings'
import { sendBookingConfirmation } from '@/lib/email'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import prisma from '@/lib/prisma'

export interface ConfirmBookingInput {
  experienceId: string
  availabilityId: string | null
  providerId: string
  quantity: number
  unitPrice: number
  currency: string
  serviceDate: string
  serviceTime: string | null
  pricingType: 'per_person' | 'per_group' | 'flat_rate'
  // Guest fields (only needed when not logged in)
  guestEmail?: string
  guestName?: string
}

export async function confirmBooking(input: ConfirmBookingInput) {
  const session = await auth.api.getSession({ headers: await headers() })

  const result = await createBookingFromCart({
    items: [
      {
        experienceId: input.experienceId,
        availabilityId: input.availabilityId,
        providerId: input.providerId,
        quantity: input.quantity,
        unitPrice: input.unitPrice,
        currency: input.currency,
        serviceDate: input.serviceDate,
        serviceTime: input.serviceTime,
        pricingType: input.pricingType,
      },
    ],
    guestEmail: input.guestEmail,
    guestName: input.guestName,
  })

  if ('error' in result) return result

  // Look up booking number
  const booking = await prisma.bookings.findUnique({
    where: { id: result.bookingId },
    select: { booking_number: true, total_amount: true },
  })

  // Look up experience title
  const experience = await prisma.experiences.findUnique({
    where: { id: input.experienceId },
    select: { title: true },
  })

  const toEmail = session?.user?.email ?? input.guestEmail ?? ''
  const toName = session?.user?.name ?? input.guestName ?? null

  if (toEmail && booking && experience) {
    await sendBookingConfirmation({
      toEmail,
      toName,
      bookingNumber: booking.booking_number,
      experienceTitle: experience.title,
      serviceDate: input.serviceDate,
      serviceTime: input.serviceTime,
      people: input.quantity,
      totalAmount: Number(booking.total_amount),
      currency: input.currency,
    })
  }

  return { ...result, bookingNumber: booking?.booking_number ?? '' }
}
