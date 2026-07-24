'use server'

import prisma from '@/lib/prisma'

/**
 * Promotes a user to admin role by email.
 * This action is intentionally not behind auth so you can bootstrap
 * the first admin. After the first admin exists you should remove or
 * restrict this route.
 */
export async function promoteToAdmin(email: string): Promise<{ success?: string; error?: string }> {
  const normalized = email.trim().toLowerCase()
  if (!normalized) return { error: 'Email requerido.' }

  const profile = await prisma.profiles.findUnique({
    where: { email: normalized },
    select: { id: true, role: true, full_name: true, user_id: true },
  })

  if (!profile) {
    return { error: `No se encontro una cuenta con el email "${normalized}". Registrate primero.` }
  }

  if (profile.role === 'admin') {
    return { success: `El usuario ya es administrador.` }
  }

  await prisma.profiles.update({
    where: { id: profile.id },
    data: { role: 'admin' },
  })

  // Keep Better Auth's user.role in sync — the edge middleware authorizes
  // admin routes based on this field, not on profiles.role.
  if (profile.user_id) {
    await prisma.user.update({
      where: { id: profile.user_id },
      data: { role: 'admin' },
    })
  }

  return { success: `Listo. El usuario "${normalized}" ahora es administrador. Inicia sesion en /admin/dashboard.` }
}
