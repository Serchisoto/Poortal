import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft, Ticket } from 'lucide-react'
import { getDestinationBySlug } from '@/queries/destinations'
import { getCollectionById } from '@/queries/collections'
import { ROUTES } from '@/lib/constants'
import { DynamicIcon } from '@/lib/lucide-icon-map'

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string; collectionId: string }>
}) {
    const { slug, collectionId } = await params
    const [destination, collection] = await Promise.all([
        getDestinationBySlug(slug),
        getCollectionById(collectionId),
    ])
    return {
        title: `${collection?.name || 'Coleccion'} - ${destination?.name || 'Destino'}`,
    }
}

export default async function CollectionInfoPage({
    params,
}: {
    params: Promise<{ slug: string; collectionId: string }>
}) {
    const { slug, collectionId } = await params
    const [destination, collection] = await Promise.all([
        getDestinationBySlug(slug),
        getCollectionById(collectionId),
    ])

    if (!destination || !collection) notFound()

    const experiences = collection.collection_experiences.map((ce) => ce.experiences)

    return (
        <div className="bg-background pb-24">
            {/* Header */}
            <div className="pt-6 px-6 md:container md:mx-auto md:max-w-3xl">
                <Link
                    href={ROUTES.destinationInfo(slug)}
                    className="inline-flex items-center justify-center p-2 -ml-2 mb-2 text-slate-900 active:scale-95 transition-transform"
                >
                    <ChevronLeft className="h-8 w-8" strokeWidth={3} />
                </Link>

                <div className="flex flex-col items-center justify-center mb-8">
                    <DynamicIcon
                        name={collection.icon}
                        className="h-12 w-12 mb-2 text-teal-600"
                        strokeWidth={1.5}
                    />
                    <h1 className="text-base text-slate-700 underline underline-offset-4 decoration-slate-400">
                        {collection.name}
                    </h1>
                </div>

                {collection.description && (
                    <h2 className="text-teal-700 font-semibold mb-6">{collection.description}</h2>
                )}
            </div>

            <main className="container mx-auto max-w-md md:max-w-3xl px-4">
                {experiences.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {experiences.map((exp) => {
                            const formattedPrice = new Intl.NumberFormat('es-MX', {
                                style: 'currency',
                                currency: exp.price_currency || 'MXN',
                                minimumFractionDigits: 0,
                            }).format(Number(exp.price_amount))

                            return (
                                <div key={exp.id} className="flex bg-white rounded-xl border shadow-sm p-4 gap-4">
                                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                                        {exp.experience_images?.[0]?.url ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={exp.experience_images[0].url}
                                                alt={exp.title}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="h-full w-full bg-slate-100" />
                                        )}
                                    </div>

                                    <div className="flex flex-1 flex-col justify-between min-w-0">
                                        <div>
                                            <h3 className="font-bold text-sm text-slate-700 uppercase tracking-wide leading-tight line-clamp-2">
                                                {exp.title}
                                            </h3>
                                            {exp.short_description && (
                                                <p className="mt-1 text-[10px] text-slate-500 line-clamp-2 leading-tight">
                                                    {exp.short_description}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="text-sm font-bold text-teal-700">{formattedPrice}</span>
                                            <Link
                                                href={ROUTES.experience(exp.id)}
                                                className="flex items-center gap-1.5 bg-teal-700 text-white rounded-md px-4 py-1.5 text-xs font-semibold active:scale-95 transition-transform"
                                            >
                                                <Ticket className="h-3.5 w-3.5" />
                                                book
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <DynamicIcon
                            name={collection.icon}
                            className="h-12 w-12 mb-3 opacity-20 text-teal-600"
                            strokeWidth={1}
                        />
                        <p className="text-sm text-muted-foreground">No hay experiencias disponibles aun</p>
                    </div>
                )}
            </main>
        </div>
    )
}
