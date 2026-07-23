"use client"

import { useEffect, useState } from 'react'
import { useSession } from '@/lib/auth-client'
import type { Profile } from '@/types'

export function useAuth() {
  const { data: session, isPending } = useSession()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [profileLoading, setProfileLoading] = useState(false)

  useEffect(() => {
    if (!session?.user) {
      setProfile(null)
      return
    }

    setProfileLoading(true)
    fetch('/api/profile')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setProfile(data?.profile ?? null))
      .catch(() => setProfile(null))
      .finally(() => setProfileLoading(false))
  }, [session?.user?.id])

  return { user: session?.user ?? null, profile, loading: isPending || profileLoading }
}
