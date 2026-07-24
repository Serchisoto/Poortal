import { ChevronDown } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { getCategoryBySlug, getSubcategoryBySlug } from '@/queries/categories'
import { searchExperiences } from '@/queries/experiences'
import { BackButton } from '../../restaurants/back-button'

export const metadata = {
    title: 'Soccer Field - POORTAL',
}

export default async function SoccerSearchPage() {
    const [category, subcategory] = await Promise.all([
        getCategoryBySlug('sports'),
        getSubcategoryBySlug('soccer'),
    ])
    const experiences = category
        ? await searchExperiences({ categoryId: category.id, subcategoryId: subcategory?.id })
        : []

    return (
        <div className="min-h-screen bg-white flex flex-col relative pb-10">
            <div className="flex items-center justify-between px-6 pt-6 pb-4 bg-white sticky top-0 z-10">
                <BackButton />
                <div className="border border-slate-200 bg-white rounded-full px-10 py-3 shadow-sm absolute left-1/2 -translate-x-1/2">
                    <h1 className="text-sm font-bold text-slate-800 tracking-wide uppercase">SOCCER FIELD</h1>
                </div>
            </div>
            <main className="container mx-auto max-w-md px-6 flex flex-col items-center mt-2">
                <div className="w-full flex items-center gap-3 mb-6">
                    <button className="flex items-center gap-2 bg-[#1b6d72] text-white rounded-full px-4 py-1.5 text-sm font-medium shadow-sm active:scale-95 transition-transform">
                        Order A-Z <ChevronDown className="h-4 w-4 opacity-80" strokeWidth={3} />
                    </button>
                    <button className="flex items-center gap-2 bg-white border border-slate-300 text-primary rounded-full px-4 py-1.5 text-sm font-medium shadow-sm active:scale-95 transition-transform">
                        Budget <ChevronDown className="h-4 w-4 opacity-80" strokeWidth={3} />
                    </button>
                </div>
                <div className="w-full flex flex-col gap-4 pb-8">
                    {experiences.map((exp) => (
                        <Link href={`/experience/${exp.id}`} key={exp.id} className="w-full bg-white rounded-2xl overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.06)] active:scale-[0.98] transition-all border border-slate-100">
                            <div className="h-36 bg-green-50 relative w-full overflow-hidden">
                                {exp.cover_image_url ? (
                                    <Image src={exp.cover_image_url} alt={exp.title} fill className="object-cover" />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-green-700/10">
                                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1b6d72" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="m4.93 4.93 4.24 4.24" /><path d="m14.83 9.17 4.24-4.24" /><path d="m14.83 14.83 4.24 4.24" /><path d="m9.17 14.83-4.24 4.24" /><circle cx="12" cy="12" r="4" /></svg>
                                    </div>
                                )}
                                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 to-transparent pointer-events-none">
                                    <h3 className="text-white font-bold text-sm leading-tight drop-shadow-md">{exp.title}</h3>
                                </div>
                            </div>
                            <div className="px-4 py-3 flex items-center justify-between">
                                <span className="font-semibold text-sm text-slate-800">
                                    {new Intl.NumberFormat('es-MX', { style: 'currency', currency: exp.price_currency || 'MXN', maximumFractionDigits: 0 }).format(Number(exp.price_amount))}
                                    <span className="text-xs text-slate-500 font-normal ml-1">{exp.pricing_type === 'per_person' ? 'p.p.' : '/grupo'}</span>
                                </span>
                                <span className="text-xs text-slate-500">★ {Number(exp.average_rating).toFixed(1)}</span>
                            </div>
                        </Link>
                    ))}
                    {experiences.length === 0 && (
                        <div className="flex flex-col items-center py-16 text-center">
                            <h2 className="text-5xl font-bold text-[#1b6d72] mb-4 lowercase">ups!</h2>
                            <p className="text-sm font-semibold text-[#1b6d72]">No soccer fields available right now.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
