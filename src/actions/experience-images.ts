'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { getStorage, GCS_BUCKET, GCS_BASE_URL } from '@/lib/gcs'

export async function addExperienceImage(
  experienceId: string,
  key: string,
  altText?: string
) {
  const url = `${GCS_BASE_URL}/${key}`

  const existing = await prisma.experience_images.count({ where: { experience_id: experienceId } })
  const isCover = existing === 0

  await prisma.experience_images.create({
    data: {
      experience_id: experienceId,
      url,
      alt_text: altText ?? null,
      sort_order: existing,
      is_cover: isCover,
    },
  })

  revalidatePath(`/provider/experiences/${experienceId}/edit`)
  return { success: true }
}

export async function deleteExperienceImage(imageId: string, experienceId: string) {
  const image = await prisma.experience_images.findUnique({ where: { id: imageId } })
  if (!image) return { success: false, error: 'Imagen no encontrada' }

  const key = image.url.replace(`${GCS_BASE_URL}/`, '')
  await getStorage().bucket(GCS_BUCKET).file(key).delete({ ignoreNotFound: true })

  await prisma.experience_images.delete({ where: { id: imageId } })

  if (image.is_cover) {
    const first = await prisma.experience_images.findFirst({
      where: { experience_id: experienceId },
      orderBy: { sort_order: 'asc' },
    })
    if (first) {
      await prisma.experience_images.update({ where: { id: first.id }, data: { is_cover: true } })
    }
  }

  revalidatePath(`/provider/experiences/${experienceId}/edit`)
  return { success: true }
}

export async function setCoverImage(imageId: string, experienceId: string) {
  await prisma.experience_images.updateMany({
    where: { experience_id: experienceId },
    data: { is_cover: false },
  })
  await prisma.experience_images.update({
    where: { id: imageId },
    data: { is_cover: true },
  })

  revalidatePath(`/provider/experiences/${experienceId}/edit`)
  return { success: true }
}
