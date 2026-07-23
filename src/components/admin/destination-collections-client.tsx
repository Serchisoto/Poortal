'use client'

import { useState } from 'react'
import { CollectionManager } from './collection-manager'
import { CollectionDetails } from './collection-details'
import type { CollectionWithExperiences } from '@/types'

interface Props {
  destinationId: string
  initialCollections: CollectionWithExperiences[]
}

export function DestinationCollectionsClient({ destinationId, initialCollections }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(
    initialCollections[0]?.id ?? null
  )

  // Derive from fresh props so router.refresh() always shows updated data
  const selectedCollection =
    initialCollections.find((c) => c.id === selectedId) ?? initialCollections[0] ?? null

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <CollectionManager
        destinationId={destinationId}
        collections={initialCollections}
        onSelectCollection={(col) => setSelectedId(col.id)}
        selectedCollectionId={selectedCollection?.id}
      />

      <div>
        {selectedCollection ? (
          <CollectionDetails
            collection={selectedCollection}
            destinationId={destinationId}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
            Selecciona una coleccion para ver sus experiencias
          </div>
        )}
      </div>
    </div>
  )
}
