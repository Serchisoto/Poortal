'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { GCS_BASE_URL } from '@/lib/gcs'

async function verifyAdmin(): Promise<boolean> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return false
  const profile = await prisma.profiles.findFirst({
    where: { user_id: session.user.id },
    select: { role: true },
  })
  return profile?.role === 'admin'
}

/**
 * Save (or clear) the cover image URL for a destination.
 * Pass `key` as the GCS object key to set, or `null` to remove.
 */
export async function updateDestinationCoverAction(
  destinationId: string,
  key: string | null
): Promise<{ error?: string; publicUrl?: string }> {
  const isAdmin = await verifyAdmin()
  if (!isAdmin) return { error: 'No tienes permisos de administrador.' }

  const cover_image_url = key ? `${GCS_BASE_URL}/${key}` : null

  await prisma.destinations.update({
    where: { id: destinationId },
    data: { cover_image_url },
  })

  revalidatePath(`/admin/destinations/${destinationId}`)
  revalidatePath('/destinations', 'layout')

  return { publicUrl: cover_image_url ?? undefined }
}
