import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft, Share2, Heart, Ticket, MapPin } from 'lucide-react'
import { getExperienceById } from '@/queries/experiences'
import { ImageCarousel } from '@/components/shared/image-carousel'

export default async function TourDetailPage({
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

    const isPerPerson = experience.pricing_type === 'per_person'

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col relative pb-10">
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 bg-white sticky top-0 z-10 shadow-sm border-b border-slate-100">
                <Link
                    href={`/tours`}
                    className="p-2 -ml-2 text-slate-900 active:scale-95 transition-transform"
                >
                    <ChevronLeft className="h-8 w-8" strokeWidth={3} />
                </Link>
                <div className="border border-slate-200 bg-white rounded-full px-8 py-2.5 shadow-sm absolute left-1/2 -translate-x-1/2">
                    <h1 className="text-sm font-bold text-slate-800 tracking-wide uppercase line-clamp-1 max-w-[150px] text-center">
                        {experience.title}
                    </h1>
                </div>
                <div className="w-8"></div>
            </div>

            <main className="container mx-auto max-w-md px-6 flex flex-col items-center mt-4">

                {/* Hero Image Block */}
                <div className="w-full relative rounded-2xl overflow-hidden shadow-sm aspect-[4/5] bg-slate-200 mb-6">
                    {experience.experience_images && experience.experience_images.length > 0 ? (
                        <ImageCarousel
                            images={experience.experience_images}
                            className="h-full w-full rounded-none"
                        />
                    ) : (
                        <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                            <MapPin className="h-10 w-10 text-slate-400" />
                        </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-x-0 bottom-0 pb-6 pt-20 px-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none flex flex-col gap-2">
                        <div className="flex items-start justify-between gap-4 pointer-events-auto">
                            <div className="flex-1 flex flex-col gap-2">
                                <h2 className="text-white text-xl font-bold drop-shadow-md leading-tight">{experience.title}</h2>
                                <p className="text-white/90 text-xs leading-snug font-medium drop-shadow-md line-clamp-3">
                                    {experience.short_description}
                                </p>
                            </div>
                            <div className="shrink-0 flex items-end h-full mt-1">
                                <button className="active:scale-95 transition-transform bg-black/20 p-2 rounded-full backdrop-blur-md">
                                    <Heart className="h-6 w-6 text-white" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Primary Action Button (Book) */}
                <div className="flex justify-center -mt-10 mb-6 relative z-10 w-full">
                    <Link
                        href={`/tours/${id}/book`}
                        className="flex items-center justify-center gap-2 bg-[#2b666a] text-white rounded-full px-10 py-3.5 active:scale-95 transition-transform shadow-lg w-[80%]"
                    >
                        {/* Custom SVG closest to the exact ticket icon in mockup */}
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                            <rect width="18" height="14" x="3" y="5" rx="2" ry="2" />
                            <path d="M7 5v14" />
                            <path d="M17 5v14" />
                            <path d="M10 10h4" />
                            <path d="M10 14h4" />
                        </svg>
                        <span className="text-sm font-semibold tracking-wide">BOOK TOUR</span>
                    </Link>
                </div>

                {/* Info Card Block */}
                <div className="w-full bg-white rounded-2xl border border-slate-100 p-6 shadow-[0_2px_10px_rgba(0,0,0,0.04)] flex flex-col gap-5">

                    {/* Header Row */}
                    <div className="flex justify-between items-start gap-4">
                        <div className="flex flex-col gap-1 flex-1">
                            <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wide">
                                {experience.title}
                            </h3>
                            <div className="flex items-center gap-1.5">
                                <span className="font-bold text-lg text-[#2b666a]">{formattedPrice}</span>
                                {isPerPerson && <span className="text-[10px] text-slate-500 font-medium uppercase mt-1">p.p.</span>}
                            </div>
                        </div>
                        <div className="text-[10px] text-slate-600 font-medium text-right bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                            <div className="flex items-center gap-1 justify-end">
                                <span className="text-yellow-500 text-sm">★</span>
                                <span className="text-slate-800 font-bold text-sm">{Number(experience.average_rating).toFixed(1)}</span>
                            </div>
                            <div className="mt-0.5">({experience.review_count} reviews)</div>
                        </div>
                    </div>

                    {/* General Description */}
                    <div className="flex flex-col gap-2">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">About this tour</h4>
                        <p className="text-sm text-slate-700 leading-relaxed">
                            {experience.description || "No detailed description available."}
                        </p>
                    </div>

                    {/* Divider */}
                    <hr className="border-slate-100" />

                    {/* Location Footer */}
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                                <MapPin className="h-4 w-4 text-[#2b666a]" />
                            </div>
                            <div className="flex flex-col gap-1 mt-0.5">
                                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Meeting Point</span>
                                <span className="text-sm text-slate-700 leading-snug">
                                    {experience.meeting_point || "Location not specified"}
                                </span>
                            </div>
                        </div>
                        <button className="text-[#2b666a] bg-teal-50/50 p-2.5 rounded-full active:scale-95 transition-transform mt-1 shrink-0">
                            <Share2 className="h-4 w-4" strokeWidth={2.5} />
                        </button>
                    </div>
                </div>
            </main>
        </div>
    )
}
