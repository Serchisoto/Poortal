'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import prisma from '@/lib/prisma'

export type BookingActionResult = { success?: string; error?: string }

async function getProviderIdForUser(profileId: string): Promise<string | null> {
  const provider = await prisma.provider_profiles.findFirst({
    where: { user_id: profileId },
    select: { id: true },
  })
  return provider?.id ?? null
}

async function verifyBookingItemOwnership(bookingItemId: string, providerId: string): Promise<boolean> {
  const item = await prisma.booking_items.findFirst({
    where: { id: bookingItemId },
    select: { provider_id: true },
  })
  return item?.provider_id === providerId
}

async function getCurrentProviderContext(): Promise<{ providerId: string; profileId: string } | null> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return null

  const profile = await prisma.profiles.findFirst({
    where: { user_id: session.user.id },
    select: { id: true },
  })
  if (!profile) return null

  const providerId = await getProviderIdForUser(profile.id)
  if (!providerId) return null

  return { providerId, profileId: profile.id }
}

async function getCurrentProviderId(): Promise<string | null> {
  const ctx = await getCurrentProviderContext()
  return ctx?.providerId ?? null
}

export async function confirmBookingItemAction(
  bookingItemId: string,
  message?: string
): Promise<BookingActionResult> {
  const providerId = await getCurrentProviderId()
  if (!providerId) return { error: 'No autorizado o no tienes perfil de proveedor.' }

  const isOwner = await verifyBookingItemOwnership(bookingItemId, providerId)
  if (!isOwner) return { error: 'No tienes permiso para esta reserva.' }

  await prisma.booking_items.update({
    where: { id: bookingItemId },
    data: {
      status: 'confirmed',
      provider_message: message ?? null,
      responded_at: new Date(),
    },
  })

  revalidatePath('/provider/bookings')
  return { success: 'Reserva confirmada.' }
}

export async function rejectBookingItemAction(
  bookingItemId: string,
  message: string
): Promise<BookingActionResult> {
  if (!message.trim()) return { error: 'Debes proporcionar un motivo de rechazo.' }

  const providerId = await getCurrentProviderId()
  if (!providerId) return { error: 'No autorizado o no tienes perfil de proveedor.' }

  const isOwner = await verifyBookingItemOwnership(bookingItemId, providerId)
  if (!isOwner) return { error: 'No tienes permiso para esta reserva.' }

  await prisma.$transaction([
    prisma.booking_items.update({
      where: { id: bookingItemId },
      data: { status: 'rejected', provider_message: message, responded_at: new Date() },
    }),
    prisma.tickets.updateMany({
      where: { booking_item_id: bookingItemId },
      data: { status: 'cancelled' },
    }),
  ])

  revalidatePath('/provider/bookings')
  return { success: 'Reserva rechazada.' }
}

export async function cancelBookingItemAction(
  bookingItemId: string,
  reason: string
): Promise<BookingActionResult> {
  if (!reason.trim()) return { error: 'Debes proporcionar un motivo de cancelacion.' }

  const ctx = await getCurrentProviderContext()
  if (!ctx) return { error: 'No autorizado o no tienes perfil de proveedor.' }

  const { providerId, profileId } = ctx

  const isOwner = await verifyBookingItemOwnership(bookingItemId, providerId)
  if (!isOwner) return { error: 'No tienes permiso para esta reserva.' }

  const item = await prisma.booking_items.findUnique({
    where: { id: bookingItemId },
    select: {
      booking_id: true,
      subtotal: true,
      experiences: { select: { cancellation_policy: true } },
    },
  })
  if (!item) return { error: 'Reserva no encontrada.' }

  await prisma.$transaction([
    prisma.booking_items.update({
      where: { id: bookingItemId },
      data: { status: 'cancelled', provider_message: reason, responded_at: new Date() },
    }),
    prisma.tickets.updateMany({
      where: { booking_item_id: bookingItemId },
      data: { status: 'cancelled' },
    }),
    prisma.cancellations.create({
      data: {
        booking_id: item.booking_id,
        booking_item_id: bookingItemId,
        cancelled_by: profileId,
        cancelled_by_type: 'provider',
        reason,
        cancellation_policy: item.experiences.cancellation_policy ?? 'flexible',
        original_amount: item.subtotal,
        refund_percentage: 100,
        refund_amount: item.subtotal,
      },
    }),
  ])

  revalidatePath('/provider/bookings')
  revalidatePath('/provider/cancellations')
  return { success: 'Reserva cancelada.' }
}
