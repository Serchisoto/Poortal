'use server'

import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { getProviderByAuthUserId } from '@/queries/providers'
import prisma from '@/lib/prisma'

export type ValidateResult =
  | { status: 'valid'; ticketId: string; touristName: string | null; touristEmail: string; experienceTitle: string; serviceDate: string; quantity: number }
  | { status: 'already_used'; scannedAt: Date }
  | { status: 'wrong_date'; serviceDate: string }
  | { status: 'cancelled' }
  | { status: 'not_found' }
  | { status: 'unauthorized' }
  | { status: 'error'; message: string }

export async function validateTicketAction(qrCode: string): Promise<ValidateResult> {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) return { status: 'unauthorized' }

    const provider = await getProviderByAuthUserId(session.user.id)
    if (!provider) return { status: 'unauthorized' }

    const ticket = await prisma.tickets.findFirst({
      where: { qr_code: qrCode, provider_id: provider.id },
      include: {
        experiences: { select: { title: true } },
        profiles: { select: { full_name: true, email: true } },
      },
    })

    if (!ticket) return { status: 'not_found' }

    if (ticket.status === 'cancelled') return { status: 'cancelled' }

    if (ticket.status === 'used') {
      return { status: 'already_used', scannedAt: ticket.scanned_at! }
    }

    const today = new Date().toISOString().split('T')[0]
    const serviceDay = new Date(ticket.service_date).toISOString().split('T')[0]
    if (serviceDay !== today) {
      return { status: 'wrong_date', serviceDate: serviceDay }
    }

    // Mark as used
    await prisma.tickets.update({
      where: { id: ticket.id },
      data: { status: 'used', scanned_at: new Date() },
    })

    revalidatePath('/provider/validator')

    return {
      status: 'valid',
      ticketId: ticket.id,
      touristName: ticket.profiles.full_name,
      touristEmail: ticket.profiles.email,
      experienceTitle: ticket.experiences.title,
      serviceDate: serviceDay,
      quantity: ticket.quantity,
    }
  } catch (err) {
    return { status: 'error', message: err instanceof Error ? err.message : 'Error inesperado' }
  }
}

export async function getTodayTickets(providerId: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  return prisma.tickets.findMany({
    where: {
      provider_id: providerId,
      service_date: { gte: today, lt: tomorrow },
    },
    include: {
      experiences: { select: { title: true } },
      profiles: { select: { full_name: true, email: true } },
    },
    orderBy: { created_at: 'asc' },
  })
}
