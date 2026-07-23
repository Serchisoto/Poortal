'use server'

import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

async function resolveProfileId(authUserId: string): Promise<string | null> {
  const profile = await prisma.profiles.findFirst({
    where: { user_id: authUserId },
    select: { id: true },
  })
  return profile?.id ?? null
}

export async function markNotificationReadAction(notificationId: string) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return { error: 'No autorizado' }

  const profileId = await resolveProfileId(session.user.id)
  if (!profileId) return { error: 'Perfil no encontrado' }

  await prisma.notifications.updateMany({
    where: { id: notificationId, user_id: profileId },
    data: { is_read: true },
  })

  revalidatePath('/provider/notifications')
  return { success: true }
}

export async function markAllNotificationsReadAction() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return { error: 'No autorizado' }

  const profileId = await resolveProfileId(session.user.id)
  if (!profileId) return { error: 'Perfil no encontrado' }

  await prisma.notifications.updateMany({
    where: { user_id: profileId, is_read: false },
    data: { is_read: true },
  })

  revalidatePath('/provider/notifications')
  return { success: true }
}

export async function deleteNotificationAction(notificationId: string) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return { error: 'No autorizado' }

  const profileId = await resolveProfileId(session.user.id)
  if (!profileId) return { error: 'Perfil no encontrado' }

  await prisma.notifications.deleteMany({
    where: { id: notificationId, user_id: profileId },
  })

  revalidatePath('/provider/notifications')
  return { success: true }
}
