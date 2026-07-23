'use server'

import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { getProviderByAuthUserId } from '@/queries/providers'
import prisma from '@/lib/prisma'

export async function updateBusinessInfoAction(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return { error: 'No autorizado' }

  const provider = await getProviderByAuthUserId(session.user.id)
  if (!provider) return { error: 'No autorizado' }

  const business_name = (formData.get('business_name') as string)?.trim()
  const legal_name = (formData.get('legal_name') as string)?.trim() || null
  const tax_id = (formData.get('tax_id') as string)?.trim() || null
  const phone = (formData.get('phone') as string)?.trim()
  const customer_phone = (formData.get('customer_phone') as string)?.trim() || null
  const full_address = (formData.get('full_address') as string)?.trim() || null
  const website = (formData.get('website') as string)?.trim() || null
  const short_description = (formData.get('short_description') as string)?.trim()

  if (!business_name) return { error: 'El nombre del negocio es requerido' }
  if (!phone) return { error: 'El teléfono es requerido' }
  if (!short_description) return { error: 'La descripción corta es requerida' }

  await prisma.provider_profiles.update({
    where: { id: provider.id },
    data: {
      business_name,
      legal_name,
      tax_id,
      phone,
      customer_phone,
      full_address,
      website,
      short_description,
    },
  })

  revalidatePath('/provider/profile')
  return { success: true }
}
