import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft, Heart, MapPin, Share2, Ticket } from 'lucide-react'
import { getExperienceById } from '@/queries/experiences'
import { ImageCarousel } from '@/components/shared/image-carousel'

export default async function RestaurantDetailPage({
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
        <div className="min-h-screen bg-slate-50 pb-24">
            {/* Minimal Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 bg-white sticky top-0 z-10 shadow-sm border-b border-slate-100">
                <Link
                    href="/restaurants"
                    className="p-2 -ml-2 text-slate-900 active:scale-95 transition-transform"
                >
                    <ChevronLeft className="h-8 w-8" strokeWidth={3} />
                </Link>
                <div className="border border-slate-200 bg-white rounded-full px-12 py-3 shadow-sm absolute left-1/2 -translate-x-1/2">
                    <h1 className="text-sm font-bold text-slate-800 tracking-wide uppercase line-clamp-1 max-w-[150px] text-center">
                        {experience.title}
                    </h1>
                </div>
                <div className="w-8"></div> {/* Spacer for centering */}
            </div>

            <main className="container mx-auto max-w-md px-6 flex flex-col gap-6 mt-4">
                {/* Hero Image Block */}
                <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-sm">
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

                {/* Primary Action Button */}
                <div className="flex justify-center -mt-2">
                    <Link
                        href={`/restaurants/${id}/book`}
                        className="flex items-center justify-center gap-2 bg-teal-800 text-white rounded-full px-10 py-3.5 active:scale-95 transition-transform shadow-md w-[80%]"
                    >
                        <Ticket className="h-5 w-5" />
                        <span className="text-sm font-semibold tracking-wide">RESERVATIONS</span>
                    </Link>
                </div>

                {/* Info Card Block */}
                <div className="flex flex-col bg-white rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.04)] p-5 w-full gap-5 mt-2">
                    {/* Card Header */}
                    <div className="flex justify-between items-start">
                        <div className="flex flex-col gap-1">
                            <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wide">
                                {experience.title}
                            </h3>
                            <div className="flex items-center gap-1.5">
                                <span className="font-bold text-lg text-teal-700">{formattedPrice}</span>
                                {isPerPerson && <span className="text-[10px] text-slate-500 font-medium uppercase mt-1">p.p.</span>}
                            </div>
                        </div>
                        <div className="text-[10px] text-right text-slate-500 font-medium bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                            <div className="flex items-center gap-1 justify-end">
                                <span className="text-yellow-500">★</span>
                                <span className="text-slate-700 font-bold">{Number(experience.average_rating).toFixed(1)}</span>
                            </div>
                            <div className="mt-0.5">({experience.review_count} reviews)</div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-2">
                        <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">About this place</div>
                        <p className="text-sm text-slate-700 leading-relaxed">
                            {experience.description || "No detailed description available."}
                        </p>
                    </div>

                    {/* Divider */}
                    <hr className="border-slate-100" />

                    {/* Location Footer */}
                    <div className="flex justify-between items-start gap-4">
                        <div className="flex items-start gap-3 flex-1">
                            <MapPin className="h-5 w-5 text-teal-700 shrink-0 mt-0.5" />
                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Location</span>
                                <span className="text-sm text-slate-700 leading-snug">
                                    {experience.meeting_point || "Location not specified"}
                                </span>
                            </div>
                        </div>
                        <button className="text-teal-600 bg-teal-50 p-2.5 rounded-full active:scale-95 transition-transform mt-2 shrink-0">
                            <Share2 className="h-4 w-4" strokeWidth={2.5} />
                        </button>
                    </div>
                </div>
            </main>
        </div>
    )
}
