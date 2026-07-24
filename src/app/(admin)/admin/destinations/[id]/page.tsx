import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import { getCollectionsByDestinationAdmin } from '@/queries/collections'
import { getDestinationInfoCategories } from '@/queries/destination_info'
import { getDestinationCategories } from '@/queries/destinations'
import { DestinationCollectionsClient } from '@/components/admin/destination-collections-client'
import { DestinationInfoClient } from '@/components/admin/destination-info-client'
import { DestinationCategoriesClient } from '@/components/admin/destination-categories-client'
import { DestinationCoverClient } from '@/components/admin/destination-cover-client'
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

  const dest = destination as unknown as Destination

  const [collections, infoCategories, enabledCategories] = await Promise.all([
    getCollectionsByDestinationAdmin(id),
    getDestinationInfoCategories(id),
    getDestinationCategories(id),
  ])

  const enabledSlugs = enabledCategories.map((c) => c.slug)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight">{dest.name}</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Gestiona las colecciones curadas y la informacion local de este destino
        </p>
      </div>

      <Tabs defaultValue="cover" className="w-full">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="cover" className="flex-1">Portada</TabsTrigger>
          <TabsTrigger value="categories" className="flex-1">Categorias</TabsTrigger>
          <TabsTrigger value="collections" className="flex-1">Colecciones</TabsTrigger>
          <TabsTrigger value="info" className="flex-1">Info Local</TabsTrigger>
        </TabsList>

        <TabsContent value="cover" className="mt-0">
          <DestinationCoverClient
            destinationId={id}
            initialCoverUrl={dest.cover_image_url}
            destinationName={dest.name}
          />
        </TabsContent>

        <TabsContent value="categories" className="mt-0">
          <DestinationCategoriesClient
            destinationId={id}
            enabledSlugs={enabledSlugs}
          />
        </TabsContent>

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
