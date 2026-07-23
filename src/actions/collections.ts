'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import prisma from '@/lib/prisma'

export type CollectionActionState = {
  error?: string
  success?: string
}

async function verifyAdmin(): Promise<boolean> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return false

  const profile = await prisma.profiles.findFirst({
    where: { user_id: session.user.id },
    select: { role: true },
  })
  return profile?.role === 'admin'
}

export async function createCollectionAction(
  _prevState: CollectionActionState,
  formData: FormData
): Promise<CollectionActionState> {
  if (!(await verifyAdmin())) return { error: 'No tienes permisos de administrador.' }

  const destinationId = formData.get('destination_id') as string
  const name = (formData.get('name') as string)?.trim()
  const description = (formData.get('description') as string)?.trim() || null
  const icon = (formData.get('icon') as string)?.trim() || null
  const sortOrder = parseInt(formData.get('sort_order') as string) || 0

  if (!destinationId || !name) return { error: 'El nombre y el destino son obligatorios.' }

  await prisma.destination_collections.create({
    data: { destination_id: destinationId, name, description, icon, sort_order: sortOrder },
  })

  revalidatePath('/admin/destinations', 'layout')
  revalidatePath('/destinations', 'layout')
  return { success: 'Coleccion creada correctamente.' }
}

export async function updateCollectionAction(
  _prevState: CollectionActionState,
  formData: FormData
): Promise<CollectionActionState> {
  if (!(await verifyAdmin())) return { error: 'No tienes permisos de administrador.' }

  const collectionId = formData.get('collection_id') as string
  const name = (formData.get('name') as string)?.trim()
  const description = (formData.get('description') as string)?.trim() || null
  const icon = (formData.get('icon') as string)?.trim() || null
  const sortOrder = parseInt(formData.get('sort_order') as string) || 0
  const isActive = formData.get('is_active') !== 'false'

  if (!collectionId || !name) return { error: 'El nombre es obligatorio.' }

  await prisma.destination_collections.update({
    where: { id: collectionId },
    data: { name, description, icon, sort_order: sortOrder, is_active: isActive, updated_at: new Date() },
  })

  revalidatePath('/admin/destinations', 'layout')
  revalidatePath('/destinations', 'layout')
  return { success: 'Coleccion actualizada.' }
}

export async function deleteCollectionAction(
  _prevState: CollectionActionState,
  formData: FormData
): Promise<CollectionActionState> {
  if (!(await verifyAdmin())) return { error: 'No tienes permisos de administrador.' }

  const collectionId = formData.get('collection_id') as string
  if (!collectionId) return { error: 'ID de coleccion no proporcionado.' }

  await prisma.destination_collections.delete({ where: { id: collectionId } })

  revalidatePath('/admin/destinations', 'layout')
  revalidatePath('/destinations', 'layout')
  return { success: 'Coleccion eliminada.' }
}

export async function addExperienceToCollectionAction(
  _prevState: CollectionActionState,
  formData: FormData
): Promise<CollectionActionState> {
  if (!(await verifyAdmin())) return { error: 'No tienes permisos de administrador.' }

  const collectionId = formData.get('collection_id') as string
  const experienceId = formData.get('experience_id') as string
  if (!collectionId || !experienceId) return { error: 'Datos incompletos.' }

  const existing = await prisma.collection_experiences.findFirst({
    where: { collection_id: collectionId, experience_id: experienceId },
  })
  if (existing) return { error: 'Esta experiencia ya esta en la coleccion.' }

  await prisma.collection_experiences.create({
    data: { collection_id: collectionId, experience_id: experienceId },
  })

  revalidatePath('/admin/destinations', 'layout')
  revalidatePath('/destinations', 'layout')
  return { success: 'Experiencia agregada a la coleccion.' }
}

export async function removeExperienceFromCollectionAction(
  _prevState: CollectionActionState,
  formData: FormData
): Promise<CollectionActionState> {
  if (!(await verifyAdmin())) return { error: 'No tienes permisos de administrador.' }

  const collectionId = formData.get('collection_id') as string
  const experienceId = formData.get('experience_id') as string
  if (!collectionId || !experienceId) return { error: 'Datos incompletos.' }

  await prisma.collection_experiences.deleteMany({
    where: { collection_id: collectionId, experience_id: experienceId },
  })

  revalidatePath('/admin/destinations', 'layout')
  revalidatePath('/destinations', 'layout')
  return { success: 'Experiencia eliminada de la coleccion.' }
}
