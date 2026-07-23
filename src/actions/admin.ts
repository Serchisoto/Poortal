'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import prisma from '@/lib/prisma'

export type AdminActionState = {
  error?: string
  success?: string
}

async function verifyAdmin(): Promise<{ userId: string } | null> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return null

  const profile = await prisma.profiles.findFirst({
    where: { user_id: session.user.id },
    select: { role: true },
  })

  if (profile?.role !== 'admin') return null
  return { userId: session.user.id }
}

export async function approveProviderAction(
  _prevState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const admin = await verifyAdmin()
  if (!admin) return { error: 'No tienes permisos de administrador.' }

  const providerId = formData.get('provider_id') as string
  if (!providerId) return { error: 'ID de proveedor no proporcionado.' }

  const adminProfile = await prisma.profiles.findFirst({
    where: { user_id: admin.userId },
    select: { id: true },
  })

  await prisma.provider_profiles.update({
    where: { id: providerId },
    data: {
      status: 'approved_incomplete',
      approved_at: new Date(),
      approved_by: adminProfile?.id ?? null,
    },
  })

  revalidatePath('/admin/providers')
  return { success: 'Proveedor aprobado correctamente.' }
}

export async function rejectProviderAction(
  _prevState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const admin = await verifyAdmin()
  if (!admin) return { error: 'No tienes permisos de administrador.' }

  const providerId = formData.get('provider_id') as string
  const reason = formData.get('rejection_reason') as string
  if (!providerId) return { error: 'ID de proveedor no proporcionado.' }

  await prisma.provider_profiles.update({
    where: { id: providerId },
    data: { status: 'rejected', rejection_reason: reason || 'No se proporciono motivo.' },
  })

  revalidatePath('/admin/providers')
  return { success: 'Proveedor rechazado.' }
}

export async function suspendProviderAction(
  _prevState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const admin = await verifyAdmin()
  if (!admin) return { error: 'No tienes permisos de administrador.' }

  const providerId = formData.get('provider_id') as string
  const reason = formData.get('reason') as string

  await prisma.provider_profiles.update({
    where: { id: providerId },
    data: { status: 'suspended', rejection_reason: reason || null },
  })

  revalidatePath('/admin/providers')
  return { success: 'Proveedor suspendido.' }
}

export async function approveExperienceAction(
  _prevState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const admin = await verifyAdmin()
  if (!admin) return { error: 'No tienes permisos de administrador.' }

  const experienceId = formData.get('experience_id') as string

  await prisma.experiences.update({
    where: { id: experienceId },
    data: { status: 'active', published_at: new Date() },
  })

  revalidatePath('/admin/experiences')
  return { success: 'Experiencia aprobada y publicada.' }
}

export async function rejectExperienceAction(
  _prevState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const admin = await verifyAdmin()
  if (!admin) return { error: 'No tienes permisos de administrador.' }

  const experienceId = formData.get('experience_id') as string
  const reason = formData.get('rejection_reason') as string

  await prisma.experiences.update({
    where: { id: experienceId },
    data: { status: 'rejected', rejection_reason: reason || 'No se proporciono motivo.' },
  })

  revalidatePath('/admin/experiences')
  return { success: 'Experiencia rechazada.' }
}

export async function toggleFeaturedAction(
  _prevState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const admin = await verifyAdmin()
  if (!admin) return { error: 'No tienes permisos de administrador.' }

  const experienceId = formData.get('experience_id') as string
  const isFeatured = formData.get('is_featured') === 'true'

  await prisma.experiences.update({
    where: { id: experienceId },
    data: { is_featured: !isFeatured },
  })

  revalidatePath('/admin/experiences')
  return { success: !isFeatured ? 'Marcada como recomendada.' : 'Quitada de recomendadas.' }
}

export async function addRecommendationAction(
  _prevState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const admin = await verifyAdmin()
  if (!admin) return { error: 'No tienes permisos de administrador.' }

  const destinationId = formData.get('destination_id') as string
  const experienceId = formData.get('experience_id') as string
  if (!destinationId || !experienceId) return { error: 'Datos incompletos.' }

  await prisma.destination_recommendations.create({
    data: { destination_id: destinationId, experience_id: experienceId },
  })

  revalidatePath('/admin/destinations')
  return { success: 'Recomendacion agregada.' }
}

export async function removeRecommendationAction(
  _prevState: AdminActionState,
  formData: FormData
): Promise<AdminActionState> {
  const admin = await verifyAdmin()
  if (!admin) return { error: 'No tienes permisos de administrador.' }

  const destinationId = formData.get('destination_id') as string
  const experienceId = formData.get('experience_id') as string
  if (!destinationId || !experienceId) return { error: 'Datos incompletos.' }

  await prisma.destination_recommendations.deleteMany({
    where: { destination_id: destinationId, experience_id: experienceId },
  })

  revalidatePath('/admin/destinations')
  return { success: 'Recomendacion eliminada.' }
}
