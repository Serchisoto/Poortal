export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { getProvidersByStatus } from '@/queries/providers'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Clock, CheckCircle, XCircle } from 'lucide-react'
import { ProviderTable } from '@/components/admin/provider-table'

export const metadata: Metadata = {
  title: 'Gestion de Proveedores',
}

export default async function AdminProvidersPage() {
  const [pending, active, suspended, rejected] = await Promise.all([
    getProvidersByStatus('pending_review'),
    getProvidersByStatus('active'),
    getProvidersByStatus('suspended'),
    getProvidersByStatus('rejected'),
  ])

  const approvedIncomplete = await getProvidersByStatus('approved_incomplete')

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Gestion de Proveedores
        </h1>
        <p className="mt-1 text-muted-foreground">
          Administra y modera los proveedores de la plataforma
        </p>
      </div>

      <Tabs defaultValue="pendientes">
        <TabsList>
          <TabsTrigger value="pendientes">
            <Clock className="mr-1 h-4 w-4" />
            Pendientes
            {pending.length > 0 && (
              <Badge variant="secondary" className="ml-2">{pending.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="activos">
            <CheckCircle className="mr-1 h-4 w-4" />
            Activos
            <Badge variant="secondary" className="ml-2">{active.length + approvedIncomplete.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="suspendidos">
            <XCircle className="mr-1 h-4 w-4" />
            Suspendidos/Rechazados
            <Badge variant="secondary" className="ml-2">{suspended.length + rejected.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pendientes" className="mt-6">
          <ProviderTable
            providers={pending}
            showActions="approve"
            emptyMessage="No hay proveedores pendientes de revision."
          />
        </TabsContent>

        <TabsContent value="activos" className="mt-6">
          <ProviderTable
            providers={[...active, ...approvedIncomplete]}
            showActions="suspend"
            emptyMessage="No hay proveedores activos todavia."
          />
        </TabsContent>

        <TabsContent value="suspendidos" className="mt-6">
          <ProviderTable
            providers={[...suspended, ...rejected]}
            emptyMessage="No hay proveedores suspendidos o rechazados."
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
