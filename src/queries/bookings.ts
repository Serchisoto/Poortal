import prisma from '@/lib/prisma'
import type { Booking, BookingItem } from '@/types'

export type BookingItemWithDetails = BookingItem & {
  bookings: Pick<Booking, 'id' | 'booking_number' | 'status' | 'total_amount' | 'currency' | 'created_at' | 'notes'> & {
    profiles: { full_name: string | null; email: string; phone: string | null } | null
  }
  experiences: { id: string; title: string; slug: string } | null
}

export async function getProviderBookingItems(
  providerId: string,
  status?: BookingItem['status'] | BookingItem['status'][]
): Promise<BookingItemWithDetails[]> {
  const rows = await prisma.booking_items.findMany({
    where: {
      provider_id: providerId,
      ...(status !== undefined
        ? { status: Array.isArray(status) ? { in: status } : status }
        : {}),
    } as any,
    include: {
      bookings: {
        select: {
          id: true,
          booking_number: true,
          status: true,
          total_amount: true,
          currency: true,
          created_at: true,
          notes: true,
          profiles: {
            select: { full_name: true, email: true, phone: true },
          },
        },
      },
      experiences: {
        select: { id: true, title: true, slug: true },
      },
    },
    orderBy: { created_at: 'desc' },
  })

  return rows as unknown as BookingItemWithDetails[]
}

const PLATFORM_FEE_RATE = 0.15

export async function getProviderBookingStats(providerId: string) {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [totalItems, monthlyItems, pendingCount, cancelledCount] = await Promise.all([
    prisma.booking_items.findMany({
      where: { provider_id: providerId, status: { in: ['confirmed', 'completed'] } },
      select: { subtotal: true },
    }),
    prisma.booking_items.findMany({
      where: {
        provider_id: providerId,
        status: { in: ['confirmed', 'completed'] },
        created_at: { gte: startOfMonth },
      },
      select: { subtotal: true },
    }),
    prisma.booking_items.count({
      where: { provider_id: providerId, status: 'pending' },
    }),
    prisma.booking_items.count({
      where: { provider_id: providerId, status: 'cancelled' },
    }),
  ])

  const totalRevenue = totalItems.reduce((sum, item) => sum + Number(item.subtotal), 0)
  const monthlyRevenue = monthlyItems.reduce((sum, item) => sum + Number(item.subtotal), 0)

  return {
    totalBookings: totalItems.length,
    pendingCount,
    cancelledCount,
    totalRevenue,
    monthlyRevenue,
    netRevenue: totalRevenue * (1 - PLATFORM_FEE_RATE),
    netMonthlyRevenue: monthlyRevenue * (1 - PLATFORM_FEE_RATE),
  }
}
