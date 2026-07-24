'use server'

import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

const ALLOWED_ROLES = ['tourist', 'provider', 'admin'] as const
type Role = typeof ALLOWED_ROLES[number]

export async function changeUserRoleAction(
  profileId: string,
  newRole: Role
): Promise<{ success?: string; error?: string }> {
  // Verify caller is admin
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return { error: 'No autenticado.' }

  const callerProfile = await prisma.profiles.findFirst({
    where: { user_id: session.user.id },
    select: { role: true },
  })
  if (callerProfile?.role !== 'admin') return { error: 'No autorizado.' }

  if (!ALLOWED_ROLES.includes(newRole)) return { error: 'Rol invalido.' }

  const target = await prisma.profiles.findUnique({
    where: { id: profileId },
    select: { role: true, email: true, user_id: true },
  })
  if (!target) return { error: 'Usuario no encontrado.' }

  // Prevent removing your own admin role
  const callerOwnProfile = await prisma.profiles.findFirst({
    where: { user_id: session.user.id },
    select: { id: true },
  })
  if (callerOwnProfile?.id === profileId && newRole !== 'admin') {
    return { error: 'No puedes quitarte el rol de admin a ti mismo.' }
  }

  await prisma.profiles.update({
    where: { id: profileId },
    data: { role: newRole },
  })

  // Keep Better Auth's user.role in sync — the edge middleware authorizes
  // role-based routes based on this field, not on profiles.role.
  if (target.user_id) {
    await prisma.user.update({
      where: { id: target.user_id },
      data: { role: newRole },
    })
  }

  revalidatePath('/admin/users')
  return { success: `Rol actualizado a "${newRole}" para ${target.email}.` }
}
