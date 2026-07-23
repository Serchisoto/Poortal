import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { getDestinationBySlug } from '@/queries/destinations'
import { ROUTES } from '@/lib/constants'
import { InfoCard } from '@/components/destinations/info-card'
import { LocalTipCard } from '@/components/destinations/local-tip-card'
import { getDestinationInfoCategory, getDestinationInfoItems } from '@/queries/destination_info'

import { cn } from '@/lib/utils'

import { DynamicIcon } from '@/lib/lucide-icon-map'
import {
    Ticket,
} from 'lucide-react'
import { getFeaturedExperiencesByCategory } from '@/queries/experiences'
import { getCategoryBySlug } from '@/queries/categories'

// Categorías que muestran experiencias reales desde la DB
const RECOMMENDATION_SLUGS = new Set([
    // DB-native slugs
    'food', 'party', 'culture', 'tours', 'sea', 'wellness', 'ride', 'stay', 'sports', 'shopping',
    // Legacy slugs (kept for backward compat)
    'restaurants', 'night-life', 'attractions',
])

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string, categorySlug: string }>
}) {
    const { slug, categorySlug } = await params
    const destination = await getDestinationBySlug(slug)

    let categoryName = 'Info'
    if (destination) {
        const dbCategory = await getDestinationInfoCategory(destination.id, categorySlug)
        if (dbCategory) {
            categoryName = dbCategory.title
        }
    }

    return {
        title: `${categoryName} - ${destination?.name || 'Destino'}`,
    }
}

export default async function DestinationCategoryInfoPage({
    params,
}: {
    params: Promise<{ slug: string, categorySlug: string }>
}) {
    const { slug, categorySlug } = await params
    const destination = await getDestinationBySlug(slug)

    if (!destination) notFound()

    const isRecommendation = RECOMMENDATION_SLUGS.has(categorySlug)

    // For recommendation categories fetch real experiences from DB
    const dbCategory = isRecommendation ? await getCategoryBySlug(categorySlug) : null
    const experiences = dbCategory ? await getFeaturedExperiencesByCategory(dbCategory.id) : []

    // For secure info, fetch from our new tables
    const infoCategory = !isRecommendation ? await getDestinationInfoCategory(destination.id, categorySlug) : null
    const infoItems = infoCategory ? await getDestinationInfoItems(infoCategory.id) : []

    if (!isRecommendation && !infoCategory) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center pb-24 px-6 text-center">
                <h1 className="text-2xl font-bold mb-4">Coming Soon</h1>
                <p className="text-muted-foreground mb-8">Information for &quot;{categorySlug}&quot; is not available yet.</p>
                <Link href={ROUTES.destinationInfo(slug)} className="flex items-center text-primary font-medium">
                    <ChevronLeft className="h-5 w-5 mr-1" /> Back to Info
                </Link>
            </div>
        )
    }

    const title = infoCategory ? infoCategory.title : dbCategory?.name || categorySlug
    const iconName = infoCategory ? infoCategory.icon : dbCategory?.icon || 'map-pin'
    const color = infoCategory ? infoCategory.color : 'text-teal-700'
    const subtitle = infoCategory ? infoCategory.subtitle : 'Must see places'

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
                    <DynamicIcon name={iconName} className={cn("h-12 w-12 mb-2", color)} strokeWidth={1.5} />
                    <h1 className="text-base text-slate-700 underline underline-offset-4 decoration-slate-400 uppercase">
                        {title}
                    </h1>
                </div>

                <h2 className="text-teal-700 font-semibold mb-6 text-center">{subtitle}</h2>
            </div>

            <main className="container mx-auto max-w-md md:max-w-3xl px-4">
                {isRecommendation ? (
                    experiences.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {experiences.map((exp) => {
                                const formattedPrice = new Intl.NumberFormat('es-MX', {
                                    style: 'currency',
                                    currency: exp.price_currency || 'MXN',
                                    minimumFractionDigits: 0,
                                }).format(Number(exp.price_amount))

                                return (
                                    <div key={exp.id} className="flex bg-white rounded-xl border shadow-sm p-4 gap-4">
                                        {/* Image */}
                                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                                            {exp.cover_image_url ? (
                                                <img
                                                    src={exp.cover_image_url}
                                                    alt={exp.title}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="h-full w-full bg-slate-100" />
                                            )}
                                        </div>

                                        {/* Content */}
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
                            <DynamicIcon name={iconName} className={cn("h-12 w-12 mb-3 opacity-20", color)} strokeWidth={1} />
                            <p className="text-sm text-muted-foreground">No hay experiencias disponibles aun</p>
                        </div>
                    )
                ) : (
                    /* Static info content */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {infoItems.map((item, idx) => {
                            if (categorySlug === 'local-tips') {
                                return (
                                    <LocalTipCard
                                        key={idx}
                                        title={item.title}
                                        author={item.author || ''}
                                        date={item.date || ''}
                                        description={item.description}
                                        images={item.images_count || undefined}
                                    />
                                )
                            }
                            return (
                                <InfoCard
                                    key={idx}
                                    title={item.title}
                                    description={item.description}
                                    actions={item.actions}
                                />
                            )
                        })}
                    </div>
                )}
            </main>
        </div>
    )
}
