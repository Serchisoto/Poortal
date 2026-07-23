'use client'

import { useState } from 'react'
import { InfoCategoryManager } from './info-category-manager'
import { InfoCategoryDetails } from './info-category-details'
import type { DestinationInfoCategory } from '@/queries/destination_info'

interface Props {
    destinationId: string
    initialCategories: DestinationInfoCategory[]
}

export function DestinationInfoClient({ destinationId, initialCategories }: Props) {
    const [selectedId, setSelectedId] = useState<string | null>(
        initialCategories[0]?.id ?? null
    )

    const selectedCategory =
        initialCategories.find((c) => c.id === selectedId) ?? initialCategories[0] ?? null

    return (
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
            <InfoCategoryManager
                destinationId={destinationId}
                categories={initialCategories}
                onSelectCategory={(cat) => setSelectedId(cat.id)}
                selectedCategoryId={selectedCategory?.id}
            />

            <div>
                {selectedCategory ? (
                    <InfoCategoryDetails
                        category={selectedCategory}
                        destinationId={destinationId}
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                        Selecciona una categoría de información para ver sus elementos
                    </div>
                )}
            </div>
        </div>
    )
}
