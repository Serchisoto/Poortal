import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

const createProfileSchema = z.object({
  userId: z.string().min(1),
  full_name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Correo electrónico inválido'),
  phone: z
    .string()
    .refine(
      (val) => val === '' || /^[+\d\s\-()]{10,}$/.test(val),
      'Formato de teléfono inválido'
    )
    .optional()
    .nullable(),
})

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const result = createProfileSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json(
      { error: 'Datos inválidos', issues: result.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const { userId, full_name, email, phone } = result.data

  if (session.user.id !== userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const existing = await prisma.profiles.findFirst({ where: { user_id: userId } })
  if (existing) {
    return NextResponse.json({ profile: existing })
  }

  const profile = await prisma.profiles.create({
    data: {
      full_name,
      email,
      phone: phone || null,
      role: 'tourist',
      user_id: userId,
    },
  })

  return NextResponse.json({ profile })
}
