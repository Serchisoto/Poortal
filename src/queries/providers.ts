import prisma from '@/lib/prisma'
import type { ProviderProfile } from '@/types'

export async function getProviderByUserId(userId: string): Promise<ProviderProfile | null> {
  // userId here is the profiles.id (UUID), not the Better Auth user.id
  const row = await prisma.provider_profiles.findFirst({
    where: { user_id: userId },
  })
  return row as unknown as ProviderProfile | null
}

// Accepts the Better Auth user.id (TEXT), resolves profile then provider
export async function getProviderByAuthUserId(authUserId: string): Promise<ProviderProfile | null> {
  const profile = await prisma.profiles.findFirst({
    where: { user_id: authUserId },
    select: { id: true },
  })
  if (!profile) return null
  return getProviderByUserId(profile.id)
}

export async function getProviderById(id: string): Promise<ProviderProfile | null> {
  const row = await prisma.provider_profiles.findUnique({
    where: { id },
  })
  return row as unknown as ProviderProfile | null
}

export type ProviderWithProfile = ProviderProfile & {
  profiles: { full_name: string; email: string; avatar_url: string | null } | null
  categories: { name: string; slug: string } | null
}

export async function getProvidersByStatus(
  status: ProviderProfile['status']
): Promise<ProviderWithProfile[]> {
  const rows = await prisma.provider_profiles.findMany({
    where: { status: status as any },
    include: {
      profiles_provider_profiles_user_idToprofiles: {
        select: { full_name: true, email: true, avatar_url: true },
      },
      categories: {
        select: { name: true, slug: true },
      },
    },
    orderBy: { created_at: 'desc' },
  })
  return rows.map((r) => ({
    ...r,
    profiles: r.profiles_provider_profiles_user_idToprofiles,
    categories: r.categories,
  })) as unknown as ProviderWithProfile[]
}

export async function getAllProviders(): Promise<ProviderWithProfile[]> {
  const rows = await prisma.provider_profiles.findMany({
    include: {
      profiles_provider_profiles_user_idToprofiles: {
        select: { full_name: true, email: true, avatar_url: true },
      },
      categories: {
        select: { name: true, slug: true },
      },
    },
    orderBy: { created_at: 'desc' },
  })
  return rows.map((r) => ({
    ...r,
    profiles: r.profiles_provider_profiles_user_idToprofiles,
    categories: r.categories,
  })) as unknown as ProviderWithProfile[]
}

export async function getProviderExperienceCount(providerId: string): Promise<number> {
  return prisma.experiences.count({
    where: { provider_id: providerId },
  })
}
