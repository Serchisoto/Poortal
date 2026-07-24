import { ChevronDown } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { getCategoryBySlug, getSubcategoryBySlug } from '@/queries/categories'
import { searchExperiences } from '@/queries/experiences'
import { BackButton } from '../../restaurants/back-button'

export const metadata = {
    title: 'Cultural Experiences - POORTAL',
}

export default async function CultureExperiencesPage() {
    const [category, subcategory] = await Promise.all([
        getCategoryBySlug('culture'),
        getSubcategoryBySlug('culture-exp'),
    ])
    const experiences = category
        ? await searchExperiences({ categoryId: category.id, subcategoryId: subcategory?.id })
        : []

    return (
        <div className="min-h-screen bg-white flex flex-col relative pb-10">
            <div className="flex items-center justify-between px-6 pt-6 pb-4 bg-white sticky top-0 z-10">
                <BackButton />
                <div className="border border-slate-200 bg-white rounded-full px-8 py-3 shadow-sm absolute left-1/2 -translate-x-1/2">
                    <h1 className="text-sm font-bold text-slate-800 tracking-wide uppercase">
                        EXPERIENCES
                    </h1>
                </div>
            </div>

            <main className="container mx-auto max-w-md px-6 flex flex-col items-center mt-2">

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

                <div className="w-full grid grid-cols-2 gap-3 pb-8">
                    {experiences.map((exp) => (
                        <Link
                            href={`/culture/shows/${exp.id}`}
                            key={exp.id}
                            className="aspect-[4/5] rounded-xl overflow-hidden bg-orange-900 relative shadow-sm active:scale-95 transition-transform border border-orange-800/30"
                        >
                            {exp.cover_image_url ? (
                                <Image src={exp.cover_image_url} alt={exp.title} fill className="object-cover opacity-80" />
                            ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-orange-700 via-amber-600 to-yellow-700" />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-br flex flex-col justify-end p-3 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent">
                                <span className="text-rose-100 font-serif text-sm leading-tight uppercase tracking-widest drop-shadow-md line-clamp-2">
                                    {exp.title}
                                </span>
                                <span className="text-amber-300 font-bold text-[10px] uppercase tracking-wide mt-1">
                                    {new Intl.NumberFormat('es-MX', { style: 'currency', currency: exp.price_currency || 'MXN', maximumFractionDigits: 0 }).format(Number(exp.price_amount))}
                                    <span className="font-normal opacity-70 ml-0.5">{exp.pricing_type === 'per_person' ? '/px' : '/grupo'}</span>
                                </span>
                            </div>
                        </Link>
                    ))}

                    {experiences.length === 0 && (
                        <div className="col-span-2 py-16 text-center text-slate-500">
                            No cultural experiences available right now.
                        </div>
                    )}
                </div>

            </main>
        </div>
    )
}
