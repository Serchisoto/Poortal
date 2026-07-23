'use server'

import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function updateProfileAction(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return { error: 'No autorizado' }

  const full_name = (formData.get('full_name') as string)?.trim()
  const phone = (formData.get('phone') as string)?.trim() || null

  if (!full_name) return { error: 'El nombre es requerido' }

  await prisma.profiles.updateMany({
    where: { user_id: session.user.id },
    data: { full_name, phone, updated_at: new Date() },
  })

  revalidatePath('/profile')
  return { success: true }
}
