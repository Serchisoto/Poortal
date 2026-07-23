import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

const createProviderProfileSchema = z.object({
  userId: z.string().min(1),
  full_name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Correo electrónico inválido'),
  phone: z
    .string()
    .min(10, 'El teléfono debe tener al menos 10 dígitos')
    .regex(/^[+\d\s\-()]+$/, 'Formato de teléfono inválido'),
  business_name: z.string().min(2, 'El nombre del negocio debe tener al menos 2 caracteres'),
  representative_name: z.string().min(2, 'El nombre del representante es requerido'),
  location: z.string().min(2, 'La ubicación es requerida'),
  category_id: z.string().uuid('Categoría inválida'),
  short_description: z
    .string()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(300, 'La descripción no puede exceder 300 caracteres'),
})

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const result = createProviderProfileSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json(
      { error: 'Datos inválidos', issues: result.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const {
    userId,
    full_name,
    email,
    phone,
    business_name,
    representative_name,
    location,
    category_id,
    short_description,
  } = result.data

  if (session.user.id !== userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const existing = await prisma.profiles.findFirst({ where: { user_id: userId } })
  if (existing) {
    return NextResponse.json({ error: 'Ya existe un perfil para este usuario.' }, { status: 409 })
  }

  const destination = await prisma.destinations.findFirst({
    where: { slug: 'cancun' },
    select: { id: true },
  })

  const [profile] = await prisma.$transaction([
    prisma.profiles.create({
      data: {
        full_name,
        email,
        phone: phone || null,
        role: 'provider',
        user_id: userId,
      },
    }),
    prisma.user.update({
      where: { id: userId },
      data: { role: 'provider' },
    }),
  ])

  await prisma.provider_profiles.create({
    data: {
      user_id: profile.id,
      destination_id: destination?.id ?? null,
      business_name,
      representative_name,
      phone,
      location,
      category_id,
      short_description,
      status: 'pending_review',
    },
  })

  return NextResponse.json({ ok: true })
}
