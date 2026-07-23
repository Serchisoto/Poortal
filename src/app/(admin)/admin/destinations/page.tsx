export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, FolderOpen, ArrowRight } from 'lucide-react'
import { getDestinations } from '@/queries/destinations'
import { getAllCollections } from '@/queries/collections'

export const metadata: Metadata = {
  title: 'Gestion de Destinos',
}

export default async function AdminDestinationsPage() {
  const [destinations, collections] = await Promise.all([
    getDestinations(),
    getAllCollections(),
  ])

  const collectionCountByDestination = collections.reduce<Record<string, number>>((acc, col) => {
    return { ...acc, [col.destination_id]: (acc[col.destination_id] ?? 0) + 1 }
  }, {})

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestion de Destinos</h1>
        <p className="mt-1 text-muted-foreground">
          Administra los destinos y sus colecciones curadas
        </p>
      </div>

      {destinations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <MapPin className="h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-sm text-muted-foreground">No hay destinos configurados.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {destinations.map((dest) => {
            const collectionCount = collectionCountByDestination[dest.id] ?? 0
            return (
              <Card key={dest.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      {dest.name}
                    </CardTitle>
                    <Badge>{dest.is_active ? 'Activo' : 'Inactivo'}</Badge>
                  </div>
                  <CardDescription>
                    {[dest.city, dest.state, dest.country].filter(Boolean).join(', ')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <FolderOpen className="h-4 w-4" />
                        Colecciones curadas
                      </span>
                      <span className="font-medium">{collectionCount}</span>
                    </div>
                    <div className="pt-3 border-t">
                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <Link href={`/admin/destinations/${dest.id}`}>
                          Gestionar colecciones
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
