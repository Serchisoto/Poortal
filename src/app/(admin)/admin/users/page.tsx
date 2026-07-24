export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { UsersClient } from '@/components/admin/users-client'
import prisma from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'Gestion de Usuarios',
}

export default async function AdminUsersPage() {
  const [roleCounts, users] = await Promise.all([
    prisma.profiles.groupBy({ by: ['role'], _count: { id: true } }),
    prisma.profiles.findMany({
      orderBy: { created_at: 'desc' },
      take: 200,
    }),
  ])

  const countByRole = Object.fromEntries(
    roleCounts.map((r) => [r.role, r._count.id])
  )

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestion de Usuarios</h1>
        <p className="mt-1 text-muted-foreground">
          Administra roles y visualiza todos los usuarios registrados en la plataforma.
        </p>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline">Total: {users.length}</Badge>
        <Badge variant="secondary">Turistas: {countByRole.tourist ?? 0}</Badge>
        <Badge variant="default">Proveedores: {countByRole.provider ?? 0}</Badge>
        <Badge variant="destructive">Admins: {countByRole.admin ?? 0}</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de usuarios</CardTitle>
          <CardDescription>
            Cambia el rol de cualquier usuario usando el selector en la columna Rol.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UsersClient users={users as Parameters<typeof UsersClient>[0]['users']} />
        </CardContent>
      </Card>
    </div>
  )
}
