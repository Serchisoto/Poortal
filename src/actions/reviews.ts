'use server'

import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { getProviderByAuthUserId } from '@/queries/providers'
import prisma from '@/lib/prisma'

export async function replyToReviewAction(reviewId: string, response: string) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return { error: 'No autorizado' }

  const provider = await getProviderByAuthUserId(session.user.id)
  if (!provider) return { error: 'No autorizado' }

  const trimmed = response.trim()
  if (!trimmed || trimmed.length < 10) return { error: 'La respuesta debe tener al menos 10 caracteres' }
  if (trimmed.length > 1000) return { error: 'La respuesta no puede superar 1000 caracteres' }

  const review = await prisma.reviews.findFirst({
    where: { id: reviewId, booking_items: { provider_id: provider.id } },
    select: { id: true, provider_response: true },
  })

  if (!review) return { error: 'Reseña no encontrada' }
  if (review.provider_response) return { error: 'Esta reseña ya tiene respuesta' }

  await prisma.reviews.update({
    where: { id: reviewId },
    data: {
      provider_response: trimmed,
      provider_responded_at: new Date(),
    },
  })

  revalidatePath('/provider/analytics')
  return { success: true }
}
