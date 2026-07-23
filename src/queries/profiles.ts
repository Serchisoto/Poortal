import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import prisma from '@/lib/prisma'
import type { Profile } from '@/types'

export async function getCurrentProfile(): Promise<Profile | null> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return null

  const profile = await prisma.profiles.findFirst({
    where: { user_id: session.user.id },
  })
  return profile as unknown as Profile | null
}

export async function getProfileById(id: string): Promise<Profile | null> {
  const profile = await prisma.profiles.findUnique({
    where: { id },
  })
  return profile as unknown as Profile | null
}
