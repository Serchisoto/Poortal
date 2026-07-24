export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getDestinationInfoCategories } from '@/queries/destination_info'
import { getDestinationBySlug } from '@/queries/destinations'
import { getDestinationCollections } from '@/queries/collections'
import { ROUTES } from '@/lib/constants'
import { DynamicIcon } from '@/lib/lucide-icon-map'
import {
    Shield,
    Ambulance,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const destination = await getDestinationBySlug(slug)
    return {
        title: `Info - ${destination?.name || 'Destino'}`,
    }
}

export default async function DestinationInfoPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const destination = await getDestinationBySlug(slug)

    if (!destination) notFound()

    const collections = await getDestinationCollections(destination.id)
    const secureInfoCategories = await getDestinationInfoCategories(destination.id)

    return (
        <div className="bg-background pb-20">

            <main className="container mx-auto max-w-md md:max-w-2xl px-6 pt-4">
                {/* Title */}
                <h1 className="text-[22px] md:text-3xl font-light text-center mb-5 text-foreground leading-tight">
                    <span className="text-primary font-medium">{destination.name}</span> in your pocket
                </h1>

                {/* Emergency Buttons */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                    <button className="flex flex-col items-center justify-center py-3 rounded-xl bg-blue-500 text-white shadow-sm active:scale-95 transition-transform">
                        <Shield className="h-5 w-5 mb-1" />
                        <span className="text-sm font-medium">911</span>
                    </button>

                    <button className="flex flex-col items-center justify-center py-3 rounded-xl bg-red-500 text-white shadow-sm active:scale-95 transition-transform">
                        <Ambulance className="h-5 w-5 mb-1" />
                        <span className="text-sm font-medium">ambulance</span>
                    </button>
                </div>

                {/* Secure Information */}
                {secureInfoCategories.length > 0 && (
                    <div className="mb-5">
                        <h2 className="text-center text-sm font-medium text-foreground mb-2.5">secure information</h2>
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                            {secureInfoCategories.map((category) => (
                                <Link
                                    href={ROUTES.destinationInfoCategory(destination.slug, category.slug)}
                                    key={category.id}
                                    className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl border bg-white shadow-sm aspect-[5/4] active:scale-95 transition-transform"
                                >
                                    <DynamicIcon name={category.icon} className={cn("h-8 w-8", category.color)} strokeWidth={1.25} />
                                    <span className="text-[9px] font-medium text-muted-foreground text-center leading-tight">{category.title}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Recommendations — configured from admin */}
                {collections.length > 0 && (
                    <div className="mb-2">
                        <h2 className="text-center text-sm font-medium text-foreground mb-2.5">recommendations</h2>
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                            {collections.map((col) => (
                                <Link
                                    href={`/destinations/${destination.slug}/info/collection/${col.id}`}
                                    key={col.id}
                                    className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl border bg-white shadow-sm aspect-[5/4] active:scale-95 transition-transform"
                                >
                                    <DynamicIcon
                                        name={col.icon}
                                        className={cn('h-8 w-8', 'text-primary')}
                                        strokeWidth={1.25}
                                    />
                                    <span className="text-[9px] font-medium text-muted-foreground text-center leading-tight">{col.name}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}
