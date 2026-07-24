'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import prisma from '@/lib/prisma'

async function verifyAdmin(): Promise<boolean> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return false
  const profile = await prisma.profiles.findFirst({
    where: { user_id: session.user.id },
    select: { role: true },
  })
  return profile?.role === 'admin'
}

export async function toggleDestinationCategoryAction(
  destinationId: string,
  categorySlug: string,
  enabled: boolean
): Promise<{ error?: string }> {
  const isAdmin = await verifyAdmin()
  if (!isAdmin) return { error: 'Sin permisos.' }

  const category = await prisma.categories.findFirst({ where: { slug: categorySlug } })
  if (!category) return { error: 'Categoría no encontrada.' }

  if (enabled) {
    await prisma.destination_categories.upsert({
      where: {
        destination_id_category_id: {
          destination_id: destinationId,
          category_id: category.id,
        },
      },
      create: { destination_id: destinationId, category_id: category.id },
      update: {},
    })
  } else {
    await prisma.destination_categories.deleteMany({
      where: { destination_id: destinationId, category_id: category.id },
    })
  }

  revalidatePath(`/admin/destinations/${destinationId}`)
  revalidatePath('/destinations', 'layout')
  return {}
}
