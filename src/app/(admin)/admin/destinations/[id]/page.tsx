import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import { getCollectionsByDestinationAdmin } from '@/queries/collections'
import { getDestinationInfoCategories } from '@/queries/destination_info'
import { DestinationCollectionsClient } from '@/components/admin/destination-collections-client'
import { DestinationInfoClient } from '@/components/admin/destination-info-client'
import type { Destination } from '@/types'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: 'Colecciones del destino',
}

interface Props {
  params: Promise<{ id: string }>
}

export default async function AdminDestinationCollectionsPage({ params }: Props) {
  const { id } = await params

  const destination = await prisma.destinations.findUnique({ where: { id } })
  if (!destination) notFound()

  const [collections, infoCategories] = await Promise.all([
    getCollectionsByDestinationAdmin(id),
    getDestinationInfoCategories(id),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {(destination as unknown as Destination).name}
        </h1>
        <p className="mt-1 text-muted-foreground">
          Gestiona las colecciones curadas y la información local de este destino
        </p>
      </div>

      <Tabs defaultValue="collections" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="collections">Colecciones de Experiencias</TabsTrigger>
          <TabsTrigger value="info">Información Local</TabsTrigger>
        </TabsList>

        <TabsContent value="collections" className="mt-0">
          <DestinationCollectionsClient
            destinationId={id}
            initialCollections={collections}
          />
        </TabsContent>

        <TabsContent value="info" className="mt-0">
          <DestinationInfoClient
            destinationId={id}
            initialCategories={infoCategories}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
