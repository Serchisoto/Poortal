import prisma from '@/lib/prisma'

export async function getProviderNotifications(userId: string, unreadOnly = false) {
  return prisma.notifications.findMany({
    where: {
      user_id: userId,
      ...(unreadOnly ? { is_read: false } : {}),
    },
    orderBy: { created_at: 'desc' },
    take: 50,
  })
}

export async function getUnreadNotificationCount(userId: string) {
  return prisma.notifications.count({
    where: { user_id: userId, is_read: false },
  })
}
