import { ChevronDown } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { getCategoryBySlug, getSubcategoryBySlug } from '@/queries/categories'
import { searchExperiences } from '@/queries/experiences'
import { BackButton } from '../../restaurants/back-button'

export const metadata = {
    title: 'Hotels - POORTAL',
}

export default async function HotelsSearchPage() {
    const [category, subcategory] = await Promise.all([
        getCategoryBySlug('stay'),
        getSubcategoryBySlug('hotel'),
    ])
    const hotels = category
        ? await searchExperiences({ categoryId: category.id, subcategoryId: subcategory?.id })
        : []

    return (
        <div className="min-h-screen bg-white flex flex-col relative pb-10">
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 bg-white sticky top-0 z-10">
                <BackButton />
                <div className="border border-slate-200 bg-white rounded-full px-12 py-3 shadow-sm absolute left-1/2 -translate-x-1/2">
                    <h1 className="text-sm font-bold text-slate-800 tracking-wide uppercase">
                        HOTELS
                    </h1>
                </div>
            </div>

            <main className="container mx-auto max-w-md px-6 flex flex-col items-center mt-2">

                {/* Filter Row */}
                <div className="w-full flex items-center gap-3 mb-6">
                    <button className="flex items-center gap-2 bg-[#1b6d72] text-white rounded-full px-4 py-1.5 text-sm font-medium shadow-sm active:scale-95 transition-transform">
                        Order A-Z
                        <ChevronDown className="h-4 w-4 opacity-80" strokeWidth={3} />
                    </button>
                    <button className="flex items-center gap-2 bg-white border border-slate-300 text-primary rounded-full px-4 py-1.5 text-sm font-medium shadow-sm active:scale-95 transition-transform">
                        Budget
                        <ChevronDown className="h-4 w-4 opacity-80" strokeWidth={3} />
                    </button>
                </div>

                {/* Grid */}
                <div className="w-full grid grid-cols-2 gap-3 pb-8">
                    {hotels.map((hotel) => (
                        <Link
                            href={`/experience/${hotel.id}`}
                            key={hotel.id}
                            className="aspect-square rounded-xl overflow-hidden bg-slate-100 relative shadow-sm active:scale-95 transition-transform border border-slate-100"
                        >
                            {hotel.cover_image_url ? (
                                <Image
                                    src={hotel.cover_image_url}
                                    alt={hotel.title}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 p-2">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M10 22v-6.57" /><path d="M12 11h.01" /><path d="M12 7h.01" /><path d="M14 15.43V22" /><path d="M15 22a5.36 5.36 0 0 0-2-4.6 5.36 5.36 0 0 0-2 4.6" /><path d="M16 11h.01" /><path d="M16 7h.01" /><path d="M4 22V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16" /><path d="M8 11h.01" /><path d="M8 7h.01" />
                                    </svg>
                                </div>
                            )}
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 pt-8 flex flex-col justify-end">
                                <span className="font-bold text-[10px] text-white uppercase drop-shadow-md leading-tight line-clamp-2">
                                    {hotel.title}
                                </span>
                                <span className="text-teal-300 font-bold text-[10px] mt-0.5">
                                    {new Intl.NumberFormat('es-MX', { style: 'currency', currency: hotel.price_currency || 'MXN', maximumFractionDigits: 0 }).format(Number(hotel.price_amount))}
                                    <span className="font-normal opacity-80">/noche</span>
                                </span>
                            </div>
                        </Link>
                    ))}

                    {hotels.length === 0 && (
                        <div className="col-span-2 py-16 text-center text-slate-500">
                            No hotels available right now.
                        </div>
                    )}
                </div>

            </main>
        </div>
    )
}
