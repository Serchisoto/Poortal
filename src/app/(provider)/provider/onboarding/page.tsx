import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { getProviderByAuthUserId } from '@/queries/providers'
import { OnboardingClient } from './onboarding-client'

export const metadata = {
  title: 'Onboarding Proveedor',
}

export default async function ProviderOnboardingPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/login')

  const provider = await getProviderByAuthUserId(session.user.id)
  if (!provider) redirect('/register/provider')

  return <OnboardingClient provider={provider} />
}
