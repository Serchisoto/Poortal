'use client'

import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronDown, MessageCircle } from 'lucide-react'

export default function SportsGolfEmptyPage() {
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
                <div className="border border-slate-200 bg-white rounded-full px-12 py-3 shadow-sm absolute left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <h1 className="text-sm font-bold text-slate-800 tracking-wide uppercase truncate">
                        GOLF GREEN
                    </h1>
                </div>
            </div>

            <main className="container mx-auto max-w-md px-6 flex flex-col items-center mt-2 flex-grow">

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

                {/* Empty State Content */}
                <div className="flex-grow flex flex-col items-center justify-center w-full -mt-20">
                    <h2 className="text-5xl font-bold text-[#1b6d72] mb-8 lowercase text-center">
                        ups!
                    </h2>

                    <p className="text-sm font-semibold text-[#1b6d72] text-center mb-1">
                        No Results Available
                    </p>
                    <p className="text-sm font-semibold text-[#1b6d72] text-center mb-12">
                        Please select another category
                    </p>

                    {/* Concierge Button */}
                    <button className="bg-[#1b6d72] hover:bg-teal-800 text-white rounded-full px-8 py-3 flex items-center gap-6 shadow-md active:scale-95 transition-all">
                        <span className="text-sm font-medium">concierge</span>
                        <div className="bg-white/10 rounded-full p-1 -mr-2">
                            <MessageCircle className="h-5 w-5" />
                        </div>
                    </button>
                </div>

            </main>
        </div>
    )
}
