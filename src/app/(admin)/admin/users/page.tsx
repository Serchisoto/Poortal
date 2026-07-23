export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users } from 'lucide-react'
import prisma from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'Gestion de Usuarios',
}

const ROLE_LABELS: Record<string, string> = {
  tourist: 'Turista',
  provider: 'Proveedor',
  admin: 'Admin',
}

const ROLE_BADGE_VARIANT: Record<string, 'default' | 'secondary' | 'outline'> = {
  tourist: 'secondary',
  provider: 'default',
  admin: 'outline',
}

export default async function AdminUsersPage() {
  const [roleCounts, users] = await Promise.all([
    prisma.profiles.groupBy({ by: ['role'], _count: { id: true } }),
    prisma.profiles.findMany({
      orderBy: { created_at: 'desc' },
      take: 100,
    }),
  ])

  const countByRole = Object.fromEntries(
    roleCounts.map((r) => [r.role, r._count.id])
  )

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Gestion de Usuarios
        </h1>
        <p className="mt-1 text-muted-foreground">
          Administra los usuarios registrados en la plataforma
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline">Total: {users.length}</Badge>
        <Badge variant="secondary">Turistas: {countByRole.tourist ?? 0}</Badge>
        <Badge variant="secondary">Proveedores: {countByRole.provider ?? 0}</Badge>
        <Badge variant="secondary">Admins: {countByRole.admin ?? 0}</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de usuarios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-5 gap-4 border-b bg-muted/50 px-4 py-3 text-sm font-medium text-muted-foreground">
              <div>Nombre</div>
              <div>Email</div>
              <div>Rol</div>
              <div>Telefono</div>
              <div>Registro</div>
            </div>
            {users.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Users className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-medium">
                  Sin usuarios registrados
                </h3>
              </div>
            ) : (
              <div className="divide-y">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="grid grid-cols-5 gap-4 px-4 py-3 text-sm"
                  >
                    <div className="truncate font-medium">
                      {user.full_name ?? '—'}
                    </div>
                    <div className="truncate text-muted-foreground">
                      {user.email}
                    </div>
                    <div>
                      <Badge
                        variant={ROLE_BADGE_VARIANT[user.role] ?? 'outline'}
                      >
                        {ROLE_LABELS[user.role] ?? user.role}
                      </Badge>
                    </div>
                    <div className="text-muted-foreground">
                      {user.phone ?? '—'}
                    </div>
                    <div className="text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString('es-MX')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
