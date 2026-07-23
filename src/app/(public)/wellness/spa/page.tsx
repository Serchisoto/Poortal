import { ChevronDown } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { getCategoryBySlug } from '@/queries/categories'
import { searchExperiences } from '@/queries/experiences'
import { BackButton } from '../../restaurants/back-button'

export const metadata = {
    title: 'Spa Services - POORTAL',
}

export default async function SpaSearchPage() {
    const category = await getCategoryBySlug('spa')
    const experiences = category ? await searchExperiences({ categoryId: category.id }) : []

    return (
        <div className="min-h-screen bg-white flex flex-col relative pb-10">
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 bg-white sticky top-0 z-10">
                <BackButton />
                <div className="border border-slate-200 bg-white rounded-full px-10 py-3 shadow-sm absolute left-1/2 -translate-x-1/2">
                    <h1 className="text-sm font-bold text-slate-800 tracking-wide uppercase">
                        SPA SERVICES
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
                    {experiences.map((exp) => (
                        <Link
                            href={`/wellness/spa/${exp.id}`}
                            key={exp.id}
                            className="aspect-square rounded-xl overflow-hidden bg-emerald-50 relative shadow-sm active:scale-95 transition-transform border border-emerald-100"
                        >
                            {exp.cover_image_url ? (
                                <Image
                                    src={exp.cover_image_url}
                                    alt={exp.title}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <>
                                    <div className="absolute inset-0 bg-emerald-700/10 mix-blend-multiply"></div>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center text-emerald-700">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2 h-8 w-8">
                                            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                                        </svg>
                                    </div>
                                </>
                            )}

                            {/* Overlay gradient strictly for title legibility */}
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-emerald-900/80 to-transparent p-2 pt-6 flex flex-col justify-end">
                                <span className="font-bold text-[10px] text-white uppercase drop-shadow-md leading-tight line-clamp-2">
                                    {exp.title}
                                </span>
                            </div>
                        </Link>
                    ))}

                    {experiences.length === 0 && (
                        <div className="col-span-2 py-12 text-center text-slate-500">
                            No spa services available right now.
                        </div>
                    )}
                </div>

            </main>
        </div>
    )
}
