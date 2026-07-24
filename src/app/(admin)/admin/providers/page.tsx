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
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Proveedores</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Administra y modera los proveedores de la plataforma
        </p>
      </div>

      <Tabs defaultValue="pendientes">
        <TabsList className="w-full">
          <TabsTrigger value="pendientes" className="flex-1 gap-1.5">
            <Clock className="h-3.5 w-3.5 shrink-0" />
            <span>Pendientes</span>
            {pending.length > 0 && (
              <Badge variant="destructive" className="h-4 min-w-4 rounded-full px-1 text-[10px]">{pending.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="activos" className="flex-1 gap-1.5">
            <CheckCircle className="h-3.5 w-3.5 shrink-0" />
            <span>Activos</span>
            <Badge variant="secondary" className="h-4 min-w-4 rounded-full px-1 text-[10px]">{active.length + approvedIncomplete.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="suspendidos" className="flex-1 gap-1.5">
            <XCircle className="h-3.5 w-3.5 shrink-0" />
            <span>Suspendidos</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pendientes" className="mt-4">
          <ProviderTable
            providers={pending}
            showActions="approve"
            emptyMessage="No hay proveedores pendientes de revision."
          />
        </TabsContent>

        <TabsContent value="activos" className="mt-4">
          <ProviderTable
            providers={[...active, ...approvedIncomplete]}
            showActions="suspend"
            emptyMessage="No hay proveedores activos todavia."
          />
        </TabsContent>

        <TabsContent value="suspendidos" className="mt-4">
          <ProviderTable
            providers={[...suspended, ...rejected]}
            emptyMessage="No hay proveedores suspendidos o rechazados."
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
