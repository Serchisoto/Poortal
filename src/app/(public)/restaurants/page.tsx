import { ChevronDown, MapPin } from 'lucide-react'
import Link from 'next/link'
import { getCategoryBySlug } from '@/queries/categories'
import { searchExperiences } from '@/queries/experiences'
import { BackButton } from './back-button'
import Image from 'next/image'

export const metadata = {
    title: 'Restaurants - POORTAL',
}

export default async function RestaurantsSearchPage() {
    // Fetch the "restaurantes" category to get its ID
    const category = await getCategoryBySlug('restaurantes')

    // Fetch experiences for the food category (or empty if not found)
    const restaurants = category
        ? await searchExperiences({ categoryId: category.id })
        : []

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col relative pb-10">
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 bg-white sticky top-0 z-10 shadow-sm border-b border-slate-100">
                <BackButton />
                <div className="border border-slate-200 bg-white rounded-full px-10 py-3 shadow-sm absolute left-1/2 -translate-x-1/2">
                    <h1 className="text-sm font-bold text-slate-800 tracking-wide uppercase">
                        RESTAURANTS
                    </h1>
                </div>
                <div className="w-8"></div>
            </div>

            <main className="container mx-auto max-w-md px-6 flex flex-col items-center mt-6">

                {/* Filter Row */}
                <div className="w-full flex items-center gap-3 mb-6">
                    <button className="flex items-center gap-2 bg-[#1b6d72] text-white rounded-full px-4 py-1.5 text-sm font-medium shadow-sm active:scale-95 transition-transform">
                        Order A-Z
                        <ChevronDown className="h-4 w-4 opacity-80" strokeWidth={3} />
                    </button>
                    <button className="flex items-center gap-2 bg-white border border-slate-300 text-teal-700 rounded-full px-4 py-1.5 text-sm font-medium shadow-sm active:scale-95 transition-transform">
                        Budget
                        <ChevronDown className="h-4 w-4 opacity-80" strokeWidth={3} />
                    </button>
                </div>

                {/* List Container */}
                <div className="w-full flex flex-col gap-5 pb-8">
                    {restaurants.length === 0 ? (
                        <div className="flex flex-col items-center py-16 text-center">
                            <MapPin className="h-12 w-12 text-slate-300 mb-4" />
                            <p className="text-slate-500">
                                No restaurants found in this category.
                            </p>
                        </div>
                    ) : null}

                    {restaurants.map((restaurant) => (
                        <Link
                            href={`/restaurants/${restaurant.id}`}
                            key={restaurant.id}
                            className="w-full bg-white rounded-2xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.06)] active:scale-[0.98] transition-all border border-slate-100"
                        >
                            {/* Image Header */}
                            <div className="h-40 bg-slate-200 relative w-full overflow-hidden">
                                {restaurant.cover_image_url ? (
                                    <Image
                                        src={restaurant.cover_image_url}
                                        alt={restaurant.title}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-slate-300">
                                        <MapPin className="h-6 w-6 text-slate-400" />
                                    </div>
                                )}
                                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex flex-col pointer-events-none">
                                    <h3 className="text-white font-bold text-lg mb-1 leading-none uppercase drop-shadow-md">
                                        {restaurant.title}
                                    </h3>
                                    <p className="text-white/90 text-xs leading-snug drop-shadow-sm font-medium line-clamp-2">
                                        {restaurant.short_description}
                                    </p>
                                </div>
                                {/* Mock dots (UI flair) */}
                                <div className="absolute right-4 bottom-4 flex gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-white/50"></div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-white/50"></div>
                                </div>
                            </div>

                            {/* Card Footer Info */}
                            <div className="p-4 flex items-center justify-between bg-white text-slate-800">
                                <span className="font-semibold text-sm">
                                    {new Intl.NumberFormat('es-MX', { style: 'currency', currency: restaurant.price_currency }).format(restaurant.price_amount)}
                                    <span className="text-xs text-slate-500 ml-1 font-normal">
                                        {restaurant.pricing_type === 'per_person' ? 'p.p.' : ''}
                                    </span>
                                </span>
                                <span className="text-xs font-medium text-slate-500 uppercase flex items-center gap-1">
                                    ★ {Number(restaurant.average_rating).toFixed(1)}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

            </main>
        </div>
    )
}
