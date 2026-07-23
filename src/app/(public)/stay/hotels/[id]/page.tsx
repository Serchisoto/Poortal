'use client'

import { useParams, useRouter } from 'next/navigation'
import { ChevronLeft, Share2, Heart } from 'lucide-react'

export default function HotelDetailPage() {
    const router = useRouter()
    const { id } = useParams()

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col relative pb-10">
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 bg-white sticky top-0 z-10">
                <button
                    onClick={() => router.back()}
                    className="p-2 -ml-2 text-slate-900 active:scale-95 transition-transform"
                >
                    <ChevronLeft className="h-8 w-8" strokeWidth={3} />
                </button>
                <div className="border border-slate-200 bg-white rounded-full px-8 py-2.5 shadow-sm absolute left-1/2 -translate-x-1/2 whitespace-nowrap overflow-hidden">
                    <h1 className="text-sm font-bold text-slate-800 tracking-wide uppercase truncate max-w-[150px]">
                        GRAND HOTEL
                    </h1>
                </div>
            </div>

            <main className="container mx-auto max-w-md px-6 flex flex-col items-center">

                {/* Hero Image Block */}
                <div className="w-full relative rounded-xl overflow-hidden shadow-sm bg-slate-300 mt-2 mb-4" style={{ height: '380px' }}>
                    <div className="absolute inset-0 bg-slate-800/20 mix-blend-multiply"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

                    {/* Content over image */}
                    <div className="absolute inset-x-0 bottom-0 p-5 flex flex-col pointer-events-none">
                        <div className="flex items-start justify-between gap-4 pointer-events-auto">
                            <div className="flex-1 text-white">
                                <h2 className="text-base font-bold mb-1">Luxury Suite</h2>
                                <p className="text-xs text-slate-200 leading-snug line-clamp-3">
                                    Lorem Imposum Lorem Imposum Lorem Imposum Lore Imposum Lorem Imposum Lorem Imposum Lorem Imp Lorem Imposum Lorem Imposum <span className="underline font-bold ml-1 cursor-pointer">... more</span>
                                </p>
                            </div>
                            <div className="shrink-0 flex items-end h-full">
                                <button className="active:scale-95 transition-transform pb-1">
                                    <Heart className="h-6 w-6 text-white" />
                                </button>
                            </div>
                        </div>
                        {/* Pagination Dots */}
                        <div className="flex justify-center gap-1.5 mt-4">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                            <div className="w-2.5 h-2.5 rounded-full border border-slate-300/80"></div>
                            <div className="w-2.5 h-2.5 rounded-full border border-slate-300/80"></div>
                            <div className="w-2.5 h-2.5 rounded-full border border-slate-300/80"></div>
                        </div>
                    </div>
                </div>

                {/* Primary Action Button (Book) */}
                <div className="flex justify-center -mt-2 mb-6">
                    <button
                        onClick={() => router.push(`/stay/hotels/${id}/book`)}
                        className="flex items-center justify-center gap-2 bg-[#2b666a] text-white rounded-md px-10 py-3 active:scale-95 transition-transform shadow-md"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                            <rect width="18" height="14" x="3" y="5" rx="2" ry="2" />
                            <path d="M7 5v14" />
                            <path d="M17 5v14" />
                            <path d="M10 10h4" />
                            <path d="M10 14h4" />
                        </svg>
                        <span className="text-sm font-semibold">Book</span>
                    </button>
                </div>

                {/* Info Card Block */}
                <div className="w-full bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col gap-5">

                    {/* Header Row */}
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                            <h3 className="font-bold text-sm text-slate-700 uppercase tracking-wide">
                                GRAND HOTEL
                            </h3>
                            <span className="font-bold text-sm text-slate-800 tracking-wide">
                                $$$
                            </span>
                        </div>
                        <div className="text-[10px] text-slate-600 font-medium text-right leading-tight">
                            Check in: 3PM<br />Check out: 12PM
                        </div>
                    </div>

                    {/* General Description */}
                    <div>
                        <h4 className="text-xs font-semibold text-slate-800 mb-2">Description</h4>
                        <div className="flex flex-col gap-2">
                            <div className="w-full h-3.5 bg-slate-100 rounded-full"></div>
                            <div className="w-full h-3.5 bg-slate-100 rounded-full"></div>
                            <div className="w-[90%] h-3.5 bg-slate-100 rounded-full"></div>
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="mt-2">
                        <h4 className="text-xs font-semibold text-slate-800 mb-2">Amenities</h4>
                        <div className="w-full h-3.5 bg-slate-100 rounded-full"></div>
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
                                map
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
