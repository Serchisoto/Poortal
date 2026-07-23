import { redirect } from 'next/navigation'
import Link from 'next/link'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { getProviderByAuthUserId } from '@/queries/providers'
import { getExperiencesByProvider } from '@/queries/experiences'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Package, Plus, Pencil } from 'lucide-react'
import type { Experience } from '@/types'

export const metadata = { title: 'Mis Experiencias' }

const statusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  draft:          { label: 'Borrador', variant: 'outline' },
  pending_review: { label: 'En revision', variant: 'secondary' },
  active:         { label: 'Activa', variant: 'default' },
  paused:         { label: 'Pausada', variant: 'outline' },
  rejected:       { label: 'Rechazada', variant: 'destructive' },
  archived:       { label: 'Archivada', variant: 'outline' },
}

function ExperienceRow({ exp }: { exp: Experience }) {
  const status = statusLabels[exp.status] ?? { label: exp.status, variant: 'outline' as const }
  return (
    <div className="flex items-center justify-between rounded-md border p-4">
      <div className="flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium">{exp.title}</span>
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          ${Number(exp.price_amount).toLocaleString('es-MX')} {exp.price_currency}
          {exp.duration_minutes && <> &middot; {exp.duration_minutes} min</>}
          {exp.review_count > 0 && (
            <> &middot; {Number(exp.average_rating).toFixed(1)} ({exp.review_count} rese&ntilde;as)</>
          )}
        </p>
      </div>
      <Button variant="ghost" size="sm" asChild>
        <Link href={`/provider/experiences/${exp.id}/edit`}>
          <Pencil className="mr-1 h-4 w-4" />
          Editar
        </Link>
      </Button>
    </div>
  )
}

export default async function ProviderExperiencesPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/login')

  const provider = await getProviderByAuthUserId(session.user.id)
  if (!provider) redirect('/register/provider')

  const experiences = await getExperiencesByProvider(provider.id)

  const byStatus = {
    active:         experiences.filter((e) => e.status === 'active'),
    pending_review: experiences.filter((e) => e.status === 'pending_review'),
    draft:          experiences.filter((e) => e.status === 'draft'),
    other:          experiences.filter((e) => ['paused', 'rejected', 'archived'].includes(e.status)),
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Package className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Mis Experiencias</h1>
            <p className="text-muted-foreground">{experiences.length} experiencias en total</p>
          </div>
        </div>
        <Button asChild>
          <Link href="/provider/experiences/new">
            <Plus className="mr-2 h-4 w-4" />
            Nueva Experiencia
          </Link>
        </Button>
      </div>

      {experiences.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Package className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium">Aun no tienes experiencias</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Crea tu primera experiencia para empezar a recibir reservas.
            </p>
            <Button asChild className="mt-4">
              <Link href="/provider/experiences/new">
                <Plus className="mr-2 h-4 w-4" />
                Crear Experiencia
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {byStatus.active.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Activas ({byStatus.active.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {byStatus.active.map((exp) => <ExperienceRow key={exp.id} exp={exp} />)}
              </CardContent>
            </Card>
          )}

          {byStatus.pending_review.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">En revision ({byStatus.pending_review.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {byStatus.pending_review.map((exp) => <ExperienceRow key={exp.id} exp={exp} />)}
              </CardContent>
            </Card>
          )}

          {byStatus.draft.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Borradores ({byStatus.draft.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {byStatus.draft.map((exp) => <ExperienceRow key={exp.id} exp={exp} />)}
              </CardContent>
            </Card>
          )}

          {byStatus.other.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Otras ({byStatus.other.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {byStatus.other.map((exp) => <ExperienceRow key={exp.id} exp={exp} />)}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
