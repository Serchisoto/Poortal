'use client'

import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronDown } from 'lucide-react'
import Link from 'next/link'

export default function HotelsSearchPage() {
    const router = useRouter()

    return (
        <div className="min-h-screen bg-white flex flex-col relative pb-10">
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 bg-white sticky top-0 z-10">
                <button
                    onClick={() => router.back()}
                    className="p-2 -ml-2 text-slate-900 active:scale-95 transition-transform"
                >
                    <ChevronLeft className="h-8 w-8" strokeWidth={3} />
                </button>
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
                    <button className="flex items-center gap-2 bg-white border border-slate-300 text-teal-700 rounded-full px-4 py-1.5 text-sm font-medium shadow-sm active:scale-95 transition-transform">
                        Budget
                        <ChevronDown className="h-4 w-4 opacity-80" strokeWidth={3} />
                    </button>
                </div>

                {/* Grid Container */}
                <div className="w-full grid grid-cols-2 gap-3 pb-8">
                    {/* Mock repeating the same hotel image 6 times */}
                    {[1, 2, 3, 4, 5, 6].map((idx) => (
                        <Link
                            href={`/stay/hotels/${idx}`}
                            key={idx}
                            className="aspect-square rounded-xl overflow-hidden bg-slate-200 relative shadow-sm active:scale-95 transition-transform"
                        >
                            <div className="absolute inset-0 bg-slate-300 mix-blend-multiply"></div>
                            {/* Generic Hotel Placeholder */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center text-slate-500">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2 h-8 w-8">
                                    <path d="M10 22v-6.57" /><path d="M12 11h.01" /><path d="M12 7h.01" /><path d="M14 15.43V22" /><path d="M15 22a5.36 5.36 0 0 0-2-4.6 5.36 5.36 0 0 0-2 4.6" /><path d="M16 11h.01" /><path d="M16 7h.01" /><path d="M4 22V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16" /><path d="M8 11h.01" /><path d="M8 7h.01" />
                                </svg>
                                <span className="font-bold text-xs uppercase opacity-70">
                                    Grand Hotel {idx}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

            </main>
        </div>
    )
}
