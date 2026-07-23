import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft, Share2, Heart } from 'lucide-react'
import { getExperienceById } from '@/queries/experiences'
import { ImageCarousel } from '@/components/shared/image-carousel'

export default async function SpaDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const experience = await getExperienceById(id)

    if (!experience) {
        notFound()
    }

    const formattedPrice = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: experience.price_currency || 'MXN',
    }).format(Number(experience.price_amount))

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col relative pb-10">
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 bg-white sticky top-0 z-10">
                <Link
                    href="/wellness/spa"
                    className="p-2 -ml-2 text-slate-900 active:scale-95 transition-transform"
                >
                    <ChevronLeft className="h-8 w-8" strokeWidth={3} />
                </Link>
                <div className="border border-slate-200 bg-white rounded-full px-8 py-2.5 shadow-sm absolute left-1/2 -translate-x-1/2 whitespace-nowrap overflow-hidden">
                    <h1 className="text-sm font-bold text-slate-800 tracking-wide uppercase truncate max-w-[150px]">
                        {experience.title}
                    </h1>
                </div>
            </div>

            <main className="container mx-auto max-w-md px-6 flex flex-col items-center">

                {/* Hero Image Block */}
                <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-sm mt-2 mb-4">
                    {experience.experience_images && experience.experience_images.length > 0 ? (
                        <ImageCarousel
                            images={experience.experience_images}
                            className="h-full w-full rounded-none"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-emerald-50 border border-emerald-100 flex flex-col items-center justify-center p-3 text-center">
                            <div className="absolute inset-0 bg-emerald-900/10 mix-blend-multiply"></div>
                            {/* Simple text fallback */}
                            <span className="text-emerald-800 font-bold text-xl uppercase z-10 drop-shadow-sm">{experience.title}</span>
                        </div>
                    )}

                    {/* Gradient overlay for bottom text */}
                    <div className="absolute inset-x-0 bottom-0 pb-6 pt-20 px-6 bg-gradient-to-t from-black/80 to-transparent pointer-events-none flex flex-col gap-2">
                        <h2 className="text-white text-xl font-bold drop-shadow-md">{experience.title}</h2>
                        <p className="text-white/90 text-xs leading-snug max-w-[90%] font-medium drop-shadow-md line-clamp-3">
                            {experience.short_description}
                        </p>
                        <div className="absolute bottom-6 right-6 pointer-events-auto">
                            <button className="text-white active:scale-95 transition-transform">
                                <Heart className="h-7 w-7" strokeWidth={2} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Primary Action Button (Book) */}
                <div className="flex justify-center -mt-2 mb-6 w-full">
                    <Link
                        href={`/wellness/spa/${id}/book`}
                        className="flex items-center justify-center gap-2 bg-[#2b666a] text-white rounded-md px-10 py-3 active:scale-95 transition-transform shadow-md w-[80%]"
                    >
                        {/* Custom Ticket/Book SVG */}
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                            <rect width="18" height="14" x="3" y="5" rx="2" ry="2" />
                            <path d="M7 5v14" />
                            <path d="M17 5v14" />
                            <path d="M10 10h4" />
                            <path d="M10 14h4" />
                        </svg>
                        <span className="text-sm font-semibold tracking-wide">Book</span>
                    </Link>
                </div>

                {/* Info Card Block */}
                <div className="w-full bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col gap-5">

                    {/* Header Row */}
                    <div className="flex justify-between items-start">
                        <div className="flex flex-col gap-1">
                            <h3 className="font-bold text-sm text-slate-700 uppercase tracking-wide leading-tight">
                                {experience.title}
                            </h3>
                            <span className="font-bold text-sm text-slate-800 tracking-wide">
                                {formattedPrice}
                                <span className="text-xs text-slate-500 font-normal ml-1">
                                    {experience.pricing_type === 'per_person' ? '/ px' : '/ group'}
                                </span>
                            </span>
                        </div>
                        <div className="text-[10px] text-slate-600 font-medium text-right leading-tight break-words max-w-[40%]">
                            {experience.duration_minutes ? `${Math.floor(experience.duration_minutes / 60)}h ${experience.duration_minutes % 60}m` : 'Varies'} <br />
                        </div>
                    </div>

                    {/* General Description */}
                    <div>
                        <h4 className="text-xs font-semibold text-slate-800 mb-2">General description</h4>
                        <div className="text-[11px] text-slate-600 leading-relaxed font-medium">
                            {experience.description || "No description available."}
                        </div>
                    </div>

                    {/* Location Footer */}
                    <div className="flex items-center justify-between mt-6">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center -ml-1">
                                <span className="text-slate-700 text-[10px] m-auto mb-1 font-bold">📍</span>
                            </div>
                            <span className="text-xs text-slate-700">Hotel Zone, Cancun</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="text-[11px] font-semibold text-slate-800 underline decoration-slate-800 underline-offset-2">
                                more info
                            </button>
                            <button className="text-teal-700 active:scale-95 transition-transform ml-2">
                                <Share2 className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                </div>

            </main>
        </div>
    )
}
