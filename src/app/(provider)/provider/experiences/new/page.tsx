import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { getProviderByAuthUserId } from '@/queries/providers'
import { getCategories } from '@/queries/categories'
import { getDestinations } from '@/queries/destinations'
import { ExperienceForm } from '@/components/provider/experience-form'

export const metadata = {
  title: 'Nueva Experiencia',
}

export default async function NewExperiencePage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/login')

  const provider = await getProviderByAuthUserId(session.user.id)
  if (!provider) redirect('/register/provider')
  if (provider.status !== 'active' && provider.status !== 'approved_incomplete') {
    redirect('/provider/onboarding')
  }

  const [categories, destinations] = await Promise.all([
    getCategories(),
    getDestinations(),
  ])

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Nueva Experiencia</h1>
        <p className="text-muted-foreground">
          Completa los datos de tu experiencia. Podras agregar imagenes y disponibilidad despues.
        </p>
      </div>

      <ExperienceForm
        categories={categories}
        destinations={destinations}
      />
    </div>
  )
}
