import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { getCurrentProfile } from '@/queries/profiles'
import { signOutAction } from '@/actions/auth'
import { ROUTES } from '@/lib/constants'
import { EditProfileForm } from '@/components/profile/edit-profile-form'
import Link from 'next/link'
import { User, Mail, Phone, ChevronRight, LogOut, Store, Shield } from 'lucide-react'

export const metadata = {
  title: 'Mi Perfil',
}

const ROLE_LABELS: Record<string, string> = {
  tourist: 'Turista',
  provider: 'Proveedor',
  admin: 'Admin',
}

export default async function ProfilePage() {
  const profile = await getCurrentProfile()

  return (
    <div className="flex flex-col">
      {/* Mobile hero */}
      <div className="flex flex-col items-center bg-muted/30 px-4 pt-10 pb-8 md:hidden">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-background shadow-sm ring-2 ring-border">
          <User className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="mt-3 text-xl font-bold">{profile?.full_name || 'Usuario'}</h1>
        <Badge variant="secondary" className="mt-1 capitalize">
          {ROLE_LABELS[profile?.role || 'tourist'] ?? profile?.role}
        </Badge>
      </div>

      {/* Mobile info list */}
      <div className="md:hidden">
        <div className="px-4 pt-4 pb-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Información personal
          </p>
        </div>
        <div className="divide-y bg-background">
          <InfoRow icon={<Mail className="h-4 w-4 text-muted-foreground" />} label="Correo" value={profile?.email} />
          <InfoRow icon={<Phone className="h-4 w-4 text-muted-foreground" />} label="Teléfono" value={profile?.phone} />
        </div>

        <div className="px-4 pt-6 pb-8 space-y-3">
          <EditProfileForm fullName={profile?.full_name ?? null} phone={profile?.phone ?? null} />
          {profile?.role === 'provider' && (
            <Link
              href={ROUTES.providerDashboard}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Store className="h-4 w-4" />
              Panel Proveedor
            </Link>
          )}
          {profile?.role === 'admin' && (
            <Link
              href={ROUTES.adminDashboard}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Shield className="h-4 w-4" />
              Panel Admin
            </Link>
          )}
          <form action={signOutAction}>
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-destructive/30 px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/5 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Cerrar Sesión
            </button>
          </form>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden md:block container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Mi Perfil</h1>
          <p className="mt-1 text-muted-foreground">Administra tu información personal</p>
        </div>

        <div className="grid grid-cols-3 gap-8">
          <Card>
            <CardContent className="flex flex-col items-center py-8">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                <User className="h-12 w-12 text-muted-foreground" />
              </div>
              <h2 className="mt-4 text-lg font-semibold">{profile?.full_name || 'Usuario'}</h2>
              <Badge variant="secondary" className="mt-1 capitalize">
                {ROLE_LABELS[profile?.role || 'tourist'] ?? profile?.role}
              </Badge>
            </CardContent>
          </Card>

          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Nombre completo</label>
                <div className="rounded-md border px-3 py-2 text-sm">{profile?.full_name || '--'}</div>
              </div>
              <Separator />
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Correo electrónico</label>
                <div className="rounded-md border px-3 py-2 text-sm">{profile?.email || '--'}</div>
              </div>
              <Separator />
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Teléfono</label>
                <div className="rounded-md border px-3 py-2 text-sm">{profile?.phone || '--'}</div>
              </div>
              <Separator />
              <EditProfileForm fullName={profile?.full_name ?? null} phone={profile?.phone ?? null} />
              <form action={signOutAction} className="pt-1">
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-lg border border-destructive/30 px-4 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/5 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Cerrar Sesión
                </button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value?: string | null
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <span className="shrink-0">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-medium">{value || '--'}</p>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/40" />
    </div>
  )
}
