import { ChevronDown } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { getCategoryBySlug, getSubcategoryBySlug } from '@/queries/categories'
import { searchExperiences } from '@/queries/experiences'
import { BackButton } from '../../restaurants/back-button'

export const metadata = {
    title: 'Expeditions - POORTAL',
}

export default async function ExpeditionsPage() {
    const [category, subcategory] = await Promise.all([
        getCategoryBySlug('sea'),
        getSubcategoryBySlug('expeditions'),
    ])
    const experiences = category
        ? await searchExperiences({ categoryId: category.id, subcategoryId: subcategory?.id })
        : []

    return (
        <div className="min-h-screen bg-white flex flex-col relative pb-10">
            <div className="flex items-center justify-between px-6 pt-6 pb-4 bg-white sticky top-0 z-10">
                <BackButton />
                <div className="border border-slate-200 bg-white rounded-full px-10 py-3 shadow-sm absolute left-1/2 -translate-x-1/2">
                    <h1 className="text-sm font-bold text-slate-800 tracking-wide uppercase">
                        EXPEDITIONS
                    </h1>
                </div>
            </div>

            <main className="container mx-auto max-w-md px-6 flex flex-col items-center mt-2">

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

                <div className="w-full grid grid-cols-2 gap-3 pb-8">
                    {experiences.map((exp) => (
                        <Link
                            href={`/experience/${exp.id}`}
                            key={exp.id}
                            className="aspect-[4/5] rounded-xl overflow-hidden bg-sky-900 relative shadow-sm active:scale-95 transition-transform"
                        >
                            {exp.cover_image_url ? (
                                <Image src={exp.cover_image_url} alt={exp.title} fill className="object-cover opacity-80" />
                            ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-sky-800 via-teal-700 to-cyan-600" />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-3">
                                <span className="text-white font-bold text-sm leading-tight drop-shadow-md line-clamp-2">{exp.title}</span>
                                <span className="text-cyan-300 font-bold text-xs mt-1">
                                    {new Intl.NumberFormat('es-MX', { style: 'currency', currency: exp.price_currency || 'MXN', maximumFractionDigits: 0 }).format(Number(exp.price_amount))}
                                    <span className="opacity-70 font-normal ml-0.5">{exp.pricing_type === 'per_person' ? '/px' : '/grupo'}</span>
                                </span>
                            </div>
                        </Link>
                    ))}

                    {experiences.length === 0 && (
                        <div className="col-span-2 py-16 text-center text-slate-500">
                            No expeditions available right now.
                        </div>
                    )}
                </div>

            </main>
        </div>
    )
}
