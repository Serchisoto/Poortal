import { ChevronDown } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { getCategoryBySlug } from '@/queries/categories'
import { searchExperiences } from '@/queries/experiences'
import { BackButton } from '../restaurants/back-button'

export const metadata = {
    title: 'Nightlife - POORTAL',
}

export default async function NightlifeSearchPage() {
    const category = await getCategoryBySlug('night-life') // matching our db slug
    const experiences = category ? await searchExperiences({ categoryId: category.id }) : []

    return (
        <div className="min-h-screen bg-white flex flex-col relative pb-10">
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 bg-white sticky top-0 z-10">
                <BackButton />
                <div className="border border-slate-200 bg-white rounded-full px-12 py-3 shadow-sm absolute left-1/2 -translate-x-1/2">
                    <h1 className="text-sm font-bold text-slate-800 tracking-wide uppercase">
                        NIGHTLIFE
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
                    <button className="flex items-center gap-2 bg-white border border-slate-300 text-teal-700 rounded-full px-4 py-1.5 text-sm font-medium shadow-sm active:scale-95 transition-transform">
                        Budget
                        <ChevronDown className="h-4 w-4 opacity-80" strokeWidth={3} />
                    </button>
                </div>

                {/* Grid Container */}
                <div className="w-full grid grid-cols-2 gap-3 pb-8">
                    {experiences.map((exp) => {
                        return (
                            <Link
                                href={`/nightlife/${exp.id}`}
                                key={exp.id}
                                className="aspect-[4/5] rounded-xl overflow-hidden bg-slate-900 relative shadow-sm active:scale-95 transition-transform"
                            >
                                {exp.cover_image_url && (
                                    <Image
                                        src={exp.cover_image_url}
                                        alt={exp.title}
                                        fill
                                        className="object-cover opacity-80"
                                    />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent flex flex-col justify-end p-3">
                                    <span className="text-white font-bold text-sm leading-tight drop-shadow-md">
                                        {exp.title}
                                    </span>
                                    <div className="flex items-center gap-1 mt-1">
                                        <span className="text-teal-400 font-bold text-xs">
                                            {exp.price_currency === 'USD' ? '$' : `$${exp.price_amount} ${exp.price_currency}`}
                                            {/* We can map this better but fallback logic works */}
                                            {exp.price_currency === 'USD' ? exp.price_amount : ''}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                    {experiences.length === 0 && (
                        <div className="col-span-2 py-12 text-center text-slate-500">
                            No nightlife experiences available yet.
                        </div>
                    )}
                </div>

            </main>
        </div>
    )
}
